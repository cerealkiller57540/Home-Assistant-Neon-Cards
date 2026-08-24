"""
One-shot : patch défensif de reolink_aio pour l'issue home-assistant/core#176726.

Bug : sur firmware récent (ex. Elite Floodlight Wifi, mais aussi notre PTZ .55),
`GetEvents` renvoie parfois une LISTE au lieu d'un dict pour une clé `ai`, et
`map_channel_json_response` crashe sur `value.get("support", ...)` -> AttributeError
'list' object has no attribute 'get' -> TOUT le parsing des events échoue (détection
personne/animal dégradée). Cf mémoire project_camera_driveway_reolink.

Fix (aligné sur ce que fera l'upstream) : garde `isinstance(value, dict)` en tête de
la boucle `for key, value in data["value"]["ai"].items():` -> skip + log debug la clé
fautive au lieu de crasher. On NE PATCHE PAS les lignes sœurs non confirmées.

⚠️ Patch ÉPHÉMÈRE : site-packages vit dans l'image du conteneur core -> une MAJ core
le restaure. Idempotent + ancré sur une STRING (pas un n° de ligne). Re-lancer après
chaque MAJ core ; si l'ancre "not found" -> l'upstream a fixé, on peut arrêter.

Déclencheur : service `pyscript.reolink_patch_apply` (appelé par Claude via ha.py call).
Résultat rapporté dans state.pyscript.reolink_patch_result + persistent_notification.
"""

ANCHOR = 'for key, value in data["value"]["ai"].items():'
# Le fix inséré JUSTE APRÈS l'ancre (même indentation que le corps de boucle).
# On détecte l'indentation à l'exécution pour coller au style du fichier.
GUARD_MARKER = "reolink#176726 guard"


@pyscript_executor
def _apply_patch():
    """Thread dédié -> open/os/importlib/py_compile autorisés. Retourne (ok, msg)."""
    import importlib
    import os
    import py_compile
    import shutil
    import datetime

    try:
        mod = importlib.import_module("reolink_aio.api")
        path = mod.__file__
    except Exception as e:  # noqa: BLE001
        return (False, f"import reolink_aio.api KO: {e!r}")

    if not path or not os.path.isfile(path):
        return (False, f"chemin api.py introuvable: {path!r}")

    try:
        with open(path, "r", encoding="utf-8") as f:
            src = f.read()
    except Exception as e:  # noqa: BLE001
        return (False, f"lecture {path} KO: {e!r}")

    # --- idempotence ---
    if GUARD_MARKER in src:
        return (True, f"DEJA PATCHE (marqueur present) : {path}")

    # --- ancre ---
    idx = src.find(ANCHOR)
    if idx < 0:
        return (True, f"ANCRE INTROUVABLE dans {path} -> upstream a probablement "
                      f"deja fixe le bug, rien a faire (arreter de re-patcher).")

    # indentation de la ligne d'ancre
    line_start = src.rfind("\n", 0, idx) + 1
    indent = src[line_start:idx]  # espaces avant 'for'
    body_indent = indent + "    "  # corps de boucle = +4

    # fin de la ligne d'ancre
    eol = src.find("\n", idx)
    if eol < 0:
        return (False, "ancre en fin de fichier sans newline (inattendu)")

    guard = (
        f"\n{body_indent}# {GUARD_MARKER}: certains firmwares renvoient une liste "
        f"au lieu d'un dict\n"
        f"{body_indent}if not isinstance(value, dict):\n"
        f"{body_indent}    _LOGGER.debug(\"reolink ai key %s non-dict (%r), skip\", key, value)\n"
        f"{body_indent}    continue\n"
    )
    new_src = src[:eol] + guard + src[eol:]

    # --- backup sur le SHARE (survit a tout) ---
    try:
        ver = getattr(importlib.import_module("reolink_aio"), "__version__", "unknown")
    except Exception:  # noqa: BLE001
        ver = "unknown"
    bdir = "/config/reolink_patch"
    try:
        os.makedirs(bdir, exist_ok=True)
        ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        backup = f"{bdir}/api.py.orig-{ver}-{ts}"
        shutil.copy2(path, backup)
    except Exception as e:  # noqa: BLE001
        return (False, f"backup KO (patch NON applique): {e!r}")

    # --- ecriture atomique + py_compile AVANT de valider ---
    tmp = path + ".tmp-176726"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(new_src)
        py_compile.compile(tmp, doraise=True)  # casse ici si syntaxe KO
    except Exception as e:  # noqa: BLE001
        try:
            if os.path.exists(tmp):
                os.remove(tmp)
        except Exception:  # noqa: BLE001
            pass
        return (False, f"py_compile KO, patch NON applique (fichier intact): {e!r}")

    try:
        os.replace(tmp, path)  # remplace l'original seulement apres compile OK
    except Exception as e:  # noqa: BLE001
        return (False, f"remplacement KO: {e!r} (backup: {backup})")

    return (True, f"PATCH OK reolink_aio {ver} : {path} (backup {backup}). "
                  f"Restart core requis pour recharger le module.")


@service
def reolink_patch_apply(**kwargs):
    """Applique le patch défensif reolink #176726. Idempotent."""
    ok, msg = _apply_patch()
    state.set("pyscript.reolink_patch_result", "ok" if ok else "error",
              {"message": msg})
    log.warning("reolink_patch: %s", msg)
    service.call("persistent_notification", "create",
                 notification_id="reolink_patch_176726",
                 title="Patch Reolink #176726",
                 message=msg)
