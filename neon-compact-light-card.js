/**
 * Neon Compact Light Card
 * 
 * Custom compact light card with neon cyberpunk effects for Home Assistant.
 * CSS-driven styling with class-based state management.
 * 
 * Original Author: goggybox
 * License: GPL-3.0
 * 
 * Enhancements v2.0:
 * - Randomized flicker timing (4-7s per card, desynchronized across multiple cards)
 * - Configurable off_blur for different blur values when light is OFF
 * - 3-phase power animations (pending → state change → final animation)
 * - Adaptive timing that syncs with entity response time (fast Zigbee / slow WiFi)
 * - Smart contrast calculation for optimal text readability
 * - Cyberpunk visual effects (scanlines, glitch, intense glow, color pulse)
 * 
 * @version 2.1.0
 * @repository https://github.com/YOUR_USERNAME/neon-compact-light-card
 */

console.log("neon-compact-light-card.js loaded!");
const _LEFT_OFFSET = 66; // private constant — was _LEFT_OFFSET (global pollution)

// Device detection (cf weather/header-v2) — userAgent fiable en paysage. Force
// le flicker OFF sur iPad/mobile (la @media min-height:1000px ratait en paysage).
const NCL_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const NCL_IS_LOW_POWER = NCL_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

const MDI_ICONS = [
  'mdi:lightbulb', 'mdi:lightbulb-outline', 'mdi:lamp', 'mdi:floor-lamp',
  'mdi:ceiling-light', 'mdi:chandelier', 'mdi:led-strip', 'mdi:led-strip-variant',
  'mdi:string-lights', 'mdi:candle', 'mdi:fire', 'mdi:home', 'mdi:sofa',
  'mdi:bed', 'mdi:bath', 'mdi:silverware-fork-knife', 'mdi:television',
  'mdi:desk-lamp', 'mdi:outdoor-lamp', 'mdi:light-recessed', 'mdi:wall-sconce',
  'mdi:wall-sconce-flat', 'mdi:coach-lamp', 'mdi:spotlight', 'mdi:spotlight-beam',
  'mdi:track-light', 'mdi:vanity-light', 'mdi:sun-wireless', 'mdi:weather-sunny',
  'mdi:star', 'mdi:heart', 'mdi:flower', 'mdi:tree',
];


class NeonCompactLightCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isDragging = false;
    this.startX = 0;
    this.startWidth = 0;
    this.supportsBrightness = true;
    this.pendingUpdate = null;
    this._hass = null;
    this._handlersSetup = false;
    this._lastIconClick = 0;
    this._lastState = null;
    this._pendingStateChange = false;
    this._powerAnimTimer = null;   // stored for cleanup
    this._updateTimeout = null;    // stored for cleanup (was local var — leak)
    // Diff cache — skip _updateDisplay if nothing changed
    this._lastRenderKey = null;
    
    // Randomize flicker timing (4-7s duration, random initial offset)
    this._flickerDuration = 4 + Math.random() * 3;
    this._flickerDelay = Math.random() * -5;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border-radius: var(--ha-card-border-radius, 12px);
          --height: 64px;
          --icon-width: var(--height);
          --icon-border-radius: var(--ha-card-border-radius);
          --icon-font-size: 36px;

          --off-background-colour: var(--secondary-background-color);
          --off-text-colour: var(--secondary-text-color);

          --icon-border-colour: var(--card-background-color);
          --card-border-colour: var(--card-background-color);
        }

        .card-container {
          width: 100%;
          height: var(--height);
          background: rgba(0,0,0,0.0);
          border-radius: var(--ha-card-border-radius, 12px);
          overflow: hidden;          /* clippe la barre 100% sous le border arrondi (fix coin tronqué) */
          position: relative;
          border: 1px solid rgba(0, 232, 255, 0.25);
          box-sizing: border-box;
        }

        .card {
          height: var(--height);
          background: rgba(0,0,0,0.1);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          /* rayon intérieur = rayon container − épaisseur du border, sinon le coin
             de la barre à 100% pointe à travers le border arrondi */
          border-radius: calc(var(--ha-card-border-radius, 12px) - 1px);
          overflow: hidden;
        }

        .icon-wrapper {
          position: relative;
          width: var(--icon-width);
          height: var(--height);
          flex-shrink: 0;
        }

        .icon {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: var(--off-primary-colour);
          border: 3px solid var(--icon-border-colour);
          color: var(--off-text-colour);
          border-radius: var(--icon-border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          transition: background 0.6s ease;
        }

        .icon.no-border {
          border: none;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
        }

        .content {
          height: var(--height);
          width: 100%;
          z-index: 1;
          box-sizing: border-box;
          padding: 3px 6px 3px 8px;
          overflow: visible;   /* (était 'overflow: false' — valeur CSS invalide) */
          background: var(--icon-border-colour);
          margin-left: -69px;
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .content.no-border {
          padding: 0px 0px 0px 5px;
        }

        .brightness {
          border-radius: var(--ha-card-border-radius);
          width: 100%;
          height: 100%;
          overflow: hidden;            /* clippe la barre → épouse le radius à 100% */
          transition: background 0.6s ease;
          user-select: none;
        }

        .brightness-bar {
          height: 100%;
          background: var(--light-primary-colour, var(--primary-color));
          /* Coin gauche fixe. Coin droit : --bar-right-radius grandit vers la fin de
             course (piloté en JS) pour que la barre se torde et épouse l'arc de la card. */
          border-radius: 12px var(--bar-right-radius, 0px) var(--bar-right-radius, 0px) 12px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px;
          transition: width 0.6s ease, border-radius 0.4s ease;
        }

        .overlay {
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }

        .name {
          padding-left: 79px;
          font-weight: bold;
          font-size: 18px;
          color: var(--primary-text-color);
          text-shadow: none;
          transition: text-shadow 0.6s ease, color 0.6s ease;
        }
        
        /* État ON: glow standard */
        :host(.state-on) .name {
          text-shadow: 0 0 8px var(--light-primary-colour, var(--primary-color)),
                       0 0 15px var(--light-primary-colour, var(--primary-color));
        }
        
        /* État OFF/Unavailable: pas de glow */
        :host(.state-off) .name,
        :host(.state-unavailable) .name {
          text-shadow: none;
        }

        .right-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .percentage {
          font-size: 14px;
          color: var(--primary-text-color);
          transition: color 0.6s ease;
        }

        .arrow {
          padding-right: 10px;
          --mdc-icon-size: 28px;
          padding-top: 20px;
          padding-bottom: 20px;
          color: var(--primary-text-color);
          pointer-events: auto;
          transition: color 0.6s ease;
        }
        
        /* Smart font colour: calcule automatiquement le contraste */
        :host(.smart-contrast.state-on) .name,
        :host(.smart-contrast.state-on) .percentage,
        :host(.smart-contrast.state-on) .arrow {
          color: var(--optimal-text-colour, var(--primary-text-color));
        }

        :host(.smart-contrast.state-off) .name,
        :host(.smart-contrast.state-off) .percentage,
        :host(.smart-contrast.state-off) .arrow,
        :host(.smart-contrast.state-off) .icon,
        :host(.smart-contrast.state-unavailable) .name,
        :host(.smart-contrast.state-unavailable) .percentage,
        :host(.smart-contrast.state-unavailable) .arrow,
        :host(.smart-contrast.state-unavailable) .icon {
          color: var(--optimal-off-text-colour, var(--off-text-colour));
        }

        /* Custom text colour: override tout le reste */
        :host(.custom-text-colour) .name,
        :host(.custom-text-colour) .percentage,
        :host(.custom-text-colour) .arrow {
          color: var(--custom-text-colour) !important;
        }

        .haicon {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--icon-width);
          height: var(--height);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--off-text-colour);
          --mdc-icon-size: 32px;
          filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
          /* changed from v1: pointer-events enabled here so click works without clone */
          pointer-events: auto;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: filter 0.6s ease, color 0.6s ease;
        }
        .haicon:active { opacity: 0.65; }
        
        /* États de la carte */
        :host(.state-on) .haicon {
          color: var(--light-primary-colour);
          filter: drop-shadow(0 0 8px var(--light-primary-colour, var(--primary-color))); 
                  drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
        }
        
        :host(.state-on) .icon {
          background: var(--light-secondary-colour, var(--secondary-color));
          color: var(--light-primary-colour, var(--primary-color));
        }
        
        :host(.state-on) .brightness {
          background: var(--light-secondary-colour, var(--secondary-color));
        }
        
        :host(.state-off) .icon,
        :host(.state-unavailable) .icon {
          background: var(--off-background-colour);
          color: var(--off-text-colour);
        }
        
        :host(.state-off) .brightness,
        :host(.state-unavailable) .brightness {
          background: var(--off-background-colour);
        }
        
        :host(.state-off) .haicon,
        :host(.state-unavailable) .haicon {
          color: var(--off-text-colour);
          filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
        }
        
        /* icon_colour override */
        :host(.has-icon-colour.state-on) .icon {
          color: var(--custom-icon-colour);
        }
        :host(.has-icon-colour.state-on) .haicon {
          color: var(--custom-icon-colour);
          filter: drop-shadow(0 0 8px var(--custom-icon-colour)) 
                  drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
        }
        
        /* Intense glow: triple drop-shadow violet néon */
        :host(.effect-intense-glow.state-on) .haicon {
          filter: drop-shadow(0 0 6px #fff)
                  drop-shadow(0 0 12px #B041FF)
                  drop-shadow(0 0 24px #B041FF)
                  drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15)) !important;
        }
        
        :host(.effect-intense-glow.state-on) .name {
          text-shadow: 0 0 8px #fff,
                       0 0 20px #B041FF,
                       0 0 40px #B041FF !important;
        }

        /* ── Effects ──────────────────────────────────────── */
        @keyframes colorpulse {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.18);
          }
        }
        @keyframes boxGlowPulse {
          0%, 100% { 
            box-shadow: 0 0 20px 4px var(--glow-color, rgba(0, 232, 255, 0.3));
          }
          50% { 
            box-shadow: 0 0 35px 8px var(--glow-color, rgba(0, 232, 255, 0.4)),
                        0 0 50px 12px var(--glow-color, rgba(0, 232, 255, 0.2));
          }
        }
        @keyframes flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
          20%,24%,55% { opacity: .5; }
        }
        @keyframes scanMove {
          0%   { transform: translateY(-4px); }
          100% { transform: translateY(calc(100% + 4px)); }
        }
        @keyframes glitchCard {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-4px, 2px); filter: drop-shadow(4px 0 #00E8FF) drop-shadow(-4px 0 #FF0090); }
          40%     { transform: translate(4px,-2px); filter: drop-shadow(-4px 0 #B041FF) drop-shadow(4px 0 #FF0090); }
          60%     { transform: translate(-3px, 1px); }
        }
        @keyframes powerOn {
          0%   { transform: scale(0.6) rotate(-20deg); opacity: 0.3; }
          40%  { transform: scale(1.3) rotate(8deg);  opacity: 1; }
          65%  { transform: scale(0.9) rotate(-4deg); }
          82%  { transform: scale(1.12) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg);    opacity: 1; }
        }
        @keyframes powerOff {
          0%   { transform: scale(1)    rotate(0);     opacity: 1; }
          18%  { transform: scale(1.18) rotate(3deg);  filter: brightness(1.8); }  /* sursaut lumineux */
          45%  { transform: scale(0.7)  rotate(-6deg); opacity: 0.15; }
          70%  { transform: scale(1.04) rotate(2deg);  opacity: 0.9; }
          100% { transform: scale(1)    rotate(0);     opacity: 1; }  /* fix: revient à 100% (était 0.9) */
        }
        @keyframes pending {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }

        /* colorpulse: soft brightness variation on the light elements */
        :host(.fx-colorpulse) .brightness-bar,
        :host(.fx-colorpulse) .icon {
          animation: colorpulse 3s ease-in-out infinite;
        }
        :host(.fx-colorpulse) .card-container {
          animation: boxGlowPulse 3s ease-in-out infinite;
        }

        /* effect classes — applied via JS */
        .fx-flicker .name,
        .fx-flicker .percentage,
        .fx-flicker .haicon {
          animation: flicker var(--flicker-duration, 5s) ease-in-out infinite;
          animation-delay: var(--flicker-delay, 0s);
        }
        .fx-glitch:hover {
          animation: glitchCard 0.35s ease !important;
        }
        
        /* Power transition animations */
        .haicon.animating-power-on {
          animation: powerOn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .haicon.animating-power-off {
          animation: powerOff 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
        }
        .haicon.animating-pending {
          animation: pending 0.8s ease-in-out infinite;
        }

        .scanlines {
          display: none;
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          border-radius: var(--icon-border-radius);
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
        }
        .scanlines.active { display: block; }
        .scanlines.active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 4px;
          background: linear-gradient(transparent, rgba(255,255,255,.10), transparent);
          animation: scanMove 5s linear infinite;
        }

        /* ═══════════════════════════════════════════════════════════
           ── v2.1 — Améliorations opt-in ──────────────────────────── */

        /* ── 1. Barre néon "plasma" (option fill_style: plasma) ────── */
        :host(.fill-plasma.state-on) .brightness-bar {
          background:
            /* reflet verre horizontal (haut clair, bas sombre) */
            linear-gradient(180deg, rgba(255,255,255,.22) 0%, transparent 38%, rgba(0,0,0,.18) 100%),
            /* dégradé plasma : très sombre → couleur → quasi-blanc au front */
            linear-gradient(90deg,
              color-mix(in srgb, var(--light-primary-colour, var(--primary-color)) 35%, #000) 0%,
              color-mix(in srgb, var(--light-primary-colour, var(--primary-color)) 70%, #000) 40%,
              var(--light-primary-colour, var(--primary-color)) 80%,
              color-mix(in srgb, var(--light-primary-colour, var(--primary-color)) 65%, #fff) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.35),
            inset -2px 0 0 rgba(255,255,255,.7),
            -10px 0 26px -4px var(--light-primary-colour, var(--primary-color)),
            0 0 1px rgba(255,255,255,.5);
          position: relative;
          overflow: hidden;
        }
        /* Front lumineux : boîte calée sur toute la barre, fond transparent, seul le
           border-right est dessiné. Comme il hérite du même border-radius que la barre
           (--bar-right-radius), le bord se COURBE en fin de course pour épouser l'arc
           de la card — au lieu d'un trait vertical rigide. */
        :host(.fill-plasma.state-on) .brightness-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px var(--bar-right-radius, 0px) var(--bar-right-radius, 0px) 12px;
          border-right: 2px solid #fff;
          box-shadow: 0 0 8px 1px var(--light-primary-colour, var(--primary-color)),
                      0 0 16px 2px var(--light-primary-colour, var(--primary-color));
          opacity: var(--front-opacity, .9);
          animation: frontPulse 2.4s ease-in-out infinite;
          transition: opacity .35s ease, border-radius .4s ease;
          pointer-events: none;
        }
        :host(.fill-plasma.state-on) .brightness-bar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg,
            transparent 30%, rgba(255,255,255,.22) 48%, rgba(255,255,255,.05) 56%, transparent 70%);
          background-size: 240% 100%;
          animation: barShimmer 4.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes frontPulse { 0%,100%{opacity:.55;} 50%{opacity:1;} }
        @keyframes barShimmer {
          0%   { background-position: 160% 0; }
          55%  { background-position: -60% 0; }
          100% { background-position: -60% 0; }
        }

        /* ── 2. Bordure néon Neo Tokyo (option neon_border) ────────── */
        :host(.neon-border) .card-container { border-color: transparent; }
        :host(.neon-border) .card-container::before {
          content: '';
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          border-radius: inherit;
          background:
            linear-gradient(90deg,
              rgba(var(--rgb-primary-color,98,0,234),1) 0%,
              rgba(var(--rgb-accent-color,0,255,249),.6) 35%,
              rgba(var(--rgb-accent-color,0,255,249),.12) 60%,
              transparent 75%) top / 100% 2px no-repeat,
            linear-gradient(180deg,
              rgba(var(--rgb-primary-color,98,0,234),1) 0%,
              rgba(123,47,190,.5) 40%,
              rgba(123,47,190,.08) 65%,
              transparent 80%) left / 2px 100% no-repeat;
          -webkit-mask-image: linear-gradient(135deg, #000 0%, #000 20%, rgba(0,0,0,.5) 40%, transparent 58%);
                  mask-image: linear-gradient(135deg, #000 0%, #000 20%, rgba(0,0,0,.5) 40%, transparent 58%);
        }
        :host(.neon-border) .card-container::after {
          content: '';
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          border-radius: inherit;
          background: radial-gradient(ellipse 55% 60% at 0% 0%,
            rgba(var(--rgb-primary-color,98,0,234),.16) 0%, transparent 70%);
        }

        /* ── 3. Power-down cinématique de la barre (option power_fx) ── */
        :host(.power-fx) .brightness-bar { transition: width .55s cubic-bezier(.5,0,.2,1), filter .25s ease; }
        :host(.power-fx.powering-off) .brightness-bar { filter: brightness(2.4) saturate(1.4); }

        /* ── LOW_POWER : coupe les animations décoratives sur mobile / iPad
           (shimmer, front pulse, color pulse, flicker) — garde le rendu statique. */
        @media (max-width: 767px),
               (min-width: 768px) and (min-height: 1000px) and (hover: none) and (pointer: coarse) {
          :host(.fill-plasma.state-on) .brightness-bar::before,
          :host(.fill-plasma.state-on) .brightness-bar::after { animation: none; }
          :host(.fx-colorpulse) .brightness-bar,
          :host(.fx-colorpulse) .icon,
          :host(.fx-colorpulse) .card-container,
          .fx-flicker .name, .fx-flicker .percentage, .fx-flicker .haicon { animation: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          :host .brightness-bar::before, :host .brightness-bar::after,
          .haicon, :host *,  .scanlines.active::after { animation: none !important; }
        }

      </style>

      <div class="card-container">
        <div class="scanlines"></div>
        <div class="card">
          <div class="icon-wrapper">
            <div class="icon">
            </div>
          </div>
          <div class="content">
            <div class="brightness">
              <div class="brightness-bar"></div>
            </div>
          </div>
          <div class="overlay">
            <ha-icon id="main-icon" icon="mdi:close" class="haicon"></ha-icon>
            <div class="name">Loading...</div>
            <div class="right-info">
              <span class="percentage">—</span>
              <ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>
            </div>
          </div>
        </div>
      </div>
    `
  }

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  _getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  _getContrastRatio(colour1, colour2) {
    const lum1 = this._getLuminance(colour1.r, colour1.g, colour1.b);
    const lum2 = this._getLuminance(colour2.r, colour2.g, colour2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  _parseColour(colour) {
    if (colour.startsWith('var(--')) {
      const computedStyle = getComputedStyle(this);
      const varName = colour.match(/var\((--[^)]+)\)/)[1];
      colour = computedStyle.getPropertyValue(varName).trim() || '#000000';
    }
    if (colour.startsWith('#')) {
      return this._hexToRgb(colour);
    }
    const rgbMatch = colour.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }
    return { r: 0, g: 0, b: 0 };
  }

  _getTextColourForBackground(backgroundColour) {
    const bgRgb = this._parseColour(backgroundColour);
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const contrastWithWhite = this._getContrastRatio(bgRgb, white);
    const contrastWithBlack = this._getContrastRatio(bgRgb, black);
    if (contrastWithWhite >= 1.3) return 'white';
    else if (contrastWithBlack >= 2.5) return 'black';
    else return contrastWithWhite > contrastWithBlack ? 'white' : 'black';
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Neon Compact Light Card: Please provide an 'entity' in the config.")
    }
    // Cleanup avant rebuild
    if (this.pendingUpdate) { cancelAnimationFrame(this.pendingUpdate); this.pendingUpdate = null; }
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
    this.config = {
      ...config,
      icon: config.icon || "mdi:lightbulb",
      name: config.name,
      glow: config.glow !== false,
      icon_border: config.icon_border === true,
      card_border: config.card_border === true,
      off_colours: config.off_colours || null,
      icon_border_colour: config.icon_border_colour,
      card_border_colour: config.card_border_colour,
      primary_colour: config.primary_colour,
      secondary_colour: config.secondary_colour,
      icon_colour: config.icon_colour,
      chevron_action: config.chevron_action || { action: "hass-more-info" },
      chevron_hold_action: config.chevron_hold_action,
      chevron_double_tap_action: config.chevron_double_tap_action,
      opacity: config.opacity !== undefined ? Math.max(config.opacity, 0.2) : 0.85,
      blur: config.blur !== undefined ? Math.min(config.blur, 10) : 6,
      off_blur: config.off_blur !== undefined ? Math.min(config.off_blur, 10) : undefined,
      smart_font_colour: config.smart_font_colour !== false,
      text_colour: config.text_colour || null,

      // effects — sur iPad/mobile : OFF les anims en boucle (heartbeat/flicker, on
      // par défaut → coût × nb de lampes). Garde le reste (icône, couleurs, statique).
      effect_heartbeat:   config.effect_heartbeat   !== false && !NCL_IS_LOW_POWER,
      effect_scanline:    config.effect_scanline     === true && !NCL_IS_LOW_POWER,
      effect_flicker:     config.effect_flicker === true && !NCL_IS_LOW_POWER,
      effect_hover_glitch: config.effect_hover_glitch === true,
      effect_intense_glow: config.effect_intense_glow === true,
      icon_power_animation: config.icon_power_animation !== false && !NCL_IS_LOW_POWER,
    };
    if (config.off_colours) {
      if (typeof config.off_colours !== "object" || (config.off_colours.light === undefined && config.off_colours.background === undefined)) {
        throw new Error("Neon Compact Light Card: Invalid off_colours format.");
      }
    }
  }

  _getOffColours() {
    const offColours = this.config.off_colours;
    if (!offColours) return null;
    let bg, text;
    if (offColours.light && offColours.dark) {
      const isDarkTheme = this._hass.themes.darkMode ?? false;
      const theme = isDarkTheme ? offColours.dark : offColours.light;
      bg = theme.background;
      text = theme.text;
    } else if (offColours.background && offColours.text) {
      bg = offColours.background;
      text = offColours.text;
    } else {
      throw new Error("Neon Compact Light Card: Invalid off_colours format.");
    }
    return { background: bg, text };
  }

  connectedCallback() {
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        this._contentWidth = null;   // invalide la largeur cachée (cf. _updateDisplay)
        if (!this.isDragging) this._refreshCard();
      });
      if (this.shadowRoot.querySelector(".card-container")) {
        this._resizeObserver.observe(this.shadowRoot.querySelector(".card-container"));
      }
    }
  }

  disconnectedCallback() {
    if (this.pendingUpdate) { cancelAnimationFrame(this.pendingUpdate); this.pendingUpdate = null; }
    if (this._updateTimeout) { clearTimeout(this._updateTimeout); this._updateTimeout = null; }
    if (this._powerAnimTimer) { clearTimeout(this._powerAnimTimer); this._powerAnimTimer = null; }
    if (this._powerFxTimer) { clearTimeout(this._powerFxTimer); this._powerFxTimer = null; }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._mousedownHandler) {
      const brightnessEl = this.shadowRoot?.querySelector(".brightness");
      if (brightnessEl) brightnessEl.removeEventListener("mousedown", this._mousedownHandler);
    }
    if (this._mousemoveHandler) document.removeEventListener("mousemove", this._mousemoveHandler);
    if (this._mouseupHandler) document.removeEventListener("mouseup", this._mouseupHandler);
    if (this._touchstartHandler) {
      const brightnessEl = this.shadowRoot?.querySelector(".brightness");
      if (brightnessEl) brightnessEl.removeEventListener("touchstart", this._touchstartHandler);
    }
    if (this._touchmoveHandler) document.removeEventListener("touchmove", this._touchmoveHandler);
    if (this._touchendHandler) document.removeEventListener("touchend", this._touchendHandler);
    if (this._iconClickHandler && this.shadowRoot) {
      const ico = this.shadowRoot.querySelector('#main-icon');
      if (ico) ico.removeEventListener('click', this._iconClickHandler);
      this._iconClickHandler = null;
    }
    // Les handlers viennent d'être retirés → permettre leur ré-attache au reconnect.
    // Sans ça, après un changement d'onglet (fréquent sur iPad/kiosk), set hass()
    // saute la ré-attache (guard _handlersSetup) et le toggle ne répond plus → F5 obligatoire.
    this._handlersSetup = false;
    this._lastRenderKey = null;   // force un _updateDisplay complet au retour
  }

  _refreshCard() {
    if (!this._hass || !this.config.entity) return;
    const { name, displayText, brightnessPercent, primaryColour, secondaryColour, icon } = this._getCardState();
    this._updateDisplay(name, displayText, brightnessPercent, primaryColour, secondaryColour, icon);
  }

  _getCardState() {
    if (!this._hass || !this.config.entity) {
      return { name: null, displayText: null, brightnessPercent: null, primaryColour: null, secondaryColour: null, icon: null };
    }
    const entity = this.config.entity;
    const stateObj = this._hass.states[entity];
    if (!stateObj) {
      return { name: "Entity not found", displayText: "-", brightnessPercent: 0, primaryColour: "#9e9e9e", secondaryColour: "#e0e0e0", icon: "mdi:alert" };
    }
    const state = stateObj.state;
    const tempName = this.config.name || stateObj.attributes.friendly_name || entity.replace("light.", "");
    const friendlyName = tempName.length > 30 ? tempName.slice(0, 30) + "..." : tempName;
    this.supportsBrightness = (stateObj.attributes.supported_features & 1) || (stateObj.attributes.brightness !== undefined);

    let brightnessPercent = 0;
    let displayText = "Off";
    if (state == "on") {
      const brightness = stateObj.attributes.brightness || 255;
      brightnessPercent = Math.round((brightness / 255) * 100);
      if (this.supportsBrightness) { displayText = `${brightnessPercent}`; }
      else { displayText = "On"; brightnessPercent = 100; }
    } else if (state == "unavailable") {
      displayText = "Unavailable";
    }

    let primaryColour = "#00E8FF";
    let secondaryColour = "rgba(0, 232, 255, 0.6)";
    if (this.config.primary_colour) {
      primaryColour = this.config.primary_colour;
    } else if (stateObj.attributes.rgb_color) {
      const [r, g, b] = stateObj.attributes.rgb_color;
      primaryColour = `rgb(${r}, ${g}, ${b})`;
    }
    if (this.config.secondary_colour) {
      secondaryColour = this.config.secondary_colour;
    } else if (stateObj.attributes.rgb_color) {
      const [r, g, b] = stateObj.attributes.rgb_color;
      // Opacité augmentée pour que la couleur soit visible sur le carré de l'icône
      secondaryColour = `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    return { name: friendlyName, displayText, brightnessPercent, primaryColour, secondaryColour, icon: this.config.icon };
  }

  getUsableWidth = () => {
    const buffer = 4;
    const contentEl = this.shadowRoot.querySelector(".content");
    const contentStyle = getComputedStyle(contentEl);
    const paddingRight = parseFloat(contentStyle.paddingRight);
    const contentWidth = contentEl.clientWidth - buffer - paddingRight - _LEFT_OFFSET;
    return contentWidth;
  };

  _performAction(actionObj) {
    if (!actionObj || !actionObj.action || !this._hass || !this.config.entity) return;
    const action = actionObj.action;
    const entityId = this.config.entity;
    const moreInfoEvent = new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } });

    switch (action) {
      case "hass-more-info":
      case "more-info":
        this.dispatchEvent(moreInfoEvent); break;
      case "toggle":
        this._hass.callService("light", "toggle", { entity_id: entityId }); break;
      case "navigate":
        if (actionObj.navigation_path) { history.pushState(null, "", actionObj.navigation_path); window.dispatchEvent(new Event("location-changed")); } break;
      case "url":
        if (actionObj.url_path || actionObj.url) window.open(actionObj.url_path || actionObj.url, "_blank"); break;
      case "call-service":
        if (actionObj.service) {
          const [domain, service] = actionObj.service.split(".", 2);
          const serviceData = { ...actionObj.service_data };
          if (!serviceData.entity_id) serviceData.entity_id = entityId;
          this._hass.callService(domain, service, serviceData);
        } break;
      case "perform-action":
        if (actionObj.perform_action) {
          const [domain, service] = actionObj.perform_action.split(".", 2);
          const serviceData = { ...actionObj.data };
          if (actionObj.target) serviceData.entity_id = actionObj.target.entity_id;
          else if (!serviceData.entity_id) serviceData.entity_id = entityId;
          this._hass.callService(domain, service, serviceData);
        } break;
      case "none": break;
      default: console.warn("Neon Compact Light Card: Unsupported action:", action);
    }
  }

  set hass(hass) {
    if (!this.shadowRoot) return;
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    // Garde : pendant un toggle, HA peut émettre un état transitoire sans l'entité.
    // Sans ce guard, l'accès à stateObj.state throw et fige la card jusqu'au F5.
    if (!stateObj) return;
    const state = stateObj.state;

    const offColours = this._getOffColours();
    if (offColours) {
      this.style.setProperty("--off-background-colour", offColours.background);
      this.style.setProperty("--off-text-colour", offColours.text);
    } else {
      this.style.removeProperty("--off-background-colour");
      this.style.removeProperty("--off-text-colour");
    }

    if (this.config.icon_border_colour && this.config.icon_border === true) {
      this.style.setProperty("--icon-border-colour", this.config.icon_border_colour);
    } else {
      this.style.setProperty("--icon-border-colour", "var(--card-background-color)");
    }

    if (this.config.card_border_colour && this.config.card_border === true) {
      this.style.setProperty("--card-border-colour", this.config.card_border_colour);
    } else {
      this.style.setProperty("--card-border-colour", "var(--card-background-color)");
    }

    const { name, displayText, brightnessPercent, primaryColour, secondaryColour, icon } = this._getCardState();

    // ── Diff: skip expensive _updateDisplay if nothing relevant changed ──
    const renderKey = `${stateObj.state}|${displayText}|${primaryColour}|${secondaryColour}`;
    if (this._handlersSetup && !this.isDragging && renderKey === this._lastRenderKey) return;
    if (!this.isDragging) this._lastRenderKey = renderKey;

    this._updateDisplay(name, displayText, brightnessPercent, primaryColour, secondaryColour, icon);

    if (this._handlersSetup) return;
    this._handlersSetup = true;

    // ── Icon toggle (debounced) ────────────────────────────────────
    const haIconEl = this.shadowRoot.querySelector("#main-icon");
    this._iconClickHandler = (ev) => {
      ev.stopPropagation();
      const now = Date.now();
      if (now - this._lastIconClick < 300) return;
      this._lastIconClick = now;
      const s = this._hass.states[this.config.entity];
      if (!s) return;
      
      // Démarrer l'animation pending
      if (this.config.icon_power_animation) {
        this._pendingStateChange = true;
        haIconEl.classList.add('animating-pending');
      }
      
      this._hass.callService("light", s.state === "on" ? "turn_off" : "turn_on", {
        entity_id: this.config.entity,
      });
    };
    haIconEl.addEventListener("click", this._iconClickHandler);

    // ── Chevron actions ─────────────────────────────────────────────
    const brightnessEl = this.shadowRoot.querySelector(".brightness");
    const barEl = this.shadowRoot.querySelector(".brightness-bar");
    const percentageEl = this.shadowRoot.querySelector(".percentage");
    const contentEl = this.shadowRoot.querySelector(".content");
    let currentBrightness = brightnessPercent;

    const arrowEl = this.shadowRoot.querySelector(".arrow");
    if (arrowEl) {
      const newArrowEl = arrowEl.cloneNode(true);
      arrowEl.replaceWith(newArrowEl);

      let tapCount = 0;
      let tapTimer = null;
      let holdTimer = null;
      let holdTriggered = false;
      const HOLD_THRESHOLD = 500;
      const DOUBLE_TAP_THRESHOLD = 300;

      const handleSingleTap = () => {
        if (tapCount === 1) this._performAction(this.config.chevron_action);
        tapCount = 0;
      };
      const startHold = () => {
        holdTriggered = false;
        holdTimer = setTimeout(() => {
          holdTimer = null; holdTriggered = true; tapCount = 0;
          this._performAction(this.config.chevron_hold_action);
        }, HOLD_THRESHOLD);
      };
      const cancelHold = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
      const handleTap = () => {
        cancelHold(); tapCount++;
        if (tapCount === 1) { tapTimer = setTimeout(handleSingleTap, DOUBLE_TAP_THRESHOLD); }
        else if (tapCount === 2) { clearTimeout(tapTimer); tapTimer = null; tapCount = 0; this._performAction(this.config.chevron_double_tap_action); }
      };
      const handlePointerDown = (ev) => { ev.stopPropagation(); if (ev.type === "touchstart") ev.preventDefault(); startHold(); };
      const handlePointerUp = (ev) => { ev.stopPropagation(); if (holdTriggered) return; if (holdTimer) { cancelHold(); handleTap(); } };
      const handlePointerCancel = () => { cancelHold(); tapCount = 0; if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; } };

      newArrowEl.addEventListener("mousedown", handlePointerDown);
      newArrowEl.addEventListener("mouseup", handlePointerUp);
      newArrowEl.addEventListener("mouseleave", handlePointerCancel);
      newArrowEl.addEventListener("touchstart", handlePointerDown, { passive: false });
      newArrowEl.addEventListener("touchend", handlePointerUp);
      newArrowEl.addEventListener("touchcancel", handlePointerCancel);
    }

    // ── Brightness drag control ─────────────────────────────────────
    const getBrightnessFromX = (clientX) => {
      const rect = brightnessEl.getBoundingClientRect();
      let x = clientX - (rect.left + _LEFT_OFFSET);
      const usableWidth = this.getUsableWidth();
      x = Math.max(0, Math.min(x, usableWidth));
      return Math.round((x / usableWidth) * 100);
    };

    const updateBarPreview = (brightness) => {
      const roundedBrightness = Math.round(brightness);
      if (this.pendingUpdate) cancelAnimationFrame(this.pendingUpdate);
      this.pendingUpdate = requestAnimationFrame(() => {
        if (brightness !== 0) {
          const usableWidth = this.getUsableWidth();
          const effectiveWidth = (Math.max(1, brightness) / 100) * usableWidth;
          const totalWidth = Math.min(effectiveWidth + _LEFT_OFFSET, usableWidth + _LEFT_OFFSET - 1);
          barEl.style.width = `${totalWidth}px`;
          if (percentageEl) percentageEl.textContent = `${roundedBrightness}%`;
        } else {
          const usableWidth = this.getUsableWidth();
          const effectiveWidth = (1 / 100) * usableWidth;
          const totalWidth = Math.min(effectiveWidth + _LEFT_OFFSET, usableWidth + _LEFT_OFFSET - 1);
          barEl.style.width = `${totalWidth}px`;
          if (percentageEl) percentageEl.textContent = `1%`;
        }
        this.pendingUpdate = null;
      });
    };

    const applyBrightness = (hass, entityId, brightness) => {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = setTimeout(() => {
        const b = parseFloat(brightness);
        if (isNaN(b)) return;
        const brightness255 = Math.round((b / 100) * 255);
        const clampedBrightness = Math.max(0, Math.min(255, brightness255));
        hass.callService("light", "turn_on", { entity_id: entityId, brightness: clampedBrightness });
      }, 125);
    };

    const onDragStart = (clientX) => {
      if (!this.supportsBrightness) return;
      this.isDragging = true;
      this.startX = clientX;
      this.startWidth = getBrightnessFromX(clientX);
      const brightness = this.startWidth;
      updateBarPreview(brightness);
      currentBrightness = brightness;
      if (state !== "on") {
        const brightness255 = Math.round((brightness / 100) * 255);
        hass.callService("light", "turn_on", { entity_id: this.config.entity, brightness: Math.max(1, brightness255) });
      }
      document.body.style.userSelect = "none";
    };

    const onDragMove = (clientX) => {
      if (barEl.style.transition !== "none") barEl.style.transition = "none";
      const dx = clientX - this.startX;
      const usableWidth = this.getUsableWidth();
      const deltaPercent = (dx / usableWidth) * 100;
      const newBrightness = Math.round(Math.max(1, Math.min(100, this.startWidth + deltaPercent)));
      updateBarPreview(newBrightness);
      currentBrightness = newBrightness;
    };

    const onDragEnd = () => {
      this.isDragging = false;
      document.body.style.userSelect = "";
      clearTimeout(this._updateTimeout);
      applyBrightness(hass, entity, currentBrightness);
      if (barEl.style.transition === "none") barEl.style.transition = "width 0.6s ease";
    };

    this._mousedownHandler = (e) => { e.preventDefault(); onDragStart(e.clientX); };
    brightnessEl.addEventListener("mousedown", this._mousedownHandler);

    this._mousemoveHandler = (e) => { if (!this.isDragging) return; e.preventDefault(); onDragMove(e.clientX); };
    document.addEventListener("mousemove", this._mousemoveHandler);

    this._mouseupHandler = () => { if (!this.isDragging) return; onDragEnd(); };
    document.addEventListener("mouseup", this._mouseupHandler);

    this._touchstartHandler = (e) => {
      this._initialTouchY = e.touches[0].clientY;
      this._initialTouchX = e.touches[0].clientX;
      this._touchStarted = true;
      this._dragStartedFromTouch = false;
    };
    brightnessEl.addEventListener("touchstart", this._touchstartHandler);

    this._touchmoveHandler = (e) => {
      if (!this._dragStartedFromTouch && this._touchStarted) {
        const currentTouchY = e.touches[0].clientY;
        const currentTouchX = e.touches[0].clientX;
        const deltaY = Math.abs(currentTouchY - this._initialTouchY);
        const deltaX = Math.abs(currentTouchX - this._initialTouchX);
        const SCROLL_THRESHOLD = 10;
        if (deltaY > SCROLL_THRESHOLD) { this._touchStarted = false; return; }
        if (deltaX > SCROLL_THRESHOLD) {
          this._dragStartedFromTouch = true;
          e.preventDefault(); // safe: only when drag confirmed horizontal
          onDragStart(this._initialTouchX);
        }
      }
      if (this._dragStartedFromTouch && this.isDragging) { e.preventDefault(); onDragMove(e.touches[0].clientX); }
    };
    // passive:true by default — only prevents default inside handler when drag is confirmed
    document.addEventListener("touchmove", this._touchmoveHandler, { passive: false });

    this._touchendHandler = (e) => {
      if (this._dragStartedFromTouch && this.isDragging) { e.preventDefault(); onDragEnd(); }
      this._touchStarted = false;
      this._dragStartedFromTouch = false;
      this._initialTouchY = null;
      this._initialTouchX = null;
    };
    document.addEventListener("touchend", this._touchendHandler);
  }

  static getStubConfig() {
    return { entity: "light.bedroom", icon: "mdi:lightbulb" };
  }

  static getConfigElement() {
    return document.createElement("neon-compact-light-card-editor");
  }

  _updateDisplay(name, percentageText, barWidth, primaryColour, secondaryColour, icon) {
    const root = this.shadowRoot;
    if (!root) return;

    const nameEl = root.querySelector(".name");
    const percentageEl = root.querySelector(".percentage");
    const barEl = root.querySelector(".brightness-bar");
    const iconEl = root.querySelector(".icon");
    const haIconEl = root.querySelector("#main-icon");
    const contentEl = root.querySelector(".content");
    const cardContainer = root.querySelector(".card-container");

    // ── Contenu (texte, icône, barre) ──────────────────────────────
    if (icon) haIconEl.setAttribute("icon", icon);
    if (nameEl) nameEl.textContent = name;
    
    if (!this.isDragging && percentageEl) {
      percentageEl.textContent = (percentageText === "Off" || percentageText === "On" || percentageText === "Unavailable") 
        ? percentageText 
        : percentageText + "%";
    }

    if (!this.isDragging && barEl) {
      if (barWidth !== 0) {
        // Perf : la largeur dispo ne change qu'au resize → cachée (invalidée par le ResizeObserver).
        // Évite un getComputedStyle + lecture clientWidth (reflow synchrone) à chaque tick hass.
        if (this._contentWidth == null) {
          const buffer = 4;
          const paddingRight = parseFloat(getComputedStyle(contentEl).paddingRight) || 0;
          this._contentWidth = contentEl.clientWidth - buffer - paddingRight - _LEFT_OFFSET;
        }
        const cw = this._contentWidth;
        const effectiveWidth = (barWidth / 100) * cw;
        const totalWidth = Math.min(effectiveWidth + _LEFT_OFFSET, cw + _LEFT_OFFSET - 1);
        barEl.style.width = `${totalWidth}px`;
        // Fin de course : la barre se "tord" pour épouser l'arc de la card.
        // ratio 0 jusqu'à 88%, puis 0→1 entre 88% et 100% → arrondit le coin droit
        // de la barre jusqu'au radius de la card (border-right qui suit la courbe).
        const tail = Math.max(0, Math.min(1, (barWidth - 88) / 12));
        this.style.setProperty(
          "--bar-right-radius",
          tail > 0 ? `calc(${tail.toFixed(2)} * var(--ha-card-border-radius, 12px))` : "0px"
        );
        // Front : reste visible et se COURBE (via le border-radius du ::after qui
        // suit --bar-right-radius). On ne l'efface plus — il épouse l'arc du coin.
        // À 100% pile, léger fade pour ne pas surligner le bord parfaitement plein.
        this.style.setProperty("--front-opacity", barWidth >= 100 ? "0.35" : "0.9");
      } else {
        barEl.style.width = `0px`;
      }
    }

    // ── États et classes CSS ────────────────────────────────────────
    const isOn = (percentageText !== "Off" && percentageText !== "Unavailable");
    
    // Détecter transition d'état pour animation power
    if (this.config.icon_power_animation && this._lastState !== null && this._lastState !== isOn) {
      // Arrêter l'animation pending si elle est active
      if (this._pendingStateChange) {
        haIconEl.classList.remove('animating-pending');
        this._pendingStateChange = false;
      }
      
      // Lancer l'animation finale (powerOn ou powerOff)
      const animClass = isOn ? 'animating-power-on' : 'animating-power-off';
      haIconEl.classList.add(animClass);
      if (this._powerAnimTimer) clearTimeout(this._powerAnimTimer);
      this._powerAnimTimer = setTimeout(() => { haIconEl.classList.remove(animClass); this._powerAnimTimer = null; }, 500);
    }
    this._lastState = isOn;
    
    // État principal
    this.classList.remove("state-on", "state-off", "state-unavailable");
    if (percentageText === "Off") this.classList.add("state-off");
    else if (percentageText === "Unavailable") this.classList.add("state-unavailable");
    else this.classList.add("state-on");

    // Bordures
    iconEl.classList.toggle("no-border", !this.config.icon_border);
    contentEl.classList.toggle("no-border", !this.config.card_border);

    // Effets visuels
    this.classList.toggle("smart-contrast", !!this.config.smart_font_colour && !this.config.text_colour);
    this.classList.toggle("custom-text-colour", !!this.config.text_colour);
    if (this.config.text_colour) this.style.setProperty("--custom-text-colour", this.config.text_colour);
    this.classList.toggle("has-icon-colour", !!(this.config.icon_colour && isOn));
    this.classList.toggle("effect-intense-glow", !!(this.config.effect_intense_glow && isOn));
    this.classList.toggle("fx-colorpulse", !!(this.config.effect_heartbeat && isOn));
    cardContainer.classList.toggle("fx-flicker", !!(this.config.effect_flicker && isOn));
    cardContainer.classList.toggle("fx-glitch", !!this.config.effect_hover_glitch);
    root.querySelector(".scanlines").classList.toggle("active", !!this.config.effect_scanline);

    // ── v2.1 — options opt-in ───────────────────────────────────────
    this.classList.toggle("fill-plasma", this.config.fill_style === "plasma");
    this.classList.toggle("neon-border", this.config.neon_border === true);
    this.classList.toggle("power-fx", this.config.power_fx === true);
    // Power-down : flash bref de la barre au passage ON→OFF
    if (this.config.power_fx && this._lastState === true && isOn === false) {
      this.classList.add("powering-off");
      if (this._powerFxTimer) clearTimeout(this._powerFxTimer);
      this._powerFxTimer = setTimeout(() => this.classList.remove("powering-off"), 280);
    }

    // ── CSS Variables (couleurs dynamiques) ────────────────────────
    if (isOn) {
      if (primaryColour) this.style.setProperty("--light-primary-colour", primaryColour);
      if (secondaryColour) this.style.setProperty("--light-secondary-colour", secondaryColour);
      if (this.config.icon_colour) this.style.setProperty("--custom-icon-colour", this.config.icon_colour);
      
      // Flicker randomization (each card has unique timing)
      if (this.config.effect_flicker) {
        this.style.setProperty("--flicker-duration", `${this._flickerDuration}s`);
        this.style.setProperty("--flicker-delay", `${this._flickerDelay}s`);
      }
      
      // Smart contrast (calcul automatique du contraste)
      if (this.config.smart_font_colour) {
        const textColour = this._getTextColourForBackground(primaryColour);
        const optimalColour = (textColour === 'white') ? '#ffffff' : '#7a7a7aff';
        this.style.setProperty("--optimal-text-colour", optimalColour);
      }
      
      // Glow effect (box-shadow + corners)
      if (this.config.glow && primaryColour) {
        const rgbMatch = primaryColour.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const glowColor = rgbMatch 
          ? `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${Math.min(this.config.opacity * 0.6, 0.3)})`
          : `${primaryColour}40`.replace("rgb", "rgba").replace(")", ", 0.3)");
        
        this.style.setProperty('--glow-color', glowColor);
        if (!this.config.effect_heartbeat) {
          cardContainer.style.boxShadow = `0 0 24px 8px ${glowColor}, inset 0 0 20px rgba(0, 232, 255, 0.05)`;
        }
        cardContainer.classList.add('has-corners');
      } else {
        cardContainer.style.boxShadow = "none";
        cardContainer.classList.remove('has-corners');
      }
    } else {
      // État OFF : smart contrast pour texte off
      if (this.config.smart_font_colour) {
        const offBgColour = getComputedStyle(this).getPropertyValue('--off-background-colour').trim();
        const textColour = this._getTextColourForBackground(offBgColour);
        const optimalColour = (textColour === 'white') ? '#ffffff' : '#7a7a7aff';
        this.style.setProperty("--optimal-off-text-colour", optimalColour);
      }
      cardContainer.style.boxShadow = "none";
      cardContainer.classList.remove('has-corners');
    }

    // ── Styles dynamiques (non-CSS) ─────────────────────────────────
    this.style.transformOrigin = "center";
    contentEl.style.opacity = this.config.opacity;
    iconEl.style.opacity = 1;
    
    // Blur conditionnel (off_blur si défini et état OFF)
    const blurValue = (!isOn && this.config.off_blur !== undefined) ? this.config.off_blur : this.config.blur;
    root.querySelector(".card").style.backdropFilter = `blur(${blurValue}px)`;
    
    if (iconEl.classList.contains("no-border")) {
      const shadowOpacity = 0.2 + (1 - this.config.opacity) * 0.4;
      iconEl.style.boxShadow = `rgba(0, 0, 0, ${shadowOpacity}) 0px 5px 15px`;
    }
  }

  getCardSize() { return 1; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Visual Editor (Native HTML)
// ─────────────────────────────────────────────────────────────────────────────

// Template unifié — cf \\192.168.1.60\config\CARDS-EDITOR-TEMPLATE.md
// N'éditer QUE _schema() ; le reste est canonique. Helpers spécifiques à cette
// card conservés : _toggleVal (toggle→valeur string), _actionSelect (tap actions).
class NeonCompactLightCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  set hass(h) { this._hass = h; this._fillDatalists(); }
  disconnectedCallback() { this._rendered = false; }

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
      const parent = parts.slice(0, -1).reduce((a, k) => a && a[k], this._config);
      if (parent && typeof parent === 'object' && !Object.keys(parent).length) delete this._config[parts[0]];
    } else if (empty) { delete this._config[key]; }
    else { this._config[key] = value; }
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
  }

  _syncValues() {
    const active = this.querySelector(':focus') || document.activeElement;
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el === active) return;
      const v = this._read(el.dataset.key);
      if (el.type === 'checkbox') el.checked = el.dataset.defaultOn ? (v !== false) : (v === true);
      else {
        el.value = (v == null ? '' : v);
        if (el._pick) el._pick.value = this._toHex(el.value) || (el._cssDefault ? this._resolveColor(el._cssDefault) : null) || '#00E8FF';
      }
    });
    // toggles à valeur string (fill_style=plasma…)
    this.querySelectorAll('input[data-val-key]').forEach(cb => {
      if (cb === active) return;
      cb.checked = this._config[cb.dataset.valKey] === cb.dataset.onValue;
    });
    // action selects (valeur config = {action})
    this.querySelectorAll('select[data-action-key]').forEach(sel => {
      if (sel === active) return;
      sel.value = this._config[sel.dataset.actionKey]?.action || 'none';
    });
    this._bindIconPreviews(true);
  }

  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; this.appendChild(d); return d; }

  _text(key, label, ph = '') {
    const w = this._row(label).wrap;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key; inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    w.appendChild(inp); return inp;
  }

  _number(key, label, { min, max, step = 1, ph = '' } = {}) {
    const w = this._row(label).wrap;
    const inp = document.createElement('input');
    inp.type = 'number'; if (min != null) inp.min = min; if (max != null) inp.max = max;
    inp.step = step; inp.placeholder = ph; inp.dataset.key = key; inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => { const n = parseFloat(inp.value); this._set(key, isNaN(n) ? undefined : n); });
    w.appendChild(inp); return inp;
  }

  _toggle(key, label, defaultOn = false) {
    const w = this._row(label).wrap;
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.dataset.key = key;
    if (defaultOn) cb.dataset.defaultOn = '1';
    const v = this._read(key); cb.checked = defaultOn ? (v !== false) : (v === true);
    cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
    cb.addEventListener('change', () => this._set(key, cb.checked));
    w.appendChild(cb); return cb;
  }

  // Toggle qui écrit une valeur string (ex fill_style="plasma") au lieu d'un booléen.
  _toggleVal(key, label, onValue) {
    const w = this._row(label).wrap;
    const cb = document.createElement('input'); cb.type = 'checkbox';
    cb.dataset.valKey = key; cb.dataset.onValue = onValue;
    cb.checked = this._config[key] === onValue;
    cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
    cb.addEventListener('change', () => this._set(key, cb.checked ? onValue : undefined));
    w.appendChild(cb); return cb;
  }

  // cssDefault = couleur appliquée quand le champ est vide → picker la montre résolue.
  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
    const w = this._row(label).wrap;
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key; txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    txt._pick = pick; txt._cssDefault = cssDefault;
    const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#00E8FF'; };
    txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
    pick.addEventListener('input', () => { txt.value = pick.value; this._set(key, pick.value); });
    box.appendChild(txt); box.appendChild(pick); w.appendChild(box); refresh(); return txt;
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
    const w = this._row(`${label} — <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener" class="mdi-link">parcourir ↗</a>`, true).wrap;
    const box = document.createElement('div'); box.className = 'icon-row';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:lightbulb'; inp.dataset.key = key; inp.value = this._read(key) ?? '';
    const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
    inp.addEventListener('input', () => this._set(key, inp.value));
    box.appendChild(inp); box.appendChild(prev); w.appendChild(box); return inp;
  }

  _entity(key, label, prefix = '') {
    const w = this._row(label).wrap;
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `ncl-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value.trim()));
    w.appendChild(inp); return inp;
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

  // Select d'action (valeur config = {action}). options = [{v,l}].
  _actionSelect(key, label, options) {
    const w = this._row(label).wrap;
    const sel = document.createElement('select'); sel.dataset.actionKey = key;
    options.forEach(({ v, l }) => { const o = document.createElement('option'); o.value = v; o.textContent = l; sel.appendChild(o); });
    sel.value = this._config[key]?.action || 'none';
    sel.addEventListener('change', () => { const v = sel.value; this._set(key, (!v || v === 'none') ? undefined : { action: v }); });
    w.appendChild(sel); return sel;
  }

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
      if (dl.childElementCount === ids.length) return;
      dl.textContent = '';
      const frag = document.createDocumentFragment();
      ids.forEach(id2 => { const o = document.createElement('option'); o.value = id2;
        const fn = this._hass.states[id2].attributes?.friendly_name; if (fn && fn !== id2) o.label = fn; frag.appendChild(o); });
      dl.appendChild(frag);
    });
  }

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

  _render() {
    this.innerHTML = '';
    const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
    this._schema();
    this._fillDatalists();
    this._bindIconPreviews();
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║  SCHÉMA — spécifique à la card                                  ║
  // ╚════════════════════════════════════════════════════════════════╝
  _schema() {
    this._section('Entité & icône');
    this._entity('entity', 'Light Entity *', 'light');
    this._icon('icon', 'Icône (mdi)');
    this._text('name', 'Nom affiché', 'Vide = friendly_name');

    this._section('Effets visuels');
    this._toggle('glow', 'Glow Effect', true);
    this._toggle('effect_heartbeat', '✦ Color pulse (when on)', true);
    this._toggle('effect_intense_glow', '✧ Intense Glow');
    this._toggle('effect_scanline', '≡ Scanlines');
    this._toggle('effect_flicker', '↺ Flicker');
    this._toggle('effect_hover_glitch', '⚡ Glitch on hover');
    this._toggle('icon_power_animation', '⚙ Icon power animation', true);
    this._toggle('smart_font_colour', 'Smart Font Color', true);
    this._number('opacity', 'Opacity (0.2–1)', { min: 0.2, max: 1, step: 0.05, ph: '0.85' });
    this._number('blur', 'Blur px (0–10)', { min: 0, max: 10, step: 1, ph: '6' });
    this._number('off_blur', 'Blur OFF px', { min: 0, max: 10, step: 1, ph: 'idem blur' });

    this._section('Neo Tokyo FX');
    this._toggleVal('fill_style', '🌈 Plasma fill bar', 'plasma');
    this._toggle('neon_border', '▞ Neon border (UV→cyan)');
    this._toggle('power_fx', '⚡ Power-down flash');

    this._section('Couleurs (override)');
    this._hint('Vide = couleur RGB propre de la lampe.');
    this._color('primary_colour', 'Primary (On)', null, 'défaut : couleur RGB de la lampe — ex #00E8FF');
    this._color('secondary_colour', 'Secondary (BG)', null, 'défaut : auto — ex rgb(var(--rgb-lavande))');
    this._color('icon_colour', 'Icon (override)', null, 'défaut : couleur primaire — ex #FF3366');

    this._section('Chevron Actions');
    const actions = [
      { v: 'hass-more-info', l: 'More Info' },
      { v: 'toggle', l: 'Toggle' },
      { v: 'navigate', l: 'Navigate (YAML)' },
      { v: 'url', l: 'Open URL (YAML)' },
      { v: 'call-service', l: 'Call Service (YAML)' },
      { v: 'perform-action', l: 'Perform Action (YAML)' },
      { v: 'none', l: 'None' },
    ];
    this._actionSelect('chevron_action', 'Tap Action', actions);
    this._actionSelect('chevron_hold_action', 'Hold Action', actions);
    this._actionSelect('chevron_double_tap_action', 'Double-Tap', actions);
    this._hint('navigate / url / call-service : passer en YAML pour les params.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Registration
// ─────────────────────────────────────────────────────────────────────────────

if (!customElements.get("neon-compact-light-card-editor")) customElements.define("neon-compact-light-card-editor", NeonCompactLightCardEditor);
if (!customElements.get("neon-compact-light-card")) customElements.define("neon-compact-light-card", NeonCompactLightCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "neon-compact-light-card",
  name: "Neon Compact Light Card",
  description: "A compact light card with brightness drag and chevron actions.",
  preview: true,
});

console.info(
  "%c NEON-COMPACT-LIGHT-CARD %c loaded ",
  "color:#00ff9f;font-weight:bold;background:#000",
  "color:#fff;background:#444",
);

console.info(
  '%c 💡 neon-compact-light-card v2.0 %c Neo Tokyo ',
  'background:#FFEE58;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#FF6B00;padding:2px 4px;border-radius:0 3px 3px 0;'
);
