# Crédits & inspirations

Cette intégration **Orange Livebox TV UHD** (refonte moderne : config_flow + DataUpdateCoordinator
+ EPG dynamique + couche UPnP) s'inspire et reprend des éléments de plusieurs projets antérieurs.
Merci à leurs auteurs.

## Source principale
- **[AkA57/liveboxtvuhd](https://github.com/AkA57/liveboxtvuhd)** — l'intégration custom d'origine
  (platform YAML, media_player + remote). On en a repris :
  - l'API locale `remoteControl` du décodeur (`http://<ip>:8080/remoteControl/cmd?operation=...`),
  - les **codes touches** de la télécommande (`KEYS` dans `const.py`),
  - l'URL de l'**EPG Orange** woopic (`epg.py`) et le mapping des chaînes (`channels_fallback.py`).

## Autres projets de référence (décodeur TV Orange)
- **[Rapace29/DecodeurTVUHD](https://github.com/Rapace29/DecodeurTVUHD)** — pilotage du décodeur TV UHD.
- Projets historiques « liveboxplaytv » de la communauté Home Assistant.

## À ne pas confondre
- **[Cyr-ius/hass-livebox-component](https://github.com/Cyr-ius/hass-livebox-component)** concerne la
  **Livebox routeur** (réseau, WiFi, devices), PAS le décodeur TV. Projet distinct.

## Ce que cette refonte apporte en propre
- **config_flow** (setup par l'UI) + **découverte SSDP** multi-décodeurs → fini le YAML, et plus de
  perte de l'intégration si HA redémarre avec le décodeur en veille (cause du fork).
- **DataUpdateCoordinator** async (vs requests synchrone).
- **Liste des chaînes dynamique** depuis l'API EPG Orange (vs liste figée dans le code).
- **Couche UPnP** (MediaRenderer `:42300`) : volume/mute réels (RenderingControl) + transport (AVTransport).

Décodeur cible validé : modèle **WHD94** (SoftAtHome), firmware UPnP 1.7.19.
