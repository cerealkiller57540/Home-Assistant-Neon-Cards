class OnkyoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._clickHandler = null;
    this._lastRenderKey = null;
    this._fontsInjected = false;
  }

  setConfig(config) {
    if (!config.entity) throw new Error("entity requis");
    this.config = config;
    // Config change → force re-render (colors may differ)
    this._lastRenderKey = null;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  /* ── Inject Google Fonts once into <head> (never inside shadowRoot innerHTML) ── */
  _ensureFonts() {
    if (this._fontsInjected) return;
    const id = 'onkyo-card-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id   = id;
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    this._fontsInjected = true;
  }

  _render() {
    const entity = this._hass.states[this.config.entity];
    if (!entity) {
      this.shadowRoot.innerHTML = `<div style="padding:12px;color:red">Entité introuvable : ${this.config.entity}</div>`;
      this._lastRenderKey = null;
      return;
    }

    const attr    = entity.attributes;
    const isOn    = entity.state === "on";
    const isMuted = attr.is_volume_muted;
    const vol     = Math.round((attr.volume_level ?? 0) * 100);
    const source  = (attr.source || "—").toUpperCase();
    const name    = (attr.friendly_name || this.config.entity).toUpperCase();

    const audio = attr.audio_information || {};
    const video = attr.video_information || {};

    const listenMode  = (audio.listening_mode      || "—").toUpperCase();
    const hasDolby    = listenMode.includes("DOLBY");
    const hasDTS      = listenMode.includes("DTS");
    const inSignal    = (audio.input_signal_format  || "—").toUpperCase();
    const inFreq      = (audio.input_frequency      || "—").toUpperCase();
    const inCh        = (audio.input_channels       || "—").toUpperCase();
    const outCh       = (audio.output_channels      || "—").toUpperCase();
    const audioPortRaw = (audio.audio_input_port || "").toUpperCase();
    const videoPortRaw = (video.video_input_port || "").toUpperCase();
    const VIDEO_INVALID = new Set(["", "UNKNOWN", "NO VIDEO", "NO INPUT"]);
    // vidéo prioritaire sur audio (HDMI etc.) — fallback audio si vidéo absente/invalide
    const audioPort = !VIDEO_INVALID.has(videoPortRaw)
      ? videoPortRaw
      : (audioPortRaw && audioPortRaw !== "UNKNOWN") ? audioPortRaw : "—";
    const inRes       = (video.input_resolution || "—").replace(/\(.*?\)/g,"").trim().toUpperCase();

    const volDisplay = isMuted ? "MUTE" : vol;

    /* configurable colors */
    /* configurable colors */
    const pri          = this.config.color_primary      || "#00d4ff";
    const acc          = this.config.color_accent       || "#5D0CED";
    const thBg         = this.config.theme_background   === true;
    const imageUrl     = this.config.image_url          || "";
    const showTexture  = this.config.show_chassis_texture !== false; // true by default

    /* ── Diff: skip full re-render if nothing visible changed ── */
    const renderKey = `${entity.state}|${vol}|${isMuted}|${source}|${listenMode}|${inSignal}|${inFreq}|${inCh}|${outCh}|${audioPort}|${inRes}|${pri}|${acc}|${thBg}|${imageUrl}|${hasDolby}|${hasDTS}|${showTexture}`;
    if (renderKey === this._lastRenderKey && this.shadowRoot.querySelector('ha-card')) {
      return; // Nothing changed — skip DOM rebuild entirely
    }
    this._lastRenderKey = renderKey;

    this._ensureFonts();

    /* volume arc math — r=20 → circonférence ≈ 125.66 ; anneau plein = 360°, départ midi, sens horaire */
    const arcCirc = 125.66;
    const arcFill = isOn && !isMuted ? +(vol / 100 * arcCirc).toFixed(1) : 0;

    /* input selector — knob rotatif à crans : pointe la source active sur un balayage de 270° (7h30 → 4h30) */
    const srcList   = Array.isArray(attr.source_list) ? attr.source_list : [];
    const srcIdx    = Math.max(0, srcList.indexOf(attr.source));
    const srcCount  = Math.max(1, srcList.length);
    const SEL_SWEEP = 270;                                  // amplitude du cadran
    const selFrac   = srcCount > 1 ? srcIdx / (srcCount - 1) : 0;
    // -135° = 7h30 (premier cran), +135° = 4h30 (dernier cran) ; OFF → centré midi (0°)
    const inputAngle = isOn ? Math.round(-SEL_SWEEP / 2 + selFrac * SEL_SWEEP) : 0;
    // ticks (un cran par source) + aiguille SVG — viewBox fixe (0..44), centre (22,22), 0 = midi
    const SEL_CX = 22, SEL_CY = 22;
    const polar = (ang, r) => [SEL_CX + r * Math.sin(ang), SEL_CY - r * Math.cos(ang)];
    let inputTicks = "";
    for (let i = 0; i < srcCount; i++) {
      const f = srcCount > 1 ? i / (srcCount - 1) : 0.5;
      const ang = (-SEL_SWEEP / 2 + f * SEL_SWEEP) * Math.PI / 180;
      const [sx, sy] = polar(ang, 17), [ex, ey] = polar(ang, 19.5);
      const on = isOn && i === srcIdx;
      inputTicks += `<line x1="${sx.toFixed(2)}" y1="${sy.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" `
        + `stroke="${on ? acc : 'rgba(93,12,237,0.18)'}" stroke-width="${on ? 1.4 : 1}" stroke-linecap="round"`
        + `${on ? ` style="filter:drop-shadow(0 0 2px ${acc})"` : ''}/>`;
    }
    // aiguille : pointe le cran actif (ou midi si OFF), du centre vers le bord
    const needleAng = inputAngle * Math.PI / 180;
    const [nx, ny] = polar(needleAng, 14);
    const inputNeedle = `<line x1="${SEL_CX}" y1="${SEL_CY}" x2="${nx.toFixed(2)}" y2="${ny.toFixed(2)}" `
      + `stroke="${isOn ? acc : 'rgba(93,12,237,0.25)'}" stroke-width="${isOn ? 1.6 : 1.2}" stroke-linecap="round"`
      + `${isOn ? ` style="filter:drop-shadow(0 0 3px ${acc});transition:all .4s cubic-bezier(.4,1.3,.5,1)"` : ''}/>`;

    /* volume bar segments */
    const segs = 32;
    let volBarHTML = "";
    for (let i = 0; i < segs; i++) {
      const pct = (i / segs) * 100;
      const cls = pct < vol ? (pct > 80 ? "vseg hot" : "vseg on") : "vseg";
      volBarHTML += `<div class="${cls}"></div>`;
    }

    /* ── Remove old click handler before clobbering DOM ── */
    if (this._clickHandler && this.shadowRoot.querySelector('ha-card')) {
      this.shadowRoot.querySelector('ha-card').removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
    }

    this.shadowRoot.innerHTML = `
<style>
  :host {
    --onkyo-primary: ${pri};
    --onkyo-accent: ${acc};
    display: block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  :host ha-card {
    background: transparent !important;
    box-shadow: none !important;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 14px);
    cursor: pointer;
  }

  /* ═══ FACEPLATE ═══ */
  :host .fp {
    position: relative;
    overflow: hidden;
    padding: 10px 14px 8px;
    display: flex; flex-direction: column; gap: 6px;
    border-radius: var(--ha-card-border-radius, 14px);
  }
  :host .fp.fp-metal {
    background:
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.012) 1px, rgba(255,255,255,0.012) 2px),
      linear-gradient(180deg, #2c2e36, #22242c 45%, #2c2e36);
  }
  :host .fp.fp-theme {
    background: var(--ha-card-background, var(--card-background-color));
    -webkit-backdrop-filter: var(--ha-card-backdrop-filter);
    backdrop-filter: var(--ha-card-backdrop-filter);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color));
    box-shadow: var(--ha-card-box-shadow);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  :host .fp.fp-theme:hover {
    border-color: var(--state-active-color, var(--ha-card-border-color));
    filter: brightness(1.08);
  }
  :host .fp.fp-metal::before {
    content: ''; position: absolute; inset: 0; border-radius: var(--ha-card-border-radius, 14px);
    pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3);
  }
  :host .chrome {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 15%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 85%, transparent);
  }

  /* ── Top bar ── */
  :host .top-bar {
    display: flex; justify-content: space-between; align-items: center; padding: 0 2px;
  }
  :host .pwr {
    width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.07);
    background: radial-gradient(circle at 42% 38%, #2a2c34, #16181e);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
  }
  :host .led {
    width: 5px; height: 5px; border-radius: 50%;
    background: ${isOn ? "#22c55e" : "#7f1d1d"};
    box-shadow: ${isOn ? "0 0 6px #22c55e80, 0 0 2px #22c55e" : "0 0 4px #ef444430"};
    animation: ${isOn ? "onkyo-led 8s step-end infinite" : "onkyo-standby-led 3s ease-in-out infinite"};
  }
  :host .brand {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(7px, 1.8vw, 9px); font-weight: 600;
    color: rgba(255,255,255,0.2);
    letter-spacing: clamp(1.5px, 0.8vw, 3.5px); text-transform: uppercase;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50%;
  }
  :host .logo { width: clamp(28px, 8vw, 40px); opacity: 0.14; animation: onkyo-logo-flk 23s step-end infinite; }
  :host .logo path { fill: #c0c8d8; }

  /* ── Main row ── */
  :host .main { display: flex; align-items: center; gap: 10px; }

  /* ── Knobs ── */
  :host .kwrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; gap: 2px; }
  :host .knob {
    width: clamp(28px, 8vw, 38px); height: clamp(28px, 8vw, 38px); border-radius: 50%; position: relative;
    background: radial-gradient(circle at 50% 50%, #12131a, #050608);
    border: 1px solid rgba(255,255,255,0.03);
    box-shadow: inset 0 1px 3px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.6);
  }
  :host .knob::after {
    content: ''; position: absolute; top: 4px; left: 50%; transform: translateX(-50%);
    width: 2px; height: 6px;
    background: var(--onkyo-accent);
    box-shadow: 0 0 4px var(--onkyo-accent);
    border-radius: 1px;
  }
  /* knob INPUT : aiguille rendue dans le SVG → pas de trait ::after fixe */
  :host .knob-input::after { display: none; }
  :host .knob-input.on { border-color: rgba(93,12,237,0.18); }
  :host .klbl {
    font-family: 'Rajdhani', sans-serif;
    font-size: 6.5px; color: rgba(255,255,255,0.15);
    letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  }
  :host .ksvg {
    position: absolute; inset: -2px; width: calc(100% + 4px); height: calc(100% + 4px);
  }

  /* ═══ LCD PANEL ═══ */
  :host .lcd {
    flex: 1; position: relative; min-height: 120px;
    background: #020304; border-radius: 4px;
    padding: 10px 14px;
    border: 1px solid #1a1e26;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.9), inset 0 0 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03);
    font-family: 'VT323', 'Share Tech Mono', monospace;
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: opacity 0.8s ease;
  }
  :host .lcd.lcd-off {
    opacity: 0.45;
  }
  /* image fond LCD */
  :host .lcd-img {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-size: cover; background-position: center; border-radius: 4px;
    transition: opacity 1s ease;
    opacity: ${imageUrl ? (isOn ? 0.12 : 0.04) : 0};
    ${imageUrl ? `background-image: url('${imageUrl}');` : ""}
  }
  :host .lcd::before {
    content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: radial-gradient(circle, rgba(0,200,210,0.09) 0.8px, transparent 0.8px);
    background-size: 2.5px 2.5px;
    animation: onkyo-lcd-matrix 20s ease-in-out infinite;
  }
  :host .lcd::after {
    content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px);
  }
  :host .lcd > * { position: relative; z-index: 3; }

  :host .glow {
    position: absolute; inset: -1px; border-radius: 5px; pointer-events: none; z-index: 0;
    border: 1px solid rgba(0,212,255,0.12);
    animation: onkyo-glitch 9s step-end infinite;
  }
  :host .kanji {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 26px;
    font-family: serif;
    pointer-events: none;
    z-index: 0;
    line-height: 1;
    color: color-mix(in srgb, var(--onkyo-accent) 18%, transparent);
    text-shadow: 0 0 6px color-mix(in srgb, var(--onkyo-accent) 35%, transparent),
                 0 0 16px color-mix(in srgb, var(--onkyo-accent) 12%, transparent);
    animation: onkyo-flk-name 14s step-end infinite;
  }
  :host .r1 {
    display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;
  }
  :host .src {
    font-size: clamp(18px, 5.5vw, 32px); color: var(--onkyo-primary); letter-spacing: clamp(1px, 1vw, 4px); line-height: 1;
    flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    text-shadow: 0 0 12px color-mix(in srgb, var(--onkyo-primary) 40%, transparent);
    animation: onkyo-flk-name 17s step-end infinite;
  }
  :host .vol {
    font-size: clamp(15px, 4.5vw, 24px); color: var(--onkyo-primary); letter-spacing: 2px; white-space: nowrap; font-weight: 700; flex-shrink: 0;
    text-shadow: 0 0 10px color-mix(in srgb, var(--onkyo-primary) 35%, transparent);
  }
  :host .vol-lbl { font-size: clamp(10px, 2.5vw, 14px); opacity: 0.35; margin-right: 2px; font-weight: 400; }
  :host .mode {
    font-size: clamp(11px, 3.2vw, 17px); color: var(--onkyo-accent); letter-spacing: clamp(1px, 0.7vw, 2.5px);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    text-shadow: 0 0 10px color-mix(in srgb, var(--onkyo-accent) 45%, transparent),
                 0 0 3px color-mix(in srgb, var(--onkyo-accent) 60%, transparent);
    margin-top: 1px;
  }
  :host .vbar { display: flex; gap: 1.5px; margin-top: 6px; height: 5px; }
  :host .vseg { flex: 1; background: rgba(255,255,255,0.03); border-radius: 0.5px; }
  :host .vseg.on {
    background: var(--onkyo-primary);
    box-shadow: 0 0 3px color-mix(in srgb, var(--onkyo-primary) 50%, transparent);
  }
  :host .vseg.hot {
    background: var(--onkyo-accent);
    box-shadow: 0 0 5px color-mix(in srgb, var(--onkyo-accent) 60%, transparent);
  }
  :host .ch {
    text-align: center; font-size: clamp(10px, 2.8vw, 16px); color: var(--onkyo-primary);
    text-shadow: 0 0 6px color-mix(in srgb, var(--onkyo-primary) 25%, transparent);
    letter-spacing: clamp(1px, 0.8vw, 3px); margin-top: 5px;
    white-space: nowrap; overflow: hidden;
  }
  :host .ch-arr {
    color: var(--onkyo-accent);
    text-shadow: 0 0 6px color-mix(in srgb, var(--onkyo-accent) 40%, transparent);
    font-weight: 700; animation: onkyo-arrow 2.5s ease-in-out infinite;
  }
  :host .ldiv {
    height: 1px; margin: 6px 0 5px;
    background: linear-gradient(90deg,
      transparent,
      color-mix(in srgb, var(--onkyo-primary) 12%, transparent) 15%,
      color-mix(in srgb, var(--onkyo-accent) 14%, transparent) 50%,
      color-mix(in srgb, var(--onkyo-primary) 12%, transparent) 85%,
      transparent);
  }
  :host .specs { display: flex; justify-content: space-between; gap: 4px; }
  :host .sp {
    display: flex; flex-direction: column; min-width: 0; overflow: hidden;
    background: rgba(255, 255, 255, 0.01);
    padding: 4px 6px;
    border-radius: 3px;
    border-left: 2px solid color-mix(in srgb, var(--onkyo-primary) 30%, transparent);
  }
  :host .sk {
    font-size: clamp(7px, 1.8vw, 9px); color: var(--onkyo-primary); opacity: 0.3;
    letter-spacing: 1px; line-height: 1.2; white-space: nowrap;
  }
  :host .sv {
    font-size: clamp(9px, 2.5vw, 14px); color: var(--onkyo-primary); letter-spacing: 0.5px; line-height: 1.3;
    text-shadow: 0 0 4px color-mix(in srgb, var(--onkyo-primary) 20%, transparent);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  /* ── Format logos ── */
  :host .fmt-logos {
    display: flex; gap: 6px; align-items: center; margin-bottom: 2px;
  }
  :host .fmt-logo {
    display: flex; align-items: center;
    opacity: 0.07;
    transition: opacity 0.4s ease, filter 0.4s ease;
  }
  :host .fmt-logo.active-dolby {
    opacity: 0.9;
    filter: drop-shadow(0 0 3px rgba(220,40,40,0.6));
  }
  :host .fmt-logo.active-dts {
    opacity: 0.9;
    filter: drop-shadow(0 0 3px color-mix(in srgb, var(--onkyo-primary) 70%, transparent));
  }
  :host .fmt-logo svg { display: block; }

  :host .bstrip {
    display: flex; justify-content: center; gap: 16px; padding: 0 2px;
  }
  :host .fn {
    font-family: 'Rajdhani', sans-serif;
    font-size: 6.5px; color: rgba(255,255,255,0.09);
    letter-spacing: 2px; font-weight: 600; text-transform: uppercase;
  }

  /* ── Chassis texture : fond sombre style HMC ── */
  :host .fp.fp-chassis {
    background:
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.009) 1px, rgba(255,255,255,0.009) 2px),
      linear-gradient(180deg, #1e1e2e 0%, #14141f 12%, #0b0b12 88%, #060609 100%);
  }
  :host .fp.fp-chassis::before {
    content: ''; position: absolute; inset: 0; border-radius: var(--ha-card-border-radius, 14px);
    pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5);
  }

  /* glow atténué OFF */
  :host .lcd.lcd-off .glow {
    border-color: rgba(100,20,20,0.15);
    box-shadow: none;
    animation: none;
  }
  :host .lcd.lcd-off .src,
  :host .lcd.lcd-off .vol,
  :host .lcd.lcd-off .mode,
  :host .lcd.lcd-off .ch,
  :host .lcd.lcd-off .vbar,
  :host .lcd.lcd-off .ldiv,
  :host .lcd.lcd-off .specs,
  :host .lcd.lcd-off .fmt-logos {
    opacity: 0;
  }

  /* scanlines renforcées OFF */
  :host .lcd.lcd-off::after {
    background: repeating-linear-gradient(0deg, transparent, transparent 1.5px, rgba(0,0,0,0.22) 1.5px, rgba(0,0,0,0.22) 3px);
  }
  /* STANDBY overlay */
  :host .standby {
    position: absolute; inset: 0; z-index: 5; display: flex; align-items: center; justify-content: center;
    font-family: 'VT323', monospace;
    font-size: clamp(20px, 6vw, 36px);
    color: rgba(180,30,30,0.7);
    letter-spacing: clamp(4px, 2vw, 10px);
    text-shadow: 0 0 12px rgba(220,40,40,0.4), 0 0 3px rgba(200,30,30,0.6);
    animation: onkyo-standby-pulse 4s ease-in-out infinite;
    pointer-events: none;
  }

  /* ═══ ANIMATIONS ═══ */
  @keyframes onkyo-standby-led {
    0%,100% { opacity: 0.25; box-shadow: 0 0 2px #ef444420; }
    50%      { opacity: 1;    box-shadow: 0 0 6px #ef444460, 0 0 2px #ef4444; }
  }
  @keyframes onkyo-standby-pulse {
    0%,100% { opacity: 0.3; text-shadow: 0 0 8px rgba(220,40,40,0.2); }
    50%     { opacity: 0.75; text-shadow: 0 0 16px rgba(220,40,40,0.5), 0 0 4px rgba(200,30,30,0.7); }
  }
  @keyframes onkyo-led {
    0%,39%,41%,100% { opacity:1; } 40% { opacity:0.1; } 69% { opacity:0.6; } 70% { opacity:1; }
  }
  @keyframes onkyo-logo-flk {
    0%,30%,100% { opacity:.14; } 31% { opacity:.04; } 32% { opacity:.14; } 70% { opacity:.09; } 71% { opacity:.14; }
  }
  @keyframes onkyo-glitch {
    0%,44%,100% { border-color: rgba(0,212,255,0.1); box-shadow: 0 0 3px rgba(0,212,255,0.08); }
    45% { border-color: rgba(93,12,237,0.6); box-shadow: 0 0 8px rgba(93,12,237,0.4); }
    46% { border-color: rgba(0,212,255,0.06); box-shadow: none; }
    47%,67% { border-color: rgba(93,12,237,0.35); box-shadow: 0 0 5px rgba(93,12,237,0.25); }
    68% { border-color: rgba(255,16,240,0.55); box-shadow: 0 0 8px rgba(255,16,240,0.35); }
    69% { border-color: rgba(0,212,255,0.15); box-shadow: 0 0 3px rgba(0,212,255,0.15); }
    83% { border-color: rgba(0,212,255,0.3); box-shadow: 0 0 6px rgba(0,212,255,0.2); }
    84% { border-color: rgba(0,212,255,0.1); box-shadow: 0 0 3px rgba(0,212,255,0.08); }
  }
  @keyframes onkyo-flk-name {
    0%,18%,20%,22%,79%,100% { opacity:1; } 19%,21% { opacity:0.4; } 80% { opacity:0.8; } 81% { opacity:1; }
  }
  @keyframes onkyo-arc-breathe {
    0%,100% { stroke-opacity:.9; } 50% { stroke-opacity:.4; }
  }
  @keyframes onkyo-arrow {
    0%,100% { opacity:0.55; } 50% { opacity:1; }
  }
  @keyframes onkyo-lcd-matrix {
    0%        { background-size: 2.5px 2.5px;  background-position: 0 0; }
    28%       { background-size: 2.5px 2.5px;  background-position: 0 0; }
    29%       { background-size: 2.5px 2.5px;  background-position: 0.5px 0.3px; }
    30%       { background-size: 2.5px 2.5px;  background-position: 0 0; }
    31%       { background-size: 2.5px 2.5px;  background-position: -0.3px 0.4px; }
    32%       { background-size: 2.5px 2.5px;  background-position: 0 0; }
    60%       { background-size: 2.62px 2.62px; background-position: 0 0; }
    74%       { background-size: 2.68px 2.68px; background-position: 0.2px 0.1px; }
    75%       { background-size: 2.68px 2.68px; background-position: 0 0; }
    100%      { background-size: 2.5px 2.5px;  background-position: 0 0; }
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 480px) {
    :host .fp     { padding: 8px 10px 6px; gap: 4px; }
    :host .main   { gap: 6px; }
    :host .lcd    { padding: 8px 10px; min-height: 90px; }
    :host .specs  { gap: 2px; }
    :host .vbar   { margin-top: 4px; }
    :host .bstrip { gap: 10px; }
    :host .fn     { font-size: 6px; letter-spacing: 1px; }
  }
</style>

<ha-card>
  <div class="fp ${thBg ? 'fp-theme' : (showTexture ? 'fp-chassis' : 'fp-metal')}">
    <div class="chrome"></div>

    <div class="top-bar">
      <div class="pwr"><div class="led"></div></div>
      <span class="brand">${name}</span>
      <svg class="logo" viewBox="0 0 399 56" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-1203.8 -798.98)"><g transform="matrix(1.25 0 0 -1.25 1037.7 1376.2)"><g transform="scale(.1)">
          <path d="m1951.8 4594h202.72l270.46-239.66v129.05c0 20.36-16.51 36.87-36.88 36.87h-49.16v73.74h258.03v-73.74h-49.09c-20.37 0-36.87-16.51-36.87-36.87v-294.97h-79.89l-294.97 258.1v-147.33c0-20.37 16.51-36.72 36.87-36.72h55.31v-74.05h-276.53v73.74h55.24c20.36 0 36.87 16.51 36.87 36.88l0.03 184.35c0 20.36-16.47 36.87-36.84 36.87h-55.3v73.74"/>
          <path d="m2830.5 4409.6-0.01 73.74c0 20.36 16.51 36.87 36.87 36.87h31.96v73.74h-283.9v-73.74h43.01c20.36 0 36.87-16.51 36.87-36.87v-184.35c0-20.37-16.51-36.88-36.87-36.88h-43.01v-73.74h283.9v73.74h-31.96c-20.36 0-36.87 16.51-36.87 36.88v18.43l98.33 55.31 66.32-86.87c1.92-2.49 3.06-5.61 3.06-9 0-8.14-6.61-14.75-14.75-14.75h-42.34v-73.74h301.11v73.74h-30.27c-23.97 0-45.28 11.45-58.74 29.17l-113.85 149.14 123.76 70.57c10.58 5.87 22.77 9.22 35.74 9.22h24.93v73.74h-282.68v-73.74h28.61c8.15 0 14.75-6.6 14.75-14.75 0-4.51-2.02-8.54-5.2-11.24l-148.77-84.62"/>
          <path d="m3858 4520.2v73.74h-228.67v-73.74h25.95c8.15 0 14.75-6.6 14.75-14.75 0-3.81-1.44-7.28-3.82-9.9l-85.98-85.96-85.58 85.51c-2.61 2.67-4.24 6.32-4.24 10.35 0 8.15 6.61 14.75 14.75 14.75h50.43v73.74h-307.56v-73.74h18.99c20.36 0 38.79-8.25 52.14-21.6l162.75-162.78 0.03-36.84c0-20.37-16.51-36.88-36.87-36.88h-49.19v-73.74h307.19v73.74h-49.09c-20.37 0-36.87 16.51-36.87 36.88v36.81l163.02 162.9c13.34 13.3 31.73 21.51 52.05 21.51h25.82"/>
          <path d="m1490.9 4391.2c0 81.45 66.03 147.49 147.48 147.49 81.46 0 147.49-66.04 147.49-147.49s-66.03-147.48-147.49-147.48c-81.45 0-147.48 66.03-147.48 147.48zm147.48 221.23c-49.56 0-97.84-5.13-144.5-14.92-94.46-21.14-164.98-105.47-164.98-206.31 0-100.77 70.5-185.03 164.87-206.23 46.64-9.78 94.97-14.88 144.52-14.88 49.57 0 97.85 5.13 144.5 14.92 94.46 21.14 164.98 105.47 164.98 206.3 0 100.77-70.49 185.04-164.86 206.24-46.64 9.78-94.98 14.88-144.53 14.88"/>
          <path d="m3998.1 4391.2c0 81.45 66.03 147.49 147.48 147.49s147.48-66.04 147.48-147.49-66.03-147.48-147.48-147.48-147.48 66.03-147.48 147.48zm147.48 221.23c-49.56 0-97.85-5.13-144.5-14.92-94.46-21.14-164.98-105.47-164.98-206.31 0-100.77 70.49-185.03 164.86-206.23 46.64-9.78 94.98-14.88 144.53-14.88 49.56 0 97.85 5.13 144.5 14.92 94.46 21.14 164.98 105.47 164.98 206.3 0 100.77-70.49 185.04-164.86 206.24-46.65 9.78-94.98 14.88-144.53 14.88"/>
        </g></g></g>
      </svg>
    </div>

    <div class="main">
      <div class="kwrap">
        <div class="knob">
          <svg class="ksvg" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(0,212,255,0.06)" stroke-width="2"
              transform="rotate(-90 22 22)"/>
            <circle cx="22" cy="22" r="20" fill="none" stroke="${pri}" stroke-width="2"
              stroke-dasharray="${arcFill} ${(arcCirc - arcFill).toFixed(2)}" stroke-dashoffset="0" stroke-linecap="round"
              transform="rotate(-90 22 22)"
              style="filter:drop-shadow(0 0 3px ${pri}40); animation:onkyo-arc-breathe 3s ease-in-out infinite;"/>
          </svg>
        </div>
        <span class="klbl">VOL</span>
      </div>

      <div class="lcd${isOn ? "" : " lcd-off"}">
        <div class="lcd-img"></div>
        <div class="glow"></div>
        <div class="kanji">音響</div>
        ${!isOn ? '<div class="standby">STANDBY</div>' : ""}

        <div class="fmt-logos">
          <div class="fmt-logo${hasDolby && isOn ? ' active-dolby' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
              <path fill="${hasDolby && isOn ? '#e02020' : '#c0c8d8'}" d="M2,5V19H22V5H2M6,17H4V7H6C8.86,7.09 11.1,9.33 11,12C11.1,14.67 8.86,16.91 6,17M20,17H18C15.14,16.91 12.9,14.67 13,12C12.9,9.33 15.14,7.09 18,7H20V17Z"/>
            </svg>
          </div>
          <div class="fmt-logo${hasDTS && isOn ? ' active-dts' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="12" viewBox="0 0 1280 576">
              <path fill="${hasDTS && isOn ? pri : '#c0c8d8'}" d="m 203.73263,488.77111 c -10.59007,-1.15072 -31.98511,-5.32113 -34.54708,-6.73405 -0.80056,-0.44151 -4.88641,-1.85124 -9.07966,-3.13273 -4.19325,-1.28149 -8.12782,-2.82195 -8.7435,-3.42325 -0.61568,-0.60129 -1.62739,-1.09326 -2.24826,-1.09326 -2.15946,0 -21.66355,-10.93838 -25.61543,-14.36578 -0.56546,-0.49041 -2.284,-1.74728 -3.81897,-2.79305 -5.94234,-4.04845 -22.428241,-20.17596 -25.800934,-25.24003 -1.314344,-1.97348 -3.407348,-5.1537 -4.65112,-7.06717 -1.243773,-1.91347 -2.605333,-3.8667 -3.02569,-4.34053 -1.351669,-1.52357 -7.560759,-15.08351 -9.108983,-19.89297 -0.824913,-2.56255 -1.790692,-5.04037 -2.146176,-5.50629 -0.355483,-0.46592 -1.348814,-4.08736 -2.207401,-8.04765 -2.230957,-10.29044 -2.249455,-38.8309 -0.03184,-49.12441 0.852177,-3.95555 1.805189,-7.38639 2.117803,-7.62409 0.312615,-0.23769 1.488754,-3.10061 2.613643,-6.36202 1.124888,-3.26142 2.879919,-7.26407 3.900068,-8.89478 1.020148,-1.6307 2.110841,-3.77235 2.423759,-4.75922 0.31292,-0.98687 1.321622,-2.47546 2.24156,-3.308 0.919939,-0.83253 1.672616,-1.8883 1.672616,-2.34613 0,-1.42596 6.892242,-9.67913 14.147785,-16.94138 8.47074,-8.47856 11.39035,-11.03525 15.38516,-13.4727 1.69467,-1.03401 3.21217,-2.1938 3.37222,-2.57732 0.16004,-0.3835 2.16137,-1.64508 4.44738,-2.80349 2.28601,-1.15841 4.15639,-2.4044 4.15639,-2.76888 0,-0.36446 1.29818,-1.1321 2.88483,-1.70584 1.58666,-0.57374 4.15979,-1.90503 5.71807,-2.95841 1.55828,-1.05339 5.21576,-2.80364 8.12774,-3.88947 2.91198,-1.08581 5.29642,-2.21363 5.29875,-2.50626 0.002,-0.29263 2.95667,-1.44455 6.56519,-2.55981 3.60852,-1.11527 7.32335,-2.4883 8.25519,-3.05118 0.93183,-0.56288 5.50629,-1.92638 10.16545,-3.03001 4.65917,-1.10362 8.66181,-2.25397 8.89477,-2.55634 0.5908,-0.76683 14.69601,-3.04986 25.8372,-4.18195 5.12508,-0.52076 10.65254,-1.3241 12.28325,-1.7852 3.63339,-1.02736 28.8465,-0.45474 39.39113,0.89463 9.2978,1.1898 23.73318,4.07394 25.68061,5.13088 0.785,0.42605 3.5239,1.4195 6.08644,2.20766 2.56254,0.78815 6.45721,2.33331 8.65483,3.43368 2.19761,1.10037 4.58014,2.00066 5.29451,2.00066 1.15899,0 1.29884,-9.8056 1.29884,-91.06552 V 69.463931 h 94.03044 94.03044 V 153.6832 c 0,46.3206 0.23139,84.82225 0.5142,85.55923 0.45584,1.18791 4.01266,1.33997 31.34348,1.33997 h 30.82929 v -27.32462 -27.32461 l 4.44738,-2.02766 c 2.44606,-1.11522 8.64064,-3.89259 13.76572,-6.17194 5.12508,-2.27936 11.03375,-5.03388 13.13038,-6.12114 2.09662,-1.08727 5.33686,-2.45381 7.20053,-3.03675 1.86366,-0.58295 3.98686,-1.5804 4.71822,-2.21656 0.73136,-0.63617 3.50531,-1.90517 6.16432,-2.82001 2.65901,-0.91483 5.42339,-2.25216 6.14307,-2.97184 0.71968,-0.71968 1.89389,-1.3085 2.60935,-1.3085 0.71546,0 3.64257,-1.09929 6.50468,-2.44288 15.89399,-7.46122 18.7263,-8.74896 22.60877,-10.27929 2.33836,-0.9217 5.09692,-2.19957 6.13013,-2.83972 1.03321,-0.64015 3.87989,-1.85976 6.32596,-2.71025 2.44606,-0.85048 4.44738,-1.80117 4.44738,-2.11264 0,-0.31147 2.85904,-1.60906 6.35341,-2.88353 3.49438,-1.27447 6.35341,-2.61842 6.35341,-2.98656 0,-0.36813 1.04831,-0.93058 2.32958,-1.24987 1.28127,-0.31929 5.4819,-2.07604 9.33473,-3.90388 3.85283,-1.82784 7.18099,-3.32335 7.39591,-3.32335 0.35297,0 8.09385,-3.52742 19.48379,-8.87851 2.32958,-1.09446 5.66512,-2.48014 7.41231,-3.07929 1.74719,-0.59915 3.1767,-1.36291 3.1767,-1.69725 0,-0.33433 2.4836,-1.43436 5.51912,-2.44452 3.03551,-1.01015 5.98985,-2.30581 6.56518,-2.87924 1.04183,-1.03836 6.06654,-3.04634 7.62309,-3.04634 0.52425,0 0.5914,24.7869 0.18701,69.04038 l -0.6309,69.04037 h 25.10022 25.10021 v 20.74167 20.74167 l -24.77829,0.22458 -24.77829,0.22457 -0.21639,75.3416 -0.21639,75.34159 2.15874,3.11505 c 1.1873,1.71328 3.5719,3.83339 5.2991,4.71135 1.72722,0.87797 3.36479,1.90049 3.63905,2.27226 0.85753,1.16243 9.47555,3.11551 13.79368,3.12603 5.30751,0.013 21.84265,-2.43369 23.01317,-3.40514 0.49303,-0.40917 5.07134,-1.2069 10.17401,-1.77272 11.08346,-1.22902 33.02128,0.0212 37.23259,2.12181 3.0466,1.51966 18.52967,4.76035 22.74357,4.76035 1.6465,0 3.22924,0.3812 3.51719,0.84712 0.6462,1.04557 25.83719,1.15928 25.83719,0.11663 0,-0.40176 2.00788,-0.96647 4.46196,-1.2549 9.28527,-1.0913 17.49524,-5.70362 20.50194,-11.51785 2.21234,-4.2782 3.3158,-13.35861 2.21895,-18.25982 -1.25806,-5.62164 -6.81313,-13.34838 -13.35783,-18.57995 -2.71164,-2.16758 -6.40364,-5.16459 -8.20445,-6.66004 -1.80082,-1.49544 -3.70684,-2.98644 -4.23561,-3.31332 -0.52877,-0.32689 -1.72381,-1.19885 -2.65564,-1.9377 -0.93183,-0.73886 -5.31568,-4.19332 -9.74189,-7.67659 -14.23142,-11.19963 -15.6164,-12.29783 -18.97365,-15.04474 -3.11329,-2.54731 -21.05581,-20.21065 -24.25709,-23.87966 -0.81305,-0.93184 -2.10225,-2.93316 -2.86491,-4.44739 -0.76265,-1.51423 -1.7136,-2.75314 -2.11321,-2.75314 -0.39961,0 -0.93178,-0.66711 -1.18261,-1.48246 -0.25081,-0.81536 -1.6281,-4.5321 -3.06064,-8.25943 -3.60221,-9.37261 -3.64357,-17.54993 -0.13625,-26.93809 1.35762,-3.63395 3.16696,-7.58905 4.02076,-8.78913 0.85381,-1.20007 2.14257,-3.06319 2.86391,-4.14026 2.35066,-3.50985 12.20037,-12.57623 17.36307,-15.98223 13.95598,-9.20717 31.63576,-16.59927 51.63645,-21.58973 5.12508,-1.27878 9.89014,-2.55433 10.58901,-2.83455 2.00387,-0.80349 16.47143,-2.99835 26.68432,-4.04828 5.12508,-0.52688 9.92792,-1.27394 10.67288,-1.66011 2.81659,-1.46001 40.85817,-2.78954 62.60312,-2.18795 21.0897,0.58347 29.0092,1.15869 41.0853,2.98417 3.2615,0.49301 11.6383,1.68953 18.6154,2.65892 6.9769,0.9694 13.0762,2.01799 13.5539,2.33019 0.4776,0.31222 5.6335,1.59301 11.4575,2.84621 9.6426,2.07492 25.3117,6.19364 25.8474,6.79417 0.1205,0.13509 -0.5453,4.29855 -1.4796,9.25212 l -1.6987,9.00652 -21.2882,0.45754 c -23.2663,0.50006 -30.8405,1.55422 -38.1585,5.31075 -6.0488,3.10499 -9.735,7.29742 -10.6423,12.10385 -0.7572,4.01096 0.3355,11.97718 1.6427,11.97718 0.3708,0 1.1347,1.11168 1.6975,2.4704 1.0491,2.53274 10.7166,12.89889 16.2631,17.43841 1.7068,1.39694 4.3752,3.58529 5.9299,4.86301 1.5545,1.2777 4.7325,3.88915 7.0621,5.80321 2.3295,1.91405 4.998,4.11528 5.9298,4.89161 0.9318,0.77634 3.1965,2.54875 5.0326,3.93869 1.8361,1.38993 4.2583,3.34522 5.3826,4.34507 1.1244,0.99984 3.2914,2.85799 4.8157,4.12921 4.1442,3.4562 22.6062,21.78315 24.8014,24.61996 7.3516,9.50044 11.2185,18.84749 11.2185,27.11712 0,13.67617 -7.3651,29.65073 -18.7964,40.76871 -4.5349,4.41053 -8.4125,7.86079 -8.8344,7.86079 -0.4698,0 -5.6495,3.58922 -6.254,4.33359 -0.233,0.28685 -2.139,1.38494 -4.2356,2.4402 -2.0966,1.05527 -4.8352,2.63932 -6.0856,3.52011 -1.2506,0.88081 -3.9034,2.17646 -5.8953,2.87925 -1.9919,0.70279 -3.8278,1.58695 -4.0798,1.96481 -0.252,0.37786 -3.4199,1.70224 -7.0398,2.94307 -3.6199,1.24083 -7.2414,2.62503 -8.0476,3.07601 -1.8934,1.05894 -13.0862,4.25659 -14.8995,4.25659 -0.7652,0 -1.3912,0.31821 -1.3912,0.70713 0,0.38891 -5.4322,1.74753 -12.0715,3.01915 -6.6393,1.27162 -12.8339,2.65018 -13.7657,3.06347 -0.9318,0.41328 -6.4593,1.35725 -12.2832,2.09771 -35.75855,4.54634 -66.7021,6.2044 -90.85488,4.8683 -21.04634,-1.16426 -49.58873,-4.82137 -54.42643,-6.97362 -0.93184,-0.41456 -6.2687,-1.78316 -11.8597,-3.04134 -5.591,-1.25818 -10.37561,-2.60981 -10.63249,-3.00364 -0.25686,-0.39383 -5.21252,-1.52349 -11.01257,-2.51037 -9.3407,-1.58931 -12.86837,-1.74843 -30.87645,-1.39264 -19.40411,0.38337 -33.88682,1.95451 -36.37927,3.94659 -1.00917,0.80657 -19.09386,3.93613 -27.79015,4.80909 -3.14494,0.31569 -5.71807,0.83728 -5.71807,1.15908 0,0.85907 -22.49098,2.52954 -46.29074,3.43814 -26.59697,1.01539 -56.09918,-0.57841 -62.56432,-3.37994 -0.93183,-0.40379 -5.29155,-1.55166 -9.68825,-2.55082 -4.39672,-0.99916 -9.54298,-2.50483 -11.43614,-3.34592 -1.89317,-0.84109 -5.34815,-2.22815 -7.67773,-3.08234 -2.32958,-0.8542 -4.42621,-1.76326 -4.65917,-2.02014 -0.23295,-0.25688 -2.80608,-1.58546 -5.71806,-2.9524 -2.91198,-1.36694 -5.29451,-2.80588 -5.29451,-3.19767 0,-0.39177 -0.85771,-1.05112 -1.90602,-1.4652 -2.34765,-0.92733 -10.32038,-7.76787 -14.37724,-12.33557 -1.65525,-1.86366 -4.38084,-5.72981 -6.05687,-8.59142 -5.79091,-9.88725 -5.61487,-7.1527 -5.61487,-87.22061 0,-65.01924 -0.1326,-72.21113 -1.33996,-72.67444 -0.73698,-0.28281 -13.85736,-0.51419 -29.1564,-0.51419 -15.29903,0 -28.41941,0.23138 -29.15639,0.51419 -1.21157,0.46492 -1.33997,10.24656 -1.33997,102.0781 v 101.5639 h -94.03044 -94.03044 v -7.20053 c 0,-6.74572 -0.11215,-7.20053 -1.77557,-7.20053 -0.97656,0 -4.50363,1.29458 -7.83793,2.87684 -3.3343,1.58226 -8.92047,3.73808 -12.41371,4.79072 -3.49324,1.05262 -6.54195,2.16597 -6.77491,2.47408 -0.56712,0.75009 -12.65373,3.15759 -24.14295,4.80897 -17.19241,2.47111 -40.40544,3.33661 -52.94507,1.97404 z M 309.62277,364.26208 v -72.0053 h -1.77532 c -0.97643,0 -2.78715,0.53929 -4.02383,1.19843 -1.23668,0.65912 -4.44043,2.03761 -7.11945,3.0633 -2.67902,1.0257 -4.87095,2.20182 -4.87095,2.61363 0,0.4118 -0.40782,0.74873 -0.90626,0.74873 -1.54567,0 -7.86054,4.71939 -13.22875,9.88644 -5.21469,5.01928 -12.32339,14.66168 -13.43586,18.22472 -0.33686,1.0789 -0.91863,2.16012 -1.29283,2.4027 -0.63763,0.41335 -4.14516,11.46606 -6.04313,19.04273 -1.10739,4.42067 -1.09603,25.29235 0.0162,29.64924 2.34486,9.18596 5.22993,18.53658 5.85728,18.98372 0.38589,0.27503 1.43785,2.21548 2.33771,4.31211 0.89984,2.09662 2.41414,4.88925 3.36509,6.20585 3.28681,4.55054 12.75345,14.32979 16.02385,16.55297 9.69113,6.58794 18.77246,10.92066 23.19028,11.06412 l 1.90599,0.0619 z"/>
            </svg>
          </div>
        </div>
        <div class="r1">
          <span class="src">${source}</span>
          <span class="vol"><span class="vol-lbl">VOL </span>${volDisplay}</span>
        </div>
        <div class="mode">${listenMode}</div>
        <div class="vbar">${volBarHTML}</div>
        <div class="ch">${inCh} <span class="ch-arr">▸▸</span> ${outCh}</div>
        <div class="ldiv"></div>
        <div class="specs">
          <div class="sp"><span class="sk">FORMAT</span><span class="sv">${inSignal}</span></div>
          <div class="sp"><span class="sk">FREQ</span><span class="sv">${inFreq}</span></div>
          <div class="sp"><span class="sk">INPUT</span><span class="sv">${audioPort}</span></div>
          <div class="sp"><span class="sk">VIDEO</span><span class="sv">${inRes}</span></div>
        </div>
      </div>

      <div class="kwrap">
        <div class="knob knob-input${isOn ? ' on' : ''}">
          <svg class="ksvg" viewBox="0 0 44 44">
            ${inputTicks}
            <circle cx="22" cy="22" r="6" fill="rgba(93,12,237,0.04)" stroke="rgba(93,12,237,0.15)" stroke-width="0.5"/>
            ${inputNeedle}
          </svg>
        </div>
        <span class="klbl">INPUT</span>
      </div>
    </div>

    <div class="bstrip">
      <span class="fn">MULTI CH</span>
      <span class="fn">ZONE 2</span>
      <span class="fn">BLUETOOTH</span>
      <span class="fn">NET</span>
      <span class="fn">USB</span>
    </div>

    <div class="chrome"></div>
  </div>
</ha-card>
    `;

    /* ── Bind click handler once after DOM build ── */
    this._clickHandler = () => {
      const e = new Event("hass-more-info", { bubbles: true, composed: true });
      e.detail = { entityId: this.config.entity };
      this.dispatchEvent(e);
    };
    this.shadowRoot.querySelector("ha-card").addEventListener("click", this._clickHandler);
  }

  disconnectedCallback() {
    if (this._clickHandler && this.shadowRoot) {
      const card = this.shadowRoot.querySelector('ha-card');
      if (card) card.removeEventListener('click', this._clickHandler);
    }
    this._clickHandler = null;
  }

  connectedCallback() {
    // Tab switch: shadow DOM persists — just re-attach click handler
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    if (card && this._lastRenderKey && !this._clickHandler) {
      this._clickHandler = () => {
        const e = new Event("hass-more-info", { bubbles: true, composed: true });
        e.detail = { entityId: this.config.entity };
        this.dispatchEvent(e);
      };
      card.addEventListener("click", this._clickHandler);
    }
  }

  getCardSize() { return 3; }

  static getConfigElement() { return document.createElement("onkyo-card-editor"); }
  static getStubConfig(hass) {
    const mp = hass ? Object.keys(hass.states).find(e => e.startsWith("media_player.")) : "";
    return { entity: mp || "media_player.onkyo" };
  }
}

customElements.define("onkyo-card", OnkyoCard);

// ═══════════════════════════════════════════════════════
//  ÉDITEUR VISUEL (§22 : render une fois + _syncValues, input+datalist)
// ═══════════════════════════════════════════════════════
class OnkyoCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._built = false; }

  setConfig(config) {
    this._config = { ...config };
    if (!this._built) this._render();
    else this._syncValues();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._render();
    else this._fillEntities();
  }

  disconnectedCallback() { this.innerHTML = ""; this._built = false; }

  _syncValues() {
    const c = this._config;
    this.querySelectorAll("[data-key]").forEach((el) => {
      if (el === document.activeElement) return;
      const k = el.dataset.key;
      if (el.type === "checkbox") {
        el.checked = el.dataset.defaultOn ? (c[k] !== false) : (c[k] === true);
      } else {
        const v = c[k];
        el.value = (v === undefined || v === null) ? "" : v;
        if (el._pick) { const h = this._toHex(el.value); if (h) el._pick.value = h; }
      }
    });
  }

  _render() {
    this._built = true;
    this.innerHTML = "";
    this.style.cssText = "display:block;padding:16px;font-family:var(--primary-font-family,Roboto,sans-serif);";

    const style = document.createElement("style");
    style.textContent = `
      .sec { font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--primary-color);margin:18px 0 8px; }
      .row { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px; }
      .row label { font-size:14px;color:var(--primary-text-color);flex:1; }
      input[type=text] { font-size:13px;padding:6px 8px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);outline:none;flex-shrink:0;min-width:165px; }
      .color-row { display:flex;align-items:center;gap:8px; }
      .color-row input[type=text] { flex:1;min-width:0; }
      input[type=color] { width:44px;height:30px;padding:2px 3px;border:1px solid var(--divider-color,#ccc);border-radius:6px;cursor:pointer;flex-shrink:0; }
      input[type=checkbox] { width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color,#9D4EDD);flex-shrink:0; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-4px 0 10px; }
    `;
    this.appendChild(style);

    const c = this._config;

    this._sec("Entité");
    this._entityRow("entity", "Media player *", c.entity || "");

    this._sec("Couleurs");
    this._colorRow("color_primary", "Couleur primaire", c.color_primary || "#00d4ff");
    this._colorRow("color_accent",  "Couleur accent",   c.color_accent  || "#5D0CED");

    this._sec("Options");
    this._toggle("theme_background",     "Fond depuis le thème",         c.theme_background     === true);
    this._toggle("show_chassis_texture", "Texture châssis",              c.show_chassis_texture !== false, true);
    this._text("image_url", "URL image (override)", c.image_url || "", "/local/… ou https://…");

    this._fillEntities();
  }

  _sec(t)  { const d = document.createElement("div"); d.className = "sec";  d.textContent = t; this.appendChild(d); }
  _hint(t) { const d = document.createElement("div"); d.className = "hint"; d.textContent = t; this.appendChild(d); }

  _toggle(key, label, checked, defaultOn = false) {
    const row = document.createElement("div"); row.className = "row";
    const lbl = document.createElement("label"); lbl.textContent = label;
    const cb  = document.createElement("input"); cb.type = "checkbox"; cb.checked = checked; cb.dataset.key = key;
    if (defaultOn) cb.dataset.defaultOn = "1";
    cb.addEventListener("change", (e) => this._set(key, e.target.checked));
    row.appendChild(lbl); row.appendChild(cb); this.appendChild(row);
  }

  _text(key, label, value, placeholder = "") {
    const row = document.createElement("div"); row.className = "row";
    const lbl = document.createElement("label"); lbl.textContent = label;
    const inp = document.createElement("input"); inp.type = "text"; inp.value = value; inp.placeholder = placeholder; inp.dataset.key = key;
    inp.addEventListener("change", (e) => this._set(key, e.target.value.trim() || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _entityRow(key, label, value) {
    const row = document.createElement("div"); row.className = "row";
    const lbl = document.createElement("label"); lbl.textContent = label;
    const inp = document.createElement("input");
    inp.type = "text"; inp.value = value || ""; inp.placeholder = "media_player.onkyo";
    inp.autocomplete = "off"; inp.dataset.key = key;
    inp.setAttribute("list", "onkyo-ent-list");
    inp.addEventListener("change", (e) => this._set(key, e.target.value.trim() || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _fillEntities() {
    if (!this._hass) return;
    let dl = this.querySelector("#onkyo-ent-list");
    if (!dl) { dl = document.createElement("datalist"); dl.id = "onkyo-ent-list"; this.appendChild(dl); }
    const ids = Object.keys(this._hass.states).filter((e) => e.startsWith("media_player.")).sort();
    if (dl.childElementCount === ids.length) return;
    dl.textContent = "";
    const frag = document.createDocumentFragment();
    ids.forEach((id) => {
      const o = document.createElement("option"); o.value = id;
      const fn = this._hass.states[id].attributes?.friendly_name;
      if (fn && fn !== id) o.label = fn;
      frag.appendChild(o);
    });
    dl.appendChild(frag);
  }

  _colorRow(key, label, value) {
    const row = document.createElement("div"); row.className = "row";
    const lbl = document.createElement("label"); lbl.textContent = label;
    const wrap = document.createElement("div"); wrap.className = "color-row";
    const txt = document.createElement("input"); txt.type = "text"; txt.value = value; txt.placeholder = "#rrggbb"; txt.dataset.key = key;
    const pick = document.createElement("input"); pick.type = "color"; pick.value = this._toHex(value) || "#00d4ff";
    txt._pick = pick;
    txt.addEventListener("change", (e) => { const v = e.target.value.trim(); this._set(key, v || undefined); const h = this._toHex(v); if (h) pick.value = h; });
    pick.addEventListener("input",  (e) => { txt.value = e.target.value; this._set(key, e.target.value); });
    wrap.appendChild(txt); wrap.appendChild(pick); row.appendChild(lbl); row.appendChild(wrap); this.appendChild(row);
  }

  _toHex(color) {
    if (!color) return null;
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    const m = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    if (m) return "#" + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, "0")).join("");
    return null;
  }

  _set(key, value) {
    if (value === undefined || value === null || value === "") delete this._config[key];
    else this._config[key] = value;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
  }
}

customElements.define("onkyo-card-editor", OnkyoCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "onkyo-card")) {
  window.customCards.push({
    type: "onkyo-card",
    name: "Onkyo Card",
    description: "Receiver Onkyo (Neo Tokyo) — media_player",
    preview: true,
  });
}

console.info(
  '%c 🎵 onkyo-card v129.09 %c Neo Tokyo ',
  'background:#9D4EDD;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#E0115F;padding:2px 4px;border-radius:0 3px 3px 0;'
);
