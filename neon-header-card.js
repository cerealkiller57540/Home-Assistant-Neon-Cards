/**
 * neon-header-card v1.4.2 (IS_LOW_POWER + ha-card contain paint)
 * Card de header customisable pour Home Assistant
 *
 * Installation :
 *   1. Copier dans /config/www/neon-header-card.js
 *   2. Ressources HA → /local/neon-header-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:neon-header-card
 *   title: Mon titre
 *
 * Subtitle Features:
 *   Templates (Jinja2-style):
 *     subtitle: >-
 *       Status: {{ 'Actif' if is_state('switch.pi_hole', 'on') else 'Inactif' }}
 *       <br> Bloqués: {{ states('sensor.pi_hole_ads_percentage_blocked') | round(1) }} %
 *
 *   MDI Icons (NEW):
 *     - Shorthand: [mdi:icon-name] → <ha-icon icon="mdi:icon-name"></ha-icon>
 *     - Direct HTML: <ha-icon icon="mdi:home"></ha-icon>
 *     Example: "Status: [mdi:check] Actif <br> Temperature: [mdi:thermometer] 22°C"
 *
 *   HTML Tags: <br>, <b>, <strong>, <i>, <em>, <u>, <small>, <mark>, <code>, <span>
 *
 *   Supported template functions:
 *     - states('entity_id'): Get entity state
 *     - is_state('entity_id', 'state'): Check entity state
 *
 *   Supported template filters:
 *     - round(n): Round to n decimals
 *     - float: Convert to float
 *     - int: Convert to integer
 *     - upper/lower/title: Text case
 *     - default('fallback'): Use fallback for None/unknown
 */

const VERSION = '1.4.1';

// ═══════════════════════════════════════════════════════
//  DEVICE DETECTION
// ═══════════════════════════════════════════════════════
// iPads (including modern ones that report as MacIntel) — disable heavy effects
const IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const HDR_IS_LOW_POWER = IS_IPAD || navigator.hardwareConcurrency <= 4;

// ═══════════════════════════════════════════════════════
//  PERFORMANCE HELPERS
// ═══════════════════════════════════════════════════════

function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
function parseTemplate(hass, text) {
  if (!hass || !text || typeof text !== 'string' || !text.includes('{{')) return text;

  return text.replace(/\{\{\s*(.+?)\s*\}\}/g, (match, formula) => {
    try {
      formula = formula.trim();

      // ─ CONDITIONAL: 'value' if condition else 'other_value' ─
      const condMatch = formula.match(/^['"](.+?)['"]?\s+if\s+(.+?)\s+else\s+['"](.+?)['"]$/);
      if (condMatch) {
        const [, trueVal, condition, falseVal] = condMatch;
        const condResult = evaluateCondition(condition, hass);
        return condResult ? trueVal : falseVal;
      }

      // ─ STATES() with optional filters ─
      const statesMatch = formula.match(/^\s*states\(['"](.+?)['"]\)\s*(.*)$/);
      if (statesMatch) {
        const [, entityId, filters] = statesMatch;
        const stateObj = hass.states[entityId];
        if (!stateObj) return '---';

        let val = stateObj.state;
        val = applyFilters(val, filters);
        return val;
      }

      // ─ IS_STATE() ─
      const isStateMatch = formula.match(/^\s*is_state\(['"](.+?)['"],\s*['"](.+?)['"]\)\s*(.*)$/);
      if (isStateMatch) {
        const [, entityId, expectedState, filters] = isStateMatch;
        const stateObj = hass.states[entityId];
        const result = (stateObj && stateObj.state === expectedState) ? '1' : '0';
        return applyFilters(result, filters);
      }

      return match;
    } catch (e) {
      console.warn('neon-header-card: Template parse error:', e, 'in:', match);
      return match;
    }
  });
}

function evaluateCondition(condition, hass) {
  condition = condition.trim();

  // is_state('entity', 'state')
  const isStateMatch = condition.match(/is_state\(['"](.+?)['"],\s*['"](.+?)['"]\)/);
  if (isStateMatch) {
    const [, entityId, expectedState] = isStateMatch;
    const stateObj = hass.states[entityId];
    return stateObj && stateObj.state === expectedState;
  }

  return false;
}

function applyFilters(val, filterStr) {
  if (!filterStr || !filterStr.trim()) return val;

  const filters = filterStr.match(/\|\s*(\w+)(?:\(([^)]*)\))?/g) || [];

  let result = val;
  filters.forEach(filterExpr => {
    const match = filterExpr.match(/\|\s*(\w+)(?:\(([^)]*)\))?/);
    if (!match) return;

    const [, filterName, filterArg] = match;

    switch (filterName) {
      case 'round':
        {
          const decimals = parseInt(filterArg) || 0;
          const num = parseFloat(result);
          result = isNaN(num) ? result : num.toFixed(decimals);
        }
        break;
      case 'float':
        result = parseFloat(result) || 0;
        break;
      case 'int':
        result = parseInt(result) || 0;
        break;
      case 'default':
        if (!result || result === 'None' || result === 'unknown') {
          const cleanArg = (filterArg || '').replace(/^['"]|['"]$/g, '');
          result = cleanArg;
        }
        break;
      case 'upper':
        result = String(result).toUpperCase();
        break;
      case 'lower':
        result = String(result).toLowerCase();
        break;
      case 'title':
        result = String(result).charAt(0).toUpperCase() + String(result).slice(1);
        break;
    }
  });

  return result;
}

function parseSubtitleIcons(text) {
  if (!text || !text.includes('[mdi:')) return text;
  return text.replace(/\[mdi:([a-zA-Z0-9_-]+)\]/g, '<ha-icon icon="mdi:$1"></ha-icon>');
}

function sanitizeSubtitleHTML(rawHtml) {
  if (rawHtml == null) return '';
  const html = String(rawHtml);

  let processedHtml = parseSubtitleIcons(html);

  if (!processedHtml.includes('<')) return processedHtml;

  const allowedTags = new Set(['BR', 'B', 'STRONG', 'I', 'EM', 'U', 'SMALL', 'MARK', 'CODE', 'SPAN', 'HA-ICON']);
  const tpl = document.createElement('template');
  tpl.innerHTML = processedHtml;

  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT);
  const toProcess = [];
  while (walker.nextNode()) {
    toProcess.push(walker.currentNode);
  }

  toProcess.forEach((el) => {
    if (!allowedTags.has(el.tagName)) {
      const txt = document.createTextNode(el.textContent || '');
      el.replaceWith(txt);
      return;
    }
    if (el.tagName === 'HA-ICON') {
      const iconValue = el.getAttribute('icon') || '';
      if (iconValue.match(/^mdi:[a-zA-Z0-9_-]+$/)) {
        [...el.attributes].forEach((attr) => {
          if (attr.name !== 'icon') el.removeAttribute(attr.name);
        });
      } else {
        const txt = document.createTextNode(el.textContent || '');
        el.replaceWith(txt);
      }
      return;
    }
    [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
  });

  return tpl.innerHTML;
}

function buildConfig(raw) {
  const modeValue = (modeRaw, key, fallback, fallbackDefault = null) => {
    if (modeRaw && modeRaw[key] !== undefined && modeRaw[key] !== null) return modeRaw[key];
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
    if (fallback && fallback[key] !== undefined && fallback[key] !== null) return fallback[key];
    return fallbackDefault;
  };

  const buildModeConfig = (modeRaw, defaultStyle = {}) => ({
    font_size:      modeValue(modeRaw, 'font_size', defaultStyle, null),
    font_size_sub:  modeValue(modeRaw, 'font_size_sub', defaultStyle, '13px'),
    font_weight:    modeValue(modeRaw, 'font_weight', defaultStyle, null),
    italic:         modeValue(modeRaw, 'italic', defaultStyle, false),
    uppercase:      modeValue(modeRaw, 'uppercase', defaultStyle, false),
    letter_spacing: modeValue(modeRaw, 'letter_spacing', defaultStyle, null),
    align_h:        modeValue(modeRaw, 'align_h', defaultStyle, 'left'),
    align_v:        modeValue(modeRaw, 'align_v', defaultStyle, 'center'),
    color:          modeValue(modeRaw, 'color', defaultStyle, null),
    icon_size:      modeValue(modeRaw, 'icon_size', defaultStyle, null),
    icon_color:     modeValue(modeRaw, 'icon_color', defaultStyle, null),
    padding:        modeValue(modeRaw, 'padding', defaultStyle, null),
    min_height:     modeValue(modeRaw, 'min_height', defaultStyle, null),
    bg_color:       modeValue(modeRaw, 'bg_color', defaultStyle, null),
    bg_opacity:     modeValue(modeRaw, 'bg_opacity', defaultStyle, null),
    bg_blur:        modeValue(modeRaw, 'bg_blur', defaultStyle, false),
    border_color:   modeValue(modeRaw, 'border_color', defaultStyle, null),
    border_width:   modeValue(modeRaw, 'border_width', defaultStyle, null),
    border_style:   modeValue(modeRaw, 'border_style', defaultStyle, 'solid'),
    border_radius:  modeValue(modeRaw, 'border_radius', defaultStyle, null),
    effect_glow:       modeValue(modeRaw, 'effect_glow', defaultStyle, false),
    effect_glow_color: modeValue(modeRaw, 'effect_glow_color', defaultStyle, null),
    effect_glow_size:  modeValue(modeRaw, 'effect_glow_size', defaultStyle, 12),
    effect_scanline:       modeValue(modeRaw, 'effect_scanline', defaultStyle, false),
    effect_scanline_color: modeValue(modeRaw, 'effect_scanline_color', defaultStyle, null),
    effect_gradient:   modeValue(modeRaw, 'effect_gradient', defaultStyle, false),
    effect_gradient_from: modeValue(modeRaw, 'effect_gradient_from', defaultStyle, null),
    effect_gradient_to:   modeValue(modeRaw, 'effect_gradient_to', defaultStyle, null),
    effect_flicker:    modeValue(modeRaw, 'effect_flicker', defaultStyle, false),
    effect_hover_glitch: modeValue(modeRaw, 'effect_hover_glitch', defaultStyle, false),
    text_shadow:       modeValue(modeRaw, 'text_shadow', defaultStyle, null),
  });

  return {
    // ── Global settings ───────────────────────────
    title:          raw.title          ?? '',
    subtitle:       raw.subtitle       ?? null,
    icon:           raw.icon           ?? null,
    icon_position:  raw.icon_position  ?? 'left',
    font_family:    raw.font_family    ?? null,
    heading_style:  raw.heading_style  ?? 'title',
    tap_action:     raw.tap_action     ?? 'none',
    navigation_path: raw.navigation_path ?? null,

    // ── Title mode config (independent) ────────────
    title_config: buildModeConfig(raw.title_config, {
      font_size:   'var(--ha-card-header-font-size, 24px)',
      font_weight: 'var(--ha-card-header-font-weight, 500)',
      padding:     'var(--ha-card-header-padding, 12px 16px)',
      min_height:  'auto',
      color:       'var(--ha-card-header-color, var(--primary-text-color))',
    }),

    // ── Subtitle mode config (independent) ────────
    subtitle_config: buildModeConfig(raw.subtitle_config, {
      font_size:   '14px',
      font_weight: '400',
      padding:     '1px 8px',
      min_height:  '26px',
      color:       'var(--secondary-text-color, #888)',
    }),
  };
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
const GOOGLE_FONTS = [
  'Rajdhani', 'Orbitron', 'Share Tech Mono', 'Exo 2', 'Roboto', 'Montserrat',
  'Oswald', 'Bebas Neue', 'Inter', 'Poppins', 'Space Grotesk', 'Syne',
  'DM Sans', 'Playfair Display', 'Cinzel',
];

const MODE_STYLE_KEYS = new Set([
  'font_size', 'font_size_sub', 'font_weight', 'italic', 'uppercase', 'letter_spacing',
  'align_h', 'align_v', 'color', 'icon_size', 'icon_color', 'padding', 'min_height',
  'bg_color', 'bg_opacity', 'bg_blur', 'border_color', 'border_width', 'border_style',
  'border_radius', 'effect_glow', 'effect_glow_color', 'effect_glow_size',
  'effect_scanline', 'effect_scanline_color', 'effect_gradient', 'effect_gradient_from', 'effect_gradient_to',
  'effect_flicker', 'effect_hover_glitch', 'text_shadow',
]);

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonHeaderCardEditor extends HTMLElement {
  constructor() {
    super();
    this._eventListeners = [];
    this._editorMode = 'title';
    this._editorModeExplicit = false;
    this._debouncedChanged = debounce(this._changed.bind(this), 150);
  }

  connectedCallback() {
    if (!this._built && this._hass && this._config) {
      this._built = true;
      this._build();
    }
  }

  disconnectedCallback() {
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._eventListeners = [];
  }

  setConfig(config) {
    this._config = config;
    if (!this._editorModeExplicit) {
      this._editorMode = (config?.heading_style === 'subtitle') ? 'subtitle' : 'title';
    }
    if (!this._built && this._hass) { this._built = true; this._build(); }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built && this._config) { this._built = true; this._build(); }
  }

  _getEditorMode() {
    return this._editorMode === 'subtitle' ? 'subtitle' : 'title';
  }

  _setEditorMode(mode) {
    this._editorMode = mode === 'subtitle' ? 'subtitle' : 'title';
    this._editorModeExplicit = true;
  }

  _rebuildEditor() {
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    this._build();
  }

  _activeModeKey(config = this._config) {
    return this._getEditorMode() === 'subtitle' ? 'subtitle_config' : 'title_config';
  }

  _isModeStyleKey(key) {
    return MODE_STYLE_KEYS.has(key);
  }

  _getConfigValue(key) {
    if (!this._config) return '';
    if (!this._isModeStyleKey(key)) return this._config[key] ?? '';

    const modeKey = this._activeModeKey();
    const modeConfig = this._config[modeKey] || {};
    if (modeConfig[key] !== undefined && modeConfig[key] !== null) return modeConfig[key];
    return this._config[key] ?? '';
  }

  _addEventListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    this._eventListeners.push({ element, event, handler });
  }

  _input(label, key, type = 'text', hint = '', placeholder = '') {
    const val = this._getConfigValue(key);
    if (type === 'text') {
      return `
        <div class="field">
          <label>${label}</label>
          <textarea data-key="${key}" rows="1" placeholder="${placeholder}"
            class="text-input">${val}</textarea>
          ${hint ? `<p class="hint">${hint}</p>` : ''}
        </div>`;
    }
    return `
      <div class="field">
        <label>${label}</label>
        <input type="${type}" data-key="${key}" value="${val}" placeholder="${placeholder}"/>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _select(label, key, opts, hint = '') {
    const val = this._getConfigValue(key);
    const options = opts.map(([v, l]) =>
      `<option value="${v}" ${String(val) === String(v) ? 'selected' : ''}>${l}</option>`
    ).join('');
    return `<div class="field"><label>${label}</label><select data-key="${key}">${options}</select>${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
  }

  _toggle(label, key, hint = '') {
    const val = !!this._getConfigValue(key);
    return `
      <div class="field toggle-field">
        <label>${label}</label>
        <label class="switch">
          <input type="checkbox" data-key="${key}" ${val ? 'checked' : ''}/>
          <span class="slider"></span>
        </label>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _color(label, key, defaultHex = '#00E8FF', placeholder = 'var(--primary-color) ou #hex') {
    const val = this._getConfigValue(key) || '';
    return `
      <div class="field">
        <label>${label}</label>
        <div class="color-row">
          <input type="color" data-key="${key}" value="${val || defaultHex}" ${!val ? 'style="opacity:0.4"' : ''}/>
          <input type="text"  data-key="${key}" value="${val}" placeholder="${placeholder}" class="color-text"/>
          <span class="color-reset" data-reset="${key}">↺</span>
        </div>
      </div>`;
  }

  _number(label, key, min = 0, max = 100, step = 1, hint = '') {
    const val = this._getConfigValue(key);
    return `
      <div class="field">
        <label>${label}</label>
        <input type="number" data-key="${key}" value="${val}" min="${min}" max="${max}" step="${step}"/>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _px(label, key, defaultVal = '', hint = '') {
    const raw  = this._getConfigValue(key);
    const parsed = parseFloat(raw);
    const num  = (!isNaN(parsed)) ? parsed : '';
    return `
      <div class="field">
        <label>${label}</label>
        <div class="px-row">
          <input type="number" data-key="${key}" data-px="true" value="${num}" min="0" step="1" placeholder="${defaultVal}"/>
          <span class="px-unit">px</span>
        </div>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _paddingInput() {
    const raw = this._getConfigValue('padding') ?? '';
    const parts = raw.replace(/px/g, '').trim().split(/\s+/);
    const v = parseFloat(parts[0]) || '';
    const h = parseFloat(parts[1] ?? parts[0]) || '';
    return `
      <div class="field">
        <label>Padding</label>
        <div class="px-row">
          <input type="number" data-padding="v" value="${v}" min="0" step="1" placeholder="12" style="flex:1"/>
          <span class="px-unit">px ↕</span>
          <input type="number" data-padding="h" value="${h}" min="0" step="1" placeholder="16" style="flex:1"/>
          <span class="px-unit">px ↔</span>
        </div>
      </div>`;
  }

  _build() {
    const fontOpts = [['', '— thème HA —'], ...GOOGLE_FONTS.map(f => [f, f])];

    this.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 4px 0;
          contain: layout style paint;
        }
        h3 {
          font-size: 12px; font-weight: 700; color: var(--primary-color);
          text-transform: uppercase; letter-spacing: 1.5px;
          margin: 20px 0 8px; padding-bottom: 5px;
          border-bottom: 1px solid var(--divider-color);
          display: flex; align-items: center; gap: 6px;
        }
        h3::before { content: ''; display: block; width: 3px; height: 13px;
          background: var(--primary-color); border-radius: 2px; }
        .field { margin-bottom: 10px; }
        .toggle-field { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
        .toggle-field label:first-child { flex: 1; }
        label { display: block; font-size: 12px; color: var(--secondary-text-color); margin-bottom: 3px; }
        input[type=text], input[type=number], select, textarea {
          width: 100%; padding: 6px 8px; border-radius: 6px;
          border: 1px solid var(--divider-color); background: var(--card-background-color);
          color: var(--primary-text-color); font-size: 13px; box-sizing: border-box;
          font-family: inherit;
        }
        textarea.text-input {
          resize: none; overflow: visible; min-height: 34px; line-height: 1.4;
        }
        input[type=color] {
          height: 34px; width: 40px; padding: 2px; border-radius: 6px;
          border: 1px solid var(--divider-color); cursor: pointer; flex-shrink: 0;
          will-change: auto;
        }
        .color-row { display: flex; gap: 6px; align-items: center; }
        .color-text { flex: 1; }
        .px-row { display: flex; align-items: center; gap: 4px; }
        .px-row input { flex: 1; }
        .px-unit { font-size: 12px; color: var(--secondary-text-color); flex-shrink: 0; }
        .color-reset { font-size: 13px; color: var(--primary-color); cursor: pointer;
          padding: 4px 6px; border-radius: 4px; border: 1px solid var(--divider-color);
          line-height: 1; flex-shrink: 0; user-select: none; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .hint { font-size: 10px; color: var(--disabled-text-color); margin: 3px 0 0; }
        /* Toggle switch */
        .switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; inset: 0; background: var(--divider-color);
          border-radius: 20px; cursor: pointer;
          transition: background-color 0.3s ease;
          will-change: background-color;
        }
        .slider:before {
          content: ''; position: absolute; width: 14px; height: 14px;
          left: 3px; bottom: 3px; background: white; border-radius: 50%;
          transition: transform 0.3s ease;
          will-change: transform;
        }
        input:checked + .slider { background: var(--primary-color); }
        input:checked + .slider:before { transform: translateX(16px); }
        .effects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .separator { height: 1px; background: var(--divider-color); margin: 4px 0 10px; opacity: .4; }
        .mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 8px 0 10px;
        }
        .mode-btn {
          border: 1px solid var(--divider-color);
          background: var(--card-background-color);
          color: var(--primary-text-color);
          border-radius: 8px;
          padding: 8px;
          font-size: 12px;
          cursor: pointer;
        }
        .mode-btn.active {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 1px var(--primary-color) inset;
        }
      </style>

      <h3>Contenu</h3>
      ${this._select('Style heading', 'heading_style', [
        ['title',    'Titre (grand)'],
        ['subtitle', 'Sous-titre (petit, secondaire)'],
      ])}
      ${this._input('Titre', 'title', 'text', '', 'Mon tableau de bord')}
      ${this._input('Sous-titre', 'subtitle', 'text', `
        <strong>Templates:</strong> {{ states("entity") }}, {{ "text" if is_state("entity", "state") else "autre" }}, filtres (| round(1))
        <br><strong>HTML:</strong> &lt;br&gt;, &lt;b&gt;, &lt;i&gt;, &lt;u&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;small&gt;, &lt;mark&gt;, &lt;code&gt;, &lt;span&gt;
        <br><strong>Icônes MDI:</strong> [mdi:icon-name] → ex: Status: [mdi:check] Actif ou Temp: [mdi:thermometer] 22°C
      `, 'Optionnel')}
      <div class="row2">
        ${this._input('Icône MDI', 'icon', 'text', 'ex: mdi:lightning-bolt', 'mdi:...')}
        ${this._select('Position icône', 'icon_position', [
          ['left','◀ Gauche'], ['right','Droite ▶'], ['top','▲ Au dessus'],
        ])}
      </div>
      ${this._px('Taille icône (global)', 'icon_size', '24')}

      <h3 style="display:flex; align-items: center; gap: 10px; margin: 20px 0 8px;">
        Style & Effets
        <div class="mode-switch" style="margin: 0; flex: 1;">
          <button type="button" class="mode-btn ${this._getEditorMode() === 'title' ? 'active' : ''}" data-edit-mode="title" style="margin: 0; flex: 1;">Titre</button>
          <button type="button" class="mode-btn ${this._getEditorMode() === 'subtitle' ? 'active' : ''}" data-edit-mode="subtitle" style="margin: 0; flex: 1;">Sous-titre</button>
        </div>
      </h3>
      <p class="hint">⚙️ Vous éditez actuellement les paramètres de <strong>${this._getEditorMode() === 'subtitle' ? 'SOUS-TITRE (subtitle_config)' : 'TITRE (title_config)'}</strong>. Les changements s'appliquent uniquement à cet onglet. Les champs de style acceptent aussi les templates {{ ... }}.</p>

      <h3>Typographie - ${this._getEditorMode() === 'subtitle' ? '📝 Sous-titre' : '📝 Titre'}</h3>
      ${this._select('Police', 'font_family', fontOpts, 'Les polices Google sont chargées automatiquement.')}
      <div class="row2">
        ${this._px('Taille police', 'font_size', this._getEditorMode() === 'subtitle' ? '14' : '24')}
        ${this._px('Taille sous-titre', 'font_size_sub', '13')}
      </div>
      <div class="row3">
        ${this._select('Bold', 'font_weight', [
          ['','— auto —'],['300','Light 300'],['400','Normal 400'],
          ['600','Semi-bold 600'],['700','Bold 700'],['900','Black 900'],
        ])}
        ${this._select('Alignement H', 'align_h', [
          ['left','◀ Gauche'],['center','▣ Centre'],['right','Droite ▶'],
        ])}
        ${this._select('Alignement V', 'align_v', [
          ['top','▲ Haut'],['center','▣ Centre'],['bottom','▼ Bas'],
        ])}
      </div>
      <div class="row2">
        ${this._toggle('Majuscules', 'uppercase')}
        ${this._toggle('Italique', 'italic')}
      </div>
      ${this._px('Espacement lettres', 'letter_spacing', '0')}

      <h3>Couleurs - ${this._getEditorMode() === 'subtitle' ? '🎨 Sous-titre' : '🎨 Titre'}</h3>
      ${this._color('Couleur texte', 'color', '#ffffff', 'var(--primary-text-color) ou #hex')}
      ${this._color('Couleur icône', 'icon_color', '#ffffff', 'var(--primary-text-color) ou #hex')}
      ${this._input('Text-shadow (CSS)', 'text_shadow', 'text',
        'Valeur CSS brute. Ex&nbsp;: <code>0 0 8px currentColor, 0 0 20px #00E8FF88</code>. Écrase le glow auto.',
        '0 0 8px currentColor, 0 0 20px currentColor'
      )}

      <h3>Arrière-plan - ${this._getEditorMode() === 'subtitle' ? '🎭 Sous-titre' : '🎭 Titre'}</h3>
      ${this._color('Couleur fond', 'bg_color', '#1a1a2e', 'var(--card-background-color) ou #hex')}
      <div class="row2">
        ${this._number('Opacité fond', 'bg_opacity', 0, 1, 0.1)}
        ${this._px('Flou fond', 'bg_blur', '0')}
      </div>

      <h3>Bordure - ${this._getEditorMode() === 'subtitle' ? '⬚ Sous-titre' : '⬚ Titre'}</h3>
      ${this._color('Couleur bordure', 'border_color', '#444444', 'var(--divider-color) ou #hex')}
      <div class="row3">
        ${this._px('Épaisseur', 'border_width', '1')}
        ${this._select('Style', 'border_style', [
          ['solid','Solide'],['dashed','Tirets'],['dotted','Pointillés'],
          ['double','Double'],['none','Aucun'],
        ])}
        ${this._px('Rayon', 'border_radius', '12')}
      </div>

      <h3>Effets - ✨ ${this._getEditorMode() === 'subtitle' ? 'Sous-titre' : 'Titre'}</h3>
      <div class="effects-grid">
        ${this._toggle('✦ Glow (lueur)', 'effect_glow')}
        ${this._toggle('≡ Scanlines', 'effect_scanline')}
        ${this._toggle('◈ Dégradé texte', 'effect_gradient')}
        ${this._toggle('↺ Scintillement', 'effect_flicker')}
        ${this._toggle('⚡ Glitch hover', 'effect_hover_glitch')}
      </div>
      <div class="separator"></div>
      <div id="glow-opts" style="display:${this._getConfigValue('effect_glow') ? 'block' : 'none'}">
        ${this._color('Couleur glow', 'effect_glow_color', '#00E8FF', 'var(--primary-color) ou #hex')}
        ${this._px('Taille glow', 'effect_glow_size', '12')}
      </div>
      <div id="gradient-opts" style="display:${this._getConfigValue('effect_gradient') ? 'block' : 'none'}">
        <div class="row2">
          ${this._color('Dégradé début', 'effect_gradient_from', '#00E8FF', 'var(--primary-color) ou #hex')}
          ${this._color('Dégradé fin', 'effect_gradient_to', '#FF50A0', 'var(--accent-color) ou #hex')}
        </div>
      </div>

      <h3>Dimensions & interaction</h3>
      <div class="row2">
        ${this._paddingInput()}
        <div id="min-height-field" style="display:${this._getConfigValue('heading_style') === 'subtitle' ? 'none' : 'block'}">
          ${this._px('Hauteur min', 'min_height', '24')}
        </div>
      </div>
      ${this._select('Action au clic', 'tap_action', [
        ['none','Aucun'],['navigate','Navigation'],['more-info','Plus d\'infos'],
      ])}
      <div id="nav-opts" style="display:${this._getConfigValue('tap_action') === 'navigate' ? 'block' : 'none'}">
        ${this._input('Chemin de navigation', 'navigation_path', 'text', 'ex: /lovelace/0', '/lovelace/0')}
      </div>
    `;

    const glowToggle = this.querySelector('[data-key="effect_glow"]');
    if (glowToggle) {
      this._addEventListener(glowToggle, 'change', e => {
        this.querySelector('#glow-opts').style.display = e.target.checked ? 'block' : 'none';
      });
    }

    const gradientToggle = this.querySelector('[data-key="effect_gradient"]');
    if (gradientToggle) {
      this._addEventListener(gradientToggle, 'change', e => {
        this.querySelector('#gradient-opts').style.display = e.target.checked ? 'block' : 'none';
      });
    }

    const tapActionSelect = this.querySelector('[data-key="tap_action"]');
    if (tapActionSelect) {
      this._addEventListener(tapActionSelect, 'change', e => {
        this.querySelector('#nav-opts').style.display = e.target.value === 'navigate' ? 'block' : 'none';
      });
    }

    this.querySelectorAll('[data-edit-mode]').forEach(el => {
      this._addEventListener(el, 'click', e => {
        e.stopPropagation();
        const mode = e.currentTarget?.dataset?.editMode;
        this._setEditorMode(mode);
        this._rebuildEditor();
      });
    });

    const headingStyleSelect = this.querySelector('[data-key="heading_style"]');
    if (headingStyleSelect) {
      this._addEventListener(headingStyleSelect, 'change', e => {
        const isSub = e.target.value === 'subtitle';
        this._setEditorMode(isSub ? 'subtitle' : 'title');

        const minHField = this.querySelector('#min-height-field');
        if (minHField) minHField.style.display = isSub ? 'none' : 'block';

        if (isSub) {
          const fontSizeInput = this.querySelector('[data-key="font_size"]');
          if (fontSizeInput && !this._getConfigValue('font_size')) fontSizeInput.value = '14';
          const iconSizeInput = this.querySelector('[data-key="icon_size"]');
          if (iconSizeInput && !this._getConfigValue('icon_size')) iconSizeInput.value = '13';
          const padV = this.querySelector('[data-padding="v"]');
          const padH = this.querySelector('[data-padding="h"]');
          if (padV && !this._getConfigValue('padding')) padV.value = '1';
          if (padH && !this._getConfigValue('padding')) padH.value = '8';
        } else {
          const fontSizeInput = this.querySelector('[data-key="font_size"]');
          if (fontSizeInput && !this._getConfigValue('font_size')) fontSizeInput.value = '';
          const iconSizeInput = this.querySelector('[data-key="icon_size"]');
          if (iconSizeInput && !this._getConfigValue('icon_size')) iconSizeInput.value = '';
          const padV = this.querySelector('[data-padding="v"]');
          const padH = this.querySelector('[data-padding="h"]');
          if (padV && !this._getConfigValue('padding')) { padV.value = '12'; padH.value = '16'; }
        }
      });
    }

    const updatePadding = () => {
      const v = this.querySelector('[data-padding="v"]')?.value || '0';
      const h = this.querySelector('[data-padding="h"]')?.value || '0';
      this._changed('padding', `${v}px ${h}px`);
    };
    this.querySelectorAll('[data-padding]').forEach(el => {
      this._addEventListener(el, 'change', e => {
        e.stopPropagation();
        updatePadding();
      });
    });

    this.querySelectorAll('input[type=color]').forEach(picker => {
      const key  = picker.dataset.key;
      const text = this.querySelector(`.color-text[data-key="${key}"]`);
      if (!text) return;

      const debouncedColorChange = debounce((value) => {
        this._changed(key, value);
      }, 100);

      this._addEventListener(picker, 'input', e => {
        e.stopPropagation();
        text.value = picker.value;
        debouncedColorChange(picker.value);
      }, { passive: true });

      this._addEventListener(text, 'input', e => {
        e.stopPropagation();
        if (/^#[0-9a-fA-F]{6}$/.test(text.value)) picker.value = text.value;
        debouncedColorChange(text.value || null);
      }, { passive: true });
    });

    this.querySelectorAll('[data-key]:not([type=color])').forEach(el => {
      if (el.type === 'checkbox' || el.tagName === 'SELECT') {
        this._addEventListener(el, 'change', e => {
          e.stopPropagation();
          const val = el.type === 'checkbox' ? el.checked : el.value;
          this._changed(el.dataset.key, val === '' ? null : val);
        });
        return;
      }
      if (el.type === 'number') {
        this._addEventListener(el, 'change', e => {
          e.stopPropagation();
          const raw = el.value === '' ? null : el.value;
          const val = (raw !== null && el.dataset.px) ? `${raw}px` : raw;
          this._changed(el.dataset.key, val);
        });
        return;
      }
      this._addEventListener(el, 'keydown', e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'keyup',   e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'input',   e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'blur', e => {
        e.stopPropagation();
        this._debouncedChanged(el.dataset.key, el.value === '' ? null : el.value);
      });
    });

    this.querySelectorAll('[data-reset]').forEach(el => {
      this._addEventListener(el, 'click', () => {
        const key = el.dataset.reset;
        const picker = this.querySelector(`input[type=color][data-key="${key}"]`);
        const text   = this.querySelector(`.color-text[data-key="${key}"]`);
        if (picker) picker.style.opacity = '0.4';
        if (text)   text.value = '';
        this._changed(key, null);
      });
    });
  }

  _changed(key, val) {
    if (val === 'true')  val = true;
    if (val === 'false') val = false;
    if (['effect_glow_size', 'bg_opacity'].includes(key) && val !== null && val !== '')
      val = parseFloat(val);
    const config = { ...this._config };

    if (this._isModeStyleKey(key)) {
      const modeKey = this._activeModeKey(config);
      const modeConfig = { ...(config[modeKey] || {}) };
      if (val === null || val === '') delete modeConfig[key];
      else modeConfig[key] = val;
      config[modeKey] = modeConfig;
      delete config[key];
    } else if (val === null || val === '') {
      delete config[key];
    } else {
      config[key] = val;
    }

    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
  }
}
customElements.define('neon-header-card-editor', NeonHeaderCardEditor);

// ═══════════════════════════════════════════════════════
//  CARD PRINCIPALE
// ═══════════════════════════════════════════════════════
class NeonHeaderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._fontLoaded = new Set();
    this._clickHandler = null;
    this._cardModObserver = null;
    this._cardModApplying = false;
    this._cardModDebounce = null;
    this._rafCardMod = null;
    // Randomized per instance for desynchronized animations
    this._flickerDur     = (3 + Math.random() * 2).toFixed(2);
    this._flickerOff     = -(Math.random() * parseFloat(this._flickerDur)).toFixed(2);
    this._flickerOffIcon = (parseFloat(this._flickerOff) - 0.3 - Math.random()).toFixed(2);
    this._scanDur        = (4 + Math.random() * 4).toFixed(2);
    this._scanOff        = -(Math.random() * parseFloat(this._scanDur)).toFixed(2);
  }

  static getConfigElement() { return document.createElement('neon-header-card-editor'); }
  static getStubConfig() {
    return { title: 'Mon Dashboard', icon: 'mdi:home', align_h: 'left' };
  }

  connectedCallback() {
    this._setupCardModObserver();
    this._applyCardModStyles();
    if (this._config && !this._rendered) {
      this._render();
    }
  }

  disconnectedCallback() {
    if (this._clickHandler && this.shadowRoot) {
      const card = this.shadowRoot.querySelector('ha-card');
      if (card) card.removeEventListener('click', this._clickHandler);
    }
    if (this._cardModObserver) {
      this._cardModObserver.disconnect();
      this._cardModObserver = null;
    }
    if (this._rafCardMod) { cancelAnimationFrame(this._rafCardMod); this._rafCardMod = null; }
    clearTimeout(this._cardModDebounce);
    this._cardModDebounce = null;
  }

  _setupCardModObserver() {
    if (this._cardModObserver || !this.shadowRoot) return;

    this._cardModObserver = new MutationObserver(() => {
      if (this._cardModApplying) return;
      clearTimeout(this._cardModDebounce);
      this._cardModDebounce = setTimeout(() => this._applyCardModStyles(), 100);
    });

    this._cardModObserver.observe(this.shadowRoot, { childList: true });
    this._cardModObserver.observe(this, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  _collectCardModCSS() {
    if (!this.shadowRoot) return '';
    const styles = this.shadowRoot.querySelectorAll('style[id*="card-mod"]');
    let css = '';
    styles.forEach((el) => {
      if (el.id !== 'card-mod-mirror') {
        css += `${el.textContent || ''}\n`;
      }
    });
    return css;
  }

  _applyCardModStyles() {
    if (this._cardModApplying || !this.shadowRoot) return;
    this._cardModApplying = true;
    try {
      const mirror = this.shadowRoot.querySelector('#card-mod-mirror');
      if (!mirror) return;
      const mirrorCSS = this._collectCardModCSS();
      if (mirror.textContent !== mirrorCSS) {
        mirror.textContent = mirrorCSS;
      }
    } finally {
      this._cardModApplying = false;
    }
  }

  setConfig(raw) {
    clearTimeout(this._cardModDebounce);
    if (this._rafCardMod) { cancelAnimationFrame(this._rafCardMod); this._rafCardMod = null; }
    this._config = buildConfig(raw);
    this.setAttribute('heading-style', this._config.heading_style);
    if (this._rendered) {
      this._rendered = false;
      this._render();
    }
  }

  getCardSize()  { return this._config?.heading_style === 'subtitle' ? 1 : 2; }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;

    if (!this._rendered) {
      this._render();
      return;
    }

    if (this._hasDynamicStyleTemplates()) {
      this._rendered = false;
      this._render();
      return;
    }

    if (this._hasTemplateText()) {
      this._updateDynamicText();
    }
  }

  _hasTemplateText() {
    const hasTemplate = (s) => typeof s === 'string' && s.includes('{{');
    return !!(this._config && (hasTemplate(this._config.title) || hasTemplate(this._config.subtitle)));
  }

  _hasDynamicStyleTemplates() {
    const hasTemplateValue = (v) => typeof v === 'string' && v.includes('{{');
    const hasTemplateInObject = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      return Object.values(obj).some((v) => hasTemplateValue(v));
    };

    if (!this._config) return false;
    return hasTemplateInObject(this._config.title_config) || hasTemplateInObject(this._config.subtitle_config);
  }

  _updateDynamicText() {
    if (!this.shadowRoot || !this._config) return;
    const titleEl = this.shadowRoot.querySelector('.title');
    const subtitleEl = this.shadowRoot.querySelector('.subtitle');

    if (titleEl) titleEl.textContent = parseTemplate(this._hass, this._config.title) || '';
    if (subtitleEl) subtitleEl.innerHTML = sanitizeSubtitleHTML(parseTemplate(this._hass, this._config.subtitle) || '');
  }

  _loadFont(family) {
    if (!family || this._fontLoaded.has(family)) return;
    const id = `nhc-font-${family.replace(/\s/g, '-')}`;
    if (document.getElementById(id)) {
      this._fontLoaded.add(family);
      return;
    }

    if (!document.querySelector('link[rel=preconnect][href="https://fonts.googleapis.com"]')) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect);
    }

    if (!document.querySelector('link[rel=preconnect][href="https://fonts.gstatic.com"]')) {
      const preconnectStatic = document.createElement('link');
      preconnectStatic.rel = 'preconnect';
      preconnectStatic.href = 'https://fonts.gstatic.com';
      preconnectStatic.crossOrigin = 'anonymous';
      document.head.appendChild(preconnectStatic);
    }

    const link = document.createElement('link');
    link.id   = id;
    link.rel  = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;600;700;900&display=swap`;
    document.head.appendChild(link);
    this._fontLoaded.add(family);
  }

  _navigate(path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // Bug #5 fix: CustomEvent required to carry detail payload
  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _resolveTemplateValue(value) {
    if (typeof value !== 'string' || !value.includes('{{')) return value;
    // Bug #6 fix: guard against missing _hass during config-only render
    if (!this._hass) return value;
    const resolved = parseTemplate(this._hass, value);
    if (typeof resolved !== 'string') return resolved;

    const trimmed = resolved.trim();
    if (trimmed === '') return '';

    const lower = trimmed.toLowerCase();
    if (['true', 'on', 'yes'].includes(lower)) return true;
    if (['false', 'off', 'no'].includes(lower)) return false;

    if (/^[-+]?\d+(\.\d+)?$/.test(trimmed)) {
      const numeric = Number(trimmed);
      if (!Number.isNaN(numeric)) return numeric;
    }

    return trimmed;
  }

  _resolveModeConfigTemplates(modeConfig) {
    if (!modeConfig || typeof modeConfig !== 'object') return modeConfig || {};

    const resolved = {};
    Object.entries(modeConfig).forEach(([key, value]) => {
      resolved[key] = this._resolveTemplateValue(value);
    });
    return resolved;
  }

  _render() {
    if (!this._config) return;
    // Sur iPad : seuls les effets animés/GPU-intensifs sont désactivés
    // glow (text-shadow/box-shadow) et gradient sont conservés — peu coûteux et bien rendus
    const c = IS_IPAD ? {
      ...this._config,
      title_config: {
        ...this._config.title_config,
        effect_scanline: false,
        effect_flicker: false,
        effect_hover_glitch: false,
      },
      subtitle_config: {
        ...this._config.subtitle_config,
        effect_scanline: false,
        effect_flicker: false,
        effect_hover_glitch: false,
      },
    } : this._config;

    const preservedCardModCSS = this._collectCardModCSS();
    this._loadFont(c.font_family);

    // ── Select correct config based on heading_style ─────
    const isSubStyle = c.heading_style === 'subtitle';
    const modeConfigRaw = isSubStyle ? c.subtitle_config : c.title_config;
    const modeConfig = this._resolveModeConfigTemplates(modeConfigRaw);

    // ── Valeurs calculées ─────────────────────────────
    const hasIcon    = !!c.icon;
    const hasSub     = !!c.subtitle;
    const iconRight  = c.icon_position === 'right';
    const iconTop    = c.icon_position === 'top';

    const colorPrimary = modeConfig.color      || 'var(--ha-card-header-color, var(--primary-text-color))';
    const colorAccent  = modeConfig.icon_color || colorPrimary;
    const textColor    = colorPrimary;
    const iconColor    = colorAccent;

    const fontFamily  = c.font_family  ? `'${c.font_family}', var(--primary-font-family, sans-serif)` : 'var(--primary-font-family, var(--ha-card-header-font-family, sans-serif))';

    // font-size: clamp for responsive scaling, preserving CSS vars unchanged
    const rawFontSize = modeConfig.font_size || (isSubStyle ? '14px' : 'var(--ha-card-header-font-size, 24px)');
    const fontSize = rawFontSize.startsWith('var(') ? rawFontSize
      : (() => {
          const px = parseFloat(rawFontSize);
          if (isNaN(px)) return rawFontSize;
          const minPx = Math.max(10, Math.round(px * 0.75));
          const maxPx = Math.round(px * 1.25);
          return `clamp(${minPx}px, ${px * 0.5}vw + ${Math.round(px * 0.5)}px, ${maxPx}px)`;
        })();

    const rawFontSizeSub = modeConfig.font_size_sub || '13px';
    const fontSizeSub = rawFontSizeSub.startsWith('var(') ? rawFontSizeSub
      : (() => {
          const px = parseFloat(rawFontSizeSub);
          if (isNaN(px)) return rawFontSizeSub;
          const minPx = Math.max(9, Math.round(px * 0.8));
          return `clamp(${minPx}px, ${(px * 0.4).toFixed(1)}vw + ${Math.round(px * 0.55)}px, ${Math.round(px * 1.15)}px)`;
        })();

    const fontWeight  = modeConfig.font_weight  || (isSubStyle ? '400' : 'var(--ha-card-header-font-weight, 500)');
    const iconSize    = modeConfig.icon_size    || (isSubStyle ? '13px' : `calc(${rawFontSize} * 1.2)`);
    const padding     = modeConfig.padding      || (isSubStyle ? '1px 8px' : 'var(--ha-card-header-padding, 12px 16px)');
    const minHeight   = modeConfig.min_height   || (isSubStyle ? '25px' : 'auto');
    const letterSpacing = modeConfig.letter_spacing || (isSubStyle ? 'normal' : '0.02em');
    const glowColor   = modeConfig.effect_glow_color || textColor;
    const glowSize    = modeConfig.effect_glow_size  || 12;
    // Sur iPad, effect_glow est forcé false pour le texte/box-shadow — mais le drop-shadow
    // icône est peu coûteux, on le préserve en lisant la config originale
    const rawModeConfig = isSubStyle ? this._config.subtitle_config : this._config.title_config;
    const iconGlowEnabled = !!(rawModeConfig && rawModeConfig.effect_glow);
    const gradFrom    = modeConfig.effect_gradient_from || 'var(--primary-color, #00E8FF)';
    const gradTo      = modeConfig.effect_gradient_to   || 'var(--accent-color, #FF50A0)';

    // ── bg : seulement si configuré explicitement ─────
    let bgStyle = '';
    if (modeConfig.bg_color) {
      const hex = modeConfig.bg_color.startsWith('#') ? modeConfig.bg_color.replace('#','') : null;
      if (hex && hex.length === 6) {
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        const op = modeConfig.bg_opacity ?? 1;
        bgStyle = `background: rgba(${r},${g},${b},${op});`;
      } else {
        bgStyle = `background: ${modeConfig.bg_color};`;
        if (modeConfig.bg_opacity != null) bgStyle += ` opacity: ${modeConfig.bg_opacity};`;
      }
    } else if (modeConfig.bg_opacity != null) {
      bgStyle = `background: rgba(var(--rgb-card-background-color, 255,255,255), ${modeConfig.bg_opacity});`;
    }

    // Bug #3 fix: check numeric value > 0, not string inequality
    const blurNum = parseFloat(modeConfig.bg_blur);
    const blurVal = (!isNaN(blurNum) && blurNum > 0)
      ? `${blurNum}px`
      : (modeConfig.bg_blur === true ? '8px' : '');
    const hasBlur = !!blurVal;

    // Bug #4 fix: border_style default is 'solid' — check actual meaningful difference
    const hasBorder = !!(modeConfig.border_color || modeConfig.border_width ||
      (modeConfig.border_style && modeConfig.border_style !== 'solid'));
    const borderStyle = hasBorder
      ? `border: ${modeConfig.border_width || '1px'} ${modeConfig.border_style || 'solid'} ${modeConfig.border_color || 'var(--divider-color)'};`
      : '';

    const borderRadiusStyle = modeConfig.border_radius ? `border-radius: ${modeConfig.border_radius};` : '';

    const glowBoxShadow = modeConfig.effect_glow
      ? `box-shadow: var(--ha-card-box-shadow, none), 0 0 ${glowSize*2}px ${glowColor}44;`
      : '';

    // text_shadow: valeur CSS brute, prioritaire sur effect_glow auto-généré
    const glowShadow = modeConfig.text_shadow
      ? `text-shadow: ${modeConfig.text_shadow};`
      : modeConfig.effect_glow
        ? `text-shadow: 0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize*2}px ${glowColor}55;`
        : '';

    const gradientCSS = modeConfig.effect_gradient ? `
      background: linear-gradient(90deg, ${gradFrom}, ${gradTo});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    ` : '';

    const flickerDur     = this._flickerDur;
    const flickerOff     = this._flickerOff;
    const flickerOffIcon = this._flickerOffIcon;
    const scanDur        = this._scanDur;
    const scanOff        = this._scanOff;
    const scanColor      = modeConfig.effect_scanline_color || colorPrimary || 'rgba(0,255,255,1)';
    const flickerAnim = modeConfig.effect_flicker
      ? `animation: flicker ${flickerDur}s ease-in-out infinite ${flickerOff}s;` : '';

    let wrapDirection = 'row';
    if (iconTop) { wrapDirection = 'column'; }
    if (iconRight) { wrapDirection = 'row-reverse'; }

    const alignItems = {
      top:    'flex-start',
      center: 'center',
      bottom: 'flex-end',
    }[modeConfig.align_v] || 'center';

    const justifyContent = {
      left:   'flex-start',
      center: 'center',
      right:  'flex-end',
    }[modeConfig.align_h] || 'flex-start';

    const interactive = c.tap_action !== 'none';

    if (this._clickHandler && this.shadowRoot) {
      const oldCard = this.shadowRoot.querySelector('ha-card');
      if (oldCard) oldCard.removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          contain: layout style;
          overflow: visible;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          --nec-p: ${colorPrimary};
          --nec-a: ${colorAccent};
          --nec-glow: ${glowColor};
          --nec-glow-size: ${glowSize}px;
          --nec-icon-size: ${iconSize};
          --nec-font-size: ${fontSize};
          --nec-letter-spacing: ${letterSpacing};
          ${isSubStyle ? `max-height: 26px;` : ''}
        }

        ${isSubStyle ? `
        ha-card {
          max-height: 30px !important;
          min-height: 26px !important;
        }
        ` : ''}

        .nhc-header, .nhc-header *, .icon-wrap, .text-wrap, .title, .subtitle, .scanlines, .dots {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        @keyframes flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
          20%,24%,55% { opacity: .6; }
        }

        @keyframes scanMove {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(250px); opacity: 0; }
        }

        @keyframes scanlineVibrate {
          0%,  100% { opacity: 1;   transform: translateX(0); }
          5%         { opacity: 0.8; transform: translateX(2px); }
          10%        { opacity: 1;   transform: translateX(-1px); }
          15%        { opacity: 0.9; transform: translateX(0); }
        }

        @keyframes crtScroll {
          from { transform: translateY(0) translateZ(0); }
          to   { transform: translateY(50%) translateZ(0); }
        }

        @keyframes crtFlicker {
          0%,100% { opacity: 0; }
          8%       { opacity: 0.04; }
          9%       { opacity: 0; }
          40%      { opacity: 0; }
          41%      { opacity: 0.06; }
          42%      { opacity: 0; }
          75%      { opacity: 0; }
          76%      { opacity: 0.03; }
          77%      { opacity: 0; }
        }

        @keyframes cardGlitch {
          0%, 100% {
            transform: translateY(-10px) scale(1.03) translateZ(0);
          }
          15% {
            transform: translateY(-10px) scale(1.03) translate(-6px, 4px) translateZ(0);
            filter: drop-shadow(6px 0 #00F0FF) drop-shadow(-6px 0 #FF1744);
          }
          30% {
            transform: translateY(-10px) scale(1.03) translate(6px, -4px) translateZ(0);
            filter: drop-shadow(-6px 0 #00FFCC) drop-shadow(6px 0 #FF1744);
          }
          45% {
            transform: translateY(-10px) scale(1.03) translate(-4px, 3px) translateZ(0);
            filter: drop-shadow(5px 5px #00F0FF) drop-shadow(-5px -5px #FF1744);
          }
          60% {
            transform: translateY(-10px) scale(1.03) translate(5px, -2px) translateZ(0);
          }
          75% {
            transform: translateY(-10px) scale(1.03) translate(-3px, 0) translateZ(0);
          }
        }

        @keyframes iconGlitch {
          0%, 100% { transform: scale(1) rotate(0deg) translateZ(0); }
          20% { transform: scale(1.15) rotate(-12deg) translateZ(0); }
          40% { transform: scale(1.2) rotate(12deg) translateZ(0); }
          60% { transform: scale(1.15) rotate(-8deg) translateZ(0); }
          80% { transform: scale(1.08) rotate(5deg) translateZ(0); }
        }

        @keyframes textGlitch {
          0%, 100% { transform: translate(0, 0) translateZ(0); }
          25% {
            transform: translate(-4px, 0) translateZ(0);
            text-shadow: 4px 0 #00F0FF, -4px 0 #FF1744;
          }
          50% {
            transform: translate(4px, 0) translateZ(0);
            text-shadow: -4px 0 #00FFCC, 4px 0 #FF1744;
          }
          75% {
            transform: translate(-3px, 0) translateZ(0);
            text-shadow: 3px 0 #00FFCC, 0 0 15px #00FFCC;
          }
        }

        .scanlines {
          display: none;
        }

        ${modeConfig.effect_scanline ? `
        .nhc-header::before {
          content: " ";
          display: block;
          position: absolute;
          left: 0; right: 0;
          top: -100%;
          height: 200%;
          background:
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05));
          background-size: 100% 3px, 3px 100%;
          z-index: 2;
          pointer-events: none;
          animation: crtScroll ${(scanDur * 1.5).toFixed(1)}s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        .nhc-header::after {
          content: " ";
          display: block;
          position: absolute;
          inset: 0;
          background: rgba(18,16,16,0.08);
          opacity: 0;
          z-index: 3;
          pointer-events: none;
          border-radius: inherit;
          animation: crtFlicker 4s step-end infinite;
        }
        ` : ''}

        ha-card {
          contain: layout style paint;
          position: relative;
          transform: translateZ(0);
          ${modeConfig.effect_hover_glitch ? 'transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
        }

        ${modeConfig.effect_hover_glitch ? `
        ha-card:hover {
          transform: translateY(-8px) scale(1.02) translateZ(0);
          animation: cardGlitch 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ` : ''}

        .nhc-header {
          display: flex;
          flex-direction: ${wrapDirection};
          align-items: ${alignItems};
          justify-content: ${justifyContent};
          gap: ${iconTop ? '6px' : '10px'};
          padding: ${padding};
          min-height: ${minHeight};
          position: relative;
          border-radius: inherit;
          contain: layout style;
          overflow: ${modeConfig.effect_scanline ? 'hidden' : 'visible'};
        }

        .icon-wrap {
          display: ${hasIcon ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: visible;
        }

        ha-icon {
          --mdc-icon-size: ${iconSize};
          color: ${iconColor};
          overflow: visible;
          ${iconGlowEnabled && !modeConfig.effect_hover_glitch ? `filter: drop-shadow(0 0 ${Math.round(glowSize*0.7)}px ${glowColor});` : ''}
          ${modeConfig.effect_flicker && !modeConfig.effect_hover_glitch ? `animation: flicker ${flickerDur}s ease-in-out infinite ${flickerOffIcon}s;` : ''}
        }

        ${modeConfig.effect_hover_glitch ? `
        ha-card:hover ha-icon {
          animation: iconGlitch 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ` : ''}

        .text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: ${modeConfig.align_h};
          ${iconTop ? 'align-items: center; text-align: center;' : ''}
          contain: layout style;
          overflow: visible;
        }

        .title {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          font-weight: ${fontWeight};
          ${modeConfig.italic ? 'font-style: italic;' : ''}
          ${modeConfig.uppercase ? 'text-transform: uppercase;' : ''}
          letter-spacing: ${letterSpacing};
          line-height: 1.2;
          overflow: visible;
          ${gradientCSS || `color: ${textColor};`}
          ${!modeConfig.effect_hover_glitch ? glowShadow : ''}
          ${!modeConfig.effect_hover_glitch ? flickerAnim : ''}
          ${modeConfig.effect_hover_glitch ? 'transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
        }

        ${modeConfig.effect_hover_glitch ? `
        ha-card:hover .title {
          animation: textGlitch 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ` : ''}

        .subtitle {
          display: ${hasSub ? 'block' : 'none'};
          font-family: ${fontFamily};
          font-size: ${fontSizeSub};
          font-weight: 400;
          color: var(--secondary-text-color, #888);
          line-height: 1.3;
          overflow: visible;
          ${modeConfig.uppercase ? `text-transform: uppercase; letter-spacing: calc(${letterSpacing} + 1px);` : ''}
          ${modeConfig.italic ? 'font-style: italic;' : ''}
        }

        .subtitle ha-icon {
          --mdc-icon-size: ${fontSizeSub};
          color: inherit;
          vertical-align: middle;
          display: inline-flex;
          align-items: center;
          line-height: 1;
          margin: 0 2px;
        }
      </style>

      <style id="card-mod-mirror">${preservedCardModCSS}</style>

      <ha-card style="${[
        bgStyle,
        borderStyle,
        borderRadiusStyle,
        hasBlur ? `backdrop-filter:blur(${blurVal});-webkit-backdrop-filter:blur(${blurVal})` : '',
        glowBoxShadow,
        interactive ? 'cursor:pointer' : '',
      ].filter(Boolean).join(';')}">
        <div class="scanlines"></div>
        <div class="nhc-header">
          <div class="icon-wrap">
            <ha-icon icon="${c.icon || ''}"></ha-icon>
          </div>
          <div class="text-wrap">
            <div class="title"></div>
            <div class="subtitle"></div>
          </div>
        </div>
      </ha-card>
    `;

    // Bug #2 fix: _render injects empty divs, _updateDynamicText is sole source of truth
    this._updateDynamicText();

    if (interactive) {
      this._clickHandler = () => {
        if (c.tap_action === 'navigate' && c.navigation_path) {
          this._navigate(c.navigation_path);
        } else if (c.tap_action === 'more-info' && c.entity) {
          this._moreInfo(c.entity);
        }
      };
      this.shadowRoot.querySelector('ha-card').addEventListener('click', this._clickHandler);
    }

    this._rendered = true;
    if (this._rafCardMod) cancelAnimationFrame(this._rafCardMod);
    this._rafCardMod = requestAnimationFrame(() => { this._rafCardMod = null; this._applyCardModStyles(); });
  }
}

customElements.define('neon-header-card', NeonHeaderCard);

// ── Banner console ────────────────────────────────────────────
console.info(
  '%c NEON-HEADER-CARD %c v' + VERSION + ' ',
  'color:#00E8FF;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF50A0;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:0 3px 3px 0',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'neon-header-card',
  name:             'Neon Header Card',
  description:      'Card de header customisable pour Home Assistant',
  preview:          true,
  documentationURL: 'https://github.com/',
});

console.info(
  '%c 🏠 neon-header-card v1.4.2 %c Neo Tokyo ',
  'background:#1E90FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#00D4FF;padding:2px 4px;border-radius:0 3px 3px 0;'
);
