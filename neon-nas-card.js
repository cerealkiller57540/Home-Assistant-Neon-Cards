/* ── neon-nas-card v1.9 ── */
(() => {
/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  neon-nas-card.js  v1.2                                                 │
 * │  Home Assistant custom Lovelace card — Synology NAS (RS + RX410)        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  PALETTE — Neo Tokyo                                                       *
 * ═══════════════════════════════════════════════════════════════════════════ */

const CP_ACCENT  = "#00fff9";   // cyan — LED OK
const CP_PRIMARY = "#B400FF";   // violet — accent
const CP_OK      = "#00FFAA";   // vert néon — healthy
const CP_WARN    = "#FFB800";   // orange — warning
const CP_ERR     = "#FF2D6F";   // rouge néon — alerte
const CP_BG      = "#040614";
const CP_DIM     = "rgba(255,255,255,0.55)";

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  GLITCH — mascotte chat qui se promène sur le châssis (validé en preview)   *
 *  3 calques Silverhand : rouge / cyan / vert plasma. Réglages preview.       *
 * ═══════════════════════════════════════════════════════════════════════════ */

const GLITCH = {
  src:    '/local/cat-walking-white.gif',
  size:   22,    // px, hauteur du chat (petit/discret)
  speed:  9,     // s pour traverser le châssis
  gap:    12,    // s de pause hors-champ entre deux balades (jitter ×0.6–1.4)
  top:    0,     // px d'ajustement vertical sur l'arête haute
  prob:   0.12,  // proba de glitch Silverhand par traversée
  // Silverhand (valeurs validées preview) :
  sat:    12,    // saturation des teintes
  op:     0.85,  // opacité des calques colorés
  amp:    7,     // px de décalage RGB
  dim:    0.55,  // baisse du calque blanc au pic (révèle la couleur)
  dur:    1400,  // ms
};

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  SVG NAS — 8 bays (2 rows × 4 cols)                                        *
 *  LED centers: y=113.5 (top row), y=132.5 (bottom row)                      *
 *               x=82, 158, 234, 310                                          *
 * ═══════════════════════════════════════════════════════════════════════════ */

const LED_POS = [
  // top row — RX410 drives 1-4
  { x: 82,  y: 113.5, row: 'rx', idx: 1 },
  { x: 158, y: 113.5, row: 'rx', idx: 2 },
  { x: 234, y: 113.5, row: 'rx', idx: 3 },
  { x: 310, y: 113.5, row: 'rx', idx: 4 },
  // bottom row — RS drives 1-4
  { x: 82,  y: 132.5, row: 'rs', idx: 1 },
  { x: 158, y: 132.5, row: 'rs', idx: 2 },
  { x: 234, y: 132.5, row: 'rs', idx: 3 },
  { x: 310, y: 132.5, row: 'rs', idx: 4 },
];

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  SVG CHASSIS — adapté du rs_8_bays_rs.svg                                   *
 * ═══════════════════════════════════════════════════════════════════════════ */

function _chassis() {
  return `
    <rect class="nas-body" x="34" y="89" width="318" height="56"/>
    <path class="nas-side" d="M34,145h-13c-2.76,0-5-2.24-5-5v-46c0-2.76,2.24-5,5-5h13"/>
    <path class="nas-side" d="M352,145h13c2.76,0,5-2.24,5-5v-46c0-2.76-2.24-5-5-5h-13"/>

    <!-- Façade gauche (logo + leds système) -->
    <g>
      <rect class="nas-panel" x="42" y="105" width="74" height="17" rx="2" ry="2"/>
      <rect class="nas-screen" x="44" y="107" width="69" height="13"/>
      <rect class="nas-brand"  x="66" y="109" width="44" height="9" rx="1" ry="1"/>
      <rect class="nas-brand"  x="48" y="113" width="13" height="2" rx="1" ry="1"/>
    </g>
    <g class="nas-sysled" transform="translate(49,114)">
      <circle cx="0" cy="0" r="1" fill="var(--nas-accent)" opacity="0.9"/>
      <circle cx="4" cy="0" r="1" fill="var(--nas-accent)" opacity="0.5"/>
    </g>

    <!-- Grilles ventilation bays 2-3-4 (row top) -->
    ${_grille(142, 94)}${_grille(194, 94)}${_grille(270, 94)}
    <!-- Perforations bay 1 top (façade gauche) -->
    ${[43,55,72,78,84,90,96,102,108,114].map(x => `<rect class="nas-dot" x="${x}" y="96" width="2" height="2" style="animation-duration: ${(Math.random() * 0.2 + 0.05).toFixed(2)}s; 
           animation-delay: ${Math.random().toFixed(2)}s;"/>`).join('')}

    <!-- Bay frames (2 rows × 4 cols, skip col1 top which is the système panel) -->
    ${_bay(42,105)}${_bay(118,105)}${_bay(194,105)}${_bay(270,105)}
    ${_bay(42,124)}${_bay(118,124)}${_bay(194,125)}${_bay(270,124)}
  `;
}

function _grille(x, y) {
  return `
    <rect class="nas-grille" x="${x}" y="${y}" width="${x===142?50:74}" height="2"/>
    <rect class="nas-grille" x="${x}" y="${y+4}" width="${x===142?50:74}" height="2"/>
  `;
}

function _bay(x, y) {
  return `
    <rect class="nas-bay-frame" x="${x}" y="${y}" width="74" height="17" rx="2" ry="2"/>
    <rect class="nas-bay-inner" x="${x+2}" y="${y+2}" width="69" height="13"/>
    <rect class="nas-bay-label" x="${x+24}" y="${y+4}" width="44" height="9" rx="1" ry="1"/>
    <rect class="nas-bay-notch" x="${x+6}" y="${y+8}" width="13" height="2" rx="1" ry="1"/>
  `;
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  CARD                                                                      *
 * ═══════════════════════════════════════════════════════════════════════════ */

class NeonNasCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(c) {
    clearInterval(this._confirmTimer);
    this._config = { card_mod_bg: true, ...c };
    this._built = false;
  }

  set hass(h) {
    this._hass = h;
    if (!this._built) { this._built = true; this._render(); return; }
    this._update();
  }

  disconnectedCallback() {
    clearInterval(this._confirmTimer);
    this._stopGlitch();
  }

  getCardSize() { return 3; }
  static getConfigElement() { return document.createElement('neon-nas-card-editor'); }
  static getStubConfig() {
    return {
      title: 'Rackstation',
      led_ok_color: '#00FFAA',
      total_entity: 'sensor.rackstation_volume_1_taille_totale',
      used_entity:  'sensor.rackstation_volume_1_espace_utilise',
      used_pct_entity: 'sensor.rackstation_volume_1_volume_utilise',
      temp_entity:  'sensor.rackstation_temperature',
      health_entity:'sensor.rackstation_volume_1_etat',
      drives: [
        'sensor.rackstation_drive_1_rx410_1_etat',
        'sensor.rackstation_drive_2_rx410_1_etat',
        'sensor.rackstation_drive_3_rx410_1_etat',
        'sensor.rackstation_drive_4_rx410_1_etat',
        'sensor.rackstation_drive_1_etat',
        'sensor.rackstation_drive_2_etat',
        'sensor.rackstation_drive_3_etat',
        'sensor.rackstation_drive_4_etat',
      ],
      drive_alerts: [
        ['binary_sensor.rackstation_drive_1_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_1_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_2_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_2_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_3_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_3_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_4_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_4_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_1_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_1_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_2_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_2_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_3_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_3_en_dessous_de_la_duree_de_vie_restante_minimale'],
        ['binary_sensor.rackstation_drive_4_depassement_du_nombre_maximal_de_secteurs_defectueux','binary_sensor.rackstation_drive_4_en_dessous_de_la_duree_de_vie_restante_minimale'],
      ],
    };
  }

  /* ── helpers ──────────────────────────────────────────────────────────── */

  _ent(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    return s ? { id, v: s.state, a: s.attributes } : null;
  }

  _driveStatus(i) {
    // returns 'ok' | 'warn' | 'err' | 'unavail'
    const alerts = (this._config.drive_alerts || [])[i] || [];
    for (const aId of alerts) {
      const e = this._ent(aId);
      if (e && e.v === 'on') return 'err';
    }
    const stateEnt = this._ent((this._config.drives || [])[i]);
    if (!stateEnt) return 'unavail';
    const v = String(stateEnt.v).toLowerCase();
    if (v === 'unavailable' || v === 'unknown') return 'unavail';
    if (v.includes('normal') || v.includes('ok') || v.includes('healthy') || v.includes('bon')) return 'ok';
    return 'warn';
  }

  _fmtBytes(v, attrs) {
    if (v === null || v === undefined || v === '') return '—';
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    const unit = (attrs && attrs.unit_of_measurement) || '';
    return `${n.toFixed(2)} ${unit}`.trim();
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  /* ── render ──────────────────────────────────────────────────────────── */

  _render() {
    const c = this._config || {};
    const hdr       = (c.header && typeof c.header === 'object') ? c.header : {};
    const title     = hdr.title || c.title || 'Rackstation';
    const cardModBg = c.card_mod_bg !== false;
    const accent    = c.color_accent || CP_ACCENT;
    const ledOk     = c.led_ok_color  || CP_OK;
    const bg        = cardModBg ? 'transparent' : (c.color_bg || CP_BG);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card {
          padding: 10px 12px 10px;
          ${cardModBg ? '' : `background: ${bg};`}
          --nas-accent: ${accent};
          --nas-primary: ${CP_PRIMARY};
          --nas-ok: ${ledOk};
          --nas-warn: ${CP_WARN};
          --nas-err: ${CP_ERR};
          --nas-dim: ${CP_DIM};
          --nas-uv: var(--rgb-primary-color, 98,0,234);
          --nas-cy: var(--rgb-accent-color, 0,255,249);
          --nas-err-rgb: var(--rgb-error-color, 255,45,107);
          --gc-sat: ${(c.glitch && c.glitch.sat) || GLITCH.sat};
          ${hdr.color       ? `--nas-hdr-color: ${hdr.color};`         : ''}
          ${hdr.title_size  ? `--nas-hdr-size: ${hdr.title_size};`     : ''}
          ${hdr.title_shadow? `--nas-hdr-shadow: ${hdr.title_shadow};` : ''}
        }
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500&display=swap');

        @keyframes hdr-glow {
          0%,100% { text-shadow: 0 0 6px var(--nas-hdr-color, var(--nas-accent)), 0 0 12px rgba(var(--nas-cy),.4); }
          50%      { text-shadow: 0 0 10px var(--nas-hdr-color, var(--nas-accent)), 0 0 22px rgba(var(--nas-cy),.7); }
        }

        .hdr {
          display:flex; align-items:center; gap:8px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          position: relative;
        }
        .hdr::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(var(--nas-uv),.55) 20%,
            rgba(var(--nas-cy),.3) 50%,
            rgba(var(--nas-uv),.55) 80%,
            transparent);
        }
        .hdr .ico {
          display: inline-flex; align-items: center;
          width:18px; height:18px;
          color: var(--nas-hdr-color, var(--nas-accent));
          filter: drop-shadow(0 0 4px var(--nas-hdr-color, var(--nas-accent)));
          flex-shrink: 0;
          --mdc-icon-size: 18px;
        }
        .hdr .title {
          flex:1;
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size: var(--nas-hdr-size, 13px);
          letter-spacing: clamp(1px, 0.5cqi, 3px);
          text-transform: uppercase;
          color: var(--nas-hdr-color, var(--nas-accent));
          text-shadow: var(--nas-hdr-shadow, 0 0 6px var(--nas-hdr-color, var(--nas-accent)));
          animation: hdr-glow 3s ease-in-out infinite;
        }
        .hdr-badges {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        /* health */
        .hdr .health {
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor; cursor:pointer; white-space:nowrap;
          mix-blend-mode: screen;
          display: inline-flex; align-items: center; line-height: 1;
        }
        .hdr .health.ok      { color:var(--nas-ok); }
        .hdr .health.warn    { color:var(--nas-warn); }
        .hdr .health.err     { color:var(--nas-err); }
        .hdr .health.unavail { color:var(--nas-dim); }

        .nas-wrap { position:relative; width:100%; }
        .nas-wrap:hover .nas-dot {
          opacity: 0.4;
          filter: drop-shadow(0 0 1px var(--nas-accent));
        }
        svg.nas { width:100%; height:auto; display:block; }

        /* ── GLITCH le chat ── */
        .glitch-cat {
          position:absolute; top:0; left:0;
          pointer-events:none; will-change:transform;
          image-rendering:pixelated; z-index:5;
        }
        .glitch-cat > img { display:block; width:100%; height:100%; position:relative; z-index:2; }
        .gc-layer { position:absolute; inset:0; mix-blend-mode:screen; opacity:0; z-index:3; }
        .gc-layer img { width:100%; height:100%; display:block; }
        .gc-rd { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(-55deg) brightness(1.15); }
        .gc-cy { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(150deg) brightness(1.1); }
        .gc-gn { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(75deg)  brightness(1.15); }
        .gc-scan {
          position:absolute; inset:0; mix-blend-mode:overlay; opacity:0; z-index:4;
          background:repeating-linear-gradient(0deg,
            rgba(255,255,255,.22) 0 1px, transparent 1px 3px);
        }
        @media (prefers-reduced-motion: reduce) {
          .glitch-cat { display:none; }
        }

        /* chassis */
        /* Châssis en plastique noir */
        .nas-body { fill: url(#grad-plastic); stroke: #000; stroke-width: 0.3; }
        .nas-side, .nas-panel { 
          fill: url(#grad-plastic); /* Au lieu de #1e2228 */
          filter: brightness(0.8);    /* Un poil plus sombre pour marquer la séparation */
        }
        .nas-screen { fill:#131619; }
        .nas-brand  { fill:#2e333a; }
        /* Remplace le style .nas-dot existant */
        .nas-dot {
          fill: var(--nas-accent); 
          stroke: rgba(255,255,255,0.1); 
          stroke-width: 0.1;
          animation: hdd-flicker 0.1s infinite;
          opacity: 0.1;
        }

        /* L'animation de clignotement aléatoire (à mettre à la fin de tes styles) */
        @keyframes hdd-flicker {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; } 
        }
        .nas-grille { fill:#131619; }
        .nas-bay-frame { fill:#1e2228; }
        /* Profondeur des baies de disques */
        .nas-bay-inner { 
          fill: #050608; 
          box-shadow: inset 0 0 5px #000; 
        }
        /* Les "notches" (encoches) et poignées */
        .nas-bay-notch, .nas-bay-label { 
          fill: #1a1e24; 
          stroke: #000; 
          stroke-width: 0.5;
        }

        /* drive LEDs */
        .drive-led { cursor:pointer; }
        .drive-led .ring { fill:#1a1d24; }
        .drive-led .dot  {
          transition: all 0.3s ease;
          filter: blur(0.2px);
        }
        .drive-led.ok   .dot { fill: var(--nas-ok);   filter: url(#led-glow-nas); animation: flicker 2.4s infinite; }
        .drive-led.warn .dot { fill: var(--nas-warn); filter: url(#led-glow-nas); animation: pulse 1.2s infinite; }
        .drive-led.err  .dot { fill: var(--nas-err);  filter: url(#led-glow-nas); animation: pulse .7s infinite; }
        .drive-led.unavail .dot { fill:#3a4250; filter:none; }

        @keyframes flicker {
          0%,100% { opacity:1;   }
          47%     { opacity:1;   }
          48%     { opacity:.35; }
          50%     { opacity:1;   }
          72%     { opacity:1;   }
          73%     { opacity:.55; }
          75%     { opacity:1;   }
        }
        @keyframes pulse {
          0%,100% { opacity:1;   }
          50%     { opacity:.3; }
        }

        /* footer stats */
        .stats {
          display:grid;
          grid-template-columns: auto 1fr auto auto;
          align-items:center;
          gap:8px;
          margin-top:6px;
          padding-top: 8px;
          position: relative;
        }
        .stats::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(var(--nas-uv),.4) 20%,
            rgba(var(--nas-cy),.2) 50%,
            rgba(var(--nas-uv),.4) 80%,
            transparent);
        }
        .donut {
          --pct: 0;
          --col: var(--nas-accent);
          width:50px; height:50px; border-radius:50%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            conic-gradient(var(--col) calc(var(--pct) * 1%), rgba(255,255,255,0.05) 0);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 15px color-mix(in srgb, var(--col) 20%, transparent);
          position:relative;
          cursor:pointer;
          filter: drop-shadow(0 0 6px color-mix(in srgb, var(--col) 40%, transparent));
          flex-shrink:0;
        }
        .donut::after {
            content: ""; position: absolute; inset: 2px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.1); pointer-events: none;
        }
        .donut::before {
          content:""; position:absolute; inset:6px; border-radius:50%;
          background: var(--ha-card-background, #0a0d18);
        }
        .donut .pct {
          position:absolute; inset:0; display:flex;
          align-items:center; justify-content:center;
          font-size:13px; font-weight:600; color: var(--primary-text-color);
          letter-spacing:.02em;
        }
        .vol {
          display:flex; flex-direction:column; gap:3px; min-width:0;
        }
        .vol .line1 {
          font-size:15px; font-weight:500; color: var(--nas-accent);
          font-variant-numeric: tabular-nums;
          mix-blend-mode: screen;
          text-shadow: 0 0 8px var(--nas-accent);
        }
        .vol .line1 .tot { color: var(--nas-dim); font-weight:400; }
        .vol .line2 {
          font-size:11px; color: var(--nas-dim);
          letter-spacing:.06em; text-transform:uppercase;
        }
        /* temp tile (header) — même style que health */
        .temp {
          display:inline-flex; align-items:center; gap:4px; line-height:1;
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size:10px; font-weight:700; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor;
          color:var(--nas-accent);
          font-variant-numeric:tabular-nums;
          cursor:pointer; white-space:nowrap;
          mix-blend-mode: screen;
        }
        .temp svg { width:10px; height:10px; flex-shrink:0; }
        .temp.hot  { color:var(--nas-err); }
        .temp.warm { color:var(--nas-warn); }

        /* action buttons — même style que health */
        .actions { display:none; }
        .btn-action {
          display:flex; align-items:center; gap:4px;
          font-size:11px; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor; letter-spacing:.08em; text-transform:uppercase;
          cursor:pointer; background:transparent; font-family:inherit; font-weight:700;
          white-space:nowrap;
          transition: background .15s;
        }
        .btn-action svg { width:11px; height:11px; flex-shrink:0; }
        .btn-reboot  { color:var(--nas-accent); mix-blend-mode: screen; }
        .btn-reboot:hover  {
          background: rgba(var(--nas-cy), var(--glow-opacity-idle, 0.08));
          box-shadow: 0 0 10px rgba(var(--nas-cy), var(--glow-opacity-hover, 0.20)),
                      inset 0 0 8px rgba(var(--nas-cy), var(--glow-opacity-idle, 0.06));
          text-shadow: 0 0 8px var(--nas-accent);
          border-color: rgba(var(--nas-cy), 0.6);
        }
        .btn-shutdown { color:var(--nas-err); mix-blend-mode: screen; }
        .btn-shutdown:hover {
          background: rgba(var(--nas-err-rgb), var(--glow-opacity-idle, 0.08));
          box-shadow: 0 0 10px rgba(var(--nas-err-rgb), var(--glow-opacity-hover, 0.20)),
                      inset 0 0 8px rgba(var(--nas-err-rgb), var(--glow-opacity-idle, 0.06));
          text-shadow: 0 0 8px var(--nas-err);
          border-color: rgba(var(--nas-err-rgb), 0.6);
        }

        /* confirm overlay */
        .confirm-overlay {
          position:absolute; inset:0; border-radius: inherit;
          background: rgba(4,6,20,0.92);
          backdrop-filter: blur(var(--blur-strength-heavy, 28px));
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:10px; z-index:10;
          animation: fadeIn .15s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .confirm-overlay .confirm-msg {
          font-size:13px; color: var(--primary-text-color);
          text-align:center; line-height:1.4; padding:0 16px;
        }
        .confirm-overlay .confirm-msg strong { color: var(--nas-err); }
        .confirm-overlay .confirm-timer {
          font-size:10px; color: var(--nas-dim); letter-spacing:.1em;
        }
        .confirm-overlay .confirm-btns {
          display:flex; gap:8px;
        }
        .confirm-overlay .btn-cancel {
          padding:6px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.2);
          background:transparent; color: var(--nas-dim);
          font-size:12px; cursor:pointer; font-family:inherit;
          transition:background .15s;
        }
        .confirm-overlay .btn-cancel:hover { background:rgba(255,255,255,0.08); }
        .confirm-overlay .btn-confirm-ok {
          padding:6px 16px; border-radius:6px; border:1px solid;
          background:transparent; font-size:12px; cursor:pointer;
          font-family:inherit; font-weight:600;
          transition:background .15s, box-shadow .15s;
        }
        .confirm-overlay .btn-confirm-ok.reboot {
          color: var(--nas-accent); border-color: rgba(var(--nas-cy), 0.5);
        }
        .confirm-overlay .btn-confirm-ok.reboot:hover {
          background: rgba(var(--nas-cy), var(--glow-opacity-active, 0.15));
          box-shadow: 0 0 10px rgba(var(--nas-cy), var(--glow-opacity-hover, 0.20));
        }
        .confirm-overlay .btn-confirm-ok.shutdown {
          color: var(--nas-err); border-color: rgba(var(--nas-err-rgb), 0.5);
        }
        .confirm-overlay .btn-confirm-ok.shutdown:hover {
          background: rgba(var(--nas-err-rgb), var(--glow-opacity-active, 0.15));
          box-shadow: 0 0 10px rgba(var(--nas-err-rgb), var(--glow-opacity-hover, 0.20));
        }
        .nas-wrap { position:relative; }
      </style>
      <ha-card>
        <div class="hdr" id="hdr">
          ${hdr.icon
            ? `<ha-icon class="ico" icon="${hdr.icon}"></ha-icon>`
            : `<svg class="ico" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4zM7 6v.01M7 12v.01M7 18v.01"/>
               </svg>`
          }
          <span class="title">${title}</span>
          <div class="hdr-badges">
            <div class="temp" id="temp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 00-3 3v10.27a5 5 0 106 0V5a3 3 0 00-3-3zm0 2a1 1 0 011 1v10.83l.4.29a3 3 0 11-2.8 0l.4-.29V5a1 1 0 011-1z"/></svg>
              <span id="tempVal">—</span>
            </div>
            <span class="health" id="health"><span id="healthVal">—</span></span>
          </div>
        </div>
        <div class="nas-wrap">
          <svg class="nas" viewBox="0 82 386 72" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-plastic" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#1a1d22;stop-opacity:1" />
                <stop offset="10%" style="stop-color:#12151a;stop-opacity:1" />
                <stop offset="90%" style="stop-color:#0d0f12;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#050608;stop-opacity:1" />
              </linearGradient>
              <radialGradient id="grad-hole">
                <stop offset="0%"   stop-color="#000000" />
                <stop offset="80%"  stop-color="#1a1d22" />
                <stop offset="100%" stop-color="#3a3f47" />
              </radialGradient>
              <filter id="led-glow-nas" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 0" result="intenseBlur"/>
                <feMerge>
                  <feMergeNode in="intenseBlur"/>
                  <feMergeNode in="intenseBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            ${_chassis()}
            ${LED_POS.map((p, i) => `
              <g class="drive-led" data-idx="${i}"
                 transform="translate(${p.x},${p.y})">
                <circle class="ring" r="2.5"/>
                <circle class="dot"  r="1.25"/>
              </g>
            `).join('')}
          </svg>
        </div>
        <div class="stats">
          <div class="donut" id="donut"><div class="pct" id="pct">—</div></div>
          <div class="vol">
            <div class="line1"><span id="used">—</span> <span class="tot">/ <span id="total">—</span></span></div>
            <div class="line2" id="volLabel"></div>
          </div>
          <button class="btn-action btn-reboot" id="btn-reboot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>Reboot
          </button>
          <button class="btn-action btn-shutdown" id="btn-shutdown">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
            </svg>Shutdown
          </button>
        </div>
      </ha-card>
    `;

    // bind clicks
    this.shadowRoot.querySelectorAll('.drive-led').forEach(el => {
      el.addEventListener('click', () => {
        const i = +el.dataset.idx;
        const id = (this._config.drives || [])[i];
        this._moreInfo(id);
      });
    });
    this.shadowRoot.getElementById('donut').addEventListener('click',
      () => this._moreInfo(this._config.used_pct_entity || this._config.used_entity));
    this.shadowRoot.getElementById('temp').addEventListener('click',
      () => this._moreInfo(this._config.temp_entity));
    this.shadowRoot.getElementById('health').addEventListener('click',
      () => this._moreInfo(this._config.health_entity));
    this.shadowRoot.getElementById('btn-reboot').addEventListener('click',
      () => this._confirm('reboot'));
    this.shadowRoot.getElementById('btn-shutdown').addEventListener('click',
      () => this._confirm('shutdown'));

    // random flicker timing per LED — delay négatif = démarre en milieu de cycle
    this.shadowRoot.querySelectorAll('.drive-led .dot').forEach(dot => {
      dot.style.animationDelay    = (-Math.random() * 4).toFixed(2) + 's';
      dot.style.animationDuration = (1.8 + Math.random() * 2.4).toFixed(2) + 's';
    });

    this._startGlitch();
    this._update();
  }

  /* ── GLITCH le chat : balade intermittente + Silverhand aléatoire ─────────── */

  // Lit un réglage GLITCH depuis la config (glitch.<key>) avec fallback sur les défauts.
  _gc(key) {
    const g = (this._config && this._config.glitch) || {};
    const v = g[key];
    return (v === undefined || v === null || v === '') ? GLITCH[key] : v;
  }
  _gcOn() {
    const g = (this._config && this._config.glitch) || {};
    return g.enabled !== false;   // activé par défaut
  }

  _startGlitch() {
    this._stopGlitch();                 // repart propre à chaque (re)render
    if (!this._gcOn()) return;
    this._gcWrap = this.shadowRoot.querySelector('.nas-wrap');
    if (!this._gcWrap) return;
    this._gcCat = null;
    this._gcTimers = new Set();
    this._gcRafs = new Set();
    const t = setTimeout(() => this._spawnWalk(), 800);  // 1ère balade après un court délai
    this._gcTimers.add(t);
  }

  _stopGlitch() {
    if (this._gcTimers) this._gcTimers.forEach(clearTimeout);
    if (this._gcRafs)   this._gcRafs.forEach(id => cancelAnimationFrame(id));
    this._gcTimers = new Set();
    this._gcRafs = new Set();
    if (this._gcCat) { this._gcCat.remove(); this._gcCat = null; }
  }

  _scheduleWalk() {
    if (!this._gcTimers) return;
    const gap = this._gc('gap') * 1000 * (0.6 + Math.random() * 0.8);
    const t = setTimeout(() => this._spawnWalk(), gap);
    this._gcTimers.add(t);
  }

  _spawnWalk() {
    const wrap = this._gcWrap;
    if (!wrap || !wrap.isConnected) return;
    const svg = wrap.querySelector('svg.nas');
    if (!svg) return;

    const w = wrap.clientWidth;
    const svgH = svg.clientHeight;
    const size = +this._gc('size');
    const src  = this._gc('src');
    const left  = w * (16 / 386);    // entre un peu avant le rack
    const right = w * (360 / 386);   // sort par la droite
    const yTop  = svgH * ((89 - 82) / 72);  // arête haute du châssis (viewBox 82..154)
    const topPx = yTop - size + (+this._gc('top'));

    const dir = Math.random() < 0.5 ? 1 : -1;   // 1 = gauche→droite
    const startX = dir === 1 ? left - size : right;
    const endX   = dir === 1 ? right       : left - size;

    const cat = document.createElement('div');
    cat.className = 'glitch-cat';
    cat.style.width = size + 'px';
    cat.style.height = size + 'px';
    cat.style.transform = `translate(${startX}px,${topPx}px) scaleX(${dir})`;
    cat.innerHTML = `
      <img src="${src}" alt="">
      <div class="gc-layer gc-rd"><img src="${src}" alt=""></div>
      <div class="gc-layer gc-cy"><img src="${src}" alt=""></div>
      <div class="gc-layer gc-gn"><img src="${src}" alt=""></div>
      <div class="gc-scan"></div>`;
    wrap.appendChild(cat);
    this._gcCat = cat;

    const dur = (+this._gc('speed')) * 1000;
    const t0 = performance.now();
    const willGlitch = Math.random() < (+this._gc('prob'));
    const glitchAt = 0.35 + Math.random() * 0.35;
    let glitched = false;

    const frame = (now) => {
      if (!cat.isConnected) return;
      const p = (now - t0) / dur;
      if (p >= 1) {
        cat.remove();
        if (this._gcCat === cat) this._gcCat = null;
        this._scheduleWalk();
        return;
      }
      const x = startX + (endX - startX) * p;
      const bob = Math.sin(p * Math.PI * 2 * 8) * 0.8;   // démarche
      cat.style.transform = `translate(${x}px,${topPx + bob}px) scaleX(${dir})`;
      if (willGlitch && !glitched && p >= glitchAt) { glitched = true; this._doSilverhand(cat); }
      const id = requestAnimationFrame(frame);
      this._gcRafs.add(id);
    };
    const id = requestAnimationFrame(frame);
    this._gcRafs.add(id);
  }

  _doSilverhand(cat) {
    const main = cat.querySelector(':scope > img');
    const rd = cat.querySelector('.gc-rd'), cy = cat.querySelector('.gc-cy');
    const gn = cat.querySelector('.gc-gn'), scan = cat.querySelector('.gc-scan');
    if (!main) return;
    const amp = +this._gc('amp'), op = +this._gc('op'), dim = +this._gc('dim');
    const durMs = +this._gc('dur');
    const t0 = performance.now();
    const s = () => (Math.random() < 0.5 ? -1 : 1);

    const step = (now) => {
      if (!cat.isConnected) return;
      const p = (now - t0) / durMs;
      if (p >= 1) {
        rd.style.opacity = cy.style.opacity = gn.style.opacity = scan.style.opacity = 0;
        main.style.clipPath = ''; main.style.transform = ''; main.style.opacity = 1;
        return;
      }
      const a = amp * (0.4 + Math.random() * 0.6);
      rd.style.transform = `translate(${s() * a}px,${s() * a * 0.3}px)`;
      cy.style.transform = `translate(${s() * a}px,${s() * a * 0.3}px)`;
      gn.style.transform = `translate(${s() * a * 0.6}px,${s() * a * 0.4}px)`;
      rd.style.opacity = cy.style.opacity = op * (0.7 + Math.random() * 0.3);
      gn.style.opacity = op * (0.5 + Math.random() * 0.4);
      scan.style.opacity = 0.7;
      scan.style.backgroundPositionY = (Math.random() * 6) + 'px';
      main.style.opacity = 1 - dim * (0.6 + Math.random() * 0.4);
      if (Math.random() < 0.45) {
        const u = Math.floor(Math.random() * 60), b = u + Math.floor(Math.random() * 30);
        main.style.clipPath = `inset(${u}% 0 ${100 - b}% 0)`;
      } else main.style.clipPath = '';
      main.style.transform = `translateX(${s() * amp * 0.3}px)`;
      const id = requestAnimationFrame(step);
      this._gcRafs.add(id);
    };
    const id = requestAnimationFrame(step);
    this._gcRafs.add(id);
  }

  _confirm(action) {
    this.shadowRoot.querySelector('.confirm-overlay')?.remove();
    clearInterval(this._confirmTimer);

    const wrap = this.shadowRoot.querySelector('.nas-wrap');
    const isShutdown = action === 'shutdown';
    const label = isShutdown ? 'Shutdown' : 'Reboot';
    const entityId = isShutdown
      ? (this._config.shutdown_entity || 'button.rackstation_shutdown')
      : (this._config.reboot_entity  || 'button.rackstation_reboot');

    let remaining = 5;
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-msg">
        Confirmer <strong>${label}</strong> du NAS ?<br>
        <span style="font-size:11px;color:var(--nas-dim);">${entityId}</span>
      </div>
      <div class="confirm-timer" id="ctimer">Annulation auto dans ${remaining}s</div>
      <div class="confirm-btns">
        <button class="btn-cancel">Annuler</button>
        <button class="btn-confirm-ok ${action}">${label}</button>
      </div>
    `;
    wrap.appendChild(overlay);

    this._confirmTimer = setInterval(() => {
      remaining--;
      const t = overlay.querySelector('#ctimer');
      if (t) t.textContent = `Annulation auto dans ${remaining}s`;
      if (remaining <= 0) { clearInterval(this._confirmTimer); overlay.remove(); }
    }, 1000);

    overlay.querySelector('.btn-cancel').addEventListener('click', () => {
      clearInterval(this._confirmTimer); overlay.remove();
    });
    overlay.querySelector('.btn-confirm-ok').addEventListener('click', () => {
      clearInterval(this._confirmTimer); overlay.remove();
      this._callButton(entityId);
    });
  }

  _callButton(entityId) {
    if (!this._hass || !entityId) return;
    this._hass.callService('button', 'press', { entity_id: entityId });
  }

  _update() {
    if (!this.shadowRoot || !this._hass) return;
    const c = this._config || {};

    // title (may change via UI editor without full re-render)
    const hdr   = (c.header && typeof c.header === 'object') ? c.header : {};
    const title = hdr.title || c.title || 'Rackstation';
    const titleEl = this.shadowRoot.querySelector('.title');
    if (titleEl && titleEl.textContent !== title) titleEl.textContent = title;

    // drives
    this.shadowRoot.querySelectorAll('.drive-led').forEach(el => {
      const i = +el.dataset.idx;
      el.classList.remove('ok','warn','err','unavail');
      el.classList.add(this._driveStatus(i));
    });

    // health
    const h = this._ent(c.health_entity);
    const healthEl  = this.shadowRoot.getElementById('health');
    const healthVal = this.shadowRoot.getElementById('healthVal');
    if (h) {
      const v = String(h.v).toLowerCase();
      let cls = 'unavail', lbl = h.v;
      if (v === 'unavailable' || v === 'unknown') { cls = 'unavail'; lbl = '—'; }
      else if (v.includes('normal') || v.includes('ok') || v.includes('healthy')) { cls = 'ok'; lbl = 'Normal'; }
      else if (v.includes('warn') || v.includes('attention')) { cls = 'warn'; lbl = 'Warning'; }
      else if (v.includes('crash') || v.includes('fail') || v.includes('danger')) { cls = 'err'; lbl = 'Critical'; }
      else { cls = 'ok'; lbl = h.v; }
      // override if any drive is err
      const anyErr = LED_POS.some((_, i) => this._driveStatus(i) === 'err');
      if (anyErr) { cls = 'err'; lbl = 'Alert'; }
      healthEl.className = 'health ' + cls;
      if (healthVal) healthVal.textContent = lbl;
    } else {
      healthEl.className = 'health unavail';
      if (healthVal) healthVal.textContent = '—';
    }

    // donut + volume
    const used   = this._ent(c.used_entity);
    const total  = this._ent(c.total_entity);
    const pctEnt = this._ent(c.used_pct_entity);

    let pct = null;
    if (pctEnt && !isNaN(parseFloat(pctEnt.v))) pct = parseFloat(pctEnt.v);
    else if (used && total) {
      const u = parseFloat(used.v), t = parseFloat(total.v);
      if (!isNaN(u) && !isNaN(t) && t > 0) pct = (u / t) * 100;
    }

    const donut = this.shadowRoot.getElementById('donut');
    const pctEl = this.shadowRoot.getElementById('pct');
    if (pct !== null) {
      const p = Math.min(100, Math.max(0, pct));
      donut.style.setProperty('--pct', p);
      // color scale
      let col = CP_ACCENT;
      if (p >= 90) col = CP_ERR;
      else if (p >= 75) col = CP_WARN;
      donut.style.setProperty('--col', col);
      pctEl.textContent = p.toFixed(0) + '%';
    } else {
      donut.style.setProperty('--pct', 0);
      pctEl.textContent = '—';
    }

    this.shadowRoot.getElementById('used').textContent  = used  ? this._fmtBytes(used.v, used.a)   : '—';
    this.shadowRoot.getElementById('total').textContent = total ? this._fmtBytes(total.v, total.a) : '—';
    // label volume : si vide dans la config → masqué (pas de fallback hardcodé)
    const volLabelEl = this.shadowRoot.getElementById('volLabel');
    const volLabel = (c.volume_label != null && String(c.volume_label).trim() !== '') ? c.volume_label : '';
    volLabelEl.textContent = volLabel;
    volLabelEl.style.display = volLabel ? '' : 'none';

    // temp
    const t = this._ent(c.temp_entity);
    const tempEl = this.shadowRoot.getElementById('temp');
    const tempVal = this.shadowRoot.getElementById('tempVal');
    tempEl.classList.remove('hot','warm');
    if (t) {
      const tv = parseFloat(t.v);
      if (!isNaN(tv)) {
        tempVal.textContent = `${tv.toFixed(0)}°${(t.a.unit_of_measurement || 'C').replace('°','')}`;
        if (tv >= 55) tempEl.classList.add('hot');
        else if (tv >= 45) tempEl.classList.add('warm');
      } else tempVal.textContent = t.v;
    } else tempVal.textContent = '—';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  EDITOR                                                                    *
 * ═══════════════════════════════════════════════════════════════════════════ */

class NeonNasCardEditor extends HTMLElement {

  setConfig(c) {
    this._config = { ...c };
    if (!this._built) {
      if (this._hass) { this._built = true; this._render(); }
    }
  }

  set hass(h) {
    this._hass = h;
    if (!this._built && this._config) { this._built = true; this._render(); return; }
    this._refreshDatalists();
  }

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
      if (isChecked !== undefined) {
        // 'enabled' doit pouvoir stocker false explicitement (sinon retombe sur le défaut activé)
        if (subkey === 'enabled') this._config[obj][subkey] = isChecked;
        else if (isChecked) this._config[obj][subkey] = true; else delete this._config[obj][subkey];
      } else if (val === '' || val === null || val === undefined) {
        delete this._config[obj][subkey];
      } else {
        this._config[obj][subkey] = val;
      }
    } else {
      if (isChecked !== undefined) {
        if (isChecked) this._config[key] = true; else delete this._config[key];
      } else if (val === '' || val === null || val === undefined) {
        delete this._config[key];
      } else {
        this._config[key] = val;
      }
    }
    this._fire();
  }

  _setArr(key, i, val) {
    const arr = [...(this._config[key] || [])];
    arr[i] = val || '';
    this._config[key] = arr;
    this._fire();
  }

  _setAlert(driveIdx, alertIdx, val) {
    const arr = (this._config.drive_alerts || []).map(x => [...(x || [])]);
    while (arr.length <= driveIdx) arr.push([]);
    arr[driveIdx][alertIdx] = val || '';
    this._config.drive_alerts = arr;
    this._fire();
  }

  _entities(prefix) {
    if (!this._hass) return [];
    return Object.keys(this._hass.states).filter(e => e.startsWith(prefix)).sort();
  }

  _refreshDatalists() {
    this.querySelectorAll('datalist').forEach(dl => {
      const prefix = dl.dataset.prefix || 'sensor.';
      dl.innerHTML = '';
      const frag = document.createDocumentFragment();
      for (const e of this._entities(prefix)) {
        const o = document.createElement('option'); o.value = e; frag.appendChild(o);
      }
      dl.appendChild(frag);
    });
  }

  _picker(label, key, placeholder, prefix = 'sensor.') {
    const val = this._config[key] || '';
    const lid = 'dl_' + key.replace(/\W/g, '');
    const opts = this._entities(prefix).map(e => `<option value="${e}">`).join('');
    return `<div class="field">
      <label>${label}</label>
      <input class="ep" data-key="${key}" value="${val}"
        list="${lid}" placeholder="${placeholder || 'Search\u2026'}" autocomplete="off"/>
      <datalist id="${lid}" data-prefix="${prefix}">${opts}</datalist>
    </div>`;
  }

  _drivePicker(i) {
    const val = (this._config.drives || [])[i] || '';
    const lid = 'dl_drive_' + i;
    const opts = this._entities('sensor.').map(e => `<option value="${e}">`).join('');
    const alerts = (this._config.drive_alerts || [])[i] || [];
    const lidA0 = 'dl_da0_' + i, lidA1 = 'dl_da1_' + i;
    const optsB = this._entities('binary_sensor.').map(e => `<option value="${e}">`).join('');
    return `<div class="drive-block">
      <div class="drive-hdr">Drive ${i + 1} <span class="drive-pos">${i < 4 ? 'RX410 top' : 'RS bottom'} · bay ${(i % 4) + 1}</span></div>
      <div class="field">
        <label>État</label>
        <input class="ep-drive" data-didx="${i}" value="${val}"
          list="${lid}" placeholder="sensor.rackstation_drive_X_etat" autocomplete="off"/>
        <datalist id="${lid}" data-prefix="sensor.">${opts}</datalist>
      </div>
      <div class="field">
        <label>Alerte 1 (secteurs défectueux)</label>
        <input class="ep-alert" data-didx="${i}" data-aidx="0" value="${alerts[0] || ''}"
          list="${lidA0}" placeholder="binary_sensor..." autocomplete="off"/>
        <datalist id="${lidA0}" data-prefix="binary_sensor.">${optsB}</datalist>
      </div>
      <div class="field">
        <label>Alerte 2 (durée de vie)</label>
        <input class="ep-alert" data-didx="${i}" data-aidx="1" value="${alerts[1] || ''}"
          list="${lidA1}" placeholder="binary_sensor..." autocomplete="off"/>
        <datalist id="${lidA1}" data-prefix="binary_sensor.">${optsB}</datalist>
      </div>
    </div>`;
  }

  _num(label, key, val, ph, min, max, step) {
    const v = (val === undefined || val === null) ? '' : val;
    return `<div class="field"><label>${label}</label>
      <input type="number" data-key="${key}" value="${v}"
        min="${min}" max="${max}" step="${step}" placeholder="${ph}"/>
    </div>`;
  }

  _toggle(label, key, activeColor, stateOverride) {
    const on = (stateOverride !== undefined) ? stateOverride : !!this._config[key];
    return `<div class="field tog-row">
      <label>${label}</label>
      <label style="position:relative;display:inline-block;width:42px;height:24px;flex-shrink:0;">
        <input type="checkbox" data-key="${key}" ${on ? 'checked' : ''}
          style="opacity:0;width:0;height:0;position:absolute;"/>
        <span style="position:absolute;inset:0;border-radius:99px;cursor:pointer;transition:background .2s;
          background:${on ? activeColor : 'rgba(255,255,255,0.12)'};">
          <span style="position:absolute;top:3px;border-radius:50%;width:18px;height:18px;transition:left .2s;
            left:${on ? '21px' : '3px'};background:${on ? '#1a1a1a' : 'rgba(255,255,255,0.6)'};">
          </span>
        </span>
      </label>
    </div>`;
  }

  _syncValues() {
    const c = this._config || {};
    this.querySelectorAll('input[data-key], select[data-key]').forEach(inp => {
      if (document.activeElement === inp) return;
      const k = inp.dataset.key;
      const v = k.includes('.')
        ? k.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), c)
        : c[k];
      if (inp.type === 'checkbox') inp.checked = !!v;
      else inp.value = (v !== undefined && v !== null) ? v : '';
    });
  }

  _render() {
    const c = this._config || {};
    const g = (c.glitch && typeof c.glitch === 'object') ? c.glitch : {};
    // ensure card_mod_bg defaults to true in UI state
    if (c.card_mod_bg === undefined) c.card_mod_bg = true;

    let drivesHTML = '';
    for (let i = 0; i < 8; i++) drivesHTML += this._drivePicker(i);

    this.innerHTML = `
      <style>
        *{box-sizing:border-box;font-family:-apple-system,sans-serif}
        .grid{display:flex;flex-direction:column;gap:10px;padding:14px 0}
        .group{border:1px solid var(--divider-color,#333);border-radius:10px;padding:12px}
        .group-title{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:10px}
        .field{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
        .field:last-child{margin-bottom:0}
        label{font-size:12px;color:var(--secondary-text-color)}
        input,select{padding:8px 10px;border:1px solid var(--divider-color,#333);border-radius:7px;
          background:var(--card-background-color);color:var(--primary-text-color);font-size:13px;width:100%}
        input.ep,input.ep-drive,input.ep-alert{border-color:var(--primary-color,#777)}
        input.ep:focus,input.ep-drive:focus,input.ep-alert:focus{outline:none;box-shadow:0 0 0 1px var(--primary-color)}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .color-row{display:flex;align-items:center;gap:8px}
        .color-row input[type=color]{width:36px;height:36px;padding:2px;border-radius:6px;cursor:pointer;flex-shrink:0;border:none}
        .color-row input[type=text]{flex:1}
        .icon-row{display:flex;align-items:center;gap:8px}
        .icon-row input{flex:1}
        .icon-preview{width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--divider-color,#444);border-radius:6px;color:var(--primary-text-color)}
        .tog-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .tog-row label{margin:0}
        .drive-block{border:1px dashed var(--divider-color,#333);border-radius:8px;padding:8px 10px;margin-bottom:8px}
        .drive-hdr{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--primary-color);margin-bottom:6px;display:flex;justify-content:space-between}
        .drive-pos{color:var(--secondary-text-color);font-weight:normal;letter-spacing:0;text-transform:none}
      </style>
      <div class="grid">
        <div class="group">
          <div class="group-title">Général</div>
          <div class="field"><label>Titre</label>
            <input type="text" data-key="header.title" value="${(c.header && c.header.title) || ''}" placeholder="Rackstation"/>
          </div>
          <div class="field"><label>Icône (mdi) — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:10px">parcourir MDI ↗</a></label>
            <div class="icon-row">
              <input type="text" data-key="header.icon" value="${(c.header && c.header.icon) || ''}" placeholder="mdi:nas"/>
              <div class="icon-preview" data-preview="header.icon"></div>
            </div>
          </div>
          <div class="field"><label>Couleur titre</label>
            <input type="text" data-key="header.color" value="${(c.header && c.header.color) || ''}" placeholder="défaut thème — ex var(--primary-color)"/>
          </div>
          <div class="field"><label>Taille titre</label>
            <input type="text" data-key="header.title_size" value="${(c.header && c.header.title_size) || ''}" placeholder="13px"/>
          </div>
          <div class="field"><label>Text-shadow</label>
            <input type="text" data-key="header.title_shadow" value="${(c.header && c.header.title_shadow) || ''}" placeholder="0 0 6px ..."/>
          </div>
          <div class="field"><label>Label volume (footer)</label>
            <input type="text" data-key="volume_label" value="${c.volume_label || ''}" placeholder="Volume 1"/>
          </div>
        </div>

        <div class="group">
          <div class="group-title">Capteurs principaux</div>
          ${this._picker('Health / État volume', 'health_entity', 'sensor.rackstation_volume_1_etat')}
          ${this._picker('Température NAS', 'temp_entity', 'sensor.rackstation_temperature')}
          ${this._picker('Taille totale', 'total_entity', 'sensor.rackstation_volume_1_taille_totale')}
          ${this._picker('Espace utilisé', 'used_entity', 'sensor.rackstation_volume_1_espace_utilise')}
          ${this._picker('% utilisé (optionnel)', 'used_pct_entity', 'sensor.rackstation_volume_1_volume_utilise')}
        </div>

        <div class="group">
          <div class="group-title">Boutons</div>
          ${this._picker('Reboot', 'reboot_entity', 'button.rackstation_reboot', 'button.')}
          ${this._picker('Shutdown', 'shutdown_entity', 'button.rackstation_shutdown', 'button.')}
        </div>

        <div class="group">
          <div class="group-title">Disques (RX410 en haut · RS en bas)</div>
          ${drivesHTML}
        </div>

        <div class="group">
          <div class="group-title">Apparence</div>
          ${this._toggle('Hériter du fond card-mod', 'card_mod_bg', CP_ACCENT)}
          <div class="row2">
            <div class="field"><label>Accent</label>
              <div class="color-row">
                <input type="color" data-key="color_accent" value="${c.color_accent || CP_ACCENT}"/>
                <input type="text"  data-key="color_accent" value="${c.color_accent || ''}" placeholder="${CP_ACCENT}"/>
              </div>
            </div>
            <div class="field"><label>LED OK (clignotant)</label>
              <div class="color-row">
                <input type="color" data-key="led_ok_color" value="${c.led_ok_color || CP_OK}"/>
                <input type="text"  data-key="led_ok_color" value="${c.led_ok_color || ''}" placeholder="${CP_OK}"/>
              </div>
            </div>
          </div>
          <div class="row2">
            <div class="field"><label>Fond (si pas card-mod)</label>
              <div class="color-row">
                <input type="color" data-key="color_bg" value="${c.color_bg || CP_BG}"/>
                <input type="text"  data-key="color_bg" value="${c.color_bg || ''}" placeholder="${CP_BG}"/>
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group-title">🐱 GLITCH le chat</div>
          ${this._toggle('Activer la balade', 'glitch.enabled', CP_OK, (g.enabled !== false))}
          <div class="field"><label>Image (GIF)</label>
            <input type="text" data-key="glitch.src" value="${g.src || ''}" placeholder="${GLITCH.src}"/>
          </div>
          <div class="row2">
            ${this._num('Taille (px)', 'glitch.size', g.size, GLITCH.size, 8, 80, 1)}
            ${this._num('Hauteur / arête (px)', 'glitch.top', g.top, GLITCH.top, -30, 40, 1)}
          </div>
          <div class="row2">
            ${this._num('Vitesse (s / traversée)', 'glitch.speed', g.speed, GLITCH.speed, 2, 30, 0.5)}
            ${this._num('Pause entre balades (s)', 'glitch.gap', g.gap, GLITCH.gap, 0, 120, 1)}
          </div>
          <div class="field"><label>Proba Silverhand (0–1) <span style="color:var(--secondary-text-color)">— défaut ${GLITCH.prob}</span></label>
            <input type="number" data-key="glitch.prob" value="${g.prob ?? ''}" min="0" max="1" step="0.01" placeholder="${GLITCH.prob}"/>
          </div>
          <div class="group-title" style="margin-top:10px">Effet Silverhand</div>
          <div class="row2">
            ${this._num('Saturation', 'glitch.sat', g.sat, GLITCH.sat, 1, 30, 1)}
            ${this._num('Opacité calques (0–1)', 'glitch.op', g.op, GLITCH.op, 0, 1, 0.05)}
          </div>
          <div class="row2">
            ${this._num('Décalage RGB (px)', 'glitch.amp', g.amp, GLITCH.amp, 1, 20, 1)}
            ${this._num('Baisse du blanc (0–1)', 'glitch.dim', g.dim, GLITCH.dim, 0, 1, 0.05)}
          </div>
          ${this._num('Durée du glitch (ms)', 'glitch.dur', g.dur, GLITCH.dur, 300, 4000, 100)}
        </div>
      </div>
    `;

    // bindings
    this.querySelectorAll('input[data-key],select[data-key]').forEach(inp => {
      const key = inp.dataset.key;
      const ev = (inp.type === 'checkbox') ? 'change' : 'input';
      inp.addEventListener(ev, () => {
        if (inp.type === 'checkbox') this._set(key, null, inp.checked);
        else this._set(key, inp.value);
      });
    });
    this.querySelectorAll('.ep-drive').forEach(inp => {
      inp.addEventListener('input', () => this._setArr('drives', +inp.dataset.didx, inp.value));
    });
    this.querySelectorAll('.ep-alert').forEach(inp => {
      inp.addEventListener('input', () => this._setAlert(+inp.dataset.didx, +inp.dataset.aidx, inp.value));
    });
    // Preview live de l'icône (ha-icon via createElement, cf CARDS-METHOD.md — pas de datalist)
    this.querySelectorAll('.icon-preview[data-preview]').forEach(preview => {
      const inp = this.querySelector(`input[data-key="${preview.dataset.preview}"]`);
      const upd = () => {
        const val = (inp && inp.value || '').trim();
        preview.innerHTML = '';
        if (val.match(/^mdi:[a-zA-Z0-9_-]+$/)) {
          const ico = document.createElement('ha-icon');
          ico.setAttribute('icon', val);
          ico.style.cssText = '--mdc-icon-size:20px';
          preview.appendChild(ico);
        }
      };
      if (inp) inp.addEventListener('input', upd);
      upd();
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  REGISTER                                                                  *
 * ═══════════════════════════════════════════════════════════════════════════ */

if (!customElements.get('neon-nas-card'))
  customElements.define('neon-nas-card', NeonNasCard);
if (!customElements.get('neon-nas-card-editor'))
  customElements.define('neon-nas-card-editor', NeonNasCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-nas-card',
  name: 'Neon NAS Card',
  description: 'Synology Rackstation — 8 bays (RS + RX410) with drive LEDs & volume donut',
  preview: true,
});

console.info('%c NEON-NAS-CARD %c v1.5 ',
  'background:#00fff9;color:#040614;font-weight:700;',
  'background:#B400FF;color:#fff;');

})();

console.info(
  '%c 🖥️ neon-nas-card v2.0 %c Neo Tokyo ',
  'background:#FF6A00;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FFD700;padding:2px 4px;border-radius:0 3px 3px 0;'
);
