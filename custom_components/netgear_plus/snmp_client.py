"""Minimal SNMP v2c client using stdlib only (no pysnmp/puresnmp).

Supports GET and GETBULK for integer and counter OIDs.
Sufficient for reading ifTable (1.3.6.1.2.1.2.2.1.*) counters.
"""

import socket
import struct
import os


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


# ── Public API ────────────────────────────────────────────────────────────────

IF_TABLE = "1.3.6.1.2.1.2.2.1"
IF_SPEED       = f"{IF_TABLE}.5"   # ifSpeed (bps)
IF_OPER_STATUS = f"{IF_TABLE}.8"   # 1=up 2=down
IF_IN_OCTETS   = f"{IF_TABLE}.10"  # ifInOctets
IF_OUT_OCTETS  = f"{IF_TABLE}.16"  # ifOutOctets


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
    for col in (IF_SPEED, IF_OPER_STATUS, IF_IN_OCTETS, IF_OUT_OCTETS):
        for p in range(1, ports + 1):
            oids.append(f"{col}.{p}")

    pkt = _build_get_request(community, oids, request_id=os.getpid() & 0x7FFFFFFF)

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(pkt, (host, 161))
        data, _ = sock.recvfrom(4096)
    finally:
        sock.close()

    raw = _parse_response(data)

    result: dict[int, dict[str, int]] = {}
    for p in range(1, ports + 1):
        result[p] = {
            "speed_bps":    raw.get(f"{IF_SPEED}.{p}", 0),
            "oper_status":  raw.get(f"{IF_OPER_STATUS}.{p}", 2),
            "in_octets":    raw.get(f"{IF_IN_OCTETS}.{p}", 0),
            "out_octets":   raw.get(f"{IF_OUT_OCTETS}.{p}", 0),
        }
    return result
