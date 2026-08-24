"""Couche UPnP (MediaRenderer :42300) — volume/mute (RenderingControl) + transport (AVTransport).

Utilise async-upnp-client, déjà embarqué par HA (intégration DLNA native).
Best-effort : si le MediaRenderer ne répond pas, on n'altère pas LiveboxData.
"""
from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from async_upnp_client.aiohttp import AiohttpRequester
from async_upnp_client.client_factory import UpnpFactory

from .const import UPNP_AVTRANSPORT, UPNP_RENDERING

if TYPE_CHECKING:
    from .coordinator import LiveboxData

_LOGGER = logging.getLogger(__name__)


class LiveboxUpnp:
    """Accès paresseux au MediaRenderer du décodeur."""

    def __init__(self, host: str, port: int) -> None:
        self._desc_url = f"http://{host}:{port}/description.xml"
        self._device = None
        self._rendering = None
        self._avtransport = None
        self._failed = False

    async def _ensure_device(self) -> bool:
        """Construit le device UPnP au 1er besoin (et le re-tente si la box revient)."""
        if self._device is not None:
            return True
        try:
            requester = AiohttpRequester(http_headers={"User-Agent": "HomeAssistant-liveboxtv_ng"})
            factory = UpnpFactory(requester)
            self._device = await factory.async_create_device(self._desc_url)
            self._rendering = self._device.service(UPNP_RENDERING)
            self._avtransport = self._device.service(UPNP_AVTRANSPORT)
            self._failed = False
            return True
        except Exception as err:  # noqa: BLE001
            # box éteinte / MediaRenderer absent : on réessaiera plus tard
            if not self._failed:
                _LOGGER.debug("MediaRenderer indisponible (%s)", err)
                self._failed = True
            self._device = None
            return False

    async def async_update(self, data: "LiveboxData") -> None:
        """Remplit volume / muted / transport_state dans LiveboxData (best-effort)."""
        if not await self._ensure_device():
            return
        # RenderingControl : volume + mute
        try:
            if self._rendering and self._rendering.has_action("GetVolume"):
                res = await self._rendering.async_call_action(
                    "GetVolume", InstanceID=0, Channel="Master"
                )
                data.volume = int(res.get("CurrentVolume"))
            if self._rendering and self._rendering.has_action("GetMute"):
                res = await self._rendering.async_call_action(
                    "GetMute", InstanceID=0, Channel="Master"
                )
                data.muted = bool(int(res.get("CurrentMute")))
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("RenderingControl: %s", err)
            self._device = None  # forcer reconstruction au prochain cycle
        # AVTransport : transport state
        try:
            if self._avtransport and self._avtransport.has_action("GetTransportInfo"):
                res = await self._avtransport.async_call_action("GetTransportInfo", InstanceID=0)
                data.transport_state = res.get("CurrentTransportState")
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("AVTransport: %s", err)

    async def async_set_volume(self, level_0_100: int) -> None:
        if not await self._ensure_device() or not self._rendering:
            return
        await self._rendering.async_call_action(
            "SetVolume", InstanceID=0, Channel="Master", DesiredVolume=int(level_0_100)
        )

    async def async_set_mute(self, mute: bool) -> None:
        if not await self._ensure_device() or not self._rendering:
            return
        await self._rendering.async_call_action(
            "SetMute", InstanceID=0, Channel="Master", DesiredMute=1 if mute else 0
        )
