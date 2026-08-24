"""Client asynchrone pour l'API remoteControl (port 8080) du décodeur Livebox TV UHD."""
from __future__ import annotations

import logging
from typing import Any

import aiohttp

from .const import (
    HTTP_TIMEOUT,
    OPERATION_CHANNEL_CHANGE,
    OPERATION_INFORMATION,
    OPERATION_KEYPRESS,
    KEYS,
)

_LOGGER = logging.getLogger(__name__)


class LiveboxApiError(Exception):
    """Erreur de communication avec le décodeur."""


class LiveboxTvApi:
    """Accès async à l'API remoteControl locale du décodeur (HTTP :8080)."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        host: str,
        port: int,
        country: str = "france",
    ) -> None:
        self._session = session
        self.host = host
        self.port = port
        self.country = country

    @property
    def base_url(self) -> str:
        return f"http://{self.host}:{self.port}/remoteControl/cmd"

    async def _request(self, operation: str, params: dict[str, Any] | None = None) -> dict | None:
        """Appel GET à l'API remoteControl. Renvoie le JSON ou lève LiveboxApiError."""
        query: dict[str, Any] = {"operation": operation}
        if params:
            query.update(params)
        try:
            async with self._session.get(
                self.base_url,
                params=query,
                timeout=aiohttp.ClientTimeout(total=HTTP_TIMEOUT),
            ) as resp:
                resp.raise_for_status()
                return await resp.json(content_type=None)
        except (aiohttp.ClientError, TimeoutError) as err:
            raise LiveboxApiError(f"{self.host}: {err}") from err

    async def async_get_information(self) -> dict[str, Any]:
        """operation=10 : état complet du décodeur (osdContext, média, mac, standby…)."""
        data = await self._request(OPERATION_INFORMATION)
        if not data:
            raise LiveboxApiError("réponse vide")
        try:
            return data["result"]["data"]
        except (KeyError, TypeError) as err:
            raise LiveboxApiError(f"format inattendu: {err}") from err

    async def async_press_key(self, key: str, mode: int = 0) -> None:
        """Envoie une touche télécommande (mode 0=press)."""
        code = KEYS.get(key.upper())
        if code is None:
            raise LiveboxApiError(f"touche inconnue: {key}")
        await self._request(OPERATION_KEYPRESS, {"key": code, "mode": mode})

    async def async_set_channel_by_epg_id(self, epg_id: int | str) -> None:
        """Change de chaîne par EPG ID (padding '*' à 10 chars, comme l'API officielle)."""
        epg_id_str = str(epg_id).rjust(10, "*")
        await self._request(OPERATION_CHANNEL_CHANGE, {"epg_id": epg_id_str, "uui": "1"})
