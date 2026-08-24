/* ── neon-switch-card v1.7 ── */
(() => {

/* ── Device detection (MD §1) ───────────────────────────────────────────── */
const NSW_IS_IPAD      = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NSW_IS_LOW_POWER = NSW_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

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
    if (/(^|\D)1000(\D|$)/.test(s) || /\b1g\b/.test(s)) return 'gig';
    if (/(^|\D)100(\D|$)/.test(s))  return 'm100';
    if (/(^|\D)10(\D|$)/.test(s))   return 'm10';
    return 'off';
  }
  const u = (unit || '').toLowerCase();
  if (u.includes('gbit') || u === 'gbps' || u === 'gb/s') n *= 1000;
  if (n >= 1000) return 'gig';
  if (n >= 100)  return 'm100';
  if (n > 0)     return 'm10';
  return 'off';
}

/* Mappe le débit réel d'un port (ioRaw en MB/s) sur l'aspect visuel de la LED d'activité
 * + le halo du numéro de port. Échelle log (les débits réseau s'étalent sur plusieurs
 * ordres de grandeur) : repos → calme & sans halo, saturé → flicker rapide & halo intense. */
function _ioVisual(ioRaw) {
  const io = parseFloat(ioRaw);
  if (!io || io <= 0 || isNaN(io)) return { dur: 0.5, glow: 0, op: 0 };
  const LO = 0.02, HI = 125;                                  // bornes MB/s (125 MB/s = plafond réaliste d'un port Gigabit)
  const x = Math.max(LO, Math.min(io, HI));
  const t = (Math.log10(x) - Math.log10(LO)) / (Math.log10(HI) - Math.log10(LO)); // 0..1
  return {
    dur:  +(0.6 - t * (0.6 - 0.07)).toFixed(3),  // s : 0.6 (repos) → 0.07 (saturé)
    glow: +(2 + t * 10).toFixed(1),              // px : rayon du halo
    op:   +(0.15 + t * 0.55).toFixed(2),         // opacité du halo
  };
}

/* Tooltip natif d'un port (title=), label + vitesse de lien.
   Pas de débit ici : _makeKey() bucketise l'io, donc un title mis à jour uniquement au
   rafraîchissement DOM afficherait une valeur périmée entre deux changements de bucket.
   Le débit précis reste dans l'info-panel (_renderInfoPanel), recalculé à chaque sélection. */
function _portTitle(n, label, d) {
  if (d.speedCls === 'off') return `Port ${n} · ${label} — déconnecté`;
  const sl = d.speedCls === 'gig' ? '1 Gbps' : d.speedCls === 'm100' ? '100 Mbps' : '10 Mbps';
  return `Port ${n} · ${label} — ${sl}`;
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
  @keyframes nmc-flicker {
    0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; filter: brightness(1); }
    20%, 24%, 55% { opacity: .8; filter: brightness(1.4) contrast(1.2); }
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
  /* vitesse de clignotement pilotée par le débit réel du port (var --act-dur, défaut = repos) */
  .led-r-act { animation: hdd-flicker var(--act-dur, 0.5s) step-end infinite; will-change: opacity; }

  ${NSW_IS_LOW_POWER ? `
  /* iPad/mobile : on GARDE les LED qui respirent (l'âme de la card) mais ralenties,
     et on coupe le coûteux : flicker d'activité rapide (repaint 10 fps) + glow header animé. */
  .led-l-gig, .led-l-100, .led-l-10 { animation: pulse-led 4s ease-in-out infinite; }
  .led-r-act { animation: none; }       /* flicker rapide = le vrai gouffre GPU */
  .nmc-title { animation: none !important; }
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
  /* ── bloc header canonique (nmc-icon-wrap / nmc-title, cf skill ha-neon-css) ── */
  .nmc-icon-wrap { display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:visible; }
  .nmc-icon-wrap ha-icon { overflow:visible; }
  .nmc-title { flex: 1; overflow: visible; line-height: 1.2; }

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
    contain: layout; /* paint clipperait le glow SVG qui déborde (cf overflow:visible ci-dessus) */
  }
  .port-wrap:focus-visible {
    outline: 2px solid rgba(var(--sw-cy), .9);
    outline-offset: 2px;
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
    /* halo de débit : intensité pilotée par l'I/O réel du port (--io-glow px / --io-op opacité) */
    text-shadow: 0 0 var(--io-glow, 0px) rgba(var(--sw-cy), var(--io-op, 0));
    transition: text-shadow .5s ease;
  }

  .legend { display: flex; gap: clamp(3px, 1.2cqi, 9px); justify-content: center; margin-top: 7px; overflow: hidden; }
  .leg {
    display: flex; align-items: center; gap: 2px; white-space: nowrap;
    font-size: clamp(6px, 2cqi, 8px); color: rgba(255,255,255,.3); letter-spacing: .15em;
    font-weight: 500;
  }
  .leg-sq { width: clamp(5px, 1.5cqi, 8px); height: 5px; border-radius: 1px; flex-shrink: 0; }

  .info-panel {
    visibility: hidden; opacity: 0; max-height: 0; overflow: hidden;
    margin-top: 0; padding: 0 12px;
    background: rgba(var(--sw-cy),.04); border: 1px solid rgba(var(--sw-cy),.15);
    border-radius: 6px; transform: translateY(-6px);
    transition: opacity .18s ease, transform .18s ease, max-height .18s ease, margin-top .18s ease;
  }
  .info-panel.visible {
    visibility: visible; opacity: 1; max-height: 200px;
    margin-top: 10px; padding: 8px 12px; transform: translateY(0);
  }
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
    .nmc-title { font-size: 10px; letter-spacing: 1px; }
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

  /** Crée le shadow DOM et initialise l'état d'instance (aucun rendu ici, cf setConfig/hass). */
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
    /* flicker header canonique — initialisés AVANT tout _render() (cf skill ha-neon-css,
       piège "animation:nmc-flicker undefineds" si posé après) */
    this._flickDur = 3.5 + Math.random() * 2;
    this._flickOff = -2 + Math.random() * 2;
  }

  /* Charge une police Google Fonts à la demande, une seule fois par famille
     (cache module-level partagé par toutes les instances). Cf skill ha-neon-css,
     piège "police choisie dans l'éditeur silencieusement jamais chargée". */
  static _loadGoogleFont(family) {
    if (!family) return;
    if (!NeonSwitchCard._loadedFonts) NeonSwitchCard._loadedFonts = new Set();
    if (NeonSwitchCard._loadedFonts.has(family)) return;
    NeonSwitchCard._loadedFonts.add(family);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;600;700;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  /* ── MD §9 : _cleanup() unique ────────────────────────────────────────── */
  _cleanup() {
    if (this._ac)    { this._ac.abort(); this._ac = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ro)    { this._ro.disconnect(); this._ro = null; }
  }

  /**
   * Appelé par Lovelace à la (ré)écriture de la config YAML/UI de la card.
   * @param {object} c - config brute de la card (peut être partielle/incomplète en cours d'édition).
   */
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

  /** Appelé par Lovelace à chaque mise à jour de l'état HA — coalesce les rendus via RAF (cf plus bas). */
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

  /** Appelé par le DOM à l'insertion de l'élément (y compris re-insertion après un changement d'onglet). */
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
        // Re-attach port click + keyboard listeners
        sr.querySelectorAll('.port-wrap').forEach(wrap => {
          const n = +wrap.dataset.port;
          wrap.addEventListener('click', () => this._selectPort(n), sig);
          wrap.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._selectPort(n); }
          }, sig);
        });
      }
      this._reattachObservers(card);
      if (this._hass) this._update();
    }
  }

  /** Appelé par le DOM au retrait de l'élément (changement d'onglet, fermeture de dashboard) — libère RAF/observer/listeners. */
  disconnectedCallback() { this._cleanup(); }

  /** Hauteur relative de la card pour le layout Lovelace (unité HA = ~50px). */
  getCardSize() { return 3; }
  /** Appelé par Lovelace pour instancier l'éditeur graphique de cette card dans l'UI de dashboard. */
  static getConfigElement() { return document.createElement('neon-switch-card-editor'); }

  /** Config par défaut proposée quand Chris ajoute la card depuis le picker Lovelace. */
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

  /* ── Render initial ───────────────────────────────────────────────────── */
  _render() {
    const c  = this._config;
    const sr = this.shadowRoot;
    const hdr        = c.header || {};
    const showHeader = hdr.show !== false;
    const showStats  = !!c.show_stats;
    const cardModBg  = c.card_mod_bg !== false;

    /* ── bloc header canonique — calcul des variables (cf skill ha-neon-css) ── */
    if (hdr.font) NeonSwitchCard._loadGoogleFont(hdr.font);
    const tFontFamily = hdr.font ? `'${hdr.font}', var(--primary-font-family, sans-serif)` : 'var(--primary-font-family, sans-serif)';
    const tFontSize   = hdr.title_size || '16px';
    const tFontWeight = hdr.font_weight ?? 700;
    const tLetterSp   = hdr.letter_spacing || 'clamp(1px, 0.5cqi, 3px)';
    const tUppercase  = hdr.uppercase === false ? 'none' : 'uppercase';
    const tItalic     = hdr.italic ? 'italic' : 'normal';
    const tColor      = hdr.color || 'var(--primary-color)';
    const tIconColor  = hdr.icon_color || tColor;
    const tIconSize   = hdr.icon_size || '20px';
    const tGlowOn     = hdr.glow !== false;
    const tGlowColor  = hdr.glow_color || tColor;
    const tGlowSize   = hdr.glow_size || '10px';
    const tGlowSizeN  = parseFloat(tGlowSize) || 10;
    const tGlowShadow = tGlowOn
      ? `0 0 ${Math.round(tGlowSizeN*0.2)}px #fff, 0 0 ${tGlowSize} ${tGlowColor}, 0 0 calc(${tGlowSize} * 2) ${tGlowColor}`
      : 'none';
    const tIconGlow = tGlowOn
      ? `drop-shadow(0 0 ${Math.round(tGlowSizeN*0.2)}px #fff) drop-shadow(0 0 ${Math.round(tGlowSizeN*0.4)}px ${tGlowColor}) drop-shadow(0 0 ${Math.round(tGlowSizeN*0.8)}px ${tGlowColor}) drop-shadow(0 0 ${tGlowSizeN}px ${tGlowColor})`
      : 'none';
    const tGradOn     = !!hdr.gradient;
    const tGradFrom   = hdr.gradient_from || tColor;
    const tGradTo     = hdr.gradient_to || 'var(--accent-color)';
    const tFlickOn    = !!hdr.flicker;
    const tFlickAnim  = tFlickOn
      ? `nmc-flicker ${this._flickDur}s ease-in-out ${this._flickOff}s infinite`
      : 'none';

    sr.innerHTML = `
      <style>${STYLES}
        ha-card {
          ${cardModBg ? '' : `background: ${c.color_bg || CP_BG};`}
        }
        .nmc-title {
          font-family: ${tFontFamily};
          font-size: ${tFontSize};
          font-weight: ${tFontWeight};
          letter-spacing: ${tLetterSp};
          text-transform: ${tUppercase};
          font-style: ${tItalic};
          text-shadow: ${tGlowShadow};
          animation: ${tFlickAnim};
          ${tGradOn
            ? `background: linear-gradient(90deg, ${tGradFrom}, ${tGradTo}); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;`
            : `color: ${tColor};`}
        }
        .nmc-icon-wrap ha-icon {
          color: ${tIconColor};
          --mdc-icon-size: ${tIconSize};
          filter: ${tIconGlow};
        }
      </style>
      <ha-card>
        ${showHeader ? `<div class="hdr" id="hdr">
          <div class="nmc-icon-wrap" id="hdr-icon-wrap"></div>
          <div class="nmc-title" id="hdr-title">${hdr.title || c.title || 'GS108T · ProSafe'}</div>
        </div>` : ''}
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
    if (showHeader && hdr.icon) {
      const ico = document.createElement('ha-icon');
      ico.setAttribute('icon', hdr.icon);
      sr.getElementById('hdr-icon-wrap').appendChild(ico);
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
      wrap.tabIndex      = 0;
      wrap.setAttribute('role', 'button');
      wrap.title          = _portTitle(n, label, d);
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
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._selectPort(n); }
      }, { signal: this._ac.signal });
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

  /* Cache les références DOM par port (structure SVG figée après le 1er rendu) —
   * évite de refaire 7 querySelector × 8 ports à CHAQUE frame d'état. Invalidé
   * automatiquement si le wrap n'est plus attaché (re-render complet de la card). */
  _domCache(sr, n) {
    if (!this._portDom) this._portDom = new Map();
    const cached = this._portDom.get(n);
    if (cached && cached.wrap.isConnected) return cached;

    const wrap = sr.querySelector(`.port-wrap[data-port="${n}"]`);
    if (!wrap) return null;
    const svg = wrap.querySelector('svg');
    if (!svg) return null;

    const entry = {
      wrap, svg,
      ledLink:   svg.querySelector('[data-led="link"]'),
      outerRect: svg.querySelector('rect:not([data-led])'),
      contacts:  svg.querySelector('g[opacity]'),
      ledAct:    svg.querySelector('[data-led="act"]'),
      pnum:      wrap.querySelector('.port-num'),
    };
    this._portDom.set(n, entry);
    return entry;
  }

  /* ── Update chirurgical ───────────────────────────────────────────────── */
  _update() {
    const sr = this.shadowRoot;
    if (!sr || !this._hass) return;

    const key = this._makeKey();
    if (key === this._renderKey) return;
    this._renderKey = key;

    for (let n = 1; n <= 8; n++) {
      const dom = this._domCache(sr, n);
      if (!dom) continue;
      const { wrap, svg } = dom;

      const d = this._portData(n);
      const label = this._config.port_labels?.[n - 1] || `P${n}`;
      wrap.title = _portTitle(n, label, d);

      /* LED link */
      const ledLink = dom.ledLink;
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
      const outerRect = dom.outerRect;
      if (outerRect) outerRect.setAttribute('stroke', d.speedCls !== 'off' ? 'rgba(98,0,234,.38)' : 'rgba(98,0,234,.12)');

      /* Contacts */
      const contacts = dom.contacts;
      if (contacts) contacts.setAttribute('opacity', d.speedCls !== 'off' ? '0.88' : '0.1');

      /* LED act */
      const ledAct = dom.ledAct;
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

          /* vitesse de clignotement pilotée par le débit réel du port.
           * ⚠️ CSS ne redémarre PAS une animation en cours quand une custom property
           * qu'elle référence (var(--act-dur)) change — il faut forcer un reflow. */
          const iov = _ioVisual(d.ioRaw);
          const prevDur = ledAct.style.getPropertyValue('--act-dur');
          const nextDur = iov.dur + 's';
          if (prevDur !== nextDur) {
            ledAct.style.setProperty('--act-dur', nextDur);
            ledAct.style.animation = 'none';
            void ledAct.offsetHeight; // force reflow
            ledAct.style.animation = '';
          }

          const filterUrl = `url(#led-glow-${n})`;
          if (ledAct.getAttribute('filter') !== filterUrl) {
              ledAct.setAttribute('filter', filterUrl);
          }

        } else {
          const rCol = d.speedCls !== 'off' ? 'rgba(0,255,249,.1)' : '#310062';
          ledAct.setAttribute('fill', rCol);
          ledAct.removeAttribute('class');
          ledAct.style.removeProperty('animation-delay'); // On nettoie aussi le delay
          ledAct.style.removeProperty('--act-dur');
          ledAct.removeAttribute('filter');
        }
      }

      /* Label */
      const pnum  = dom.pnum;
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

        /* halo de débit sur le numéro de port — suit le même I/O réel que la LED */
        if (d.isActive) {
          const iov = _ioVisual(d.ioRaw);
          pnum.style.setProperty('--io-glow', iov.glow + 'px');
          pnum.style.setProperty('--io-op',   iov.op);
        } else {
          pnum.style.removeProperty('--io-glow');
          pnum.style.removeProperty('--io-op');
        }
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

/* ═══════════════════════════════════════════════════════════════════
 *  EDITOR — template unifié (cf CARDS-EDITOR-TEMPLATE.md)
 *  N'éditer QUE _schema() ; le reste est canonique et identique partout.
 * ═══════════════════════════════════════════════════════════════════ */
const NSW_FONTS = [
  'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];
const NSW_MDI_SUGGESTIONS = [
  'mdi:desktop-tower','mdi:desktop-classic','mdi:laptop','mdi:server','mdi:server-network',
  'mdi:nas','mdi:router-network','mdi:router-network-wireless','mdi:router','mdi:wifi',
  'mdi:television','mdi:printer','mdi:printer-wireless','mdi:camera','mdi:cctv',
  'mdi:phone-voip','mdi:phone','mdi:speaker','mdi:gamepad-variant','mdi:raspberry-pi',
  'mdi:home-automation','mdi:home-assistant','mdi:hub','mdi:network-strength-4',
  'mdi:ethernet','mdi:ethernet-cable','mdi:switch','mdi:lan','mdi:lan-connect',
  'mdi:solar-panel','mdi:solar-panel-large','mdi:battery-charging','mdi:car',
  'mdi:car-electric','mdi:synology-nas','mdi:harddisk','mdi:database',
];
class NeonSwitchCardEditor extends HTMLElement {
  /** Crée l'éditeur graphique (aucun rendu ici, cf setConfig). */
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  // ── Cycle de vie (NE PAS toucher) ──────────────────────────────────
  /**
   * Appelé par Lovelace avec la config courante de la card à éditer.
   * @param {object} c - config existante (vide au premier ajout de la card).
   */
  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  /** Appelé par Lovelace à chaque update HA — remplit juste les datalists, jamais de render (cf commentaire). */
  set hass(h) { this._hass = h; this._fillDatalists(); }   // JAMAIS de render ici
  /** Appelé par le DOM à la fermeture du panneau d'édition. */
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

  // Tableaux à index fixe (port_labels[i] / port_icons[i]) — clé "port_labels.3"
  _setArr(arrKey, i, value) {
    const arr = [...(this._config[arrKey] || Array(8).fill(''))];
    arr[i] = value || '';
    this._config[arrKey] = arr;
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
    const labels = this._config.port_labels || [];
    const icons  = this._config.port_icons  || [];
    this.querySelectorAll('[data-arr]').forEach(el => {
      if (el === active) return;
      const i = +el.dataset.idx;
      el.value = (el.dataset.arr === 'port_labels' ? labels[i] : icons[i]) || '';
    });
    this._bindIconPreviews(true);
  }

  // ── Helpers de champ (signatures FIXES — ne pas réinventer) ────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }

  // ── Groupe repliable (pattern canonique storey-battery-card-gl.js) ──
  // Enveloppe un bloc de champs dans <ha-expansion-panel>. buildFn() appelle
  // les helpers habituels (_section/_text/_color/...) qui s'appendent DEDANS
  // via _appendTo — aucun changement requis sur les helpers.
  // 🔴 L'état ouvert/fermé reste local au panneau (pas dans _config) : ne
  // JAMAIS le lire/écrire via _set, sinon un config-changed le referme.
  _group(title, expanded, buildFn) {
    const panel = document.createElement('ha-expansion-panel');
    panel.outlined = true;
    panel.header = title;
    if (expanded) panel.expanded = true;
    (this._appendTo || this).appendChild(panel);
    const prevAppendTo = this._appendTo;
    this._appendTo = panel;
    buildFn();
    this._appendTo = prevAppendTo;
    return panel;
  }

  _text(key, label, ph = '') {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
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

  _icon(key, label) {
    const row = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true);
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key;
    inp.setAttribute('list', 'nsw-mdi-list');
    inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
    inp.addEventListener('input', () => this._set(key, inp.value));
    box.appendChild(inp); box.appendChild(prev); row.wrap.appendChild(box); return inp;
  }

  // Icône de port : même esprit que _icon mais indexée dans un tableau (pas de data-key simple).
  _portIcon(i) {
    const row = this._row(`Port ${i + 1}`);
    const box = document.createElement('div'); box.className = 'port-row';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.portPreview = i;
    const inpIcon = document.createElement('input'); inpIcon.type = 'text'; inpIcon.className = 'ep-icon';
    inpIcon.placeholder = 'mdi:desktop-tower'; inpIcon.setAttribute('list', 'nsw-mdi-list');
    inpIcon.dataset.arr = 'port_icons'; inpIcon.dataset.idx = i;
    inpIcon.value = (this._config.port_icons || [])[i] || '';
    const inpLabel = document.createElement('input'); inpLabel.type = 'text'; inpLabel.className = 'ep-label';
    inpLabel.placeholder = 'label'; inpLabel.dataset.arr = 'port_labels'; inpLabel.dataset.idx = i;
    inpLabel.value = (this._config.port_labels || [])[i] || '';
    inpIcon.addEventListener('input', () => { this._setArr('port_icons', i, inpIcon.value); this._updatePortIconPreview(i); });
    inpLabel.addEventListener('input', () => this._setArr('port_labels', i, inpLabel.value));
    box.appendChild(prev); box.appendChild(inpIcon); box.appendChild(inpLabel); row.wrap.appendChild(box);
  }

  _updatePortIconPreview(i) {
    const preview = this.querySelector(`.icon-preview[data-port-preview="${i}"]`);
    const inp = this.querySelector(`input[data-arr="port_icons"][data-idx="${i}"]`);
    if (!preview || !inp) return;
    const val = inp.value.trim();
    preview.innerHTML = '';
    if (/^mdi:[a-zA-Z0-9_-]+$/.test(val)) {
      const ico = document.createElement('ha-icon');
      ico.setAttribute('icon', val); ico.style.cssText = '--mdc-icon-size:20px';
      preview.appendChild(ico);
    }
  }

  _entity(key, label, prefix = '') {
    const row = this._row(label);
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `nsw-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
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

  // ── Mécanique commune (NE PAS toucher) ─────────────────────────────
  _row(labelHtml, isHtml = false) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label');
    if (isHtml) lbl.innerHTML = labelHtml; else lbl.textContent = labelHtml;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    row.appendChild(lbl); row.appendChild(wrap); (this._appendTo || this).appendChild(row);
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
    for (let i = 0; i < 8; i++) this._updatePortIconPreview(i);
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
    if (!this.querySelector('#nsw-mdi-list')) {
      const dl = document.createElement('datalist'); dl.id = 'nsw-mdi-list';
      dl.innerHTML = NSW_MDI_SUGGESTIONS.map(v => `<option value="${v}">`).join('');
      this.appendChild(dl);
    }
  }

  // ── CSS commun (identique partout, + spécifique ports) ─────────────
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
      .port-row { display:flex;gap:6px;align-items:center;flex:1; }
      .port-row .ep-icon { width:140px;flex:none; }
      .port-row .ep-label { flex:1;min-width:0;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;box-sizing:border-box; }
      .port-row .ep-icon { padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;box-sizing:border-box; }
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
    this._section('Général');
    this._toggle('header.show', 'Afficher le header', true);
    this._text('header.title', 'Titre', 'GS108T · ProSafe');
    this._icon('header.icon', 'Icône (mdi)');
    this._color('header.color', 'Couleur titre', 'var(--primary-color)');
    this._text('header.title_size', 'Taille titre', '16px');
    this._toggle('show_stats', 'Afficher les stats globales', false);
    this._toggle('card_mod_bg', 'Hériter du fond card-mod', true);

    this._group('Typo avancée', false, () => {
      this._select('header.font', 'Police', NSW_FONTS, '— thème HA —');
      this._text('header.font_weight', 'Épaisseur', '700');
      this._text('header.letter_spacing', 'Espacement', 'clamp(1px, 0.5cqi, 3px)');
      this._toggle('header.uppercase', 'Majuscules', true);
      this._toggle('header.italic', 'Italique', false);
    });

    this._group('Icône', false, () => {
      this._color('header.icon_color', 'Couleur icône', 'défaut : couleur titre');
      this._text('header.icon_size', 'Taille icône', '20px');
    });

    this._group('Effets néon', false, () => {
      this._toggle('header.glow', 'Glow néon', true);
      this._color('header.glow_color', 'Couleur glow', 'var(--primary-color)');
      this._text('header.glow_size', 'Taille glow', '10px');
      this._toggle('header.gradient', 'Dégradé texte', false);
      this._color('header.gradient_from', 'Dégradé — départ', 'var(--primary-color)');
      this._color('header.gradient_to', 'Dégradé — arrivée', 'var(--accent-color)');
      this._toggle('header.flicker', 'Flicker néon', false);
    });

    this._section('Ports');
    for (let i = 0; i < 8; i++) this._portIcon(i);
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
  '%c 🔌 neon-switch-card v1.7 %c Neo Tokyo ',
  'background:#2EE5B6;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#6200EA;padding:2px 4px;border-radius:0 3px 3px 0;'
);
