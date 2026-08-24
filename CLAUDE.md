# CLAUDE.md

## What This Is

Home Assistant config directory (HA 2026.5.x, French smart home). No build step — YAML interprété au runtime. Comments/entity names/labels en français.

## AI Behavior

- Concis et direct, YAML prêt à l'emploi, pas d'explication sauf si demandé
- Ne pas inventer d'entités — inspecter les vraies entités via l'API REST avant d'écrire du YAML
- Syntaxe HA stricte, brainstorm avant de coder
- Après toute modif : relire l'état réel via l'API (entité, attribut, log) avant de conclure que ça marche

## Live HA Access (API REST + WebSocket)

Pas de MCP HA côté Claude. Accès via l'API REST/WebSocket :
- URL de base : `http://192.168.1.60:8123` — token Bearer (long-lived) dans les en-têtes
- États / services : `GET /api/states`, `GET /api/states/<entity_id>`, `POST /api/services/<domain>/<service>`
- WebSocket (`ws://192.168.1.60:8123/api/websocket`) pour Lovelace : `lovelace/resources`, `lovelace/resources/update` (bump cache-busting des cards — JAMAIS éditer `.storage` à la main)

## Validation & Reload (via API REST, pas l'UI)

- Config check : `POST /api/config/core/check_config` (ou service `homeassistant.check_config`)
- Reload ciblé (pas de restart) via `POST /api/services/<domain>/reload` : `automation`, `template`, `script`, `scene`, `pyscript`
- Full restart (`homeassistant.restart`) : requis uniquement pour `configuration.yaml`, custom components, intégrations — **demander confirmation avant**. ⚠️ Ne jamais arrêter la VM HA : ça coupe le partage SMB `\\.60\config` (cf. mémoire `feedback_never_stop_ha_vm`)

## Custom Cards

**Référence obligatoire avant toute création/modif de card : skills Claude Code locales `ha-neon-css` (CSS/design system) et `ha-responsive-cards` (méthode JS/perf, checklist de livraison).** `CARDS-METHOD.md` et `CARDS-EDITOR-TEMPLATE.md` ont été rapatriés dans ces skills (2026-08-23) et supprimés du share — invisibles à la découverte automatique des skills, ils faisaient doublon. Chaque règle correspond à un bug prod.

Workflow après chaque modif JS (détail complet dans les skills ci-dessus) :
1. Modifier `www/*.js`, **bumper la version** (format propre à chaque card : `@version`, `const VERSION`, ou bannière commentaire — repérer et suivre, incl. `console.info`)
2. **Vérifier qu'il n'existe pas de `.js.gz` périmé** à côté du `.js` — un `.gz` plus ancien est servi en priorité (Accept-Encoding) et masque le `.js` à jour. Si présent et périmé : supprimer ou régénérer. Cf. mémoire `project_card_gz_trap`.
3. Cache-busting optionnel : `cd /config/www && sh bump-card.sh ma-card.js` (ou `all`). F5 suffit sans `.gz`.
4. F5 dans HA → committer.

Validation syntaxe rapide (sans HA) : `node --check www/ma-card.js`.

## File Architecture

```
configuration.yaml   # entry point + helpers inline (input_number/boolean/light groups)
automations.yaml     # ~30 rules ~1500 lines — ne pas splitter, HA appende ici
templates.yaml       # Jinja2 sensors
sensor.yaml          # REST/integration sensors
scripts.yaml / scenes.yaml
packages/mail.yaml   # SMTP Orange
pyscript/            # Logique avancée (heat agent) — voir § Pyscript
custom_components/   # 13 intégrations custom
www/                 # Custom cards (méthode/éditeur : skills locales ha-neon-css / ha-responsive-cards)
.storage/            # Runtime state JSON — ne jamais éditer manuellement
```

## Key Automation Domains

**Heat pump** : logique principale dans `pyscript/heat_agent.py` — bias déterministe (couche YAML template pour le bias planifié) + jugement LLM (Mistral, scoped anomalies / hold-validate-deviate) + solar soak + shadow/scorer. `automations.yaml` ne porte que les triggers et le legacy bias (~400 lignes, tarifs Linky HEURE PLEINE/CREUSE, schedules TOU, surplus Sunology, helpers `input_number`). Chercher la logique métier dans pyscript d'abord.

**EV charging** (3 automations) : VW ID.3 via `volkswagencarnet`, prefix entités `wvwzzze18sp049976_`. Modes : TOU (HEURE CREUSE) + surplus solaire.

**LED cascading** : cuisine (4 bulbs) + salon (2 bulbs), délais 400ms via `scripts.yaml`.

## Custom Components

| Component | Purpose |
|---|---|
| `sunology` | Solar + battery (TCP socket local) |
| `dreame_mower` | Lawn mower MQTT/cloud |
| `volkswagencarnet` | VW ID.3 charging |
| `llama_conversation` | LLM (Ollama/LlamaCPP/Claude API) |
| `livebox` / `liveboxtvuhd` | Orange Livebox + TV |
| `hacs` | Community store |
| `meross_cloud` | Smart plugs |
| `samsungtv_smart` / `onkyo` | TV + AV receiver |
| `netgear_plus` | GS108T switch (custom patch) |

## Netgear GS108T (custom patch)

IP `192.168.1.56`. Credentials et community SNMP : voir `secrets.yaml` — **ne jamais les hardcoder ni les recopier dans la doc**.
- `py_netgear_plus_local/` — bundle local py-netgear-plus 0.4.7, imports relatifs (`from .`)
- `snmp_client.py` — SNMP v2c stdlib pure socket (pas pysnmp)
- `models.py` : `GS108T` class, `CRYPT_FUNCTION="none"`, pages sous `/base/system/...`
- `fetcher.py` : `elif CRYPT_FUNCTION=="none": self._password_hash = login_password`
- `parsers.py` : HTML scraping port status + SNMP traffic (octets)
- `__init__.py` : inject `_snmp_host`, delta guard `"traffic_rx" not in self._previous_data`
- SNMP OIDs : ifSpeed `.2.2.1.5.X`, ifOperStatus `.2.2.1.8.X`, ifInOctets `.2.2.1.10.X`, ifOutOctets `.2.2.1.16.X`

## Key Template Sensors

| Sensor | Purpose |
|---|---|
| `sensor.surplus_solaire_dispo` | Solar export W |
| `sensor.heat_pump_bias_status` | Bias état lisible |
| `sensor.heat_pump_outdoor_temp_fused` | Fusion 3 capteurs ext (correction biais solaire) |
| `sensor.heat_pump_active_mode` | Mode TOU actif (8 modes) |
| `sensor.afternoon_hc_solar_potential` | kWh forecast fenêtre 14:20–16:20 HC |
| `sensor.solar_forecast_summary` | Excellent/Bon/Modéré/Faible |
| `sensor.weather_forecast_summary` | Blend cloud%/temp/pluie/gel/UV |

Fusion temp : si écart >4°C entre 3 capteurs → min+1°C (mitigue biais sud).

## Important Constraints

- `automations.yaml` géré par HA — chaque automation doit avoir un `id:` unique
- Notification mobile : `notify.mobile_app_pixel_9a` uniquement
- Tariff sensor : `sensor.lixee_current_price` → valeurs exactes `HEURE PLEINE` / `HEURE CREUSE`
- Templates : toujours `| float(0)` / `| int(0)` pour éviter les erreurs sur unavailable
- Ne jamais ouvrir `home-assistant_v2.db` (4.8GB SQLite)

## Pyscript

- `pyscript/modules/` = importable Python. `pyscript/*.py` = scripts exécutés, **non importables**.
- Ne pas nommer un module comme un stdlib Python (`secrets` → utiliser `ha_secrets`)
- Pyscript ne supporte pas les **generator expressions** `(x for x in ...)` → utiliser `[x for x in ...]`
- Import clés API : `from ha_secrets import MISTRAL_KEY` (fichier `pyscript/modules/ha_secrets.py`)
- Reload après modif : service `pyscript.reload`
