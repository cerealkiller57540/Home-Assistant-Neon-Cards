"""
Integration Watchdog — Reloade les intégrations avec entités unavailable après démarrage HA.
Déclenché 3 min après homeassistant_start, puis toutes les 15 min pendant 1h.
Ignore les entités naturellement unavailable (offline, non connectées).
"""

# Domaines d'entités à surveiller (exclure les domaines toujours offline/volatile)
WATCH_DOMAINS = {
    "media_player", "lawn_mower", "climate", "sensor", "binary_sensor",
    "switch", "light", "select", "number", "button", "cover",
}

# Entités à ignorer (offline normale, TV off, etc.)
IGNORE_ENTITIES = {
    "media_player.livebox_salon",          # TV off = unavailable normal
    "media_player.samsung_55_oled_55oled", # doublon unavailable structurel
}

# Domaines HA qui n'ont pas de config entry reloadable
IGNORE_DOMAINS_INTEGRATION = {
    "homeassistant", "group", "template", "input_number", "input_boolean",
    "input_text", "input_datetime", "input_select", "automation", "script",
    "scene", "persistent_notification", "sun", "moon",
}

MAX_RETRIES   = 2
RETRY_DELAY_S = 45
WATCH_PASSES  = 4
PASS_DELAY_S  = 900  # 15 min


@pyscript_executor
def _sleep(seconds):
    import time
    time.sleep(seconds)


@pyscript_executor
def _get_all_unavailable():
    """Retourne les entités unavailable groupées par intégration (domain de l'entity_id)."""
    import re
    bad = {}
    all_states = state.names()
    for eid in all_states:
        domain = eid.split(".")[0]
        if domain not in WATCH_DOMAINS:
            continue
        if eid in IGNORE_ENTITIES:
            continue
        s = state.get(eid)
        if s in ("unavailable", "unknown"):
            # Intégration = préfixe du custom_component si dispo, sinon domain entité
            bad.setdefault(domain, []).append(eid)
    return bad


async def _reload_domain(domain):
    try:
        homeassistant.reload_config_entry(domain=domain)
        return True
    except Exception as e:
        log.warning(f"watchdog: reload {domain} exception: {e}")
        return False


async def _check_pass():
    bad = await _get_all_unavailable()
    if not bad:
        log.info("watchdog: toutes les entités sont OK")
        return

    for domain, entities in bad.items():
        if domain in IGNORE_DOMAINS_INTEGRATION:
            continue
        log.warning(f"watchdog: {len(entities)} entité(s) unavailable dans '{domain}': {entities[:5]}")

        for attempt in range(1, MAX_RETRIES + 1):
            await _reload_domain(domain)
            await _sleep(RETRY_DELAY_S)

            still_bad = [e for e in entities if state.get(e) in ("unavailable", "unknown")]
            if not still_bad:
                log.info(f"watchdog: '{domain}' OK après {attempt} reload(s)")
                break
            log.warning(f"watchdog: '{domain}' — {len(still_bad)} encore unavailable (tentative {attempt}/{MAX_RETRIES})")
        else:
            log.error(f"watchdog: '{domain}' toujours mort après {MAX_RETRIES} tentatives")
            persistent_notification.create(
                title=f"⚠️ Watchdog — {domain} indisponible",
                message=f"{len(entities)} entité(s) non récupérées après {MAX_RETRIES} reloads :\n" + "\n".join(entities[:10]),
                notification_id=f"watchdog_{domain}",
            )


@service
@event_trigger("homeassistant_start")
async def integration_watchdog(**kwargs):
    log.info("watchdog: démarré — attente 3 min avant première passe")
    await _sleep(180)

    for pass_num in range(1, WATCH_PASSES + 1):
        log.info(f"watchdog: passe {pass_num}/{WATCH_PASSES}")
        await _check_pass()
        if pass_num < WATCH_PASSES:
            await _sleep(PASS_DELAY_S)

    log.info("watchdog: surveillance terminée (~51 min après démarrage)")
