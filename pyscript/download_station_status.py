"""
download_station_status.py — État binaire (basique) de Download Station sur le
NAS Synology RS812+ (192.168.1.15), publié dans HA via MQTT discovery.

But concret de Chris : pouvoir répondre d'un coup d'œil à « est-ce que je peux
éteindre le NAS sans rien casser ? » et « y a-t-il une erreur ? ».

3 binary_sensors :
  - download_station_erreur : ON si ≥1 tâche en status "error" (le point rouge)
  - download_station_actif   : ON si ≥1 tâche télécharge OU upload POUR DE VRAI
                               (débit >0). Le seeding à 0 ko/s ne compte pas →
                               c'est CE capteur qu'on regarde avant un arrêt.
  - download_station_seed    : ON si ≥1 tâche en seeding (rappel « ça seede »,
                               même à 0 ko/s — n'empêche pas l'arrêt).

Architecture (copiée sur synology_snmp.py) :
  - l'I/O réseau bloquante (login + list API DSM) vit dans @pyscript_executor,
    sinon ça bloque la boucle HA.
  - publication via MQTT discovery → device "DownloadStation (NAS)" qui regroupe
    les entités et survit aux reboots.
  - poll toutes les 60 s ; discovery (re)publiée au démarrage HA et au reload.

API DSM utilisée : SYNO.API.Auth (login) + SYNO.DownloadStation.Task
(list&additional=transfer). Identifiants dans le module ha_secrets.
"""

import json

from ha_secrets import DS_HOST, DS_USER, DS_PASS

BASE = f"http://{DS_HOST}:5000/webapi"
SESSION = "DownloadStation"
TIMEOUT = 8
POLL = "period(now, 60sec)"


# ════════════════════════════════════════════════════════════════════════════
# I/O réseau (bloquante) confinée dans l'executor.
# Renvoie un dict {ok, erreur, actif, seed, nb} ; ok=False si NAS injoignable.
# ════════════════════════════════════════════════════════════════════════════
@pyscript_executor
def _probe():
    import urllib.request
    import urllib.parse
    import http.cookiejar

    def _get(url):
        req = urllib.request.Request(url)
        with opener.open(req, timeout=TIMEOUT) as r:
            return json.loads(r.read().decode("utf-8", "replace"))

    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

    try:
        # 1) login → cookie de session
        login_url = (
            f"{BASE}/auth.cgi?api=SYNO.API.Auth&version=3&method=login"
            f"&account={urllib.parse.quote(DS_USER)}"
            f"&passwd={urllib.parse.quote(DS_PASS)}"
            f"&session={SESSION}&format=cookie"
        )
        lr = _get(login_url)
        if not lr.get("success"):
            return {"ok": False, "stage": "login", "err": lr.get("error")}

        # 2) liste des tâches avec le détail transfer (débits)
        list_url = (
            f"{BASE}/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task"
            f"&version=1&method=list&additional=transfer"
        )
        data = _get(list_url)
        if not data.get("success"):
            return {"ok": False, "stage": "list", "err": data.get("error")}

        tasks = data.get("data", {}).get("tasks", [])
        erreur = False
        actif = False
        seed = False
        for t in tasks:
            st = t.get("status")
            if st == "error":
                erreur = True
            if st == "seeding":
                seed = True
            tr = t.get("additional", {}).get("transfer", {}) or {}
            try:
                dn = int(tr.get("speed_download", 0) or 0)
                up = int(tr.get("speed_upload", 0) or 0)
            except (TypeError, ValueError):
                dn = up = 0
            if dn > 0 or up > 0:
                actif = True

        # 3) logout (best-effort)
        try:
            _get(f"{BASE}/auth.cgi?api=SYNO.API.Auth&version=1"
                 f"&method=logout&session={SESSION}")
        except Exception:
            pass

        return {"ok": True, "erreur": erreur, "actif": actif,
                "seed": seed, "nb": len(tasks)}
    except Exception as e:
        return {"ok": False, "stage": "exc", "err": str(e)}


# ════════════════════════════════════════════════════════════════════════════
# Publication MQTT discovery → device "DownloadStation (NAS)"
# ════════════════════════════════════════════════════════════════════════════
DISCO_PREFIX = "homeassistant"
TOPIC_BASE = "download_station"
NODE = "download_station"

DEVICE = {
    "identifiers": ["download_station_rs812"],
    "name": "DownloadStation (NAS)",
    "manufacturer": "Synology",
    "model": "RS812+",
    "via_device": "synology_snmp_CCLDN00760",
}

# clé : (component, name, device_class, icon)
SENSORS = {
    "reachable": {"comp": "binary_sensor", "name": "DS joignable", "dc": "connectivity"},
    "erreur":    {"comp": "binary_sensor", "name": "DS erreur", "dc": "problem",
                  "icon": "mdi:alert-circle"},
    "actif":     {"comp": "binary_sensor", "name": "DS actif (DL/upload)", "dc": "running",
                  "icon": "mdi:transfer"},
    "seed":      {"comp": "binary_sensor", "name": "DS en seed", "dc": "running",
                  "icon": "mdi:seed"},
    "nb_taches": {"comp": "sensor", "name": "DS nombre de tâches", "icon": "mdi:format-list-numbered"},
}

_discovery_done = False
_was_reachable = True   # état réseau précédent : ne logge que les transitions


def _state_topic(key):
    return f"{TOPIC_BASE}/{key}/state"


def _publish_discovery():
    for key, cfg in SENSORS.items():
        comp = cfg["comp"]
        disco_topic = f"{DISCO_PREFIX}/{comp}/{NODE}/{key}/config"
        payload = {
            "name": cfg["name"],
            "unique_id": f"download_station_{key}",
            "object_id": f"download_station_{key}",
            "state_topic": _state_topic(key),
            "availability_topic": _state_topic("reachable"),
            "payload_available": "on",
            "payload_not_available": "off",
            "device": DEVICE,
        }
        if comp == "binary_sensor":
            payload["payload_on"] = "on"
            payload["payload_off"] = "off"
        if cfg.get("dc"):
            payload["device_class"] = cfg["dc"]
        if cfg.get("icon"):
            payload["icon"] = cfg["icon"]
        if key == "reachable":
            payload.pop("availability_topic", None)
            payload.pop("payload_available", None)
            payload.pop("payload_not_available", None)
        mqtt.publish(topic=disco_topic, payload=json.dumps(payload), retain=True, qos=0)
    log.info(f"[download_station] discovery publiée ({len(SENSORS)} entités) "
             f"→ device DownloadStation (NAS)")


def _pub(key, value):
    mqtt.publish(topic=_state_topic(key), payload=str(value), retain=True, qos=0)


@event_trigger("homeassistant_start")
@service
def download_station_discovery(**kwargs):
    """(Re)publie la config discovery. Au démarrage HA + au reload pyscript."""
    global _discovery_done
    _publish_discovery()
    _discovery_done = True


@time_trigger(POLL)
@service
def download_station_poll(**kwargs):
    global _discovery_done, _was_reachable
    if not _discovery_done:
        _publish_discovery()
        _discovery_done = True

    r = _probe()

    if not r or not r.get("ok"):
        _pub("reachable", "off")
        if _was_reachable:   # on ne logge qu'au passage online → offline
            log.warning(f"[download_station] DS injoignable : "
                        f"{r.get('stage') if r else '?'} / {r.get('err') if r else '?'}")
            _was_reachable = False
        return

    if not _was_reachable:   # retour en ligne : trace unique
        log.info("[download_station] DS de nouveau joignable")
        _was_reachable = True

    _pub("reachable", "on")
    _pub("erreur", "on" if r["erreur"] else "off")
    _pub("actif", "on" if r["actif"] else "off")
    _pub("seed", "on" if r["seed"] else "off")
    _pub("nb_taches", r["nb"])
