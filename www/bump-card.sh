#!/bin/sh
# bump-card.sh — Bumpe le hacstag d'une card /local/ via WebSocket HA
# Usage : ./bump-card.sh neon-header-card.js
#         ./bump-card.sh all

TARGET="${1:-}"
HA_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYjY4ZThkMjRkZTI0MGE3YTg3NmEwNGQ1MTJhNzZkMSIsImlhdCI6MTc3OTQ4MDgwNSwiZXhwIjoyMDk0ODQwODA1fQ.oMh2-_n412Dcu7kcALFDAVWCWzHHUtCymLZbsfhR7OE"
HA_HOST="172.30.32.1"
HA_PORT="8123"

if [ -z "$TARGET" ]; then
  echo "Usage: $0 <filename.js|all>"
  echo "  ex: $0 neon-header-card.js"
  echo "  ex: $0 all"
  exit 1
fi

python3 << PYEOF
import socket, base64, os, json, struct, time, sys

TARGET  = '$TARGET'
TOKEN   = '$HA_TOKEN'
HOST    = '$HA_HOST'
PORT    = $HA_PORT

def ws_connect(host, port, token):
    key = base64.b64encode(os.urandom(16)).decode()
    req = (
        f"GET /api/websocket HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        f"Sec-WebSocket-Version: 13\r\n"
        f"\r\n"
    )
    s = socket.create_connection((host, port), timeout=10)
    s.sendall(req.encode())
    resp = b''
    while b'\r\n\r\n' not in resp:
        resp += s.recv(4096)
    return s

def ws_recv(s):
    full = b''
    while True:
        hdr = b''
        while len(hdr) < 2: hdr += s.recv(2 - len(hdr))
        fin = (hdr[0] >> 7) & 1
        plen = hdr[1] & 0x7f
        if plen == 126:
            ext = b''
            while len(ext) < 2: ext += s.recv(2 - len(ext))
            plen = struct.unpack('>H', ext)[0]
        elif plen == 127:
            ext = b''
            while len(ext) < 8: ext += s.recv(8 - len(ext))
            plen = struct.unpack('>Q', ext)[0]
        chunk = b''
        while len(chunk) < plen: chunk += s.recv(plen - len(chunk))
        full += chunk
        if fin:
            break
    return json.loads(full.decode())

def ws_send(s, obj):
    data = json.dumps(obj).encode()
    frame = bytes([0x81])
    if len(data) < 126:
        frame += bytes([0x80 | len(data)])
    else:
        frame += bytes([0x80 | 126]) + struct.pack('>H', len(data))
    mask = b'\x00\x00\x00\x00'
    frame += mask
    frame += bytes(b ^ m for b, m in zip(data, mask * (len(data) // 4 + 1)))
    s.sendall(frame)

try:
    s = ws_connect(HOST, PORT, TOKEN)
    ws_recv(s)  # auth_required
    ws_send(s, {'type': 'auth', 'access_token': TOKEN})
    auth = ws_recv(s)
    if auth.get('type') != 'auth_ok':
        print('Erreur: auth échouée —', auth.get('message', '?'))
        sys.exit(1)

    ws_send(s, {'id': 1, 'type': 'lovelace/resources'})
    resp = ws_recv(s)
    resources = resp.get('result', [])

    bumped = 0
    msg_id = 2
    new_tag = str(int(time.time() * 1000))

    for r in resources:
        url = r.get('url', '')
        if not url.startswith('/local/'):
            continue
        filename = url.split('/local/')[1].split('?')[0]
        if TARGET != 'all' and filename != TARGET:
            continue

        new_url = '/local/' + filename + '?hacstag=' + new_tag
        ws_send(s, {
            'id': msg_id,
            'type': 'lovelace/resources/update',
            'resource_id': r['id'],
            'url': new_url,
            'res_type': r['type'],
        })
        result = ws_recv(s)
        if result.get('success'):
            print('OK  ' + filename)
            print('    ' + url)
            print('  → ' + new_url)
            bumped += 1
        else:
            print('ERR ' + filename + ': ' + str(result.get('error', '?')))
        msg_id += 1

    s.close()

    if bumped == 0:
        if TARGET == 'all':
            print('Aucune ressource /local/ trouvée')
        else:
            print('Card non trouvée : ' + TARGET)
        sys.exit(1)

    print('')
    print(str(bumped) + ' ressource(s) mise(s) à jour ✓')

except Exception as e:
    print('Erreur WebSocket:', e)
    sys.exit(1)
PYEOF
