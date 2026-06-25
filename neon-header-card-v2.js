/* ── neon-header-card-v2 v2.6 ── */
/**
 * neon-header-card-v2
 *
 * Config:
 *   type: custom:neon-header-card-v2
 *   mode: title          # title | subtitle | both
 *   title:
 *     text: "Mon dashboard"
 *     font_size: 24
 *     font_weight: 600
 *     color: "#fff"
 *     icon: mdi:home
 *     icon_position: left   # left | right | top
 *     font_family: Rajdhani
 *     uppercase: false
 *     italic: false
 *     letter_spacing: 2
 *     glow: false
 *     glow_color: null
 *     glow_size: 12
 *     gradient: false
 *     gradient_from: null
 *     gradient_to: null
 *     scanline: false
 *     flicker: false
 *     hover_glitch: false
 *     text_shadow: null
 *   subtitle:
 *     text: "{{ states('sensor.xxx') }}"
 *     font_size: 13
 *     color: null
 *     uppercase: false
 *     italic: false
 *     letter_spacing: 0
 *     glow: false
 *     gradient: false
 *     gradient_from: null
 *     gradient_to: null
 *     flicker: false
 *   shared:
 *     padding: "8px 16px"
 *     bg_color: null
 *     bg_opacity: null
 *     bg_blur: false
 *     border_color: null
 *     border_width: null
 *     border_style: solid
 *     border_radius: null
 *     align_h: left
 *     align_v: center
 *     tap_action: none
 *     navigation_path: null
 *     font_family: null
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  TEMPLATE ENGINE (subtitle.text / title.text)
 * ─────────────────────────────────────────────────────────────────────────
 *  A small built-in Jinja-like engine renders the text (NOT full Home
 *  Assistant Jinja — it runs client-side, no server round-trip). Supported:
 *
 *   - States:        {{ states('sensor.x') }}  is_state('x','on')
 *                    state_attr('weather.home','temperature')
 *   - Variables:     {% set deg = states('sensor.x')|float * 3.6 %}  then {{ deg }}
 *   - Arithmetic:    + - * / ( )      e.g. {{ (val/1000000)|round(1) }}
 *   - Comparisons:   == != > < >= <=
 *   - Boolean logic: and  or  not     e.g. {% if a>1 and not down %}…{% endif %}
 *   - Membership:    in / not in      e.g. {{ x in ['a','b'] }}
 *   - Ternary:       A if COND else B  (nestable)
 *   - Conditionals:  {% if C %}…{% elif C %}…{% else %}…{% endif %}
 *   - Concatenation: ~                 e.g. {{ 'val=' ~ count }}
 *   - Filters:       | round(n) float int upper lower title default thousands
 *
 *  The output HTML is sanitized: only DIV/SPAN/B/STRONG/I/EM/U/SMALL/MARK/
 *  CODE/BR/HA-ICON tags and style/class attributes survive. Forbidden in
 *  inline styles: url(), @import, expression(), javascript:, behavior, binding
 *  → so conic/linear/radial-gradient, box-shadow, clip-path, mask (without
 *  url), filter, mix-blend-mode and animation are all allowed.
 *
 *  Reusable @keyframes (use via inline `animation:`):
 *   nhv2-flicker, nhv2-scan-scroll, nhv2-scan-flicker, nhv2-card-glitch,
 *   nhv2-icon-glitch, nhv2-text-glitch, nhv2-core-pulse, nhv2-core-glow,
 *   nhv2-ring-spin, nhv2-ring-spin-rev, nhv2-data-flow, nhv2-thermo-wave,
 *   nhv2-cell-charge, nhv2-shimmer, nhv2-stream-x, nhv2-stream-x-rev,
 *   nhv2-filter-scan, nhv2-filter-glow, nhv2-block-flash, nhv2-pulse-travel,
 *   nhv2-pulse-travel-rev, nhv2-fiber-glow
 *
 *  Performance: animate transform/opacity only (GPU-composited) — avoid
 *  left/top/width/height (reflow) and prefer them to box-shadow/background-
 *  position (repaint). The subtitle DOM is only rebuilt when its rendered
 *  HTML actually changes, so long-running animations don't restart on every
 *  hass update.
 *
 *  Example data-driven header (RAM gauge that turns amber/red under load):
 *   subtitle:
 *     text: >-
 *       {% set ram = states('sensor.pi_ram')|float(0) %}
 *       {% set c = '#FF2D6B' if ram>85 else '#FFB800' if ram>70 else '#39FF9E' %}
 *       <div style="color:{{c}}; text-shadow:0 0 8px {{c}};">RAM {{ ram|round(0)|int }}%</div>
 */

const NHV2_VERSION = '2.6';

// ── Device detection — préfixé NHV2_ ────────────────────────────
const NHV2_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NHV2_IS_LOW_POWER = NHV2_IS_IPAD || /iPhone|Android/.test(navigator.userAgent);

// ── Google Fonts ─────────────────────────────────────────────────
const NHV2_FONTS = [
  'Rajdhani','Orbitron','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];

const _nhv2FontLoaded = new Set();
function nhv2LoadFont(family) {
  if (!family || _nhv2FontLoaded.has(family)) return;
  const id = `nhv2-font-${family.replace(/\s/g,'-')}`;
  if (document.getElementById(id)) { _nhv2FontLoaded.add(family); return; }
  ['https://fonts.googleapis.com','https://fonts.gstatic.com'].forEach(href => {
    if (!document.querySelector(`link[rel=preconnect][href="${href}"]`)) {
      const l = document.createElement('link');
      l.rel = 'preconnect'; l.href = href;
      if (href.includes('gstatic')) l.crossOrigin = 'anonymous';
      document.head.appendChild(l);
    }
  });
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;900&display=swap`;
  document.head.appendChild(link);
  _nhv2FontLoaded.add(family);
}

// ── Template engine ──────────────────────────────────────────────
function nhv2ParseTemplate(hass, text, vars) {
  if (!hass || !text || typeof text !== 'string') return text;
  vars = vars || {};

  // ── Pré-passe : {% set nom = expression %} (collecte les variables, retire les blocs) ──
  if (text.includes('{%')) {
    text = text.replace(/\{\%\s*set\s+([a-zA-Z_]\w*)\s*=\s*([\s\S]+?)\s*\%\}/g, (m, name, raw) => {
      try {
        const { expr, filters } = nhv2SplitFilters(raw.trim());
        let v = nhv2Eval(expr, hass, vars);
        if (filters) v = nhv2ApplyFilters(v == null ? '' : String(v), filters);
        // re-caster en nombre si possible (pour l'arithmétique aval)
        const n = parseFloat(v);
        vars[name] = (typeof v === 'string' && !isNaN(n) && String(n) === v.trim()) ? n : v;
      } catch(e) { vars[name] = ''; }
      return '';
    });
    // ── {% if COND %}...{% elif COND %}...{% else %}...{% endif %} (après les set, du plus
    //    interne au plus externe via boucle sur les if sans if imbriqué). ──
    text = nhv2ResolveIfBlocks(text, hass, vars);
  }
  if (!text.includes('{{')) return text.trim();

  return text.replace(/\{\{\s*([\s\S]+?)\s*\}\}/g, (match, formula) => {
    try {
      formula = formula.trim();
      // séparer la chaîne de filtres ( | xxx ) de l'expression — en ignorant les | dans les parenthèses/quotes
      const { expr, filters } = nhv2SplitFilters(formula);
      const val = nhv2Eval(expr, hass, vars);
      return nhv2ApplyFilters(val == null ? '' : String(val), filters);
    } catch(e) { return match; }
  });
}

// Résout les blocs {% if %}/{% elif %}/{% else %}/{% endif %} en remplaçant chaque bloc par
// la branche dont la condition est vraie (ou ''). Traite du plus INTERNE au plus externe :
// la regex ne matche qu'un if SANS autre {% if %} dedans, et on boucle jusqu'à épuisement.
function nhv2ResolveIfBlocks(text, hass, vars) {
  if (!text.includes('{% if') && !text.includes('{%if')) return text;
  const reInner = /\{\%\s*if\s+([\s\S]+?)\s*\%\}((?:(?!\{\%\s*if\s)[\s\S])*?)\{\%\s*endif\s*\%\}/;
  let guard = 0;
  while (reInner.test(text) && guard++ < 50) {
    text = text.replace(reInner, (m, firstCond, body) => {
      // découper body en branches sur les {% elif %} / {% else %} de CE bloc (pas d'if interne ici)
      const parts = body.split(/\{\%\s*(elif\s+[\s\S]+?|else)\s*\%\}/);
      // parts = [body0, kw1, body1, kw2, body2, ...] ; kw = "elif COND" | "else"
      const branches = [{ cond: firstCond, content: parts[0] }];
      for (let i = 1; i < parts.length; i += 2) {
        const kw = parts[i].trim();
        const content = parts[i + 1] || '';
        if (kw === 'else') branches.push({ cond: null, content });
        else branches.push({ cond: kw.replace(/^elif\s+/, ''), content });
      }
      for (const br of branches) {
        if (br.cond === null) return br.content; // else
        try { if (nhv2Truthy(nhv2Eval(br.cond, hass, vars))) return br.content; } catch(e) {}
      }
      return '';
    });
  }
  return text;
}

// Sépare "expr | f1 | f2(arg)" → { expr, filters:"| f1 | f2(arg)" } sans couper les | internes.
// IMPORTANT : si l'expression contient un opérateur de niveau 0 (ternaire if/else, and/or, ~,
// comparaison), les "|" appartiennent à des SOUS-expressions et sont gérés par nhv2Eval lui-même
// → on ne coupe PAS ici (sinon "'a' if x|int>1 else 'b'" serait charcuté). On ne sépare le filtre
// que pour une expression "simple" (atome + filtres), ex "states(x)|int|round(1)".
function nhv2SplitFilters(s) {
  let depth = 0, inStr = '', pipeIdx = -1, hasOp = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === inStr) inStr = ''; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(' ) { depth++; continue; }
    if (c === ')') { depth--; continue; }
    if (depth !== 0) continue;
    if (c === '|' && pipeIdx < 0) pipeIdx = i;           // 1er pipe de niveau 0
    else if (c === '~') hasOp = true;                     // concat
    else if (c === '<' || c === '>' || c === '=' || c === '!') hasOp = true; // comparaison
    else if (s.substr(i, 4) === ' if ' || s.substr(i, 6) === ' else ' ||
             s.substr(i, 5) === ' and ' || s.substr(i, 4) === ' or ') hasOp = true; // logique/ternaire
  }
  // pipe présent ET aucun opérateur de niveau 0 → c'est un vrai filtre global
  if (pipeIdx >= 0 && !hasOp) return { expr: s.slice(0, pipeIdx).trim(), filters: s.slice(pipeIdx) };
  return { expr: s.trim(), filters: '' };
}

/* ── Évaluateur d'expression sûr (pas d'eval) ──
 * Gère : nombres, chaînes, variables (set), states(...), is_state(...),
 * arithmétique + - * / ( ), comparaisons, et ternaire "A if COND else B". */
function nhv2Eval(expr, hass, vars) {
  expr = String(expr).trim();

  // ternaire : <A> if <cond> else <B>  (récursif, gère l'imbrication via le 1er if/else de niveau 0)
  const tern = nhv2SplitTernary(expr);
  if (tern) {
    return nhv2Truthy(nhv2Eval(tern.cond, hass, vars))
      ? nhv2Eval(tern.t, hass, vars)
      : nhv2Eval(tern.f, hass, vars);
  }

  // logique booléenne niveau 0 : "or" puis "and" (or moins prioritaire). 'not' géré dans l'atome.
  // Évalué AVANT les comparaisons pour que "a > 1 and b < 2" se découpe en deux comparaisons.
  const orSplit = nhv2SplitLogic(expr, 'or');
  if (orSplit) {
    return (nhv2Truthy(nhv2Eval(orSplit.a, hass, vars)) || nhv2Truthy(nhv2Eval(orSplit.b, hass, vars))) ? 1 : 0;
  }
  const andSplit = nhv2SplitLogic(expr, 'and');
  if (andSplit) {
    return (nhv2Truthy(nhv2Eval(andSplit.a, hass, vars)) && nhv2Truthy(nhv2Eval(andSplit.b, hass, vars))) ? 1 : 0;
  }
  // négation : "not <expr>"
  if (/^not\s+/.test(expr)) {
    return nhv2Truthy(nhv2Eval(expr.replace(/^not\s+/, ''), hass, vars)) ? 0 : 1;
  }

  // appartenance : "<val> in [a,b,c]" / "<val> not in [a,b,c]" (niveau 0, hors quotes)
  {
    const inM = nhv2SplitIn(expr);
    if (inM) {
      const val = String(nhv2Eval(inM.val, hass, vars));
      // parser la liste [..] : éléments littéraux (chaînes quotées ou nombres)
      const items = inM.list.replace(/^\[|\]$/g, '').split(',').map(x => {
        x = x.trim();
        return (/^['"][\s\S]*['"]$/.test(x)) ? x.slice(1, -1) : x;
      });
      const found = items.includes(val);
      return (inM.neg ? !found : found) ? 1 : 0;
    }
  }

  // comparaisons de niveau 0 — applique les filtres ( |int etc.) présents dans CHAQUE membre
  // (sinon "states(x)|int > 10" ne convertit pas le membre gauche). Fait ici, pas plus haut,
  // pour ne pas casser le découpage ternaire/logique qui peut contenir des | dans ses branches.
  const cmp = nhv2SplitCompare(expr);
  if (cmp) {
    const evalSide = (side) => {
      const sf = nhv2SplitFilters(side.trim());
      let v = nhv2Eval(sf.expr, hass, vars);
      if (sf.filters) v = nhv2ApplyFilters(v == null ? '' : String(v), sf.filters);
      return v;
    };
    const a = evalSide(cmp.a), b = evalSide(cmp.b);
    const na = parseFloat(a), nb = parseFloat(b);
    const num = !isNaN(na) && !isNaN(nb);
    switch (cmp.op) {
      case '==': return (num ? na === nb : String(a) === String(b)) ? 1 : 0;
      case '!=': return (num ? na !== nb : String(a) !== String(b)) ? 1 : 0;
      case '>':  return na >  nb ? 1 : 0;
      case '<':  return na <  nb ? 1 : 0;
      case '>=': return na >= nb ? 1 : 0;
      case '<=': return na <= nb ? 1 : 0;
    }
  }

  // concaténation Jinja "~" au niveau 0 (string concat). Découpe sur le 1er ~ hors parenthèses/quotes.
  {
    let depth = 0, inStr = '';
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inStr) { if (c === inStr) inStr = ''; continue; }
      if (c === '"' || c === "'") { inStr = c; continue; }
      if (c === '(') depth++; else if (c === ')') depth--;
      else if (c === '~' && depth === 0) {
        const a = nhv2Eval(expr.slice(0, i), hass, vars);
        const b = nhv2Eval(expr.slice(i + 1), hass, vars);
        return (a == null ? '' : String(a)) + (b == null ? '' : String(b));
      }
    }
  }

  // arithmétique : seulement s'il reste un vrai opérateur APRÈS avoir masqué
  // les appels de fonction (states(...), etc.) et les chaînes — pour ne pas
  // confondre les parenthèses de states() avec un groupement, ni un point d'IP avec un nombre.
  if (!/^['"]/.test(expr)) {
    const masked = expr
      .replace(/(states|is_state|state_attr)\([^)]*\)/g, '0')  // appels → token neutre
      .replace(/['"][^'"]*['"]/g, '0');                          // chaînes → token neutre
    if (/[+\-*/]/.test(masked) || /\([^)]*[+\-*/]/.test(expr)) {
      const r = nhv2EvalArith(expr, hass, vars);
      if (r !== undefined) return r;
    }
  }
  return nhv2Atom(expr, hass, vars);
}

// atome : littéral nombre/chaîne, variable, states(), is_state()
function nhv2Atom(s, hass, vars) {
  s = s.trim();
  if (s === '') return '';
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  if (/^['"][\s\S]*['"]$/.test(s)) return s.slice(1, -1);
  let m = s.match(/^states\(\s*['"](.+?)['"]\s*\)$/);
  if (m) { const st = hass.states[m[1]]; return st ? st.state : ''; }
  m = s.match(/^is_state\(\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*\)$/);
  if (m) { const st = hass.states[m[1]]; return (st && st.state === m[2]) ? 1 : 0; }
  m = s.match(/^state_attr\(\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*\)$/);
  if (m) { const st = hass.states[m[1]]; return st && st.attributes ? (st.attributes[m[2]] ?? '') : ''; }
  if (Object.prototype.hasOwnProperty.call(vars, s)) return vars[s];
  // expression entre parenthèses pures
  if (s.startsWith('(') && s.endsWith(')')) return nhv2Eval(s.slice(1, -1), hass, vars);
  return s; // chaîne nue
}

function nhv2Truthy(v) {
  if (v === '' || v === 0 || v === '0' || v == null) return false;
  if (v === 'off' || v === 'false' || v === 'unavailable' || v === 'unknown' || v === 'None') return false;
  return true;
}

// trouve un " if ... else " au niveau 0 de parenthèses/quotes
function nhv2SplitTernary(s) {
  let depth = 0, inStr = '', ifIdx = -1, elseIdx = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === inStr) inStr = ''; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(') depth++; else if (c === ')') depth--;
    else if (depth === 0) {
      if (ifIdx < 0 && s.substr(i, 4) === ' if ') ifIdx = i;
      else if (ifIdx >= 0 && s.substr(i, 6) === ' else ') { elseIdx = i; break; }
    }
  }
  if (ifIdx >= 0 && elseIdx > ifIdx)
    return { t: s.slice(0, ifIdx).trim(), cond: s.slice(ifIdx + 4, elseIdx).trim(), f: s.slice(elseIdx + 6).trim() };
  return null;
}

// découpe sur le DERNIER " and "/" or " au niveau 0 (assoc. gauche). op = 'and' | 'or'.
// Ne matche pas un mot qui CONTIENT and/or (ex: "android") grâce aux espaces requis.
function nhv2SplitLogic(s, op) {
  const tok = ' ' + op + ' ';
  let depth = 0, inStr = '', idx = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === inStr) inStr = ''; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(') depth++; else if (c === ')') depth--;
    else if (depth === 0 && s.substr(i, tok.length) === tok) idx = i; // dernier = assoc gauche
  }
  if (idx >= 0) return { a: s.slice(0, idx).trim(), b: s.slice(idx + tok.length).trim() };
  return null;
}

// détecte "<val> in [..]" ou "<val> not in [..]" au niveau 0 → { val, list, neg }
function nhv2SplitIn(s) {
  let depth = 0, inStr = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === inStr) inStr = ''; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (depth === 0) {
      if (s.substr(i, 8) === ' not in ') return { val: s.slice(0, i).trim(), list: s.slice(i + 8).trim(), neg: true };
      if (s.substr(i, 4) === ' in ')    return { val: s.slice(0, i).trim(), list: s.slice(i + 4).trim(), neg: false };
    }
  }
  return null;
}

// trouve un opérateur de comparaison au niveau 0
function nhv2SplitCompare(s) {
  let depth = 0, inStr = '';
  const ops = ['==', '!=', '>=', '<=', '>', '<'];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === inStr) inStr = ''; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(') depth++; else if (c === ')') depth--;
    else if (depth === 0) {
      for (const op of ops) {
        if (s.substr(i, op.length) === op) {
          // éviter de confondre > avec >= déjà capturé : ops triés, ok
          return { a: s.slice(0, i), op, b: s.slice(i + op.length) };
        }
      }
    }
  }
  return null;
}

// arithmétique : tokenise puis shunting-yard → RPN → eval
function nhv2EvalArith(expr, hass, vars) {
  const toks = nhv2Tokenize(expr, hass, vars);
  if (!toks) return undefined;
  const out = [], ops = [], prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  for (const t of toks) {
    if (typeof t === 'number') out.push(t);
    else if (t === '(') ops.push(t);
    else if (t === ')') { while (ops.length && ops[ops.length-1] !== '(') out.push(ops.pop()); ops.pop(); }
    else { while (ops.length && prec[ops[ops.length-1]] >= prec[t]) out.push(ops.pop()); ops.push(t); }
  }
  while (ops.length) out.push(ops.pop());
  const st = [];
  for (const t of out) {
    if (typeof t === 'number') st.push(t);
    else { const b = st.pop(), a = st.pop();
      st.push(t === '+' ? a+b : t === '-' ? a-b : t === '*' ? a*b : (b === 0 ? 0 : a/b)); }
  }
  return st.length === 1 ? st[0] : undefined;
}

// découpe en nombres / opérateurs / parenthèses ; les atomes non-numériques sont résolus puis castés en nombre
function nhv2Tokenize(expr, hass, vars) {
  const toks = []; let i = 0;
  const re = /\s*(states\([^)]*\)|is_state\([^)]*\)|state_attr\([^)]*\)|[a-zA-Z_]\w*|-?\d+\.?\d*|[()+\-*/])/g;
  let m, last = 0;
  while ((m = re.exec(expr)) !== null) {
    if (m.index !== last && expr.slice(last, m.index).trim() !== '') return null; // caractère inconnu
    last = re.lastIndex;
    const tk = m[1];
    if (tk === '(' || tk === ')' || tk === '+' || tk === '*' || tk === '/') toks.push(tk);
    else if (tk === '-') {
      // moins unaire vs binaire
      const prev = toks[toks.length-1];
      if (toks.length === 0 || prev === '(' || prev === '+' || prev === '-' || prev === '*' || prev === '/') toks.push(0, '-');
      else toks.push('-');
    } else {
      const v = parseFloat(nhv2Atom(tk, hass, vars));
      toks.push(isNaN(v) ? 0 : v);
    }
  }
  if (last < expr.length && expr.slice(last).trim() !== '') return null;
  return toks;
}

function nhv2ApplyFilters(val, filterStr) {
  if (!filterStr || !filterStr.trim()) return val;
  let result = val;
  (filterStr.match(/\|\s*(\w+)(?:\(([^)]*)\))?/g) || []).forEach(expr => {
    const m = expr.match(/\|\s*(\w+)(?:\(([^)]*)\))?/);
    if (!m) return;
    switch(m[1]) {
      case 'round': { const n=parseInt(m[2])||0; const f=parseFloat(result); result=isNaN(f)?result:f.toFixed(n); break; }
      case 'float':  result = parseFloat(result)||0; break;
      case 'int':    result = parseInt(result)||0; break;
      case 'upper':  result = String(result).toUpperCase(); break;
      case 'lower':  result = String(result).toLowerCase(); break;
      case 'title':  result = String(result).charAt(0).toUpperCase()+String(result).slice(1); break;
      case 'default': if (!result||result==='None'||result==='unknown') result=(m[2]||'').replace(/^['"]|['"]$/g,''); break;
      case 'thousands': {
        const sep = (m[2]||'').replace(/^['"]|['"]$/g,'').trim() || ' ';
        const parts = String(result).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        result = parts.join('.');
        break;
      }
    }
  });
  return result;
}

// ── Subtitle HTML sanitizer ──────────────────────────────────────
const NHV2_ALLOWED_TAGS = new Set(['BR','B','STRONG','I','EM','U','SMALL','MARK','CODE','SPAN','DIV','HA-ICON']);
const NHV2_ALLOWED_ATTRS = new Set(['style','class']);
const NHV2_UNSAFE_STYLE_RE = /expression\s*\(|javascript\s*:|url\s*\(|@import|behavior\s*:|binding\s*:|moz-binding/i;

function nhv2SanitizeStyle(styleStr) {
  if (!styleStr) return null;
  const clean = styleStr.replace(/\/\*[\s\S]*?\*\//g, '');
  if (NHV2_UNSAFE_STYLE_RE.test(clean)) return null;
  return clean;
}

function nhv2SanitizeSubtitle(raw) {
  if (raw == null) return '';
  let html = String(raw).replace(/\[mdi:([a-zA-Z0-9_-]+)\]/g, '<ha-icon icon="mdi:$1"></ha-icon>');
  if (!html.includes('<')) return html;
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(el => {
    if (!NHV2_ALLOWED_TAGS.has(el.tagName)) { el.replaceWith(document.createTextNode(el.textContent||'')); return; }
    if (el.tagName === 'HA-ICON') {
      const icon = el.getAttribute('icon')||'';
      if (!icon.match(/^mdi:[a-zA-Z0-9_-]+$/)) { el.replaceWith(document.createTextNode('')); return; }
      [...el.attributes].forEach(a => { if (a.name !== 'icon') el.removeAttribute(a.name); });
      return;
    }
    [...el.attributes].forEach(a => {
      if (!NHV2_ALLOWED_ATTRS.has(a.name)) { el.removeAttribute(a.name); return; }
      if (a.name === 'style') {
        const safe = nhv2SanitizeStyle(a.value);
        if (safe) el.setAttribute('style', safe); else el.removeAttribute('style');
      }
    });
  });
  return tpl.innerHTML;
}

// ── Config normalizer ────────────────────────────────────────────
function nhv2BuildConfig(raw) {
  const r = raw || {};

  const title = {
    text:           r.title?.text          ?? r.title?.text ?? '',
    font_size:      r.title?.font_size     ?? 24,
    font_weight:    r.title?.font_weight   ?? 600,
    color:          r.title?.color         ?? null,
    icon:           r.title?.icon          ?? r.icon ?? null,
    icon_position:  r.title?.icon_position ?? r.icon_position ?? 'left',
    icon_color:     r.title?.icon_color    ?? null,
    icon_size:      r.title?.icon_size     ?? null,
    font_family:    r.title?.font_family   ?? r.shared?.font_family ?? null,
    uppercase:      r.title?.uppercase     ?? false,
    italic:         r.title?.italic        ?? false,
    letter_spacing: r.title?.letter_spacing ?? 0,
    glow:           r.title?.glow          ?? false,
    glow_color:     r.title?.glow_color    ?? null,
    glow_size:      r.title?.glow_size     ?? 12,
    gradient:       r.title?.gradient      ?? false,
    gradient_from:  r.title?.gradient_from ?? null,
    gradient_to:    r.title?.gradient_to   ?? null,
    scanline:       NHV2_IS_LOW_POWER ? false : (r.title?.scanline ?? false),
    flicker:        NHV2_IS_LOW_POWER ? false : (r.title?.flicker  ?? false),
    hover_glitch:   NHV2_IS_LOW_POWER ? false : (r.title?.hover_glitch ?? false),
    text_shadow:    r.title?.text_shadow   ?? null,
  };

  const subtitle = {
    text:           r.subtitle?.text          ?? '',
    font_size:      r.subtitle?.font_size     ?? 13,
    color:          r.subtitle?.color         ?? null,
    icon:           r.subtitle?.icon          ?? null,
    icon_position:  r.subtitle?.icon_position ?? 'left',
    icon_color:     r.subtitle?.icon_color    ?? null,
    icon_size:      r.subtitle?.icon_size     ?? null,
    font_family:    r.subtitle?.font_family   ?? r.shared?.font_family ?? null,
    uppercase:      r.subtitle?.uppercase     ?? false,
    italic:         r.subtitle?.italic        ?? false,
    letter_spacing: r.subtitle?.letter_spacing ?? 0,
    glow:           r.subtitle?.glow          ?? false,
    glow_color:     r.subtitle?.glow_color    ?? null,
    glow_size:      r.subtitle?.glow_size     ?? 6,
    gradient:       r.subtitle?.gradient      ?? false,
    gradient_from:  r.subtitle?.gradient_from ?? null,
    gradient_to:    r.subtitle?.gradient_to   ?? null,
    flicker:        NHV2_IS_LOW_POWER ? false : (r.subtitle?.flicker ?? false),
  };

  const shared = {
    padding:        r.shared?.padding        ?? '8px 16px',
    bg_color:       r.shared?.bg_color       ?? null,
    bg_opacity:     r.shared?.bg_opacity     ?? null,
    bg_blur:        r.shared?.bg_blur        ?? false,
    border_color:   r.shared?.border_color   ?? null,
    border_width:   r.shared?.border_width   ?? null,
    border_style:   r.shared?.border_style   ?? 'solid',
    border_radius:  r.shared?.border_radius  ?? null,
    align_h:        r.shared?.align_h        ?? 'left',
    align_v:        r.shared?.align_v        ?? 'center',
    tap_action:     r.shared?.tap_action     ?? 'none',
    navigation_path: r.shared?.navigation_path ?? null,
    entity:         r.shared?.entity         ?? null,
  };

  return {
    mode: r.mode ?? 'title',
    title,
    subtitle,
    shared,
  };
}

// ── Random helpers for animations ───────────────────────────────
function nhv2Rnd(min, max, dec=2) { return +(Math.random()*(max-min)+min).toFixed(dec); }

// ════════════════════════════════════════════════════════════════
//  ÉDITEUR
// ════════════════════════════════════════════════════════════════
class NeonHeaderCardV2Editor extends HTMLElement {
  constructor() {
    super();
    this._config  = null;
    this._hass    = null;
    this._built   = false;
    this._tab     = 'title';
    this._listeners = [];
  }

  setConfig(c) {
    const firstTime = !this._built;
    this._config = c;
    if (this._built) {
      // Rebuild complet si le mode change, sinon sync seulement
      const modeChanged = (c?.mode !== this._lastMode);
      if (modeChanged) { this._rebuildEditor(); }
      else { this._syncEditor(); }
    } else if (this._hass) {
      this._built = true;
      this._buildEditor();
    }
    this._lastMode = c?.mode;
  }

  set hass(h) {
    this._hass = h;
    if (!this._built && this._config) { this._built = true; this._buildEditor(); }
  }

  disconnectedCallback() {
    this._teardown();
  }

  _teardown() {
    this._listeners.forEach(({el,ev,fn}) => el.removeEventListener(ev,fn));
    this._listeners = [];
    this._built = false;
  }

  _rebuildEditor() {
    this._teardown();
    this._built = true;
    this._buildEditor();
  }

  _on(el, ev, fn) { el.addEventListener(ev,fn); this._listeners.push({el,ev,fn}); }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  _set(section, key, value) {
    const current = this._config[section];
    const base = (current && typeof current === 'object' && !Array.isArray(current))
      ? current
      : (typeof current === 'string' ? { text: current } : {});
    this._config = {
      ...this._config,
      [section]: { ...base, [key]: value },
    };
    this._fire();
  }

  _setRoot(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  _get(section, key) {
    const s = this._config?.[section];
    if (typeof s === 'string') return key === 'text' ? s : '';
    return s?.[key] ?? '';
  }

  _buildEditor() {
    this.innerHTML = `
      <style>
        :host { display:block; padding:4px 0; }
        h3 { font-size:11px; font-weight:700; color:var(--primary-color); text-transform:uppercase;
             letter-spacing:1.5px; margin:16px 0 8px; padding-bottom:4px;
             border-bottom:1px solid var(--divider-color); }
        .tabs { display:flex; gap:4px; margin-bottom:16px; }
        .tab-btn { flex:1; padding:6px 0; border:1px solid var(--divider-color); border-radius:6px;
                   background:transparent; color:var(--primary-text-color); font-size:12px;
                   cursor:pointer; transition:all .2s; text-align:center; user-select:none;
                   pointer-events:all !important; }
        .tab-btn.active { background:var(--primary-color); color:#fff; border-color:var(--primary-color); }
        .field { margin-bottom:10px; }
        label { display:block; font-size:11px; color:var(--secondary-text-color); margin-bottom:3px; }
        input[type=text],input[type=number],select,textarea {
          width:100%; box-sizing:border-box; padding:6px 8px; border-radius:6px;
          border:1px solid var(--divider-color); background:var(--card-background-color);
          color:var(--primary-text-color); font-size:12px; }
        textarea { resize:vertical; min-height:48px; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .color-row { display:flex; gap:6px; align-items:center; }
        .color-row input[type=color] { width:36px; height:32px; padding:2px; border-radius:4px; flex-shrink:0; }
        .color-row input[type=text]  { flex:1; }
        .toggle-field { display:flex; justify-content:space-between; align-items:center; }
        .switch { position:relative; display:inline-block; width:36px; height:20px; }
        .switch input { opacity:0; width:0; height:0; }
        .slider { position:absolute; inset:0; background:#ccc; border-radius:20px; cursor:pointer; transition:.3s; }
        .slider:before { content:''; position:absolute; width:14px; height:14px; left:3px; bottom:3px;
                          background:#fff; border-radius:50%; transition:.3s; }
        input:checked + .slider { background:var(--primary-color); }
        input:checked + .slider:before { transform:translateX(16px); }
        .hint { font-size:10px; color:var(--disabled-text-color); margin:2px 0 0; }
        .section-hidden { display:none; }
        .icon-row { display:flex; gap:8px; align-items:center; }
        .icon-row .icon-input { flex:1; }
        .icon-preview { width:32px; height:32px; display:flex; align-items:center; justify-content:center;
                        border:1px solid var(--divider-color); border-radius:6px; flex-shrink:0;
                        color:var(--primary-text-color); }
      </style>

      <div class="tabs">
        <div class="tab-btn ${this._tab==='title'?'active':''}" data-tab="title">Titre</div>
        <div class="tab-btn ${this._tab==='subtitle'?'active':''}" data-tab="subtitle">Sous-titre</div>
        <div class="tab-btn ${this._tab==='shared'?'active':''}" data-tab="shared">Commun</div>
      </div>

      ${this._renderModeSelect()}

      <div id="tab-title"   class="${this._tab==='title'   ? '' : 'section-hidden'}">${this._renderTitleTab()}</div>
      <div id="tab-subtitle"class="${this._tab==='subtitle' ? '' : 'section-hidden'}">${this._renderSubtitleTab()}</div>
      <div id="tab-shared"  class="${this._tab==='shared'  ? '' : 'section-hidden'}">${this._renderSharedTab()}</div>
    `;
    this._attachListeners();
  }

  _renderModeSelect() {
    const v = this._config?.mode ?? 'title';
    return `<div class="field"><label>Mode d'affichage</label>
      <select data-root="mode">
        <option value="title"    ${v==='title'   ?'selected':''}>Titre seul</option>
        <option value="subtitle" ${v==='subtitle'?'selected':''}>Sous-titre seul</option>
        <option value="both"     ${v==='both'    ?'selected':''}>Titre + Sous-titre</option>
      </select></div>`;
  }

  _renderTitleTab() {
    return `
      <h3>Texte</h3>
      ${this._textarea('Titre', 'title', 'text', 'Mon Dashboard — templates {{ states("entity") }} supportés')}
      ${this._iconPicker('Icône', 'title', 'icon')}
      ${this._select('Position icône', 'title', 'icon_position', [['left','Gauche'],['right','Droite'],['top','Dessus']])}

      <h3>Typographie</h3>
      ${this._fontSelect('Police', 'title', 'font_family')}
      <div class="row2">
        ${this._px('Taille police', 'title', 'font_size', '24')}
        ${this._px('Épaisseur', 'title', 'font_weight', '600')}
      </div>
      <div class="row2">
        ${this._toggle('Majuscules', 'title', 'uppercase')}
        ${this._toggle('Italique', 'title', 'italic')}
      </div>
      ${this._px('Espacement lettres', 'title', 'letter_spacing', '0')}

      <h3>Couleurs</h3>
      ${this._color('Couleur texte', 'title', 'color', '#ffffff')}
      ${this._color('Couleur icône', 'title', 'icon_color', '#ffffff')}
      ${this._px('Taille icône', 'title', 'icon_size', 'auto (1.2× police)')}

      <h3>Effets</h3>
      <div class="row2">
        ${this._toggle('Glow', 'title', 'glow')}
        ${this._toggle('Gradient', 'title', 'gradient')}
      </div>
      ${this._color('Couleur glow', 'title', 'glow_color', '#00fff9')}
      ${this._px('Taille glow', 'title', 'glow_size', '12')}
      ${this._color('Gradient début', 'title', 'gradient_from', '#00E8FF')}
      ${this._color('Gradient fin', 'title', 'gradient_to', '#FF50A0')}
      ${this._input('Text-shadow custom', 'title', 'text_shadow', 'text', '0 0 10px #00fff9')}
      <div class="row2">
        ${this._toggle('Flicker', 'title', 'flicker')}
        ${this._toggle('Scanline CRT', 'title', 'scanline')}
      </div>
      ${this._toggle('Hover Glitch', 'title', 'hover_glitch')}
    `;
  }

  _renderSubtitleTab() {
    return `
      <h3>Texte</h3>
      ${this._textarea('Sous-titre', 'subtitle', 'text', 'Texte, templates {{ states("entity") }}, [mdi:icon], HTML <br><b>')}
      ${this._iconPicker('Icône', 'subtitle', 'icon')}
      ${this._select('Position icône', 'subtitle', 'icon_position', [['left','Gauche'],['right','Droite'],['top','Dessus']])}

      <h3>Typographie</h3>
      ${this._fontSelect('Police', 'subtitle', 'font_family')}
      ${this._px('Taille police', 'subtitle', 'font_size', '13')}
      <div class="row2">
        ${this._toggle('Majuscules', 'subtitle', 'uppercase')}
        ${this._toggle('Italique', 'subtitle', 'italic')}
      </div>
      ${this._px('Espacement lettres', 'subtitle', 'letter_spacing', '0')}

      <h3>Couleurs</h3>
      ${this._color('Couleur texte', 'subtitle', 'color', '#888888')}
      ${this._color('Couleur icônes inline', 'subtitle', 'icon_color', '#888888')}
      ${this._px('Taille icônes inline', 'subtitle', 'icon_size', 'même que police')}

      <h3>Effets</h3>
      <div class="row2">
        ${this._toggle('Glow', 'subtitle', 'glow')}
        ${this._toggle('Gradient', 'subtitle', 'gradient')}
      </div>
      ${this._color('Couleur glow', 'subtitle', 'glow_color', '#00fff9')}
      ${this._px('Taille glow', 'subtitle', 'glow_size', '6')}
      ${this._color('Gradient début', 'subtitle', 'gradient_from', '#00E8FF')}
      ${this._color('Gradient fin', 'subtitle', 'gradient_to', '#FF50A0')}
      ${this._toggle('Flicker', 'subtitle', 'flicker')}
    `;
  }

  _renderSharedTab() {
    return `
      <h3>Police globale</h3>
      ${this._fontSelect('Police (titre + sous-titre)', 'shared', 'font_family')}

      <h3>Mise en page</h3>
      ${this._padding()}
      ${this._select('Alignement H', 'shared', 'align_h', [['left','Gauche'],['center','Centre'],['right','Droite']])}
      ${this._select('Alignement V', 'shared', 'align_v', [['top','Haut'],['center','Centre'],['bottom','Bas']])}

      <h3>Fond</h3>
      ${this._color('Couleur fond', 'shared', 'bg_color', '#1a1a2e')}
      ${this._number('Opacité fond (0–1)', 'shared', 'bg_opacity', '0', '1', '0.05')}
      ${this._toggle('Flou fond', 'shared', 'bg_blur')}

      <h3>Bordure</h3>
      ${this._color('Couleur bordure', 'shared', 'border_color', '#444444')}
      <div class="row2">
        ${this._px('Épaisseur', 'shared', 'border_width', '1')}
        ${this._px('Radius', 'shared', 'border_radius', '12')}
      </div>
      ${this._select('Style', 'shared', 'border_style', [['solid','Solide'],['dashed','Tirets'],['dotted','Points'],['none','Aucun']])}

      <h3>Interaction</h3>
      ${this._select('Action au tap', 'shared', 'tap_action', [['none','Aucune'],['navigate','Navigation'],['more-info','Plus d\'info']])}
      ${this._input('Chemin navigation', 'shared', 'navigation_path', 'text', '/lovelace/0')}
      ${this._input('Entité (more-info)', 'shared', 'entity', 'text', 'light.salon')}
    `;
  }

  // ── Form helpers ─────────────────────────────────────────────
  _input(label, section, key, type='text', placeholder='') {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <input type="${type}" data-section="${section}" data-key="${key}" value="${v}" placeholder="${placeholder}"/>
    </div>`;
  }

  _textarea(label, section, key, placeholder='') {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <textarea data-section="${section}" data-key="${key}" placeholder="${placeholder}">${v}</textarea>
    </div>`;
  }

  _px(label, section, key, defaultVal='') {
    const raw = this._get(section, key);
    const num = parseFloat(raw);
    return `<div class="field"><label>${label}</label>
      <div style="display:flex;gap:4px;align-items:center">
        <input type="number" data-section="${section}" data-key="${key}" data-px="1"
               value="${isNaN(num)?'':num}" placeholder="${defaultVal}" min="0" step="1" style="flex:1"/>
        <span style="font-size:11px;color:var(--secondary-text-color)">px</span>
      </div></div>`;
  }

  _select(label, section, key, opts) {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <select data-section="${section}" data-key="${key}">
        ${opts.map(([val,lbl]) => `<option value="${val}" ${String(v)===String(val)?'selected':''}>${lbl}</option>`).join('')}
      </select></div>`;
  }

  _toggle(label, section, key) {
    const v = !!this._get(section, key);
    return `<div class="field toggle-field"><label>${label}</label>
      <label class="switch">
        <input type="checkbox" data-section="${section}" data-key="${key}" ${v?'checked':''}/>
        <span class="slider"></span>
      </label></div>`;
  }

  _color(label, section, key, defaultHex='#ffffff') {
    const v = this._get(section, key) || '';
    return `<div class="field"><label>${label}</label>
      <div class="color-row">
        <input type="color" data-section="${section}" data-key="${key}" value="${v||defaultHex}" ${!v?'style="opacity:0.4"':''}/>
        <input type="text"  data-section="${section}" data-key="${key}" value="${v}" placeholder="var(--primary-color) ou #hex" class="color-text"/>
      </div></div>`;
  }

  _iconPicker(label, section, key) {
    const v = this._get(section, key) || '';
    return `<div class="field">
      <label>${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:10px">parcourir MDI ↗</a></label>
      <div class="icon-row">
        <input type="text" data-section="${section}" data-key="${key}" value="${v}" placeholder="mdi:home" class="icon-input"/>
        <div class="icon-preview" data-preview="${section}-${key}"></div>
      </div>
    </div>`;
  }

  _padding() {
    const raw = this._get('shared', 'padding') || '8px 16px';
    const parts = String(raw).replace(/px/g,'').trim().split(/\s+/);
    const v = parseFloat(parts[0]) || 8;
    const h = parseFloat(parts[1] ?? parts[0]) || 16;
    return `<div class="field"><label>Padding</label>
      <div style="display:flex;gap:6px;align-items:center">
        <input type="number" data-padding="v" value="${v}" min="0" step="1" placeholder="8" style="flex:1"/>
        <span style="font-size:11px;color:var(--secondary-text-color)">px ↕</span>
        <input type="number" data-padding="h" value="${h}" min="0" step="1" placeholder="16" style="flex:1"/>
        <span style="font-size:11px;color:var(--secondary-text-color)">px ↔</span>
      </div></div>`;
  }

  _number(label, section, key, min='0', max='100', step='1') {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <input type="number" data-section="${section}" data-key="${key}"
             value="${v}" min="${min}" max="${max}" step="${step}"/>
    </div>`;
  }

  _fontSelect(label, section, key) {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <select data-section="${section}" data-key="${key}">
        <option value="" ${!v?'selected':''}>— thème HA —</option>
        ${NHV2_FONTS.map(f => `<option value="${f}" ${v===f?'selected':''}>${f}</option>`).join('')}
      </select></div>`;
  }

  _attachListeners() {
    // Tabs — event delegation sur this pour éviter les interceptions HA
    this._on(this, 'click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      this._tab = btn.dataset.tab;
      this.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b===btn));
      ['title','subtitle','shared'].forEach(t => {
        const el = this.querySelector(`#tab-${t}`);
        if (el) el.classList.toggle('section-hidden', t !== this._tab);
      });
    });

    // Mode select (root level)
    const modeEl = this.querySelector('[data-root="mode"]');
    if (modeEl) this._on(modeEl, 'change', e => { this._setRoot('mode', e.target.value); });

    // Icon previews — ha-icon via createElement dans le preview div
    this.querySelectorAll('.icon-preview[data-preview]').forEach(preview => {
      const [section, key] = preview.dataset.preview.split('-');
      const inp = this.querySelector(`input[data-section="${section}"][data-key="${key}"]`);
      const _updatePreview = () => {
        const val = inp?.value?.trim() || '';
        preview.innerHTML = '';
        if (val.match(/^mdi:[a-zA-Z0-9_-]+$/)) {
          const ico = document.createElement('ha-icon');
          ico.setAttribute('icon', val);
          ico.style.cssText = '--mdc-icon-size:20px';
          preview.appendChild(ico);
        }
      };
      if (inp) this._on(inp, 'input', _updatePreview);
      _updatePreview();
    });

    // Padding inputs (↕ / ↔)
    this.querySelectorAll('[data-padding]').forEach(inp => {
      this._on(inp, 'input', () => {
        const vEl = this.querySelector('[data-padding="v"]');
        const hEl = this.querySelector('[data-padding="h"]');
        const v = parseFloat(vEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        this._set('shared', 'padding', `${v}px ${h}px`);
      });
    });

    // All section inputs
    this.querySelectorAll('[data-section][data-key]').forEach(inp => {
      const section = inp.dataset.section;
      const key     = inp.dataset.key;
      const isPx    = inp.dataset.px === '1';
      const isSelect   = inp.tagName === 'SELECT';
      const isCheckbox = inp.type === 'checkbox';
      const isNumber   = inp.type === 'number' && !isPx;
      const ev = (isCheckbox || isSelect) ? 'change' : 'input';
      this._on(inp, ev, () => {
        let val;
        if (isCheckbox)    val = inp.checked;
        else if (isPx)     val = inp.value !== '' ? `${inp.value}px` : null;
        else if (isNumber) val = inp.value !== '' ? parseFloat(inp.value) : null;
        else               val = inp.value || null;
        this._set(section, key, val);
      });
    });
  }

  _syncEditor() {
    this.querySelectorAll('[data-section][data-key]').forEach(inp => {
      if (document.activeElement === inp) return;
      const v = this._get(inp.dataset.section, inp.dataset.key);
      if (inp.type === 'checkbox') {
        inp.checked = !!v;
      } else {
        const newVal = v ?? '';
        // Pour les number/px : comparer numériquement pour éviter d'écraser "1" pendant qu'on tape "14"
        if (inp.type === 'number' || inp.dataset.px === '1') {
          const cur = parseFloat(inp.value);
          const nxt = parseFloat(newVal);
          if (!isNaN(cur) && !isNaN(nxt) && cur === nxt) return;
          if (inp.value === '' && newVal === '') return;
        }
        if (inp.value !== String(newVal)) inp.value = newVal;
      }
    });
    const modeEl = this.querySelector('[data-root="mode"]');
    if (modeEl && document.activeElement !== modeEl) modeEl.value = this._config?.mode ?? 'title';

    // Padding inputs
    const raw = this._get('shared', 'padding') || '8px 16px';
    const parts = String(raw).replace(/px/g,'').trim().split(/\s+/);
    const pv = parseFloat(parts[0]) || 8;
    const ph = parseFloat(parts[1] ?? parts[0]) || 16;
    const vEl = this.querySelector('[data-padding="v"]');
    const hEl = this.querySelector('[data-padding="h"]');
    if (vEl && document.activeElement !== vEl && parseFloat(vEl.value) !== pv) vEl.value = pv;
    if (hEl && document.activeElement !== hEl && parseFloat(hEl.value) !== ph) hEl.value = ph;
  }
}

customElements.define('neon-header-card-v2-editor', NeonHeaderCardV2Editor);

// ════════════════════════════════════════════════════════════════
//  CARD
// ════════════════════════════════════════════════════════════════
class NeonHeaderCardV2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._rendered  = false;
    this._rafId     = null;
    this._ro        = null;
    this._ac        = null;
    this._renderKey = null;
    this._fontLoaded = new Set();
    // Random animation offsets — frozen at construction
    this._flickDur  = nhv2Rnd(3.5, 5.5);
    this._flickOff  = nhv2Rnd(-2, 0);
    this._scanDur   = nhv2Rnd(6, 10);
  }

  static getConfigElement() { return document.createElement('neon-header-card-v2-editor'); }
  static getStubConfig()    { return { mode: 'title', title: { text: 'Mon Dashboard', icon: 'mdi:home' }, subtitle: { text: '' }, shared: {} }; }

  setConfig(raw) {
    const newConfig = nhv2BuildConfig(raw);
    const newKey = JSON.stringify(newConfig);
    if (newKey === this._renderKey) return;
    this._config = newConfig;
    this._renderKey = newKey;
    // Force re-render on next hass update
    this._rendered = false;
    // If already in DOM with hass, re-render immediately
    if (this._hass && this.isConnected) {
      this._cleanup();
      this._render();
    }
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    const hasCard = !!this.shadowRoot.querySelector('ha-card.nhv2-card');
    const hasBaseStyle = !!this.shadowRoot.querySelector('#nhv2-style');
    if (!hasCard || !hasBaseStyle) { this._render(); return; }
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._updateText();
    });
  }

  getCardSize() {
    const mode = this._config?.mode ?? 'title';
    return mode === 'subtitle' ? 1 : mode === 'both' ? 2 : 2;
  }

  _cleanup() {
    if (this._ac)    { this._ac.abort();                  this._ac = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ro)    { this._ro.disconnect();             this._ro = null; }
  }

  connectedCallback() {
    // Tab switch: shadow DOM content persists — just re-attach observers, no re-render
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card.nhv2-card');
    if (card && this._rendered) {
      this._reattachObservers(card);
      // Refresh text in case hass updated while disconnected
      if (this._hass) this._updateText();
    }
  }

  disconnectedCallback() {
    this._cleanup();
  }

  _loadFont(family) {
    if (!family || this._fontLoaded.has(family)) return;
    nhv2LoadFont(family);
    this._fontLoaded.add(family);
  }

  _navigate(path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _updateText() {
    if (!this.shadowRoot || !this._config) return;
    const c = this._config;
    const mode = c.mode;

    if (mode === 'title' || mode === 'both') {
      const el = this.shadowRoot.querySelector('.nhv2-title');
      if (el) el.textContent = nhv2ParseTemplate(this._hass, c.title.text) || '';
    }
    if (mode === 'subtitle' || mode === 'both') {
      const el = this.shadowRoot.querySelector('.nhv2-subtitle');
      if (el) {
        const html = nhv2SanitizeSubtitle(nhv2ParseTemplate(this._hass, c.subtitle.text) || '');
        // ne réécrire que si le HTML a changé → sinon innerHTML= détruirait le DOM
        // et RELANCERAIT toutes les animations CSS à 0% (saccade des headers animés)
        if (el.innerHTML !== html) el.innerHTML = html;
      }
    }
  }


  _render() {
    if (!this._config) return;
    const c    = this._config;
    const t    = c.title;
    const s    = c.subtitle;
    const sh   = c.shared;
    const mode = c.mode;
    const showTitle    = mode === 'title'    || mode === 'both';
    const showSubtitle = mode === 'subtitle' || mode === 'both';

    // Fonts
    if (t.font_family)  this._loadFont(t.font_family);
    if (s.font_family)  this._loadFont(s.font_family);
    if (sh.font_family) this._loadFont(sh.font_family);

    // ── Neon glow helper — cœur blanc + 3 couches couleur ──────
    const _neonGlow = (color, size) => {
      if (!color) return '';
      const s = parseInt(size) || 10;
      return `text-shadow:0 0 ${Math.round(s*0.2)}px #fff,0 0 ${Math.round(s*0.4)}px ${color},0 0 ${Math.round(s*0.8)}px ${color},0 0 ${s}px ${color};`;
    };

    // ── Title computed ─────────────────────────────────────────
    const tFontFamily  = t.font_family  ? `'${t.font_family}', var(--primary-font-family, sans-serif)` : 'var(--primary-font-family, sans-serif)';
    const tFontSize    = `${parseFloat(t.font_size)||24}px`;
    const tFontWeight  = `${t.font_weight||600}`;
    const tColor       = t.color || 'var(--ha-card-header-color, var(--primary-text-color))';
    const tIconColor   = t.icon_color || tColor;
    const tIconSize    = t.icon_size ? `${parseFloat(t.icon_size)}px` : `calc(${tFontSize} * 1.2)`;
    const tLetterSp    = t.letter_spacing ? `${parseFloat(t.letter_spacing)}px` : '0.02em';
    const tGlowColor   = t.glow_color || 'var(--primary-color, #00E8FF)';
    const tGlowSize    = parseFloat(t.glow_size)||12;
    const tGlowShadow  = t.text_shadow
      ? `text-shadow: ${t.text_shadow};`
      : t.glow ? _neonGlow(tGlowColor, tGlowSize) : '';
    const tGradFrom    = t.gradient_from || 'var(--primary-color, #00E8FF)';
    const tGradTo      = t.gradient_to   || 'var(--accent-color, #FF50A0)';
    const tGradCSS     = t.gradient ? `background:linear-gradient(90deg,${tGradFrom},${tGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;` : '';
    const tFlickAnim   = t.flicker  ? `animation:nhv2-flicker ${this._flickDur}s ease-in-out infinite ${this._flickOff}s;` : '';

    // ── Subtitle computed ──────────────────────────────────────
    const sFontFamily  = s.font_family ? `'${s.font_family}', var(--primary-font-family, sans-serif)` : tFontFamily;
    const sFontSize    = `${parseFloat(s.font_size)||13}px`;
    const sColor       = s.color || 'var(--secondary-text-color, #888)';
    const sIconColor   = s.icon_color || sColor;
    const sIconSize    = s.icon_size ? `${parseFloat(s.icon_size)}px` : sFontSize;
    const sLetterSp    = s.letter_spacing ? `${parseFloat(s.letter_spacing)}px` : 'normal';
    const sGlowColor   = s.glow_color || 'var(--accent-color, #FF50A0)';
    const sGlowSize    = parseFloat(s.glow_size)||10;
    const sGlowShadow  = s.glow ? _neonGlow(sGlowColor, sGlowSize) : '';
    const sGradFrom    = s.gradient_from || 'var(--primary-color, #00E8FF)';
    const sGradTo      = s.gradient_to   || 'var(--accent-color, #FF50A0)';
    const sGradCSS     = s.gradient ? `background:linear-gradient(90deg,${sGradFrom},${sGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;` : '';
    const sFlickAnim   = s.flicker  ? `animation:nhv2-flicker ${this._flickDur}s ease-in-out infinite ${this._flickOff}s;` : '';

    // ── Shared computed ────────────────────────────────────────
    const alignV = { top:'flex-start', center:'center', bottom:'flex-end' }[sh.align_v] || 'center';
    const alignH = { left:'flex-start', center:'center', right:'flex-end' }[sh.align_h] || 'flex-start';
    const textAlign = sh.align_h || 'left';

    const hasIcon    = mode === 'subtitle' ? !!s.icon : !!t.icon;
    const activeIcon = mode === 'subtitle' ? s.icon : t.icon;
    const iconPos    = mode === 'subtitle' ? s.icon_position : t.icon_position;
    const iconRight  = iconPos === 'right';
    const iconTop    = iconPos === 'top';
    const flexDir    = iconTop ? 'column' : iconRight ? 'row-reverse' : 'row';
    const activeIconColor = mode === 'subtitle' ? sIconColor : tIconColor;
    const activeIconSize  = mode === 'subtitle' ? sIconSize  : tIconSize;
    const activeGlowColor = mode === 'subtitle' ? sGlowColor : tGlowColor;
    const activeGlowSize  = mode === 'subtitle' ? sGlowSize  : tGlowSize;
    const activeGlowEnabled = mode === 'subtitle' ? s.glow : t.glow;

    // bg
    let bgStyle = '';
    if (sh.bg_color) {
      const hex = sh.bg_color.replace('#','');
      if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
        bgStyle = `background:rgba(${r},${g},${b},${sh.bg_opacity??1});`;
      } else {
        bgStyle = `background:${sh.bg_color};`;
      }
    } else if (sh.bg_opacity != null) {
      bgStyle = `background:rgba(var(--rgb-card-background-color,255,255,255),${sh.bg_opacity});`;
    }

    const blurNum = parseFloat(sh.bg_blur);
    const blurVal = (!isNaN(blurNum) && blurNum > 0) ? `${blurNum}px` : (sh.bg_blur===true ? '8px' : '');

    const hasBorder = !!(sh.border_color || sh.border_width || (sh.border_style && sh.border_style !== 'solid'));
    const borderCss = hasBorder
      ? `border:${sh.border_width||'1px'} ${sh.border_style||'solid'} ${sh.border_color||'var(--divider-color)'};` : '';
    const radiusCss = sh.border_radius ? `border-radius:${parseFloat(sh.border_radius)}px;` : '';

    const glowBoxShadow = t.glow
      ? `box-shadow:var(--ha-card-box-shadow,none),0 0 ${tGlowSize*2}px ${tGlowColor}44;` : '';

    const interactive = sh.tap_action !== 'none';

    this.shadowRoot.innerHTML = `
      <style id="nhv2-style">
        :host {
          display: block;
          contain: layout style;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        ha-card.nhv2-card {
          contain: layout style;
          box-sizing: border-box;
          width: 100%;
          position: relative;
          overflow: visible;
          ${bgStyle || ''}
          ${glowBoxShadow || ''}
          ${radiusCss || ''}
          ${blurVal ? `backdrop-filter: blur(${blurVal}); -webkit-backdrop-filter: blur(${blurVal});` : ''}
          ${hasBorder ? borderCss : ''}
          ${t.hover_glitch ? 'transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);' : ''}
          /* ── Theme RGB vars ── */
          --nhv2-uv: var(--rgb-primary-color, 98,0,234);
          --nhv2-cy: var(--rgb-accent-color, 0,255,249);
          --nhv2-bl: var(--rgb-blacklight-color, 180,0,255);
          --nhv2-er: var(--rgb-error-color, 255,45,107);
        }

        @keyframes nhv2-flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity:1; }
          20%,24%,55% { opacity:.6; }
        }

        @keyframes nhv2-scan-scroll {
          from { transform:translateY(0) translateZ(0); }
          to   { transform:translateY(50%) translateZ(0); }
        }

        @keyframes nhv2-scan-flicker {
          0%,100% { opacity:0; }
          8%  { opacity:0.04; } 9%  { opacity:0; }
          41% { opacity:0.06; } 42% { opacity:0; }
          76% { opacity:0.03; } 77% { opacity:0; }
        }

        @keyframes nhv2-card-glitch {
          0%,100% { transform:translateY(-10px) scale(1.03) translateZ(0); }
          15% { transform:translateY(-10px) scale(1.03) translate(-6px,4px) translateZ(0); filter:drop-shadow(6px 0 rgba(var(--nhv2-cy),1)) drop-shadow(-6px 0 rgba(var(--nhv2-er),1)); }
          30% { transform:translateY(-10px) scale(1.03) translate(6px,-4px) translateZ(0); filter:drop-shadow(-6px 0 rgba(var(--nhv2-bl),1)) drop-shadow(6px 0 rgba(var(--nhv2-er),1)); }
          45% { transform:translateY(-10px) scale(1.03) translate(-4px,3px) translateZ(0); filter:drop-shadow(5px 5px rgba(var(--nhv2-cy),1)) drop-shadow(-5px -5px rgba(var(--nhv2-er),1)); }
          60% { transform:translateY(-10px) scale(1.03) translate(5px,-2px) translateZ(0); }
          75% { transform:translateY(-10px) scale(1.03) translate(-3px,0) translateZ(0); }
        }

        @keyframes nhv2-icon-glitch {
          0%,100% { transform:scale(1) rotate(0deg) translateZ(0); }
          20% { transform:scale(1.15) rotate(-12deg) translateZ(0); }
          40% { transform:scale(1.2) rotate(12deg) translateZ(0); }
          60% { transform:scale(1.15) rotate(-8deg) translateZ(0); }
          80% { transform:scale(1.08) rotate(5deg) translateZ(0); }
        }

        @keyframes nhv2-text-glitch {
          0%,100% { transform:translate(0,0) translateZ(0); }
          25% { transform:translate(-4px,0) translateZ(0); text-shadow:4px 0 rgba(var(--nhv2-cy),1),-4px 0 rgba(var(--nhv2-er),1); }
          50% { transform:translate(4px,0) translateZ(0);  text-shadow:-4px 0 rgba(var(--nhv2-bl),1),4px 0 rgba(var(--nhv2-er),1); }
          75% { transform:translate(-3px,0) translateZ(0); text-shadow:3px 0 rgba(var(--nhv2-bl),1),0 0 15px rgba(var(--nhv2-cy),0.8); }
        }

        /* ── Keyframes "réacteur" (headers monitoring type Pi) ── */
        @keyframes nhv2-core-pulse {
          0%,100% { transform:scale(1) translateZ(0); filter:brightness(1); }
          50%     { transform:scale(1.04) translateZ(0); filter:brightness(1.25); }
        }
        /* glow qui respire SANS transform (pas de conflit géométrique avec les rotations) */
        @keyframes nhv2-core-glow {
          0%,100% { filter:brightness(0.96); }
          50%     { filter:brightness(1.18); }
        }
        @keyframes nhv2-ring-spin {
          from { transform:rotate(0deg) translateZ(0); }
          to   { transform:rotate(360deg) translateZ(0); }
        }
        @keyframes nhv2-ring-spin-rev {
          from { transform:rotate(360deg) translateZ(0); }
          to   { transform:rotate(0deg) translateZ(0); }
        }
        @keyframes nhv2-data-flow {
          from { transform:translateY(0) translateZ(0); }
          to   { transform:translateY(-50%) translateZ(0); }
        }
        /* GPU pur : pulse via opacity seul (le glow box-shadow reste STATIQUE en inline) */
        @keyframes nhv2-thermo-wave {
          0%,100% { opacity:0.8; }
          50%     { opacity:1; }
        }
        @keyframes nhv2-cell-charge {
          0%,100% { opacity:0.75; }
          50%     { opacity:1; }
        }
        /* GPU pur : la bande brillante (width:60%) traverse via transform */
        @keyframes nhv2-shimmer {
          from { transform:translateX(-180%) translateZ(0); }
          to   { transform:translateX(280%) translateZ(0); }
        }
        /* ── Keyframes "flux de données" (headers type Pi-hole / filtre DNS) ── */
        @keyframes nhv2-stream-x {
          from { transform:translateX(-50%) translateZ(0); }
          to   { transform:translateX(0) translateZ(0); }
        }
        @keyframes nhv2-stream-x-rev {
          from { transform:translateX(0) translateZ(0); }
          to   { transform:translateX(-50%) translateZ(0); }
        }
        /* impulsion qui parcourt une fibre — GPU pur (transform au lieu de left).
           L'impulsion est posée à left:0 dans une piste overflow:hidden width:100%,
           et on la translate de -110% (hors champ gauche) à +1100% (hors champ droit).
           Les % de translateX se réfèrent à la largeur de l'élément (petit), d'où les
           grandes valeurs pour couvrir toute la piste quelle que soit sa largeur. */
        @keyframes nhv2-pulse-travel {
          0%   { transform:translateX(-110%) translateZ(0); opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { transform:translateX(1100%) translateZ(0); opacity:0; }
        }
        @keyframes nhv2-pulse-travel-rev {
          0%   { transform:translateX(1100%) translateZ(0); opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { transform:translateX(-110%) translateZ(0); opacity:0; }
        }
        @keyframes nhv2-fiber-glow {
          0%,100% { opacity:0.5; }
          50%     { opacity:0.85; }
        }
        @keyframes nhv2-filter-scan {
          0%,100% { transform:translateY(-50%) translateZ(0); opacity:0; }
          12%     { opacity:0.9; }
          50%     { transform:translateY(50%) translateZ(0); opacity:0.9; }
          88%     { opacity:0.9; }
        }
        /* GPU pur : pulse via opacity seul (le glow box-shadow reste STATIQUE en inline) */
        @keyframes nhv2-filter-glow {
          0%,100% { opacity:0.65; }
          50%     { opacity:1; }
        }
        @keyframes nhv2-block-flash {
          0%,100% { opacity:0.35; transform:scale(1) translateZ(0); }
          50%     { opacity:1;    transform:scale(1.25) translateZ(0); }
        }

        .nhv2-wrap, .nhv2-wrap *, .nhv2-icon-wrap, .nhv2-text-wrap, .nhv2-title, .nhv2-subtitle {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        ${t.scanline ? `
        .nhv2-scanlines {
          position:absolute; inset:0; overflow:hidden;
          pointer-events:none; z-index:2; border-radius:inherit;
        }
        .nhv2-scanlines::before {
          content:' '; display:block; position:absolute; left:0; right:0; top:-100%; height:200%;
          background:
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05));
          background-size:100% 3px, 3px 100%;
          animation:nhv2-scan-scroll ${(this._scanDur*1.5).toFixed(1)}s linear infinite;
          will-change:transform; transform:translateZ(0);
        }
        .nhv2-scanlines::after {
          content:' '; display:block; position:absolute; inset:0;
          background:rgba(18,16,16,0.08); opacity:0;
          animation:nhv2-scan-flicker 4s step-end infinite;
        }
        ` : ''}

        ${t.hover_glitch ? `
        ha-card.nhv2-card:hover { transform:translateY(-8px) scale(1.02) translateZ(0); animation:nhv2-card-glitch 0.4s cubic-bezier(0.4,0,0.2,1); }
        ha-card.nhv2-card:hover .nhv2-title { animation:nhv2-text-glitch 0.4s cubic-bezier(0.4,0,0.2,1); }
        ha-card.nhv2-card:hover .nhv2-icon-wrap ha-icon { animation:nhv2-icon-glitch 0.4s cubic-bezier(0.4,0,0.2,1); }
        ` : ''}

        .nhv2-wrap {
          display: flex;
          flex-direction: ${flexDir};
          align-items: ${alignV};
          justify-content: ${alignH};
          gap: ${iconTop ? '6px' : '10px'};
          padding: ${sh.padding};
          ${mode === 'both' ? 'padding-bottom: 12px; margin-bottom: 0;' : ''}
          position: relative;
          overflow: visible;
        }

        .nhv2-icon-wrap {
          display: ${hasIcon ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: visible;
        }

        .nhv2-icon-wrap ha-icon {
          --mdc-icon-size: ${activeIconSize};
          color: ${activeIconColor};
          overflow: visible;
          ${activeGlowEnabled
            ? mode === 'subtitle'
              ? `filter:drop-shadow(0 0 ${Math.round(activeGlowSize*.3)}px ${activeGlowColor}) drop-shadow(0 0 ${Math.round(activeGlowSize*.6)}px ${activeGlowColor});`
              : `filter:drop-shadow(0 0 ${Math.round(activeGlowSize*.2)}px #fff) drop-shadow(0 0 ${Math.round(activeGlowSize*.4)}px ${activeGlowColor}) drop-shadow(0 0 ${Math.round(activeGlowSize*.8)}px ${activeGlowColor}) drop-shadow(0 0 ${activeGlowSize}px ${activeGlowColor});`
            : ''}
          ${t.flicker && !t.hover_glitch ? tFlickAnim : ''}
        }

        .nhv2-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-align: ${textAlign};
          ${iconTop ? 'align-items:center;' : ''}
          ${sh.align_h !== 'center' ? 'flex: 1;' : ''}
          min-width: 0;
          overflow: visible;
        }

        .nhv2-title {
          display: ${showTitle ? 'block' : 'none'};
          font-family: ${tFontFamily};
          font-size: ${tFontSize};
          font-weight: ${tFontWeight};
          letter-spacing: ${tLetterSp};
          line-height: 1.2;
          overflow: visible;
          ${t.uppercase ? 'text-transform:uppercase;' : ''}
          ${t.italic    ? 'font-style:italic;' : ''}
          ${tGradCSS || `color:${tColor};`}
          ${!t.hover_glitch ? tGlowShadow : ''}
          ${!t.hover_glitch ? tFlickAnim  : ''}
          ${t.hover_glitch  ? 'transition:transform 0.2s, text-shadow 0.2s;' : ''}
        }

        .nhv2-subtitle {
          display: ${showSubtitle ? 'block' : 'none'};
          font-family: ${sFontFamily};
          font-size: ${sFontSize};
          font-weight: 400;
          letter-spacing: ${sLetterSp};
          line-height: 1.4;
          overflow: visible;
          ${s.uppercase ? 'text-transform:uppercase;' : ''}
          ${s.italic    ? 'font-style:italic;' : ''}
          ${sGradCSS || `color:${sColor};`}
          ${sGlowShadow}
          ${sFlickAnim}
        }

        .nhv2-subtitle ha-icon {
          --mdc-icon-size: ${sIconSize};
          color: ${sIconColor};
          vertical-align: middle;
          display: inline-flex;
          align-items: center;
          line-height: 1;
          margin: 0 2px;
        }

        @media (max-width: 1100px) {
          .nhv2-title    { font-size: ${Math.max(11, Math.round((parseFloat(t.font_size)||24)*.85))}px; }
          .nhv2-subtitle { font-size: ${Math.max(10, Math.round((parseFloat(s.font_size)||13)*.9))}px; }
        }

        ${(mode === 'both' && !t.scanline) ? `
        .nhv2-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(var(--nhv2-uv), .55) 20%,
            rgba(var(--nhv2-cy), .3) 50%,
            rgba(var(--nhv2-uv), .55) 80%,
            transparent);
          pointer-events: none;
        }` : ''}
      </style>

      <ha-card class="nhv2-card"${interactive?' style="cursor:pointer"':''}>
        <div class="nhv2-wrap">
          ${t.scanline ? '<div class="nhv2-scanlines" aria-hidden="true"></div>' : ''}
          <div class="nhv2-icon-wrap"></div>
          <div class="nhv2-text-wrap">
            <div class="nhv2-title"></div>
            <div class="nhv2-subtitle"></div>
          </div>
        </div>
      </ha-card>
    `;

    // ha-icon via createElement (§13)
    if (hasIcon) {
      const iconEl = document.createElement('ha-icon');
      iconEl.setAttribute('icon', activeIcon);
      this.shadowRoot.querySelector('.nhv2-icon-wrap').appendChild(iconEl);
    }

    this._updateText();

    // Attach observers + click handler
    this._reattachObservers(this.shadowRoot.querySelector('ha-card.nhv2-card'));

    this._rendered = true;
  }

  _reattachObservers(card) {
    if (!card) return;
    // ResizeObserver
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width === 0) return;
        }
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
          this._rafId = 0;
          this._updateText();
        });
      });
      this._ro.observe(card);
    }
    // Click handler
    const sh = this._config?.shared;
    const interactive = sh && sh.tap_action !== 'none';
    if (interactive && !this._ac) {
      this._ac = new AbortController();
      card.addEventListener('click', () => {
        if (sh.tap_action === 'navigate' && sh.navigation_path) this._navigate(sh.navigation_path);
        else if (sh.tap_action === 'more-info' && sh.entity) this._moreInfo(sh.entity);
      }, { signal: this._ac.signal });
    }
  }
}

customElements.define('neon-header-card-v2', NeonHeaderCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neon-header-card-v2',
  name: 'Neon Header Card v2',
  description: 'Header card Neo Tokyo — modes titre, sous-titre, les deux',
  preview: true,
});

console.info(
  '%c NEON-HEADER-CARD-V2 %c v' + NHV2_VERSION + ' ',
  'color:#00fff9;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:#FF50A0;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:0 3px 3px 0',
);

console.info(
  '%c 🏠 neon-header-card-v2 v' + NHV2_VERSION + ' %c Neo Tokyo ',
  'background:#1E90FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#00D4FF;padding:2px 4px;border-radius:0 3px 3px 0;'
);
