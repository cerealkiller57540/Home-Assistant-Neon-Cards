/**
 * vw-car-card v0.3.0
 * - Layout responsive (stretch tout format)
 * - Tiles style heat pump (glass block, borders saturées)
 * - 4 coins status (lock door / lock trunk / hood / windows)
 * - Fond radial bleu VW
 * - Engrenage ⚙️ pour ouvrir seuil solaire
 * - Stop charge + force refresh auto
 * - Hérite du thème Neo Tokyo (var CSS)
 */

const VERSION = '0.5.0';

const COLORS = {
  primary:     '#00D4FF',
  accent:      '#9D4EDD',
  battBorder:  '#00D4FF',
  fillTop:     '#00D4FF',
  fillMid:     '#9D4EDD',
  fillBottom:  '#E0115F',
};

function buildBatterySVG(batt, isCharging, customColors, uid = 'nb') {
  const C = customColors ? {
    primary:    customColors.primary    || COLORS.primary,
    battBorder: customColors.border     || COLORS.battBorder,
    fillTop:    customColors.fill_top   || COLORS.fillTop,
    fillMid:    customColors.fill_mid   || COLORS.fillMid,
    fillBottom: customColors.fill_bottom|| COLORS.fillBottom,
  } : COLORS;
  const W = 160, H = 250;
  const bx = 18, by = 40, bw = W - 30, bh = H - 58;
  const ix = bx + 7, iy = by + 7, iw = bw - 14, ih = bh - 14;
  const fh = Math.max(2, Math.round(batt * ih / 100));
  const fy = iy + ih - fh;
  const s25 = iy + ih * 0.75, s50 = iy + ih * 0.5, s75 = iy + ih * 0.25;

  const ticks = [[s75, 75], [s50, 50], [s25, 25]].map(([sy, v]) => `
    <line x1="${ix+3}" y1="${sy.toFixed(1)}" x2="${ix+iw-3}" y2="${sy.toFixed(1)}"
      stroke="#070B14" stroke-width="1.5" opacity="0.8"/>
    <text x="${bx+bw+6}" y="${sy.toFixed(1)}" fill="${C.primary}" font-size="11"
      font-family="Rajdhani,monospace" dominant-baseline="middle" opacity="0.7">${v}</text>
  `).join('');

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"
    style="overflow:visible;display:block;width:100%;height:100%;">
    <defs>
      <filter id="${uid}g" x="-60%" y="-40%" width="220%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10"  result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="${uid}f" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%"   stop-color="${C.fillBottom}" stop-opacity="0.95"/>
        <stop offset="45%"  stop-color="${C.fillMid}"    stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${C.fillTop}"    stop-opacity="0.88"/>
      </linearGradient>
      <linearGradient id="${uid}sh" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="white" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="white" stop-opacity="0.02"/>
      </linearGradient>
      <clipPath id="${uid}c">
        <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="4"/>
      </clipPath>
    </defs>

    <rect x="${bx+bw/2-19}" y="${by-17}" width="38" height="21" rx="7"
      fill="#0D1A28" stroke="${C.battBorder}" stroke-width="1.8" filter="url(#${uid}g)"/>
    <rect x="${bx+bw/2-11}" y="${by-12}" width="22" height="9" rx="2.5"
      fill="${C.battBorder}" fill-opacity="0.18"/>

    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="11"
      fill="#0D1A28" stroke="${C.battBorder}" stroke-width="2.2" filter="url(#${uid}g)"/>

    <g clip-path="url(#${uid}c)">
      <rect x="${ix}" y="${fy}" width="${iw}" height="${fh}" fill="url(#${uid}f)" rx="3">
        ${isCharging ? '<animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/>' : ''}
      </rect>
      <rect x="${ix}" y="${fy}" width="${Math.round(iw*0.38)}" height="${fh}"
        fill="url(#${uid}sh)" rx="3"/>
      ${isCharging ? `
        <rect x="${ix}" y="${fy}" width="${iw}" height="3" fill="white" rx="1">
          <animate attributeName="fill-opacity" values="0.06;0.45;0.06" dur="1.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="${ix}" y="${fy+fh}" width="${iw}" height="22" fill="white">
          <animate attributeName="y" values="${fy+fh};${fy}" dur="1.6s" repeatCount="indefinite" calcMode="linear"/>
          <animate attributeName="fill-opacity" values="0;0.06;0.10;0.04;0" dur="1.6s" repeatCount="indefinite"/>
        </rect>
        <rect x="${ix}" y="${fy+fh}" width="${iw}" height="4" fill="white" rx="1">
          <animate attributeName="y" values="${fy+fh};${fy}" dur="1.6s" repeatCount="indefinite" calcMode="linear"/>
          <animate attributeName="fill-opacity" values="0;0.9;0.9;0.85;0" dur="1.6s" repeatCount="indefinite"/>
        </rect>` : ''}
    </g>

    ${ticks}

    <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="4"
      fill="none" stroke="${C.battBorder}" stroke-width="0.5" stroke-opacity="0.2"/>

    <text x="${bx+bw/2}" y="${by+bh/2+6}"
      fill="${C.primary}" font-size="38" font-weight="700"
      font-family="Rajdhani,'Share Tech Mono',monospace"
      text-anchor="middle" dominant-baseline="middle">${batt}%</text>

    ${isCharging ? `
      <polygon
        points="${bx+bw/2+8},${by+24} ${bx+bw/2-7},${by+48} ${bx+bw/2+1},${by+48}
                ${bx+bw/2-9},${by+68} ${bx+bw/2+11},${by+42} ${bx+bw/2+4},${by+42}
                ${bx+bw/2+14},${by+24}"
        fill="${C.primary}" filter="url(#${uid}g)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
      </polygon>` : ''}
  </svg>`;
}

/* ═══════════════════════════════════════════════════════════════════
 *  EDITOR — template unifié (cf CARDS-EDITOR-TEMPLATE.md)
 *  N'éditer QUE _schema() ; le reste est canonique et identique partout.
 * ═══════════════════════════════════════════════════════════════════ */
const NEON_FONTS = [
  'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
  'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
  'DM Sans','Playfair Display','Cinzel',
];
class VwCarCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  // ── Cycle de vie (NE PAS toucher) ──────────────────────────────────
  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  set hass(h) { this._hass = h; this._fillDatalists(); }   // JAMAIS de render ici
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
      // retire l'objet parent s'il devient vide
      const parent = parts.slice(0, -1).reduce((a, k) => a && a[k], this._config);
      if (parent && typeof parent === 'object' && !Object.keys(parent).length) delete this._config[parts[0]];
    } else if (empty) { delete this._config[key]; }
    else { this._config[key] = value; }
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
    this._bindIconPreviews(true);   // resync previews sans recâbler
  }

  // ── Helpers de champ (signatures FIXES — ne pas réinventer) ────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); return d; }

  _text(key, label, ph = '') {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    row.wrap.appendChild(inp); return inp;
  }

  _number(key, label, { min, max, step = 1, ph = '' } = {}) {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'number'; if (min != null) inp.min = min; if (max != null) inp.max = max;
    inp.step = step; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => { const n = parseFloat(inp.value); this._set(key, isNaN(n) ? undefined : n); });
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

  // Couleur : TEXTE libre (accepte var/rgb/hex) + picker.
  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
    const row = this._row(label);
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key;
    txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    txt._pick = pick; txt._cssDefault = cssDefault;          // mémorisé pour _syncValues
    const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA'; };
    txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
    pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
    box.appendChild(txt); box.appendChild(pick); row.wrap.appendChild(box); refresh(); return txt;
  }

  // Résout une couleur CSS (hex / rgb / var(--…)) en #rrggbb via un témoin appliqué
  // dans l'éditeur (scope thème HA → les variables standard sont disponibles).
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

  // Icône : input + lien MDI + preview live (PAS de datalist).
  _icon(key, label) {
    const row = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true);
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
    inp.addEventListener('input', () => this._set(key, inp.value));
    box.appendChild(inp); box.appendChild(prev); row.wrap.appendChild(box); return inp;
  }

  // Entité : input + datalist (rempli par _fillDatalists quand hass arrive).
  _entity(key, label, prefix = '') {
    const row = this._row(label);
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `vwcar-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value.trim()));
    row.wrap.appendChild(inp); return inp;
  }

  // Liste déroulante. options = [string] OU [{value,label}]. emptyLabel = 1ère
  // option vide (= défaut), ex '— thème HA —' pour une police optionnelle.
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
    row.appendChild(lbl); row.appendChild(wrap); this.appendChild(row);
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
  }

  _fillDatalists() {
    if (!this._hass) return;
    this.querySelectorAll('input[data-prefix]').forEach(inp => {
      const id = inp.getAttribute('list'); if (!id) return;
      let dl = this.querySelector('#' + id);
      if (!dl) { dl = document.createElement('datalist'); dl.id = id; this.appendChild(dl); }
      const ids = Object.keys(this._hass.states).filter(e => e.startsWith(inp.dataset.prefix || '')).sort();
      if (dl.childElementCount === ids.length) return;   // déjà à jour
      dl.textContent = '';
      const frag = document.createDocumentFragment();
      ids.forEach(id2 => { const o = document.createElement('option'); o.value = id2;
        const fn = this._hass.states[id2].attributes?.friendly_name; if (fn && fn !== id2) o.label = fn; frag.appendChild(o); });
      dl.appendChild(frag);
    });
  }

  // ── CSS commun (identique partout) ─────────────────────────────────
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
    this._section('Texte');
    this._text('header.title', 'Titre', 'ex: VOLKSWAGEN ID.4');
    this._icon('header.icon', 'Icône');
    this._text('header.subtitle', 'Sous-titre');

    this._section('Typographie');
    this._select('header.font', 'Police', NEON_FONTS, '— thème HA —');
    this._text('header.title_size', 'Taille', 'clamp(14px, 2.6cqi, 20px)');
    this._text('header.font_weight', 'Épaisseur', '600');
    this._toggle('header.uppercase', 'Majuscules');
    this._toggle('header.italic', 'Italique');
    this._text('header.letter_spacing', 'Espacement', 'clamp(1px, 0.5cqi, 3px)');

    this._section('Couleurs');
    this._color('header.color', 'Couleur texte', 'rgba(180,130,255,0.55)');
    this._color('header.icon_color', 'Couleur icône', 'rgba(180,130,255,0.55)');

    this._section('Effets');
    this._toggle('header.glow', 'Glow');
    this._toggle('header.gradient', 'Gradient');
    this._color('header.glow_color', 'Couleur glow', 'var(--primary-color, #00E8FF)');
    this._text('header.glow_size', 'Taille glow', '12');
    this._color('header.gradient_from', 'Gradient début', 'var(--primary-color, #00E8FF)');
    this._color('header.gradient_to', 'Gradient fin', 'var(--accent-color, #FF50A0)');
    this._toggle('header.flicker', 'Flicker');
  }
}
customElements.define('vw-car-card-editor', VwCarCardEditor);

class VwCarCard extends HTMLElement {
  // Cache module-level : une police Google donnée n'est injectée qu'une seule
  // fois même si plusieurs instances de la card (ou re-renders) la demandent.
  static _loadGoogleFont(family) {
    if (!VwCarCard._loadedFonts) VwCarCard._loadedFonts = new Set();
    if (VwCarCard._loadedFonts.has(family)) return;
    VwCarCard._loadedFonts.add(family);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;600;700;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = null;
    this._built = false;
    this._lastBatt = null;
    this._lastCharging = null;
    this._lastChargingRendered = null;
    this._refreshTimer = null;   // setTimeout for force-refresh cleanup
    this._abortController = null; // AbortController for event listeners
    this._rafId = null;           // RAF coalescing
    this._flickDur = 3.5 + Math.random() * 2;   // header flicker (bloc canonique)
    this._flickOff = -2 + Math.random() * 2;
  }

  setConfig(config) {
    // Reset on config change so full re-render happens
    clearTimeout(this._refreshTimer); this._refreshTimer = null;
    if (this._abortController) { this._abortController.abort(); this._abortController = null; }
    this._built = false;
    this._lastBatt = null;
    this._lastChargingRendered = null;
    const base = config.image_path || '/local/VW';
    const defaultSocEntity = 'sensor.wvwzzze18sp049976_battery_level';
    this._config = {
      entity:          config.entity || defaultSocEntity,
      charging_entity: config.charging_entity || config.charging_state_entity || 'sensor.wvwzzze18sp049976_charging_state',
      image:           config.image || `${base}/id4_2021_body.png`,
      battery_top:     config.battery_top ?? 24,
      battery_width:   config.battery_width ?? 26,
      battery_opacity: config.battery_opacity ?? 1,
      battery_colors:  config.battery_colors || null,
      image_path:      base,
      force_refresh:   config.force_refresh || 'button.wvwzzze18sp049976_force_data_refresh',
      solar_threshold_entity: config.solar_threshold_entity || null,
      // eu_data_act true (lecture seule, ex: vag_connect) -> pas de lock/trunk/hood/window par coin,
      // ces entités n'existent pas dans ce mode. false (ex: volkswagencarnet) -> 4 coins comme avant.
      corners: (config.eu_data_act ?? true) ? { tl: '', tr: '', bl: '', br: '' } : {
        tl: config.corner_tl || 'lock.wvwzzze18sp049976_door_locked',
        tr: config.corner_tr || 'lock.wvwzzze18sp049976_trunk_locked',
        bl: config.corner_bl || 'binary_sensor.wvwzzze18sp049976_hood_closed',
        br: config.corner_br || 'binary_sensor.wvwzzze18sp049976_windows_closed',
      },
      tiles: config.tiles || [
        { label: 'RANGE',   entity: 'sensor.wvwzzze18sp049976_electric_range',  unit: 'km', color: 'xenon' },
        { label: 'KM',      entity: 'sensor.wvwzzze18sp049976_odometer',        unit: 'km', color: 'argon' },
        { label: 'POWER',   entity: 'sensor.wvwzzze18sp049976_charging_power',  unit: 'W',  color: 'xenon' },
        { label: 'CABLE',   entity: 'binary_sensor.wvwzzze18sp049976_charging_cable_connected', unit: '', color: 'argon' },
      ],
      badges: config.badges || [],
      // eu_data_act: true = intégration lecture seule (ex: vag_connect) -> pas de switch de charge
      // distant ni de controls (solaire/smart/clim) puisque rien de ça n'est pilotable dans ce mode.
      // false = intégration complète (ex: volkswagencarnet) -> comportement inchangé.
      eu_data_act: config.eu_data_act ?? true,
      controls: (config.eu_data_act ?? true) ? [] : (config.controls || []),
      controls_columns: config.controls_columns ?? 2,
      charging_info: config.charging_info || [],
      header: config.header !== undefined ? config.header : {},
      footer: config.footer !== undefined ? config.footer : {},
      charge_switch: (config.eu_data_act ?? true) ? '' : (config.charge_switch || 'switch.wvwzzze18sp049976_charging'),
      layers: config.layers || [
        { id: 'door_fl', closed: 'id4_2021_door_front_left_closed.png',  open: 'id4_2021_door_front_left_open.png',  entity: 'binary_sensor.wvwzzze18sp049976_door_closed_left_front' },
        { id: 'door_fr', closed: 'id4_2021_door_front_right_closed.png', open: 'id4_2021_door_front_right_open.png', entity: 'binary_sensor.wvwzzze18sp049976_door_closed_right_front' },
        { id: 'door_rl', closed: 'id4_2021_door_rear_left_closed.png',   open: 'id4_2021_door_rear_left_open.png',   entity: 'binary_sensor.wvwzzze18sp049976_door_closed_left_back' },
        { id: 'door_rr', closed: 'id4_2021_door_rear_right_closed.png',  open: 'id4_2021_door_rear_right_open.png',  entity: 'binary_sensor.wvwzzze18sp049976_door_closed_right_back' },
        { id: 'trunk',   open: 'id4_2021_door_rear_open.png',             entity: 'binary_sensor.wvwzzze18sp049976_trunk_closed' },
        { id: 'hood',    open: 'id4_2021_engine_hood_open.png',           entity: 'binary_sensor.wvwzzze18sp049976_hood_closed' },
        { id: 'win_fl',  open: 'id4_2021_door_window_front_left_open.png',  entity: 'binary_sensor.wvwzzze18sp049976_window_closed_left_front' },
        { id: 'win_fr',  open: 'id4_2021_door_window_front_right_open.png', entity: 'binary_sensor.wvwzzze18sp049976_window_closed_right_front' },
        { id: 'win_rl',  open: 'id4_2021_door_window_rear_left_open.png',   entity: 'binary_sensor.wvwzzze18sp049976_window_closed_left_back' },
        { id: 'win_rr',  open: 'id4_2021_door_window_rear_right_open.png',  entity: 'binary_sensor.wvwzzze18sp049976_window_closed_right_back' },
        { id: 'light_l', open: 'id4_2021_lights_left_on.png',             entity: 'binary_sensor.wvwzzze18sp049976_parking_light' },
        { id: 'light_r', open: 'id4_2021_lights_right_on.png',            entity: 'binary_sensor.wvwzzze18sp049976_parking_light' },
      ],
    };

    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      const prevCharging = this._lastCharging;
      this._render();
      // Détection arrêt de charge → force refresh
      if (prevCharging === true && this._lastCharging === false && this._config.force_refresh) {
        clearTimeout(this._refreshTimer);
        this._refreshTimer = setTimeout(() => {
          this._refreshTimer = null;
          this._hass.callService('button', 'press', { entity_id: this._config.force_refresh });
        }, 2000);
      }
    });
  }

  connectedCallback() {
    const card = this.shadowRoot?.querySelector('ha-card');
    if (card && this._built) {
      // Tab return: re-attach listeners, refresh values
      this._bindControls();
      if (this._hass) this._updateDynamic();
    }
  }

  disconnectedCallback() {
    if (this._abortController) { this._abortController.abort(); this._abortController = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    clearTimeout(this._refreshTimer); this._refreshTimer = null;
  }

  getCardSize() { return 6; }

  static getConfigElement() {
    return document.createElement('vw-car-card-editor');
  }
  static getStubConfig() {
    return {
      header: { title: 'VOLKSWAGEN ID.4', icon: 'mdi:car-electric', glow: true },
    };
  }

  _isCharging() {
    if (this._config.charging_entity) {
      const cs = this._hass.states[this._config.charging_entity];
      return cs && ['on', 'charging', 'true'].includes(String(cs.state).toLowerCase());
    }
    return false;
  }

  _renderIcon(icon, size, color) {
    if (!icon) return '';
    if (String(icon).startsWith('mdi:')) {
      return `<ha-icon icon="${icon}" style="--mdc-icon-size:${size}px;color:${color};"></ha-icon>`;
    }
    return `<span style="font-size:${size}px;line-height:1;">${icon}</span>`;
  }

  _cornerState(entity) {
    const es = this._hass.states[entity];
    if (!es) return { ok: null, icon: 'mdi:help-circle-outline', label: '--' };
    const s = String(es.state).toLowerCase();
    const domain = entity.split('.')[0];
    // lock : locked = OK, unlocked = alerte
    if (domain === 'lock') {
      const ok = s === 'locked';
      if (entity.includes('trunk')) return { ok, icon: ok ? 'mdi:car-back' : 'mdi:car-back', label: ok ? 'Coffre' : 'Coffre !' };
      return { ok, icon: ok ? 'mdi:car-door-lock' : 'mdi:car-door', label: ok ? 'Portes' : 'Portes !' };
    }
    // binary_sensor "xxx_closed" : state off = fermé (OK), on = ouvert (alerte)
    if (domain === 'binary_sensor') {
      const ok = s === 'off';
      if (entity.includes('hood')) return { ok, icon: 'mdi:car', label: ok ? 'Capot' : 'Capot !' };
      if (entity.includes('window')) return { ok, icon: ok ? 'mdi:car-door' : 'mdi:window-open-variant', label: ok ? 'Vitres' : 'Vitres !' };
    }
    return { ok: null, icon: 'mdi:help-circle', label: s };
  }

  _buildCorner(entity, pos) {
    if (!entity) return '';
    const c = this._cornerState(entity);
    const color = c.ok === null ? 'rgba(255,255,255,0.25)'
                : c.ok ? 'rgba(var(--rgb-gas-krypton,46,229,182),1)'
                : 'rgba(var(--rgb-gas-radon,224,17,95),1)';
    const rgbVar = c.ok === null ? '255,255,255' : c.ok ? 'var(--rgb-gas-krypton,46,229,182)' : 'var(--rgb-gas-radon,224,17,95)';
    return `
      <div class="vw-corner vw-corner-${pos}" data-entity="${entity}" style="
        --corner-color:${color};
        --corner-rgb:${rgbVar};
      ">
        <ha-icon icon="${c.icon}"></ha-icon>
        <span class="vw-corner-lbl">${c.label}</span>
      </div>`;
  }

  _render() {
    if (!this._config || !this._hass) return;

    const st = this._hass.states[this._config.entity];
    const batt = st ? Math.round(parseFloat(st.state) || 0) : 0;
    const charging = this._isCharging();
    this._lastCharging = charging;

    // Rerender complet si batt/charging change, sinon update léger
    if (this._lastBatt === batt && this._lastChargingRendered === charging && this._built) {
      this._updateDynamic();
      return;
    }
    this._lastBatt = batt;
    this._lastChargingRendered = charging;
    this._built = true;

    const { image, battery_top, battery_width, battery_opacity, battery_colors, image_path, layers, corners } = this._config;

    const imgStyle = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;pointer-events:none;';
    const layerHTML = layers.map(layer => {
      const es = this._hass.states[layer.entity];
      const isOn = es && es.state === 'on';
      let html = '';
      if (layer.closed) {
        html += `<img src="${image_path}/${layer.closed}" style="${imgStyle}opacity:${isOn ? 0 : 1};transition:opacity 0.3s;" />`;
      }
      if (layer.open) {
        html += `<img src="${image_path}/${layer.open}" style="${imgStyle}opacity:${isOn ? 1 : 0};transition:opacity 0.3s;" />`;
      }
      return html;
    }).join('');

    const badgesHTML = this._buildBadgesHTML();
    const tilesHTML = this._buildTilesInner();
    const cornersHTML = `
      ${this._buildCorner(corners.tl, 'tl')}
      ${this._buildCorner(corners.tr, 'tr')}
      ${this._buildCorner(corners.bl, 'bl')}
      ${this._buildCorner(corners.br, 'br')}
    `;

    this.shadowRoot.innerHTML = `
      ${this._buildStyle()}
      <ha-card class="vw-card">

        ${this._buildNeonHeader()}
        ${badgesHTML ? `<div class="vw-header">${badgesHTML}</div>` : ''}

        <div class="vw-body" style="
          background-image: url('${image}');
        ">
          ${layerHTML}
          ${cornersHTML}
          <div class="vw-battery" style="
            top: ${battery_top}%;
            width: ${battery_width}%;
            opacity: ${battery_opacity};
          ">
            ${buildBatterySVG(batt, charging, battery_colors, 'vwb')}
          </div>
        </div>

        <div class="vw-tiles">${tilesHTML}</div>

        ${this._buildControlsHTML()}
      </ha-card>
    `;

    this._mountNeonHeaderIcon();
    this._bindControls();
  }

  _buildBadgesHTML() {
    const badges = this._config.badges || [];
    if (!badges.length) return '';
    return badges.map((badge, i) => {
      const bs = this._hass.states[badge.entity];
      let val = bs ? bs.state : '--';
      let bColor = badge.color || '#00D4FF';
      let bIcon = badge.icon || '';

      if (badge.map && badge.map[val]) {
        const m = badge.map[val];
        val = m.text || val;
        if (m.color) bColor = m.color;
        if (m.icon) bIcon = m.icon;
      } else if (!isNaN(val) && val !== '--' && val !== 'unavailable' && val !== 'unknown') {
        val = Math.round(parseFloat(val));
        if (badge.unit) val = val + badge.unit;
      }

      if (val === 'unavailable') { val = '--'; bColor = 'rgba(255,255,255,0.35)'; }

      // Engrenage si settings_entity défini sur ce badge
      const gear = badge.settings_entity
        ? `<span class="vw-badge-gear" data-entity="${badge.settings_entity}" title="Configurer">
             <ha-icon icon="mdi:cog"></ha-icon>
           </span>`
        : '';

      return `
        <div class="vw-badge-wrap" data-entity="${badge.entity}">
          <div class="vw-badge" style="
            color:${bColor};
            text-shadow:0 0 1px rgba(255,255,255,0.5), 0 0 6px ${bColor}, 0 0 13px ${bColor};
          ">
            ${bIcon ? (bIcon.startsWith('mdi:')
              ? `<ha-icon icon="${bIcon}" style="--mdc-icon-size:12px;color:${bColor};filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 5px ${bColor}) drop-shadow(0 0 12px ${bColor});"></ha-icon>`
              : `<span style="font-size:12px;line-height:1;">${bIcon}</span>`
            ) : ''}
            <span>${val}</span>
          </div>
          ${gear}
        </div>`;
    }).join('');
  }

  _buildTilesInner() {
    const tiles = this._config.tiles;
    return tiles.map((tile, i) => {
      const ts = this._hass.states[tile.entity];
      let val = ts ? ts.state : '--';
      let displayUnit = tile.unit || '';
      const colorClass = (tile.color === 'argon') ? 'argon' : 'xenon';

      if (tile.map) {
        const mapped = tile.map[val];
        if (mapped) val = mapped.text || val;
      } else {
        const formatted = this._formatValue(val, ts?.attributes?.unit_of_measurement, tile.entity);
        if (typeof formatted === 'string' && (formatted.includes('kW') || formatted.includes(' W'))) {
          val = formatted;
          displayUnit = '';
        } else {
          val = formatted;
        }
      }

      if (val === 'unavailable' || val === '--') val = '--';
      if (val === 'unknown') val = '?';

      return `
        <div class="vw-tile gb-${colorClass}" data-entity="${tile.entity}">
          <div class="vw-tile-lbl lbl-${colorClass}">${tile.label}</div>
          <div class="vw-tile-val">${val}<span class="vw-tile-unit">${displayUnit ? ' ' + displayUnit : ''}</span></div>
        </div>`;
    }).join('');
  }

  _buildControlsInner() {
    const controls = this._config.controls;
    const charging_info = this._config.charging_info || [];

    const toggles = [];
    controls.forEach((ctrl, i) => {
      const es = this._hass.states[ctrl.entity];
      if (!es) return;
      const domain = ctrl.entity.split('.')[0];
      if (domain === 'input_boolean' || domain === 'switch' || domain === 'climate') {
        toggles.push({ ctrl, es, idx: i });
      }
    });

    const toggleHTML = toggles.length ? `
      <div class="vw-toggles">
        ${toggles.map(({ ctrl, es, idx }) => {
          const domain = ctrl.entity.split('.')[0];
          const isOn = domain === 'climate' ? (es.state !== 'off' && es.state !== 'unavailable') : es.state === 'on';
          const colorName = ctrl.color_class || (idx % 2 === 0 ? 'xenon' : 'argon');
          const colorHex = colorName === 'argon' ? '#9D4EDD' : '#00D4FF';
          const name = ctrl.name || es.attributes.friendly_name || ctrl.entity;
          const icon = ctrl.icon || es.attributes.icon || '';
          return `
            <div class="vw-toggle-row gb-${colorName}">
              <div class="vw-toggle-lbl lbl-${colorName}" data-entity="${ctrl.entity}">
                ${this._renderIcon(icon, 15, isOn ? colorHex : 'rgba(255,255,255,0.3)')}
                <span>${name}</span>
              </div>
              <div class="vw-toggle" data-idx="${idx}" style="
                background:${isOn ? colorHex+'30' : 'rgba(255,255,255,0.08)'};
                border-color:${colorHex}55;
              ">
                <div class="vw-toggle-dot" style="
                  background:${isOn ? colorHex : 'rgba(255,255,255,0.15)'};
                  ${isOn ? 'right:2px;box-shadow:0 0 6px '+colorHex+'99;' : 'left:2px;'}
                "></div>
              </div>
            </div>`;
        }).join('')}
      </div>` : '';

    let chargingHTML = '';
    if (charging_info.length && this._isCharging()) {
      const infoItems = charging_info.map(info => {
        const es = this._hass.states[info.entity];
        let val = es ? es.state : '--';
        const color = info.color || '#00D4FF';
        const formatted = this._formatValue(val, es?.attributes?.unit_of_measurement, info.entity);
        const displayVal = (formatted === '--' || formatted === '?') ? '--' : formatted;
        const displayUnit = (typeof formatted === 'string' && (formatted.includes('kW') || formatted.includes(' W') || formatted.includes('h') || formatted.includes('min'))) ? '' : (info.unit || '');
        return `
          <div class="vw-charging-item">
            ${this._renderIcon(info.icon, 14, color)}
            <span class="vw-charging-lbl">${info.label || ''}</span>
            <span class="vw-charging-val" style="color:${color};">${displayVal}${displayUnit ? ' ' + displayUnit : ''}</span>
          </div>`;
      }).join('');

      chargingHTML = `
        <div class="vw-charging-box">
          <div class="vw-charging-title">⚡ Charge active</div>
          ${infoItems}
        </div>`;
    }

    return `${toggleHTML}${chargingHTML}${this._buildChargeButton()}`;
  }

  _buildControlsHTML() {
    const controls = this._config.controls;
    const charging_info = this._config.charging_info || [];
    if (!controls.length && !charging_info.length && !this._config.charge_switch) return '';
    return `<div class="vw-controls">${this._buildControlsInner()}</div>`;
  }

  _buildChargeButton() {
    const entity = this._config.charge_switch;
    if (!entity) return '';
    const es = this._hass.states[entity];
    if (!es) return '';
    const isOn = es.state === 'on' || es.state === 'charging';
    const label = isOn ? 'STOP CHARGE' : 'START CHARGE';
    const icon = isOn ? '⏹' : '▶';
    return `
      <button class="vw-charge-btn ${isOn ? 'charge-on' : 'charge-off'}" data-label="${label}">
        <span class="btn-icon">${icon}</span>
        <span class="btn-label">${label}</span>
      </button>`;
  }

  _updateDynamic() {
    const { layers } = this._config;

    layers.forEach(layer => {
      const es = this._hass.states[layer.entity];
      const isOn = es && es.state === 'on';
      const imgs = this.shadowRoot.querySelectorAll(`img[src*="${layer.open || layer.closed}"]`);
      imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (layer.closed && src.includes(layer.closed)) img.style.opacity = isOn ? 0 : 1;
        if (layer.open && src.includes(layer.open)) img.style.opacity = isOn ? 1 : 0;
      });
    });

    // Refresh corners
    ['tl','tr','bl','br'].forEach(pos => {
      const el = this.shadowRoot.querySelector(`.vw-corner-${pos}`);
      if (!el) return;
      const entity = el.dataset.entity;
      const c = this._cornerState(entity);
      const color = c.ok === null ? 'rgba(255,255,255,0.25)'
                  : c.ok ? 'rgba(var(--rgb-gas-krypton,46,229,182),1)'
                  : 'rgba(var(--rgb-gas-radon,224,17,95),1)';
      const rgbVar = c.ok === null ? '255,255,255' : c.ok ? 'var(--rgb-gas-krypton,46,229,182)' : 'var(--rgb-gas-radon,224,17,95)';
      el.style.setProperty('--corner-color', color);
      el.style.setProperty('--corner-rgb', rgbVar);
      const ic = el.querySelector('ha-icon');
      if (ic) ic.setAttribute('icon', c.icon);
      const lb = el.querySelector('.vw-corner-lbl');
      if (lb) lb.textContent = c.label;
    });

    // Patch chirurgical tiles — évite la recréation de nœuds DOM à chaque tick
    const tilesEl = this.shadowRoot.querySelector('.vw-tiles');
    if (tilesEl) {
      const tileEls = tilesEl.querySelectorAll('.vw-tile');
      const tiles = this._config.tiles;
      if (tileEls.length !== tiles.length) {
        tilesEl.innerHTML = this._buildTilesInner();
      } else {
        tileEls.forEach((tileEl, i) => {
          const tile = tiles[i];
          const ts = this._hass.states[tile.entity];
          let val = ts ? ts.state : '--';
          let displayUnit = tile.unit || '';
          if (tile.map) {
            const mapped = tile.map[val];
            if (mapped) val = mapped.text || val;
          } else {
            const formatted = this._formatValue(val, ts?.attributes?.unit_of_measurement, tile.entity);
            if (typeof formatted === 'string' && (formatted.includes('kW') || formatted.includes(' W'))) {
              val = formatted; displayUnit = '';
            } else { val = formatted; }
          }
          if (val === 'unavailable' || val === '--') val = '--';
          if (val === 'unknown') val = '?';
          const valEl = tileEl.querySelector('.vw-tile-val');
          if (valEl) {
            const unitEl = valEl.querySelector('.vw-tile-unit');
            const unitText = displayUnit ? ' ' + displayUnit : '';
            if (unitEl) {
              valEl.firstChild.textContent = val;
              unitEl.textContent = unitText;
            } else {
              valEl.textContent = val;
            }
          }
        });
      }
    }

    // Patch chirurgical badges — évite la recréation de ha-icon à chaque tick
    const headerEl = this.shadowRoot.querySelector('.vw-header');
    if (headerEl) {
      const badgeWraps = headerEl.querySelectorAll('.vw-badge-wrap');
      const badges = this._config.badges || [];
      if (badgeWraps.length !== badges.length) {
        headerEl.innerHTML = this._buildBadgesHTML();
      } else {
        badgeWraps.forEach((wrap, i) => {
          const badge = badges[i];
          const bs = this._hass.states[badge.entity];
          let val = bs ? bs.state : '--';
          let bColor = badge.color || '#00D4FF';
          if (badge.map && badge.map[val]) {
            const m = badge.map[val];
            val = m.text || val;
            if (m.color) bColor = m.color;
          } else if (!isNaN(val) && val !== '--' && val !== 'unavailable' && val !== 'unknown') {
            val = Math.round(parseFloat(val));
            if (badge.unit) val = val + badge.unit;
          }
          if (val === 'unavailable') { val = '--'; bColor = 'rgba(255,255,255,0.35)'; }
          const badgeEl = wrap.querySelector('.vw-badge');
          if (badgeEl) {
            badgeEl.style.color = bColor;
            badgeEl.style.textShadow = `0 0 1px rgba(255,255,255,0.5), 0 0 6px ${bColor}, 0 0 13px ${bColor}`;
            const iconEl = badgeEl.querySelector('ha-icon');
            if (iconEl) {
              iconEl.style.color = bColor;
              iconEl.style.filter = `drop-shadow(0 0 1px #fff) drop-shadow(0 0 5px ${bColor}) drop-shadow(0 0 12px ${bColor})`;
            }
            const spanEl = badgeEl.querySelector('span:last-child');
            if (spanEl) spanEl.textContent = val;
          }
        });
      }
    }

    const ctrlEl = this.shadowRoot.querySelector('.vw-controls');
    if (ctrlEl) {
      // Patch chirurgical des toggles — évite le flicker causé par innerHTML
      const existingToggles = ctrlEl.querySelectorAll('.vw-toggle[data-idx]');
      const controls = this._config.controls;
      let needRebuild = existingToggles.length !== controls.filter((ctrl) => {
        const domain = ctrl.entity.split('.')[0];
        return ['input_boolean','switch','climate'].includes(domain) && this._hass.states[ctrl.entity];
      }).length;

      if (needRebuild) {
        ctrlEl.innerHTML = this._buildControlsInner();
      } else {
        existingToggles.forEach(toggleEl => {
          const idx = +toggleEl.dataset.idx;
          const ctrl = controls[idx];
          if (!ctrl) return;
          const es = this._hass.states[ctrl.entity];
          if (!es) return;
          const domain = ctrl.entity.split('.')[0];
          const isOn = domain === 'climate' ? (es.state !== 'off' && es.state !== 'unavailable') : es.state === 'on';
          const colorName = ctrl.color_class || (idx % 2 === 0 ? 'xenon' : 'argon');
          const colorHex = colorName === 'argon' ? '#9D4EDD' : '#00D4FF';
          toggleEl.style.background = isOn ? colorHex + '30' : 'rgba(255,255,255,0.08)';
          const dot = toggleEl.querySelector('.vw-toggle-dot');
          if (dot) {
            dot.style.background = isOn ? colorHex : 'rgba(255,255,255,0.15)';
            dot.style.right = isOn ? '2px' : '';
            dot.style.left  = isOn ? '' : '2px';
            dot.style.boxShadow = isOn ? `0 0 6px ${colorHex}99` : '';
          }
          const lbl = toggleEl.closest('.vw-toggle-row')?.querySelector('.vw-toggle-lbl');
          if (lbl) {
            const ico = lbl.querySelector('ha-icon, svg');
            if (ico && ico.tagName === 'HA-ICON') ico.style.color = isOn ? colorHex : 'rgba(255,255,255,0.3)';
          }
        });
      }
    }
    this._bindControls();
  }

  _formatValue(val, unit, entity) {
    if (val === 'unavailable' || val === 'unknown' || val === '--') return '--';
    if (entity && entity.includes('estimated_date')) return this._formatETA(val);
    if (!isNaN(val)) {
      let num = parseFloat(val);
      const uom = (unit || '').toLowerCase();
      if (uom === 'kw' || (entity && entity.includes('power') && !uom)) {
        if (uom === 'kw') return num.toFixed(1) + ' kW';
        if (num >= 1000) return (num / 1000).toFixed(1) + ' kW';
        return Math.round(num) + ' W';
      }
      if (uom === 'w') {
        if (num >= 1000) return (num / 1000).toFixed(1) + ' kW';
        return Math.round(num) + ' W';
      }
      return Math.round(num);
    }
    return val;
  }

  _formatETA(val) {
    try {
      const target = new Date(val);
      const now = new Date();
      if (isNaN(target.getTime())) return val;
      const diffMs = target - now;
      if (diffMs <= 0) return 'Terminé';
      const mins = Math.round(diffMs / 60000);
      if (mins < 60) return mins + ' min';
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
    } catch (e) { return val; }
  }

  _openMoreInfo(entity) {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId: entity };
    this.dispatchEvent(ev);
  }

  _bindControls() {
    // Abort all previous listeners before re-binding — prevents accumulation
    if (this._abortController) this._abortController.abort();
    this._abortController = new AbortController();
    const signal = this._abortController.signal;

    const controls = this._config.controls;

    this.shadowRoot.querySelectorAll('.vw-toggle').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        const ctrl = controls[idx];
        const domain = ctrl.entity.split('.')[0];
        if (domain === 'climate') {
          const es = this._hass.states[ctrl.entity];
          const isOn = es && es.state !== 'off' && es.state !== 'unavailable';
          this._hass.callService('climate', isOn ? 'turn_off' : 'turn_on', { entity_id: ctrl.entity });
        } else {
          this._hass.callService(domain, 'toggle', { entity_id: ctrl.entity });
        }
      }, { signal });
    });

    const chargeBtn = this.shadowRoot.querySelector('.vw-charge-btn');
    if (chargeBtn && this._config.charge_switch) {
      chargeBtn.addEventListener('click', () => {
        const entity = this._config.charge_switch;
        const domain = entity.split('.')[0];
        this._hass.callService(domain, 'toggle', { entity_id: entity });
      }, { signal });
    }

    this.shadowRoot.querySelectorAll('.vw-tile, .vw-corner, .vw-badge-wrap .vw-badge').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = el.closest('[data-entity]');
        const entity = wrap ? wrap.dataset.entity : el.dataset.entity;
        if (entity) this._openMoreInfo(entity);
      }, { signal });
    });

    this.shadowRoot.querySelectorAll('.vw-toggle-lbl[data-entity]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this._openMoreInfo(el.dataset.entity);
      }, { signal });
    });

    this.shadowRoot.querySelectorAll('.vw-badge-gear').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const entity = el.dataset.entity;
        if (entity) this._openMoreInfo(entity);
      }, { signal });
    });
  }

  // ── Bloc header canonique (skill ha-neon-css, réf. neon-markdown-card.js) ──
  // Snippet dupliqué à l'identique — ne PAS extraire en module importé (hacstag
  // ne bump que la ressource Lovelace enregistrée, pas ses imports siblings).
  _neonHeaderCss() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};

    // ── Transposition fidèle du bloc header canonique (neon-entities-card.js
    // lignes 160-222) — mêmes noms de variable, même ordre, même logique. Ne
    // PAS re-dériver localement : glow icône et glow texte sont deux constantes
    // séparées (hdrGlow / hdrIconGlow) calculées UNE fois en amont, chacune
    // injectée telle quelle dans son bloc CSS — pas de test ternaire dupliqué
    // inline dans le template qui finit par diverger entre les deux.
    const titleColor = hdr.color || 'rgba(180,130,255,0.55)';
    // Charger dynamiquement la police choisie dans l'éditeur — sans ça, tout
    // choix ≠ Orbitron (seule police en dur ailleurs) retombe silencieusement
    // sur le fallback système : le <select> propose 15 polices mais une seule
    // était réellement fetchée (même piège trouvé dans neon-entities-card.js,
    // pas répliqué ici). Un cache statique évite de réinjecter le même <link>
    // à chaque re-render.
    if (hdr.font) VwCarCard._loadGoogleFont(hdr.font);
    const hdrFontFamily = hdr.font
      ? `'${hdr.font}', var(--primary-font-family, 'Orbitron', 'Rajdhani', sans-serif)`
      : "var(--primary-font-family, 'Orbitron', 'Rajdhani', sans-serif)";
    const _neonGlow = (color, size) => {
      if (!color) return '';
      const sz = parseInt(size) || 10;
      return `text-shadow:0 0 ${Math.round(sz * 0.2)}px #fff,0 0 ${Math.round(sz * 0.4)}px ${color},0 0 ${Math.round(sz * 0.8)}px ${color},0 0 ${sz}px ${color};`;
    };
    const hdrGlowColor = hdr.glow_color || 'var(--primary-color, #00E8FF)';
    const hdrGlowSize  = parseFloat(hdr.glow_size) || 12;
    // text_shadow explicite PRIORITAIRE sur glow (pas de cumul)
    const hdrGlow = hdr.title_shadow
      ? `text-shadow: ${hdr.title_shadow};`
      : hdr.glow
        ? _neonGlow(hdrGlowColor, hdrGlowSize)
        : '';
    const hdrGradFrom = hdr.gradient_from || 'var(--primary-color, #00E8FF)';
    const hdrGradTo   = hdr.gradient_to   || 'var(--accent-color, #FF50A0)';
    const hdrGrad = hdr.gradient
      ? `background:linear-gradient(90deg,${hdrGradFrom},${hdrGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`
      : `color: ${titleColor};`;
    const hdrIconColor = hdr.icon_color || titleColor;
    const hdrFontSize  = hdr.title_size || 'clamp(14px, 2.6cqi, 20px)';
    const hdrIconSize  = hdr.icon_size
      ? (/^[\d.]+$/.test(String(hdr.icon_size)) ? `${hdr.icon_size}px` : hdr.icon_size)
      : `calc(${hdrFontSize} * 1.2)`;
    const hdrFlick = hdr.flicker
      ? `animation:vwhdr-flicker ${this._flickDur}s ease-in-out infinite ${this._flickOff}s;`
      : '';
    const hdrWeight  = hdr.font_weight ?? 600;
    const hdrSpacing = hdr.letter_spacing || 'clamp(1px, 0.5cqi, 3px)';
    const hdrUpper   = hdr.uppercase === false ? 'none' : 'uppercase';
    const hdrItalic  = hdr.italic ? 'italic' : 'normal';
    // RIEN si glow désactivé — net par défaut, glow seulement en opt-in (même
    // règle que le texte, aucune divergence possible avec hdrGlow ci-dessus).
    const hdrIconGlow = hdr.glow
      ? `filter:drop-shadow(0 0 ${Math.round(hdrGlowSize * 0.2)}px #fff) drop-shadow(0 0 ${Math.round(hdrGlowSize * 0.4)}px ${hdrGlowColor}) drop-shadow(0 0 ${Math.round(hdrGlowSize * 0.8)}px ${hdrGlowColor}) drop-shadow(0 0 ${hdrGlowSize}px ${hdrGlowColor});`
      : '';
    return `
      @keyframes vwhdr-flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1;} 20%,24%,55%{opacity:.6;} }
      .neon-hdr {
        display: flex; align-items: center; gap: 8px;
        padding: 11px 14px 8px;
        container-type: inline-size;
      }
      .neon-hdr-icon.nmc-icon-wrap { display: flex; align-items: center; flex-shrink: 0; overflow: visible; }
      .neon-hdr-icon.nmc-icon-wrap ha-icon {
        --mdc-icon-size: ${hdrIconSize};
        color: ${hdrIconColor};
        overflow: visible;
        ${hdrIconGlow}
        ${hdrFlick}
      }
      .neon-hdr-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
      .neon-hdr-title {
        font-family: ${hdrFontFamily};
        font-size: ${hdrFontSize};
        font-weight: ${hdrWeight};
        letter-spacing: ${hdrSpacing};
        ${hdrGrad}
        text-transform: ${hdrUpper};
        font-style: ${hdrItalic};
        padding-left: 8px;
        ${hdrGlow}
        ${hdrFlick}
        line-height: 1.2;
        white-space: nowrap; overflow: visible; text-overflow: ellipsis;
      }
      .neon-hdr-subtitle {
        font-family: ${hdrFontFamily};
        font-size: clamp(10px, calc(${hdrFontSize} * 0.75), 12px);
        color: color-mix(in srgb, ${titleColor} 55%, transparent);
        letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;
      }
      .neon-main-div {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent);
        margin: 0 14px;
      }
    `;
  }

  _buildNeonHeader() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    if (this._config.header === false || hdr.enabled === false) return '';
    const icon     = hdr.icon     || '';
    const title    = hdr.title    || '';
    const subtitle = hdr.subtitle || '';
    if (!icon && !title) return '';
    return `
      <div class="neon-hdr">
        <div class="neon-hdr-icon nmc-icon-wrap"></div>
        <div class="neon-hdr-body">
          ${title    ? `<span class="neon-hdr-title">${title}</span>`       : ''}
          ${subtitle ? `<span class="neon-hdr-subtitle">${subtitle}</span>` : ''}
        </div>
      </div>
      <div class="neon-main-div"></div>`;
  }

  _mountNeonHeaderIcon() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    const icon = hdr.icon || '';
    const wrap = this.shadowRoot.querySelector('.neon-hdr-icon.nmc-icon-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!icon) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';
    const iconEl = document.createElement('ha-icon');
    iconEl.setAttribute('icon', icon);
    wrap.appendChild(iconEl);
  }

  _buildStyle() {
    return `<style>
      :host {
        display: block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      ha-card.vw-card {
        overflow: hidden;
        padding: 0;
        position: relative;
        color: #fff;
        font-family: 'Orbitron', var(--primary-font-family, monospace);
        isolation: isolate;
      }

      /* header */
      .vw-header {
        position: relative; z-index: 2;
        display:flex; justify-content:space-between; align-items:center;
        padding:8px 12px 4px;
        flex-wrap:wrap; gap:6px;
      }
      .vw-badge-wrap { display:inline-flex; align-items:center; gap:4px; }
      /* texte lumineux, pas de badge encadré (cf. .temp/.health, neon-nas-card-v2) */
      .vw-badge {
        display:inline-flex; align-items:center; gap:5px;
        font-family:'Orbitron',monospace; font-size:12px; font-weight:600;
        cursor:pointer; transition:filter 0.2s;
        letter-spacing: 0.06em; line-height:1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      .vw-badge:hover { filter: brightness(1.25); }
      .vw-badge-gear {
        display:inline-flex; align-items:center; justify-content:center;
        width:22px; height:22px; border-radius:5px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(var(--rgb-accent-color,0,212,255),0.25);
        cursor:pointer; transition: all 0.2s;
        color: rgba(var(--rgb-accent-color,0,212,255),0.7);
      }
      .vw-badge-gear:hover {
        background:rgba(var(--rgb-accent-color,0,212,255),0.12);
        transform: rotate(30deg);
      }
      .vw-badge-gear ha-icon { --mdc-icon-size:14px; }

      /* body voiture */
      .vw-body {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1.12;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-color: transparent;
        z-index: 1;
      }
      .vw-body::before {
        content:'';
        position:absolute; inset:0;
        background: radial-gradient(
          ellipse at center,
          rgba(0,48,99,0.35) 0%,
          rgba(0,32,75,0.20) 40%,
          rgba(5,10,20,0.05) 75%,
          transparent 100%
        );
        pointer-events:none;
        z-index: -1;
      }

      .vw-battery {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
      }

      /* corners */
      .vw-corner {
        position: absolute;
        display: flex; align-items: center; gap: 4px;
        padding: 5px 8px;
        border-radius: 7px;
        background: rgba(5,10,20,0.55);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border: 1px solid var(--corner-color);
        color: var(--corner-color);
        font-family: 'Orbitron', monospace;
        font-size: 9px; font-weight: 700; letter-spacing: 0.06em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        text-shadow: 0 0 3px var(--corner-color);
        box-shadow: 0 0 10px rgba(var(--corner-rgb),0.25);
        cursor: pointer;
        transition: all 0.2s;
        z-index: 5;
      }
      .vw-corner:hover { filter: brightness(1.2); }
      .vw-corner ha-icon { --mdc-icon-size: 14px; color: var(--corner-color); }
      .vw-corner-tl { top: 8px; left: 8px; }
      .vw-corner-tr { top: 8px; right: 8px; }
      .vw-corner-bl { bottom: 8px; left: 8px; }
      .vw-corner-br { bottom: 8px; right: 8px; }

      /* tiles (glass heat pump) */
      .vw-tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
        gap: 6px;
        padding: 10px 12px 12px;
        background: rgba(10,15,30,0.4);
        position: relative; z-index: 2;
      }
      .vw-tile {
        padding: 8px 9px; text-align: center; cursor: pointer;
        position: relative; overflow: hidden;
        background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-radius: 8px;
        border-top: 1px solid rgba(255,255,255,0.12);
        border-left: 1px solid rgba(255,255,255,0.07);
        transition: transform 0.15s;
        container-type: inline-size;
      }
      .vw-tile:active { opacity: 0.75; }
      .vw-tile::after {
        content:''; position:absolute; top:0; left:10%; width:80%; height:1px;
        border-radius:1px; pointer-events:none; z-index:3;
      }
      .vw-tile::before {
        content:''; position:absolute; inset:0; border-radius:8px;
        pointer-events:none; z-index:2;
        mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
        -webkit-mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
      }
      .gb-xenon { border: 1px solid rgba(var(--rgb-gas-xenon,0,212,255),0.52); box-shadow: 0 0 6px rgba(var(--rgb-gas-xenon,0,212,255),0.18); }
      .gb-xenon::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-gas-xenon,0,212,255),0.55), transparent); }
      .gb-xenon::before { box-shadow: inset 0 -2px 0 0 var(--gas-xenon,#00D4FF), 0 0 10px rgba(var(--rgb-gas-xenon,0,212,255),0.22); }
      .gb-argon { border: 1px solid rgba(var(--rgb-gas-argon,157,78,221),0.56); box-shadow: 0 0 6px rgba(var(--rgb-gas-argon,157,78,221),0.16); }
      .gb-argon::after  { background: linear-gradient(90deg, transparent, rgba(var(--rgb-gas-argon,157,78,221),0.55), transparent); }
      .gb-argon::before { box-shadow: inset 0 -2px 0 0 var(--gas-argon,#9D4EDD), 0 0 10px rgba(var(--rgb-gas-argon,157,78,221),0.2); }
      .vw-tile-lbl {
        font-size: 8px; letter-spacing: 1.4px; margin-bottom: 3px;
      }
      .lbl-xenon { color: rgba(var(--rgb-gas-xenon,0,212,255),0.55); }
      .lbl-argon { color: rgba(var(--rgb-gas-argon,157,78,221),0.62); }
      .vw-tile-val {
        font-family: 'Orbitron', sans-serif; font-size: clamp(9px, 4cqi, 15px); font-weight: 700;
        color: #fff;
        text-shadow:
          0 0 2px #fff,
          0 0 6px rgba(var(--tile-rgb,0,212,255),0.8),
          0 0 15px rgba(var(--tile-rgb,0,212,255),0.4);
        line-height: 1.25; white-space: nowrap;
      }
      .gb-xenon .vw-tile-val { --tile-rgb: var(--rgb-gas-xenon,0,212,255); }
      .gb-argon .vw-tile-val  { --tile-rgb: var(--rgb-gas-argon,157,78,221); }
      .vw-tile-unit { font-size: 10px; opacity: 0.7; }

      /* controls */
      .vw-controls {
        padding: 8px 14px 12px;
        background: rgba(10,15,30,0.4);
        border-top: 1px solid rgba(var(--rgb-accent-color,0,212,255),0.08);
        position: relative; z-index: 2;
      }
      .vw-toggles { display:grid; grid-template-columns:repeat(${this._config.controls_columns}, 1fr); gap:8px; margin-bottom:6px; }
      .vw-toggle-row {
        display:flex; align-items:center; justify-content:space-between;
        padding: 8px 9px;
        position: relative; overflow: hidden;
        background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-radius: 8px;
        cursor: default;
      }
      .vw-toggle-row::after {
        content:''; position:absolute; top:0; left:10%; width:80%; height:1px;
        border-radius:1px; pointer-events:none; z-index:3;
      }
      .vw-toggle-row::before {
        content:''; position:absolute; inset:0; border-radius:8px;
        pointer-events:none; z-index:2;
        mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
        -webkit-mask-image: linear-gradient(90deg, transparent, black 14%, black 86%, transparent);
      }
      .vw-toggle-lbl { display:flex; align-items:center; gap:6px; overflow:hidden; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.05em; white-space:nowrap; cursor:pointer; flex:1; }
      .vw-toggle { width:34px; height:18px; border-radius:9px; flex-shrink:0; border:1px solid; cursor:pointer; position:relative; transition:background 0.3s; margin-left:6px; }
      .vw-toggle-dot { width:12px; height:12px; border-radius:6px; position:absolute; top:2px; transition:all 0.3s; }

      .vw-slider-row { padding:4px 0; }
      .vw-slider-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:3px; }
      .vw-slider-lbl { display:flex; align-items:center; gap:6px; font-size:9px; color:rgba(255,255,255,0.5); letter-spacing:0.04em; }
      .vw-slider-val { font-family:'Orbitron',monospace; font-size:11px; font-weight:700; min-width:40px; text-align:right; }
      .vw-slider { width:100%; height:4px; -webkit-appearance:none; appearance:none; border-radius:2px; outline:none; cursor:pointer; }

      .vw-charging-box {
        margin-top:6px; padding:8px;
        background:rgba(var(--rgb-gas-krypton,46,229,182),0.04);
        border:1px solid rgba(var(--rgb-gas-krypton,46,229,182),0.2);
        border-radius:8px;
        display:flex; flex-direction:column; gap:4px;
      }
      .vw-charging-title { font-family:'Orbitron',monospace; font-size:7px; color:rgba(var(--rgb-gas-krypton,46,229,182),0.6); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:2px; }
      .vw-charging-item { display:flex; align-items:center; gap:6px; }
      .vw-charging-lbl { font-family:'Orbitron',monospace; font-size:8px; color:rgba(255,255,255,0.4); letter-spacing:0.04em; }
      .vw-charging-val { font-family:'Orbitron',monospace; font-size:11px; font-weight:700; margin-left:auto; }

      /* charge button */
      @keyframes btnPulseCharge {
        0%,100% { box-shadow: 0 0 14px rgba(0,232,255,0.5); transform: scale(1); }
        50%     { box-shadow: 0 0 30px rgba(0,232,255,0.8); transform: scale(1.015); }
      }
      @keyframes glitchShift {
        0%   { clip-path: inset(0 0 98% 0); transform: translateX(0); }
        10%  { clip-path: inset(12% 0 72% 0); transform: translateX(-4px); }
        20%  { clip-path: inset(48% 0 38% 0); transform: translateX(4px); }
        30%  { clip-path: inset(80% 0 5% 0); transform: translateX(-3px); }
        40%  { clip-path: inset(30% 0 55% 0); transform: translateX(3px); }
        50%  { clip-path: inset(65% 0 20% 0); transform: translateX(-2px); }
        60%  { clip-path: inset(10% 0 80% 0); transform: translateX(2px); }
        70%  { clip-path: inset(55% 0 30% 0); transform: translateX(-4px); }
        80%  { clip-path: inset(25% 0 60% 0); transform: translateX(3px); }
        90%  { clip-path: inset(75% 0 15% 0); transform: translateX(-2px); }
        100% { clip-path: inset(0 0 98% 0); transform: translateX(0); }
      }
      @keyframes glitchColor {
        0%,100% { opacity: 0; }
        15%,45%,70% { opacity: 1; }
        30%,60%,85% { opacity: 0; }
      }
      @keyframes spark {
        0%   { opacity: 0; transform: scale(.6) rotate(0deg); }
        20%  { opacity: 1; }
        100% { opacity: 0; transform: scale(1.4) rotate(15deg); }
      }
      .vw-charge-btn {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        width: 100%; padding: 10px 6px; border-radius: 10px; border: none;
        cursor: pointer; font-family: 'Orbitron', monospace;
        transition: all .25s ease; position: relative; overflow: hidden;
        isolation: isolate; -webkit-tap-highlight-color: transparent;
        margin-top: 8px;
      }
      .vw-charge-btn .btn-icon { font-size: 16px; line-height: 1; }
      .vw-charge-btn .btn-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
      .vw-charge-btn.charge-off {
        background: linear-gradient(135deg, rgba(0,212,255,0.14), rgba(0,212,255,0.04));
        border: 2px solid rgba(0,212,255,0.6);
        color: #00D4FF; text-shadow: 0 0 8px #00D4FF;
        box-shadow: 0 0 16px rgba(0,212,255,0.25);
      }
      .vw-charge-btn.charge-on {
        background: linear-gradient(135deg, rgba(224,17,95,0.2), rgba(224,17,95,0.1));
        border: 2px solid rgba(224,17,95,0.8);
        color: #E0115F; text-shadow: 0 0 8px #E0115F;
        box-shadow: 0 0 22px rgba(224,17,95,0.4), inset 0 0 12px rgba(224,17,95,0.06);
        animation: btnPulseCharge 2.5s ease-in-out infinite;
      }
      .vw-charge-btn::before,
      .vw-charge-btn::after {
        content: attr(data-label);
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 9px; font-weight: 700; letter-spacing: 2px;
        text-transform: uppercase; pointer-events: none; opacity: 0;
      }
      .vw-charge-btn::before {
        color: #00D4FF;
        text-shadow: 2px 0 #E0115F, -2px 0 #00D4FF;
      }
      .vw-charge-btn::after {
        color: #E0115F;
        text-shadow: -2px 0 #00D4FF, 2px 0 #E0115F;
      }
      .vw-charge-btn:hover { transform: scale(1.02); filter: brightness(1.15); }
      .vw-charge-btn:hover::before {
        animation: glitchShift .4s steps(1) infinite, glitchColor .4s steps(1) infinite;
      }
      .vw-charge-btn:hover::after {
        animation: glitchShift .4s steps(1) .13s infinite, glitchColor .4s steps(1) .2s infinite;
        mix-blend-mode: screen;
      }
      .vw-charge-btn:hover .btn-icon {
        animation: spark .25s ease-out infinite alternate;
        filter: drop-shadow(0 0 6px currentColor);
      }
      .vw-charge-btn:active { transform: scale(.96); }

      /* ── NeonHeader ── */
      ${this._neonHeaderCss()}

      /* responsive — paysage iPad */
      @media (min-width: 1100px) {
        .vw-corner { font-size: 10px; padding: 6px 10px; }
        .vw-corner ha-icon { --mdc-icon-size: 16px; }
        .vw-tile-val { font-size: 17px; }
      }
    </style>`;
  }
}

customElements.define('vw-car-card', VwCarCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'vw-car-card',
  name: 'VW Car Card',
  description: 'Body voiture + batterie néon + corners status',
});

console.info(`%c VW-CAR-CARD %c v${VERSION}`,
  'color:#00D4FF;background:#0a0f1e;font-weight:700;padding:2px 6px;border-radius:3px',
  'color:#9D4EDD;font-weight:700');

console.info(
  '%c 🚗 vw-car-card v0.3.0 %c Neo Tokyo ',
  'background:#1E90FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#2EE5B6;padding:2px 4px;border-radius:0 3px 3px 0;'
);
