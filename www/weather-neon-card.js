/**
 * weather-neon-card v3.0.0
 * Carte météo néon Neo Tokyo pour Home Assistant.
 * Icônes SVG animées · accent couleur par météo · forecast en tuiles + barre min/max ·
 * FX canvas (pluie, vent, brouillard, givre, éclairs ramifiés) · nuit étoilée + lune à
 * phase réelle · vigilance Météo-France · Atmo France (air/pollens) · GLITCH le chat.
 *
 * Installation :
 *   1. Copier dans /config/www/weather-neon-card.js
 *   2. Ressources HA → /local/weather-neon-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:weather-neon-card
 *   entity: weather.ma_station
 *
 * Options (défaut) :
 *   entity            (requis)   entité weather.*
 *   name                         libellé du lieu (défaut: friendly_name nettoyé)
 *   forecast_type     (daily)    daily | hourly
 *   forecast_count    (5)        nb de colonnes de prévision
 *   reactive_bg       (false)    fond dégradé selon la météo (sinon fond du thème)
 *   alert_entity                 vigilance MF, ex: sensor.54_weather_alert
 *   sun_entity        (sun.sun)  lever/coucher pour la colonne droite + repli jour/nuit
 *   night_from_sun    (true)     recalcule jour/nuit ici (MF commute sur tranches horaires
 *                                fixes, pas sur l'éphéméride) ; false = condition brute
 *   lux_entity   (…moyenne_5_min) capteur de luminosité, 1re intention ; vide = soleil seul
 *   show_aside        (true)     colonne droite (lever/coucher/rafales)
 *   glitch            (true)     GLITCH le chat (pop depuis le divider)
 *   particles         (true)     tous les effets atmosphériques (CSS + canvas)
 *   neon_fx           (true)     scanlines + température glitchée
 *   frost             (true)     givre fractal quand temp ≤ frost_below
 *   frost_below       (3)        seuil °C du givre
 *   mood_accent       (true)     l'accent couleur de la card suit la condition
 *   orbitron          (false)    typo Orbitron (Google Fonts) sur temp/jours
 *   wind_entity / rain_chance_entity / snow_chance_entity   (auto-détectés sinon)
 *   show_humidity / show_wind / show_pressure (true)
 *   show_atmo         (true)     pastilles Atmo France
 *   air_entity (+ air_entity_next) / pollen_entity (+ pollen_entity_next)
 */

const VERSION = '3.1.1';

// ── Device detection (cf CARDS-METHOD.md) — allège les effets canvas sur tablette/mobile
const WNC_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const WNC_IS_LOW_POWER = WNC_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

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
    // Bascule jour/nuit : Météo-France commute sur des TRANCHES HORAIRES fixes, pas sur
    // l'éphéméride du lieu (d'où l'impression d'un basculement figé vers 22h alors que le
    // coucher réel est à 20h54). On la recalcule donc ici : luminosité en 1re intention,
    // sun_entity en repli. `false` → on garde la condition brute de l'intégration.
    // `in` et pas `??` : vider le champ dans l'éditeur envoie null, et `null ?? défaut`
    // rendrait le défaut -> impossible de dire "pas de capteur, utilise le soleil".
    lux_entity:    ('lux_entity' in raw) ? raw.lux_entity : 'sensor.luminosite_moyenne_5_min',
    night_from_sun: raw.night_from_sun ?? true,
    show_aside:    raw.show_aside    ?? true,  // colonne droite (lever/coucher/rafales)
    glitch:        raw.glitch        ?? true,  // GLITCH le chat réactif à la météo
    particles:     raw.particles     ?? true,  // effets atmosphériques (CSS + canvas)
    frost:         raw.frost         ?? true,  // cristaux de givre quand temp ≤ frost_below
    frost_below:   raw.frost_below   ?? 3,     // seuil °C de déclenchement du givre
    neon_fx:       raw.neon_fx       ?? true,  // scanlines + temp glitchée (Neo Tokyo)
    mood_accent:   raw.mood_accent   ?? true,  // accent couleur de la card = condition météo
    orbitron:      raw.orbitron      ?? false, // typo Orbitron (Google Fonts) temp/jours
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

// familles de conditions (partagées entre particules, canvas et render)
const WET_CONDS   = new Set(['rainy', 'pouring', 'lightning-rainy', 'snowy-rainy']);
const SNOW_CONDS  = new Set(['snowy', 'hail']);
const STORM_CONDS = new Set(['lightning', 'lightning-rainy']);
const NIGHT_CONDS = new Set(['clear-night', 'partlycloudy-night']);

// Conditions ayant une variante nocturne. `rainy-night` est une invention MAISON :
// Météo-France ne l'émet jamais. La météo dit s'il pleut, la card sait s'il fait nuit.
const NIGHT_OF = { 'sunny': 'clear-night', 'clear': 'clear-night',
                   'partlycloudy': 'partlycloudy-night', 'rainy': 'rainy-night' };

// Hystérésis : on bascule en NUIT sous 10 lx, on ne revient en JOUR qu'au-dessus de 30 lx.
// Sans ça, un capteur brut qui oscille autour du seuil (phare de voiture, lampe allumée à
// proximité) ferait clignoter l'icône. Mesuré sur place : coucher réel 20h54 -> <10 lx vers
// 21h26 ; lever réel 06h25 -> >10 lx vers 06h07. Midi = ~48000 lx, aucun risque de collision.
const LUX_NIGHT = 10, LUX_DAY = 30;

/** Fait-il nuit ? Luminosité en 1re intention, position du soleil en repli.
 *  `prev` = dernier verdict connu, pour tenir l'hystérésis. */
function isNight(hass, cfg, prev) {
  const lx = cfg.lux_entity && hass.states[cfg.lux_entity];
  if (lx && lx.state !== 'unavailable' && lx.state !== 'unknown') {
    const v = parseFloat(lx.state);
    if (Number.isFinite(v)) {
      if (v <= LUX_NIGHT) return true;
      if (v >= LUX_DAY)   return false;
      if (prev !== undefined) return prev;   // dans la zone morte : on ne bouge pas
    }
  }
  const sun = hass.states[cfg.sun_entity];   // repli : éphéméride exacte du lieu
  return sun ? sun.state === 'below_horizon' : false;
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
const CY = '#7df9ff', YEL = '#ffe14d', WHT = '#dfeef7';

// dégradés néon partagés (inspirés des icônes IA — version animée maison)
const SVG_DEFS = `
  <linearGradient id="wg-cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aef9ff"/><stop offset="1" stop-color="#0090ff"/></linearGradient>
  <linearGradient id="wg-vio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b3ff"/><stop offset="1" stop-color="#7a4dff"/></linearGradient>
  <linearGradient id="wg-grey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd8e6"/><stop offset="1" stop-color="#7e8ca0"/></linearGradient>
  <radialGradient id="wg-suncore" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fffde6"/><stop offset="40%" stop-color="#ffd34d"/><stop offset="100%" stop-color="#ff8a00"/></radialGradient>
  <filter id="wglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
const GCY = 'url(#wg-cyan)', GVIO = 'url(#wg-vio)', GGREY = 'url(#wg-grey)';
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
// Retire les animations SVG SMIL (<animate>, <animateTransform>, <animateMotion>) —
// le CSS animation:none ne les coupe PAS. Sur iPad/mobile → icônes figées (statiques).
function _stripSmil(svg) {
  return svg.replace(/<animate(Transform|Motion)?\b[^>]*\/>/g, '')
            .replace(/<animate(Transform|Motion)?\b[^>]*>[\s\S]*?<\/animate(Transform|Motion)?>/g, '');
}
// Cache d'icônes : les strings SVG sont déterministes par (cond, taille, halo, kanji)
// → on ne les reconstruit (ni ne repasse la regex _stripSmil) qu'une fois.
const ICON_CACHE = new Map();
// withKanji défaut FALSE depuis la 3.1.1 : Chris a fait retirer le petit kanji en
// haut-gauche de l'icône (il restait le watermark de fond, lui, inchangé). Passer
// `true` à l'appel le remet — la table KANJI et kanji() sont conservées exprès.
function iconSvg(condition, size, haloColor, withKanji = false) {
  const key = `${condition}|${size}|${haloColor || ''}|${withKanji ? 1 : 0}`;
  let out = ICON_CACHE.get(key);
  if (!out) {
    const fn = ICONS[condition] || ICONS['cloudy'];
    const k = withKanji ? kanji(condition, KANJI_COL[condition] || '#7df9ff') : '';
    out = svgWrap(fn() + k, size, haloColor);
    if (WNC_IS_LOW_POWER) out = _stripSmil(out);   // iPad/mobile : icônes statiques
    ICON_CACHE.set(key, out);
  }
  return out;
}

// ── ACCENT PAR MÉTÉO (mood_accent) : la couleur d'accent de la card suit la condition.
//    Appliquée via --wnc-acc sur ha-card ; le CSS retombe sur --accent-color du thème
//    quand l'option est coupée (variables standard, jamais de couleur figée).
const ACCENT = {
  sunny: '#ffb64d', 'clear-night': '#8f9fff',
  partlycloudy: '#9fd4ff', 'partlycloudy-night': '#8f9fff',
  cloudy: '#8fa8c9', rainy: '#00e5ff', 'rainy-night': '#00e5ff', pouring: '#00e5ff',
  lightning: '#9a7dff', 'lightning-rainy': '#9a7dff',
  snowy: '#cfe8ff', 'snowy-rainy': '#9fd4ff', hail: '#cfe8ff',
  fog: '#9fb2c9', windy: '#6fe3d2', 'windy-variant': '#9a7dff',
  exceptional: '#ffe14d',
};

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
  if (STORM_CONDS.has(cond))
    return `<polygon points="44,1 38,12 42.5,12 37,21 47,9.5 42.5,9.5 46,1" fill="#ffe14d"/>`; // éclair
  return '';
}
// classe d'animation selon météo : grelotte si froid/neige, affolé si orage
function glitchMood(cond) {
  if (['snowy', 'hail', 'snowy-rainy'].includes(cond)) return 'wcat-shiver';
  if (STORM_CONDS.has(cond)) return 'wcat-crazy';
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

// ═══════════════════════════════════════════════════════
//  PARTICULES & DÉCORS CSS (pluie/neige/rayons/nuit)
// ═══════════════════════════════════════════════════════
// générateurs de particules réutilisables (n = nombre, opacité optionnelle pour les "annonces")
const _rainSpans = (n, op = 1) => [...Array(n)].map((_, i) =>
  `<span class="wfx-rain" style="left:${(i * 6.3) % 100}%;animation-delay:${(i % 7) * 0.13}s;animation-duration:${0.7 + (i % 4) * 0.18}s;opacity:${op}"></span>`).join('');
// NEIGE PARALLAXE (technique radial-gradient trouvée par Chris) : on génère UNE tuile
// carrée de N flocons figés (radial-gradients empilés), puis 3 calques .wsnowfield
// /:before/:after la font défiler à 3 vitesses+blurs+opacités → effet de profondeur.
// Bien plus léger que des dizaines de spans : 3 éléments, juste background-position animé.
const SNOW_W = 600;  // taille de la tuile (px) — = distance de défilement d'une boucle
const _snowGrad = (density) => {
  const g = [];
  for (let i = 0; i < density; i++) {
    const v = Math.floor(Math.random() * 4) + 2;                 // rayon du flocon (2–5 px)
    const a = (Math.floor(Math.random() * 5) * 0.1 + 0.5).toFixed(2); // alpha 0.5–0.9
    const x = Math.floor(Math.random() * (SNOW_W - v * 2)) + v;
    const y = Math.floor(Math.random() * (SNOW_W - v * 2)) + v;
    g.push(`radial-gradient(${v}px ${v}px at ${x}px ${y}px, rgba(255,255,255,${a}) 50%, rgba(0,0,0,0))`);
  }
  return g.join(',');
};
const _snowField = (n, op = 1) => {
  const grad = _snowGrad(Math.max(18, n * 3));
  return `<div class="wsnowfield" style="--snow-grad:${grad};opacity:${op}"></div>`;
};

// Phase de lune réelle, calculée en JS pur (zéro capteur) : cycle synodique depuis
// la nouvelle lune de référence du 6 janvier 2000. 0 = nouvelle, 0.5 = pleine.
function moonPhase() {
  const SYNODIC = 29.53058867, NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) / 864e5;
  return ((Date.now() / 864e5 - NEW_MOON) % SYNODIC + SYNODIC) % SYNODIC / SYNODIC;
}
// Lune SVG : disque sombre + demi-disque éclairé + ellipse de terminateur (technique
// classique des 2 arcs — juste pour les phases, pas d'éphéméride complète).
function moonSvg(size = 30) {
  const ph = moonPhase();
  const f = Math.cos(ph * 2 * Math.PI);            // 1 = nouvelle, -1 = pleine
  const semi = ph < 0.5 ? 'M50 5 A45 45 0 0 1 50 95 Z' : 'M50 5 A45 45 0 0 0 50 95 Z';
  return `<svg class="wmoon" viewBox="0 0 100 100" width="${size}" height="${size}">
    <circle cx="50" cy="50" r="45" fill="#232b40"/>
    <path d="${semi}" fill="#e9f3ff"/>
    <ellipse cx="50" cy="50" rx="${(Math.abs(f) * 45).toFixed(1)}" ry="45" fill="${f > 0 ? '#232b40' : '#e9f3ff'}"/>
  </svg>`;
}
// Nuit étoilée : étoiles CSS qui scintillent + lune à phase réelle. Les étoiles
// filantes sont injectées à part par _shootStar() (one-shot, timer JS).
function nightHtml() {
  const stars = [...Array(16)].map((_, i) =>
    `<span class="wstar" style="left:${(i * 61) % 100}%;top:${(i * 37) % 70}%;animation-delay:${(i % 5) * .7}s;animation-duration:${(2.2 + (i % 4) * .9)}s"></span>`).join('');
  return `<div class="wfx">${stars}${moonSvg(30)}</div>`;
}

// Particules & décors CSS. cond = condition ; rainCh/snowCh = probabilités (0-100)
// → même par temps SEC, si la proba est élevée, quelques gouttes/flocons "d'annonce".
// Le vent/la pluie forte/le brouillard/les éclairs sont gérés par le CANVAS (moteur FX).
function particlesHtml(cond, rainCh = 0, snowCh = 0) {
  if (WET_CONDS.has(cond)) return `<div class="wfx">${_rainSpans(cond === 'pouring' ? 28 : 16)}</div>`;
  if (SNOW_CONDS.has(cond)) return `<div class="wfx">${_snowField(16)}</div>`;
  // condition sèche MAIS proba élevée → "annonce"
  if (snowCh >= 30) return `<div class="wfx">${_snowField(Math.round(snowCh / 100 * 14), 0.55)}</div>`;
  if (rainCh >= 30) return `<div class="wfx">${_rainSpans(Math.round(rainCh / 100 * 14), 0.5)}</div>`;
  // beau temps → god-rays (3 faisceaux qui respirent) + poussières dorées
  if (cond === 'sunny') {
    return `<div class="wfx">
      <span class="wray" style="left:8%;--ra:14deg"></span>
      <span class="wray" style="left:36%;--ra:9deg;width:90px;animation-delay:2s"></span>
      <span class="wray" style="left:62%;--ra:17deg;width:70px;animation-delay:4s"></span>
      ${[...Array(12)].map((_, i) => `<span class="wfx-dust" style="left:${(i * 8.3) % 100}%;top:${(i * 37) % 100}%;animation-delay:${i * 0.2}s;animation-duration:${3 + (i % 4)}s"></span>`).join('')}</div>`;
  }
  // nuit claire → étoiles + lune (les filantes arrivent par le timer)
  if (NIGHT_CONDS.has(cond)) return nightHtml();
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
  // pollens : mdi:flower-pollen (vrai path officiel — fleur + points de pollen) — fill currentColor
  pollen:    `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.4 12.75C18.4 11.37 17.28 10.25 15.9 10.25C15.37 10.25 14.88 10.41 14.5 10.69V10.5C14.5 9.12 13.38 8 12 8S9.5 9.12 9.5 10.5V10.69C9.12 10.41 8.63 10.25 8.1 10.25C6.72 10.25 5.6 11.37 5.6 12.75C5.6 13.74 6.19 14.6 7.03 15C6.19 15.4 5.6 16.25 5.6 17.25C5.6 18.63 6.72 19.75 8.1 19.75C8.63 19.75 9.12 19.58 9.5 19.31V19.5C9.5 20.88 10.62 22 12 22S14.5 20.88 14.5 19.5V19.31C14.88 19.58 15.37 19.75 15.9 19.75C17.28 19.75 18.4 18.63 18.4 17.25C18.4 16.25 17.81 15.4 16.97 15C17.81 14.6 18.4 13.74 18.4 12.75M12 17.5C10.62 17.5 9.5 16.38 9.5 15S10.62 12.5 12 12.5 14.5 13.62 14.5 15 13.38 17.5 12 17.5M11 6C11 5.45 11.45 5 12 5S13 5.45 13 6 12.55 7 12 7 11 6.55 11 6M7 8C7 7.45 7.45 7 8 7S9 7.45 9 8 8.55 9 8 9 7 8.55 7 8M5 6C4.45 6 4 5.55 4 5S4.45 4 5 4 6 4.45 6 5 5.55 6 5 6M8 3C8 2.45 8.45 2 9 2S10 2.45 10 3 9.55 4 9 4 8 3.55 8 3M14 3C14 2.45 14.45 2 15 2S16 2.45 16 3 15.55 4 15 4 14 3.55 14 3M20 5C20 5.55 19.55 6 19 6S18 5.55 18 5 18.45 4 19 4 20 4.45 20 5M16 7C16.55 7 17 7.45 17 8S16.55 9 16 9 15 8.55 15 8 15.45 7 16 7Z"/></svg>`,
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
  // Les variantes nocturnes ont leur PROPRE libelle : afficher << Partiellement nuageux >>
  // a 23 h perd l'info que la card vient justement de basculer en nuit. Corrige
  // directement dans la card -webgl le 2026-08-17, remonte ici pour ne pas le reperdre.
  'partlycloudy-night': 'Nuit nuageuse', 'rainy-night': 'Pluie nocturne',
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
    this._renderSnap = null;
    // iPad/mobile : classe low-power → coupe scanline/glitch + fige les SVG animés.
    // Posé ici, PAS au constructor (NotSupportedError).
    if (WNC_IS_LOW_POWER) this.classList.add('low-power');
    // typo Orbitron optionnelle : la @font-face doit vivre dans le DOCUMENT (une
    // @font-face dans un shadow DOM n'est pas fiable) → lien Google Fonts injecté 1x.
    this.classList.toggle('wnc-orbitron', !!this._config.orbitron);
    if (this._config.orbitron && !document.getElementById('wnc-orbitron-font')) {
      const l = document.createElement('link');
      l.id = 'wnc-orbitron-font'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap';
      document.head.appendChild(l);
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._fetchForecast();
    this._render();
    // ré-arme la vie de GLITCH si le timer est tombé (retour sur la vue : le DOM
    // persiste → _lastHtml inchangé → _startGlitchLife ne serait jamais rappelé)
    if (this._built && this._config.glitch && !this._glitchTimer) this._startGlitchLife();
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
        <svg class="wheat-defs" width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="wheat-haze" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.04"
                numOctaves="2" seed="7" stitchTiles="stitch" result="wheat-noise"/>
              <feDisplacementMap in="SourceGraphic" in2="wheat-noise"
                scale="6" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
        </svg>
        <div class="wsky"></div>
        <canvas class="wfxmain"></canvas>
        <canvas class="wfrost-canvas"></canvas>
        <div class="wflash"></div>
        <div class="wfxlayer"></div>
        <div class="wbeam"></div>
        <div class="wwm"></div>
        ${this._config.neon_fx ? '<div class="wscan"></div>' : ''}
        <div class="winner"></div>
      </ha-card>`;
    this._elCard = this.shadowRoot.querySelector('ha-card');
    this._elSky = this.shadowRoot.querySelector('.wsky');
    this._elFx = this.shadowRoot.querySelector('.wfxlayer');
    this._elFxCv = this.shadowRoot.querySelector('.wfxmain');
    this._elFrost = this.shadowRoot.querySelector('.wfrost-canvas');
    this._elFlash = this.shadowRoot.querySelector('.wflash');
    this._elWm = this.shadowRoot.querySelector('.wwm');
    this._elInner = this.shadowRoot.querySelector('.winner');
    this._heatTurb = this.shadowRoot.querySelector('#wheat-haze feTurbulence');
    this._heatDisp = this.shadowRoot.querySelector('#wheat-haze feDisplacementMap');
    // scale réduit sur low-power (Companion/iPad) : ondulation plus discrète + moins de GPU.
    if (this._heatDisp) this._heatDisp.setAttribute('scale', WNC_IS_LOW_POWER ? 4 : 6);
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

    this._observeSize();
  }

  // ResizeObserver : masque GLITCH quand la carte est trop étroite (portrait serré),
  // pour qu'il ne chevauche JAMAIS le texte. Seuil 300px. On lit offsetWidth (fiable)
  // et on ignore les mesures à 0 (premier fire avant layout).
  _observeSize() {
    if (this._ro) this._ro.disconnect();
    const card = this._elCard;
    this._ro = new ResizeObserver(() => {
      const w = card.offsetWidth;
      if (w > 0) this._elInner.classList.toggle('w-narrow', w < 300);
    });
    this._ro.observe(card);
  }

  disconnectedCallback() {
    for (const k of ['_fxRAF', '_frostRAF', '_heatRAF']) if (this[k]) { cancelAnimationFrame(this[k]); this[k] = null; }
    for (const k of ['_glitchTimer', '_stormTimer', '_nightTimer']) if (this[k]) { clearTimeout(this[k]); this[k] = null; }
    for (const k of ['_ro', '_fxIO']) if (this[k]) { this[k].disconnect(); this[k] = null; }
    this._bolt = null;
    this._frostOn = false; this._frostSegs = null;  // forcera la re-croissance à la reconnexion
    this._renderSnap = null;  // force un render complet à la reconnexion → relance les moteurs
  }

  // ── Dimensionne un canvas overlay (fallback ha-card si le layout n'est pas prêt).
  //    Partagé par le moteur FX et le givre (avant : 4 copies quasi identiques).
  _fitCanvas(cv) {
    let w = cv.getBoundingClientRect().width, h = cv.getBoundingClientRect().height;
    if (!w || !h) {
      const card = this._elCard;
      if (card) { w = w || card.offsetWidth; h = h || card.offsetHeight; }
    }
    if (!w || !h) return false;
    const dpr = WNC_IS_LOW_POWER ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    if (cv._w !== w || cv._h !== h || cv._dpr !== dpr) {
      cv.width = w * dpr; cv.height = h * dpr;
      cv._w = w; cv._h = h; cv._dpr = dpr;
    }
    return true;
  }

  // ═══ MOTEUR FX UNIQUE ═══════════════════════════════════
  // Vent + pluie + brouillard + éclairs partagent UN canvas et UNE boucle RAF
  // (avant : 3 canvas + 3 boucles concurrentes). La boucle S'ARRÊTE toute seule
  // quand plus rien n'est actif (avant : elle tournait à vide par temps calme).
  // Cap 30 fps desktop / 15 fps low-power, pause hors écran (IntersectionObserver).
  _ensureFxLoop() {
    const cv = this._elFxCv;
    if (!cv) return;
    if (window.IntersectionObserver && !this._fxIO) {
      this._fxIO = new IntersectionObserver(es => { this._fxOff = !es[0].isIntersecting; });
      this._fxIO.observe(cv);
    }
    // pools créés une fois
    if (!this._windSheets) {
      this._windSheets = [...Array(4)].map((_, i) => ({
        t: Math.random() * 1000, y: 0.18 + i * 0.21, speed: 0.5 + Math.random() * 0.5,
        amp: 6 + Math.random() * 10, len: 0.5 + Math.random() * 0.4, thick: 16 + Math.random() * 22,
      }));
      this._windParts = [...Array(40)].map(() => ({ reset: true }));
      this._rainDrops = []; this._rainSplash = [];
    }
    if (this._fxRAF) return;
    this._fxTickB = this._fxTickB || ((now) => this._fxTick(now));
    this._fxRAF = requestAnimationFrame(this._fxTickB);
  }

  _fxTick(now) {
    const cv = this._elFxCv;
    const active = this._fogLevel > 0 || this._rainLevel > 0 || this._windOn || this._bolt;
    if (!active) {
      // plus rien à animer → on nettoie et on ARRÊTE la boucle (0 CPU au repos)
      if (cv._w) {
        const ctx = cv.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      }
      if (this._elFlash) this._elFlash.style.opacity = 0;
      this._rainDrops.length = 0; this._rainSplash.length = 0;
      this._fxRAF = null;
      return;
    }
    this._fxRAF = requestAnimationFrame(this._fxTickB);
    if (this._fxOff || document.hidden) return;
    if (now - (this._fxLast || 0) < (WNC_IS_LOW_POWER ? 66 : 33)) return;  // 15/30 fps
    this._fxLast = now;
    if (!this._fitCanvas(cv)) return;
    const ctx = cv.getContext('2d'), dpr = cv._dpr, W = cv._w, H = cv._h;
    const fxH = Math.min(this._fxH || H, H);   // zone hero (au-dessus du divider forecast)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (this._fogLevel > 0) this._drawFog(ctx, W, H, now);
    if (this._windOn || this._rainLevel > 0 || this._rainSplash.length || this._bolt) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, fxH); ctx.clip();   // vent/pluie/éclair : zone hero
      if (this._windOn) this._drawWind(ctx, W, fxH);
      this._drawRain(ctx, W, fxH);
      if (this._bolt) this._drawBolt(ctx, W, fxH, now);
      ctx.restore();
    }
  }

  // ── VENT : nappes de brume soufflée + particules portées. Densité/vitesse ∝
  //    this._windForce (km/h). Rien sous ~12 km/h (garanti par _windOn).
  _drawWind(ctx, W, H) {
    const force = this._windForce || 0;
    const intensity = Math.min((force - 12) / 38, 1);  // 0→1
    const speed = 0.4 + intensity * 1.4;               // vitesse globale du flux

    // 1) NAPPES de brume : bandes horizontales ondulées, gradient doux, dérivent.
    const nSheets = WNC_IS_LOW_POWER ? 1 : 2 + Math.round(intensity * 2);  // 1 (tablette) / 2-4
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
    const resetPart = (p) => {
      p.x = -8 - Math.random() * 40;
      p.y = Math.random() * H;
      p.r = 0.7 + Math.random() * 1.8;
      p.sp = 0.5 + Math.random() * 0.9;
      p.amp = 4 + Math.random() * 12;
      p.freq = 0.5 + Math.random() * 1.3;
      p.ph = Math.random() * Math.PI * 2;
      p.a = 0.25 + Math.random() * 0.4;
      p.reset = false;
    };
    const nParts = WNC_IS_LOW_POWER ? 4 + Math.round(intensity * 6)    // 4-10 tablette
                                    : 12 + Math.round(intensity * 26); // 12-38 desktop
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(190,230,255,1)';
    for (let i = 0; i < nParts; i++) {
      const p = this._windParts[i];
      if (p.reset || p.x === undefined) resetPart(p);
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
      if (p.x > W + 12) resetPart(p);
    }
    ctx.globalAlpha = 1;
  }

  // ── PLUIE : gouttes en biais + cercles d'impact (rebonds au sol).
  //    this._rainLevel = 0 (sec) à 1 (pouring).
  _drawRain(ctx, W, H) {
    const level = this._rainLevel || 0;
    const drops = this._rainDrops, splash = this._rainSplash;
    if (level <= 0 && !splash.length) { drops.length = 0; return; }

    const newDrop = (init) => {
      const sc = 0.3 + Math.random() * 0.7;                 // échelle (profondeur)
      return { x: Math.random() * (W + 80) - 40, y: init ? Math.random() * H : -20,
        len: 8 + sc * 14, vx: 1.2 + sc * 1.5, vy: 7 + sc * 9, sc, a: 0.25 + sc * 0.45 };
    };
    const target = Math.round(level * (WNC_IS_LOW_POWER ? 35 : 120));  // densité ∝ niveau
    while (drops.length < target) drops.push(newDrop(drops.length < target / 2));
    if (drops.length > target) drops.length = target;

    ctx.lineCap = 'round';
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i]; d.x += d.vx; d.y += d.vy;
      ctx.globalAlpha = d.a; ctx.strokeStyle = 'rgba(170,230,255,.9)'; ctx.lineWidth = 0.6 + d.sc * 1.2;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * 1.6, d.y - d.len); ctx.stroke();
      if (d.y > H) {                                       // impact → cercle d'éclaboussure
        splash.push({ x: d.x, y: H - 1, r: 1, max: 4 + d.sc * 7, a: 0.5 * d.sc + 0.2 });
        Object.assign(d, newDrop(false));
      }
    }
    for (let i = splash.length - 1; i >= 0; i--) {
      const s = splash[i]; s.r += 0.7; s.a *= 0.9;
      ctx.globalAlpha = s.a; ctx.strokeStyle = 'rgba(190,235,255,.8)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, Math.PI, Math.PI * 2); ctx.stroke();
      if (s.r > s.max || s.a < 0.03) splash.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  // ── BROUILLARD v2 : nappes elliptiques sur 3 profondeurs (fond = gros/lent/pâle,
  //    devant = petit/rapide), bob vertical doux, le tout "respire" (sinus lent) +
  //    voile bas qui traîne au sol. this._fogLevel = 0 → 1.
  _drawFog(ctx, W, H, now) {
    const level = this._fogLevel;
    const n = WNC_IS_LOW_POWER ? 6 : 12;
    if (!this._fogBlobs || this._fogBlobs.length !== n) {
      this._fogBlobs = [...Array(n)].map((_, i) => {
        const depth = i / n;                        // 0 = arrière-plan, 1 = premier plan
        return {
          x: Math.random() * W, y: H * (0.22 + Math.random() * 0.7),
          rx: (0.30 - depth * 0.12) * W + 40,       // ellipses larges (wisps)
          ry: (0.16 - depth * 0.05) * H + 14,
          v: 0.10 + depth * 0.5 + Math.random() * 0.15,
          ph: Math.random() * Math.PI * 2,
          a: 0.10 + depth * 0.10,
        };
      });
    }
    const breath = 0.75 + 0.25 * Math.sin(now / 4000);   // le brouillard respire
    for (const b of this._fogBlobs) {
      b.x -= b.v;
      if (b.x + b.rx < 0) { b.x = W + b.rx; b.y = H * (0.22 + Math.random() * 0.7); }
      const yy = b.y + Math.sin(now / 2600 + b.ph) * 6;   // bob vertical doux
      const g = ctx.createRadialGradient(b.x, yy, 0, b.x, yy, b.rx);
      g.addColorStop(0, `rgba(186,196,205,${(b.a * level * breath).toFixed(3)})`);
      g.addColorStop(1, 'rgba(186,196,205,0)');
      ctx.fillStyle = g;
      ctx.save();
      ctx.translate(b.x, yy); ctx.scale(1, b.ry / b.rx); ctx.translate(-b.x, -yy);
      ctx.beginPath(); ctx.arc(b.x, yy, b.rx, 0, 2 * Math.PI); ctx.fill();
      ctx.restore();
    }
    // voile bas : le brouillard s'accumule au sol (bas de card)
    const gl = ctx.createLinearGradient(0, H * 0.55, 0, H);
    gl.addColorStop(0, 'rgba(186,196,205,0)');
    gl.addColorStop(1, `rgba(186,196,205,${(0.16 * level * breath).toFixed(3)})`);
    ctx.fillStyle = gl;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
  }

  // ── ÉCLAIR RAMIFIÉ : un arbre de segments (tronc + branches, biais vers le bas)
  //    généré au hasard, révélé en ~130 ms puis fondu — one-shot, le flash overlay
  //    est piloté en même temps. Remplace le flash plein écran CSS.
  _genBolt(W, H) {
    const segs = [];
    const cap = WNC_IS_LOW_POWER ? 120 : 220;
    const stack = [{ x: W * 0.25 + Math.random() * W * 0.5, y: 0,
      a: Math.PI / 2 + (Math.random() - .5) * .3, w: 2.6 }];
    while (stack.length) {
      let { x, y, a, w } = stack.pop();
      while (y < H * 0.8 && w > 0.35 && segs.length < cap) {
        const len = 8 + Math.random() * 14;
        const na = a + (Math.random() - .5) * .75;
        const nx = x + Math.cos(na) * len, ny = y + Math.sin(na) * len;
        segs.push({ x1: x, y1: y, x2: nx, y2: ny, w });
        if (Math.random() < .13) stack.push({ x, y, a: na + (Math.random() < .5 ? -.8 : .8), w: w * .5 });
        x = nx; y = ny; a = na * .94 + (Math.PI / 2) * .06;   // biais vers le bas
      }
    }
    return segs;
  }

  _fireBolt() {
    const cv = this._elFxCv;
    if (!cv || !this._fitCanvas(cv)) return;
    const H = Math.min(this._fxH || cv._h, cv._h);
    this._bolt = { segs: this._genBolt(cv._w, H), t0: performance.now() };
    this._ensureFxLoop();
  }

  _drawBolt(ctx, W, H, now) {
    const b = this._bolt, GROW = 130, HOLD = 90, FADE = 480;
    const t = now - b.t0;
    let alpha = 1, reveal = b.segs.length;
    if (t < GROW) reveal = Math.floor(b.segs.length * t / GROW);
    else if (t > GROW + HOLD) alpha = 1 - (t - GROW - HOLD) / FADE;
    if (alpha <= 0) {
      this._bolt = null;
      if (this._elFlash) this._elFlash.style.opacity = 0;
      return;
    }
    ctx.globalAlpha = alpha; ctx.lineCap = 'round';
    ctx.strokeStyle = '#eaf6ff';
    ctx.shadowColor = '#7df9ff'; ctx.shadowBlur = WNC_IS_LOW_POWER ? 0 : 14;
    for (let i = 0; i < reveal; i++) {
      const s = b.segs[i];
      ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    if (this._elFlash) this._elFlash.style.opacity = (.5 * alpha).toFixed(2);
  }

  // orage : éclairs par rafales espacées (4,5–11 s), premier coup rapide
  _startStorm() {
    if (this._stormTimer) return;
    const sched = (delay) => {
      this._stormTimer = setTimeout(() => {
        if (!document.hidden) this._fireBolt();
        sched(4500 + Math.random() * 6500);
      }, delay);
    };
    sched(1200 + Math.random() * 1800);
  }
  _stopStorm() {
    if (this._stormTimer) { clearTimeout(this._stormTimer); this._stormTimer = null; }
    this._bolt = null;
    if (this._elFlash) this._elFlash.style.opacity = 0;
  }

  // nuit claire : étoiles filantes one-shot par rafales espacées (6–15 s)
  _startNight() {
    if (this._nightTimer) return;
    const sched = () => {
      this._nightTimer = setTimeout(() => {
        if (!document.hidden && !this._elInner.classList.contains('w-narrow')) this._shootStar();
        sched();
      }, 6000 + Math.random() * 9000);
    };
    sched();
  }
  _stopNight() {
    if (this._nightTimer) { clearTimeout(this._nightTimer); this._nightTimer = null; }
  }
  _shootStar() {
    const fx = this._elFx && this._elFx.querySelector('.wfx');
    if (!fx) return;
    const s = document.createElement('span');
    s.className = 'wshoot';
    s.style.cssText = `left:${(5 + Math.random() * 55).toFixed(0)}%;top:${(6 + Math.random() * 30).toFixed(0)}%;--sa:${(16 + Math.random() * 16).toFixed(0)}deg`;
    fx.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  // ── GIVRE : cristaux fractals (dendrites) qui poussent depuis les 4 coins vers le
  //    centre quand temp ≤ frost_below. Dessin ONE-SHOT animé : la croissance dure ~2,5 s
  //    (facteur grow 0→1) puis on s'ARRÊTE (pas de RAF continu → idéal low-power/Companion).
  //    L'arbre de branches est généré une fois (récursif, seedé) et figé tant que la
  //    condition gel tient ; on ne le régénère qu'au passage sec→gel (cf _frostOn).
  _startFrost() {
    const cv = this._elFrost;
    if (!cv) return;
    if (!this._fitCanvas(cv)) {                 // layout pas prêt → re-tente au prochain frame
      requestAnimationFrame(() => this._startFrost());
      return;
    }
    const W = cv._w, H = cv._h;

    // 1) Génère l'arbre de dendrites une fois (segments {x1,y1,x2,y2,depth,t0,t1}).
    //    t0/t1 = fenêtre temporelle [0..1] de croissance du segment (les enfants
    //    poussent après le parent → effet de ramification progressive).
    if (!this._frostSegs || this._frostSegW !== W || this._frostSegH !== H) {
      const segs = [];
      const grow = (x, y, ang, len, depth, t0, span) => {
        if (depth <= 0 || len < 5) return;
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
        const t1 = Math.min(1, t0 + span);
        segs.push({ x1: x, y1: y, x2, y2, depth, t0, t1 });
        // épines latérales courtes le long de la branche (look cristal)
        const spikes = 2 + Math.floor(Math.random() * 2);
        for (let s = 1; s <= spikes; s++) {
          const f = s / (spikes + 1);
          const sx = x + (x2 - x) * f, sy = y + (y2 - y) * f;
          const sa = ang + (s % 2 ? 1 : -1) * (0.7 + Math.random() * 0.5);
          const st0 = t0 + span * f;
          grow(sx, sy, sa, len * 0.45, depth - 1, st0, span * 0.6);
        }
        // continuation de la branche principale (légèrement déviée)
        grow(x2, y2, ang + (Math.random() - 0.5) * 0.5, len * 0.78, depth - 1, t1 - span * 0.2, span * 0.9);
      };
      const reach = Math.min(W, H) * (WNC_IS_LOW_POWER ? 0.34 : 0.42);  // un peu moins ample sur mobile
      const depth = WNC_IS_LOW_POWER ? 4 : 5;
      // 4 coins, chacun pousse vers le centre (diagonale) avec un petit éventail
      [[0, 0, 0.25 * Math.PI], [W, 0, 0.75 * Math.PI], [0, H, -0.25 * Math.PI], [W, H, -0.75 * Math.PI]]
        .forEach(([cx, cy, base]) => {
          for (let b = -1; b <= 1; b++) grow(cx, cy, base + b * 0.42, reach, depth, 0, 0.5);
        });
      this._frostSegs = segs; this._frostSegW = W; this._frostSegH = H;
    }

    // 2) Anime la croissance (grow 0→1 sur ~2,5 s) puis fige.
    if (this._frostRAF) cancelAnimationFrame(this._frostRAF);
    const dpr = cv._dpr, segs = this._frostSegs;
    const DUR = 2500, start = performance.now();
    const render = (now) => {
      const k = Math.min(1, (now - start) / DUR);
      const e = 1 - Math.pow(1 - k, 3);                 // ease-out cubic
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv._w, cv._h);
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(180,230,255,.9)'; ctx.shadowBlur = WNC_IS_LOW_POWER ? 0 : 4;
      for (const s of segs) {
        if (e <= s.t0) continue;
        const f = Math.min(1, (e - s.t0) / Math.max(0.001, s.t1 - s.t0));  // avancée du segment
        const x2 = s.x1 + (s.x2 - s.x1) * f, y2 = s.y1 + (s.y2 - s.y1) * f;
        ctx.globalAlpha = (0.25 + s.depth * 0.12) * Math.min(1, e * 1.4);
        ctx.lineWidth = 0.5 + s.depth * 0.45;
        ctx.strokeStyle = 'rgba(214,240,255,.85)';
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (k < 1) this._frostRAF = requestAnimationFrame(render);
      else this._frostRAF = null;                       // fini → on laisse le givre figé
    };
    this._frostRAF = requestAnimationFrame(render);
  }

  // Efface le givre (transition gel→sec)
  _clearFrost() {
    if (this._frostRAF) { cancelAnimationFrame(this._frostRAF); this._frostRAF = null; }
    const cv = this._elFrost;
    if (cv && cv._w) cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
  }

  // ── HEAT-HAZE (canicule) : fait dériver la turbulence du filtre SVG appliqué à
  //    l'icône hero → ondulation continue type "air chaud" (validé en preview).
  //    On module baseFrequency (montée de chaleur) + on fait glisser seed. Cap 30 fps,
  //    pause si onglet caché. Pas de canvas → léger.
  _startHeat() {
    if (this._heatRAF || !this._heatTurb) return;
    const BASE = 0.018;                          // baseFrequency horizontale (= preview)
    const minDt = WNC_IS_LOW_POWER ? 66 : 33;    // 15 fps Companion / 30 fps PC
    const start = performance.now();
    const draw = (now) => {
      this._heatRAF = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (now - (this._heatLast || 0) < minDt) return;
      this._heatLast = now;
      const t = (now - start) / 1000;
      const fy = BASE * (2 + Math.sin(t * 0.6) * 0.4);  // fréquence verticale modulée
      this._heatTurb.setAttribute('baseFrequency', `${BASE.toFixed(4)} ${fy.toFixed(4)}`);
      this._heatTurb.setAttribute('seed', 7 + (Math.floor(t * 8) % 50));
    };
    this._heatRAF = requestAnimationFrame(draw);
  }
  _stopHeat() {
    if (this._heatRAF) { cancelAnimationFrame(this._heatRAF); this._heatRAF = null; }
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._built) this._build();
    if (!this._ro) this._observeSize();   // ré-arme après une déconnexion

    const st = this._hass.states[this._config.entity];
    if (!st) { this._elInner.innerHTML = `<div style="padding:16px">Entité introuvable : ${this._config.entity}</div>`; return; }

    // Dirty-check : HA pousse `set hass` plusieurs fois/seconde. On ne re-render que
    // si un état PERTINENT a changé (sinon : centaines de recalculs/RAF inutiles =
    // CPU/mémoire qui s'envolent). Snapshot léger des entités qui affectent le rendu.
    const S = this._hass.states;
    const base = entityBase(this._config.entity);
    const watch = [this._config.entity, this._config.alert_entity, this._config.sun_entity,
      this._config.air_entity, this._config.air_entity_next, this._config.pollen_entity, this._config.pollen_entity_next,
      `sensor.${base}_wind_speed`, `sensor.${base}_wind_gust`, `sensor.${base}_rain_chance`, `sensor.${base}_snow_chance`,
      this._config.wind_entity, this._config.rain_chance_entity, this._config.snow_chance_entity];
    let snap = '';
    for (const e of watch) { const s = e && S[e]; if (s) snap += e + '=' + s.state + ';'; }
    // température = attribut (pas l'état) → l'ajouter au snapshot, sinon le givre (seuil
    // sur la temp) ne se déclencherait pas quand seule la temp change.
    snap += '|t=' + (S[this._config.entity]?.attributes?.temperature ?? '');
    snap += '|fc=' + (this._forecast ? this._forecast.length : 0) + ':' + (this._fcTs || 0);
    // On snapshote le VERDICT nuit, pas la valeur en lux : les lux bougent en continu et
    // re-rendraient la card à chaque mesure, alors que le verdict ne change que 2×/jour.
    if (this._config.night_from_sun)
      snap += '|n=' + (this._isNight = isNight(this._hass, this._config, this._isNight));
    if (snap === this._renderSnap) return;   // rien de pertinent n'a changé → skip
    this._renderSnap = snap;

    // Jour/nuit recalculé ici, AVANT tous les consommateurs de `cond` (icône, accent,
    // kanji, fond réactif, FX) : une seule interception suffit puisque tout part d'ici.
    let cond = st.state;
    if (this._config.night_from_sun) {   // _isNight vient d'être calculé par le dirty-check
      if (this._isNight) cond = NIGHT_OF[cond] || cond;
      else if (NIGHT_CONDS.has(cond)) cond = cond === 'clear-night' ? 'sunny' : 'partlycloudy';
    }
    const a = st.attributes;
    const name = this._config.name || cleanLocationName(a.friendly_name) || this._config.entity;
    const temp = Math.round(a.temperature);
    const unit = a.temperature_unit || '°C';

    // ACCENT PAR MÉTÉO : --wnc-acc sur ha-card ; sans l'option → retombe sur le thème
    const acc = this._config.mood_accent ? (ACCENT[cond] || null) : null;
    if (acc) this._elCard.style.setProperty('--wnc-acc', acc);
    else this._elCard.style.removeProperty('--wnc-acc');
    this._elWm.textContent = KANJI[cond] || '';   // kanji watermark

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

    // CANICULE → heat-haze sur la hero zone (icône). Déclenché par la vigilance MF
    // "Canicule" ≥ Jaune. Actif aussi sur Companion en version allégée : filtre SVG
    // sur 1 petit élément, RAF léger → pas un canvas en boucle.
    const heatOn = !!vigi && vigi.risks.includes('Canicule');

    // forecast en TUILES + barre thermique min/max : la fourchette lo→hi du jour est
    // positionnée (left/width) dans la fourchette de la période affichée, couleur
    // froid→chaud (bleu 210° → ambre 35°). En hourly (pas de templow) : pas de barre.
    const fc = (this._forecast || []).slice(0, this._config.forecast_count);
    const isHourly = this._config.forecast_type === 'hourly';
    const lows = fc.filter(f => f.templow != null).map(f => Math.round(f.templow));
    const his = fc.map(f => Math.round(f.temperature));
    const wMin = lows.length ? Math.min(...lows) : Math.min(...his);
    const wMax = Math.max(...his);
    const span = (wMax - wMin) || 1;
    const tcol = (t) => `hsl(${210 - Math.max(0, Math.min(1, (t - wMin) / span)) * 175} 90% 62%)`;
    const fcHtml = fc.map((f, i) => {
      const d = new Date(f.datetime);
      const lbl = isHourly ? `${String(d.getHours()).padStart(2, '0')}h` : DAYS_FR[d.getDay()];
      const hi = Math.round(f.temperature);
      const lo = f.templow != null ? Math.round(f.templow) : null;
      const range = lo != null
        ? `<div class="wrange"><i style="left:${((lo - wMin) / span * 100).toFixed(1)}%;width:${Math.max(6, (hi - lo) / span * 100).toFixed(1)}%;background:linear-gradient(90deg,${tcol(lo)},${tcol(hi)})"></i></div>`
        : '';
      return `<div class="wday${i === 0 ? ' today' : ''}">
        <div class="wd">${lbl}</div>
        <div class="wmini">${iconSvg(f.condition, 40, null, false)}</div>
        <div class="whl"><span class="whi">${hi}°</span>${lo != null ? `<span class="wlo">${lo}°</span>` : ''}</div>
        ${range}
      </div>`;
    }).join('');

    // stats secondaires — en pastilles (même style que les pastilles Atmo, pour l'homogénéité).
    const statPill = (iconKey, v) => v == null ? '' :
      `<span class="watmo watmo-stat"><span class="watmo-i">${MINI_ICONS[iconKey]}</span><b>${v}</b></span>`;
    const pUnit = a.pressure_unit || 'hPa';
    const windVal = ex.wind != null ? ex.wind : a.wind_speed;  // sensor externe prioritaire
    const c = this._config;
    const stats = [
      c.show_humidity ? statPill('humidity', a.humidity != null ? a.humidity + ' %' : null) : '',
      c.show_wind     ? statPill('wind', windVal != null ? Math.round(windVal) + ' km/h' : null) : '',
      c.show_pressure ? statPill('pressure', a.pressure != null ? Math.round(a.pressure) + ' ' + pUnit : null) : '',
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

    // ne réécrit (et donc ne redémarre les animations SVG) QUE si le contenu a changé.
    // Le calcul de --fx-h (mesure layout, dans un RAF) est DANS ce bloc → uniquement
    // quand le DOM change, pas à chaque tick hass.
    if (inner !== this._lastHtml) {
      this._elInner.innerHTML = inner;
      this._lastHtml = inner;
      this._startGlitchLife();  // (re)lance la vie de GLITCH sur le nouvel élément
      requestAnimationFrame(() => {
        const fcEl = this._elInner.querySelector('.wforecast');
        if (!this._elCard) return;
        if (fcEl) {
          const h = Math.round(fcEl.getBoundingClientRect().top - this._elCard.getBoundingClientRect().top);
          if (h > 0) { this._elCard.style.setProperty('--fx-h', h + 'px'); this._fxH = h; }
        } else {
          this._elCard.style.removeProperty('--fx-h'); this._fxH = null;
        }
      });
    }

    // ═══ MOTEUR FX : niveaux selon la condition, la boucle unique s'occupe du reste.
    const rainLevel = cond === 'pouring' ? 1
      : ['rainy', 'lightning-rainy'].includes(cond) ? 0.6
      : cond === 'snowy-rainy' ? 0.4
      : (ex.rainCh >= 40 && this._config.particles) ? ex.rainCh / 100 * 0.4  // annonce forte → bruine
      : 0;
    // Effets canvas actifs partout, y compris HA Companion — en low-power ils tournent
    // en version ALLÉGÉE (15 fps, DPR 1, densités réduites) : "un minimum d'animation
    // météo" sans surchauffer.
    const fxOn = this._config.particles;
    this._rainLevel = fxOn ? rainLevel : 0;
    this._windForce = Math.max(ex.gust || 0, ex.wind || 0);
    this._windOn = fxOn && this._windForce >= 12;
    this._fogLevel = (fxOn && cond === 'fog') ? 1 : 0;
    if (this._rainLevel > 0 || this._windOn || this._fogLevel > 0) this._ensureFxLoop();

    // ORAGE → éclairs ramifiés par rafales (one-shot, flash overlay piloté en même temps)
    if (fxOn && STORM_CONDS.has(cond)) this._startStorm(); else this._stopStorm();
    // NUIT CLAIRE → étoiles filantes one-shot par rafales
    if (fxOn && NIGHT_CONDS.has(cond)) this._startNight(); else this._stopNight();

    // particules CSS (pluie légère/neige/annonces/rayons/étoiles).
    if (this._config.particles) {
      // pluie neutralisée si gérée par canvas OU sur low power (canvas allégé la couvre)
      const wet = WET_CONDS.has(cond) || STORM_CONDS.has(cond);
      const cssCond = ((fxOn && rainLevel > 0) || (WNC_IS_LOW_POWER && wet)) ? 'cloudy' : cond;
      // d<jour> dans la clé : la lune (phase réelle) se met à jour au changement de jour
      const fxKey = `${cssCond}|${ex.rainCh}|${ex.snowCh}|${WNC_IS_LOW_POWER ? 'L' : ''}|d${new Date().getDate()}`;
      if (this._fxKey !== fxKey) {
        this._elFx.innerHTML = particlesHtml(cssCond, (fxOn && rainLevel > 0) ? 0 : ex.rainCh, ex.snowCh);
        this._fxKey = fxKey;
      }
    }

    // GIVRE (canvas) : cristaux quand temp ≤ frost_below. One-shot animé : on ne (re)lance
    // la croissance qu'au PASSAGE sec→gel (_frostOn), sinon chaque tick rejouerait l'anim.
    const frostNow = this._config.frost && this._config.particles
      && Number.isFinite(temp) && temp <= this._config.frost_below;
    if (frostNow && !this._frostOn) { this._frostOn = true; this._startFrost(); }
    else if (!frostNow && this._frostOn) { this._frostOn = false; this._clearFrost(); }

    // CANICULE : heat-haze sur l'icône hero (au-dessus du divider). La classe pose le
    // filter SVG sur .wicon ; l'anim JS fait dériver la turbulence (= la chaleur monte).
    this._elInner.classList.toggle('wheat-on', heatOn);
    if (heatOn) this._startHeat(); else this._stopHeat();

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
     ET laisse passer le glow néon du card-mod. PAS transparent (sinon on voit le dashboard).
     --acc = accent de la card : couleur météo (mood_accent) OU accent du thème. */
  ha-card { position:relative; overflow:hidden; border-radius:var(--ha-card-border-radius,18px); color:#eef2f7;
    --acc: var(--wnc-acc, var(--accent-color, #00e5ff));
    background:var(--ha-card-background, var(--card-background-color, rgba(18,20,30,.78))); }
  .wsky { position:absolute; inset:0; z-index:0; transition:background 1.2s ease; }
  /* faisceau diagonal au coin haut-droit (règle "faisceau, pas boule") — suit l'accent */
  .wbeam { position:absolute; right:0; top:0; width:46%; height:74px; z-index:1; pointer-events:none;
    background:linear-gradient(225deg, color-mix(in srgb, var(--acc) 22%, transparent), transparent 62%);
    transition:background .8s ease; }
  /* kanji watermark : gros caractère fantôme de la condition, sous le contenu */
  .wwm { position:absolute; right:10px; top:-8px; z-index:1; font-size:72px; line-height:1;
    font-family:serif; color:var(--acc); opacity:.08; pointer-events:none; user-select:none; }
  .winner { position:relative; z-index:2; padding:10px 14px 9px; }
  .whero { display:flex; align-items:center; gap:10px; }
  .wicon { flex:none; }
  /* temp : glow multi-couches (calé sur dual-thermo-card), couleur = accent */
  .wtemp { flex:none; font-size:50px; font-weight:900; letter-spacing:-2.5px; line-height:.95;
    color:#fff; mix-blend-mode:screen;
    text-shadow:
      0 0 3px rgba(255,255,255,.9),
      0 0 12px var(--acc),
      0 0 30px var(--acc),
      0 0 60px color-mix(in srgb, var(--acc) 40%, transparent); }
  .wtemp small { font-size:.5em; vertical-align:super; margin-left:2px; opacity:.85; font-weight:500; }
  .wnow { flex:1; min-width:0; position:relative; }
  .wicon .wico { filter:drop-shadow(0 0 10px color-mix(in srgb, var(--acc) 28%, transparent)); }
  /* CANICULE : heat-haze sur l'icône hero. Le filtre SVG (#wheat-haze) distord l'icône ;
     la turbulence dérive via JS (_startHeat). N'affecte QUE l'icône. */
  .winner.wheat-on .wicon { filter:url(#wheat-haze); will-change:filter; }
  /* condition en cartouche néon (uppercase + liseré accent) */
  .wcond { display:inline-block; font-size:10.5px; font-weight:600; letter-spacing:1.6px;
    text-transform:uppercase; padding:3px 9px; border-radius:4px; max-width:100%;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; box-sizing:border-box;
    border:1px solid color-mix(in srgb, var(--acc) 40%, transparent);
    border-left:3px solid var(--acc);
    background:color-mix(in srgb, var(--acc) 10%, transparent);
    text-shadow:0 0 8px color-mix(in srgb, var(--acc) 60%, transparent); }
  .waside { flex:none; display:flex; flex-direction:column; gap:8px; align-items:flex-end;
    font-size:11.5px; opacity:.92; }
  .war { display:flex; align-items:center; gap:6px; white-space:nowrap; }
  .war b { font-weight:600; }
  .wari { display:flex; }
  .wvigi { font-size:11px; font-weight:600; margin-top:3px; letter-spacing:.3px;
    text-shadow:0 0 8px currentColor; }
  .wloc { font-size:10px; opacity:.62; margin-top:4px; letter-spacing:1.2px; text-transform:uppercase;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .wstats { display:flex; align-items:center; gap:8px; margin:9px 2px 0; font-size:12.5px; flex-wrap:wrap; }
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
  /* pastilles stats (humidité/vent/pression) : même style, couleur accent, non cliquables */
  .watmo-stat { color:var(--acc); cursor:default; }
  .watmo-stat:hover { filter:none; box-shadow:0 0 8px color-mix(in srgb, currentColor 28%, transparent); }

  /* ─── FORECAST : rail néon + tuiles + barre thermique min/max ─── */
  .wforecast { display:flex; justify-content:space-between; gap:6px; margin-top:9px;
    padding-top:9px; position:relative; }
  /* rail : la ligne de séparation (remplace le border-top) */
  .wforecast::before { content:""; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,.16) 12%, rgba(255,255,255,.16) 88%, transparent); }
  /* comète : petit segment lumineux qui parcourt lentement le rail */
  .wforecast::after { content:""; position:absolute; top:-1px; left:0; height:3px; width:64px;
    border-radius:3px; opacity:.8; filter:blur(.6px);
    background:linear-gradient(90deg, transparent, var(--acc), transparent);
    animation:wcomet 6.5s linear infinite; }
  .wday { flex:1; text-align:center; min-width:0; padding:5px 4px 7px; border-radius:10px;
    border:1px solid color-mix(in srgb, var(--acc) 16%, transparent);
    background:color-mix(in srgb, var(--acc) 4%, transparent); }
  .wday.today { border-color:color-mix(in srgb, var(--acc) 42%, transparent);
    background:color-mix(in srgb, var(--acc) 9%, transparent);
    box-shadow:inset 0 0 12px color-mix(in srgb, var(--acc) 10%, transparent); }
  .wday.today .wd { color:var(--acc); opacity:1;
    text-shadow:0 0 8px color-mix(in srgb, var(--acc) 60%, transparent); }
  .wday .wd { font-size:10.5px; opacity:.7; margin-bottom:1px; letter-spacing:.8px; }
  .wmini { display:flex; justify-content:center; margin:1px 0; }
  .wmini .wico { filter:drop-shadow(0 0 7px color-mix(in srgb, var(--acc) 28%, transparent)); }
  .whl { display:flex; justify-content:center; align-items:baseline; gap:5px; }
  .whi { font-size:14px; font-weight:600; }
  .wlo { font-size:11px; opacity:.58; }
  /* barre thermique : fourchette lo→hi du jour dans la fourchette de la semaine */
  .wrange { position:relative; height:4px; border-radius:2px; background:rgba(255,255,255,.10);
    margin:5px 3px 0; }
  .wrange i { position:absolute; top:0; bottom:0; border-radius:2px;
    box-shadow:0 0 6px rgba(255,255,255,.22); }

  /* ─── CANVAS FX (moteur unique vent/pluie/brouillard/éclairs) + givre ─── */
  .wfxmain { position:absolute; top:0; left:0; z-index:1; pointer-events:none;
    width:100%; height:100%;
    -webkit-mask:linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
            mask:linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%); }
  /* givre : couvre toute la card (cristaux des 4 coins), au-dessus des particules. */
  .wfrost-canvas { position:absolute; top:0; left:0; z-index:2; pointer-events:none;
    width:100%; height:100%; }
  /* flash d'orage : overlay piloté par le moteur d'éclairs (opacity inline, pas de CSS anim) */
  .wflash { position:absolute; top:0; left:0; right:0; height:var(--fx-h, 100%); z-index:1;
    opacity:0; pointer-events:none; mix-blend-mode:screen; transition:opacity .07s linear;
    background:linear-gradient(180deg, rgba(220,240,255,.9) 0%, rgba(150,200,255,.4) 45%, transparent 80%); }

  /* ─── PARTICULES & DÉCORS CSS (calque plein écran) ─── */
  .wfxlayer { position:absolute; inset:0; z-index:1; overflow:hidden; pointer-events:none; }
  .wfx { position:absolute; inset:0; }
  .wfx-rain { position:absolute; top:-12%; width:1.5px; height:16px;
    background:linear-gradient(transparent, rgba(125,249,255,.6)); animation:wrain linear infinite; }
  /* NEIGE PARALLAXE : la tuile de radial-gradients (--snow-grad, posée inline) défile en
     background-position. 3 calques (élément + :before + :after) à 3 vitesses/blurs/opacités
     → profondeur. Limitée à la zone hero via --fx-h, comme les canvas. */
  .wsnowfield, .wsnowfield::before, .wsnowfield::after {
    content:""; position:absolute; top:0; left:0; right:0; height:var(--fx-h, 100%);
    background-image:var(--snow-grad); background-repeat:repeat;
    background-size:600px 600px; animation:wsnowfall 3s linear infinite; }
  .wsnowfield::after  { opacity:.4;  filter:blur(3px);   animation-duration:6s; margin-left:-200px; }
  .wsnowfield::before { opacity:.65; filter:blur(1.5px); animation-duration:9s; margin-left:-300px; }
  .wfx-dust { position:absolute; width:3px; height:3px; border-radius:50%;
    background:#ffe9a8; opacity:.5; animation:wdust ease-in-out infinite; }
  /* god-rays : 3 faisceaux inclinés qui respirent (base d'inclinaison via --ra) */
  .wray { position:absolute; top:-40%; width:120px; height:150%; pointer-events:none;
    background:linear-gradient(180deg, rgba(255,214,90,.16), transparent 75%);
    filter:blur(9px); transform-origin:top center; transform:rotate(var(--ra,14deg));
    animation:wraybreathe 6s ease-in-out infinite; }
  /* nuit étoilée : étoiles qui scintillent + lune (phase réelle) + filantes one-shot */
  .wstar { position:absolute; width:2px; height:2px; border-radius:50%; background:#dfeeff;
    box-shadow:0 0 4px rgba(200,225,255,.8); animation:wtwinkle ease-in-out infinite; }
  .wmoon { position:absolute; right:16px; top:8px;
    filter:drop-shadow(0 0 8px rgba(210,230,255,.5)); }
  .wshoot { position:absolute; width:52px; height:1.5px; border-radius:2px; pointer-events:none;
    background:linear-gradient(90deg, transparent, #fff); opacity:0;
    animation:wshootA .9s ease-out forwards; }

  /* ─── SCANLINES NÉON (Neo Tokyo) ─── */
  .wscan { position:absolute; inset:0; z-index:3; pointer-events:none; mix-blend-mode:overlay;
    background:repeating-linear-gradient(0deg, rgba(0,229,255,.08) 0px, rgba(0,229,255,.08) 1px, transparent 2px, transparent 4px);
    animation:wscanmove 9s linear infinite; }

  /* ─── iPad/mobile (.low-power) : coupe TOUT ce qui anime en continu ───
     Posé via JS (WNC_IS_LOW_POWER) → n'affecte que l'iPad, jamais le PC.
     Les canvas tournent en version allégée ; ici on coupe scanline + glitch +
     toutes les animations CSS résiduelles (drift nuages, comète, twinkle, etc.). */
  :host(.low-power) .wscan { display:none; }
  :host(.low-power) .wcatband { display:none; }   /* GLITCH off */
  :host(.low-power) .wforecast::after { display:none; }   /* comète figée sinon */
  :host(.low-power) * { animation:none !important; }
  /* …MAIS on garde le minimum d'animation météo voulu sur Companion :
     pluie/neige CSS de secours + étoile filante (one-shot court). */
  :host(.low-power) .wfx-rain  { animation-name:wrain !important; }
  :host(.low-power) .wsnowfield          { animation:wsnowfall 3s linear infinite !important; }
  :host(.low-power) .wsnowfield::after   { animation:wsnowfall 6s linear infinite !important; }
  :host(.low-power) .wsnowfield::before  { animation:wsnowfall 9s linear infinite !important; }
  :host(.low-power) .wshoot { animation:wshootA .9s ease-out forwards !important; }

  /* typo Orbitron optionnelle (config orbitron: true) */
  :host(.wnc-orbitron) .wtemp, :host(.wnc-orbitron) .wd, :host(.wnc-orbitron) .whi {
    font-family:'Orbitron','Segoe UI',sans-serif; letter-spacing:0; }

  /* glitch : superpose le split RGB AU glow multi-couches (au lieu de l'écraser) */
  .wtemp-glitch { text-shadow:
      0 0 3px rgba(255,255,255,.9),
      0 0 12px var(--acc),
      0 0 30px var(--acc),
      0 0 60px color-mix(in srgb, var(--acc) 40%, transparent),
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

  @keyframes wdrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
  @keyframes wrain { to { transform:translateY(260px); } }
  /* neige parallaxe : la tuile (600px) défile d'une hauteur complète → boucle invisible */
  @keyframes wsnowfall { to { background-position-y:600px; } }
  @keyframes wdust { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-12px);opacity:.85} }
  @keyframes wraybreathe { 0%,100% { opacity:.65; transform:rotate(var(--ra,14deg)); }
    50% { opacity:1; transform:rotate(calc(var(--ra,14deg) + 1.5deg)) scaleY(1.05); } }
  @keyframes wtwinkle { 0%,100%{opacity:.25} 50%{opacity:1} }
  @keyframes wshootA { 0% { transform:rotate(var(--sa,24deg)) translateX(0); opacity:0; }
    12% { opacity:.95; } 100% { transform:rotate(var(--sa,24deg)) translateX(120px); opacity:0; } }
  @keyframes wcomet { 0% { left:0; transform:translateX(-110%); } 100% { left:100%; transform:translateX(10%); } }
  @keyframes wscanmove { to { background-position:0 220px; } }
  @keyframes wtglitch { 0%,92%,100%{transform:translate(0)} 93%{transform:translate(-2px,1px)} 95%{transform:translate(2px,-1px)} 97%{transform:translate(-1px,0)} }
  @keyframes wcatr { 0%,80%{transform:translate(0)} 85%{transform:translate(-4px,1px)} 91%{transform:translate(3px,-1px)} 97%{transform:translate(-2px,0)} }
  @keyframes wcatc { 0%,80%{transform:translate(0)} 85%{transform:translate(4px,-1px)} 91%{transform:translate(-3px,1px)} 97%{transform:translate(2px,0)} }
  @keyframes wcatshiver { 0%,100%{transform:translate(0)} 25%{transform:translate(-1.2px,0)} 75%{transform:translate(1.2px,.4px)} }
  @keyframes wcatnod { 0%,100%{transform:translateY(0)} 30%{transform:translateY(4px)} 60%{transform:translateY(0)} 80%{transform:translateY(2px)} }
  @keyframes wcatvib { 0%,100%{transform:translate(0)} 50%{transform:translate(1.2px,-.6px)} }
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
//  build UNE seule fois, puis _syncValues() chirurgical avec guard
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
        <label>Entité soleil (lever/coucher, et repli jour/nuit)
          <input data-key="sun_entity" list="wne-suns" placeholder="sun.sun">
          <datalist id="wne-suns"></datalist>
        </label>
        <label class="wne-row"><input data-key="night_from_sun" data-defaultOn type="checkbox"> Nuit d'après la luminosité 🌙</label>
        <label>Capteur de luminosité (sinon : position du soleil)
          <input data-key="lux_entity" list="wne-lux" placeholder="sensor.luminosite_moyenne_5_min">
          <datalist id="wne-lux"></datalist>
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
        <label class="wne-row"><input data-key="mood_accent" data-defaultOn type="checkbox"> Accent couleur selon la météo</label>
        <label class="wne-row"><input data-key="orbitron" type="checkbox"> Typo Orbitron (Google Fonts)</label>
        <label class="wne-row"><input data-key="glitch" data-defaultOn type="checkbox"> GLITCH le chat 🐱</label>
        <label class="wne-row"><input data-key="particles" data-defaultOn type="checkbox"> Effets atmosphériques</label>
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
    // luminosité : on filtre sur device_class (critère fiable) et pas sur le nom, qui
    // varie selon l'intégration. Les moyennes glissantes d'abord : plus stables qu'un
    // capteur brut, qui ferait clignoter l'icône sur un phare de voiture.
    const lux = Object.keys(this._hass.states)
      .filter(e => this._hass.states[e].attributes?.device_class === 'illuminance')
      .sort((a, b) => (b.includes('moyenne') ? 1 : 0) - (a.includes('moyenne') ? 1 : 0));
    const set = (id, arr) => { const d = this.querySelector('#' + id); if (d) d.innerHTML = opts(arr); };
    set('wne-weathers', weathers); set('wne-alerts', alerts); set('wne-suns', suns);
    set('wne-atmo', atmo); set('wne-lux', lux);
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
  description: 'Carte météo néon Neo Tokyo — icônes SVG animées, accent par météo, FX canvas',
  preview: true,
});

console.info(`%c WEATHER-NEON-CARD %c v${VERSION} `, 'background:#00e5ff;color:#000;font-weight:bold', 'background:#222;color:#7df9ff');
