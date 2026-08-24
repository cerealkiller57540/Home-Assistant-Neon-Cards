"""Persistent-notification helpers for Samsung TV token problems.

Two of the three authentication paths used by this integration have no native
Home Assistant surface for an invalid credential:

  * the local WebSocket token (PAT) on port 8002, and
  * the IP Control AccessToken (JSON-RPC) on port 1516.

When either token is rejected by the TV, the integration would otherwise loop —
re-requesting a local token re-arms the on-screen "Allow to connect?" prompt, and
IP Control calls keep failing silently. These helpers raise a single, stable,
self-clearing persistent notification per (entry, method) so the user knows
exactly which credential is bad and how to fix it.

SmartThings OAuth is deliberately NOT handled here: it already surfaces through
the Repairs issue registry (see media_player._raise_oauth_issue), which is the
native path and auto-clears on a successful refresh.

persistent_notification does not support translation keys, so the title/message
are localized here based on ``hass.config.language`` (French when it starts with
"fr", English otherwise).

All functions are Home Assistant callbacks and must run on the event loop. The
threaded WebSocket layer (samsungws) reaches them via run_callback_threadsafe
through media_player's loop-side callbacks, never directly.
"""

from __future__ import annotations

from homeassistant.components import persistent_notification
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN

# Token methods that use this maison notification (SmartThings excluded — it
# uses the native Repairs issue registry instead).
METHOD_LOCAL = "local"
METHOD_IP_CONTROL = "ip_control"

_TITLES: dict[str, dict[str, str]] = {
    "en": {
        METHOD_LOCAL: "Samsung TV — local connection not authorized",
        METHOD_IP_CONTROL: "Samsung TV — IP Control token rejected",
    },
    "fr": {
        METHOD_LOCAL: "Téléviseur Samsung — connexion locale non autorisée",
        METHOD_IP_CONTROL: "Téléviseur Samsung — token IP Control rejeté",
    },
}

_MESSAGES: dict[str, dict[str, str]] = {
    "en": {
        METHOD_LOCAL: (
            "The Samsung TV **{device_name}** keeps rejecting the local "
            "WebSocket token, so Home Assistant stopped reconnecting to avoid "
            "repeatedly re-triggering the on-screen authorization prompt.\n\n"
            "To fix it: open **Settings → Devices & services → Samsung TV "
            "Smart → Reconfigure → Authentication**, submit your method, and "
            "accept the authorization prompt **once** on the TV.\n\n"
            "This notification clears automatically once the connection is "
            "authorized again."
        ),
        METHOD_IP_CONTROL: (
            "The IP Control access token for **{device_name}** was rejected by "
            "the TV (unauthorized). IP Control power features (including the "
            "reboot button) are paused until it is re-paired.\n\n"
            "To fix it: open **Settings → Devices & services → Samsung TV "
            "Smart → Reconfigure → IP Control**, check *Pair now* while the TV "
            "is ON and **not** in Art Mode, and accept the prompt on "
            "screen.\n\nThis notification clears automatically once IP Control "
            "works again."
        ),
    },
    "fr": {
        METHOD_LOCAL: (
            "Le téléviseur Samsung **{device_name}** rejette en continu le "
            "token WebSocket local ; Home Assistant a donc cessé de se "
            "reconnecter pour éviter de redéclencher sans cesse l'invite "
            "d'autorisation à l'écran.\n\n"
            "Pour corriger : ouvrez **Paramètres → Appareils et services → "
            "Samsung TV Smart → Reconfigurer → Authentification**, validez "
            "votre méthode, et acceptez l'invite d'autorisation **une fois** "
            "sur le téléviseur.\n\nCette notification disparaît automatiquement "
            "dès que la connexion est de nouveau autorisée."
        ),
        METHOD_IP_CONTROL: (
            "Le token IP Control de **{device_name}** a été rejeté par le "
            "téléviseur (non autorisé). Les fonctions d'alimentation IP "
            "Control (dont le bouton de redémarrage) sont en pause jusqu'au "
            "ré-appairage.\n\n"
            "Pour corriger : ouvrez **Paramètres → Appareils et services → "
            "Samsung TV Smart → Reconfigurer → IP Control**, cochez *Appairer "
            "maintenant* téléviseur ALLUMÉ et **pas** en mode Art, puis "
            "acceptez l'invite à l'écran.\n\nCette notification disparaît "
            "automatiquement dès qu'IP Control refonctionne."
        ),
    },
}


def _lang(hass: HomeAssistant) -> str:
    """Pick the notification language (fr when configured, else en)."""
    language = (hass.config.language or "en").lower()
    return "fr" if language.startswith("fr") else "en"


def _notification_id(entry_id: str, method: str) -> str:
    """Build a stable notification id so re-raising never spams the user."""
    return f"{DOMAIN}_token_{method}_{entry_id}"


@callback
def notify_token_problem(
    hass: HomeAssistant,
    entry_id: str,
    method: str,
    device_name: str,
) -> None:
    """Raise (or refresh) the persistent notification for a bad token."""
    lang = _lang(hass)
    if method not in _MESSAGES[lang]:
        return
    persistent_notification.async_create(
        hass,
        _MESSAGES[lang][method].format(device_name=device_name),
        title=_TITLES[lang][method],
        notification_id=_notification_id(entry_id, method),
    )


@callback
def clear_token_problem(hass: HomeAssistant, entry_id: str, method: str) -> None:
    """Dismiss the persistent notification once the token works again."""
    persistent_notification.async_dismiss(hass, _notification_id(entry_id, method))
