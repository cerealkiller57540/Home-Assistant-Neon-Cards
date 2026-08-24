/* ── linux-terminal-card-webgl v1.9 ──
 * Variante WEBGL de linux-terminal-card : vrai verre CRT bombé rendu par shader.
 *
 * Desktop : le terminal (texte + barres + GLITCH le chat) est dessiné sur un canvas 2D
 *   offscreen, uploadé en texture, puis un shader post-process applique EN TEMPS RÉEL :
 *   barrel distortion (courbure du tube), aberration chromatique croissante vers les bords,
 *   scanlines + rolling bar, bloom additif (phosphore qui bave), flicker/jitter de signal.
 *   Une couche DOM transparente au-dessus capte les clics (more-info par ligne/barre).
 *
 * Mobile / iPad : WebGL activé aussi (à l'essai, 2026-07-19) — fallback CSS uniquement si
 *   getContext('webgl') échoue réellement sur l'appareil.
 *
 * Intensité par défaut : CINÉMATIQUE DOSÉ — courbure légère, texte NET, aberration aux bords.
 *
 * v1.1 (2026-07-19) audit : coalescing RAF de set hass (2 chemins), purge des chats morts
 *   (stop re-raster/upload texture 60fps à vide), curseur clignotant hors animation chat,
 *   fonts.load() explicite, LOW_POWER élargi Companion/Mobile, contain layout/style,
 *   _num() sur les réglages CRT (l'éditeur stocke des strings), garde _y0 du hit layer.
 *
 * v1.2 (2026-07-19) effet wow : grille RGB aperture (triades phosphore Trinitron, crt_mask),
 *   animation d'allumage CRT (ouverture verticale + flash + wobble dégauss, crt_boot, rejoue
 *   au montage — pas à chaque frappe éditeur), bursts de glitch (déchirure de bandes +
 *   spike d'aberration ~380ms, crt_glitch) synchronisés spawn GLITCH + entrée en critique.
 *
 * v1.3 (2026-07-19) : rémanence phosphore (crt_persist) — passe ping-pong FBO AVANT le
 *   post-process CRT : accum = max(texture fraîche, accum×decay), decay corrigé du dt réel
 *   (indépendant du refresh). Chats, curseur et changements de valeurs laissent une traînée.
 *
 * v1.4 (2026-07-25) : ecran « machine injoignable ». `unavailable`/`unknown` sont
 *   normalises dans _ent() (ils arrivent en CHAINES : sans ca ils s'affichaient tels quels) ;
 *   offline = CPU **et** RAM morts ensemble (une seule = capteur capricieux). L'ecran passe en
 *   SIGNAL LOST / NO CARRIER, SANS barres (une colonne de « — » se lit comme une card cassee),
 *   avec last contact + elapsed. Passe shader bad-TV (2 octaves + RGB split en PIXELS) et tube
 *   mis en veilleuse (offline_dim). Bonus : `up` s'affichait en ISO brut (device_class:timestamp)
 *   -> converti en duree. Fix : _webgl etait repose a true a chaque _render() -> le fallback CSS
 *   etait INATTEIGNABLE sans WebGL (boucle _initGl).
 *
 * v1.5 (2026-08-15) : 2e batterie (battery_entity_2, meme logique inversee bas=mauvais +
 *   icone charge ⚡, seuils batt2_warn/batt2_crit propres) — _battRow() generalise en fonction
 *   pure (pct, charging, warn, crit, entity, lbl) partagee par BATT/BATT2 au lieu d'un
 *   _battRow(s, ...) fige sur battery_entity. Detournement de barre : chaque slot CPU/GPU/
 *   LOAD/RAM/DSK/TEMP/BATT/BATT2 accepte desormais un libelle custom (*_label) et, pour
 *   CPU/GPU/LOAD/RAM/DSK, des seuils custom (*_warn/*_hot) — permet ex. de brancher une
 *   batterie dans le slot GPU sans fausse alerte a 85% (seuils du slot repris, pas ceux de
 *   la charge GPU). proc_label detourne le mot "proc" de la ligne `up` (ex: rpm ventilos).
 *   Vide = comportement d'origine partout (retro-compatible). Alerte banniere haut de card
 *   volontairement INCHANGEE (reste TEMP + BATT seule) : un slot detourne ne colore QUE sa
 *   barre, choix de Chris pour ne pas complexifier le texte d'alerte avec des libelles custom.
 *   Liseret de l'écran (bordure + glow) : suivait --rgb-primary-color du thème sans échappatoire.
 *   Nouvelle variable dédiée --ltc-frame (default: --ltc-uv) + col_frame en config pour la
 *   décoréler du thème — vide = comportement d'origine. .screen.crit garde la priorité (rouge).
 *
 * v1.6 (2026-08-24) : éditeur condensé — les groupes secondaires (CRT, écran injoignable,
 *   couleurs, OS/MQTT, charge, temp/batteries/réseau, seuils, détournement de barres) passent
 *   en <ha-expansion-panel> repliables ; seuls Général et En-tête restent ouverts par défaut.
 *
 * v1.7 (2026-08-24) : header canonique — mêmes réglages que neon-entities-card.js /
 *   neon-climate-card-webgl.js (police, majuscules, épaisseur, espacement, italique, dégradé,
 *   glow, flicker, couleur/taille icône). Portage fait sur les DEUX chemins de rendu (_render()
 *   complet ET _applyLiveConfig(), le chemin "config live" qui évite de recréer le contexte
 *   WebGL) pour rester synchro à la frappe dans l'éditeur. Vide partout = comportement
 *   d'origine (rétro-compatible).
 *
 * v1.8 (2026-08-24) : fixes retour terrain sur le header canonique v1.7 —
 *   (1) icône en double : un ancien mécanisme JS post-render (insertBefore d'un <ha-icon>)
 *   coexistait avec l'icône ajoutée dans le template littéral, supprimé (le template suffit) ;
 *   (2) swatches couleur systématiquement noirs : le picker natif <input type=color> recevait
 *   du texte brut non-hex (placeholders type 'var(--primary-color)') dans son value= → invalide.
 *   Ajout de _resolveColor() (sonde DOM + getComputedStyle, pattern copié de climate-webgl) pour
 *   toujours donner au swatch un hex réel, appliqué aux 3 points d'alimentation (rendu, frappe,
 *   _syncValues) ; (3) sélecteur de police muet : appel _select() avec label/key inversés,
 *   écrivait dans une clé 'Police' jamais lue au lieu de 'header.font' ; (4) défauts épaisseur/
 *   espacement pas alignés sur le goût de Chris pour cette card — fallback CSS 400→600 et
 *   .05em→0.02em (placeholders éditeur synchronisés).
 *
 * v1.9 (2026-08-24) : 2 fixes supplémentaires sur le header canonique —
 *   (1) le sélecteur de police (NEON_FONTS) ne chargeait jamais réellement la police choisie
 *   (même dette repérée sur entities/climate/storey : seul Orbitron est en dur, parfois même pas)
 *   → ajout de _loadGoogleFont(), <link> Google Fonts injecté dans le <head> du document, copié
 *   du seul pattern qui marche vraiment dans la famille (neon-switch-card.js::_loadGoogleFont,
 *   avec le encodeURIComponent(...).replace(/%20/g,'+') nécessaire pour les noms à espaces type
 *   « Share Tech Mono »/« Bebas Neue ») ; (2) le glow de l'icône du header n'avait que 2 couches
 *   de drop-shadow (pas de halo blanc central) alors que le glow du titre en a 4 (_neonGlow) →
 *   les deux glowaient visiblement différemment. Icône alignée sur les mêmes 4 couches que le
 *   canon climate-webgl. Retour Chris : intensité trop forte (drop-shadow s'accumule plus que
 *   text-shadow sur une icône compacte) → rayons réduits ×0.6 par rapport au titre.
 */
(() => {

/* ── Device detection (MD §1) ───────────────────────────────────────────── */
const LTC_IS_IPAD      = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// ⚠ inclut HomeAssistant (app Companion iOS/Android) + Mobile — règle MD §1 : la regex
// courte /iPhone|Android/ RATE l'app Companion (userAgent ≠ Safari)
const LTC_IS_LOW_POWER = LTC_IS_IPAD || /iPhone|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

/* ── Polices — une seule fois ────────────────────────────────────────────── */
if (!document.getElementById('ltc-font')) {
  const l = document.createElement('link');
  l.id = 'ltc-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;700&display=swap';
  document.head.appendChild(l);
}

const CAT_PATH = 'M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z';
const _catSvg = () => `<svg viewBox="0 0 51 46"><path fill="currentColor" d="${CAT_PATH}"/></svg>`;
// Path2D du chat (viewBox 51×46) — pour le dessin canvas
const _catPath2D = new Path2D(CAT_PATH);

// Polices proposées dans l'éditeur pour le titre du header (canon commun aux cards néon —
// cf neon-entities-card.js / neon-climate-card-webgl.js). Fallback CSS toujours présent
// (var(--primary-font-family, 'Rajdhani', …)) si le chargement Google Fonts échoue (offline).
const NEON_FONTS = [
  'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];
// Charge la police choisie via un <link> Google Fonts injecté dans le <head> du document (pas
// dans le shadowRoot — les fonts se chargent au niveau document, pas par instance de card). Cache
// module-level partagé par toutes les instances. Pattern copié à l'identique de
// neon-switch-card.js::_loadGoogleFont (cf skill ha-neon-css, piège "police choisie dans
// l'éditeur silencieusement jamais chargée" — même dette constatée sur entities/climate/storey,
// qui proposent NEON_FONTS mais ne chargent jamais que Orbitron en dur, voire rien).
// ⚠️ Google Fonts veut des '+' pour les espaces dans le nom de famille, PAS '%20' —
// encodeURIComponent seul aurait laissé la moitié des polices (« Share Tech Mono », « Bebas
// Neue », « Space Grotesk », « DM Sans », « Playfair Display ») silencieusement introuvables.
const _loadedFonts = new Set();
function _loadGoogleFont(family){
  if (!family || _loadedFonts.has(family)) return;
  _loadedFonts.add(family);
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;600;700;900&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

/* ── helpers ──────────────────────────────────────────────────────────── */
function _num(v){ const n = parseFloat(v); return isNaN(n) ? null : n; }
function _esc(v){ return String(v ?? '').replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[ch]); }
function _lvl(p, warn, hot){ return p == null ? 'ok' : (p >= hot ? 'hot' : p >= warn ? 'warn' : 'ok'); }
// Logique batterie INVERSÉE (bas = mauvais) + charge en cours qui neutralise l'alerte.
// Partagée BATT/BATT2, et par tout slot détourné en "mode batterie".
function _battLvl(p, warn, crit, charging){ return p == null ? 'ok' : ((p <= crit && !charging) ? 'hot' : (p <= warn && !charging) ? 'warn' : 'ok'); }

// Durée écoulée depuis un ISO, format court (« 3j 02h », « 4h 07m », « 41s »).
// Sert à l'uptime (device_class:timestamp = date de boot) ET au « elapsed » offline.
function _since(iso){
  if (!iso) return null;
  const t = Date.parse(iso);
  if (isNaN(t)) return typeof iso === 'string' ? iso : null;   // pas une date : on rend tel quel
  let s = Math.max(0, (Date.now() - t) / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600);  s -= h * 3600;
  const m = Math.floor(s / 60);
  if (d) return d + 'j ' + String(h).padStart(2, '0') + 'h';
  if (h) return h + 'h ' + String(m).padStart(2, '0') + 'm';
  if (m) return m + 'm ' + String(Math.floor(s % 60)).padStart(2, '0') + 's';
  return Math.floor(s) + 's';
}

// Horodatage court « 22/07 19:58 » — heure locale, pas l'ISO UTC.
function _stamp(iso){
  if (!iso) return null;
  const t = new Date(iso);
  if (isNaN(t.getTime())) return null;
  const p = n => String(n).padStart(2, '0');
  return p(t.getDate()) + '/' + p(t.getMonth() + 1) + ' ' + p(t.getHours()) + ':' + p(t.getMinutes());
}

// marge verticale interne du tube (px CSS) — haut ET bas ; serrée : écran plat
// (curve=0) donc le contenu peut coller au bord sans être avalé
const LTC_TUBE_PAD = 10;
const LTC_LINE_H   = 13.5 * 1.5;   // hauteur d'une ligne en px CSS (fs * 1.5)

/* ═══════════════════════════════════════════════════════════════════════════
 *  SHADERS — CRT cinématique
 * ═══════════════════════════════════════════════════════════════════════════ */
const VERT = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main(){
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }`;

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;      // le terminal rasterisé
  uniform float uTime;
  uniform vec2  uRes;          // taille écran (px)
  uniform float uCurve;        // barrel amount (0..~0.35)
  uniform float uAberr;        // aberration chromatique (px aux bords)
  uniform float uScan;         // intensité scanlines (0..1)
  uniform float uBloom;        // intensité bloom (0..1)
  uniform float uFlickerAmp;   // amplitude flicker
  uniform vec3  uTint;         // teinte phosphore (UV violet)
  uniform float uCritical;     // 1.0 en alerte critique
  uniform float uMask;         // grille RGB aperture (0..1)
  uniform float uBoot;         // secondes depuis l'allumage (clampé ~4 côté JS)
  uniform float uGlitchAmt;    // burst de déchirure (0..~1.4, décroît côté JS)
  uniform float uOffline;      // 1.0 = machine injoignable (passe bad-TV active)
  uniform float uOffWarp;      // ondulation lente (octave 1), amplitude
  uniform float uOffNoise;     // grain haute fréquence (octave 2)
  uniform float uOffBurst;     // enveloppe de rafale 0..1 (période pilotée côté JS)
  uniform float uOffSplit;     // RGB split en PIXELS d'écran (pas en UV : cf commentaire)
  uniform float uOffDim;       // luminance de l'écran mort (1.0 quand la machine vit)

  // Barrel distortion : courbe l'UV vers l'extérieur (vrai bombé de tube)
  vec2 curveUv(vec2 uv, float amt){
    vec2 c = uv * 2.0 - 1.0;           // -1..1
    float r2 = dot(c, c);
    c *= 1.0 + amt * r2;               // pousse les bords
    return c * 0.5 + 0.5;
  }

  // masque de coins arrondis pour la zone hors-tube (noir au-delà du verre)
  float frameMask(vec2 uv){
    vec2 d = abs(uv - 0.5) - 0.5;
    // léger inset : bord du verre
    float edge = smoothstep(0.0, 0.006, -max(d.x, d.y));
    return edge;
  }

  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  // bruit 1D lissé — base des deux octaves de bad-tv-shader (felixturner)
  float noise1(float x){
    float i = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash(vec2(i, 0.0)), hash(vec2(i + 1.0, 0.0)), f) * 2.0 - 1.0;
  }

  // dalle de verre bombé : ce que l'on voit dans les coins courbes hors-image.
  // Pas du noir plat -> teinte de tube éteint + reflet de verre diagonal.
  vec3 glassBezel(vec2 p){          // p = vUv (0..1, non courbé)
    vec2 fc = p - 0.5;
    // dégradé sombre bleuté (dalle phosphore éteinte), un peu plus clair au centre
    vec3 glass = mix(vec3(0.015,0.012,0.03), vec3(0.045,0.035,0.075), 1.0 - length(fc)*1.3);
    // reflet de verre : bande diagonale douce en haut-gauche
    float refl = smoothstep(0.7, 0.0, distance(p, vec2(0.28, 0.22)));
    glass += vec3(0.05,0.06,0.10) * refl * 0.6;
    // teinte phosphore du thème, très légère
    glass += uTint * 0.02;
    return glass;
  }

  void main(){
    vec2 uv = curveUv(vUv, uCurve);

    // ── allumage CRT : l'image s'ouvre verticalement depuis une ligne brillante,
    //    avec un wobble de dégauss qui s'amortit. uBoot part au 1er raster (contenu prêt).
    float open = pow(smoothstep(0.0, 0.5, uBoot), 1.7);
    uv.y = 0.5 + (uv.y - 0.5) / max(open, 0.015);
    float wob = exp(-max(uBoot - 0.2, 0.0) * 2.6) * step(0.001, uBoot);
    uv.x += sin(uv.y * 23.0 + uBoot * 34.0) * 0.013 * wob;

    // hors du verre courbé -> dalle de verre (remplit les coins bombés, plus de noir plat)
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
      vec3 g = glassBezel(vUv) * frameMask(vUv);
      gl_FragColor = vec4(g, 1.0);
      return;
    }

    // rolling bar : bande de balayage qui descend lentement, avec sa déformation
    // typique CRT (le faisceau tire légèrement l'image à son passage).
    float roll = fract(uv.y - uTime * 0.06);
    float bar = smoothstep(0.0, 0.04, roll) * (1.0 - smoothstep(0.04, 0.10, roll));
    vec2 uvBar = uv + vec2(bar * 0.006, 0.0);           // léger shear horizontal sous la barre

    // aberration chromatique : décalage croissant avec la distance au centre
    vec2 fromC = uv - 0.5;
    float rEdge = dot(fromC, fromC) * 4.0;              // ~0 centre, ~1 coins
    vec2 ab = fromC * (uAberr / uRes.x) * rEdge;

    // burst glitch (spawn de GLITCH / passage en crit) : bandes horizontales déchirées
    // + spike d'aberration — décroît en ~380 ms côté JS
    if (uGlitchAmt > 0.001){
      float band = floor(uv.y * 36.0);
      float rnd = hash(vec2(band, floor(uTime * 30.0)));
      float tear = step(1.0 - 0.22 * uGlitchAmt, rnd);
      uvBar.x += tear * (rnd - 0.5) * 0.10 * uGlitchAmt;
      ab *= 1.0 + uGlitchAmt * 5.0 * (0.4 + 0.6 * tear);
    }

    // ── LIAISON MORTE : bad-tv-shader (felixturner) + RGB-split ────────────────
    // Deux octaves de bruit sur Y, amplifiées au cube : la base reste calme et les
    // pics sont rares — c'est ce qui fait « mauvaise réception » plutôt que « bruit ».
    // uOffBurst est piloté côté JS (rafale périodique amortie).
    float spx = 0.0;
    if (uOffline > 0.5){
      float yt = uv.y - uTime * 0.4;
      float o  = noise1(yt * 3.0) * 0.2;
      float d  = uOffWarp * (1.0 + uOffBurst * 3.0);
      o = o * d * o * d * o;
      o += noise1(yt * 50.0) * (uOffNoise * (1.0 + uOffBurst * 4.0)) * 0.001;
      // clamp et pas fract() : du texte qui wrappe au bord serait illisible
      uvBar.x = clamp(uvBar.x + o, 0.002, 0.998);

      // Le split est en PIXELS d'écran : exprimé en UV il tombait sous le pixel et
      // restait invisible à tous les niveaux. La composante VERTICALE sur R/B est ce
      // qui le rend lisible sur des glyphes fins.
      spx = uOffSplit * (1.0 + uOffBurst * 3.5);
    }
    float wobS = noise1(uTime * 90.0) * uOffBurst;
    vec2 dR = vec2( spx * (1.0 + wobS),  spx * 0.45) / uRes;
    vec2 dB = vec2(-spx * (1.0 - wobS), -spx * 0.45) / uRes;

    float r = texture2D(uTex, uvBar + ab + dR).r;
    float g = texture2D(uTex, uvBar).g;
    float b = texture2D(uTex, uvBar - ab + dB).b;
    vec3 col = vec3(r, g, b);

    // bloom cheap : moyenne de quelques taps -> zones claires bavent (phosphore)
    vec3 bl = vec3(0.0);
    float px = 1.6 / uRes.x, py = 1.6 / uRes.y;
    bl += texture2D(uTex, uv + vec2( px,  0.0)).rgb;
    bl += texture2D(uTex, uv + vec2(-px,  0.0)).rgb;
    bl += texture2D(uTex, uv + vec2(0.0,  py)).rgb;
    bl += texture2D(uTex, uv + vec2(0.0, -py)).rgb;
    bl += texture2D(uTex, uv + vec2( px,  py)).rgb;
    bl += texture2D(uTex, uv + vec2(-px, -py)).rgb;
    bl /= 6.0;
    bl = max(bl - 0.25, 0.0) * 1.7;                     // seuil : ne bloome que le lumineux
    // Atténué quand le split monte : sinon le bloom re-moyenne la frange R/B qu'on
    // vient de créer et le réglage sature sans rien montrer à l'écran.
    col += bl * uBloom * (1.0 + uTint * 0.4) * (1.0 - 0.55 * clamp(spx / 12.0, 0.0, 1.0));

    // scanlines fines. Argument ~2000-3000 (uv.y * uRes.y * pi) -> exige highp (cf precision
    // en tête de fichier) : en mediump réel (16 bits), beaucoup de GPU Android quantisent
    // l'argument par pas de ~2 rad à cette magnitude -> sin() quasi constant -> lignes
    // invisibles. Les GPU Apple calculent mediump en highp -> jamais vu le bug sur iPad.
    float scan = sin(uv.y * uRes.y * 3.14159) * 0.5 + 0.5;
    col *= 1.0 - uScan * (1.0 - scan) * 0.5;

    // rolling bar : sursaut de luminance sous la barre (déformation calculée plus haut)
    col += bar * 0.05 * (0.5 + uTint);

    // flicker de signal + grain
    float fl = 1.0 - uFlickerAmp * (0.5 + 0.5 * sin(uTime * 9.0)) * hash(vec2(uTime, uv.y));
    col *= fl;
    col += (hash(uv * uRes + uTime) - 0.5) * 0.06;

    // grille RGB (aperture grille façon Trinitron) sur les pixels PHYSIQUES : triades de
    // phosphore verticales, LE détail qui fait "vrai tube" de près. Compensation de
    // luminance intégrée (la grille mange ~1/4 de la lumière sinon).
    if (uMask > 0.001){
      float mph = mod(gl_FragCoord.x, 3.0);
      vec3 tri = mph < 1.0 ? vec3(1.0, 1.0 - uMask, 1.0 - uMask)
               : mph < 2.0 ? vec3(1.0 - uMask, 1.0, 1.0 - uMask)
                           : vec3(1.0 - uMask, 1.0 - uMask, 1.0);
      col *= tri * (1.0 + uMask * 0.7);
    }

    // gain global : remonte la luminance (le tube était sous-exposé)
    // uOffDim baisse le tube quand la liaison est morte : l'écran reste allumé (ce n'est pas
    // un écran noir) mais en veilleuse — c'est ce qui distingue « plus de signal » de « card KO ».
    col *= 1.18 * uOffDim;

    // vignette TRÈS douce (écran plat rempli : on ne veut pas noircir les bords/coins)
    float vig = smoothstep(1.5, 0.6, length(fromC) * 1.35);
    col *= mix(0.82, 1.0, vig);

    // teinte phosphore globale très légère
    col = mix(col, col * (0.92 + uTint * 0.25), 0.18);

    // alerte critique : pousse le rouge
    col = mix(col, col * vec3(1.35, 0.7, 0.7) + vec3(0.06, 0.0, 0.0), uCritical * 0.5);

    // allumage : montée de luminance progressive + flash blanc qui retombe
    col *= 0.25 + 0.75 * smoothstep(0.05, 0.6, uBoot);
    col += exp(-uBoot * 3.5) * (vec3(0.55) + uTint * 0.5);

    col *= frameMask(vUv);   // masque sur l'UV NON courbé pour un bord de verre net
    gl_FragColor = vec4(col, 1.0);
  }`;

/* passe rémanence phosphore : accumulation ping-pong AVANT le post-process CRT.
 * max() (pas d'addition) : l'écriture neuve domine, la trace retombe en exponentielle
 * sans jamais saturer. Valeurs bornées 0..1 -> mediump suffit (pas de grand argument). */
const PERSIST_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uSrc;    // terminal fraîchement rasterisé
  uniform sampler2D uPrev;   // accumulation précédente
  uniform float uDecay;      // par frame, corrigé du dt côté JS
  void main(){
    vec3 cur  = texture2D(uSrc, vUv).rgb;
    vec3 prev = texture2D(uPrev, vUv).rgb * uDecay;
    gl_FragColor = vec4(max(cur, prev), 1.0);
  }`;

class LinuxTerminalCardWebgl extends HTMLElement {
  constructor(){ super(); this.attachShadow({ mode: 'open' }); this._id = (Math.random()*1e4|0); this._catPending = new Set(); }

  setConfig(c){
    if (!c) throw new Error('config manquante');
    const first = !this._config;
    this._config = { host: 'chris@latitude', ...c };

    // Édition en direct (éditeur) : si le WebGL tourne ET que son contexte est VIVANT,
    // NE PAS recréer le contexte (lourd + async). Relit couleurs/fx/fond, re-rasterise.
    if (!first && this._gl && this._webgl && !this._gl.isContextLost()){
      this._applyLiveConfig();
      return;
    }
    // Premier montage OU changements structurels (fallback CSS) : rendu complet.
    this._rendered = false;
    this._renderKey = null;
    if (this._hass) this._render();
  }

  // recharge les réglages visuels sans détruire le contexte WebGL, puis re-dessine
  _applyLiveConfig(){
    const cfg = this._config;
    this._fx = this._readFx();
    this._tint = this._resolveTint();
    // met à jour le header (titre/couleur/typo/effets) si présent — mêmes réglages que _render()
    const hdr = cfg.header || {};
    const ht = this.shadowRoot.getElementById('hdr-title');
    if (ht) ht.textContent = hdr.title || cfg.title || 'Latitude 5420';
    const card = this.shadowRoot.querySelector('ha-card');
    if (card){
      const hdrColor = hdr.color || 'var(--primary-color)';
      card.style.setProperty('--ltc-hdr-color', hdrColor);
      const setOrClear = (prop, val) => val ? card.style.setProperty(prop, val) : card.style.removeProperty(prop);
      setOrClear('--ltc-hdr-size', hdr.title_size || '');
      if (hdr.font) _loadGoogleFont(hdr.font);
      setOrClear('--ltc-hdr-font', hdr.font ? `'${hdr.font}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)` : '');
      setOrClear('--ltc-hdr-weight', hdr.font_weight ?? '');
      setOrClear('--ltc-hdr-spacing', hdr.letter_spacing || '');
      setOrClear('--ltc-hdr-upper', hdr.uppercase === false ? 'none' : '');
      setOrClear('--ltc-hdr-italic', hdr.italic ? 'italic' : '');
      const glowColor = hdr.glow_color || hdrColor;
      const glowSize  = parseFloat(hdr.glow_size) || 12;
      const glow = (col, sz) => `0 0 ${Math.round(sz*0.2)}px #fff,0 0 ${Math.round(sz*0.4)}px ${col},0 0 ${Math.round(sz*0.8)}px ${col},0 0 ${sz}px ${col}`;
      setOrClear('--ltc-hdr-shadow', hdr.title_shadow || (hdr.glow ? glow(glowColor, glowSize) : ''));
      setOrClear('--ltc-hdr-grad', hdr.gradient ? `linear-gradient(90deg,${hdr.gradient_from || hdrColor},${hdr.gradient_to || 'var(--accent-color)'})` : '');
      if (ht) ht.classList.toggle('grad', !!hdr.gradient);
      setOrClear('--ltc-hdr-icon-color', hdr.icon_color || '');
      setOrClear('--ltc-hdr-icon-size', hdr.icon_size || '');
      setOrClear('--ltc-hdr-icon-glow', hdr.glow ? `drop-shadow(0 0 ${Math.round(glowSize*0.12)}px #fff) drop-shadow(0 0 ${Math.round(glowSize*0.24)}px ${glowColor}) drop-shadow(0 0 ${Math.round(glowSize*0.48)}px ${glowColor}) drop-shadow(0 0 ${Math.round(glowSize*0.6)}px ${glowColor})` : '');
      setOrClear('--ltc-hdr-flicker', hdr.flicker ? 'ltc-hdr-flicker 3s ease-in-out infinite' : '');
      // l'icône elle-même (présence/absence, mdi) exige de recréer le nœud — rare en usage live,
      // pris en charge par le rendu complet (_render) déclenché aux changements structurels.
      const hi = this.shadowRoot.querySelector('.hdr-icon');
      if (hi && hdr.icon) hi.setAttribute('icon', hdr.icon);
    }
    // force le re-dessin de la texture (nouvelle palette / fond)
    this._renderKey = null;
    this._rasterized = false;
    this._update();
    // le panneau d'édition peut avoir occulté la preview assez longtemps pour que le
    // navigateur suspende son rAF (throttling visibilité) -> la boucle ne s'auto-relance
    // jamais toute seule. On la relance ici si elle est morte alors que le contexte est vivant.
    if (!this._glRaf && this._gl && !this._gl.isContextLost()){
      this._loopGl();
    }
  }

  set hass(h){
    this._hass = h;
    if (!this._rendered){ this._render(); return; }
    // coalescing RAF (MD §5) pour les DEUX chemins : HA pousse hass à CHAQUE event du bus
    // (toutes entités confondues) -> sans coalescing, _sys()+stringify tournent en rafale
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      if (this._webgl) this._update(); else this._updateDom();
    });
  }

  // rattachement (retour sur le dashboard / sortie d'éditeur) : le contexte WebGL a
  // été détruit au disconnect -> tout re-monter. rAF pour laisser le layout se poser
  // (le panneau d'édition anime sa taille -> éviter un 1er render à taille 0/instable).
  connectedCallback(){
    if (this._hass && this._config && !this._rendered){
      requestAnimationFrame(() => {
        if (this.isConnected && !this._rendered) this._render();
      });
    }
  }

  // Au démontage seulement : on oublie un éventuel échec WebGL pour laisser une
  // vraie nouvelle chance au remontage. (_cleanup est aussi appelé à chaque _render,
  // où il faut au contraire GARDER le false — sinon _initGl reboucle.)
  disconnectedCallback(){ this._cleanup(); this._webgl = undefined; }
  _cleanup(){
    if (this._raf){ cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._glRaf){ cancelAnimationFrame(this._glRaf); this._glRaf = 0; }
    if (this._catTimer){ clearTimeout(this._catTimer); this._catTimer = 0; }
    for (const timer of this._catPending) clearTimeout(timer);
    this._catPending.clear();
    if (this._ro){ this._ro.disconnect(); this._ro = null; }
    // libère le contexte WebGL (ressource limitée ~16/page) — règle ha-responsive-cards
    if (this._gl){
      try {
        if (this._tex) this._gl.deleteTexture(this._tex);
        if (this._buf) this._gl.deleteBuffer(this._buf);
        if (this._prog) this._gl.deleteProgram(this._prog);
        if (this._pprog) this._gl.deleteProgram(this._pprog);
        (this._acc || []).forEach(tx => tx && this._gl.deleteTexture(tx));
        (this._fbo || []).forEach(fb => fb && this._gl.deleteFramebuffer(fb));
        this._gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch(e){}
      this._gl = null; this._tex = null; this._prog = null;
      this._buf = null;
      this._pprog = null; this._acc = null; this._fbo = null;
    }
    // canvas 2D offscreen : gros bitmap -> couper les références pour le GC
    this._tcanvas = null; this._tctx = null; this._u = null;
    this._canvas = null;
    this._bootT0 = null; this._glitchT0 = 0;   // l'anim d'allumage rejouera au remontage
    this._lastGlFrame = 0;
    // état de rendu réinitialisé -> connectedCallback/set hass relanceront _render()
    this._rendered = false;
    this._rasterized = false;
    this._renderKey = null;
    this._cats = [];
    // dimensions mises en cache : à oublier, sinon un _resizeGl() futur sur un nouveau
    // contexte peut croire "taille inchangée" (W/H identiques par coïncidence) et sauter
    // le tout premier rasterize/layoutHit -> tube vide ou coupé au remontage.
    this._W = 0; this._H = 0;
  }

  _fallbackToCss(reason){
    if (reason) console.warn('[ltc-webgl] repli CSS :', reason);
    this._webgl = false;
    this._rendered = false;
    this._cleanup();
    if (this._hass && this.isConnected) this._render();
  }

  getCardSize(){ return 5; }
  static getConfigElement(){ return document.createElement('linux-terminal-card-webgl-editor'); }
  static getStubConfig(){
    return {
      header: { title: 'Latitude 5420', icon: 'mdi:laptop' },
      host: 'chris@latitude',
      os_entity:      'sensor.chris_latitude_5420_rugged_os',
      kernel_entity:  'sensor.chris_latitude_5420_rugged_kernel',
      uptime_entity:  'sensor.chris_latitude_5420_rugged_uptime',
      updates_entity: 'sensor.chris_latitude_5420_rugged_apt_pending_upgrades',
      release_entity: 'sensor.chris_latitude_5420_rugged_release_upgrade',
      reboot_entity:  'binary_sensor.chris_latitude_5420_rugged_reboot_required',
      proc_entity:    'sensor.192_168_1_53_total',
      cpu_entity:     'sensor.192_168_1_53_utilisation_cpu',
      gpu_entity:     'sensor.192_168_1_53_uhd_graphics_620_gpu_intel0_processor_usage',
      load_entity:    'sensor.chris_latitude_5420_rugged_load_1m',
      load_cores:     8,
      ram_entity:     'sensor.192_168_1_53_utilisation_de_la_memoire',
      disk_entity:    'sensor.192_168_1_53_utilisation_disque',
      temp_entity:    'sensor.192_168_1_53_package_id_0_temperature',
      battery_entity: 'sensor.192_168_1_53_battery_charge',
      net_rx_entity:  'sensor.192_168_1_53_wlp3s0_rx',
      net_tx_entity:  'sensor.192_168_1_53_wlp3s0_tx',
      temp_warn: 65, temp_crit: 85,
      batt_warn: 25, batt_crit: 10,
      // battery_entity_2 (2e batterie, même logique inversée) et *_label / *_warn / *_hot
      // (détournement d'un slot : label + seuils custom) sont optionnels, non pré-remplis ici.
    };
  }

  // `unavailable`/`unknown` arrivent en CHAÎNES, pas en null : sans ce filtre elles
  // ressortent telles quelles à l'écran (« up unavailable ») ou passent les tests `|| 'Linux'`.
  _ent(id){
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s) return null;
    const dead = ['unavailable', 'unknown', 'none', ''].includes(String(s.state).toLowerCase());
    return { v: dead ? null : s.state, a: s.attributes, dead, since: s.last_changed };
  }
  _moreInfo(id){ if (!id) return; this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

  /* ── LOGIQUE MÉTIER (identique à la card d'origine) ── */
  _sys(){
    const c = this._config;
    const cpu = _num(this._ent(c.cpu_entity)?.v);
    const gpu = _num(this._ent(c.gpu_entity)?.v);
    const ram = _num(this._ent(c.ram_entity)?.v);
    const disk = _num(this._ent(c.disk_entity)?.v);
    const temp = _num(this._ent(c.temp_entity)?.v);
    const batt = _num(this._ent(c.battery_entity)?.v);
    const batt2 = _num(this._ent(c.battery_entity_2)?.v);
    const rx = _num(this._ent(c.net_rx_entity)?.v);
    const tx = _num(this._ent(c.net_tx_entity)?.v);
    const os = this._ent(c.os_entity)?.v;
    const kernel = this._ent(c.kernel_entity)?.v;
    const up = this._ent(c.uptime_entity)?.v;
    const proc = this._ent(c.proc_entity)?.v;
    const updRaw = this._ent(c.updates_entity)?.v;
    const updates = _num(updRaw);
    const relRaw = this._ent(c.release_entity)?.v;
    const release = (relRaw && !['none', '?', 'unknown', 'unavailable'].includes(String(relRaw).toLowerCase())) ? relRaw : null;
    // Offline = les métriques vitales sont mortes ensemble. Une seule qui tombe = capteur
    // capricieux, pas une machine éteinte : il faut CPU *et* RAM pour conclure.
    const cpuE = this._ent(c.cpu_entity), ramE = this._ent(c.ram_entity);
    const offline = !!(cpuE?.dead && ramE?.dead);
    // Dernier contact = dernier changement d'état du CPU (l'entité la plus bavarde quand ça vit).
    const lastSeen = offline ? (cpuE?.since || ramE?.since || null) : null;
    const reboot = this._ent(c.reboot_entity)?.v === 'on';
    const loadRaw = _num(this._ent(c.load_entity)?.v);
    const cores = c.load_cores || 8;
    const load = loadRaw != null ? Math.min(100, loadRaw / cores * 100) : null;
    const battA = this._ent(c.battery_entity)?.a || {};
    const charging = String(battA.status || '').toLowerCase().includes('charg');
    const batt2A = this._ent(c.battery_entity_2)?.a || {};
    const charging2 = String(batt2A.status || '').toLowerCase().includes('charg');
    const kshort = kernel ? 'k' + kernel.split('-')[0].split('.').slice(0, 2).join('.') : null;
    // `up` est un device_class:timestamp → l'état est la date de DÉMARRAGE en ISO.
    // Affiché brut ça donne « up 2026-07-22T17:58:40+00:00 » ; on veut une durée.
    const upTxt = _since(up);
    return { cpu, gpu, ram, disk, temp, batt, batt2, rx, tx, os, kshort, up: upTxt, proc, updates, release, reboot, load, charging, charging2, offline, lastSeen };
  }

  _alertLevel(s){
    const c = this._config;
    const tW = c.temp_warn ?? 65, tC = c.temp_crit ?? 85;
    const bW = c.batt_warn ?? 25, bC = c.batt_crit ?? 10;
    const critTemp = s.temp != null && s.temp >= tC;
    const critBatt = s.batt != null && s.batt <= bC && !s.charging;
    const warnTemp = s.temp != null && s.temp >= tW;
    const warnBatt = s.batt != null && s.batt <= bW && !s.charging;
    if (critTemp || critBatt) return { lvl: 'crit', critTemp, critBatt };
    if (warnTemp || warnBatt) return { lvl: 'warn', warnTemp, warnBatt };
    return { lvl: 'ok' };
  }

  _render(){
    if (!this._hass || !this._config) return;
    this._cleanup();
    const c = this._config, hdr = c.header || {};
    const cardModBg = c.card_mod_bg !== false;
    const hdrColor = hdr.color || 'var(--primary-color)';
    // Liseret/bezel autour de l'écran : suit le thème (--rgb-primary-color) par défaut ;
    // col_frame permet de le décoréler du thème (couleur fixe, indép. des variantes claires/sombres).
    const frameRgb = this._hexToRgb(c.col_frame);

    // WebGL partout (y compris iPad/Android) — à l'essai, cf mémoire project_linux_terminal_card_webgl.
    // getContext('webgl') échouant reste couvert par le fallback CSS (_initGl -> _render si !gl).
    // ⚠ `??=` et pas `=` : _initGl pose _webgl=false puis rappelle _render(). Une affectation
    // sèche le remettait à true → _initGl retentait → boucle, et le fallback CSS annoncé
    // ci-dessus était INATTEIGNABLE sur un navigateur sans WebGL. Vérifié 2026-07-25.
    this._webgl ??= true;

    // Header canonique (même moteur que neon-entities-card.js / neon-climate-card-webgl.js) :
    // police/majuscules/épaisseur/espacement/italique/dégradé/glow/flicker/icône. Défauts
    // conservés identiques à avant quand les nouveaux champs ne sont pas renseignés (pas de
    // régression sur les configs existantes).
    if (hdr.font) _loadGoogleFont(hdr.font);
    const hdrFont = hdr.font
      ? `'${hdr.font}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)`
      : '';
    const hdrWeight  = hdr.font_weight ?? '';
    const hdrSpacing = hdr.letter_spacing || '';
    const hdrUpper   = hdr.uppercase === false ? 'none' : '';
    const hdrItalic  = hdr.italic ? 'italic' : '';
    const _neonGlow = (col, sz) => `0 0 ${Math.round(sz*0.2)}px #fff,0 0 ${Math.round(sz*0.4)}px ${col},0 0 ${Math.round(sz*0.8)}px ${col},0 0 ${sz}px ${col}`;
    const hdrGlowColor = hdr.glow_color || hdrColor;
    const hdrGlowSize  = parseFloat(hdr.glow_size) || 12;
    const hdrShadow = hdr.title_shadow || (hdr.glow ? _neonGlow(hdrGlowColor, hdrGlowSize) : '');
    const hdrGradFrom = hdr.gradient_from || hdrColor;
    const hdrGradTo   = hdr.gradient_to   || 'var(--accent-color)';
    const hdrGrad = hdr.gradient ? `linear-gradient(90deg,${hdrGradFrom},${hdrGradTo})` : '';
    const hdrIconColor = hdr.icon_color || '';
    const hdrIconSize  = hdr.icon_size || '';
    // 4 couches, symétrique à _neonGlow() du titre (canon neon-climate-card-webgl.js) — un halo
    // blanc serré en tête, sinon l'icône et le titre glow visiblement différemment. drop-shadow()
    // s'accumule plus fort que text-shadow sur une icône compacte : rayons réduits (×0.6) pour
    // que l'intensité perçue matche le titre au lieu de le dépasser (retour Chris v1.9).
    const hdrIconGlow = hdr.glow
      ? `drop-shadow(0 0 ${Math.round(hdrGlowSize*0.12)}px #fff) drop-shadow(0 0 ${Math.round(hdrGlowSize*0.24)}px ${hdrGlowColor}) drop-shadow(0 0 ${Math.round(hdrGlowSize*0.48)}px ${hdrGlowColor}) drop-shadow(0 0 ${Math.round(hdrGlowSize*0.6)}px ${hdrGlowColor})`
      : '';
    const hdrFlickAnim = hdr.flicker ? 'ltc-hdr-flicker 3s ease-in-out infinite' : '';

    this.shadowRoot.innerHTML = `
      <style>${STYLES}
        ha-card{
          ${cardModBg ? '' : `background:${c.color_bg || '#0c0818'};`}
          --ltc-hdr-color:${hdrColor};
          ${hdr.title_size  ? `--ltc-hdr-size:${hdr.title_size};`     : ''}
          ${hdrShadow       ? `--ltc-hdr-shadow:${hdrShadow};`        : ''}
          ${hdrFont         ? `--ltc-hdr-font:${hdrFont};`            : ''}
          ${hdrWeight       ? `--ltc-hdr-weight:${hdrWeight};`        : ''}
          ${hdrSpacing      ? `--ltc-hdr-spacing:${hdrSpacing};`      : ''}
          ${hdrUpper        ? `--ltc-hdr-upper:${hdrUpper};`          : ''}
          ${hdrItalic       ? `--ltc-hdr-italic:${hdrItalic};`        : ''}
          ${hdrGrad         ? `--ltc-hdr-grad:${hdrGrad};`            : ''}
          ${hdrIconColor    ? `--ltc-hdr-icon-color:${hdrIconColor};` : ''}
          ${hdrIconSize     ? `--ltc-hdr-icon-size:${hdrIconSize};`   : ''}
          ${hdrIconGlow     ? `--ltc-hdr-icon-glow:${hdrIconGlow};`   : ''}
          ${hdrFlickAnim    ? `--ltc-hdr-flicker:${hdrFlickAnim};`    : ''}
          ${frameRgb ? `--ltc-frame:${frameRgb.join(',')};` : ''}
        }
      </style>
      <ha-card>
        <div class="hdr" id="hdr">
          ${hdr.icon ? `<ha-icon class="hdr-icon" icon="${_esc(hdr.icon)}"></ha-icon>` : ''}
          <span class="hdr-title${hdrGrad ? ' grad' : ''}" id="hdr-title">${_esc(hdr.title || c.title || 'Latitude 5420')}</span>
          <span class="hdr-pill" id="pwr">●</span>
        </div>
        ${this._webgl ? `
          <div class="tv-shell">
            <span class="tv-screw tl"></span><span class="tv-screw tr"></span>
            <span class="tv-screw bl"></span><span class="tv-screw br"></span>
            <span class="tv-brand">ARASAKA tactical hardware // secure line</span>
            <div class="screen gl" id="screen">
              <canvas class="glcanvas" id="glcanvas"></canvas>
              <div class="hit" id="hit"></div>
            </div>
          </div>
        ` : `
          <div class="screen" id="screen">
            <div class="glow"></div>
            <div class="term" id="term"></div>
            <div class="cat-host" id="catHost"></div>
            <div class="scan"></div>
            <div class="vignette"></div>
            <div class="flicker"></div>
          </div>
        `}
      </ha-card>`;

    this._rendered = true;

    if (this._webgl){
      this._initGl().catch(e => this._fallbackToCss(e));
    } else {
      this.shadowRoot.getElementById('term').addEventListener('click', () => this._moreInfo(c.cpu_entity));
      this._updateDom();
      if (!LTC_IS_LOW_POWER) this._catLoop();
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
   *  CHEMIN WEBGL
   * ══════════════════════════════════════════════════════════════════════ */
  async _initGl(){
    const canvas = this.shadowRoot.getElementById('glcanvas');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
    if (!gl){ this._webgl = false; return this._render(); }   // pas de WebGL -> CSS
    this._gl = gl; this._canvas = canvas;

    // le navigateur peut recycler le contexte WebGL (changement de vue, trop de contextes) :
    // à la perte, on stoppe la boucle ; à la restauration, on re-render tout proprement.
    canvas.addEventListener('webglcontextlost', (e) => {
      if (e.target !== this._canvas) return;   // écho async d'un canvas déjà remplacé (cf _cleanup -> loseContext) : ignorer
      e.preventDefault();
      if (this._glRaf){ cancelAnimationFrame(this._glRaf); this._glRaf = 0; }
      this._fallbackToCss('contexte WebGL perdu');
    });
    canvas.addEventListener('webglcontextrestored', (e) => {
      if (e.target !== this._canvas) return;
      this._rendered = false; this._gl = null;
      this._initGl().catch(err => this._fallbackToCss(err));
    });

    // programme
    const prog = this._buildProgram(gl, VERT, FRAG);
    this._prog = prog; gl.useProgram(prog);

    // quad plein écran
    const buf = gl.createBuffer();
    this._buf = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // texture terminal
    this._tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // uniforms
    this._u = {
      tex:   gl.getUniformLocation(prog, 'uTex'),
      time:  gl.getUniformLocation(prog, 'uTime'),
      res:   gl.getUniformLocation(prog, 'uRes'),
      curve: gl.getUniformLocation(prog, 'uCurve'),
      aberr: gl.getUniformLocation(prog, 'uAberr'),
      scan:  gl.getUniformLocation(prog, 'uScan'),
      bloom: gl.getUniformLocation(prog, 'uBloom'),
      flick: gl.getUniformLocation(prog, 'uFlickerAmp'),
      tint:  gl.getUniformLocation(prog, 'uTint'),
      crit:  gl.getUniformLocation(prog, 'uCritical'),
      mask:  gl.getUniformLocation(prog, 'uMask'),
      boot:  gl.getUniformLocation(prog, 'uBoot'),
      glitch:gl.getUniformLocation(prog, 'uGlitchAmt'),
      off:   gl.getUniformLocation(prog, 'uOffline'),
      oWarp: gl.getUniformLocation(prog, 'uOffWarp'),
      oNoise:gl.getUniformLocation(prog, 'uOffNoise'),
      oBurst:gl.getUniformLocation(prog, 'uOffBurst'),
      oSplit:gl.getUniformLocation(prog, 'uOffSplit'),
      oDim:  gl.getUniformLocation(prog, 'uOffDim'),
    };
    gl.uniform1i(this._u.tex, 0);

    // ── rémanence phosphore : programme + ping-pong FBO (2 textures d'accumulation) ──
    this._pprog = this._buildProgram(gl, VERT, PERSIST_FRAG);
    this._pu = { decay: gl.getUniformLocation(this._pprog, 'uDecay') };
    gl.useProgram(this._pprog);
    gl.uniform1i(gl.getUniformLocation(this._pprog, 'uSrc'), 0);
    gl.uniform1i(gl.getUniformLocation(this._pprog, 'uPrev'), 1);
    gl.useProgram(prog);
    this._acc = [null, null]; this._fbo = [null, null]; this._pp = 0;
    for (let i = 0; i < 2; i++){
      const tx = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
      this._acc[i] = tx; this._fbo[i] = fb;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // presets d'intensité — CINÉMATIQUE DOSÉ (texte net, courbure légère)
    this._fx = this._readFx();
    // teinte phosphore = couleur primaire du thème (violet UV par défaut)
    this._tint = this._resolveTint();

    // canvas 2D offscreen pour rasteriser le terminal
    this._tcanvas = document.createElement('canvas');
    this._tctx = this._tcanvas.getContext('2d');

    // GLITCH le chat (état d'animation, dessiné dans la texture)
    this._cats = [];
    // DPR par défaut avant le 1er _resizeGl (évite NaN dans les uniforms)
    this._dpr = Math.min(window.devicePixelRatio || 1, 2);

    // attendre les polices avant le 1er draw (sinon repli visuel). fillText ne DÉCLENCHE
    // PAS le chargement d'une police : fonts.ready seul peut se résoudre avant que
    // JetBrains Mono soit demandée -> fonts.load() force le fetch des deux graisses.
    try {
      await Promise.all([
        document.fonts.load("500 13.5px 'JetBrains Mono'"),
        document.fonts.load("700 13.5px 'JetBrains Mono'"),
        document.fonts.ready,
      ]);
    } catch(e){}
    if (!this._gl) return;   // démonté pendant l'await

    // redimensionnement
    this._ro = new ResizeObserver(() => this._resizeGl());
    this._ro.observe(this.shadowRoot.getElementById('screen'));
    this._resizeGl();
    if (!this._gl) return;

    // clics
    this._critical = false;
    this._update();          // 1er rasterise + hit layer
    this._catLoopGl();
    this._loopGl();          // boucle d'animation shader
  }

  // réglages CRT normalisés — l'éditeur stocke des STRINGS ("0.2") : _num les convertit,
  // défauts centralisés (une seule source pour _initGl ET _applyLiveConfig)
  _readFx(){
    const cfg = this._config;
    return {
      curve: _num(cfg.crt_curve) ?? 0.0,   // 0 = écran plat qui remplit tout le rect
      aberr: _num(cfg.crt_aberration) ?? 1.8,
      scan:  _num(cfg.crt_scanlines) ?? 0.45,
      bloom: _num(cfg.crt_bloom) ?? 0.5,
      flick: _num(cfg.crt_flicker) ?? 0.04,
      mask:  _num(cfg.crt_mask) ?? 0.35,   // grille RGB (0 = off)
      glitch:_num(cfg.crt_glitch) ?? 0.7,  // intensité des bursts (0 = off)
      boot:  _num(cfg.crt_boot) ?? 1,      // 1 = animation d'allumage au montage
      persist:_num(cfg.crt_persist) ?? 0.6, // rémanence phosphore (0 = off, 1 = trail long)
      // Écran « liaison morte » — valeurs réglées à l'œil au banc d'essai (skill
      // ha-card-preview-bench, 2026-07-25) : ne pas les rechoisir au jugé.
      oWarp:  _num(cfg.offline_warp)   ?? 1.0,  // ondulation lente
      oNoise: _num(cfg.offline_noise)  ?? 6.0,  // grain haute fréquence
      oBurst: _num(cfg.offline_burst)  ?? 1.50, // amplitude de la rafale
      oPeriod:_num(cfg.offline_period) ?? 8.0,  // secondes entre deux rafales
      oSplit: _num(cfg.offline_split)  ?? 8.5,  // RGB split, en pixels
      oDim:   _num(cfg.offline_dim)    ?? 0.46, // luminosité de l'écran mort
    };
  }

  _resolveTint(){
    // teinte du glow/bloom : suit --rgb-primary-color du thème ; défaut CYAN neutre
    // (= couleur du texte terminal, va avec tous les thèmes — plus de violet imposé)
    let triplet = '0,229,255';
    try {
      const v = getComputedStyle(this.shadowRoot.querySelector('ha-card'))
        .getPropertyValue('--rgb-primary-color').trim();
      if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(v)) triplet = v;
    } catch(e){}
    const [r,g,b] = triplet.split(',').map(n => parseInt(n,10)/255);
    return [r,g,b];
  }

  // hex "#rrggbb" -> [r,g,b] 0..255
  _hexToRgb(hex){
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex).trim());
    return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : null;
  }

  // deux stops du dégradé de dalle : neutre sombre par défaut, teintable via screen_bg
  _bgStops(){
    const rgb = this._hexToRgb(this._config.screen_bg);
    if (!rgb){
      // dalle neutre : quasi-noir très légèrement froid (tube éteint), va avec tout
      return { inner: '#0e0e13', outer: '#050507' };
    }
    // centre = couleur choisie assombrie ~14%, bord ~6% -> aspect dalle profonde
    const s = (f) => 'rgb(' + rgb.map(c => Math.round(c*f)).join(',') + ')';
    return { inner: s(0.16), outer: s(0.06) };
  }

  // "#rrggbb" + alpha -> "rgba(r,g,b,a)" (pour dériver les couleurs atténuées)
  _rgba(hex, a){
    const rgb = this._hexToRgb(hex);
    return rgb ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})` : hex;
  }

  // palette du terminal : chaque rôle configurable, défaut = couleurs actuelles.
  // clés conservées (k/dim/cy/grn/amb/red/txt/violet) pour ne pas toucher au rasterize.
  _pal(){
    const c = this._config;
    const primary = c.col_primary || '#00e5ff';
    const prompt  = c.col_prompt  || '#4af2a1';
    const warn    = c.col_warn    || '#ffad33';
    const crit    = c.col_crit    || '#ff3d50';
    const txt     = c.col_txt     || '#d9ccff';
    const down    = c.col_down    || primary;
    const up      = c.col_up      || '#c08cff';
    // dim/labels : couleur col_dim si fournie, sinon primary atténué à 55%
    const dim = c.col_dim ? this._rgba(c.col_dim, 0.55) : this._rgba(primary, 0.55);
    return {
      k: dim, dim: dim, cy: primary, grn: prompt,
      amb: warn, red: crit, txt: txt, violet: up, down: down,
    };
  }

  /* hauteur du tube en px CSS, calculée depuis le contenu (source de vérité unique —
     ne JAMAIS relire cette valeur depuis getBoundingClientRect : dans l'éditeur, le
     panneau anime sa taille et le rect est transitoire -> désync avec _fitHeight
     qui écrit ce même height, d'où l'effet "tronqué" observé). */
  _wantedHeight(){
    return Math.round((this._lines ? this._lines.length : 12) * LTC_LINE_H + LTC_TUBE_PAD * 2);
  }

  /* cale la hauteur CSS du tube exactement sur le contenu -> zéro vide haut/bas */
  _fitHeight(){
    const screen = this.shadowRoot.getElementById('screen');
    if (!screen || !this._lines) return;
    screen.style.height = this._wantedHeight() + 'px';   // override du min-height CSS
  }

  _resizeGl(){
    const gl = this._gl; if (!gl) return;
    const screen = this.shadowRoot.getElementById('screen');
    const r = screen.getBoundingClientRect();
    if (r.width < 20) return;
    // largeur MESURÉE (dépend du layout/dashboard) ; hauteur CALCULÉE (source de vérité,
    // jamais le rect transitoire du panneau d'édition) -> jamais tronqué en preview.
    const cssH = this._wantedHeight();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(r.width * dpr), H = Math.round(cssH * dpr);
    if (W === this._W && H === this._H) return;
    this._W = W; this._H = H; this._dpr = dpr;
    this._canvas.width = W; this._canvas.height = H;
    this._canvas.style.width = r.width + 'px';
    this._canvas.style.height = cssH + 'px';
    this._tcanvas.width = W; this._tcanvas.height = H;
    // rémanence : réalloue les textures d'accumulation à la nouvelle taille (zérofiées par la spec)
    if (this._acc){
      for (const tx of this._acc){
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      for (const fb of this._fbo){
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE){
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          this._fallbackToCss('FBO de rémanence incomplet');
          return;
        }
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.viewport(0, 0, W, H);
    this._rasterize();       // re-dessine le texte à la nouvelle taille
    this._layoutHit();
  }

  _buildProgram(gl, vsrc, fsrc){
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
        const info = gl.getShaderInfoLog(s) || 'erreur inconnue';
        gl.deleteShader(s);
        throw new Error('shader: ' + info);
      }
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fsrc));
    gl.bindAttribLocation(p, 0, 'aPos');   // même slot pour tous les programmes -> un seul vertexAttribPointer
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)){
      const info = gl.getProgramInfoLog(p) || 'erreur inconnue';
      gl.deleteProgram(p);
      throw new Error('link: ' + info);
    }
    return p;
  }

  /* ── boucle d'animation (uniquement le shader anime ; texte re-rasterisé sur data) ── */
  _loopGl(){
    if (!this._gl) return;
    const gl = this._gl, u = this._u;
    const nowT = performance.now();
    if (this._lastGlFrame && nowT - this._lastGlFrame < 1000 / 30){
      this._glRaf = requestAnimationFrame(() => this._loopGl());
      return;
    }
    this._lastGlFrame = nowT;
    const t = (nowT - (this._t0 || (this._t0 = nowT))) / 1000;

    // GLITCH bouge -> re-rasteriser le contenu (texte statique + chats animés).
    // Purge des morts ICI : sinon un chat fini reste dans le tableau jusqu'au prochain
    // spawn (7-15 s) et maintient un re-raster + upload texture à 60 fps pour rien.
    // Fait AVANT la passe rémanence : la texture fraîche doit être prête avant le max().
    if (this._cats.length){
      this._rasterize();
      if (this._cats.some(cat => cat.dead)) this._cats = this._cats.filter(cat => !cat.dead);
    } else {
      // curseur du prompt : dessiné selon l'horloge dans _rasterize -> sans re-raster
      // périodique il reste FIGÉ. 2 re-rasters/s suffisent (vs 60 pendant les chats).
      const blink = Math.floor(nowT / 530) % 2;
      if (blink !== this._blink){ this._blink = blink; this._rasterize(); }
    }

    // ── passe rémanence phosphore (ping-pong FBO) : accum = max(frais, accum × decay) ──
    let screenTex = this._tex;
    if (this._fx.persist > 0.001 && this._acc){
      const dt = Math.min((nowT - (this._lastT || nowT)) / 1000, 0.1);
      const decay = Math.pow(0.72 + 0.23 * this._fx.persist, dt * 60);  // calibré 60 fps, corrigé du dt réel
      const cur = this._pp ^ 1;
      gl.useProgram(this._pprog);
      gl.uniform1f(this._pu.decay, decay);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[cur]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this._acc[this._pp]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this._tex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(this._prog);
      this._pp = cur;
      screenTex = this._acc[cur];
    }
    this._lastT = nowT;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, screenTex);

    gl.uniform1f(u.time, t);
    gl.uniform2f(u.res, this._W, this._H);
    gl.uniform1f(u.curve, this._fx.curve);
    gl.uniform1f(u.aberr, this._fx.aberr * this._dpr);
    gl.uniform1f(u.scan, this._fx.scan);
    gl.uniform1f(u.bloom, this._fx.bloom);
    gl.uniform1f(u.flick, this._critical ? this._fx.flick * 3 : this._fx.flick);
    gl.uniform3f(u.tint, this._tint[0], this._tint[1], this._tint[2]);
    gl.uniform1f(u.crit, this._critical ? 1 : 0);
    gl.uniform1f(u.mask, this._fx.mask);
    // allumage : part au 1er raster (contenu prêt) ; clampé à 4 s (le shader sature avant)
    gl.uniform1f(u.boot, this._fx.boot ? Math.min((nowT - (this._bootT0 ?? nowT)) / 1000, 4) : 4);
    // burst glitch : décroît linéairement en 380 ms depuis le dernier déclencheur
    const gAge = this._glitchT0 ? nowT - this._glitchT0 : 1e9;
    gl.uniform1f(u.glitch, Math.max(0, 1 - gAge / 380) * this._fx.glitch * (this._critical ? 1.4 : 1));

    // ── liaison morte : rafale périodique amortie ──
    // Une déchirure permanente devient un fond sonore qu'on ne voit plus ; c'est le
    // RYTHME (calme → décrochage → calme) qui se lit comme « mauvaise réception ».
    const off = this._s?.offline ? 1 : 0;
    let burst = 0;
    if (off){
      const per = Math.max(0.5, this._fx.oPeriod);
      const ph  = (t % per) / per;                 // 0..1 dans le cycle
      // décroissance exponentielle sur ~12 % du cycle : pic net, retour au calme
      burst = Math.exp(-ph * 8.0) * this._fx.oBurst;
    }
    gl.uniform1f(u.off,    off);
    gl.uniform1f(u.oWarp,  this._fx.oWarp);
    gl.uniform1f(u.oNoise, this._fx.oNoise);
    gl.uniform1f(u.oBurst, burst);
    gl.uniform1f(u.oSplit, this._fx.oSplit * this._dpr);   // en pixels écran → suit le DPR
    gl.uniform1f(u.oDim,   off ? this._fx.oDim : 1.0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this._glRaf = requestAnimationFrame(() => this._loopGl());
  }

  /* ── met à jour data : recalcul, hit layer, re-rasterise le texte ── */
  _update(){
    if (!this._gl) return;
    const s = this._sys();
    const al = this._alertLevel(s);
    const key = JSON.stringify(s) + al.lvl;
    if (key === this._renderKey && this._rasterized) { this._syncPwr(s, al); return; }
    this._renderKey = key;
    const wasCrit = this._critical;
    this._critical = al.lvl === 'crit';
    if (this._critical && !wasCrit) this._glitchT0 = performance.now();   // burst à l'entrée en crit
    this._s = s; this._al = al;
    this._syncPwr(s, al);
    this._buildLines();      // prépare la liste de lignes + zones cliquables
    this._fitHeight();       // cale la hauteur du tube sur le contenu (applique height sur .screen)
    // resynchronise le canvas à la nouvelle taille AVANT de rasteriser (sinon texture tronquée).
    // _resizeGl re-mesure + rasterise si la taille a changé ; sinon on rasterise nous-mêmes
    // (cas édition : couleurs changées sans changement de taille).
    const before = this._W;
    this._resizeGl();
    if (this._W === before) this._rasterize();
    this._layoutHit();
  }

  _syncPwr(s, al){
    const pwr = this.shadowRoot.getElementById('pwr');
    if (pwr) pwr.className = 'hdr-pill ' + (s.offline ? 'off' : al.lvl === 'crit' ? 'crit' : 'on');
  }

  /* ── construit la liste ordonnée des lignes (texte + barres) et leurs entités ── */
  _buildLines(){
    const c = this._config, s = this._s, al = this._al;
    const host = c.host || 'chris@latitude';
    const tW = c.temp_warn ?? 65, tC = c.temp_crit ?? 85;
    const bW = c.batt_warn ?? 25, bC = c.batt_crit ?? 10;
    const fmtRate = v => v == null ? '—' : (v < 0.01 ? '<0.01' : v.toFixed(2));

    const L = [];   // { type, ... , ent }

    // ── Machine injoignable : écran diégétique, le tube reste allumé mais la liaison est morte.
    // Surtout PAS de barres : une colonne de « — » se lit comme une card cassée, pas comme un PC éteint.
    if (s.offline){
      L.push({ type:'text', segs:[{ t:'OS', c:'k' }, { t:' ─────', c:'dim' }] });
      L.push({ type:'text', segs:[{ t:'up', c:'k' }, { t:' offline', c:'dim' }] });
      L.push({ type:'text', segs:[{ t:'SIGNAL LOST', c:'amb' }], bold:true });
      const seen = _stamp(s.lastSeen);
      if (seen) L.push({ type:'text', segs:[{ t:'last contact', c:'k' }, { t:' ' + seen, c:'dim' }] });
      const ago = _since(s.lastSeen);
      if (ago) L.push({ type:'text', segs:[{ t:'elapsed', c:'k' }, { t:' ' + ago, c:'dim' }] });
      L.push({ type:'prompt', host, tail:'NO CARRIER' });
      this._lines = L;
      return;
    }

    // OS line
    L.push({ type:'text', segs:[
      { t:'OS', c:'k' }, { t:' ' + (s.os || 'Linux') + (s.kshort ? ' · ' + s.kshort : ''), c:'dim' }
    ]});
    // up line (proc_label détournable : ex "vitesse fans" branché sur un capteur rpm au lieu du nb de process)
    let upTxt = ' ' + (s.up || '—') + (s.proc ? ' · ' + s.proc + ' ' + (c.proc_label || 'proc') : '');
    const segsUp = [ { t:'up', c:'k' }, { t:upTxt, c:'dim' } ];
    if (s.updates != null){
      segsUp.push({ t:' · ', c:'dim' });
      segsUp.push(s.updates > 0 ? { t:s.updates + ' MAJ', c:'amb' } : { t:'à jour', c:'grn' });
    }
    if (s.reboot) segsUp.push({ t:' · reboot *', c:'amb' });
    L.push({ type:'text', segs:segsUp });

    if (s.release) L.push({ type:'text', segs:[{ t:'⬆ Ubuntu ' + s.release + ' disponible', c:'amb' }] });

    if (al.lvl === 'crit'){
      const parts = [];
      if (al.critTemp) parts.push(`temp ${Math.round(s.temp)}°`);
      if (al.critBatt) parts.push(`batterie ${Math.round(s.batt)}%`);
      L.push({ type:'text', segs:[{ t:'🔴 CRITIQUE: ' + parts.join(' · '), c:'red' }], bold:true });
    } else if (al.lvl === 'warn'){
      const parts = [];
      if (al.warnTemp) parts.push(`température ${Math.round(s.temp)}°`);
      if (al.warnBatt) parts.push(`batterie ${Math.round(s.batt)}%`);
      L.push({ type:'text', segs:[{ t:'⚠ WARN: ' + parts.join(' · '), c:'amb' }], bold:true });
    }

    // lbl/warn/hot détournables par slot (ex: label GPU repurposé + seuils propres, pour
    // pouvoir y brancher n'importe quoi — batterie comprise — sans fausse alerte à 85%).
    const bar = (lbl, pct, warn, hot, ent, unit) => {
      const lv = _lvl(pct, warn, hot);
      L.push({ type:'bar', lbl, pct, lv, ent, unit: unit || '%' });
    };
    bar(c.cpu_label || 'CPU', s.cpu, _num(c.cpu_warn) ?? 70, _num(c.cpu_hot) ?? 90, c.cpu_entity);
    if (s.gpu != null) bar(c.gpu_label || 'GPU', s.gpu, _num(c.gpu_warn) ?? 70, _num(c.gpu_hot) ?? 90, c.gpu_entity);
    if (s.load != null) bar(c.load_label || 'LOAD', s.load, _num(c.load_warn) ?? 80, _num(c.load_hot) ?? 100, c.load_entity);
    bar(c.ram_label || 'RAM', s.ram, _num(c.ram_warn) ?? 75, _num(c.ram_hot) ?? 92, c.ram_entity);
    bar(c.disk_label || 'DSK', s.disk, _num(c.disk_warn) ?? 80, _num(c.disk_hot) ?? 93, c.disk_entity);
    bar(c.temp_label || 'TEMP', s.temp != null ? Math.min(100, s.temp) : null, tW, tC, c.temp_entity, '°');
    if (s.batt != null){
      const lv = _battLvl(s.batt, bW, bC, s.charging);
      L.push({ type:'bar', lbl:c.batt_label || 'BATT', pct:s.batt, lv, ent:c.battery_entity, unit:'%',
        suffix: s.charging ? '⚡' : '' });
    }
    if (s.batt2 != null){
      const b2W = _num(c.batt2_warn) ?? 25, b2C = _num(c.batt2_crit) ?? 10;
      const lv2 = _battLvl(s.batt2, b2W, b2C, s.charging2);
      L.push({ type:'bar', lbl:c.batt2_label || 'BATT2', pct:s.batt2, lv:lv2, ent:c.battery_entity_2, unit:'%',
        suffix: s.charging2 ? '⚡' : '' });
    }
    L.push({ type:'net', rx:fmtRate(s.rx), tx:fmtRate(s.tx) });
    L.push({ type:'prompt', host });
    this._lines = L;
  }

  /* ── dessine tout le terminal sur le canvas 2D offscreen (à DPR) ── */
  _rasterize(){
    if (!this._tctx || !this._lines || !this._gl) return false;
    const W = this._W, H = this._H, dpr = this._dpr;
    // pas encore dimensionné (écran taille 0 au 1er montage / dans l'éditeur) : on attend le ResizeObserver
    if (!Number.isFinite(W) || !Number.isFinite(H) || W < 2 || H < 2) return false;
    const ctx = this._tctx;
    const PAL = this._pal();
    ctx.clearRect(0, 0, W, H);
    // fond de la dalle : neutre sombre par défaut (va avec tous les thèmes),
    // teintable via l'éditeur (screen_bg). Léger dégradé radial (centre un peu plus clair).
    const bg = this._bgStops();
    const grad = ctx.createRadialGradient(W*0.5, H*0.36, 0, W*0.5, H*0.36, W*0.72);
    grad.addColorStop(0, bg.inner); grad.addColorStop(1, bg.outer);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    const padX = 22 * dpr;
    const fs = 13.5 * dpr, lh = fs * 1.5;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    // couleurs dérivées de la couleur principale (suivent la config)
    const primHex = this._config.col_primary || '#00e5ff';
    const glowShadow = this._rgba(primHex, 0.45);
    const prim70 = this._rgba(primHex, 0.7);     // labels, séparateur prompt
    const barBorder = this._rgba(primHex, 0.3);  // contour des barres
    ctx.shadowColor = glowShadow;

    // marge tube serrée en haut : juste assez pour que la courbure n'avale pas la 1ère ligne.
    // (la hauteur du tube est calée sur le contenu -> pas de vide en bas non plus)
    let y = LTC_TUBE_PAD * dpr;
    const setFont = (bold) => ctx.font = `${bold ? 700 : 500} ${fs}px 'JetBrains Mono', monospace`;

    for (const ln of this._lines){
      ln._y0 = y / dpr; ln._y1 = (y + lh) / dpr;    // pour le hit layer (en px CSS)
      if (ln.type === 'text'){
        setFont(ln.bold);
        let x = padX;
        for (const sg of ln.segs){
          ctx.fillStyle = PAL[sg.c] || PAL.txt;
          ctx.shadowBlur = (sg.c === 'red' || sg.c === 'amb') ? 8*dpr : 4*dpr;
          ctx.fillText(sg.t, x, y);
          x += ctx.measureText(sg.t).width;
        }
      } else if (ln.type === 'net'){
        setFont(false);
        let x = padX;
        const seg = (t, col, blur) => { ctx.fillStyle = col; ctx.shadowBlur = blur*dpr; ctx.fillText(t, x, y); x += ctx.measureText(t).width; };
        seg('net', PAL.k, 4); seg(' ↓' + ln.rx, PAL.down, 6); seg(' ↑' + ln.tx, PAL.violet, 6);
        seg(' Mbit/s', PAL.dim, 2);
      } else if (ln.type === 'prompt'){
        setFont(true);
        ctx.fillStyle = PAL.grn; ctx.shadowBlur = 6*dpr;
        ctx.fillText(ln.host, padX, y);
        const wHost = ctx.measureText(ln.host).width;
        setFont(false);
        ctx.fillStyle = prim70;
        ctx.fillText(':~$', padX + wHost, y);
        const wSep = ctx.measureText(':~$ ').width;
        if (ln.tail){
          // Liaison morte : on écrit la réponse du modem à la place du curseur.
          // Un curseur qui clignote serait un signe de vie — exactement ce qu'il ne faut pas.
          ctx.fillStyle = PAL.red; ctx.shadowBlur = 5*dpr; ctx.globalAlpha = 0.72;
          ctx.fillText(ln.tail, padX + wHost + wSep, y);
          ctx.globalAlpha = 1;
        } else if (Math.floor(performance.now()/530) % 2 === 0){
          ctx.fillStyle = PAL.grn; ctx.shadowBlur = 8*dpr;
          ctx.fillRect(padX + wHost + wSep, y + 1*dpr, fs*0.55, fs);
        }
      } else if (ln.type === 'bar'){
        // label
        setFont(false);
        ctx.fillStyle = prim70; ctx.shadowBlur = 3*dpr;
        ctx.fillText(ln.lbl, padX, y);
        // barre
        const barX = padX + 46*dpr, barW = W - barX - padX - 56*dpr, barH = 9*dpr;
        const barY = y + (lh - barH)/2 - 1*dpr;
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        this._roundRect(ctx, barX, barY, barW, barH, 2*dpr); ctx.fill();
        ctx.strokeStyle = barBorder; ctx.lineWidth = 1*dpr;
        this._roundRect(ctx, barX, barY, barW, barH, 2*dpr); ctx.stroke();
        const col = ln.lv === 'hot' ? PAL.red : ln.lv === 'warn' ? PAL.amb : PAL.cy;
        if (ln.pct != null){
          const p = Math.max(0, Math.min(100, ln.pct));
          const fw = barW * p/100;
          ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10*dpr;
          this._roundRect(ctx, barX, barY, fw, barH, 2*dpr); ctx.fill();
          ctx.shadowColor = glowShadow;
        }
        // valeur
        setFont(true);
        ctx.fillStyle = col; ctx.shadowBlur = 3*dpr;
        ctx.textAlign = 'right';
        const val = ln.pct != null ? Math.round(ln.pct) + ln.unit + (ln.suffix||'') : '—';
        ctx.fillText(val, W - padX, y);
        ctx.textAlign = 'left';
      }
      y += lh;
    }

    // ── GLITCH le chat (dans la texture -> subit le CRT) ──
    for (const cat of this._cats) this._drawCat(ctx, cat);

    // upload texture
    const gl = this._gl;
    gl.activeTexture(gl.TEXTURE0);   // la passe rémanence a pu laisser l'unité 1 active
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._tcanvas);
    // horodatage d'allumage au tout 1er contenu affichable (null = jamais posé depuis
    // le dernier _cleanup → l'anim d'allumage rejoue au remontage, PAS à chaque frappe
    // dans l'éditeur (_applyLiveConfig ne passe pas par _cleanup))
    if (this._bootT0 == null) this._bootT0 = performance.now();
    this._rasterized = true;
    return true;
  }

  _roundRect(ctx, x, y, w, h, r){
    r = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  /* ── GLITCH the cat : dessin canvas avec RGB-split (effet Silverhand) ── */
  _drawCat(ctx, cat){
    const t = (performance.now() - cat.born) / cat.dur;
    if (t >= 1){ cat.dead = true; return; }
    const dpr = this._dpr;
    const flick = [0,.9,.1,.85,.2,.9][Math.floor(t*6)%6] ?? .8;  // vie clignotante
    const scale = cat.size * dpr / 51;                          // path viewBox width 51
    // amplitude du split (px) selon phase
    const amp = (Math.sin(t*30) * 4 + (cat.crit ? 5 : 2)) * dpr;
    const cx = cat.x * dpr, cy = cat.y * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = flick * 0.85;
    ctx.shadowBlur = 0;

    const layer = (dx, dy, color, blur) => {
      ctx.save();
      ctx.translate(cx + dx, cy + dy);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      if (blur){ ctx.shadowColor = color; ctx.shadowBlur = blur*dpr; }
      ctx.fill(_catPath2D);
      ctx.restore();
    };
    // 3 calques décalés : rouge/ambre, cyan, principal vert/rouge
    layer(-amp, amp*0.3, cat.crit ? '#ffad33' : '#ff3d50', 0);
    layer(amp, -amp*0.3, '#00e5ff', 5);
    layer(0, 0, cat.crit ? '#ff3d50' : '#4af2a1', 6);
    ctx.restore();
  }

  _spawnCatGl(opts = {}){
    const r = this.shadowRoot.getElementById('screen').getBoundingClientRect();
    if (r.width < 40) return;
    this._glitchT0 = performance.now();   // le signal "se déchire" quand GLITCH apparaît
    const scale = (opts.scale || 0.7) + Math.random() * (opts.scaleVar ?? 1.0);
    const w = 54 * scale;
    this._cats.push({
      x: 10 + Math.random() * Math.max(10, r.width - w - 20),
      y: 10 + Math.random() * Math.max(10, r.height - w - 20),
      size: w, born: performance.now(), dur: opts.dur || 2800, crit: !!opts.crit,
    });
    // purge morts
    this._cats = this._cats.filter(c => !c.dead);
  }

  _catLoopGl(){
    if (!this._gl) return;
    if (this._critical){
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++){
        const timer = setTimeout(() => {
          this._catPending.delete(timer);
          this._spawnCatGl({ crit:true, dur:900+Math.random()*500, scale:0.55, scaleVar:0.8 });
        }, i*120);
        this._catPending.add(timer);
      }
      this._catTimer = setTimeout(() => this._catLoopGl(), 1100 + Math.random()*900);
    } else {
      this._spawnCatGl({});
      this._catTimer = setTimeout(() => this._catLoopGl(), 7000 + Math.random()*8000);
    }
  }

  /* ── couche de clics transparente (plate, capte more-info par ligne) ── */
  _layoutHit(){
    const hit = this.shadowRoot.getElementById('hit');
    if (!hit || !this._lines) return;
    hit.innerHTML = '';
    for (const ln of this._lines){
      if (!ln.ent || ln._y0 == null) continue;   // _y0 posé par _rasterize (absent si raster sauté à taille 0)
      const z = document.createElement('div');
      z.className = 'hitzone';
      z.setAttribute('role', 'button');
      z.setAttribute('tabindex', '0');
      z.setAttribute('aria-label', ln.lbl || ln.ent);
      z.style.cssText = `top:${ln._y0}px;height:${(ln._y1-ln._y0)}px;`;
      z.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(ln.ent); });
      z.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault(); e.stopPropagation(); this._moreInfo(ln.ent);
      });
      hit.appendChild(z);
    }
    // clic global -> CPU
    hit.onclick = () => this._moreInfo(this._config.cpu_entity);
  }

  /* ══════════════════════════════════════════════════════════════════════
   *  CHEMIN CSS (fallback mobile — identique à la card d'origine)
   * ══════════════════════════════════════════════════════════════════════ */
  _bar(lbl, pct, warn, hot, entity, unit){
    const p = pct == null ? 0 : Math.max(0, Math.min(100, pct));
    const lv = _lvl(p, warn, hot);
    return `<div class="row" data-ent="${_esc(entity)}">
      <span class="rl">${_esc(lbl)}</span>
      <span class="bar"><span class="fill ${lv}" style="width:${p}%"></span></span>
      <span class="rv ${lv}">${pct != null ? Math.round(pct) + _esc(unit || '%') : '—'}</span>
    </div>`;
  }

  _updateDom(){
    const sr = this.shadowRoot;
    if (!sr || !this._hass) return;
    const c = this._config, s = this._sys();
    const al = this._alertLevel(s);
    const key = JSON.stringify(s) + al.lvl;
    if (key === this._renderKey) return;
    this._renderKey = key;
    this._critical = al.lvl === 'crit';

    const pwr = sr.getElementById('pwr');
    if (pwr) pwr.className = 'hdr-pill ' + (s.offline ? 'off' : al.lvl === 'crit' ? 'crit' : 'on');
    const screen = sr.getElementById('screen');
    if (screen) screen.classList.toggle('crit', al.lvl === 'crit');

    const host = c.host || 'chris@latitude';
    const prompt = `<span class="prompt">${_esc(host)}</span><span class="sep">:~$</span>`;
    const fmtRate = v => v == null ? '—' : (v < 0.01 ? '<0.01' : v.toFixed(2));
    const tW = c.temp_warn ?? 65, tC = c.temp_crit ?? 85;
    const bW = c.batt_warn ?? 25, bC = c.batt_crit ?? 10;

    let warnLines = '';
    if (al.lvl === 'crit'){
      const parts = [];
      if (al.critTemp) parts.push(`temp ${Math.round(s.temp)}°`);
      if (al.critBatt) parts.push(`batterie ${Math.round(s.batt)}%`);
      warnLines = `<div class="ln alert crit">🔴 CRITIQUE: ${parts.join(' · ')}</div>`;
    } else if (al.lvl === 'warn'){
      const parts = [];
      if (al.warnTemp) parts.push(`température ${Math.round(s.temp)}°`);
      if (al.warnBatt) parts.push(`batterie ${Math.round(s.batt)}%`);
      warnLines = `<div class="ln alert warn">⚠ WARN: ${parts.join(' · ')}</div>`;
    }
    const updTxt = s.updates == null ? '' :
      (s.updates > 0 ? `<span class="updN">${s.updates} MAJ</span>` : `<span class="upd0">à jour</span>`);
    const rebootTxt = s.reboot ? `<span class="reboot"> · reboot *</span>` : '';
    const releaseLine = s.release
      ? `<div class="ln alert warn">⬆ Ubuntu ${_esc(s.release)} disponible (do-release-upgrade)</div>` : '';

    // Miroir DOM de l'écran offline (cf _buildLines) : sans WebGL, c'est CE rendu que
    // Chris voit — il doit dire exactement la même chose, barres comprises (aucune).
    const html = s.offline ? `
      <div class="ln dim"><span class="k">OS</span> ─────</div>
      <div class="ln dim"><span class="k">up</span> offline</div>
      <div class="ln alert warn">SIGNAL LOST</div>
      ${_stamp(s.lastSeen) ? `<div class="ln dim"><span class="k">last contact</span> ${_stamp(s.lastSeen)}</div>` : ''}
      ${_since(s.lastSeen) ? `<div class="ln dim"><span class="k">elapsed</span> ${_since(s.lastSeen)}</div>` : ''}
      <div class="ln">${prompt} <span class="nocarrier">NO CARRIER</span></div>` : `
      <div class="ln dim"><span class="k">OS</span> ${_esc(s.os || 'Linux')}${s.kshort ? ' · ' + _esc(s.kshort) : ''}</div>
      <div class="ln dim"><span class="k">up</span> ${_esc(s.up || '—')}${s.proc ? ' · ' + _esc(s.proc) + ' ' + _esc(c.proc_label || 'proc') : ''}${updTxt ? ' · ' + updTxt : ''}${rebootTxt}</div>
      ${releaseLine}
      ${warnLines}
      ${this._bar(c.cpu_label || 'CPU', s.cpu, _num(c.cpu_warn) ?? 70, _num(c.cpu_hot) ?? 90, c.cpu_entity)}
      ${s.gpu != null ? this._bar(c.gpu_label || 'GPU', s.gpu, _num(c.gpu_warn) ?? 70, _num(c.gpu_hot) ?? 90, c.gpu_entity) : ''}
      ${s.load != null ? this._bar(c.load_label || 'LOAD', s.load, _num(c.load_warn) ?? 80, _num(c.load_hot) ?? 100, c.load_entity) : ''}
      ${this._bar(c.ram_label || 'RAM', s.ram, _num(c.ram_warn) ?? 75, _num(c.ram_hot) ?? 92, c.ram_entity)}
      ${this._bar(c.disk_label || 'DSK', s.disk, _num(c.disk_warn) ?? 80, _num(c.disk_hot) ?? 93, c.disk_entity)}
      ${this._bar(c.temp_label || 'TEMP', s.temp != null ? Math.min(100, s.temp) : null, tW, tC, c.temp_entity, '°')}
      ${this._battRow(s.batt, s.charging, bW, bC, c.battery_entity, c.batt_label || 'BATT')}
      ${this._battRow(s.batt2, s.charging2, _num(c.batt2_warn) ?? 25, _num(c.batt2_crit) ?? 10, c.battery_entity_2, c.batt2_label || 'BATT2')}
      <div class="ln net"><span class="k">net</span> <span class="dn">↓${fmtRate(s.rx)}</span> <span class="up">↑${fmtRate(s.tx)}</span> <span class="dim">Mbit/s</span></div>
      <div class="ln">${prompt} <span class="cur">█</span></div>`;

    const term = sr.getElementById('term');
    if (term){
      term.innerHTML = html;
      term.querySelectorAll('.row[data-ent]').forEach(el => {
        const id = el.dataset.ent;
        if (id) el.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(id); });
      });
    }
  }

  // Générique BATT/BATT2 (logique inversée : bas = mauvais, neutralisée pendant la charge).
  _battRow(pct, charging, warn, crit, entity, lbl){
    if (pct == null) return '';
    const lv = _battLvl(pct, warn, crit, charging);
    return `<div class="row" data-ent="${_esc(entity)}">
      <span class="rl">${_esc(lbl)}</span>
      <span class="bar"><span class="fill ${lv}" style="width:${pct}%"></span></span>
      <span class="rv ${lv}">${Math.round(pct)}%${charging ? '⚡' : ''}</span>
    </div>`;
  }

  _spawnCat(opts = {}){
    const host = this.shadowRoot.getElementById('catHost');
    const screen = this.shadowRoot.getElementById('screen');
    if (!host || !screen) return;
    const r = screen.getBoundingClientRect();
    if (r.width < 40) return;
    const scale = (opts.scale || 0.7) + Math.random() * (opts.scaleVar ?? 1.0);
    const w = 54 * scale;
    const x = 10 + Math.random() * Math.max(10, r.width - w - 20);
    const y = 10 + Math.random() * Math.max(10, r.height - w - 20);
    const el = document.createElement('div');
    el.className = 'cat-wrap run' + (opts.crit ? ' crit-cat' : '');
    el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;${opts.dur ? 'animation-duration:' + opts.dur + 'ms;' : ''}`;
    el.innerHTML = `<div class="layer l-rd">${_catSvg()}</div><div class="layer l-cy">${_catSvg()}</div><div class="layer l-main">${_catSvg()}</div><div class="holo-scan"></div>`;
    host.appendChild(el);
    setTimeout(() => el.remove(), (opts.dur || 2800) + 250);
  }

  _catLoop(){
    if (this._critical){
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++){
        const timer = setTimeout(() => {
          this._catPending.delete(timer);
          this._spawnCat({ crit: true, dur: 900 + Math.random() * 500, scale: 0.55, scaleVar: 0.8 });
        }, i * 120);
        this._catPending.add(timer);
      }
      this._catTimer = setTimeout(() => this._catLoop(), 1100 + Math.random() * 900);
    } else {
      this._spawnCat({});
      this._catTimer = setTimeout(() => this._catLoop(), 7000 + Math.random() * 8000);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  STYLES
 * ═══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  :host{ display:block; contain:layout style; }
  ha-card{
    contain:layout style paint;
    padding:10px 12px 12px;
    --ltc-uv: var(--rgb-primary-color, 124,77,255);
    --ltc-cy: var(--rgb-accent-color, 0,229,255);
    --ltc-grn: 74,242,161;
    --ltc-amb: 255,173,51;
    --ltc-red: 255,61,80;
    --ltc-txt: var(--primary-text-color, #d9ccff);
    --ltc-frame: var(--ltc-uv);   /* liseret de l'écran : suit le thème, col_frame le décorèle */
    overflow:hidden;
  }
  .hdr{ display:flex; align-items:center; gap:9px; padding-bottom:9px; margin-bottom:10px; position:relative; }
  .hdr::after{ content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(var(--ltc-uv),.55) 20%, rgba(var(--ltc-cy),.3) 50%, rgba(var(--ltc-uv),.55) 80%, transparent); }
  .hdr-icon{ --mdc-icon-size:var(--ltc-hdr-icon-size,var(--ltc-hdr-size,18px)); color:var(--ltc-hdr-icon-color,var(--ltc-hdr-color)); filter:drop-shadow(0 0 5px color-mix(in srgb, currentColor, transparent 20%)) var(--ltc-hdr-icon-glow,none); flex-shrink:0; animation:var(--ltc-hdr-flicker,none); }
  .hdr-title{ flex:1; font-family:var(--ltc-hdr-font,var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)); font-size:var(--ltc-hdr-size,18px);
    font-weight:var(--ltc-hdr-weight,600); font-style:var(--ltc-hdr-italic,normal); letter-spacing:var(--ltc-hdr-spacing,0.02em);
    text-transform:var(--ltc-hdr-upper,uppercase); color:var(--ltc-hdr-color); text-shadow:var(--ltc-hdr-shadow,0 0 8px color-mix(in srgb, var(--ltc-hdr-color), transparent 30%));
    animation:var(--ltc-hdr-flicker,none); }
  .hdr-title.grad{ background:var(--ltc-hdr-grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  @keyframes ltc-hdr-flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1;} 20%,24%,55%{opacity:.6;} }
  .hdr-pill{ font-size:11px; line-height:1; }
  .hdr-pill.on{ color:rgb(var(--ltc-grn)); filter:drop-shadow(0 0 5px rgb(var(--ltc-grn))); animation:ltc-blink 2.4s infinite; }
  .hdr-pill.crit{ color:rgb(var(--ltc-red)); filter:drop-shadow(0 0 6px rgb(var(--ltc-red))); animation:ltc-blink .6s infinite; }
  .hdr-pill.off{ color:rgba(255,255,255,.3); }

  /* ── écran ── */
  .screen{ position:relative; border-radius:20px/26px; overflow:hidden;
    border:1px solid rgba(var(--ltc-frame),.55);
    box-shadow:0 0 0 3px rgba(var(--ltc-frame),.12), inset 0 0 40px rgba(var(--ltc-frame),.14);
    background:#08050f; transition:box-shadow .3s, border-color .3s; }

  /* ── Coque plastique de la télé (recette heat-monitor : plastique sombre bleuté + vis) ── */
  .tv-shell{ position:relative; padding:26px 22px 22px; border-radius:16px;
    /* plastique NEUTRE (gris anthracite, indépendant du thème) : reflet en haut, ombré en bas */
    background:
      linear-gradient(180deg, #24242a 0%, #17171b 12%, #0d0d10 88%, #060608 100%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.06),          /* arête supérieure éclairée */
      inset 0 0 0 1px rgba(52,52,58,.7),            /* liseré chassis */
      inset 0 -14px 24px rgba(0,0,0,.5),            /* fond qui plonge dans l'ombre */
      0 6px 18px rgba(0,0,0,.45);                   /* ombre portée sous la télé */
  }
  /* vis cruciformes dans les 4 coins */
  .tv-screw{ position:absolute; width:9px; height:9px; border-radius:50%;
    background:radial-gradient(circle at 40% 35%, #14141c, #0a0a0f 70%);
    box-shadow:inset 0 0 0 .5px #3c3c52, 0 1px 1px rgba(0,0,0,.6); }
  .tv-screw::before, .tv-screw::after{ content:''; position:absolute; inset:0; margin:auto;
    background:#1e1e2a; }
  .tv-screw::before{ width:5px; height:.8px; top:50%; transform:translateY(-50%); }
  .tv-screw::after{ width:.8px; height:5px; left:50%; transform:translateX(-50%); }
  .tv-screw.tl{ top:6px; left:7px; } .tv-screw.tr{ top:6px; right:7px; }
  .tv-screw.bl{ bottom:6px; left:7px; } .tv-screw.br{ bottom:6px; right:7px; }
  /* sérigraphie discrète en haut de coque */
  .tv-brand{ position:absolute; top:6px; left:20px; font-family:'JetBrains Mono',monospace;
    font-size:7px; letter-spacing:.5px; color:#38384e; text-transform:none; user-select:none; }
  /* écran WebGL : hauteur pilotée par JS (_fitHeight, calée sur le nombre de lignes) */
  .screen.gl{ min-height:120px; border-radius:14px/18px;
    /* l'écran est ENCASTRÉ : liseré et halo NEUTRES (indépendants du thème) */
    box-shadow:0 0 0 2px #05050a, inset 0 0 0 1px rgba(70,70,80,.5),
      inset 0 3px 10px rgba(0,0,0,.7), 0 0 18px rgba(0,0,0,.35); }
  .glcanvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }
  .hit{ position:absolute; inset:0; z-index:3; cursor:pointer; }
  .hit .hitzone{ position:absolute; left:0; right:0; }

  /* ── écran CSS (fallback) ── */
  .glow{ position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse at 50% 36%, rgba(var(--ltc-uv),.22), transparent 70%); }
  .term{ position:relative; z-index:2; padding:15px 20px; cursor:pointer;
    transform:perspective(640px) rotateX(1.3deg);
    font-family:'JetBrains Mono',monospace; font-size:13.5px; line-height:1.5; color:var(--ltc-txt);
    text-shadow:0 0 4px rgba(var(--ltc-cy),.45), 0 0 8px rgba(var(--ltc-uv),.35); }
  .term .ln{ white-space:nowrap; }
  .term .dim{ color:rgba(var(--ltc-cy),.55); }
  .term .k{ color:rgba(var(--ltc-cy),.55); display:inline-block; min-width:30px; }
  .term .prompt{ color:rgb(var(--ltc-grn)); font-weight:700; text-shadow:0 0 6px rgba(var(--ltc-grn),.6); }
  .term .sep{ color:rgba(var(--ltc-cy),.7); }
  .term .dn{ color:rgb(var(--ltc-cy)); } .term .up{ color:#c08cff; }
  .term .upd0{ color:rgba(var(--ltc-grn),.85); } .term .updN{ color:rgb(var(--ltc-amb)); font-weight:700; }
  .term .reboot{ color:rgb(var(--ltc-amb)); font-weight:700; }
  .term .cur{ animation:ltc-cursor 1.05s step-end infinite; color:rgb(var(--ltc-grn)); }
  /* liaison morte : pas de clignotement — un curseur qui bat serait un signe de vie */
  .term .nocarrier{ color:rgba(var(--ltc-red),.72); }
  .term .alert{ font-weight:700; margin:1px 0; }
  .term .alert.warn{ color:rgb(var(--ltc-amb)); text-shadow:0 0 8px rgba(var(--ltc-amb),.6); }
  .term .alert.crit{ color:rgb(var(--ltc-red)); text-shadow:0 0 8px rgba(var(--ltc-red),.7); animation:ltc-blink .8s infinite; }

  .row{ display:grid; grid-template-columns:42px 1fr 50px; gap:9px; align-items:center; cursor:pointer; }
  .row .rl{ color:rgba(var(--ltc-cy),.7); }
  .row .bar{ position:relative; height:9px; border-radius:2px; background:rgba(255,255,255,.05);
    box-shadow:inset 0 0 0 1px rgba(var(--ltc-uv),.3); overflow:hidden; }
  .row .fill{ position:absolute; inset:0 auto 0 0; border-radius:2px; transition:width .5s ease, background .4s ease; }
  .row .fill.ok  { background:linear-gradient(90deg, rgba(var(--ltc-cy),.5), rgb(var(--ltc-cy))); box-shadow:0 0 9px rgba(var(--ltc-cy),.6); }
  .row .fill.warn{ background:linear-gradient(90deg, rgba(var(--ltc-amb),.5), rgb(var(--ltc-amb))); box-shadow:0 0 9px rgb(var(--ltc-amb)); }
  .row .fill.hot { background:linear-gradient(90deg, rgba(var(--ltc-red),.5), rgb(var(--ltc-red))); box-shadow:0 0 11px rgb(var(--ltc-red)); }
  .row .rv{ text-align:right; font-weight:700; color:rgb(var(--ltc-cy)); }
  .row .rv.warn{ color:rgb(var(--ltc-amb)); } .row .rv.hot{ color:rgb(var(--ltc-red)); }

  .scan{ position:absolute; inset:0; z-index:6; pointer-events:none;
    background:repeating-linear-gradient(0deg, rgba(0,0,0,.26), rgba(0,0,0,.26) 1px, transparent 1px, transparent 3px); }
  .vignette{ position:absolute; inset:0; z-index:6; pointer-events:none; border-radius:inherit;
    box-shadow:inset 0 0 70px 14px rgba(0,0,0,.7); }
  .flicker{ position:absolute; inset:0; z-index:7; pointer-events:none; background:rgba(var(--ltc-uv),.03); animation:ltc-fl 8s infinite steps(1); }

  /* GLITCH (fallback CSS) */
  .cat-host{ position:absolute; inset:0; z-index:5; pointer-events:none; }
  .cat-wrap{ position:absolute; width:54px; opacity:0; mix-blend-mode:screen; }
  .cat-wrap .layer{ position:absolute; inset:0; }
  .cat-wrap svg{ width:100%; height:auto; display:block; }
  .cat-wrap .l-cy{ color:rgb(var(--ltc-cy)); filter:drop-shadow(0 0 5px rgba(var(--ltc-cy),.8)); }
  .cat-wrap .l-rd{ color:rgb(var(--ltc-red)); }
  .cat-wrap .l-main{ color:rgb(var(--ltc-grn)); filter:drop-shadow(0 0 6px rgba(var(--ltc-grn),.8)); }
  .cat-wrap .holo-scan{ position:absolute; inset:0; mix-blend-mode:overlay;
    background:repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0, rgba(0,0,0,.5) 1px, transparent 1px, transparent 3px); }
  .cat-wrap.run{ animation:sh-life 2.8s steps(60) forwards; }
  .cat-wrap.run .l-rd{ animation:sh-rd 2.8s steps(30) forwards; }
  .cat-wrap.run .l-cy{ animation:sh-cy 2.8s steps(30) forwards; }
  .cat-wrap.run .l-main{ animation:sh-main 2.8s steps(40) forwards; }
  .cat-wrap.run .holo-scan{ animation:sh-scan 2.8s linear; }
  .cat-wrap.crit-cat .l-main{ color:rgb(var(--ltc-red)); filter:drop-shadow(0 0 7px rgba(var(--ltc-red),.9)); }
  .cat-wrap.crit-cat .l-rd{ color:rgb(var(--ltc-amb)); }
  .cat-wrap.crit-cat.run .l-rd{ animation:sh-rd-hard 1s steps(20) forwards; }
  .cat-wrap.crit-cat.run .l-cy{ animation:sh-cy-hard 1s steps(20) forwards; }

  @keyframes sh-life{ 0%{opacity:0} 4%{opacity:.9} 6%{opacity:.1} 8%{opacity:.85} 12%{opacity:.2} 14%{opacity:.9}
    20%,72%{opacity:.82} 74%{opacity:.3} 76%{opacity:.8} 80%{opacity:.15} 88%{opacity:.5} 92%{opacity:.05} 96%{opacity:.3} 100%{opacity:0} }
  @keyframes sh-rd{ 0%,100%{transform:translate(0,0)} 5%{transform:translate(-4px,1px)} 22%{transform:translate(2px,-1px)}
    48%{transform:translate(-3px,0)} 60%{transform:translate(3px,1px)} 78%{transform:translate(-5px,-2px)} 90%{transform:translate(4px,0)} }
  @keyframes sh-cy{ 0%,100%{transform:translate(0,0)} 5%{transform:translate(4px,-1px)} 22%{transform:translate(-2px,1px)}
    48%{transform:translate(3px,0)} 60%{transform:translate(-3px,-1px)} 78%{transform:translate(5px,2px)} 90%{transform:translate(-4px,0)} }
  @keyframes sh-main{ 0%,100%{transform:translate(0,0); clip-path:inset(0 0 0 0)}
    10%{clip-path:inset(20% 0 60% 0); transform:translate(2px,0)} 14%{clip-path:inset(0 0 0 0); transform:translate(-2px,0)}
    30%{clip-path:inset(70% 0 10% 0); transform:translate(1px,0)} 33%{clip-path:inset(0 0 0 0)}
    55%{clip-path:inset(40% 0 40% 0); transform:translate(-2px,0)} 58%{clip-path:inset(0 0 0 0)}
    82%{clip-path:inset(10% 0 75% 0); transform:translate(3px,0)} 85%{clip-path:inset(0 0 0 0)} }
  @keyframes sh-scan{ 0%{background-position:0 -60px; opacity:.7} 100%{background-position:0 60px; opacity:.7} }
  @keyframes sh-rd-hard{ 0%,100%{transform:translate(0,0)} 8%{transform:translate(-8px,2px)} 25%{transform:translate(6px,-2px)}
    50%{transform:translate(-7px,1px)} 70%{transform:translate(8px,2px)} 88%{transform:translate(-9px,-3px)} }
  @keyframes sh-cy-hard{ 0%,100%{transform:translate(0,0)} 8%{transform:translate(8px,-2px)} 25%{transform:translate(-6px,2px)}
    50%{transform:translate(7px,-1px)} 70%{transform:translate(-8px,-2px)} 88%{transform:translate(9px,3px)} }

  .screen.crit{ border-color:rgb(var(--ltc-red));
    box-shadow:0 0 0 3px rgba(var(--ltc-red),.4), inset 0 0 50px rgba(var(--ltc-red),.25);
    animation:ltc-critpulse 1s ease-in-out infinite; }

  @keyframes ltc-cursor{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes ltc-blink{ 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes ltc-fl{ 0%,95%,100%{opacity:0} 96%{opacity:.5} 97%{opacity:.1} 98%{opacity:.4} }
  @keyframes ltc-critpulse{ 0%,100%{box-shadow:0 0 0 3px rgba(var(--ltc-red),.3), inset 0 0 40px rgba(var(--ltc-red),.2)}
    50%{box-shadow:0 0 14px 4px rgba(var(--ltc-red),.6), inset 0 0 60px rgba(var(--ltc-red),.35)} }

  ${LTC_IS_LOW_POWER ? `.term{transform:none;} .term .cur,.flicker,.hdr-pill.on{animation:none;} .screen.crit{animation:none;}` : ''}
`;

/* ═══════════════════════════════════════════════════════════════════════════
 *  EDITOR (repris de la card d'origine + réglages CRT)
 * ═══════════════════════════════════════════════════════════════════════════ */
class LinuxTerminalCardWebglEditor extends HTMLElement {
  setConfig(c){ this._config = { ...c }; if (!this._rendered){ this._rendered = true; this._render(); } else this._syncValues(); }
  set hass(h){ this._hass = h; this._refreshLists(); }

  _fire(){ this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true })); }
  _set(key, val){
    const parts = key.split('.');
    if (parts.length === 2){
      const [o, k] = parts;
      if (typeof this._config[o] !== 'object' || !this._config[o]) this._config[o] = {};
      if (val === '' || val == null) delete this._config[o][k]; else this._config[o][k] = val;
    } else {
      if (val === '' || val == null) delete this._config[key]; else this._config[key] = val;
    }
    this._fire();
  }
  _ents(){ return this._hass ? Object.keys(this._hass.states).filter(e => /^(sensor|binary_sensor|button)\./.test(e)).sort() : []; }
  _refreshLists(){
    this.querySelectorAll('datalist').forEach(dl => {
      if (dl.childElementCount) return;
      const frag = document.createDocumentFragment();
      for (const e of this._ents()){ const o = document.createElement('option'); o.value = e; frag.appendChild(o); }
      dl.appendChild(frag);
    });
  }
  _syncValues(){
    const c = this._config || {};
    this.querySelectorAll('input[data-key], select[data-key]').forEach(inp => {
      if (document.activeElement === inp) return;
      const parts = inp.dataset.key.split('.');
      const v = parts.length === 2 ? (c[parts[0]] || {})[parts[1]] : c[inp.dataset.key];
      if (inp.type === 'checkbox'){ inp.checked = (v === true || v === 'true'); return; }
      if (inp.type === 'color'){ const hx = this._hexColor(v) || (inp.dataset.ph ? this._resolveColor(inp.dataset.ph) : null); if (hx) inp.value = hx; return; }
      inp.value = (v != null) ? v : '';
    });
  }
  _val(key){
    const parts = key.split('.'), c = this._config || {};
    return parts.length === 2 ? ((c[parts[0]] || {})[parts[1]] ?? '') : (c[key] ?? '');
  }
  _text(label, key, ph){
    return `<div class="field"><label>${_esc(label)}</label>
      <input data-key="${_esc(key)}" value="${_esc(this._val(key))}" placeholder="${_esc(ph || '')}" autocomplete="off"/></div>`;
  }
  _entity(label, key, ph){
    const lid = 'dl_' + key.replace(/\W/g, '');
    return `<div class="field"><label>${_esc(label)}</label>
      <input data-key="${_esc(key)}" value="${_esc(this._val(key))}" list="${_esc(lid)}" placeholder="${_esc(ph || 'sensor.…')}" autocomplete="off"/>
      <datalist id="${lid}"></datalist></div>`;
  }
  _hexColor(v){
    if (!v) return '';
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    const m = String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return '';
    return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
  }
  // Résout n'importe quelle valeur CSS couleur (var(--xxx), rgb(), nom CSS…) en hex réel via un
  // sonde DOM + getComputedStyle — nécessaire pour que le picker natif <input type=color> (qui
  // n'accepte QUE du #rrggbb) affiche une couleur cohérente au lieu de tomber sur noir quand la
  // valeur/placeholder est une var CSS (ex: 'var(--primary-color)'). Pattern copié à l'identique
  // de neon-climate-card-webgl.js.
  _resolveColor(css){
    try {
      const probe = document.createElement('span');
      probe.style.cssText = `color:${css};position:absolute;left:-9999px;top:-9999px`;
      this.appendChild(probe);
      const rgb = getComputedStyle(probe).color; probe.remove();
      const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
      return m ? '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') : null;
    } catch { return null; }
  }
  _color(label, key, ph){
    const v = this._val(key);
    const swatchHex = this._hexColor(v) || (ph ? this._resolveColor(ph) : null) || '#b482ff';
    return `<div class="field"><label>${_esc(label)}</label>
      <div class="color-row">
        <input type="color" data-key="${_esc(key)}" value="${_esc(swatchHex)}" data-ph="${_esc(ph || '')}" class="color-swatch"/>
        <input type="text" data-key="${_esc(key)}" value="${_esc(v)}" placeholder="${_esc(ph || '#b482ff')}" autocomplete="off" class="color-text"/>
      </div></div>`;
  }
  _icon(label, key, ph){
    return `<div class="field">
      <label>${_esc(label)} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:10px">parcourir MDI ↗</a></label>
      <div class="icon-row">
        <input data-key="${_esc(key)}" value="${_esc(this._val(key))}" placeholder="${_esc(ph || 'mdi:laptop')}" autocomplete="off" class="icon-input"/>
        <div class="icon-preview" data-preview="${_esc(key)}"></div>
      </div></div>`;
  }
  _toggle(label, key, def){
    const v = this._val(key);
    const checked = v === '' ? !!def : (v === true || v === 'true');
    return `<div class="field toggle-field"><label class="toggle-row">
      <input type="checkbox" data-key="${_esc(key)}" data-bool="1" ${checked ? 'checked' : ''}/>
      <span>${_esc(label)}</span></label></div>`;
  }
  _select(label, key, options, ph){
    const v = this._val(key);
    const opts = (options || []).map(opt => {
      // accepte une string nue (ex: NEON_FONTS) ou un tuple [valeur, libellé]
      const [ov, olbl] = Array.isArray(opt) ? opt : [opt, opt];
      return `<option value="${_esc(ov)}" ${v === ov ? 'selected' : ''}>${_esc(olbl)}</option>`;
    }).join('');
    return `<div class="field"><label>${_esc(label)}</label>
      <select data-key="${_esc(key)}"><option value="">${_esc(ph || '—')}</option>${opts}</select></div>`;
  }
  _render(){
    this.innerHTML = `
      <style>
        *{box-sizing:border-box;font-family:-apple-system,sans-serif}
        .grid{display:flex;flex-direction:column;gap:10px;padding:12px 0}
        .group{border:1px solid var(--divider-color,#333);border-radius:10px;padding:12px}
        .group-title{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:10px}
        ha-expansion-panel{display:block;--expansion-panel-content-padding:8px 12px 12px}
        .field{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
        label{font-size:12px;color:var(--secondary-text-color)}
        input,select{padding:8px 10px;border:1px solid var(--primary-color,#777);border-radius:7px;background:var(--card-background-color);color:var(--primary-text-color);font-size:13px;width:100%}
        input:focus,select:focus{outline:none;box-shadow:0 0 0 1px var(--primary-color)}
        .toggle-row{display:flex;align-items:center;gap:8px;cursor:pointer}
        .toggle-row input[type=checkbox]{width:auto;padding:0;accent-color:var(--primary-color)}
        .toggle-row span{font-size:12px;color:var(--secondary-text-color)}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .icon-row{display:flex;gap:8px;align-items:center}
        .icon-row .icon-input{flex:1}
        .color-row{display:flex;gap:8px;align-items:center}
        .color-row .color-swatch{width:42px;height:34px;flex-shrink:0;padding:2px;cursor:pointer}
        .color-row .color-text{flex:1}
        .icon-preview{width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
          border:1px solid var(--divider-color,#333);border-radius:7px;color:var(--primary-text-color)}
        .hint{font-size:10px;color:var(--secondary-text-color);margin-top:-2px;margin-bottom:8px}
      </style>
      <div class="grid">
        <div class="group"><div class="group-title">Général</div>
          ${this._text('Hôte (prompt)', 'host', 'chris@latitude')}
        </div>
        <ha-expansion-panel outlined header="Effet CRT (WebGL — desktop)">
          <div class="hint">Vitre CRT rendue par shader. Sur iPad/mobile : repli CSS automatique.</div>
          <div class="row2">${this._text('Courbure (0–0.35)', 'crt_curve', '0')}${this._text('Aberration px', 'crt_aberration', '1.8')}</div>
          <div class="row2">${this._text('Scanlines (0–1)', 'crt_scanlines', '0.45')}${this._text('Bloom (0–1)', 'crt_bloom', '0.5')}</div>
          <div class="row2">${this._text('Flicker (0–0.2)', 'crt_flicker', '0.04')}${this._text('Grille RGB (0–1)', 'crt_mask', '0.35')}</div>
          <div class="row2">${this._text('Glitch burst (0–1)', 'crt_glitch', '0.7')}${this._text('Allumage CRT (1/0)', 'crt_boot', '1')}</div>
          <div class="row2">${this._text('Rémanence phosphore (0–1)', 'crt_persist', '0.6')}</div>
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Écran « machine injoignable »">
          <div class="hint">Quand CPU et RAM sont tous les deux indisponibles : SIGNAL LOST / NO CARRIER, mauvaise réception. Défauts réglés à l'œil au banc d'essai.</div>
          <div class="row2">${this._text('Ondulation (0–5)', 'offline_warp', '1.0')}${this._text('Grain (0–20)', 'offline_noise', '6.0')}</div>
          <div class="row2">${this._text('Rafale (0–3)', 'offline_burst', '1.5')}${this._text('Période rafale (s)', 'offline_period', '8')}</div>
          <div class="row2">${this._text('RGB split (px)', 'offline_split', '8.5')}${this._text('Luminosité (0–1)', 'offline_dim', '0.46')}</div>
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Couleurs écran">
          <div class="hint">Fond vide = dalle neutre sombre (va avec tous les thèmes). Couleurs vides = défauts cyan/vert Neo Tokyo.</div>
          ${this._color('Fond de dalle', 'screen_bg', '#0e0e13')}
          <div class="hint" style="margin-top:2px">Ex fond : #001208 vert phosphore · #120a00 ambre · #001018 cyan sombre</div>
          <div class="row2">${this._color('Principal (labels/barres)', 'col_primary', '#00e5ff')}${this._color('Prompt', 'col_prompt', '#4af2a1')}</div>
          <div class="row2">${this._color('Texte secondaire (dim)', 'col_dim', '#00e5ff')}${this._color('Texte défaut', 'col_txt', '#d9ccff')}</div>
          <div class="row2">${this._color('Alerte WARN', 'col_warn', '#ffad33')}${this._color('Alerte CRIT', 'col_crit', '#ff3d50')}</div>
          <div class="row2">${this._color('Débit ↓', 'col_down', '#00e5ff')}${this._color('Débit ↑', 'col_up', '#c08cff')}</div>
          <div class="hint">Liseret vide = suit le thème (--rgb-primary-color) comme avant.</div>
          ${this._color('Liseret écran', 'col_frame', '#00e5ff')}
        </ha-expansion-panel>
        <div class="group"><div class="group-title">En-tête</div>
          ${this._text('Titre', 'header.title', 'Latitude 5420')}
          ${this._icon('Icône', 'header.icon', 'mdi:laptop')}
          ${this._color('Couleur', 'header.color', '#b482ff')}
          ${this._text('Taille titre', 'header.title_size', '18px')}
          ${this._select('Police', 'header.font', NEON_FONTS, '— thème HA —')}
          ${this._toggle('Majuscules', 'header.uppercase', true)}
        </div>
        <ha-expansion-panel outlined header="En-tête — effets avancés">
          ${this._text('Ombre titre (text-shadow)', 'header.title_shadow', '0 0 8px ...')}
          <div class="hint">Si renseignée, l'ombre remplace le glow ci-dessous.</div>
          <div class="row2">${this._text('Épaisseur', 'header.font_weight', '600')}${this._text('Espacement', 'header.letter_spacing', '0.02em')}</div>
          ${this._toggle('Italique', 'header.italic', false)}
          ${this._toggle('Titre en dégradé', 'header.gradient', false)}
          <div class="row2">${this._color('Dégradé — départ', 'header.gradient_from', 'var(--primary-color)')}${this._color('Dégradé — arrivée', 'header.gradient_to', 'var(--accent-color)')}</div>
          ${this._toggle('Glow du titre', 'header.glow', false)}
          <div class="row2">${this._text('Taille du glow', 'header.glow_size', '12')}${this._color('Couleur du glow', 'header.glow_color', 'var(--primary-color)')}</div>
          ${this._toggle('Scintillement du titre', 'header.flicker', false)}
          <div class="row2">${this._color("Couleur de l'icône", 'header.icon_color', 'défaut : couleur du titre')}${this._text("Taille de l'icône", 'header.icon_size', 'défaut : taille du titre')}</div>
          <div class="hint">Mêmes réglages que sur les autres cards néon (entities/climate).</div>
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Système / OS (reporter MQTT)">
          ${this._entity('OS', 'os_entity')}
          ${this._entity('Kernel', 'kernel_entity')}
          ${this._entity('Uptime', 'uptime_entity')}
          ${this._entity('MAJ en attente', 'updates_entity')}
          ${this._entity('Release upgrade', 'release_entity')}
          ${this._entity('Reboot requis (binary)', 'reboot_entity', 'binary_sensor.…')}
          ${this._entity('Process total', 'proc_entity')}
          ${this._text('Libellé du chiffre "process"', 'proc_label', 'proc')}
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Charge">
          ${this._entity('CPU %', 'cpu_entity')}
          ${this._entity('GPU %', 'gpu_entity')}
          ${this._entity('Load average', 'load_entity')}
          ${this._text('Nb cœurs (pour load %)', 'load_cores', '8')}
          ${this._entity('RAM %', 'ram_entity')}
          ${this._entity('Disque %', 'disk_entity')}
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Température / Batteries / Réseau">
          ${this._entity('Température CPU', 'temp_entity')}
          ${this._entity('Batterie %', 'battery_entity')}
          ${this._entity('2e batterie % (optionnel)', 'battery_entity_2')}
          ${this._entity('Réseau ↓ (RX)', 'net_rx_entity')}
          ${this._entity('Réseau ↑ (TX)', 'net_tx_entity')}
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Seuils d'alerte">
          <div class="row2">${this._text('Temp WARN °C', 'temp_warn', '65')}${this._text('Temp CRIT °C', 'temp_crit', '85')}</div>
          <div class="row2">${this._text('Batt WARN %', 'batt_warn', '25')}${this._text('Batt CRIT %', 'batt_crit', '10')}</div>
          <div class="row2">${this._text('Batt2 WARN %', 'batt2_warn', '25')}${this._text('Batt2 CRIT %', 'batt2_crit', '10')}</div>
        </ha-expansion-panel>
        <ha-expansion-panel outlined header="Détournement des barres (label + seuils par slot)">
          <div class="hint">Renomme une barre et/ou change ses seuils sans toucher l'entité — utile pour brancher
            autre chose qu'attendu (ex : une batterie dans le slot GPU) sans fausse alerte à 85%.
            La logique reste "haut = mauvais" pour ces slots (CPU/GPU/LOAD/RAM/DSK/TEMP) — la batterie garde sa
            logique inversée. Laisser vide = comportement d'origine.</div>
          <div class="row2">${this._text('Libellé CPU', 'cpu_label', 'CPU')}${this._text('Libellé GPU', 'gpu_label', 'GPU')}</div>
          <div class="row2">${this._text('GPU WARN', 'gpu_warn', '70')}${this._text('GPU HOT', 'gpu_hot', '90')}</div>
          <div class="row2">${this._text('Libellé LOAD', 'load_label', 'LOAD')}${this._text('Libellé RAM', 'ram_label', 'RAM')}</div>
          <div class="row2">${this._text('Libellé DSK', 'disk_label', 'DSK')}${this._text('Libellé TEMP', 'temp_label', 'TEMP')}</div>
          <div class="row2">${this._text('Libellé BATT', 'batt_label', 'BATT')}${this._text('Libellé BATT2', 'batt2_label', 'BATT2')}</div>
        </ha-expansion-panel>
      </div>`;
    this.querySelectorAll('input[data-key]:not([data-bool])').forEach(inp =>
      inp.addEventListener('input', () => {
        const val = inp.value.trim();
        this._set(inp.dataset.key, val);
        this.querySelectorAll(`input[data-key="${inp.dataset.key}"]`).forEach(t => {
          if (t === t.ownerDocument.activeElement || t === inp) return;
          if (t.type === 'color'){ const hx = this._hexColor(val) || (t.dataset.ph ? this._resolveColor(t.dataset.ph) : null); if (hx) t.value = hx; }
          else t.value = val;
        });
      }));
    this.querySelectorAll('input[data-key][data-bool]').forEach(inp =>
      inp.addEventListener('change', () => this._set(inp.dataset.key, inp.checked ? true : '')));
    this.querySelectorAll('select[data-key]').forEach(sel =>
      sel.addEventListener('change', () => this._set(sel.dataset.key, sel.value.trim())));
    this._refreshLists();
    this._bindIconPreviews();
  }
  _bindIconPreviews(){
    this.querySelectorAll('.icon-preview[data-preview]').forEach(preview => {
      const key = preview.dataset.preview;
      const inp = this.querySelector(`input[data-key="${key}"]`);
      const upd = () => {
        const val = (inp?.value || '').trim();
        preview.innerHTML = '';
        if (/^mdi:[a-z0-9-]+$/.test(val)){
          const ico = document.createElement('ha-icon');
          ico.setAttribute('icon', val);
          ico.style.cssText = '--mdc-icon-size:22px';
          preview.appendChild(ico);
        }
      };
      if (inp) inp.addEventListener('input', upd);
      upd();
    });
  }
}

if (!customElements.get('linux-terminal-card-webgl'))
  customElements.define('linux-terminal-card-webgl', LinuxTerminalCardWebgl);
if (!customElements.get('linux-terminal-card-webgl-editor'))
  customElements.define('linux-terminal-card-webgl-editor', LinuxTerminalCardWebglEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'linux-terminal-card-webgl')){
  window.customCards.push({
    type: 'linux-terminal-card-webgl',
    name: 'Linux Terminal Card (WebGL)',
    description: 'Terminal CRT sci-fi rendu par shader WebGL — vraie courbure de tube, aberration, bloom, scanlines + GLITCH.',
    preview: true,
  });
}

console.info('%c 🐧 linux-terminal-card-webgl v1.9 %c CRT SHADER ',
  'background:#6200EA;color:#fff;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#00e5ff;padding:2px 4px;border-radius:0 3px 3px 0;');

})();
