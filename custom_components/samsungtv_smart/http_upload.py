"""Authenticated HTTP endpoint for one-click artwork upload from a card.

A custom Lovelace card (``samsung-art-upload-card``) POSTs a picked image file
straight to this view, which pushes it to the Frame TV — no pre-placed file, no
folder sensor, no coding. The heavy lifting reuses the existing
``samsungtv_smart.art_upload`` service (ensure Art Mode, refresh, retry the
TV-side thumbnail), so this view is just: receive the multipart file → write a
temp file → call the service → return the content_id.
"""

from __future__ import annotations

import logging
import os
import tempfile

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Guard against absurd uploads (Frame art is a few MB at most).
_MAX_UPLOAD_BYTES = 50 * 1024 * 1024


class SamsungArtUploadView(HomeAssistantView):
    """POST an image and push it to a Frame TV entity (auth required)."""

    url = f"/api/{DOMAIN}/art_upload"
    name = f"api:{DOMAIN}:art_upload"
    # requires_auth defaults to True — the card sends the user's access token.

    def __init__(self, hass: HomeAssistant) -> None:
        """Store hass for service calls."""
        self._hass = hass

    async def post(self, request: web.Request) -> web.Response:
        """Handle a multipart upload: fields ``entity_id``, ``file``, ``matte_id``."""
        try:
            reader = await request.multipart()
        except Exception:  # noqa: BLE001 - malformed request
            return self.json_message("Expected multipart/form-data", 400)

        entity_id: str | None = None
        matte_id = "shadowbox_polar"
        file_bytes: bytes | None = None

        async for part in reader:
            if part.name == "entity_id":
                entity_id = (await part.text()).strip()
            elif part.name == "matte_id":
                matte_id = (await part.text()).strip() or matte_id
            elif part.name == "file":
                chunks = bytearray()
                while chunk := await part.read_chunk():
                    chunks.extend(chunk)
                    if len(chunks) > _MAX_UPLOAD_BYTES:
                        return self.json_message("File too large", 413)
                file_bytes = bytes(chunks)

        if not entity_id:
            return self.json_message("Missing 'entity_id'", 400)
        if not file_bytes:
            return self.json_message("Missing 'file'", 400)

        # Validate the target is one of our media_player entities.
        state = self._hass.states.get(entity_id)
        if state is None or not entity_id.startswith("media_player."):
            return self.json_message(f"Unknown entity {entity_id}", 400)

        # Hand the raw bytes to the upload service: it normalises every
        # image (HEIC included) to a TV-safe baseline JPEG fitted to the
        # panel, so the card, the service and the batch behave the same.
        tmp_path = await self._hass.async_add_executor_job(
            _write_temp_file, file_bytes, ".img"
        )
        try:
            result = await self._hass.services.async_call(
                DOMAIN,
                "art_upload",
                {"entity_id": entity_id, "file_path": tmp_path, "matte_id": matte_id},
                blocking=True,
                return_response=True,
            )
        except Exception as ex:  # noqa: BLE001 - surface a clean error to the card
            _LOGGER.exception("Art upload via HTTP failed")
            return self.json_message(f"Upload failed: {ex}", 500)
        finally:
            await self._hass.async_add_executor_job(_remove_file, tmp_path)

        # The service returns per-entity results; take the one for our entity.
        payload = result.get(entity_id) if isinstance(result, dict) else result
        if isinstance(payload, dict) and payload.get("error"):
            return self.json_message(payload["error"], 502)
        return self.json(payload or {"success": True})


def _write_temp_file(data: bytes, suffix: str) -> str:
    """Write bytes to a temp file and return its path (executor)."""
    fd, path = tempfile.mkstemp(prefix="samsungtv_art_", suffix=suffix)
    with os.fdopen(fd, "wb") as handle:
        handle.write(data)
    return path


def _remove_file(path: str) -> None:
    """Best-effort temp file cleanup (executor)."""
    try:
        os.remove(path)
    except OSError:
        pass
