/* ── heat-monitor-card v2.2.0 ──
   v2.2.0 : éditeur UI (getConfigElement) — Silverhand on/off + fréquence, image du chat,
            flou/halo CRT, police + URL. Re-render intelligent (focus préservé), n'écrit
            que les surcharges (YAML minimal). Options appliquées à chaud (cat_image,
            silverhand) sans re-render complet ; listener Silverhand rendu idempotent.
   v2.1.0 : easter-egg « Johnny Silverhand » sur le chat GIF — aléatoirement (≈12% par
            traversée), le chat se matérialise en hologramme glitché RGB-split (3 calques
            rouge/cyan en mix-blend:screen + clip-path qui saute + scanlines) au milieu
            de l'écran avant de reprendre sa marche. Opt-out via silverhand:false ;
            proba réglable silverhand_chance ; respecte prefers-reduced-motion.
   v2.0.2 : fix liseré au changement de canal — contain:paint + translateZ sur les
            canaux : le glow flou ne bave plus hors du cadre après display:none→flex
            (artefact WebKit/iPad de re-rastérisation du clip sur couche filtrée).
   v2.0.1 : fix overlays — ancrage sur .svg-wrap (et non ha-card) pour éviter
            le décalage haut du cadre quand le thème/card-mod ajoute du padding
            ou quand les icônes de prévision recalculent la hauteur après chargement.
   v2.0.0 : refonte écran unifié
     - CH1 passe en overlay HTML (ex-texte SVG) → texte fluide iPad/Android paysage
     - rendu phosphore CRT reconstruit en CSS (.hmc-crt-fx : blur + glow cyan)
     - flou / glow / police pilotables en YAML (crt_blur, crt_glow, font, font_url)
     - framework canaux : HMC_CHANNELS_META → ajouter CH4/CH5 = 1 entrée + 1 template + 1 _updateChN
     - zone sous l'écran refaite en HTML (variante B) : LCD nommé + glyphe chat, points scalables,
       chat GIF qui marche sur la grille de ventilation (cat_image configurable)
     - cadrage en-tête / corps / pied (scroll = footer)
   v1.21 : centralisation entités (HMC_CFG), _update éclaté, grille CH3, fix _isOn CH3
*/
/* ── heat-monitor-card v1.20 (historique) ── */
const HMC_IS_IPAD    = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const HMC_IS_ANDROID = /Android/.test(navigator.userAgent);
const HMC_IS_LOW_POWER = HMC_IS_IPAD || HMC_IS_ANDROID || /iPhone/.test(navigator.userAgent);

// Cadence de tirage de l'easter-egg Silverhand (ms) — la proba s'applique à chaque tick.
const HMC_SH_TICK = 9000;

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

  <!-- Zone bezel inférieure : contrôles rendus en HTML (overlay .hmc-bezel) -->

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

    <!-- CH1 + CH2 + CH3 : contenu rendu en overlay HTML (.hmc-screen) -->

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

// Glyphe tête de chat pixel (path fourni) — utilisé comme marqueur LCD
const HMC_CAT_GLYPH = 'M53.9993 0H108L108 54.0443H162.001V107.978H216L216.007 54.0443H270V0H324.001V54.0443V108.045V161.978L324 216H378V270H324H270.007H216.007V216L270 216.022L270.007 161.978H216L216.007 216L162 216.022L162.001 161.978H108V216.022H162L162.001 270H108H53.9993H0V216L53.9993 216.022V161.978V107.978V54.0003V0Z';

// ── Canaux : ajouter une entrée ici + un template body + un _updateChN suffit ──
// (le n° de canal, le nom LCD/en-tête et les points indicateurs en découlent)
const HMC_CHANNELS_META = [
  { name: 'HEAT AGENT' },
  { name: 'ÉTAT PAC' },
  { name: 'MÉTÉO & TENDANCE' },
];
const HMC_CHANNELS = HMC_CHANNELS_META.length;

// ── Valeurs CRT par défaut (surchargées par le YAML) ──
const HMC_THEME = {
  crt_blur:  0.35,                       // flou phosphore (px)
  crt_glow:  5,                          // halo cyan (px)
  font:      "'Courier New', monospace", // police terminal
  font_url:  null,                       // ex: Google Fonts pour Rajdhani
  cat_image: '/local/cat-walking-white.gif',
  walk_dur:          34,                 // s : durée d'un cycle de marche (grand = balade rare)
  silverhand:        true,               // easter-egg : glitch hologramme Silverhand sur le chat
  silverhand_chance: 0.08,               // proba par tick — "de temps à autre" (0..1)
  silverhand_tick:   9,                  // s : cadence de tirage de l'effet
};


// ════════════════════════════════════════════════════════════════
//  CONFIG — point unique de vérité pour les entités.
//  Pour adapter la card : modifier UNIQUEMENT ce bloc.
// ════════════════════════════════════════════════════════════════
const HMC_CFG = {
  // Capteurs principaux (CH1 + clés de rendu)
  planned:    'sensor.ecodan_planned_bias',
  note:       'input_text.heat_agent_last_note',
  bias:       'number.ecodan_heatpump_auto_adaptive_setpoint_bias',
  mode:       'sensor.ecodan_heatpump_operation_mode',
  biasStatus: 'sensor.heat_pump_bias_status',
  weather:    'weather.forecast_maison',

  // CH2 — tuiles binaires : id DOM, entité, classe quand "on"
  ch2Tiles: [
    { id: 'hmc2-t-comp',    entity: 'binary_sensor.ecodan_heatpump_compressor',    on: 's-on'    },
    { id: 'hmc2-t-boost',   entity: 'binary_sensor.ecodan_heatpump_booster_heater', on: 's-warn'  },
    { id: 'hmc2-t-defrost', entity: 'binary_sensor.defrost_likely_soon',            on: 's-on'    },
    { id: 'hmc2-t-gel',     entity: 'binary_sensor.freeze_risk_expected',           on: 's-alert' },
    { id: 'hmc2-t-humid',   entity: 'binary_sensor.low_humidity_alert',             on: 's-warn'  },
  ],

  // CH3 — conditions solaires : libellés descriptifs (texte long, aligné à droite)
  ch3Solar: [
    { id: 'hmc3-sol-afternoon', entity: 'binary_sensor.high_afternoon_solar_expected', on: 'PM ENSOLEILLÉ',  off: 'PM mitigé'   },
    { id: 'hmc3-sol-goodday',   entity: 'binary_sensor.good_solar_day_expected',        on: 'JOUR FAVORABLE', off: 'jour mitigé' },
    { id: 'hmc3-sol-cloudy',    entity: 'binary_sensor.poor_solar_conditions_expected', on: 'CIEL COUVERT',   off: 'ciel dégagé' },
  ],
};

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
    this._shTimers  = new Set();  // timers ponctuels de l'effet Silverhand (cleanup)
    this._shBusy    = false;      // un glitch est-il en cours ?
    this._shTick    = null;       // setInterval de tirage Silverhand
  }

  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement('heat-monitor-card-editor'); }

  setConfig(c) {
    // Fusionne les valeurs CRT par défaut avec la config YAML
    this._config = { ...HMC_THEME, ...(c || {}) };
    this._injectFont();
    if (this._rendered) {
      this._applyTheme();
      // Applique à chaud les options modifiées via l'éditeur (sans re-render complet) :
      const cat = this._el('hmc-cat');
      if (cat) {
        const src = this._config.cat_image || HMC_THEME.cat_image;
        if (cat.getAttribute('src') !== src) cat.setAttribute('src', src);
      }
      this._initSilverhand();   // ré-arme/retire le listener selon silverhand on/off
    }
    if (this._hass && !this._rendered) this._render();
  }

  // Applique flou / glow / police via custom properties (surchargeables par UI)
  _applyTheme() {
    const c = this._config || HMC_THEME;
    this.style.setProperty('--hmc-blur', (c.crt_blur ?? HMC_THEME.crt_blur) + 'px');
    this.style.setProperty('--hmc-glow', (c.crt_glow ?? HMC_THEME.crt_glow) + 'px');
    this.style.setProperty('--hmc-font', c.font || HMC_THEME.font);
  }

  // Injection unique d'une police externe (ex: Rajdhani) dans le <head>, avec garde
  _injectFont() {
    const url = this._config?.font_url;
    if (!url) return;
    const key = 'hmc-font-' + btoa(url).slice(0, 12);
    if (document.getElementById(key)) return;
    const link = document.createElement('link');
    link.id = key; link.rel = 'stylesheet'; link.href = url;
    document.head.appendChild(link);
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
        entity_id: HMC_CFG.weather,
        forecast_type: 'hourly',
      });
      this._forecast = resp?.forecast?.[HMC_CFG.weather]?.forecast || [];
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
        .svg-wrap { display: block; width: 100%; position: relative; }
        .svg-wrap > svg { display: block; width: 100%; height: auto; }

        /* ── Pilotage CRT (surchargé par YAML via custom properties) ── */
        :host { --hmc-blur: 0.35px; --hmc-glow: 5px; --hmc-font: 'Courier New', monospace; }
        .hmc-crt-fx {
          filter: blur(var(--hmc-blur, 0.35px));
          text-shadow: 0 0 1px currentColor, 0 0 var(--hmc-glow, 5px) rgba(0,255,249,0.35);
        }
        @keyframes hmc-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }

        /* ── CH1 : terminal Heat Agent (overlay HTML, ex-texte SVG) ── */
        #hmc-ch1 {
          display: none; position: absolute;
          top: 14.2%; height: 47%; left: 8.75%; width: 82.5%;
          box-sizing: border-box; padding: 4px 3% 4px;
          border-radius: 5.6% / 7.3%; overflow: hidden;
          flex-direction: column; gap: 0; isolation: isolate;
          font-family: var(--hmc-font, 'Courier New', monospace);
          -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility; container-type: inline-size;
        }
        #hmc-ch1.visible { display: flex; }
        #hmc-ch1 > * { position: relative; z-index: 1; }
        #hmc-ch1::before { content:''; position:absolute; inset:0; pointer-events:none; z-index:2;
          background: repeating-linear-gradient(to bottom, transparent 0 1.8px, rgba(0,0,0,0.28) 1.8px 2.5px); }
        #hmc-ch1::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:3;
          background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 38%, rgba(0,0,0,0.65) 100%); }
        .ch1-hdr { display:flex; align-items:baseline; border-bottom:0.4px solid rgba(0,200,255,0.18);
          padding-bottom:3px; margin-bottom:4px; flex-shrink:0; }
        .ch1-title { font-size: clamp(12px, 8cqi, 16px); letter-spacing:1px; color: rgba(185,242,255,0.97); }
        .ch1-sub { font-size: clamp(9px, 5cqi, 12px); color: rgba(0,200,255,0.55); margin-left:auto; }
        .ch1-grid { display:grid; grid-template-columns:max-content 1fr; column-gap:8px; row-gap:2px; align-items:baseline; }
        .ch1-lbl { font-size: clamp(10px, 6cqi, 14px); color: rgba(80,190,230,0.95); white-space:nowrap; }
        .ch1-val { font-size: clamp(11px, 7cqi, 15px); color: rgba(200,248,255,1); text-align:right;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ch1-val small { font-size: clamp(8px, 4.5cqi, 11px); color: rgba(80,180,210,0.85); }
        .ch1-cursor { display:inline-block; width:0.55em; height:1em; background: rgba(185,242,255,0.9);
          vertical-align:-2px; margin-top:3px; animation: hmc-blink 1.05s step-end infinite; }

        /* ── Bezel HTML (sous l'écran) — remplace les contrôles SVG, scalable ── */
        #hmc-bezel {
          position: absolute; left: 6%; right: 6%; top: 74%; bottom: 3%; z-index: 4;
          display: flex; flex-direction: column; justify-content: space-between;
          container-type: inline-size; font-family: var(--hmc-font, 'Courier New', monospace);
        }
        .hmc-ctrl { display:flex; align-items:center; gap: 3cqi; }
        .hmc-btn {
          flex: 0 0 auto; width: clamp(34px, 13cqi, 50px); height: clamp(20px, 8cqi, 30px);
          display:grid; place-items:center; cursor:pointer; border-radius:5px;
          background: linear-gradient(180deg,#1b1b3a,#0d0d1a 40%,#05050a);
          border: 0.5px solid #222235; color: rgba(0,200,255,0.6);
          font-size: clamp(13px, 6cqi, 18px); transition: .15s;
        }
        .hmc-btn:hover { color:#00fff9; border-color: rgba(0,255,249,0.4); box-shadow:0 0 10px rgba(0,255,249,0.25); }
        .hmc-lcd {
          flex:1; min-width:0; height: clamp(20px, 8cqi, 30px);
          display:flex; align-items:center; justify-content:center; gap: 2cqi; padding:0 2.5cqi;
          border-radius:4px; background: linear-gradient(180deg,#000308,#020914);
          border:0.5px solid rgba(0,160,210,0.25); white-space:nowrap; overflow:hidden;
        }
        .hmc-lcd .cat-glyph { width: clamp(14px,5cqi,20px); height: clamp(10px,3.6cqi,15px); color:#00fff9;
          filter: drop-shadow(0 0 4px rgba(0,255,249,0.5)); flex:0 0 auto; }
        .hmc-lcd .num { color:#00fff9; font-size: clamp(11px,5.5cqi,15px); letter-spacing:1px; text-shadow:0 0 6px rgba(0,255,249,0.6); }
        .hmc-lcd .nm { color: rgba(0,200,255,0.7); font-size: clamp(9px,4.5cqi,13px); letter-spacing:0.5px; overflow:hidden; text-overflow:ellipsis; }
        .hmc-dots { display:flex; gap: 2cqi; align-items:center; justify-content:center; }
        .hmc-dot { width: clamp(5px,1.8cqi,8px); height: clamp(5px,1.8cqi,8px); border-radius:50%;
          background: rgba(0,200,255,0.18); border:0.5px solid rgba(0,200,255,0.3); cursor:pointer; transition:.2s; }
        .hmc-dot.on { background:#00fff9; border-color:#00fff9; box-shadow:0 0 8px #00fff9; }
        .hmc-vent { position:relative; height: clamp(22px, 11cqi, 44px); overflow:hidden;
          border-top:0.5px dashed rgba(0,200,255,0.18); border-bottom:0.5px dashed rgba(0,200,255,0.12);
          background: repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.25) 6px 7px); }
        .hmc-vent .vl { position:absolute; left:6px; top:3px; font-size: clamp(7px,2.6cqi,9px); color:#2f4a55; letter-spacing:0.4px; }
        .hmc-vent .sys { position:absolute; right:6px; top:3px; font-size: clamp(7px,2.6cqi,9px); color:#38384e; display:flex; align-items:center; gap:4px; }
        .hmc-vent .di { width:5px; height:5px; border-radius:50%; background:#00ffcc; box-shadow:0 0 6px #00ffcc; }
        .hmc-cat { position:absolute; bottom:-2px; height: clamp(24px,12cqi,46px); image-rendering:pixelated;
          animation: hmc-walk var(--hmc-walk-dur, 34s) linear infinite;
          filter: drop-shadow(0 0 5px rgba(0,255,249,0.25)); }
        /* Balade plus rare : traversée sur ~35% du cycle, puis longue pause hors-champ. */
        @keyframes hmc-walk {
          0%   { left:-16%; }
          35%  { left:100%; }
          100% { left:100%; }
        }

        /* ── Easter-egg : glitch hologramme « Johnny Silverhand » sur le chat ──
           Transposition de la recette SVG (RGB-split 3 calques) sur le GIF rasterisé :
           on clone l'image en 3 couches teintées (rouge / cyan) en mix-blend:screen,
           qui se décalent par à-coups → aberration chromatique. Calque principal :
           jitter + clip-path qui saute. Scanlines holographiques balayées. */
        /* Pendant le glitch, l'animation de marche (hmc-walk) est remplacée par
           hmc-sh-main ; la position figée est portée par cat.style.left (JS). */
        .hmc-cat.sh-active.sh-main { animation: hmc-sh-main 1.6s steps(1) forwards; }
        .hmc-cat-ghost {
          position:absolute; bottom:-2px; height: clamp(24px,12cqi,46px);
          image-rendering:pixelated; pointer-events:none;
          mix-blend-mode: screen; will-change: transform, opacity;
        }
        .hmc-cat-ghost.rd { filter: brightness(1.15) sepia(1) hue-rotate(-55deg) saturate(12);
          animation: hmc-sh-rd 1.6s steps(2) forwards; }
        .hmc-cat-ghost.cy { filter: brightness(1.1) sepia(1) hue-rotate(150deg) saturate(12);
          animation: hmc-sh-cy 1.6s steps(2) forwards; }
        .hmc-cat-ghost.gn { filter: brightness(1.15) sepia(1) hue-rotate(75deg) saturate(12);
          animation: hmc-sh-gn 1.6s steps(2) forwards; }
        .hmc-cat-scan {
          position:absolute; bottom:-2px; height: clamp(24px,12cqi,46px); pointer-events:none;
          mix-blend-mode: overlay; opacity:0;
          background: repeating-linear-gradient(0deg,
            rgba(0,255,249,0.0) 0px, rgba(0,255,249,0.18) 1px, rgba(0,255,249,0.0) 3px);
          animation: hmc-sh-scan 1.6s linear forwards;
        }
        @keyframes hmc-sh-main {
          0%   { opacity:.2; clip-path: inset(0 0 0 0); transform: translateX(0); }
          8%   { opacity:.9; clip-path: inset(40% 0 30% 0); transform: translateX(-2px); }
          16%  { opacity:.5; clip-path: inset(0 0 0 0); transform: translateX(1px); }
          26%  { opacity:.95; clip-path: inset(0 0 60% 0); transform: translateX(0); }
          40%  { opacity:.85; clip-path: inset(0 0 0 0); }
          70%  { opacity:.9;  clip-path: inset(0 0 0 0); }
          80%  { opacity:.7;  clip-path: inset(55% 0 0 0); }
          90%  { opacity:.35; clip-path: inset(0 0 0 0); }
          100% { opacity:1;   clip-path: inset(0 0 0 0); transform: translateX(0); }
        }
        @keyframes hmc-sh-rd {
          0%,100% { opacity:0; transform: translateX(0); }
          10%  { opacity:.8; transform: translateX(-6px) translateY(1px); }
          26%  { opacity:.6; transform: translateX(5px); }
          50%  { opacity:.7; transform: translateX(-3px); }
          80%  { opacity:.4; transform: translateX(4px); }
          92%  { opacity:.2; transform: translateX(0); }
        }
        @keyframes hmc-sh-cy {
          0%,100% { opacity:0; transform: translateX(0); }
          10%  { opacity:.8; transform: translateX(6px) translateY(-1px); }
          26%  { opacity:.6; transform: translateX(-5px); }
          50%  { opacity:.7; transform: translateX(3px); }
          80%  { opacity:.4; transform: translateX(-4px); }
          92%  { opacity:.2; transform: translateX(0); }
        }
        @keyframes hmc-sh-gn {
          0%,100% { opacity:0; transform: translateX(0); }
          10%  { opacity:.6; transform: translateX(-3px) translateY(1px); }
          26%  { opacity:.5; transform: translateX(4px); }
          50%  { opacity:.55; transform: translateX(-2px); }
          80%  { opacity:.3; transform: translateX(3px); }
          92%  { opacity:.15; transform: translateX(0); }
        }
        @keyframes hmc-sh-scan {
          0%   { opacity:0;   background-position-y:0; }
          12%  { opacity:.9; }
          85%  { opacity:.6; }
          100% { opacity:0;   background-position-y:-24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hmc-cat.sh-active, .hmc-cat-ghost, .hmc-cat-scan { animation: none !important; }
          .hmc-cat.sh-active { animation-play-state: running; }
        }

        /* ── Flash changement de canal (overlay HTML au-dessus du contenu) ── */
        #hmc-flash-html {
          position:absolute; top:14.2%; height:47%; left:8.75%; width:82.5%;
          border-radius:5.6% / 7.3%; background:#bdf6ff; opacity:0; pointer-events:none; z-index:6;
        }
        #hmc-flash-html.go { animation: hmc-zap 0.3s ease-out; }
        @keyframes hmc-zap { 0% { opacity:0.5; } 100% { opacity:0; } }

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
        /* Conteneur de peinture stable : empêche le glow flou de baver hors du cadre
           après un toggle display:none→flex (artefact WebKit/iPad au changement de canal) */
        #hmc-ch1, #hmc-ch2, #hmc-ch3 {
          isolation: isolate;
          contain: paint;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
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
          font-size: clamp(12px, 8cqi, 16px);
          letter-spacing: 1px;
          color: rgba(185,242,255,0.97);
        }
        .ch3-sub {
          font-size: clamp(10px, 6cqi, 14px);
          color: rgba(0,200,255,0.55);
          margin-left: auto;
        }
        /* Grille 2 colonnes : libellé à gauche, valeur calée à droite (pleine largeur) */
        .ch3-grid {
          display: grid;
          grid-template-columns: max-content 1fr;
          column-gap: 8px;
          row-gap: 2px;
          align-items: baseline;
          flex-shrink: 0;
        }
        .ch3-lbl {
          font-size: clamp(10px, 6cqi, 14px);
          color: rgba(80,190,230,0.95);
          white-space: nowrap;
        }
        .ch3-val {
          font-size: clamp(11px, 7cqi, 15px);
          color: rgba(200,248,255,1);
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ch3-unit {
          font-size: clamp(9px, 5cqi, 12px);
          color: rgba(80,180,210,0.85);
        }
        /* États (conditions solaires) : texte descriptif, légèrement plus compact */
        .ch3-state {
          font-size: clamp(10px, 6cqi, 13px);
          letter-spacing: 0.3px;
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
        /* police pilotable (YAML) sur tous les canaux */
        #hmc-ch2, #hmc-ch3, #hmc-scroll-txt { font-family: var(--hmc-font, 'Courier New', monospace); }
      </style>
      <ha-card>
        <div class="svg-wrap">${HMC_SVG}
        <div id="hmc-scroll-wrap">
          <span id="hmc-scroll-txt">&gt; ...</span>
        </div>
        <div id="hmc-ch1">
          <div class="hmc-crt-fx" style="display:flex; flex-direction:column; height:100%">
            <div class="ch1-hdr">
              <span class="ch1-title">HEAT AGENT</span>
              <span class="ch1-sub" id="hmc1-sub">---</span>
            </div>
            <div class="ch1-grid">
              <span class="ch1-lbl">PHASE</span><span class="ch1-val" id="hmc-phase">---</span>
              <span class="ch1-lbl">BIAS</span><span class="ch1-val"><span id="hmc-bias">+0.00 C</span> <small id="hmc-bias-src">[--]</small></span>
              <span class="ch1-lbl">EXT</span><span class="ch1-val"><span id="hmc-ext">--.- C</span> <small id="hmc-mult">x-.-</small></span>
              <span class="ch1-lbl">SALON</span><span class="ch1-val" id="hmc-salon">--.- C</span>
              <span class="ch1-lbl">TARIF</span><span class="ch1-val" id="hmc-tarif">---</span>
              <span class="ch1-lbl">SOLAR</span><span class="ch1-val"><span id="hmc-solar-w">---W</span> <small id="hmc-solar-res">---</small></span>
            </div>
            <div><span class="ch1-cursor"></span></div>
          </div>
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
          <div class="hmc-crt-fx" style="display:flex; flex-direction:column; height:100%">
          <div class="ch3-hdr">
            <span class="ch3-title">METEO &amp; TENDANCE</span>
            <span class="ch3-sub" id="hmc3-upd">--:--</span>
          </div>
          <div class="ch3-grid">
            <span class="ch3-lbl">MIN 12H</span>
            <span class="ch3-val"><span id="hmc3-min12">---</span><span class="ch3-unit"> °C</span></span>

            <span class="ch3-lbl">SALON dT</span>
            <span class="ch3-val"><span id="hmc3-trend">---</span><span class="ch3-unit"> °C/h</span></span>

            <span class="ch3-lbl">EXT ACT</span>
            <span class="ch3-val"><span id="hmc3-ext">---</span><span class="ch3-unit"> °C</span></span>
          </div>
          <div class="ch3-sep"></div>
          <div class="ch3-grid">
            <span class="ch3-lbl">SOLEIL PM</span>
            <span class="ch3-val ch3-state" id="hmc3-sol-afternoon">---</span>

            <span class="ch3-lbl">JOURNÉE</span>
            <span class="ch3-val ch3-state" id="hmc3-sol-goodday">---</span>

            <span class="ch3-lbl">CIEL</span>
            <span class="ch3-val ch3-state" id="hmc3-sol-cloudy">---</span>
          </div>
          <div class="ch3-sep"></div>
          <div class="ch3-fc" id="hmc3-fc">
            <!-- rempli dynamiquement -->
          </div>
          </div>
        </div>
        <div id="hmc-bezel">
          <div class="hmc-ctrl">
            <div class="hmc-btn" id="hmc-btn-prev">◄</div>
            <div class="hmc-lcd">
              <svg class="cat-glyph" viewBox="0 0 378 270" aria-hidden="true"><path d="${HMC_CAT_GLYPH}" fill="currentColor"/></svg>
              <span class="num" id="hmc-lcd-num">CH 1</span>
              <span class="nm" id="hmc-lcd-nm">· HEAT AGENT</span>
            </div>
            <div class="hmc-btn" id="hmc-btn-next">►</div>
          </div>
          <div class="hmc-dots" id="hmc-dots">
            ${HMC_CHANNELS_META.map((_, k) => `<div class="hmc-dot" data-ch="${k + 1}"></div>`).join('')}
          </div>
          <div class="hmc-vent">
            <span class="vl">VENTILATION PORT // DO NOT BLOCK</span>
            <span class="sys"><span class="di"></span>SYS.OK</span>
            <img class="hmc-cat" id="hmc-cat" alt="" src="${(this._config && this._config.cat_image) || HMC_THEME.cat_image}" style="--hmc-walk-dur:${(this._config && this._config.walk_dur) || HMC_THEME.walk_dur}s">
          </div>
        </div>
        <div id="hmc-flash-html"></div>
        </div>
      </ha-card>`;

    this._rendered = true;
    this._applyTheme();
    this._bindButtons();
    this._initSilverhand();

    if (window.ResizeObserver) {
      if (this._ro) this._ro.disconnect();   // défense : ne jamais empiler un observer si _render est rappelé
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
    // Accès direct par les points indicateurs
    sr.querySelectorAll('#hmc-dots .hmc-dot').forEach(d =>
      d.addEventListener('click', () => this._setChannel(+d.dataset.ch), sig));
  }

  _switchChannel(dir) {
    this._channel = ((this._channel - 1 + dir + HMC_CHANNELS) % HMC_CHANNELS) + 1;
    this._triggerFlash();
    this._renderKey = null;
    this._update();
  }

  _setChannel(n) {
    if (!Number.isFinite(n) || n < 1 || n > HMC_CHANNELS || n === this._channel) return;
    this._channel = n;
    this._triggerFlash();
    this._renderKey = null;
    this._update();
  }

  // ── Easter-egg « Johnny Silverhand » ──
  // Timer interne : à intervalle régulier (HMC_SH_TICK), tirage au sort selon
  // silverhand_chance. S'il tombe, le chat se fige à une position aléatoire de
  // l'écran et se matérialise en hologramme glitché RGB-split, puis reprend sa marche.
  // (Ancienne approche via 'animationiteration' abandonnée : ne se déclenchait
  //  qu'en fin de cycle 12s ET là où le chat était — souvent hors champ.)
  _initSilverhand() {
    const cat = this._el('hmc-cat');
    if (!cat) return;
    // Idempotent : un seul timer à la fois (setConfig peut rappeler cette méthode).
    if (this._shTick) { clearInterval(this._shTick); this._shTick = null; }
    const cfg0 = this._config || HMC_THEME;
    const tickMs = (Number(cfg0.silverhand_tick ?? HMC_THEME.silverhand_tick) || 9) * 1000;
    this._shTick = setInterval(() => {
      const cfg = this._config || HMC_THEME;
      if (cfg.silverhand === false) return;
      if (this._shBusy) return;
      if (!this.isConnected) return;
      const chance = Number(cfg.silverhand_chance ?? HMC_THEME.silverhand_chance) || 0;
      if (Math.random() < chance) this._spawnSilverhand();
    }, tickMs);
  }

  _spawnSilverhand() {
    const cat  = this._el('hmc-cat');
    const vent = this.shadowRoot.querySelector('.hmc-vent');
    if (!cat || !vent || this._shBusy) return;
    this._shBusy = true;

    const src = cat.getAttribute('src') || (this._config && this._config.cat_image) || HMC_THEME.cat_image;
    // Position aléatoire dans la zone visible à chaque apparition (≈8 %–74 %) → varie
    // les emplacements pour ne pas lasser, tout en évitant les bords (chat hors cadre)
    // et le coin droit occupé par « SYS.OK ».
    const left = (8 + Math.random() * 66).toFixed(1) + '%';

    // 2 calques fantômes (rouge / cyan) + scanlines, clones du GIF, posés au même endroit.
    const mk = cls => {
      const g = document.createElement('img');
      g.className = 'hmc-cat-ghost ' + cls;
      g.alt = ''; g.src = src; g.style.left = left;
      return g;
    };
    const rd = mk('rd');
    const cy = mk('cy');
    const gn = mk('gn');
    const scan = document.createElement('div');
    scan.className = 'hmc-cat-scan';
    scan.style.left  = left;
    scan.style.width = (cat.offsetWidth || 30) + 'px';

    cat.style.left = left;            // téléporte + fige (sh-active remplace hmc-walk)
    cat.classList.add('sh-active', 'sh-main');
    vent.appendChild(rd);
    vent.appendChild(cy);
    vent.appendChild(gn);
    vent.appendChild(scan);

    // Fin de vie : à la fin de l'anim du calque principal, on nettoie et relance la marche.
    const done = () => {
      rd.remove(); cy.remove(); gn.remove(); scan.remove();
      cat.classList.remove('sh-active', 'sh-main');
      cat.style.left = '';            // rend la main à hmc-walk
      this._shBusy = false;
    };
    cat.addEventListener('animationend', function onEnd(ev) {
      if (ev.animationName !== 'hmc-sh-main') return;
      cat.removeEventListener('animationend', onEnd);
      done();
    }, this._ac ? { signal: this._ac.signal } : undefined);

    // Filet de sécurité si animationend ne se déclenche pas (onglet en arrière-plan…).
    const t = setTimeout(() => { this._shTimers.delete(t); done(); }, 2200);
    this._shTimers.add(t);
  }

  _triggerFlash() {
    const f = this._el('hmc-flash-html');
    if (!f) return;
    f.classList.remove('go');
    void f.offsetWidth; // reflow
    f.classList.add('go');
    setTimeout(() => f.classList.remove('go'), 350);
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

  // ── Helpers DOM / état ──
  _el(id)  { return this.shadowRoot.getElementById(id); }
  _setText(id, txt) { const el = this._el(id); if (el) el.textContent = txt; }
  _isOn(id) { const s = this._hass.states[id]; return !!s && s.state === 'on'; }

  _update() {
    if (!this._hass || !this._rendered) return;

    const hs      = this._hass.states;
    const planned = hs[HMC_CFG.planned];
    const noteEnt = hs[HMC_CFG.note];
    const biasEnt = hs[HMC_CFG.bias];

    this._checkAutoSwitch(planned);

    // Clé de rendu (inclut le canal) — court-circuite les re-rendus identiques
    const fullKey = [
      planned ? planned.state : '',
      planned ? (planned.attributes.phase || '') : '',
      planned ? (planned.attributes.tariff || '') : '',
      noteEnt ? noteEnt.state : '',
      biasEnt ? biasEnt.state : '',
      this._channel,
    ].join('|');
    if (fullKey === this._renderKey) return;
    this._renderKey = fullKey;

    // LCD (n° + nom) + points indicateurs + visibilité des canaux
    const meta = HMC_CHANNELS_META[this._channel - 1];
    this._setText('hmc-lcd-num', 'CH ' + this._channel);
    this._setText('hmc-lcd-nm', '· ' + (meta ? meta.name : ''));
    this.shadowRoot.querySelectorAll('#hmc-dots .hmc-dot')
      .forEach((d, k) => d.classList.toggle('on', k === this._channel - 1));
    for (let n = 1; n <= HMC_CHANNELS; n++) {
      const el = this._el('hmc-ch' + n);
      if (el) el.classList.toggle('visible', this._channel === n);
    }

    if (!planned) {
      this._setText('hmc-scroll-txt', '> sensor indisponible');
      return;
    }

    // Contexte partagé entre canaux
    const attrs     = planned.attributes;
    const noteState = noteEnt?.state || '';
    const ctx = {
      hs, attrs,
      plannedVal: parseFloat(planned.state),          // plan courant (déterministe ± LLM)
      biasSrc:    noteState.startsWith('[llm]') ? 'llm' : 'plan',
      ext:    parseFloat(attrs.temp_ext ?? 7),
      mult:   parseFloat(attrs.temp_mult ?? 1),
      salon:  parseFloat(attrs.temp_salon ?? 0),
      solar:  parseFloat(attrs.surplus_solaire ?? 0),
      solRes: attrs.solar_resolution || 'none',
      phase:  attrs.phase || planned.state || '---',
      isHC:   (attrs.tariff || '').toUpperCase() === 'HC',
    };

    if      (this._channel === 1) this._updateCh1(ctx);
    else if (this._channel === 2) this._updateCh2(ctx);
    else if (this._channel === 3) this._updateCh3(ctx);

    // Note défilante (toujours visible)
    this._updateScroll(noteEnt);
  }

  _updateScroll(noteEnt) {
    const el = this._el('hmc-scroll-txt');
    if (!el) return;
    const note = noteEnt ? noteEnt.state : '';
    const txt  = note ? ('> ' + note) : '> ...';
    if (el.textContent !== txt) {
      el.textContent = txt;
      this._setScrollDuration(txt);
    }
  }

  // ── CH1 : terminal Heat Agent (overlay HTML) ──
  _updateCh1(ctx) {
    const { plannedVal, biasSrc, ext, mult, salon, solar, solRes, phase, isHC } = ctx;
    const sign = plannedVal >= 0 ? '+' : '';

    this._setText('hmc1-sub',      isHC ? 'HC' : 'HP');
    this._setText('hmc-phase',     phase);
    this._setText('hmc-bias',      sign + plannedVal.toFixed(2) + ' C');
    this._setText('hmc-bias-src',  '[' + biasSrc + ']');
    this._setText('hmc-ext',       (ext >= 0 ? '+' : '') + ext.toFixed(1) + ' C');
    this._setText('hmc-mult',      'x' + mult.toFixed(1));
    this._setText('hmc-salon',     salon.toFixed(1) + ' C');
    this._setText('hmc-solar-w',   Math.round(solar) + 'W');
    this._setText('hmc-solar-res', solRes);

    const tarifEl = this._el('hmc-tarif');
    if (tarifEl) {
      tarifEl.textContent = isHC ? 'HEURES CREUSES' : 'HEURES PLEINES';
      tarifEl.style.color = isHC ? 'rgba(0,255,160,1)' : 'rgba(255,160,60,1)';
    }
  }

  // ── CH2 : tuiles d'état PAC (ha-icon) ──
  _updateCh2(ctx) {
    const { hs } = ctx;
    const mode = hs[HMC_CFG.mode]?.state || '---';

    this._setText('hmc2-mode',    mode.toUpperCase());
    this._setText('hmc2-bstatus', hs[HMC_CFG.biasStatus]?.state || '---');

    for (const t of HMC_CFG.ch2Tiles) {
      const tile = this._el(t.id);
      if (tile) tile.className = 'ch2-item ' + (this._isOn(t.entity) ? t.on : 's-off');
    }
    const pacTile = this._el('hmc2-t-pac');
    if (pacTile) pacTile.className = 'ch2-item ' + (mode !== 'Off' && mode !== '---' ? 's-on' : 's-off');
  }

  // ── CH3 : météo & tendance ──
  _updateCh3(ctx) {
    const { attrs, ext } = ctx;
    const now = new Date();
    this._setText('hmc3-upd',
      String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0'));

    // MIN 12H — teinte selon le niveau de froid attendu
    const min12El = this._el('hmc3-min12');
    if (min12El) {
      const raw = attrs.meteo_min_12h;
      if (raw != null && raw !== 'none') {
        const v = parseFloat(raw);
        min12El.textContent = (v >= 0 ? '+' : '') + v.toFixed(1);
        min12El.style.color = v <= 0 ? 'rgba(100,180,255,1)'
                            : v <= 5 ? 'rgba(160,235,255,1)'
                                     : 'rgba(200,248,255,1)';
      } else {
        min12El.textContent = '---';
      }
    }

    // SALON dT — tendance 2h avec flèche directionnelle
    const trendEl = this._el('hmc3-trend');
    if (trendEl) {
      const raw = attrs.salon_trend_2h;
      if (raw != null && raw !== 'none') {
        const t = parseFloat(raw);
        const arrow = t > 0.05 ? ' ▲' : t < -0.05 ? ' ▼' : ' ─';
        trendEl.textContent = (t >= 0 ? '+' : '') + t.toFixed(2) + arrow;
        trendEl.style.color = t > 0.1  ? 'rgba(0,255,160,1)'
                            : t < -0.1 ? 'rgba(255,100,80,1)'
                                       : 'rgba(200,248,255,1)';
      } else {
        trendEl.textContent = '---';
      }
    }

    this._setText('hmc3-ext', (ext >= 0 ? '+' : '') + ext.toFixed(1));

    // Prévisions horaires — chargées via WS si pas encore en cache (30 min)
    const fcEl = this._el('hmc3-fc');
    if (fcEl) {
      if (this._forecast.length) this._renderForecast(fcEl);
      else this._fetchForecast().then(() => this._renderForecast(fcEl));
    }

    // Conditions solaires — libellés descriptifs alignés à droite
    for (const s of HMC_CFG.ch3Solar) {
      const el = this._el(s.id);
      if (!el) continue;
      const on = this._isOn(s.entity);
      el.textContent  = on ? s.on : s.off;
      el.style.color  = on ? 'rgba(255,210,40,1)' : 'rgba(80,130,160,0.55)';
    }
  }

  _cleanup() {
    if (this._ac)    { this._ac.abort();                  this._ac = null; }
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._ro)    { this._ro.disconnect();             this._ro = null; }
    if (this._shTick) { clearInterval(this._shTick); this._shTick = null; }
    this._shTimers.forEach(t => clearTimeout(t)); this._shTimers.clear();
    this._shBusy = false;
  }

  connectedCallback() {
    const card = this.shadowRoot?.querySelector('ha-card');
    if (card && this._rendered) {
      this._bindButtons();
      this._initSilverhand();
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

// ─── Éditeur UI ─────────────────────────────────────────────────────────────
// Re-render intelligent (focus préservé en frappe, écho config-changed ignoré).
// N'émet QUE les clés qui diffèrent des défauts HMC_THEME → YAML propre.
class HeatMonitorCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this._built = false;
    this._lastEmitted = null;
    this._lastSeen    = null;
  }

  setConfig(c) {
    this._config = { ...(c || {}) };
    if (!this._built) { this._render(); this._lastSeen = this._hash(this._config); return; }
    const h = this._hash(this._config);
    if (h === this._lastEmitted) { this._lastSeen = h; return; }   // écho de notre _dispatch
    if (h === this._lastSeen) return;                              // déjà affiché
    if (this._isEditing()) { this._lastSeen = h; return; }         // ne pas voler le focus
    this._render();
    this._lastSeen = h;
  }

  set hass(h) { this._hass = h; if (!this._built) this._render(); }
  disconnectedCallback() { this.innerHTML = ''; this._built = false; }

  _hash(o) { try { return JSON.stringify(o); } catch { return String(Math.random()); } }
  _isEditing() {
    const a = this.querySelector(':focus') || document.activeElement;
    if (!a || !this.contains(a)) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
  }

  _render() {
    this._built = true;
    this.innerHTML = '';
    this.style.cssText = 'display:block;padding:16px;font-family:var(--primary-font-family,Roboto,sans-serif);';

    const style = document.createElement('style');
    style.textContent = `
      .sec { font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px; }
      .row { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px; }
      .row label { font-size:13px;color:var(--primary-text-color);flex:1; }
      input[type=text],input[type=number] { font-size:12px;padding:5px 8px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);outline:none;min-width:150px; }
      input[type=number] { min-width:90px; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 8px; }
    `;
    this.appendChild(style);

    const c = this._config;
    const d = HMC_THEME;

    // ── Easter-egg Silverhand
    this._sec('Easter-egg « Silverhand »');
    this._hint('Le chat se matérialise aléatoirement en hologramme glitché avant de reprendre sa marche.');
    this._toggle('silverhand', 'Activer l\'effet', c.silverhand ?? d.silverhand);
    this._numRow('silverhand_chance', 'Fréquence (proba/tirage)', c.silverhand_chance ?? d.silverhand_chance, '0', '1', '0.01', String(d.silverhand_chance));
    this._numRow('silverhand_tick', 'Cadence de tirage (s)', c.silverhand_tick ?? d.silverhand_tick, '2', '60', '1', String(d.silverhand_tick));

    // ── Chat
    this._sec('Chat');
    this._textRow('cat_image', 'Image (GIF)', c.cat_image ?? '', d.cat_image);
    this._numRow('walk_dur', 'Rareté de la balade (s/cycle)', c.walk_dur ?? d.walk_dur, '8', '120', '1', String(d.walk_dur));
    this._hint('Grand = le chat passe rarement (longue pause hors-champ entre deux traversées).');

    // ── Écran CRT
    this._sec('Écran CRT');
    this._numRow('crt_blur', 'Flou phosphore (px)', c.crt_blur ?? d.crt_blur, '0', '4', '0.05', String(d.crt_blur));
    this._numRow('crt_glow', 'Halo cyan (px)',      c.crt_glow ?? d.crt_glow, '0', '20', '0.5', String(d.crt_glow));

    // ── Police
    this._sec('Police');
    this._textRow('font',     'Police',            c.font ?? '',     d.font);
    this._textRow('font_url', 'URL police (CSS)',  c.font_url ?? '', 'https://fonts.googleapis.com/...');
  }

  _sec(t)  { const e = document.createElement('div'); e.className = 'sec'; e.textContent = t; this.appendChild(e); }
  _hint(t) { const e = document.createElement('div'); e.className = 'hint'; e.textContent = t; this.appendChild(e); }

  _textRow(key, label, value, placeholder = '') {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const inp = document.createElement('input'); inp.type = 'text'; inp.value = value; inp.placeholder = placeholder;
    inp.addEventListener('change', e => this._set(key, e.target.value || undefined));
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _numRow(key, label, value, min, max, step, placeholder = '') {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const inp = document.createElement('input');
    inp.type = 'number'; inp.value = value; inp.placeholder = placeholder;
    if (min  !== undefined) inp.min  = min;
    if (max  !== undefined) inp.max  = max;
    if (step !== undefined) inp.step = step;
    inp.addEventListener('change', e => {
      const v = e.target.value;
      this._set(key, v === '' ? undefined : parseFloat(v));
    });
    row.appendChild(lbl); row.appendChild(inp); this.appendChild(row);
  }

  _toggle(key, label, checked) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label'); lbl.textContent = label;
    const cb  = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!checked;
    cb.style.cssText = 'width:36px;height:20px;cursor:pointer;accent-color:var(--primary-color,#00fff9);flex-shrink:0;';
    cb.addEventListener('change', e => this._set(key, e.target.checked));
    row.appendChild(lbl); row.appendChild(cb); this.appendChild(row);
  }

  // Pose une clé ; supprime celle qui revient à la valeur par défaut → YAML minimal.
  _set(key, value) {
    const def = HMC_THEME[key];
    if (value === undefined || value === '' || value === def) delete this._config[key];
    else this._config[key] = value;
    this._dispatch();
  }

  _dispatch() {
    const config = { ...this._config };
    this._lastEmitted = this._hash(config);
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
  }
}

customElements.define('heat-monitor-card-editor', HeatMonitorCardEditor);
customElements.define('heat-monitor-card', HeatMonitorCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'heat-monitor-card',
  name: 'Heat Monitor Card',
  description: 'CRT terminal CB2077 — Heat Agent status',
  preview: true,
});
