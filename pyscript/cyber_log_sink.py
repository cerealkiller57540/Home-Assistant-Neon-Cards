r"""
cyber_log_sink.py — LE PUITS DE LOGS CYBER.

Écoute le topic MQTT `home/cyber_station/events` (alimenté par cyber_monitor.py
sur le Pi .51) et append chaque évènement dans un seul fichier :
    /config/logs/cyber_events.jsonl
accessible direct depuis \\192.168.1.60\config\logs\ sur le PC de Chris.

But : Chris ne va JAMAIS sur le Pi. Tous les pièges (honeypot Cowrie, faux
Redis/Telnet, zip bomb, tarpit, honeytokens) tombent dans ce fichier. Il y va
seulement s'il est d'humeur à fouiller.

PATTERN (copié sur heat_agent.py) : l'I/O fichier bloquante passe par une fonction
décorée @pyscript_executor — elle tourne dans un thread où les builtins normaux
(open(), os…) sont dispo. Dans le trigger on l'`await`. NE PAS utiliser open()
directement dans le trigger (sandbox pyscript : "name 'open' is not defined"), ni
task.executor (refuse les fonctions pyscript).
"""
import json
import os
import time

LOG_DIR   = "/config/logs"
LOG_FILE  = "/config/logs/cyber_events.jsonl"
MAX_BYTES = 8 * 1024 * 1024   # 8 Mo -> rotation (1 backup .1)
TOPIC     = "home/cyber_station/events"


@pyscript_executor
def _write_events(lines):
    """Append des lignes JSONL (thread : open() autorisé). Rotation best-effort."""
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        if os.path.exists(LOG_FILE) and os.path.getsize(LOG_FILE) > MAX_BYTES:
            bak = LOG_FILE + ".1"
            if os.path.exists(bak):
                os.remove(bak)
            os.rename(LOG_FILE, bak)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
    except Exception as e:
        log.error("[cyber_log_sink] échec écriture JSONL : " + str(e))


@mqtt_trigger(TOPIC)
def cyber_log_sink(payload=None, **kwargs):
    if not payload:
        return
    try:
        data = json.loads(payload)
    except Exception:
        data = {"ts_sink": round(time.time(), 3), "raw": str(payload)[:500]}
    events = data if isinstance(data, list) else [data]
    lines = []
    for ev in events:
        if not isinstance(ev, dict):
            ev = {"raw": str(ev)[:500]}
        ev.setdefault("ts_sink", round(time.time(), 3))
        lines.append(json.dumps(ev, ensure_ascii=False, separators=(",", ":")))
    if lines:
        _write_events(lines)
