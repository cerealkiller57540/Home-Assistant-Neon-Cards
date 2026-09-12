"""Minimal SNMP v2c client using stdlib only (no pysnmp/puresnmp).

Supports GET and GETBULK for integer and counter OIDs.
Sufficient for reading ifTable (1.3.6.1.2.1.2.2.1.*) counters.
"""

import logging
import socket
import struct
import os

_LOGGER = logging.getLogger(__name__)


# ── BER encoding helpers ──────────────────────────────────────────────────────

def _ber_len(n: int) -> bytes:
    if n < 0x80:
        return bytes([n])
    b = n.to_bytes((n.bit_length() + 7) // 8, "big")
    return bytes([0x80 | len(b)]) + b


def _tlv(tag: int, value: bytes) -> bytes:
    return bytes([tag]) + _ber_len(len(value)) + value


def _int_val(n: int) -> bytes:
    if n == 0:
        return _tlv(0x02, b"\x00")
    b = n.to_bytes((n.bit_length() + 8) // 8, "big", signed=True).lstrip(b"\x00") or b"\x00"
    if n > 0 and b[0] & 0x80:
        b = b"\x00" + b
    return _tlv(0x02, b)


def _oid_encode(oid: str) -> bytes:
    parts = [int(x) for x in oid.strip(".").split(".")]
    # first two arcs collapsed: X.Y -> 40*X+Y
    body = bytes([40 * parts[0] + parts[1]])
    for n in parts[2:]:
        if n == 0:
            body += b"\x00"
        else:
            enc = []
            while n:
                enc.append(n & 0x7F)
                n >>= 7
            enc.reverse()
            body += bytes([(b | 0x80) for b in enc[:-1]] + [enc[-1]])
    return _tlv(0x06, body)


def _oid_decode(data: bytes, pos: int) -> tuple[str, int]:
    assert data[pos] == 0x06
    pos += 1
    length, pos = _decode_len(data, pos)
    end = pos + length
    first = data[pos]
    arcs = [first // 40, first % 40]
    pos += 1
    while pos < end:
        n, pos = _decode_base128(data, pos)
        arcs.append(n)
    return ".".join(str(a) for a in arcs), pos


def _decode_len(data: bytes, pos: int) -> tuple[int, int]:
    b = data[pos]
    pos += 1
    if b & 0x80:
        nb = b & 0x7F
        n = int.from_bytes(data[pos:pos + nb], "big")
        pos += nb
        return n, pos
    return b, pos


def _decode_base128(data: bytes, pos: int) -> tuple[int, int]:
    n = 0
    while True:
        b = data[pos]
        pos += 1
        n = (n << 7) | (b & 0x7F)
        if not (b & 0x80):
            break
    return n, pos


def _decode_int(data: bytes, pos: int) -> tuple[int, int]:
    tag = data[pos]
    pos += 1
    length, pos = _decode_len(data, pos)
    raw = data[pos:pos + length]
    pos += length
    if tag in (0x02, 0x41, 0x42, 0x43, 0x47):  # Integer, Counter32, Gauge32, TimeTicks, Counter64
        # treat as unsigned for counters
        return int.from_bytes(raw, "big"), pos
    return 0, pos


# ── SNMP PDU builder / parser ─────────────────────────────────────────────────

def _build_get_request(community: str, oids: list[str], request_id: int = 1) -> bytes:
    varbinds = b"".join(
        _tlv(0x30, _oid_encode(oid) + _tlv(0x05, b""))  # OID + NULL
        for oid in oids
    )
    varbind_list = _tlv(0x30, varbinds)

    pdu = (
        _int_val(request_id)   # request-id
        + _int_val(0)          # error-status
        + _int_val(0)          # error-index
        + varbind_list
    )
    get_pdu = _tlv(0xA0, pdu)  # GetRequest-PDU

    message = (
        _int_val(1)                               # version: v2c = 1
        + _tlv(0x04, community.encode())          # community
        + get_pdu
    )
    return _tlv(0x30, message)


def _build_getbulk_request(
    community: str,
    oids: list[str],
    max_repetitions: int = 10,
    request_id: int = 1,
) -> bytes:
    varbinds = b"".join(
        _tlv(0x30, _oid_encode(oid) + _tlv(0x05, b""))
        for oid in oids
    )
    varbind_list = _tlv(0x30, varbinds)

    pdu = (
        _int_val(request_id)
        + _int_val(0)               # non-repeaters
        + _int_val(max_repetitions) # max-repetitions
        + varbind_list
    )
    bulk_pdu = _tlv(0xA5, pdu)  # GetBulkRequest-PDU

    message = (
        _int_val(1)
        + _tlv(0x04, community.encode())
        + bulk_pdu
    )
    return _tlv(0x30, message)


def _build_set_request(
    community: str, oid: str, value: int, request_id: int = 1
) -> bytes:
    """Build a SetRequest-PDU (0xA3) carrying one INTEGER varbind."""
    varbind = _tlv(0x30, _oid_encode(oid) + _int_val(value))
    varbind_list = _tlv(0x30, varbind)

    pdu = (
        _int_val(request_id)
        + _int_val(0)  # error-status
        + _int_val(0)  # error-index
        + varbind_list
    )
    set_pdu = _tlv(0xA3, pdu)  # SetRequest-PDU

    message = _int_val(1) + _tlv(0x04, community.encode()) + set_pdu
    return _tlv(0x30, message)


def _parse_error_status(data: bytes) -> int | None:
    """Return the error-status of a GetResponse (0 = success)."""
    pos = 0
    if data[pos] != 0x30:
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    for _ in range(2):  # version, community
        pos += 1
        skip, pos = _decode_len(data, pos)
        pos += skip
    if data[pos] != 0xA2:
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    pos += 1  # request-id
    skip, pos = _decode_len(data, pos)
    pos += skip
    if data[pos] != 0x02:  # error-status
        return None
    pos += 1
    elen, pos = _decode_len(data, pos)
    return int.from_bytes(data[pos : pos + elen], "big")


def _parse_response(data: bytes) -> dict[str, int]:
    """Parse a GetResponse PDU, return {oid_str: int_value}."""
    result = {}
    # skip outer SEQUENCE, version, community
    pos = 0
    assert data[pos] == 0x30
    pos += 1
    _, pos = _decode_len(data, pos)
    # version
    assert data[pos] == 0x02
    pos += 1
    vlen, pos = _decode_len(data, pos)
    pos += vlen
    # community
    assert data[pos] == 0x04
    pos += 1
    clen, pos = _decode_len(data, pos)
    pos += clen
    # GetResponse PDU (0xA2)
    assert data[pos] == 0xA2, f"expected 0xA2 got 0x{data[pos]:02x}"
    pos += 1
    _, pos = _decode_len(data, pos)
    # request-id, error-status, error-index
    for _ in range(3):
        assert data[pos] == 0x02
        pos += 1
        l, pos = _decode_len(data, pos)
        pos += l
    # VarBindList
    assert data[pos] == 0x30
    pos += 1
    _, pos = _decode_len(data, pos)
    end = len(data)
    while pos < end:
        if data[pos] != 0x30:
            break
        pos += 1
        _, pos = _decode_len(data, pos)
        oid_str, pos = _oid_decode(data, pos)
        value, pos = _decode_int(data, pos)
        result[oid_str] = value
    return result


def _parse_response_str(data: bytes) -> str | None:
    """Parse a GetResponse PDU and return the first OCTET STRING value.

    _parse_response ne sait lire que des entiers ; sysDescr est une chaine.
    On refait le meme parcours d'entete mais on decode un 0x04 (OCTET STRING).
    """
    pos = 0
    if data[pos] != 0x30:
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    for _ in range(2):  # version, community
        pos += 1
        skip, pos = _decode_len(data, pos)
        pos += skip
    if data[pos] != 0xA2:
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    for _ in range(3):  # request-id, error-status, error-index
        pos += 1
        skip, pos = _decode_len(data, pos)
        pos += skip
    if data[pos] != 0x30:  # VarBindList
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    if data[pos] != 0x30:  # premier varbind
        return None
    pos += 1
    _, pos = _decode_len(data, pos)
    _oid, pos = _oid_decode(data, pos)
    if data[pos] != 0x04:  # OCTET STRING
        return None
    pos += 1
    slen, pos = _decode_len(data, pos)
    return data[pos : pos + slen].decode("utf-8", "replace").strip()


SYS_DESCR = "1.3.6.1.2.1.1.1.0"
SYS_NAME = "1.3.6.1.2.1.1.5.0"


def snmp_get_sysinfo(
    host: str, community: str = "public", timeout: float = 2.0
) -> dict[str, str]:
    """Return {"sys_descr", "sys_name"} read over SNMP (empty dict on failure)."""
    out = {}
    for key, oid in (("sys_descr", SYS_DESCR), ("sys_name", SYS_NAME)):
        pkt = _build_get_request(
            community, [oid], request_id=os.getpid() & 0x7FFFFFFF
        )
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(timeout)
        try:
            sock.sendto(pkt, (host, 161))
            data, _ = sock.recvfrom(4096)
        finally:
            sock.close()
        out[key] = _parse_response_str(data) or ""
    return out


def snmp_get_sysdescr(
    host: str, community: str = "public", timeout: float = 2.0
) -> str | None:
    """Return sysDescr (ex. "GS108Tv2") or None if the switch does not answer."""
    pkt = _build_get_request(
        community, [SYS_DESCR], request_id=os.getpid() & 0x7FFFFFFF
    )
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        data, _ = sock.recvfrom(4096)
    finally:
        sock.close()
    return _parse_response_str(data)


# ── entPhysicalTable (RFC 2737) ───────────────────────────────────────────────
# Mesure sur le GS108Tv2 le 01/09/2026 : l'index .1 est le chassis et porte les
# seules valeurs renseignees. Firmware et numero de serie y sont EXACTEMENT ceux
# que l'ancien chemin HTTP (sysInfo.html) remontait.
#   entPhysicalSoftwareRev.1 = "5.4.2.36"       <- firmware
#   entPhysicalSerialNum.1   = "29S9315A0029F"  <- numero de serie
# En revanche entPhysicalHardwareRev et entPhysicalFirmwareRev sont vides sur
# TOUS les index : le bootloader (B5.1.0.2) n'a pas d'equivalent SNMP.
ENT_PHYSICAL = "1.3.6.1.2.1.47.1.1.1.1"
ENT_SOFTWARE_REV = f"{ENT_PHYSICAL}.10.1"
ENT_SERIAL_NUM = f"{ENT_PHYSICAL}.11.1"

# NETGEAR-INVENTORY-MIB (walk du 01/09/2026 : 4036 objets sous 4526.11).
# Donne le modele EXACT avec sa revision, la ou MODELS ne connait que "GS108T".
NTGR_INVENTORY = "1.3.6.1.4.1.4526.11.1.1.1"
NTGR_MODEL = f"{NTGR_INVENTORY}.1.0"      # "GS108Tv2"
NTGR_DESCR = f"{NTGR_INVENTORY}.3.0"      # "GS108T smartSwitch"
NTGR_HW_REV = f"{NTGR_INVENTORY}.6.0"     # "A"
NTGR_OS = f"{NTGR_INVENTORY}.10.0"        # "ecos-2.0"


def snmp_get_model_name(
    host: str, community: str = "public", timeout: float = 2.0
) -> str | None:
    """Return the exact model name, e.g. "GS108Tv2" (None if unreachable)."""
    pkt = _build_get_request(community, [NTGR_MODEL], request_id=os.getpid() & 0x7FFFFFFF)
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        data, _ = sock.recvfrom(4096)
    except OSError:
        return None
    finally:
        sock.close()
    return _parse_response_str(data) or None


def snmp_get_hardware_info(
    host: str, community: str = "public", timeout: float = 2.0
) -> dict[str, str]:
    """Return {"model", "descr", "hw_rev", "os"} from NETGEAR-INVENTORY-MIB."""
    out: dict[str, str] = {}
    for key, oid in (
        ("model", NTGR_MODEL),
        ("descr", NTGR_DESCR),
        ("hw_rev", NTGR_HW_REV),
        ("os", NTGR_OS),
    ):
        pkt = _build_get_request(community, [oid], request_id=os.getpid() & 0x7FFFFFFF)
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(timeout)
        try:
            sock.sendto(pkt, (host, 161))
            data, _ = sock.recvfrom(4096)
        except OSError:
            continue
        finally:
            sock.close()
        value = _parse_response_str(data)
        if value:
            out[key] = value
    return out


def snmp_get_entity_info(
    host: str, community: str = "public", timeout: float = 2.0
) -> dict[str, str]:
    """Return {"firmware", "serial_number"} from entPhysicalTable.

    Cles absentes si le switch ne repond pas ; valeur "" si l'OID existe mais
    est vide. L'appelant ne cree pas d'entite pour une valeur vide.
    """
    out: dict[str, str] = {}
    for key, oid in (("firmware", ENT_SOFTWARE_REV), ("serial_number", ENT_SERIAL_NUM)):
        pkt = _build_get_request(
            community, [oid], request_id=os.getpid() & 0x7FFFFFFF
        )
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(timeout)
        try:
            sock.sendto(pkt, (host, 161))
            data, _ = sock.recvfrom(4096)
        except OSError:
            continue
        finally:
            sock.close()
        value = _parse_response_str(data)
        if value is not None:
            out[key] = value
    return out


# ── Public API ────────────────────────────────────────────────────────────────

IF_TABLE = "1.3.6.1.2.1.2.2.1"
IF_SPEED        = f"{IF_TABLE}.5"   # ifSpeed (bps)
IF_ADMIN_STATUS = f"{IF_TABLE}.7"   # 1=up 2=down (administratif)
IF_OPER_STATUS  = f"{IF_TABLE}.8"   # 1=up 2=down
IF_IN_OCTETS   = f"{IF_TABLE}.10"  # ifInOctets
IF_OUT_OCTETS  = f"{IF_TABLE}.16"  # ifOutOctets


def snmp_set_port_admin(
    host: str,
    port: int,
    up: bool,
    community: str = "private",
    timeout: float = 2.0,
) -> bool:
    """Set ifAdminStatus on one port. Return True if the switch confirms.

    ⚠️ Couper un port coupe le lien reseau derriere. Sur ce switch le port 3 porte
    le bond du NAS : l'appelant est responsable de la garde, pas cette fonction.
    Le succes est verifie par RELECTURE, pas seulement par l'error-status : un
    firmware de 2010 peut acquitter un set sans l'appliquer.
    """
    oid = f"{IF_ADMIN_STATUS}.{port}"
    want = 1 if up else 2
    pkt = _build_set_request(
        community, oid, want, request_id=os.getpid() & 0x7FFFFFFF
    )
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        data, _ = sock.recvfrom(4096)
    except OSError:
        _LOGGER.warning("[snmp_set_port_admin] pas de reponse de %s", host)
        return False
    finally:
        sock.close()

    err = _parse_error_status(data)
    if err:
        # 2 = noSuchName, 3 = badValue, 4 = readOnly (communaute RO ou objet verrouille)
        _LOGGER.warning(
            "[snmp_set_port_admin] %s port %s refuse : error-status=%s", host, port, err
        )
        return False

    # Relecture : seule preuve que le set a REELLEMENT pris.
    check = _build_get_request(community, [oid], request_id=os.getpid() & 0x7FFFFFFF)
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(check, (host, 161))
        rdata, _ = sock.recvfrom(4096)
    except OSError:
        return False
    finally:
        sock.close()
    got = _parse_response(rdata).get(oid)
    if got != want:
        _LOGGER.warning(
            "[snmp_set_port_admin] %s port %s : relecture=%s attendu=%s",
            host, port, got, want,
        )
        return False
    return True


AGENT_RESET_SYSTEM = "1.3.6.1.4.1.4526.11.1.3.10.0"  # agentSystemGroup.10.0 (ng_switching.my)


def snmp_reboot_switch(
    host: str,
    community: str = "private",
    timeout: float = 2.0,
    confirm_down_timeout: float = 15.0,
    confirm_up_timeout: float = 90.0,
) -> bool:
    """Declenche un reboot via agentResetSystem (NETGEAR-INVENTORY-MIB).

    OID 1.3.6.1.4.1.4526.11.1.3.10.0, INTEGER {enable(1), disable(2)}, read-write.
    Ecrire enable(1) declenche le reset : "Resets the switch." (description MIB).
    Verifie en lecture le 01/09/2026 : repond disable(2) au repos, tag 0x02 reel
    (pas une exception SNMPv2 masquee par _decode_int, cf. memoire du chantier).

    ⚠️ Contrairement a snmp_set_port_admin, aucune relecture immediate ne peut
    confirmer le succes : le switch va cesser de repondre pendant le reboot.
    La preuve ici est comportementale : le switch doit d'abord DEVENIR injoignable
    (preuve qu'un vrai reboot a demarre, pas un acquittement muet sans effet),
    puis redevenir joignable dans une fenetre raisonnable.

    Retourne True seulement si les deux phases sont observees. Ne rien faire
    d'irreversible ici sans autorisation explicite prealable de l'appelant :
    cette fonction EXECUTE le reboot des l'appel, elle ne le simule pas.
    """
    pkt = _build_set_request(
        community, AGENT_RESET_SYSTEM, 1, request_id=os.getpid() & 0x7FFFFFFF
    )
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        data, _ = sock.recvfrom(4096)
    except OSError:
        _LOGGER.warning("[snmp_reboot_switch] pas de reponse de %s au set", host)
        return False
    finally:
        sock.close()

    err = _parse_error_status(data)
    if err:
        _LOGGER.warning(
            "[snmp_reboot_switch] %s refuse le reboot : error-status=%s", host, err
        )
        return False

    # Phase 1 : le switch doit cesser de repondre (preuve qu'un reboot reel a demarre).
    import time

    deadline = time.monotonic() + confirm_down_timeout
    went_down = False
    while time.monotonic() < deadline:
        probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        probe.settimeout(1.0)
        try:
            probe.sendto(
                _build_get_request(community, [SYS_DESCR], request_id=os.getpid() & 0x7FFFFFFF),
                (host, 161),
            )
            probe.recvfrom(4096)
        except OSError:
            went_down = True
            break
        finally:
            probe.close()
    if not went_down:
        _LOGGER.warning(
            "[snmp_reboot_switch] %s repond toujours apres %.0fs : set accepte sans effet ?",
            host, confirm_down_timeout,
        )
        return False

    # Phase 2 : attendre que le switch redevienne joignable.
    deadline = time.monotonic() + confirm_up_timeout
    while time.monotonic() < deadline:
        probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        probe.settimeout(2.0)
        try:
            probe.sendto(
                _build_get_request(community, [SYS_DESCR], request_id=os.getpid() & 0x7FFFFFFF),
                (host, 161),
            )
            probe.recvfrom(4096)
            return True
        except OSError:
            continue
        finally:
            probe.close()
    _LOGGER.warning(
        "[snmp_reboot_switch] %s ne repond plus apres %.0fs : reboot lance mais retour non confirme",
        host, confirm_up_timeout,
    )
    return False


def snmp_get_if_table(
    host: str,
    community: str = "public",
    ports: int = 8,
    timeout: float = 2.0,
) -> dict[int, dict[str, int]]:
    """Return per-port dict with speed_bps, oper_status, in_octets, out_octets.

    Port indices are 1-based (matching switch port numbers).
    """
    oids = []
    for col in (IF_SPEED, IF_ADMIN_STATUS, IF_OPER_STATUS, IF_IN_OCTETS, IF_OUT_OCTETS):
        for p in range(1, ports + 1):
            oids.append(f"{col}.{p}")

    pkt = _build_get_request(community, oids, request_id=os.getpid() & 0x7FFFFFFF)

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        # 40 varbinds (5 colonnes x 8 ports) tiennent largement, mais le GS108T
        # peut repondre jusqu'a sa taille max de PDU : voir large.
        data, _ = sock.recvfrom(16384)
    finally:
        sock.close()

    raw = _parse_response(data)

    result: dict[int, dict[str, int]] = {}
    for p in range(1, ports + 1):
        result[p] = {
            "speed_bps":    raw.get(f"{IF_SPEED}.{p}", 0),
            "admin_status": raw.get(f"{IF_ADMIN_STATUS}.{p}", 2),
            "oper_status":  raw.get(f"{IF_OPER_STATUS}.{p}", 2),
            "in_octets":    raw.get(f"{IF_IN_OCTETS}.{p}", 0),
            "out_octets":   raw.get(f"{IF_OUT_OCTETS}.{p}", 0),
        }
    return result
