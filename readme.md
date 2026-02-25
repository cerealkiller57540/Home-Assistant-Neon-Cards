# 🌙 Home Assistant Neon Cards

> A collection of custom Lovelace cards with a dark neon aesthetic — designed for Home Assistant dashboards.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/v/release/cerealkiller57540/Home-Assistant-Neon-Cards?style=for-the-badge)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📦 Cards included

| Card | File | Description |
|------|------|-------------|
| 🌞 **Neon Solar Card** | `neon-solar-production-card.js` | Solar production with animated panel, 24h sparkline & forecast ghost line |
| 🔋 **Neon Battery Card** | `neon-battery-card.js` | Battery state with animated fill and glow |
| 🌡️ **Neon Thermo Card** | `neon-thermo-card.js` | Single thermostat / temperature sensor |
| 🌡️🌡️ **Neon Dual Thermo Card** | `neon-dual-thermo-card.js` | Two sensors side by side (indoor / outdoor) |
| 🏷️ **Neon Header Card** | `neon-header-card.js` | Section header with neon accent |

All cards share a consistent dark neon theme — **cyan · violet · pink** — and inherit your HA theme fonts automatically.

---

## 🚀 Installation

### Via HACS (recommended)

1. Open HACS → **Frontend**
2. Click the three dots menu → **Custom repositories**
3. Add `https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards` as type **Lovelace**
4. Install **Home Assistant Neon Cards**
5. Reload your browser

### Manual

1. Download the `.js` file(s) from the latest [Release](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/releases)
2. Copy to `/config/www/`
3. In HA: **Settings → Dashboards → Resources** → Add `/local/neon-solar-production-card.js` (type: JavaScript module)
4. Repeat for each card you want to use

---

## 🌞 Neon Solar Card

Animated 48-cell solar panel, live production value, 24h sparkline with optional forecast ghost line, night mode, weather badges.

### Minimal config

```yaml
type: custom:neon-solar-card
entity: sensor.solar_power
max_power: 5000
```

### Full config

```yaml
type: custom:neon-solar-card

# ── Entities ───────────────────────────────────────────
entity: sensor.solar_power            # required — production power sensor
input_unit: W                         # W (default) or kW — your sensor's unit
daily_entity: sensor.solar_energy_today
secondary_entity: sensor.solar_rendement
secondary_label: RENDEMENT
secondary_unit: "%"
forecast_entity: sensor.solar_forecast
forecast_unit: W                      # W (default) or kW — independent of input_unit
luminosity_entity: sensor.lux_outdoor
weather_entity: weather.home

# ── Display ────────────────────────────────────────────
name: Production Solaire
max_power: 5000                       # W — used for efficiency calculation
decimal_places: 0
animation_speed: 1                    # 0.1–5
night_threshold: 10                   # lux below = night mode
show_history: true
show_efficiency: true
font_size: medium                     # small | medium | large
header_font_size: medium

# ── Glow ──────────────────────────────────────────────
glow_effect: true

# ── Neo Tokyo mode ─────────────────────────────────────
cyberpunk_mode: false                 # enables #ff10f0 / #00fff9 preset
neon_glow: false                      # stronger glow on value & panel

# ── Actions ────────────────────────────────────────────
tap_action:
  action: more-info
hold_action:
  action: more-info
double_tap_action:
  action: none

# ── Colors (omit = inherit from HA theme) ──────────────
color_primary: "#FFD23F"
color_cold: "#00E8FF"
color_mid: "#FFD23F"
color_hot: "#FF6B35"
color_icon: "#FFD23F"
color_badge: "#FFD23F"
```

### Sparkline forecast ghost line

If `forecast_entity` is configured and has history, a white dashed ghost line is drawn on top of the 24h sparkline — same Y scale as production — so you can visually compare real vs forecast.

```yaml
forecast_entity: sensor.solcast_pv_forecast_power_now
forecast_unit: W    # set to kW if your forecast sensor returns kilowatts
```

---

## 🔋 Neon Battery Card

```yaml
type: custom:neon-battery-card
entity: sensor.battery_soc            # 0–100 %
voltage_entity: sensor.battery_voltage
power_entity: sensor.battery_power
name: Batterie
max_power: 5000
```

---

## 🌡️ Neon Thermo Card

```yaml
type: custom:neon-thermo-card
entity: sensor.temperature_living
name: Salon
unit: "°C"
min_value: 15
max_value: 30
```

---

## 🌡️🌡️ Neon Dual Thermo Card

```yaml
type: custom:neon-dual-thermo-card
entity_left: sensor.temperature_indoor
label_left: Intérieur
entity_right: sensor.temperature_outdoor
label_right: Extérieur
unit: "°C"
```

---

## 🏷️ Neon Header Card

```yaml
type: custom:neon-header-card
title: Énergie
icon: mdi:solar-power
color: "#00E8FF"
```

---

## 🎨 Recommended theme

All cards are designed to look best with the **neon-night-joi-hdr** theme included in this repo (coming soon). Add it to your `configuration.yaml`:

```yaml
frontend:
  themes: !include_dir_merge_named themes/
```

---

## 🗺️ Roadmap

- [ ] Screenshots in README
- [ ] Theme file `neon-night-joi-hdr.yaml`
- [ ] HACS default repo submission
- [ ] Neon Energy Flow card (production → battery → grid)

---

## 🤝 Contributing

Issues and PRs welcome. Please open an issue before submitting a large PR.

---

## 📄 License

[MIT](LICENSE) — © 2026 cerealkiller57540
