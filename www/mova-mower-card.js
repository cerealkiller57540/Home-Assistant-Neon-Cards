/* mova-mower-card mower-only v1.0.0 */
(function () {
  const CARD_CSS = `
:host{--mw-radius-card:var(--ha-card-border-radius,14px);--mw-radius-control:var(--ha-card-border-radius,5px);--mw-radius-tile:8px;--mw-radius-bar:var(--ha-card-border-radius,3px);display:block;contain:layout style;color-scheme:dark;-webkit-font-smoothing:antialiased}
ha-card{overflow:hidden;position:relative;border-radius:var(--mw-radius-card);border:1px solid rgba(var(--mw-accent),.62);box-shadow:0 0 0 1px rgba(var(--mw-mode),.12) inset,0 14px 42px rgba(0,0,0,.58),0 0 28px rgba(var(--mw-accent),.16);backdrop-filter:blur(8px)}
.mw-inner{position:relative;z-index:1}
.mw-header{display:flex;align-items:center;gap:9px;padding:15px 16px 11px;font-family:var(--mw-font,"Rajdhani",Orbitron),var(--primary-font-family,sans-serif)}
.mw-header-icon{display:flex;align-items:center;color:#fff;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 4px rgb(var(--mw-mode))) drop-shadow(0 0 10px rgb(var(--mw-mode))) drop-shadow(0 0 20px rgb(var(--mw-accent)))}
.mw-header-icon ha-icon{--mdc-icon-size:var(--mw-title-size,16px)}
.mw-header-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:3px;color:#fff;font-size:var(--mw-title-size,16px);line-height:1.2;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 1px #fff,0 0 4px #fff,0 0 9px rgb(var(--mw-mode)),0 0 17px rgb(var(--mw-mode)),0 0 29px rgb(var(--mw-accent))}
.mw-divider{height:2px;margin:0 16px;background:linear-gradient(90deg,transparent,#fff 12%,rgb(var(--mw-mode)) 38%,rgb(var(--mw-accent)) 72%,transparent);box-shadow:0 0 1px #fff,0 0 5px rgb(var(--mw-mode)),0 0 12px rgb(var(--mw-mode)),0 0 22px rgb(var(--mw-accent))}
.mw-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:9px 14px 0}
.mw-stat{--mw-stat-glow:var(--mw-mode);display:flex;align-items:center;gap:7px;min-width:0;padding:8px 10px;background:linear-gradient(110deg,rgba(255,255,255,.075),rgba(255,255,255,.018));border:1px solid rgba(var(--mw-mode),.28);border-radius:var(--mw-radius-tile);box-shadow:0 0 1px rgba(var(--mw-stat-glow),.8),0 0 6px rgba(var(--mw-stat-glow),.58),0 0 16px rgba(var(--mw-stat-glow),.3),0 4px 12px rgba(0,0,0,.2)}
.mw-stat-label{overflow:hidden;color:rgba(232,233,240,.62);font:600 9px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1.2px;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}
.mw-stat-value{margin-left:auto;color:rgb(var(--mw-stat-glow));font:700 12px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:.5px;white-space:nowrap;text-shadow:0 0 1px rgba(255,255,255,.5),0 0 6px rgb(var(--mw-stat-glow)),0 0 13px rgb(var(--mw-stat-glow))}
.mw-stat ha-icon{--mdc-icon-size:16px;flex:none;color:rgb(var(--mw-stat-glow));filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 5px rgb(var(--mw-stat-glow))) drop-shadow(0 0 12px rgb(var(--mw-stat-glow)))}
.mw-stat-charging{--mw-stat-glow:var(--mw-pause);border-color:rgba(var(--mw-pause),.5);animation:mw-charge-pulse 2.8s ease-in-out infinite}
.mw-stat-charging ha-icon{color:rgb(var(--mw-pause))}
.mw-pause{grid-column:1/-1;width:100%;cursor:pointer;font:inherit;text-align:left}
.mw-pause-ok{--mw-stat-glow:var(--mw-start);border-color:rgba(var(--mw-start),.35)}
.mw-pause-ok ha-icon{color:rgb(var(--mw-start))}
.mw-pause-on{--mw-stat-glow:var(--mw-danger);border-color:rgba(var(--mw-danger),.55);animation:mw-pulse 2s ease-in-out infinite}
.mw-pause-on ha-icon,.mw-pause-on .mw-stat-value{color:rgb(var(--mw-danger))}
.mw-switch{width:44px;height:22px;margin-left:auto;border:1px solid;border-radius:20px;position:relative;flex:none}
.mw-pause-ok .mw-switch{background:rgba(var(--mw-start),.18);border-color:rgba(var(--mw-start),.5)}
.mw-pause-on .mw-switch{background:rgba(var(--mw-danger),.18);border-color:rgba(var(--mw-danger),.5)}
.mw-switch-knob{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:currentColor;box-shadow:0 1px 3px #0008;transition:left .2s}
.mw-pause-ok .mw-switch-knob{left:24px;color:rgb(var(--mw-start))}
.mw-pause-on .mw-switch-knob{left:2px;color:rgb(var(--mw-danger))}
.mw-map{position:relative;min-height:90px;margin:10px 0 0;overflow:hidden;background:rgba(0,0,0,.38);border-block:1px solid rgba(var(--mw-mode),.22);box-shadow:0 0 24px rgba(var(--mw-mode),.08) inset}
.mw-map img{display:block;width:100%;height:auto;min-height:90px;object-fit:contain;filter:saturate(1.12) contrast(1.04)}
.mw-map-placeholder{display:grid;min-height:90px;place-items:center;padding:24px 12px;color:rgba(232,233,240,.5);font:11px var(--primary-font-family,sans-serif);text-align:center}
.mw-map-placeholder small{display:block;margin-top:5px;color:rgba(232,233,240,.35)}
.mw-block{padding:11px 16px}
.mw-block+.mw-block{border-top:1px solid rgba(var(--mw-accent),.14)}
.mw-hero{margin-bottom:12px}
.mw-hero-top{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}
.mw-hero-label,.mw-label{color:rgba(var(--mw-mode),.8);font:500 10px Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1.5px;text-transform:uppercase}
.mw-hero-pct{color:#fff;font:700 24px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1px;text-shadow:0 0 1px #fff,0 0 5px #fff,0 0 10px rgb(var(--mw-mode)),0 0 19px rgb(var(--mw-mode)),0 0 31px rgb(var(--mw-accent))}
.mw-bar{position:relative;height:10px;overflow:hidden;border-radius:var(--mw-radius-bar);background:rgba(0,0,0,.55);box-shadow:inset 0 2px 4px #000b,0 0 0 1px rgba(var(--mw-accent),.25)}
.mw-bar-fill{display:block;box-sizing:border-box;min-width:0;max-width:100%;height:100%;border-radius:5px;background:linear-gradient(90deg,rgb(var(--mw-mode)),#fff 48%,rgb(var(--mw-mode)) 62%,rgb(var(--mw-accent)));background-size:250% 100%;box-shadow:0 0 1px #fff,0 0 5px #fff,0 0 8px rgb(var(--mw-mode)),0 0 14px rgb(var(--mw-mode)),0 0 20px rgb(var(--mw-accent));transition:width .5s ease}
.mw-bar-fill-active{animation:none}
.mw-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.mw-action{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border:1px solid;border-radius:var(--mw-radius-tile);background:linear-gradient(145deg,rgba(20,24,40,.78),rgba(8,10,22,.72));box-shadow:0 0 1px #fff,0 0 5px currentColor,0 0 12px currentColor,0 0 22px currentColor;cursor:pointer;font:700 10px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1px;text-transform:uppercase;transition:transform .15s,background .15s,box-shadow .15s}
.mw-action:hover{box-shadow:0 0 1px #fff,0 0 6px currentColor,0 0 15px currentColor,0 0 30px currentColor}
.mw-action:active{transform:scale(.96)}
.mw-action ha-icon{--mdc-icon-size:20px;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 5px currentColor) drop-shadow(0 0 12px currentColor)}
.mw-start{color:rgb(var(--mw-start));border-color:rgba(var(--mw-start),.45)}.mw-start:hover{background:rgba(var(--mw-start),.1)}
.mw-pause-action{color:rgb(var(--mw-pause));border-color:rgba(var(--mw-pause),.45)}.mw-pause-action:hover{background:rgba(var(--mw-pause),.1)}
.mw-dock{color:rgb(var(--mw-accent));border-color:rgba(var(--mw-accent),.45)}.mw-dock:hover{background:rgba(var(--mw-accent),.1)}
.mw-label{display:block;margin-bottom:10px;color:rgba(var(--mw-accent),.75)}
.mw-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(82px,1fr));gap:8px;margin-bottom:12px}
.mw-option{display:flex;flex-direction:column;align-items:center;gap:6px;padding:11px 5px;border:1px solid rgba(var(--mw-mode),.28);border-radius:var(--mw-radius-tile);background:rgba(20,24,40,.66);color:rgba(232,233,240,.8);cursor:pointer;font:600 10px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:.7px;text-transform:uppercase;transition:border-color .15s,background .15s,transform .15s}
.mw-option:hover{transform:translateY(-1px);border-color:rgb(var(--mw-accent));background:rgba(var(--mw-accent),.14)}
.mw-option-active{border-color:#fff;background:rgba(var(--mw-mode),.18);color:#fff;box-shadow:0 0 1px #fff,0 0 5px #fff,0 0 12px rgb(var(--mw-mode)),0 0 24px rgb(var(--mw-accent));text-shadow:0 0 5px rgb(var(--mw-mode))}
.mw-option ha-icon{--mdc-icon-size:21px}
.mw-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}
.mw-select-wrap{display:flex;align-items:center;gap:7px;padding:8px 9px;border:1px solid rgba(var(--mw-accent),.38);border-radius:var(--mw-radius-control);background:rgba(0,0,0,.34)}
.mw-select-wrap ha-icon{--mdc-icon-size:16px;flex:none;color:rgba(var(--mw-accent),.75)}
.mw-select-wrap span{color:rgba(var(--mw-accent),.85);font:600 10px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1px;text-transform:uppercase}
.mw-select{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#e8e9f0;font:12px var(--primary-font-family,sans-serif)}
.mw-select option{background:#14182a;color:#e8e9f0}
.mw-off{opacity:.4;pointer-events:none}
.mw-empty{text-align:center;color:rgba(232,233,240,.45);font-size:11px}
.mw-maint-button{display:flex;align-items:center;gap:10px;width:100%;padding:12px 14px;border:1px solid rgba(var(--mw-accent),.42);border-radius:var(--mw-radius-control);background:linear-gradient(100deg,rgba(var(--mw-accent),.13),rgba(255,255,255,.025));color:rgba(232,233,240,.9);cursor:pointer;font:700 11px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:1.8px;text-align:left;text-transform:uppercase;transition:background .2s,box-shadow .2s}
.mw-maint-button:hover{background:linear-gradient(100deg,rgba(var(--mw-accent),.3),rgba(var(--mw-mode),.08));box-shadow:0 0 1px #fff,0 0 5px #fff,0 0 12px rgb(var(--mw-mode)),0 0 25px rgb(var(--mw-accent))}
.mw-maint-button>ha-icon:first-child{color:#fff;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 5px rgb(var(--mw-mode))) drop-shadow(0 0 13px rgb(var(--mw-accent)))}
.mw-maint-button ha-icon:last-child{margin-left:auto;transition:transform .2s}.mw-maint-button-open ha-icon:last-child{transform:rotate(180deg)}
.mw-maint-body{display:flex;flex-direction:column;gap:8px;margin-top:9px;padding:6px 4px}.mw-maint-body[hidden]{display:none}
.mw-maint-row{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--mw-radius-control);background:rgba(0,0,0,.3);border-left:2px solid rgba(var(--mw-mode),.42)}
.mw-maint-row ha-icon{--mdc-icon-size:16px;flex:none;color:rgba(var(--mw-accent),.75)}
.mw-maint-name{min-width:78px;color:rgba(232,233,240,.9);font:600 12px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:.5px}
.mw-maint-track{height:6px;flex:1;overflow:hidden;border-radius:var(--mw-radius-bar);background:#0008}.mw-maint-fill{height:100%;border-radius:var(--mw-radius-bar);transition:width .3s}.mw-good{background:linear-gradient(90deg,rgb(var(--mw-mode)),#fff 48%,rgb(var(--mw-mode)));box-shadow:0 0 1px #fff,0 0 5px #fff,0 0 12px rgb(var(--mw-mode)),0 0 22px rgb(var(--mw-mode))}.mw-warn{background:rgb(var(--mw-pause));box-shadow:0 0 1px #fff,0 0 5px rgb(var(--mw-pause)),0 0 13px rgb(var(--mw-pause))}.mw-danger{background:rgb(var(--mw-danger));box-shadow:0 0 1px #fff,0 0 5px rgb(var(--mw-danger)),0 0 13px rgb(var(--mw-danger))}
.mw-percent{min-width:38px;color:#fff;font:700 12px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);text-align:right}.mw-reset{display:grid;width:28px;height:28px;place-items:center;border:1px solid rgba(var(--mw-mode),.42);border-radius:var(--mw-radius-control);background:rgba(var(--mw-mode),.1);color:rgb(var(--mw-mode));cursor:pointer;transition:box-shadow .15s,transform .15s}.mw-reset:hover{box-shadow:0 0 12px rgba(var(--mw-mode),.55);transform:rotate(-12deg)}.mw-reset ha-icon{--mdc-icon-size:14px}
.mw-footer{display:flex;flex-wrap:wrap;gap:12px;padding:7px 6px 2px;color:rgba(232,233,240,.52);font:600 10px "Rajdhani",Orbitron,var(--primary-font-family,sans-serif);letter-spacing:.6px}.mw-footer span{display:inline-flex;align-items:center;gap:4px}.mw-footer ha-icon{--mdc-icon-size:12px;color:rgba(var(--mw-accent),.8)}
@keyframes mw-pulse{0%,100%{box-shadow:0 0 0 rgba(var(--mw-danger),0)}50%{box-shadow:0 0 13px rgba(var(--mw-danger),.25)}}@keyframes mw-charge-pulse{0%,100%{box-shadow:0 0 1px rgba(var(--mw-stat-glow),.8),0 0 6px rgba(var(--mw-stat-glow),.58),0 0 16px rgba(var(--mw-stat-glow),.3),0 4px 12px rgba(0,0,0,.2)}50%{box-shadow:0 0 1px rgba(var(--mw-stat-glow),.9),0 0 9px rgba(var(--mw-stat-glow),.72),0 0 21px rgba(var(--mw-stat-glow),.4),0 4px 12px rgba(0,0,0,.2)}}
@media (prefers-reduced-motion:reduce){.mw-bar-fill-active,.mw-pause-on,.mw-stat-charging{animation:none}.mw-bar-fill{transition:none}}
`;

  const DEFAULTS = {
    sensors: {
      battery: "sensor.{slug}_batterie", status: "sensor.{slug}_statut", charging: "sensor.{slug}_charging_status",
      bluetooth: "sensor.{slug}_bluetooth", device_code: "sensor.{slug}_code_de_peripherique",
      progress: "sensor.{slug}_progression_de_la_tonte", blades: "sensor.{slug}_etat_des_lames",
      brush: "sensor.{slug}_etat_de_la_brosse", maintenance: "sensor.{slug}_etat_de_maintenance"
    },
    selects: { mowing_action: "select.{slug}_mowing_action", edge: "select.{slug}_edge", map: "select.{slug}_map", zone: "select.{slug}_zone", spot: "select.{slug}_spot" },
    buttons: {
      reset_blades: "button.{slug}_reinitialiser_le_compteur_des_lames", reset_brush: "button.{slug}_reinitialiser_le_compteur_de_brosse",
      reset_maintenance: "button.{slug}_reinitialiser_le_compteur_de_maintenance"
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }
  function icon(name, size) {
    const el = document.createElement("ha-icon");
    el.setAttribute("icon", name);
    if (size) el.style.setProperty("--mdc-icon-size", `${size}px`);
    return el;
  }
  function stateOf(hass, entityId, fallback = "") {
    return hass?.states?.[entityId]?.state ?? fallback;
  }
  function attrOf(hass, entityId, name, fallback) {
    return hass?.states?.[entityId]?.attributes?.[name] ?? fallback;
  }
  function slugOf(entityId) {
    return entityId.split(".")[1] || "mova";
  }
  function expand(template, slug) {
    return template.replace("{slug}", slug);
  }

  class MovaMowerCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._hass = null;
      this._config = null;
      this._built = false;
      this._maintOpen = false;
      this._mapTimer = null;
      this._mapInterval = 0;
      this._mapUrl = "";
      this._wireEvents();
    }

    static getStubConfig() {
      return { type: "custom:mova-mower-card", entity: "lawn_mower.mova_1000", header: { title: "Mova 1000", icon: "mdi:robot-mower" } };
    }
    static getConfigElement() { return document.createElement("mova-mower-card-editor"); }

    setConfig(config) {
      if (!config?.entity || !config.entity.startsWith("lawn_mower.")) throw new Error("entity must be a lawn_mower entity");
      const slug = config.slug || slugOf(config.entity);
      const makeDefaults = (group) => Object.fromEntries(Object.entries(DEFAULTS[group]).map(([key, value]) => [key, expand(value, slug)]));
      this._config = {
        ...clone(config), slug,
        header: { enabled: true, title: "Mova", icon: "mdi:robot-mower", ...clone(config.header) },
        sensors: { ...makeDefaults("sensors"), ...clone(config.sensors) },
        selects: { ...makeDefaults("selects"), ...clone(config.selects) },
        buttons: { ...makeDefaults("buttons"), ...clone(config.buttons) },
        map_entity: config.map_entity || config.camera || `camera.${slug}_carte`,
        pause_entity: config.pause_entity || "input_boolean.tondeuse_pause"
      };
      this._maintOpen = config.maintenance_open === true;
      if (this._hass) this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._config) return;
      if (!this._built) this._render();
      else this._update();
    }

    getCardSize() { return 8; }

    _wireEvents() {
      this.shadowRoot.addEventListener("click", (event) => {
        const button = event.composedPath().find((node) => node instanceof HTMLElement && node.matches("button[data-act]"));
        if (!button || !this._hass) return;
        const action = button.dataset.act;
        if (action === "maintenance") {
          this._maintOpen = !this._maintOpen;
          const body = this.shadowRoot.getElementById("mw-maint-body");
          button.classList.toggle("mw-maint-button-open", this._maintOpen);
          button.setAttribute("aria-expanded", String(this._maintOpen));
          if (body) body.hidden = !this._maintOpen;
          return;
        }
        if (action === "service") this._call("lawn_mower", button.dataset.service, { entity_id: this._config.entity });
        if (action === "toggle") this._call("input_boolean", "toggle", { entity_id: button.dataset.eid });
        if (action === "press") this._call("button", "press", { entity_id: button.dataset.eid });
        if (action === "select") this._call("select", "select_option", { entity_id: button.dataset.eid, option: button.dataset.value });
      });
      this.shadowRoot.addEventListener("change", (event) => {
        const target = event.target instanceof HTMLSelectElement ? event.target : null;
        if (target?.dataset.act === "select" && this._hass) this._call("select", "select_option", { entity_id: target.dataset.eid, option: target.value });
      });
    }

    async _call(domain, service, data) {
      try { await this._hass.callService(domain, service, data); }
      catch (error) { console.error(`mova-mower-card: ${domain}.${service} failed`, error); this._showToast("Commande impossible"); }
    }
    _showToast(message) {
      this.dispatchEvent(new CustomEvent("hass-notification", {
        detail: { message }, bubbles: true, composed: true
      }));
    }

    _render() {
      this._stopMapPolling();
      this.shadowRoot.replaceChildren();
      const style = document.createElement("style");
      style.textContent = CARD_CSS;
      this.shadowRoot.appendChild(style);
      const card = document.createElement("ha-card");
      card.innerHTML = `<div class="mw-inner"><div id="mw-header"></div><div class="mw-stats" id="mw-stats"></div><div class="mw-map" id="mw-map"></div><div class="mw-block" id="mw-status"></div><div class="mw-block" id="mw-controls"></div><div class="mw-block" id="mw-maint"></div></div>`;
      this.shadowRoot.appendChild(card);
      this._configureTheme();
      this._built = true;
      this._update();
    }

    _configureTheme() {
      const config = this._config;
      const header = config.header || {};
      const set = (name, value) => { if (value !== undefined && value !== null && value !== "") this.style.setProperty(name, String(value)); };
      set("--mw-title-color", header.color || "var(--primary-text-color,#fff)");
      set("--mw-title-size", header.title_size || "16px");
      set("--mw-font", header.font || "Orbitron");
      set("--mw-title-shadow", header.title_shadow || "0 0 8px currentColor");
      set("--mw-start", this._toRgb(config.color_start) || "0,255,204");
      set("--mw-pause", this._toRgb(config.color_pause) || "255,226,92");
      set("--mw-mode", this._toRgb(config.color_mode) || "0,229,255");
      set("--mw-accent", this._toRgb(config.color_accent) || "132,64,255");
      set("--mw-danger", "224,17,95");
    }

    _toRgb(value) {
      if (!value || typeof value !== "string") return null;
      const hex = value.trim().replace(/^#/, "");
      if (/^[0-9a-f]{6}$/i.test(hex)) return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");
      if (/^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(value.trim())) return value.trim();
      return null;
    }

    _update() {
      if (!this._built || !this._hass || !this._config) return;
      this._configureTheme();
      this._renderHeader();
      this._renderStats();
      this._renderMap();
      this._renderStatus();
      this._renderControls();
      this._renderMaintenance();
    }

    _renderHeader() {
      const container = this.shadowRoot.getElementById("mw-header");
      const header = this._config.header || {};
      container.replaceChildren();
      if (header.enabled === false) return;
      const row = document.createElement("div"); row.className = "mw-header";
      if (header.icon) { const iconWrap = document.createElement("span"); iconWrap.className = "mw-header-icon"; iconWrap.appendChild(icon(header.icon)); row.appendChild(iconWrap); }
      if (header.title) { const title = document.createElement("span"); title.className = "mw-header-title"; title.textContent = header.title; row.appendChild(title); }
      container.appendChild(row);
      const divider = document.createElement("div"); divider.className = "mw-divider"; container.appendChild(divider);
    }

    _renderStats() {
      const container = this.shadowRoot.getElementById("mw-stats");
      const c = this._config, battery = this._clamp(this._number(this._state(c.sensors.battery)), 0, 100);
      const charging = /charg/i.test(this._state(c.sensors.charging)) || this._state(c.sensors.charging) === "on";
      container.replaceChildren(this._stat(charging ? "Charge" : "Batterie", `${battery.toFixed(0)}%`, charging ? "mdi:battery-charging-80" : this._batteryIcon(battery), charging ? "mw-stat-charging" : ""));
      container.appendChild(this._stat("Etat", this._capitalize(this._state(c.sensors.status) || this._state(c.entity) || "-"), "mdi:radar", ""));
      const pause = c.pause_entity && this._exists(c.pause_entity);
      if (pause) {
        const paused = this._state(c.pause_entity) === "on";
        const button = document.createElement("button"); button.type = "button"; button.dataset.act = "toggle"; button.dataset.eid = c.pause_entity; button.className = `mw-stat mw-pause ${paused ? "mw-pause-on" : "mw-pause-ok"}`; button.setAttribute("aria-label", "Activer ou mettre en pause la tonte");
        button.append(document.createElement("span")); button.firstChild.className = "mw-stat-label"; button.firstChild.textContent = "Auto tonte";
        button.appendChild(icon(paused ? "mdi:pause-circle" : "mdi:robot-mower")); const value = document.createElement("span"); value.className = "mw-stat-value"; value.textContent = paused ? "EN PAUSE" : "ACTIVE"; button.appendChild(value);
        const sw = document.createElement("span"); sw.className = "mw-switch"; sw.setAttribute("aria-hidden", "true"); const knob = document.createElement("span"); knob.className = "mw-switch-knob"; sw.appendChild(knob); button.appendChild(sw); container.appendChild(button);
      }
    }

    _stat(label, value, iconName, extraClass) {
      const item = document.createElement("div"); item.className = `mw-stat ${extraClass}`; const labelEl = document.createElement("span"); labelEl.className = "mw-stat-label"; labelEl.textContent = label; item.appendChild(labelEl); item.appendChild(icon(iconName)); const valueEl = document.createElement("span"); valueEl.className = "mw-stat-value"; valueEl.textContent = value; item.appendChild(valueEl); return item;
    }

    _renderMap() {
      const container = this.shadowRoot.getElementById("mw-map");
      const mapEntity = this._mapEntity(); const picture = attrOf(this._hass, mapEntity, "entity_picture", "");
      if (!picture) { this._stopMapPolling(); this._mapUrl = ""; container.replaceChildren(this._mapPlaceholder(mapEntity)); return; }
      const url = typeof this._hass.hassUrl === "function" ? this._hass.hassUrl(picture) : picture;
      let image = container.querySelector("img");
      if (!image) { container.replaceChildren(); image = document.createElement("img"); image.alt = "Carte de la tondeuse"; container.appendChild(image); }
      if (url !== this._mapUrl) { this._mapUrl = url; image.src = url; }
      this._startMapPolling();
    }

    _mapPlaceholder(entityId) {
      const wrap = document.createElement("div"); wrap.className = "mw-map-placeholder"; const text = document.createElement("div"); text.textContent = "Carte indisponible"; const small = document.createElement("small"); small.textContent = `Recherche : ${entityId}`; text.appendChild(small); wrap.appendChild(text); return wrap;
    }
    _startMapPolling() {
      const moving = this._isMoving(); const interval = moving ? 3000 : 30000;
      if (this._mapTimer && this._mapInterval === interval) return;
      this._stopMapPolling(); this._mapInterval = interval; this._mapTimer = setInterval(() => this._refreshMap(), interval);
    }
    _stopMapPolling() { if (this._mapTimer) clearInterval(this._mapTimer); this._mapTimer = null; this._mapInterval = 0; }
    _refreshMap() { const image = this.shadowRoot.querySelector("#mw-map img"); if (image && this._mapUrl) image.src = `${this._mapUrl}${this._mapUrl.includes("?") ? "&" : "?"}_cb=${Date.now()}`; }

    _renderStatus() {
      const el = this.shadowRoot.getElementById("mw-status"); const c = this._config; const progress = this._clamp(this._number(this._state(c.sensors.progress)), 0, 100); const moving = this._isMoving();
      el.replaceChildren(); const hero = document.createElement("div"); hero.className = "mw-hero"; const top = document.createElement("div"); top.className = "mw-hero-top"; const label = document.createElement("span"); label.className = "mw-hero-label"; label.textContent = "Progression"; const pct = document.createElement("span"); pct.className = "mw-hero-pct"; pct.textContent = `${progress.toFixed(0)}%`; top.append(label, pct); hero.appendChild(top); const bar = document.createElement("div"); bar.className = "mw-bar"; const fill = document.createElement("div"); fill.className = `mw-bar-fill ${moving ? "mw-bar-fill-active" : ""}`; fill.style.width = `${progress}%`; bar.appendChild(fill); hero.appendChild(bar); el.appendChild(hero);
      const actions = document.createElement("div"); actions.className = "mw-actions"; actions.append(this._action("Demarrer", "mdi:play", "start_mowing", "mw-start"), this._action("Pause", "mdi:pause", "pause", "mw-pause-action"), this._action("Base", "mdi:home-import-outline", "dock", "mw-dock")); el.appendChild(actions);
    }
    _action(label, iconName, service, className) { const button = document.createElement("button"); button.type = "button"; button.className = `mw-action ${className}`; button.dataset.act = "service"; button.dataset.service = service; button.appendChild(icon(iconName)); const text = document.createElement("span"); text.textContent = label; button.appendChild(text); return button; }

    _renderControls() {
      const activeElement = this.shadowRoot.activeElement;
      if (activeElement instanceof HTMLSelectElement && activeElement.matches(".mw-select")) return;
      const el = this.shadowRoot.getElementById("mw-controls"); const c = this._config; el.replaceChildren(); const label = document.createElement("span"); label.className = "mw-label"; label.textContent = "Action"; el.appendChild(label);
      const actionEntity = c.selects.mowing_action; const options = this._options(actionEntity); const grid = document.createElement("div"); grid.className = "mw-options";
      if (!options.length) { const empty = document.createElement("div"); empty.className = "mw-empty"; empty.textContent = `${actionEntity} non trouve`; grid.appendChild(empty); } else options.forEach((option) => { const button = document.createElement("button"); button.type = "button"; button.className = `mw-option ${option === this._state(actionEntity) ? "mw-option-active" : ""}`; button.dataset.act = "select"; button.dataset.eid = actionEntity; button.dataset.value = option; button.appendChild(icon(this._actionIcon(option))); const text = document.createElement("span"); text.textContent = this._capitalize(option); button.appendChild(text); grid.appendChild(button); });
      el.appendChild(grid); const selects = document.createElement("div"); selects.className = "mw-selects"; [{ key: "edge", label: "Bordure", icon: "mdi:vector-square" }, { key: "map", label: "Carte", icon: "mdi:map" }, { key: "zone", label: "Zone", icon: "mdi:texture-box" }].forEach((item) => { const entity = c.selects[item.key]; const wrap = document.createElement("label"); wrap.className = `mw-select-wrap ${this._exists(entity) ? "" : "mw-off"}`; wrap.appendChild(icon(item.icon)); const name = document.createElement("span"); name.textContent = item.label; wrap.appendChild(name); const select = document.createElement("select"); select.className = "mw-select"; select.dataset.act = "select"; select.dataset.eid = entity; this._options(entity).forEach((option) => { const optionEl = document.createElement("option"); optionEl.value = option; optionEl.textContent = this._capitalize(option); select.appendChild(optionEl); }); select.value = this._state(entity); wrap.appendChild(select); selects.appendChild(wrap); }); el.appendChild(selects);
    }

    _renderMaintenance() {
      const el = this.shadowRoot.getElementById("mw-maint"); const c = this._config; el.replaceChildren(); const button = document.createElement("button"); button.type = "button"; button.className = `mw-maint-button ${this._maintOpen ? "mw-maint-button-open" : ""}`; button.dataset.act = "maintenance"; button.setAttribute("aria-expanded", String(this._maintOpen)); button.appendChild(icon("mdi:wrench-cog")); const label = document.createElement("span"); label.textContent = "Maintenance"; button.appendChild(label); button.appendChild(icon("mdi:chevron-down")); el.appendChild(button); const body = document.createElement("div"); body.id = "mw-maint-body"; body.className = "mw-maint-body"; body.hidden = !this._maintOpen; [{ label: "Lames", entity: c.sensors.blades, reset: c.buttons.reset_blades, icon: "mdi:fan" }, { label: "Brosse", entity: c.sensors.brush, reset: c.buttons.reset_brush, icon: "mdi:brush" }, { label: "Maintenance", entity: c.sensors.maintenance, reset: c.buttons.reset_maintenance, icon: "mdi:wrench" }].forEach((item) => { body.appendChild(this._maintenanceRow(item)); }); const footer = document.createElement("div"); footer.className = "mw-footer"; this._footerValue(footer, "mdi:bluetooth", this._state(c.sensors.bluetooth)); this._footerValue(footer, "mdi:identifier", this._state(c.sensors.device_code)); body.appendChild(footer); el.appendChild(body); }
    _maintenanceRow(item) { const row = document.createElement("div"); row.className = "mw-maint-row"; row.appendChild(icon(item.icon)); const name = document.createElement("span"); name.className = "mw-maint-name"; name.textContent = item.label; row.appendChild(name); if (!this._exists(item.entity)) { const na = document.createElement("span"); na.className = "mw-percent"; na.textContent = "n/a"; row.appendChild(na); return row; } const value = this._clamp(this._number(this._state(item.entity)), 0, 100); const track = document.createElement("div"); track.className = "mw-maint-track"; const fill = document.createElement("div"); fill.className = `mw-maint-fill ${value < 20 ? "mw-danger" : value < 50 ? "mw-warn" : "mw-good"}`; fill.style.width = `${value}%`; track.appendChild(fill); row.appendChild(track); const percent = document.createElement("span"); percent.className = "mw-percent"; percent.textContent = `${value.toFixed(0)}${attrOf(this._hass, item.entity, "unit_of_measurement", "%") || "%"}`; row.appendChild(percent); if (this._exists(item.reset)) { const reset = document.createElement("button"); reset.type = "button"; reset.className = "mw-reset"; reset.dataset.act = "press"; reset.dataset.eid = item.reset; reset.title = `Reinitialiser ${item.label}`; reset.appendChild(icon("mdi:restart")); row.appendChild(reset); } return row; }
    _footerValue(parent, iconName, value) { if (!value) return; const span = document.createElement("span"); span.appendChild(icon(iconName)); span.appendChild(document.createTextNode(this._capitalize(value))); parent.appendChild(span); }

    _mapEntity() { if (this._config.map_entity && this._exists(this._config.map_entity)) return this._config.map_entity; const slug = this._config.slug; return [`camera.${slug}_carte`, `camera.${slug}`, `camera.${slug}_map`].find((id) => this._exists(id)) || this._config.map_entity; }
    _state(entityId, fallback = "") { return stateOf(this._hass, entityId, fallback); }
    _exists(entityId) { return Boolean(entityId && this._hass?.states?.[entityId]); }
    _options(entityId) { return attrOf(this._hass, entityId, "options", []) || []; }
    _number(value) { const number = parseFloat(value); return Number.isFinite(number) ? number : 0; }
    _clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    _capitalize(value) { const text = String(value || ""); return text ? text[0].toUpperCase() + text.slice(1) : ""; }
    _isMoving() { const c = this._config; const progress = this._number(this._state(c.sensors.progress)); return /mow|run|cut/i.test(this._state(c.entity)) || progress > 0 && progress < 100; }
    _batteryIcon(value) { const level = Math.round(value / 10) * 10; if (level <= 10) return "mdi:battery-alert"; if (level >= 100) return "mdi:battery"; return `mdi:battery-${level}`; }
    _actionIcon(value) { const text = String(value || "").toLowerCase(); if (/mow|start|tond/.test(text)) return "mdi:play"; if (/edge|bord/.test(text)) return "mdi:vector-square"; if (/zone/.test(text)) return "mdi:texture-box"; if (/spot/.test(text)) return "mdi:crosshairs-gps"; if (/dock|home|base/.test(text)) return "mdi:home-import-outline"; if (/stop/.test(text)) return "mdi:stop"; return "mdi:circle-medium"; }
  }

  class MovaMowerCardEditor extends HTMLElement {
    constructor() { super(); this._config = {}; this._rendered = false; }
    setConfig(config) { this._config = clone(config); if (!this._rendered) { this._rendered = true; this._render(); } else this._sync(); }
    disconnectedCallback() { this._rendered = false; }
    _read(key) { return key.split(".").reduce((value, part) => value && value[part], this._config); }
    _set(key, value) { const parts = key.split("."); let target = this._config; parts.slice(0, -1).forEach((part) => { if (!target[part] || typeof target[part] !== "object") target[part] = {}; target = target[part]; }); if (value === "" || value === null || value === undefined) delete target[parts.at(-1)]; else target[parts.at(-1)] = value; this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: clone(this._config) }, bubbles: true, composed: true })); }
    _field(key, label, type = "text", placeholder = "") { const row = document.createElement("label"); row.className = "mmc-row"; const name = document.createElement("span"); name.textContent = label; row.appendChild(name); const input = document.createElement("input"); input.type = type; input.placeholder = placeholder; input.dataset.key = key; input.value = this._read(key) ?? ""; input.addEventListener("input", () => this._set(key, input.value)); row.appendChild(input); this.appendChild(row); return input; }
    _toggle(key, label, defaultOn = false) { const row = document.createElement("label"); row.className = "mmc-row"; const name = document.createElement("span"); name.textContent = label; row.appendChild(name); const input = document.createElement("input"); input.type = "checkbox"; input.dataset.key = key; input.checked = defaultOn ? this._read(key) !== false : Boolean(this._read(key)); input.addEventListener("change", () => this._set(key, input.checked)); row.appendChild(input); this.appendChild(row); }
    _render() { this.replaceChildren(); const style = document.createElement("style"); style.textContent = `:host{display:block;padding:14px;font-family:var(--primary-font-family,sans-serif)}.mmc-section{margin:16px 0 7px;padding-bottom:4px;border-bottom:1px solid var(--divider-color);color:var(--primary-color);font-size:11px;font-weight:700;text-transform:uppercase}.mmc-row{display:flex;align-items:center;gap:8px;margin-bottom:7px}.mmc-row>span{flex:0 0 150px;color:var(--secondary-text-color);font-size:12px}.mmc-row input[type=text],.mmc-row input[type=color]{box-sizing:border-box;min-width:0;flex:1;padding:5px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color)}.mmc-row input[type=checkbox]{width:38px;height:20px;margin:0;accent-color:var(--primary-color)}@media(max-width:500px){.mmc-row{align-items:flex-start;flex-direction:column;gap:4px}.mmc-row>span{flex:auto}.mmc-row input{width:100%}.mmc-row input[type=checkbox]{width:38px}}`; this.appendChild(style); this._section("Tondeuse"); this._field("entity", "Entite *", "text", "lawn_mower.mova_1000"); this._field("map_entity", "Camera carte", "text", "camera.mova_1000_carte"); this._field("pause_entity", "Entite pause", "text", "input_boolean.tondeuse_pause"); this._section("En-tete"); this._field("header.title", "Titre", "text", "Mova 1000"); this._field("header.icon", "Icone", "text", "mdi:robot-mower"); this._field("header.color", "Couleur titre", "text", "#ffffff"); this._field("header.title_size", "Taille titre", "text", "16px"); this._field("header.font", "Police", "text", "Orbitron"); this._section("Couleurs"); this._field("color_start", "Demarrer", "text", "#2EE5B6"); this._field("color_pause", "Pause", "text", "#FFEE58"); this._field("color_mode", "Modes", "text", "#00D4FF"); this._field("color_accent", "Accent", "text", "#9D4EDD"); this._sync(); }
    _sync() { this.querySelectorAll("[data-key]").forEach((input) => { if (document.activeElement === input) return; const value = this._read(input.dataset.key); if (input.type === "checkbox") input.checked = Boolean(value); else input.value = value ?? ""; }); }
  }

  if (!customElements.get("mova-mower-card-editor")) customElements.define("mova-mower-card-editor", MovaMowerCardEditor);
  if (!customElements.get("mova-mower-card")) customElements.define("mova-mower-card", MovaMowerCard);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((card) => card.type === "mova-mower-card")) window.customCards.push({ type: "mova-mower-card", name: "Mova Mower Card", description: "Mower card with map, status, controls and maintenance", preview: true });
  console.info("Mova Mower Card mower-only v1.0.0 loaded");
}());
