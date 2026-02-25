/**
 * neon-thermo-card v1.4.0
 * Card thermomètre néon pour Home Assistant
 *
 * Installation :
 *   1. Copier dans /config/www/neon-thermo-card.js
 *   2. Ressources HA → /local/neon-thermo-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:neon-thermo-card
 *   entity: sensor.temperature_salon
 */

const VERSION = '1.4.0';

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
function buildConfig(raw) {
  return {
    entity:           raw.entity           || null,
    humidity_entity:  raw.humidity_entity  || null,
    secondary_entity: raw.secondary_entity || null,
    secondary_label:  raw.secondary_label  || null,
    secondary_unit:   raw.secondary_unit   || null,
    temp_min:   raw.temp_min  ?? -10,
    temp_max:   raw.temp_max  ?? 40,
    unit:       raw.unit      ?? '°C',
    name:           raw.name           || null,
    show_history:   raw.show_history   ?? true,
    show_plasma:    raw.show_plasma    ?? true,
    decimal_places: raw.decimal_places ?? 1,
    color_primary:  raw.color_primary  || null,
    color_hot:      raw.color_hot      || null,
    color_mid:      raw.color_mid      || null,
    color_cold:     raw.color_cold     || null,
    animation_speed: raw.animation_speed ?? 1,
  };
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
let _cssVarCache = {};
let _cssVarCacheTs = 0;
function cssVar(name, fallback) {
  // Cache for 30s — getComputedStyle is expensive
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
function uid() { return 'ntc' + (++_uid); }

// ═══════════════════════════════════════════════════════
//  THERMO GEOMETRY — computed once per config, reused
// ═══════════════════════════════════════════════════════
function computeGeometry(c) {
  const PAD = 8, tubeH = 90, bulbSpace = 28;
  const TW_E = 16, BR_E = 26, TW_I = 10, BR_I = 16;
  const cx = 55, vbW = 155;

  const tubeTop    = PAD;
  const cy         = tubeTop + tubeH + bulbSpace;
  const tang_E     = Math.round(cy - Math.sqrt(BR_E * BR_E - TW_E * TW_E));
  const tang_I     = Math.round(cy - Math.sqrt(BR_I * BR_I - TW_I * TW_I));
  const gradTop    = tubeTop;           // Graduation starts at tube top
  const gradBottom = cy + BR_I - 2;      // Graduation ends at bulb bottom
  const gradH      = gradBottom - gradTop;
  const svgH       = cy + BR_E + PAD;
  const pr1 = Math.round(BR_I * 0.85);
  const pr2 = Math.round(BR_I * 0.38);

  // Pre-compute ticks (every 2°, labels every 10°)
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
//  SVG NAMESPACE HELPERS (for DOM-based creation)
// ═══════════════════════════════════════════════════════
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// ═══════════════════════════════════════════════════════
//  THERMO SVG — built once, mercury/ticks patched
// ═══════════════════════════════════════════════════════
function buildThermoSkeleton(c, colors, id, geo) {
  const { primary: pri, hot, mid, cold } = colors;
  const {
    TW_E, BR_E, TW_I, BR_I, cx, vbW,
    tubeTop, cy, tang_E, tang_I,
    gradTop, gradBottom, gradH,
    svgH, pr1, pr2, ticks,
  } = geo;
  const s  = c.animation_speed ?? 1;
  const d1 = (2.5 / s).toFixed(1), d2 = (3.5 / s).toFixed(1);
  const d3 = (6 / s).toFixed(1),   dp = (2.8 / s).toFixed(1), dl = (1.6 / s).toFixed(1);

  // Build SVG as string once (skeleton), then we'll patch mercury via DOM
  return `<svg viewBox="0 0 ${vbW} ${svgH}" width="100%" preserveAspectRatio="xMidYMid meet"
  style="display:block;overflow:visible" shape-rendering="geometricPrecision">
  <defs>
    <!-- Filters removed for performance - using CSS filters instead -->
    <linearGradient id="${id}-merc" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="${hot}"/>
      <stop offset="45%"  stop-color="${mid}"/>
      <stop offset="100%" stop-color="${cold}"/>
    </linearGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"  stop-color="#fff" stop-opacity="0.14"/>
      <stop offset="1"  stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-clip">
      <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
        L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"/>
    </clipPath>
  </defs>

  <!-- Fond intérieur -->
  <path d="M${cx - TW_I},${tubeTop} A${TW_I},${TW_I} 0 0,1 ${cx + TW_I},${tubeTop}
    L${cx + TW_I},${tang_I} A${BR_I},${BR_I} 0 1,1 ${cx - TW_I},${tang_I} Z"
    fill="#1A1525" opacity="0.7"/>

  <!-- Mercure (patched via DOM) -->
  <g clip-path="url(#${id}-clip)">
    <rect data-el="merc" x="${cx - BR_I - 4}" width="${(BR_I + 4) * 2}"
      y="${gradBottom}" height="${cy + BR_I - gradBottom}"
      fill="url(#${id}-merc)" opacity="0.95"/>
    <rect data-el="shine" x="${cx - TW_I + 1}" width="5"
      y="${gradBottom}" height="${cy + BR_I - gradBottom}"
      fill="url(#${id}-shine)"/>
    <rect data-el="meniscus" x="${cx - TW_I + 1}" width="${TW_I * 2 - 2}" height="3"
      y="${gradBottom}" rx="1.5" fill="${cold}" opacity="0.7"/>
  </g>

  ${c.show_plasma ? `
  <!-- Plasma -->
  <g transform="translate(${cx},${cy})">
    <circle r="${BR_I + 5}" stroke="${pri}" stroke-width="0.5" stroke-dasharray="1 3"
      fill="none" opacity="0.2" shape-rendering="auto"/>
    <g>
      <ellipse rx="${pr1}" ry="${pr2}" fill="none" stroke="${mid}" stroke-width="1.8" opacity="0.75">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360"
          dur="${d1}s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse rx="${pr2}" ry="${pr1}" fill="none" stroke="${hot}" stroke-width="1.8" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" from="360" to="0"
          dur="${d2}s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse rx="${BR_I - 2}" ry="${BR_I - 2}" fill="none" stroke="${pri}"
        stroke-width="1" stroke-dasharray="6 4" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360"
          dur="${d3}s" repeatCount="indefinite"/>
      </ellipse>
    </g>
  </g>` : ''}

  <!-- Contour φ -->
  <g class="outline">
    <path d="M${cx - TW_E},${tubeTop} A${TW_E},${TW_E} 0 0,1 ${cx + TW_E},${tubeTop}
      L${cx + TW_E},${tang_E} A${BR_E},${BR_E} 0 1,1 ${cx - TW_E},${tang_E} Z"
      fill="none" stroke="${pri}" stroke-width="1.8" opacity="0.75"/>
  </g>

  <!-- Ticks (patched per update) -->
  <g data-el="ticks" class="ticks" font-family="Rajdhani,monospace" fill="${pri}">
    ${ticks.map(({ t, y, long }) => {
      const x1 = cx + BR_E + 4;  // Align with bulb edge
      const x2 = long ? x1 + 12 : x1 + 7;
      return `<line data-t="${t}" x1="${x1}" y1="${y.toFixed(1)}" x2="${x2}" y2="${y.toFixed(1)}"
        stroke="${pri}" stroke-width="${long ? 1.8 : 1}" opacity="${long ? 0.9 : 0.35}"/>
      ${long ? `<text data-t="${t}" x="${x2 + 3}" y="${(y + 3).toFixed(1)}" font-size="8"
        fill="${pri}" opacity="0.85" font-weight="400">${t}°</text>` : ''}`;
    }).join('')}
  </g>
</svg>`;
}

/** Patch mercury height + tick colors on an existing thermo SVG — no innerHTML! */
function patchThermo(container, temp, c, colors, geo) {
  const { hot, mid, cold, primary: pri } = colors;
  const { gradBottom, gradH, cy, BR_I, range } = geo;
  const ratio = clamp((temp - c.temp_min) / range, 0, 1);
  const mercTop = gradBottom - ratio * gradH;

  // Mercury rect
  const merc = container.querySelector('[data-el="merc"]');
  if (merc) {
    merc.setAttribute('y', mercTop);
    merc.setAttribute('height', cy + BR_I - mercTop);
  }
  // Shine
  const shine = container.querySelector('[data-el="shine"]');
  if (shine) {
    shine.setAttribute('y', mercTop);
    shine.setAttribute('height', cy + BR_I - mercTop);
  }
  // Meniscus
  const meniscus = container.querySelector('[data-el="meniscus"]');
  if (meniscus) {
    meniscus.setAttribute('y', mercTop - 2);
    // Show only if ratio > 1%
    meniscus.style.display = ratio > 0.01 ? '' : 'none';
  }

  // Tick colors - update only every 5th call to reduce overhead
  if (!container._tickUpdateCounter) container._tickUpdateCounter = 0;
  if (++container._tickUpdateCounter % 5 === 0) {
    container.querySelectorAll('[data-t]').forEach(el => {
      const t = parseFloat(el.getAttribute('data-t'));
      const isActive = t <= temp;
      const color = isActive ? (t < 0 ? cold : (t < 20 ? mid : hot)) : pri;
      if (el.tagName === 'line') {
        el.setAttribute('stroke', color);
      } else {
        el.setAttribute('fill', color);
        el.setAttribute('font-weight', isActive ? '700' : '400');
      }
    });
  }
}

// ── Sparkline 24h ──────────────────────────────────────────
function buildSparkSVG(history, colors, id, speed = 1) {
  if (!history.length) return '';
  const { primary: pri, hot, cold } = colors;
  const W = 320, H = 55, PAD_Y = 14;

  // Stats
  let hMin = Infinity, hMax = -Infinity, sum = 0;
  for (let i = 0; i < history.length; i++) {
    const v = history[i];
    if (v < hMin) hMin = v;
    if (v > hMax) hMax = v;
    sum += v;
  }
  const hR  = Math.max(hMax - hMin, 0.1);
  const avg = (sum / history.length).toFixed(1);
  const n   = Math.max(history.length - 1, 1);

  const pts = history.map((v, i) => {
    const x = Math.round(i / n * W);
    const y = PAD_Y + Math.round(H - ((v - hMin) / hR) * (H - 8) - 4);
    return `${x},${y}`;
  }).join(' ');

  const dp = (2.8 / speed).toFixed(1);

  return `<svg viewBox="0 0 ${W} ${PAD_Y + H + 20}" width="100%"
  preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible" shape-rendering="geometricPrecision">
  <defs>
    <!-- No filters for performance -->
  </defs>
  <text x="0" y="9" fill="${pri}" font-size="8" font-family="Rajdhani,monospace"
    opacity="0.5" letter-spacing="1">CYCLIC_ANALYSIS_24H</text>
  <g font-family="Rajdhani,monospace" font-size="8">
    <text x="120" y="9" fill="${pri}" opacity="0.8">AVG:<tspan font-weight="700">${avg}</tspan></text>
    <text x="188" y="9" fill="${hot}" opacity="0.8">MAX:<tspan font-weight="700">${hMax.toFixed(1)}</tspan></text>
    <text x="255" y="9" fill="${cold}" opacity="0.8">MIN:<tspan font-weight="700">${hMin.toFixed(1)}</tspan></text>
  </g>
  <rect x="0" y="${PAD_Y}" width="${W}" height="${H}" fill="${pri}" opacity="0.03" rx="2"/>
  <line x1="0" y1="${PAD_Y + H / 2}" x2="${W}" y2="${PAD_Y + H / 2}" stroke="${pri}" stroke-width="0.3" opacity="0.1"/>
  <polyline points="${pts}" fill="none" stroke="${hot}" stroke-width="1.8" opacity="0.85"/>
  <line x1="0" y1="${PAD_Y + H}" x2="${W}" y2="${PAD_Y + H}" stroke="${pri}" stroke-width="0.8" opacity="0.2"/>
  <g font-family="Rajdhani,monospace" fill="${pri}" opacity="0.5" font-size="8" text-anchor="middle">
    <line x1="0" y1="${PAD_Y + H}" x2="0" y2="${PAD_Y + H + 6}" stroke="${pri}" stroke-width="1"/>
    <text x="0" y="${PAD_Y + H + 16}">T-24</text>
    <line x1="${W / 4}" y1="${PAD_Y + H}" x2="${W / 4}" y2="${PAD_Y + H + 4}" stroke="${pri}" stroke-width="0.5" opacity="0.4"/>
    <text x="${W / 4}" y="${PAD_Y + H + 16}">T-18</text>
    <line x1="${W / 2}" y1="${PAD_Y + H}" x2="${W / 2}" y2="${PAD_Y + H + 6}" stroke="${pri}" stroke-width="1"/>
    <text x="${W / 2}" y="${PAD_Y + H + 16}">T-12</text>
    <line x1="${W * 3 / 4}" y1="${PAD_Y + H}" x2="${W * 3 / 4}" y2="${PAD_Y + H + 4}" stroke="${pri}" stroke-width="0.5" opacity="0.4"/>
    <text x="${W * 3 / 4}" y="${PAD_Y + H + 16}">T-6</text>
    <line x1="${W}" y1="${PAD_Y + H}" x2="${W}" y2="${PAD_Y + H + 6}" stroke="${pri}" stroke-width="1" stroke-dasharray="2 1"/>
    <text x="${W}" y="${PAD_Y + H + 16}" font-weight="700">NOW</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonThermoCardEditor extends HTMLElement {
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

  _select(label, key, opts, hint = '') {
    const val = this._config[key] ?? '';
    const options = opts.map(([v, l]) =>
      `<option value="${v}" ${String(val) === String(v) ? 'selected' : ''}>${l}</option>`
    ).join('');
    return `<div class="field"><label>${label}</label><select data-key="${key}">${options}</select>
      ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
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
        .effects-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
      </style>

      <h3>Entités</h3>
      ${this._entitySelect('Température (requis)', 'entity')}
      ${this._entitySelect('Humidité', 'humidity_entity')}
      ${this._entitySelect('Capteur secondaire', 'secondary_entity')}
      <div class="row2">
        ${this._input('Label capteur sec.', 'secondary_label', 'text', '')}
        ${this._input('Unité capteur sec.', 'secondary_unit', 'text', '')}
      </div>

      <h3>Échelle</h3>
      <div class="row3">
        ${this._number('Temp min (°C)', 'temp_min', -50, 50, 5)}
        ${this._number('Temp max (°C)', 'temp_max', 0, 100, 5)}
        ${this._number('Décimales', 'decimal_places', 0, 2, 1)}
      </div>
      ${this._input('Unité', 'unit', 'text', '°C')}

      <h3>Affichage</h3>
      ${this._input('Title', 'name', 'text', '')}
      <div class="effects-grid">
        ${this._toggle('Réacteur plasma', 'show_plasma')}
        ${this._toggle('Historique 24h', 'show_history')}
      </div>
      ${this._number('Vitesse animations', 'animation_speed', 0.2, 5, 0.1)}

      <h3>Couleurs <span style="font-size:10px;font-weight:400">(vide = thème HA)</span></h3>
      ${this._color('Couleur principale (contour)', 'color_primary', '#00E8FF')}
      <div class="row3">
        ${this._color('Chaud (bas)', 'color_hot', '#FF2D78', '#hex')}
        ${this._color('Milieu', 'color_mid', '#E946FF', '#hex')}
        ${this._color('Froid (haut)', 'color_cold', '#00E8FF', '#hex')}
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

    // Entity inputs (datalist — type to filter)
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

    // Tous les autres champs
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
customElements.define('neon-thermo-card-editor', NeonThermoCardEditor);

// ═══════════════════════════════════════════════════════
//  CARD PRINCIPALE
// ═══════════════════════════════════════════════════════
class NeonThermoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._history          = [];
    this._lastTemp         = null;
    this._prevTemp         = null;  // for trend
    this._lastHumidity     = null;
    this._lastSecondary    = null;
    this._rendered         = false;
    this._svgId            = uid();
    this._lastHistoryFetch = 0;
    this._rafId            = 0;       // requestAnimationFrame guard
    this._pendingUpdate    = null;    // deferred state
    this._geo              = null;    // cached geometry
    this._colors           = null;    // cached resolved colors
    this._cachedEls        = null;    // cached DOM elements
  }

  static getConfigElement() { return document.createElement('neon-thermo-card-editor'); }
  static getStubConfig() {
    return { entity: 'sensor.temperature', name: 'Salon', show_history: true };
  }

  setConfig(raw) {
    this._config = buildConfig(raw);
    this._geo    = computeGeometry(this._config);
    // Force full rebuild
    this._rendered = false;
    this._colors   = null;
    this._cachedEls = null;
    if (this.shadowRoot.firstChild) this._render();
  }

  getCardSize() { return this._config?.show_history ? 4 : 2; }

  _openMoreInfo(entityId = null) {
    const eId = entityId || this._config?.entity;
    if (!eId) return;
    
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId: eId },
      bubbles: true,
      composed: true,
    }));
  }

  /** Resolve colors once, re-resolve only when config changes */
  _resolveColors() {
    if (this._colors) return this._colors;
    const c = this._config;
    this._colors = {
      primary: c.color_primary || cssVar('--primary-color', '#00E8FF'),
      hot:     c.color_hot     || '#FF2D78',
      mid:     c.color_mid     || '#E946FF',
      cold:    c.color_cold    || '#00E8FF',
    };
    return this._colors;
  }

  set hass(hass) {
    this._hass = hass;
    const c = this._config;
    if (!c || !c.entity) return;

    const state = hass.states[c.entity];
    if (!state) return;
    const temp = parseFloat(state.state);
    if (isNaN(temp)) return;

    const humidity = c.humidity_entity && hass.states[c.humidity_entity]
      ? parseFloat(hass.states[c.humidity_entity].state) : null;
    const secondary = c.secondary_entity && hass.states[c.secondary_entity]
      ? hass.states[c.secondary_entity].state : null;

    // ── Diff — skip if nothing meaningful changed ──────
    const tempChanged      = this._lastTemp === null || Math.abs(temp - this._lastTemp) > 0.1;
    const humidityChanged  = humidity  !== this._lastHumidity;
    const secondaryChanged = secondary !== this._lastSecondary;
    const needsRender      = !this._rendered;

    if (!needsRender && !tempChanged && !humidityChanged && !secondaryChanged) return;

    this._prevTemp      = this._lastTemp;  // track for trend
    this._lastTemp      = temp;
    this._lastHumidity  = humidity;
    this._lastSecondary = secondary;

    // History fetch — first render then every 5 min
    const now = Date.now();
    if ((now - this._lastHistoryFetch) > 5 * 60 * 1000) {
      this._lastHistoryFetch = now;
      this._fetchHistory(c.entity);
    }

    if (!this._rendered) {
      this._rendered = true;
      this._renderShell();
    }

    // ── Batch into single rAF ──────────────────────
    this._pendingUpdate = { temp, humidity, secondary };
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0;
        const u = this._pendingUpdate;
        if (u) {
          this._pendingUpdate = null;
          this._updateDOM(u.temp, u.humidity, u.secondary);
        }
      });
    }
  }

  async _fetchHistory(entityId) {
    try {
      const start = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const data  = await this._hass.callApi(
        'GET',
        `history/period/${start}?filter_entity_id=${entityId}&minimal_response=true&no_attributes=true`
      );
      if (!data || !data[0] || data[0].length < 2) return;

      const raw  = data[0].filter(s => !isNaN(parseFloat(s.state)));
      const step = Math.max(1, Math.floor(raw.length / 25));
      this._history = raw.filter((_, i) => i % step === 0).slice(-25).map(s => parseFloat(s.state));

      // Refresh sparkline
      if (this._rendered && this._lastTemp !== null) {
        this._updateSparkline();
      }
    } catch (e) {
      console.debug('[neon-thermo-card] history fetch failed:', e);
    }
  }

  _render() {
    if (this._hass && this._config && this._config.entity) {
      this._rendered = true;
      this._renderShell();
      const temp = this._lastTemp;
      if (temp !== null) this._updateDOM(temp, this._lastHumidity, this._lastSecondary);
    }
  }

  _renderShell() {
    const c = this._config;
    const colors = this._resolveColors();
    const hasSec = !!(c.humidity_entity || c.secondary_entity);
    
    // Auto-detect name from entity friendly_name if not configured
    let displayName = c.name;
    if (!displayName && this._hass && c.entity) {
      const state = this._hass.states[c.entity];
      if (state?.attributes?.friendly_name) {
        displayName = state.attributes.friendly_name;
      }
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { position: relative; overflow: hidden; }

        /* Grid */
        .card-grid {
          display: grid;
          grid-template-columns: ${hasSec ? '1fr 120px' : '1fr'};
          grid-template-rows: auto 1fr ${c.show_history ? 'auto' : ''};
          padding: 2px 12px 2px;
          gap: 0;
          box-sizing: border-box;
        }

        /* Zone: top value */
        .zone-top {
          grid-column: 1 / -1;
          text-align: center;
          padding-bottom: 0;
          margin-bottom: 4px;
        }
        .top-name {
          font-size: 14px;
          font-family: Rajdhani, monospace;
          color: ${colors.primary};
          opacity: 0.65;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .top-value {
          font-size: 32px;
          font-weight: 900;
          font-family: Rajdhani, monospace;
          color: ${colors.primary};
          line-height: 1;
          text-shadow: 0 0 10px ${colors.primary}40, 0 0 3px ${colors.primary}80;
        }
        .top-unit {
          font-size: 16px;
          vertical-align: super;
          margin-left: 2px;
          opacity: 0.85;
        }

        /* Zone: thermo */
        .zone-thermo {
          grid-column: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          min-height: 0;
          max-height: 180px;
        }
        .zone-thermo svg {
          max-height: 100%;
          width: auto;
        }
        
        /* CSS filters for glow - GPU accelerated */
        .zone-thermo svg .outline {
          filter: drop-shadow(0 0 2px ${colors.primary}50) drop-shadow(0 0 4px ${colors.primary}30);
        }
        .zone-thermo svg .ticks {
          filter: drop-shadow(0 0 1px ${colors.primary}40);
        }

        /* Zone: sensors */
        .zone-sensors {
          grid-column: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-self: center;
          padding: 0 0 0 12px;
          gap: 14px;
        }

        /* Zone: sparkline */
        .zone-spark {
          grid-column: 1 / -1;
          padding-top: 4px;
        }

        /* Sensor blocks */
        .sensor-block { display: flex; flex-direction: column; gap: 2px; }
        .sensor-label {
          font-size: 12px;
          font-family: Rajdhani, monospace;
          letter-spacing: 1.2px;
          opacity: 0.55;
          color: ${colors.primary};
          text-transform: uppercase;
        }
        .sensor-value {
          font-size: 28px; font-weight: 700;
          font-family: Rajdhani, monospace;
          color: ${colors.primary};
          line-height: 1.1;
          text-shadow: 0 0 6px ${colors.primary}60;
        }
        .sensor-unit { font-size: 12px; margin-left: 2px; }
        .trend-indicator {
          font-size: 12px;
          font-family: Rajdhani, monospace;
          letter-spacing: 1.2px;
          opacity: 0.6;
          color: ${colors.primary};
          margin-top: 3px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .trend-arrow {
          font-size: 12px;
          font-weight: 700;
        }
        .trend-up { color: ${colors.hot}; }
        .trend-down { color: ${colors.cold}; }
        .trend-stable { opacity: 0.4; }
      </style>

      <ha-card style="cursor: pointer;">
        <div class="card-grid">
          <div class="zone-top" id="zone-top">
            ${displayName ? `<div class="top-name">${displayName.toUpperCase()}</div>` : ''}
            <div class="top-value">
              <span id="temp-val">--</span><span class="top-unit">${c.unit}</span>
            </div>
          </div>

          <div class="zone-thermo" id="zone-thermo"></div>

          ${hasSec ? '<div class="zone-sensors" id="zone-sensors"></div>' : ''}
          ${c.show_history ? '<div class="zone-spark" id="zone-spark"></div>' : ''}
        </div>
      </ha-card>`;

    // Build thermo skeleton once
    const zThermo = this.shadowRoot.querySelector('#zone-thermo');
    if (zThermo) {
      zThermo.innerHTML = buildThermoSkeleton(c, colors, this._svgId, this._geo);
    }
    
    // Add click handler for more-info
    const card = this.shadowRoot.querySelector('ha-card');
    if (card) {
      card.addEventListener('click', () => this._openMoreInfo());
    }
    
    // Cache DOM elements for fast updates
    this._cacheElements();
  }

  _cacheElements() {
    const sr = this.shadowRoot;
    this._cachedEls = {
      tempVal: sr.querySelector('#temp-val'),
      merc: sr.querySelector('[data-el="merc"]'),
      shine: sr.querySelector('[data-el="shine"]'),
      meniscus: sr.querySelector('[data-el="meniscus"]'),
      sensors: sr.querySelector('#zone-sensors'),
      spark: sr.querySelector('#zone-spark'),
      // Cache tick elements for color updates
      tickLines: Array.from(sr.querySelectorAll('[data-t]')),
    };
  }

  /** Fast per-frame update — no innerHTML on hot path */
  _updateDOM(temp, humidity, secondary) {
    if (!this._cachedEls) return;
    
    const c  = this._config;
    const colors = this._resolveColors();

    // ── Top value (pure text update) ────────────────
    if (this._cachedEls.tempVal) {
      this._cachedEls.tempVal.textContent = temp.toFixed(c.decimal_places);
    }

    // ── Thermo (DOM patch — no rebuild) ─────────────
    this._patchThermoFast(temp, c, colors);

    // ── Sensors (structure once, values patched) ────
    const zSensors = this._cachedEls.sensors;
    if (zSensors) {
      const parts = [];
      if (humidity  !== null) parts.push({ 
        label: 'HUMIDITY',  
        value: humidity.toFixed(0), 
        unit: '%',
        entity: c.humidity_entity 
      });
      if (secondary !== null) parts.push({
        label: (c.secondary_label || 'SENSOR').toUpperCase(),
        value: secondary,
        unit:  c.secondary_unit || '',
        entity: c.secondary_entity
      });

      // Temperature trend - always show when sensors exist
      let trend = 'TEMP STABLE', trendClass = 'trend-stable', arrow = '→';
      if (this._prevTemp !== null && this._prevTemp !== temp) {
        const diff = temp - this._prevTemp;
        if (Math.abs(diff) > 0.1) {
          if (diff > 0) { arrow = '▲'; trendClass = 'trend-up'; trend = 'TEMP RISING'; }
          else          { arrow = '▼'; trendClass = 'trend-down'; trend = 'TEMP FALLING'; }
        }
      }

      // Rebuild structure only when sensor count changes
      const count = parts.length;
      if (zSensors._count !== count) {
        zSensors._count = count;
        zSensors.innerHTML = parts.map((p, i) => `
          <div class="sensor-block" data-idx="${i}" data-entity="${p.entity}" style="cursor: pointer;">
            <span class="sensor-label">${p.label}</span>
            <span class="sensor-value"><span class="val">${p.value}</span><span class="sensor-unit">${p.unit}</span></span>
          </div>`).join('') + `
          <div class="trend-indicator">
            <span class="trend-arrow ${trendClass}">${arrow}</span>
            <span>${trend}</span>
          </div>`;
        
        // Add click handlers to sensor blocks
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
        // Update trend text/arrow
        const trendEl = zSensors.querySelector('.trend-indicator');
        if (trendEl) {
          const arrowEl = trendEl.querySelector('.trend-arrow');
          const textEl = trendEl.querySelector('span:last-child');
          if (arrowEl) {
            arrowEl.textContent = arrow;
            arrowEl.className = `trend-arrow ${trendClass}`;
          }
          if (textEl) textEl.textContent = trend;
        }
      }
    }

    // ── Sparkline (only on history change) ──────────
    this._updateSparkline();
  }

  /** Optimized thermo patch using cached elements */
  _patchThermoFast(temp, c, colors) {
    const { hot, mid, cold, primary: pri } = colors;
    const { gradBottom, gradH, cy, BR_I, range } = this._geo;
    const ratio = clamp((temp - c.temp_min) / range, 0, 1);
    const mercTop = gradBottom - ratio * gradH;
    const h = cy + BR_I - mercTop;

    // Mercury (cached)
    if (this._cachedEls.merc) {
      this._cachedEls.merc.setAttribute('y', mercTop);
      this._cachedEls.merc.setAttribute('height', h);
    }
    // Shine (cached)
    if (this._cachedEls.shine) {
      this._cachedEls.shine.setAttribute('y', mercTop);
      this._cachedEls.shine.setAttribute('height', h);
    }
    // Meniscus (cached)
    if (this._cachedEls.meniscus) {
      this._cachedEls.meniscus.setAttribute('y', mercTop - 2);
      this._cachedEls.meniscus.style.display = ratio > 0.01 ? '' : 'none';
    }

    // Tick colors - throttled update (every 10 calls)
    if (!this._tickCounter) this._tickCounter = 0;
    if (++this._tickCounter % 10 === 0 && this._cachedEls.tickLines) {
      const len = this._cachedEls.tickLines.length;
      for (let i = 0; i < len; i++) {
        const el = this._cachedEls.tickLines[i];
        const t = parseFloat(el.getAttribute('data-t'));
        const isActive = t <= temp;
        const color = isActive ? (t < 0 ? cold : (t < 20 ? mid : hot)) : pri;
        if (el.tagName === 'line') {
          el.setAttribute('stroke', color);
        } else {
          el.setAttribute('fill', color);
          el.setAttribute('font-weight', isActive ? '700' : '400');
        }
      }
    }
  }

  _updateSparkline() {
    const c  = this._config;
    const zSpark = this._cachedEls?.spark;
    if (!zSpark || !c.show_history || this._history.length < 1) return;

    // Fingerprint: first + last 2 values + length
    const h = this._history;
    const key = `${h.length}:${h[0]}:${h[h.length - 2] || 0}:${h[h.length - 1]}`;
    if (zSpark._key === key) return;
    zSpark._key = key;
    zSpark.innerHTML = buildSparkSVG(h, this._resolveColors(), this._svgId, c.animation_speed);
  }
}

customElements.define('neon-thermo-card', NeonThermoCard);

// Banner
console.info(
  '%c NEON-THERMO-CARD %c v' + VERSION + ' ',
  'color:#00E8FF;font-weight:bold;background:#040810;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF2D78;font-weight:bold;background:#040810;padding:2px 6px;border-radius:0 3px 3px 0',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'neon-thermo-card',
  name:        'Neon Thermometer Card',
  description: 'Thermomètre néon cyberpunk pour Home Assistant',
  preview:     true,
});
