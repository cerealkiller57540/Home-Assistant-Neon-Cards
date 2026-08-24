"""Sensor for Livebox router."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, Final
import logging

from homeassistant.components.sensor import (
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
    SensorDeviceClass
)
from homeassistant.const import (
    SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
    EntityCategory,
    UnitOfDataRate,
    UnitOfInformation,
    UnitOfTime
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import LiveboxConfigEntry
from .const import DOMAIN, DOWNLOAD_ICON, PHONE_ICON, REPEATER_INTFS, UPLOAD_ICON
from .coordinator import LiveboxDataUpdateCoordinator
from .entity import LiveboxEntity, RepeaterEntity
from .helpers import find_item

_LOGGER = logging.getLogger(__name__)

@dataclass(frozen=True, kw_only=True)
class LiveboxSensorEntityDescription(SensorEntityDescription):
    """Represents an Flow Sensor."""

    value_fn: Callable[..., Any]
    attrs: dict[str, Callable[..., Any]] | None = None


def get_rolling_32_bit_value_fn(path: str) -> Callable[..., Any]:
    """Returns a closure function, that extracts a rolling 32-bit value from"""
    """the coordinator data structure, and tweaks its result so that HASS"""
    """properly accumulates the total rolling value."""
    """Meant for monotonically increasing counters: fiber/DSL Tx/Rx, and WiFi Tx/Rx"""

    previous_reading: int = 0
    previous_uptime: int = 0
    rolls: int = 0

    def value_fn(coordinator_data) -> int:
        nonlocal previous_reading
        nonlocal previous_uptime
        nonlocal rolls
        current_uptime = coordinator_data.get("infos", {}).get("UpTime") or 0
        current_reading = find_item(coordinator_data, path, 0)

        if current_uptime < previous_uptime:
            # The router has reset, so clear up previous counter value
            previous_reading = 0
            rolls = 0

        if current_reading == 0 and previous_reading > 0:
            # Transient fetch failure (find_item fell back to 0): a real reset
            # is already caught by the uptime check above. Counting this as a
            # 32-bit rollover would inflate the total by 4 GiB permanently, so
            # hold the last known value instead.
            previous_uptime = current_uptime
            return (rolls << 32) + previous_reading

        if current_reading < previous_reading:
            _LOGGER.debug("Rolling over 32-bit integer counter: %s", path)
            rolls += 1

        previous_reading = current_reading
        previous_uptime = current_uptime

        return (rolls<<32) + current_reading

    return value_fn

def get_closure_value_fn(path: str) -> Callable[..., Any]:
    """Returns a closure function for value_fn of entities with variable name"""
    return lambda x: find_item(x, path)


SENSOR_TYPES: Final[list[LiveboxSensorEntityDescription]] = [
    LiveboxSensorEntityDescription(
        key="down",
        name="xDSL Download",
        icon=DOWNLOAD_ICON,
        translation_key="down_rate",
        value_fn=lambda x: find_item(x, "dsl_status.DownstreamCurrRate", 0),
        native_unit_of_measurement=UnitOfDataRate.KILOBITS_PER_SECOND,
        suggested_unit_of_measurement=UnitOfDataRate.MEGABITS_PER_SECOND,
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.DATA_RATE,
        attrs={
            "downstream_maxrate": lambda x: find_item(
                x, "dsl_status.DownstreamMaxRate"
            ),
            "downstream_lineattenuation": lambda x: find_item(
                x, "dsl_status.DownstreamLineAttenuation"
            ),
            "downstream_noisemargin": lambda x: find_item(
                x, "dsl_status.DownstreamNoiseMargin"
            ),
            "downstream_power": lambda x: find_item(x, "dsl_status.DownstreamPower"),
        },
    ),
    LiveboxSensorEntityDescription(
        key="up",
        name="xDSL Upload",
        icon=UPLOAD_ICON,
        translation_key="up_rate",
        value_fn=lambda x: x.get("dsl_status", {}).get("UpstreamCurrRate", 0) ,
        native_unit_of_measurement=UnitOfDataRate.KILOBITS_PER_SECOND,
        suggested_unit_of_measurement=UnitOfDataRate.MEGABITS_PER_SECOND,
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.DATA_RATE,
        attrs={
            "upstream_maxrate": lambda x: find_item(x, "dsl_status.UpstreamMaxRate"),
            "upstream_lineattenuation": lambda x: find_item(
                x, "dsl_status.UpstreamLineAttenuation"
            ),
            "upstream_noisemargin": lambda x: find_item(
                x, "dsl_status.UpstreamNoiseMargin"
            ),
            "upstream_power": lambda x: find_item(x, "dsl_status.UpstreamPower"),
        },
    ),
    LiveboxSensorEntityDescription(
        key="wifi_rx",
        name="Wifi Rx",
        icon="mdi:wifi-arrow-down",
        value_fn=get_rolling_32_bit_value_fn("wifi_stats.RxBytes"),
        native_unit_of_measurement=UnitOfInformation.BYTES,
        suggested_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.TOTAL_INCREASING,
        device_class=SensorDeviceClass.DATA_SIZE,
        translation_key="wifi_rx",
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="wifi_tx",
        name="Wifi Tx",
        icon="mdi:wifi-arrow-up",
        value_fn=get_rolling_32_bit_value_fn("wifi_stats.TxBytes"),
        native_unit_of_measurement=UnitOfInformation.BYTES,
        suggested_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.TOTAL_INCREASING,
        device_class=SensorDeviceClass.DATA_SIZE,
        translation_key="wifi_tx",
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="fiber_power_rx",
        name="Fiber Power Rx",
        value_fn=lambda x: round(
            find_item(x, "fiber_status.SignalRxPower", 0) / 1000, 2
        ),
        native_unit_of_measurement=SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.SIGNAL_STRENGTH,
        translation_key="fiber_power_rx",
        attrs={
            "Downstream max rate Gbps": lambda x: find_item(
                x, "fiber_status.DownstreamMaxRate", 0
            )
            / 1000,
            "Downstream current rate Gbps": lambda x: find_item(
                x, "fiber_status.DownstreamCurrRate", 0
            )
            / 1000,
            "Max bitrate (Gbps)": lambda x: find_item(
                x, "fiber_status.MaxBitRateSupported", 0
            )
            / 1000,
            "Temperature (°C)": lambda x: find_item(x, "fiber_status.Temperature"),
            "Voltage (V)": lambda x: find_item(x, "fiber_status.Voltage"),
            "Bias (mA)": lambda x: find_item(x, "fiber_status.Bias"),
            "ONU State": lambda x: find_item(x, "fiber_status.ONUState"),
        },
    ),
    LiveboxSensorEntityDescription(
        key="fiber_power_tx",
        name="Fiber Power Tx",
        value_fn=lambda x: round(
            find_item(x, "fiber_status.SignalTxPower", 0) / 1000, 2
        ),
        native_unit_of_measurement=SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.SIGNAL_STRENGTH,
        translation_key="fiber_power_tx",
        attrs={
            "Upstream max rate (Gbps)": lambda x: find_item(
                x, "fiber_status.UpstreamMaxRate", 0
            )
            / 1000,
            "Upstream current rate (Gbps)": lambda x: find_item(
                x, "fiber_status.UpstreamCurrRate", 0
            )
            / 1000,
            "Max bitrate (Gbps)": lambda x: find_item(
                x, "fiber_status.MaxBitRateSupported", 0
            )
            / 1000,
            "Tx power (dbm)": lambda x: find_item(x, "fiber_status.SignalTxPower"),
            "Temperature (°C)": lambda x: find_item(x, "fiber_status.Temperature"),
            "Voltage (V)": lambda x: find_item(x, "fiber_status.Voltage"),
            "Bias (mA)": lambda x: find_item(x, "fiber_status.Bias"),
            "ONU State": lambda x: find_item(x, "fiber_status.ONUState"),
        },
    ),
    LiveboxSensorEntityDescription(
        key="fiber_tx",
        name="Fiber Tx",
        icon=UPLOAD_ICON,
        value_fn=get_rolling_32_bit_value_fn("fiber_stats.TxBytes"),
        native_unit_of_measurement=UnitOfInformation.BYTES,
        suggested_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.TOTAL_INCREASING,
        device_class=SensorDeviceClass.DATA_SIZE,
        translation_key="fiber_tx",
        attrs={"Tx errors": lambda x: find_item(x, "fiber_stats.TxErrors")},
    ),
    LiveboxSensorEntityDescription(
        key="fiber_rx",
        name="Fiber Rx",
        icon=DOWNLOAD_ICON,
        value_fn=get_rolling_32_bit_value_fn("fiber_stats.RxBytes"),
        native_unit_of_measurement=UnitOfInformation.BYTES,
        suggested_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.TOTAL_INCREASING,
        device_class=SensorDeviceClass.DATA_SIZE,
        translation_key="fiber_rx",
        attrs={"Rx errors": lambda x: find_item(x, "fiber_stats.RxErrors")},
    ),
    LiveboxSensorEntityDescription(
        key="callers",
        name="Callers",
        icon=PHONE_ICON,
        value_fn=lambda x: len(x.get("callers", {})),
        state_class=SensorStateClass.TOTAL,
        translation_key="callers",
        attrs={"callers": lambda x: x.get("callers")},
    ),
    LiveboxSensorEntityDescription(
        key="upnp",
        name="Ports forwarding",
        value_fn=lambda x: len(x.get("upnp", {})),
        state_class=SensorStateClass.TOTAL,
        translation_key="upnp",
        attrs={"Ports": lambda x: x.get("upnp")},
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="dhcp_leases",
        name="DHCP Leases",
        value_fn=lambda x: len(x.get("dhcp_leases", {})),
        state_class=SensorStateClass.TOTAL,
        translation_key="dhcp_leases",
        attrs={"Leases": lambda x: x.get("dhcp_leases")},
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="guest_dhcp_leases",
        name="Guest DHCP Leases",
        value_fn=lambda x: len(x.get("guest_dhcp_leases", {})),
        state_class=SensorStateClass.TOTAL,
        translation_key="guest_dhcp_leases",
        attrs={"Leases": lambda x: x.get("guest_dhcp_leases")},
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="uptime",
        name="Uptime",
        icon="mdi:progress-clock",
        value_fn=lambda x: find_item(x, "infos.UpTime", 0),
        native_unit_of_measurement=UnitOfTime.SECONDS,
        state_class=SensorStateClass.TOTAL,
        device_class=SensorDeviceClass.DURATION,
        translation_key="uptime",
        entity_registry_enabled_default=False,
    ),
]


# --- WiFi 6 repeater sensors -------------------------------------------------
# Two groups:
#  1) Per-interface throughput + totals, generated dynamically from
#     REPEATER_INTFS so HA mirrors Livebox Monitor's table exactly: 5 lines
#     (LAN / Ethernet 1 / Ethernet 2 / Wifi 2.4GHz / Wifi 5GHz), each with a
#     Rx and Tx rate (bytes/s -> B/s..MB/s like LM's TauxRx/TauxTx) and a
#     lifetime total (bytes -> Go). See _intf_field / build below.
#  2) Station counts + the per-device signal list (static, kept as-is).
STATION_SENSOR_TYPES: Final[list[LiveboxSensorEntityDescription]] = [
    LiveboxSensorEntityDescription(
        key="rep_stations",
        name="Appareils connectés",
        icon="mdi:access-point-network",
        value_fn=lambda x: find_item(x, "repeater.station_count", 0),
        state_class=SensorStateClass.MEASUREMENT,
        translation_key="rep_stations",
        # Full per-station list (mac/band/rssi/rates) as attributes: this is the
        # "signal per device". Band keys contain a dot ("2.4GHz") so we index the
        # bands dict directly, NOT via find_item (which splits on ".").
        attrs={
            "stations": lambda x: find_item(x, "repeater.stations", []),
            "2.4GHz": lambda x: _band_field(x, "2.4GHz", "stations"),
            "5GHz": lambda x: _band_field(x, "5GHz", "stations"),
        },
    ),
    LiveboxSensorEntityDescription(
        key="rep_stations_24",
        name="Appareils 2.4GHz",
        icon="mdi:wifi",
        value_fn=lambda x: _band_field(x, "2.4GHz", "stations"),
        state_class=SensorStateClass.MEASUREMENT,
        translation_key="rep_stations_24",
        entity_registry_enabled_default=False,
    ),
    LiveboxSensorEntityDescription(
        key="rep_stations_5",
        name="Appareils 5GHz",
        icon="mdi:wifi",
        value_fn=lambda x: _band_field(x, "5GHz", "stations"),
        state_class=SensorStateClass.MEASUREMENT,
        translation_key="rep_stations_5",
        entity_registry_enabled_default=False,
    ),
]


def _band_field(data: dict[str, Any], band: str, field: str) -> Any:
    """Read one field of one repeater band.

    Band labels contain a dot ("2.4GHz"), so find_item (dot-delimited) can't
    reach them — index the bands dict directly.
    """
    return (
        data.get("repeater", {}).get("bands", {}).get(band, {}).get(field, 0)
    )


def _intf_field(data: dict[str, Any], intf: str, field: str) -> Any:
    """Read one field of one repeater interface (repeater.interfaces.<intf>)."""
    return (
        data.get("repeater", {}).get("interfaces", {}).get(intf, {}).get(field, 0)
    )


def build_repeater_interface_sensors() -> list[LiveboxSensorEntityDescription]:
    """One Rx+Tx rate and one Rx+Tx total per repeater interface (LM table).

    Rate in bytes/s (B/s..MB/s like LM's Taux columns); totals in bytes (-> Go).
    Only the two Ethernet uplinks are enabled by default (LAN + the two Wifi
    bands and their duplicates would clutter — the band throughput is already
    covered separately). Actually we enable all 5 so HA == LM out of the box.
    """
    out: list[LiveboxSensorEntityDescription] = []
    for intf, label in REPEATER_INTFS.items():
        slug = intf.replace("-", "_")
        out.append(
            LiveboxSensorEntityDescription(
                key=f"rep_{slug}_rx",
                name=f"{label} Rx",
                icon=DOWNLOAD_ICON,
                value_fn=(lambda i: lambda x: _intf_field(x, i, "rate_rx"))(intf),
                native_unit_of_measurement=UnitOfDataRate.BYTES_PER_SECOND,
                suggested_unit_of_measurement=UnitOfDataRate.KILOBYTES_PER_SECOND,
                suggested_display_precision=1,
                state_class=SensorStateClass.MEASUREMENT,
                device_class=SensorDeviceClass.DATA_RATE,
                translation_key=f"rep_{slug}_rx",
            )
        )
        out.append(
            LiveboxSensorEntityDescription(
                key=f"rep_{slug}_tx",
                name=f"{label} Tx",
                icon=UPLOAD_ICON,
                value_fn=(lambda i: lambda x: _intf_field(x, i, "rate_tx"))(intf),
                native_unit_of_measurement=UnitOfDataRate.BYTES_PER_SECOND,
                suggested_unit_of_measurement=UnitOfDataRate.KILOBYTES_PER_SECOND,
                suggested_display_precision=1,
                state_class=SensorStateClass.MEASUREMENT,
                device_class=SensorDeviceClass.DATA_RATE,
                translation_key=f"rep_{slug}_tx",
            )
        )
        out.append(
            LiveboxSensorEntityDescription(
                key=f"rep_{slug}_total_rx",
                name=f"{label} Total Rx",
                icon=DOWNLOAD_ICON,
                value_fn=(lambda i: lambda x: _intf_field(x, i, "total_rx"))(intf),
                native_unit_of_measurement=UnitOfInformation.BYTES,
                suggested_unit_of_measurement=UnitOfInformation.GIGABYTES,
                state_class=SensorStateClass.TOTAL_INCREASING,
                device_class=SensorDeviceClass.DATA_SIZE,
                translation_key=f"rep_{slug}_total_rx",
                entity_registry_enabled_default=False,
            )
        )
        out.append(
            LiveboxSensorEntityDescription(
                key=f"rep_{slug}_total_tx",
                name=f"{label} Total Tx",
                icon=UPLOAD_ICON,
                value_fn=(lambda i: lambda x: _intf_field(x, i, "total_tx"))(intf),
                native_unit_of_measurement=UnitOfInformation.BYTES,
                suggested_unit_of_measurement=UnitOfInformation.GIGABYTES,
                state_class=SensorStateClass.TOTAL_INCREASING,
                device_class=SensorDeviceClass.DATA_SIZE,
                translation_key=f"rep_{slug}_total_tx",
                entity_registry_enabled_default=False,
            )
        )
    return out


REPEATER_SENSOR_TYPES: Final[list[LiveboxSensorEntityDescription]] = (
    build_repeater_interface_sensors() + STATION_SENSOR_TYPES
)


# --- Per-device diagnostic sensors -------------------------------------------
# Stable info per tracked device, shown in the device page's Diagnostic section:
# IP, MAC, Livebox name, access (readable), WiFi signal (dBm), band. NO rx/tx
# (too volatile — a Diagnostic section must stay quiet). Each reads a field of
# the device dict from coordinator.data["devices"][mac].
def _device_ipv4(device: dict[str, Any]) -> str | None:
    """Best IPv4 for the device.

    The box `IPAddress` field can hold an IPv6 (seen on dual-stack clients). The
    `IPv4Address` list carries the real LAN v4 — prefer a reachable/global one,
    else the first, else fall back to IPAddress only if it looks like IPv4.
    """
    v4 = device.get("IPv4Address") or []
    if isinstance(v4, list) and v4:
        reachable = next(
            (a.get("Address") for a in v4 if a.get("Status") == "reachable"), None
        )
        return reachable or v4[0].get("Address")
    ip = device.get("IPAddress")
    return ip if (ip and ":" not in ip) else None


def _device_access(device: dict[str, Any]) -> str:
    """Readable access label like Livebox Monitor ('Répéteur Wifi 5GHz', ...).

    The box has no clean AccessPoint field, so we reconstruct it:
    - vap* interface  -> the device is a DIRECT WiFi client of the box
    - ETH* + a SignalStrength -> WiFi client BEHIND the repeater (its backhaul
      lands on ETH4, but the box still reports its radio band/signal)
    - ETH* without signal -> genuinely wired
    """
    intf = (device.get("InterfaceName") or "").lower()
    band = device.get("OperatingFrequencyBand") or ""
    has_signal = device.get("SignalStrength") is not None
    if intf.startswith("vap"):
        return f"Livebox Wifi {band}".strip()
    if intf.startswith("eth"):
        if has_signal:
            return f"Répéteur Wifi {band}".strip()
        return f"Livebox {device.get('InterfaceName')}"
    return device.get("InterfaceName") or "?"


@dataclass(frozen=True, kw_only=True)
class DeviceDiagDescription(SensorEntityDescription):
    """A per-device diagnostic sensor."""

    value_fn: Callable[[dict[str, Any]], Any]
    wifi_only: bool = False


DEVICE_DIAG_TYPES: Final[list[DeviceDiagDescription]] = [
    DeviceDiagDescription(
        key="dev_ip",
        name="Adresse IP",
        icon="mdi:ip-network",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=_device_ipv4,
    ),
    DeviceDiagDescription(
        key="dev_mac",
        name="Adresse MAC",
        icon="mdi:network-outline",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.get("PhysAddress"),
    ),
    DeviceDiagDescription(
        key="dev_name_lb",
        name="Nom Livebox",
        icon="mdi:tag-outline",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.get("Name"),
    ),
    DeviceDiagDescription(
        key="dev_access",
        name="Accès",
        icon="mdi:access-point-network",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=_device_access,
    ),
    DeviceDiagDescription(
        key="dev_signal",
        name="Signal WiFi",
        icon="mdi:wifi",
        entity_category=EntityCategory.DIAGNOSTIC,
        native_unit_of_measurement=SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
        device_class=SensorDeviceClass.SIGNAL_STRENGTH,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("SignalStrength"),
        wifi_only=True,
    ),
    DeviceDiagDescription(
        key="dev_band",
        name="Bande",
        icon="mdi:radio-tower",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.get("OperatingFrequencyBand"),
        wifi_only=True,
    ),
]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: LiveboxConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensors."""
    coordinator = entry.runtime_data
    entities = []
    linktype = coordinator.data.get("wan_status", {}).get("LinkType", "").lower()

    sensor_stats = []
    for name, item in coordinator.data.get("stats", {}).items():
        sensor_stats.append(
            LiveboxSensorEntityDescription(
                key=f"{name}_rate_rx",
                name=f"{item['friendly_name']} Rate Rx",
                value_fn=get_closure_value_fn(f"stats.{name}.rate_rx"),
                translation_key=f"{name}_rate_rx",
                native_unit_of_measurement=UnitOfDataRate.BYTES_PER_SECOND,
                suggested_unit_of_measurement=UnitOfDataRate.KILOBYTES_PER_SECOND,
                suggested_display_precision=1,
                state_class=SensorStateClass.MEASUREMENT,
                device_class=SensorDeviceClass.DATA_RATE,
            )
        )
        sensor_stats.append(
            LiveboxSensorEntityDescription(
                key=f"{name}_rate_tx",
                name=f"{item['friendly_name']} Rate Tx",
                value_fn=get_closure_value_fn(f"stats.{name}.rate_tx"),
                translation_key=f"{name}_rate_tx",
                native_unit_of_measurement=UnitOfDataRate.BYTES_PER_SECOND,
                suggested_unit_of_measurement=UnitOfDataRate.KILOBYTES_PER_SECOND,
                suggested_display_precision=1,
                state_class=SensorStateClass.MEASUREMENT,
                device_class=SensorDeviceClass.DATA_RATE,
            )
        )

    for description in SENSOR_TYPES + sensor_stats:
        if description.key in ["up", "down"] and linktype in ["gpon", "sfp"]:
            continue
        entities.append(LiveboxSensor(coordinator, description))

    async_add_entities(entities)

    # Repeater sensors: created as soon as the repeater is reachable — at setup
    # if it answered the first refresh, otherwise on the first later tick where
    # it shows up (before this, a repeater down at HA start meant no sensors
    # until a manual reload).
    rep_added = False

    @callback
    def _maybe_add_repeater() -> None:
        nonlocal rep_added
        if rep_added or not coordinator.data.get("repeater"):
            return
        rep_added = True
        async_add_entities(
            RepeaterSensor(coordinator, description)
            for description in REPEATER_SENSOR_TYPES
        )

    entry.async_on_unload(coordinator.async_add_listener(_maybe_add_repeater))
    _maybe_add_repeater()

    # Per-device diagnostic sensors (IP, MAC, nom Livebox, accès, signal, bande) —
    # rattachés au device HA de chaque appareil suivi, section Diagnostic. Créés
    # dynamiquement à mesure que de nouveaux appareils apparaissent, comme le
    # device_tracker. Données STABLES uniquement (pas de rx/tx).
    tracked_diag: set[str] = set()

    @callback
    def _add_device_diag() -> None:
        new = []
        for mac, device in coordinator.data.get("devices", {}).items():
            if mac in tracked_diag:
                continue
            for desc in DEVICE_DIAG_TYPES:
                # Les capteurs WiFi-only (signal/bande) ne sont créés que si
                # l'appareil a un SignalStrength (= connecté en WiFi).
                if desc.wifi_only and not device.get("SignalStrength"):
                    continue
                new.append(DeviceDiagSensor(coordinator, desc, mac))
            tracked_diag.add(mac)
        if new:
            async_add_entities(new)

    entry.async_on_unload(
        async_dispatcher_connect(
            hass, coordinator.signal_device_new, _add_device_diag
        )
    )
    _add_device_diag()


class LiveboxSensor(LiveboxEntity, SensorEntity):
    """Representation of a livebox sensor."""

    entity_description: LiveboxSensorEntityDescription

    def __init__(
        self,
        coordinator: LiveboxDataUpdateCoordinator,
        description: LiveboxSensorEntityDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, description)

    @property
    def native_value(self) -> float | None:
        """Return the native value of the device."""
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the device state attributes."""
        if self.entity_description.attrs:
            return {
                key: attr(self.coordinator.data)
                for key, attr in self.entity_description.attrs.items()
            }
        return None


class RepeaterSensor(RepeaterEntity, SensorEntity):
    """Representation of a WiFi 6 repeater sensor (distinct HA device)."""

    entity_description: LiveboxSensorEntityDescription

    @property
    def native_value(self) -> float | None:
        """Return the native value of the sensor."""
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the sensor state attributes."""
        if self.entity_description.attrs:
            return {
                key: attr(self.coordinator.data)
                for key, attr in self.entity_description.attrs.items()
            }
        return None


class DeviceDiagSensor(CoordinatorEntity[LiveboxDataUpdateCoordinator], SensorEntity):
    """A per-device diagnostic sensor, attached to that device's HA card.

    Uses the SAME device identifiers as the device_tracker (DOMAIN, device Key)
    so it lands in the Diagnostic section of the same device page. Reads its
    field from the fresh device dict each update.
    """

    entity_description: DeviceDiagDescription
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: LiveboxDataUpdateCoordinator,
        description: DeviceDiagDescription,
        mac: str,
    ) -> None:
        """Initialize the per-device diagnostic sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._mac = mac
        device = coordinator.data.get("devices", {}).get(mac, {})
        self._attr_unique_id = f"{coordinator.unique_id}_{mac}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.get("Key", mac))},
            via_device=(DOMAIN, coordinator.unique_id),
        )

    @property
    def native_value(self) -> Any:
        """Return the value from the fresh device dict."""
        device = self.coordinator.data.get("devices", {}).get(self._mac, {})
        return self.entity_description.value_fn(device)
