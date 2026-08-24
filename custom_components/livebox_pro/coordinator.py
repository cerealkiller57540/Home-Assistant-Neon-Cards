"""Coordinator for Livebox."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from aiosysbus import AIOSysbus
from aiosysbus.exceptions import AiosysbusException

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_PORT, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util.dt import DEFAULT_TIME_ZONE, UTC

from .const import (
    CONF_DISPLAY_DEVICES,
    CONF_LAN_TRACKING,
    CONF_USE_TLS,
    CONF_WIFI_TRACKING,
    DEFAULT_DISPLAY_DEVICES,
    DEFAULT_LAN_TRACKING,
    DEFAULT_WIFI_TRACKING,
    DOMAIN,
    REPEATER_BACKHAUL_INTF,
    REPEATER_DEVICE_TYPE,
    REPEATER_HOSTS,
    REPEATER_INTFS,
    REPEATER_VAPS,
)
from .helpers import find_item

_LOGGER = logging.getLogger(__name__)
# Fast tick: throughput (box vaps, fiber, repeater backhaul/bands) is recomputed
# every tick, so this is the refresh rate of every rx/tx sensor.
SCAN_INTERVAL = timedelta(seconds=30)
# Heavy/slow data (device list, DHCP leases, port-forwarding, call log, security
# config...) barely changes minute to minute and costs the most sysbus calls, so
# we only refresh it once every SLOW_EVERY fast ticks and reuse the previous
# values in between. 4 ticks * 30 s = every 2 min.
SLOW_EVERY = 4

# Pilotable private VAPs of this box (Sagemcom Fast5670E / Livebox 6), one per
# radio band. Secondary VAPs (vap2g0priv1...) and guest VAPs are left out on
# purpose: they mirror the main SSID and would only clutter the controls.
WIFI_VAPS = {
    "2.4GHz": "vap2g0priv0",
    "5GHz": "vap5g0priv0",
    "6GHz": "vap6g0priv0",
}

# HomeLan.getResults reports 0.0 for the per-SSID WiFi interfaces on this box
# (Sagemcom Fast5670E): the `Traffic` counters it exposes stay empty for the
# vaps, so the rate_rx/tx sensors built from it are dead (Chris' "stats rx/tx
# bidons"). The MQTT collector on .53 has the exact same blind spot.
# The counters that DO move are the cumulative RxBytes/TxBytes from
# NeMo.Intf.<vap>.getNetDevStats — so we compute an instantaneous rate from the
# byte delta between two coordinator ticks. Keys below MUST match the HomeLan
# interface names (INTF_LABELS on .53) so we overwrite the existing sensors
# in place instead of spawning duplicates.
WIFI_RATE_INTFS = {
    "2.4GHz-Private_SSID": "vap2g0priv0",
    "5GHz-Private_SSID": "vap5g0priv0",
    "6GHz-Private_SSID": "vap6g0priv0",
    "2.4GHz-Guest_SSID": "vap2g0priv1",
    "5GHz-Guest_SSID": "vap5g0priv1",
}


class LiveboxDataUpdateCoordinator(DataUpdateCoordinator):
    """Define an object to fetch data."""

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ConfigEntry,
    ) -> None:
        """Class to manage fetching data API."""
        super().__init__(hass, _LOGGER, name=DOMAIN, update_interval=SCAN_INTERVAL)
        self.config_entry = config_entry

        self.unique_id: str | None = None
        self.model: int | float | None = None
        # Previous getNetDevStats snapshot per WiFi vap, for rate computation:
        # {vap: (monotonic_ts, rx_bytes, tx_bytes)}.
        self._wifi_rate_prev: dict[str, tuple[float, int, int]] = {}
        # 2nd sysbus client to the WiFi 6 repeater (.47), lazily built once its
        # IP is known. Its own rate snapshots live in a separate dict.
        self.api_rep: AIOSysbus | None = None
        # One shared aiohttp session for every repeater client rebuild: creating
        # a new one per attempt (they stay open until HA stops) leaks a session
        # every 30 s tick while the repeater is unreachable.
        self._rep_session = None
        self._rep_host: str | None = None
        self._rep_serial: str | None = None
        self._rep_rate_prev: dict[str, tuple[float, int, int]] = {}
        # Per-station byte snapshot per repeater vap, for the REAL band rates:
        # {vap: (monotonic_ts, {mac: (tx_bytes, rx_bytes)})}. The vap netdev
        # counters miss driver/hardware-forwarded traffic (multicast->unicast
        # IPTV to the TV decoder: 1.4 MB/s invisible there, proven 2026-07-13);
        # the per-station AssociatedDevice counters see everything.
        self._rep_sta_prev: dict[str, tuple[float, dict[str, tuple[int, int]]]] = {}
        # Running totals (bytes) accumulated from those station deltas, per
        # vap: [down, up]. Reset to 0 on HA restart (TOTAL_INCREASING copes).
        self._rep_band_totals: dict[str, list[int]] = {}
        # Fast-tick counter: heavy data is refreshed only when this hits a
        # multiple of SLOW_EVERY, else the previous values are reused.
        self._tick = 0
        # Set by async_set_wps/async_set_wifi_mode so the NEXT tick fetches
        # wifi_security fresh instead of reusing the stale cached value (the
        # WPS/security switches used to look stuck after a toggle because
        # async_request_refresh() could land on a fast tick that just reused
        # `prev`).
        self._force_slow_refresh = False

    async def _async_setup(self) -> None:
        """Coordinator setup."""
        self.api = AIOSysbus(
            username=self.config_entry.data[CONF_USERNAME],
            password=self.config_entry.data[CONF_PASSWORD],
            session=async_create_clientsession(self.hass),
            host=self.config_entry.data[CONF_HOST],
            port=self.config_entry.data[CONF_PORT],
            use_tls=self.config_entry.data.get(CONF_USE_TLS, False),
        )

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data."""
        try:
            # Mandatory information
            infos = await self.async_get_infos()
            self.unique_id = infos["SerialNumber"]
            match infos["ProductClass"]:
                case "Livebox 3":
                    self.model = 3
                case "Livebox 4":
                    self.model = 4
                case "Livebox Fibre":
                    self.model = 5
                case "Livebox 6":
                    self.model = 6
                case "Livebox 7":
                    self.model = 7
                case "Livebox W7":
                    self.model = 7.1
                case "SMBSLBFIBRA":
                    self.model = 5656  # Sagemcom f@st 5656
                case "Livebox Nautilus":
                    self.model = 7.2
            # Two-speed refresh: throughput every tick (30 s), heavy data every
            # SLOW_EVERY ticks (2 min). On a fast-only tick we start from the
            # previous data and just overwrite the throughput fields.
            self._tick += 1
            prev = self.data or {}
            refresh_slow = (
                (not prev)
                or (self._tick % SLOW_EVERY == 0)
                or self._force_slow_refresh
            )
            self._force_slow_refresh = False

            if refresh_slow:
                wifi_tracking = self.config_entry.options.get(
                    CONF_WIFI_TRACKING, DEFAULT_WIFI_TRACKING
                )
                lan_tracking = self.config_entry.options.get(
                    CONF_LAN_TRACKING, DEFAULT_LAN_TRACKING
                )
                devices, device_counters = await self.async_get_devices(
                    lan_tracking, wifi_tracking
                )
                await self.async_detect_new_devices(devices)

                # All these calls are independent: run them concurrently
                # (bounded) instead of serially — the slow tick used to take
                # the sum of ~15 sysbus round-trips.
                (
                    (callers, cmissed),
                    dsl_status,
                    nmc,
                    wifi,
                    guest_wifi,
                    ddns,
                    remote_access,
                    lan,
                    wifi_security,
                    upnp,
                    dhcp_leases,
                    guest_dhcp_leases,
                ) = await self._gather_limited(
                    self.async_get_callers(),
                    self.async_get_dsl_status(),
                    self.async_get_nmc(),
                    self.async_is_wifi(),
                    self.async_is_guest_wifi(),
                    self.async_get_ddns(),
                    self.async_is_remote_access(),
                    self.async_get_lan(),
                    self.async_get_wifi_security(),
                    self.async_get_port_forwarding(),
                    self.async_get_dhcp_leases(),
                    self.async_get_dhcp_leases("guest"),
                )
                schedules = await self._gather_limited(
                    *(self.async_get_device_schedule(key) for key in devices)
                )

                slow = {
                    "cmissed": cmissed,
                    "callers": callers,
                    "devices": devices,
                    "dsl_status": dsl_status,
                    "nmc": nmc,
                    "wifi": wifi,
                    "guest_wifi": guest_wifi,
                    "count_wired_devices": device_counters["wired"],
                    "count_wireless_devices": device_counters["wireless"],
                    "devices_wan_access": dict(zip(devices, schedules)),
                    "ddns": ddns,
                    "remote_access": remote_access,
                    "lan": lan,
                    "wifi_security": wifi_security,
                    "upnp": upnp,
                    "dhcp_leases": dhcp_leases,
                    "guest_dhcp_leases": guest_dhcp_leases,
                }
            else:
                # Reuse the heavy data from the previous tick unchanged.
                slow = {
                    key: prev.get(key)
                    for key in (
                        "cmissed", "callers", "devices", "dsl_status", "nmc",
                        "wifi", "guest_wifi", "count_wired_devices",
                        "count_wireless_devices", "devices_wan_access", "ddns",
                        "remote_access", "lan", "wifi_security", "upnp",
                        "dhcp_leases", "guest_dhcp_leases",
                    )
                }
                devices = slow.get("devices") or {}

            # Fast data: throughput + live status, every tick (concurrent).
            (
                wan_status,
                wifi_stats,
                fiber_status,
                fiber_stats,
                stats,
            ) = await self._gather_limited(
                self.async_get_wan_status(),
                self.async_get_wifi_stats(),
                self.async_get_fiber_status(),
                self.async_get_fiber_stats(),
                self.async_get_results(),
            )
            data = {
                **slow,
                "infos": infos,
                "wan_status": wan_status,
                "wifi_stats": wifi_stats,
                "fiber_status": fiber_status,
                "fiber_stats": fiber_stats,
                "stats": stats,
            }
            data["stats"] = await self.async_fix_wifi_rates(data["stats"])
            data["repeater"] = await self.async_get_repeater(devices)
            return data
        except AiosysbusException as error:
            _LOGGER.error("Error while fetch data information: %s", error)
            raise UpdateFailed(error) from error

    async def async_get_infos(self) -> dict[str, Any]:
        """Get router infos."""
        return (await self.api.deviceinfo.async_get_deviceinfo()).get("status", {})

    async def async_get_devices(
        self, lan_tracking=False, wifi_tracking=True
    ) -> tuple[dict[str, Any], dict[str, int]]:
        """Get all devices."""
        devices_tracker = {}
        device_counters = {"wireless": 0, "wired": 0}
        mode = self.config_entry.options.get(
            CONF_DISPLAY_DEVICES, DEFAULT_DISPLAY_DEVICES
        )
        if mode == "All":
            parameters = {
                "expression": {
                    "wifi": 'wifi && (edev || hnid) and .PhysAddress!=""',
                    "eth": 'eth && (edev || hnid) and .PhysAddress!=""',
                }
            }
        else:
            parameters = {
                "expression": {
                    "wifi": '.Active==true && wifi && (edev || hnid) and .PhysAddress!=""',
                    "eth": '.Active==true && eth && (edev || hnid) and .PhysAddress!=""',
                }
            }
        devices = (
            await self._make_request(self.api.devices.async_get_devices, parameters)
        ).get("status", {})
        _LOGGER.debug("Fetch Devices: %s", devices)
        if wifi_tracking:
            device_counters["wireless"] = len(devices.get("wifi", {}))
            for device in devices.get("wifi", {}):
                if device.get("Key"):
                    devices_tracker.setdefault(device.get("Key"), {}).update(device)

        if lan_tracking:
            device_counters["wired"] = len(devices.get("eth", {}))
            for device in devices.get("eth", {}):
                if device.get("Key"):
                    devices_tracker.setdefault(device.get("Key"), {}).update(device)

        return devices_tracker, device_counters

    async def async_get_callers(
        self,
    ) -> tuple[list[dict[str, Any] | None], list[dict[str, Any] | None]]:
        """Get caller missed."""
        callers = []
        cmisseds = []
        calls = (
            await self._make_request(self.api.voiceservice.async_get_calllist)
        ).get("status", {})
        for call in calls:
            try:
                utc_dt = datetime.strptime(call["startTime"], "%Y-%m-%dT%H:%M:%SZ")
            except (KeyError, TypeError, ValueError) as err:
                # A single malformed entry must not abort the whole update tick.
                _LOGGER.debug("Skipping malformed call entry %s: %s", call, err)
                continue
            local_dt = utc_dt.replace(tzinfo=UTC).astimezone(tz=DEFAULT_TIME_ZONE)
            caller = {
                "phone_number": call.get("remoteNumber"),
                "date": str(local_dt),
                "status": call.get("callType"),
                "duration": call.get("duration"),
                "id": call.get("callId"),
                "origin": call.get("callOrigin")
            }
            callers.append(caller)
            if call.get("callType") == "missed":
                cmisseds.append(caller)

        return callers, cmisseds

    async def async_get_dsl_status(self) -> dict[str, Any]:
        """Get dsl status."""
        parameters = {"mibs": "dsl", "flag": "", "traverse": "down"}
        dsl0 = (
            await self._make_request(self.api.nemo.async_get_MIBs, "data", parameters)
        ).get("status", {})
        return find_item(dsl0, "dsl.dsl0", {})

    async def async_get_fiber_status(self):
        """Get fiber status."""
        if self.model in [4, 3]:
            return {}
        if self.model == 5656:
            optical = (
                await self._make_request(self.api.sgcomci.async_get_optical)
            ).get("status", {})
            return {
                "SignalTxPower": float(optical.get("PowerTx", 0)) * 1000,
                "SignalRxPower": float(optical.get("PowerRx", 0)) * 1000,
                "Temperature": float(optical.get("Temperature", 0)),
                "Voltage": float(optical.get("Vcc", 0)),
                "Bias": float(optical.get("BiasCurrent", 0)),
            }

        parameters = {"mibs": "gpon"}
        veip0 = (
            await self._make_request(self.api.nemo.async_get_MIBs, "veip0", parameters)
        ).get("status", {})
        return find_item(veip0, "gpon.veip0", {})

    async def async_get_lan(self):
        """Get lan status."""
        self_devices = (
            await self._make_request(
                self.api.devices.async_get_devices,
                {"expression": {"wifi": "vap && lan", "eth": "eth && lan"}},
            )
        ).get("status", {})

        wlanvap_data = (
            await self._make_request(
                self.api.nemo.async_get_MIBs, "lan", {"mibs": "wlanvap"}
            )
        ).get("status", {})

        devices = []
        for mode, items in self_devices.items():
            for item in items:
                if mode == "wifi":
                    intf = item.get("Name", "Unknown")
                    band = item.get("OperatingFrequencyBand", intf)
                    ess_identifier = item.get("EssIdentifier", "guest").lower()
                    wlanvap = wlanvap_data.get(intf, {})
                    devices.append(
                        {
                            "name": f"{band} ({ess_identifier})",
                            "status": item.get("Active"),
                            "type": "Wireless",
                            "extra_attributes": {
                                "last_change": item.get("LastChanged"),
                                "channel": item.get("Channel"),
                                "ssid": item.get("SSID"),
                                "associated_devices": wlanvap.get("AssociatedDevice"),
                            },
                        }
                    )
                if mode == "eth":
                    devices.append(
                        {
                            "name": item.get("Name", "Unknown"),
                            "status": item.get("Active"),
                            "type": "Ethernet",
                            "extra_attributes": {
                                "current_bitrate": item.get("CurrentBitRate"),
                                "last_change": item.get("LastChanged"),
                                "port_state": item.get("PortState"),
                            },
                        }
                    )
        return devices

    async def async_get_wifi_security(self) -> dict[str, dict[str, Any]]:
        """Get per-band WiFi security mode, PMF and WPS state.

        Reads the `wlanvap` MIB on the `lan` interface (same call as
        `async_get_lan`) and extracts, for each pilotable private VAP, the
        security mode, the Protected Management Frames config and the WPS
        state. Keyed by band label so the select/switch platforms can act
        per band. Secondary VAPs (privN, guest) are ignored on purpose.
        """
        wlanvap = (
            await self._make_request(
                self.api.nemo.async_get_MIBs, "lan", {"mibs": "wlanvap"}
            )
        ).get("status", {}).get("wlanvap", {})

        result: dict[str, dict[str, Any]] = {}
        for band, vap in WIFI_VAPS.items():
            info = wlanvap.get(vap)
            if not info:
                continue
            sec = info.get("Security", {}) or {}
            wps = info.get("WPS", {}) or {}
            result[band] = {
                "vap": vap,
                "mode": sec.get("ModeEnabled"),
                "pmf": sec.get("MFPConfig"),
                "modes_available": sec.get("ModesAvailable", ""),
                "wps": wps.get("Enable") is True,
                "ssid": info.get("SSID"),
            }
        return result

    async def async_set_wifi_mode(self, vap: str, mode: str) -> None:
        """Set the WiFi security mode of one VAP.

        Uses the same sysbus call proven by the `livebox-sysbus` helper:
        `NeMo.Intf.<vap>.setMIBs {"mibs":{"wlanvap":{<vap>:{Security:{ModeEnabled}}}}}`.
        WARNING: changing the mode bounces that radio for a few seconds.
        """
        await self._make_request(
            self.api.nemo.async_set_MIBs,
            vap,
            {"mibs": {"wlanvap": {vap: {"Security": {"ModeEnabled": mode}}}}},
        )
        self._force_slow_refresh = True

    async def async_set_wps(self, enable: bool) -> None:
        """Enable/disable WPS on every pilotable band at once.

        The global `NMC.Wifi` WPS setter fails on this box (error 196639); the
        working path is per-VAP `wlanvap.<vap>.WPS.Enable` via setMIBs (proven
        by the `livebox-sysbus` helper, WPS disabled on all bands 2026-07-11).
        A single WPS control is enough in practice (Chris never wants WPS on
        one band only), so this drives all bands together instead of exposing
        one switch per band.
        """
        for vap in WIFI_VAPS.values():
            await self._make_request(
                self.api.nemo.async_set_MIBs,
                vap,
                {"mibs": {"wlanvap": {vap: {"WPS": {"Enable": enable}}}}},
            )
        self._force_slow_refresh = True

    async def async_get_wifi_stats(self) -> bool:
        """Get wifi stats."""
        return (await self._make_request(self.api.nmc.async_get_wifi_stats)).get(
            "data", {}
        )

    async def async_get_fiber_stats(self) -> bool:
        """Get fiber stats."""
        if self.model == 4:
            intf = "eth0"
        elif self.model == 3:
            intf = "bridge_vmulti"
        elif self.model == 5656:
            intf = "bridge"
        else:
            intf = "veip0"
        return (
            await self._make_request(self.api.nemo.async_get_net_dev_stats, intf)
        ).get("status", {})

    async def async_get_wan_status(self) -> dict[str, Any]:
        """Get status."""
        return (await self._make_request(self.api.nmc.async_get_wan_status)).get(
            "data", {}
        )

    async def async_get_nmc(self) -> dict[str, Any]:
        """Get dsl status."""
        return (await self._make_request(self.api.nmc.async_get)).get("status", {})

    async def async_is_wifi(self) -> bool:
        """Get wireless status."""
        wifi = (await self._make_request(self.api.nmc.async_get_wifi)).get("status", {})
        return wifi.get("Enable") is True

    async def async_is_guest_wifi(self) -> bool:
        """Get Guest Wifi status."""
        guest_wifi = (await self._make_request(self.api.nmc.async_get_guest_wifi)).get(
            "status", {}
        )
        return guest_wifi.get("Enable") is True

    async def async_get_ddns(self) -> list[Any]:
        """Get DDNS status."""
        ddns = (await self._make_request(self.api.dyndns.async_get_hosts)).get(
            "status", {}
        )
        return ddns if isinstance(ddns, list) else []

    async def async_get_device_schedule(self, device_key):
        """Get device schedule."""
        parameters = {"type": "ToD", "ID": device_key}
        data = (
            await self._make_request(self.api.schedule.async_get_schedule, parameters)
        ).get("data", {})
        return data.get("scheduleInfo", {})

    async def async_is_remote_access(self) -> bool:
        """Get Remote access status."""
        ra = (await self._make_request(self.api.remoteaccess.async_get)).get(
            "status", {}
        )
        return ra.get("Enable", False) is True

    async def async_detect_new_devices(self, devices) -> None:
        """New devices detected."""
        if self.data and self.data.get("devices"):
            for key in devices:
                if key not in self.data.get("devices", {}):
                    self.data["devices"] = devices
                    async_dispatcher_send(self.hass, self.signal_device_new)
                    async_dispatcher_send(self.hass, self.signal_wan_access_new)
                    break

    async def async_get_port_forwarding(self) -> list[dict[str, Any]]:
        """Get port forwarding."""
        port_forwarding = (
            await self._make_request(self.api.firewall.async_get_port_forwarding)
        ).get("status", {})
        ports = []
        for port in port_forwarding.values():
            if not port.get("Enable"):
                continue
            ports.append(
                {
                    "id": port.get("Id"),
                    "WAN Ip": port.get("DestinationIPAddress"),
                    "WAN Port": port.get("ExternalPort"),
                    "Port": port.get("InternalPort"),
                }
            )

        return ports

    async def async_get_dhcp_leases(
        self, domain: str = "default"
    ) -> list[dict[str, Any]]:
        """Get dhcp leases."""
        if self.model == 5656:
            return []

        data = (await self._make_request(self.api.dhcp.async_get_dhcp_pool)).get("status", {})
        if data.get(domain, {}).get("Enable", False) is False:
            return []

        data = (
            await self._make_request(self.api.dhcp.async_get_dhcp_leases, None, domain)
        ).get("status", {})
        return [
            {
                "IP Address": item.get("IPAddress"),
                "Mac Address": item.get("MACAddress"),
                "Name": item.get("FriendlyName", "No name"),
                "Time (s)": item.get("LeaseTime"),
                "Enable": item.get("Active"),
                "Reserved": item.get("Reserved"),
            }
            for item in data.get(domain, {}).values()
        ]

    async def async_get_results(self) -> dict[str, Any]:
        """Get interfaces."""
        results = {}

        data = (await self._make_request(self.api.homelan.async_get_interface)).get(
            "status", {}
        )

        interfaces = {
            item["FriendlyName"]: item
            for item in data.values()
            if "Name" in item and "FriendlyName" in item and "vlan" not in item["Name"]
        }

        data = (
            await self._make_request(
                self.api.homelan.async_get_results,
                {"InterfaceName": list(interfaces.keys()), "NumberOfReadings": 1},
            )
        ).get("status", {})

        for key, item in interfaces.items():
            traffic = data.get(key, {}).get("Traffic", [])
            if len(traffic) == 0:
                continue
            stats = traffic[0]

            # Rx_Counter and Tx_Counter => bits/30seconds
            #  /8 => octets , /30 => par seconde (8*30 => 240)
            # Result is BYTES/s (matches sensor unit BYTES_PER_SECOND, and the
            # repeater sensors) — do NOT divide further; HA scales B/s->MB/s.

            results.update(
                {
                    item["Name"]: {
                        "friendly_name": key,
                        "alias": item.get("alias"),
                        "rate_rx": round(stats.get("Rx_Counter", 0) / 240, 1),
                        "rate_tx": round(stats.get("Tx_Counter", 0) / 240, 1),
                    }
                }
            )
        return results

    async def async_fix_wifi_rates(
        self, stats: dict[str, Any]
    ) -> dict[str, Any]:
        """Compute real per-SSID WiFi rates from getNetDevStats byte deltas.

        HomeLan.getResults leaves the WiFi vaps at 0.0 on this box, so the
        rate_rx/tx sensors it feeds are dead. NeMo.Intf.<vap>.getNetDevStats
        exposes monotonic RxBytes/TxBytes that DO move; the instantaneous rate
        is the byte delta over the elapsed time since the previous tick,
        expressed in BYTES/s (whole integration standardized on bytes, like
        Livebox Monitor — no bits anywhere). Keys mirror the HomeLan interface
        names (WIFI_RATE_INTFS) so we overwrite the existing entries in place
        — no duplicate sensors. First tick has no baseline, so we seed the
        snapshot and leave the current value untouched.
        """
        now = self.hass.loop.time()
        netdev_results = await self._gather_limited(
            *(
                self._make_request(self.api.nemo.async_get_net_dev_stats, vap)
                for vap in WIFI_RATE_INTFS.values()
            )
        )
        for (name, vap), res in zip(WIFI_RATE_INTFS.items(), netdev_results):
            netdev = res.get("status", {})
            if not netdev:
                continue
            rx = int(netdev.get("RxBytes", 0))
            tx = int(netdev.get("TxBytes", 0))

            prev = self._wifi_rate_prev.get(vap)
            self._wifi_rate_prev[vap] = (now, rx, tx)

            entry = stats.setdefault(
                name, {"friendly_name": name, "alias": None, "rate_rx": 0.0, "rate_tx": 0.0}
            )
            if prev is None:
                # No baseline yet: keep whatever HomeLan produced (usually 0.0)
                # and wait for the next tick to have a delta.
                continue
            prev_ts, prev_rx, prev_tx = prev
            dt = now - prev_ts
            if dt <= 0:
                continue
            # Counters can reset (router reboot) -> clamp negative deltas to 0.
            d_rx = max(0, rx - prev_rx)
            d_tx = max(0, tx - prev_tx)
            entry["rate_rx"] = round(d_rx / dt, 1)
            entry["rate_tx"] = round(d_tx / dt, 1)
        return stats

    # --- WiFi 6 repeater ------------------------------------------------------

    def _discover_repeater_host(self, devices: dict[str, Any]) -> str | None:
        """Find the repeater IP from the box device list, else static fallback.

        The box lists the repeater in Devices.get with DeviceType
        "repeteurwifi6" and its current IPAddress. `devices` here is the
        tracker dict (keyed by device Key) already fetched this tick; each
        value carries DeviceType/IPAddress. If nothing matches (tracker mode
        filtered it out, e.g. wired-only), fall back to REPEATER_HOSTS.
        """
        for info in devices.values():
            if info.get("DeviceType") == REPEATER_DEVICE_TYPE and info.get(
                "IPAddress"
            ):
                return info["IPAddress"]
        return REPEATER_HOSTS[0] if REPEATER_HOSTS else None

    async def _ensure_repeater_client(self, host: str) -> AIOSysbus | None:
        """Build (and connect) the repeater sysbus client, cached per host.

        Same admin credentials as the box (the repeater trusts the box
        password). Rebuilt only if the discovered IP changes. Any failure is
        swallowed: the repeater is a best-effort extra device, it must never
        break the main box update.
        """
        if self.api_rep is not None and self._rep_host == host:
            return self.api_rep
        if self._rep_session is None or self._rep_session.closed:
            self._rep_session = async_create_clientsession(self.hass)
        try:
            api = AIOSysbus(
                username=self.config_entry.data[CONF_USERNAME],
                password=self.config_entry.data[CONF_PASSWORD],
                session=self._rep_session,
                host=host,
                port=self.config_entry.data[CONF_PORT],
                use_tls=False,
            )
            await api.async_connect()
        except AiosysbusException as err:
            _LOGGER.debug("Repeater %s unreachable: %s", host, err)
            self.api_rep = None
            self._rep_host = None
            return None
        self.api_rep = api
        self._rep_host = host
        return api

    async def _rep_request(
        self, api: AIOSysbus, intf: str, method: str, params: dict | None = None
    ) -> dict[str, Any]:
        """Low-level NeMo.Intf.<intf>.<method> call on the repeater.

        aiosysbus exposes generic get_MIBs/get_net_dev_stats keyed by interface
        name, which is exactly what we need here. Errors are logged and turned
        into an empty dict so a single flaky call never aborts the update.
        """
        try:
            if method == "getNetDevStats":
                res = await api.nemo.async_get_net_dev_stats(intf)
            elif method == "getMIBs":
                res = await api.nemo.async_get_MIBs(intf, params or {})
            else:  # pragma: no cover - defensive
                return {}
            return res.get("status", {}) or {}
        except AiosysbusException as err:
            _LOGGER.debug("Repeater call %s.%s failed: %s", intf, method, err)
            return {}

    def _rep_rate(
        self, key: str, netdev: dict[str, Any], now: float, swap: bool = True
    ) -> dict[str, float]:
        """Instantaneous rx/tx rate (BYTES/s) + cumulative totals (bytes).

        Same byte-delta method as the box vaps, with a per-key previous
        snapshot in self._rep_rate_prev. Rate is in bytes/s (not Mbit/s) so the
        sensors can display it in B/s -> KB/s -> MB/s exactly like Livebox
        Monitor's TauxRx/TauxTx columns. rate_rx/rate_tx are 0.0 on the first
        tick (no baseline yet). total_rx/tx are the raw cumulative counters for
        the lifetime totals (Go).

        swap=True (default): the repeater reports Rx/Tx from the INTERFACE's own
        point of view, which is the opposite of what the user expects (and of
        what Livebox Monitor shows — its NET_INTF_WR6 table sets SwapStats=True
        on every repeater interface). So Rx here = what comes DOWN to the LAN,
        matching LM and the box-side convention. Confirmed against Chris' LM
        capture: all 5 lines (LAN/Eth1/Eth2/Wifi2.4/Wifi5) match after swapping.
        WARNING: these counters recycle at ~4 GB (documented in LM), so deltas
        are clamped to >=0 to swallow the wrap.
        """
        raw_rx = int(netdev.get("RxBytes", 0))
        raw_tx = int(netdev.get("TxBytes", 0))
        rx, tx = (raw_tx, raw_rx) if swap else (raw_rx, raw_tx)
        prev = self._rep_rate_prev.get(key)
        self._rep_rate_prev[key] = (now, rx, tx)
        rate_rx = rate_tx = 0.0
        if prev is not None:
            prev_ts, prev_rx, prev_tx = prev
            dt = now - prev_ts
            if dt > 0:
                rate_rx = round(max(0, rx - prev_rx) / dt, 1)
                rate_tx = round(max(0, tx - prev_tx) / dt, 1)
        return {
            "rate_rx": rate_rx,
            "rate_tx": rate_tx,
            "total_rx": rx,
            "total_tx": tx,
        }

    def _rep_band_rate_from_stations(
        self, vap: str, assoc: dict[str, Any], now: float
    ) -> dict[str, Any] | None:
        """Per-band rate (BYTES/s) summed from the driver's per-station counters.

        The vap netdev counters only see what crosses the Linux software path;
        the Broadcom driver forwards part of the traffic below it (hardware
        switching, multicast->unicast conversion — the IPTV stream to the TV
        decoder runs at ~1.4 MB/s while vap netdev shows ~0, measured
        2026-07-13). The per-station AssociatedDevice.TxBytes/RxBytes counters
        DO include that traffic, so the real band rate is the summed byte
        delta across stations over the tick. Orientation follows the LM swap
        convention already used by _rep_rate: station TxBytes (AP->station,
        i.e. downstream) shows as rx. Totals are accumulated from the same
        deltas so rates and totals tell the same story.
        Returns None on the first tick (no baseline yet).
        """
        cur = {
            mac: (int(sta.get("TxBytes") or 0), int(sta.get("RxBytes") or 0))
            for mac, sta in assoc.items()
        }
        prev = self._rep_sta_prev.get(vap)
        self._rep_sta_prev[vap] = (now, cur)
        if prev is None:
            return None
        prev_ts, prev_stas = prev
        dt = now - prev_ts
        if dt <= 0:
            return None
        d_down = d_up = 0
        for mac, (tx, rx) in cur.items():
            p = prev_stas.get(mac)
            if p is None:
                # New station: no baseline yet, it counts from the next tick.
                continue
            # Re-association resets the driver counters -> skip the negative
            # delta per station (one reset must not zero the whole band).
            if tx >= p[0]:
                d_down += tx - p[0]
            if rx >= p[1]:
                d_up += rx - p[1]
        totals = self._rep_band_totals.setdefault(vap, [0, 0])
        totals[0] += d_down
        totals[1] += d_up
        return {
            "rate_rx": round(d_down / dt, 1),
            "rate_tx": round(d_up / dt, 1),
            "total_rx": totals[0],
            "total_tx": totals[1],
        }

    async def async_get_repeater(self, devices: dict[str, Any]) -> dict[str, Any]:
        """Collect the WiFi 6 repeater telemetry (best-effort, never fatal).

        Returns {} when no repeater is reachable so the sensor platform simply
        skips creating its device. On success:
          - backhaul: eth0 rate/totals = the repeater's real aggregate traffic
          - bands: {band: {rate_rx, rate_tx, total_rx, total_tx, stations}}
          - stations: [{mac, band, rssi, rx_rate, tx_rate}] across all bands
          - info: model / sw / serial / host for the HA device
        """
        host = self._discover_repeater_host(devices)
        if not host:
            return {}
        api = await self._ensure_repeater_client(host)
        if api is None:
            return {}

        now = self.hass.loop.time()
        result: dict[str, Any] = {"host": host}

        # Device identity (model/serial/sw) for the HA device card.
        try:
            di = (await api.deviceinfo.async_get_deviceinfo()).get("status", {})
        except AiosysbusException:
            di = {}
        self._rep_serial = di.get("SerialNumber") or self._rep_serial
        result["info"] = {
            "model": di.get("ModelName") or "Wifi_6_Repeater",
            "sw_version": di.get("SoftwareVersion"),
            "serial": self._rep_serial,
        }

        # All 5 interfaces, exactly as Livebox Monitor lists them (NET_INTF_WR6),
        # Rx/Tx swapped to the user/LAN point of view (see _rep_rate swap).
        # `interfaces` is keyed by API intf name; each entry carries the LM label.
        interfaces: dict[str, Any] = {}
        first_intf_ok = False
        rep_netdevs = await self._gather_limited(
            *(
                self._rep_request(api, intf, "getNetDevStats")
                for intf in REPEATER_INTFS
            )
        )
        for (intf, label), netdev in zip(REPEATER_INTFS.items(), rep_netdevs):
            if netdev:
                first_intf_ok = True
            entry = self._rep_rate(f"intf_{intf}", netdev, now) if netdev else {
                "rate_rx": 0.0, "rate_tx": 0.0, "total_rx": 0, "total_tx": 0,
            }
            entry["label"] = label
            interfaces[intf] = entry
        if not first_intf_ok:
            # Auth may have silently expired; drop the client so next tick rebuilds.
            self.api_rep = None
            self._rep_host = None
            return {}
        result["interfaces"] = interfaces

        # Backhaul = the uplink to the box (RJ45 into the box ETH4). On this
        # repeater that is REPEATER_BACKHAUL_INTF; kept as the "headline" figure.
        result["backhaul"] = interfaces.get(
            REPEATER_BACKHAUL_INTF,
            {"rate_rx": 0.0, "rate_tx": 0.0, "total_rx": 0, "total_tx": 0},
        )

        # Per-band radio counters (reuse the interface entries) + stations.
        bands: dict[str, Any] = {}
        stations: list[dict[str, Any]] = []
        rep_mibs = await self._gather_limited(
            *(
                self._rep_request(api, vap, "getMIBs", {"mibs": "wlanvap"})
                for vap in REPEATER_VAPS.values()
            )
        )
        for (band, vap), mib in zip(REPEATER_VAPS.items(), rep_mibs):
            band_data = dict(interfaces.get(vap, {
                "rate_rx": 0.0, "rate_tx": 0.0, "total_rx": 0, "total_tx": 0,
            }))
            wlanvap = mib.get("wlanvap", {})
            assoc = (wlanvap.get(vap, {}) or {}).get("AssociatedDevice", {}) or {}
            if mib:
                # Only when the MIB fetch succeeded: a failed call must keep
                # the netdev-based values rather than zeroing the band.
                sta_rates = self._rep_band_rate_from_stations(vap, assoc, now)
                if sta_rates is not None:
                    band_data.update(sta_rates)
                    # The rate/total sensors read repeater.interfaces.<vap>,
                    # so the override must land there too.
                    interfaces[vap].update(sta_rates)
            band_data["stations"] = len(assoc)
            bands[band] = band_data

            for mac, sta in assoc.items():
                stations.append(
                    {
                        "mac": sta.get("MACAddress") or mac,
                        "band": band,
                        "rssi": sta.get("SignalStrength"),
                        "rx_rate": sta.get("LastDataDownlinkRate"),
                        "tx_rate": sta.get("LastDataUplinkRate"),
                        "noise": sta.get("Noise"),
                    }
                )
        result["bands"] = bands
        result["stations"] = stations
        result["station_count"] = len(stations)
        return result

    async def _gather_limited(self, *coros: Any, limit: int = 8) -> list[Any]:
        """asyncio.gather with bounded concurrency.

        The box firmware serves the sysbus API from a small embedded HTTP
        server: full parallelism on 50+ calls (device schedules) could starve
        it, so cap the in-flight requests while still collapsing the tick
        duration from sum-of-latencies to roughly max-of-latencies.
        """
        sem = asyncio.Semaphore(limit)

        async def _run(coro: Any) -> Any:
            async with sem:
                return await coro

        return await asyncio.gather(*(_run(coro) for coro in coros))

    async def _make_request(
        self, func: Callable[..., Any], *args: Any
    ) -> dict[str, Any]:
        """Execute request."""
        try:
            return await func(*args)
        except AiosysbusException as error:
            _LOGGER.error("Error while execute: %s (%s)", func.__name__, error)
        return {}

    @property
    def signal_device_new(self) -> str:
        """Event specific per Livebox entry to signal new device."""
        return f"{DOMAIN}-{self.unique_id}-device-new"

    @property
    def signal_wan_access_new(self) -> str:
        """Event specific per Livebox entry to signal new device."""
        return f"{DOMAIN}-{self.unique_id}-wan-accessnew"
