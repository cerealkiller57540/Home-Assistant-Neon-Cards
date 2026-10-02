<div align="center">

# ⚡ Home Assistant Neon Cards

**Cyberpunk / Neo Tokyo custom cards and themes for Home Assistant.**

[![License: MIT][license-badge]][license-url]

</div>

Each card now lives in its own repository, so HACS can install and update it on its own. This page is the index of the collection; the themes stay here.

## ✨ Cards

| | Card | |
|:---:|---|:---:|
| <img src="https://raw.githubusercontent.com/cerealkiller57540/weather-neon-card/main/images/scenes.jpg" alt="Weather Neon Card" width="240"> | [**Weather Neon Card**](https://github.com/cerealkiller57540/weather-neon-card)<br>Weather with a live WebGL sky: rain on the glass, fog, frost, snow, lightning and the real moon phase. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=weather-neon-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/neon-climate-card/main/images/heat.png" alt="Neon Climate Card" width="240"> | [**Neon Climate Card**](https://github.com/cerealkiller57540/neon-climate-card)<br>Climate control with the airflow drawn by a real WebGL fluid solver. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=neon-climate-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/storey-battery-card/main/images/discharge.png" alt="Storey Battery Card" width="240"> | [**Storey Battery Card**](https://github.com/cerealkiller57540/storey-battery-card)<br>A 3D home battery stack with live electric arcs between the modules. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=storey-battery-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/neon-dual-gauge-card/main/images/main.png" alt="Neon Dual Gauge Card" width="240"> | [**Neon Dual Gauge Card**](https://github.com/cerealkiller57540/neon-dual-gauge-card)<br>Two concentric LED gauges with a WebGL plasma core that follows the value. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=neon-dual-gauge-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/neon-dual-thermo-card/main/images/main.png" alt="Neon Dual Thermo Card" width="240"> | [**Neon Dual Thermo Card**](https://github.com/cerealkiller57540/neon-dual-thermo-card)<br>Two neon thermometers with refracting glass, liquid and bubbles, plus a 24 h history graph. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=neon-dual-thermo-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/nixie-clock-card/main/images/main.png" alt="Nixie Clock Card" width="240"> | [**Nixie Clock Card**](https://github.com/cerealkiller57540/nixie-clock-card)<br>Six IN-14 nixie tubes with glowing gas and an acrylic base. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=nixie-clock-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/neon-entities-card/main/images/main.gif" alt="Neon Entities Card" width="240"> | [**Neon Entities Card**](https://github.com/cerealkiller57540/neon-entities-card)<br>An entities list with per-domain neon controls, alert rows and momentary switches. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=neon-entities-card&category=plugin) |
| <img src="https://raw.githubusercontent.com/cerealkiller57540/neon-markdown-card/main/images/main.png" alt="Neon Markdown Card" width="240"> | [**Neon Markdown Card**](https://github.com/cerealkiller57540/neon-markdown-card)<br>Markdown with client-side Jinja templates, a full HTML/SVG/CSS body and a neon header. | [![Open in HACS][hacs-btn]](https://my.home-assistant.io/redirect/hacs_repository/?owner=cerealkiller57540&repository=neon-markdown-card&category=plugin) |

More cards will move to their own repositories over time. The older single-file versions were removed from this repository; they remain in its git history.

## 🎨 Themes

| Theme | File | Description |
|-------|------|-------------|
| 🌙 Neo Tokyo v3 | [`themes/neo-tokyo-v3.yaml`](themes/neo-tokyo-v3.yaml) | Main dark theme: full neon palette, CSS variables used by all the cards |
| 🌙 Neon Night Joi HDR | [`themes/neon-night-joi-hdr.yaml`](themes/neon-night-joi-hdr.yaml) | HDR-style neon dark theme |
| 🕶️ Netrunner 2 | [`themes/netrunner2.yaml`](themes/netrunner2.yaml) | Cyberpunk netrunner variant |

**Installing a theme:**
1. Copy the `.yaml` file into your `config/themes/` folder.
2. In `configuration.yaml`:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Restart Home Assistant, then **Profile → Theme** and select it.

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

[license-badge]: https://img.shields.io/github/license/cerealkiller57540/Home-Assistant-Neon-Cards?style=for-the-badge
[license-url]: LICENSE
[hacs-btn]: https://my.home-assistant.io/badges/hacs_repository.svg
