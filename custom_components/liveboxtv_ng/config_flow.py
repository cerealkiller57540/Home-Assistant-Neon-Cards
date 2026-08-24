"""Config flow pour Orange Livebox TV UHD — setup UI + découverte SSDP & DHCP.

Robustesse DHCP (cas courant : IP non réservée) : l'unique_id est le MAC renvoyé par
l'API du décodeur (stable). Quand la box change d'IP, sa ré-annonce SSDP OU son nouveau
bail DHCP redéclenche le flow → `_abort_if_unique_id_configured(updates={host})` met à
jour l'IP stockée et l'entry est rechargée (update_listener). Plus de perte sur IP qui bouge.
"""
from __future__ import annotations

import logging
from typing import Any
from urllib.parse import urlparse

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_HOST, CONF_NAME, CONF_PORT
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.service_info.dhcp import DhcpServiceInfo
from homeassistant.helpers.service_info.ssdp import SsdpServiceInfo

from .api import LiveboxApiError, LiveboxTvApi
from .const import (
    CONF_COUNTRY,
    COUNTRIES,
    DEFAULT_COUNTRY,
    DEFAULT_NAME,
    DEFAULT_PORT,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


async def _async_probe(hass, host: str, port: int) -> dict[str, Any]:
    """Interroge le décodeur ; renvoie les infos ou lève LiveboxApiError."""
    session = async_get_clientsession(hass)
    api = LiveboxTvApi(session, host, port)
    return await api.async_get_information()


class LiveboxConfigFlow(ConfigFlow, domain=DOMAIN):
    """Gère l'ajout d'un décodeur (manuel, SSDP ou DHCP)."""

    VERSION = 1

    def __init__(self) -> None:
        self._discovered: dict[str, Any] = {}

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ajout manuel par IP."""
        errors: dict[str, str] = {}
        if user_input is not None:
            host = user_input[CONF_HOST]
            port = user_input.get(CONF_PORT, DEFAULT_PORT)
            try:
                info = await _async_probe(self.hass, host, port)
            except LiveboxApiError:
                errors["base"] = "cannot_connect"
            else:
                mac = info.get("macAddress")
                unique = mac or f"{host}:{port}"
                await self.async_set_unique_id(unique)
                self._abort_if_unique_id_configured(updates={CONF_HOST: host})
                return self.async_create_entry(
                    title=user_input.get(CONF_NAME) or info.get("friendlyName") or DEFAULT_NAME,
                    data={
                        CONF_HOST: host,
                        CONF_PORT: port,
                        CONF_NAME: user_input.get(CONF_NAME) or info.get("friendlyName") or DEFAULT_NAME,
                        CONF_COUNTRY: user_input.get(CONF_COUNTRY, DEFAULT_COUNTRY),
                    },
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_HOST): str,
                vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
                vol.Optional(CONF_NAME): str,
                vol.Optional(CONF_COUNTRY, default=DEFAULT_COUNTRY): vol.In(COUNTRIES),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_ssdp(self, discovery_info: SsdpServiceInfo) -> ConfigFlowResult:
        """Découverte automatique d'un décodeur Orange via SSDP."""
        host = urlparse(discovery_info.ssdp_location or "").hostname
        return await self._async_handle_discovered_host(host)

    async def async_step_dhcp(self, discovery_info: DhcpServiceInfo) -> ConfigFlowResult:
        """Découverte/maj via DHCP (nouveau bail) — gère les IP non réservées qui changent."""
        return await self._async_handle_discovered_host(discovery_info.ip)

    async def _async_handle_discovered_host(self, host: str | None) -> ConfigFlowResult:
        """Logique commune SSDP/DHCP : sonde la box, ancre sur le MAC API, met à jour l'IP."""
        if not host:
            return self.async_abort(reason="cannot_connect")
        # sonde pour confirmer que c'est un décodeur joignable + récupérer le MAC (unique_id stable)
        try:
            info = await _async_probe(self.hass, host, DEFAULT_PORT)
        except LiveboxApiError:
            return self.async_abort(reason="cannot_connect")

        mac = info.get("macAddress")
        await self.async_set_unique_id(mac or host)
        # si déjà configuré : met à jour l'IP (cas DHCP qui a changé) et stoppe.
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        name = info.get("friendlyName") or DEFAULT_NAME
        self._discovered = {
            CONF_HOST: host,
            CONF_PORT: DEFAULT_PORT,
            CONF_NAME: name,
            CONF_COUNTRY: DEFAULT_COUNTRY,
        }
        self.context["title_placeholders"] = {"name": f"{name} ({host})"}
        return await self.async_step_discovery_confirm()

    async def async_step_discovery_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirmation utilisateur d'un décodeur découvert."""
        if user_input is not None:
            return self.async_create_entry(
                title=self._discovered[CONF_NAME], data=self._discovered
            )
        return self.async_show_form(
            step_id="discovery_confirm",
            description_placeholders={
                "name": self._discovered[CONF_NAME],
                "host": self._discovered[CONF_HOST],
            },
        )
