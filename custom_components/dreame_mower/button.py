"""Button entities for Dreame Mower actions."""

from __future__ import annotations

import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DATA_COORDINATOR, DOMAIN
from .coordinator import DreameMowerCoordinator
from .entity import DreameMowerEntity

_LOGGER = logging.getLogger(__name__)

# (item_key, icon, translation_key)
_RESET_BUTTONS = [
    ("blade", "mdi:scissors-cutting", "reset_blade"),
    ("brush", "mdi:brush", "reset_brush"),
    ("robot", "mdi:robot", "reset_robot_maintenance"),
]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Dreame Mower buttons from a config entry."""
    coordinator: DreameMowerCoordinator = hass.data[DOMAIN][entry.entry_id][DATA_COORDINATOR]
    entities: list[ButtonEntity] = [
        DreameMowerResetConsumableButton(coordinator, item, icon, translation_key)
        for item, icon, translation_key in _RESET_BUTTONS
    ]
    entities.append(DreameMowerDockWithoutStoppingButton(coordinator))
    async_add_entities(entities)


class DreameMowerResetConsumableButton(DreameMowerEntity, ButtonEntity):
    """Button that resets one CMS consumable counter to zero."""

    def __init__(
        self,
        coordinator: DreameMowerCoordinator,
        item: str,
        icon: str,
        translation_key: str,
    ) -> None:
        super().__init__(coordinator, f"reset_consumable_{item}")
        self._item = item
        self._attr_icon = icon
        self._attr_translation_key = translation_key

    async def async_press(self) -> None:
        """Reset the consumable counter and refresh coordinator data."""
        await self.coordinator.device.reset_consumable_counter(self._item)
        try:
            await self.coordinator.async_fetch_consumable_data()
        except Exception as ex:
            _LOGGER.warning("Consumable refresh after reset failed: %s", ex)


class DreameMowerDockWithoutStoppingButton(DreameMowerEntity, ButtonEntity):
    """Button that sends the mower to dock without cancelling the active task."""

    def __init__(self, coordinator: DreameMowerCoordinator) -> None:
        super().__init__(coordinator, "dock_without_stopping")
        self._attr_icon = "mdi:home-battery"
        self._attr_translation_key = "dock_without_stopping"

    async def async_press(self) -> None:
        """Send mower to dock without stopping the current task."""
        if not await self.coordinator.device.dock_without_stopping():
            _LOGGER.error("Failed to send mower to dock without stopping")
