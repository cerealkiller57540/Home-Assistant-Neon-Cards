/**
 * Neon Entities Card — Neo Tokyo UV
 * Multi-entity: switch, binary_sensor, cover, sensor, number, climate + dividers
 * Header & footer fully configurable
 * @version 1.2.1
 */

console.log('neon-entities-card.js loaded!');

if (!document.getElementById('neon-entities-font')) {
  const l = document.createElement('link');
  l.id = 'neon-entities-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
  document.head.appendChild(l);
}

// ─── Device Detection ────────────────────────────────────────────────────────
const ENT_IS_IPAD    = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const ENT_IS_ANDROID = /Android/.test(navigator.userAgent);
const ENT_IS_LOW_POWER = ENT_IS_IPAD || navigator.hardwareConcurrency <= 4;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SVG = {
  up:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><polyline points="18 15 12 9 6 15"/></svg>`,
  stop: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  down: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><polyline points="6 9 12 15 18 9"/></svg>`,
};

const DOMAIN_ICONS = {
  switch:       'mdi:toggle-switch',
  input_boolean:'mdi:toggle-switch-outline',
  automation:   'mdi:robot',
  light:        'mdi:lightbulb',
  binary_sensor:'mdi:circle-outline',
  cover:        'mdi:window-shutter',
  sensor:       'mdi:eye',
  number:       'mdi:numeric',
  input_number: 'mdi:numeric',
  climate:      'mdi:thermostat',
  lock:         'mdi:lock',
  fan:          'mdi:fan',
  media_player: 'mdi:speaker',
};

function binaryLabel(deviceClass, on) {
  const map = {
    door:         [on ? 'OUVERT'       : 'FERMÉ'],
    window:       [on ? 'OUVERT'       : 'FERMÉ'],
    garage_door:  [on ? 'OUVERT'       : 'FERMÉ'],
    opening:      [on ? 'OUVERT'       : 'FERMÉ'],
    lock:         [on ? 'DÉVERR.'      : 'VERR.'],
    motion:       [on ? 'DÉTECTÉ'      : 'LIBRE'],
    presence:     [on ? 'PRÉSENCE'     : 'ABSENT'],
    occupancy:    [on ? 'OCCUPÉ'       : 'LIBRE'],
    connectivity: [on ? 'CONNECTÉ'     : 'HORS LIGNE'],
    smoke:        [on ? 'FUMÉE'        : 'OK'],
    moisture:     [on ? 'HUMIDE'       : 'SEC'],
    plug:         [on ? 'BRANCHÉ'      : 'DÉBRANCHÉ'],
    battery:      [on ? 'FAIBLE'       : 'OK'],
    vibration:    [on ? 'VIBRATION'    : 'CALME'],
    tamper:       [on ? 'ALTÉRÉ'       : 'OK'],
  };
  return map[deviceClass]?.[0] ?? (on ? 'ACTIF' : 'INACTIF');
}

function stateLabel(state) {
  const m = {
    open:'OUVERT', closed:'FERMÉ', opening:'OUVERTURE...', closing:'FERMETURE...',
    on:'ON', off:'OFF', heating:'CHAUFFE', cooling:'REFROID.', idle:'VEILLE',
    heat:'CHAUFFE', cool:'REFROID.', auto:'AUTO', heat_cool:'AUTO',
    unavailable:'INDISPO', unknown:'INCONNU', 'above_horizon':'JOUR', 'below_horizon':'NUIT',
  };
  return m[state] ?? state.toUpperCase();
}

// ─── Card ─────────────────────────────────────────────────────────────────────
class NeonEntitiesCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass   = null;
    this._config = {};
    this._ac     = null; // AbortController — cleanup listeners on rebuild/disconnect
    this._impulseTimers = new Set();
  }

  setConfig(config) {
    this._config = {
      entities:       config.entities       || [],
      header:         config.header         !== undefined ? config.header : {},
      footer:         config.footer         !== undefined ? config.footer : {},
      use_theme_card: config.use_theme_card ?? false,
      color_primary:  config.color_primary  || null,
      color_accent:   config.color_accent   || null,
      name_color:     config.name_color     || null,
      value_color:    config.value_color    || null,
    };
    this._build();
  }

  static getConfigElement() { return document.createElement('neon-entities-card-editor'); }
  static getStubConfig() {
    return {
      header: { title: 'Maison', icon: 'mdi:home' },
      footer: { enabled: true, text: 'MAISON · NEO ENTITIES CARD' },
      entities: [
        { entity: 'switch.portail',    name: 'Portail',  icon: 'mdi:gate' },
        { entity: 'binary_sensor.xxx', name: 'Capteur portail' },
        { type: 'divider' },
        { entity: 'cover.volet_salon', name: 'Volet salon', secondary_info: 'state' },
      ],
    };
  }

  getCardSize() {
    const n = (this._config.entities || []).filter(e => e.type !== 'divider').length;
    return Math.ceil(n * 0.55) + 2;
  }

  set hass(hass) {
    this._hass = hass;
    // Rebuild si le shadowRoot a été vidé (ex: reconnexion après mode edit)
    if (!this.shadowRoot.querySelector('ha-card')) {
      this._build();
      return;
    }
    this._update();
  }

  // ── Styles ─────────────────────────────────────────────────────────────────

  _css() {
    const cfg = this._config;
    const hdr = (cfg.header && typeof cfg.header === 'object') ? cfg.header : {};

    const colorPrimary = cfg.color_primary || 'var(--primary-color, #6200EA)';
    const colorAccent  = cfg.color_accent  || 'var(--accent-color, #00fff9)';
    const titleColor  = hdr.color      || 'rgba(180,130,255,0.55)';
    const nameColorOn  = cfg.name_color  || 'rgba(200,170,255,0.75)';
    const nameColorOff = cfg.name_color  ? cfg.name_color.replace(/[\d.]+\)$/, v => (parseFloat(v)*0.3).toFixed(2)+')') : 'rgba(180,130,255,0.55)';
    const valueColor   = cfg.value_color || 'rgba(var(--nec-cy), 0.75)';
    const titleSize   = hdr.title_size || 'clamp(7px, 2vw, 9px)';
    const titleFont   = hdr.font       ? `'${hdr.font}', ` : "'Orbitron', ";

    const cardBg = cfg.use_theme_card ? `
      background: var(--ha-card-background);
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, rgba(var(--nec-uv), 0.45));
      box-shadow: var(--ha-card-box-shadow, 0 8px 32px rgba(0,0,0,0.55));
      backdrop-filter: var(--ha-card-backdrop-filter, blur(var(--blur-strength, 20px)) saturate(160%));
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(var(--blur-strength, 20px)) saturate(160%));
    ` : `
      background: rgba(10,6,30,0.82);
      border: 1px solid rgba(var(--nec-uv), 0.45);
      backdrop-filter: blur(var(--blur-strength, 20px)) saturate(160%);
      -webkit-backdrop-filter: blur(var(--blur-strength, 20px)) saturate(160%);
      box-shadow:
        0 0 0 1px rgba(var(--nec-bl), 0.06),
        0 8px 32px rgba(0,0,0,0.55),
        0 0 40px rgba(var(--nec-uv), 0.10),
        inset 0 1px 0 rgba(255,255,255,0.05);
    `;

    return `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

      :host {
        display: block;
        font-family: 'Orbitron', var(--primary-font-family, system-ui, sans-serif);
        border-radius: var(--ha-card-border-radius, 18px);
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        --nec-p:  ${colorPrimary};
        --nec-a:  ${colorAccent};
        --nec-uv: var(--rgb-primary-color, 98,0,234);
        --nec-cy: var(--rgb-accent-color, 0,255,249);
        --nec-bl: var(--rgb-blacklight-color, 180,0,255);
      }

      ha-card {
        border-radius: var(--ha-card-border-radius, 18px);
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        ${cardBg}
      }

      ${!cfg.use_theme_card ? `
      ha-card::after {
        content: '';
        position: absolute;
        top: -50px; left: -50px;
        width: 180px; height: 180px;
        background: radial-gradient(circle, rgba(var(--nec-uv),0.16) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
      }` : ''}

      .inner { position: relative; z-index: 1; }

      /* ── Header ── */
      .hdr {
        display: flex; align-items: center; gap: 8px;
        padding: 11px 14px 8px;
        container-type: inline-size;
      }
      .hdr-icon { display: flex; align-items: center; flex-shrink: 0; }
      .hdr-icon ha-icon {
        --mdc-icon-size: ${hdr.title_size ? hdr.title_size : 'clamp(6px, 2.6cqi, 11px)'};
        color: ${titleColor};
        filter: drop-shadow(0 0 8px color-mix(in srgb, currentColor, transparent 10%));
      }
      .hdr-title {
        flex: 1 1 auto;
        font-family: ${titleFont}var(--primary-font-family, system-ui);
        font-size: ${hdr.title_size ? hdr.title_size : 'clamp(6px, 2.6cqi, 11px)'};
        padding-left: 8px;
        white-space: normal;
        overflow: visible;
        text-overflow: unset;
        min-width: 0;
        color: ${titleColor};
        letter-spacing: clamp(1px, 0.5cqi, 3px);
        text-transform: uppercase;
        text-shadow: ${hdr.title_shadow || '0 0 8px color-mix(in srgb, currentColor, transparent 30%)'};
        line-height: 1.2;
      }

      /* ── Dividers ── */
      .main-div {
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--nec-p) 55%, transparent), color-mix(in srgb, var(--nec-a) 25%, transparent), transparent);
        margin: 0 14px;
      }
      .sect-div {
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--nec-p) 25%, transparent), color-mix(in srgb, var(--nec-a) 10%, transparent), transparent);
        margin: 2px 14px;
      }

      /* ── Row ── */
      .row {
        display: flex; align-items: center; gap: 10px;
        padding: 7px 14px;
        position: relative;
        border-top: 1px solid rgba(var(--nec-uv),0.08);
        transition: background .2s;
      }
    .row.on::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5%;
      bottom: 5%;
      width: 3px;
      /* On utilise le Plasma Ultraviolet (#310062) et le Plasma Void (#9D00FF) */
      background: linear-gradient(to bottom, 
        #310062, 
        #9D00FF 50%, 
        #120021
      );
      border-radius: 0 3px 3px 0;
      /* Shadow "Trou Noir" : une lueur violette très sombre (Argon) avec un cœur électrique très fin */
      box-shadow: 
        0 0 12px #7B2FBE,                /* Gas Argon pour le rayonnement */
        inset -1px 0 2px #B9F2FF;        /* Plasma Electric : un liseré de foudre pour la définition */
      opacity: 0.9;
      border-right: 1px solid #7B2FBE;
      z-index: 2;
    }

    /* On assombrit aussi légèrement le fond de la ligne active pour le contraste */
    .row.on {
      background: rgba(18, 0, 33, 0.4) !important; /* Dark Actinoid en transparence */
      border-left: 1px solid #310062;
    }
      .row:hover { background: rgba(var(--nec-uv),0.05) !important; }

      /* ── Icon ── */
      .ico {
        width: 28px; height: 28px; border-radius: 7px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all .3s;
      }
      .row.on  .ico { background: rgba(var(--nec-uv),0.18); border: 1px solid rgba(var(--nec-uv),0.40); box-shadow: 0 0 6px rgba(var(--nec-uv),0.25), inset 0 0 4px rgba(var(--nec-uv),0.10); }
      .row.off .ico { background: rgba(var(--nec-uv),0.05); border: 1px solid rgba(var(--nec-uv),0.15); }
      .ico ha-icon { --mdc-icon-size: 14px; transition: color .3s, filter .3s; }
      .row.on  .ico ha-icon { color: rgba(180,130,255,0.9); filter: drop-shadow(0 0 3px rgba(180,130,255,0.7)) drop-shadow(0 0 6px rgba(180,130,255,0.35)); }
      .row.off .ico ha-icon { color: rgba(130,60,255,0.30); }

      /* ── Meta ── */
      .meta { flex: 1; min-width: 0; }
      .meta-label {
        font-size: clamp(6px, 1.5vw, 7px);
        letter-spacing: 1.8px;
        margin-bottom: 1px;
        text-transform: uppercase;
      }
      .row.on  .meta-label { color: rgba(180,130,255,0.7); }
      .row.off .meta-label { color: rgba(var(--nec-uv),0.4); }
      .meta-name {
        font-size: clamp(9px, 2.5vw, 11px);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .row.on  .meta-name { color: ${nameColorOn}; }
      .row.off .meta-name { color: ${nameColorOff}; }
      .state-label {
        font-size: 6.5px;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin-top: 1px;
        color: rgba(var(--nec-cy),0.40);
      }

      /* ── Toggle (switch / light / boolean) ── */
      .tog {
        width: 38px; height: 22px; border-radius: 11px;
        position: relative; cursor: pointer; flex-shrink: 0;
        transition: all .3s;
        -webkit-tap-highlight-color: transparent;
      }
      .tog.on  { background: color-mix(in srgb, var(--nec-p) 32%, transparent); border: 1px solid color-mix(in srgb, var(--nec-p) 85%, transparent); box-shadow: 0 0 8px color-mix(in srgb, var(--nec-p) 40%, transparent); }
      .tog.off { background: rgba(var(--nec-uv),0.10); border: 1px solid rgba(var(--nec-uv),0.45); }
      .tog-thumb {
        position: absolute; top: 2px;
        width: 16px; height: 16px; border-radius: 50%;
        transition: all .3s;
      }
      .tog.on  .tog-thumb { right: 2px; background: linear-gradient(135deg, var(--nec-a), var(--nec-p)); box-shadow: 0 0 8px color-mix(in srgb, var(--nec-p) 90%, transparent); }
      .tog.off .tog-thumb { left: 2px; background: rgba(130,60,255,0.50); }
      .tog.on  .tog-thumb { transform: translateX(0); }
      .tog.active { transform: scale(0.92); filter: brightness(1.25); }

      /* ── Binary sensor badge ── */
      .badge {
        font-size: clamp(6.5px, 1.8vw, 8px);
        padding: 2px 7px; border-radius: 4px;
        letter-spacing: .8px; text-transform: uppercase;
        flex-shrink: 0; white-space: nowrap;
      }
      .badge.active   { background: rgba(255,60,60,0.10); color: rgba(255,120,100,0.90); border: 1px solid rgba(255,60,60,0.28); }
      .badge.inactive { background: rgba(var(--nec-cy),0.07); color: rgba(var(--nec-cy),0.55);   border: 1px solid rgba(var(--nec-cy),0.20); }

      /* ── Cover ── */
      .cover-wrap { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
      .pos-pct  { font-size: clamp(8px,2vw,10px); color: rgba(180,130,255,0.65); min-width: 26px; text-align: right; }
      .pos-bar  { width: 36px; height: 3px; border-radius: 2px; background: rgba(var(--nec-uv),0.15); flex-shrink: 0; }
      .pos-fill { height: 100%; background: linear-gradient(90deg, var(--nec-p), var(--nec-a)); border-radius: 2px; transition: width .5s; }
      .cbtn {
        width: 22px; height: 22px; border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(var(--nec-uv),0.35);
        background: rgba(var(--nec-uv),0.10);
        cursor: pointer; -webkit-tap-highlight-color: transparent;
        transition: background .15s;
      }
      .cbtn:hover  { background: rgba(var(--nec-uv),0.22); box-shadow: 0 0 8px rgba(var(--nec-uv),0.30); }
      .cbtn:active { background: rgba(var(--nec-uv),0.36); }
      .cbtn svg { width: 10px; height: 10px; stroke: rgba(180,130,255,0.80); filter: drop-shadow(0 0 2px rgba(180,130,255,0.6)); }
      .row.off .cbtn { border-color: rgba(var(--nec-uv),0.18); background: rgba(var(--nec-uv),0.34); }
      .row.off .cbtn svg { stroke: rgba(130,60,255,0.30); filter: none; }

      /* ── Sensor value ── */
      .sensor-val {
        font-size: clamp(8px, 2vw, 10px);
        color: ${valueColor};
        padding: 2px 7px; border-radius: 4px;
        background: rgba(var(--nec-cy),0.06);
        border: 1px solid rgba(var(--nec-cy),0.18);
        flex-shrink: 0;
        letter-spacing: .5px;
        max-width: 110px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      /* ── Number / Climate ── */
      .num-wrap { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .num-val {
        font-size: clamp(9px, 2.5vw, 11px); font-weight: 700;
        min-width: 36px; text-align: center; letter-spacing: .5px;
      }
      .num-val.def  { color: rgba(180,130,255,0.85); }
      .num-val.temp { color: rgba(255,180,80,0.85); }
      .nbtn {
        width: 20px; height: 20px; border-radius: 4px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(var(--nec-uv),0.35);
        background: rgba(var(--nec-uv),0.10);
        cursor: pointer; font-size: 14px; line-height: 1;
        color: rgba(180,130,255,0.75);
        -webkit-tap-highlight-color: transparent;
        transition: background .15s, box-shadow .15s; user-select: none;
        text-shadow: 0 0 4px rgba(180,130,255,0.6);
      }
      .nbtn:hover  { background: rgba(var(--nec-uv),0.22); box-shadow: 0 0 8px rgba(var(--nec-uv),0.30); }
      .nbtn:active { background: rgba(var(--nec-uv),0.36); }

      /* ── Footer ── */
      .footer {
        padding: 6px 14px 9px;
        display: flex; align-items: center; gap: 6px;
        border-top: 1px solid rgba(var(--nec-uv),0.10);
        background: rgba(var(--nec-uv),0.03);
        margin-top: 2px;
      }
      .footer-text {
        font-size: clamp(6px, 1.5vw, 7px);
        color: rgba(180,130,255,0.28);
        letter-spacing: 1px;
      }
    `;
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  _build() {
    // Annule tous les listeners précédents avant rebuild
    if (this._ac) this._ac.abort();
    this._ac = new AbortController();
    const sig = this._ac.signal;

    const cfg = this._config;
    const hdr = cfg.header;
    const ftr = cfg.footer;

    const showHeader = hdr !== false && !(typeof hdr === 'object' && hdr.enabled === false);
    const showFooter = ftr !== false && !(typeof ftr === 'object' && ftr.enabled === false);

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <ha-card>
        <div class="inner">
          ${showHeader ? this._tplHeader() : ''}
          ${showHeader ? '<div class="main-div"></div>' : ''}
          <div class="entities-list"></div>
          ${showFooter ? `
          <div class="footer">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--nec-uv),0.5)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="footer-text footer-content"></span>
          </div>` : ''}
        </div>
      </ha-card>
    `;

    this._renderEntities(sig);
    if (this._hass) this._update();
  }

  _tplHeader() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    const icon  = hdr.icon  || '';
    const title = hdr.title || '';
    return `
      <div class="hdr">
        ${icon  ? `<div class="hdr-icon"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
        ${title ? `<span class="hdr-title">${title}</span>` : ''}
      </div>`;
  }

  // ── Render rows ─────────────────────────────────────────────────────────────

  _renderEntities(sig) {
    const list = this.shadowRoot.querySelector('.entities-list');
    if (!list) return;
    list.innerHTML = '';

    (this._config.entities || []).forEach((item, i) => {
      if (item.type === 'divider') {
        const d = document.createElement('div');
        d.className = 'sect-div';
        list.appendChild(d);
        return;
      }

      const domain = (item.entity || '').split('.')[0];
      const row    = document.createElement('div');
      row.className    = (ENT_IS_ANDROID || domain === 'binary_sensor') ? 'row on' : 'row off';
      row.dataset.index  = i;
      row.dataset.entity = item.entity || '';
      row.dataset.domain = domain;

      const label = (item.label || this._domainLabel(domain)).toUpperCase();
      const name  = item.name || item.entity || '';
      const icon  = item.icon || DOMAIN_ICONS[domain] || 'mdi:help-circle-outline';

      row.innerHTML = `
        <div class="ico"><ha-icon icon="${icon}"></ha-icon></div>
        <div class="meta">
          <div class="meta-label">${label}</div>
          <div class="meta-name">${name}</div>
          ${item.secondary_info === 'state' ? `<div class="state-label"></div>` : ''}
        </div>
        <div class="ctrl"></div>
      `;

      this._buildControl(row, item, domain, sig);
      list.appendChild(row);
    });
  }

  _domainLabel(domain) {
    const m = {
      switch:'SWITCH', input_boolean:'SWITCH', automation:'AUTOMATION',
      light:'LUMIÈRE', binary_sensor:'CAPTEUR', cover:'VOLET / STORE',
      sensor:'CAPTEUR', number:'VALEUR', input_number:'VALEUR',
      climate:'CLIMATE', lock:'VERROU', fan:'VENTILATEUR', media_player:'LECTEUR',
    };
    return m[domain] || domain.replace('_', ' ');
  }

  _buildControl(row, item, domain, sig) {
    const ctrl = row.querySelector('.ctrl');
    const opts = sig ? { signal: sig } : {};

    switch (domain) {
      case 'switch':
      case 'input_boolean':
      case 'automation':
      case 'light': {
        const tog = document.createElement('div');
        tog.className = 'tog off';
        tog.innerHTML = '<div class="tog-thumb"></div>';
        tog.addEventListener('click', e => {
          e.stopPropagation();
          if (!this._hass || !item.entity) return;
          const st = this._hass.states[item.entity];
          if (!st) return;
          const eDomain   = item.entity.split('.')[0];
          const svcDomain = eDomain === 'light'      ? 'light'
                          : eDomain === 'automation' ? 'automation'
                          : eDomain === 'input_boolean' ? 'input_boolean'
                          : 'switch';
          if (item.tap_action === 'impulse') {
            const delay = item.impulse_duration ?? 500;
            // Feedback visuel : toggle ON pendant la durée de l'impulsion
            tog.classList.remove('off');
            tog.classList.add('on', 'active');
            this._hass.callService(svcDomain, 'turn_on', { entity_id: item.entity });
            const t = setTimeout(() => {
              this._hass.callService(svcDomain, 'turn_off', { entity_id: item.entity });
              tog.classList.remove('on', 'active');
              tog.classList.add('off');
              this._impulseTimers.delete(t);
            }, delay);
            this._impulseTimers.add(t);
          } else {
            tog.classList.add('active');
            this._hass.callService(svcDomain, st.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: item.entity });
            setTimeout(() => tog.classList.remove('active'), 200);
          }
        });
        ctrl.appendChild(tog);
        break;
      }

      case 'binary_sensor': {
        const b = document.createElement('span');
        b.className = 'badge inactive';
        b.textContent = '—';
        ctrl.appendChild(b);
        break;
      }

      case 'cover': {
        const wrap = document.createElement('div');
        wrap.className = 'cover-wrap';
        wrap.innerHTML = `
          <span class="pos-pct">—</span>
          <div class="pos-bar"><div class="pos-fill" style="width:0%"></div></div>
          <div class="cbtn cbtn-open">${SVG.up}</div>
          <div class="cbtn cbtn-stop">${SVG.stop}</div>
          <div class="cbtn cbtn-close">${SVG.down}</div>
        `;
        wrap.querySelector('.cbtn-open' ).addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'open_cover',  item.entity); }, opts);
        wrap.querySelector('.cbtn-stop' ).addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'stop_cover',  item.entity); }, opts);
        wrap.querySelector('.cbtn-close').addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'close_cover', item.entity); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      case 'sensor': {
        const v = document.createElement('span');
        v.className = 'sensor-val'; v.textContent = '—';
        ctrl.appendChild(v);
        break;
      }

      case 'number':
      case 'input_number': {
        const wrap = document.createElement('div');
        wrap.className = 'num-wrap';
        wrap.innerHTML = `
          <div class="nbtn nbtn-dec">−</div>
          <span class="num-val def">—</span>
          <div class="nbtn nbtn-inc">+</div>
        `;
        wrap.querySelector('.nbtn-dec').addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, -1); }, opts);
        wrap.querySelector('.nbtn-inc').addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, +1); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      case 'climate': {
        const wrap = document.createElement('div');
        wrap.className = 'num-wrap';
        wrap.innerHTML = `
          <div class="nbtn nbtn-dec">−</div>
          <span class="num-val temp">—</span>
          <div class="nbtn nbtn-inc">+</div>
        `;
        wrap.querySelector('.nbtn-dec').addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, -1); }, opts);
        wrap.querySelector('.nbtn-inc').addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, +1); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      default: {
        // Fallback: afficher state brut
        const v = document.createElement('span');
        v.className = 'sensor-val'; v.textContent = '—';
        ctrl.appendChild(v);
        break;
      }
    }
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  _update() {
    if (!this._hass) return;
    const sr = this.shadowRoot;
    if (!sr.querySelector('.entities-list')) return;

    // footer
    const fc = sr.querySelector('.footer-content');
    if (fc) {
      const ftr = this._config.footer;
      const ftxt = (ftr && typeof ftr === 'object' && ftr.text)
        ? ftr.text
        : ((this._config.header?.title || 'NEO') + ' · NEO ENTITIES CARD').toUpperCase();
      fc.textContent = ftxt;
    }

    sr.querySelectorAll('.row[data-entity]').forEach(row => {
      const entityId = row.dataset.entity;
      const domain   = row.dataset.domain;
      const idx      = parseInt(row.dataset.index);
      const item     = this._config.entities[idx];
      if (!item || !entityId) return;

      const st = this._hass.states[entityId];
      if (!st) { if (!ENT_IS_ANDROID) { row.classList.add('off'); row.classList.remove('on'); } return; }

      const on = this._isOn(domain, st);
      const rowOn = ENT_IS_ANDROID || domain === 'binary_sensor' ? true : on;
      row.classList.toggle('on',  rowOn);
      row.classList.toggle('off', !rowOn);

      // secondary_info state label
      const sl = row.querySelector('.state-label');
      if (sl) sl.textContent = stateLabel(st.state);

      // icone: config > attribut HA > device_class > domaine
      if (!item.icon) {
        const haIcon = row.querySelector('.ico ha-icon');
        if (haIcon) {
          const dcIconMap = {
            temperature:'mdi:thermometer', humidity:'mdi:water-percent',
            pressure:'mdi:gauge', illuminance:'mdi:brightness-5',
            battery:'mdi:battery', power:'mdi:flash', energy:'mdi:lightning-bolt',
            voltage:'mdi:sine-wave', current:'mdi:current-ac',
            co2:'mdi:molecule-co2', pm25:'mdi:air-filter', pm10:'mdi:air-filter',
            moisture:'mdi:water-percent', distance:'mdi:ruler',
            speed:'mdi:speedometer', wind_speed:'mdi:weather-windy',
            precipitation:'mdi:weather-rainy', uv_index:'mdi:sun-wireless',
            door:'mdi:door', window:'mdi:window-open', garage_door:'mdi:garage',
            motion:'mdi:motion-sensor', presence:'mdi:account',
            occupancy:'mdi:account', connectivity:'mdi:wifi',
            smoke:'mdi:smoke-detector', lock:'mdi:lock',
          };
          const dc = st.attributes.device_class || '';
          const resolved = st.attributes.icon || dcIconMap[dc] || null;
          if (resolved) haIcon.setAttribute('icon', resolved);
        }
      }

      // label dynamique sensor (device_class)
      if (domain === 'sensor' && !item.label) {
        const ml = row.querySelector('.meta-label');
        if (ml) {
          const dcMap = {
            temperature:'TEMPERATURE', humidity:'HUMIDITE', pressure:'PRESSION',
            illuminance:'LUMINOSITE', battery:'BATTERIE', power:'PUISSANCE',
            energy:'ENERGIE', voltage:'TENSION', current:'COURANT',
            co2:'CO2', pm25:'PM2.5', pm10:'PM10', moisture:'HUMIDITE',
            distance:'DISTANCE', speed:'VITESSE', wind_speed:'VENT',
            precipitation:'PRECIPITATIONS', uv_index:'UV',
          };
          const dc = st.attributes.device_class || '';
          ml.textContent = dcMap[dc] || dc.replace('_',' ').toUpperCase() || 'CAPTEUR';
        }
      }

      this._updateControl(row, domain, st, item);
    });
  }

  _isOn(domain, st) {
    switch (domain) {
      case 'cover':   return st.state !== 'unavailable';
      case 'sensor':  return st.state !== 'unavailable' && st.state !== 'unknown';
      case 'number':
      case 'input_number':
      case 'climate': return st.state !== 'unavailable' && st.state !== 'unknown';
      default:        return st.state === 'on';
    }
  }

  _updateControl(row, domain, st, item) {
    switch (domain) {
      case 'switch':
      case 'input_boolean':
      case 'automation':
      case 'light': {
        const tog = row.querySelector('.tog');
        if (!tog) return;
        // Ne pas écraser pendant une impulsion en cours
        if (tog.classList.contains('active')) break;
        const on = st.state === 'on';
        tog.classList.toggle('on', on); tog.classList.toggle('off', !on);
        break;
      }
      case 'binary_sensor': {
        const b = row.querySelector('.badge');
        if (!b) return;
        const on = st.state === 'on';
        b.className   = 'badge ' + (on ? 'active' : 'inactive');
        b.textContent = binaryLabel(st.attributes.device_class || '', on);
        const ml = row.querySelector('.meta-label');
        if (ml && !this._config.entities[parseInt(row.dataset.index)]?.label) {
          const dcMap = {
            door:'PORTE', window:'FENETRE', garage_door:'PORTE GARAGE',
            opening:'OUVERTURE', motion:'MOUVEMENT', presence:'PRESENCE',
            occupancy:'OCCUPATION', connectivity:'CONNEXION', smoke:'FUMEE',
            moisture:'HUMIDITE', vibration:'VIBRATION', lock:'VERROU',
            plug:'PRISE', battery:'BATTERIE', tamper:'ALTERATION',
          };
          const dc = st.attributes.device_class || '';
          ml.textContent = dcMap[dc] || dc.replace('_',' ').toUpperCase() || 'CAPTEUR';
        }
        break;
      }
      case 'cover': {
        const pct  = row.querySelector('.pos-pct');
        const fill = row.querySelector('.pos-fill');
        if (!pct || !fill) return;
        const pos = st.attributes.current_position ?? null;
        if (pos !== null) {
          pct.textContent  = pos + '%';
          fill.style.width = pos + '%';
        } else {
          pct.textContent  = stateLabel(st.state).substring(0, 6);
          fill.style.width = '0%';
        }
        break;
      }
      case 'sensor': {
        const v = row.querySelector('.sensor-val');
        if (!v) return;
        const unit = st.attributes.unit_of_measurement || '';
        const raw  = parseFloat(st.state);
        const display = isNaN(raw) ? st.state : raw.toFixed(Math.min(item.decimal_places ?? 1, 6));
        v.textContent = display + (unit ? '\u202F' + unit : '');
        break;
      }
      case 'number':
      case 'input_number': {
        const v = row.querySelector('.num-val');
        if (!v) return;
        const raw  = parseFloat(st.state);
        const unit = st.attributes.unit_of_measurement || '';
        const step = parseFloat(st.attributes.step) || 1;
        // display with same decimals as step
        const dec  = (step % 1 !== 0) ? String(step).split('.')[1].length : 0;
        v.textContent = (isNaN(raw) ? '—' : raw.toFixed(dec)) + (unit ? '\u202F' + unit : '');
        break;
      }
      case 'climate': {
        const v = row.querySelector('.num-val');
        if (!v) return;
        const setpt = st.attributes.temperature ?? st.attributes.target_temp_low;
        const unit  = st.attributes.temperature_unit || '°';
        const step  = parseFloat(st.attributes.target_temp_step) || 1;
        const dec   = (step % 1 !== 0) ? String(step).split('.')[1].length : 0;
        v.textContent = setpt != null ? parseFloat(setpt).toFixed(dec) + unit : '—';
        break;
      }
      default: {
        const v = row.querySelector('.sensor-val');
        if (!v) return;
        const unit = st.attributes.unit_of_measurement || '';
        v.textContent = st.state + (unit ? '\u202F' + unit : '');
        break;
      }
    }
  }

  // ── Service helpers ─────────────────────────────────────────────────────────

  _svc(domain, service, entityId) {
    if (!this._hass || !entityId) return;
    this._hass.callService(domain, service, { entity_id: entityId });
  }

  _stepNumber(entityId, dir) {
    if (!this._hass || !entityId) return;
    const st   = this._hass.states[entityId];
    if (!st) return;
    const cur  = parseFloat(st.state);
    const step = parseFloat(st.attributes.step) || 1;
    const min  = parseFloat(st.attributes.min  ?? -Infinity);
    const max  = parseFloat(st.attributes.max  ??  Infinity);
    const dec  = (step % 1 !== 0) ? String(step).split('.')[1].length : 0;
    const val  = parseFloat(Math.min(max, Math.max(min, cur + dir * step)).toFixed(dec));
    this._hass.callService('number', 'set_value', { entity_id: entityId, value: val });
  }

  _stepClimate(entityId, dir) {
    if (!this._hass || !entityId) return;
    const st   = this._hass.states[entityId];
    if (!st) return;
    const cur  = parseFloat(st.attributes.temperature ?? st.attributes.target_temp_low ?? 20);
    const step = parseFloat(st.attributes.target_temp_step) || 1;
    const min  = parseFloat(st.attributes.min_temp ?? 7);
    const max  = parseFloat(st.attributes.max_temp ?? 35);
    const dec  = (step % 1 !== 0) ? String(step).split('.')[1].length : 0;
    const val  = parseFloat(Math.min(max, Math.max(min, cur + dir * step)).toFixed(dec));
    this._hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: val });
  }

  disconnectedCallback() {
    this._impulseTimers.forEach(t => clearTimeout(t));
    this._impulseTimers.clear();
    if (this._ac) { this._ac.abort(); this._ac = null; }
  }

  connectedCallback() {
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    if (!card) return;
    // Re-create AbortController and re-attach signal-based listeners
    if (!this._ac) {
      this._ac = new AbortController();
      const sig = this._ac.signal;
      const opts = { signal: sig };
      this.shadowRoot.querySelectorAll('.row[data-entity]').forEach(row => {
        const idx = parseInt(row.dataset.index);
        const item = this._config.entities[idx];
        if (!item) return;
        const domain = row.dataset.domain;
        if (domain === 'cover') {
          const open  = row.querySelector('.cbtn-open');
          const stop  = row.querySelector('.cbtn-stop');
          const close = row.querySelector('.cbtn-close');
          if (open)  open.addEventListener('click',  e => { e.stopPropagation(); this._svc('cover', 'open_cover',  item.entity); }, opts);
          if (stop)  stop.addEventListener('click',  e => { e.stopPropagation(); this._svc('cover', 'stop_cover',  item.entity); }, opts);
          if (close) close.addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'close_cover', item.entity); }, opts);
        } else if (domain === 'number' || domain === 'input_number') {
          const dec = row.querySelector('.nbtn-dec');
          const inc = row.querySelector('.nbtn-inc');
          if (dec) dec.addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, -1); }, opts);
          if (inc) inc.addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, +1); }, opts);
        } else if (domain === 'climate') {
          const dec = row.querySelector('.nbtn-dec');
          const inc = row.querySelector('.nbtn-inc');
          if (dec) dec.addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, -1); }, opts);
          if (inc) inc.addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, +1); }, opts);
        }
      });
    }
    if (this._hass) this._update();
  }
}

// ─── Editor ───────────────────────────────────────────────────────────────────
class NeonEntitiesCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._built = false; }

  setConfig(c) { this._config = { ...c, entities: c.entities ? [...c.entities] : [] }; if (!this._built) this._render(); }
  set hass(h)  { this._hass = h; if (!this._built) this._render(); else this._fillSelects(); }
  disconnectedCallback() { this.innerHTML = ''; this._built = false; }

  _render() {
    this._built = true;
    this.innerHTML = '';
    this.style.cssText = 'display:block;padding:16px;font-family:var(--primary-font-family,Roboto,sans-serif);';

    const style = document.createElement('style');
    style.textContent = `
      .sec { font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px; }
      .row { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px; }
      .row label { font-size:13px;color:var(--primary-text-color);flex:1; }
      input[type=text],select { font-size:12px;padding:5px 8px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);outline:none; }
      select { cursor:pointer; min-width:140px; }
      input[type=text] { min-width:130px; }
      input[type=color] { width:38px;height:28px;padding:0;border-radius:4px;cursor:pointer; }
      .block { border:1px solid var(--divider-color,#eee);border-radius:8px;padding:10px 12px;margin-bottom:8px;position:relative; }
      .block-title { font-size:11px;font-weight:700;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:8px; }
      .del-btn { position:absolute;top:8px;right:8px;background:none;border:none;color:var(--error-color,#e53935);cursor:pointer;font-size:18px;padding:0;line-height:1; }
      .add-btn { font-size:12px;padding:6px 12px;border:1px dashed var(--primary-color);border-radius:6px;cursor:pointer;background:none;color:var(--primary-color);margin-right:6px;margin-top:4px; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 6px; }
      .divider-block { border:1px dashed var(--divider-color,#ccc);border-radius:6px;padding:6px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;color:var(--secondary-text-color);font-size:12px; }
    `;
    this.appendChild(style);

    const c = this._config;

    // ── Header
    this._sec('Entête');
    const hdr = c.header || {};
    this._toggle('header_enabled', 'Afficher entête', hdr.enabled !== false);
    this._textRow('header.title',      'Titre',       hdr.title      || '', 'ex: Maison');
    this._textRow('header.icon',       'Icône (mdi)', hdr.icon       || '', 'mdi:home');
    this._textRow('header.color',      'Couleur titre', hdr.color    || '', 'rgba(180,130,255,0.55)');
    this._textRow('header.title_size', 'Taille titre', hdr.title_size|| '', 'clamp(7px,2vw,9px)');
    this._textRow('header.font',       'Police',      hdr.font       || '', 'Orbitron');
    this._textRow('header.title_shadow','Text shadow', hdr.title_shadow|| '', '0 0 8px rgba(0,212,255,0.7)');

    // ── Apparence
    this._sec('Apparence');
    this._textRow('name_color',   'Couleur des noms',    c.name_color   || '', 'rgba(200,170,255,0.75)');
    this._textRow('value_color',  'Couleur des valeurs', c.value_color  || '', 'rgba(0,255,249,0.75)');
    this._textRow('color_primary','Couleur primaire',    c.color_primary|| '', '#6200EA');
    this._textRow('color_accent', 'Couleur accent',      c.color_accent || '', '#00fff9');

    // ── Footer
    this._sec('Pied de page');
    const ftr = c.footer || {};
    this._toggle('footer_enabled', 'Afficher pied', ftr.enabled !== false);
    this._textRow('footer.text', 'Texte', ftr.text || '', 'MAISON · NEO ENTITIES CARD');

    // ── Entities
    this._sec('Entités');
    this._hint('Entités et séparateurs dans l\'ordre souhaité.');
    this._renderEntityBlocks();

    // Boutons ajout
    const addEnt = document.createElement('button');
    addEnt.className = 'add-btn';
    addEnt.textContent = '+ Entité';
    addEnt.addEventListener('click', () => {
      this._config.entities.push({ entity: '' });
      this._dispatch(); this._render();
    });
    const addDiv = document.createElement('button');
    addDiv.className = 'add-btn';
    addDiv.textContent = '+ Séparateur';
    addDiv.addEventListener('click', () => {
      this._config.entities.push({ type: 'divider' });
      this._dispatch(); this._render();
    });
    this.appendChild(addEnt);
    this.appendChild(addDiv);

    // ── Options
    this._sec('Options');
    this._toggle('use_theme_card', 'Hériter du card-mod thème', c.use_theme_card ?? false);

    this._fillSelects();
  }

  _renderEntityBlocks() {
    const ents = this._config.entities || [];
    ents.forEach((item, i) => {
      if (item.type === 'divider') {
        const div = document.createElement('div');
        div.className = 'divider-block';
        div.innerHTML = `<span>— Séparateur —</span>`;
        const del = document.createElement('button');
        del.className = 'del-btn'; del.innerHTML = '×';
        del.addEventListener('click', () => { this._config.entities.splice(i, 1); this._dispatch(); this._render(); });
        div.appendChild(del);
        this.appendChild(div);
        return;
      }

      const block = document.createElement('div');
      block.className = 'block';
      const title = document.createElement('div');
      title.className = 'block-title';
      title.textContent = `Entité ${i + 1}`;
      block.appendChild(title);

      const del = document.createElement('button');
      del.className = 'del-btn'; del.innerHTML = '×';
      del.addEventListener('click', () => { this._config.entities.splice(i, 1); this._dispatch(); this._render(); });
      block.appendChild(del);

      this._entityRow(block, i, 'entity',         'Entité *',        item.entity         || '', 'entity');
      this._entityRow(block, i, 'name',            'Nom affiché',     item.name           || '', null, 'friendly name');
      this._entityRow(block, i, 'icon',            'Icône (mdi:...)', item.icon           || '', null, 'mdi:home');
      this._entityRow(block, i, 'label',           'Label (ligne 1)', item.label          || '', null, 'SWITCH');
      this._entityRow(block, i, 'secondary_info',  'Info secondaire', item.secondary_info || '', null, 'state ou vide');
      this._entityRow(block, i, 'decimal_places',  'Décimales',       item.decimal_places ?? '', null, '1');

      this.appendChild(block);
    });
  }

  _entityRow(parent, idx, field, label, value, prefix, placeholder='') {
    const row  = document.createElement('div'); row.className = 'row';
    const lbl  = document.createElement('label'); lbl.textContent = label;
    if (prefix) {
      const sel = document.createElement('select');
      sel.dataset.entIdx   = idx;
      sel.dataset.entField = field;
      const ph = document.createElement('option'); ph.value = ''; ph.textContent = '— sélectionner —';
      if (!value) ph.selected = true;
      sel.appendChild(ph);
      sel.addEventListener('change', e => this._setEnt(idx, field, e.target.value || undefined));
      row.appendChild(lbl); row.appendChild(sel);
    } else {
      const inp = document.createElement('input'); inp.type = 'text'; inp.value = value; inp.placeholder = placeholder;
      inp.addEventListener('change', e => this._setEnt(idx, field, e.target.value || undefined));
      row.appendChild(lbl); row.appendChild(inp);
    }
    parent.appendChild(row);
  }

  _sec(t)  { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); }
  _hint(t) { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); }

  _textRow(key, label, value, placeholder='') {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const inp = document.createElement('input'); inp.type = 'text'; inp.value = value; inp.placeholder = placeholder;
    inp.addEventListener('change', e => this._setNested(key, e.target.value || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _toggle(key, label, checked) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const cb  = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!checked;
    cb.style.cssText = 'width:36px;height:20px;cursor:pointer;accent-color:var(--primary-color,#6200EA);flex-shrink:0;';
    cb.addEventListener('change', e => this._setNested(key, e.target.checked));
    row.appendChild(lbl); row.appendChild(cb); this.appendChild(row);
  }

  _fillSelects() {
    if (!this._hass) return;
    this.querySelectorAll('select[data-ent-idx]').forEach(sel => {
      const idx   = parseInt(sel.dataset.entIdx);
      const field = sel.dataset.entField;
      const cur   = this._config.entities[idx]?.[field] || '';
      while (sel.options.length > 1) sel.remove(1);
      Object.keys(this._hass.states).sort().forEach(id => {
        const o = document.createElement('option');
        o.value = id; o.textContent = id; o.selected = (id === cur);
        sel.appendChild(o);
      });
    });
  }

  _setNested(path, value) {
    // supports: header.title, footer.text, header_enabled, footer_enabled, use_theme_card
    if (path === 'header_enabled') {
      this._config.header = { ...(this._config.header || {}), enabled: value };
    } else if (path === 'footer_enabled') {
      this._config.footer = { ...(this._config.footer || {}), enabled: value };
    } else if (path.startsWith('header.')) {
      const k = path.replace('header.', '');
      this._config.header = { ...(this._config.header || {}), [k]: value };
    } else if (path.startsWith('footer.')) {
      const k = path.replace('footer.', '');
      this._config.footer = { ...(this._config.footer || {}), [k]: value };
    } else {
      if (value === undefined || value === '') delete this._config[path];
      else this._config[path] = value;
    }
    this._dispatch();
  }

  _setEnt(idx, field, value) {
    const ents  = [...(this._config.entities || [])];
    let v = value;
    if (field === 'decimal_places' && v !== undefined) {
      const n = parseInt(v); v = isNaN(n) ? undefined : n;
    }
    ents[idx]   = { ...(ents[idx] || {}), [field]: v };
    if (v === undefined) delete ents[idx][field];
    this._config = { ...this._config, entities: ents };
    this._dispatch();
  }

  _dispatch() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true, composed: true,
    }));
  }
}

// ─── Registration ─────────────────────────────────────────────────────────────
customElements.define('neon-entities-card-editor', NeonEntitiesCardEditor);
customElements.define('neon-entities-card',        NeonEntitiesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'neon-entities-card',
  name:        'Neon Entities Card',
  description: 'Multi-entités Neo Tokyo UV — switch, binary_sensor, cover, sensor, number, climate',
  preview:     true,
});

console.info('%c NEON-ENTITIES-CARD %c v1.3.2 ', 'color:#6200EA;font-weight:bold;background:#040816', 'color:#fff;background:#444');

console.info(
  '%c 📋 neon-entities-card v1.3.2 %c Neo Tokyo ',
  'background:#6200EA;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#BB86FC;padding:2px 4px;border-radius:0 3px 3px 0;'
);
