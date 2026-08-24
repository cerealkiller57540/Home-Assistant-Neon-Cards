"""Upload sidecar: make re-running a folder upload cheap and idempotent.

A JSON map ``{filename: {content_id, modified}}`` recording what was uploaded
and when. On the next run, files whose modification time is unchanged are
skipped, so re-uploading the same folder uploads 0 files instead of creating
duplicates on the TV.

All functions are synchronous and do blocking file I/O — call them from the
executor (``hass.async_add_executor_job``), never directly on the event loop.
"""

from __future__ import annotations

import io
import json
import os

# Image extensions the batch uploader considers.
IMAGE_EXTS = (".jpg", ".jpeg", ".png")

# Perceptual dedup: a 64-bit dHash (row-difference hash) is robust to the TV's
# re-encode/resize of an uploaded image, so a candidate can be matched against
# the thumbnails already downloaded from the TV. The threshold is deliberately
# STRICT (a few bits) to protect against false skips: re-uploading a duplicate
# is harmless, but wrongly skipping means a photo silently never reaches the TV.
DHASH_MAX_DISTANCE = 4


def list_images(folder: str) -> list[str]:
    """Return the sorted absolute paths of the images directly in ``folder``."""
    try:
        names = os.listdir(folder)
    except OSError:
        return []
    out = [
        os.path.join(folder, n)
        for n in sorted(names)
        if n.lower().endswith(IMAGE_EXTS) and os.path.isfile(os.path.join(folder, n))
    ]
    return out


def safe_mtime(path: str) -> float:
    """Return the file's mtime, or 0.0 if it can't be read."""
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0.0


def load_sidecar(path: str) -> dict:
    """Load the sidecar map, or {} if it does not exist / is unreadable."""
    if not path or not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def save_sidecar(path: str, data: dict) -> None:
    """Persist the sidecar map (best effort)."""
    if not path:
        return
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except OSError:
        pass


def needs_upload(filename: str, mtime: float, sidecar: dict) -> bool:
    """True if the file is new or its mtime changed since the last upload."""
    entry = sidecar.get(filename)
    if not entry:
        return True
    return entry.get("modified") != mtime


# ── Perceptual dedup (opt-in) ──────────────────────────────────────────────


def dhash(data: bytes, size: int = 8) -> int | None:
    """Return a 64-bit row-difference perceptual hash, or None on any failure.

    None (unreadable bytes, or Pillow absent) means "can't fingerprint" — the
    caller must treat that as NOT a duplicate, never skipping on uncertainty.
    Pillow is imported lazily so a missing Pillow can't break the module.
    """
    try:
        from PIL import Image  # noqa: PLC0415 - lazy: keep PIL off the import path

        with Image.open(io.BytesIO(data)) as im:
            small = im.convert("L").resize((size + 1, size))
            px = list(small.getdata())
    except Exception:  # noqa: BLE001 - best effort; None disables the skip
        return None
    bits = 0
    for row in range(size):
        base = row * (size + 1)
        for col in range(size):
            bits = (bits << 1) | (1 if px[base + col] > px[base + col + 1] else 0)
    return bits


def hash_file(path: str) -> int | None:
    """dHash of a file's contents, or None if it can't be read/fingerprinted."""
    try:
        with open(path, "rb") as f:
            return dhash(f.read())
    except OSError:
        return None


def fingerprint_dir(folder: str) -> list[int]:
    """dHash of every readable image directly in ``folder`` (for reference)."""
    out: list[int] = []
    for path in list_images(folder):
        h = hash_file(path)
        if h is not None:
            out.append(h)
    return out


def _hamming(a: int, b: int) -> int:
    return bin(a ^ b).count("1")


def is_duplicate_hash(
    candidate: int | None, refs: list[int], threshold: int = DHASH_MAX_DISTANCE
) -> bool:
    """True only if ``candidate`` is confidently a near-duplicate of a ref.

    Returns False when the candidate can't be fingerprinted (``None``) — the
    anti-false-skip rule: never skip an upload on uncertainty.
    """
    if candidate is None:
        return False
    return any(_hamming(candidate, r) <= threshold for r in refs)
