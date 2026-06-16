/**
 * weather-neon-card v1.0.0
 * Carte météo néon pour Home Assistant — icônes SVG outline animées + fond réactif.
 *
 * Installation :
 *   1. Copier dans /config/www/weather-neon-card.js
 *   2. Ressources HA → /local/weather-neon-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:weather-neon-card
 *   entity: weather.ma_station
 *
 * Options :
 *   entity          (requis)  entité weather.*
 *   name                      libellé du lieu (défaut: friendly_name)
 *   forecast_type  daily|hourly  type de prévision (défaut: daily)
 *   forecast_count            nb de colonnes de prévision (défaut: 5)
 *   reactive_bg    true|false  fond qui change selon la météo (défaut: true)
 */

const VERSION = '2.0.0';

// ═══════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════
function buildConfig(raw) {
  return {
    entity:        raw.entity        || null,
    name:          raw.name          || null,
    forecast_type: raw.forecast_type || 'daily',
    forecast_count: raw.forecast_count ?? 5,
    reactive_bg:   raw.reactive_bg   ?? false,  // défaut: laisse le fond/glow du thème (card-mod)
    alert_entity:  raw.alert_entity  || null,  // ex: sensor.54_weather_alert (vigilance MF)
    sun_entity:    raw.sun_entity    || 'sun.sun',  // pour lever/coucher dans la colonne droite
    show_aside:    raw.show_aside    ?? true,  // colonne droite (lever/coucher/rafales)
    glitch:        raw.glitch        ?? true,  // GLITCH le chat réactif à la météo
    particles:     raw.particles     ?? true,  // particules atmosphériques (pluie/neige/soleil)
    neon_fx:       raw.neon_fx       ?? true,  // scanlines + temp glitchée (Neo Tokyo)
    // sensors externes (Météo-France expose vent/probas séparément de l'entité weather).
    // Si non fournis → auto-détectés depuis le préfixe de l'entité (cf _extra()).
    wind_entity:   raw.wind_entity   || null,  // ex: sensor.<x>_wind_speed
    rain_chance_entity: raw.rain_chance_entity || null,  // ex: sensor.<x>_rain_chance
    snow_chance_entity: raw.snow_chance_entity || null,  // ex: sensor.<x>_snow_chance
    // Stats secondaires individuelles (peuvent faire doublon avec une autre card en dessous).
    show_humidity: raw.show_humidity ?? true,
    show_wind:     raw.show_wind     ?? true,
    show_pressure: raw.show_pressure ?? true,
    // Qualité de l'air & pollens (Atmo France) — pastilles cliquables dans .wstats.
    // Libellé + couleur lus dans les attributs de l'entité ; tendance via l'entité J+1.
    show_atmo:     raw.show_atmo     ?? true,
    air_entity:        raw.air_entity        || null,  // sensor.atmo_france_qualite_globale_<zone>
    air_entity_next:   raw.air_entity_next   || null,  // ...qualite_globale_<zone>_j_1
    pollen_entity:     raw.pollen_entity     || null,  // sensor.atmo_france_qualite_globale_pollen_<zone>
    pollen_entity_next: raw.pollen_entity_next || null, // ...qualite_globale_pollen_<zone>_j_1
  };
}

// devine le préfixe ville depuis weather.xxx → "xxx" (pour retrouver les sensors MF)
function entityBase(weatherEntity) {
  return (weatherEntity || '').replace(/^weather\./, '');
}

// Formate un attribut sun (sensor.sun_next_* = datetime ISO) en HH:MM local
function fmtTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ── Vigilance Météo-France : niveaux + couleurs ──
const VIGI_RANK = { 'Vert': 0, 'Jaune': 1, 'Orange': 2, 'Rouge': 3 };
const VIGI_COLOR = { 1: '#ffe14d', 2: '#ff9a3c', 3: '#ff3b5c' }; // jaune/orange/rouge (vert = pas de halo)
// les 6 risques exposés en attributs par le capteur weather_alert
const VIGI_RISKS = ['Vent violent', 'Pluie-inondation', 'Orages', 'Canicule', 'Neige-verglas', 'Inondation'];

// Renvoie {rank, color, risks:[noms des risques au niveau max]} ou null si tout est vert/absent
function computeVigilance(state) {
  if (!state || !state.attributes) return null;
  const a = state.attributes;
  let maxRank = 0;
  for (const r of VIGI_RISKS) {
    const lvl = a[r];
    if (lvl && VIGI_RANK[lvl] > maxRank) maxRank = VIGI_RANK[lvl];
  }
  if (maxRank === 0) return null;
  const risks = VIGI_RISKS.filter(r => VIGI_RANK[a[r]] === maxRank);
  return { rank: maxRank, color: VIGI_COLOR[maxRank], risks };
}

// ── Atmo France ──────────────────────────────────────────────────────────────
// Les attributs Atmo arrivent en clés mal encodées (double-UTF8 : "Libellé"→"Libell\xc3\xa9").
// On retrouve l'attribut par PRÉFIXE robuste plutôt que par clé exacte.
function attrByPrefix(attrs, prefix) {
  if (!attrs) return null;
  for (const k of Object.keys(attrs)) {
    // normalise : retire les octets non-ASCII pour comparer "Libell…"/"Couleur"
    if (k.replace(/[^\x20-\x7e]/g, '').toLowerCase().startsWith(prefix.toLowerCase())) return attrs[k];
  }
  return null;
}

// Construit une pastille qualité air / pollen (libellé + couleur Atmo + tendance J→J+1).
// iconKey ∈ MINI_ICONS. Cliquable → more-info. Retourne '' si entité absente/indispo.
function atmoPastille(hass, iconKey, entityId, nextEntityId) {
  if (!hass || !entityId) return '';
  const st = hass.states[entityId];
  if (!st || st.state === 'unavailable' || st.state === 'unknown') return '';

  const label = attrByPrefix(st.attributes, 'Libell') || st.state;
  const color = attrByPrefix(st.attributes, 'Couleur') || 'currentColor';
  const cur   = parseFloat(st.state);

  // tendance vs J+1 (si dispo et numérique)
  let trend = '';
  const nx = nextEntityId ? hass.states[nextEntityId] : null;
  if (nx && nx.state !== 'unavailable' && nx.state !== 'unknown') {
    const nv = parseFloat(nx.state);
    if (!isNaN(cur) && !isNaN(nv)) {
      if (nv > cur)      trend = `<span class="watmo-tr up"   title="Se dégrade demain">▲</span>`;
      else if (nv < cur) trend = `<span class="watmo-tr down" title="S'améliore demain">▼</span>`;
      else               trend = `<span class="watmo-tr flat" title="Stable demain">→</span>`;
    }
  }

  return `<span class="watmo" data-atmo="${entityId}" style="color:${color}">`
       + `<span class="watmo-i">${MINI_ICONS[iconKey]}</span>`
       + `<b>${label}</b>${trend}</span>`;
}

// ═══════════════════════════════════════════════════════
//  ICÔNES SVG OUTLINE NÉON (animées) — 15 conditions HA
// ═══════════════════════════════════════════════════════
const CY = '#7df9ff', CYB = '#00e5ff', VIO = '#9a7dff', YEL = '#ffe14d', WHT = '#dfeef7', GRY = '#9fb2c9';

// dégradés néon partagés (inspirés des icônes IA — version animée maison)
const SVG_DEFS = `
  <linearGradient id="wg-cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aef9ff"/><stop offset="1" stop-color="#0090ff"/></linearGradient>
  <linearGradient id="wg-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a0"/><stop offset="1" stop-color="#ff9d00"/></linearGradient>
  <linearGradient id="wg-vio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b3ff"/><stop offset="1" stop-color="#7a4dff"/></linearGradient>
  <linearGradient id="wg-grey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd8e6"/><stop offset="1" stop-color="#7e8ca0"/></linearGradient>
  <radialGradient id="wg-suncore" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fffde6"/><stop offset="40%" stop-color="#ffd34d"/><stop offset="100%" stop-color="#ff8a00"/></radialGradient>
  <filter id="wglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
const GCY = 'url(#wg-cyan)', GSUN = 'url(#wg-sun)', GVIO = 'url(#wg-vio)', GGREY = 'url(#wg-grey)';
// kanji décoratif par condition (haut-gauche, comme les icônes IA)
const KANJI = {
  sunny: '晴', 'clear-night': '夜', partlycloudy: '時', 'partlycloudy-night': '夜',
  cloudy: '曇', rainy: '雨', 'rainy-night': '雨', pouring: '雨', lightning: '雷',
  'lightning-rainy': '雷', snowy: '雪', 'snowy-rainy': '雪', hail: '雹', fog: '霧',
  windy: '風', 'windy-variant': '風', exceptional: '異',
};
function kanji(cond, col) {
  const k = KANJI[cond]; if (!k) return '';
  return `<text x="3" y="18" font-size="13" font-family="serif" fill="${col}" opacity=".7">${k}</text>`;
}

function svgWrap(inner, size, haloColor) {
  const halo = haloColor
    ? `<circle cx="50" cy="50" r="40" fill="none" stroke="${haloColor}" stroke-width="3" opacity="0">
         <animate attributeName="opacity" values="0;.85;0" dur="1.5s" repeatCount="indefinite"/>
         <animate attributeName="r" values="34;46;34" dur="1.5s" repeatCount="indefinite"/></circle>`
    : '';
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="wico">
    <defs>${SVG_DEFS}</defs>
    <g filter="url(#wglow)">${halo}${inner}</g></svg>`;
}
// nuage rempli (léger) + contour dégradé
const _cloud = (c = GCY, x = 0, y = 0, sc = 1, fill = 'rgba(0,144,255,.10)') =>
  `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M32 62 Q22 62 22 52 Q22 42 34 44 Q36 30 52 32 Q68 32 68 48 Q80 46 80 58 Q80 64 72 64 Z" fill="${fill}" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
const _drops = (c = GCY, y = 66, n = 4, x0 = 34) =>
  [...Array(n)].map((_, i) => `<line x1="${x0 + i * 11}" y1="${y}" x2="${x0 + i * 11}" y2="${y + 10}" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="${i * 0.2}s" repeatCount="indefinite"/></line>`).join('');
// éclair plein (polygone) avec glow
const _bolt = (c = YEL) =>
  `<polygon points="53,48 42,70 51,70 45,88 66,62 55,62 60,48" fill="${c}"><animate attributeName="opacity" values="1;.15;1;.5;1" dur="1.7s" repeatCount="indefinite"/></polygon>`;
// flocon qui TOMBE (gravité) en tournant légèrement — la neige descend, elle ne tourne pas sur place.
// animateTransform additif : translate (chute) + rotate (rotation douce) cumulés.
const _flake = (x, y, c = GCY, dur = 2.6, delay = 0) =>
  `<g transform="translate(${x} ${y})">
     <animateTransform attributeName="transform" type="translate" additive="sum" values="0 -6; 0 12" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
     <animate attributeName="opacity" values="0;1;1;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
     <g stroke="${c}" stroke-width="1.6">
       <animateTransform attributeName="transform" type="rotate" values="0;360" dur="${dur * 1.4}s" begin="${delay}s" repeatCount="indefinite"/>
       ${[0, 60, 120].map(a => `<line x1="${(-3.2 * Math.cos(a * Math.PI / 180)).toFixed(1)}" y1="${(-3.2 * Math.sin(a * Math.PI / 180)).toFixed(1)}" x2="${(3.2 * Math.cos(a * Math.PI / 180)).toFixed(1)}" y2="${(3.2 * Math.sin(a * Math.PI / 180)).toFixed(1)}"/>`).join('')}
     </g></g>`;

// SOLEIL V1 (validé par Chris) : cœur dégradé radial + rayons triangulaires FIXES
// (pas de rotation) + halo qui pulse. cx/cy = centre, sc = échelle (1 = pleine icône).
const _sun = (cx = 50, cy = 48, sc = 1) => {
  const rays = [...Array(12)].map((_, i) => {
    const long = i % 2 === 0;
    const r1 = long ? 20 : 22, r2 = long ? 6 : 11;  // longueur du rayon (vers le centre/extérieur)
    return `<path d="M50 ${r2} L52.5 ${r1} L47.5 ${r1} Z" fill="#ffce4a" transform="rotate(${i * 30} 50 48)" opacity="${long ? 1 : .7}"/>`;
  }).join('');
  return `<g transform="translate(${cx - 50} ${cy - 48}) scale(${sc})" style="transform-origin:50px 48px">
    <circle cx="50" cy="48" r="26" fill="#ff8a00" opacity=".30">
      <animate attributeName="r" values="24;30;24" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".30;.10;.30" dur="3s" repeatCount="indefinite"/></circle>
    ${rays}
    <circle cx="50" cy="48" r="15" fill="url(#wg-suncore)"/>
  </g>`;
};

const ICONS = {
  'sunny': () => _sun(50, 48, 1),
  'clear-night': () => `<path d="M62 32 A22 22 0 1 0 68 70 A18 18 0 1 1 62 32 Z" fill="rgba(0,144,255,.10)" stroke="${GCY}" stroke-width="2.5" stroke-linejoin="round"/>
    ${[...Array(3)].map((_, i) => `<circle cx="${30 + i * 8}" cy="${30 + i * 6}" r="1.4" fill="#fff"><animate attributeName="opacity" values="1;.2;1" dur="${2 + i}s" repeatCount="indefinite"/></circle>`).join('')}`,
  'partlycloudy': () => `${_sun(38, 36, .62)}${_cloud(GCY, 8, 14, .85)}`,
  'partlycloudy-night': () => `<path d="M44 30 A14 14 0 1 0 48 54 A11 11 0 1 1 44 30 Z" fill="none" stroke="${GCY}" stroke-width="2.5" stroke-linejoin="round"/>${_cloud(GCY, 8, 14, .85)}`,
  'cloudy': () => `<g style="animation:wdrift 6s ease-in-out infinite">${_cloud(GCY, -4, -2)}</g><g style="animation:wdrift 8s ease-in-out infinite" opacity=".55">${_cloud(GGREY, 8, 8, .7, 'rgba(126,140,160,.10)')}</g>`,
  'rainy': () => `${_cloud(GCY, 0, -6)}${_drops(GCY, 60, 4)}`,
  'rainy-night': () => `${_cloud(GCY, 0, -6)}${_drops(GCY, 60, 4)}`,
  'pouring': () => `${_cloud(GCY, 0, -8)}${_drops(GCY, 58, 6, 30)}`,
  'lightning': () => `${_cloud(GVIO, 0, -8, 1, 'rgba(122,77,255,.12)')}${_bolt(YEL)}`,
  'lightning-rainy': () => `${_cloud(GVIO, 0, -10, 1, 'rgba(122,77,255,.12)')}${_bolt(YEL)}${_drops(GCY, 60, 3, 32)}`,
  'snowy': () => `${_cloud(GCY, 0, -6)}${[...Array(4)].map((_, i) => _flake(34 + i * 11, 60, GCY, 2.4 + (i % 3) * 0.3, i * 0.35)).join('')}`,
  'snowy-rainy': () => `${_cloud(GCY, 0, -6)}<line x1="40" y1="60" x2="40" y2="70" stroke="${GCY}" stroke-width="2.5" stroke-linecap="round"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></line>${_flake(58, 60, GCY, 2.6, 0.3)}`,
  'hail': () => `${_cloud(GCY, 0, -6)}${[...Array(4)].map((_, i) => `<circle cx="${34 + i * 11}" cy="64" r="2.4" fill="none" stroke="${WHT}" stroke-width="1.6"><animate attributeName="cy" values="60;72" dur="0.9s" begin="${i * 0.2}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="0.9s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`).join('')}`,
  'fog': () => `${_cloud(GCY, 0, -10, .9)}${[...Array(3)].map((_, i) => `<line x1="26" y1="${60 + i * 7}" x2="74" y2="${60 + i * 7}" stroke="${GGREY}" stroke-width="2.5" stroke-linecap="round" opacity=".7"><animateTransform attributeName="transform" type="translate" values="-6 0;6 0;-6 0" dur="${3 + i}s" repeatCount="indefinite"/></line>`).join('')}`,
  'windy': () => `${[...Array(3)].map((_, i) => `<path d="M22 ${40 + i * 12} h${36 - i * 4} a6 6 0 1 ${i % 2} -6 6" fill="none" stroke="${GCY}" stroke-width="2.5" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;6 0;0 0" dur="${2.5 + i * 0.5}s" repeatCount="indefinite"/></path>`).join('')}`,
  'windy-variant': () => `${[...Array(3)].map((_, i) => `<path d="M22 ${40 + i * 12} h${36 - i * 4} a6 6 0 1 ${i % 2} -6 6" fill="none" stroke="${GVIO}" stroke-width="2.5" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;6 0;0 0" dur="${2.5 + i * 0.5}s" repeatCount="indefinite"/></path>`).join('')}`,
  'exceptional': () => `<circle cx="50" cy="50" r="30" fill="none" stroke="${GVIO}" stroke-width="2.5"/><line x1="50" y1="34" x2="50" y2="56" stroke="${YEL}" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="66" r="2.6" fill="${YEL}"><animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/></circle>`,
};
// couleur du kanji par famille
const KANJI_COL = { sunny: '#ffcf4d', partlycloudy: '#ffcf4d', lightning: '#c9a0ff', 'lightning-rainy': '#c9a0ff', 'windy-variant': '#c9a0ff', exceptional: '#c9a0ff' };
function iconSvg(condition, size, haloColor, withKanji = true) {
  const fn = ICONS[condition] || ICONS['cloudy'];
  const k = withKanji ? kanji(condition, KANJI_COL[condition] || '#7df9ff') : '';
  return svgWrap(fn() + k, size, haloColor);
}

// ═══════════════════════════════════════════════════════
//  GLITCH le chat — mascotte réactive à la météo (pixel-art + RGB-split)
// ═══════════════════════════════════════════════════════
const GLITCH_PATH = "M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z";

// accessoire météo dessiné par-dessus le chat (viewBox 0 0 51 46)
function glitchAccessory(cond) {
  if (['sunny'].includes(cond))
    return `<rect x="13" y="22" width="9" height="4.5" rx="1.5" fill="#0b0b0b"/><rect x="29" y="22" width="9" height="4.5" rx="1.5" fill="#0b0b0b"/><rect x="22" y="23.4" width="7" height="1.6" fill="#0b0b0b"/>`; // lunettes
  if (['rainy', 'pouring', 'snowy-rainy'].includes(cond))
    return `<path d="M9 8 h33 v2 h-33 z" fill="#ffe14d"/><path d="M25.5 8 v-5" stroke="#ffe14d" stroke-width="2"/><path d="M13 8 q12.5 -11 24 0" fill="none" stroke="#ffe14d" stroke-width="2"/>`; // parapluie
  if (['lightning', 'lightning-rainy'].includes(cond))
    return `<polygon points="44,1 38,12 42.5,12 37,21 47,9.5 42.5,9.5 46,1" fill="#ffe14d"/>`; // éclair
  return '';
}
// classe d'animation selon météo : grelotte si froid/neige, affolé si orage
function glitchMood(cond) {
  if (['snowy', 'hail', 'snowy-rainy'].includes(cond)) return 'wcat-shiver';
  if (['lightning', 'lightning-rainy'].includes(cond)) return 'wcat-crazy';
  return '';
}
// génère le bloc GLITCH (3 calques rouge/cyan/principal en screen → aberration RGB).
// mainColor = couleur du calque principal : vert plasma au repos, ou couleur de
// vigilance (jaune/orange/rouge) quand une alerte est active → GLITCH "s'alarme".
function glitchHtml(cond, mainColor = '#4AF2A1') {
  const acc = glitchAccessory(cond);
  const mood = glitchMood(cond);
  // paupière (wink) sur le calque principal : prend la couleur principale (se fond dans la peau)
  const lid = `<path class="wcat-lid" fill="${mainColor}" d="M26.631 26.571h5.455v5.455h-5.455Z"/>`;
  const layer = (color, cls, withAcc) =>
    `<svg viewBox="0 0 51 46" class="${cls}"><path fill="${color}" d="${GLITCH_PATH}"/>${withAcc ? acc + lid : ''}</svg>`;
  // glow assorti à la couleur principale (via variable CSS lue par .wcat)
  return `<div class="wcat ${mood}" style="--cat-glow:${mainColor}">
    ${layer('#ff2d6b', 'wcat-r', false)}
    ${layer('#00e5ff', 'wcat-c', false)}
    ${layer(mainColor, 'wcat-m', true)}
  </div>`;
}

// générateurs de particules réutilisables (n = nombre, opacité optionnelle pour les "annonces")
const _rainSpans = (n, op = 1) => [...Array(n)].map((_, i) =>
  `<span class="wfx-rain" style="left:${(i * 6.3) % 100}%;animation-delay:${(i % 7) * 0.13}s;animation-duration:${0.7 + (i % 4) * 0.18}s;opacity:${op}"></span>`).join('');
const _snowSpans = (n, op = 1) => [...Array(n)].map((_, i) =>
  `<span class="wfx-snow" style="left:${(i * 6.3) % 100}%;animation-delay:${(i % 8) * 0.3}s;animation-duration:${3 + (i % 4)}s;opacity:${op}"></span>`).join('');

// Particules atmosphériques (pluie/neige/poussières). Le VENT est géré séparément
// par un canvas animé (cf _startWind/_drawWind), pas en CSS ici.
function particlesHtml(cond, rainCh = 0, snowCh = 0) {
  // 1) condition pluvieuse RÉELLE → pluie pleine
  if (['rainy', 'pouring', 'lightning-rainy', 'snowy-rainy'].includes(cond)) {
    return `<div class="wfx">${_rainSpans(cond === 'pouring' ? 28 : 16)}</div>`;
  }
  // 2) condition neigeuse RÉELLE → neige pleine
  if (['snowy', 'hail'].includes(cond)) {
    return `<div class="wfx">${_snowSpans(16)}</div>`;
  }
  // 3) condition sèche MAIS proba élevée → "annonce"
  if (snowCh >= 30) return `<div class="wfx">${_snowSpans(Math.round(snowCh / 100 * 14), 0.55)}</div>`;
  if (rainCh >= 30) return `<div class="wfx">${_rainSpans(Math.round(rainCh / 100 * 14), 0.5)}</div>`;
  // 4) beau temps → rayon doux + poussières dorées
  if (['sunny'].includes(cond)) {
    return `<div class="wfx"><span class="wfx-ray"></span>${[...Array(12)].map((_, i) =>
      `<span class="wfx-dust" style="left:${(i * 8.3) % 100}%;top:${(i * 37) % 100}%;animation-delay:${i * 0.2}s;animation-duration:${3 + (i % 4)}s"></span>`).join('')}</div>`;
  }
  if (['lightning'].includes(cond)) return '<div class="wfx"><span class="wfx-flash"></span></div>';
  return '';
}

// Petites icônes ligne (colonne droite) — 16px, trait simple
const MINI_ICONS = {
  sunrise: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="${YEL}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="3.5"/><line x1="12" y1="3" x2="12" y2="6"/><polyline points="9,6 12,3 15,6"/><line x1="4" y1="20" x2="20" y2="20"/></svg>`,
  sunset:  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ff9a3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3.5"/><line x1="12" y1="3" x2="12" y2="5"/><line x1="4" y1="20" x2="20" y2="20"/><polyline points="9,17 12,20 15,17"/></svg>`,
  gust:    `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="${CY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/></svg>`,
  // stats en pastilles (currentColor → couleur de la pastille)
  wind:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/><path d="M3 11h7"/></svg>`,
  humidity: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 3.1S6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-10.9-6-10.9m0 16.4a4 4 0 0 1-4-4c0-.4.3-.7.7-.7s.7.3.7.7a2.6 2.6 0 0 0 2.6 2.6c.4 0 .7.3.7.7s-.3.7-.7.7"/></svg>`,
  pressure: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"/><line x1="12" y1="14" x2="15.5" y2="10.5"/></svg>`,
  // qualité de l'air : LE biohazard officiel (SVG Wikimedia fourni par Chris), silhouette pleine.
  // Pour rester lisible en petit : disque de fond couleur Atmo (currentColor) + la silhouette
  // biohazard "creusée" par-dessus dans une couleur sombre → les 3 lobes ressortent.
  // ids renommés bh-* (évite collisions globales).
  biohazard: `<svg viewBox="-28 -30 56 56" width="16" height="16"><circle r="27" fill="currentColor"/><g fill="#10121a"><defs><clipPath id="bh-b"><circle cy="-15" r="9.5"/><circle cy="-15" r="9.5" transform="rotate(120)"/><circle cy="-15" r="9.5" transform="rotate(240)"/></clipPath><mask id="bh-a" width="60" height="60" x="-30" y="-30" maskUnits="userSpaceOnUse"><path fill="#fff" d="M-27-27h54v54h-54z"/><path d="M2-23v-4h-4v4M-.5-6v4h1v-4"/><circle cy="-15" r="10.5"/><g transform="rotate(120)"><path d="M2-23v-4h-4v4M-.5-6v4h1v-4"/><circle cy="-15" r="10.5"/></g><g transform="rotate(240)"><path d="M2-23v-4h-4v4M-.5-6v4h1v-4"/><circle cy="-15" r="10.5"/></g><circle r="3"/></mask></defs><g mask="url(#bh-a)"><circle cy="-11" r="15"/><circle cy="-11" r="15" transform="rotate(120)"/><circle cy="-11" r="15" transform="rotate(240)"/></g><circle r="11.75" fill="none" stroke="#10121a" stroke-width="3.5" clip-path="url(#bh-b)"/></g></svg>`,
  // pollens : fleur stylisée (mdi:flower-pollen) — fill currentColor
  pollen:    `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a3 3 0 0 0-3 3c0 .9.4 1.7 1 2.24V9.1A5 5 0 0 0 7.1 11H5.24A3 3 0 0 0 2 12a3 3 0 0 0 3 3c.9 0 1.7-.4 2.24-1H9.1a5 5 0 0 0 1.9 1.9v1.86A3 3 0 0 0 12 22a3 3 0 0 0 3-3c0-.9-.4-1.7-1-2.24V14.9a5 5 0 0 0 1.9-1.9h1.86A3 3 0 0 0 22 12a3 3 0 0 0-3-3c-.9 0-1.7.4-2.24 1H14.9A5 5 0 0 0 13 7.1V5.24A3 3 0 0 0 12 2m0 7a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3"/></svg>`,
};

// Fond atmosphérique selon la condition
const SKY = {
  'sunny':         'linear-gradient(160deg,#1f4a6b 0%,#2f6fa0 55%,#5ba3cf 100%)',
  'clear-night':   'linear-gradient(160deg,#0c1020 0%,#1a2238 60%,#2a3650 100%)',
  'partlycloudy':  'linear-gradient(160deg,#33435c 0%,#52688a 60%,#88a0bd 100%)',
  'cloudy':        'linear-gradient(160deg,#2c3543 0%,#444f5f 60%,#5e6b7c 100%)',
  'rainy':         'linear-gradient(160deg,#1c2430 0%,#303b4a 60%,#45525f 100%)',
  'pouring':       'linear-gradient(160deg,#161d27 0%,#28323f 60%,#3a4654 100%)',
  'lightning':     'linear-gradient(160deg,#15151f 0%,#272235 55%,#3a3450 100%)',
  'lightning-rainy':'linear-gradient(160deg,#13131c 0%,#231f31 55%,#332e48 100%)',
  'snowy':         'linear-gradient(160deg,#2a323d 0%,#475260 60%,#6b7888 100%)',
  'snowy-rainy':   'linear-gradient(160deg,#222a35 0%,#3a4554 60%,#566374 100%)',
  'hail':          'linear-gradient(160deg,#222a35 0%,#3a4554 60%,#566374 100%)',
  'fog':           'linear-gradient(160deg,#2e343c 0%,#4a515b 60%,#6c7480 100%)',
  'windy':         'linear-gradient(160deg,#26333b 0%,#3f5560 60%,#5d7f8c 100%)',
  'windy-variant': 'linear-gradient(160deg,#2a2636 0%,#433d59 60%,#5e5680 100%)',
  'exceptional':   'linear-gradient(160deg,#3a2a15 0%,#5e4422 60%,#8a6a2e 100%)',
};

// Labels FR des conditions
const COND_FR = {
  'sunny': 'Ensoleillé', 'clear-night': 'Nuit claire', 'partlycloudy': 'Partiellement nuageux',
  'cloudy': 'Nuageux', 'rainy': 'Pluie', 'pouring': 'Forte pluie', 'lightning': 'Orage',
  'lightning-rainy': 'Orage pluvieux', 'snowy': 'Neige', 'snowy-rainy': 'Pluie et neige',
  'hail': 'Grêle', 'fog': 'Brouillard', 'windy': 'Venteux', 'windy-variant': 'Très venteux',
  'exceptional': 'Exceptionnel',
};

const DAYS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

// Nettoie le friendly_name verbeux de Météo-France :
// "Météo-France forecast for city Burthecourt-aux-Chênes - Lorraine (54) - FR Burthecourt-aux-Chênes"
//   → "Burthecourt-aux-Chênes"
function cleanLocationName(fn) {
  if (!fn) return null;
  // cas Météo-France : "... for city XXX - Région ..." → on prend XXX.
  // On coupe sur " - " (tiret ENTOURÉ d'espaces) pour ne PAS casser les tirets
  // internes du nom (ex. Burthecourt-aux-Chênes).
  let m = fn.match(/for city\s+(.+?)\s+[-–]\s+/i);
  if (m) return m[1].trim();
  // sinon, retire les préfixes de provider connus puis coupe sur " - "
  let s = fn.replace(/^.*?forecast\s+(for\s+)?/i, '').trim();
  s = s.split(/\s+[-–]\s+/)[0].trim();
  return s || fn;
}

// ═══════════════════════════════════════════════════════
//  CARD
// ═══════════════════════════════════════════════════════
class WeatherNeonCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });  // CSS encapsulé → ne touche JAMAIS le thème
    this._built = false;
  }

  setConfig(config) {
    if (!config.entity) throw new Error('weather-neon-card : "entity" est requis (weather.*)');
    this._config = buildConfig(config);
    this._forecast = null;
    this._fcKey = null;
    this._lastHtml = null;
  }

  set hass(hass) {
    this._hass = hass;
    this._fetchForecast();
    this._render();
  }

  // Appel du service weather.get_forecasts (HA 2024+) — caché et rafraîchi périodiquement
  async _fetchForecast() {
    if (!this._hass || !this._config?.entity) return;
    const key = this._config.entity + '|' + this._config.forecast_type;
    const now = Date.now();
    if (this._fcKey === key && this._fcTs && now - this._fcTs < 5 * 60 * 1000) return; // 5 min
    this._fcKey = key; this._fcTs = now;
    try {
      const resp = await this._hass.callWS({
        type: 'execute_script',
        sequence: [{
          service: 'weather.get_forecasts',
          data: { type: this._config.forecast_type },
          target: { entity_id: this._config.entity },
          response_variable: 'r',
        }, { stop: 'done', response_variable: 'r' }],
      });
      const fc = resp?.response?.[this._config.entity]?.forecast;
      if (fc) { this._forecast = fc; this._render(); }
    } catch (e) {
      // certaines intégrations exposent encore forecast en attribut → fallback
      const at = this._hass.states[this._config.entity]?.attributes?.forecast;
      if (at) { this._forecast = at; this._render(); }
    }
  }

  // Construit le squelette UNE fois (style + ha-card) dans le shadowRoot.
  // CSS encapsulé → @keyframes et classes ne fuient PAS vers le thème.
  _build() {
    this.shadowRoot.innerHTML = `
      <style>${WeatherNeonCard.styles}</style>
      <ha-card>
        <div class="wsky"></div>
        <canvas class="wwind-canvas"></canvas>
        <canvas class="wrain-canvas"></canvas>
        <div class="wfxlayer"></div>
        ${this._config.neon_fx ? '<div class="wscan"></div>' : ''}
        <div class="winner"></div>
      </ha-card>`;
    this._elSky = this.shadowRoot.querySelector('.wsky');
    this._elFx = this.shadowRoot.querySelector('.wfxlayer');
    this._elWind = this.shadowRoot.querySelector('.wwind-canvas');
    this._elRain = this.shadowRoot.querySelector('.wrain-canvas');
    this._elInner = this.shadowRoot.querySelector('.winner');
    this._built = true;

    // Délégation de clic → more-info HA (pastilles Atmo + température). Posé 1x.
    this._elInner.addEventListener('click', e => {
      const el = e.target.closest('[data-atmo],[data-t]');
      if (!el) return;
      const entityId = el.getAttribute('data-atmo') || this._config.entity;
      if (!entityId) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', {
        detail: { entityId }, bubbles: true, composed: true,
      }));
    });

    // ResizeObserver : masque GLITCH quand la carte est trop étroite (portrait serré),
    // pour qu'il ne chevauche JAMAIS le texte. Seuil 300px. On lit offsetWidth (fiable)
    // et on ignore les mesures à 0 (premier fire avant layout).
    if (this._ro) this._ro.disconnect();
    const card = this.shadowRoot.querySelector('ha-card');
    this._ro = new ResizeObserver(() => {
      const w = card.offsetWidth;
      if (w > 0) this._elInner.classList.toggle('w-narrow', w < 300);
    });
    this._ro.observe(card);
  }

  disconnectedCallback() {
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this._glitchTimer) { clearTimeout(this._glitchTimer); this._glitchTimer = null; }
    if (this._windRAF) { cancelAnimationFrame(this._windRAF); this._windRAF = null; }
    if (this._windIO) { this._windIO.disconnect(); this._windIO = null; }
    if (this._rainRAF) { cancelAnimationFrame(this._rainRAF); this._rainRAF = null; }
    if (this._rainIO) { this._rainIO.disconnect(); this._rainIO = null; }
  }

  // ── VENT : nappes de brume soufflée (voiles ondulants semi-transparents qui
  //    dérivent) + particules portées par le flux. Inspiré du flux d'air de la
  //    climate-card. Cap 30 fps, pause hors écran. Densité/vitesse ∝ this._windForce
  //    (km/h), ajusté à chaud. Rien sous ~12 km/h.
  _startWind() {
    const cv = this._elWind;
    if (!cv) return;

    if (window.IntersectionObserver && !this._windIO) {
      this._windIO = new IntersectionObserver(es => { this._windOff = !es[0].isIntersecting; });
      this._windIO.observe(cv);
    }
    const fit = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv._w !== r.width || cv._h !== r.height) {
        cv.width = r.width * dpr; cv.height = r.height * dpr;
        cv._w = r.width; cv._h = r.height; cv._dpr = dpr;
      }
      return true;
    };
    fit();

    // pools créés une fois
    if (!this._windSheets) {
      this._windSheets = [...Array(4)].map((_, i) => ({
        t: Math.random() * 1000, y: 0.18 + i * 0.21, speed: 0.5 + Math.random() * 0.5,
        amp: 6 + Math.random() * 10, len: 0.5 + Math.random() * 0.4, thick: 16 + Math.random() * 22,
      }));
      this._windParts = [...Array(40)].map(() => ({ reset: true }));
    }
    if (this._windRAF) return;

    const W0 = () => cv._w, H0 = () => cv._h;
    const resetPart = (p, W, H, atEdge) => {
      p.x = atEdge ? -8 - Math.random() * 40 : Math.random() * W;
      p.y = Math.random() * H;
      p.r = 0.7 + Math.random() * 1.8;
      p.sp = 0.5 + Math.random() * 0.9;             // facteur de vitesse perso
      p.amp = 4 + Math.random() * 12;
      p.freq = 0.5 + Math.random() * 1.3;
      p.ph = Math.random() * Math.PI * 2;
      p.a = 0.25 + Math.random() * 0.4;
      p.reset = false;
    };

    const draw = (now) => {
      this._windRAF = requestAnimationFrame(draw);
      if (this._windOff || document.hidden) return;
      if (now - (this._windLast || 0) < 33) return;     // ~30 fps
      this._windLast = now;
      if (!fit()) return;
      const ctx = cv.getContext('2d'), dpr = cv._dpr, W = cv._w, H = cv._h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const force = this._windForce || 0;
      if (force < 12) return;                            // calme → rien
      const intensity = Math.min((force - 12) / 38, 1);  // 0→1
      const speed = 0.4 + intensity * 1.4;               // vitesse globale du flux

      // 1) NAPPES de brume : bandes horizontales ondulées, gradient doux, dérivent.
      const nSheets = 2 + Math.round(intensity * 2);     // 2 à 4 nappes
      for (let s = 0; s < nSheets; s++) {
        const sh = this._windSheets[s];
        sh.t += speed * sh.speed;
        const cy = sh.y * H;
        const grad = ctx.createLinearGradient(0, cy - sh.thick, 0, cy + sh.thick);
        grad.addColorStop(0, 'rgba(150,210,255,0)');
        grad.addColorStop(0.5, `rgba(170,225,255,${(0.05 + intensity * 0.07).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(150,210,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-20, cy);
        const seg = 10;
        for (let i = 0; i <= seg; i++) {
          const x = -20 + (W + 40) * (i / seg);
          const y = cy + Math.sin(sh.t * 0.04 + i * sh.len) * sh.amp;
          ctx.lineTo(x, y);
        }
        for (let i = seg; i >= 0; i--) {
          const x = -20 + (W + 40) * (i / seg);
          const y = cy + Math.sin(sh.t * 0.04 + i * sh.len) * sh.amp + sh.thick;
          ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }

      // 2) PARTICULES portées par le flux (poussières/feuilles) — petites traînées.
      const nParts = 12 + Math.round(intensity * 26);    // 12 à 38
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(190,230,255,1)';
      for (let i = 0; i < nParts; i++) {
        const p = this._windParts[i];
        if (p.reset || p.x === undefined) resetPart(p, W, H, true);
        const vx = speed * 2.4 * p.sp;
        p.x += vx;
        p.ph += 0.04 * p.freq;
        const yy = p.y + Math.sin(p.ph) * p.amp;
        ctx.globalAlpha = p.a * (0.5 + intensity * 0.5);
        ctx.lineWidth = p.r;
        ctx.beginPath();
        ctx.moveTo(p.x, yy);
        ctx.lineTo(p.x - vx * 2.2, yy + Math.sin(p.ph - 0.3) * 1.5);
        ctx.stroke();
        if (p.x > W + 12) resetPart(p, W, H, true);
      }
      ctx.globalAlpha = 1;
    };
    this._windRAF = requestAnimationFrame(draw);
  }

  // ── PLUIE : canvas de gouttes en biais + cercles d'impact (rebonds au sol).
  //    Adapté du code pluie trouvé par Chris (vanilla, sans les bonshommes).
  //    this._rainLevel = 0 (sec) à 1 (pouring). Cap 30 fps, pause hors écran.
  _startRain() {
    const cv = this._elRain;
    if (!cv) return;
    if (window.IntersectionObserver && !this._rainIO) {
      this._rainIO = new IntersectionObserver(es => { this._rainOff = !es[0].isIntersecting; });
      this._rainIO.observe(cv);
    }
    const fit = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv._w !== r.width || cv._h !== r.height) {
        cv.width = r.width * dpr; cv.height = r.height * dpr;
        cv._w = r.width; cv._h = r.height; cv._dpr = dpr;
      }
      return true;
    };
    fit();
    if (!this._rainDrops) { this._rainDrops = []; this._rainSplash = []; }
    if (this._rainRAF) return;

    const newDrop = (W, H, init) => {
      const sc = 0.3 + Math.random() * 0.7;                 // échelle (profondeur)
      return { x: Math.random() * (W + 80) - 40, y: init ? Math.random() * H : -20,
        len: 8 + sc * 14, vx: 1.2 + sc * 1.5, vy: 7 + sc * 9, sc, a: 0.25 + sc * 0.45 };
    };

    const draw = (now) => {
      this._rainRAF = requestAnimationFrame(draw);
      if (this._rainOff || document.hidden) return;
      if (now - (this._rainLast || 0) < 33) return;
      this._rainLast = now;
      if (!fit()) return;
      const ctx = cv.getContext('2d'), dpr = cv._dpr, W = cv._w, H = cv._h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const level = this._rainLevel || 0;
      const drops = this._rainDrops, splash = this._rainSplash;
      if (level <= 0) { drops.length = 0; splash.length = 0; return; }

      const target = Math.round(level * 120);               // densité ∝ niveau
      while (drops.length < target) drops.push(newDrop(W, H, drops.length < target / 2));
      if (drops.length > target) drops.length = target;

      ctx.lineCap = 'round';
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]; d.x += d.vx; d.y += d.vy;
        ctx.globalAlpha = d.a; ctx.strokeStyle = 'rgba(170,230,255,.9)'; ctx.lineWidth = 0.6 + d.sc * 1.2;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * 1.6, d.y - d.len); ctx.stroke();
        if (d.y > H) {                                       // impact → cercle d'éclaboussure
          splash.push({ x: d.x, y: H - 1, r: 1, max: 4 + d.sc * 7, a: 0.5 * d.sc + 0.2 });
          Object.assign(d, newDrop(W, H, false));
        }
      }
      for (let i = splash.length - 1; i >= 0; i--) {
        const s = splash[i]; s.r += 0.7; s.a *= 0.9;
        ctx.globalAlpha = s.a; ctx.strokeStyle = 'rgba(190,235,255,.8)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, Math.PI, Math.PI * 2); ctx.stroke();
        if (s.r > s.max || s.a < 0.03) splash.splice(i, 1);
      }
      ctx.globalAlpha = 1;
    };
    this._rainRAF = requestAnimationFrame(draw);
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._built) this._build();

    const st = this._hass.states[this._config.entity];
    if (!st) { this._elInner.innerHTML = `<div style="padding:16px">Entité introuvable : ${this._config.entity}</div>`; return; }

    const cond = st.state;
    const a = st.attributes;
    const name = this._config.name || cleanLocationName(a.friendly_name) || this._config.entity;
    const temp = Math.round(a.temperature);
    const unit = a.temperature_unit || '°C';

    // sensors externes (Météo-France) : vent + probas. Config explicite OU auto-détection
    // depuis le préfixe ville (weather.<base> → sensor.<base>_wind_speed, _rain_chance…).
    const ex = this._extra(a);
    // reactive_bg=false (défaut) → fond transparent : on laisse le thème / card-mod néon agir.
    const sky = this._config.reactive_bg ? (SKY[cond] || SKY['cloudy']) : 'transparent';

    // vigilance Météo-France (halo sur l'icône hero si ≥ Jaune)
    const vigi = this._config.alert_entity
      ? computeVigilance(this._hass.states[this._config.alert_entity])
      : null;
    const haloColor = vigi ? vigi.color : null;

    // forecast
    const fc = (this._forecast || []).slice(0, this._config.forecast_count);
    const isHourly = this._config.forecast_type === 'hourly';
    const fcHtml = fc.map(f => {
      const d = new Date(f.datetime);
      const lbl = isHourly ? `${String(d.getHours()).padStart(2, '0')}h` : DAYS_FR[d.getDay()];
      const hi = Math.round(f.temperature);
      const lo = f.templow != null ? Math.round(f.templow) : null;
      return `<div class="wday">
        <div class="wd">${lbl}</div>
        <div class="wmini">${iconSvg(f.condition, 46, null, false)}</div>
        <div class="whi">${hi}°</div>
        ${lo != null ? `<div class="wlo">${lo}°</div>` : ''}
      </div>`;
    }).join('');

    // stats secondaires — en pastilles (même style que les pastilles Atmo, pour l'homogénéité).
    // Couleur = cyan néon de la card (var --accent-color), distincte des couleurs Atmo.
    const statPill = (iconKey, v) => v == null ? '' :
      `<span class="watmo watmo-stat"><span class="watmo-i">${MINI_ICONS[iconKey]}</span><b>${v}</b></span>`;
    const pUnit = a.pressure_unit || 'hPa';
    const windVal = ex.wind != null ? ex.wind : a.wind_speed;  // sensor externe prioritaire
    const c = this._config;
    const stats = [
      c.show_humidity ? statPill('humidity', a.humidity != null ? a.humidity + ' %' : null) : '',
      c.show_wind     ? statPill('wind', windVal != null ? Math.round(windVal) + ' km/h' : null) : '',
      c.show_pressure ? statPill('pressure', a.pressure != null ? Math.round(a.pressure) + ' ' + pUnit : null) : '',
    ].join('');

    // pastilles Atmo France (qualité air + pollens) — cliquables, avec tendance J→J+1
    const atmoHtml = this._config.show_atmo ? [
      atmoPastille(this._hass, 'biohazard', this._config.air_entity,    this._config.air_entity_next),
      atmoPastille(this._hass, 'pollen',    this._config.pollen_entity, this._config.pollen_entity_next),
    ].join('') : '';

    // colonne droite : lever / coucher soleil (depuis sun.sun) + rafales
    let asideHtml = '';
    if (this._config.show_aside) {
      const sun = this._hass.states[this._config.sun_entity];
      const rows = [];
      if (sun) {
        const rise = fmtTime(sun.attributes.next_rising);
        const set = fmtTime(sun.attributes.next_setting);
        if (rise) rows.push(`<div class="war"><span class="wari">${MINI_ICONS.sunrise}</span><b>${rise}</b></div>`);
        if (set) rows.push(`<div class="war"><span class="wari">${MINI_ICONS.sunset}</span><b>${set}</b></div>`);
      }
      // rafales : affichées SEULEMENT si > 0 (sinon doublon inutile avec le vent des stats)
      const gustVal = ex.gust != null ? ex.gust : a.wind_gust_speed;
      if (gustVal != null && Math.round(gustVal) > 0) {
        rows.push(`<div class="war"><span class="wari">${MINI_ICONS.gust}</span><b>${Math.round(gustVal)} km/h</b></div>`);
      }
      if (rows.length) asideHtml = `<div class="waside">${rows.join('')}</div>`;
    }

    const tempCls = this._config.neon_fx ? 'wtemp wtemp-glitch' : 'wtemp';
    // couleur de GLITCH = vigilance si alerte active, sinon vert plasma
    const catColor = vigi ? vigi.color : '#4AF2A1';
    const glitch = this._config.glitch ? glitchHtml(cond, catColor) : '';

    // GLITCH : planqué SOUS le divider du forecast, il émerge par rafales (cf glitch-header).
    // La bande .wcatband est clippée sur le divider ; le chat (.wcat) part caché et émerge.
    const glitchBand = glitch ? `<div class="wcatband">${glitch}</div>` : '';

    const inner = `
      <div class="whero">
        <div class="wicon">${iconSvg(cond, 70, haloColor)}</div>
        <div class="${tempCls}" data-t="${temp}${unit}">${temp}<small>${unit}</small></div>
        <div class="wnow">
          <div class="wcond">${COND_FR[cond] || cond}</div>
          ${vigi ? `<div class="wvigi" style="color:${vigi.color}">⚠ Vigilance ${Object.keys(VIGI_RANK)[vigi.rank]} — ${vigi.risks.join(', ')}</div>` : ''}
          <div class="wloc">${name}</div>
        </div>
        ${asideHtml}
      </div>
      <div class="wstats">${stats}${atmoHtml}</div>
      ${fc.length ? `<div class="wforecast">${glitchBand}${fcHtml}</div>` : ''}`;

    // ne réécrit (et donc ne redémarre les animations SVG) QUE si le contenu a changé
    if (inner !== this._lastHtml) {
      this._elInner.innerHTML = inner;
      this._lastHtml = inner;
      this._startGlitchLife();  // (re)lance la vie de GLITCH sur le nouvel élément
    }

    // PLUIE (canvas) : niveau selon la condition réelle. Quand le canvas pluie est
    // actif, on ne génère PAS la pluie CSS (évite le doublon) → les spans CSS ne
    // couvrent plus que neige / poussières / annonces de proba.
    const rainLevel = cond === 'pouring' ? 1
      : ['rainy', 'lightning-rainy'].includes(cond) ? 0.6
      : cond === 'snowy-rainy' ? 0.4
      : (ex.rainCh >= 40 && this._config.particles) ? ex.rainCh / 100 * 0.4  // annonce forte → bruine
      : 0;
    this._rainLevel = this._config.particles ? rainLevel : 0;
    if (this._config.particles) this._startRain();

    // particules CSS (neige/poussières/annonces) — la pluie réelle est gérée par le canvas.
    // + flash d'éclair (double-coup) ajouté pour lightning ET lightning-rainy.
    if (this._config.particles) {
      const storm = (cond === 'lightning' || cond === 'lightning-rainy');
      const cssCond = rainLevel > 0 ? 'cloudy' : cond;   // neutralise la pluie CSS si canvas actif
      const fxKey = `${cssCond}|${ex.rainCh}|${ex.snowCh}|${rainLevel > 0 ? 'R' : ''}|${storm ? 'S' : ''}`;
      if (this._fxKey !== fxKey) {
        let html = particlesHtml(cssCond, rainLevel > 0 ? 0 : ex.rainCh, ex.snowCh);
        if (storm && !html.includes('wfx-flash')) {
          html = html ? html.replace('</div>', '<span class="wfx-flash"></span></div>')
                      : '<div class="wfx"><span class="wfx-flash"></span></div>';
        }
        this._elFx.innerHTML = html;
        this._fxKey = fxKey;
      }
    }
    // vent (canvas) : force = max(rafale, vent). Le moteur ajuste densité/vitesse à chaud.
    this._windForce = Math.max(ex.gust || 0, ex.wind || 0);
    if (this._config.particles) this._startWind();
    this._elSky.style.background = sky;  // le fond peut changer sans toucher au DOM animé
  }

  // résout les sensors externes (vent / rafales / probas) : config explicite, sinon
  // auto-détection depuis le préfixe ville (weather.<base> → sensor.<base>_<suffixe>).
  _extra(a) {
    const S = this._hass.states;
    const base = entityBase(this._config.entity);
    const num = (eid) => {
      const s = eid && S[eid];
      if (!s) return null;
      const v = parseFloat(s.state);
      return isNaN(v) ? null : v;
    };
    const pick = (cfg, suffix) => num(cfg) ?? num(`sensor.${base}_${suffix}`);
    return {
      wind:    pick(this._config.wind_entity, 'wind_speed'),
      gust:    pick(null, 'wind_gust'),
      rainCh:  pick(this._config.rain_chance_entity, 'rain_chance') ?? 0,
      snowCh:  pick(this._config.snow_chance_entity, 'snow_chance') ?? 0,
    };
  }

  // GLITCH émerge du divider par RAFALES (principe glitch-header) : il pop, joue une
  // brique d'anim au hasard, replonge. Discret — apparition espacée, pas permanent.
  _startGlitchLife() {
    if (this._glitchTimer) { clearTimeout(this._glitchTimer); this._glitchTimer = null; }
    if (!this._config.glitch) return;
    const cat = this._elInner.querySelector('.wcat');
    if (!cat) return;

    const DOS = ['wcat-do-nod', 'wcat-do-wink', 'wcat-do-vib'];  // brique pendant le pic
    const pop = () => {
      if (this.classList.contains('w-narrow') || document.hidden) { schedule(); return; }
      const dur = 2600 + Math.random() * 800;                    // durée du pop : 2.6–3.4 s
      const doCls = DOS[Math.floor(Math.random() * DOS.length)];
      const x = 4 + Math.random() * 80;                          // X aléatoire : 4–84% du divider
      cat.style.setProperty('--pop-x', x.toFixed(1) + '%');
      cat.style.setProperty('--pop-dur', dur + 'ms');
      cat.classList.add('wcat-pop', doCls);
      setTimeout(() => cat.classList.remove('wcat-pop', doCls), dur + 60);
      schedule();
    };
    const schedule = () => {
      const delay = 9000 + Math.random() * 14000;  // 9–23 s entre deux apparitions (discret)
      this._glitchTimer = setTimeout(pop, delay);
    };
    schedule();
  }

  getCardSize() { return 4; }
  static getConfigElement() { return document.createElement('weather-neon-card-editor'); }
  static getStubConfig(hass) {
    const states = hass?.states || {};
    const w = Object.keys(states).find(e => e.startsWith('weather.'));
    const al = Object.keys(states).find(e => e.includes('weather_alert'));
    const cfg = { entity: w || 'weather.home', forecast_type: 'daily', forecast_count: 5 };
    if (al) cfg.alert_entity = al;
    return cfg;
  }
}

WeatherNeonCard.styles = `
  /* fond = celui du thème (sombre semi-opaque comme les cartes natives) → lisible,
     ET laisse passer le glow néon du card-mod. PAS transparent (sinon on voit le dashboard). */
  ha-card { position:relative; overflow:hidden; border-radius:var(--ha-card-border-radius,18px); color:#eef2f7;
    background:var(--ha-card-background, var(--card-background-color, rgba(18,20,30,.78))); }
  .wsky { position:absolute; inset:0; z-index:0; transition:background 1.2s ease; }
  .winner { position:relative; z-index:2; padding:10px 14px 9px; }
  .whero { display:flex; align-items:center; gap:10px; }
  .wicon { flex:none; }
  /* temp = bloc fixe ; cond/village = bloc à DROITE de la temp (compactage hauteur) */
  /* temp : traitement glow multi-couches (calé sur dual-thermo-card) */
  .wtemp { flex:none; font-size:50px; font-weight:900; letter-spacing:-2.5px; line-height:.95;
    color:#fff; mix-blend-mode:screen;
    text-shadow:
      0 0 3px rgba(255,255,255,.9),
      0 0 12px var(--accent-color, #00E5FF),
      0 0 30px var(--accent-color, #00E5FF),
      0 0 60px color-mix(in srgb, var(--accent-color, #00E5FF) 40%, transparent); }
  .wtemp small { font-size:.5em; vertical-align:super; margin-left:2px; opacity:.85; font-weight:500; }
  .wnow { flex:1; min-width:0; position:relative; }
  .wicon .wico { filter:drop-shadow(0 0 10px rgba(0,229,255,.25)); }
  .wcond { font-size:15px; opacity:.92; }
  .waside { flex:none; display:flex; flex-direction:column; gap:8px; align-items:flex-end;
    font-size:11.5px; opacity:.92; }
  .war { display:flex; align-items:center; gap:6px; white-space:nowrap; }
  .war b { font-weight:600; }
  .wari { display:flex; }
  .wvigi { font-size:11px; font-weight:600; margin-top:3px; letter-spacing:.3px;
    text-shadow:0 0 8px currentColor; }
  .wloc { font-size:11px; opacity:.55; margin-top:2px; letter-spacing:.4px; text-transform:uppercase;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .wstats { display:flex; align-items:center; gap:16px; margin:8px 2px 0; font-size:12.5px; opacity:.88; flex-wrap:wrap; }
  .wstats .wk { opacity:.6; }
  .wstats b { font-weight:600; }
  /* pastilles Atmo (qualité air / pollens) — couleur Atmo via la var inline color: */
  .watmo { display:inline-flex; align-items:center; gap:5px; padding:2px 9px;
    border-radius:11px; font-size:11.5px; cursor:pointer; white-space:nowrap;
    border:1px solid color-mix(in srgb, currentColor 45%, transparent);
    background:color-mix(in srgb, currentColor 12%, transparent);
    box-shadow:0 0 8px color-mix(in srgb, currentColor 28%, transparent);
    text-shadow:0 0 6px color-mix(in srgb, currentColor 60%, transparent);
    transition:filter .15s, box-shadow .15s; }
  .watmo:hover { filter:brightness(1.2); box-shadow:0 0 12px color-mix(in srgb, currentColor 45%, transparent); }
  .watmo:active { filter:brightness(.9); }
  .watmo-i { display:inline-flex; filter:drop-shadow(0 0 4px color-mix(in srgb, currentColor 70%, transparent)); }
  .watmo b { font-weight:700; letter-spacing:.2px; }
  .watmo-tr { font-size:9px; opacity:.85; margin-left:1px; }
  /* pastilles stats (humidité/vent/pression) : même style, couleur cyan néon, non cliquables */
  .watmo-stat { color:var(--accent-color, #00e5ff); cursor:default; }
  .watmo-stat:hover { filter:none; box-shadow:0 0 8px color-mix(in srgb, currentColor 28%, transparent); }
  .wforecast { display:flex; justify-content:space-between; gap:6px; margin-top:8px;
    padding-top:8px; border-top:1px solid rgba(255,255,255,.13); position:relative; }
  .wday { flex:1; text-align:center; }
  .wday .wd { font-size:11px; opacity:.7; margin-bottom:1px; letter-spacing:.5px; }
  .wmini { display:flex; justify-content:center; margin:1px 0; }
  .wmini .wico { filter:drop-shadow(0 0 7px rgba(0,229,255,.25)); }
  .whi { font-size:14px; font-weight:600; }
  .wlo { font-size:11.5px; opacity:.55; }

  /* ─── PARTICULES ATMOSPHÉRIQUES (calque plein écran) ─── */
  .wfxlayer { position:absolute; inset:0; z-index:1; overflow:hidden; pointer-events:none; }
  .wfx { position:absolute; inset:0; }
  .wfx-rain { position:absolute; top:-12%; width:1.5px; height:16px;
    background:linear-gradient(transparent, rgba(125,249,255,.6)); animation:wrain linear infinite; }
  .wfx-snow { position:absolute; top:-8%; width:4px; height:4px; border-radius:50%;
    background:rgba(255,255,255,.8); animation:wsnow linear infinite; }
  .wwind-canvas, .wrain-canvas { position:absolute; inset:0; z-index:1; pointer-events:none;
    -webkit-mask:linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
            mask:linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%); }
  .wfx-dust { position:absolute; width:3px; height:3px; border-radius:50%;
    background:#ffe9a8; opacity:.5; animation:wdust ease-in-out infinite; }
  .wfx-ray { position:absolute; top:-30%; left:18%; width:160px; height:300px;
    background:linear-gradient(180deg, rgba(255,225,100,.18), transparent);
    transform:rotate(18deg); filter:blur(10px); animation:wray 7s ease-in-out infinite; }
  .wfx-flash { position:absolute; inset:0; opacity:0; mix-blend-mode:screen;
    background:linear-gradient(180deg, rgba(220,240,255,.9) 0%, rgba(150,200,255,.4) 45%, transparent 80%);
    animation:wflash 8s ease-out infinite; animation-delay:1.5s; }

  /* ─── SCANLINES NÉON (Neo Tokyo) ─── */
  .wscan { position:absolute; inset:0; z-index:3; pointer-events:none; mix-blend-mode:overlay;
    background:repeating-linear-gradient(0deg, rgba(0,229,255,.08) 0px, rgba(0,229,255,.08) 1px, transparent 2px, transparent 4px);
    animation:wscanmove 9s linear infinite; }
  /* glitch : superpose le split RGB AU glow multi-couches dual-thermo (au lieu de l'écraser) */
  .wtemp-glitch { text-shadow:
      0 0 3px rgba(255,255,255,.9),
      0 0 12px var(--accent-color, #00E5FF),
      0 0 30px var(--accent-color, #00E5FF),
      0 0 60px color-mix(in srgb, var(--accent-color, #00E5FF) 40%, transparent),
      1.5px 0 rgba(255,45,107,.7),
      -1.5px 0 rgba(0,229,255,.7);
    animation:wtglitch 5s steps(1) infinite; }

  /* ─── GLITCH émerge du DIVIDER du forecast (principe glitch-header.js) ───
        .wcatband = bande ancrée sur la ligne de séparation, clippée vers le haut ;
        le chat est planqué SOUS la ligne (translateY 100%) et pop par rafales (JS). */
  .wcatband { position:absolute; left:0; right:0; bottom:100%; height:60px;
    overflow:hidden; pointer-events:none; z-index:4; }
  /* X aléatoire le long du divider via --pop-x (posé par le JS), opacité réduite (discret) */
  .wcat { width:58px; height:52px; position:absolute; bottom:0; left:var(--pop-x,42%);
    transform:translateY(110%);  /* caché sous le divider au repos */
    opacity:.62; mix-blend-mode:screen; filter:drop-shadow(0 0 7px var(--cat-glow,#4af2a1)); }
  .wcat svg { position:absolute; left:0; top:0; width:58px; height:52px; }
  /* POP : émerge, joue, replonge (JS pose .wcat-pop le temps de l'apparition) */
  .wcat.wcat-pop { animation:wcatpop var(--pop-dur,2800ms) ease-in-out; }
  /* card trop étroite (portrait serré) → pas de pop */
  .winner.w-narrow .wcatband { display:none; }
  .wcat-r { animation:wcatr 2.8s steps(2) infinite; }
  .wcat-c { animation:wcatc 2.8s steps(2) infinite; }
  .wcat-shiver { animation:wcatshiver .25s steps(2) infinite; }
  .wcat-crazy .wcat-r { animation:wcatr 1s steps(2) infinite; }
  .wcat-crazy .wcat-c { animation:wcatc 1s steps(2) infinite; }
  /* brique d'anim jouée PENDANT le pic du pop (sur le calque principal interne) */
  .wcat-do-nod  .wcat-m { animation:wcatnod 1.2s ease-in-out; }
  .wcat-do-wink .wcat-lid { animation:wcatwink .42s ease-in-out .6s; }
  .wcat-do-vib  .wcat-m { animation:wcatvib .4s steps(2) 3; }
  .wcat-lid { transform-box:fill-box; transform-origin:center top; transform:scaleY(0); }

  @keyframes wspin { to { transform:rotate(360deg); } }
  @keyframes wdrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
  @keyframes wfall { 0%{transform:translateY(-6px);opacity:0} 30%{opacity:1} 100%{transform:translateY(12px);opacity:0} }
  @keyframes wrain { to { transform:translateY(260px); } }
  @keyframes wsnow { to { transform:translateY(240px) translateX(14px); } }
  @keyframes wdust { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-12px);opacity:.85} }
  @keyframes wray { 0%,100%{transform:rotate(18deg) scaleY(1);opacity:.8} 50%{transform:rotate(14deg) scaleY(1.1);opacity:1} }
  /* éclair : double-coup irrégulier (inspiré du flash CSS trouvé par Chris) */
  @keyframes wflash {
    0%,90%   { opacity:0; }
    91%      { opacity:.7; }   /* premier éclat */
    92%      { opacity:.15; }
    93%      { opacity:1; }     /* re-coup plus fort */
    95%      { opacity:.3; }
    97%      { opacity:.85; }   /* dernier sursaut */
    100%     { opacity:0; }
  }
  @keyframes wscanmove { to { background-position:0 220px; } }
  @keyframes wtglitch { 0%,92%,100%{transform:translate(0)} 93%{transform:translate(-2px,1px)} 95%{transform:translate(2px,-1px)} 97%{transform:translate(-1px,0)} }
  @keyframes wcatr { 0%,80%{transform:translate(0)} 85%{transform:translate(-4px,1px)} 91%{transform:translate(3px,-1px)} 97%{transform:translate(-2px,0)} }
  @keyframes wcatc { 0%,80%{transform:translate(0)} 85%{transform:translate(4px,-1px)} 91%{transform:translate(-3px,1px)} 97%{transform:translate(2px,0)} }
  @keyframes wcatshiver { 0%,100%{transform:translate(0)} 25%{transform:translate(-1.2px,0)} 75%{transform:translate(1.2px,.4px)} }
  /* vie : nod (hoche la tête), vibration, bump (petit saut), wink (clin d'œil) */
  @keyframes wcatnod { 0%,100%{transform:translateY(0)} 30%{transform:translateY(4px)} 60%{transform:translateY(0)} 80%{transform:translateY(2px)} }
  @keyframes wcatvib { 0%,100%{transform:translate(0)} 50%{transform:translate(1.2px,-.6px)} }
  @keyframes wcatbump { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-6px)} 45%{transform:translateY(0)} 60%{transform:translateY(-3px)} 75%{transform:translateY(0)} }
  /* wink : la paupière descend (0→1, ferme l'œil) puis remonte (1→0, rouvre) */
  @keyframes wcatwink { 0%,100%{transform:scaleY(0)} 45%,55%{transform:scaleY(1)} }
  /* POP : émerge du divider (110%→0, sort la tête+corps), tient un instant, replonge */
  @keyframes wcatpop {
    0%   { transform:translateY(110%); }
    18%  { transform:translateY(-2%); }   /* sort entièrement avec un léger dépassement */
    24%  { transform:translateY(2%); }
    80%  { transform:translateY(0%); }    /* reste visible pendant le numéro */
    100% { transform:translateY(110%); }  /* replonge sous le divider */
  }
`;

customElements.define('weather-neon-card', WeatherNeonCard);

// ═══════════════════════════════════════════════════════
//  EDITOR — conforme CLAUDE.md §22 :
//  build UNE seule fois (_built), puis _syncValues() chirurgical avec guard
//  activeElement ; entités en <input>+<datalist> (PAS <select> brut qui se
//  réinitialise/perd le focus à chaque set hass → c'était LE bug habituel).
// ═══════════════════════════════════════════════════════
class WeatherNeonCardEditor extends HTMLElement {
  // §Éditeur A (CARDS-METHOD.md) : setConfig appelé à CHAQUE frappe (écho HA).
  // 1er appel → _render() complet ; ensuite → _syncValues() in-place uniquement.
  setConfig(config) {
    this._config = { ...config };
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  // JAMAIS de render dans set hass (doc §Éditeur). On stocke + remplit les listes 1x.
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first && this._rendered) this._fillLists();
  }

  _render() {
    this._build();
    if (this._hass) this._fillLists();
    this._syncValues();
  }

  _build() {
    this.innerHTML = `
      <style>
        .wne-wrap{display:flex;flex-direction:column;gap:12px;padding:8px 4px}
        .wne-wrap label{font-size:13px;display:flex;flex-direction:column;gap:4px}
        .wne-wrap input,.wne-wrap select{width:100%;padding:6px;box-sizing:border-box}
        .wne-row{flex-direction:row !important;align-items:center;gap:8px}
        .wne-row input{width:auto}
      </style>
      <div class="wne-wrap">
        <label>Entité météo
          <input data-key="entity" list="wne-weathers" placeholder="weather.…">
          <datalist id="wne-weathers"></datalist>
        </label>
        <label>Type de prévision
          <select data-key="forecast_type">
            <option value="daily">Journalier</option>
            <option value="hourly">Horaire</option>
          </select>
        </label>
        <label>Nombre de colonnes
          <input data-key="forecast_count" data-num type="number" min="3" max="9">
        </label>
        <label>Entité vigilance (optionnel)
          <input data-key="alert_entity" list="wne-alerts" placeholder="sensor.…_weather_alert">
          <datalist id="wne-alerts"></datalist>
        </label>
        <label>Entité soleil (lever/coucher)
          <input data-key="sun_entity" list="wne-suns" placeholder="sun.sun">
          <datalist id="wne-suns"></datalist>
        </label>
        <label class="wne-row"><input data-key="show_humidity" data-defaultOn type="checkbox"> Stat : Humidité</label>
        <label class="wne-row"><input data-key="show_wind" data-defaultOn type="checkbox"> Stat : Vent</label>
        <label class="wne-row"><input data-key="show_pressure" data-defaultOn type="checkbox"> Stat : Pression</label>
        <label class="wne-row"><input data-key="show_atmo" data-defaultOn type="checkbox"> Pastilles qualité air / pollens ☣</label>
        <label>Qualité de l'air — aujourd'hui (Atmo France)
          <input data-key="air_entity" list="wne-atmo" placeholder="sensor.atmo_france_qualite_globale_…">
        </label>
        <label>Qualité de l'air — demain (J+1, tendance)
          <input data-key="air_entity_next" list="wne-atmo" placeholder="…_j_1">
        </label>
        <label>Pollens — aujourd'hui
          <input data-key="pollen_entity" list="wne-atmo" placeholder="sensor.atmo_france_qualite_globale_pollen_…">
        </label>
        <label>Pollens — demain (J+1, tendance)
          <input data-key="pollen_entity_next" list="wne-atmo" placeholder="…_pollen_…_j_1">
        </label>
        <datalist id="wne-atmo"></datalist>
        <label class="wne-row"><input data-key="show_aside" data-defaultOn type="checkbox"> Colonne lever/coucher/rafales</label>
        <label class="wne-row"><input data-key="glitch" data-defaultOn type="checkbox"> GLITCH le chat 🐱</label>
        <label class="wne-row"><input data-key="particles" data-defaultOn type="checkbox"> Particules atmosphériques</label>
        <label class="wne-row"><input data-key="neon_fx" data-defaultOn type="checkbox"> Effets néon (scanlines)</label>
        <label class="wne-row"><input data-key="reactive_bg" type="checkbox"> Fond réactif à la météo</label>
      </div>`;
    // listeners (une seule fois). 'change' = commit au blur / à la sélection datalist
    // → l'écho setConfig arrive quand le champ n'a plus le focus, donc _syncValues
    // ne réécrit jamais pendant la frappe. (input live = boucle d'écho, à éviter ici.)
    this.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('change', () => this._onInput(el));
    });
  }

  _fillLists() {
    const opts = (arr) => arr.map(e => `<option value="${e}"></option>`).join('');
    const weathers = Object.keys(this._hass.states).filter(e => e.startsWith('weather.'));
    const alerts = Object.keys(this._hass.states).filter(e =>
      e.includes('weather_alert') || this._hass.states[e].attributes?.['Vent violent'] != null);
    const suns = Object.keys(this._hass.states).filter(e => e.startsWith('sun.'));
    const atmo = Object.keys(this._hass.states).filter(e => e.startsWith('sensor.atmo_france_'));
    const set = (id, arr) => { const d = this.querySelector('#' + id); if (d) d.innerHTML = opts(arr); };
    set('wne-weathers', weathers); set('wne-alerts', alerts); set('wne-suns', suns); set('wne-atmo', atmo);
  }

  // l'utilisateur est-il en train de taper dans un champ de l'éditeur ?
  // (le focus traverse mal le shadow DOM → on teste activeElement ET :focus dans this)
  _isEditing() {
    const a = this.querySelector(':focus') || document.activeElement;
    return !!a && this.contains(a) && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName);
  }

  // pousse les valeurs config dans les champs SANS toucher au champ en cours d'édition
  _syncValues() {
    const c = this._config || {};
    const active = this.querySelector(':focus') || document.activeElement;
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el === active) return; // ne JAMAIS réécrire le champ qu'on édite (sinon curseur saute)
      const k = el.dataset.key;
      if (el.type === 'checkbox') {
        el.checked = el.hasAttribute('data-defaultOn') ? (c[k] !== false) : !!c[k];
      } else {
        const v = c[k];
        el.value = v == null ? '' : v;
      }
    });
  }

  _onInput(el) {
    const k = el.dataset.key;
    let v;
    if (el.type === 'checkbox') v = el.checked;
    else if (el.hasAttribute('data-num')) v = parseInt(el.value) || undefined;
    else v = el.value.trim() || null;
    this._config = { ...this._config, [k]: v };
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}
customElements.define('weather-neon-card-editor', WeatherNeonCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'weather-neon-card',
  name: 'Weather Neon Card',
  description: 'Carte météo néon avec icônes SVG animées outline et fond réactif',
  preview: true,
});

console.info(`%c WEATHER-NEON-CARD %c v${VERSION} `, 'background:#00e5ff;color:#000;font-weight:bold', 'background:#222;color:#7df9ff');
