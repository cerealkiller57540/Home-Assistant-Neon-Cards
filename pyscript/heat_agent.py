"""
═══════════════════════════════════════════════════════════════════════════════
 HEAT AGENT — pilotage PAC Mitsubishi Ecodan / plancher chauffant (pyscript HA)
═══════════════════════════════════════════════════════════════════════════════

RÔLE
    Décide, toutes les 20 min, du `bias` de setpoint eau appliqué à la PAC
    (number.ecodan_heatpump_auto_adaptive_setpoint_bias). Le bias décale la
    consigne d'eau : positif = eau plus chaude = chauffe plus ; négatif = moins.

ARCHITECTURE EN 3 COUCHES (du moins cher au plus cher)
    1. DÉTERMINISTE (ecodan.yaml, hors de ce fichier) — GRATUIT
       Calcule `sensor.ecodan_planned_bias` : une cible de bias par phase tarifaire
       + self-learning nocturne (06:22). C'est le plan de référence. Le tarif fait
       autorité (sensor.lixee_current_price), pas l'horloge.
    2. MODÈLE THERMIQUE (_modele_bias_optimal, ici) — GRATUIT
       Régression calibrée (THERM_A/B/C) : prédit le bias nécessaire pour tenir la
       consigne dans 3 h compte tenu de l'inertie dalle. Sert de référence physique.
    3. JUGEMENT LLM (Mistral, ici) — PAYANT (tokens)
       N'intervient QU'EN ESCALADE, quand 1+2 ne suffisent pas à trancher.

PHILOSOPHIE — "LLM en escalade, pas par défaut"
    Le piège de la v1 : appeler Mistral à chaque cycle pour faire tamponner « applique
    le plan ». En DPE A le salon coast en confort la majorité du temps → le LLM
    répondait `null` (= applique le plan) pour rien. Désormais le gate _needs_llm()
    reproduit en Python les SEULS cas où le LLM aurait pu dévier (anomalie / météo
    non captée / divergence modèle). Si aucun ne déclenche → on applique planned_bias
    et on sort, 0 token. Le LLM ne tourne donc que quand le froid/la météo/une anomalie
    rendent le jugement utile (typiquement l'hiver, ext<2).

FLUX D'UN CYCLE (heat_agent_run)
    planned_bias indispo ?            -> abort
    veille estivale (PAC off, chaud) ? -> applique plan, log FAIBLE, sortie (aucun I/O)
    gate _needs_llm() == False ?       -> applique plan, log NORMALE/none, sortie (0 token)
    sinon (escalade)                   -> _build_context -> _call_mistral -> applique -> log

SÉMANTIQUE DU BIAS LLM
    decision["bias"] == null  -> on applique planned_bias (le LLM valide le plan)
    decision["bias"] == float -> déviation transitoire (1 cycle), on l'applique
    off_peak_boost : LOG-ONLY, jamais appliqué. Propriétaire EXCLUSIF = self-learning
    06:22 (ecodan.yaml). Ne JAMAIS écrire input_number.heat_pump_bias_off_peak ici.

CONTRAT JSONL (LOG_PATH) — lu par heat_agent_summary.py
    Chaque entrée DOIT contenir : ts, decision{priorite,deviation,bias,note}, actions,
    planned_bias, phase, temp_salon, temp_ext, compressor_freq. (temp_salon/temp_ext alimentent
    aussi les tendances/déficit des cycles suivants ; compressor_freq est le régresseur B du
    refit thermique offline -> les omettre crée des trous dans les données empiriques.)
    Chaque entrée ajoute aussi `telemetry` (puissance PAC, gains internes, COP… cf _telemetry).
    Les entrées d'escalade ajoutent : wake, tokens. Le mode shadow écrit dans un fichier
    séparé (SHADOW_LOG_PATH), pas dans ce JSONL.

NOTES PYSCRIPT
    - @pyscript_executor : exécute la fonction dans un thread (I/O bloquant autorisé :
      open(), urllib…). Les fonctions normales tournent dans la boucle asyncio.
    - Namespaces globaux injectés par pyscript : state, hass, log, number,
      input_number, input_text, persistent_notification, service, notify.
      (Un linter/IDE qui marque "persistent_notification is not defined" ou
      "_append_line is not awaitable" se trompe : ce sont des injections runtime
      pyscript + des @pyscript_executor qui DEVIENNENT awaitables à l'exécution.
      Ne PAS "corriger" ces faux positifs.)
    - @time_trigger("cron(...)") : planification. @service : exposé comme service HA.
    - Après toute édition : recharger via le service `pyscript.reload` (sinon l'ancien
      code reste en mémoire). Valider la syntaxe AVANT avec Python (cf. JOURNAL plus bas).

═══════════════════════════════════════════════════════════════════════════════
 JOURNAL DES MODIFS — 2026-06-01 (session Claude Opus 4.8)
 « note tout ça pour si j'oublie / si Claude 4.9 ou Mythos débarque »
═══════════════════════════════════════════════════════════════════════════════
 Contexte : refonte non commitée + 4 améliorations demandées. État du terrain
 vérifié EN DIRECT via l'API HA (http://192.168.1.60:8123), pas deviné.

 1. 🔴 BUG BLOQUANT corrigé — la fonction `_comfort_deficit_6h` avait perdu sa
    ligne `def` (corps orphelin collé après le `return` de `_telemetry` -> code
    mort). Effet : `_needs_llm()` levait NameError À CHAQUE cycle nominal ->
    `heat_agent_run` crashait -> la PAC n'était PLUS pilotée en régime dominant.
    Réparé en réinsérant `def _comfort_deficit_6h(history, setpoint=None):`.
    >>> Si ça re-casse un jour : la version HEAD d'avant avait `setpoint=20.2` en
        signature ; ici on lit le thermostat en direct si setpoint=None.

 2. 🔌 CAPTEURS TÉLÉMÉTRIE recâblés sur le RÉEL (les "À RENSEIGNER" étaient faux) :
      - MAISON_POWER_ENTITY = sensor.buanderie_lixee_puissance_app_instantanee_soutiree
        (SINSTS ; remplace sensor.conso_linky, 404 depuis le renommage Z2M 2026-07 —
        et buanderie_lixee_conso_linky est gelé. lixee_papp N'EXISTE PAS.)
        ⚠️ SINSTS = SOUTIRÉ réseau, pas conso brute -> =0 quand le solaire
        couvre tout -> gains_internes sous-estimés en journée ensoleillée. OK pour
        la chauffe (nuit/hiver = peu de PV = soutiré ≈ conso brute).
      - VE_POWER_ENTITY = None  (evcc_charge_power N'EXISTE PAS ; la VW ID4
        WeConnect n'expose charging_power que connectée, souvent 'unavailable').
      - FLOW_RATE_ENTITY = None (sensor.ecodan_heatpump_flow_rate ABSENT -> COP non
        calculable). Si un débitmètre apparaît un jour, le renseigner débloque le COP.

 3. 🛡️ VALIDATION LLM — `_validate_decision()` (appelée dans heat_agent_run après
    le check des champs) : normalise priorite/deviation hors énum, et RABAT sur le
    plan tout bias `deviation=none` qui s'écarte de >LLM_MODEL_TOLERANCE (1.0) du
    bias_optimal physique. Les corrections sont tracées dans l'entrée JSONL
    (clé `llm_fixes`) pour mesurer la fréquence des dérapages du modèle.

 4. 📊 EMPIRIQUE / REFIT (demande "données à conserver dès l'automne") :
      - `compressor_freq` est désormais LOGGUÉ dans les 3 chemins (veille/nominal/
        escalade) : c'est le régresseur B, sans lui aucun refit n'est possible.
        AVANT cette session il n'était jamais loggué -> données passées inutilisables
        pour B. Donc le refit ne sera crédible que sur les données POSTÉRIEURES au
        2026-06-01, idéalement un hiver (freq variée).
      - Service `pyscript.heat_agent_refit` (à la demande, NON planifié) : régression
        linéaire multiple pur-Python (solveur _solve_3x3 testé, R²=0.97 sur données
        de contrôle) -> PROPOSE THERM_A/B/C par notification. N'applique RIEN. Refuse
        si < REFIT_MIN_POINTS (200) ou signes non physiques (A>=0 ou B<=0).

 5. 🎚️ AUTO-TUNING GATE — service `pyscript.heat_agent_tune_gate` (à la demande,
    NON planifié) : par cause d'escalade (`wake`), mesure réveils vs déviations
    réelles, signale les gates "trop bavards" (réveillent souvent, LLM ne fait que
    valider le plan). PROPOSE par notification. N'écrit AUCUN seuil GATE_*.

 CE QUI EST AUTO  : fix bug, validation LLM, logging compressor_freq, score 20:05.
 CE QUI EST MANUEL: heat_agent_refit + heat_agent_tune_gate (Outils dev -> Actions).
                    À lancer cet hiver une fois les données accumulées. Volontaire :
                    ils PROPOSENT, tu recopies les valeurs à la main si le verdict
                    est ✅. (On n'applique jamais un refit auto sur des données d'été.)

 VALIDER LA SYNTAXE après édition (Python est sur Windows) :
   & "C:\\Users\\chris\\AppData\\Local\\Programs\\Python\\Python314\\python.exe" -c ^
     "import ast; ast.parse(open(r'//192.168.1.60/config/pyscript/heat_agent.py',encoding='utf-8').read()); print('OK')"
 Puis recharger : service pyscript.reload.
═══════════════════════════════════════════════════════════════════════════════
 JOURNAL — 2026-06-11 (session Claude Fable 5) — prépa automne/hiver, PAC hors tension
═══════════════════════════════════════════════════════════════════════════════
 1. 🔴 HISTORY_RUNS 3 -> 20. Avec 3 runs (~40 min), _comfort_deficit_6h ne couvrait
    pas 6 h : GATE_DEFICIT (-1.5 °C·h) était mathématiquement inatteignable -> le gate
    "deficit_confort" n'a JAMAIS pu escalader, et le couplage thermique des probas
    gel/neige (GATE_ALERT_DEFICIT) était affaibli. Les tendances salon (6 runs) et
    ext (2 h) étaient pareillement tronquées. C'est LE gate de la sous-chauffe lente
    d'hiver — il fallait le réparer avant la saison froide.
 2. Conséquences maîtrisées du point 1 :
      - _build_context : ligne `hist:` limitée à history[-3:] (le LLM n'a besoin que
        des 3 derniers runs ; 20 lignes d'historique = tokens gaspillés).
      - inertie_block : scan élargi à history[-12:] (≈4 h), le filtre age_h<4 fait foi.
 3. 🧹 _validate_decision : le log de correction `deviation` écrasait la valeur fautive
    avant de la logger (affichait toujours 'none'->none). Ordre inversé : llm_fixes
    trace maintenant la vraie valeur inventée par le LLM.
 ⚠️ NON TRAITÉ (volontaire) : le mode shadow réutilise le contexte du run réel, qui
    contient planned_bias + bias_optimal + wake -> le "challenger from scratch" VOIT le
    plan et peut le recopier. Avant toute campagne SHADOW_ENABLED=True, construire un
    contexte expurgé pour _call_mistral_libre, sinon le scoring champion-challenger
    ne mesure rien.
═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import json
import aiohttp
from datetime import datetime
from ha_secrets import MISTRAL_KEY     # clé hors VCS (secrets.yaml -> module ha_secrets)

# Modèle de jugement. FALLBACK = bascule automatique si le principal sature (429),
# voir _call_mistral. "small" = tier le moins cher, suffisant pour une décision JSON courte.
MISTRAL_MODEL          = "mistral-small-2603"
MISTRAL_MODEL_FALLBACK = "mistral-small-latest"
MISTRAL_URL   = "https://api.mistral.ai/v1/chat/completions"

# ── Entités HA (les "seams" du système) ──
ENTITY_BIAS      = "number.ecodan_heatpump_auto_adaptive_setpoint_bias"  # SORTIE finale -> PAC
ENTITY_PLANNED   = "sensor.ecodan_planned_bias"   # ENTRÉE : plan déterministe + bundle contexte (attributs)
ENTITY_NOTE      = "input_text.heat_agent_last_note"  # dernière note décision (affichage dashboard)
LOG_PATH         = "/config/logs/heat_agent_log.jsonl"  # 1 ligne JSON / run (lu par le résumé)
LOG_CMTRACE      = "/config/logs/heat_agent.log"        # trace humaine lisible (append)
SHADOW_LOG_PATH  = "/config/logs/heat_agent_shadow.jsonl"  # suggestions LLM "libre" + état (mode shadow)
SCORE_LOG_PATH   = "/config/logs/heat_agent_score.jsonl"   # 1 ligne / jour : confort, coût, divergence shadow

BIAS_MIN, BIAS_MAX   = -2.0, 3.0   # bornes physiques du bias ; tout calcul est clampé ici

# ── Validation de la décision LLM (garde-fous Python, post-réponse Mistral) ──
# Énumérations autorisées : toute valeur hors liste est normalisée (priorite -> NORMALE,
# deviation -> none). Évite qu'un champ inventé par le modèle ("MOYENNE", "eco"…) ne
# pollue le contrat JSONL relu par le résumé/scorer.
VALID_PRIORITES  = ("CRITIQUE", "HAUTE", "NORMALE", "FAIBLE")
VALID_DEVIATIONS = ("none", "anomaly", "weather")
# Le SYSTEM autorise le LLM à dévier de bias_optimal SEULEMENT pour anomaly/weather. Si une
# déviation `none` s'écarte du modèle thermique de plus que ce seuil, on ne fait pas confiance
# à l'écart (le LLM "improvise" sans raison déclarée) -> on rabat sur le plan. Garde-fou, pas
# muselière : weather/anomaly restent libres (c'est leur rôle d'aller au-delà du modèle).
LLM_MODEL_TOLERANCE = 1.0   # |bias_llm - bias_optimal| toléré pour une déviation non justifiée

# ── Mode SHADOW (ex-"LIBRE") : champion-challenger vers l'autonomie ──────────
# Objectif : faire tourner Mistral SANS la contrainte du plan (il propose un bias from
# scratch), logger sa suggestion + l'état + l'issue réelle, et SCORER sur plusieurs semaines
# pour décider si on peut un jour lui lâcher le bias. Sa suggestion n'est JAMAIS appliquée.
# Échantillonné (≠ chaque cycle) pour un coût borné ET une couverture représentative :
# on l'exécute sur les cycles NOMINAUX aussi, pas seulement les escalades (sinon on ne juge
# le LLM que sur les cas tordus). Le scorer (heat_agent_score) tourne, lui, même shadow OFF
# (confort/coût du jour = suivi de perf gratuit).
SHADOW_ENABLED  = False   # True = campagne shadow (coûte des tokens : 1 appel non contraint / échantillon)
SHADOW_SAMPLE_MIN = 20    # on échantillonne 1 cycle/heure : celui dont la minute < SHADOW_SAMPLE_MIN
SCORE_HORIZON_H = 2.0     # fenêtre d'observation de l'issue d'un cycle (réponse dalle)

# ── Réglage du gate d'escalade LLM ───────────────────────────────────────
# Ces seuils décident QUAND on dépense des tokens. Trop bas = LLM bavard (cher).
# Trop haut = on risque de rater une situation que seul le jugement gérerait.
# Si l'hiver est trop bavard : c'est GATE_EXT_FROID qui réveille chaque cycle dès
# ext<2 ; baisse-le (0, voire -3) ou conditionne-le à une divergence modèle.
GATE_EXT_FROID  = 2.0     # ext < X (°C)         => escalade "gel" (cas critique du SYSTEM)
GATE_BOOST_EXT  = 3.0     # booster ON + ext < X => escalade "booster_froid" (résistance d'appoint à froid)
GATE_CHUTE      = 5.0     # chute météo >= X (°C/12h) => escalade "chute_meteo" (la courbe ne l'anticipe pas)
GATE_DIVERGE    = 0.4     # |bias_optimal - planned| > X HORS confort => escalade (modèle conteste le plan)
GATE_DIVERGE_CF = 0.8     # idem EN confort : seuil plus large (on ne réveille pas pour un écart mineur)
GATE_DEFICIT    = -1.5    # déficit confort <= X (°C·h sur 6h) => escalade (sous-chauffe qui s'installe)
# Plancher de chauffe : si la consigne du thermostat Z1 est SOUS ce seuil, le chauffage
# n'est pas "voulu" (consigne parquée basse l'été pour ne rien déclencher). Dans ce cas les
# boucles CONFORT (modèle vs plan, self-learning) sont dormantes — les SÉCURITÉS (gel,
# defrost, vigilance, freeze_chance) restent actives. Doit être entre la valeur "coupé"
# (~15) et la valeur "chauffe" (~19.5). À garder synchrone avec ecodan.yaml self-learning.
HEAT_FLOOR      = 16.0

# ── Télémétrie (logging enrichi par cycle) ──────────────────────────────────
# Fondation pour : refit du modèle thermique en multi-termes (+solaire +gains internes)
# ET terme "coût" du scorer shadow. Tout est best-effort (capteur absent -> None).
PAC_POWER_ENTITY    = "sensor.nodon_capteur_power"          # puissance instantanée PAC (W) — pince NodOn
# MAISON : SINSTS du Linky = puissance apparente SOUTIRÉE au réseau (VA ≈ W en résidentiel),
# pas la conso brute maison. LIMITE ASSUMÉE : quand le solaire couvre la maison, le soutiré
# tombe à 0 même si la maison consomme -> gains_internes SOUS-ESTIMÉS en journée ensoleillée.
# C'est sans gravité pour le chauffage : la saison de chauffe (nuit/hiver, peu/pas de PV) est
# justement le régime où soutiré ≈ conso brute, donc où gains_internes est fiable.
# HISTORIQUE : sensor.conso_linky (utilisé jusqu'au 2026-07-19) a disparu au renommage Z2M du
# Lixee en « Buanderie Lixee » -> 404, maison_w loggé à None. Son successeur direct
# sensor.buanderie_lixee_conso_linky est lui-même gelé (plus publié depuis 2026-07-18 19:31).
# Le SINSTS, lui, est vivant (poll Z2M 60 s) et porte la même sémantique.
MAISON_POWER_ENTITY = "sensor.buanderie_lixee_puissance_app_instantanee_soutiree"
# VE : pas de mesure physique de borne ; la VW ID4 (WeConnect) n'expose charging_power que
# connectée et en kW (souvent 'unavailable'). On la laisse OFF : un None est plus honnête qu'une
# soustraction fantôme. À renseigner si un jour une pince/Shelly dédié borne apparaît.
VE_POWER_ENTITY     = None
FLOW_RATE_ENTITY    = None                                  # débit eau (l/min) absent chez Ecodan ici -> COP non calculable
CLOUD_ENTITY        = "sensor.burthecourt_aux_chenes_cloud_cover"
FEED_ENTITY         = "sensor.ecodan_heatpump_feed_temp"
RETURN_ENTITY       = "sensor.ecodan_heatpump_return_temp"
DELTA_T_ENTITY      = "sensor.ecodan_heatpump_delta_t"

# ── Signaux météo gel/neige (2 niveaux) ──
# ARCHITECTURE :
#   1) ANTICIPATION PRINCIPALE = probas locales commune (intégration meteo_france) :
#      freeze_chance / snow_chance, en %, prévisionnelles -> signal fin et local.
#      Escalade si proba >= GATE_CHANCE_PCT ET signal thermique réel (ext froid OU
#      déficit). Le couplage évite de rouvrir le LLM toute la nuit sur une proba qui
#      stagne sans froid effectif (une proba élevée est un ÉTAT qui DURE).
#   2) SURCOUCHE ÉVÈNEMENT GRAVE = vigilance départementale (sensor.54_weather_alert) :
#      grossière (tout le 54) et rare -> on n'en garde QUE Orange/Rouge, qui escaladent
#      toujours. (Le Jaune est désormais couvert par les probas commune ci-dessus.)
#      NB : si l'entité weather_alert n'existe pas chez toi, cette surcouche est inerte
#      (rien ne plante), seules les probas commune pilotent.
FREEZE_CHANCE_ENTITY = "sensor.burthecourt_aux_chenes_freeze_chance"  # proba gel %, commune
SNOW_CHANCE_ENTITY   = "sensor.burthecourt_aux_chenes_snow_chance"    # proba neige %, commune
GATE_CHANCE_PCT      = 40.0  # proba gel/neige >= X% (+ couplage thermique) => escalade

WEATHER_ALERT_ENTITY = "sensor.54_weather_alert"
# NB SAISONNALITÉ : "Grand-froid" n'est publié par MF que du 1er nov au 31 mars -> en été
# l'attribut est ABSENT de l'entité (c'est normal, pas un bug ; .get() -> None -> ignoré).
# On le garde dans la liste : il se réactive seul l'hiver. freeze_chance (commune) couvre
# le gel hors saison de vigilance. Dépt 54 : pas d'Avalanches/Vagues-submersion exposés.
ALERT_TYPES_CHAUFFE  = ("Grand-froid", "Neige-verglas", "Pluie-inondation", "Orages", "Vent violent")
# Tags courts pour le champ `wake` / les logs (clé attribut MF -> tag).
ALERT_TAG = {"Grand-froid": "froid", "Neige-verglas": "neige", "Pluie-inondation": "pluie",
             "Orages": "orages", "Vent violent": "vent"}
# Seuils de couplage thermique (probas gel/neige) : la proba ne paie un appel LLM que
# si le froid est réellement là (sinon : reste dans le contexte/log, pas d'escalade).
GATE_ALERT_EXT     = 5.0   # ext < X (°C) = assez froid pour rendre la proba opérante
GATE_ALERT_DEFICIT = -0.5  # déficit confort <= X (°C·h) = sous-chauffe déjà amorcée

# Mapping phase -> input_number de traçabilité dashboard (purement cosmétique/debug).
# INVARIANT : HC_NUIT = None. heat_pump_bias_off_peak appartient EXCLUSIVEMENT au
# self-learning 06:22 (ecodan.yaml) — écrire dessus ici corromprait l'apprentissage.
PHASE_INPUT_MAP = {
    "HC_NUIT":    None,
    "MORNING":    "input_number.heat_pump_bias_pre_offpeak",
    "JOURNEE":    "input_number.heat_pump_bias_journee",
    "PRE_HC_PM":  "input_number.heat_pump_bias_pre_offpeak",
    "HC_PM":      "input_number.heat_pump_bias_afternoon_hc",
    "POST_HC":    "input_number.heat_pump_bias_post_afternoon_hc",
    "PEAK_COAST": "input_number.heat_pump_bias_peak",
    "SOIREE":     "input_number.heat_pump_bias_soiree_tardive",
    "PRE_NUIT":   "input_number.heat_pump_bias_soiree_tardive",
}

# ─────────────────────────────────────────────────────────────────────────
# MODÈLE THERMIQUE  (régression calibrée sur les stats horaires mars-mai 2026)
# ─────────────────────────────────────────────────────────────────────────
# Équation horaire identifiée :   dT_salon/h = A·(T_salon−T_ext) + B·freq + C
#   A < 0 : pertes (plus l'écart int/ext est grand, plus on perd vite)
#   B > 0 : apport PAC proportionnel à la fréquence compresseur
#   C     : offset = relargage d'inertie de la dalle (chaleur stockée)
# À recalibrer si l'enveloppe change (isolation, fenêtres) ou après une grosse
# saison de données : refaire la régression sur l'historique du recorder.
THERM_A = -0.01440   # perte thermique  (°C par °C d'écart, par heure)
THERM_B =  0.00339   # gain PAC          (°C par Hz, par heure)
THERM_C =  0.2675    # offset inertie dalle (°C/h)
CONFORT_DELTA = 0.25  # demi-largeur de la plage confort autour de la consigne (±°C)
INERTIE_H     = 3.0   # horizon de prédiction = temps de réponse de la dalle (h)


def _modele_bias_optimal(temp_salon, temp_ext, compressor_freq, planned_bias, t_cible=20.25):
    """Bias théorique pour atteindre `t_cible` dans INERTIE_H heures (réf. physique du gate/LLM).

    Renvoie (bias_optimal: float, statut: str) ou (None, None) si une entrée est invalide.
    statut ∈ {sous_consigne, confort, sur_consigne} selon la position du salon vs consigne.

    Principe : on projette l'évolution du salon sur INERTIE_H h (pertes + apport PAC +
    inertie), on en déduit le déficit/excédent restant, et on traduit ce résidu en
    correction de bias par-dessus le plan.
    """
    try:
        ts = float(temp_salon)
        te = float(temp_ext)
        # freq=0 (PAC à l'arrêt) casserait le calcul d'apport : on prend 30 Hz comme
        # fréquence de redémarrage typique (la PAC repartira si le bias l'exige).
        freq = float(compressor_freq) if float(compressor_freq) > 0 else 30.0
        tc = float(t_cible)
    except (ValueError, TypeError):
        return None, None

    dt_besoin  = tc - ts                              # ce qu'il faut gagner (°C)
    dt_naturel = THERM_A * (ts - te) * INERTIE_H      # pertes projetées sur l'horizon (<0)
    dt_pac     = THERM_B * freq * INERTIE_H + THERM_C * INERTIE_H  # apport PAC+dalle projeté
    dt_manquant = dt_besoin - dt_naturel - dt_pac     # résidu que le bias doit couvrir

    # Conversion résidu (°C) -> unités de bias. CALIBRATION EMPIRIQUE :
    # 1 unité de bias ≈ +0.5 °C de setpoint eau, dont l'effet thermique équivaut
    # à ~8 Hz de compresseur. Donc l'effet d'1 unité de bias sur l'horizon vaut
    # (THERM_B · 8 · INERTIE_H) °C. On divise le résidu par ce gain pour obtenir le
    # nombre d'unités de bias à ajouter au plan. (Le "8" est la constante à réajuster
    # si la relation bias->débit calorifique change.)
    bias_delta   = dt_manquant / (THERM_B * 8 * INERTIE_H)
    bias_optimal = round(max(BIAS_MIN, min(BIAS_MAX, float(planned_bias) + bias_delta)), 2)

    statut = (
        "sous_consigne" if ts < tc - CONFORT_DELTA else
        "sur_consigne"  if ts > tc + CONFORT_DELTA else
        "confort"
    )
    return bias_optimal, statut


# Profondeur d'historique relu à chaque cycle. 20 runs ≈ 6.7 h à 20 min/cycle :
# nécessaire pour que _comfort_deficit_6h couvre réellement 6 h (avant 2026-06-11
# c'était 3 -> le déficit ne voyait que ~40 min et GATE_DEFICIT n'escaladait JAMAIS).
# Le contexte LLM (ligne hist:) reste limité aux 3 derniers runs (tokens) — cf _build_context.
HISTORY_RUNS    = 20                         # nb de runs passés relus pour le contexte/historique
FORECAST_ENTITY = "weather.forecast_maison"  # entité météo source des prévisions horaires

# ── Analyse offline (refit thermique + auto-tuning du gate) ──────────────────
# Services à la demande, non planifiés : ils LISENT les logs et PROPOSENT (jamais
# d'application auto). À lancer quand l'automne aura accumulé des semaines de données
# empiriques réelles (le modèle actuel est calibré sur mars-mai, pas sur la saison froide).
REFIT_MIN_POINTS   = 200    # paires de runs valides en-deçà desquelles le refit est non crédible
REFIT_DEFAULT_DAYS = 45     # fenêtre par défaut relue pour le refit/auto-tuning
ANALYSIS_LOG_PATH  = "/config/logs/heat_agent_analysis.jsonl"  # propositions refit + tuning (historisé)

# ─────────────────────────────────────────────────────────────────────────
# PROMPT DE JUGEMENT (envoyé en role=system à chaque escalade).
# Volontairement dense : chaque ligne pèse en tokens d'entrée, payés à CHAQUE
# appel. Garder les règles, compresser la prose. Toute modif change le
# comportement du LLM — versionner mentalement avant de toucher.
# Le LLM répond en JSON strict (response_format=json_object) selon le schéma final.
# ─────────────────────────────────────────────────────────────────────────
SYSTEM = (
    "ROLE: valider ou devier planned_bias (calcule par HA). Defaut=null (=applique le plan).\n"
    "Devie SEULEMENT si (a) anomalie reelle ou (b) meteo non captee par la courbe. "
    "Deviation=transitoire 1 cycle. 3+ deviations identiques dans l'historique => null.\n"
    "NE touche JAMAIS off_peak_boost_appris (proprietaire = auto 06:22).\n"
    "PHYSIQUE: bias = setpoint eau; la PAC demarre si retour<cible. freq=0 => bias sans effet "
    "immediat (inertie dalle 2-4h), ne pas sur-booster.\n"
    "DPE A: l'enveloppe tient la temp toute la journee sans PAC. freq=0 + salon stable/confort "
    "= isolation OK, NORMAL. PAC inactive = normal hors grand froid. Si ext>10 et salon>20: "
    "regime printanier/estival, PAC surtout standby, biases diurnes purement preventifs "
    "(pre-chauffe) — ne pas sur-interpreter l'activite diurne ni booster un salon deja confortable.\n"
    "MODELE: le contexte fournit modele_thermique{statut, bias_optimal} (regression, cible Z1, "
    "horizon 3h). Reference principale. confort=>prefere null. sous_consigne & bias_optimal>planned "
    "=> deviation weather justifiee. sur_consigne & bias_optimal<planned => deviation eco justifiee.\n"
    "wake= (si present) indique ce qui t'a reveille : concentre ton jugement la-dessus.\n"
    "PROBAS LOCALES (gel=/neige= en %): anticipation gel/neige de ta commune. >=40% par grand "
    "froid => pre-chauffe preventive (deviation=weather, +0.4 a +0.8 ; chute COP, verglas, dalle). "
    "ALERTES MF (alerts=): Froid (grand-froid)>=Jaune => priorite chauffe, bias preventif +0.4 a +0.8 "
    "(chute COP, dalle qui decroche). Neige/Pluie verglacante>=Jaune => bias preventif +0.3 a +0.7 "
    "(deviation=weather, chute thermique + verglas degrade rendement PAC). Orages/Vent>=Jaune => "
    "anticipe la chute post-orage (typique -3 a -5C sur 1-2h) si pas deja visible dans la courbe. "
    "Si alerts=none ignore.\n"
    "NORMAL (ne pas alerter): booster+salon>20+ext>5 / deltaT=0+compresseur OFF / "
    "freq=0 en JOURNEE|PEAK_COAST / bias negatif en PEAK_COAST.\n"
    "CRITIQUE seulement: gel imminent ext<2 / lockout / booster a ext<-5 / capteur indispo.\n"
    "DEGRADE (capteur manquant): priorite=HAUTE bias=null deviation=none.\n"
    "JSON STRICT, aucun texte autour. bias in [-2.0,3.0]|null. off_peak_boost in [0.5,3.0]|null.\n"
    '{"priorite":"CRITIQUE|HAUTE|NORMALE|FAIBLE","bias":null,"off_peak_boost":null,'
    '"deviation":"none|anomaly|weather","note":"<120car"}'
)


@pyscript_executor
def _read_jsonl_sync(path, last_n):
    """Relit les `last_n` dernières lignes du JSONL et les parse. Thread (I/O bloquant).
    Tolérant : une ligne corrompue est ignorée, fichier absent -> []."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            lines = f.read().strip().splitlines()
        entries = []
        for line in lines[-last_n:]:
            try:
                entries.append(json.loads(line))
            except Exception:
                pass
        return entries
    except Exception:
        return []


@pyscript_executor
def _write_files_sync(log_path, cmtrace_path, entry_json, cmline):
    """Append des deux journaux (thread). utf-8-sig sur la trace humaine pour que
    l'éditeur Windows/HA affiche correctement les accents.
    Best-effort par fichier : un hoquet disque/SMB sur l'un ne doit ni avorter la
    fin du cycle (sinon la note HA n'est pas écrite) ni faire perdre l'autre. Le
    JSONL est la base empirique du refit thermique -> chaque écriture est isolée."""
    try:
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(entry_json + "\n")
    except Exception as e:
        log.error("Echec ecriture JSONL heat_agent : " + str(e))
    try:
        with open(cmtrace_path, "a", encoding="utf-8-sig") as f:
            f.write(cmline)
    except Exception as e:
        log.error("Echec ecriture trace heat_agent : " + str(e))


@pyscript_executor
def _append_line(path, line):
    """Append d'une ligne (thread). Best-effort : une erreur d'écriture ne casse pas le run."""
    try:
        with open(path, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


@pyscript_executor
def _read_since_jsonl(path, cutoff_iso):
    """Toutes les entrées d'un JSONL dont le ts est >= cutoff_iso (thread). [] si absent.
    Comparaison lexicographique sur l'ISO 8601 (tri = chronologie). Sert aux analyses offline
    (refit/tuning) qui ont besoin de la fenêtre complète, pas seulement des N dernières lignes."""
    out = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    e = json.loads(line)
                    if e.get("ts", "") >= cutoff_iso:
                        out.append(e)
                except Exception:
                    pass
    except Exception:
        pass
    return out


@pyscript_executor
def _read_day_jsonl(path, day_iso):
    """Toutes les entrées d'un JSONL dont le ts commence par `day_iso` (thread). [] si absent."""
    out = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    e = json.loads(line)
                    if e.get("ts", "").startswith(day_iso):
                        out.append(e)
                except Exception:
                    pass
    except Exception:
        pass
    return out


async def _load_history():
    """Les HISTORY_RUNS derniers runs (pour tendances, déficit, règle anti-répétition)."""
    return await _read_jsonl_sync(LOG_PATH, HISTORY_RUNS)


async def _write_log(entry):
    """Écrit l'entrée dans le JSONL (machine) ET la trace humaine (1 ligne lisible).
    `entry` doit respecter le CONTRAT JSONL décrit dans l'en-tête du module."""
    ts = entry.get("ts", "")
    d = entry.get("decision", {})
    priorite = d.get("priorite", "?")
    deviation = d.get("deviation", "")
    note = d.get("note", "")
    actions = entry.get("actions", [])
    actions_str = ", ".join(actions) if actions else "aucune"
    tok = entry.get("tokens", {})
    tok_str = f"  [{tok.get('in','?')}in/{tok.get('out','?')}out]" if tok else ""
    tel = entry.get("telemetry", {}) or {}
    pac_str = f"  pac={tel.get('pac_w')}W" if tel.get("pac_w") is not None else ""
    cmline = ts + "  " + priorite + "  [" + deviation + "]  " + note + "  | " + actions_str + tok_str + pac_str + "\n"
    entry_json = json.dumps(entry, ensure_ascii=False)
    await _write_files_sync(LOG_PATH, LOG_CMTRACE, entry_json, cmline)


def _get_planned_attrs():
    """Lit sensor.ecodan_planned_bias et renvoie {**attributs, "state": valeur}.

    C'est LE pont avec la couche déterministe (ecodan.yaml) : `state` = bias planifié,
    et les attributs portent tout le contexte calculé côté HA (phase, tariff, temp_ext,
    temp_salon, compressor_freq, surplus_solaire, solar_resolution, defrost_active,
    booster_active, off_peak_boost_appris…). {} si l'entité n'existe pas encore."""
    s = hass.states.get(ENTITY_PLANNED)
    if not s:
        return {}
    attrs = dict(s.attributes)
    attrs["state"] = s.state
    return attrs


# ── Indicateurs dérivés de l'historique des runs (tout est GRATUIT, pur Python) ──
# Ces fonctions reconstruisent des tendances à partir des temp_salon/temp_ext loggués
# à chaque run -> d'où l'importance de toujours les écrire dans le JSONL.

def _salon_trend_from_history(history):
    """Pente de température salon (°C/h) sur les ~6 derniers runs. (rate, label) ou (None, '')."""
    temps = []
    times = []
    for e in reversed(history[-6:]):
        salon_v = e.get("temp_salon")
        ts_str = e.get("ts", "")
        if salon_v is not None and ts_str:
            try:
                t = datetime.fromisoformat(ts_str)
                temps.append(float(salon_v))
                times.append(t)
            except Exception:
                pass
    if len(temps) >= 2:
        dt_h = (times[0] - times[-1]).total_seconds() / 3600
        if dt_h > 0.25:
            rate = (temps[0] - temps[-1]) / dt_h
            label = "en baisse" if rate < -0.05 else ("en hausse" if rate > 0.05 else "stable")
            return rate, label
    return None, ""


def _ext_trend_from_history(history):
    """dT/dt temp_ext depuis les runs loggués sur 2h. Retourne (rate, label) ou (None, '')."""
    temps = []
    times = []
    for e in reversed(history[-6:]):
        ext_v = e.get("temp_ext")
        ts_str = e.get("ts", "")
        if ext_v is not None and ts_str:
            try:
                t = datetime.fromisoformat(ts_str)
                age_h = (datetime.now() - t).total_seconds() / 3600
                if age_h > 2:
                    break
                temps.append(float(ext_v))
                times.append(t)
            except Exception:
                pass
    if len(temps) >= 2:
        dt_h = (times[0] - times[-1]).total_seconds() / 3600
        if dt_h > 0.15:
            rate = (temps[0] - temps[-1]) / dt_h
            label = "en baisse" if rate < -0.1 else ("en hausse" if rate > 0.1 else "stable")
            return rate, label
    return None, ""


def _comfort_setpoint(default=20.25):
    """Cible de confort = SOURCE UNIQUE DE VÉRITÉ : le setpoint du thermostat virtuel Z1,
    lu en direct. Tout (déficit, modèle thermique, gate, futur scorer) en découle, pour que
    régler le thermostat suffise — sans rien chasser en dur ailleurs. `default` si indispo."""
    try:
        return float(state.getattr("climate.ecodan_heatpump_virtual_thermostat_z1").get("temperature") or default)
    except Exception:
        return default


def _num(entity, default=None):
    """Lecture numérique tolérante d'un état (None si entité absente/illisible/None)."""
    if not entity:
        return default
    try:
        return float(state.get(entity))
    except Exception:
        return default


def _telemetry(planned_attrs):
    """Bloc télémétrie ajouté à CHAQUE entrée de log (clé 'telemetry').
    Fondation du refit modèle (+solaire +gains internes) et du scorer shadow (terme coût).
    Best-effort intégral : un capteur absent => None, jamais d'exception, jamais bloquant.

    gains_internes (maison RT2012 étanche) = conso maison − PAC − charge VE ~= chaleur retenue
    à l'intérieur (PC, électroménager, occupants). On SOUSTRAIT la charge VE : elle part dans
    la batterie/dehors, pas dans les murs (sinon une recharge = radiateur fantôme de 7 kW).
    cop = (débit l/min · ΔT · 0.0698) / P_kW — calculé seulement si le débit eau est dispo."""
    pac    = _num(PAC_POWER_ENTITY)
    maison = _num(MAISON_POWER_ENTITY)
    ve     = _num(VE_POWER_ENTITY) or 0.0
    delta_t = _num(DELTA_T_ENTITY)
    flow    = _num(FLOW_RATE_ENTITY)

    gains = None
    if maison is not None and pac is not None:
        gains = round(max(0.0, maison - pac - ve), 0)   # clamp >=0 (bruit de mesure)

    cop = None
    if flow is not None and delta_t is not None and pac and pac > 50:
        cop = round((flow * delta_t * 0.0698) / (pac / 1000.0), 2)

    return {
        "pac_w": pac,
        "maison_w": maison,
        "ve_w": ve,
        "gains_internes_w": gains,
        "delta_t": delta_t,
        "feed": _num(FEED_ENTITY),
        "retour": _num(RETURN_ENTITY),
        "cloud": _num(CLOUD_ENTITY),
        "surplus_w": planned_attrs.get("surplus_solaire"),
        "cop": cop,
        "setpoint": _comfort_setpoint(),
    }


def _comfort_deficit_6h(history, setpoint=None):
    """Intégrale signée de (salon − setpoint) sur les 6 dernières heures, en °C·h.

    setpoint=None -> lu en direct sur le thermostat Z1 (_comfort_setpoint), donc suit ce que
    tu règles. < 0 = sous-chauffe qui s'accumule ; > 0 = sur-chauffe. None si pas assez de
    données. Sert au gate (GATE_DEFICIT) : dérive ponctuelle tolérée, dérive PERSISTANTE escalade.
    Garde-fou : on ignore les écarts de run > 1.5 h (trou dans le log)."""
    if setpoint is None:
        setpoint = _comfort_setpoint()
    deficit = 0.0
    prev_ts = None
    prev_salon = None
    for e in reversed(history):
        salon_v = e.get("temp_salon")
        ts_str = e.get("ts", "")
        if salon_v is None or not ts_str:
            continue
        try:
            t = datetime.fromisoformat(ts_str)
            age_h = (datetime.now() - t).total_seconds() / 3600
            if age_h > 6:
                break
            if prev_ts is not None:
                dt_h = (prev_ts - t).total_seconds() / 3600
                if 0 < dt_h < 1.5:
                    deficit += (prev_salon - setpoint) * dt_h
            prev_ts = t
            prev_salon = float(salon_v)
        except Exception:
            pass
    return round(deficit, 2) if prev_ts is not None else None


def _build_context(planned_attrs, forecast_list, history, wake=""):
    """Construit le bundle d'état envoyé en role=user au LLM (uniquement en escalade).

    Sortie = quelques lignes texte denses (clé=valeur), pesées en tokens d'entrée.
    On ne met QUE les drivers de décision : état/confort, mécanique PAC, météo
    agrégée, historique récent et le modèle thermique. `wake` (raison d'escalade
    issue du gate) est injecté pour focaliser le jugement du LLM.
    NB : volontairement allégé vs v1 (météo heure-par-heure et champs décoratifs
    retirés — les agrégats meteo_min/chute/j1_min suffisent au jugement)."""
    now = datetime.now()
    ts = now.strftime("%Y-%m-%d %H:%M")

    # ── Indicateurs de dérive salon depuis l'historique des runs ──
    trend_rate, trend_label   = _salon_trend_from_history(history)
    ext_trend_rate, ext_label = _ext_trend_from_history(history)
    deficit = _comfort_deficit_6h(history)  # °C·h sur 6h, négatif = sous-chauffe persistante

    # ── Métriques météo agrégées depuis les forecasts (12h de données, affichage 6h) ──
    temps_fc = [fc.get("temperature") for fc in forecast_list[:12] if fc.get("temperature") is not None]
    meteo_min = min(temps_fc) if temps_fc else None
    meteo_chute = round(temps_fc[0] - meteo_min, 1) if (temps_fc and meteo_min is not None and temps_fc[0] > meteo_min) else 0

    # ── Flag inertie (bias LLM fort appliqué dans les 4 dernières heures) ──
    # [-12:] ≈ 4 h à 20 min/cycle (le filtre age_h<4 fait foi, la slice borne le scan).
    inertie_block = False
    for e in reversed(history[-12:]):
        ts_str = e.get("ts", "")
        d = e.get("decision", {})
        if d.get("deviation") in ("anomaly", "weather") and d.get("bias") is not None:
            try:
                age_h = (now - datetime.fromisoformat(ts_str)).total_seconds() / 3600
                if age_h < 4 and float(d["bias"]) > 1.5:
                    inertie_block = True
                    break
            except Exception:
                pass

    # ── Données supplémentaires depuis hass ──
    def _s(eid):
        try:
            return state.get(eid)
        except Exception:
            return None

    delta_t       = _s("sensor.ecodan_heatpump_delta_t")

    sun_ent = hass.states.get("sun.sun")

    # Prochaine transition tarifaire — sensor template (config dans templates.yaml)
    try:
        mins_to_tr = int(float(state.get("sensor.next_tariff_transition_in")))
    except Exception:
        mins_to_tr = 0
    next_tr_str = f"{mins_to_tr}min"

    saison = (
        "printemps" if now.month in (3,4,5) else
        "été"       if now.month in (6,7,8) else
        "automne"   if now.month in (9,10,11) else "hiver"
    )

    # ── Calculs dérivés ──
    t_min = str(meteo_min) + "C" if meteo_min is not None else "n/a"
    chute = f"OUI(-{round(meteo_chute,1)}C)" if meteo_chute >= 5 else "NON"
    trend_val = f"{trend_rate:+.2f}" if trend_rate is not None else "n/a"
    ext_trend_val = f"{ext_trend_rate:+.2f}" if ext_trend_rate is not None else "n/a"

    # Prévision J+1 — min sur les 12h au-delà des données déjà agrégées
    temps_j1 = [fc.get("temperature") for fc in forecast_list[6:18] if fc.get("temperature") is not None]
    j1_min = str(min(temps_j1)) + "C" if temps_j1 else "n/a"
    deficit_val = f"{deficit}C.h" if deficit is not None else "n/a"
    pac_active = str(planned_attrs.get("compressor_freq", "0")) not in ("0", "0.0", "None", "?")

    # Période solaire — basée sur l'élévation du soleil
    sun_elev = float(sun_ent.attributes.get("elevation", 0)) if sun_ent else 0
    if sun_elev > 6:
        heure_solaire = "jour"
    elif sun_elev > -6:
        heure_solaire = "crepuscule"
    else:
        heure_solaire = "nuit"

    off_peak_appris = planned_attrs.get("off_peak_boost_appris", "?")

    def _v(x, unit="", digits=1):
        try: return str(round(float(x), digits)) + unit
        except: return "n/a"

    wake_str = f" wake={wake}" if wake else ""
    # Ligne 1 — état + confort (drivers de décision)
    l1 = (
        f"ts={ts} saison={saison} phase={planned_attrs.get('phase','?')} "
        f"tariff={planned_attrs.get('tariff','?')} tr={next_tr_str} "
        f"planned_bias={planned_attrs.get('state','?')} "
        f"ext={planned_attrs.get('temp_ext','?')}C salon={planned_attrs.get('temp_salon','?')}C "
        f"deficit_6h={deficit_val} tendance={trend_val}C/h heure_solaire={heure_solaire}{wake_str}"
    )
    # Ligne 2 — PAC + solaire
    l2 = (
        f"compressor={planned_attrs.get('compressor_freq','?')}Hz pac_active={'OUI' if pac_active else 'NON'} "
        f"delta_t={_v(delta_t,'C')} booster={planned_attrs.get('booster_active','?')} "
        f"defrost={planned_attrs.get('defrost_active','?')} "
        f"surplus={planned_attrs.get('surplus_solaire','?')}W solar_res={planned_attrs.get('solar_resolution','?')}"
    )
    # Ligne 3 — météo agrégée + flags
    l3 = (
        f"meteo_min_12h={t_min} chute={chute} ext_tendance_2h={ext_trend_val}C/h({ext_label}) "
        f"j1_min={j1_min} off_peak_appris={off_peak_appris} inertie_block={'OUI' if inertie_block else 'NON'}"
    )
    # Ligne 3bis — vigilance MF (surcouche grave) + probas gel/neige locales (anticipation)
    _fz = _chance(FREEZE_CHANCE_ENTITY)
    _sn = _chance(SNOW_CHANCE_ENTITY)
    l3b = (
        f"alerts={_format_alerts(_weather_alerts())} "
        f"gel={int(_fz) if _fz is not None else 'n/a'}% "
        f"neige={int(_sn) if _sn is not None else 'n/a'}%"
    )

    # Ligne 4 — historique compact (sert à la règle "3+ déviations identiques => null")
    # [-3:] : l'historique chargé fait désormais HISTORY_RUNS=20 runs (pour le déficit 6h) ;
    # le LLM n'a besoin que des 3 derniers — au-delà c'est du token gaspillé.
    hist_parts = []
    for i, e in enumerate(reversed(history[-3:]), start=1):
        d = e.get("decision", {})
        hist_parts.append(
            f"R-{i}({e.get('ts','')[11:16]}) {d.get('priorite','?')} dev={d.get('deviation','-')} "
            f"bias={d.get('bias','null')} note={d.get('note','')[:32]}"
        )
    l6 = "hist: " + " | ".join(hist_parts) if hist_parts else "hist: aucun"

    # Ligne 5 — modèle thermique (référence principale du LLM)
    t_cible = _comfort_setpoint()
    bias_opt, statut_confort = _modele_bias_optimal(
        planned_attrs.get("temp_salon"),
        planned_attrs.get("temp_ext"),
        planned_attrs.get("compressor_freq", 0),
        planned_attrs.get("state", 0),
        t_cible=t_cible,
    )
    if bias_opt is not None:
        l7 = f"modele_thermique: statut={statut_confort} bias_optimal={bias_opt} (cible={t_cible}C horizon=3h)"
    else:
        l7 = "modele_thermique: n/a"

    return "\n".join([l1, l2, l3, l3b, l6, l7])



# ─────────────────────────────────────────────────────────────────────────
# MODE SHADOW (champion-challenger vers l'autonomie) — l'expert SANS contrainte
# du plan : il propose un bias from scratch. Sa suggestion n'est JAMAIS appliquée,
# elle est LOGGÉE (heat_agent_shadow.jsonl) avec l'état, puis SCORÉE sur l'issue
# réelle (heat_agent_score) pour juger, sur plusieurs semaines, si on peut un jour
# lui confier le bias. Échantillonné (SHADOW_SAMPLE_MIN) et off par défaut (tokens).
# ─────────────────────────────────────────────────────────────────────────
SYSTEM_LIBRE = (
    "Tu es un expert en chauffage par plancher chauffant (PAC Ecodan, dalle beton, inertie 2-4h).\n"
    "On te donne l'etat de la maison et la meteo. Tu dois proposer un bias de setpoint eau (float, [-2.0, 3.0])\n"
    "pour chauffer la maison de maniere efficace et confortable, en minimisant la conso.\n"
    "PHYSIQUE : bias positif = setpoint eau plus haut = plus chaud. bias negatif = moins chaud.\n"
    "La dalle a 2-4h d inertie : agir maintenant pour l effet dans 2-4h.\n"
    "heure_solaire=nuit est NORMAL : ne pas sur-reagir a une baisse de temp ext en soiree/nuit.\n"
    "Une tendance ext negative la nuit est attendue — seul un gel imminent (<2C) justifie un boost fort.\n"
    "Reponds UNIQUEMENT en JSON : {\"bias\": <float ou null>, \"raison\": \"<90 mots max>\"}\n"
    "null = ne rien changer. Pas d'autre texte."
)


async def _call_mistral_libre(context):
    """Appel "expert libre" non contraint (best-effort, sans retry). Renvoie
    {"bias","raison","_tokens"} ou None. Invoqué seulement par _maybe_shadow si SHADOW_ENABLED.
    Toute erreur -> None (non bloquant : le shadow ne doit jamais perturber le run réel)."""
    payload = {
        "model": MISTRAL_MODEL,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_LIBRE},
            {"role": "user",   "content": context},
        ],
        "temperature": 0.4,
        "max_tokens": 120,
    }
    headers = {
        "Authorization": "Bearer " + MISTRAL_KEY,
        "Content-Type": "application/json",
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                MISTRAL_URL, json=payload, headers=headers,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as resp:
                raw = await resp.text()
                status = resp.status
        if status != 200:
            log.warning(f"Mistral libre HTTP {status}")
            return None
        resp_data = json.loads(raw)
        text = resp_data["choices"][0]["message"]["content"].strip()
        start = text.find("{"); end = text.rfind("}") + 1
        if start == -1 or end == 0:
            return None
        result = json.loads(text[start:end])
        usage = resp_data.get("usage", {})
        result["_tokens"] = {"in": usage.get("prompt_tokens","?"), "out": usage.get("completion_tokens","?")}
        return result
    except Exception as e:
        log.warning(f"Mistral libre erreur : {e}")
        return None


async def _maybe_shadow(planned_attrs, forecast, history, applied_bias, applied_src, context=None):
    """Capture shadow d'un cycle (si SHADOW_ENABLED et cycle échantillonné).

    Lance l'expert libre (suggestion non contrainte), puis logge dans SHADOW_LOG_PATH un
    instantané { état, plan, bias appliqué, suggestion shadow }. La SUGGESTION N'EST JAMAIS
    APPLIQUÉE. L'issue réelle (trajectoire salon + conso) sera rapprochée a posteriori par
    le scorer. Non bloquant de bout en bout : toute erreur est avalée (le shadow ne doit
    jamais perturber le run réel)."""
    if not SHADOW_ENABLED:
        return
    # 1 cycle/heure suffit (couverture représentative, coût borné).
    if datetime.now().minute >= SHADOW_SAMPLE_MIN:
        return
    try:
        if context is None:
            context = _build_context(planned_attrs, forecast, history, wake="shadow")
        sugg = await _call_mistral_libre(context)
        if not sugg:
            return
        tel = _telemetry(planned_attrs)
        rec = {
            "ts": datetime.now().isoformat(timespec="seconds"),
            "phase": planned_attrs.get("phase"),
            "setpoint": tel.get("setpoint"),
            "salon": planned_attrs.get("temp_salon"),
            "ext": planned_attrs.get("temp_ext"),
            "surplus_w": tel.get("surplus_w"),
            "gains_internes_w": tel.get("gains_internes_w"),
            "pac_w": tel.get("pac_w"),
            "plan_bias": planned_attrs.get("state"),
            "applied_bias": applied_bias,
            "applied_src": applied_src,
            "shadow_bias": sugg.get("bias"),
            "shadow_raison": sugg.get("raison", "")[:120],
            "shadow_tokens": sugg.get("_tokens", {}),
        }
        await _append_line(SHADOW_LOG_PATH, json.dumps(rec, ensure_ascii=False))
        log.info(f"Shadow capturé — appliqué={applied_bias} shadow={sugg.get('bias')}")
    except Exception as e:
        log.warning(f"Shadow erreur (ignorée) : {e}")


async def _call_mistral(context):
    """Appel de jugement principal. Renvoie le dict décision parsé (+ "_tokens"), ou lève
    ValueError si échec définitif (l'appelant log l'erreur et abandonne le cycle).

    Stratégie réseau (3 tentatives) :
      - 4xx hors 429 (auth, bad request)  -> ValueError immédiate (retry inutile)
      - 429 (capacité) ou 5xx (serveur)   -> backoff 60·n s ; au 2e essai sur 429,
                                             bascule sur MISTRAL_MODEL_FALLBACK
      - erreur réseau/timeout             -> retry après 15 s
    temperature=0.1 : décision quasi déterministe. response_format=json_object force le JSON."""
    payload = {
        "model": MISTRAL_MODEL,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user",   "content": context},
        ],
        "temperature": 0.1,
        "max_tokens": 150,
    }
    headers = {
        "Authorization": "Bearer " + MISTRAL_KEY,
        "Content-Type": "application/json",
    }
    status, raw = 0, ""
    for attempt in range(3):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    MISTRAL_URL, json=payload, headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as resp:
                    raw = await resp.text()
                    status = resp.status
            # Fail-fast sur 4xx non-429 (auth, bad request…) — retry inutile
            if 400 <= status < 500 and status != 429:
                raise ValueError(f"Mistral HTTP {status} (non-retryable) : {raw[:500]}")
            # Retry sur 429 (capacity) ou 5xx (serveur)
            if status == 429 or status >= 500:
                wait = 60 * (attempt + 1)
                log.warning(f"Mistral {status} (tentative {attempt+1}/3) — retry dans {wait}s")
                if attempt == 1 and status == 429:
                    payload["model"] = MISTRAL_MODEL_FALLBACK
                    log.warning(f"Bascule fallback → {MISTRAL_MODEL_FALLBACK}")
                if attempt < 2:
                    await asyncio.sleep(wait)
                    continue
                raise ValueError(f"Mistral {status} persistant : {raw[:200]}")
            break  # 200 — succès
        except ValueError:
            raise
        except Exception as e:
            # Erreur réseau / timeout — transitoire, on retente
            log.warning(f"Mistral connexion erreur (tentative {attempt+1}/3) : {e}")
            if attempt < 2:
                await asyncio.sleep(15)
                continue
            raise ValueError(f"Mistral connexion echec apres 3 tentatives : {e}")
    if status != 200:
        raise ValueError(f"Mistral HTTP {status} : {raw[:500]}")
    resp_data = json.loads(raw)
    if "choices" not in resp_data:
        raise ValueError(f"Reponse inattendue : {raw[:500]}")
    usage = resp_data.get("usage", {})
    tok_in  = usage.get("prompt_tokens", "?")
    tok_out = usage.get("completion_tokens", "?")
    log.info(f"Mistral tokens — in:{tok_in} out:{tok_out} total:{usage.get('total_tokens','?')}")
    text = resp_data["choices"][0]["message"]["content"].strip()
    # Robustesse : on isole le 1er '{' ... dernier '}' au cas où le modèle ajoute
    # du texte autour malgré json_object (rare mais arrive sur les petits modèles).
    start = text.find("{")
    end   = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("Pas de JSON : " + repr(text))
    result = json.loads(text[start:end])
    result["_tokens"] = {"in": tok_in, "out": tok_out}  # retiré du dict décision avant log
    return result


def _get_forecast():
    """Prévisions horaires de FORECAST_ENTITY (liste de dicts). [] si indispo (jamais bloquant)."""
    try:
        result = service.call(
            "weather", "get_forecasts",
            entity_id=FORECAST_ENTITY, type="hourly",
            blocking=True, return_response=True,
        )
        return (result or {}).get(FORECAST_ENTITY, {}).get("forecast", [])
    except Exception:
        return []


def _weather_alerts():
    """Retourne dict {type: niveau} pour les alertes vigilance MF != Vert.
    {} si tout vert ou capteur indisponible. Ne lit que les types pertinents en chauffe."""
    try:
        attrs = state.getattr(WEATHER_ALERT_ENTITY) or {}
    except Exception:
        return {}
    out = {}
    for t in ALERT_TYPES_CHAUFFE:
        lvl = attrs.get(t)
        if lvl and lvl != "Vert":
            out[t] = lvl
    return out


def _format_alerts(alerts):
    """Compact pour log/contexte LLM : 'Neige:Jaune,Orages:Orange' ou 'none'."""
    if not alerts:
        return "none"
    short = {"Grand-froid": "Froid", "Neige-verglas": "Neige", "Pluie-inondation": "Pluie",
             "Orages": "Orages", "Vent violent": "Vent"}
    # pyscript ne supporte pas les generator expressions dans join() -> list comprehension
    return ",".join([f"{short.get(k,k)}:{v}" for k, v in alerts.items()])


def _chance(entity):
    """Proba météo locale (gel/neige/pluie) en % -> float 0-100, ou None si indispo.
    L'état brut du capteur meteo_france est déjà le nombre ('0', '40'...), l'unité % est
    seulement à l'affichage."""
    try:
        return float(state.get(entity))
    except Exception:
        return None


def _needs_llm(planned_attrs, forecast_list, history):
    """Gate deterministe. Retourne (escalade: bool, raison: str).
    On n'appelle Mistral QUE si la couche deterministe + le modele thermique ne
    suffisent pas a trancher. Sinon : applique planned_bias (0 token Mistral).
    Reproduit en Python les seuls cas ou le LLM aurait pu devier (anomalie / meteo /
    divergence modele) ; sur tout le reste le LLM aurait repondu null de toute facon."""
    # Capteurs vitaux : sans salon/ext fiables, le modèle est aveugle -> on laisse
    # le LLM gérer le mode DÉGRADÉ (il sait répondre priorite=HAUTE bias=null).
    salon = planned_attrs.get("temp_salon")
    ext   = planned_attrs.get("temp_ext")
    try:
        ext_f = float(ext)
    except (ValueError, TypeError):
        return True, "capteur_ext"
    try:
        float(salon)
    except (ValueError, TypeError):
        return True, "capteur_salon"

    # ── Anomalies dures ── (la courbe ne les "voit" pas ; un humain trancherait)
    if str(planned_attrs.get("defrost_active", "")).lower() in ("true", "on", "1"):
        return True, "defrost"                 # dégivrage : pertes transitoires à arbitrer
    if ext_f < GATE_EXT_FROID:
        return True, "gel"                     # grand froid : marge de sécurité, jugement utile
    if str(planned_attrs.get("booster_active", "")).lower() in ("true", "on", "1") and ext_f < GATE_BOOST_EXT:
        return True, "booster_froid"           # résistance d'appoint à froid : coûteux, à valider

    # ── Météo non captée par la courbe ── (la courbe ne connaît que l'instant T)
    # Une chute marquée à venir doit déclencher une pré-chauffe que le plan n'anticipe pas.
    temps_fc = [fc.get("temperature") for fc in forecast_list[:12] if fc.get("temperature") is not None]
    if temps_fc and (temps_fc[0] - min(temps_fc)) >= GATE_CHUTE:
        return True, "chute_meteo"

    # Déficit confort (calculé une fois, réutilisé par le couplage proba ci-dessous
    # ET par la garde déficit plus bas). Négatif = sous-chauffe qui s'accumule.
    deficit = _comfort_deficit_6h(history)

    # ── Vigilance départementale MF — surcouche évènement grave ──
    # Orange/Rouge sur un type "chauffe" escaladent toujours (rare, sérieux). Le Jaune
    # n'est plus traité ici : les probas commune ci-dessous couvrent ce terrain, en plus fin.
    alerts = _weather_alerts()
    for t in ALERT_TYPES_CHAUFFE:
        lvl = alerts.get(t)
        if lvl in ("Orange", "Rouge"):
            return True, f"alerte_{ALERT_TAG.get(t, t.lower())}_{lvl.lower()}"

    # ── Anticipation gel/neige locale (probas commune) — signal principal ──
    # Prévisionnel et local. Escalade si proba >= seuil ET signal thermique réel (ext froid
    # OU déficit) : une proba qui stagne haute sans froid effectif n'ouvre pas le LLM.
    thermique = (ext_f < GATE_ALERT_EXT) or (deficit is not None and deficit <= GATE_ALERT_DEFICIT)
    if thermique:
        fz = _chance(FREEZE_CHANCE_ENTITY)
        sn = _chance(SNOW_CHANCE_ENTITY)
        if fz is not None and fz >= GATE_CHANCE_PCT:
            return True, f"gel_{int(fz)}pct+thermique"
        if sn is not None and sn >= GATE_CHANCE_PCT:
            return True, f"neige_{int(sn)}pct+thermique"

    # ── Déficit confort persistant ── (le plan "suit", mais le réel dérive lentement)
    if deficit is not None and deficit <= GATE_DEFICIT:
        return True, "deficit_confort"

    # ── Modèle thermique vs plan ── (désaccord physique : on demande l'arbitrage)
    # Uniquement si le chauffage est "voulu" (consigne >= HEAT_FLOOR). Consigne parquée
    # basse (été) => pas d'arbitrage confort : le bias ne doit de toute façon rien déclencher,
    # et comparer le salon à une cible de 15°C n'aurait aucun sens (sur_consigne permanent).
    t_cible = _comfort_setpoint()
    if t_cible >= HEAT_FLOOR:
        bias_opt, statut = _modele_bias_optimal(
            salon, ext, planned_attrs.get("compressor_freq", 0),
            planned_attrs.get("state", 0), t_cible=t_cible,
        )
        if bias_opt is not None:
            try:
                gap = abs(bias_opt - float(planned_attrs.get("state", 0)))
            except (ValueError, TypeError):
                return True, "planned_invalide"
            # En confort on tolère un écart plus large (on évite de réveiller pour 0.5°C) ;
            # hors confort le moindre désaccord net mérite un arbitrage.
            if statut == "confort":
                if gap > GATE_DIVERGE_CF:
                    return True, "modele_diverge"
            elif gap > GATE_DIVERGE:
                return True, f"modele_{statut}"

    # Aucun déclencheur : le plan est sain -> on l'applique tel quel, 0 token.
    return False, "confort"


def _validate_decision(decision, planned_attrs):
    """Normalise + sécurise la décision LLM AVANT application. Mute le dict en place et
    renvoie une liste de corrections appliquées (pour le log). Best-effort, jamais bloquant.

    Trois garde-fous, dans cet ordre :
      1. Énumérations : priorite/deviation hors liste -> valeur sûre par défaut.
      2. Bias non numérique alors qu'il devait l'être -> ramené à null (= applique le plan).
      3. Déviation `none` qui s'écarte du modèle thermique de > LLM_MODEL_TOLERANCE -> on
         considère que le LLM improvise sans raison déclarée et on rabat le bias sur null.
         (weather/anomaly sont exemptés : c'est leur rôle d'aller au-delà du modèle.)
    """
    fixes = []

    prio = decision.get("priorite")
    if prio not in VALID_PRIORITES:
        decision["priorite"] = "NORMALE"
        fixes.append(f"priorite '{prio}'->NORMALE")

    dev = decision.get("deviation")
    if dev not in VALID_DEVIATIONS:
        fixes.append(f"deviation '{dev}'->none")
        decision["deviation"] = "none"
        dev = "none"

    bias = decision.get("bias")
    if bias is not None:
        try:
            bias = float(bias)
        except (ValueError, TypeError):
            decision["bias"] = None
            fixes.append(f"bias '{bias}'->null (non numerique)")
            return fixes

        # Garde-fou modèle : une déviation NON justifiée (deviation=none) ne doit pas trop
        # s'éloigner du bias_optimal physique. On ne lit le modèle qu'en régime chauffe voulu.
        if dev == "none":
            t_cible = _comfort_setpoint()
            if t_cible >= HEAT_FLOOR:
                bias_opt, _ = _modele_bias_optimal(
                    planned_attrs.get("temp_salon"),
                    planned_attrs.get("temp_ext"),
                    planned_attrs.get("compressor_freq", 0),
                    planned_attrs.get("state", 0),
                    t_cible=t_cible,
                )
                if bias_opt is not None and abs(bias - bias_opt) > LLM_MODEL_TOLERANCE:
                    decision["bias"] = None
                    fixes.append(
                        f"bias {round(bias,2)}->null (devie de {round(bias_opt,2)} sans "
                        f"justification, >{LLM_MODEL_TOLERANCE})"
                    )

    return fixes


def _set_bias(bias_val, src, phase):
    """Applique bias_val a ENTITY_BIAS + synchronise l'input_number de la phase
    (tracabilite dashboard). Ne touche JAMAIS heat_pump_bias_off_peak. Retourne actions."""
    actions = []
    number.set_value(entity_id=ENTITY_BIAS, value=bias_val)
    actions.append(f"bias -> {bias_val} ({src})")
    inp = PHASE_INPUT_MAP.get(phase)
    if inp:
        try:
            a = state.getattr(inp) or {}
            v = round(max(float(a.get("min", -2)), min(float(a.get("max", 3)), bias_val)), 2)
            input_number.set_value(entity_id=inp, value=v)
            actions.append(f"{inp.split('.')[-1]} -> {v}")
            log.info(f"input_number sync: {inp} = {v}")
        except Exception as e:
            log.warning(f"Impossible de sync {inp}: {e}")
    return actions


@time_trigger("cron(*/20 * * * *)")
async def heat_agent_run():
    """Cycle principal (toutes les 20 min). 3 chemins de sortie possibles :
       1. veille estivale  -> applique plan, log FAIBLE, sort (le moins cher, aucun I/O réseau)
       2. gate nominal      -> applique plan, log NORMALE, sort (0 token Mistral)
       3. escalade          -> contexte + jugement LLM + application + log complet
    Voir l'en-tête du module pour le flux détaillé et le contrat JSONL."""
    log.info("=== Heat Agent demarre ===")

    # Pré-condition : sans plan déterministe valide, on ne décide de rien.
    planned_attrs = _get_planned_attrs()
    if not planned_attrs or planned_attrs.get("state") in ["unknown", "unavailable"]:
        log.error("sensor.ecodan_planned_bias indisponible ou invalide")
        return

    now_dt = datetime.now()
    phase  = planned_attrs.get("phase", "")

    # ══ CHEMIN 1 — Garde veille estivale (sortie la plus précoce, aucun I/O réseau) ══
    # PAC inactive + saison chaude + ext>=18 : rien à arbitrer. On applique le plan
    # et on saute Mistral, SAUF 1 check/jour à 18h pour anticiper la fraîcheur nocturne.
    try:
        ext_temp = float(state.get("sensor.heat_pump_outdoor_temp_fused") or 15)
    except (ValueError, TypeError):
        ext_temp = 15.0
    pac_off = str(planned_attrs.get("compressor_freq", "0")) in ("0", "0.0", "None", "?")
    if pac_off and now_dt.month in (5, 6, 7, 8, 9) and ext_temp >= 18 and now_dt.hour != 18:
        log.info(f"Veille estivale : PAC off, ext={ext_temp}°C — skip Mistral (next check 18h)")
        try:
            bias_plan = round(max(BIAS_MIN, min(BIAS_MAX, float(planned_attrs.get("state", 0)))), 2)
            actions = _set_bias(bias_plan, "plan", phase)
        except (ValueError, TypeError):
            actions = []
        await _write_log({
            "ts": now_dt.isoformat(timespec="seconds"),
            "decision": {"priorite": "FAIBLE", "deviation": "none", "bias": None,
                         "note": f"veille estivale (PAC off, ext={ext_temp}C)"},
            "actions": actions,
            "planned_bias": planned_attrs.get("state"),
            "phase": phase,
            "temp_salon": planned_attrs.get("temp_salon"),
            "temp_ext": planned_attrs.get("temp_ext"),
            "compressor_freq": planned_attrs.get("compressor_freq"),  # régresseur B du refit thermique
            "alerts": _format_alerts(_weather_alerts()),
            "telemetry": _telemetry(planned_attrs),
        })
        return

    forecast = _get_forecast()
    history = await _load_history()

    # ══ CHEMIN 2 — Gate déterministe : appeler Mistral SEULEMENT si nécessaire ══
    # Si le gate ne trouve aucune raison d'arbitrer -> le plan suffit, 0 token.
    escalate, reason = _needs_llm(planned_attrs, forecast, history)
    if not escalate:
        bias_plan = None
        try:
            bias_plan = round(max(BIAS_MIN, min(BIAS_MAX, float(planned_attrs.get("state", 0)))), 2)
            actions = _set_bias(bias_plan, "plan", phase)
        except (ValueError, TypeError):
            log.error(f"Etat planned_bias non numerique : {planned_attrs.get('state')}")
            actions = []
        note = f"nominal — plan applique ({reason})"
        await _write_log({
            "ts": now_dt.isoformat(timespec="seconds"),
            "decision": {"priorite": "NORMALE", "deviation": "none", "bias": None, "note": note},
            "actions": actions,
            "planned_bias": planned_attrs.get("state"),
            "phase": phase,
            "temp_salon": planned_attrs.get("temp_salon"),
            "temp_ext": planned_attrs.get("temp_ext"),
            "compressor_freq": planned_attrs.get("compressor_freq"),  # régresseur B du refit thermique
            "alerts": _format_alerts(_weather_alerts()),
            "telemetry": _telemetry(planned_attrs),
        })
        if actions:
            input_text.set_value(entity_id=ENTITY_NOTE, value=("[plan] " + note)[:255])
        log.info(f"Nominal ({reason}) — 0 token Mistral, plan applique")
        # Mode shadow (échantillonné, off par défaut) : couvre AUSSI les cycles nominaux,
        # pour ne pas juger le LLM que sur les cas tordus. Construit son propre contexte.
        await _maybe_shadow(planned_attrs, forecast, history, bias_plan, "plan", context=None)
        return

    # ══ CHEMIN 3 — Escalade : la couche déterministe ne tranche pas -> jugement LLM ══
    log.info(f"Escalade Mistral : {reason}")
    context = _build_context(planned_attrs, forecast, history, wake=reason)
    log.info("Contexte : " + str(len(context)) + " chars")

    try:
        decision = await _call_mistral(context)
        log.info("Decision : " + str(decision))
    except Exception as e:
        log.error("Erreur Mistral : " + str(e))
        return

    # Garde-fou : décision inexploitable (champs obligatoires manquants) -> abandon.
    if not {"priorite", "note"}.issubset(decision.keys()):
        log.error("JSON invalide (champs manquants) : " + str(decision))
        return

    # Validation/normalisation : énumérations + garde-fou bias vs modèle thermique.
    # Mute `decision` en place ; les corrections sont logguées et tracées dans l'entrée.
    fixes = _validate_decision(decision, planned_attrs)
    if fixes:
        log.warning("Decision corrigee : " + " ; ".join(fixes))

    actions = []

    # SÉMANTIQUE DU BIAS : null => on applique planned_bias (le LLM valide le plan) ;
    # une valeur => déviation transitoire décidée par le LLM. Dans les 2 cas on clampe
    # à [BIAS_MIN, BIAS_MAX]. `src` trace l'origine (LLM vs plan) pour le log/dashboard.
    bias_llm = decision.get("bias")
    if bias_llm is not None:
        try:
            bias_val = round(max(BIAS_MIN, min(BIAS_MAX, float(bias_llm))), 2)
            src = "LLM"
        except (ValueError, TypeError):
            log.error(f"Impossible de convertir le bias LLM en float: {bias_llm}")
            bias_val, src = None, None
    else:
        try:
            bias_val = round(max(BIAS_MIN, min(BIAS_MAX, float(planned_attrs.get("state", 0)))), 2)
            src = "plan"
        except (ValueError, TypeError):
            log.error(f"Etat planned_bias non numerique : {planned_attrs.get('state')}")
            bias_val, src = None, None

    if bias_val is not None:
        actions = _set_bias(bias_val, src, phase)
        log.info(f"bias -> {bias_val} ({src})")

    # off_peak_boost : suggestion LLM tracée mais JAMAIS appliquée ici.
    # Propriétaire exclusif = self-learning 06:22 (cf. en-tête + ecodan.yaml).
    boost_llm = decision.get("off_peak_boost")
    if boost_llm is not None:
        try:
            boost_val = round(max(0.5, min(3.0, float(boost_llm))), 2)
            actions.append(f"boost -> {boost_val} (LLM, log only)")
            log.info(f"boost LLM suggere {boost_val} (non applique — auto 06:22 proprietaire)")
        except (ValueError, TypeError):
            pass

    if not actions:
        log.info("Aucune action executee")

    # Seules les priorités CRITIQUE poussent une notif (gel, lockout, capteur indispo…).
    if decision.get("priorite") == "CRITIQUE":
        persistent_notification.create(
            title="Heat Agent CRITIQUE",
            message=decision["note"] + "\n\nActions : " + (", ".join(actions) if actions else "aucune"),
            notification_id="heat_agent_alert",
        )
        log.warning("Notification CRITIQUE envoyee")

    # Journalisation (CONTRAT JSONL). _tokens est extrait ici pour ne pas
    # polluer le champ `decision` réinjecté tel quel dans le résumé.
    entry = {
        "ts": datetime.now().isoformat(timespec="seconds"),
        "decision": decision,
        "actions": actions,
        "planned_bias": planned_attrs.get("state"),
        "phase": phase,
        "temp_salon": planned_attrs.get("temp_salon"),
        "temp_ext": planned_attrs.get("temp_ext"),
        "compressor_freq": planned_attrs.get("compressor_freq"),  # régresseur B du refit thermique
        "wake": reason,                              # ce qui a déclenché l'escalade
        "alerts": _format_alerts(_weather_alerts()), # vigilance MF compactée
        "telemetry": _telemetry(planned_attrs),
        "tokens": decision.pop("_tokens", {}),       # extrait + retiré de decision
    }
    if fixes:                                        # trace des corrections (analyse dérapages LLM)
        entry["llm_fixes"] = fixes
    await _write_log(entry)

    # Mode shadow (échantillonné, off par défaut) — réutilise le contexte déjà construit.
    await _maybe_shadow(planned_attrs, forecast, history, bias_val, src, context=context)

    # Note lisible sur le dashboard, préfixée par l'origine de la décision.
    note_txt = decision.get("note", "")
    if note_txt:
        prefix = "[llm] " if src == "LLM" else "[plan] "
        input_text.set_value(entity_id=ENTITY_NOTE, value=(prefix + note_txt)[:255])

    log.info("=== Heat Agent termine ===")


@service
async def heat_agent_test():
    """Service HA `pyscript.heat_agent_test` : déclenche un cycle à la demande (debug).
    Passe par toute la logique (gate inclus) — n'appelle donc Mistral que si ça escalade."""
    await heat_agent_run()


# ═══════════════════════════════════════════════════════════════════════════
# SCORER QUOTIDIEN — suivi de perf + évaluation shadow
# ═══════════════════════════════════════════════════════════════════════════
# Tourne chaque soir (après le résumé). Calcule TOUJOURS le confort + le coût du jour
# (suivi gratuit, lecture seule). Si des échantillons shadow existent, ajoute la
# divergence shadow↔appliqué et l'issue réelle qui a suivi chaque échantillon.
#
# LIMITE ASSUMÉE : pas de vrai contrefactuel (on ne sait pas ce qu'aurait donné le bias
# shadow s'il avait été appliqué — il faudrait l'exécuter pour le savoir). Ce que le score
# mesure honnêtement : (1) la perf réelle du système (confort/coût), (2) à quel point et à
# quelle fréquence le shadow VOULAIT dévier de ce qui a été appliqué, (3) l'issue constatée
# après chaque échantillon. De quoi juger, sur des semaines, si le shadow est crédible.

def _parse_ts(s):
    try:
        return datetime.fromisoformat(s)
    except Exception:
        return None


@service
@time_trigger("cron(5 20 * * *)")
async def heat_agent_score():
    """Service `pyscript.heat_agent_score` (+ auto 20:05). Écrit 1 ligne/jour dans SCORE_LOG_PATH."""
    log.info("=== Heat Agent Score démarré ===")
    day = datetime.now().date().isoformat()
    main = await _read_day_jsonl(LOG_PATH, day)
    if not main:
        log.warning("Score : aucune donnée aujourd'hui")
        return

    # ── Série temporelle pour confort + lookahead (cycles "chauffe voulu" uniquement) ──
    pts = []  # (datetime, salon, setpoint, pac_w)
    err_sum, in_band, n_chauffe = 0.0, 0, 0
    for e in main:
        t = _parse_ts(e.get("ts", ""))
        tel = e.get("telemetry", {}) or {}
        sp = tel.get("setpoint")
        try:
            salon = float(e.get("temp_salon"))
        except (TypeError, ValueError):
            salon = None
        pac = tel.get("pac_w")
        if t is not None and salon is not None and sp is not None:
            pts.append((t, salon, sp, pac))
            if sp >= HEAT_FLOOR:                      # confort jugé seulement si chauffage voulu
                n_chauffe += 1
                err = abs(salon - sp)
                err_sum += err
                if err <= CONFORT_DELTA:
                    in_band += 1

    confort_err = round(err_sum / n_chauffe, 2) if n_chauffe else None
    confort_pct = round(100 * in_band / n_chauffe) if n_chauffe else None
    conso_kwh = _num("sensor.pac_energie_consommee_jour")

    # ── Évaluation shadow (si échantillons) ──
    shadow = await _read_day_jsonl(SHADOW_LOG_PATH, day)
    shadow_stat = None
    if shadow:
        divs, big, issue_errs = [], 0, []
        for s in shadow:
            sb, ab = s.get("shadow_bias"), s.get("applied_bias")
            if isinstance(sb, (int, float)) and isinstance(ab, (int, float)):
                d = abs(sb - ab)
                divs.append(d)
                if d > 0.5:
                    big += 1
            # Issue réelle suivant l'échantillon : |salon-consigne| moyen sur SCORE_HORIZON_H
            t0 = _parse_ts(s.get("ts", ""))
            if t0 is not None:
                window = [abs(sa - sp) for (t, sa, sp, _) in pts
                          if 0 <= (t - t0).total_seconds() <= SCORE_HORIZON_H * 3600 and sp >= HEAT_FLOOR]
                if window:
                    issue_errs.append(sum(window) / len(window))
        shadow_stat = {
            "n": len(shadow),
            "div_moy": round(sum(divs) / len(divs), 2) if divs else None,
            "n_div_fort": big,                         # nb d'échantillons où shadow voulait dévier >0.5
            "issue_confort_moy": round(sum(issue_errs) / len(issue_errs), 2) if issue_errs else None,
        }

    rec = {
        "ts": datetime.now().isoformat(timespec="seconds"),
        "jour": day,
        "n_cycles": len(main),
        "n_chauffe": n_chauffe,
        "confort_err_moy": confort_err,         # °C d'écart moyen à la consigne (cycles chauffe)
        "confort_pct_in_band": confort_pct,     # % du temps dans [consigne ± 0.25]
        "conso_kwh": conso_kwh,
        "shadow": shadow_stat,
    }
    await _append_line(SCORE_LOG_PATH, json.dumps(rec, ensure_ascii=False))
    log.info(f"Score {day} : confort_err={confort_err}C in_band={confort_pct}% conso={conso_kwh}kWh "
             f"shadow={shadow_stat}")

    # Notification seulement pendant une campagne shadow (sinon suivi silencieux dans le JSONL).
    if SHADOW_ENABLED and shadow_stat:
        persistent_notification.create(
            title="Heat Agent — Score du " + day,
            message=(f"Confort : écart moyen {confort_err}°C, {confort_pct}% dans la bande.\n"
                     f"Conso PAC : {conso_kwh} kWh.\n"
                     f"Shadow : {shadow_stat['n']} échantillons, divergence moy {shadow_stat['div_moy']}, "
                     f"{shadow_stat['n_div_fort']} écarts forts (>0.5)."),
            notification_id="heat_agent_score",
        )
    log.info("=== Heat Agent Score terminé ===")


# ═══════════════════════════════════════════════════════════════════════════
# REFIT THERMIQUE OFFLINE — recalibre THERM_A/B/C sur les données réelles
# ═══════════════════════════════════════════════════════════════════════════
# Le modèle (THERM_A/B/C) est calibré sur mars-mai 2026. La saison froide a une
# physique différente (pertes plus fortes, PAC plus sollicitée, defrost). Ce service
# relit le JSONL, reconstruit l'équation horaire dT_salon = A·(salon-ext) + B·freq + C
# par régression linéaire multiple, et PROPOSE de nouveaux coefficients.
#
# IL N'APPLIQUE RIEN : THERM_A/B/C sont des constantes module. La proposition est loggée
# (ANALYSIS_LOG_PATH) + notifiée ; à toi de recopier les valeurs si le fit est bon. C'est
# le cœur de la stratégie "empirique à partir de l'automne" : accumuler, puis recalibrer.

def _solve_3x3(ata, atb):
    """Résout le système normal (AᵀA)·x = Aᵀb pour x=[A,B,C], en pur Python (Gauss + pivot
    partiel). ata = matrice 3×3 (liste de listes), atb = vecteur 3. Renvoie [A,B,C] ou None
    si singulière. Pas de numpy (pas garanti en pyscript)."""
    # Matrice augmentée [ata | atb]
    m = [list(ata[i]) + [atb[i]] for i in range(3)]
    for col in range(3):
        # Pivot partiel : plus grand |valeur| sur la colonne, sous la diagonale
        piv = max(range(col, 3), key=lambda r: abs(m[r][col]))
        if abs(m[piv][col]) < 1e-12:
            return None
        m[col], m[piv] = m[piv], m[col]
        # Élimination
        for r in range(3):
            if r != col:
                f = m[r][col] / m[col][col]
                for c in range(col, 4):
                    m[r][c] -= f * m[col][c]
    return [m[i][3] / m[i][i] for i in range(3)]


def _build_refit_points(entries):
    """Transforme une liste d'entrées JSONL chronologiques en points de régression.

    Pour chaque PAIRE de runs consécutifs (t0->t1, écart 0.1-1.5 h) on calcule :
      y  = (salon1 - salon0) / dt_h           observation dT_salon/h
      x1 = (salon0 - ext0)                    régresseur perte (coef A)
      x2 = freq0                              régresseur apport PAC (coef B)
      (le terme constant C est la 3ᵉ colonne implicite = 1)
    Garde-fous : champs présents/numériques, dt dans [0.1, 1.5] h (sinon trou de log),
    et on EXCLUT les pas où la consigne est sous HEAT_FLOOR (été parqué : dynamique non
    représentative du chauffage). Renvoie liste de (x1, x2, y)."""
    rows = []
    prev = None
    for e in entries:
        t = _parse_ts(e.get("ts", ""))
        try:
            salon = float(e.get("temp_salon"))
            ext   = float(e.get("temp_ext"))
            freq  = float(e.get("compressor_freq"))
        except (TypeError, ValueError):
            t = None  # entrée inexploitable -> casse la chaîne de paires
        sp = (e.get("telemetry", {}) or {}).get("setpoint")
        if t is None:
            prev = None
            continue
        if prev is not None:
            dt_h = (t - prev[0]).total_seconds() / 3600
            if 0.1 <= dt_h <= 1.5 and (prev[4] is None or prev[4] >= HEAT_FLOOR):
                y = (salon - prev[1]) / dt_h
                rows.append((prev[1] - prev[2], prev[3], y))  # (salon0-ext0, freq0, dT/h)
        prev = (t, salon, ext, freq, sp)
    return rows


def _regress_thermal(rows):
    """Régression linéaire multiple y = A·x1 + B·x2 + C sur les points (x1,x2,y).
    Renvoie {A,B,C,r2,n} ou None. Construit AᵀA / Aᵀb puis résout via _solve_3x3."""
    n = len(rows)
    if n < 3:
        return None
    # AᵀA (3×3) et Aᵀb (3) avec la 3ᵉ colonne de design = 1 (terme constant C)
    ata = [[0.0] * 3 for _ in range(3)]
    atb = [0.0, 0.0, 0.0]
    ybar = sum(r[2] for r in rows) / n
    for x1, x2, y in rows:
        xs = (x1, x2, 1.0)
        for i in range(3):
            atb[i] += xs[i] * y
            for j in range(3):
                ata[i][j] += xs[i] * xs[j]
    coef = _solve_3x3(ata, atb)
    if coef is None:
        return None
    A, B, C = coef
    # R² : 1 - SS_res/SS_tot
    ss_res = sum((y - (A * x1 + B * x2 + C)) ** 2 for x1, x2, y in rows)
    ss_tot = sum((y - ybar) ** 2 for _, _, y in rows) or 1e-9
    return {"A": round(A, 5), "B": round(B, 5), "C": round(C, 4),
            "r2": round(1 - ss_res / ss_tot, 3), "n": n}


@service
async def heat_agent_refit(days=None):
    """Service `pyscript.heat_agent_refit` (à la demande). Recalibre THERM_A/B/C sur les
    `days` derniers jours de logs (défaut REFIT_DEFAULT_DAYS) et PROPOSE de nouveaux coefs.
    N'applique rien : copie les valeurs à la main dans le code si le fit est satisfaisant.

    Verdict de crédibilité : refuse si < REFIT_MIN_POINTS points ou R² < 0.2 (modèle non
    identifiable -> souvent pas assez de variété de freq/froid : revenir en plein hiver)."""
    from datetime import timedelta
    log.info("=== Heat Agent Refit démarré ===")
    nd = int(days) if days else REFIT_DEFAULT_DAYS
    cutoff = (datetime.now() - timedelta(days=nd)).isoformat(timespec="seconds")
    entries = await _read_since_jsonl(LOG_PATH, cutoff)
    entries.sort(key=lambda e: e.get("ts", ""))
    rows = _build_refit_points(entries)
    fit = _regress_thermal(rows)

    if fit is None or fit["n"] < REFIT_MIN_POINTS:
        n = fit["n"] if fit else 0
        msg = (f"Refit non crédible : {n} points (min {REFIT_MIN_POINTS}). "
               f"Attendre plus de données (idéalement en hiver, freq variée).")
        log.warning(msg)
        persistent_notification.create(title="Heat Agent — Refit", message=msg,
                                       notification_id="heat_agent_refit")
        return

    rec = {
        "ts": datetime.now().isoformat(timespec="seconds"),
        "type": "refit_thermique",
        "fenetre_jours": nd,
        "actuel": {"A": THERM_A, "B": THERM_B, "C": THERM_C},
        "propose": {"A": fit["A"], "B": fit["B"], "C": fit["C"]},
        "r2": fit["r2"],
        "n_points": fit["n"],
    }
    await _append_line(ANALYSIS_LOG_PATH, json.dumps(rec, ensure_ascii=False))
    log.info(f"Refit : {rec}")

    # Verdict : on ne suggère d'APPLIQUER que si le fit explique une part raisonnable
    # de la variance ET garde les signes physiques attendus (A<0 pertes, B>0 apport PAC).
    fiable = fit["r2"] >= 0.2 and fit["A"] < 0 and fit["B"] > 0
    verdict = "✅ fit cohérent (signes physiques OK)" if fiable else \
              "⚠️ fit douteux (R² faible ou signes non physiques) — NE PAS appliquer tel quel"
    persistent_notification.create(
        title="Heat Agent — Proposition de refit",
        message=(f"{verdict}\n"
                 f"R²={fit['r2']} sur {fit['n']} points ({nd} j).\n\n"
                 f"Actuel  : A={THERM_A} B={THERM_B} C={THERM_C}\n"
                 f"Proposé : A={fit['A']} B={fit['B']} C={fit['C']}\n\n"
                 f"Si OK, recopie ces 3 valeurs dans heat_agent.py (THERM_A/B/C). Non appliqué auto."),
        notification_id="heat_agent_refit",
    )
    log.info("=== Heat Agent Refit terminé ===")


# ═══════════════════════════════════════════════════════════════════════════
# AUTO-TUNING DU GATE — diagnostic d'escalade par cause (wake)
# ═══════════════════════════════════════════════════════════════════════════
# Les seuils GATE_* décident QUAND on dépense des tokens. Réglés à la main. Ce service
# relit le JSONL et mesure, PAR cause d'escalade (`wake`) :
#   - combien de fois cette cause a réveillé le LLM (coût) ;
#   - parmi ces réveils, combien ont produit une VRAIE déviation (deviation in
#     {anomaly,weather} ET bias appliqué) vs combien ont juste validé le plan (null).
# Une cause qui réveille souvent mais ne dévie ~jamais = gate trop bavard sur ce motif :
# le LLM ne fait que tamponner le plan -> tokens gaspillés. Le service le SIGNALE et
# suggère un sens d'ajustement ; il N'ÉCRIT AUCUN seuil (constantes module, à régler main).

@service
async def heat_agent_tune_gate(days=None):
    """Service `pyscript.heat_agent_tune_gate` (à la demande). Analyse l'efficacité de chaque
    cause d'escalade sur les `days` derniers jours (défaut REFIT_DEFAULT_DAYS) et propose
    quelles causes resserrer. Lecture seule : ne modifie aucun GATE_*."""
    from datetime import timedelta
    log.info("=== Heat Agent Tune Gate démarré ===")
    nd = int(days) if days else REFIT_DEFAULT_DAYS
    cutoff = (datetime.now() - timedelta(days=nd)).isoformat(timespec="seconds")
    entries = await _read_since_jsonl(LOG_PATH, cutoff)

    n_total = len(entries)
    n_escalade = 0
    # Par wake : {wake: [n_reveils, n_deviations_reelles]}
    stats = {}
    for e in entries:
        wake = e.get("wake")
        if not wake:
            continue  # cycle nominal/veille (pas d'escalade)
        n_escalade += 1
        d = e.get("decision", {}) or {}
        devie = d.get("deviation") in ("anomaly", "weather") and d.get("bias") is not None
        s = stats.setdefault(wake, [0, 0])
        s[0] += 1
        if devie:
            s[1] += 1

    if not stats:
        msg = f"Aucune escalade sur {nd} j ({n_total} cycles) — gate silencieux (normal hors hiver)."
        log.info(msg)
        persistent_notification.create(title="Heat Agent — Tune Gate", message=msg,
                                       notification_id="heat_agent_tune")
        return

    # Construit le rapport + recommandations (taux de déviation faible = candidat à resserrer).
    lignes = []
    reco = []
    par_wake = {}
    for wake, (nrev, ndev) in sorted(stats.items(), key=lambda kv: -kv[1][0]):
        taux = round(100 * ndev / nrev) if nrev else 0
        par_wake[wake] = {"reveils": nrev, "deviations": ndev, "taux_deviation_pct": taux}
        lignes.append(f"{wake}: {nrev} réveils, {taux}% utiles")
        # Heuristique : >=5 réveils et <20% d'entre eux dévient => bavard, à resserrer.
        if nrev >= 5 and taux < 20:
            reco.append(f"• {wake} : {nrev} réveils pour {taux}% utiles — gate trop bavard, "
                        f"resserrer le seuil correspondant.")

    rec = {
        "ts": datetime.now().isoformat(timespec="seconds"),
        "type": "tune_gate",
        "fenetre_jours": nd,
        "n_cycles": n_total,
        "n_escalades": n_escalade,
        "taux_escalade_pct": round(100 * n_escalade / n_total) if n_total else 0,
        "par_wake": par_wake,
        "recommandations": reco,
    }
    await _append_line(ANALYSIS_LOG_PATH, json.dumps(rec, ensure_ascii=False))
    log.info(f"Tune gate : {rec}")

    reco_txt = "\n".join(reco) if reco else "Aucune cause manifestement trop bavarde."
    persistent_notification.create(
        title="Heat Agent — Diagnostic du gate",
        message=(f"{nd} j : {n_escalade}/{n_total} cycles ont escaladé "
                 f"({rec['taux_escalade_pct']}%).\n\n"
                 + "\n".join(lignes) + "\n\nRecommandations :\n" + reco_txt
                 + "\n\n(Aucun seuil modifié — ajuste les GATE_* à la main.)"),
        notification_id="heat_agent_tune",
    )
    log.info("=== Heat Agent Tune Gate terminé ===")
