"""
═══════════════════════════════════════════════════════════════════════════════
 HEAT AGENT — Résumé narratif journalier (pyscript HA)
═══════════════════════════════════════════════════════════════════════════════

RÔLE
    À 20h00, relit le JSONL du jour (écrit par heat_agent.py), le condense en un
    journal, demande à Mistral un récit à la 1re personne, puis pousse une notif
    mobile + une notif persistante HA.

GATE D'ÉCONOMIE
    Si AUCUNE déviation LLM dans la journée (deviation == "none" partout, cas normal
    en DPE A doux), le résumé est ANNULÉ : rien d'intéressant à raconter, 0 token.
    Le récit n'est donc généré que les jours où l'agent a réellement dévié du plan.

CONTRAT JSONL (partagé avec heat_agent.py)
    Lecture seule. On lit ts, decision{priorite,deviation,note}, actions, et wake
    (raison d'escalade, si présent). _build_journal regroupe les runs nominaux et
    ne détaille que les déviations -> journal court (tokens) + récit pertinent.

NB : appel via urllib dans un @pyscript_executor (thread) — sortie en PROSE libre
     (pas de json_object, contrairement à l'agent de décision).
"""

import asyncio
import json
import aiohttp
from datetime import datetime, date
from ha_secrets import MISTRAL_KEY, GEMINI_KEY, NEMOTRON_KEY

# Fournisseur du résumé narratif : "gemini" | "mistral" | "nemotron" | "alternate".
# "nemotron" = test en cours (30/06/2026) du gros raisonneur NVIDIA Nemotron-3 Ultra 550B
# sur ce cas idéal (1 appel/jour, qualité prime, débit osef). À comparer à mistral/gemini.
# "alternate" = comparaison Mistral jours PAIRS / Gemini jours IMPAIRS (mise en pause le temps
# du test Nemotron).
PROVIDER = "nemotron"

MISTRAL_MODEL = "mistral-medium-2508"
MISTRAL_URL   = "https://api.mistral.ai/v1/chat/completions"
GEMINI_MODEL  = "gemini-3.1-flash-lite-preview"
GEMINI_URL    = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
# NVIDIA NIM = API OpenAI-compatible. ⚠️ llama-3.1-nemotron-ultra-253b renvoie 404 (pas
# activé pour ce compte) ; le vrai Ultra accessible = nemotron-3-ultra-550b-a55b (MoE,
# ~1 s/appel, spec-decoding). Le raisonnement sort dans message.reasoning_content (ignoré),
# le récit final dans message.content.
NEMOTRON_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
NEMOTRON_URL   = "https://integrate.api.nvidia.com/v1/chat/completions"
LOG_PATH      = "/config/logs/heat_agent_log.jsonl"  # même fichier que l'agent de décision
# Cible de notif — bascule Telegram (2026-07-06 : les notifs Pixel sans action
# étaient illisibles). Le bot Telegram @Ha_maison_chris_bot est lisible dans le chat.
# changer le canal = changer UNIQUEMENT cette constante.
NOTIFY_TARGET = "notify.maison_maison_chris"

# Prompt du narrateur. temperature=0.7 (récit vivant, ≠ décision déterministe).
# Une seule requête/jour, gabarit court (≈300 mots) -> coût marginal vs la boucle 20 min.
SUMMARY_SYSTEM = (
    "Tu es l'agent thermique intelligent d'une maison. "
    "Tu controles une PAC Mitsubishi Ecodan sur plancher chauffant. "
    "On te donne le journal de toutes tes decisions de la journee. "
    "Raconte ta journee au proprietaire en 300 mots maximum, en francais, "
    "a la premiere personne. Va droit au but : pas de formule de politesse type "
    "'Bonjour Monsieur/Madame', commence directement par le bilan. "
    "Sois concret : cite les temperatures, les phases tarifaires, "
    "tes deviations et pourquoi. Mentionne ce qui t'a surpris ou inquiete. "
    "Si une conso PAC du jour est fournie (kWh), cite-la et commente-la brievement. "
    "POINT IMPORTANT sur la meteo : une 'chute_meteo' (ex: chute_meteo detectee -12.3C) "
    "n'est PAS une chute brutale en temps reel. C'est l'ecart entre la temperature "
    "actuelle et le MINIMUM PREVU sur les 12 prochaines heures (la fraicheur de la nuit "
    "a venir). En ete, un jour a 36C suivi d'une nuit a 22C donne mecaniquement une "
    "'chute_meteo' de -14C, ce qui est NORMAL et attendu, pas un evenement dramatique ni "
    "un orage. Ne raconte JAMAIS cela comme une variation brutale, une remontee spectaculaire "
    "ou un phenomene meteo extreme : c'est juste l'amplitude jour/nuit prevue. "
    "Si le journal mentionne des alertes vigilance Meteo France (alerts=...), explique-les "
    "et relie-les aux variations thermiques (orage, neige/verglas = perte de rendement PAC, "
    "vent = sur-consommation) — mais SEULEMENT si une vraie alerte est presente. "
    "La maison est situee a Burthecourt-aux-Chenes (Lorraine). Si un bloc 'METEO REELLE "
    "(source Meteo-France)' est fourni en fin de journal, appuie-toi DESSUS pour parler du "
    "temps et de la nuit a venir (condition, min/max, pluie) : ce sont les vraies previsions "
    "locales. N'invente jamais de meteo qui n'y figure pas. "
    "Termine par une phrase sur ce que tu prevois pour la nuit. "
    "Ton ton est professionnel mais accessible et direct, pas robotique, pas guinde."
)


LOCATION = "Burthécourt-aux-Chênes (Lorraine, Grand Est)"
WEATHER_ENTITY = "weather.burthecourt_aux_chenes"


async def _build_weather_context():
    """Météo RÉELLE Météo-France de la commune (condition actuelle + prévision 2 j),
    injectée dans le journal pour ancrer le récit sur des données vraies (≠ hallucination).
    Renvoie un bloc texte, ou '' si l'entité/forecast indisponible."""
    try:
        st = state.get(WEATHER_ENTITY)
        if st in (None, "unknown", "unavailable"):
            return ""
        t = state.getattr(WEATHER_ENTITY) or {}
        now = f"Météo actuelle à {LOCATION} : {st}, {t.get('temperature','?')}°C, " \
              f"humidité {t.get('humidity','?')}%, vent {t.get('wind_speed','?')} km/h."
        lines = [now]
        # prévision journalière via le service weather.get_forecasts
        resp = await service.call(
            "weather", "get_forecasts",
            entity_id=WEATHER_ENTITY, type="daily",
            blocking=True, return_response=True,
        )
        fc = (resp or {}).get(WEATHER_ENTITY, {}).get("forecast", [])[:2]
        if fc:
            lines.append("Prévision Météo-France :")
            for f in fc:
                day = f.get("datetime", "")[:10]
                lines.append(
                    f"  {day} : {f.get('condition','?')}, min {f.get('templow','?')}°C "
                    f"/ max {f.get('temperature','?')}°C, pluie {f.get('precipitation','?')}mm"
                )
        return "\n".join(lines)
    except Exception as e:
        log.warning(f"Météo context indispo : {e}")
        return ""


@pyscript_executor
def _read_today_jsonl(path):
    """Toutes les entrées du JSONL dont le ts commence par la date du jour (thread, I/O).
    Tolérant aux lignes corrompues et au fichier absent (-> [])."""
    today = date.today().isoformat()
    entries = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    e = json.loads(line)
                    if e.get("ts", "").startswith(today):
                        entries.append(e)
                except Exception:
                    pass
    except Exception:
        pass
    return entries


def _build_journal(entries):
    """Condense les runs du jour en texte pour le narrateur.

    Les runs nominaux consécutifs (deviation=="none") sont REGROUPÉS en une ligne
    ("08:00-14:00 | 18 runs nominaux …") au lieu d'être listés un par un -> journal
    bien plus court (donc moins de tokens) ET récit centré sur ce qui a vraiment
    bougé. Les déviations sont détaillées (heure, priorité, wake, actions, note).
    La `raison` nominale est extraite de la note (texte entre parenthèses)."""
    if not entries:
        return "Aucune donnee disponible pour aujourd'hui."
    lines = [f"=== JOURNAL DU {date.today().strftime('%d/%m/%Y')} ({len(entries)} runs) ==="]

    # ── Transitions d'alerte vigilance MF intra-journee ──
    # Le snapshot 20h ne suffit pas (l'orage de 15h peut etre retombe). On loggue chaque
    # changement d'alerte avec son heure -> le narrateur peut relier les chutes thermiques.
    prev_alert = None
    alert_log = []
    for e in entries:
        a = e.get("alerts", "none")
        if a != prev_alert:
            alert_log.append((e.get("ts", "")[11:16], a))
            prev_alert = a
    if alert_log and not (len(alert_log) == 1 and alert_log[0][1] == "none"):
        lines.append("ALERTES VIGILANCE MF :")
        for hhmm, a in alert_log:
            lines.append(f"  {hhmm} -> alerts={a}")
    lines.append("")

    nominal = []  # (hhmm, raison) — runs sans deviation, regroupes

    def _flush():
        if not nominal:
            return
        t0, t1 = nominal[0][0], nominal[-1][0]
        span = t0 if t0 == t1 else f"{t0}-{t1}"
        # raison nominale la plus frequente sur la plage
        counts = {}
        for _, r in nominal:
            counts[r] = counts.get(r, 0) + 1
        raison = max(counts, key=counts.get)
        lines.append(f"{span} | {len(nominal)} runs nominaux (plan applique, {raison})")
        nominal.clear()

    for e in entries:
        hhmm = e.get("ts", "")[11:16]
        d    = e.get("decision", {})
        dev  = d.get("deviation", "none")
        note = d.get("note", "")
        if dev == "none":
            raison = note.split("(")[-1].rstrip(")") if "(" in note else "confort"
            nominal.append((hhmm, raison))
            continue
        _flush()  # vider le buffer nominal avant une ligne de deviation
        acts = e.get("actions", [])
        prio = d.get("priorite", "?")
        wake = e.get("wake", "")
        alerts = e.get("alerts", "")
        acts_str = ", ".join(acts) if acts else "aucune action"
        wake_str = f" wake={wake}" if wake else ""
        alerts_str = f" alerts={alerts}" if alerts and alerts != "none" else ""
        lines.append(f"{hhmm} | {prio} | dev={dev}{wake_str}{alerts_str} | {acts_str} | {note}")
    _flush()
    return "\n".join(lines)


@pyscript_executor
def _call_mistral_summary_sync(journal):
    """Appel narratif (thread, urllib). Sortie = PROSE (pas de JSON). Retry simple sur
    429 (pause 30 s). Lève ValueError sinon. Renvoie le texte du récit."""
    import urllib.request
    payload = json.dumps({
        "model": MISTRAL_MODEL,
        "messages": [
            {"role": "system", "content": SUMMARY_SYSTEM},
            {"role": "user",   "content": journal},
        ],
        "temperature": 0.7,
        "max_tokens": 450,
    }).encode("utf-8")
    headers = {
        "Authorization": "Bearer " + MISTRAL_KEY,
        "Content-Type": "application/json",
    }
    for attempt in range(3):
        try:
            req = urllib.request.Request(MISTRAL_URL, data=payload, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=45) as resp:
                raw = resp.read().decode("utf-8")
                status = resp.status
        except urllib.error.HTTPError as e:
            # urlopen LÈVE HTTPError sur tout statut non-2xx : sans ce bloc, un 429
            # partait en "Connexion Mistral" sans retry (le test status==429 d'origine
            # était du code mort). Retry uniquement sur 429 ; le reste = fail-fast.
            if e.code == 429 and attempt < 2:
                import time
                time.sleep(30)
                continue
            try:
                body = e.read().decode("utf-8", "replace")[:300]
            except Exception:
                body = ""
            raise ValueError(f"Mistral HTTP {e.code} : {body}")
        except Exception as e:
            raise ValueError(f"Connexion Mistral : {e}")
        break
    if status != 200:
        raise ValueError(f"Mistral HTTP {status} : {raw[:300]}")
    data = json.loads(raw)
    return data["choices"][0]["message"]["content"].strip()


async def _call_mistral_summary(journal):
    # Pont async -> executor (le travail bloquant est dans la version _sync).
    return await _call_mistral_summary_sync(journal)


@pyscript_executor
def _call_gemini_summary_sync(journal):
    """Appel narratif Gemini (thread, urllib). Sortie = PROSE. Retry sur 429 (pause 30 s).
    Gemini : system_instruction séparé, contents/parts, réponse dans candidates[0].
    NB : gemini-2.5-flash fait du reasoning interne -> maxOutputTokens large (sinon la
    réponse peut sortir vide, tout le budget passant dans le 'thinking')."""
    import urllib.request
    url = GEMINI_URL.format(model=GEMINI_MODEL, key=GEMINI_KEY)
    payload = json.dumps({
        "system_instruction": {"parts": [{"text": SUMMARY_SYSTEM}]},
        "contents": [{"parts": [{"text": journal}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2000},
    }).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=45) as resp:
                raw = resp.read().decode("utf-8")
                status = resp.status
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                import time
                time.sleep(30)
                continue
            try:
                body = e.read().decode("utf-8", "replace")[:300]
            except Exception:
                body = ""
            raise ValueError(f"Gemini HTTP {e.code} : {body}")
        except Exception as e:
            raise ValueError(f"Connexion Gemini : {e}")
        break
    if status != 200:
        raise ValueError(f"Gemini HTTP {status} : {raw[:300]}")
    data = json.loads(raw)
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError):
        raise ValueError(f"Gemini réponse inattendue : {raw[:300]}")


async def _call_gemini_summary(journal):
    return await _call_gemini_summary_sync(journal)


@pyscript_executor
def _call_nemotron_summary_sync(journal):
    """Appel narratif NVIDIA Nemotron (thread, urllib). API OpenAI-compatible, donc même
    schéma que Mistral. Retry sur 429 (pause 30 s).

    ⚠️ PIÈGES Nemotron-3 (vécus 30/06/2026, testés en réel) :
    - `detailed thinking OFF` ne coupe PAS le raisonnement : le modèle réfléchit quand même
      et écrit son brouillon (en ANGLAIS) dans `content` -> bilan inutilisable. Il faut au
      contraire `detailed thinking ON` : alors il range proprement le raisonnement dans
      `message.reasoning_content` (qu'on IGNORE) et le récit FR final dans `message.content`.
    - budget serré (600) = coupé en plein raisonnement avant le récit (finish=length).
      Il faut un gros `max_tokens` (4000) : le reasoning mange ~600 tok avant le bilan.
    Avec ON + 4000 : finish=stop, récit FR concret en ~6 s. cf. [[reference_nemotron_key]]."""
    import urllib.request
    payload = json.dumps({
        "model": NEMOTRON_MODEL,
        "messages": [
            {"role": "system", "content": "detailed thinking on\n" + SUMMARY_SYSTEM},
            {"role": "user",   "content": journal},
        ],
        "temperature": 0.7,
        "max_tokens": 4000,  # le reasoning consomme ~600 tok AVANT le récit -> budget large
    }).encode("utf-8")
    headers = {
        "Authorization": "Bearer " + NEMOTRON_KEY,
        "Content-Type": "application/json",
    }
    for attempt in range(3):
        try:
            req = urllib.request.Request(NEMOTRON_URL, data=payload, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=90) as resp:  # 90 s : gros modèle, peut raisonner
                raw = resp.read().decode("utf-8")
                status = resp.status
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                import time
                time.sleep(30)
                continue
            try:
                body = e.read().decode("utf-8", "replace")[:300]
            except Exception:
                body = ""
            raise ValueError(f"Nemotron HTTP {e.code} : {body}")
        except Exception as e:
            raise ValueError(f"Connexion Nemotron : {e}")
        break
    if status != 200:
        raise ValueError(f"Nemotron HTTP {status} : {raw[:300]}")
    data = json.loads(raw)
    try:
        txt = (data["choices"][0]["message"].get("content") or "").strip()
    except (KeyError, IndexError):
        raise ValueError(f"Nemotron réponse inattendue : {raw[:300]}")
    # Garde-fou : si le modèle a tout mis dans reasoning_content et laissé content vide,
    # on le signale clairement plutôt que d'envoyer un bilan vide.
    if not txt:
        raise ValueError("Nemotron a renvoyé un content vide (budget consommé par le reasoning ?)")
    return txt


async def _call_nemotron_summary(journal):
    return await _call_nemotron_summary_sync(journal)


async def _call_summary(journal):
    """Dispatcher selon PROVIDER (gemini | mistral | nemotron | alternate).
    "alternate" : Mistral les jours pairs, Gemini les jours impairs (comparaison).
    Renvoie (texte, label_modele) pour tracer qui a écrit le résumé."""
    prov = PROVIDER
    if prov == "alternate":
        prov = "mistral" if (date.today().day % 2 == 0) else "gemini"
    if prov == "nemotron":
        return await _call_nemotron_summary(journal), NEMOTRON_MODEL
    if prov == "gemini":
        return await _call_gemini_summary(journal), GEMINI_MODEL
    return await _call_mistral_summary(journal), MISTRAL_MODEL


@service                              # exposé : pyscript.heat_agent_summary (déclenchable à la main)
@time_trigger("cron(0 20 * * *)")     # auto chaque jour à 20h00
async def heat_agent_summary():
    """Génère et pousse le bilan du jour. Annulé si aucune entrée, ou si 0 déviation
    (cf. GATE D'ÉCONOMIE dans l'en-tête)."""
    log.info("=== Heat Agent Summary démarré ===")

    entries = await _read_today_jsonl(LOG_PATH)
    if not entries:
        log.warning("Aucune entrée aujourd'hui — résumé annulé")
        return

    # Gate : pas de déviation = journée sans relief -> on ne dépense pas de tokens.
    llm_deviations = [e for e in entries if e.get("decision", {}).get("deviation", "none") != "none"]
    if not llm_deviations:
        log.info(f"PAC inactive toute la journée ({len(entries)} runs, 0 déviation) — résumé annulé")
        return

    journal = _build_journal(entries)
    # Conso PAC du jour (capteur quotidien) ajoutée au journal -> le narrateur peut la citer.
    conso = state.get("sensor.pac_energie_consommee_jour")
    if conso not in (None, "unknown", "unavailable"):
        journal += f"\n\nConso PAC du jour : {conso} kWh"
    # Météo RÉELLE locale (Météo-France commune) -> ancre le récit, évite l'hallucination.
    weather_ctx = await _build_weather_context()
    if weather_ctx:
        journal += f"\n\n=== MÉTÉO RÉELLE (source Météo-France) ===\n{weather_ctx}"
    log.info(f"Journal : {len(entries)} runs, {len(llm_deviations)} déviations, {len(journal)} chars")

    try:
        summary, model_used = await _call_summary(journal)
    except Exception as e:
        log.error(f"Erreur résumé ({PROVIDER}) : {e}")
        return

    # En mode comparaison, on trace le modèle en fin de message (court) pour pouvoir juger.
    if PROVIDER == "alternate":
        short = "Mistral" if "mistral" in model_used else "Gemini"
        summary += f"\n\n— via {short}"
    log.info(f"Résumé généré ({model_used}) — envoi notification")

    # Notification — service.call dynamique : suit NOTIFY_TARGET (un seul point à éditer).
    # Telegram (notify.maison_maison_chris) n'accepte pas le paramètre `data` mobile_app.
    service.call(
        "notify", NOTIFY_TARGET.split(".", 1)[1],
        message=summary,
        title="🏠 Heat Agent — Bilan du " + date.today().strftime("%d/%m"),
    )
    # Notification persistante HA (visible dans l'UI cloche)
    persistent_notification.create(
        title="🏠 Heat Agent — Bilan du " + date.today().strftime("%d/%m"),
        message=summary,
        notification_id="heat_agent_summary",
    )
    log.info("Notification envoyée")
