# Audit du nœud cyber .51 (Dell 5430) + T-Pot — pour Sonnet

> Audit réalisé le **2026-07-27** par Fable, sur l'infra migrée Raspberry Pi 3B+ → **Dell Latitude 5430 Rugged** (Ubuntu 26.04 LTS, IP héritée `192.168.1.51`, compte `chris`).
> But : sécuriser, nettoyer, optimiser. **Sonnet applique les correctifs ci-dessous.** Chaque item est priorisé et actionnable.
> Accès nœud : `python C:\Users\chris\.claude\skills\node51-ssh-sudo\node51.py <cmd>` (skill `node51-ssh-sudo`). Sudo = mdp au coffre (⚠️ voir P0-5).
>
> **DÉJÀ CORRIGÉ le 27/07 par Fable pendant cet audit** (ne pas refaire) :
> - **Notifs Telegram du killswitch réparées** (`~/livebox-monitor/killswitch.py` sur .53). Cause : `rule_id` (`webui_Android ADB`) injecté non échappé dans un message `parse_mode=Markdown` → l'underscore ouvrait une entité italique → Telegram 400 « can't parse entities » → **toute alerte de coupure/réarmement était perdue depuis ≥ le 25/07**. Fix : `_tg_send()` retente en texte brut si le Markdown est rejeté (l'alerte part toujours) + `_md_escape()` ajouté sur `rule_id`/`service` dans le message de réarmement. Compilé, service `cyber-killswitch` redémarré, testé en réel (message piégé → fallback → reçu). Backup `killswitch.py.bak-tgfix-<ts>`.

---

## 0. État des lieux (ce qui tourne, factuel)

**Hôte .51 (br0 = 192.168.1.51, WiFi wlp113s0 = 192.168.1.80 en filet) :**

| Service | État | Rôle |
|---|---|---|
| `pihole-FTL` | active | DNS primaire LAN (53/80/443) |
| `grafana-server` (:3000) | active | Dashboard cyber |
| `loki` (:3100/:9096 loopback) | active | Logs cyber |
| `promtail` (:9080 loopback) | active | Ingestion → Loki |
| `cyber-monitor` | active/enabled | Stats honeypot → HA MQTT |
| `pi-monitor` | active/enabled | Métriques nœud → HA MQTT |
| `suricata-monitor` | active/enabled | IDS host → HA MQTT |
| `suricata` | active | IDS de l'hôte |
| `zipbomb` (:8080) | active/enabled | Piège web zipbomb/tarpit |
| `tpot-sync` | active/enabled | Miroir logs VM .52 → `/var/log/tpot-mirror` |
| `blocklist-update.timer` | active/enabled | Blocklist AbuseIPDB → nftables (6h, ~9985 IP) |
| `fail2ban` | active/enabled | Jails `cowrie-honeypot`, `fakesvc-honeypot` |
| `glances` (:61208, 0.0.0.0) | active | ⛔ NE PAS TOUCHER (voulu, intégration HA) |
| `docker` | active | Ne porte plus que `cowrie` (Exited) — voir P1-3 |

**VM T-Pot (libvirt/KVM, dom `tpot`, autostart ON) :**
- 3 vCPU / 5 Go RAM / disque qcow2 **13 Go** (`/var/lib/libvirt/images/tpot.qcow2`)
- Réseau **bridge br0** → IP LAN propre **192.168.1.52** (vraie IP source visible des attaquants ✅)
- Reçoit du vrai trafic WAN (ex. Cowrie voit 116.99.x.x / Vietnam en direct)
- T-Pot expose : Cowrie SSH (22 tarpit / 2222 / 2223), Telnet 23, ADB 5555, Redis 6379, Docker 2375, Elastic 9200, SMB 445, web 8080

**Exposition WAN (port-forwarding Livebox → 192.168.1.52) :** SSH 22, SSH 2222, Telnet 23, ADB 5555, Redis 6379, Docker 2375→3306, Elastic 9200, SMB 445, web 8080 → **9 ports ouverts sur Internet vers la VM**. C'est **voulu** (honeypot) mais impose que l'isolation VM soit béton (voir P0-1).

---

## 🔴 P0 — Sécurité, à traiter en priorité

### P0-1. Isolation de la VM honeypot : vérifier qu'elle ne peut PAS pivoter vers le LAN
La VM T-Pot est **bridgée directement sur le LAN** (br0) avec 9 ports exposés au WAN. Un attaquant qui s'évade d'un conteneur T-Pot est **de plain-pied sur 192.168.1.0/24** (NAS .15, HA .60, Livebox .1…). Le bridge est du L2 pur : `net.bridge.bridge-nf-call-iptables` **n'existe pas** (`br_netfilter` non chargé), donc **aucune règle nftables du host ne filtre le trafic VM↔LAN**. Le `fw_custom input` protège l'hôte, pas la VM ni le reste du LAN.

**Action Sonnet :**
- Ajouter une règle de segmentation : soit charger `br_netfilter` + une chaîne `bridge`/`forward` qui **interdit .52 → 192.168.1.0/24** (sauf .51:1883 MQTT et le strict nécessaire), tout en laissant .52 → WAN. Soit passer la VM sur un **réseau libvirt isolé (NAT dédié)** avec DNAT explicite des 9 ports, ce qui redonne le contrôle nftables sur le forward.
- Objectif : depuis .52, `ping 192.168.1.15/.60/.1` doit **échouer**, mais le honeypot reste joignable du WAN.
- ⚠️ Ne pas casser le flux MQTT `cyber-monitor` (host) ni le forced-command SSH `admin@.51 → chris@.52:64295` (sync logs) : ces deux-là doivent rester autorisés.

### P0-2. Clés API en clair dans `cyber_monitor.py`
`/home/admin/cyber_monitor.py` contient **en clair** :
- `ABUSEIPDB_KEY = 0f295710...` (ligne ~constantes)
- `VT_KEY = 18465c61...` (VirusTotal)

Viole la doctrine du coffre (mémoire `vault-secrets` : les secrets vivent dans Vaultwarden). Les deux clés sont **déjà en mémoire** (`reference_abuseipdb_key`, `reference_virustotal_key`) donc récupérables.

**Action Sonnet :**
- Sortir les 2 clés du `.py` → lecture depuis un fichier `~/.config/cyber/secrets.env` (chmod 600, hors monde) chargé au démarrage, ou variables d'environnement injectées par le `systemd` unit (`EnvironmentFile=`).
- Vérifier qu'aucune autre clé/mdp MQTT (`USER/PASSWORD = "mqtt"/"mqtt"` est présent aussi) ne traîne en dur ailleurs.
- **Ces clés sont potentiellement à régénérer** si le fichier a été committé/exposé — à confirmer avec Chris.

### P0-3. Blocklist AbuseIPDB ne s'applique qu'à l'INPUT de l'hôte, pas à la VM
`fw_custom input` fait `ip saddr @blocklist drop` — donc les ~9985 IP hostiles sont bloquées **pour l'hôte** mais **atteignent quand même la VM T-Pot** (bridge non filtré, cf P0-1). Pour un honeypot c'est acceptable (on VEUT les attaquants), mais **incohérent** : le killswitch/blocklist perd son sens si le forward n'est pas couvert. À décider avec P0-1 : soit on documente que la VM est volontairement exposée (blocklist = protection hôte uniquement), soit on étend le drop au forward.

**Action Sonnet :** trancher avec Chris, puis rendre l'intention explicite dans un commentaire du script `blocklist_update.sh` et dans la chaîne nftables.

### P0-4. Killswitch NAT : **il EXISTE et TOURNE (sur la .53), mais sa DÉTECTION est déconnectée de T-Pot**
> ⚠️ **Correction d'une erreur de la 1ère passe d'audit** : j'avais écrit ici « introuvable / non migré » parce que je n'avais cherché que sur le **.51**. **FAUX.** Le killswitch a toujours vécu sur la **.53** (`~/livebox-monitor/killswitch.py`, service `cyber-killswitch.service` **active + enabled**), jamais perdu. La mémoire `project_cyber_killswitch_meteo_hermes` le disait explicitement (« killswitch.py, nouveau, **.53** »). Vérifié le 27/07 : il a coupé Docker/ADB/Elastic **le jour même** et réarmé à 45 min. **Le mécanisme de coupure fonctionne.**

**Ce qui marche (vérifié) :**
- Service `cyber-killswitch` sur .53, boucle 60s, importe la classe `Livebox` de `livebox_monitor.py` (auth sysbus partagée).
- Coupe par **ID de règle** (`webui_Docker API`, `webui_Android ADB`, `webui_Elastic`, `webui_8080`) → **insensible au changement de destination .51→.52** : couper l'ID marche même si le forward pointe maintenant vers la VM. ✅
- Notifs Telegram **réparées le 27/07** (voir ci-dessous), coupure + réarmement 45 min OK.

**Les 2 VRAIS trous (soulevés par Chris, ratés par l'audit initial) :**

1. **Détection sur données MORTES.** Le killswitch réagit au sensor `sensor.cyber_station_exploit_actif`, alimenté par `cyber_monitor.py` (.51) via `fakesvc_stats()` qui lit `docker.exploit`/`adb.exploit`/`es.exploit` dans **`/home/admin/fakesvc/hits.json`**. Or **`fakesvc` est désactivé** (remplacé par T-Pot) → ce `hits.json` **ne bouge plus**. Le sensor affiche encore « adb » (vu le 27/07) mais c'est un **résidu figé**, pas une détection T-Pot live. **Conséquence : le killswitch ne réagit plus aux vrais exploits captés par T-Pot.** C'est le trou de fond.
2. **Couverture incomplète des forwards.** `SERVICE_TO_RULE` ne couvre que 4 règles. Depuis la migration, T-Pot expose **en plus** : `webui_SMB` (445), `webui_Redis` (6379), `webui_Secure Shell Server (SSH)` (2222), `webui_Telnet` (23), `webui_SSH Tarpit` (22) — **aucune n'a de killswitch**. Un exploit réel sur SMB/Redis de T-Pot ne coupe rien.
   - ⚠️ Anomalie à vérifier : `webui_Docker API` route **2375 externe → 3306 interne** (port MySQL), pas 2375→2375. Volontaire (T-Pot Dionaea MySQL ?) ou erreur de config Livebox ?

**Action Sonnet (le cœur du chantier « remettre le killswitch pour de vrai ») :**
- **Rebrancher la détection sur T-Pot.** Remplacer la source `fakesvc/hits.json` par les vrais events de la VM : soit lire les alertes **Suricata `eve.json`** (déjà miroir dans `/var/log/tpot-mirror/eve.json`, `severity 1` = exploit), soit les events Cowrie « commande shell exécutée » (post-login, = compromission réelle, pas juste un scan). Mettre à jour `cyber_monitor.py` pour peupler `exploit_attrs` depuis CES sources et publier le sensor `cyber_station_exploit_actif` sur cette base.
- **Étendre `SERVICE_TO_RULE`** aux nouveaux forwards T-Pot (SMB, Redis, SSH 2222, Telnet) avec le bon mapping service→CVE dans `SERVICE_EXPLOIT_INFO`, en gardant hors-scope `webui_syno2` (NAS) et les `upnp_*`.
- **Vérifier/corriger** le mapping `webui_Docker API` 2375→3306.
- Garder l'archi actuelle (killswitch sur .53, coupe par ID) — **ne pas le réécrire sur le .51**, ce serait un doublon inutile.

### P0-5. Mdp sudo du 5430 absent du coffre
Constaté (déjà noté skill `node51-ssh-sudo`) : le mdp sudo `chris` du 5430 n'est **pas dans Vaultwarden** (l'item « Pi .51 - admin » est celui de l'ancien Pi et ne déverrouille pas). Les erreurs `pam_unix(sudo:auth): auth could not identify password for [chris]` dans le journal confirment des échecs sudo.

**Action Sonnet :** ajouter au coffre l'item « Nœud .51 (Dell 5430) - chris (sudo) » et pointer `NODE51_VAULT_ITEM` dessus. (Nécessite Chris pour la valeur.)

---

## 🟠 P1 — Propreté / cohérence

### P1-1. Comptes mélangés `admin` vs `chris`
Héritage du Pi : les pièges et scripts tournent sous **`admin`** (`zipbomb_server.py`, `pi_monitor.py`, `suricata_monitor.py`, `cyber_monitor.py`, `tpot_sync.py`), le desktop/glances/SSH sous **`chris`**. Deux homedirs, deux jeux de clés SSH, `cowrie.json` cherché sous `/home/chris/cowrie` par un script tournant en `admin`. C'est fonctionnel mais fragile et déroutant.

**Action Sonnet (non urgent, à cadrer avec Chris) :** décider d'un compte de service unique pour les pièges (garder `admin` comme user système dédié, OU tout basculer sous `chris`). Au minimum : documenter clairement qui possède quoi. Ne pas casser les `User=` des units systemd en le faisant.

### P1-2. Références « Raspberry Pi » périmées dans le code
`cyber_monitor.py` déclare encore `"model": "Raspberry Pi 3 - Security"` et `"manufacturer": "Chris SecOps"` dans le device MQTT HA. Le matériel est un Dell 5430.

**Action Sonnet :** mettre à jour le bloc `DEVICE` (model = « Dell Latitude 5430 - Security » ou équivalent). ⚠️ Changer `identifiers` casserait le lien HA — **garder `identifiers: ["pi_cyber_station"]`**, ne changer que les libellés d'affichage.

### P1-3. Conteneur Cowrie hôte zombie (Exited)
`docker ps -a` : conteneur `cowrie` en `Exited (0) 2 hours ago` sur l'hôte. Cowrie a migré **dans la VM T-Pot** (172.22.0.2). Le conteneur host ne sert plus mais reste déclaré, et `docker0` est DOWN.

**Action Sonnet :** `docker rm cowrie` (conteneur mort), et si plus aucun conteneur utile sur l'hôte, envisager de désactiver le service `docker` au boot (économie RAM/attack surface) — **à confirmer** qu'aucun autre conteneur host n'est prévu.

### P1-4. Résidus des pièges désactivés
`fakesvc` et `endlessh` sont `disabled`+`inactive` (remplacés par les pièges T-Pot), mais `/home/admin/fakesvc/` existe encore, et `fail2ban` a toujours une jail `fakesvc-honeypot` active qui lit un `hits.json` qui ne bouge plus. Idem `netalertx/` (dir présent) alors que `cyber_monitor.py` référence `NETALERTX_DB`.

**Action Sonnet :** décider pièges hôte vs T-Pot. Si `fakesvc`/`endlessh` sont bien remplacés par T-Pot → supprimer les jails fail2ban mortes, archiver/supprimer les dirs, retirer les `__path__` promtail correspondants pour ne pas garder des sources Loki gelées (piège déjà vécu : source silencieusement à zéro).

### P1-5. Reboot en attente (kernel)
`/var/run/reboot-required` présent (kernel 7.0.0-28 installé par unattended-upgrades). Le nœud tourne sur un kernel potentiellement remplacé.

**Action Sonnet :** planifier un reboot avec Chris (⚠️ coupe DNS Pi-hole primaire — le foyer bascule sur .53 puis 1.1.1.1, cf `reference_dns_redondance_maison`, donc OK mais à faire en connaissance de cause ; vérifier au reboot que la VM T-Pot autostart bien et que le forced-command sync repart).

---

## 🟡 P2 — Optimisation / robustesse

### P2-1. Snapshot / backup de la VM T-Pot
La VM (13 Go qcow2) n'a **aucun snapshot managé** (`Sauvegarde gérée : non`). Si elle est compromise ou corrompue, tout est à refaire (install T-Pot longue). Le seed cloud-init (`tpot-seed.iso`) est encore attaché.

**Action Sonnet :** créer un snapshot libvirt « golden » de la VM propre (avant qu'elle accumule de la crasse d'attaque), OU documenter la procédure de recréation (le honeypot est jetable par nature, mais un golden accélère le rebuild). Détacher le CD seed cloud-init une fois l'install figée.

### P2-2. Croissance du qcow2 et des logs
qcow2 déjà à 13 Go, `eve.json` du miroir T-Pot fait **10 Mo et grossit vite** (Suricata très bavard). Loki ingère cowrie + suricata + zipbomb en continu. Risque de saturation à terme (root = 34G/468G, OK pour l'instant).

**Action Sonnet :** vérifier la rétention Loki (`loki.yaml`) et la rotation des logs T-Pot (logrotate copytruncate mentionné dans le script — confirmer qu'il tourne côté VM). Poser un garde-fou disque (alerte HA si `/` ou `/var/lib/libvirt` > 80%).

### P2-3. `cyber_monitor.py` : robustesse SSH vers la VM
Le monitoring lit Cowrie via `ssh ... chris@.52:64295 cowrie` (forced-command, bien verrouillé ✅). Mais si la VM est down/lente, `ConnectTimeout=8` par cycle de 60s peut bloquer le publish MQTT.

**Action Sonnet :** vérifier que l'échec SSH est bien géré (try/except, publish d'un état « VM injoignable » plutôt que blocage/crash du service). Confirmer le `Restart=on-failure` suffisant.

### P2-4. Quotas API (rappel, déjà en place mais à surveiller)
`cyber_monitor.py` a du cache GreyNoise/VT 7j et des quotas par cycle (VT 3/cycle, GreyNoise 1/cycle). Bien pensé. Juste **vérifier** que le geocache/VT cache (`/home/admin/.cyber_geocache.json`) ne grossit pas sans purge.

---

## ✅ Ce qui est déjà bien (ne pas casser)

- **Forced-command SSH T-Pot** (`admin@.51 → chris@.52:64295`) : whitelist stricte, `help`/`ports`/commande arbitraire = « refuse: commande non autorisee ». Seules les commandes prévues (`cowrie`, etc.) passent. **Excellent.** Ne pas élargir.
- **VM en vraie IP LAN** (.52) via bridge → IP source réelle des attaquants visible (pas masquée par NAT). Voulu et correct pour l'analyse.
- **ufw** DROP input/forward par défaut + `fw_custom` en policy drop avec whitelist ports.
- **Blocklist AbuseIPDB** auto (confiance ≥90, MAJ 6h, ~9985 IP).
- **glances 0.0.0.0:61208** : bind volontaire (intégration HA 230 entités) — ⛔ NE PAS FERMER.
- **DNS redondant** : couper le .51 ne coupe pas le foyer (.53 + 1.1.1.1).
- **Promtail** bien structuré (jobs séparés cowrie/zipbomb/fakesvc/suricata host + suricata_tpot/endlessh VM, labels `host: noeud51` vs `vm52`).

---

## Ordre d'exécution suggéré pour Sonnet

1. **P0-4 killswitch** + **P0-1 isolation VM** (les deux critiques, à cadrer ensemble avec Chris car ils touchent l'archi réseau).
2. **P0-2 clés en clair** (rapide, sortir les secrets du .py).
3. **P0-5 mdp coffre** + **P1-5 reboot** (opérationnel, avec Chris).
4. **P1-2 / P1-3 / P1-4** ménage (libellés, docker zombie, pièges morts).
5. **P2** optimisations (snapshot golden, rétention, robustesse).

> ⚠️ **Rien de destructif sans confirmation de Chris** : suppression de dirs pièges, reboot, changement d'archi réseau, régénération de clés API. Analyse d'abord, applique après feu vert.
