import paho.mqtt.client as mqtt, datetime, json, sys
LOG = sys.argv[1]
def ts():
    return datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=2))).strftime("%d/%m %H:%M:%S.%f")[:-3]
def w(line):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n"); f.flush()
def on_connect(c, u, f, rc, props=None):
    w(f"{ts()} [CONNECT] rc={rc}")
    for t in ("zigbee2mqtt/Clim Chambre/#", "zigbee2mqtt/bridge/state",
              "zigbee2mqtt/bridge/logging", "homeassistant/climate/#"):
        c.subscribe(t, 0)
def on_message(c, u, msg):
    p = msg.payload.decode("utf-8", "replace")
    t = msg.topic
    # bridge/logging : ne garder QUE ce qui parle de la clim
    if t == "zigbee2mqtt/bridge/logging":
        if "Clim Chambre" not in p: return
        try: p = json.loads(p).get("message", p)
        except Exception: pass
        w(f"{ts()} [LOG] {p[:500]}"); return
    r = " RETAIN" if msg.retain else ""
    if t == "zigbee2mqtt/Clim Chambre":
        try:
            d = json.loads(p)
            p = json.dumps({k: d[k] for k in ("system_mode","fan_mode","fan_state",
                            "occupied_cooling_setpoint","local_temperature","last_seen") if k in d})
        except Exception: pass
    w(f"{ts()} [{t}]{r} {p[:500]}")
c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
c.username_pw_set("mqtt", "mqtt")
c.on_connect, c.on_message = on_connect, on_message
c.connect("192.168.1.60", 1883, 60)
w(f"{ts()} [START] ecoute filtree Clim Chambre (log_level=info)")
c.loop_forever()
