"""Récupération dynamique des chaînes + EPG depuis l'API Orange (woopic).

Évite de figer la liste des chaînes dans le code : elle est reconstruite à la volée
depuis l'API officielle Orange, donc suit l'évolution du bouquet. Le mapping de noms
(channels_fallback) ne sert qu'à l'affichage propre / au repli hors-ligne.

URL EPG woopic + en-têtes repris de AkA57/liveboxtvuhd
(https://github.com/AkA57/liveboxtvuhd — cf CREDITS.md).
"""
from __future__ import annotations

import logging
import re
import time
from typing import Any

import aiohttp

from .channels_fallback import CHANNEL_NAMES

_LOGGER = logging.getLogger(__name__)

EPG_URLS = {
    "france": "https://rp-ott-mediation-tv.woopic.com/api-gw/live/v3/applications/STB4PC/programs",
}
EPG_MCO = {"france": "OFR"}
EPG_UA = "Opera/9.80 (Linux i686; U; fr) Presto/2.10.287 Version/12.00 ; SC/IHD92 STB"

CACHE_TTL = 300  # s : on ne re-télécharge l'EPG qu'au plus toutes les 5 min


def _pretty_name(epg_id: str, external_id: str | None) -> str:
    """Nom d'affichage : mapping connu, sinon dérivé de l'externalId (livetv_tf1_ctv -> TF1)."""
    if epg_id in CHANNEL_NAMES:
        return CHANNEL_NAMES[epg_id]
    if external_id:
        m = re.match(r"livetv_(.+?)_[a-z]+$", external_id)
        token = m.group(1) if m else external_id
        return token.replace("_", " ").upper()
    return f"CH {epg_id}"


class OrangeEpg:
    """Charge la grille EPG Orange et en extrait la liste des chaînes + le programme courant."""

    def __init__(self, session: aiohttp.ClientSession, country: str = "france") -> None:
        self._session = session
        self.country = country if country in EPG_URLS else "france"
        self._raw: list[dict[str, Any]] = []
        self._fetched_at: float = 0.0
        # epg_id -> dict(name, zap, external_id)
        self._channels: dict[str, dict[str, Any]] = {}

    async def async_refresh(self, force: bool = False) -> None:
        """Télécharge l'EPG si le cache a expiré."""
        if not force and (time.monotonic() - self._fetched_at) < CACHE_TTL and self._channels:
            return
        url = EPG_URLS[self.country]
        params = {"mco": EPG_MCO.get(self.country, "OFR")}
        try:
            async with self._session.get(
                url,
                params=params,
                headers={"User-Agent": EPG_UA},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                resp.raise_for_status()
                data = await resp.json(content_type=None)
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            _LOGGER.debug("EPG Orange injoignable (%s) — repli sur le mapping local", err)
            if not self._channels:
                self._build_from_fallback()
            return

        programs = data if isinstance(data, list) else data.get("programs", [])
        self._raw = programs
        self._fetched_at = time.monotonic()
        self._build_channels()

    def _build_channels(self) -> None:
        chans: dict[str, dict[str, Any]] = {}
        for p in self._raw:
            cid = str(p.get("channelId", ""))
            if not cid or cid == "-1":
                continue
            if cid not in chans:
                chans[cid] = {
                    "epg_id": cid,
                    "zap": p.get("channelZappingNumber", 9999),
                    "external_id": p.get("externalId"),
                    "name": _pretty_name(cid, p.get("externalId")),
                }
        if chans:
            self._channels = chans
        elif not self._channels:
            self._build_from_fallback()

    def _build_from_fallback(self) -> None:
        self._channels = {
            cid: {"epg_id": cid, "zap": i, "external_id": None, "name": name}
            for i, (cid, name) in enumerate(CHANNEL_NAMES.items())
            if cid != "-1"
        }

    # ── accès ──
    def source_list(self) -> list[str]:
        return [c["name"] for c in sorted(self._channels.values(), key=lambda c: c["zap"])]

    def name_from_epg_id(self, epg_id: str | int | None) -> str | None:
        if epg_id is None:
            return None
        c = self._channels.get(str(epg_id))
        if c:
            return c["name"]
        # repli mapping statique
        return CHANNEL_NAMES.get(str(epg_id))

    def epg_id_from_name(self, name: str) -> str | None:
        for cid, c in self._channels.items():
            if c["name"] == name:
                return cid
        return None

    def current_program(self, epg_id: str | int | None) -> dict[str, Any] | None:
        """Programme en cours sur une chaîne (titre, image, durée, position)."""
        if epg_id is None:
            return None
        now = time.time()
        best = None
        for p in self._raw:
            if str(p.get("channelId")) != str(epg_id):
                continue
            start = p.get("diffusionDate", 0)
            dur = p.get("duration", 0)
            if start <= now <= start + dur:
                best = p
                break
        if not best:
            return None
        covers = best.get("covers") or []
        img = covers[0]["url"] if covers and covers[0].get("url") else None
        return {
            "title": best.get("title"),
            "synopsis": best.get("synopsis"),
            "image": img,
            "duration": best.get("duration"),
            "start": best.get("diffusionDate"),
            "genre": best.get("genre"),
        }
