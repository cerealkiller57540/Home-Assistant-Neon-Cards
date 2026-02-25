/**
 * neon-solar-card v1.0.0
 * Solar panel production card for Home Assistant
 *
 * Installation:
 *   1. Copy to /config/www/neon-solar-card.js
 *   2. Resources → /local/neon-solar-card.js (type: module)
 *
 * Minimal config:
 *   type: custom:neon-solar-card
 *   entity: sensor.solar_power
 *   max_power: 5000
 */

const VERSION = '2.0.0';

// ═══════════════════════════════════════════════════════
//  CONFIG  — all nulls inherit from HA theme / auto-detect
// ═══════════════════════════════════════════════════════
function buildConfig(raw) {
  return {
    // Entities
    entity:             raw.entity             || null,  // required
    daily_entity:       raw.daily_entity       || null,  // kWh today
    secondary_entity:   raw.secondary_entity   || null,
    secondary_label:    raw.secondary_label    || null,
    secondary_unit:     raw.secondary_unit     || null,
    forecast_entity:    raw.forecast_entity    || null,  // solar forecast kWh
    luminosity_entity:  raw.luminosity_entity  || null,  // lux for night detect
    weather_entity:     raw.weather_entity     || null,

    // Actions (HA standard: more-info | toggle | call-service | navigate | url | none)
    tap_action:         raw.tap_action         || { action: 'more-info' },
    hold_action:        raw.hold_action        || { action: 'more-info' },
    double_tap_action:  raw.double_tap_action  || { action: 'none' },

    // Display
    name:               raw.name               || null,
    max_power:          raw.max_power          ?? 5000,  // W — for efficiency calc
    unit:               'W',                           // internal always W (normalized from input_unit)
    input_unit:         raw.input_unit         ?? 'W',   // sensor unit: 'W' or 'kW'
    decimal_places:     raw.decimal_places     ?? 0,
    animation_speed:    raw.animation_speed    ?? 1,
    night_threshold:    raw.night_threshold    ?? 10,    // lux below = night

    // Features
    show_history:       raw.show_history       ?? true,
    show_efficiency:    raw.show_efficiency    ?? true,
    glow_effect:        raw.glow_effect        ?? true,

    // Cyberpunk
    cyberpunk_mode:  raw.cyberpunk_mode  ?? false,
    neon_glow:       raw.neon_glow       ?? false,

    // Typography
    font_size:          raw.font_size          ?? 'medium',  // small | medium | large
    header_font_size:   raw.header_font_size   ?? 'medium',  // small | medium | large

    // Colors (null = HA theme)
    color_primary:      raw.color_primary      || null,
    color_hot:          raw.color_hot          || null,
    color_mid:          raw.color_mid          || null,
    color_cold:         raw.color_cold         || null,
    color_text:         raw.color_text         || null,
    color_icon:         raw.color_icon         || null,
    color_badge:        raw.color_badge        || null,
  };
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
let _cssCache = {}, _cssCacheTs = 0;
function cssVar(name, fallback) {
  const now = Date.now();
  if (now - _cssCacheTs > 30000) { _cssCache = {}; _cssCacheTs = now; }
  if (_cssCache[name] !== undefined) return _cssCache[name];
  if (typeof getComputedStyle !== 'undefined') {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (v) return (_cssCache[name] = v);
  }
  return (_cssCache[name] = fallback);
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
let _uid = 0;
function uid() { return 'nsc' + (++_uid); }

/** Parse hex #RRGGBB → [r,g,b] — hoisted to avoid per-call function alloc */
function hex2rgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

/** Interpolate hex color: cold(0) → mid(0.5) → hot(1), t in [0,1] */
function lerpColor(t, cold, mid, hot) {
  const [c1, c2] = t < 0.5 ? [hex2rgb(cold), hex2rgb(mid)] : [hex2rgb(mid), hex2rgb(hot)];
  const s = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  return `rgb(${Math.round(c1[0]+(c2[0]-c1[0])*s)},${Math.round(c1[1]+(c2[1]-c1[1])*s)},${Math.round(c1[2]+(c2[2]-c1[2])*s)})`;
}

function fmtPower(w, unit = 'W', dec = 0) {
  if (unit === 'W' && w >= 1000) return (w / 1000).toFixed(1) + ' kW';
  return w.toFixed(dec) + ' ' + unit;
}

// ═══════════════════════════════════════════════════════
//  MDI SVG PATHS  — allocated once at module scope
// ═══════════════════════════════════════════════════════
const MDI_SUN  = 'M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z';
const MDI_MOON = 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,3.93L13.5,1L14.56,3.93L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.9L18.5,9L19.19,10.9L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.33 6.2,9.53 6.04,6.7C3.23,9.86 3.24,14.63 6.15,17.83C9.07,21.04 13.8,21.14 17.33,17.97Z';
const WEATHER_ICONS = {
  'sunny':          MDI_SUN,
  'clear-night':    MDI_MOON,
  'partlycloudy':   'M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z',
  'cloudy':         'M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z',
  'rainy':          'M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03Z',
  'pouring':        'M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z',
  'snowy':          'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.85 14,14.38L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.15 10,21.62L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z',
  'windy':          'M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M5,12H19A3,3 0 0,1 22,15A3,3 0 0,1 19,18C18.17,18 17.42,17.66 16.88,17.12C16.5,16.73 16.5,16.1 16.88,15.71C17.27,15.32 17.9,15.32 18.29,15.71C18.47,15.89 18.72,16 19,16A1,1 0 0,0 20,15A1,1 0 0,0 19,14H4A1,1 0 0,1 3,13A1,1 0 0,1 4,12H5Z',
  'fog':            'M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9A4,4 0 0,1 23,13A4,4 0 0,1 19,17V15A2,2 0 0,0 21,13A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12H1Z',
  'hail':           'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A1,1 0 0,1 11,19A1,1 0 0,1 10,20A1,1 0 0,1 9,19A1,1 0 0,1 10,18M14,18A1,1 0 0,1 15,19A1,1 0 0,1 14,20A1,1 0 0,1 13,19A1,1 0 0,1 14,18M12,22A1,1 0 0,1 13,23A1,1 0 0,1 12,24A1,1 0 0,1 11,23A1,1 0 0,1 12,22Z',
  'lightning':      'M7,2V13H10V22L17,10H13L17,2H7Z',
  'lightning-rainy':'M4.5,13.59C3.6,13.08 3,12.11 3,11A3,3 0 0,1 6,8C6.37,8 6.73,8.07 7.06,8.19C7.45,5.82 9.5,4 12,4A5,5 0 0,1 17,9V10H19A2,2 0 0,1 21,12A2,2 0 0,1 19,14H16.5L13,21L14.5,14H11L12,10H9.53C9.18,10 8.82,10.08 8.5,10.24L8,11L9,14.5L6.5,14C5.67,13.59 5,12.88 4.5,13.59Z',
  'exceptional':    'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
};
// Aliases for integrations that use different state names
WEATHER_ICONS['partly-cloudy']       = WEATHER_ICONS['partlycloudy'];
WEATHER_ICONS['partly_cloudy']       = WEATHER_ICONS['partlycloudy'];
WEATHER_ICONS['clear']               = MDI_SUN;
WEATHER_ICONS['clear_night']         = MDI_MOON;
WEATHER_ICONS['thunderstorm']        = WEATHER_ICONS['lightning'];
WEATHER_ICONS['snow']                = WEATHER_ICONS['snowy'];
WEATHER_ICONS['rain']                = WEATHER_ICONS['rainy'];
WEATHER_ICONS['wind']                = WEATHER_ICONS['windy'];
WEATHER_ICONS['mist']                = WEATHER_ICONS['fog'];
WEATHER_ICONS['tornado']             = WEATHER_ICONS['exceptional'];
WEATHER_ICONS['hurricane']           = WEATHER_ICONS['exceptional'];

// ═══════════════════════════════════════════════════════
//  PANEL GEOMETRY — 24 modules × 2 rects = 48 cells
// ═══════════════════════════════════════════════════════
const MODULES = [
  // Row 1 (top, narrowest)
  { x: 36,  y: 28, w: 54, h: 24 }, { x: 92,  y: 28, w: 54, h: 24 },
  { x: 148, y: 28, w: 54, h: 24 }, { x: 204, y: 28, w: 54, h: 24 },
  { x: 260, y: 28, w: 54, h: 24 }, { x: 316, y: 28, w: 54, h: 24 },
  // Row 2
  { x: 32,  y: 52, w: 56, h: 32 }, { x: 90,  y: 52, w: 56, h: 32 },
  { x: 148, y: 52, w: 56, h: 32 }, { x: 206, y: 52, w: 56, h: 32 },
  { x: 264, y: 52, w: 56, h: 32 }, { x: 322, y: 52, w: 56, h: 32 },
  // Row 3
  { x: 26,  y: 84, w: 58, h: 32 }, { x: 86,  y: 84, w: 58, h: 32 },
  { x: 146, y: 84, w: 58, h: 32 }, { x: 206, y: 84, w: 58, h: 32 },
  { x: 266, y: 84, w: 58, h: 32 }, { x: 326, y: 84, w: 58, h: 32 },
  // Row 4 (bottom, widest)
  { x: 20,  y: 116, w: 60, h: 36 }, { x: 82,  y: 116, w: 60, h: 36 },
  { x: 144, y: 116, w: 60, h: 36 }, { x: 206, y: 116, w: 60, h: 36 },
  { x: 268, y: 116, w: 60, h: 36 }, { x: 330, y: 116, w: 60, h: 36 },
];

// ═══════════════════════════════════════════════════════
//  PANEL SVG SKELETON
// ═══════════════════════════════════════════════════════
function buildPanelSkeleton(id, cold) {
  // Pre-build 48 cells with staggered animation delays
  const cells = MODULES.flatMap((m, i) => {
    const r1h = (m.h * 0.47).toFixed(1);
    const r2y = (m.y + m.h * 0.47 + m.h * 0.06).toFixed(1);
    const r2h = (m.h * 0.47).toFixed(1);
    return [
      `<rect data-ci="${i*2}"   x="${m.x}" y="${m.y}"  width="${m.w}" height="${r1h}"
         rx="1" fill="${cold}" opacity="0.07" style="animation-delay:${(i*0.07).toFixed(2)}s"/>`,
      `<rect data-ci="${i*2+1}" x="${m.x}" y="${r2y}" width="${m.w}" height="${r2h}"
         rx="1" fill="${cold}" opacity="0.07" style="animation-delay:${(i*0.07+0.035).toFixed(2)}s"/>`,
    ];
  }).join('\n');

  return `<svg id="${id}-svg" viewBox="0 0 400 180" width="100%"
    preserveAspectRatio="xMidYMid meet" style="display:block"
    shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#1e1e1e"/>
      <stop offset="100%" stop-color="#060606"/>
    </linearGradient>
    <linearGradient id="${id}-glare" x1="0%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.13"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <path d="M10 160 L390 160 L370 20 L30 20 Z" fill="#000"/>
  <path d="M18 152 L382 152 L364 28 L36 28 Z" fill="url(#${id}-bg)"/>

  <g stroke="#181818" stroke-width="1">
    <line x1="32"  y1="52"  x2="368" y2="52"/>
    <line x1="26"  y1="84"  x2="374" y2="84"/>
    <line x1="20"  y1="116" x2="380" y2="116"/>
  </g>
  <g stroke="#181818" stroke-width="1">
    <line x1="92"  y1="28" x2="82"  y2="152"/>
    <line x1="148" y1="28" x2="143" y2="152"/>
    <line x1="204" y1="28" x2="204" y2="152"/>
    <line x1="260" y1="28" x2="265" y2="152"/>
    <line x1="316" y1="28" x2="326" y2="152"/>
  </g>

  <g id="${id}-cells">${cells}</g>

  <path d="M18 152 L382 152 L364 28 L36 28 Z"
    fill="url(#${id}-glare)" pointer-events="none"/>

  <path id="${id}-night" d="M18 152 L382 152 L364 28 L36 28 Z"
    fill="#000820" opacity="0" pointer-events="none"/>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  SPARKLINE  — rebuilt only when history fingerprint changes
// ═══════════════════════════════════════════════════════
function buildSparkline(history, colors, unit, dec) {
  if (!history || history.length < 2) return '';
  const { primary, hot, cold } = colors;
  const W = 360, H = 36, PY = 10;

  let hMin = Infinity, hMax = -Infinity, hSum = 0, peakIdx = 0;
  for (let i = 0; i < history.length; i++) {
    const v = history[i];
    if (v < hMin) hMin = v;
    if (v > hMax) { hMax = v; peakIdx = i; }
    hSum += v;
  }
  const hAvg = hSum / history.length;
  const hRange = Math.max(hMax - hMin, 0.1);
  const n = history.length - 1;

  // Smooth bezier — control points at 40% of adjacent horizontal distance
  const pts = history.map((v, i) => ({
    x: Math.round((i / n) * W),
    y: PY + Math.round(H * (1 - (v - hMin) / hRange)),
  }));
  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i].x - pts[i-1].x) * 0.38;
    line += ` C ${(pts[i-1].x + cp).toFixed(1)} ${pts[i-1].y},`
          + ` ${(pts[i].x - cp).toFixed(1)} ${pts[i].y},`
          + ` ${pts[i].x} ${pts[i].y}`;
  }
  const fill = `${line} L ${W} ${PY+H} L 0 ${PY+H} Z`;
  const peakPt = pts[peakIdx];
  const pkLabelX = clamp(peakPt.x, 24, W - 38);
  const pkLabelY = Math.max(peakPt.y - 8, PY + 8);
  const sid = uid();

  return `<svg viewBox="0 0 ${W} ${PY+H+22}" width="100%"
    preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible"
    shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${sid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${hot}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${hot}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <path d="${fill}" fill="url(#${sid})"/>
  <path d="${line}" fill="none" stroke="${hot}" stroke-width="2" stroke-linecap="round"/>
  <line x1="0" y1="${PY+H}" x2="${W}" y2="${PY+H}" stroke="${primary}" stroke-width="0.5" opacity="0.2"/>
  <!-- Peak marker -->
  <circle cx="${peakPt.x}" cy="${peakPt.y}" r="3.5" fill="${hot}"/>
  <circle cx="${peakPt.x}" cy="${peakPt.y}" r="6" fill="${hot}" opacity="0.2"/>
  <text x="${pkLabelX}" y="${pkLabelY}" fill="${hot}" font-size="8.5"
    font-family="Rajdhani,monospace" text-anchor="middle" font-weight="700"
    >▲ ${fmtPower(hMax, unit, dec)}</text>
  <!-- X axis time markers -->
  <g font-family="Rajdhani,monospace" fill="${primary}" opacity="0.4" font-size="8" text-anchor="middle">
    <text x="0"         y="${PY+H+15}">T-24</text>
    <text x="${W*0.25}" y="${PY+H+15}">T-18</text>
    <text x="${W*0.5}"  y="${PY+H+15}">T-12</text>
    <text x="${W*0.75}" y="${PY+H+15}">T-6</text>
    <text x="${W}"      y="${PY+H+15}" font-weight="700" opacity="0.75">NOW</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  i18n  — FR / EN based on navigator.language
// ═══════════════════════════════════════════════════════
const LABELS = {
  fr: {
    entities:'Entités', display:'Affichage', colors:'Couleurs', advanced:'Avancé',
    entity:'Entité production (W) *', daily:'Production journalière (kWh)',
    secondary:'Capteur secondaire', secLabel:'Label capteur sec.', secUnit:'Unité capteur sec.',
    forecast:'Prévision solaire (kW)', lux:'Capteur luminosité (lux)',
    name:'Nom / titre', inputUnit:'Unité capteur', maxPower:'Puissance max (W)', dec:'Décimales',
    speed:'Vitesse animation', nightLux:'Seuil nuit (lux)',
    history:'Historique 24h', efficiency:'Afficher efficacité', glow:'Effet lueur',
    cyberpunk:'Mode Neo Tokyo', neonGlow:'Lueur néon',
    fontSize:'Taille valeur', headerFontSize:'Taille titre',
    colorPrimary:'Couleur principale', colorCold:'Froide (min)',
    colorMid:'Milieu', colorHot:'Chaude (max)',
    colorIcon:'Couleur icône', colorBadge:'Couleur badges',
    small:'Petit', medium:'Moyen', large:'Grand',
  },
  en: {
    entities:'Entities', display:'Display', colors:'Colors', advanced:'Advanced',
    entity:'Production entity (W) *', daily:'Daily production (kWh)',
    secondary:'Secondary sensor', secLabel:'Secondary label', secUnit:'Secondary unit',
    forecast:'Solar forecast (kW)', lux:'Luminosity sensor (lux)',
    name:'Name / title', inputUnit:'Sensor unit', maxPower:'Max power (W)', dec:'Decimal places',
    speed:'Animation speed', nightLux:'Night threshold (lux)',
    history:'24h history', efficiency:'Show efficiency', glow:'Glow effect',
    cyberpunk:'Neo Tokyo Mode', neonGlow:'Neon Glow',
    fontSize:'Value font size', headerFontSize:'Header font size',
    colorPrimary:'Primary color', colorCold:'Cold (min)',
    colorMid:'Mid', colorHot:'Hot (max)',
    colorIcon:'Icon color', colorBadge:'Badge color',
    small:'Small', medium:'Medium', large:'Large',
  },
};
function T() {
  return (navigator?.language || 'en').toLowerCase().startsWith('fr') ? LABELS.fr : LABELS.en;
}

// ═══════════════════════════════════════════════════════
//  EDITOR
// ═══════════════════════════════════════════════════════
class NeonSolarCardEditor extends HTMLElement {
  setConfig(cfg) { this._cfg = cfg; if (!this._built && this._hass) { this._built = true; this._build(); } }
  set hass(h)    { this._hass = h;  if (!this._built && this._cfg)  { this._built = true; this._build(); } }

  _sensors()  { return !this._hass ? [] : Object.keys(this._hass.states).filter(e => e.startsWith('sensor.') || e.startsWith('input_number.')).sort(); }
  _weathers() { return !this._hass ? [] : Object.keys(this._hass.states).filter(e => e.startsWith('weather.')).sort(); }

  _eInput(label, key, list, hint = '') {
    const v = this._cfg[key] || '', id = `dl-${key.replace(/\W/g,'')}`;
    return `<div class="f"><label>${label}</label>
      <input type="text" data-key="${key}" data-e="1" value="${v}" list="${id}" placeholder="sensor.example" autocomplete="off">
      <datalist id="${id}">${list.map(e=>`<option value="${e}">`).join('')}</datalist>
      ${hint?`<p class="h">${hint}</p>`:''}</div>`;
  }
  _tArea(label, key, ph = '') {
    const v = this._cfg[key] ?? '';
    return `<div class="f"><label>${label}</label>
      <textarea data-key="${key}" rows="1" class="ta" placeholder="${ph}">${v}</textarea></div>`;
  }
  _num(label, key, min, max, step = 1) {
    const v = this._cfg[key] ?? '';
    return `<div class="f"><label>${label}</label>
      <input type="number" data-key="${key}" value="${v}" min="${min}" max="${max}" step="${step}"></div>`;
  }
  _toggle(label, key) {
    const v = !!this._cfg[key];
    return `<div class="f tog"><label>${label}</label>
      <label class="sw"><input type="checkbox" data-key="${key}" ${v?'checked':''}><span class="sl"></span></label></div>`;
  }
  _color(label, key, def) {
    const v = this._cfg[key] || '';
    return `<div class="f"><label>${label}</label>
      <div class="cr">
        <input type="color" data-key="${key}" value="${v||def}" ${!v?'style="opacity:.4"':''}>
        <input type="text"  data-key="${key}" value="${v}" placeholder="${def}" class="ct">
        <span class="rs" data-reset="${key}">↺</span>
      </div></div>`;
  }

  _select(label, key, opts) {
    const v = this._cfg[key] ?? opts[0][0];
    const options = opts.map(([val, lbl]) =>
      `<option value="${val}" ${v === val ? 'selected' : ''}>${lbl}</option>`
    ).join('');
    return `<div class="f"><label>${label}</label>
      <select data-key="${key}" data-sel="1">${options}</select></div>`;
  }

  _build() {
    const t = T(), s = this._sensors(), w = this._weathers();
    this.innerHTML = `<style>
      :host{display:block;padding:4px 0}
      h3{font-size:12px;font-weight:700;color:var(--primary-color);text-transform:uppercase;letter-spacing:1.5px;
         margin:18px 0 8px;padding-bottom:5px;border-bottom:1px solid var(--divider-color);
         display:flex;align-items:center;gap:6px}
      h3::before{content:'';display:block;width:3px;height:13px;background:var(--primary-color);border-radius:2px}
      .f{margin-bottom:10px}
      .tog{display:flex;align-items:center;justify-content:space-between;gap:4px}
      .tog label:first-child{flex:1}
      label{display:block;font-size:12px;color:var(--secondary-text-color);margin-bottom:3px}
      input[type=text],input[type=number],select,textarea{width:100%;padding:6px 8px;border-radius:6px;
        border:1px solid var(--divider-color);background:var(--card-background-color);
        color:var(--primary-text-color);font-size:13px;box-sizing:border-box;font-family:inherit}
      .ta{resize:none;overflow:hidden;min-height:34px;line-height:1.4}
      input[type=color]{height:34px;width:40px;padding:2px;border-radius:6px;
        border:1px solid var(--divider-color);cursor:pointer;flex-shrink:0}
      .cr{display:flex;gap:6px;align-items:center}
      .ct{flex:1}
      .rs{font-size:13px;color:var(--primary-color);cursor:pointer;padding:4px 6px;
          border-radius:4px;border:1px solid var(--divider-color);line-height:1;flex-shrink:0;user-select:none}
      .r2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
      .g2{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .h{font-size:10px;color:var(--disabled-text-color);margin:3px 0 0}
      .sw{position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0}
      .sw input{opacity:0;width:0;height:0}
      .sl{position:absolute;inset:0;background:var(--divider-color);border-radius:20px;cursor:pointer;transition:.3s}
      .sl:before{content:'';position:absolute;width:14px;height:14px;left:3px;bottom:3px;
                 background:#fff;border-radius:50%;transition:.3s}
      input:checked+.sl{background:var(--primary-color)}
      input:checked+.sl:before{transform:translateX(16px)}
    </style>

    <h3>${t.entities}</h3>
    ${this._eInput(t.entity,   'entity',            s)}
    ${this._select(t.inputUnit,'input_unit',[['W','W — Watts'],['kW','kW — Kilowatts']])}
    ${this._eInput(t.daily,    'daily_entity',      s)}
    ${this._eInput(t.secondary,'secondary_entity',  s)}
    <div class="r2">
      ${this._tArea(t.secLabel,'secondary_label','RENDEMENT')}
      ${this._tArea(t.secUnit, 'secondary_unit', '%')}
    </div>
    ${this._eInput(t.forecast, 'forecast_entity',   s)}
    ${this._eInput(t.lux,      'luminosity_entity', s)}
    ${this._eInput(t.weather,  'weather_entity',    w)}

    <h3>${t.display}</h3>
    ${this._tArea(t.name,    'name',    'Production Solaire')}
    <div class="r3">
      ${this._num(t.maxPower,'max_power',100,50000,100)}
      ${this._num(t.dec,     'decimal_places',0,2,1)}
      ${this._num(t.speed,   'animation_speed',0.1,5,0.1)}
    </div>
    ${this._num(t.nightLux,'night_threshold',0,1000,5)}
    <div class="r2">
      ${this._select(t.fontSize, 'font_size', [['small',t.small],['medium',t.medium],['large',t.large]])}
      ${this._select(t.headerFontSize, 'header_font_size', [['small',t.small],['medium',t.medium],['large',t.large]])}
    </div>
    <div class="g2">
      ${this._toggle(t.history,    'show_history')}
      ${this._toggle(t.efficiency, 'show_efficiency')}
    </div>

    <h3>GLOW</h3>
    <div class="g2">
      ${this._toggle(t.glow,       'glow_effect')}
    </div>

    <h3>CYBERPUNK</h3>
    <div class="g2">
      ${this._toggle(t.cyberpunk, 'cyberpunk_mode')}
      ${this._toggle(t.neonGlow,  'neon_glow')}
    </div>

    <h3>${t.colors} <span style="font-size:10px;font-weight:400;opacity:.6">(empty = HA theme)</span></h3>
    ${this._color(t.colorPrimary,'color_primary','#FFD23F')}
    <div class="r3">
      ${this._color(t.colorCold,'color_cold','#00E8FF')}
      ${this._color(t.colorMid, 'color_mid', '#FFD23F')}
      ${this._color(t.colorHot, 'color_hot', '#FF6B35')}
    </div>
    <div class="r2">
      ${this._color(t.colorIcon,  'color_icon',  '#FFD23F')}
      ${this._color(t.colorBadge, 'color_badge', '#FFD23F')}
    </div>`;

    // ── Wire color pickers ──
    this.querySelectorAll('input[type=color]').forEach(pk => {
      const k = pk.dataset.key;
      const tx = this.querySelector(`.ct[data-key="${k}"]`);
      if (!tx) return;
      pk.addEventListener('input', e => { e.stopPropagation(); tx.value = pk.value; this._ch(k, pk.value); }, { passive:true });
      tx.addEventListener('blur',  e => { e.stopPropagation(); if (/^#[0-9a-fA-F]{6}$/.test(tx.value)) pk.value = tx.value; this._ch(k, tx.value || null); });
      tx.addEventListener('keydown', e => e.stopPropagation(), { passive:true });
      tx.addEventListener('input',   e => e.stopPropagation(), { passive:true });
    });
    this.querySelectorAll('[data-reset]').forEach(el => {
      el.addEventListener('click', () => {
        const k = el.dataset.reset;
        const pk = this.querySelector(`input[type=color][data-key="${k}"]`);
        const tx = this.querySelector(`.ct[data-key="${k}"]`);
        if (pk) pk.style.opacity = '0.4';
        if (tx) tx.value = '';
        this._ch(k, null);
      });
    });
    // Entity inputs
    this.querySelectorAll('[data-e]').forEach(el => {
      ['keydown','keyup','input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), { passive:true }));
      ['change','blur'].forEach(ev => el.addEventListener(ev, e => { e.stopPropagation(); this._ch(el.dataset.key, el.value||null); }));
    });
    // Select fields (e.g. input_unit dropdown)
    this.querySelectorAll('[data-sel]').forEach(el => {
      el.addEventListener('change', e => { e.stopPropagation(); this._ch(el.dataset.key, el.value || null); });
    });
    // Other fields — exclude color, entity inputs and selects already handled above
    this.querySelectorAll('[data-key]:not([type=color]):not([data-e]):not([data-sel])').forEach(el => {
      if (el.type === 'checkbox') { el.addEventListener('change', e => { e.stopPropagation(); this._ch(el.dataset.key, el.checked); }); return; }
      if (el.type === 'number')   { el.addEventListener('change', e => { e.stopPropagation(); this._ch(el.dataset.key, el.value===''?null:parseFloat(el.value)); }); return; }
      ['keydown','keyup','input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), { passive:true }));
      el.addEventListener('blur', e => { e.stopPropagation(); this._ch(el.dataset.key, el.value===''?null:el.value); });
    });
  }

  _ch(key, val) {
    const cfg = { ...this._cfg };
    if (val === null || val === '' || val === undefined) delete cfg[key]; else cfg[key] = val;
    this._cfg = cfg;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles:true, composed:true }));
  }
}
customElements.define('neon-solar-card-editor', NeonSolarCardEditor);

// ═══════════════════════════════════════════════════════
//  MAIN CARD
// ═══════════════════════════════════════════════════════
class NeonSolarCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // State tracking (diff)
    this._lastPower    = null;  this._prevPower    = null;
    this._lastDaily    = null;  this._lastSec      = null;
    this._lastLux      = null;
    this._lastWeather  = null;  this._lastForecast = null;
    this._lastRatio    = -1;    // for cell patch throttle
    this._lastActive   = 0;     // for delta cell patching
    this._lastGlowKey  = '';    // for glow filter cache
    this._lastEffBand  = -1;    // for eff badge color band cache

    // Render
    this._rendered     = false;
    this._svgId        = uid();
    this._config       = null;
    this._hass         = null;
    this._colors       = null;
    this._cachedEls    = null;

    // RAF
    this._rafId        = 0;
    this._pendingUp    = null;

    // History
    this._history      = [];
    this._histFetchTs  = 0;

    // Tap action
    this._dblTapTimer  = 0;
    this._holdTimer    = 0;
  }

  disconnectedCallback() {
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = 0; }
    if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = 0; }
    if (this._dblTapTimer) { clearTimeout(this._dblTapTimer); this._dblTapTimer = 0; }
  }

  static getConfigElement() { return document.createElement('neon-solar-card-editor'); }
  static getStubConfig() {
    return { entity: 'sensor.solar_power', daily_entity: 'sensor.solar_energy_today',
             name: 'Production Solaire', max_power: 5000, show_history: true, show_efficiency: true };
  }
  getCardSize() { return this._config?.show_history ? 5 : 3; }

  setConfig(raw) {
    // Do NOT throw — HA calls setConfig with empty config when adding from dashboard
    this._config   = buildConfig(raw);
    this._colors   = null;
    this._rendered = false;
    this._cachedEls = null;
    this._lastActive  = 0;
    this._lastGlowKey = '';
    this._lastEffBand = -1;
    if (this.shadowRoot.firstChild) this._render();
  }

  _resolveColors() {
    if (this._colors) return this._colors;
    const c = this._config;
    // Neo Tokyo cyberpunk preset
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

  set hass(hass) {
    this._hass = hass;
    const c = this._config;
    if (!c) return;

    // Render shell on very first hass call, even if entity not yet configured.
    // Critical: HA calls set hass BEFORE the user picks an entity in the editor,
    // so shadowRoot must not be empty when setConfig is called again with the entity.
    if (!this._rendered) {
      this._rendered = true;
      this._renderShell();
    }

    // Nothing to display yet if entity not configured
    if (!c.entity) return;

    const ps = hass.states[c.entity];
    if (!ps) return;

    // Handle unavailable / unknown states
    const st = ps.state;
    if (st === 'unavailable' || st === 'unknown') {
      this._showUnavailable(st);
      return;
    }
    // Clear unavailable state if previously set
    if (this._unavailable) this._clearUnavailable();

    const rawVal = parseFloat(st);
    if (isNaN(rawVal)) return;
    // Normalize sensor value to watts regardless of sensor unit
    const power = c.input_unit === 'kW' ? rawVal * 1000 : rawVal;

    const daily   = c.daily_entity     && hass.states[c.daily_entity]     ? parseFloat(hass.states[c.daily_entity].state)     : null;
    const sec     = c.secondary_entity && hass.states[c.secondary_entity] ? hass.states[c.secondary_entity].state             : null;
    const lux     = c.luminosity_entity&& hass.states[c.luminosity_entity]? parseFloat(hass.states[c.luminosity_entity].state): null;
    const weather = c.weather_entity   && hass.states[c.weather_entity]   ? hass.states[c.weather_entity].state               : null;
    const forecast= c.forecast_entity  && hass.states[c.forecast_entity]  ? parseFloat(hass.states[c.forecast_entity].state)  : null;

    // Diff — only update on meaningful change
    const pw = this._lastPower === null || Math.abs(power - this._lastPower) >= 1;
    const dw = daily    !== this._lastDaily;
    const sw = sec      !== this._lastSec;
    const lw = lux      !== this._lastLux;
    const ww = weather  !== this._lastWeather;
    const fw = forecast !== this._lastForecast;

    if (!pw && !dw && !sw && !lw && !ww && !fw) return;

    this._prevPower    = this._lastPower;
    this._lastPower    = power;   this._lastDaily   = daily;
    this._lastSec      = sec;     this._lastLux     = lux;
    this._lastWeather  = weather; this._lastForecast= forecast;

    // Fetch history (first load, then every 5 min)
    const now = Date.now();
    if (now - this._histFetchTs > 5 * 60 * 1000) {
      this._histFetchTs = now;
      this._fetchHistory(c.entity);
    }

    // Batch into single rAF
    this._pendingUp = { power, daily, sec, lux, weather, forecast };
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0;
        const u = this._pendingUp;
        if (u) { this._pendingUp = null; this._updateDOM(u); }
      });
    }
  }

  async _fetchHistory(entityId) {
    try {
      const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const data = await this._hass.callApi('GET',
        `history/period/${start}?filter_entity_id=${entityId}&minimal_response=true&no_attributes=true`);
      if (!data?.[0] || data[0].length < 2) return;
      const raw = data[0].filter(s => !isNaN(parseFloat(s.state)));
      const step = Math.max(1, Math.floor(raw.length / 48));
      // Normalize history to watts (same as live value normalization)
      const toW = v => this._config.input_unit === 'kW' ? v * 1000 : v;
      this._history = raw.filter((_, i) => i % step === 0).slice(-48).map(s => toW(parseFloat(s.state)));
      if (this._rendered) this._updateSparkline();
    } catch (e) { console.debug('[neon-solar-card] history fetch failed:', e); }
  }

  _render() {
    if (this._hass && this._config?.entity) {
      this._rendered = true;
      this._renderShell();
      if (this._lastPower !== null) {
        this._updateDOM({ power: this._lastPower, daily: this._lastDaily, sec: this._lastSec,
          lux: this._lastLux, weather: this._lastWeather, forecast: this._lastForecast });
      }
    }
  }

  _renderShell() {
    const c      = this._config;
    const col    = this._resolveColors();
    const dur       = (2 / (c.animation_speed || 1)).toFixed(1);
    const id        = this._svgId;
    const neonGlow  = c.neon_glow;
    const cyberpunk = c.cyberpunk_mode;
    const iconCol   = c.color_icon || col.primary;
    const valFs     = c.font_size === 'small' ? 24 : c.font_size === 'large' ? 40 : 32;
    const hdrFs     = c.header_font_size === 'small' ? 12 : c.header_font_size === 'large' ? 18 : 15;
    const unitFs    = Math.max(10, Math.round(valFs * 0.375));

    this.shadowRoot.innerHTML = `<style>
      :host {
        display: block;
        --nsc-font: var(--ha-card-font-family, var(--paper-font-common-base, var(--primary-font-family, 'Rajdhani, monospace')));
      }
      ha-card {
        padding: 14px 14px 12px;
        box-sizing: border-box;
        cursor: pointer;
        transition: box-shadow 0.45s ease;
        background: ${col.bg};
        border-radius: var(--ha-card-border-radius, 12px);
      }
      ha-card:hover { filter: brightness(1.04); }

      /* Header */
      .hdr { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
      .hdr-icon { width:22px; height:22px; color:${iconCol}; flex-shrink:0;
        filter: ${cyberpunk ? 'none' : `drop-shadow(0 0 5px ${iconCol}90)`}; transition: color 0.4s; }
      .hdr-title { flex:1; font-size:${hdrFs}px; font-weight:600;
        font-family: var(--nsc-font);
        color:${col.text}; letter-spacing:0.5px; }
      .hdr-right { display:grid; grid-template-columns: auto auto; gap:4px 8px; align-items:center; }
      .hdr-mini { cursor:pointer; text-align:right; }
      .hdr-mini-label { font-size:10px; font-family:var(--nsc-font);
        color:${col.text}; opacity:0.35; letter-spacing:0.8px; text-transform:uppercase; }
      .hdr-mini-value { font-size:12px; font-weight:700; font-family:var(--nsc-font);
        color:${col.text}; }
      .eff-badge { font-size:10px; font-family:var(--nsc-font); letter-spacing:0.5px;
        border-radius:4px; padding:2px 5px; transition: all 0.3s; grid-column: span 2;
        text-align:center; margin-top:1px; }

      /* Cyberpunk corner brackets (div-based, SVG pseudo-elements don't exist) */
      .cp-tl,.cp-br { position:absolute; width:14px; height:14px; z-index:2; pointer-events:none;
        opacity:${c.cyberpunk_mode ? '0.7' : '0'}; transition: opacity 0.3s; }
      .cp-tl { top:0; left:0; border-top:2px solid ${col.primary}; border-left:2px solid ${col.primary}; }
      .cp-br { bottom:0; right:0; border-bottom:2px solid ${col.primary}; border-right:2px solid ${col.primary}; }

      /* Panel */
      .panel-wrap { position:relative; margin:0 -4px;
        filter: ${neonGlow
          ? `drop-shadow(0 0 4px ${col.primary}) drop-shadow(0 8px 20px ${col.primary}60)`
          : `drop-shadow(0 8px 18px ${col.primary}28)`};
        transition: filter 0.4s; }

      /* Value overlay */
      .val-overlay { position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%); text-align:center; pointer-events:none; }
      .val-main { font-size:${valFs}px; font-weight:900; font-family:var(--nsc-font);
        line-height:1; color:${col.text};
        text-shadow: ${neonGlow
          ? `0 0 5px #fff, 0 0 12px ${col.primary}, 0 0 28px ${col.primary}`
          : `0 2px 14px rgba(0,0,0,.85), 0 0 10px ${col.primary}50`}; }
      .val-unit  { font-size:${unitFs}px; font-family:var(--nsc-font);
        color:${col.text}; opacity:0.5; margin-top:2px; }

      /* Status badges — inline in header */
      .badges { display:flex; gap:4px; align-items:center; flex-shrink:0; }
      .badge { width:20px; height:20px; display:block;
        filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
        opacity:0.9; transition: filter 0.3s; }

      /* Efficiency bar */
      .eff-bar-wrap { margin:5px 0 8px; height:4px;
        background:${col.primary}1a; border-radius:2px; overflow:hidden; }
      .eff-bar { height:100%; width:0%; border-radius:2px;
        background: linear-gradient(90deg, ${col.cold}, ${col.mid}, ${col.hot});
        transition: width 0.65s cubic-bezier(.4,0,.2,1); }



      /* Sparkline section */
      .spark-section { padding-top:8px; border-top:1px solid ${col.text}12; margin-top:4px; }
      .spark-header { display:flex; justify-content:space-between; align-items:center;
        margin-bottom:6px; }
      .spark-hdr-label { font-size:8.5px; font-family:var(--nsc-font);
        letter-spacing:1.5px; color:${col.text}; opacity:0.35; text-transform:uppercase; }
      .spark-hdr-right { font-size:8.5px; font-family:var(--nsc-font);
        color:${col.mid}; opacity:0.8; letter-spacing:0.5px; }
      .spark-stats { display:flex; justify-content:space-between; margin-bottom:5px; }
      .spark-stat { display:flex; flex-direction:column; align-items:center; }
      .ss-label { font-size:8.5px; font-family:var(--nsc-font);
        color:${col.text}; opacity:0.35; letter-spacing:0.5px; }
      .ss-val { font-size:13px; font-weight:700; font-family:var(--nsc-font); color:${col.text}; }
      .ss-val.hot { color:${col.hot}; } .ss-val.cold { color:${col.cold}; }

      /* CSS pulse animation (opacity only, GPU-friendly) */
      @keyframes solar-pulse {
        0%,100% { opacity: var(--co, 0.75); }
        50%     { opacity: 1.0; }
      }
      .cell-on { animation: solar-pulse ${dur}s ease-in-out infinite;
        will-change: opacity; }
    </style>

    <ha-card id="ha-card" role="button" tabindex="0"
      aria-label="${c.name || 'Solar Production'} card">
      <!-- ── Header ─────────────────────── -->
      <div class="hdr">
        <svg class="hdr-icon" id="hdr-icon" viewBox="0 0 24 24">
          <path fill="currentColor" id="hdr-icon-path"
            d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/>
        </svg>
        <div class="hdr-title">${c.name || 'Production Solaire'}</div>
        <div class="badges" id="badges"></div>
        <div class="hdr-right">
          ${c.daily_entity ? `<div class="hdr-mini" id="hdr-daily" data-entity="${c.daily_entity}">
            <div class="hdr-mini-label">TODAY</div>
            <div class="hdr-mini-value" id="daily-val">-- kWh</div>
          </div>` : ''}
          ${c.secondary_entity ? `<div class="hdr-mini" data-entity="${c.secondary_entity}">
            <div class="hdr-mini-label">${(c.secondary_label||'SENSOR').toUpperCase()}</div>
            <div class="hdr-mini-value"><span id="sec-val">--</span> ${c.secondary_unit||''}</div>
          </div>` : ''}
          ${c.forecast_entity ? `<div class="hdr-mini" data-entity="${c.forecast_entity}">
            <div class="hdr-mini-label">FORECAST</div>
            <div class="hdr-mini-value"><span id="forecast-val">--</span> <span id="forecast-unit">W</span></div>
          </div>` : ''}
          ${c.show_efficiency ? `<div class="eff-badge" id="eff-badge">-- %</div>` : ''}
        </div>
      </div>

      <!-- ── Solar Panel + overlay ──────── -->
      <div class="panel-wrap" id="panel-wrap">
        <div class="cp-tl"></div><div class="cp-br"></div>
        ${buildPanelSkeleton(id, col.cold)}
        <div class="val-overlay">
          <div class="val-main"  id="val-main">--</div>
          <div class="val-unit"  id="val-unit">${c.unit}</div>
        </div>
      </div>

      <!-- ── Efficiency bar ─────────────── -->
      ${c.show_efficiency ? `<div class="eff-bar-wrap"><div class="eff-bar" id="eff-bar"></div></div>` : ''}

      <!-- ── Sparkline ─────────────────── -->
      ${c.show_history ? `<div class="spark-section">
        <div class="spark-header">
          <span class="spark-hdr-label">ANALYSE 24H</span>
          <span class="spark-hdr-right" id="spark-eff">EFF. -- %</span>
        </div>
        <div class="spark-stats">
          <div class="spark-stat"><span class="ss-label">MIN</span><span class="ss-val cold" id="sp-min">--</span></div>
          <div class="spark-stat"><span class="ss-label">AVG</span><span class="ss-val" id="sp-avg">--</span></div>
          <div class="spark-stat"><span class="ss-label">MAX</span><span class="ss-val hot"  id="sp-max">--</span></div>
        </div>
        <div id="zone-spark"></div>
      </div>` : ''}
    </ha-card>`;

    // ── Tap / Hold / Double-tap action wiring ──────────
    const card = this.shadowRoot.querySelector('#ha-card');
    card.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      this._holdTimer = setTimeout(() => {
        this._holdTimer = 0;
        this._handleAction('hold_action');
      }, 500);
    }, { passive:true });
    card.addEventListener('pointerup', () => {
      if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = 0; }
    }, { passive:true });
    card.addEventListener('pointercancel', () => {
      if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = 0; }
    }, { passive:true });
    card.addEventListener('click', e => {
      // Ignore if hold already fired
      if (!this._holdTimer && this._holdTimer !== 0) return;
      const dblAction = this._config.double_tap_action;
      if (dblAction && dblAction.action !== 'none') {
        if (this._dblTapTimer) {
          clearTimeout(this._dblTapTimer); this._dblTapTimer = 0;
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
    }, { passive:true });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._handleAction('tap_action'); }
    });
    // Sub-entity taps (daily, secondary, forecast) always open more-info
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(el =>
      el.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(el.dataset.entity); }, { passive:true })
    );

    this._cacheEls();
  }

  _cacheEls() {
    const sr = this.shadowRoot, id = this._svgId;
    this._cachedEls = {
      haCard:      sr.querySelector('#ha-card'),
      panelWrap:   sr.querySelector('#panel-wrap'),
      iconPath:    sr.querySelector('#hdr-icon-path'),
      hdrIcon:     sr.querySelector('#hdr-icon'),
      valMain:     sr.querySelector('#val-main'),
      valUnit:     sr.querySelector('#val-unit'),
      dailyVal:    sr.querySelector('#daily-val'),
      effBadge:    sr.querySelector('#eff-badge'),
      effBar:      sr.querySelector('#eff-bar'),
      secVal:      sr.querySelector('#sec-val'),
      forecastVal:  sr.querySelector('#forecast-val'),
      forecastUnit: sr.querySelector('#forecast-unit'),
      badges:      sr.querySelector('#badges'),
      nightOverlay:sr.querySelector(`#${id}-night`),
      spMin:       sr.querySelector('#sp-min'),
      spAvg:       sr.querySelector('#sp-avg'),
      spMax:       sr.querySelector('#sp-max'),
      spEff:       sr.querySelector('#spark-eff'),
      sparkZone:   sr.querySelector('#zone-spark'),
      cells:       Array.from(sr.querySelectorAll('[data-ci]')),
    };
  }

  _updateDOM(u) {
    if (!this._cachedEls) return;
    const c   = this._config;
    const col = this._resolveColors();
    const { power, daily, sec, lux, weather, forecast } = u;
    const ratio = clamp(power / Math.max(c.max_power, 1), 0, 1);

    // ── Value — auto W/kW display ─────────────────
    if (this._cachedEls.valMain || this._cachedEls.valUnit) {
      const showKw = power >= 1000;
      const dispVal = showKw
        ? (power / 1000).toFixed(Math.max(c.decimal_places, 1))
        : power.toFixed(c.decimal_places);
      if (this._cachedEls.valMain) this._cachedEls.valMain.textContent = dispVal;
      if (this._cachedEls.valUnit) this._cachedEls.valUnit.textContent = showKw ? 'kW' : 'W';
    }

    // ── Cells ──────────────────────────────────────
    if (Math.abs(ratio - this._lastRatio) >= 0.01) {
      this._lastRatio = ratio;
      this._patchCells(ratio, col);
    }

    // ── Glow (skip if ratio unchanged) ─────────────
    if (c.glow_effect && Math.abs(ratio - this._lastRatio) >= 0.005) {
      const glowCol = ratio > 0.02 ? lerpColor(ratio, col.cold, col.mid, col.hot) : col.primary;
      const glowAmt = ratio > 0.02 ? Math.round(6 + ratio * 18) : 6;
      const neonG   = c.neon_glow;
      const glowKey = `${glowAmt}:${glowCol}`;
      if (glowKey !== this._lastGlowKey) {
        this._lastGlowKey = glowKey;
        if (this._cachedEls.panelWrap)
          this._cachedEls.panelWrap.style.filter = neonG
            ? `drop-shadow(0 0 4px ${glowCol}) drop-shadow(0 8px ${Math.round(glowAmt*1.6)}px ${glowCol}80)`
            : `drop-shadow(0 8px ${glowAmt}px ${glowCol}50)`;
        if (this._cachedEls.haCard)
          this._cachedEls.haCard.style.boxShadow = ratio > 0.03
            ? `0 0 ${Math.round(ratio * (neonG ? 40 : 24))}px ${glowCol}${neonG ? '50' : '28'}` : '';
      }
    }

    // ── Daily ──────────────────────────────────────
    if (this._cachedEls.dailyVal && daily !== null)
      this._cachedEls.dailyVal.textContent = daily.toFixed(1) + ' kWh';

    // ── Efficiency badge & bar ─────────────────────
    const eff = Math.round(ratio * 100);
    if (this._cachedEls.effBadge) {
      this._cachedEls.effBadge.textContent = eff + '%';
      const band = eff > 60 ? 2 : eff > 25 ? 1 : 0;
      if (band !== this._lastEffBand) {
        this._lastEffBand = band;
        const ec = band === 2 ? col.hot : band === 1 ? col.mid : col.cold;
        const s = this._cachedEls.effBadge.style;
        s.color = ec; s.borderColor = ec + '50'; s.background = ec + '1a'; s.border = `1px solid ${ec}50`;
      }
    }
    if (this._cachedEls.effBar) this._cachedEls.effBar.style.width = eff + '%';

    // ── Secondary sensors (now in header) ─────────
    if (this._cachedEls.secVal && sec !== null) {
      this._cachedEls.secVal.textContent = typeof sec === 'number' ? sec.toFixed(1) : sec;
    }
    if (this._cachedEls.forecastVal && forecast !== null) {
      const fKw = forecast >= 1000;
      this._cachedEls.forecastVal.textContent = fKw ? (forecast / 1000).toFixed(1) : forecast.toFixed(0);
      if (this._cachedEls.forecastUnit) this._cachedEls.forecastUnit.textContent = fKw ? 'kW' : 'W';
    }

    // ── Night mode ─────────────────────────────────
    const isNight = this._isNight(lux);
    this._applyNightMode(isNight, col);

    // ── Weather badge ──────────────────────────────
    this._updateBadges(weather, isNight);

    // ── Sparkline ──────────────────────────────────
    this._updateSparkline();
  }

  /** Patch cell rect fill/opacity/class — delta-only, touches changed cells */
  _patchCells(ratio, col) {
    const cells = this._cachedEls.cells;
    if (!cells?.length) return;
    const active = Math.round(ratio * cells.length);
    const prev   = this._lastActive;
    this._lastActive = active;
    const color  = ratio > 0.005 ? lerpColor(ratio, col.cold, col.mid, col.hot) : col.cold;

    // Color changed → repaint all active cells
    if (active > 0 && prev === active) {
      // Only color shift, no state change — update fill on active cells
      for (let i = 0; i < active; i++) cells[i].setAttribute('fill', color);
      return;
    }
    // Cells that flipped ON  (prev..active-1)
    const lo = Math.min(prev, active), hi = Math.max(prev, active);
    if (active > prev) {
      // Turning cells ON
      for (let i = prev; i < active; i++) {
        const el = cells[i];
        el.setAttribute('fill', color);
        el.setAttribute('opacity', '0.82');
        el.style.setProperty('--co', '0.7');
        el.classList.add('cell-on');
      }
      // Update fill color on already-active cells (color may have shifted)
      for (let i = 0; i < prev; i++) cells[i].setAttribute('fill', color);
    } else {
      // Turning cells OFF
      for (let i = active; i < prev; i++) {
        const el = cells[i];
        el.setAttribute('fill', col.cold);
        el.setAttribute('opacity', '0.07');
        el.style.setProperty('--co', '0.07');
        el.classList.remove('cell-on');
      }
      // Update fill color on remaining active cells
      for (let i = 0; i < active; i++) cells[i].setAttribute('fill', color);
    }
  }

  _isNight(lux) {
    const c = this._config;
    if (lux !== null && !isNaN(lux)) return lux < (c.night_threshold ?? 10);
    const h = new Date().getHours();
    return h < 6 || h >= 21;
  }

  _applyNightMode(isNight, col) {
    // Dim panel with night overlay
    if (this._cachedEls.nightOverlay)
      this._cachedEls.nightOverlay.setAttribute('opacity', isNight ? '0.6' : '0');

    // Sun / moon icon swap via path d attribute (uses module-scope MDI_SUN / MDI_MOON)
    if (this._cachedEls.iconPath) {
      const d = isNight ? MDI_MOON : MDI_SUN;
      if (this._cachedEls.iconPath.getAttribute('d') !== d) {
        this._cachedEls.iconPath.setAttribute('d', d);
        if (this._cachedEls.hdrIcon) {
          const nightColor = this._config.cyberpunk_mode ? '#00fff9' : '#9db4ff';
          const dayColor   = this._config.color_icon || col.primary;
          this._cachedEls.hdrIcon.style.color = isNight ? nightColor : dayColor;
        }
      }
    }
  }

  _updateBadges(weather, isNight) {
    const el = this._cachedEls.badges;
    if (!el) return;
    const col = this._resolveColors();
    const badgeCol   = this._config.color_badge || col.primary;
    const nightColor = this._config.cyberpunk_mode ? '#00fff9' : '#9db4ff';
    let html = '';
    if (weather && WEATHER_ICONS[weather]) html += `<svg class="badge" viewBox="0 0 24 24"><path fill="${badgeCol}" d="${WEATHER_ICONS[weather]}"/></svg>`;
    if (isNight) html += `<svg class="badge" viewBox="0 0 24 24"><path fill="${nightColor}" d="${MDI_MOON}"/></svg>`;
    if (el._last !== html) { el._last = html; el.innerHTML = html; }
  }

  _updateSparkline() {
    const c = this._config;
    const zone = this._cachedEls?.sparkZone;
    if (!zone || !c.show_history || !this._history.length) return;

    const h = this._history;
    const key = `${h.length}:${h[0]}:${h[Math.floor(h.length/2)]}:${h[h.length-1]}`;
    if (zone._key === key) return;
    zone._key = key;

    let hMin = Infinity, hMax = -Infinity, hSum = 0;
    for (const v of h) { if (v<hMin) hMin=v; if (v>hMax) hMax=v; hSum+=v; }
    const hAvg = hSum / h.length;
    const col  = this._resolveColors();

    if (this._cachedEls.spMin) this._cachedEls.spMin.textContent = fmtPower(hMin, c.unit, c.decimal_places);
    if (this._cachedEls.spAvg) this._cachedEls.spAvg.textContent = fmtPower(hAvg, c.unit, c.decimal_places);
    if (this._cachedEls.spMax) this._cachedEls.spMax.textContent = fmtPower(hMax, c.unit, c.decimal_places);
    if (this._cachedEls.spEff) {
      const avgEff = Math.round((hAvg / Math.max(c.max_power, 1)) * 100);
      this._cachedEls.spEff.textContent = `AVG EFF. ${avgEff}%`;
    }
    zone.innerHTML = buildSparkline(h, col, c.unit, c.decimal_places);
  }

  _handleAction(actionKey) {
    const cfg = this._config?.[actionKey];
    if (!cfg || cfg.action === 'none') return;
    switch (cfg.action) {
      case 'more-info':
        this._moreInfo(cfg.entity); break;
      case 'navigate':
        if (cfg.navigation_path) history.pushState(null, '', cfg.navigation_path);
        this.dispatchEvent(new Event('location-changed', { bubbles:true, composed:true }));
        break;
      case 'url':
        if (cfg.url_path) window.open(cfg.url_path, '_blank'); break;
      case 'call-service': {
        if (!cfg.service) break;
        const [domain, service] = cfg.service.split('.', 2);
        this._hass?.callService(domain, service, cfg.service_data || {}, cfg.target || {});
        break;
      }
      case 'toggle':
        if (this._config.entity) this._hass?.callService('homeassistant', 'toggle', { entity_id: this._config.entity });
        break;
      default:
        this._moreInfo(); break;
    }
  }

  _moreInfo(entityId = null) {
    const id = entityId || this._config?.entity;
    if (!id) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles:true, composed:true }));
  }

  _showUnavailable(state) {
    if (this._unavailable) return; // already showing
    this._unavailable = true;
    if (this._cachedEls?.valMain) {
      this._cachedEls.valMain.textContent = state === 'unknown' ? '?' : '—';
      this._cachedEls.valMain.style.opacity = '0.35';
    }
    if (this._cachedEls?.valUnit) this._cachedEls.valUnit.textContent = state;
    if (this._cachedEls?.haCard)  this._cachedEls.haCard.style.opacity = '0.55';
  }

  _clearUnavailable() {
    this._unavailable = false;
    if (this._cachedEls?.valMain) this._cachedEls.valMain.style.opacity = '';
    if (this._cachedEls?.haCard)  this._cachedEls.haCard.style.opacity = '';
  }
}

customElements.define('neon-solar-card', NeonSolarCard);

// ── Console banner ────────────────────────────────────────
console.info(
  '%c NEON-SOLAR-CARD %c v' + VERSION + ' ',
  'color:#FFD23F;font-weight:700;background:#080808;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF6B35;font-weight:700;background:#080808;padding:2px 6px;border-radius:0 3px 3px 0',
);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'custom:neon-solar-card',
  name: 'Neon Solar Production Card',
  description: 'Solar panel card with animated cells, sparkline, night mode & weather',
  preview: true,
});