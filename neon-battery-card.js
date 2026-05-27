/**
 * neon-battery-card v3
 * Carte batterie EV néon cyberpunk pour Home Assistant
 * Inclut les boutons de contrôle intégrés (HC MODE, SOLAR, CHARGE)
 *
 * Installation :
 *   1. Copier dans /config/www/neon-battery-card.js
 *   2. Ressources HA → /local/neon-battery-card.js (type: module)
 *
 * Config minimale :
 *   type: custom:neon-battery-card
 *   entity: sensor.battery_level
 *
 * Config complète : voir NeonBatteryCard.getStubConfig()
 */

const VERSION = '3.0.1';

// ═══════════════════════════════════════════════════════
//  DEFAULTS
// ═══════════════════════════════════════════════════════
function buildConfig(raw) {
  if (!raw.entity) throw new Error('[neon-battery-card] entity requis');
  return {
    // ── Entités ──────────────────────────────────────
    entity:                raw.entity,
    charging_entity:       raw.charging_entity       || null,
    power_entity:          raw.power_entity          || null,
    price_entity:          raw.price_entity          || null,
    surplus_entity:        raw.surplus_entity        || null,
    surplus_min_entity:    raw.surplus_min_entity    || null,
    max_target_entity:     raw.max_target_entity     || null,
    smart_charging_entity: raw.smart_charging_entity || null,
    solar_charging_entity: raw.solar_charging_entity || null,
    charge_switch_entity:  raw.charge_switch_entity  || null,
    time_left_entity:      raw.time_left_entity      || null,

    // ── Affichage ────────────────────────────────────
    name:             raw.name             || null,
    kwh_capacity:     raw.kwh_capacity     ?? 77,
    show_kwh:        raw.show_kwh        ?? true,
    show_ticks:      raw.show_ticks      ?? true,
    font_size_percent: raw.font_size_percent ?? 38,
    font_size_ticks:   raw.font_size_ticks   ?? 11,
    color_percent:     raw.color_percent     || null, // null = même que primary
    hc_label_on:     raw.hc_label_on     || 'HEURE CREUSE',
    hc_label_off:    raw.hc_label_off    || 'HEURE PLEINE',
    hc_state_value:  raw.hc_state_value  || 'HEURE CREUSE',

    // ── Infos latérales batterie ─────────────────────
    side_l1_entity: raw.side_l1_entity || null,
    side_l1_label:  raw.side_l1_label  || '',
    side_l2_entity: raw.side_l2_entity || null,
    side_l2_label:  raw.side_l2_label  || '',
    side_r1_entity: raw.side_r1_entity || null,
    side_r1_label:  raw.side_r1_label  || '',
    side_r2_entity: raw.side_r2_entity || null,
    side_r2_label:  raw.side_r2_label  || '',

    // ── Boutons intégrés ─────────────────────────────
    buttons: Array.isArray(raw.buttons) ? raw.buttons : [],

    // ── tap_action ───────────────────────────────────
    tap_action: raw.tap_action || 'more-info', // 'more-info' | 'none'

    // ── Couleurs (null = hérite du thème HA) ─────────
    color_primary:     raw.color_primary     || null,
    color_accent:      raw.color_accent      || null,
    color_charge_off:  raw.color_charge_off  || null,
    color_charge_on:   raw.color_charge_on   || null,
    color_fill_top:    raw.color_fill_top    || null,
    color_fill_mid:    raw.color_fill_mid    || null,
    color_fill_bottom: raw.color_fill_bottom || null,
    color_side_val:    raw.color_side_val    || null,
    color_batt_border: raw.color_batt_border || null,

    // ── Perf ─────────────────────────────────────────
    smooth_transitions: raw.smooth_transitions ?? true,
    animation_duration: raw.animation_duration ?? 800,
    power_save_mode:    raw.power_save_mode    ?? false,
    debounce_updates:   raw.debounce_updates   ?? false,
    update_interval:    raw.update_interval    ?? 500,
  };
}

// ═══════════════════════════════════════════════════════
//  SVG BATTERIE
// ═══════════════════════════════════════════════════════
function buildSVG(batt, isCharging, C, showTicks, fontSizePct = 38, fontSizeTicks = 11, colorPercent = null) {
  const borderCol = C.battBorder || C.primary;
  const W = 160, H = 250;
  const bx = 18, by = 40, bw = W - 30, bh = H - 58;
  const ix = bx + 7, iy = by + 7, iw = bw - 14, ih = bh - 14;
  const fh  = Math.max(2, Math.round(batt * ih / 100));
  const fy  = iy + ih - fh;
  const uid = `nb${batt | 0}_${Math.random().toString(36).slice(2, 5)}`;
  const s25 = iy + ih * 0.75, s50 = iy + ih * 0.5, s75 = iy + ih * 0.25;

  const ticks = showTicks ? [
    [s75, 75], [s50, 50], [s25, 25],
  ].map(([sy, v]) => `
    <line x1="${ix+3}" y1="${sy.toFixed(1)}" x2="${ix+iw-3}" y2="${sy.toFixed(1)}"
      stroke="#070B14" stroke-width="1.5" opacity="0.8"/>
    <text x="${bx+bw+6}" y="${sy.toFixed(1)}" fill="${C.primary}" font-size="${fontSizeTicks}"
      font-family="Rajdhani,monospace" dominant-baseline="middle" opacity="0.7">${v}</text>
  `).join('') : '';

  return `
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
    style="overflow:visible;display:block;">
    <defs>
      <filter id="${uid}g" x="-60%" y="-40%" width="220%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10"  result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${uid}s" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${uid}t" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
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
      <pattern id="${uid}sc" x="0" y="0" width="${W}" height="4" patternUnits="userSpaceOnUse">
        <rect width="${W}" height="2" fill="rgba(0,0,0,0.1)"/>
      </pattern>
    </defs>

    <!-- ambient ring -->
    <rect x="${bx-4}" y="${by-4}" width="${bw+8}" height="${bh+8}" rx="16"
      fill="none" stroke="${borderCol}" stroke-width="1.2" stroke-opacity="0.08">
      ${isCharging ? '<animate attributeName="stroke-opacity" values="0.05;0.3;0.05" dur="2.5s" repeatCount="indefinite"/>' : ''}
    </rect>

    <!-- terminal -->
    <rect x="${bx+bw/2-19}" y="${by-17}" width="38" height="21" rx="7"
      fill="#0D1A28" stroke="${borderCol}" stroke-width="1.8" filter="url(#${uid}g)"/>
    <rect x="${bx+bw/2-11}" y="${by-12}" width="22" height="9" rx="2.5"
      fill="${borderCol}" fill-opacity="0.18"/>

    <!-- body -->
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="11"
      fill="#0D1A28" stroke="${borderCol}" stroke-width="2.2" filter="url(#${uid}g)"/>

    <!-- fill -->
    <g clip-path="url(#${uid}c)">
      <rect x="${ix}" y="${fy}" width="${iw}" height="${fh}" fill="url(#${uid}f)" rx="3">
        ${isCharging ? '<animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/>' : ''}
      </rect>
      <rect x="${ix}" y="${fy}" width="${Math.round(iw*0.38)}" height="${fh}"
        fill="url(#${uid}sh)" rx="3"/>
      <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${uid}sc)"/>
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

    <!-- inner border -->
    <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="4"
      fill="none" stroke="${borderCol}" stroke-width="0.5" stroke-opacity="0.2"/>

    <!-- pourcentage -->
    <text x="${bx+bw/2}" y="${by+bh/2+6}" class="pct-glitch" data-batt-text
      fill="${colorPercent || C.primary}" font-size="${fontSizePct}" font-weight="700"
      font-family="Rajdhani,'Share Tech Mono',monospace"
      text-anchor="middle" dominant-baseline="middle">${batt}%</text>

    <!-- bolt -->
    ${isCharging ? `
      <polygon
        points="${bx+bw/2+8},${by+24} ${bx+bw/2-7},${by+48} ${bx+bw/2+1},${by+48}
                ${bx+bw/2-9},${by+68} ${bx+bw/2+11},${by+42} ${bx+bw/2+4},${by+42}
                ${bx+bw/2+14},${by+24}"
        fill="${C.primary}" filter="url(#${uid}g)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
      </polygon>` : ''}

    <!-- boot scanline (once) -->
    <rect x="${ix}" y="${by}" width="${iw}" height="6"
      fill="white" fill-opacity="0" clip-path="url(#${uid}c)">
      <animate attributeName="y" values="${by};${by+bh}" dur="5s" repeatCount="10" fill="indefinite"/>
      <animate attributeName="fill-opacity" values="0.35;0.1;0" dur="1.5s" repeatCount="10" fill="freeze"/>
    </rect>
  </svg>`;
}

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL
// ═══════════════════════════════════════════════════════
class NeonBatteryCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    if (!this._built) {
      if (this._hass) { this._built = true; this._build(); }
    } else if (!this._ownChange) {
      // Changement externe (undo/redo HA) → rebuild nécessaire
      this._build();
    }
    // Si _ownChange : c'est notre propre dispatch config-changed,
    // le DOM est déjà correct, on ne fait rien.
    this._ownChange = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built && this._config) { this._built = true; this._build(); }
    else this.querySelectorAll('ha-entity-picker').forEach(p => { p.hass = hass; });
  }

  _entities(filter) {
    return Object.keys(this._hass.states).filter(filter);
  }

  _entityInput(key) {
    const val = this._config[key] ?? '';
    // Placeholder div — replaced by ha-entity-picker in _injectEntityPickers()
    return `<div class="entity-picker-slot" data-key="${key}" data-val="${val.replace(/"/g,'&quot;')}"></div>`;
  }

  _select(label, key, opts, hint = '') {
    const val = this._config[key] ?? '';
    const options = ['', ...opts].map(o =>
      `<option value="${o}" ${o === String(val) ? 'selected' : ''}>${o || '— aucun —'}</option>`
    ).join('');
    return `
      <div class="field">
        <label>${label}</label>
        <select data-key="${key}">${options}</select>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _input(label, key, type = 'text', hint = '') {
    const val = this._config[key] ?? '';
    return `
      <div class="field">
        <label>${label}</label>
        <input type="${type}" data-key="${key}" value="${val}"/>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _bool(label, key, hint = '') {
    const val = this._config[key] ?? true;
    return `
      <div class="field">
        <label>${label}</label>
        <select data-key="${key}">
          <option value="true"  ${val !== false ? 'selected' : ''}>Oui</option>
          <option value="false" ${val === false ? 'selected' : ''}>Non</option>
        </select>
        ${hint ? `<p class="hint">${hint}</p>` : ''}
      </div>`;
  }

  _build() {
    const sensors  = this._entities(e => e.startsWith('sensor.'));
    const booleans = this._entities(e => e.startsWith('input_boolean.'));
    const numbers  = this._entities(e => e.startsWith('input_number.'));
    const switches = this._entities(e => e.startsWith('switch.'));
    const inputs   = [...booleans, ...numbers].sort();

    this.innerHTML = `
      <style>
        :host { display: block; padding: 4px 0; }
        h3 { font-size: 13px; font-weight: 700; color: var(--primary-color); text-transform: uppercase;
             letter-spacing: 1px; margin: 18px 0 8px; border-bottom: 1px solid var(--divider-color); padding-bottom: 4px; }
        .field { margin-bottom: 10px; }
        label { display: block; font-size: 12px; color: var(--secondary-text-color); margin-bottom: 3px; }
        input, select { width: 100%; padding: 6px 8px; border-radius: 6px;
          border: 1px solid var(--divider-color); background: var(--card-background-color);
          color: var(--primary-text-color); font-size: 13px; box-sizing: border-box; }
        input[type=color] { height: 36px; padding: 2px 4px; cursor: pointer; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .hint { font-size: 10px; color: var(--disabled-text-color); margin: 3px 0 0; }
        .color-reset { font-size: 10px; color: var(--primary-color); cursor: pointer;
          text-decoration: underline; margin-top: 3px; display: inline-block; }
      </style>

      <h3>Entités principales</h3>
      ${this._select('Batterie *', 'entity', sensors)}
      <div class="row2">
        ${this._select('État de charge', 'charging_entity', sensors)}
        ${this._select('Puissance charge (W)', 'power_entity', sensors)}
      </div>

      <h3>Affichage tarif & solaire</h3>
      <div class="row2">
        ${this._select('Entité tarif (HC/HP)', 'price_entity', sensors)}
        ${this._select('Surplus solaire (W)', 'surplus_entity', sensors)}
      </div>
      <div class="row2">
        ${this._select('Seuil surplus min', 'surplus_min_entity', inputs)}
        ${this._select('Niveau cible max', 'max_target_entity', inputs)}
      </div>
      <div class="row2">
        ${this._input('Libellé HC actif', 'hc_label_on', 'text')}
        ${this._input('Libellé HC inactif', 'hc_label_off', 'text')}
      </div>
      ${this._input('Valeur état HC (ex: HEURE CREUSE)', 'hc_state_value')}

      <h3>Infos latérales batterie</h3>
      <p class="hint" style="margin-bottom:8px">2 cases à gauche et 2 à droite de la batterie. L'unité est lue automatiquement depuis HA.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <p class="hint" style="text-align:center;margin-bottom:6px">◀ GAUCHE</p>
          <div class="field">
            <label>Slot gauche 1 — Entité</label>
            ${this._entityInput('side_l1_entity')}
          </div>
          <div class="field">
            <label>Slot gauche 1 — Libellé</label>
            <input type="text" data-key="side_l1_label" value="${this._config.side_l1_label || ''}"/>
          </div>
          <div class="field" style="margin-top:10px">
            <label>Slot gauche 2 — Entité</label>
            ${this._entityInput('side_l2_entity')}
          </div>
          <div class="field">
            <label>Slot gauche 2 — Libellé</label>
            <input type="text" data-key="side_l2_label" value="${this._config.side_l2_label || ''}"/>
          </div>
        </div>
        <div>
          <p class="hint" style="text-align:center;margin-bottom:6px">DROITE ▶</p>
          <div class="field">
            <label>Slot droit 1 — Entité</label>
            ${this._entityInput('side_r1_entity')}
          </div>
          <div class="field">
            <label>Slot droit 1 — Libellé</label>
            <input type="text" data-key="side_r1_label" value="${this._config.side_r1_label || ''}"/>
          </div>
          <div class="field" style="margin-top:10px">
            <label>Slot droit 2 — Entité</label>
            ${this._entityInput('side_r2_entity')}
          </div>
          <div class="field">
            <label>Slot droit 2 — Libellé</label>
            <input type="text" data-key="side_r2_label" value="${this._config.side_r2_label || ''}"/>
          </div>
        </div>
      </div>

      <h3>Bouton de charge</h3>
      ${this._select('Bouton : Démarrer/Arrêter charge', 'charge_switch_entity', switches,
        'Ce bouton affichera une confirmation avant d\'agir.')}
      <div class="field">
        <label>Temps restant (entité)</label>
        ${this._entityInput('time_left_entity')}
        <p class="hint">Si renseigné, remplace le calcul interne. Ex: sensor.xxx_charging_time_left</p>
      </div>

      <h3>Informations</h3>
      ${this._input('Nom du véhicule', 'name')}
      <div class="row2">
        ${this._input('Capacité batterie (kWh)', 'kwh_capacity', 'number')}
        ${this._bool('Afficher kWh', 'show_kwh')}
      </div>
      <div class="row2">
        ${this._bool('Graduations 25/50/75', 'show_ticks')}
      </div>
      <div class="row2">
        ${this._input('Taille % batterie (défaut: 38)', 'font_size_percent', 'number',
          'Taille en px du pourcentage affiché dans la batterie.')}
        ${this._input('Taille graduations (défaut: 11)', 'font_size_ticks', 'number',
          'Taille en px des repères 25 / 50 / 75.')}
      </div>

      <h3>Interaction</h3>
      <div class="field">
        <label>Clic sur la batterie</label>
        <select data-key="tap_action">
          <option value="more-info" ${(this._config.tap_action||'more-info')==='more-info'?'selected':''}>Plus d'infos (entité batterie)</option>
          <option value="none"      ${this._config.tap_action==='none'?'selected':''}>Aucun</option>
        </select>
      </div>

      <h3>Couleurs <span style="font-size:11px;font-weight:normal">(vide = thème HA automatique)</span></h3>
      <div class="row2">
        <div>
          <label>Principal (contour, texte, glow)</label>
          <input type="color" data-key="color_primary" value="${this._config.color_primary || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_primary" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
        <div>
          <label>Accent (glitch % en charge)</label>
          <input type="color" data-key="color_accent" value="${this._config.color_accent || '#FF50A0'}"/>
          <span class="color-reset" data-reset="color_accent" data-default="#FF50A0">↺ Réinitialiser</span>
        </div>
      </div>
      <div class="row2">
        <div>
          <label>Bouton charge — inactif</label>
          <input type="color" data-key="color_charge_off" value="${this._config.color_charge_off || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_charge_off" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
        <div>
          <label>Bouton charge — actif</label>
          <input type="color" data-key="color_charge_on" value="${this._config.color_charge_on || '#FF0090'}"/>
          <span class="color-reset" data-reset="color_charge_on" data-default="#FF0090">↺ Réinitialiser</span>
        </div>
      </div>
      <div class="row2">
        <div>
          <label>Pourcentage (texte batterie)</label>
          <input type="color" data-key="color_percent" value="${this._config.color_percent || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_percent" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
        <div>
          <label>Valeur slots latéraux</label>
          <input type="color" data-key="color_side_val" value="${this._config.color_side_val || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_side_val" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
      </div>
      <div class="row2">
        <div>
          <label>Contour batterie</label>
          <input type="color" data-key="color_batt_border" value="${this._config.color_batt_border || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_batt_border" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
      </div>
      <div class="row3">
        <div>
          <label>Remplissage haut</label>
          <input type="color" data-key="color_fill_top" value="${this._config.color_fill_top || '#00E8FF'}"/>
          <span class="color-reset" data-reset="color_fill_top" data-default="#00E8FF">↺ Réinitialiser</span>
        </div>
        <div>
          <label>Remplissage milieu</label>
          <input type="color" data-key="color_fill_mid" value="${this._config.color_fill_mid || '#FF50A0'}"/>
          <span class="color-reset" data-reset="color_fill_mid" data-default="#FF50A0">↺ Réinitialiser</span>
        </div>
        <div>
          <label>Remplissage bas</label>
          <input type="color" data-key="color_fill_bottom" value="${this._config.color_fill_bottom || '#E946FF'}"/>
          <span class="color-reset" data-reset="color_fill_bottom" data-default="#E946FF">↺ Réinitialiser</span>
        </div>
      </div>
      <p class="hint">Les couleurs à null héritent de --primary-color, --state-active-color, --accent-color du thème HA.</p>

      <h3>Performance</h3>
      <div class="row2">
        ${this._bool('Transitions douces', 'smooth_transitions')}
        ${this._input('Durée animation (ms)', 'animation_duration', 'number')}
      </div>
      <div class="row2">
        ${this._bool('Mode économie d\'énergie', 'power_save_mode', 'Pause les updates quand la card n\'est pas visible.')}
        ${this._bool('Debounce updates', 'debounce_updates')}
      </div>
    `;

    // Events — champs
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el.type === 'color') {
        // color picker : uniquement 'change' (déclenché à la fermeture), pas 'input' (1 event/px)
        el.addEventListener('change', () => this._changed(el.dataset.key, el.value));
      } else if (el.tagName === 'SELECT') {
        el.addEventListener('change', () => this._changed(el.dataset.key, el.value));
      } else if (el.dataset.autocomplete !== undefined) {
        // dead code — entity fields now use ha-entity-picker
      } else {
        // text / number : 'change' immédiat + 'input' debouncé pour la preview en direct
        el.addEventListener('change', () => { clearTimeout(el._t); this._changed(el.dataset.key, el.value); });
        el.addEventListener('input',  () => { clearTimeout(el._t); el._t = setTimeout(() => this._changed(el.dataset.key, el.value), 300); });
      }
    });
    // Color reset spans
    this.querySelectorAll('.color-reset').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.reset;
        const input = this.querySelector(`[data-key="${key}"]`);
        if (input && el.dataset.default) input.value = el.dataset.default;
        this._changed(key, null);
      });
    });
    // Inject ha-entity-picker for all entity slot placeholders
    this._injectEntityPickers();
  }

  _injectEntityPickers() {
    this.querySelectorAll('.entity-picker-slot').forEach(slot => {
      const key = slot.dataset.key;
      const val = slot.dataset.val || '';
      const picker = document.createElement('ha-entity-picker');
      if (this._hass) picker.hass = this._hass;
      picker.value = val;
      picker.allowCustomEntity = true;
      picker.style.cssText = 'width:100%;display:block;';
      picker.addEventListener('value-changed', (ev) => {
        ev.stopPropagation();
        this._changed(key, ev.detail.value || null);
      });
      slot.replaceWith(picker);
    });
  }

  _changed(key, raw) {
    let val = raw;
    if (val === 'true')  val = true;
    if (val === 'false') val = false;
    if (val !== null && val !== '' && [
      'kwh_capacity', 'animation_duration', 'update_interval',
      'font_size_percent', 'font_size_ticks',
    ].includes(key))
      val = parseFloat(val);
    const config = { ...this._config };
    if (val === null || val === '') delete config[key];
    else config[key] = val;
    this._config = config;
    this._ownChange = true;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
  }
}
customElements.define('neon-battery-card-editor', NeonBatteryCardEditor);

// ═══════════════════════════════════════════════════════
//  CARD PRINCIPALE
// ═══════════════════════════════════════════════════════
class NeonBatteryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._prevBatt      = null;
    this._updateTimer   = null;
    this._animFrame     = null;
    this._observer      = null;
    this._isVisible     = true;
    this._btnsRendered  = false;
  }

  // ── API Lovelace ──────────────────────────────────────
  static getConfigElement() { return document.createElement('neon-battery-card-editor'); }
  static getStubConfig() {
    return {
      entity:                'sensor.wvwzzze18sp049976_battery_level',
      charging_entity:       'sensor.wvwzzze18sp049976_charging_state',
      power_entity:          'sensor.wvwzzze18sp049976_charging_power',
      price_entity:          'sensor.lixee_current_price',
      surplus_entity:        'sensor.surplus_solaire_disponible',
      surplus_min_entity:    'input_number.solar_surplus_min',
      max_target_entity:     'input_number.car_battery_max',
      smart_charging_entity: 'input_boolean.car_smart_charging',
      solar_charging_entity: 'input_boolean.car_solar_charging',
      charge_switch_entity:  'switch.wvwzzze18sp049976_charging',
      kwh_capacity:          77,
      name:                  'ID.4 Pro',
    };
  }

  _cleanup() {
    if (this._animFrame)   { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
    if (this._updateTimer) { clearTimeout(this._updateTimer); this._updateTimer = null; }
    if (this._observer)    { this._observer.disconnect(); this._observer = null; }
    // NOTE: _btnsRendered intentionally NOT reset here — shadow DOM persists through tab switch
  }

  setConfig(raw) {
    this._cleanup();
    this._btnsRendered = false; // config changed → force full re-render
    this._config = buildConfig(raw);
    if (this._config.charge_switch_entity) {
      this._config._chargeSwitch = this._config.charge_switch_entity;
    }
  }

  getCardSize() { return 6; }

  set hass(hass) {
    this._hass = hass;
    if (this._config.power_save_mode && !this._isVisible) return;
    if (this._config.debounce_updates) {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(() => this._render(), this._config.update_interval);
    } else {
      this._render();
    }
  }

  connectedCallback() {
    if (this._config?.power_save_mode) {
      this._observer = new IntersectionObserver(entries => {
        this._isVisible = entries[0].isIntersecting;
        if (this._isVisible && this._hass) this._render();
      }, { threshold: 0.1 });
      this._observer.observe(this);
    } else if (this._btnsRendered && this._hass) {
      // Tab return without power_save_mode: re-render to refresh values
      this._render();
    }
  }

  disconnectedCallback() { this._cleanup(); }

  // ── Helpers ───────────────────────────────────────────
  _state(eid, fallback = null) {
    if (!eid || !this._hass?.states[eid]) return fallback;
    return this._hass.states[eid].state;
  }
  _float(eid, fallback = 0) {
    const v = parseFloat(this._state(eid));
    return isNaN(v) ? fallback : v;
  }
  _col(cfg, cssVar, hard) {
    return cfg || hard;
  }

  _moreInfo(entityId) {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _callService(domain, service, data) {
    this._hass.callService(domain, service, data)
      .catch(err => console.error(`[neon-battery-card] ${domain}.${service}:`, err));
  }

  _toggle(entityId) {
    if (!entityId || !this._hass) return;
    const domain = entityId.split('.')[0];
    const serviceMap = {
      switch:        ['switch',        'toggle'],
      input_boolean: ['input_boolean', 'toggle'],
      light:         ['light',         'toggle'],
      automation:    ['automation',    'toggle'],
    };
    const [svc_domain, svc] = serviceMap[domain] || ['homeassistant', 'toggle'];
    this._callService(svc_domain, svc, { entity_id: entityId });
  }

  // ── Animation smooth du % ──────────────────────────────
  _animateBatt(from, to) {
    const dur   = this._config.animation_duration;
    const start = performance.now();
    const step  = now => {
      const p    = Math.min((now - start) / dur, 1);
      const ease = p < 0.5 ? 4*p**3 : 1 - (-2*p+2)**3/2;
      const cur  = Math.round(from + (to - from) * ease);
      const el   = this.shadowRoot?.querySelector('[data-batt-text]');
      if (el) el.textContent = `${cur}%`;
      if (p < 1) this._animFrame = requestAnimationFrame(step);
    };
    cancelAnimationFrame(this._animFrame);
    this._animFrame = requestAnimationFrame(step);
  }

  // ── Mise à jour bouton sans re-render complet ──────────
  _updateButtons() {
    const c = this._config;
    if (!c._chargeSwitch) return;
    const isOn = this._state(c._chargeSwitch) === 'on';
    const btn  = this.shadowRoot?.querySelector('[data-btn="charge"]');
    if (!btn) return;
    btn.dataset.on    = isOn ? '1' : '0';
    btn.className     = `btn charge-btn ${isOn ? 'btn-on charge-on' : 'btn-off charge-off'}`;
    btn.dataset.label = isOn ? 'STOP CHARGE' : 'START CHARGE';
    btn.querySelector('.btn-icon').textContent  = isOn ? '⏹' : '▶';
    btn.querySelector('.btn-label').textContent = isOn ? 'STOP CHARGE' : 'START CHARGE';
    btn.setAttribute('aria-pressed', isOn);
  }

  // ── Render principal ───────────────────────────────────
  _render() {
    if (!this._hass || !this._config) return;
    const c = this._config;

    const batt       = this._float(c.entity, 0);
    const isCharging = this._state(c.charging_entity)?.toLowerCase() === 'charging';
    const power      = this._float(c.power_entity, 0);
    const kwh        = (batt * c.kwh_capacity / 100).toFixed(1);
    const maxBatt    = this._float(c.max_target_entity, 100);
    const surplus    = this._float(c.surplus_entity, 0);
    const minSurplus = this._float(c.surplus_min_entity, 0);
    const hasSurplus = surplus >= minSurplus;
    const isHC       = this._state(c.price_entity, '') === c.hc_state_value;
    const smartOn    = this._state(c.smart_charging_entity) === 'on';
    const solarOn    = this._state(c.solar_charging_entity) === 'on';
    const chargeOn   = this._state(c._chargeSwitch) === 'on';

    // ── Infos latérales ───────────────────────────────────
    const _sideSlot = (entityId, label) => {
      if (!entityId) return null;
      const st = this._hass?.states?.[entityId];
      if (!st) return null;
      const unit = st.attributes?.unit_of_measurement || '';
      return { label: label || st.attributes?.friendly_name || entityId, value: st.state, unit };
    };
    const slotL1 = _sideSlot(c.side_l1_entity, c.side_l1_label);
    const slotL2 = _sideSlot(c.side_l2_entity, c.side_l2_label);
    const slotR1 = _sideSlot(c.side_r1_entity, c.side_r1_label);
    const slotR2 = _sideSlot(c.side_r2_entity, c.side_r2_label);

    if (c.smooth_transitions && this._prevBatt !== null && this._prevBatt !== batt) {
      this._animateBatt(this._prevBatt, batt);
    }
    this._prevBatt = batt;

    if (this._btnsRendered) {
      this._updateButtons();
      if (this._lastBatt === batt && this._lastCharging === isCharging
        && this._lastSurplus === surplus && this._lastIsHC === isHC) {
        return;
      }
    }
    this._lastBatt     = batt;
    this._lastCharging = isCharging;
    this._lastSurplus  = surplus;
    this._lastIsHC     = isHC;

    let timeLeft = '';
    if (c.time_left_entity) {
      const tlState = this._hass?.states?.[c.time_left_entity]?.state;
      if (tlState && tlState !== 'unknown' && tlState !== 'unavailable') {
        const mins = Math.round(parseFloat(tlState));
        if (!isNaN(mins) && mins >= 0) {
          const hh = Math.floor(mins / 60), mm = String(mins % 60).padStart(2, '0');
          timeLeft = hh > 0 ? `${hh}h${mm}` : `${mm}m`;
        } else {
          timeLeft = tlState;
        }
      }
    } else if (isCharging && power > 0) {
      const h = ((maxBatt - batt) * c.kwh_capacity / 100) / (power / 1000);
      const hh = Math.floor(h), mm = String(Math.round((h - hh) * 60)).padStart(2, '0');
      timeLeft = hh > 0 ? `${hh}h${mm}` : `${mm}m`;
    }

    let mode = '';
    if (isCharging) {
      if (solarOn && hasSurplus) mode = '&#9728; SOLAR';
      else if (smartOn && isHC)  mode = '&#9889; AUTO HC';
      else                        mode = '&#128268; MANUEL';
    }

    const C = {
      primary:    this._col(c.color_primary,     '--primary-color',      '#00E8FF'),
      accent:     this._col(c.color_accent,      '--state-active-color', '#FF50A0'),
      chargeOff:  this._col(c.color_charge_off,  '--primary-color',      '#00E8FF'),
      chargeOn:   this._col(c.color_charge_on,   '--state-active-color', '#FF0090'),
      fillTop:    this._col(c.color_fill_top,    '--primary-color',      '#00E8FF'),
      fillMid:    this._col(c.color_fill_mid,    '--state-active-color', '#FF50A0'),
      fillBottom: this._col(c.color_fill_bottom, '--accent-color',       '#E946FF'),
      percent:    this._col(c.color_percent,     '--primary-color',      '#00E8FF'),
      sideVal:    this._col(c.color_side_val,    '--primary-color',      '#00E8FF'),
      battBorder: this._col(c.color_batt_border, '--primary-color',      '#00E8FF'),
    };

    const hcColor   = isHC ? `var(--primary-color, #00E8FF)` : `var(--state-active-color, #FF0090)`;
    const surpColor = hasSurplus ? C.primary : 'var(--secondary-text-color, #5A6A78)';

    const svg = buildSVG(batt, isCharging, C, c.show_ticks, c.font_size_percent, c.font_size_ticks, C.percent);

    const hasCharge = !!c._chargeSwitch;
    const btnHTML = hasCharge ? `
      <div class="btn-row">
        <button class="btn charge-btn ${chargeOn ? 'btn-on charge-on' : 'btn-off charge-off'}"
          data-btn="charge" data-on="${chargeOn ? '1' : '0'}"
          data-label="${chargeOn ? 'STOP CHARGE' : 'START CHARGE'}"
          aria-label="${chargeOn ? 'Arrêter la charge' : 'Démarrer la charge'}"
          aria-pressed="${chargeOn}">
          <span class="btn-icon">${chargeOn ? '⏹' : '▶'}</span>
          <span class="btn-label">${chargeOn ? 'STOP CHARGE' : 'START CHARGE'}</span>
        </button>
      </div>` : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --nbc-primary:      ${C.primary};
          --nbc-accent:       ${C.accent};
          --nbc-charge-off:   ${C.chargeOff};
          --nbc-charge-on:    ${C.chargeOn};
          --nbc-hc-color:     ${hcColor};
          --nbc-side-val:     ${C.sideVal};
          --nbc-batt-border:  ${C.battBorder};
          --nbc-font:       var(--primary-font-family, Rajdhani, 'Share Tech Mono', monospace);
          --nbc-radius:     var(--ha-card-border-radius, 14px);
          --nbc-bg:         var(--card-background-color, #0A0A14);
          --nbc-text-dim:   var(--secondary-text-color, #5A6A78);
          --nbc-accent-col: var(--accent-color, #B041FF);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes cardPulse {
          0%,100% { box-shadow: 0 0 28px rgba(0,232,255,.28), inset 0 0 18px rgba(0,232,255,.05); }
          50%      { box-shadow: 0 0 52px rgba(0,232,255,.55), inset 0 0 28px rgba(0,232,255,.10); }
        }
        @keyframes scanline {
          0%  { top: 0%;   opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100%{ top: 100%; opacity: 0; }
        }
        @keyframes sweep {
          0%   { left: -70%; }
          100% { left: 120%; }
        }
        @keyframes dotRise {
          0%   { opacity: 0; transform: translateY(0);     }
          30%  { opacity: 1; }
          80%  { opacity: .8; }
          100% { opacity: 0; transform: translateY(-16px); }
        }
        @keyframes btnPulseOn {
          0%,100% { box-shadow: 0 0 12px var(--nbc-primary); }
          50%      { box-shadow: 0 0 24px var(--nbc-primary), 0 0 40px var(--nbc-primary); }
        }
        @keyframes btnPulseCharge {
          0%,100% { box-shadow: 0 0 14px color-mix(in srgb, var(--nbc-charge-on) 50%, transparent); transform: scale(1); }
          50%      { box-shadow: 0 0 30px color-mix(in srgb, var(--nbc-charge-on) 80%, transparent); transform: scale(1.015); }
        }
        /* Glitch électrique au hover */
        @keyframes glitchShift {
          0%        { clip-path: inset(0 0 98% 0); transform: translateX(0); }
          10%       { clip-path: inset(12% 0 72% 0); transform: translateX(-4px); }
          20%       { clip-path: inset(48% 0 38% 0); transform: translateX(4px); }
          30%       { clip-path: inset(80% 0 5% 0); transform: translateX(-3px); }
          40%       { clip-path: inset(30% 0 55% 0); transform: translateX(3px); }
          50%       { clip-path: inset(65% 0 20% 0); transform: translateX(-2px); }
          60%       { clip-path: inset(10% 0 80% 0); transform: translateX(2px); }
          70%       { clip-path: inset(55% 0 30% 0); transform: translateX(-4px); }
          80%       { clip-path: inset(25% 0 60% 0); transform: translateX(3px); }
          90%       { clip-path: inset(75% 0 15% 0); transform: translateX(-2px); }
          100%      { clip-path: inset(0 0 98% 0); transform: translateX(0); }
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

        /* ── Effet glitch RGB + flicker — calqué sur .menu .title du thème ── */
        @keyframes pctGlitchRgb {
          0%,  9%   { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent),  1px 0 color-mix(in srgb, var(--nbc-primary) 50%, transparent); letter-spacing: 2px; }
          10%        { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent), -5px 0 var(--nbc-accent), 5px 0 var(--nbc-primary); letter-spacing: 3px; transform: skewX(-2deg); }
          11%        { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent),  1px 0 color-mix(in srgb, var(--nbc-primary) 50%, transparent); letter-spacing: 2px; transform: skewX(0); }
          12%,  39%  { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent),  1px 0 color-mix(in srgb, var(--nbc-primary) 50%, transparent); letter-spacing: 2px; }
          40%        { text-shadow: 0 0 8px #fff, 0 0 18px var(--nbc-accent), 0 0 48px var(--nbc-accent),  8px 0 var(--nbc-accent), -8px 0 var(--nbc-primary); letter-spacing: 5px; transform: skewX(3deg); }
          41%        { text-shadow: 0 0 2px #fff, 0 0  6px var(--nbc-accent), 0 0 14px var(--nbc-accent), -2px 0 color-mix(in srgb, var(--nbc-primary) 70%, transparent); letter-spacing: 1px; transform: skewX(-1deg); }
          42%,  71%  { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent),  1px 0 color-mix(in srgb, var(--nbc-primary) 50%, transparent); letter-spacing: 2px; transform: skewX(0); }
          72%        { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent), -4px 0 var(--nbc-accent), 4px 0 var(--nbc-primary); letter-spacing: 2px; }
          73%,  100% { text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent),  1px 0 color-mix(in srgb, var(--nbc-primary) 50%, transparent); letter-spacing: 2px; }
        }
        @keyframes pctFlicker {
          0%,  14%  { opacity: 1;    filter: brightness(1.1) saturate(1.4); }
          15%        { opacity: 0.4;  filter: brightness(0.5) saturate(0.8); }
          16%        { opacity: 1;    filter: brightness(1.5) saturate(1.6); }
          17%,  44%  { opacity: 1;    filter: brightness(1.1) saturate(1.4); }
          45%        { opacity: 0.7;  filter: brightness(0.7) saturate(0.9); }
          46%        { opacity: 1;    filter: brightness(1.4) saturate(1.5); }
          47%        { opacity: 0.85; filter: brightness(0.9) saturate(1.2); }
          48%,  79%  { opacity: 1;    filter: brightness(1.1) saturate(1.4); }
          80%        { opacity: 0.15; filter: brightness(0.2) saturate(0.5); }
          81%        { opacity: 1;    filter: brightness(1.7) saturate(1.8); }
          82%,  100% { opacity: 1;    filter: brightness(1.1) saturate(1.4); }
        }
        .pct-glitch {
          animation: pctGlitchRgb 11s step-end infinite, pctFlicker 7s step-end infinite;
          text-shadow: 0 0 5px #fff, 0 0 12px var(--nbc-accent), 0 0 28px var(--nbc-accent);
        }

        .card {
          padding: 16px 14px 14px;
        }

        .scanline {
          display: ${isCharging ? 'block' : 'none'};
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--nbc-primary), transparent);
          box-shadow: 0 0 10px var(--nbc-primary);
          animation: scanline 4s ease-in-out infinite;
          pointer-events: none; z-index: 10;
        }
        .sweep {
          display: ${isCharging ? 'block' : 'none'};
          position: absolute; top: 0; bottom: 0; width: 65%;
          background: linear-gradient(90deg, transparent, rgba(0,232,255,.05), transparent);
          animation: sweep 5s ease-in-out infinite;
          pointer-events: none; z-index: 1;
        }

        .car-name {
          display: ${c.name ? 'block' : 'none'};
          color: var(--nbc-primary); font-size: 11px; font-weight: 700;
          letter-spacing: 3.5px; text-transform: uppercase;
          text-shadow: 0 0 10px var(--nbc-primary);
          text-align: center; margin-bottom: 10px; opacity: .8;
        }

        /* ── TOKEN pill : une seule source de vérité ── */
        .pill, .surplus, .side-slot, .kwh-pill, .power-badge, .time-val, .mode-inner {
          display: flex; align-items: center;
          border-radius: 8px; box-sizing: border-box;
          padding: 5px 10px;
          border: 1px solid rgba(0,232,255,.25);
          background: rgba(0,232,255,.07);
          font-size: 13px; font-weight: 700;
        }

        .top-row {
          display: flex;
          justify-content: ${c.price_entity || c.surplus_entity ? 'space-between' : 'center'};
          align-items: center; margin-bottom: 12px; gap: 8px;
        }
        .pill {
          display: ${c.price_entity ? 'flex' : 'none'};
          gap: 6px;
          border-color: ${isHC ? 'rgba(0,232,255,.35)' : 'rgba(255,0,144,.35)'};
          background:   ${isHC ? 'rgba(0,232,255,.09)' : 'rgba(255,0,144,.09)'};
        }
        .pill-label {
          color: var(--nbc-hc-color); letter-spacing: 2px;
          text-shadow: 0 0 10px var(--nbc-hc-color);
        }
        .surplus {
          display: ${c.surplus_entity ? 'flex' : 'none'};
          gap: 5px;
          border-color: ${hasSurplus ? 'rgba(0,232,255,.35)' : 'rgba(255,255,255,.15)'};
          background:   ${hasSurplus ? 'rgba(0,232,255,.09)' : 'rgba(255,255,255,.04)'};
        }
        .surplus-val {
          color: ${surpColor};
          text-shadow: ${hasSurplus ? `0 0 8px ${C.primary}` : 'none'};
        }

        .battery-wrap {
          display: flex; justify-content: center;
          position: relative; margin-bottom: 10px;
        }
        .battery-outer {
          display: flex; align-items: center; justify-content: space-between;
          position: relative; margin-bottom: 10px;
        }
        .side-col {
          display: flex; flex-direction: column; gap: 7px;
          flex: 1; min-width: 0; padding: 0 6px;
          align-items: flex-start;
        }
        .side-col.side-right { align-items: flex-end; }
        .side-slot {
          flex-direction: column; gap: 2px;
          max-width: 100%;
        }
        .side-col.side-right .side-slot { align-items: flex-end; text-align: right; }
        .side-slot-lbl {
          font-size: 9px; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(0,232,255,.5);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .side-slot-row {
          display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap;
        }
        .side-col.side-right .side-slot-row { justify-content: flex-end; }
        .side-slot-val {
          font-size: 14px; color: var(--nbc-side-val); line-height: 1.1;
        }
        .side-slot-unit { font-size: 10px; color: rgba(255,255,255,.4); font-weight: 400; }
        .dots {
          display: ${isCharging ? 'flex' : 'none'};
          position: absolute; bottom: 0;
          left: 50%; transform: translateX(-50%); gap: 6px;
        }
        .dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--nbc-primary); box-shadow: 0 0 8px var(--nbc-primary); opacity: 0;
        }
        .dot:nth-child(1) { animation: dotRise 1.5s ease-in-out 0.0s infinite; }
        .dot:nth-child(2) { animation: dotRise 1.5s ease-in-out 0.5s infinite; }
        .dot:nth-child(3) { animation: dotRise 1.5s ease-in-out 1.0s infinite; }

        .info-bar {
          display: flex; align-items: center;
          justify-content: center; gap: 8px; flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .kwh-pill {
          display: ${c.show_kwh ? 'flex' : 'none'};
          gap: 5px;
          border-color: rgba(0,232,255,.25);
          background: rgba(0,232,255,.07);
          color: #00E8FF;
        }
        .power-badge {
          display: ${isCharging ? 'flex' : 'none'};
          gap: 4px;
          font-size: 13px;
          color: var(--nbc-primary);
        }
        .time-val {
          display: ${isCharging && timeLeft ? 'flex' : 'none'};
          gap: 4px;
          color: var(--nbc-primary);
        }
        .mode-wrap {
          display: ${isCharging ? 'flex' : 'none'};
          justify-content: center; margin-bottom: 10px;
        }
        .mode-inner {
          gap: 6px; letter-spacing: 2.5px;
          background: rgba(0,232,255,.07);
          color: var(--nbc-primary); text-shadow: 0 0 8px var(--nbc-primary);
        }

        .btn-row { display: flex; gap: 8px; }
        .btn {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          padding: 12px 6px; border-radius: 12px; border: none;
          cursor: pointer; font-family: var(--nbc-font);
          transition: all .25s ease; position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-icon  { font-size: 18px; line-height: 1; }
        .btn-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

        .btn-off {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          color: var(--nbc-text-dim);
        }
        .btn-off:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(0,232,255,.3);
          color: var(--nbc-primary);
        }
        .btn-on {
          background: linear-gradient(135deg, rgba(0,232,255,.18), rgba(0,232,255,.06));
          border: 2px solid rgba(0,232,255,.75);
          color: var(--nbc-primary);
          text-shadow: 0 0 8px var(--nbc-primary);
          box-shadow: 0 0 18px rgba(0,232,255,.35), inset 0 0 10px rgba(0,232,255,.06);
          animation: btnPulseOn 3s ease-in-out infinite;
        }
        .btn:active { transform: scale(.96); }

        .charge-btn.charge-off {
          background: linear-gradient(135deg, color-mix(in srgb, var(--nbc-charge-off) 14%, transparent), color-mix(in srgb, var(--nbc-charge-off) 4%, transparent));
          border: 2px solid color-mix(in srgb, var(--nbc-charge-off) 60%, transparent);
          color: var(--nbc-charge-off);
          text-shadow: 0 0 8px var(--nbc-charge-off);
          box-shadow: 0 0 16px color-mix(in srgb, var(--nbc-charge-off) 25%, transparent);
        }
        .charge-btn.charge-on {
          background: linear-gradient(135deg, color-mix(in srgb, var(--nbc-charge-on) 20%, transparent), color-mix(in srgb, var(--nbc-charge-on) 10%, transparent));
          border: 2px solid color-mix(in srgb, var(--nbc-charge-on) 80%, transparent);
          color: var(--nbc-charge-on);
          text-shadow: 0 0 8px var(--nbc-charge-on);
          box-shadow: 0 0 22px color-mix(in srgb, var(--nbc-charge-on) 40%, transparent), inset 0 0 12px color-mix(in srgb, var(--nbc-charge-on) 6%, transparent);
          animation: btnPulseCharge 2.5s ease-in-out infinite;
        }

        /* Glitch électrique — pseudo-éléments pour les artefacts */
        .charge-btn { isolation: isolate; }

        .charge-btn::before,
        .charge-btn::after {
          content: attr(data-label);
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; pointer-events: none;
          opacity: 0;
        }
        .charge-btn::before {
          color: var(--nbc-charge-off);
          text-shadow: 2px 0 var(--nbc-charge-on), -2px 0 var(--nbc-charge-off);
        }
        .charge-btn::after {
          color: var(--nbc-charge-on);
          text-shadow: -2px 0 var(--nbc-charge-off), 2px 0 var(--nbc-charge-on);
        }

        .charge-btn:hover {
          transform: scale(1.02);
          filter: brightness(1.15);
        }
        .charge-btn:hover::before {
          animation: glitchShift .4s steps(1) infinite, glitchColor .4s steps(1) infinite;
        }
        .charge-btn:hover::after {
          animation: glitchShift .4s steps(1) .13s infinite, glitchColor .4s steps(1) .2s infinite;
          mix-blend-mode: screen;
        }
        /* Éclair SVG inline au hover via le span icon */
        .charge-btn:hover .btn-icon {
          animation: spark .25s ease-out infinite alternate;
          filter: drop-shadow(0 0 6px currentColor);
        }

        .card:focus-visible, .btn:focus-visible {
          outline: 2px solid var(--nbc-primary);
          outline-offset: 2px;
        }
      </style>

      <ha-card>
        <div class="card"
          role="${c.tap_action !== 'none' ? 'button' : 'region'}"
          tabindex="${c.tap_action !== 'none' ? '0' : '-1'}"
          aria-label="${c.name || 'Batterie'} : ${batt}%">

          <div class="scanline"></div>
          <div class="sweep"></div>

          <div class="car-name">${c.name || ''}</div>

          <div class="top-row">
            <div class="pill">
              <span>${isHC ? '🌙' : '☀️'}</span>
              <span class="pill-label">${isHC ? c.hc_label_on : c.hc_label_off}</span>
            </div>
            <div class="surplus">
              <span>☀️</span>
              <span class="surplus-val">${surplus}W</span>
            </div>
          </div>

          <div class="battery-outer">
            <div class="side-col">
              ${[slotL1, slotL2].map(s => s ? `
                <div class="side-slot">
                  <div class="side-slot-lbl">${s.label}</div>
                  <div class="side-slot-row">
                    <span class="side-slot-val">${s.value}</span>
                    ${s.unit ? `<span class="side-slot-unit">${s.unit}</span>` : ''}
                  </div>
                </div>` : '').join('')}
            </div>
            <div class="battery-wrap">
              ${svg}
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <div class="side-col side-right">
              ${[slotR1, slotR2].map(s => s ? `
                <div class="side-slot">
                  <div class="side-slot-lbl">${s.label}</div>
                  <div class="side-slot-row">
                    <span class="side-slot-val">${s.value}</span>
                    ${s.unit ? `<span class="side-slot-unit">${s.unit}</span>` : ''}
                  </div>
                </div>` : '').join('')}
            </div>
          </div>

          <div class="info-bar">
            <div class="kwh-pill"><span>&#128267;</span><span class="kwh-val">${Math.round(kwh)} / ${c.kwh_capacity} kWh</span></div>
            <div class="power-badge"><span>&#9889;</span><span class="power-val">${power}W</span></div>
            <div class="time-val"><span>&#8987;</span><span>${timeLeft}</span></div>
          </div>

          <div class="mode-wrap">
            <div class="mode-inner">${mode}</div>
          </div>

          ${btnHTML}
        </div>
      </ha-card>
    `;

    this._btnsRendered = true;

    if (hasCharge) {
      this.shadowRoot.querySelector('[data-btn="charge"]')?.addEventListener('click', e => {
        e.stopPropagation();
        const isOn = this._state(c._chargeSwitch) === 'on';
        const msg  = isOn
          ? '⚠️ Arrêter la charge manuellement ?'
          : '⚡ Démarrer la charge manuellement ?';
        const ev = new CustomEvent('ha-confirm', {
          detail: { text: msg, confirm: () => this._toggle(c._chargeSwitch) },
          bubbles: true, composed: true,
        });
        this.dispatchEvent(ev);
        setTimeout(() => {
          if (window.confirm(msg)) this._toggle(c._chargeSwitch);
        }, 0);
      });
    }

    if (c.tap_action !== 'none') {
      const card = this.shadowRoot.querySelector('.card');
      card?.addEventListener('click', () => this._moreInfo(c.entity));
      card?.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._moreInfo(c.entity);
        }
      });
    }

    const card = this.shadowRoot.querySelector('.card');
    if (card) {
      card.setAttribute('aria-valuemin', '0');
      card.setAttribute('aria-valuemax', '100');
      card.setAttribute('aria-valuenow', batt);
      card.setAttribute('aria-valuetext', `${batt}% - ${kwh} kWh`);
    }
  }
}

customElements.define('neon-battery-card', NeonBatteryCard);

// ── Banner console ────────────────────────────────────────────
console.info(
  '%c NEON-BATTERY-CARD %c v' + VERSION + ' ',
  'color:#00E8FF;font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:3px 0 0 3px',
  'color:var(--nbc-accent);font-weight:bold;background:#0A0A14;padding:2px 6px;border-radius:0 3px 3px 0',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'neon-battery-card',
  name:             'Neon Battery Card',
  description:      'Batterie EV néon cyberpunk avec boutons intégrés pour Home Assistant',
  preview:          true,
  documentationURL: 'https://github.com/',
});

console.info(
  '%c 🔋 neon-battery-card v3 %c Neo Tokyo ',
  'background:#E0115F;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FF6B9D;padding:2px 4px;border-radius:0 3px 3px 0;'
);
