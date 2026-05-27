/* ── neon-switch-card v1.6 ── */
(() => {

/* ── Device detection (MD §1) ───────────────────────────────────────────── */
const NSW_IS_IPAD      = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NSW_IS_LOW_POWER = NSW_IS_IPAD || /iPhone|Android/.test(navigator.userAgent);

/* ── Orbitron — une seule fois dans <head> ───────────────────────────────── */
if (!document.getElementById('neon-switch-font')) {
  const l = document.createElement('link');
  l.id = 'neon-switch-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500&display=swap';
  document.head.appendChild(l);
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  PALETTE
 * ═══════════════════════════════════════════════════════════════════════════ */
const CP_ACCENT  = '#00fff9';
const CP_PRIMARY = '#B400FF';
const CP_GIG     = '#00ff88';
const CP_M100    = '#FF3D00';
const CP_M10     = '#B400FF';
const CP_ERR     = '#FF2D6F';
const CP_BG      = '#040614';
const CP_DIM     = 'rgba(255,255,255,0.45)';

/* ═══════════════════════════════════════════════════════════════════════════
 *  HELPERS
 * ═══════════════════════════════════════════════════════════════════════════ */
function _fmtRate(val, unit) {
  if (val === null || val === undefined) return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  const u = (unit || '').replace('_per_second', '/s');
  if (n === 0) return '0';
  if (n < 0.01) return '<0.01 ' + u;
  return n.toFixed(2) + ' ' + u;
}

function _fmtTotal(val, unit) {
  if (val === null || val === undefined) return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  const u = unit || '';
  if (!u || u === 'B') {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' GB';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MB';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' KB';
    return n.toFixed(0) + ' B';
  }
  return n.toFixed(n < 10 ? 1 : 0) + ' ' + u;
}

function _speedClass(val, unit) {
  if (!val || val === 'unavailable' || val === 'unknown') return 'off';
  let n = parseFloat(val);
  if (isNaN(n)) {
    const s = String(val).toLowerCase();
    if (s.includes('1000') || s.includes('1g')) return 'gig';
    if (s.includes('100'))  return 'm100';
    if (s.includes('10'))   return 'm10';
    return 'off';
  }
  const u = (unit || '').toLowerCase();
  if (u.includes('gbit') || u === 'gbps' || u === 'gb/s') n *= 1000;
  if (n >= 1000) return 'gig';
  if (n >= 100)  return 'm100';
  if (n > 0)     return 'm10';
  return 'off';
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  SVG RJ45 — viewBox 121.88×94.625, retourné LEDs en haut
 *  Basé sur RJ45-Female (openclipart / deusinvictus, public domain)
 * ═══════════════════════════════════════════════════════════════════════════ */
function _rj45SVG(portIdx, speedCls) {
  const lCol        = { gig: CP_GIG, m100: CP_M100, m10: CP_M10, off: '#310062' }[speedCls];
  const lCls        = speedCls === 'gig'  ? 'led-l-gig'
                    : speedCls === 'm100' ? 'led-l-100'
                    : speedCls === 'm10'  ? 'led-l-10' : '';
  const contactOp   = speedCls !== 'off' ? '0.88' : '0.1';
  const outerStroke = speedCls !== 'off' ? 'rgba(98,0,234,.38)' : 'rgba(98,0,234,.12)';
  const rCol        = speedCls !== 'off' ? 'rgba(0,255,249,.1)' : '#310062';

  return `<svg data-port="${portIdx}" viewBox="0 0 122 95" width="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;height:auto">
  <defs>
    <filter id="led-glow-${portIdx}" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
      <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0" result="intenseBlur"/>
      <feMerge>
        <feMergeNode in="intenseBlur"/>
        <feMergeNode in="intenseBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="pin-gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a67c00" />
      <stop offset="50%" stop-color="#d4a830" />
      <stop offset="100%" stop-color="#f9d978" />
    </linearGradient>
  </defs>
  <g transform="translate(0,94.625) scale(1,-1)">
    <g transform="translate(-57.91,-67.94)">
      <rect rx="4.5" ry="4.5" height="90.625" width="117.88" y="69.931" x="59.896"
        fill="#04020a" stroke="${outerStroke}" stroke-width="1"/>
      <rect rx="4.5" ry="0" height="6" width="117.88" y="69.931" x="59.896"
        fill="rgba(255,255,255,.03)"/>
      <path d="m73.958 75.66h89.41c2.3 0 4.17 1.86 4.17 4.17l0.0003 52.65h-21.74v9.41h-8.69l0.00004 12.59h-36.87l-0.00004-12.59h-8.69v-9.41h-21.74l-0.0003-52.65c0-2.31 1.86-4.17 4.17-4.17z"
        fill="#120e24" 
        stroke="rgba(var(--sw-uv), 0.2)" 
        stroke-width="1.2" />

      <path d="m73.958 75.66h89.41" 
        fill="none" 
        stroke="rgba(255,255,255,0.1)" 
        stroke-width="1" />

      <g transform="translate(0.5, 0)" opacity="${contactOp}">
        <rect height="22" width="4" y="76" x="80"  fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="90"  fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="100" fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="110" fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="120" fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="130" fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="140" fill="url(#pin-gold)" />
        <rect height="22" width="4" y="76" x="150" fill="url(#pin-gold)" />
      </g>
      <rect class="${lCls}" data-led="link" height="13.889" width="17.101" y="137.03" x="69.542"
        fill="${lCol}" stroke="rgba(0,0,0,.4)" stroke-width="1"${speedCls !== 'off' ? ` filter="url(#led-glow-${portIdx})"` : ''}/>
      <rect data-led="act" height="13.889" width="17.101" y="137.03" x="150.68"
        fill="${rCol}" stroke="rgba(0,0,0,.4)" stroke-width="1"/>
    </g>
  </g>
</svg>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CSS
 * ═══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  :host {
    display: block;
    border-radius: var(--ha-card-border-radius, 18px);
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  ha-card {
    container-type: inline-size;
    box-sizing: border-box;
    width: 100%;
    padding: 12px 10px 10px;
    font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
    --sw-accent:  ${CP_ACCENT};
    --sw-primary: ${CP_PRIMARY};
    --sw-gig:     ${CP_GIG};
    --sw-100:     ${CP_M100};
    --sw-10:      ${CP_M10};
    --sw-err:     var(--error-color, ${CP_ERR});
    --sw-dim:     ${CP_DIM};
    --sw-uv:      var(--rgb-primary-color, 98,0,234);
    --sw-cy:      var(--rgb-accent-color, 0,255,249);
    --sw-bl:      var(--rgb-blacklight-color, 180,0,255);
    --sw-er:      var(--rgb-error-color, 255,45,107);
  }

  @keyframes pulse-led {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.45; }
  }
  @keyframes hdr-glow {
    0%,100% { text-shadow: 0 0 6px var(--sw-hdr-color, var(--sw-accent)), 0 0 12px rgba(var(--sw-cy),.4); }
    50%      { text-shadow: 0 0 10px var(--sw-hdr-color, var(--sw-accent)), 0 0 22px rgba(var(--sw-cy),.7); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hdd-flicker {
    0%, 49%   { opacity: 1; }
    50%, 100% { opacity: 0.15; }
  }
  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 1;
      filter: drop-shadow(0 0 5px var(--sw-accent));
    }
    20%, 24%, 55% {
      opacity: 0.7;
      filter: none;
    }
  }
  
  [data-led="act"], rect[fill="#d4a830"] {
  filter: drop-shadow(0 0 1px rgba(212, 168, 48, 0.4));
  }

  .led-l-gig { animation: pulse-led 2s ease-in-out infinite; will-change: opacity; }
  .led-l-100 { animation: pulse-led 2.5s ease-in-out infinite; will-change: opacity; }
  .led-l-10  { animation: pulse-led 3.5s ease-in-out infinite; will-change: opacity; }
  .led-r-act { animation: hdd-flicker 0.18s step-end infinite; will-change: opacity; }

  ${NSW_IS_LOW_POWER ? `
  .led-l-gig, .led-l-100, .led-l-10 { animation: pulse-led 3s ease-in-out infinite; }
  .hdr-title { animation: none; }
  .port-num.on { animation: none; }
  ` : ''}

  .hdr {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px; padding-bottom: 10px;
    position: relative;
  }
  .hdr::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(var(--sw-uv),.55) 20%,
      rgba(var(--sw-cy),.3) 50%,
      rgba(var(--sw-uv),.55) 80%,
      transparent);
  }
  .hdr-icon {
    display: inline-flex; align-items: center;
    width: 18px; height: 18px; --mdc-icon-size: 18px;
    color: var(--sw-hdr-color, var(--sw-accent));
    filter: drop-shadow(0 0 4px var(--sw-hdr-color, var(--sw-accent)));
    flex-shrink: 0;
  }
  .hdr-title {
    flex: 1;
    font-size: var(--sw-hdr-size, 13px);
	letter-spacing: clamp(1px, 0.5cqi, 3px);
    text-transform: uppercase;
    color: var(--sw-hdr-color, var(--sw-accent));
    text-shadow: var(--sw-hdr-shadow, 0 0 6px var(--sw-hdr-color, var(--sw-accent)));
    animation: hdr-glow 3s ease-in-out infinite;
  }

  .chassis {
    background: linear-gradient(160deg, #16122a 0%, #0c0917 60%, #0f0c1e 100%);
    border: 1px solid rgba(var(--sw-uv),.28);
    border-radius: 7px;
    padding: 8px 6px 6px;
    box-shadow: inset 0 2px 12px rgba(0,0,0,.7), inset 0 0 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04);
  }
  .ports-row {
    display: flex; align-items: stretch; gap: 2px;
  }

  .port-wrap {
    flex: 1; 
    min-width: 0;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 2px;
    cursor: pointer; 
    border-radius: 5px; 
    padding: 3px 2px 2px;
    background: linear-gradient(180deg, rgba(20,15,35,0.8) 0%, rgba(10,8,20,0.9) 100%);
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.05), /* Petit reflet brillant en haut */
      inset 0 0 0 1px rgba(var(--sw-uv), 0.2),
      0 4px 10px rgba(0,0,0,0.5);
      
    transition: border-color .15s, background .15s;
    overflow: visible; /* Très important pour le port 1 */
    position: relative;
    border: none; 
  }
  .port-wrap::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
    pointer-events: none;
  }
  .port-wrap:hover { background: rgba(var(--sw-cy),.04); border-color: rgba(var(--sw-cy),.25); }
  .port-wrap.sel   {
    background: rgba(var(--sw-cy),.07); border-color: rgba(var(--sw-cy),.4);
    box-shadow: inset 0 1px 4px rgba(0,0,0,.6), 0 0 8px rgba(var(--sw-cy),var(--glow-opacity-idle, .08));
  }
  .port-wrap svg { display: block; width: 100%; height: auto; }

  .port-sep {
    width: 1.5px; align-self: stretch; min-height: 40px;
    background: linear-gradient(180deg, transparent, rgba(var(--sw-uv),.35), transparent);
    border-radius: 1px; margin: 0 2px;
  }
  .port-num {
    font-size: 8px; letter-spacing: .1em;
    color: rgba(255,255,255,.2); text-align: center; text-transform: uppercase;
  }
  .port-num.on {
    color: rgba(var(--sw-cy),.7);
    mix-blend-mode: screen;
    animation: flicker 4s infinite alternate;
  }

  .legend { display: flex; gap: clamp(3px, 1.2cqi, 9px); justify-content: center; margin-top: 7px; overflow: hidden; }
  .leg {
    display: flex; align-items: center; gap: 2px; white-space: nowrap;
    font-size: clamp(6px, 2cqi, 8px); color: rgba(255,255,255,.3); letter-spacing: .15em;
    font-weight: 500;
  }
  .leg-sq { width: clamp(5px, 1.5cqi, 8px); height: 5px; border-radius: 1px; flex-shrink: 0; }

  .info-panel {
    display: none; margin-top: 10px; padding: 8px 12px;
    background: rgba(var(--sw-cy),.04); border: 1px solid rgba(var(--sw-cy),.15);
    border-radius: 6px; animation: fade-in .18s ease;
  }
  .info-panel.visible { display: block; }
  .info-top { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
  .info-pname {
    flex: 1; font-size: 11px;
    letter-spacing: .18em; text-transform: uppercase; color: var(--sw-accent);
  }
  .info-close { font-size: 11px; color: rgba(255,255,255,.25); cursor: pointer; padding: 0 2px; line-height: 1; }
  .info-close:hover { color: rgba(255,255,255,.7); }
  .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .info-grid.disconnected { grid-template-columns: 1fr; }
  .info-cell { text-align: center; }
  .ic-l { display: block; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.3); }
  .ic-v { display: block; margin-top: 1px; font-size: 11px; letter-spacing: .05em; color: rgba(255,255,255,.8); }
  .ic-v.gig  { color: var(--sw-gig);  mix-blend-mode: screen; }
  .ic-v.m100 { color: var(--sw-100); mix-blend-mode: screen; }
  .ic-v.m10  { color: var(--sw-10);  mix-blend-mode: screen; }
  .ic-v.err  { color: var(--sw-err); mix-blend-mode: screen; }

  .footer { display: flex; gap: 7px; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(var(--sw-uv),.14); }
  .stat { flex: 1; background: rgba(var(--sw-uv),.06); border: 1px solid rgba(var(--sw-uv),.18); border-radius: 5px; padding: 5px 4px; text-align: center; }
  .stat-l { display: block; font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); }
  .stat-v { display: block; margin-top: 1px; font-size: 11px; letter-spacing: .06em; color: var(--sw-accent); mix-blend-mode: screen; }
  .stat-v.up   { color: var(--sw-gig); }
  .stat-v.down { color: var(--sw-primary); }
  .stat-v.sm  { font-size: 9px; }

  @container (max-width: 340px) {
    .hdr { margin-bottom: 8px; padding-bottom: 7px; }
    .info-grid { grid-template-columns: repeat(2, 1fr); }
    .hdr-title { font-size: var(--sw-hdr-size, 10px); letter-spacing: 1px; }
    .ic-l, .stat-l { font-size: 7px; }
    .ic-v, .stat-v  { font-size: 10px; }
    .chassis { padding: 5px 3px 4px; }
    .footer { gap: 4px; }
    .stat { padding: 4px 2px; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════
 *  CARD
 * ═══════════════════════════════════════════════════════════════════════════ */
class NeonSwitchCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._rendered  = false;
    this._rafId     = null;
    this._ac        = null;
    this._ro        = null;
    this._selected  = null;
    this._renderKey = null;
    this._ledDelays = {};
  }

  /* ── MD §9 : _cleanup() unique ────────────────────────────────────────── */
  _cleanup() {
    if (this._ac)    { this._ac.abort(); this._ac = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ro)    { this._ro.disconnect(); this._ro = null; }
  }

  setConfig(c) {
    this._cleanup();
    this._config = {
      title:       'GS108T · ProSafe',
      show_stats:  false,
      card_mod_bg: true,
      port_labels: [],
      port_icons:  [],
      ...(c || {}),
    };
    // Config changed → force full re-render
    this._rendered  = false;
    this._renderKey = null;
    if (this._hass) this._render();
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    if (!this._rendered) { this._render(); return; }
    /* MD §5 : RAF coalescing */
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._update();
    });
  }

  connectedCallback() {
    // Tab switch: shadow DOM persists — just re-attach observers + listeners
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    if (card && this._rendered) {
      // Re-attach AbortController-based listeners (killed on disconnect)
      if (!this._ac) {
        this._ac = new AbortController();
        const sig = { signal: this._ac.signal };
        const sr = this.shadowRoot;
        const closeBtn = sr.getElementById('info-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this._selectPort(null), sig);
        card.addEventListener('click', e => {
          if (!e.target.closest('.port-wrap') && !e.target.closest('.info-panel'))
            this._selectPort(null);
        }, sig);
        // Re-attach port click listeners
        sr.querySelectorAll('.port-wrap').forEach(wrap => {
          wrap.addEventListener('click', () => this._selectPort(+wrap.dataset.port), sig);
        });
      }
      this._reattachObservers(card);
      if (this._hass) this._update();
    }
  }

  disconnectedCallback() { this._cleanup(); }

  getCardSize() { return 3; }
  static getConfigElement() { return document.createElement('neon-switch-card-editor'); }
  static getStubConfig() {
    return { title: 'GS108T · ProSafe', show_stats: false, port_labels: [] };
  }

  /* ── Helpers entities ─────────────────────────────────────────────────── */
  _ent(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    return s ? { v: s.state, a: s.attributes } : null;
  }
  _portEnt(n, suffix) { return this._ent(`sensor.gs108t_port_${n}_${suffix}`); }
  _portBin(n)         { return this._ent(`binary_sensor.gs108t_port_${n}_status`); }

  _portData(n) {
    const bin = this._portBin(n);
    if (!bin || bin.v !== 'on') return { speedCls: 'off', isActive: false, ioRaw: 0 };

    const speedEnt = this._portEnt(n, 'link_speed');
    const rxEnt    = this._portEnt(n, 'receiving');
    const txEnt    = this._portEnt(n, 'sending');
    const rxTotEnt = this._portEnt(n, 'total_received');
    const txTotEnt = this._portEnt(n, 'total_sent');
    const ioEnt    = this._portEnt(n, 'io');

    const speedCls = _speedClass(speedEnt?.v, speedEnt?.a?.unit_of_measurement);
    const rxVal    = parseFloat(rxEnt?.v) || 0;
    const txVal    = parseFloat(txEnt?.v) || 0;
    const ioVal    = parseFloat(ioEnt?.v) || 0;

    return {
      speedCls,
      isActive: rxVal > 0 || txVal > 0 || ioVal > 0,
      ioRaw:    isNaN(ioVal) ? 0 : ioVal,
      rx:       rxEnt    ? _fmtRate(rxEnt.v,    rxEnt.a?.unit_of_measurement)     : '—',
      tx:       txEnt    ? _fmtRate(txEnt.v,    txEnt.a?.unit_of_measurement)     : '—',
      io:       ioEnt    ? _fmtRate(ioEnt.v,    ioEnt.a?.unit_of_measurement)     : '—',
      rxTotal:  rxTotEnt ? _fmtTotal(rxTotEnt.v, rxTotEnt.a?.unit_of_measurement) : '—',
      txTotal:  txTotEnt ? _fmtTotal(txTotEnt.v, txTotEnt.a?.unit_of_measurement) : '—',
    };
  }

  _makeKey() {
    let k = '';
    for (let n = 1; n <= 8; n++) {
      const d = this._portData(n);
      const ioBucket = d.ioRaw <= 0 ? 0 : d.ioRaw < 1 ? 1 : d.ioRaw < 10 ? 2 : d.ioRaw < 50 ? 3 : 4;
      k += `${d.speedCls}${d.isActive ? 1 : 0}${ioBucket}`;
    }
    const trx = this._ent('sensor.gs108t_switch_traffic_received');
    const ttx = this._ent('sensor.gs108t_switch_traffic_sent');
    k += (trx?.v || '') + (ttx?.v || '') + (this._config.title || '');
    return k;
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  /* ── Render initial ───────────────────────────────────────────────────── */
  _render() {
    const c  = this._config;
    const sr = this.shadowRoot;
    const hdr        = c.header || {};
    const showStats  = !!c.show_stats;
    const cardModBg  = c.card_mod_bg !== false;

    sr.innerHTML = `
      <style>${STYLES}
        ha-card {
          ${cardModBg ? '' : `background: ${c.color_bg || CP_BG};`}
          ${hdr.color       ? `--sw-hdr-color: ${hdr.color};`         : ''}
          ${hdr.title_size  ? `--sw-hdr-size: ${hdr.title_size};`     : ''}
          ${hdr.title_shadow? `--sw-hdr-shadow: ${hdr.title_shadow};` : ''}
        }
      </style>
      <ha-card>
        <div class="hdr" id="hdr">
          <span class="hdr-title" id="hdr-title">${hdr.title || c.title || 'GS108T · ProSafe'}</span>
        </div>
        <div class="chassis">
          <div class="ports-row" id="ports-row"></div>
          <div class="legend">
            <div class="leg"><div class="leg-sq" style="background:${CP_GIG};box-shadow:0 0 4px ${CP_GIG}"></div>1 Gbps</div>
            <div class="leg"><div class="leg-sq" style="background:${CP_M100};box-shadow:0 0 4px ${CP_M100}"></div>100M</div>
            <div class="leg"><div class="leg-sq" style="background:${CP_M10};box-shadow:0 0 4px ${CP_M10}"></div>10M</div>
            <div class="leg"><div class="leg-sq" style="background:${CP_ACCENT};opacity:.6"></div>Actif</div>
            <div class="leg"><div class="leg-sq" style="background:#1a1530;border:1px solid rgba(255,255,255,.08)"></div>Off</div>
          </div>
        </div>
        <div class="info-panel" id="info-panel">
          <div class="info-top">
            <span class="info-pname" id="info-pname"></span>
            <span class="info-close" id="info-close">✕</span>
          </div>
          <div class="info-grid" id="info-grid"></div>
        </div>
        ${showStats ? `<div class="footer">
          <div class="stat"><span class="stat-l">Ports actifs</span><span class="stat-v" id="st-ports">—</span></div>
          <div class="stat"><span class="stat-l">↓ Trafic</span><span class="stat-v down" id="st-rx">—</span></div>
          <div class="stat"><span class="stat-l">↑ Trafic</span><span class="stat-v up" id="st-tx">—</span></div>
          <div class="stat"><span class="stat-l">Firmware</span><span class="stat-v sm" id="st-fw">—</span></div>
        </div>` : ''}
      </ha-card>`;

    /* Icône header via createElement — jamais innerHTML */
    if (hdr.icon) {
      const ico = document.createElement('ha-icon');
      ico.setAttribute('icon', hdr.icon);
      ico.className = 'hdr-icon';
      sr.getElementById('hdr').insertBefore(ico, sr.getElementById('hdr-title'));
    }

    /* AbortController avant _buildPorts (signal utilisé dedans) */
    this._ac = new AbortController();
    const sig = { signal: this._ac.signal };

    this._buildPorts();

    sr.getElementById('info-close').addEventListener('click', () => this._selectPort(null), sig);
    sr.querySelector('ha-card').addEventListener('click', e => {
      if (!e.target.closest('.port-wrap') && !e.target.closest('.info-panel'))
        this._selectPort(null);
    }, sig);

    this._rendered = true;

    this._reattachObservers(sr.querySelector('ha-card'));
    this._update();
  }

  /* ── Re-attach observers after tab switch (no DOM rebuild) ──────────── */
  _reattachObservers(card) {
    if (!card) return;
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver(() => {
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
          this._rafId = 0;
          this._renderKey = null;
          this._update();
        });
      });
      this._ro.observe(card);
    }
  }

  /* ── Build ports ──────────────────────────────────────────────────────── */
  _buildPorts() {
    const row = this.shadowRoot.getElementById('ports-row');
    if (!row) return;
    row.innerHTML = '';

    for (let n = 1; n <= 8; n++) {
      if (n === 5) {
        const sep = document.createElement('div');
        sep.className = 'port-sep';
        row.appendChild(sep);
      }
      const d     = this._portData(n);
      const label = this._config.port_labels?.[n - 1] || `P${n}`;
      const icon  = this._config.port_icons?.[n - 1] || '';
      const wrap  = document.createElement('div');
      wrap.className    = 'port-wrap';
      wrap.dataset.port = n;
      const uniqueDelay = -((n * 0.77) % 4).toFixed(2);
      wrap.innerHTML    = _rj45SVG(n, d.speedCls)
        + `<div class="port-num${d.speedCls !== 'off' ? ' on' : ''}" data-pnum="${n}" style="animation-delay: ${uniqueDelay}s !important;"></div>`;
      const pnumEl = wrap.querySelector('.port-num');
      if (icon) {
        const ico = document.createElement('ha-icon');
        ico.setAttribute('icon', icon);
        ico.style.cssText = '--mdc-icon-size:12px;display:block;';
        pnumEl.appendChild(ico);
      } else {
        pnumEl.textContent = label;
      }
      wrap.addEventListener('click', () => this._selectPort(n), { signal: this._ac.signal });
      row.appendChild(wrap);
    }
  }

  /* ── Select port ──────────────────────────────────────────────────────── */
  _selectPort(n) {
    const sr    = this.shadowRoot;
    const panel = sr.getElementById('info-panel');
    if (!panel) return;

    if (this._selected === n || n === null) {
      this._selected = null;
      sr.querySelectorAll('.port-wrap.sel').forEach(el => el.classList.remove('sel'));
      panel.classList.remove('visible');
      return;
    }
    this._selected = n;
    sr.querySelectorAll('.port-wrap.sel').forEach(el => el.classList.remove('sel'));
    sr.querySelector(`.port-wrap[data-port="${n}"]`)?.classList.add('sel');
    this._renderInfoPanel(n);
    panel.classList.remove('visible');
    void panel.offsetWidth;
    panel.classList.add('visible');
    this._moreInfo(`binary_sensor.gs108t_port_${n}_status`);
  }

  _renderInfoPanel(n) {
    const sr    = this.shadowRoot;
    const pname = sr.getElementById('info-pname');
    const grid  = sr.getElementById('info-grid');
    if (!pname || !grid) return;

    const label = this._config.port_labels?.[n - 1] || null;
    pname.textContent = `Port ${n}${label ? ' · ' + label : ''}`;

    const d = this._portData(n);
    if (d.speedCls === 'off') {
      grid.className = 'info-grid disconnected';
      grid.innerHTML = `<div class="info-cell"><span class="ic-v err">Déconnecté</span></div>`;
      return;
    }
    const sc = d.speedCls === 'gig' ? 'gig' : d.speedCls === 'm100' ? 'm100' : 'm10';
    const sl = d.speedCls === 'gig' ? '1 Gbps' : d.speedCls === 'm100' ? '100 Mbps' : '10 Mbps';
    grid.className = 'info-grid';
    grid.innerHTML = `
      <div class="info-cell"><span class="ic-l">Vitesse</span><span class="ic-v ${sc}">${sl}</span></div>
      <div class="info-cell"><span class="ic-l">↓ Reçu</span><span class="ic-v">${d.rxTotal}</span></div>
      <div class="info-cell"><span class="ic-l">↑ Envoyé</span><span class="ic-v">${d.txTotal}</span></div>
      <div class="info-cell"><span class="ic-l">Trafic</span><span class="ic-v">${d.io}</span></div>`;
  }

  /* ── Update chirurgical ───────────────────────────────────────────────── */
  _update() {
    const sr = this.shadowRoot;
    if (!sr || !this._hass) return;

    const key = this._makeKey();
    if (key === this._renderKey) return;
    this._renderKey = key;

    for (let n = 1; n <= 8; n++) {
      const wrap = sr.querySelector(`.port-wrap[data-port="${n}"]`);
      if (!wrap) continue;
      const svg = wrap.querySelector('svg');
      if (!svg) continue;

      const d = this._portData(n);

      /* LED link */
      const ledLink = svg.querySelector('[data-led="link"]');
      if (ledLink) {
        const lCol = { gig: CP_GIG, m100: CP_M100, m10: CP_M10, off: '#0d0a1a' }[d.speedCls];
        const lCls = d.speedCls === 'gig' ? 'led-l-gig' : d.speedCls === 'm100' ? 'led-l-100' : d.speedCls === 'm10' ? 'led-l-10' : '';
        ledLink.setAttribute('fill', lCol);
        if (ledLink.getAttribute('class') !== lCls) ledLink.setAttribute('class', lCls);
        if (lCls) {
          ledLink.style.setProperty('will-change', 'opacity');
          if (!this._ledDelays[n]) this._ledDelays[n] = { link: -(Math.random() * 3).toFixed(2), act: -(Math.random() * 0.18).toFixed(3) };
          ledLink.style.setProperty('animation-delay', this._ledDelays[n].link + 's');
        } else {
          ledLink.style.removeProperty('will-change');
          ledLink.style.removeProperty('animation-delay');
        }
      }

      /* Contour */
      const outerRect = svg.querySelector('rect:not([data-led])');
      if (outerRect) outerRect.setAttribute('stroke', d.speedCls !== 'off' ? 'rgba(98,0,234,.38)' : 'rgba(98,0,234,.12)');

      /* Contacts */
      const contacts = svg.querySelector('g[opacity]');
      if (contacts) contacts.setAttribute('opacity', d.speedCls !== 'off' ? '0.88' : '0.1');

      /* LED act */
      const ledAct = svg.querySelector('[data-led="act"]');
      if (ledAct) {
        if (d.isActive) {
          ledAct.setAttribute('fill', CP_ACCENT);
          if (ledAct.getAttribute('class') !== 'led-r-act') {
              ledAct.setAttribute('class', 'led-r-act');
          }
          ledAct.style.setProperty('will-change', 'opacity');

          if (!this._ledDelays[n]) {
              this._ledDelays[n] = { 
                  link: -((n * 0.77) % 4).toFixed(2), 
                  act: -((n * 0.41) % 1).toFixed(2) 
              };
          }
          ledAct.style.setProperty('animation-delay', this._ledDelays[n].act + 's');
          ledAct.setAttribute('filter', `url(#led-glow-${n})`);

          const filterUrl = `url(#led-glow-${n})`;
          if (ledAct.getAttribute('filter') !== filterUrl) {
              ledAct.setAttribute('filter', filterUrl);
          }

        } else {
          const rCol = d.speedCls !== 'off' ? 'rgba(0,255,249,.1)' : '#310062';
          ledAct.setAttribute('fill', rCol);
          ledAct.removeAttribute('class');
          ledAct.style.removeProperty('animation-delay'); // On nettoie aussi le delay
          ledAct.removeAttribute('filter');
        }
      }

      /* Label */
      const pnum  = wrap.querySelector('.port-num');
      const label = this._config.port_labels?.[n - 1] || `P${n}`;
      const icon  = this._config.port_icons?.[n - 1] || '';
      if (pnum) {
        if (icon) {
          let ico = pnum.querySelector('ha-icon');
          if (!ico) { pnum.textContent = ''; ico = document.createElement('ha-icon'); ico.style.cssText = '--mdc-icon-size:12px;display:block;'; pnum.appendChild(ico); }
          if (ico.getAttribute('icon') !== icon) ico.setAttribute('icon', icon);
        } else {
          if (pnum.querySelector('ha-icon')) pnum.innerHTML = '';
          if (pnum.textContent !== label) pnum.textContent = label;
        }
        pnum.classList.toggle('on', d.speedCls !== 'off');
      }
    }

    // title may change via UI editor without full re-render
    const titleEl = sr.getElementById('hdr-title');
    const hdr     = this._config.header || {};
    const title   = hdr.title || this._config.title || 'GS108T · ProSafe';
    if (titleEl && titleEl.textContent !== title) titleEl.textContent = title;

    if (this._selected) this._renderInfoPanel(this._selected);
    if (this._config.show_stats) this._updateStats();
  }

  _updateStats() {
    const sr = this.shadowRoot;
    const stPorts = sr.getElementById('st-ports');
    const stRx    = sr.getElementById('st-rx');
    const stTx    = sr.getElementById('st-tx');
    const stFw    = sr.getElementById('st-fw');
    if (!stPorts) return;

    let active = 0;
    for (let n = 1; n <= 8; n++) { if (this._portBin(n)?.v === 'on') active++; }
    stPorts.textContent = `${active} / 8`;

    const trx = this._ent('sensor.gs108t_switch_traffic_received');
    const ttx = this._ent('sensor.gs108t_switch_traffic_sent');
    stRx.textContent = trx ? _fmtRate(trx.v, trx.a?.unit_of_measurement) : '—';
    stTx.textContent = ttx ? _fmtRate(ttx.v, ttx.a?.unit_of_measurement) : '—';

    const fw = this._ent('sensor.gs108t_switch_firmware');
    if (stFw) stFw.textContent = fw?.v || '—';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  EDITOR — render une seule fois, update valeurs sans rebuild
 * ═══════════════════════════════════════════════════════════════════════════ */
class NeonSwitchCardEditor extends HTMLElement {

  setConfig(c) {
    this._config = {
      title:       'GS108T · ProSafe',
      show_stats:  false,
      card_mod_bg: true,
      port_labels: [],
      port_icons:  [],
      ...(c || {}),
    };
    /* Render une seule fois — ensuite on patch les valeurs */
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }

  set hass(h) { this._hass = h; }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _set(key, val, isChecked) {
    const parts = key.split('.');
    if (parts.length === 2) {
      const [obj, subkey] = parts;
      if (!this._config[obj] || typeof this._config[obj] !== 'object') this._config[obj] = {};
      if (isChecked !== undefined) { this._config[obj][subkey] = isChecked; }
      else if (val === '' || val === null) { delete this._config[obj][subkey]; }
      else { this._config[obj][subkey] = val; }
    } else {
      if (isChecked !== undefined) { this._config[key] = isChecked; }
      else if (val === '' || val === null) { delete this._config[key]; }
      else { this._config[key] = val; }
    }
    this._fire();
  }

  _setLabel(i, val) {
    const arr = [...(this._config.port_labels || Array(8).fill(''))];
    arr[i] = val;
    this._config.port_labels = arr;
    this._fire();
  }

  _setIcon(i, val) {
    const arr = [...(this._config.port_icons || Array(8).fill(''))];
    arr[i] = val || '';
    this._config.port_icons = arr;
    this._fire();
  }

  /* Sync valeurs sans rebuild DOM */
  _syncValues() {
    const c = this._config;
    const titleInp = this.querySelector('[data-key="header.title"]');
    if (titleInp && document.activeElement !== titleInp) titleInp.value = (c.header && c.header.title) || '';

    const labels = c.port_labels || [];
    this.querySelectorAll('.ep-label').forEach(inp => {
      if (document.activeElement !== inp) inp.value = labels[+inp.dataset.idx] || '';
    });
    const icons = c.port_icons || [];
    this.querySelectorAll('.ep-icon').forEach(inp => {
      if (document.activeElement !== inp) {
        inp.value = icons[+inp.dataset.idx] || '';
        this._updateIconPreview(inp);
      }
    });
  }

  _toggle(label, key) {
    const on = !!this._config[key];
    return `<div class="field tog-row">
      <label>${label}</label>
      <label style="position:relative;display:inline-block;width:42px;height:24px;flex-shrink:0;">
        <input type="checkbox" data-key="${key}" ${on ? 'checked' : ''}
          style="opacity:0;width:0;height:0;position:absolute;"/>
        <span style="position:absolute;inset:0;border-radius:99px;cursor:pointer;transition:background .2s;
          background:${on ? CP_ACCENT : 'rgba(255,255,255,0.12)'};">
          <span style="position:absolute;top:3px;border-radius:50%;width:18px;height:18px;transition:left .2s;
            left:${on ? '21px' : '3px'};background:${on ? '#1a1a1a' : 'rgba(255,255,255,0.6)'};">
          </span>
        </span>
      </label>
    </div>`;
  }

  _render() {
    const c      = this._config || {};
    const labels = c.port_labels || Array(8).fill('');
    const icons  = c.port_icons  || Array(8).fill('');

    let portsHTML = '';
    for (let i = 0; i < 8; i++) {
      portsHTML += `
        <div class="field">
          <label>Port ${i + 1}</label>
          <div class="port-row">
            <div class="icon-preview" data-idx="${i}"></div>
            <input type="text" class="ep ep-icon" data-idx="${i}"
              value="${icons[i] || ''}" placeholder="mdi:desktop-tower" list="nsw-mdi-list"/>
            <input type="text" class="ep ep-label" data-idx="${i}"
              value="${labels[i] || ''}" placeholder="label"/>
          </div>
        </div>`;
    }
    const MDI_SUGGESTIONS = [
      'mdi:desktop-tower','mdi:desktop-classic','mdi:laptop','mdi:server','mdi:server-network',
      'mdi:nas','mdi:router-network','mdi:router-network-wireless','mdi:router','mdi:wifi',
      'mdi:television','mdi:printer','mdi:printer-wireless','mdi:camera','mdi:cctv',
      'mdi:phone-voip','mdi:phone','mdi:speaker','mdi:gamepad-variant','mdi:raspberry-pi',
      'mdi:home-automation','mdi:home-assistant','mdi:hub','mdi:network-strength-4',
      'mdi:ethernet','mdi:ethernet-cable','mdi:switch','mdi:lan','mdi:lan-connect',
      'mdi:solar-panel','mdi:solar-panel-large','mdi:battery-charging','mdi:car',
      'mdi:car-electric','mdi:synology-nas','mdi:harddisk','mdi:database',
    ];

    this.innerHTML = `
      <style>
        *{box-sizing:border-box;font-family:-apple-system,sans-serif}
        .grid{display:flex;flex-direction:column;gap:10px;padding:14px 0}
        .group{border:1px solid var(--divider-color,#333);border-radius:10px;padding:12px}
        .group-title{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:10px}
        .field{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
        .field:last-child{margin-bottom:0}
        label{font-size:12px;color:var(--secondary-text-color)}
        input[type=text]{padding:8px 10px;border:1px solid var(--divider-color,#333);border-radius:7px;
          background:var(--card-background-color);color:var(--primary-text-color);font-size:13px;width:100%}
        input.ep{border-color:var(--primary-color,#777)}
        input.ep:focus{outline:none;box-shadow:0 0 0 1px var(--primary-color)}
        .tog-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .tog-row label{margin:0;font-size:12px;color:var(--secondary-text-color)}
        .port-row{display:flex;gap:6px;align-items:center}
        .port-row .ep-icon{width:140px;flex-shrink:0}
        .port-row .ep-label{flex:1;min-width:0}
        .icon-preview{width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
          border:1px solid var(--divider-color,#444);border-radius:6px;color:var(--primary-text-color)}
      </style>
      <div class="grid">
        <div class="group">
          <div class="group-title">Général</div>
          <div class="field">
            <label>Titre</label>
            <input type="text" class="ep" data-key="header.title" value="${(c.header && c.header.title) || ''}" placeholder="GS108T · ProSafe"/>
          </div>
          ${this._toggle('Afficher les stats globales', 'show_stats')}
          ${this._toggle('Hériter du fond card-mod', 'card_mod_bg')}
        </div>
        <div class="group">
          <div class="group-title">Ports — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:9px;letter-spacing:.05em;text-transform:none">parcourir MDI ↗</a></div>
          ${portsHTML}
        </div>
      </div>
      <datalist id="nsw-mdi-list">${MDI_SUGGESTIONS.map(v => `<option value="${v}">`).join('')}</datalist>`;

    this.querySelectorAll('input[data-key]').forEach(inp => {
      inp.addEventListener(inp.type === 'checkbox' ? 'change' : 'input', () => {
        if (inp.type === 'checkbox') this._set(inp.dataset.key, null, inp.checked);
        else this._set(inp.dataset.key, inp.value);
      });
    });
    this.querySelectorAll('.ep-label').forEach(inp => {
      inp.addEventListener('input', () => this._setLabel(+inp.dataset.idx, inp.value));
    });
    this.querySelectorAll('.ep-icon').forEach(inp => {
      inp.addEventListener('focus', () => { inp._saved = inp.value; inp.value = ''; });
      inp.addEventListener('blur',  () => { if (!inp.value) { inp.value = inp._saved || ''; this._updateIconPreview(inp); } });
      inp.addEventListener('input', () => {
        this._setIcon(+inp.dataset.idx, inp.value);
        this._updateIconPreview(inp);
      });
      this._updateIconPreview(inp);
    });
  }

  _updateIconPreview(inp) {
    const preview = this.querySelector(`.icon-preview[data-idx="${inp.dataset.idx}"]`);
    if (!preview) return;
    const val = inp.value.trim();
    preview.innerHTML = '';
    if (val.match(/^mdi:[a-zA-Z0-9_-]+$/)) {
      const ico = document.createElement('ha-icon');
      ico.setAttribute('icon', val);
      ico.style.cssText = '--mdc-icon-size:20px';
      preview.appendChild(ico);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  REGISTER
 * ═══════════════════════════════════════════════════════════════════════════ */
if (!customElements.get('neon-switch-card'))
  customElements.define('neon-switch-card', NeonSwitchCard);
if (!customElements.get('neon-switch-card-editor'))
  customElements.define('neon-switch-card-editor', NeonSwitchCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-switch-card',
  name: 'Neon Switch Card',
  description: 'Netgear GS108T — 8 ports RJ45 avec LEDs Neo Tokyo',
  preview: true,
});

console.info('%c NEON-SWITCH-CARD %c v1.4 ',
  'background:#00fff9;color:#040614;font-weight:700;',
  'background:#B400FF;color:#fff;');

})();

console.info(
  '%c 🔌 neon-switch-card v1.6 %c Neo Tokyo ',
  'background:#2EE5B6;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#6200EA;padding:2px 4px;border-radius:0 3px 3px 0;'
);
