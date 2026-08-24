/* ============================================================================
 * glitch-roam.js — GLITCH la mascotte se balade dans toute la vue Cyber
 * ----------------------------------------------------------------------------
 * Overlay plein écran (pointer-events:none) au-dessus des cards de la vue
 * Cyber. GLITCH apparaît en effet SILVERHAND (3 calques RGB-split rouge/cyan/
 * vert + scanlines holographiques + clip-path glitché) — la MÊME recette que
 * linux-terminal-card.js — mais en se DÉPLAÇANT d'un point à l'autre de l'écran
 * pendant son cycle de vie. Réapparaît ailleurs après un délai. Mascotte qui trotte.
 *
 * N'agit QUE sur la vue dont le path se termine par /cyber.
 *
 * Chargé via configuration.yaml :
 *   frontend:
 *     extra_module_url:
 *       - /local/glitch-roam.js?v=1
 *
 * Vanilla JS, zéro dépendance. Respecte prefers-reduced-motion.
 * ============================================================================ */
(() => {
  "use strict";

  /* ───────────────────────── RÉGLAGES (tweak ici) ───────────────────────── */
  const CFG = {
    size:     56,          // px — largeur du chat (la Terminal en met 54*scale)
    gapMin:   6000,        // ms — délai mini entre 2 balades
    gapMax:   15000,       // ms — délai maxi entre 2 balades
    dur:      2800,        // ms — durée du cycle Silverhand (= sh-life, comme la Terminal)
    minWidth: 768,         // px — sous cette largeur, GLITCH dort (mobile)
    edgePad:  40,          // px — marge pour ne pas coller aux bords
    viewPath: "/cyber",    // ne s'active que sur cette vue (suffixe du path)
    zIndex:   6,           // au-dessus des cards, sous les dialogs HA
    // couleurs (RGB, comme --ltc-* de la Terminal Card)
    cy:  "0,229,255",
    grn: "74,242,161",
    red: "255,61,80",
    amb: "255,173,51",
    // mode affolé : GLITCH devient rouge/rapide + invasion quand une alerte cyber est active
    critEntities: [
      "sensor.cyber_station_honeytoken_declenches_24h",  // creds réutilisées = exploitation active
      "sensor.cyber_station_lan_nouveaux",               // appareil inconnu sur le LAN
    ],
    critDur:  1000,        // ms — cycle Silverhand en mode affolé (plus court)
    critGapMin: 1100,      // ms — invasion : délai mini en mode critique
    critGapMax: 2000,      // ms — invasion : délai maxi
    critBurst: 3,          // nb max de chats par vague en mode critique
  };

  if (window.__glitchRoamLoaded) return;
  window.__glitchRoamLoaded = true;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  /* ── chat monobloc (CAT_PATH identique à linux-terminal-card.js) ───────── */
  const CAT_PATH = "M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z";
  const catSvg = () => `<svg viewBox="0 0 51 46"><path fill="currentColor" d="${CAT_PATH}"/></svg>`;

  /* ─────────────────── Styles + keyframes (portés de la Terminal Card) ──── */
  const STYLE_ID = "glitch-roam-style";
  function injectStyle(rootNode) {
    if (rootNode.getElementById && rootNode.getElementById(STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = `
      .groam-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:${CFG.zIndex};
        --ltc-cy:${CFG.cy};--ltc-grn:${CFG.grn};--ltc-red:${CFG.red};--ltc-amb:${CFG.amb};}

      /* le wrapper se déplace (left/top en transition) ; les calques font le Silverhand */
      .groam{position:absolute;width:${CFG.size}px;opacity:0;mix-blend-mode:screen;
        will-change:left,top;}
      .groam .layer{position:absolute;inset:0;}
      .groam svg{width:100%;height:auto;display:block;}
      .groam .l-cy{color:rgb(var(--ltc-cy));filter:drop-shadow(0 0 5px rgba(var(--ltc-cy),.8));}
      .groam .l-rd{color:rgb(var(--ltc-red));}
      .groam .l-main{color:rgb(var(--ltc-grn));filter:drop-shadow(0 0 6px rgba(var(--ltc-grn),.8));}
      .groam .holo-scan{position:absolute;inset:0;mix-blend-mode:overlay;
        background:repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0, rgba(0,0,0,.5) 1px, transparent 1px, transparent 3px);}

      .groam.run{animation:groam-life ${CFG.dur}ms steps(60) forwards;}
      .groam.run .l-rd{animation:groam-rd ${CFG.dur}ms steps(30) forwards;}
      .groam.run .l-cy{animation:groam-cy ${CFG.dur}ms steps(30) forwards;}
      .groam.run .l-main{animation:groam-main ${CFG.dur}ms steps(40) forwards;}
      .groam.run .holo-scan{animation:groam-scan ${CFG.dur}ms linear;}

      /* mode affolé : principal en rouge, fantôme en ambre, RGB-split plus large + rapide */
      .groam.crit .l-main{color:rgb(var(--ltc-red));filter:drop-shadow(0 0 7px rgba(var(--ltc-red),.9));}
      .groam.crit .l-rd{color:rgb(var(--ltc-amb));}
      .groam.crit.run{animation:groam-life ${CFG.critDur}ms steps(40) forwards;}
      .groam.crit.run .l-rd{animation:groam-rd-hard ${CFG.critDur}ms steps(20) forwards;}
      .groam.crit.run .l-cy{animation:groam-cy-hard ${CFG.critDur}ms steps(20) forwards;}
      .groam.crit.run .l-main{animation:groam-main ${CFG.critDur}ms steps(30) forwards;}
      .groam.crit.run .holo-scan{animation:groam-scan ${CFG.critDur}ms linear;}

      @keyframes groam-life{ 0%{opacity:0} 4%{opacity:.9} 6%{opacity:.1} 8%{opacity:.85} 12%{opacity:.2} 14%{opacity:.9}
        20%,72%{opacity:.82} 74%{opacity:.3} 76%{opacity:.8} 80%{opacity:.15} 88%{opacity:.5} 92%{opacity:.05} 96%{opacity:.3} 100%{opacity:0} }
      @keyframes groam-rd{ 0%,100%{transform:translate(0,0)} 5%{transform:translate(-4px,1px)} 22%{transform:translate(2px,-1px)}
        48%{transform:translate(-3px,0)} 60%{transform:translate(3px,1px)} 78%{transform:translate(-5px,-2px)} 90%{transform:translate(4px,0)} }
      @keyframes groam-cy{ 0%,100%{transform:translate(0,0)} 5%{transform:translate(4px,-1px)} 22%{transform:translate(-2px,1px)}
        48%{transform:translate(3px,0)} 60%{transform:translate(-3px,-1px)} 78%{transform:translate(5px,2px)} 90%{transform:translate(-4px,0)} }
      @keyframes groam-main{ 0%,100%{transform:translate(0,0); clip-path:inset(0 0 0 0)}
        10%{clip-path:inset(20% 0 60% 0); transform:translate(2px,0)} 14%{clip-path:inset(0 0 0 0); transform:translate(-2px,0)}
        30%{clip-path:inset(70% 0 10% 0); transform:translate(1px,0)} 33%{clip-path:inset(0 0 0 0)}
        55%{clip-path:inset(40% 0 40% 0); transform:translate(-2px,0)} 58%{clip-path:inset(0 0 0 0)}
        82%{clip-path:inset(10% 0 75% 0); transform:translate(3px,0)} 85%{clip-path:inset(0 0 0 0)} }
      @keyframes groam-scan{ 0%{background-position:0 -60px; opacity:.7} 100%{background-position:0 60px; opacity:.7} }
      @keyframes groam-rd-hard{ 0%,100%{transform:translate(0,0)} 8%{transform:translate(-8px,2px)} 25%{transform:translate(6px,-2px)}
        50%{transform:translate(-7px,1px)} 70%{transform:translate(8px,2px)} 88%{transform:translate(-9px,-3px)} }
      @keyframes groam-cy-hard{ 0%,100%{transform:translate(0,0)} 8%{transform:translate(8px,-2px)} 25%{transform:translate(-6px,2px)}
        50%{transform:translate(7px,-1px)} 70%{transform:translate(-8px,-2px)} 88%{transform:translate(9px,3px)} }
    `;
    (rootNode.head || rootNode).appendChild(st);
  }

  /* ───────────────────── une balade complète ───────────────────────────── */
  function roam(layer, crit) {
    const W = layer.clientWidth, H = layer.clientHeight;
    const span = CFG.size + CFG.edgePad;
    if (W < span * 2 || H < span * 2) return;

    const dur = crit ? CFG.critDur : CFG.dur;
    const scale = crit ? 0.62 : 1;                  // un peu plus petits quand ils déferlent
    const sz = CFG.size * scale;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const x1 = rnd(CFG.edgePad, W - sz - CFG.edgePad), y1 = rnd(CFG.edgePad, H - sz - CFG.edgePad);
    const x2 = rnd(CFG.edgePad, W - sz - CFG.edgePad), y2 = rnd(CFG.edgePad, H - sz - CFG.edgePad);

    const el = document.createElement("div");
    el.className = "groam run" + (crit ? " crit" : "");
    el.style.cssText = `left:${x1}px;top:${y1}px;width:${sz}px;`;
    el.innerHTML =
      `<div class="layer l-rd">${catSvg()}</div>` +
      `<div class="layer l-cy">${catSvg()}</div>` +
      `<div class="layer l-main">${catSvg()}</div>` +
      `<div class="holo-scan"></div>`;
    layer.appendChild(el);

    // déplacement : il "marche" de A vers B pendant qu'il est matérialisé
    el.style.transition = `left ${dur * 0.72}ms ease-in-out, top ${dur * 0.72}ms ease-in-out`;
    setTimeout(() => { el.style.left = x2 + "px"; el.style.top = y2 + "px"; }, dur * 0.12);

    setTimeout(() => el.remove(), dur + 250);        // cleanup (= comme _spawnCat)
  }

  /* ─────────── traverse les shadow DOM jusqu'au conteneur de vue ───────── */
  function findRoot() {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace");
    const huiRoot = panel?.shadowRoot?.querySelector("hui-root");
    const view = huiRoot?.shadowRoot?.querySelector("#view") ||
                 huiRoot?.shadowRoot?.querySelector("hui-view") ||
                 huiRoot?.shadowRoot?.querySelector(".content");
    return { huiRoot, view };
  }

  const onCyberView = () => location.pathname.endsWith(CFG.viewPath);

  /* ── lit hass (exposé sur l'élément <home-assistant>) pour détecter l'alerte ── */
  function isCritical() {
    const hass = document.querySelector("home-assistant")?.hass;
    if (!hass) return false;
    return CFG.critEntities.some((id) => {
      const st = hass.states[id]?.state;
      const n = parseFloat(st);
      return !isNaN(n) && n > 0;
    });
  }

  /* ───────────────────────── boucle principale ──────────────────────────── */
  let loopTimer = null, layer = null;

  function scheduleNext() {
    const crit = isCritical();
    const gMin = crit ? CFG.critGapMin : CFG.gapMin;
    const gMax = crit ? CFG.critGapMax : CFG.gapMax;
    const gap = gMin + Math.random() * (gMax - gMin);
    loopTimer = setTimeout(() => {
      if (!document.hidden && window.innerWidth >= CFG.minWidth &&
          onCyberView() && layer && layer.isConnected) {
        if (crit) {
          // invasion : 2-3 chats affolés en rafale décalée
          const n = 2 + Math.floor(Math.random() * (CFG.critBurst - 1));
          for (let i = 0; i < n; i++) setTimeout(() => roam(layer, true), i * 130);
        } else {
          roam(layer, false);
        }
      }
      scheduleNext();
    }, gap);
  }

  function teardown() { if (layer) { layer.remove(); layer = null; } }

  function attach() {
    if (!onCyberView()) { teardown(); return; }
    const { huiRoot, view } = findRoot();
    if (!huiRoot || !view) return;
    if (layer && layer.isConnected && view.contains(layer)) return;
    teardown();
    injectStyle(huiRoot.shadowRoot);
    if (getComputedStyle(view).position === "static") view.style.position = "relative";
    layer = document.createElement("div");
    layer.className = "groam-layer";
    view.appendChild(layer);
  }

  function boot() {
    let tries = 0;
    const iv = setInterval(() => { attach(); if (++tries > 40) clearInterval(iv); }, 500);
    setInterval(attach, 3000);
    if (!loopTimer) scheduleNext();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
