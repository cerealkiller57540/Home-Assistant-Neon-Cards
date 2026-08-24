"""Entité media_player pour Livebox TV UHD (NG)."""
from __future__ import annotations

import logging

from homeassistant.components.media_player import (
    MediaPlayerDeviceClass,
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
    MediaPlayerState,
    MediaType,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DEFAULT_NAME, DOMAIN
from .coordinator import LiveboxCoordinator, LiveboxData

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: LiveboxCoordinator = entry.runtime_data
    async_add_entities([LiveboxMediaPlayer(coordinator)])


class LiveboxMediaPlayer(CoordinatorEntity[LiveboxCoordinator], MediaPlayerEntity):
    """Le décodeur en tant que media_player."""

    _attr_has_entity_name = True
    _attr_name = None  # nom = nom du device
    _attr_device_class = MediaPlayerDeviceClass.TV
    _attr_supported_features = (
        MediaPlayerEntityFeature.TURN_ON
        | MediaPlayerEntityFeature.TURN_OFF
        | MediaPlayerEntityFeature.NEXT_TRACK
        | MediaPlayerEntityFeature.PREVIOUS_TRACK
        | MediaPlayerEntityFeature.SELECT_SOURCE
        | MediaPlayerEntityFeature.PLAY
        | MediaPlayerEntityFeature.PAUSE
        | MediaPlayerEntityFeature.VOLUME_STEP
        | MediaPlayerEntityFeature.VOLUME_SET
        | MediaPlayerEntityFeature.VOLUME_MUTE
    )

    def __init__(self, coordinator: LiveboxCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = coordinator.entry.unique_id or coordinator.host

    @property
    def _data(self) -> LiveboxData:
        return self.coordinator.data

    @property
    def device_info(self) -> DeviceInfo:
        d = self._data
        return DeviceInfo(
            identifiers={(DOMAIN, self.coordinator.entry.unique_id or self.coordinator.host)},
            name=d.friendly_name or self.coordinator.entry.title or DEFAULT_NAME,
            manufacturer="Orange / SoftAtHome",
            model="Décodeur TV UHD",
            connections={("mac", d.mac_address)} if d.mac_address else set(),
        )

    @property
    def available(self) -> bool:
        return self._data.available

    @property
    def state(self) -> MediaPlayerState | None:
        d = self._data
        if not d.available:
            return MediaPlayerState.OFF
        if not d.powered:
            return MediaPlayerState.OFF
        # transport UPnP si dispo, sinon état média de l'API
        if d.transport_state == "PLAYING":
            return MediaPlayerState.PLAYING
        if d.transport_state == "PAUSED_PLAYBACK":
            return MediaPlayerState.PAUSED
        if d.media_state == "play":
            return MediaPlayerState.PLAYING
        if d.media_state == "pause":
            return MediaPlayerState.PAUSED
        return MediaPlayerState.ON

    @property
    def source(self) -> str | None:
        return self._data.channel_name

    @property
    def source_list(self) -> list[str]:
        return self._data.source_list

    @property
    def media_content_type(self) -> MediaType | None:
        return MediaType.CHANNEL

    @property
    def media_title(self) -> str | None:
        d = self._data
        if d.program and d.program.get("title"):
            return f"{d.channel_name or ''} — {d.program['title']}".strip(" —")
        return d.channel_name

    @property
    def media_image_url(self) -> str | None:
        if self._data.program:
            return self._data.program.get("image")
        return None

    @property
    def volume_level(self) -> float | None:
        v = self._data.volume
        return v / 100 if v is not None else None

    @property
    def is_volume_muted(self) -> bool | None:
        return self._data.muted

    # ── commandes (API :8080) ──
    async def async_turn_on(self) -> None:
        if not self._data.powered:
            await self.coordinator.api.async_press_key("POWER")
            await self.coordinator.async_request_refresh()

    async def async_turn_off(self) -> None:
        if self._data.powered:
            await self.coordinator.api.async_press_key("POWER")
            await self.coordinator.async_request_refresh()

    async def async_media_next_track(self) -> None:
        await self.coordinator.api.async_press_key("CH+")
        await self.coordinator.async_request_refresh()

    async def async_media_previous_track(self) -> None:
        await self.coordinator.api.async_press_key("CH-")
        await self.coordinator.async_request_refresh()

    async def async_media_play(self) -> None:
        await self.coordinator.api.async_press_key("PLAY/PAUSE")

    async def async_media_pause(self) -> None:
        await self.coordinator.api.async_press_key("PLAY/PAUSE")

    async def async_volume_up(self) -> None:
        await self.coordinator.api.async_press_key("VOL+")
        await self.coordinator.async_request_refresh()

    async def async_volume_down(self) -> None:
        await self.coordinator.api.async_press_key("VOL-")
        await self.coordinator.async_request_refresh()

    async def async_set_volume_level(self, volume: float) -> None:
        # volume réel via UPnP RenderingControl (0..100)
        if self.coordinator.upnp is not None:
            await self.coordinator.upnp.async_set_volume(round(volume * 100))
            await self.coordinator.async_request_refresh()

    async def async_mute_volume(self, mute: bool) -> None:
        # mute réel via UPnP si dispo, sinon touche télécommande
        if self.coordinator.upnp is not None:
            await self.coordinator.upnp.async_set_mute(mute)
        else:
            await self.coordinator.api.async_press_key("MUTE")
        await self.coordinator.async_request_refresh()

    async def async_select_source(self, source: str) -> None:
        epg_id = self.coordinator.epg.epg_id_from_name(source)
        if epg_id is None:
            _LOGGER.warning("Chaîne inconnue: %s", source)
            return
        await self.coordinator.api.async_set_channel_by_epg_id(epg_id)
        await self.coordinator.async_request_refresh()
