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

const VERSION = '0.4.1';

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

class VwCarCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = null;
    this._built = false;
    this._lastBatt = null;
    this._lastCharging = null;
    this._lastChargingRendered = null;
    this._fontLoaded = false;
    this._refreshTimer = null;   // setTimeout for force-refresh cleanup
    this._abortController = null; // AbortController for event listeners
    this._rafId = null;           // RAF coalescing
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
      corners: {
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
      controls: config.controls || [],
      controls_columns: config.controls_columns ?? 2,
      charging_info: config.charging_info || [],
      header: config.header !== undefined ? config.header : {},
      footer: config.footer !== undefined ? config.footer : {},
      charge_switch: config.charge_switch || 'switch.wvwzzze18sp049976_charging',
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

    if (!this._fontLoaded) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      this._fontLoaded = true;
    }

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

      if (val === 'unavailable') { val = '--'; bColor = 'rgba(255,255,255,0.2)'; }

      // Engrenage si settings_entity défini sur ce badge
      const gear = badge.settings_entity
        ? `<span class="vw-badge-gear" data-entity="${badge.settings_entity}" title="Configurer">
             <ha-icon icon="mdi:cog"></ha-icon>
           </span>`
        : '';

      return `
        <div class="vw-badge-wrap" data-entity="${badge.entity}">
          <div class="vw-badge" style="
            background:${bColor}25;
            border:1px solid ${bColor}60;
            color:${bColor};
            text-shadow:0 0 4px ${bColor}55;
          ">
            ${bIcon ? (bIcon.startsWith('mdi:')
              ? `<ha-icon icon="${bIcon}" style="--mdc-icon-size:12px;color:${bColor};"></ha-icon>`
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
          if (val === 'unavailable') { val = '--'; bColor = 'rgba(255,255,255,0.2)'; }
          const badgeEl = wrap.querySelector('.vw-badge');
          if (badgeEl) {
            badgeEl.style.background = bColor + '25';
            badgeEl.style.borderColor = bColor + '60';
            badgeEl.style.color = bColor;
            badgeEl.style.textShadow = `0 0 4px ${bColor}55`;
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

  _neonHeaderCss() {
    const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
    const color  = hdr.color       || 'rgba(180,130,255,0.55)';
    const size   = hdr.title_size  || 'clamp(8px, 2vw, 11px)';
    const font   = hdr.font        ? `'${hdr.font}', ` : "'Orbitron', ";
    const shadow = hdr.title_shadow || 'none';
    const badgeColor = hdr.badge_color || 'rgba(0,255,249,0.7)';
    return `
      .neon-hdr {
        display: flex; align-items: center; gap: 8px;
        padding: 11px 14px 8px;
      }
      .neon-hdr-icon { display: flex; align-items: center; flex-shrink: 0; }
      .neon-hdr-icon ha-icon {
        --mdc-icon-size: clamp(14px, ${size}, ${size});
        color: ${color};
        filter: drop-shadow(0 0 8px color-mix(in srgb, currentColor, transparent 10%));
      }
      .neon-hdr-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
      .neon-hdr-title {
        font-family: ${font}var(--primary-font-family, system-ui);
		letter-spacing: clamp(1px, 0.5cqi, 3px);
        font-size: clamp(14px, ${size}, ${size});
        color: ${color};
        text-transform: uppercase;
        padding-left: 8px;
        text-shadow: ${shadow};
        line-height: 1.2;
        white-space: nowrap; overflow: visible; text-overflow: ellipsis;
      }
      .neon-hdr-subtitle {
        font-family: ${font}var(--primary-font-family, system-ui);
        font-size: clamp(10px, ${size} * 0.75, 12px);
        color: color-mix(in srgb, ${color} 55%, transparent);
        letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;
      }
      .neon-hdr-badge {
        margin-left: auto; flex-shrink: 0;
        font-size: calc(${size} * 0.8); letter-spacing: 1.5px; text-transform: uppercase;
        color: ${badgeColor};
        border: 1px solid color-mix(in srgb, ${badgeColor} 40%, transparent);
        background: color-mix(in srgb, ${badgeColor} 8%, transparent);
        padding: 2px 7px; border-radius: 4px; white-space: nowrap;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
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
    const badge    = hdr.badge    || '';
    if (!icon && !title) return '';
    return `
      <div class="neon-hdr">
        ${icon ? `<div class="neon-hdr-icon"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
        <div class="neon-hdr-body">
          ${title    ? `<span class="neon-hdr-title">${title}</span>`       : ''}
          ${subtitle ? `<span class="neon-hdr-subtitle">${subtitle}</span>` : ''}
        </div>
        ${badge ? `<span class="neon-hdr-badge">${badge}</span>` : ''}
      </div>
      <div class="neon-main-div"></div>`;
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
      .vw-badge {
        display:inline-flex; align-items:center; gap:6px;
        border-radius:6px; padding:5px 12px;
        font-family:'Orbitron',monospace; font-size:11px; font-weight:700;
        cursor:pointer; transition:filter 0.2s;
        letter-spacing: 0.06em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      .vw-badge:hover { filter: brightness(1.2); }
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
