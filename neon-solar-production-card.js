/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  neon-solar-card  —  Solar Production Card for Home Assistant ║
 * ║  Version : 2.1.0                                             ║
 * ║  License : MIT                                               ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * A cyberpunk-inspired solar panel card with animated cells,
 * sparkline history, night-mode detection, weather badges,
 * forecast ghost line, production threshold indicator, and
 * full visual-editor support.
 *
 * Installation:
 *   1. Copy this file to /config/www/neon-solar-card.js
 *   2. Dashboard → Resources → Add /local/neon-solar-card.js (type: module)
 *
 * Minimal YAML config:
 *   type: custom:neon-solar-card
 *   entity: sensor.solar_power
 *   max_power: 5000
 *
 * Full config reference — see buildConfig() below.
 */

const VERSION = '2.1.0';

// ═══════════════════════════════════════════════════════════════
//  DEVICE DETECTION
// ═══════════════════════════════════════════════════════════════
// Detect iPad (including 8th gen and older) and low-power devices
const IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_LOW_POWER = IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);
// Merges user-supplied YAML with sensible defaults.
// Every key is documented; `null` means "inherit from HA theme".

/**
 * Build a normalised config object from raw YAML input.
 * @param {Object} raw - User-supplied card configuration.
 * @returns {Object} Normalised configuration with defaults applied.
 */
function buildConfig(raw = {}) {
  return {
    /* ── Entity sensors ────────────────────────────────────── */
    entity:             raw.entity             || null,   // (required) main production sensor
    daily_entity:       raw.daily_entity       || null,   // daily kWh accumulator
    secondary_entity:   raw.secondary_entity   || null,   // any extra sensor (yield %, temp …)
    secondary_label:    raw.secondary_label    || null,   // label shown above secondary value
    secondary_unit:     raw.secondary_unit     || null,   // unit appended after secondary value
    forecast_entity:    raw.forecast_entity    || null,   // solar forecast sensor
    forecast_unit:      raw.forecast_unit      ?? 'W',    // forecast sensor unit: 'W' | 'kW'
    luminosity_entity:  raw.luminosity_entity  || null,   // lux sensor for automatic night detect
    weather_entity:     raw.weather_entity     || null,   // weather.* entity for badge icons

    /* ── Tap / Hold / Double-tap actions (HA standard spec) ── */
    tap_action:         raw.tap_action         || { action: 'more-info' },
    hold_action:        raw.hold_action        || { action: 'more-info' },
    double_tap_action:  raw.double_tap_action  || { action: 'none' },

    /* ── Display options ───────────────────────────────────── */
    name:               raw.name               || null,   // card title (header)
    max_power:          raw.max_power          ?? 5000,   // system peak power in W
    unit:               'W',                              // (internal) always normalised to W
    input_unit:         raw.input_unit         ?? 'W',    // sensor unit: 'W' | 'kW'
    decimal_places:     raw.decimal_places     ?? 0,      // decimal digits for power display
    animation_speed:    raw.animation_speed    ?? 1,      // cell pulse speed multiplier
    night_threshold:    raw.night_threshold    ?? 10,     // lux below this → night mode

    /* ── Production threshold ──────────────────────────────── */
    // When set, a horizontal dashed line is drawn on the sparkline
    // and the main value text changes colour when below threshold.
    production_threshold: raw.production_threshold ?? null, // watts (null = disabled)

    /* ── Feature toggles ───────────────────────────────────── */
    show_history:       raw.show_history       ?? true,
    show_efficiency:    raw.show_efficiency    ?? true,
    glow_effect:        raw.glow_effect        ?? true,
    reduce_animations:  raw.reduce_animations  ?? IS_LOW_POWER,  // auto-enable on iPad/mobile

    /* ── Typography & Text Colors ─────────────────────────────── */
    color_efficiency_text:     raw.color_efficiency_text     || null,  // efficiency % text
    color_mini_values_text:    raw.color_mini_values_text    || null,  // TODAY/FORECAST text
    color_sparkline_stats_text: raw.color_sparkline_stats_text || null, // min/avg/max labels
    efficiency_font_weight:    raw.efficiency_font_weight    ?? 700,   // bold/normal
    label_font_weight:         raw.label_font_weight         ?? 400,   // label font weight
    text_shadow_blur:          raw.text_shadow_blur          ?? 0,     // extra blur (px)

    /* ── Cyberpunk / Neo-Tokyo mode ────────────────────────── */
    cyberpunk_mode:     raw.cyberpunk_mode     ?? false,
    neon_glow:          raw.neon_glow          ?? false,  // legacy — kept for back-compat
    neon_panel_glow:    raw.neon_panel_glow    ?? (raw.neon_glow ?? false), // panel drop-shadow
    neon_text_glow:     raw.neon_text_glow     ?? (raw.neon_glow ?? false), // value text-shadow
    neon_card_glow:     raw.neon_card_glow     ?? (raw.neon_glow ?? false), // card box-shadow
    neon_icon_glow:     raw.neon_icon_glow     ?? (raw.neon_glow ?? false), // header icon glow
    neon_title_glow:    raw.neon_title_glow    ?? (raw.neon_glow ?? false), // title text glow
    neon_bar_glow:      raw.neon_bar_glow      ?? (raw.neon_glow ?? false), // efficiency bar glow
    neon_badge_glow:    raw.neon_badge_glow    ?? (raw.neon_glow ?? false), // efficiency badge glow
    neon_mini_glow:     raw.neon_mini_glow     ?? (raw.neon_glow ?? false), // mini header values glow
    neon_saturation:    raw.neon_saturation    ?? 60,     // glow intensity 0–100

    /* ── Typography ────────────────────────────────────────── */
    font_size:          raw.font_size          ?? 'medium', // small | medium | large
    header_font_size:   raw.header_font_size   ?? 15,        // px (anciennement small|medium|large)
    title_font_family:  raw.title_font_family  || null,     // optional header title font
    title_shadow:       raw.title_shadow       || null,     // custom text-shadow on title
    icon_size:          raw.icon_size          ?? 22,       // header icon size (px)

    /* ── Colors (null = inherit from HA theme) ─────────────── */
    color_primary:      raw.color_primary      || null,
    color_hot:          raw.color_hot          || null,
    color_mid:          raw.color_mid          || null,
    color_cold:         raw.color_cold         || null,
    color_text:         raw.color_text         || null,
    color_title:        raw.color_title        || null,   // title text colour override
    color_icon:         raw.color_icon         || null,
    color_badge:        raw.color_badge        || null,
    color_neon_glow:    raw.color_neon_glow    || null,
  };
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 2 — Utility Helpers
// ═══════════════════════════════════════════════════════════════

/** Cache for CSS custom-property lookups (refreshed every 30 s). */
let _cssCache = {};
let _cssCacheTs = 0;

/**
 * Read a CSS custom-property from the document root, with caching.
 * @param {string} name     - CSS variable name, e.g. '--primary-color'.
 * @param {string} fallback - Value returned when the variable is unset.
 * @returns {string}
 */
function cssVar(name, fallback) {
  const now = Date.now();
  if (now - _cssCacheTs > 30000) { _cssCache = {}; _cssCacheTs = now; }
  if (_cssCache[name] !== undefined) return _cssCache[name];
  if (typeof getComputedStyle !== 'undefined') {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
    if (v) return (_cssCache[name] = v);
  }
  return (_cssCache[name] = fallback);
}

/** Clamp a number between lo and hi (inclusive). */
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/** Auto-incrementing ID generator for unique SVG element IDs. */
let _uid = 0;
function uid() { return 'nsc' + (++_uid); }

/**
 * Convert a hex colour string (#RRGGBB) to an [R, G, B] array.
 * @param {string} h - Hex colour, e.g. '#FF6B35'.
 * @returns {number[]}
 */
function hex2rgb(h) {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

/**
 * Three-stop linear colour interpolation (cold → mid → hot).
 * @param {number} t    - Normalised value [0 … 1].
 * @param {string} cold - Hex colour at t = 0.
 * @param {string} mid  - Hex colour at t = 0.5.
 * @param {string} hot  - Hex colour at t = 1.
 * @returns {string} CSS rgb() string.
 */
function lerpColor(t, cold, mid, hot) {
  const [c1, c2] = t < 0.5
    ? [hex2rgb(cold), hex2rgb(mid)]
    : [hex2rgb(mid),  hex2rgb(hot)];
  const s = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  return `rgb(${Math.round(c1[0] + (c2[0] - c1[0]) * s)},` +
             `${Math.round(c1[1] + (c2[1] - c1[1]) * s)},` +
             `${Math.round(c1[2] + (c2[2] - c1[2]) * s)})`;
}

/**
 * Format a watt value for display.  Values >= 1000 W are shown in kW.
 * @param {number} w   - Power in watts.
 * @param {string} unit - Base unit label.
 * @param {number} dec  - Decimal places.
 * @returns {string}
 */
function fmtPower(w, unit = 'W', dec = 0) {
  if (unit === 'W' && w >= 1000) return (w / 1000).toFixed(1) + ' kW';
  return w.toFixed(dec) + ' ' + unit;
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 3 — MDI Icon SVG Paths
// ═══════════════════════════════════════════════════════════════
// Embedded Material-Design-Icon path data so we don't depend on
// external icon fonts.  Allocated once at module scope.

const MDI_SUN  = 'M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z';
const MDI_MOON = 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,3.93L13.5,1L14.56,3.93L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.9L18.5,9L19.19,10.9L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.33 6.2,9.53 6.04,6.7C3.23,9.86 3.24,14.63 6.15,17.83C9.07,21.04 13.8,21.14 17.33,17.97Z';

/**
 * Mapping of HA weather states → MDI SVG path data.
 * Aliases at the bottom handle alternative state names.
 */
const WEATHER_ICONS = {
  'sunny':            MDI_SUN,
  'clear-night':      MDI_MOON,
  'partlycloudy':     'M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z',
  'cloudy':           'M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z',
  'rainy':            'M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03Z',
  'pouring':          'M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z',
  'snowy':            'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.85 14,14.38L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.15 10,21.62L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z',
  'windy':            'M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M5,12H19A3,3 0 0,1 22,15A3,3 0 0,1 19,18C18.17,18 17.42,17.66 16.88,17.12C16.5,16.73 16.5,16.1 16.88,15.71C17.27,15.32 17.9,15.32 18.29,15.71C18.47,15.89 18.72,16 19,16A1,1 0 0,0 20,15A1,1 0 0,0 19,14H4A1,1 0 0,1 3,13A1,1 0 0,1 4,12H5Z',
  'fog':              'M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9A4,4 0 0,1 23,13A4,4 0 0,1 19,17V15A2,2 0 0,0 21,13A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12H1Z',
  'hail':             'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A1,1 0 0,1 11,19A1,1 0 0,1 10,20A1,1 0 0,1 9,19A1,1 0 0,1 10,18M14,18A1,1 0 0,1 15,19A1,1 0 0,1 14,20A1,1 0 0,1 13,19A1,1 0 0,1 14,18M12,22A1,1 0 0,1 13,23A1,1 0 0,1 12,24A1,1 0 0,1 11,23A1,1 0 0,1 12,22Z',
  'lightning':        'M7,2V13H10V22L17,10H13L17,2H7Z',
  'lightning-rainy':  'M4.5,13.59C3.6,13.08 3,12.11 3,11A3,3 0 0,1 6,8C6.37,8 6.73,8.07 7.06,8.19C7.45,5.82 9.5,4 12,4A5,5 0 0,1 17,9V10H19A2,2 0 0,1 21,12A2,2 0 0,1 19,14H16.5L13,21L14.5,14H11L12,10H9.53C9.18,10 8.82,10.08 8.5,10.24L8,11L9,14.5L6.5,14C5.67,13.59 5,12.88 4.5,13.59Z',
  'exceptional':      'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
};

/* Aliases — handle alternative HA weather state names */
WEATHER_ICONS['partly-cloudy']  = WEATHER_ICONS['partlycloudy'];
WEATHER_ICONS['partly_cloudy']  = WEATHER_ICONS['partlycloudy'];
WEATHER_ICONS['clear']          = MDI_SUN;
WEATHER_ICONS['clear_night']    = MDI_MOON;
WEATHER_ICONS['thunderstorm']   = WEATHER_ICONS['lightning'];
WEATHER_ICONS['snow']           = WEATHER_ICONS['snowy'];
WEATHER_ICONS['rain']           = WEATHER_ICONS['rainy'];
WEATHER_ICONS['wind']           = WEATHER_ICONS['windy'];
WEATHER_ICONS['mist']           = WEATHER_ICONS['fog'];
WEATHER_ICONS['tornado']        = WEATHER_ICONS['exceptional'];
WEATHER_ICONS['hurricane']      = WEATHER_ICONS['exceptional'];

// ═══════════════════════════════════════════════════════════════
//  SECTION 4 — Solar Panel Geometry
// ═══════════════════════════════════════════════════════════════
// 24 modules arranged in 4 rows of 6, each split into 2 sub-cells
// → 48 individually-animatable rectangles for the panel SVG.

// Géométrie v2 — HOMOGRAPHIE : le panneau est une grille unitaire 6×4
// (u → colonnes, v → profondeur, v=0 avant / v=1 arrière) projetée en vraie
// perspective. Les colonnes convergent vers le point de fuite et les rangées
// se compressent vers l'arrière automatiquement (division perspective).
// Plus aucune coordonnée de cellule codée à la main.

const PANEL_PERSP = 0.11;    // resserrement du bord arrière (0.05 ≈ ancien trapèze)
const CELL_GAP_U  = 0.003;   // espace inter-colonnes — quasi un trait
const CELL_GAP_V  = 0.004;   // espace inter-rangées
const CELL_SUB    = 0.475;   // hauteur d'une sous-cellule (fraction du module)

/* Homographie carré unité → quadrilatère (closed form) */
function _homography([x0,y0],[x1,y1],[x2,y2],[x3,y3]) {
  const sx=x0-x1+x2-x3, sy=y0-y1+y2-y3;
  const dx1=x1-x2, dx2=x3-x2, dy1=y1-y2, dy2=y3-y2;
  const den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-sy*dx2)/den, h=(sy*dx1-sx*dy1)/den;
  const a=x1-x0+g*x1, b=x3-x0+h*x3, c=x0;
  const d=y1-y0+g*y1, e=y3-y0+h*y3, f=y0;
  return (u,v)=>{ const w=g*u+h*v+1; return [(a*u+b*v+c)/w, (d*u+e*v+f)/w]; };
}

const PANEL_INS = 364 * PANEL_PERSP;
/* Quadrilatère EXTÉRIEUR du panneau (cadre compris). Tout le reste — surface,
 * cellules, busbars, lèvre — vit dans le même plan : marges et grille sont
 * définies en UV puis projetées par LA MÊME homographie, donc le cadre se
 * compresse avec la distance comme les cellules (épais devant, fin derrière). */
const PANEL_OF = [[10,160],[390,160],[370-PANEL_INS,20],[30+PANEL_INS,20]];
const PANEL_M  = _homography(PANEL_OF[0], PANEL_OF[1], PANEL_OF[2], PANEL_OF[3]);

const FRAME_MU = 0.022;   // marge du cadre en u (≈35 mm réels)
const FRAME_MV = 0.045;   // marge du cadre en v (plan moins profond que large)

const _pfx = n => n.toFixed(1);
function _pquad(u0,v0,u1,v1) {
  const A=PANEL_M(u0,v0), B=PANEL_M(u1,v0), C=PANEL_M(u1,v1), D=PANEL_M(u0,v1);
  return 'M'+_pfx(A[0])+' '+_pfx(A[1])+'L'+_pfx(B[0])+' '+_pfx(B[1])+
         'L'+_pfx(C[0])+' '+_pfx(C[1])+'L'+_pfx(D[0])+' '+_pfx(D[1])+'Z';
}
const PANEL_FRAME   = _pquad(0, 0, 1, 1);
const PANEL_SURFACE = _pquad(FRAME_MU, FRAME_MV, 1-FRAME_MU, 1-FRAME_MV);
const PANEL_LIP     = _pquad(0, 0, 1, FRAME_MV*0.5);   // tranche avant éclairée

/* helpers grille : UV de la zone cellules */
const _gu = f => FRAME_MU + (1-2*FRAME_MU)*f;
const _gv = f => FRAME_MV + (1-2*FRAME_MV)*f;

/* 48 sous-cellules dans l'ordre data-ci historique : modules en row-major
 * depuis la rangée ARRIÈRE, sous-cellule haute (pair) puis basse (impair). */
const PANEL_CELLS = (() => {
  const out = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const u0 = _gu(c/6 + CELL_GAP_U), u1 = _gu((c+1)/6 - CELL_GAP_U);
      const vTop = _gv(1 - r/4 - CELL_GAP_V);   // r=0 = rangée arrière
      const vBot = _gv(1 - (r+1)/4 + CELL_GAP_V);
      const vh = vTop - vBot;
      out.push(_pquad(u0, vTop - vh*CELL_SUB, u1, vTop));   // sous-cellule haute
      out.push(_pquad(u0, vBot, u1, vBot + vh*CELL_SUB));   // sous-cellule basse
    }
  }
  return out;
})();

/* Busbars : 2 traits par colonne, projetés dans la perspective */
const PANEL_BUSBARS = (() => {
  let s = '';
  for (let c = 0; c < 6; c++) for (let k = 1; k <= 2; k++) {
    const u = _gu(c/6 + k/18);
    const A = PANEL_M(u, _gv(0.02)), B = PANEL_M(u, _gv(0.98));
    s += `<line x1="${_pfx(A[0])}" y1="${_pfx(A[1])}" x2="${_pfx(B[0])}" y2="${_pfx(B[1])}" stroke="#000" stroke-opacity="0.30" stroke-width="0.6"/>`;
  }
  return s;
})();

// ═══════════════════════════════════════════════════════════════
//  SECTION 5 — Panel SVG Builder
// ═══════════════════════════════════════════════════════════════

/**
 * Generate the static SVG skeleton for the solar-panel graphic.
 * Cellules en <path data-ci> projetées par homographie — l'API runtime
 * (_patchCells : attributs fill/opacity + classe .cell-on) est inchangée.
 *
 * @param {string} id   - Unique prefix for SVG element IDs.
 * @param {string} cold - Hex colour used as the "off" cell base.
 * @returns {string} SVG markup string.
 */
function buildPanelSkeleton(id, cold) {
  const cells = PANEL_CELLS.map((d, ci) => {
    const mod = Math.floor(ci / 2);
    const delay = (mod * 0.07 + (ci % 2) * 0.035).toFixed(2);
    return `<path data-ci="${ci}" d="${d}" fill="${cold}" opacity="0.07" style="animation-delay:${delay}s"/>`;
  }).join('\n');

  const [bA, bB] = [PANEL_M(FRAME_MU,1-FRAME_MV), PANEL_M(1-FRAME_MU,1-FRAME_MV)];
  const [fA, fB] = [PANEL_M(FRAME_MU,FRAME_MV),   PANEL_M(1-FRAME_MU,FRAME_MV)];

  return `<svg id="${id}-svg" viewBox="0 0 400 180" width="100%"
    preserveAspectRatio="xMidYMid meet" style="display:block"
    shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#141a24"/>
      <stop offset="45%"  stop-color="#080b11"/>
      <stop offset="100%" stop-color="#030407"/>
    </linearGradient>
    <linearGradient id="${id}-glare" x1="0%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${id}-shg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"   stop-color="#ffffff" stop-opacity="0"/>
      <stop offset=".45" stop-color="#cfeaff" stop-opacity=".14"/>
      <stop offset=".55" stop-color="#ffffff" stop-opacity=".20"/>
      <stop offset=".65" stop-color="#cfeaff" stop-opacity=".12"/>
      <stop offset="1"   stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-clip"><path d="${PANEL_SURFACE}"/></clipPath>
  </defs>
  <!-- Cadre alu — même plan que les cellules (se compresse avec la distance) -->
  <path d="${PANEL_FRAME}" fill="#04050a"/>
  <path d="${PANEL_LIP}" fill="#1c2028"/>
  <!-- Surface vitrée (reflet de ciel) -->
  <path d="${PANEL_SURFACE}" fill="url(#${id}-bg)"/>
  <!-- Animated cells -->
  <g id="${id}-cells">${cells}</g>
  <!-- Busbars -->
  ${PANEL_BUSBARS}
  <!-- Glare overlay -->
  <path d="${PANEL_SURFACE}" fill="url(#${id}-glare)" pointer-events="none"/>
  <!-- Sheen animé (balayage de la vitre) -->
  <g clip-path="url(#${id}-clip)" pointer-events="none">
    <g class="panel-sheen"><rect x="-20" y="10" width="130" height="160" fill="url(#${id}-shg)" transform="skewX(-18)"/></g>
  </g>
  <!-- Liserés spéculaires -->
  <line x1="${_pfx(bA[0])}" y1="${_pfx(bA[1])}" x2="${_pfx(bB[0])}" y2="${_pfx(bB[1])}" stroke="#9fc8e8" stroke-width="0.7" stroke-opacity="0.5"/>
  <line x1="${_pfx(fA[0])}" y1="${_pfx(fA[1])}" x2="${_pfx(fB[0])}" y2="${_pfx(fB[1])}" stroke="#ffffff" stroke-width="0.6" stroke-opacity="0.25"/>
  <!-- Night-mode tint overlay (opacity toggled in JS) -->
  <path id="${id}-night" d="${PANEL_SURFACE}"
    fill="#000820" opacity="0" pointer-events="none"/>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 6 — Sparkline Builder (with threshold & forecast)
// ═══════════════════════════════════════════════════════════════

/**
 * Build the 24-hour sparkline SVG with an optional forecast ghost
 * line and an optional production-threshold indicator.
 *
 * The production curve and forecast curve are each normalised to
 * their own Y-scale so both always fill the chart height — the
 * ghost line shows trend shape, not amplitude comparison.
 *
 * @param {number[]}    history         - Production values (watts).
 * @param {Object}      colors          - Resolved colour palette.
 * @param {string}      unit            - Display unit.
 * @param {number}      dec             - Decimal places.
 * @param {number[]}    historyForecast - Forecast values (optional).
 * @param {number|null} threshold       - Production threshold in W (optional).
 * @returns {string} SVG markup string.
 */
function buildSparkline(history, colors, unit, dec, historyForecast = [], threshold = null) {
  if (!history || history.length < 2) return '';

  const { primary, hot, cold, mid } = colors;
  const W  = 360;   // SVG width
  const H  = 36;    // chart height
  const PY = 10;    // top padding

  /* ── Compute min / max / avg of production history ────── */
  let hMin = Infinity, hMax = -Infinity, hSum = 0;
  for (let i = 0; i < history.length; i++) {
    const v = history[i];
    if (v < hMin) hMin = v;
    if (v > hMax) hMax = v;
    hSum += v;
  }

  const hasFcast = historyForecast && historyForecast.length > 1;
  const hRange   = Math.max(hMax - hMin, 0.1);
  const n        = history.length - 1;

  /* ── Y-mapping for production (own scale) ─────────────── */
  const toY = v => PY + Math.round(H * (1 - (v - hMin) / hRange));

  /* ── Production bezier path ───────────────────────────── */
  const pts = history.map((v, i) => ({
    x: Math.round((i / n) * W),
    y: toY(v),
  }));
  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i].x - pts[i - 1].x) * 0.38;
    line += ` C ${(pts[i - 1].x + cp).toFixed(1)} ${pts[i - 1].y},`
          + ` ${(pts[i].x - cp).toFixed(1)} ${pts[i].y},`
          + ` ${pts[i].x} ${pts[i].y}`;
  }

  const fill = `${line} L ${W} ${PY + H} L 0 ${PY + H} Z`;
  const sid  = uid();  // gradient ID
  const gid  = uid();  // ghost glow filter ID

  /* Ghost colour: use `mid` — cyan in cyberpunk, gold in normal */
  const ghostColor = mid;

  /* ── Forecast ghost bezier (independent Y-scale) ──────── */
  let ghostLine = '';
  if (hasFcast) {
    const nf = historyForecast.length - 1;
    let fMin = Infinity, fMax = -Infinity;
    for (const v of historyForecast) {
      if (v < fMin) fMin = v;
      if (v > fMax) fMax = v;
    }
    const fRange = Math.max(fMax - fMin, 0.1);
    const toYf   = v => PY + Math.round(H * (1 - (v - fMin) / fRange));
    const fpts   = historyForecast.map((v, i) => ({
      x: Math.round((i / nf) * W),
      y: toYf(v),
    }));
    ghostLine = `M ${fpts[0].x} ${fpts[0].y}`;
    for (let i = 1; i < fpts.length; i++) {
      const cp = (fpts[i].x - fpts[i - 1].x) * 0.38;
      ghostLine += ` C ${(fpts[i - 1].x + cp).toFixed(1)} ${fpts[i - 1].y},`
                 + ` ${(fpts[i].x - cp).toFixed(1)} ${fpts[i].y},`
                 + ` ${fpts[i].x} ${fpts[i].y}`;
    }
  }

  /* ── Threshold horizontal dashed line ─────────────────── */
  let thresholdMarkup = '';
  if (threshold !== null && threshold > 0) {
    // Map threshold W value to Y coordinate using production scale
    const threshY     = clamp(toY(threshold), PY, PY + H);
    const threshLabel = fmtPower(threshold, 'W', 0);
    thresholdMarkup = `
    <!-- Production threshold line -->
    <line x1="0" y1="${threshY}" x2="${W}" y2="${threshY}"
      stroke="${cold}" stroke-width="1" stroke-dasharray="6 4"
      opacity="0.55"/>
    <text x="${W - 2}" y="${threshY - 3}"
      font-family="Rajdhani,monospace" font-size="7" fill="${cold}"
      opacity="0.7" text-anchor="end"
      letter-spacing="0.5">THRESHOLD ${threshLabel}</text>`;
  }

  return `<svg viewBox="0 0 ${W} ${PY + H + 22}" width="100%"
    preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible"
    shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${sid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${hot}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${hot}" stop-opacity="0.02"/>
    </linearGradient>
    ${hasFcast ? `<filter id="${gid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>` : ''}
  </defs>
  <!-- Production area fill -->
  <path d="${fill}" fill="url(#${sid})"/>
  <!-- Production line -->
  <path d="${line}" fill="none" stroke="${hot}" stroke-width="2" stroke-linecap="round"/>
  ${ghostLine ? `<!-- Forecast ghost line -->
  <path d="${ghostLine}" fill="none" stroke="${ghostColor}" stroke-width="1.5"
    stroke-linecap="round" stroke-dasharray="4 3" opacity="0.45"
    filter="url(#${gid})"/>` : ''}
  ${thresholdMarkup}
  <!-- Baseline -->
  <line x1="0" y1="${PY + H}" x2="${W}" y2="${PY + H}"
    stroke="${primary}" stroke-width="0.5" opacity="0.2"/>
  <!-- Time axis labels -->
  <g font-family="Rajdhani,monospace" fill="${primary}" opacity="0.4" font-size="8" text-anchor="middle">
    <text x="0"           y="${PY + H + 15}">T-24</text>
    <text x="${W * 0.25}" y="${PY + H + 15}">T-18</text>
    <text x="${W * 0.5}"  y="${PY + H + 15}">T-12</text>
    <text x="${W * 0.75}" y="${PY + H + 15}">T-6</text>
    <text x="${W}"        y="${PY + H + 15}" font-weight="700" opacity="0.75">NOW</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 7 — UI Labels
// ═══════════════════════════════════════════════════════════════

const LABELS = {
  entities:      'Entities',
  display:       'Display',
  colors:        'Colors',
  advanced:      'Advanced',
  entity:        'Production entity (W) *',
  daily:         'Daily production (kWh)',
  secondary:     'Secondary sensor',
  secLabel:      'Secondary label',
  secUnit:       'Secondary unit',
  forecast:      'Solar forecast',
  forecastUnit:  'Forecast unit',
  lux:           'Luminosity sensor (lux)',
  weather:       'Weather entity',
  name:          'Name / title',
  inputUnit:     'Sensor unit',
  maxPower:      'Max power (W)',
  dec:           'Decimal places',
  speed:         'Animation speed',
  nightLux:      'Night threshold (lux)',
  threshold:     'Production threshold (W)',
  thresholdHint: 'Threshold line on sparkline & colour alert',
  history:       '24h history',
  efficiency:    'Show efficiency',
  glow:          'Glow effect',
  reduceAnim:    'Reduce animations (iPad/mobile)',
  colorEffText:  'Efficiency % text color',
  colorMiniText: 'Mini values text color',
  colorStatsText: 'Sparkline stats text color',
  effFontWt:     'Efficiency font weight',
  labelFontWt:   'Label font weight',
  textShadowBlur: 'Extra text shadow blur (px)',
  cyberpunk:     'Neo Tokyo Mode',
  neonPanelGlow: 'Panel glow',
  neonTextGlow:  'Value text glow',
  neonCardGlow:  'Card shadow glow',
  neonIconGlow:  'Icon glow',
  neonTitleGlow: 'Title glow',
  neonBarGlow:   'Efficiency bar glow',
  neonBadgeGlow: 'Efficiency badge glow',
  neonMiniGlow:  'Mini values glow',
  neonSat:       'Glow saturation (0–100)',
  fontSize:      'Value font size',
  headerFontSize:'Header font size',
  titleFont:     'Title font family',
  colorPrimary:  'Primary color',
  colorCold:     'Cold (min)',
  colorMid:      'Mid',
  colorHot:      'Hot (max)',
  colorIcon:     'Icon color',
  colorBadge:    'Badge color',
  colorTitle:    'Title text color',
  colorNeonGlow: 'Neon glow color',
  small:         'Small',
  medium:        'Medium',
  large:         'Large',
};

const TITLE_FONT_OPTIONS = [
  'Rajdhani',
  'Orbitron',
  'Exo 2',
  'Space Grotesk',
  'Montserrat',
  'Oswald',
  'Bebas Neue',
  'Poppins',
  'Inter',
  'Roboto',
  'Arial',
  'Georgia',
  'Courier New',
];

/**
 * Return the correct label set based on the browser language.
 * @returns {Object} Label dictionary (fr or en).
 */
function T() { return LABELS; }

// ═══════════════════════════════════════════════════════════════
//  SECTION 8 — Visual Editor (config UI)
//  Template unifié (cf CARDS-EDITOR-TEMPLATE.md).
//  N'éditer QUE _schema() ; le reste est canonique et identique partout.
// ═══════════════════════════════════════════════════════════════

class NeonSolarCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  // ── Cycle de vie (NE PAS toucher) ──────────────────────────────────
  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  set hass(h) { this._hass = h; this._fillDatalists(); }   // JAMAIS de render ici
  disconnectedCallback() { this._rendered = false; }

  // ── Lecture / écriture config (clés imbriquées via ".") ────────────
  _read(key) {
    return key.includes('.')
      ? key.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), this._config)
      : this._config[key];
  }
  _set(key, value) {
    const empty = (value === undefined || value === '' || value === null);
    if (key.includes('.')) {
      const parts = key.split('.');
      let o = this._config;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!o[parts[i]] || typeof o[parts[i]] !== 'object') o[parts[i]] = {};
        o = o[parts[i]];
      }
      const last = parts[parts.length - 1];
      if (empty) delete o[last]; else o[last] = value;
      const parent = parts.slice(0, -1).reduce((a, k) => a && a[k], this._config);
      if (parent && typeof parent === 'object' && !Object.keys(parent).length) delete this._config[parts[0]];
    } else if (empty) { delete this._config[key]; }
    else { this._config[key] = value; }
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
  }

  // ── Sync in-place (guard focus + clés imbriquées) ──────────────────
  _syncValues() {
    const active = this.querySelector(':focus') || document.activeElement;
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el === active) return;
      const v = this._read(el.dataset.key);
      if (el.type === 'checkbox') el.checked = el.dataset.defaultOn ? (v !== false) : !!v;
      else {
        el.value = (v == null ? '' : v);
        if (el._pick) el._pick.value = this._toHex(el.value) || (el._cssDefault ? this._resolveColor(el._cssDefault) : null) || '#6200EA';
      }
    });
    this._bindIconPreviews(true);
  }

  // ── Helpers de champ (signatures FIXES — ne pas réinventer) ────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); return d; }

  _text(key, label, ph = '') {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    row.wrap.appendChild(inp); return inp;
  }

  _number(key, label, { min, max, step = 1, ph = '' } = {}) {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'number'; if (min != null) inp.min = min; if (max != null) inp.max = max;
    inp.step = step; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => { const n = parseFloat(inp.value); this._set(key, isNaN(n) ? undefined : n); });
    row.wrap.appendChild(inp); return inp;
  }

  _toggle(key, label, defaultOn = false) {
    const row = this._row(label);
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.dataset.key = key;
    if (defaultOn) cb.dataset.defaultOn = '1';
    const v = this._read(key);
    cb.checked = defaultOn ? (v !== false) : !!v;
    cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
    cb.addEventListener('change', () => this._set(key, cb.checked));
    row.wrap.appendChild(cb); return cb;
  }

  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
    const row = this._row(label);
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key;
    txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    txt._pick = pick; txt._cssDefault = cssDefault;
    const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA'; };
    txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
    pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
    box.appendChild(txt); box.appendChild(pick); row.wrap.appendChild(box); refresh(); return txt;
  }

  _resolveColor(css) {
    try {
      const probe = document.createElement('span');
      probe.style.cssText = `color:${css};position:absolute;left:-9999px;top:-9999px`;
      this.appendChild(probe);
      const rgb = getComputedStyle(probe).color; probe.remove();
      const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
      return m ? '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') : null;
    } catch { return null; }
  }

  _icon(key, label) {
    const row = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true);
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
    inp.addEventListener('input', () => this._set(key, inp.value));
    box.appendChild(inp); box.appendChild(prev); row.wrap.appendChild(box); return inp;
  }

  _entity(key, label, prefix = '') {
    const row = this._row(label);
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `nsc-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value.trim()));
    row.wrap.appendChild(inp); return inp;
  }

  _select(key, label, options, emptyLabel = null) {
    const w = this._row(label).wrap;
    const sel = document.createElement('select'); sel.dataset.key = key;
    if (emptyLabel !== null) { const o = document.createElement('option'); o.value = ''; o.textContent = emptyLabel; sel.appendChild(o); }
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = (typeof opt === 'object') ? opt.value : opt;
      o.textContent = (typeof opt === 'object') ? opt.label : opt;
      sel.appendChild(o);
    });
    sel.value = this._read(key) ?? '';
    sel.addEventListener('change', () => this._set(key, sel.value));
    w.appendChild(sel); return sel;
  }

  // ── Mécanique commune (NE PAS toucher) ─────────────────────────────
  _row(labelHtml, isHtml = false) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label');
    if (isHtml) lbl.innerHTML = labelHtml; else lbl.textContent = labelHtml;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    row.appendChild(lbl); row.appendChild(wrap); this.appendChild(row);
    return { row, wrap };
  }

  _toHex(c) {
    if (!c) return null;
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    const m = c.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    return m ? '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') : null;
  }

  _bindIconPreviews(resyncOnly = false) {
    this.querySelectorAll('.icon-preview[data-preview]').forEach(prev => {
      const inp = this.querySelector(`input[data-key="${prev.dataset.preview}"]`);
      const upd = () => {
        const val = (inp && inp.value || '').trim();
        prev.innerHTML = '';
        if (/^mdi:[a-zA-Z0-9_-]+$/.test(val)) {
          const ico = document.createElement('ha-icon');
          ico.setAttribute('icon', val); ico.style.cssText = '--mdc-icon-size:20px';
          prev.appendChild(ico);
        }
      };
      if (!resyncOnly && inp && !inp._previewBound) { inp.addEventListener('input', upd); inp._previewBound = true; }
      upd();
    });
  }

  _fillDatalists() {
    if (!this._hass) return;
    this.querySelectorAll('input[data-prefix]').forEach(inp => {
      const id = inp.getAttribute('list'); if (!id) return;
      let dl = this.querySelector('#' + id);
      if (!dl) { dl = document.createElement('datalist'); dl.id = id; this.appendChild(dl); }
      const ids = Object.keys(this._hass.states).filter(e => e.startsWith(inp.dataset.prefix || '')).sort();
      if (dl.childElementCount === ids.length) return;
      dl.textContent = '';
      const frag = document.createDocumentFragment();
      ids.forEach(id2 => { const o = document.createElement('option'); o.value = id2;
        const fn = this._hass.states[id2].attributes?.friendly_name; if (fn && fn !== id2) o.label = fn; frag.appendChild(o); });
      dl.appendChild(frag);
    });
  }

  // ── CSS commun (identique partout) ─────────────────────────────────
  _css() {
    return `
      :host { display:block; padding:14px; font-family:var(--primary-font-family,Roboto,sans-serif); }
      .sec { font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--divider-color); }
      .sec:first-child { margin-top:0; }
      .row { display:flex;align-items:center;gap:8px;margin-bottom:6px; }
      .row label { flex:0 0 160px;font-size:12px;color:var(--secondary-text-color); }
      .row label .mdi-link { color:var(--primary-color);font-size:9px;text-transform:none;letter-spacing:0; }
      .field-wrap { flex:1;min-width:0;display:flex; }
      input[type=text],input[type=number],select { flex:1;width:100%;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;outline:none;box-sizing:border-box; }
      select { cursor:pointer; }
      input:focus,select:focus { box-shadow:0 0 0 1px var(--primary-color); }
      .color-row { display:flex;gap:8px;flex:1; }
      .color-row input[type=text] { flex:1; }
      .color-row input[type=color] { width:36px;height:28px;flex:none;padding:0;border:none;background:none;border-radius:4px;cursor:pointer; }
      .icon-row { display:flex;gap:8px;flex:1;align-items:center; }
      .icon-row input { flex:1; }
      .icon-preview { width:30px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;border:1px solid var(--divider-color);border-radius:4px;color:var(--primary-text-color); }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 6px 168px; }
    `;
  }

  // ── Render : on vide, on pose le style, on déroule le schéma ────────
  _render() {
    this.innerHTML = '';
    const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
    this._schema();
    this._fillDatalists();
    this._bindIconPreviews();
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  SCHÉMA — LA SEULE PARTIE À ÉCRIRE PAR CARD                     ║
  // ╚════════════════════════════════════════════════════════════════╝
  _schema() {
    const t = T();

    this._section(t.entities);
    this._entity('entity', t.entity, 'sensor');
    this._select('input_unit', t.inputUnit, [['W', 'W — Watts'], ['kW', 'kW — Kilowatts']].map(([v, l]) => ({ value: v, label: l })));
    this._entity('daily_entity', t.daily, 'sensor');
    this._entity('secondary_entity', t.secondary, 'sensor');
    this._text('secondary_label', t.secLabel, 'RENDEMENT');
    this._text('secondary_unit', t.secUnit, '%');
    this._entity('forecast_entity', t.forecast, 'sensor');
    this._select('forecast_unit', t.forecastUnit, [['W', 'W — Watts'], ['kW', 'kW — Kilowatts']].map(([v, l]) => ({ value: v, label: l })));
    this._entity('luminosity_entity', t.lux, 'sensor');
    this._entity('weather_entity', t.weather, 'weather');

    this._section(t.display);
    this._text('name', t.name, 'Production Solaire');
    this._number('max_power', t.maxPower, { min: 100, max: 50000, step: 100, ph: '5000' });
    this._number('decimal_places', t.dec, { min: 0, max: 2, step: 1, ph: '1' });
    this._number('animation_speed', t.speed, { min: 0.1, max: 5, step: 0.1, ph: '1' });
    this._number('night_threshold', t.nightLux, { min: 0, max: 1000, step: 5, ph: '10' });
    this._number('production_threshold', t.threshold, { min: 0, max: 50000, step: 50 });
    this._hint(t.thresholdHint);
    this._select('font_size', t.fontSize, [['small', t.small], ['medium', t.medium], ['large', t.large]].map(([v, l]) => ({ value: v, label: l })));
    this._number('header_font_size', t.headerFontSize, { min: 8, max: 32, step: 1 });
    this._select('title_font_family', t.titleFont, TITLE_FONT_OPTIONS, '— thème HA —');
    this._text('title_shadow', 'Title shadow', '0 0 8px rgba(0,212,255,0.7)');
    this._number('icon_size', 'Icon size (px)', { min: 12, max: 48, step: 1 });
    this._toggle('show_history', t.history, true);
    this._toggle('show_efficiency', t.efficiency, true);
    this._toggle('glow_effect', t.glow, false);
    this._toggle('reduce_animations', t.reduceAnim, false);

    this._section('Typography');
    this._color('color_efficiency_text', t.colorEffText, '#FFD23F');
    this._color('color_mini_values_text', t.colorMiniText, '#ffffff');
    this._color('color_sparkline_stats_text', t.colorStatsText, '#888888');
    this._number('efficiency_font_weight', t.effFontWt, { min: 300, max: 900, step: 100, ph: '600' });
    this._number('label_font_weight', t.labelFontWt, { min: 300, max: 900, step: 100, ph: '600' });
    this._number('text_shadow_blur', t.textShadowBlur, { min: 0, max: 20, step: 1 });

    this._section('GLOW');
    this._toggle('glow_effect', t.glow, false);
    this._color('color_neon_glow', t.colorNeonGlow, '#00E8FF');

    this._section('CYBERPUNK');
    this._toggle('cyberpunk_mode', t.cyberpunk, false);
    this._toggle('neon_panel_glow', t.neonPanelGlow, false);
    this._toggle('neon_text_glow', t.neonTextGlow, false);
    this._toggle('neon_card_glow', t.neonCardGlow, false);
    this._toggle('neon_icon_glow', t.neonIconGlow, false);
    this._toggle('neon_title_glow', t.neonTitleGlow, false);
    this._toggle('neon_bar_glow', t.neonBarGlow, false);
    this._toggle('neon_badge_glow', t.neonBadgeGlow, false);
    this._toggle('neon_mini_glow', t.neonMiniGlow, false);
    this._number('neon_saturation', t.neonSat, { min: 0, max: 100, step: 5, ph: '50' });

    this._section(t.colors);
    this._hint('empty = HA theme — var(--css-var) supported');
    this._color('color_title', t.colorTitle, '#ffffff');
    this._color('color_primary', t.colorPrimary, '#FFD23F');
    this._color('color_cold', t.colorCold, '#00E8FF');
    this._color('color_mid', t.colorMid, '#FFD23F');
    this._color('color_hot', t.colorHot, '#FF6B35');
    this._color('color_icon', t.colorIcon, '#FFD23F');
    this._color('color_badge', t.colorBadge, '#FFD23F');
  }
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 9 — Main Card Element
// ═══════════════════════════════════════════════════════════════

class NeonSolarCard extends HTMLElement {

  /* ── Constructor ─────────────────────────────────────── */

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Previous-value caches for dirty-checking
    this._lastPower    = null;
    this._prevPower    = null;
    this._lastDaily    = null;
    this._lastSec      = null;
    this._lastLux      = null;
    this._lastWeather  = null;
    this._lastForecast = null;
    this._lastRatio    = -1;
    this._lastActive   = 0;
    this._lastGlowKey  = '';
    this._lastEffBand  = -1;

    // Render state
    this._rendered     = false;
    this._svgId        = uid();
    this._config       = null;
    this._hass         = null;
    this._colors       = null;
    this._cachedEls    = null;

    // RAF scheduling
    this._rafId        = 0;
    this._pendingUp    = null;

    // History data (production + forecast)
    this._history         = [];
    this._historyForecast = [];
    this._histFetchTs     = 0;

    // Interaction timers
    this._dblTapTimer  = 0;
    this._holdTimer    = 0;
  }

  /* ── Lifecycle ───────────────────────────────────────── */

  /** Render once when attached so dashboard picker preview can paint without hass updates. */
  connectedCallback() {
    if (this._config && !this._rendered) {
      this._render();
    }
  }

  /** Clean up timers when the element is removed from the DOM. */
  disconnectedCallback() {
    if (this._rafId)       { cancelAnimationFrame(this._rafId); this._rafId = 0; }
    if (this._holdTimer)   { clearTimeout(this._holdTimer);     this._holdTimer = 0; }
    if (this._dblTapTimer) { clearTimeout(this._dblTapTimer);   this._dblTapTimer = 0; }
  }

  /* ── HA integration hooks ────────────────────────────── */

  /** Return the editor custom-element tag for the visual config UI. */
  static getConfigElement() { return document.createElement('neon-solar-card-editor'); }

  /** Provide a stub config used when the card is added via the UI picker. */
  static getStubConfig() {
    return {
      entity:          'sensor.solar_power',
      daily_entity:    'sensor.solar_energy_today',
      name:            'Production Solaire',
      max_power:       5000,
      show_history:    true,
      show_efficiency: true,
    };
  }

  /** Tell HA how many grid rows this card occupies. */
  getCardSize() {
    return this._config?.show_history ? 5 : 3;
  }

  /* ── Configuration ───────────────────────────────────── */

  /**
   * Called by HA whenever the card config changes.
   * Normalises the raw YAML and invalidates caches.
   */
  setConfig(raw) {
    this._config    = buildConfig(raw || {});
    this._colors    = null;   // force palette re-resolve
    this._rendered  = false;
    this._cachedEls = null;
    this._lastActive  = 0;
    this._lastGlowKey = '';
    this._lastEffBand = -1;
    if (this.shadowRoot.firstChild) this._render();
  }

  /**
   * Resolve the colour palette from config + HA theme.
   * Cached until setConfig() invalidates it.
   *
   * @returns {Object} Colour palette: { primary, hot, mid, cold, text, bg }.
   */
  _resolveColors() {
    if (this._colors) return this._colors;
    const c = this._config;

    if (c.cyberpunk_mode) {
      return (this._colors = {
        primary: c.color_primary || '#ff10f0',
        hot:     c.color_hot     || '#ff10f0',
        mid:     c.color_mid     || '#00fff9',
        cold:    c.color_cold    || '#7209b7',
        text:    c.color_text    || '#ffffff',
        bg:      cssVar('--card-background-color', '#0d0d1a'),
      });
    }

    return (this._colors = {
      primary: c.color_primary || cssVar('--primary-color', '#FFD23F'),
      hot:     c.color_hot     || '#FF6B35',
      mid:     c.color_mid     || '#FFD23F',
      cold:    c.color_cold    || '#00E8FF',
      text:    c.color_text    || cssVar('--primary-text-color', '#ffffff'),
      bg:      cssVar('--card-background-color', '#1c1c2e'),
    });
  }

  /* ── hass property setter ────────────────────────────── */
  // Called by HA on *every* state change.  We dirty-check all
  // watched entities and only schedule a DOM update when needed.

  set hass(hass) {
    this._hass = hass;
    const c = this._config;
    if (!c) return;

    // First render
    if (!this._rendered) {
      this._rendered = true;
      this._renderShell();
    }

    if (!c.entity) return;

    const ps = hass.states[c.entity];
    if (!ps) return;

    // Handle unavailable / unknown states gracefully
    const st = ps.state;
    if (st === 'unavailable' || st === 'unknown') {
      this._showUnavailable(st);
      return;
    }
    if (this._unavailable) this._clearUnavailable();

    // Parse and normalise power value to watts
    const rawVal = parseFloat(st);
    if (isNaN(rawVal)) return;
    const power = c.input_unit === 'kW' ? rawVal * 1000 : rawVal;

    // Read auxiliary sensor values
    const daily    = c.daily_entity      && hass.states[c.daily_entity]      ? parseFloat(hass.states[c.daily_entity].state)      : null;
    const sec      = c.secondary_entity  && hass.states[c.secondary_entity]  ? hass.states[c.secondary_entity].state              : null;
    const lux      = c.luminosity_entity && hass.states[c.luminosity_entity] ? parseFloat(hass.states[c.luminosity_entity].state) : null;
    const weather  = c.weather_entity    && hass.states[c.weather_entity]    ? hass.states[c.weather_entity].state                : null;
    const forecastRaw = c.forecast_entity && hass.states[c.forecast_entity]  ? parseFloat(hass.states[c.forecast_entity].state)   : null;
    const forecast    = forecastRaw !== null
      ? (c.forecast_unit === 'kW' ? forecastRaw * 1000 : forecastRaw)
      : null;

    // Dirty-check — skip DOM work if nothing changed
    const pw = this._lastPower === null || Math.abs(power - this._lastPower) >= 1;
    const dw = daily    !== this._lastDaily;
    const sw = sec      !== this._lastSec;
    const lw = lux      !== this._lastLux;
    const ww = weather  !== this._lastWeather;
    const fw = forecast !== this._lastForecast;
    if (!pw && !dw && !sw && !lw && !ww && !fw) return;

    // Store new values
    this._prevPower    = this._lastPower;
    this._lastPower    = power;
    this._lastDaily    = daily;
    this._lastSec      = sec;
    this._lastLux      = lux;
    this._lastWeather  = weather;
    this._lastForecast = forecast;

    // Refresh history every 5 minutes
    const now = Date.now();
    if (now - this._histFetchTs > 5 * 60 * 1000) {
      this._histFetchTs = now;
      this._fetchHistory(c.entity);
    }

    // Schedule a single RAF for DOM updates (coalesces rapid state changes)
    this._pendingUp = { power, daily, sec, lux, weather, forecast };
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0;
        const u = this._pendingUp;
        if (u) { this._pendingUp = null; this._updateDOM(u); }
      });
    }
  }

  /* ── History fetching (production + forecast, parallel) ── */

  /**
   * Fetch 24-hour history for production and (optionally) forecast
   * entities in parallel.
   *
   * @param {string} entityId - Production entity ID.
   */
  async _fetchHistory(entityId) {
    const c = this._config;
    const promises = [this._fetchHistoryEntity(entityId, true)];
    if (c.forecast_entity) {
      promises.push(this._fetchHistoryEntity(c.forecast_entity, false));
    }
    await Promise.all(promises);
    if (this._rendered) this._updateSparkline();
  }

  /**
   * Fetch history for a single entity via the HA REST API.
   * Downsamples to <= 48 points for a lightweight sparkline.
   *
   * @param {string}  entityId     - Entity to fetch.
   * @param {boolean} isProduction - true -> _history; false -> _historyForecast.
   */
  async _fetchHistoryEntity(entityId, isProduction) {
    try {
      const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const data  = await this._hass.callApi('GET',
        `history/period/${start}?filter_entity_id=${entityId}&minimal_response=true&no_attributes=true`
      );
      if (!data?.[0] || data[0].length < 2) return;

      const raw  = data[0].filter(s => !isNaN(parseFloat(s.state)));
      const step = Math.max(1, Math.floor(raw.length / 48));
      const unit = isProduction ? this._config.input_unit : this._config.forecast_unit;
      const toW  = v => unit === 'kW' ? v * 1000 : v;
      const vals = raw
        .filter((_, i) => i % step === 0)
        .slice(-48)
        .map(s => toW(parseFloat(s.state)));

      if (isProduction) this._history = vals;
      else              this._historyForecast = vals;
    } catch (_) {
      /* silent — history is best-effort */
    }
  }

  /* ── Full render (called on config change) ───────────── */

  /** Re-render the complete card shell after a configuration change. */
  _render() {
    if (!this._config) return;
    this._rendered = true;
    this._renderShell();
    if (this._lastPower !== null) {
      this._updateDOM({
        power:    this._lastPower,
        daily:    this._lastDaily,
        sec:      this._lastSec,
        lux:      this._lastLux,
        weather:  this._lastWeather,
        forecast: this._lastForecast,
      });
    }
  }

  /* ── Shell render — builds the full shadow-DOM tree ──── */

  _renderShell() {
    const c         = this._config;
    const col       = this._resolveColors();
    const dur       = (2 / (c.animation_speed || 1)).toFixed(1);
    const id        = this._svgId;
    const reduceAnim = c.reduce_animations ?? IS_LOW_POWER;
    const neonPanelGlow  = c.neon_panel_glow;
    const neonTextGlow   = c.neon_text_glow;
    const neonCardGlow   = c.neon_card_glow;
    const neonIconGlow   = c.neon_icon_glow;
    const neonTitleGlow  = c.neon_title_glow;
    const neonBarGlow    = c.neon_bar_glow;
    const neonBadgeGlow  = c.neon_badge_glow;
    const neonMiniGlow   = c.neon_mini_glow;
    const cyberpunk = c.cyberpunk_mode;
    const iconCol   = c.color_icon || col.primary;
    const neonCol   = c.color_neon_glow || col.primary;
    const sat       = Math.round(Math.min(100, Math.max(0, c.neon_saturation ?? 60)));
    const satHi     = Math.round(sat * 1.33).toString(16).padStart(2, '0'); // ~hi opacity hex
    const satMd     = Math.round(sat).toString(16).padStart(2, '0');         // ~mid opacity hex
    const satLo     = Math.round(sat * 0.47).toString(16).padStart(2, '0'); // ~lo opacity hex
    const titleFont = c.title_font_family
      ? `'${c.title_font_family}', var(--nsc-font)`
      : 'var(--nsc-font)';

    // Font sizes derived from the 'small | medium | large' option
    const valFs  = c.font_size === 'small' ? 24 : c.font_size === 'large' ? 40 : 32;
    const hdrFs  = typeof c.header_font_size === 'number'
      ? c.header_font_size
      : c.header_font_size === 'small' ? 12 : c.header_font_size === 'large' ? 18 : 15;
    const unitFs = Math.max(10, Math.round(valFs * 0.375));

    this.shadowRoot.innerHTML = `<style>
      /* ── Host & Card ──────────────────────────── */
      :host {
        display: block;
        --nsc-font: var(--ha-card-font-family,
          var(--paper-font-common-base,
            var(--primary-font-family, 'Rajdhani, monospace')));
      }
      ha-card {
        padding: 14px 14px 12px;
        box-sizing: border-box;
        cursor: pointer;
        ${reduceAnim ? '' : 'transition: box-shadow 0.45s ease, opacity 0.2s ease;'}
        background: ${col.bg};
        border-radius: var(--ha-card-border-radius, 12px);
        contain: layout style paint;
      }
      ha-card:hover { opacity: 0.92 }

      /* ── Header row ───────────────────────────── */
      .hdr {
        display:flex; align-items:center; gap:10px;
        padding-bottom: 10px; margin-bottom: 10px;
        border-bottom: 1px solid;
        border-image: linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent) 1;
      }
      .hdr-icon {
        width:${c.icon_size}px; height:${c.icon_size}px; color:${iconCol}; flex-shrink:0;
        filter: ${(() => {
          if (neonIconGlow) return `drop-shadow(0 0 6px ${neonCol}) drop-shadow(0 0 14px ${neonCol}${satMd})`;
          if (c.title_shadow) {
            const m = c.title_shadow.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/);
            const sc = m ? m[0] : iconCol;
            return `drop-shadow(0 0 6px ${sc}) drop-shadow(0 0 14px ${sc})`;
          }
          return cyberpunk ? 'none' : `drop-shadow(0 0 5px ${iconCol}90)`;
        })()};
        ${reduceAnim ? '' : 'transition: color 0.4s, filter 0.4s;'}
      }
      .hdr-title {
        flex:1 1 auto; 
        font-size: clamp(14px, 1.5vw, ${hdrFs}px);
        font-family: ${titleFont};
        color:${c.color_title || col.text};
        overflow: visible;
        white-space: nowrap;
        min-width: 0;
        letter-spacing: 0.5px;
		text-shadow: ${c.title_shadow
          ? c.title_shadow
          : neonTitleGlow
            ? `0 1px 2px rgba(0, 0, 0, 0.8), 
               0 0 5px #fff, 
               0 0 10px ${neonCol}, 
               0 0 20px ${neonCol}, 
               0 0 40px ${neonCol}${satMd || '80'}`
            : '1px 1px 2px rgba(0, 0, 0, 0.2)'};
        ${reduceAnim ? '' : 'transition: text-shadow 0.4s;'}
      }
      .hdr-right {
        display:grid; grid-template-columns: auto auto;
        gap:4px 8px; align-items:center;
        justify-items: end;
		    flex-shrink: 0;
      }
      .hdr-mini       { cursor:pointer; text-align:right }
      .hdr-mini-label {
        font-size:10px; font-family:var(--nsc-font);
        margin-left: 5px;
        color:${col.text}; opacity:0.35;
        letter-spacing:0.8px; text-transform:uppercase;
        font-weight: ${c.label_font_weight ?? 400};
      }
      .hdr-mini-value {
        font-size:12px; font-weight:700; font-family:var(--nsc-font);
        color:${c.color_mini_values_text || col.text};
        margin-left: 5px;
        text-shadow: ${neonMiniGlow
          ? `0 0 6px ${neonCol}, 0 0 14px ${neonCol}${satLo}`
          : 'none'};
        ${reduceAnim ? '' : 'transition: text-shadow 0.4s;'}
      }
      .eff-badge {
        font-size:14px; font-weight:${c.efficiency_font_weight ?? 700}; font-family:var(--nsc-font);
        letter-spacing:0.5px;
        text-align:center; margin-top:4px;
        ${reduceAnim ? '' : 'transition: color 0.3s, text-shadow 0.4s;'}
        color: ${c.color_efficiency_text || 'inherit'};
        text-shadow: ${neonBadgeGlow
          ? `0 0 8px ${neonCol}, 0 0 18px ${neonCol}${satMd}`
          : 'none'};
      }
      .eff-badge .eff-label {
        font-weight:700; opacity:0.5; font-size:11px;
        letter-spacing:1px; text-transform:uppercase; margin-right:4px;
      }

      /* ── Solar panel wrapper ──────────────────── */
      .panel-wrap {
        position:relative; margin:0 -4px;
        filter: ${neonPanelGlow
          ? `drop-shadow(0 0 4px ${neonCol}) drop-shadow(0 8px 20px ${neonCol}${satMd})`
          : `drop-shadow(0 8px 18px ${neonCol}${satLo})`};
        ${reduceAnim ? '' : 'transition: filter 0.4s; will-change: filter;'}
        isolation: isolate;
        contain: layout style;
      }

      /* ── Value overlay (centred on panel) ─────── */
      .val-overlay {
        position:absolute; top:50%; left:50%;
        transform:translate3d(-50%,-50%,0);
        text-align:center; pointer-events:none;
		
        contain: layout style;
      }
      .val-main {
        font-size:${valFs}px; font-weight:750;
        font-family:var(--nsc-font); line-height:1;
		letter-spacing: 0.02em;
        color:${col.text};
        ${reduceAnim ? '' : 'transition: color 0.35s;'}
        text-shadow: ${neonTextGlow
          ? `0 0 2px #fff,` +                                          /* tight white core */
            ` 0 0 8px #fff,` +                                         /* soft white bloom */
            ` 0 0 18px ${neonCol},` +                                  /* colour mid-range */
            ` 0 0 42px ${neonCol}${satMd},` +                          /* wide colour corona */
            ` 0 0 80px ${neonCol}${satLo}`                             /* far atmospheric bleed */
          : `0 2px 14px rgba(0,0,0,.85), 0 0 10px ${neonCol}${satLo}`};
      }
      .val-unit {
        font-size:${unitFs}px; font-family:var(--nsc-font);
        color:${col.text}; opacity:0.5; margin-top:2px;
      }

      /* ── Efficiency bar ───────────────────────── */
      .eff-bar-wrap {
        margin:5px 0 8px; height:6px;
        position:relative;
        background:rgba(0,0,0,0.55); border-radius:3px; overflow:hidden;
        box-shadow:inset 0 2px 4px rgba(0,0,0,0.7),
                   inset 0 -1px 2px rgba(255,255,255,0.03),
                   0 0 0 1px ${col.primary}40;
      }
      .eff-bar-wrap::after {
        content:''; position:absolute;
        top:1px; left:2px; right:2px; height:2px;
        border-radius:2px;
        background:linear-gradient(to bottom,rgba(255,255,255,0.14),transparent);
        pointer-events:none; z-index:2;
      }
      .eff-bar {
        position:relative; height:100%; width:0%; border-radius:3px;
        background:linear-gradient(90deg,
          ${col.primary}73 0%,
          ${col.primary} 40%,
          rgba(255,255,255,0.25) 60%,
          ${col.primary}cc 80%,
          ${col.primary}73 100%);
        background-size:250% 100%;
        ${reduceAnim ? '' : 'transition:width 0.65s cubic-bezier(.4,0,.2,1); will-change:width;'}
        box-shadow:${neonBarGlow
          ? `0 0 12px ${neonCol}, 0 0 24px ${neonCol}${satLo}, inset 0 1px 2px rgba(255,255,255,0.2)`
          : 'inset 0 1px 2px rgba(255,255,255,0.2)'};
      }

      /* ── Sparkline section ────────────────────── */
      .spark-section {
        padding-top:8px;
        border-top:1px solid ${col.text}12;
        margin-top:4px;
      }
      .spark-header {
        display:flex; justify-content:space-between;
        align-items:center; margin-bottom:6px;
      }
      .spark-hdr-label {
        font-size:8.5px; font-family:var(--nsc-font);
        letter-spacing:1.5px; color:${col.text};
        opacity:${cyberpunk ? 0.6 : 0.35}; text-transform:uppercase;
      }
      .spark-hdr-right {
        font-size:8.5px; font-family:var(--nsc-font);
        color:${col.mid}; opacity:0.8; letter-spacing:0.5px;
      }
      .spark-stats {
        display:flex; justify-content:space-between; margin-bottom:5px;
      }
      .spark-stat {
        display:flex; flex-direction:column; align-items:center;
      }
      .ss-label {
        font-size:8.5px; font-family:var(--nsc-font);
        color:${c.color_sparkline_stats_text || col.text}; opacity:${cyberpunk ? 0.6 : 0.35};
        letter-spacing:0.5px;
        font-weight: ${c.label_font_weight ?? 400};
      }
      .ss-val {
        font-size:13px; font-weight:700;
        font-family:var(--nsc-font); color:${col.text};
      }
      .ss-val.hot  { color:${col.hot}  }
      .ss-val.cold { color:${cyberpunk ? col.mid : col.cold} }

      /* ── Cell pulse animation ─────────────────── */
      @keyframes solar-pulse {
        0%, 100% { opacity: var(--co, 0.75) }
        50%      { opacity: 1.0 }
      }
      .cell-on {
        animation: ${reduceAnim ? 'none' : `solar-pulse ${dur}s ease-in-out infinite`};
      }
      /* ── Balayage lumineux de la vitre ─────────── */
      @keyframes solar-sheen {
        0%        { transform: translateX(-160px) }
        12%, 100% { transform: translateX(560px) }
      }
      .panel-sheen {
        /* balayage de la vitre : OFF sur iPad/mobile quoi qu'il arrive (priorité device
           sur l'option config — dashboard YAML non modifiable via l'éditeur). */
        animation: ${(reduceAnim || IS_LOW_POWER) ? 'none' : 'solar-sheen 90s ease-in-out infinite'};
        ${(reduceAnim || IS_LOW_POWER) ? '' : 'will-change: transform;'}
      }
    </style>

    <ha-card id="ha-card" role="button" tabindex="0"
      aria-label="${c.name || 'Solar Production'} card">

      <!-- ── Header ──────────────────────────────── -->
      <div class="hdr">
        <svg class="hdr-icon" id="hdr-icon" viewBox="0 0 24 24">
          <path fill="currentColor" id="hdr-icon-path" d="${MDI_SUN}"/>
        </svg>
        <div class="hdr-title">${c.name || 'Production Solaire'}</div>
        <div class="hdr-right">
          ${c.daily_entity ? `
          <div class="hdr-mini" id="hdr-daily" data-entity="${c.daily_entity}">
            <div class="hdr-mini-label">TODAY</div>
            <div class="hdr-mini-value" id="daily-val">-- kWh</div>
          </div>` : ''}
          ${c.secondary_entity ? `
          <div class="hdr-mini" data-entity="${c.secondary_entity}">
            <div class="hdr-mini-label">${(c.secondary_label || 'SENSOR').toUpperCase()}</div>
            <div class="hdr-mini-value"><span id="sec-val">--</span> ${c.secondary_unit || ''}</div>
          </div>` : ''}
          ${c.forecast_entity ? `
          <div class="hdr-mini" data-entity="${c.forecast_entity}">
            <div class="hdr-mini-label">FORECAST</div>
            <div class="hdr-mini-value"><span id="forecast-val">--</span> <span id="forecast-unit">W</span></div>
          </div>` : ''}
        </div>
      </div>

      <!-- ── Solar Panel + overlay ───────────────── -->
      <div class="panel-wrap" id="panel-wrap">
        <div class="cp-tl"></div><div class="cp-br"></div>
        ${buildPanelSkeleton(id, col.cold)}
        <div class="val-overlay">
          <div class="val-main" id="val-main">--</div>
          <div class="val-unit" id="val-unit">${c.unit}</div>
        </div>
      </div>

      <!-- ── Efficiency bar ──────────────────────── -->
      ${c.show_efficiency
        ? `<div class="eff-bar-wrap"><div class="eff-bar" id="eff-bar"></div></div>
           <div class="eff-badge" id="eff-badge"><span class="eff-label">Efficiency</span>-- %</div>`
        : ''}

      <!-- ── Sparkline ───────────────────────────── -->
      ${c.show_history ? `
      <div class="spark-section">
        <div class="spark-header">
          <span class="spark-hdr-label">ANALYSE 24H</span>
          <span class="spark-hdr-right" id="spark-eff">EFF. -- %</span>
        </div>
        <div class="spark-stats">
          <div class="spark-stat">
            <span class="ss-label">MIN</span>
            <span class="ss-val cold" id="sp-min">--</span>
          </div>
          <div class="spark-stat">
            <span class="ss-label">AVG</span>
            <span class="ss-val" id="sp-avg">--</span>
          </div>
          <div class="spark-stat">
            <span class="ss-label">MAX</span>
            <span class="ss-val hot" id="sp-max">--</span>
          </div>
        </div>
        <div id="zone-spark"></div>
      </div>` : ''}
    </ha-card>`;

    /* ── Interaction: Tap / Hold / Double-tap ───────────── */

    const card = this.shadowRoot.querySelector('#ha-card');

    // Hold detection (500 ms threshold)
    card.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      this._holdTimer = setTimeout(() => {
        this._holdTimer = 0;
        this._handleAction('hold_action');
      }, 500);
    }, { passive: true });

    card.addEventListener('pointerup', () => {
      if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = 0; }
    }, { passive: true });

    card.addEventListener('pointercancel', () => {
      if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = 0; }
    }, { passive: true });

    // Click → single tap or double-tap detection
    card.addEventListener('click', () => {
      if (this._holdTimer) return; // hold was triggered, ignore click
      const dblAction = this._config.double_tap_action;
      if (dblAction && dblAction.action !== 'none') {
        if (this._dblTapTimer) {
          clearTimeout(this._dblTapTimer);
          this._dblTapTimer = 0;
          this._handleAction('double_tap_action');
        } else {
          this._dblTapTimer = setTimeout(() => {
            this._dblTapTimer = 0;
            this._handleAction('tap_action');
          }, 250);
        }
      } else {
        this._handleAction('tap_action');
      }
    }, { passive: true });

    // Keyboard accessibility (Enter / Space)
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._handleAction('tap_action');
      }
    });

    // Sub-entity click → open HA more-info dialog
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(el =>
      el.addEventListener('click', e => {
        e.stopPropagation();
        this._moreInfo(el.dataset.entity);
      }, { passive: true })
    );

    this._cacheEls();
  }

  /* ── Cache frequently-accessed DOM elements ──────────── */

  _cacheEls() {
    const sr = this.shadowRoot;
    const id = this._svgId;
    this._cachedEls = {
      haCard:       sr.querySelector('#ha-card'),
      panelWrap:    sr.querySelector('#panel-wrap'),
      iconPath:     sr.querySelector('#hdr-icon-path'),
      hdrIcon:      sr.querySelector('#hdr-icon'),
      valMain:      sr.querySelector('#val-main'),
      valUnit:      sr.querySelector('#val-unit'),
      dailyVal:     sr.querySelector('#daily-val'),
      effBadge:     sr.querySelector('#eff-badge'),
      effBar:       sr.querySelector('#eff-bar'),
      secVal:       sr.querySelector('#sec-val'),
      forecastVal:  sr.querySelector('#forecast-val'),
      forecastUnit: sr.querySelector('#forecast-unit'),

      nightOverlay: sr.querySelector(`#${id}-night`),
      spMin:        sr.querySelector('#sp-min'),
      spAvg:        sr.querySelector('#sp-avg'),
      spMax:        sr.querySelector('#sp-max'),
      spEff:        sr.querySelector('#spark-eff'),
      sparkZone:    sr.querySelector('#zone-spark'),
      cells:        Array.from(sr.querySelectorAll('[data-ci]')),
    };
  }

  /* ── Per-frame DOM update (runs inside requestAnimationFrame) ── */

  _updateDOM(u) {
    if (!this._cachedEls) return;
    const c   = this._config;
    const col = this._resolveColors();
    const { power, daily, sec, lux, weather, forecast } = u;
    const ratio = clamp(power / Math.max(c.max_power, 1), 0, 1);
    const valFs = c.font_size === 'small' ? 24 : c.font_size === 'large' ? 40 : 32;

    /* ── Value — always in W ──────────────────── */
    if (this._cachedEls.valMain || this._cachedEls.valUnit) {
      if (this._cachedEls.valMain) this._cachedEls.valMain.textContent = Math.round(power);
      if (this._cachedEls.valUnit) this._cachedEls.valUnit.textContent = 'W';
    }

    /* ── Threshold: "Waiting for sun" when below ─ */
    // When power is below the configured threshold, replace the
    // numeric value with a friendly message in the normal text colour.
    if (c.production_threshold && this._cachedEls.valMain) {
      const belowThreshold = power < c.production_threshold;
      if (belowThreshold) {
        this._cachedEls.valMain.textContent = 'Waiting for sun';
        this._cachedEls.valMain.style.color = '';       // keep original colour
        this._cachedEls.valMain.style.fontSize = `${Math.round(valFs * 0.55)}px`;
        if (this._cachedEls.valUnit) this._cachedEls.valUnit.style.display = 'none';
      } else {
        this._cachedEls.valMain.style.color    = '';
        this._cachedEls.valMain.style.fontSize = '';
        if (this._cachedEls.valUnit) this._cachedEls.valUnit.style.display = '';
      }
    }

    /* ── Panel cells ──────────────────────────── */
    const prevRatio = this._lastRatio;
    if (Math.abs(ratio - prevRatio) >= 0.01) {
      this._lastRatio = ratio;
      this._patchCells(ratio, col);
    }

    /* ── Glow effect (skip entirely when reduced animations) ── */
    if (c.glow_effect && !(c.reduce_animations ?? IS_LOW_POWER) && Math.abs(ratio - prevRatio) >= 0.02) {
      const glowCol = c.color_neon_glow || (ratio > 0.02
        ? lerpColor(ratio, col.cold, col.mid, col.hot)
        : col.primary);
      const glowAmt    = ratio > 0.02 ? Math.round(6 + ratio * 18) : 6;
      const dSat      = Math.round(Math.min(100, Math.max(0, c.neon_saturation ?? 60)));
      const dHi       = Math.round(Math.min(255, dSat * 2.14)).toString(16).padStart(2, '0');
      const dMd       = Math.round(dSat).toString(16).padStart(2, '0');
      const dLo       = Math.round(dSat * 0.47).toString(16).padStart(2, '0');
      const usePanel  = c.neon_panel_glow;
      const useCard   = c.neon_card_glow;
      const glowKey   = `${glowAmt}:${glowCol}:${dSat}:${usePanel}:${useCard}`;
      if (glowKey !== this._lastGlowKey) {
        this._lastGlowKey = glowKey;
        if (this._cachedEls.panelWrap) {
          this._cachedEls.panelWrap.style.filter = usePanel
            ? `drop-shadow(0 0 4px ${glowCol}) drop-shadow(0 8px ${Math.round(glowAmt * 1.6)}px ${glowCol}${dHi})`
            : `drop-shadow(0 8px ${glowAmt}px ${glowCol}${dMd})`;
        }
        if (this._cachedEls.haCard) {
          this._cachedEls.haCard.style.boxShadow = useCard && ratio > 0.03
            ? `0 0 ${Math.round(ratio * 40)}px ${glowCol}${dMd}`
            : '';
        }
      }
    }

    /* ── Daily kWh ────────────────────────────── */
    if (this._cachedEls.dailyVal && daily !== null) {
      this._cachedEls.dailyVal.textContent = daily.toFixed(1) + ' kWh';
    }

    /* ── Efficiency text & bar ───────────────── */
    const eff = Math.round(ratio * 100);
    if (this._cachedEls.effBadge) {
      this._cachedEls.effBadge.innerHTML =
        `<span class="eff-label">Efficiency</span>${eff}%`;
      const band = eff > 60 ? 2 : eff > 25 ? 1 : 0;
      if (band !== this._lastEffBand) {
        this._lastEffBand = band;
        const ec = band === 2
          ? col.hot
          : band === 1
            ? col.mid
            : (c.cyberpunk_mode ? col.mid : col.cold);
        this._cachedEls.effBadge.style.color = ec;
      }
    }
    if (this._cachedEls.effBar) {
      this._cachedEls.effBar.style.width = eff + '%';
    }

    /* ── Secondary / Forecast values ──────────── */
    if (this._cachedEls.secVal && sec !== null) {
      this._cachedEls.secVal.textContent =
        typeof sec === 'number' ? sec.toFixed(1) : sec;
    }
    if (this._cachedEls.forecastVal && forecast !== null) {
      const fKw = forecast >= 1000;
      this._cachedEls.forecastVal.textContent =
        fKw ? (forecast / 1000).toFixed(1) : forecast.toFixed(0);
      if (this._cachedEls.forecastUnit) {
        this._cachedEls.forecastUnit.textContent = fKw ? 'kW' : 'W';
      }
    }

    /* ── Night mode + weather icon ─────────────── */
    const isNight = this._isNight(lux);
    this._applyWeatherIcon(weather, isNight, col);

    /* ── Sparkline ────────────────────────────── */
    this._updateSparkline();
  }

  /* ── Patch individual panel cells ────────────────────── */

  /**
   * Light up the correct number of cells based on the normalised
   * power ratio, with smooth colour transitions via lerpColor.
   *
   * @param {number} ratio - Normalised power [0 … 1].
   * @param {Object} col   - Resolved colour palette.
   */
  _patchCells(ratio, col) {
    const cells = this._cachedEls.cells;
    if (!cells?.length) return;

    const active = Math.round(ratio * cells.length);
    const prev   = this._lastActive;
    this._lastActive = active;
    const color = ratio > 0.005
      ? lerpColor(ratio, col.cold, col.mid, col.hot)
      : col.cold;

    // Same count — just update the colour
    if (active > 0 && prev === active) {
      for (let i = 0; i < active; i++) cells[i].setAttribute('fill', color);
      return;
    }

    if (active > prev) {
      // Increasing — light up new cells
      for (let i = prev; i < active; i++) {
        const el = cells[i];
        el.setAttribute('fill', color);
        el.setAttribute('opacity', '0.82');
        el.style.setProperty('--co', '0.7');
        el.classList.add('cell-on');
      }
      for (let i = 0; i < prev; i++) cells[i].setAttribute('fill', color);
    } else {
      // Decreasing — turn off cells
      for (let i = active; i < prev; i++) {
        const el = cells[i];
        el.setAttribute('fill', col.cold);
        el.setAttribute('opacity', '0.07');
        el.style.setProperty('--co', '0.07');
        el.classList.remove('cell-on');
      }
      for (let i = 0; i < active; i++) cells[i].setAttribute('fill', color);
    }
  }

  /* ── Night detection ─────────────────────────────────── */

  /**
   * Determine if it is currently "night" based on the lux sensor
   * or, as fallback, the current hour (before 6 AM / after 9 PM).
   *
   * @param {number|null} lux - Current lux reading.
   * @returns {boolean}
   */
  _isNight(lux) {
    const c = this._config;
    if (lux !== null && !isNaN(lux)) return lux < (c.night_threshold ?? 10);
    const h = new Date().getHours();
    return h < 6 || h >= 21;
  }

  /**
   * Update the header icon to reflect weather + night state.
   * Priority: weather entity icon > night moon > day sun.
   * Also toggles the night-mode tint overlay on the panel.
   *
   * @param {string|null} weather - Current HA weather state.
   * @param {boolean}     isNight - Whether it is currently night.
   * @param {Object}      col     - Resolved colour palette.
   */
  _applyWeatherIcon(weather, isNight, col) {
    // Night-mode overlay on the panel SVG
    if (this._cachedEls.nightOverlay) {
      this._cachedEls.nightOverlay.setAttribute('opacity', isNight ? '0.6' : '0');
    }

    // Determine the best icon path:
    //  1. Weather entity state (sunny, cloudy, rainy …)
    //  2. Night → moon
    //  3. Day   → sun
    let iconPath = MDI_SUN;
    let iconColor = this._config.color_icon || col.primary;

    if (weather && WEATHER_ICONS[weather]) {
      iconPath  = WEATHER_ICONS[weather];
      iconColor = this._config.color_icon || col.primary;
    } else if (isNight) {
      iconPath  = MDI_MOON;
      iconColor = this._config.cyberpunk_mode ? '#00fff9' : '#9db4ff';
    }

    // Night tint on the icon colour (even when weather icon is used)
    if (isNight && weather && WEATHER_ICONS[weather]) {
      iconColor = this._config.cyberpunk_mode ? '#00fff9' : '#9db4ff';
    }

    // Apply to DOM (skip if unchanged)
    if (this._cachedEls.iconPath) {
      if (this._cachedEls.iconPath.getAttribute('d') !== iconPath) {
        this._cachedEls.iconPath.setAttribute('d', iconPath);
      }
    }
    if (this._cachedEls.hdrIcon) {
      this._cachedEls.hdrIcon.style.color = iconColor;
    }
  }

  /* ── Sparkline update (includes threshold line) ──────── */

  /**
   * Recalculate and render the 24-hour sparkline chart.
   * Passes production history, forecast history, and the
   * optional threshold value to `buildSparkline()`.
   */
  _updateSparkline() {
    const c    = this._config;
    const zone = this._cachedEls?.sparkZone;
    if (!zone || !c.show_history || !this._history.length) return;

    const h  = this._history;
    const hf = this._historyForecast;

    // Fingerprint to avoid redundant SVG re-renders
    const fKey = hf.length ? `${hf.length}:${hf[0]}:${hf[hf.length - 1]}` : 'nof';
    const tKey = c.production_threshold ?? 'not';
    const key  = `${h.length}:${h[0]}:${h[Math.floor(h.length / 2)]}:${h[h.length - 1]}|${fKey}|${tKey}`;
    if (zone._key === key) return;
    zone._key = key;

    // Compute stats for the stat labels
    let hMin = Infinity, hMax = -Infinity, hSum = 0;
    for (const v of h) {
      if (v < hMin) hMin = v;
      if (v > hMax) hMax = v;
      hSum += v;
    }
    const hAvg = hSum / h.length;
    const col  = this._resolveColors();

    // Update stat labels
    if (this._cachedEls.spMin) this._cachedEls.spMin.textContent = fmtPower(hMin, c.unit, c.decimal_places);
    if (this._cachedEls.spAvg) this._cachedEls.spAvg.textContent = fmtPower(hAvg, c.unit, c.decimal_places);
    if (this._cachedEls.spMax) this._cachedEls.spMax.textContent = fmtPower(hMax, c.unit, c.decimal_places);
    if (this._cachedEls.spEff) {
      const avgEff = Math.round((hAvg / Math.max(c.max_power, 1)) * 100);
      this._cachedEls.spEff.textContent = `AVG EFF. ${avgEff}%`;
    }

    // Build sparkline SVG (includes threshold + forecast ghost)
    zone.innerHTML = buildSparkline(
      h, col, c.unit, c.decimal_places, hf,
      c.production_threshold
    );
  }

  /* ── Action dispatcher ───────────────────────────────── */

  /**
   * Execute an HA action from the card config.
   * Supports: more-info, navigate, url, call-service, toggle, none.
   *
   * @param {string} actionKey - One of: tap_action, hold_action, double_tap_action.
   */
  _handleAction(actionKey) {
    const cfg = this._config?.[actionKey];
    if (!cfg || cfg.action === 'none') return;

    switch (cfg.action) {
      case 'more-info':
        this._moreInfo(cfg.entity);
        break;

      case 'navigate':
        if (cfg.navigation_path) history.pushState(null, '', cfg.navigation_path);
        this.dispatchEvent(new Event('location-changed', { bubbles: true, composed: true }));
        break;

      case 'url':
        if (cfg.url_path) window.open(cfg.url_path, '_blank');
        break;

      case 'call-service': {
        if (!cfg.service) break;
        const [domain, service] = cfg.service.split('.', 2);
        this._hass?.callService(domain, service, cfg.service_data || {}, cfg.target || {});
        break;
      }

      case 'toggle':
        if (this._config.entity) {
          this._hass?.callService('homeassistant', 'toggle', {
            entity_id: this._config.entity,
          });
        }
        break;

      default:
        this._moreInfo();
        break;
    }
  }

  /**
   * Fire a hass-more-info event to open the entity detail dialog.
   * @param {string|null} entityId - Entity to display (defaults to main entity).
   */
  _moreInfo(entityId = null) {
    const id = entityId || this._config?.entity;
    if (!id) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail:   { entityId: id },
      bubbles:  true,
      composed: true,
    }));
  }

  /* ── Unavailable / Unknown state handling ────────────── */

  /** Dim the card and show a placeholder when the entity is unavailable. */
  _showUnavailable(state) {
    if (this._unavailable) return;
    this._unavailable = true;
    if (this._cachedEls?.valMain) {
      this._cachedEls.valMain.textContent  = state === 'unknown' ? '?' : '—';
      this._cachedEls.valMain.style.opacity = '0.35';
    }
    if (this._cachedEls?.valUnit) this._cachedEls.valUnit.textContent = state;
    if (this._cachedEls?.haCard)  this._cachedEls.haCard.style.opacity = '0.55';
  }

  /** Restore normal appearance after the entity becomes available again. */
  _clearUnavailable() {
    this._unavailable = false;
    if (this._cachedEls?.valMain) this._cachedEls.valMain.style.opacity = '';
    if (this._cachedEls?.haCard)  this._cachedEls.haCard.style.opacity  = '';
  }
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 10 — Custom Element Registration
// ═══════════════════════════════════════════════════════════════

if (!customElements.get('neon-solar-card-editor')) {
  customElements.define('neon-solar-card-editor', NeonSolarCardEditor);
}

if (!customElements.get('neon-solar-card')) {
  customElements.define('neon-solar-card', NeonSolarCard);
}

/* Console banner — useful for debugging version mismatches */
console.info(
  '%c NEON-SOLAR-CARD %c v' + VERSION + ' ',
  'color:#FFD23F;font-weight:700;background:#080808;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF6B35;font-weight:700;background:#080808;padding:2px 6px;border-radius:0 3px 3px 0',
);

/* Register in HA's custom-card picker */
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'neon-solar-card' || c.type === 'custom:neon-solar-card')) {
  window.customCards.push({
    type:        'neon-solar-card',
    name:        'Neon Solar Production Card',
    description: 'Solar panel card with animated cells, sparkline, night mode, weather & production threshold',
    preview:     true,
  });
}

console.info(
  '%c ☀️ neon-solar-production-card v2.1.0 %c Neo Tokyo ',
  'background:#FFD700;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FF6A00;padding:2px 4px;border-radius:0 3px 3px 0;'
);
