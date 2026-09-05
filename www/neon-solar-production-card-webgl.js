/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  neon-solar-card  —  Solar Production Card for Home Assistant ║
 * ║  Version : 2.1.6                                             ║
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

const VERSION = '2.1.6-webgl';

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
/* Revue de code 2026-09-04 -- trois helpers de robustesse.
   _finite : parseFloat rend NaN sur 'unknown'/'unavailable', et NaN !== NaN est
             toujours vrai -> dirty-check qui ne retourne jamais, donc re-render
             a chaque changement d etat GLOBAL de HA. On normalise en null.
   _fnv    : empreinte de TOUS les points d une serie (FNV-1a 32 bits). L ancien
             fingerprint ne regardait que les extremes et le milieu : une
             variation ailleurs n etait jamais redessinee.
   _esc    : les textes venus du YAML partent dans des template strings injectees
             en innerHTML. */
function _finite(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function _fnv(arr) {
  if (!arr || !arr.length) return 'nil';
  let h = 0x811c9dc5;
  for (let i = 0; i < arr.length; i++) {
    const s = String(arr[i]);
    for (let j = 0; j < s.length; j++) {
      h ^= s.charCodeAt(j);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    h ^= 44; h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return arr.length + ':' + h.toString(36);
}

function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

    /* ── reflet WebGL (variante webgl) ──────────────── */
    // Valeurs reglees a l'oeil par Chris au banc d'essai
    // (.preview-tooling/neon-solar-webgl/solar-in-card.html).
    // Elles viennent de _shader.CTRLS -- les corriger LA-BAS, pas ici :
    // ce bloc est genere. Ne pas les rechoisir au juge.
    sheen_gl:              raw.sheen_gl              ?? true,    // la couche GL elle-meme
    rain_demo:             raw.rain_demo             ?? false,   // pluie forcee (jugement hors averse)
    frost_demo:            raw.frost_demo            ?? false,   // givre force (jugement hors gel)
    sheen_tilt:            raw.sheen_tilt            ?? 30,     // inclinaison physique du panneau
    sheen_gloss:           raw.sheen_gloss           ?? 0.42,   // 0=miroir dur, 1=diffus
    sheen_inten:           raw.sheen_inten           ?? 0.77,   // intensité globale
    sheen_grazing:         raw.sheen_grazing         ?? 0.85,   // surbrillance quand le soleil rase
    sheen_spread:          raw.sheen_spread          ?? 0.45,   // largeur de la bande sur la vitre
    sheen_shimmer:         raw.sheen_shimmer         ?? 0.55,   // micro-ondulation lente
    sheen_tint:            raw.sheen_tint            ?? 0.30,   // 0=color_cold, 1=color_neon_glow
    sheen_fresnel:         raw.sheen_fresnel         ?? 0.40,   // remontée du reflet au fond
    rain_lvl:              raw.rain_lvl              ?? 0.00,   // 0=sec 1=averse (piloté par la météo)
    rain_size:             raw.rain_size             ?? 1.77,   // 1.0 = ~4 cm sur la vitre ; bas = bruine
    rain_dens:             raw.rain_dens             ?? 0.55,   // proportion de cellules occupées
    rain_slide:            raw.rain_slide            ?? 0.60,   // vitesse de descente sur le panneau
    rain_spec:             raw.rain_spec             ?? 0.10,   // reflet du soleil sur la goutte
    rain_warp:             raw.rain_warp             ?? 1.00,   // la goutte tord le reflet (lentille)
    rain_film:             raw.rain_film             ?? 0.70,   // galbe des gouttes : bord sombre, dos clair
    frost_lvl:             raw.frost_lvl             ?? 0.00,   // 0=rien 1=givre complet
    frost_coins:           raw.frost_coins           ?? 1.00,   // 1=mord depuis les bords, 0=uniforme
    frost_tile:            raw.frost_tile            ?? 70,     // taille des cristaux (haut = grain fin)
    frost_str:             raw.frost_str             ?? 1.00,   // déviation du reflet par le relief
    frost_spec:            raw.frost_spec            ?? 1.10,   // brillance des facettes
    frost_diff:            raw.frost_diff            ?? 0.90,   // la glace étale le reflet en halo laiteux
    frost_spark:           raw.frost_spark           ?? 0.60,   // micro-éclats scintillants


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
    neon_bar_glow:      raw.neon_bar_glow      ?? (raw.neon_glow ?? false), // efficiency bar glow
    neon_badge_glow:    raw.neon_badge_glow    ?? (raw.neon_glow ?? false), // efficiency badge glow
    neon_mini_glow:     raw.neon_mini_glow     ?? (raw.neon_glow ?? false), // mini header values glow
    neon_saturation:    raw.neon_saturation    ?? 60,     // glow intensity 0–100

    /* ── Typography ────────────────────────────────────────── */
    font_size:          raw.font_size          ?? 'medium', // small | medium | large
    header_font_size:   raw.header_font_size   ?? 15,        // px (anciennement small|medium|large)
    title_font_family:  raw.title_font_family  || null,     // optional header title font
    title_shadow:       raw.title_shadow       || null,     // custom text-shadow on title
    title_font_weight:  raw.title_font_weight  || null,     // optional header title font-weight (défaut CSS 600, cf pattern nmc)
    title_uppercase:    raw.title_uppercase    ?? false,    // UPPERCASE header title
    title_italic:       raw.title_italic       ?? false,    // italic header title
    title_letter_spacing: raw.title_letter_spacing || null, // e.g. '0.5px' — null = historic default
    // Glow titre — pattern canonique nmc/entities/storey : UN toggle + sa couleur + sa taille
    title_glow:         raw.title_glow         ?? false,
    title_glow_color:   raw.title_glow_color   || null,     // défaut : color_neon_glow / primary
    title_glow_size:    raw.title_glow_size    ?? 12,        // px, 4-layer canonical glow
    // Gradient titre — pattern canonique nmc : from = couleur titre/primary, to = accent
    title_gradient:     raw.title_gradient     ?? false,    // gradient fill on title text
    title_gradient_from: raw.title_gradient_from || null,
    title_gradient_to:  raw.title_gradient_to  || null,
    title_flicker:      raw.title_flicker      ?? false,    // neon flicker animation on title
    title_icon_color:   raw.title_icon_color   || null,     // défaut : couleur du titre
    icon_size:          raw.icon_size          ?? 22,       // header icon size (px)
    // Glow icône : partage title_glow/title_glow_color/title_glow_size — icône+titre = même bloc header

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
    return `<path data-ci="${ci}" d="${d}" fill="${cold}" opacity="0.045" style="animation-delay:${delay}s"/>`;
  }).join('\n');

  const [bA, bB] = [PANEL_M(FRAME_MU,1-FRAME_MV), PANEL_M(1-FRAME_MU,1-FRAME_MV)];
  const [fA, fB] = [PANEL_M(FRAME_MU,FRAME_MV),   PANEL_M(1-FRAME_MU,FRAME_MV)];

  return `<svg id="${id}-svg" viewBox="0 0 400 180" width="100%"
    preserveAspectRatio="xMidYMid meet" style="display:block"
    shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#080c14"/>
      <stop offset="45%"  stop-color="#03050a"/>
      <stop offset="100%" stop-color="#010203"/>
    </linearGradient>
    <linearGradient id="${id}-glare" x1="0%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="32%" stop-color="#ffffff" stop-opacity="0"/>
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

class NeonSolarCardWebglEditor extends HTMLElement {
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
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }

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
    row.appendChild(lbl); row.appendChild(wrap); (this._appendTo || this).appendChild(row);
    return { row, wrap };
  }

  // Groupe repliable (pattern storey-battery-card-gl.js) — allège l'UI en repliant
  // les réglages fins par défaut. buildFn() ré-ancre les helpers sur le panel via _appendTo.
  _group(title, expanded, buildFn) {
    const panel = document.createElement('ha-expansion-panel');
    panel.outlined = true;
    panel.header = title;
    if (expanded) panel.expanded = true;
    (this._appendTo || this).appendChild(panel);
    const prevAppendTo = this._appendTo;
    this._appendTo = panel;
    buildFn();
    this._appendTo = prevAppendTo;
    return panel;
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
    this._toggle('show_history', t.history, true);
    this._toggle('show_efficiency', t.efficiency, true);
    this._toggle('reduce_animations', t.reduceAnim, false);

    this._section('Header (icône + titre)');
    this._number('header_font_size', t.headerFontSize, { min: 8, max: 32, step: 1 });
    this._number('icon_size', 'Icon size (px)', { min: 12, max: 48, step: 1 });
    this._select('title_font_family', t.titleFont, TITLE_FONT_OPTIONS, '— thème HA —');
    this._group('Typo & effets avancés (12 paramètres)', false, () => {
      this._text('title_font_weight', 'Épaisseur', '600');
      this._text('title_letter_spacing', 'Espacement', '0.5px');
      this._toggle('title_uppercase', 'Majuscules', false);
      this._toggle('title_italic', 'Italique', false);
      this._text('title_shadow', 'Text-shadow', '0 0 8px rgba(0,212,255,0.7)');
      this._color('title_icon_color', "Couleur de l'icône", null, 'défaut : couleur du titre');
      this._toggle('title_gradient', 'Titre en dégradé');
      this._color('title_gradient_from', 'Dégradé — départ', 'var(--primary-color)');
      this._color('title_gradient_to', 'Dégradé — arrivée', 'var(--accent-color)');
      this._toggle('title_glow', 'Glow du titre');
      this._text('title_glow_size', 'Taille du glow', '12');
      this._color('title_glow_color', 'Couleur du glow', 'var(--primary-color)');
      this._toggle('title_flicker', 'Scintillement du titre');
      this._toggle('neon_mini_glow', 'Glow TODAY/SENSOR/FORECAST');
      this._hint('Text-shadow ci-dessus, si renseigné, remplace le glow.');
    });

    this._section('Corps — Typographie');
    this._color('color_efficiency_text', t.colorEffText, '#FFD23F');
    this._color('color_mini_values_text', t.colorMiniText, '#ffffff');
    this._color('color_sparkline_stats_text', t.colorStatsText, '#888888');
    this._number('efficiency_font_weight', t.effFontWt, { min: 300, max: 900, step: 100, ph: '600' });
    this._number('label_font_weight', t.labelFontWt, { min: 300, max: 900, step: 100, ph: '600' });
    this._number('text_shadow_blur', t.textShadowBlur, { min: 0, max: 20, step: 1 });

    this._section('Corps — Glow');
    this._toggle('glow_effect', 'Glow panneau solaire (cellules, animé)', false);
    this._toggle('neon_panel_glow', t.neonPanelGlow, false);
    this._toggle('neon_text_glow', t.neonTextGlow, false);
    this._toggle('neon_bar_glow', t.neonBarGlow, false);
    this._toggle('neon_badge_glow', t.neonBadgeGlow, false);
    this._toggle('neon_card_glow', t.neonCardGlow, false);

    this._section('Cyberpunk');
    this._hint('Couleur/intensité par défaut de tous les toggles glow ci-dessus (sauf title_glow_color s\'il est renseigné, et "Glow panneau solaire" qui suit sa propre logique animée).');
    this._toggle('cyberpunk_mode', t.cyberpunk, false);
    this._color('color_neon_glow', t.colorNeonGlow, '#00E8FF');
    this._number('neon_saturation', t.neonSat, { min: 0, max: 100, step: 5, ph: '50' });

    this._section(t.colors);
    this._hint('empty = HA theme — var(--css-var) supported');
    this._color('color_title', t.colorTitle, '#ffffff');
    this._color('color_primary', t.colorPrimary, '#FFD23F');
    this._color('color_cold', t.colorCold, '#00E8FF');
    this._color('color_mid', t.colorMid, '#FFD23F');
    this._color('color_hot', t.colorHot, '#FF6B35');
    /* color_icon / color_badge retires le 2026-09-04 : aucun chemin de rendu ne
       les lisait. La couleur d icone suit le pattern canonique du header
       (title_icon_color || color_title || texte) -- cf _renderHeader. Les
       exposer donnait une option acceptee sans le moindre effet. */

    this._section('Reflet WebGL du panneau');
    this._toggle('sheen_gl', 'Couche WebGL (decocher = balayage CSS d origine)', true);
    this._group('Reflet du panneau (8)', false, () => {
      this._number('sheen_tilt', 'Inclinaison panneau (°)', { min: 0, max: 90, step: 1, ph: '30' });
      this._hint('inclinaison physique du panneau');
      this._number('sheen_gloss', 'Douceur du lobe', { min: 0, max: 1, step: 0.01, ph: '0.42' });
      this._hint('0=miroir dur, 1=diffus');
      this._number('sheen_inten', 'Intensité du reflet', { min: 0, max: 3, step: 0.01, ph: '0.77' });
      this._hint('intensité globale');
      this._number('sheen_grazing', 'Gain rasant', { min: 0, max: 2, step: 0.01, ph: '0.85' });
      this._hint('surbrillance quand le soleil rase');
      this._number('sheen_spread', 'Étalement de la bande', { min: 0, max: 1, step: 0.01, ph: '0.45' });
      this._hint('largeur de la bande sur la vitre');
      this._number('sheen_shimmer', 'Ondulation du verre', { min: 0, max: 2, step: 0.01, ph: '0.55' });
      this._hint('micro-ondulation lente');
      this._number('sheen_tint', 'Teinte froide → néon', { min: 0, max: 1, step: 0.01, ph: '0.30' });
      this._hint('0=color_cold, 1=color_neon_glow');
      this._number('sheen_fresnel', 'Fresnel bord arrière', { min: 0, max: 1, step: 0.01, ph: '0.40' });
      this._hint('remontée du reflet au fond');
    });
    this._group('Pluie sur le panneau (7)', false, () => {
      this._toggle('rain_demo', 'Toujours visible (demo)', false);
      this._hint('Affiche la pluie quelle que soit la meteo, pour le regler sans attendre. A decocher une fois regle.');
      this._number('rain_lvl', 'PLUIE — quantité', { min: 0, max: 1, step: 0.01, ph: '0.00' });
      this._hint('0=sec 1=averse (piloté par la météo)');
      this._number('rain_size', 'Pluie — taille goutte', { min: 0.3, max: 2.5, step: 0.01, ph: '1.77' });
      this._hint('1.0 = ~4 cm sur la vitre ; bas = bruine');
      this._number('rain_dens', 'Pluie — densité', { min: 0, max: 1, step: 0.01, ph: '0.55' });
      this._hint('proportion de cellules occupées');
      this._number('rain_slide', 'Pluie — glissement', { min: 0, max: 3, step: 0.01, ph: '0.60' });
      this._hint('vitesse de descente sur le panneau');
      this._number('rain_spec', 'Pluie — éclat', { min: 0, max: 3, step: 0.01, ph: '0.10' });
      this._hint('reflet du soleil sur la goutte');
      this._number('rain_warp', 'Pluie — déviation', { min: 0, max: 3, step: 0.01, ph: '1.00' });
      this._hint('la goutte tord le reflet (lentille)');
      this._number('rain_film', 'Pluie — relief des gouttes', { min: 0, max: 1, step: 0.01, ph: '0.70' });
      this._hint('galbe des gouttes : bord sombre, dos clair');
    });
    this._group('Givre sur le panneau (7)', false, () => {
      this._toggle('frost_demo', 'Toujours visible (demo)', false);
      this._hint('Affiche le givre quelle que soit la meteo, pour le regler sans attendre. A decocher une fois regle.');
      this._number('frost_lvl', 'GIVRE — quantité', { min: 0, max: 1, step: 0.01, ph: '0.00' });
      this._hint('0=rien 1=givre complet');
      this._number('frost_coins', 'Givre — depuis bords', { min: 0, max: 1, step: 0.01, ph: '1.00' });
      this._hint('1=mord depuis les bords, 0=uniforme');
      this._number('frost_tile', 'Givre — grain cristal', { min: 20, max: 180, step: 1, ph: '70' });
      this._hint('taille des cristaux (haut = grain fin)');
      this._number('frost_str', 'Givre — relief', { min: 0, max: 3, step: 0.01, ph: '1.00' });
      this._hint('déviation du reflet par le relief');
      this._number('frost_spec', 'Givre — éclat facettes', { min: 0, max: 3, step: 0.01, ph: '1.10' });
      this._hint('brillance des facettes');
      this._number('frost_diff', 'Givre — diffusion', { min: 0, max: 2, step: 0.01, ph: '0.90' });
      this._hint('la glace étale le reflet en halo laiteux');
      this._number('frost_spark', 'Givre — paillettes', { min: 0, max: 2, step: 0.01, ph: '0.60' });
      this._hint('micro-éclats scintillants');
    });
  }
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 9 — Main Card Element
// ═══════════════════════════════════════════════════════════════


/* ══ Couche WebGL : le reflet du soleil sur la vitre ══════════════════ */
/* Genere par .preview-tooling/neon-solar-webgl/gen_card_webgl.py -- NE PAS
   EDITER ICI : le shader vit dans _shader.py, relu verbatim au build. Toute
   correction faite dans ce fichier serait perdue au build suivant. */

const GL_VERT = "attribute vec2 aPos;\nvoid main(){ gl_Position = vec4(aPos, 0.0, 1.0); }\n";
const GL_FRAG = "precision highp float;\n\nuniform vec2  uRes;        // taille du canvas en pixels device\nuniform mat3  uInvH;       // ecran(viewBox) -> UV du panneau\nuniform vec2  uVB;         // echelle viewBox -> pixels  (400x180 -> canvas)\nuniform float uTime;\n\n// --- soleil (convention _skySun() de weather-neon-card-webgl) ---\nuniform float uSunAlt;     // sin(elevation)  : <0 = sous l'horizon\nuniform float uSunX;       // (azimut-90)/180 : 0=Est 0.5=Sud 1=Ouest\nuniform float uNight;      // 0=jour 1=nuit \u2014 rampe douce, jamais un pop\n\n// --- reglages exposes au banc ---\nuniform float uTilt;       // inclinaison du panneau (degres) \u2014 0=a plat, 90=vertical\nuniform float uGloss;      // largeur du lobe speculaire : petit=miroir dur, grand=diffus\nuniform float uInten;      // intensite du reflet\nuniform float uGrazing;    // gain supplementaire quand le soleil rase la surface\nuniform float uSpread;     // etalement de la bande le long du panneau\nuniform float uPower;      // 0..1 charge instantanee \u2014 module la vivacite du verre\nuniform float uShimmer;    // micro-ondulation du verre (lent)\nuniform vec3  uColCold;    // teinte froide (color_cold)\nuniform vec3  uColGlow;    // teinte neon (color_neon_glow)\nuniform float uTint;       // 0=cold 1=neon : melange des deux\nuniform float uFresnel;    // remontee du reflet sur le bord arriere (rasant a l'oeil)\n\n// --- meteo, transpose de weather-neon-card-webgl/fx_shader.py ---------------\n// TOUT est calcule en UV PANNEAU, jamais en espace ecran : les gouttes glissent\n// donc dans la perspective du panneau incline, gratuitement (cf uInvH). C'est\n// exactement ce que la version meteo NE peut pas faire : elle travaille sur vUv.\nuniform float uRainLvl;    // 0=sec 1=averse \u2014 pilote par l'etat meteo\nuniform float uRainSize;   // taille des gouttes\nuniform float uRainDens;   // densite (proportion de cellules occupees)\nuniform float uRainSpec;   // eclat speculaire sur la goutte\nuniform float uRainSlide;  // vitesse de glissement le long du panneau\nuniform float uRainWarp;\nuniform float uRainFilm;   // deviation du reflet par la lentille de la goutte\nuniform float uFrostLvl;   // 0=rien 1=givre complet\nuniform float uFrostTile;  // finesse des dendrites\nuniform float uFrostStr;   // relief (deviation du reflet)\nuniform float uFrostSpec;  // eclat des facettes\nuniform float uFrostSpark; // paillettes\nuniform float uFrostCoins; // 0=uniforme 1=le givre mord depuis les bords\nuniform float uFrostDiff;  // diffusion : la glace etale le reflet en halo\n\nconst float PANEL_AR = 2.29;   // aspect du panneau en viewBox (~320 large / 140 haut).\n                               // /!\\ la version meteo cable uRes.x/uRes.y : c'est\n                               // l'aspect de l'ECRAN. Ici le repere est le PANNEAU,\n                               // sinon les gouttes sont des ellipses arbitraires.\n\nconst float PI = 3.14159265;\n\n/* bruit de valeur, pour la micro-irregularite du verre (pas du grain : de l'onde) */\nfloat hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\nfloat vnoise(vec2 p){\n  vec2 i = floor(p), f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),\n             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);\n}\nfloat fbm2(vec2 p){\n  float v = 0.0, a = 0.5;\n  for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.02; a *= 0.5; }\n  return v;\n}\n\n/* -- Cellules de glace ------------------------------------------------------\n   La brique qui manquait au givre v1. Un fbm fait des NAPPES : douces, rondes,\n   sans bord \u2014 d'ou les \"taches nuageuses\". La glace pousse en CRISTAUX : des\n   facettes anguleuses separees par des veines nettes. C'est un Voronoi, pas un\n   bruit fractal, et aucun reglage d'un fbm ne le rattrape.\n\n   Rend deux choses d'un coup, parce que les deux viennent du meme calcul :\n     .x  = distance au BORD de cellule (F2-F1). Proche de 0 sur une veine, grand\n           au coeur d'un cristal. C'est le dessin de la croute.\n     .yz = direction centre de cellule -> fragment. C'est la pente de la facette,\n           donc de quoi l'eclairer : sur la photo chaque cristal renvoie la\n           lumiere differemment selon son orientation. */\nvec3 iceCell(vec2 p){\n  vec2 n = floor(p), f = fract(p);\n  float f1 = 8.0, f2 = 8.0;\n  vec2  dir = vec2(0.0);\n  for (int j = -1; j <= 1; j++){\n    for (int i = -1; i <= 1; i++){\n      vec2 g = vec2(float(i), float(j));\n      // un point par cellule, place au hasard DANS la cellule : c'est ce desordre\n      // qui donne des cristaux de tailles inegales, comme du vrai givre.\n      vec2 o = vec2(hash(n + g), hash(n + g + 17.3));\n      vec2 r = g + o - f;\n      float d = dot(r, r);                   // au carre : pas de sqrt dans la boucle\n      if (d < f1){ f2 = f1; f1 = d; dir = r; }\n      else if (d < f2){ f2 = d; }\n    }\n  }\n  // F2-F1 en distances REELLES : c'est la largeur de la veine. Au carre, elle\n  // s'epaissirait au hasard selon la taille du cristal voisin.\n  return vec3(sqrt(f2) - sqrt(f1), normalize(dir + 1e-5));\n}\n\n/* \u2500\u2500 Pluie : hauteur de la nappe d'eau, en UV PANNEAU \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n   Transpose de rainH() de fx_shader.py (meteo). Deux differences, toutes deux\n   necessaires \u2014 pas cosmetiques :\n     1. l'aspect vient du PANNEAU (PANEL_AR), pas du canvas. Sinon la goutte est\n        une ellipse dont l'etirement suit la taille de la card a l'ecran.\n     2. v croit vers le HAUT du panneau (PANEL_OF : v=0 -> y=160 bas, v=1 -> y=20\n        haut). Une goutte qui descend doit donc voir v DECROITRE, ce que produit\n        deja `fract(r2 - t*...)`. Verifie sur l'homographie, pas suppose.\n   La perspective n'est pas simulee : elle est deja dans l'uv qu'on recoit. */\nfloat rainH(vec2 uv){\n  float t = uTime * uRainSlide;\n  float h = 0.0;\n  for (int L = 0; L < 2; L++){\n    // Echelle PANNEAU, pas echelle ecran : ~26 a 46 cellules sur la largeur du\n    // panneau. Une vitre fait ~1,7 m de large, donc la goutte vaut ~4 cm \u2014 la\n    // taille reelle d'une grosse goutte sur du verre. L'ancien mix(9,17) donnait\n    // des gouttes de ~15 cm : lisible, mais pas a l'echelle d'un panneau.\n    // Ancrage PIXELS : la grille est en echelle panneau, donc une goutte\n    // occupait une fraction CONSTANTE du panneau -- ~5 px au banc (720 de large)\n    // mais ~2 px sur la vraie card (355), soit invisible quel que soit le\n    // curseur. On reduit le nombre de cellules quand la card est plus etroite,\n    // pour que la goutte garde sa taille APPARENTE. 720 = largeur du banc ou\n    // les reglages ont ete valides ; borne basse pour ne pas finir avec trois\n    // gouttes geantes sur une card minuscule.\n    float pxk = clamp(uRes.x / 720.0, 0.55, 1.0);\n    float sc = mix(26.0, 46.0, float(L)) * pxk / max(0.35, uRainSize);\n    vec2 g  = vec2(uv.x * sc * PANEL_AR, uv.y * sc);\n    vec2 id = floor(g), f = fract(g) - 0.5;\n    float r1 = hash(id + float(L) * 17.0);\n    float r2 = hash(id + vec2(3.7, 9.1) + float(L) * 17.0);\n    if (r1 > 1.0 - uRainDens * uRainLvl){\n      float sp = 0.35 + r2 * 0.65;\n      float yy = fract(r2 - t * 0.16 * sp);          // decroit = glisse vers le bas\n      vec2  c  = vec2((r2 - 0.5) * 0.55, yy - 0.5);\n      // La goutte n'occupe qu'une petite part de sa cellule : resserrer la grille\n      // sans reduire ce rayon aurait juste donne PLUS de grosses gouttes.\n      float rad = 0.075 + r1 * 0.085;\n      h += smoothstep(rad, 0.0, length((f - c) * vec2(1.0, 0.9))) * (0.65 + 0.35 * r1);\n      // la trainee que la goutte laisse DERRIERE elle, donc au-dessus (v croit en haut)\n      float above = clamp((f.y - c.y) / 0.55, 0.0, 1.0);\n      h += smoothstep(rad * 0.40, 0.0, abs(f.x - c.x)) * above * 0.35;\n    }\n  }\n  return h;\n}\n\n/* \u2500\u2500 Givre : dendrites depuis les 4 COINS du panneau \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n   Chris : \u00ab c'est plus un effet sympa qui vient des 4 coins du panneau \u00bb.\n   La meteo construit une mixmap en canvas 2D (_fxFrostMap) et l'echantillonne ;\n   ici il n'y a AUCUNE texture \u2014 le givre est donc analytique, et les coins\n   viennent d'un champ de distance aux quatre angles de la vitre. */\n/* Densite de givre + pente de la glace, en UV PANNEAU.\n   .x = epaisseur du depot [0,1] ; .yz = pente de la surface glacee.\n\n   Trois choses font la difference avec la v1 (diagnostiquees, pas supposees) :\n\n   1. CELLULES, pas fbm. Deux octaves : les grosses portent la forme des cristaux,\n      les petites le grain. Un fbm seul ne fait que des nuages.\n   2. SEUIL DUR. La v1 seuillait sur 0.36 de plage (smoothstep(0.42,0.78)) : sur un\n      fbm centre en 0.5, ca ne coupe rien, ca degrade. Ici la transition tient sur\n      ~0.06 : la croute a un bord franc, comme sur une vraie vitre.\n   3. Le givre mord depuis les BORDS vers le centre, avec un front IRREGULIER. Un\n      front lisse ferait une vignette photo ; c'est le bruit ajoute a la marge qui\n      donne la frontiere dechiquetee du vrai givre. */\nvec3 frostField(vec2 uv){\n  vec2 p = vec2(uv.x * PANEL_AR, uv.y);\n\n  // -- ou le givre a-t-il gagne ? --\n  // Marge au bord le plus proche : 0 au bord, 0.5 au centre. Le givre part des\n  // bords (les montants du cadre, la ou le froid conduit) et progresse vers le\n  // milieu \u2014 c'est ce que montre la photo : clairiere centrale, croute autour.\n  vec2  q     = abs(uv - 0.5);\n  float edge  = 0.5 - max(q.x, q.y);\n  // Front dechiquete : sans ce bruit la limite est un ovale regulier, qui lit\n  // comme une vignette de retouche et pas comme du givre.\n  float ragged = fbm2(p * 5.5 + 31.0) - 0.5;\n  float front  = edge + ragged * 0.20;\n  // uFrostLvl pousse le front : a 1 le givre atteint le centre, a 0.3 il reste une\n  // couronne au bord. C'est la variable que la meteo pilotera en production.\n  float reach  = mix(-0.05, 0.62, uFrostLvl);\n  float grow   = smoothstep(reach, reach - 0.17, front);\n  // curseur \"depuis les bords\" : a 0, couverture uniforme.\n  grow = mix(uFrostLvl, grow, uFrostCoins);\n\n  // -- la matiere --\n  // Octave 1 : les cristaux. uFrostTile monte bien plus haut qu'en v1 (le grain de\n  // la photo est millimetrique ; a 11 un \"cristal\" faisait 5 cm de panneau).\n  vec3  c1 = iceCell(p * uFrostTile);\n  // Octave 2 : le grain DANS les cristaux. Decalee et de rapport non entier (2.7),\n  // sinon les deux grilles s'alignent et on voit un damier.\n  vec3  c2 = iceCell(p * uFrostTile * 2.7 + 43.1);\n\n  // Les veines (F2-F1 petit) sont les JOINTS entre cristaux : c'est la ou la glace\n  // est la plus epaisse et la plus blanche sur la photo. On inverse donc.\n  float vein = 1.0 - smoothstep(0.0, 0.16, c1.x);\n  float fine = 1.0 - smoothstep(0.0, 0.22, c2.x);\n  float mat  = clamp(vein * 0.72 + fine * 0.46, 0.0, 1.0);\n\n  // Seuil DUR sur la MATIERE SEULE \u2014 et surtout pas sur `mat + grow`.\n  // Mesure du 2026-09-03 : `smoothstep(0.30, 0.36, mat*0.55 + grow*0.62)` saturait\n  // des que grow depassait 0.58, c'est-a-dire partout des frost_lvl=1. Le seuil\n  // etait franchi par grow tout seul, la matiere n'entrait plus dans le resultat,\n  // et le curseur de grain etait mort. Les deux variables repondent a deux\n  // questions distinctes \u2014 \u00ab a quoi ressemble la glace \u00bb et \u00ab jusqu'ou a-t-elle\n  // pousse \u00bb \u2014 elles se MULTIPLIENT, elles ne s'additionnent pas.\n  //\n  // Le seuil recule legerement quand grow monte : le bord de la zone givree reste\n  // maigre, le coeur devient dense. C'est ainsi que la croute s'amincit en\n  // avancant vers le centre, au lieu d'avoir une epaisseur uniforme.\n  float thr   = mix(0.62, 0.34, grow);\n  float crust = smoothstep(thr, thr + 0.07, mat);\n  // 2026-09-04 \u2014 `grow` entrait DEUX fois : dans le seuil `thr` ci-dessus, et ici en\n  // facteur direct. Le second usage etait un variateur lineaire : loin des coins il\n  // rabotait la croute vers zero, donc seuls les pics de matiere survivaient \u2014 c'est\n  // exactement le \u00ab ciel etoile \u00bb que Chris a diagnostique. Mesure : le champ sortait\n  // a 0.165 de moyenne, trop bas pour que le modele de densite en aval ait la moindre\n  // dynamique (balayage frost_diff : p90 115.0 -> 114.7, curseur mort).\n  //\n  // `grow` repond a \u00ab jusqu'ou la glace est-elle arrivee \u00bb : c'est une frontiere, pas\n  // une intensite. Donc une PORTE, pas une rampe. Derriere le front, la croute garde\n  // l'epaisseur que lui donne la matiere ; le degrade reste porte par `thr`, qui\n  // amincit deja le bord de la zone.\n  //\n  // Le smoothstep demarre a 0.0 : a frost_lvl=0 (le defaut deploye) `grow` vaut 0,\n  // gate vaut 0, amt vaut 0 \u2014 le cas sec reste strictement intact. Verifie a la sonde.\n  float gate  = smoothstep(0.0, 0.12, grow);\n  float amt   = clamp(crust * gate, 0.0, 1.0);\n\n  // -- la pente --\n  // Les deux octaves se combinent : les grosses facettes donnent l'orientation du\n  // cristal, les petites la rugosite qui fait scintiller.\n  vec2 nrm = c1.yz * (1.0 - c1.x * 2.2) + c2.yz * (0.55 - c2.x);\n  return vec3(amt, nrm * amt);\n}\n\n/* Compat : l'ancienne signature scalaire, la ou seule l'epaisseur compte. */\nfloat frostAmt(vec2 uv){ return frostField(uv).x; }\n\nvoid main(){\n  // fragment -> coordonnees viewBox de la card (400x180)\n  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uVB;\n\n  // ecran -> UV du panneau, via l'inverse de l'homographie de la card\n  vec3 h = uInvH * vec3(frag, 1.0);\n  vec2 uv = h.xy / h.z;\n\n  // hors de la vitre : rien. Le cadre et la levre ne refletent pas comme le verre.\n  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;\n\n  // \u2500\u2500 Geometrie de l'eclairement \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // elevation reelle du soleil, reconstruite depuis alt = sin(elev)\n  float elev = asin(clamp(uSunAlt, -1.0, 1.0));       // radians\n  float tilt = radians(uTilt);\n\n  // Normale du panneau : incline de `tilt` autour de l'axe est-ouest, face au sud.\n  vec3 N = vec3(0.0, sin(tilt), cos(tilt));\n\n  // Direction du soleil. uSunX : 0=Est -> 1=Ouest, on le ramene en azimut relatif.\n  float az = (uSunX - 0.5) * PI;                       // -PI/2=Est .. +PI/2=Ouest\n  vec3 L = normalize(vec3(sin(az) * cos(elev), cos(elev) * cos(az), sin(elev)));\n\n  // Oeil : on regarde la card de face, legerement en plongee (la perspective du SVG).\n  vec3 V = normalize(vec3(0.0, -0.45, 1.0));\n\n  // Reflet speculaire Blinn-Phong : le lobe suit l'angle d'incidence, donc la\n  // bande se deplace VRAIMENT quand le soleil bouge. C'est tout l'interet.\n  vec3  H = normalize(L + V);\n  float ndh = max(dot(N, H), 0.0);\n  float ndl = max(dot(N, L), 0.0);\n\n  // uGloss petit = exposant grand = miroir dur ; grand = lobe large et doux.\n  // Plage 4..48 et NON 6..220 : le panneau est plan, donc ndh est presque constant\n  // sur toute la vitre (~0.94 a midi). Avec un exposant de 134, 0.94^134 = 2e-4 :\n  // le lobe est mathematiquement mort et on ne voit plus que les termes additifs.\n  // Mesure au banc le 2026-09-03 avant correction : spec = 0.000182 a midi, 0.0 ailleurs.\n  float shin = mix(48.0, 4.0, clamp(uGloss, 0.0, 1.0));\n  // renormalise par la valeur au zenith : le lobe garde son CONTRASTE sans\n  // dependre de l'exposant choisi par le curseur.\n  float spec = pow(ndh, shin) / max(pow(0.985, shin), 1e-4);\n  spec = clamp(spec, 0.0, 1.6);\n\n  // \u2500\u2500 Position de la bande sur la vitre \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // Le lobe seul donnerait un aplat uniforme (le panneau est plan : meme normale\n  // partout). La bande vient de la PARALLAXE : on decale le long de u selon\n  // l'azimut, et le long de v selon l'elevation. Soleil bas -> bande basse et\n  // etiree ; soleil haut -> tache haute et ramassee.\n  //\n  // uSunX vaut 0 a l'Est (az 90) et 1 a l'Ouest (az 270), mais le soleil utile\n  // ne balaie pas la vitre d'un bord a l'autre : on le recentre sur [0.14 .. 0.86],\n  // sinon le lever sort du panneau par la gauche (bandU 0.056) et le coucher par\n  // la droite (bandU 1.039) -> reflet invisible aux deux extremites de la journee.\n  float bandU = 0.5 + (clamp(uSunX, 0.0, 1.0) - 0.5) * 1.05;\n  float bandV = clamp(0.12 + 0.76 * (elev / (PI * 0.5)), 0.0, 1.0);\n\n  // Largeur de la bande. Le soleil rasant l'etire VERTICALEMENT (le reflet s'allonge\n  // sur la vitre) mais la RESSERRE horizontalement \u2014 c'est ce qui rend le suivi\n  // lisible : une bande large comme le panneau ne se voit plus bouger.\n  // Mesure au banc : avec wU constant, le deplacement tombait a 0.055 de la largeur.\n  float graze = 1.0 - clamp(elev / (PI * 0.5), 0.0, 1.0);   // 1 = rasant\n  float wU = mix(0.13, 0.34, uSpread) * (1.0 - graze * 0.30);\n  float wV = mix(0.10, 0.40, uSpread) * (1.0 + graze * 1.10);\n\n  // micro-ondulation : le verre n'est pas parfaitement plan. Lent (0.05 Hz).\n  float wob = (vnoise(uv * vec2(3.5, 2.2) + uTime * 0.05) - 0.5) * uShimmer * 0.09;\n\n  // \u2500\u2500 Meteo : la nappe d'eau et le givre DEFORMENT la surface \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // Difference d'architecture assumee avec la meteo : le canvas solaire est en\n  // z-index 2, AU-DESSUS du panneau (cf README) \u2014 il ne peut donc pas lire ce\n  // qu'il recouvre, pas de texture2D(uSharp) possible ici. La goutte ne se rend\n  // donc pas par refraction du fond mais par sa NORMALE : elle devie la bande de\n  // reflet et accroche un eclat du soleil REEL. Sur une vitre en plein soleil\n  // c'est d'ailleurs la lecture juste \u2014 une goutte se voit a ses reflets.\n  vec2  warp  = vec2(0.0);\n  float wet   = 0.0;\n  float glint = 0.0;\n  float ice   = 0.0;\n  // `rn` (pente de la goutte) est hissee ici, au meme niveau que `wet` et\n  // `glint` : le bloc RELIEF la relit bien plus bas, hors du if(uRainLvl).\n  // Laissee locale au if, elle donnait un shader qui ne compile pas -> pas de\n  // contexte GL -> sonde muette sur les SIX temoins, `sec` compris. Un temoin\n  // non concerne qui casse, c'est une erreur globale, pas une regression locale.\n  vec2  rn    = vec2(0.0);\n\n  // Lumiere qui eclaire la METEO (\u2260 celle qui eclaire le reflet solaire).\n  // De jour c'est le soleil ; de nuit c'est une source fixe haut-avant --\n  // l'eclairage ambiant, la card elle-meme etant un objet lumineux. Sans ce\n  // melange, `dot(Nd, L+V)` devient negatif des que le soleil passe sous le\n  // panneau, l'exposant 26 ecrase le reste, et gouttes comme paillettes\n  // disparaissent completement (Chris, 2026-09-04). Une goutte d'eau sur une\n  // vitre ne s'eteint pas parce que le soleil s'est couche.\n  vec3 Lamb = normalize(vec3(-0.25, 0.65, 0.72));\n  vec3 Lw   = normalize(mix(L, Lamb, clamp(uNight, 0.0, 1.0)));\n\n  if (uRainLvl > 0.001){\n    // Pas cale sur la TAILLE de la goutte (~0.004 UV de rayon) : a 0.0035 il\n    // enjambait la goutte entiere et la normale sortait plate. Et c'est bien un\n    // pas en UV PANNEAU, pas 1.5/uRes.y qui est un pas en pixels ECRAN.\n    float e  = 0.0012;                    // (et non 1.5/uRes.y,\n                                          // qui est un pas en pixels ECRAN)\n    float h0 = rainH(uv);\n    rn = vec2(h0 - rainH(uv + vec2(e, 0.0)),\n              h0 - rainH(uv + vec2(0.0, e))) * 40.0;\n    warp += rn * uRainWarp * 0.035;\n    wet   = clamp(h0 * 2.2, 0.0, 1.0);\n    // L'eclat vient du soleil de jour, de l'ambiant la nuit (cf Lw plus haut).\n    // L'exposant baisse avec la nuit : un lampadaire est une source LARGE, son\n    // reflet sur une goutte est un point plus etale et plus doux qu'un reflet\n    // solaire. Garder 26 la nuit donnerait des eclats ponctuels invisibles.\n    vec3  Nd  = normalize(vec3(rn * 0.5, 1.0));\n    float sh  = mix(26.0, 9.0, clamp(uNight, 0.0, 1.0));\n    glint = pow(max(dot(Nd, normalize(Lw + V)), 0.0), sh) * uRainSpec * wet;\n  }\n\n  vec2 iceN = vec2(0.0);\n  if (uFrostLvl > 0.001){\n    // frostField rend l'epaisseur ET la pente d'un coup : plus besoin des trois\n    // evaluations de la difference finie (l'ancien code appelait frostAmt 3 fois\n    // par fragment, et sur un Voronoi a 9 cellules ca coutait cher pour rien).\n    vec3 F = frostField(uv);\n    ice   = F.x;\n    iceN  = F.yz;\n    warp += iceN * uFrostStr * 0.022;\n  }\n\n  float du = (uv.x - bandU + wob + warp.x) / wU;\n  float dv = (uv.y - bandV + wob * 0.6 + warp.y) / wV;\n  float band = exp(-(du * du + dv * dv));\n\n  // -- DIFFUSION par le givre -------------------------------------------------\n  // Le verre depoli ne DEVIE pas la lumiere, il l'ETALE : chaque point recoit un\n  // petit voisinage de directions au lieu d'une seule. C'est ce qui transforme un\n  // lampadaire ponctuel en halo laiteux sur une vitre givree.\n  //\n  // Note pour un futur passage : j'avais d'abord ecarte la diffusion en croyant\n  // que le canvas (z-index:2, au-dessus du panneau) ne pouvait pas lire ce qu'il\n  // recouvre. Vrai pour le DOM, hors sujet ici : ce que le givre recouvre, c'est\n  // cette bande-la, calculee deux lignes plus haut. On la re-evalue simplement\n  // plus loin, on ne lit rien.\n  if (ice > 0.002 && uFrostDiff > 0.001){\n    // Le decalage suit la PENTE de la glace : la lumiere bave dans le sens des\n    // veines. Un decalage isotrope donnerait un flou gaussien banal.\n    vec2 sp = normalize(iceN + vec2(1e-4, 1e-4)) * uFrostDiff * 0.055;\n    vec2 pp = vec2(-sp.y, sp.x);            // perpendiculaire : etale en 2D\n    float acc = band;\n    for (int k = 0; k < 3; k++){\n      float w = (float(k) + 1.0) / 3.0;\n      // quatre directions par anneau : la lumiere s'etale des deux cotes de la\n      // veine, pas seulement vers l'aval.\n      vec2 o1 = sp * w, o2 = pp * w * 0.7;\n      float a = (uv.x - bandU + wob + warp.x + o1.x) / wU;\n      float b = (uv.y - bandV + wob * 0.6 + warp.y + o1.y) / wV;\n      float c = (uv.x - bandU + wob + warp.x - o2.x) / wU;\n      float d = (uv.y - bandV + wob * 0.6 + warp.y - o2.y) / wV;\n      acc += exp(-(a * a + b * b)) + exp(-(c * c + d * d));\n    }\n    // /7 = 1 echantillon central + 6 satellites. On melange vers la version\n    // diffusee proportionnellement a l'epaisseur de glace : verre nu = net,\n    // croute epaisse = halo.\n    band = mix(band, acc / 7.0, clamp(ice * 1.35, 0.0, 1.0));\n  }\n\n  // \u2500\u2500 Fresnel : le bord arriere (v grand, plus rasant a l'oeil) reflete plus \u2500\n  float fres = pow(clamp(uv.y, 0.0, 1.0), 2.0) * uFresnel;\n\n  // \u2500\u2500 Composition \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // ATTENTION \u2014 mesure au banc du 2026-09-03 (check_sliders.py) : sur un panneau\n  // PLAN, ndh ne depend que de la position du soleil, pas du fragment. A 16.8 deg\n  // d'elevation ndh vaut 0.58 et 0.58^29.5 = 1e-7 : `spec` est nul des que le\n  // soleil descend. Un `graz` qui ne multiplie QUE spec pilote donc un zero, et le\n  // curseur \"Gain rasant\" ne fait rien exactement dans le regime qu'il nomme.\n  // Le gain rasant doit porter sur la BANDE, qui elle vit a toutes les hauteurs.\n  float graz = 1.0 + graze * uGrazing * 2.0;\n  // Le plancher `band * 0.10` posait un voile gris UNIFORME sur toute la vitre :\n  // il remontait le noir et ecrasait le contraste des gouttes. Chris (2026-09-04)\n  // : \u00ab la partie sombre du panneau gagnerait a etre vraiment noire/brillante \u00bb.\n  // On abaisse donc ce plancher et on reporte le gain sur le speculaire, qui est\n  // DIRECTIONNEL -- verre plus noir la ou rien ne se reflete, plus brillant la ou\n  // ca se reflete. C'est le comportement d'un vrai verre de panneau PV, et c'est\n  // ce qui fait ressortir les gouttes.\n  // Le plancher `band * 0.10` posait un voile gris UNIFORME sur la vitre : il\n  // remontait le noir et ecrasait le contraste des gouttes (Chris : \u00ab la partie\n  // sombre gagnerait a etre vraiment noire/brillante \u00bb). On abaisse ce plancher.\n  // En revanche PAS de gain sur le speculaire : un x1.22 essaye le 2026-09-04\n  // elargissait le halo au point de manger le chiffre de production. Le contraste\n  // doit venir du noir plus noir, pas du blanc plus blanc.\n  float lit  = spec * band * graz + band * (0.045 + graze * uGrazing * 0.30)\n             + fres * band * 0.85 * graz;\n\n  // le panneau qui produit a le verre plus \"vivant\" \u2014 lecture d'etat, pas deco\n  lit *= mix(0.72, 1.28, clamp(uPower, 0.0, 1.0));\n\n  // Extinction quand le soleil passe derriere le plan du panneau. On NE multiplie\n  // PAS par ndl brut : a l'aube et au couchant ndl tombe a 0 alors que c'est\n  // precisement le moment ou le verre renvoie le plus (incidence rasante). On garde\n  // donc un plancher, et on ne coupe vraiment que sous l'horizon du panneau.\n  lit *= smoothstep(-0.06, 0.22, ndl) * 0.82 + 0.18 * step(0.0, ndl);\n  lit *= uInten;\n\n  // Nuit : le speculaire s'effondre, mais PAS jusqu'a zero. Un facteur nul,\n  // combine au `discard` plus bas (lit <= 0.0015), jetait TOUS les fragments du\n  // calque verre des la nuit tombee : pluie et givre disparaissaient purement et\n  // simplement (Chris, 2026-09-04, constate sur planche avant/apres). Le plancher\n  // represente l'eclairage ambiant -- la card est elle-meme un objet lumineux, et\n  // une vitre mouillee sous un lampadaire se voit tres bien. Rampe, jamais un pop.\n  lit *= mix(0.16, 1.0, 1.0 - clamp(uNight, 0.0, 1.0));\n\n  // \u2500\u2500 Apport meteo a la luminance \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // Les gouttes et la glace restent des elements de VERRE : ils ne s'allument\n  // que si la vitre recoit de la lumiere. On les module donc par le jour et par\n  // l'incidence, sinon on obtient des gouttes phosphorescentes en pleine nuit.\n  // ... mais PAS jusqu'a zero. La vitre n'est pas dans le noir : la card est\n  // elle-meme un objet lumineux (neon, halo), et une vitre mouillee sous un\n  // lampadaire se voit parfaitement. Un facteur nul faisait disparaitre pluie ET\n  // givre des la nuit tombee (Chris, 2026-09-04) alors que c'est le moment ou le\n  // panneau est le plus sombre -- donc le meilleur fond pour les voir.\n  // Le plancher represente l'eclairage artificiel, pas un reste de soleil.\n  // DECISION Chris, 2026-09-04 : \u00ab c'est pour faire joli c'est pas pour faire\n  // vrai \u00bb, puis \u00ab le soleil c'est un plus sympa mais base pas tout sur ca \u00bb.\n  // Donc : un SOCLE constant (1.0) qui garantit que pluie et givre rendent la\n  // nuit exactement comme en journee, plus un BONUS solaire par-dessus. Le\n  // soleil enrichit, il n'allume pas \u2014 retirer le soleil ne doit jamais faire\n  // disparaitre un effet, seulement le rendre un peu moins vif.\n  // Ne JAMAIS ramener le socle en dessous de 1.0 : c'est ce qui avait fait\n  // disparaitre la pluie des la nuit tombee.\n  float sunbonus = (1.0 - clamp(uNight, 0.0, 1.0)) * smoothstep(-0.06, 0.25, ndl);\n  float daylight = 1.0 + sunbonus * 0.35;\n\n  // l'eau assombrit legerement la vitre entre les eclats (elle absorbe), puis\n  // rend beaucoup plus fort sur le dos de la goutte : c'est ce contraste qui la\n  // fait lire comme un volume et non comme une tache claire.\n  lit *= mix(1.0, 0.82, wet * uRainLvl);\n\n  // \u2500\u2500 Canal METEO, hors de la chaine solaire \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // Pluie et givre ne sont PAS des reflets du soleil : ils ne doivent pas subir\n  // l'extinction par ndl / uNight qui s'applique a `lit` juste au-dessus. On les\n  // accumule a part et on ne les reinjecte qu'avant le discard. Sans cette\n  // separation, les trois attenuateurs empiles les faisaient disparaitre des la\n  // nuit tombee (Chris, 2026-09-04 : \u00ab pluie et givre ne fonctionnent pas la nuit \u00bb).\n  // La goutte a le meme terme de PRESENCE que le givre (`icy * 0.22` plus bas) :\n  // elle se voit parce qu'elle est la, pas parce qu'elle reflete quelque chose.\n  // `glint` seul etait un pur speculaire a ~0.0006 \u2014 invisible des que le panneau\n  // sous elle n'etait plus eclaire. Les deux termes sont CONSTANTS : aucune\n  // ponderation par l'heure (cf `daylight` ci-dessus).\n  float wetlvl = wet * uRainLvl;\n  float meteo  = min(glint * daylight * 26.0, 0.85) + wetlvl * 0.20;\n\n  // -- Le RELIEF de la goutte ------------------------------------------------\n  // Chris, 2026-09-05 : \u00ab vaut mieux se focaliser sur le relief des goutes que\n  // la lumiere je pense \u00bb. La version precedente peignait un film de verre\n  // mouille sur TOUT le quad : mesure a 147 428 px couverts pour un panneau qui\n  // n'en fait que ~86 000, soit ~61 400 px de debordement hors panneau. Le film\n  // est supprime, pas repare : il n'avait aucun equivalent du durcissement qui\n  // borne naturellement le givre (mix(0.72,1.0,...) ne descend jamais sous 0.72).\n  //\n  // La goutte se rend donc comme la glace se rend : par sa NORMALE eclairee par\n  // une source RADIALE en espace ecran (cf `lsrc` du bloc de glace plus bas), qui\n  // donne le galbe rond. Cette source ne depend ni du soleil ni de uNight : c'est\n  // exactement ce que Chris demande depuis le debut - \u00ab tu te bases trop sur la\n  // lumiere du soleil, fais du joli \u00bb.\n  //\n  // `rn` est deja la pente de rainH, mise a l'echelle plus haut (pas e=0.0012\n  // cale sur le rayon de goutte, gain *40). On la REUTILISE : la redemander ici\n  // avec un pas different redonnerait la normale plate du bug du 2026-09-04.\n  // uRainFilm garde son nom d'uniforme (les 3 generateurs ne bougent pas) mais\n  // pilote desormais l'AMPLITUDE DU GALBE, pas un lustre.\n  vec3  Ndrop = normalize(vec3(rn * 2.6 * uRainFilm, 1.0));\n  vec3  ldrop = normalize(vec3(uv * 2.0 - 1.0, 1.0));\n  float dlit  = clamp(dot(Ndrop, ldrop), 0.0, 1.0);\n  // Le lisere : la ou la pente est forte, le bord de la goutte s'assombrit puis\n  // rattrape en creme. C'est ce contraste bord/centre qui fait lire un VOLUME,\n  // la ou un point uniformement blanc ne lisait qu'une etoile.\n  float rim   = clamp(length(rn) * 0.9 * uRainFilm, 0.0, 1.0);\n  // teinte verre mouille, relevee par le jour sans en dependre : de nuit la\n  // goutte garde son galbe (\u00ab la nuit tu mets du givre comme en journee \u00bb).\n  vec3  dropcol = mix(vec3(0.16, 0.21, 0.30),          // le creux, sombre\n                      vec3(0.72, 0.82, 0.96), dlit)    // le dos, clair\n                * mix(1.00, 1.20, sunbonus);\n  dropcol = mix(dropcol, vec3(0.86, 0.92, 1.0), rim * 0.45);\n\n  // Durcissement facon Riccardi, transpose du givre : `wet^3` efface la pellicule\n  // mince entre les gouttes et garde le corps de la goutte. C'est CE terme qui\n  // borne la couverture a l'eau reelle - exactement ce qui manquait au film.\n  float w3    = wet * wet * wet;\n  float kdrop = clamp(w3 * 2.4 * clamp(uRainLvl, 0.0, 1.0), 0.0, 0.92);\n  // la glace est un DEPOT : elle diffuse la lumiere au lieu de la reflechir.\n  float icy  = ice * daylight;\n  // L'eclat vient de la PENTE de la facette face au soleil reel, pas de la norme\n  // du warp (qui melangeait la contribution des gouttes de pluie a celle du givre\n  // \u2014 deux reliefs sans rapport, et l'eclat de la glace suivait donc la pluie).\n  vec3  iN   = normalize(vec3(iceN * 3.2, 1.0));\n  float isp  = pow(max(dot(iN, normalize(Lw + V)), 0.0),\n                   mix(14.0, 6.0, clamp(uNight, 0.0, 1.0))) * uFrostSpec * icy;\n  // Les paillettes tirent leur seuil d'un bruit BLANC, pas d'un fbm : mesure du\n  // 2026-09-03, `step(0.965, fbm2(...))` etait INERTE (amplitude relative 0.004).\n  // Un fbm a 4 octaves concentre ses valeurs autour de 0.5 \u2014 il n'atteint\n  // pratiquement jamais 0.965, donc aucune paillette n'existait, a aucun reglage.\n  // hash() est uniforme sur [0,1] : le seuil se franchit pour de vrai.\n  //\n  // STATIQUE, volontairement (Chris, 2026-09-03 : \u00ab pas besoin d'animer le givre \u00bb).\n  // Le tirage a d'abord dependu de `floor(uTime*3.0)` : les eclats se re-tiraient\n  // 3 fois par seconde. C'est faux physiquement \u2014 sur une vitre givree le\n  // scintillement vient de l'observateur qui se deplace, pas de la glace, et un\n  // panneau dans un dashboard ne bouge pas. C'etait surtout un clignotement\n  // permanent sur un ecran qui reste allume. Le givre est un DEPOT : il se pose,\n  // il reste. Ne pas re-introduire uTime ici.\n  vec2  spkC = floor(uv * vec2(PANEL_AR, 1.0) * uFrostTile * 6.0);\n  float spkR = hash(spkC * 1.37 + 11.7);\n  float spk  = step(0.94, spkR) * uFrostSpark * icy;\n  // Chris, 2026-09-04 : \u00ab quand ca givre le panneau est RECOUVERT (...) faut pas\n  // tout miser sur la brillance, les effets finaux ca ressemble a une\n  // constellation qui clignote \u00bb. Le diagnostic est dans les nombres : le depot\n  // valait `icy * 0.22` face a uFrostSpec=1.10 et uFrostSpark=0.60 \u2014 le brillant\n  // ecrasait la matiere d'un facteur 5, donc on ne voyait QUE les points brillants.\n  // Le givre est d'abord une COUCHE OPAQUE qui recouvre ; les facettes et les\n  // paillettes sont des accents POSES DESSUS, pas l'effet lui-meme.\n  // Ordre de grandeur a preserver : depot >> eclat > paillettes.\n  // Chris, 2026-09-04 : \u00ab c'est un ciel etoile pas du givre \u00bb, puis \u00ab l'effet\n  // frost de la card meteo tu l'as zappe ? \u00bb. Il avait raison sur les deux points,\n  // et le second explique le premier. Ecart ARCHITECTURAL avec la meteo :\n  //\n  //   meteo   : col = mix(col, thick, k);  <- REMPLACE la couleur par de la glace\n  //   solaire : lit += meteo;              <- AJOUTE de la lumiere\n  //\n  // Un canal purement additif ne peut produire que des points lumineux sur fond\n  // noir : c'est la definition d'un ciel etoile. Aucun reglage ne franchit cet\n  // ecart \u2014 balayage de frost_tile 18/28/40/70 le 2026-09-04 : luma 39.06 a 39.39,\n  // soit 0.8% d'ecart sur un facteur 4 de grain. Le grain n'etait pas le sujet.\n  //\n  // On garde ici les seuls accents (facettes + paillettes) ; la COUCHE, elle, est\n  // appliquee plus bas en substitution sur `col`, avec son propre alpha.\n  meteo += isp * 0.22 + spk * 0.35;\n\n  // Reinjection : `lit` porte desormais reflet + meteo. Le discard teste la\n  // somme, donc un fragment qui ne porte QUE de la pluie survit.\n  lit += meteo;\n\n  // Seuil abaisse : avec le plancher de nuit (C1), les gouttes vivent dans des\n  // valeurs de `lit` bien plus basses qu'en plein jour. A 0.0015 elles etaient\n  // jetees ici meme. On garde un discard (il evite de composer un calque vide sur\n  // toute la card, ce qui coute cher) mais assez bas pour ne pas censurer la nuit.\n  // Le discard doit tester la GLACE aussi, pas seulement la lumiere : un fragment\n  // couvert de givre sur un panneau eteint a lit~0 et serait jete ici meme.\n  float kcut = max(clamp(ice * 1.35, 0.0, 0.94), kdrop);\n  if (max(lit, kcut) <= 0.0002) discard;\n\n  vec3 col = mix(uColCold, uColGlow, clamp(uTint, 0.0, 1.0));\n  // le coeur du lobe blanchit : c'est ce qui fait lire \"lumiere\" et non \"calque colore\"\n  col = mix(col, vec3(1.0), clamp(lit * 0.55, 0.0, 0.75));\n\n  // la glace tire vers le blanc-bleute, l'eau vers le blanc pur des speculaires\n  // \u2500\u2500 LA COUCHE DE GLACE, transposee de fx_shader.py (FX_FROST) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  // Modele d'eclairage de Riccardi : la lumiere depend de la POSITION ECRAN,\n  // c'est elle qui donne son galbe rond a la plaque. Une direction fixe rend la\n  // surface plate \u2014 c'est exactement l'ecart que Chris voyait avec l'artifact.\n  vec3  lsrc  = normalize(vec3(uv * 2.0 - 1.0, 1.0));\n  float NdotL = clamp(dot(vec3(iceN * 3.2, 1.0), lsrc), 0.0, 1.0);\n  vec3  col3  = mix(vec3(0.80, 0.82, 0.90), vec3(0.55, 0.78, 1.0), 0.35);\n  // Le speculaire est DANS la glace epaisse, pas ajoute par-dessus : sinon il\n  // brille aussi la ou il n'y a pas de givre.\n  vec3  thick = col3 * NdotL + col3 * isp * 0.6 + col3 * 0.05;\n  // `k` est l'opacite du depot. C'est la ligne qui fait la difference entre une\n  // constellation et une vitre givree : la glace REMPLACE la couleur.\n  // Modele de THICKNESS du shader original de Riccardi (FreezePostProcess.shader,\n  // depot a-riccardi/shader-toy, source donnee par Chris le 2026-09-04) :\n  //   density = lerp(density^5, density, _ThicknessF);\n  //   density = remap(density, [0,1] -> [0, lerp(3.0, 0.75, _ThicknessF)]);\n  //\n  // Ce n'est PAS un terme d'eclairage \u2014 c'est une redistribution de la MATIERE, et\n  // c'est la difference avec le SSS de l'article de blog que j'avais transpose\n  // d'abord (pow(NdotL, p), qui ne fait qu'ajouter de la lumiere). Deux effets :\n  //   - `d*d*d*d*d` durcit le seuil : la glace mince s'efface, l'epaisse reste,\n  //     au lieu d'un voile uniforme sur toute la plaque ;\n  //   - le remap monte au-dessus de 1.0, donc les zones epaisses saturent en\n  //     opacite franche. C'est ce qui fait une vitre givree et pas un calque gris.\n  // uFrostDiff joue le role de _ThicknessF (0 = glace dure et contrastee,\n  // 1 = depot doux et etale).\n  float thF  = clamp(uFrostDiff, 0.0, 1.0);\n  float d5   = icy * icy * icy * icy * icy;\n  float dens = mix(d5, icy, thF) * mix(3.0, 0.75, thF);\n  float k    = clamp(dens, 0.0, 0.94);\n\n  // L'eau AVANT la glace : quand il gele sur une vitre mouillee, c'est la glace\n  // qui recouvre l'eau. Meme geste que la couche de givre : on REMPLACE la\n  // couleur, on ne l'additionne pas.\n  col = mix(col, dropcol, kdrop);\n\n  col = mix(col, thick, k);\n  // Le glint n'est plus le porteur de l'effet (c'etait lui, les \u00ab points\n  // blancs \u00bb) : le relief porte, il ne fait plus qu'accrocher un eclat.\n  col += vec3(0.85, 0.93, 1.0) * glint * daylight * 0.45;\n\n  // La glace est du DEPOT : elle couvre meme la ou le panneau n'est pas eclaire.\n  // `alpha = max(alpha, k)` est la ligne correspondante de la meteo. Sans elle,\n  // la couche calculee juste au-dessus resterait invisible de nuit \u2014 le bug qu'on\n  // vient de corriger reviendrait par la porte de l'alpha.\n  // L'eau aussi est un DEPOT : elle couvre la ou le panneau n'est pas eclaire.\n  // `kdrop` entre dans les DEUX max \u2014 dans outA (sinon la couche est invisible)\n  // et dans le multiplicateur de col (sinon elle est calculee puis eteinte par\n  // lit~0 des la nuit tombee). Et comme `kdrop` derive de wet^3, il ne couvre\n  // QUE l'eau reelle : c'est ce qui empeche l'alpha de deborder du panneau.\n  float kall = max(max(lit, k), kdrop);\n  float outA = clamp(kall, 0.0, 1.0);\n  gl_FragColor = vec4(col * kall, outA);\n}\n";

/* Le panneau de la card est deja un plan analytique : PANEL_OF / _homography
   ci-dessus projettent le carre unite sur le quadrilatere du panneau. On passe
   au shader l INVERSE de cette homographie : chaque fragment remonte de l ecran
   vers l UV du panneau, l eclairement se calcule en espace PLAT, et la
   perspective vient gratuitement. On ne reconstruit rien en espace ecran --
   et surtout on ne duplique pas les constantes : elles sont lues juste au-dessus. */
function _inv3(m) {
  const a=m[0],b=m[1],c=m[2], d=m[3],e=m[4],f=m[5], g=m[6],h=m[7],i=m[8];
  const A=e*i-f*h, B=-(d*i-f*g), C=d*h-e*g;
  const det=a*A+b*B+c*C;
  return [ A/det, (c*h-b*i)/det, (b*f-c*e)/det,
           B/det, (a*i-c*g)/det, (c*d-a*f)/det,
           C/det, (b*g-a*h)/det, (a*e-b*d)/det ];
}
/* _homography() renvoie une closure ; le shader veut les 9 coefficients. On
   refait le calcul ferme sur les MEMES PANEL_OF -- une seule source de verite
   pour la geometrie. */
function _homographyCoefs([x0,y0],[x1,y1],[x2,y2],[x3,y3]) {
  const sx=x0-x1+x2-x3, sy=y0-y1+y2-y3;
  const dx1=x1-x2, dx2=x3-x2, dy1=y1-y2, dy2=y3-y2;
  const den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-sy*dx2)/den, h=(sy*dx1-sx*dy1)/den;
  return [ x1-x0+g*x1, x3-x0+h*x3, x0,
           y1-y0+g*y1, y3-y0+h*y3, y0,
           g,           h,          1 ];   // ligne-majeure
}
/* ⚠️ GLSL mat3 est COLONNE-majeure : sans cette transposition le reflet est
   pose de travers, et aucune erreur n est levee. */
const GL_INV_H = (function () {
  const m = _inv3(_homographyCoefs(PANEL_OF[0], PANEL_OF[1], PANEL_OF[2], PANEL_OF[3]));
  return new Float32Array([ m[0],m[3],m[6], m[1],m[4],m[7], m[2],m[5],m[8] ]);
})();

/* Le shader veut trois flottants ; l editeur accepte tout ce que CSS accepte --
   #RGB, #RRGGBB, rgb(), et surtout var(--primary-color), qui est la valeur par
   defaut de plusieurs couleurs de la card. Ne lire que #RRGGBB rendait ces
   couleurs BLANCHES dans le reflet alors qu elles s affichaient correctement
   partout ailleurs. On delegue la resolution au navigateur (une seule fois par
   valeur, le resultat est memoise : appele a chaque frame). */
const _COLCACHE = new Map();

function _hex2rgb(hx, el) {
  const key = String(hx == null ? '' : hx).trim();
  if (!key) return [1, 1, 1];
  const hit = _COLCACHE.get(key);
  if (hit) return hit;

  let out = null, m6cached = false;
  const m6 = /^#([0-9a-f]{6})$/i.exec(key);
  if (m6) {
    const v = parseInt(m6[1], 16);
    out = [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    m6cached = true;
  }
  if (!out) {
    const m3 = /^#([0-9a-f]{3})$/i.exec(key);
    if (m3) {
      const s = m3[1];
      out = [parseInt(s[0] + s[0], 16) / 255,
             parseInt(s[1] + s[1], 16) / 255,
             parseInt(s[2] + s[2], 16) / 255];
      m6cached = true;
    }
  }
  if (!out) {
    /* var(...), rgb(...), hsl(...), nom CSS : on laisse le navigateur resoudre.
       Une var() ne se resout que dans un element de l arbre ou elle est definie,
       d ou le `el` -- le wrap de la card, pas un div detache. */
    try {
      const host = el || document.body;
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
      probe.style.color = key;
      host.appendChild(probe);
      const got = getComputedStyle(probe).color;
      probe.remove();
      const mm = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(got || '');
      if (mm) out = [mm[1] / 255, mm[2] / 255, mm[3] / 255];
    } catch (e) { /* pas de DOM (harnais headless) : on retombe sur le blanc */ }
  }

  /* Ne memoiser QUE les valeurs intrinseques (hex) : une var(--...) resolue
     par getComputedStyle depend du theme courant, et la figer ici garderait la
     couleur du premier theme vu dans le reflet GL alors que le DOM, lui, suit
     le changement de theme. */
  if (out && m6cached) _COLCACHE.set(key, out);
  return out || [1, 1, 1];
}

function _glCompile(gl, type, srcTxt) {
  const s = gl.createShader(type);
  gl.shaderSource(s, srcTxt);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    /* Un shader qui ne compile pas donne un panneau SANS reflet, en silence.
       On le dit en console : sinon on cherche un bug de cablage pendant une heure. */
    console.error('[neon-solar-webgl] shader :', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

const GL_UNIFORMS = ['uRes', 'uInvH', 'uVB', 'uTime', 'uSunAlt', 'uSunX', 'uNight', 'uTilt', 'uGloss', 'uInten', 'uGrazing', 'uSpread', 'uPower', 'uShimmer', 'uColCold', 'uColGlow', 'uTint', 'uFresnel', 'uRainLvl', 'uRainSize', 'uRainDens', 'uRainSpec', 'uRainSlide', 'uRainWarp', 'uRainFilm', 'uFrostLvl', 'uFrostTile', 'uFrostStr', 'uFrostSpec', 'uFrostSpark', 'uFrostCoins', 'uFrostDiff'];

class NeonSolarCardWebgl extends HTMLElement {

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
    this._gl           = null;   // couche WebGL du reflet (variante webgl)
    this._glRaf        = 0;      // /!\ distinct de _rafId : celui-ci coalesce le DOM
    this._glVisible    = true;   // pilote par l IntersectionObserver
    this._glTick       = (t) => {
      /* La boucle s auto-annule des qu elle cesse d etre utile : contexte perdu,
         card hors ecran, ou plus aucune animation a jouer. Rallumee par
         _glSync(). */
      if (!this._gl || !this._glVisible || !this._glAnimated()) { this._glRaf = 0; return; }
      this._glRaf = requestAnimationFrame(this._glTick);
      this._glFrame(t);
    };
    /* Repeindre UNE frame hors boucle : c est ce qui garde le reflet juste quand
       la boucle est eteinte (reduce_animations, ou aucun effet anime actif).
       Sans ca, un `reduce_animations: true` figerait le reflet sur sa premiere
       frame et il cesserait de suivre la production. */
    this._glPaint      = () => {
      this._glPaintReq = 0;
      if (this._gl) this._glFrame(performance.now());
    };
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
    if (this._cachedEls && !this._gl) this._glGraft();
  }

  /** Clean up timers when the element is removed from the DOM. */
  disconnectedCallback() {
    if (this._rafId)       { cancelAnimationFrame(this._rafId); this._rafId = 0; }
    this._glTeardown();
    if (this._holdTimer)   { clearTimeout(this._holdTimer);     this._holdTimer = 0; }
    if (this._dblTapTimer) { clearTimeout(this._dblTapTimer);   this._dblTapTimer = 0; }
  }

  /* ── HA integration hooks ────────────────────────────── */

  /** Return the editor custom-element tag for the visual config UI. */
  static getConfigElement() { return document.createElement('neon-solar-card-webgl-editor'); }

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
    const _prevEnt = this._config?.entity;
    this._config    = buildConfig(raw || {});
    this._colors    = null;   // force palette re-resolve
    this._rendered  = false;
    this._cachedEls = null;
    this._lastActive  = 0;
    this._lastGlowKey = '';
    this._lastEffBand = -1;
    /* Purger les caches de DONNEES seulement si la SOURCE a change : des valeurs
       heritees de l ancien capteur bloqueraient le dirty-check si elles
       coincidaient avec les nouvelles. L editeur, lui, rappelle setConfig a
       chaque frappe (config-changed) : purger la aussi relancerait _fetchHistory
       a chaque cran de curseur -- une rafale sur l API history pour rien. */
    if (_prevEnt !== undefined && _prevEnt !== this._config.entity) {
      this._lastPower = this._prevPower = null;
      this._lastDaily = this._lastSec = this._lastLux = null;
      this._lastWeather = this._lastForecast = null;
      this._history = [];
      this._histFetchTs = 0;
    }
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
      // Invalider le cache : sans ca, un capteur qui revient avec la MEME valeur
      // ne declenche aucun update et l affichage reste fige sur l indisponible.
      this._lastPower = null;
      this._lastDaily = this._lastSec = this._lastLux = null;
      this._lastWeather = this._lastForecast = null;
      return;
    }
    if (this._unavailable) this._clearUnavailable();

    // Parse and normalise power value to watts
    const rawVal = parseFloat(st);
    if (isNaN(rawVal)) return;
    const power = c.input_unit === 'kW' ? rawVal * 1000 : rawVal;

    // Read auxiliary sensor values
    const daily    = c.daily_entity      && hass.states[c.daily_entity]      ? _finite(hass.states[c.daily_entity].state)      : null;
    const sec      = c.secondary_entity  && hass.states[c.secondary_entity]  ? hass.states[c.secondary_entity].state              : null;
    const lux      = c.luminosity_entity && hass.states[c.luminosity_entity] ? _finite(hass.states[c.luminosity_entity].state) : null;
    const weather  = c.weather_entity    && hass.states[c.weather_entity]    ? hass.states[c.weather_entity].state                : null;
    const forecastRaw = c.forecast_entity && hass.states[c.forecast_entity]  ? _finite(hass.states[c.forecast_entity].state)   : null;
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
    // Le rafraichissement de l historique est TEMPOREL : il doit rester joignable
    // meme quand rien ne bouge (nuit, plafond d onduleur), donc AVANT le return.
    const _now = Date.now();
    if (_now - this._histFetchTs > 5 * 60 * 1000) {
      this._histFetchTs = _now;
      this._fetchHistory(c.entity);
    }
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
    const neonBarGlow    = c.neon_bar_glow;
    const neonBadgeGlow  = c.neon_badge_glow;
    const neonMiniGlow   = c.neon_mini_glow;
    const cyberpunk = c.cyberpunk_mode;
    const neonCol   = c.color_neon_glow || col.primary;
    // Titre — pattern canonique nmc/entities/storey : couleur icône hérite de la couleur titre (2 niveaux, pas d'accent)
    const titleColor = c.color_title || col.text;
    const iconCol     = c.title_icon_color || titleColor;
    const titleGlowColor = c.title_glow_color || neonCol;
    const titleGlowSizeN = parseFloat(c.title_glow_size) || 12;
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
        ${neonCardGlow
          ? `box-shadow: 0 0 ${Math.round(sat*0.15)}px ${neonCol}${satLo}, 0 0 ${Math.round(sat*0.4)}px ${neonCol}${satMd};`
          : ''}
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
        display:block; width:${c.icon_size}px; height:${c.icon_size}px; color:${iconCol}; flex-shrink:0;
        filter: ${(() => {
          if (c.title_glow) {
            // Glow canonique 4-couches (cf ha-neon-css §3ter) : blanc + 3 couches croissantes
            const s = titleGlowSizeN;
            return `drop-shadow(0 0 ${Math.round(s*0.2)}px #fff) drop-shadow(0 0 ${Math.round(s*0.4)}px ${titleGlowColor}) drop-shadow(0 0 ${Math.round(s*0.8)}px ${titleGlowColor}) drop-shadow(0 0 ${s}px ${titleGlowColor})`;
          }
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
        font-size: clamp(14px, ${hdrFs}px, ${hdrFs}px);
        font-family: ${titleFont};
        font-weight: ${c.title_font_weight || 600};
        font-style: ${c.title_italic ? 'italic' : 'normal'};
        text-transform: ${c.title_uppercase ? 'uppercase' : 'none'};
        ${c.title_gradient
          ? `background:linear-gradient(90deg,${c.title_gradient_from || 'var(--primary-color, #00E8FF)'},${c.title_gradient_to || 'var(--accent-color, #FF50A0)'});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`
          : `color:${titleColor};`}
        overflow: visible;
        white-space: nowrap;
        min-width: 0;
        letter-spacing: ${c.title_letter_spacing || '0.5px'};
		text-shadow: ${c.title_shadow
          ? c.title_shadow
          : c.title_glow
            ? `0 0 ${Math.round(titleGlowSizeN*0.2)}px #fff, 0 0 ${Math.round(titleGlowSizeN*0.4)}px ${titleGlowColor}, 0 0 ${Math.round(titleGlowSizeN*0.8)}px ${titleGlowColor}, 0 0 ${titleGlowSizeN}px ${titleGlowColor}`
            : '1px 1px 2px rgba(0, 0, 0, 0.2)'};
        ${reduceAnim ? '' : 'transition: text-shadow 0.4s;'}
        ${c.title_flicker ? 'animation: nsc-title-flicker 3.2s infinite steps(1);' : ''}
      }
      @keyframes nsc-title-flicker {
        0%, 91%, 93%, 96%, 100% { opacity: 1; }
        92%, 94.5% { opacity: 0.55; }
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
      aria-label="${_esc(c.name || 'Solar Production')} card">

      <!-- ── Header ──────────────────────────────── -->
      <div class="hdr">
        <svg class="hdr-icon" id="hdr-icon" viewBox="0 0 24 24">
          <path fill="currentColor" id="hdr-icon-path" d="${MDI_SUN}"/>
        </svg>
        <div class="hdr-title">${_esc(c.name || 'Production Solaire')}</div>
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
      this._holdTriggered = false;
      this._holdTimer = setTimeout(() => {
        this._holdTimer = 0;
        this._holdTriggered = true;   // le timer est deja a 0 : sans ce drapeau
        this._handleAction('hold_action');   // le click qui suit passerait aussi
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
      if (this._holdTriggered) { this._holdTriggered = false; return; } // hold deja joue
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


  /* ── Couche WebGL ──────────────────────────────────── */

  /**
   * Greffe le canvas du reflet dans #panel-wrap.
   * Appelee depuis _cacheEls() : la card se re-rend a chaque setConfig et a
   * chaque changement de theme, ce qui detruit le shadow DOM precedent. Se
   * greffer la garantit qu on suit chaque re-render au lieu d orpheliner le
   * canvas (et de fuir un contexte GL a chaque fois).
   */
  _glGraft() {
    /* Pas de garde-fou d idempotence ici : il serait du CODE MORT. setConfig fait
       _cachedEls = null puis _renderShell(), qui reecrit tout le shadow DOM --
       #panel-wrap est donc un element NEUF a chaque appel, et tout test
       `this._gl.wrap === wrap` est faux par construction. Mesure du 2026-09-04 :
       12 setConfig d affilee -> 12 contextes crees, mais `canvas_unique: 1` et
       `gl_toujours_actif: true`, parce que _glTeardown() appelle loseContext()
       AVANT chaque greffe : jamais deux contextes vivants. C est du churn
       (~10-50 ms par recreation), pas une fuite. Si l editeur parait poussif,
       le correctif non invasif est un debounce de _glGraft (~150 ms, annule
       dans disconnectedCallback) -- avec le symptome en main, pas avant. */
    this._glTeardown();
    if (!this._config || this._config.sheen_gl === false) return;
    const wrap = this._cachedEls && this._cachedEls.panelWrap;
    if (!wrap) return;

    const cv = document.createElement('canvas');
    /* ⚠️ inset:0 ne dimensionne PAS un canvas (element remplace) :
       width/height 100% sont obligatoires, sinon il est dpr fois trop grand.
       Piege paye au banc -- invisible a dpr 1, donc facile a rater.
       z-index:2 : le reflet vit SUR la vitre, donc par-dessus les cellules
       (contrairement au thermometre, dont le verre refracte le fond). */
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
                       'z-index:2;pointer-events:none';
    wrap.appendChild(cv);

    const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false,
                                        antialias: false, depth: false });
    if (!gl) { cv.remove(); return; }          /* pas de GL : la card reste nominale */

    const vs = _glCompile(gl, gl.VERTEX_SHADER,   GL_VERT);
    const fs = _glCompile(gl, gl.FRAGMENT_SHADER, GL_FRAG);
    if (!vs || !fs) { cv.remove(); return; }
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('[neon-solar-webgl] link :', gl.getProgramInfoLog(p));
      cv.remove(); return;
    }
    gl.useProgram(p);

    /* /!\ Le balayage CSS fige (.panel-sheen) n est eteint qu ICI, une fois le
       contexte obtenu ET le programme lie. Masque plus tot (juste avant
       getContext, la forme naturelle), les trois sorties ci-dessus -- pas de
       WebGL, shader qui ne compile pas, link en echec -- laissaient le panneau
       SANS aucun reflet : ni le balayage CSS, ni le canvas. C est le fallback
       inatteignable deja paye sur linux-terminal-card-webgl le 2026-07-25. */
    const sheen = this.shadowRoot.querySelector('.panel-sheen');
    if (sheen) sheen.style.display = 'none';

    /* Triangle plein-ecran : 3 sommets, pas de quad -- une passe, zero overdraw. */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const U = {};
    GL_UNIFORMS.forEach((n) => { U[n] = gl.getUniformLocation(p, n); });

    this._gl = { cv, gl, U, prog: p, wrap, w: 0, h: 0, t0: performance.now() };
    /* Frame initiale TOUJOURS peinte, avant tout observer : cf _glObserve(). */
    this._glFrame(0);
    this._glObserve();
    this._glSync();
  }

  /** Libere le contexte GL. Un canvas orphelin par re-render = fuite GPU. */
  _glTeardown() {
    if (this._glRaf) { cancelAnimationFrame(this._glRaf); this._glRaf = 0; }
    if (this._glPaintReq) { cancelAnimationFrame(this._glPaintReq); this._glPaintReq = 0; }
    if (this._glIO) { try { this._glIO.disconnect(); } catch (e) {} this._glIO = null; }
    if (this._glRO) { try { this._glRO.disconnect(); } catch (e) {} this._glRO = null; }
    this._glVisible = true;
    if (!this._gl) return;
    const { gl, cv } = this._gl;
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    this._gl = null;
    /* Rendre le balayage CSS : sans ca un teardown (deconnexion, changement de
       config) laisse le panneau mat jusqu au prochain re-render reussi. */
    const sheen = this.shadowRoot && this.shadowRoot.querySelector('.panel-sheen');
    if (sheen) sheen.style.display = '';
  }

  /**
   * Position du soleil. Convention partagee avec weather-neon-card-webgl
   * (_skySun) : une seule verite pour les deux cards.
   * `sun.sun` fait autorite pour la nuit -- l ephemeride est exacte a la minute,
   * la card n a pas a la deviner a partir du lux (cf project_weather_card_nuit).
   */
  _glSun() {
    const st = this._hass && this._hass.states && this._hass.states['sun.sun'];
    const a = st && st.attributes;
    let elev = a && typeof a.elevation === 'number' ? a.elevation : null;
    let az   = a && typeof a.azimuth   === 'number' ? a.azimuth   : null;
    if (elev === null) {
      /* Pas d entite sun.sun : repli sur l heure locale, une course de soleil
         approximative vaut mieux qu un reflet fige. */
      const h = new Date().getHours() + new Date().getMinutes() / 60;
      elev = 60 * Math.sin(Math.max(0, (h - 6) / 12) * Math.PI);
      az   = 90 + Math.max(0, Math.min(1, (h - 6) / 12)) * 180;
    }
    return { elev, az: az === null ? 180 : az };
  }

  /**
   * Niveau de pluie effectif : la METEO decide, pas un curseur.
   * Meme mapping que weather-neon-card-webgl (l.1775) pour que les deux cards
   * mouillent en meme temps. rain_lvl reste dispo comme forcage manuel : s il
   * est configure a > 0 il gagne, sinon on lit weather_entity.
   * Sans weather_entity : panneau sec, sauf rain_lvl force ou toggle demo.
   */
  _rainLevel() {
    const c = this._config || {};
    const manual = c.rain_lvl ?? 0;
    if (manual > 0.001) return manual;
    const st = c.weather_entity && this._hass
      ? this._hass.states[c.weather_entity] : null;
    if (!st) return 0;
    const cond = st.state;
    if (cond === 'pouring') return 1;
    if (cond === 'rainy' || cond === 'lightning-rainy') return 0.6;
    if (cond === 'snowy-rainy') return 0.4;
    return 0;
  }

  /**
   * Y a-t-il quelque chose a ANIMER ? Deux curseurs seulement bougent dans le
   * temps : le shimmer du reflet et le glissement des gouttes. Tout le reste du
   * shader est statique -- le rejouer 60 fois par seconde peint 60 fois la meme
   * image. Et sous reduce_animations, uTime est fige a 0 : la boucle est alors
   * du pur gaspillage.
   */
  _glAnimated() {
    const c = this._config || {};
    if (c.reduce_animations ?? IS_LOW_POWER) return false;
    const shimmer = c.sheen_shimmer ?? 0;
    const rain    = this._rainLevel() || (c.rain_demo ? 1 : 0);
    const slide   = c.rain_slide ?? 0;
    return shimmer > 0.001 || (rain > 0.001 && slide > 0.001);
  }

  /** Demande une frame unique (coalescee), sans demarrer la boucle. */
  _glRepaint() {
    if (!this._gl || this._glRaf || this._glPaintReq) return;
    this._glPaintReq = requestAnimationFrame(this._glPaint);
  }

  /**
   * Aligne l etat de la boucle sur la realite : elle tourne si la card est
   * visible ET qu il y a quelque chose a animer, sinon une frame suffit.
   * Appelee a la greffe, a chaque mise a jour de donnees, au resize, au
   * changement de config et quand la visibilite bascule.
   */
  _glSync() {
    if (!this._gl) return;
    if (this._glVisible && this._glAnimated()) {
      if (!this._glRaf) this._glRaf = requestAnimationFrame(this._glTick);
    } else {
      if (this._glRaf) { cancelAnimationFrame(this._glRaf); this._glRaf = 0; }
      if (this._glVisible) this._glRepaint();
    }
  }

  /**
   * IntersectionObserver + ResizeObserver.
   * /!\ La premiere frame est peinte inconditionnellement a la greffe, AVANT
   * que l observer ne se prononce : sous un harnais headless (probe.py) ou dans
   * un onglet de dashboard non visible, l observer ne declenche jamais et une
   * card qui n aurait attendu que lui resterait vide.
   */
  _glObserve() {
    const R = this._gl;
    if (!R || typeof IntersectionObserver === 'undefined') return;
    try {
      this._glIO = new IntersectionObserver((ents) => {
        const vis = ents.some((e) => e.isIntersecting);
        if (vis === this._glVisible) return;
        this._glVisible = vis;
        this._glSync();
      }, { threshold: 0 });
      this._glIO.observe(R.wrap);
    } catch (e) { /* pas d IO : on garde la boucle telle quelle */ }

    if (typeof ResizeObserver === 'undefined') return;
    try {
      /* getBoundingClientRect() par frame etait le second cout de la boucle.
         Le resize est un evenement : on le traite comme tel. */
      this._glRO = new ResizeObserver(() => this._glRepaint());
      this._glRO.observe(R.wrap);
    } catch (e) { /* idem */ }
  }

  /** Une frame de la couche GL. */
  _glFrame(t) {
    const R = this._gl;
    if (!R) return;
    const c = this._config;
    const { gl, U } = R;

    const r = R.wrap.getBoundingClientRect();
    if (!r.width || !r.height) return;         /* card repliee : rien a peindre */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(r.width  * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w !== R.w || h !== R.h) {
      R.cv.width = w; R.cv.height = h; R.w = w; R.h = h;
      gl.viewport(0, 0, w, h);
    }
    /* Le SVG du panneau est en viewBox "0 0 400 180" avec width:100% : l echelle
       pixels -> viewBox est le rapport de largeur, identique en x et en y. */
    const sc = w / 400;

    const reduce = c.reduce_animations ?? IS_LOW_POWER;
    const col = this._resolveColors();
    const cold = _hex2rgb(col.cold, R.wrap);
    const glow = _hex2rgb(c.color_neon_glow || col.primary, R.wrap);

    const sun = this._glSun();
    const alt = Math.sin(sun.elev * Math.PI / 180);
    const sx  = Math.max(-0.2, Math.min(1.2, (sun.az - 90) / 180));
    /* Extinction en RAMPE sur les derniers degres avant l horizon, jamais en pop.
       C est aussi ce qui evite d empiler deux attenuateurs : le nightOverlay du
       panneau (opacity 0.6) assombrit les cellules, uNight eteint le reflet --
       chacun son calque, pas deux voiles gris l un sur l autre. */
    const night = 1 - Math.max(0, Math.min(1, (sun.elev + 1.0) / 3.0));

    /* Production normalisee : le reflet suit ce que le panneau produit vraiment. */
    const pw = Math.max(0, Math.min(1, (this._lastPower || 0) / (c.max_power || 5000)));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uRes, w, h);
    gl.uniform2f(U.uVB, sc, sc);
    gl.uniformMatrix3fv(U.uInvH, false, GL_INV_H);
    gl.uniform1f(U.uTime, reduce ? 0 : (t - R.t0) / 1000);
    gl.uniform1f(U.uSunAlt, alt);
    gl.uniform1f(U.uSunX,   sx);
    gl.uniform1f(U.uNight,  night);
    gl.uniform1f(U.uPower,  pw);
    gl.uniform3f(U.uColCold, cold[0], cold[1], cold[2]);
    gl.uniform3f(U.uColGlow, glow[0], glow[1], glow[2]);
    gl.uniform1f(U.uTilt, c.sheen_tilt);
    gl.uniform1f(U.uGloss, c.sheen_gloss);
    gl.uniform1f(U.uInten, c.sheen_inten);
    gl.uniform1f(U.uGrazing, c.sheen_grazing);
    gl.uniform1f(U.uSpread, c.sheen_spread);
    gl.uniform1f(U.uShimmer, reduce ? 0 : c.sheen_shimmer);
    gl.uniform1f(U.uTint, c.sheen_tint);
    gl.uniform1f(U.uFresnel, c.sheen_fresnel);
    gl.uniform1f(U.uRainLvl,  c.rain_demo  ? Math.max(0.45, this._rainLevel())  : this._rainLevel());
    gl.uniform1f(U.uRainSize, c.rain_size);
    gl.uniform1f(U.uRainDens, c.rain_dens);
    gl.uniform1f(U.uRainSlide, reduce ? 0 : c.rain_slide);
    gl.uniform1f(U.uRainSpec, c.rain_spec);
    gl.uniform1f(U.uRainWarp, c.rain_warp);
    gl.uniform1f(U.uRainFilm, c.rain_film);
    gl.uniform1f(U.uFrostLvl, c.frost_demo ? Math.max(0.45, c.frost_lvl) : c.frost_lvl);
    gl.uniform1f(U.uFrostCoins, c.frost_coins);
    gl.uniform1f(U.uFrostTile, c.frost_tile);
    gl.uniform1f(U.uFrostStr, c.frost_str);
    gl.uniform1f(U.uFrostSpec, c.frost_spec);
    gl.uniform1f(U.uFrostDiff, c.frost_diff);
    gl.uniform1f(U.uFrostSpark, c.frost_spark);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

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
    this._glGraft();
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

    /* Le reflet GL suit la production, le theme et l heure. La boucle RAF
       pouvant etre eteinte, on lui demande explicitement une frame ici. */
    this._glSync();
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
    // Couleur par défaut = pattern canonique header (icon_color hérite du titre), pas color_icon/primary
    const headerIconCol = this._config.title_icon_color || this._config.color_title || col.text;
    let iconPath = MDI_SUN;
    let iconColor = headerIconCol;

    if (weather && WEATHER_ICONS[weather]) {
      iconPath  = WEATHER_ICONS[weather];
      iconColor = headerIconCol;
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
    const fKey = _fnv(hf);
    const tKey = c.production_threshold ?? 'not';
    const key  = `${_fnv(h)}|${fKey}|${tKey}`;
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

if (!customElements.get('neon-solar-card-webgl-editor')) {
  customElements.define('neon-solar-card-webgl-editor', NeonSolarCardWebglEditor);
}

if (!customElements.get('neon-solar-card-webgl')) {
  customElements.define('neon-solar-card-webgl', NeonSolarCardWebgl);
}

/* Console banner — useful for debugging version mismatches */
console.info(
  '%c NEON-SOLAR-CARD %c v' + VERSION + ' ',
  'color:#FFD23F;font-weight:700;background:#080808;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF6B35;font-weight:700;background:#080808;padding:2px 6px;border-radius:0 3px 3px 0',
);

/* Register in HA's custom-card picker */
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'neon-solar-card-webgl' || c.type === 'custom:neon-solar-card-webgl')) {
  window.customCards.push({
    type:        'neon-solar-card-webgl',
    name:        'Neon Solar Production Card (WebGL)',
    description: 'Solar panel card with animated cells, sparkline, night mode, weather & production threshold',
    preview:     true,
  });
}

console.info(
  '%c ☀️ neon-solar-production-card v2.1.1 %c Neo Tokyo ',
  'background:#FFD700;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FF6A00;padding:2px 4px;border-radius:0 3px 3px 0;'
);
