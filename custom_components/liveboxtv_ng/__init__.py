"""Intégration Livebox TV UHD (NG) — setup via config entry."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import LiveboxCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.MEDIA_PLAYER, Platform.REMOTE]

type LiveboxConfigEntry = ConfigEntry[LiveboxCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: LiveboxConfigEntry) -> bool:
    """Configure un décodeur depuis une config entry."""
    coordinator = LiveboxCoordinator(hass, entry)
    # Premier refresh : si la box est éteinte, le coordinator renvoie available=False
    # SANS lever — donc l'entry se charge quand même (entités 'unavailable'), et HA
    # repeuplera dès que la box répond. Plus de perte au boot box-éteinte.
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: LiveboxConfigEntry) -> bool:
    """Décharge proprement."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: LiveboxConfigEntry) -> None:
    """Recharge l'entry quand les options changent."""
    await hass.config_entries.async_reload(entry.entry_id)
