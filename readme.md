# 🌟 Home Assistant Neon Cards

A collection of custom Lovelace cards for [Home Assistant](https://www.home-assistant.io/) with a **Neo Tokyo / cyberpunk neon aesthetic**. Glowing effects, SVG animations, vibrant colors, and full theme inheritance.

[![hacs][hacs-badge]][hacs-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 📸 See [Screenshots.md](Screenshots.md) for visual previews.

---

## ✨ Cards Included

### ⚡ Energy & Battery

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🔋 Neon Battery Card | `neon-battery-card.js` | v3.0.1 | EV battery gauge with HC/Solar/Charge controls and side info panels |
| 🏭 Storey Battery Card | `storey-battery-card.js` | v10.0 | Isometric 3D battery for Sunology/modular storage systems |
| ☀️ Neon Solar Production Card | `neon-solar-production-card.js` | — | Real-time solar panel production monitor |
| 📊 Neon Dual Gauge Card | `neon-dual-gauge-card.js` | v2.0.0 | Dual concentric LED ring gauges with cyberpunk glow and theme inheritance |

### 🌡️ Climate & Temperature

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🌡️ Neon Thermo Card | `neon-thermo-card.js` | v1.4.0 | Temperature & humidity with neon styling |
| 🌡️🌡️ Neon Dual Thermo Card | `neon-dual-thermo-card.js` | v2.0.0 | Two temperature sensors side by side |
| ❄️ Neon Climate Card | `neon-climate-card.js` | v1.2.27 | Full climate control (heat/cool/off) with Neo Tokyo UV palette, wind stream animations |
| 🔥 Heat Pump Card | `heat-pump-card.js` | — | PAC/heat pump card (Ecodan Neo Tokyo edition) with UI editor |
| 📈 Heat Monitor Card | `heat-monitor-card.js` | v1.17 | CRT-style heat pump monitoring with scrolling notes |

### 💡 Lighting & Switches

| Card | File | Version | Description |
|------|------|---------|-------------|
| 💡 Neon Compact Light Card | `neon-compact-light-card.js` | v2.0.0 | Compact light toggle with cyberpunk flicker, Zigbee/WiFi adaptive timing |
| 🔌 Neon Switch Card | `neon-switch-card.js` | v1.6 | Network switch port monitor with Neo Tokyo palette |

### 🏠 Dashboard & Layout

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🏷️ Neon Header Card | `neon-header-card.js` | v1.4.2 | Stylish neon section header |
| 🏷️ Neon Header Card v2 | `neon-header-card-v2.js` | v2.3 | Advanced header with title/subtitle, glow, gradient, scanlines, flicker, glitch |
| 📋 Neon Entities Card | `neon-entities-card.js` | v1.2.1 | Multi-entity card (switch, sensor, cover, climate, number, dividers) |

### 🖥️ Network & NAS

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🖥️ Neon NAS Card | `neon-nas-card.js` | v1.9 | Synology NAS monitoring (RS + RX410) with LED bay status |

### 🚗 Vehicles

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🚗 VW Car Card | `vw-car-card.js` | v0.4.1 | VW ID.4 card with door/window status, battery, solar charge threshold |
| 🚗 ID.3 Car Card | `id3-car-card.js` | v1.0.0 | VW ID.3 card using CarConnectivity MQTT entities |
| 🤖 Mova Mower Card | `mova-mower-card.js` | v12.765 | Robot mower card with map, room selection, cleaning modes |

### 🎵 Media & Entertainment

| Card | File | Version | Description |
|------|------|---------|-------------|
| 🎵 Onkyo Card | `onkyo-card.js` | — | AV receiver control with input selection |
| 🔔 Sonos Alarm Card | `sonos-alarm-card.js` | v1.0.0 | Glassmorphism Sonos alarm manager (Neo Tokyo UV) |
| 🕐 Nixie Clock Card | `nixie-clock-card.js` | — | Retro nixie tube clock with configurable colors |

---

## 🎨 Themes

| Theme | File | Description |
|-------|------|-------------|
| 🌙 Neo Tokyo v3 | `themes/neo-tokyo-v3.yaml` | Main Neo Tokyo dark theme with full neon palette |
| 🌙 Neon Night Joi HDR | `themes/neon-night-joi-hdr.yaml` | HDR-style neon dark theme |
| 🕶️ Netrunner 2 | `themes/netrunner2.yaml` | Cyberpunk netrunner variant |

### Installing themes

1. Copy theme files from `themes/` into your `config/themes/` directory.
2. In `configuration.yaml`:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Restart Home Assistant → **Profile → Theme** → select your theme.

---

## 📦 Installation

### Via HACS (recommended)

1. Open **HACS** → **Frontend** → **⋮** → **Custom repositories**
2. Add: `https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards` (type: **Lovelace**)
3. Search for **Neon Cards** → **Install**
4. Reload your browser.

### Manual

1. Download the `.js` files and copy them into `config/www/`.
2. **Settings → Dashboards → Resources** → add each file as `module`:
   ```
   /local/neon-battery-card.js
   /local/neon-thermo-card.js
   ...
   ```
3. Reload your browser.

---

## 🔧 Quick Config Examples

### 🔋 Neon Battery Card
```yaml
type: custom:neon-battery-card
entity: sensor.battery_level
charging_entity: binary_sensor.is_charging
power_entity: sensor.charge_power_w
name: "EV Battery"
kwh_capacity: 77
show_kwh: true
```

### 🌡️ Neon Thermo Card
```yaml
type: custom:neon-thermo-card
entity: sensor.living_room_temperature
name: Living Room
```

### 🌡️🌡️ Neon Dual Thermo Card
```yaml
type: custom:neon-dual-thermo-card
entity_1: sensor.indoor_temperature
entity_2: sensor.outdoor_temperature
name_1: Indoor
name_2: Outdoor
```

### ❄️ Neon Climate Card
```yaml
type: custom:neon-climate-card
entity: climate.living_room
name: Living Room AC
```

### ☀️ Neon Solar Production Card
```yaml
type: custom:neon-solar-production-card
entity: sensor.solar_production
name: Solar Production
```

### 📊 Neon Dual Gauge Card
```yaml
type: custom:neon-dual-gauge-card
entity_1: sensor.power_consumption
entity_2: sensor.solar_production
name_1: Consumption
name_2: Production
```

### 🏷️ Neon Header Card
```yaml
type: custom:neon-header-card
title: My Dashboard Section
```

### 🏷️ Neon Header Card v2
```yaml
type: custom:neon-header-card-v2
mode: both          # title | subtitle | both
title:
  text: "NEO TOKYO"
  glow: true
  gradient: true
  gradient_from: "#00fff9"
  gradient_to: "#ff10f0"
  scanline: false
  flicker: false
subtitle:
  text: "{{ states('sensor.date') }}"
```

### 📋 Neon Entities Card
```yaml
type: custom:neon-entities-card
title: Home Devices
entities:
  - entity: switch.living_room
    name: Living Room
  - type: divider
  - entity: sensor.temperature
    name: Temp
```

### 🖥️ Neon NAS Card
```yaml
type: custom:neon-nas-card
# Uses your Synology NAS sensor entities automatically
```

### 🔌 Neon Switch Card
```yaml
type: custom:neon-switch-card
# Network switch port monitor
```

### 💡 Neon Compact Light Card
```yaml
type: custom:neon-compact-light-card
entity: light.bedroom
name: Bedroom
```

### 🏭 Storey Battery Card
```yaml
type: custom:storey-battery-card
entity: sensor.sunology_battery
name: Home Battery
```

### 🕐 Nixie Clock Card
```yaml
type: custom:nixie-clock-card
use_military: true
tube_color: cyan        # orange | cyan | violet | green | blue | white
label: "SALON"
screws: true
```

### 🚗 VW Car Card
```yaml
type: custom:vw-car-card
# Uses VW CarConnect / Volkswagen We Connect entities
```

### 🚗 ID.3 Car Card
```yaml
type: custom:id3-car-card
# Uses CarConnectivity MQTT entities (id3_* prefix)
```

### 🔥 Heat Pump Card
```yaml
type: custom:heat-pump-card
# Ecodan PAC — full UI editor available
```

### 🎵 Onkyo Card
```yaml
type: custom:onkyo-card
entity: media_player.onkyo
```

### 🔔 Sonos Alarm Card
```yaml
type: custom:sonos-alarm-card
entity: media_player.sonos_salon
```

---

## 📸 Screenshots

See [Screenshots.md](Screenshots.md) for visual previews.

---

## 🐾 Support this project

If you enjoy these cards, please consider donating to **Quatre Pattes**, an animal rescue organization.

[![Sauver des animaux](https://img.shields.io/badge/🐾%20Sauver%20des%20animaux-Faire%20un%20don-ff69b4?style=for-the-badge)](https://don.quatre-pattes.org/s/?_jtsuid=70083177244599792679303)

> 💛 No need to support me — just help the animals. Thank you!

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-card`
3. Commit: `git commit -m 'Add my card'`
4. Push: `git push origin feature/my-card`
5. Open a Pull Request

---

## 📄 License

[MIT License](LICENSE)

---

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg
[hacs-url]: https://hacs.xyz
