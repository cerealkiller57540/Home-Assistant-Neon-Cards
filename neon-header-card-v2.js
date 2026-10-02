/* ── neon-header-card-v2 v4.1 ── */
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
 *     glitch: false      # découpage en bandes (.cyber-title), sans RGB
 *     text_shadow: null
 *   subtitle:
 *     text: "Sous-titre"
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
 *     glitch: false
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
 *     glitch_style: 0       # 0 = cyber-title (2 copies, continu) | 1 = cybr-btn (1 copie, à-coups, cycle 20 s)
 *     glitch_force: 1.1     # 1 = 2 px de glissement
 *     glitch_speed: 1.5     # 1 = cycles 2,5 s / 3 s
 *     glitch_burst_every: 0 # s en moyenne entre deux salves, 0 = en continu
 *     glitch_burst_len: 1   # s, durée d'une salve
 *
 *  title.text / subtitle.text = texte statique (rendu en textContent).
 *  Pour du contenu dynamique (états, templates, HTML), utiliser neon-markdown-card.
 */

const NHV2_VERSION = '4.1';

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

// ── Config normalizer ────────────────────────────────────────────
function nhv2Num(v, d) { const n = parseFloat(v); return Number.isFinite(n) ? n : d; }

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
    glitch:         NHV2_IS_LOW_POWER ? false : (r.title?.glitch   ?? false),
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
    glitch:         NHV2_IS_LOW_POWER ? false : (r.subtitle?.glitch  ?? false),
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
    // glitch : défauts = banc validé par Chris le 02/10
    glitch_style:       nhv2Num(r.shared?.glitch_style, 0) ? 1 : 0,
    glitch_force:       nhv2Num(r.shared?.glitch_force, 1.1),
    glitch_speed:       Math.max(.1, nhv2Num(r.shared?.glitch_speed, 1.5)),
    glitch_burst_every: Math.max(0, nhv2Num(r.shared?.glitch_burst_every, 0)),
    glitch_burst_len:   Math.max(.1, nhv2Num(r.shared?.glitch_burst_len, 1)),
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
    // groupes ouverts : état LOCAL à l'éditeur, jamais dans _config (sinon un config-changed les referme)
    this._open    = new Set(['title.text', 'subtitle.text', 'shared.layout']);
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
        ha-expansion-panel { display:block; margin:8px 0; --expansion-panel-content-padding:6px 12px 10px; }
        ha-expansion-panel ha-expansion-panel { margin:6px 0; }
        .dep-off { display:none; }
        .icon-preview { width:32px; height:32px; display:flex; align-items:center; justify-content:center;
                        border:1px solid var(--divider-color); border-radius:6px; flex-shrink:0;
                        color:var(--primary-text-color); }
      </style>

      ${this._renderModeSelect()}

      <div class="tabs">
        ${this._tabs().map(([k, l]) => `<div class="tab-btn ${this._tab===k?'active':''}" data-tab="${k}">${l}</div>`).join('')}
      </div>

      <div id="tab-title"   class="${this._tab==='title'   ? '' : 'section-hidden'}">${this._renderTitleTab()}</div>
      <div id="tab-subtitle"class="${this._tab==='subtitle' ? '' : 'section-hidden'}">${this._renderSubtitleTab()}</div>
      <div id="tab-shared"  class="${this._tab==='shared'  ? '' : 'section-hidden'}">${this._renderSharedTab()}</div>
    `;
    this._attachListeners();
    this._applyDeps();
  }

  // onglets utiles selon le mode (titre seul → pas d'onglet Sous-titre, et inversement)
  _tabs() {
    const mode = this._config?.mode ?? 'title';
    const tabs = [['title','Titre'],['subtitle','Sous-titre'],['shared','Commun']]
      .filter(([k]) => k === 'shared' || mode === 'both' || mode === k);
    if (!tabs.some(([k]) => k === this._tab)) this._tab = tabs[0][0];
    return tabs;
  }

  // groupe repliable (pattern neon-compact-light / neon-switch-card), imbricable
  _grp(id, title, body) {
    return `<ha-expansion-panel outlined data-grp="${id}" header="${title}" ${this._open.has(id) ? 'expanded' : ''}>${body}</ha-expansion-panel>`;
  }

  // bloc visible seulement si la condition tient : 'section.cle' (vrai), 'section.cle=valeur', alternatives par '|', '!' en tête = négation
  _dep(spec, body) { return `<div data-dep="${spec}">${body}</div>`; }

  _depOk(spec) {
    if (spec[0] === '!') return !this._depOk(spec.slice(1));
    return spec.split('|').some(s => {
      const [path, want] = s.split('=');
      const [sec, key] = path.split('.');
      const v = this._get(sec, key);
      return want === undefined ? !!v : String(v) === want;
    });
  }

  _applyDeps() {
    this.querySelectorAll('[data-dep]').forEach(el => el.classList.toggle('dep-off', !this._depOk(el.dataset.dep)));
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
      ${this._grp('title.text', 'Texte et icône', `
        ${this._textarea('Titre', 'title', 'text', 'Mon Dashboard')}
        ${this._iconPicker('Icône', 'title', 'icon')}
        <div class="row2">
          ${this._select('Position icône', 'title', 'icon_position', [['left','Gauche'],['right','Droite'],['top','Dessus']])}
          ${this._px('Taille icône', 'title', 'icon_size', 'auto (1.2× police)')}
        </div>
      `)}

      ${this._grp('title.typo', 'Typographie', `
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
      `)}

      ${this._grp('title.color', 'Couleurs', `
        ${this._color('Couleur texte', 'title', 'color', '#ffffff')}
        ${this._color('Couleur icône', 'title', 'icon_color', '#ffffff')}
      `)}

      ${this._grp('title.fx', 'Effets', `
        ${this._grp('title.fx.glow', 'Lueur', `
          ${this._toggle('Glow', 'title', 'glow')}
          ${this._dep('title.glow', `
            ${this._color('Couleur glow', 'title', 'glow_color', '#00fff9')}
            ${this._px('Taille glow', 'title', 'glow_size', '12')}
          `)}
        `)}
        ${this._grp('title.fx.grad', 'Dégradé', `
          ${this._toggle('Gradient', 'title', 'gradient')}
          ${this._dep('title.gradient', `
            ${this._color('Gradient début', 'title', 'gradient_from', '#00E8FF')}
            ${this._color('Gradient fin', 'title', 'gradient_to', '#FF50A0')}
          `)}
        `)}
        ${this._grp('title.fx.anim', 'Animations', `
          <div class="row2">
            ${this._toggle('Flicker', 'title', 'flicker')}
            ${this._toggle('Scanline CRT', 'title', 'scanline')}
          </div>
          ${this._toggle('Glitch découpage', 'title', 'glitch')}
          ${this._dep('title.glitch', `<p class="hint">Style, force, vitesse et salves du glitch : onglet Commun.</p>`)}
        `)}
        ${this._grp('title.fx.adv', 'Avancé', `
          ${this._input('Text-shadow custom (remplace le glow)', 'title', 'text_shadow', 'text', '0 0 10px #00fff9')}
        `)}
      `)}
    `;
  }

  _renderSubtitleTab() {
    return `
      ${this._grp('subtitle.text', 'Texte et icône', `
        ${this._textarea('Sous-titre', 'subtitle', 'text', 'Sous-titre')}
        ${this._iconPicker('Icône', 'subtitle', 'icon')}
        <div class="row2">
          ${this._select('Position icône', 'subtitle', 'icon_position', [['left','Gauche'],['right','Droite'],['top','Dessus']])}
          ${this._px('Taille icône', 'subtitle', 'icon_size', 'même que police')}
        </div>
      `)}

      ${this._grp('subtitle.typo', 'Typographie', `
        ${this._fontSelect('Police', 'subtitle', 'font_family')}
        ${this._px('Taille police', 'subtitle', 'font_size', '13')}
        <div class="row2">
          ${this._toggle('Majuscules', 'subtitle', 'uppercase')}
          ${this._toggle('Italique', 'subtitle', 'italic')}
        </div>
        ${this._px('Espacement lettres', 'subtitle', 'letter_spacing', '0')}
      `)}

      ${this._grp('subtitle.color', 'Couleurs', `
        ${this._color('Couleur texte', 'subtitle', 'color', '#888888')}
        ${this._color('Couleur icône', 'subtitle', 'icon_color', '#888888')}
      `)}

      ${this._grp('subtitle.fx', 'Effets', `
        ${this._grp('subtitle.fx.glow', 'Lueur', `
          ${this._toggle('Glow', 'subtitle', 'glow')}
          ${this._dep('subtitle.glow', `
            ${this._color('Couleur glow', 'subtitle', 'glow_color', '#00fff9')}
            ${this._px('Taille glow', 'subtitle', 'glow_size', '6')}
          `)}
        `)}
        ${this._grp('subtitle.fx.grad', 'Dégradé', `
          ${this._toggle('Gradient', 'subtitle', 'gradient')}
          ${this._dep('subtitle.gradient', `
            ${this._color('Gradient début', 'subtitle', 'gradient_from', '#00E8FF')}
            ${this._color('Gradient fin', 'subtitle', 'gradient_to', '#FF50A0')}
          `)}
        `)}
        ${this._grp('subtitle.fx.anim', 'Animations', `
          <div class="row2">
            ${this._toggle('Flicker', 'subtitle', 'flicker')}
            ${this._toggle('Glitch découpage', 'subtitle', 'glitch')}
          </div>
          ${this._dep('subtitle.glitch', `<p class="hint">Style, force, vitesse et salves du glitch : onglet Commun.</p>`)}
        `)}
      `)}
    `;
  }

  _renderSharedTab() {
    return `
      ${this._grp('shared.layout', 'Mise en page', `
        ${this._fontSelect('Police (titre + sous-titre)', 'shared', 'font_family')}
        ${this._padding()}
        <div class="row2">
          ${this._select('Alignement H', 'shared', 'align_h', [['left','Gauche'],['center','Centre'],['right','Droite']])}
          ${this._select('Alignement V', 'shared', 'align_v', [['top','Haut'],['center','Centre'],['bottom','Bas']])}
        </div>
      `)}

      ${this._grp('shared.box', 'Fond et bordure', `
        ${this._grp('shared.box.bg', 'Fond', `
          ${this._color('Couleur fond', 'shared', 'bg_color', '#1a1a2e')}
          <div class="row2">
            ${this._number('Opacité fond (0–1)', 'shared', 'bg_opacity', '0', '1', '0.05')}
            ${this._toggle('Flou fond', 'shared', 'bg_blur')}
          </div>
        `)}
        ${this._grp('shared.box.border', 'Bordure', `
          ${this._color('Couleur bordure', 'shared', 'border_color', '#444444')}
          <div class="row2">
            ${this._px('Épaisseur', 'shared', 'border_width', '1')}
            ${this._px('Radius', 'shared', 'border_radius', '12')}
          </div>
          ${this._select('Style', 'shared', 'border_style', [['solid','Solide'],['dashed','Tirets'],['dotted','Points'],['none','Aucun']])}
        `)}
      `)}

      ${this._grp('shared.glitch', 'Glitch découpage', `
        ${['title','both'].includes(this._config?.mode ?? 'title') ? this._toggle('Sur le titre', 'title', 'glitch') : ''}
        ${['subtitle','both'].includes(this._config?.mode ?? 'title') ? this._toggle('Sur le sous-titre', 'subtitle', 'glitch') : ''}
        <p class="hint">Coupé sur mobile et iPad, comme le flicker.</p>
        ${this._select('Style', 'shared', 'glitch_style', [['0','cyber-title (2 copies, continu)'],['1','cybr-btn (1 copie, à-coups)']])}
        <div class="row2">
          ${this._number('Force (1 = 2 px)', 'shared', 'glitch_force', '0', '5', '0.1', '1.1')}
          ${this._number('Vitesse', 'shared', 'glitch_speed', '0.1', '5', '0.1', '1.5')}
        </div>
        ${this._grp('shared.glitch.burst', 'Salves aléatoires', `
          <p class="hint">0 = glitch en continu. Chaque header tire son propre rythme.</p>
          <div class="row2">
            ${this._number('Salve toutes les (s)', 'shared', 'glitch_burst_every', '0', '120', '1', '0')}
            ${this._number('Durée salve (s)', 'shared', 'glitch_burst_len', '0.1', '10', '0.1', '1')}
          </div>
        `)}
      `)}

      ${this._grp('shared.tap', 'Interaction', `
        ${this._select('Action au tap', 'shared', 'tap_action', [['none','Aucune'],['navigate','Navigation'],['more-info','Plus d\'info']])}
        ${this._dep('shared.tap_action=navigate', this._input('Chemin navigation', 'shared', 'navigation_path', 'text', '/lovelace/0'))}
        ${this._dep('shared.tap_action=more-info', this._input('Entité (more-info)', 'shared', 'entity', 'text', 'light.salon'))}
      `)}
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

  _number(label, section, key, min='0', max='100', step='1', placeholder='') {
    const v = this._get(section, key);
    return `<div class="field"><label>${label}</label>
      <input type="number" data-section="${section}" data-key="${key}"
             value="${v}" min="${min}" max="${max}" step="${step}" placeholder="${placeholder}"/>
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

    // Groupes : mémorise ouvert/fermé (survit au rebuild sur changement de mode)
    this._on(this, 'expanded-changed', (e) => {
      const id = e.target?.dataset?.grp;
      if (!id) return;
      if (e.detail?.expanded) this._open.add(id); else this._open.delete(id);
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
        this._applyDeps();
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
    this._applyDeps();
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
    this._ac        = null;
    this._renderKey = null;
    this._fontLoaded = new Set();
    // Random animation offsets — frozen at construction
    this._flickDur  = nhv2Rnd(3.5, 5.5);
    this._flickOff  = nhv2Rnd(-2, 0);
    this._scanDur   = nhv2Rnd(6, 10);
    this._gPhase    = Math.random();   // déphasage du glitch : les headers ne glitchent pas en chœur
    this._gTimer    = null;
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
    if (!hasCard || !hasBaseStyle || !this._rendered) { this._cleanup(); this._render(); }
  }

  getCardSize() {
    const mode = this._config?.mode ?? 'title';
    return mode === 'subtitle' ? 1 : 2;
  }

  _cleanup() {
    if (this._ac) { this._ac.abort(); this._ac = null; }
    this._glitchStop();
  }

  /* salves aléatoires : attente burst_every × (0,5..1,5), puis classe nhv2-gon pendant burst_len (banc 02/10) */
  _glitchStart() {
    this._glitchStop();
    const c = this._config, sh = c?.shared;
    if (!sh || !(c.title.glitch || c.subtitle.glitch) || !(sh.glitch_burst_every > 0)) return;
    const next = () => {
      this._gTimer = setTimeout(() => {
        this.shadowRoot.querySelector('ha-card.nhv2-card')?.classList.add('nhv2-gon');
        this._gTimer = setTimeout(() => {
          this.shadowRoot.querySelector('ha-card.nhv2-card')?.classList.remove('nhv2-gon');
          next();
        }, sh.glitch_burst_len * 1000);
      }, sh.glitch_burst_every * (.5 + Math.random()) * 1000);
    };
    next();
  }

  _glitchStop() {
    if (this._gTimer) { clearTimeout(this._gTimer); this._gTimer = null; }
  }

  connectedCallback() {
    // Tab switch: shadow DOM content persists — just re-attach observers, no re-render
    if (!this._rendered && this._config && this._hass) { this._cleanup(); this._render(); return; }
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card.nhv2-card');
    if (card && this._rendered) {
      this._reattachObservers(card);
      this._glitchStart();
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

    // glitch : <span.gt data-text><span.t><span.t2>texte</span></span></span> (::before/::after = les copies)
    // sur un span et pas sur le div : en mode both, .nhv2-subtitle::before est déjà le divider
    const fill = (el, txt, glitch) => {
      if (!el) return;
      if (!glitch || !txt) { el.textContent = txt; return; }
      const gt = document.createElement('span'), a = document.createElement('span'), b = document.createElement('span');
      gt.className = 'gt'; a.className = 't'; b.className = 't2';
      gt.dataset.text = txt; b.textContent = txt;
      a.appendChild(b); gt.appendChild(a); el.replaceChildren(gt);
    };
    if (mode === 'title' || mode === 'both')
      fill(this.shadowRoot.querySelector('.nhv2-title'), String(c.title.text ?? '').trim(), c.title.glitch);
    if (mode === 'subtitle' || mode === 'both')
      fill(this.shadowRoot.querySelector('.nhv2-subtitle'), String(c.subtitle.text ?? '').trim(), c.subtitle.glitch);
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
    const tFontFamily  = t.font_family  ? `'${t.font_family}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)` : `var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)`;
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
    // glitch : le dégradé passe sur .t2 + copies (le clip-path des enfants ne troue pas le background-clip du parent)
    const tGradCSS     = !t.gradient ? ''
      : t.glitch ? '-webkit-text-fill-color:transparent;'
      : `background:linear-gradient(90deg,${tGradFrom},${tGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;
    const tFlickAnim   = t.flicker  ? `animation:nhv2-flicker ${this._flickDur}s ease-in-out infinite ${this._flickOff}s;` : '';

    // ── Subtitle computed ──────────────────────────────────────
    const sFontFamily  = s.font_family ? `'${s.font_family}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)` : tFontFamily;
    const sFontSize    = `${parseFloat(s.font_size)||13}px`;
    const sColor       = s.color || 'var(--secondary-text-color, #888)';
    const sIconColor   = s.icon_color || sColor;
    const sIconSize    = s.icon_size ? `${parseFloat(s.icon_size)}px` : sFontSize;
    const sLetterSp    = s.letter_spacing ? `${parseFloat(s.letter_spacing)}px` : 'normal';
    const sGlowColor   = s.glow_color || 'var(--accent-color, #FF50A0)';
    const sGlowSize    = parseFloat(s.glow_size)||6;
    // mode both : le sous-titre passe sous le titre -> une couche diffuse, sans cœur blanc
    const sGlowShadow  = !s.glow ? ''
      : c.mode === 'both' ? `text-shadow:0 0 ${Math.round(sGlowSize*.8)}px color-mix(in srgb, ${sGlowColor} 55%, transparent);`
      : _neonGlow(sGlowColor, sGlowSize);
    const sGradFrom    = s.gradient_from || 'var(--primary-color, #00E8FF)';
    const sGradTo      = s.gradient_to   || 'var(--accent-color, #FF50A0)';
    const sGradCSS     = !s.gradient ? ''
      : s.glitch ? '-webkit-text-fill-color:transparent;'
      : `background:linear-gradient(90deg,${sGradFrom},${sGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;
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
      let hex = sh.bg_color.replace('#','');
      if (/^[0-9a-fA-F]{3}$/.test(hex)) hex = hex.replace(/./g, m => m + m);
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

    // ── Glitch découpage (banc 02/10, port du .cyber-title sans franges RGB) ──
    const glitchAny = t.glitch || s.glitch;
    const glitchCss = glitchAny ? this._glitchCss(sh,
      t.glitch && t.gradient ? `linear-gradient(90deg,${tGradFrom},${tGradTo})` : null,
      s.glitch && s.gradient ? `linear-gradient(90deg,${sGradFrom},${sGradTo})` : null) : '';
    const gBurst = glitchAny && sh.glitch_burst_every > 0;

    const tpl = document.createElement('template');
    tpl.innerHTML = `
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
          /* ── Theme RGB vars ── */
          --nhv2-uv: var(--rgb-primary-color, 98,0,234);
          --nhv2-cy: var(--rgb-accent-color, 0,255,249);
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

        .nhv2-wrap {
          ${(mode === 'both' && hasIcon && !iconTop && !iconRight) ? `
          /* mode both : grid [icône][titre] sur ligne 1, subtitle ligne 2 PLEINE LARGEUR (découplé de l'icône) */
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          column-gap: 10px;
          ` : `
          display: flex;
          flex-direction: ${flexDir};
          align-items: ${alignV};
          justify-content: ${alignH};
          gap: ${iconTop ? '6px' : '10px'};
          `}
          padding: ${sh.padding};
          ${mode === 'both' ? 'padding-bottom: 12px; margin-bottom: 0;' : ''}
          position: relative;
          overflow: visible;
        }
        ${(mode === 'both' && hasIcon && !iconTop && !iconRight) ? `
          .nhv2-wrap > .nhv2-icon-wrap { grid-column: 1; grid-row: 1; }
          .nhv2-wrap > .nhv2-text-wrap { display: contents; }
          .nhv2-text-wrap > .nhv2-title { grid-column: 2; grid-row: 1; align-self: center; }
          /* subtitle : 2e ligne, pleine largeur, séparée du header par le DIVIDER exact des cards Entities */
          .nhv2-text-wrap > .nhv2-subtitle {
            grid-column: 1 / -1; grid-row: 2; width: 100%;
            margin-top: 8px; padding-top: 10px; position: relative;
          }
          /* divider HA Entities : div 1px, background-color var(--entities-divider-color, var(--divider-color)) */
          .nhv2-text-wrap > .nhv2-subtitle::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0;
            height: 1px;
            background-color: var(--entities-divider-color, var(--divider-color));
          }
          /* scanline confiné à la zone HEADER (ligne 1) uniquement, jamais sur le subtitle */
          ${t.scanline ? `
          .nhv2-wrap > .nhv2-scanlines {
            grid-column: 1 / -1; grid-row: 1; inset: auto;
            position: absolute; top: 0; left: 0; right: 0; bottom: auto;
            height: 100%; pointer-events: none; z-index: 2;
          }` : ''}
        ` : ''}

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
          ${!activeGlowEnabled ? ''
            : mode === 'subtitle'
            ? `filter:drop-shadow(0 0 ${Math.round(activeGlowSize*.3)}px ${activeGlowColor}) drop-shadow(0 0 ${Math.round(activeGlowSize*.6)}px ${activeGlowColor});`
            : `filter:drop-shadow(0 0 ${Math.round(activeGlowSize*.2)}px #fff) drop-shadow(0 0 ${Math.round(activeGlowSize*.4)}px ${activeGlowColor}) drop-shadow(0 0 ${Math.round(activeGlowSize*.8)}px ${activeGlowColor}) drop-shadow(0 0 ${activeGlowSize}px ${activeGlowColor});`}
          ${t.flicker ? tFlickAnim : ''}
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
          ${tGlowShadow}
          ${tFlickAnim}
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

        ${glitchCss}

        @media (prefers-reduced-motion: reduce) {
          .nhv2-title, .nhv2-subtitle, .nhv2-icon-wrap ha-icon,
          .nhv2-scanlines::before, .nhv2-scanlines::after,
          .gt .t, .gt .t2 { animation: none !important; }
          .gt::before, .gt::after { animation: none !important; visibility: hidden; }
        }
      </style>

      <ha-card class="nhv2-card${gBurst ? ' nhv2-gb' : ''}"${interactive?' style="cursor:pointer"':''}>
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
    this.shadowRoot.insertBefore(tpl.content, this._clearShadow());

    // ha-icon via createElement (§13)
    if (hasIcon) {
      const iconEl = document.createElement('ha-icon');
      iconEl.setAttribute('icon', activeIcon);
      this.shadowRoot.querySelector('.nhv2-icon-wrap').appendChild(iconEl);
    }

    this._updateText();

    // Click handler
    this._reattachObservers(this.shadowRoot.querySelector('ha-card.nhv2-card'));
    this._glitchStart();

    this._rendered = true;
  }

  /* CSS du glitch : 2 copies (attr(data-text)) découpées en bandes et décalées ; le texte d'origine (.t/.t2)
   * est troué EXACTEMENT là où passe chaque copie (polygon evenodd, mêmes durées -> synchrones). Pas de franges :
   * les copies héritent couleur, dégradé et halo. Style 1 = glitch du bouton cybr-btn (1 copie, à-coups). */
  _glitchCss(sh, tGrad, sGrad) {
    const f = sh.glitch_force, v = sh.glitch_speed;
    const band = (a, b) => `inset(${a}% -30% ${100 - b}% -30%)`;
    const hole = (a, b) => `polygon(evenodd,-30% -60%,130% -60%,130% 160%,-30% 160%,-30% -60%,-40% ${a}%,140% ${a}%,140% ${b}%,-40% ${b}%,-40% ${a}%)`;
    // cyber-title : [%, haut, bas, skew relatif] — valeurs de la démo
    const A = [[0,10,30,.625],[10,50,70,.25],[20,20,60,1],[100,80,100,.125]];
    const B = [[0,60,80,.75],[10,10,30,.375],[100,90,100,.125]];
    const kf = (n, K) => `@keyframes ${n}{` + K.map(([p,a,b,k]) => `${p}%{clip-path:${band(a,b)};transform:skewX(${(.8*f*k).toFixed(3)}deg);}`).join('') + '}'
                       + `@keyframes ${n}h{` + K.map(([p,a,b]) => `${p}%{clip-path:${hole(a,b)};}`).join('') + '}';
    // cybr-btn : [%, bande, sens du décalage] ; 'four' = bande vide (silence)
    const BB = { one:[2,95], two:[78,100], three:[44,54], four:[0,0], six:[40,85], seven:[63,80] };
    const Y = [[0,'one',0],[2,'two',-1],[6,'two',1],[8,'two',-1],[9,'two',0],[10,'three',1],[13,'three',0],[14,'four',1],[21,'four',1],
               [25,'four',1],[30,'four',-1],[31,'four',0],[35,'six',-1],[40,'six',1],[45,'six',-1],[50,'six',0],[55,'seven',1],[60,'seven',0],[61,'four',0],[100,'four',0]];
    const shift = +(2 * f).toFixed(2);
    const grad = (sel, g) => g ? `${sel} .t2, ${sel} .gt::before, ${sel} .gt::after { background:${g}; -webkit-background-clip:text; background-clip:text; }` : '';
    // délai négatif propre à l'instance : même durée => copie et trou restent synchrones entre eux
    const anim = (name, dur, extra = '') => `animation:${name} ${dur.toFixed(2)}s infinite ${extra};animation-delay:${(-this._gPhase * dur).toFixed(2)}s;`;
    return `
        .gt { position:relative; display:inline-block; max-width:100%; }
        .gt .t, .gt .t2 { display:inline-block; max-width:100%; }
        .gt::before, .gt::after {
          content:attr(data-text); position:absolute; top:0; left:0; width:100%; height:100%;
          white-space:inherit; pointer-events:none; color:inherit;
        }
        ${grad('.nhv2-title', tGrad)}
        ${grad('.nhv2-subtitle', sGrad)}
        ${sh.glitch_style ? `
        .gt::before { display:none; }
        .gt::after  { ${anim('nhv2-gy', 20 / v)} }
        .gt .t      { ${anim('nhv2-gyh', 20 / v)} }
        @keyframes nhv2-gy{${Y.map(([p,k,d]) => `${p}%{clip-path:${band(...BB[k])};transform:translateX(${d * shift}px);}`).join('')}}
        @keyframes nhv2-gyh{${Y.map(([p,k]) => `${p}%{clip-path:${hole(...BB[k])};}`).join('')}}
        ` : `
        .gt::before { left:${shift}px;  ${anim('nhv2-gxb', 3 / v, 'linear alternate-reverse')} }
        .gt::after  { left:${-shift}px; ${anim('nhv2-gxa', 2.5 / v, 'linear alternate-reverse')} }
        .gt .t      { ${anim('nhv2-gxah', 2.5 / v, 'linear alternate-reverse')} }
        .gt .t2     { ${anim('nhv2-gxbh', 3 / v, 'linear alternate-reverse')} }
        ${kf('nhv2-gxa', A)}
        ${kf('nhv2-gxb', B)}
        `}
        .nhv2-gb:not(.nhv2-gon) .gt::before, .nhv2-gb:not(.nhv2-gon) .gt::after { animation:none; visibility:hidden; }
        .nhv2-gb:not(.nhv2-gon) .gt .t, .nhv2-gb:not(.nhv2-gon) .gt .t2 { animation:none; }`;
  }

  /* vider le shadowRoot SAUF le <card-mod> posé par le thème (card-mod-card) à la création :
   * card-mod ne le remet pas quand la card se reconstruit. Renvoie ce <card-mod> (ou null) :
   * _render insère ses nœuds AVANT lui, ordre d'origine gardé. (mécanisme nixie 1.4.1) */
  _clearShadow() {
    const sr = this.shadowRoot;
    for (const n of [...sr.childNodes]) if (n.localName !== 'card-mod') n.remove();
    return [...sr.children].find(n => n.localName === 'card-mod') || null;
  }

  _reattachObservers(card) {
    if (!card) return;
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
