/**
 * neon-dual-thermo-card v2.2.0
 * Double thermomètre néon pour Home Assistant - Comparaison côte à côte
 *
 * Installation :
 *   1. Copier dans /config/www/neon-dual-thermo-card.js
 *   2. Ressources HA → /local/neon-dual-thermo-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:neon-dual-thermo-card
 *   entity_left: sensor.temperature_salon
 *   entity_right: sensor.temperature_chambre
 *
 * v2.2.0 : easter-egg GLITCH — le chat marcheur se matérialise en hologramme
 *            Silverhand (RGB-split + scanlines) sur la courbe la plus froide de la
 *            sparkline ; off par défaut, fréquence/taille/image réglables (éditeur).
 *            Respecte prefers-reduced-motion, ne spawn pas si onglet caché.
 * v2.1.0 : capteur indisponible → mercure descendu à la base + désaturé gris,
 *            anneaux plasma & paroi ternis (lecture immédiate « capteur HS »)
 *          + saturateHex mémoïsé (moins de recalcul HSL à chaque patch mercure)
 *          + nettoyage code mort, version unifiée, banner console unique
 * v2.0.x : glass dome reflet haut-gauche + wall shimmer (paroi externe)
 *          + per-side overrides (échelle, zones, plasma) + éditeur §22
 * v2.0.0 : header 3 colonnes avec entity_wind (optionnel)
 *          + graph fond vent/pression (entity_bg_pressure optionnel)
 *          + fix jonction tube→bulbe (shimmer continu sans seam)
 *          + suppression rect shine superflu
 */

const VERSION = '2.3.0';

// Device detection — iPad/mobile : modère les anneaux plasma (rotation ralentie +
// glow allégé) pour soulager le GPU. Détection userAgent (fiable en paysage).
const NDT_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NDT_IS_LOW_POWER = NDT_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
function _parseAction(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function buildConfig(raw) {
  return {
    // Left thermometer
    entity_left:           raw.entity_left           || null,
    humidity_entity_left:  raw.humidity_entity_left  || null,
    secondary_entity_left: raw.secondary_entity_left || null,
    secondary_label_left:  raw.secondary_label_left  || null,
    secondary_unit_left:   raw.secondary_unit_left   || null,
    name_left:             raw.name_left             || null,
    
    // Right thermometer
    entity_right:           raw.entity_right           || null,
    humidity_entity_right:  raw.humidity_entity_right  || null,
    secondary_entity_right: raw.secondary_entity_right || null,
    secondary_label_right:  raw.secondary_label_right  || null,
    secondary_unit_right:   raw.secondary_unit_right   || null,
    name_right:             raw.name_right             || null,
    
    // Shared settings (defaults for both sides)
    temp_min:   raw.temp_min  ?? -20,
    temp_max:   raw.temp_max  ?? 40,
    unit:       raw.unit      ?? '°C',
    show_history:   raw.show_history   ?? true,
    show_plasma:    raw.show_plasma    ?? true,
    decimal_places: raw.decimal_places ?? 1,
    history_hours:  raw.history_hours  ?? 24,

    // Per-side scale overrides (null = hérite du shared)
    temp_min_left:  raw.temp_min_left  ?? null,
    temp_max_left:  raw.temp_max_left  ?? null,
    temp_min_right: raw.temp_min_right ?? null,
    temp_max_right: raw.temp_max_right ?? null,

    // Zone thresholds — array [t1, t2, t3, t4] séparant les 5 zones
    // Défaut : [5, 15, 22, 28] pour rétrocompat
    zone_thresholds:       raw.zone_thresholds       || null,
    zone_thresholds_left:  raw.zone_thresholds_left  || null,
    zone_thresholds_right: raw.zone_thresholds_right || null,

    // Centre — vent (optionnel)
    entity_wind:    raw.entity_wind    || null,
    name_wind:      raw.name_wind      || 'VENT',
    wind_unit:      raw.wind_unit      || 'km/h',
    // Entité pression pour le graph fond (optionnel)
    entity_bg_pressure: raw.entity_bg_pressure || null,

    // Tap actions
    tap_action_left:  _parseAction(raw.tap_action_left, { action: 'more-info' }),
    tap_action_right: _parseAction(raw.tap_action_right, { action: 'more-info' }),
    hold_action_left:  _parseAction(raw.hold_action_left, { action: 'none' }),
    hold_action_right: _parseAction(raw.hold_action_right, { action: 'none' }),
    
    // Fonts (null = theme defaults)
    name_font_family:    raw.name_font_family    || null,
    name_font_size:      raw.name_font_size      || null,
    value_font_family:   raw.value_font_family   || null,
    value_font_size:     raw.value_font_size     || null,
    sensor_font_family:  raw.sensor_font_family  || null,
    sensor_font_size:    raw.sensor_font_size    || null,

    // Colors (shared / defaults)
    color_primary:    raw.color_primary    || null,  // Left thermo (traits, texte)
    color_secondary:  raw.color_secondary  || null,  // Right thermo (traits, texte)
    color_zone1:      raw.color_zone1      || null,  // Zone 1 (la plus froide)
    color_zone2:      raw.color_zone2      || null,
    color_zone3:      raw.color_zone3      || null,
    color_zone4:      raw.color_zone4      || null,
    color_zone5:      raw.color_zone5      || null,  // Zone 5 (la plus chaude)
    color_background: raw.color_background || null,  // Interior fill
    color_plasma_ring1: raw.color_plasma_ring1 || null,
    color_plasma_ring2: raw.color_plasma_ring2 || null,
    plasma_saturation: raw.plasma_saturation ?? 1.8,
    animation_speed:  raw.animation_speed  ?? 1,

    // Per-side color / plasma overrides (null = hérite)
    color_zone1_left: raw.color_zone1_left || null,
    color_zone2_left: raw.color_zone2_left || null,
    color_zone3_left: raw.color_zone3_left || null,
    color_zone4_left: raw.color_zone4_left || null,
    color_zone5_left: raw.color_zone5_left || null,
    color_zone1_right: raw.color_zone1_right || null,
    color_zone2_right: raw.color_zone2_right || null,
    color_zone3_right: raw.color_zone3_right || null,
    color_zone4_right: raw.color_zone4_right || null,
    color_zone5_right: raw.color_zone5_right || null,
    color_plasma_ring1_left:  raw.color_plasma_ring1_left  || null,
    color_plasma_ring2_left:  raw.color_plasma_ring2_left  || null,
    color_plasma_ring1_right: raw.color_plasma_ring1_right || null,
    color_plasma_ring2_right: raw.color_plasma_ring2_right || null,
    plasma_saturation_left:   raw.plasma_saturation_left   ?? null,
    plasma_saturation_right:  raw.plasma_saturation_right  ?? null,

    // Easter-egg GLITCH — chat marcheur qui se matérialise en hologramme Silverhand
    // sur la courbe la plus froide (extérieur). Off par défaut.
    glitch_cat:        raw.glitch_cat        ?? false,
    glitch_cat_chance: clamp(raw.glitch_cat_chance ?? 0.12, 0, 1),  // proba par tick (~6 s)
    glitch_cat_size:   raw.glitch_cat_size   ?? 26,                 // hauteur px
    glitch_cat_image:  raw.glitch_cat_image  || '/local/cat-walking-white.gif',
  };
}

// Résout la config effective pour un côté donné (fallback sur les valeurs shared)
function sideConfig(c, side) {
  const sfx = '_' + side;  // '_left' ou '_right'
  const pick = (key) => (c[key + sfx] ?? null) !== null ? c[key + sfx] : c[key];
  return {
    temp_min: pick('temp_min'),
    temp_max: pick('temp_max'),
    zone_thresholds: pick('zone_thresholds') || [5, 15, 22, 28],
    color_zone1: pick('color_zone1'),
    color_zone2: pick('color_zone2'),
    color_zone3: pick('color_zone3'),
    color_zone4: pick('color_zone4'),
    color_zone5: pick('color_zone5'),
    color_plasma_ring1: pick('color_plasma_ring1'),
    color_plasma_ring2: pick('color_plasma_ring2'),
    plasma_saturation: pick('plasma_saturation'),
  };
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
let _cssVarCache = {};
let _cssVarCacheTs = 0;
function cssVar(name, fallback) {
  const now = Date.now();
  if (now - _cssVarCacheTs > 30000) { _cssVarCache = {}; _cssVarCacheTs = now; }
  if (_cssVarCache[name] !== undefined) return _cssVarCache[name];
  if (typeof getComputedStyle !== 'undefined') {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (v) { _cssVarCache[name] = v; return v; }
  }
  _cssVarCache[name] = fallback;
  return fallback;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

// Boost saturation of a hex color by a factor (CPU-only, no SVG filter needed)
// Mémoïsé : mêmes (hex, factor) reviennent à chaque patch mercure → évite le recalcul HSL.
const _satCache = new Map();
function saturateHex(hex, factor) {
  if (factor === 1) return hex;
  const ck = hex + '|' + factor;
  const hit = _satCache.get(ck);
  if (hit !== undefined) return hit;
  const out = _saturateHexCompute(hex, factor);
  if (_satCache.size > 256) _satCache.clear();  // garde-fou mémoire
  _satCache.set(ck, out);
  return out;
}

function _saturateHexCompute(hex, factor) {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  let r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  s = Math.min(1, s * factor);
  l = Math.min(0.65, l);  // Cap lightness so it stays vivid
  // HSL to RGB
  const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  g = Math.round(hue2rgb(p, q, h) * 255);
  b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Retourne l'index de zone (1..5) pour une température selon les 4 seuils donnés
function zoneIndexForTemp(temp, thresholds) {
  const [t1, t2, t3, t4] = thresholds;
  if (temp < t1) return 1;
  if (temp < t2) return 2;
  if (temp < t3) return 3;
  if (temp < t4) return 4;
  return 5;
}

// Handle HA tap/hold actions
function handleAction(node, hass, config, actionConfig) {
  if (!actionConfig || !hass) return;
  switch (actionConfig.action) {
    case 'more-info': {
      const entityId = actionConfig.entity || config.entity_left || config.entity_right;
      if (entityId) {
        node.dispatchEvent(new CustomEvent('hass-more-info', {
          detail: { entityId }, bubbles: true, composed: true,
        }));
      }
      break;
    }
    case 'navigate':
      if (actionConfig.navigation_path) history.pushState(null, '', actionConfig.navigation_path);
      break;
    case 'url':
      if (actionConfig.url_path) window.open(actionConfig.url_path);
      break;
    case 'call-service':
    case 'perform-action': {
      const svc = actionConfig.service || actionConfig.perform_action;
      if (svc) {
        const [domain, service] = svc.split('.');
        hass.callService(domain, service, actionConfig.service_data || actionConfig.data || {});
      }
      break;
    }
    case 'toggle': {
      const entityId = actionConfig.entity || config.entity_left || config.entity_right;
      if (entityId) hass.callService('homeassistant', 'toggle', { entity_id: entityId });
      break;
    }
    case 'none':
    default:
      break;
  }
}

let _uid = 0;
function uid() { return 'ndtc' + (++_uid); }

// ═══════════════════════════════════════════════════════
//  THERMO GEOMETRY
// ═══════════════════════════════════════════════════════
// Accepte soit (tempMin, tempMax) soit ({ temp_min, temp_max })
function computeGeometry(tempMin, tempMax) {
  // Rétrocompat : accepte un objet comme premier arg
  if (typeof tempMin === 'object' && tempMin !== null) {
    tempMax = tempMin.temp_max;
    tempMin = tempMin.temp_min;
  }
  const PAD = 8, tubeH = 90, bulbSpace = 28;
  const TW_E = 16, BR_E = 26, TW_I = 10, BR_I = 16;
  const cx = 55, vbW = 155;

  const tubeTop    = PAD;
  const cy         = tubeTop + tubeH + bulbSpace;
  const tang_E     = Math.round(cy - Math.sqrt(BR_E * BR_E - TW_E * TW_E));
  const tang_I     = Math.round(cy - Math.sqrt(BR_I * BR_I - TW_I * TW_I));
  const gradTop    = tubeTop;
  const gradBottom = cy + BR_I - 2;
  const gradH      = gradBottom - gradTop;
  const svgH       = cy + BR_E + PAD;
  const pr1 = Math.round(BR_I * 0.85);
  const pr2 = Math.round(BR_I * 0.38);

  const range = tempMax - tempMin;
  const pxPerDeg = gradH / range;
  const ticks = [];
  // Pas adaptatif : on cible ~15 graduations max, longues tous les 5× le pas
  const step = range <= 20 ? 1 : range <= 50 ? 2 : 5;
  const longEvery = range <= 20 ? 5 : 10;
  for (let t = Math.ceil(tempMin); t <= tempMax; t += step) {
    ticks.push({
      t,
      y: gradBottom - (t - tempMin) * pxPerDeg,
      long: (t % longEvery === 0),
    });
  }

  return {
    PAD, tubeH, bulbSpace,
    TW_E, BR_E, TW_I, BR_I,
    cx, vbW, tubeTop, cy,
    tang_E, tang_I,
    gradTop, gradBottom, gradH, pxPerDeg,
    svgH, pr1, pr2, range, ticks,
    temp_min: tempMin, temp_max: tempMax,
  };
}

// ═══════════════════════════════════════════════════════
//  THERMO SVG
// ═══════════════════════════════════════════════════════
// sideCtx : { zones: {zone1..5}, plasmaRing1, plasmaRing2, plasmaSaturation }
function buildThermoSkeleton(c, color, id, geo, sideCtx) {
  const { zone1, zone2, zone3, zone4, zone5 } = sideCtx.zones;
  const bgColor = c.color_background || cssVar('--card-background-color', '#04060b');
  const sat = sideCtx.plasmaSaturation ?? 1.8;
  const plasmaRing1 = saturateHex(sideCtx.plasmaRing1 || zone3, sat);
  const plasmaRing2 = saturateHex(sideCtx.plasmaRing2 || zone5, sat);
  const {
    TW_E, BR_E, TW_I, BR_I, cx, vbW,
    tubeTop, cy, tang_E, tang_I,
    gradTop, gradBottom, gradH,
    svgH, pr1, pr2, ticks, range,
  } = geo;
  const s  = c.animation_speed ?? 1;
  // iPad/mobile : rotation des anneaux ×3 plus lente (moins de frames de recalcul du glow).
  const _sp = NDT_IS_LOW_POWER ? s / 3 : s;
  const d1 = (2.5 / _sp).toFixed(1), d2 = (3.5 / _sp).toFixed(1);
  const d3 = (6 / s).toFixed(1);

  return `<svg viewBox="0 0 ${vbW} ${svgH}" width="100%" preserveAspectRatio="xMidYMid meet"
  style="display:block;overflow:visible" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-mercury" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="${saturateHex(zone3, 0.7)}"/>
      <stop offset="50%"  stop-color="${zone3}"/>
      <stop offset="100%" stop-color="${saturateHex(zone3, 0.7)}"/>
    </linearGradient>
    <linearGradient id="${id}-tube-shimmer" x1="${cx - TW_I}" y1="0" x2="${cx + TW_I}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.11"/>
      <stop offset="25%"  stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-clip">
      <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
        L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"/>
    </clipPath>
    <clipPath id="${id}-clip-e">
      <path d="M${cx - TW_E},${tubeTop} A${TW_E},${TW_E} 0 0,1 ${cx + TW_E},${tubeTop}
        L${cx + TW_E},${tang_E} A${BR_E},${BR_E} 0 1,1 ${cx - TW_E},${tang_E} Z"/>
    </clipPath>
    <!-- Reflet cylindrique bord gauche de la paroi externe -->
    <linearGradient id="${id}-wall-shimmer" x1="${cx - TW_E}" y1="0" x2="${cx + TW_E}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="22%"  stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="55%"  stop-color="#fff" stop-opacity="0"/>
      <stop offset="78%"  stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.20"/>
    </linearGradient>
    <!-- Reflet dôme supérieur — lumière venant d'en haut à gauche -->
    <radialGradient id="${id}-dome-shine" cx="${cx - TW_E * 0.3}" cy="${tubeTop - TW_E * 0.6}" r="${TW_E * 1.4}" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.35"/>
      <stop offset="40%"  stop-color="#fff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <!-- Glow néon anneaux plasma — même recette que sensor-value text-shadow -->
    <filter id="${id}-ring-glow" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur-wide"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur-tight"/>
      <feFlood flood-color="white" flood-opacity="0.85" result="white"/>
      <feComposite in="white" in2="blur-tight" operator="in" result="core-white"/>
      <feMerge>
        <feMergeNode in="blur-wide"/>
        <feMergeNode in="blur-wide"/>
        <feMergeNode in="blur-tight"/>
        <feMergeNode in="core-white"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
    L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"
    fill="${bgColor}"/>

  <!-- Glass verre overlays — clippés au tube intérieur -->
  <g clip-path="url(#${id}-clip)" style="pointer-events:none">
    <!-- Sheen latéral — reflet cylindrique tube + bulbe (clip gère la forme) -->
    <rect x="${cx - TW_I}" y="${tubeTop - TW_I}" width="${TW_I * 2}" height="${cy + BR_I - (tubeTop - TW_I)}"
      fill="url(#${id}-tube-shimmer)"/>
  </g>

  <g clip-path="url(#${id}-clip)">
    <g class="mercury-group">
      <rect data-el="mercury" class="mercury-irradiate"
        x="${cx - BR_I - 4}" width="${(BR_I + 4) * 2}"
        y="${gradBottom}" height="${cy + BR_I - gradBottom}"
        fill="url(#${id}-mercury)"/>
    </g>
  </g>

  ${c.show_plasma ? `
  <g transform="translate(${cx},${cy})">
    <circle r="${BR_I + 5}" stroke="${color}" stroke-width="0.5" stroke-dasharray="1 3"
      fill="none" opacity="0.2" shape-rendering="auto"/>
    <g>
      <ellipse rx="${pr1}" ry="${pr2}" fill="none" stroke="${plasmaRing1}" stroke-width="1.8" opacity="0.9"
        ${NDT_IS_LOW_POWER ? '' : `filter="url(#${id}-ring-glow)"`}>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360"
          dur="${d1}s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse rx="${pr2}" ry="${pr1}" fill="none" stroke="${plasmaRing2}" stroke-width="1.8" opacity="0.85"
        ${NDT_IS_LOW_POWER ? '' : `filter="url(#${id}-ring-glow)"`}>
        <animateTransform attributeName="transform" type="rotate" from="360" to="0"
          dur="${d2}s" repeatCount="indefinite"/>
      </ellipse>
    </g>
  </g>` : ''}

  <!-- Paroi externe -->
  <g class="outline">
    <path d="M${cx - TW_E},${tubeTop} A${TW_E},${TW_E} 0 0,1 ${cx + TW_E},${tubeTop}
      L${cx + TW_E},${tang_E} A${BR_E},${BR_E} 0 1,1 ${cx - TW_E},${tang_E} Z"
      fill="none" stroke="${color}" stroke-width="1.8" opacity="0.75"/>
  </g>

  <!-- Reflet verre paroi externe — clippé sur outline -->
  <g clip-path="url(#${id}-clip-e)" style="pointer-events:none">
    <!-- Sheen latéral paroi externe — couvre tube + bulbe (clip gère la forme) -->
    <rect x="${cx - BR_E}" y="${tubeTop - TW_E}" width="${BR_E * 2}" height="${cy + BR_E - (tubeTop - TW_E)}"
      fill="url(#${id}-wall-shimmer)"/>
    <!-- Dôme supérieur : ellipse couvrant exactement l'arc A(TW_E,TW_E) -->
    <ellipse cx="${cx}" cy="${tubeTop}" rx="${TW_E}" ry="${TW_E}"
      fill="url(#${id}-dome-shine)"/>
  </g>

  <g data-el="ticks" class="ticks" font-family="Rajdhani,monospace" fill="${color}">
    ${ticks.map(({ t, y, long }) => {
      const x1 = cx + BR_E + 4;
      const x2 = long ? x1 + 12 : x1 + 7;
      return `<line data-t="${t}" x1="${x1}" y1="${y.toFixed(1)}" x2="${x2}" y2="${y.toFixed(1)}"
        stroke="${color}" stroke-width="${long ? 1.8 : 1}" opacity="${long ? 0.9 : 0.35}"/>
      ${long ? `<text data-t="${t}" x="${x2 + 3}" y="${(y + 3).toFixed(1)}" font-size="10"
        fill="${color}" opacity="0.85" font-weight="400">${t}°</text>` : ''}`;
    }).join('')}
  </g>
</svg>`;
}

// ── Background graph — vent + pression ──────────────────────────────────────
function buildBgGraphSVG(histWind, histPressure, primaryColor) {
  const hasWind     = histWind     && histWind.length     > 1;
  const hasPressure = histPressure && histPressure.length > 1;
  if (!hasWind && !hasPressure) return { svg: '', labels: '' };

  const W = 100, H = 100, PAD = 3;

  function normalize(arr) {
    let mn = arr[0], mx = arr[0];
    for (let i = 1; i < arr.length; i++) { if (arr[i] < mn) mn = arr[i]; if (arr[i] > mx) mx = arr[i]; }
    const range = Math.max(mx - mn, 0.1);
    return arr.map((v, i) => ({
      x: (PAD + (i / (arr.length - 1)) * (W - PAD * 2)).toFixed(2),
      y: (H - PAD - ((v - mn) / range) * (H - PAD * 2)).toFixed(2),
    }));
  }

  let windPath = '', windArea = '', pressurePath = '';

  if (hasWind) {
    const pts = normalize(histWind);
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    windPath = d;
    const last = pts[pts.length - 1], first = pts[0];
    windArea = `${d} L${last.x},${H - PAD} L${first.x},${H - PAD} Z`;
  }

  // Pression : échelle fixe 970–1040 hPa
  const P_MIN = 970, P_MAX = 1040;
  let pressureSVG = '', pressureLabels = '';

  if (hasPressure) {
    const pNorm = (v) => {
      const clamped = Math.max(P_MIN, Math.min(P_MAX, v));
      return (H - PAD - ((clamped - P_MIN) / (P_MAX - P_MIN)) * (H - PAD * 2)).toFixed(2);
    };
    const pts = histPressure.map((v, i) => ({
      x: (PAD + (i / (histPressure.length - 1)) * (W - PAD * 2)).toFixed(2),
      y: pNorm(v),
    }));
    pressurePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    const refs = [
      { hpa: 980,  label: '980',  color: '#ff4060', opacity: 0.45 },
      { hpa: 1000, label: '1000', color: '#ffaa30', opacity: 0.35 },
      { hpa: 1013, label: '1013', color: '#9090c0', opacity: 0.30 },
      { hpa: 1025, label: '1025', color: '#40d0a0', opacity: 0.35 },
    ];
    pressureSVG = refs.map(r => {
      const y = pNorm(r.hpa);
      return `<line x1="${PAD}" y1="${y}" x2="${W}" y2="${y}"
        stroke="${r.color}" stroke-width="0.4" stroke-dasharray="1.5,2" opacity="${r.opacity}" vector-effect="non-scaling-stroke"/>`;
    }).join('');
    pressureLabels = refs.map(r => {
      const yPct = ((parseFloat(pNorm(r.hpa)) / H) * 100).toFixed(1);
      return `<div style="position:absolute;right:4px;top:${yPct}%;transform:translateY(-50%);font-size:9px;font-family:monospace;color:${r.color};opacity:${(r.opacity + 0.25).toFixed(2)};line-height:1;pointer-events:none;white-space:nowrap;">${r.label}</div>`;
    }).join('');
  }

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;display:block;overflow:hidden"
    shape-rendering="geometricPrecision">
    <defs>
      <linearGradient id="bg-wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
      </linearGradient>
      <filter id="bg-pressure-glow" x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur2"/>
        <feMerge><feMergeNode in="blur1"/><feMergeNode in="blur1"/><feMergeNode in="blur2"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${hasWind ? `
    <path d="${windArea}" fill="url(#bg-wg)"/>
    <path d="${windPath}" fill="none" stroke="${primaryColor}" stroke-width="0.85"
      opacity="0.92" vector-effect="non-scaling-stroke"/>` : ''}
    ${hasPressure ? `
    ${pressureSVG}
    <path d="${pressurePath}" fill="none" stroke="#6200EA" stroke-width="1.4"
      opacity="0.35" vector-effect="non-scaling-stroke" filter="url(#bg-pressure-glow)"/>
    <path d="${pressurePath}" fill="none" stroke="#b060ff" stroke-width="0.6"
      opacity="0.55" vector-effect="non-scaling-stroke"/>` : ''}
  </svg>`;

  return { svg, labels: pressureLabels };
}

// Constantes géométrie sparkline (partagées avec la couche easter-egg GLITCH)
const SPARK_W = 640, SPARK_H = 55, SPARK_PAD_Y = 14, SPARK_VBH = SPARK_PAD_Y + SPARK_H + 20;

// Points {x,y} en coords viewBox d'une série, selon hMin/hR communs (même formule que la polyline).
function sparkPoints(hist, hMin, hR) {
  const n = Math.max(hist.length - 1, 1);
  return hist.map((v, i) => ({
    x: Math.round(i / n * SPARK_W),
    y: SPARK_PAD_Y + Math.round(SPARK_H - ((v - hMin) / hR) * (SPARK_H - 8) - 4),
  }));
}

// ── Dual Sparkline 24h ──────────────────────────────────────────
function buildDualSparkSVG(histLeft, histRight, colors, id, speed = 1, hours = 24) {
  const hasLeft = histLeft && histLeft.length > 0;
  const hasRight = histRight && histRight.length > 0;
  if (!hasLeft && !hasRight) return '';
  
  const { primary: priLeft, secondary: priRight } = colors;
  const W = SPARK_W, H = SPARK_H, PAD_Y = SPARK_PAD_Y;

  // Compute combined range for both datasets
  let hMin = Infinity, hMax = -Infinity;
  let sumLeft = 0, sumRight = 0;
  
  if (hasLeft) {
    for (let i = 0; i < histLeft.length; i++) {
      const v = histLeft[i];
      if (v < hMin) hMin = v;
      if (v > hMax) hMax = v;
      sumLeft += v;
    }
  }
  
  if (hasRight) {
    for (let i = 0; i < histRight.length; i++) {
      const v = histRight[i];
      if (v < hMin) hMin = v;
      if (v > hMax) hMax = v;
      sumRight += v;
    }
  }
  
  const hR = Math.max(hMax - hMin, 0.1);
  const avgLeft = hasLeft ? (sumLeft / histLeft.length).toFixed(1) : '--';
  const avgRight = hasRight ? (sumRight / histRight.length).toFixed(1) : '--';

  // Build polylines
  let ptsLeft = '', ptsRight = '';
  
  if (hasLeft) {
    const n = Math.max(histLeft.length - 1, 1);
    ptsLeft = histLeft.map((v, i) => {
      const x = Math.round(i / n * W);
      const y = PAD_Y + Math.round(H - ((v - hMin) / hR) * (H - 8) - 4);
      return `${x},${y}`;
    }).join(' ');
  }
  
  if (hasRight) {
    const n = Math.max(histRight.length - 1, 1);
    ptsRight = histRight.map((v, i) => {
      const x = Math.round(i / n * W);
      const y = PAD_Y + Math.round(H - ((v - hMin) / hR) * (H - 8) - 4);
      return `${x},${y}`;
    }).join(' ');
  }

  return `<svg viewBox="0 0 ${W} ${PAD_Y + H + 20}" width="100%"
  preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible" shape-rendering="geometricPrecision">
  <text x="0" y="9" fill="${priLeft}" font-size="10" font-family="Rajdhani,monospace"
    opacity="0.5" letter-spacing="1">DUAL_CYCLIC_ANALYSIS_${hours}H</text>
  
  <g font-family="Rajdhani,monospace" font-size="10">
    <circle cx="240" cy="5" r="3" fill="${priLeft}" opacity="0.8"/>
    <text x="248" y="9" fill="${priLeft}" opacity="0.8">LEFT AVG:<tspan font-weight="700">${avgLeft}</tspan></text>
    
    <circle cx="380" cy="5" r="3" fill="${priRight}" opacity="0.8"/>
    <text x="388" y="9" fill="${priRight}" opacity="0.8">RIGHT AVG:<tspan font-weight="700">${avgRight}</tspan></text>
    
    <text x="530" y="9" fill="${priLeft}" opacity="0.8">MAX:<tspan font-weight="700">${hMax.toFixed(1)}</tspan></text>
  </g>
  
  <rect x="0" y="${PAD_Y}" width="${W}" height="${H}" fill="${priLeft}" opacity="0.03" rx="2"/>
  <line x1="0" y1="${PAD_Y + H / 2}" x2="${W}" y2="${PAD_Y + H / 2}" stroke="${priLeft}" stroke-width="0.3" opacity="0.1"/>
  
  ${hasLeft ? `<polyline points="${ptsLeft}" fill="none" stroke="${priLeft}" stroke-width="2" opacity="0.85"/>` : ''}
  ${hasRight ? `<polyline points="${ptsRight}" fill="none" stroke="${priRight}" stroke-width="2" opacity="0.85"/>` : ''}
  
  <line x1="0" y1="${PAD_Y + H}" x2="${W}" y2="${PAD_Y + H}" stroke="${priLeft}" stroke-width="0.8" opacity="0.2"/>
  
  <g font-family="Rajdhani,monospace" fill="${priLeft}" opacity="0.5" font-size="10" text-anchor="middle">
    <line x1="0" y1="${PAD_Y + H}" x2="0" y2="${PAD_Y + H + 6}" stroke="${priLeft}" stroke-width="1"/>
    <text x="0" y="${PAD_Y + H + 16}">T-${hours}</text>
    <line x1="${W / 2}" y1="${PAD_Y + H}" x2="${W / 2}" y2="${PAD_Y + H + 6}" stroke="${priLeft}" stroke-width="1"/>
    <text x="${W / 2}" y="${PAD_Y + H + 16}">T-${Math.round(hours / 2)}</text>
    <line x1="${W}" y1="${PAD_Y + H}" x2="${W}" y2="${PAD_Y + H + 6}" stroke="${priLeft}" stroke-width="1" stroke-dasharray="2 1"/>
    <text x="${W}" y="${PAD_Y + H + 16}" font-weight="700">NOW</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonDualThermoCardEditor extends HTMLElement {
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
    // zone_thresholds_* : texte "5, 15, 22, 28" → tableau de 4 nombres.
    if (key.startsWith('zone_thresholds') && typeof value === 'string') {
      const arr = value.split(/[,;]+/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
      value = arr.length === 4 ? arr : (value.trim() === '' ? undefined : this._config[key]);
    }
    // tap_action_*/hold_action_* : JSON texte → objet.
    if ((key.endsWith('_action_left') || key.endsWith('_action_right')) && typeof value === 'string' && value.trim()) {
      try { value = JSON.parse(value); } catch { /* garde la chaîne si invalide */ }
    }
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
        let sv = v;
        if (Array.isArray(sv)) sv = sv.join(', ');
        else if (typeof sv === 'object' && sv !== null) sv = JSON.stringify(sv);
        el.value = (sv == null ? '' : sv);
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
    let v = this._read(key);
    if (Array.isArray(v)) v = v.join(', ');
    else if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
    inp.value = v ?? '';
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

  _entity(key, label, prefix = '') {
    const row = this._row(label);
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `ndt-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
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

  // ── Mécanique commune (NE PAS toucher, + _appendTo pour grouper) ────
  _row(labelHtml, isHtml = false) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label');
    if (isHtml) lbl.innerHTML = labelHtml; else lbl.textContent = labelHtml;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    row.appendChild(lbl); row.appendChild(wrap);
    (this._appendTo || this).appendChild(row);
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

  // ── CSS commun (identique partout) ───────────────────────────────
  _css() {
    return `
      :host { display:block; padding:14px; font-family:var(--primary-font-family,Roboto,sans-serif); }
      .sec { font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--divider-color); }
      .sec:first-child { margin-top:0; }
      .row { display:flex;align-items:center;gap:8px;margin-bottom:6px; }
      .row label { flex:0 0 160px;font-size:12px;color:var(--secondary-text-color); }
      .field-wrap { flex:1;min-width:0;display:flex; }
      input[type=text],input[type=number],select { flex:1;width:100%;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;outline:none;box-sizing:border-box; }
      select { cursor:pointer; }
      input:focus,select:focus { box-shadow:0 0 0 1px var(--primary-color); }
      .color-row { display:flex;gap:8px;flex:1; }
      .color-row input[type=text] { flex:1; }
      .color-row input[type=color] { width:36px;height:28px;flex:none;padding:0;border:none;background:none;border-radius:4px;cursor:pointer; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 6px 168px; }
      details { margin:10px 0; }
      summary { cursor:pointer; font-size:11px; font-weight:700; letter-spacing:1px; color:var(--primary-color); text-transform:uppercase; padding:6px 8px; background:rgba(var(--rgb-primary-color,98,0,234),.08); border:1px solid rgba(var(--rgb-primary-color,98,0,234),.2); border-radius:6px; }
      details .adv-inner { padding:10px 0 2px 10px; border-left:2px solid var(--divider-color); margin-left:4px; }
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
    this._section('Vent (optionnel)');
    this._entity('entity_wind', 'Capteur vent', 'sensor');
    this._text('name_wind', 'Nom vent', 'VENT');
    this._text('wind_unit', 'Unité vent', 'km/h');
    this._entity('entity_bg_pressure', 'Pression (graph fond)', 'sensor');
    this._hint('Optionnel — tracé discret derrière les thermos');

    this._section('Thermomètre Gauche');
    this._entity('entity_left', 'Température gauche (requis)', 'sensor');
    this._text('name_left', 'Nom / pièce gauche', 'SALON');
    this._entity('humidity_entity_left', 'Humidité gauche', 'sensor');
    this._entity('secondary_entity_left', 'Capteur secondaire gauche', 'sensor');
    this._text('secondary_label_left', 'Label capteur sec. gauche', 'LUMINOSITY');
    this._text('secondary_unit_left', 'Unité capteur sec. gauche', 'lx');

    this._section('Thermomètre Droit');
    this._entity('entity_right', 'Température droite (requis)', 'sensor');
    this._text('name_right', 'Nom / pièce droite', 'CHAMBRE');
    this._entity('humidity_entity_right', 'Humidité droite', 'sensor');
    this._entity('secondary_entity_right', 'Capteur secondaire droit', 'sensor');
    this._text('secondary_label_right', 'Label capteur sec. droit', 'CO2');
    this._text('secondary_unit_right', 'Unité capteur sec. droit', 'ppm');

    this._section('Échelle (défauts partagés)');
    this._number('temp_min', 'Temp min (°C)', { min: -50, max: 50, step: 1 });
    this._number('temp_max', 'Temp max (°C)', { min: 0, max: 100, step: 1 });
    this._number('decimal_places', 'Décimales', { min: 0, max: 2, step: 1 });
    this._text('unit', 'Unité', '°C');

    const advL = document.createElement('details'); this.appendChild(advL);
    const sumL = document.createElement('summary'); sumL.textContent = 'Overrides Gauche (optionnel)'; advL.appendChild(sumL);
    const innerL = document.createElement('div'); innerL.className = 'adv-inner'; advL.appendChild(innerL);
    this._appendTo = innerL;
    this._number('temp_min_left', 'Min gauche', { min: -50, max: 50, step: 1, ph: 'Ex: 16 pour intérieur' });
    this._number('temp_max_left', 'Max gauche', { min: 0, max: 100, step: 1, ph: 'Ex: 28 pour intérieur' });
    this._text('zone_thresholds_left', 'Seuils zones gauche', '5, 15, 22, 28');
    this._hint('4 seuils séparés par virgules ex: 18, 20, 23, 26');
    this._color('color_zone1_left', 'Zone 1 gauche', null, '#0099FF');
    this._color('color_zone2_left', 'Zone 2 gauche', null, '#00E8FF');
    this._color('color_zone3_left', 'Zone 3 gauche', null, '#00FFB3');
    this._color('color_zone4_left', 'Zone 4 gauche', null, '#FF9D00');
    this._color('color_zone5_left', 'Zone 5 gauche', null, '#FF2D78');
    this._color('color_plasma_ring1_left', 'Plasma anneau 1 gauche', null, '#00FFB3');
    this._color('color_plasma_ring2_left', 'Plasma anneau 2 gauche', null, '#FF2D78');
    this._number('plasma_saturation_left', 'Saturation plasma gauche', { min: 0.5, max: 3, step: 0.1 });
    this._appendTo = null;

    const advR = document.createElement('details'); this.appendChild(advR);
    const sumR = document.createElement('summary'); sumR.textContent = 'Overrides Droite (optionnel)'; advR.appendChild(sumR);
    const innerR = document.createElement('div'); innerR.className = 'adv-inner'; advR.appendChild(innerR);
    this._appendTo = innerR;
    this._number('temp_min_right', 'Min droite', { min: -50, max: 50, step: 1, ph: 'Ex: -10 pour extérieur' });
    this._number('temp_max_right', 'Max droite', { min: 0, max: 100, step: 1, ph: 'Ex: 35 pour extérieur' });
    this._text('zone_thresholds_right', 'Seuils zones droite', '5, 15, 22, 28');
    this._hint('4 seuils séparés par virgules ex: 5, 15, 22, 28');
    this._color('color_zone1_right', 'Zone 1 droite', null, '#0099FF');
    this._color('color_zone2_right', 'Zone 2 droite', null, '#00E8FF');
    this._color('color_zone3_right', 'Zone 3 droite', null, '#00FFB3');
    this._color('color_zone4_right', 'Zone 4 droite', null, '#FF9D00');
    this._color('color_zone5_right', 'Zone 5 droite', null, '#FF2D78');
    this._color('color_plasma_ring1_right', 'Plasma anneau 1 droite', null, '#00FFB3');
    this._color('color_plasma_ring2_right', 'Plasma anneau 2 droite', null, '#FF2D78');
    this._number('plasma_saturation_right', 'Saturation plasma droite', { min: 0.5, max: 3, step: 0.1 });
    this._appendTo = null;

    this._section('Polices');
    this._text('name_font_family', 'Police nom', 'Rajdhani, monospace');
    this._hint('Vide = thème HA');
    this._text('name_font_size', 'Taille nom', '12px');
    this._text('value_font_family', 'Police valeur', 'Rajdhani, monospace');
    this._text('value_font_size', 'Taille valeur', '28px');
    this._text('sensor_font_family', 'Police capteurs', 'Rajdhani, monospace');
    this._hint('Humidité, secondaire…');
    this._text('sensor_font_size', 'Taille capteurs', '24px');

    this._section('Affichage');
    this._toggle('show_plasma', 'Réacteur plasma', false);
    this._toggle('show_history', 'Historique', false);
    this._number('animation_speed', 'Vitesse animations', { min: 0.2, max: 5, step: 0.1 });
    this._number('history_hours', 'Heures historique', { min: 1, max: 168, step: 1, ph: '24' });
    this._number('plasma_saturation', 'Saturation plasma', { min: 0.5, max: 3, step: 0.1, ph: '1.8' });
    this._hint('1=normal, 2=ultra saturé (défaut: 1.8)');

    this._section('🐾 Easter-egg GLITCH');
    this._hint('chat sur la courbe la plus froide');
    this._toggle('glitch_cat', 'Activer GLITCH', false);
    this._hint('Le chat se matérialise en hologramme glitché Silverhand sur la sparkline');
    this._number('glitch_cat_chance', 'Fréquence', { min: 0, max: 1, step: 0.01, ph: '0.12' });
    this._hint('Proba par tick (~6 s). 0.12 ≈ 1 apparition/50 s');
    this._number('glitch_cat_size', 'Taille (px)', { min: 14, max: 48, step: 1, ph: '26' });
    this._text('glitch_cat_image', 'Image (GIF)', '/local/cat-walking-white.gif');
    this._hint('Sprite marcheur — défaut: cat-walking-white.gif');

    this._section('Actions Gauche (tap / appui long)');
    this._text('tap_action_left', 'Tap action', '{"action":"more-info"}');
    this._hint('JSON: more-info, navigate, call-service, toggle, none');
    this._text('hold_action_left', 'Hold action', '{"action":"none"}');

    this._section('Actions Droite (tap / appui long)');
    this._text('tap_action_right', 'Tap action', '{"action":"more-info"}');
    this._hint('JSON: idem');
    this._text('hold_action_right', 'Hold action', '{"action":"none"}');

    this._section('Couleurs (vide = thème HA)');
    this._color('color_primary', 'Couleur gauche', null, '#00E8FF');
    this._color('color_secondary', 'Couleur droite', null, '#E946FF');

    this._section('Gradient Mercure (partagé — override dans ▶ ci-dessus)');
    this._color('color_zone1', 'Zone 1 (seuil 1)', null, '#0099FF');
    this._color('color_zone2', 'Zone 2 (seuil 2)', null, '#00E8FF');
    this._color('color_zone3', 'Zone 3 (seuil 3)', null, '#00FFB3');
    this._color('color_zone4', 'Zone 4 (seuil 4)', null, '#FF9D00');
    this._color('color_zone5', 'Zone 5 (au-delà)', null, '#FF2D78');
    this._color('color_background', 'Fond intérieur', null, '#04060b');

    this._section('Anneaux Plasma (partagé — override dans ▶ ci-dessus)');
    this._color('color_plasma_ring1', 'Anneau 1 (horizontal)', null, '#00FFB3');
    this._color('color_plasma_ring2', 'Anneau 2 (vertical)', null, '#FF2D78');
  }
}
customElements.define('neon-dual-thermo-card-editor', NeonDualThermoCardEditor);

// ═══════════════════════════════════════════════════════
//  CARD PRINCIPALE
// ═══════════════════════════════════════════════════════
class NeonDualThermoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Left thermometer state
    this._historyLeft = [];
    this._lastTempLeft = null;
    this._prevTempLeft = null;
    this._lastHumidityLeft = null;
    this._lastSecondaryLeft = null;
    this._unavailableLeft = false;
    
    // Right thermometer state
    this._historyRight = [];
    this._lastTempRight = null;
    this._prevTempRight = null;
    this._lastHumidityRight = null;
    this._lastSecondaryRight = null;
    this._unavailableRight = false;
    
    // Wind / bg graph state
    this._lastWindValue    = null;
    this._historyWind      = [];
    this._historyPressure  = [];

    // Shared state
    this._rendered = false;
    this._svgIdLeft = uid();
    this._svgIdRight = uid();
    this._lastHistoryFetch = 0;
    this._rafId = 0;
    this._pendingUpdate = null;
    this._geo = null;
    this._colors = null;
    this._cachedEls = null;

    // Easter-egg GLITCH
    this._glitchTimer = null;    // tick loop (setTimeout)
    this._sparkGeo = null;       // { pts:[{x,y}], color, vbW, vbH } du côté froid, pour poser le chat
  }

  static getConfigElement() { return document.createElement('neon-dual-thermo-card-editor'); }
  static getStubConfig() {
    return {
      entity_left:  'sensor.temperature_salon',
      entity_right: 'sensor.temperature_chambre',
      show_history: true,
    };
  }

  setConfig(raw) {
    // Annuler tout RAF en vol avant rebuild pour éviter les updates fantômes
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = 0; }
    this._stopGlitchLoop();
    this._pendingUpdate = null;
    this._config = buildConfig(raw);
    this._rebuildSideContexts();
    this._rendered = false;
    this._colors = null;
    this._cachedEls = null;
    if (this.shadowRoot.firstChild) this._render();
  }

  // Rebuild per-side geometry and context from current config
  _rebuildSideContexts() {
    const c = this._config;
    const sL = sideConfig(c, 'left');
    const sR = sideConfig(c, 'right');
    this._sideL = sL;
    this._sideR = sR;
    this._geoLeft  = computeGeometry(sL.temp_min, sL.temp_max);
    this._geoRight = computeGeometry(sR.temp_min, sR.temp_max);
  }

  getCardSize() { return this._config?.show_history ? 4 : 3; }

  disconnectedCallback() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    this._stopGlitchLoop();
    this._pendingUpdate = null;
    this._cachedEls = null;
  }

  connectedCallback() {
    if (this._rendered && this.shadowRoot.querySelector('ha-card')) {
      this._cacheElements();
      if (this._hass) {
        this._pendingUpdate = {
          tempLeft: this._lastTempLeft,
          humidityLeft: this._lastHumidityLeft,
          secondaryLeft: this._lastSecondaryLeft,
          tempRight: this._lastTempRight,
          humidityRight: this._lastHumidityRight,
          secondaryRight: this._lastSecondaryRight,
        };
        if (!this._rafId) {
          this._rafId = requestAnimationFrame(() => {
            this._rafId = 0;
            const u = this._pendingUpdate;
            if (u) { this._pendingUpdate = null; this._updateDOM(u); }
          });
        }
      }
      this._startGlitchLoop();   // relance l'easter-egg au retour dans le DOM
    }
  }

  _openMoreInfo(entityId = null) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _bindActions(el, side) {
    const c = this._config;
    let holdTimer = null;
    let held = false;

    const tapAction = side === 'left' ? c.tap_action_left : c.tap_action_right;
    const holdAction = side === 'left' ? c.hold_action_left : c.hold_action_right;
    const entity = side === 'left' ? c.entity_left : c.entity_right;

    // Default tap = more-info for backward compat
    const effectiveTap = tapAction || { action: 'more-info', entity };
    if (!effectiveTap.entity) effectiveTap.entity = entity;

    const effectiveHold = holdAction || { action: 'none' };
    if (!effectiveHold.entity) effectiveHold.entity = entity;

    el.addEventListener('pointerdown', (e) => {
      held = false;
      if (effectiveHold.action !== 'none') {
        holdTimer = setTimeout(() => {
          held = true;
          handleAction(this, this._hass, c, effectiveHold);
        }, 500);
      }
    });

    el.addEventListener('pointerup', () => {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (!held) handleAction(this, this._hass, c, effectiveTap);
    });

    el.addEventListener('pointercancel', () => {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    });
  }

  _resolveColors() {
    if (this._colors) return this._colors;
    const c = this._config;
    const primary   = c.color_primary   || cssVar('--primary-color', '#00E8FF');
    const secondary = c.color_secondary || cssVar('--accent-color', '#E946FF');
    // Defaults for the 5 zones
    const defaults = ['#0099FF', '#00E8FF', '#00FFB3', '#FF9D00', '#FF2D78'];
    const resolveZones = (sc) => ({
      zone1: sc.color_zone1 || c.color_zone1 || defaults[0],
      zone2: sc.color_zone2 || c.color_zone2 || defaults[1],
      zone3: sc.color_zone3 || c.color_zone3 || defaults[2],
      zone4: sc.color_zone4 || c.color_zone4 || defaults[3],
      zone5: sc.color_zone5 || c.color_zone5 || defaults[4],
    });
    this._colors = {
      primary, secondary,
      // Kept for backward compat (shared zones) — used in unavailable/fallback paths
      zone1: c.color_zone1 || defaults[0],
      zone2: c.color_zone2 || defaults[1],
      zone3: c.color_zone3 || defaults[2],
      zone4: c.color_zone4 || defaults[3],
      zone5: c.color_zone5 || defaults[4],
      // Per-side resolved zones
      left:  resolveZones(this._sideL || {}),
      right: resolveZones(this._sideR || {}),
    };
    return this._colors;
  }

  set hass(hass) {
    this._hass = hass;
    const c = this._config;
    if (!c) return;

    let changed = false;

    // Left thermometer
    if (c.entity_left) {
      const stateLeft = hass.states[c.entity_left];
      const unavailLeft = !stateLeft || stateLeft.state === 'unavailable' || stateLeft.state === 'unknown';
      if (unavailLeft !== this._unavailableLeft) {
        this._unavailableLeft = unavailLeft;
        changed = true;
      }
      if (stateLeft && !unavailLeft) {
        const tempLeft = parseFloat(stateLeft.state);
        if (!isNaN(tempLeft)) {
          const humidityLeft = c.humidity_entity_left && hass.states[c.humidity_entity_left]
            ? parseFloat(hass.states[c.humidity_entity_left].state) : null;
          const secondaryLeft = c.secondary_entity_left && hass.states[c.secondary_entity_left]
            ? hass.states[c.secondary_entity_left].state : null;

          if (this._lastTempLeft === null || Math.abs(tempLeft - this._lastTempLeft) > 0.2 ||
              humidityLeft !== this._lastHumidityLeft || secondaryLeft !== this._lastSecondaryLeft) {
            this._prevTempLeft = this._lastTempLeft;
            this._lastTempLeft = tempLeft;
            this._lastHumidityLeft = humidityLeft;
            this._lastSecondaryLeft = secondaryLeft;
            changed = true;
          }
        }
      }
    }

    // Right thermometer
    if (c.entity_right) {
      const stateRight = hass.states[c.entity_right];
      const unavailRight = !stateRight || stateRight.state === 'unavailable' || stateRight.state === 'unknown';
      if (unavailRight !== this._unavailableRight) {
        this._unavailableRight = unavailRight;
        changed = true;
      }
      if (stateRight && !unavailRight) {
        const tempRight = parseFloat(stateRight.state);
        if (!isNaN(tempRight)) {
          const humidityRight = c.humidity_entity_right && hass.states[c.humidity_entity_right]
            ? parseFloat(hass.states[c.humidity_entity_right].state) : null;
          const secondaryRight = c.secondary_entity_right && hass.states[c.secondary_entity_right]
            ? hass.states[c.secondary_entity_right].state : null;

          if (this._lastTempRight === null || Math.abs(tempRight - this._lastTempRight) > 0.2 ||
              humidityRight !== this._lastHumidityRight || secondaryRight !== this._lastSecondaryRight) {
            this._prevTempRight = this._lastTempRight;
            this._lastTempRight = tempRight;
            this._lastHumidityRight = humidityRight;
            this._lastSecondaryRight = secondaryRight;
            changed = true;
          }
        }
      }
    }

    // Wind entity
    if (c.entity_wind) {
      const stateWind = hass.states[c.entity_wind];
      if (stateWind && stateWind.state !== 'unavailable' && stateWind.state !== 'unknown') {
        const windVal = parseFloat(stateWind.state);
        if (!isNaN(windVal) && windVal !== this._lastWindValue) {
          this._lastWindValue = windVal;
          changed = true;
        }
      }
    }

    // History fetch - throttled to reduce load
    const now = Date.now();
    if ((now - this._lastHistoryFetch) > 10 * 60 * 1000) {
      this._lastHistoryFetch = now;
      this._fetchHistory();
    }

    if (!this._rendered) {
      this._rendered = true;
      this._renderShell();
      this._startGlitchLoop();   // easter-egg GLITCH au premier rendu
      changed = true;
    }

    if (!changed) return;

    // Schedule update
    this._pendingUpdate = {
      tempLeft: this._lastTempLeft,
      humidityLeft: this._lastHumidityLeft,
      secondaryLeft: this._lastSecondaryLeft,
      tempRight: this._lastTempRight,
      humidityRight: this._lastHumidityRight,
      secondaryRight: this._lastSecondaryRight,
    };
    
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0;
        const u = this._pendingUpdate;
        if (u) {
          this._pendingUpdate = null;
          this._updateDOM(u);
        }
      });
    }
  }

  async _fetchHistory() {
    const c = this._config;
    const promises = [];
    
    if (c.entity_left)  promises.push(this._fetchHistoryForEntity(c.entity_left,  'left'));
    if (c.entity_right) promises.push(this._fetchHistoryForEntity(c.entity_right, 'right'));
    if (c.entity_wind)  promises.push(this._fetchHistoryForEntity(c.entity_wind,  'wind'));
    if (c.entity_bg_pressure) promises.push(this._fetchHistoryForEntity(c.entity_bg_pressure, 'pressure'));
    
    await Promise.all(promises);
    
    if (this._rendered) {
      this._updateSparkline();
      this._updateBgGraph();
    }
  }

  async _fetchHistoryForEntity(entityId, side) {
    try {
      const hours = this._config.history_hours || 24;
      const start = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const data = await this._hass.callApi(
        'GET',
        `history/period/${start}?filter_entity_id=${entityId}&minimal_response=true&no_attributes=true`
      );
      if (!data || !data[0] || data[0].length < 2) return;

      const raw = data[0].filter(s => !isNaN(parseFloat(s.state)));
      const step = Math.max(1, Math.floor(raw.length / 25));
      const history = raw.filter((_, i) => i % step === 0).slice(-25).map(s => parseFloat(s.state));
      
      if (side === 'left')     this._historyLeft     = history;
      else if (side === 'right')    this._historyRight    = history;
      else if (side === 'wind')     this._historyWind     = history;
      else if (side === 'pressure') this._historyPressure = history;
    } catch (e) {
      console.debug(`[neon-dual-thermo-card] history fetch failed for ${side}:`, e);
    }
  }

  _render() {
    if (this._hass && this._config) {
      this._rendered = true;
      this._renderShell();
      if (this._lastTempLeft !== null || this._lastTempRight !== null) {
        this._updateDOM({
          tempLeft: this._lastTempLeft,
          humidityLeft: this._lastHumidityLeft,
          secondaryLeft: this._lastSecondaryLeft,
          tempRight: this._lastTempRight,
          humidityRight: this._lastHumidityRight,
          secondaryRight: this._lastSecondaryRight,
        });
      }
    }
  }

  _renderShell() {
    const c = this._config;
    const colors = this._resolveColors();
    
    const hasSecLeft  = !!(c.humidity_entity_left  || c.secondary_entity_left);
    const hasSecRight = !!(c.humidity_entity_right || c.secondary_entity_right);
    const hasWind     = !!c.entity_wind;
    const hasBgGraph  = hasWind || !!c.entity_bg_pressure;
    
    const s = c.animation_speed ?? 1;
    const irrDuration = (4 / s).toFixed(1);
    
    let nameLeft  = c.name_left;
    let nameRight = c.name_right;
    if (!nameLeft  && this._hass && c.entity_left)  nameLeft  = this._hass.states[c.entity_left]?.attributes?.friendly_name;
    if (!nameRight && this._hass && c.entity_right) nameRight = this._hass.states[c.entity_right]?.attributes?.friendly_name;

    // Columns: 3 si entity_wind, sinon 2 (rétrocompat)
    const cols = hasWind
      ? 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)'
      : 'minmax(0, 1fr) minmax(0, 1fr)';
    const colRight = hasWind ? 3 : 2;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        ha-card {
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          width: 100%;
          -webkit-transform: translateZ(0);
          container-type: inline-size;
          container-name: thermo-card;
        }

        /* === BG GRAPH — derrière les thermos uniquement (row 2) === */
        .bg-graph {
          grid-column: 1 / -1;
          grid-row: 2;
          position: relative;
          pointer-events: none;
          z-index: 0;
          align-self: stretch;
          min-height: clamp(140px, min(24vw, 38vh), 210px);
        }

        /* === GRID === */
        .card-grid {
          display: grid;
          grid-template-columns: ${cols};
          grid-template-rows: auto auto auto ${c.show_history ? 'auto' : ''};
          padding: 4px clamp(6px, 2vw, 12px);
          gap: 0 clamp(8px, 2vw, 16px);
          box-sizing: border-box;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* === DIVIDERS === */
        .divider {
          position: absolute;
          top: 10px; bottom: 10px;
          width: 1px;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(to bottom,
            transparent,
            ${colors.primary}20 20%,
            ${colors.primary}40 50%,
            ${colors.primary}20 80%,
            transparent);
        }
        .divider-1 { left: ${hasWind ? '33.33%' : '50%'}; }
        .divider-2 { left: 66.66%; display: ${hasWind ? 'block' : 'none'}; }

        /* === ZONE TOP === */
        .zone-top {
          text-align: center;
          padding-bottom: 8px;
          margin-bottom: 8px;
          min-width: 0;
        }
        .zone-top-left   { grid-column: 1;          grid-row: 1; }
        .zone-top-center { grid-column: 2;          grid-row: 1; display: ${hasWind ? 'block' : 'none'}; }
        .zone-top-right  { grid-column: ${colRight}; grid-row: 1; }
        
        .top-name {
          font-size: ${c.name_font_size || '12px'};
          font-family: ${c.name_font_family || 'var(--ha-font-family-body, Rajdhani, monospace)'};
          opacity: 0.6;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 2px;
          font-weight: 600;
          white-space: nowrap;
          overflow: visible;
        }
        .top-name-left {
          color: ${colors.primary};
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 10px ${colors.primary},
            0 0 28px ${colors.primary},
            0 0 60px color-mix(in srgb, ${colors.primary} 40%, transparent);
        }
        .top-name-right {
          color: ${colors.secondary};
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 10px ${colors.secondary},
            0 0 28px ${colors.secondary},
            0 0 60px color-mix(in srgb, ${colors.secondary} 40%, transparent);
        }
        .top-name-center {
          color: ${colors.primary};
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 10px ${colors.primary},
            0 0 28px ${colors.primary},
            0 0 60px color-mix(in srgb, ${colors.primary} 40%, transparent);
        }

        .top-value {
          font-size: ${c.value_font_size || '28px'};
          font-weight: 900;
          font-family: ${c.value_font_family || 'var(--ha-font-family-body, Rajdhani, monospace)'};
          line-height: 1;
          cursor: pointer;
        }
        .top-value-left {
          color: #ffffff;
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 12px ${colors.primary},
            0 0 30px ${colors.primary},
            0 0 60px color-mix(in srgb, ${colors.primary} 40%, transparent);
        }
        .top-value-right {
          color: #ffffff;
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 12px ${colors.secondary},
            0 0 30px ${colors.secondary},
            0 0 60px color-mix(in srgb, ${colors.secondary} 40%, transparent);
        }
        .top-value-center {
          color: #ffffff;
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 12px ${colors.primary},
            0 0 30px ${colors.primary},
            0 0 60px color-mix(in srgb, ${colors.primary} 40%, transparent);
        }
        .top-unit {
          font-size: 0.5em;
          vertical-align: super;
          margin-left: 2px;
          opacity: 0.85;
        }
        .wind-unit {
          font-size: 0.38em;
          opacity: 0.65;
          margin-left: 3px;
          vertical-align: middle;
        }

        /* === ZONE THERMO === */
        .zone-thermo {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(0px, 1.2vh, 4px) 0;
          height: clamp(140px, min(24vw, 38vh), 210px);
          cursor: pointer;
          box-sizing: border-box;
          min-width: 0;
        }
        .zone-thermo-left  { grid-column: 1;          grid-row: 2; position: relative; z-index: 1; }
        .zone-thermo-right { grid-column: ${colRight}; grid-row: 2; position: relative; z-index: 1; }
        .zone-thermo svg {
          height: 100%; width: 100%; max-width: 100%;
          display: block; overflow: hidden;
          transform: translateZ(0);
        }
        .zone-thermo svg .outline { filter: drop-shadow(0 0 3px currentColor); opacity: 0.5; }
        .zone-thermo svg .ticks   { opacity: 0.4; }
        
        .mercury-irradiate {
          animation: irradiate-pulse ${irrDuration}s ease-in-out infinite,
                     liquidFlow ${irrDuration}s ease-in-out infinite;
          will-change: filter, transform;
          stroke-linecap: round;
          transform-origin: center center;
          transform-box: fill-box;
        }
        @keyframes irradiate-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px var(--merc-glow, transparent))
                    drop-shadow(0 0 5px var(--merc-glow, transparent))
                    blur(0.2px);
            opacity: 0.88;
          }
          50% {
            filter: drop-shadow(0 0 3px var(--merc-glow, transparent))
                    drop-shadow(0 0 8px var(--merc-glow, transparent))
                    blur(0.5px);
            opacity: 0.95;
          }
        }
        @keyframes liquidFlow {
          0%   { opacity: 0.85; transform: scaleX(0.97); }
          50%  { opacity: 1;    transform: scaleX(1.03); }
          100% { opacity: 0.85; transform: scaleX(0.97); }
        }

        /* === ZONE SENSORS === */
        .zone-sensors {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-self: start;
          padding: 0;
          gap: 4px;
          width: 100%;
          flex-wrap: nowrap;
          min-width: 0;
          overflow: visible;
        }
        .zone-sensors-left  { grid-column: 1;          grid-row: 3; }
        .zone-sensors-right { grid-column: ${colRight}; grid-row: 3; }

        /* === ZONE SPARK === */
        .zone-spark {
          grid-column: 1 / -1;
          grid-row: 4;
          padding-top: 8px;
          min-width: 0;
        }
        .zone-spark svg { max-width: 100%; }

        /* === SENSOR BLOCKS === */
        .sensor-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1 1 0; container-type: inline-size; }
        .sensor-label {
          font-size: clamp(8px, 9cqi, 11px);
          font-family: Rajdhani, monospace;
          letter-spacing: 1px;
          opacity: 0.5;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .sensor-label-left  { color: ${colors.primary}; }
        .sensor-label-right { color: ${colors.secondary}; }
        .sensor-value {
          font-size: clamp(12px, 18cqi, ${c.sensor_font_size || '24px'});
          font-weight: 700;
          font-family: ${c.sensor_font_family || 'var(--ha-font-family-body, Rajdhani, monospace)'};
          line-height: 1.1;
          white-space: nowrap;
        }
        .sensor-value-left  {
          color: ${colors.primary};
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 10px ${colors.primary},
            0 0 24px ${colors.primary};
        }
        .sensor-value-right {
          color: ${colors.secondary};
          mix-blend-mode: screen;
          text-shadow:
            0 0 3px rgba(255,255,255,0.9),
            0 0 10px ${colors.secondary},
            0 0 24px ${colors.secondary};
        }
        .sensor-unit { font-size: 0.5em; margin-left: 2px; }

        /* === UNAVAILABLE === */
        .unavailable { opacity: 0.35; filter: grayscale(0.7); }
        /* Thermo HS : on ternit l'anneau plasma + paroi (le mercure est patché en JS) */
        .thermo-dead .outline { filter: none; opacity: 0.4 !important; }
        .thermo-dead .mercury-irradiate { animation: none; }
        .thermo-dead ellipse { opacity: 0.18 !important; filter: none !important;
          stroke: #4a5160 !important; }
        .unavailable-blink { animation: unavail-blink 2s ease-in-out infinite; }
        @keyframes unavail-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        /* === EASTER-EGG GLITCH (Silverhand sur la courbe) === */
        .zone-spark { position: relative; }
        .glitch-cat {
          position: absolute; pointer-events: none; z-index: 5;
          filter: drop-shadow(0 0 5px var(--gc-glow, #2EE5B6));
        }
        .gc-layer {
          position: absolute; left: 0; top: 0;
          image-rendering: pixelated; transform-origin: center bottom;
        }
        .gc-main { z-index: 3; animation: gc-main 1.7s steps(1) forwards; }
        .gc-rd {
          z-index: 2; mix-blend-mode: screen;
          filter: brightness(1.2) sepia(1) hue-rotate(-50deg) saturate(7);
          animation: gc-rd 1.7s steps(2) forwards;
        }
        .gc-cy {
          z-index: 2; mix-blend-mode: screen;
          filter: brightness(1.2) sepia(1) hue-rotate(140deg) saturate(7);
          animation: gc-cy 1.7s steps(2) forwards;
        }
        .gc-scan {
          z-index: 4; mix-blend-mode: overlay; opacity: 0;
          background: repeating-linear-gradient(0deg,
            rgba(0,255,249,0) 0px, rgba(0,255,249,0.18) 1px, rgba(0,255,249,0) 3px);
          animation: gc-scan 1.7s linear forwards;
        }
        @keyframes gc-main {
          0%{opacity:.15;clip-path:inset(0 0 0 0)} 8%{opacity:.9;clip-path:inset(40% 0 30% 0)}
          16%{opacity:.5;clip-path:inset(0 0 0 0)} 26%{opacity:.95;clip-path:inset(0 0 60% 0)}
          40%{opacity:.9} 70%{opacity:.92} 80%{opacity:.7;clip-path:inset(55% 0 0 0)}
          90%{opacity:.3} 100%{opacity:0}
        }
        @keyframes gc-rd {
          0%,100%{opacity:0;transform:translateX(0)} 10%{opacity:.8;transform:translate(-6px,1px)}
          26%{opacity:.6;transform:translateX(5px)} 50%{opacity:.7;transform:translateX(-3px)}
          80%{opacity:.4;transform:translateX(4px)} 92%{opacity:.2}
        }
        @keyframes gc-cy {
          0%,100%{opacity:0;transform:translateX(0)} 10%{opacity:.8;transform:translate(6px,-1px)}
          26%{opacity:.6;transform:translateX(-5px)} 50%{opacity:.7;transform:translateX(3px)}
          80%{opacity:.4;transform:translateX(-4px)} 92%{opacity:.2}
        }
        @keyframes gc-scan {
          0%{opacity:0} 12%{opacity:.9} 85%{opacity:.6} 100%{opacity:0;background-position-y:-24px}
        }
        @media (prefers-reduced-motion: reduce) {
          .glitch-cat { display: none !important; }
        }

        /* === RESPONSIVE === */
        @media (max-width: 500px) {
          .card-grid { padding: 4px 8px; gap: 0 8px; }
          .top-name  { letter-spacing: 1.5px; font-size: 11px; }
          .zone-sensors { gap: 6px; }
        }
        @media (max-width: 1100px) and (orientation: landscape) {
          .zone-thermo  { height: clamp(120px, 28vh, 180px); }
          .zone-sensors { gap: 6px; }
        }
        @container thermo-card (max-width: 360px) {
          .zone-sensors { flex-wrap: wrap; justify-content: flex-start; }
          .sensor-block { flex: 1 1 45%; }
        }
      </style>

      <ha-card>
        <div class="divider divider-1"></div>
        <div class="divider divider-2"></div>
        <div class="card-grid">
          <div class="bg-graph" id="bg-graph"></div>

          <!-- LEFT THERMOMETER -->
          <div class="zone-top zone-top-left">
            ${nameLeft ? `<div class="top-name top-name-left">${nameLeft.toUpperCase()}</div>` : ''}
            <div class="top-value top-value-left" data-click="${c.entity_left}">
              <span id="temp-val-left">--</span><span class="top-unit">${c.unit}</span>
            </div>
          </div>

          <!-- CENTRE — VENT -->
          <div class="zone-top zone-top-center">
            <div class="top-name top-name-center">${(c.name_wind || 'VENT').toUpperCase()}</div>
            <div class="top-value top-value-center">
              <span id="wind-val">--</span><span class="wind-unit">${c.wind_unit || 'km/h'}</span>
            </div>
          </div>

          <!-- RIGHT THERMOMETER -->
          <div class="zone-top zone-top-right">
            ${nameRight ? `<div class="top-name top-name-right">${nameRight.toUpperCase()}</div>` : ''}
            <div class="top-value top-value-right" data-click="${c.entity_right}">
              <span id="temp-val-right">--</span><span class="top-unit">${c.unit}</span>
            </div>
          </div>

          <div class="zone-thermo zone-thermo-left"  id="zone-thermo-left"  data-click="${c.entity_left}"></div>
          <div class="zone-thermo zone-thermo-right" id="zone-thermo-right" data-click="${c.entity_right}"></div>

          ${hasSecLeft  ? '<div class="zone-sensors zone-sensors-left"  id="zone-sensors-left"></div>'  : ''}
          ${hasSecRight ? '<div class="zone-sensors zone-sensors-right" id="zone-sensors-right"></div>' : ''}

          ${c.show_history ? '<div class="zone-spark" id="zone-spark"></div>' : ''}
        </div>
      </ha-card>`;

    // Build thermometer skeletons — chaque côté a sa propre geometry + sideCtx
    const sideCtxLeft = {
      zones: colors.left,
      plasmaRing1: this._sideL.color_plasma_ring1,
      plasmaRing2: this._sideL.color_plasma_ring2,
      plasmaSaturation: this._sideL.plasma_saturation,
    };
    const sideCtxRight = {
      zones: colors.right,
      plasmaRing1: this._sideR.color_plasma_ring1,
      plasmaRing2: this._sideR.color_plasma_ring2,
      plasmaSaturation: this._sideR.plasma_saturation,
    };

    const zThermoLeft = this.shadowRoot.querySelector('#zone-thermo-left');
    if (zThermoLeft && c.entity_left) {
      zThermoLeft.innerHTML = buildThermoSkeleton(c, colors.primary, this._svgIdLeft, this._geoLeft, sideCtxLeft);
    }
    
    const zThermoRight = this.shadowRoot.querySelector('#zone-thermo-right');
    if (zThermoRight && c.entity_right) {
      zThermoRight.innerHTML = buildThermoSkeleton(c, colors.secondary, this._svgIdRight, this._geoRight, sideCtxRight);
    }
    
    // Add tap/hold action handlers
    this.shadowRoot.querySelectorAll('[data-click]').forEach(el => {
      const entity = el.getAttribute('data-click');
      if (entity) {
        const side = entity === c.entity_left ? 'left' : 'right';
        this._bindActions(el, side);
      }
    });
    
    this._cacheElements();
  }

  _cacheElements() {
    const sr = this.shadowRoot;
    this._cachedEls = {
      // Left
      tempValLeft:   sr.querySelector('#temp-val-left'),
      mercuryLeft:   sr.querySelector(`#zone-thermo-left [data-el="mercury"]`),
      tickLinesLeft: Array.from(sr.querySelectorAll('#zone-thermo-left [data-t]')),
      sensorsLeft:   sr.querySelector('#zone-sensors-left'),
      // Right
      tempValRight:   sr.querySelector('#temp-val-right'),
      mercuryRight:   sr.querySelector(`#zone-thermo-right [data-el="mercury"]`),
      tickLinesRight: Array.from(sr.querySelectorAll('#zone-thermo-right [data-t]')),
      sensorsRight:   sr.querySelector('#zone-sensors-right'),
      // Centre
      windVal: sr.querySelector('#wind-val'),
      // Shared
      spark:   sr.querySelector('#zone-spark'),
      bgGraph: sr.querySelector('#bg-graph'),
    };
  }

  _updateDOM(u) {
    if (!this._cachedEls) return;
    
    const c = this._config;
    const colors = this._resolveColors();
    const sr = this.shadowRoot;

    // Unavailable visual states
    for (const side of ['left', 'right']) {
      const unavail = side === 'left' ? this._unavailableLeft : this._unavailableRight;
      const topZone = sr.querySelector(`.zone-top-${side}`);
      const thermoZone = sr.querySelector(`.zone-thermo-${side}`);
      const tempVal = side === 'left' ? this._cachedEls.tempValLeft : this._cachedEls.tempValRight;

      if (topZone) topZone.classList.toggle('unavailable-blink', unavail);
      if (thermoZone) thermoZone.classList.toggle('unavailable', unavail);
      // #2 : capteur HS → mercure descendu à la base + désaturé (le retour à dispo est
      // réécrit par le prochain _patchThermoFast).
      if (thermoZone) thermoZone.classList.toggle('thermo-dead', unavail);
      if (unavail) {
        if (tempVal) tempVal.textContent = '--';
        this._killThermo(side);
      }
    }

    // Update wind value
    if (this._cachedEls.windVal && this._lastWindValue !== null) {
      this._cachedEls.windVal.textContent = this._lastWindValue.toFixed(c.decimal_places ?? 1);
    }

    // Update left thermometer
    if (u.tempLeft !== null && c.entity_left && !this._unavailableLeft) {
      if (this._cachedEls.tempValLeft) {
        this._cachedEls.tempValLeft.textContent = u.tempLeft.toFixed(c.decimal_places);
      }
      this._patchThermoFast('left', u.tempLeft, c, colors);
      this._updateSensors('left', u.humidityLeft, u.secondaryLeft, colors);
    }

    // Update right thermometer
    if (u.tempRight !== null && c.entity_right && !this._unavailableRight) {
      if (this._cachedEls.tempValRight) {
        this._cachedEls.tempValRight.textContent = u.tempRight.toFixed(c.decimal_places);
      }
      this._patchThermoFast('right', u.tempRight, c, colors);
      this._updateSensors('right', u.humidityRight, u.secondaryRight, colors);
    }

    this._updateSparkline();
    this._updateBgGraph();
  }

  // #2 : capteur indisponible — mercure ramené à la base + gradient gris, glow coupé.
  // .thermo-dead (CSS) gère le ternissement plasma/paroi ; ici on traite le liquide SVG.
  _killThermo(side) {
    const geo = side === 'left' ? this._geoLeft : this._geoRight;
    const mercury = side === 'left' ? this._cachedEls.mercuryLeft : this._cachedEls.mercuryRight;
    if (!mercury) return;
    const { gradBottom, cy, BR_I } = geo;
    // Mercure quasi vide : un filet à la base du bulbe
    const mercTop = gradBottom - 2;
    mercury.setAttribute('y', mercTop);
    mercury.setAttribute('height', cy + BR_I - mercTop);
    mercury.style.setProperty('--merc-glow', 'transparent');
    const grad = mercury.closest('svg')?.querySelector('[id$="-mercury"]');
    if (grad) {
      grad.children[0].setAttribute('stop-color', '#2a2f3a');
      grad.children[1].setAttribute('stop-color', '#3a4150');
      grad.children[2].setAttribute('stop-color', '#2a2f3a');
    }
  }

  _patchThermoFast(side, temp, c, colors) {
    const color = side === 'left' ? colors.primary : colors.secondary;
    const geo = side === 'left' ? this._geoLeft : this._geoRight;
    const sc  = side === 'left' ? this._sideL  : this._sideR;
    const sideZones = side === 'left' ? colors.left : colors.right;
    const thresholds = sc.zone_thresholds || [5, 15, 22, 28];

    const { gradBottom, gradH, cy, BR_I, range, temp_min } = geo;
    const ratio = clamp((temp - temp_min) / range, 0, 1);
    const mercTop = gradBottom - ratio * gradH;
    const h = cy + BR_I - mercTop;

    const mercury = side === 'left' ? this._cachedEls.mercuryLeft : this._cachedEls.mercuryRight;

    // Couleur mercure selon les seuils configurables du côté
    const zIdx = zoneIndexForTemp(temp, thresholds);
    const mercColor = sideZones['zone' + zIdx];

    if (mercury) {
      mercury.setAttribute('y', mercTop);
      mercury.setAttribute('height', h);
      mercury.style.setProperty('--merc-glow', mercColor);
      // Mettre à jour les stops du gradient pour suivre la couleur de zone
      const svgEl = mercury.closest('svg');
      if (svgEl) {
        const grad = svgEl.querySelector('[id$="-mercury"]');
        if (grad) {
          const darkColor = saturateHex(mercColor, 0.7);
          grad.children[0].setAttribute('stop-color', darkColor);
          grad.children[1].setAttribute('stop-color', mercColor);
          grad.children[2].setAttribute('stop-color', darkColor);
        }
      }
    }
    // Tick colors - throttled
    const counterKey = `_tickCounter${side === 'left' ? 'Left' : 'Right'}`;
    if (!this[counterKey]) this[counterKey] = 0;
    if (++this[counterKey] % 30 === 0) {
      const tickLines = side === 'left' ? this._cachedEls.tickLinesLeft : this._cachedEls.tickLinesRight;
      if (tickLines) {
        for (let i = 0; i < tickLines.length; i++) {
          const el = tickLines[i];
          const t = parseFloat(el.getAttribute('data-t'));
          const isActive = t <= temp;
          let tickColor = color;
          if (isActive) {
            tickColor = sideZones['zone' + zoneIndexForTemp(t, thresholds)];
          }
          if (el.tagName === 'line') {
            el.setAttribute('stroke', tickColor);
          } else {
            el.setAttribute('fill', tickColor);
            el.setAttribute('opacity', '0.85');
          }
        }
      }
    }
  }

  _updateSensors(side, humidity, secondary, colors) {
    const c = this._config;
    const zSensors = side === 'left' ? this._cachedEls.sensorsLeft : this._cachedEls.sensorsRight;
    if (!zSensors) return;

    const color = side === 'left' ? colors.primary : colors.secondary;
    const colorClass = side === 'left' ? 'left' : 'right';
    
    const humidityEntity = side === 'left' ? c.humidity_entity_left : c.humidity_entity_right;
    const secondaryEntity = side === 'left' ? c.secondary_entity_left : c.secondary_entity_right;
    const secondaryLabel = side === 'left' ? c.secondary_label_left : c.secondary_label_right;
    const secondaryUnit = side === 'left' ? c.secondary_unit_left : c.secondary_unit_right;

    const parts = [];
    if (humidity !== null) {
      parts.push({
        label: 'HUMIDITY',
        value: humidity.toFixed(0),
        unit: '%',
        entity: humidityEntity,
      });
    }
    if (secondary !== null) {
      parts.push({
        label: (secondaryLabel || 'SENSOR').toUpperCase(),
        value: secondary,
        unit: secondaryUnit || '',
        entity: secondaryEntity,
      });
    }

    const count = parts.length;
    if (zSensors._count !== count) {
      zSensors._count = count;
      zSensors.innerHTML = parts.map((p, i) => `
        <div class="sensor-block" data-idx="${i}" data-entity="${p.entity}" style="cursor: pointer;">
          <span class="sensor-label sensor-label-${colorClass}">${p.label}</span>
          <span class="sensor-value sensor-value-${colorClass}">
            <span class="val">${p.value}</span><span class="sensor-unit">${p.unit}</span>
          </span>
        </div>`).join('');
      
      zSensors.querySelectorAll('.sensor-block[data-entity]').forEach(block => {
        block.addEventListener('click', (e) => {
          e.stopPropagation();
          const entity = block.getAttribute('data-entity');
          if (entity) this._openMoreInfo(entity);
        });
      });
    } else {
      parts.forEach((p, i) => {
        const el = zSensors.querySelector(`[data-idx="${i}"] .val`);
        if (el) el.textContent = p.value;
      });
    }
  }

  _updateBgGraph() {
    const el = this._cachedEls?.bgGraph;
    if (!el) return;
    const hW = this._historyWind;
    const hP = this._historyPressure;
    const keyW = hW.length ? `${hW.length}:${hW[0]}:${hW[hW.length-1]}` : 'e';
    const keyP = hP.length ? `${hP.length}:${hP[0]}:${hP[hP.length-1]}` : 'e';
    const key  = `${keyW}|${keyP}`;
    if (el._key === key) return;
    el._key = key;
    const colors = this._resolveColors();
    const { svg, labels } = buildBgGraphSVG(hW, hP, colors.primary);
    el.innerHTML = svg + labels;
  }

  _updateSparkline() {
    const c = this._config;
    const zSpark = this._cachedEls?.spark;
    if (!zSpark || !c.show_history) return;

    const hL = this._historyLeft;
    const hR = this._historyRight;
    const keyL = hL.length ? `${hL.length}:${hL[0]}:${hL[hL.length - 1]}` : 'empty';
    const keyR = hR.length ? `${hR.length}:${hR[0]}:${hR[hR.length - 1]}` : 'empty';
    const key = `${keyL}|${keyR}`;
    
    if (zSpark._key === key) return;
    zSpark._key = key;
    zSpark.innerHTML = buildDualSparkSVG(hL, hR, this._resolveColors(), this._svgIdLeft, c.animation_speed, c.history_hours || 24);

    // Mémorise la géométrie de la courbe la plus FROIDE (= extérieur) pour y poser GLITCH.
    this._computeSparkGeo(hL, hR);
  }

  // ═══════════════ EASTER-EGG GLITCH (Johnny Silverhand sur la courbe) ═══════════════

  // Calcule les points {x,y} viewBox de la polyline dont la moyenne est la plus basse.
  _computeSparkGeo(hL, hR) {
    const colors = this._resolveColors();
    const hasL = hL && hL.length > 1, hasR = hR && hR.length > 1;
    if (!hasL && !hasR) { this._sparkGeo = null; return; }

    // Range combiné (identique à buildDualSparkSVG)
    let hMin = Infinity, hMax = -Infinity, sumL = 0, sumR = 0;
    if (hasL) for (const v of hL) { if (v < hMin) hMin = v; if (v > hMax) hMax = v; sumL += v; }
    if (hasR) for (const v of hR) { if (v < hMin) hMin = v; if (v > hMax) hMax = v; sumR += v; }
    const hRange = Math.max(hMax - hMin, 0.1);

    const avgL = hasL ? sumL / hL.length : Infinity;
    const avgR = hasR ? sumR / hR.length : Infinity;
    // Côté le plus froid ; si un seul dispo, on le prend.
    const useLeft = hasL && (!hasR || avgL <= avgR);
    const series = useLeft ? hL : hR;
    const color  = useLeft ? colors.primary : colors.secondary;

    this._sparkGeo = { pts: sparkPoints(series, hMin, hRange), color, vbW: SPARK_W, vbH: SPARK_VBH };
  }

  // Y (viewBox) de la courbe froide pour un X (viewBox) donné — interpolation linéaire.
  _curveY(xv) {
    const pts = this._sparkGeo?.pts;
    if (!pts || !pts.length) return 0;
    if (xv <= pts[0].x) return pts[0].y;
    if (xv >= pts[pts.length - 1].x) return pts[pts.length - 1].y;
    for (let i = 1; i < pts.length; i++) {
      if (xv <= pts[i].x) {
        const a = pts[i - 1], b = pts[i];
        const t = (xv - a.x) / ((b.x - a.x) || 1);
        return a.y + (b.y - a.y) * t;
      }
    }
    return pts[pts.length - 1].y;
  }

  // Boucle de tick : à chaque tick, proba glitch_cat_chance de faire apparaître GLITCH.
  _startGlitchLoop() {
    this._stopGlitchLoop();
    const c = this._config;
    if (!c.glitch_cat) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tick = () => {
      // pas de spawn si onglet caché, pas encore de courbe, ou un chat déjà à l'écran
      if (!document.hidden && this._sparkGeo &&
          !this._cachedEls?.spark?.querySelector('.glitch-cat') &&
          Math.random() < c.glitch_cat_chance) {
        this._spawnGlitchCat();
      }
      this._glitchTimer = setTimeout(tick, 6000);
    };
    this._glitchTimer = setTimeout(tick, 6000);
  }

  _stopGlitchLoop() {
    if (this._glitchTimer) { clearTimeout(this._glitchTimer); this._glitchTimer = null; }
  }

  // Matérialise GLITCH en hologramme Silverhand à un point aléatoire de la courbe froide.
  _spawnGlitchCat() {
    const c = this._config;
    const spark = this._cachedEls?.spark;
    const geo = this._sparkGeo;
    if (!spark || !geo) return;
    const svgEl = spark.querySelector('svg');
    if (!svgEl) return;

    const r = svgEl.getBoundingClientRect();
    if (!r.width) return;
    const sx = r.width / geo.vbW, sy = r.height / geo.vbH;

    // point aléatoire sur 20%–85% de la courbe (reste visible)
    const x0 = geo.pts[0].x, x1 = geo.pts[geo.pts.length - 1].x;
    const xv = x0 + (0.2 + Math.random() * 0.6) * (x1 - x0);
    const yv = this._curveY(xv);
    const sizeH = c.glitch_cat_size || 26;
    const sizeW = Math.round(sizeH * 1.3);   // GIF ratio ≈ 4:3
    const px = xv * sx, py = yv * sy;

    const wrap = document.createElement('div');
    wrap.className = 'glitch-cat';
    wrap.style.left = (px - sizeW * 0.5) + 'px';
    wrap.style.top  = (py - sizeH * 0.92) + 'px';   // pied collé à la ligne
    wrap.style.width = sizeW + 'px';
    wrap.style.height = sizeH + 'px';
    wrap.style.setProperty('--gc-glow', geo.color);

    // 3 calques (rouge / cyan / principal) + scanlines — le GIF marche pendant le glitch
    const img = c.glitch_cat_image;
    for (const cls of ['gc-rd', 'gc-cy', 'gc-main', 'gc-scan']) {
      const el = document.createElement(cls === 'gc-scan' ? 'div' : 'img');
      el.className = 'gc-layer ' + cls;
      el.style.width = sizeW + 'px';
      el.style.height = sizeH + 'px';
      if (el.tagName === 'IMG') { el.src = img; el.alt = ''; }
      wrap.appendChild(el);
    }
    spark.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1800);
  }
}

customElements.define('neon-dual-thermo-card', NeonDualThermoCard);

// Banner
console.info(
  '%c 🌡️ NEON-DUAL-THERMO-CARD %c v' + VERSION + ' %c Neo Tokyo ',
  'color:#00E8FF;font-weight:bold;background:#040810;padding:2px 6px;border-radius:3px 0 0 0',
  'color:#E946FF;font-weight:bold;background:#040810;padding:2px 6px',
  'background:#040811;color:#9D4EDD;padding:2px 6px;border-radius:0 3px 3px 0;font-weight:bold',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-dual-thermo-card',
  name: 'Neon Dual Thermometer Card',
  description: 'Double thermomètre néon cyberpunk — v2 avec vent + graph fond',
  preview: true,
});
