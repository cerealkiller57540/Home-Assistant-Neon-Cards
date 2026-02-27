# � Neon Dual Gauge Card for Home Assistant

A highly customizable dual concentric LED gauge card for Home Assistant with stunning cyberpunk/neon visual effects, smooth animations, and full theme inheritance. Display two related metrics in one beautiful, compact gauge!

[![Version](https://img.shields.io/badge/version-2.0.0-00E8FF.svg?style=for-the-badge)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Compatible-00E8FF.svg?style=for-the-badge)](https://www.home-assistant.io/)
[![License](https://img.shields.io/badge/license-MIT-00E8FF.svg?style=for-the-badge)](LICENSE)

<div align="center">

**⭕ Dual Concentric Gauges | 🌈 Theme Inheritance | ⚡ GPU Accelerated | 📱 Mobile Ready**

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Configuration](#-configuration) • [Examples](#-examples)

</div>

---

## ✨ Features

<div align="center">
  <img src="https://via.placeholder.com/400x400/0a0a14/00e8ff?text=Dual+Gauge+Card" alt="Neon Dual Gauge Card" width="350"/>
</div>

### 🎨 Visual Design
- **⭕ Dual Concentric Gauges** - Display two related metrics in inner and outer LED rings
- **🌈 Dynamic Severity Zones** - Automatic color changes based on value ranges
- **✨ Neon Glow Effects** - Cyberpunk RGB chromatic glitch on hover/touch
- **🎨 Full Theme Inheritance** - Seamlessly integrates with your Home Assistant theme
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

### ⚡ Advanced Features
- **🔄 Bidirectional Mode** - Display positive and negative values (e.g., grid import/export)
- **📍 Custom Markers** - Add reference points with labels at specific values
- **🎯 Colored Zones** - Highlight specific value ranges with colored arcs
- **💫 Smooth Animations** - Buttery 60 FPS transitions with easing
- **👁️ Power Save Mode** - Pause updates when card not visible
- **🎛️ Visual Editor** - Configure everything through an intuitive UI

### 🚀 Performance
- **GPU Acceleration** - Hardware-accelerated animations using CSS transforms
- **RequestAnimationFrame** - Smooth, synchronized rendering at 60 FPS
- **CSS Variables** - Efficient LED color updates without DOM manipulation
- **Intersection Observer** - Automatic power saving when off-screen
- **Memory Management** - Proper cleanup prevents memory leaks

### 📊 Perfect For

### 🎨 Visual Design
- **Neon Glow Effects** - Customizable glow with color and intensity control
- **Cyberpunk Aesthetics** - Epic RGB chromatic glitch effects
- **Theme Integration** - Full inheritance from Home Assistant themes
- **Custom Styling** - Override any color, font, or style
- **Responsive Design** - Works on desktop, tablet, and mobile

### ⚡ Performance
- **GPU Acceleration** - Hardware-accelerated animations with transforms
- **60 FPS Animations** - Smooth requestAnimationFrame rendering
- **Power Save Mode** - Pause updates when card not visible
- **Efficient Rendering** - CSS containment and optimized DOM updates
- **Memory Management** - Proper cleanup to prevent leaks

### 🛠️ Developer Friendly
- **Visual Editors** - Configure cards through intuitive UI
- **YAML Support** - Full YAML configuration available
- **Comprehensive Docs** - Detailed inline documentation
- **Error Handling** - Helpful error messages and warnings
- **TypeScript Ready** - Well-structured, documented code

---

## 📦 Installation

### Method 1: Manual Installation

1. **Download** [`neon-dual-gauge-card.js`](neon-dual-gauge-card.js) from this repository

2. **Copy** the file to `/config/www/` in your Home Assistant installation

3. **Add resource** in Home Assistant:
   - Navigate to **Settings** → **Dashboards** → **Resources**
   - Click **Add Resource**
   - URL: `/local/neon-dual-gauge-card.js`
   - Resource type: **JavaScript Module**
   - Click **Create**

4. **Refresh** your browser (`Ctrl+F5` or `Cmd+Shift+R`)

5. **Add the card** to your dashboard - it will appear in the card picker!

### 📝 Alternative: HACS (Coming Soon)
HACS support is planned for a future release.

---

## 🚀 Quick Start Examples
Method 2: HACS (Coming Soon)
HACS support is planned for a future release.

---

## 🚀 Quick Startg_room_temperature
    min: 0
- **🌡️ Temperature + Humidity** - Climate monitoring in one gauge
- **⚡ Energy Monitoring** - Power consumption + production
- **📶 Network Stats** - Upload + download speeds
- **🏠 Air Quality** - CO2 + VOC levels
- **💻 Server Monitoring** - CPU + RAM usage
- **🔋 Battery Systems** - Charge + discharge rates
- **📊 Any Dual Metrics** - Display two related measurements together
entity_left: sensor.indoor_temperature
entity_right: sensor.outdoor_temperature
humidity_entity_left: sensor.indoor_humidity
humidity_entity_right: sensor.outdoor_humidity
name_left: "Inside"
name_right: "Outside"
temp_min: -20
temp_max: 40
show_plasma: true
cyberpunk_mode: true
```

### Neon Header Card
```yaml
type: custom:neon-header-card
title: "CYBERPUNK DASHBOARD"
subtitle: "System Online"
icon: mdi:lightning-bolt
font_family: Orbitron
uppercase: true
effect_glow: true
effect_scanline: true
effect_hover_glitch: true
border_color: "#00E8FF"
border_width: 2px
```

### Neon Solar Card
```yaml
type: custom:neon-solar-card
entity: sensor.solar_power
daily_entity: sensor.solar_energy_today
max_power: 5000
show_history: true
cyberpunk_mode: true
neon_glow: true
weather_entity: weather.home
```

---

## 📖 Detailed Documentation

### 🎯 Neon Dual Gauge Card

#### Card-Level Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | `null` | Card title |
| `title_position` | string | `'bottom'` | `top`, `bottom`, `inside-top`, `inside-bottom`, `none` |
| `gauge_size` | number | `200` | Outer gauge diameter (px) |
| `inner_gauge_size` | number | `65%` | Inner gauge diameter |
| `primary_gauge` | string | `'inner'` | Primary gauge: `inner` or `outer` |
| ` Card-Level Optionslse` | Hide card frame |
| `hide_shadows` | boolean | `false` | Disable all shadows |
| `enable_custom_effects` | boolean | `true` | Enable neon effects |
| `enable_top_glow` | boolean | `true` | Top accent glow |
| `enable_pulse_animation` | boolean | `true` | Subtle pulsing |
| `enable_glitch_hover` | boolean | `true` | Glitch on hover |
| `power_save_mode` | boolean | `false` | Pause when not visible |
| `update_interval` | number | `1000` | Update frequency (ms) |

#### Per-Gauge Configuration (2 required)
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Entity ID |
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `unit` | string | `null` | Unit display |
| `decimals` | number | `1` | Decimal places |
| ` Per-Gauge Optionsof LEDs |
| `led_size` | number | `6`/`8` | LED diameter (px) |
| `smooth_transitions` | boolean | `true` | Animate changes |
| `animation_duration` | number | `800` | Animation time (ms) |
| `bidirectional` | boolean | `false` | Show +/- values |
| `hide_inactive_leds` | boolean | `false` | Hide inactive LEDs |

#### Severity Zones
```yaml
**Gauges array requires exactly 2 gauge configurations - one for inner ring, one for outer ring.**

everity:
  - color: "#2196F3"  # Blue (cold)
    value: 18
  - color: "#4CAF50"  # Green (optimal)
    value: 24
  - color: "#FF5722"  # Red (hot)
    value: 40
```

### Markers (Reference Points)
```yaml
markers:
  - value: 20
    color: "#FFF"
    label: "Target"
```

#### Zones (Colored Arcs)
```yaml
zones:
  - from: 18
    to: 24
    color: "#4CAF50"
    opacity: "0.3"
### Font Styling

### Climate Monitoring Dashboard
```yaml
# Header
- type: custom:neon-header-card
  title: "CLIMATE CONTROL"
  subtitle: "Environmental Monitoring System"
  icon: mdi:thermometer
  font_family: Orbitron
  uppercase: true
  effect_glow: true
  effect_glow_color: "#00E8FF"
  effect_scanline: true
  border_width: 2px
  border_color: "#00E8FF"

# Living Room Climate
- type: custom:neon-dual-gauge-card
  name: "Living Room"
  title_position: "inside-top"
  gauge_size: 220
  enable_custom_effects: true
  gauges:
    - entity: sensor.living_room_temperature
      min: 10
      max: 35
      unit: "°C"
      leds_count: 120
      severity:
        - color: "#2196F3"
          value: 18
        - color: "#4CAF50"
          value: 22
        - color: "#FFC107"
          value: 26
        - color: "#FF5722"
          value: 35
      markers:
        - value: 21
          color: "#FFF"
          label: "21°"
    - entity: sensor.living_room_humidity
      min: 0
      max: 100
      unit: "%"
      severity:
        - color: "#FF9800"
          value: 30
        - color: "#4CAF50"
          value: 60
        - color: "#2196F3"
          value: 100

# Indoor vs Outdoor
- type: custom:neon-dual-thermo-card
  entity_left: sensor.indoor_temperature
  entity_right: sensor.outdoor_temperature
  humidity_entity_left: sensor.indoor_humidity
  humidity_entity_right: sensor.outdoor_humidity
  name_left: "Inside"
  name_right: "Outside"
  temp_min: -20
  temp_max: 40
  show_plasma: true
  cyberpunk_mode: true
```

### Energy Dashboard
```yaml
# Solar Production
- type: custom:neon-solar-card
  entity: sensor.solar_power
  daily_entity: sensor.solar_energy_today
  max_power: 5000
  show_history: true
  show_efficiency: true
  cyberpunk_mode: true
  neon_glow: true
  weather_entity: weather.home

# Grid Power (Bidirectional)
- type: custom:neon-dual-gauge-card
  name: "Energy Flow"
  gauges:
    - entity: sensor.grid_power
Additional font styling options for value and unit text:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value_font_size` | string | `'24px'` | Value font size |
| `value_font_weight` | string | `'bold'` | Value font weight |
| `value_font_color` | string | theme | Value text color |
| `value_font_family` | string | `'inherit'` | Value font family |
| `unit_font_size` | string | `'14px'` | Unit font size |
| `unit_font_weight` | string | `'normal'` | Unit font weight |
| `unit_font_color` | string | theme | Unit text color |

### Shadow Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable_shadow` |  Climate"
  gauge_size: 200mber | `15` | Center shadow spread |
| `outer_shadow` | boolean | `false` | Enable outer gauge shadow |
| `outer_shadow_blur` | number | `30` | Outer shadow blur |
| `outer_shadow_spread` | number | `15` | Outer shadow spread |
# Inner gauge: Temperature
    - entity: sensor.living_room_temperature
      min: 0
      max: 40
      unit: "°C"
      decimals: 1
      leds_count: 100
      severity:
        - color: "#2196F3"
          value: 18
        - color: "#4CAF50"
          value: 24
        - color: "#FF5722"
          value: 40
    # Outer gauge: Humidity
    - entity: sensor.living_room_humidity
      min: 0
      max: 100
      unit: "%"
      decimals: 0
      leds_count: 100
```

### Example 2: Energy Monitoring with Effects

## 🎨 Theming & Customization

### Card-Mod Integration
```yaml
type: custom:neon-dual-gauge-card
gauges:
  - entity: sensor.temperature
  - entity: sensor.humidity
card_mod:
  style: |
    ha-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
```

### Theme Variables
Cards inherit from your Home Assistant theme:

```yaml
# theme.yaml
my-neon-theme:
type: custom:neon-dual-gauge-card
name: "Home Energy"
titlCustom Color Palettes

**Cyberpunk Purple/Cyan:**
```yaml
custom_background: "#0A0A14"
custom_text_color: "#00E8FF"
custom_secondary_text_color: "#E946FF"
gauges:
  - entity: sensor.temperature
    severity:
      - color: "#E946FF"
        value: 20
      - color: "#00E8FF"
        value: 30
```

**Matrix Green:**
```yaml
custom_background: "#000000"
custom_gauge_background: "radial-gradient(circle, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05))"
custom_text_color: "#00FF00"
gauges:
  - entity: sensor.temperature
    severity:
      - color: "#00FF00"
        value: 100
```

**Warm Sunset:**
```yaml
gauges:
  - entity: sensor.temperature
    severity:
      - color: "#4169E1"
        value: 15
      - color: "#FFA500"
        value: 25
      - color: "#FF4500"
        value: 35
```

### Theme Variables

The card uses these Home Assistant theme variables:
- `--card-background-color` - Card background
- `--primary-text-color` - Main text color
- `--secondary-text-color` - Secondary text
- `--accent-color` - Accent elements
- `--rgb-primary-color` - RGB values for effects
- `--rgb-accent-color` - RGB values for glowge_size: 200
gauges:
  - entity: sensor.grid_power
    min: -5000
    max: 5000
    unit: "W"
    decimals: 0
    bidirectional: true  # Enables bidirectional mode
    leds_count: 120
    seve Not Showing
1. **Check console** - Press `F12` and look for errors
2. **Verify resource** - Ensure URL is `/local/neon-dual-gauge-card.js`
3. **Clear cache** - Hard refresh with `Ctrl+F5` or `Cmd+Shift+R`
4. **Restart HA** - Sometimes needed after adding resources
5. **Check file location** - File must be in `/config/www/`

### Entities Not Configured
If you see "⚠️ Some entities are not configured yet":
- Make sure both gauge entities are defined
- Check entity IDs are correct in YAML
- Verify entities exist in Home Assistant

### Visual Editor Not Loading
1. Refresh the browser
2. Check for JavaScript errors in console
3. Try configuring via YAML instead
4. Ensure you're on a recent HA version

### Performance Issues
1. **Reduce LED count** - Try 60-80 instead of 100+
2. **Disable effects** - Set `enable_custom_effects: false`
3. **Enable power save** - Set `power_save_mode: true`
4. **Increase interval** - Set `update_interval: 2000` (2 seconds)
5. **Disable transitions** - Set `smooth_transitions: false`

### Animations Laggy or Stuttering
1. **GPU capability** - Older devices may struggle
2. *Optimal Configuration
- **LED Count:** 80-120 provides good balance (100 is default)
- **Update Interval:** 1000ms (1 second) is ideal for most sensors
- **Gauge Size:** 180-240px works well on most screens
- **Decimals:** 0-1 for most measurements, 2 for precision

### Performance Tips
- ✅ Enable `power_save_mode` for always-on tablets
- ✅ Use `smooth_transitions` for slower-changing values
- ✅ Reduce `animation_duration` for snappier updates
- ❌ Avoid 200+ LEDs on older devices
- ❌ Don't disable `smooth_transitions` unless needed

### Design Guidelines
- **Related Metrics** - Pair logically related values (temp + humidity, not temp + CPU)
- **Color Zones** - Use 3-5 severity zones for clear visual indication
- **Markers** - Add for important thresholds or targets
- **Labels** - Always include units and clear card names
- **Consistency** - Use same color scheme across your dashboard

###❓ FAQ

**Q: Can I use more than 2 gauges?**  
A: No, the card is designed for exactly 2 gauges (inner and outer rings).

**Q: What's the difference between inner and outer gauge?**  
A: Inner gauge is the smaller ring inside, outer is the larger ring. You can control which appears "primary" with the `primary_gauge` option.

**Q: How does bidirectional mode work?**  
A: It displays positive values going clockwise and negative values counter-clockwise from the top (12 o'clock position).

**Q: Can I hide the inactive LEDs?**  
A: Yes! Set `hide_inactive_leds: true` in the gauge configuration.

**Q: Does this work with template sensors?**  
A: Yes, any Home Assistant entity that returns a numeric state will work.

**Q: Can I click the gauge values?**  
A: Yes! Clicking on a gauge value opens the entity's history dialog.


**Created with ❤️ for the Home Assistant community**

### Inspiration
Special thanks to **[@guiohm79](https://github.com/guiohm79)** for the original [dual_gauge](https://github.com/guiohm79/dual_gauge) card that inspired this project! The Neon Dual Gauge Card builds upon those foundational concepts and extends them with:
- Enhanced visual effects (neon glow, glitch animations)
- Bidirectional mode for positive/negative values
- Full theme inheritance system
- Advanced customization (markers, zones, shadows)
- GPU-accelerated performance optimizations
- Visual configuration editor
- Mobile and kiosk optimizations

### Technologies
- [Home Assistant](https://www.home-assistant.io/) - Smart home platform
- [Material Design Icons](https://materialdesignicons.com/) - Icon library
- Vanilla JavaScript (no dependencies!)
- CSS3 animations with GPU acceleration
- Modern web APIs (IntersectionObserver, RequestAnimationFrame)

### Communityree to use, modify, and distribute!
is card useful:

- ⭐ **Star this repository** - Shows appreciation and helps others discover it
- 🐛 **Report issues** - Help make the card better
- 📢 **Share** with the Home Assistant community
- 💬 **Provide feedback** - Let me know what works and what doesn't
- ☕ **[Buy me a coffee](https://www.buymeacoffee.com/cerealkiller57540)** _(completely optional!)_

---

## 📚 Resources

- **[Home Assistant Docs](https://www.home-assistant.io/docs/)** - Official documentation
- **[Custom Card Guide](https://www.home-assistant.io/lovelace/custom-cards/)** - How to add custom cards
- **[Card-Mod](https://github.com/thomasloven/lovelace-card-mod)** - Advanced card styling
- **[MDI Icons](https://materialdesignicons.com/)** - Icon reference
- **[Community Forum](https://community.home-assistant.io/)** - Get help and share ideas

---

<div align="center">

### Made with 🌟 by [cerealkiller57540](https://github.com/cerealkiller57540)

*Cyberpunk aesthetics meet smart home automation*

[![GitHub stars](https://img.shields.io/github/stars/cerealkiller57540/Home-Assistant-Neon-Cards?style=social)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards)
[![GitHub forks](https://img.shields.io/github/forks/cerealkiller57540/Home-Assistant-Neon-Cards?style=social)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/fork)
[![GitHub issues](https://img.shields.io/github/issues/cerealkiller57540/Home-Assistant-Neon-Cards?style=social)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/issues)

**[⬆ Back to Top](#-neon-dual-gauge-card-for-home-assistantoptions.

### Card-Mod Integration

For advanced styling, use card-mod:

```yaml
type: custom:neon-dual-gauge-card
name: "Custom Styled"
custom_gauge_background: "radial-gradient(circle, rgba(233, 70, 255, 0.2), rgba(0, 232, 255, 0.1))"
custom_center_background: "radial-gradient(circle, rgba(26, 21, 37, 0.95), #1a1525)"
custom_text_color: "#00E8FF"
custom_secondary_text_color: "#FF50A0"
gauges:
  - entity: sensor.temperature
  - entity: sensor.humidity
```

---

## 🎨 Customization & Theminge
    min: 0
    max: 40
    unit: "°C"
    decimals: 1
    leds_count: 120
    led_size: 6
    smooth_transitions: true
    animation_duration: 1000
    # Severity colors
    severity:
      - color: "#2196F3"
        value: 18
      - color: "#4CAF50"
        value: 22
      - color: "#FFC107"
        value: 26
      - color: "#FF5722"
        value: 40
    # Add markers
    markers:
      - value: 21
        color: "#FFFFFF"
        label: "Target"
      - value: 25
        color: "#FF9800"
        label: "Alert"
    # Add colored zones
    zones:
      - from: 18
        to: 24
        color: "#4CAF50"
        opacity: "0.2"
    # Shadows
    center_shadow: true
    center_shadow_blur: 30
    center_shadow_spread: 15
    outer_shadow: true
    outer_shadow_blur: 25
    outer_shadow_spread: 10
    # Font customization
    value_font_size: "28px"
    value_font_weight: "bold"
    value_font_color: "#00E8FF"
    unit_font_size: "16px"
    unit_font_color: "#FF50A0"
  - entity: sensor.humidity
    min: 0
    max: 100
    unit: "%"
    leds_count: 100
    led_size: 8
```

### Example 5: Minimal Configuration
```yaml
type: custom:neon-dual-gauge-card
gauges:
  - entity: sensor.temperature
  - entity: sensor.humidityons:** Beautiful but impacts performance

### Design
- **Consistency:** Use same color palette
- **Contrast:** Ensure readable text
- **Spacing:** Give cards breathing room
- **Effects:** Less is more

### Organization
- Use headers to organize sections
- Group related metrics in dual gauges
- Always add clear labels and units
- Test on mobile devices

---

## 📜 Changelog

### v2.0.0 (2026-02-27)
- 🎯 **NEW:** Neon Dual Gauge Card with bidirectional mode
- ⚡ Major performance optimizations
- 🎨 Enhanced theme inheritance
- 🔧 Improved visual editors
- 📱 Better mobile support
- 🐛 Bug fixes and stability

### v1.1.0
- ⚡ Cyberpunk glitch effects
- 🚀 GPU acceleration
- 🎨 Solar & Thermo improvements

### v1.0.0
- 🎉 Initial release
- ✨ Header, Thermo, Solar cards

---

## 🙏 Credits & Inspiration

**Created with ❤️ for the Home Assistant community**

Special thanks to **[@guiohm79](https://github.com/guiohm79)** for the original [dual_gauge](https://github.com/guiohm79/dual_gauge) card that inspired the Neon Dual Gauge Card! This collection builds upon and extends those concepts with enhanced features, visual effects, and performance optimizations.

### Technologies & Resources
- [Home Assistant](https://www.home-assistant.io/) - Best home automation platform
- [Material Design Icons](https://materialdesignicons.com/) - Icon library
- [Google Fonts](https://fonts.google.com/) - Typography
- Cyberpunk & Neo Tokyo aesthetics
- Community feedback and contributions

### Special Thanks
- Home Assistant development team
- [@guiohm79](https://github.com/guiohm79) for the dual gauge inspiration
- Custom card community
- All contributors and users

---

## 🤝 Contributing

Contributions are welcome!

- 🐛 **Report bugs** - [Open an issue](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/issues)
- 💡 **Suggest features** - Share your ideas
- 🔧 **Submit PRs** - Fix bugs or add features
- 📖 **Improve docs** - Help others
- ⭐ **Star the repo** - Show support!

### Development
```bash
git clone https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards.git
# Cards are standalone JavaScript files
# Test by copying to /config/www/ in your HA instance
```

---

## 📄 License

MIT License - Feel free to use, modify, and distribute!

See [LICENSE](LICENSE) for details.

---

## 💖 Support

If you find these cards useful:

- ⭐ **Star this repository**
- 🐛 **Report issues** to help improve
- 📢 **Share** with the community
- ☕ **[Buy me a coffee](https://www.buymeacoffee.com/cerealkiller57540)** _(optional)_

---

## 📚 Additional Resources

- [Home Assistant Documentation](https://www.home-assistant.io/docs/)
- [Lovelace Custom Cards](https://www.home-assistant.io/lovelace/custom-cards/)
- [Card-Mod Documentation](https://github.com/thomasloven/lovelace-card-mod)
- [MDI Icon Library](https://materialdesignicons.com/)

---

<div align="center">

**Made with 🌟 and ⚡ by [cerealkiller57540](https://github.com/cerealkiller57540)**

*Transform your Home Assistant dashboard into a cyberpunk control center!*

[![GitHub stars](https://img.shields.io/github/stars/cerealkiller57540/Home-Assistant-Neon-Cards?style=social)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards)
[![GitHub forks](https://img.shields.io/github/forks/cerealkiller57540/Home-Assistant-Neon-Cards?style=social)](https://github.com/cerealkiller57540/Home-Assistant-Neon-Cards/fork)

**[⬆ Back to Top](#-home-assistant-neon-cards-collection)**

</div>
