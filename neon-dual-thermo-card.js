/**
 * neon-dual-thermo-card v1.0.0
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
 */

const VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
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
    
    // Shared settings
    temp_min:   raw.temp_min  ?? -20,
    temp_max:   raw.temp_max  ?? 40,
    unit:       raw.unit      ?? '°C',
    show_history:   raw.show_history   ?? true,
    show_plasma:    raw.show_plasma    ?? true,
    decimal_places: raw.decimal_places ?? 1,
    
    // Colors
    color_primary:    raw.color_primary    || null,  // Left thermo
    color_secondary:  raw.color_secondary  || null,  // Right thermo
    color_zone1:      raw.color_zone1      || null,  // <5°C
    color_zone2:      raw.color_zone2      || null,  // 5-15°C
    color_zone3:      raw.color_zone3      || null,  // 15-22°C
    color_zone4:      raw.color_zone4      || null,  // 22-28°C
    color_zone5:      raw.color_zone5      || null,  // >28°C
    color_background: raw.color_background || null,  // Interior fill
    color_plasma_ring1: raw.color_plasma_ring1 || null,  // Plasma ring 1
    color_plasma_ring2: raw.color_plasma_ring2 || null,  // Plasma ring 2
    animation_speed:  raw.animation_speed  ?? 1,
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

let _uid = 0;
function uid() { return 'ndtc' + (++_uid); }

// ═══════════════════════════════════════════════════════
//  THERMO GEOMETRY
// ═══════════════════════════════════════════════════════
function computeGeometry(c) {
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

  const range = c.temp_max - c.temp_min;
  const pxPerDeg = gradH / range;
  const ticks = [];
  for (let t = c.temp_min; t <= c.temp_max; t += 2) {
    ticks.push({
      t,
      y: gradBottom - (t - c.temp_min) * pxPerDeg,
      long: (t % 10 === 0),
    });
  }

  return {
    PAD, tubeH, bulbSpace,
    TW_E, BR_E, TW_I, BR_I,
    cx, vbW, tubeTop, cy,
    tang_E, tang_I,
    gradTop, gradBottom, gradH, pxPerDeg,
    svgH, pr1, pr2, range, ticks,
  };
}

// ═══════════════════════════════════════════════════════
//  THERMO SVG
// ═══════════════════════════════════════════════════════
function buildThermoSkeleton(c, color, id, geo) {
  const { zone1, zone2, zone3, zone4, zone5 } = c._gradColors;
  const bgColor = c.color_background || cssVar('--card-background-color', '#04060b');
  const plasmaRing1 = c.color_plasma_ring1 || zone3;
  const plasmaRing2 = c.color_plasma_ring2 || zone5;
  const {
    TW_E, BR_E, TW_I, BR_I, cx, vbW,
    tubeTop, cy, tang_E, tang_I,
    gradTop, gradBottom, gradH,
    svgH, pr1, pr2, ticks, range,
  } = geo;
  const s  = c.animation_speed ?? 1;
  const d1 = (2.5 / s).toFixed(1), d2 = (3.5 / s).toFixed(1);
  const d3 = (6 / s).toFixed(1);

  // Temperature-based gradient: map actual temps to gradient offsets
  // Gradient y1="1" y2="0" means: offset 0% = bottom (cold), offset 100% = top (hot)
  // Mercury rises UP when hot, so bottom = low temps, top = high temps
  const tempCold = c.temp_min;        // Bottom end (coldest)
  const tempMid = 20;                 // Middle reference
  const tempHot = c.temp_max;         // Top end (hottest)
  
  // Calculate gradient stop positions based on temperature range
  const offsetCold = 0;   // temp_min at bottom (cold colors)
  const offsetMid = ((tempMid - tempCold) / range) * 100;
  const offsetHot = 100;  // temp_max at top (hot colors)

  return `<svg viewBox="0 0 ${vbW} ${svgH}" width="100%" preserveAspectRatio="xMidYMid meet"
  style="display:block;overflow:visible" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"  stop-color="#fff" stop-opacity="0.14"/>
      <stop offset="1"  stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-clip">
      <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
        L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"/>
    </clipPath>
  </defs>

  <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
    L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"
    fill="${bgColor}"/>

  <g clip-path="url(#${id}-clip)">
    <!-- Mercury with solid color and CSS irradiation -->
    <rect data-el="mercury" class="mercury-irradiate" x="${cx - BR_I - 4}" width="${(BR_I + 4) * 2}"
      y="${gradBottom}" height="${cy + BR_I - gradBottom}"
      fill="${zone3}"/>
    <rect data-el="shine" x="${cx - TW_I + 1}" width="5"
      y="${gradBottom}" height="${cy + BR_I - gradBottom}"
      fill="url(#${id}-shine)"/>
  </g>

  ${c.show_plasma ? `
  <g transform="translate(${cx},${cy})">
    <circle r="${BR_I + 5}" stroke="${color}" stroke-width="0.5" stroke-dasharray="1 3"
      fill="none" opacity="0.2" shape-rendering="auto"/>
    <g style="will-change: transform;">
      <ellipse rx="${pr1}" ry="${pr2}" fill="none" stroke="${plasmaRing1}" stroke-width="1.5" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360"
          dur="${d1}s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse rx="${pr2}" ry="${pr1}" fill="none" stroke="${plasmaRing2}" stroke-width="1.5" opacity="0.55">
        <animateTransform attributeName="transform" type="rotate" from="360" to="0"
          dur="${d2}s" repeatCount="indefinite"/>
      </ellipse>
    </g>
  </g>` : ''}

  <g class="outline">
    <path d="M${cx - TW_E},${tubeTop} A${TW_E},${TW_E} 0 0,1 ${cx + TW_E},${tubeTop}
      L${cx + TW_E},${tang_E} A${BR_E},${BR_E} 0 1,1 ${cx - TW_E},${tang_E} Z"
      fill="none" stroke="${color}" stroke-width="1.8" opacity="0.75"/>
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

// ── Dual Sparkline 24h ──────────────────────────────────────────
function buildDualSparkSVG(histLeft, histRight, colors, id, speed = 1) {
  const hasLeft = histLeft && histLeft.length > 0;
  const hasRight = histRight && histRight.length > 0;
  if (!hasLeft && !hasRight) return '';
  
  const { primary: priLeft, secondary: priRight } = colors;
  const W = 640, H = 55, PAD_Y = 14;

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
    opacity="0.5" letter-spacing="1">DUAL_CYCLIC_ANALYSIS_24H</text>
  
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
    <text x="0" y="${PAD_Y + H + 16}">T-24</text>
    <line x1="${W / 2}" y1="${PAD_Y + H}" x2="${W / 2}" y2="${PAD_Y + H + 6}" stroke="${priLeft}" stroke-width="1"/>
    <text x="${W / 2}" y="${PAD_Y + H + 16}">T-12</text>
    <line x1="${W}" y1="${PAD_Y + H}" x2="${W}" y2="${PAD_Y + H + 6}" stroke="${priLeft}" stroke-width="1" stroke-dasharray="2 1"/>
    <text x="${W}" y="${PAD_Y + H + 16}" font-weight="700">NOW</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonDualThermoCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    if (!this._built && this._hass) { this._built = true; this._build(); }
  }
  set hass(h) {
    this._hass = h;
    if (!this._built && this._config) { this._built = true; this._build(); }
  }

  _entities() {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter(e => e.startsWith('sensor.') || e.startsWith('input_number.'))
      .sort();
  }

  _entitySelect(label, key, hint = '') {
    const val = this._config[key] || '';
    const entities = this._entities();
    const listId = `dl-${key.replace(/[^a-z0-9]/gi, '')}`;
    const options = entities.map(e => `<option value="${e}">`).join('');
    return `<div class="field"><label>${label}</label>
      <input type="text" data-key="${key}" data-entity="1" value="${val}"
        list="${listId}" placeholder="Type to filter..." autocomplete="off"/>
      <datalist id="${listId}">${options}</datalist>
      ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
  }

  _input(label, key, type = 'text', placeholder = '', hint = '') {
    const val = this._config[key] ?? '';
    if (type === 'text') {
      return `<div class="field"><label>${label}</label>
        <textarea data-key="${key}" rows="1" class="text-input" placeholder="${placeholder}">${val}</textarea>
        ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
    }
    return `<div class="field"><label>${label}</label>
      <input type="${type}" data-key="${key}" value="${val}" placeholder="${placeholder}"/>
      ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
  }

  _number(label, key, min, max, step = 1, hint = '') {
    const val = this._config[key] ?? '';
    return `<div class="field"><label>${label}</label>
      <input type="number" data-key="${key}" value="${val}" min="${min}" max="${max}" step="${step}"/>
      ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
  }

  _toggle(label, key, hint = '') {
    const val = !!this._config[key];
    return `<div class="field toggle-field">
      <label>${label}</label>
      <label class="switch">
        <input type="checkbox" data-key="${key}" ${val ? 'checked' : ''}/>
        <span class="slider"></span>
      </label>
      ${hint ? `<p class="hint" style="flex-basis:100%">${hint}</p>` : ''}
    </div>`;
  }

  _color(label, key, def = '#00E8FF', ph = 'var(--primary-color) ou #hex') {
    const val = this._config[key] || '';
    return `<div class="field"><label>${label}</label>
      <div class="color-row">
        <input type="color" data-key="${key}" value="${val || def}" ${!val ? 'style="opacity:.4"' : ''}/>
        <input type="text" data-key="${key}" value="${val}" placeholder="${ph}" class="color-text"/>
        <span class="color-reset" data-reset="${key}">↺</span>
      </div></div>`;
  }

  _build() {
    this.innerHTML = `
      <style>
        :host { display:block; padding:4px 0; }
        h3 { font-size:12px; font-weight:700; color:var(--primary-color);
          text-transform:uppercase; letter-spacing:1.5px; margin:18px 0 8px;
          padding-bottom:5px; border-bottom:1px solid var(--divider-color);
          display:flex; align-items:center; gap:6px; }
        h3::before { content:''; display:block; width:3px; height:13px;
          background:var(--primary-color); border-radius:2px; }
        .field { margin-bottom:10px; }
        .toggle-field { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:4px; }
        .toggle-field label:first-child { flex:1; }
        label { display:block; font-size:12px; color:var(--secondary-text-color); margin-bottom:3px; }
        input[type=text],input[type=number],select,textarea {
          width:100%; padding:6px 8px; border-radius:6px;
          border:1px solid var(--divider-color); background:var(--card-background-color);
          color:var(--primary-text-color); font-size:13px; box-sizing:border-box; font-family:inherit; }
        textarea.text-input { resize:none; overflow:hidden; min-height:34px; line-height:1.4; }
        input[type=color] { height:34px; width:40px; padding:2px; border-radius:6px;
          border:1px solid var(--divider-color); cursor:pointer; flex-shrink:0; }
        .color-row { display:flex; gap:6px; align-items:center; }
        .color-text { flex:1; }
        .color-reset { font-size:13px; color:var(--primary-color); cursor:pointer;
          padding:4px 6px; border-radius:4px; border:1px solid var(--divider-color);
          line-height:1; flex-shrink:0; user-select:none; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
        .hint { font-size:10px; color:var(--disabled-text-color); margin:3px 0 0; }
        .switch { position:relative; display:inline-block; width:36px; height:20px; flex-shrink:0; }
        .switch input { opacity:0; width:0; height:0; }
        .slider { position:absolute; inset:0; background:var(--divider-color);
          border-radius:20px; cursor:pointer; transition:.3s; }
        .slider:before { content:''; position:absolute; width:14px; height:14px;
          left:3px; bottom:3px; background:white; border-radius:50%; transition:.3s; }
        input:checked + .slider { background:var(--primary-color); }
        input:checked + .slider:before { transform:translateX(16px); }
        .section-header { background:var(--primary-color); color:white; padding:6px 10px;
          margin:16px -10px 10px; font-size:11px; font-weight:700; letter-spacing:1.5px; }
      </style>

      <h3>Thermomètre Gauche</h3>
      ${this._entitySelect('Température gauche (requis)', 'entity_left')}
      ${this._input('Nom / pièce gauche', 'name_left', 'text', 'SALON')}
      ${this._entitySelect('Humidité gauche', 'humidity_entity_left')}
      ${this._entitySelect('Capteur secondaire gauche', 'secondary_entity_left')}
      <div class="row2">
        ${this._input('Label capteur sec. gauche', 'secondary_label_left', 'text', 'LUMINOSITY')}
        ${this._input('Unité capteur sec. gauche', 'secondary_unit_left', 'text', 'lx')}
      </div>

      <h3>Thermomètre Droit</h3>
      ${this._entitySelect('Température droite (requis)', 'entity_right')}
      ${this._input('Nom / pièce droite', 'name_right', 'text', 'CHAMBRE')}
      ${this._entitySelect('Humidité droite', 'humidity_entity_right')}
      ${this._entitySelect('Capteur secondaire droit', 'secondary_entity_right')}
      <div class="row2">
        ${this._input('Label capteur sec. droit', 'secondary_label_right', 'text', 'CO2')}
        ${this._input('Unité capteur sec. droit', 'secondary_unit_right', 'text', 'ppm')}
      </div>

      <h3>Échelle (partagée)</h3>
      <div class="row3">
        ${this._number('Temp min (°C)', 'temp_min', -50, 50, 5)}
        ${this._number('Temp max (°C)', 'temp_max', 0, 100, 5)}
        ${this._number('Décimales', 'decimal_places', 0, 2, 1)}
      </div>
      ${this._input('Unité', 'unit', 'text', '°C')}

      <h3>Affichage</h3>
      <div class="row2">
        ${this._toggle('Réacteur plasma', 'show_plasma')}
        ${this._toggle('Historique 24h', 'show_history')}
      </div>
      ${this._number('Vitesse animations', 'animation_speed', 0.2, 5, 0.1)}

      <h3>Couleurs <span style="font-size:10px;font-weight:400">(vide = thème HA)</span></h3>
      <div class="row2">
        ${this._color('Couleur gauche', 'color_primary', '#00E8FF')}
        ${this._color('Couleur droite', 'color_secondary', '#E946FF')}
      </div>
      <h3>Gradient Mercure <span style="font-size:10px;font-weight:400">(avec effet irradiation)</span></h3>
      <div class="row3">
        ${this._color('Zone 1 (<5°C)', 'color_zone1', '#0099FF', '#hex')}
        ${this._color('Zone 2 (5-15°C)', 'color_zone2', '#00E8FF', '#hex')}
        ${this._color('Zone 3 (15-22°C)', 'color_zone3', '#00FFB3', '#hex')}
      </div>
      <div class="row2">
        ${this._color('Zone 4 (22-28°C)', 'color_zone4', '#FF9D00', '#hex')}
        ${this._color('Zone 5 (>28°C)', 'color_zone5', '#FF2D78', '#hex')}
      </div>
      ${this._color('Fond intérieur', 'color_background', '#04060b', '#hex')}
      <h3>Anneaux Plasma <span style="font-size:10px;font-weight:400">(vide = Zone 3 et 5)</span></h3>
      <div class="row2">
        ${this._color('Anneau 1 (horizontal)', 'color_plasma_ring1', '#00FFB3', '#hex')}
        ${this._color('Anneau 2 (vertical)', 'color_plasma_ring2', '#FF2D78', '#hex')}
      </div>
    `;

    // Color pickers sync
    this.querySelectorAll('input[type=color]').forEach(picker => {
      const key  = picker.dataset.key;
      const text = this.querySelector(`.color-text[data-key="${key}"]`);
      if (!text) return;
      picker.addEventListener('input', e => {
        e.stopPropagation();
        text.value = picker.value;
        this._changed(key, picker.value);
      }, { passive: true });
      text.addEventListener('blur', e => {
        e.stopPropagation();
        if (/^#[0-9a-fA-F]{6}$/.test(text.value)) picker.value = text.value;
        this._changed(key, text.value || null);
      });
      text.addEventListener('keydown', e => e.stopPropagation(), { passive: true });
      text.addEventListener('input',   e => e.stopPropagation(), { passive: true });
    });

    // Resets
    this.querySelectorAll('[data-reset]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.reset;
        const picker = this.querySelector(`input[type=color][data-key="${key}"]`);
        const text   = this.querySelector(`.color-text[data-key="${key}"]`);
        if (picker) picker.style.opacity = '0.4';
        if (text)   text.value = '';
        this._changed(key, null);
      });
    });

    // Entity inputs
    this.querySelectorAll('[data-entity]').forEach(el => {
      el.addEventListener('keydown', e => e.stopPropagation(), { passive: true });
      el.addEventListener('keyup',   e => e.stopPropagation(), { passive: true });
      el.addEventListener('input',   e => e.stopPropagation(), { passive: true });
      el.addEventListener('change',  e => {
        e.stopPropagation();
        this._changed(el.dataset.key, el.value || null);
      });
      el.addEventListener('blur', e => {
        e.stopPropagation();
        this._changed(el.dataset.key, el.value || null);
      });
    });

    // Other fields
    this.querySelectorAll('[data-key]:not([type=color]):not([data-entity])').forEach(el => {
      if (el.type === 'checkbox' || el.tagName === 'SELECT') {
        el.addEventListener('change', e => {
          e.stopPropagation();
          this._changed(el.dataset.key, el.type === 'checkbox' ? el.checked : (el.value || null));
        });
        return;
      }
      if (el.type === 'number') {
        el.addEventListener('change', e => {
          e.stopPropagation();
          this._changed(el.dataset.key, el.value === '' ? null : parseFloat(el.value));
        });
        return;
      }
      el.addEventListener('keydown', e => e.stopPropagation(), { passive: true });
      el.addEventListener('keyup',   e => e.stopPropagation(), { passive: true });
      el.addEventListener('input',   e => e.stopPropagation(), { passive: true });
      el.addEventListener('blur', e => {
        e.stopPropagation();
        this._changed(el.dataset.key, el.value === '' ? null : el.value);
      });
    });
  }

  _changed(key, val) {
    const config = { ...this._config };
    if (val === null || val === '' || val === undefined) delete config[key];
    else config[key] = val;
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
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
    
    // Right thermometer state
    this._historyRight = [];
    this._lastTempRight = null;
    this._prevTempRight = null;
    this._lastHumidityRight = null;
    this._lastSecondaryRight = null;
    
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
  }

  static getConfigElement() { return document.createElement('neon-dual-thermo-card-editor'); }
  static getStubConfig() {
    return {
      entity_left: 'sensor.temperature_salon',
      entity_right: 'sensor.temperature_chambre',
      show_history: true,
    };
  }

  setConfig(raw) {
    this._config = buildConfig(raw);
    this._geo = computeGeometry(this._config);
    this._rendered = false;
    this._colors = null;
    this._cachedEls = null;
    if (this.shadowRoot.firstChild) this._render();
  }

  getCardSize() { return this._config?.show_history ? 4 : 3; }

  _openMoreInfo(entityId = null) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _resolveColors() {
    if (this._colors) return this._colors;
    const c = this._config;
    this._colors = {
      primary:   c.color_primary   || cssVar('--primary-color', '#00E8FF'),
      secondary: c.color_secondary || cssVar('--accent-color', '#E946FF'),
      zone1:     c.color_zone1     || '#0099FF',  // <5°C - ice blue
      zone2:     c.color_zone2     || '#00E8FF',  // 5-15°C - cold cyan
      zone3:     c.color_zone3     || '#00FFB3',  // 15-22°C - comfortable green
      zone4:     c.color_zone4     || '#FF9D00',  // 22-28°C - warm orange
      zone5:     c.color_zone5     || '#FF2D78',  // >28°C - hot pink/red
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
      if (stateLeft) {
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
      if (stateRight) {
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

    // History fetch - throttled to reduce load
    const now = Date.now();
    if ((now - this._lastHistoryFetch) > 10 * 60 * 1000) {
      this._lastHistoryFetch = now;
      this._fetchHistory();
    }

    if (!this._rendered) {
      this._rendered = true;
      this._renderShell();
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
    
    if (c.entity_left) {
      promises.push(this._fetchHistoryForEntity(c.entity_left, 'left'));
    }
    if (c.entity_right) {
      promises.push(this._fetchHistoryForEntity(c.entity_right, 'right'));
    }
    
    await Promise.all(promises);
    
    if (this._rendered) {
      this._updateSparkline();
    }
  }

  async _fetchHistoryForEntity(entityId, side) {
    try {
      const start = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const data = await this._hass.callApi(
        'GET',
        `history/period/${start}?filter_entity_id=${entityId}&minimal_response=true&no_attributes=true`
      );
      if (!data || !data[0] || data[0].length < 2) return;

      const raw = data[0].filter(s => !isNaN(parseFloat(s.state)));
      const step = Math.max(1, Math.floor(raw.length / 25));
      const history = raw.filter((_, i) => i % step === 0).slice(-25).map(s => parseFloat(s.state));
      
      if (side === 'left') {
        this._historyLeft = history;
      } else {
        this._historyRight = history;
      }
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
    
    // Store zone colors in config for thermometer builders
    c._gradColors = { zone1: colors.zone1, zone2: colors.zone2, zone3: colors.zone3, zone4: colors.zone4, zone5: colors.zone5 };
    
    const hasSecLeft = !!(c.humidity_entity_left || c.secondary_entity_left);
    const hasSecRight = !!(c.humidity_entity_right || c.secondary_entity_right);
    
    // Animation duration
    const s = c.animation_speed ?? 1;
    const irrDuration = (4 / s).toFixed(1);
    
    // Auto-detect names
    let nameLeft = c.name_left;
    let nameRight = c.name_right;
    
    if (!nameLeft && this._hass && c.entity_left) {
      const state = this._hass.states[c.entity_left];
      if (state?.attributes?.friendly_name) nameLeft = state.attributes.friendly_name;
    }
    if (!nameRight && this._hass && c.entity_right) {
      const state = this._hass.states[c.entity_right];
      if (state?.attributes?.friendly_name) nameRight = state.attributes.friendly_name;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { position: relative; overflow: hidden; }

        .card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto 1fr ${c.show_history ? 'auto' : ''};
          padding: 2px 12px 2px;
          gap: 0 16px;
          box-sizing: border-box;
        }

        /* Divider */
        .divider {
          position: absolute;
          left: 50%;
          top: 10px;
          bottom: 10px;
          width: 1px;
          background: linear-gradient(to bottom,
            transparent,
            ${colors.primary}20 20%,
            ${colors.primary}40 50%,
            ${colors.primary}20 80%,
            transparent);
        }

        /* Zone: top value */
        .zone-top {
          text-align: center;
          padding-bottom: 6px;
          margin-bottom: 4px;
        }
        .zone-top-left { grid-column: 1; grid-row: 1; }
        .zone-top-right { grid-column: 2; grid-row: 1; }
        
        .top-name {
          font-size: 12px;
          font-family: Rajdhani, monospace;
          opacity: 0.6;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 2px;
          font-weight: 600;
        }
        .top-name-left { color: ${colors.primary}; }
        .top-name-right { color: ${colors.secondary}; }
        
        .top-value {
          font-size: 28px;
          font-weight: 900;
          font-family: Rajdhani, monospace;
          line-height: 1;
          cursor: pointer;
        }
        .top-value-left {
          color: ${colors.primary};
          text-shadow: 0 0 8px ${colors.primary}40, 0 0 3px ${colors.primary}80;
        }
        .top-value-right {
          color: ${colors.secondary};
          text-shadow: 0 0 8px ${colors.secondary}40, 0 0 3px ${colors.secondary}80;
        }
        .top-unit {
          font-size: 14px;
          vertical-align: super;
          margin-left: 2px;
          opacity: 0.85;
        }

        /* Zone: thermo */
        .zone-thermo {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          min-height: 0;
          max-height: 180px;
          cursor: pointer;
        }
        .zone-thermo-left { grid-column: 1; grid-row: 2 / 4; }
        .zone-thermo-right { grid-column: 2; grid-row: 2 / 4; }
        .zone-thermo svg {
          max-height: 100%;
          width: auto;
        }
        
        .zone-thermo svg .outline {
          filter: drop-shadow(0 0 3px currentColor);
          opacity: 0.5;
          will-change: auto;
        }
        .zone-thermo svg .ticks {
          opacity: 0.4;
        }
        
        /* Irradiation effect - pulsing glow on mercury */
        .mercury-irradiate {
          animation: irradiate-pulse ${irrDuration}s ease-in-out infinite;
          will-change: opacity;
        }
        
        @keyframes irradiate-pulse {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 0.95;
          }
        }

        /* Zone: sensors */
        .zone-sensors {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-self: start;
          padding: 0;
          gap: 16px;
        }
        .zone-sensors-left { grid-column: 1; grid-row: 4; }
        .zone-sensors-right { grid-column: 2; grid-row: 4; }

        /* Zone: sparkline */
        .zone-spark {
          grid-column: 1 / -1;
          padding-top: 8px;
        }

        /* Sensor blocks */
        .sensor-block { display: flex; flex-direction: column; gap: 2px; }
        .sensor-label {
          font-size: 10px;
          font-family: Rajdhani, monospace;
          letter-spacing: 1px;
          opacity: 0.5;
          text-transform: uppercase;
        }
        .sensor-label-left { color: ${colors.primary}; }
        .sensor-label-right { color: ${colors.secondary}; }
        
        .sensor-value {
          font-size: 24px;
          font-weight: 700;
          font-family: Rajdhani, monospace;
          line-height: 1.1;
        }
        .sensor-value-left {
          color: ${colors.primary};
          text-shadow: 0 0 6px ${colors.primary}60;
        }
        .sensor-value-right {
          color: ${colors.secondary};
          text-shadow: 0 0 6px ${colors.secondary}60;
        }
        .sensor-unit { font-size: 12px; margin-left: 2px; }
      </style>

      <ha-card>
        <div class="divider"></div>
        <div class="card-grid">
          <!-- LEFT THERMOMETER -->
          <div class="zone-top zone-top-left">
            ${nameLeft ? `<div class="top-name top-name-left">${nameLeft.toUpperCase()}</div>` : ''}
            <div class="top-value top-value-left" data-click="${c.entity_left}">
              <span id="temp-val-left">--</span><span class="top-unit">${c.unit}</span>
            </div>
          </div>

          <div class="zone-thermo zone-thermo-left" id="zone-thermo-left" data-click="${c.entity_left}"></div>

          ${hasSecLeft ? '<div class="zone-sensors zone-sensors-left" id="zone-sensors-left"></div>' : ''}

          <!-- RIGHT THERMOMETER -->
          <div class="zone-top zone-top-right">
            ${nameRight ? `<div class="top-name top-name-right">${nameRight.toUpperCase()}</div>` : ''}
            <div class="top-value top-value-right" data-click="${c.entity_right}">
              <span id="temp-val-right">--</span><span class="top-unit">${c.unit}</span>
            </div>
          </div>

          <div class="zone-thermo zone-thermo-right" id="zone-thermo-right" data-click="${c.entity_right}"></div>

          ${hasSecRight ? '<div class="zone-sensors zone-sensors-right" id="zone-sensors-right"></div>' : ''}

          ${c.show_history ? '<div class="zone-spark" id="zone-spark"></div>' : ''}
        </div>
      </ha-card>`;

    // Build thermometer skeletons
    const zThermoLeft = this.shadowRoot.querySelector('#zone-thermo-left');
    if (zThermoLeft && c.entity_left) {
      zThermoLeft.innerHTML = buildThermoSkeleton(c, colors.primary, this._svgIdLeft, this._geo);
    }
    
    const zThermoRight = this.shadowRoot.querySelector('#zone-thermo-right');
    if (zThermoRight && c.entity_right) {
      zThermoRight.innerHTML = buildThermoSkeleton(c, colors.secondary, this._svgIdRight, this._geo);
    }
    
    // Add click handlers
    this.shadowRoot.querySelectorAll('[data-click]').forEach(el => {
      const entity = el.getAttribute('data-click');
      if (entity) {
        el.addEventListener('click', () => this._openMoreInfo(entity));
      }
    });
    
    this._cacheElements();
  }

  _cacheElements() {
    const sr = this.shadowRoot;
    this._cachedEls = {
      // Left
      tempValLeft: sr.querySelector('#temp-val-left'),
      mercuryLeft: sr.querySelector(`#zone-thermo-left [data-el="mercury"]`),
      shineLeft: sr.querySelector(`#zone-thermo-left [data-el="shine"]`),
      tickLinesLeft: Array.from(sr.querySelectorAll('#zone-thermo-left [data-t]')),
      sensorsLeft: sr.querySelector('#zone-sensors-left'),
      
      // Right
      tempValRight: sr.querySelector('#temp-val-right'),
      mercuryRight: sr.querySelector(`#zone-thermo-right [data-el="mercury"]`),
      shineRight: sr.querySelector(`#zone-thermo-right [data-el="shine"]`),
      tickLinesRight: Array.from(sr.querySelectorAll('#zone-thermo-right [data-t]')),
      sensorsRight: sr.querySelector('#zone-sensors-right'),
      
      // Shared
      spark: sr.querySelector('#zone-spark'),
    };
  }

  _updateDOM(u) {
    if (!this._cachedEls) return;
    
    const c = this._config;
    const colors = this._resolveColors();

    // Update left thermometer
    if (u.tempLeft !== null && c.entity_left) {
      if (this._cachedEls.tempValLeft) {
        this._cachedEls.tempValLeft.textContent = u.tempLeft.toFixed(c.decimal_places);
      }
      this._patchThermoFast('left', u.tempLeft, c, colors);
      this._updateSensors('left', u.humidityLeft, u.secondaryLeft, colors);
    }

    // Update right thermometer
    if (u.tempRight !== null && c.entity_right) {
      if (this._cachedEls.tempValRight) {
        this._cachedEls.tempValRight.textContent = u.tempRight.toFixed(c.decimal_places);
      }
      this._patchThermoFast('right', u.tempRight, c, colors);
      this._updateSensors('right', u.humidityRight, u.secondaryRight, colors);
    }

    this._updateSparkline();
  }

  _patchThermoFast(side, temp, c, colors) {
    const color = side === 'left' ? colors.primary : colors.secondary;
    const { gradBottom, gradH, cy, BR_I, range } = this._geo;
    const ratio = clamp((temp - c.temp_min) / range, 0, 1);
    const mercTop = gradBottom - ratio * gradH;
    const h = cy + BR_I - mercTop;

    const mercury = side === 'left' ? this._cachedEls.mercuryLeft : this._cachedEls.mercuryRight;
    const shine = side === 'left' ? this._cachedEls.shineLeft : this._cachedEls.shineRight;

    // Determine color based on temperature
    const { zone1, zone2, zone3, zone4, zone5 } = colors;
    let mercColor;
    if (temp < 5) mercColor = zone1;
    else if (temp < 15) mercColor = zone2;
    else if (temp < 22) mercColor = zone3;
    else if (temp < 28) mercColor = zone4;
    else mercColor = zone5;

    // Update mercury column
    if (mercury) {
      mercury.setAttribute('y', mercTop);
      mercury.setAttribute('height', h);
      mercury.setAttribute('fill', mercColor);
      // Set irradiation filter color dynamically - single optimized glow
      mercury.style.filter = `drop-shadow(0 0 6px ${mercColor})`;
    }

    if (shine) {
      shine.setAttribute('y', mercTop);
      shine.setAttribute('height', h);
    }

    // Tick colors - heavily throttled for performance
    const counterKey = `_tickCounter${side.charAt(0).toUpperCase() + side.slice(1)}`;
    if (!this[counterKey]) this[counterKey] = 0;
    if (++this[counterKey] % 30 === 0) {
      const tickLines = side === 'left' ? this._cachedEls.tickLinesLeft : this._cachedEls.tickLinesRight;
      const { zone1, zone2, zone3, zone4, zone5 } = colors;
      if (tickLines) {
        for (let i = 0; i < tickLines.length; i++) {
          const el = tickLines[i];
          const t = parseFloat(el.getAttribute('data-t'));
          const isActive = t <= temp;
          
          // Color ticks based on temperature gradient
          let tickColor = color;
          if (isActive) {
            if (t < 5) tickColor = zone1;
            else if (t < 15) tickColor = zone2;
            else if (t < 22) tickColor = zone3;
            else if (t < 28) tickColor = zone4;
            else tickColor = zone5;
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
    
    const prevTemp = side === 'left' ? this._prevTempLeft : this._prevTempRight;
    const lastTemp = side === 'left' ? this._lastTempLeft : this._lastTempRight;

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
    zSpark.innerHTML = buildDualSparkSVG(hL, hR, this._resolveColors(), this._svgIdLeft, c.animation_speed);
  }
}

customElements.define('neon-dual-thermo-card', NeonDualThermoCard);

// Banner
console.info(
  '%c NEON-DUAL-THERMO-CARD %c v' + VERSION + ' ',
  'color:#00E8FF;font-weight:bold;background:#040810;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#E946FF;font-weight:bold;background:#040810;padding:2px 6px;border-radius:0 3px 3px 0',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-dual-thermo-card',
  name: 'Neon Dual Thermometer Card',
  description: 'Double thermomètre néon cyberpunk avec comparaison côte à côte',
  preview: true,
});
