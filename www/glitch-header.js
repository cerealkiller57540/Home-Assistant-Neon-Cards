/* ============================================================================
 * glitch-header.js — GLITCH la mascotte surgit du bas du header
 * ----------------------------------------------------------------------------
 * Le chat pixel-art émerge du bord inférieur du header (toolbar Lovelace),
 * à un X aléatoire, joue une rafale tirée au hasard (nod / vibration /
 * secouage / ébroue / glitch RGB / wink), puis replonge. Mascotte vivante.
 *
 * Chargé via configuration.yaml :
 *   frontend:
 *     extra_module_url:
 *       - /local/glitch-header.js?v=1
 *
 * Aucune dépendance. Vanilla JS. Respecte prefers-reduced-motion.
 * Pour désactiver : commenter la ligne extra_module_url et recharger.
 * ============================================================================ */
(() => {
  "use strict";

  /* ───────────────────────── RÉGLAGES (tweak ici) ───────────────────────── */
  const CFG = {
    size:      40,        // px — taille du chat
    anchorBot: -6,        // px — décalage vertical d'ancrage (négatif = colle au rebord bas)
    gapMin:    8000,      // ms — délai mini entre 2 apparitions
    gapMax:    20000,     // ms — délai maxi entre 2 apparitions
    dur:       2600,      // ms — durée visible d'une apparition (émerge→tient→replonge)
    color:     "#4af2a1", // teinte plasma (currentColor)
    peek:      false,     // true = juste la tête qui pointe ; false = chat entier
    minWidth:  768,       // px — sous cette largeur d'écran, GLITCH ne sort pas (mobile)
    edgePad:   60,        // px — marge gauche/droite pour ne pas chevaucher logo/icônes
  };

  if (window.__glitchHeaderLoaded) return;        // anti double-chargement
  window.__glitchHeaderLoaded = true;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;                        // accessibilité : on s'abstient

  /* ─────────────────── Sous-paths pixel-art (HEAD / PAWS) ───────────────── */
  const HEAD = "M10.268 10.207h5.455v5.455h-5.455ZM32.086 10.207h5.455v5.455h-5.455ZM10.268 15.662h5.455v5.455h-5.455ZM15.722 15.662h5.455v5.455h-5.455ZM26.631 15.662h5.455v5.455h-5.455ZM32.086 15.662h5.455v5.455h-5.455ZM10.268 21.116h5.455v5.455h-5.455ZM15.722 21.116h5.455v5.455h-5.455ZM21.177 21.116h5.455v5.455h-5.455ZM26.631 21.116h5.455v5.455h-5.455ZM32.086 21.116h5.455v5.455h-5.455ZM10.268 26.571h5.455v5.455h-5.455ZM21.177 26.571h5.455v5.455h-5.455ZM32.086 26.571h5.455v5.455h-5.455Z";
  const PAWS = "M4.813 32.025h5.455v5.455h-5.455ZM10.268 32.025h5.455v5.455h-5.455ZM15.722 32.025h5.455v5.455h-5.455ZM26.631 32.025h5.455v5.455h-5.455ZM32.086 32.025h5.455v5.455h-5.455ZM37.540 32.025h5.455v5.455h-5.455Z";
  const LID  = "M26.631 26.571h5.455v5.455h-5.455Z";   // paupière (col4/row3), currentColor

  const FX = ["nod2", "vibrate", "shake", "shakerot", "glitch", "wink"];

  /* ─────────────────────── Styles + keyframes (1×) ──────────────────────── */
  const STYLE_ID = "glitch-header-style";
  function injectStyle(root) {
    if (root.getElementById && root.getElementById(STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = `
      .ghdr-band{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;}
      .ghdr{position:absolute;bottom:var(--gbot,0px);width:var(--gsz,40px);height:var(--gsz,40px);
        color:var(--gcol,#4af2a1);transform:translateY(100%);will-change:transform;}
      .ghdr svg{display:block;width:100%;height:100%;
        filter:drop-shadow(0 0 3px currentColor) drop-shadow(0 0 7px currentColor);}
      .ghdr .head{transform-box:fill-box;}
      .ghdr .gl{position:absolute;inset:0;mix-blend-mode:screen;opacity:0;}
      .ghdr .gl.rd{color:#ff2d6b;} .ghdr .gl.cy{color:#00e5ff;}

      @keyframes ghdr-emerge{0%{transform:translateY(100%)}14%{transform:translateY(0)}86%{transform:translateY(0)}100%{transform:translateY(100%)}}
      @keyframes ghdr-peek{0%{transform:translateY(100%)}16%{transform:translateY(55%)}84%{transform:translateY(55%)}100%{transform:translateY(100%)}}
      @keyframes ghdr-nod2{0%,20%{transform:translateY(0)}50%{transform:translateY(10.9px)}80%,100%{transform:translateY(0)}}
      @keyframes ghdr-vibrate{0%,100%{transform:translate(0,0)}25%{transform:translate(.6px,-.5px)}50%{transform:translate(-.6px,.5px)}75%{transform:translate(.5px,.4px)}}
      @keyframes ghdr-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
      @keyframes ghdr-shakerot{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-3px) rotate(-7deg)}50%{transform:translateX(3px) rotate(6deg)}75%{transform:translateX(-2px) rotate(-4deg)}}
      @keyframes ghdr-rgbjit{0%,100%{transform:translate(0,0)}20%{transform:translate(2px,-1px)}40%{transform:translate(-2px,1px)}60%{transform:translate(1px,1px)}80%{transform:translate(-1px,-1px)}}
      @keyframes ghdr-glrd{0%,100%{transform:translate(0,0);opacity:0}10%{opacity:.9}30%{transform:translate(2px,0)}55%{transform:translate(-2px,1px)}80%{transform:translate(1px,-1px);opacity:.7}}
      @keyframes ghdr-glcy{0%,100%{transform:translate(0,0);opacity:0}10%{opacity:.9}30%{transform:translate(-2px,0)}55%{transform:translate(2px,-1px)}80%{transform:translate(-1px,1px);opacity:.7}}
      @keyframes ghdr-wink{0%,100%{transform:scaleY(0)}30%,70%{transform:scaleY(1)}}
    `;
    (root.head || root).appendChild(st);
  }

  function svgMarkup() {
    return `<svg viewBox="0 0 51 46">
      <defs><clipPath id="ghdr-cut"><rect x="0" y="-10" width="51" height="42.025"/></clipPath></defs>
      <g clip-path="url(#ghdr-cut)"><g class="head">
        <path fill="currentColor" d="${HEAD}"/>
        <path class="lid" fill="currentColor" d="${LID}" style="transform-box:fill-box;transform-origin:center top;transform:scaleY(0)"/>
      </g></g>
      <path fill="currentColor" d="${PAWS}"/>
    </svg>`;
  }

  /* ─────────────── joue une brique sur l'élément GLITCH émergé ───────────── */
  function playFx(el, fx) {
    const head = el.querySelector(".head");
    const lid  = el.querySelector(".lid");
    if (fx === "wink") { lid.style.animation = "ghdr-wink 1.4s ease-in-out"; return; }
    if (fx === "glitch") {
      ["rd", "cy"].forEach((c) => {
        const g = document.createElement("div");
        g.className = "gl " + c;
        g.innerHTML = svgMarkup();
        g.querySelector(".head").style.animation = `${c === "rd" ? "ghdr-glrd" : "ghdr-glcy"} .9s steps(3) 3`;
        el.appendChild(g);
      });
      head.style.animation = "ghdr-rgbjit .9s steps(3) 3";
      return;
    }
    const dur = { nod2: 2.4, vibrate: 0.48, shake: 1.5, shakerot: 1.65 }[fx];
    const timing = fx === "vibrate" ? "steps(2)" : "ease-in-out";
    head.style.animation = `ghdr-${fx} ${dur}s ${timing}`;
  }

  /* ──────────────────── une apparition complète ─────────────────────────── */
  function appear(band) {
    const w = band.clientWidth;
    const span = w - 2 * CFG.edgePad - CFG.size;
    if (span <= 0) return;                          // header trop étroit
    const x = CFG.edgePad + Math.random() * span;

    const el = document.createElement("div");
    el.className = "ghdr";
    el.style.setProperty("--gsz", CFG.size + "px");
    el.style.setProperty("--gbot", CFG.anchorBot + "px");
    el.style.setProperty("--gcol", CFG.color);
    el.style.left = x + "px";
    el.innerHTML = svgMarkup();
    band.appendChild(el);

    const durS = CFG.dur / 1000;
    el.style.animation = `ghdr-${CFG.peek ? "peek" : "emerge"} ${durS}s ease-in-out`;

    const fx = FX[Math.floor(Math.random() * FX.length)];
    const fxTimer = setTimeout(() => playFx(el, fx), CFG.dur * 0.18);

    el.addEventListener("animationend", (ev) => {
      if (ev.animationName === "ghdr-emerge" || ev.animationName === "ghdr-peek") {
        clearTimeout(fxTimer);
        el.remove();
      }
    });
  }

  /* ─────────── traverse les shadow DOM jusqu'au .header de hui-root ──────── */
  function findHeader() {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace");
    const huiRoot = panel?.shadowRoot?.querySelector("hui-root");
    const header = huiRoot?.shadowRoot?.querySelector(".header");
    return { huiRoot, header };
  }

  /* ───────────────────────── boucle principale ──────────────────────────── */
  let loopTimer = null;
  let currentBand = null;

  function scheduleNext(band) {
    const gap = CFG.gapMin + Math.random() * (CFG.gapMax - CFG.gapMin);
    loopTimer = setTimeout(() => {
      // ne joue que si l'onglet est visible et l'écran assez large
      if (!document.hidden && window.innerWidth >= CFG.minWidth && band.isConnected) {
        appear(band);
      }
      scheduleNext(band);
    }, gap);
  }

  function attach() {
    const { huiRoot, header } = findHeader();
    if (!header) return false;

    // déjà accroché à CE header ? rien à faire
    if (currentBand && currentBand.isConnected && header.contains(currentBand)) return true;

    injectStyle(huiRoot.shadowRoot);

    // le header doit clipper ce qui dépasse en bas
    const cs = getComputedStyle(header);
    if (cs.position === "static") header.style.position = "relative";
    header.style.overflow = "hidden";

    const band = document.createElement("div");
    band.className = "ghdr-band";
    header.appendChild(band);

    currentBand = band;
    if (loopTimer) clearTimeout(loopTimer);
    scheduleNext(band);
    return true;
  }

  /* ─── retries au démarrage + ré-accrochage quand on change de vue/dashboard ─── */
  function boot() {
    let tries = 0;
    const iv = setInterval(() => {
      if (attach() || ++tries > 40) clearInterval(iv);   // ~20 s max
    }, 500);

    // hui-root est recréé en changeant de dashboard → re-vérifier périodiquement
    setInterval(() => { attach(); }, 4000);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
