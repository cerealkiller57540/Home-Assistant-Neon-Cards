<div align="center">

# ⚡ Home Assistant Neon Cards

### Cyberpunk / Neo Tokyo custom cards for Home Assistant

[![hacs][hacs-badge]][hacs-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)][license-url]
[![Cards](https://img.shields.io/badge/cards-24-00fff9.svg)](#-cards-included)
[![Theme](https://img.shields.io/badge/theme-Neo%20Tokyo-ff10f0.svg)](#-themes)

*Glowing SVG effects · Neon animations · Full theme inheritance · UI editors*

</div>

---

## 📸 Previews

<div align="center">

![Neo Tokyo theme](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/_theme-neo-tokyo-v3.png)

*Démonstrateur du thème **Neo Tokyo v3** — généré depuis [`themes/neo-tokyo-v3.yaml`](themes/neo-tokyo-v3.yaml) (sidebar, header, cards, contrôles, palette gaz/plasma)*

### Gallery

| Heat Pump | Dual Thermo | Solar |
|:---:|:---:|:---:|
| ![Heat Pump](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/heat-pump.png) | ![Dual Thermo](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/dual-thermo.png) | ![Solar](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/solar.png) |
| **Storey Battery** | **Battery** | **NAS** |
| ![Storey](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/storey-battery.png) | ![Battery](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/battery.png) | ![NAS](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/nas.png) |
| **Climate** | **Dual Gauge** | **Entities** |
| ![Climate](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/climate.png) | ![Dual Gauge](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/dual-gauge.png) | ![Entities](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/entities.png) |
| **Nixie Clock** | **Sonos Alarm** | **Onkyo** |
| ![Nixie](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/nixie-clock.png) | ![Sonos](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/sonos-alarm.png) | ![Onkyo](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/onkyo.png) |
| **Switch GS108T** | **Thermo** | **Compact Light** |
| ![Switch](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/switch-gs108t.png) | ![Thermo](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/thermo.png) | ![Compact Light](https://raw.githubusercontent.com/cerealkiller57540/Home-Assistant-Neon-Cards/main/previews/generated/compact-light.png) |

<sub>Aperçus générés via [`previews/`](previews/) (données factices, thème Neo Tokyo). Régénérables avec Playwright — voir [`.preview-tooling/`](.preview-tooling/).</sub>

</div>

---

## 📋 Table of Contents

- [Cards Included](#-cards-included)
- [Themes](#-themes)
- [Installation](#-installation)
- [Quick Config Examples](#-quick-config-examples)
- [Support](#-support-this-project)

---

## ✨ Cards Included

### ⚡ Energy & Battery

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🔋 Neon Battery Card | `neon-battery-card.js` | `3.0.1` | EV battery gauge with HC/Solar/Charge controls and side info panels |
| 🏭 Storey Battery Card | `storey-battery-card.js` | `14` | Isometric 3D battery for Sunology/modular storage systems — electric inter-module seam (crackle + sparks) |
| ☀️ Neon Solar Production Card | `neon-solar-production-card.js` | — | Real-time solar panel production monitor |
| 📊 Neon Dual Gauge Card | `neon-dual-gauge-card.js` | `2.0.0` | Dual concentric LED ring gauges with cyberpunk glow and theme inheritance |

### 🌡️ Climate & Temperature

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🌡️ Neon Thermo Card | `neon-thermo-card.js` | `1.4.0` | Temperature & humidity with neon styling |
| 🌡️🌡️ Neon Dual Thermo Card | `neon-dual-thermo-card.js` | `2.3.0` | Two temperature sensors side by side |
| ❄️ Neon Climate Card | `neon-climate-card.js` | `1.3.0` | Full climate control with Neo Tokyo UV palette, wind animations, unified UI editor (header + colors, CSS-variable friendly) |
| 🔥 Heat Pump Card | `heat-pump-card.js` | — | PAC/heat pump card (Ecodan Neo Tokyo edition) with UI editor |
| 📈 Heat Monitor Card | `heat-monitor-card.js` | `1.17` | CRT-style heat pump monitor with scrolling notes |

### 🌦️ Weather & Environment

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🌦️ Weather Neon Card | `weather-neon-card.js` | `2.11.0` | Animated outline weather icons (15 conditions), forecast, vigilance halo, GLITCH cat, air-quality & pollen pills (Atmo France), canvas FX: wind haze + rain with splashes + lightning flashes, frost crystals & parallax snow (hero-zone, low-power throttling on iPad/mobile) |

### 💡 Lighting & Switches

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 💡 Neon Compact Light Card | `neon-compact-light-card.js` | `2.1.0` | Compact light toggle with cyberpunk flicker, Zigbee/WiFi adaptive timing, unified UI editor |
| 🔌 Neon Switch Card | `neon-switch-card.js` | `1.7` | Network switch port monitor with Neo Tokyo palette |

### 🏠 Dashboard & Layout

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🏷️ Neon Header Card | `neon-header-card.js` | `1.4.2` | Stylish neon section header |
| 🏷️ Neon Header Card v2 | `neon-header-card-v2.js` | `2.7` | Advanced header with a built-in Jinja-like template engine — build fully data-driven, animated HTML headers right in YAML. Supports `{% set %}`, `{% if/elif/else %}`, `and/or/not`, `in`, arithmetic, ternaries, filters, concatenation, + 20 reusable neon `@keyframes`, + inline SVG (sanitized) for charts/maps. See the [demo](#-header-card-v2--template-engine) |
| 📋 Neon Entities Card | `neon-entities-card.js` | `1.8.0` | Multi-entity card (switch, sensor, cover, climate, number + dividers) — theme-agnostic colors, unified UI editor with per-entity icon preview |

### 🖥️ Network & NAS

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🖥️ Neon NAS Card | `neon-nas-card.js` | `1.9` | Synology NAS monitor (RS + RX410) with LED bay status |
| 🖥️ Neon NAS Card v2 | `neon-nas-card-v2.js` | `2.0` | Synology NAS monitor — v2 with SNMP RAID status badge, themable header, UI editor |
| 🐧 Linux Terminal Card | `linux-terminal-card.js` | `1.7` | Sci-fi CRT terminal for a remote Linux host — CPU/GPU/RAM/temp/updates/network + GLITCH cat, alert framing, UI editor |

### 🚗 Vehicles

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🚗 VW Car Card | `vw-car-card.js` | `0.4.1` | VW ID.4 — door/window status, battery, solar charge threshold |
| 🚗 ID.3 Car Card | `id3-car-card.js` | `1.0.0` | VW ID.3 via CarConnectivity MQTT (`id3_*` entities) |
| 🤖 Mova Mower Card | `mova-mower-card.js` | `12.765` | Robot mower with map, room selection, cleaning modes |

### 🎵 Media & Entertainment

| Card | File | Version | Description |
|------|------|:-------:|-------------|
| 🎵 Onkyo Card | `onkyo-card.js` | — | AV receiver control with input selection |
| 🔔 Sonos Alarm Card | `sonos-alarm-card.js` | `1.0.0` | Glassmorphism Sonos alarm manager |
| 🕐 Nixie Clock Card | `nixie-clock-card.js` | — | Retro nixie tube clock with configurable tube colors |

---

## 🧩 Header Card v2 — template engine

`neon-header-card-v2` is more than a title bar: its `subtitle.text` is rendered by a small
**Jinja-like engine that runs in the browser** (no Home Assistant server round-trip). That means
you can build **fully data-driven, animated HTML headers straight from YAML** — gauges, status
panels, live monitoring widgets — without writing a single custom JS card.

https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/raw/main/assets/neon-headers-demo.mp4

*Three live headers built only with YAML templates: a Raspberry Pi "reactor" (RAM core that
pulses with load), a Pi-hole "DNS filter stream", and a fiber uplink — all animated, all
driven by real entity states.*

**What the engine supports**

| Feature | Example |
|---------|---------|
| States / attributes | `{{ states('sensor.x') }}` · `is_state('x','on')` · `state_attr('weather.home','temperature')` |
| Variables | `{% set deg = states('sensor.x')|float * 3.6 %}` |
| Conditionals | `{% if cpu>85 %}…{% elif cpu>60 %}…{% else %}…{% endif %}` |
| Boolean logic | `and` · `or` · `not` |
| Membership | `{{ x in ['a','b'] }}` · `not in` |
| Ternary (nestable) | `{{ 'R' if v>85 else 'A' if v>60 else 'V' }}` |
| Arithmetic | `+ - * / ( )` |
| Filters | `\| round(n) float int upper lower title default thousands` |
| Concatenation | `{{ 'val=' ~ count }}` |

**Reusable neon `@keyframes`** (use via inline `animation:` in your template):
`nhv2-flicker`, `nhv2-core-pulse`, `nhv2-core-glow`, `nhv2-ring-spin`, `nhv2-data-flow`,
`nhv2-thermo-wave`, `nhv2-shimmer`, `nhv2-stream-x`, `nhv2-pulse-travel`, `nhv2-fiber-glow`, … (20 total).

**Example — a RAM gauge that turns amber/red under load:**

```yaml
type: custom:neon-header-card-v2
mode: both
title:
  text: RASPBERRY_PI
  icon: mdi:raspberry-pi
  glow: true
subtitle:
  text: >-
    {% set ram = states('sensor.pi_ram')|float(0) %}
    {% set c = '#FF2D6B' if ram>85 else '#FFB800' if ram>70 else '#39FF9E' %}
    <div style="color:{{c}}; font-weight:900; text-shadow:0 0 8px {{c}};">
      RAM {{ ram|round(0)|int }}%
    </div>
```

> ⚠️ **Sanitized output** — only `DIV/SPAN/B/STRONG/I/EM/U/SMALL/MARK/CODE/BR/HA-ICON`
> tags and `style`/`class` attributes are kept. Inline styles may use any gradient,
> `box-shadow`, `clip-path`, `mask`, `filter`, `mix-blend-mode` or `animation`, but
> `url()`, `@import`, `expression()`, `javascript:` are stripped.
> For smooth animation, animate `transform`/`opacity` (GPU) and avoid `left/top/width/height`.

---

## 🎨 Themes

| Theme | File | Description |
|-------|------|-------------|
| 🌙 Neo Tokyo v3 | `themes/neo-tokyo-v3.yaml` | Main dark theme — full neon palette, CSS variables for all cards |
| 🌙 Neon Night Joi HDR | `themes/neon-night-joi-hdr.yaml` | HDR-style neon dark theme |
| 🕶️ Netrunner 2 | `themes/netrunner2.yaml` | Cyberpunk netrunner variant |

**Installing a theme:**
1. Copy the `.yaml` file into your `config/themes/` folder
2. In `configuration.yaml`:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Restart HA → **Profile → Theme** → select your theme

---

## 📦 Installation

### Via HACS (recommended)

1. **HACS → Frontend → ⋮ → Custom repositories**
2. Add `https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards` — type **Lovelace**
3. Search **Neon Cards** → **Install**
4. Reload your browser

### Manual

1. Download the `.js` files you need
2. Copy them to `config/www/`
3. **Settings → Dashboards → Resources** → add each file as `JavaScript Module`:
   ```
   /local/neon-battery-card.js
   ```
4. Reload your browser

---

## 🔧 Quick Config Examples

<details>
<summary><b>🔋 Neon Battery Card</b></summary>

```yaml
type: custom:neon-battery-card
entity: sensor.battery_level
charging_entity: binary_sensor.is_charging
power_entity: sensor.charge_power_w
name: "EV Battery"
kwh_capacity: 77
show_kwh: true
```
</details>

<details>
<summary><b>🌡️ Neon Thermo Card</b></summary>

```yaml
type: custom:neon-thermo-card
entity: sensor.living_room_temperature
name: Living Room
```
</details>

<details>
<summary><b>🌡️🌡️ Neon Dual Thermo Card</b></summary>

```yaml
type: custom:neon-dual-thermo-card
entity_1: sensor.indoor_temperature
entity_2: sensor.outdoor_temperature
name_1: Indoor
name_2: Outdoor
```
</details>

<details>
<summary><b>❄️ Neon Climate Card</b></summary>

```yaml
type: custom:neon-climate-card
entity: climate.living_room
name: Living Room AC
```
</details>

<details>
<summary><b>☀️ Neon Solar Production Card</b></summary>

```yaml
type: custom:neon-solar-production-card
entity: sensor.solar_production
name: Solar Production
```
</details>

<details>
<summary><b>📊 Neon Dual Gauge Card</b></summary>

```yaml
type: custom:neon-dual-gauge-card
entity_1: sensor.power_consumption
entity_2: sensor.solar_production
name_1: Consumption
name_2: Production
```
</details>

<details>
<summary><b>🏷️ Neon Header Card v2</b></summary>

```yaml
type: custom:neon-header-card-v2
mode: both
title:
  text: "NEO TOKYO"
  glow: true
  gradient: true
  gradient_from: "#00fff9"
  gradient_to: "#ff10f0"
subtitle:
  text: "{{ states('sensor.date') }}"
```
</details>

<details>
<summary><b>📋 Neon Entities Card</b></summary>

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
</details>

<details>
<summary><b>🕐 Nixie Clock Card</b></summary>

```yaml
type: custom:nixie-clock-card
use_military: true
tube_color: cyan    # orange | cyan | violet | green | blue | white
label: "SALON"
screws: true
```
</details>

<details>
<summary><b>🚗 VW / ID.3 Car Card</b></summary>

```yaml
# VW ID.4
type: custom:vw-car-card

# VW ID.3 (CarConnectivity MQTT)
type: custom:id3-car-card
```
</details>

<details>
<summary><b>🏭 Storey Battery Card</b></summary>

```yaml
type: custom:storey-battery-card
entity: sensor.sunology_battery
name: Home Battery
```
</details>

---

## 🐾 Support this project

If you enjoy these cards, please consider donating to **Quatre Pattes**, an animal rescue organization.

[![Sauver des animaux](https://img.shields.io/badge/🐾%20Sauver%20des%20animaux-Faire%20un%20don-ff69b4?style=for-the-badge)](https://don.quatre-pattes.org/s/?_jtsuid=70083177244599792679303)

> 💛 No need to support me — just help the animals. Thank you!

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-card`
3. Commit and push
4. Open a Pull Request

---

## 📄 License

[MIT License][license-url]

---

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg
[hacs-url]: https://hacs.xyz
[license-url]: LICENSE
