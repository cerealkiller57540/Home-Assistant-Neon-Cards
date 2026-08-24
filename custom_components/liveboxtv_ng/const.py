"""Constantes de l'intégration Livebox TV UHD (NG)."""
from __future__ import annotations

from datetime import timedelta

DOMAIN = "liveboxtv_ng"

# Configuration
CONF_HOST = "host"
CONF_PORT = "port"
CONF_NAME = "name"
CONF_COUNTRY = "country"
CONF_UPNP_PORT = "upnp_port"

DEFAULT_PORT = 8080
DEFAULT_UPNP_PORT = 42300
DEFAULT_NAME = "Livebox TV UHD"
DEFAULT_COUNTRY = "france"
COUNTRIES = ["france", "poland", "caraibe"]

# Polling
SCAN_INTERVAL = timedelta(seconds=10)
HTTP_TIMEOUT = 5

# API remoteControl (port 8080)
OPERATION_INFORMATION = "10"
OPERATION_CHANNEL_CHANGE = "09"
OPERATION_KEYPRESS = "01"

# Standby / état
STANDBY_ON = "0"   # activeStandbyState == "0" -> allumé
STANDBY_OFF = "1"

# UPnP (MediaRenderer sur :42300) — confirmé sur WHD94 SoftAtHome
UPNP_AVTRANSPORT = "urn:schemas-upnp-org:service:AVTransport:1"
UPNP_RENDERING = "urn:schemas-upnp-org:service:RenderingControl:1"

# SSDP : type de service annoncé par le décodeur Orange (port 8080)
SSDP_ST = "urn:schemas-orange-com:service:X_OrangeSTBRemoteControl:3"
SSDP_MANUFACTURER = "SoftAtHome"

# Codes touches télécommande — repris de AkA57/liveboxtvuhd
# https://github.com/AkA57/liveboxtvuhd (cf CREDITS.md)
KEYS = {
    "POWER": 116,
    "0": 512, "1": 513, "2": 514, "3": 515, "4": 516,
    "5": 517, "6": 518, "7": 519, "8": 520, "9": 521,
    "CH+": 402, "CHANNEL_UP": 402,
    "CH-": 403, "CHANNEL_DOWN": 403,
    "VOL+": 115, "VOLUME_UP": 115,
    "VOL-": 114, "VOLUME_DOWN": 114,
    "MUTE": 113,
    "UP": 103, "DPAD_UP": 103,
    "DOWN": 108, "DPAD_DOWN": 108,
    "LEFT": 105, "DPAD_LEFT": 105,
    "RIGHT": 106, "DPAD_RIGHT": 106,
    "OK": 352, "DPAD_CENTER": 352,
    "BACK": 158,
    "MENU": 139,
    "PLAY/PAUSE": 164, "MEDIA_PLAY_PAUSE": 164,
    "FBWD": 168, "MEDIA_REWIND": 168,
    "FFWD": 159, "MEDIA_FAST_FORWARD": 159,
    "REC": 167, "MEDIA_RECORD": 167,
    "VOD": 393,
    "GUIDE": 365,
}
