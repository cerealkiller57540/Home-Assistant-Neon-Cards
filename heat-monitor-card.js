/* ── heat-monitor-card v1.17 ── */
const HMC_IS_IPAD    = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const HMC_IS_ANDROID = /Android/.test(navigator.userAgent);
const HMC_IS_LOW_POWER = HMC_IS_IPAD || HMC_IS_ANDROID || /iPhone/.test(navigator.userAgent);

// ── SVG structure — écran x=14 y=22 w=132 h=90
// Zone note scroll : y=96..112  Zone boutons : y=122..132
const HMC_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 160 155" version="1.1" width="100%" style="display:block">
  <defs>
    ${HMC_IS_LOW_POWER ? `
    <!-- LOW_POWER : filtre CRT léger sans feTurbulence -->
    <filter id="hmc-crt" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.08" intercept="0.01"/>
        <feFuncG type="linear" slope="0.75" intercept="0.02"/>
        <feFuncB type="linear" slope="1.3"  intercept="0.04"/>
      </feComponentTransfer>
    </filter>` : `
    <!-- DESKTOP : filtre CRT complet -->
    <filter id="hmc-crt" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.018" numOctaves="2" seed="5" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G" result="warped"/>
      <feGaussianBlur in="warped" stdDeviation="0.22" result="blurred"/>
      <feBlend in="warped" in2="blurred" mode="screen" result="bloomed"/>
      <feComponentTransfer in="bloomed">
        <feFuncR type="linear" slope="0.08" intercept="0.01"/>
        <feFuncG type="linear" slope="0.75" intercept="0.02"/>
        <feFuncB type="linear" slope="1.3"  intercept="0.04"/>
      </feComponentTransfer>
    </filter>`}
    <filter id="hmc-glow-cy" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0.7 0 0 0.9  0 0 1 0 1  0 0 0 2.5 0" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="hmc-flash" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope="6"/>
        <feFuncG type="linear" slope="6"/>
        <feFuncB type="linear" slope="6"/>
      </feComponentTransfer>
    </filter>
    <pattern id="hmc-scanlines" x="0" y="0" width="1" height="2.5" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="1.8" fill="transparent"/>
      <rect x="0" y="1.8" width="1" height="0.7" fill="rgba(0,0,0,0.30)"/>
    </pattern>
    <radialGradient id="hmc-vignette" cx="50%" cy="50%" r="65%">
      <stop offset="40%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.75)"/>
    </radialGradient>
    <linearGradient id="hmc-chassis-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1e1e2e"/>
      <stop offset="12%"  stop-color="#14141f"/>
      <stop offset="88%"  stop-color="#0b0b12"/>
      <stop offset="100%" stop-color="#060609"/>
    </linearGradient>
    <linearGradient id="hmc-btn-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1b1b3a"/>
      <stop offset="40%"  stop-color="#0d0d1a"/>
      <stop offset="100%" stop-color="#05050a"/>
    </linearGradient>
    <linearGradient id="hmc-lcd-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000308"/>
      <stop offset="100%" stop-color="#020914"/>
    </linearGradient>
    <radialGradient id="hmc-screen-bg" cx="45%" cy="38%" r="72%">
      <stop offset="0%"   stop-color="#00091a"/>
      <stop offset="100%" stop-color="#000408"/>
    </radialGradient>
    <clipPath id="hmc-screen-clip">
      <rect rx="9" ry="8" height="90" width="132" y="22" x="14"/>
    </clipPath>
    <style>
      ${HMC_IS_LOW_POWER ? '.hmc-roll{display:none}' : '.hmc-roll{animation:hmc-roll 8s linear infinite}'}
      ${HMC_IS_LOW_POWER ? '.hmc-flicker{opacity:0.985}' : '.hmc-flicker{animation:hmc-flick 0.14s infinite alternate}'}
      .hmc-cursor{animation:hmc-blink 1.05s step-end infinite}
      @keyframes hmc-roll{from{transform:translateY(-100px)}to{transform:translateY(100px)}}
      @keyframes hmc-flick{0%{opacity:0.97}100%{opacity:1.0}}
      @keyframes hmc-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
      ${HMC_IS_LOW_POWER ? '.hmc-arasaka-pulse{opacity:0.9}' : '.hmc-arasaka-pulse{animation:hmc-pulse 4s ease-in-out infinite}'}
      @keyframes hmc-pulse{0%,100%{opacity:0.82}50%{opacity:1}}
      #hmc-ch-flash{opacity:0;pointer-events:none}
      .hmc-ch-switching #hmc-ch-flash{animation:hmc-zap 0.28s ease-out forwards}
      @keyframes hmc-zap{0%{opacity:0.85}40%{opacity:0.6}100%{opacity:0}}
    </style>
  </defs>

  <!-- CHASSIS -->
  <rect height="155" width="160" y="0" x="0" fill="url(#hmc-chassis-bg)"/>
  <rect height="153" width="158" y="1" x="1" fill="none" stroke="#28283a" stroke-width="0.7" opacity="0.7"/>

  <!-- Bandes coque -->
  <line x1="0" y1="16" x2="160" y2="16" stroke="#08080d" stroke-width="1"/>
  <line x1="0" y1="16" x2="160" y2="16" stroke="#30304a" stroke-width="0.35" opacity="0.65"/>
  <line x1="0" y1="120" x2="160" y2="120" stroke="#08080d" stroke-width="1"/>
  <line x1="0" y1="120" x2="160" y2="120" stroke="#30304a" stroke-width="0.35" opacity="0.65"/>

  <!-- Vis -->
  <g fill="#0a0a0f" stroke="#3c3c52" stroke-width="0.35">
    <circle cx="8" cy="8" r="1.5"/> <path d="M7.2,8 h1.6 M8,7.2 v1.6" stroke="#1e1e2a" stroke-width="0.4"/>
    <circle cx="152" cy="8" r="1.5"/> <path d="M151.2,8 h1.6 M152,7.2 v1.6" stroke="#1e1e2a" stroke-width="0.4"/>
    <circle cx="8" cy="147" r="1.5"/> <path d="M7.2,147 h1.6 M8,146.2 v1.6" stroke="#1e1e2a" stroke-width="0.4"/>
    <circle cx="152" cy="147" r="1.5"/> <path d="M151.2,147 h1.6 M152,146.2 v1.6" stroke="#1e1e2a" stroke-width="0.4"/>
  </g>

  <!-- Sérigraphies -->
  <text x="16" y="13.5" font-family="Courier New,monospace" font-size="2.8" fill="#38384e" letter-spacing="0.2">ARASAKA tactical hardware // secure line</text>

  <!-- Grilles + diode -->
  <line x1="16" y1="142" x2="44" y2="142" stroke="#060609" stroke-width="1" stroke-dasharray="1,1"/>
  <line x1="116" y1="142" x2="144" y2="142" stroke="#060609" stroke-width="1" stroke-dasharray="1,1"/>
  <!-- highlight relief grilles (lumière rasante) -->
  <line x1="16" y1="142.4" x2="44" y2="142.4" stroke="#ffffff" stroke-width="0.3" stroke-dasharray="1,1" opacity="0.12"/>
  <line x1="116" y1="142.4" x2="144" y2="142.4" stroke="#ffffff" stroke-width="0.3" stroke-dasharray="1,1" opacity="0.12"/>
  <circle cx="56" cy="128" r="0.8" fill="#00ffcc" class="hmc-arasaka-pulse" style="filter:drop-shadow(0 0 1.5px #00ffcc)"/>
  <text x="44" y="128.8" font-family="Courier New,monospace" font-size="2.2" fill="#38384e">SYS.OK</text>
  <!-- Sérigraphies zone inférieure -->
  <text x="16" y="139.5" font-family="Courier New,monospace" font-size="1.8" fill="#29293a" opacity="0.8">VENTILATION PORT // DO NOT BLOCK</text>

  <!-- Boutons chaîne : ◄ CH▪ ► -->
  <g id="hmc-btn-prev" style="cursor:pointer">
    <rect x="14" y="122" width="14" height="8" rx="1.5" fill="url(#hmc-btn-grad)" stroke="#222235" stroke-width="0.5"/>
    <text x="21" y="127.8" font-family="Courier New,monospace" font-size="4.5" fill="rgba(0,200,255,0.6)" text-anchor="middle">◄</text>
  </g>
  <!-- Encoche LCD dédiée pour le label CH -->
  <g id="hmc-lcd-display">
    <rect x="62" y="121.5" width="36" height="9" rx="1" fill="url(#hmc-lcd-bg)"/>
    <rect x="62" y="121.5" width="36" height="9" rx="1" fill="none" stroke="rgba(0,160,210,0.25)" stroke-width="0.4"/>
    <text id="hmc-ch-label" x="80" y="127.8" font-family="Courier New,monospace" font-size="4.2" fill="rgba(0,220,255,0.85)" text-anchor="middle">CH 1</text>
  </g>
  <g id="hmc-btn-next" style="cursor:pointer">
    <rect x="132" y="122" width="14" height="8" rx="1.5" fill="url(#hmc-btn-grad)" stroke="#222235" stroke-width="0.5"/>
    <text x="139" y="127.8" font-family="Courier New,monospace" font-size="4.5" fill="rgba(0,200,255,0.6)" text-anchor="middle">►</text>
  </g>

  <!-- ECRAN -->
  <g clip-path="url(#hmc-screen-clip)">
    <rect rx="9" ry="8" height="90" width="132" y="22" x="14" fill="url(#hmc-screen-bg)"/>
    <!-- Burn-in neko fantôme — phosphore monochrome -->
    <g transform="translate(51,22) scale(0.096)" opacity="0.055">
      <path d="M17.67,265.525 C37.325,203.475 81.565,203.475 125.515,203.475 C169.425,203.475 186.035,215.925 186.035,255.035 C186.035,283.685 166.91,308.295 139.455,319.48 L181.905,399.86 C245.22,361.68 337.385,358.57 337.385,358.57 C337.385,358.57 433.835,361.855 497.115,402.605 C502.185,403.02 507.105,404.095 511.79,405.94 C556.09,423.38 568.1,499.985 541.205,581.615 C559.165,602.31 581.55,642.81 558.285,702.66 C523.1,793.66 508.275,777.26 499.485,806.58 C490.67,835.935 505.815,851.46 484.605,873.345 C470.835,887.44 441.305,891.56 413.325,890.065 C383.53,899.82 205.315,888.935 190.165,873.345 C168.845,851.46 184.015,835.935 175.225,806.58 C166.435,777.26 151.615,793.66 116.37,702.66 C93.785,644.335 114.405,604.42 132.105,583.27 C101.08,566.375 61.58,535.755 58.065,488.155 C53.85,431.255 40.315,369.115 43.39,329.6 C23.175,329.6 10.34,288.785 17.67,265.525" fill="#ffffff"/>
      <path d="M99.2,258.67 C99.2,258.67 104.945,39.35 145.34,19.42 C182.555,1.085 236.08,46.91 273.345,87.075 C295.14,80.835 318.08,77.405 341.81,77.405 C365.54,77.405 388.54,80.835 410.28,87.075 C447.545,46.91 501.07,1.085 538.305,19.42 C578.675,39.35 584.45,258.67 584.45,258.67 C584.27,258.705 591.745,296.165 591.745,315.45 C591.745,439.375 479.86,495.345 341.81,495.345 C203.79,495.345 91.85,439.375 91.85,315.45 C91.85,296.165 99.375,258.705 99.2,258.67" fill="#ffffff"/>
      <path d="M119.5,336.175 C119.5,375.2 151.145,406.82 190.165,406.82 C229.135,406.82 260.775,375.2 260.775,336.175 C260.775,297.155 229.135,265.525 190.165,265.525 C151.145,265.525 119.5,297.155 119.5,336.175" fill="#ffffff"/>
      <path d="M422.845,336.175 C422.845,375.2 454.485,406.82 493.51,406.82 C532.505,406.82 564.145,375.2 564.145,336.175 C564.145,297.155 532.505,265.525 493.51,265.525 C454.485,265.525 422.845,297.155 422.845,336.175" fill="#ffffff"/>
      <path d="M501.565,260.13 C501.565,287.06 479.71,308.98 452.73,308.98 C425.745,308.98 403.92,287.06 403.92,260.13 C403.92,233.15 425.745,211.285 452.73,211.285 C479.71,211.285 501.565,233.15 501.565,260.13" fill="#ffffff"/>
      <path d="M182.115,260.13 C182.115,287.06 203.965,308.98 230.895,308.98 C257.875,308.98 279.76,287.06 279.76,260.13 C279.76,233.15 257.875,211.285 230.895,211.285 C203.965,211.285 182.115,233.15 182.115,260.13" fill="#ffffff"/>
      <path d="M482.79,260.13 C482.79,276.745 469.31,290.19 452.73,290.19 C436.12,290.19 422.67,276.745 422.67,260.13 C422.67,243.485 436.12,230.075 452.73,230.075 C469.31,230.075 482.79,243.485 482.79,260.13" fill="#000008"/>
      <path d="M200.89,260.13 C200.89,276.745 214.335,290.19 230.895,290.19 C247.505,290.19 261.005,276.745 261.005,260.13 C261.005,243.485 247.505,230.075 230.895,230.075 C214.335,230.075 200.89,243.485 200.89,260.13" fill="#000008"/>
      <path d="M458.355,252.785 C458.355,258.9 453.435,263.825 447.37,263.825 C441.275,263.825 436.355,258.9 436.355,252.785 C436.355,246.755 441.275,241.795 447.37,241.795 C453.435,241.795 458.355,246.755 458.355,252.785" fill="#ffffff"/>
      <path d="M225.32,252.785 C225.32,258.9 230.19,263.825 236.31,263.825 C242.375,263.825 247.33,258.9 247.33,252.785 C247.33,246.755 242.375,241.795 236.31,241.795 C230.19,241.795 225.32,246.755 225.32,252.785" fill="#ffffff"/>
      <path d="M157.065,42.46 C160.845,41.02 165.03,40.265 169.425,40.265 C199.78,40.265 236.255,74.805 245.185,89.555 C242.11,94.67 158.295,113.475 134.04,168.02 C127.235,155.28 126.005,54.4 157.065,42.46" fill="#ffffff"/>
      <path d="M526.615,42.46 C522.78,41.02 518.62,40.265 514.225,40.265 C483.845,40.265 447.37,74.805 438.49,89.555 C441.54,94.67 525.325,113.475 549.645,168.02 C556.41,155.28 557.64,54.4 526.615,42.46" fill="#ffffff"/>
      <path d="M125.515,430.29 C125.515,457.095 158.03,560.365 337.24,560.365 C514.165,560.365 558.11,457.095 558.11,430.29 L558.11,411.46 C558.11,384.675 538.835,362.965 515.015,362.965 L168.635,362.965 C144.815,362.965 125.515,384.675 125.515,411.46 L125.515,430.29" fill="#ffffff"/>
      <path d="M324.725,319.72 C324.725,329.16 332.375,336.86 341.81,336.86 C351.27,336.86 358.95,329.16 358.95,319.72 C358.95,310.265 351.27,302.585 341.81,302.585 C332.375,302.585 324.725,310.265 324.725,319.72" fill="#ffffff"/>
      <path d="M336.415,319.72 L347.225,319.72 L347.225,376.655 L336.415,376.655 z" fill="#ffffff"/>
      <path d="M364.455,401.145 C358.95,401.145 353.465,400.075 348.72,397.175 C345.94,395.485 343.655,393.32 341.81,390.65 C339.965,393.32 337.68,395.485 334.92,397.175 C317.96,407.61 291.01,394.375 287.99,392.845 C285.385,391.475 284.33,388.255 285.65,385.585 C287.02,382.95 290.275,381.895 292.91,383.23 C299.59,386.64 319.225,394.13 329.295,387.96 C334.045,385.095 336.415,378.96 336.415,369.765 C336.415,366.81 338.825,364.405 341.81,364.405 C344.8,364.405 347.225,366.81 347.225,369.765 C347.225,378.96 349.6,385.095 354.345,387.96 C364.4,394.13 384,386.64 390.735,383.23 C393.405,381.895 396.625,382.95 397.975,385.585 C399.35,388.255 398.295,391.475 395.66,392.845 C393.46,393.935 378.815,401.145 364.455,401.145" fill="#ffffff"/>
      <path d="M125.515,208.89 C82.185,208.89 41.225,208.89 22.82,267.165 C18.34,281.35 22.295,303.9 31.47,316.435 C34.07,319.985 38.235,324.225 43.39,324.225 C48.75,330.04 46.905,353.645 55.78,420.465 C58.715,442.595 61.76,465.53 63.43,487.77 C66.77,532.54 104.035,561.825 134.655,578.525 C117.865,608.705 100.375,646.345 121.38,700.73 C142.88,756.185 156.625,771.075 165.765,780.92 C171.885,787.51 176.72,792.73 180.41,805.075 C184.135,817.64 183.84,827.73 183.52,836.64 C183.135,849.085 182.815,858.085 194.035,869.585 C202.505,878.375 293.47,888.375 364.715,888.375 C411.655,884.945 413.59,884.7 480.735,869.585 C491.9,858.085 491.575,849.105 491.195,836.64 C490.875,827.73 490.58,817.64 494.36,805.075 C497.995,792.73 502.885,787.51 508.95,780.92 C518.03,771.075 531.83,756.185 553.275,700.73 C574.78,645.29 556.355,607.3 537.105,585.15 C562.035,501.16 550.465,426.95 509.86,410.95 C432.925,367.655 338.12,364 337.155,363.965 C336.625,364 246.01,367.48 184.715,404.47 L134.655,322.005 C163.655,303.835 180.62,280.47 180.62,255.035 C180.62,219.65 167.755,208.89 125.515,208.89 z" fill="none" stroke="#ffffff" stroke-width="8"/>
      <path d="M314.48,576.1 L328.54,584.43 L345.68,582.845 L359.04,593.36 L375.56,593.71 L388.835,604.505 L405.68,603.905 L420.825,608.62 L433.835,620.395 L449.915,622.185 L465.885,624.44 L481.09,629.185 L478.275,637.83 L461.315,639.06 L446.755,632.525 L431.695,627.375 L417.485,619.465 L403.245,611.85 L386.81,611.1 L371.08,608.265 L354.785,607.125 L342.215,594.03 L327.135,589.055 L312.015,584.03 L297.25,581.58 L300.065,572.88 L314.48,576.1" fill="#ffffff"/>
      <path d="M402.075,653.62 L382.47,648.025 L361.905,645.92 L342.605,639.17 L323.005,633.58 L304.16,625.44 L284.295,621.45 L287.145,607.18 L307.27,614.455 L326.66,620.745 L346.875,624.12 L365.245,633.93 L384.935,639.27 L404.975,643.18 L402.545,656.165 L402.075,653.62" fill="#ffffff"/>
      <path d="M255.38,830.75 C255.38,830.75 262.27,843.9 260.92,858.245 C259.51,872.59 255.38,887.88 255.38,887.88 C255.38,887.88 251.16,872.59 249.79,858.245 C248.385,843.9 255.38,830.75 255.38,830.75" fill="#ffffff"/>
      <path d="M234.585,830.75 C234.585,830.75 241.53,843.9 240.12,858.245 C238.715,872.59 234.585,887.88 234.585,887.88 C234.585,887.88 230.42,872.59 229.015,858.245 C227.605,843.9 234.585,830.75 234.585,830.75" fill="#ffffff"/>
      <path d="M213.81,830.75 C213.81,830.75 220.75,843.9 219.345,858.245 C217.975,872.59 213.81,887.88 213.81,887.88 C213.81,887.88 209.59,872.59 208.22,858.245 C206.865,843.9 213.81,830.75 213.81,830.75" fill="#ffffff"/>
      <path d="M463.86,824.04 C463.86,824.04 470.835,837.24 469.43,851.58 C468.02,865.875 463.86,881.185 463.86,881.185 C463.86,881.185 459.73,865.875 458.325,851.58 C456.92,837.24 463.86,824.04 463.86,824.04" fill="#ffffff"/>
      <path d="M443.12,830.575 C443.12,830.575 450.065,843.745 448.655,858.085 C447.28,872.41 443.12,887.705 443.12,887.705 C443.12,887.705 438.93,872.41 437.525,858.085 C436.175,843.745 443.12,830.575 443.12,830.575" fill="#ffffff"/>
    </g>

    <!-- ═══ CH1 : terminal ═══ -->
    <g id="hmc-ch1" filter="url(#hmc-crt)">
      <text x="22" y="36" font-family="Courier New,monospace" font-size="5.5" fill="rgba(185,242,255,0.97)" letter-spacing="1">HEAT AGENT v2.0</text>
      <line x1="20" y1="39" x2="143" y2="39" stroke="rgba(0,200,255,0.2)" stroke-width="0.35"/>
      <text x="22" y="46" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">PHASE  <tspan id="hmc-phase" fill="rgba(200,248,255,1)" font-size="5">---</tspan></text>
      <text x="22" y="55" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">BIAS   <tspan id="hmc-bias" fill="rgba(160,238,255,1)" font-size="5">+0.00 C</tspan><tspan id="hmc-bias-src" fill="rgba(80,180,210,0.85)" font-size="3.8"> [--]</tspan></text>
      <text x="22" y="64" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">EXT    <tspan id="hmc-ext" fill="rgba(190,242,255,0.97)">--.- C</tspan><tspan id="hmc-mult" fill="rgba(80,180,210,0.85)" font-size="3.8"> x-.-</tspan></text>
      <text x="22" y="73" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">SALON  <tspan id="hmc-salon" fill="rgba(190,242,255,0.97)">--.- C</tspan></text>
      <text x="22" y="82" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">TARIF  <tspan id="hmc-tarif" fill="rgba(200,248,255,1)">---</tspan></text>
      <text x="22" y="91" font-family="Courier New,monospace" font-size="4.5" fill="rgba(80,190,230,0.95)">SOLAR  <tspan id="hmc-solar-w" fill="rgba(150,225,255,0.97)">---W</tspan><tspan id="hmc-solar-res" fill="rgba(80,180,210,0.85)" font-size="3.8"> ---</tspan></text>
    </g>
    <!-- Cursor hors du filtre CRT — évite invalidation cache feTurbulence à chaque blink -->
    <rect id="hmc-cursor-el" x="22" y="93" width="4" height="5" fill="rgba(185,242,255,0.9)" class="hmc-cursor"/>

    <!-- Note scroll déplacé en HTML hors SVG -->

    <!-- Flash canal -->
    <rect id="hmc-ch-flash" rx="9" ry="8" height="90" width="132" y="22" x="14" fill="white" filter="url(#hmc-flash)"/>

    <rect rx="9" ry="8" height="90" width="132" y="22" x="14" fill="url(#hmc-scanlines)"/>
    <rect x="14" y="-12" width="132" height="10" fill="rgba(0,200,255,0.035)" class="hmc-roll"/>
    <rect x="14" y="-12" width="132" height="2" fill="rgba(0,200,255,0.06)" class="hmc-roll"/>
    <rect rx="9" ry="8" height="90" width="132" y="22" x="14" fill="url(#hmc-vignette)"/>
    <rect rx="9" ry="8" height="90" width="132" y="22" x="14" fill="rgba(0,180,255,0.012)" class="hmc-flicker"/>
  </g>

  <!-- Bordures écran -->
  <rect rx="9.5" ry="8.5" height="92" width="134" y="21" x="13"
        fill="none" stroke="rgba(185,242,255,0.35)" stroke-width="0.9" filter="url(#hmc-glow-cy)"/>
  <rect rx="8.5" ry="7.5" height="88" width="130" y="23" x="15"
        fill="none" stroke="rgba(0,200,255,0.18)" stroke-width="0.5"/>

  <!-- Logo Arasaka -->
  <g class="hmc-arasaka-pulse" transform="translate(134,9) scale(0.058) translate(-240,-220)"
     style="filter:drop-shadow(0px 0px 1.2px rgba(255,26,26,0.9))">
    <path d="m 0,0 c -11.054,0 -22.288,-9.687 -22.288,-21.636 0,-11.949 9.979,-21.635 22.288,-21.635 h 10.143 v 7.033 L 6.332,-32.54 H 0 c 0,0 -11.232,1.232 -11.232,10.904 0,9.673 11.232,10.904 11.232,10.904 h 4.738 l 7.188,-6.978 v -25.561 h 11.055 v 30.006 L 9.317,0 Z" transform="matrix(1.3333333,0,0,-1.3333333,60.997333,306.5312)" fill="#ff1a1a"/>
    <path d="m 0,0 c -11.054,0 -22.288,-9.687 -22.288,-21.636 0,-11.949 9.979,-21.635 22.288,-21.635 h 10.143 v 7.033 L 6.332,-32.54 H 0 c 0,0 -11.232,1.232 -11.232,10.904 0,9.673 11.232,10.904 11.232,10.904 h 4.738 l 7.188,-6.978 v -25.561 h 11.055 v 30.006 L 9.317,0 Z" transform="matrix(1.3333333,0,0,-1.3333333,187.558,306.5312)" fill="#ff1a1a"/>
    <path d="m 0,0 h -9.317 c -11.054,0 -22.288,-9.687 -22.288,-21.636 0,-11.949 9.979,-21.635 22.288,-21.635 H 0.825 v 7.033 l -3.81,3.698 h -6.332 c 0,0 -11.233,1.232 -11.233,10.904 0,9.673 11.233,10.904 11.233,10.904 h 4.737 l 7.189,-6.978 v -25.561 h 11.055 v 30.006 z" transform="matrix(1.3333333,0,0,-1.3333333,430.50067,306.5312)" fill="#ff1a1a"/>
    <path d="m 0,0 c -11.054,0 -22.288,-9.687 -22.288,-21.636 0,-11.949 9.979,-21.635 22.288,-21.635 h 10.143 v 7.033 L 6.332,-32.54 H 0 c 0,0 -11.232,1.232 -11.232,10.904 0,9.673 11.232,10.904 11.232,10.904 h 4.738 l 7.188,-6.978 v -25.561 h 11.055 v 30.006 L 9.317,0 Z" transform="matrix(1.3333333,0,0,-1.3333333,312.2292,306.5312)" fill="#ff1a1a"/>
    <path d="m 0,0 h 21.333 c 3.803,0 3.536,-3.148 3.536,-3.148 v -4.309 h 11.055 v 7.578 c 0,0 0.622,10.934 -9.243,10.934 h -37.736 v -24.841 h 0.007 l 4.434,-2.971 h -4.441 v -7.488 H 0 v 3.055 L 16.638,-32.215 36.498,-32.217 0,-7.882 Z" transform="matrix(1.3333333,0,0,-1.3333333,109.17707,321.27147)" fill="#ff1a1a"/>
    <path d="M 0,0 -19.861,-0.001 -36.498,-11.027 V 0 h -11.055 v -24.841 h 0.007 l 4.434,-2.971 h -4.441 V -35.3 h 11.055 v 3.055 L -19.861,-43.271 0,-43.272 -32.45,-21.636 Z" transform="matrix(1.3333333,0,0,-1.3333333,407.61453,306.53053)" fill="#ff1a1a"/>
    <path d="m 0,0 -19.861,0.002 30.745,-20.5 H -4.695 c -3.803,0 -3.536,3.149 -3.536,3.149 v 4.308 h -11.055 v -7.577 c 0,0 -0.623,-10.935 9.243,-10.935 h 37.736 l -0.007,13.124 z" transform="matrix(1.3333333,0,0,-1.3333333,246.8568,322.15627)" fill="#ff1a1a"/>
    <path d="M 0,0 -9.864,7.779 H -23.177 V -3.85 L 0,-3.85 Z" transform="matrix(1.3333333,0,0,-1.3333333,277.79227,316.92907)" fill="#ff1a1a"/>
    <path d="m 0,0 c -31.518,0 -57.068,25.55 -57.068,57.068 0,31.518 25.55,57.068 57.068,57.068 31.518,0 57.068,-25.55 57.068,-57.068 C 57.068,25.55 31.518,0 0,0 m 0,123.328 c -36.594,0 -66.26,-29.665 -66.26,-66.26 0,-36.594 29.666,-66.26 66.26,-66.26 36.594,0 66.26,29.666 66.26,66.26 0,36.595 -29.666,66.26 -66.26,66.26" transform="matrix(1.3333333,0,0,-1.3333333,240,280.2096)" fill="#ff1a1a"/>
    <path d="m 0,0 c -11.492,0 -20.808,-9.316 -20.808,-20.808 0,-3.888 1.07,-7.526 2.926,-10.64 l -10.953,-10.953 v 30.08 c 9.016,2.282 15.687,10.447 15.687,20.171 0,11.492 -9.316,20.808 -20.808,20.808 -11.491,0 -20.807,-9.316 -20.807,-20.808 0,-9.724 6.671,-17.889 15.687,-20.171 v -30.123 l -10.969,10.969 c 1.866,3.12 2.942,6.767 2.942,10.667 0,11.492 -9.316,20.808 -20.808,20.808 -11.492,0 -20.808,-9.316 -20.808,-20.808 0,-11.492 9.316,-20.808 20.808,-20.808 3.877,0 7.505,1.064 10.612,2.911 l 18.223,-18.223 v -24.053 c 1.687,-0.15 3.394,-0.231 5.12,-0.231 1.727,0 3.434,0.081 5.121,0.231 v 24.097 l 18.195,18.195 c 3.114,-1.857 6.751,-2.927 10.64,-2.927 11.492,0 20.808,9.316 20.808,20.808 C 20.808,-9.316 11.492,0 0,0" transform="matrix(1.3333333,0,0,-1.3333333,285.27413,169.2656)" fill="#ff1a1a"/>
  </g>
</svg>`;

const HMC_CHANNELS = 3;

function _fcIcon(condition) {
  const map = {
    'sunny': 'mdi:weather-sunny', 'clear-night': 'mdi:weather-night',
    'partlycloudy': 'mdi:weather-partly-cloudy', 'cloudy': 'mdi:weather-cloudy',
    'fog': 'mdi:weather-fog', 'rainy': 'mdi:weather-rainy',
    'pouring': 'mdi:weather-pouring', 'snowy': 'mdi:weather-snowy',
    'snowy-rainy': 'mdi:weather-snowy-rainy', 'windy': 'mdi:weather-windy',
    'lightning': 'mdi:weather-lightning', 'lightning-rainy': 'mdi:weather-lightning-rainy',
  };
  return map[condition] || 'mdi:weather-cloudy';
}

class HeatMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._rendered  = false;
    this._rafId     = null;
    this._ro        = null;
    this._ac        = null;
    this._renderKey = null;
    this._channel   = 1;  // 1, 2 or 3
    this._lastSigKey = '';
    this._forecast  = [];
  }

  static getStubConfig() { return {}; }

  setConfig(c) {
    this._config = { ...c };
    if (this._hass && !this._rendered) this._render();
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    if (!this._rendered) { this._render(); return; }
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._update();
    });
  }

  async _fetchForecast() {
    if (!this._hass) return;
    try {
      const resp = await this._hass.callWS({
        type: 'weather/get_forecasts',
        entity_id: 'weather.forecast_maison',
        forecast_type: 'hourly',
      });
      this._forecast = resp?.forecast?.['weather.forecast_maison']?.forecast || [];
      // expire le cache après 30 min
      setTimeout(() => { this._forecast = []; }, 30 * 60 * 1000);
    } catch (_) {}
  }

  _renderForecast(fcEl) {
    if (!this._forecast.length) return;
    const slots = this._forecast.slice(0, 5);
    fcEl.innerHTML = slots.map(f => {
      const t = parseFloat(f.temperature ?? 0);
      const tStr = (t >= 0 ? '+' : '') + t.toFixed(0) + '°';
      const dt = new Date(f.datetime);
      const fh = String(dt.getHours()).padStart(2,'0') + 'h';
      const icon = _fcIcon(f.condition);
      return `<div class="ch3-fc-col">
        <span class="ch3-fc-h">${fh}</span>
        <ha-icon class="ch3-fc-icon" icon="${icon}"></ha-icon>
        <span class="ch3-fc-t">${tStr}</span>
      </div>`;
    }).join('');
  }

  _render() {
    const sr = this.shadowRoot;
    sr.innerHTML = `
      <style>
        :host {
          display: block;
          contain: layout style;
          border-radius: var(--ha-card-border-radius, 18px);
          overflow: hidden;
        }
        ha-card {
          contain: layout style paint;
          box-sizing: border-box;
          width: 100%;
          background: transparent;
          padding: 0; margin: 0;
          overflow: hidden;
          position: relative;
        }
        .svg-wrap { display: block; width: 100%; line-height: 0; }
        #hmc-ch2 {
          display: none;
          position: absolute;
          /* écran SVG : x=14 y=22 w=132 h=90 sur viewBox 160×155 */
          top: 14.2%; height: 47%;
          left: 8.75%; width: 82.5%;
          box-sizing: border-box;
          padding: 4px 3% 4px;
          border-radius: 5.6% / 7.3%;
          overflow: hidden;
          flex-direction: column;
          gap: 0;
          font-family: 'Courier New', monospace;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          container-type: inline-size;
        }
        #hmc-ch2.visible { display: flex; }
        .ch2-hdr {
          display: flex; align-items: baseline;
          border-bottom: 0.4px solid rgba(0,200,255,0.18);
          padding-bottom: 3px; margin-bottom: 4px; flex-shrink: 0;
          white-space: nowrap; overflow: hidden;
        }
        .ch2-mode {
          font-size: clamp(10px, 8cqi, 14px);
          letter-spacing: 1px;
          color: rgba(185,242,255,0.97);
          flex-shrink: 0;
        }
        .ch2-bstatus {
          font-size: clamp(9px, 6cqi, 13px);
          color: rgba(0,200,255,0.65);
          margin-left: auto; flex-shrink: 1;
          overflow: hidden; text-overflow: ellipsis;
          padding-left: 6px;
        }
        .ch2-sep {
          width: 100%; height: 0.4px;
          background: rgba(0,200,255,0.10);
          margin: 0; flex-shrink: 0;
        }
        .ch2-row {
          display: flex; align-items: center;
          flex: 1; justify-content: space-around;
          padding: 2px 0;
        }
        .ch2-item {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; flex: 1;
        }
        .ch2-item ha-icon {
          --mdc-icon-size: clamp(32px, 16cqi, 52px);
          color: rgba(60,90,120,0.4);
        }
        .ch2-item .lbl {
          font-size: clamp(8px, 4.5cqi, 11px);
          color: rgba(0,140,180,0.55);
          letter-spacing: 0.3px;
          line-height: 1;
          text-align: center;
        }
        .ch2-item.s-on ha-icon {
          color: rgba(0,255,160,1);
          filter:
            drop-shadow(0 0 3px rgba(0,255,160,0.95))
            drop-shadow(0 0 8px rgba(0,255,160,0.6))
            drop-shadow(0 0 16px rgba(0,255,160,0.25));
        }
        .ch2-item.s-warn ha-icon {
          color: rgba(255,160,40,1);
          filter:
            drop-shadow(0 0 3px rgba(255,160,40,0.95))
            drop-shadow(0 0 8px rgba(255,160,40,0.6))
            drop-shadow(0 0 16px rgba(255,160,40,0.25));
        }
        .ch2-item.s-alert ha-icon {
          color: rgba(255,60,60,1);
          filter:
            drop-shadow(0 0 3px rgba(255,60,60,0.95))
            drop-shadow(0 0 8px rgba(255,60,60,0.6))
            drop-shadow(0 0 16px rgba(255,60,60,0.25));
        }
        .ch2-item.s-on .lbl    { color: rgba(0,220,140,0.85); }
        .ch2-item.s-warn .lbl  { color: rgba(255,160,40,0.85); }
        .ch2-item.s-alert .lbl { color: rgba(255,80,80,0.85); }
        /* CH3 — terminal météo CRT */
        #hmc-ch3 {
          display: none;
          position: absolute;
          top: 14.2%; height: 47%;
          left: 8.75%; width: 82.5%;
          box-sizing: border-box;
          padding: 4px 3% 4px;
          border-radius: 5.6% / 7.3%;
          overflow: hidden;
          flex-direction: column;
          gap: 0;
          font-family: 'Courier New', monospace;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          container-type: inline-size;
        }
        #hmc-ch3.visible { display: flex; }
        /* Effets CRT sur CH2/CH3 — clippés par clip-path du parent */
        #hmc-ch2, #hmc-ch3 { isolation: isolate; }
        #hmc-ch2 > *, #hmc-ch3 > * { position: relative; z-index: 1; }
        #hmc-ch2::before, #hmc-ch3::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 1.8px,
            rgba(0,0,0,0.28) 1.8px, rgba(0,0,0,0.28) 2.5px
          );
        }
        #hmc-ch2::after, #hmc-ch3::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 3;
          background: radial-gradient(ellipse 90% 80% at 50% 50%,
            transparent 38%, rgba(0,0,0,0.65) 100%
          );
        }
        .ch3-hdr {
          display: flex; align-items: baseline;
          border-bottom: 0.4px solid rgba(0,200,255,0.18);
          padding-bottom: 3px; margin-bottom: 4px; flex-shrink: 0;
        }
        .ch3-title {
          font-size: clamp(10px, 8cqi, 14px);
          letter-spacing: 1px;
          color: rgba(185,242,255,0.97);
        }
        .ch3-sub {
          font-size: clamp(9px, 5cqi, 12px);
          color: rgba(0,200,255,0.55);
          margin-left: auto;
        }
        .ch3-row {
          display: flex; align-items: baseline;
          flex-shrink: 0;
          padding: 1px 0;
          gap: 0;
        }
        .ch3-lbl {
          font-size: clamp(8px, 4.5cqi, 11px);
          color: rgba(80,190,230,0.95);
          white-space: pre;
        }
        .ch3-val {
          font-size: clamp(9px, 5.5cqi, 12px);
          color: rgba(200,248,255,1);
          white-space: pre;
        }
        .ch3-unit {
          font-size: clamp(7px, 3.5cqi, 10px);
          color: rgba(80,180,210,0.85);
          white-space: pre;
        }
        .ch3-sep {
          width: 100%; height: 0.4px;
          background: rgba(0,200,255,0.10);
          margin: 3px 0; flex-shrink: 0;
        }
        .ch3-fc {
          display: flex; flex: 1; align-items: flex-end;
          gap: 0; justify-content: space-between;
          padding-top: 2px;
        }
        .ch3-fc-col {
          display: flex; flex-direction: column;
          align-items: center; flex: 1; gap: 1px;
        }
        .ch3-fc-h {
          font-size: clamp(7px, 3.5cqi, 9px);
          color: rgba(0,160,210,0.75);
        }
        .ch3-fc-t {
          font-size: clamp(9px, 5cqi, 12px);
          color: rgba(160,235,255,0.97);
        }
        .ch3-fc-icon {
          --mdc-icon-size: clamp(14px, 7cqi, 20px);
          color: rgba(80,180,230,0.7);
        }
        /* scroll note — HTML hors SVG, own compositing layer */
        #hmc-scroll-wrap {
          position: absolute;
          top: 61%; height: 5.5%;
          left: 8.75%; width: 82.5%;
          overflow: hidden;
          border-top: 0.5px solid rgba(0,200,255,0.12);
          display: flex; align-items: center;
          container-type: inline-size;
          transform: translateZ(0);
          isolation: isolate;
          contain: paint;
          backface-visibility: hidden;
        }
        #hmc-scroll-txt {
          white-space: nowrap;
          font-family: 'Courier New', monospace;
          font-size: clamp(9px, 4.5cqi, 13px);
          color: rgba(0,160,210,0.85);
          will-change: transform;
          animation: hmc-scroll-run var(--hmc-scroll-dur, 18s) linear infinite;
        }
        @keyframes hmc-scroll-run {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        ${HMC_IS_ANDROID ? `
        /* ── Android : boost contraste global ── */
        /* CH1 SVG : on ne peut pas cibler les tspan directement en CSS shadow DOM,
           mais on peut booster le groupe via feComponentTransfer déjà actif en LOW_POWER.
           On compense en augmentant la luminosité du scroll et CH2/CH3 labels. */

        /* CH2 — icônes et labels OFF plus lisibles */
        .ch2-item ha-icon {
          color: rgba(60,90,120,0.75);
        }
        .ch2-item .lbl {
          color: rgba(80,180,220,0.80);
        }
        /* Couleurs ON/WARN/ALERT inchangées — déjà très saturées */

        /* CH3 — labels plus lumineux */
        .ch3-lbl  { color: rgba(100,210,250,1); }
        .ch3-val  { color: rgba(220,252,255,1); }
        .ch3-unit { color: rgba(120,200,235,0.95); }
        .ch3-fc-h { color: rgba(40,195,240,0.95); }
        .ch3-fc-t { color: rgba(185,245,255,1); }
        .ch3-fc-icon { color: rgba(110,200,245,0.90); }
        .ch3-title { color: rgba(210,250,255,1); }
        .ch3-sub   { color: rgba(60,210,255,0.85); }

        /* CH2 header */
        .ch2-mode    { color: rgba(210,250,255,1); }
        .ch2-bstatus { color: rgba(60,210,255,0.85); }

        /* Scroll note */
        #hmc-scroll-txt { color: rgba(30,195,255,1); }

        ` : ''}
      </style>
      <ha-card>
        <div class="svg-wrap">${HMC_SVG}</div>
        <div id="hmc-scroll-wrap">
          <span id="hmc-scroll-txt">&gt; ...</span>
        </div>
        <div id="hmc-ch2">
          <div class="ch2-hdr">
            <span class="ch2-mode" id="hmc2-mode">---</span>
            <span class="ch2-bstatus" id="hmc2-bstatus">---</span>
          </div>
          <div class="ch2-row">
            <div class="ch2-item s-off" id="hmc2-t-comp">
              <ha-icon icon="mdi:engine"></ha-icon>
              <span class="lbl">Compresseur</span>
            </div>
            <div class="ch2-item s-off" id="hmc2-t-boost">
              <ha-icon icon="mdi:radiator"></ha-icon>
              <span class="lbl">Booster</span>
            </div>
            <div class="ch2-item s-off" id="hmc2-t-pac">
              <ha-icon icon="mdi:heat-pump"></ha-icon>
              <span class="lbl">PAC</span>
            </div>
          </div>
          <div class="ch2-sep"></div>
          <div class="ch2-row">
            <div class="ch2-item s-off" id="hmc2-t-defrost">
              <ha-icon icon="mdi:snowflake-alert"></ha-icon>
              <span class="lbl">Defrost</span>
            </div>
            <div class="ch2-item s-off" id="hmc2-t-gel">
              <ha-icon icon="mdi:snowflake-thermometer"></ha-icon>
              <span class="lbl">Gel</span>
            </div>
            <div class="ch2-item s-off" id="hmc2-t-humid">
              <ha-icon icon="mdi:water-percent-alert"></ha-icon>
              <span class="lbl">Hum. Basse</span>
            </div>
          </div>
        </div>
        <div id="hmc-ch3">
          <div class="ch3-hdr">
            <span class="ch3-title">METEO &amp; TENDANCE</span>
            <span class="ch3-sub" id="hmc3-upd">--:--</span>
          </div>
          <div class="ch3-row">
            <span class="ch3-lbl">MIN 12H  </span>
            <span class="ch3-val" id="hmc3-min12">---</span>
            <span class="ch3-unit"> C</span>
          </div>
          <div class="ch3-row">
            <span class="ch3-lbl">SALON dT </span>
            <span class="ch3-val" id="hmc3-trend">---</span>
            <span class="ch3-unit" id="hmc3-trend-u"> C/h</span>
          </div>
          <div class="ch3-row">
            <span class="ch3-lbl">EXT ACT  </span>
            <span class="ch3-val" id="hmc3-ext">---</span>
            <span class="ch3-unit"> C</span>
          </div>
          <div class="ch3-sep"></div>
          <div class="ch3-fc" id="hmc3-fc">
            <!-- rempli dynamiquement -->
          </div>
        </div>
      </ha-card>`;

    this._rendered = true;
    this._bindButtons();

    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(() => {
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
          this._rafId = 0;
          this._renderKey = null;
          this._update();
        });
      });
      this._ro.observe(sr.querySelector('ha-card'));
    }

    if (this._hass) this._update();
  }

  _bindButtons() {
    const sr = this.shadowRoot;
    const prev = sr.getElementById('hmc-btn-prev');
    const next = sr.getElementById('hmc-btn-next');
    // AbortController évite les doubles listeners sur reconnect (tab switch)
    if (this._ac) this._ac.abort();
    this._ac = new AbortController();
    const sig = { signal: this._ac.signal };
    if (prev) prev.addEventListener('click', () => this._switchChannel(-1), sig);
    if (next) next.addEventListener('click', () => this._switchChannel(+1), sig);
  }

  _switchChannel(dir) {
    this._channel = ((this._channel - 1 + dir + HMC_CHANNELS) % HMC_CHANNELS) + 1;
    this._triggerFlash();
    this._renderKey = null;
    this._update();
  }

  _triggerFlash() {
    const sr = this.shadowRoot;
    const svg = sr.querySelector('svg');
    const flash = sr.getElementById('hmc-ch-flash');
    if (!svg || !flash) return;
    // reset animation
    svg.classList.remove('hmc-ch-switching');
    void flash.getBoundingClientRect(); // reflow
    svg.classList.add('hmc-ch-switching');
    setTimeout(() => svg.classList.remove('hmc-ch-switching'), 350);
  }

  _makeKey() {
    if (!this._hass) return '';
    const h = this._hass.states;
    const p = h['sensor.ecodan_planned_bias'];
    const n = h['input_text.heat_agent_last_note'];
    const bias = h['number.ecodan_heatpump_auto_adaptive_setpoint_bias'];
    const _s = id => { const e = h[id]; return e ? e.state : ''; };
    return [
      p ? p.state : '',
      p ? (p.attributes.phase || '') : '',
      p ? (p.attributes.tariff || '') : '',
      n ? n.state : '',
      bias ? bias.state : '',
      _s('sensor.ecodan_heatpump_operation_mode'),
      _s('binary_sensor.ecodan_heatpump_compressor'),
      _s('binary_sensor.ecodan_heatpump_booster_heater'),
      _s('binary_sensor.defrost_likely_soon'),
      _s('binary_sensor.freeze_risk_expected'),
      _s('binary_sensor.low_humidity_alert'),
      _s('sensor.heat_pump_bias_status'),
      p ? (p.attributes.meteo_min_12h ?? '') : '',
      p ? (p.attributes.salon_trend_2h ?? '') : '',
      this._channel,
    ].join('|');
  }

  // Auto-switch to CH1 only when phase or tariff changes (meaningful events)
  _checkAutoSwitch(planned) {
    if (!planned) return;
    const sigKey = (planned.attributes.phase || '') + '|' + (planned.attributes.tariff || '');
    if (this._lastSigKey && this._lastSigKey !== sigKey && this._channel !== 1) {
      this._channel = 1;
      this._triggerFlash();
    }
    this._lastSigKey = sigKey;
  }

  _setScrollDuration(text) {
    const el = this.shadowRoot.getElementById('hmc-scroll-txt');
    if (!el) return;
    const dur = Math.max(8, Math.round(text.length * 0.45 + 8));
    el.style.setProperty('--hmc-scroll-dur', dur + 's');
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = '';
  }

  _update() {
    if (!this._hass || !this._rendered) return;

    const sr = this.shadowRoot;
    const planned = this._hass.states['sensor.ecodan_planned_bias'];
    const noteEnt = this._hass.states['input_text.heat_agent_last_note'];
    const biasEnt = this._hass.states['number.ecodan_heatpump_auto_adaptive_setpoint_bias'];

    this._checkAutoSwitch(planned);

    // fullKey inclut channel — recalculé après _checkAutoSwitch
    const dataKey = [
      planned ? planned.state : '',
      planned ? (planned.attributes.phase || '') : '',
      planned ? (planned.attributes.tariff || '') : '',
      noteEnt ? noteEnt.state : '',
      biasEnt ? biasEnt.state : '',
    ].join('|');
    const fullKey = dataKey + '|' + this._channel;
    if (fullKey === this._renderKey) return;
    this._renderKey = fullKey;

    const _t = (id) => sr.getElementById(id);

    // CH label
    const chLabel = _t('hmc-ch-label');
    if (chLabel) chLabel.textContent = 'CH ' + this._channel;

    // Show/hide channels
    const ch1 = _t('hmc-ch1');
    const ch2 = _t('hmc-ch2');
    const ch3 = _t('hmc-ch3');
    if (ch1) ch1.setAttribute('display', this._channel === 1 ? '' : 'none');
    const cur = sr.getElementById('hmc-cursor-el');
    if (cur) cur.setAttribute('display', this._channel === 1 ? '' : 'none');
    if (ch2) { ch2.classList.toggle('visible', this._channel === 2); }
    if (ch3) { ch3.classList.toggle('visible', this._channel === 3); }

    if (!planned) {
      const sc = _t('hmc-scroll-txt');
      if (sc) sc.textContent = '> sensor indisponible';
      return;
    }

    const attrs = planned.attributes;

    // Shared computed values
    // plannedVal = décision finale (plan déterministe, potentiellement ajusté LLM)
    // biasApplied = ce qui est réellement sur la PAC (peut diverger si modif manuelle)
    const plannedVal  = parseFloat(planned.state);
    const biasApplied = biasEnt ? parseFloat(biasEnt.state) : null;
    const biasDisp    = plannedVal;   // affiche toujours le plan courant
    const biasSign    = biasDisp >= 0 ? '+' : '';
    // [llm] si la note est préfixée [llm] par heat_agent, sinon [plan]
    const noteState   = this._hass.states['input_text.heat_agent_last_note']?.state || '';
    const isLlm       = noteState.startsWith('[llm]');
    const biasSrc     = isLlm ? 'llm' : 'plan';
    const ext        = parseFloat(attrs.temp_ext ?? 7);
    const mult       = parseFloat(attrs.temp_mult ?? 1);
    const salon      = parseFloat(attrs.temp_salon ?? 0);
    const solar      = parseFloat(attrs.surplus_solaire ?? 0);
    const solRes     = attrs.solar_resolution || 'none';
    const phase      = attrs.phase || planned.state || '---';
    const tariff     = (attrs.tariff || '').toUpperCase();
    const isHC       = tariff === 'HC';

    // ── CH1 updates ──
    if (this._channel === 1) {
      const phaseEl = _t('hmc-phase');
      if (phaseEl) phaseEl.textContent = phase;

      const biasEl = _t('hmc-bias');
      if (biasEl) biasEl.textContent = biasSign + biasDisp.toFixed(2) + ' C';

      const biasSrcEl = _t('hmc-bias-src');
      if (biasSrcEl) biasSrcEl.textContent = ' [' + biasSrc + ']';

      const extEl = _t('hmc-ext');
      if (extEl) extEl.textContent = (ext >= 0 ? '+' : '') + ext.toFixed(1) + ' C';

      const mulEl = _t('hmc-mult');
      if (mulEl) mulEl.textContent = ' x' + mult.toFixed(1);

      const salonEl = _t('hmc-salon');
      if (salonEl) salonEl.textContent = salon.toFixed(1) + ' C';

      const tarifEl = _t('hmc-tarif');
      if (tarifEl) {
        if (isHC) {
          tarifEl.textContent = 'HEURES CREUSES';
          tarifEl.setAttribute('fill', 'rgba(0,255,160,1)');
        } else {
          tarifEl.textContent = 'HEURES PLEINES';
          tarifEl.setAttribute('fill', 'rgba(255,160,60,1)');
        }
      }

      const solarWEl = _t('hmc-solar-w');
      if (solarWEl) solarWEl.textContent = Math.round(solar) + 'W';
      const solarREl = _t('hmc-solar-res');
      if (solarREl) solarREl.textContent = ' ' + solRes;
    }

    // ── CH2 updates (ha-icon tiles) ──
    if (this._channel === 2) {
      const hs = this._hass.states;
      const _on = id => { const s = hs[id]; return s && s.state === 'on'; };

      const modeEl = _t('hmc2-mode');
      if (modeEl) modeEl.textContent = (hs['sensor.ecodan_heatpump_operation_mode']?.state || '---').toUpperCase();
      const bsEl = _t('hmc2-bstatus');
      if (bsEl) bsEl.textContent = hs['sensor.heat_pump_bias_status']?.state || '---';

      const tiles = [
        ['hmc2-t-comp',   'binary_sensor.ecodan_heatpump_compressor',    's-on'],
        ['hmc2-t-boost',  'binary_sensor.ecodan_heatpump_booster_heater', 's-warn'],
        ['hmc2-t-defrost','binary_sensor.defrost_likely_soon',             's-on'],
        ['hmc2-t-gel',    'binary_sensor.freeze_risk_expected',            's-alert'],
        ['hmc2-t-humid',  'binary_sensor.low_humidity_alert',              's-warn'],
      ];
      for (const [tid, eid, clsOn] of tiles) {
        const tile = _t(tid);
        if (tile) tile.className = 'ch2-item ' + (_on(eid) ? clsOn : 's-off');
      }
      const pacTile = _t('hmc2-t-pac');
      if (pacTile) {
        const mode = hs['sensor.ecodan_heatpump_operation_mode']?.state || 'Off';
        pacTile.className = 'ch2-item ' + (mode !== 'Off' ? 's-on' : 's-off');
      }
    }

    // ── CH3 updates (météo & tendance) ──
    if (this._channel === 3) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      const updEl = _t('hmc3-upd');
      if (updEl) updEl.textContent = hh + ':' + mm;

      const min12 = attrs.meteo_min_12h;
      const min12El = _t('hmc3-min12');
      if (min12El) {
        if (min12 !== null && min12 !== undefined && min12 !== 'none') {
          const v = parseFloat(min12);
          min12El.textContent = (v >= 0 ? '+' : '') + v.toFixed(1);
          min12El.style.color = v <= 0 ? 'rgba(100,180,255,1)' : v <= 5 ? 'rgba(160,235,255,1)' : 'rgba(200,248,255,1)';
        } else {
          min12El.textContent = '---';
        }
      }

      const trend = attrs.salon_trend_2h;
      const trendEl = _t('hmc3-trend');
      const trendUEl = _t('hmc3-trend-u');
      if (trendEl) {
        if (trend !== null && trend !== undefined && trend !== 'none') {
          const t = parseFloat(trend);
          const arrow = t > 0.05 ? ' ▲' : t < -0.05 ? ' ▼' : ' ─';
          trendEl.textContent = (t >= 0 ? '+' : '') + t.toFixed(2) + arrow;
          trendEl.style.color = t > 0.1 ? 'rgba(0,255,160,1)' : t < -0.1 ? 'rgba(255,100,80,1)' : 'rgba(200,248,255,1)';
        } else {
          trendEl.textContent = '---';
        }
      }

      const extEl3 = _t('hmc3-ext');
      if (extEl3) extEl3.textContent = (ext >= 0 ? '+' : '') + ext.toFixed(1);

      // Prévisions horaires — chargées via WS si pas encore en cache
      const fcEl = _t('hmc3-fc');
      if (fcEl) {
        if (this._forecast.length) {
          this._renderForecast(fcEl);
        } else {
          this._fetchForecast().then(() => this._renderForecast(fcEl));
        }
      }
    }

    // ── Note scroll (toujours visible) ──
    const noteEl = _t('hmc-scroll-txt');
    if (noteEl) {
      const note = noteEnt ? noteEnt.state : '';
      const txt = note ? ('> ' + note) : '> ...';
      if (noteEl.textContent !== txt) {
        noteEl.textContent = txt;
        this._setScrollDuration(txt);
      }
    }
  }

  _cleanup() {
    if (this._ac)    { this._ac.abort();                  this._ac = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ro)    { this._ro.disconnect();             this._ro = null; }
  }

  connectedCallback() {
    const card = this.shadowRoot?.querySelector('ha-card');
    if (card && this._rendered) {
      this._bindButtons();
      if (window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver(() => {
          if (this._rafId) return;
          this._rafId = requestAnimationFrame(() => {
            this._rafId = 0;
            this._renderKey = null;
            this._update();
          });
        });
        this._ro.observe(card);
      }
      if (this._hass) this._update();
    }
  }

  disconnectedCallback() { this._cleanup(); }

  getCardSize() { return 4; }
}

customElements.define('heat-monitor-card', HeatMonitorCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'heat-monitor-card',
  name: 'Heat Monitor Card',
  description: 'CRT terminal CB2077 — Heat Agent status',
});
