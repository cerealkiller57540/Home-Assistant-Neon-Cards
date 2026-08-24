"""Constants for the Livebox component."""

DOMAIN = "livebox_pro"
COORDINATOR = "coordinator"
UNSUB_LISTENER = "unsubscribe_listener"
LIVEBOX_API = "api"
PLATFORMS = ["sensor", "binary_sensor", "switch", "select", "button", "device_tracker", "calendar"]

# Human-readable fallback name (domain stays livebox_pro).
TEMPLATE_SENSOR = "Livebox"

DEFAULT_USERNAME = "admin"
DEFAULT_HOST = "192.168.1.1"
DEFAULT_PORT = 80

CALLID = "callId"
CONF_USE_TLS = "use_tls"
CONF_VERIFY_TLS = "verify_tls"
CONF_LAN_TRACKING = "lan_tracking"
CONF_WIFI_TRACKING = "wifi_tracking"
DEFAULT_LAN_TRACKING = False
DEFAULT_WIFI_TRACKING = True

CONF_TRACKING_TIMEOUT = "timeout_tracking"
DEFAULT_TRACKING_TIMEOUT = 300

CONF_DISPLAY_DEVICES = "device_tracker_mode"
DEFAULT_DISPLAY_DEVICES = "Active"

# --- WiFi 6 repeater support -------------------------------------------------
# The household's real WiFi traffic goes through an Orange WiFi 6 repeater with
# an ETHERNET backhaul: on the box side everything shows up on ETH4, never on
# the box vaps, so the per-SSID box rates are structurally near-0. The repeater
# exposes its OWN sysbus API (same admin password as the box) — that's where the
# real débit / totals / stations live. We open a 2nd sysbus connection to it.
#
# Auto-discovery: the box lists the repeater in Devices.get with
# DeviceType == "repeteurwifi6" and its IPAddress. REPEATER_HOSTS is the static
# fallback if discovery ever fails.
REPEATER_DEVICE_TYPE = "repeteurwifi6"
REPEATER_HOSTS = ["192.168.1.47"]
# The 5 repeater interfaces, exactly as Livebox Monitor lists them in its
# NET_INTF_WR6 table (Livebox 6 repeater). LM applies SwapStats=True on ALL of
# them (interface Rx/Tx is the opposite of the user's up/down view), which we
# mirror in coordinator._rep_rate(swap=True). Key = API intf, value = LM label.
REPEATER_INTFS = {
    "bridge": "LAN",
    "eth0": "Ethernet 1",
    "eth1": "Ethernet 2",
    "vap2g0priv": "Wifi 2.4GHz",
    "vap5g0priv": "Wifi 5GHz",
}
# Uplink interface to the box (the RJ45 backhaul). Used as the "headline" débit.
# eth0 vs eth1 is being confirmed empirically against the box-side counters.
REPEATER_BACKHAUL_INTF = "eth0"
# Private radio vaps on the repeater. NOTE: NO trailing 0 (vap5g0priv, not
# vap5g0priv0 like the box) — this box family names them differently.
REPEATER_VAPS = {
    "2.4GHz": "vap2g0priv",
    "5GHz": "vap5g0priv",
}

UPLOAD_ICON = "mdi:upload-network"
DOWNLOAD_ICON = "mdi:download-network"
MISSED_ICON = "mdi:phone-alert"
RESTART_ICON = "mdi:restart-alert"
RING_ICON = "mdi:phone-classic"
GUESTWIFI_ICON = "mdi:wifi-lock-open"
DEVICE_WANACCESS_ICON = "mdi:wan"
RA_ICON = "mdi:remote-desktop"
DDNS_ICON = "mdi:dns"
PHONE_ICON = "mdi:card-account-phone-outline"
CLEARCALLS_ICON = "mdi:close-circle-multiple-outline"
