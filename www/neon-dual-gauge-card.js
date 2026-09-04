/**
 * ============================================================================
 * NEON DUAL GAUGE CARD - Standalone Version (Non-compiled)
 * Version: 2.0.0 - Universal Theme Inheritance Edition
 * ============================================================================
 * 
 * A highly customizable dual concentric LED gauge card for Home Assistant with
 * stunning cyberpunk/neon visual effects, smooth animations, and full theme
 * inheritance. Perfect for displaying two related metrics in a compact space.
 * 
 * ============================================================================
 * KEY FEATURES
 * ============================================================================
 * 
 * 🎨 DUAL CONCENTRIC GAUGES
 *    - Display two metrics in one compact circular gauge
 *    - Inner and outer LED rings with independent configuration
 *    - Configurable LED count, size, colors, and animations
 *    - Smart bidirectional mode for positive/negative values
 * 
 * 🌈 THEME INHERITANCE
 *    - Automatically inherits all colors from your active Home Assistant theme
 *    - Seamless integration with card-mod and custom themes
 *    - Override any style with custom configuration options
 *    - Supports light, dark, and custom theme modes
 * 
 * ✨ VISUAL EFFECTS
 *    - Cyberpunk neon glow effects with customizable colors
 *    - RGB chromatic glitch effect on hover/touch
 *    - Smooth pulsing animations
 *    - Top accent glow line
 *    - Dynamic shadows that follow LED colors
 * 
 * 🎯 ADVANCED FEATURES
 *    - Severity zones: color LEDs based on value ranges
 *    - Smooth transitions with easing animations
 *    - Markers: add reference points with labels
 *    - Colored zones: highlight specific value ranges
 *    - Bidirectional mode: display positive/negative values
 *    - Power save mode: pause updates when not visible
 * 
 * ⚡ PERFORMANCE OPTIMIZED
 *    - GPU-accelerated animations
 *    - Efficient LED updates with CSS variables
 *    - RequestAnimationFrame for smooth 60 FPS
 *    - Intersection Observer for power saving
 *    - Debounced updates to reduce CPU usage
 * 
 * 📱 RESPONSIVE & ACCESSIBLE
 *    - Works on desktop, tablet, and mobile devices
 *    - Touch-optimized for kiosk mode
 *    - Respects prefers-reduced-motion setting
 *    - Click gauge values to view entity history
 * 
 * ============================================================================
 * INSTALLATION
 * ============================================================================
 * 
 * 1. Copy this file to /config/www/neon-dual-gauge-card.js
 * 2. Add resource in Home Assistant:
 *    - Settings → Dashboards → Resources
 *    - Add Resource: /local/neon-dual-gauge-card.js
 *    - Resource type: JavaScript Module
 * 3. Refresh your browser (Ctrl+F5)
 * 4. Add the card to your dashboard
 * 
 * ============================================================================
 * QUICK START EXAMPLE
 * ============================================================================
 * 
 * type: custom:neon-dual-gauge-card
 * name: "Climate Control"
 * gauge_size: 200
 * gauges:
 *   - entity: sensor.living_room_temperature
 *     min: 0
 *     max: 40
 *     unit: "°C"
 *     leds_count: 100
 *     severity:
 *       - color: "#2196F3"
 *         value: 18
 *       - color: "#4CAF50"
 *         value: 24
 *       - color: "#FF5722"
 *         value: 40
 *   - entity: sensor.living_room_humidity
 *     min: 0
 *     max: 100
 *     unit: "%"
 *     leds_count: 100
 *     severity:
 *       - color: "#FFC107"
 *         value: 30
 *       - color: "#4CAF50"
 *         value: 60
 *       - color: "#2196F3"
 *         value: 100
 * 
 * ============================================================================
 * YAML CONFIGURATION REFERENCE
 * ============================================================================
 * 
 * CARD-LEVEL CONFIGURATION:
 * -------------------------
 * type: custom:neon-dual-gauge-card
 * name: "Card Title"                    # Optional card title
 * title_position: "bottom"              # "top" | "bottom" | "inside-top" | "inside-bottom" | "none"
 * title_font_size: "16px"               # Title font size
 * title_font_family: "inherit"          # Title font family
 * title_font_weight: "normal"           # Title font weight
 * title_font_color: "var(--primary-text-color)"  # Title color
 * 
 * gauge_size: 200                       # Outer gauge diameter in pixels
 * inner_gauge_size: 130                 # Inner gauge diameter (default: 65% of gauge_size)
 * inner_gauge_radius: 65                # Radius for inner LED placement
 * 
 * primary_gauge: "inner"                # "inner" | "outer" - Which gauge displays larger
 * 
 * hide_card: false                      # Hide card frame (transparent background)
 * hide_shadows: false                   # Disable all shadows
 * 
 * update_interval: 1000                 # Update frequency in ms
 * power_save_mode: false                # Pause updates when card not visible
 * debounce_updates: false               # Debounce state updates
 * 
 * THEME OVERRIDES (optional - inherits from card-mod by default):
 * ---------------------------------------------------------------
 * card_theme: "default"                                           # "default" | "light" | "dark" | "custom"
 * custom_background: "var(--card-background-color)"           # Card background
 * custom_gauge_background: "radial-gradient(...)"             # Gauge area background
 * custom_center_background: "var(--card-background-color)"    # Center circle background
 * custom_text_color: "var(--primary-text-color)"              # Primary text color
 * custom_secondary_text_color: "var(--secondary-text-color)"  # Secondary text color
 * 
 * CUSTOM EFFECTS (all enabled by default, set false to disable):
 * --------------------------------------------------------------
 * enable_custom_effects: true           # Enable all custom effects
 * enable_top_glow: true                 # Top accent glow line
 * enable_pulse_animation: true          # Subtle pulsing animation
 * enable_glitch_hover: true             # Glitch effect on hover/touch
 * 
 * GAUGES ARRAY (exactly 2 required):
 * ----------------------------------
 * gauges:
 *   - entity: "sensor.inner_entity"     # Home Assistant entity ID (REQUIRED)
 *     min: 0                             # Minimum value (default: 0)
 *     max: 100                           # Maximum value (default: 100)
 *     unit: "°C"                         # Unit display
 *     decimals: 1                        # Decimal places (default: 1)
 *     
 *     leds_count: 100                    # Number of LEDs (default: 100)
 *     led_size: 6                        # LED diameter in pixels
 *     hide_inactive_leds: false          # Hide inactive LEDs
 *     
 *     smooth_transitions: true           # Animate value changes
 *     animation_duration: 800            # Animation duration in ms
 *     
 *     bidirectional: false               # Enable bidirectional mode (+ and -)
 *                                        # Reference point: 0 if range crosses zero,
 *                                        # otherwise midpoint between min/max
 *     
 *     INDIVIDUAL GAUGE THEME:
 *     ----------------------
 *     theme: "default"                   # "default" | "light" | "dark" | "custom"
 *     custom_background: "#f0f0f0"
 *     custom_gauge_background: "radial-gradient(...)"
 *     custom_center_background: "radial-gradient(...)"
 *     custom_text_color: "#333"
 *     custom_secondary_text_color: "#666"
 *     
 *     VALUE/UNIT STYLING:
 *     ------------------
 *     value_font_size: "24px"            # Value font size
 *     value_font_weight: "bold"          # Value font weight
 *     value_font_color: "var(--primary-text-color)"  # Value color
 *     value_font_family: "inherit"       # Value font family
 *     
 *     unit_font_size: "14px"             # Unit font size
 *     unit_font_weight: "normal"         # Unit font weight
 *     unit_font_color: "var(--secondary-text-color)"  # Unit color
 *     
 *     SEVERITY ZONES (color by value):
 *     --------------------------------
 *     severity:                          # Define color thresholds
 *       - color: "#4caf50"               # Green
 *         value: 33                      # Up to 33% (or real value if min/max set)
 *       - color: "#ff9800"               # Orange
 *         value: 66                      # 33-66%
 *       - color: "#f44336"               # Red
 *         value: 100                     # 66-100%
 *     
 *     SHADOWS:
 *     --------
 *     enable_shadow: false               # Enable gauge container shadow
 *     center_shadow: false               # Enable center circle shadow
 *     center_shadow_blur: 30             # Center shadow blur radius
 *     center_shadow_spread: 15           # Center shadow spread
 *     outer_shadow: false                # Enable outer gauge shadow
 *     outer_shadow_blur: 30              # Outer shadow blur radius
 *     outer_shadow_spread: 15            # Outer shadow spread
 *     
 *     MARKERS:
 *     --------
 *     markers:                           # Add value markers
 *       - value: 50                      # Value position
 *         color: "#ffffff"               # Marker color
 *         label: "50°"                   # Optional label text
 *     markers_radius: 65                 # Distance from center (default: LED radius)
 *     
 *     ZONES:
 *     ------
 *     zones:                             # Add colored arc zones
 *       - from: 20                       # Start value
 *         to: 80                         # End value
 *         color: "#00ff00"               # Zone color
 *         opacity: "0.3"                 # Zone opacity
 * 
 *   - entity: "sensor.outer_entity"     # Second gauge (outer ring)
 *     # ... same options as first gauge
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CARD_VERSION = '2.0.1';

// Device detection — auto-enable debounce on low-power tablets
const IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_LOW_POWER = IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function getTheme(config) {
  // Valeurs par défaut qui héritent complètement du thème HA actif
  const defaults = {
    background: 'var(--card-background-color)',
    gaugeBackground: 'radial-gradient(circle, rgba(var(--rgb-primary-color, 0, 232, 255), 0.15), rgba(var(--rgb-primary-color, 0, 232, 255), 0.05))',
    centerBackground: 'radial-gradient(circle, rgba(var(--rgb-card-background-color, 30, 20, 45), 0.95), rgba(26, 21, 37, 1))',
    textColor: 'var(--primary-text-color)',
    secondaryTextColor: 'var(--secondary-text-color)'
  };

  return {
    background: config.custom_background || defaults.background,
    gaugeBackground: config.custom_gauge_background || defaults.gaugeBackground,
    centerBackground: config.custom_center_background || defaults.centerBackground,
    textColor: config.custom_text_color || defaults.textColor,
    secondaryTextColor: config.custom_secondary_text_color || defaults.secondaryTextColor
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// System / generic font families that don't need loading
const SYSTEM_FONTS = new Set([
  'inherit', 'initial', 'unset', 'revert', 'serif', 'sans-serif', 'monospace',
  'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace',
  'ui-rounded', 'emoji', 'math', 'fangsong',
  'arial', 'helvetica', 'verdana', 'georgia', 'times new roman', 'times',
  'courier new', 'courier', 'tahoma', 'trebuchet ms', 'impact', 'comic sans ms',
  'segoe ui', 'roboto', 'helvetica neue', 'sf pro', 'sf pro display',
]);

// Track which fonts have already been injected to avoid duplicates
const _loadedFonts = new Set();

/**
 * Load Google Fonts for any custom font families found in the config.
 * Injects a <link> into the document <head>; @font-face declarations there
 * are inherited by Shadow DOM elements.
 */
function loadConfigFonts(config) {
  const fonts = new Set();

  // Collect all font-family values from config
  const collect = (val) => {
    if (!val || typeof val !== 'string') return;
    // Strip quotes and trim
    const cleaned = val.replace(/["']/g, '').trim().toLowerCase();
    if (cleaned && !SYSTEM_FONTS.has(cleaned) && !cleaned.startsWith('var(')) {
      // Use the original (non-lowercased) value for the Google Fonts URL
      fonts.add(val.replace(/["']/g, '').trim());
    }
  };

  collect(config.title_font_family);
  if (config.gauges && Array.isArray(config.gauges)) {
    for (const g of config.gauges) {
      collect(g.value_font_family);
      collect(g.unit_font_family);
    }
  }

  // Inject Google Fonts link for each new font
  for (const font of fonts) {
    if (_loadedFonts.has(font)) continue;
    _loadedFonts.add(font);

    const encoded = font.replace(/ /g, '+');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getLedColor(value, severity, min, max) {
  // Valeurs par défaut basées sur le pourcentage (0-100%)
  const defaultSeverity = [
    { color: "#4caf50", value: 33 },
    { color: "#ff9800", value: 66 },
    { color: "#f44336", value: 100 },
  ];

  const severityConfig = severity || defaultSeverity;

  // Si min et max sont fournis, convertir la valeur normalisée (0-100%) en valeur réelle
  if (min !== undefined && max !== undefined) {
    // Convertir le pourcentage (value) en valeur réelle
    const realValue = min + (value / 100) * (max - min);

    // Parcourir les seuils et comparer directement avec les valeurs réelles
    for (const zone of severityConfig) {
      if (realValue <= zone.value) {
        return zone.color;
      }
    }

    // Si aucun seuil n'est atteint, retourner la dernière couleur
    return severityConfig[severityConfig.length - 1]?.color || "#555";
  }

  // Mode compatibilité : utiliser les pourcentages (sans min/max)
  for (const zone of severityConfig) {
    if (value <= zone.value) {
      return zone.color;
    }
  }

  return severityConfig[severityConfig.length - 1]?.color || "#555";
}

function optimizeLEDs(configuredCount) {
  return configuredCount || 100;
}

/**
 * Calculate bidirectional LED activation
 * @param {number} value - Current value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} ledsCount - Total number of LEDs
 * @param {boolean} bidirectional - Enable bidirectional mode
 * @returns {Object} Object with activeLeds count and direction ('positive', 'negative', or 'unidirectional')
 */
function safeNormalize(value, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function calculateBidirectionalLeds(value, min, max, ledsCount, bidirectional) {
  // Clamp value to min/max range
  value = Math.max(min, Math.min(max, value));

  // Calculate full-range normalized value for severity colors (always needed)
  const fullRangeNormalized = safeNormalize(value, min, max);

  if (!bidirectional) {
    // Standard unidirectional behavior
    const activeLeds = Math.round((fullRangeNormalized / 100) * ledsCount);
    return {
      activeLeds,
      direction: 'unidirectional',
      normalizedValue: fullRangeNormalized
    };
  }

  // Bidirectional mode: reference point is at the top (LED index 0)
  // Values above reference go clockwise (to the right)
  // Values below reference go counter-clockwise (to the left)

  // Determine reference point (adaptive zero)
  const referencePoint = (min <= 0 && max >= 0) ? 0 : (min + max) / 2;

  // Calculate range sizes on each side of reference
  const totalRange = max - min;
  if (totalRange === 0) {
    return { activeLeds: 0, direction: 'unidirectional', normalizedValue: fullRangeNormalized };
  }
  const lowerRange = referencePoint - min;  // Size from min to reference
  const upperRange = max - referencePoint;  // Size from reference to max

  // Calculate proportional LED allocation
  const lowerProportion = lowerRange / totalRange;
  const upperProportion = upperRange / totalRange;

  if (value >= referencePoint) {
    // Upper values: calculate percentage from reference to max
    const percentage = upperRange > 0 ? ((value - referencePoint) / upperRange) * 100 : 0;
    // Allocate LEDs proportionally based on upper range's share of total
    const maxUpperLeds = ledsCount * upperProportion;
    const activeLeds = Math.round((percentage / 100) * maxUpperLeds);

    return {
      activeLeds,
      direction: 'positive',
      normalizedValue: fullRangeNormalized  // Use full-range for severity colors
    };
  } else {
    // Lower values: calculate percentage from reference to min
    const percentage = lowerRange > 0 ? ((referencePoint - value) / lowerRange) * 100 : 0;
    // Allocate LEDs proportionally based on lower range's share of total
    const maxLowerLeds = ledsCount * lowerProportion;
    const activeLeds = Math.round((percentage / 100) * maxLowerLeds);

    return {
      activeLeds,
      direction: 'negative',
      normalizedValue: fullRangeNormalized  // Use full-range for severity colors
    };
  }
}

/**
 * Convert value to angle based on bidirectional or unidirectional mode
 * @param {number} value - The value to convert
 * @param {number} min - Minimum range value
 * @param {number} max - Maximum range value
 * @param {boolean} bidirectional - Whether bidirectional mode is enabled
 * @returns {number} Angle in degrees (0-360)
 */
function valueToAngle(value, min, max, bidirectional) {
  if (!bidirectional) {
    // Unidirectional mode: simple linear mapping
    const percentage = safeNormalize(value, min, max);
    return (percentage / 100) * 360;
  }

  // Bidirectional mode: proportional allocation with adaptive reference point

  // Determine reference point (adaptive zero)
  const referencePoint = (min <= 0 && max >= 0) ? 0 : (min + max) / 2;

  // Calculate range sizes on each side of reference
  const totalRange = max - min;
  const lowerRange = referencePoint - min;  // Size from min to reference
  const upperRange = max - referencePoint;  // Size from reference to max

  // Calculate proportional angle allocation (total 360°)
  const lowerProportion = lowerRange / totalRange;
  const upperProportion = upperRange / totalRange;
  const maxLowerAngle = lowerProportion * 360;  // Degrees allocated to lower side
  const maxUpperAngle = upperProportion * 360;  // Degrees allocated to upper side

  if (value >= referencePoint) {
    // Upper values: go clockwise from top (0° to maxUpperAngle)
    const percentage = upperRange > 0 ? ((value - referencePoint) / upperRange) * 100 : 0;
    return (percentage / 100) * maxUpperAngle;
  } else {
    // Lower values: go counter-clockwise from top (360° to 360° - maxLowerAngle)
    const percentage = lowerRange > 0 ? ((referencePoint - value) / lowerRange) * 100 : 0;
    return 360 - ((percentage / 100) * maxLowerAngle);
  }
}

// ============================================================================
// STYLES
// ============================================================================

const stylesCSS = `
/* ha-card handles: background, border, border-radius, box-shadow,
   backdrop-filter, overflow — all via card-mod / theme. */
ha-card {
  position: relative;
  overflow: visible;
  cursor: pointer;
}

.gauge-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  
  /* CSS vars for LED colors - set dynamically per gauge */
  --active-led-color-inner: #4caf50;
  --active-led-color-outer: #4caf50;
}

/* Custom effects applied on ha-card when .custom-effects is present */
:host(.custom-effects) ha-card {
  --card-contrast: 1.04;
  --card-saturate: 1.10;
  --card-brightness: 1;
  filter: contrast(var(--card-contrast)) saturate(var(--card-saturate)) brightness(var(--card-brightness));
  /* Exclude box-shadow from transitions so it doesn't fight the pulse animation */
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.5s ease,
              filter 0.3s ease;
}

/* Pseudo-element pour le top glow (optionnel via enable_top_glow) */
:host(.with-top-glow) ha-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--accent-color, #E946FF) 50%, transparent 100%);
  opacity: 0.6;
  box-shadow: 0 0 8px rgba(var(--rgb-accent-color, 233, 70, 255), 0.4);
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 1;
}

.gauge-card.has-inside-title {
  position: relative;
}

.gauge-card.has-inside-title .gauge {
  position: relative;
}

:host(.no-card) ha-card {
  background: transparent !important;
  border-radius: 0;
  box-shadow: none !important;
  border: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  filter: none !important;
  animation: none !important;
}

:host(.no-card) ha-card::before {
  display: none;
}

.gauge-card.no-card {
  padding: 0;
}

/* ========== ANIMATIONS CUSTOM (seulement si enable_custom_effects: true) ========== */

/* Animation neon pulse — uses a separate ::after layer so hover box-shadow
   doesn't stomp it and transitions don't fight the animation keyframes. */
@keyframes neonPulseCustom {
  0%, 100% {
    opacity: var(--pulse-min-opacity, 0.4);
  }
  50% {
    opacity: 1;
  }
}

:host(.animate-pulse) ha-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: 0 0 var(--pulse-spread-1, 20px) rgba(var(--rgb-state-active-color, 255, 80, 160), var(--pulse-alpha-1, 0.25)),
              0 0 var(--pulse-spread-2, 45px) rgba(var(--rgb-primary-color, 0, 232, 255), var(--pulse-alpha-2, 0.12));
  animation: neonPulseCustom var(--pulse-speed, 4s) ease-in-out infinite;
  z-index: 0;
}

/* Hover effects custom (desktop) */
@media (hover: hover) {
  :host(.custom-effects) ha-card:hover {
    --card-contrast: 1.12;
    --card-saturate: 1.25;
    --card-brightness: 1.08;
    transform: translateY(-10px) scale(1.03) translateZ(0);
    box-shadow: 0 0 50px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.7), 
                0 0 80px rgba(var(--rgb-accent-color, 233, 70, 255), 0.5), 
                0 0 120px rgba(var(--rgb-primary-color, 0, 232, 255), 0.4);
    border-color: rgba(var(--rgb-primary-color, 0, 232, 255), var(--border-opacity-hover, 0.4));
  }

  /* Pause the pulse glow while hovering so it doesn't fight the hover glow */
  :host(.animate-pulse) ha-card:hover::after {
    animation-play-state: paused;
    opacity: 0;
  }
  
  :host(.custom-effects.glitch-hover) ha-card:hover {
    animation: containerGlitchCustom 0.8s ease forwards;
  }
  
  :host(.custom-effects.with-top-glow) ha-card:hover::before {
    opacity: 1;
  }
  
  :host(.custom-effects.glitch-hover) ha-card:hover .title {
    animation: nameGlitchCustom 0.8s ease;
    text-shadow: 0 0 8px currentColor, 0 0 15px currentColor;
  }
}

@keyframes containerGlitchCustom {
  0%, 100% { transform: translateY(-10px) scale(1.03) translateZ(0); }
  12% { transform: translateY(-10px) scale(1.03) translate(-4px, 3px) translateZ(0); }
  24% { transform: translateY(-10px) scale(1.03) translate(4px, -3px) translateZ(0); }
  36% { transform: translateY(-10px) scale(1.03) translate(-3px, -2px) translateZ(0); }
  48% { transform: translateY(-10px) scale(1.03) translate(3px, 2px) translateZ(0); }
  60% { transform: translateY(-10px) scale(1.03) translate(-2px, 0) translateZ(0); }
  72% { transform: translateY(-10px) scale(1.03) translate(2px, -1px) translateZ(0); }
  84% { transform: translateY(-10px) scale(1.03) translate(-1px, 1px) translateZ(0); }
}

@keyframes nameGlitchCustom {
  0%, 100% { 
    transform: translate(0) translateZ(0); 
    text-shadow: 0 0 5px currentColor;
  }
  15% { 
    transform: translate(-3px, 0) translateZ(0); 
    text-shadow: 4px 0 15px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.8), 
                 -4px 0 15px rgba(var(--rgb-accent-color, 233, 70, 255), 0.8);
  }
  30% { 
    transform: translate(3px, 0) translateZ(0); 
    text-shadow: -4px 0 15px rgba(var(--rgb-dark-primary-color, 255, 0, 144), 0.8), 
                 4px 0 15px rgba(var(--rgb-primary-color, 0, 232, 255), 0.8);
  }
  45% { 
    transform: translate(-2px, 0) translateZ(0); 
    text-shadow: 3px 3px 15px rgba(var(--rgb-accent-color, 233, 70, 255), 0.8), 
                 -3px -3px 15px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.8);
  }
  60% { 
    transform: translate(2px, 0) translateZ(0); 
    text-shadow: -2px 2px 15px rgba(var(--rgb-primary-color, 0, 232, 255), 0.8), 
                 2px -2px 15px rgba(var(--rgb-dark-primary-color, 255, 0, 144), 0.8);
  }
  75% { 
    transform: translate(-1px, 0) translateZ(0); 
    text-shadow: 2px 0 15px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.8), 
                 -2px 0 15px rgba(var(--rgb-accent-color, 233, 70, 255), 0.8);
  }
  90% { 
    transform: translate(1px, 0) translateZ(0); 
    text-shadow: 0 0 12px rgba(var(--rgb-accent-color, 233, 70, 255), 0.8);
  }
}

/* Touch effects custom (kiosk/iPad) */
@media (min-width: 768px) and (min-height: 1000px) and (hover: none) and (pointer: coarse) {
  :host(.custom-effects) ha-card {
    --card-contrast: 1.06;
    --card-saturate: 1.12;
    --card-brightness: 1.03;
  }
  
  :host(.custom-effects.with-top-glow) ha-card::before {
    height: 3px;
    box-shadow: 0 0 12px rgba(var(--rgb-accent-color, 233, 70, 255), 0.5);
  }
  
  :host(.custom-effects) ha-card:active {
    --card-contrast: 1.08;
    --card-saturate: 1.15;
    --card-brightness: 1.06;
    transform: scale(var(--kiosk-touch-scale, 0.97)) translateZ(0);
    box-shadow: 0 0 40px rgba(var(--rgb-state-active-color, 255, 80, 160), var(--glow-opacity-active, 0.5)), 
                0 0 60px rgba(var(--rgb-accent-color, 233, 70, 255), var(--glow-opacity-hover, 0.3)),
                inset 0 0 20px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.1) !important;
  }
  
  :host(.custom-effects.glitch-hover) ha-card:active {
    animation: touchBurstCustom 0.5s ease forwards;
  }
  
  :host(.custom-effects.glitch-hover) ha-card:active .title {
    animation: nameTouchGlowCustom 0.5s ease;
  }
}

@keyframes touchBurstCustom {
  0% { transform: scale(var(--kiosk-touch-scale, 0.97)) translateZ(0); }
  50% { 
    transform: scale(0.96) translateZ(0);
    box-shadow: 0 0 45px rgba(var(--rgb-state-active-color, 255, 80, 160), var(--glow-opacity-active, 0.5)),
                0 0 70px rgba(var(--rgb-accent-color, 233, 70, 255), var(--glow-opacity-hover, 0.3)),
                inset 0 0 25px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.15) !important;
  }
  100% { transform: scale(var(--kiosk-touch-scale, 0.97)) translateZ(0); }
}

@keyframes nameTouchGlowCustom {
  0%, 100% { text-shadow: 0 0 8px currentColor; }
  50% { 
    text-shadow: 0 0 12px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.9), 
                 0 0 20px rgba(var(--rgb-accent-color, 233, 70, 255), 0.5);
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  ha-card,
  ha-card::before,
  ha-card .title {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}

/* ========== KIOSK / TABLET THERMAL MODE ========== */
/* When :host(.kiosk-mode) is set, strip the heaviest GPU work:
   - Remove per-LED transitions and glow box-shadows
   - Simplify active LED to a flat color (no radial-gradient)
   - Kill backdrop-filter on labels
   - Disable continuous pulse animation
   - Remove filter() on the card
   - Reduce shadow complexity */
:host(.kiosk-mode) ha-card {
  filter: none !important;
}

:host(.kiosk-mode) ha-card::after {
  animation: none !important;
  display: none;
}

:host(.kiosk-mode) .led {
  transition: none;
  box-shadow: none !important;
}

:host(.kiosk-mode) .led[id^="led-inner-"].active {
  background: var(--active-led-color-inner);
  box-shadow: none !important;
}

:host(.kiosk-mode) .led[id^="led-outer-"].active {
  background: var(--active-led-color-outer);
  box-shadow: none !important;
}

/* ── Tête de comète + traînée (enable_comet_head) ─────────────────────────
   Halo ::after surdimensionné : reste visible même quand les LEDs se
   chevauchent en ruban continu (200 LEDs / rayon 105 → 3,3 px d'espacement).
   Pas de transform ici — il porte déjà le positionnement rotate/translate. */
.led.active.head { z-index: 2; }
.led.active.head::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255,255,255,0.95) 0%,
    rgba(255,255,255,0.55) 30%,
    transparent 68%);
  pointer-events: none;
}
.led[id^="led-inner-"].active.head {
  background: radial-gradient(circle, #ffffff 0%, var(--active-led-color-inner) 75%);
  box-shadow: 0 0 14px #ffffff, 0 0 26px var(--active-led-color-inner);
}
.led[id^="led-outer-"].active.head {
  background: radial-gradient(circle, #ffffff 0%, var(--active-led-color-outer) 75%);
  box-shadow: 0 0 14px #ffffff, 0 0 26px var(--active-led-color-outer);
}
/* Traînée : gradient de luminosité, lisible sur ruban chevauché */
.led.active.tr1 { filter: brightness(1.65); z-index: 1; }
.led.active.tr2 { filter: brightness(1.40); }
.led.active.tr3 { filter: brightness(1.18); }

/* ── Graduations gravées (enable_tick_marks) ────────────────────────────── */
.ndg-tick {
  position: absolute; left: 50%; top: 50%;
  width: 1.5px; height: 6px;
  margin-left: -0.75px; margin-top: -3px;
  background: rgba(167, 139, 250, 0.45);
  pointer-events: none;
}
.ndg-tick.maj { height: 9px; width: 2px; margin-left: -1px; background: rgba(167, 139, 250, 0.70); }

/* ── Anneau de verre central (enable_glass_center) ──────────────────────── */
.ndg-glass {
  position: absolute; inset: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  /* alphas calibrés pour rester lisibles sur le centerBackground quasi-opaque */
  background: conic-gradient(from 210deg,
    rgba(98,0,234,0.26),  rgba(0,255,249,0.10),
    rgba(180,0,255,0.20), rgba(61,0,184,0.12),
    rgba(98,0,234,0.26));
  border: 1px solid rgba(167,139,250,0.40);
  box-shadow:
    inset 0 0 30px rgba(98,0,234,0.32),
    inset 0 2px 1px rgba(255,255,255,0.10),
    inset 0 -10px 24px rgba(0,0,0,0.35);
}
/* Reflet de courbure : arc lumineux en haut, signature « verre » */
.ndg-glass::after {
  content: '';
  position: absolute;
  inset: 4% 12% 55% 12%;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), transparent 75%);
}
/* Les valeurs restent au-dessus du verre */
.dual-center .value-group { position: relative; z-index: 1; }

:host(.kiosk-mode) .center-shadow,
:host(.kiosk-mode) .outer-shadow {
  display: none;
}

:host(.kiosk-mode) .marker-label {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.gauge {
  position: relative;
  width: var(--gauge-size);
  height: var(--gauge-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-shadow {
  position: absolute;
  width: var(--center-size);
  height: var(--center-size);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
  box-shadow: none;
  transition: box-shadow 0.3s ease-in-out;
}

.led {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--led-size);
  height: var(--led-size);
  margin-left: calc(-0.5 * var(--led-size));
  margin-top: calc(-0.5 * var(--led-size));
  background: #333;
  border-radius: 50%;
  box-shadow: var(--led-shadow);
  transition: background 0.2s ease, box-shadow 0.2s ease;
  /* will-change removed — 200 LEDs each promoting a compositor layer wastes VRAM;
     the parent's contain: layout style paint already isolates repaints */
}

/* Active LED states - uses CSS vars set on gauge-card */
.led[id^="led-inner-"].active {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), var(--active-led-color-inner));
  box-shadow: 0 0 8px var(--active-led-color-inner), inset 0 0 3px var(--active-led-color-inner);
}

.led[id^="led-outer-"].active {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), var(--active-led-color-outer));
  box-shadow: 0 0 8px var(--active-led-color-outer), inset 0 0 3px var(--active-led-color-outer);
}

/* Inactive LED state */
.led.inactive {
  background: #333;
  box-shadow: none;
  transition: none;
}

/* Hidden LED state */
.led.hidden {
  display: none;
}

.center {
  position: absolute;
  width: var(--center-size);
  height: var(--center-size);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.4);
}

.value {
  transition: color 0.3s ease, font-size 0.3s ease, opacity 0.3s ease;
}

#value-inner {
  font-size: var(--value-font-size-inner);
  font-weight: var(--value-font-weight-inner);
  color: var(--neon-value-color-inner, var(--value-font-color-inner));
  font-family: var(--value-font-family-inner);
  text-shadow: var(--neon-value-glow-inner);
  transition: color 0.3s, text-shadow 0.3s;
}

#value-outer {
  font-size: var(--value-font-size-outer);
  font-weight: var(--value-font-weight-outer);
  color: var(--neon-value-color-outer, var(--value-font-color-outer));
  font-family: var(--value-font-family-outer);
  text-shadow: var(--neon-value-glow-outer);
  transition: color 0.3s, text-shadow 0.3s;
}

.unit {
  letter-spacing: 0.02em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}

#unit-inner {
  font-size: var(--unit-font-size-inner);
  font-weight: var(--unit-font-weight-inner);
  color: var(--unit-font-color-inner);
  font-family: var(--unit-font-family-inner);
}

#unit-outer {
  font-size: var(--unit-font-size-outer);
  font-weight: var(--unit-font-weight-outer);
  color: var(--unit-font-color-outer);
  font-family: var(--unit-font-family-outer);
}

.title {
  margin-top: 10px;
  font-size: var(--title-font-size);
  font-family: var(--title-font-family);
  font-weight: var(--title-font-weight);
  color: var(--title-font-color);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.3);
}

.title.position-top {
  order: -1;
  margin-top: 0;
  margin-bottom: 10px;
}

.title.position-inside-top {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  z-index: 10;
}

.title.position-inside-bottom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  z-index: 10;
}

.title.position-none {
  display: none;
}

.neon-dual-gauge-card {
  min-width: calc(var(--outer-gauge-size, var(--gauge-size)) + 32px);
}

.dual-gauge {
  width: var(--outer-gauge-size, var(--gauge-size));
  height: var(--outer-gauge-size, var(--gauge-size));
}

.dual-gauge .led[id^="led-inner-"] {
  width: var(--led-size-inner);
  height: var(--led-size-inner);
}

.dual-gauge .led[id^="led-outer-"] {
  width: var(--led-size-outer);
  height: var(--led-size-outer);
}

.dual-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
}

.value-group {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.value-group.secondary {
  opacity: 0.9;
}

.marker {
  position: absolute;
  width: 4px;
  height: 12px;
  background: #fff;
  border-radius: 2px;
  z-index: 2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.marker-label {
  position: absolute;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  z-index: 2;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.7);
}

.outer-shadow {
  position: absolute;
  border-radius: 50%;
  background: transparent;
  pointer-events: none;
  transition: box-shadow 0.3s ease-in-out;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
`;

// ============================================================================
// RENDERER
// ============================================================================

function generateLedsHTML(ledsCount, radius, ledSize, prefix = '') {
  const leds = [];
  for (let i = 0; i < ledsCount; i++) {
    const angle = (i / ledsCount) * 360 - 90;
    const translate = radius - ledSize;
    leds.push(`<div class="led" id="led-${prefix}${prefix ? '-' : ''}${i}" style="transform: rotate(${angle}deg) translate(${translate}px);"></div>`);
  }
  return leds.join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateTicksHTML(radius) {
  const out = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * 360 - 90;
    out.push(`<div class="ndg-tick${i % 5 === 0 ? ' maj' : ''}" style="transform: rotate(${angle}deg) translate(${radius}px) rotate(90deg);"></div>`);
  }
  return out.join('');
}

function renderDual(context) {
  const config1 = context.config.gauges[0];
  const config2 = context.config.gauges[1];

  const ledsCount1 = optimizeLEDs(config1.leds_count);
  const ledsCount2 = optimizeLEDs(config2.leds_count);

  context.ledsCount1 = ledsCount1;
  context.ledsCount2 = ledsCount2;

  const outerGaugeSize = context.config.gauge_size || 200;
  const innerGaugeSize = context.config.inner_gauge_size || (outerGaugeSize * 0.65);
  const innerGaugeRadius = context.config.inner_gauge_radius !== undefined
    ? context.config.inner_gauge_radius
    : (innerGaugeSize / 2);
  const ledSize1 = config1.led_size || 6;
  const ledSize2 = config2.led_size || 8;

  // Obtenir le thème unifié (hérite du thème HA ou custom si spécifié)
  const globalTheme = getTheme(context.config);

  // Déterminer quelle gauge est principale (par défaut: inner = gauge 0)
  const primaryGauge = context.config.primary_gauge || 'inner'; // 'inner' ou 'outer'
  const isPrimaryInner = primaryGauge === 'inner';

  // Base defaults from config1 (usually primary, or at least the reference in old code)
  const valSize1 = config1.value_font_size || '24px';
  const valWeight1 = config1.value_font_weight || 'bold';
  const valColor1 = config1.value_font_color || globalTheme.textColor;
  const unitSize1 = config1.unit_font_size || '14px';
  const unitWeight1 = config1.unit_font_weight || 'normal';
  const unitColor1 = config1.unit_font_color || globalTheme.secondaryTextColor;

  // Helper to parse pixel value for scaling
  const parsePx = (val) => parseFloat(val) || 0;

  // Calculate defaults for scaling if needed
  // Use generous scale factors so the secondary gauge stays readable
  const valSizeScaled = `${Math.max(parsePx(valSize1) * 0.8, 16)}px`;
  const unitSizeScaled = `${Math.max(parsePx(unitSize1) * 0.9, 12)}px`;

  // Determine actual values for Inner
  let vSizeInner, vWeightInner, vColorInner, uSizeInner, uWeightInner, uColorInner;

  if (!isPrimaryInner && !config1.value_font_size) {
    vSizeInner = valSizeScaled;
    uSizeInner = unitSizeScaled;
  } else {
    vSizeInner = valSize1;
    uSizeInner = unitSize1;
  }
  vWeightInner = valWeight1;
  vColorInner = valColor1;
  uWeightInner = unitWeight1;
  uColorInner = unitColor1;

  // Determine actual values for Outer (config2)
  let vSizeOuter, vWeightOuter, vColorOuter, uSizeOuter, uWeightOuter, uColorOuter;

  if (config2.value_font_size) {
    vSizeOuter = config2.value_font_size;
  } else {
    vSizeOuter = isPrimaryInner ? valSizeScaled : valSize1;
  }

  vWeightOuter = config2.value_font_weight || (isPrimaryInner ? valWeight1 : 'bold');
  vColorOuter = config2.value_font_color || (isPrimaryInner ? valColor1 : globalTheme.textColor);

  if (config2.unit_font_size) {
    uSizeOuter = config2.unit_font_size;
  } else {
    uSizeOuter = isPrimaryInner ? unitSizeScaled : unitSize1;
  }

  uWeightOuter = config2.unit_font_weight || (isPrimaryInner ? unitWeight1 : 'normal');
  uColorOuter = config2.unit_font_color || (isPrimaryInner ? unitColor1 : globalTheme.secondaryTextColor);

  const cssVariables = `
    --card-background: ${context.config.card_background || globalTheme.background};
    --gauge-background: ${globalTheme.gaugeBackground};
    --center-background: ${globalTheme.centerBackground};
    --text-color: ${globalTheme.textColor};
    --secondary-text-color: ${globalTheme.secondaryTextColor};
    --gauge-size: ${outerGaugeSize}px;
    --outer-gauge-size: ${outerGaugeSize}px;
    --inner-gauge-size: ${innerGaugeSize}px;
    --led-size: ${ledSize2}px;
    --led-size-outer: ${ledSize2}px;
    --led-size-inner: ${ledSize1}px;
    --center-size: ${innerGaugeSize * 0.6}px;
    --card-shadow: ${context.config.hide_shadows ? 'none' : '0 0 15px rgba(0, 0, 0, 0.5)'};
    --led-shadow: ${context.config.hide_shadows ? 'none' : '0 0 4px rgba(0, 0, 0, 0.8)'};
    
    --value-font-size-inner: ${vSizeInner};
    --value-font-weight-inner: ${vWeightInner};
    --value-font-color-inner: ${vColorInner};
    --value-font-family-inner: ${config1.value_font_family || 'inherit'};
    
    --value-font-size-outer: ${vSizeOuter};
    --value-font-weight-outer: ${vWeightOuter};
    --value-font-color-outer: ${vColorOuter};
    --value-font-family-outer: ${config2.value_font_family || 'inherit'};
    
    --unit-font-size-inner: ${uSizeInner};
    --unit-font-weight-inner: ${uWeightInner};
    --unit-font-color-inner: ${uColorInner};
    --unit-font-family-inner: ${config1.unit_font_family || 'inherit'};
    
    --unit-font-size-outer: ${uSizeOuter};
    --unit-font-weight-outer: ${uWeightOuter};
    --unit-font-color-outer: ${uColorOuter};
    --unit-font-family-outer: ${config2.unit_font_family || 'inherit'};

    --title-font-size: ${context.config.title_font_size || '16px'};
    --title-font-family: ${context.config.title_font_family || 'inherit'};
    --title-font-weight: ${context.config.title_font_weight || 'normal'};
    --title-font-color: ${context.config.title_font_color || globalTheme.textColor};

    --ndg-dyn-inner: ${context.config.value_glow_dynamic !== false ? 'var(--active-led-color-inner)' : 'static'};
    --ndg-dyn-outer: ${context.config.value_glow_dynamic !== false ? 'var(--active-led-color-outer)' : 'static'};
    --neon-value-glow-inner: ${context.config.neon_value_glow !== false
      ? (context.config.value_glow_dynamic !== false
          ? `0 0 2px #fff, 0 0 8px #fff, 0 0 18px var(--active-led-color-inner, ${vColorInner}), 0 0 42px color-mix(in srgb, var(--active-led-color-inner, ${vColorInner}) 45%, transparent), 0 0 80px color-mix(in srgb, var(--active-led-color-inner, ${vColorInner}) 22%, transparent)`
          : `0 0 2px #fff, 0 0 8px #fff, 0 0 18px ${vColorInner}, 0 0 42px ${vColorInner}70, 0 0 80px ${vColorInner}38`)
      : `0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)`};
    --neon-value-glow-outer: ${context.config.neon_value_glow !== false
      ? (context.config.value_glow_dynamic !== false
          ? `0 0 2px #fff, 0 0 8px #fff, 0 0 18px var(--active-led-color-outer, ${vColorOuter}), 0 0 42px color-mix(in srgb, var(--active-led-color-outer, ${vColorOuter}) 45%, transparent), 0 0 80px color-mix(in srgb, var(--active-led-color-outer, ${vColorOuter}) 22%, transparent)`
          : `0 0 2px #fff, 0 0 8px #fff, 0 0 18px ${vColorOuter}, 0 0 42px ${vColorOuter}70, 0 0 80px ${vColorOuter}38`)
      : `0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)`};
    --neon-value-color-inner: ${context.config.neon_value_glow !== false ? '#fff' : vColorInner};
    --neon-value-color-outer: ${context.config.neon_value_glow !== false ? '#fff' : vColorOuter};
    --pulse-speed: ${context.config.pulse_speed || 4}s;
    --pulse-min-opacity: ${context.config.pulse_min_opacity ?? 0.4};
    --pulse-spread-1: ${context.config.pulse_intensity ?? 20}px;
    --pulse-spread-2: ${Math.round((context.config.pulse_intensity ?? 20) * 2.25)}px;
    --pulse-alpha-1: ${context.config.pulse_intensity ? Math.min(0.6, 0.25 + (context.config.pulse_intensity - 20) * 0.005).toFixed(2) : '0.25'};
    --pulse-alpha-2: ${context.config.pulse_intensity ? Math.min(0.35, 0.12 + (context.config.pulse_intensity - 20) * 0.003).toFixed(2) : '0.12'};
  `;

  // Déterminer la position du titre
  const titlePosition = context.config.title_position || 'bottom';
  const titleClass = titlePosition !== 'bottom' ? `title position-${titlePosition}` : 'title';
  const isInsidePosition = titlePosition === 'inside-top' || titlePosition === 'inside-bottom';

  // Déterminer si on masque le cadre de la carte
  const hideCard = context.config.hide_card || false;

  // Construire les classes CSS de la carte
  const customEffects = context.config.enable_custom_effects !== false; // true par défaut
  const topGlow = context.config.enable_top_glow !== false; // true par défaut
  const animatePulse = context.config.enable_pulse_animation !== false; // true par défaut
  const glitchHover = context.config.enable_glitch_hover !== false; // true par défaut
  
  // Effect / state classes go on :host so the :host(...) CSS selectors match.
  const hostClasses = [
    hideCard ? 'no-card' : '',
    customEffects ? 'custom-effects' : '',
    topGlow && !hideCard ? 'with-top-glow' : '',
    animatePulse && !hideCard ? 'animate-pulse' : '',
    glitchHover && customEffects && !hideCard ? 'glitch-hover' : '',
    context.config.kiosk_mode ? 'kiosk-mode' : ''
  ].filter(Boolean).join(' ');

  // Layout-only classes stay on the inner wrapper.
  const cardClasses = [
    'gauge-card',
    'neon-dual-gauge-card',
    isInsidePosition ? 'has-inside-title' : '',
    hideCard ? 'no-card' : ''
  ].filter(Boolean).join(' ');

  // Générer le HTML du titre
  const titleHTML = `<div class="${titleClass}">${escapeHtml(context.config.name || "")}</div>`;

  // Apply effect classes on the host element for :host(...) selectors
  context.className = hostClasses;

  const gaugeHTML = `
    <style>
      :host {
        ${cssVariables}
        display: block;
      }
      ${stylesCSS}
    </style>
    <ha-card>
    <div class="${cardClasses}" id="gauge-container">
      <div class="gauge dual-gauge" style="background: ${globalTheme.gaugeBackground}">
        ${isInsidePosition ? titleHTML : ''}
        <div class="outer-shadow" id="outer-shadow-inner"></div>
        <div class="outer-shadow" id="outer-shadow-outer"></div>
        <div class="center-shadow" id="center-shadow-inner"></div>
        <div class="center-shadow" id="center-shadow-outer"></div>
        ${context.config.enable_tick_marks !== false ? generateTicksHTML(innerGaugeRadius - ledSize1 - 12) : ''}
        ${generateLedsHTML(ledsCount2, outerGaugeSize / 2, ledSize2, 'outer')}
        ${generateLedsHTML(ledsCount1, innerGaugeRadius, ledSize1, 'inner')}
        <div class="center dual-center" style="background: ${globalTheme.centerBackground}">
          ${context.config.enable_glass_center !== false ? '<div class="ndg-glass"></div>' : ''}
          <div class="value-group ${isPrimaryInner ? '' : 'secondary'}" id="group-inner" role="button" tabindex="0" aria-label="${escapeHtml(config1.entity || '')}">
            <div class="value" id="value-inner">0</div>
            <div class="unit" id="unit-inner"></div>
          </div>
          <div class="value-group ${isPrimaryInner ? 'secondary' : ''}" id="group-outer" role="button" tabindex="0" aria-label="${escapeHtml(config2.entity || '')}">
            <div class="value" id="value-outer">0</div>
            <div class="unit" id="unit-outer"></div>
          </div>
        </div>
      </div>
      ${!isInsidePosition ? titleHTML : ''}
    </div>
    </ha-card>
  `;

  context.shadowRoot.innerHTML = gaugeHTML;

  // Stocker les dimensions pour les markers et zones
  context.innerGaugeRadius = innerGaugeRadius;
  context.outerGaugeSize = outerGaugeSize;
  context.innerGaugeSize = innerGaugeSize;

  // Cache frequently-accessed DOM references to avoid per-frame lookups
  context._cachedRefs = {
    'value-inner': context.shadowRoot.getElementById('value-inner'),
    'value-outer': context.shadowRoot.getElementById('value-outer'),
    'unit-inner': context.shadowRoot.getElementById('unit-inner'),
    'unit-outer': context.shadowRoot.getElementById('unit-outer'),
    'gauge-card': context.shadowRoot.querySelector('.gauge-card'),
    'gauge-container': context.shadowRoot.getElementById('gauge-container'),
  };

  // Cache LED element arrays
  context._cachedLeds = {
    inner: Array.from({ length: ledsCount1 }, (_, i) => context.shadowRoot.getElementById(`led-inner-${i}`)),
    outer: Array.from({ length: ledsCount2 }, (_, i) => context.shadowRoot.getElementById(`led-outer-${i}`)),
  };

  // Ajouter les markers et zones après le rendu
  addMarkersAndZones(context);
}

// ============================================================================
// MARKERS AND ZONES
// ============================================================================

function addMarkersAndZones(context) {
  const gauge = context.shadowRoot.querySelector('.gauge');
  if (!gauge) return;

  const outerGaugeSize = context.outerGaugeSize;
  const innerGaugeRadius = context.innerGaugeRadius;
  const config1 = context.config.gauges[0];
  const config2 = context.config.gauges[1];

  // Use DocumentFragment for batched DOM operations (more efficient)
  const fragment = document.createDocumentFragment();

  /**
   * Compute CSS transform-origin and translate offsets for a marker label
   * so that labels on the left side anchor right, labels on the right anchor
   * left, and top/bottom labels stay centered — keeping text always readable.
   */
  function labelTransformForAngle(angleDeg) {
    // Normalize to 0-360
    const a = ((angleDeg % 360) + 360) % 360;
    // Right half (roughly 350-10 = top, 10-170 = right)
    let tx = '-50%', ty = '-50%';
    if (a > 15 && a < 165) {
      // Right side: anchor left edge
      tx = '0%';
    } else if (a > 195 && a < 345) {
      // Left side: anchor right edge
      tx = '-100%';
    }
    if (a > 60 && a < 120) {
      // Bottom area: push down
      ty = '0%';
    } else if (a > 240 && a < 300) {
      // Top area: push up
      ty = '-100%';
    }
    return `translate(${tx}, ${ty})`;
  }

  function createLabelElement(marker, labelX, labelY, angleDeg) {
    const labelElement = document.createElement('div');
    labelElement.className = 'marker-label';
    labelElement.textContent = marker.label;
    labelElement.style.cssText = `
      position: absolute;
      font-size: 11px;
      font-weight: 600;
      color: ${marker.color || '#fff'};
      white-space: nowrap;
      left: calc(50% + ${labelX}px);
      top: calc(50% + ${labelY}px);
      transform: ${labelTransformForAngle(angleDeg)};
      z-index: 3;
      text-shadow: 0 0 6px rgba(0, 0, 0, 1), 0 0 3px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.8);
      background: rgba(0, 0, 0, 0.45);
      padding: 1px 5px;
      border-radius: 4px;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      line-height: 1.3;
    `;
    return labelElement;
  }

  // Ajouter markers pour la gauge interne (gauge 0)
  if (config1.markers) {
    const min1 = config1.min || 0;
    const max1 = config1.max || 100;
    const markersRadius1 = config1.markers_radius !== undefined
      ? config1.markers_radius
      : innerGaugeRadius;

    config1.markers.forEach(marker => {
      const angle = valueToAngle(marker.value, min1, max1, config1.bidirectional || false);

      // Calcul cartésien pour positionnement précis
      const angleRad = (angle - 90) * Math.PI / 180;
      const markerX = markersRadius1 * Math.cos(angleRad);
      const markerY = markersRadius1 * Math.sin(angleRad);

      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.cssText = `
        position: absolute;
        width: 4px;
        height: 12px;
        background: ${marker.color || '#fff'};
        border-radius: 2px;
        left: 50%;
        top: 50%;
        transform: translate(${markerX}px, ${markerY}px) translateX(-2px) translateY(-6px) rotate(${angle - 90}deg);
        z-index: 2;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      `;

      if (marker.label) {
        const labelX = (markersRadius1 + 14) * Math.cos(angleRad);
        const labelY = (markersRadius1 + 14) * Math.sin(angleRad);
        fragment.appendChild(createLabelElement(marker, labelX, labelY, angle));
      }

      fragment.appendChild(markerElement);
    });
  }

  // Ajouter markers pour la gauge externe (gauge 1)
  if (config2.markers) {
    const min2 = config2.min || 0;
    const max2 = config2.max || 100;
    const markersRadius2 = config2.markers_radius !== undefined
      ? config2.markers_radius
      : (outerGaugeSize / 2);

    config2.markers.forEach(marker => {
      const angle = valueToAngle(marker.value, min2, max2, config2.bidirectional || false);

      // Calcul cartésien pour positionnement précis
      const angleRad = (angle - 90) * Math.PI / 180;
      const markerX = markersRadius2 * Math.cos(angleRad);
      const markerY = markersRadius2 * Math.sin(angleRad);

      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.cssText = `
        position: absolute;
        width: 4px;
        height: 12px;
        background: ${marker.color || '#fff'};
        border-radius: 2px;
        left: 50%;
        top: 50%;
        transform: translate(${markerX}px, ${markerY}px) translateX(-2px) translateY(-6px) rotate(${angle - 90}deg);
        z-index: 2;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      `;

      if (marker.label) {
        const labelX = (markersRadius2 + 14) * Math.cos(angleRad);
        const labelY = (markersRadius2 + 14) * Math.sin(angleRad);
        fragment.appendChild(createLabelElement(marker, labelX, labelY, angle));
      }

      fragment.appendChild(markerElement);
    });
  }

  // Ajouter zones pour la gauge interne (gauge 0)
  if (config1.zones) {
    const min1 = config1.min || 0;
    const max1 = config1.max || 100;
    const svgSize = (innerGaugeRadius + 10) * 2;

    config1.zones.forEach(zone => {
      const startAngle = valueToAngle(zone.from, min1, max1, config1.bidirectional || false);
      const endAngle = valueToAngle(zone.to, min1, max1, config1.bidirectional || false);

      // Calculate arc angle (handle wrapping around 0°/360°)
      let arcAngle = endAngle - startAngle;
      if (arcAngle < 0) {
        arcAngle += 360;
      }

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", `${svgSize}`);
      svg.setAttribute("height", `${svgSize}`);
      svg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        pointer-events: none;
      `;

      const radius = innerGaugeRadius + 5;
      const centerPoint = svgSize / 2;

      // Zone couvrant tout le tour (from=min, to=max) : start/end
      // coïncident en angle (0° ou 360° selon le mode uni/bidirectionnel)
      // et l'arc dégénère en point — dessiner un cercle plein à la place.
      const isFullCircleZone = zone.from <= min1 && zone.to >= max1;

      if (isFullCircleZone) {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", `${centerPoint}`);
        circle.setAttribute("cy", `${centerPoint}`);
        circle.setAttribute("r", `${radius}`);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", zone.color || "#fff");
        circle.setAttribute("stroke-width", "4");
        circle.setAttribute("opacity", zone.opacity || "0.5");
        svg.appendChild(circle);
        fragment.appendChild(svg);
        return;
      }

      const circle = document.createElementNS(svgNS, "path");
      const startX = centerPoint + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const startY = centerPoint + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const endX = centerPoint + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const endY = centerPoint + radius * Math.sin((endAngle - 90) * Math.PI / 180);

      const largeArcFlag = arcAngle > 180 ? 1 : 0;
      const path = `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`;

      circle.setAttribute("d", path);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", zone.color || "#fff");
      circle.setAttribute("stroke-width", "4");
      circle.setAttribute("opacity", zone.opacity || "0.5");

      svg.appendChild(circle);
      fragment.appendChild(svg);
    });
  }

  // Ajouter zones pour la gauge externe (gauge 1)
  if (config2.zones) {
    const min2 = config2.min || 0;
    const max2 = config2.max || 100;

    config2.zones.forEach(zone => {
      const startAngle = valueToAngle(zone.from, min2, max2, config2.bidirectional || false);
      const endAngle = valueToAngle(zone.to, min2, max2, config2.bidirectional || false);

      // Calculate arc angle (handle wrapping around 0°/360°)
      let arcAngle = endAngle - startAngle;
      if (arcAngle < 0) {
        arcAngle += 360;
      }

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", `${outerGaugeSize + 20}`);
      svg.setAttribute("height", `${outerGaugeSize + 20}`);
      svg.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        z-index: 1;
        pointer-events: none;
      `;

      const radius = outerGaugeSize / 2 + 5;
      const centerPoint = (outerGaugeSize + 20) / 2;

      // Cf. commentaire équivalent sur la gauge interne : from/to
      // couvrant tout le range dégénère l'arc, quel que soit le mode.
      const isFullCircleZone = zone.from <= min2 && zone.to >= max2;

      if (isFullCircleZone) {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", `${centerPoint}`);
        circle.setAttribute("cy", `${centerPoint}`);
        circle.setAttribute("r", `${radius}`);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", zone.color || "#fff");
        circle.setAttribute("stroke-width", "4");
        circle.setAttribute("opacity", zone.opacity || "0.5");
        svg.appendChild(circle);
        fragment.appendChild(svg);
        return;
      }

      const circle = document.createElementNS(svgNS, "path");
      const startX = centerPoint + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const startY = centerPoint + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const endX = centerPoint + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const endY = centerPoint + radius * Math.sin((endAngle - 90) * Math.PI / 180);

      const largeArcFlag = arcAngle > 180 ? 1 : 0;
      const path = `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`;

      circle.setAttribute("d", path);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", zone.color || "#fff");
      circle.setAttribute("stroke-width", "4");
      circle.setAttribute("opacity", zone.opacity || "0.5");

      svg.appendChild(circle);
      fragment.appendChild(svg);
    });
  }

  // Batch append all markers and zones at once
  gauge.appendChild(fragment);
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

function updateLedsDual(context, value, ledsCount, prefix, gaugeConfig) {
  const min = gaugeConfig.min !== undefined ? gaugeConfig.min : 0;
  const max = gaugeConfig.max !== undefined ? gaugeConfig.max : 100;

  // Convert normalized value (0-100%) back to real value for bidirectional calculation
  const realValue = min + (value / 100) * (max - min);
  const bidirectional = gaugeConfig.bidirectional || false;
  const ledInfo = calculateBidirectionalLeds(realValue, min, max, ledsCount, bidirectional);

  const color = getLedColor(ledInfo.normalizedValue, gaugeConfig.severity, min, max);

  // Update CSS var for LED color (single style write instead of N writes)
  const gaugeCard = context._cachedRefs?.['gauge-card'] || context.shadowRoot.querySelector('.gauge-card');
  if (gaugeCard) {
    gaugeCard.style.setProperty(`--active-led-color-${prefix}`, color);
  }

  // Appliquer l'ombre externe si enable_shadow est activé
  if (gaugeConfig.enable_shadow) {
    const gaugeContainer = context._cachedRefs?.['gauge-container'] || context.shadowRoot.getElementById("gauge-container");
    if (gaugeContainer) {
      gaugeContainer.style.boxShadow = `0 0 30px 2px ${color}`;
    }
  }

  // Update LED states using cached references (avoids getElementById per LED per frame)
  const cachedLedArray = context._cachedLeds?.[prefix];
  for (let i = 0; i < ledsCount; i++) {
    const led = cachedLedArray ? cachedLedArray[i] : context.shadowRoot.getElementById(`led-${prefix}-${i}`);
    if (!led) continue;

    let isActive = false;

    if (ledInfo.direction === 'unidirectional') {
      // Standard unidirectional mode: activate from LED 0 onwards
      isActive = i < ledInfo.activeLeds;
    } else if (ledInfo.direction === 'positive') {
      // Bidirectional positive: activate clockwise from LED 0
      isActive = i < ledInfo.activeLeds;
    } else if (ledInfo.direction === 'negative') {
      // Bidirectional negative: activate counter-clockwise from LED 0
      // LED 0 is the zero point (12h) and must be included, then LEDs go backwards (99, 98, 97...)
      isActive = (i === 0) || (i > (ledsCount - ledInfo.activeLeds));
    }

    // Skip DOM writes if LED state hasn't changed
    const wasActive = led.classList.contains("active");
    if (isActive === wasActive) continue;

    // Use CSS classes instead of inline styles for better performance
    if (isActive) {
      led.classList.remove("inactive", "hidden");
      led.classList.add("active");
    } else {
      led.classList.remove("active");
      if (gaugeConfig.hide_inactive_leds) {
        led.classList.add("hidden");
        led.classList.remove("inactive");
      } else {
        led.classList.add("inactive");
        led.classList.remove("hidden");
      }
    }
  }
  // ── Tête de comète + traînée (enable_comet_head, défaut actif) ──
  if (!context._cometLeds) context._cometLeds = {};
  const prevComet = context._cometLeds[prefix];
  if (prevComet) for (const el of prevComet) el.classList.remove('head', 'tr1', 'tr2', 'tr3');
  context._cometLeds[prefix] = null;
  if (context.config.enable_comet_head !== false && ledInfo.activeLeds > 0) {
    let head, step;
    if (ledInfo.direction === 'negative') {
      head = ledInfo.activeLeds > 1 ? ledsCount - ledInfo.activeLeds + 1 : 0;
      step = 1;   // la traînée remonte vers le point zéro
    } else {
      head = ledInfo.activeLeds - 1;
      step = -1;
    }
    const marks = ['head', 'tr1', 'tr2', 'tr3'], applied = [];
    for (let k = 0; k < marks.length; k++) {
      const idx = head + step * k;
      if (idx < 0 || idx >= ledsCount) break;
      const el = cachedLedArray ? cachedLedArray[idx] : context.shadowRoot.getElementById(`led-${prefix}-${idx}`);
      if (!el || !el.classList.contains('active')) break;
      el.classList.add(marks[k]);
      applied.push(el);
    }
    context._cometLeds[prefix] = applied;
  }
}

function animateValueChangeDual(context, fromValue, toValue, min, max, prefix, gaugeIndex) {
  const gaugeConfig = context.config.gauges[gaugeIndex];
  const ledsCount = prefix === 'inner' ? context.ledsCount1 : context.ledsCount2;
  const duration = gaugeConfig.animation_duration || 800;
  const valueRange = toValue - fromValue;
  const animationKey = `animationFrame${gaugeIndex + 1}`;
  const startTimeKey = `animationStartTime${gaugeIndex + 1}`;

  // Cancel any existing animation for this gauge
  if (context[animationKey]) {
    cancelAnimationFrame(context[animationKey]);
    context[animationKey] = null;
  }

  // Record start time
  context[startTimeKey] = performance.now();

  // Cache DOM refs outside the loop to avoid querySelector every frame
  const cachedValueDisplay = context._cachedRefs?.[`value-${prefix}`];
  const cachedUnitDisplay = context._cachedRefs?.[`unit-${prefix}`];
  const cachedRadius = prefix === 'inner' ? context.innerGaugeRadius : (context.outerGaugeSize / 2);

  // Set unit text once at start of animation (fix: was missing during transitions)
  if (cachedUnitDisplay) {
    cachedUnitDisplay.textContent = gaugeConfig.unit || '';
  }

  // Use requestAnimationFrame — but only do heavy DOM work when
  // the eased value crosses a new LED boundary or shadow colour band.
  let lastLedIndex = -1;

  const animate = (currentTime) => {
    const elapsed = currentTime - context[startTimeKey];
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentValue = fromValue + valueRange * easedProgress;
    const normalizedValue = safeNormalize(currentValue, min, max);

    // Only run expensive LED + shadow updates when a new LED would change
    const currentLedIndex = Math.round(normalizedValue / 100 * ledsCount);
    if (currentLedIndex !== lastLedIndex) {
      lastLedIndex = currentLedIndex;
      updateLedsDual(context, normalizedValue, ledsCount, prefix, gaugeConfig);
      updateCenterShadow(context, normalizedValue, gaugeConfig, prefix);
      updateOuterShadow(context, normalizedValue, gaugeConfig, prefix, cachedRadius);
    }

    // Value text is cheap — update every frame for smooth counter
    if (cachedValueDisplay) {
      cachedValueDisplay.textContent = currentValue.toFixed(gaugeConfig.decimals ?? 1);
    }

    // Continue animation if not finished
    if (progress < 1) {
      context[animationKey] = requestAnimationFrame(animate);
    } else {
      context[animationKey] = null;
      context[startTimeKey] = null;
    }
  };

  context[animationKey] = requestAnimationFrame(animate);
}

function updateCenterShadow(context, value, gaugeConfig, shadowId) {
  if (!gaugeConfig.center_shadow) return;

  const min = gaugeConfig.min !== undefined ? gaugeConfig.min : 0;
  const max = gaugeConfig.max !== undefined ? gaugeConfig.max : 100;
  const color = getLedColor(value, gaugeConfig.severity, min, max);
  const blur = gaugeConfig.center_shadow_blur || 30;
  const spread = gaugeConfig.center_shadow_spread || 15;
  const cacheKey = `center-shadow-${shadowId}`;
  const centerShadow = context._cachedRefs?.[cacheKey] || context.shadowRoot.getElementById(cacheKey);

  if (centerShadow) {
    if (context._cachedRefs && !context._cachedRefs[cacheKey]) context._cachedRefs[cacheKey] = centerShadow;
    centerShadow.style.boxShadow = `0 0 ${blur}px ${spread}px ${color}`;
  }
}

function updateOuterShadow(context, value, gaugeConfig, shadowId, radius) {
  if (!gaugeConfig.outer_shadow) return;

  const min = gaugeConfig.min !== undefined ? gaugeConfig.min : 0;
  const max = gaugeConfig.max !== undefined ? gaugeConfig.max : 100;
  const color = getLedColor(value, gaugeConfig.severity, min, max);
  const blur = gaugeConfig.outer_shadow_blur || 30;
  const spread = gaugeConfig.outer_shadow_spread || 15;
  const cacheKey = `outer-shadow-${shadowId}`;
  const outerShadow = context._cachedRefs?.[cacheKey] || context.shadowRoot.getElementById(cacheKey);

  if (outerShadow) {
    if (context._cachedRefs && !context._cachedRefs[cacheKey]) context._cachedRefs[cacheKey] = outerShadow;
    const diameter = radius * 2;
    outerShadow.style.width = `${diameter}px`;
    outerShadow.style.height = `${diameter}px`;
    outerShadow.style.boxShadow = `0 0 ${blur}px ${spread}px ${color}`;
  }
}

function updateDualGauge(context) {
  if (!context._hass) return;

  const config1 = context.config.gauges[0];
  const config2 = context.config.gauges[1];

  // Validation: vérifier que les entités existent
  const isFr = (navigator.language || '').startsWith('fr');

  if (!config1.entity || !config2.entity) {
    // Afficher un message d'aide si les entités ne sont pas configurées
    const container = context._cachedRefs?.['gauge-card'] || context.shadowRoot?.querySelector('.gauge-card');
    if (container && !container.querySelector('.config-warning')) {
      const warning = document.createElement('div');
      warning.className = 'config-warning';
      warning.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background: rgba(255, 152, 0, 0.1);
        border: 2px solid rgba(255, 152, 0, 0.5);
        border-radius: 8px;
        text-align: center;
        color: var(--warning-color, #ff9800);
        z-index: 100;
      `;
      warning.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
        <div style="font-weight: bold; margin-bottom: 5px;">${isFr ? 'Configuration incomplète' : 'Incomplete Configuration'}</div>
        <div style="font-size: 13px; opacity: 0.8;">${isFr ? 'Veuillez configurer les entités des deux jauges' : 'Please configure entities for both gauges'}</div>
      `;
      container.appendChild(warning);
    }
    return;
  }

  const entityState1 = context._hass.states[config1.entity];
  const entityState2 = context._hass.states[config2.entity];

  // Handle missing or unavailable/unknown entity states
  const isUnavailable1 = !entityState1 || ['unavailable', 'unknown'].includes(entityState1.state);
  const isUnavailable2 = !entityState2 || ['unavailable', 'unknown'].includes(entityState2.state);

  if (isUnavailable1 || isUnavailable2) {
    const naText = isFr ? 'N/D' : 'N/A';
    if (isUnavailable1) {
      if (context.animationFrame1) { cancelAnimationFrame(context.animationFrame1); context.animationFrame1 = null; }
      const vd = context._cachedRefs?.['value-inner'] || context.shadowRoot.querySelector('#value-inner');
      const ud = context._cachedRefs?.['unit-inner'] || context.shadowRoot.querySelector('#unit-inner');
      if (vd) { vd.textContent = naText; vd.style.opacity = '0.5'; }
      if (ud) ud.textContent = '';
    }
    if (isUnavailable2) {
      if (context.animationFrame2) { cancelAnimationFrame(context.animationFrame2); context.animationFrame2 = null; }
      const vd = context._cachedRefs?.['value-outer'] || context.shadowRoot.querySelector('#value-outer');
      const ud = context._cachedRefs?.['unit-outer'] || context.shadowRoot.querySelector('#unit-outer');
      if (vd) { vd.textContent = naText; vd.style.opacity = '0.5'; }
      if (ud) ud.textContent = '';
    }
    // If both unavailable, nothing more to do
    if (isUnavailable1 && isUnavailable2) return;
  }

  // Guard against non-numeric states
  const rawState1 = isUnavailable1 ? null : parseFloat(entityState1.state);
  const rawState2 = isUnavailable2 ? null : parseFloat(entityState2.state);
  if (rawState1 !== null && isNaN(rawState1)) return;
  if (rawState2 !== null && isNaN(rawState2)) return;

  // Update inner gauge (skip if unavailable)
  if (rawState1 !== null) {
    const state1 = rawState1;
    // Ignition : premier update → sweep depuis 0 (bidirectionnel) ou min
    if (context.config.enable_ignition !== false && !context._ignited1 && context.previousState1 === null) {
      context._ignited1 = true;
      context.previousState1 = config1.bidirectional ? 0 : (config1.min ?? 0);
    }
    const previousState1 = context.previousState1 !== null ? context.previousState1 : state1;
    const min1 = config1.min;
    const max1 = config1.max;

    // Restore opacity in case it was dimmed by a previous unavailable state
    const vd1 = context._cachedRefs?.['value-inner'];
    if (vd1) vd1.style.opacity = '';

    if (config1.smooth_transitions && previousState1 !== state1) {
      animateValueChangeDual(context, previousState1, state1, min1, max1, 'inner', 0);
    } else {
      const normalizedValue1 = safeNormalize(state1, min1, max1);
      updateLedsDual(context, normalizedValue1, context.ledsCount1, 'inner', config1);
      updateCenterShadow(context, normalizedValue1, config1, 'inner');
      updateOuterShadow(context, normalizedValue1, config1, 'inner', context.innerGaugeRadius);

      const valueDisplay1 = context._cachedRefs?.['value-inner'];
      const unitDisplay1 = context._cachedRefs?.['unit-inner'];
      if (valueDisplay1) valueDisplay1.textContent = state1.toFixed(config1.decimals ?? 1);
      if (unitDisplay1) unitDisplay1.textContent = config1.unit || "";
    }
    context.previousState1 = state1;
  }

  // Update outer gauge (skip if unavailable)
  if (rawState2 !== null) {
    const state2 = rawState2;
    if (context.config.enable_ignition !== false && !context._ignited2 && context.previousState2 === null) {
      context._ignited2 = true;
      context.previousState2 = config2.bidirectional ? 0 : (config2.min ?? 0);
    }
    const previousState2 = context.previousState2 !== null ? context.previousState2 : state2;
    const min2 = config2.min;
    const max2 = config2.max;

    // Restore opacity in case it was dimmed by a previous unavailable state
    const vd2 = context._cachedRefs?.['value-outer'];
    if (vd2) vd2.style.opacity = '';

    if (config2.smooth_transitions && previousState2 !== state2) {
      animateValueChangeDual(context, previousState2, state2, min2, max2, 'outer', 1);
    } else {
      const normalizedValue2 = safeNormalize(state2, min2, max2);
      updateLedsDual(context, normalizedValue2, context.ledsCount2, 'outer', config2);
      updateCenterShadow(context, normalizedValue2, config2, 'outer');
      updateOuterShadow(context, normalizedValue2, config2, 'outer', context.outerGaugeSize / 2);

      const valueDisplay2 = context._cachedRefs?.['value-outer'];
      const unitDisplay2 = context._cachedRefs?.['unit-outer'];
      if (valueDisplay2) valueDisplay2.textContent = state2.toFixed(config2.decimals ?? 1);
      if (unitDisplay2) unitDisplay2.textContent = config2.unit || "";
    }
    context.previousState2 = state2;
  }
}

// ============================================================================
// CONFIG PARSER
// ============================================================================

function parseDualConfig(config) {
  if (!config.gauges || !Array.isArray(config.gauges) || config.gauges.length !== 2) {
    throw new Error("La configuration 'gauges' doit contenir exactement 2 configurations de gauge.");
  }

  // Validation lenient: permet les entités vides pendant la configuration
  // L'erreur sera affichée dans l'UI au lieu de bloquer l'éditeur
  const hasValidEntities = config.gauges.every(g => g.entity && g.entity.trim());
  
  if (!hasValidEntities) {
    console.warn('⚠️ Neon Dual Gauge Card: Some entities are not configured yet');
  }

  const parsedConfig = {
    ...config,
    gauge_size: config.gauge_size || 200,
    inner_gauge_size: config.inner_gauge_size || null,
    update_interval: config.update_interval || 1000,
    power_save_mode: config.power_save_mode ?? IS_LOW_POWER,   // auto ON sur iPad/mobile (override possible: false en YAML)
    debounce_updates: config.debounce_updates ?? IS_IPAD,
    hide_shadows: config.hide_shadows || false,
    kiosk_mode: config.kiosk_mode ?? IS_LOW_POWER,             // auto ON sur iPad/mobile (override possible)

    gauges: config.gauges.map(gaugeConfig => ({
      ...gaugeConfig,
      min: gaugeConfig.min !== undefined ? gaugeConfig.min : 0,
      max: gaugeConfig.max !== undefined ? gaugeConfig.max : 100,
      leds_count: gaugeConfig.leds_count || 100,
      led_size: gaugeConfig.led_size || 8,
      decimals: gaugeConfig.decimals !== undefined ? gaugeConfig.decimals : 1,
      smooth_transitions: gaugeConfig.smooth_transitions !== false,
      animation_duration: gaugeConfig.animation_duration || 800,
      severity: gaugeConfig.severity || [
        { color: '#4caf50', value: 33 },
        { color: '#ff9800', value: 66 },
        { color: '#f44336', value: 100 }
      ],
      hide_inactive_leds: gaugeConfig.hide_inactive_leds || false,
      bidirectional: gaugeConfig.bidirectional || false
    }))
  };

  // Load any custom Google Fonts referenced in the config
  loadConfigFonts(parsedConfig);

  return parsedConfig;
}

// ============================================================================
// NEON DUAL GAUGE CARD CLASS
// ============================================================================

class NeonDualGaugeCard extends HTMLElement {
  static getStubConfig() {
    return {
      gauges: [
        { entity: "", min: 0, max: 100 },
        { entity: "", min: 0, max: 100 }
      ]
    };
  }

  static getConfigElement() {
    return document.createElement("neon-dual-gauge-card-editor");
  }

  setConfig(config) {
    // Cancel in-flight animations before resetting state
    if (this.animationFrame1) { cancelAnimationFrame(this.animationFrame1); }
    if (this.animationFrame2) { cancelAnimationFrame(this.animationFrame2); }
    if (this.updateTimer)     { clearTimeout(this.updateTimer); }

    try {
      this.config = parseDualConfig(config);
    } catch (error) {
      console.error('Neon Dual Gauge Card config error:', error);
      throw error;
    }

    this.previousState1 = null;
    this.previousState2 = null;
    this.updateTimer = null;
    this.isVisible = true;
    this.animationFrame1 = null;
    this.animationFrame2 = null;
    this.animationStartTime1 = null;
    this.animationStartTime2 = null;
    this._rafPending = false;
    this._cachedRefs = null;
    this._cachedLeds = null;
    this._lastHassKey = null;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    renderDual(this);

    this._updateDualGauge = () => updateDualGauge(this);

    // Un reconfig (ex. éditeur en direct) ne doit pas laisser la gauge
    // affichée à "0" tant que hass ne renvoie pas un nouvel état différent.
    // (updateDualGauge sort tôt en interne si _hass n'est pas encore défini.)
    this._updateDualGauge();

    const groupInner = this.shadowRoot.getElementById("group-inner");
    if (groupInner) {
      groupInner.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showEntityHistory(this.config.gauges[0].entity);
      });
      groupInner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          this._showEntityHistory(this.config.gauges[0].entity);
        }
      });
    }

    const groupOuter = this.shadowRoot.getElementById("group-outer");
    if (groupOuter) {
      groupOuter.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showEntityHistory(this.config.gauges[1].entity);
      });
      groupOuter.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          this._showEntityHistory(this.config.gauges[1].entity);
        }
      });
    }

    if (this.config.power_save_mode) {
      this._setupVisibilityObserver();
    }
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.config) return;
    if (this.config.power_save_mode && !this.isVisible) return;

    // Early exit — skip all work if neither entity actually changed
    const e1 = this.config.gauges[0]?.entity;
    const e2 = this.config.gauges[1]?.entity;
    const s1 = e1 && hass.states[e1];
    const s2 = e2 && hass.states[e2];
    const key = (s1 ? s1.state + s1.last_updated : '') + '|' + (s2 ? s2.state + s2.last_updated : '');
    if (key === this._lastHassKey) return;
    this._lastHassKey = key;

    // Kiosk mode: force throttled updates to reduce CPU/GPU heat on tablets
    if (this.config.kiosk_mode) {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this._updateDualGauge();
      }, Math.max(this.config.update_interval || 1000, 2000));
      return;
    }

    if (this.config.debounce_updates) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      this.updateTimer = setTimeout(() => {
        this._updateDualGauge();
      }, this.config.update_interval);
    } else {
      // RAF coalescing — HA may fire several hass updates per frame;
      // batch them into a single paint to avoid redundant work
      if (!this._rafPending) {
        this._rafPending = true;
        requestAnimationFrame(() => {
          this._rafPending = false;
          this._updateDualGauge();
        });
      }
    }
  }

  disconnectedCallback() {
    // Cancel requestAnimationFrame instead of clearInterval
    if (this.animationFrame1) cancelAnimationFrame(this.animationFrame1);
    if (this.animationFrame2) cancelAnimationFrame(this.animationFrame2);
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this._rafPending = false;
    this._cachedRefs = null;
    this._cachedLeds = null;
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  connectedCallback() {
    if (!this.shadowRoot || !this.shadowRoot.querySelector('.gauge-card')) return;
    // Re-build cached DOM refs
    this._cachedRefs = {
      'value-inner': this.shadowRoot.getElementById('value-inner'),
      'value-outer': this.shadowRoot.getElementById('value-outer'),
      'unit-inner': this.shadowRoot.getElementById('unit-inner'),
      'unit-outer': this.shadowRoot.getElementById('unit-outer'),
      'gauge-card': this.shadowRoot.querySelector('.gauge-card'),
      'gauge-container': this.shadowRoot.getElementById('gauge-container'),
    };
    if (this.ledsCount1 && this.ledsCount2) {
      this._cachedLeds = {
        inner: Array.from({ length: this.ledsCount1 }, (_, i) => this.shadowRoot.getElementById(`led-inner-${i}`)),
        outer: Array.from({ length: this.ledsCount2 }, (_, i) => this.shadowRoot.getElementById(`led-outer-${i}`)),
      };
    }
    // Re-create visibility observer
    if (this.config && this.config.power_save_mode) {
      this._setupVisibilityObserver();
    }
    // Trigger update with latest data
    if (this._hass) {
      this._updateDualGauge();
    }
  }

  _setupVisibilityObserver() {
    if (this._observer) {
      this._observer.disconnect();
    }

    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && this._hass) {
            this._updateDualGauge();
          }
        });
      },
      { threshold: 0.1 }
    );

    this._observer.observe(this);
  }

  _showEntityHistory(entityId) {
    if (!entityId || !this._hass) return;

    const event = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  getCardSize() {
    return 4;
  }
}

// ============================================================================
// VISUAL EDITOR
// ============================================================================

const NDG_THEMES = [{ value: 'light', label: 'Clair' }, { value: 'dark', label: 'Sombre' }, { value: 'custom', label: 'Personnalisé' }];
const NDG_POSITIONS = ['bottom', 'top', 'inside-top', 'inside-bottom', 'none'];

class NeonDualGaugeCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  // ── Cycle de vie (NE PAS toucher) ──────────────────────────────────
  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._config.gauges || this._config.gauges.length < 2) {
      this._config.gauges = [{ entity: '', min: 0, max: 100 }, { entity: '', min: 0, max: 100 }];
    }
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
        if (!o[parts[i]] || typeof o[parts[i]] !== 'object') o[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        o = o[parts[i]];
      }
      const last = parts[parts.length - 1];
      if (empty) delete o[last]; else o[last] = value;
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
        if (el._rngLbl) el._rngLbl.textContent = el.value;
      }
    });
    this.querySelectorAll('textarea[data-key]').forEach(ta => {
      if (ta === active) return;
      const v = this._read(ta.dataset.key);
      ta.value = v ? this._yamlStringify(v) : '';
    });
    this._bindIconPreviews(true);
  }

  // ── Helpers de champ (signatures FIXES — ne pas réinventer) ────────
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }

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

  _entity(key, label, prefix = '') {
    const row = this._row(label);
    const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
    inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
    inp.setAttribute('list', `ndg-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value.trim()));
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

  // Extension au canon : slider avec valeur affichée en live.
  _range(key, label, { min = 0, max = 1, step = 0.01 } = {}) {
    const row = this._row(label);
    const box = document.createElement('div'); box.className = 'range-row';
    const inp = document.createElement('input'); inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step;
    inp.dataset.key = key;
    const v = this._read(key); inp.value = (v == null ? min : v);
    const lbl = document.createElement('span'); lbl.className = 'range-val'; lbl.textContent = inp.value;
    inp._rngLbl = lbl;
    inp.addEventListener('input', () => { lbl.textContent = inp.value; this._set(key, parseFloat(inp.value)); });
    box.appendChild(inp); box.appendChild(lbl); row.wrap.appendChild(box); return inp;
  }

  // Extension au canon : textarea YAML (listes d'objets) — severity/markers/zones.
  _textarea(key, label, ph = '') {
    const row = this._row(label);
    const ta = document.createElement('textarea'); ta.placeholder = ph; ta.dataset.key = key;
    const v = this._read(key); ta.value = v ? this._yamlStringify(v) : '';
    ta.addEventListener('blur', () => this._set(key, this._yamlParse(ta.value)));
    row.wrap.appendChild(ta); return ta;
  }

  _yamlStringify(obj) {
    if (!obj || !Array.isArray(obj)) return '';
    return obj.map(item => {
      const lines = Object.entries(item).map(([k, v]) => typeof v === 'string' ? `  ${k}: '${v}'` : `  ${k}: ${v}`);
      return '- ' + lines.join('\n  ').substring(2);
    }).join('\n');
  }

  _yamlParse(str) {
    if (!str || !str.trim()) return undefined;
    try {
      const items = [];
      const lines = str.split('\n').map(l => l.trim()).filter(l => l);
      let cur = null;
      for (const line of lines) {
        if (line.startsWith('-')) {
          if (cur) items.push(cur);
          cur = {};
          const rest = line.substring(1).trim();
          if (rest) {
            const [k, ...vp] = rest.split(':');
            const val = vp.join(':').trim().replace(/^['"]|['"]$/g, '');
            cur[k.trim()] = isNaN(val) ? val : parseFloat(val);
          }
        } else if (line.includes(':') && cur) {
          const [k, ...vp] = line.split(':');
          const val = vp.join(':').trim().replace(/^['"]|['"]$/g, '');
          cur[k.trim()] = isNaN(val) ? val : parseFloat(val);
        } else {
          console.warn('Neon Dual Gauge Card: ligne YAML zones ignorée (format non reconnu):', line);
        }
      }
      if (cur) items.push(cur);
      return items.length > 0 ? items : undefined;
    } catch (e) { console.warn('YAML parse error:', e); return undefined; }
  }

  // ── Mécanique commune (NE PAS toucher, + _appendTo pour grouper) ────
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

  // ── CSS commun (identique partout, + spécifique range/textarea) ─────
  _css() {
    return `
      :host { display:block; padding:14px; font-family:var(--primary-font-family,Roboto,sans-serif); }
      .sec { font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--divider-color); }
      .sec:first-child { margin-top:0; }
      .row { display:flex;align-items:center;gap:8px;margin-bottom:6px; }
      .row label { flex:0 0 160px;font-size:12px;color:var(--secondary-text-color); }
      .row label .mdi-link { color:var(--primary-color);font-size:9px;text-transform:none;letter-spacing:0; }
      .field-wrap { flex:1;min-width:0;display:flex; }
      input[type=text],input[type=number],select,textarea { flex:1;width:100%;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;outline:none;box-sizing:border-box; }
      textarea { font-family:monospace;min-height:70px;resize:vertical; }
      select { cursor:pointer; }
      input:focus,select:focus,textarea:focus { box-shadow:0 0 0 1px var(--primary-color); }
      .color-row { display:flex;gap:8px;flex:1; }
      .color-row input[type=text] { flex:1; }
      .color-row input[type=color] { width:36px;height:28px;flex:none;padding:0;border:none;background:none;border-radius:4px;cursor:pointer; }
      .icon-preview { width:30px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;border:1px solid var(--divider-color);border-radius:4px;color:var(--primary-text-color); }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 6px 168px; }
      .range-row { display:flex;gap:8px;flex:1;align-items:center; }
      .range-row input[type=range] { flex:1; }
      .range-row .range-val { flex:none;width:36px;text-align:right;font-size:11px;color:var(--secondary-text-color); }
      .gauge-block { border:1px dashed var(--divider-color);border-radius:8px;padding:8px 10px 2px;margin-bottom:12px; }
      .gauge-block-title { font-size:12px;font-weight:700;color:var(--primary-text-color);margin-bottom:8px; }
      .adv-block { margin:8px 0 4px;padding-top:8px;border-top:1px dashed var(--divider-color); }
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
    this._section('Carte');
    this._text('name', 'Titre de la carte', 'Nom de la carte');
    this._text('title_font_family', 'Police du titre', 'inherit');
    this._select('title_position', 'Position du titre', NDG_POSITIONS.map(p => ({ value: p, label: p })));
    this._number('gauge_size', 'Taille jauge externe (px)', { min: 100, max: 400, step: 1, ph: '200' });
    this._number('inner_gauge_size', 'Taille jauge interne (px)', { ph: 'Auto (65%)' });
    this._number('inner_gauge_radius', 'Rayon jauge interne (px)', { ph: 'Auto' });
    this._select('primary_gauge', 'Jauge principale', [{ value: 'inner', label: 'Interne' }, { value: 'outer', label: 'Externe' }]);

    this._section('Effets visuels');
    this._toggle('enable_custom_effects', 'Effets visuels', true);
    this._toggle('enable_top_glow', 'Lueur supérieure', true);
    this._toggle('enable_pulse_animation', 'Animation pulse', true);
    this._toggle('neon_value_glow', 'Triple neon glow (valeurs)', true);
    this._toggle('value_glow_dynamic', 'Glow de valeur dynamique (suit la sévérité)', true);
    this._toggle('enable_comet_head', 'Tête de comète + traînée', true);
    this._toggle('enable_ignition', "Sweep d'allumage (ignition)", true);
    this._toggle('enable_tick_marks', 'Graduations gravées', true);
    this._toggle('enable_glass_center', 'Anneau de verre central', true);
    this._range('pulse_intensity', 'Intensité pulse (px)', { min: 5, max: 80, step: 1 });
    this._range('pulse_speed', 'Vitesse pulse (s)', { min: 1, max: 12, step: 0.5 });
    this._range('pulse_min_opacity', 'Opacité min pulse', { min: 0, max: 0.9, step: 0.05 });
    this._toggle('enable_glitch_hover', 'Effet glitch survol', true);
    this._toggle('hide_card', 'Masquer cadre', false);

    this._section('Thème');
    this._select('card_theme', 'Thème carte', NDG_THEMES, 'Défaut');
    this._color('custom_background', 'Fond personnalisé', null, '#1a1a1a');
    this._color('custom_gauge_background', 'Fond jauge', null, 'radial-gradient(...)');
    this._color('custom_center_background', 'Fond centre', null, 'radial-gradient(...)');
    this._color('custom_text_color', 'Couleur texte', null, '#ffffff');
    this._color('custom_secondary_text_color', 'Couleur texte secondaire', null, '#cccccc');
    this._toggle('hide_shadows', 'Masquer ombres', false);

    this._section('Performance');
    this._number('update_interval', 'Intervalle MàJ (ms)', { min: 100, max: 10000, step: 100, ph: '1000' });
    this._toggle('power_save_mode', 'Économie énergie', false);
    this._toggle('debounce_updates', 'Debounce MàJ', false);
    this._toggle('kiosk_mode', 'Mode kiosque (économie thermique)', false);

    [0, 1].forEach(idx => {
      this._section(idx === 0 ? 'Jauge Interne (0)' : 'Jauge Externe (1)');
      const box = document.createElement('div'); box.className = 'gauge-block'; this.appendChild(box);
      this._appendTo = box;
      this._entity(`gauges.${idx}.entity`, 'Entité', 'sensor');
      this._number(`gauges.${idx}.min`, 'Min', { ph: '0' });
      this._number(`gauges.${idx}.max`, 'Max', { ph: '100' });
      this._text(`gauges.${idx}.unit`, 'Unité', '°C, %, W');
      this._number(`gauges.${idx}.decimals`, 'Décimales', { min: 0, max: 3, step: 1, ph: '1' });
      this._number(`gauges.${idx}.leds_count`, 'Nombre LEDs', { min: 20, max: 200, step: 1, ph: '100' });
      this._number(`gauges.${idx}.led_size`, 'Taille LED (px)', { min: 3, max: 15, step: 1, ph: idx === 0 ? '6' : '8' });
      this._number(`gauges.${idx}.animation_duration`, 'Durée animation (ms)', { min: 100, max: 3000, step: 10, ph: '800' });
      this._toggle(`gauges.${idx}.smooth_transitions`, 'Transitions douces', true);
      this._toggle(`gauges.${idx}.bidirectional`, 'Bidirectionnel', false);
      this._toggle(`gauges.${idx}.hide_inactive_leds`, 'Masquer LEDs inactives', false);

      const adv = document.createElement('div'); adv.className = 'adv-block'; box.appendChild(adv);
      this._appendTo = adv;
      this._hint('Avancé');
      this._select(`gauges.${idx}.theme`, 'Thème', NDG_THEMES, 'Défaut');
      this._color(`gauges.${idx}.custom_background`, 'Fond personnalisé', null, '#f0f0f0');
      this._color(`gauges.${idx}.custom_gauge_background`, 'Fond jauge', null, 'radial-gradient(...)');
      this._color(`gauges.${idx}.custom_center_background`, 'Fond centre', null, 'radial-gradient(...)');
      this._color(`gauges.${idx}.custom_text_color`, 'Couleur texte', null, '#333');
      this._color(`gauges.${idx}.custom_secondary_text_color`, 'Couleur texte secondaire', null, '#666');
      this._text(`gauges.${idx}.value_font_size`, 'Taille valeur', '24px');
      this._text(`gauges.${idx}.value_font_weight`, 'Poids valeur', 'bold');
      this._color(`gauges.${idx}.value_font_color`, 'Couleur valeur', 'var(--primary-text-color)');
      this._text(`gauges.${idx}.value_font_family`, 'Police valeur', 'inherit');
      this._text(`gauges.${idx}.unit_font_size`, 'Taille unité', '14px');
      this._text(`gauges.${idx}.unit_font_weight`, 'Poids unité', 'normal');
      this._color(`gauges.${idx}.unit_font_color`, 'Couleur unité', 'var(--secondary-text-color)');
      this._text(`gauges.${idx}.unit_font_family`, 'Police unité', 'inherit');
      this._toggle(`gauges.${idx}.enable_shadow`, 'Ombre conteneur', false);
      this._toggle(`gauges.${idx}.center_shadow`, 'Ombre centre', false);
      this._number(`gauges.${idx}.center_shadow_blur`, 'Flou ombre centre', { min: 0, max: 100, step: 1, ph: '30' });
      this._number(`gauges.${idx}.center_shadow_spread`, 'Étalement ombre centre', { min: 0, max: 50, step: 1, ph: '15' });
      this._toggle(`gauges.${idx}.outer_shadow`, 'Ombre externe', false);
      this._number(`gauges.${idx}.outer_shadow_blur`, 'Flou ombre externe', { min: 0, max: 100, step: 1, ph: '30' });
      this._number(`gauges.${idx}.outer_shadow_spread`, 'Étalement ombre externe', { min: 0, max: 50, step: 1, ph: '15' });
      this._number(`gauges.${idx}.markers_radius`, 'Rayon markers', { ph: 'Auto' });
      this._textarea(`gauges.${idx}.severity`, 'Zones de sévérité (YAML)', "- color: '#4caf50'\n  value: 33\n- color: '#ff9800'\n  value: 66");
      this._hint('Format YAML — liste de seuils color/value');
      this._textarea(`gauges.${idx}.markers`, 'Marqueurs (YAML)', "- value: 50\n  color: '#ffffff'\n  label: 'Mid'");
      this._hint('Format YAML — liste de marqueurs');
      this._textarea(`gauges.${idx}.zones`, 'Zones colorées (YAML)', "- from: 20\n  to: 80\n  color: '#00ff00'\n  opacity: '0.3'");
      this._hint('Format YAML — zones colorées');
      this._appendTo = null;
    });
  }
}

if (!customElements.get("neon-dual-gauge-card-editor")) {
  customElements.define("neon-dual-gauge-card-editor", NeonDualGaugeCardEditor);
}

// ============================================================================
// REGISTER CUSTOM ELEMENT
// ============================================================================

console.info(
  `%c NEON-DUAL-GAUGE-CARD \n%c Version ${CARD_VERSION} - Universal Theme Edition `,
  'color: cyan; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

if (!customElements.get("neon-dual-gauge-card")) {
  customElements.define("neon-dual-gauge-card", NeonDualGaugeCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "neon-dual-gauge-card",
  name: "Neon Dual Gauge Card",
  description: "A dual concentric LED gauge card with neon effects and full theme inheritance."
});

console.info(
  '%c ⚡ neon-dual-gauge-card v2.0.0 %c Neo Tokyo ',
  'background:#9D4EDD;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#00D4FF;padding:2px 4px;border-radius:0 3px 3px 0;'
);
