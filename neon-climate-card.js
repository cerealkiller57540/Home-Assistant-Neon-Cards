/**
 * Neon Climate Card — Neo Tokyo v2
 * @version 1.2.27
 * Nouveautés : couleurs boutons/pill configurables, glitch sur changement temp/humid
	Ligne 502 — le levier global : brightness(2.0) dans le filtre CSS du canvas. Monte à 2.5–3 pour opacifier tout le flux d'un coup (nappes + volutes + particules), c'est le réglage le plus simple.
	Ligne 860 — alpha: 0.028 : les nappes volumétriques larges (la masse d'air). Passe à 0.045 pour une nappe plus dense.
	Ligne 884 — alpha: 0.10 : les volutes fines. 0.15 les rend bien plus présentes.
	Ligne 1001 — p.a = 0.32 : les particules.
 */

console.log("neon-climate-card.js loaded!");

// Device detection (cf weather-neon-card / CARDS-METHOD.md) — userAgent fiable en
// portrait ET paysage, contrairement aux @media largeur/hauteur. Pose .low-power sur le host.
const NCC_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NCC_IS_LOW_POWER = NCC_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

if (!document.getElementById('neon-climate-font')) {
  const l = document.createElement('link');
  l.id = 'neon-climate-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap';
  document.head.appendChild(l);
}

// ─── Couleurs par défaut ──────────────────────────────────────────────────────
const MODE_DEFAULTS = {
  off:      '#6a7aaa',
  heat:     '#FF2D6B',
  cool:     '#00fff9',
  dry:      '#FFB800',
  fan_only: '#00FFAA',
};
const PILL_DEFAULT = '#B400FF';

// hex → {r,g,b}
function hexRgb(hex) {
  const h = hex.replace('#','');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
// hex → rgba string
function rgba(hex, a) { const c = hexRgb(hex); return `rgba(${c.r},${c.g},${c.b},${a})`; }

// ─── Card ─────────────────────────────────────────────────────────────────────
class NeonClimateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass       = null;
    this._config     = {};
    this._animFrame  = null;
    this._windCtx      = null;
    this._windSheets   = [];    // nappes volumétriques pleine largeur
    this._windWisps    = [];    // volutes fines, 1 par louver
    this._windParts    = [];    // particules d'air
    this._windSpd      = 1;     // multiplicateur vitesse (fan_mode)
    this._windOffscreen = false;
    this._windIO       = null;  // IntersectionObserver (pause hors écran)
    this._windLast     = 0;     // cap 30 fps
    this._windT        = 0;
    this._windColor    = null;
    this._windMode     = 'off';
    this._windObserver = null;
    this._windW      = 300;
    this._windH      = 48;
    this._prevTemp   = null;
    this._prevHumid  = null;
  }

  _cleanup() {
    if (this._animFrame)    { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
    if (this._windObserver) { this._windObserver.disconnect(); this._windObserver = null; }
    if (this._windIO)       { this._windIO.disconnect();       this._windIO = null; }
  }

  setConfig(config) {
    if (!config.entity) throw new Error("neon-climate-card: 'entity' requis");
    // classe low-power posée ici (PAS dans le constructor : interdit de toucher
    // aux attributs/classes du host au constructor → NotSupportedError).
    if (NCC_IS_LOW_POWER) this.classList.add('low-power');
    this._cleanup();
    this._config = {
      entity:          config.entity,
      name:            config.name            || null,
      humidity_entity: config.humidity_entity || null,
      show_wind:       config.show_wind !== false,
      // couleurs overridables
      color_off:       config.color_off       || MODE_DEFAULTS.off,
      color_heat:      config.color_heat      || MODE_DEFAULTS.heat,
      color_cool:      config.color_cool      || MODE_DEFAULTS.cool,
      color_dry:       config.color_dry       || MODE_DEFAULTS.dry,
      color_fan:       config.color_fan       || MODE_DEFAULTS.fan_only,
      color_pill:      config.color_pill      || PILL_DEFAULT,
      color_fan_btn:   config.color_fan_btn   || '#00FFAA',
      color_display:   config.color_display   || '#00fff9',  // couleur dot-matrix display AC
      neon_display_glow: config.neon_display_glow !== false,   // triple text-shadow ON/OFF
      header: config.header !== undefined ? config.header : {},
    };
    this._build();
  }

  static getConfigElement() { return document.createElement('neon-climate-card-editor'); }
  static getStubConfig()    { return { entity: 'climate.example' }; }
  getCardSize()             { return 4; }

  set hass(hass) { this._hass = hass; this._update(); }

  // ── Couleurs dynamiques ────────────────────────────────────────────────────

  _modeColor(mode) {
    const map = {
      off:      this._config.color_off,
      heat:     this._config.color_heat,
      cool:     this._config.color_cool,
      dry:      this._config.color_dry,
      fan_only: this._config.color_fan,
    };
    return map[mode] || MODE_DEFAULTS[mode] || '#ffffff';
  }

  _applyColors() {
    const sr   = this.shadowRoot;
    const pill    = this._config.color_pill;
    // Couleur display = mode courant (teinte dynamique) ou fallback config
    const entity  = this._hass?.states[this._config.entity];
    const curMode = entity?.state || 'off';
    const display = this._modeColor(curMode) || this._config.color_display || '#00fff9';

    // Injecter la couleur display comme CSS var sur ha-card ET ac-display
    const haCard = sr.querySelector('ha-card');
    if (haCard) haCard.style.setProperty('--display-color', display);

    // Labels et séparateurs
    sr.querySelectorAll('.display-label').forEach(el => {
      el.style.color = `${display}CC`;
    });
    sr.querySelectorAll('.display-sep').forEach(el => {
      el.style.background = `${display}25`;
    });
    const disp = sr.querySelector('.ac-display');
    if (disp) disp.style.setProperty('--display-color', display);
    // Glitch layers héritent de la couleur
    ['room-temp-g1','room-temp-g2','room-humid-g1','room-humid-g2'].forEach(cls => {
      const el = sr.querySelector(`.${cls}`);
      if (el) el.style.color = display;
    });

    // pill
    const tp = sr.querySelector('.temp-pill');
    if (tp) {
      tp.style.borderColor  = rgba(pill, 0.85);
      tp.style.boxShadow    = `0 0 12px ${rgba(pill, 0.22)}`;
      tp.style.background   = rgba(pill, 0.10);
    }
    sr.querySelectorAll('.temp-pill button').forEach(b => b.style.color = pill);
    const pv = sr.querySelector('.pill-value');
    if (pv) { pv.style.color = pill; pv.style.textShadow = `0 0 10px ${rgba(pill, 0.65)}`; }
    const pl = sr.querySelector('.pill-label');
    if (pl) pl.style.color = rgba(pill, 0.7);

    // boutons mode
    sr.querySelectorAll('.mode-btn').forEach(btn => {
      const mode  = btn.dataset.mode;
      const color = this._modeColor(mode);
      const isActive = btn.classList.contains('active');
      btn.style.color       = color;
      btn.style.borderColor = rgba(color, isActive ? 1 : 0.60);
      btn.style.borderWidth = isActive ? '2px' : '1px';
      btn.style.background  = rgba(color, isActive ? 0.16 : 0.07);
      btn.style.boxShadow   = isActive ? `0 0 14px ${rgba(color, 0.45)}` : 'none';
    });
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  _neonHeaderCss() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    const color  = hdr.color       || 'rgba(180,130,255,0.55)';
    const size   = hdr.title_size  || 'clamp(8px, 2vw, 11px)';
    const font   = hdr.font        ? `'${hdr.font}', ` : "'Orbitron', ";
    const shadow = hdr.title_shadow || 'none';
    const badgeColor = hdr.badge_color || 'rgba(0,255,249,0.7)';
    return `
      .neon-hdr { display:flex; align-items:center; gap:8px; padding:11px 14px 8px; }
      .neon-hdr-icon { display:flex; align-items:center; flex-shrink:0; }
      .neon-hdr-icon ha-icon {
        --mdc-icon-size: clamp(14px, ${size}, ${size});
        color: ${color};
        filter: drop-shadow(0 0 8px color-mix(in srgb, currentColor, transparent 10%));
      }
      .neon-hdr-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:1px; }
      .neon-hdr-title {
        font-family: ${font}var(--primary-font-family, system-ui);
        font-size: clamp(14px, ${size}, ${size});
        color: ${color};
        padding-left: 8px;
        letter-spacing: clamp(1px, 0.5cqi, 3px);
		text-transform: uppercase;
        text-shadow: ${shadow}; line-height: 1.2;
        white-space: nowrap; overflow: visible; text-overflow: ellipsis;
      }
      .neon-hdr-subtitle {
        font-family: ${font}var(--primary-font-family, system-ui);
        font-size: clamp(10px, ${size} * 0.75, 12px);
        color: color-mix(in srgb, ${color} 55%, transparent);
        letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;
      }
      .neon-hdr-badge {
        margin-left: auto; flex-shrink: 0;
        font-size: calc(${size} * 0.8); letter-spacing: 1.5px; text-transform: uppercase;
        color: ${badgeColor};
        border: 1px solid color-mix(in srgb, ${badgeColor} 40%, transparent);
        background: color-mix(in srgb, ${badgeColor} 8%, transparent);
        padding: 2px 7px; border-radius: 4px; white-space: nowrap;
      }
      .neon-main-div {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent);
        margin: 0 14px 4px;
      }
    `;
  }

  _buildNeonHeader() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    if (this._config.header === false || hdr.enabled === false) return '';
    const icon     = hdr.icon     || '';
    const title    = hdr.title    || '';
    const subtitle = hdr.subtitle || '';
    const badge    = hdr.badge    || '';
    if (!icon && !title) return '';
    return `
      <div class="neon-hdr">
        ${icon ? `<div class="neon-hdr-icon"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
        <div class="neon-hdr-body">
          ${title    ? `<span class="neon-hdr-title">${title}</span>`       : ''}
          ${subtitle ? `<span class="neon-hdr-subtitle">${subtitle}</span>` : ''}
        </div>
        ${badge ? `<span class="neon-hdr-badge">${badge}</span>` : ''}
      </div>
      <div class="neon-main-div"></div>`;
  }

  _build() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

        :host {
          display: block;
          font-family: 'Orbitron', var(--primary-font-family, 'Rajdhani', system-ui, sans-serif);
          border-radius: var(--ha-card-border-radius, 18px);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ha-card {
          background: var(--ha-card-background);
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, rgba(98,0,234,0.38));
          border-radius: var(--ha-card-border-radius, 18px);
          box-shadow: var(--ha-card-box-shadow,
            0 4px 28px rgba(0,0,0,0.70),
            0 0 18px rgba(180,0,255,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06)
          );
          overflow: hidden;
        }
        .card {
          padding: 14px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        /* modes row */
        .modes-row   { display:flex; flex-wrap:wrap; gap:5px; align-items:stretch; }
        .modes-group { display:flex; gap:4px; align-items:stretch; flex:0 0 auto; min-width:0; }
        .pill-wrap   { flex:1 1 110px; min-width:110px; display:flex; align-items:stretch; }

        /* mode buttons — couleurs via JS inline style */
        .mode-btn {
          background: transparent;
          border-radius: 8px;
          font-family: 'Orbitron', var(--primary-font-family, sans-serif);
          font-size: 8px;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 5px 4px;
          transition: box-shadow .2s, background .2s, border-color .2s;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          border: 1px solid transparent;
        }
        .mode-btn .ico { font-size: 14px; line-height: 1; }

        @keyframes flicker {
          0%,100% { opacity:1; }
          91%  { opacity:1; }
          92%  { opacity:0.5; }
          93%  { opacity:1; }
          95%  { opacity:0.72; }
          96%  { opacity:1; }
        }
        .mode-btn, .fan-btn { animation: flicker var(--flicker-dur,6s) var(--flicker-delay,0s) infinite; }

        /* LOW_POWER : coupe le flicker (animation décorative en boucle) sur iPad/mobile.
           Via classe .low-power posée en JS (userAgent) — fiable en paysage, contrairement
           aux @media largeur/hauteur. + garde reduced-motion. */
        :host(.low-power) .mode-btn, :host(.low-power) .fan-btn { animation: none !important; }
        @media (prefers-reduced-motion: reduce) {
          .mode-btn, .fan-btn { animation: none !important; }
        }

        /* pill — couleurs via JS inline style */
        .temp-pill {
          width: 100%;
          display: flex;
          align-items: center;
          border-radius: 24px;
          overflow: hidden;
          border: 2px solid transparent;
        }
        .temp-pill button {
          background: transparent;
          border: none;
          font-size: 18px;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
          width: 32px;
          flex-shrink: 0;
          align-self: stretch;
          line-height: 1;
          -webkit-tap-highlight-color: transparent;
          transition: background .15s;
        }
        .pill-center { flex:1; text-align:center; padding:3px 0; }
        .pill-label  { font-size:7px; letter-spacing:1.5px; font-family:'Orbitron',var(--primary-font-family,sans-serif); }
        .pill-value  { font-size:15px; font-weight:500; line-height:1.15; font-family:'Orbitron',var(--primary-font-family,sans-serif); }

        /* fan mode button */
        .fan-btn {
          background: transparent;
          border: 1px solid rgba(0,255,170,0.30);
          border-radius: 8px;
          font-family: 'Orbitron', var(--primary-font-family, sans-serif);
          font-size: 8px;
          letter-spacing: 1px;
          color: rgba(0,255,170,0.55);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 5px 4px;
          transition: box-shadow .2s, background .2s, border-color .2s, color .2s;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          min-width: 36px;
        }
        .fan-btn .ico { font-size: 14px; line-height: 1; }
        .fan-btn.fan-active {
          color: #00FFAA;
          border-color: rgba(0,255,170,0.9);
          background: rgba(0,255,170,0.12);
          box-shadow: 0 0 14px rgba(0,255,170,0.40);
        }

        /* AC body */
        .ac-body {
          background: #0a0f1e;
          border: 1px solid rgba(184,184,255,0.22);
          border-radius: 8px 8px 14px 14px;
          padding: 8px 14px 10px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.65);
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          overflow: visible;
          z-index: 1;
        }
        /* espace réservé sous ac-body quand wind visible */
        .ac-body.wind-on { margin-bottom: 0px !important; transition: margin-bottom .4s ease; }
        .ac-body.wind-off { margin-bottom: 0; transition: margin-bottom .4s ease; }
        .ac-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .ac-name   { font-size:7px; color:rgba(184,184,255,0.45); letter-spacing:2px; font-family:'Orbitron',var(--primary-font-family,sans-serif); }
        .ac-led    { width:6px; height:6px; border-radius:50%; background:#00FFAA; box-shadow:0 0 8px #00FFAA,0 0 14px rgba(0,255,170,0.4); transition:background .5s,box-shadow .5s; }
        .ac-led.off { background:#1a2238; box-shadow:none; }

        .ac-display {
          background: radial-gradient(circle at 50% 45%,
            color-mix(in srgb, var(--display-color, #00fff9) 14%, #060a17) 0%,
            color-mix(in srgb, var(--display-color, #00fff9) 3%, #03050d) 70%,
            #020307 100%
          );
          border: 1px solid color-mix(in srgb, var(--display-color, #00fff9) 35%, transparent);
          border-radius: 6px;
          padding: 6px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          box-shadow:
            inset 0 0 15px color-mix(in srgb, var(--display-color, #00fff9) 18%, transparent),
            inset 0 0 4px color-mix(in srgb, var(--display-color, #00fff9) 30%, transparent),
            0 0 10px color-mix(in srgb, var(--display-color, #00fff9) 8%, transparent);
          position: relative;
          overflow: hidden;
          z-index: 10;
          container-type: inline-size;
          container-name: acdisplay;
        }
        .display-col       { display:flex; flex-direction:column; align-items:center; }
        .display-col.left  { align-items:flex-start; }
        .display-col.right { align-items:flex-end; }
        .display-label {
          font-size: 8px;
          color: rgba(0,255,249,0.45);
          letter-spacing: 2px;
          margin-bottom: 1px;
          font-family: 'Orbitron', var(--primary-font-family, sans-serif);
        }
        .display-value {
          font-family: 'Orbitron', var(--primary-font-family, sans-serif);
          font-size: clamp(13px, 6cqi, 26px);
          color: ${this._config.neon_display_glow !== false ? '#fff' : 'var(--display-color, #00fff9)'};
          letter-spacing: clamp(1px, 0.6cqi, 3px);
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          text-shadow: ${this._config.neon_display_glow !== false
            ? `0 0 3px color-mix(in srgb, var(--display-color, #00fff9) 60%, white),
               0 0 12px var(--display-color, #00fff9),
               0 0 28px color-mix(in srgb, var(--display-color, #00fff9) 55%, transparent),
               0 0 55px color-mix(in srgb, var(--display-color, #00fff9) 25%, transparent)`
            : `0 0 8px var(--display-color, #00fff9), 0 0 20px color-mix(in srgb, var(--display-color, #00fff9) 40%, transparent)`
          };
          transition: color 0.3s, text-shadow 0.3s;
        }
        .display-value.sm { font-size: clamp(11px, 5cqi, 22px); letter-spacing: clamp(0.5px, 0.4cqi, 2px); white-space: nowrap; }
        .display-sep { width:1px; height:36px; background:rgba(0,255,249,0.15); flex-shrink:0; }

        .louvers { display:flex; flex-direction:column; gap:3px; margin-top:7px; overflow:hidden; }
        .louver {
          height: 3px;
          background: rgba(184,184,255,0.12);
          border-radius: 2px;
          transform-origin: top center;
          transition: height .5s ease, opacity .5s ease, margin .5s ease;
        }
        .louver:nth-child(2) { opacity:.8; transition-delay:.06s; }
        .louver:nth-child(3) { opacity:.55; transition-delay:.12s; }
        /* fermé */
        .louvers.closed .louver          { height:0; opacity:0; margin:0; }
        .louvers.closed .louver:nth-child(2) { transition-delay:.04s; }
        .louvers.closed .louver:nth-child(3) { transition-delay:0s; }

        /* glitch */
        @keyframes glitch {
          0%   { clip-path:inset(0 0 95% 0); transform:translate(-3px,0) skewX(-2deg); opacity:1; }
          10%  { clip-path:inset(30% 0 50% 0); transform:translate(3px,0) skewX(2deg); }
          20%  { clip-path:inset(60% 0 20% 0); transform:translate(-2px,0); }
          30%  { clip-path:inset(10% 0 80% 0); transform:translate(2px,0) skewX(-1deg); }
          40%  { clip-path:inset(70% 0 5% 0);  transform:translate(-1px,0); }
          50%  { clip-path:inset(40% 0 40% 0); transform:translate(3px,0); }
          60%  { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; }
          100% { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; }
        }
        @keyframes glitch2 {
          0%   { clip-path:inset(50% 0 30% 0); transform:translate(4px,0) skewX(3deg); opacity:.7; color:#ff006e; }
          15%  { clip-path:inset(20% 0 60% 0); transform:translate(-4px,0); color:#00fff9; }
          30%  { clip-path:inset(80% 0 5% 0);  transform:translate(2px,0); color:#ff006e; }
          50%  { clip-path:inset(0 0 90% 0);   transform:translate(-2px,0); }
          70%  { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; color:#00fff9; }
          100% { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; color:#00fff9; }
        }
        .glitch-wrap { position:relative; display:inline-block; }
        .glitch-wrap .g1,
        .glitch-wrap .g2 {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          pointer-events: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          text-shadow: none;
        }
        .glitch-wrap.playing .g1 { animation: glitch  0.35s steps(1) forwards; }
        .glitch-wrap.playing .g2 { animation: glitch2 0.35s steps(1) forwards 0.04s; }

        /* wind — sort des louvers, position absolute sous ac-body */
        .wind-wrap {
          position: absolute;
          top: 100%;
          margin-top: -3px;
          left: 0;
          right: 0;
          height: 50px;
          z-index: 30;
          pointer-events: none;
          display: flex;
          justify-content: center;
        }
        
        .wind-wrap.hidden {
          opacity: 0;
          height: 0;
          pointer-events: none;
        }
        .wind-canvas { 
          display: block; 
          /* PAS de contrast() ici : Chrome filtre en alpha prémultiplié et
           * écrase les traits translucides (invisible PC/Android). saturate
           * garde le punch néon sans tuer l'alpha. */
          filter: blur(2.5px) saturate(170%) brightness(1.9);
          mix-blend-mode: screen;
        }

        /* responsive iPad */
        @media (min-width:600px) {
          .card { padding:16px; gap:12px; }
          .mode-btn { font-size:9px; padding:6px 6px; }
          .mode-btn .ico { font-size:15px; }
          .pill-value { font-size:20px; }
          .wind-wrap { height:58px; bottom:-58px; }
          .ac-body.wind-on { margin-bottom:58px; }
        }
        @media (min-width:1100px) {
          .wind-wrap { height:66px; bottom:-66px; }
          .ac-body.wind-on { margin-bottom:66px; }
        }
        /* iPad landscape ≤ 1100px : display plus compact */
        @media (max-width:1100px) and (orientation:landscape) {
          .ac-display { gap:4px; padding:5px 8px; }
          .display-sep { height:28px; }
        }
      ${this._neonHeaderCss()}
      </style>

      <ha-card>
        ${this._buildNeonHeader()}
        <div class="card">

          <div class="modes-row">
            <div class="modes-group">
              <button class="mode-btn" data-mode="off"><span class="ico">⏻</span>OFF</button>
              <button class="mode-btn" data-mode="heat"><span class="ico">🔥</span>HEAT</button>
              <button class="mode-btn" data-mode="cool"><span class="ico">❄</span>COOL</button>
              <button class="mode-btn" data-mode="dry"><span class="ico">💧</span>DRY</button>
              <button class="mode-btn" data-mode="fan_only"><span class="ico">〜</span>FAN</button>
              <button class="fan-btn" id="fan-cycle-btn" style="display:none"><span class="ico" id="fan-ico">💨</span><span id="fan-lbl">AUTO</span></button>
            </div>
            <div class="pill-wrap">
              <div class="temp-pill">
                <button class="temp-minus" aria-label="Diminuer">−</button>
                <div class="pill-center">
                  <div class="pill-label">CIBLE</div>
                  <div class="pill-value">--°</div>
                </div>
                <button class="temp-plus" aria-label="Augmenter">+</button>
              </div>
            </div>
          </div>

          <div class="ac-body">
            <div class="ac-header">
              <span class="ac-name">CLIM</span>
              <div class="ac-led off"></div>
            </div>
            <div class="ac-display">
              <div class="display-col left">
                <div class="display-label">ROOM</div>
                <div class="display-value">
                  <div class="glitch-wrap" id="gw-temp">
                    <span class="val room-temp">--°C</span>
                    <span class="g1 room-temp-g1"></span>
                    <span class="g2 room-temp-g2"></span>
                  </div>
                </div>
              </div>
              <div class="display-sep"></div>
              <div class="display-col">
                <div class="display-label">HUMID</div>
                <div class="display-value">
                  <div class="glitch-wrap" id="gw-humid">
                    <span class="val room-humid">--%</span>
                    <span class="g1 room-humid-g1"></span>
                    <span class="g2 room-humid-g2"></span>
                  </div>
                </div>
              </div>
              <div class="display-sep"></div>
              <div class="display-col right">
                <div class="display-label">MODE</div>
                <div class="display-value sm mode-label">--</div>
              </div>
            </div>
            <div class="louvers">
              <div class="louver"></div>
              <div class="louver"></div>
              <div class="louver"></div>
            </div>
            <div class="wind-wrap">
              <canvas class="wind-canvas"></canvas>
            </div>
          </div>

        </div>
      </ha-card>
    `;

    this._setupHandlers();
    this._setupFlicker();
    this._applyColors();
    this._startWind();
    this._applyWindVisibility();
  }

  // ── Wind visibility ───────────────────────────────────────────────────────

  _applyWindVisibility() {
    const wrap = this.shadowRoot.querySelector('.wind-wrap');
    const body = this.shadowRoot.querySelector('.ac-body');
    if (!wrap || !body) return;
    // visible seulement si config activée ET mode != off
    const configOn = this._config.show_wind;
    const modeOn   = this._windMode !== 'off';
    const show     = configOn && modeOn;
    wrap.classList.toggle('hidden', !show);
    body.classList.toggle('wind-on',  show);
    body.classList.toggle('wind-off', !show);
    if (!show && this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = null;
    } else if (show && !this._animFrame) {
      this._startWind();
    }
  }

  // ── Flicker ────────────────────────────────────────────────────────────────

  _setupFlicker() {
    this.shadowRoot.querySelectorAll('.mode-btn, .fan-btn').forEach(btn => {
      btn.style.setProperty('--flicker-dur',   (4.5 + Math.random() * 4).toFixed(2) + 's');
      btn.style.setProperty('--flicker-delay', -(Math.random() * 9).toFixed(2) + 's');
    });
  }

  // ── Glitch ─────────────────────────────────────────────────────────────────

  _triggerGlitch(wrapperId, text) {
    const sr   = this.shadowRoot;
    const wrap = sr.getElementById(wrapperId);
    if (!wrap) return;
    // copier le texte dans les layers fantômes
    wrap.querySelectorAll('.g1, .g2').forEach(el => el.textContent = text);
    wrap.classList.remove('playing');
    // forcer reflow
    void wrap.offsetWidth;
    wrap.classList.add('playing');
    // nettoyer après l'anim
    setTimeout(() => wrap.classList.remove('playing'), 400);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  _setupHandlers() {
    const sr = this.shadowRoot;
    sr.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () =>
        this._callService('set_hvac_mode', { hvac_mode: btn.dataset.mode })
      );
    });
    sr.querySelector('.temp-minus').addEventListener('click', () => this._adjustTemp(-1));
    sr.querySelector('.temp-plus').addEventListener('click',  () => this._adjustTemp(+1));
    const fanBtn = sr.getElementById('fan-cycle-btn');
    if (fanBtn) fanBtn.addEventListener('click', () => {
      const s = this._hass?.states[this._config.entity];
      if (!s) return;
      const modes   = s.attributes.fan_modes || [];
      const current = s.attributes.fan_mode  || '';
      const idx     = modes.indexOf(current);
      const next    = modes[(idx + 1) % modes.length];
      if (next) this._callService('set_fan_mode', { fan_mode: next });
    });

    sr.querySelector('.ac-body').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('hass-more-info', {
        detail: { entityId: this._config.entity },
        bubbles: true, composed: true,
      }));
    });
  }

  _adjustTemp(delta) {
    if (!this._hass) return;
    const s = this._hass.states[this._config.entity];
    if (!s) return;
    const min  = parseFloat(s.attributes.min_temp)         || 16;
    const max  = parseFloat(s.attributes.max_temp)         || 30;
    const step = parseFloat(s.attributes.target_temp_step) || 1;
    // mode range : target_temp_high/low présents, pas temperature
    if (s.attributes.target_temp_high !== undefined && s.attributes.temperature === undefined) {
      const hi = parseFloat(s.attributes.target_temp_high) || 20;
      const lo = parseFloat(s.attributes.target_temp_low)  || 20;
      const t  = Math.min(max, Math.max(min, hi + delta * step));
      this._callService('set_temperature', { target_temp_high: t, target_temp_low: Math.min(t, lo) });
    } else {
      const cur = parseFloat(s.attributes.temperature) || 20;
      this._callService('set_temperature', { temperature: Math.min(max, Math.max(min, cur + delta * step)) });
    }
  }

  _callService(svc, data) {
    if (!this._hass) return;
    this._hass.callService('climate', svc, { entity_id: this._config.entity, ...data });
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  _update() {
    if (!this._hass || !this._config.entity) return;
    const sr = this.shadowRoot;
    if (!sr.querySelector('.card')) return;

    const state = this._hass.states[this._config.entity];
    if (!state) return;

    const mode    = state.state;
    const attrs   = state.attributes;
    const target  = attrs.temperature != null ? attrs.temperature
                : attrs.target_temp_high != null ? attrs.target_temp_high : '--';
    const ambient = attrs.current_temperature != null ? attrs.current_temperature : '--';
    const name    = this._config.name || attrs.friendly_name || 'CLIM';

    let humid = '--';
    if (this._config.humidity_entity) {
      const hs = this._hass.states[this._config.humidity_entity];
      if (hs) humid = parseFloat(hs.state).toFixed(1);
    } else if (attrs.current_humidity != null) {
      humid = parseFloat(attrs.current_humidity).toFixed(1);
    }

    const tempStr  = ambient !== '--' ? `${ambient}°C` : '--°C';
    const humidStr = humid   !== '--' ? `${humid}%`    : '--%';

    // glitch si valeur change
    if (this._prevTemp  !== null && this._prevTemp  !== tempStr)  this._triggerGlitch('gw-temp',  tempStr);
    if (this._prevHumid !== null && this._prevHumid !== humidStr) this._triggerGlitch('gw-humid', humidStr);
    this._prevTemp  = tempStr;
    this._prevHumid = humidStr;

    sr.querySelector('.ac-name').textContent    = name.toUpperCase();
    sr.querySelector('.room-temp').textContent  = tempStr;
    sr.querySelector('.room-humid').textContent = humidStr;
    sr.querySelector('.mode-label').textContent = this._modeLabel(mode);
    sr.querySelector('.pill-value').textContent = target !== '--' ? `${target}°` : '--°';

    sr.querySelector('.ac-led').classList.toggle('off', mode === 'off');
    sr.querySelector('.louvers').classList.toggle('closed', mode === 'off');

    sr.querySelectorAll('.mode-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.mode === mode)
    );

    // fan mode — bouton cycle
    const fanModes  = attrs.fan_modes;
    const fanMode   = attrs.fan_mode || '';
    const fanCycleBtn = sr.getElementById('fan-cycle-btn');
    if (fanCycleBtn) {
      const hasFan = !!(fanModes && fanModes.length);
      this._windSpd = ({ quiet:0.45, silence:0.45, low:0.6, min:0.6, medium:1, mid:1, auto:1, high:1.6, max:1.8, turbo:1.8 })[String(fanMode).toLowerCase()] ?? 1;
      fanCycleBtn.style.display = hasFan ? '' : 'none';
      if (hasFan) {
        const FAN_ICO = { off:'⏻', low:'🌬', medium:'💨', high:'🌪', auto:'♾' };
        const ico   = FAN_ICO[fanMode] || '💨';
        const lbl   = fanMode.toUpperCase().slice(0, 4);
        const col   = this._config.color_fan_btn;
        const active = fanMode !== 'off';
        sr.getElementById('fan-ico').textContent = ico;
        sr.getElementById('fan-lbl').textContent = lbl;
        fanCycleBtn.classList.toggle('fan-active', active);
        fanCycleBtn.style.color       = active ? col : `${col}88`;
        fanCycleBtn.style.borderColor = active ? col : `${col}44`;
        fanCycleBtn.style.background  = active ? `${col}1e` : 'transparent';
        fanCycleBtn.style.boxShadow   = active ? `0 0 14px ${col}66` : 'none';
      }
    }

    this._applyColors();
    this._setWindMode(mode);
    this._applyWindVisibility();
  }

  _modeLabel(mode) {
    return { off:'OFF', heat:'HEAT', cool:'COOL', dry:'DRY', fan_only:'FAN' }[mode]
      || mode.toUpperCase();
  }

  // ── Wind ───────────────────────────────────────────────────────────────────

  _setWindMode(mode) {
    const c = {
      heat:     { r:255, g:45,  b:107 },
      cool:     { r:0,   g:255, b:249 },
      fan_only: { r:0,   g:255, b:170 },
      dry:      { r:255, g:184, b:0   },
    };
    this._windColor = c[mode] || null;
    this._windMode  = mode;
  }

  _startWind() {
    const canvas = this.shadowRoot.querySelector('.wind-canvas');
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);  // cap : assez pour le blur, moitié moins de pixels

    const resize = () => {
      const louverElems = this.shadowRoot.querySelectorAll('.louver');
      const wrap        = this.shadowRoot.querySelector('.wind-wrap');
      const acBody      = this.shadowRoot.querySelector('.ac-body');
      if (!louverElems.length || !wrap || !acBody) return;

      const bodyRect    = acBody.getBoundingClientRect();
      const fLRect      = louverElems[0].getBoundingClientRect();
      const LW          = fLRect.width || bodyRect.width;
      const LX          = fLRect.left  - bodyRect.left;
      const topOffset   = fLRect.top   - bodyRect.top;
      // H = depuis le premier louver jusqu'au bas de ac-body
      const H           = Math.max(120, bodyRect.height - topOffset);

      wrap.style.top    = topOffset + 'px';
      wrap.style.left   = '0';
      wrap.style.right  = '0';
      wrap.style.width  = '100%';

      canvas.width        = bodyRect.width * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = bodyRect.width + 'px';
      canvas.style.height = H + 'px';

      this._windW = bodyRect.width;
      this._windH = H;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      this._windCtx = ctx;

      // Placement inchangé : chaque volute est ancrée sur le centre Y de SON
      // louver (point de départ = premier louver, flux au premier plan).
      // Au resize : recalcul x/amp/lw depuis LW, préservation phase/speed/alpha.
      const louverYs = [];
      louverElems.forEach(louver => {
        const lr = louver.getBoundingClientRect();
        louverYs.push(Math.max(0, (lr.top - fLRect.top) + lr.height / 2));
      });
      const NL = louverYs.length;

      // Nappes volumétriques — la masse d'air, large comme le louver (ex-streams,
      // sans pointillés), ancrées sur les premiers louvers.
      for (let i = 0; i < 3; i++) {
        const prev = this._windSheets[i];
        if (prev) {
          prev.x      = LX + LW / 2;
          prev.startY = louverYs[Math.min(i, NL-1)] || 0;
          prev.amp    = LW * (0.05 + (prev._ampR ?? 0.03));
          prev.lw     = LW * (0.80 + (prev._lwR  ?? 0.15));
        } else {
          const ampR = Math.random() * 0.03, lwR = Math.random() * 0.25;
          this._windSheets.push({
            x: LX + LW/2, startY: louverYs[Math.min(i, NL-1)] || 0,
            phase: Math.random()*Math.PI*2, speed: 0.28 + Math.random()*0.15,
            amp: LW*(0.05+ampR), alpha: 0.05 + Math.random()*0.018,
            lw: LW*(0.80+lwR), hueShift: (Math.random()-0.5)*24,
            _ampR: ampR, _lwR: lwR,
          });
        }
      }
      this._windSheets.length = Math.min(3, Math.max(1, NL));

      // Volutes fines — 1 par louver, réparties sur toute la largeur, chacune
      // partant de son louver (l'air "sort" de chaque lame).
      louverYs.forEach((startY, i) => {
        const fx = (i + 0.5) / NL;
        const prev = this._windWisps[i];
        if (prev) {
          prev.x      = LX + fx*LW;
          prev.fx     = fx;
          prev.startY = startY;
          prev.amp    = LW * (0.035 + (prev._ampR ?? 0.025));
        } else {
          const ampR = Math.random() * 0.025;
          this._windWisps.push({
            x: LX + fx*LW, fx, startY,
            phase: Math.random()*Math.PI*2, phase2: Math.random()*Math.PI*2,
            speed: 0.3 + Math.random()*0.22,
            amp: LW*(0.035+ampR), alpha: 0.16 + Math.random()*0.08,
            lw: 4 + Math.random()*7, hueShift: (Math.random()-0.5)*30,
            _ampR: ampR,
          });
        }
      });
      this._windWisps.length = NL;
      this._windLX = LX; this._windLW = LW;
      this._windTopY = louverYs[0] || 0;

      // Particules d'air (pool fixe, recyclées)
      if (!this._windParts.length) for (let i = 0; i < 26; i++) this._windParts.push({ y: 1e9 });
    };

    setTimeout(resize, 100);
    if (window.ResizeObserver) {
      if (this._windObserver) this._windObserver.disconnect();
      this._windObserver = new ResizeObserver(resize);
      const cardEl = this.shadowRoot.querySelector('ha-card');
      this._windObserver.observe(cardEl || canvas.parentElement);
    }

    // IntersectionObserver — pause complète quand la card sort de l'écran
    if (window.IntersectionObserver && !this._windIO) {
      this._windIO = new IntersectionObserver(entries => {
        this._windOffscreen = !entries[0].isIntersecting;
      });
      this._windIO.observe(canvas);
    }

    const draw = (now) => {
      this._animFrame = requestAnimationFrame(draw);
      if (this._windOffscreen) return;                       // hors écran → rien
      if (now - this._windLast < 33) return;                 // cap 30 fps
      this._windLast = now;
      const ctx = this._windCtx;
      if (!ctx) return;
      const W = this._windW, H = this._windH, c = this._windColor;
      ctx.clearRect(0, 0, W, H);
      if (!c || this._windMode === 'off') return;

      // Hue rotation RGB simple via matrice cosinus/sinus
      const _hueShift = (r, g, b, deg) => {
        const h = deg * Math.PI / 180;
        const cos = Math.cos(h), sin = Math.sin(h);
        return {
          r: Math.round(Math.min(255, Math.max(0, r*(0.213+cos*0.787-sin*0.213) + g*(0.715-cos*0.715-sin*0.715) + b*(0.072-cos*0.072+sin*0.928)))),
          g: Math.round(Math.min(255, Math.max(0, r*(0.213-cos*0.213+sin*0.143) + g*(0.715+cos*0.285+sin*0.140) + b*(0.072-cos*0.072-sin*0.283)))),
          b: Math.round(Math.min(255, Math.max(0, r*(0.213-cos*0.213-sin*0.787) + g*(0.715-cos*0.715+sin*0.715) + b*(0.072+cos*0.928+sin*0.072)))),
        };
      };
      const _vgrad = (sc, sf, a1, a2) => {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(Math.max(0, sf - 0.05), `rgba(${sc.r},${sc.g},${sc.b},0)`);
        g.addColorStop(Math.min(1, sf + 0.12), `rgba(${sc.r},${sc.g},${sc.b},${a1.toFixed(3)})`);
        g.addColorStop(0.78, `rgba(${sc.r},${sc.g},${sc.b},${a2.toFixed(3)})`);
        g.addColorStop(1, `rgba(${sc.r},${sc.g},${sc.b},0)`);
        return g;
      };

      const spd  = this._windSpd || 1;
      const t    = this._windT;
      const gust = 0.72 + 0.28 * Math.sin(t * 0.35);         // respiration globale
      ctx.lineCap = 'round';

      // 1) Nappes volumétriques — masse d'air pleine largeur (continues)
      for (const s of this._windSheets) {
        const travel = H - s.startY;
        if (travel <= 0) { s.phase -= s.speed * 0.004 * spd; continue; }
        const g  = 0.72 + 0.28 * Math.sin(t * 0.35 + s.phase * 0.8);
        const sc = s.hueShift ? _hueShift(c.r, c.g, c.b, s.hueShift) : c;
        ctx.strokeStyle = _vgrad(sc, s.startY / H, s.alpha * 1.2 * g, s.alpha * 0.75 * g);
        ctx.beginPath();
        ctx.lineWidth = s.lw;
        for (let j = 0; j <= 30; j++) {
          const f = j / 30, y = s.startY + f * travel;
          const x = s.x
            + Math.sin(f*2.1 + s.phase       + t * s.speed * spd      ) * s.amp * f
            + Math.sin(f*4.3 + s.phase * 1.6 + t * s.speed * spd * 1.5) * s.amp * 0.3 * f;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        s.phase -= s.speed * 0.004 * spd;
      }

      // 2) Volutes fines — une par louver, réparties sur la largeur, cône ∝ vitesse
      for (const s of this._windWisps) {
        const travel = H - s.startY;
        if (travel <= 0) { s.phase -= s.speed * 0.004 * spd; continue; }
        const g  = 0.7 + 0.3 * Math.sin(t * 0.35 + s.phase);
        const sc = s.hueShift ? _hueShift(c.r, c.g, c.b, s.hueShift) : c;
        const spread = (s.fx - 0.5) * (this._windLW || 200) * 0.16 * spd;
        ctx.strokeStyle = _vgrad(sc, s.startY / H, s.alpha * 1.25 * g, s.alpha * 0.8 * g);
        ctx.beginPath();
        ctx.lineWidth = s.lw;
        for (let j = 0; j <= 26; j++) {
          const f = j / 26, y = s.startY + f * travel;
          const x = s.x + spread * f
            + Math.sin(f*2.4 + s.phase  + t * s.speed * spd      ) * s.amp * f
            + Math.sin(f*5.2 + s.phase2 + t * s.speed * spd * 1.7) * s.amp * 0.35 * f;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        s.phase -= s.speed * 0.004 * spd;
      }

      // 3) Particules d'air — naissent sur toute la bouche, advectées, fade sinus
      const LX = this._windLX || 0, LW = this._windLW || W, topY = this._windTopY || 0;
      let live = 0;
      for (const p of this._windParts) {
        if (p.y > H) {
          if (live < 10 + spd * 10 && Math.random() < 0.18) {
            p.x = LX + Math.random() * LW;
            p.y = topY + 2;
            p.v = (0.9 + Math.random()) * spd;
            p.r = 0.7 + Math.random() * 0.9;
            p.ph = Math.random() * Math.PI * 2;
            p.a = 0.45 + Math.random() * 0.30;
          } else continue;
        }
        live++;
        p.y += p.v;
        p.x += Math.sin(p.y * 0.09 + p.ph + t * 0.8) * 0.35 + ((p.x - LX) / LW - 0.5) * 0.12 * spd;
        const fa = p.a * Math.sin(Math.PI * Math.min(1, (p.y - topY) / (H - topY || 1))) * gust;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${fa.toFixed(3)})`;
        ctx.fill();
      }

      this._windT += 0.033;
    };
    this._animFrame = requestAnimationFrame(draw);
  }

  disconnectedCallback() { this._cleanup(); }
}

// ─── Editor ───────────────────────────────────────────────────────────────────
// Template unifié — cf \\192.168.1.60\config\CARDS-EDITOR-TEMPLATE.md
// N'éditer QUE _schema() ; le reste est canonique et identique sur toutes les cards.
const NEON_FONTS = [
  'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];
class NeonClimateCardEditor extends HTMLElement {
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

  // ── Helpers de champ (signatures FIXES) ────────────────────────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); return d; }

  _text(key, label, ph = '') {
    const w = this._row(label).wrap;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key; inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    w.appendChild(inp); return inp;
  }

  _toggle(key, label, defaultOn = false) {
    const w = this._row(label).wrap;
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.dataset.key = key;
    if (defaultOn) cb.dataset.defaultOn = '1';
    const v = this._read(key); cb.checked = defaultOn ? (v !== false) : !!v;
    cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
    cb.addEventListener('change', () => this._set(key, cb.checked));
    w.appendChild(cb); return cb;
  }

  // cssDefault = couleur appliquée quand le champ est vide → picker la montre résolue.
  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
    const w = this._row(label).wrap;
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key; txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    txt._pick = pick; txt._cssDefault = cssDefault;
    const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA'; };
    txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
    pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
    box.appendChild(txt); box.appendChild(pick); w.appendChild(box); refresh(); return txt;
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
    const w = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true).wrap;
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key; inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
    inp.addEventListener('input', () => this._set(key, inp.value));
    box.appendChild(inp); box.appendChild(prev); w.appendChild(box); return inp;
  }

  _entity(key, label, prefix = '') {
    const w = this._row(label).wrap;
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `ncc-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value.trim()));
    w.appendChild(inp); return inp;
  }

  // Liste déroulante. options = [string] ou [{value,label}]. emptyLabel = 1ère option vide (défaut).
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

  _render() {
    this.innerHTML = '';
    const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
    this._schema();
    this._fillDatalists();
    this._bindIconPreviews();
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  SCHÉMA — LA SEULE PARTIE SPÉCIFIQUE À LA CARD                  ║
  // ╚════════════════════════════════════════════════════════════════╝
  _schema() {
    this._section('En-tête');
    this._text('header.title', 'Titre', 'ex: Climatisation');
    this._icon('header.icon', 'Icône (mdi)');
    this._color('header.color', 'Couleur titre', 'rgba(var(--rgb-primary-text-color),0.55)', 'défaut : texte primaire — ex rgb(var(--rgb-lavande))');
    this._text('header.title_size', 'Taille titre', '16px');
    this._select('header.font', 'Police', NEON_FONTS, '— thème HA —');
    this._text('header.subtitle', 'Sous-titre', 'optionnel');
    this._text('header.badge', 'Badge', 'optionnel');
    this._text('header.title_shadow', 'Text-shadow', '0 0 6px ...');

    this._section('Entité principale');
    this._entity('entity', 'Entité climate *', 'climate');
    this._text('name', 'Nom affiché', 'Vide = friendly_name');

    this._section('Capteurs');
    this._entity('humidity_entity', 'Entité humidité', 'sensor');
    this._hint("Facultatif — sinon current_humidity de l'entité climate");

    this._section('Couleurs boutons mode');
    this._color('color_off', 'OFF', MODE_DEFAULTS.off);
    this._color('color_heat', 'HEAT', MODE_DEFAULTS.heat);
    this._color('color_cool', 'COOL', MODE_DEFAULTS.cool);
    this._color('color_dry', 'DRY', MODE_DEFAULTS.dry);
    this._color('color_fan', 'FAN ONLY', MODE_DEFAULTS.fan_only);
    this._color('color_fan_btn', 'FAN (bouton cycle)', '#00FFAA');

    this._section('Couleur pill température');
    this._color('color_pill', 'Pill cible', PILL_DEFAULT);

    this._section('Couleur display AC');
    this._color('color_display', 'Dot-matrix / display', '#00fff9');
    this._toggle('neon_display_glow', 'Triple neon glow', true);

    this._section('Options');
    this._toggle('show_wind', 'Animation air', true);
  }
}

// ─── Registration ─────────────────────────────────────────────────────────────
customElements.define('neon-climate-card-editor', NeonClimateCardEditor);
customElements.define('neon-climate-card', NeonClimateCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-climate-card', name: 'Neon Climate Card',
  description: 'Compact AC card — Neo Tokyo v2. Dot-matrix, wind, mode buttons.',
  preview: true,
});

console.info('%c NEON-CLIMATE-CARD %c v1.3.0 ','color:#00fff9;font-weight:bold;background:#040816','color:#fff;background:#444');

console.info(
  '%c ❄️ neon-climate-card v1.3.0 %c Neo Tokyo ',
  'background:#00D4FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#9D4EDD;padding:2px 4px;border-radius:0 3px 3px 0;'
);
