/**
 * Sonos Alarm Card — Neo Tokyo UV
 * Glassmorphism + #6200EA palette
 * @version 1.0.0
 */

console.log("sonos-alarm-card.js loaded!");

if (!document.getElementById('sonos-alarm-font')) {
  const l = document.createElement('link');
  l.id = 'sonos-alarm-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
  document.head.appendChild(l);
}

const SONOS_LOGO = `<svg viewBox="-6.015 -1.95 52.13 11.7" xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;display:block;"><path clip-rule="evenodd" d="M21.7 4.5L17 .1v7.4h1.4V3.4l4.7 4.4V.4h-1.4zM10.8 0C8.6 0 6.9 1.7 6.9 3.9c0 2.1 1.8 3.9 3.9 3.9 2.2 0 3.9-1.7 3.9-3.9S13 0 10.8 0m0 6.4c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5M4.5 3.9c-.4-.3-.9-.5-1.6-.7-1.4-.4-1.4-.8-1.4-1 0-.4.5-.8 1.2-.8.6 0 1.1.3 1.3.4l.1.1 1.1-.8-.1-.1s-.9-1-2.4-1C2 0 1.3.2.8.6.3 1 0 1.6 0 2.2c0 .6.3 1.2.8 1.6.4.3.9.5 1.6.7 1.4.4 1.4.8 1.4 1 0 .4-.5.8-1.2.8-.6 0-1.1-.3-1.3-.4l-.1-.1-1.1.8.1.1s.9 1 2.4 1c.7 0 1.4-.2 1.9-.6.5-.4.8-1 .8-1.6 0-.6-.3-1.1-.8-1.6M29.3 0c-2.2 0-3.9 1.7-3.9 3.9s1.8 3.9 3.9 3.9c2.2 0 3.9-1.7 3.9-3.9S31.4 0 29.3 0m0 6.4c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.2 2.5-2.5 2.5m6.3-2.6c.4.3.9.5 1.6.7 1.4.4 1.4.8 1.4 1 0 .4-.5.8-1.2.8-.6 0-1.1-.3-1.3-.4H36l-1.1.8.1.1s.9 1 2.4 1c.7 0 1.4-.2 1.9-.6.5-.4.8-1 .8-1.6 0-.6-.3-1.2-.8-1.6-.4-.3-.9-.5-1.6-.7-1.4-.4-1.4-.8-1.4-1 0-.4.5-.8 1.2-.8.6 0 1.1.3 1.3.4l.1.1 1.1-.8-.1-.1s-.9-1-2.4-1c-.7 0-1.4.2-1.9.6-.5.4-.8 1-.8 1.6-.1.6.2 1.1.8 1.5" fill-rule="evenodd" fill="rgba(180,130,255,0.75)"/></svg>`;

// ─── Card ─────────────────────────────────────────────────────────────────────
class SonosAlarmCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass     = null;
    this._config   = {};
    this._ac       = null;
    this._rendered = false;
  }

  _cleanup() {
    if (this._ac) { this._ac.abort(); this._ac = null; }
  }

  setConfig(config) {
    this._config = {
      alarms:          config.alarms          || [],
      name:            config.name            || 'Chambre',
      use_theme_card:  config.use_theme_card  ?? false,  // false = styles UV propres, true = hérite card-mod thème
    };
    this._build();
  }

  static getConfigElement() { return document.createElement('sonos-alarm-card-editor'); }
  static getStubConfig() {
    return {
      name: 'Chambre',
      alarms: [
        { entity: 'switch.sonos_alarm_1',  label: 'Weekdays alarm', schedule: 'LUN — VEN' },
        { entity: 'switch.sonos_alarm_3',  label: 'Weekdays alarm', schedule: 'LUN — VEN' },
        { entity: 'switch.sonos_alarm_63', label: 'Daily alarm',    schedule: 'QUOTIDIEN' },
      ],
    };
  }

  getCardSize() { return 3; }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  _build() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        :host {
          display: block;
          font-family: 'Orbitron', var(--primary-font-family, system-ui, sans-serif);
          border-radius: var(--ha-card-border-radius, 18px);
        }

        ha-card {
          border-radius: var(--ha-card-border-radius, 18px);
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
          ${this._config.use_theme_card ? `
            /* Hérite du card-mod thème */
            background: var(--ha-card-background);
            border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, rgba(98,0,234,0.45));
            box-shadow: var(--ha-card-box-shadow, 0 8px 32px rgba(0,0,0,0.55));
          ` : `
            /* Styles UV propres de la card */
            background: rgba(10,6,30,0.55);
            border: 1px solid rgba(98,0,234,0.45);
            box-shadow:
              0 0 0 1px rgba(180,0,255,0.06),
              0 8px 32px rgba(0,0,0,0.55),
              0 0 40px rgba(98,0,234,0.10),
              inset 0 1px 0 rgba(255,255,255,0.05);
          `}
        }

        /* coin UV — uniquement en mode propre */
        ${!this._config.use_theme_card ? `
        ha-card::after {
          content: '';
          position: absolute;
          top: -50px; left: -50px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(98,0,234,0.16) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }` : ''}

        .inner { position: relative; z-index: 1; }

        /* header */
        .hdr {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px 8px;
        }
        .hdr-title {
          font-size: 8px;
          color: rgba(180,130,255,0.55);
          letter-spacing: 3px;
        }

        /* divider */
        .div {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent);
          margin: 0 14px;
        }

        /* alarmes */
        .alarm {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          position: relative;
          transition: background .3s;
          cursor: default;
        }
        .alarm + .alarm { border-top: 1px solid rgba(98,0,234,0.10); }
        .alarm.on  { background: rgba(98,0,234,0.07); }
        /* OFF — couleurs discrètes par élément, pas d'opacity globale */
        .alarm.off .time       { color: rgba(180,130,255,0.28); text-shadow: none; }
        .alarm:hover { background: rgba(98,0,234,0.06); }
        .alarm.off:hover .time      { color: rgba(180,130,255,0.50); }
        .alarm.off:hover .meta-label{ color: rgba(98,0,234,0.55); }
        .alarm.off:hover .meta-name { color: rgba(180,130,255,0.42); }
        .alarm.off:hover .tog       { border-color: rgba(98,0,234,0.35); }
        .alarm.off .meta-label { color: rgba(98,0,234,0.35); }
        .alarm.off .meta-name  { color: rgba(180,130,255,0.25); }
        .alarm.off .tog        { background: rgba(98,0,234,0.12); border-color: rgba(98,0,234,0.50); }
        .alarm.off .tog-thumb  { left: 3px; right: auto; background: rgba(130,60,255,0.55); box-shadow: none; }

        /* barre latérale dégradé UV→cyan */
        .alarm.on::before {
          content: '';
          position: absolute;
          left: 0; top: 18%; bottom: 18%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #6200EA, #00fff9);
          box-shadow: 0 0 10px rgba(98,0,234,0.8), 0 0 20px rgba(0,255,249,0.25);
        }

        /* heure */
        .time {
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
          min-width: 80px;
          letter-spacing: 1px;
        }
        .alarm.on  .time { color: #fff; text-shadow: 0 0 14px rgba(98,0,234,0.7), 0 0 28px rgba(180,0,255,0.35); }
        .alarm.off .time { color: rgba(180,130,255,0.25); }

        .colon { display: inline-block; }
        .alarm.on .colon { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.12;} }

        /* pulse prochaine alarme active */
        .alarm.next.on .time { animation: pulse-uv 2.2s ease-in-out infinite; }
        @keyframes pulse-uv {
          0%,100% { text-shadow: 0 0 14px rgba(98,0,234,0.7), 0 0 28px rgba(180,0,255,0.35); }
          50%      { text-shadow: 0 0 22px rgba(98,0,234,1), 0 0 44px rgba(180,0,255,0.65), 0 0 60px rgba(0,255,249,0.2); }
        }

        /* meta */
        .meta { flex: 1; min-width: 0; }
        .meta-label { font-size: 7px; letter-spacing: 2px; margin-bottom: 2px; }
        .alarm.on  .meta-label { color: rgba(180,130,255,0.75); }
        .alarm.off .meta-label { color: rgba(180,130,255,0.2); }
        .meta-name {
          font-size: 10px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .alarm.on  .meta-name { color: rgba(200,170,255,0.6); }
        .alarm.off .meta-name { color: rgba(180,130,255,0.2); }

        /* toggle */
        .tog {
          width: 42px; height: 24px;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          transition: all .3s;
          -webkit-tap-highlight-color: transparent;
        }
        .tog.on {
          background: rgba(98,0,234,0.32);
          border: 1px solid rgba(98,0,234,0.85);
          box-shadow: 0 0 10px rgba(98,0,234,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .tog.off {
          background: rgba(98,0,234,0.14);
          border: 1px solid rgba(98,0,234,0.55);
        }
        .tog-thumb {
          position: absolute;
          top: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          transition: all .3s;
        }
        .tog.on  .tog-thumb {
          right: 3px;
          background: linear-gradient(135deg, #B400FF, #6200EA);
          box-shadow: 0 0 8px rgba(98,0,234,0.9), 0 0 14px rgba(180,0,255,0.5);
        }
        .tog.off .tog-thumb {
          left: 3px;
          background: rgba(130,60,255,0.60);
          box-shadow: 0 0 4px rgba(98,0,234,0.4);
        }

        /* footer */
        .footer {
          padding: 7px 14px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-top: 1px solid rgba(98,0,234,0.10);
          background: rgba(98,0,234,0.03);
        }
        .footer-text {
          font-size: 7px;
          color: rgba(180,130,255,0.30);
          letter-spacing: 1px;
        }
      </style>

      <ha-card>
        <div class="inner">
          <div class="hdr">
            ${SONOS_LOGO}
            <span class="hdr-title">ALARMES</span>
          </div>
          <div class="div"></div>
          <div class="alarms-list"></div>
          <div class="footer">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(98,0,234,0.5)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="footer-text footer-name"></span>
          </div>
        </div>
      </ha-card>
    `;

    this._ac = new AbortController();
    this._renderAlarms();
    this._rendered = true;
  }

  connectedCallback() {
    const card = this.shadowRoot?.querySelector('ha-card');
    if (card && this._rendered) {
      // Re-attach toggle listeners (aborted on disconnect)
      this._ac = new AbortController();
      const sig = { signal: this._ac.signal };
      this.shadowRoot.querySelectorAll('.tog').forEach(tog => {
        const row = tog.closest('.alarm[data-index]');
        if (!row) return;
        const alarm = this._config.alarms[+row.dataset.index];
        tog.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this._hass || !alarm?.entity) return;
          const state = this._hass.states[alarm.entity];
          if (!state) return;
          this._hass.callService('switch', state.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: alarm.entity });
        }, sig);
      });
      if (this._hass) this._update();
    }
  }

  disconnectedCallback() { this._cleanup(); }

  // ── Render alarm rows ──────────────────────────────────────────────────────

  _renderAlarms() {
    const list = this.shadowRoot.querySelector('.alarms-list');
    if (!list) return;
    list.innerHTML = '';

    this._config.alarms.forEach((alarm, i) => {
      const row = document.createElement('div');
      row.className = 'alarm';
      row.dataset.index = i;
      row.innerHTML = `
        <div class="time"><span class="h">--</span><span class="colon">:</span><span class="m">--</span></div>
        <div class="meta">
          <div class="meta-label">${(alarm.schedule || '').toUpperCase()}</div>
          <div class="meta-name">${alarm.label || alarm.entity}</div>
        </div>
        <div class="tog off"><div class="tog-thumb"></div></div>
      `;

      // tap toggle
      row.querySelector('.tog').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this._hass || !alarm.entity) return;
        const state = this._hass.states[alarm.entity];
        if (!state) return;
        this._hass.callService('switch', state.state === 'on' ? 'turn_off' : 'turn_on', {
          entity_id: alarm.entity,
        });
      }, { signal: this._ac?.signal });

      list.appendChild(row);
    });
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  _update() {
    if (!this._hass) return;
    const sr = this.shadowRoot;
    if (!sr.querySelector('.alarms-list')) return;

    // footer name
    const fn = sr.querySelector('.footer-name');
    if (fn) fn.textContent = (this._config.name || 'Sonos').toUpperCase() + ' · SONOS';

    const rows = sr.querySelectorAll('.alarm');
    let nextIdx = -1;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // first pass: states + extract time from friendly_name
    rows.forEach((row, i) => {
      const alarm  = this._config.alarms[i];
      if (!alarm) return;
      const state  = this._hass.states[alarm.entity];
      const isOn   = state?.state === 'on';

      // extract time from friendly_name e.g. "Weekdays alarm 06:50"
      const fname  = state?.attributes?.friendly_name || alarm.label || '';
      const tMatch = fname.match(/(\d{1,2}):(\d{2})/);
      let h = '--', m = '--', alarmMin = -1;
      if (tMatch) {
        h = tMatch[1].padStart(2, '0');
        m = tMatch[2];
        alarmMin = parseInt(tMatch[1]) * 60 + parseInt(tMatch[2]);
      }

      row.querySelector('.meta-name').textContent = alarm.label || alarm.entity;
      row.querySelector('.h').textContent = h;
      row.querySelector('.m').textContent = m;
      row.classList.toggle('on',  isOn);
      row.classList.toggle('off', !isOn);
      row.querySelector('.tog').classList.toggle('on',  isOn);
      row.querySelector('.tog').classList.toggle('off', !isOn);

      // track next alarm: ON + closest future time
      if (isOn && alarmMin >= 0) {
        const diff = (alarmMin - nowMin + 1440) % 1440;
        if (nextIdx === -1) {
          nextIdx = i;
        } else {
          const prevAlarm  = this._config.alarms[nextIdx];
          const prevState  = this._hass.states[prevAlarm?.entity];
          const prevFname  = prevState?.attributes?.friendly_name || '';
          const prevMatch  = prevFname.match(/(\d{1,2}):(\d{2})/);
          const prevMin    = prevMatch ? parseInt(prevMatch[1]) * 60 + parseInt(prevMatch[2]) : -1;
          const prevDiff   = (prevMin - nowMin + 1440) % 1440;
          if (diff < prevDiff) nextIdx = i;
        }
      }

      row.classList.remove('next');
    });

    // mark next
    if (nextIdx >= 0) rows[nextIdx]?.classList.add('next');
  }

  disconnectedCallback() {}
}

// ─── Editor ───────────────────────────────────────────────────────────────────
class SonosAlarmCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._built = false; }

  setConfig(config) {
    this._config = { ...config };
    if (!this._built) this._render();
    // else: inputs already reflect config; structural change (alarm count) → trigger rebuild
    else if ((this._config.alarms?.length ?? 0) !== this.querySelectorAll('.alarm-block').length) this._render();
  }
  set hass(h) { this._hass = h; if (!this._built) this._render(); else this._updatePickers(); }
  disconnectedCallback() { this.innerHTML = ''; this._built = false; }

  _render() {
    this._built = true;
    this.innerHTML = '';
    this.style.cssText = 'display:block;padding:16px;font-family:var(--primary-font-family,Roboto,sans-serif);';

    const style = document.createElement('style');
    style.textContent = `
      .sec { font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--primary-color);margin:16px 0 8px; }
      .row { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px; }
      .row label { font-size:14px;color:var(--primary-text-color);flex:1; }
      input[type=text],select { font-size:13px;padding:6px 8px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);outline:none;min-width:160px; }
      select { cursor:pointer; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-4px 0 8px; }
      .alarm-block { border:1px solid var(--divider-color,#eee);border-radius:8px;padding:10px 12px;margin-bottom:8px; }
      .alarm-block .sec { margin-top:0; }
    `;
    this.appendChild(style);

    const c = this._config;

    this._sec('Général');
    this._text('name', 'Nom affiché', c.name || '', 'Chambre');

    this._sec('Alarmes');
    this._hint('Jusqu\'à 5 alarmes. L\'heure est extraite du friendly_name de l\'entité.');

    const alarms = c.alarms || [{}];
    alarms.forEach((a, i) => this._alarmBlock(a, i));


    this._sec('Options');
    this._toggle('use_theme_card', 'Hériter du card-mod thème', c.use_theme_card ?? false);

    this._fillEntities();
  }

  _alarmBlock(alarm, i) {
    const block = document.createElement('div');
    block.className = 'alarm-block';

    const title = document.createElement('div');
    title.className = 'sec';
    title.textContent = `Alarme ${i + 1}`;
    block.appendChild(title);

    this._rowInto(block, `alarms[${i}].entity`,   'Entité switch',   alarm.entity   || '', true);
    this._rowInto(block, `alarms[${i}].label`,    'Label',           alarm.label    || '', false, 'ex: Weekdays alarm 06:50');
    this._rowInto(block, `alarms[${i}].schedule`, 'Planning',        alarm.schedule || '', false, 'ex: LUN — VEN');

    this.appendChild(block);
  }

  _toggle(key, label, checked) {
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!checked;
    cb.style.cssText='width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color,#6200EA);flex-shrink:0;';
    cb.addEventListener('change', e => this._set(key, e.target.checked));
    row.appendChild(lbl); row.appendChild(cb); this.appendChild(row);
  }

  _sec(t) { const d=document.createElement('div'); d.className='sec'; d.textContent=t; this.appendChild(d); }
  _hint(t){ const d=document.createElement('div'); d.className='hint'; d.textContent=t; this.appendChild(d); }

  _text(key, label, value, placeholder='') {
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const inp=document.createElement('input'); inp.type='text'; inp.value=value; inp.placeholder=placeholder;
    inp.addEventListener('change', e => this._set(key, e.target.value||undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _rowInto(parent, key, label, value, isEntity, placeholder='') {
    // §22 : input + <datalist> partout (jamais ha-entity-picker).
    const row=document.createElement('div'); row.className='row';
    const lbl=document.createElement('label'); lbl.textContent=label;
    const inp=document.createElement('input'); inp.type='text'; inp.value=value;
    if (isEntity) {
      inp.placeholder=placeholder||'switch.alarme';
      inp.autocomplete='off';
      inp.setAttribute('list','sonos-ent-list');
    } else {
      inp.placeholder=placeholder||label;
    }
    inp.addEventListener('change', e => this._set(key, e.target.value.trim()||undefined));
    row.appendChild(lbl); row.appendChild(inp); parent.appendChild(row);
  }

  _fillEntities() {
    if (!this._hass) return;
    let dl=this.querySelector('#sonos-ent-list');
    if (!dl) { dl=document.createElement('datalist'); dl.id='sonos-ent-list'; this.appendChild(dl); }
    // Les alarmes Sonos sont des switch.*
    const ids=Object.keys(this._hass.states).filter(e=>e.startsWith('switch.')).sort();
    if (dl.childElementCount === ids.length) return;
    dl.textContent='';
    const frag=document.createDocumentFragment();
    ids.forEach(id => {
      const o=document.createElement('option'); o.value=id;
      const fn=this._hass.states[id].attributes?.friendly_name;
      if (fn && fn!==id) o.label=fn;
      frag.appendChild(o);
    });
    dl.appendChild(frag);
  }

  _updatePickers() {
    // Renommé : alimente désormais le <datalist> d'autocomplétion.
    this._fillEntities();
  }

  _getNestedConfig(path) {
    // support alarms[0].entity style paths
    const m = path.match(/^alarms\[(\d+)\]\.(\w+)$/);
    if (m) return (this._config.alarms?.[+m[1]])?.[m[2]] || '';
    return this._config[path] || '';
  }

  _set(key, value) {
    const m = key.match(/^alarms\[(\d+)\]\.(\w+)$/);
    if (m) {
      const idx = +m[1], prop = m[2];
      const alarms = [...(this._config.alarms || [])];
      alarms[idx] = { ...(alarms[idx] || {}), [prop]: value };
      this._config = { ...this._config, alarms };
    } else {
      if (value===undefined||value==='') delete this._config[key];
      else this._config[key] = value;
    }
    this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:{...this._config}},bubbles:true,composed:true}));
  }
}

// ─── Registration ─────────────────────────────────────────────────────────────
customElements.define('sonos-alarm-card-editor', SonosAlarmCardEditor);
customElements.define('sonos-alarm-card', SonosAlarmCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'sonos-alarm-card',
  name: 'Sonos Alarm Card',
  description: 'Alarmes Sonos — Neo Tokyo UV glassmorphism',
  preview: true,
});

console.info('%c SONOS-ALARM-CARD %c v1.0.0 ','color:#6200EA;font-weight:bold;background:#040816','color:#fff;background:#444');

console.info(
  '%c ⏰ sonos-alarm-card v7.4 %c Neo Tokyo ',
  'background:#00D4FF;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#6200EA;padding:2px 4px;border-radius:0 3px 3px 0;'
);
