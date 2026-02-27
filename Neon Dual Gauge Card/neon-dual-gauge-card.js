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

const CARD_VERSION = '2.0.0';

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
function calculateBidirectionalLeds(value, min, max, ledsCount, bidirectional) {
  // Calculate full-range normalized value for severity colors (always needed)
  const fullRangeNormalized = ((value - min) / (max - min)) * 100;

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
    const percentage = ((value - min) / (max - min)) * 100;
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
  will-change: transform, box-shadow;
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
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.5s ease,
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

/* Animation neon pulse custom */
@keyframes neonPulseCustom {
  0%, 100% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5),
                0 0 20px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.15);
  }
  50% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5),
                0 0 30px rgba(var(--rgb-state-active-color, 255, 80, 160), 0.25),
                0 0 45px rgba(var(--rgb-primary-color, 0, 232, 255), 0.12);
  }
}

:host(.custom-effects.animate-pulse) ha-card {
  animation: neonPulseCustom var(--animation-speed-card, 4s) ease-in-out infinite;
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
                0 0 120px rgba(var(--rgb-primary-color, 0, 232, 255), 0.4) !important;
    border-color: rgba(var(--rgb-primary-color, 0, 232, 255), var(--border-opacity-hover, 0.4));
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
  will-change: background, box-shadow;
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
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.value {
  font-family: var(--value-font-family);
  transition: all 0.3s ease;
}

#value-inner {
  font-size: var(--value-font-size-inner);
  font-weight: var(--value-font-weight-inner);
  color: var(--value-font-color-inner);
}

#value-outer {
  font-size: var(--value-font-size-outer);
  font-weight: var(--value-font-weight-outer);
  color: var(--value-font-color-outer);
}

.unit {
  /* Common styles if needed */
}

#unit-inner {
  font-size: var(--unit-font-size-inner);
  font-weight: var(--unit-font-weight-inner);
  color: var(--unit-font-color-inner);
}

#unit-outer {
  font-size: var(--unit-font-size-outer);
  font-weight: var(--unit-font-weight-outer);
  color: var(--unit-font-color-outer);
}

.title {
  margin-top: 10px;
  font-size: var(--title-font-size);
  font-family: var(--title-font-family);
  font-weight: var(--title-font-weight);
  color: var(--title-font-color);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
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
  opacity: 0.8;
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
  font-size: 10px;
  color: #fff;
  z-index: 2;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
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
  const valSizeScaled = `${parsePx(valSize1) * 0.7}px`;
  const unitSizeScaled = `${parsePx(unitSize1) * 0.85}px`;

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
    
    --value-font-family: ${config1.value_font_family || 'inherit'};
    
    --value-font-size-inner: ${vSizeInner};
    --value-font-weight-inner: ${vWeightInner};
    --value-font-color-inner: ${vColorInner};
    
    --value-font-size-outer: ${vSizeOuter};
    --value-font-weight-outer: ${vWeightOuter};
    --value-font-color-outer: ${vColorOuter};
    
    --unit-font-size-inner: ${uSizeInner};
    --unit-font-weight-inner: ${uWeightInner};
    --unit-font-color-inner: ${uColorInner};
    
    --unit-font-size-outer: ${uSizeOuter};
    --unit-font-weight-outer: ${uWeightOuter};
    --unit-font-color-outer: ${uColorOuter};

    --title-font-size: ${context.config.title_font_size || '16px'};
    --title-font-family: ${context.config.title_font_family || 'inherit'};
    --title-font-weight: ${context.config.title_font_weight || 'normal'};
    --title-font-color: ${context.config.title_font_color || globalTheme.textColor};
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
    animatePulse && customEffects && !hideCard ? 'animate-pulse' : '',
    glitchHover && customEffects && !hideCard ? 'glitch-hover' : ''
  ].filter(Boolean).join(' ');

  // Layout-only classes stay on the inner wrapper.
  const cardClasses = [
    'gauge-card',
    'neon-dual-gauge-card',
    isInsidePosition ? 'has-inside-title' : '',
    hideCard ? 'no-card' : ''
  ].filter(Boolean).join(' ');

  // Générer le HTML du titre
  const titleHTML = `<div class="${titleClass}">${context.config.name || ""}</div>`;

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
        ${generateLedsHTML(ledsCount2, outerGaugeSize / 2, ledSize2, 'outer')}
        ${generateLedsHTML(ledsCount1, innerGaugeRadius, ledSize1, 'inner')}
        <div class="center dual-center" style="background: ${globalTheme.centerBackground}">
          <div class="value-group ${isPrimaryInner ? '' : 'secondary'}" id="group-inner">
            <div class="value" id="value-inner">0</div>
            <div class="unit" id="unit-inner"></div>
          </div>
          <div class="value-group ${isPrimaryInner ? 'secondary' : ''}" id="group-outer">
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
        const labelX = (markersRadius1 + 10) * Math.cos(angleRad);
        const labelY = (markersRadius1 + 10) * Math.sin(angleRad);

        const labelElement = document.createElement('div');
        labelElement.className = 'marker-label';
        labelElement.textContent = marker.label;
        labelElement.style.cssText = `
          position: absolute;
          font-size: 10px;
          color: ${marker.color || '#fff'};
          white-space: nowrap;
          left: calc(50% + ${labelX}px);
          top: calc(50% + ${labelY}px);
          transform: translate(-50%, -50%);
          z-index: 2;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
        `;
        gauge.appendChild(labelElement);
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
        const labelX = (markersRadius2 + 10) * Math.cos(angleRad);
        const labelY = (markersRadius2 + 10) * Math.sin(angleRad);

        const labelElement = document.createElement('div');
        labelElement.className = 'marker-label';
        labelElement.textContent = marker.label;
        labelElement.style.cssText = `
          position: absolute;
          font-size: 10px;
          color: ${marker.color || '#fff'};
          white-space: nowrap;
          left: calc(50% + ${labelX}px);
          top: calc(50% + ${labelY}px);
          transform: translate(-50%, -50%);
          z-index: 2;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
        `;
        fragment.appendChild(labelElement);
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

      const circle = document.createElementNS(svgNS, "path");
      const radius = innerGaugeRadius + 5;
      const centerPoint = svgSize / 2;
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

      const circle = document.createElementNS(svgNS, "path");
      const radius = outerGaugeSize / 2 + 5;
      const centerPoint = (outerGaugeSize + 20) / 2;
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
  const gaugeCard = context.shadowRoot.querySelector('.gauge-card');
  if (gaugeCard) {
    gaugeCard.style.setProperty(`--active-led-color-${prefix}`, color);
  }

  // Appliquer l'ombre externe si enable_shadow est activé
  if (gaugeConfig.enable_shadow) {
    const gaugeContainer = context.shadowRoot.getElementById("gauge-container");
    if (gaugeContainer) {
      gaugeContainer.style.boxShadow = `0 0 30px 2px ${color}`;
    }
  }

  // Update LED states using CSS classes (more efficient than inline styles)
  for (let i = 0; i < ledsCount; i++) {
    const led = context.shadowRoot.getElementById(`led-${prefix}-${i}`);
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

  // Use requestAnimationFrame for smoother, GPU-synced animations
  const animate = (currentTime) => {
    const elapsed = currentTime - context[startTimeKey];
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentValue = fromValue + valueRange * easedProgress;
    const normalizedValue = ((currentValue - min) / (max - min)) * 100;

    updateLedsDual(context, normalizedValue, ledsCount, prefix, gaugeConfig);
    updateCenterShadow(context, normalizedValue, gaugeConfig, prefix);

    // Calculer le rayon approprié selon la gauge
    const radius = prefix === 'inner' ? context.innerGaugeRadius : (context.outerGaugeSize / 2);
    updateOuterShadow(context, normalizedValue, gaugeConfig, prefix, radius);

    const valueDisplay = context.shadowRoot?.querySelector(`#value-${prefix}`);
    if (valueDisplay) {
      valueDisplay.textContent = currentValue.toFixed(gaugeConfig.decimals ?? 1);
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
  const centerShadow = context.shadowRoot.getElementById(`center-shadow-${shadowId}`);

  if (centerShadow) {
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
  const outerShadow = context.shadowRoot.getElementById(`outer-shadow-${shadowId}`);

  if (outerShadow) {
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
  if (!config1.entity || !config2.entity) {
    // Afficher un message d'aide si les entités ne sont pas configurées
    const container = context.shadowRoot?.querySelector('.gauge-card');
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
        <div style="font-weight: bold; margin-bottom: 5px;">Configuration incomplète</div>
        <div style="font-size: 13px; opacity: 0.8;">Veuillez configurer les entités des deux jauges</div>
      `;
      container.appendChild(warning);
    }
    return;
  }

  const entityState1 = context._hass.states[config1.entity];
  const entityState2 = context._hass.states[config2.entity];

  if (!entityState1 || !entityState2) return;

  // Guard against unavailable/unknown states
  const rawState1 = parseFloat(entityState1.state);
  const rawState2 = parseFloat(entityState2.state);
  if (isNaN(rawState1) || isNaN(rawState2)) return;

  const state1 = rawState1;
  const state2 = rawState2;

  const previousState1 = context.previousState1 !== null ? context.previousState1 : state1;
  const previousState2 = context.previousState2 !== null ? context.previousState2 : state2;

  // Update inner gauge
  const min1 = config1.min;
  const max1 = config1.max;

  if (config1.smooth_transitions && previousState1 !== state1) {
    animateValueChangeDual(context, previousState1, state1, min1, max1, 'inner', 0);
  } else {
    const normalizedValue1 = ((state1 - min1) / (max1 - min1)) * 100;
    updateLedsDual(context, normalizedValue1, context.ledsCount1, 'inner', config1);
    updateCenterShadow(context, normalizedValue1, config1, 'inner');
    updateOuterShadow(context, normalizedValue1, config1, 'inner', context.innerGaugeRadius);

    const valueDisplay1 = context.shadowRoot.querySelector("#value-inner");
    const unitDisplay1 = context.shadowRoot.querySelector("#unit-inner");
    if (valueDisplay1) valueDisplay1.textContent = state1.toFixed(config1.decimals ?? 1);
    if (unitDisplay1) unitDisplay1.textContent = config1.unit || "";
  }

  // Update outer gauge
  const min2 = config2.min;
  const max2 = config2.max;

  if (config2.smooth_transitions && previousState2 !== state2) {
    animateValueChangeDual(context, previousState2, state2, min2, max2, 'outer', 1);
  } else {
    const normalizedValue2 = ((state2 - min2) / (max2 - min2)) * 100;
    updateLedsDual(context, normalizedValue2, context.ledsCount2, 'outer', config2);
    updateCenterShadow(context, normalizedValue2, config2, 'outer');
    updateOuterShadow(context, normalizedValue2, config2, 'outer', context.outerGaugeSize / 2);

    const valueDisplay2 = context.shadowRoot.querySelector("#value-outer");
    const unitDisplay2 = context.shadowRoot.querySelector("#unit-outer");
    if (valueDisplay2) valueDisplay2.textContent = state2.toFixed(config2.decimals ?? 1);
    if (unitDisplay2) unitDisplay2.textContent = config2.unit || "";
  }

  context.previousState1 = state1;
  context.previousState2 = state2;
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
    power_save_mode: config.power_save_mode || false,
    debounce_updates: config.debounce_updates || false,
    hide_shadows: config.hide_shadows || false,

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
    try {
      this.config = parseDualConfig(config);
    } catch (error) {
      // Si la config est invalide, afficher l'erreur dans la carte
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

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    renderDual(this);

    this._updateDualGauge = () => updateDualGauge(this);

    const groupInner = this.shadowRoot.getElementById("group-inner");
    if (groupInner) {
      groupInner.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showEntityHistory(this.config.gauges[0].entity);
      });
    }

    const groupOuter = this.shadowRoot.getElementById("group-outer");
    if (groupOuter) {
      groupOuter.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showEntityHistory(this.config.gauges[1].entity);
      });
    }

    if (this.config.power_save_mode) {
      this._setupVisibilityObserver();
    }
  }

  set hass(hass) {
    this._hass = hass;

    if (this.config.power_save_mode && !this.isVisible) return;

    if (this.config.debounce_updates) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      this.updateTimer = setTimeout(() => {
        this._updateDualGauge();
      }, this.config.update_interval);
    } else {
      this._updateDualGauge();
    }
  }

  disconnectedCallback() {
    // Cancel requestAnimationFrame instead of clearInterval
    if (this.animationFrame1) cancelAnimationFrame(this.animationFrame1);
    if (this.animationFrame2) cancelAnimationFrame(this.animationFrame2);
    if (this.updateTimer) clearTimeout(this.updateTimer);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
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

class NeonDualGaugeCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    if (!this._config.gauges || this._config.gauges.length < 2) {
      this._config.gauges = [
        { entity: "", min: 0, max: 100 },
        { entity: "", min: 0, max: 100 }
      ];
    }
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._entities) {
      this._entities = Object.keys(hass.states).sort();
    }
  }

  render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';
    const t = {
      // Card-level
      cardTitle: lang === 'fr' ? 'Titre de la carte' : 'Card Title',
      titlePosition: lang === 'fr' ? 'Position du titre' : 'Title Position',
      gaugeSize: lang === 'fr' ? 'Taille jauge externe' : 'Outer Gauge Size',
      innerGaugeSize: lang === 'fr' ? 'Taille jauge interne' : 'Inner Gauge Size',
      primaryGauge: lang === 'fr' ? 'Jauge principale' : 'Primary Gauge',
      hideCard: lang === 'fr' ? 'Masquer cadre' : 'Hide Card Frame',
      effects: lang === 'fr' ? 'Effets visuels' : 'Visual Effects',
      topGlow: lang === 'fr' ? 'Lueur supérieure' : 'Top Glow',
      pulse: lang === 'fr' ? 'Animation pulse' : 'Pulse Animation',
      glitchHover: lang === 'fr' ? 'Effet glitch survol' : 'Glitch on Hover',
      // Themes
      theme: lang === 'fr' ? 'Thème' : 'Theme',
      cardTheme: lang === 'fr' ? 'Thème carte' : 'Card Theme',
      hideShadows: lang === 'fr' ? 'Masquer ombres' : 'Hide Shadows',
      customBackground: lang === 'fr' ? 'Fond personnalisé' : 'Custom Background',
      customGaugeBackground: lang === 'fr' ? 'Fond jauge' : 'Custom Gauge Background',
      customCenterBackground: lang === 'fr' ? 'Fond centre' : 'Custom Center Background',
      customTextColor: lang === 'fr' ? 'Couleur texte' : 'Custom Text Color',
      customSecondaryTextColor: lang === 'fr' ? 'Couleur texte secondaire' : 'Custom Secondary Text Color',
      // Performance
      performance: lang === 'fr' ? 'Performance' : 'Performance',
      powerSave: lang === 'fr' ? 'Économie énergie' : 'Power Save Mode',
      debounce: lang === 'fr' ? 'Debounce MàJ' : 'Debounce Updates',
      // Gauges
      innerGauge: lang === 'fr' ? 'Jauge Interne (0)' : 'Inner Gauge (0)',
      outerGauge: lang === 'fr' ? 'Jauge Externe (1)' : 'Outer Gauge (1)',
      entity: lang === 'fr' ? 'Entité' : 'Entity',
      min: lang === 'fr' ? 'Min' : 'Min',
      max: lang === 'fr' ? 'Max' : 'Max',
      unit: lang === 'fr' ? 'Unité' : 'Unit',
      decimals: lang === 'fr' ? 'Décimales' : 'Decimals',
      ledsCount: lang === 'fr' ? 'Nombre LEDs' : 'LED Count',
      ledSize: lang === 'fr' ? 'Taille LED' : 'LED Size',
      smoothTransitions: lang === 'fr' ? 'Transitions douces' : 'Smooth Transitions',
      animationDuration: lang === 'fr' ? 'Durée animation (ms)' : 'Animation Duration (ms)',
      bidirectional: lang === 'fr' ? 'Bidirectionnel' : 'Bidirectional',
      hideInactiveLeds: lang === 'fr' ? 'Masquer LEDs inactives' : 'Hide Inactive LEDs',
      // Styling
      valueSize: lang === 'fr' ? 'Taille valeur' : 'Value Size',
      valueWeight: lang === 'fr' ? 'Poids valeur' : 'Value Weight',
      valueColor: lang === 'fr' ? 'Couleur valeur' : 'Value Color',
      unitSize: lang === 'fr' ? 'Taille unité' : 'Unit Size',
      unitWeight: lang === 'fr' ? 'Poids unité' : 'Unit Weight',
      unitColor: lang === 'fr' ? 'Couleur unité' : 'Unit Color',
      // Shadows
      shadows: lang === 'fr' ? 'Ombres' : 'Shadows',
      enableShadow: lang === 'fr' ? 'Ombre conteneur' : 'Container Shadow',
      centerShadow: lang === 'fr' ? 'Ombre centre' : 'Center Shadow',
      centerShadowBlur: lang === 'fr' ? 'Flou ombre centre' : 'Center Shadow Blur',
      centerShadowSpread: lang === 'fr' ? 'Étalement ombre centre' : 'Center Shadow Spread',
      outerShadow: lang === 'fr' ? 'Ombre externe' : 'Outer Shadow',
      outerShadowBlur: lang === 'fr' ? 'Flou ombre externe' : 'Outer Shadow Blur',
      outerShadowSpread: lang === 'fr' ? 'Étalement ombre externe' : 'Outer Shadow Spread',
      // Advanced
      advanced: lang === 'fr' ? 'Avancé' : 'Advanced',
      updateInterval: lang === 'fr' ? 'Intervalle MàJ (ms)' : 'Update Interval (ms)',
      innerGaugeRadius: lang === 'fr' ? 'Rayon jauge interne' : 'Inner Gauge Radius',
      markersRadius: lang === 'fr' ? 'Rayon markers' : 'Markers Radius',
      severityCustom: lang === 'fr' ? 'Zones de sévérité (YAML)' : 'Severity Zones (YAML)',
      markersCustom: lang === 'fr' ? 'Marqueurs (YAML)' : 'Markers (YAML)',
      zonesCustom: lang === 'fr' ? 'Zones colorées (YAML)' : 'Colored Zones (YAML)',
    };

    const positionOptions = [
      { value: 'bottom', label: 'Bottom' },
      { value: 'top', label: 'Top' },
      { value: 'inside-top', label: 'Inside Top' },
      { value: 'inside-bottom', label: 'Inside Bottom' },
      { value: 'none', label: 'None' }
    ];

    const primaryOptions = [
      { value: 'inner', label: 'Inner' },
      { value: 'outer', label: 'Outer' }
    ];

    const themeOptions = [
      { value: '', label: lang === 'fr' ? 'Défaut' : 'Default' },
      { value: 'light', label: lang === 'fr' ? 'Clair' : 'Light' },
      { value: 'dark', label: lang === 'fr' ? 'Sombre' : 'Dark' },
      { value: 'custom', label: lang === 'fr' ? 'Personnalisé' : 'Custom' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 20px;
          background: var(--ha-card-background, var(--card-background-color));
          color: var(--primary-text-color);
        }
        .section {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--divider-color);
        }
        .section:last-child {
          border-bottom: none;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--primary-color);
        }
        .row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          align-items: center;
        }
        .field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        label {
          font-size: 13px;
          font-weight: 500;
          color: var(--secondary-text-color);
        }
        input[type="text"],
        input[type="number"],
        select {
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          max-width: 100%;
        }
        select.entity-select {
          font-family: monospace;
        }
        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .checkbox-row label {
          margin: 0;
          cursor: pointer;
        }
        .gauge-section {
          background: var(--secondary-background-color);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .gauge-title {
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--primary-text-color);
        }
        .entity-input {
          position: relative;
        }
        .no-entity-warning {
          color: var(--warning-color, #ff9800);
          font-size: 12px;
          margin-top: 4px;
        }
        textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          font-family: monospace;
          font-size: 13px;
          resize: vertical;
          min-height: 80px;
        }
        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        .yaml-help {
          font-size: 11px;
          color: var(--secondary-text-color);
          margin-top: 4px;
          font-style: italic;
        }
      </style>

      <div class="section">
        <div class="section-title">${t.cardTitle}</div>
        <div class="row">
          <div class="field">
            <label>${t.cardTitle}</label>
            <input type="text" id="name" value="${this._config.name || ''}" 
                   placeholder="${lang === 'fr' ? 'Nom de la carte' : 'Card name'}">
          </div>
          <div class="field">
            <label>${t.titlePosition}</label>
            <select id="title_position">
              ${positionOptions.map(opt => `
                <option value="${opt.value}" ${(this._config.title_position || 'bottom') === opt.value ? 'selected' : ''}>
                  ${opt.label}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
        <div class="row">
          <div class="field">
            <label>${t.gaugeSize} (px)</label>
            <input type="number" id="gauge_size" value="${this._config.gauge_size || 200}" min="100" max="400">
          </div>
          <div class="field">
            <label>${t.innerGaugeSize} (px)</label>
            <input type="number" id="inner_gauge_size" value="${this._config.inner_gauge_size || ''}" 
                   placeholder="${lang === 'fr' ? 'Auto (65%)' : 'Auto (65%)'}">
          </div>
          <div class="field">
            <label>${t.innerGaugeRadius} (px)</label>
            <input type="number" id="inner_gauge_radius" value="${this._config.inner_gauge_radius || ''}" 
                   placeholder="${lang === 'fr' ? 'Auto' : 'Auto'}">
          </div>
          <div class="field">
            <label>${t.primaryGauge}</label>
            <select id="primary_gauge">
              ${primaryOptions.map(opt => `
                <option value="${opt.value}" ${(this._config.primary_gauge || 'inner') === opt.value ? 'selected' : ''}>
                  ${opt.label}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${t.effects}</div>
        <div class="checkbox-row">
          <input type="checkbox" id="enable_custom_effects" 
                 ${this._config.enable_custom_effects !== false ? 'checked' : ''}>
          <label for="enable_custom_effects">${t.effects}</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="enable_top_glow" 
                 ${this._config.enable_top_glow !== false ? 'checked' : ''}>
          <label for="enable_top_glow">${t.topGlow}</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="enable_pulse_animation" 
                 ${this._config.enable_pulse_animation !== false ? 'checked' : ''}>
          <label for="enable_pulse_animation">${t.pulse}</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="enable_glitch_hover" 
                 ${this._config.enable_glitch_hover !== false ? 'checked' : ''}>
          <label for="enable_glitch_hover">${t.glitchHover}</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="hide_card" 
                 ${this._config.hide_card ? 'checked' : ''}>
          <label for="hide_card">${t.hideCard}</label>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${t.theme}</div>
        <div class="row">
          <div class="field">
            <label>${t.cardTheme}</label>
            <select id="card_theme">
              ${themeOptions.map(opt => `
                <option value="${opt.value}" ${(this._config.card_theme || '') === opt.value ? 'selected' : ''}>
                  ${opt.label}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="field">
            <label>${t.customBackground}</label>
            <input type="text" id="custom_background" 
                   value="${this._config.custom_background || ''}" 
                   placeholder="#1a1a1a">
          </div>
        </div>
        <div class="row">
          <div class="field">
            <label>${t.customGaugeBackground}</label>
            <input type="text" id="custom_gauge_background" 
                   value="${this._config.custom_gauge_background || ''}" 
                   placeholder="radial-gradient(circle, #333, #111)">
          </div>
          <div class="field">
            <label>${t.customCenterBackground}</label>
            <input type="text" id="custom_center_background" 
                   value="${this._config.custom_center_background || ''}" 
                   placeholder="radial-gradient(circle, #444, #222)">
          </div>
        </div>
        <div class="row">
          <div class="field">
            <label>${t.customTextColor}</label>
            <input type="text" id="custom_text_color" 
                   value="${this._config.custom_text_color || ''}" 
                   placeholder="#ffffff">
          </div>
          <div class="field">
            <label>${t.customSecondaryTextColor}</label>
            <input type="text" id="custom_secondary_text_color" 
                   value="${this._config.custom_secondary_text_color || ''}" 
                   placeholder="#cccccc">
          </div>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="hide_shadows" 
                 ${this._config.hide_shadows ? 'checked' : ''}>
          <label for="hide_shadows">${t.hideShadows}</label>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${t.performance}</div>
        <div class="row">
          <div class="field">
            <label>${t.updateInterval}</label>
            <input type="number" id="update_interval" value="${this._config.update_interval || 1000}" 
                   min="100" max="10000" step="100">
          </div>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="power_save_mode" 
                 ${this._config.power_save_mode ? 'checked' : ''}>
          <label for="power_save_mode">${t.powerSave}</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="debounce_updates" 
                 ${this._config.debounce_updates ? 'checked' : ''}>
          <label for="debounce_updates">${t.debounce}</label>
        </div>
      </div>

      ${[0, 1].map(idx => {
        const gauge = this._config.gauges[idx] || {};
        const title = idx === 0 ? t.innerGauge : t.outerGauge;
        const entities = this._entities || [];
        const currentEntity = gauge.entity || '';
        
        return `
          <div class="gauge-section">
            <div class="gauge-title">${title}</div>
            <div class="row">
              <div class="field">
                <label>${t.entity} *</label>
                <div class="entity-input">
                  <select id="gauge${idx}_entity" class="entity-select" required>
                    <option value="">${lang === 'fr' ? '-- Sélectionner une entité --' : '-- Select an entity --'}</option>
                    ${entities.map(entity => `
                      <option value="${entity}" ${entity === currentEntity ? 'selected' : ''}>
                        ${entity}
                      </option>
                    `).join('')}
                  </select>
                  ${!currentEntity ? `<div class="no-entity-warning">${lang === 'fr' ? 'Entité requise' : 'Entity required'}</div>` : ''}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="field">
                <label>${t.min}</label>
                <input type="number" id="gauge${idx}_min" value="${gauge.min !== undefined ? gauge.min : 0}">
              </div>
              <div class="field">
                <label>${t.max}</label>
                <input type="number" id="gauge${idx}_max" value="${gauge.max !== undefined ? gauge.max : 100}">
              </div>
              <div class="field">
                <label>${t.unit}</label>
                <input type="text" id="gauge${idx}_unit" value="${gauge.unit || ''}" placeholder="°C, %, W">
              </div>
              <div class="field">
                <label>${t.decimals}</label>
                <input type="number" id="gauge${idx}_decimals" value="${gauge.decimals !== undefined ? gauge.decimals : 1}" 
                       min="0" max="3">
              </div>
            </div>
            <div class="row">
              <div class="field">
                <label>${t.ledsCount}</label>
                <input type="number" id="gauge${idx}_leds_count" value="${gauge.leds_count || 100}" 
                       min="20" max="200">
              </div>
              <div class="field">
                <label>${t.ledSize} (px)</label>
                <input type="number" id="gauge${idx}_led_size" value="${gauge.led_size || (idx === 0 ? 6 : 8)}" 
                       min="3" max="15">
              </div>
              <div class="field">
                <label>${t.animationDuration}</label>
                <input type="number" id="gauge${idx}_animation_duration" 
                       value="${gauge.animation_duration || 800}" min="100" max="3000">
              </div>
            </div>
            <div class="row">
              <div class="checkbox-row">
                <input type="checkbox" id="gauge${idx}_smooth_transitions" 
                       ${gauge.smooth_transitions !== false ? 'checked' : ''}>
                <label for="gauge${idx}_smooth_transitions">${t.smoothTransitions}</label>
              </div>
              <div class="checkbox-row">
                <input type="checkbox" id="gauge${idx}_bidirectional" 
                       ${gauge.bidirectional ? 'checked' : ''}>
                <label for="gauge${idx}_bidirectional">${t.bidirectional}</label>
              </div>
              <div class="checkbox-row">
                <input type="checkbox" id="gauge${idx}_hide_inactive_leds" 
                       ${gauge.hide_inactive_leds ? 'checked' : ''}>
                <label for="gauge${idx}_hide_inactive_leds">${t.hideInactiveLeds}</label>
              </div>
            </div>
            <details>
              <summary style="cursor: pointer; margin-top: 8px; font-weight: 500;">${t.advanced}</summary>
              <div style="margin-top: 12px;">
                <div class="row">
                  <div class="field">
                    <label>${t.theme}</label>
                    <select id="gauge${idx}_theme">
                      ${themeOptions.map(opt => `
                        <option value="${opt.value}" ${(gauge.theme || '') === opt.value ? 'selected' : ''}>
                          ${opt.label}
                        </option>
                      `).join('')}
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <label>${t.customBackground}</label>
                    <input type="text" id="gauge${idx}_custom_background" 
                           value="${gauge.custom_background || ''}" placeholder="#f0f0f0">
                  </div>
                  <div class="field">
                    <label>${t.customGaugeBackground}</label>
                    <input type="text" id="gauge${idx}_custom_gauge_background" 
                           value="${gauge.custom_gauge_background || ''}" placeholder="radial-gradient(...)">
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <label>${t.customCenterBackground}</label>
                    <input type="text" id="gauge${idx}_custom_center_background" 
                           value="${gauge.custom_center_background || ''}" placeholder="radial-gradient(...)">
                  </div>
                  <div class="field">
                    <label>${t.customTextColor}</label>
                    <input type="text" id="gauge${idx}_custom_text_color" 
                           value="${gauge.custom_text_color || ''}" placeholder="#333">
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <label>${t.customSecondaryTextColor}</label>
                    <input type="text" id="gauge${idx}_custom_secondary_text_color" 
                           value="${gauge.custom_secondary_text_color || ''}" placeholder="#666">
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <label>${t.valueSize}</label>
                    <input type="text" id="gauge${idx}_value_font_size" 
                           value="${gauge.value_font_size || ''}" placeholder="24px">
                  </div>
                  <div class="field">
                    <label>${t.valueWeight}</label>
                    <input type="text" id="gauge${idx}_value_font_weight" 
                           value="${gauge.value_font_weight || ''}" placeholder="bold">
                  </div>
                  <div class="field">
                    <label>${t.valueColor}</label>
                    <input type="text" id="gauge${idx}_value_font_color" 
                           value="${gauge.value_font_color || ''}" placeholder="var(--primary-text-color)">
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <label>${t.unitSize}</label>
                    <input type="text" id="gauge${idx}_unit_font_size" 
                           value="${gauge.unit_font_size || ''}" placeholder="14px">
                  </div>
                  <div class="field">
                    <label>${t.unitWeight}</label>
                    <input type="text" id="gauge${idx}_unit_font_weight" 
                           value="${gauge.unit_font_weight || ''}" placeholder="normal">
                  </div>
                  <div class="field">
                    <label>${t.unitColor}</label>
                    <input type="text" id="gauge${idx}_unit_font_color" 
                           value="${gauge.unit_font_color || ''}" placeholder="var(--secondary-text-color)">
                  </div>
                </div>
                <div class="checkbox-row">
                  <input type="checkbox" id="gauge${idx}_enable_shadow" ${gauge.enable_shadow ? 'checked' : ''}>
                  <label for="gauge${idx}_enable_shadow">${t.enableShadow}</label>
                </div>
                <div class="checkbox-row">
                  <input type="checkbox" id="gauge${idx}_center_shadow" ${gauge.center_shadow ? 'checked' : ''}>
                  <label for="gauge${idx}_center_shadow">${t.centerShadow}</label>
                </div>
                <div class="row" style="margin-left: 26px;">
                  <div class="field">
                    <label>${t.centerShadowBlur}</label>
                    <input type="number" id="gauge${idx}_center_shadow_blur" 
                           value="${gauge.center_shadow_blur || 30}" min="0" max="100">
                  </div>
                  <div class="field">
                    <label>${t.centerShadowSpread}</label>
                    <input type="number" id="gauge${idx}_center_shadow_spread" 
                           value="${gauge.center_shadow_spread || 15}" min="0" max="50">
                  </div>
                </div>
                <div class="checkbox-row">
                  <input type="checkbox" id="gauge${idx}_outer_shadow" ${gauge.outer_shadow ? 'checked' : ''}>
                  <label for="gauge${idx}_outer_shadow">${t.outerShadow}</label>
                </div>
                <div class="row" style="margin-left: 26px;">
                  <div class="field">
                    <label>${t.outerShadowBlur}</label>
                    <input type="number" id="gauge${idx}_outer_shadow_blur" 
                           value="${gauge.outer_shadow_blur || 30}" min="0" max="100">
                  </div>
                  <div class="field">
                    <label>${t.outerShadowSpread}</label>
                    <input type="number" id="gauge${idx}_outer_shadow_spread" 
                           value="${gauge.outer_shadow_spread || 15}" min="0" max="50">
                  </div>
                </div>
                <div style="margin-top: 16px;">
                  <label>${t.markersRadius}</label>
                  <input type="number" id="gauge${idx}_markers_radius" 
                         value="${gauge.markers_radius || ''}" placeholder="${lang === 'fr' ? 'Auto' : 'Auto'}">
                </div>
                <div style="margin-top: 12px;">
                  <label>${t.severityCustom}</label>
                  <textarea id="gauge${idx}_severity" placeholder="- color: '#4caf50'\n  value: 33\n- color: '#ff9800'\n  value: 66">${gauge.severity ? this._yamlStringify(gauge.severity) : ''}</textarea>
                  <div class="yaml-help">${lang === 'fr' ? 'Format YAML - Liste de seuils color/value' : 'YAML format - List of color/value thresholds'}</div>
                </div>
                <div style="margin-top: 12px;">
                  <label>${t.markersCustom}</label>
                  <textarea id="gauge${idx}_markers" placeholder="- value: 50\n  color: '#ffffff'\n  label: 'Mid'">${gauge.markers ? this._yamlStringify(gauge.markers) : ''}</textarea>
                  <div class="yaml-help">${lang === 'fr' ? 'Format YAML - Liste de marqueurs' : 'YAML format - List of markers'}</div>
                </div>
                <div style="margin-top: 12px;">
                  <label>${t.zonesCustom}</label>
                  <textarea id="gauge${idx}_zones" placeholder="- from: 20\n  to: 80\n  color: '#00ff00'\n  opacity: '0.3'">${gauge.zones ? this._yamlStringify(gauge.zones) : ''}</textarea>
                  <div class="yaml-help">${lang === 'fr' ? 'Format YAML - Zones colorées' : 'YAML format - Colored zones'}</div>
                </div>
              </div>
            </details>
          </div>
        `;
      }).join('')}
    `;

    this._attachListeners();
  }

  _attachListeners() {
    const inputs = this.shadowRoot.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('change', () => this._configChanged());
      input.addEventListener('input', (e) => {
        if (e.target.type === 'text' || e.target.tagName === 'TEXTAREA') {
          this._configChanged();
        }
      });
    });
  }

  _yamlStringify(obj) {
    if (!obj || !Array.isArray(obj)) return '';
    return obj.map(item => {
      const lines = Object.entries(item).map(([key, value]) => {
        if (typeof value === 'string') {
          return `  ${key}: '${value}'`;
        }
        return `  ${key}: ${value}`;
      });
      return '- ' + lines.join('\n  ').substring(2);
    }).join('\n');
  }

  _yamlParse(str) {
    if (!str || !str.trim()) return undefined;
    try {
      // Simple YAML parser pour les listes d'objets
      const items = [];
      const lines = str.split('\n').map(l => l.trim()).filter(l => l);
      let currentItem = null;
      
      for (const line of lines) {
        if (line.startsWith('-')) {
          if (currentItem) items.push(currentItem);
          currentItem = {};
          const rest = line.substring(1).trim();
          if (rest) {
            const [key, ...valueParts] = rest.split(':');
            const value = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
            currentItem[key.trim()] = isNaN(value) ? value : parseFloat(value);
          }
        } else if (line.includes(':') && currentItem) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
          currentItem[key.trim()] = isNaN(value) ? value : parseFloat(value);
        }
      }
      if (currentItem) items.push(currentItem);
      
      return items.length > 0 ? items : undefined;
    } catch (e) {
      console.warn('YAML parse error:', e);
      return undefined;
    }
  }

  _configChanged() {
    const getValue = (id) => {
      const el = this.shadowRoot.getElementById(id);
      if (!el) return undefined;
      if (el.type === 'checkbox') return el.checked;
      if (el.type === 'number') {
        const val = parseFloat(el.value);
        return isNaN(val) ? undefined : val;
      }
      const textVal = el.value || undefined;
      // Ne retourner que les valeurs non-vides pour les champs texte
      return (textVal && textVal.trim()) ? textVal : undefined;
    };

    const newConfig = {
      type: 'custom:neon-dual-gauge-card',
      name: getValue('name'),
      title_position: getValue('title_position'),
      gauge_size: getValue('gauge_size'),
      inner_gauge_size: getValue('inner_gauge_size'),
      inner_gauge_radius: getValue('inner_gauge_radius'),
      primary_gauge: getValue('primary_gauge'),
      hide_card: getValue('hide_card'),
      enable_custom_effects: getValue('enable_custom_effects'),
      enable_top_glow: getValue('enable_top_glow'),
      enable_pulse_animation: getValue('enable_pulse_animation'),
      enable_glitch_hover: getValue('enable_glitch_hover'),
      card_theme: getValue('card_theme'),
      custom_background: getValue('custom_background'),
      custom_gauge_background: getValue('custom_gauge_background'),
      custom_center_background: getValue('custom_center_background'),
      custom_text_color: getValue('custom_text_color'),
      custom_secondary_text_color: getValue('custom_secondary_text_color'),
      hide_shadows: getValue('hide_shadows'),
      update_interval: getValue('update_interval'),
      power_save_mode: getValue('power_save_mode'),
      debounce_updates: getValue('debounce_updates'),
      gauges: [0, 1].map(idx => {
        const gauge = {
          entity: getValue(`gauge${idx}_entity`),
          min: getValue(`gauge${idx}_min`),
          max: getValue(`gauge${idx}_max`),
          unit: getValue(`gauge${idx}_unit`),
          decimals: getValue(`gauge${idx}_decimals`),
          leds_count: getValue(`gauge${idx}_leds_count`),
          led_size: getValue(`gauge${idx}_led_size`),
          animation_duration: getValue(`gauge${idx}_animation_duration`),
          smooth_transitions: getValue(`gauge${idx}_smooth_transitions`),
          bidirectional: getValue(`gauge${idx}_bidirectional`),
          hide_inactive_leds: getValue(`gauge${idx}_hide_inactive_leds`),
          theme: getValue(`gauge${idx}_theme`),
          custom_background: getValue(`gauge${idx}_custom_background`),
          custom_gauge_background: getValue(`gauge${idx}_custom_gauge_background`),
          custom_center_background: getValue(`gauge${idx}_custom_center_background`),
          custom_text_color: getValue(`gauge${idx}_custom_text_color`),
          custom_secondary_text_color: getValue(`gauge${idx}_custom_secondary_text_color`),
          value_font_size: getValue(`gauge${idx}_value_font_size`),
          value_font_weight: getValue(`gauge${idx}_value_font_weight`),
          value_font_color: getValue(`gauge${idx}_value_font_color`),
          unit_font_size: getValue(`gauge${idx}_unit_font_size`),
          unit_font_weight: getValue(`gauge${idx}_unit_font_weight`),
          unit_font_color: getValue(`gauge${idx}_unit_font_color`),
          enable_shadow: getValue(`gauge${idx}_enable_shadow`),
          center_shadow: getValue(`gauge${idx}_center_shadow`),
          center_shadow_blur: getValue(`gauge${idx}_center_shadow_blur`),
          center_shadow_spread: getValue(`gauge${idx}_center_shadow_spread`),
          outer_shadow: getValue(`gauge${idx}_outer_shadow`),
          outer_shadow_blur: getValue(`gauge${idx}_outer_shadow_blur`),
          outer_shadow_spread: getValue(`gauge${idx}_outer_shadow_spread`),
          markers_radius: getValue(`gauge${idx}_markers_radius`),
          severity: this._yamlParse(getValue(`gauge${idx}_severity`)),
          markers: this._yamlParse(getValue(`gauge${idx}_markers`)),
          zones: this._yamlParse(getValue(`gauge${idx}_zones`))
        };
        // Remove undefined values
        Object.keys(gauge).forEach(key => {
          if (gauge[key] === undefined || gauge[key] === '') {
            delete gauge[key];
          }
        });
        return gauge;
      })
    };

    // Remove undefined/empty top-level values
    Object.keys(newConfig).forEach(key => {
      if (newConfig[key] === undefined || newConfig[key] === '') {
        delete newConfig[key];
      }
    });

    this._config = newConfig;

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define("neon-dual-gauge-card-editor", NeonDualGaugeCardEditor);

// ============================================================================
// REGISTER CUSTOM ELEMENT
// ============================================================================

console.info(
  `%c NEON-DUAL-GAUGE-CARD \n%c Version ${CARD_VERSION} - Universal Theme Edition `,
  'color: cyan; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

customElements.define("neon-dual-gauge-card", NeonDualGaugeCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "neon-dual-gauge-card",
  name: "Neon Dual Gauge Card",
  description: "A dual concentric LED gauge card with neon effects and full theme inheritance."
});
