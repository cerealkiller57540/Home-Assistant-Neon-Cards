/* ── neon-markdown-card v3.0 ──
 * Header néon (repris de neon-header-card-v2) + BODY full HTML/Markdown/Jinja.
 *
 *   type: custom:neon-markdown-card
 *   mode: both            # title | body | both
 *   title: { … }          # identique à neon-header-card-v2 (glow/gradient/scanline/…)
 *   body:
 *     format: html        # html | markdown
 *     content: >-         # texte templaté (set/if/for/loop/filtres) — voir moteur ci-dessous
 *       {% for a in state_attr('sensor.x','attackers')|sort(attribute='score',reverse=true) %}
 *         {% if loop.index<=5 %}<div>{{loop.index}}. {{a.ip}} ({{a.score}})</div>{% endif %}
 *       {% endfor %}
 *   shared: { … }         # padding/bg/border/tap_action — identique v2
 *
 * ── MOTEUR DE TEMPLATE (client-side, pas de round-trip serveur) ──
 *   {% set x = expr %}                variables
 *   {% if C %}…{% elif C %}…{% else %}…{% endif %}
 *   {% for x in LISTE %}…{% endfor %} LISTE = littéral [..], objets [{..},{..}],
 *                                      range(...) ou state_attr(...) renvoyant un array
 *   {% macro nom(a, b='def') %}…{% endmacro %}  puis {{ nom(x) }} — v4.8
 *                                      positionnels + valeurs par défaut ; le HTML rendu
 *                                      est sanitisé comme le reste ; récursion coupée à 32
 *                                      (pas de {% call %}, pas de kwargs)
 *   x.champ / x.0.champ               notation pointée (objets/index)
 *   loop.index / index0 / first / last / length
 *   {{ expr }}                        + - * / ( ), == != > < >= <=, and/or/not, in,
 *                                      ternaire "A if C else B", ~ (concat)
 *   filtres : round float int abs upper lower title capitalize trim replace truncate
 *             default length thousands first last join reverse sum min max sort map
 *             selectattr list clamp format zfill
 *             (sort/map/sum/min/max/selectattr acceptent attribute='champ')
 *
 * ── BODY : HTML autorisé ──
 *   DIV SPAN B STRONG I EM U SMALL MARK CODE BR HA-ICON DEL A IMG P HR BLOCKQUOTE
 *   H1-H4 UL OL LI TABLE THEAD TBODY TR TD TH  + SVG (géométrie/présentation)
 *   attrs : style class title aria-label role ; A→href/target/rel ; IMG→src/alt/…
 *   href/src bordés : https:// externe (target=_blank rel=noopener forcés),
 *                     /… interne (nav HA), /local//api//www/ pour IMG. Bloqué :
 *                     javascript:/data:/vbscript:/http nu/protocol-relative.
 *   style : conic/linear/radial-gradient, box-shadow, filter, clip-path, mask,
 *           mix-blend-mode, animation, clamp/calc, cqi, container-type… OK.
 *           url() local (/local, /api, /www, /media, /brand) autorise ;
 *           URLs externes, @import, expression(), javascript:, behavior, binding interdits.
 *
 * Keyframes réutilisables (via animation: inline) :
 *   nmc-flicker nmc-scan-scroll nmc-scan-flicker nmc-card-glitch nmc-icon-glitch
 *   nmc-text-glitch nmc-core-pulse nmc-core-glow nmc-ring-spin nmc-ring-spin-rev
 *   nmc-data-flow nmc-thermo-wave nmc-cell-charge nmc-shimmer nmc-stream-x
 *   nmc-stream-x-rev nmc-pulse-travel nmc-pulse-travel-rev nmc-fiber-glow
 *   nmc-filter-scan nmc-filter-glow nmc-block-flash nmc-pew-flow nmc-blip-pulse
 *   nmc-dash-crawl (défilement de pointillés — SEULE anim sûre sur du SVG : Safari
 *   ignore transform-origin sur les éléments SVG → jamais de rotate/scale sur eux)
 *
 * ── v4.0 ──
 *   <style> COMPLET dans le body (classes, @container, @media) — scopé au shadow DOM.
 *     Ressources CSS locales autorisées ; fallback @keyframes only si URL externe,
 *     @import ou @font-face détecté.
 *   data-entity="sensor.x" sur tout élément HTML/SVG → tap = popup more-info (historique natif).
 *   debug: true (top-level) → les erreurs de template s'affichent sous le body.
 *   history: [{entity, hours}] (top-level) → var `hist['sensor.x']` = {pts,min,max,first,last,n}
 *     pts = polyline normalisée x:0-100 y:0-30, rafraîchie ~5 min via /api/history.
 *     Ex : <svg viewBox="0 0 100 30"><polyline points="{{ hist['sensor.x'].pts }}" …/></svg>
 *   Filtres + : clamp(min,max) · format (mini-printf, args littéraux OU variables) · zfill(n)
 *   Fix moteur : filtres appliqués dans les branches de ternaire, opérandes and/or/not/in/is
 *     et côtés de ~ (avant : silencieusement perdus).
 *   Fix fonts : css2 tente wght@400;500;700 puis famille nue (le 900 manquant cassait tout).
 *
 * ── Maintenance v4.2 ──
 *   Garde-fous template : sortie <= 100000 caracteres, <= 1000 iterations,
 *     profondeur <= 32 pour eviter les rendus trop lourds.
 *   Jinja : constantes true/false/none/null et operateur in avec listes,
 *     chaines, objets et alias d'entites definis par {% set %}.
 *   Performance : les cards ne rerendent plus sur un changement hass sans
 *     rapport avec leurs entites; les expressions dynamiques restent suivies.
 *   Cycle de vie : reconnexion robuste et invalidation des reponses history
 *     devenues obsoletes apres un changement de configuration.
 *   Securite : sources IMG limitees a /local, /api, /www, /media et /brand.
 *
 * ── v4.3 ──
 *   Template : now().hour/minute/second, range() et else dans les boucles for.
 *   Sanitizer : declarations CSS filtrees individuellement et url() locales autorisees.
 *     Balises HTML inconnues deballees pour conserver leurs enfants autorises.
 *
 * ── v4.4 ──
 *   Expressions Home Assistant : acces states.domain.entity.attribut et as_timestamp().
 *
 * ── v4.5 ──
 *   Correctif sanitizer : les proprietes CSS inline standard sont conservees.
 *
 * ── v4.6 ──
 *   Polish : validation des noms de proprietes CSS et garde-fous media responsifs.
 *   Tests : suite navigateur dans neon-markdown-card.test.html.
 *
 * ── v4.9 ──
 *   Macros PARTAGEES entre cards (NMC_SHARED_MACROS_SRC, pres des constantes en tete de
 *   fichier) : disponibles dans le body/title de TOUTES les cards sans redefinition locale.
 *   Fusionnees en own-properties de vars (pas de chaine de prototypes) -> une macro locale
 *   de meme nom l'ecrase sans impacter les autres cards ; aucune fuite inverse possible.
 *   Ajouter une macro partagee = editer NMC_SHARED_MACROS_SRC dans le moteur (pas la config
 *   JSON du dashboard) + bumper NMC_VERSION + pousser un hacstag.
 *   Audit des 20 cards du dashboard (2026-09-08) : aucun autre manque moteur reel (is
 *   defined/none/number/string, zfill, etc. deja supportes) — pas d'ajout speculatif.
 *
 * ── v4.9.1 (patch, 08/09/2026) ──
 *   fmt_eta (premiere macro partagee, deployee sans test sur le vrai moteur) rendait du
 *   texte litteral en prod. Deux vrais manques moteur corriges : (1) le routage vers
 *   nmcEvalArith exigeait un operateur binaire (plus, moins, fois ou division) dans
 *   l'expression, un "%" isole (ex. "x % 24") ne passait jamais l'evaluateur arithmetique ;
 *   (2) l'appel de macro evaluait ses arguments via nmcEval au lieu de nmcEvalF, donc un
 *   argument filtre chaine (ex. "rd, round(0), int") n'etait jamais applique. 15 cas
 *   mesures sur harnais node (le caractere pipe reste NON supporte dans une expression
 *   arithmetique composee : utiliser floor() plutot que le filtre int dans ce contexte).
 */

const NMC_VERSION = "4.9.4";
const NMC_MAX_TEMPLATE_OUTPUT = 100000;
const NMC_MAX_TEMPLATE_ITERATIONS = 1000;
const NMC_MAX_TEMPLATE_DEPTH = 32;

// ── Macros partagees entre cards (v4.9) ──────────────────────────
// Bibliotheque de {% macro %} disponibles dans TOUTES les cards, sans avoir a les
// redefinir dans chaque body/title. Definie ici (code du moteur), pas dans la config
// JSON du dashboard, sinon on retombe sur "dupliquer le texte dans chaque card".
// Ajouter une macro partagee = editer NMC_SHARED_MACROS_SRC + bumper NMC_VERSION +
// pousser un hacstag (edition du .js, pas juste de la config).
// fmt_eta : PAS de "|int" dans le corps — le mini-evaluateur arithmetique du moteur
// (nmcEvalArith/nmcTokenize) ne connait pas le pipe ; floor() (nmcMathFns) le remplace.
// Le routage vers cet evaluateur pour un "%" isole (regex de garde ~ligne 682) a ete
// corrige le 08/09/2026 pour reconnaitre aussi "%" seul, donc pas de "+ 0" de
// contournement necessaire ici. Formule mesuree OK (harnais node, 08/09/2026, 15 cas).
// hp_style : bloc <style> commun aux 12 cards de la vue Heat Plant (8 regles CSS
// identiques : .tb .hz .tb-l .sec .tile .lbl .tv .tu). Verifie au harnais node (08/09/2026)
// qu'un <style> emis par une macro traverse nmcSanitizeBody intact, et que deux <style>
// dans un meme body (ce bloc + un @keyframes local, cas BIAS_SOLVER) coexistent sans
// conflit. Zero parametre, pure emission de texte, zero risque arithmetique.
// tuile(l, v, u, c, e) : motif de tuile (label/valeur/unite/couleur/entite) identique
// octet-pour-octet dans 6 cards Heat Plant (verifie par hash sha1 sur les .jinja avant
// ecriture). 5 parametres positionnels, pure emission de texte, verifie au harnais node
// (08/09/2026) : appel simple hors boucle (match exact au motif fige), appel dans un
// {% for %} sur une liste de dicts (t.l/t.v/t.u/t.c/t.e), coexistence avec hp_style().
// spark(hh, ent, label, hex, rgba) : motif de sparkline 24h (legende min/max/n pts +
// <svg> a 2 <polyline>, aire + trait) identique octet-pour-octet dans 4 cards Heat Plant
// (BIAS_SOLVER, INNER_GRID, MESURES_LIVE, SOLAR_FARM ; verifie par grep ligne a ligne des
// .jinja avant ecriture). hh = l'objet hist['entity_id'] deja construit par la card
// (expose .min/.max/.n/.pts) : PAS eclate en 4 parametres separes (min, max, n, pts)
// comme envisage initialement, cet objet est deja disponible tel quel dans chaque
// template appelant (via {% set hh = hist['x'] %}) donc l'eclater aurait ete une
// redondance pure. hex et rgba restent deux parametres distincts : le moteur n'expose
// aucune conversion hex->rgb native (verifie), donc rgba doit etre fourni separement.
// Appelant TOUJOURS a l'interieur d'un {% if hist['x'] is defined %} (jamais appelee si
// l'historique n'est pas encore charge) -- verifie au harnais node (08/09/2026) : appel
// avec hh simule (comparaison exacte au motif fige), motif reel complet ({% if %} +
// {% set hh %}), hist non defini (bloc saute sans erreur, spark() jamais invoquee),
// coexistence avec hp_style()/tuile() dans un meme rendu.
const NMC_SHARED_MACROS_SRC = `
{% macro fmt_eta(base_min, minutes) %}{% set total = base_min + minutes %}{% set h = floor(total / 60) % 24 %}{% set m = total % 60 %}{{ h|zfill(2) }}:{{ m|zfill(2) }}{% endmacro %}
{% macro hp_style() %}<style>.tb{display:flex;align-items:center;gap:8px;margin:2px 0 10px;}.hz{height:7px;flex:0 0 44px;background:repeating-linear-gradient(-45deg,rgba(255,179,0,.8) 0 6px,transparent 6px 12px);}.tb-l{font-size:10px;letter-spacing:2.5px;color:rgba(184,197,214,.66);}.sec{font-size:10px;letter-spacing:2px;color:rgba(184,197,214,.66);margin:0 0 5px;}.tile{background:rgba(13,18,30,.55);border:1px solid rgba(140,170,200,.16);padding:7px 4px;text-align:center;}.lbl{font-size:10px;letter-spacing:1px;color:rgba(184,197,214,.66);white-space:nowrap;overflow:hidden;}.tv{font-size:16px;font-weight:700;font-family:Consolas,monospace;color:#fff;}.tu{font-size:11px;color:rgba(184,197,214,.66);}</style>{% endmacro %}
{% macro tuile(l, v, u, c, e) %}<div class="nmc-tile tile" data-entity="{{ e }}" style="border-top:2px solid {{ c }};">
      <div class="lbl">{{ l }}</div>
      <div class="tv" style="text-shadow:0 0 6px {{ c }};">{{ v }}</div>
      <div class="tu">{{ u }}</div>
    </div>{% endmacro %}
{% macro spark(hh, ent, label, hex, rgba) %}<div class="sec" style="margin-top:12px;">{{ label }} — 24H — min {{ hh.min|round(1) }} · max {{ hh.max|round(1) }} · {{ hh.n }} pts</div>
  <svg viewBox="0 0 100 30" preserveAspectRatio="none" style="width:100%;height:36px;display:block;" data-entity="{{ ent }}">
    <polyline points="0,30 {{ hh.pts }} 100,30" fill="rgba({{ rgba }},.09)" stroke="none"/>
    <polyline points="{{ hh.pts }}" fill="none" stroke="{{ hex }}" stroke-width="1" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 3px {{ hex }});"/>
  </svg>{% endmacro %}
`;

// ── Device detection ─────────────────────────────────────────────
const NMC_IS_IPAD =
  /iPad/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const NMC_IS_LOW_POWER =
  NMC_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

// ── Google Fonts ─────────────────────────────────────────────────
const NMC_FONTS = [
  "Rajdhani",
  "Orbitron",
  "Share Tech Mono",
  "Exo 2",
  "Roboto",
  "Montserrat",
  "Oswald",
  "Bebas Neue",
  "Inter",
  "Poppins",
  "Space Grotesk",
  "Syne",
  "DM Sans",
  "Playfair Display",
  "Cinzel",
];
const _nmcFontLoaded = new Set();
function nmcLoadFont(family) {
  if (!family || _nmcFontLoaded.has(family)) return;
  const id = `nmc-font-${family.replace(/\s/g, "-")}`;
  if (document.getElementById(id)) {
    _nmcFontLoaded.add(family);
    return;
  }
  ["https://fonts.googleapis.com", "https://fonts.gstatic.com"].forEach((href) => {
    if (!document.querySelector(`link[rel=preconnect][href="${href}"]`)) {
      const l = document.createElement("link");
      l.rel = "preconnect";
      l.href = href;
      if (href.includes("gstatic")) l.crossOrigin = "anonymous";
      document.head.appendChild(l);
    }
  });
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  // css2 renvoie une 400 si UNE graisse manque (Rajdhani/Chakra Petch sans 900) →
  // set raisonnable d'abord, famille nue (400) en secours.
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;700&display=swap`;
  link.onerror = () => {
    link.onerror = null;
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
  };
  document.head.appendChild(link);
  _nmcFontLoaded.add(family);
}

/* ══════════════════════════════════════════════════════════════════
 *  MOTEUR DE TEMPLATE — parseur séquentiel (compile → arbre → rend)
 * ════════════════════════════════════════════════════════════════ */

function nmcToStr(v) {
  if (v == null) return "";
  if (typeof v === "object") return "";
  return String(v);
}

const _nmcTagRe = /\{\{\s*([\s\S]+?)\s*\}\}|\{\%\s*([\s\S]+?)\s*\%\}/g;

// --- macros {% macro %} : etat de rendu courant, pour que l'appel depuis nmcAtom()
// --- reste soumis aux memes garde-fous (profondeur / iterations / taille) que le reste.
const NMC_MACRO_PREFIX = "__nmc_macro_";
const NMC_MACRO_RESERVED = new Set([
  "range", "states", "is_state", "state_attr", "as_timestamp", "now", "loop",
]);
let _nmcCtx = null;
let _nmcErrs = null;

// Une macro definie dans un {% for %} / une macro appelante ne doit pas mourir avec le
// scope enfant : Jinja2 la rend visible apres la boucle. On remonte la chaine de
// prototypes (posee par Object.create) jusqu'au scope racine pour l'y stocker.
function nmcMacroScope(vars) {
  let root = vars;
  for (let i = 0; i < NMC_MAX_TEMPLATE_DEPTH; i++) {
    const proto = Object.getPrototypeOf(root);
    if (!proto || proto === Object.prototype) break;
    root = proto;
  }
  return root;
}

function nmcCompile(text) {
  text = text.replace(/\{#[\s\S]*?#\}/g, ""); // commentaires Jinja {# ... #}
  _nmcTagRe.lastIndex = 0;
  const tokens = [];
  let last = 0,
    m;
  while ((m = _nmcTagRe.exec(text)) !== null) {
    if (m.index > last) tokens.push({ t: "text", s: text.slice(last, m.index) });
    last = _nmcTagRe.lastIndex;
    if (m[1] !== undefined) tokens.push({ t: "expr", s: m[1].trim() });
    else tokens.push({ t: "tag", s: m[2].trim() });
  }
  if (last < text.length) tokens.push({ t: "text", s: text.slice(last) });

  let i = 0;
  function parseSeq(stopKw) {
    const nodes = [];
    while (i < tokens.length) {
      const tk = tokens[i];
      if (tk.t === "text" || tk.t === "expr") {
        nodes.push(tk);
        i++;
        continue;
      }
      const kw = tk.s.split(/\s+/, 1)[0];
      if (stopKw && stopKw.includes(kw)) return nodes;
      if (kw === "set") {
        const mm = tk.s.match(/^set\s+([a-zA-Z_]\w*)\s*=\s*([\s\S]+)$/);
        if (mm) nodes.push({ t: "set", name: mm[1], s: mm[2].trim() });
        i++;
      } else if (kw === "for") {
        const mm = tk.s.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+([\s\S]+)$/);
        i++;
        const body = parseSeq(["else", "endfor"]);
        let elseBody = [];
        if (i < tokens.length && tokens[i].t === "tag" && tokens[i].s.startsWith("else")) {
          i++;
          elseBody = parseSeq(["endfor"]);
        }
        if (i < tokens.length && tokens[i].t === "tag" && tokens[i].s.startsWith("endfor")) i++;
        if (mm) nodes.push({ t: "for", name: mm[1], s: mm[2].trim(), body, elseBody });
      } else if (kw === "macro") {
        // {% macro nom(a, b=defaut) %} ... {% endmacro %}
        const mm = tk.s.match(/^macro\s+([a-zA-Z_]\w*)\s*\(([\s\S]*)\)\s*$/);
        i++;
        const body = parseSeq(["endmacro"]);
        if (i < tokens.length && tokens[i].t === "tag" && tokens[i].s.startsWith("endmacro")) i++;
        if (mm) {
          const params = nmcSplitTop(mm[2], ",")
            .map((raw) => {
              const seg = raw.trim();
              if (!seg) return null;
              const eq = nmcSplitTop(seg, "=");
              return eq.length > 1
                ? { name: eq[0].trim(), def: eq.slice(1).join("=").trim() }
                : { name: seg, def: null };
            })
            .filter((param) => param && /^[a-zA-Z_]\w*$/.test(param.name));
          nodes.push({ t: "macro", name: mm[1], params, body });
        }
      } else if (kw === "if") {
        i++;
        const branches = [
          { cond: tk.s.replace(/^if\s+/, "").trim(), body: parseSeq(["elif", "else", "endif"]) },
        ];
        while (i < tokens.length && tokens[i].t === "tag") {
          const w = tokens[i].s.split(/\s+/, 1)[0];
          if (w === "elif") {
            const c = tokens[i].s.replace(/^elif\s+/, "").trim();
            i++;
            branches.push({ cond: c, body: parseSeq(["elif", "else", "endif"]) });
          } else if (w === "else") {
            i++;
            branches.push({ cond: null, body: parseSeq(["endif"]) });
          } else break;
        }
        if (i < tokens.length && tokens[i].t === "tag" && tokens[i].s.startsWith("endif")) i++;
        nodes.push({ t: "if", branches });
      } else {
        i++;
      }
    }
    return nodes;
  }
  return parseSeq(null);
}

// Registre des macros partagees (NMC_SHARED_MACROS_SRC) : { nom_prefixe: {params, body} }.
// Rempli une seule fois par nmcInitSharedMacros(), a partir de l'AST compile (nmcCompile
// n'a besoin d'aucun hass). Volontairement PAS de rendu ni de chaine de prototypes ici :
// fusionner ces defs par Object.assign dans un vars-litteral garde nmcMacroScope() correct
// (son proto reste Object.prototype -> la macro-scope racine reste la card, jamais la lib
// partagee) — une chaine Object.create(sharedRoot) ferait remonter root jusqu'a la lib et
// ferait fuiter les macros LOCALES d'une card vers toutes les autres.
const NMC_SHARED_MACRO_DEFS = {};
let _nmcSharedMacrosInit = false;
function nmcInitSharedMacros() {
  if (_nmcSharedMacrosInit) return;
  _nmcSharedMacrosInit = true;
  for (const n of nmcCompile(NMC_SHARED_MACROS_SRC)) {
    if (n.t !== "macro") continue;
    if (NMC_MACRO_RESERVED.has(n.name) || nmcMathFns[n.name]) continue; // meme garde-fou qu'au rendu
    NMC_SHARED_MACRO_DEFS[NMC_MACRO_PREFIX + n.name] = { params: n.params, body: n.body };
  }
}

function nmcRenderNodes(nodes, hass, vars, errs, ctx) {
  ctx = ctx || { chars: 0, iterations: 0, depth: 0, truncated: false, warned: new Set() };
  const warn = (message) => {
    if (errs && !ctx.warned.has(message)) {
      ctx.warned.add(message);
      errs.push(message);
    }
  };
  if (ctx.depth >= NMC_MAX_TEMPLATE_DEPTH) {
    warn(`template → profondeur maximale (${NMC_MAX_TEMPLATE_DEPTH})`);
    return "";
  }
  ctx.depth++;
  const _prevCtx = _nmcCtx,
    _prevErrs = _nmcErrs;
  _nmcCtx = ctx;
  _nmcErrs = errs;
  let out = "";
  const append = (value) => {
    if (ctx.truncated) return;
    const text = String(value);
    const room = NMC_MAX_TEMPLATE_OUTPUT - ctx.chars;
    if (room <= 0) {
      ctx.truncated = true;
      warn(`template → sortie limitée à ${NMC_MAX_TEMPLATE_OUTPUT} caractères`);
      return;
    }
    if (text.length > room) {
      out += text.slice(0, room);
      ctx.chars += room;
      ctx.truncated = true;
      warn(`template → sortie limitée à ${NMC_MAX_TEMPLATE_OUTPUT} caractères`);
      return;
    }
    out += text;
    ctx.chars += text.length;
  };
  try {
    for (const n of nodes) {
      if (ctx.truncated) break;
      if (n.t === "text") {
        append(n.s);
        continue;
      }
      if (n.t === "expr") {
        try {
          const { expr, filters } = nmcSplitFilters(n.s);
          append(nmcToStr(nmcApplyFilters(nmcEval(expr, hass, vars), filters, hass, vars)));
        } catch (e) {
          if (errs) errs.push(`{{ ${String(n.s).slice(0, 70)} }} → ${(e && e.message) || e}`);
        }
        continue;
      }
      if (n.t === "macro") {
        // definition seule : on stocke, on n'emet RIEN (sinon le corps sort inline)
        if (NMC_MACRO_RESERVED.has(n.name) || nmcMathFns[n.name]) {
          warn(`macro ${n.name} → nom reserve, definition ignoree`);
        } else {
          nmcMacroScope(vars)[NMC_MACRO_PREFIX + n.name] = { params: n.params, body: n.body };
        }
        continue;
      }
      if (n.t === "set") {
        try {
          const { expr, filters } = nmcSplitFilters(n.s);
          let v = nmcEval(expr, hass, vars);
          if (filters) v = nmcApplyFilters(v, filters, hass, vars);
          if (typeof v === "string") {
            const num = parseFloat(v);
            if (!isNaN(num) && String(num) === v.trim()) v = num;
          }
          vars[n.name] = v;
        } catch (e) {
          vars[n.name] = "";
          if (errs) errs.push(`set ${n.name} = ${String(n.s).slice(0, 70)} → ${(e && e.message) || e}`);
        }
        continue;
      }
      if (n.t === "for") {
        let list;
        try {
          const { expr, filters } = nmcSplitFilters(n.s);
          list = nmcApplyFilters(nmcEval(expr, hass, vars), filters, hass, vars);
        } catch (e) {
          if (errs) errs.push(`for ${n.name} in ${String(n.s).slice(0, 70)} → ${(e && e.message) || e}`);
          continue;
        }
        if (!Array.isArray(list)) {
          if (errs) errs.push(`for ${n.name} in ${String(n.s).slice(0, 70)} → pas une liste (${typeof list})`);
          continue;
        }
        if (list.length === 0 && n.elseBody && n.elseBody.length) {
          out += nmcRenderNodes(n.elseBody, hass, vars, errs, ctx);
          continue;
        }
        const len = Math.min(list.length, NMC_MAX_TEMPLATE_ITERATIONS - ctx.iterations);
        if (len < list.length)
          warn(`for ${n.name} → itérations limitées à ${NMC_MAX_TEMPLATE_ITERATIONS}`);
        for (let i = 0; i < len && !ctx.truncated; i++) {
          ctx.iterations++;
          const child = Object.create(vars);
          child[n.name] = list[i];
          child.loop = { index: i + 1, index0: i, first: i === 0, last: i === len - 1, length: len };
          out += nmcRenderNodes(n.body, hass, child, errs, ctx);
        }
        continue;
      }
      if (n.t === "if") {
        for (const br of n.branches) {
          if (br.cond === null) {
            out += nmcRenderNodes(br.body, hass, vars, errs, ctx);
            break;
          }
          let ok = false;
          try {
            ok = nmcTruthy(nmcEval(br.cond, hass, vars));
          } catch (e) {
            if (errs) errs.push(`if ${String(br.cond).slice(0, 70)} → ${(e && e.message) || e}`);
          }
          if (ok) {
            out += nmcRenderNodes(br.body, hass, vars, errs, ctx);
            break;
          }
        }
      }
    }
  } finally {
    ctx.depth--;
    _nmcCtx = _prevCtx;
    _nmcErrs = _prevErrs;
  }
  return out;
}

const _nmcCache = new Map();
function nmcParseTemplate(hass, text, vars, errs) {
  if (!hass || !text || typeof text !== "string") return text;

  const d = new Date();
  vars = vars || {};
  // now_hour / now_minute : exposés à plat, gardés pour les cards qui les utilisent.
  // (Les dicts dans un {% set %} sont supportés depuis la v4.8 — ce n'est plus un contournement.)
  vars["now_hour"] = d.getHours();
  vars["now_minute"] = d.getMinutes();
  // Macros partagees (v4.9) : fusionnees en own-properties de ce vars-litteral, pas via
  // Object.create — une macro locale du meme nom definie dans `text` l'ecrasera sans
  // affecter les autres cards (cf commentaire sur nmcInitSharedMacros()).
  nmcInitSharedMacros();
  Object.assign(vars, NMC_SHARED_MACRO_DEFS);

  let nodes = _nmcCache.get(text);
  if (!nodes) {
    nodes = nmcCompile(text);
    if (_nmcCache.size > 200) _nmcCache.clear();
    _nmcCache.set(text, nodes);
  }
  return nmcRenderNodes(nodes, hass, vars, errs).trim();
}

function nmcSplitFilters(s) {
  let depth = 0,
    inStr = "",
    pipeIdx = -1,
    hasOp = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") {
      depth++;
      continue;
    }
    if (c === ")" || c === "]" || c === "}") {
      depth--;
      continue;
    }
    if (depth !== 0) continue;
    if (c === "|" && pipeIdx < 0) pipeIdx = i;
    else if (c === "~") hasOp = true;
    else if (c === "<" || c === ">" || c === "=" || c === "!") hasOp = true;
    else if (
      s.substr(i, 4) === " if " ||
      s.substr(i, 6) === " else " ||
      s.substr(i, 5) === " and " ||
      s.substr(i, 4) === " or "
    )
      hasOp = true;
  }
  if (pipeIdx >= 0 && !hasOp)
    return { expr: s.slice(0, pipeIdx).trim(), filters: s.slice(pipeIdx) };
  return { expr: s.trim(), filters: "" };
}

// Évalue une sous-expression EN APPLIQUANT ses filtres top-level : nécessaire dans les
// branches de ternaire, opérandes logiques et côtés de ~ (sinon x|round(1) y est perdu).
function nmcEvalF(s, hass, vars) {
  const sf = nmcSplitFilters(String(s).trim());
  let v = nmcEval(sf.expr, hass, vars);
  if (sf.filters) v = nmcApplyFilters(v, sf.filters, hass, vars);
  return v;
}

function nmcEval(expr, hass, vars) {
  expr = String(expr).trim();
  if (expr[0] === "[" && expr[expr.length - 1] === "]") {
    const inner = expr.slice(1, -1).trim();
    if (inner === "") return [];
    // Virgule finale tolérée comme en vrai Jinja : ignorer les segments vides
    return nmcSplitTop(inner, ",").filter((e) => e.trim() !== "").map((e) => nmcEval(e.trim(), hass, vars));
  }
  if (expr[0] === "{" && expr[expr.length - 1] === "}") {
    const inner = expr.slice(1, -1).trim();
    const obj = {};
    if (inner !== "") {
      for (const pair of nmcSplitTop(inner, ",")) {
        const kv = nmcSplitTop(pair, ":");
        if (kv.length !== 2) continue;
        // valeur = expression + filtres éventuels (ex: state_attr(...)|int(0))
        const vf = nmcSplitFilters(kv[1].trim());
        let vv = nmcEval(vf.expr, hass, vars);
        if (vf.filters) vv = nmcApplyFilters(vv, vf.filters, hass, vars);
        obj[kv[0].trim().replace(/^['"]|['"]$/g, "")] = vv;
      }
    }
    return obj;
  }
  // Littéral tuple (a, b, c, ...) : distinct des parenthèses de regroupement (a+b)*(c+d).
  // Condition : commence par "(", cette parenthèse ferme bien en tout dernier caractère
  // (sinon c'est ex. "(a)+(b)"), ET il y a au moins une virgule top-level à l'intérieur
  // (sinon "(a)" reste un simple regroupement scalaire, géré par nmcAtom).
  if (expr[0] === "(" && expr[expr.length - 1] === ")") {
    let depth = 0, closesAtEnd = false;
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") {
        depth--;
        if (depth === 0) { closesAtEnd = i === expr.length - 1; break; }
      }
    }
    if (closesAtEnd) {
      const inner = expr.slice(1, -1).trim();
      const parts = nmcSplitTop(inner, ",").filter((e) => e.trim() !== "");
      if (parts.length > 1) return parts.map((e) => nmcEval(e.trim(), hass, vars));
    }
  }
  const tern = nmcSplitTernary(expr);
  if (tern)
    return nmcTruthy(nmcEvalF(tern.cond, hass, vars))
      ? nmcEvalF(tern.t, hass, vars)
      : nmcEvalF(tern.f, hass, vars);
  const orSplit = nmcSplitLogic(expr, "or");
  if (orSplit) {
    // sémantique Python : 'a or b' = a si truthy, sinon b (renvoie la VALEUR, pas 1/0)
    const a = nmcEvalF(orSplit.a, hass, vars);
    return nmcTruthy(a) ? a : nmcEvalF(orSplit.b, hass, vars);
  }
  const andSplit = nmcSplitLogic(expr, "and");
  if (andSplit) {
    // sémantique Python : 'a and b' = b si a truthy, sinon a
    const a = nmcEvalF(andSplit.a, hass, vars);
    return nmcTruthy(a) ? nmcEvalF(andSplit.b, hass, vars) : a;
  }
  if (/^not\s+/.test(expr))
    return nmcTruthy(nmcEvalF(expr.replace(/^not\s+/, ""), hass, vars)) ? 0 : 1;
  {
    const isM = nmcSplitIs(expr);
    if (isM) {
      const v = nmcEvalF(isM.val, hass, vars);
      let res;
      if (isM.test === "none")
        res =
          v === "" ||
          v == null ||
          v === "None" ||
          v === "none" ||
          v === "unknown" ||
          v === "unavailable";
      else if (isM.test === "defined")
        res = !(v === "" || v == null || v === "None" || v === "unknown" || v === "unavailable");
      else if (isM.test === "number") res = !isNaN(parseFloat(v)) && isFinite(v);
      else if (isM.test === "string") res = typeof v === "string";
      else res = nmcTruthy(v);
      return (isM.neg ? !res : res) ? 1 : 0;
    }
  }
  {
    const inM = nmcSplitIn(expr);
    if (inM) {
      const val = nmcEvalF(inM.val, hass, vars);
      const collection = nmcEvalF(inM.list, hass, vars);
      const same = (a, b) => {
        const na = parseFloat(a),
          nb = parseFloat(b);
        return !isNaN(na) && !isNaN(nb) ? na === nb : String(a) === String(b);
      };
      const found = Array.isArray(collection)
        ? collection.some((item) => same(item, val))
        : typeof collection === "string"
          ? collection.includes(nmcToStr(val))
          : collection && typeof collection === "object"
            ? Object.prototype.hasOwnProperty.call(collection, val)
            : false;
      return (inM.neg ? !found : found) ? 1 : 0;
    }
  }
  const cmp = nmcSplitCompare(expr);
  if (cmp) {
    const evalSide = (side) => {
      const sf = nmcSplitFilters(side.trim());
      let v = nmcEval(sf.expr, hass, vars);
      if (sf.filters) v = nmcApplyFilters(v, sf.filters, hass, vars);
      return v;
    };
    const a = evalSide(cmp.a),
      b = evalSide(cmp.b);
    const na = parseFloat(a),
      nb = parseFloat(b);
    const num = !isNaN(na) && !isNaN(nb);
    switch (cmp.op) {
      case "==":
        return (num ? na === nb : String(a) === String(b)) ? 1 : 0;
      case "!=":
        return (num ? na !== nb : String(a) !== String(b)) ? 1 : 0;
      case ">":
        return na > nb ? 1 : 0;
      case "<":
        return na < nb ? 1 : 0;
      case ">=":
        return na >= nb ? 1 : 0;
      case "<=":
        return na <= nb ? 1 : 0;
    }
  }
  {
    let depth = 0,
      inStr = "";
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inStr) {
        if (c === inStr) inStr = "";
        continue;
      }
      if (c === '"' || c === "'") {
        inStr = c;
        continue;
      }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") depth--;
      else if (c === "~" && depth === 0)
        return (
          nmcToStr(nmcEvalF(expr.slice(0, i), hass, vars)) +
          nmcToStr(nmcEvalF(expr.slice(i + 1), hass, vars))
        );
    }
  }
  if (!/^['"]/.test(expr)) {
    const masked = expr
      .replace(/(states|is_state|state_attr)\([^)]*\)/g, "0")
      .replace(/['"][^'"]*['"]/g, "0");
    if (/[+\-*/%]/.test(masked) || /\([^)]*[+\-*/%]/.test(expr)) {
      const r = nmcEvalArith(expr, hass, vars);
      if (r !== undefined) return r;
    }
  }
  return nmcAtom(expr, hass, vars);
}

function nmcSplitTop(s, sep) {
  const out = [];
  let depth = 0,
    inStr = "",
    start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === sep && depth === 0) {
      out.push(s.slice(start, i));
      start = i + 1;
    }
  }
  out.push(s.slice(start));
  return out;
}

function nmcAtom(s, hass, vars) {
  s = s.trim();
  if (s === "") return "";
  if (/^(true|false)$/i.test(s)) return s.toLowerCase() === "true";
  if (/^(none|null)$/i.test(s)) return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  if (/^['"][\s\S]*['"]$/.test(s)) return s.slice(1, -1);
  const nowPart = s.match(/^now\(\)\.(hour|minute|second)$/);
  if (nowPart) {
    const current = new Date();
    return nowPart[1] === "hour"
      ? current.getHours()
      : nowPart[1] === "minute"
        ? current.getMinutes()
        : current.getSeconds();
  }
  if (s === "now()") return new Date();
  const rangeMatch = s.match(/^range\(([^()]*)\)$/);
  if (rangeMatch) {
    const args = nmcSplitTop(rangeMatch[1], ",").map((arg) => Number(nmcEval(arg.trim(), hass, vars)));
    if (args.length < 1 || args.length > 3 || args.some((arg) => !Number.isFinite(arg))) return [];
    const start = args.length === 1 ? 0 : args[0];
    const end = args.length === 1 ? args[0] : args[1];
    const step = args.length === 3 ? args[2] : 1;
    if (step === 0) return [];
    const values = [];
    for (let value = start; step > 0 ? value < end : value > end; value += step) {
      values.push(value);
      if (values.length >= NMC_MAX_TEMPLATE_ITERATIONS) break;
    }
    return values;
  }
  const timestampMatch = s.match(/^as_timestamp\((.*)\)$/);
  if (timestampMatch) {
    const args = nmcSplitTop(timestampMatch[1], ",");
    const value = nmcEval(args[0]?.trim() || "", hass, vars);
    const fallback = args.length > 1 ? Number(nmcEval(args[1].trim(), hass, vars)) : 0;
    if (value instanceof Date) return value.getTime() / 1000;
    const timestamp = Date.parse(String(value));
    return Number.isFinite(timestamp) ? timestamp / 1000 : Number.isFinite(fallback) ? fallback : 0;
  }
  let m = s.match(/^states\(\s*['"](.+?)['"]\s*\)$/);
  if (m) {
    const st = hass.states[m[1]];
    return st ? st.state : "";
  }
  // states() à entité DYNAMIQUE : states(var) où var contient l'entity_id
  if (s.startsWith("states(") && s.endsWith(")")) {
    const inner = s.slice(7, -1);
    if (nmcSplitTop(inner, ",").length === 1) {
      const ent = nmcToStr(nmcEval(inner, hass, vars));
      const st = hass.states[ent];
      return st ? st.state : "";
    }
  }
  m = s.match(/^is_state\(\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*\)$/);
  if (m) {
    const st = hass.states[m[1]];
    return st && st.state === m[2] ? 1 : 0;
  }
  m = s.match(/^state_attr\(\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*\)$/);
  if (m) {
    const st = hass.states[m[1]];
    return st && st.attributes ? (st.attributes[m[2]] ?? "") : "";
  }
  // state_attr à arguments DYNAMIQUES : state_attr('sensor.x', 'g_' ~ d ~ '_' ~ h)
  if (s.startsWith("state_attr(") && s.endsWith(")")) {
    const dynArgs = nmcSplitTop(s.slice(11, -1), ",");
    if (dynArgs.length === 2) {
      const ent = nmcToStr(nmcEval(dynArgs[0], hass, vars));
      const attr = nmcToStr(nmcEval(dynArgs[1], hass, vars));
      const st = hass.states[ent];
      return st && st.attributes ? (st.attributes[attr] ?? "") : "";
    }
  }
  // accès dict/list par CLÉ DYNAMIQUE : base[expr]  (ex: colors[nm], row[i])
  // base = var connue ou expression entre (), la clé est ré-évaluée
  {
    const mi = s.match(/^([a-zA-Z_]\w*|\([^]*\))\s*\[([^]+)\]((?:\.[a-zA-Z_0-9]\w*)*)$/);
    if (mi) {
      let base = nmcEval(mi[1], hass, vars);
      if (base != null && typeof base === "object") {
        const key = nmcEval(mi[2].trim(), hass, vars);
        let v = base[key];
        // v4.0 : chemin pointé APRÈS le crochet (ex: hist['sensor.x'].pts)
        if (mi[3]) {
          for (const seg of mi[3].split(".").filter(Boolean)) {
            if (v == null) return "";
            v = v[seg];
          }
        }
        return v == null ? "" : v;
      }
    }
  }
  // méthode .get(clé[, défaut])  (ex: colors.get(nm), colors.get(nm, '#fff'))
  {
    const mg = s.match(/^([a-zA-Z_]\w*)\.get\((.+)\)$/);
    if (mg) {
      const base = vars[mg[1]];
      if (base != null && typeof base === "object") {
        const args = nmcSplitTop(mg[2], ",");
        const key = nmcEval(args[0].trim(), hass, vars);
        const has = Object.prototype.hasOwnProperty.call(base, key);
        if (has) return base[key] == null ? "" : base[key];
        return args.length > 1 ? nmcEval(args[1].trim(), hass, vars) : "";
      }
    }
  }
  if (/^[a-zA-Z_]\w*(\.[a-zA-Z_0-9]\w*)+$/.test(s)) {
    const statePath = s.match(/^states\.([a-z_]+\.[a-zA-Z0-9_]+)(?:\.(state|[a-zA-Z_][a-zA-Z0-9_]*))?$/);
    if (statePath) {
      const state = hass.states[statePath[1]];
      if (!state) return "";
      return statePath[2] ? state[statePath[2]] ?? "" : state;
    }
    const path = s.split(".");
    let cur = path[0] in vars ? vars[path[0]] : undefined;
    for (let i = 1; i < path.length && cur != null; i++) cur = cur[path[i]];
    return cur == null ? "" : cur;
  }
  // appel de macro : nom(args...) defini par {% macro %}
  {
    const mc = s.match(/^([a-zA-Z_]\w*)\s*\(([\s\S]*)\)$/);
    if (mc && vars[NMC_MACRO_PREFIX + mc[1]]) {
      const def = vars[NMC_MACRO_PREFIX + mc[1]];
      const args = nmcSplitTop(mc[2], ",")
        .map((a) => a.trim())
        .filter((a) => a !== "");
      const child = Object.create(vars);
      for (let i = 0; i < def.params.length; i++) {
        const param = def.params[i];
        // nmcEvalF (pas nmcEval) : un argument d'appel peut porter des filtres chaines
        // (ex. tuile(rd|round(0)|int)) — nmcEval seul ignore tout ce qui suit un "|".
        if (i < args.length) child[param.name] = nmcEvalF(args[i], hass, vars);
        else child[param.name] = param.def != null ? nmcEvalF(param.def, hass, vars) : "";
      }
      // on reutilise le ctx du rendu en cours : la recursion est coupee par
      // NMC_MAX_TEMPLATE_DEPTH au lieu de figer le navigateur.
      return nmcRenderNodes(def.body, hass, child, _nmcErrs, _nmcCtx);
    }
  }
  if (s in vars) return vars[s];
  if (s[0] === "(") {
    let depth = 0,
      close = -1;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === "(") depth++;
      else if (s[i] === ")") {
        depth--;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }
    if (close >= 0) {
      const inside = nmcSplitFilters(s.slice(1, close));
      let base = nmcEval(inside.expr, hass, vars);
      if (inside.filters) base = nmcApplyFilters(base, inside.filters, hass, vars);
      const rest = s.slice(close + 1);
      if (rest === "") return base;
      if (/^((?:\.[a-zA-Z_0-9]\w*)+)$/.test(rest)) {
        for (const seg of rest.split(".").filter(Boolean)) {
          if (base == null) return "";
          base = base[seg];
        }
        return base == null ? "" : base;
      }
    }
  }
  return s;
}

function nmcTruthy(v) {
  if (v === false) return false;
  if (v === "" || v === 0 || v === "0" || v == null) return false;
  if (v === "off" || v === "false" || v === "unavailable" || v === "unknown" || v === "None")
    return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function nmcSplitTernary(s) {
  let depth = 0,
    inStr = "",
    ifIdx = -1,
    elseIdx = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0) {
      if (ifIdx < 0 && s.substr(i, 4) === " if ") ifIdx = i;
      else if (ifIdx >= 0 && s.substr(i, 6) === " else ") {
        elseIdx = i;
        break;
      }
    }
  }
  if (ifIdx >= 0 && elseIdx > ifIdx)
    return {
      t: s.slice(0, ifIdx).trim(),
      cond: s.slice(ifIdx + 4, elseIdx).trim(),
      f: s.slice(elseIdx + 6).trim(),
    };
  return null;
}

function nmcSplitLogic(s, op) {
  const tok = " " + op + " ";
  let depth = 0,
    inStr = "",
    idx = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && s.substr(i, tok.length) === tok) idx = i;
  }
  if (idx >= 0) return { a: s.slice(0, idx).trim(), b: s.slice(idx + tok.length).trim() };
  return null;
}

// test Jinja "X is [not] TEST" (none/defined/number/string) au niveau 0
function nmcSplitIs(s) {
  let depth = 0,
    inStr = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && s.substr(i, 4) === " is ") {
      let rest = s.slice(i + 4).trim(),
        neg = false;
      if (/^not\s+/.test(rest)) {
        neg = true;
        rest = rest.replace(/^not\s+/, "");
      }
      const test = rest.split(/\s+/, 1)[0].toLowerCase();
      return { val: s.slice(0, i).trim(), neg, test };
    }
  }
  return null;
}

function nmcSplitIn(s) {
  let depth = 0,
    inStr = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0) {
      if (s.substr(i, 8) === " not in ")
        return { val: s.slice(0, i).trim(), list: s.slice(i + 8).trim(), neg: true };
      if (s.substr(i, 4) === " in ")
        return { val: s.slice(0, i).trim(), list: s.slice(i + 4).trim(), neg: false };
    }
  }
  return null;
}

function nmcSplitCompare(s) {
  let depth = 0,
    inStr = "";
  const ops = ["==", "!=", ">=", "<=", ">", "<"];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = "";
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0) {
      for (const op of ops)
        if (s.substr(i, op.length) === op)
          return { a: s.slice(0, i), op, b: s.slice(i + op.length) };
    }
  }
  return null;
}

function nmcEvalArith(expr, hass, vars) {
  const toks = nmcTokenize(expr, hass, vars);
  if (!toks) return undefined;
  const out = [],
    ops = [],
    prec = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "**": 3 },
    rightAssoc = { "**": true };
  for (const t of toks) {
    if (typeof t === "number") out.push(t);
    else if (t === "(") ops.push(t);
    else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") out.push(ops.pop());
      ops.pop();
    } else {
      while (
        ops.length &&
        (rightAssoc[t] ? prec[ops[ops.length - 1]] > prec[t] : prec[ops[ops.length - 1]] >= prec[t])
      )
        out.push(ops.pop());
      ops.push(t);
    }
  }
  while (ops.length) out.push(ops.pop());
  const st = [];
  for (const t of out) {
    if (typeof t === "number") st.push(t);
    else {
      const b = st.pop(),
        a = st.pop();
      let r;
      if (t === "+") r = a + b;
      else if (t === "-") r = a - b;
      else if (t === "*") r = a * b;
      else if (t === "**") r = Math.pow(a, b);
      else if (t === "%") r = b === 0 ? 0 : a % b;
      else r = b === 0 ? 0 : a / b;
      st.push(isFinite(r) ? r : 0);
    }
  }
  return st.length === 1 ? st[0] : undefined;
}

// Fonctions mathematiques exposees aux expressions du body nmc (moteur maison).
// 1 arg sauf pow/atan2/hypot (2) et min/max (n). Garde-fous : domaine invalide -> 0.
const nmcMathFns = {
  log:   (a) => (a[1] ? Math.log(a[0]) / Math.log(a[1]) : (a[0] > 0 ? Math.log(a[0]) : 0)), // log(x) = ln ; log(x,b) = base b
  ln:    (a) => (a[0] > 0 ? Math.log(a[0]) : 0),
  log10: (a) => (a[0] > 0 ? Math.log10(a[0]) : 0),
  log2:  (a) => (a[0] > 0 ? Math.log2(a[0]) : 0),
  exp:   (a) => Math.exp(a[0]),
  sqrt:  (a) => Math.sqrt(Math.max(0, a[0])),
  abs:   (a) => Math.abs(a[0]),
  floor: (a) => Math.floor(a[0]),
  ceil:  (a) => Math.ceil(a[0]),
  round: (a) => (a[1] != null ? Math.round(a[0] * Math.pow(10, a[1])) / Math.pow(10, a[1]) : Math.round(a[0])),
  sin:   (a) => Math.sin(a[0]),
  cos:   (a) => Math.cos(a[0]),
  tan:   (a) => Math.tan(a[0]),
  pow:   (a) => Math.pow(a[0], a[1] == null ? 2 : a[1]),
  atan2: (a) => Math.atan2(a[0], a[1]),
  hypot: (a) => Math.hypot(a[0], a[1]),
  min:   (a) => (a.length ? Math.min.apply(null, a) : 0),
  max:   (a) => (a.length ? Math.max.apply(null, a) : 0),
};

function nmcTokenize(expr, hass, vars) {
  const toks = [];
  const re =
    /\s*(states\([^)]*\)|is_state\([^)]*\)|state_attr\([^)]*\)|as_timestamp\((?:[^()]|\([^()]*\))*\)|(?:log10|log2|log|ln|exp|sqrt|abs|floor|ceil|round|sin|cos|tan|pow|atan2|hypot|min|max)\((?:[^()]|\([^()]*\))*\)|[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*|-?\d+\.?\d*|\*\*|[()+\-*/%])/g;
  let m,
    last = 0;
  while ((m = re.exec(expr)) !== null) {
    if (m.index !== last && expr.slice(last, m.index).trim() !== "") return null;
    last = re.lastIndex;
    const tk = m[1];
    if (tk === "(" || tk === ")" || tk === "+" || tk === "*" || tk === "/" || tk === "**" || tk === "%") toks.push(tk);
    else if (tk === "-") {
      const prev = toks[toks.length - 1];
      if (
        toks.length === 0 ||
        prev === "(" ||
        prev === "+" ||
        prev === "-" ||
        prev === "*" ||
        prev === "/" ||
        prev === "**" ||
        prev === "%"
      )
        toks.push(0, "-");
      else toks.push("-");
    } else if (/^[a-zA-Z_]\w*\(/.test(tk) && (nmcMathFns[tk.slice(0, tk.indexOf("("))] || tk.startsWith("as_timestamp("))) {
      const fn = tk.slice(0, tk.indexOf("("));
      const inner = tk.slice(tk.indexOf("(") + 1, tk.lastIndexOf(")"));
      if (fn === "as_timestamp") {
        const value = nmcAtom(tk, hass, vars);
        toks.push(Number.isFinite(Number(value)) ? Number(value) : 0);
        continue;
      }
      const args = inner.trim() === "" ? [] : nmcSplitTop(inner, ",").map((a) => {
        // un argument peut lui-meme etre un appel (sqrt(pow(3,2))) : l'arithmetique
        // sait les evaluer, nmcEvalF non -> on tente l'arithmetique d'abord.
        const viaArith = nmcEvalArith(a, hass, vars);
        if (typeof viaArith === "number" && isFinite(viaArith)) return viaArith;
        const x = parseFloat(nmcEvalF(a, hass, vars));
        return isNaN(x) ? 0 : x;
      });
      let r = nmcMathFns[fn](args);
      toks.push(isFinite(r) ? r : 0);
    } else {
      const v = parseFloat(nmcAtom(tk, hass, vars));
      toks.push(isNaN(v) ? 0 : v);
    }
  }
  if (last < expr.length && expr.slice(last).trim() !== "") return null;
  return toks;
}

// ── filtres ──
function nmcParseFilterChain(filterStr) {
  const chain = [];
  for (let seg of nmcSplitTop(filterStr.replace(/^\s*\|/, ""), "|")) {
    seg = seg.trim();
    if (!seg) continue;
    const p = seg.indexOf("(");
    if (p < 0) {
      chain.push({ name: seg, args: [] });
      continue;
    }
    const name = seg.slice(0, p).trim();
    const argStr = seg.slice(p + 1, seg.lastIndexOf(")"));
    const args = argStr.trim() === "" ? [] : nmcSplitTop(argStr, ",").map((a) => a.trim());
    chain.push({ name, args });
  }
  return chain;
}
function nmcArgVal(a) {
  a = a.trim();
  const kw = a.match(/^(\w+)\s*=\s*([\s\S]+)$/);
  if (kw) return { key: kw[1], val: nmcArgVal(kw[2]).val };
  if (/^(true|false)$/i.test(a)) return { val: a.toLowerCase() === "true" };
  if (/^(none|null)$/i.test(a)) return { val: null };
  if (/^-?\d+(\.\d+)?$/.test(a)) return { val: parseFloat(a) };
  if (/^['"][\s\S]*['"]$/.test(a)) return { val: a.slice(1, -1) };
  return { val: a };
}
function nmcGetAttr(obj, attr) {
  if (obj == null) return undefined;
  if (String(attr).indexOf(".") >= 0) {
    let cur = obj;
    for (const seg of String(attr).split(".")) {
      if (cur == null) return undefined;
      cur = cur[seg];
    }
    return cur;
  }
  return obj[attr];
}
function nmcApplyFilters(val, filterStr, hass, vars) {
  if (!filterStr || !filterStr.trim()) return val;
  let r = val;
  for (const f of nmcParseFilterChain(filterStr)) {
    const a = f.args.map((x) => {
      const r0 = nmcArgVal(x);
      // identifiant nu non-quoté (ex: format(bias)) → résolu dans les vars du template
      const raw = String(x).trim();
      if (
        vars &&
        r0.key === undefined &&
        /^[a-zA-Z_]\w*(\.\w+)*$/.test(raw) &&
        !/^(true|false|none|null)$/i.test(raw) &&
        raw.split(".")[0] in vars
      ) {
        const resolved = nmcGetAttr(vars, raw);
        if (resolved !== undefined) return { val: resolved };
      }
      return r0;
    });
    const a0 = a[0] ? a[0].val : undefined;
    const kw = {};
    for (const x of a) if (x.key) kw[x.key] = x.val;
    switch (f.name) {
      case "round": {
        const n = parseInt(a0) || 0;
        const num = parseFloat(r);
        r = isNaN(num) ? r : num.toFixed(n);
        break;
      }
      case "float":
        r = parseFloat(r);
        if (isNaN(r)) r = a0 !== undefined ? a0 : 0;
        break;
      case "int":
        r = parseInt(r);
        if (isNaN(r)) r = a0 !== undefined ? a0 : 0;
        break;
      case "abs":
        r = Math.abs(parseFloat(r)) || 0;
        break;
      case "clamp": {
        const lo = a0 !== undefined ? parseFloat(a0) : NaN;
        const hi = a[1] ? parseFloat(a[1].val) : NaN;
        let n = parseFloat(r);
        if (isNaN(n)) n = 0;
        if (!isNaN(lo) && n < lo) n = lo;
        if (!isNaN(hi) && n > hi) n = hi;
        r = n;
        break;
      }
      case "format": {
        // '%+.1f'|format(v) — mini-printf : %s %d %i %x %X %f, flags +/-/0, largeur, .préc
        let ai = 0;
        r = String(r).replace(/%([+\-0 ]*)(\d+)?(?:\.(\d+))?([sdifxX%])/g, (m, fl, w, prec, conv) => {
          if (conv === "%") return "%";
          const arg = a[ai] !== undefined ? a[ai].val : undefined;
          ai++;
          if (arg === undefined) return m;
          let out2;
          if (conv === "s") out2 = nmcToStr(arg);
          else {
            let num = parseFloat(arg);
            if (isNaN(num)) num = 0;
            if (conv === "d" || conv === "i") out2 = String(Math.trunc(num));
            else if (conv === "x") out2 = Math.trunc(num).toString(16);
            else if (conv === "X") out2 = Math.trunc(num).toString(16).toUpperCase();
            else out2 = num.toFixed(prec !== undefined ? parseInt(prec) : 6);
            if (fl.includes("+") && num >= 0) out2 = "+" + out2;
          }
          const width = w ? parseInt(w) : 0;
          if (out2.length < width)
            out2 = fl.includes("-")
              ? out2.padEnd(width, " ")
              : out2.padStart(width, fl.includes("0") ? "0" : " ");
          return out2;
        });
        break;
      }
      case "zfill": {
        const width = parseInt(a0) || 0;
        const str = String(r);
        r = str.startsWith("-")
          ? "-" + str.slice(1).padStart(Math.max(0, width - 1), "0")
          : str.padStart(width, "0");
        break;
      }
      case "upper":
        r = String(r).toUpperCase();
        break;
      case "lower":
        r = String(r).toLowerCase();
        break;
      case "title":
        r = String(r).replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case "capitalize":
        r = String(r).charAt(0).toUpperCase() + String(r).slice(1).toLowerCase();
        break;
      case "trim":
        r = String(r).trim();
        break;
      case "string":
        r = nmcToStr(r);
        break;
      case "replace":
        r = String(r)
          .split(a0 != null ? String(a0) : "")
          .join(a[1] != null ? String(a[1].val) : "");
        break;
      case "truncate": {
        const n = parseInt(a0) || 80;
        const s = String(r);
        r = s.length > n ? s.slice(0, n) + (a[1] ? String(a[1].val) : "…") : s;
        break;
      }
      case "default":
        if (r === "" || r == null || r === "None" || r === "unknown" || r === "unavailable")
          r = a0 !== undefined ? a0 : "";
        break;
      case "length":
        r = Array.isArray(r) ? r.length : r == null ? 0 : String(r).length;
        break;
      case "thousands": {
        const sep = a0 !== undefined ? String(a0) : " ";
        const parts = String(r).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        r = parts.join(".");
        break;
      }
      case "first":
        r = Array.isArray(r) ? r[0] : String(r).charAt(0);
        break;
      case "last":
        r = Array.isArray(r) ? r[r.length - 1] : String(r).slice(-1);
        break;
      case "join":
        r = Array.isArray(r) ? r.map(nmcToStr).join(a0 != null ? String(a0) : "") : String(r);
        break;
      case "reverse":
        r = Array.isArray(r) ? r.slice().reverse() : String(r).split("").reverse().join("");
        break;
      case "sum": {
        if (Array.isArray(r)) {
          const at = kw.attribute;
          r = r.reduce((s, x) => s + (parseFloat(at ? nmcGetAttr(x, at) : x) || 0), 0);
        } else r = parseFloat(r) || 0;
        break;
      }
      case "min":
      case "max": {
        if (Array.isArray(r) && r.length) {
          const at = kw.attribute;
          const key = (x) => parseFloat(at ? nmcGetAttr(x, at) : x);
          r = r.reduce(
            (best, x) => ((f.name === "min" ? key(x) < key(best) : key(x) > key(best)) ? x : best),
            r[0]
          );
        }
        break;
      }
      case "sort": {
        if (Array.isArray(r)) {
          const at = kw.attribute;
          const rev = nmcTruthy(kw.reverse);
          r = r.slice().sort((x, y) => {
            let vx = at ? nmcGetAttr(x, at) : x,
              vy = at ? nmcGetAttr(y, at) : y;
            const nx = parseFloat(vx),
              ny = parseFloat(vy);
            let c = !isNaN(nx) && !isNaN(ny) ? nx - ny : String(vx).localeCompare(String(vy));
            return rev ? -c : c;
          });
        }
        break;
      }
      case "map": {
        if (Array.isArray(r) && kw.attribute) r = r.map((x) => nmcGetAttr(x, kw.attribute));
        break;
      }
      case "selectattr": {
        if (Array.isArray(r) && a0 != null) {
          const at = String(a0),
            op = a[1] ? String(a[1].val) : null,
            cmp = a[2] ? a[2].val : null;
          r = r.filter((x) => {
            const v = nmcGetAttr(x, at);
            if (op == null) return nmcTruthy(v);
            const nv = parseFloat(v),
              nc = parseFloat(cmp);
            switch (op) {
              case "equalto":
              case "eq":
                return !isNaN(nv) && !isNaN(nc) ? nv === nc : String(v) === String(cmp);
              case "ne":
                return !isNaN(nv) && !isNaN(nc) ? nv !== nc : String(v) !== String(cmp);
              case "gt":
                return nv > nc;
              case "ge":
                return nv >= nc;
              case "lt":
                return nv < nc;
              case "le":
                return nv <= nc;
              default:
                return nmcTruthy(v);
            }
          });
        }
        break;
      }
      case "list":
        r = Array.isArray(r) ? r : r == null || r === "" ? [] : [r];
        break;
    }
  }
  return r;
}

/* ══════════════════════════════════════════════════════════════════
 *  MARKDOWN → HTML (mode body.format = markdown)
 * ════════════════════════════════════════════════════════════════ */
const NMC_SENT_CODE = String.fromCharCode(0),
  NMC_SENT_ESC = String.fromCharCode(1);
function nmcMarkdown(src) {
  if (src == null) return "";
  const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const listStack = [];
  function closeLists(toIndent) {
    while (listStack.length && listStack[listStack.length - 1].indent >= toIndent)
      out.push("</" + listStack.pop().type + ">");
  }
  function inline(s) {
    const esc = [];
    s = s.replace(/\\([\\`*_~\[\]()#>!-])/g, (m, ch) => {
      esc.push(ch);
      return NMC_SENT_ESC + (esc.length - 1) + NMC_SENT_ESC;
    });
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (m, c) => {
      codes.push(c);
      return NMC_SENT_CODE + (codes.length - 1) + NMC_SENT_CODE;
    });
    s = s.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (m, alt, url) => '<img src="' + url + '" alt="' + alt + '">'
    );
    s = s.replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      (m, txt, url) => '<a href="' + url + '">' + txt + "</a>"
    );
    s = s
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/(^|[^_\w])_([^_\s][^_]*?)_(?![_\w])/g, "$1<em>$2</em>");
    s = s.replace(
      new RegExp(NMC_SENT_CODE + "(\\d+)" + NMC_SENT_CODE, "g"),
      (m, n) =>
        "<code>" +
        codes[+n].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +
        "</code>"
    );
    s = s.replace(new RegExp(NMC_SENT_ESC + "(\\d+)" + NMC_SENT_ESC, "g"), (m, n) => esc[+n]);
    return s;
  }
  while (i < lines.length) {
    const line = lines[i],
      trimmed = line.trim();
    if (/^\s*</.test(line)) {
      closeLists(-1);
      out.push(line);
      i++;
      continue;
    }
    if (trimmed === "") {
      closeLists(-1);
      i++;
      continue;
    }
    if (/^```/.test(trimmed)) {
      closeLists(-1);
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        '<code style="display:block;white-space:pre-wrap;">' +
          buf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          "</code>"
      );
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeLists(-1);
      out.push("<hr>");
      i++;
      continue;
    }
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists(-1);
      const lvl = Math.min(h[1].length, 4);
      out.push("<h" + lvl + ">" + inline(h[2]) + "</h" + lvl + ">");
      i++;
      continue;
    }
    const q = trimmed.match(/^>\s?(.*)$/);
    if (q) {
      closeLists(-1);
      out.push("<blockquote>" + inline(q[1]) + "</blockquote>");
      i++;
      continue;
    }
    const indent = line.match(/^(\s*)/)[1].length;
    const ul = trimmed.match(/^[-*+]\s+(.*)$/),
      ol = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      const type = ul ? "ul" : "ol",
        content = (ul || ol)[1];
      closeLists(indent + 1);
      if (!listStack.length || listStack[listStack.length - 1].indent < indent) {
        out.push("<" + type + ">");
        listStack.push({ type, indent });
      } else if (listStack[listStack.length - 1].type !== type) {
        out.push("</" + listStack.pop().type + ">");
        out.push("<" + type + ">");
        listStack.push({ type, indent });
      }
      out.push("<li>" + inline(content) + "</li>");
      i++;
      continue;
    }
    closeLists(-1);
    const para = [line];
    i++;
    while (i < lines.length) {
      const nt = lines[i].trim();
      if (
        nt === "" ||
        /^\s*</.test(lines[i]) ||
        /^(#{1,6})\s/.test(nt) ||
        /^>\s?/.test(nt) ||
        /^[-*+]\s/.test(nt) ||
        /^\d+\.\s/.test(nt) ||
        /^```/.test(nt) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(nt)
      )
        break;
      para.push(lines[i]);
      i++;
    }
    out.push("<p>" + para.map((l) => inline(l.replace(/ {2,}$/, "<br>"))).join(" ") + "</p>");
  }
  closeLists(-1);
  return out.join("\n");
}

/* ══════════════════════════════════════════════════════════════════
 *  HREF / SRC — validation
 * ════════════════════════════════════════════════════════════════ */
// v4.x : http:// toléré UNIQUEMENT vers une IP LAN privée (homelab sans TLS, ex Grafana
// :3000) — jamais vers un domaine public, pour ne pas rouvrir la porte à des liens non
// chiffrés génériques dans les cards markdown.
const NMC_LAN_HTTP_HOST_RE =
  /^http:\/\/(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|localhost)(:\d+)?(\/|$)/i;
function nmcSafeHref(raw) {
  if (raw == null) return { safe: false, external: false };
  const h = String(raw).trim();
  if (h === "") return { safe: false, external: false };
  const compact = h.replace(/[\x00-\x20]+/g, "").toLowerCase();
  if (/^(javascript|data|vbscript|file|blob|about):/.test(compact))
    return { safe: false, external: false };
  if (h[0] === "/" && h[1] !== "/") return { safe: true, external: false };
  if (h.startsWith("//")) return { safe: false, external: false };
  if (/^https:\/\//i.test(h)) return { safe: true, external: true };
  if (NMC_LAN_HTTP_HOST_RE.test(h)) return { safe: true, external: true };
  if (/^mailto:[^\s]+@[^\s]+$/i.test(h)) return { safe: true, external: true };
  if (/^(waze|google\.navigation|maps|app-id|homeassistant):/i.test(h))
    return { safe: true, external: true };
  return { safe: false, external: false };
}
function nmcSafeSrc(raw) {
  const src = raw == null ? "" : String(raw).trim();
  if (/^\/(local|api|www|media|brand)\//i.test(src))
    return { safe: true, external: false };
  if (src.startsWith("/")) return { safe: false, external: false };
  return nmcSafeHref(src);
}

/* ══════════════════════════════════════════════════════════════════
 *  SANITIZER (DOM) — body HTML
 * ════════════════════════════════════════════════════════════════ */
const NMC_ALLOWED_TAGS = new Set([
  "BR",
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "SMALL",
  "MARK",
  "CODE",
  "SPAN",
  "DIV",
  "HA-ICON",
  "DEL",
  "A",
  "IMG",
  "P",
  "HR",
  "BLOCKQUOTE",
  "H1",
  "H2",
  "H3",
  "H4",
  "UL",
  "OL",
  "LI",
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TD",
  "TH",
]);
const NMC_GLOBAL_ATTRS = new Set(["style", "class", "title", "aria-label", "role", "data-entity"]);
const NMC_TAG_ATTRS = {
  A: new Set(["href"]),
  IMG: new Set(["src", "alt", "width", "height", "loading"]),
  TD: new Set(["colspan", "rowspan"]),
  TH: new Set(["colspan", "rowspan", "scope"]),
};
const NMC_ALLOWED_SVG_TAGS = new Set([
  "svg",
  "g",
  "path",
  "polyline",
  "polygon",
  "line",
  "circle",
  "ellipse",
  "rect",
  "text",
  "tspan",
  "defs",
  "lineargradient",
  "radialgradient",
  "stop",
  "image",
  "clippath",
  // v4.1 : SMIL — animations natives SVG. Elles suivent les coordonnées du viewBox
  // (donc s'étirent avec la card, contrairement à offset-path CSS en px figés).
  // animateMotion+path = trajet courbe ; garde-fou : interdit d'animer href (cf sanitizer).
  "animate",
  "animatemotion",
  "animatetransform",
  "mpath",
]);
const NMC_ALLOWED_SVG_ATTRS = new Set([
  "d",
  "points",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "width",
  "height",
  "viewbox",
  "preserveaspectratio",
  "transform",
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "font-size",
  "font-family",
  "text-anchor",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientunits",
  "vector-effect",
  "style",
  "class",
  "dominant-baseline",
  "href",
  "xlink:href",
  "clip-path",
  "id",
  "data-entity",
  // v4.1 : attributs SMIL (+ pathLength pour normaliser les dash à 100)
  "pathlength",
  "attributename",
  "values",
  "dur",
  "begin",
  "end",
  "repeatcount",
  "keypoints",
  "keytimes",
  "keysplines",
  "calcmode",
  "rotate",
  "additive",
  "accumulate",
  "from",
  "to",
  "by",
  "path",
  "restart",
  "type",
]);
const NMC_SAFE_SVG_HREF_RE = /^\/(local|www|api)\//i;
const NMC_UNSAFE_STYLE_RE =
  /expression\s*\(|javascript\s*:|url\s*\(|@import|behavior\s*:|binding\s*:|moz-binding/i;
const NMC_SAFE_CSS_URL_RE = /url\(\s*(['"]?)\/(local|api|www|media|brand)\/[^)'"\s]+\1\s*\)/gi;

function nmcHasUnsafeStyle(styleStr) {
  return NMC_UNSAFE_STYLE_RE.test(styleStr.replace(NMC_SAFE_CSS_URL_RE, ""));
}

function nmcSanitizeStyle(styleStr) {
  if (!styleStr) return null;
  const clean = styleStr.replace(/\/\*[\s\S]*?\*\//g, "");
  const safeDeclarations = [];
  let start = 0,
    depth = 0,
    quote = "";
  const keep = (declaration) => {
    const colon = declaration.indexOf(":");
    if (colon < 1) return;
    const property = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    if (!/^(?:--[a-zA-Z_][\w-]*|[a-zA-Z][\w-]*)$/.test(property) || !value || nmcHasUnsafeStyle(value)) return;
    safeDeclarations.push(`${property}:${value}`);
  };
  for (let i = 0; i <= clean.length; i++) {
    const c = clean[i] || ";";
    if (quote) {
      if (c === quote && clean[i - 1] !== "\\") quote = "";
    } else if (c === "'" || c === '"') quote = c;
    else if (c === "(") depth++;
    else if (c === ")") depth = Math.max(0, depth - 1);
    else if (c === ";" && depth === 0) {
      keep(clean.slice(start, i));
      start = i + 1;
    }
  }
  return safeDeclarations.join(";");
}

// <style> dans le body : on NE garde QUE les @keyframes sûrs (aucun sélecteur normal
// → impossible de restyler l'app ; URLs externes, js/@import/expression rejetés).
// Permet de déclarer des animations custom directement dans le body, sans toucher au .js.
function nmcExtractKeyframes(css) {
  if (!css) return "";
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /@(?:-webkit-|-moz-)?keyframes\s+[A-Za-z_][\w-]*\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(clean)) !== null) {
    if (!nmcHasUnsafeStyle(m[0])) out.push(m[0]);
  }
  return out.join("\n");
}

// ── morph DOM partiel ──
// Remplacer innerHTML à chaque update hass RESETTE toutes les animations (SMIL animateTransform,
// keyframes CSS) : turbines/radars "sautent" dès qu'une valeur change ailleurs (cas vécu BATTLESTATION).
// On patche l'ancien arbre en place : même structure -> maj attributs+texte seulement (élément préservé,
// l'animation continue) ; structure différente ({% if %}/{% for %} qui bascule) -> reset LOCAL du sous-arbre.
function nmcMorphNode(from, to) {
  for (let i = from.attributes.length - 1; i >= 0; i--) {
    const n = from.attributes[i].name;
    if (!to.hasAttribute(n)) from.removeAttribute(n);
  }
  for (let i = 0; i < to.attributes.length; i++) {
    const a = to.attributes[i];
    if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
  }
  nmcMorphChildren(from, to);
}
function nmcMorphChildren(from, to) {
  const fc = from.childNodes,
    tc = to.childNodes;
  if (fc.length !== tc.length) {
    from.innerHTML = "";
    while (to.firstChild) from.appendChild(to.firstChild);
    return;
  }
  for (let i = 0; i < fc.length; i++) {
    const f = fc[i],
      t = tc[i];
    if (f.nodeType !== t.nodeType || (f.nodeType === 1 && f.tagName !== t.tagName)) {
      from.replaceChild(t.cloneNode(true), f);
    } else if (f.nodeType === 1) {
      nmcMorphNode(f, t);
    } else if (f.nodeValue !== t.nodeValue) {
      f.nodeValue = t.nodeValue;
    }
  }
}

function nmcSanitizeBody(raw) {
  if (raw == null) return "";
  let html = String(raw).replace(/\[mdi:([a-zA-Z0-9_-]+)\]/g, '<ha-icon icon="mdi:$1"></ha-icon>');
  if (!html.includes("<")) return html;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((el) => {
    const tn = el.tagName,
      tnLower = tn.toLowerCase();
    // <style> : conserver uniquement les @keyframes sûrs (déclaration d'animations custom)
    if (tn === "STYLE") {
      // v4.0 : CSS complet conservé (classes, @container, @media…) — le shadow DOM de la
      // card le scope. Fallback keyframes-only si motif dangereux détecté.
      const css = el.textContent || "";
      const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
      if (nmcHasUnsafeStyle(clean) || /@import|@font-face|@namespace|@charset|<\//i.test(clean)) {
        const kf = nmcExtractKeyframes(css);
        if (kf) el.textContent = kf;
        else el.remove();
      }
      return;
    }
    const isSvg = NMC_ALLOWED_SVG_TAGS.has(tnLower);
    if (!NMC_ALLOWED_TAGS.has(tn) && !isSvg) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
      }
      return;
    }
    if (tn === "HA-ICON") {
      const icon = el.getAttribute("icon") || "";
      if (!icon.match(/^mdi:[a-zA-Z0-9_-]+$/)) {
        el.replaceWith(document.createTextNode(""));
        return;
      }
      [...el.attributes].forEach((a) => {
        if (a.name !== "icon" && a.name !== "style") el.removeAttribute(a.name);
      });
      const st = el.getAttribute("style");
      if (st) {
        const safe = nmcSanitizeStyle(st);
        if (safe) el.setAttribute("style", safe);
        else el.removeAttribute("style");
      }
      return;
    }
    if (isSvg) {
      // v4.1 SMIL : ne JAMAIS animer un attribut de référence (href → détournement
      // d'URL après sanitization) ni un handler.
      if (tnLower.startsWith("animate") || tnLower === "set") {
        const target = (el.getAttribute("attributeName") || "").toLowerCase();
        if (target === "href" || target === "xlink:href" || target.startsWith("on")) {
          el.remove();
          return;
        }
      }
      [...el.attributes].forEach((a) => {
        const an = a.name.toLowerCase();
        if (an.startsWith("on")) {
          el.removeAttribute(a.name);
          return;
        }
        if (!NMC_ALLOWED_SVG_ATTRS.has(an)) {
          el.removeAttribute(a.name);
          return;
        }
        if (an === "href" || an === "xlink:href") {
          // v4.1 : référence fragment (#id) autorisée — nécessaire pour <mpath>
          const v = a.value.trim();
          if (!NMC_SAFE_SVG_HREF_RE.test(v) && !/^#[A-Za-z_][\w-]*$/.test(v)) {
            el.removeAttribute(a.name);
            return;
          }
        }
        if (an === "data-entity" && !/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(a.value.trim())) {
          el.removeAttribute(a.name);
          return;
        }
        if (a.name === "style") {
          const safe = nmcSanitizeStyle(a.value);
          if (safe) el.setAttribute("style", safe);
          else el.removeAttribute("style");
        }
      });
      return;
    }
    // HTML : politique par tag
    const tagAttrs = NMC_TAG_ATTRS[tn];
    let anchorExternal = false,
      anchorOk = false;
    [...el.attributes].forEach((a) => {
      const name = a.name.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(a.name);
        return;
      }
      const allowed = NMC_GLOBAL_ATTRS.has(name) || (tagAttrs && tagAttrs.has(name));
      if (!allowed) {
        el.removeAttribute(a.name);
        return;
      }
      if (name === "data-entity" && !/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(a.value.trim())) {
        el.removeAttribute(a.name);
        return;
      }
      if (tn === "A" && name === "href") {
        const r = nmcSafeHref(a.value);
        if (!r.safe) {
          el.removeAttribute(a.name);
          return;
        }
        anchorOk = true;
        anchorExternal = r.external;
        return;
      }
      if (tn === "IMG" && name === "src") {
        const r = nmcSafeSrc(a.value);
        if (!r.safe) {
          el.removeAttribute(a.name);
          return;
        }
        return;
      }
      if (name === "style") {
        const safe = nmcSanitizeStyle(a.value);
        if (safe) el.setAttribute("style", safe);
        else el.removeAttribute("style");
        return;
      }
    });
    // A : forcer target/rel selon external, ou neutraliser si href invalide
    if (tn === "A") {
      el.removeAttribute("target");
      el.removeAttribute("rel");
      if (anchorOk && anchorExternal) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      if (!anchorOk) {
        el.removeAttribute("href");
      }
    }
  });
  return tpl.innerHTML;
}

// ── config normalizer ────────────────────────────────────────────
function nmcBuildConfig(raw) {
  const r = raw || {};
  const title = {
    text: r.title?.text ?? "",
    font_size: r.title?.font_size ?? 24,
    font_weight: r.title?.font_weight ?? 600,
    color: r.title?.color ?? null,
    icon: r.title?.icon ?? r.icon ?? null,
    icon_position: r.title?.icon_position ?? r.icon_position ?? "left",
    icon_color: r.title?.icon_color ?? null,
    icon_size: r.title?.icon_size ?? null,
    font_family: r.title?.font_family ?? r.shared?.font_family ?? null,
    uppercase: r.title?.uppercase ?? false,
    italic: r.title?.italic ?? false,
    letter_spacing: r.title?.letter_spacing ?? 0,
    glow: r.title?.glow ?? false,
    glow_color: r.title?.glow_color ?? null,
    glow_size: r.title?.glow_size ?? 12,
    gradient: r.title?.gradient ?? false,
    gradient_from: r.title?.gradient_from ?? null,
    gradient_to: r.title?.gradient_to ?? null,
    scanline: NMC_IS_LOW_POWER ? false : (r.title?.scanline ?? false),
    flicker: NMC_IS_LOW_POWER ? false : (r.title?.flicker ?? false),
    hover_glitch: NMC_IS_LOW_POWER ? false : (r.title?.hover_glitch ?? false),
    text_shadow: r.title?.text_shadow ?? null,
  };
  const body = {
    content: r.body?.content ?? r.subtitle?.text ?? "", // rétro-compat : accepte subtitle.text de v2
    format: r.body?.format ?? "html",
    font_size: r.body?.font_size ?? 13,
    color: r.body?.color ?? null,
    font_family: r.body?.font_family ?? r.shared?.font_family ?? null,
  };
  const shared = {
    padding: r.shared?.padding ?? "8px 16px",
    bg_color: r.shared?.bg_color ?? null,
    bg_opacity: r.shared?.bg_opacity ?? null,
    bg_blur: r.shared?.bg_blur ?? false,
    border_color: r.shared?.border_color ?? null,
    border_width: r.shared?.border_width ?? null,
    border_style: r.shared?.border_style ?? "solid",
    border_radius: r.shared?.border_radius ?? null,
    align_h: r.shared?.align_h ?? "left",
    align_v: r.shared?.align_v ?? "center",
    tap_action: r.shared?.tap_action ?? "none",
    navigation_path: r.shared?.navigation_path ?? null,
    entity: r.shared?.entity ?? null,
  };
  // mode : title|body|both (rétro-compat v2 : subtitle→body, mode both/subtitle)
  let mode = r.mode ?? "both";
  if (mode === "subtitle") mode = "body";
  const debug = r.debug ?? false;
  const history = Array.isArray(r.history)
    ? r.history
        .filter((h) => h && typeof h.entity === "string")
        .map((h) => ({ entity: h.entity, hours: parseFloat(h.hours) || 24 }))
    : [];
  return { mode, title, body, shared, debug, history };
}

function nmcCollectDependencies(config) {
  const ids = new Set();
  let dynamic = false;
  const scan = (text) => {
    if (typeof text !== "string") return;
    const aliases = {};
    const aliasRe = /\{%\s*set\s+([a-zA-Z_]\w*)\s*=\s*['"]([^'"]+)['"]\s*%\}/g;
    let aliasMatch;
    while ((aliasMatch = aliasRe.exec(text)) !== null) aliases[aliasMatch[1]] = aliasMatch[2];
    const calls = text.match(/\b(?:states|is_state|state_attr)\s*\(/g) || [];
    const entityRe = /\b(?:states|is_state|state_attr)\(\s*([^,)\s]+)/g;
    let m;
    while ((m = entityRe.exec(text)) !== null) {
      const unquoted = m[1].replace(/^['"]|['"]$/g, "");
      ids.add(aliases[unquoted] || unquoted);
    }
    const unresolved = [...ids].some((entity) => !/^[-a-zA-Z0-9_]+\.[-a-zA-Z0-9_]+$/.test(entity));
    if (calls.length && unresolved) dynamic = true;
  };
  scan(config?.title?.text);
  scan(config?.body?.content);
  return { ids, dynamic };
}

function nmcDependenciesChanged(info, previousHass, nextHass) {
  if (!previousHass || info?.dynamic) return true;
  for (const entity of info?.ids || []) {
    if (previousHass.states?.[entity] !== nextHass.states?.[entity]) return true;
  }
  return false;
}

function nmcRnd(min, max, dec = 2) {
  return +(Math.random() * (max - min) + min).toFixed(dec);
}

/* ══════════════════════════════════════════════════════════════════
 *  ÉDITEUR
 * ════════════════════════════════════════════════════════════════ */
class NeonMarkdownCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._built = false;
    this._tab = "title";
    this._listeners = [];
  }
  setConfig(c) {
    this._config = c;
    if (this._built) {
      const modeChanged = c?.mode !== this._lastMode;
      if (modeChanged) this._rebuild();
      else this._sync();
    } else if (this._hass) {
      this._built = true;
      this._build();
    }
    this._lastMode = c?.mode;
  }
  set hass(h) {
    this._hass = h;
    if (!this._built && this._config) {
      this._built = true;
      this._build();
    }
  }
  disconnectedCallback() {
    this._teardown();
  }
  _teardown() {
    this._listeners.forEach(({ el, ev, fn }) => el.removeEventListener(ev, fn));
    this._listeners = [];
    this._built = false;
  }
  _rebuild() {
    this._teardown();
    this._built = true;
    this._build();
  }
  _on(el, ev, fn) {
    el.addEventListener(ev, fn);
    this._listeners.push({ el, ev, fn });
  }
  _fire() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
  _set(section, key, value) {
    const cur = this._config[section];
    const base = cur && typeof cur === "object" && !Array.isArray(cur) ? cur : {};
    this._config = { ...this._config, [section]: { ...base, [key]: value } };
    this._fire();
  }
  _setRoot(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }
  _get(section, key) {
    const s = this._config?.[section];
    if (typeof s === "string") return key === "text" ? s : "";
    return s?.[key] ?? "";
  }

  _build() {
    this.innerHTML = `
      <style>
        :host { display:block; padding:4px 0; }
        h3 { font-size:11px; font-weight:700; color:var(--primary-color); text-transform:uppercase; letter-spacing:1.5px; margin:16px 0 8px; padding-bottom:4px; border-bottom:1px solid var(--divider-color); }
        .tabs { display:flex; gap:4px; margin-bottom:16px; }
        .tab-btn { flex:1; padding:6px 0; border:1px solid var(--divider-color); border-radius:6px; background:transparent; color:var(--primary-text-color); font-size:12px; cursor:pointer; transition:all .2s; text-align:center; user-select:none; }
        .tab-btn.active { background:var(--primary-color); color:#fff; border-color:var(--primary-color); }
        .field { margin-bottom:10px; }
        label { display:block; font-size:11px; color:var(--secondary-text-color); margin-bottom:3px; }
        input[type=text],input[type=number],select,textarea { width:100%; box-sizing:border-box; padding:6px 8px; border-radius:6px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); font-size:12px; }
        textarea { resize:vertical; min-height:48px; font-family:'Share Tech Mono',monospace; }
        textarea.body { min-height:160px; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .color-row { display:flex; gap:6px; align-items:center; }
        .color-row input[type=color] { width:36px; height:32px; padding:2px; border-radius:4px; flex-shrink:0; }
        .color-row input[type=text] { flex:1; }
        .toggle-field { display:flex; justify-content:space-between; align-items:center; }
        .switch { position:relative; display:inline-block; width:36px; height:20px; }
        .switch input { opacity:0; width:0; height:0; }
        .slider { position:absolute; inset:0; background:#ccc; border-radius:20px; cursor:pointer; transition:.3s; }
        .slider:before { content:''; position:absolute; width:14px; height:14px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:.3s; }
        input:checked + .slider { background:var(--primary-color); }
        input:checked + .slider:before { transform:translateX(16px); }
        .hint { font-size:10px; color:var(--disabled-text-color); margin:2px 0 0; }
        .section-hidden { display:none; }
      </style>
      <div class="tabs">
        <div class="tab-btn ${this._tab === "title" ? "active" : ""}" data-tab="title">Titre</div>
        <div class="tab-btn ${this._tab === "body" ? "active" : ""}" data-tab="body">Corps</div>
        <div class="tab-btn ${this._tab === "shared" ? "active" : ""}" data-tab="shared">Commun</div>
      </div>
      <div class="field"><label>Mode d'affichage</label>
        <select data-root="mode">
          <option value="title" ${(this._config?.mode ?? "both") === "title" ? "selected" : ""}>Titre seul</option>
          <option value="body" ${(this._config?.mode ?? "both") === "body" ? "selected" : ""}>Corps seul</option>
          <option value="both" ${(this._config?.mode ?? "both") === "both" ? "selected" : ""}>Titre + Corps</option>
        </select></div>
      <div id="tab-title" class="${this._tab === "title" ? "" : "section-hidden"}">${this._titleTab()}</div>
      <div id="tab-body" class="${this._tab === "body" ? "" : "section-hidden"}">${this._bodyTab()}</div>
      <div id="tab-shared" class="${this._tab === "shared" ? "" : "section-hidden"}">${this._sharedTab()}</div>
    `;
    this._attach();
  }
  _titleTab() {
    return `
      <h3>Texte</h3>
      ${this._textarea("Titre", "title", "text", 'Mon Dashboard — templates {{ states("entity") }} supportés')}
      ${this._input("Icône", "title", "icon", "text", "mdi:home")}
      ${this._select("Position icône", "title", "icon_position", [
        ["left", "Gauche"],
        ["right", "Droite"],
        ["top", "Dessus"],
      ])}
      <h3>Typographie</h3>
      ${this._fontSelect("Police", "title", "font_family")}
      <div class="row2">${this._px("Taille", "title", "font_size", "24")}${this._px("Épaisseur", "title", "font_weight", "600")}</div>
      <div class="row2">${this._toggle("Majuscules", "title", "uppercase")}${this._toggle("Italique", "title", "italic")}</div>
      ${this._px("Espacement", "title", "letter_spacing", "0")}
      <h3>Couleurs</h3>
      ${this._color("Couleur texte", "title", "color", "#ffffff")}
      ${this._color("Couleur icône", "title", "icon_color", "#ffffff")}
      <h3>Effets</h3>
      <div class="row2">${this._toggle("Glow", "title", "glow")}${this._toggle("Gradient", "title", "gradient")}</div>
      ${this._color("Couleur glow", "title", "glow_color", "#00fff9")}
      ${this._px("Taille glow", "title", "glow_size", "12")}
      ${this._color("Gradient début", "title", "gradient_from", "#00E8FF")}
      ${this._color("Gradient fin", "title", "gradient_to", "#FF50A0")}
      <div class="row2">${this._toggle("Flicker", "title", "flicker")}${this._toggle("Scanline CRT", "title", "scanline")}</div>
      ${this._toggle("Hover Glitch", "title", "hover_glitch")}
    `;
  }
  _bodyTab() {
    return `
      <h3>Contenu</h3>
      ${this._select("Format", "body", "format", [
        ["html", "HTML / Jinja"],
        ["markdown", "Markdown"],
      ])}
      <p class="hint">HTML : blocs néon (div/span/svg/gradients). Markdown : **gras** [lien](url) # titre - liste. Les deux acceptent {% for %}, {% if %}, {{ states() }}, filtres |sort/map/join/format/clamp… + &lt;style&gt; scopé, data-entity → more-info</p>
      ${this._textarea("Corps", "body", "content", '{% for a in state_attr("sensor.x","attackers")|sort(attribute="score",reverse=true) %}...{% endfor %}', "body")}
      <h3>Typographie</h3>
      ${this._fontSelect("Police", "body", "font_family")}
      ${this._px("Taille", "body", "font_size", "13")}
      ${this._color("Couleur texte", "body", "color", "#888888")}
    `;
  }
  _sharedTab() {
    return `
      <h3>Police globale</h3>${this._fontSelect("Police", "shared", "font_family")}
      <h3>Mise en page</h3>${this._padding()}
      ${this._select("Alignement H", "shared", "align_h", [
        ["left", "Gauche"],
        ["center", "Centre"],
        ["right", "Droite"],
      ])}
      ${this._select("Alignement V", "shared", "align_v", [
        ["top", "Haut"],
        ["center", "Centre"],
        ["bottom", "Bas"],
      ])}
      <h3>Fond</h3>
      ${this._color("Couleur fond", "shared", "bg_color", "#1a1a2e")}
      ${this._number("Opacité fond (0–1)", "shared", "bg_opacity", "0", "1", "0.05")}
      ${this._toggle("Flou fond", "shared", "bg_blur")}
      <h3>Bordure</h3>
      ${this._color("Couleur bordure", "shared", "border_color", "#444444")}
      <div class="row2">${this._px("Épaisseur", "shared", "border_width", "1")}${this._px("Radius", "shared", "border_radius", "12")}</div>
      ${this._select("Style", "shared", "border_style", [
        ["solid", "Solide"],
        ["dashed", "Tirets"],
        ["dotted", "Points"],
        ["none", "Aucun"],
      ])}
      <h3>Interaction</h3>
      ${this._select("Action au tap", "shared", "tap_action", [
        ["none", "Aucune"],
        ["navigate", "Navigation"],
        ["more-info", "Plus d’info"],
      ])}
      ${this._input("Chemin navigation", "shared", "navigation_path", "text", "/lovelace/0")}
      ${this._input("Entité (more-info)", "shared", "entity", "text", "light.salon")}
    `;
  }
  _input(l, s, k, type = "text", ph = "") {
    return `<div class="field"><label>${l}</label><input type="${type}" data-section="${s}" data-key="${k}" value="${this._get(s, k)}" placeholder="${ph}"/></div>`;
  }
  _textarea(l, s, k, ph = "", cls = "") {
    return `<div class="field"><label>${l}</label><textarea class="${cls}" data-section="${s}" data-key="${k}" placeholder="${ph}">${this._get(s, k)}</textarea></div>`;
  }
  _px(l, s, k, d = "") {
    const raw = this._get(s, k);
    const num = parseFloat(raw);
    return `<div class="field"><label>${l}</label><div style="display:flex;gap:4px;align-items:center"><input type="number" data-section="${s}" data-key="${k}" data-px="1" value="${isNaN(num) ? "" : num}" placeholder="${d}" min="0" step="1" style="flex:1"/><span style="font-size:11px;color:var(--secondary-text-color)">px</span></div></div>`;
  }
  _select(l, s, k, opts) {
    const v = this._get(s, k);
    return `<div class="field"><label>${l}</label><select data-section="${s}" data-key="${k}">${opts.map(([val, lbl]) => `<option value="${val}" ${String(v) === String(val) ? "selected" : ""}>${lbl}</option>`).join("")}</select></div>`;
  }
  _toggle(l, s, k) {
    const v = !!this._get(s, k);
    return `<div class="field toggle-field"><label>${l}</label><label class="switch"><input type="checkbox" data-section="${s}" data-key="${k}" ${v ? "checked" : ""}/><span class="slider"></span></label></div>`;
  }
  _color(l, s, k, d = "#ffffff") {
    const v = this._get(s, k) || "";
    return `<div class="field"><label>${l}</label><div class="color-row"><input type="color" data-section="${s}" data-key="${k}" value="${v || d}" ${!v ? 'style="opacity:0.4"' : ""}/><input type="text" data-section="${s}" data-key="${k}" value="${v}" placeholder="var(--primary-color) ou #hex"/></div></div>`;
  }
  _number(l, s, k, mn = "0", mx = "100", st = "1") {
    return `<div class="field"><label>${l}</label><input type="number" data-section="${s}" data-key="${k}" value="${this._get(s, k)}" min="${mn}" max="${mx}" step="${st}"/></div>`;
  }
  _fontSelect(l, s, k) {
    const v = this._get(s, k);
    return `<div class="field"><label>${l}</label><select data-section="${s}" data-key="${k}"><option value="" ${!v ? "selected" : ""}>— thème HA —</option>${NMC_FONTS.map((f) => `<option value="${f}" ${v === f ? "selected" : ""}>${f}</option>`).join("")}</select></div>`;
  }
  _padding() {
    const raw = this._get("shared", "padding") || "8px 16px";
    const parts = String(raw).replace(/px/g, "").trim().split(/\s+/);
    const v = parseFloat(parts[0]) || 8;
    const h = parseFloat(parts[1] ?? parts[0]) || 16;
    return `<div class="field"><label>Padding</label><div style="display:flex;gap:6px;align-items:center"><input type="number" data-padding="v" value="${v}" min="0" step="1" style="flex:1"/><span style="font-size:11px;color:var(--secondary-text-color)">px ↕</span><input type="number" data-padding="h" value="${h}" min="0" step="1" style="flex:1"/><span style="font-size:11px;color:var(--secondary-text-color)">px ↔</span></div></div>`;
  }
  _attach() {
    this._on(this, "click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      this._tab = btn.dataset.tab;
      this.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
      ["title", "body", "shared"].forEach((t) => {
        const el = this.querySelector(`#tab-${t}`);
        if (el) el.classList.toggle("section-hidden", t !== this._tab);
      });
    });
    const modeEl = this.querySelector('[data-root="mode"]');
    if (modeEl) this._on(modeEl, "change", (e) => this._setRoot("mode", e.target.value));
    this.querySelectorAll("[data-padding]").forEach((inp) =>
      this._on(inp, "input", () => {
        const v = parseFloat(this.querySelector('[data-padding="v"]')?.value) || 0;
        const h = parseFloat(this.querySelector('[data-padding="h"]')?.value) || 0;
        this._set("shared", "padding", `${v}px ${h}px`);
      })
    );
    this.querySelectorAll("[data-section][data-key]").forEach((inp) => {
      const section = inp.dataset.section,
        key = inp.dataset.key,
        isPx = inp.dataset.px === "1";
      const isSelect = inp.tagName === "SELECT",
        isCheckbox = inp.type === "checkbox",
        isNumber = inp.type === "number" && !isPx;
      const ev = isCheckbox || isSelect ? "change" : "input";
      this._on(inp, ev, () => {
        let val;
        if (isCheckbox) val = inp.checked;
        else if (isPx) val = inp.value !== "" ? `${inp.value}px` : null;
        else if (isNumber) val = inp.value !== "" ? parseFloat(inp.value) : null;
        else val = inp.value || null;
        this._set(section, key, val);
      });
    });
  }
  _sync() {
    this.querySelectorAll("[data-section][data-key]").forEach((inp) => {
      if (document.activeElement === inp) return;
      const v = this._get(inp.dataset.section, inp.dataset.key);
      if (inp.type === "checkbox") inp.checked = !!v;
      else {
        const nv = v ?? "";
        if (inp.type === "number" || inp.dataset.px === "1") {
          const cur = parseFloat(inp.value),
            nxt = parseFloat(nv);
          if (!isNaN(cur) && !isNaN(nxt) && cur === nxt) return;
          if (inp.value === "" && nv === "") return;
        }
        if (inp.value !== String(nv)) inp.value = nv;
      }
    });
    const modeEl = this.querySelector('[data-root="mode"]');
    if (modeEl && document.activeElement !== modeEl) modeEl.value = this._config?.mode ?? "both";
  }
}
customElements.define("neon-markdown-card-editor", NeonMarkdownCardEditor);

/* ══════════════════════════════════════════════════════════════════
 *  CARD
 * ════════════════════════════════════════════════════════════════ */
class NeonMarkdownCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._rendered = false;
    this._rafId = null;
    this._ro = null;
    this._ac = null;
    this._renderKey = null;
    this._flickDur = nmcRnd(3.5, 5.5);
    this._flickOff = nmcRnd(-2, 0);
    this._scanDur = nmcRnd(6, 10);
    this._histVars = null;
    this._histLast = 0;
    this._histBusy = false;
    this._histGeneration = 0;
    this._dependencyInfo = { ids: new Set(), dynamic: true };
    this._lastHass = null;
    this._forceUpdate = true;
  }
  static getConfigElement() {
    return document.createElement("neon-markdown-card-editor");
  }
  static getStubConfig() {
    return {
      mode: "both",
      title: { text: "CYBER_PI", icon: "mdi:shield-lock" },
      body: {
        format: "html",
        content: '<div style="color:#39FF9E">Body {{ states("sun.sun") }}</div>',
      },
      shared: {},
    };
  }

  setConfig(raw) {
    const newConfig = nmcBuildConfig(raw);
    const newKey = JSON.stringify(newConfig);
    if (newKey === this._renderKey) return;
    const oldHistoryKey = JSON.stringify(this._config?.history || []);
    const newHistoryKey = JSON.stringify(newConfig.history || []);
    if (oldHistoryKey !== newHistoryKey) {
      this._histGeneration++;
      this._histVars = null;
      this._histLast = 0;
      this._histBusy = false;
    }
    this._config = newConfig;
    this._dependencyInfo = nmcCollectDependencies(newConfig);
    this._forceUpdate = true;
    this._renderKey = newKey;
    this._rendered = false;
    if (this._hass && this.isConnected) {
      this._cleanup();
      this._render();
      this._forceUpdate = false;
    }
  }
  set hass(h) {
    const shouldUpdate = this._forceUpdate || nmcDependenciesChanged(this._dependencyInfo, this._lastHass, h);
    this._hass = h;
    this._lastHass = h;
    if (!this._config) return;
    this._ensureHistory();
    const hasCard = !!this.shadowRoot.querySelector("ha-card.nmc-card");
    const hasStyle = !!this.shadowRoot.querySelector("#nmc-style");
    if (!hasCard || !hasStyle) {
      this._cleanup();
      this._render();
      this._forceUpdate = false;
      return;
    } // FIX leak : cleanup avant re-render
    if (!shouldUpdate) return;
    this._forceUpdate = false;
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._updateBody();
    });
  }
  getCardSize() {
    const m = this._config?.mode ?? "both";
    return m === "title" ? 1 : 2;
  }

  _cleanup() {
    if (this._ac) {
      this._ac.abort();
      this._ac = null;
    }
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
  }
  connectedCallback() {
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card.nmc-card");
    if (card && this._rendered) {
      this._reattach(card);
      if (this._hass) this._updateBody();
    } else if (this._config && this._hass) {
      this._render();
      this._forceUpdate = false;
    }
  }
  disconnectedCallback() {
    this._cleanup();
  }

  _loadFont(f) {
    nmcLoadFont(f);
  }
  _navigate(p) {
    window.history.pushState(null, "", p);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  _moreInfo(e) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId: e }, bubbles: true, composed: true })
    );
  }

  _updateBody() {
    if (!this.shadowRoot || !this._config) return;
    const c = this._config,
      mode = c.mode;
    const errs = c.debug ? [] : null;
    if (mode === "title" || mode === "both") {
      const el = this.shadowRoot.querySelector(".nmc-title");
      if (el)
        el.textContent =
          nmcParseTemplate(this._hass, c.title.text, { hist: this._histVars || {} }, errs) || "";
    }
    if (mode === "body" || mode === "both") {
      const el = this.shadowRoot.querySelector(".nmc-body");
      if (el) {
        let rendered =
          nmcParseTemplate(this._hass, c.body.content, { hist: this._histVars || {} }, errs) || "";
        if (c.body.format === "markdown") rendered = nmcMarkdown(rendered);
        let html = nmcSanitizeBody(rendered);
        if (errs && errs.length) {
          const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const uniq = [...new Set(errs)].slice(0, 12);
          html +=
            '<div style="margin-top:8px;padding:6px 8px;border:1px solid rgba(255,59,48,.6);background:rgba(255,59,48,.08);font-family:monospace;font-size:11px;line-height:1.5;color:#FF6B61;">⚠ nmc debug — ' +
            uniq.length +
            " erreur(s)<br>" +
            uniq.map(esc).join("<br>") +
            "</div>";
        }
        if (el.innerHTML !== html) {
          // morph partiel au lieu d'un remplacement innerHTML : les éléments animés survivent
          const tpl = document.createElement("template");
          tpl.innerHTML = html;
          nmcMorphChildren(el, tpl.content);
        }
      }
    }
  }

  _ensureHistory() {
    const list = this._config?.history;
    if (!list || !list.length || !this._hass || this._histBusy) return;
    if (Date.now() - this._histLast < 5 * 60 * 1000) return; // refresh ~5 min max
    this._histBusy = true;
    this._histLast = Date.now();
    const generation = this._histGeneration;
    const out = {};
    Promise.all(
      list.map(async (hc) => {
        try {
          const t1 = Date.now(),
            t0 = t1 - hc.hours * 3600 * 1000;
          const path =
            `history/period/${new Date(t0).toISOString()}?filter_entity_id=${encodeURIComponent(hc.entity)}` +
            `&minimal_response&no_attributes&significant_changes_only`;
          const res = await this._hass.callApi("GET", path);
          let pts = ((res && res[0]) || [])
            .map((row) => ({
              v: parseFloat(row.state ?? row.s),
              t: Date.parse(row.last_changed || row.last_updated || row.lu || 0),
            }))
            .filter((p) => !isNaN(p.v) && p.t >= t0);
          if (pts.length > 240) {
            const stride = Math.ceil(pts.length / 240);
            pts = pts.filter((_, idx) => idx % stride === 0);
          }
          if (!pts.length) return;
          let mn = Infinity,
            mx = -Infinity;
          for (const p of pts) {
            if (p.v < mn) mn = p.v;
            if (p.v > mx) mx = p.v;
          }
          const span = mx - mn || 1;
          const coords = pts
            .map(
              (p) =>
                `${(((p.t - t0) / (t1 - t0)) * 100).toFixed(1)},${(30 - ((p.v - mn) / span) * 30).toFixed(1)}`
            )
            .join(" ");
          out[hc.entity] = {
            pts: coords,
            min: mn,
            max: mx,
            first: pts[0].v,
            last: pts[pts.length - 1].v,
            n: pts.length,
            hours: hc.hours,
          };
        } catch (e) {
          if (this._config?.debug) console.warn("nmc history", hc.entity, e);
        }
      })
    ).then(() => {
      if (generation !== this._histGeneration) return;
      this._histBusy = false;
      this._histVars = out;
      if (this.isConnected && this.shadowRoot) this._updateBody();
    });
  }

  _render() {
    if (!this._config) return;
    const c = this._config,
      t = c.title,
      b = c.body,
      sh = c.shared,
      mode = c.mode;
    const showTitle = mode === "title" || mode === "both";
    const showBody = mode === "body" || mode === "both";
    if (t.font_family) this._loadFont(t.font_family);
    if (b.font_family) this._loadFont(b.font_family);
    if (sh.font_family) this._loadFont(sh.font_family);

    const _neonGlow = (color, size) => {
      if (!color) return "";
      const s = parseInt(size) || 10;
      return `text-shadow:0 0 ${Math.round(s * 0.2)}px #fff,0 0 ${Math.round(s * 0.4)}px ${color},0 0 ${Math.round(s * 0.8)}px ${color},0 0 ${s}px ${color};`;
    };

    const tFontFamily = t.font_family
      ? `'${t.font_family}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)`
      : "var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)";
    const tFontSize = `${parseFloat(t.font_size) || 24}px`;
    const tColor = t.color || "var(--ha-card-header-color, var(--primary-text-color))";
    const tIconColor = t.icon_color || tColor;
    const tIconSize = t.icon_size ? `${parseFloat(t.icon_size)}px` : `calc(${tFontSize} * 1.2)`;
    const tLetterSp = t.letter_spacing ? `${parseFloat(t.letter_spacing)}px` : "0.02em";
    const tGlowColor = t.glow_color || "var(--primary-color, #00E8FF)";
    const tGlowSize = parseFloat(t.glow_size) || 12;
    const tGlowShadow = t.text_shadow
      ? `text-shadow: ${t.text_shadow};`
      : t.glow
        ? _neonGlow(tGlowColor, tGlowSize)
        : "";
    const tGradFrom = t.gradient_from || "var(--primary-color, #00E8FF)";
    const tGradTo = t.gradient_to || "var(--accent-color, #FF50A0)";
    const tGradCSS = t.gradient
      ? `background:linear-gradient(90deg,${tGradFrom},${tGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`
      : "";
    const tFlickAnim = t.flicker
      ? `animation:nmc-flicker ${this._flickDur}s ease-in-out infinite ${this._flickOff}s;`
      : "";

    const bFontFamily = b.font_family
      ? `'${b.font_family}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)`
      : tFontFamily;
    const bFontSize = `${parseFloat(b.font_size) || 13}px`;
    const bColor = b.color || "var(--secondary-text-color, #888)";

    const alignV =
      { top: "flex-start", center: "center", bottom: "flex-end" }[sh.align_v] || "center";
    const alignH =
      { left: "flex-start", center: "center", right: "flex-end" }[sh.align_h] || "flex-start";
    const textAlign = sh.align_h || "left";
    const hasIcon = !!t.icon;
    const iconPos = t.icon_position;
    const iconRight = iconPos === "right",
      iconTop = iconPos === "top";
    const flexDir = iconTop ? "column" : iconRight ? "row-reverse" : "row";

    let bgStyle = "";
    if (sh.bg_color) {
      const hex = sh.bg_color.replace("#", "");
      if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          bl = parseInt(hex.slice(4, 6), 16);
        bgStyle = `background:rgba(${r},${g},${bl},${sh.bg_opacity ?? 1});`;
      } else bgStyle = `background:${sh.bg_color};`;
    } else if (sh.bg_opacity != null)
      bgStyle = `background:rgba(var(--rgb-card-background-color,255,255,255),${sh.bg_opacity});`;
    const blurNum = parseFloat(sh.bg_blur);
    const blurVal =
      !isNaN(blurNum) && blurNum > 0 ? `${blurNum}px` : sh.bg_blur === true ? "8px" : "";
    const hasBorder = !!(
      sh.border_color ||
      sh.border_width ||
      (sh.border_style && sh.border_style !== "solid")
    );
    const borderCss = hasBorder
      ? `border:${sh.border_width || "1px"} ${sh.border_style || "solid"} ${sh.border_color || "var(--divider-color)"};`
      : "";
    const radiusCss = sh.border_radius ? `border-radius:${parseFloat(sh.border_radius)}px;` : "";
    const glowBoxShadow = t.glow
      ? `box-shadow:var(--ha-card-box-shadow,none),0 0 ${tGlowSize * 2}px ${tGlowColor}44;`
      : "";
    const interactive = sh.tap_action !== "none";
    const bothGrid = mode === "both" && hasIcon && !iconTop && !iconRight;

    this.shadowRoot.innerHTML = `
      <style id="nmc-style">
        :host { display:block; contain:layout style; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; text-rendering:optimizeLegibility; }
        ha-card.nmc-card { contain:layout style; box-sizing:border-box; width:100%; position:relative; overflow:visible;
          ${bgStyle}${glowBoxShadow}${radiusCss}${blurVal ? `backdrop-filter:blur(${blurVal});-webkit-backdrop-filter:blur(${blurVal});` : ""}${hasBorder ? borderCss : ""}${t.hover_glitch ? "transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);" : ""}
          --nmc-uv:var(--rgb-primary-color,98,0,234); --nmc-cy:var(--rgb-accent-color,0,255,249); --nmc-bl:var(--rgb-blacklight-color,180,0,255); --nmc-er:var(--rgb-error-color,255,45,107); }
        @keyframes nmc-flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1;} 20%,24%,55%{opacity:.6;} }
        @keyframes nmc-scan-scroll { from{transform:translateY(0) translateZ(0);} to{transform:translateY(50%) translateZ(0);} }
        @keyframes nmc-scan-flicker { 0%,100%{opacity:0;} 8%{opacity:0.04;} 9%{opacity:0;} 41%{opacity:0.06;} 42%{opacity:0;} 76%{opacity:0.03;} 77%{opacity:0;} }
        @keyframes nmc-card-glitch { 0%,100%{transform:translateY(-10px) scale(1.03) translateZ(0);} 15%{transform:translateY(-10px) scale(1.03) translate(-6px,4px) translateZ(0); filter:drop-shadow(6px 0 rgba(var(--nmc-cy),1)) drop-shadow(-6px 0 rgba(var(--nmc-er),1));} 30%{transform:translateY(-10px) scale(1.03) translate(6px,-4px) translateZ(0); filter:drop-shadow(-6px 0 rgba(var(--nmc-bl),1)) drop-shadow(6px 0 rgba(var(--nmc-er),1));} 45%{transform:translateY(-10px) scale(1.03) translate(-4px,3px) translateZ(0); filter:drop-shadow(5px 5px rgba(var(--nmc-cy),1)) drop-shadow(-5px -5px rgba(var(--nmc-er),1));} 60%{transform:translateY(-10px) scale(1.03) translate(5px,-2px) translateZ(0);} 75%{transform:translateY(-10px) scale(1.03) translate(-3px,0) translateZ(0);} }
        @keyframes nmc-icon-glitch { 0%,100%{transform:scale(1) rotate(0) translateZ(0);} 20%{transform:scale(1.15) rotate(-12deg) translateZ(0);} 40%{transform:scale(1.2) rotate(12deg) translateZ(0);} 60%{transform:scale(1.15) rotate(-8deg) translateZ(0);} 80%{transform:scale(1.08) rotate(5deg) translateZ(0);} }
        @keyframes nmc-text-glitch { 0%,100%{transform:translate(0,0) translateZ(0);} 25%{transform:translate(-4px,0) translateZ(0); text-shadow:4px 0 rgba(var(--nmc-cy),1),-4px 0 rgba(var(--nmc-er),1);} 50%{transform:translate(4px,0) translateZ(0); text-shadow:-4px 0 rgba(var(--nmc-bl),1),4px 0 rgba(var(--nmc-er),1);} 75%{transform:translate(-3px,0) translateZ(0); text-shadow:3px 0 rgba(var(--nmc-bl),1),0 0 15px rgba(var(--nmc-cy),0.8);} }
        @keyframes nmc-core-pulse { 0%,100%{transform:scale(1) translateZ(0); filter:brightness(1);} 50%{transform:scale(1.04) translateZ(0); filter:brightness(1.25);} }
        @keyframes nmc-core-glow { 0%,100%{filter:brightness(0.96);} 50%{filter:brightness(1.18);} }
        @keyframes nmc-ring-spin { from{transform:rotate(0) translateZ(0);} to{transform:rotate(360deg) translateZ(0);} }
        @keyframes nmc-ring-spin-rev { from{transform:rotate(360deg) translateZ(0);} to{transform:rotate(0) translateZ(0);} }
        @keyframes nmc-data-flow { from{transform:translateY(0) translateZ(0);} to{transform:translateY(-50%) translateZ(0);} }
        @keyframes nmc-thermo-wave { 0%,100%{opacity:0.8;} 50%{opacity:1;} }
        @keyframes nmc-cell-charge { 0%,100%{opacity:0.75;} 50%{opacity:1;} }
        @keyframes nmc-shimmer { from{transform:translateX(-180%) translateZ(0);} to{transform:translateX(280%) translateZ(0);} }
        @keyframes nmc-stream-x { from{transform:translateX(-50%) translateZ(0);} to{transform:translateX(0) translateZ(0);} }
        @keyframes nmc-stream-x-rev { from{transform:translateX(0) translateZ(0);} to{transform:translateX(-50%) translateZ(0);} }
        @keyframes nmc-pulse-travel { 0%{left:-10%;opacity:0;} 8%{opacity:1;} 92%{opacity:1;} 100%{left:100%;opacity:0;} }
        @keyframes nmc-pulse-travel-rev { 0%{left:100%;opacity:0;} 8%{opacity:1;} 92%{opacity:1;} 100%{left:-10%;opacity:0;} }
        @keyframes nmc-fiber-glow { 0%,100%{opacity:0.5;} 50%{opacity:0.85;} }
        @keyframes nmc-filter-scan { 0%,100%{transform:translateY(-50%) translateZ(0); opacity:0;} 12%{opacity:0.9;} 50%{transform:translateY(50%) translateZ(0); opacity:0.9;} 88%{opacity:0.9;} }
        @keyframes nmc-filter-glow { 0%,100%{opacity:0.65;} 50%{opacity:1;} }
        @keyframes nmc-block-flash { 0%,100%{opacity:0.35; transform:scale(1) translateZ(0);} 50%{opacity:1; transform:scale(1.25) translateZ(0);} }
        @keyframes nmc-pew-flow { from{stroke-dashoffset:3080;} to{stroke-dashoffset:0;} }
        @keyframes nmc-blip-pulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
        @keyframes nmc-dash-crawl { to{stroke-dashoffset:-120;} }
        /* scrollbars néon des zones scrollables du body */
        .nmc-body ::-webkit-scrollbar { width:6px; }
        .nmc-body ::-webkit-scrollbar-track { background:rgba(0,0,0,0.25); border-radius:3px; }
        .nmc-body ::-webkit-scrollbar-thumb { background:linear-gradient(180deg,#FF2D6B,#B400FF); border-radius:3px; box-shadow:0 0 5px #FF2D6B88; }
        .nmc-body ::-webkit-scrollbar-thumb:hover { background:#FF2D6B; }
        /* tuiles interactives : hover desktop (lève + éclaircit), inerte au tactile */
        .nmc-body .nmc-tile { transition:transform .15s ease, filter .15s ease; }
        .nmc-body [data-entity] { cursor:pointer; }
        @media (hover:hover) { .nmc-body .nmc-tile:hover { transform:translateY(-2px) scale(1.02); filter:brightness(1.18); } }
        /* low-power (iPad/mobile/app Companion) : coupe les BALAYAGES continus coûteux
           injectés par un body markdown (scanlines, data-flow, shimmer, pulse-travel).
           Garde les pulses d'état ponctuels/légers (blip, core-glow, status-dot). */
        ${NMC_IS_LOW_POWER ? `
        .nmc-body [style*="nmc-data-flow"], .nmc-body [style*="nmc-scan-scroll"],
        .nmc-body [style*="nmc-scan-flicker"], .nmc-body [style*="nmc-shimmer"],
        .nmc-body [style*="nmc-pulse-travel"], .nmc-body [style*="nmc-stream-x"],
        .nmc-body [style*="nmc-pew-flow"] { animation:none !important; }
        ` : ""}
        /* lignes extensibles (listes scrollables) : le détail se déplie DANS le flux au survol
           (une tipbox flottante serait rognée par l'overflow:auto du conteneur scrollable) */
        .nmc-body .nmc-xmore { max-height:0; overflow:hidden; opacity:0; transition:max-height .2s ease, opacity .2s ease; }
        @media (hover:hover) { .nmc-body .nmc-xrow:hover .nmc-xmore { max-height:110px; opacity:1; } }
        /* markdown de base */
        .nmc-body a { color:var(--primary-color); text-decoration:none; border-bottom:1px solid currentColor; }
        .nmc-body a:hover { filter:brightness(1.3); }
        .nmc-body h1,.nmc-body h2,.nmc-body h3,.nmc-body h4 { margin:.4em 0 .2em; line-height:1.2; }
        .nmc-body ul,.nmc-body ol { margin:.2em 0; padding-left:1.4em; }
        .nmc-body code { font-family:'Share Tech Mono',monospace; background:rgba(255,255,255,0.08); padding:0 4px; border-radius:3px; }
        .nmc-body table { border-collapse:collapse; width:100%; }
        .nmc-body td,.nmc-body th { padding:3px 7px; border-bottom:1px solid var(--divider-color); text-align:left; }
        .nmc-body blockquote { margin:.3em 0; padding-left:.8em; border-left:2px solid var(--primary-color); opacity:.85; }
        .nmc-body { min-width:0; overflow-wrap:anywhere; }
        .nmc-body img,.nmc-body svg { max-width:100%; }
        .nmc-wrap,.nmc-wrap *,.nmc-icon-wrap,.nmc-text-wrap,.nmc-title,.nmc-body { box-sizing:border-box; }
        ${t.scanline ? `.nmc-scanlines{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2;border-radius:inherit;} .nmc-scanlines::before{content:' ';display:block;position:absolute;left:0;right:0;top:-100%;height:200%;background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.15) 50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05));background-size:100% 3px,3px 100%;animation:nmc-scan-scroll ${(this._scanDur * 1.5).toFixed(1)}s linear infinite;will-change:transform;transform:translateZ(0);} .nmc-scanlines::after{content:' ';display:block;position:absolute;inset:0;background:rgba(18,16,16,0.08);opacity:0;animation:nmc-scan-flicker 4s step-end infinite;}` : ""}
        ${t.hover_glitch ? `ha-card.nmc-card:hover{transform:translateY(-8px) scale(1.02) translateZ(0);animation:nmc-card-glitch 0.4s cubic-bezier(0.4,0,0.2,1);} ha-card.nmc-card:hover .nmc-title{animation:nmc-text-glitch 0.4s cubic-bezier(0.4,0,0.2,1);} ha-card.nmc-card:hover .nmc-icon-wrap ha-icon{animation:nmc-icon-glitch 0.4s cubic-bezier(0.4,0,0.2,1);}` : ""}
        .nmc-wrap {
          ${bothGrid ? `display:grid; grid-template-columns:auto 1fr; align-items:center; column-gap:10px;` : `display:flex; flex-direction:${flexDir}; align-items:${alignV}; justify-content:${alignH}; gap:${iconTop ? "6px" : "10px"};`}
          padding:${sh.padding}; ${mode === "both" ? "padding-bottom:12px;" : ""} position:relative; overflow:visible; }
        ${bothGrid ? `.nmc-wrap>.nmc-icon-wrap{grid-column:1;grid-row:1;} .nmc-wrap>.nmc-text-wrap{display:contents;} .nmc-text-wrap>.nmc-title{grid-column:2;grid-row:1;align-self:center;} .nmc-text-wrap>.nmc-body{grid-column:1 / -1;grid-row:2;width:100%;padding-top:10px;margin-top:8px;border-top:1px solid;border-image:linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent) 1;} ${t.scanline ? `.nmc-wrap>.nmc-scanlines{grid-column:1 / -1;grid-row:1;inset:auto;position:absolute;top:0;left:0;right:0;bottom:auto;height:100%;pointer-events:none;z-index:2;}` : ""}` : mode === "both" ? `.nmc-title{padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid;border-image:linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent) 1;}` : ""}
        .nmc-icon-wrap { display:${hasIcon ? "flex" : "none"}; align-items:center; justify-content:center; flex-shrink:0; overflow:visible; }
        .nmc-icon-wrap ha-icon { --mdc-icon-size:${tIconSize}; color:${tIconColor}; overflow:visible; ${t.glow ? `filter:drop-shadow(0 0 ${Math.round(tGlowSize * 0.2)}px #fff) drop-shadow(0 0 ${Math.round(tGlowSize * 0.4)}px ${tGlowColor}) drop-shadow(0 0 ${Math.round(tGlowSize * 0.8)}px ${tGlowColor}) drop-shadow(0 0 ${tGlowSize}px ${tGlowColor});` : ""} ${t.flicker && !t.hover_glitch ? tFlickAnim : ""} }
        .nmc-text-wrap { display:flex; flex-direction:column; gap:3px; text-align:${textAlign}; ${iconTop ? "align-items:center;" : ""} ${sh.align_h !== "center" ? "flex:1;" : ""} min-width:0; overflow:visible; }
        .nmc-title { display:${showTitle ? "block" : "none"}; font-family:${tFontFamily}; font-size:${tFontSize}; font-weight:${t.font_weight || 600}; letter-spacing:${tLetterSp}; line-height:1.2; overflow:visible; ${t.uppercase ? "text-transform:uppercase;" : ""}${t.italic ? "font-style:italic;" : ""}${tGradCSS || `color:${tColor};`}${!t.hover_glitch ? tGlowShadow : ""}${!t.hover_glitch ? tFlickAnim : ""}${t.hover_glitch ? "transition:transform 0.2s,text-shadow 0.2s;" : ""} }
        .nmc-body { display:${showBody ? "block" : "none"}; font-family:${bFontFamily}; font-size:${bFontSize}; font-weight:400; line-height:1.4; overflow:visible; color:${bColor}; }
        .nmc-body ha-icon { --mdc-icon-size:${bFontSize}; vertical-align:middle; }
        @media (max-width:1100px) { .nmc-title{font-size:${Math.max(11, Math.round((parseFloat(t.font_size) || 24) * 0.85))}px;} .nmc-body{font-size:${Math.max(10, Math.round((parseFloat(b.font_size) || 13) * 0.9))}px;} }
      </style>
      <ha-card class="nmc-card"${interactive ? ' style="cursor:pointer"' : ""}>
        <div class="nmc-wrap">
          ${t.scanline ? '<div class="nmc-scanlines" aria-hidden="true"></div>' : ""}
          <div class="nmc-icon-wrap"></div>
          <div class="nmc-text-wrap">
            <div class="nmc-title"></div>
            <div class="nmc-body"></div>
          </div>
        </div>
      </ha-card>
    `;
    if (hasIcon) {
      const iconEl = document.createElement("ha-icon");
      iconEl.setAttribute("icon", t.icon);
      this.shadowRoot.querySelector(".nmc-icon-wrap").appendChild(iconEl);
    }
    this._updateBody();
    this._reattach(this.shadowRoot.querySelector("ha-card.nmc-card"));
    this._rendered = true;
  }

  _reattach(card) {
    if (!card) return;
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver((entries) => {
        for (const e of entries) if (e.contentRect.width === 0) return;
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
          this._rafId = 0;
          this._updateBody();
        });
      });
      this._ro.observe(card);
    }

    // On regroupe TOUS les addEventListener sous le même garde-fou unique
    if (!this._ac) {
      this._ac = new AbortController();

      // 0. data-entity="…" (v4.0) : tap → more-info, prioritaire sur le tap_action global
      card.addEventListener(
        "click",
        (e) => {
          const hit = e.target && e.target.closest ? e.target.closest("[data-entity]") : null;
          if (hit) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this._moreInfo(hit.getAttribute("data-entity"));
          }
        },
        { signal: this._ac.signal }
      );

      const sh = this._config?.shared;
      const interactive = sh && sh.tap_action !== "none";

      // 1. Écouteur pour le tap_action global de la carte
      if (interactive) {
        card.addEventListener(
          "click",
          () => {
            if (sh.tap_action === "navigate" && sh.navigation_path)
              this._navigate(sh.navigation_path);
            else if (sh.tap_action === "more-info" && sh.entity) this._moreInfo(sh.entity);
          },
          { signal: this._ac.signal }
        );
      }

      // 2. Ton interception des liens <a> internes (toujours active pour le corps Markdown/HTML)
      card.addEventListener(
        "click",
        (e) => {
          const anchor = e.target.closest("a");
          if (anchor) {
            const href = anchor.getAttribute("href");
            if (href && href.startsWith("/") && !href.startsWith("//")) {
              e.preventDefault(); // On empêche le navigateur de recharger la page
              this._navigate(href); // On utilise le routeur fluide interne de HA
            }
          }
        },
        { signal: this._ac.signal }
      );
    }
  }
}
customElements.define("neon-markdown-card", NeonMarkdownCard);

const NMC_TEST_API = {
  nmcSafeHref,
  nmcSafeSrc,
  nmcSanitizeBody,
  nmcMarkdown,
  nmcApplyFilters,
  nmcParseTemplate,
  nmcCollectDependencies,
  nmcDependenciesChanged,
  NeonMarkdownCard,
};
if (typeof window !== "undefined" && window.__NMC_TEST_MODE__) window.__NMC_TEST_API__ = NMC_TEST_API;

window.customCards = window.customCards || [];
window.customCards.push({
  type: "neon-markdown-card",
  name: "Neon Markdown Card",
  description: "Header néon + corps HTML/Markdown/Jinja (for/if/filtres) — Neo Tokyo",
  preview: true,
});

console.info(
  "%c NEON-MARKDOWN-CARD %c v" + NMC_VERSION + " ",
  "color:#00fff9;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:3px 0 0 3px",
  "color:#FF50A0;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:0 3px 3px 0"
);
