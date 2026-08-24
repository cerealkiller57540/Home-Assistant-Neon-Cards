r"""
driveway_cleanup.py — MÉNAGE DES CLIPS CAMÉRA DRIVEWAY.

Supprime les clips .mp4 de /media/driveway plus vieux que RETENTION_HOURS (48h).
Exposé comme service `pyscript.driveway_cleanup` ; appelé 1×/jour par une
automation (voir automations.yaml — "🧹 Driveway - Purge clips 48h").

PATTERN (copié sur cyber_log_sink.py / heat_agent.py) : l'I/O fichier bloquante
passe par une fonction décorée @pyscript_executor — elle tourne dans un thread où
les builtins normaux (open(), os…) sont dispo. NE PAS utiliser os/open()
directement dans le trigger (sandbox pyscript : "name 'open' is not defined").
"""

import os
import time

CLIP_DIR = "/media/driveway"
RETENTION_HOURS = 48
RETENTION_SECONDS = RETENTION_HOURS * 3600


@pyscript_executor
def _purge_old_clips():
    """Supprime les .mp4 trop vieux. Retourne (supprimés, restants, libéré_octets)."""
    deleted = 0
    kept = 0
    freed = 0
    try:
        if not os.path.isdir(CLIP_DIR):
            return (0, 0, 0)
        now = time.time()
        for name in os.listdir(CLIP_DIR):
            if not name.lower().endswith(".mp4"):
                continue
            path = os.path.join(CLIP_DIR, name)
            try:
                age = now - os.path.getmtime(path)
                if age > RETENTION_SECONDS:
                    size = os.path.getsize(path)
                    os.remove(path)
                    deleted += 1
                    freed += size
                else:
                    kept += 1
            except OSError:
                # fichier en cours d'écriture / déjà parti : on ignore
                pass
    except Exception as e:
        return ("ERR", str(e), 0)
    return (deleted, kept, freed)


@service
def driveway_cleanup():
    """Purge les clips Driveway > 48h. Appelable depuis une automation."""
    deleted, kept, freed = _purge_old_clips()
    if deleted == "ERR":
        log.warning(f"[driveway_cleanup] erreur: {kept}")
        return
    mb = round(freed / (1024 * 1024), 1)
    log.info(f"[driveway_cleanup] {deleted} clip(s) supprimé(s) (>{RETENTION_HOURS}h), "
             f"{kept} gardé(s), {mb} Mo libérés.")
