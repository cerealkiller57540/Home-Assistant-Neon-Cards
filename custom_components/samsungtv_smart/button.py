"""Samsung TV reboot button (IP Control).

Exposes a single "Reboot TV" button, added only when the entry is paired for
IP Control (a CONF_IP_CONTROL_TOKEN is present) and the IP Control channel is
enabled in the options. Pressing it issues a reboot over the JSON-RPC channel
(port 1516), which is independent of the WebSocket channels — so it also
recovers a TV whose Art WebSocket has gone unresponsive.

The IP Control token survives the reboot, so no re-pairing is needed afterwards.
If the TV is off, it is powered on first and then rebooted. On an auth error the
IP Control persistent notification is raised; on success it is cleared.
"""

from __future__ import annotations

import asyncio
import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_ID, CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api.ipcontrol import (
    SamsungIPControl,
    SamsungIPControlAuthError,
    SamsungIPControlError,
)
from .const import CONF_ENABLE_IP_CONTROL, CONF_IP_CONTROL_TOKEN, DATA_CFG, DOMAIN
from .token_notify import METHOD_IP_CONTROL, clear_token_problem, notify_token_problem

_LOGGER = logging.getLogger(__name__)


def _ip_control_active(entry: ConfigEntry) -> bool:
    """True when IP Control is paired AND enabled in the options."""
    return bool(entry.data.get(CONF_IP_CONTROL_TOKEN)) and entry.options.get(
        CONF_ENABLE_IP_CONTROL, True
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the reboot button — only when IP Control is active."""
    if not _ip_control_active(entry):
        # Not paired, or the channel is disabled: no reboot path, so no button.
        # Pairing or re-enabling via the options flow reloads the entry and
        # adds it then.
        return

    config = hass.data[DOMAIN][entry.entry_id][DATA_CFG]
    host = config[CONF_HOST]
    device_unique_id = config.get(CONF_ID, entry.entry_id)
    device_name = config.get(CONF_NAME) or entry.title or host

    async_add_entities(
        [SamsungTVRebootButton(hass, entry, host, device_unique_id, device_name)]
    )


class SamsungTVRebootButton(ButtonEntity):
    """Button that reboots the TV via IP Control."""

    _attr_has_entity_name = True
    _attr_translation_key = "reboot"
    _attr_icon = "mdi:restart"

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        host: str,
        device_unique_id: str,
        device_name: str,
    ) -> None:
        """Initialize the reboot button."""
        self.hass = hass
        self._entry_id = entry.entry_id
        self._host = host
        self._device_unique_id = device_unique_id
        self._device_name = device_name
        self._attr_unique_id = f"{entry.entry_id}_ip_control_reboot"

    @property
    def device_info(self) -> DeviceInfo:
        """Link this entity to the TV device."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._device_unique_id)},
            name=self._device_name,
        )

    @property
    def available(self) -> bool:
        """Available only while IP Control is paired and enabled (read live)."""
        entry = self.hass.config_entries.async_get_entry(self._entry_id)
        return bool(entry and _ip_control_active(entry))

    def _device_title(self) -> str:
        entry = self.hass.config_entries.async_get_entry(self._entry_id)
        return entry.title if entry else (self._device_name or "this Samsung TV")

    async def async_press(self) -> None:
        """Reboot the TV via IP Control (powering it on first if it is off)."""
        entry = self.hass.config_entries.async_get_entry(self._entry_id)
        token = entry.data.get(CONF_IP_CONTROL_TOKEN) if entry else None
        if not token:
            raise HomeAssistantError(
                "IP Control is not paired for this TV — re-pair via the "
                "integration options first."
            )
        client = SamsungIPControl(self.hass, self._host, token=token)
        try:
            power = await client.async_get_power_state()
            if power == "powerOff":
                _LOGGER.info(
                    "TV %s is powered off — powering on before reboot", self._host
                )
                await client.async_power_on()
                # Wait for the TV to accept the reboot command after power-on.
                await asyncio.sleep(7)
            await client.async_reboot()
        except SamsungIPControlAuthError as ex:
            notify_token_problem(
                self.hass, self._entry_id, METHOD_IP_CONTROL, self._device_title()
            )
            raise HomeAssistantError(
                f"IP Control token rejected while rebooting {self._host}: {ex}"
            ) from ex
        except SamsungIPControlError as ex:
            raise HomeAssistantError(
                f"Failed to reboot {self._host} via IP Control: {ex}"
            ) from ex
        # Reboot accepted — token is valid, so clear any stale notification.
        clear_token_problem(self.hass, self._entry_id, METHOD_IP_CONTROL)
        _LOGGER.info("Reboot requested for %s via IP Control", self._host)
