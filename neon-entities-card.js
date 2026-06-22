/**
 * Neon Entities Card — Neo Tokyo UV
 * Multi-entity: switch, binary_sensor, cover, sensor, number, climate + dividers
 * Header & footer fully configurable
 * Clic sur la valeur d'une entité → ouvre le more-info natif HA
 * FX opt-in : pulse du liseré actif, flash de la valeur au changement
 * meta-label (type d'entité) masquable → nom plus lisible sur petit écran
 * Tailles en cqi (container-query) calées sur la card → OK iPad paysage / colonnes
 * Éditeur : re-render intelligent (UI↔YAML synchro, focus préservé en frappe)
 * value_glow : glow « alarm-like » sur valeurs + statuts (actif par défaut)
 * Boutons cover agrandis (34px, SVG 16px) → cible tactile confortable iPad
 * Couleurs : variables standard HA (primary-text-color / primary-color),
 *   thème-agnostique + surcharge UI (name/value/icon/primary/accent)
 * @version 1.8.0
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
// inclut l'app HA Companion (userAgent ≠ Safari) + low CPU. Coût des anims × nb d'entités.
const ENT_IS_LOW_POWER = ENT_IS_IPAD || navigator.hardwareConcurrency <= 4
  || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

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
    if (ENT_IS_LOW_POWER) this.classList.add('low-power');  // coupe le décoratif en boucle (×nb entités) sur iPad/mobile
    this._config = {
      entities:       config.entities       || [],
      header:         config.header         !== undefined ? config.header : {},
      footer:         config.footer         !== undefined ? config.footer : {},
      use_theme_card: config.use_theme_card ?? false,
      color_primary:  config.color_primary  || null,
      color_accent:   config.color_accent   || null,
      name_color:     config.name_color     || null,
      value_color:    config.value_color    || null,
      icon_color:     config.icon_color     || null,
      pulse_active:    config.pulse_active    ?? true,
      flash_on_change: config.flash_on_change ?? false,
      show_label:      config.show_label      ?? false,
      value_glow:      config.value_glow      ?? true,
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
    const titleColor  = hdr.color      || 'rgba(var(--rgb-primary-text-color),0.55)';
    const nameColorOn  = cfg.name_color  || 'rgba(var(--rgb-primary-text-color),0.75)';
    const nameColorOff = cfg.name_color  ? cfg.name_color.replace(/[\d.]+\)$/, v => (parseFloat(v)*0.3).toFixed(2)+')') : 'rgba(var(--rgb-primary-text-color),0.30)';
    const valueColor   = cfg.value_color || 'rgba(var(--nec-cy), 0.75)';
    const iconColor    = cfg.icon_color  || colorPrimary;
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
        --nec-val: ${valueColor};
        --nec-ico: ${iconColor};
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

      /* Container global : toutes les tailles cqi du corps se calent sur la
         largeur de la CARD (et non du viewport) → correct en iPad paysage,
         colonnes étroites et sections. Le .hdr garde son propre container. */
      .inner { position: relative; z-index: 1; container-type: inline-size; }

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
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--nec-p) 55%, transparent), color-mix(in srgb, var(--nec-a) 45%, transparent), color-mix(in srgb, var(--nec-p) 55%, transparent), transparent);
        background-size: 200% 100%;
        animation: nec-div-flow 7s linear infinite;
        margin: 0 14px;
      }
      @media (prefers-reduced-motion: reduce) { .main-div { animation: none; } }
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
      /* Liseré dérivé de la couleur primaire (sombre → vif → très sombre) */
      background: linear-gradient(to bottom,
        color-mix(in srgb, var(--nec-p) 35%, #000),
        var(--nec-p) 50%,
        color-mix(in srgb, var(--nec-p) 20%, #000)
      );
      border-radius: 0 3px 3px 0;
      /* Shadow "Trou Noir" : rayonnement primaire + cœur électrique accent */
      box-shadow:
        0 0 12px color-mix(in srgb, var(--nec-p) 75%, transparent),       /* rayonnement primaire */
        inset -1px 0 2px color-mix(in srgb, var(--nec-a) 70%, #fff);      /* liseré de foudre (accent) */
      opacity: 0.9;
      border-right: 1px solid color-mix(in srgb, var(--nec-p) 70%, transparent);
      z-index: 2;
    }

    /* On assombrit aussi légèrement le fond de la ligne active pour le contraste */
    .row.on {
      background: rgba(18, 0, 33, 0.4) !important; /* Dark Actinoid en transparence */
      border-left: 1px solid color-mix(in srgb, var(--nec-p) 35%, #000);
    }
      .row:hover { background: rgba(var(--nec-uv),0.05) !important; }
      @media (hover: hover) and (prefers-reduced-motion: no-preference) {
        .row:hover::after {
          content: '';
          position: absolute; top: 0; bottom: 0; width: 60px;
          background: linear-gradient(100deg, transparent, rgba(var(--nec-cy),0.07), transparent);
          animation: nec-row-sweep .7s ease-out forwards;
          pointer-events: none;
        }
      }
      @keyframes nec-row-sweep { from { left: -70px; } to { left: 110%; } }
      @keyframes nec-div-flow  { from { background-position: 0% 0; } to { background-position: 200% 0; } }

      /* ── FX (1) Pulse du liseré actif — opt-in ── */
      ${cfg.pulse_active ? `
      .row.on::before { animation: nec-edge-pulse 2.6s ease-in-out infinite; }
      @keyframes nec-edge-pulse {
        0%,100% { opacity: .72; box-shadow: 0 0 8px  color-mix(in srgb, var(--nec-p) 70%, transparent), inset -1px 0 2px color-mix(in srgb, var(--nec-a) 70%, #fff); }
        50%     { opacity: 1;   box-shadow: 0 0 16px var(--nec-p),                                        inset -1px 0 3px color-mix(in srgb, var(--nec-a) 70%, #fff); }
      }
      @media (prefers-reduced-motion: reduce) { .row.on::before { animation: none; } }
      ` : ''}

      /* ── FX (3) Flash de la valeur au changement — opt-in (classe posée en JS) ── */
      .sensor-val.nec-flash, .num-val.nec-flash { animation: nec-val-flash .55s ease-out; }
      @keyframes nec-val-flash {
        0%   { background: rgba(var(--nec-cy),0.55); color: #eafffe;
               box-shadow: 0 0 14px rgba(var(--nec-cy),0.7); }
        100% { background: rgba(var(--nec-cy),0.06); color: var(--nec-val);
               box-shadow: none; }
      }
      @media (prefers-reduced-motion: reduce) { .nec-flash { animation: none; } }

      /* ── Icon ── */
      .ico {
        width: 28px; height: 28px; border-radius: 7px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all .3s;
      }
      .row.on  .ico { background: color-mix(in srgb, var(--nec-ico) 18%, transparent); border: 1px solid color-mix(in srgb, var(--nec-ico) 40%, transparent); box-shadow: 0 0 6px color-mix(in srgb, var(--nec-ico) 25%, transparent), inset 0 0 4px color-mix(in srgb, var(--nec-ico) 10%, transparent); }
      .row.off .ico { background: color-mix(in srgb, var(--nec-ico) 5%, transparent); border: 1px solid color-mix(in srgb, var(--nec-ico) 15%, transparent); }
      .ico ha-icon { --mdc-icon-size: 14px; transition: color .3s, filter .3s; }
      .row.on  .ico ha-icon { color: color-mix(in srgb, var(--nec-ico) 90%, transparent); filter: drop-shadow(0 0 3px color-mix(in srgb, var(--nec-ico) 70%, transparent)) drop-shadow(0 0 6px color-mix(in srgb, var(--nec-ico) 35%, transparent)); }
      .row.off .ico ha-icon { color: color-mix(in srgb, var(--nec-ico) 30%, transparent); }

      /* ── Meta ── */
      .meta { flex: 1; min-width: 0; }
      .meta-label {
        font-size: clamp(6px, 1.5cqi, 7px);
        letter-spacing: 1.8px;
        margin-bottom: 1px;
        text-transform: uppercase;
        ${cfg.show_label ? '' : 'display: none;'}
      }
      .row.on  .meta-label { color: rgba(var(--rgb-primary-text-color),0.7); }
      .row.off .meta-label { color: rgba(var(--nec-uv),0.4); }
      .meta-name {
        font-size: clamp(9px, 2.5cqi, 11px);
        letter-spacing: 0.8px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      ${cfg.show_label ? '' : `
      /* Label masqué → le nom prend la place libérée (plus lisible sur petit écran) */
      .meta-name { font-size: clamp(10px, 2.8cqi, 12.5px); line-height: 1.15; }
      `}
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
      .tog.on {
        background: linear-gradient(90deg,
          color-mix(in srgb, var(--nec-p) 55%, transparent),
          color-mix(in srgb, var(--nec-a) 30%, transparent),
          rgba(157,0,255,0.55),
          color-mix(in srgb, var(--nec-p) 55%, transparent));
        background-size: 300% 100%;
        animation: nec-plasma 3.5s linear infinite;
        border: 1px solid color-mix(in srgb, var(--nec-p) 85%, transparent);
        box-shadow: 0 0 8px color-mix(in srgb, var(--nec-p) 40%, transparent);
      }
      @keyframes nec-plasma { from { background-position: 0% 0; } to { background-position: 300% 0; } }
      @media (prefers-reduced-motion: reduce) { .tog.on { animation: none; } }
      .tog.off { background: rgba(var(--nec-uv),0.10); border: 1px solid rgba(var(--nec-uv),0.45); }
      .tog-thumb {
        position: absolute; top: 2px;
        width: 16px; height: 16px; border-radius: 50%;
        transition: all .3s;
        box-sizing: border-box;
      }
      .tog.on  .tog-thumb { right: 2px; background: linear-gradient(135deg, var(--nec-a), var(--nec-p)); box-shadow: 0 0 8px color-mix(in srgb, var(--nec-p) 90%, transparent); }
      .tog.on  .tog-thumb::after {
        content: '';
        position: absolute; inset: 5px; border-radius: 50%;
        background: #fff; box-shadow: 0 0 6px #d9fffe; opacity: .9;
      }
      .tog.off .tog-thumb { left: 2px; background: transparent; border: 2px solid rgba(var(--rgb-primary-color),0.50); }
      .tog.on  .tog-thumb { transform: translateX(0); }
      .tog.active { transform: scale(0.92); filter: brightness(1.25); }

      /* ── Status fusionné (status_entity) ── */
      .status-slot { display: flex; align-items: center; flex-shrink: 0; }

      /* ── Binary sensor badge ── */
      .badge {
        font-size: clamp(8px, 2cqi, 9.5px);
        font-weight: 600;
        padding: 2px 7px; border-radius: 4px;
        letter-spacing: .8px; text-transform: uppercase;
        flex-shrink: 0; white-space: nowrap;
      }
      .badge.active   { background: rgba(255,60,60,0.10); color: rgba(255,120,100,0.90); border: 1px solid rgba(255,60,60,0.28); }
      .badge.inactive { background: rgba(var(--nec-cy),0.07); color: rgba(var(--nec-cy),0.55);   border: 1px solid rgba(var(--nec-cy),0.20); }

      /* ── Cover ── */
      .cover-wrap { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
      .pos-pct  { font-size: clamp(10px,2.4cqi,12px); font-weight: 600; color: rgba(var(--rgb-primary-text-color),0.65); min-width: 26px; text-align: right; }
      .pos-bar  { width: 44px; height: 5px; display: flex; gap: 2px; flex-shrink: 0; }
      .pos-seg  { flex: 1; height: 100%; border-radius: 1px; background: rgba(var(--nec-uv),0.15); transition: background .35s, box-shadow .35s; }
      .pos-seg.lit {
        background: linear-gradient(180deg, var(--nec-a), var(--nec-p));
        box-shadow: 0 0 4px rgba(var(--nec-cy),0.5);
      }
      .cbtn {
        width: 34px; height: 34px; border-radius: 7px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(var(--nec-uv),0.35);
        background: rgba(var(--nec-uv),0.10);
        cursor: pointer; -webkit-tap-highlight-color: transparent;
        transition: background .15s;
      }
      .cbtn:hover  { background: rgba(var(--nec-uv),0.22); box-shadow: 0 0 8px rgba(var(--nec-uv),0.30); }
      .cbtn:active { background: rgba(var(--nec-uv),0.36); }
      .cbtn svg { width: 16px; height: 16px; stroke: rgba(var(--rgb-primary-color),0.80); filter: drop-shadow(0 0 2px rgba(var(--rgb-primary-color),0.6)); }
      .row.off .cbtn { border-color: rgba(var(--nec-uv),0.18); background: rgba(var(--nec-uv),0.34); }
      .row.off .cbtn svg { stroke: rgba(var(--rgb-primary-color),0.30); filter: none; }

      /* ── Sensor value ── */
      .sensor-val {
        font-size: clamp(10px, 2.4cqi, 12px);
        font-weight: 600;
        color: ${valueColor};
        padding: 2px 7px; border-radius: 4px;
        background: rgba(var(--nec-cy),0.06);
        border: 1px solid rgba(var(--nec-cy),0.18);
        flex-shrink: 0;
        letter-spacing: 0.8px;
        max-width: 110px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      /* ── More-info (clic sur la valeur) ── */
      .clickable {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: filter .15s, text-shadow .15s;
      }
      .clickable:hover {
        filter: brightness(1.25);
        text-shadow: 0 0 6px color-mix(in srgb, currentColor, transparent 30%);
      }
      .clickable:active { filter: brightness(0.9); }

      /* ── Glow « alarm-like » — opt-in (value_glow) ──
         Importé de la sonos-alarm-card : valeur + statuts rayonnent. */
      ${cfg.value_glow ? `
      /* valeur sensor / number / climate / cover% */
      .sensor-val, .num-val, .pos-pct {
        color: var(--nec-val);
        text-shadow: 0 0 12px color-mix(in srgb, var(--nec-p) 80%, transparent),
                     0 0 24px color-mix(in srgb, var(--nec-a) 45%, transparent);
      }
      .sensor-val { background: transparent; border-color: transparent; }
      /* statut : badge binary_sensor */
      .badge.inactive {
        text-shadow: 0 0 8px rgba(var(--nec-cy),0.7), 0 0 16px rgba(var(--nec-cy),0.3);
        box-shadow: 0 0 10px rgba(var(--nec-cy),0.22);
      }
      .badge.active {
        text-shadow: 0 0 8px rgba(255,80,60,0.9), 0 0 16px rgba(255,40,40,0.4);
        box-shadow: 0 0 12px rgba(255,60,60,0.32);
      }
      /* statut : état texte cover (secondary_info: state) */
      .state-label {
        color: #bfeeff;
        text-shadow: 0 0 8px color-mix(in srgb, var(--nec-p) 70%, transparent),
                     0 0 16px color-mix(in srgb, var(--nec-a) 30%, transparent);
      }
      /* statut : toggle ON rayonne plus fort */
      .tog.on {
        box-shadow: 0 0 10px color-mix(in srgb, var(--nec-p) 70%, transparent),
                    0 0 20px color-mix(in srgb, var(--nec-a) 35%, transparent);
      }
      .tog.on .tog-thumb {
        box-shadow: 0 0 10px color-mix(in srgb, var(--nec-p) 95%, transparent),
                    0 0 18px color-mix(in srgb, var(--nec-a) 50%, transparent);
      }
      ` : ''}

      /* ── Number / Climate ── */
      .num-wrap { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .num-val {
        font-size: clamp(9px, 2.5cqi, 11px); font-weight: 700;
        min-width: 36px; text-align: center; letter-spacing: 0.8px;
      }
      .num-val.def  { color: rgba(var(--rgb-primary-text-color),0.85); }
      .num-val.temp { color: rgba(255,180,80,0.85); }
      .nbtn {
        width: 20px; height: 20px; border-radius: 4px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(var(--nec-uv),0.35);
        background: rgba(var(--nec-uv),0.10);
        cursor: pointer; font-size: 14px; line-height: 1;
        color: rgba(var(--rgb-primary-color),0.75);
        -webkit-tap-highlight-color: transparent;
        transition: background .15s, box-shadow .15s; user-select: none;
        text-shadow: 0 0 4px rgba(var(--rgb-primary-color),0.6);
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
        font-size: clamp(6px, 1.5cqi, 7px);
        color: rgba(var(--rgb-primary-text-color),0.28);
        letter-spacing: 1px;
      }

      /* iPad/mobile : coût des anims × nb d'entités. On COUPE le décoratif en boucle
         (divider qui coule, plasma du toggle, pulse du liseré, sweep au survol) mais
         on GARDE le liseré actif affiché (fixe) + les couleurs/glow statiques. */
      :host(.low-power) .main-div { animation: none; }
      :host(.low-power) .tog.on { animation: none; }
      :host(.low-power) .row.on::before { animation: none; }
      :host(.low-power) .row:hover::after { display: none; }
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

      // status_entity : fusionne une 2e entité (capteur associé) sur la même
      // ligne — badge si binary_sensor, chip valeur sinon. Ex : switch porte
      // de garage + binary_sensor FERMÉ/OUVERT.
      const statusDom = item.status_entity ? item.status_entity.split('.')[0] : '';
      const statusSlot = item.status_entity
        ? `<div class="status-slot">${statusDom === 'binary_sensor'
            ? '<div class="badge inactive"></div>'
            : '<span class="sensor-val clickable status-val"></span>'}</div>`
        : '';

      row.innerHTML = `
        <div class="ico"><ha-icon icon="${icon}"></ha-icon></div>
        <div class="meta">
          <div class="meta-label">${label}</div>
          <div class="meta-name">${name}</div>
          ${item.secondary_info === 'state' ? `<div class="state-label"></div>` : ''}
        </div>
        ${statusSlot}
        <div class="ctrl"></div>
      `;

      if (item.status_entity) {
        const sv = row.querySelector('.status-val');
        if (sv) sv.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.status_entity); }, { signal: sig });
        const sb = row.querySelector('.status-slot .badge');
        if (sb) { sb.classList.add('clickable'); sb.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.status_entity); }, { signal: sig }); }
      }

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
        b.className = 'badge inactive clickable';
        b.textContent = '—';
        b.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        ctrl.appendChild(b);
        break;
      }

      case 'cover': {
        const wrap = document.createElement('div');
        wrap.className = 'cover-wrap';
        wrap.innerHTML = `
          <span class="pos-pct clickable">—</span>
          <div class="pos-bar clickable"><div class="pos-seg"></div><div class="pos-seg"></div><div class="pos-seg"></div><div class="pos-seg"></div><div class="pos-seg"></div></div>
          <div class="cbtn cbtn-open">${SVG.up}</div>
          <div class="cbtn cbtn-stop">${SVG.stop}</div>
          <div class="cbtn cbtn-close">${SVG.down}</div>
        `;
        wrap.querySelector('.cbtn-open' ).addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'open_cover',  item.entity); }, opts);
        wrap.querySelector('.cbtn-stop' ).addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'stop_cover',  item.entity); }, opts);
        wrap.querySelector('.cbtn-close').addEventListener('click', e => { e.stopPropagation(); this._svc('cover', 'close_cover', item.entity); }, opts);
        wrap.querySelector('.pos-pct').addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        wrap.querySelector('.pos-bar').addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      case 'sensor': {
        const v = document.createElement('span');
        v.className = 'sensor-val clickable'; v.textContent = '—';
        v.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        ctrl.appendChild(v);
        break;
      }

      case 'number':
      case 'input_number': {
        const wrap = document.createElement('div');
        wrap.className = 'num-wrap';
        wrap.innerHTML = `
          <div class="nbtn nbtn-dec">−</div>
          <span class="num-val def clickable">—</span>
          <div class="nbtn nbtn-inc">+</div>
        `;
        wrap.querySelector('.nbtn-dec').addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, -1); }, opts);
        wrap.querySelector('.nbtn-inc').addEventListener('click', e => { e.stopPropagation(); this._stepNumber(item.entity, +1); }, opts);
        wrap.querySelector('.num-val').addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      case 'climate': {
        const wrap = document.createElement('div');
        wrap.className = 'num-wrap';
        wrap.innerHTML = `
          <div class="nbtn nbtn-dec">−</div>
          <span class="num-val temp clickable">—</span>
          <div class="nbtn nbtn-inc">+</div>
        `;
        wrap.querySelector('.nbtn-dec').addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, -1); }, opts);
        wrap.querySelector('.nbtn-inc').addEventListener('click', e => { e.stopPropagation(); this._stepClimate(item.entity, +1); }, opts);
        wrap.querySelector('.num-val').addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
        ctrl.appendChild(wrap);
        break;
      }

      default: {
        // Fallback: afficher state brut
        const v = document.createElement('span');
        v.className = 'sensor-val clickable'; v.textContent = '—';
        v.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts);
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

      // status_entity fusionné sur la ligne
      if (item.status_entity) {
        const sst = this._hass.states[item.status_entity];
        const slot = row.querySelector('.status-slot');
        if (slot && sst) {
          const sdom = item.status_entity.split('.')[0];
          if (sdom === 'binary_sensor') {
            const sb = slot.querySelector('.badge');
            if (sb) {
              const son = sst.state === 'on';
              sb.className = 'badge clickable ' + (son ? 'active' : 'inactive');
              sb.textContent = binaryLabel(sst.attributes.device_class || '', son);
            }
          } else {
            const sv = slot.querySelector('.status-val');
            if (sv) {
              const unit = sst.attributes.unit_of_measurement || '';
              const raw  = parseFloat(sst.state);
              const disp = isNaN(raw) ? stateLabel(sst.state) : raw.toFixed(Math.min(item.status_decimal_places ?? 1, 6));
              this._setVal(sv, disp + (unit ? '\u202F' + unit : ''));
            }
          }
        }
      }

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
        const b = row.querySelector('.ctrl .badge');
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
        const segs = row.querySelectorAll('.pos-seg');
        if (!pct || !segs.length) return;
        const pos = st.attributes.current_position ?? null;
        const lit = pos !== null ? Math.round(pos / 100 * segs.length) : 0;
        segs.forEach((sg, k) => sg.classList.toggle('lit', k < lit));
        pct.textContent = pos !== null ? pos + '%' : stateLabel(st.state).substring(0, 6);
        break;
      }
      case 'sensor': {
        const v = row.querySelector('.sensor-val');
        if (!v) return;
        const unit = st.attributes.unit_of_measurement || '';
        const raw  = parseFloat(st.state);
        const display = isNaN(raw) ? st.state : raw.toFixed(Math.min(item.decimal_places ?? 1, 6));
        this._setVal(v, display + (unit ? '\u202F' + unit : ''));
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
        this._setVal(v, (isNaN(raw) ? '—' : raw.toFixed(dec)) + (unit ? '\u202F' + unit : ''));
        break;
      }
      case 'climate': {
        const v = row.querySelector('.num-val');
        if (!v) return;
        const setpt = st.attributes.temperature ?? st.attributes.target_temp_low;
        const unit  = st.attributes.temperature_unit || '°';
        const step  = parseFloat(st.attributes.target_temp_step) || 1;
        const dec   = (step % 1 !== 0) ? String(step).split('.')[1].length : 0;
        this._setVal(v, setpt != null ? parseFloat(setpt).toFixed(dec) + unit : '—');
        break;
      }
      default: {
        const v = row.querySelector('.sensor-val');
        if (!v) return;
        const unit = st.attributes.unit_of_measurement || '';
        this._setVal(v, st.state + (unit ? '\u202F' + unit : ''));
        break;
      }
    }
  }

  // ── Service helpers ─────────────────────────────────────────────────────────

  _svc(domain, service, entityId) {
    if (!this._hass || !entityId) return;
    this._hass.callService(domain, service, { entity_id: entityId });
  }

  // Ouvre la boîte de dialogue more-info native de HA pour l'entité donnée.
  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true, composed: true,
    }));
  }

  // Met à jour le texte d'un élément valeur ; flash néon si la valeur change
  // réellement (et si flash_on_change est activé). Ignore le 1er rendu (—).
  _setVal(el, text) {
    if (!el) return;
    const prev = el.textContent;
    if (prev === text) return;
    el.textContent = text;
    if (this._config.flash_on_change && prev && prev !== '—') {
      el.classList.remove('nec-flash');
      void el.offsetWidth;            // reflow → relance l'animation
      el.classList.add('nec-flash');
    }
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
        // Re-attache le more-info sur les valeurs cliquables (sensor, badge, num-val, cover position…)
        row.querySelectorAll('.clickable').forEach(el =>
          el.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(item.entity); }, opts));
      });
    }
    if (this._hass) this._update();
  }
}

// ─── Editor ───────────────────────────────────────────────────────────────────
// Template unifié — STRATÉGIE B (liste dynamique) — cf CARDS-EDITOR-TEMPLATE.md.
// Cycle de vie B (hash/_lastEmitted/_isEditing) car la liste d'entités est
// add/remove. Réutilise les helpers de champ du template (icône+preview, couleur
// libre, dimensions). Champs statiques via data-key + _set ; champs des blocs
// entité via _entField (index → _setEnt).
const NEON_FONTS = [
  'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];
class NeonEntitiesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this._built = false;
    this._lastEmitted = null;
    this._lastSeen    = null;
  }

  setConfig(c) {
    this._config = { ...c, entities: c.entities ? [...c.entities] : [] };
    if (!this._built) { this._render(); this._lastSeen = this._hash(this._config); return; }
    const h = this._hash(this._config);
    if (h === this._lastEmitted) { this._lastSeen = h; return; }   // notre propre écho
    if (h === this._lastSeen) return;                              // déjà affiché
    if (this._isEditing()) { this._lastSeen = h; return; }         // frappe en cours
    this._render(); this._lastSeen = h;                            // changement externe
  }

  set hass(h) { this._hass = h; if (!this._built) this._render(); else this._fillDatalists(); }
  disconnectedCallback() { this.innerHTML = ''; this._built = false; }

  _hash(o) { try { return JSON.stringify(o); } catch { return String(Math.random()); } }
  _isEditing() {
    const a = this.querySelector(':focus') || document.activeElement;
    return !!a && this.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
  }

  // ── Écriture config (champs statiques racine OU header.x/footer.x imbriqués) ──
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
    } else if (empty) { delete this._config[key]; }
    else { this._config[key] = value; }
    this._dispatch();
  }
  // toggles enabled (header/footer) : stockent false explicite, pas de suppression.
  _setFlag(parent, value) { this._config[parent] = { ...(this._config[parent] || {}), enabled: value }; this._dispatch(); }

  _dispatch() {
    const config = { ...this._config };
    this._lastEmitted = this._hash(config);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
  }

  // ── Helpers de champ (template) ──────────────────────────────────────────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); return d; }

  _text(key, label, ph = '') {
    const w = this._row(label).wrap;
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = ph; inp.value = this._read(key) ?? '';
    inp.addEventListener('change', () => this._set(key, inp.value || undefined));
    w.appendChild(inp); return inp;
  }

  // cssDefault = couleur CSS appliquée par la card quand le champ est vide (peut
  // être une variable). Si le champ est vide, le picker affiche cette couleur RÉSOLUE
  // (getComputedStyle), sans rien écrire dans le YAML.
  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
    const w = this._row(label).wrap;
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    const refresh = () => {
      const explicit = this._toHex(txt.value);
      pick.value = explicit || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA';
    };
    txt.addEventListener('change', () => { this._set(key, txt.value || undefined); refresh(); });
    pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
    box.appendChild(txt); box.appendChild(pick); w.appendChild(box);
    refresh();
    return txt;
  }

  // Résout une couleur CSS (hex, rgb, ou var(--…)) en #rrggbb via un témoin appliqué
  // sur la CARD réelle (pour que les variables du thème/card soient dans le scope).
  _resolveColor(css) {
    try {
      const probe = document.createElement('span');
      probe.style.cssText = `color:${css};position:absolute;left:-9999px;top:-9999px`;
      this.appendChild(probe);                       // dans l'éditeur → scope thème HA
      const rgb = getComputedStyle(probe).color;     // "rgb(r, g, b)" / "rgba(...)"
      probe.remove();
      const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
      return m ? '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') : null;
    } catch { return null; }
  }

  _toggle(key, label, defaultOn = false, parent = null) {
    const w = this._row(label).wrap;
    const cb = document.createElement('input'); cb.type = 'checkbox';
    const v = parent ? (this._config[parent]?.enabled) : this._read(key);
    cb.checked = defaultOn ? (v !== false) : !!v;
    cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
    cb.addEventListener('change', () => parent ? this._setFlag(parent, cb.checked) : this._set(key, cb.checked));
    w.appendChild(cb); return cb;
  }

  _select(key, label, options, emptyLabel = null) {
    const w = this._row(label).wrap;
    const sel = document.createElement('select');
    if (emptyLabel !== null) { const o = document.createElement('option'); o.value = ''; o.textContent = emptyLabel; sel.appendChild(o); }
    options.forEach(opt => { const o = document.createElement('option'); o.value = opt; o.textContent = opt; sel.appendChild(o); });
    sel.value = this._read(key) ?? '';
    sel.addEventListener('change', () => this._set(key, sel.value || undefined));
    w.appendChild(sel); return sel;
  }

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

  // ── Champs DANS un bloc entité (index → _setEnt) ─────────────────────────────
  _entField(parent, idx, field, label, value, { entity = false, ph = '' } = {}) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    const inp = document.createElement('input'); inp.type = 'text'; inp.value = value ?? '';
    if (entity) { inp.setAttribute('list', 'neon-ent-list'); inp.autocomplete = 'off'; }
    inp.placeholder = ph;
    inp.addEventListener('change', () => this._setEnt(idx, field, inp.value || undefined));
    wrap.appendChild(inp); row.appendChild(lbl); row.appendChild(wrap); parent.appendChild(row);
    return inp;
  }

  // Champ ICÔNE d'un bloc entité : input + lien MDI + preview live (clé indexée).
  _entIcon(parent, idx, value) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.innerHTML = `Icône — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">↗</a>`;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.value = value ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview';
    const upd = () => {
      const val = inp.value.trim(); prev.innerHTML = '';
      if (/^mdi:[a-zA-Z0-9_-]+$/.test(val)) {
        const ico = document.createElement('ha-icon'); ico.setAttribute('icon', val); ico.style.cssText = '--mdc-icon-size:20px'; prev.appendChild(ico);
      }
    };
    inp.addEventListener('input', upd);
    inp.addEventListener('change', () => this._setEnt(idx, 'icon', inp.value || undefined));
    box.appendChild(inp); box.appendChild(prev); wrap.appendChild(box); row.appendChild(lbl); row.appendChild(wrap); parent.appendChild(row);
    upd();
  }

  _fillDatalists() {
    if (!this._hass) return;
    let dl = this.querySelector('#neon-ent-list');
    if (!dl) { dl = document.createElement('datalist'); dl.id = 'neon-ent-list'; this.appendChild(dl); }
    const ids = Object.keys(this._hass.states).sort();
    if (dl.childElementCount === ids.length) return;
    dl.textContent = '';
    const frag = document.createDocumentFragment();
    ids.forEach(id => { const o = document.createElement('option'); o.value = id;
      const fn = this._hass.states[id].attributes?.friendly_name; if (fn && fn !== id) o.label = fn; frag.appendChild(o); });
    dl.appendChild(frag);
  }

  _css() {
    return `
      :host { display:block; padding:14px; font-family:var(--primary-font-family,Roboto,sans-serif); }
      .sec { font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--divider-color); }
      .sec:first-child { margin-top:0; }
      .row { display:flex;align-items:center;gap:8px;margin-bottom:6px; }
      .row label { flex:0 0 150px;font-size:12px;color:var(--secondary-text-color); }
      .row label .mdi-link { color:var(--primary-color);font-size:9px;text-transform:none;letter-spacing:0; }
      .field-wrap { flex:1;min-width:0;display:flex; }
      input[type=text],select { flex:1;width:100%;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;outline:none;box-sizing:border-box; }
      select { cursor:pointer; }
      input:focus,select:focus { box-shadow:0 0 0 1px var(--primary-color); }
      .color-row { display:flex;gap:8px;flex:1; }
      .color-row input[type=text] { flex:1; }
      .color-row input[type=color] { width:36px;height:28px;flex:none;padding:0;border:none;background:none;border-radius:4px;cursor:pointer; }
      .icon-row { display:flex;gap:8px;flex:1;align-items:center; }
      .icon-row input { flex:1; }
      .icon-preview { width:30px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;border:1px solid var(--divider-color);border-radius:4px;color:var(--primary-text-color); }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 8px; }
      .block { border:1px solid var(--divider-color);border-radius:8px;padding:10px 12px;margin-bottom:8px;position:relative; }
      .block-title { font-size:11px;font-weight:700;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:8px; }
      .del-btn { position:absolute;top:8px;right:8px;background:none;border:none;color:var(--error-color,#e53935);cursor:pointer;font-size:18px;padding:0;line-height:1; }
      .add-btn { font-size:12px;padding:6px 12px;border:1px dashed var(--primary-color);border-radius:6px;cursor:pointer;background:none;color:var(--primary-color);margin-right:6px;margin-top:4px; }
      .divider-block { border:1px dashed var(--divider-color);border-radius:6px;padding:6px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;color:var(--secondary-text-color);font-size:12px; }
    `;
  }

  _render() {
    this._built = true;
    this.innerHTML = '';
    const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
    this._schema();
    this._fillDatalists();
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  SCHÉMA                                                          ║
  // ╚════════════════════════════════════════════════════════════════╝
  _schema() {
    this._section('En-tête');
    this._toggle(null, 'Afficher en-tête', true, 'header');
    this._text('header.title', 'Titre', 'ex: Maison');
    this._icon('header.icon', 'Icône (mdi)');
    this._color('header.color', 'Couleur titre', 'rgba(var(--rgb-primary-text-color),0.55)', 'défaut : texte primaire — ex rgb(var(--rgb-lavande))');
    this._text('header.title_size', 'Taille titre', 'clamp(7px,2.6cqi,11px)');
    this._select('header.font', 'Police', NEON_FONTS, '— thème HA —');
    this._text('header.title_shadow', 'Text-shadow');

    this._section('Apparence');
    this._color('name_color', 'Couleur des noms',     'rgba(var(--rgb-primary-text-color),0.75)', 'défaut : texte primaire — ex rgb(var(--rgb-lavande))');
    this._color('value_color', 'Couleur des valeurs', 'rgba(var(--rgb-accent-color),0.75)',       'défaut : accent — ex #00fff9');
    this._color('icon_color', 'Couleur des icônes',   'var(--primary-color)',                     'défaut : couleur primaire — ex var(--primary-color)');
    this._color('color_primary', 'Couleur primaire',  'var(--primary-color)',                     'ex: #6200EA / var(--primary-color)');
    this._color('color_accent', 'Couleur accent',     'var(--accent-color)',                      'ex: #00fff9 / var(--accent-color)');

    this._section('Pied de page');
    this._toggle(null, 'Afficher pied', true, 'footer');
    this._text('footer.text', 'Texte', 'MAISON · NEO ENTITIES CARD');

    this._section('Entités');
    this._hint("Entités et séparateurs dans l'ordre souhaité.");
    this._renderEntityBlocks();
    const addEnt = document.createElement('button'); addEnt.className = 'add-btn'; addEnt.textContent = '+ Entité';
    addEnt.addEventListener('click', () => { this._config.entities.push({ entity: '' }); this._dispatch(); this._render(); });
    const addDiv = document.createElement('button'); addDiv.className = 'add-btn'; addDiv.textContent = '+ Séparateur';
    addDiv.addEventListener('click', () => { this._config.entities.push({ type: 'divider' }); this._dispatch(); this._render(); });
    this.appendChild(addEnt); this.appendChild(addDiv);

    this._section('Options');
    this._toggle('use_theme_card', 'Hériter du card-mod thème');
    this._toggle('show_label', "Afficher le type d'entité");
    this._toggle('pulse_active', 'Pulse du liseré actif', true);
    this._toggle('flash_on_change', 'Flash de la valeur au changement');
    this._toggle('value_glow', 'Glow valeurs & statuts', true);
  }

  // Champ icône statique (header) — même rendu que _entIcon mais via _set.
  _icon(key, label) {
    const w = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true).wrap;
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview';
    const upd = () => { const val = inp.value.trim(); prev.innerHTML = ''; if (/^mdi:[a-zA-Z0-9_-]+$/.test(val)) { const ico = document.createElement('ha-icon'); ico.setAttribute('icon', val); ico.style.cssText = '--mdc-icon-size:20px'; prev.appendChild(ico); } };
    inp.addEventListener('input', upd);
    inp.addEventListener('change', () => this._set(key, inp.value || undefined));
    box.appendChild(inp); box.appendChild(prev); w.appendChild(box); upd();
  }

  _renderEntityBlocks() {
    const ents = this._config.entities || [];
    ents.forEach((item, i) => {
      if (item.type === 'divider') {
        const div = document.createElement('div'); div.className = 'divider-block';
        div.innerHTML = `<span>— Séparateur —</span>`;
        const del = document.createElement('button'); del.className = 'del-btn'; del.innerHTML = '×';
        del.addEventListener('click', () => { this._config.entities.splice(i, 1); this._dispatch(); this._render(); });
        div.appendChild(del); this.appendChild(div); return;
      }
      const block = document.createElement('div'); block.className = 'block';
      const title = document.createElement('div'); title.className = 'block-title'; title.textContent = `Entité ${i + 1}`;
      block.appendChild(title);
      const del = document.createElement('button'); del.className = 'del-btn'; del.innerHTML = '×';
      del.addEventListener('click', () => { this._config.entities.splice(i, 1); this._dispatch(); this._render(); });
      block.appendChild(del);

      this._entField(block, i, 'entity',        'Entité *',       item.entity,        { entity: true, ph: 'domain.objet' });
      this._entField(block, i, 'status_entity', 'Statut associé', item.status_entity, { entity: true, ph: 'binary_sensor.porte_garage' });
      this._entField(block, i, 'name',          'Nom affiché',    item.name,          { ph: 'friendly name' });
      this._entIcon (block, i, item.icon);
      this._entField(block, i, 'label',         'Label (ligne 1)',item.label,         { ph: 'SWITCH' });
      this._entField(block, i, 'secondary_info','Info secondaire',item.secondary_info,{ ph: 'state ou vide' });
      this._entField(block, i, 'decimal_places','Décimales',      item.decimal_places,{ ph: '1' });

      this.appendChild(block);
    });
  }

  _setEnt(idx, field, value) {
    const ents = [...(this._config.entities || [])];
    let v = value;
    if (field === 'decimal_places' && v !== undefined) { const n = parseInt(v); v = isNaN(n) ? undefined : n; }
    ents[idx] = { ...(ents[idx] || {}), [field]: v };
    if (v === undefined) delete ents[idx][field];
    this._config = { ...this._config, entities: ents };
    this._dispatch();
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

console.info('%c NEON-ENTITIES-CARD %c v1.8.0 ', 'color:#6200EA;font-weight:bold;background:#040816', 'color:#fff;background:#444');

console.info(
  '%c 📋 neon-entities-card v1.8.0 %c Neo Tokyo ',
  'background:#6200EA;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#BB86FC;padding:2px 4px;border-radius:0 3px 3px 0;'
);
