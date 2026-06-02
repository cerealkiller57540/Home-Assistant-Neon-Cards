/**
 * Neon Climate Card — Neo Tokyo v2
 * @version 1.2.27
 * Nouveautés : couleurs boutons/pill configurables, glitch sur changement temp/humid
 */

console.log("neon-climate-card.js loaded!");

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
    this._windStreams   = [];
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
  }

  setConfig(config) {
    if (!config.entity) throw new Error("neon-climate-card: 'entity' requis");
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
          filter: blur(3px) contrast(150%) brightness(2.0);
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
    const dpr = window.devicePixelRatio || 1;
    const N   = 11;

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

      // 1 filament gazeux par louver, ancré sur son centre Y
      // Au resize : recalculer x/amp/lw depuis LW, préserver phase/speed/alpha
      louverElems.forEach((louver, i) => {
        const lr      = louver.getBoundingClientRect();
        const startY  = Math.max(0, (lr.top - fLRect.top) + lr.height / 2);
        const prev    = this._windStreams[i];
        if (prev) {
          prev.x      = LX + LW / 2;
          prev.startY = startY;
          prev.amp    = LW * (0.08 + (prev._ampR ?? 0.06));
          prev.lw     = LW * (0.80 + (prev._lwR  ?? 0.25));
        } else {
          const ampR = Math.random() * 0.06;
          const lwR  = Math.random() * 0.30;
          this._windStreams.push({
            x:        LX + LW / 2,
            startY:   startY,
            phase:    Math.random() * Math.PI * 2,
            speed:    0.3 + Math.random() * 0.2,
            amp:      LW * (0.08 + ampR),
            alpha:    0.04 + Math.random() * 0.04,
            lw:       LW * (0.80 + lwR),
            hueShift: (Math.random() - 0.5) * 30,  // ±15° hue shift
            _ampR:    ampR,
            _lwR:     lwR,
          });
        }
      });
      // Tronquer si moins de louvers qu'avant
      this._windStreams.length = louverElems.length;
    };

    setTimeout(resize, 100);
    if (window.ResizeObserver) {
      if (this._windObserver) this._windObserver.disconnect();
      this._windObserver = new ResizeObserver(resize);
      const cardEl = this.shadowRoot.querySelector('ha-card');
      this._windObserver.observe(cardEl || canvas.parentElement);
    }

    const draw = () => {
      this._animFrame = requestAnimationFrame(draw);
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

      for (const s of this._windStreams) {
        const travel = H - s.startY;
        if (travel <= 0) { s.phase -= s.speed * 0.02; continue; }

        const sc = s.hueShift ? _hueShift(c.r, c.g, c.b, s.hueShift) : c;
        const startFrac = s.startY / H;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(Math.max(0, startFrac - 0.05), `rgba(${sc.r},${sc.g},${sc.b},0)`);
        grad.addColorStop(Math.min(1, startFrac + 0.15), `rgba(${sc.r},${sc.g},${sc.b},${s.alpha})`);
        grad.addColorStop(1, `rgba(${sc.r},${sc.g},${sc.b},0)`);

        ctx.beginPath();
        ctx.lineWidth  = s.lw;
        ctx.lineCap    = 'round';
        ctx.setLineDash([22, 28, 38, 32, 15, 40]);
        ctx.lineDashOffset = this._windT * 45 * s.speed;

        for (let j = 0; j <= 40; j++) {
          const frac = j / 40;
          const y    = s.startY + frac * travel;
          const turbulence = Math.sin(frac * 3 + s.phase + this._windT * s.speed) * s.amp * frac;
          const x = s.x + turbulence;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.strokeStyle = grad;
        ctx.stroke();
        ctx.setLineDash([]);
        s.phase -= s.speed * 0.02;
      }
      this._windT += 0.02;
    };
    draw();
  }

  disconnectedCallback() { this._cleanup(); }
}

// ─── Editor ───────────────────────────────────────────────────────────────────
class NeonClimateCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._built = false; }

  setConfig(config) {
    // §22 : ne reconstruire le DOM qu'une fois ; sinon sync chirurgical (garde le focus).
    this._config = { ...config };
    if (!this._built) this._render();
    else              this._syncValues();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._render();
    else              this._fillEntities();
  }

  // §22 : met à jour les champs sans recréer le DOM. Guard activeElement = ne pas
  // écraser le champ en cours d'édition.
  _syncValues() {
    const c = this._config;
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el === document.activeElement) return;
      const k = el.dataset.key;
      if (el.type === 'checkbox') {
        el.checked = el.dataset.defaultOn ? (c[k] !== false) : !!c[k];
      } else {
        const v = c[k];
        el.value = (v === undefined || v === null) ? '' : v;
        if (el._pick) { const h = this._toHex(el.value); if (h) el._pick.value = h; }
      }
    });
  }

  disconnectedCallback() { this.innerHTML = ''; this._built = false; }

  _render() {
    this._built = true;
    this.innerHTML = '';
    this.style.cssText = 'display:block;padding:16px;font-family:var(--primary-font-family,Roboto,sans-serif);';

    const style = document.createElement('style');
    style.textContent = `
      .sec { font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--primary-color);margin:18px 0 8px; }
      .row { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px; }
      .row label { font-size:14px;color:var(--primary-text-color);flex:1; }
      select, input[type=text] { font-size:13px;padding:6px 8px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);outline:none;flex-shrink:0;min-width:165px; }
      select { cursor:pointer; }
      .color-row { display:flex;align-items:center;gap:8px; }
      .color-row input[type=text] { flex:1;min-width:0; }
      input[type=color] { width:44px;height:30px;padding:2px 3px;border:1px solid var(--divider-color,#ccc);border-radius:6px;cursor:pointer;flex-shrink:0; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-4px 0 10px; }
    `;
    this.appendChild(style);

    const c = this._config;

    this._sec('Entité principale');
    this._entityRow('entity',          'Entité climate *',  c.entity          || '', 'climate.');
    this._text(     'name',            'Nom affiché',       c.name            || '', 'Vide = friendly_name');

    this._sec('Capteurs');
    this._entityRow('humidity_entity', 'Entité humidité',   c.humidity_entity || '', 'sensor.');
    this._hint("Facultatif — si vide, utilise current_humidity de l'entité climate");

    this._sec('Couleurs boutons mode');
    this._colorRow('color_off',  'OFF',      c.color_off  || MODE_DEFAULTS.off);
    this._colorRow('color_heat', 'HEAT',     c.color_heat || MODE_DEFAULTS.heat);
    this._colorRow('color_cool', 'COOL',     c.color_cool || MODE_DEFAULTS.cool);
    this._colorRow('color_dry',  'DRY',      c.color_dry  || MODE_DEFAULTS.dry);
    this._colorRow('color_fan',  'FAN ONLY', c.color_fan  || MODE_DEFAULTS.fan_only);

    this._colorRow('color_fan_btn', 'FAN (bouton cycle)', c.color_fan_btn || '#00FFAA');

    this._sec('Couleur pill température');
    this._colorRow('color_pill', 'Pill cible', c.color_pill || PILL_DEFAULT);

    this._sec('Couleur display AC');
    this._colorRow('color_display', 'Dot-matrix / display', c.color_display || '#00fff9');
    this._toggle('neon_display_glow', 'Triple neon glow', c.neon_display_glow !== false, true);

    this._sec('Options');
    this._toggle('show_wind', 'Animation air (désactivable)', c.show_wind !== false, true);

    this._fillEntities();
  }

  _sec(t)  { const d=document.createElement('div'); d.className='sec'; d.textContent=t; this.appendChild(d); }
  _hint(t) { const d=document.createElement('div'); d.className='hint'; d.textContent=t; this.appendChild(d); }

  _toggle(key, label, checked, defaultOn=false) {
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=checked; cb.dataset.key=key;
    if (defaultOn) cb.dataset.defaultOn='1';   // coché tant que la config ne dit pas explicitement false
    cb.style.cssText='width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color,#03a9f4);';
    cb.addEventListener('change', e => this._set(key, e.target.checked));
    row.appendChild(lbl); row.appendChild(cb); this.appendChild(row);
  }

  _text(key, label, value, placeholder='') {
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const inp=document.createElement('input'); inp.type='text'; inp.value=value; inp.placeholder=placeholder; inp.dataset.key=key;
    inp.addEventListener('change', e => this._set(key, e.target.value || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _entityRow(key, label, value, prefix) {
    // §22 : input + <datalist> par préfixe de domaine (jamais <select> brut).
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const inp=document.createElement('input');
    inp.type='text'; inp.value=value||''; inp.autocomplete='off';
    inp.placeholder=(prefix||'')+'…';
    inp.dataset.key=key; inp.dataset.prefix=prefix||'';
    inp.setAttribute('list', 'ncc-ent-'+(prefix||'all').replace(/[^a-z]/g,''));
    inp.addEventListener('change', e => this._set(key, e.target.value.trim() || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _colorRow(key, label, value) {
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const wrap=document.createElement('div'); wrap.className='color-row';
    const txt=document.createElement('input'); txt.type='text'; txt.value=value; txt.placeholder='#rrggbb'; txt.dataset.key=key;
    const pick=document.createElement('input'); pick.type='color'; pick.value=this._toHex(value)||'#00fff9';
    txt._pick=pick;   // référence pour resync (cf. _syncValues)
    txt.addEventListener('change',  e => { const v=e.target.value.trim(); this._set(key,v||undefined); const h=this._toHex(v); if(h) pick.value=h; });
    pick.addEventListener('input',  e => { txt.value=e.target.value; this._set(key,e.target.value); });
    wrap.appendChild(txt); wrap.appendChild(pick); row.appendChild(lbl); row.appendChild(wrap); this.appendChild(row);
  }

  _fillEntities() {
    if (!this._hass) return;
    // Un <datalist> par préfixe de domaine, partagé par les inputs de ce préfixe.
    this.querySelectorAll('input[data-key][list]').forEach(inp => {
      const prefix=inp.dataset.prefix||'', listId=inp.getAttribute('list');
      let dl=this.querySelector('#'+listId);
      if (!dl) { dl=document.createElement('datalist'); dl.id=listId; this.appendChild(dl); }
      const ids=Object.keys(this._hass.states).filter(e=>e.startsWith(prefix)).sort();
      if (dl.childElementCount === ids.length) return;   // déjà à jour
      dl.textContent='';
      const frag=document.createDocumentFragment();
      ids.forEach(id => {
        const o=document.createElement('option'); o.value=id;
        const fn=this._hass.states[id].attributes?.friendly_name;
        if (fn && fn!==id) o.label=fn;
        frag.appendChild(o);
      });
      dl.appendChild(frag);
    });
  }

  _set(key, value) {
    if (value===undefined||value==='') delete this._config[key];
    else this._config[key]=value;
    this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:{...this._config}},bubbles:true,composed:true}));
  }

  _toHex(color) {
    if (!color) return null;
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    const m=color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    if (m) return '#'+[m[1],m[2],m[3]].map(n=>(+n).toString(16).padStart(2,'0')).join('');
    return null;
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

console.info('%c NEON-CLIMATE-CARD %c v1.2.0 ','color:#00fff9;font-weight:bold;background:#040816','color:#fff;background:#444');

console.info(
  '%c ❄️ neon-climate-card v1.2.16 %c Neo Tokyo ',
  'background:#00D4FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#9D4EDD;padding:2px 4px;border-radius:0 3px 3px 0;'
);
