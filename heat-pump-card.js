// heat-pump-card.js · PAC Neo Tokyo · Gas Spectrum Edition
// /config/www/heat-pump-card.js
//
// type: custom:heat-pump-card
// title: PAC Ecodan
// climate: climate.pac_ecodan
// max_power: 3
// power_unit: W
// entities:
//   fan_rpm:        sensor.ecodan_heatpump_fan_speed
//   temp_water_out: sensor.ecodan_heatpump_feed_temp
//   temp_water_ret: sensor.ecodan_heatpump_return_temp
//   power:          sensor.nodon_capteur_power
//   status:         sensor.ecodan_heatpump_operation_mode
//   compressor:     binary_sensor.ecodan_heatpump_compressor
//   comp_freq:      sensor.ecodan_heatpump_compressor_frequency  # blade lerp
//   booster:        binary_sensor.ecodan_heatpump_booster_heater # hub alert
//   lockout:        binary_sensor.ecodan_heatpump_short_cycle_lockout # card flash
// tiles:
//   - entity: sensor.ecodan_heatpump_outside_temp
//     label:  T_EXT
//     color:  xenon
//     unit:   °C
// colors:
//   tile_0: '#2EE5B6'        tile_1: '#E0115F'
//   tile_2: '#9D4EDD'        tile_3: '#FFEE58'
//   badge_off:     '#1a2040'
//   badge_on:      '#2EE5B6'
//   badge_cool:    '#00D4FF'
//   badge_defrost: '#FFEE58'
//   power_core:  '#FFEE58'   climate:     '#9D4EDD'
//   dep_color:   '#FFD700'   ret_color:   '#00D4FF'
//   fan_outer:   '#6200EA'   fan_core:    '#BB86FC'
//   blade_cold:  '#00D4FF'   blade_hot:   '#E0115F'
//   title_color: '#00D4FF'   border_color:'#1E90FF'

const CARD_TAG = 'heat-pump-card';
const clamp    = (v, a, b) => Math.max(a, Math.min(b, v));
const VIS_MAX_RPM = 120;
const FAN_RENDER_INTERVAL_MS = 16;

function lerpHex(h1, h2, t) {
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = p(h1), [r2,g2,b2] = p(h2);
  const r=(r1+(r2-r1)*t)|0, g=(g1+(g2-g1)*t)|0, b=(b1+(b2-b1)*t)|0;
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── Particle config (fan viewBox hub = 97,92) ──────────────────────────────
const PCFG = [
  {cx:5,   cy:54,  tx:97, ty:92, dur:1.4, bg:0,   r:2.5, c:'#00D4FF'},
  {cx:-1,  cy:92,  tx:97, ty:92, dur:1.7, bg:.3,  r:2.5, c:'#00D4FF'},
  {cx:4,   cy:130, tx:97, ty:92, dur:1.6, bg:.8,  r:2.5, c:'rgba(0,212,255,.75)'},
  {cx:-6,  cy:72,  tx:97, ty:92, dur:2.0, bg:1.1, r:2.2, c:'#00D4FF'},
  {cx:-5,  cy:112, tx:97, ty:92, dur:1.9, bg:1.6, r:2.2, c:'rgba(0,212,255,.75)'},
  {cx:-13, cy:52,  tx:97, ty:92, dur:1.3, bg:.5,  r:2.0, c:'#00D4FF'},
  {cx:-9,  cy:137, tx:97, ty:92, dur:1.5, bg:1.3, r:2.0, c:'rgba(56,189,248,.85)'},
  {cx:-3,  cy:84,  tx:97, ty:92, dur:1.2, bg:.2,  r:1.8, c:'rgba(56,189,248,.85)'},
  {cx:16,  cy:24,  tx:97, ty:92, dur:2.1, bg:.9,  r:1.5, c:'rgba(0,200,255,.6)'},
  {cx:13,  cy:159, tx:97, ty:92, dur:2.3, bg:1.8, r:1.5, c:'rgba(0,200,255,.6)'},
];
const PCOUNTS = [0, 3, 5, 7, 10];

// ── Template builders ──────────────────────────────────────────────────────

function tileColorClass(color, idx) {
  if (color === 'argon')  return 'a';
  if (color === 'xenon')  return 'x';
  // legacy aliases
  if (color === 'magenta' || color === 'orange') return 'a';
  // default alternating
  return idx % 2 === 0 ? 'x' : 'a';
}

function buildTilesHTML(tiles, colors) {
  return (tiles || []).slice(0, 4).map((t, i) => {
    const hasCustom = colors && colors[`tile_${i}`];
    let gbClass, lblClass;
    if (hasCustom) {
      gbClass = `tile-c${i}`;
      lblClass = `tile-lbl-c${i}`;
    } else {
      const cc = tileColorClass(t.color, i);
      gbClass = `gb-${cc}`;
      lblClass = cc;
    }
    return `<div class="gb ${gbClass} tile" data-tile="${i}" style="cursor:pointer">
  <div class="t-lbl ${lblClass}">${t.label || ''}</div>
  <div class="t-val" id="sv-tile-${i}">--</div>
</div>`;
  }).join('\n');
}

function buildThermoHTML() {
  return `<div class="gb gb-x thermo" id="thermo-block">
  <div class="thermo-mode" id="thermo-mode">◈ —</div>
  <div class="thermo-row">
    <div class="thermo-btn" id="thermo-minus">−</div>
    <div class="thermo-temps">
      <div class="thermo-sp"><span id="thermo-sp">--</span><span class="thermo-sp-unit">°C</span></div>
      <div class="thermo-cur">
        <div class="thermo-cur-val" id="thermo-cur">--°C</div>
        <div class="thermo-cur-lbl">current</div>
      </div>
    </div>
    <div class="thermo-btn" id="thermo-plus">+</div>
  </div>
</div>`;
}

function buildPipesSVG() {
  return `<svg class="pipes-svg" viewBox="0 0 202 62" height="62" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="fp" x="-8%" y="-80%" width="116%" height="260%">
    <feGaussianBlur stdDeviation="2.5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(255,100,0,.12)"/>
    <stop offset="38%"  stop-color="rgba(255,214,0,.92)"/>
    <stop offset="50%"  stop-color="rgba(255,246,140,1)"/>
    <stop offset="62%"  stop-color="rgba(255,214,0,.92)"/>
    <stop offset="100%" stop-color="rgba(255,100,0,.12)"/>
  </linearGradient>
  <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(0,100,180,.12)"/>
    <stop offset="38%"  stop-color="rgba(0,212,255,.88)"/>
    <stop offset="50%"  stop-color="rgba(160,245,255,1)"/>
    <stop offset="62%"  stop-color="rgba(0,212,255,.88)"/>
    <stop offset="100%" stop-color="rgba(0,100,180,.12)"/>
  </linearGradient>
</defs>

<g id="pipe-hot" style="transition:opacity 1.2s ease">
  <text x="1" y="22" font-size="24" font-family="serif" fill="rgba(255,214,0,.75)">出</text>
  <rect x="28" y="1"  width="162" height="18" rx="9" fill="rgba(30,8,0,.95)"/>
  <rect x="28" y="1"  width="162" height="18" rx="9" fill="url(#gh)" filter="url(#fp)">
    <animate attributeName="opacity" values=".9;.5;.95;.6;.9" dur="2s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1"/>
  </rect>
  <circle cx="32" cy="10" r="4.5" fill="rgba(255,245,170,.92)" opacity="0">
    <animate attributeName="cx"      values="32;184"      dur="1.8s" repeatCount="indefinite" calcMode="spline" keySplines=".25 0 .75 1"/>
    <animate attributeName="opacity" values="0;.92;.92;0" dur="1.8s" repeatCount="indefinite" keyTimes="0;.05;.85;1"/>
  </circle>
  <circle cx="32" cy="10" r="3" fill="rgba(255,180,0,.85)" opacity="0">
    <animate attributeName="cx"      values="32;184"      dur="2.2s" begin=".6s" repeatCount="indefinite" calcMode="spline" keySplines=".25 0 .75 1"/>
    <animate attributeName="opacity" values="0;.85;.85;0" dur="2.2s" begin=".6s" repeatCount="indefinite" keyTimes="0;.05;.85;1"/>
  </circle>
  <circle cx="80"  cy="10" r="2" fill="rgba(255,240,120,.65)"><animate attributeName="opacity" values=".65;.1;.8;.2;.65" dur=".9s"  repeatCount="indefinite" calcMode="discrete"/></circle>
  <circle cx="140" cy="10" r="2" fill="rgba(255,240,120,.65)"><animate attributeName="opacity" values=".2;.7;.1;.9;.2"   dur="1.3s" repeatCount="indefinite" calcMode="discrete"/></circle>
  <text x="30" y="-1" fill="rgba(255,180,0,.45)" font-size="6.5" font-family="'Share Tech Mono',monospace" letter-spacing=".08em">↑ DEP</text>
  <g>
    <animate attributeName="opacity" calcMode="discrete" dur="7.3s" repeatCount="indefinite" keyTimes="0;.6;.62;.64;1" values="1;.05;.8;1;1"/>
    <text id="sv-dep" x="188" y="15" text-anchor="end" fill="rgba(255,230,80,1)" font-size="13" font-family="'orbitron',monospace">--°C</text>
  </g>
</g>

<g id="pipe-cold" style="transition:opacity 1.2s ease">
  <text x="1" y="57" font-size="24" font-family="serif" fill="rgba(0,212,255,.75)">入</text>
  <rect x="28" y="34" width="162" height="18" rx="9" fill="rgba(0,8,25,.95)"/>
  <rect x="28" y="34" width="162" height="18" rx="9" fill="url(#gc)" filter="url(#fp)">
    <animate attributeName="opacity" values=".85;.45;.92;.58;.85" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1"/>
  </rect>
  <circle cx="184" cy="43" r="4.5" fill="rgba(180,245,255,.92)" opacity="0">
    <animate attributeName="cx"      values="184;32"      dur="2s"   repeatCount="indefinite" calcMode="spline" keySplines=".25 0 .75 1"/>
    <animate attributeName="opacity" values="0;.92;.92;0" dur="2s"   repeatCount="indefinite" keyTimes="0;.05;.85;1"/>
  </circle>
  <circle cx="184" cy="43" r="3" fill="rgba(0,212,255,.85)" opacity="0">
    <animate attributeName="cx"      values="184;32"      dur="2.5s" begin=".7s" repeatCount="indefinite" calcMode="spline" keySplines=".25 0 .75 1"/>
    <animate attributeName="opacity" values="0;.85;.85;0" dur="2.5s" begin=".7s" repeatCount="indefinite" keyTimes="0;.05;.85;1"/>
  </circle>
  <circle cx="75"  cy="43" r="2" fill="rgba(150,235,255,.7)"><animate attributeName="opacity" values=".7;.1;.8;.1;.7"  dur="1.1s" repeatCount="indefinite" calcMode="discrete"/></circle>
  <circle cx="140" cy="43" r="2" fill="rgba(150,235,255,.7)"><animate attributeName="opacity" values=".1;.7;.1;.9;.1"  dur="1.6s" repeatCount="indefinite" calcMode="discrete"/></circle>
  <text x="30" y="32" fill="rgba(0,212,255,.4)" font-size="6.5" font-family="'Share Tech Mono',monospace" letter-spacing=".08em">↓ RET</text>
  <g>
    <animate attributeName="opacity" calcMode="discrete" dur="10.5s" repeatCount="indefinite" keyTimes="0;.4;.42;.44;1" values="1;.05;.7;1;1"/>
    <text id="sv-ret" x="188" y="48" text-anchor="end" fill="rgba(0,230,255,1)" font-size="13" font-family="'orbitron',monospace">--°C</text>
  </g>
</g>
</svg>`;
}

function buildFanSVG() {
  // particle SMIL — all 10
  const particles = PCFG.map(p => `
<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.c}" opacity="0">
  <animate attributeName="cx"      values="${p.cx};${p.tx}"        dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1"/>
  <animate attributeName="cy"      values="${p.cy};${p.ty}"        dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1"/>
  <animate attributeName="opacity" values="0;.9;.65;0"             dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" keyTimes="0;.05;.8;1"/>
  <animate attributeName="r"       values="${p.r};${(p.r*.35).toFixed(1)}" dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite"/>
</circle>`).join('');

  return `<svg class="fan-svg" viewBox="0 0 195 184" id="fan-svg" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="f-hub"  x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"   result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="f-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="f-hot"  x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"   result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="f-out"  x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="ps" x="0" y="0" width="2" height="3" patternUnits="userSpaceOnUse"><rect width="2" height="1" fill="rgba(0,0,0,.22)"/></pattern>
  <radialGradient id="disc-fill" cx="50%" cy="50%">
    <stop offset="0%"   stop-color="#00D4FF" stop-opacity=".06"/>
    <stop offset="100%" stop-color="#00D4FF" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- disc bg -->
<circle cx="97" cy="92" r="92" fill="rgba(2,5,16,.97)" stroke="rgba(0,212,255,.06)" stroke-width="1"/>
<circle cx="97" cy="92" r="92" fill="url(#ps)" opacity=".28"/>
<circle cx="97" cy="92" r="92" fill="url(#disc-fill)"/>
<!-- guide rings -->
<circle cx="97" cy="92" r="60" fill="none" stroke="rgba(0,212,255,.04)" stroke-width="1"/>
<circle cx="97" cy="92" r="36" fill="none" stroke="rgba(0,212,255,.04)" stroke-width="1"/>
<line x1="16" y1="92" x2="178" y2="92" stroke="rgba(0,212,255,.03)" stroke-width="1"/>
<line x1="97" y1="16" x2="97"  y2="168" stroke="rgba(0,212,255,.03)" stroke-width="1"/>

<!-- OUTER ring — argon, fixed -->
<circle id="fan-outer-ring" cx="97" cy="92" r="92" fill="none" stroke="#9D4EDD" stroke-width="1.8" opacity=".38" filter="url(#f-out)"/>

<!-- INNER ring — xenon fixed, r=80 -->
<circle id="fan-inner-ring" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="1.8" opacity=".5" filter="url(#f-glow)"/>

<!-- COMET TRAIL — 7 segments, rotated in JS as a single group for smoother/lighter updates
  dasharray="28 474" each segment = 20° arc on r=80 (circ≈502)
  offsets i*28 (i=1..7) place segments behind the blade tip in CW rotation -->
<g id="trail-group">
  <circle id="trail7" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="3"   opacity=".05" stroke-dasharray="28 474" stroke-dashoffset="196" stroke-linecap="round" filter="url(#f-hot)"/>
  <circle id="trail6" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="4"   opacity=".10" stroke-dasharray="28 474" stroke-dashoffset="168" stroke-linecap="round" filter="url(#f-hot)"/>
  <circle id="trail5" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="4.5" opacity=".18" stroke-dasharray="28 474" stroke-dashoffset="140" stroke-linecap="round" filter="url(#f-hot)"/>
  <circle id="trail4" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="5"   opacity=".28" stroke-dasharray="28 474" stroke-dashoffset="112" stroke-linecap="round" filter="url(#f-hot)"/>
  <circle id="trail3" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="5.5" opacity=".40" stroke-dasharray="28 474" stroke-dashoffset="84"  stroke-linecap="round" filter="url(#f-glow)"/>
  <circle id="trail2" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="5.5" opacity=".58" stroke-dasharray="28 474" stroke-dashoffset="56"  stroke-linecap="round" filter="url(#f-glow)"/>
  <circle id="trail1" cx="97" cy="92" r="80" fill="none" stroke="#00D4FF" stroke-width="5"   opacity=".78" stroke-dasharray="28 474" stroke-dashoffset="28"  stroke-linecap="round" filter="url(#f-glow)"/>
</g>

<!-- PARTICLES (populated by JS via _rebuildParticles) -->
<g id="particles-dyn"/>

<!-- FAN ROTOR (rotated in JS) -->
<g id="fan-rotor">
  <path id="blade-0" d="M97,92 C110,78 123,40 97,22 C84,18 75,30 81,48 C87,66 93,80 97,92Z" fill="rgba(0,212,255,.055)" stroke="#00D4FF" stroke-width="1.2"/>
  <path id="blade-1" d="M97,92 C110,78 123,40 97,22 C84,18 75,30 81,48 C87,66 93,80 97,92Z" fill="rgba(0,212,255,.055)" stroke="#00D4FF" stroke-width="1.2" transform="rotate(120 97 92)"/>
  <path id="blade-2" d="M97,92 C110,78 123,40 97,22 C84,18 75,30 81,48 C87,66 93,80 97,92Z" fill="rgba(0,212,255,.055)" stroke="#00D4FF" stroke-width="1.2" transform="rotate(240 97 92)"/>
  <!-- hub -->
  <circle id="hub-ring" cx="97" cy="92" r="14" fill="rgba(2,5,16,.98)" stroke="#00D4FF" stroke-width="1.4" filter="url(#f-glow)"/>
  <circle id="hub-glow" cx="97" cy="92" r="6.5" fill="rgba(0,212,255,.8)" filter="url(#f-hub)">
    <animate attributeName="r"       values="6.5;8.5;6.5;5.5;6.5"   dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1"/>
    <animate attributeName="opacity" values=".8;.3;.9;.25;.8"         dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <text id="hub-defrost" x="97" y="97" text-anchor="middle" font-size="11" fill="#FFEE58" opacity="0" style="transition:opacity .8s ease">❄</text>
  <circle cx="97" cy="92" r="2.8" fill="white"/>
</g>
</svg>`;
}

function buildPowerBlock() {
  return `<div class="gb gb-power power-block" id="power-block">
  <div>
    <div class="power-lbl">▸ POWER CORE</div>
    <div class="power-jp">エネルギー消費</div>
  </div>
  <svg class="power-spark" id="power-spark" width="80" height="26" viewBox="0 0 80 26">
    <defs>
      <filter id="f-spark" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <line x1="0" y1="13" x2="80" y2="13" stroke="rgba(255,238,88,.07)" stroke-width="1"/>
    <polyline points="0,13 12,13 18,5 24,20 32,7 38,18 44,10 50,16 56,6 62,19 68,13 80,13"
      fill="none" stroke="#FFEE58" stroke-width="1.5" stroke-linejoin="round" filter="url(#f-spark)" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.9;0.6;0;0;0;0;0;0;0;0;0;0;0.85;0.4;0;0;0;0" dur="3.1s" repeatCount="indefinite" calcMode="discrete"/>
    </polyline>
    <polyline points="15,13 22,13 27,4 33,21 39,9 45,17 51,11 57,13 65,13"
      fill="none" stroke="#FFEE58" stroke-width="1.2" stroke-linejoin="round" filter="url(#f-spark)" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0;0.8;0.3;0;0;0;0;0;0;0;0;0;0;0.7;0.2;0;0;0;0;0;0" dur="4.7s" repeatCount="indefinite" calcMode="discrete"/>
    </polyline>
    <circle cx="40" cy="13" r="2" fill="#FFEE58" filter="url(#f-spark)" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0.9;0;0;0;0;0;0;0;0.7;0;0;0;0;0;0" dur="2.3s" repeatCount="indefinite" calcMode="discrete"/>
      <animate attributeName="cx" values="10;25;40;55;70;10" dur="2.3s" repeatCount="indefinite" calcMode="discrete"/>
    </circle>
  </svg>
  <div class="power-val" id="t-pwr">-- W</div>
</div>`;
}

function hexToRgb(hex) {
  const h = hex.replace('#','');
  const n = parseInt(h.length === 3
    ? h.split('').map(c=>c+c).join('') : h, 16);
  return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
}

function buildCustomVars(colors) {
  if (!colors) return '';
  const lines = [];
  // tile overrides: colors.tile_0 … tile_3
  for (let i = 0; i < 4; i++) {
    const c = colors[`tile_${i}`];
    if (c) {
      lines.push(`  --tile-${i}-color: ${c};`);
      lines.push(`  --tile-${i}-rgb: ${hexToRgb(c)};`);
    }
  }
  // badge-off
  if (colors.badge_off) {
    lines.push(`  --badge-off-color: ${colors.badge_off};`);
    lines.push(`  --badge-off-rgb: ${hexToRgb(colors.badge_off)};`);
  }
  // badge active states
  if (colors.badge_on)     { lines.push(`  --badge-on-color: ${colors.badge_on};`);         lines.push(`  --rgb-badge-on: ${hexToRgb(colors.badge_on)};`); }
  if (colors.badge_cool)   { lines.push(`  --badge-cool-color: ${colors.badge_cool};`);     lines.push(`  --rgb-badge-cool: ${hexToRgb(colors.badge_cool)};`); }
  if (colors.badge_defrost){ lines.push(`  --badge-defrost-color: ${colors.badge_defrost};`);lines.push(`  --rgb-badge-defrost: ${hexToRgb(colors.badge_defrost)};`); }
  // card title + border
  if (colors.title_color)  { lines.push(`  --title-color: ${colors.title_color};`); }
  if (colors.border_color) { lines.push(`  --border-color: ${colors.border_color};`); }
  // power core (accent text) + power border (independent)
  if (colors.power_core) {
    lines.push(`  --helium-power: ${colors.power_core};`);
    lines.push(`  --rgb-helium-power: ${hexToRgb(colors.power_core)};`);
    lines.push(`  --power-border: ${colors.power_core};`);
    lines.push(`  --rgb-power-border: ${hexToRgb(colors.power_core)};`);
  }
  if (colors.power_border) {
    lines.push(`  --power-border: ${colors.power_border};`);
    lines.push(`  --rgb-power-border: ${hexToRgb(colors.power_border)};`);
  }
  // climate / thermostat
  if (colors.climate) {
    lines.push(`  --helium-climate: ${colors.climate};`);
    lines.push(`  --rgb-helium-climate: ${hexToRgb(colors.climate)};`);
  }
  
  if (colors.climate_val) {
    lines.push(`  --xenon: ${colors.climate_val};`);
    lines.push(`  --rgb-xenon: ${hexToRgb(colors.climate_val)};`);
  }
  
  return lines.length ? `:host {\n${lines.join('\n')}\n}\n` : '';
}

// ── NeonHeader inline ─────────────────────────────────────────────────────────
function _neonHeaderCss(hdr) {
  if (!hdr || hdr === false) return '';
  const color  = hdr.color       || 'rgba(180,130,255,0.55)';
  const size   = hdr.title_size  || 'clamp(8px, 2vw, 11px)';
  const font   = hdr.font        ? `'${hdr.font}', ` : "'Orbitron', ";
  const shadow = hdr.title_shadow || 'none';
  const badgeColor = hdr.badge_color || 'rgba(0,255,249,0.7)';
  return `
.neon-hdr { display:flex; align-items:center; gap:8px; padding:8px 4px 8px; }
.neon-hdr-icon { display:flex; align-items:center; flex-shrink:0; }
.neon-hdr-icon ha-icon {
  --mdc-icon-size: clamp(16px, calc(${size} * 1.125), 18px); color: ${color};
  filter: drop-shadow(0 0 8px color-mix(in srgb, currentColor, transparent 10%));
}
.neon-hdr-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:1px; justify-content:center; }
#badge { margin-left:auto; flex-shrink:0; align-self:center; font-size:clamp(9px, 1.8vw, 10px); padding: 3px 10px; }
@media (orientation: landscape) and (max-height: 850px) {
  .neon-hdr { flex-direction: column; align-items: flex-start; gap: 3px; }
  .neon-hdr-icon { position: absolute; }
  .neon-hdr-body { padding-left: 28px; }
  #badge { margin-left: 0; align-self: flex-start; }
}
.neon-hdr-title {
  font-family: ${font}var(--primary-font-family, system-ui);
  font-size: clamp(14px, ${size}, ${size});
  color: ${color};
  padding-left: 8px;
  letter-spacing: clamp(1px, 0.5cqi, 3px);
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
}`;
}

function _buildNeonHeaderHTML(hdr) {
  if (!hdr || hdr === false) return '';
  const icon     = hdr.icon     || '';
  const title    = hdr.title    || '';
  const subtitle = hdr.subtitle || '';
  const badge    = hdr.badge    || '';
  if (!icon && !title) return '';
  return `
  <div class="neon-hdr">
    ${icon ? `<div class="neon-hdr-icon"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
    <div class="neon-hdr-body">
      ${title ? `<span class="neon-hdr-title">${title}</span>` : ''}
    </div>
    <span class="badge badge-off" id="badge">■ ARRÊT</span>
    ${badge ? `<span class="neon-hdr-badge">${badge}</span>` : ''}
  </div>
  <div class="neon-main-div"></div>`;
}

function buildTemplate(title, tiles, hasClimate, colors, headerConfig) {
  return `
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
:host {
  display: block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --xenon:       #00D4FF;
  --argon:       #9D4EDD;
  --krypton:     #2EE5B6;
  --helium:      #FFEE58;
  --radon:       #E0115F;
  --card-bg: var(--ha-card-background, var(--card-background-color, transparent));
  --rgb-xenon:   0,212,255;
  --rgb-argon:   157,78,221;
  --rgb-krypton: 46,229,182;
  --rgb-helium:  255,238,88;
  --rgb-radon:   224,17,95;
  /* tile color defaults — overridable via colors.tile_N in yaml */
  --tile-0-color: var(--xenon);   --tile-0-rgb: var(--rgb-xenon);
  --tile-1-color: var(--argon);   --tile-1-rgb: var(--rgb-argon);
  --tile-2-color: var(--xenon);   --tile-2-rgb: var(--rgb-xenon);
  --tile-3-color: var(--argon);   --tile-3-rgb: var(--rgb-argon);
  /* badge-off, power-core, climate — overridable */
  --badge-off-color: rgba(40,48,78,.85);
  --badge-off-rgb:   40,48,78;
  --badge-on-color:      var(--krypton); --rgb-badge-on:      var(--rgb-krypton);
  --badge-cool-color:    var(--xenon);   --rgb-badge-cool:    var(--rgb-xenon);
  --badge-defrost-color: var(--helium);  --rgb-badge-defrost: var(--rgb-helium);
  --helium-power:   var(--helium);   --rgb-helium-power:   var(--rgb-helium);
  --power-border:   var(--helium);   --rgb-power-border:   var(--rgb-helium);
  --helium-climate: var(--helium);   --rgb-helium-climate: var(--rgb-helium);
  --title-color:  rgba(0,212,255,.45);
  --border-color: rgba(0,212,255,.15);
}
${buildCustomVars(colors)}

ha-card {
  background: var(--card-bg) !important;
  backdrop-filter: var(--ha-card-backdrop-filter, none);
  -webkit-backdrop-filter: var(--ha-card-backdrop-filter, none);
  border-radius: 14px !important;
  border: 1px solid var(--border-color) !important;
  overflow: hidden;
  position: relative;
  color: #fff;
  font-family: 'Share Tech Mono', var(--primary-font-family, monospace);
  contain: layout style paint;
  box-sizing: border-box;
  width: 100%;
}

.blob { position: absolute; border-radius: 50%; filter: blur(52px); pointer-events: none; z-index: 0; }
.blob-c { width:220px; height:220px; background:rgba(var(--rgb-xenon),.07);  top:-60px;  left:-50px; }
.blob-m { width:180px; height:180px; background:rgba(var(--rgb-argon),.06);  bottom:20px;left:30px;  }
.blob-g { width:140px; height:140px; background:rgba(var(--rgb-helium),.04); top:50px;   right:5px;  }

.inner { padding: 10px 10px 12px; position: relative; z-index: 2; box-sizing: border-box; }

/* ── header ── */
.hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; padding: 0 0 0 0; }

.badge {
  font-size: clamp(7px, 1.5vw, 8px); padding: 2px 8px; border-radius: 3px;
  display: inline-flex; align-items: center; width: fit-content;
  letter-spacing: .12em; text-transform: uppercase;
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  position: relative; overflow: hidden;
  text-shadow: 0 0 4px currentColor;
}
.badge::before {
  content: ''; position: absolute; inset: 0; border-radius: 2px;
  pointer-events: none; z-index: 2;
  mask-image: linear-gradient(90deg, black 5%, transparent 32%, transparent 68%, black 95%);
  -webkit-mask-image: linear-gradient(90deg, black 5%, transparent 32%, transparent 68%, black 95%);
}
.badge-off    { color: rgba(255,255,255,.82); border-color: rgba(185,242,255,.28); background: rgba(var(--badge-off-rgb),.06); }
.badge-off::before { box-shadow: inset 2px 0 0 0 rgba(var(--badge-off-rgb),.5), inset -2px 0 0 0 rgba(var(--badge-off-rgb),.5); }
.badge-on     { color: var(--badge-on-color); border-color: rgba(var(--rgb-badge-on),.35); background: rgba(var(--rgb-badge-on),.03); box-shadow: 0 0 8px rgba(var(--rgb-badge-on),.45), inset 0 0 4px rgba(var(--rgb-badge-on),.25); animation: uv-flicker 6s infinite alternate ease-in-out; }
.badge-on::before  { box-shadow: inset 2px 0 0 0 var(--badge-on-color), inset -2px 0 0 0 var(--badge-on-color), -10px 0 18px -2px var(--badge-on-color), 10px 0 18px -2px var(--badge-on-color); }
.badge-cool   { color: var(--badge-cool-color); border-color: rgba(var(--rgb-badge-cool),.35); background: rgba(var(--rgb-badge-cool),.05); }
.badge-cool::before { box-shadow: inset 2px 0 0 0 var(--badge-cool-color), inset -2px 0 0 0 var(--badge-cool-color), -10px 0 18px -2px var(--badge-cool-color), 10px 0 18px -2px var(--badge-cool-color); }
.badge-defrost { color: var(--badge-defrost-color); border-color: rgba(var(--rgb-badge-defrost),.35); background: rgba(var(--rgb-badge-defrost),.05); }
.badge-defrost::before { box-shadow: inset 2px 0 0 0 var(--badge-defrost-color), inset -2px 0 0 0 var(--badge-defrost-color), -10px 0 18px -2px var(--badge-defrost-color), 10px 0 18px -2px var(--badge-defrost-color); }

/* ── layout ── */
.body {
  display: grid;
  grid-template-columns: minmax(0, 44%) 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "tiles  fan"
    "thermo fan"
    "pipes  fan";
  gap: 7px 10px;
  align-items: start;
}
.left-col    { grid-area: tiles; min-width: 0; }
.pipes-wrap  { grid-area: pipes; min-width: 0; }
.thermo-wrap { grid-area: thermo; min-width: 0; container-type: inline-size; }
.fan-col     { grid-area: fan; min-width: 0; display: flex; flex-direction: column; gap: 7px; }

/* iPad / Android portrait : thermo passe en bas pleine largeur */
@media (max-width: 1100px) {
  .body {
    grid-template-areas:
      "tiles fan"
      "pipes fan"
      "thermo thermo";
  }

  }
  .thermo-wrap { margin-top: 2px; }
  .thermo-temps { flex-direction: row; justify-content: center; gap: clamp(12px, 4vw, 40px); }

}

@container (max-width: 220px) {
  .tiles { grid-template-columns: 1fr; }
}
  
/* ── glass block base ── */
.gb {
  background: linear-gradient(135deg, rgba(12,16,32,.9) 0%, rgba(4,6,14,.98) 100%);
  backdrop-filter: var(--ha-card-backdrop-filter, blur(14px));
  -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(14px));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.7);
  position: relative;
  overflow: visible;
}
.gb::after {
  content: ''; position: absolute; top: 0; left: 10%; width: 80%; height: 1px;
  border-radius: 1px; pointer-events: none; z-index: 3;
}
.gb::before {
  content: ''; position: absolute; inset: 0; border-radius: 8px;
  pointer-events: none; z-index: 2;
  mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
}
/* base borders — dim (idle) */
.gb-x { border: 1px solid rgba(var(--rgb-xenon),.16); }
.gb-x::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-xenon),.4), transparent); }
.gb-x::before { box-shadow: inset 0 -2px 0 0 var(--xenon); }
.gb-a { border: 1px solid rgba(var(--rgb-argon),.18); }
.gb-a::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-argon),.4), transparent); }
.gb-a::before { box-shadow: inset 0 -2px 0 0 var(--argon); }
.gb-h { border: 1px solid rgba(var(--rgb-helium),.16); }
.gb-h::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-helium),.32), transparent); }
.gb-h::before { box-shadow: inset 0 -2px 0 0 var(--helium); }
.gb-power { border: 1px solid rgba(var(--rgb-power-border),.16); }
.gb-power::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-power-border),.32), transparent); }
.gb-power::before { box-shadow: inset 0 -2px 0 0 var(--power-border); }

/* ── NEO ACTIVE: saturated borders when pump is not off ── */
ha-card.is-active .gb-x { border-color: rgba(var(--rgb-xenon),.35); box-shadow: 0 0 10px rgba(var(--rgb-xenon),.15); }
ha-card.is-active .gb-x::before { box-shadow: inset 0 -1px 0 0 var(--xenon), 0 4px 12px rgba(var(--rgb-xenon),.35); }
ha-card.is-active .gb-a { border-color: rgba(var(--rgb-argon),.35); box-shadow: 0 0 10px rgba(var(--rgb-argon),.15); }
ha-card.is-active .gb-a::before { box-shadow: inset 0 -1px 0 0 var(--argon), 0 4px 12px rgba(var(--rgb-argon),.40); }
ha-card.is-active .gb-h { border-color: rgba(var(--rgb-helium),.52); box-shadow: 0 0 6px rgba(var(--rgb-helium),.16); }
ha-card.is-active .gb-h::before { box-shadow: inset 0 -2px 0 0 var(--helium), 0 0 10px rgba(var(--rgb-helium),.20); }
ha-card.is-active .gb-power { border-color: rgba(var(--rgb-power-border),.52); box-shadow: 0 0 6px rgba(var(--rgb-power-border),.16); }
ha-card.is-active .gb-power::before { box-shadow: inset 0 -2px 0 0 var(--power-border), 0 0 10px rgba(var(--rgb-power-border),.20); }
ha-card.is-active { border-color: rgba(var(--rgb-xenon),.38) !important; box-shadow: 0 0 14px rgba(var(--rgb-xenon),.10); }

/* ── per-tile color overrides (applied via inline style on the tile gb div) ── */
.tile-c0 { border-color: rgba(var(--tile-0-rgb),.18) !important; }
.tile-c0::after  { background: linear-gradient(90deg, transparent, rgba(var(--tile-0-rgb),.4), transparent) !important; }
.tile-c0::before { box-shadow: inset 0 -2px 0 0 var(--tile-0-color) !important; }
.tile-c1 { border-color: rgba(var(--tile-1-rgb),.18) !important; }
.tile-c1::after  { background: linear-gradient(90deg, transparent, rgba(var(--tile-1-rgb),.4), transparent) !important; }
.tile-c1::before { box-shadow: inset 0 -2px 0 0 var(--tile-1-color) !important; }
.tile-c2 { border-color: rgba(var(--tile-2-rgb),.18) !important; }
.tile-c2::after  { background: linear-gradient(90deg, transparent, rgba(var(--tile-2-rgb),.4), transparent) !important; }
.tile-c2::before { box-shadow: inset 0 -2px 0 0 var(--tile-2-color) !important; }
.tile-c3 { border-color: rgba(var(--tile-3-rgb),.18) !important; }
.tile-c3::after  { background: linear-gradient(90deg, transparent, rgba(var(--tile-3-rgb),.4), transparent) !important; }
.tile-c3::before { box-shadow: inset 0 -2px 0 0 var(--tile-3-color) !important; }
.tile-lbl-c0 { color: rgba(var(--tile-0-rgb),.42) !important; }
.tile-lbl-c1 { color: rgba(var(--tile-1-rgb),.42) !important; }
.tile-lbl-c2 { color: rgba(var(--tile-2-rgb),.42) !important; }
.tile-lbl-c3 { color: rgba(var(--tile-3-rgb),.42) !important; }

ha-card.is-active .tile-c0 { border-color: rgba(var(--tile-0-rgb),.52) !important; }
ha-card.is-active .tile-c0::before { box-shadow: inset 0 -2px 0 0 var(--tile-0-color), 0 0 10px rgba(var(--tile-0-rgb),.22) !important; }
ha-card.is-active .tile-c1 { border-color: rgba(var(--tile-1-rgb),.52) !important; }
ha-card.is-active .tile-c1::before { box-shadow: inset 0 -2px 0 0 var(--tile-1-color), 0 0 10px rgba(var(--tile-1-rgb),.22) !important; }
ha-card.is-active .tile-c2 { border-color: rgba(var(--tile-2-rgb),.52) !important; }
ha-card.is-active .tile-c2::before { box-shadow: inset 0 -2px 0 0 var(--tile-2-color), 0 0 10px rgba(var(--tile-2-rgb),.22) !important; }
ha-card.is-active .tile-c3 { border-color: rgba(var(--tile-3-rgb),.52) !important; }
ha-card.is-active .tile-c3::before { box-shadow: inset 0 -2px 0 0 var(--tile-3-color), 0 0 10px rgba(var(--tile-3-rgb),.22) !important; }

/* ── tiles ── */
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; container-type: inline-size;}
.tile  { padding: 5px 7px; cursor: pointer; min-width: 0; overflow: visible; }
.tile:active { opacity: .7; transition: opacity .1s; }
.t-lbl { font-size: clamp(6px, 1.2vw, 8px); letter-spacing: .8px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-lbl.x { color: rgba(var(--rgb-xenon),.80); }
.t-lbl.a { color: rgba(var(--rgb-argon),.80); }
.t-val {
  font-family: 'Orbitron', sans-serif; font-size: clamp(10px, 8cqi, 16px);
  color: #fff; line-height: 1.25; white-space: nowrap; overflow: visible;
  text-shadow: 0 0 3px rgba(255,255,255,.6), 0 0 8px currentColor;
  animation: uv-flicker 8s infinite alternate ease-in-out;
}

/* ── thermostat ── */
.thermo { padding: 7px 10px; cursor: pointer; width: 100%; box-sizing: border-box; }
.thermo-mode { font-size: clamp(7px, 3.5cqi, 8px); letter-spacing: 2px; color: rgba(var(--rgb-helium-climate),.80); margin-bottom: 5px; }
.thermo-row  { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.thermo-btn  {
  font-family: 'Orbitron', sans-serif; font-size: clamp(14px, 7cqi, 20px); font-weight: 700;
  width: clamp(26px, 14cqi, 34px); height: clamp(26px, 14cqi, 34px); flex: 0 0 clamp(26px, 14cqi, 34px);
  display: flex; align-items: center; justify-content: center;
  border-radius: 5px; border: 1px solid rgba(var(--rgb-helium-climate),.22);
  background: rgba(var(--rgb-helium-climate),.055); color: rgba(var(--rgb-helium-climate),.85);
  cursor: pointer; user-select: none; line-height: 1;
}
.thermo-btn:active { background: rgba(var(--rgb-helium-climate),.15); }
.thermo-temps { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; }
.thermo-sp        { font-family: 'Orbitron', sans-serif; font-size: clamp(16px, 9cqi, 26px); color: var(--helium-climate); text-shadow: 0 0 12px rgba(var(--rgb-helium-climate),.35); line-height: 1; }
.thermo-sp-unit   { font-size: clamp(9px, 4.5cqi, 13px); color: rgba(var(--rgb-helium-climate),.55); }
.thermo-cur       { display: flex; align-items: baseline; gap: 4px; }
.thermo-cur-val   { font-family: 'Orbitron', sans-serif; font-size: clamp(9px, 4cqi, 12px); color: rgba(var(--rgb-xenon),.85); }
.thermo-cur-lbl   { font-size: clamp(6px, 2.5cqi, 7px); color: rgba(255,255,255,.50); letter-spacing: 1px; }

/* ── pipes SVG ── */
.pipes-svg { width: 100%; height: auto; display: block; overflow: visible; }

/* ── fan ── */
.fan-svg { width: 100%; height: auto; overflow: visible; display: block; }

/* ── power block ── */
.power-block  { padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; container-type: inline-size; }
.power-block:active { opacity: .75; transition: opacity .1s; }
.power-lbl    { font-size: clamp(7px, 1.5vw, 8px); color: var(--helium-power); letter-spacing: 1px; opacity: .85; }
.power-jp     { font-size: clamp(6px, 1.2vw, 7px); color: rgba(var(--rgb-helium-power),.50); }
.power-spark  { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); pointer-events: none; z-index: 0; opacity: .7; transition: opacity .5s; }
.power-val    { font-family: 'Orbitron', sans-serif; font-size: clamp(14px, 3.5cqi, 18px); color: var(--helium-power); text-shadow: 0 0 10px rgba(var(--rgb-helium-power),.4); position: relative; z-index: 1; white-space: nowrap; }
.power-val.is-idle { font-size: clamp(10px, 2.5cqi, 13px); letter-spacing: 1px; }

/* ── lockout flash ── */
@keyframes lockout-flash {
  0%,100% { box-shadow: 0 0 0 0 rgba(224,17,95,0);    border-color: rgba(224,17,95,.18) !important; }
  50%      { box-shadow: 0 0 28px 4px rgba(224,17,95,.55); border-color: rgba(224,17,95,.85) !important; }
}
ha-card.lockout { animation: lockout-flash 1.1s ease-in-out infinite; }

@keyframes uv-flicker {
  0%, 100% { opacity: 1; }
  41% { opacity: 0.96; } 42% { opacity: 1; }
  46% { opacity: 0.93; } 47% { opacity: 0.98; }
  53% { opacity: 1; }
}
@keyframes outer-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.55; }
}
@keyframes inner-pulse {
  0%, 100% { opacity: 0.30; }
  50% { opacity: 0.70; }
}
@keyframes fluid-flow-out {
  from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; }
}
@keyframes fluid-flow-in {
  from { stroke-dashoffset: 0; } to { stroke-dashoffset: 60; }
}

/* ── Fan rings neon bloom ── */
#fan-outer-ring {
  stroke-width: 1.5px;
  filter: url(#f-out) drop-shadow(0 0 3px rgba(var(--rgb-argon), 0.35));
  transition: stroke-width 0.6s ease, opacity 0.6s ease;
}
ha-card.is-active #fan-outer-ring {
  stroke-width: 2px;
  animation: uv-flicker 11s infinite alternate ease-in-out, outer-pulse 6s infinite ease-in-out;
}
#fan-inner-ring {
  stroke-width: 1.2px;
  filter: url(#f-glow) drop-shadow(0 0 2px rgba(var(--rgb-xenon), 0.45));
  transition: stroke-width 0.6s ease, opacity 0.6s ease;
}
ha-card.is-active #fan-inner-ring {
  stroke-width: 1.8px;
  animation: uv-flicker 8s infinite alternate ease-in-out, inner-pulse 3.5s infinite ease-in-out;
}

/* ── Pipes neon bloom ── */
#pipe-hot rect[filter] { filter: url(#fp) drop-shadow(0 0 3px rgba(255,110,0,.45)); }
#pipe-cold rect[filter] { filter: url(#fp) drop-shadow(0 0 3px rgba(0,212,255,.45)); }
ha-card.is-active #pipe-hot rect[filter] {
  filter: url(#fp) drop-shadow(0 0 6px rgba(255,130,0,.7));
  animation: uv-flicker 5s infinite alternate ease-in-out;
}
ha-card.is-active #pipe-cold rect[filter] {
  filter: url(#fp) drop-shadow(0 0 6px rgba(0,212,255,.7));
  animation: uv-flicker 7s infinite alternate ease-in-out;
}

/* ── Plasma coolant flow ── */
ha-card.is-active #pipe-hot path,
ha-card.is-active #pipe-hot line {
  stroke-dasharray: 14, 16;
  stroke-linecap: round;
  stroke-width: 3px;
  animation: fluid-flow-out 1.2s linear infinite, uv-flicker 4s infinite alternate ease-in-out;
}
ha-card.is-active #pipe-cold path,
ha-card.is-active #pipe-cold line {
  stroke-dasharray: 14, 16;
  stroke-linecap: round;
  stroke-width: 3px;
  animation: fluid-flow-in 1.5s linear infinite, uv-flicker 5s infinite alternate ease-in-out;
}

#sv-dep, #sv-ret {
  fill: #FFFFFF !important;
  filter: drop-shadow(0 0 3px rgba(255,255,255,.8));
}
ha-card.is-active #sv-dep { filter: drop-shadow(0 0 8px rgba(255,180,0,.85)); animation: uv-flicker 9s infinite alternate ease-in-out; }
ha-card.is-active #sv-ret { filter: drop-shadow(0 0 8px rgba(0,212,255,.85)); animation: uv-flicker 11s infinite alternate ease-in-out; }
${_neonHeaderCss(headerConfig)}
</style>

<ha-card>
<div class="grid-bg"></div>
<div class="blob blob-c"></div>
<div class="blob blob-m"></div>
<div class="blob blob-g"></div>
<div class="inner">

  ${_buildNeonHeaderHTML(headerConfig)}

  <div class="body">
    <div class="left-col">
      <div class="tiles">
        ${buildTilesHTML(tiles, colors)}
      </div>
    </div>
    <div class="pipes-wrap">
      ${buildPipesSVG()}
    </div>
    ${hasClimate ? `<div class="thermo-wrap">${buildThermoHTML()}</div>` : '<div class="thermo-wrap"></div>'}
    <div class="fan-col">
      ${buildFanSVG()}
      ${buildPowerBlock()}
    </div>
  </div>

</div>
</ha-card>`;
}

// ── Card class ─────────────────────────────────────────────────────────────

class HeatPumpCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._dom       = null;
    this._prev      = {};
    this._rafId     = null;
    this._lastTs    = null;
    this._lastRenderTs = null;
    this._angle     = 0;
    this._curRPM    = 0;
    this._tgtRPM    = 0;
    this._lastBand  = -1;
    this._mode      = 'off';
    this._ac        = null;
  }

  // ── HA lifecycle ──────────────────────────────────────────────────────────

  setConfig(cfg) {
    if (!cfg.entities) throw new Error('[heat-pump-card] "entities" requis.');
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ac) this._ac.abort();
    this._ac     = new AbortController();
    this._config = cfg;
    this._dom    = null;
    this._prev   = {};

    const hasClimate = !!cfg.climate;
    this.shadowRoot.innerHTML = buildTemplate(
      cfg.title || 'PAC',
      cfg.tiles  || [],
      hasClimate,
      cfg.colors || null
    ,
      cfg.header || {}
    );

    const sig = this._ac.signal;

    // tile tap → more-info
    this.shadowRoot.querySelectorAll('[data-tile]').forEach(el => {
      el.addEventListener('click', () => {
        const i  = parseInt(el.getAttribute('data-tile'));
        const tc = (this._config.tiles || [])[i];
        if (!tc?.entity) return;
        const ev = new Event('hass-more-info', { bubbles: true, composed: true });
        ev.detail = { entityId: tc.entity };
        this.dispatchEvent(ev);
      }, { signal: sig });
    });

    // thermostat buttons
    if (hasClimate) {
      const minus = this.shadowRoot.getElementById('thermo-minus');
      const plus  = this.shadowRoot.getElementById('thermo-plus');
      if (minus) minus.addEventListener('click', e => { e.stopPropagation(); this._adjustTemp(-0.5); }, { signal: sig });
      if (plus)  plus.addEventListener('click',  e => { e.stopPropagation(); this._adjustTemp(+0.5); }, { signal: sig });
    }

    // power block tap → more-info
    const pbEl = this.shadowRoot.getElementById('power-block');
    if (pbEl) pbEl.addEventListener('click', () => {
      const entity = (this._config.entities || {}).power;
      if (!entity) return;
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: entity };
      this.dispatchEvent(ev);
    }, { signal: sig });

    // thermo block tap → more-info
    const tbEl = this.shadowRoot.getElementById('thermo-block');
    if (tbEl) tbEl.addEventListener('click', () => {
      const entity = this._config.climate;
      if (!entity) return;
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: entity };
      this.dispatchEvent(ev);
    }, { signal: sig });

    // apply pipe colors from colors config
    const colors = cfg.colors || {};
    if (colors.dep_color || colors.ret_color) {
      const hexRgba = (hex, a) => {
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return `rgba(${r},${g},${b},${a})`;
      };
      const lighten = hex => {
        const r = Math.min(255, parseInt(hex.slice(1,3),16)+55), g = Math.min(255, parseInt(hex.slice(3,5),16)+55), b = Math.min(255, parseInt(hex.slice(5,7),16)+55);
        return `rgb(${r},${g},${b})`;
      };
      const applyPipe = (gradId, groupId, labelId, hex) => {
        if (!hex) return;
        const sr = this.shadowRoot;
        // gradient stops
        const grad = sr.getElementById(gradId);
        if (grad) {
          const s = grad.querySelectorAll('stop');
          if (s[0]) s[0].setAttribute('stop-color', hexRgba(hex, .12));
          if (s[1]) s[1].setAttribute('stop-color', hexRgba(hex, .92));
          if (s[2]) s[2].setAttribute('stop-color', lighten(hex));
          if (s[3]) s[3].setAttribute('stop-color', hexRgba(hex, .92));
          if (s[4]) s[4].setAttribute('stop-color', hexRgba(hex, .12));
        }
        // all circles + texts inside the group
        const grp = sr.getElementById(groupId);
        if (grp) {
          grp.querySelectorAll('circle').forEach(c => {
            const f = c.getAttribute('fill');
            if (f && f !== 'none') c.setAttribute('fill', hexRgba(hex, parseFloat(f.match(/[\d.]+\)$/)?.[0]) || .7));
          });
          grp.querySelectorAll('text').forEach(t => {
            const f = t.getAttribute('fill');
            if (f && f !== 'none') {
              const a = parseFloat(f.match(/[\d.]+\)$/)?.[0] ?? '.95');
              t.setAttribute('fill', hexRgba(hex, a));
            }
          });
        }
        // temperature value
        const val = sr.getElementById(labelId);
        if (val) val.setAttribute('fill', hexRgba(hex, .95));
      };
      applyPipe('gh', 'pipe-hot', 'sv-dep', colors.dep_color);
      applyPipe('gc', 'pipe-cold', 'sv-ret', colors.ret_color);
    }

    // store blade gradient colors for use in _update
    this._bladeCold = (colors.blade_cold) || '#00D4FF';
    this._bladeHot  = (colors.blade_hot)  || '#E0115F';

    // apply fan_outer and fan_core immediately (static, no need to wait for hass)
    if (colors.fan_outer) {
      const el = this.shadowRoot.getElementById('fan-outer-ring');
      if (el) el.setAttribute('stroke', colors.fan_outer);
    }
	if (colors.fan_inner) {
      const el = this.shadowRoot.getElementById('fan-inner-ring');
      if (el) el.setAttribute('stroke', colors.fan_inner);
    }
    if (colors.fan_core) {
      const hr = this.shadowRoot.getElementById('hub-ring');
      const hg = this.shadowRoot.getElementById('hub-glow');
      if (hr) hr.setAttribute('stroke', colors.fan_core);
      if (hg) hg.setAttribute('fill', colors.fan_core);
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
    if (!this._rafId) this._startFan();
  }

  getCardSize() { return 5; }

  connectedCallback() {
    // pause/resume animations on visibility
    this._observer = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      const fanSvg  = this.shadowRoot.getElementById('fan-svg');
      const pipeSvg = this.shadowRoot.querySelector('.pipes-svg');
      if (visible) {
        if (fanSvg) fanSvg.unpauseAnimations?.();
        // restore pipe state: paused when off, running otherwise
        if (pipeSvg) {
          if (this._prev?.mode === 'off') pipeSvg.pauseAnimations?.();
          else pipeSvg.unpauseAnimations?.();
        }
        if (!this._rafId && this._tgtRPM > 0) this._startFan();
      } else {
        if (fanSvg)  fanSvg.pauseAnimations?.();
        if (pipeSvg) pipeSvg.pauseAnimations?.();
        if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; this._lastTs = null; }
      }
    }, { threshold: 0.1 });
    this._observer.observe(this);
  }

  disconnectedCallback() {
    if (this._rafId)   { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._observer){ this._observer.disconnect(); this._observer = null; }
    if (this._ac)      { this._ac.abort(); this._ac = null; }
    this._lastRenderTs = null;
  }

  // ── DOM cache ─────────────────────────────────────────────────────────────

  _cache() {
    const $ = id => this.shadowRoot.getElementById(id);
    this._dom = {
      badge:     $('badge'),
      haCard:    this.shadowRoot.querySelector('ha-card'),
      tPwr:      $('t-pwr'),
      svDep:     $('sv-dep'),
      svRet:     $('sv-ret'),
      pipeHot:   $('pipe-hot'),
      pipeCold:  $('pipe-cold'),
      pipesSvg:  this.shadowRoot.querySelector('.pipes-svg'),
      particles: $('particles-dyn'),
      trail:     $('trail-group'),
      spark:     $('power-spark'),
      blades:    [0,1,2].map(i => $(`blade-${i}`)),
      hubRing:   $('hub-ring'),
      hubGlow:   $('hub-glow'),
      hubDefrost:$('hub-defrost'),
      outerRing: $('fan-outer-ring'),
      tiles:     (this._config.tiles || []).map((_, i) => $('sv-tile-' + i)),
      // thermostat (optional)
      thermoMode: $('thermo-mode'),
      thermoSp:   $('thermo-sp'),
      thermoCur:  $('thermo-cur'),
    };
  }

  _set(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  // ── Thermostat ────────────────────────────────────────────────────────────

  _adjustTemp(delta) {
    if (!this._hass || !this._config.climate) return;
    const s = this._hass.states[this._config.climate];
    if (!s) return;
    const cur  = parseFloat(s.attributes.temperature) || 20;
    const min  = parseFloat(s.attributes.min_temp)    || 7;
    const max  = parseFloat(s.attributes.max_temp)    || 35;
    const next = clamp(Math.round((cur + delta) * 2) / 2, min, max);
    this._hass.callService('climate', 'set_temperature', {
      entity_id:   this._config.climate,
      temperature: next,
    });
  }

  _updateThermo() {
    if (!this._config.climate) return;
    const d = this._dom;
    if (!d.thermoMode) return;
    const s = this._hass?.states[this._config.climate];
    if (!s) return;

    const hvac  = (s.state || 'off').toLowerCase();
    const sp    = s.attributes.temperature;
    const cur   = s.attributes.current_temperature;

    const modeLabels = {
      heat:     '◈ HEAT MODE',
      cool:     '◈ COOL MODE',
      auto:     '◈ AUTO MODE',
      heat_cool:'◈ AUTO MODE',
      dry:      '◈ DRY MODE',
      fan_only: '◈ FAN MODE',
      off:      '◈ OFF',
    };
    this._set(d.thermoMode, modeLabels[hvac] || ('◈ ' + hvac.toUpperCase()));
    this._set(d.thermoSp,   sp  != null ? (Number.isInteger(sp)  ? String(sp)  : sp.toFixed(1))  : '--');
    this._set(d.thermoCur,  cur != null ? (Number.isInteger(cur) ? cur + '°C'  : cur.toFixed(1) + '°C') : '--°C');
  }

  // ── Particles ─────────────────────────────────────────────────────────────

  _rebuildParticles(rpm) {
    const band = rpm < 1 ? 0 : rpm < 300 ? 1 : rpm < 600 ? 2 : rpm < 900 ? 3 : 4;
    if (band === this._lastBand) return;
    this._lastBand = band;
    const g = this._dom?.particles;
    if (!g) return;
    let s = '';
    for (let i = 0; i < PCOUNTS[band]; i++) {
      const p = PCFG[i];
      s += `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.c}" opacity="0">
<animate attributeName="cx"      values="${p.cx};${p.tx}"              dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1"/>
<animate attributeName="cy"      values="${p.cy};${p.ty}"              dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1"/>
<animate attributeName="opacity" values="0;.9;.65;0"                   dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite" keyTimes="0;.05;.8;1"/>
<animate attributeName="r"       values="${p.r};${(p.r*.35).toFixed(1)}" dur="${p.dur}s" begin="${p.bg}s" repeatCount="indefinite"/>
</circle>`;
    }
    g.innerHTML = s;
  }

  // ── Main update ───────────────────────────────────────────────────────────

  _update() {
    if (!this._hass || !this._config) return;
    if (!this._dom) this._cache();
    const d   = this._dom;
    const cfg = this._config.entities || {};
    const maxP   = parseFloat(this._config.max_power)  || 10;
    const pwrU   = (this._config.power_unit || '').toUpperCase();

    const num = k => { const s = this._hass.states[cfg[k]]; return s ? (parseFloat(s.state) || 0) : 0; };
    const str = k => { const s = this._hass.states[cfg[k]]; return s ? s.state : ''; };
    const ua  = k => { const s = this._hass.states[cfg[k]]; return s?.attributes?.unit_of_measurement || ''; };

    const rpm    = num('fan_rpm');
    const dep    = num('temp_water_out');
    const ret    = num('temp_water_ret');
    const rawPwr = num('power');
    const rawW   = pwrU === 'W' ? rawPwr : rawPwr * 1000;

    // compressor
    const compRaw = str('compressor');
    const compNum = parseFloat(compRaw);
    const compOn  = compRaw !== '' && compRaw !== 'unavailable' && compRaw !== 'unknown' && (
      compRaw === 'on' || (!isNaN(compNum) ? compNum > 0
        : !/^(off|false|stop|arrêt|idle|standby)$/i.test(compRaw.trim()))
    );

    // status / badge
    const statusRaw = str('status');
    const statusUp  = statusRaw.trim().toUpperCase();
    const isOff     = /^(OFF|ARRÊT|STOP|STANDBY|STAND.BY|IDLE|UNAVAILABLE|UNKNOWN)$/.test(statusUp) || !statusRaw;
    const isDefrost = /DEFROST|FROST|DÉGIVR/.test(statusUp);
    const isCool    = /COOL/.test(statusUp);
    const mode      = isDefrost ? 'defrost' : isCool ? 'cool' : isOff ? 'off' : 'on';

    if (mode !== this._prev.mode) {
      this._prev.mode = mode;
      const lbl = statusRaw && !['unavailable','unknown'].includes(statusRaw)
        ? statusRaw.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase() : '—';
      const map = {
        on:      ['badge-on',      '● ' + lbl],
        cool:    ['badge-cool',    '❄ ' + lbl],
        defrost: ['badge-defrost', '❄ ' + lbl],
        off:     ['badge-off',     '■ ' + (lbl === '—' ? 'ARRÊT' : lbl)],
      };
      const [cls, txt] = map[mode] || map.off;
      if (d.badge) { d.badge.className = 'badge ' + cls; d.badge.textContent = txt; }
      if (d.haCard) d.haCard.classList.toggle('is-active', mode !== 'off');
      if (d.trail)  { d.trail.style.opacity = mode === 'off' ? '0' : '1'; d.trail.style.transition = 'opacity 1.2s ease'; }
    }

    // pipes — pause/resume on every update (guarantees correct initial state)
    if (d.pipesSvg) {
      if (mode === 'off') d.pipesSvg.pauseAnimations?.();
      else                d.pipesSvg.unpauseAnimations?.();
    }

    // fan speed
    this._tgtRPM = rpm > 0 ? clamp(rpm / 1200 * VIS_MAX_RPM, 5, VIS_MAX_RPM) : 0;
    this._rebuildParticles(rpm);
    if (!this._rafId) this._startFan();

    // blade color lerp cold→hot by compressor frequency
    const freq  = (this._hass.states[cfg.comp_freq])
                  ? parseFloat(this._hass.states[cfg.comp_freq].state) || 0 : 0;
    const freqT = clamp(freq / 90, 0, 1);
    if (freqT !== this._prev.freqT) {
      this._prev.freqT = freqT;
      const col = lerpHex(this._bladeCold || '#00D4FF', this._bladeHot || '#E0115F', freqT);
      const alpha = (0.15 + freqT * 0.09).toFixed(3);
      const [r,g,b] = [parseInt(col.slice(1,3),16), parseInt(col.slice(3,5),16), parseInt(col.slice(5,7),16)];
      d.blades?.forEach(b_ => {
        if (!b_) return;
        b_.setAttribute('stroke', col);
        b_.setAttribute('fill', `rgba(${r},${g},${b},${alpha})`);
      });
    }

    // booster alert — hub turns orange
    const boosterRaw = str('booster');
    const boosterOn  = boosterRaw === 'on';
    if (boosterOn !== this._prev.boosterOn) {
      this._prev.boosterOn = boosterOn;
      if (d.hubRing) d.hubRing.setAttribute('stroke', boosterOn ? '#FF6A00' : (this._config.colors?.fan_core || '#00D4FF'));
      if (d.hubGlow) d.hubGlow.setAttribute('fill',   boosterOn ? 'rgba(255,100,0,.85)' : (this._config.colors?.fan_core || 'rgba(0,212,255,.8)'));
    }

    // defrost snowflake on hub
    if (d.hubDefrost) d.hubDefrost.setAttribute('opacity', mode === 'defrost' ? '1' : '0');

    // lockout flash
    const lockoutRaw = str('lockout');
    const lockoutOn  = lockoutRaw === 'on';
    if (lockoutOn !== this._prev.lockoutOn) {
      this._prev.lockoutOn = lockoutOn;
      if (d.haCard) d.haCard.classList.toggle('lockout', lockoutOn);
    }

    // power — seuil configurable (défaut 20W) : en dessous = veille
    const isIdle = rawW < (parseFloat(this._config.idle_threshold) || 20);
    const pwrStr = isIdle ? '▰▰▰ IDLE ▰▰▰' : rawW >= 1000
      ? (rawW / 1000).toFixed(2) + ' kW'
      : Math.round(rawW) + ' W';
    this._set(d.tPwr, pwrStr);
    d.tPwr?.classList.toggle('is-idle', isIdle);
    if (d.spark) d.spark.style.opacity = compOn ? '.7' : '0';

    // pipes
    if (compOn !== this._prev.compOn) {
      this._prev.compOn = compOn;
      if (d.pipeHot)  d.pipeHot.style.opacity  = '1';
      if (d.pipeCold) d.pipeCold.style.opacity  = '1';
    }

    // dep / ret
    this._set(d.svDep, dep.toFixed(0) + (ua('temp_water_out') || '°C'));
    this._set(d.svRet, ret.toFixed(0) + (ua('temp_water_ret') || '°C'));

    // tiles
    d.tiles.forEach((el, i) => {
      const tc = (this._config.tiles || [])[i];
      if (!tc?.entity || !el) return;
      const s = this._hass.states[tc.entity];
      if (!s) return;
      const raw = parseFloat(s.state);
      const val = isNaN(raw) ? s.state : Number.isInteger(raw) ? String(raw) : raw.toFixed(1);
      const unt = tc.unit || s.attributes?.unit_of_measurement || '';
      this._set(el, val + (unt ? ' ' + unt : ''));
    });

    // thermostat
    this._updateThermo();
  }

  // ── RAF loop — fan rotation + comet trail ─────────────────────────────────

  _startFan() {
    const sr     = this.shadowRoot;
    const rotor  = sr.getElementById('fan-rotor');
    const trailGroup = sr.getElementById('trail-group');
    const CX = 97, CY = 92;
    let idleFrames = 0;

    const step = ts => {
      // Throttle expensive SVG transform updates to reduce CPU/GPU usage.
      if (this._lastRenderTs != null && ts - this._lastRenderTs < FAN_RENDER_INTERVAL_MS) {
        this._rafId = requestAnimationFrame(step);
        return;
      }

      this._curRPM += (this._tgtRPM - this._curRPM) * 0.035;
      if (Math.abs(this._curRPM) < 0.2 && this._tgtRPM === 0) this._curRPM = 0;

      if (this._curRPM > 0.2 && rotor) {
        idleFrames = 0;
        const dt = Math.min(this._lastTs != null ? ts - this._lastTs : 16, 50);
        this._angle = (this._angle + this._curRPM * 0.0036 * dt) % 360;
        const a = this._angle;
        rotor.setAttribute('transform', `rotate(${a} ${CX} ${CY})`);
        // trail rotates with blade, offset −90° to align with 12-o'clock tip
        const ta = this._angle - 90;
        if (trailGroup) trailGroup.setAttribute('transform', `rotate(${ta} ${CX} ${CY})`);
      } else {
        if (++idleFrames > 24) {
          this._rafId = null;
          this._lastTs = null;
          this._lastRenderTs = null;
          return;
        }
      }
      this._lastTs = ts;
      this._lastRenderTs = ts;
      this._rafId  = requestAnimationFrame(step);
    };
    this._rafId = requestAnimationFrame(step);
  }

  // ── Editor ───────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('heat-pump-card-editor');
  }

  static getStubConfig() {
    return {
      title:      'PAC Ecodan',
      climate:    'climate.pac_ecodan',
      max_power:  3,
      power_unit: 'W',
      entities: {
        fan_rpm:        'sensor.ecodan_heatpump_fan_speed',
        temp_water_out: 'sensor.ecodan_heatpump_feed_temp',
        temp_water_ret: 'sensor.ecodan_heatpump_return_temp',
        power:          'sensor.nodon_capteur_power',
        status:         'sensor.ecodan_heatpump_operation_mode',
        compressor:     'binary_sensor.ecodan_heatpump_compressor',
      },
      tiles: [
        { entity: 'sensor.ecodan_heatpump_outside_temp',         label: 'T_EXT',    color: 'xenon', unit: '°C'  },
        { entity: 'sensor.ecodan_heatpump_fan_speed',            label: 'FAN RPM',  color: 'argon', unit: 'RPM' },
        { entity: 'sensor.ecodan_heatpump_compressor_frequency', label: 'COMP HZ',  color: 'xenon', unit: 'Hz'  },
        { entity: 'sensor.ecodan_heatpump_zone_1_setpoint_value',label: 'SETPOINT', color: 'argon', unit: '°C'  },
      ],
    };
  }
}

// ── Editor ────────────────────────────────────────────────────────────────────

const ENTITY_KEYS = ['fan_rpm','temp_water_out','temp_water_ret','power','status',
  'compressor','comp_freq','booster','lockout'];
const ENTITY_LABELS = {
  fan_rpm:'Vitesse ventilateur', temp_water_out:'Temp départ eau', temp_water_ret:'Temp retour eau',
  power:'Puissance W', status:'Mode opération', compressor:'Compresseur (binary)',
  comp_freq:'Fréquence compresseur', booster:'Appoint (binary)', lockout:'Short-cycle lockout (binary)'
};
const COLOR_KEYS = ['border_color','badge_on','badge_off','badge_cool','badge_defrost',
  'power_core','climate','dep_color','ret_color','fan_outer','fan_core','blade_cold','blade_hot','title_color'];
const COLOR_LABELS = {
  border_color:'Bordure', badge_on:'Badge ON', badge_off:'Badge OFF',
  badge_cool:'Badge clim', badge_defrost:'Badge dégivrage',
  power_core:'Core puissance', climate:'Thermostat', dep_color:'Départ', ret_color:'Retour',
  fan_outer:'Fan extérieur', fan_core:'Fan centre', blade_cold:'Blade froid', blade_hot:'Blade chaud',
  title_color:'Titre'
};

class HeatPumpCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._rendered = false;
  }

  setConfig(cfg) {
    this._config = JSON.parse(JSON.stringify(cfg || {}));
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }

  set hass(h) { this._hass = h; }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true
    }));
  }

  _set(path, val) {
    const parts = path.split('.');
    let o = this._config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]]) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = val;
    this._fire();
  }

  _get(path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : ''), this._config || {});
  }

  _render() {
    const css = `
      :host { display:block; font-family: var(--mdc-typography-body1-font-family, inherit); }
      .ed-section { margin-bottom:16px; }
      .ed-title { font-size:11px; letter-spacing:.12em; text-transform:uppercase;
        color:var(--secondary-text-color); margin:0 0 6px; padding-bottom:4px;
        border-bottom:1px solid var(--divider-color); }
      .ed-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
      .ed-row label { flex:0 0 160px; font-size:12px; color:var(--secondary-text-color); }
      .ed-row input[type=text], .ed-row input[type=number] {
        flex:1; padding:4px 8px; border:1px solid var(--divider-color);
        border-radius:4px; background:var(--card-background-color);
        color:var(--primary-text-color); font-size:12px; box-sizing:border-box; }
      .ed-row input[type=color] { width:36px; height:28px; border:none; padding:0;
        background:none; cursor:pointer; border-radius:4px; }
      .tile-block { background:var(--secondary-background-color); border-radius:6px;
        padding:8px 10px; margin-bottom:6px; }
      .tile-block .tile-hdr { font-size:11px; color:var(--accent-color); margin-bottom:6px; }
    `;

    const tilesHTML = [0,1,2,3].map(i => {
      const t = (this._config.tiles || [])[i] || {};
      return `<div class="tile-block">
        <div class="tile-hdr">Tile ${i+1}</div>
        <div class="ed-row"><label>Entité</label>
          <input type="text" data-path="tiles.${i}.entity" value="${t.entity||''}" list="hpc-entities"/></div>
        <div class="ed-row"><label>Label</label>
          <input type="text" data-path="tiles.${i}.label" value="${t.label||''}"/></div>
        <div class="ed-row"><label>Unité</label>
          <input type="text" data-path="tiles.${i}.unit" value="${t.unit||''}"/></div>
      </div>`;
    }).join('');

    const entitiesHTML = ENTITY_KEYS.map(k => `
      <div class="ed-row"><label>${ENTITY_LABELS[k]}</label>
        <input type="text" data-path="entities.${k}" value="${this._get('entities.'+k)}" list="hpc-entities"/>
      </div>`).join('');

    const colorsHTML = COLOR_KEYS.map(k => `
      <div class="ed-row"><label>${COLOR_LABELS[k]}</label>
        <input type="color" data-path="colors.${k}" value="${this._get('colors.'+k)||'#000000'}"/>
        <input type="text" data-path="colors.${k}" value="${this._get('colors.'+k)||''}" style="flex:1"/>
      </div>`).join('');

    this.innerHTML = `<style>${css}</style>
      <datalist id="hpc-entities"></datalist>

      <div class="ed-section">
        <p class="ed-title">Général</p>
        <div class="ed-row"><label>Titre</label>
          <input type="text" data-path="title" value="${this._get('title')}"/></div>
        <div class="ed-row"><label>Entité climate</label>
          <input type="text" data-path="climate" value="${this._get('climate')}" list="hpc-entities"/></div>
        <div class="ed-row"><label>Puissance max (kW)</label>
          <input type="number" data-path="max_power" value="${this._get('max_power')||3}" step="0.5" min="0.5" max="20"/></div>
        <div class="ed-row"><label>Seuil IDLE (W)</label>
          <input type="number" data-path="idle_threshold" value="${this._get('idle_threshold')||20}" step="5" min="0" max="500"/></div>
      </div>

      <div class="ed-section">
        <p class="ed-title">En-tête</p>
        <div class="ed-row"><label>Titre header</label>
          <input type="text" data-path="header.title" value="${this._get('header.title')}"/></div>
        <div class="ed-row"><label>Icône header</label>
          <input type="text" data-path="header.icon" value="${this._get('header.icon')}" list="hpc-mdi-list"/>
          <a href="https://pictogrammers.com/library/mdi/" target="_blank" style="font-size:10px;color:var(--accent-color)">MDI</a>
        </div>
        <div class="ed-row"><label>Couleur header</label>
          <input type="color" data-path="header.color" value="${this._hexColor(this._get('header.color'))||'#00d4ff'}"/>
          <input type="text" data-path="header.color" value="${this._get('header.color')}" style="flex:1"/>
        </div>
      </div>

      <div class="ed-section">
        <p class="ed-title">Entités</p>
        ${entitiesHTML}
      </div>

      <div class="ed-section">
        <p class="ed-title">Tiles (4 max)</p>
        ${tilesHTML}
      </div>

      <div class="ed-section">
        <p class="ed-title">Couleurs</p>
        ${colorsHTML}
      </div>

      <datalist id="hpc-mdi-list">
        <option value="mdi:heat-pump"><option value="mdi:snowflake">
        <option value="mdi:fire"><option value="mdi:air-conditioner">
        <option value="mdi:thermometer"><option value="mdi:radiator">
        <option value="mdi:flash"><option value="mdi:cog">
        <option value="mdi:home-thermometer"><option value="mdi:weather-windy">
      </datalist>`;

    this._populateEntities();
    this._attachListeners();
  }

  _hexColor(v) {
    if (!v) return '';
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return '';
    return '#' + [m[1],m[2],m[3]].map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
  }

  _populateEntities() {
    if (!this._hass) return;
    const dl = this.querySelector('#hpc-entities');
    if (!dl) return;
    dl.innerHTML = Object.keys(this._hass.states)
      .sort()
      .map(e => `<option value="${e}">`)
      .join('');
  }

  _attachListeners() {
    this.querySelectorAll('input[data-path]').forEach(inp => {
      inp.addEventListener('change', () => this._onInput(inp));
      if (inp.type === 'text') inp.addEventListener('input', () => this._onInput(inp));
      if (inp.type === 'color') {
        inp.addEventListener('input', () => {
          const path = inp.dataset.path;
          const sibling = this.querySelector(`input[type=text][data-path="${path}"]`);
          if (sibling && document.activeElement !== sibling) sibling.value = inp.value;
          this._set(path, inp.value);
        });
      }
    });
  }

  _onInput(inp) {
    if (inp.type === 'color') return;
    const path = inp.dataset.path;
    const val = inp.type === 'number' ? parseFloat(inp.value) || 0 : inp.value;

    // sync paired color picker
    if (inp.type === 'text') {
      const hex = this._hexColor(val);
      const picker = this.querySelector(`input[type=color][data-path="${path}"]`);
      if (picker && hex) picker.value = hex;
    }

    // tiles path: tiles.N.key
    if (path.startsWith('tiles.')) {
      const parts = path.split('.');
      const idx = parseInt(parts[1]);
      const key = parts[2];
      if (!this._config.tiles) this._config.tiles = [];
      while (this._config.tiles.length <= idx) this._config.tiles.push({});
      this._config.tiles[idx][key] = val;
      this._fire();
    } else {
      this._set(path, val);
    }
  }

  _syncValues() {
    this.querySelectorAll('input[data-path]').forEach(inp => {
      if (document.activeElement === inp) return;
      const path = inp.dataset.path;
      let val;
      if (path.startsWith('tiles.')) {
        const parts = path.split('.');
        const t = (this._config.tiles || [])[parseInt(parts[1])] || {};
        val = t[parts[2]] || '';
      } else {
        val = this._get(path);
      }
      if (inp.type === 'color') {
        const hex = this._hexColor(String(val));
        if (hex) inp.value = hex;
      } else {
        inp.value = val;
      }
    });
    this._populateEntities();
  }
}

customElements.define('heat-pump-card-editor', HeatPumpCardEditor);

customElements.define(CARD_TAG, HeatPumpCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        CARD_TAG,
  name:        'PAC Heat Pump — Neo Tokyo',
  description: 'Carte PAC Ecodan · ventilateur animé · thermostat climate · tuyaux plasma · palette gaz',
  preview:     true,
});

console.info(
  '%c ⚡ heat-pump-card v11.6 %c Gas Spectrum + Editor ',
  'background:#00D4FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;',
  'background:#040811;color:#00D4FF;padding:2px 4px;border-radius:0 3px 3px 0;'
);
