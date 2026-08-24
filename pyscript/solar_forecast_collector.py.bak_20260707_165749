"""
solar_forecast_collector.py — Collecteur T0 (déterministe) pour le futur refit solaire.

RÔLE
    Logge chaque jour, dans un JSONL conservé À VIE, le couple {forecast PRÉVU le
    matin} vs {prod RÉELLE + météo observée le soir}. C'est la BASE EMPIRIQUE du
    refit statistique (T2) — comme heat_agent_log.jsonl l'est pour la PAC.
    Le refit lui-même n'est PAS ici : on ACCUMULE d'abord, on analysera ensuite
    (le modèle stat sera choisi quand on verra la forme des écarts).

POURQUOI 2 CAPTURES (anti-biais)
    Le forecast.solar évolue en cours de journée (révision météo). Comparer la
    prod réelle au forecast déjà révisé fausserait l'écart. Donc :
      - MATIN 08:00 : on FIGE le forecast prévu du jour (avant qu'il bouge),
        stocké en RAM (pyscript.state) + fichier d'état (survit à un reload).
      - SOIR 23:00 : on lit la prod réelle Enphase + la météo observée, et on
        écrit LA LIGNE COMPLÈTE (prévu du matin + réel du soir) dans le JSONL.

CONTRAT JSONL (LOG_PATH) — 1 ligne / jour :
    date            : YYYY-MM-DD
    fc_est/sud/ouest/total : forecast prévu le matin (kWh) par orientation + total
    prod_reelle     : prod TOTALE du jour = Enphase + Sunology (kWh)
    prod_enphase / prod_sunology : détail par source (kWh)
    ecart_pct       : (réel TOTAL - prévu) / prévu * 100  (gonflé par le Sunology)
    ecart_pct_enphase : (prod_enphase - prévu) / prévu * 100  <- SIGNAL DE CALIBRATION
                        (forecast.solar ne modélise QUE l'Enphase, on compare à lui seul)
    meteo           : {uv, cloud_cover, condition, temp_max} observés le soir
    fc_capture_ts / reel_capture_ts : horodatages des 2 captures

    GARDE : le soir ne logge QUE si le morning date d'aujourd'hui (sinon le delta
    compteur couvrirait plusieurs jours -> ligne polluée, cf. incident 2026-06-26).

ENTITÉS LUES (vérifiées en direct le 2026-06-22)
    sensor.solar_forecast_est / _sud / _ouest / _today_multi  (kWh, REST forecast.solar)
    sensor.envoy_122233025824_production_d_energie_du_jour    (kWh, prod réelle)
    sensor.burthecourt_aux_chenes_uv / _cloud_cover / _temperature / _original_condition

NOTES PYSCRIPT (cf. heat_agent.py / wolverine_insuline.py)
    - @pyscript_executor : thread, I/O bloquant (open) autorisé.
    - @time_trigger("cron(...)") : planification.
    - state.get(entity) : lecture d'état (string) ; convertir en float avec garde.
    - Un linter qui marque "state/log/time_trigger is not defined" se trompe :
      injections runtime pyscript. NE PAS "corriger".
    - Après édition : service pyscript.reload. Valider syntaxe AVANT avec ast.parse.

VALIDER LA SYNTAXE après édition (Python est sur Windows) :
   & "C:\\Users\\chris\\AppData\\Local\\Programs\\Python\\Python314\\python.exe" -c ^
     "import ast; ast.parse(open(r'//192.168.1.60/config/pyscript/solar_forecast_collector.py',encoding='utf-8').read()); print('OK')"
   Puis : service pyscript.reload.
"""

import json
from datetime import datetime

LOG_PATH = "/config/logs/solar_forecast_log.jsonl"      # 1 ligne JSON / jour, À VIE
STATE_PATH = "/config/logs/.solar_fc_morning.json"      # forecast figé du matin (temporaire)


def _f(entity, default=0.0):
    """Lecture d'un état en float, robuste (unavailable/unknown -> default)."""
    v = state.get(entity)
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


@pyscript_executor
def _write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False))


@pyscript_executor
def _read_json(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, ValueError):
        return None


@pyscript_executor
def _append_jsonl(path, entry_json):
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry_json + "\n")


@time_trigger("cron(0 8 * * *)")
async def solar_collect_morning():
    """08:00 — fige le forecast PRÉVU du jour (avant révision météo)."""
    fc = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "fc_est": round(_f("sensor.solar_forecast_est"), 3),
        "fc_sud": round(_f("sensor.solar_forecast_sud"), 3),
        "fc_ouest": round(_f("sensor.solar_forecast_ouest"), 3),
        "fc_total": round(_f("sensor.solar_forecast_today_multi"), 3),
        "fc_capture_ts": datetime.now().isoformat(timespec="seconds"),
        # compteurs À VIE figés au matin (pour calcul delta du jour le soir).
        # ⚠️ Enphase en MWh, Sunology en kWh -> on stocke en kWh (Enphase ×1000).
        "cpt_enphase_kwh": round(_f("sensor.envoy_122233025824_production_d_energie_totale") * 1000, 3),
        "cpt_sunology_kwh": round(_f("sensor.pc_sunology_energy"), 3),
    }
    await _write_json(STATE_PATH, fc)
    log.info(f"[solar_collector] forecast matin figé: {fc['fc_total']} kWh")


@time_trigger("cron(0 23 * * *)")
async def solar_collect_evening():
    """23:00 — lit prod réelle + météo observée, écrit la ligne complète."""
    fc = await _read_json(STATE_PATH)
    if not fc:
        log.warning("[solar_collector] pas de forecast matin figé, skip (1ère exéc ?)")
        return

    # GARDE DE COHÉRENCE : le morning DOIT dater d'aujourd'hui. Si solar_collect_morning
    # a sauté (reboot HA à 8h, pyscript pas chargé, SMB lent), le fichier morning est
    # périmé et le delta compteur couvrirait PLUSIEURS jours -> ligne polluée (cf. 2026-06-26,
    # prod_reelle 60,58 = 2 jours cumulés). On skip plutôt que d'écrire une ligne fausse.
    today = datetime.now().strftime("%Y-%m-%d")
    if fc.get("date") != today:
        log.warning(
            f"[solar_collector] morning périmé (date={fc.get('date')} != {today}), "
            "skip pour ne pas écrire une ligne polluée (delta multi-jours)."
        )
        return

    # Prod RÉELLE du jour = delta des compteurs à vie (méthode dashboard Énergie).
    # Robuste : indépendant des resets bizarres des capteurs "du jour".
    enphase_now = _f("sensor.envoy_122233025824_production_d_energie_totale") * 1000  # MWh->kWh
    sunology_now = _f("sensor.pc_sunology_energy")                                     # déjà kWh
    prod_enphase = round(enphase_now - fc.get("cpt_enphase_kwh", enphase_now), 3)
    prod_sunology = round(sunology_now - fc.get("cpt_sunology_kwh", sunology_now), 3)
    prod = round(prod_enphase + prod_sunology, 3)   # prod TOTALE jour (Enphase + Sunology)

    fc_total = fc.get("fc_total", 0.0)
    # ecart_pct : réel TOTAL (Enphase+Sunology) vs forecast. Gardé pour compat/dashboard.
    ecart_pct = round((prod - fc_total) / fc_total * 100, 1) if fc_total > 0 else None
    # ecart_pct_enphase : LE signal de calibration. forecast.solar ne modélise QUE
    # l'Enphase -> on doit comparer à prod_enphase SEUL, pas au total (le Sunology
    # ~2,5 kWh/j gonfle artificiellement l'écart de +10-15 pts). C'est cette colonne
    # que le refit T2 exploitera (biais réel de l'API vs météo).
    ecart_pct_enphase = round((prod_enphase - fc_total) / fc_total * 100, 1) if fc_total > 0 else None

    entry = dict(fc)
    entry.update({
        "prod_reelle": prod,               # TOTAL Enphase + Sunology (comme dashboard)
        "prod_enphase": prod_enphase,
        "prod_sunology": prod_sunology,
        "ecart_pct": ecart_pct,            # >0 = forecast a sous-estimé (TOTAL, gonflé Sunology)
        "ecart_pct_enphase": ecart_pct_enphase,  # >0 = sous-estime (Enphase seul = signal refit)
        "meteo": {
            "uv": _f("sensor.burthecourt_aux_chenes_uv"),
            "cloud_cover": _f("sensor.burthecourt_aux_chenes_cloud_cover"),
            "temp": _f("sensor.burthecourt_aux_chenes_temperature"),
            "condition": state.get("sensor.burthecourt_aux_chenes_daily_original_condition"),
        },
        "reel_capture_ts": datetime.now().isoformat(timespec="seconds"),
    })
    entry_json = json.dumps(entry, ensure_ascii=False)
    await _append_jsonl(LOG_PATH, entry_json)
    log.info(f"[solar_collector] jour loggé: prévu={fc_total} réel={prod} écart={ecart_pct}%")


@service
async def solar_collector_test():
    """Service manuel pour tester : fige le forecast PUIS logge tout de suite."""
    await solar_collect_morning()
    await solar_collect_evening()
    log.info("[solar_collector] test manuel exécuté")
