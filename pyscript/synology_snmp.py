"""
synology_snmp.py — Sonde le NAS Synology RS812+ (192.168.1.15) en SNMP v2c et
publie des entités HA que l'intégration Synology DSM ne remonte pas :
ventilos, température châssis, réseau bond0/LACP, UPS EATON, statut RAID
(dont DataScrubbing), statut/temp par disque, présence unité d'extension RX410.

Client SNMP v2c en Python pur (encode/decode BER) — aucune dépendance externe,
net-snmp/pysnmp absents du conteneur HA. Tourne toutes les 60 s.

Publie via MQTT discovery → toutes les entités sont rattachées au device
"RackStation (SNMP)" (regroupées, survit aux reboots). Publication via le
service mqtt.publish de HA (pas de credentials broker à gérer).

Pièges gérés :
  - valeurs UPS = Opaque-Float SNMP (tag 0x44, forme 9f 78 LEN <float32 BE>)
  - sockets bloquantes confinées dans @pyscript_executor (sinon bloque la loop HA)
  - state.set() ne rattache pas à un device → on passe par MQTT discovery
"""

import socket
import struct

HOST = "192.168.1.15"
COMM = "public"
PORT = 161
TIMEOUT = 3
POLL = "period(now, 60sec)"

# ── Mappings de codes (Synology MIB) ────────────────────────────────────────
OKNOK = {1: "Normal", 2: "Failed"}
DISK_STATUS = {
    1: "Normal", 2: "Initialized", 3: "NotInitialized",
    4: "SystemPartitionFailed", 5: "Crashed", 6: "Disconnected",
}
RAID_STATUS = {
    1: "Normal", 2: "Repairing", 3: "Migrating", 4: "Expanding",
    5: "Deleting", 6: "Creating", 7: "RaidSyncing", 8: "RaidParityChecking",
    9: "RaidAssembling", 10: "Canceling", 11: "Degrade", 12: "Crashed",
    13: "DataScrubbing", 14: "RaidDeploying",
}
UPGRADE = {1: "MAJ dispo", 2: "À jour", 3: "Connexion…",
           4: "Hors ligne", 5: "Autre"}

# OID système (synology 6574.1)
OID_SYS_STATUS = "1.3.6.1.4.1.6574.1.1.0"
OID_TEMP = "1.3.6.1.4.1.6574.1.2.0"
OID_POWER = "1.3.6.1.4.1.6574.1.3.0"
OID_FAN_SYS = "1.3.6.1.4.1.6574.1.4.1.0"
OID_FAN_CPU = "1.3.6.1.4.1.6574.1.4.2.0"
OID_UPGRADE = "1.3.6.1.4.1.6574.1.5.4.0"

# OID UPS (synology 6574.4) — numériques = Opaque-Float
OID_UPS_MODEL = "1.3.6.1.4.1.6574.4.1.1.0"
OID_UPS_STATE = "1.3.6.1.4.1.6574.4.2.1.0"
OID_UPS_BATT = "1.3.6.1.4.1.6574.4.3.1.1.0"
OID_UPS_RUNTIME = "1.3.6.1.4.1.6574.4.3.6.1.0"
OID_UPS_LOAD = "1.3.6.1.4.1.6574.4.2.12.1.0"

# Walk bases
BASE_DISK = "1.3.6.1.4.1.6574.2.1.1"      # .2 id .3 model .5 status .6 temp
BASE_RAID = "1.3.6.1.4.1.6574.3.1.1"      # .2 name .3 status
BASE_IF = "1.3.6.1.2.1.2.2.1"             # .2 desc .10 inOct .16 outOct


# ════════════════════════════════════════════════════════════════════════════
# Tout le SNMP (sockets bloquantes) vit dans l'executor.
# ════════════════════════════════════════════════════════════════════════════
@pyscript_executor
def _probe():
    # ---- encodeurs BER ----
    def enc_len(n):
        if n < 0x80:
            return bytes([n])
        b = []
        while n:
            b.insert(0, n & 0xFF); n >>= 8
        return bytes([0x80 | len(b)]) + bytes(b)

    def tlv(tag, val):
        return bytes([tag]) + enc_len(len(val)) + val

    def enc_int(n):
        if n == 0:
            return tlv(0x02, b"\x00")
        b = []; neg = n < 0; v = n
        while v not in (0, -1):
            b.insert(0, v & 0xFF); v >>= 8
        if not neg and b and b[0] & 0x80:
            b.insert(0, 0)
        return tlv(0x02, bytes(b))

    def enc_oid(oid):
        p = [int(x) for x in oid.strip(".").split(".")]
        body = [40 * p[0] + p[1]]
        for x in p[2:]:
            if x < 0x80:
                body.append(x)
            else:
                st = []
                while x:
                    st.insert(0, x & 0x7F); x >>= 7
                for i in range(len(st) - 1):
                    st[i] |= 0x80
                body.extend(st)
        return tlv(0x06, bytes(body))

    def build(oid, rid, pdu_tag):
        vb = tlv(0x30, enc_oid(oid) + tlv(0x05, b""))
        vbs = tlv(0x30, vb)
        pdu = tlv(pdu_tag, enc_int(rid) + enc_int(0) + enc_int(0) + vbs)
        return tlv(0x30, enc_int(1) + tlv(0x04, COMM.encode()) + pdu)

    # ---- décodeurs BER ----
    def plen(d, i):
        l = d[i]; i += 1
        if l & 0x80:
            n = l & 0x7F; l = int.from_bytes(d[i:i + n], "big"); i += n
        return l, i

    def ptlv(d, i):
        t = d[i]; i += 1; ln, i = plen(d, i)
        return t, d[i:i + ln], i + ln

    def dec_oid(v):
        p = [v[0] // 40, v[0] % 40]; n = 0
        for b in v[1:]:
            n = (n << 7) | (b & 0x7F)
            if not b & 0x80:
                p.append(n); n = 0
        return ".".join(map(str, p))

    def dec_opaque(v):  # Opaque-Float : 9f 78 LEN <float32 BE>
        if len(v) >= 6 and v[0] == 0x9F and v[1] == 0x78:
            return round(struct.unpack(">f", v[-4:])[0], 2)
        if len(v) == 4:
            return round(struct.unpack(">f", v)[0], 2)
        return None

    def dec_val(t, v):
        if t == 0x02:
            return int.from_bytes(v, "big", signed=(v[0] & 0x80) != 0) if v else 0
        if t == 0x04:
            try:
                return v.decode("utf-8", "replace")
            except Exception:
                return v.hex()
        if t == 0x06:
            return dec_oid(v)
        if t == 0x44:
            return dec_opaque(v)
        if t in (0x41, 0x42, 0x43, 0x46):
            return int.from_bytes(v, "big")
        if t == 0x05:
            return None
        if t in (0x80, 0x81, 0x82):
            return None
        return v.hex()

    def _req(oid, pdu_tag, rid=1):
        pkt = build(oid, rid, pdu_tag)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(TIMEOUT)
        try:
            s.sendto(pkt, (HOST, PORT))
            data, _ = s.recvfrom(8192)
        finally:
            s.close()
        _, seq, _ = ptlv(data, 0); i = 0
        _, _, i = ptlv(seq, i); _, _, i = ptlv(seq, i)
        _, pdu, _ = ptlv(seq, i); j = 0
        for _ in range(3):
            _, _, j = ptlv(pdu, j)
        _, vbs, _ = ptlv(pdu, j)
        _, vb, _ = ptlv(vbs, 0); k = 0
        _, ov, k = ptlv(vb, k); vt, vv, _ = ptlv(vb, k)
        return dec_oid(ov), vt, dec_val(vt, vv)

    def get(oid):
        try:
            return _req(oid, 0xA0)[2]
        except Exception:
            return None

    def walk(base):
        out = []; cur = base; rid = 1
        while True:
            try:
                roid, vt, val = _req(cur, 0xA1, rid)
            except socket.timeout:
                break
            except Exception:
                break
            rid += 1
            if not (roid.startswith(base + ".") or roid == base):
                break
            if vt in (0x80, 0x81, 0x82):
                break
            out.append((roid, val)); cur = roid
            if len(out) > 300:
                break
        return out

    # ── collecte ──
    res = {"ok": False}
    if get("1.3.6.1.2.1.1.5.0") is None:  # sysName : test de vie
        return res
    res["ok"] = True

    def code(oid, table, default="Unknown"):
        v = get(oid)
        return table.get(v, default) if isinstance(v, int) else default

    res["sys_status"] = code(OID_SYS_STATUS, OKNOK)
    res["temp"] = get(OID_TEMP)
    res["power"] = code(OID_POWER, OKNOK)
    res["fan_sys"] = code(OID_FAN_SYS, OKNOK)
    res["fan_cpu"] = code(OID_FAN_CPU, OKNOK)
    res["upgrade"] = code(OID_UPGRADE, UPGRADE)

    # UPS
    res["ups_model"] = get(OID_UPS_MODEL)
    res["ups_state"] = get(OID_UPS_STATE)
    res["ups_batt"] = get(OID_UPS_BATT)
    res["ups_runtime"] = get(OID_UPS_RUNTIME)
    res["ups_load"] = get(OID_UPS_LOAD)

    # Disques
    disks = {}
    for col, nm in {2: "id", 3: "model", 5: "status", 6: "temp"}.items():
        for oid, val in walk(f"{BASE_DISK}.{col}"):
            idx = oid.split(".")[-1]
            disks.setdefault(idx, {})[nm] = val
    res["disks"] = []
    rx410 = 0
    for idx in sorted(disks, key=lambda x: int(x)):
        d = disks[idx]
        st = d.get("status")
        st = DISK_STATUS.get(st, st) if isinstance(st, int) else st
        did = d.get("id") or f"Disk{idx}"
        res["disks"].append({"id": did, "model": d.get("model"),
                             "status": st, "temp": d.get("temp")})
        if "RX410" in str(did):
            rx410 += 1
    res["rx410_disks"] = rx410

    # RAID / volumes (statut = scrubbing/degrade/etc.)
    raids = {}
    for col, nm in {2: "name", 3: "status"}.items():
        for oid, val in walk(f"{BASE_RAID}.{col}"):
            idx = oid.split(".")[-1]
            raids.setdefault(idx, {})[nm] = val
    res["raids"] = []
    for idx in sorted(raids, key=lambda x: int(x)):
        r = raids[idx]
        st = r.get("status")
        st = RAID_STATUS.get(st, st) if isinstance(st, int) else st
        res["raids"].append({"name": r.get("name") or f"RAID{idx}", "status": st})

    # Réseau : trafic cumulé + état lien (ifOperStatus .8 : 1=up) par interface
    ifd = {}
    for col, nm in {2: "desc", 8: "oper", 10: "in", 16: "out"}.items():
        for oid, val in walk(f"{BASE_IF}.{col}"):
            idx = oid.split(".")[-1]
            ifd.setdefault(idx, {})[nm] = val
    res["net"] = {}
    for d in ifd.values():
        desc = str(d.get("desc", ""))
        if desc in ("eth0", "eth1", "bond0"):
            res["net"][desc] = {"in": d.get("in"), "out": d.get("out"),
                                "up": d.get("oper") == 1}

    return res


def _gb(x):
    try:
        return round(int(x) / (1024 ** 3), 2)
    except Exception:
        return None


# ════════════════════════════════════════════════════════════════════════════
# Publication MQTT discovery → device "RackStation (SNMP)"
# ════════════════════════════════════════════════════════════════════════════
DISCO_PREFIX = "homeassistant"          # préfixe discovery par défaut
TOPIC_BASE = "synology_snmp"            # base des topics d'état
NODE = "rackstation_snmp"               # node_id discovery (unique)

# Device commun à toutes les entités : c'est lui qui les regroupe.
DEVICE = {
    "identifiers": ["synology_snmp_CCLDN00760"],
    "name": "RackStation (SNMP)",
    "manufacturer": "Synology",
    "model": "RS812+",
    "serial_number": "CCLDN00760",
    "sw_version": "DSM 6.2-25556",
}

# Catalogue des entités : key → config discovery (sans topics ni device, ajoutés auto).
# comp = sensor | binary_sensor
SENSORS = {
    # santé sonde
    "reachable":     {"comp": "binary_sensor", "name": "SNMP joignable", "dc": "connectivity"},
    # thermique / hardware
    "temperature":   {"comp": "sensor", "name": "Température châssis", "unit": "°C", "dc": "temperature"},
    "system_status": {"comp": "sensor", "name": "Statut système", "icon": "mdi:nas"},
    "power_status":  {"comp": "sensor", "name": "Alimentation", "icon": "mdi:power-plug"},
    "fan_system":    {"comp": "sensor", "name": "Ventilo système", "icon": "mdi:fan"},
    "fan_cpu":       {"comp": "sensor", "name": "Ventilo CPU", "icon": "mdi:fan"},
    "upgrade":       {"comp": "sensor", "name": "MAJ DSM", "icon": "mdi:update"},
    "fan_system_fault": {"comp": "binary_sensor", "name": "Ventilo système défaut", "dc": "problem"},
    "fan_cpu_fault": {"comp": "binary_sensor", "name": "Ventilo CPU défaut", "dc": "problem"},
    "power_fault":   {"comp": "binary_sensor", "name": "Alimentation défaut", "dc": "problem"},
    # UPS
    "ups_state":     {"comp": "sensor", "name": "Onduleur état", "icon": "mdi:power-plug-battery"},
    "ups_battery":   {"comp": "sensor", "name": "Onduleur batterie", "unit": "%", "dc": "battery"},
    "ups_load":      {"comp": "sensor", "name": "Onduleur charge sortie", "unit": "%", "icon": "mdi:gauge"},
    "ups_runtime":   {"comp": "sensor", "name": "Onduleur autonomie", "unit": "min", "dc": "duration"},
    "ups_on_battery": {"comp": "binary_sensor", "name": "Onduleur sur batterie", "dc": "power"},
    # RAID
    "raid_status":   {"comp": "sensor", "name": "Statut RAID", "icon": "mdi:harddisk",
                      "attr": True},
    "raid_fault":    {"comp": "binary_sensor", "name": "RAID défaut", "dc": "problem"},
    # disques
    "disks_max_temp": {"comp": "sensor", "name": "Température disque max", "unit": "°C",
                       "dc": "temperature", "attr": True},
    "disk_fault":    {"comp": "binary_sensor", "name": "Disque défaut", "dc": "problem",
                      "attr": True},
    # RX410
    "rx410_disks":   {"comp": "sensor", "name": "RX410 disques vus", "icon": "mdi:server-network"},
    "rx410_present": {"comp": "binary_sensor", "name": "RX410 connectée", "dc": "connectivity"},
    # réseau (créés dynamiquement ci-dessous)
}
for _if in ("eth0", "eth1", "bond0"):
    SENSORS[f"net_{_if}_in"] = {"comp": "sensor", "name": f"{_if} reçu", "unit": "GB", "icon": "mdi:download"}
    SENSORS[f"net_{_if}_out"] = {"comp": "sensor", "name": f"{_if} envoyé", "unit": "GB", "icon": "mdi:upload"}
# état lien up/down (pour les dots de statut de la card v2)
for _if in ("eth0", "eth1"):
    SENSORS[f"{_if}_connecte"] = {"comp": "binary_sensor", "name": f"{_if} connecté",
                                  "dc": "connectivity"}

_discovery_done = False
_was_reachable = True   # état réseau précédent : ne logge que les transitions


def _state_topic(key):
    return f"{TOPIC_BASE}/{key}/state"


def _attr_topic(key):
    return f"{TOPIC_BASE}/{key}/attr"


def _publish_discovery():
    """Publie (retained) la config discovery de chaque entité → crée le device."""
    import json as _json
    for key, cfg in SENSORS.items():
        comp = cfg["comp"]
        disco_topic = f"{DISCO_PREFIX}/{comp}/{NODE}/{key}/config"
        payload = {
            "name": cfg["name"],
            "unique_id": f"synology_snmp_{key}",
            "object_id": f"synology_{key}",
            "state_topic": _state_topic(key),
            "availability_topic": _state_topic("reachable"),
            "payload_available": "on",
            "payload_not_available": "off",
            "device": DEVICE,
        }
        if comp == "binary_sensor":
            payload["payload_on"] = "on"
            payload["payload_off"] = "off"
        if cfg.get("unit"):
            payload["unit_of_measurement"] = cfg["unit"]
        if cfg.get("dc"):
            payload["device_class"] = cfg["dc"]
        if cfg.get("icon"):
            payload["icon"] = cfg["icon"]
        if cfg.get("attr"):
            payload["json_attributes_topic"] = _attr_topic(key)
        # l'entité "reachable" n'a pas d'availability sur elle-même
        if key == "reachable":
            payload.pop("availability_topic", None)
            payload.pop("payload_available", None)
            payload.pop("payload_not_available", None)
        mqtt.publish(topic=disco_topic, payload=_json.dumps(payload), retain=True, qos=0)
    log.info(f"[synology_snmp] discovery publiée ({len(SENSORS)} entités) → device RackStation (SNMP)")


def _pub(key, value, attrs=None):
    import json as _json
    mqtt.publish(topic=_state_topic(key), payload=str(value), retain=True, qos=0)
    if attrs is not None:
        mqtt.publish(topic=_attr_topic(key), payload=_json.dumps(attrs), retain=True, qos=0)


@event_trigger("homeassistant_start")
@service
def synology_snmp_discovery(**kwargs):
    """(Re)publie la config discovery. Appelée au démarrage HA + au reload pyscript."""
    global _discovery_done
    _publish_discovery()
    _discovery_done = True


@time_trigger(POLL)
@service
def synology_snmp_poll(**kwargs):
    global _discovery_done, _was_reachable
    if not _discovery_done:
        _publish_discovery()
        _discovery_done = True

    r = _probe()

    if not r or not r.get("ok"):
        _pub("reachable", "off")
        if _was_reachable:   # on ne logge qu'au passage online → offline
            log.warning("[synology_snmp] NAS injoignable en SNMP")
            _was_reachable = False
        return

    if not _was_reachable:   # retour en ligne : trace unique
        log.info("[synology_snmp] NAS de nouveau joignable en SNMP")
        _was_reachable = True
    _pub("reachable", "on")

    # ── Thermique / hardware ──
    if r.get("temp") is not None:
        _pub("temperature", r["temp"])
    _pub("system_status", r["sys_status"])
    _pub("power_status", r["power"])
    _pub("fan_system", r["fan_sys"])
    _pub("fan_cpu", r["fan_cpu"])
    _pub("upgrade", r["upgrade"])

    def prob(val):
        return "off" if val == "Normal" else "on"
    _pub("fan_system_fault", prob(r["fan_sys"]))
    _pub("fan_cpu_fault", prob(r["fan_cpu"]))
    _pub("power_fault", prob(r["power"]))

    # ── UPS EATON ──
    if r.get("ups_state") is not None:
        on_battery = str(r["ups_state"]).startswith("OB")
        _pub("ups_state", r["ups_state"])
        _pub("ups_on_battery", "on" if on_battery else "off")
    if isinstance(r.get("ups_batt"), (int, float)):
        _pub("ups_battery", r["ups_batt"])
    if isinstance(r.get("ups_load"), (int, float)):
        _pub("ups_load", r["ups_load"])
    if isinstance(r.get("ups_runtime"), (int, float)):
        _pub("ups_runtime", round(r["ups_runtime"] / 60, 1))

    # ── RAID / volumes (dont scrubbing) ──
    try:
        raids = r.get("raids", [])
        if raids:
            statuses = []
            parts = []
            fault = False
            for rd in raids:
                st = rd.get("status", "Unknown")
                nm = rd.get("name", "?")
                statuses.append(st)
                parts.append(f"{nm}={st}")
                if st in ("Degrade", "Crashed"):
                    fault = True
            non_normal = [s for s in statuses if s != "Normal"]
            display = non_normal[0] if non_normal else "Normal"
            _pub("raid_status", display, {"volumes": ", ".join(parts)})
            _pub("raid_fault", "on" if fault else "off")
    except Exception as e:
        log.error(f"[synology_snmp] RAID block fail: {e!r}  raids={r.get('raids')!r}")

    # ── Disques ──
    try:
        disks = r.get("disks", [])
        if disks:
            temps = []
            bad = []
            parts = []
            for d in disks:
                t = d.get("temp")
                if isinstance(t, int) and t >= 0:
                    temps.append(t)
                if d.get("status") != "Normal":
                    bad.append(d["id"])
                parts.append(f"{d['id']}: {d['status']} {t}°C")
            _pub("disks_max_temp", max(temps) if temps else "unknown",
                 {"disks": " | ".join(parts)})
            _pub("disk_fault", "on" if bad else "off",
                 {"disques_en_defaut": ", ".join(bad) if bad else "aucun"})
    except Exception as e:
        log.error(f"[synology_snmp] DISK block fail: {e!r}")

    # ── RX410 ──
    try:
        rx = r.get("rx410_disks", 0)
        _pub("rx410_disks", rx)
        _pub("rx410_present", "on" if rx > 0 else "off")
    except Exception as e:
        log.error(f"[synology_snmp] RX410 block fail: {e!r}")

    # ── Réseau ──
    try:
        net = r.get("net", {})
        for iface in net:
            d = net[iface]
            gi = _gb(d.get("in"))
            go = _gb(d.get("out"))
            if gi is not None:
                _pub(f"net_{iface}_in", gi)
            if go is not None:
                _pub(f"net_{iface}_out", go)
            if iface in ("eth0", "eth1"):
                _pub(f"{iface}_connecte", "on" if d.get("up") else "off")
    except Exception as e:
        log.error(f"[synology_snmp] NET block fail: {e!r}")

    log.info(f"[synology_snmp] poll terminé — temp={r.get('temp')}°C "
             f"UPS={r.get('ups_state')} batt={r.get('ups_batt')}%")
