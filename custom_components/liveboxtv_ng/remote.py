"""Entité remote pour Livebox TV UHD (NG) — envoi de touches télécommande."""
from __future__ import annotations

import asyncio
import logging
from collections.abc import Iterable
from typing import Any

from homeassistant.components.remote import RemoteEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DEFAULT_NAME, DOMAIN, KEYS
from .coordinator import LiveboxCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: LiveboxCoordinator = entry.runtime_data
    async_add_entities([LiveboxRemote(coordinator)])


class LiveboxRemote(CoordinatorEntity[LiveboxCoordinator], RemoteEntity):
    """Télécommande du décodeur."""

    _attr_has_entity_name = True
    _attr_name = "Télécommande"

    def __init__(self, coordinator: LiveboxCoordinator) -> None:
        super().__init__(coordinator)
        base = coordinator.entry.unique_id or coordinator.host
        self._attr_unique_id = f"{base}_remote"

    @property
    def device_info(self) -> DeviceInfo:
        base = self.coordinator.entry.unique_id or self.coordinator.host
        return DeviceInfo(
            identifiers={(DOMAIN, base)},
            name=self.coordinator.data.friendly_name or self.coordinator.entry.title or DEFAULT_NAME,
        )

    @property
    def available(self) -> bool:
        return self.coordinator.data.available

    @property
    def is_on(self) -> bool:
        return self.coordinator.data.powered

    async def async_turn_on(self, **kwargs: Any) -> None:
        if not self.coordinator.data.powered:
            await self.coordinator.api.async_press_key("POWER")
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        if self.coordinator.data.powered:
            await self.coordinator.api.async_press_key("POWER")
            await self.coordinator.async_request_refresh()

    async def async_send_command(self, command: Iterable[str], **kwargs: Any) -> None:
        """Envoie une ou plusieurs touches (cf KEYS dans const.py)."""
        num_repeats = kwargs.get("num_repeats", 1)
        delay = kwargs.get("delay_secs", 0.4)
        for _ in range(num_repeats):
            for cmd in command:
                key = cmd.strip().upper()
                if key not in KEYS:
                    raise ValueError(f"Touche inconnue: {cmd} (dispo: {', '.join(sorted(KEYS))})")
                await self.coordinator.api.async_press_key(key)
                await asyncio.sleep(delay)
