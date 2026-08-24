/* ── neon-climate-card-webgl v1.4 ──────────────────────────────────────────────
 * Variante WEBGL de neon-climate-card : le souffle sous la grille n'est plus une
 * animation 2D scriptée mais un vrai fluide (Navier-Stokes stable, lignée Stam /
 * PavelDoGreat) rendu par shaders. Chaque fente de la grille est un jet à part
 * entière ; la vorticité, la dissipation et le débit de teinte sont réglables.
 *
 * La card SOUS-CLASSE la prod (`neon-climate-card`) : tout le DOM, les services
 * et l'éditeur viennent d'elle. Cette variante n'ajoute qu'une feuille de style
 * posée par-dessus + quelques éléments injectés. La prod n'est pas modifiée, et
 * les deux cards cohabitent sur le même dashboard.
 *
 * Habillage propre à cette variante :
 *   · lattes en CREUX (dégradé + lèvre claire) et vraie inclinaison par swing_mode
 *   · pilule cible supprimée de la ligne du haut → la cible descend dans le
 *     display et se règle en GLISSANT dessus (ou à la molette)
 *   · OFF quitte la rangée de chips : la LED du boîtier devient l'interrupteur
 *     (verte en marche, rouge à l'arrêt)
 *   · bouton VOLET (absent de la prod) : ouverture en POURCENTAGE, pas en "3/5"
 *   · ventilation : hélice + jauge 3 barres ; en AUTO les barres respirent en
 *     cascade au lieu d'afficher le mot
 *   · les deux boutons machine ne suivent plus la couleur du mode (la barre
 *     virait au monochrome) : ils tirent leur teinte des « gaz rares &
 *     radiations » de Neo Tokyo, et cette teinte MONTE avec le réglage.
 *
 * Réglages : 19 clés flow_* + 4 couleurs, toutes exposées dans l'éditeur UI.
 * Les défauts sont ceux validés au banc, pas les valeurs théoriques.
 *
 * Prérequis : la ressource /local/neon-climate-card.js doit être chargée AVANT
 * celle-ci (elle définit la classe de base).
 * ────────────────────────────────────────────────────────────────────────────*/
(function () {
  'use strict';

  /* ── Socle rapatrié de neon-climate-card.js ──
   * Cette card ne dépend plus d'aucune autre ressource. */
  const NCC_IS_IPAD = /iPad/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const NCC_IS_LOW_POWER = NCC_IS_IPAD || /iPhone|iPad|iPod|Android|Mobile|HomeAssistant/i.test(navigator.userAgent);
  const MODE_DEFAULTS = {
    off:      '#6a7aaa',
    heat:     '#FF2D6B',
    cool:     '#5B7CFF',
    dry:      '#00E0C0',
    fan_only: '#00FFAA',
  };
  const PILL_DEFAULT = '#B400FF';
  function rgba(hex, a) { const c = hexRgb(hex); return `rgba(${c.r},${c.g},${c.b},${a})`; }
  const NEON_FONTS = [
    'Orbitron','Rajdhani','Share Tech Mono','Exo 2','Roboto','Montserrat',
    'Oswald','Bebas Neue','Inter','Poppins','Space Grotesk','Syne',
    'DM Sans','Playfair Display','Cinzel',
  ];

  const CARD_VERSION = '1.4';

  /* Défauts validés au banc (climate_flow_v2.html). Ce sont EUX la référence :
   * les valeurs "théoriques" de la v1 avaient été calibrées sur une géométrie
   * fausse et rendaient un panache anémique. */
  const FLOW_DEFAULTS = {
    count: 5,          // nombre de fentes — un faisceau par fente
    fan: 21,           // évasement total en degrés
    wobble: 0.50,      // oscillation latérale des faisceaux
    speed: 1.00,       // vitesse de cette oscillation
    taper: 1.00,       // finesse du jet — >1 sépare les faisceaux
    alpha: 0.39,       // exposition générale
    glow: 0.00,        // halo autour des faisceaux
    smoke: 2.32,       // débit de teinte — ×fan_mode
    smoke_scale: 30.0, // décalage des bouffées entre fentes
    smoke_speed: 0.25, // cadence des bouffées
    hue: -1,           // -1 = teinte auto depuis hvac_mode
    louver: 5,         // repli si l'entité n'expose pas swing_mode
    force: 1,          // repli si l'entité n'expose pas fan_mode
    curl: 19,          // vorticité — turbulence dans le flux
    v_dissip: 1.70,    // dissipation de la vélocité
    d_dissip: 0.45,    // dissipation de la teinte
    sparkle: 0.30,     // densité des poussières
    sparkle_size: 0.5, // taille des poussières
    fade: 0.22,        // hauteur du fondu au noir en bas
  };

  /* Couleurs des deux boutons machine, piochées dans la section
   * « GAZ RARES & RADIATIONS » du thème Neo Tokyo v3. Deux familles distinctes,
   * sinon les boutons se ressemblent : la ventilation vire au vert, le volet au
   * bleu-violet. `lo` = réglage au minimum, `hi` = à fond. */
  const COLOR_DEFAULTS = {
    color_fan_lo:   '#CCFF00',  // radio-uranium   — vert vaseline
    color_fan_hi:   '#39FF14',  // radio-plutonium — vert toxique
    color_swing_lo: '#00D4FF',  // gas-xenon       — bleu franc
    color_swing_hi: '#9D00FF',  // plasma-void     — violet réacteur
  };


  // -- Solveur de fluide (embarque) --------------------------------------
  /**
   * Solveur de flux d'air v2 — pour neon-climate-card
   *
   * Différence de fond avec la v1 : *rien* n'est codé en UV en dur. Toute la
   * géométrie (largeur de la grille, ligne d'émission, écartement des fentes)
   * arrive en PIXELS du backing-store et n'est convertie en UV qu'au dernier
   * moment. C'est ce qui plantait la v1 : des constantes calibrées sur un canvas
   * carré, recopiées sur une bande 8:1, écrasaient l'injection à ~10x2 px.
   *
   * Esthétique visée (réf. vecteezy 12816522) : la grille s'allume, N faisceaux
   * distincts en sortent et s'évasent, des poussières scintillent dedans, le tout
   * fond au noir en bas. Le fluide (Navier-Stokes) porte le volume, les faisceaux
   * portent la structure.
   */
  (function () {
    'use strict';

    /* Une clim n'a pas un potentiomètre : elle a trois vitesses + auto, et cinq
     * positions de volet. Les réglages sont donc des CRANS, pas des continuums. */
    const FAN_STEPS    = [0.55, 0.95, 1.45];              // vitesses 1 / 2 / 3
    const LOUVER_STEPS = [0.20, 0.40, 0.60, 0.80, 1.00];  // volet 1 → 5

    // ─── Shaders ────────────────────────────────────────────────────────────────

    const SIM_VERT = `
      attribute vec2 aPos;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPos*0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    /* Splat elliptique générique. radiusU/radiusV sont des DEMI-AXES EN UV,
     * calculés côté JS depuis des pixels : plus aucune correction d'aspect
     * bricolée dans le shader, donc plus rien à recalibrer quand la card change
     * de largeur. */
    const FRAG_SPLAT = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform vec2 point, radiusUV;
      uniform vec3 value;
      void main(){
        vec2 p = (vUv - point) / radiusUV;
        float d = exp(-dot(p,p));
        gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + value*d, 1.0);
      }
    `;

    /* Injection de vélocité d'UNE fente : ellipse orientée, direction imposée.
     * La v1 faisait une seule grosse gaussienne pour toute la grille et déduisait
     * l'angle de la position — d'où le "un seul jet flou". Ici chaque fente est
     * un jet à part entière, ce qui donne les faisceaux distincts de la réf. */
    const FRAG_SPLAT_JET = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform vec2 point, radiusUV, dir;
      uniform float mag;
      void main(){
        vec2 p = (vUv - point) / radiusUV;
        float d = exp(-dot(p,p));
        gl_FragColor = vec4(texture2D(uTarget, vUv).xy + dir*mag*d, 0.0, 1.0);
      }
    `;

    const FRAG_ADVECT = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity, uSource;
      uniform float dt, dissipation;
      void main(){
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vec4 result = texture2D(uSource, vUv - dt*vel);
        gl_FragColor = vec4(result.rgb/(1.0 + dissipation*dt), 1.0);
      }
    `;

    const FRAG_DIVERGENCE = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).x, R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y, B = texture2D(uVelocity, vB).y;
        vec2 c = texture2D(uVelocity, vUv).xy;
        /* Conditions aux limites — LE point qui bloquait tout. Avec des murs
         * (v1 : -c sur les 4 bords, v2a : mur en haut), l'air soufflé vers le bas
         * n'a aucune masse pour le remplacer : le solveur de pression annule le
         * jet et la teinte s'empile à l'ouverture en grosses boules. Le domaine
         * est donc OUVERT sur les quatre bords (gradient nul) : la clim aspire
         * par le haut ce qu'elle souffle par le bas, et le jet survit. */
        if (vL.x < 0.0)  L = c.x;
        if (vR.x > 1.0)  R = c.x;
        if (vT.y > 1.0)  T = c.y;
        if (vB.y < 0.0)  B = c.y;
        gl_FragColor = vec4(0.5*(R-L+T-B), 0.0, 0.0, 1.0);
      }
    `;

    const FRAG_PRESSURE = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uDivergence;
      void main(){
        float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
        gl_FragColor = vec4((L+R+T+B - texture2D(uDivergence, vUv).x)*0.25, 0.0, 0.0, 1.0);
      }
    `;

    const FRAG_GRADIENT = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uVelocity;
      void main(){
        float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R-L, T-B)*0.5;
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const FRAG_CURL = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).y, R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x, B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5*((R-L) - (T-B)), 0.0, 0.0, 1.0);
      }
    `;

    const FRAG_VORTICITY = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity, uCurl;
      uniform float curlStrength, dt;
      void main(){
        float L = texture2D(uCurl, vL).x, R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x, B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
        force /= length(force)+0.0001;
        force *= curlStrength*C;
        force.y *= -1.0;
        gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force*dt, 0.0, 1.0);
      }
    `;

    const FRAG_CLEAR = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }
    `;

    /* Affichage : cœur + halo (comme v1) MAIS avec deux ajouts qui viennent
     * directement de la réf — un fondu au noir en bas (plus de bord net) et une
     * surbrillance à la ligne de grille (la lumière naît à l'ouverture). */
    const FRAG_DISPLAY = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      uniform float exposure, glow, apertureV, fadeStart;
      /* Rayon du halo EN UV, calcule cote JS. Il etait exprime en texels
       * (texelSize*4.0) : sur un ecran fin la grille de teinte est plus dense,
       * donc 4 texels couvrent une fraction d'ecran plus petite et le halo —
       * qui porte l'essentiel de la lumiere — rétrécissait d'autant. */
      uniform vec2 haloUV;

      void main(){
        vec3 c = texture2D(uTexture, vUv).rgb;
        float dens = max(max(c.r, c.g), c.b);
        vec3 hueDir = c / max(dens, 0.0008);

        vec3 h = vec3(0.0);
        h += texture2D(uTexture, vUv+vec2(haloUV.x, 0.0)).rgb;
        h += texture2D(uTexture, vUv-vec2(haloUV.x, 0.0)).rgb;
        h += texture2D(uTexture, vUv+vec2(0.0, haloUV.y)).rgb;
        h += texture2D(uTexture, vUv-vec2(0.0, haloUV.y)).rgb;
        h *= 0.25;
        float densH = max(max(h.r,h.g),h.b);

        float core = smoothstep(0.03, 0.24, dens);
        float halo = smoothstep(0.01, 0.28, densH);
        vec3 col = hueDir * core * exposure + hueDir * halo * exposure * (0.35 + glow*0.9);

        // fondu au noir vers le bas : la réf n'a aucun bord franc
        col *= smoothstep(0.0, fadeStart, vUv.y);
        // la grille rayonne : petit surcroît juste sous l'ouverture
        col *= 1.0 + 0.85*smoothstep(apertureV - 0.10, apertureV, vUv.y);

        float a = clamp(max(max(col.r,col.g),col.b) * 1.2, 0.0, 1.0);
        gl_FragColor = vec4(col, a);
      }
    `;

    // Poussières : gl.POINTS, additif. aSeed = (x, y, life01, size)
    const PART_VERT = `
      precision highp float;
      attribute vec4 aPart;
      varying float vLife;
      uniform float uSize;
      void main(){
        vLife = aPart.z;
        gl_Position = vec4(aPart.xy*2.0 - 1.0, 0.0, 1.0);
        gl_PointSize = max(1.0, aPart.w * uSize);
      }
    `;
    const PART_FRAG = `
      precision highp float;
      varying float vLife;
      uniform vec3 uColor;
      uniform float uAlpha;
      void main(){
        vec2 d = gl_PointCoord - 0.5;
        float m = exp(-dot(d,d)*14.0);
        // scintillement : brillant à la naissance, s'éteint en fin de vie
        float f = vLife*vLife*(3.0-2.0*vLife);
        /* alpha = 1 : le blend est SRC_ALPHA,ONE, donc mettre l'atténuation à la
         * fois dans rgb ET dans alpha la comptait deux fois — poussières quasi
         * invisibles. Tout est prémultiplié dans rgb, alpha reste neutre. */
        gl_FragColor = vec4(mix(uColor, vec3(1.0), 0.55) * m * f * uAlpha, 1.0);
      }
    `;

    // ─── Plomberie GL ───────────────────────────────────────────────────────────

    function compile(gl, src, type){
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(sh));
      return sh;
    }
    function link(gl, vs, fs){
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl, vs, gl.VERTEX_SHADER));
      gl.attachShader(p, compile(gl, fs, gl.FRAGMENT_SHADER));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
      return p;
    }

    /**
     * @param canvas  le .wind-canvas, backing-store déjà dimensionné
     * @param geom    géométrie MESURÉE, en px du backing-store :
     *                { apX0, apX1, apY }  bornes et ligne d'émission de la grille
     */
    let _flowGL2Support;
    function flowGL2Supported(OPTS){
      if (_flowGL2Support !== undefined) return _flowGL2Support;
      const probe = document.createElement('canvas');
      probe.width = probe.height = 2;
      const p2 = probe.getContext('webgl2', OPTS);
      _flowGL2Support = !!(p2 && p2.getExtension('EXT_color_buffer_float'));
      if (p2) {
        const lose = p2.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
      return _flowGL2Support;
    }

    window.setupFlowSolver = function setupFlowSolver(canvas, geom){
      const OPTS = {alpha:true, depth:false, stencil:false,
                    antialias:false, preserveDrawingBuffer:false};

      /* Choix de l'API AVANT de toucher au vrai canvas : un canvas ne donne qu'UN
       * seul type de contexte a vie, donc on ne peut pas essayer webgl2 dessus
       * puis se rabattre sur webgl. On sonde sur un canvas jetable.
       *
       * Vecu (WebView de l'app HA, Pixel 9a / Mali-G715, Chrome 150) : WebGL 1
       * n'y expose NI OES_texture_half_float NI OES_texture_float — le solveur
       * mourait a la creation avec « texture flottante indisponible », d'ou une
       * card parfaitement vivante mais vide, alors que le meme code tourne dans
       * Chrome sur le meme telephone. En WebGL 2 le demi-flottant est un format
       * du coeur, et EXT_color_buffer_float le rend RENDABLE : mesure sur
       * l'appareil, RGBA16F/HALF_FLOAT = framebuffer COMPLET.
       *
       * Les 12 shaders restent en GLSL ES 1.00 : sans directive #version, WebGL 2
       * les compile tels quels. Rien d'autre a porter ici — aucune extension
       * WebGL 1 (instanciation, derivees) n'est utilisee par ce solveur. */
      let gl = null, isGL2 = false;
      /* L'extension doit etre demandee AVANT tout checkFramebufferStatus, sinon le
       * format n'est pas encore rendable et le FBO se declare incomplet. Piege
       * paye une fois : premier diagnostic sur l'appareil conclu a tort au refus. */
      if (flowGL2Supported(OPTS)){
        gl = canvas.getContext('webgl2', OPTS);
        isGL2 = !!gl;
        if (gl) gl.getExtension('EXT_color_buffer_float');
      }
      if (!gl){
        gl = canvas.getContext('webgl', OPTS) || canvas.getContext('experimental-webgl', OPTS);
      }
      if (!gl) throw new Error('WebGL indisponible');

      /* Format interne SIZE en WebGL 2 (RGBA16F), non size en WebGL 1 (RGBA) :
       * texImage2D refuse le couple inverse sur chacune des deux API. */
      let texInternal, texType, filtering;
      if (isGL2){
        texInternal = gl.RGBA16F;
        texType = gl.HALF_FLOAT;
        /* Le filtrage lineaire du demi-flottant fait partie du coeur de WebGL 2. */
        filtering = gl.LINEAR;
      } else {
        texInternal = gl.RGBA;
        const halfFloat = gl.getExtension('OES_texture_half_float');
        gl.getExtension('EXT_color_buffer_half_float');
        if (halfFloat){
          texType = halfFloat.HALF_FLOAT_OES;
          filtering = gl.getExtension('OES_texture_half_float_linear') ? gl.LINEAR : gl.NEAREST;
        } else {
          if (!gl.getExtension('OES_texture_float')) throw new Error('texture flottante indisponible');
          texType = gl.FLOAT;
          filtering = gl.getExtension('OES_texture_float_linear') ? gl.LINEAR : gl.NEAREST;
        }
      }

      const W = canvas.width, H = canvas.height;

      /* Grille de simulation à TEXELS CARRÉS. La v1 mettait 96x96 sur une bande
       * 8:1 : pression et vorticité résolues dans un espace étiré, donc un fluide
       * qui ne ressemble à rien quelles que soient les valeurs. */
      const simH = 56;
      const simW = Math.max(32, Math.min(320, Math.round(simH * W / H)));

      const quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);

      function useProgram(p){
        gl.useProgram(p);
        const aPos = gl.getAttribLocation(p, 'aPos');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      }
      function U(p, names){ const o={}; names.forEach(n => o[n]=gl.getUniformLocation(p,n)); return o; }

      const fboResources = [];
      function createFBO(w, h){
        gl.activeTexture(gl.TEXTURE0);
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, texInternal, w, h, 0, gl.RGBA, texType, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error('FBO incomplet 0x'+st.toString(16));
        gl.viewport(0,0,w,h); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
        const resource = { tex, fbo, w, h, texelX:1/w, texelY:1/h };
        fboResources.push(resource);
        return resource;
      }
      function bindFBO(t){
        gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
        gl.viewport(0, 0, t ? t.w : W, t ? t.h : H);
      }
      function doubleFBO(w,h){
        let a = createFBO(w,h), b = createFBO(w,h);
        return { w,h, texelX:1/w, texelY:1/h,
                 get read(){return a;}, get write(){return b;}, swap(){const t=a;a=b;b=t;} };
      }
      function blit(t){ bindFBO(t); gl.drawArrays(gl.TRIANGLES, 0, 3); }

      const pSplat = link(gl, SIM_VERT, FRAG_SPLAT);
      const pJet   = link(gl, SIM_VERT, FRAG_SPLAT_JET);
      const pAdv   = link(gl, SIM_VERT, FRAG_ADVECT);
      const pDiv   = link(gl, SIM_VERT, FRAG_DIVERGENCE);
      const pPres  = link(gl, SIM_VERT, FRAG_PRESSURE);
      const pGrad  = link(gl, SIM_VERT, FRAG_GRADIENT);
      const pCurl  = link(gl, SIM_VERT, FRAG_CURL);
      const pVort  = link(gl, SIM_VERT, FRAG_VORTICITY);
      const pClr   = link(gl, SIM_VERT, FRAG_CLEAR);
      const pDisp  = link(gl, SIM_VERT, FRAG_DISPLAY);
      const pPart  = link(gl, PART_VERT, PART_FRAG);
      const programs = [pSplat, pJet, pAdv, pDiv, pPres, pGrad, pCurl, pVort, pClr, pDisp, pPart];

      const uSplat = U(pSplat, ['uTarget','point','radiusUV','value']);
      const uJet   = U(pJet,   ['uTarget','point','radiusUV','dir','mag']);
      const uAdv   = U(pAdv,   ['texelSize','uVelocity','uSource','dt','dissipation']);
      const uDiv   = U(pDiv,   ['texelSize','uVelocity']);
      const uPres  = U(pPres,  ['texelSize','uPressure','uDivergence']);
      const uGrad  = U(pGrad,  ['texelSize','uPressure','uVelocity']);
      const uCurl  = U(pCurl,  ['texelSize','uVelocity']);
      const uVort  = U(pVort,  ['texelSize','uVelocity','uCurl','curlStrength','dt']);
      const uClr   = U(pClr,   ['texelSize','uTexture','value']);
      const uDisp  = U(pDisp,  ['texelSize','uTexture','exposure','glow','apertureV','fadeStart','haloUV']);
      const uPart  = U(pPart,  ['uSize','uColor','uAlpha']);

      const velocity   = doubleFBO(simW, simH);
      const pressure   = doubleFBO(simW, simH);
      const divergence = createFBO(simW, simH);
      const curl       = createFBO(simW, simH);
      /* Grille de TEINTE decouplee du backing-store. Piege mesure sur Pixel
       * (DPR 2.625, canvas 766x220 contre ~290x45 sur PC) : l'advection
       * echantillonne en UV normalises, donc un meme deplacement traverse 2.6x
       * plus de texels quand la texture est plus fine -> l'interpolation lisse
       * le panache et le dyeRate se dilue sur 4x plus de surface. Le flux
       * devenait "tres tres leger" sur mobile alors que le GPU suit sans peine.
       * On plafonne donc la hauteur de teinte : au-dela, on rend la meme
       * simulation, seulement etiree a l'affichage. */
      const DYE_H_MAX = 132;
      const dyeH = Math.max(48, Math.min(H, DYE_H_MAX));
      const dyeW = Math.max(64, Math.round(dyeH * W / H));
      const dye        = doubleFBO(dyeW, dyeH);

      // ─── Géométrie mesurée → UV. Fait UNE fois, pas de constante magique. ─────
      // v=1 en haut de la texture (le splat pousse vers -y), donc on inverse.
      const apU0 = geom.apX0 / W;
      const apU1 = geom.apX1 / W;
      /* UNE ligne d'émission PAR LATTE. La card en a trois : n'émettre que depuis
       * celle du haut laissait les deux autres inertes, d'où un flux qui semblait
       * sortir d'un seul endroit au lieu de toute la grille. */
      const apVs = (geom.apYs && geom.apYs.length ? geom.apYs : [geom.apY]).map(y => 1 - y/H);
      const apV  = Math.max.apply(null, apVs);   // la plus haute : sert au display
      const apWidthU = Math.max(1/W, apU1 - apU0);

      // ─── Poussières (CPU : quelques centaines, le GPU n'a rien à y gagner) ────
      const MAXP = 260;
      const part = new Float32Array(MAXP*4);      // x, y, life01, size
      const pvel = new Float32Array(MAXP*2);
      const plife = new Float32Array(MAXP);       // temps restant, en s
      const partBuf = gl.createBuffer();
      let pcount = 0;

      function spawnParticle(i, uv, dir, speed){
        part[i*4+0] = uv[0]; part[i*4+1] = uv[1];
        part[i*4+2] = 1.0;
        part[i*4+3] = 0.5 + Math.random()*1.4;
        pvel[i*2+0] = dir[0]*speed*(0.6 + Math.random()*0.8);
        pvel[i*2+1] = dir[1]*speed*(0.6 + Math.random()*0.8);
        plife[i] = 0.9 + Math.random()*1.5;
      }

      function splatDye(uv, radiusUV, color){
        useProgram(pSplat);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.uniform1i(uSplat.uTarget, 0);
        gl.uniform2f(uSplat.point, uv[0], uv[1]);
        gl.uniform2f(uSplat.radiusUV, radiusUV[0], radiusUV[1]);
        gl.uniform3f(uSplat.value, color[0], color[1], color[2]);
        blit(dye.write); dye.swap();
      }
      function splatJet(uv, radiusUV, dir, mag){
        useProgram(pJet);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uJet.uTarget, 0);
        gl.uniform2f(uJet.point, uv[0], uv[1]);
        gl.uniform2f(uJet.radiusUV, radiusUV[0], radiusUV[1]);
        gl.uniform2f(uJet.dir, dir[0], dir[1]);
        gl.uniform1f(uJet.mag, mag);
        blit(velocity.write); velocity.swap();
      }

      let lastT = null;

      function step(t, P){
        gl.disable(gl.BLEND);
        const dt = Math.min(lastT === null ? 1/60 : (t - lastT), 1/30);
        lastT = t;

        const n = Math.max(1, Math.round(P.count));
        const [cr, cg, cb] = P.rgb;

        /* Volet : la clim a CINQ positions de swing, pas un continuum. */
        const li = Math.min(LOUVER_STEPS.length-1, Math.max(0, Math.round(P.louver)-1));
        const openness = LOUVER_STEPS[li];
        const aperture = 0.35 + 0.65*openness;

        /* Ventilateur : TROIS vitesses + auto. Le cran 4 (auto) respire lentement
         * entre la plus basse et la plus haute. */
        const fi = Math.round(P.force);
        const fanMul = fi >= 4
          ? FAN_STEPS[0] + (FAN_STEPS[2]-FAN_STEPS[0]) * (0.5 + 0.5*Math.sin(t*0.32))
          : FAN_STEPS[Math.min(FAN_STEPS.length-1, Math.max(0, fi-1))];

        // Écartement : demi-angle total, dérivé du curseur en degrés.
        const spread = P.fan * Math.PI/180 * 0.5;
        const vDiss  = Math.max(P.v_dissip, 0.05);
        const speed  = 1.3 * 0.78 * fanMul * aperture;
        const mag    = speed * vDiss * dt;

        // Une fente = une part de la LARGEUR RÉELLE de la grille. C'est tout le
        // sujet : plus de 0.30 en dur, plus de [0.5, 0.93].
        const pitchU  = apWidthU / n;
        const jetHalfU = Math.max(0.6/W, pitchU * 0.5 / Math.max(0.5, P.taper));
        /* Deux géométries d'injection RADICALEMENT différentes, et c'est le nerf
         * de l'affaire :
         *  - la VÉLOCITÉ est forcée sur un tuyau ALLONGÉ vers le bas. Poussée sur
         *    une bande fine, la projection de pression convertit tout le jet en
         *    une paire de tourbillons (on voyait des arcs qui s'étalent sur les
         *    côtés au lieu d'un souffle) : le champ à divergence nulle le plus
         *    proche d'une ligne poussée vers le bas, c'est une recirculation.
         *    Un tuyau soutient le jet sur toute sa course, comme un ventilateur.
         *  - la TEINTE reste injectée finement à l'ouverture, pour des faisceaux
         *    nets qui se dessinent en descendant plutôt qu'un bloc peint. */
        const velHalfV = 0.42;
        const velCtrV  = Math.max(0.05, apV - velHalfV*0.62);
        /* Epaisseur de la bande d'injection : 3 TEXELS DE TEINTE, donc rapportee
         * a dyeH et non au backing-store. Sur un ecran DPR 2.6, 3.0/H etait une
         * bande 2.6x plus fine en proportion -> moins de matiere injectee. */
        const dyeBandV = 3.0/dyeH;
        /* Le débit de teinte suit la VITESSE. Sans ça, on injectait la même
         * quantité par image quelle que soit la vitesse : à fond, le flux la
         * balayait si vite que la densité stationnaire (∝ 1/vitesse) tombait à
         * rien et le souffle disparaissait au moment où il aurait dû être le plus
         * marqué. Un ventilateur qui accélère pousse PLUS d'air, pas le même air
         * étalé plus loin. Normalisé sur le cran 2 pour que `smoke` garde le même
         * sens qu'avant. */
        const dyeRate  = P.smoke * 0.6 * dt * aperture * (fanMul / FAN_STEPS[1]);

        /* Le débit total est réparti entre les lattes : trois lignes qui soufflent
         * chacune un tiers, pas trois fois le même souffle. */
        const nL = apVs.length;
        const share = 1 / nL;

        for (let l = 0; l < nL; l++){
          const lv = apVs[l];
          const velCtrL = Math.max(0.05, lv - velHalfV*0.62);

          for (let i = 0; i < n; i++){
            const frac = n > 1 ? i/(n-1) : 0.5;
            const off  = (frac - 0.5);                     // -0.5 .. +0.5
            const u    = apU0 + (frac*(n-1)+0.5)/n * apWidthU;

            // Oscillation latérale : les lames bougent, le faisceau suit. Chaque
            // latte est légèrement déphasée, sinon les trois battent au garde-à-vous.
            const wob = P.wobble * Math.sin(t*P.speed*1.6 + i*1.7 + l*0.9);
            const ang = (off*2.0 + wob) * spread;
            const dir = [Math.sin(ang), -Math.cos(ang)];

            /* Le tuyau de forçage suit la direction du jet. Le décalage vertical est
             * en UV « v » ; le décalage horizontal correspondant doit passer par le
             * rapport H/W, sinon il est étiré comme tout le reste sur une bande. */
            const reach = lv - velCtrL;
            const jx = u + dir[0] * reach * (H / W) / Math.max(0.15, -dir[1]);
            splatJet([jx, velCtrL], [jetHalfU*1.7, velHalfV], dir, mag*share);

            // Densité modulée le long du temps → le faisceau "respire" au lieu
            // d'être un tube uniforme (smoke_scale / smoke_speed, enfin branchés).
            const puff = 1 + 0.45*Math.sin(t*P.smoke_speed*3.0 + i*P.smoke_scale*0.31 + l*1.3);
            const k = dyeRate * puff * share;
            splatDye([u, lv], [jetHalfU*1.05, dyeBandV], [cr*k, cg*k, cb*k]);

            if (pcount < MAXP && Math.random() < P.sparkle*dt*22*share){
              spawnParticle(pcount++, [u, lv], dir, speed*0.55);
            }
          }

          // La latte rayonne : fine nappe sur toute la largeur de l'ouverture.
          const gk = dyeRate * 0.5 * share;
          splatDye([(apU0+apU1)*0.5, lv], [apWidthU*0.42, dyeBandV*0.8], [cr*gk, cg*gk, cb*gk]);
        }

        // ── Navier-Stokes (inchangé sur le fond : c'est la partie qui marchait) ──
        useProgram(pCurl);
        gl.uniform2f(uCurl.texelSize, velocity.texelX, velocity.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uCurl.uVelocity, 0);
        blit(curl);

        useProgram(pVort);
        gl.uniform2f(uVort.texelSize, velocity.texelX, velocity.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uVort.uVelocity, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, curl.tex);
        gl.uniform1i(uVort.uCurl, 1);
        gl.uniform1f(uVort.curlStrength, P.curl);
        gl.uniform1f(uVort.dt, dt);
        blit(velocity.write); velocity.swap();

        useProgram(pDiv);
        gl.uniform2f(uDiv.texelSize, velocity.texelX, velocity.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uDiv.uVelocity, 0);
        blit(divergence);

        useProgram(pClr);
        gl.uniform2f(uClr.texelSize, pressure.texelX, pressure.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(uClr.uTexture, 0);
        gl.uniform1f(uClr.value, 0.8);
        blit(pressure.write); pressure.swap();

        useProgram(pPres);
        gl.uniform2f(uPres.texelSize, pressure.texelX, pressure.texelY);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
        gl.uniform1i(uPres.uDivergence, 1);
        for (let k = 0; k < 20; k++){
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
          gl.uniform1i(uPres.uPressure, 0);
          blit(pressure.write); pressure.swap();
        }

        useProgram(pGrad);
        gl.uniform2f(uGrad.texelSize, velocity.texelX, velocity.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(uGrad.uPressure, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uGrad.uVelocity, 1);
        blit(velocity.write); velocity.swap();

        useProgram(pAdv);
        gl.uniform2f(uAdv.texelSize, velocity.texelX, velocity.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uAdv.uVelocity, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uAdv.uSource, 1);
        gl.uniform1f(uAdv.dt, dt); gl.uniform1f(uAdv.dissipation, P.v_dissip);
        blit(velocity.write); velocity.swap();

        useProgram(pAdv);
        gl.uniform2f(uAdv.texelSize, dye.texelX, dye.texelY);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(uAdv.uVelocity, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.uniform1i(uAdv.uSource, 1);
        gl.uniform1f(uAdv.dt, dt); gl.uniform1f(uAdv.dissipation, P.d_dissip);
        blit(dye.write); dye.swap();

        // ── Poussières : intégration analytique (pas de readback GPU, qui
        //    stallerait le pipeline pour 260 points). ──
        for (let i = pcount - 1; i >= 0; i--){
          plife[i] -= dt;
          if (plife[i] <= 0){                     // swap-remove
            pcount--;
            part.copyWithin(i*4, pcount*4, pcount*4+4);
            pvel.copyWithin(i*2, pcount*2, pcount*2+2);
            plife[i] = plife[pcount];
            continue;
          }
          pvel[i*2+1] -= 0.02*dt;                 // légère chute
          part[i*4+0] += pvel[i*2+0]*dt;
          part[i*4+1] += pvel[i*2+1]*dt;
          part[i*4+2] = Math.min(1, plife[i]/1.2);
        }
      }

      function render(P){
        bindFBO(null);
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        useProgram(pDisp);
        gl.uniform2f(uDisp.texelSize, dye.texelX, dye.texelY);
        /* Halo en FRACTION D'ECRAN, pas en texels : 4 texels d'une grille de
         * reference 132px de haut. Ainsi le halo garde la meme ampleur visuelle
         * quelle que soit la finesse de l'ecran. */
        gl.uniform2f(uDisp.haloUV, 4.0/(DYE_H_MAX*W/H), 4.0/DYE_H_MAX);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.uniform1i(uDisp.uTexture, 0);
        gl.uniform1f(uDisp.exposure, P.alpha*2.2);
        gl.uniform1f(uDisp.glow, P.glow);
        gl.uniform1f(uDisp.apertureV, apV);
        gl.uniform1f(uDisp.fadeStart, Math.max(0.05, P.fade));
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (pcount > 0 && P.sparkle > 0){
          gl.useProgram(pPart);
          gl.bindBuffer(gl.ARRAY_BUFFER, partBuf);
          gl.bufferData(gl.ARRAY_BUFFER, part.subarray(0, pcount*4), gl.DYNAMIC_DRAW);
          const a = gl.getAttribLocation(pPart, 'aPart');
          gl.enableVertexAttribArray(a);
          gl.vertexAttribPointer(a, 4, gl.FLOAT, false, 0, 0);
          gl.uniform1f(uPart.uSize, P.sparkle_size);
          gl.uniform3f(uPart.uColor, P.rgb[0], P.rgb[1], P.rgb[2]);
          gl.uniform1f(uPart.uAlpha, Math.min(1, P.alpha*1.8));
          gl.drawArrays(gl.POINTS, 0, pcount);
        }
      }

      /* `api` remonte jusqu'au panneau de diagnostic : sur un appareil sans
       * console, savoir sur quel chemin on est tombe evite de re-deviner. */
      let onContextLost = null;
      let onContextRestored = null;
      let api = null;
      const contextLostHandler = (event) => {
        event.preventDefault();
        if (onContextLost) onContextLost(api);
      };
      const contextRestoredHandler = () => {
        if (onContextRestored) onContextRestored(api);
      };
      canvas.addEventListener('webglcontextlost', contextLostHandler, false);
      canvas.addEventListener('webglcontextrestored', contextRestoredHandler, false);

      api = {
        step, render,
        info: { W, H, simW, simH, apU0, apU1, apV, api: isGL2 ? 'webgl2' : 'webgl1' },
        setContextHandlers(lost, restored){
          onContextLost = lost;
          onContextRestored = restored;
        },
        dispose(){
          canvas.removeEventListener('webglcontextlost', contextLostHandler);
          canvas.removeEventListener('webglcontextrestored', contextRestoredHandler);
          programs.forEach((program) => gl.deleteProgram(program));
          gl.deleteBuffer(quadBuf);
          gl.deleteBuffer(partBuf);
          fboResources.forEach((resource) => {
            gl.deleteFramebuffer(resource.fbo);
            gl.deleteTexture(resource.tex);
          });
        },
      };
      return api;
    };
  })();


  class NeonClimateCardWebgl extends HTMLElement {

    /* Nos clés : les 19 flow_* et les 4 couleurs. Chaque flow_* est lu en nombre
     * — l'éditeur et le YAML rendent des chaînes — et retombe sur le défaut du
     * banc si absent ou illisible.
     *
     * ORDRE CRITIQUE : this._setConfigBase() appelle _build(), qui appelle
     * _applyColors() → _applySkin() → _flowParams(). Tout doit donc être posé
     * AVANT le super, sinon la première construction lit un this._flow undefined
     * et la card ne s'affiche pas du tout. */
    setConfig(config) {
      const num = (v, d) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : d;
      };
      const flow = {};
      for (const k in FLOW_DEFAULTS) flow[k] = num(config['flow_' + k], FLOW_DEFAULTS[k]);
      /* `quality` est le SEUL reglage non numerique : le passer dans num() le
       * transformerait en NaN puis en defaut, donc silencieusement inoperant. */
      const okQ = ['auto', 'full', 'light', 'off'];
      flow.quality = okQ.indexOf(String(config.flow_quality || '').trim()) >= 0
                   ? String(config.flow_quality).trim() : 'auto';
      this._flow = flow;

      this._setConfigBase(config);

      // _config n'existe qu'après le super : les couleurs s'y greffent ensuite.
      for (const k in COLOR_DEFAULTS) {
        this._config[k] = config[k] || COLOR_DEFAULTS[k];
      }
      if (this._hass && this.shadowRoot) this._applyColors();
    }

    static getConfigElement() { return document.createElement('neon-climate-card-webgl-editor'); }
    static getStubConfig()    { return { entity: 'climate.example' }; }


    // La v1.3.1 pose `margin-bottom: 0px !important` sur .ac-body.wind-on, ce qui
    // écrase les 58/66px des media queries : ha-card{overflow:hidden} rogne alors
    // près de la moitié du panache. On rend la place ici.
    _ensureRoom(px){
      let s = this.shadowRoot.getElementById('flow-room');
      if (!s){
        s = document.createElement('style');
        s.id = 'flow-room';
        this.shadowRoot.appendChild(s);
      }
      s.textContent = `.ac-body.wind-on { margin-bottom:${px}px !important; }
                       .wind-wrap { height:${px}px !important; }
                       .wind-canvas { filter: blur(1.4px) saturate(150%) brightness(1.25); }`;
    }

    /* ─── Habillage (points 1 à 4) ───────────────────────────────────────────
     * Tout est posé PAR-DESSUS le DOM de la prod, sans le toucher : une feuille
     * de style ajoutée au shadow root + un seul SVG injecté dans la pilule.
     * Objectif de la réf vecteezy : du RELIEF (les fentes sont des creux, pas
     * des traits) et de la HIERARCHIE (on doit voir le mode actif d'un coup). */
    _build(){
      this._buildBase();
      const sr = this.shadowRoot;

      const st = document.createElement('style');
      st.id = 'flow-skin';
      st.textContent = `
        /* 1 — Les lattes deviennent des CREUX : dégradé sombre en haut, lèvre
         * claire en bas, ombre portée interne. C'est ce qui fait "la lumière
         * tombe dedans" sur la réf. */
        .louvers { perspective: 260px; gap: 4px; padding-bottom: 2px; }
        .louver {
          height: 6px; border-radius: 3px;
          background: linear-gradient(180deg,
            #000                   0%,
            rgba(6,10,22,0.92)    38%,
            rgba(120,130,190,0.28) 82%,
            rgba(200,205,255,0.55) 100%);
          box-shadow: inset 0 3px 4px rgba(0,0,0,1),
                      0 1px 0 rgba(255,255,255,0.08);
          /* 2 — la latte s'incline vraiment : swing_mode pilote le volet ET le flux */
          transform: rotateX(var(--tilt, 0deg));
          transform-origin: top center;
          transition: transform .6s cubic-bezier(.4,0,.2,1),
                      height .5s ease, opacity .5s ease, margin .5s ease;
        }
        /* La lèvre inférieure du boîtier s'allume : c'est elle qui vend
         * "l'air sort d'ici". Intensité pilotée par la vitesse. */
        .ac-body::after {
          content: ''; position: absolute; left: 12px; right: 12px; bottom: -1px;
          height: 1px; border-radius: 1px; pointer-events: none;
          background: var(--lip-color, #00fff9);
          opacity: var(--lip, 0);
          box-shadow: 0 0 6px var(--lip-color, #00fff9),
                      0 0 16px var(--lip-color, #00fff9);
          transition: opacity .5s ease, background .3s;
        }

        /* 3 — La cible reste sur la ligne du haut, à droite des pastilles : une
         * fois les chips réduites à leur icône, la place est là et la barre
         * n'est plus assez remplie pour s'en passer. Version compacte : la
         * pilule prend la hauteur des chips au lieu de l'imposer. Le geste de
         * glissement est conservé EN PLUS des −/+ (cf _bindTargetScrub). */
        /* Le retour à la ligne reste AUTORISÉ : sur PC la barre tient sur une
         * ligne, sur iPad/Pixel la pilule repasse en dessous, entière et pleine
         * largeur, comme avant. Pas de nowrap, qui l'écraserait sur mobile.
         *
         * Les chips ne DOIVENT PAS s'étirer (flex:0 0 auto) : avec un grow,
         * elles absorbent toute la largeur libre et la pilule se retrouve
         * comprimée à sa min-width — CIBLE illisible et 25° collé aux −/+. */
        .modes-group { flex: 0 0 auto !important; flex-wrap: nowrap !important; min-width: 0; }
        /* 160px : la largeur qu'il lui faut pour respirer (deux boutons de 30px
         * + la valeur en 20px + le libellé CIBLE en entier). En dessous elle
         * bascule à la ligne plutôt que de se tasser. */
        .pill-wrap   { flex: 1 1 160px !important; min-width: 160px !important; }
        .temp-pill   { border-radius: 12px; cursor: ew-resize; touch-action: none; }
        /* la prod pose background/borderColor en style inline (_applyColors) :
         * seul !important peut les couvrir le temps du geste. */
        .temp-pill.dragging { background: rgba(255,255,255,0.10) !important; }
        .temp-pill button { width: 30px; font-size: 17px; }
        .pill-center { padding: 2px 0; }
        .pill-label  { font-size: 7px; letter-spacing: 1.5px; line-height: 1; }
        /* Même corps que la card d'origine : c'est la valeur qu'on lit de loin,
         * la réduire pour gagner 3px était une fausse économie. */
        .pill-value  { font-size: 20px !important; line-height: 1.1;
                       transition: transform .12s; }
        .temp-pill.dragging .pill-value { transform: scale(1.12); }

        /* 4 — Barre de contrôle unique : modes à gauche, machine à droite.
         * On garde les pastilles CARREES A COINS ARRONDIS et la couleur par
         * mode de l'ancienne card : les ronds gris uniformes gagnaient en
         * compacité mais vidaient la barre de sa couleur. */
        .modes-row   { align-items: center; gap: 5px; }
        /* NE PAS remettre flex/flex-wrap ici : c'est la règle du bloc 3
         * (flex:0 0 auto + nowrap) qui fait tenir la pilule. Une 2e déclaration
         * plus bas dans la même feuille l'écrasait et la pilule se tassait. */
        .modes-group { gap: 5px; }
        /* Plus AUCUN libellé sur les chips : le mode courant est déjà écrit en
         * toutes lettres dans la colonne MODE du display. Le libellé est un
         * noeud texte nu (pas de <span>), on le masque via font-size:0 et on
         * rend sa taille à l'icône. */
        .mode-btn {
          border-radius: 9px; font-size: 0 !important; padding: 6px 9px !important;
          transition: transform .2s, box-shadow .2s, border-color .2s, background .2s;
        }
        .mode-btn .ico { font-size: 16px !important; display: flex; }
        /* le SVG n'hérite pas d'une taille de font-size:0 : on la lui donne */
        .mode-btn .ico svg { width: 16px; height: 16px; display: block; }
        .mode-btn.active { transform: translateY(-1px) scale(1.06); }
        /* OFF quitte la barre : il est passé sur la LED du boîtier. */
        .mode-btn[data-mode="off"] { display: none !important; }

        /* La LED devient l'interrupteur : vert = en marche, rouge = à l'arrêt.
         * 9px c'est petit pour le doigt, d'où la zone de clic élargie en ::after. */
        .ac-led { width: 9px; height: 9px; cursor: pointer; position: relative; }
        .ac-led::after {
          content: ''; position: absolute; inset: -9px; border-radius: 50%;
        }
        .ac-led.off {
          background: #ff2d55 !important;
          box-shadow: 0 0 8px #ff2d55, 0 0 16px rgba(255,45,85,0.45) !important;
        }
        .ac-led:hover { filter: brightness(1.3); }

        /* Les deux boutons machine : ventilateur et volet, même gabarit. */
        .fan-btn, .swing-btn {
          border-radius: 9px; padding: 6px 9px; flex-direction: row; gap: 5px;
          align-items: center; min-width: 0 !important; flex: 0 0 auto;
          background: transparent; border: 1px solid rgba(184,184,255,0.18);
          font-family: 'Orbitron', var(--primary-font-family, sans-serif);
          font-size: 8px; letter-spacing: .5px; cursor: pointer;
          display: flex; justify-content: center;
          -webkit-tap-highlight-color: transparent; user-select: none;
          transition: border-color .2s, background .2s, color .2s;
        }
        .swing-btn svg { width: 20px; height: 20px; display: block; }
        /* hélice + jauge 3 barres : viewBox 36×24, donc pas carré.
         * Plus de libellé AUTO à loger → la place va à l'icône. */
        .fan-btn svg { width: 30px; height: 20px; display: block; }
        .fan-bar { transition: opacity .3s ease; }
        /* AUTO : au lieu d'écrire le mot, les barres respirent en cascade —
         * la machine cherche son régime toute seule. */
        @keyframes fan-auto {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 1; }
        }
        /* emoji de la prod, calé sur la taille des icônes de mode */
        .fan-btn .ico { display: flex; font-size: 15px; line-height: 1; }
        .fan-btn #fan-lbl:empty { display: none; }
        /* La latte pivote autour de sa charnière (bord gauche), comme la vraie. */
        .swing-slat {
          transition: transform .5s cubic-bezier(.4,0,.2,1);
          transform-origin: 4.5px 10px;
        }
        .swing-air  { transition: opacity .4s ease; }
        .fan-btn #fan-lbl { font-size: 7px; letter-spacing: .6px; }
        .swing-btn #swing-lbl { font-size: 10px; letter-spacing: .3px; }

        /* 5 — Le display retrouve ses trois colonnes de même hauteur : la cible
         * est remontée dans la barre, il n'y a plus de ligne en trop à gauche. */
        .display-label { line-height: 1; }
        .display-value { font-size: clamp(12px, 5.2cqi, 22px) !important; }
        .display-value.sm { font-size: clamp(10px, 4.2cqi, 18px) !important; }
        .display-sep { height: 38px; }

        /* 6 — Compactage vertical demandé : la barre de pastilles respirait
         * pour des chips à libellé qui n'existent plus. On resserre au-dessus
         * (padding de la card) et en dessous (gap avant le boîtier). */
        .card { padding: 10px 12px 8px !important; gap: 7px !important; }
        .ac-display { padding: 5px 8px !important; }
      `;
      sr.appendChild(st);

      const NS = 'http://www.w3.org/2000/svg';
      const svg = (vb, inner) => {
        const s = document.createElementNS(NS, 'svg');
        s.setAttribute('viewBox', vb);
        s.innerHTML = inner;
        return s;
      };

      this._svg = svg;

      /* L'hélice mdi:fan, réutilisée par le mode FAN et par le bouton vitesse. */
      const FAN_PATH = 'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.75C16.78,13.75 15.72,13.31 14.79,13.12C14.59,13.61 14.28,14.03 13.88,14.36C15.87,18.05 15.08,22.03 11.5,22.03C7,22.03 6.91,18.46 9.26,17.28C10.25,16.79 10.69,15.73 10.88,14.8C10.4,14.6 9.98,14.29 9.65,13.89C5.96,15.88 1.98,15.09 1.98,11.51C1.98,7 5.55,6.91 6.73,9.26C7.22,10.25 8.28,10.69 9.21,10.88C9.41,10.4 9.72,9.98 10.12,9.65C8.13,5.96 8.92,1.98 12.5,1.98V2Z';
      this._fanPath = FAN_PATH;

      /* Mode FAN : une hélice, pas un 〜. Fixe — c'est un mode, pas un réglage. */
      const fanIcoMode = sr.querySelector('.mode-btn[data-mode="fan_only"] .ico');
      if (fanIcoMode){
        fanIcoMode.textContent = '';
        fanIcoMode.appendChild(svg('0 0 24 24',
          '<path fill="currentColor" d="' + FAN_PATH + '"/>'));
      }

      /* Bouton VOLET : il manquait purement et simplement. L'icône montre la
       * bouche d'aération vue de profil — le capot fixe en haut, la latte qui
       * bascule en dessous — et le libellé donne l'ouverture en POURCENTAGE :
       * "1/5" ne dit rien, "50%" se lit sans mode d'emploi. */
      const group = sr.querySelector('.modes-group');
      const fanBtn = sr.getElementById('fan-cycle-btn');
      if (group){
        const sw = document.createElement('button');
        sw.className = 'swing-btn';
        sw.id = 'swing-cycle-btn';
        sw.title = 'Ouverture du volet';
        sw.appendChild(svg('0 0 24 24',
          '<g fill="none" stroke="currentColor" stroke-linecap="round">' +
          // le caisson : deux montants, la bouche est entre les deux
          '<path d="M3 4.5h18" stroke-width="2.6"/>' +
          // la latte, pivotant sur sa charnière gauche
          '<path class="swing-slat" d="M4.5 10h15" stroke-width="2.6"/>' +
          // le souffle qui sort, d'autant plus marqué que c'est ouvert
          '<path class="swing-air" d="M8 20.5c2-2.5 6-2.5 8 0" stroke-width="1.8"/></g>'));
        const lbl = document.createElement('span');
        lbl.id = 'swing-lbl';
        sw.appendChild(lbl);
        sw.addEventListener('click', e => {
          e.stopPropagation();
          const s = this._hass && this._hass.states[this._config.entity];
          const modes = (s && s.attributes.swing_modes) || [];
          if (!modes.length) return;
          const i = modes.indexOf(s.attributes.swing_mode);
          this._callService('set_swing_mode', { swing_mode: modes[(i+1) % modes.length] });
        });
        group.insertBefore(sw, fanBtn ? fanBtn.nextSibling : null);
        this._swingBtn = sw;
      }

      /* OFF quitte la barre de chips : la LED verte du boîtier devient
       * l'interrupteur (vert = en marche, rouge = à l'arrêt). Un bouton de
       * moins dans la rangée, et le geste est celui d'un vrai appareil. */
      const led = sr.querySelector('.ac-led');
      if (led){
        led.title = 'Marche / arrêt';
        led.addEventListener('click', e => {
          e.stopPropagation();
          const s = this._hass && this._hass.states[this._config.entity];
          const cur = (s && s.state) || 'off';
          if (cur === 'off'){
            const modes = (s && s.attributes.hvac_modes) || [];
            const back = this._lastOnMode && modes.includes(this._lastOnMode)
                       ? this._lastOnMode
                       : (modes.find(m => m !== 'off') || 'cool');
            this._callService('set_hvac_mode', { hvac_mode: back });
          } else {
            this._lastOnMode = cur;
            this._callService('set_hvac_mode', { hvac_mode: 'off' });
          }
        });
      }

      /* La cible garde la pilule de la prod (avec ses −/+), et gagne EN PLUS le
       * geste de glissement : on ne perd ni les boutons ni le geste. Le scrub
       * est posé sur le centre pour ne pas voler leurs clics aux −/+. */
      const center = sr.querySelector('.pill-center');
      if (center) this._bindTargetScrub(center, sr.querySelector('.temp-pill'));
    }

    /* Réglage de la cible au GESTE, en plus des −/+ : on glisse sur la valeur
     * (14px = un cran) ou on utilise la molette — le geste de tous les
     * thermostats, plus rapide que de marteler un bouton. */
    _bindTargetScrub(tgt, pill){
      pill = pill || tgt;
      let acc = 0, active = false;
      const STEP_PX = 14;

      const down = e => {
        active = true; acc = 0;
        pill.classList.add('dragging');
        tgt.setPointerCapture && tgt.setPointerCapture(e.pointerId);
        e.stopPropagation(); e.preventDefault();
      };
      const move = e => {
        if (!active) return;
        acc += e.movementX || 0;
        while (Math.abs(acc) >= STEP_PX){
          this._adjustTemp(acc > 0 ? +1 : -1);
          acc -= Math.sign(acc) * STEP_PX;
        }
        e.stopPropagation();
      };
      const up = e => {
        if (!active) return;
        active = false;
        pill.classList.remove('dragging');
        e.stopPropagation();
      };

      tgt.addEventListener('pointerdown', down);
      tgt.addEventListener('pointermove', move);
      tgt.addEventListener('pointerup', up);
      tgt.addEventListener('pointercancel', up);
      // le clic ne doit pas remonter jusqu'au more-info de .ac-body
      tgt.addEventListener('click', e => e.stopPropagation());
      tgt.addEventListener('wheel', e => {
        e.preventDefault(); e.stopPropagation();
        this._adjustTemp(e.deltaY < 0 ? +1 : -1);
      }, { passive: false });
    }

    _applyColors(){
      // On laisse la prod colorer les chips : chaque mode garde sa teinte et son
      // fond, comme sur l'ancienne card. La hiérarchie ne passe plus par le gris
      // mais par la bordure 2px + le halo + le léger relief de l'actif.
      this._applyColorsBase();
      this._applySkin();
    }

    _update(){
      this._updateBase();
      this._applySkin();
    }

    /* Traduit l'état (mode, volet, vitesse, cible) en variables CSS. */
    _applySkin(){
      const sr = this.shadowRoot;
      const s  = this._hass && this._hass.states[this._config.entity];
      const attrs = (s && s.attributes) || {};
      const mode  = (s && s.state) || 'off';
      const P = this._flowParams();
      const color = this._modeColor(mode) || '#00fff9';
      // mémorisé pour que la LED rallume sur le mode d'avant, pas sur un défaut
      if (mode !== 'off') this._lastOnMode = mode;

      // Volet : 5 crans → 8° (presque fermé) à 55° (grand ouvert).
      const open = (Math.max(1, Math.min(5, P.louver)) - 1) / 4;
      sr.querySelectorAll('.louver').forEach((el, i) => {
        el.style.setProperty('--tilt', (8 + 47*open).toFixed(1) + 'deg');
        el.style.transitionDelay = (i * 0.06) + 's';
      });

      // Lèvre allumée ∝ vitesse, éteinte à l'arrêt.
      const body = sr.querySelector('.ac-body');
      if (body){
        const f = Math.max(1, Math.min(4, P.force));
        const lip = mode === 'off' ? 0 : (f >= 4 ? 0.70 : 0.30 + 0.28*(f-1));
        body.style.setProperty('--lip', lip.toFixed(2));
        body.style.setProperty('--lip-color', color);
      }

      /* Ventilation : une hélice qui SE REMPLIT par le bas, un tiers par cran.
       * La jauge est dans l'icône elle-même — pas de chiffre à décoder. AUTO
       * n'est pas une vitesse : l'hélice se remplit entièrement et "AUTO"
       * s'écrit à côté. Le _update() de la prod réécrit #fan-ico.textContent à
       * chaque rafraîchissement et détruit le SVG : on le (re)pose ICI, après
       * this._updateBase(), pas une fois pour toutes au build. */
      const fanIco = sr.getElementById('fan-ico');
      if (fanIco && this._svg && !fanIco.querySelector('svg')){
        fanIco.textContent = '';
        /* L'hélice mdi est trop ajourée pour servir de jauge : la remplir "au
         * tiers" ne découpe qu'une pale isolée, illisible. La vitesse passe donc
         * par trois barres montantes à côté de l'hélice — jauge classique, lue
         * d'un coup d'oeil. AUTO n'est pas une vitesse : on éteint les barres et
         * on écrit AUTO. */
        fanIco.appendChild(this._svg('0 0 36 24',
          '<path fill="currentColor" d="' + this._fanPath + '"/>' +
          '<g fill="currentColor">' +
            '<rect class="fan-bar" data-lvl="1" x="26"   y="16" width="2.4" height="6"  rx="1.2"/>' +
            '<rect class="fan-bar" data-lvl="2" x="29.6" y="12" width="2.4" height="10" rx="1.2"/>' +
            '<rect class="fan-bar" data-lvl="3" x="33.2" y="8"  width="2.4" height="14" rx="1.2"/>' +
          '</g>'));
      }
      const fanBtn = sr.getElementById('fan-cycle-btn');

      /* Boutons MACHINE : ils ne suivent PLUS la couleur du mode — ils prenaient
       * le bleu de COOL et la barre virait au monochrome triste. Ils tirent
       * maintenant leur couleur des « gaz rares & radiations » de Neo Tokyo, et
       * cette couleur MONTE avec le réglage : plus on pousse, plus ça irradie.
       *   ventilation : uranium (vaseline) → plutonium (toxique)
       *   volet       : cherenkov (réacteur) → plutonium à pleine ouverture   */
      const rgba = (c, a) => {
        const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(String(c).trim());
        if (!m) return c;
        return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${a})`;
      };
      const hex2 = c => {
        const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(String(c).trim());
        return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [255,255,255];
      };
      const mix = (a, b, t) => {
        const A = hex2(a), B = hex2(b);
        return '#' + A.map((v,i) => Math.round(v + (B[i]-v)*t)
          .toString(16).padStart(2,'0')).join('');
      };
      /* Les couleurs sont posees APRES this._setConfigBase() (voir setConfig) : au
       * tout premier _build() elles ne sont pas encore la. On retombe donc sur
       * les defauts plutot que de propager des undefined dans les styles. */
      const C = this._config || {};
      const URANIUM   = C.color_fan_lo   || COLOR_DEFAULTS.color_fan_lo;
      const PLUTONIUM = C.color_fan_hi   || COLOR_DEFAULTS.color_fan_hi;
      /* Volet : famille à part, sinon les deux boutons se ressemblent.
       * Xénon (bleu franc) → magnétique/plasma (bleu-violet) à pleine ouverture. */
      const XENON  = C.color_swing_lo || COLOR_DEFAULTS.color_swing_lo;
      const PLASMA = C.color_swing_hi || COLOR_DEFAULTS.color_swing_hi;

      /* La teinte est portée par le bouton ; l'intensité (t = 0..1) dit le
       * niveau. À l'arrêt tout retombe dans le gris de la card. */
      const tint = (el, hue, t) => {
        if (!el) return;
        const on = mode !== 'off';
        el.style.color       = on ? hue : 'rgba(184,184,255,0.35)';
        el.style.borderColor = on ? rgba(hue, 0.30 + 0.40*t) : 'rgba(184,184,255,0.16)';
        el.style.background  = on ? rgba(hue, 0.06 + 0.10*t) : 'transparent';
        el.style.boxShadow   = on && t > 0.5 ? `0 0 ${(6 + 10*t).toFixed(0)}px ${rgba(hue, 0.30*t)}` : 'none';
      };

      /* Jauge : 1, 2 ou 3 barres allumées. En AUTO aucun cran fixe n'a de sens
       * (la machine choisit en continu) : les barres se mettent à respirer en
       * cascade — c'est ça, "auto", sans avoir à l'écrire. */
      const fm     = String(attrs.fan_mode || '').toLowerCase();
      const isAuto = fm === 'auto';
      const lvl = mode === 'off' ? 0
                : isAuto ? 3
                : ({ low:1, min:1, quiet:1, silence:1,
                     medium:2, mid:2,
                     high:3, max:3, turbo:3 }[fm] ?? 2);
      sr.querySelectorAll('.fan-bar').forEach(b => {
        const on = +b.dataset.lvl <= lvl;
        b.style.opacity   = isAuto ? '' : (on ? '1' : '0.22');
        b.style.animation = isAuto
          ? `fan-auto 1.5s ease-in-out ${(+b.dataset.lvl - 1) * 0.18}s infinite`
          : 'none';
      });
      const fanLbl = sr.getElementById('fan-lbl');
      if (fanLbl) fanLbl.textContent = '';
      // AUTO = pleine intensité : la machine peut tout donner
      const fanT = isAuto ? 1 : (lvl ? (lvl - 1) / 2 : 0);
      tint(fanBtn, mix(URANIUM, PLUTONIUM, fanT), fanT);

      /* Volet : la latte de l'icône bascule, et le libellé donne l'ouverture en
       * pourcentage — 0% fermé → 100% ouvert — au lieu d'un "3/5" abstrait. */
      const slats = sr.querySelectorAll('.swing-slat');
      slats.forEach(el => { el.style.transform = `rotate(${(4 + 34*open).toFixed(1)}deg)`; });
      const air = sr.querySelector('.swing-air');
      if (air) air.style.opacity = (0.15 + 0.5*open).toFixed(2);
      const swLbl = sr.getElementById('swing-lbl');
      if (swLbl) swLbl.textContent = Math.round(open * 100) + '%';
      tint(this._swingBtn, mix(XENON, PLASMA, open), open);

      /* Cible : la prod remplit déjà .pill-value et colore la pilule, on ne
       * duplique pas son travail — on ne fait que l'éteindre en mode off. */
      const pill = sr.querySelector('.temp-pill');
      if (pill) pill.style.opacity = mode === 'off' ? 0.4 : 1;
    }

    _startWind(){
      const canvas = this.shadowRoot.querySelector('.wind-canvas');
      if (!canvas) return;

      if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
      if (this._windObserver) { this._windObserver.disconnect(); this._windObserver = null; }
      if (this._windVis) { this._windVis.disconnect(); this._windVis = null; }
      if (this._windDocVis) {
        document.removeEventListener('visibilitychange', this._windDocVis);
        this._windDocVis = null;
      }
      if (this._windMotionQuery && this._windMotionListener) {
        if (this._windMotionQuery.removeEventListener) this._windMotionQuery.removeEventListener('change', this._windMotionListener);
        else if (this._windMotionQuery.removeListener) this._windMotionQuery.removeListener(this._windMotionListener);
      }
      this._windMotionQuery = null;
      this._windMotionListener = null;
      if (this._windSolver && this._windSolver.dispose) this._windSolver.dispose();
      if (this._windLostSolver && this._windLostSolver.dispose) this._windLostSolver.dispose();
      this._windSolver = null;
      this._windLostSolver = null;
      this._windSolverToken = null;

      let solver = null, key = '';
      const motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      this._windMotionQuery = motionQuery;
      this._windReduced = !!(motionQuery && motionQuery.matches);
      this._windMotionListener = () => {
        this._windReduced = !!motionQuery.matches;
        if (this._windReduced) {
          this._windRun = false;
          if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
        } else if (this._windWake) {
          this._windWake();
        }
      };
      if (motionQuery) {
        if (motionQuery.addEventListener) motionQuery.addEventListener('change', this._windMotionListener);
        else if (motionQuery.addListener) motionQuery.addListener(this._windMotionListener);
      }

      const resize = () => {
        const lous   = this.shadowRoot.querySelectorAll('.louver');
        const wrap   = this.shadowRoot.querySelector('.wind-wrap');
        const acBody = this.shadowRoot.querySelector('.ac-body');
        if (!lous.length || !wrap || !acBody) return;

        const bodyR = acBody.getBoundingClientRect();
        const firstR = lous[0].getBoundingClientRect();
        const lastR  = lous[lous.length-1].getBoundingClientRect();
        if (!bodyR.width || !firstR.width) return;   // louvers fermés (mode off)

        /* Hauteur de flux sous la grille. Rabotée de 15px (60 → 45) : le bas du
         * panache était surtout du fondu au noir, on compacte la card sans
         * perdre de matière visible. Le fondu (flow_fade) est relatif à la
         * hauteur, il se resserre donc tout seul. */
        const RUNWAY = 45;
        /* Marge tampon AU-DESSUS de la latte haute. Emettre pile sur le bord de
         * la texture est un piege : l advection semi-lagrangienne remonte le
         * courant, tape le bord en CLAMP_TO_EDGE et re-echantillonne la source
         * elle-meme -> la teinte s accumule sans fin (moyenne 234/255 mesuree).
         * Quelques pixels de rab suffisent, et ils servent aussi de halo sur la
         * grille, ce que fait la reference. */
        const HEADROOM = 10;
        const topOffset = firstR.top - bodyR.top - HEADROOM;
        const grilleH   = lastR.bottom - firstR.top;
        const H = HEADROOM + grilleH + RUNWAY;
        const W = bodyR.width;

        this._ensureRoom(Math.round(RUNWAY - (bodyR.bottom - lastR.bottom)));

        wrap.style.top = topOffset + 'px';
        wrap.style.left = '0'; wrap.style.right = '0'; wrap.style.width = '100%';
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';

        /* Qualite du flux. MESURE (Pixel 8, Mali-G715, DPR 2.625) : a plafond 2,
         * le backing-store passe de 496x79 a 992x157, soit 4x plus de pixels a
         * simuler, et la luminosite moyenne du panache s'effondre de 47.8 a 15.6
         * — le flux devient "tres tres leger" alors que le GPU n'a aucun mal.
         * Plafonner le canvas a 1 device-pixel par pixel CSS remet donc l'ecran
         * fin dans la configuration exacte du PC : PLUS visible ET ~7x moins de
         * pixels a calculer. Le mode light n'est pas un repli degrade, c'est le
         * bon reglage pour un ecran dense.
         *   auto  : light des que l'ecran est dense (le cas iPad/Android)
         *   full  : plafond 2 (l'ancien comportement)
         *   light : plafond 1
         * Le rendu reste net : c'est un flou lumineux, pas du texte. */
        const q = this._flow.quality || 'auto';
        const rawDpr = window.devicePixelRatio || 1;
        const cap = q === 'full' ? 2 : q === 'light' ? 1 : (rawDpr > 1.5 ? 1 : 2);
        const dpr = Math.min(rawDpr, cap);
        const rw = Math.max(64, Math.round(W*dpr));
        const rh = Math.max(48, Math.round(H*dpr));

        // Géométrie de l'ouverture, EN PIXELS du backing-store, mesurée sur les
        // vraies lattes — c'est le point qui manquait entièrement en v1.
        const geom = {
          apX0: Math.round((firstR.left  - bodyR.left) * dpr),
          apX1: Math.round((firstR.right - bodyR.left) * dpr),
          // Depart du flux sur la latte du HAUT, comme la prod : le canvas
          // commence a firstR.top, donc la ligne d emission est a 0.
          apY:  Math.round(HEADROOM * dpr),
          // Une ordonnee par LATTE, mesuree sur les vraies .louver : les trois
          // lignes de la grille soufflent, pas seulement celle du haut.
          apYs: Array.from(lous).map(el => {
            const r = el.getBoundingClientRect();
            return Math.round((r.top + r.height*0.5 - firstR.top + HEADROOM) * dpr);
          }),
        };

        if (q === 'off') {
          if (solver && solver.dispose) solver.dispose();
          solver = null;
          this._windSolver = null;
          this._windSolverToken = null;
          canvas.style.opacity = '0';
          return;
        }

        const k = [rw, rh, geom.apX0, geom.apX1, geom.apY, geom.apYs.join(',')].join(':');
        if (solver && k === key) return;
        if (solver && solver.dispose) solver.dispose();
        solver = null;
        this._windSolver = null;
        this._windSolverToken = null;
        canvas.width = rw; canvas.height = rh;
        try {
          const created = window.setupFlowSolver(canvas, geom);
          solver = created;
          this._windSolver = created;
          this._windSolverToken = created;
          created.setContextHandlers(
            () => {
              if (this._windSolverToken !== created) return;
              this._windLostSolver = created;
              solver = null;
              this._windSolver = null;
              key = '';
              canvas.style.opacity = '0';
              this._windErr = 'contexte WebGL perdu';
            },
            () => {
              if (this._windSolverToken !== created || !this.isConnected) return;
              this._windLostSolver = null;
              solver = created;
              this._windSolver = created;
              canvas.style.opacity = '1';
              key = '';
              resize();
            }
          );
          canvas.style.opacity = '1';
          key = k;
          this._windErr = '';
        }
        catch (e){
          console.error('[neon-climate-webgl]', e); solver = null;
          this._windSolver = null;
          this._windSolverToken = null;
          canvas.style.opacity = '0';
          /* On RETIENT le message : dans la WebView de l'app mobile il n'y a
           * aucune console, et un solveur mort-ne y est indiscernable d'un
           * solveur qui tourne sans rien afficher. */
          this._windErr = 'creation: ' + String((e && e.message) || e);
        }
      };

      setTimeout(resize, 60);
      if (window.ResizeObserver){
        if (this._windObserver) this._windObserver.disconnect();
        this._windObserver = new ResizeObserver(resize);
        this._windObserver.observe(this.shadowRoot.querySelector('ha-card') || canvas.parentElement);
      }

      /* Mise en veille quand la card n'est pas regardee. Sans ca, la simulation
       * tourne en permanence — onglet en arriere-plan, autre vue du dashboard,
       * telephone dans la poche — pour un panache que personne ne voit. Sur
       * mobile c'est le poste de depense le plus betement gaspille.
       * On coupe le rAF au lieu de le laisser tourner a vide : une boucle qui
       * "return" tot reveille quand meme le GPU 60 fois par seconde. */
      /* L'etat de la boucle vit sur `this`, PAS dans une closure. Vecu : avec un
       * `let running` local, disconnectedCallback annulait bien le rAF mais ne
       * pouvait pas remettre le drapeau a false ; au retour dans le DOM, kick()
       * voyait running===true et ne relancait rien. Flux mort definitivement.
       * HA deplace les cards en permanence (masonry, changement de vue, app
       * mobile), donc ce chemin est la norme, pas un cas limite. */
      this._windRun = false;
      this._windOn  = true;
      this._windLastDraw = 0;
      const t0 = performance.now();

      const draw = () => {
        if (!this._windVisible() || this._flow.quality === 'off'){
          this._windRun = false; return;
        }
        this._animFrame = requestAnimationFrame(draw);
        /* Relire this._windSolver, PAS la variable locale `solver` : c'est elle
         * que disconnectedCallback() met a null au dispose. `solver` (fermeture
         * de _startWind) ne le sait jamais, donc un rAF deja planifie au moment
         * du dispose continuait a appeler step()/render() sur des objets GL deja
         * supprimes (cascade "attempt to use a deleted object" en console). */
        const active = this._windSolver;
        if (this._windMode === 'off' || !active) return;
        const now = performance.now();
        if (now - this._windLastDraw < 1000 / 30) return;
        this._windLastDraw = now;
        try {
          const P = this._flowParams();
          active.step((now-t0)/1000, P);
          active.render(P);
        } catch (e){
          console.error('[neon-climate-webgl]', e); solver = null;
          this._windSolver = null;
          this._windErr = 'rendu: ' + String((e && e.message) || e);
        }
      };

      /* Demarrage seul — idempotent, sans effet de bord sur les observateurs.
       * C'est ce que les observateurs appellent : les faire passer par _windWake
       * les ferait se recreer depuis leur propre callback, en boucle. */
      const kick = () => {
        if (!this._windRun && this._windVisible() && this._flow.quality !== 'off'){
          this._windRun = true; draw();
        }
      };

      /* Re-arme TOUT : observateurs + boucle. Appele a la construction et a
       * chaque retour dans le DOM — donc necessairement idempotent. */
      this._windWake = () => {
        if (!this.isConnected) return;
        /* Un observateur detache ne re-emet jamais : sans ce re-observe, _windOn
         * resterait fige sur sa derniere valeur (souvent false apres un
         * changement de vue) et le flux ne reviendrait plus. */
        if (this._windVis) this._windVis.disconnect();
        if (window.IntersectionObserver){
          this._windVis = new IntersectionObserver((es) => {
            this._windOn = es.some(e => e.isIntersecting); kick();
          }, { threshold: 0 });
          this._windVis.observe(canvas);
        } else {
          this._windOn = true;
        }
        if (this._windDocVis) document.removeEventListener('visibilitychange', this._windDocVis);
        this._windDocVis = kick;
        document.addEventListener('visibilitychange', this._windDocVis);
        kick();
      };

      this._windWake();
    }

    /* HA detruit et recree les cards a chaque changement de vue ou passage en
     * mode edition. Sans ce nettoyage, chaque cycle laissait derriere lui un
     * rAF, un ResizeObserver et (depuis la mise en veille) un ecouteur global
     * `visibilitychange` : au bout de quelques allers-retours, plusieurs
     * solveurs tournaient en parallele sur des canvas orphelins. */
    /* Deux conditions independantes : la card est-elle dans le viewport, et
     * l'onglet est-il au premier plan. */
    _windVisible(){ return this._windOn !== false && !this._windReduced && !document.hidden && this.isConnected; }

    /* Diagnostic embarque. Raison d'etre : l'app mobile HA affiche le dashboard
     * dans une WebView Android — moteur distinct de Chrome, mis a jour
     * separement, sans console ni devtools accessibles. Une page de test ouverte
     * dans Chrome n'y prouve donc rien. La card doit pouvoir dire elle-meme, sur
     * l'ecran ou elle echoue, pourquoi elle n'affiche rien. */

    disconnectedCallback(){
      this._cleanup();
      /* Remettre le drapeau a false est AUSSI important que d'annuler le rAF :
       * c'est lui qui autorise le redemarrage au reconnect. */
      this._windRun = false;
      if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
      if (this._windObserver){ this._windObserver.disconnect(); this._windObserver = null; }
      if (this._windVis){ this._windVis.disconnect(); this._windVis = null; }
      if (this._windDocVis){
        document.removeEventListener('visibilitychange', this._windDocVis);
        this._windDocVis = null;
      }
      if (this._windMotionQuery && this._windMotionListener) {
        if (this._windMotionQuery.removeEventListener) this._windMotionQuery.removeEventListener('change', this._windMotionListener);
        else if (this._windMotionQuery.removeListener) this._windMotionQuery.removeListener(this._windMotionListener);
        this._windMotionQuery = null;
        this._windMotionListener = null;
      }
      if (this._windSolver && this._windSolver.dispose) this._windSolver.dispose();
      if (this._windLostSolver && this._windLostSolver.dispose) this._windLostSolver.dispose();
      this._windSolver = null;
      this._windLostSolver = null;
      this._windSolverToken = null;
    }

    /* Au retour dans le DOM, la boucle a ete coupee par le disconnect : il faut
     * la relancer, sinon la card revient avec un flux fige. */
    connectedCallback(){

      if (this._windWake) this._windWake();
    }

    _flowParams(){
      const s     = this._hass && this._hass.states[this._config.entity];
      const attrs = (s && s.attributes) || {};
      const mode  = (s && s.state) || 'off';

      let rgb;
      if (this._flow.hue >= 0){
        rgb = hslToRgb(this._flow.hue, 0.85, 0.55);
      } else {
        const c = hexRgb(this._modeColor(mode) || '#00fff9');
        rgb = [c.r/255, c.g/255, c.b/255];
      }

      /* fan_mode et swing_mode sont deja des CRANS cote HA : on les mappe sur
       * les crans du solveur au lieu de les convertir en multiplicateurs
       * continus. Le debit de teinte suit maintenant la vitesse dans le
       * solveur lui-meme, il n y a plus rien a corriger ici. */
      const FAN_STEP = { low:1, medium:2, high:3, auto:4,
                         '1':1, '2':2, '3':3, quiet:1, silent:1, off:1 };
      const force = FAN_STEP[attrs.fan_mode] != null ? FAN_STEP[attrs.fan_mode] : this._flow.force;

      const SWING_STEP = { fully_closed:1, quarter_open:2, half_open:3,
                           three_quarters_open:4, fully_open:5 };
      const hasSwing = attrs.swing_modes && attrs.swing_modes.length && (attrs.swing_mode in SWING_STEP);
      const louver = hasSwing ? SWING_STEP[attrs.swing_mode] : this._flow.louver;

      return Object.assign({}, this._flow, { rgb, louver, force });
    }

    /* ── Socle card (ex-neon-climate-card) ──
     * Rapatrié de neon-climate-card.js : cette card est AUTONOME,
     * elle n'hérite plus de l'ancienne card CSS. */
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._hass       = null;
      this._config     = {};
      this._animFrame  = null;
      this._windCtx      = null;
      this._windSheets   = [];    // nappes volumétriques pleine largeur
      this._windWisps    = [];    // volutes fines, 1 par louver
      this._windParts    = [];    // particules d'air
      this._windSpd      = 1;     // multiplicateur vitesse (fan_mode)
      this._windOffscreen = false;
      this._windIO       = null;  // IntersectionObserver (pause hors écran)
      this._windLast     = 0;     // cap 30 fps
      this._windT        = 0;
      this._windColor    = null;
      this._windMode     = 'off';
      this._airFlowing   = true;  // pas de power_entity configuré = comportement mode-only
      this._windObserver = null;
      this._windW      = 300;
      this._windH      = 48;
      this._prevTemp   = null;
      this._prevHumid  = null;
    }
    _cleanup() {
      if (this._animFrame)    { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
      if (this._windObserver) { this._windObserver.disconnect(); this._windObserver = null; }
      if (this._windIO)       { this._windIO.disconnect();       this._windIO = null; }
    }
    getCardSize()             { return 4; }
    set hass(hass) { this._hass = hass; this._update(); }
    _modeColor(mode) {
      const map = {
        off:      this._config.color_off,
        heat:     this._config.color_heat,
        cool:     this._config.color_cool,
        dry:      this._config.color_dry,
        fan_only: this._config.color_fan,
      };
      return map[mode] || MODE_DEFAULTS[mode] || '#ffffff';
    }
    _neonHeaderCss() {
      const hdr = (this._config.header && typeof this._config.header === 'object') ? this._config.header : {};
      const color  = hdr.color       || 'var(--primary-color)';
      // Nombre nu ('20') -> 'px' ajoute : sinon injecte dans clamp()/calc() -> valeur
      // invalide, propriete entiere rejetee par le navigateur, taille retombe sur
      // l'heritage (plus petite). Cf Chris 22/08/26 : "j'ai mis 20 c'est plus petit".
      const size   = hdr.title_size
        ? (/^[\d.]+$/.test(String(hdr.title_size)) ? `${hdr.title_size}px` : hdr.title_size)
        : 'clamp(14px, 2vw, 16px)';
      // MEME recette que neon-markdown-card/neon-entities-card : aucune police citee
      // en tete ne depend d'un chargement externe (Google Fonts) sans filet local.
      const font = hdr.font
        ? `'${hdr.font}', var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)`
        : "var(--primary-font-family, 'Rajdhani', 'Share Tech Mono', sans-serif)";
      // Glow/gradient/flicker/typo : MEME moteur que neon-entities-card (copie du bloc
      // canonique documente dans la skill ha-neon-css §header canonique). Defauts
      // conserves identiques a avant (shadow 'none', uppercase force, spacing en dur)
      // quand les nouveaux champs ne sont pas renseignes -> pas de regression climate.
      const _neonGlow = (c, s) => {
        if (!c) return "";
        const sz = parseInt(s) || 10;
        return `text-shadow:0 0 ${Math.round(sz*0.2)}px #fff,0 0 ${Math.round(sz*0.4)}px ${c},0 0 ${Math.round(sz*0.8)}px ${c},0 0 ${sz}px ${c};`;
      };
      const hdrGlowColor = hdr.glow_color || 'var(--primary-color, #00E8FF)';
      const hdrGlowSize  = parseFloat(hdr.glow_size) || 12;
      const shadow = hdr.title_shadow
        ? hdr.title_shadow
        : hdr.glow
          ? _neonGlow(hdrGlowColor, hdrGlowSize).replace(/^text-shadow:/, '').replace(/;$/, '')
          : 'none';
      const hdrGradFrom = hdr.gradient_from || 'var(--primary-color, #00E8FF)';
      const hdrGradTo   = hdr.gradient_to   || 'var(--accent-color, #FF50A0)';
      const hdrGrad = hdr.gradient
        ? `background:linear-gradient(90deg,${hdrGradFrom},${hdrGradTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`
        : '';
      const hdrIconColor = hdr.icon_color || color;
      const hdrIconSize  = hdr.icon_size
        ? (/^[\d.]+$/.test(String(hdr.icon_size)) ? `${hdr.icon_size}px` : hdr.icon_size)
        : size;
      const hdrFlick = hdr.flicker
        ? `animation:nec-flicker ${this._flickDur || 3}s ease-in-out infinite ${this._flickOff || 0}s;`
        : '';
      const hdrWeight  = hdr.font_weight ?? 400;
      const hdrSpacing = hdr.letter_spacing || 'clamp(1px, 0.5cqi, 3px)';
      const hdrUpper   = hdr.uppercase === false ? 'none' : 'uppercase';
      const hdrItalic  = hdr.italic ? 'italic' : 'normal';
      const hdrIconGlow = hdr.glow
        ? `filter:drop-shadow(0 0 ${Math.round(hdrGlowSize*0.2)}px #fff) drop-shadow(0 0 ${Math.round(hdrGlowSize*0.4)}px ${hdrGlowColor}) drop-shadow(0 0 ${Math.round(hdrGlowSize*0.8)}px ${hdrGlowColor}) drop-shadow(0 0 ${hdrGlowSize}px ${hdrGlowColor});`
        : '';
      const badgeColor = hdr.badge_color || 'rgba(0,255,249,0.7)';
      return `
        .neon-hdr { display:flex; align-items:center; gap:8px; padding:11px 14px 8px; }
        .neon-hdr-icon { display:flex; align-items:center; flex-shrink:0; }
        .neon-hdr-icon ha-icon {
          --mdc-icon-size: ${hdrIconSize};
          color: ${hdrIconColor};
          filter: drop-shadow(0 0 8px color-mix(in srgb, currentColor, transparent 10%));
          ${hdrIconGlow}
          ${hdrFlick}
        }
        .neon-hdr-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:1px; }
        .neon-hdr-title {
          font-family: ${font};
          font-size: ${size};
          ${hdrGrad || `color: ${color};`}
          padding-left: 8px;
          font-weight: ${hdrWeight};
          font-style: ${hdrItalic};
          letter-spacing: ${hdrSpacing};
          text-transform: ${hdrUpper};
          text-shadow: ${shadow}; line-height: 1.2;
          white-space: nowrap; overflow: visible; text-overflow: ellipsis;
          ${hdrFlick}
        }
        .neon-hdr-subtitle {
          font-family: ${font};
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
        }
        .neon-main-div {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(98,0,234,0.55), rgba(0,255,249,0.25), transparent);
          margin: 0 14px 4px;
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
    _applyWindVisibility() {
      const wrap = this.shadowRoot.querySelector('.wind-wrap');
      const body = this.shadowRoot.querySelector('.ac-body');
      if (!wrap || !body) return;
      // visible seulement si config activée ET mode != off ET flux d'air réel
      // (puissance ≥ seuil si un power_entity est configuré, sinon mode seul)
      const configOn = this._config.show_wind;
      const modeOn   = this._windMode !== 'off';
      const show     = configOn && modeOn && this._airFlowing;
      wrap.classList.toggle('hidden', !show);
      body.classList.toggle('wind-on',  show);
      body.classList.toggle('wind-off', !show);
      if (!show && this._animFrame) {
        cancelAnimationFrame(this._animFrame);
        this._animFrame = null;
      } else if (show && !this._animFrame) {
        this._startWind();
      }
    }
    _setupFlicker() {
      this.shadowRoot.querySelectorAll('.mode-btn, .fan-btn').forEach(btn => {
        btn.style.setProperty('--flicker-dur',   (4.5 + Math.random() * 4).toFixed(2) + 's');
        btn.style.setProperty('--flicker-delay', -(Math.random() * 9).toFixed(2) + 's');
      });
    }
    _triggerGlitch(wrapperId, text) {
      const sr   = this.shadowRoot;
      const wrap = sr.getElementById(wrapperId);
      if (!wrap) return;
      // copier le texte dans les layers fantômes
      wrap.querySelectorAll('.g1, .g2').forEach(el => el.textContent = text);
      wrap.classList.remove('playing');
      // forcer reflow
      void wrap.offsetWidth;
      wrap.classList.add('playing');
      // nettoyer après l'anim
      setTimeout(() => wrap.classList.remove('playing'), 400);
    }
    _setupHandlers() {
      const sr = this.shadowRoot;
      sr.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () =>
          this._callService('set_hvac_mode', { hvac_mode: btn.dataset.mode })
        );
      });
      sr.querySelector('.temp-minus').addEventListener('click', () => this._adjustTemp(-1));
      sr.querySelector('.temp-plus').addEventListener('click',  () => this._adjustTemp(+1));
      const fanBtn = sr.getElementById('fan-cycle-btn');
      if (fanBtn) fanBtn.addEventListener('click', () => {
        const s = this._hass?.states[this._config.entity];
        if (!s) return;
        const modes   = s.attributes.fan_modes || [];
        const current = s.attributes.fan_mode  || '';
        const idx     = modes.indexOf(current);
        const next    = modes[(idx + 1) % modes.length];
        if (next) this._callService('set_fan_mode', { fan_mode: next });
      });

      sr.querySelector('.ac-body').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('hass-more-info', {
          detail: { entityId: this._config.entity },
          bubbles: true, composed: true,
        }));
      });
    }
    _adjustTemp(delta) {
      if (!this._hass) return;
      const s = this._hass.states[this._config.entity];
      if (!s) return;
      const min  = parseFloat(s.attributes.min_temp)         || 16;
      const max  = parseFloat(s.attributes.max_temp)         || 30;
      const step = parseFloat(s.attributes.target_temp_step) || 1;
      // mode range : target_temp_high/low présents, pas temperature
      if (s.attributes.target_temp_high !== undefined && s.attributes.temperature === undefined) {
        const hi = parseFloat(s.attributes.target_temp_high) || 20;
        const lo = parseFloat(s.attributes.target_temp_low)  || 20;
        const t  = Math.min(max, Math.max(min, hi + delta * step));
        this._callService('set_temperature', { target_temp_high: t, target_temp_low: Math.min(t, lo) });
      } else {
        const cur = parseFloat(s.attributes.temperature) || 20;
        this._callService('set_temperature', { temperature: Math.min(max, Math.max(min, cur + delta * step)) });
      }
    }
    _callService(svc, data) {
      if (!this._hass) return;
      this._hass.callService('climate', svc, { entity_id: this._config.entity, ...data });
    }
    _modeLabel(mode) {
      return { off:'OFF', heat:'HEAT', cool:'COOL', dry:'DRY', fan_only:'FAN' }[mode]
        || mode.toUpperCase();
    }
    _setWindMode(mode) {
      const c = {
        heat:     { r:255, g:45,  b:107 },
        cool:     { r:91,  g:124, b:255 },
        fan_only: { r:0,   g:255, b:170 },
        dry:      { r:0,   g:224, b:192 },
      };
      this._windColor = c[mode] || null;
      this._windMode  = mode;
    }
    _setConfigBase(config) {
      if (!config.entity) throw new Error("neon-climate-card: 'entity' requis");
      // classe low-power posée ici (PAS dans le constructor : interdit de toucher
      // aux attributs/classes du host au constructor → NotSupportedError).
      if (NCC_IS_LOW_POWER) this.classList.add('low-power');
      this._cleanup();
      this._config = {
        entity:          config.entity,
        name:            config.name            || null,
        humidity_entity: config.humidity_entity || null,
        show_wind:       config.show_wind !== false,
        power_entity:    config.power_entity    || null,
        power_threshold: config.power_threshold != null ? parseFloat(config.power_threshold) : 10,
        // couleurs overridables
        color_off:       config.color_off       || MODE_DEFAULTS.off,
        color_heat:      config.color_heat      || MODE_DEFAULTS.heat,
        color_cool:      config.color_cool      || MODE_DEFAULTS.cool,
        color_dry:       config.color_dry       || MODE_DEFAULTS.dry,
        color_fan:       config.color_fan       || MODE_DEFAULTS.fan_only,
        color_pill:      config.color_pill      || PILL_DEFAULT,
        color_fan_btn:   config.color_fan_btn   || '#00FFAA',
        color_display:   config.color_display   || '#00fff9',  // couleur dot-matrix display AC
        neon_display_glow: config.neon_display_glow !== false,   // triple text-shadow ON/OFF
        header: config.header !== undefined ? config.header : {},
      };
      this._build();
    }
    _buildBase() {
      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

          :host {
            display: block;
            font-family: 'Orbitron', var(--primary-font-family, 'Rajdhani', system-ui, sans-serif);
            border-radius: var(--ha-card-border-radius, 18px);
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          ha-card {
            background: var(--ha-card-background);
            border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, rgba(98,0,234,0.38));
            border-radius: var(--ha-card-border-radius, 18px);
            box-shadow: var(--ha-card-box-shadow,
              0 4px 28px rgba(0,0,0,0.70),
              0 0 18px rgba(180,0,255,0.12),
              inset 0 1px 0 rgba(255,255,255,0.06)
            );
            overflow: hidden;
          }
          .card {
            padding: 14px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }

          /* modes row */
          .modes-row   { display:flex; flex-wrap:wrap; gap:5px; align-items:stretch; }
          .modes-group { display:flex; gap:4px; align-items:stretch; flex:0 0 auto; min-width:0; }
          .pill-wrap   { flex:1 1 110px; min-width:110px; display:flex; align-items:stretch; }

          /* mode buttons — couleurs via JS inline style */
          .mode-btn {
            background: transparent;
            border-radius: 8px;
            font-family: 'Orbitron', var(--primary-font-family, sans-serif);
            font-size: 8px;
            letter-spacing: 1px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 5px 4px;
            transition: box-shadow .2s, background .2s, border-color .2s;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            border: 1px solid transparent;
          }
          .mode-btn .ico { font-size: 14px; line-height: 1; }

          @keyframes flicker {
            0%,100% { opacity:1; }
            91%  { opacity:1; }
            92%  { opacity:0.5; }
            93%  { opacity:1; }
            95%  { opacity:0.72; }
            96%  { opacity:1; }
          }
          .mode-btn, .fan-btn { animation: flicker var(--flicker-dur,6s) var(--flicker-delay,0s) infinite; }

          /* LOW_POWER : coupe le flicker (animation décorative en boucle) sur iPad/mobile.
             Via classe .low-power posée en JS (userAgent) — fiable en paysage, contrairement
             aux @media largeur/hauteur. + garde reduced-motion. */
          :host(.low-power) .mode-btn, :host(.low-power) .fan-btn { animation: none !important; }
          @media (prefers-reduced-motion: reduce) {
            .mode-btn, .fan-btn { animation: none !important; }
          }

          /* pill — couleurs via JS inline style */
          .temp-pill {
            width: 100%;
            display: flex;
            align-items: center;
            border-radius: 24px;
            overflow: hidden;
            border: 2px solid transparent;
          }
          .temp-pill button {
            background: transparent;
            border: none;
            font-size: 18px;
            font-family: inherit;
            cursor: pointer;
            padding: 0;
            width: 32px;
            flex-shrink: 0;
            align-self: stretch;
            line-height: 1;
            -webkit-tap-highlight-color: transparent;
            transition: background .15s;
          }
          .pill-center { flex:1; text-align:center; padding:3px 0; }
          .pill-label  { font-size:7px; letter-spacing:1.5px; font-family:'Orbitron',var(--primary-font-family,sans-serif); }
          .pill-value  { font-size:15px; font-weight:500; line-height:1.15; font-family:'Orbitron',var(--primary-font-family,sans-serif); }

          /* fan mode button */
          .fan-btn {
            background: transparent;
            border: 1px solid rgba(0,255,170,0.30);
            border-radius: 8px;
            font-family: 'Orbitron', var(--primary-font-family, sans-serif);
            font-size: 8px;
            letter-spacing: 1px;
            color: rgba(0,255,170,0.55);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 5px 4px;
            transition: box-shadow .2s, background .2s, border-color .2s, color .2s;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            min-width: 36px;
          }
          .fan-btn .ico { font-size: 14px; line-height: 1; }
          .fan-btn.fan-active {
            color: #00FFAA;
            border-color: rgba(0,255,170,0.9);
            background: rgba(0,255,170,0.12);
            box-shadow: 0 0 14px rgba(0,255,170,0.40);
          }

          /* AC body */
          .ac-body {
            background: #0a0f1e;
            border: 1px solid rgba(184,184,255,0.22);
            border-radius: 8px 8px 14px 14px;
            padding: 8px 14px 10px;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.65);
            flex-shrink: 0;
            cursor: pointer;
            position: relative;
            overflow: visible;
            z-index: 1;
          }
          /* espace réservé sous ac-body quand wind visible */
          .ac-body.wind-on { margin-bottom: 0px !important; transition: margin-bottom .4s ease; }
          .ac-body.wind-off { margin-bottom: 0; transition: margin-bottom .4s ease; }
          .ac-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
          .ac-name   { font-size:7px; color:rgba(184,184,255,0.45); letter-spacing:2px; font-family:'Orbitron',var(--primary-font-family,sans-serif); }
          .ac-led    { width:6px; height:6px; border-radius:50%; background:#00FFAA; box-shadow:0 0 8px #00FFAA,0 0 14px rgba(0,255,170,0.4); transition:background .5s,box-shadow .5s; }
          .ac-led.off { background:#1a2238; box-shadow:none; }

          .ac-display {
            background: radial-gradient(circle at 50% 45%,
              color-mix(in srgb, var(--display-color, #00fff9) 14%, #060a17) 0%,
              color-mix(in srgb, var(--display-color, #00fff9) 3%, #03050d) 70%,
              #020307 100%
            );
            border: 1px solid color-mix(in srgb, var(--display-color, #00fff9) 35%, transparent);
            border-radius: 6px;
            padding: 6px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            box-shadow:
              inset 0 0 15px color-mix(in srgb, var(--display-color, #00fff9) 18%, transparent),
              inset 0 0 4px color-mix(in srgb, var(--display-color, #00fff9) 30%, transparent),
              0 0 10px color-mix(in srgb, var(--display-color, #00fff9) 8%, transparent);
            position: relative;
            overflow: hidden;
            z-index: 10;
            container-type: inline-size;
            container-name: acdisplay;
          }
          .display-col       { display:flex; flex-direction:column; align-items:center; }
          .display-col.left  { align-items:flex-start; }
          .display-col.right { align-items:flex-end; }
          .display-label {
            font-size: 8px;
            color: rgba(0,255,249,0.45);
            letter-spacing: 2px;
            margin-bottom: 1px;
            font-family: 'Orbitron', var(--primary-font-family, sans-serif);
          }
          .display-value {
            font-family: 'Orbitron', var(--primary-font-family, sans-serif);
            font-size: clamp(13px, 6cqi, 26px);
            color: ${this._config.neon_display_glow !== false ? '#fff' : 'var(--display-color, #00fff9)'};
            letter-spacing: clamp(1px, 0.6cqi, 3px);
            font-weight: 700;
            line-height: 1;
            white-space: nowrap;
            text-shadow: ${this._config.neon_display_glow !== false
              ? `0 0 3px color-mix(in srgb, var(--display-color, #00fff9) 60%, white),
                 0 0 12px var(--display-color, #00fff9),
                 0 0 28px color-mix(in srgb, var(--display-color, #00fff9) 55%, transparent),
                 0 0 55px color-mix(in srgb, var(--display-color, #00fff9) 25%, transparent)`
              : `0 0 8px var(--display-color, #00fff9), 0 0 20px color-mix(in srgb, var(--display-color, #00fff9) 40%, transparent)`
            };
            transition: color 0.3s, text-shadow 0.3s;
          }
          .display-value.sm { font-size: clamp(11px, 5cqi, 22px); letter-spacing: clamp(0.5px, 0.4cqi, 2px); white-space: nowrap; }
          .display-sep { width:1px; height:36px; background:rgba(0,255,249,0.15); flex-shrink:0; }

          .louvers { display:flex; flex-direction:column; gap:3px; margin-top:7px; overflow:hidden; }
          .louver {
            height: 3px;
            background: rgba(184,184,255,0.12);
            border-radius: 2px;
            transform-origin: top center;
            transition: height .5s ease, opacity .5s ease, margin .5s ease;
          }
          .louver:nth-child(2) { opacity:.8; transition-delay:.06s; }
          .louver:nth-child(3) { opacity:.55; transition-delay:.12s; }
          /* fermé */
          .louvers.closed .louver          { height:0; opacity:0; margin:0; }
          .louvers.closed .louver:nth-child(2) { transition-delay:.04s; }
          .louvers.closed .louver:nth-child(3) { transition-delay:0s; }

          /* glitch */
          @keyframes glitch {
            0%   { clip-path:inset(0 0 95% 0); transform:translate(-3px,0) skewX(-2deg); opacity:1; }
            10%  { clip-path:inset(30% 0 50% 0); transform:translate(3px,0) skewX(2deg); }
            20%  { clip-path:inset(60% 0 20% 0); transform:translate(-2px,0); }
            30%  { clip-path:inset(10% 0 80% 0); transform:translate(2px,0) skewX(-1deg); }
            40%  { clip-path:inset(70% 0 5% 0);  transform:translate(-1px,0); }
            50%  { clip-path:inset(40% 0 40% 0); transform:translate(3px,0); }
            60%  { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; }
            100% { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; }
          }
          @keyframes glitch2 {
            0%   { clip-path:inset(50% 0 30% 0); transform:translate(4px,0) skewX(3deg); opacity:.7; color:#ff006e; }
            15%  { clip-path:inset(20% 0 60% 0); transform:translate(-4px,0); color:#00fff9; }
            30%  { clip-path:inset(80% 0 5% 0);  transform:translate(2px,0); color:#ff006e; }
            50%  { clip-path:inset(0 0 90% 0);   transform:translate(-2px,0); }
            70%  { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; color:#00fff9; }
            100% { clip-path:inset(0 0 0 0);     transform:translate(0,0); opacity:1; color:#00fff9; }
          }
          .glitch-wrap { position:relative; display:inline-block; }
          .glitch-wrap .g1,
          .glitch-wrap .g2 {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            pointer-events: none;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            letter-spacing: inherit;
            line-height: inherit;
            text-shadow: none;
          }
          .glitch-wrap.playing .g1 { animation: glitch  0.35s steps(1) forwards; }
          .glitch-wrap.playing .g2 { animation: glitch2 0.35s steps(1) forwards 0.04s; }

          /* wind — sort des louvers, position absolute sous ac-body */
          .wind-wrap {
            position: absolute;
            top: 100%;
            margin-top: -3px;
            left: 0;
            right: 0;
            height: 50px;
            z-index: 30;
            pointer-events: none;
            display: flex;
            justify-content: center;
          }
        
          .wind-wrap.hidden {
            opacity: 0;
            height: 0;
            pointer-events: none;
          }
          .wind-canvas { 
            display: block; 
            /* PAS de contrast() ici : Chrome filtre en alpha prémultiplié et
             * écrase les traits translucides (invisible PC/Android). saturate
             * garde le punch néon sans tuer l'alpha. */
            filter: blur(2.5px) saturate(170%) brightness(1.9);
            mix-blend-mode: screen;
          }

          /* responsive iPad */
          @media (min-width:600px) {
            .card { padding:16px; gap:12px; }
            .mode-btn { font-size:9px; padding:6px 6px; }
            .mode-btn .ico { font-size:15px; }
            .pill-value { font-size:20px; }
            .wind-wrap { height:58px; bottom:-58px; }
            .ac-body.wind-on { margin-bottom:58px; }
          }
          @media (min-width:1100px) {
            .wind-wrap { height:66px; bottom:-66px; }
            .ac-body.wind-on { margin-bottom:66px; }
          }
          /* iPad landscape ≤ 1100px : display plus compact */
          @media (max-width:1100px) and (orientation:landscape) {
            .ac-display { gap:4px; padding:5px 8px; }
            .display-sep { height:28px; }
          }
        ${this._neonHeaderCss()}
        </style>

        <ha-card>
          ${this._buildNeonHeader()}
          <div class="card">

            <div class="modes-row">
              <div class="modes-group">
                <button class="mode-btn" data-mode="off"><span class="ico">⏻</span>OFF</button>
                <button class="mode-btn" data-mode="heat"><span class="ico">🔥</span>HEAT</button>
                <button class="mode-btn" data-mode="cool"><span class="ico">❄</span>COOL</button>
                <button class="mode-btn" data-mode="dry"><span class="ico">💧</span>DRY</button>
                <button class="mode-btn" data-mode="fan_only"><span class="ico">〜</span>FAN</button>
                <button class="fan-btn" id="fan-cycle-btn" style="display:none"><span class="ico" id="fan-ico">💨</span><span id="fan-lbl">AUTO</span></button>
              </div>
              <div class="pill-wrap">
                <div class="temp-pill">
                  <button class="temp-minus" aria-label="Diminuer">−</button>
                  <div class="pill-center">
                    <div class="pill-label">CIBLE</div>
                    <div class="pill-value">--°</div>
                  </div>
                  <button class="temp-plus" aria-label="Augmenter">+</button>
                </div>
              </div>
            </div>

            <div class="ac-body">
              <div class="ac-header">
                <span class="ac-name">CLIM</span>
                <div class="ac-led off"></div>
              </div>
              <div class="ac-display">
                <div class="display-col left">
                  <div class="display-label">ROOM</div>
                  <div class="display-value">
                    <div class="glitch-wrap" id="gw-temp">
                      <span class="val room-temp">--°C</span>
                      <span class="g1 room-temp-g1"></span>
                      <span class="g2 room-temp-g2"></span>
                    </div>
                  </div>
                </div>
                <div class="display-sep"></div>
                <div class="display-col">
                  <div class="display-label">HUMID</div>
                  <div class="display-value">
                    <div class="glitch-wrap" id="gw-humid">
                      <span class="val room-humid">--%</span>
                      <span class="g1 room-humid-g1"></span>
                      <span class="g2 room-humid-g2"></span>
                    </div>
                  </div>
                </div>
                <div class="display-sep"></div>
                <div class="display-col right">
                  <div class="display-label">MODE</div>
                  <div class="display-value sm mode-label">--</div>
                </div>
              </div>
              <div class="louvers">
                <div class="louver"></div>
                <div class="louver"></div>
                <div class="louver"></div>
              </div>
              <div class="wind-wrap">
                <canvas class="wind-canvas"></canvas>
              </div>
            </div>

          </div>
        </ha-card>
      `;

      this._setupHandlers();
      this._setupFlicker();
      this._applyColors();
      this._startWind();
      this._applyWindVisibility();
    }
    _applyColorsBase() {
      const sr   = this.shadowRoot;
      const pill    = this._config.color_pill;
      // Couleur display = mode courant (teinte dynamique) ou fallback config
      const entity  = this._hass?.states[this._config.entity];
      const curMode = entity?.state || 'off';
      const display = this._modeColor(curMode) || this._config.color_display || '#00fff9';

      // Injecter la couleur display comme CSS var sur ha-card ET ac-display
      const haCard = sr.querySelector('ha-card');
      if (haCard) haCard.style.setProperty('--display-color', display);

      // Labels et séparateurs
      sr.querySelectorAll('.display-label').forEach(el => {
        el.style.color = `${display}CC`;
      });
      sr.querySelectorAll('.display-sep').forEach(el => {
        el.style.background = `${display}25`;
      });
      const disp = sr.querySelector('.ac-display');
      if (disp) disp.style.setProperty('--display-color', display);
      // Glitch layers héritent de la couleur
      ['room-temp-g1','room-temp-g2','room-humid-g1','room-humid-g2'].forEach(cls => {
        const el = sr.querySelector(`.${cls}`);
        if (el) el.style.color = display;
      });

      // pill
      const tp = sr.querySelector('.temp-pill');
      if (tp) {
        tp.style.borderColor  = rgba(pill, 0.85);
        tp.style.boxShadow    = `0 0 12px ${rgba(pill, 0.22)}`;
        tp.style.background   = rgba(pill, 0.10);
      }
      sr.querySelectorAll('.temp-pill button').forEach(b => b.style.color = pill);
      const pv = sr.querySelector('.pill-value');
      if (pv) { pv.style.color = pill; pv.style.textShadow = `0 0 10px ${rgba(pill, 0.65)}`; }
      const pl = sr.querySelector('.pill-label');
      if (pl) pl.style.color = rgba(pill, 0.7);

      // boutons mode
      sr.querySelectorAll('.mode-btn').forEach(btn => {
        const mode  = btn.dataset.mode;
        const color = this._modeColor(mode);
        const isActive = btn.classList.contains('active');
        btn.style.color       = color;
        btn.style.borderColor = rgba(color, isActive ? 1 : 0.60);
        btn.style.borderWidth = isActive ? '2px' : '1px';
        btn.style.background  = rgba(color, isActive ? 0.16 : 0.07);
        btn.style.boxShadow   = isActive ? `0 0 14px ${rgba(color, 0.45)}` : 'none';
      });
    }
    _updateBase() {
      if (!this._hass || !this._config.entity) return;
      const sr = this.shadowRoot;
      if (!sr.querySelector('.card')) return;

      const state = this._hass.states[this._config.entity];
      if (!state) return;

      const mode    = state.state;
      const attrs   = state.attributes;
      const target  = attrs.temperature != null ? attrs.temperature
                  : attrs.target_temp_high != null ? attrs.target_temp_high : '--';
      const ambient = attrs.current_temperature != null ? attrs.current_temperature : '--';
      const name    = this._config.name || attrs.friendly_name || 'CLIM';

      let humid = '--';
      if (this._config.humidity_entity) {
        const hs = this._hass.states[this._config.humidity_entity];
        if (hs) humid = parseFloat(hs.state).toFixed(1);
      } else if (attrs.current_humidity != null) {
        humid = parseFloat(attrs.current_humidity).toFixed(1);
      }

      const tempStr  = ambient !== '--' ? `${ambient}°C` : '--°C';
      const humidStr = humid   !== '--' ? `${humid}%`    : '--%';

      // glitch si valeur change
      if (this._prevTemp  !== null && this._prevTemp  !== tempStr)  this._triggerGlitch('gw-temp',  tempStr);
      if (this._prevHumid !== null && this._prevHumid !== humidStr) this._triggerGlitch('gw-humid', humidStr);
      this._prevTemp  = tempStr;
      this._prevHumid = humidStr;

      sr.querySelector('.ac-name').textContent    = name.toUpperCase();
      sr.querySelector('.room-temp').textContent  = tempStr;
      sr.querySelector('.room-humid').textContent = humidStr;
      sr.querySelector('.mode-label').textContent = this._modeLabel(mode);
      sr.querySelector('.pill-value').textContent = target !== '--' ? `${target}°` : '--°';

      sr.querySelector('.ac-led').classList.toggle('off', mode === 'off');
      sr.querySelector('.louvers').classList.toggle('closed', mode === 'off');

      sr.querySelectorAll('.mode-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.mode === mode)
      );

      // fan mode — bouton cycle
      const fanModes  = attrs.fan_modes;
      const fanMode   = attrs.fan_mode || '';
      const fanCycleBtn = sr.getElementById('fan-cycle-btn');
      if (fanCycleBtn) {
        const hasFan = !!(fanModes && fanModes.length);
        this._windSpd = ({ quiet:0.45, silence:0.45, low:0.6, min:0.6, medium:1, mid:1, auto:1, high:1.6, max:1.8, turbo:1.8 })[String(fanMode).toLowerCase()] ?? 1;
        fanCycleBtn.style.display = hasFan ? '' : 'none';
        if (hasFan) {
          const FAN_ICO = { off:'⏻', low:'🌬', medium:'💨', high:'🌪', auto:'♾' };
          const ico   = FAN_ICO[fanMode] || '💨';
          const lbl   = fanMode.toUpperCase().slice(0, 4);
          const col   = this._config.color_fan_btn;
          const active = fanMode !== 'off';
          sr.getElementById('fan-ico').textContent = ico;
          sr.getElementById('fan-lbl').textContent = lbl;
          fanCycleBtn.classList.toggle('fan-active', active);
          fanCycleBtn.style.color       = active ? col : `${col}88`;
          fanCycleBtn.style.borderColor = active ? col : `${col}44`;
          fanCycleBtn.style.background  = active ? `${col}1e` : 'transparent';
          fanCycleBtn.style.boxShadow   = active ? `0 0 14px ${col}66` : 'none';
        }
      }

      // flux d'air réel : si un capteur de puissance est configuré, l'anim ne
      // joue que si la puissance dépasse le seuil (compresseur/ventilo actifs),
      // pas juste si hvac_mode != off (cf Shelly clim chambre : ON mais idle < 10W)
      if (this._config.power_entity) {
        const ps = this._hass.states[this._config.power_entity];
        const power = ps ? parseFloat(ps.state) : NaN;
        this._airFlowing = !isNaN(power) && power >= this._config.power_threshold;
      } else {
        this._airFlowing = true;
      }

      this._applyColors();
      this._setWindMode(mode);
      this._applyWindVisibility();
    }
  }

  function hslToRgb(h, s, l){
    h = ((h % 360) + 360) % 360 / 360;
    const hue2 = (p,q,t) => { if(t<0)t+=1; if(t>1)t-=1;
      if(t<1/6) return p+(q-p)*6*t; if(t<1/2) return q;
      if(t<2/3) return p+(q-p)*(2/3-t)*6; return p; };
    if (s === 0) return [l,l,l];
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    return [hue2(p,q,h+1/3), hue2(p,q,h), hue2(p,q,h-1/3)];
  }

  /* #rgb / #rrggbb -> composantes. La prod garde son helper pour elle (portee
   * de module), on refait le notre : 6 lignes contre une dependance fragile. */
  function hexRgb(hex){
    let h = String(hex).trim().replace(/^#/, '');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    const n = parseInt(h, 16);
    if (h.length !== 6 || isNaN(n)) return { r:0, g:255, b:249 };
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }

  /* ── Éditeur ─────────────────────────────────────────────────────────────────
   * Dérive de l'éditeur de la prod : tout le cycle de vie (_read/_set/_syncValues,
   * config-changed, guard focus) est hérité tel quel. On ne surcharge que _schema,
   * qui est justement « LA SEULE PARTIE SPÉCIFIQUE À LA CARD » d'après la prod, et
   * on ajoute _slider — la prod n'avait aucun champ numérique.        */

  /* Métadonnées des 19 réglages, reprises du banc : bornes, pas, et la note qui
   * dit à quoi sert le curseur. Sans elles l'éditeur afficherait 19 champs
   * numériques anonymes. */
  const FLOW_META = [
    ['count',        2,   20,  1,    0, 'nombre de fentes — un faisceau par fente'],
    ['fan',          0,   80,  1,    0, 'évasement total du souffle, en degrés'],
    ['wobble',       0,   1,   0.01, 2, 'oscillation latérale des faisceaux'],
    ['speed',        0,   3,   0.05, 2, 'vitesse de cette oscillation'],
    ['taper',        0.5, 5,   0.05, 2, 'finesse du jet — au-dessus de 1, les faisceaux se séparent'],
    ['alpha',        0,   1.5, 0.01, 2, 'exposition générale du flux'],
    ['glow',         0,   1.5, 0.01, 2, 'halo autour des faisceaux'],
    ['smoke',        0,   6,   0.01, 2, 'débit de teinte — multiplié par la vitesse de ventilation'],
    ['smoke_scale',  0,   30,  0.5,  1, 'décalage des bouffées d\'une fente à l\'autre'],
    ['smoke_speed',  0,   3,   0.05, 2, 'cadence des bouffées'],
    ['hue',          -1,  360, 1,    0, '-1 = teinte reprise du mode (froid bleu, chaud rouge…)'],
    ['louver',       1,   5,   1,    0, 'position du volet — utilisée SEULEMENT si l\'entité n\'a pas de swing_mode'],
    ['force',        1,   4,   1,    0, 'vitesse ventilateur — utilisée SEULEMENT si l\'entité n\'a pas de fan_mode'],
    ['curl',         0,   60,  1,    0, 'vorticité — turbulence dans le flux'],
    ['v_dissip',     0.05, 4,  0.05, 2, 'dissipation de la vélocité'],
    ['d_dissip',     0.05, 4,  0.05, 2, 'dissipation de la teinte'],
    ['sparkle',      0,   3,   0.05, 2, 'densité des poussières en suspension'],
    ['sparkle_size', 0.5, 8,   0.1,  1, 'taille des poussières'],
    ['fade',         0.05, 1,  0.01, 2, 'hauteur du fondu au noir en bas du flux'],
  ];

  class NeonClimateCardWebglEditor extends HTMLElement {

    /* Curseur + valeur lue à droite. Le champ est retiré de la config quand il
     * vaut le défaut (via _set, qui supprime sur chaîne vide) : le YAML ne se
     * remplit que des réglages réellement touchés. */
    _slider(key, label, min, max, step, dec, dflt, note) {
      const w = this._row(label).wrap;
      const box = document.createElement('div');
      box.style.cssText = 'display:flex;align-items:center;gap:8px;width:100%;';

      const r = document.createElement('input');
      r.type = 'range'; r.min = min; r.max = max; r.step = step;
      r.dataset.key = key;
      const cur = this._read(key);
      r.value = (cur == null || cur === '') ? dflt : cur;
      r.style.cssText = 'flex:1 1 auto;min-width:0;accent-color:var(--primary-color);cursor:pointer;';

      const out = document.createElement('span');
      out.style.cssText = 'flex:none;width:52px;text-align:right;font-variant-numeric:tabular-nums;' +
                          'font-size:12px;color:var(--secondary-text-color);';
      const show = () => { out.textContent = parseFloat(r.value).toFixed(dec); };
      show();

      r.addEventListener('input', () => {
        show();
        // au défaut → on retire la clé plutôt que d'écrire une valeur redondante
        this._set(key, parseFloat(r.value) === dflt ? '' : parseFloat(r.value));
      });

      // remettre au défaut : double-clic sur la valeur
      out.title = 'Double-clic : revenir au défaut';
      out.style.cursor = 'pointer';
      out.addEventListener('dblclick', () => { r.value = dflt; show(); this._set(key, ''); });

      box.appendChild(r); box.appendChild(out); w.appendChild(box);
      if (note) this._hint(note);
      return r;
    }

    /* Liste deroulante — le seul reglage de flux qui ne soit pas un nombre.
     * Comme les curseurs : la valeur par defaut n'est pas ecrite dans le YAML. */
    _select(key, label, options, dflt, note) {
      const w = this._row(label).wrap;
      const s = document.createElement('select');
      s.style.cssText = 'width:100%;padding:6px 8px;border-radius:6px;cursor:pointer;' +
                        'background:var(--secondary-background-color);color:var(--primary-text-color);' +
                        'border:1px solid var(--divider-color);';
      options.forEach(opt => {
        // accepte une string nue (ex: NEON_FONTS) ou un tuple [valeur, libellé] (ex: flow_quality)
        const [v, lbl] = Array.isArray(opt) ? opt : [opt, opt];
        const o = document.createElement('option');
        o.value = v; o.textContent = lbl; s.appendChild(o);
      });
      const cur = this._read(key);
      s.value = (cur == null || cur === '') ? dflt : cur;
      s.addEventListener('change', () => this._set(key, s.value === dflt ? '' : s.value));
      w.appendChild(s);
      if (note) this._hint(note);
      return s;
    }

    _schema() {
      // tout le schéma de la prod (en-tête, entités, couleurs de mode, display…)
      this._schemaBase();

      this._section('Flux d\'air (WebGL)');
      this._select('flow_quality', 'Qualité', [
        ['auto',  'Auto — léger sur écran dense (recommandé)'],
        ['full',  'Complet — canvas jusqu\'à 2×'],
        ['light', 'Léger — canvas 1×, moins gourmand'],
        ['off',   'Désactivé — aucune animation'],
      ], 'auto', 'Sur mobile (écran dense), « léger » rend le flux PLUS visible et ~7× moins coûteux : ' +
                 'à 2× la même matière est diluée sur 4× plus de pixels. L\'animation se met aussi en ' +
                 'veille dès que la card sort de l\'écran.');
      this._group('Réglages fins du flux (19 paramètres)', false, () => {
        this._hint('Défauts = réglages validés au banc. Double-clic sur une valeur pour y revenir.');
        FLOW_META.forEach(([k, min, max, step, dec, note]) => {
          this._slider('flow_' + k, k, min, max, step, dec, FLOW_DEFAULTS[k], note);
        });
      });
    }

    /* ── Socle éditeur (ex-neon-climate-card-editor) ──
     * Rapatrié de neon-climate-card.js : cette card est AUTONOME,
     * elle n'hérite plus de l'ancienne card CSS. */
    constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }
    /* HA appelle .setConfig() sur l'élément retourné par getConfigElement() — sans cet alias
     * public, _setConfigBase() ne se déclenche jamais et l'éditeur reste vide (bug constaté le
     * 24/08/26 : DOM <neon-climate-card-webgl-editor></...> sans aucun enfant, pas d'erreur
     * console car HA ne fait qu'ignorer l'absence de la méthode). */
    setConfig(c) { this._setConfigBase(c); }
    disconnectedCallback() { this._disconnectedBase(); }
    _setConfigBase(c) {
      this._config = { ...(c || {}) };
      if (!this._rendered) { this._rendered = true; this._render(); }
      else this._syncValues();
    }
    set hass(h) { this._hass = h; this._fillDatalists(); }   // JAMAIS de render ici
    _disconnectedBase() { this._rendered = false; }
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
        if (el.type === 'checkbox') el.checked = el.dataset.defaultOn ? (v !== false) : !!v;
        else {
          el.value = (v == null ? '' : v);
          if (el._pick) el._pick.value = this._toHex(el.value) || (el._cssDefault ? this._resolveColor(el._cssDefault) : null) || '#6200EA';
        }
      });
      this._bindIconPreviews(true);
    }
    // Titre de section fixe (non repliable) — repère visuel plat, comme sur les autres cards néon.
    _section(t) {
      this._target = null; // les sections top-level reviennent s'ancrer directement sur `this`
      const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; this.appendChild(d);
      return d;
    }
    // Sous-groupe repliable (pattern storey-battery-card-gl.js / neon-solar-production-card.js) —
    // ha-expansion-panel natif HA. buildFn() ré-ancre les helpers dessus via _target, puis restaure
    // l'ancrage précédent (permet d'imbrer, même si on ne l'utilise pas ici).
    _group(title, expanded, buildFn) {
      const panel = document.createElement('ha-expansion-panel');
      panel.outlined = true;
      panel.header = title;
      if (expanded) panel.expanded = true;
      (this._target || this).appendChild(panel);
      const prevTarget = this._target;
      this._target = panel;
      buildFn();
      this._target = prevTarget;
      return panel;
    }
    _hint(t) { const d = document.createElement('div'); d.className = 'hint'; (this._target || this).appendChild(d); return d; }
    _text(key, label, ph = '') {
      const w = this._row(label).wrap;
      const inp = document.createElement('input');
      inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key; inp.value = this._read(key) ?? '';
      inp.addEventListener('input', () => this._set(key, inp.value));
      w.appendChild(inp); return inp;
    }
    _toggle(key, label, defaultOn = false) {
      const w = this._row(label).wrap;
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.dataset.key = key;
      if (defaultOn) cb.dataset.defaultOn = '1';
      const v = this._read(key); cb.checked = defaultOn ? (v !== false) : !!v;
      cb.style.cssText = 'width:38px;height:20px;cursor:pointer;accent-color:var(--primary-color);flex:none;';
      cb.addEventListener('change', () => this._set(key, cb.checked));
      w.appendChild(cb); return cb;
    }
    _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(var(--rgb-lavande)) / var(--primary-color)') {
      const w = this._row(label).wrap;
      const box = document.createElement('div'); box.className = 'color-row';
      const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key; txt.value = this._read(key) ?? '';
      const pick = document.createElement('input'); pick.type = 'color';
      txt._pick = pick; txt._cssDefault = cssDefault;
      const refresh = () => { pick.value = this._toHex(txt.value) || (cssDefault ? this._resolveColor(cssDefault) : null) || '#6200EA'; };
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
      const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'mdi:home'; inp.dataset.key = key; inp.value = this._read(key) ?? '';
      const prev = document.createElement('div'); prev.className = 'icon-preview'; prev.dataset.preview = key;
      inp.addEventListener('input', () => this._set(key, inp.value));
      box.appendChild(inp); box.appendChild(prev); w.appendChild(box); return inp;
    }
    _entity(key, label, prefix = '') {
      const w = this._row(label).wrap;
      const inp = document.createElement('input'); inp.type = 'text'; inp.autocomplete = 'off';
      inp.placeholder = (prefix || 'domain') + '.…'; inp.dataset.key = key; inp.dataset.prefix = prefix;
      inp.setAttribute('list', `ncc-ent-${(prefix || 'all').replace(/[^a-z]/g, '')}`);
      inp.value = this._read(key) ?? '';
      inp.addEventListener('input', () => this._set(key, inp.value.trim()));
      w.appendChild(inp); return inp;
    }
    _row(labelHtml, isHtml = false) {
      const row = document.createElement('div'); row.className = 'row';
      const lbl = document.createElement('label');
      if (isHtml) lbl.innerHTML = labelHtml; else lbl.textContent = labelHtml;
      const wrap = document.createElement('div'); wrap.className = 'field-wrap';
      row.appendChild(lbl); row.appendChild(wrap); (this._target || this).appendChild(row);
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
        ha-expansion-panel { display:block; margin:8px 0; --expansion-panel-content-padding:8px 12px 12px; }
        ha-expansion-panel .row:first-child { margin-top:2px; }
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
      this._target = null;
      const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
      this._schema();
      this._fillDatalists();
      this._bindIconPreviews();
    }
    _schemaBase() {
      this._section('En-tête');
      this._text('header.title', 'Titre', 'ex: Climatisation');
      this._icon('header.icon', 'Icône (mdi)');
      this._color('header.color', 'Couleur titre', 'var(--primary-color)', 'défaut : couleur primaire — ex rgb(var(--rgb-lavande))');
      this._text('header.title_size', 'Taille titre', '16px');
      this._select('header.font', 'Police', NEON_FONTS, '— thème HA —');
      this._toggle('header.uppercase', 'Majuscules', true);

      this._group('Effets avancés du titre', false, () => {
        this._text('header.subtitle', 'Sous-titre', 'optionnel — texte sous le titre');
        this._text('header.badge', 'Badge', 'optionnel — étiquette courte à côté du titre, ex: AUTO');
        this._text('header.font_weight', 'Épaisseur', '400');
        this._text('header.letter_spacing', 'Espacement', 'clamp(1px, 0.5cqi, 3px)');
        this._toggle('header.italic', 'Italique', false);
        this._text('header.title_shadow', 'Text-shadow', '0 0 6px ...');
        this._toggle('header.gradient', 'Titre en dégradé');
        this._color('header.gradient_from', 'Dégradé — départ', 'var(--primary-color)');
        this._color('header.gradient_to', 'Dégradé — arrivée', 'var(--accent-color)');
        this._toggle('header.glow', 'Glow du titre');
        this._text('header.glow_size', 'Taille du glow', '12');
        this._color('header.glow_color', 'Couleur du glow', 'var(--primary-color)');
        this._toggle('header.flicker', 'Scintillement du titre');
        this._color('header.icon_color', "Couleur de l'icône", 'défaut : couleur du titre');
        this._text('header.icon_size', "Taille de l'icône", 'défaut : taille du titre');
        this._hint('Mêmes réglages que la neon-entities-card. Text-shadow, si renseigné, remplace le glow.');
      });

      this._section('Entité, capteurs & options');
      this._entity('entity', 'Entité climate *', 'climate');
      this._text('name', 'Nom affiché', 'Vide = friendly_name');
      this._entity('humidity_entity', 'Entité humidité', 'sensor');
      this._hint("Facultatif — sinon current_humidity de l'entité climate");
      this._entity('power_entity', 'Entité puissance', 'sensor');
      this._hint("Facultatif — anime le flux d'air seulement si puissance ≥ seuil (sinon basé sur le mode seul)");
      this._toggle('show_wind', 'Animation air', true);
      this._text('power_threshold', 'Seuil puissance (W)', '10');

      this._section('Couleurs');
      this._group('Boutons mode', false, () => {
        this._color('color_off', 'OFF', MODE_DEFAULTS.off);
        this._color('color_heat', 'HEAT', MODE_DEFAULTS.heat);
        this._color('color_cool', 'COOL', MODE_DEFAULTS.cool);
        this._color('color_dry', 'DRY', MODE_DEFAULTS.dry);
        this._color('color_fan', 'FAN ONLY', MODE_DEFAULTS.fan_only);
        this._color('color_fan_btn', 'FAN (bouton cycle)', '#00FFAA');
      });
      this._group('Pill température', false, () => {
        this._color('color_pill', 'Pill cible', PILL_DEFAULT);
      });
      this._group('Display AC', false, () => {
        this._color('color_display', 'Dot-matrix / display', '#00fff9');
        this._toggle('neon_display_glow', 'Triple neon glow', true);
      });
      this._group('Boutons machine (ventilation / volet)', false, () => {
        this._hint('Gaz rares & radiations — la teinte monte avec le réglage');
        this._color('color_fan_lo',   'Ventilation — mini',  COLOR_DEFAULTS.color_fan_lo);
        this._color('color_fan_hi',   'Ventilation — maxi',  COLOR_DEFAULTS.color_fan_hi);
        this._color('color_swing_lo', 'Volet — fermé',       COLOR_DEFAULTS.color_swing_lo);
        this._color('color_swing_hi', 'Volet — grand ouvert', COLOR_DEFAULTS.color_swing_hi);
      });
    }
  }

  customElements.define('neon-climate-card-webgl-editor', NeonClimateCardWebglEditor);
  customElements.define('neon-climate-card-webgl', NeonClimateCardWebgl);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'neon-climate-card-webgl',
    name: 'Neon Climate Card (WebGL)',
    description: 'Clim Neo Tokyo — souffle rendu par un vrai solveur de fluide',
    preview: true,
  });

  console.info('%c NEON-CLIMATE-CARD-WEBGL %c v' + CARD_VERSION + ' ',
               'background:#00D4FF;color:#000;font-weight:700',
               'background:#9D00FF;color:#fff');
})();
