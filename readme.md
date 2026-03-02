# 🌟 Home Assistant Neon Cards

A collection of custom cards for [Home Assistant](https://www.home-assistant.io/) with a sleek **neon aesthetic**. Perfect for futuristic dashboards with glowing effects and vibrant colors.

[![hacs][hacs-badge]][hacs-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 📸 See [Screenshots.md](Screenshots.md) for previews of all cards.

---

## ✨ Cards included

### 🔌 Core Cards

| Card | File | Description |
|------|------|-------------|
| 🔋 Neon Battery Card | `neon-battery-card.js` | Displays battery level with a neon-style gauge |
| 🌡️ Neon Thermo Card | `neon-thermo-card.js` | Shows temperature & humidity with neon styling |
| 🌡️🌡️ Neon Dual Thermo Card | `neon-dual-thermo-card.js` | Displays two temperature sensors side by side |
| ☀️ Neon Solar Production Card | `neon-solar-production-card.js` | Monitors solar panel production in real time |
| 🏷️ Neon Header Card | `neon-header-card.js` | Stylish neon section header for your dashboard |
| 📊 Neon Dual Gauge Card | `Neon Dual Gauge Card/` | Dual circular gauge with neon glow effect |

### ☀️ Sunology Cards

| Card | File | Description |
|------|------|-------------|
| 🔋 Storey Battery Card | `Sunology/storey-battery-card.js` | Battery card tailored for Sunology solar systems |

---

## 🎨 Themes

This repo includes a ready-to-use neon theme for Home Assistant.

| Theme | Description |
|-------|-------------|
| 🌙 Neon Night Joi HDR | Dark neon theme with HDR-style colors for immersive dashboards |

### Installing the theme

1. Copy the theme file from the `themes/` folder into your `config/themes/` directory.
2. In `configuration.yaml`, make sure themes are enabled:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Restart Home Assistant.
4. Go to your **Profile** → select **Neon Night Joi HDR**.

---

## 📦 Installation

### Via HACS (recommended)

1. Open **HACS** in your Home Assistant instance.
2. Go to **Frontend** → click the **⋮** menu → **Custom repositories**.
3. Add the following URL as a **Lovelace** repository:
   ```
   https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards
   ```
4. Search for **Neon Cards** and click **Install**.
5. Reload your browser.

### Manual installation

1. Download the `.js` files from this repository.
2. Copy them into your `config/www/` folder (e.g. `config/www/neon-cards/`).
3. In Home Assistant, go to **Settings → Dashboards → Resources** and add each file:
   ```
   /local/neon-cards/neon-battery-card.js
   /local/neon-cards/neon-thermo-card.js
   /local/neon-cards/neon-dual-thermo-card.js
   /local/neon-cards/neon-solar-production-card.js
   /local/neon-cards/neon-header-card.js
   ```
   For the Dual Gauge Card and Sunology cards, refer to the respective subfolder `README` or JS file for the resource path.
4. Reload your browser.

---

## 🔧 Usage

### 🔋 Neon Battery Card

```yaml
type: custom:neon-battery-card
entity: sensor.my_battery
name: Battery Level
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

### 🔋 Storey Battery Card (Sunology)

```yaml
type: custom:storey-battery-card
entity: sensor.sunology_battery
name: Sunology Battery
```

---

## 📸 Screenshots

See [Screenshots.md](Screenshots.md) for a full visual preview of all the cards.

---

## 🐾 Support this project

If you like this project and want to give back, please consider making a donation to **Quatre Pattes**, an animal rescue organization. Every little bit helps save lives! 🐶🐱

[![Donner pour les animaux](https://img.shields.io/badge/🐾%20Sauver%20des%20animaux-Faire%20un%20don-ff69b4?style=for-the-badge)](https://don.quatre-pattes.org/s/?_jtsuid=70083177244599792679303)

> 💛 No need to support me — just help the animals instead. Thank you!

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-new-card`)
3. Commit your changes (`git commit -m 'Add my new card'`)
4. Push to the branch (`git push origin feature/my-new-card`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg
[hacs-url]: https://hacs.xyz
