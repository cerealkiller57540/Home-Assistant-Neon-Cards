"""WiFi security-mode selects for Livebox Pro (one per radio band)."""

from __future__ import annotations

import logging

from homeassistant.components.select import SelectEntity, SelectEntityDescription
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import LiveboxConfigEntry
from .coordinator import WIFI_VAPS, LiveboxDataUpdateCoordinator
from .entity import LiveboxEntity

_LOGGER = logging.getLogger(__name__)

# Security modes we expose in the UI. The box also knows "None"/"WEP-64"... but
# we never want to offer an insecure downgrade, so the list stops at WPA2.
# WPA3-only bands (6 GHz) get a restricted list built at runtime from the box's
# own ModesAvailable, so we never present a mode the radio cannot accept.
SECURITY_MODES = ["WPA2-Personal", "WPA2-WPA3-Personal", "WPA3-Personal"]

SECURITY_ICON = "mdi:wifi-lock"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: LiveboxConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the WiFi security selects."""
    coordinator = entry.runtime_data
    security = coordinator.data.get("wifi_security", {})
    entities = [
        WifiSecuritySelect(coordinator, band)
        for band in WIFI_VAPS
        if band in security
    ]
    async_add_entities(entities)


class WifiSecuritySelect(LiveboxEntity, SelectEntity):
    """Security mode of one WiFi band."""

    _attr_icon = SECURITY_ICON
    _attr_entity_category = None

    def __init__(
        self, coordinator: LiveboxDataUpdateCoordinator, band: str
    ) -> None:
        """Initialize the select for a given band."""
        description = SelectEntityDescription(
            key=f"wifi_security_{band}",
            name=f"WiFi security {band}",
        )
        super().__init__(coordinator, description)
        self._band = band

    def _band_data(self) -> dict:
        return self.coordinator.data.get("wifi_security", {}).get(self._band, {})

    @property
    def options(self) -> list[str]:
        """Return only the modes this radio actually supports."""
        available = self._band_data().get("modes_available", "") or ""
        supported = [m for m in SECURITY_MODES if m in available]
        # Always keep the current mode selectable even if it is not in our
        # curated list, so HA never rejects the reported state.
        current = self._band_data().get("mode")
        if current and current not in supported:
            supported = [current, *supported]
        return supported

    @property
    def current_option(self) -> str | None:
        """Return the security mode currently enabled on this band."""
        return self._band_data().get("mode")

    @property
    def extra_state_attributes(self) -> dict:
        """Expose PMF and SSID for context."""
        data = self._band_data()
        return {
            "pmf": data.get("pmf"),
            "ssid": data.get("ssid"),
            "vap": data.get("vap"),
        }

    async def async_select_option(self, option: str) -> None:
        """Change the security mode of this band."""
        vap = self._band_data().get("vap")
        if not vap:
            return
        _LOGGER.info(
            "Livebox Pro: setting %s WiFi security to %s (VAP %s)",
            self._band,
            option,
            vap,
        )
        await self.coordinator.async_set_wifi_mode(vap, option)
        await self.coordinator.async_request_refresh()
