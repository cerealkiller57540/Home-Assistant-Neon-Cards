#!/usr/bin/env python3
"""
surplus_solaire_context.py — Collecteur de contexte pour l'alerte "surplus solaire".

Tourne en cron Hermes toutes les 5 min (fenêtre jour). Vérifie les conditions
DURES ; si elles sont remplies, imprime sur STDOUT un briefing structuré que
l'agent Hermes (LLM) transforme en message Telegram enrichi et actionnable.
Si une condition n'est pas remplie -> stdout VIDE -> l'agent reste silencieux.

Conditions dures :
  1. surplus moyen 5 min >= SEUIL_ON (1500 W)
  2. Chris est à la maison (device_tracker.pixel_9a == home)
  3. réarmement : on n'a pas déjà alerté sans que le surplus soit retombé
     sous SEUIL_REARM (800 W) entre-temps. État persistant dans un fichier JSON.

Le script N'ENVOIE RIEN lui-même : il fournit les données, Hermes rédige/livre.

Sortie (si alerte) : bloc texte 'CONTEXTE SURPLUS SOLAIRE' avec les champs bruts
+ des indications déjà interprétées (batterie pleine ?, HP/HC, météo) pour
guider la rédaction. Le LLM ne fait que mettre en forme — il n'invente aucune
donnée.

Debug : --dry-run (ignore le réarmement, imprime le contexte même si déjà alerté).
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

STATE_FILE = Path.home() / ".hermes" / "state" / "surplus_solaire.json"

# ---------------------------------------------------------------- réglages
SEUIL_ON = 1500      # W : déclenche l'alerte
SEUIL_REARM = 800    # W : le surplus doit repasser sous ce seuil pour réarmer
BATT_PLEINE = 90     # % : au-delà, on considère le surplus "gaspillé"

# entités réelles (vérifiées 2026-07-13)
E_SURPLUS = "sensor.surplus_solaire_moyen_5_min"
E_SURPLUS_INST = "sensor.surplus_solaire_disponible"
E_PRESENCE = "device_tracker.pixel_9a"
E_BATT = "sensor.batpct_10_00_3b_3c_d4_04_2"       # SoC Storey master
E_TARIF = "sensor.buanderie_lixee_tarif"           # "HEURE CREUSE" / "HEURE PLEINE"
E_CONSO = "sensor.buanderie_lixee_puissance_app_instantanee_soutiree"  # W soutirés réseau
E_WEATHER = "weather.burthecourt_aux_chenes"
E_FORECAST_SUMMARY = "sensor.weather_forecast_summary"


# ---------------------------------------------------------------- helpers HA
def ha_state(entity_id):
    url = f"{HASS_URL}/api/states/{entity_id}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


def get_num(entity_id, default=None):
    try:
        s = ha_state(entity_id)["state"]
        return float(s)
    except Exception:
        return default


def get_str(entity_id, default=""):
    try:
        return ha_state(entity_id)["state"]
    except Exception:
        return default


# ---------------------------------------------------------------- état persistant
def load_state():
    try:
        return json.loads(STATE_FILE.read_text())
    except Exception:
        return {"armed": True, "last_alert": None}


def save_state(st):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(st))


# ---------------------------------------------------------------- logique
def build_context(dry=False):
    surplus = get_num(E_SURPLUS)
    surplus_inst = get_num(E_SURPLUS_INST)
    presence = get_str(E_PRESENCE)
    st = load_state()

    # --- réarmement : si le surplus est retombé sous SEUIL_REARM, on réarme
    if surplus is not None and surplus < SEUIL_REARM:
        if not st.get("armed", True):
            st["armed"] = True
            save_state(st)

    # --- condition 1 : seuil
    if surplus is None or surplus < SEUIL_ON:
        return None, st, f"surplus {surplus} < {SEUIL_ON}"

    # --- condition 2 : présence
    if presence != "home":
        return None, st, f"absent (pixel_9a={presence})"

    # --- condition 3 : réarmement (sauf dry-run)
    if not dry and not st.get("armed", True):
        return None, st, "déjà alerté, pas réarmé (surplus pas retombé)"

    # conditions OK -> collecter le contexte enrichi
    batt = get_num(E_BATT)
    tarif = get_str(E_TARIF).strip()
    conso = get_num(E_CONSO)
    meteo = get_str(E_WEATHER)
    forecast = get_str(E_FORECAST_SUMMARY)

    # interprétations (aides à la rédaction, pas d'invention)
    batt_txt = "inconnu"
    if batt is not None:
        if batt >= BATT_PLEINE:
            batt_txt = f"{batt:.0f}% — PLEINE, le surplus part au réseau (gaspillé)"
        elif batt >= 70:
            batt_txt = f"{batt:.0f}% — bien remplie"
        else:
            batt_txt = f"{batt:.0f}% — encore de la marge de charge"

    tarif_up = tarif.upper()
    if "PLEINE" in tarif_up:
        tarif_txt = "HEURE PLEINE (réseau cher) — intérêt DOUBLE à consommer le solaire maintenant"
    elif "CREUSE" in tarif_up:
        tarif_txt = "Heure Creuse (réseau moins cher) — mais le solaire reste gratuit"
    else:
        tarif_txt = tarif or "inconnu"

    ctx = {
        "surplus_moyen_W": int(surplus),
        "surplus_instant_W": int(surplus_inst) if surplus_inst is not None else None,
        "batterie": batt_txt,
        "tarif_reseau": tarif_txt,
        "conso_reseau_actuelle_W": int(conso) if conso is not None else None,
        "meteo_actuelle": meteo,
        "previsions": forecast,
        "heure": datetime.now().strftime("%H:%M"),
    }
    return ctx, st, "OK"


def emit(ctx):
    """Imprime le briefing structuré sur stdout pour l'agent Hermes."""
    lines = [
        "CONTEXTE SURPLUS SOLAIRE — rédige un message Telegram COURT, concret et",
        "actionnable pour Chris (il est à la maison, il peut lancer une lessive ou",
        "brancher une charge à la main). Ne cite que les données ci-dessous, n'invente",
        "rien. Mets en avant l'action à faire MAINTENANT et pourquoi (surplus gratuit,",
        "batterie, tarif réseau, fenêtre météo). Emoji ☀️ ok, 1-3 phrases max.",
        "",
        f"- Surplus solaire moyen 5 min : {ctx['surplus_moyen_W']} W (instantané {ctx['surplus_instant_W']} W)",
        f"- Batterie domestique : {ctx['batterie']}",
        f"- Tarif réseau actuel : {ctx['tarif_reseau']}",
        f"- Conso réseau soutirée en ce moment : {ctx['conso_reseau_actuelle_W']} W",
        f"- Météo maintenant : {ctx['meteo_actuelle']}",
        f"- Prévisions : {ctx['previsions']}",
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
        print(f"[SILENT] {reason}", file=sys.stderr)  # stdout vide -> agent muet
        sys.exit(0)
    emit(ctx)
    # marquer comme alerté (désarmer) sauf en dry-run
    if not dry:
        st["armed"] = False
        st["last_alert"] = datetime.now().isoformat()
        save_state(st)
    else:
        print("\n(--dry-run : réarmement NON modifié)", file=sys.stderr)
