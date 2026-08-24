# Archive des configs retirées

> Cimetière de ce qu'on supprime de la config HA, au cas où il faudrait restaurer.
> Chaque entrée : date, raison, et le bloc exact retiré.

---

## 2026-06-05 — Ancienne intégration liveboxtvuhd (media_player YAML)

**Raison** : remplacée par le fork moderne `liveboxtv_ng` (config_flow + UPnP volume/mute + EPG dynamique + multi-box). Bloc retiré de configuration.yaml :

```yaml
media_player:
- platform: liveboxtvuhd
  name: Livebox UHD Salon
  host: 192.168.1.30
  port: 8080
  scan_interval: 30
  country: france
```

Le dossier `custom_components/liveboxtvuhd/` est laissé en place (inactif sans cette conf) — peut être supprimé manuellement si besoin.

---

## 2026-06-05 — Doublon sensor `energie_abonnement_edf` (templates.yaml)

**Raison** : deux sensors template avaient le même `unique_id: energie_abonnement_edf` → HA ignorait le second (erreur log `Platform template does not generate unique IDs`). Gardé la version **auto** (calcul jours×1Wh). Retiré la version **manuelle** (lecture `input_number.compteur_abonnement_edf`) ci-dessous.

```yaml
  - name: "Energie abonnement EDF"
    unique_id: energie_abonnement_edf
    unit_of_measurement: "Wh"
    device_class: energy
    state_class: total_increasing
    icon: mdi:battery-plus
    availability: >
      {{ has_value('input_number.compteur_abonnement_edf') }}
    state: >
      {{ states('input_number.compteur_abonnement_edf') | float }}
```

Note : l'`input_number.compteur_abonnement_edf` existe peut-être encore (helper) — non supprimé, juste le sensor qui le lisait. La version gardée (auto) :
```yaml
  - name: "Energie Abonnement EDF"
    unique_id: energie_abonnement_edf
    state: >
      {% set start = strptime('2026-02-18', '%Y-%m-%d') %}
      {% set jours = ((now().date() - start.date()).days) %}
      {{ [jours, 0] | max }}
```

---

## 2026-06-05 — Caméra MJPEG YAML (configuration.yaml) — SUPPRIMÉE (doublon)

**Raison** : `camera: - platform: mjpeg` déprécié (erreur log). Chris avait déjà recréé la webcam via l'UI → c'était un doublon. Bloc retiré :

```yaml
camera:
  - platform: mjpeg
    name: Webcam Buanderie
    mjpeg_url: http://192.168.1.53:8090
    verify_ssl: false
```
