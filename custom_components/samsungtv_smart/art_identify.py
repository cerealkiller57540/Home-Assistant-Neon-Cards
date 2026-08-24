"""Artwork identification pipeline for Samsung Frame TVs (v8.4).

Two-stage, cache-first identification of the artwork currently shown on a
Frame TV:

1. **Reverse image search** — Google Cloud Vision *Web Detection* turns the
   thumbnail into concrete candidate titles/artists/pages pulled from the real
   web. This is the step a bare LLM cannot do (no vision model performs reverse
   image search; they identify "from memory" and hallucinate on obscure works).
2. **LLM confirmation** — an LLM (Anthropic, OpenAI or Gemini) is handed those
   candidates and the image, and asked to confirm ONLY if a candidate matches
   what it actually sees, otherwise return ``identified: false``. Feeding it
   real candidates collapses the hallucination surface: it verifies concrete
   names instead of guessing.

Everything is cached so the same artwork is never identified twice. The cache
key is chosen by how much we trust the Samsung id:

* ``SAM-*`` — global Art-Store catalogue id, stable across TV resets → the id
  is the key.
* anything else (``MY-*`` personal uploads, blank, unknown) — the id is a
  recyclable local slot number that a TV reset can re-assign to a different
  image, so it must NOT key the cache (a stale hit would show the wrong
  metadata). The key is the image content instead (``IMG-<sha256[:16]>``); the
  thumbnails we cache are the ones the integration downloaded, so they are
  byte-stable and hash reliably.

This module is provider-agnostic and free of Home Assistant entity code: it
takes the image bytes and the resolved config, and returns a plain dict. The
coordinator / sensor / service wiring lives elsewhere.
"""

from __future__ import annotations

import base64
import hashlib
import json
import logging
import time
from typing import Any

from aiohttp import ClientError, ClientSession

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store

from .const import (
    ART_CACHE_TTL_HIT,
    ART_CACHE_TTL_MISS,
    CONF_ART_IDENTIFY_ENABLE,
    CONF_ART_IDENTIFY_PERSONAL,
    CONF_ART_LLM_API_KEY,
    CONF_ART_LLM_MODEL,
    CONF_ART_LLM_PROVIDER,
    CONF_ART_VISION_API_KEY,
    DATA_ART_CACHE,
    DEFAULT_ART_LLM_MODEL,
    DEFAULT_ART_LLM_PROVIDER,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class VisionError(Exception):
    """Reverse-image-search (Google Vision) call failed."""


class LLMError(Exception):
    """LLM confirmation call failed or returned unparseable output."""


_VISION_URL = "https://vision.googleapis.com/v1/images:annotate"
_ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
_ANTHROPIC_VERSION = "2023-06-01"
_OPENAI_URL = "https://api.openai.com/v1/chat/completions"
_GEMINI_URL_TMPL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent?key={key}"
)

_CACHE_STORE_VERSION = 1
_HTTP_TIMEOUT = 45  # seconds per external call
# Output token budget for the confirmation reply. Must fit the whole JSON —
# title + three prose fields in every LANGS language — or the reply is
# truncated and fails to parse. 700 was fine single-language; 5 languages need
# far more headroom.
_LLM_MAX_TOKENS = 3000

# Languages the metadata is produced in, so each viewer can be shown the
# artwork description in their own UI language (the Lovelace card picks by the
# browser/user language). Keep 'en' first — it's the universal fallback.
LANGS = ("en", "fr", "es", "it", "pt-BR")

# Language-independent fields (kept once): identity + confidence.
TOP_LEVEL_KEYS = (
    "identified",
    "confidence",
    "matched_candidate",
    "artist",
    "date",
    "suggested_search_query",
)
# Fields produced per language (prose + the possibly-translated title).
TRANSLATED_FIELDS = (
    "title",
    "artwork_description",
    "artist_biography",
    "visual_description",
)
# Full set stored/returned: the top-level keys plus a 'translations' dict
# {lang: {translated field: value}}.
RESULT_KEYS = (*TOP_LEVEL_KEYS, "translations")


def derive_key(content_id: str | None, img_bytes: bytes) -> str:
    """Return the cache key for an artwork.

    ``SAM-*`` ids are global and stable → trusted as the key. Everything else
    is keyed by image content, so a recycled local id can never yield a stale
    hit for a different image.
    """
    if content_id and content_id.startswith("SAM-"):
        return content_id
    return "IMG-" + hashlib.sha256(img_bytes).hexdigest()[:16]


class ArtIdentifyCache:
    """Persistent, TTL'd cache of identification results (one per config entry).

    Backed by Home Assistant's ``Store`` (JSON under ``.storage/``): survives
    restarts and container updates, needs no extra dependency, and is plenty
    for the few dozen artworks that actually rotate on a Frame.
    """

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        # _v2 = multilingual schema; the old single-language cache file is left
        # untouched but no longer read, so entries re-identify once into all
        # languages instead of surfacing a partial (English-only) result.
        self._store: Store = Store(
            hass, _CACHE_STORE_VERSION, f"samsungtv_smart_art_cache_v2_{entry_id}"
        )
        self._data: dict[str, dict[str, Any]] = {}
        self._loaded = False

    async def async_load(self) -> None:
        """Load the cache from disk once."""
        if self._loaded:
            return
        stored = await self._store.async_load()
        if isinstance(stored, dict):
            self._data = stored
        self._loaded = True

    def get(self, key: str) -> dict[str, Any] | None:
        """Return a non-expired cached result, or None.

        A hit (identified) is kept effectively forever; a miss is retried after
        ``ART_CACHE_TTL_MISS``. Expired entries return None so the caller
        re-runs the pipeline.
        """
        entry = self._data.get(key)
        if not entry:
            return None
        ttl = ART_CACHE_TTL_HIT if entry.get("identified") else ART_CACHE_TTL_MISS
        if time.time() - entry.get("_fetched_at", 0) > ttl:
            return None
        result = {k: entry.get(k) for k in RESULT_KEYS}
        result["source"] = "cache"
        return result

    async def async_put(self, key: str, result: dict[str, Any]) -> None:
        """Store a fresh result (hit or miss) and persist it. Errors are not cached."""
        entry = {k: result.get(k) for k in RESULT_KEYS}
        entry["_fetched_at"] = time.time()
        self._data[key] = entry
        await self._store.async_save(self._data)

    async def async_invalidate(self, key: str) -> None:
        """Drop one entry (used by a forced re-identification)."""
        if self._data.pop(key, None) is not None:
            await self._store.async_save(self._data)


async def async_vision_web_detection(
    session: ClientSession, api_key: str, img_b64: str
) -> dict[str, list[str]]:
    """Run Google Cloud Vision Web Detection on a base64 image.

    Returns the useful, de-noised bits: the best-guess label(s) (often
    literally "Title — Artist"), the higher-confidence web entities, and the
    titles of pages the image appears on (galleries/stock listings usually
    carry the real title + credit). Raises on transport/API failure so the
    caller can avoid caching a non-answer.
    """
    body = {
        "requests": [
            {
                "image": {"content": img_b64},
                "features": [{"type": "WEB_DETECTION", "maxResults": 10}],
            }
        ]
    }
    async with session.post(
        f"{_VISION_URL}?key={api_key}", json=body, timeout=_HTTP_TIMEOUT
    ) as resp:
        if resp.status != 200:
            text = await resp.text()
            raise VisionError(f"Vision API {resp.status}: {text[:200]}")
        data = await resp.json()
    wd = (data.get("responses") or [{}])[0].get("webDetection", {}) or {}
    return {
        "best_guess": [
            b.get("label") for b in wd.get("bestGuessLabels", []) if b.get("label")
        ],
        "entities": [
            e["description"]
            for e in wd.get("webEntities", [])
            if e.get("description") and e.get("score", 0) > 0.5
        ][:8],
        "pages": [
            p.get("pageTitle")
            for p in wd.get("pagesWithMatchingImages", [])
            if p.get("pageTitle")
        ][:5],
    }


def _build_llm_prompt(candidates: dict[str, list[str]]) -> str:
    """Prompt that hands the reverse-search candidates to the LLM for checking.

    Asks for the descriptive fields in every language of ``LANGS`` so each
    viewer can be shown the metadata in their own UI language from a single
    call (cheaper and consistent vs one call per language).
    """
    langs = ", ".join(LANGS)
    return (
        "This image is the thumbnail of the artwork currently displayed on a "
        "Samsung The Frame TV. A reverse image search returned these CANDIDATES "
        "(possibly wrong):\n"
        f"- Best guess: {' / '.join(candidates.get('best_guess') or []) or '(none)'}\n"
        f"- Web entities: {', '.join(candidates.get('entities') or []) or '(none)'}\n"
        f"- Page titles: {' | '.join(candidates.get('pages') or []) or '(none)'}\n\n"
        "Your task: confirm the identification ONLY if a candidate is consistent "
        "with what you actually SEE in the image. If none matches, set "
        '"identified": false and leave artist/date null and translations {}. '
        "Do NOT invent facts. Separate the visual description from the factual "
        "identification. confidence is a number from 0 to 1.\n"
        f"Provide title, artwork_description, artist_biography and "
        f"visual_description in ALL these languages: {langs}. artist, date and "
        "suggested_search_query stay in one language (English). Translate the "
        "prose naturally, don't just transliterate.\n"
        "Reply with ONLY valid JSON (no prose, no markdown fences), schema:\n"
        '{"identified": false, "confidence": 0.0, "matched_candidate": null, '
        '"artist": null, "date": null, "suggested_search_query": null, '
        '"translations": {"en": {"title": null, "artwork_description": null, '
        '"artist_biography": null, "visual_description": ""}, '
        '"fr": {"title": null, "artwork_description": null, '
        '"artist_biography": null, "visual_description": ""}, '
        '"es": {...}, "it": {...}, "pt-BR": {...}}}'
    )


def _parse_llm_json(raw: str) -> dict[str, Any]:
    """Extract the JSON object from an LLM reply, tolerating stray fences/prose."""
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise LLMError(f"no JSON object in LLM reply: {raw[:200]}")
    return json.loads(raw[start : end + 1])


async def async_llm_confirm(
    session: ClientSession,
    provider: str,
    api_key: str,
    model: str,
    img_b64: str,
    candidates: dict[str, list[str]],
) -> dict[str, Any]:
    """Ask the configured LLM to confirm/enrich against the candidates.

    Provider-agnostic wrapper over the Anthropic, OpenAI and Gemini vision
    chat APIs. Raises on transport/parse failure (not cached).
    """
    prompt = _build_llm_prompt(candidates)
    if provider == "anthropic":
        headers = {
            "x-api-key": api_key,
            "anthropic-version": _ANTHROPIC_VERSION,
            "content-type": "application/json",
        }
        body = {
            "model": model,
            "max_tokens": _LLM_MAX_TOKENS,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": img_b64,
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        }
        url = _ANTHROPIC_URL
    elif provider == "openai":
        headers = {
            "Authorization": f"Bearer {api_key}",
            "content-type": "application/json",
        }
        # max_completion_tokens (not the deprecated max_tokens) — the gpt-5 /
        # o-series models reject max_tokens outright; it works for gpt-4o too.
        # temperature is intentionally omitted: the reasoning models only
        # accept the default, and the reverse-search candidates + json_object
        # already constrain the answer, so determinism isn't needed here.
        body = {
            "model": model,
            "max_completion_tokens": _LLM_MAX_TOKENS,
            "response_format": {"type": "json_object"},
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"},
                        },
                    ],
                }
            ],
        }
        url = _OPENAI_URL
    elif provider == "gemini":
        headers = {"content-type": "application/json"}
        body = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": img_b64,
                            }
                        },
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": _LLM_MAX_TOKENS,
                "response_mime_type": "application/json",
            },
        }
        # Gemini takes the key as a query param, not a header.
        url = _GEMINI_URL_TMPL.format(model=model, key=api_key)
    else:
        raise LLMError(f"unknown LLM provider: {provider!r}")

    async with session.post(
        url, json=body, headers=headers, timeout=_HTTP_TIMEOUT
    ) as resp:
        if resp.status != 200:
            text = await resp.text()
            raise LLMError(f"{provider} API {resp.status}: {text[:200]}")
        data = await resp.json()

    if provider == "anthropic":
        blocks = data.get("content") or []
        raw = next((b.get("text", "") for b in blocks if b.get("type") == "text"), "")
    elif provider == "gemini":
        parts = (
            (data.get("candidates") or [{}])[0].get("content", {}).get("parts", [{}])
        )
        raw = "".join(p.get("text", "") for p in parts)
    else:
        raw = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
    _LOGGER.debug("LLM (%s/%s) raw reply: %s", provider, model, raw[:600])
    parsed = _parse_llm_json(raw)
    return _normalize_result(parsed)


def _normalize_result(parsed: dict[str, Any]) -> dict[str, Any]:
    """Coerce an LLM reply to the multilingual schema.

    Guarantees a ``translations`` dict with every ``LANGS`` entry present (each
    with the ``TRANSLATED_FIELDS`` keys), falling back to English for any
    language the model omitted so a viewer never gets an empty description.
    """
    result = {k: parsed.get(k) for k in TOP_LEVEL_KEYS}
    raw_tr = parsed.get("translations")
    if not isinstance(raw_tr, dict):
        raw_tr = {}
    en = raw_tr.get("en") if isinstance(raw_tr.get("en"), dict) else {}
    translations: dict[str, dict[str, Any]] = {}
    for lang in LANGS:
        block = raw_tr.get(lang) if isinstance(raw_tr.get(lang), dict) else {}
        translations[lang] = {
            field: block.get(field) or en.get(field) for field in TRANSLATED_FIELDS
        }
    result["translations"] = translations
    return result


async def async_identify(
    hass: HomeAssistant,
    session: ClientSession,
    cache: ArtIdentifyCache,
    content_id: str | None,
    image_bytes: bytes,
    *,
    vision_key: str,
    provider: str,
    llm_key: str,
    model: str,
    force: bool = False,
) -> dict[str, Any]:
    """Identify one artwork, cache-first.

    Returns a dict with the RESULT_KEYS plus ``source`` (``cache`` | ``fresh`` |
    ``error``). Transport/API errors return ``identified: false`` with
    ``source: error`` and are NOT cached, so the next artwork change retries.
    """
    await cache.async_load()
    key = derive_key(content_id, image_bytes)

    if force:
        _LOGGER.debug("Artwork %s: force=True, bypassing cache", key)
        await cache.async_invalidate(key)
    else:
        hit = cache.get(key)
        if hit is not None:
            _LOGGER.debug(
                "Artwork %s: cache HIT (identified=%s title=%s)",
                key,
                hit.get("identified"),
                hit.get("title"),
            )
            return hit
    _LOGGER.debug(
        "Artwork %s: cache miss — running pipeline (%d bytes, %s/%s)",
        key,
        len(image_bytes),
        provider,
        model,
    )

    img_b64 = base64.b64encode(image_bytes).decode()
    started = time.monotonic()
    try:
        candidates = await async_vision_web_detection(session, vision_key, img_b64)
        _LOGGER.debug(
            "Artwork %s: Vision candidates best_guess=%s | entities=%s | pages=%s",
            key,
            candidates.get("best_guess"),
            candidates.get("entities"),
            candidates.get("pages"),
        )
        result = await async_llm_confirm(
            session, provider, llm_key, model, img_b64, candidates
        )
    except (VisionError, LLMError, ClientError, TimeoutError, ValueError) as err:
        _LOGGER.warning("Artwork identification failed for %s: %s", key, err)
        return {
            **{k: None for k in RESULT_KEYS},
            "identified": False,
            "source": "error",
        }

    await cache.async_put(key, result)
    result["source"] = "fresh"
    _LOGGER.debug(
        "Artwork %s identified=%s title=%s artist=%s conf=%s in %.1fs (via %s/%s)",
        key,
        result.get("identified"),
        (result.get("translations") or {}).get("en", {}).get("title"),
        result.get("artist"),
        result.get("confidence"),
        time.monotonic() - started,
        provider,
        model,
    )
    return result


def _read_file_bytes(path: str) -> bytes:
    """Read a file's bytes (runs in the executor). Raises OSError if missing."""
    with open(path, "rb") as handle:
        return handle.read()


def get_shared_cache(hass: HomeAssistant, entry_id: str) -> ArtIdentifyCache:
    """Return the per-entry ArtIdentifyCache, creating it once.

    Shared between the manual service and the metadata sensor so both hit the
    same in-memory cache within a session.
    """
    store = hass.data[DOMAIN][entry_id]
    cache = store.get(DATA_ART_CACHE)
    if cache is None:
        cache = ArtIdentifyCache(hass, entry_id)
        store[DATA_ART_CACHE] = cache
    return cache


async def async_identify_for_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    content_id: str | None,
    *,
    cache: ArtIdentifyCache,
    force: bool = False,
) -> dict[str, Any]:
    """Resolve config + thumbnail for a config entry and run identification.

    The single entry point shared by the ``art_identify`` service and the
    metadata sensor. Returns the identification dict, or a dict with an
    ``error`` / ``skipped`` key describing why nothing ran (disabled, missing
    keys, personal artwork with the toggle off, thumbnail not downloaded yet).
    """
    data = entry.data
    if not data.get(CONF_ART_IDENTIFY_ENABLE):
        return {
            "error": "Art identification is disabled — enable it in the "
            "integration options (Configure → Art Identification)"
        }
    vision_key = data.get(CONF_ART_VISION_API_KEY)
    llm_key = data.get(CONF_ART_LLM_API_KEY)
    provider = data.get(CONF_ART_LLM_PROVIDER) or DEFAULT_ART_LLM_PROVIDER
    model = data.get(CONF_ART_LLM_MODEL) or DEFAULT_ART_LLM_MODEL.get(provider)
    if not vision_key or not llm_key:
        return {"error": "Vision and LLM API keys must be set in the options"}

    is_store = bool(content_id and content_id.startswith("SAM-"))
    _LOGGER.debug(
        "Art identify: content_id=%s store=%s provider=%s model=%s force=%s",
        content_id,
        is_store,
        provider,
        model,
        force,
    )
    if not is_store and not data.get(CONF_ART_IDENTIFY_PERSONAL):
        return {
            "skipped": "personal artwork identification is disabled",
            "content_id": content_id,
        }

    path = hass.config.path("www", "frame_art", entry.entry_id, "current.jpg")
    try:
        image_bytes = await hass.async_add_executor_job(_read_file_bytes, path)
    except OSError as ex:
        return {
            "error": f"thumbnail not available yet ({ex}); wait for the Frame "
            "Art sensor to download current.jpg"
        }
    _LOGGER.debug("Art identify: read thumbnail %s (%d bytes)", path, len(image_bytes))

    session = async_get_clientsession(hass)
    result = await async_identify(
        hass,
        session,
        cache,
        content_id,
        image_bytes,
        vision_key=vision_key,
        provider=provider,
        llm_key=llm_key,
        model=model,
        force=force,
    )
    result["content_id"] = content_id
    return result
