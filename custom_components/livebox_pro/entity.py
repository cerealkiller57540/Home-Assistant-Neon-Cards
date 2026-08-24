"""Parent Entity."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityDescription
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_USE_TLS, DOMAIN, TEMPLATE_SENSOR
from .coordinator import LiveboxDataUpdateCoordinator


class LiveboxEntity(CoordinatorEntity[LiveboxDataUpdateCoordinator]):
    """Base class for all entities."""

    entity_description: EntityDescription
    _attr_has_entity_name = True

    def __init__(
        self, coordinator: LiveboxDataUpdateCoordinator, description: EntityDescription
    ) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        self.entity_description = description

        config_entry = coordinator.config_entry
        infos = coordinator.data.get("infos", {})
        scheme = "https" if config_entry.data.get(CONF_USE_TLS) else "http"

        self._unique_name = infos.get("ProductClass", TEMPLATE_SENSOR)

        self._attr_unique_id = f"{coordinator.unique_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, coordinator.unique_id)},
            manufacturer=infos.get("Manufacturer"),
            model=infos.get("ModelName"),
            name=infos.get("ProductClass", TEMPLATE_SENSOR),
            sw_version=infos.get("SoftwareVersion"),
            configuration_url=f"{scheme}://{config_entry.data.get('host')}:{config_entry.data.get('port')}",
        )


class RepeaterEntity(CoordinatorEntity[LiveboxDataUpdateCoordinator]):
    """Base class for WiFi 6 repeater entities.

    Attached to a HA device DISTINCT from the box (its own identifiers),
    linked to the box via `via_device` so it nests under it in the UI. The
    repeater identity comes from coordinator.data["repeater"]["info"] and its
    IP from ["repeater"]["host"] (auto-discovered/fallback in the coordinator).
    """

    entity_description: EntityDescription
    _attr_has_entity_name = True

    def __init__(
        self, coordinator: LiveboxDataUpdateCoordinator, description: EntityDescription
    ) -> None:
        """Initialize the repeater entity."""
        super().__init__(coordinator)
        self.entity_description = description

        rep = coordinator.data.get("repeater", {})
        info = rep.get("info", {})
        serial = info.get("serial") or "repeater"
        host = rep.get("host")

        # unique_id is anchored on the repeater serial (stable), prefixed with
        # the box unique_id so two boxes' repeaters never collide.
        self._attr_unique_id = f"{coordinator.unique_id}_rep_{serial}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"repeater_{serial}")},
            via_device=(DOMAIN, coordinator.unique_id),
            manufacturer="Sagemcom",
            model=info.get("model", "Wifi_6_Repeater"),
            name="Répéteur WiFi 6",
            sw_version=info.get("sw_version"),
            configuration_url=f"http://{host}/" if host else None,
        )
