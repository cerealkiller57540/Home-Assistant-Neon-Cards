/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  storey-battery-card.js  v9.0                                           │
 * │  Home Assistant custom Lovelace card — Storey modular battery           │
 * │                                                                         │
 * │  Features:                                                              │
 * │   • 3-D isometric SVG battery with stackable modules (0–3)              │
 * │   • Dot-matrix displays: SOC%, power, charge/discharge arrow            │
 * │   • Per-module face-dot overlay (entity value on each module face)      │
 * │   • Animated LED glow between modules (charge/discharge direction)      │
 * │   • Merged header pill: available / total kWh                           │
 * │   • Full visual editor with entity pickers                              │
 * │                                                                         │
 * │  Performance:                                                           │
 * │   • rAF-coalesced rendering with dirty-key diffing                      │
 * │   • Memoised static SVG layers (_batCache)                              │
 * │   • GPU-composited animation layers (will-change / translateZ)          │
 * │   • Cached DOM refs — no querySelector per frame after first paint      │
 * │   • Array-based string building in dot-matrix hot paths                 │
 * │                                                                         │
 * │  License: MIT                                                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  PALETTE                                                                   *
 * ═══════════════════════════════════════════════════════════════════════════ */

const DEF_ACCENT = "#edff00";       // Default accent (electric yellow)
const DEF_BG     = "#181818";       // Default card background
const BLUE_EL    = "#4D7CFF";       // Charge / low-SOC blue

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  3-D ISOMETRIC GEOMETRY  (viewBox 0 0 113 75)                              *
 *                                                                            *
 *  The battery is projected in cavalier perspective. Three Y-coordinates     *
 *  are tracked per horizontal rule: Left edge (L), Middle ridge (M) and      *
 *  Right edge (R). SLF/SLR are the perspective slopes for front/right.       *
 * ═══════════════════════════════════════════════════════════════════════════ */

const LX = 1.37, MX = 86.15, RX = 110.68;             // X anchors
const B_TL = 4.73,  B_TM = 13.14, B_TR = 8.24;        // Battery top
const ST_L = 21.28, ST_M = 29.70, ST_R = 24.78;        // Slot top
const SB_L = 56.31, SB_M = 64.65, SB_R = 59.82;        // Slot bottom
const BB_L = 63.59, BB_M = 72.00, BB_R = 67.10;        // Battery base bottom
const MODULE_OFFSET = 35.03;                             // Vertical stack offset
const SVG_W = 113, SVG_H = 75;                          // Inner SVG viewport
const CR = 7;                                            // Corner radius on ridge
const SLF = (B_TM - B_TL) / (MX - LX);                 // Front face slope
const SLR = (B_TR - B_TM) / (RX - MX);                 // Right face slope

/* Gradient palette for 3-D surfaces */
const F_HI = "#e0e0e4", F_LO = "#c8c8ce";              // Front highlight / shadow
const R_HI = "#c4c4ca", R_LO = "#adadb3";              // Right highlight / shadow
const CAP_TOP = "#f4f4f6", CAP_EDG = "#c2c2c8";        // Cap/lid gradient
const SEP_C = "#ababaf", EDGE_C = "#8f8f94";            // Separator / edge lines

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  SVG PRIMITIVE BUILDERS                                                    *
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Shared <defs> block with 4 gradients for a given id namespace. */
function _defs(id) {
  return `<defs>
    <linearGradient id="gF${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${F_HI}"/><stop offset="100%" stop-color="${F_LO}"/>
    </linearGradient>
    <linearGradient id="gR${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${R_HI}"/><stop offset="100%" stop-color="${R_LO}"/>
    </linearGradient>
    <linearGradient id="gB${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${F_LO}"/><stop offset="100%" stop-color="${R_HI}"/>
    </linearGradient>
    <linearGradient id="gC${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${CAP_TOP}"/><stop offset="100%" stop-color="${CAP_EDG}"/>
    </linearGradient>
  </defs>`;
}

/** Horizontal separator line following isometric perspective. */
function _sep(ly, my, ry, sw, col, op) {
  const o = op && op < 1 ? ` opacity="${op}"` : '';
  return `<path d="M${LX} ${ly} L${(MX - CR).toFixed(2)} ${(my + SLF * (-CR)).toFixed(2)} Q${MX} ${my} ${(MX + CR).toFixed(2)} ${(my + SLR * CR).toFixed(2)} L${RX} ${ry}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linecap="round"${o}/>`;
}

/** Front face polygon (left of ridge). */
function _front(id, tly, tmy, bly, bmy) {
  return `<path d="M${LX} ${tly} L${MX - CR} ${(tmy + SLF * (-CR)).toFixed(2)} Q${MX} ${tmy} ${MX + 2} ${(tmy + SLR * 2).toFixed(2)} L${MX + 2} ${(bmy + SLR * 2).toFixed(2)} Q${MX} ${bmy} ${MX - CR} ${(bmy + SLF * (-CR)).toFixed(2)} L${LX} ${bly} Z" fill="url(#gF${id})"/>`;
}

/** Right face polygon (right of ridge). */
function _right(id, tmy, try_, bmy, bry) {
  return `<path d="M${MX - 2} ${(tmy + SLF * (-2)).toFixed(2)} L${MX + CR} ${(tmy + SLR * CR).toFixed(2)} L${RX} ${try_} L${RX} ${bry} L${MX + CR} ${(bmy + SLR * CR).toFixed(2)} L${MX - 2} ${(bmy + SLF * (-2)).toFixed(2)} Z" fill="url(#gR${id})"/>`;
}

/** Narrow blend strip along the ridge to smooth the front/right join. */
function _blend(id, tmy, bmy) {
  const hw = 3;
  return `<path d="M${MX - hw} ${(tmy + SLF * (-hw)).toFixed(2)} Q${MX} ${tmy} ${MX + hw} ${(tmy + SLR * hw).toFixed(2)} L${MX + hw} ${(bmy + SLR * hw).toFixed(2)} Q${MX} ${bmy} ${MX - hw} ${(bmy + SLF * (-hw)).toFixed(2)} Z" fill="url(#gB${id})"/>`;
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  DOT-MATRIX FONT  (5 × 7 bitmaps)                                         *
 *                                                                            *
 *  Each character is a 7-row array of 5-bit masks (MSB = leftmost column).   *
 * ═══════════════════════════════════════════════════════════════════════════ */

const DIGITS = {
  '0': [0b11110, 0b10010, 0b10010, 0b10010, 0b10010, 0b10010, 0b11110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b11110, 0b00010, 0b00010, 0b11110, 0b10000, 0b10000, 0b11110],
  '3': [0b11110, 0b00010, 0b00010, 0b01110, 0b00010, 0b00010, 0b11110],
  '4': [0b10010, 0b10010, 0b10010, 0b11110, 0b00010, 0b00010, 0b00010],
  '5': [0b11110, 0b10000, 0b10000, 0b11110, 0b00010, 0b00010, 0b11110],
  '6': [0b11110, 0b10000, 0b10000, 0b11110, 0b10010, 0b10010, 0b11110],
  '7': [0b11110, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000, 0b01000],
  '8': [0b11110, 0b10010, 0b10010, 0b11110, 0b10010, 0b10010, 0b11110],
  '9': [0b11110, 0b10010, 0b10010, 0b11110, 0b00010, 0b00010, 0b11110],
  'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b01010, 0b00100],
  'A': [0b01100, 0b10010, 0b10010, 0b11110, 0b10010, 0b10010, 0b10010],
  'C': [0b01110, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b01110],
  'k': [0b10000, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10010],
  'h': [0b10000, 0b10000, 0b10000, 0b11100, 0b10010, 0b10010, 0b10010],
  '%': [0b11001, 0b11010, 0b00100, 0b00100, 0b01000, 0b01011, 0b10011],
  '°': [0b01100, 0b10010, 0b01100, 0b00000, 0b00000, 0b00000, 0b00000],
  '-': [0b00000, 0b00000, 0b00000, 0b11110, 0b00000, 0b00000, 0b00000],
  '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b01100],
  '/': [0b00010, 0b00010, 0b00100, 0b00100, 0b01000, 0b01000, 0b10000],
};

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  DOT-MATRIX RENDERERS                                                      *
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Render a string as SVG dot-matrix circles (generic, un-positioned).
 * Returns { circles: svgMarkup, chars: char[] }.
 */
function _dotCircles(str, color, r, gap, maxChars) {
  const step = r * 2 + gap, colW = 5 * step, charGap = gap * 2;
  const chars = str.slice(0, maxChars || 4).split('');
  const onA = [], offA = [];
  for (let i = 0, len = chars.length; i < len; i++) {
    const rows = DIGITS[chars[i]];
    if (!rows) continue;
    const xo = i * (colW + charGap);
    for (let ry = 0; ry < 7; ry++) {
      const row = rows[ry];
      for (let c = 0; c < 5; c++) {
        const ci = `<circle cx="${(xo + c * step + r).toFixed(2)}" cy="${(ry * step + r).toFixed(2)}" r="${r}"/>`;
        ((row >> (4 - c)) & 1 ? onA : offA).push(ci);
      }
    }
  }
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offA.join('')}</g><g fill="${color}">${onA.join('')}</g>`,
    chars,
  };
}

/**
 * Dot-matrix overlay projected onto a module's front face (isometric).
 * Clickable when entityId is provided.
 */
function _faceDots(valStr, color, entityId) {
  const r = 0.85, gap = 0.4, step = r * 2 + gap;
  const { circles, chars } = _dotCircles(valStr, color, r, gap, 7);
  const colW = 5 * step, charGap = gap * 2;
  const dw = chars.length * colW + Math.max(0, chars.length - 1) * charGap;
  const dh = 7 * step;
  const fW = MX - CR - LX, fH = SB_L - ST_L;
  const sc = Math.min(fW * 0.46 / dw, fH * 0.55 / dh);
  const tx = LX + fW / 2 - sc * dw / 2;
  const ty = ST_L + fH / 2 - sc * SLF * (dw / 2) - sc * dh / 2;
  const cls = entityId ? ` class="dp" data-entity="${entityId}"` : '';
  const sty = entityId ? 'cursor:pointer;' : 'pointer-events:none;';
  return `<g${cls} transform="matrix(${sc.toFixed(4)},${(sc * SLF).toFixed(4)},0,${sc.toFixed(4)},${tx.toFixed(2)},${ty.toFixed(2)})" opacity="0.68" style="${sty}">${circles}</g>`;
}

/** Maximum pixel width for side-panel dot displays. */
const PANEL_MAX_W = 80;

/**
 * Flat dot-matrix panel (appears beside the battery).
 * Returns { circles, bW, bH } for embedding.
 */
function _panelDots(valStr, color) {
  const r = 1.8, gap = 0.8, step = r * 2 + gap;
  const colW = 5 * step, charGap = gap * 2, pad = 5;
  const chars = valStr.slice(0, 4).split('');
  const rawW = chars.length * colW + Math.max(0, chars.length - 1) * charGap;
  const rawH = 7 * step;
  const sc = (rawW + pad * 2) > PANEL_MAX_W ? (PANEL_MAX_W - pad * 2) / rawW : 1;
  const bW = (rawW * sc + pad * 2).toFixed(1);
  const bH = (rawH * sc + pad * 2).toFixed(1);
  const rsc = (r * sc).toFixed(1);
  const onA = [], offA = [];
  for (let i = 0, len = chars.length; i < len; i++) {
    const rows = DIGITS[chars[i]];
    if (!rows) continue;
    const xo = (i * (colW + charGap)) * sc;
    for (let ry = 0; ry < 7; ry++) {
      const row = rows[ry];
      for (let c = 0; c < 5; c++) {
        const ci = `<circle cx="${(pad + xo + (c * step + r) * sc).toFixed(1)}" cy="${(pad + (ry * step + r) * sc).toFixed(1)}" r="${rsc}"/>`;
        ((row >> (4 - c)) & 1 ? onA : offA).push(ci);
      }
    }
  }
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offA.join('')}</g><g fill="${color}">${onA.join('')}</g>`,
    bW, bH,
  };
}

/* ─── Arrow dot-matrix (charge / discharge indicator) ────────────────────── */

const ARROW_COLS = 11, ARROW_ROWS = 8;

const ARROW_DOWN = [
  0b00000100000, 0b00000100000, 0b00000100000,
  0b00010101000, 0b00001110000, 0b10000100001,
  0b10000000001, 0b11111111111,
];

const ARROW_UP = [
  0b00000100000, 0b00001110000, 0b00010101000,
  0b00000100000, 0b00000100000, 0b10000100001,
  0b10000000001, 0b11111111111,
];

/**
 * Arrow indicator panel: points up (discharge) or down (charge).
 * When color is null, renders as dim "idle" pattern.
 */
function _arrowDots(isCharging, color) {
  const rows = color
    ? (isCharging ? ARROW_DOWN : ARROW_UP)
    : new Array(ARROW_ROWS).fill((1 << ARROW_COLS) - 1);
  const r = 1.8, gap = 0.8, step = r * 2 + gap, pad = 5;
  const rawW = (ARROW_COLS - 1) * step + r * 2;
  const rawH = (ARROW_ROWS - 1) * step + r * 2;
  const sc = (rawW + pad * 2) > PANEL_MAX_W ? (PANEL_MAX_W - pad * 2) / rawW : 1;
  const bW = (rawW * sc + pad * 2).toFixed(1);
  const bH = (rawH * sc + pad * 2).toFixed(1);
  const rsc = (r * sc).toFixed(1);
  const onA = [], offA = [];
  for (let ry = 0; ry < ARROW_ROWS; ry++) {
    const row = rows[ry];
    for (let c = 0; c < ARROW_COLS; c++) {
      const ci = `<circle cx="${(pad + c * step * sc + r * sc).toFixed(1)}" cy="${(pad + ry * step * sc + r * sc).toFixed(1)}" r="${rsc}"/>`;
      if ((row >> (ARROW_COLS - 1 - c)) & 1 && color) onA.push(ci);
      else offA.push(ci);
    }
  }
  const onD = onA.join(''), offD = offA.join('');
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offD}</g>${onD ? `<g fill="${color}">${onD}</g>` : ''}`,
    bW, bH,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  MEMOISED STATIC SVG LAYERS                                                *
 *                                                                            *
 *  Battery shell geometry never changes, so each layer is computed once and   *
 *  stored in _batCache. The glow layer is also cached by module count +       *
 *  charge direction.                                                          *
 * ═══════════════════════════════════════════════════════════════════════════ */

const _batCache = new Map();

/** Master module (top piece with cap, grey rectangle, separators). */
function _noBaseContent() {
  if (_batCache.has('nb')) return _batCache.get('nb');
  const id = 'nb';
  const pW = 12, pH = 12, pX = MX - 8 - pW, pOff = 2;
  const pTL = B_TL + SLF * (pX - LX) + pOff;
  const pTR = B_TL + SLF * (pX + pW - LX) + pOff;
  const pBL = pTL + pH, pBR = pTR + pH;
  const ulOff = pOff + pH + 2;
  // Cap lid path (hand-tuned Bézier)
  const cap = `M84.35 13.03 L7.67 6.21 L${LX + 2.9} ${B_TL + 0.7} Q${LX} ${B_TL} ${LX + 2.99} ${B_TL - 0.3} L27.1 ${1.93 + 0.29} Q30.1 1.93 33.09 ${1.93 + 0.23} L${RX - 3} ${B_TR - 0.23} Q${RX} ${B_TR} ${RX - 0.9} ${B_TR + 1.4} C109.08 9.61 107.12 10.50 105.03 10.79 L92.14 12.60 C89.56 12.96 86.95 13.03 84.35 13.03 Z`;
  const r = _defs(id) +
    _front(id, B_TL, B_TM, SB_L, SB_M) + _right(id, B_TM, B_TR, SB_M, SB_R) + _blend(id, B_TM, SB_M) +
    `<path d="${cap}" fill="url(#gC${id})" stroke="${CAP_EDG}" stroke-width="0.5" stroke-linejoin="round"/>` +
    `<polygon points="${pX},${pTL} ${pX + pW},${pTR} ${pX + pW},${pBR} ${pX},${pBL}" fill="#b0b0b6" stroke="${EDGE_C}" stroke-width="0.5"/>` +
    `<polygon points="${pX + 1.5},${pTL + 1.2} ${pX + pW - 1.5},${pTR + 1.2} ${pX + pW - 1.5},${pBR - 1.2} ${pX + 1.5},${pBL - 1.2}" fill="#a0a0a6" opacity="0.65"/>` +
    _sep(B_TL + ulOff, B_TM + ulOff, B_TR + ulOff, 0.55, SEP_C, 0.6) +    // line below grey rectangle
    _sep(SB_L, SB_M, SB_R, 0.75, SEP_C) +
    _sep(SB_L + 2.5, SB_M + 2.5, SB_R + 2.5, 0.45, '#6a6a70', 0.4) +     // shadow below bottom separator
    `<line x1="${LX}" y1="${B_TL}" x2="${LX}" y2="${SB_L}" stroke="${EDGE_C}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<line x1="${RX}" y1="${B_TR}" x2="${RX}" y2="${SB_R}" stroke="${EDGE_C}" stroke-width="1.5" stroke-linecap="round"/>`;
  _batCache.set('nb', r);
  return r;
}

/** Additional expansion module (slot between top and bottom separators). */
function _moduleContent(i) {
  const k = 'm' + i;
  if (_batCache.has(k)) return _batCache.get(k);
  const id = k;
  const r = _defs(id) +
    _front(id, ST_L, ST_M, SB_L, SB_M) + _right(id, ST_M, ST_R, SB_M, SB_R) + _blend(id, ST_M, SB_M) +
    _sep(ST_L, ST_M, ST_R, 0.75, SEP_C) + _sep(SB_L, SB_M, SB_R, 0.75, SEP_C) +
    `<line x1="${LX}" y1="${ST_L}" x2="${LX}" y2="${SB_L}" stroke="${EDGE_C}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<line x1="${RX}" y1="${ST_R}" x2="${RX}" y2="${SB_R}" stroke="${EDGE_C}" stroke-width="1.1" stroke-linecap="round"/>`;
  _batCache.set(k, r);
  return r;
}

/** Battery base (bottom slab under the last module). */
function _baseContent(modules) {
  const k = 'bs' + modules;
  if (_batCache.has(k)) return _batCache.get(k);
  const id = 'bs';
  const r = _defs(id) +
    _front(id, SB_L, SB_M, BB_L, BB_M) + _right(id, SB_M, SB_R, BB_M, BB_R) + _blend(id, SB_M, BB_M) +
    _sep(SB_L, SB_M, SB_R, 0.75, SEP_C) +              // top separator of base
    `<line x1="${LX}" y1="${SB_L}" x2="${LX}" y2="${BB_L}" stroke="${EDGE_C}" stroke-width="1.2" stroke-linecap="round"/>` +
    _sep(BB_L, BB_M, BB_R, 1.0, EDGE_C) +               // bottom edge
    `<line x1="${RX}" y1="${SB_R}" x2="${RX}" y2="${BB_R}" stroke="${EDGE_C}" stroke-width="1.1" stroke-linecap="round"/>`;
  _batCache.set(k, r);
  return r;
}

/**
 * Animated glow segments between stacked modules.
 * Each segment gets its own SVG filter + gradient for a neon-LED look.
 */
function _glowContent(modules, gC1, gC2) {
  const parts = [];
  for (let i = 0; i <= modules; i++) {
    const oy = i * MODULE_OFFSET;
    const y1 = oy + SB_L, y2 = oy + SB_M, y3 = oy + SB_R;
    const gid = 'lg' + i;
    parts.push(
      '<defs>' +
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="' + gC1 + '" stop-opacity="0"/>' +
          '<stop offset="20%" stop-color="' + gC1 + '"/>' +
          '<stop offset="50%" stop-color="' + gC2 + '"/>' +
          '<stop offset="80%" stop-color="' + gC1 + '"/>' +
          '<stop offset="100%" stop-color="' + gC1 + '" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<filter id="gf' + i + '" x="-10%" y="-80%" width="120%" height="260%">' +
          '<feGaussianBlur stdDeviation="1.2" result="blur"/>' +
          '<feColorMatrix type="saturate" values="2" in="blur" result="sat"/>' +
          '<feComponentTransfer in="sat" result="bright">' +
            '<feFuncR type="linear" slope="1.4"/><feFuncG type="linear" slope="1.4"/><feFuncB type="linear" slope="1.4"/>' +
          '</feComponentTransfer>' +
          '<feMerge><feMergeNode in="bright"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
      '</defs>' +
      '<g filter="url(#gf' + i + ')" class="led-seg">' +
        '<path d="M' + LX + ' ' + y1 + ' L' + (MX - CR).toFixed(2) + ' ' + (y2 + SLF * (-CR)).toFixed(2) +
          ' Q' + MX + ' ' + y2 + ' ' + (MX + CR).toFixed(2) + ' ' + (y2 + SLR * CR).toFixed(2) + ' L' + RX + ' ' + y3 + '"' +
          ' stroke="url(#' + gid + ')" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '</g>'
    );
  }
  return parts.join('');
}

/** SOC-based colour: accent >= 25%, blue < 25%. */
function socCol(v) { return v >= 25 ? DEF_ACCENT : BLUE_EL; }

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  MAIN CARD ELEMENT                                                         *
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Energy per module in kWh (used for total capacity display). */
const KWH_PER = 2.2;

class StoreyBatteryCard extends HTMLElement {

  /* ── Lifecycle ──────────────────────────────────────────────────────────── */

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._raf = null;        // pending requestAnimationFrame id
    this._prevKey = null;    // dirty-key for diffing
    this._dom = null;        // cached DOM refs (set after first paint)

    // Delegated click handler for dot-panel → more-info dialogs
    this.shadowRoot.addEventListener('click', e => {
      const dp = e.target.closest('.dp[data-entity]');
      if (dp) this._moreInfo(dp.dataset.entity);
    }, { passive: true });
  }

  setConfig(c) {
    this._config = c;
    this._prevKey = null;
    this._dom = null;        // shell may change, invalidate refs
    this._scheduleRender();
  }

  set hass(h) {
    this._hass = h;
    this._scheduleRender();
  }

  disconnectedCallback() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  }

  /* ── Render scheduling (rAF coalescing + dirty-key diffing) ────────────── */

  _scheduleRender() {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => { this._raf = null; this._renderIfChanged(); });
  }

  _renderIfChanged() {
    const k = this._buildKey();
    if (k === this._prevKey) return;
    this._prevKey = k;
    this._render();
  }

  /** Build a composite string that changes only when visual output would. */
  _buildKey() {
    const m = this._modules();
    const soc = this._entVal(this._config.soc_entity);
    const pw = this._entVal(this._config.power_entity);
    const mods = [0, 1, 2, 3].map(i => this._entVal(this._config['module_' + i + '_entity'])).join(',');
    return `${m}|${soc !== null ? Math.round(soc) : null}|${pw !== null ? Math.round(pw / 10) * 10 : null}|${mods}|${this._config.color_accent || ''}|${this._config.color_bg || ''}|${this._config.glow_enabled || ''}`;
  }

  /* ── Entity helpers ────────────────────────────────────────────────────── */

  /** Number of additional modules (0–3), from entity or config. */
  _modules() {
    const { modules_entity, modules } = this._config;
    if (modules_entity && this._hass) {
      const s = this._hass.states[modules_entity];
      if (s) return Math.min(3, Math.max(0, parseInt(s.state) || 0));
    }
    return Math.min(3, Math.max(0, parseInt(modules) || 0));
  }

  /** Resolve entity state, return null if missing/unavailable. */
  _ent(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    return { v: s.state, u: s.attributes.unit_of_measurement || '', id };
  }

  /** Shorthand: entity → numeric value or null. */
  _entVal(id) { const e = this._ent(id); return e ? parseFloat(e.v) : null; }

  /** Fire hass-more-info event for a given entity. */
  _moreInfo(entityId) {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  /* ── Main render ───────────────────────────────────────────────────────── */

  _render() {
    const modules = this._modules();
    const accent = this._config.color_accent || DEF_ACCENT;
    const bg = this._config.color_bg || DEF_BG;
    const totalKwh = ((modules + 1) * KWH_PER).toFixed(1);
    const batH = SVG_H + modules * MODULE_OFFSET;

    // Resolve entities once, cache numeric values
    const soc = this._ent(this._config.soc_entity);
    const power = this._ent(this._config.power_entity);
    const socVal = soc ? Math.min(100, Math.max(0, +soc.v)) : null;
    const pwVal = power ? +power.v : null;

    const hasDots = socVal !== null || pwVal !== null;
    const DOTS_X = SVG_W + 10;
    const VBW = hasDots ? DOTS_X + PANEL_MAX_W + 2 : SVG_W;

    /* ── Battery stack SVG ─────────────────────────────────────────────── */

    const ent0 = this._ent(this._config.module_0_entity);
    const fDots0 = ent0
      ? _faceDots(Math.round(Math.abs(+ent0.v)).toString() + (this._config.module_0_unit || ''), accent, ent0.id)
      : '';
    const batParts = [
      `<svg x="0" y="0" width="${SVG_W}" height="${SVG_H}" overflow="visible">${_noBaseContent()}${fDots0}</svg>`,
    ];

    for (let i = 0; i < modules; i++) {
      const ent = this._ent(this._config['module_' + (i + 1) + '_entity']);
      const fDots = ent
        ? _faceDots(Math.round(Math.abs(+ent.v)).toString() + (this._config['module_' + (i + 1) + '_unit'] || ''), accent, ent.id)
        : '';
      batParts.push(`<svg x="0" y="${(i + 1) * MODULE_OFFSET}" width="${SVG_W}" height="${SVG_H}" overflow="visible">${_moduleContent(i)}${fDots}</svg>`);
    }
    batParts.push(`<svg x="0" y="${modules * MODULE_OFFSET}" width="${SVG_W}" height="${SVG_H}" overflow="visible">${_baseContent(modules)}</svg>`);
    const batSVG = batParts.join('');

    /* ── Glow layer (cached by modules + direction) ────────────────────── */

    let glowSVG = '';
    if (this._config.glow_enabled && pwVal !== null) {
      if (Math.abs(pwVal) > 10) {
        const pos = pwVal >= 0;
        const glowKey = 'glow_' + modules + '_' + (pos ? 1 : 0);
        if (_batCache.has(glowKey)) {
          glowSVG = _batCache.get(glowKey);
        } else {
          glowSVG = _glowContent(modules, pos ? '#ffd000' : '#4D7CFF', pos ? '#ffe84d' : '#82b4ff');
          _batCache.set(glowKey, glowSVG);
        }
      }
    }

    /* ── Side dot-matrix panels ────────────────────────────────────────── */

    let panelsSVG = '', dy = 4, panelsBot = 0;

    // SOC panel
    if (socVal !== null) {
      const col = socCol(socVal);
      const { circles, bW, bH } = _panelDots(socVal.toFixed(0), col);
      panelsSVG +=
        `<g class="dp" data-entity="${soc.id}" transform="translate(0,${dy})" style="cursor:pointer;filter:drop-shadow(0 0 5px ${col}44);">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="rgba(255,255,255,0.28)" style="font-family:-apple-system,sans-serif;font-weight:500;">SOC</text>
          <rect x="0" y="0" width="${bW}" height="${bH}" rx="5" fill="#222"/>
          ${circles}
        </g>`;
      panelsBot = dy + +bH;
      dy += +bH + 12;
    }

    // Power panel + arrow
    if (pwVal !== null) {
      const isCharging = pwVal < 0;
      const col = isCharging ? BLUE_EL : accent;
      const lbl = (isCharging ? '\u2193' : '\u2191') + ' W';
      const { circles, bW, bH } = _panelDots(Math.round(Math.abs(pwVal)).toString(), col);
      panelsSVG +=
        `<g class="dp" data-entity="${power.id}" transform="translate(0,${dy})" style="cursor:pointer;filter:drop-shadow(0 0 5px ${col}44);">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="${col}" style="font-family:-apple-system,sans-serif;font-weight:500;">${lbl}</text>
          <rect x="0" y="0" width="${bW}" height="${bH}" rx="5" fill="#222"/>
          ${circles}
        </g>`;
      panelsBot = dy + +bH;
      dy += +bH + 12;

      const idle = Math.abs(pwVal) <= 10;
      const arrowCol = idle ? null : col;
      const { circles: arrowC, bW: arrowBW, bH: arrowBH } = _arrowDots(idle ? true : isCharging, arrowCol);
      const lblArrow = idle ? '' : (isCharging ? 'CHG' : 'DCH');
      panelsSVG +=
        `<g class="dp" data-entity="${power.id}" transform="translate(0,${dy})" style="cursor:pointer;${idle ? '' : ' filter:drop-shadow(0 0 6px ' + col + '55);'}">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="${col}" style="font-family:-apple-system,sans-serif;font-weight:500;">${lblArrow}</text>
          <rect x="0" y="0" width="${arrowBW}" height="${arrowBH}" rx="5" fill="#222"/>
          ${arrowC}
        </g>`;
      panelsBot = dy + +arrowBH;
    }

    /* ── Header pill: "avail / total kWh" (merged, always accent yellow) ── */

    let pillHTML;
    if (socVal !== null) {
      const avail = (socVal / 100 * +totalKwh).toFixed(1);
      pillHTML =
        `<div class="kwh-pill" style="background:${accent}11;--pill-col:${accent}">
          <span class="kwh-num" style="color:${accent}">${avail}</span>
          <span class="kwh-sep" style="color:${accent}88">/</span>
          <span class="kwh-num" style="color:${accent}">${totalKwh}</span>
          <span class="kwh-unit">kWh</span>
        </div>`;
    } else {
      pillHTML =
        `<div class="kwh-pill" style="background:${accent}11;--pill-col:${accent}">
          <span class="kwh-num" style="color:${accent}">${totalKwh}</span>
          <span class="kwh-unit">kWh</span>
        </div>`;
    }

    /* ── Static shell (injected once, reused across renders) ───────────── */

    const root = this.shadowRoot;
    if (!root.querySelector('ha-card')) {
      root.innerHTML = `<style>
        :host { display: block }
        * { box-sizing: border-box; font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif }

        ha-card {
          background: var(--sbc-bg); border-radius: 22px; overflow: hidden; padding: 0;
          border: 1px solid var(--sbc-border); box-shadow: 0 4px 40px rgba(0,0,0,.4);
          contain: layout style paint;
        }

        /* ── Header ───────────────────────────────── */
        .top-band { display: flex; justify-content: space-between; align-items: center; padding: 16px 14px 0; width: 100% }
        .brand-row { display: flex; align-items: center; gap: 8px }
        .brand {
          font-size: 24px; font-weight: 800; letter-spacing: .06em; color: var(--sbc-accent);
          line-height: 1; text-transform: uppercase; text-shadow: 0 0 30px var(--sbc-glow);
        }

        /* ── kWh pill ─────────────────────────────── */
        .kwh-pill {
          position: relative; display: inline-flex; align-items: baseline; gap: 4px;
          padding: 5px 13px; border-radius: 99px; cursor: default;
        }
        .kwh-pill::before {
          content: ''; position: absolute; inset: 0; border-radius: 99px;
          border: 1.5px solid transparent;
          background: linear-gradient(135deg, var(--pill-col),
            color-mix(in srgb, var(--pill-col) 30%, transparent), transparent) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out; mask-composite: exclude; pointer-events: none;
        }
        .kwh-num  { font-size: 16px; font-weight: 800; letter-spacing: -.02em }
        .kwh-sep  { font-size: 13px; font-weight: 600; margin: 0 1px }
        .kwh-unit { font-size: 10px; color: rgba(255,255,255,.4); letter-spacing: .07em; text-transform: uppercase }
        .pills-row { display: flex; align-items: center; gap: 8px }

        /* ── Body / panels ────────────────────────── */
        .svg-body { padding: 12px 14px 16px }
        .dp { transition: opacity .1s; contain: layout style }
        .dp:active { opacity: .7 }

        /* ── LED glow animation ───────────────────── */
        @keyframes led-breathe { 0%,100% { opacity: .25 } 60% { opacity: .55 } 82%,88% { opacity: 1 } 94% { opacity: .8 } }
        .led-seg {
          animation: led-breathe 2.2s cubic-bezier(.4,0,.2,1) infinite;
          will-change: opacity; transform: translateZ(0);
        }
        .led-seg:nth-child(2) { animation-delay: -.55s }
        .led-seg:nth-child(3) { animation-delay: -1.1s }
        .led-seg:nth-child(4) { animation-delay: -1.65s }

        /* GPU-promote filtered groups */
        .glow-grp   { will-change: transform; transform: translateZ(0) }
        .panels-grp { will-change: transform }
      </style>
      <ha-card>
        <div class="top-band">
          <div class="brand-row">
            <svg width="16" height="16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
              <path class="star" d="M50 0 C50 0 44 44 0 50 C0 50 44 56 50 100 C50 100 56 56 100 50 C100 50 56 44 50 0Z"/>
            </svg>
            <div class="brand">STOREY</div>
          </div>
          <div class="pills-row"></div>
        </div>
        <div class="svg-body">
          <svg class="main-svg" width="100%" xmlns="http://www.w3.org/2000/svg" overflow="visible" style="display:block">
            <g class="bat-grp" style="filter:drop-shadow(3px 6px 14px rgba(0,0,0,.22))"></g>
            <g class="glow-grp"></g>
            <g class="panels-grp"></g>
          </svg>
        </div>
      </ha-card>`;
    }

    /* ── CSS custom properties (repaint-only) ──────────────────────────── */

    this.style.setProperty('--sbc-accent', accent);
    this.style.setProperty('--sbc-bg', bg);
    this.style.setProperty('--sbc-border', bg === DEF_BG ? '#282828' : 'transparent');
    this.style.setProperty('--sbc-glow', accent + '55');

    /* ── Cache DOM refs after first shell build ────────────────────────── */

    if (!this._dom) {
      this._dom = {
        svg:    root.querySelector('.main-svg'),
        star:   root.querySelector('.star'),
        bat:    root.querySelector('.bat-grp'),
        glow:   root.querySelector('.glow-grp'),
        panels: root.querySelector('.panels-grp'),
        pills:  root.querySelector('.pills-row'),
      };
    }
    const d = this._dom;

    /* ── Surgical DOM updates ──────────────────────────────────────────── */

    const totalH = Math.max(batH, hasDots ? panelsBot + 8 : 0);
    d.svg.setAttribute('viewBox', `0 0 ${VBW} ${totalH}`);
    d.star.setAttribute('fill', accent);
    d.bat.innerHTML = batSVG;
    d.glow.innerHTML = glowSVG;
    if (hasDots) {
      d.panels.setAttribute('transform', `translate(${DOTS_X},4)`);
      d.panels.innerHTML = panelsSVG;
    } else {
      d.panels.removeAttribute('transform');
      d.panels.innerHTML = '';
    }
    d.pills.innerHTML = pillHTML;
  }

  /* ── Card API ──────────────────────────────────────────────────────────── */

  getCardSize() { return 3 + this._modules(); }
  static getConfigElement() { return document.createElement('storey-battery-card-editor'); }
  static getStubConfig() { return { modules: 1 }; }
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  VISUAL CONFIG EDITOR                                                      *
 * ═══════════════════════════════════════════════════════════════════════════ */

class StoreyBatteryCardEditor extends HTMLElement {

  setConfig(c) {
    this._config = { ...c };
    if (!this._built && this._hass) { this._built = true; this._render(); }
  }

  set hass(h) {
    this._hass = h;
    if (!this._built && this._config) { this._built = true; this._render(); return; }
    // Rebuild datalist options only when entity list changes
    const sensorKeys = Object.keys(h.states).filter(e => e.startsWith('sensor.')).sort();
    const newKeys = sensorKeys.join('\n');
    if (newKeys === this._lastEntKeys) return;
    this._lastEntKeys = newKeys;
    const frag = document.createDocumentFragment();
    for (const e of sensorKeys) {
      const o = document.createElement('option');
      o.value = e;
      frag.appendChild(o);
    }
    this.querySelectorAll('datalist').forEach(dl => {
      dl.innerHTML = '';
      dl.appendChild(frag.cloneNode(true));
    });
  }

  /** Dispatch config-changed to HA editor host. */
  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  /** Set a config key, fire change, and re-render when layout-affecting keys change. */
  _set(key, val, isChecked) {
    if (isChecked !== undefined) {
      if (isChecked) this._config[key] = true; else delete this._config[key];
    } else if (val === '' || val === null || val === undefined) {
      delete this._config[key];
    } else {
      this._config[key] = val;
    }
    this._fire();
    if (key === 'modules' || key === 'glow_enabled') {
      this._built = false;
      this._built = true;
      this._render();
    }
  }

  _modules() { return Math.min(3, Math.max(0, parseInt(this._config.modules) || 0)); }
  _entities() { return this._hass ? Object.keys(this._hass.states).filter(e => e.startsWith('sensor.')).sort() : []; }

  /** Entity picker field with datalist autocomplete. */
  _picker(label, key, placeholder) {
    const val = this._config[key] || '';
    const lid = 'dl' + key.replace(/\W/g, '');
    const opts = this._entities().map(e => `<option value="${e}">`).join('');
    return `<div class="field">
      <label>${label}</label>
      <input class="ep" data-key="${key}" value="${val}"
        list="${lid}" placeholder="${placeholder || 'Search\u2026'}" autocomplete="off"/>
      <datalist id="${lid}">${opts}</datalist>
    </div>`;
  }

  _render() {
    const c = this._config || {};
    const m = this._modules();

    // Build per-module entity + unit rows
    let modFields = '';
    for (let i = 1; i <= m; i++) {
      modFields += `<div class="row2">
        ${this._picker(`Module ${i} \u2014 Entity`, `module_${i}_entity`, `sensor.storey_module_${i}`)}
        <div class="field">
          <label>Module ${i} \u2014 Unit</label>
          <input type="text" data-key="module_${i}_unit" value="${c['module_' + i + '_unit'] || ''}" placeholder="W, kW, \u00b0C\u2026" style="max-width:80px;"/>
        </div>
      </div>`;
    }

    this.innerHTML = `
      <style>
        * { box-sizing: border-box; font-family: -apple-system, sans-serif; }
        .grid { display: flex; flex-direction: column; gap: 10px; padding: 14px 0; }
        .group { border: 1px solid var(--divider-color, #333); border-radius: 10px; padding: 12px; }
        .group-title { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--secondary-text-color); margin-bottom: 10px; }
        .field { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
        .field:last-child { margin-bottom: 0; }
        label { font-size: 12px; color: var(--secondary-text-color); }
        input, select {
          padding: 8px 10px; border: 1px solid var(--divider-color, #333); border-radius: 7px;
          background: var(--card-background-color); color: var(--primary-text-color); font-size: 13px; width: 100%;
        }
        input.ep { border-color: var(--primary-color, #777); }
        input.ep:focus { outline: none; box-shadow: 0 0 0 1px var(--primary-color); }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .color-row { display: flex; align-items: center; gap: 8px; }
        .color-row input[type=color] { width: 36px; height: 36px; padding: 2px; border-radius: 6px; cursor: pointer; flex-shrink: 0; border: none; }
        .color-row input[type=text] { flex: 1; }
        .tog-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .tog-row label { margin: 0; font-size: 12px; color: var(--secondary-text-color); }
      </style>
      <div class="grid">

        <!-- Modules -->
        <div class="group">
          <div class="group-title">Modules</div>
          <div class="field">
            <label>Additional modules (0\u20133)</label>
            <select data-key="modules">
              ${[0, 1, 2, 3].map(n => `<option value="${n}"${c.modules == n ? ' selected' : ''}>${n} module${n > 1 ? 's' : ''} \u2014 total ${n + 1}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Sensors -->
        <div class="group">
          <div class="group-title">Sensors</div>
          ${this._picker('State of Charge %', 'soc_entity', 'sensor.storey_soc')}
          ${this._picker('Power W', 'power_entity', 'sensor.storey_power')}
          <div class="row2">
            ${this._picker('Main module \u2014 Entity', 'module_0_entity', 'sensor.storey_module_0')}
            <div class="field">
              <label>Main module \u2014 Unit</label>
              <input type="text" data-key="module_0_unit" value="${c.module_0_unit || ''}" placeholder="W, kW, \u00b0C\u2026" style="max-width:80px;"/>
            </div>
          </div>
          ${modFields}
        </div>

        <!-- Effects -->
        <div class="group">
          <div class="group-title">Effects</div>
          <div class="field tog-row">
            <label>Inter-module glow</label>
            <label style="position:relative;display:inline-block;width:42px;height:24px;flex-shrink:0;">
              <input type="checkbox" data-key="glow_enabled" ${c.glow_enabled ? 'checked' : ''}
                style="opacity:0;width:0;height:0;position:absolute;"/>
              <span style="position:absolute;inset:0;border-radius:99px;cursor:pointer;transition:background .2s;
                background:${c.glow_enabled ? DEF_ACCENT : 'rgba(255,255,255,0.12)'};">
                <span style="position:absolute;top:3px;border-radius:50%;width:18px;height:18px;transition:left .2s;
                  left:${c.glow_enabled ? '21px' : '3px'};background:${c.glow_enabled ? '#1a1a1a' : 'rgba(255,255,255,0.6)'};">
                </span>
              </span>
            </label>
          </div>
        </div>

        <!-- Colors -->
        <div class="group">
          <div class="group-title">Colors</div>
          <div class="row2">
            <div class="field"><label>Accent</label>
              <div class="color-row">
                <input type="color" data-key="color_accent" value="${c.color_accent || DEF_ACCENT}"/>
                <input type="text"  data-key="color_accent" value="${c.color_accent || DEF_ACCENT}" placeholder="${DEF_ACCENT}"/>
              </div>
            </div>
            <div class="field"><label>Background</label>
              <div class="color-row">
                <input type="color" data-key="color_bg" value="${c.color_bg || DEF_BG}"/>
                <input type="text"  data-key="color_bg" value="${c.color_bg || DEF_BG}" placeholder="${DEF_BG}"/>
              </div>
            </div>
          </div>
        </div>

      </div>`;

    /* ── Event wiring ──────────────────────────────────────────────────── */

    // Entity pickers: stop propagation so HA editor doesn't steal keystrokes
    this.querySelectorAll('input.ep').forEach(el => {
      ['keydown', 'keyup', 'input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), { passive: true }));
      ['change', 'blur'].forEach(ev => el.addEventListener(ev, e => { e.stopPropagation(); this._set(el.dataset.key, el.value || null); }));
    });

    // Free-text inputs (units, etc.)
    this.querySelectorAll('input[type=text][data-key]:not(.ep)').forEach(el => {
      ['keydown', 'keyup', 'input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), { passive: true }));
      el.addEventListener('blur', e => { e.stopPropagation(); this._set(el.dataset.key, el.value || null); });
    });

    // Color pickers: sync text <-> color input
    this.querySelectorAll('input[type=color][data-key]').forEach(el => {
      el.addEventListener('input', e => {
        e.stopPropagation();
        const t = this.querySelector(`input[type=text][data-key="${el.dataset.key}"]`);
        if (t) t.value = el.value;
        this._set(el.dataset.key, el.value);
      }, { passive: true });
    });

    // Selects and checkboxes
    this.querySelectorAll('select[data-key],input[type=checkbox][data-key]').forEach(el => {
      el.addEventListener('change', e => {
        e.stopPropagation();
        if (el.type === 'checkbox') this._set(el.dataset.key, null, el.checked);
        else this._set(el.dataset.key, el.value);
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  REGISTRATION                                                              *
 * ═══════════════════════════════════════════════════════════════════════════ */

customElements.define('storey-battery-card', StoreyBatteryCard);
customElements.define('storey-battery-card-editor', StoreyBatteryCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'storey-battery-card',
  name: 'Storey Battery Card',
  description: 'Modular Storey battery \u2014 responsive 3-D SVG + dot-matrix status panels',
  preview: true,
});
