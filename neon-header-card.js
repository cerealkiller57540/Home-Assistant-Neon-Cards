/**
 * neon-header-card v1.1 (Performance Optimized)
 * Card de header customisable pour Home Assistant
 *
 * Installation :
 *   1. Copier dans /config/www/neon-header-card.js
 *   2. Ressources HA → /local/neon-header-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:neon-header-card
 *   title: Mon titre
 */

const VERSION = '1.1.0';

// ═══════════════════════════════════════════════════════
//  PERFORMANCE HELPERS
// ═══════════════════════════════════════════════════════

// Debounce function to reduce excessive updates
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

// Throttle function for high-frequency events
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// RequestAnimationFrame wrapper for smooth updates
function rafSchedule(callback) {
  let rafId = null;
  return function(...args) {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
function buildConfig(raw) {
  return {
    // ── Contenu ───────────────────────────────────────
    title:          raw.title          ?? '',
    subtitle:       raw.subtitle       ?? null,
    icon:           raw.icon           ?? null,   // ex: mdi:lightning-bolt
    icon_position:  raw.icon_position  ?? 'left', // left | right | top

    // ── Typographie ───────────────────────────────────
    font_family:    raw.font_family    ?? null,   // null = thème HA
    font_size:      raw.font_size      ?? null,   // null = auto (var ha)
    font_size_sub:  raw.font_size_sub  ?? null,
    font_weight:    raw.font_weight    ?? null,   // null | 'bold' | 100-900
    italic:         raw.italic         ?? false,
    uppercase:      raw.uppercase      ?? false,
    letter_spacing: raw.letter_spacing ?? null,  // ex: '3px'
    align_h:        raw.align_h        ?? 'left',  // left | center | right
    align_v:        raw.align_v        ?? 'center', // top | center | bottom
    color:          raw.color          ?? null,   // null = thème

    // ── Icône ─────────────────────────────────────────
    icon_size:      raw.icon_size      ?? null,   // null = auto
    icon_color:     raw.icon_color     ?? null,   // null = suit color

    // ── Background ────────────────────────────────────
    bg_color:       raw.bg_color       ?? null,   // null = thème
    bg_opacity:     raw.bg_opacity     ?? null,   // 0-1, null = thème
    bg_blur:        raw.bg_blur        ?? false,  // true | false | px value

    // ── Bordure ───────────────────────────────────────
    border_color:   raw.border_color   ?? null,
    border_width:   raw.border_width   ?? null,   // px
    border_style:   raw.border_style   ?? 'solid',
    border_radius:  raw.border_radius  ?? null,   // px

    // ── Effets ────────────────────────────────────────
    effect_glow:       raw.effect_glow       ?? false,
    effect_glow_color: raw.effect_glow_color ?? null,  // null = suit color
    effect_glow_size:  raw.effect_glow_size  ?? 12,    // px
    effect_scanline:   raw.effect_scanline   ?? false,
    effect_gradient:   raw.effect_gradient   ?? false, // dégradé sur le texte
    effect_gradient_from: raw.effect_gradient_from ?? null,
    effect_gradient_to:   raw.effect_gradient_to   ?? null,
    effect_typing:     raw.effect_typing     ?? false, // animation curseur
    effect_flicker:    raw.effect_flicker    ?? false, // scintillement néon
    effect_hover_glitch: raw.effect_hover_glitch ?? false, // glitch hover effect

    // ── Layout ────────────────────────────────────────
    padding:        raw.padding        ?? null,   // ex: '12px 16px'
    min_height:     raw.min_height     ?? null,   // ex: '60px'
    tap_action:     raw.tap_action     ?? 'none', // none | navigate | more-info
    navigation_path: raw.navigation_path ?? null,
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

const MDI_COMMON = [
  '', 'mdi:home', 'mdi:car-electric', 'mdi:lightning-bolt', 'mdi:solar-power',
  'mdi:battery-charging', 'mdi:thermometer', 'mdi:water', 'mdi:weather-sunny',
  'mdi:cog', 'mdi:bell', 'mdi:account', 'mdi:chart-line', 'mdi:calendar',
  'mdi:clock-outline', 'mdi:shield-check', 'mdi:wifi', 'mdi:television',
  'mdi:music', 'mdi:lamp', 'mdi:sofa', 'mdi:bed', 'mdi:silverware-fork-knife',
  'mdi:garage', 'mdi:gate', 'mdi:leaf', 'mdi:star', 'mdi:heart',
];

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonHeaderCardEditor extends HTMLElement {
  constructor() {
    super();
    this._eventListeners = [];
    this._debouncedChanged = debounce(this._changed.bind(this), 150);
  }

  connectedCallback() {
    if (!this._built && this._hass && this._config) {
      this._built = true;
      this._build();
    }
  }

  disconnectedCallback() {
    // Clean up event listeners to prevent memory leaks
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._eventListeners = [];
  }

  setConfig(config) {
    this._config = config;
    if (!this._built && this._hass) { this._built = true; this._build(); }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built && this._config) { this._built = true; this._build(); }
  }

  _addEventListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    this._eventListeners.push({ element, event, handler });
  }

  _input(label, key, type = 'text', hint = '', placeholder = '') {
    const val = this._config[key] ?? '';
    // Pour les champs texte libres, on utilise textarea pour éviter que HA
    // intercepte l'input et déclenche une recherche d'entités
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
    const val = this._config[key] ?? '';
    const options = opts.map(([v, l]) =>
      `<option value="${v}" ${String(val) === String(v) ? 'selected' : ''}>${l}</option>`
    ).join('');
    return `<div class="field"><label>${label}</label><select data-key="${key}">${options}</select>${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
  }

  _toggle(label, key, hint = '') {
    const val = !!this._config[key];
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
    const val = this._config[key] || '';
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
    const val = this._config[key] ?? '';
    return `
      <div class="field">
        <label>${label}</label>
        <input type="number" data-key="${key}" value="${val}" min="${min}" max="${max}" step="${step}"/>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _px(label, key, defaultVal = '', hint = '') {
    const raw  = this._config[key] ?? '';
    const num  = parseFloat(raw) || '';
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
    const raw = this._config['padding'] ?? '';
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
    const iconOpts = MDI_COMMON.map(i => [i, i || '— aucune —']);

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
          resize: none; overflow: hidden; min-height: 34px; line-height: 1.4;
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
      </style>

      <h3>Contenu</h3>
      ${this._input('Titre', 'title', 'text', '', 'Mon tableau de bord')}
      ${this._input('Sous-titre', 'subtitle', 'text', '', 'Optionnel')}
      <div class="row2">
        ${this._select('Icône MDI', 'icon', iconOpts)}
        ${this._select('Position icône', 'icon_position', [
          ['left','◀ Gauche'], ['right','Droite ▶'], ['top','▲ Au dessus'],
        ])}
      </div>
      <div class="row2">
        ${this._input('Icône MDI personnalisée', 'icon', 'text', 'ex: mdi:lightning-bolt', 'mdi:...')}
        ${this._px('Taille icône', 'icon_size', '24')}
      </div>

      <h3>Typographie</h3>
      ${this._select('Police', 'font_family', fontOpts, 'Les polices Google sont chargées automatiquement.')}
      <div class="row2">
        ${this._input('Taille titre', 'font_size', 'text', '', 'var(--ha-card-header-font-size)')}
        ${this._px('Taille sous-titre', 'font_size_sub', '13')}
      </div>
      <div class="row3">
        ${this._select('Graisse', 'font_weight', [
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

      <h3>Couleurs</h3>
      ${this._color('Couleur texte', 'color', '#ffffff', 'var(--primary-text-color) ou #hex')}
      ${this._color('Couleur icône', 'icon_color', '#ffffff', 'var(--primary-text-color) ou #hex')}

      <h3>Arrière-plan</h3>
      ${this._color('Couleur fond', 'bg_color', '#1a1a2e', 'var(--card-background-color) ou #hex')}
      <div class="row2">
        ${this._number('Opacité fond', 'bg_opacity', 0, 1, 0.1)}
        ${this._px('Flou fond', 'bg_blur', '0')}
      </div>

      <h3>Bordure</h3>
      ${this._color('Couleur bordure', 'border_color', '#444444', 'var(--divider-color) ou #hex')}
      <div class="row3">
        ${this._px('Épaisseur', 'border_width', '1')}
        ${this._select('Style', 'border_style', [
          ['solid','Solide'],['dashed','Tirets'],['dotted','Pointillés'],
          ['double','Double'],['none','Aucun'],
        ])}
        ${this._px('Rayon', 'border_radius', '12')}
      </div>

      <h3>Effets</h3>
      <div class="effects-grid">
        ${this._toggle('✦ Glow (lueur)', 'effect_glow')}
        ${this._toggle('≡ Scanlines', 'effect_scanline')}
        ${this._toggle('◈ Dégradé texte', 'effect_gradient')}
        ${this._toggle('↺ Scintillement', 'effect_flicker')}
        ${this._toggle('⚡ Glitch hover', 'effect_hover_glitch')}
      </div>
      <div class="separator"></div>
      <div id="glow-opts" style="display:${this._config.effect_glow ? 'block' : 'none'}">
        ${this._color('Couleur glow', 'effect_glow_color', '#00E8FF', 'var(--primary-color) ou #hex')}
        ${this._px('Taille glow', 'effect_glow_size', '12')}
      </div>
      <div id="gradient-opts" style="display:${this._config.effect_gradient ? 'block' : 'none'}">
        <div class="row2">
          ${this._color('Dégradé début', 'effect_gradient_from', '#00E8FF', 'var(--primary-color) ou #hex')}
          ${this._color('Dégradé fin', 'effect_gradient_to', '#FF50A0', 'var(--accent-color) ou #hex')}
        </div>
      </div>

      <h3>Dimensions & interaction</h3>
      <div class="row2">
        ${this._paddingInput()}
        ${this._px('Hauteur min', 'min_height', '52')}
      </div>
      ${this._select('Action au clic', 'tap_action', [
        ['none','Aucun'],['navigate','Navigation'],['more-info','Plus d\'infos'],
      ])}
      <div id="nav-opts" style="display:${this._config.tap_action === 'navigate' ? 'block' : 'none'}">
        ${this._input('Chemin de navigation', 'navigation_path', 'text', 'ex: /lovelace/0', '/lovelace/0')}
      </div>
    `;

    // Affichage conditionnel des sous-options
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

    // Padding dual input (vertical + horizontal)
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

    // Sync color picker ↔ text input (with debouncing)
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

    // Tous les autres champs
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
          // Champs px : on ajoute 'px'
          const val = (raw !== null && el.dataset.px) ? `${raw}px` : raw;
          this._changed(el.dataset.key, val);
        });
        return;
      }
      // Texte et textarea → seulement sur blur (avec debounce)
      this._addEventListener(el, 'keydown', e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'keyup',   e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'input',   e => e.stopPropagation(), { passive: true });
      this._addEventListener(el, 'blur', e => {
        e.stopPropagation();
        this._debouncedChanged(el.dataset.key, el.value === '' ? null : el.value);
      });
    });

    // Reset couleurs
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
    if (val === null || val === '') delete config[key];
    else config[key] = val;
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
  }

  static getConfigElement() { return document.createElement('neon-header-card-editor'); }
  static getStubConfig() {
    return { title: 'Mon Dashboard', icon: 'mdi:home', align_h: 'left' };
  }

  connectedCallback() {
    if (this._config && !this._rendered) {
      this._render();
    }
  }

  disconnectedCallback() {
    // Clean up click handler
    if (this._clickHandler && this.shadowRoot) {
      const card = this.shadowRoot.querySelector('ha-card');
      if (card) {
        card.removeEventListener('click', this._clickHandler);
      }
    }
  }

  setConfig(raw) {
    this._config = buildConfig(raw);
    if (this._rendered) {
      // Re-render si la config change (ex: depuis l'éditeur)
      this._rendered = false;
      this._render();
    }
  }
  
  getCardSize()  { return 1; }

  set hass(hass) {
    this._hass = hass;
    // Ne rendre qu'une seule fois — pas besoin de re-render sur chaque
    // update hass car cette card ne dépend d'aucune entité
    if (!this._rendered) this._render();
  }

  // Charge Google Fonts si besoin (avec préconnexion pour performance)
  _loadFont(family) {
    if (!family || this._fontLoaded.has(family)) return;
    const id = `nhc-font-${family.replace(/\s/g, '-')}`;
    if (document.getElementById(id)) { 
      this._fontLoaded.add(family); 
      return; 
    }

    // Préconnexion pour meilleures performances
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect);

    const preconnectStatic = document.createElement('link');
    preconnectStatic.rel = 'preconnect';
    preconnectStatic.href = 'https://fonts.gstatic.com';
    preconnectStatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectStatic);

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

  _moreInfo(entityId) {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _render() {
    const c = this._config;
    if (!c) return;

    this._loadFont(c.font_family);

    // ── Valeurs calculées ─────────────────────────────
    const hasIcon    = !!c.icon;
    const hasSub     = !!c.subtitle;
    const iconLeft   = c.icon_position === 'left';
    const iconRight  = c.icon_position === 'right';
    const iconTop    = c.icon_position === 'top';

    const textColor   = c.color        || 'var(--ha-card-header-color, var(--primary-text-color))';
    const iconColor   = c.icon_color   || textColor;
    const fontFamily  = c.font_family  ? `'${c.font_family}', var(--primary-font-family, sans-serif)` : 'var(--primary-font-family, var(--ha-card-header-font-family, sans-serif))';
    const fontSize    = c.font_size    || 'var(--ha-card-header-font-size, 24px)';
    const fontSizeSub = c.font_size_sub || '13px';
    const fontWeight  = c.font_weight  || 'var(--ha-card-header-font-weight, 500)';
    const iconSize    = c.icon_size    || `calc(${c.font_size || '24px'} * 1.2)`;
    const padding     = c.padding      || 'var(--ha-card-header-padding, 12px 16px)';
    const minHeight   = c.min_height   || 'auto';
    const letterSpacing = c.letter_spacing || 'normal';
    const glowColor   = c.effect_glow_color || textColor;
    const glowSize    = c.effect_glow_size  || 12;
    const gradFrom    = c.effect_gradient_from || 'var(--primary-color, #00E8FF)';
    const gradTo      = c.effect_gradient_to   || 'var(--accent-color, #FF50A0)';

    // ── bg : seulement si configuré explicitement ─────
    let bgStyle = '';
    if (c.bg_color) {
      // Convertit hex en rgba pour supporter l'opacité
      const hex = c.bg_color.startsWith('#') ? c.bg_color.replace('#','') : null;
      if (hex && hex.length === 6) {
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        const op = c.bg_opacity ?? 1;
        bgStyle = `background: rgba(${r},${g},${b},${op});`;
      } else {
        bgStyle = `background: ${c.bg_color};`;
        if (c.bg_opacity != null) bgStyle += ` opacity: ${c.bg_opacity};`;
      }
    } else if (c.bg_opacity != null) {
      // Opacité seule sans couleur : on teinte le fond du thème
      bgStyle = `background: rgba(var(--rgb-card-background-color, 255,255,255), ${c.bg_opacity});`;
    }
    // Sinon : rien → ha-card garde son fond de thème intact

    const blurVal = c.bg_blur === true ? '8px'
      : (c.bg_blur && c.bg_blur !== false && c.bg_blur !== '0') ? `${c.bg_blur}${String(c.bg_blur).includes('px') ? '' : 'px'}` : '';
    const hasBlur = !!blurVal;

    // Bordure : seulement si au moins un paramètre est défini
    const hasBorder = !!(c.border_color || c.border_width || c.border_style !== 'solid');
    const borderStyle = hasBorder
      ? `border: ${c.border_width || '1px'} ${c.border_style || 'solid'} ${c.border_color || 'var(--divider-color)'};`
      : '';

    // Border-radius : seulement si explicitement défini
    const borderRadiusStyle = c.border_radius ? `border-radius: ${c.border_radius};` : '';

    // Box-shadow glow : en plus du shadow du thème
    const glowBoxShadow = c.effect_glow
      ? `box-shadow: var(--ha-card-box-shadow, none), 0 0 ${glowSize*2}px ${glowColor}44;`
      : '';

    // ── Glow text-shadow ──────────────────────────────
    const glowShadow = c.effect_glow
      ? `text-shadow: 0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize*2}px ${glowColor}55;`
      : '';

    // ── Gradient texte ────────────────────────────────
    const gradientCSS = c.effect_gradient ? `
      background: linear-gradient(90deg, ${gradFrom}, ${gradTo});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    ` : '';

    // ── Flicker animation ──────────────────────────────
    const flickerAnim = c.effect_flicker ? 'animation: flicker 4s ease-in-out infinite;' : '';

    // ── Layout direction ──────────────────────────────
    let wrapDirection = 'row';
    let wrapAlign = 'center';
    if (iconTop) { wrapDirection = 'column'; }
    if (iconRight) { wrapDirection = 'row-reverse'; }

    const alignItems = {
      top:    'flex-start',
      center: 'center',
      bottom: 'flex-end',
    }[c.align_v] || 'center';

    const justifyContent = {
      left:   'flex-start',
      center: 'center',
      right:  'flex-end',
    }[c.align_h] || 'flex-start';

    const interactive = c.tap_action !== 'none';

    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          display: block;
          contain: layout style paint;
        }
        
        .header, .header *, .icon-wrap, .text-wrap, .title, .subtitle, .scanlines, .dots {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        /* GPU-accelerated animations */
        @keyframes flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
          20%,24%,55% { opacity: .6; }
        }
        
        @keyframes scanMove {
          0%   { transform: translateY(-4px); }
          100% { transform: translateY(calc(100% + 4px)); }
        }

        /* Glitch hover animations */
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
          0%, 100% { 
            transform: scale(1) rotate(0deg) translateZ(0);
          }
          20% { 
            transform: scale(1.15) rotate(-12deg) translateZ(0);
          }
          40% { 
            transform: scale(1.2) rotate(12deg) translateZ(0);
          }
          60% { 
            transform: scale(1.15) rotate(-8deg) translateZ(0);
          }
          80% { 
            transform: scale(1.08) rotate(5deg) translateZ(0);
          }
        }

        @keyframes textGlitch {
          0%, 100% { 
            transform: translate(0, 0) translateZ(0);
          }
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

        /* Scanline overlay - optimized for GPU */
        .scanlines {
          display: ${c.effect_scanline ? 'block' : 'none'};
          position: absolute; 
          inset: 0; 
          pointer-events: none; 
          z-index: 1;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
          border-radius: inherit;
          will-change: auto;
        }
        
        .scanlines::after {
          content: '';
          position: absolute; 
          left: 0; 
          right: 0; 
          height: 4px; 
          background: linear-gradient(transparent, rgba(255,255,255,.12), transparent);
          animation: scanMove 5s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        /* Wrapper principal */
        ha-card {
          contain: layout style paint;
          transform: translateZ(0);
          ${c.effect_hover_glitch ? 'transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
        }

        ${c.effect_hover_glitch ? `
        ha-card:hover {
          transform: translateY(-8px) scale(1.02) translateZ(0);
          animation: cardGlitch 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ` : ''}

        .header {
          display: flex;
          flex-direction: ${wrapDirection};
          align-items: ${alignItems};
          justify-content: ${justifyContent};
          gap: ${iconTop ? '6px' : '10px'};
          padding: ${padding};
          min-height: ${minHeight};
          position: relative;
          contain: layout style paint;
        }

        /* Icône */
        .icon-wrap {
          display: ${hasIcon ? 'flex' : 'none'};
          align-items: center; 
          justify-content: center;
          flex-shrink: 0;
          transform: translateZ(0);
        }
        
        ha-icon {
          --mdc-icon-size: ${iconSize};
          color: ${iconColor};
          ${c.effect_glow && !c.effect_hover_glitch ? `filter: drop-shadow(0 0 ${Math.round(glowSize*0.7)}px ${glowColor});` : ''}
          ${c.effect_flicker && !c.effect_hover_glitch ? 'animation: flicker 4s ease-in-out infinite .3s;' : ''}
          transform: translateZ(0);
          ${c.effect_hover_glitch ? 'transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
        }

        ${c.effect_hover_glitch ? `
        ha-card:hover ha-icon {
          animation: iconGlitch 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ` : ''}

        /* Textes */
        .text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: ${c.align_h};
          ${iconTop ? 'align-items: center; text-align: center;' : ''}
          contain: layout style paint;
        }
        
        .title {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          font-weight: ${fontWeight};
          ${c.italic ? 'font-style: italic;' : ''}
          ${c.uppercase ? 'text-transform: uppercase;' : ''}
          letter-spacing: ${letterSpacing};
          line-height: 1.2;
          ${gradientCSS || `color: ${textColor};`}
          ${!c.effect_hover_glitch ? glowShadow : ''}
          ${!c.effect_hover_glitch ? flickerAnim : ''}
          transform: translateZ(0);
          ${c.effect_hover_glitch ? 'transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
        }

        ${c.effect_hover_glitch ? `
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
          ${c.uppercase ? 'text-transform: uppercase; letter-spacing: calc(${letterSpacing} + 1px);' : ''}
          ${c.italic ? 'font-style: italic;' : ''}
          transform: translateZ(0);
        }
      </style>

      <ha-card style="${[
        bgStyle,
        borderStyle,
        borderRadiusStyle,
        hasBlur ? `backdrop-filter:blur(${blurVal});-webkit-backdrop-filter:blur(${blurVal})` : '',
        glowBoxShadow,
        interactive ? 'cursor:pointer' : '',
      ].filter(Boolean).join(';')}">
        <div class="scanlines"></div>
        <div class="header">
          <div class="icon-wrap">
            <ha-icon icon="${c.icon || ''}"></ha-icon>
          </div>
          <div class="text-wrap">
            <div class="title">${c.title || ''}</div>
            <div class="subtitle">${c.subtitle || ''}</div>
          </div>
        </div>
      </ha-card>
    `;

    // Click handler with proper cleanup
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
  }
}

customElements.define('neon-header-card', NeonHeaderCard);

// ── Banner console ────────────────────────────────────────────
console.info(
  '%c NEON-HEADER-CARD %c v' + VERSION + ' (Optimized) ',
  'color:#00E8FF;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF50A0;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:0 3px 3px 0',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'neon-header-card',
  name:             'Neon Header Card',
  description:      'Card de header customisable pour Home Assistant (Performance Optimized)',
  preview:          true,
  documentationURL: 'https://github.com/',
});
