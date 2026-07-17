/* ── neon-nas-card v1.9 ── */
(() => {
  // Device detection (inclut app HA Companion) — coupe le décoratif coûteux sur iPad/mobile.
  const NAS_IS_IPAD =
    /iPad/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const NAS_IS_LOW_POWER =
    NAS_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);
  /**
   * ┌──────────────────────────────────────────────────────────────────────────┐
   * │  neon-nas-card.js  v1.2                                                 │
   * │  Home Assistant custom Lovelace card — Synology NAS (RS + RX410)        │
   * └──────────────────────────────────────────────────────────────────────────┘
   */

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  PALETTE — Neo Tokyo                                                       *
   * ═══════════════════════════════════════════════════════════════════════════ */

  const CP_ACCENT = "#00fff9"; // cyan — LED OK
  const CP_PRIMARY = "#B400FF"; // violet — accent
  const CP_OK = "#00FFAA"; // vert néon — healthy
  const CP_WARN = "#FFB800"; // orange — warning
  const CP_ERR = "#FF2D6F"; // rouge néon — alerte
  const CP_BG = "#040614";
  const CP_DIM = "rgba(255,255,255,0.55)";

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  GLITCH — mascotte chat qui se promène sur le châssis (validé en preview)   *
   *  3 calques Silverhand : rouge / cyan / vert plasma. Réglages preview.       *
   * ═══════════════════════════════════════════════════════════════════════════ */

  const GLITCH = {
    src: "/local/cat-walking-white.gif",
    size: 22, // px, hauteur du chat (petit/discret)
    speed: 9, // s pour traverser le châssis
    gap: 12, // s de pause hors-champ entre deux balades (jitter ×0.6–1.4)
    top: 0, // px d'ajustement vertical sur l'arête haute
    prob: 0.12, // proba de glitch Silverhand par traversée
    // Silverhand (valeurs validées preview) :
    sat: 12, // saturation des teintes
    op: 0.85, // opacité des calques colorés
    amp: 7, // px de décalage RGB
    dim: 0.55, // baisse du calque blanc au pic (révèle la couleur)
    dur: 1400, // ms
  };

  /* v2 : dots de statut par défaut (façade gauche) — appliqués si la config n'en définit pas. */
  const DEFAULT_STATUS_DOTS = [
    { label: "ETH0", entity: "binary_sensor.rackstation_snmp_eth0_connecte", type: "on_ok" },
    { label: "ETH1", entity: "binary_sensor.rackstation_snmp_eth1_connecte", type: "on_ok" },
    {
      label: "UPS",
      entity: "binary_sensor.rackstation_snmp_onduleur_sur_batterie",
      type: "problem",
    },
    { label: "RAID", entity: "binary_sensor.rackstation_snmp_raid_defaut", type: "problem" },
    { label: "RX410", entity: "binary_sensor.rackstation_snmp_rx410_connectee", type: "on_ok" },
    { label: "SYS", entity: "sensor.rackstation_snmp_statut_systeme", type: "normal" },
    { label: "FAN-S", entity: "sensor.rackstation_snmp_ventilo_systeme", type: "normal" },
    { label: "FAN-C", entity: "sensor.rackstation_snmp_ventilo_cpu", type: "normal" },
    // v2 : les 2 dernières perfos façade (déco) deviennent Download Station
    { label: "DL-ERR", entity: "binary_sensor.downloadstation_nas_ds_erreur", type: "problem" },
    { label: "DL-ON", entity: "binary_sensor.downloadstation_nas_ds_actif_dl_upload", type: "activity" },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  SVG NAS — 8 bays (2 rows × 4 cols)                                        *
   *  LED centers: y=113.5 (top row), y=132.5 (bottom row)                      *
   *               x=82, 158, 234, 310                                          *
   * ═══════════════════════════════════════════════════════════════════════════ */

  const LED_POS = [
    // top row — RX410 drives 1-4
    { x: 82, y: 113.5, row: "rx", idx: 1 },
    { x: 158, y: 113.5, row: "rx", idx: 2 },
    { x: 234, y: 113.5, row: "rx", idx: 3 },
    { x: 310, y: 113.5, row: "rx", idx: 4 },
    // bottom row — RS drives 1-4
    { x: 82, y: 132.5, row: "rs", idx: 1 },
    { x: 158, y: 132.5, row: "rs", idx: 2 },
    { x: 234, y: 132.5, row: "rs", idx: 3 },
    { x: 310, y: 132.5, row: "rs", idx: 4 },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  SVG CHASSIS — adapté du rs_8_bays_rs.svg                                   *
   * ═══════════════════════════════════════════════════════════════════════════ */

  function _chassis() {
    return `
    <rect class="nas-body" x="34" y="89" width="318" height="56"/>
    <path class="nas-side" d="M34,145h-13c-2.76,0-5-2.24-5-5v-46c0-2.76,2.24-5,5-5h13"/>
    <path class="nas-side" d="M352,145h13c2.76,0,5-2.24,5-5v-46c0-2.76-2.24-5-5-5h-13"/>

    <!-- Façade gauche (logo + leds système) -->
    <g>
      <rect class="nas-panel" x="42" y="105" width="74" height="17" rx="2" ry="2"/>
      <rect class="nas-screen" x="44" y="107" width="69" height="13"/>
      <rect class="nas-brand"  x="66" y="109" width="44" height="9" rx="1" ry="1"/>
      <rect class="nas-brand"  x="48" y="113" width="13" height="2" rx="1" ry="1"/>
    </g>
    <g class="nas-sysled" transform="translate(49,114)">
      <circle cx="0" cy="0" r="1" fill="var(--nas-accent)" opacity="0.9"/>
      <circle cx="4" cy="0" r="1" fill="var(--nas-accent)" opacity="0.5"/>
    </g>

    <!-- Grilles ventilation bays 2-3-4 (row top) -->
    ${_grille(142, 94)}${_grille(194, 94)}${_grille(270, 94)}
    <!-- Perforations bay 1 top (façade gauche) — v2 : les 10 = dots de statut (8 SNMP cliquables + 2 Download Station, lumière seule) -->
    ${[43, 55, 72, 78, 84, 90, 96, 102, 108, 114]
      .map((x, i) =>
        i < 10
          ? `<rect class="nas-dot stat stat-off${i >= 8 ? " no-info" : ""}" data-stat="${i}" x="${x}" y="96" width="2" height="2"/>`
          : `<rect class="nas-dot" x="${x}" y="96" width="2" height="2" style="animation-duration: ${(Math.random() * 0.2 + 0.05).toFixed(2)}s; animation-delay: ${Math.random().toFixed(2)}s;"/>`
      )
      .join("")}

    <!-- Bay frames (2 rows × 4 cols, skip col1 top which is the système panel) -->
    ${_bay(42, 105)}${_bay(118, 105)}${_bay(194, 105)}${_bay(270, 105)}
    ${_bay(42, 124)}${_bay(118, 124)}${_bay(194, 125)}${_bay(270, 124)}
  `;
  }

  function _grille(x, y) {
    return `
    <rect class="nas-grille" x="${x}" y="${y}" width="${x === 142 ? 50 : 74}" height="2"/>
    <rect class="nas-grille" x="${x}" y="${y + 4}" width="${x === 142 ? 50 : 74}" height="2"/>
  `;
  }

  function _bay(x, y) {
    return `
    <rect class="nas-bay-frame" x="${x}" y="${y}" width="74" height="17" rx="2" ry="2"/>
    <rect class="nas-bay-inner" x="${x + 2}" y="${y + 2}" width="69" height="13"/>
    <rect class="nas-bay-label" x="${x + 24}" y="${y + 4}" width="44" height="9" rx="1" ry="1"/>
    <rect class="nas-bay-notch" x="${x + 6}" y="${y + 8}" width="13" height="2" rx="1" ry="1"/>
  `;
  }

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  CARD                                                                      *
   * ═══════════════════════════════════════════════════════════════════════════ */

  class NeonNasCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    setConfig(c) {
      clearInterval(this._confirmTimer);
      if (NAS_IS_LOW_POWER) this.classList.add("low-power"); // coupe glow header animé + flicker rapide sur iPad/mobile
      this._config = { card_mod_bg: true, ...c };
      // v2 : si la config (ancienne) ne définit pas les dots de statut, on applique les défauts.
      if (!Array.isArray(this._config.status_dots) || this._config.status_dots.length === 0) {
        this._config.status_dots = DEFAULT_STATUS_DOTS;
      }
      this._built = false;
    }

    set hass(h) {
      this._hass = h;
      if (!this._built) {
        this._built = true;
        this._render();
        return;
      }
      this._update();
    }

    disconnectedCallback() {
      clearInterval(this._confirmTimer);
      clearInterval(this._pendingTimer);
      this._stopGlitch();
    }

    getCardSize() {
      return 3;
    }
    static getConfigElement() {
      return document.createElement("neon-nas-card-v2-editor");
    }
    static getStubConfig() {
      return {
        title: "Rackstation",
        led_ok_color: "#00FFAA",
        total_entity: "sensor.rackstation_volume_1_taille_totale",
        used_entity: "sensor.rackstation_volume_1_espace_utilise",
        used_pct_entity: "sensor.rackstation_volume_1_volume_utilise",
        temp_entity: "sensor.rackstation_temperature",
        health_entity: "sensor.rackstation_snmp_statut_raid",
        drives: [
          "sensor.rackstation_drive_1_rx410_1_etat",
          "sensor.rackstation_drive_2_rx410_1_etat",
          "sensor.rackstation_drive_3_rx410_1_etat",
          "sensor.rackstation_drive_4_rx410_1_etat",
          "sensor.rackstation_drive_1_etat",
          "sensor.rackstation_drive_2_etat",
          "sensor.rackstation_drive_3_etat",
          "sensor.rackstation_drive_4_etat",
        ],
        drive_alerts: [
          [
            "binary_sensor.rackstation_drive_1_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_1_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_2_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_2_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_3_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_3_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_4_rx410_1_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_4_rx410_1_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_1_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_1_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_2_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_2_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_3_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_3_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
          [
            "binary_sensor.rackstation_drive_4_depassement_du_nombre_maximal_de_secteurs_defectueux",
            "binary_sensor.rackstation_drive_4_en_dessous_de_la_duree_de_vie_restante_minimale",
          ],
        ],
        // v2 : 8 dots de statut sur la façade gauche (ex-perforations).
        // type définit la logique OK/ERR ; on_battery/raid_fault sont des binary "problème".
        status_dots: [
          { label: "ETH0", entity: "binary_sensor.rackstation_snmp_eth0_connecte", type: "on_ok" },
          { label: "ETH1", entity: "binary_sensor.rackstation_snmp_eth1_connecte", type: "on_ok" },
          {
            label: "UPS",
            entity: "binary_sensor.rackstation_snmp_onduleur_sur_batterie",
            type: "problem",
          },
          { label: "RAID", entity: "binary_sensor.rackstation_snmp_raid_defaut", type: "problem" },
          {
            label: "RX410",
            entity: "binary_sensor.rackstation_snmp_rx410_connectee",
            type: "on_ok",
          },
          { label: "SYS", entity: "sensor.rackstation_snmp_statut_systeme", type: "normal" },
          { label: "FAN-S", entity: "sensor.rackstation_snmp_ventilo_systeme", type: "normal" },
          { label: "FAN-C", entity: "sensor.rackstation_snmp_ventilo_cpu", type: "normal" },
        ],
      };
    }

    /* ── helpers ──────────────────────────────────────────────────────────── */

    _ent(id) {
      if (!id || !this._hass) return null;
      const s = this._hass.states[id];
      return s ? { id, v: s.state, a: s.attributes } : null;
    }

    _driveStatus(i) {
      // returns 'ok' | 'warn' | 'err' | 'unavail'
      const alerts = (this._config.drive_alerts || [])[i] || [];
      for (const aId of alerts) {
        const e = this._ent(aId);
        if (e && e.v === "on") return "err";
      }
      const stateEnt = this._ent((this._config.drives || [])[i]);
      if (!stateEnt) return "unavail";
      const v = String(stateEnt.v).toLowerCase();
      if (v === "unavailable" || v === "unknown") return "unavail";
      if (v.includes("normal") || v.includes("ok") || v.includes("healthy") || v.includes("bon"))
        return "ok";
      return "warn";
    }

    // v2 : statut d'un dot → 'ok' | 'err' | 'off' (off = indispo)
    _statusDot(i) {
      const d = (this._config.status_dots || [])[i];
      if (!d || !d.entity) return "off";
      const e = this._ent(d.entity);
      if (!e) return "off";
      const v = String(e.v).toLowerCase();
      if (v === "unavailable" || v === "unknown" || v === "none" || v === "") return "off";
      switch (d.type) {
        case "on_ok":
          return v === "on" ? "ok" : "err"; // connecté = on
        case "problem":
          return v === "on" ? "err" : "ok"; // binary problème : on = défaut
        case "normal":
          return v.includes("normal") ? "ok" : "err";
        case "activity":
          return v === "on" ? "active" : "ok"; // actif = cyan clignotant, repos = vert calme
        default:
          return v === "on" || v.includes("normal") ? "ok" : "err";
      }
    }

    _fmtBytes(v, attrs) {
      if (v === null || v === undefined || v === "") return "—";
      const n = parseFloat(v);
      if (isNaN(n)) return v;
      const unit = (attrs && attrs.unit_of_measurement) || "";
      return `${n.toFixed(2)} ${unit}`.trim();
    }

    _moreInfo(entityId) {
      if (!entityId) return;
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId };
      this.dispatchEvent(ev);
    }

    /* ── render ──────────────────────────────────────────────────────────── */

    _render() {
      const c = this._config || {};
      const hdr = c.header && typeof c.header === "object" ? c.header : {};
      const title = hdr.title || c.title || "Rackstation";
      const cardModBg = c.card_mod_bg !== false;
      const accent = c.color_accent || CP_ACCENT;
      const ledOk = c.led_ok_color || CP_OK;
      const bg = cardModBg ? "transparent" : c.color_bg || CP_BG;

      this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card {
          padding: 10px 12px 10px;
          position: relative; overflow: hidden;
          ${cardModBg ? "" : `background: ${bg};`}
          --nas-accent: ${accent};
          --nas-primary: ${CP_PRIMARY};
          --nas-ok: ${ledOk};
          --nas-warn: ${CP_WARN};
          --nas-err: ${CP_ERR};
          --nas-dim: ${CP_DIM};
          --nas-uv: var(--rgb-primary-color, 98,0,234);
          --nas-cy: var(--rgb-accent-color, 0,255,249);
          --nas-err-rgb: var(--rgb-error-color, 255,45,107);
          --gc-sat: ${(c.glitch && c.glitch.sat) || GLITCH.sat};
          ${hdr.color ? `--nas-hdr-color: ${hdr.color};` : ""}
          ${hdr.title_size ? `--nas-hdr-size: ${hdr.title_size};` : ""}
          ${hdr.title_shadow ? `--nas-hdr-shadow: ${hdr.title_shadow};` : ""}
        }
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500&display=swap');

        @keyframes hdr-glow {
          0%,100% { text-shadow: 0 0 6px var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55)), 0 0 12px rgba(var(--nas-cy),.4); }
          50%      { text-shadow: 0 0 10px var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55)), 0 0 22px rgba(var(--nas-cy),.7); }
        }

        .hdr {
          display:flex; align-items:center; gap:8px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          position: relative;
        }
        .hdr::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(var(--nas-uv),.55) 20%,
            rgba(var(--nas-cy),.3) 50%,
            rgba(var(--nas-uv),.55) 80%,
            transparent);
        }
        .hdr .ico {
          display: inline-flex; align-items: center;
          width:18px; height:18px;
          color: var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55));
          filter: drop-shadow(0 0 4px var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55)));
          flex-shrink: 0;
          --mdc-icon-size: 18px;
        }
        .hdr .title {
          flex:1;
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size: var(--nas-hdr-size, 13px);
          letter-spacing: clamp(1px, 0.5cqi, 3px);
          text-transform: uppercase;
          color: var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55));
          text-shadow: var(--nas-hdr-shadow, 0 0 6px var(--nas-hdr-color, rgba(var(--rgb-primary-text-color),0.55)));
          animation: hdr-glow 3s ease-in-out infinite;
        }
        .hdr-badges {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        /* health */
        .hdr .health {
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor; cursor:pointer; white-space:nowrap;
          mix-blend-mode: screen;
          display: inline-flex; align-items: center; line-height: 1;
        }
        .hdr .health.ok      { color:var(--nas-ok); }
        .hdr .health.warn    { color:var(--nas-warn); }
        .hdr .health.err     { color:var(--nas-err); }
        .hdr .health.unavail { color:var(--nas-dim); }

        .nas-wrap { position:relative; width:100%; }
        .nas-wrap:hover .nas-dot {
          opacity: 0.4;
          filter: drop-shadow(0 0 1px var(--nas-accent));
        }
        svg.nas { width:100%; height:auto; display:block; }

        /* ── GLITCH le chat ── */
        .glitch-cat {
          position:absolute; top:0; left:0;
          pointer-events:none; will-change:transform;
          image-rendering:pixelated; z-index:5;
        }
        .glitch-cat > img { display:block; width:100%; height:100%; position:relative; z-index:2; }
        .gc-layer { position:absolute; inset:0; mix-blend-mode:screen; opacity:0; z-index:3; }
        .gc-layer img { width:100%; height:100%; display:block; }
        .gc-rd { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(-55deg) brightness(1.15); }
        .gc-cy { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(150deg) brightness(1.1); }
        .gc-gn { filter: sepia(1) saturate(var(--gc-sat,12)) hue-rotate(75deg)  brightness(1.15); }
        .gc-scan {
          position:absolute; inset:0; mix-blend-mode:overlay; opacity:0; z-index:4;
          background:repeating-linear-gradient(0deg,
            rgba(255,255,255,.22) 0 1px, transparent 1px 3px);
        }
        @media (prefers-reduced-motion: reduce) {
          .glitch-cat { display:none; }
        }

        /* chassis */
        /* Châssis en plastique noir */
        .nas-body { fill: url(#grad-plastic); stroke: #000; stroke-width: 0.3; }
        .nas-side, .nas-panel { 
          fill: url(#grad-plastic); /* Au lieu de #1e2228 */
          filter: brightness(0.8);    /* Un poil plus sombre pour marquer la séparation */
        }
        .nas-screen { fill:#131619; }
        .nas-brand  { fill:#2e333a; }
        /* Remplace le style .nas-dot existant */
        .nas-dot {
          fill: var(--nas-accent); 
          stroke: rgba(255,255,255,0.1); 
          stroke-width: 0.1;
          animation: hdd-flicker 0.1s infinite;
          opacity: 0.1;
        }

        /* L'animation de clignotement aléatoire (à mettre à la fin de tes styles) */
        @keyframes hdd-flicker {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; } 
        }
        /* v2 : flicker des DISQUES — même rythme rapide mais pleine intensité couleur */
        @keyframes hdd-flicker-bright {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        /* v2 : .nas-dot pilotés = dots de statut. Vert néon FIXE (#00FFAA, comme v1),
           indépendant de led_ok_color (qui peut être bleu). Glow net via drop-shadow. */
        .nas-dot.stat { animation: none; cursor: pointer; stroke-width: 0; }
        .nas-dot.stat.stat-ok  {
          fill: #00FFAA; opacity: 1;
          filter: drop-shadow(0 0 2px #00FFAA) drop-shadow(0 0 4px #00FFAA);
        }
        .nas-dot.stat.stat-err {
          fill: var(--nas-err); opacity: 1;
          filter: drop-shadow(0 0 2px var(--nas-err)) drop-shadow(0 0 4px var(--nas-err));
          animation: pulse .7s infinite;
        }
        .nas-dot.stat.stat-active {
          fill: var(--nas-ok); opacity: 1;
          filter: drop-shadow(0 0 2px var(--nas-ok)) drop-shadow(0 0 5px var(--nas-ok));
          animation: pulse .5s infinite;
        }
        .nas-dot.stat.stat-off { fill: #3a4250; opacity: .35; filter: none; }
        .nas-grille { fill:#131619; }
        .nas-bay-frame { fill:#1e2228; }
        /* Profondeur des baies de disques */
        .nas-bay-inner { 
          fill: #050608; 
          box-shadow: inset 0 0 5px #000; 
        }
        /* Les "notches" (encoches) et poignées */
        .nas-bay-notch, .nas-bay-label { 
          fill: #1a1e24; 
          stroke: #000; 
          stroke-width: 0.5;
        }

        /* drive LEDs */
        .drive-led { cursor:pointer; }
        .drive-led .ring { fill:#1a1d24; }
        .drive-led .dot  {
          transition: all 0.3s ease;
          filter: blur(0.2px);
        }
        /* v2 : les disques reçoivent le hdd-flicker rapide aléatoire (pleine intensité) */
        .drive-led.ok   .dot { fill: var(--nas-ok);   filter: url(#led-glow-nas); animation: hdd-flicker-bright 0.1s infinite; }
        .drive-led.warn .dot { fill: var(--nas-warn); filter: url(#led-glow-nas); animation: hdd-flicker-bright 0.1s infinite; }
        .drive-led.err  .dot { fill: var(--nas-err);  filter: url(#led-glow-nas); animation: hdd-flicker-bright 0.1s infinite; }
        .drive-led.unavail .dot { fill:#3a4250; filter:none; }

        @keyframes flicker {
          0%,100% { opacity:1;   }
          47%     { opacity:1;   }
          48%     { opacity:.35; }
          50%     { opacity:1;   }
          72%     { opacity:1;   }
          73%     { opacity:.55; }
          75%     { opacity:1;   }
        }
        @keyframes pulse {
          0%,100% { opacity:1;   }
          50%     { opacity:.3; }
        }

        /* footer stats */
        .stats {
          display:grid;
          /* 3 colonnes : donut | volume | bloc actions. minmax(0,1fr) sinon la
             piste volume garde min-width:auto et déborde sur les boutons (iPad). */
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items:center;
          gap:8px;
          margin-top:6px;
          padding-top: 8px;
          position: relative;
          /* container query : permet d'empiler les boutons quand la card est étroite */
          container-type: inline-size;
          container-name: nasstats;
        }
        /* bloc actions : côte à côte par défaut */
        .acts { display:flex; gap:8px; flex-shrink:0; }
        /* card étroite (iPad paysage multi-colonnes) → boutons l'un sous l'autre */
        @container nasstats (max-width: 360px) {
          .acts { flex-direction: column; gap:6px; }
          .acts .btn-action { width:100%; justify-content:center; }
        }
        .stats::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(var(--nas-uv),.4) 20%,
            rgba(var(--nas-cy),.2) 50%,
            rgba(var(--nas-uv),.4) 80%,
            transparent);
        }
        .donut {
          --pct: 0;
          --col: var(--nas-accent);
          width:50px; height:50px; border-radius:50%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            conic-gradient(var(--col) calc(var(--pct) * 1%), rgba(255,255,255,0.05) 0);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 15px color-mix(in srgb, var(--col) 20%, transparent);
          position:relative;
          cursor:pointer;
          filter: drop-shadow(0 0 6px color-mix(in srgb, var(--col) 40%, transparent));
          flex-shrink:0;
        }
        .donut::after {
            content: ""; position: absolute; inset: 2px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.1); pointer-events: none;
        }
        .donut::before {
          content:""; position:absolute; inset:6px; border-radius:50%;
          background: var(--ha-card-background, #0a0d18);
        }
        .donut .pct {
          position:absolute; inset:0; display:flex;
          align-items:center; justify-content:center;
          font-size:13px; font-weight:600; color: var(--primary-text-color);
          letter-spacing:.02em;
        }
        .vol {
          display:flex; flex-direction:column; gap:3px; min-width:0;
          /* container-type pour que le clamp(...cqi...) de .line1 suive la
             largeur réelle de la cellule (étroite sur iPad paysage) */
          container-type: inline-size;
        }
        .vol .line1 {
          font-size: clamp(14px, 4.2cqi, 15px); font-weight:700; color: var(--nas-accent);
          font-variant-numeric: tabular-nums;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          mix-blend-mode: screen;
          text-shadow: 0 0 8px var(--nas-accent);
        }
        .vol .line1 .tot { color: var(--nas-dim); font-weight:400; }
        .vol .line2 {
          font-size:11px; color: var(--nas-dim);
          letter-spacing:.06em; text-transform:uppercase;
        }
        /* temp tile (header) — même style que health */
        .temp {
          display:inline-flex; align-items:center; gap:4px; line-height:1;
          font-family: 'Orbitron', var(--primary-font-family, 'Roboto'), sans-serif;
          font-size:10px; font-weight:700; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor;
          color:var(--nas-accent);
          font-variant-numeric:tabular-nums;
          cursor:pointer; white-space:nowrap;
          mix-blend-mode: screen;
        }
        .temp svg { width:10px; height:10px; flex-shrink:0; }
        .temp.hot  { color:var(--nas-err); }
        .temp.warm { color:var(--nas-warn); }

        /* action buttons — même style que health */
        .actions { display:none; }
        .btn-action {
          display:flex; align-items:center; gap:4px;
          font-size:11px; padding:2px 8px; border-radius:6px;
          border:1px solid currentColor; letter-spacing:.08em; text-transform:uppercase;
          cursor:pointer; background:transparent; font-family:inherit; font-weight:700;
          white-space:nowrap;
          transition: background .15s;
        }
        .btn-action svg { width:11px; height:11px; flex-shrink:0; }
        .btn-reboot  { color:var(--nas-accent); mix-blend-mode: screen; }
        .btn-reboot:hover  {
          background: rgba(var(--nas-cy), var(--glow-opacity-idle, 0.08));
          box-shadow: 0 0 10px rgba(var(--nas-cy), var(--glow-opacity-hover, 0.20)),
                      inset 0 0 8px rgba(var(--nas-cy), var(--glow-opacity-idle, 0.06));
          text-shadow: 0 0 8px var(--nas-accent);
          border-color: rgba(var(--nas-cy), 0.6);
        }
        .btn-shutdown { color:var(--nas-err); mix-blend-mode: screen; }
        .btn-shutdown:hover {
          background: rgba(var(--nas-err-rgb), var(--glow-opacity-idle, 0.08));
          box-shadow: 0 0 10px rgba(var(--nas-err-rgb), var(--glow-opacity-hover, 0.20)),
                      inset 0 0 8px rgba(var(--nas-err-rgb), var(--glow-opacity-idle, 0.06));
          text-shadow: 0 0 8px var(--nas-err);
          border-color: rgba(var(--nas-err-rgb), 0.6);
        }
        /* état "Power On" (NAS éteint) : vire au vert/cyan */
        .btn-shutdown.is-poweron { color:var(--nas-ok, #39ff9e); }
        .btn-shutdown.is-poweron:hover {
          background: rgba(var(--nas-ok-rgb, 57,255,158), var(--glow-opacity-idle, 0.08));
          box-shadow: 0 0 10px rgba(var(--nas-ok-rgb, 57,255,158), var(--glow-opacity-hover, 0.20)),
                      inset 0 0 8px rgba(var(--nas-ok-rgb, 57,255,158), var(--glow-opacity-idle, 0.06));
          text-shadow: 0 0 8px var(--nas-ok, #39ff9e);
          border-color: rgba(var(--nas-ok-rgb, 57,255,158), 0.6);
        }

        /* état transitoire booting/stopping : pulse + spinner */
        .btn-shutdown.is-busy { pointer-events:none; opacity:0.95; }
        .btn-shutdown.is-busy.busy-on  { color: var(--nas-ok, #39ff9e); animation: btn-pulse-on 1.1s ease-in-out infinite; }
        .btn-shutdown.is-busy.busy-off { color: var(--nas-err); animation: btn-pulse-off 1.1s ease-in-out infinite; }
        @keyframes btn-pulse-on {
          0%,100% { box-shadow: 0 0 4px rgba(var(--nas-ok-rgb, 57,255,158), 0.15); }
          50%     { box-shadow: 0 0 14px rgba(var(--nas-ok-rgb, 57,255,158), 0.45); }
        }
        @keyframes btn-pulse-off {
          0%,100% { box-shadow: 0 0 4px rgba(var(--nas-err-rgb), 0.15); }
          50%     { box-shadow: 0 0 14px rgba(var(--nas-err-rgb), 0.45); }
        }
        /* le svg du bouton tourne quand busy */
        .btn-shutdown.is-busy svg { animation: btn-spin 0.9s linear infinite; transform-origin:50% 50%; }
        @keyframes btn-spin { to { transform: rotate(360deg); } }

        /* confirm overlay */
        .confirm-overlay {
          position:absolute; inset:0; border-radius: inherit;
          background: rgba(4,6,20,0.985);
          -webkit-backdrop-filter: blur(var(--blur-strength-heavy, 28px));
          backdrop-filter: blur(var(--blur-strength-heavy, 28px));
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:10px; z-index:10;
          animation: fadeIn .15s ease;
        }
        /* fond plein indépendant du backdrop-filter (si ignoré par le navigateur) */
        .confirm-overlay::before {
          content:""; position:absolute; inset:0; border-radius: inherit;
          background: linear-gradient(rgba(4,6,20,0.97), rgba(6,8,26,0.97));
          z-index:-1;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .confirm-overlay .confirm-msg {
          font-size:13px; color: var(--primary-text-color);
          text-align:center; line-height:1.4; padding:0 16px;
        }
        .confirm-overlay .confirm-msg strong { color: var(--nas-err); }
        .confirm-overlay .confirm-timer {
          font-size:10px; color: var(--nas-dim); letter-spacing:.1em;
        }
        .confirm-overlay .confirm-btns {
          display:flex; gap:8px;
        }
        .confirm-overlay .btn-cancel {
          padding:6px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.2);
          background:transparent; color: var(--nas-dim);
          font-size:12px; cursor:pointer; font-family:inherit;
          transition:background .15s;
        }
        .confirm-overlay .btn-cancel:hover { background:rgba(255,255,255,0.08); }
        .confirm-overlay .btn-confirm-ok {
          padding:6px 16px; border-radius:6px; border:1px solid;
          background:transparent; font-size:12px; cursor:pointer;
          font-family:inherit; font-weight:600;
          transition:background .15s, box-shadow .15s;
        }
        .confirm-overlay .btn-confirm-ok.reboot {
          color: var(--nas-accent); border-color: rgba(var(--nas-cy), 0.5);
        }
        .confirm-overlay .btn-confirm-ok.reboot:hover {
          background: rgba(var(--nas-cy), var(--glow-opacity-active, 0.15));
          box-shadow: 0 0 10px rgba(var(--nas-cy), var(--glow-opacity-hover, 0.20));
        }
        .confirm-overlay .btn-confirm-ok.shutdown {
          color: var(--nas-err); border-color: rgba(var(--nas-err-rgb), 0.5);
        }
        .confirm-overlay .btn-confirm-ok.shutdown:hover {
          background: rgba(var(--nas-err-rgb), var(--glow-opacity-active, 0.15));
          box-shadow: 0 0 10px rgba(var(--nas-err-rgb), var(--glow-opacity-hover, 0.20));
        }
        .confirm-overlay .btn-confirm-ok.poweron {
          color: var(--nas-ok, #39ff9e); border-color: rgba(var(--nas-ok-rgb, 57,255,158), 0.5);
        }
        .confirm-overlay .btn-confirm-ok.poweron:hover {
          background: rgba(var(--nas-ok-rgb, 57,255,158), var(--glow-opacity-active, 0.15));
          box-shadow: 0 0 10px rgba(var(--nas-ok-rgb, 57,255,158), var(--glow-opacity-hover, 0.20));
        }
        .nas-wrap { position:relative; }

        /* iPad/mobile : on GARDE les LED de statut disque (info utile, pulse lent OK).
           v2 : les dots de statut (:not(.stat) exclu) restent lumineux ; les perforations
           déco gardent un flicker plus SOFT (ralenti) au lieu d'être figées. */
        :host(.low-power) .hdr-title { animation: none; }
        :host(.low-power) .nas-dot:not(.stat) { animation: hdd-flicker 0.6s infinite !important; opacity: 1; }
      </style>
      <ha-card>
        <div class="hdr" id="hdr">
          ${
            hdr.icon
              ? `<ha-icon class="ico" icon="${hdr.icon}"></ha-icon>`
              : `<svg class="ico" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4zM7 6v.01M7 12v.01M7 18v.01"/>
               </svg>`
          }
          <span class="title">${title}</span>
          <div class="hdr-badges">
            <div class="temp" id="temp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 00-3 3v10.27a5 5 0 106 0V5a3 3 0 00-3-3zm0 2a1 1 0 011 1v10.83l.4.29a3 3 0 11-2.8 0l.4-.29V5a1 1 0 011-1z"/></svg>
              <span id="tempVal">—</span>
            </div>
            <span class="health" id="health"><span id="healthVal">—</span></span>
          </div>
        </div>
        <div class="nas-wrap">
          <svg class="nas" viewBox="0 82 386 72" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-plastic" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#1a1d22;stop-opacity:1" />
                <stop offset="10%" style="stop-color:#12151a;stop-opacity:1" />
                <stop offset="90%" style="stop-color:#0d0f12;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#050608;stop-opacity:1" />
              </linearGradient>
              <radialGradient id="grad-hole">
                <stop offset="0%"   stop-color="#000000" />
                <stop offset="80%"  stop-color="#1a1d22" />
                <stop offset="100%" stop-color="#3a3f47" />
              </radialGradient>
              <filter id="led-glow-nas" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 0" result="intenseBlur"/>
                <feMerge>
                  <feMergeNode in="intenseBlur"/>
                  <feMergeNode in="intenseBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            ${_chassis()}
            ${LED_POS.map(
              (p, i) => `
              <g class="drive-led" data-idx="${i}"
                 transform="translate(${p.x},${p.y})">
                <circle class="ring" r="2.5"/>
                <circle class="dot"  r="1.25"/>
              </g>
            `
            ).join("")}
          </svg>
        </div>
        <div class="stats">
          <div class="donut" id="donut"><div class="pct" id="pct">—</div></div>
          <div class="vol">
            <div class="line1"><span id="used">—</span> <span class="tot">/ <span id="total">—</span></span></div>
            <div class="line2" id="volLabel"></div>
          </div>
          <div class="acts">
            <button class="btn-action btn-reboot" id="btn-reboot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>Reboot
            </button>
            <button class="btn-action btn-shutdown" id="btn-shutdown">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
              </svg><span id="btn-shutdown-label">Shutdown</span>
            </button>
          </div>
        </div>
      </ha-card>
    `;

      // bind clicks
      this.shadowRoot.querySelectorAll(".drive-led").forEach((el) => {
        el.addEventListener("click", () => {
          const i = +el.dataset.idx;
          const id = (this._config.drives || [])[i];
          this._moreInfo(id);
        });
      });
      // v2 : clic sur un dot de statut → more-info de son entité (sauf .no-info : lumière seule, ex. Download Station)
      this.shadowRoot.querySelectorAll(".nas-dot.stat:not(.no-info)").forEach((el) => {
        el.addEventListener("click", () => {
          const d = (this._config.status_dots || [])[+el.dataset.stat];
          if (d) this._moreInfo(d.entity);
        });
      });
      this.shadowRoot
        .getElementById("donut")
        .addEventListener("click", () =>
          this._moreInfo(this._config.used_pct_entity || this._config.used_entity)
        );
      this.shadowRoot
        .getElementById("temp")
        .addEventListener("click", () => this._moreInfo(this._config.temp_entity));
      this.shadowRoot
        .getElementById("health")
        .addEventListener("click", () => this._moreInfo(this._config.health_entity));
      this.shadowRoot
        .getElementById("btn-reboot")
        .addEventListener("click", () => this._confirm("reboot"));
      this.shadowRoot
        .getElementById("btn-shutdown")
        .addEventListener("click", () => this._confirm(this._nasIsOff() ? "poweron" : "shutdown"));

      // v2 : hdd-flicker rapide aléatoire par disque (comme les perforations) —
      // durée courte 0.05–0.25s + delay désynchronisé, sinon le flicker est invisible.
      this.shadowRoot.querySelectorAll(".drive-led .dot").forEach((dot) => {
        dot.style.animationDelay = Math.random().toFixed(2) + "s";
        dot.style.animationDuration = (Math.random() * 0.2 + 0.05).toFixed(2) + "s";
      });

      this._startGlitch();
      this._update();
    }

    /* ── GLITCH le chat : balade intermittente + Silverhand aléatoire ─────────── */

    // Lit un réglage GLITCH depuis la config (glitch.<key>) avec fallback sur les défauts.
    _gc(key) {
      const g = (this._config && this._config.glitch) || {};
      const v = g[key];
      return v === undefined || v === null || v === "" ? GLITCH[key] : v;
    }
    _gcOn() {
      const g = (this._config && this._config.glitch) || {};
      return g.enabled !== false; // activé par défaut
    }

    _startGlitch() {
      this._stopGlitch(); // repart propre à chaque (re)render
      if (!this._gcOn()) return;
      this._gcWrap = this.shadowRoot.querySelector(".nas-wrap");
      if (!this._gcWrap) return;
      this._gcCat = null;
      this._gcTimers = new Set();
      this._gcRafs = new Set();
      const t = setTimeout(() => this._spawnWalk(), 800); // 1ère balade après un court délai
      this._gcTimers.add(t);
    }

    _stopGlitch() {
      if (this._gcTimers) this._gcTimers.forEach(clearTimeout);
      if (this._gcRafs) this._gcRafs.forEach((id) => cancelAnimationFrame(id));
      this._gcTimers = new Set();
      this._gcRafs = new Set();
      if (this._gcCat) {
        this._gcCat.remove();
        this._gcCat = null;
      }
    }

    _scheduleWalk() {
      if (!this._gcTimers) return;
      const gap = this._gc("gap") * 1000 * (0.6 + Math.random() * 0.8);
      const t = setTimeout(() => this._spawnWalk(), gap);
      this._gcTimers.add(t);
    }

    _spawnWalk() {
      const wrap = this._gcWrap;
      if (!wrap || !wrap.isConnected) return;
      const svg = wrap.querySelector("svg.nas");
      if (!svg) return;

      const w = wrap.clientWidth;
      const svgH = svg.clientHeight;
      const size = +this._gc("size");
      const src = this._gc("src");
      const left = w * (16 / 386); // entre un peu avant le rack
      const right = w * (360 / 386); // sort par la droite
      const yTop = svgH * ((89 - 82) / 72); // arête haute du châssis (viewBox 82..154)
      const topPx = yTop - size + +this._gc("top");

      const dir = Math.random() < 0.5 ? 1 : -1; // 1 = gauche→droite
      const startX = dir === 1 ? left - size : right;
      const endX = dir === 1 ? right : left - size;

      const cat = document.createElement("div");
      cat.className = "glitch-cat";
      cat.style.width = size + "px";
      cat.style.height = size + "px";
      cat.style.transform = `translate(${startX}px,${topPx}px) scaleX(${dir})`;
      cat.innerHTML = `
      <img src="${src}" alt="">
      <div class="gc-layer gc-rd"><img src="${src}" alt=""></div>
      <div class="gc-layer gc-cy"><img src="${src}" alt=""></div>
      <div class="gc-layer gc-gn"><img src="${src}" alt=""></div>
      <div class="gc-scan"></div>`;
      wrap.appendChild(cat);
      this._gcCat = cat;

      const dur = +this._gc("speed") * 1000;
      const t0 = performance.now();
      const willGlitch = Math.random() < +this._gc("prob");
      const glitchAt = 0.35 + Math.random() * 0.35;
      let glitched = false;

      const frame = (now) => {
        if (!cat.isConnected) return;
        const p = (now - t0) / dur;
        if (p >= 1) {
          cat.remove();
          if (this._gcCat === cat) this._gcCat = null;
          this._scheduleWalk();
          return;
        }
        const x = startX + (endX - startX) * p;
        const bob = Math.sin(p * Math.PI * 2 * 8) * 0.8; // démarche
        cat.style.transform = `translate(${x}px,${topPx + bob}px) scaleX(${dir})`;
        if (willGlitch && !glitched && p >= glitchAt) {
          glitched = true;
          this._doSilverhand(cat);
        }
        const id = requestAnimationFrame(frame);
        this._gcRafs.add(id);
      };
      const id = requestAnimationFrame(frame);
      this._gcRafs.add(id);
    }

    _doSilverhand(cat) {
      const main = cat.querySelector(":scope > img");
      const rd = cat.querySelector(".gc-rd"),
        cy = cat.querySelector(".gc-cy");
      const gn = cat.querySelector(".gc-gn"),
        scan = cat.querySelector(".gc-scan");
      if (!main) return;
      const amp = +this._gc("amp"),
        op = +this._gc("op"),
        dim = +this._gc("dim");
      const durMs = +this._gc("dur");
      const t0 = performance.now();
      const s = () => (Math.random() < 0.5 ? -1 : 1);

      const step = (now) => {
        if (!cat.isConnected) return;
        const p = (now - t0) / durMs;
        if (p >= 1) {
          rd.style.opacity = cy.style.opacity = gn.style.opacity = scan.style.opacity = 0;
          main.style.clipPath = "";
          main.style.transform = "";
          main.style.opacity = 1;
          return;
        }
        const a = amp * (0.4 + Math.random() * 0.6);
        rd.style.transform = `translate(${s() * a}px,${s() * a * 0.3}px)`;
        cy.style.transform = `translate(${s() * a}px,${s() * a * 0.3}px)`;
        gn.style.transform = `translate(${s() * a * 0.6}px,${s() * a * 0.4}px)`;
        rd.style.opacity = cy.style.opacity = op * (0.7 + Math.random() * 0.3);
        gn.style.opacity = op * (0.5 + Math.random() * 0.4);
        scan.style.opacity = 0.7;
        scan.style.backgroundPositionY = Math.random() * 6 + "px";
        main.style.opacity = 1 - dim * (0.6 + Math.random() * 0.4);
        if (Math.random() < 0.45) {
          const u = Math.floor(Math.random() * 60),
            b = u + Math.floor(Math.random() * 30);
          main.style.clipPath = `inset(${u}% 0 ${100 - b}% 0)`;
        } else main.style.clipPath = "";
        main.style.transform = `translateX(${s() * amp * 0.3}px)`;
        const id = requestAnimationFrame(step);
        this._gcRafs.add(id);
      };
      const id = requestAnimationFrame(step);
      this._gcRafs.add(id);
    }

    _confirm(action) {
      this.shadowRoot.querySelector(".confirm-overlay")?.remove();
      clearInterval(this._confirmTimer);

      const wrap = this.shadowRoot.querySelector("ha-card") || this.shadowRoot.querySelector(".nas-wrap");
      const isPowerOn = action === "poweron";
      const isShutdown = action === "shutdown";
      const label = isPowerOn ? "Power On" : isShutdown ? "Shutdown" : "Reboot";
      const entityId = isPowerOn
        ? this._config.power_entity || "switch.wol_rackstation"
        : isShutdown
          ? this._config.shutdown_entity || "button.rackstation_shutdown"
          : this._config.reboot_entity || "button.rackstation_reboot";

      let remaining = 5;
      const overlay = document.createElement("div");
      overlay.className = "confirm-overlay";
      overlay.innerHTML = `
      <div class="confirm-msg">
        Confirmer <strong style="color:${isPowerOn ? "var(--nas-ok, #39ff9e)" : "var(--nas-err)"}">${label}</strong> du NAS ?<br>
        <span style="font-size:11px;color:var(--nas-dim);">${entityId}</span>
      </div>
      <div class="confirm-timer" id="ctimer">Annulation auto dans ${remaining}s</div>
      <div class="confirm-btns">
        <button class="btn-cancel">Annuler</button>
        <button class="btn-confirm-ok ${action}">${label}</button>
      </div>
    `;
      wrap.appendChild(overlay);

      this._confirmTimer = setInterval(() => {
        remaining--;
        const t = overlay.querySelector("#ctimer");
        if (t) t.textContent = `Annulation auto dans ${remaining}s`;
        if (remaining <= 0) {
          clearInterval(this._confirmTimer);
          overlay.remove();
        }
      }, 1000);

      overlay.querySelector(".btn-cancel").addEventListener("click", () => {
        clearInterval(this._confirmTimer);
        overlay.remove();
      });
      overlay.querySelector(".btn-confirm-ok").addEventListener("click", () => {
        clearInterval(this._confirmTimer);
        overlay.remove();
        this._callButton(entityId);
        // armer l'état transitoire animé (booting/stopping) pour shutdown/poweron
        if (isPowerOn || isShutdown) {
          this._pending = {
            target: isPowerOn ? "on" : "off", // état attendu du NAS
            deadline: Date.now() + 180000, // timeout 3 min
          };
          // ticker de secours : ré-évalue même si aucune entité ne change
          clearInterval(this._pendingTimer);
          this._pendingTimer = setInterval(() => {
            if (!this._pending) {
              clearInterval(this._pendingTimer);
              return;
            }
            this._update();
          }, 5000);
          this._update();
        }
      });
    }

    _callButton(entityId) {
      if (!this._hass || !entityId) return;
      const domain = entityId.split(".")[0];
      // switch (WOL power-on) → turn_on ; button (shutdown/reboot) → press
      if (domain === "switch") {
        this._hass.callService("switch", "turn_on", { entity_id: entityId });
      } else {
        this._hass.callService("button", "press", { entity_id: entityId });
      }
    }

    // NAS éteint ? source de vérité = switch.wol_rackstation (suit le ping)
    _nasIsOff() {
      const pe = (this._config && this._config.power_entity) || "switch.wol_rackstation";
      const st = this._hass && this._hass.states[pe];
      return !!st && st.state === "off";
    }

    _update() {
      if (!this.shadowRoot || !this._hass) return;
      const c = this._config || {};

      // bouton dynamique shutdown <-> power on (+ état transitoire animé)
      const offNow = this._nasIsOff();
      const sBtn = this.shadowRoot.getElementById("btn-shutdown");
      const sLbl = this.shadowRoot.getElementById("btn-shutdown-label");

      // sortie du mode transitoire : état cible atteint OU timeout dépassé
      if (this._pending) {
        const reached =
          (this._pending.target === "on" && !offNow) || (this._pending.target === "off" && offNow);
        if (reached || Date.now() > this._pending.deadline) {
          this._pending = null;
          clearInterval(this._pendingTimer);
        }
      }

      if (sBtn && sLbl) {
        if (this._pending) {
          // en cours : booting (cible on) ou stopping (cible off)
          const booting = this._pending.target === "on";
          sBtn.classList.add("is-busy");
          sBtn.classList.toggle("busy-on", booting);
          sBtn.classList.toggle("busy-off", !booting);
          sBtn.classList.remove("is-poweron");
          sLbl.textContent = booting ? "Booting…" : "Stopping…";
        } else {
          sBtn.classList.remove("is-busy", "busy-on", "busy-off");
          sBtn.classList.toggle("is-poweron", offNow);
          sLbl.textContent = offNow ? "Power On" : "Shutdown";
        }
      }

      // title (may change via UI editor without full re-render)
      const hdr = c.header && typeof c.header === "object" ? c.header : {};
      const title = hdr.title || c.title || "Rackstation";
      const titleEl = this.shadowRoot.querySelector(".title");
      if (titleEl && titleEl.textContent !== title) titleEl.textContent = title;

      // drives
      this.shadowRoot.querySelectorAll(".drive-led").forEach((el) => {
        const i = +el.dataset.idx;
        el.classList.remove("ok", "warn", "err", "unavail");
        el.classList.add(this._driveStatus(i));
      });

      // v2 : dots de statut (ex-perforations façade gauche)
      this.shadowRoot.querySelectorAll(".nas-dot.stat").forEach((el) => {
        const i = +el.dataset.stat;
        el.classList.remove("stat-ok", "stat-err", "stat-off", "stat-active");
        el.classList.add("stat-" + this._statusDot(i));
      });

      // health
      const h = this._ent(c.health_entity);
      const healthEl = this.shadowRoot.getElementById("health");
      const healthVal = this.shadowRoot.getElementById("healthVal");
      if (h) {
        const v = String(h.v).toLowerCase();
        let cls = "unavail",
          lbl = h.v;
        if (v === "unavailable" || v === "unknown") {
          cls = "unavail";
          lbl = "—";
        } else if (v.includes("normal") || v.includes("ok") || v.includes("healthy")) {
          cls = "ok";
          lbl = "Normal";
        }
        // états RAID SNMP « en cours » → warn (jaune) : scrubbing, resync, rebuild, expand
        else if (v.includes("scrub")) {
          cls = "warn";
          lbl = "Scrubbing";
        } else if (v.includes("rebuild") || v.includes("resync") || v.includes("sync")) {
          cls = "warn";
          lbl = "Rebuild";
        } else if (v.includes("expand") || v.includes("migrat")) {
          cls = "warn";
          lbl = "Expanding";
        } else if (v.includes("degraded")) {
          cls = "warn";
          lbl = "Degraded";
        } else if (v.includes("warn") || v.includes("attention")) {
          cls = "warn";
          lbl = "Warning";
        } else if (v.includes("crash") || v.includes("fail") || v.includes("danger")) {
          cls = "err";
          lbl = "Critical";
        } else {
          cls = "ok";
          lbl = h.v;
        }
        // override if any drive is err
        const anyErr = LED_POS.some((_, i) => this._driveStatus(i) === "err");
        if (anyErr) {
          cls = "err";
          lbl = "Alert";
        }
        healthEl.className = "health " + cls;
        if (healthVal) healthVal.textContent = lbl;
      } else {
        healthEl.className = "health unavail";
        if (healthVal) healthVal.textContent = "—";
      }

      // donut + volume
      const used = this._ent(c.used_entity);
      const total = this._ent(c.total_entity);
      const pctEnt = this._ent(c.used_pct_entity);

      let pct = null;
      if (pctEnt && !isNaN(parseFloat(pctEnt.v))) pct = parseFloat(pctEnt.v);
      else if (used && total) {
        const u = parseFloat(used.v),
          t = parseFloat(total.v);
        if (!isNaN(u) && !isNaN(t) && t > 0) pct = (u / t) * 100;
      }

      const donut = this.shadowRoot.getElementById("donut");
      const pctEl = this.shadowRoot.getElementById("pct");
      if (pct !== null) {
        const p = Math.min(100, Math.max(0, pct));
        donut.style.setProperty("--pct", p);
        // color scale
        let col = CP_ACCENT;
        if (p >= 90) col = CP_ERR;
        else if (p >= 75) col = CP_WARN;
        donut.style.setProperty("--col", col);
        pctEl.textContent = p.toFixed(0) + "%";
      } else {
        donut.style.setProperty("--pct", 0);
        pctEl.textContent = "—";
      }

      this.shadowRoot.getElementById("used").textContent = used
        ? this._fmtBytes(used.v, used.a)
        : "—";
      this.shadowRoot.getElementById("total").textContent = total
        ? this._fmtBytes(total.v, total.a)
        : "—";
      // label volume : si vide dans la config → masqué (pas de fallback hardcodé)
      const volLabelEl = this.shadowRoot.getElementById("volLabel");
      const volLabel =
        c.volume_label != null && String(c.volume_label).trim() !== "" ? c.volume_label : "";
      volLabelEl.textContent = volLabel;
      volLabelEl.style.display = volLabel ? "" : "none";

      // temp
      const t = this._ent(c.temp_entity);
      const tempEl = this.shadowRoot.getElementById("temp");
      const tempVal = this.shadowRoot.getElementById("tempVal");
      tempEl.classList.remove("hot", "warm");
      if (t) {
        const tv = parseFloat(t.v);
        if (!isNaN(tv)) {
          tempVal.textContent = `${tv.toFixed(0)}°${(t.a.unit_of_measurement || "C").replace("°", "")}`;
          if (tv >= 55) tempEl.classList.add("hot");
          else if (tv >= 45) tempEl.classList.add("warm");
        } else tempVal.textContent = t.v;
      } else tempVal.textContent = "—";
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  EDITOR                                                                    *
   * ═══════════════════════════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════════════════
   *  EDITOR — template unifié (cf CARDS-EDITOR-TEMPLATE.md)
   *  N'éditer QUE _schema() ; le reste est canonique et identique partout.
   * ═══════════════════════════════════════════════════════════════════ */
  const NAS_FONTS = [
    'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
    'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
    'DM Sans','Playfair Display','Cinzel',
  ];
  class NeonNasCardEditor extends HTMLElement {
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
        // 'glitch.enabled' doit pouvoir stocker false explicitement (sinon retombe sur le défaut activé)
        if (empty && !(parts[0] === 'glitch' && last === 'enabled' && value === false)) delete o[last];
        else o[last] = value;
        const parent = parts.slice(0, -1).reduce((a, k) => a && a[k], this._config);
        if (parent && typeof parent === 'object' && !Object.keys(parent).length) delete this._config[parts[0]];
      } else if (empty) { delete this._config[key]; }
      else { this._config[key] = value; }
      this.dispatchEvent(new CustomEvent('config-changed',
        { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
    }

    // Tableaux à index fixe : drives[i] (clé "drives.3") et drive_alerts[i][j] (clé "drive_alerts.3.0")
    _setArr(arrKey, i, value) {
      const arr = [...(this._config[arrKey] || [])];
      arr[i] = value || '';
      this._config[arrKey] = arr;
      this.dispatchEvent(new CustomEvent('config-changed',
        { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
    }
    _setAlert(driveIdx, alertIdx, value) {
      const arr = (this._config.drive_alerts || []).map((x) => [...(x || [])]);
      while (arr.length <= driveIdx) arr.push([]);
      arr[driveIdx][alertIdx] = value || '';
      this._config.drive_alerts = arr;
      this.dispatchEvent(new CustomEvent('config-changed',
        { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
    }

    // ── Sync in-place (guard focus + clés imbriquées) ──────────────────
    _syncValues() {
      const active = this.querySelector(':focus') || document.activeElement;
      this.querySelectorAll('[data-key]').forEach(el => {
        if (el === active) return;
        const key = el.dataset.key;
        let v = this._read(key);
        if (key === 'glitch.enabled' && v === undefined) v = true;   // défaut activé
        if (el.type === 'checkbox') el.checked = el.dataset.defaultOn ? (v !== false) : !!v;
        else {
          el.value = (v == null ? '' : v);
          if (el._pick) el._pick.value = this._toHex(el.value) || (el._cssDefault ? this._resolveColor(el._cssDefault) : null) || '#6200EA';
        }
      });
      const drives = this._config.drives || [];
      this.querySelectorAll('[data-didx]:not([data-aidx])').forEach(el => {
        if (el === active) return;
        el.value = drives[+el.dataset.didx] || '';
      });
      const alerts = this._config.drive_alerts || [];
      this.querySelectorAll('[data-aidx]').forEach(el => {
        if (el === active) return;
        el.value = (alerts[+el.dataset.didx] || [])[+el.dataset.aidx] || '';
      });
      this._bindIconPreviews(true);
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
      let v = this._read(key);
      if (key === 'glitch.enabled' && v === undefined) v = true;
      cb.checked = defaultOn ? (v !== false) : !!v;
      cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
      cb.addEventListener('change', () => this._set(key, cb.checked));
      row.wrap.appendChild(cb); return cb;
    }

    _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
      const row = this._row(label);
      const box = document.createElement('div'); box.className = 'color-row';
      const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key;
      txt.value = this._read(key) ?? '';
      const pick = document.createElement('input'); pick.type = 'color';
      txt._pick = pick; txt._cssDefault = cssDefault;
      const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA'; };
      txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
      pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
      box.appendChild(txt); box.appendChild(pick); row.wrap.appendChild(box); refresh(); return txt;
    }

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

    _icon(key, label) {
      const row = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true);
      const box = document.createElement('div'); box.className = 'icon-row';
      const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key;
      inp.value = this._read(key) ?? '';
      const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
      inp.addEventListener('input', () => this._set(key, inp.value));
      box.appendChild(inp); box.appendChild(prev); row.wrap.appendChild(box); return inp;
    }

    _entity(key, label, prefix = '') {
      const row = this._row(label);
      const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
      inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
      inp.setAttribute('list', `nas-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
      inp.value = this._read(key) ?? '';
      inp.addEventListener('input', () => this._set(key, inp.value.trim()));
      row.wrap.appendChild(inp); return inp;
    }

    // Entité de tableau à index fixe (drives[i]) : même esprit que _entity mais data-didx.
    _driveEntity(i) {
      const row = this._row(`Drive ${i + 1} — ${i < 4 ? 'RX410 top' : 'RS bottom'} · bay ${(i % 4) + 1}`);
      const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
      inp.placeholder = 'sensor.rackstation_drive_X_etat'; inp.dataset.didx = i;
      inp.dataset.prefix = 'sensor.'; inp.setAttribute('list', 'nas-ent-sensor');
      inp.value = (this._config.drives || [])[i] || '';
      inp.addEventListener('input', () => this._setArr('drives', i, inp.value.trim()));
      row.wrap.appendChild(inp); return inp;
    }
    _driveAlert(i, aidx, label) {
      const row = this._row(label);
      const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
      inp.placeholder = 'binary_sensor...'; inp.dataset.didx = i; inp.dataset.aidx = aidx;
      inp.dataset.prefix = 'binary_sensor.'; inp.setAttribute('list', 'nas-ent-binarysensor');
      inp.value = ((this._config.drive_alerts || [])[i] || [])[aidx] || '';
      inp.addEventListener('input', () => this._setAlert(i, aidx, inp.value.trim()));
      row.wrap.appendChild(inp); return inp;
    }

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
      row.appendChild(lbl); row.appendChild(wrap);
      (this._appendTo || this).appendChild(row);
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
        if (dl.childElementCount === ids.length) return;
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
        .drive-block { border:1px dashed var(--divider-color);border-radius:8px;padding:8px 10px 2px;margin-bottom:8px; }
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
      this._section('Général');
      this._text('header.title', 'Titre', 'Rackstation');
      this._icon('header.icon', 'Icône (mdi)');
      this._color('header.color', 'Couleur titre', 'var(--primary-color)');
      this._text('header.title_size', 'Taille titre', '13px');
      this._select('header.font', 'Police', NAS_FONTS, '— thème HA —');
      this._text('header.title_shadow', 'Text-shadow', '0 0 6px ...');
      this._text('volume_label', 'Label volume (footer)', 'Volume 1');

      this._section('Capteurs principaux');
      this._entity('health_entity', 'Health / État volume', 'sensor');
      this._entity('temp_entity', 'Température NAS', 'sensor');
      this._entity('total_entity', 'Taille totale', 'sensor');
      this._entity('used_entity', 'Espace utilisé', 'sensor');
      this._entity('used_pct_entity', '% utilisé (optionnel)', 'sensor');

      this._section('Boutons');
      this._entity('reboot_entity', 'Reboot', 'button');
      this._entity('shutdown_entity', 'Shutdown', 'button');

      this._section('Disques (RX410 en haut · RS en bas)');
      for (let i = 0; i < 8; i++) {
        const d = document.createElement('div'); d.className = 'drive-block'; this.appendChild(d);
        this._appendTo = d;
        this._driveEntity(i);
        this._driveAlert(i, 0, 'Alerte 1 (secteurs défectueux)');
        this._driveAlert(i, 1, 'Alerte 2 (durée de vie)');
        this._appendTo = null;
      }

      this._section('Apparence');
      this._toggle('card_mod_bg', 'Hériter du fond card-mod', true);
      this._color('color_accent', 'Accent', CP_ACCENT);
      this._color('led_ok_color', 'LED OK (clignotant)', CP_OK);
      this._color('color_bg', 'Fond (si pas card-mod)', CP_BG);

      this._section('🐱 GLITCH le chat');
      this._toggle('glitch.enabled', 'Activer la balade', true);
      this._text('glitch.src', 'Image (GIF)', GLITCH.src);
      this._number('glitch.size', 'Taille (px)', { min: 8, max: 80, step: 1, ph: String(GLITCH.size) });
      this._number('glitch.top', 'Hauteur / arête (px)', { min: -30, max: 40, step: 1, ph: String(GLITCH.top) });
      this._number('glitch.speed', 'Vitesse (s / traversée)', { min: 2, max: 30, step: 0.5, ph: String(GLITCH.speed) });
      this._number('glitch.gap', 'Pause entre balades (s)', { min: 0, max: 120, step: 1, ph: String(GLITCH.gap) });
      this._number('glitch.prob', `Proba Silverhand (0–1) — défaut ${GLITCH.prob}`, { min: 0, max: 1, step: 0.01, ph: String(GLITCH.prob) });
      this._section('Effet Silverhand');
      this._number('glitch.sat', 'Saturation', { min: 1, max: 30, step: 1, ph: String(GLITCH.sat) });
      this._number('glitch.op', 'Opacité calques (0–1)', { min: 0, max: 1, step: 0.05, ph: String(GLITCH.op) });
      this._number('glitch.amp', 'Décalage RGB (px)', { min: 1, max: 20, step: 1, ph: String(GLITCH.amp) });
      this._number('glitch.dim', 'Baisse du blanc (0–1)', { min: 0, max: 1, step: 0.05, ph: String(GLITCH.dim) });
      this._number('glitch.dur', 'Durée du glitch (ms)', { min: 300, max: 4000, step: 100, ph: String(GLITCH.dur) });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ *
   *  REGISTER                                                                  *
   * ═══════════════════════════════════════════════════════════════════════════ */

  if (!customElements.get("neon-nas-card-v2"))
    customElements.define("neon-nas-card-v2", NeonNasCard);
  if (!customElements.get("neon-nas-card-v2-editor"))
    customElements.define("neon-nas-card-v2-editor", NeonNasCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "neon-nas-card-v2",
    name: "Neon NAS Card v2",
    description: "Synology Rackstation — disques en hdd-flicker + 8 dots de statut SNMP (façade)",
    preview: true,
  });

  console.info(
    "%c NEON-NAS-CARD %c v2.1 ",
    "background:#00fff9;color:#040614;font-weight:700;",
    "background:#B400FF;color:#fff;"
  );
})();

console.info(
  "%c 🖥️ neon-nas-card v2.1 %c Neo Tokyo ",
  "background:#FF6A00;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;",
  "background:#040811;color:#FFD700;padding:2px 4px;border-radius:0 3px 3px 0;"
);
