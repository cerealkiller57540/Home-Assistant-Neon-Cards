/* ── linux-terminal-card v1.0 ──
 * Terminal CRT sci-fi (Neo Tokyo) pour un PC Linux distant.
 * Look : écran CRT bombé + scanlines + glow + flicker (technique css-tricks old-timey terminal),
 * palette violet/cyan. "GLITCH" le chat = artefact hologramme (effet Silverhand RGB-split),
 * qui s'affole en invasion lors d'une alerte critique. Alertes graduées (WARN ligne + cadre rouge).
 */
(() => {

/* ── Device detection (MD §1) ───────────────────────────────────────────── */
const LTC_IS_IPAD      = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const LTC_IS_LOW_POWER = LTC_IS_IPAD || /iPhone|Android/.test(navigator.userAgent);

/* ── Polices — une seule fois ────────────────────────────────────────────── */
if (!document.getElementById('ltc-font')) {
  const l = document.createElement('link');
  l.id = 'ltc-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;700&display=swap';
  document.head.appendChild(l);
}

const CAT_PATH = 'M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z';
const _catSvg = () => `<svg viewBox="0 0 51 46"><path fill="currentColor" d="${CAT_PATH}"/></svg>`;

/* ── helpers ──────────────────────────────────────────────────────────── */
function _num(v){ const n = parseFloat(v); return isNaN(n) ? null : n; }
function _lvl(p, warn, hot){ return p == null ? 'ok' : (p >= hot ? 'hot' : p >= warn ? 'warn' : 'ok'); }

class LinuxTerminalCard extends HTMLElement {
  constructor(){ super(); this.attachShadow({ mode: 'open' }); }

  setConfig(c){
    if (!c) throw new Error('config manquante');
    this._config = { host: 'chris@latitude', ...c };
    this._rendered = false;
    this._renderKey = null;
    if (this._hass) this._render();
  }

  set hass(h){
    this._hass = h;
    if (!this._rendered){ this._render(); return; }
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => { this._raf = 0; this._update(); });
  }

  disconnectedCallback(){ this._cleanup(); }
  _cleanup(){
    if (this._raf){ cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._catTimer){ clearTimeout(this._catTimer); this._catTimer = 0; }
  }

  getCardSize(){ return 5; }
  static getConfigElement(){ return document.createElement('linux-terminal-card-editor'); }
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
    };
  }

  _ent(id){ if (!id || !this._hass) return null; const s = this._hass.states[id]; return s ? { v: s.state, a: s.attributes } : null; }
  _moreInfo(id){ if (!id) return; this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

  _sys(){
    const c = this._config;
    const cpu = _num(this._ent(c.cpu_entity)?.v);
    const gpu = _num(this._ent(c.gpu_entity)?.v);
    const ram = _num(this._ent(c.ram_entity)?.v);
    const disk = _num(this._ent(c.disk_entity)?.v);
    const temp = _num(this._ent(c.temp_entity)?.v);
    const batt = _num(this._ent(c.battery_entity)?.v);
    const rx = _num(this._ent(c.net_rx_entity)?.v);
    const tx = _num(this._ent(c.net_tx_entity)?.v);
    const os = this._ent(c.os_entity)?.v;
    const kernel = this._ent(c.kernel_entity)?.v;
    const up = this._ent(c.uptime_entity)?.v;
    const proc = this._ent(c.proc_entity)?.v;
    const updRaw = this._ent(c.updates_entity)?.v;
    const updates = _num(updRaw);
    // release upgrade Ubuntu (do-release-upgrade) : version dispo, ou 'none'/'?'/null si rien
    const relRaw = this._ent(c.release_entity)?.v;
    const release = (relRaw && !['none', '?', 'unknown', 'unavailable'].includes(String(relRaw).toLowerCase())) ? relRaw : null;
    const reboot = this._ent(c.reboot_entity)?.v === 'on';
    const loadRaw = _num(this._ent(c.load_entity)?.v);
    const cores = c.load_cores || 8;
    const load = loadRaw != null ? Math.min(100, loadRaw / cores * 100) : null;
    const battA = this._ent(c.battery_entity)?.a || {};
    const charging = String(battA.status || '').toLowerCase().includes('charg');
    // kernel court : 6.17.0-35-generic -> k6.17
    const kshort = kernel ? 'k' + kernel.split('-')[0].split('.').slice(0, 2).join('.') : null;
    return { cpu, gpu, ram, disk, temp, batt, rx, tx, os, kshort, up, proc, updates, release, reboot, load, charging };
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

    // couleur titre résolue une fois (pattern neon-entities-card) : défaut = var de thème
    const hdrColor = hdr.color || 'rgba(var(--rgb-primary-text-color),0.55)';
    this.shadowRoot.innerHTML = `
      <style>${STYLES}
        ha-card{
          ${cardModBg ? '' : `background:${c.color_bg || '#0c0818'};`}
          --ltc-hdr-color:${hdrColor};
          ${hdr.title_size  ? `--ltc-hdr-size:${hdr.title_size};`     : ''}
          ${hdr.title_shadow? `--ltc-hdr-shadow:${hdr.title_shadow};` : ''}
        }
      </style>
      <ha-card>
        <div class="hdr" id="hdr">
          <span class="hdr-title" id="hdr-title">${hdr.title || c.title || 'Latitude 5420'}</span>
          <span class="hdr-pill" id="pwr">●</span>
        </div>
        <div class="screen" id="screen">
          <div class="glow"></div>
          <div class="term" id="term"></div>
          <div class="cat-host" id="catHost"></div>
          <div class="scan"></div>
          <div class="vignette"></div>
          <div class="flicker"></div>
        </div>
      </ha-card>`;

    if (hdr.icon){
      const ico = document.createElement('ha-icon');
      ico.setAttribute('icon', hdr.icon); ico.className = 'hdr-icon';
      const h = this.shadowRoot.getElementById('hdr');
      h.insertBefore(ico, h.firstElementChild);
    }
    this.shadowRoot.getElementById('term').addEventListener('click', () => this._moreInfo(c.cpu_entity));
    this._rendered = true;
    this._update();
    if (!LTC_IS_LOW_POWER) this._catLoop();
  }

  _bar(lbl, pct, warn, hot, entity, unit){
    const p = pct == null ? 0 : Math.max(0, Math.min(100, pct));
    const lv = _lvl(p, warn, hot);
    return `<div class="row" data-ent="${entity || ''}">
      <span class="rl">${lbl}</span>
      <span class="bar"><span class="fill ${lv}" style="width:${p}%"></span></span>
      <span class="rv ${lv}">${pct != null ? Math.round(pct) + (unit || '%') : '—'}</span>
    </div>`;
  }

  _update(){
    const sr = this.shadowRoot;
    if (!sr || !this._hass) return;
    const c = this._config, s = this._sys();
    const al = this._alertLevel(s);

    const key = JSON.stringify(s) + al.lvl;
    if (key === this._renderKey) return;
    this._renderKey = key;
    this._critical = al.lvl === 'crit';

    // power pill + cadre alerte
    const pwr = sr.getElementById('pwr');
    if (pwr) pwr.className = 'hdr-pill ' + (s.cpu == null && s.os == null ? 'off' : al.lvl === 'crit' ? 'crit' : 'on');
    const screen = sr.getElementById('screen');
    if (screen) screen.classList.toggle('crit', al.lvl === 'crit');

    // terminal
    const host = c.host || 'chris@latitude';
    const prompt = `<span class="prompt">${host}</span><span class="sep">:~$</span>`;
    const fmtRate = v => v == null ? '—' : (v < 0.01 ? '<0.01' : v.toFixed(2));
    const battIcon = s.charging ? '⚡' : '🔋';
    const tW = c.temp_warn ?? 65, tC = c.temp_crit ?? 85;
    const bW = c.batt_warn ?? 25, bC = c.batt_crit ?? 10;

    // lignes d'alerte
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

    // ligne updates / reboot
    const updTxt = s.updates == null ? '' :
      (s.updates > 0 ? `<span class="updN">${s.updates} MAJ</span>` : `<span class="upd0">à jour</span>`);
    const rebootTxt = s.reboot ? `<span class="reboot"> · reboot *</span>` : '';
    // ligne dédiée release upgrade Ubuntu (montée de version)
    const releaseLine = s.release
      ? `<div class="ln alert warn">⬆ Ubuntu ${s.release} disponible (do-release-upgrade)</div>`
      : '';

    const html = `
      <div class="ln dim"><span class="k">OS</span> ${s.os || 'Linux'}${s.kshort ? ' · ' + s.kshort : ''}</div>
      <div class="ln dim"><span class="k">up</span> ${s.up || '—'}${s.proc ? ' · ' + s.proc + ' proc' : ''}${updTxt ? ' · ' + updTxt : ''}${rebootTxt}</div>
      ${releaseLine}
      ${warnLines}
      ${this._bar('CPU',  s.cpu,  70, 90, c.cpu_entity)}
      ${s.gpu != null ? this._bar('GPU', s.gpu, 70, 90, c.gpu_entity) : ''}
      ${s.load != null ? this._bar('LOAD', s.load, 80, 100, c.load_entity) : ''}
      ${this._bar('RAM',  s.ram,  75, 92, c.ram_entity)}
      ${this._bar('DSK',  s.disk, 80, 93, c.disk_entity)}
      ${this._bar('TEMP', s.temp != null ? Math.min(100, s.temp) : null, tW, tC, c.temp_entity, '°')}
      ${this._battRow(s, bW, bC)}
      <div class="ln net"><span class="k">net</span> <span class="dn">↓${fmtRate(s.rx)}</span> <span class="up">↑${fmtRate(s.tx)}</span> <span class="dim">Mbit/s</span></div>
      <div class="ln">${prompt} <span class="cur">█</span></div>`;

    const term = sr.getElementById('term');
    if (term){
      term.innerHTML = html;
      term.querySelectorAll('.row[data-ent]').forEach(el => {
        const id = el.dataset.ent;
        if (id) el.addEventListener('click', e => { e.stopPropagation(); this._moreInfo(id); });
      });
      if (!this._typed && !LTC_IS_LOW_POWER){
        this._typed = true;
        term.querySelectorAll('.ln, .row').forEach((el, i) => {
          el.style.animation = 'ltc-line-in .16s ease both';
          el.style.animationDelay = (i * 0.06).toFixed(2) + 's';
        });
      }
    }
  }

  _battRow(s, bW, bC){
    if (s.batt == null) return '';
    const lv = (s.batt <= bC && !s.charging) ? 'hot' : (s.batt <= bW && !s.charging) ? 'warn' : 'ok';
    return `<div class="row" data-ent="${this._config.battery_entity || ''}">
      <span class="rl">BATT</span>
      <span class="bar"><span class="fill ${lv}" style="width:${s.batt}%"></span></span>
      <span class="rv ${lv}">${Math.round(s.batt)}%${s.charging ? '⚡' : ''}</span>
    </div>`;
  }

  /* ── GLITCH the cat ── */
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
      const n = 2 + Math.floor(Math.random() * 2);          // 2-3 chats
      for (let i = 0; i < n; i++) setTimeout(() => this._spawnCat({ crit: true, dur: 900 + Math.random() * 500, scale: 0.55, scaleVar: 0.8 }), i * 120);
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
  :host{ display:block; }
  ha-card{
    padding:10px 12px 12px;
    --ltc-uv: var(--rgb-primary-color, 124,77,255);
    --ltc-cy: var(--rgb-accent-color, 0,229,255);
    --ltc-grn: 74,242,161;
    --ltc-amb: 255,173,51;
    --ltc-red: 255,61,80;
    --ltc-txt: var(--primary-text-color, #d9ccff);
    overflow:hidden;
  }
  .hdr{ display:flex; align-items:center; gap:9px; padding-bottom:9px; margin-bottom:10px; position:relative; }
  .hdr::after{ content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(var(--ltc-uv),.55) 20%, rgba(var(--ltc-cy),.3) 50%, rgba(var(--ltc-uv),.55) 80%, transparent); }
  .hdr-icon{ --mdc-icon-size:20px; color:var(--ltc-hdr-color); filter:drop-shadow(0 0 5px color-mix(in srgb, var(--ltc-hdr-color), transparent 20%)); flex-shrink:0; }
  .hdr-title{ flex:1; font-family:'Orbitron',sans-serif; font-size:var(--ltc-hdr-size,18px); letter-spacing:.05em;
    text-transform:uppercase; color:var(--ltc-hdr-color); text-shadow:var(--ltc-hdr-shadow,0 0 8px color-mix(in srgb, var(--ltc-hdr-color), transparent 30%)); }
  .hdr-pill{ font-size:11px; line-height:1; }
  .hdr-pill.on{ color:rgb(var(--ltc-grn)); filter:drop-shadow(0 0 5px rgb(var(--ltc-grn))); animation:ltc-blink 2.4s infinite; }
  .hdr-pill.crit{ color:rgb(var(--ltc-red)); filter:drop-shadow(0 0 6px rgb(var(--ltc-red))); animation:ltc-blink .6s infinite; }
  .hdr-pill.off{ color:rgba(255,255,255,.3); }

  /* ÉCRAN CRT bombé */
  .screen{ position:relative; border-radius:20px/26px; overflow:hidden;
    border:1px solid rgba(var(--ltc-uv),.55);
    box-shadow:0 0 0 3px rgba(var(--ltc-uv),.12), inset 0 0 40px rgba(var(--ltc-uv),.14);
    background:#08050f; transition:box-shadow .3s, border-color .3s; }
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

  /* ═══ GLITCH the cat (effet Silverhand) ═══ */
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

  /* alerte critique : cadre rouge pulsant */
  .screen.crit{ border-color:rgb(var(--ltc-red));
    box-shadow:0 0 0 3px rgba(var(--ltc-red),.4), inset 0 0 50px rgba(var(--ltc-red),.25);
    animation:ltc-critpulse 1s ease-in-out infinite; }

  @keyframes ltc-cursor{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes ltc-blink{ 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes ltc-fl{ 0%,95%,100%{opacity:0} 96%{opacity:.5} 97%{opacity:.1} 98%{opacity:.4} }
  @keyframes ltc-line-in{ from{opacity:0; transform:translateX(-6px)} to{opacity:1; transform:translateX(0)} }
  @keyframes ltc-critpulse{ 0%,100%{box-shadow:0 0 0 3px rgba(var(--ltc-red),.3), inset 0 0 40px rgba(var(--ltc-red),.2)}
    50%{box-shadow:0 0 14px 4px rgba(var(--ltc-red),.6), inset 0 0 60px rgba(var(--ltc-red),.35)} }

  ${LTC_IS_LOW_POWER ? `.term{transform:none;} .term .cur,.flicker,.hdr-pill.on{animation:none;} .screen.crit{animation:none;}` : ''}
`;

/* ═══════════════════════════════════════════════════════════════════════════
 *  EDITOR (§22 : input+datalist, _syncValues guard activeElement)
 * ═══════════════════════════════════════════════════════════════════════════ */
class LinuxTerminalCardEditor extends HTMLElement {
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
    this.querySelectorAll('input[data-key]').forEach(inp => {
      if (document.activeElement === inp) return;
      const parts = inp.dataset.key.split('.');
      const v = parts.length === 2 ? (c[parts[0]] || {})[parts[1]] : c[inp.dataset.key];
      // picker natif : n'accepte que du #hex (ignore var(...) / vide → garde sa valeur)
      if (inp.type === 'color'){ const hx = this._hexColor(v); if (hx) inp.value = hx; return; }
      inp.value = (v != null) ? v : '';
    });
  }
  _val(key){
    const parts = key.split('.'), c = this._config || {};
    return parts.length === 2 ? ((c[parts[0]] || {})[parts[1]] ?? '') : (c[key] ?? '');
  }
  // texte simple — pas de datalist (rien à chercher : titre, hôte, nombres…)
  _text(label, key, ph){
    return `<div class="field"><label>${label}</label>
      <input data-key="${key}" value="${this._val(key)}" placeholder="${ph || ''}" autocomplete="off"/></div>`;
  }
  // sélecteur d'entité — input + datalist (autocomplétion utile)
  _entity(label, key, ph){
    const lid = 'dl_' + key.replace(/\W/g, '');
    return `<div class="field"><label>${label}</label>
      <input data-key="${key}" value="${this._val(key)}" list="${lid}" placeholder="${ph || 'sensor.…'}" autocomplete="off"/>
      <datalist id="${lid}"></datalist></div>`;
  }
  // couleur — picker natif + champ texte côte à côte (pattern heat-pump-card)
  _hexColor(v){
    if (!v) return '';
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    const m = String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return '';
    return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
  }
  _color(label, key, ph){
    const v = this._val(key);
    return `<div class="field"><label>${label}</label>
      <div class="color-row">
        <input type="color" data-key="${key}" value="${this._hexColor(v) || ph || '#b482ff'}" class="color-swatch"/>
        <input type="text" data-key="${key}" value="${v}" placeholder="${ph || '#b482ff'}" autocomplete="off" class="color-text"/>
      </div></div>`;
  }
  // icône MDI — input + lien "parcourir MDI" + preview live (pattern neon-header-card-v2)
  _icon(label, key, ph){
    return `<div class="field">
      <label>${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:10px">parcourir MDI ↗</a></label>
      <div class="icon-row">
        <input data-key="${key}" value="${this._val(key)}" placeholder="${ph || 'mdi:laptop'}" autocomplete="off" class="icon-input"/>
        <div class="icon-preview" data-preview="${key}"></div>
      </div></div>`;
  }
  _render(){
    this.innerHTML = `
      <style>
        *{box-sizing:border-box;font-family:-apple-system,sans-serif}
        .grid{display:flex;flex-direction:column;gap:10px;padding:12px 0}
        .group{border:1px solid var(--divider-color,#333);border-radius:10px;padding:12px}
        .group-title{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:10px}
        .field{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
        label{font-size:12px;color:var(--secondary-text-color)}
        input{padding:8px 10px;border:1px solid var(--primary-color,#777);border-radius:7px;background:var(--card-background-color);color:var(--primary-text-color);font-size:13px;width:100%}
        input:focus{outline:none;box-shadow:0 0 0 1px var(--primary-color)}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .icon-row{display:flex;gap:8px;align-items:center}
        .icon-row .icon-input{flex:1}
        .color-row{display:flex;gap:8px;align-items:center}
        .color-row .color-swatch{width:42px;height:34px;flex-shrink:0;padding:2px;cursor:pointer}
        .color-row .color-text{flex:1}
        .icon-preview{width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
          border:1px solid var(--divider-color,#333);border-radius:7px;color:var(--primary-text-color)}
      </style>
      <div class="grid">
        <div class="group"><div class="group-title">Général</div>
          ${this._text('Hôte (prompt)', 'host', 'chris@latitude')}
        </div>
        <div class="group"><div class="group-title">En-tête</div>
          ${this._text('Titre', 'header.title', 'Latitude 5420')}
          ${this._icon('Icône', 'header.icon', 'mdi:laptop')}
          ${this._color('Couleur', 'header.color', '#b482ff')}
          ${this._text('Taille titre', 'header.title_size', '18px')}
          ${this._text('Ombre titre (text-shadow)', 'header.title_shadow', '0 0 8px ...')}
        </div>
        <div class="group"><div class="group-title">Système / OS (reporter MQTT)</div>
          ${this._entity('OS', 'os_entity')}
          ${this._entity('Kernel', 'kernel_entity')}
          ${this._entity('Uptime', 'uptime_entity')}
          ${this._entity('MAJ en attente', 'updates_entity')}
          ${this._entity('Release upgrade', 'release_entity')}
          ${this._entity('Reboot requis (binary)', 'reboot_entity', 'binary_sensor.…')}
          ${this._entity('Process total', 'proc_entity')}
        </div>
        <div class="group"><div class="group-title">Charge</div>
          ${this._entity('CPU %', 'cpu_entity')}
          ${this._entity('GPU %', 'gpu_entity')}
          ${this._entity('Load average', 'load_entity')}
          ${this._text('Nb cœurs (pour load %)', 'load_cores', '8')}
          ${this._entity('RAM %', 'ram_entity')}
          ${this._entity('Disque %', 'disk_entity')}
        </div>
        <div class="group"><div class="group-title">Température / Batterie / Réseau</div>
          ${this._entity('Température CPU', 'temp_entity')}
          ${this._entity('Batterie %', 'battery_entity')}
          ${this._entity('Réseau ↓ (RX)', 'net_rx_entity')}
          ${this._entity('Réseau ↑ (TX)', 'net_tx_entity')}
        </div>
        <div class="group"><div class="group-title">Seuils d'alerte</div>
          <div class="row2">${this._text('Temp WARN °C', 'temp_warn', '65')}${this._text('Temp CRIT °C', 'temp_crit', '85')}</div>
          <div class="row2">${this._text('Batt WARN %', 'batt_warn', '25')}${this._text('Batt CRIT %', 'batt_crit', '10')}</div>
        </div>
      </div>`;
    this.querySelectorAll('input[data-key]').forEach(inp =>
      inp.addEventListener('input', () => {
        const val = inp.value.trim();
        this._set(inp.dataset.key, val);
        // synchronise les inputs jumeaux (picker couleur ↔ champ texte sur la même clé)
        this.querySelectorAll(`input[data-key="${inp.dataset.key}"]`).forEach(t => {
          if (t === t.ownerDocument.activeElement || t === inp) return;
          if (t.type === 'color'){ const hx = this._hexColor(val); if (hx) t.value = hx; }
          else t.value = val;
        });
      }));
    this._refreshLists();
    this._bindIconPreviews();
  }

  // preview live de l'icône MDI (ha-icon via createElement) — pattern neon-header-card-v2
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

if (!customElements.get('linux-terminal-card'))
  customElements.define('linux-terminal-card', LinuxTerminalCard);
if (!customElements.get('linux-terminal-card-editor'))
  customElements.define('linux-terminal-card-editor', LinuxTerminalCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'linux-terminal-card',
  name: 'Linux Terminal Card',
  description: 'Terminal CRT sci-fi (Neo Tokyo) pour un PC Linux — CPU/GPU/RAM/temp/MAJ/réseau + GLITCH the cat',
  preview: true,
});

console.info('%c 🐧 linux-terminal-card v1.7 %c GLITCH ',
  'background:#6200EA;color:#fff;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#4AF2A1;padding:2px 4px;border-radius:0 3px 3px 0;');

})();
