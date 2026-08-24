#!/usr/bin/env python3
"""
reseau_diagnostic.py — Collecteur de contexte pour la corrélation "panne réseau".

Tourne en cron Hermes toutes les 5 min. Détecte quand PLUSIEURS équipements
suivis sont hors-ligne en même temps, et si c'est le cas, rassemble un faisceau
d'indices (statut WAN box, ping internet depuis le .53 filaire, état de chaque
équipement WiFi, nb d'appareils Livebox not_home) que l'agent Hermes transforme
en DIAGNOSTIC rédigé :
  - WAN box DOWN            -> coupure Orange (rien à faire).
  - WAN up + internet ok(.53) + plusieurs WiFi HS -> problème WiFi local.
  - un seul équipement HS   -> équipement isolé, PAS une coupure (silencieux).

Le script n'ENVOIE rien : il fournit le contexte, Hermes rédige/livre.
Anti-répétition : état persistant ; on ne ré-alerte pas tant que la panne dure
(réarmement quand tout est revenu en ligne).

Sortie stdout VIDE si pas de panne corrélée -> agent muet.
Debug : --dry-run (imprime le faisceau complet même si <2 HS, n'altère pas l'état).
"""
import os
import sys
import json
import urllib.request
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------- env
ENV_PATH = Path.home() / ".hermes" / ".env"
if ENV_PATH.exists():
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k, v)

HASS_URL = os.environ.get("HASS_URL", "http://192.168.1.60:8123")
HASS_TOKEN = os.environ.get("HASS_TOKEN")
HEADERS = {"Authorization": f"Bearer {HASS_TOKEN}", "Content-Type": "application/json"}
STATE_FILE = Path.home() / ".hermes" / "state" / "reseau_diagnostic.json"

# entités surveillées (WiFi) : (label, entity, états_qui_signifient_HS)
WATCHED = [
    ("Sonnette",        "binary_sensor.salon_sonnette", {"off", "unavailable", "unknown"}),
    ("Caméra allée",    "camera.driveway_fluide",       {"unavailable", "unknown"}),
    ("Batterie Storey", "device_tracker.sunology_storey", {"not_home"}),
    ("Sunology Stream", "device_tracker.sunology_stream_2", {"not_home"}),
]

# discriminants (santé infra filaire / box)
E_WAN = "binary_sensor.livebox_6_wan_status_2"          # on = WAN Orange up
E_WAN_TXT = "sensor.orange_livebox_etat_du_reseau_etendu_wan"  # "Connected"
E_PING_PERTE_CF = "sensor.ping_monitor_53_ping_cloudflare_dns_perte"  # % perte depuis .53
E_PI53_LOAD = "sensor.192_168_1_53_cpu_load"            # si présent -> .53 joignable


def ha_state(entity_id):
    url = f"{HASS_URL}/api/states/{entity_id}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


def get_str(entity_id, default="unknown"):
    try:
        return ha_state(entity_id)["state"]
    except Exception:
        return default


def count_livebox_offline():
    """Compte les device_tracker.* passés not_home (vus par la Livebox)."""
    try:
        url = f"{HASS_URL}/api/states"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        total = nothome = 0
        for e in data:
            if e["entity_id"].startswith("device_tracker."):
                total += 1
                if e["state"] == "not_home":
                    nothome += 1
        return nothome, total
    except Exception:
        return None, None


def load_state():
    try:
        return json.loads(STATE_FILE.read_text())
    except Exception:
        return {"alerted": False}


def save_state(st):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(st))


def build_context(dry=False):
    # état des équipements surveillés
    statuses = []
    hs = []
    for label, ent, hs_states in WATCHED:
        s = get_str(ent)
        is_hs = s in hs_states
        statuses.append((label, ent, s, is_hs))
        if is_hs:
            hs.append(label)

    st = load_state()

    # réarmement : si plus aucun HS, on réarme
    if not hs:
        if st.get("alerted"):
            st["alerted"] = False
            save_state(st)
        if not dry:
            return None, st, "aucun équipement HS"

    # corrélation : il faut AU MOINS 2 équipements HS (sinon isolé)
    if not dry and len(hs) < 2:
        return None, st, f"1 seul HS ({hs}) -> isolé, pas une coupure"

    # déjà alerté et panne toujours en cours -> ne pas répéter
    if not dry and st.get("alerted"):
        return None, st, "déjà alerté, panne en cours"

    # rassembler les discriminants
    wan = get_str(E_WAN)                 # on / off
    wan_txt = get_str(E_WAN_TXT)
    perte = get_str(E_PING_PERTE_CF)     # % perte paquets depuis .53
    pi53 = get_str(E_PI53_LOAD)          # valeur -> .53 répond
    nothome, total = count_livebox_offline()

    ctx = {
        "equipements_hs": hs,
        "detail_equipements": [(l, s, "HS" if h else "ok") for l, e, s, h in statuses],
        "wan_box": "UP (connectée Orange)" if wan == "on" else f"DOWN ({wan}/{wan_txt})",
        "ping_internet_depuis_53": (
            f"perte {perte}% (accès internet filaire OK)" if perte not in ("unknown", "unavailable") and _f(perte) == 0
            else f"perte {perte}%"),
        "pi_53_joignable": ("oui" if pi53 not in ("unknown", "unavailable") else "NON"),
        "appareils_livebox_offline": (f"{nothome}/{total}" if nothome is not None else "inconnu"),
        "heure": datetime.now().strftime("%H:%M"),
    }
    return ctx, st, "OK"


def _f(x):
    try:
        return float(x)
    except Exception:
        return None


def emit(ctx):
    detail = "\n".join(f"    · {l} : {s} [{k}]" for l, s, k in ctx["detail_equipements"])
    lines = [
        "CONTEXTE PANNE RÉSEAU — plusieurs équipements sont hors-ligne en même",
        "temps. Rédige pour Chris un DIAGNOSTIC Telegram court (2-3 phrases),",
        "préfixé '📡 RÉSEAU'. Distingue clairement les cas à partir des indices :",
        "  - si WAN box DOWN -> coupure Orange, rien à faire côté maison.",
        "  - si WAN box UP + internet OK depuis le .53 (filaire) mais plusieurs",
        "    appareils WiFi HS -> problème WiFi local (répéteur/2.4GHz).",
        "  - n'affirme pas plus que ce que disent les indices. N'invente rien.",
        "",
        f"- Équipements HS corrélés : {', '.join(ctx['equipements_hs'])}",
        "- Détail équipements surveillés :",
        detail,
        f"- Statut WAN box : {ctx['wan_box']}",
        f"- Ping internet depuis le .53 (filaire) : {ctx['ping_internet_depuis_53']}",
        f"- Serveur .53 joignable : {ctx['pi_53_joignable']}",
        f"- Appareils vus offline par la Livebox : {ctx['appareils_livebox_offline']}",
        f"- Heure : {ctx['heure']}",
    ]
    print("\n".join(lines))


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    if not HASS_TOKEN:
        print("Missing HASS_TOKEN in ~/.hermes/.env", file=sys.stderr)
        sys.exit(1)
    ctx, st, reason = build_context(dry=dry)
    if ctx is None:
        print(f"[SILENT] {reason}", file=sys.stderr)
        sys.exit(0)
    emit(ctx)
    if not dry:
        st["alerted"] = True
        st["last_alert"] = datetime.now().isoformat()
        save_state(st)
    else:
        print("\n(--dry-run : état NON modifié)", file=sys.stderr)
