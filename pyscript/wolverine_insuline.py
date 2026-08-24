"""
wolverine_insuline.py — Service de log JSONL pour le copilote insuline de Wolverine.

Expose le service `pyscript.log_insuline` appelé par les automations du package
`copilote_wolverine.yaml` à chaque injection CONFIRMÉE (clic « Fait » dans Telegram).

CONTRAT JSONL (LOG_PATH) — 1 ligne JSON par injection confirmée :
    ts        : ISO local (horodatage de la confirmation)
    moment    : "matin" | "soir"
    source    : ce qui a déclenché le nudge ("sonos" | "filet_0930" | "plus12h" | "manuel")
    snoozes   : nb de snooze 15 min avant confirmation (0 si direct)
    en_retard : bool — confirmée après ≥1 escalade (relance 15 min déclenchée)

Lisible plus tard pour montrer l'historique au vétérinaire.

NOTES PYSCRIPT (cf. heat_agent.py) :
    - @pyscript_executor : tourne dans un thread → open() / I/O bloquant autorisé.
    - @service : exposé comme service HA (pyscript.log_insuline).
    - Namespaces injectés runtime par pyscript : log, service… (un linter qui
      marque "log is not defined" se trompe : injection runtime.)
    - Après édition : `pyscript.reload`. Valider la syntaxe AVANT avec ast.parse.

VALIDER LA SYNTAXE après édition (Python est sur Windows) :
   & "C:\\Users\\chris\\AppData\\Local\\Programs\\Python\\Python314\\python.exe" -c ^
     "import ast; ast.parse(open(r'//192.168.1.60/config/pyscript/wolverine_insuline.py',encoding='utf-8').read()); print('OK')"
   Puis : service pyscript.reload.
"""

import json
from datetime import datetime

LOG_PATH = "/config/logs/wolverine_insuline.jsonl"  # 1 ligne JSON / injection confirmée


@pyscript_executor
def _append_jsonl(path, entry_json):
    """I/O bloquante (thread) : append une ligne au JSONL, UTF-8, ensure_ascii=False."""
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry_json + "\n")


@service
async def log_insuline(moment="matin", source="manuel", snoozes=0, en_retard=False):
    """
    Logge une injection confirmée. Appelé par l'automation handler `/INSU_OK`.

    Paramètres (passés en data du service) :
      moment    : "matin" | "soir"
      source    : déclencheur du nudge ("sonos" | "filet_0930" | "plus12h" | "manuel")
      snoozes   : nombre de snooze 15 min avant confirmation
      en_retard : True si confirmée après au moins une escalade
    """
    entry = {
        "ts": datetime.now().isoformat(timespec="seconds"),
        "moment": str(moment),
        "source": str(source),
        "snoozes": int(snoozes),
        "en_retard": bool(en_retard),
    }
    entry_json = json.dumps(entry, ensure_ascii=False)
    await _append_jsonl(LOG_PATH, entry_json)
    log.info(f"[wolverine_insuline] injection loggée: {entry_json}")
