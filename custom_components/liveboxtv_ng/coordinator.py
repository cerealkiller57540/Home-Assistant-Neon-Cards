"""DataUpdateCoordinator pour Livebox TV UHD (NG)."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .api import LiveboxApiError, LiveboxTvApi
from .const import (
    CONF_COUNTRY,
    CONF_HOST,
    CONF_PORT,
    CONF_UPNP_PORT,
    DEFAULT_COUNTRY,
    DEFAULT_PORT,
    DEFAULT_UPNP_PORT,
    DOMAIN,
    SCAN_INTERVAL,
    STANDBY_ON,
)
from .epg import OrangeEpg
from .upnp import LiveboxUpnp

_LOGGER = logging.getLogger(__name__)


@dataclass
class LiveboxData:
    """État consolidé d'un décodeur à chaque cycle."""

    available: bool = False
    powered: bool = False
    osd_context: str | None = None
    mac_address: str | None = None
    friendly_name: str | None = None
    wol_support: bool = False
    epg_id: str | None = None
    channel_name: str | None = None
    media_type: str | None = None
    media_state: str | None = None
    # programme courant (EPG)
    program: dict[str, Any] | None = None
    # rempli par la couche UPnP (étape 2)
    volume: int | None = None
    muted: bool | None = None
    transport_state: str | None = None
    source_list: list[str] = field(default_factory=list)


class LiveboxCoordinator(DataUpdateCoordinator[LiveboxData]):
    """Pilote le polling d'un décodeur (API :8080 + EPG, UPnP branché à l'étape 2)."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.entry = entry
        session = async_get_clientsession(hass)
        self.host: str = entry.data[CONF_HOST]
        self.port: int = entry.data.get(CONF_PORT, DEFAULT_PORT)
        self.upnp_port: int = entry.data.get(CONF_UPNP_PORT, DEFAULT_UPNP_PORT)
        self.country: str = entry.data.get(CONF_COUNTRY, DEFAULT_COUNTRY)
        self.api = LiveboxTvApi(session, self.host, self.port, self.country)
        self.epg = OrangeEpg(session, self.country)
        # couche UPnP (MediaRenderer :42300) — volume/mute/transport réels
        self.upnp = LiveboxUpnp(self.host, self.upnp_port)
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN}_{self.host}",
            update_interval=SCAN_INTERVAL,
        )

    async def _async_update_data(self) -> LiveboxData:
        """Un cycle : interroge le décodeur ; box éteinte = available=False, pas d'erreur fatale."""
        data = LiveboxData()
        try:
            info = await self.api.async_get_information()
        except LiveboxApiError:
            # box éteinte / injoignable : entité 'unavailable', HA réessaie au cycle suivant.
            # On garde la source_list connue (EPG) pour ne pas la perdre.
            if self.data:
                data.source_list = self.data.source_list
            return data

        data.available = True
        data.powered = info.get("activeStandbyState") == STANDBY_ON
        data.osd_context = info.get("osdContext")
        data.mac_address = info.get("macAddress")
        data.friendly_name = info.get("friendlyName")
        data.wol_support = info.get("wolSupport") == "1"
        data.media_type = info.get("playedMediaType")
        data.media_state = info.get("playedMediaState")
        epg_id = info.get("playedMediaId") or None
        data.epg_id = epg_id

        # EPG dynamique (chaînes + programme courant), best-effort
        try:
            await self.epg.async_refresh()
            data.source_list = self.epg.source_list()
            if epg_id:
                data.channel_name = self.epg.name_from_epg_id(epg_id)
                data.program = self.epg.current_program(epg_id)
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("EPG indisponible: %s", err)
            if self.data:
                data.source_list = self.data.source_list

        # Couche UPnP (volume/mute/transport) — best-effort, JAMAIS bloquante :
        # timeout dur pour ne pas freiner le cycle ni le setup initial (cause de setup_in_progress).
        if self.upnp is not None:
            try:
                async with asyncio.timeout(4):
                    await self.upnp.async_update(data)
            except Exception as err:  # noqa: BLE001
                _LOGGER.debug("UPnP update skipped: %s", err)

        return data
