/* ── storey-battery-card v14 — joint inter-module électrique (crépitement + sparks) ── */
(()=>{
// Device detection — iPad/mobile : coupe les anims (SMIL + CSS) pour soulager le GPU.
const SBC_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const SBC_IS_LOW_POWER = SBC_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);
// Retire les animations SVG SMIL (le CSS animation:none ne les coupe pas).
const _sbcStripSmil = (svg) => svg
  .replace(/<animate(Transform|Motion)?\b[^>]*\/>/g, '')
  .replace(/<animate(Transform|Motion)?\b[^>]*>[\s\S]*?<\/animate(Transform|Motion)?>/g, '');
/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  storey-battery-card.js  v13.0                                          │
 * │  Home Assistant custom Lovelace card — Storey modular battery           │
 * │  v12 : géométrie 100% paramétrique — rectangle arrondi (W×D, rayon R)   │
 * │  extrudé et projeté en iso par 2 vecteurs u/v. Silhouette calculée,     │
 * │  enroulement des coins rendu par dégradé à stops tangents.              │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  PALETTE                                                                   *
 * ═══════════════════════════════════════════════════════════════════════════ */

const DEF_ACCENT = "#edff00";
const DEF_BG     = "#181818";
const BLUE_EL    = "#4D7CFF";

const CP_PRIMARY   = "#ff10f0";
const CP_ACCENT    = "#00fff9";
const CP_BG        = "#0d0d1a";
const CP_CHARGE    = "#00fff9";
const CP_DISCHARGE = "#ff10f0";

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  3-D ISOMETRIC GEOMETRY — paramétrique (v12)                               *
 *  Valeurs validées en preview : aA=6° aB=20° W=250 D=92 R=20 kH=1.6         *
 * ═══════════════════════════════════════════════════════════════════════════ */

const P_KW = 1.15;                            // élargissement esthétique (1 = mm réels)
const P_W = Math.round(530*P_KW), P_D = 270, P_R = 60;   // empreinte réelle Sunology (mm)
const P_AA = 6,  P_AB = 20, P_KH = 1;         // angles (°), échelle hauteur
const P_CAP = 65, P_UNIT = 255, P_MOD = 255, P_BASE = 14; // master = capot 65 + corps 255 ; ext = 255
const P_INS = 22;                              // retrait du socle

const _aA = P_AA*Math.PI/180, _aB = P_AB*Math.PI/180;
const GS  = 113 / (P_W*Math.cos(_aA) + P_D*Math.cos(_aB)); // largeur écran ≡ 113
const UX = Math.cos(_aA)*GS, UY = Math.sin(_aA)*GS;        // vecteur largeur
const VX = Math.cos(_aB)*GS, VY = -Math.sin(_aB)*GS;       // vecteur profondeur
const SLF = UY/UX;                             // pente écran face avant (compat _faceDots)

const CAPH  = P_CAP*P_KH*GS,  UNITH = P_UNIT*P_KH*GS;
const MODH  = P_MOD*P_KH*GS,  BASEH = P_BASE*P_KH*GS;
const MODULE_OFFSET = MODH;

/* Contour rectangle-arrondi échantillonné (plan du dessus, unités modèle) */
function _contour(w, d, r, x0, y0) {
  const p = [], n = 18;
  const arc = (cx,cy,a0,a1) => { for (let i=0;i<=n;i++){ const t=a0+(a1-a0)*i/n; p.push([x0+cx+r*Math.cos(t), y0+cy+r*Math.sin(t)]); } };
  arc(r,r,Math.PI,1.5*Math.PI);          // coin avant-gauche
  p.push([x0+w-r, y0]);
  arc(w-r,r,1.5*Math.PI,2*Math.PI);      // coin avant-droit
  p.push([x0+w, y0+d-r]);
  arc(w-r,d-r,0,0.5*Math.PI);            // coin arrière-droit
  p.push([x0+r, y0+d]);
  arc(r,d-r,0.5*Math.PI,Math.PI);        // coin arrière-gauche
  p.push([x0, y0+r]);
  return p;
}

/* Bornes écran du contour principal → offsets et largeur viewBox */
const _CTR = _contour(P_W, P_D, P_R, 0, 0);
let _mnX=1e9,_mxX=-1e9,_mnY=1e9,_mxY=-1e9;
for (const q of _CTR) {
  const sx=q[0]*UX+q[1]*VX, sy=q[0]*UY+q[1]*VY;
  if(sx<_mnX)_mnX=sx; if(sx>_mxX)_mxX=sx; if(sy<_mnY)_mnY=sy; if(sy>_mxY)_mxY=sy;
}
const OX = -_mnX, OY = -_mnY;
const SVG_W = Math.ceil(_mxX-_mnX);            // = 113
const TOP_H = _mxY-_mnY;                       // hauteur écran de la face sup
function _batHeight(m){ return TOP_H + CAPH + UNITH + m*MODH + BASEH; }

const _scrX = (x,y) => x*UX + y*VX + OX;
const _scrY = (x,y) => x*UY + y*VY + OY;

/* Silhouette : projette le contour, repère les extrêmes écran gauche/droite,
 * et conserve la branche "proche" (celle qui passe par la face avant). */
function _sil(pts) {
  const pr = pts.map(q => [q[0]*UX+q[1]*VX+OX, q[0]*UY+q[1]*VY+OY]);
  let iL=0, iR=0;
  pr.forEach((p,i)=>{ if(p[0]<pr[iL][0])iL=i; if(p[0]>pr[iR][0])iR=i; });
  const near=[];
  if (iL!==iR) { for (let i=iL;;i=(i+1)%pr.length){ near.push(i); if(i===iR) break; } }
  return { pr, near };
}
const SIL_M = _sil(_CTR);
const SIL_B = _sil(_contour(P_W-2*P_INS, P_D-2*P_INS, Math.max(4,P_R-P_INS), P_INS, P_INS));

/* longueur écran de la polyligne de joint (pour les comètes du glow) */
const SEAM_LEN = (() => {
  const q = SIL_M.near.map(i => SIL_M.pr[i]);
  let L = 0;
  for (let k = 1; k < q.length; k++) L += Math.hypot(q[k][0]-q[k-1][0], q[k][1]-q[k-1][1]);
  return L;
})();

const _fx = n => n.toFixed(2);
function _side(Sx,h0,h1) {                     // flanc extrudé h0→h1 (1 seul path)
  const a = Sx.near.map(i=>Sx.pr[i]);
  let d = 'M'+_fx(a[0][0])+' '+_fx(a[0][1]+h0);
  for (let k=1;k<a.length;k++) d += 'L'+_fx(a[k][0])+' '+_fx(a[k][1]+h0);
  for (let k=a.length-1;k>=0;k--) d += 'L'+_fx(a[k][0])+' '+_fx(a[k][1]+h1);
  return d+'Z';
}
function _loop(Sx,h) {                         // contour complet (face du dessus)
  let d = 'M'+_fx(Sx.pr[0][0])+' '+_fx(Sx.pr[0][1]+h);
  for (let k=1;k<Sx.pr.length;k++) d += 'L'+_fx(Sx.pr[k][0])+' '+_fx(Sx.pr[k][1]+h);
  return d+'Z';
}
function _seam(Sx,h) {                         // polyligne avant (joints, glow)
  const a = Sx.near.map(i=>Sx.pr[i]);
  let d = 'M'+_fx(a[0][0])+' '+_fx(a[0][1]+h);
  for (let k=1;k<a.length;k++) d += 'L'+_fx(a[k][0])+' '+_fx(a[k][1]+h);
  return d;
}

/* Palette plastique mat — stops posés aux tangentes des arcs de coin */
const CAP_STOPS  = ['#b8b8be','#f0f0f3','#e9e9ed','#d8d8de','#cfcfd5','#c6c6cc','#a5a5ab'];
const BODY_STOPS = ['#a6a6ac','#e4e4e8','#dadade','#c7c7cd','#bdbdc3','#b2b2b8','#92929a'];
const SEP_C = "#8d8d93", EDGE_C = "#85858b";

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  SHADING — dégradés calculés sur les tangentes des coins                   *
 * ═══════════════════════════════════════════════════════════════════════════ */

function _grad(id, stops) {
  const xL = SIL_M.pr[SIL_M.near[0]][0];
  const xR = SIL_M.pr[SIL_M.near[SIL_M.near.length-1]][0];
  const t = x => Math.min(1, Math.max(0, (x-xL)/(xR-xL)));
  const ks = [
    0,
    t(_scrX(P_R, 0)),                                   // fin du coin avant-gauche
    t(_scrX(P_W-P_R, 0)),                               // début du coin avant-droit
    t(_scrX(P_W-P_R+0.7071*P_R, P_R-0.7071*P_R)),       // milieu d'arc (terminator)
    t(_scrX(P_W, P_R)),                                 // début face droite
    t(_scrX(P_W, P_D-P_R)),                             // fin face droite
    1,
  ];
  let prev = 0;
  const body = ks.map((k,i)=>{
    const tt = i ? Math.min(1, Math.max(prev+0.001, k)) : 0;
    prev = tt;
    return `<stop offset="${tt.toFixed(3)}" stop-color="${stops[i]}"/>`;
  }).join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${_fx(xL)}" y1="0" x2="${_fx(xR)}" y2="0">${body}</linearGradient>`;
}

function _stackDefs() {
  return `<defs>${_grad('gCapSbc',CAP_STOPS)}${_grad('gBodySbc',BODY_STOPS)}` +
    `<linearGradient id="gVSbc" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>` +
      `<stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/>` +
      `<stop offset="0.75" stop-color="#000000" stop-opacity="0"/>` +
      `<stop offset="1" stop-color="#000000" stop-opacity="0.12"/>` +
    `</linearGradient>` +
    `<linearGradient id="gTopSbc" gradientUnits="userSpaceOnUse"` +
      ` x1="${_fx(_scrX(P_W/2,0))}" y1="${_fx(_scrY(P_W/2,0))}"` +
      ` x2="${_fx(_scrX(P_W/2,P_D))}" y2="${_fx(_scrY(P_W/2,P_D))}">` +
      `<stop offset="0" stop-color="#f6f6f8"/><stop offset="1" stop-color="#e1e1e6"/>` +
    `</linearGradient>` +
  `</defs>`;
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  DOT-MATRIX FONT  (5 × 7 bitmaps)                                         *
 * ═══════════════════════════════════════════════════════════════════════════ */

const DIGITS = {
  '0': [0b11110,0b10010,0b10010,0b10010,0b10010,0b10010,0b11110],
  '1': [0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
  '2': [0b11110,0b00010,0b00010,0b11110,0b10000,0b10000,0b11110],
  '3': [0b11110,0b00010,0b00010,0b01110,0b00010,0b00010,0b11110],
  '4': [0b10010,0b10010,0b10010,0b11110,0b00010,0b00010,0b00010],
  '5': [0b11110,0b10000,0b10000,0b11110,0b00010,0b00010,0b11110],
  '6': [0b11110,0b10000,0b10000,0b11110,0b10010,0b10010,0b11110],
  '7': [0b11110,0b00010,0b00100,0b01000,0b01000,0b01000,0b01000],
  '8': [0b11110,0b10010,0b10010,0b11110,0b10010,0b10010,0b11110],
  '9': [0b11110,0b10010,0b10010,0b11110,0b00010,0b00010,0b11110],
  'W': [0b10001,0b10001,0b10001,0b10101,0b10101,0b10101,0b01010],
  'V': [0b10001,0b10001,0b10001,0b10001,0b01010,0b01010,0b00100],
  'A': [0b01100,0b10010,0b10010,0b11110,0b10010,0b10010,0b10010],
  'C': [0b01110,0b10000,0b10000,0b10000,0b10000,0b10000,0b01110],
  'k': [0b10000,0b10010,0b10100,0b11000,0b10100,0b10010,0b10010],
  'h': [0b10000,0b10000,0b10000,0b11100,0b10010,0b10010,0b10010],
  '%': [0b11001,0b11010,0b00100,0b00100,0b01000,0b01011,0b10011],
  '°': [0b01100,0b10010,0b01100,0b00000,0b00000,0b00000,0b00000],
  '-': [0b00000,0b00000,0b00000,0b11110,0b00000,0b00000,0b00000],
  '.': [0b00000,0b00000,0b00000,0b00000,0b00000,0b01100,0b01100],
  '/': [0b00010,0b00010,0b00100,0b00100,0b01000,0b01000,0b10000],
};

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  DOT-MATRIX RENDERERS                                                      *
 * ═══════════════════════════════════════════════════════════════════════════ */

function _dotCircles(str, color, r, gap, maxChars) {
  const step = r*2+gap, colW = 5*step, charGap = gap*2;
  const chars = str.slice(0, maxChars||4).split('');
  const onA = [], offA = [];
  for (let i = 0, len = chars.length; i < len; i++) {
    const rows = DIGITS[chars[i]];
    if (!rows) continue;
    const xo = i*(colW+charGap);
    for (let ry = 0; ry < 7; ry++) {
      const row = rows[ry];
      for (let c = 0; c < 5; c++) {
        const ci = `<circle cx="${(xo+c*step+r).toFixed(2)}" cy="${(ry*step+r).toFixed(2)}" r="${r}"/>`;
        ((row>>(4-c))&1 ? onA : offA).push(ci);
      }
    }
  }
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offA.join('')}</g><g fill="${color}">${onA.join('')}</g>`,
    chars,
  };
}

function _faceDots(valStr, color, entityId, slab) {
  const r = 0.85, gap = 0.4, step = r*2+gap;
  const { circles, chars } = _dotCircles(valStr, color, r, gap, 7);
  const colW = 5*step, charGap = gap*2;
  const dw = chars.length*colW + Math.max(0, chars.length-1)*charGap;
  const dh = 7*step;
  // Slab 0 = unité principale, slab k>=1 = module k
  const h0 = slab === 0 ? CAPH : CAPH + UNITH + (slab-1)*MODH;
  const fH = slab === 0 ? UNITH : MODH;
  const fW = (P_W - 2*P_R)*UX;              // largeur écran de la zone plate avant
  const sc = Math.min(fW*0.62/dw, fH*0.80/dh);
  // Centre géométrique de la zone plate de la face avant du slab.
  // matrix(sc, sc*SLF, 0, sc, tx, ty) plaque les dots dans le plan avant :
  //   screen_x = tx + sc*lx  →  tx = pcx - sc*dw/2
  //   screen_y = ty + sc*SLF*lx + sc*ly  →  ty = pcy - sc*SLF*(dw/2) - sc*dh/2
  const pcx = (P_W/2)*UX + OX;
  const pcy = (P_W/2)*UY + OY + h0 + fH/2;
  const tx = pcx - sc*dw/2;
  const ty = pcy - sc*SLF*(dw/2) - sc*dh/2;
  const cls = entityId ? ` class="dp" data-entity="${entityId}"` : '';
  const sty = entityId ? 'cursor:pointer;' : 'pointer-events:none;';
  return `<g${cls} transform="matrix(${sc.toFixed(4)},${(sc*SLF).toFixed(4)},0,${sc.toFixed(4)},${tx.toFixed(2)},${ty.toFixed(2)})" opacity="0.90" style="${sty}">${circles}</g>`;
}

const PANEL_MAX_W = 80;

function _panelDots(valStr, color) {
  const r = 1.8, gap = 0.8, step = r*2+gap;
  const colW = 5*step, charGap = gap*2, pad = 5;
  const chars = valStr.slice(0,4).split('');
  const rawW = chars.length*colW + Math.max(0, chars.length-1)*charGap;
  const rawH = 7*step;
  const sc = (rawW+pad*2) > PANEL_MAX_W ? (PANEL_MAX_W-pad*2)/rawW : 1;
  const bW = (rawW*sc+pad*2).toFixed(1);
  const bH = (rawH*sc+pad*2).toFixed(1);
  const rsc = (r*sc).toFixed(1);
  const onA = [], offA = [];
  for (let i = 0, len = chars.length; i < len; i++) {
    const rows = DIGITS[chars[i]];
    if (!rows) continue;
    const xo = (i*(colW+charGap))*sc;
    for (let ry = 0; ry < 7; ry++) {
      const row = rows[ry];
      for (let c = 0; c < 5; c++) {
        const ci = `<circle cx="${(pad+xo+(c*step+r)*sc).toFixed(1)}" cy="${(pad+(ry*step+r)*sc).toFixed(1)}" r="${rsc}"/>`;
        ((row>>(4-c))&1 ? onA : offA).push(ci);
      }
    }
  }
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offA.join('')}</g><g fill="${color}">${onA.join('')}</g>`,
    bW, bH,
  };
}

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

/* ── Sleepy idle — outline 11×11 + Z cascade + eye blink (SMIL) ─────────── */

// Face base (sans les yeux — rows 0-3 et 6-10)
const FACE_BASE = [
  0b00111111100,  // r0  ··███████··
  0b01000000010,  // r1  ·█·······█·
  0b10000000001,  // r2  █·········█
  0b10000000001,  // r3  █·········█
  // r4-r5 : yeux (gérés séparément)
  0b10000000001,  // r6  █·········█
  0b10000000001,  // r7  █·········█
  0b10011110001,  // r8  █··████···█  barre bouche
  0b01000000010,  // r9  ·█·······█·
  0b00111111100,  // r10 ··███████··
];
const FACE_BASE_ROWS = [0,1,2,3,6,7,8,9,10]; // index réels dans la grille 11

// Trois états d'yeux (rows 4-5) — 3px par œil, gap col 5, outline col 0 & 10
// Left eye : cols 2,3,4  ·  Right eye : cols 6,7,8
// Squint \/ : pixel central monte en r4, côtés restent en r5
// col 0 & col 10 EXCLUS des bitmaps yeux (toujours dans baseOn)
const EYE_MASK = 0b01111111110;
const EYES = {
  open:  [0b10010001001 & EYE_MASK, 0b10101010101 & EYE_MASK],
  half:  [0b10000000001 & EYE_MASK, 0b10111011101 & EYE_MASK],
  close: [0b10111011101 & EYE_MASK, 0b10111011101 & EYE_MASK],
};
// Yeux grands ouverts pour etat FULL (pas de blink)
const EYES_FULL  = [0b10110001101 & EYE_MASK, 0b10110001101 & EYE_MASK];
const MOUTH_FULL = [0b10000000001, 0b10100000101, 0b10011111001];

const Z4_BMP = [0b1111, 0b0011, 0b0110, 0b1100, 0b1111]; // grand Z 4×5
const z3_BMP = [0b111,  0b010,  0b111];                   // petit z 3×3

function _zDotsSVG(bmp, nC, ox, oy, dr) {
  let s = '';
  bmp.forEach((row, ry) => {
    for (let c = 0; c < nC; c++) {
      if ((row >> (nC-1-c)) & 1)
        s += `<circle cx="${(ox + c*(dr*2+0.8) + dr).toFixed(1)}" cy="${(oy + ry*(dr*2+0.8) + dr).toFixed(1)}" r="${dr.toFixed(2)}"/>`;
    }
  });
  return s;
}

function _eyeDots(eyeRows, ry0, nC, step, sc, pad, r) {
  let dots = '';
  eyeRows.forEach((row, ry) => {
    for (let c = 0; c < nC; c++) {
      if ((row >> (nC-1-c)) & 1)
        dots += `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+(ry0+ry)*step*sc+r*sc).toFixed(1)}" r="${(r*sc).toFixed(2)}"/>`;
    }
  });
  return dots;
}

/**
 * Sleepy idle panel: face outline + 3-Z cascade + eye blink, tout en SMIL.
 * @param {string} accent - couleur accent courante (jaune ou cyan cyberpunk)
 */
function _sleepyDots(accent) {
  const r = 1.8, gap = 0.8, step = r*2+gap, pad = 5;
  const nC = 11;
  const rawW = (nC-1)*step + r*2, rawH = (nC-1)*step + r*2; // 11×11
  const sc  = (rawW+pad*2) > PANEL_MAX_W ? (PANEL_MAX_W-pad*2)/rawW : 1;
  const bW  = (rawW*sc + pad*2).toFixed(1);
  const bH  = (rawH*sc + pad*2).toFixed(1);
  const rsc = (r*sc).toFixed(2);

  // ── Face base dots (sans yeux) ────────────────────────────────────────
  let baseOn = '', baseOff = '';
  FACE_BASE.forEach((row, idx) => {
    const ry = FACE_BASE_ROWS[idx];
    for (let c = 0; c < nC; c++) {
      const ci = `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+ry*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
      if ((row >> (nC-1-c)) & 1) baseOn += ci; else baseOff += ci;
    }
  });
  // Rows 4-5 : col 0 & col 10 = outline toujours visible → baseOn
  //             cols 1-9 = off dots (fond)
  for (let ry = 4; ry <= 5; ry++) {
    for (let c = 0; c < nC; c++) {
      const ci = `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+ry*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
      if (c === 0 || c === 10) baseOn += ci; else baseOff += ci;
    }
  }

  // ── Eye state dots ────────────────────────────────────────────────────
  const eyeOpen  = _eyeDots(EYES.open,  4, nC, step, sc, pad, r);
  const eyeHalf  = _eyeDots(EYES.half,  4, nC, step, sc, pad, r);
  const eyeClose = _eyeDots(EYES.close, 4, nC, step, sc, pad, r);

  // Blink SMIL (cycle 5s) :
  // 0→55% ouvert · 55→65% → half · 65→75% fermé · 75→85% → half · 85→100% ouvert
  const kT  = '0;0.55;0.62;0.67;0.73;0.80;0.87;1';
  const anim = (vals) =>
    `<animate attributeName="opacity" values="${vals}" keyTimes="${kT}" dur="5s" repeatCount="indefinite"/>`;

  const eyeOpenG  = `<g fill="${accent}">${anim('1;1;0;0;0;0;1;1')}${eyeOpen}</g>`;
  const eyeHalfG  = `<g fill="${accent}">${anim('0;0;1;0;0;1;0;0')}${eyeHalf}</g>`;
  const eyeCloseG = `<g fill="${accent}">${anim('0;0;0;1;1;0;0;0')}${eyeClose}</g>`;

  // ── Z cascade ─────────────────────────────────────────────────────────
  const oyBase = pad + 2*step*sc;
  const rise   = 26;
  const bigZ = _zDotsSVG(Z4_BMP, 4, pad + 6.5*step*sc, oyBase, 1.0);
  const medZ = _zDotsSVG(z3_BMP, 3, pad + 7.8*step*sc, oyBase, 0.75);
  const smlZ = _zDotsSVG(z3_BMP, 3, pad + 7.0*step*sc, oyBase, 0.55);

  const zGroup = (dots, delay, alpha) =>
    `<g fill="${accent}">` +
      `<animateTransform attributeName="transform" type="translate"` +
        ` from="0 0" to="0 -${rise}" dur="3s" begin="${delay}" repeatCount="indefinite" calcMode="ease-in"/>` +
      `<animate attributeName="opacity" values="0;${alpha};${alpha};0" keyTimes="0;0.12;0.65;1"` +
        ` dur="3s" begin="${delay}" repeatCount="indefinite"/>` +
      dots +
    `</g>`;

  // ── Assemblage ────────────────────────────────────────────────────────
  const circles =
    `<g fill="rgba(255,255,255,.04)">${baseOff}</g>` +
    // Face base — respiration douce
    `<g fill="${accent}">` +
      `<animate attributeName="opacity" values="0.55;1;0.55" keyTimes="0;0.5;1" dur="3.5s" repeatCount="indefinite"/>` +
      baseOn +
    `</g>` +
    // Yeux animés (pas de breathing sur les yeux pour que le blink soit net)
    eyeOpenG + eyeHalfG + eyeCloseG +
    // Z cascade
    zGroup(bigZ, '0s',  0.88) +
    zGroup(medZ, '-1s', 0.72) +
    zGroup(smlZ, '-2s', 0.55);

  return { circles, bW, bH };
}

/**
 * SOC FULL panel (>= soc_full_threshold, default 97%).
 * Cyberpunk: fill cyan + glitch RGB. Standard: fill jaune + sourire.
 */
function _fullDots(accent, cyberpunk) {
  const r = 1.8, gap = 0.8, step = r*2+gap, pad = 5;
  const nC = 11;
  const rawW = (nC-1)*step + r*2, rawH = (nC-1)*step + r*2;
  const sc  = (rawW+pad*2) > PANEL_MAX_W ? (PANEL_MAX_W-pad*2)/rawW : 1;
  const bW  = (rawW*sc + pad*2).toFixed(1);
  const bH  = (rawH*sc + pad*2).toFixed(1);
  const rsc = (r*sc).toFixed(2);

  // Face base
  let baseOn = '', baseOff = '';
  FACE_BASE.forEach((row, idx) => {
    const ry = FACE_BASE_ROWS[idx];
    for (let c = 0; c < nC; c++) {
      const ci = `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+ry*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
      if ((row >> (nC-1-c)) & 1) baseOn += ci; else baseOff += ci;
    }
  });
  // Rows 4-5 : col 0 & 10 = outline permanent
  for (let ry = 4; ry <= 5; ry++) {
    for (let c = 0; c < nC; c++) {
      const ci = `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+ry*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
      if (c === 0 || c === 10) baseOn += ci; else baseOff += ci;
    }
  }

  // Yeux grands ouverts
  let eyeOn = '';
  EYES_FULL.forEach((row, i) => {
    for (let c = 0; c < nC; c++) {
      if ((row >> (nC-1-c)) & 1)
        eyeOn += `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+(4+i)*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
    }
  });

  // Bouche sourire large (rows 6-8)
  let mouthOn = '';
  MOUTH_FULL.forEach((row, i) => {
    for (let c = 0; c < nC; c++) {
      if ((row >> (nC-1-c)) & 1)
        mouthOn += `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+(6+i)*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
    }
  });

  const allDots = baseOn + eyeOn + mouthOn;
  const faceH   = (nC-1)*step*sc + r*sc*2;
  const fillCol = cyberpunk ? CP_ACCENT : accent;
  const uid     = 'sbc_full_fill';

  const glitch = cyberpunk
    ? `<g fill="${CP_PRIMARY}" opacity="0">` +
        `<animate attributeName="opacity" values="0;0;0.55;0.55;0" keyTimes="0;0.88;0.90;0.97;1" dur="3s" repeatCount="indefinite"/>` +
        `<animateTransform attributeName="transform" type="translate" values="3,0" additive="sum"/>` +
        allDots + `</g>` +
      `<g fill="${CP_CHARGE}" opacity="0">` +
        `<animate attributeName="opacity" values="0;0;0.45;0.45;0" keyTimes="0;0.90;0.92;0.97;1" dur="3s" repeatCount="indefinite"/>` +
        `<animateTransform attributeName="transform" type="translate" values="-3,0" additive="sum"/>` +
        allDots + `</g>`
    : '';

  const circles =
    `<defs><clipPath id="${uid}">` +
      `<rect x="${pad}" y="${pad}" width="${(nC*step*sc).toFixed(1)}" height="${faceH.toFixed(1)}"/>` +
    `</clipPath></defs>` +
    `<rect x="${pad}" y="${(pad+faceH).toFixed(1)}" width="${(nC*step*sc).toFixed(1)}" height="${faceH.toFixed(1)}"` +
      ` fill="${fillCol}" opacity="0.12" clip-path="url(#${uid})">` +
      `<animate attributeName="y" from="${(pad+faceH).toFixed(1)}" to="${pad}" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>` +
    `</rect>` +
    `<g fill="rgba(255,255,255,.04)">${baseOff}</g>` +
    `<g fill="${fillCol}">${allDots}</g>` +
    glitch;

  return { circles, bW, bH };
}

function _arrowDots(isCharging, color, accent) {
  if (!color) return _sleepyDots(accent || DEF_ACCENT);

  const rows = isCharging ? ARROW_DOWN : ARROW_UP;
  const r = 1.8, gap = 0.8, step = r*2+gap, pad = 5;
  const rawW = (ARROW_COLS-1)*step + r*2;
  const rawH = (ARROW_ROWS-1)*step + r*2;
  const sc = (rawW+pad*2) > PANEL_MAX_W ? (PANEL_MAX_W-pad*2)/rawW : 1;
  const bW = (rawW*sc+pad*2).toFixed(1);
  const bH = (rawH*sc+pad*2).toFixed(1);
  const rsc = (r*sc).toFixed(1);
  const onA = [], offA = [];
  for (let ry = 0; ry < ARROW_ROWS; ry++) {
    const row = rows[ry];
    for (let c = 0; c < ARROW_COLS; c++) {
      const ci = `<circle cx="${(pad+c*step*sc+r*sc).toFixed(1)}" cy="${(pad+ry*step*sc+r*sc).toFixed(1)}" r="${rsc}"/>`;
      if ((row>>(ARROW_COLS-1-c))&1) onA.push(ci); else offA.push(ci);
    }
  }
  return {
    circles: `<g fill="rgba(255,255,255,.06)">${offA.join('')}</g><g fill="${color}">${onA.join('')}</g>`,
    bW, bH,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  MEMOISED STATIC SVG LAYERS                                                *
 * ═══════════════════════════════════════════════════════════════════════════ */

const _batCache = new Map();

/* ── Prise jaune Schuko (face avant du capot, côté droit) ─────────────────
 * Désactivée pour l'instant — à réactiver/affiner plus tard.
 * Positions x en unités modèle, hauteurs en unités écran (× GS).
 *
 * function _capSocket() {
 *   const plH = Math.max(2.5, CAPH - 2.5*GS*2);        // hauteur plaque (écran)
 *   const py  = (CAPH - plH)/2;
 *   const rc  = Math.min(4.5*GS, plH/2 - 0.4);          // rayon prise
 *   const x0  = P_W - 62, x1 = P_W - 34, xc = P_W - 48; // unités modèle
 *   const sx  = x => _scrX(x, 0), sy = x => _scrY(x, 0);
 *   return '<polygon points="' +
 *       _fx(sx(x0))+','+_fx(sy(x0)+py)+' '+_fx(sx(x1))+','+_fx(sy(x1)+py)+' ' +
 *       _fx(sx(x1))+','+_fx(sy(x1)+py+plH)+' '+_fx(sx(x0))+','+_fx(sy(x0)+py+plH) +
 *     '" fill="#f2dc00"/>' +
 *     '<circle cx="'+_fx(sx(xc))+'" cy="'+_fx(sy(xc)+py+plH/2)+'" r="'+_fx(rc)+'"' +
 *       ' fill="#e3cd00" stroke="#3a3a3e" stroke-width="0.35"/>' +
 *     '<circle cx="'+_fx(sx(xc)-rc*0.47)+'" cy="'+_fx(sy(xc)+py+plH/2)+'" r="0.3" fill="#3a3a3e"/>' +
 *     '<circle cx="'+_fx(sx(xc)+rc*0.47)+'" cy="'+_fx(sy(xc)+py+plH/2)+'" r="0.3" fill="#3a3a3e"/>';
 * }
 */

/* ── Plaque cache-prise (façade du capot, côté droit) ─────────────────────
 * Conforme à la photo officielle : plaque pleine hauteur du capot avec
 * languette jaune sur son bord gauche. La prise jaune _capSocket() reste
 * dispo en commentaire ci-dessus pour le jour où le volet s'ouvrira. */
const PLATE_X0 = P_W - 118, PLATE_X1 = P_W - 28;   // unités modèle
function _capCover() {
  const py = 0.6, plH = CAPH - 1.2;
  const sx = x => _scrX(x, 0), sy = x => _scrY(x, 0);
  const quad = (x0, x1, y0, h) =>
    _fx(sx(x0))+','+_fx(sy(x0)+y0)+' '+_fx(sx(x1))+','+_fx(sy(x1)+y0)+' ' +
    _fx(sx(x1))+','+_fx(sy(x1)+y0+h)+' '+_fx(sx(x0))+','+_fx(sy(x0)+y0+h);
  return '<polygon points="'+quad(PLATE_X0, PLATE_X1, py, plH)+'" fill="#b6b6bc" stroke="#97979d" stroke-width="0.35" stroke-linejoin="round"/>' +
         '<polygon points="'+quad(PLATE_X0, PLATE_X0+6, py+0.7, plH*0.6)+'" fill="#f2dc00"/>';
}

/* ── GLITCH le chat — mascotte pixel-art posée DANS l'écran du dessus ────────
 * viewBox 51×46, grille 7×5. Découpé en HEAD (visage, mobile) + PAWS (pattes,
 * fixes) + LID (paupière pour le wink). Couleur via currentColor (re-teintable).
 * Posé via la matrice TM (plan supérieur) → projeté iso à plat sur le capot,
 * tourné de 180° (regarde vers l'avant). Animations CSS pures (rafales) : aucun
 * timer JS → rien à nettoyer. Le clip au-dessus des pattes cache ce qui descend
 * au nod ; le tout est re-clippé à l'écran par l'appelant. */
const GC_VB = 51, GC_VBH = 46;
const GC_HEAD = 'M10.268 10.207h5.455v5.455h-5.455ZM32.086 10.207h5.455v5.455h-5.455ZM10.268 15.662h5.455v5.455h-5.455ZM15.722 15.662h5.455v5.455h-5.455ZM26.631 15.662h5.455v5.455h-5.455ZM32.086 15.662h5.455v5.455h-5.455ZM10.268 21.116h5.455v5.455h-5.455ZM15.722 21.116h5.455v5.455h-5.455ZM21.177 21.116h5.455v5.455h-5.455ZM26.631 21.116h5.455v5.455h-5.455ZM32.086 21.116h5.455v5.455h-5.455ZM10.268 26.571h5.455v5.455h-5.455ZM21.177 26.571h5.455v5.455h-5.455ZM32.086 26.571h5.455v5.455h-5.455Z';
const GC_PAWS = 'M4.813 32.025h5.455v5.455h-5.455ZM10.268 32.025h5.455v5.455h-5.455ZM15.722 32.025h5.455v5.455h-5.455ZM26.631 32.025h5.455v5.455h-5.455ZM32.086 32.025h5.455v5.455h-5.455ZM37.540 32.025h5.455v5.455h-5.455Z';
const GC_LID  = 'M26.631 26.571h5.455v5.455h-5.455Z';

/* Markup interne de GLITCH (sans transform de placement). col = couleur plasma. */
function _glitchArt(col) {
  return `<g class="sbc-cat" style="color:${col}" filter="url(#sbcCatGlow)" shape-rendering="crispEdges">` +
    `<clipPath id="sbcCatClip"><rect x="-2" y="-2" width="55" height="34.405"/></clipPath>` +
    `<path fill="currentColor" d="${GC_PAWS}"/>` +
    `<g clip-path="url(#sbcCatClip)"><g class="sbc-cat-head">` +
      `<path fill="currentColor" d="${GC_HEAD}"/>` +
      `<path class="sbc-cat-gr" fill="#ff2d6b" d="${GC_HEAD}"/>` +
      `<path class="sbc-cat-gc" fill="#00e5ff" d="${GC_HEAD}"/>` +
      `<path class="sbc-cat-lid" fill="currentColor" d="${GC_LID}"/>` +
    `</g></g>` +
  `</g>`;
}

/* ── SCREEN ART SLOT ────────────────────────────────────────────────────────
 * Pose GLITCH centré DANS l'écran du dessus (carré arrondi sqX/sqY/sqS), à plat
 * dans le plan supérieur : appelé À L'INTÉRIEUR du groupe `<g transform="TM">`,
 * donc déjà projeté iso. Centre + scale (fit) + rotation 180° autour du centre
 * du chat. Le résultat est clippé à l'écran par l'appelant (scrClip).
 * @param {number} sqX,sqY,sqS  géométrie de l'écran (unités modèle)
 * @param {string} col          couleur plasma de la mascotte
 * @param {number} fit          fraction de l'écran occupée (défaut 0.82)
 * @param {number} rot          rotation en degrés (défaut 180) */
function _screenArtSlot(sqX, sqY, sqS, col, fit = 0.82, rot = 180) {
  const cx = sqX + sqS/2, cy = sqY + sqS/2;
  const sc = (sqS*fit)/GC_VB;
  const tx = cx - sc*GC_VB/2, ty = cy - sc*GC_VBH/2;
  const spin = `rotate(${rot}, ${(GC_VB/2).toFixed(3)}, ${(GC_VBH/2).toFixed(3)})`;
  return `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${sc.toFixed(4)})">` +
         `<g transform="${spin}">${_glitchArt(col)}</g></g>`;
}

/* v12 — pile complète mémoïsée : socle + modules + corps + capot + face sup
 * + détails. Tout est dérivé de la silhouette SIL_M / SIL_B. */
function _stackContent(m, withHandle, withGrille, catCol) {
  const k = `st${m}_${withHandle?1:0}_${withGrille?1:0}_${catCol||0}`;
  if (_batCache.has(k)) return _batCache.get(k);

  const bodyBot = CAPH + UNITH + m*MODH;
  const Htot = bodyBot + BASEH;
  let s = _stackDefs();

  /* socle (contour en retrait) */
  s += `<path d="${_side(SIL_B, bodyBot, Htot)}" fill="#7a7a80"/>`;

  /* slabs modules puis corps puis capot — flanc + overlay mat vertical */
  for (let i = 0; i < m; i++) {
    const h0 = CAPH + UNITH + i*MODH;
    s += `<path d="${_side(SIL_M, h0, h0+MODH)}" fill="url(#gBodySbc)"/>` +
         `<path d="${_side(SIL_M, h0, h0+MODH)}" fill="url(#gVSbc)"/>`;
  }
  s += `<path d="${_side(SIL_M, CAPH, CAPH+UNITH)}" fill="url(#gBodySbc)"/>` +
       `<path d="${_side(SIL_M, CAPH, CAPH+UNITH)}" fill="url(#gVSbc)"/>`;
  s += `<path d="${_side(SIL_M, 0, CAPH)}" fill="url(#gCapSbc)"/>` +
       `<path d="${_side(SIL_M, 0, CAPH)}" fill="url(#gVSbc)"/>`;

  /* face du dessus */
  s += `<path d="${_loop(SIL_M, 0)}" fill="url(#gTopSbc)" stroke="#bfbfc5" stroke-width="0.45" stroke-linejoin="round"/>`;

  /* détails du dessus — plan supérieur projeté en affine (le rect rx devient
   * automatiquement un rectangle arrondi iso parfait) */
  const TM = `matrix(${UX.toFixed(4)},${UY.toFixed(4)},${VX.toFixed(4)},${VY.toFixed(4)},${OX.toFixed(2)},${OY.toFixed(2)})`;
  const tps = 1/Math.sqrt(Math.abs(UX*VY - VX*UY));   // compense le scale du stroke
  const sqS = 135, sqX = 35, sqY = (P_D - sqS)/2;     // carré arrondi (écran du dessus)
  if (catCol) {
    /* écran ALLUMÉ + GLITCH le chat clippé dedans (mascotte). Filtre glow plasma
     * + clip écran définis ici (mémoïsé avec le reste du capot). */
    s += `<defs>` +
      `<filter id="sbcCatGlow" x="-60%" y="-60%" width="220%" height="220%">` +
        `<feDropShadow dx="0" dy="0" stdDeviation="0.9" flood-color="currentColor" flood-opacity="0.95"/>` +
        `<feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="currentColor" flood-opacity="0.55"/>` +
      `</filter></defs>`;
    s += `<g transform="${TM}">` +
      `<rect x="${sqX-1.5}" y="${_fx(sqY-1.5)}" width="${sqS+3}" height="${sqS+3}" rx="30" fill="#9a9aa1"/>` +
      `<rect x="${sqX}" y="${_fx(sqY)}" width="${sqS}" height="${sqS}" rx="28" fill="#0a1016" stroke="#2b3340" stroke-width="${(0.6*tps).toFixed(2)}"/>` +
      `<clipPath id="sbcScrClip"><rect x="${sqX}" y="${_fx(sqY)}" width="${sqS}" height="${sqS}" rx="28"/></clipPath>` +
      `<g clip-path="url(#sbcScrClip)">${_screenArtSlot(sqX, sqY, sqS, catCol)}</g>` +
      `<rect x="${sqX+3}" y="${_fx(sqY+3)}" width="${sqS-6}" height="${sqS-6}" rx="25" fill="none" stroke="#1c2530" stroke-width="${(0.3*tps).toFixed(2)}"/>` +
    `</g>`;
  } else {
    s += `<g transform="${TM}">` +
      `<rect x="${sqX}" y="${_fx(sqY)}" width="${sqS}" height="${sqS}" rx="28" fill="#c9c9cf" stroke="#b4b4ba" stroke-width="${(0.3*tps).toFixed(2)}"/>` +
      `<rect x="${sqX}" y="${_fx(sqY)}" width="${sqS}" height="${sqS}" rx="28" fill="none" stroke="#ffffff" stroke-width="${(0.25*tps).toFixed(2)}" opacity="0.5" transform="translate(2,2)"/>` +
      `<circle cx="${sqX+27}" cy="${_fx(sqY+sqS-23)}" r="6" fill="#b9b9bf"/>` +
    `</g>`;
  }

  /* cache de la prise (volet en relief) sur la facade du capot, cote droit */
  s += _capCover();

  /* joints inter-slabs : trait sombre + filet lumineux */
  const js = [CAPH];
  for (let i = 0; i <= m; i++) js.push(CAPH + UNITH + i*MODH);
  for (const h of js) {
    s += `<path d="${_seam(SIL_M, h)}" fill="none" stroke="${SEP_C}" stroke-width="0.55" stroke-linejoin="round" opacity="0.85"/>`;
    s += `<path d="${_seam(SIL_M, h+0.7)}" fill="none" stroke="#ffffff" stroke-width="0.35" stroke-linejoin="round" opacity="0.3"/>`;
  }

  /* arête silhouette + liseré du bord supérieur */
  s += `<path d="${_side(SIL_M, 0, bodyBot)}" fill="none" stroke="${EDGE_C}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += `<path d="${_seam(SIL_M, 0.5)}" fill="none" stroke="#ffffff" stroke-width="0.35" opacity="0.5"/>`;

  /* ribs verticaux sur la face latérale droite — pleine hauteur des 255 de
   * chaque module (le capot reste nu), conformes à la photo de l'install */
  if (withGrille) {
    const slabs = [[CAPH, UNITH]];
    for (let i = 0; i < m; i++) slabs.push([CAPH+UNITH+i*MODH, MODH]);
    for (let y = 34; y <= P_D-34; y += 8) {
      const rx = P_W*UX + y*VX + OX, ry = P_W*UY + y*VY + OY;
      for (const [h0, sh] of slabs) {
        s += `<line x1="${_fx(rx)}" y1="${_fx(ry+h0+0.9)}" x2="${_fx(rx)}" y2="${_fx(ry+h0+sh-0.9)}" stroke="#9a9aa0" stroke-width="0.3" opacity="0.8"/>`;
        s += `<line x1="${_fx(rx+0.25)}" y1="${_fx(ry+h0+0.9)}" x2="${_fx(rx+0.25)}" y2="${_fx(ry+h0+sh-0.9)}" stroke="#ffffff" stroke-width="0.15" opacity="0.35"/>`;
      }
    }
  }

  /* poignée stadium sur la face droite (corps + chaque module) */
  if (withHandle && P_D - 2*P_R >= 26) {
    const hl = Math.min(22, (P_D-2*P_R)/2 - 2);     // demi-longueur (modèle)
    const hh = 20*GS*P_KH;                           // hauteur écran (~20 mm)
    const hh2 = hh*0.65;
    const RF = `matrix(${VX.toFixed(4)},${VY.toFixed(4)},0,1,${(P_W*UX+OX).toFixed(2)},${(P_W*UY+OY).toFixed(2)})`;
    const slabs = [[CAPH, UNITH]];
    for (let i = 0; i < m; i++) slabs.push([CAPH+UNITH+i*MODH, MODH]);
    for (const [s0, sh] of slabs) {
      const hm = s0 + sh*0.40;          // poignée au tiers haut, comme en vrai
      s += `<g transform="${RF}">` +
        `<rect x="${_fx(P_D/2-hl)}" y="${_fx(hm-hh/2)}" width="${_fx(2*hl)}" height="${_fx(hh)}" rx="${_fx((hh/2)/VX)}" ry="${_fx(hh/2)}" fill="#88888e"/>` +
        `<rect x="${_fx(P_D/2-hl+2)}" y="${_fx(hm-hh2/2)}" width="${_fx(2*hl-4)}" height="${_fx(hh2)}" rx="${_fx((hh2/2)/VX)}" ry="${_fx(hh2/2)}" fill="#5c5c62"/>` +
      `</g>`;
    }
  }

  /* prise jaune : s += _capSocket();  ← à réactiver plus tard */

  _batCache.set(k, s);
  return s;
}

/* ── GLOW v14 — joint inter-module ÉLECTRIQUE ──────────────────────────────
 * La comète qui circulait est abandonnée. Le joint est désormais un LISERÉ NÉON
 * ALLUMÉ EN PERMANENCE (base statique, mémoïsée dans _batCache), par-dessus
 * lequel une couche animée (crépitement réparti + sparks zigzag) est redessinée
 * en RAF par la card (_drawElec). Aucun filtre SVG ni drop-shadow (iOS-safe) :
 * bloom par superposition de strokes. gC1 = couleur large/spill, gC2 = cœur. */
function _glowContent(modules, gC1, gC2, isCharging) {
  if (modules <= 0) return '';
  const gid = 'gsp'+(isCharging?1:0);
  let s = '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="'+gC1+'" stop-opacity="0.22"/>' +
    '<stop offset="1" stop-color="'+gC1+'" stop-opacity="0"/>' +
    '</linearGradient></defs>';
  for (let i = 0; i < modules; i++) {
    const h = CAPH + UNITH + i*MODH;
    // spill qui déborde sur le module du dessous + base allumée (halo + cœur + respiration)
    s += '<path d="'+_side(SIL_M, h, h+7)+'" fill="url(#'+gid+')"/>';
    s += '<path d="'+_seam(SIL_M, h)+'" fill="none" stroke="'+gC1+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.14"/>';
    s += '<path class="led-seg" d="'+_seam(SIL_M, h)+'" fill="none" stroke="'+gC2+'" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>';
  }
  return s;
}

/* ── Couche ÉLECTRIQUE animée (crépitement + sparks) ───────────────────────
 * Validée en preview. Redessinée à chaque frame par _drawElec (paths variables
 * → ne peut PAS être mémoïsée). Coupée en idle / low-power / reduced-motion.   */
function _sbcHash(x){ const n = Math.sin(x*12.9898)*43758.5453; return n - Math.floor(n); }
// borne une valeur de config numérique, avec défaut si absente/invalide
function clampNum(v, lo, hi, def){ const n = parseFloat(v); return isNaN(n) ? def : Math.min(hi, Math.max(lo, n)); }

// points équidistants le long de TOUT le joint + normale + abscisse curviligne
function _seamSamples(h, step) {
  const a = SIL_M.near.map(i => [SIL_M.pr[i][0], SIL_M.pr[i][1]+h]);
  const out = [{ x:a[0][0], y:a[0][1], s:0, nx:0, ny:0 }];
  let acc = 0;
  for (let k = 1; k < a.length; k++) {
    const x1=a[k-1][0], y1=a[k-1][1], x2=a[k][0], y2=a[k][1];
    const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1e-6;
    const nx=-dy/len, ny=dx/len;
    const seg = Math.max(1, Math.round(len/step));
    for (let j=1;j<=seg;j++){ const t=j/seg; acc+=len/seg; out.push({ x:x1+dx*t, y:y1+dy*t, s:acc, nx, ny }); }
  }
  return out;
}
// petit zigzag LOCAL accroché au liseré autour du point ic
function _localBolt(samp, ic, span, amp, seed) {
  const i0=Math.max(0,ic-span), i1=Math.min(samp.length-1,ic+span);
  let d='';
  for (let i=i0;i<=i1;i++){
    const p=samp[i];
    const edge = 1 - Math.abs(i-ic)/(span+1);     // 0 aux bouts → 1 au centre
    const off = (_sbcHash(i*3.7+seed)-0.5)*2*amp*edge;
    d += (i===i0?'M':'L') + (p.x+p.nx*off).toFixed(2) + ' ' + (p.y+p.ny*off).toFixed(2);
  }
  return d;
}
// génère le SVG d'UNE frame de l'effet électrique sur tous les joints
function _elecLayer(modules, gc1, gc2, now, crackle, rate, ampMax) {
  let s = '';
  const flickT = Math.floor(now/(crackle*1000));
  const STEP = 2.2;
  for (let i=0;i<modules;i++){
    const h = CAPH + UNITH + i*MODH;
    const samp = _seamSamples(h, STEP);
    const total = samp[samp.length-1].s;
    // 1) crépitement réparti (surbrillance par tronçons, PAR-DESSUS la base)
    const CHUNK = 11;
    for (let a=0;a<samp.length-1;a+=CHUNK){
      const b=Math.min(samp.length-1,a+CHUNK), mid=(a+b)/2;
      const r=_sbcHash(flickT*1.7 + i*53.1 + Math.floor(mid));
      if (r<0.42) continue;
      const op=0.45+r*0.55, w=0.6+r*0.8;
      let d='M'+samp[a].x.toFixed(2)+' '+samp[a].y.toFixed(2);
      for (let q=a+1;q<=b;q++) d+='L'+samp[q].x.toFixed(2)+' '+samp[q].y.toFixed(2);
      s += '<path d="'+d+'" fill="none" stroke="'+gc1+'" stroke-width="'+(w*3).toFixed(2)+'" stroke-linecap="round" opacity="'+(op*0.16).toFixed(2)+'"/>';
      s += '<path d="'+d+'" fill="none" stroke="'+gc1+'" stroke-width="'+w.toFixed(2)+'" stroke-linecap="round" opacity="'+op.toFixed(2)+'"/>';
    }
    // 2) sparks zigzag répartis sur toute la longueur
    const period = 1000/rate;
    const nSlots = Math.max(2, Math.round(total/26));
    for (let sl=0;sl<nSlots;sl++){
      const slotSeed=i*97.3+sl*13.1;
      const phase=(now + _sbcHash(slotSeed)*period*4) % period;
      if (phase>=200) continue;
      const k=phase/200, life=1-k;
      const gen=Math.floor((now + _sbcHash(slotSeed)*period*4)/period);
      const seed=slotSeed+gen*7.3;
      const frac=0.05+0.9*_sbcHash(seed*1.31);
      let ic=0; const target=frac*total;
      while (ic<samp.length-1 && samp[ic].s<target) ic++;
      const span=4+Math.floor(_sbcHash(seed*2.7)*4);
      const amp=ampMax*(0.5+0.5*life);
      const bp=_localBolt(samp,ic,span,amp,seed);
      s += '<path d="'+bp+'" fill="none" stroke="'+gc1+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="'+(0.20*life).toFixed(2)+'"/>';
      s += '<path d="'+bp+'" fill="none" stroke="'+gc1+'" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round" opacity="'+(0.6*life).toFixed(2)+'"/>';
      s += '<path d="'+bp+'" fill="none" stroke="'+gc2+'" stroke-width="0.45" stroke-linecap="round" stroke-linejoin="round" opacity="'+(0.95*life).toFixed(2)+'"/>';
      const p=samp[ic];
      s += '<circle cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="'+(1.8*life+0.3).toFixed(2)+'" fill="'+gc1+'" opacity="'+(0.5*life).toFixed(2)+'"/>';
    }
  }
  return s;
}

/* Liseré statique discret quand la batterie est idle (glow_enabled actif) */
function _glowIdle(modules, col) {
  let s = '';
  for (let i = 0; i < modules; i++) {
    const h = CAPH + UNITH + i*MODH;
    s += '<path d="'+_seam(SIL_M, h)+'" fill="none" stroke="'+col+'" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.18"/>';
  }
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  MAIN CARD ELEMENT                                                         *
 * ═══════════════════════════════════════════════════════════════════════════ */

const KWH_PER = 2.2;

class StoreyBatteryCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._raf = null;
    this._prevKey = null;
    this._dom = null;

    this.shadowRoot.addEventListener('click', e => {
      const dp = e.target.closest('.dp[data-entity]');
      if (dp) this._moreInfo(dp.dataset.entity);
    }, { passive: true });
  }

  setConfig(c) {
    this._config = c;
    this._prevKey = null;
    this._dom = null;
    if (SBC_IS_LOW_POWER) this.classList.add('low-power');  // coupe les anims sur iPad/mobile
    this._scheduleRender();
  }

  set hass(h) {
    this._hass = h;
    this._scheduleRender();
  }

  disconnectedCallback() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    this._stopElec();
  }

  // Rattachement au DOM (ex: sortie de l'éditeur, où HA détache puis ré-attache la
  // card). disconnectedCallback a coupé le RAF ; aucun nouvel état HA n'arrive donc
  // _renderIfChanged skipperait (même _buildKey) → l'effet restait figé jusqu'au F5.
  // On relance la boucle si un effet était actif au dernier render.
  connectedCallback() {
    if (this._elec && this._dom?.elec) this._startElec();
  }

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

  _buildKey() {
    const m = this._modules();
    const soc = this._entVal(this._config.soc_entity);
    const pw = this._entVal(this._config.power_entity);
    const mods = [0,1,2,3].map(i => this._entVal(this._config['module_'+i+'_entity'])).join(',');
    const ms = this._ent(this._config.master_status_entity);
    const msv = ms ? ms.v : '';
    const thr = Math.abs(parseFloat(this._config.power_threshold)) || 50;
    const pwKey = pw !== null
      ? (Math.abs(pw) <= thr ? 0 : Math.round(pw / 10) * 10)
      : null;
    return `${m}|${soc!==null?Math.round(soc):null}|${pwKey}|${msv}|${mods}|${this._config.color_accent||''}|${this._config.color_bg||''}|${this._config.glow_enabled||''}|${this._config.cyberpunk_mode||''}|${this._config.neon_glow||''}|${this._config.card_mod_bg||''}|${thr}|${this._config.soc_full_threshold||97}|${this._config.show_handle===false?0:1}|${this._config.show_grille===false?0:1}|${this._config.glitch_cat===false?0:1}|${this._config.glitch_color||''}|${this._config.elec_crackle??''}|${this._config.elec_spark_rate??''}|${this._config.elec_spark_amp??''}|${this._config.elec_color_charge||''}|${this._config.elec_color_discharge||''}|${JSON.stringify(this._config.header||{})}`;
  }

  _modules() {
    const { modules_entity, modules } = this._config;
    if (modules_entity && this._hass) {
      const s = this._hass.states[modules_entity];
      if (s) return Math.min(3, Math.max(0, parseInt(s.state)||0));
    }
    return Math.min(3, Math.max(0, parseInt(modules)||0));
  }

  _ent(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    return { v: s.state, u: s.attributes.unit_of_measurement||'', id };
  }

  _entVal(id) { const e = this._ent(id); return e ? parseFloat(e.v) : null; }

  _moreInfo(entityId) {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _buildBrandIcon(accent) {
    const size = (this._config.header?.icon_size || 16);
    const icon = this._config.header?.icon || '';
    // Wrapper pour injection imperative de ha-icon si mdi
    if (icon.startsWith('mdi:')) {
      return `<span class="brand-icon-wrap" style="display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:${size}px;height:${size}px;"></span>
              <svg class="star-hidden" width="0" height="0" viewBox="0 0 100 100"><path class="star" d="M50 0 C50 0 44 44 0 50 C0 50 44 56 50 100 C50 100 56 56 100 50 C100 50 56 44 50 0Z"/></svg>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;"><path class="star" d="M50 0 C50 0 44 44 0 50 C0 50 44 56 50 100 C50 100 56 56 100 50 C100 50 56 44 50 0Z" fill="${accent}"/></svg>
            <span class="brand-icon-wrap" style="display:none"></span>`;
  }

  _render() {
    const modules = this._modules();
    const cyberpunk = !!this._config.cyberpunk_mode;
    const neonGlow  = !!this._config.neon_glow;
    const cardModBg = !!this._config.card_mod_bg;
    const accent = cyberpunk ? (this._config.color_accent||CP_ACCENT) : (this._config.color_accent||DEF_ACCENT);
    const bg = cardModBg ? 'transparent' : (cyberpunk ? (this._config.color_bg||CP_BG) : (this._config.color_bg||DEF_BG));
    const totalKwh = ((modules+1)*KWH_PER).toFixed(1);
    const batH = _batHeight(modules) + 2;

    const soc    = this._ent(this._config.soc_entity);
    const power  = this._ent(this._config.power_entity);
    const master = this._ent(this._config.master_status_entity);
    const socVal = soc ? Math.min(100, Math.max(0, +soc.v)) : null;
    const pwVal  = power ? +power.v : null;
    const masterState = master ? master.v.toUpperCase().trim() : null;

    const threshold = Math.abs(parseFloat(this._config.power_threshold)) || 50;
    let isCharging, isIdle;
    if (pwVal !== null && Math.abs(pwVal) <= threshold) {
      isCharging = false;
      isIdle = true;
    } else if (masterState) {
      isCharging = masterState === 'CHARGING';
      isIdle = masterState === 'OFF';
    } else if (pwVal !== null) {
      isCharging = pwVal > threshold;
      isIdle = false;
    } else {
      isCharging = false;
      isIdle = true;
    }

    const hasDots = socVal !== null || pwVal !== null || masterState !== null;
    const socFullThr = parseFloat(this._config.soc_full_threshold) || 97;
    const isSocFull  = socVal !== null && socVal >= socFullThr;
    const DOTS_X = SVG_W + 10;
    const VBW = hasDots ? DOTS_X + PANEL_MAX_W + 2 : SVG_W;

    /* ── Battery stack SVG ─────────────────────────────────────────────── */

    const showHandle = this._config.show_handle !== false;
    const showGrille = this._config.show_grille !== false;

    const ent0 = this._ent(this._config.module_0_entity);
    // GLITCH le chat sur l'écran du dessus (mascotte). Activé par défaut ; couleur
    // = glitch_color sinon l'accent. Passé à _stackContent → entre dans le cache.
    const catCol = this._config.glitch_cat === false ? null
      : (this._config.glitch_color || accent);
    const batParts = [ _stackContent(modules, showHandle, showGrille, catCol) ];
    if (ent0) {
      batParts.push(_faceDots(Math.round(Math.abs(+ent0.v)).toString()+(this._config.module_0_unit||''), accent, ent0.id, 0));
    }
    for (let i = 0; i < modules; i++) {
      const ent = this._ent(this._config['module_'+(i+1)+'_entity']);
      if (ent) {
        batParts.push(_faceDots(Math.round(Math.abs(+ent.v)).toString()+(this._config['module_'+(i+1)+'_unit']||''), accent, ent.id, i+1));
      }
    }
    const batSVG = batParts.join('');

    /* ── Glow layer ────────────────────────────────────────────────────── */

    let glowSVG = '';
    // couleur charge/décharge : défaut dynamique (logique card), chaque sens surchargé
    // INDÉPENDAMMENT par l'UI si la couleur correspondante est fournie.
    const gcDefault = cyberpunk ? (isCharging?CP_CHARGE:CP_DISCHARGE) : (isCharging?'#ffd000':'#4D7CFF');
    const gcOverride = isCharging ? this._config.elec_color_charge : this._config.elec_color_discharge;
    const gc1 = gcOverride || gcDefault;
    const gc2 = cyberpunk ? (isCharging?'#d9fffe':'#fbd4ff') : (isCharging?'#fff3b0':'#d6e4ff');
    if (this._config.glow_enabled) {
      const cKey = (this._config.elec_color_charge||'')+'/'+(this._config.elec_color_discharge||'');
      const glowKey = 'glow_'+modules+'_'+(isIdle?'idle':(isCharging?1:0))+'_'+(cyberpunk?'cp':'std')+'_'+cKey;
      if (_batCache.has(glowKey)) {
        glowSVG = _batCache.get(glowKey);
      } else if (isIdle) {
        glowSVG = _glowIdle(modules, cyberpunk ? '#6200EA' : '#9aa6c8');
        _batCache.set(glowKey, glowSVG);
      } else {
        glowSVG = _glowContent(modules, gc1, gc2, isCharging);   // base allumée (statique)
        _batCache.set(glowKey, glowSVG);
      }
    }

    /* ── Couche électrique (crépitement + sparks), animée en RAF ──────────── */
    const elecActive = !!this._config.glow_enabled && !isIdle
      && !SBC_IS_LOW_POWER && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._elec = elecActive ? {
      modules, gc1, gc2,
      crackle: clampNum(this._config.elec_crackle, 0.04, 0.4, 0.13),
      rate:    clampNum(this._config.elec_spark_rate, 0.3, 4, 1.6),
      amp:     clampNum(this._config.elec_spark_amp, 1, 9, 4),
    } : null;

    /* ── Side dot-matrix panels ────────────────────────────────────────── */

    let panelsSVG = '', dy = 4, panelsBot = 0;

    if (socVal !== null) {
      const col = socVal >= 25 ? accent : (cyberpunk ? '#7209b7' : BLUE_EL);
      const { circles, bW, bH } = _panelDots(socVal.toFixed(0), col);
      panelsSVG +=
        `<g class="dp" data-entity="${soc.id}" transform="translate(0,${dy})" style="cursor:pointer;filter:drop-shadow(0 0 5px ${col}44);">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="${col}" style="font-family:-apple-system,sans-serif;font-weight:500;">SOC</text>
          <rect x="0" y="0" width="${bW}" height="${bH}" rx="5" fill="#222"/>
          ${circles}
        </g>`;
      panelsBot = dy + +bH;
      dy += +bH + 12;
    }

    if (pwVal !== null) {
      const pwCol = isCharging ? (cyberpunk?CP_CHARGE:BLUE_EL) : accent;
      const lbl = (isCharging?'\u2193':'\u2191')+' W';
      const { circles, bW, bH } = _panelDots(Math.round(Math.abs(pwVal)).toString(), pwCol);
      panelsSVG +=
        `<g class="dp" data-entity="${power.id}" transform="translate(0,${dy})" style="cursor:pointer;filter:drop-shadow(0 0 5px ${pwCol}44);">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="${pwCol}" style="font-family:-apple-system,sans-serif;font-weight:500;">${lbl}</text>
          <rect x="0" y="0" width="${bW}" height="${bH}" rx="5" fill="#222"/>
          ${circles}
        </g>`;
      panelsBot = dy + +bH;
      dy += +bH + 12;
    }

    if (pwVal !== null || masterState !== null) {
      const arrowEntityId = master ? master.id : (power ? power.id : null);
      const dirCol = isIdle ? null : (isCharging ? (cyberpunk?CP_CHARGE:BLUE_EL) : accent);
      const { circles: arrowC, bW: arrowBW, bH: arrowBH } = isSocFull
        ? _fullDots(accent, cyberpunk)
        : _arrowDots(isIdle ? true : isCharging, dirCol, accent);
      const lblArrow = isSocFull ? 'FULL'
        : isIdle ? 'IDLE'
        : (masterState ? masterState : (isCharging ? 'CHARGING' : 'DISCHARGING'));
      panelsSVG +=
        `<g${arrowEntityId?` class="dp" data-entity="${arrowEntityId}"`:''}  transform="translate(0,${dy})" style="cursor:pointer;${(isIdle&&!isSocFull)?'':'filter:drop-shadow(0 0 6px '+(isSocFull?(cyberpunk?CP_ACCENT:accent):dirCol)+'55);'}">
          <text x="2" y="-2" font-size="5.5" letter-spacing="1.1" fill="${isSocFull?(cyberpunk?CP_ACCENT:accent):dirCol||'rgba(255,255,255,.28)'}" style="font-family:-apple-system,sans-serif;font-weight:500;">${lblArrow}</text>
          <rect x="0" y="0" width="${arrowBW}" height="${arrowBH}" rx="5" fill="#222"/>
          ${arrowC}
        </g>`;
      panelsBot = dy + +arrowBH;
    }

    /* ── Header pill ───────────────────────────────────────────────────── */

    let pillHTML;
    if (socVal !== null) {
      const avail = (socVal/100 * +totalKwh).toFixed(1);
      pillHTML =
        `<div class="kwh-pill" style="background:${accent}11;--pill-col:${accent}">
          <span class="kwh-num" style="color:${accent}">${avail}</span>
          <span class="kwh-sep" style="color:${accent}88">/</span>
          <span class="kwh-num" style="color:${accent}">${totalKwh}</span>
          <span class="kwh-unit" style="color:${accent}">kWh</span>
        </div>`;
    } else {
      pillHTML =
        `<div class="kwh-pill" style="background:${accent}11;--pill-col:${accent}">
          <span class="kwh-num" style="color:${accent}">${totalKwh}</span>
          <span class="kwh-unit" style="color:${accent}">kWh</span>
        </div>`;
    }

    /* ── Static shell (injected once) ──────────────────────────────────── */

    const root = this.shadowRoot;
    if (!root.querySelector('ha-card')) {
      root.innerHTML = `<style>
        :host { display: block }
        * { box-sizing: border-box; font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif }
        ha-card {
          position: relative; background: var(--sbc-bg); border-radius: 22px;
          overflow: hidden; padding: 0; border: 1px solid var(--sbc-border);
          box-shadow: 0 4px 40px rgba(0,0,0,.4); contain: layout style paint;
        }
        .cp-tl, .cp-br {
          position: absolute; width: 16px; height: 16px; z-index: 2;
          pointer-events: none; opacity: 0; transition: opacity .3s;
        }
        :host([data-cp]) .cp-tl, :host([data-cp]) .cp-br { opacity: .7 }
        :host([data-neon]) ha-card { box-shadow: 0 0 12px var(--sbc-accent), 0 4px 40px rgba(0,0,0,.4) }
        :host([data-cmbg]) ha-card { background: var(--card-background-color, transparent) !important }
        .top-band { display:flex; justify-content:space-between; align-items:center; padding:16px 14px 0; width:100% }
        .brand-row { display:flex; align-items:center; gap:8px }
        .brand {
          font-size: var(--sbc-title-size, 24px); letter-spacing: clamp(1px, 0.5cqi, 3px);
          color: var(--sbc-title-color, rgba(var(--rgb-primary-text-color),0.55));
          font-family: var(--sbc-title-font, inherit);
          line-height:1; text-transform:uppercase;
          text-shadow: var(--sbc-title-shadow, 0 0 30px var(--sbc-glow));
        }
        :host([data-neon]) .brand { text-shadow: var(--sbc-title-shadow, 0 0 8px #fff, 0 0 20px var(--sbc-accent), 0 0 40px var(--sbc-accent)) }
        .brand-icon { display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; width:var(--sbc-icon-size,22px); height:var(--sbc-icon-size,22px); --mdc-icon-size: var(--sbc-icon-size, 22px); color: var(--sbc-accent); filter: drop-shadow(0 0 6px var(--sbc-glow)); }
        .neon-div {
          height:1px; margin: 8px 14px 0;
          background: linear-gradient(90deg, transparent, rgba(var(--rgb-primary-color,98,0,234),0.55), rgba(var(--rgb-accent-color,0,255,249),0.25), transparent);
        }
        .kwh-pill {
          position:relative; display:inline-flex; align-items:baseline; gap:4px;
          padding:5px 13px; border-radius:99px; cursor:default;
        }
        .kwh-pill::before {
          content:''; position:absolute; inset:0; border-radius:99px;
          border:1.5px solid transparent;
          background:linear-gradient(135deg, var(--pill-col),
            color-mix(in srgb, var(--pill-col) 30%, transparent), transparent) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out; mask-composite: exclude; pointer-events:none;
        }
        .kwh-num  { font-size:16px; font-weight:800; letter-spacing:-.02em }
        .kwh-sep  { font-size:13px; font-weight:600; margin:0 1px }
        .kwh-unit { font-size:10px; color:inherit; opacity:.55; letter-spacing:.07em; text-transform:uppercase }
        .pills-row { display:flex; align-items:center; gap:8px }
        .svg-body { padding:12px 14px 16px }
        .dp { transition:opacity .1s; contain:layout style }
        .dp:active { opacity:.7 }
        /* iPad/mobile : coupe toutes les anims CSS (SMIL déjà strippé en JS) */
        :host(.low-power) * { animation:none !important; }
        @keyframes led-breathe { 0%,100%{opacity:.25} 60%{opacity:.55} 82%,88%{opacity:1} 94%{opacity:.8} }
        @keyframes sb-flow { from { stroke-dashoffset:0 } to { stroke-dashoffset:var(--o1) } }
        .cmt { animation:sb-flow 3.2s linear infinite; animation-delay:var(--dl,0s) }
        .led-seg { animation:led-breathe 2.2s cubic-bezier(.4,0,.2,1) infinite; will-change:opacity; transform:translateZ(0) }
        .led-seg:nth-child(2) { animation-delay:-.55s }
        .led-seg:nth-child(3) { animation-delay:-1.1s }
        .led-seg:nth-child(4) { animation-delay:-1.65s }

        /* ── GLITCH le chat : rafales (animations CSS pures, aucun timer JS) ──
         * Chaque effet a un cycle long où il n'agit que sur une courte fenêtre
         * (le reste = neutre). Cycles/délais premiers entre eux → impression
         * aléatoire de mascotte vivante. Le head bouge ; ghosts/lid clignotent. */
        .sbc-cat-head {
          transform-box:fill-box; transform-origin:50% 70%;
          animation: sbc-nod 9s ease-in-out infinite, sbc-shake 23s ease-in-out infinite;
          will-change:transform;
        }
        @keyframes sbc-nod {
          0%,84%,100%{transform:translateY(0)}
          88%{transform:translateY(10.9px)} 92%{transform:translateY(0)}
          94%{transform:translateY(7px)} 96%{transform:translateY(0)}
        }
        @keyframes sbc-shake {
          0%,40%,100%{transform:translateX(0) rotate(0)}
          43%{transform:translateX(-3px) rotate(-6deg)} 46%{transform:translateX(3px) rotate(6deg)}
          49%{transform:translateX(-2px) rotate(-4deg)} 52%{transform:translateX(0) rotate(0)}
        }
        /* vibration fine, superposée par à-coups */
        .sbc-cat { animation: sbc-vib .12s steps(2) infinite; }
        @keyframes sbc-vib { 0%,100%{transform:translate(0,0)} 50%{transform:translate(.18px,-.15px)} }
        /* glitch RGB : ghosts rouge/cyan, visibles seulement par rafales */
        .sbc-cat-gr, .sbc-cat-gc { mix-blend-mode:screen; opacity:0; }
        .sbc-cat-gr { animation: sbc-gr 17s steps(1) infinite; }
        .sbc-cat-gc { animation: sbc-gc 17s steps(1) infinite; }
        @keyframes sbc-gr {
          0%,64%,100%{opacity:0;transform:translate(0,0)}
          66%{opacity:.9;transform:translate(-1.6px,1px)} 70%{opacity:.9;transform:translate(1.6px,-1px)}
          74%{opacity:.9;transform:translate(-1px,0)} 76%{opacity:0;transform:translate(0,0)}
        }
        @keyframes sbc-gc {
          0%,64%,100%{opacity:0;transform:translate(0,0)}
          67%{opacity:.9;transform:translate(1.6px,-1px)} 71%{opacity:.9;transform:translate(-1.6px,1px)}
          75%{opacity:.9;transform:translate(1px,0)} 76.5%{opacity:0;transform:translate(0,0)}
        }
        /* wink : la paupière plasma ferme l'œil par rafales */
        .sbc-cat-lid { transform-box:fill-box; transform-origin:center top; transform:scaleY(0); }
        .sbc-cat-lid { animation: sbc-wink 13s ease-in-out infinite; }
        @keyframes sbc-wink {
          0%,30%,100%{transform:scaleY(0)} 32%,35%{transform:scaleY(1)} 37%{transform:scaleY(0)}
        }
        @media (prefers-reduced-motion: reduce) {
          .sbc-cat, .sbc-cat-head, .sbc-cat-gr, .sbc-cat-gc, .sbc-cat-lid { animation:none }
        }

        .glow-grp   { will-change:transform; transform:translateZ(0) }
        .panels-grp { will-change:transform }
        :host([data-neon]) .kwh-pill { box-shadow: 0 0 8px var(--sbc-accent) }
        :host([data-cp]) .kwh-unit { color: var(--sbc-cp-primary,${CP_PRIMARY}); opacity:.6 }
      </style>
      <ha-card>
        <div class="cp-tl"></div><div class="cp-br"></div>
        <div class="top-band">
          <div class="brand-row">
            ${this._buildBrandIcon(accent)}
            <div class="brand">${this._config.header?.title || 'STOREY'}</div>
          </div>
          <div class="pills-row"></div>
        </div>
        <div class="neon-div"></div>
        <div class="svg-body">
          <svg class="main-svg" width="100%" xmlns="http://www.w3.org/2000/svg" overflow="visible" style="display:block">
            <g class="stack-grp">
              <g class="bat-grp" style="filter:drop-shadow(3px 6px 14px rgba(0,0,0,.22))"></g>
              <g class="glow-grp"></g>
              <g class="elec-grp"></g>
            </g>
            <g class="panels-grp"></g>
          </svg>
        </div>
      </ha-card>`;
    }

    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    if (hdr.color)        this.style.setProperty('--sbc-title-color', hdr.color);
    else                  this.style.removeProperty('--sbc-title-color');
    if (hdr.font)         this.style.setProperty('--sbc-title-font', hdr.font);
    else                  this.style.removeProperty('--sbc-title-font');
    if (hdr.title_size)   this.style.setProperty('--sbc-title-size',   typeof hdr.title_size === 'number' ? hdr.title_size+'px' : hdr.title_size);
    else                  this.style.removeProperty('--sbc-title-size');
    if (hdr.title_shadow) this.style.setProperty('--sbc-title-shadow', hdr.title_shadow);
    else                  this.style.removeProperty('--sbc-title-shadow');
    if (hdr.icon_size)    this.style.setProperty('--sbc-icon-size',    hdr.icon_size+'px');
    else                  this.style.removeProperty('--sbc-icon-size');
    this.style.setProperty('--sbc-accent', accent);
    this.style.setProperty('--sbc-bg', bg);
    this.style.setProperty('--sbc-border', cyberpunk ? CP_PRIMARY+'33' : (bg===DEF_BG?'#282828':'transparent'));
    this.style.setProperty('--sbc-glow', accent+'55');
    this.style.setProperty('--sbc-cp-primary', CP_PRIMARY);

    if (cyberpunk) this.setAttribute('data-cp',''); else this.removeAttribute('data-cp');
    if (neonGlow)  this.setAttribute('data-neon',''); else this.removeAttribute('data-neon');
    if (cardModBg) this.setAttribute('data-cmbg',''); else this.removeAttribute('data-cmbg');

    if (!this._dom) {
      this._dom = {
        svg:      root.querySelector('.main-svg'),
        star:     root.querySelector('.star'),
        iconWrap: root.querySelector('.brand-icon-wrap'),
        stack:  root.querySelector('.stack-grp'),
        bat:    root.querySelector('.bat-grp'),
        glow:   root.querySelector('.glow-grp'),
        elec:   root.querySelector('.elec-grp'),
        panels: root.querySelector('.panels-grp'),
        pills:  root.querySelector('.pills-row'),
      };
    }
    const d = this._dom;

    const totalH = Math.max(batH, hasDots ? panelsBot+8 : 0);
    d.svg.setAttribute('viewBox', `0 0 ${VBW} ${totalH}`);
    // Couleur icone = header.color si défini, sinon accent
    const iconColor = (this._config.header?.color) || accent;
    if (d.star) d.star.setAttribute('fill', iconColor);
    // Injection imperative ha-icon pour MDI
    if (d.iconWrap) {
      const icon = this._config.header?.icon || '';
      const size = (this._config.header?.icon_size || 16) + 'px';
      if (icon.startsWith('mdi:') && d.iconWrap.style.display !== 'none') {
        if (!d.iconWrap._haIcon) {
          const hi = document.createElement('ha-icon');
          hi.style.display = 'flex';
          d.iconWrap.appendChild(hi);
          d.iconWrap._haIcon = hi;
        }
        const hi = d.iconWrap._haIcon;
        hi.setAttribute('icon', icon);
        // setProperty requis pour les CSS custom props
        hi.style.setProperty('--mdc-icon-size', size);
        hi.style.color = iconColor;
        hi.style.display = 'flex';
        // Extraire le blur et la couleur du title_shadow pour drop-shadow
        const ts = this._config.header?.title_shadow || '';
        let iconFilter;
        if (ts) {
          // Extraire "X Y blur color" depuis le premier shadow (avant la 1ère virgule hors parens)
          const m = ts.match(/^([\d.px-]+\s+[\d.px-]+\s+[\d.px-]+\s+(?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+))/);
          iconFilter = m ? `drop-shadow(${m[1]})` : `drop-shadow(0 0 8px ${iconColor})`;
        } else {
          iconFilter = `drop-shadow(0 0 6px ${iconColor})`;
        }
        hi.style.setProperty('filter', iconFilter);
      }
    }
    d.bat.innerHTML = SBC_IS_LOW_POWER ? _sbcStripSmil(batSVG) : batSVG;
    d.glow.innerHTML = SBC_IS_LOW_POWER ? _sbcStripSmil(glowSVG) : glowSVG;
    // Centrage vertical de la pile : on decale le WRAPPER (.stack-grp) qui contient
    // batterie + glow. NB: .glow-grp a un transform:translateZ(0) CSS qui ecrase
    // l'attribut transform SVG -> impossible de decaler le glow directement, d'ou le wrapper.
    const batOffset = Math.max(0, (totalH - batH) / 2);
    if (batOffset > 0.5) d.stack.setAttribute('transform', `translate(0,${batOffset.toFixed(1)})`);
    else                 d.stack.removeAttribute('transform');
    if (hasDots) {
      d.panels.setAttribute('transform', `translate(${DOTS_X},4)`);
      d.panels.innerHTML = SBC_IS_LOW_POWER ? _sbcStripSmil(panelsSVG) : panelsSVG;
    } else {
      d.panels.removeAttribute('transform');
      d.panels.innerHTML = '';
    }
    d.pills.innerHTML = pillHTML;

    // couche électrique : (re)lance la boucle si active, sinon la coupe + vide le calque
    if (this._elec) this._startElec();
    else { this._stopElec(); if (d.elec) d.elec.innerHTML = ''; }
  }

  // Boucle RAF qui redessine UNIQUEMENT le calque .elec-grp (crépitement + sparks).
  // ~30 fps. La carrosserie + la base allumée (mémoïsées) ne sont pas retouchées.
  _startElec() {
    if (this._elecRAF) return;
    const draw = (now) => {
      this._elecRAF = requestAnimationFrame(draw);
      if (document.hidden || !this._elec || !this._dom?.elec) return;
      if (now - (this._elecLast||0) < 33) return;
      this._elecLast = now;
      const e = this._elec;
      this._dom.elec.innerHTML = _elecLayer(e.modules, e.gc1, e.gc2, now, e.crackle, e.rate, e.amp);
    };
    this._elecRAF = requestAnimationFrame(draw);
  }
  _stopElec() {
    if (this._elecRAF) { cancelAnimationFrame(this._elecRAF); this._elecRAF = null; }
  }

  getCardSize() { return 3+this._modules(); }
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
    const sensorKeys = Object.keys(h.states).filter(e => e.startsWith('sensor.')).sort();
    const newKeys = sensorKeys.join('\n');
    if (newKeys === this._lastEntKeys) return;
    this._lastEntKeys = newKeys;
    const frag = document.createDocumentFragment();
    for (const e of sensorKeys) { const o = document.createElement('option'); o.value = e; frag.appendChild(o); }
    this.querySelectorAll('datalist').forEach(dl => { dl.innerHTML = ''; dl.appendChild(frag.cloneNode(true)); });
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _set(key, val, isChecked) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (!this._config[parent] || typeof this._config[parent] !== 'object') this._config[parent] = {};
      if (val===''||val===null||val===undefined) delete this._config[parent][child];
      else this._config[parent][child] = isNaN(val) ? val : (val==='' ? val : Number(val)||val);
    } else if (isChecked !== undefined) {
      if (isChecked) this._config[key] = true; else delete this._config[key];
    } else if (val===''||val===null||val===undefined) {
      delete this._config[key];
    } else {
      this._config[key] = val;
    }
    this._fire();
    if (['modules','glow_enabled','cyberpunk_mode','neon_glow','card_mod_bg'].includes(key)) {
      this._built = false; this._built = true; this._render();
    }
  }

  _modules() { return Math.min(3, Math.max(0, parseInt(this._config.modules)||0)); }
  _entities() { return this._hass ? Object.keys(this._hass.states).filter(e => e.startsWith('sensor.')).sort() : []; }

  _picker(label, key, placeholder) {
    const val = this._config[key]||'';
    const lid = 'dl'+key.replace(/\W/g,'');
    const opts = this._entities().map(e => `<option value="${e}">`).join('');
    return `<div class="field">
      <label>${label}</label>
      <input class="ep" data-key="${key}" value="${val}"
        list="${lid}" placeholder="${placeholder||'Search\u2026'}" autocomplete="off"/>
      <datalist id="${lid}">${opts}</datalist>
    </div>`;
  }

  _toggle(label, key, activeColor) {
    const on = !!this._config[key];
    return `<div class="field tog-row">
      <label>${label}</label>
      <label style="position:relative;display:inline-block;width:42px;height:24px;flex-shrink:0;">
        <input type="checkbox" data-key="${key}" ${on?'checked':''}
          style="opacity:0;width:0;height:0;position:absolute;"/>
        <span style="position:absolute;inset:0;border-radius:99px;cursor:pointer;transition:background .2s;
          background:${on?activeColor:'rgba(255,255,255,0.12)'};">
          <span style="position:absolute;top:3px;border-radius:50%;width:18px;height:18px;transition:left .2s;
            left:${on?'21px':'3px'};background:${on?'#1a1a1a':'rgba(255,255,255,0.6)'};">
          </span>
        </span>
      </label>
    </div>`;
  }

  _render() {
    const c = this._config||{};
    const m = this._modules();
    let modFields = '';
    for (let i = 1; i <= m; i++) {
      modFields += `<div class="row2">
        ${this._picker(`Module ${i} \u2014 Entity`, `module_${i}_entity`, `sensor.storey_module_${i}`)}
        <div class="field"><label>Module ${i} \u2014 Unit</label>
          <input type="text" data-key="module_${i}_unit" value="${c['module_'+i+'_unit']||''}" placeholder="W, kW\u2026" style="max-width:80px;"/>
        </div>
      </div>`;
    }

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
        input.ep{border-color:var(--primary-color,#777)}
        input.ep:focus{outline:none;box-shadow:0 0 0 1px var(--primary-color)}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .color-row{display:flex;align-items:center;gap:8px}
        .color-row input[type=color]{width:36px;height:36px;padding:2px;border-radius:6px;cursor:pointer;flex-shrink:0;border:none}
        .color-row input[type=text]{flex:1}
        .tog-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .tog-row label{margin:0;font-size:12px;color:var(--secondary-text-color)}
      </style>
      <div class="grid">
        <div class="group">
          <div class="group-title">Header</div>
          <div class="field"><label>Title</label><input class="ep" data-key="header.title" value="${c.header?.title||''}" placeholder="STOREY"></div>
          <div class="field"><label>Icon (mdi:...)</label><input class="ep" data-key="header.icon" value="${c.header?.icon||''}" placeholder="mdi:battery-high"></div>
          <div class="field"><label>Title size (px)</label><input type="number" class="ep" data-key="header.title_size" value="${c.header?.title_size||''}" placeholder="24" min="8" max="48"></div>
          <div class="field"><label>Icon size (px)</label><input type="number" class="ep" data-key="header.icon_size" value="${c.header?.icon_size||''}" placeholder="22" min="10" max="48"></div>
          <div class="field"><label>Title color</label><input class="ep" data-key="header.color" value="${c.header?.color||''}" placeholder="ex: #00fff9"></div>
          <div class="field"><label>Title font</label><input class="ep" data-key="header.font" value="${c.header?.font||''}" placeholder="Orbitron, Rajdhani..."></div>
          <div class="field"><label>Title shadow</label><input class="ep" data-key="header.title_shadow" value="${c.header?.title_shadow||''}" placeholder="0 0 8px rgba(0,212,255,0.7)"></div>
        </div>
        <div class="group">
          <div class="group-title">Modules</div>
          <div class="field"><label>Additional modules (0\u20133)</label>
            <select data-key="modules">
              ${[0,1,2,3].map(n=>`<option value="${n}"${c.modules==n?' selected':''}>${n} module${n>1?'s':''} \u2014 total ${n+1}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group-title">Sensors</div>
          ${this._picker('Master Status','master_status_entity','sensor.storey_master_status')}
          ${this._picker('State of Charge %','soc_entity','sensor.storey_soc')}
          ${this._picker('Power W','power_entity','sensor.storey_power')}
          <div class="field">
            <label>Power threshold (W) &mdash; stabilizes arrow</label>
            <input type="number" data-key="power_threshold" value="${c.power_threshold||50}" min="0" max="500" step="10" placeholder="50"/>
          </div>
          <div class="field">
            <label>SOC full threshold (%) &mdash; fill+glitch animation</label>
            <input type="number" data-key="soc_full_threshold" value="${c.soc_full_threshold||97}" min="80" max="100" step="1" placeholder="97"/>
          </div>
          <div class="row2">
            ${this._picker('Main module \u2014 Entity','module_0_entity','sensor.storey_module_0')}
            <div class="field"><label>Main module \u2014 Unit</label>
              <input type="text" data-key="module_0_unit" value="${c.module_0_unit||''}" placeholder="W, kW\u2026" style="max-width:80px;"/>
            </div>
          </div>
          ${modFields}
        </div>
        <div class="group">
          <div class="group-title">Effects</div>
          ${this._toggle('Inter-module glow','glow_enabled',DEF_ACCENT)}
          ${this._toggle('Inherit card-mod background','card_mod_bg',DEF_ACCENT)}
        </div>
        <div class="group">
          <div class="group-title">Electric arc</div>
          <div class="field"><label>Crackle speed &mdash; <span class="rngv" data-for="elec_crackle">${(c.elec_crackle ?? 0.13)}</span></label>
            <input type="range" class="rng" data-key="elec_crackle" min="0.04" max="0.4" step="0.01" value="${c.elec_crackle ?? 0.13}"/>
          </div>
          <div class="field"><label>Spark rate (bursts/s) &mdash; <span class="rngv" data-for="elec_spark_rate">${(c.elec_spark_rate ?? 1.6)}</span></label>
            <input type="range" class="rng" data-key="elec_spark_rate" min="0.3" max="4" step="0.1" value="${c.elec_spark_rate ?? 1.6}"/>
          </div>
          <div class="field"><label>Spark amplitude &mdash; <span class="rngv" data-for="elec_spark_amp">${(c.elec_spark_amp ?? 4)}</span></label>
            <input type="range" class="rng" data-key="elec_spark_amp" min="1" max="9" step="0.5" value="${c.elec_spark_amp ?? 4}"/>
          </div>
          <div class="row2">
            <div class="field"><label>Charge color (default: theme)</label>
              <div class="color-row">
                <input type="color" data-key="elec_color_charge" value="${c.elec_color_charge||'#ffd000'}"/>
                <input type="text"  data-key="elec_color_charge" value="${c.elec_color_charge||''}" placeholder="auto"/>
              </div>
            </div>
            <div class="field"><label>Discharge color (default: theme)</label>
              <div class="color-row">
                <input type="color" data-key="elec_color_discharge" value="${c.elec_color_discharge||'#4D7CFF'}"/>
                <input type="text"  data-key="elec_color_discharge" value="${c.elec_color_discharge||''}" placeholder="auto"/>
              </div>
            </div>
          </div>
        </div>
        <div class="group">
          <div class="group-title">Cyberpunk</div>
          ${this._toggle('Neo Tokyo Mode','cyberpunk_mode',CP_PRIMARY)}
          ${this._toggle('Neon Glow','neon_glow',CP_ACCENT)}
        </div>
        <div class="group">
          <div class="group-title">Colors</div>
          <div class="row2">
            <div class="field"><label>Accent</label>
              <div class="color-row">
                <input type="color" data-key="color_accent" value="${c.color_accent||DEF_ACCENT}"/>
                <input type="text"  data-key="color_accent" value="${c.color_accent||DEF_ACCENT}" placeholder="${DEF_ACCENT}"/>
              </div>
            </div>
            <div class="field"><label>Background</label>
              <div class="color-row">
                <input type="color" data-key="color_bg" value="${c.color_bg||DEF_BG}"/>
                <input type="text"  data-key="color_bg" value="${c.color_bg||DEF_BG}" placeholder="${DEF_BG}"/>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    this.querySelectorAll('input.ep').forEach(el => {
      ['keydown','keyup','input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), {passive:true}));
      ['change','blur'].forEach(ev => el.addEventListener(ev, e => { e.stopPropagation(); this._set(el.dataset.key, el.value||null); }));
    });
    this.querySelectorAll('input[type=number][data-key]').forEach(el => {
      ['keydown','keyup','input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), {passive:true}));
      el.addEventListener('change', e => { e.stopPropagation(); this._set(el.dataset.key, el.value||null); });
    });
    this.querySelectorAll('input[type=text][data-key]:not(.ep)').forEach(el => {
      ['keydown','keyup','input'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation(), {passive:true}));
      el.addEventListener('blur', e => { e.stopPropagation(); this._set(el.dataset.key, el.value||null); });
    });
    this.querySelectorAll('input[type=color][data-key]').forEach(el => {
      el.addEventListener('input', e => {
        e.stopPropagation();
        const t = this.querySelector(`input[type=text][data-key="${el.dataset.key}"]`);
        if (t) t.value = el.value;
        this._set(el.dataset.key, el.value);
      }, {passive:true});
    });
    this.querySelectorAll('input.rng[data-key]').forEach(el => {
      el.addEventListener('input', e => {
        e.stopPropagation();
        const lbl = this.querySelector(`.rngv[data-for="${el.dataset.key}"]`);
        if (lbl) lbl.textContent = el.value;
        this._set(el.dataset.key, el.value);
      }, {passive:true});
    });
    this.querySelectorAll('select[data-key],input[type=checkbox][data-key]').forEach(el => {
      el.addEventListener('change', e => {
        e.stopPropagation();
        if (el.type==='checkbox') this._set(el.dataset.key, null, el.checked);
        else this._set(el.dataset.key, el.value);
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  REGISTRATION                                                              *
 * ═══════════════════════════════════════════════════════════════════════════ */

customElements.define('storey-battery-card',           StoreyBatteryCard);
customElements.define('storey-battery-card-editor', StoreyBatteryCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'storey-battery-card',
  name: 'Storey Battery Card',
  description: 'Storey battery v12 \u2014 g\u00e9om\u00e9trie param\u00e9trique galet',
  preview: true,
});

})();

console.info(
  '%c 🔋 storey-battery-card v14.0 %c Neo Tokyo ',
  'background:#FFD700;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FF6A00;padding:2px 4px;border-radius:0 3px 3px 0;'
);
