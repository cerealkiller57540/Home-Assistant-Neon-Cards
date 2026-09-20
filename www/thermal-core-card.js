/* ══ FRAGMENTS DU BANC, REPRIS VERBATIM ══════════════════════════════
   Ces trois blocs sont recopies tels quels depuis le banc d essai par
   gen_card.py. Les corriger ICI ne sert a rien : le build suivant les
   ecrasera. Toute correction va dans le banc.
   ═══════════════════════════════════════════════════════════════════ */

const TCC_CSS = `
  /* Tokens du banc, transplantes de :root sur .card (voir gen_card.py).
     .card est le porteur prouve : les 36 --c-* y vivent deja. */
  .card{
    --f-disp:'Orbitron','Eurostile','Bahnschrift','DIN Alternate',system-ui,sans-serif;
    --f-mono:'Share Tech Mono','JetBrains Mono','Cascadia Mono',Consolas,ui-monospace,monospace;

    /* palette REELLE de la card PAC Ecodan */
    --uv:98,0,234; --uv-deep:61,0,184; --grn:0,255,170; --cy:0,255,249;
    --mag:180,0,255; --amb:255,184,0; --lime:204,255,0; --lav:176,160,224; --ice:232,224,255;
    --red:255,61,80;

    --bg:#f4f2f9; --fg:#241d38; --note:#5f5680; --hair:rgba(98,0,234,.22);
    --card-bg:#0b0813; --card-bg2:#140d23;
  }
  @media (prefers-color-scheme:dark){ .card{
    --bg:#07050d; --fg:#d6cdec; --note:#8c81ab; --hair:rgba(98,0,234,.3);
  } }
  .card{ color:var(--fg); font-family:var(--f-mono);
         font-size:13.5px; line-height:1.6; }
  /* line-height est HERITE, et ha-neon-css l interdit explicitement sur
     .nmc-title : c est le piege n1 du calage icone/titre du header. Le
     poser sur .card le faisait descendre pareil. On le neutralise LA. */
  .card .nmc-title{ line-height:normal; }

  /* ---- LA RACINE <ha-card>, ajoutee au markup mais SANS regle jusqu ici.
     Lovelace attend <ha-card> comme racine : c est elle que le theme, les
     themes card-mod et le layout en sections dimensionnent. Nue, elle
     apporte SON fond, SON radius et SON ombre SOUS notre .card, qui a les
     siens -- deux surfaces empilees, deux radius qui ne coincident pas, et
     un liseré du theme qui depasse. On la rend donc TRANSPARENTE et on
     laisse .card porter l apparence, qui est deja prouvee (36 --c-*).
     Pas de !important : si Chris pose un card-mod, il doit gagner. */
  /* use_theme_card=true : la surface DEMENAGE sur ha-card, qui herite du
     card-mod du theme (fond translucide + backdrop-filter = le verre).
     .card se neutralise alors -- deux surfaces empilees, c est justement
     le bug. !important ICI seulement : card-mod cible ha-card/:host et
     s injecte APRES nous dans le shadow root (mesure entities l.254-261).
     Sur .card il n a aucune regle, donc aucun !important n y est requis --
     et il bloquerait le card-mod que Chris pourrait poser lui-meme. */
  /* UNE SEULE surface. card-mod pose sur :host un overflow:hidden et un
     ::before qui dessinent l arrondi EN DUR a 18px (theme l.442-444) :
     tant que .card gardait son propre rayon, les deux ne coincidaient
     pas et le filet du theme debordait dans les coins haut/bas gauche
     (capture du 19/09). .card renonce donc a fond, bordure, ombre ET
     rayon : c est :host qui clippe, seul. */
  :host([data-theme-card]) .card{
    background:none !important; border:none !important; box-shadow:none !important;
    border-radius:0 !important;
    /* overflow AUSSI, sinon le glow reste clippe -- et prive de rayon il
       l est a angles droits : « coupe net », le mot de Chris le 20/09.
       Sous cette branche c est :host (card-mod, 18px) qui clippe, seul. */
    overflow:visible !important;}
  :host([data-theme-card]) ha-card{
    background:var(--ha-card-background) !important;
    border:var(--ha-card-border-width,1px) solid
           var(--ha-card-border-color, rgba(var(--uv),.45)) !important;
    box-shadow:var(--ha-card-box-shadow, 0 8px 32px rgba(0,0,0,.55)) !important;
    backdrop-filter:var(--ha-card-backdrop-filter, blur(12px) saturate(150%));
    -webkit-backdrop-filter:var(--ha-card-backdrop-filter, blur(12px) saturate(150%));
    border-radius:var(--ha-card-border-radius,18px);}

  ha-card{
    background:none; border:none; box-shadow:none;
    /* La card remplit sa colonne : c est le defaut vu le 19/09 (bride a
       352px par une valeur de SIMULATION du banc, cf _SIMU). */
    width:100%; display:block;
    /* overflow visible : les drop-shadow du neon debordent volontairement
       de .card. Un overflow:hidden du theme les couperait net. */
    overflow:visible;
  }
  .card{ width:100%; box-sizing:border-box; }
  .neon-hdr {display:flex; align-items:center; gap:8px; padding:11px 14px 8px;
    container-type:inline-size}
  .neon-hdr-group {display:flex; flex-direction:row; align-items:center; gap:8px;
    flex:1; min-width:0}
  .nmc-icon-wrap {display:flex; align-items:center; justify-content:center;
    flex-shrink:0; overflow:visible}
  .nmc-icon-wrap ha-icon, .nmc-icon-wrap svg {
    display:flex; align-items:center; justify-content:center;
    /* calc(11px * 1.125) = 12.375 -> le clamp rend 16px en pratique, jamais 18 */
    /* header.icon_size force la taille ; sinon le clamp derive de la
       taille du titre, comme avant. */
    --mdc-icon-size:var(--tcc-t-icon-size,
      clamp(16px, calc(var(--tcc-t-size, clamp(8px,2vw,11px)) * 1.125), 18px));
    width:var(--mdc-icon-size); height:var(--mdc-icon-size);
    /* RECETTE CANONIQUE : ha-neon-css/SKILL.md 3ter, checklist point 1.
       Defaut FIXE blanc casse, JAMAIS herite de --tcc-t-color : si l icone
       retombe sur la couleur du titre, elle prend la meme teinte que le
       glow et le halo se noie au lieu de trancher (piege vecu NAS/switch/
       storey, 26/08). \`icon_color\` reste personnalisable normalement. */
    color:var(--tcc-t-icon-color, rgba(232,224,255,.85));
    /* Glow 4 couches (SKILL.md 3ter, point 2). Le pont ne pose
       --tcc-t-icon-glow QUE si header.glow est coche : opt-in strict.
       AUCUNE couche fixe ici -- une drop-shadow permanente en plus du
       bloc conditionnel se cumule en silence et le reflexe (reduire
       .2/.4/.8/1) serait un FAUX FIX (piege linux-terminal, 24/08). */
    filter:var(--tcc-t-icon-glow, none);
    overflow:visible}
  .neon-hdr-body {flex:1; min-width:0; display:flex; flex-direction:column;
    gap:1px; justify-content:center}
  .nmc-title {
    /* --tcc-t-font / --tcc-t-size : posees par le pont depuis header.font
       et header.title_size. La vraie card charge Orbitron ; au banc la
       pile --f-disp prend le relais (la CSP de l Artifact bloque Google
       Fonts). Meme forme de clamp que \`_neonHeaderCss\` l.365. */
    font-family:var(--tcc-t-font, var(--f-disp));
    /* \`cqi\` et pas \`vw\` : MESURE du 20/09 en lisant les 4 cards que
       Chris a nommees. entities derive sa taille du CONTENEUR
       (clamp(6px, 2.6cqi, 11px)) ; thermal-core la derivait du
       VIEWPORT (2vw). A largeur de card egale mais fenetre
       differente, les deux titres n avaient donc pas la meme taille.
       Le container-type pose sur .neon-hdr sert enfin a quelque chose.
       ⚠️ Chez Chris ce defaut est ECRASE : sa config pose
       header.title_size "18", donc le pont met --tcc-t-size:18px et
       le clamp ne mord pas. Le corriger sert au DEFAUT, pas a sa
       card -- ne pas croire qu il y change quelque chose. */
    font-size:clamp(14px, var(--tcc-t-size, clamp(6px,2.6cqi,11px)),
                    var(--tcc-t-size, clamp(6px,2.6cqi,11px)));
    /* Lus par le pont depuis header.font_weight / italic / uppercase.
       Defauts = ceux de thermal-core, pas ceux d une autre card. */
    font-weight:var(--tcc-t-weight, 600);
    text-transform:var(--tcc-t-transform, uppercase);
    font-style:var(--tcc-t-style, normal);
    /* l ordre compte : la couleur (ou le gradient) AVANT le text-shadow,
       parce qu un gradient pose -webkit-text-fill-color:transparent */
    /* SKILL.md l.1160 : le canon tranche le 26/08 est .02em (le clamp
       etait la valeur historique d entities/climate, pas le canon). */
    /* Defaut = blanc casse du theme, comme neon-entities-card.js l.176
       (la card de REFERENCE ; le md 3ter dit var(--primary-color) et il
       est perime). La couleur neon n arrive que par glow/degrade, qui
       sont opt-in. Fallback du triplet obligatoire : hors HA la var
       n existe pas et la couleur serait invalide. */
    color:var(--tcc-t-color, rgba(var(--rgb-primary-text-color, 232,224,255),.85));
    padding-left:8px;
    /* Canon du MD 3ter l.457 : clamp(1px, 0.5cqi, 3px). L ancien
       defaut .02em valait ~0,32px a 16px -- un titre bien plus serre
       que les autres cards, ce que Chris signale le 20/09 par « a
       parametre equivalent ne rend pas comme les autres ».
       Le \`cqi\` EXIGE un conteneur declare : cf container-type pose
       sur .neon-hdr plus bas. Sans lui il se resout sur le viewport
       et l espacement bougerait avec la largeur de la fenetre. */
    letter-spacing:var(--tcc-t-ls, clamp(1px, 0.5cqi, 3px));
    /* Gradient : pose -webkit-text-fill-color:transparent, donc il DOIT
       venir avant le text-shadow.
       ⚠️ Un commentaire de ce fichier a longtemps prescrit ici un
       filter:drop-shadow « et jamais un text-shadow », en citant
       « SKILL.md l.507-509 ». Cette regle N EXISTE DANS AUCUN
       document : grep du 20/09 sur tout .claude/skills/ -- elle ne
       vivait que dans mes propres commentaires. ha-neon-css/SKILL.md
       l.516 dit L INVERSE (text-shadow sur le titre, drop-shadow
       reserve a ha-icon qui ne rend pas de texte) et impose l ordre
       gradient-puis-text-shadow precisement « pour rester visible
       par-dessus le texte rendu transparent ».
       Le bon comportement, mesure le 20/09 sur
       neon-entities-card.js l.205/218 : cette card pose les deux en
       meme temps, et c est ce qui produit le titre blanc a halo
       colore de toutes les autres cards. Un text-shadow se dessine a
       partir de la FORME des glyphes, pas de leur remplissage : sous
       fill transparent il reste visible A TRAVERS le texte evide, et
       sa couche \`#fff\` serree remplit l interieur des lettres.
       Un drop-shadow, lui, s applique au rendu deja compose : texte
       transparent = pas de coeur blanc, juste un contour.
       Le pont alimente donc --tcc-t-glow dans TOUS les cas, et laisse
       --tcc-t-title-filter vide. */
    background:var(--tcc-t-grad, none);
    -webkit-background-clip:var(--tcc-t-clip, border-box);
    background-clip:var(--tcc-t-clip, border-box);
    -webkit-text-fill-color:var(--tcc-t-fill, currentColor);
    /* Glow titre = _neonGlow(), memes 4 couches (SKILL.md l.440).
       header.title_shadow, s il est renseigne, REMPLACE le glow. */
    text-shadow:var(--tcc-t-glow, none);
    filter:var(--tcc-t-title-filter, none);
    animation:var(--tcc-t-flicker, none);
    white-space:nowrap; overflow:visible; text-overflow:ellipsis}
  @keyframes nmc-flicker {
    0%,100%{opacity:1} 41%{opacity:1} 42%{opacity:.62}
    43%{opacity:1} 77%{opacity:1} 78%{opacity:.7} 79%{opacity:1}}
  .neon-hdr-subtitle {
    font-family:var(--tcc-t-font, var(--f-disp));
    font-size:clamp(10px, calc(var(--tcc-t-size, clamp(8px,2vw,11px)) * .75), 12px);
    color:color-mix(in srgb, var(--tcc-t-color, rgba(var(--rgb-primary-text-color, 232,224,255),.85)) 55%,
                    transparent);
    letter-spacing:2px; text-transform:uppercase; line-height:1.2}
  .neon-main-div {height:1px;
    /* VERBATIM \`_neonHeaderCss\` (l.386-390) : les deux couleurs sont en
       DUR dans toutes les cards, pas configurables. Ce filet etait absent
       de la card livree jusqu au 19/09 -- le filtre _CARD connaissait
       \`.neon-hdr\` mais pas \`.neon-main-div\` : regle elaguee en silence. */
    background:linear-gradient(90deg, transparent, rgba(98,0,234,0.55),
                               rgba(0,255,249,0.25), transparent);
    margin:0 14px 4px}
  @media (orientation:landscape) and (max-height:850px) {
    .neon-hdr{flex-direction:column; align-items:flex-start; gap:3px}
    .nmc-icon-wrap{position:absolute}
    .neon-hdr-body{padding-left:28px}
  }
  .card .inner {padding:10px 10px 12px; position:relative; z-index:2;
    box-sizing:border-box}
  .card {
      /* ===== PALETTE : 27 teintes du dessin + 9 etats =====
         Chaque occurrence du SVG porte AUSSI son litteral en
         fallback : une var mal orthographiee rend donc la
         bonne couleur au lieu d un fill noir invisible.
         Les opacites ne sont PAS ici -- elles portent la
         hierarchie du dessin, pas la teinte, et restent dans
         les attributs (ou dans le % du color-mix). */
      --c-arc-b:          rgb(180,0,255);
      --c-btn-bg:         rgb(6,2,20);
      --c-btn-minus:      rgb(0,255,249);
      --c-btn-plus:       rgb(180,0,255);
      --c-btn-plus-glyph: rgb(214,150,255);
      --c-chamber-inner:  rgb(61,0,184);
      --c-chamber-void:   rgb(11,8,19);
      --c-chamber-wall:   rgb(98,0,234);
      --c-compressor-hz:  rgb(214,150,255);
      --c-divertor:       rgb(0,255,170);
      --c-dt-label:       rgb(206,196,240);
      --c-dt-value:       rgb(176,160,224);
      --c-ext-temp:       rgb(0,255,249);
      --c-filament:       rgb(0,255,249);
      --c-flow-back:      rgb(0,255,249);
      --c-flow-out:       rgb(204,255,0);
      --c-pipe:           rgb(98,0,234);
      --c-plasma-core:    rgb(232,224,255);
      --c-plasma-mid:     rgb(124,77,255);
      --c-setpoint:       rgb(232,224,255);
      --c-telemetry:      rgb(188,176,228);
      --c-thermo-bg:      rgb(98,0,234);
      --c-thermo-border:  rgb(98,0,234);
      --c-thermo-cur:     rgb(0,255,249);
      --c-thermo-mode:    rgb(196,186,232);
      --c-tile-bg:        rgb(12,16,32);
      --c-tile-bg-deep:   rgb(4,6,14);

      /* Etats : le JS les POSE par setAttribute sur les
         elements concernes ; pas de var() dans le SVG, elle
         serait ecrasee au premier changement d etat. */
      --c-state-off:      rgb(0,255,170);   /* etat OFF / veille */
      --c-state-heat:     rgb(204,255,0);   /* etat CHAUFFE */
      --c-state-defrost:  rgb(255,184,0);   /* etat DEGIVRAGE */

      /* Teintes du PLASMA par etat : posees par le JS sur les
         stops #tkp1/#tkp2 a chaque changement d etat, donc
         impossibles a porter en var() dans le SVG -- elles y
         seraient ecrasees au premier apply(). */
      --c-idle-c1:        rgb(124,77,255);   /* idle : coeur du plasma */
      --c-idle-c2:        rgb(98,0,234);   /* idle : paroi */
      --c-run-c1:         rgb(0,255,249);   /* chauffe : coeur */
      --c-run-c2:         rgb(180,0,255);   /* chauffe : paroi */
      --c-def-c1:         rgb(255,184,0);   /* degivrage : coeur */
      --c-def-c2:         rgb(98,0,234);   /* degivrage : paroi */

    background:linear-gradient(160deg,var(--card-bg) 0%,var(--card-bg2) 100%);
    border:1px solid rgba(var(--uv),.55);
    /* MEME rayon que le theme. card-mod-card (neo-tokyo-v5.yaml l.442)
       pose border-radius:18px + overflow:hidden sur :host, et son
       :host::before dessine le filet UV/xenon SUR cet arrondi, en haut
       et a gauche. A 10px nos coins rentraient sous le filet du theme :
       c est le debord signale par Chris le 19/09, et gen_card.py:270
       l avait predit (« deux radius qui ne coincident pas »). */
    border-radius:var(--ha-card-border-radius, 10px); overflow:hidden;
    box-shadow:0 0 0 1px rgba(var(--uv),.12), 0 14px 44px -18px rgba(var(--uv),.8);}
  .card {position:relative}
  .card .stage {position:relative}
  .card .stage #fx {position:absolute; inset:0;
            width:100%; height:100%;
            display:block; z-index:0; pointer-events:none}
  #gl-err {display:block; margin:10px 0 0; padding:8px 11px; border-radius:4px;
    background:rgba(255,61,80,.14); border:1px solid rgba(255,61,80,.5);
    color:#ff8d99; font-size:12px; font-family:var(--f-mono)}
  .card .on-plasma {
    filter:drop-shadow(0 0 2px rgba(8,5,16,.95))
           drop-shadow(0 0 7px rgba(8,5,16,.85));
  }
  .card .neon {
    filter:drop-shadow(0 0 1px #fff)
           drop-shadow(0 0 5px currentColor)
           drop-shadow(0 0 12px currentColor);
  }
  .card .neon.off { filter:none }
  .card .ext-glow {
    filter:drop-shadow(0 0 2px rgba(8,5,16,.95))
           drop-shadow(0 0 7px rgba(8,5,16,.85))
           drop-shadow(0 0 2px currentColor)
           drop-shadow(0 0 7px currentColor);
  }
  .card .dt-glow {
    filter:drop-shadow(0 0 3px rgba(8,5,16,.95))
           drop-shadow(0 0 8px rgba(8,5,16,.85))
           drop-shadow(0 0 2px currentColor)
           drop-shadow(0 0 9px currentColor);
  }
  .tbtn {cursor:pointer}
  .tbtn rect {transition:fill .15s ease, stroke .15s ease}
  .tbtn:hover rect,.tbtn:focus-visible rect {fill:rgba(232,224,255,.2); stroke:rgba(232,224,255,.9)}
  .tbtn:active rect {fill:rgba(232,224,255,.34)}
  .tbtn:focus {outline:none}
  .tbtn:focus-visible rect {stroke-width:1.8}
  @media (prefers-reduced-motion:reduce) { .tbtn rect{transition:none} }
  .ok {color:rgb(var(--grn))}
  .warn {color:rgb(var(--amb))}
  .flow path {animation-play-state:paused}
  .flow-dep {
    stroke-dasharray:8.6 4.021;            /* 12.621 = 75.73/6 */
    animation:flow-dep var(--fdep,1.9s) linear infinite;
  }
  .flow-dep.b {
    stroke-dasharray:3.2 9.421;
    animation-duration:var(--fdepb,1.27s); /* non multiple -> dephasage continu */
  }
  .flow-ret {
    stroke-dasharray:7.4 3.767;            /* 11.167 = 67/6 */
    animation:flow-ret var(--fret,2.2s) linear infinite;
  }
  .flow-ret.b {
    stroke-dasharray:2.8 8.367;
    animation-duration:var(--fretb,1.49s);
  }
  .flowbed {animation:bed-breathe 3.4s ease-in-out infinite}
  @keyframes bed-breathe {0%,100%{opacity:.22}50%{opacity:.36}}
  .intake ellipse {
    opacity:0;
    transform-box:fill-box;
    transform-origin:center;
    animation:intake 2.9s cubic-bezier(.35,0,.7,1) infinite;
    animation-delay:var(--d,0s);
  }
  @keyframes intake {
    0%   {opacity:0;   transform:translate(0,0) scaleX(1)}
    14%  {opacity:.9;  transform:translate(calc(var(--dx,20px)*.14), calc(var(--dy,0px)*.14)) scaleX(1.1)}
    62%  {opacity:.75}
    /* extinction a 84% et non 88% : MESURE, avec la trainee (scaleX 2.6) le
       BORD DROIT de la particule atteignait x=35.4 alors que la paroi est a
       35 -- elle mordait dedans de 0.4 u. C est le bord qu il faut mesurer,
       pas le centre, des lors que la forme s etire. */
    84%  {opacity:0}
    100% {opacity:0;   transform:translate(var(--dx,20px), var(--dy,0px)) scaleX(2.6)}
  }
  @media (prefers-reduced-motion:reduce) {*{animation:none!important; transition:none!important}}
  /* Sans ca, #gl-err[hidden] s affiche quand meme : un display pose
     par #id bat le [hidden] de la feuille UA. Barre rouge vide
     pleine largeur sous la card (mesure du 19/09). */
  #gl-err[hidden]{display:none !important}
`;

const TCC_HTML = `  <div class="card">
    <div class="inner">
    <!-- ===== HEADER CANONIQUE (HTML, au-dessus du SVG) =====
         Contrat _buildNeonHeaderHTML() de heat-pump-card.js (l.446-465).
         Le <span id="badge"> du bloc d origine est volontairement absent :
         le statut est le texte lumineux du bandeau bas (st-txt). -->
    <div class="neon-hdr">
      <div class="neon-hdr-group">
        <div class="nmc-icon-wrap">
          <!-- la vraie card monte un <ha-icon>. Hors HA il n existe pas : on
               pose un svg inline a la taille que --mdc-icon-size resout. -->
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16m0 2.5L9.5 11h5zM7 13v2h10v-2z"/></svg>
        </div>
        <div class="neon-hdr-body">
          <span class="nmc-title">Thermal Core</span>
          <!-- Le sous-titre existe dans \`_buildNeonHeaderHTML\` : le pont le
               remplit depuis header.subtitle et le masque s il est vide. -->
          <span class="neon-hdr-subtitle" style="display:none"></span>
        </div>
      </div>
    </div>
    <div class="neon-main-div"></div>
    <!-- .stage : boite au format EXACT du SVG. Le canvas du fluide s y
         colle en inset:0, donc il suit automatiquement le viewBox. -->
    <div class="stage">
    <canvas id="fx" aria-hidden="true"></canvas>

<!-- viewBox RECADRE, pas decale : le header dessine (y=0..31) est parti
         dans le HTML au-dessus. On coupe la bande, on ne bouge AUCUN y --
         tous les commentaires de calage restent litteralement vrais, et
         « le filet du header est a y=31 » designe desormais le bord haut
         du cadre au lieu d une ligne tracee. -->
    <svg viewBox="0 31 336 181" role="img" aria-label="Card PAC Ecodan : chambre tokamak et circuit d eau">
      <defs>
        <radialGradient id="tk-plasma" cx="50%" cy="50%" r="52%">
          <stop id="tkp0" offset="0%"   stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity=".85"/>
          <stop id="tkp1" offset="34%"  stop-color="rgb(0,255,249)"   stop-opacity=".55"/>
          <stop id="tkp2" offset="72%"  stop-color="rgb(98,0,234)"    stop-opacity=".3"/>
          <stop offset="100%" stop-color="var(--c-chamber-wall, rgb(98,0,234))" stop-opacity="0"/>
        </radialGradient>
        <!-- tore ecrase : CREUX au centre, dense sur la couronne exterieure -->
        <radialGradient id="tk-torus" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="var(--c-filament, rgb(0,255,249))" stop-opacity="0"/>
          <stop offset="58%"  stop-color="var(--c-filament, rgb(0,255,249))" stop-opacity="0"/>
          <stop offset="72%"  stop-color="var(--c-plasma-mid, rgb(124,77,255))" stop-opacity=".3"/>
          <stop offset="86%"  stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity=".6"/>
          <stop offset="96%"  stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity=".28"/>
          <stop offset="100%" stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="tk-ring" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity="0"/>
          <stop offset="76%"  stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity="0"/>
          <stop offset="90%"  stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity=".75"/>
          <stop offset="100%" stop-color="var(--c-plasma-core, rgb(232,224,255))" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="tk-hot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--c-arc-b, rgb(180,0,255))"/><stop offset="100%" stop-color="var(--c-flow-out, rgb(204,255,0))"/>
        </linearGradient>
        <filter id="tk-soft" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="tk-tight" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <clipPath id="tk-clip"><ellipse cx="0" cy="0" rx="57" ry="52"/></clipPath>
        <!-- ===== chrome de la tuile, transpose de .gb / .gb-power du CSS
             d origine. En CSS c etait un fond + ::before (lisere bas en
             inset box-shadow) + ::after (crete haute masquee aux bords).
             En SVG : un degrade lineaire pour le fond, un rect pour le bord,
             un trait bas, et un trait haut a gradient qui s eteint aux
             extremites -> meme lecture, sans pseudo-element. -->
        <linearGradient id="gb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="var(--c-tile-bg, rgb(12,16,32))" stop-opacity=".9"/>
          <stop offset="100%" stop-color="var(--c-tile-bg-deep, rgb(4,6,14))"   stop-opacity=".98"/>
        </linearGradient>
        <!-- .gb::after : mask-image transparent->black 14%..86%->transparent -->
        <linearGradient id="gb-crest" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgb(0,255,249)" stop-opacity="0"/>
          <stop offset="50%"  stop-color="rgb(0,255,249)" stop-opacity=".32"/>
          <stop offset="100%" stop-color="rgb(0,255,249)" stop-opacity="0"/>
        </linearGradient>
        <!-- repris verbatim de buildPowerBlock() : ne pas retoucher stdDeviation -->
        <filter id="f-spark" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- ===== header : DESORMAIS EN HTML au-dessus du SVG =====
           Le bloc canonique (_neonHeaderCss + _buildNeonHeaderHTML) ne peut
           pas vivre ici : il s appuie sur ha-icon, --mdc-icon-size,
           text-shadow et une boite flex -- rien de tout cela n existe dans
           SVG. Il est donc monte en HTML dans .inner, et cette bande y=0..31
           a ete retiree du viewBox. hdr-dot part avec, et ne revient PAS :
           le bloc canonique n a pas de pastille (icone + titre + sous-titre,
           un point final). En rajouter une serait une divergence de plus. -->

      <!-- ===== AIR EXT (gauche) : la valeur EN TETE, plus de label ===== -->
      <g id="air-grp">
        <!-- Chris : « affiche la temperature exterieure en haut a gauche a la
             place du label air ext (pas besoin de label du coup) ».
             Le label est SUPPRIME, pas cache : la valeur porte deja son unite
             (le °) et sa position -- colonne de gauche, au depart des
             particules d admission -- dit l air exterieur. Le label repetait.
             Elle equilibre desormais les autres valeurs en glow, qui sont
             toutes des chiffres nus.

             CALAGE MESURE (y est la LIGNE DE BASE d un <text>, pas le haut) :
               - v-ext monte de 14,25 u au-dessus de sa baseline, descend de
                 4,07 dessous ;
               - le cadre commence a y=31 (viewBox recadre au port du header) ;
               - la premiere particule d admission a son bord haut a y=58,5.
             y=53 -> glyphes de 38,75 a 57,07 : 1,43 u avant la particule.

             LE HALO N EST PLUS BORNE PAR LE CADRE. Il l a ete : tant que
             le SVG heritait de svg:root{overflow:hidden}, tout ce qui
             depassait du viewBox etait tranche net, et Chris a vu cette
             coupure a gauche de la valeur. Le SVG est desormais en
             overflow:visible (cf head.txt) : le glow sort dans .stage puis
             .inner et c est .card qui le borne, 10 u plus loin, avec son
             border-radius -- il s eteint dans le fond au lieu d etre coupe.
             Donc y=53 n est PLUS un plafond impose par le halo. Ce qui borne
             encore, c est le bas : les glyphes finissent a 57,07 et la
             premiere particule d admission commence a 58,50 -- 1,43 u. C est
             cette marge-la qu il faut refaire si on redescend la valeur.

             .ext-glow : il CONTIENT son puits sombre plus les deux passes
             lumineuses. Les cumuler en deux classes ne marcherait pas --
             \`filter\` est une propriete unique, la derniere declaree gagne.
             \`color\` est indispensable en plus de \`fill\` : sur un <text> SVG
             currentColor se resout par \`color\`, jamais par \`fill\`. -->
        <text id="v-ext" class="ext-glow" x="9" y="53" font-family="var(--f-mono)" font-size="16"
              fill="var(--c-ext-temp, rgb(0,255,249))" color="var(--c-ext-temp, rgb(0,255,249))">20.0&#176;C</text>
        <!-- ADMISSION : Chris demande des PARTICULES ASPIREES, pas des
             chevrons qui derivent. Chacune part d un point different de la
             colonne et CONVERGE vers la paroi gauche de la chambre, qui est
             a x=35 (translate(98,107) moins rx=63) -- elle s eteint AVANT
             de la toucher, l air est avale, il ne traverse pas.
             Position par cx/cy, deplacement par transform CSS : poser un
             transform=translate() ici le ferait ecraser par l animation.
             --dx/--dy portent le vecteur propre a chaque particule, sinon
             les quatre repartent en nappe parallele, ce qui etait justement
             le defaut des chevrons. CSS et non SMIL : couvert par
             prefers-reduced-motion. -->
        <g class="intake" fill="var(--c-ext-temp, rgb(0,255,249))" filter="url(#tk-tight)">
          <ellipse cx="9"  cy="60"  rx="1.6" ry="1.5" style="--dx:24px; --dy:44px;  --d:0s"/>
          <ellipse cx="12" cy="70"  rx="1.3" ry="1.2" style="--dx:21px; --dy:35px;  --d:-.26s"/>
          <ellipse cx="9"  cy="80"  rx="1.7" ry="1.6" style="--dx:24px; --dy:25px;  --d:-.52s"/>
          <ellipse cx="13" cy="90"  rx="1.2" ry="1.1" style="--dx:20px; --dy:16px;  --d:-.78s"/>
          <ellipse cx="10" cy="100" rx="1.6" ry="1.5" style="--dx:23px; --dy:7px;   --d:-1.04s"/>
          <ellipse cx="13" cy="108" rx="1.2" ry="1.1" style="--dx:20px; --dy:0px;   --d:-1.3s"/>
          <ellipse cx="9"  cy="116" rx="1.7" ry="1.6" style="--dx:24px; --dy:-8px;  --d:-1.56s"/>
          <ellipse cx="12" cy="126" rx="1.3" ry="1.2" style="--dx:21px; --dy:-17px; --d:-1.82s"/>
          <ellipse cx="10" cy="136" rx="1.6" ry="1.5" style="--dx:23px; --dy:-27px; --d:-2.08s"/>
          <ellipse cx="13" cy="146" rx="1.2" ry="1.1" style="--dx:20px; --dy:-36px; --d:-2.34s"/>
          <ellipse cx="9"  cy="154" rx="1.5" ry="1.4" style="--dx:24px; --dy:-44px; --d:-2.6s"/>
        </g>
        <!-- (v-ext etait ici, en bas de la colonne, sous les particules.
             Il est remonte en tete du groupe : cf le commentaire la-haut.) -->
      </g>

      <!-- ===== LA CHAMBRE (tokamak) : ry 50 -> 58, il respire enfin ===== -->
      <g transform="translate(98,107)">
        <!-- fond quasi transparent : le FLUIDE (canvas dessous) doit se voir a travers.
             Le contour, lui, reste net - c est lui qui dessine la chambre. -->
        <ellipse rx="63" ry="58" fill="color-mix(in srgb, var(--c-chamber-void, rgb(11,8,19)) 18%, transparent)" stroke="color-mix(in srgb, var(--c-chamber-wall, rgb(98,0,234)) 75%, transparent)" stroke-width="1.2"/>
        <ellipse rx="59" ry="54" fill="none" stroke="color-mix(in srgb, var(--c-chamber-inner, rgb(61,0,184)) 60%, transparent)" stroke-width=".8"/>

        <!-- bobines de champ -->
        <g stroke="color-mix(in srgb, var(--c-chamber-wall, rgb(98,0,234)) 30%, transparent)" stroke-width=".8" fill="none">
          <path d="M-46,-37 q46,-11 92,0"/><path d="M-51,-18 q51,-7 102,0"/>
          <path d="M-51,18 q51,7 102,0"/><path d="M-46,37 q46,11 92,0"/>
        </g>

        <g clip-path="url(#tk-clip)">
          <ellipse id="tk-halo" rx="56" ry="51" fill="url(#tk-plasma)" opacity=".05" filter="url(#tk-soft)"/>
          <ellipse id="tk-body" rx="54" ry="49" fill="url(#tk-torus)" opacity=".07"/>
          <!-- COURONNE PERIPHERIQUE : c est ELLE qui s anime -->
          <ellipse id="tk-ring1" rx="53" ry="48" fill="url(#tk-ring)" opacity=".10"/>
          <!-- filaments cantonnes aux FLANCS, centre degage -->
          <g id="tk-fil" opacity=".2" fill="none" stroke="color-mix(in srgb, var(--c-plasma-core, rgb(232,224,255)) 50%, transparent)" stroke-width=".8">
            <path d="M-49,-21 q15,21 0,42"/><path d="M49,-21 q-15,21 0,42"/>
            <path d="M-42,-33 q16,33 0,66"/><path d="M42,-33 q-16,33 0,66"/>
            <path d="M-33,-42 q12,42 0,84"/><path d="M33,-42 q-12,42 0,84"/>
          </g>
          <g id="tk-arcs" opacity=".3" fill="none" stroke-linecap="round">
            <ellipse rx="53" ry="48" stroke="color-mix(in srgb, var(--c-filament, rgb(0,255,249)) 85%, transparent)" stroke-width="1.8"
                     stroke-dasharray="32 286" stroke-dashoffset="0" id="tk-arc-a"/>
            <ellipse rx="53" ry="48" stroke="color-mix(in srgb, var(--c-arc-b, rgb(180,0,255)) 70%, transparent)" stroke-width="1.5"
                     stroke-dasharray="20 298" stroke-dashoffset="159" id="tk-arc-b"/>
          </g>
        </g>

        <!-- divertors -->
        <g id="tk-div">
          <circle cx="0" cy="-50" r="3.4" fill="var(--c-divertor, rgb(0,255,170))" opacity=".35" filter="url(#tk-tight)"/>
          <circle cx="0" cy="50"  r="3.4" fill="var(--c-divertor, rgb(0,255,170))" opacity=".35" filter="url(#tk-tight)"/>
          <circle cx="-35" cy="-40" r="2" fill="var(--c-divertor, rgb(0,255,170))" opacity=".25" filter="url(#tk-tight)"/>
          <circle cx="35"  cy="-40" r="2" fill="var(--c-divertor, rgb(0,255,170))" opacity=".25" filter="url(#tk-tight)"/>
        </g>

        <!-- CENTRE : DELTA T + compresseur, avec de l air entre les deux -->
        <g class="on-plasma" text-anchor="middle" font-family="var(--f-mono)">
          <!-- letter-spacing NEGATIF : v-dt n en avait aucun et n en heritait
               pas, l espacement venait de la chasse fixe de Share Tech Mono.
               Il n y avait donc rien a « reduire » -- il faut retrancher.
               -1.2 sur font-size 31 = ~3,9% de la chasse ; en dessous, le
               point de « -14.0 » se colle au chiffre suivant. -->
          <!-- Chris : « la police faut etre raccord avec le theme ». Ce
               chiffre etait le SEUL gros texte en --f-mono : le titre, la
               consigne et les boutons sont tous en --f-disp. Le theme separe
               les deux roles (affichage / telemetrie) et le plus gros chiffre
               de la card etait du mauvais cote.
               L interlettrage repasse de -1.2 a -0.8 : le -1.2 etait calibre
               sur la chasse FIXE du mono, Orbitron est proportionnelle et
               plus large, la meme valeur collerait les glyphes. -->
          <text id="v-dt" class="dt-glow" y="-2" font-family="var(--f-disp)"
                font-size="31" letter-spacing="-0.8"
                fill="var(--c-dt-value, rgb(176,160,224))" color="var(--c-dt-value, rgb(176,160,224))">0.0</text>
          <!-- Chris : « les caracteres un peu trop espaces ». 1.8 sur 5
               glyphes a font-size 9 = 20% du mot en blanc -> mot delave.
               0.8 garde la lecture « capitale » sans le tasser. -->
          <text y="12" font-size="9" letter-spacing=".8" fill="var(--c-dt-label, rgb(206,196,240))">&#916;T &#176;C</text>
          <text id="v-hz" y="36" font-size="13" fill="var(--c-compressor-hz, rgb(214,150,255))">0 Hz</text>
        </g>
      </g>

      <!-- ===== CIRCUIT D EAU ===== -->
      <!-- ===== LE FLUIDE DES TUYAUX EST DESSINE ICI, PAS DANS LE SHADER =====
           Mesure : la grille de sim fait 152x96, soit 2,21 u SVG par texel ; le
           tuyau fait 3,4 u = 1,54 texel. Le fluide ne peut PAS y tenir : pour
           etre visible, le corridor devait faire 2,1x la largeur du tuyau, donc
           baver a cote. Et le champ des tuyaux ne dependait pas du temps
           (vitesse constante + injection constante = etat stationnaire) : ca ne
           bougeait pas. Les tirets ci-dessous roulent sur le d EXACT du tuyau :
           le raccord est vrai par construction, plus aucune constante a
           resynchroniser avec la geometrie si un coude bouge un jour. -->
      <path id="p-dep" class="pipe" d="M147,76 H186 Q200,76 200,62 H214"
            fill="none" stroke="color-mix(in srgb, var(--c-pipe, rgb(98,0,234)) 45%, transparent)" stroke-width="4.6" stroke-linecap="round"/>
      <path id="p-ret" class="pipe" d="M214,132 H200 Q200,132 186,132 H147"
            fill="none" stroke="color-mix(in srgb, var(--c-pipe, rgb(98,0,234)) 45%, transparent)" stroke-width="4.6" stroke-linecap="round"/>

      <!-- nappe continue : le tuyau ne se vide jamais entre deux bouffees -->
      <path class="flowbed" d="M147,76 H186 Q200,76 200,62 H214" fill="none"
            stroke="url(#tk-hot)" stroke-width="2.6" stroke-linecap="round" opacity=".3"/>
      <path class="flowbed" d="M214,132 H200 Q200,132 186,132 H147" fill="none"
            stroke="var(--c-flow-back, rgb(0,255,249))" stroke-width="2.6" stroke-linecap="round" opacity=".24"/>

      <!-- le flux : deux trains de tirets decales, le sens se LIT au defilement -->
      <g class="flow" fill="none" stroke-linecap="round">
        <path id="f-dep-a" class="flow-dep" d="M147,76 H186 Q200,76 200,62 H214"
              stroke="url(#tk-hot)" stroke-width="2.6"/>
        <path id="f-dep-b" class="flow-dep b" d="M147,76 H186 Q200,76 200,62 H214"
              stroke="var(--c-plasma-core, rgb(232,224,255))" stroke-width="1.1" opacity=".55"/>
        <path id="f-ret-a" class="flow-ret" d="M214,132 H200 Q200,132 186,132 H147"
              stroke="var(--c-flow-back, rgb(0,255,249))" stroke-width="2.6"/>
        <path id="f-ret-b" class="flow-ret b" d="M214,132 H200 Q200,132 186,132 H147"
              stroke="var(--c-plasma-core, rgb(232,224,255))" stroke-width="1.1" opacity=".45"/>
      </g>

      <!-- Depart / retour. Les deux fleches ▶/◀ ont ete RETIREES (demande de
           Chris) : c etait une bequille du temps ou le flux etait fige. Le
           sens se lit maintenant au defilement des tirets, verifie par sonde
           (depart vers la droite, retour vers la gauche) ; la fleche ne
           faisait plus que repeter, et elle occupait la ligne y=58 juste
           sous le tuyau de depart. La couleur porte toujours le reste :
           lime = chaud qui part, cyan = tiede qui revient. -->
      <!-- Ces deux-la brillent dans la card d origine (#sv-dep / #sv-ret,
           l.780-783 : drop-shadow colore + uv-flicker quand elle est
           active). Le glow porte ici la meme information que la couleur :
           lime = chaud qui part, cyan = tiede qui revient. -->
      <g font-family="var(--f-mono)" font-size="12">
        <text id="v-dep" class="neon" x="164" y="70" fill="var(--c-flow-out, rgb(204,255,0))"
              color="var(--c-flow-out, rgb(204,255,0))">25.5&#176;C</text>
        <text id="v-ret" class="neon" x="164" y="128" fill="var(--c-flow-back, rgb(0,255,249))"
              color="var(--c-flow-back, rgb(0,255,249))">25.5&#176;C</text>
      </g>

      <!-- ===== ZONE 1 = LE THERMOSTAT (interactif) =====
           _adjustTemp(+/-0.5) + _updateThermo(). min 10 / max 30.
           Hauteur 76 -> 92 : les boutons ont enfin une vraie cible tactile. -->
      <g id="thermo-block" transform="translate(214,42)" style="cursor:pointer">
        <rect width="110" height="92" rx="6" fill="color-mix(in srgb, var(--c-thermo-bg, rgb(98,0,234)) 10%, transparent)"
              stroke="color-mix(in srgb, var(--c-thermo-border, rgb(98,0,234)) 70%, transparent)" stroke-width="1"/>
        <text id="thermo-mode" x="55" y="16" text-anchor="middle"
              font-family="var(--f-mono)" font-size="8" letter-spacing=".8"
              fill="var(--c-thermo-mode, rgb(196,186,232))">&#9672; &#8212;&#8212;&#8212;</text>
        <!-- Chris : « oui qd meme, ca fait con sinon ». La consigne est la
             valeur la plus importante de la card et la seule sur laquelle on
             agit ; sans halo, a cote d un statut lumineux, elle se lisait
             comme inactive. \`color\` est OBLIGATOIRE en plus de \`fill\` :
             currentColor se resout via color sur un <text> SVG, pas via fill.
             Le drop-shadow porte par le <text> parent couvre aussi le tspan
             du degre -- pas besoin de le traiter separement.
             Volontairement PAS pilote par s.col : une consigne n est pas un
             etat machine, la faire changer de couleur a chaque etat
             signalerait quelque chose qui n existe pas. -->
        <text id="thermo-sp" class="neon" x="55" y="45" text-anchor="middle"
              font-family="var(--f-disp)" font-size="26"
              fill="var(--c-setpoint, rgb(232,224,255))" color="var(--c-setpoint, rgb(232,224,255))">14.0&#176;C</text>
        <text id="thermo-cur" x="55" y="59" text-anchor="middle"
              font-family="var(--f-mono)" font-size="10"
              fill="var(--c-thermo-cur, rgb(0,255,249))">&#8226; 24.8&#176;C</text>
        <g class="tbtn" id="thermo-minus">
          <rect x="8" y="68" width="44" height="18" rx="4" fill="color-mix(in srgb, var(--c-btn-bg, rgb(6,2,20)) 55%, transparent)"
                stroke="color-mix(in srgb, var(--c-btn-minus, rgb(0,255,249)) 55%, transparent)" stroke-width=".9"/>
          <text x="30" y="81" text-anchor="middle" font-family="var(--f-disp)"
                font-size="14" fill="var(--c-btn-minus, rgb(0,255,249))">&#8722;</text>
        </g>
        <g class="tbtn" id="thermo-plus">
          <rect x="58" y="68" width="44" height="18" rx="4" fill="color-mix(in srgb, var(--c-btn-plus, rgb(180,0,255)) 7%, transparent)"
                stroke="color-mix(in srgb, var(--c-btn-plus, rgb(180,0,255)) 60%, transparent)" stroke-width=".9"/>
          <text x="80" y="81" text-anchor="middle" font-family="var(--f-disp)"
                font-size="14" fill="var(--c-btn-plus-glyph, rgb(214,150,255))">+</text>
        </g>
      </g>

      <!-- Ventilateur. Les colonnes REFOUL (discharge_temp) et SURCH
           (discharge_superheat_temp) sont RETIREES : Chris ne savait nommer
           ni l une ni l autre -- « je pense que ca sert rien en fait ».
           C etaient MES abreviations, pas des libelles de la card d origine,
           qui n affiche aucune des deux entites. Ce sont des grandeurs de
           diagnostic frigoriste : elles ne servent pas a piloter la maison,
           et un chiffre qu on ne sait pas nommer ne se lit pas.
           Reste le regime ventilateur, qui se lit sans glossaire. Il passe a
           GAUCHE du bloc (x=0) : garder son ancien x l aurait laisse flotter
           au milieu d un vide, alors que la colonne de gauche s aligne sur
           ZONE 1 juste au-dessus.
           v-disc et v-sh sont supprimes et non caches : un id pilote en JS
           que personne ne voit est un piege pour le prochain passage. -->
      <g font-family="var(--f-mono)" transform="translate(324,154)" text-anchor="end">
        <text x="0" font-size="7" letter-spacing=".5" fill="var(--c-telemetry, rgb(188,176,228))">FAN RPM</text>
        <text id="v-rpm" x="0" y="15" font-size="12" fill="var(--c-dt-value, rgb(176,160,224))">0</text>
      </g>

      <!-- ===== bandeau bas : pastilles d etat + statut ===== -->
      <!-- Les 4 pastilles d etat ont ete retirees a la demande de Chris.
           La place liberee (x=12..60) accueille le libelle du POWER CORE. -->
      <!-- statut : texte lumineux, jamais un badge -->
      <text id="st-txt" class="neon" x="12" y="198" font-family="var(--f-disp)" font-size="12"
            letter-spacing="2" fill="rgb(0,255,170)" color="rgb(0,255,170)">OFF</text>
      <!-- ===== POWER CORE : bloc COMPLET de buildPowerBlock() (card d origine),
           libelle + japonais inclus, comme demande. La place vient des 4
           pastilles retirees. Echelle 1:1 conservee sur la sparkline
           (stdDeviation 1.2 est calee sur ce trait ; reduite, la lueur tourne
           en bouillie). Ce sont des animate SMIL : la regle CSS
           prefers-reduced-motion ne les atteint PAS, ils sont retires en JS
           (cf REDUCED dans le tail). -->
      <!-- LE CADRE. Chris : « la tuile complete du powercore, a l iso ».
           Geometrie : x=106..330, y=176..206 (30 u de haut), rx=8 comme le
           border-radius d origine. Le lisere bas (y=205) est le ::before
           « inset 0 -2px 0 0 var(--power-border) » ; la crete haute
           (y=176,5, de 10% a 90% de la largeur) est le ::after. -->
      <!-- Chris : « powercore fais matcher le color border avec la couleur
           du texte ». Le cadre restait fige en cyan pendant que tout le
           contenu suivait s.col -> meme defaut « moitie/moitie » que celui
           corrige a l interieur, version bordure.
           Les opacites passent sur des attributs DEDIES (stroke-opacity)
           plutot que d etre noyees dans un rgba() : le JS peut alors poser
           s.col en rgb() sans avoir a recalculer l alpha a chaque etat.
           On garde les valeurs relatives d origine (.16 contour, .5 lisere) :
           a plat, le cadre dominerait son propre contenu. -->
      <g id="power-tile">
        <rect id="pwr-frame" x="106" y="176" width="224" height="30" rx="8"
              fill="url(#gb-bg)" stroke="rgb(0,255,249)" stroke-opacity=".16" stroke-width="1"/>
        <path d="M128,176.5 H308" stroke="url(#gb-crest)" stroke-width="1"/>
        <path id="pwr-edge" d="M112,205 H324" stroke="rgb(0,255,249)" stroke-width="1.6"
              stroke-opacity=".5" stroke-linecap="round"/>
      </g>
      <!-- Chris : « power core doit etre entierement vert, pas moitie
           moite ». Dans heat-pump-card.js, .power-lbl (l.696), .power-jp
           (l.697) et .power-val (l.699) prennent TOUTES --helium-power :
           UNE couleur pour toute la tuile, reglable en UI (power_core).
           Ces deux textes etaient figes en ambre pendant que la valeur
           suivait l etat -> d ou la tuile bicolore. Ils portent maintenant
           un id et suivent s.col comme le reste. Les opacites relatives de
           l original sont gardees (.85 / .50) : a plat, le japonais
           concurrencerait la valeur. -->
      <g id="power-lbl" transform="translate(114,188)">
        <text id="pwr-lbl-t" x="0" y="0" font-family="var(--f-mono)" font-size="7.5"
              letter-spacing=".5" fill="rgb(0,255,170)" opacity=".85">&#9656; POWER CORE</text>
        <text id="pwr-lbl-jp" x="0" y="9" font-family="var(--f-mono)" font-size="6"
              letter-spacing=".3" fill="rgb(0,255,170)" opacity=".5">&#12456;&#12493;&#12523;&#12462;&#12540;&#28040;&#36027;</text>
      </g>
      <!-- x=174 et non 196 : mesure, la sparkline finissait a x=276 et la
           valeur commencait a 265 -> 11 u de recouvrement. Dans la card
           d origine la sparkline est centree DERRIERE la valeur
           (position:absolute, z-index 0) ; a plat en SVG ca ne se lit pas,
           donc elle occupe ici la place libre entre libelle et valeur. -->
      <g id="power-core" transform="translate(174,178)">
        <line id="pwr-base" x1="0" y1="13" x2="80" y2="13" stroke="rgb(0,255,170)"
              stroke-opacity=".09" stroke-width="1"/>
        <polyline points="0,13 12,13 18,5 24,20 32,7 38,18 44,10 50,16 56,6 62,19 68,13 80,13"
              fill="none" stroke="rgb(0,255,170)" stroke-width="1.5" stroke-linejoin="round"
              filter="url(#f-spark)" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.9;0.6;0;0;0;0;0;0;0;0;0;0;0.85;0.4;0;0;0;0"
                   dur="3.1s" repeatCount="indefinite" calcMode="discrete"/>
        </polyline>
        <polyline points="15,13 22,13 27,4 33,21 39,9 45,17 51,11 57,13 65,13"
              fill="none" stroke="rgb(0,255,170)" stroke-width="1.2" stroke-linejoin="round"
              filter="url(#f-spark)" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0;0.8;0.3;0;0;0;0;0;0;0;0;0;0;0.7;0.2;0;0;0;0;0;0"
                   dur="4.7s" repeatCount="indefinite" calcMode="discrete"/>
        </polyline>
        <circle cy="13" r="2" fill="rgb(0,255,170)" filter="url(#f-spark)" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0.9;0;0;0;0;0;0;0;0.7;0;0;0;0;0;0"
                   dur="2.3s" repeatCount="indefinite" calcMode="discrete"/>
          <animate attributeName="cx" values="10;25;40;55;70;10"
                   dur="2.3s" repeatCount="indefinite" calcMode="discrete"/>
        </circle>
      </g>
      <!-- x=318 : text-anchor=end n empeche PAS le navigateur d ajouter le
           letter-spacing APRES le dernier glyphe (bbox mesuree a 337.6 quand
           x valait 324, sur une card large de 336). On reste en plus a
           l interieur du cadre, dont le bord droit est a 330.
           La chaine IDLE est celle de la card d origine (U+25B0), pas trois
           carres redessines : sous idle_threshold (20 W par defaut) t-pwr
           affiche IDLE et non la puissance -- l etat idle du banc vaut
           15 W, il tombe donc bien de ce cote du seuil. -->
      <text id="v-pwr" class="neon" x="318" y="197" text-anchor="end" font-family="var(--f-mono)"
            font-size="10" letter-spacing="1" fill="rgb(0,255,170)" color="rgb(0,255,170)">&#9648;&#9648;&#9648; IDLE &#9648;&#9648;&#9648;</text>
    </svg>
    </div><!-- /.stage -->
    </div><!-- /.inner -->
  </div><!-- /.card -->

  <p id="gl-err" hidden></p>`;

/* Valeurs reglees A L OEIL par Chris au banc d essai, curseur par curseur.
   Ce ne sont pas des nombres arbitraires : ne pas les « nettoyer », et ne
   pas les rechoisir au jugé. Elles sont RELUES dans fluid_js.txt au build.
   hzMax / wMax sont des bornes de normalisation PROVISOIRES : la PAC n a
   jamais tourne depuis la mise en place de la telemetrie (compressor_freq
   = 0 sur 8270 releves), donc aucune borne haute n est mesuree a ce jour.
   A recaler a la reprise de chauffe. */
const TCC_PARAMS_DEFAUT = {
    swirl:  1.35,   // vitesse de rotation du plasma
    curl:   0.95,   // turbulence (bruit de curl)
    dye:    0.45,   // debit d injection de matiere. Mesure au banc apres
                    // fermeture du domaine (les corridors de tuyaux ne
                    // servent plus d exutoire) : a 0.70/0.95 le centre
                    // montait a 53/255, PLUS clair que la couronne (40)
                    // -- le tore devenait un blob plein. A 0.45/1.15 :
                    // centre 15.6, couronne 27.7, le creux revient.
    dissip: 1.15,   // dissipation. Relevee pour evacuer ce que les
                    // corridors evacuaient avant (cf dye).
    expo:   1.30,   // exposition

    /* --- flicker sur changement de valeur (Chris, 19/09) ----------------
       Creux d opacite et duree du tressaillement joue a chaque fois qu une
       valeur affichee change. Cale sur uv-flicker de heat-pump-card.js :
       un tremblement irregulier, jamais un clignotement franc. amp=0 rend
       l effet invisible sans le debrancher (utile pour comparer). */
    fk_amp: 0.34,   // creux max : 0.34 => l opacite descend a 0.66
    fk_dur: 420,    // duree totale du tressaillement, en ms

    /* --- couplage a la machine (cf apply() dans le bloc d etat) ----------
       kRate/kMass sont ECRITS par l etat, jamais par un curseur : ce sont
       les deux facteurs 0..1 issus de la frequence compresseur et de la
       puissance. La frame fait `curseur x facteur`, donc les reglages de
       Chris restent valides quelle que soit l allure de la machine.
       hzMax/wMax sont les bornes de normalisation -- reglables, parce
       qu aucune valeur haute reelle n a encore ete observee. */
    kRate:  1.0,    // regime  (frequence compresseur) -> rotation, turbulence
    kMass:  1.0,    // quantite (puissance electrique) -> matiere, exposition
    hzMax:  60,     // borne haute de frequence, a recaler a la chauffe
    wMax:   1500,   // borne haute de puissance, a recaler a la chauffe
    pipe:   0.85,   // cadence du flux dans les tuyaux (tirets SVG)
    ring:   0.55,   // position du coeur de l anneau (0=centre, 1=bord)
    width:  0.17    // epaisseur de l anneau. Mesure au banc : a ring .60 /
                    // width .20 le plasma mordait jusqu a r~.88 et noyait
                    // le "0 Hz" (luminance moyenne 110/255 sous le texte).
};

/* Monte le banc dans le shadow root. Rend une petite API : refresh(hass)
   pour repeindre sur nouvelle telemetrie, reapply() pour le pont de
   l editeur, stop() pour couper la boucle GL quand la card sort du DOM. */
function TCC_MONTER(root, host, params, getCfg, getHass) {
  const api = {};
  let hass = getHass();
  let cfg  = getCfg() || {};

  /* ── moteur de fluide (fluid_js.txt, verbatim au portage DOM pres) ── */
  /* ===========================================================================
     FLUIDE - plasma du tore + eau des tuyaux

     Choix d architecture (tranche apres lecture de neon-climate-card-webgl.js) :
     la card clim resout un Navier-Stokes COMPLET (divergence / pression Jacobi /
     gradient) avec un domaine OUVERT sur les 4 bords. Son propre commentaire dit
     que c etait "LE point qui bloquait tout" : un jet souffle vers le bas a
     besoin que de la masse le remplace par le haut, sinon le solveur de pression
     annule le jet.

     Ma geometrie est l INVERSE : un anneau CONFINE (le tore) + deux canaux
     etroits (les tuyaux). Reprendre ces conditions aux limites applatirait la
     rotation et diluerait la teinte. Donc :

       -> le champ de VITESSE est impose analytiquement a chaque frame
          (rotation tangentielle + bruit de curl), il n y a PAS de passe de
          pression. C est incompressible par construction sur l anneau, et ca ne
          peut structurellement pas produire le "panache anemique" de la v1 clim.
       -> on ne reutilise que ADVECT (transport de la teinte) et un SPLAT
          d injection, qui eux sont geometrie-agnostiques.

     Pieges repris de project_neon_climate_card_webgl (payes une fois la-bas,
     pas deux ici) :
       1. WebGL 1 du WebView Android n a PAS les textures flottantes -> sonder
          WebGL 2 sur un canvas jetable, EXT_color_buffer_float demande AVANT
          tout checkFramebufferStatus.
       2. Dilution DPR -> simulation plafonnee a 1 device-px/CSS-px.
       3. Etat de boucle sur un objet, jamais en closure (sinon flux mort apres
          un deplacement de card).
       4. Erreur d init AFFICHEE sur la page, pas seulement en console.
     =========================================================================== */
  (function(){
    'use strict';

    var cvs = root.getElementById('fx');
    var errBox = root.getElementById('gl-err');
    function fail(msg){
      if (errBox){ errBox.textContent = 'GL: ' + msg; errBox.hidden = false; }
      console.error('[fluide]', msg);
    }
    /* Le hook window.onerror du banc est retire : dans HA il attraperait
       les erreurs des AUTRES cards et les afficherait dans celle-ci. */

    var REDUCED = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Reglages continus : lus a CHAQUE frame (jamais captures au demarrage) --
    var P = Object.assign(params, {
      swirl:  1.35,   // vitesse de rotation du plasma
      curl:   0.95,   // turbulence (bruit de curl)
      dye:    0.45,   // debit d injection de matiere. Mesure au banc apres
                      // fermeture du domaine (les corridors de tuyaux ne
                      // servent plus d exutoire) : a 0.70/0.95 le centre
                      // montait a 53/255, PLUS clair que la couronne (40)
                      // -- le tore devenait un blob plein. A 0.45/1.15 :
                      // centre 15.6, couronne 27.7, le creux revient.
      dissip: 1.15,   // dissipation. Relevee pour evacuer ce que les
                      // corridors evacuaient avant (cf dye).
      expo:   1.30,   // exposition

      /* --- flicker sur changement de valeur (Chris, 19/09) ----------------
         Creux d opacite et duree du tressaillement joue a chaque fois qu une
         valeur affichee change. Cale sur uv-flicker de heat-pump-card.js :
         un tremblement irregulier, jamais un clignotement franc. amp=0 rend
         l effet invisible sans le debrancher (utile pour comparer). */
      fk_amp: 0.34,   // creux max : 0.34 => l opacite descend a 0.66
      fk_dur: 420,    // duree totale du tressaillement, en ms

      /* --- couplage a la machine (cf apply() dans le bloc d etat) ----------
         kRate/kMass sont ECRITS par l etat, jamais par un curseur : ce sont
         les deux facteurs 0..1 issus de la frequence compresseur et de la
         puissance. La frame fait `curseur x facteur`, donc les reglages de
         Chris restent valides quelle que soit l allure de la machine.
         hzMax/wMax sont les bornes de normalisation -- reglables, parce
         qu aucune valeur haute reelle n a encore ete observee. */
      kRate:  1.0,    // regime  (frequence compresseur) -> rotation, turbulence
      kMass:  1.0,    // quantite (puissance electrique) -> matiere, exposition
      hzMax:  60,     // borne haute de frequence, a recaler a la chauffe
      wMax:   1500,   // borne haute de puissance, a recaler a la chauffe
      pipe:   0.85,   // cadence du flux dans les tuyaux (tirets SVG)
      ring:   0.55,   // position du coeur de l anneau (0=centre, 1=bord)
      width:  0.17    // epaisseur de l anneau. Mesure au banc : a ring .60 /
                      // width .20 le plasma mordait jusqu a r~.88 et noyait
                      // le "0 Hz" (luminance moyenne 110/255 sous le texte).
    });

    // --- Shaders (GLSL ES 1.00 : WebGL 2 les compile tels quels) ---------------
    var VERT = [
      'attribute vec2 aPos;',
      'varying vec2 vUv;',
      'void main(){ vUv = aPos*0.5 + 0.5; gl_Position = vec4(aPos,0.0,1.0); }'
    ].join('\n');

    /* Advection semi-lagrangienne : on remonte le champ de vitesse et on
       echantillonne. Seule passe reprise du solveur clim - elle ne depend
       d aucune condition aux limites. */
    var FRAG_ADVECT = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uSource;',
      'uniform vec2 uCenter, uScale;',
      'uniform float uDt, uDissip, uSwirl, uCurl, uRing, uWidth, uTime;',
      '',
      /* Champ de vitesse ANALYTIQUE. r est normalise sur l ellipse du tore, donc
         la rotation suit la forme dessinee dans le SVG au lieu d un cercle. */
      'vec2 field(vec2 p){',
      '  vec2 d = (p - uCenter) / uScale;',
      '  float r = length(d);',
      '  vec2 tang = vec2(-d.y, d.x) / max(r, 0.001);',
      /* poids en cloche centre sur uRing : le plasma tourne SUR la couronne,
         le centre du tore reste creux (parti-pris visuel deja valide) */
      '  float band = exp(-pow((r - uRing)/max(uWidth,0.03), 2.0));',
      '  vec2 v = tang * uSwirl * band;',
      /* bruit de curl : deux sinus dephases -> divergence quasi nulle, donc ca
         tourbillonne sans creer de sources ni de puits */
      '  float n1 = sin(d.y*13.0 + uTime*1.3) * cos(d.x*11.0 - uTime*0.9);',
      '  float n2 = cos(d.x*12.0 - uTime*1.5) * sin(d.y*9.0 + uTime*0.8);',
      /* seconde octave : sans elle le bruit est trop regulier et se lit comme
         une ondulation lente, pas comme de la turbulence */
      '  n1 += 0.5*sin(d.x*23.0 - uTime*2.1);',
      '  n2 += 0.5*cos(d.y*21.0 + uTime*1.9);',
      '  v += vec2(n1, n2) * uCurl * band;',
      /* PLUS DE CORRIDOR DE TUYAU ICI. Mesure : la grille fait 152x96, soit
         2,21 u SVG par texel, alors que le tuyau dessine fait 3,4 u = 1,54
         texel. Pour etre visible, le corridor devait faire 2,1x la largeur du
         tuyau -- donc baver a cote au lieu de couler dedans. Et comme la vitesse
         et l injection y etaient constantes, le corridor etait un etat
         STATIONNAIRE : rien n y bougeait, aucun curseur ne pouvait le corriger.
         Le flux des tuyaux est desormais dessine en SVG, sur le d exact du
         chemin (cf .flow-dep / .flow-ret). uPipe pilote maintenant la CADENCE de
         ces tirets : le curseur reste vivant, il agit ailleurs. */
      '  return v;',
      '}',
      '',
      'void main(){',
      '  vec2 vel = field(vUv);',
      '  vec2 src = vUv - uDt * vel;',
      '  vec4 res = texture2D(uSource, src);',
      '  gl_FragColor = res / (1.0 + uDissip*uDt);',
      '}'
    ].join('\n');

    /* Injection : la matiere nait sur la couronne (le plasma) et aux deux bouches
       des tuyaux, pour que le circuit soit visiblement CONTINU. */
    var FRAG_SPLAT = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uTarget;',
      'uniform vec2 uCenter, uScale;',
      'uniform float uAmount, uTime, uRing, uWidth;',
      'uniform vec3 uColA, uColB;',
      'void main(){',
      '  vec2 d = (vUv - uCenter)/uScale;',
      '  float r = length(d);',
      '  float a = atan(d.y, d.x);',
      /* bouffees irregulieres le long de la couronne : sinon la teinte forme un
         anneau uniforme, illisible comme mouvement */
      '  float puff = 0.5 + 0.5*sin(a*3.0 + uTime*1.6) * sin(a*5.0 - uTime*1.1);',
      '  float band = exp(-pow((r - uRing)/max(uWidth,0.03), 2.0));',
      '  float emit = band * puff;',
      /* bouches des tuyaux : raccorde visuellement tore <-> circuit */
      /* Les deux points chauds ou les tuyaux se greffent sur la chambre. Ils
         etaient a x=0.452 : la bouche haute tombait a length(d)=1.009, soit
         DEHORS -- masquee a zero des que les corridors ont quitte le masque.
         Rentrees a 0.419 (length 0.86), alignees sur la hauteur des vrais
         tuyaux (y=76 et y=132 SVG) : c est ce point chaud qui vend la jonction
         maintenant que les tirets SVG portent le flux. */
      '  emit += 0.50*exp(-pow((vUv.x-0.419)/0.022,2.0) - pow((vUv.y-0.358)/0.022,2.0));',
      '  emit += 0.50*exp(-pow((vUv.x-0.419)/0.022,2.0) - pow((vUv.y-0.623)/0.022,2.0));',
      '  vec3 col = mix(uColA, uColB, clamp(r/max(uRing+uWidth,0.1), 0.0, 1.0));',
      '  gl_FragColor = vec4(texture2D(uTarget, vUv).rgb + col*emit*uAmount, 1.0);',
      '}'
    ].join('\n');

    var FRAG_SHOW = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uTex;',
      'uniform vec2 uHalo;',
      'uniform vec2 uCenter, uScale;',
      'uniform float uExpo;',
      /* CONFINEMENT. Sans ce masque le fluide peint partout ou la teinte a
         diffuse : mesure au banc = 23% de pixels chauds HORS du tore, qui
         mangeaient AIR EXT et les chevrons. Le plasma n existe que DANS la
         chambre -- les corridors de tuyaux ont ete retires du masque, le flux
         des tuyaux etant desormais dessine en SVG. */
      'float chamber(vec2 p){',
      '  vec2 d = (p - uCenter)/uScale;',
      '  float e = 1.0 - smoothstep(0.80, 1.0, length(d));',
      /* corridors : etroits en y, ouverts vers la droite jusqu au thermostat */
      /* Le masque se limite desormais a la CHAMBRE : les corridors de tuyau en
         ont ete retires, le flux des tuyaux etant dessine en SVG. Effet de bord
         voulu : plus rien ne peut deborder sur AIR EXT ni sous le thermostat. */
      '  return clamp(e, 0.0, 1.0);',
      '}',
      'void main(){',
      '  vec3 c = texture2D(uTex, vUv).rgb;',
      '  float dens = max(max(c.r,c.g),c.b);',
      '  vec3 hue = c / max(dens, 0.0008);',
      /* halo en croix : du volume sans passe de flou separee */
      '  vec3 h = texture2D(uTex, vUv+vec2(uHalo.x,0.0)).rgb',
      '         + texture2D(uTex, vUv-vec2(uHalo.x,0.0)).rgb',
      '         + texture2D(uTex, vUv+vec2(0.0,uHalo.y)).rgb',
      '         + texture2D(uTex, vUv-vec2(0.0,uHalo.y)).rgb;',
      '  h *= 0.25;',
      '  float densH = max(max(h.r,h.g),h.b);',
      /* Reponse NON saturante. La v1 utilisait smoothstep(.03,.26) : tout le
         tore passait au-dessus de .26 donc tout etait blanc plat -- le DeltaT
         devenait illisible par-dessus. Une courbe douce garde du contraste
         entre filaments et fond sur toute la plage. */
      '  float core = 1.0 - exp(-dens*2.3);',
      '  float halo = 1.0 - exp(-densH*1.7);',
      '  float m = chamber(vUv);',
      '  vec3 col = (hue*core*0.80 + hue*halo*0.42) * uExpo * m;',
      '  float al = clamp(max(max(col.r,col.g),col.b)*0.95, 0.0, 0.72);',
      '  gl_FragColor = vec4(col, al);',
      '}'
    ].join('\n');

    // --- Plomberie GL (reprise de neon-climate-card-webgl, pieges inclus) ------
    var OPTS = {alpha:true, depth:false, stencil:false,
                antialias:false, preserveDrawingBuffer:false};

    function gl2Supported(){
      try {
        var probe = document.createElement('canvas');
        probe.width = probe.height = 2;
        var p2 = probe.getContext('webgl2', OPTS);
        var ok = !!(p2 && p2.getExtension('EXT_color_buffer_float'));
        if (p2){ var lose = p2.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); }
        return ok;
      } catch(e){ return false; }
    }

    var gl = null, isGL2 = false;
    /* Un canvas ne donne qu UN type de contexte a vie : on sonde sur un canvas
       jetable avant de toucher au vrai. */
    if (gl2Supported()){
      gl = cvs.getContext('webgl2', OPTS);
      isGL2 = !!gl;
      /* l extension AVANT tout checkFramebufferStatus, sinon le format n est pas
         encore rendable et le FBO se declare incomplet (piege paye une fois) */
      if (gl) gl.getExtension('EXT_color_buffer_float');
    }
    if (!gl) gl = cvs.getContext('webgl', OPTS) || cvs.getContext('experimental-webgl', OPTS);
    if (!gl){ fail('WebGL indisponible'); return; }

    var texInternal, texType, filtering;
    if (isGL2){
      texInternal = gl.RGBA16F; texType = gl.HALF_FLOAT; filtering = gl.LINEAR;
    } else {
      texInternal = gl.RGBA;
      var hf = gl.getExtension('OES_texture_half_float');
      gl.getExtension('EXT_color_buffer_half_float');
      if (hf){
        texType = hf.HALF_FLOAT_OES;
        filtering = gl.getExtension('OES_texture_half_float_linear') ? gl.LINEAR : gl.NEAREST;
      } else {
        if (!gl.getExtension('OES_texture_float')){ fail('texture flottante indisponible'); return; }
        texType = gl.FLOAT;
        filtering = gl.getExtension('OES_texture_float_linear') ? gl.LINEAR : gl.NEAREST;
      }
    }

    function compile(src, type){
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error('shader: ' + gl.getShaderInfoLog(sh));
      return sh;
    }
    function link(vs, fs){
      var p = gl.createProgram();
      gl.attachShader(p, compile(vs, gl.VERTEX_SHADER));
      gl.attachShader(p, compile(fs, gl.FRAGMENT_SHADER));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error('link: ' + gl.getProgramInfoLog(p));
      return p;
    }

    var pAdv, pSplat, pShow;
    try {
      pAdv   = link(VERT, FRAG_ADVECT);
      pSplat = link(VERT, FRAG_SPLAT);
      pShow  = link(VERT, FRAG_SHOW);
    } catch(e){ fail(e.message); return; }

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    function use(p){
      gl.useProgram(p);
      var a = gl.getAttribLocation(p, 'aPos');
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    }
    function U(p, names){
      var o = {}; names.forEach(function(n){ o[n] = gl.getUniformLocation(p, n); }); return o;
    }
    var uAdv  = U(pAdv,  ['uSource','uCenter','uScale','uDt','uDissip',
                          'uSwirl','uCurl','uRing','uWidth','uTime']);
    var uSpl  = U(pSplat,['uTarget','uCenter','uScale','uAmount','uTime','uRing',
                          'uWidth','uColA','uColB']);
    var uShow = U(pShow, ['uTex','uHalo','uExpo','uCenter','uScale']);

    function createFBO(w,h){
      gl.activeTexture(gl.TEXTURE0);
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, texInternal, w, h, 0, gl.RGBA, texType, null);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      var st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error('FBO incomplet 0x'+st.toString(16));
      gl.viewport(0,0,w,h); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      return {tex:tex, fbo:fbo, w:w, h:h};
    }

    /* Dimensionnement : DPR plafonne a 1 (piege #2 de la card clim - une texture
       dimensionnee sur le backing-store dilue l effet sur ecran dense et coute
       4 a 7x plus cher pour un rendu MOINS visible). */
    var CSS_W = 336, CSS_H = 212;
    var dpr = Math.min(window.devicePixelRatio || 1, 1);
    cvs.width  = Math.round(CSS_W * dpr);
    cvs.height = Math.round(CSS_H * dpr);

    /* Grille a texels ~carres : la v1 de la card clim mettait du 96x96 sur une
       bande 8:1 et "le fluide ne ressemblait a rien". Ici 336x212 ~ 1.58:1. */
    var simH = 96, simW = Math.round(simH * CSS_W / CSS_H);
    var dyeA, dyeB;
    try { dyeA = createFBO(simW, simH); dyeB = createFBO(simW, simH); }
    catch(e){ fail(e.message); return; }

    function swap(){ var t = dyeA; dyeA = dyeB; dyeB = t; }
    function bind(t){
      gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
      gl.viewport(0, 0, t ? t.w : cvs.width, t ? t.h : cvs.height);
    }
    function draw(){ gl.drawArrays(gl.TRIANGLES, 0, 3); }

    /* Geometrie du tore, en UV - derivee du SVG (viewBox 336x212, centre 98,107,
       rx 63 ry 58). Toute la physique suit donc la forme DESSINEE : si le SVG
       bouge, ces deux lignes suffisent a resynchroniser. */
    var C  = [98/336, 107/212];
    var SC = [63/336,  58/212];

    var COL_A = [0.55, 1.00, 0.98];   // coeur cyan
    var COL_B = [0.62, 0.15, 1.00];   // bord violet
    api.colors = {a: COL_A, b: COL_B};

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    var t0 = performance.now(), last = t0;
    /* Etat de boucle porte par un objet, PAS une closure : piege #3 de la card
       clim (un flag en closure que disconnectedCallback ne peut pas remettre a
       false laisse le flux mort apres un deplacement de card). */
    var loop = { running: true, raf: 0 };
    api.loop = loop;
    var lastPipe = -1;                    // cache : on n ecrit le CSS que si ca bouge

    function step(dt, time){
      // --- injection ---
      bind(dyeB);
      use(pSplat);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dyeA.tex);
      gl.uniform1i(uSpl.uTarget, 0);
      gl.uniform2f(uSpl.uCenter, C[0], C[1]);
      gl.uniform2f(uSpl.uScale,  SC[0], SC[1]);
      // la puissance electrique porte la QUANTITE de matiere injectee
      gl.uniform1f(uSpl.uAmount, P.dye * P.kMass * dt * 3.0);
      gl.uniform1f(uSpl.uTime,   time);
      gl.uniform1f(uSpl.uRing,   P.ring);
      gl.uniform1f(uSpl.uWidth,  P.width);
      gl.uniform3f(uSpl.uColA, COL_A[0], COL_A[1], COL_A[2]);
      gl.uniform3f(uSpl.uColB, COL_B[0], COL_B[1], COL_B[2]);
      draw(); swap();

      // --- advection ---
      bind(dyeB);
      use(pAdv);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dyeA.tex);
      gl.uniform1i(uAdv.uSource, 0);
      gl.uniform2f(uAdv.uCenter, C[0], C[1]);
      gl.uniform2f(uAdv.uScale,  SC[0], SC[1]);
      gl.uniform1f(uAdv.uDt,     dt);
      gl.uniform1f(uAdv.uDissip, P.dissip);
      // la frequence compresseur porte le REGIME : ca tourne plus vite et
      // ca brasse plus. Curseur x facteur, jamais le facteur seul.
      gl.uniform1f(uAdv.uSwirl,  P.swirl * P.kRate);
      gl.uniform1f(uAdv.uCurl,   P.curl  * (0.4 + 0.6 * P.kRate));
      gl.uniform1f(uAdv.uRing,   P.ring);
      gl.uniform1f(uAdv.uWidth,  P.width);
      /* P.pipe ne va plus au shader (le fluide a quitte les tuyaux) : il pilote
         desormais la CADENCE des tirets SVG. Ecrit dans une variable CSS plutot
         qu en dur sur chaque element : une seule ecriture, le CSS fait le reste.
         Duree de reference 1.9s a pipe=0.85 -> facteur 1.615. */
      if (P.pipe !== lastPipe) {
        lastPipe = P.pipe;
        var k = 1.615 / Math.max(P.pipe, 0.05);
        var rt = (root.querySelector('.card') || cvs).style;
        rt.setProperty('--fdep',  (k).toFixed(3) + 's');
        rt.setProperty('--fdepb', (k * 0.668).toFixed(3) + 's');
        rt.setProperty('--fret',  (k * 1.158).toFixed(3) + 's');
        rt.setProperty('--fretb', (k * 0.784).toFixed(3) + 's');
      }
      gl.uniform1f(uAdv.uTime,   time);
      draw(); swap();
    }

    function show(){
      bind(null);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      use(pShow);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dyeA.tex);
      gl.uniform1i(uShow.uTex, 0);
      gl.uniform2f(uShow.uHalo, 1.6/simW, 1.6/simH);
      /* L exposition suit la puissance, mais COMPRIMEE (0.55 + 0.45x) : a
         plat elle ferait disparaitre le tore a l arret, alors qu il doit
         rester visible en veille -- juste plus sombre. */
      gl.uniform1f(uShow.uExpo, P.expo * (0.55 + 0.45 * P.kMass));
      /* la geometrie de la chambre doit suivre l ellipse DESSINEE, sinon le
         masque de confinement rogne ou laisse fuir */
      gl.uniform2f(uShow.uCenter, C[0], C[1]);
      gl.uniform2f(uShow.uScale,  SC[0], SC[1]);
      draw();
      gl.disable(gl.BLEND);
    }

    function frame(now){
      if (!loop.running) return;
      var dt = Math.min((now - last)/1000, 1/30); last = now;
      step(dt, (now - t0)/1000);
      show();
      loop.raf = requestAnimationFrame(frame);
    }

    /* Amorcage : quelques pas a vide pour que la PREMIERE image montree soit deja
       un fluide etabli - la page doit etre lisible au repos, pas partir d un
       ecran vide qui se remplit lentement. */
    try {
      for (var i = 0; i < 110; i++) step(1/60, i/60);
      show();
    } catch(e){ fail(e.message); return; }

    if (!REDUCED){
      last = performance.now();
      loop.raf = requestAnimationFrame(frame);
    } else {
      loop.running = false;   // une seule image, pas d animation
    }
  })();

  /* ── couche d etat (tail.txt, verbatim au portage DOM pres) ───────── */
    /* ===== LES COULEURS D ETAT VIENNENT DE LA PALETTE ====================
       Mesure du 19/09 : `--c-state-*` etait declaree dans .card et lue par
       PERSONNE -- les trois etats portaient leurs litteraux en dur ici. Trois
       champs d editeur qui n auraient rien pilote, la faute meme que la table
       des occurrences existe pour empecher.

       Ca compte plus que trois teintes : `s.col` repeint une quinzaine
       d elements (st-txt, pwr-frame, pwr-edge, les stops de #gb-crest, le
       sparkline, v-pwr...). Tant qu il etait litteral, tout ce bas de card
       echappait a la palette. Branche, il y entre par 3 cles.

       On RESOUT au moment de l usage, pas au chargement : `cs()` est appele
       depuis apply(), donc un setProperty de l editeur est pris en compte au
       changement d etat suivant sans recharger la card. */
    var _etat = 'idle';
    var _card = root.querySelector('.card');
    function cs(nom, secours){
      try {
        var v = getComputedStyle(_card).getPropertyValue('--c-' + nom).trim();
        return v || secours;
      } catch(e){ return secours; }
    }

    var S = {
      idle:{ label:'Idle (réel, maintenant)', st:'OFF', col:'rgb(0,255,170)', kCol:'state-off',
        ext:'20.0°', dep:'25.5°', ret:'25.5°', rpm:'0', hz:'0 Hz', pwr:'15 W', dt:'0.0',
        /* hzN/wN : valeurs NUMERIQUES pour piloter le plasma. Elles doublent
           hz/pwr au lieu de les parser -- parseFloat('1 240 W') rend 1, parce
           que l espace est un separateur de milliers. Le plasma aurait paru
           mort et on aurait cherche le bug dans le shader. */
        hzN:0, wN:15,
        disc:'24.0°', sh:'3.0 K',
        halo:.1, body:.16, col2:.18, fil:.12, div:.3, pipe:.22, dots:0, pulse:0,
        arcs:0, arcDur:9,
        c1:'rgb(124,77,255)', c2:'rgb(98,0,234)', kC:'idle',
        mode:'◈ OFF', cur:'24.8°C',
        segs:{def:0,boo:0,lock:0,pump:0} },
      run:{ label:'En chauffe', st:'HEAT', col:'rgb(204,255,0)', kCol:'state-heat',
        ext:'4.5°', dep:'38.0°', ret:'32.5°', rpm:'620', hz:'46 Hz', pwr:'1 240 W', dt:'5.5',
        hzN:46, wN:1240,
        disc:'68.0°', sh:'5.5 K',
        halo:.62, body:.95, col2:.9, fil:.6, div:1, pipe:1, dots:1, pulse:1,
        arcs:.85, arcDur:3.2,
        c1:'rgb(0,255,249)', c2:'rgb(180,0,255)', kC:'run',
        mode:'◈ HEAT', cur:'19.4°C',
        segs:{def:0,boo:.9,lock:0,pump:1} },
      def:{ label:'Dégivrage', st:'DEFROST', col:'rgb(255,184,0)', kCol:'state-defrost',
        ext:'1.0°', dep:'12.0°', ret:'26.0°', rpm:'0', hz:'28 Hz', pwr:'860 W', dt:'-14.0',
        hzN:28, wN:860,
        disc:'42.0°', sh:'1.5 K',
        halo:.34, body:.5, col2:.5, fil:.3, div:.5, pipe:.6, dots:1, pulse:1,
        arcs:.5, arcDur:5.5,
        c1:'rgb(255,184,0)', c2:'rgb(98,0,234)', kC:'def',
        mode:'◈ HEAT', cur:'19.1°C',
        segs:{def:1,boo:0,lock:0,pump:1} }
    };

    /* ══ LECTURE DE hass ══════════════════════════════════════════════════
       Rend un objet aux cles EXACTES de S. Une cle manquante ne jetterait
       pas : setAttribute('opacity', undefined) est un no-op silencieux, qui
       se lit comme un choix esthetique et pas comme une panne. D ou la garde
       de build qui compare ce jeu de cles a celui de S.

       Les opacites (halo/body/col2/fil/div/pipe/arcs/arcDur) restent les
       CONSTANTES par etat reglees a l oeil par Chris au banc. Les interpoler
       inventerait des valeurs qu il n a jamais validees. Seuls hzN et wN sont
       continus -- parce que le banc les a deja faits continus (kRate/kMass).
       ══════════════════════════════════════════════════════════════════ */
    function num(id){
      var s = id && hass && hass.states[id];
      if (!s) return null;
      var v = parseFloat(String(s.state).replace(',', '.'));
      return isNaN(v) ? null : v;
    }
    function str(id){
      var s = id && hass && hass.states[id];
      return s ? String(s.state) : null;
    }
    /* Un degre affiche : « 20.0° ». null -> tiret, jamais « null° » ni NaN. */
    function deg(v, d){
      return (v == null) ? '--' : v.toFixed(d == null ? 1 : d) + '°';
    }

    function readState(){
      var ent = (cfg.entities || {});
      var hz   = num(ent.comp_freq);
      var watt = num(ent.power);
      var dep  = num(ent.temp_water_out);
      var ret  = num(ent.temp_water_ret);
      var mode = (str(ent.status) || '').toLowerCase();

      /* L ARRET se lit sur la frequence compresseur, pas sur la puissance :
         en veille la PAC tire 8-9 W carte allumee. Etabli le 28/08/2026. */
      var tourne = (hz != null && hz > 0);

      /* DEGIVRAGE : SUPPOSE, pas mesure. compressor_freq vaut 0 sur les 8270
         releves connus, donc la graphie reelle de operation_mode en degivrage
         n est pas verifiable aujourd hui. On accepte plusieurs graphies, et
         tout mode inconnu retombe sur idle/run -- jamais d exception. */
      var degivre = /defrost|degivr/.test(mode);

      var cle = !tourne ? 'idle' : (degivre ? 'def' : 'run');
      var base = S[cle];

      /* Object.create : on garde les constantes visuelles de l etat (reglees
         au banc) et on ne surcharge QUE les valeurs lues sur la machine. */
      var s = Object.create(base);
      var dt = (dep != null && ret != null) ? (dep - ret) : null;

      s.ext  = deg(num(ent.temp_outside));
      s.dep  = deg(dep);
      s.ret  = deg(ret);
      s.rpm  = (num(ent.fan_rpm) == null) ? '--' : String(Math.round(num(ent.fan_rpm)));
      s.hz   = (hz == null) ? '-- Hz' : Math.round(hz) + ' Hz';
      s.dt   = (dt == null) ? '0.0' : dt.toFixed(1);
      /* pwr garde le format du banc (« 1 240 W ») : apply() le reparse pour
         decider du mode IDLE de la tuile, en retirant les separateurs. */
      s.pwr  = (watt == null) ? '-- W'
             : String(Math.round(watt)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' W';

      /* Les deux SEULES grandeurs continues : elles pilotent le plasma, et le
         banc les prend deja normalisees. */
      s.hzN  = hz   || 0;
      s.wN   = watt || 0;

      /* Le plasma s arrete avec le compresseur -- meme drapeau que la
         sparkline et le glow, pas une seconde notion d arret. */
      s.pulse = tourne ? 1 : 0;
      s.dots  = tourne ? 1 : 0;

      /* Thermostat : le mode et la temperature de piece viennent du climate. */
      var cl = cfg.climate && hass && hass.states[cfg.climate];
      if (cl) {
        var hvac = String(cl.state).toLowerCase();
        s.mode = '◈ ' + (hvac === 'off' ? 'OFF' : hvac.toUpperCase());
        var cur = cl.attributes && cl.attributes.current_temperature;
        s.cur  = (cur == null) ? '--' : Number(cur).toFixed(1) + '°C';
        var sp = cl.attributes && cl.attributes.temperature;
        if (sp != null) setpoint = Number(sp);
      }
      return s;
    }

    var $ = function(id){ return root.getElementById(id); };
    var btns = {};   /* pas de boutons dans la card : l etat vient de hass */

    // --- reglage de consigne : reprend _adjustTemp() de la card d'origine ---
    // climate.ecodan_heatpump_virtual_thermostat_z1 : min_temp 10 / max_temp 30.
    // Pas de 0.5 (comme la card), meme si target_temp_step vaut 0.1 cote HA.
    var SP_MIN = 10, SP_MAX = 30, SP_STEP = 0.5;
    var setpoint = 14.0;

    /* ====================== FLICKER SUR CHANGEMENT =========================
       Chris : « flicker sur changement de valeur (sur toutes les valeurs) ».

       set() est le SEUL point d ecriture des valeurs affichees : il ecrit, et
       ne fait clignoter que si le texte a REELLEMENT change. apply() reecrit
       les 9 champs a chaque bascule alors que plusieurs sont identiques d un
       etat a l autre (thermo-mode vaut « HEAT » en run ET en def, v-rpm vaut
       « 0 » en idle ET en def) : sans cette comparaison on ferait clignoter
       des chiffres immobiles, soit exactement l inverse de la demande.

       Trois gardes, chacune pour une panne vue ou prevue :

       1. FIRST : apply('idle') tourne au chargement et comparerait aux
          valeurs de remplissage du SVG (20.0°, 25.5°...), dont plusieurs
          different -> salve de flickers sur la toute premiere frame, donc
          dans la vignette de l Artifact et dans n importe quelle capture.

       2. REDUCED : la regle CSS @media de head.txt ne couvre PAS la Web
          Animations API (meme angle mort que le SMIL du power core). On
          recalcule le media query ici : celui de fluid_js.txt vit dans une
          IIFE separee, le partager demanderait une globale pour deux lignes.

       3. el.animate() plutot qu une classe CSS : re-ajouter une classe deja
          presente NE RELANCE PAS une animation CSS. renderSp() reecrit la
          consigne a chaque clic sur « + » -- en classe, trois clics rapides
          ne donneraient qu un seul flash. animate() repart de zero a chaque
          appel, sans hack de reflow.

       On anime l OPACITE et non le filtre : v-ext, v-dt et le groupe central
       portent tous un `filter` pose par classe, qu une animation de filter
       ecraserait. Amplitude reglee au banc (curseurs fk_amp / fk_dur) et
       calee sur uv-flicker de la card d origine : un tressaillement irregulier,
       jamais un clignotement franc. */
    var FLICK_REDUCED = window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var flickFirst = true;

    function flick(el){
      if (!el || flickFirst || FLICK_REDUCED) return;
      var a = (params && params.fk_amp  != null) ? params.fk_amp  : 0.34;
      var d = (params && params.fk_dur  != null) ? params.fk_dur  : 420;
      var lo = 1 - a;                       /* amp 0 => aucun creux visible */
      el.animate([
        { opacity: 1 }, { opacity: lo },      { opacity: 1 },
        { opacity: lo + (1 - lo) * 0.45 },  { opacity: 1 },
        { opacity: lo + (1 - lo) * 0.75 },  { opacity: 1 }
      ], { duration: d, easing: 'steps(1, end)' });
    }

    /* Ecrit `txt` dans l element `id` et ne le fait clignoter que s il change.
       `cmp` permet de comparer autre chose que textContent -- indispensable
       pour thermo-sp, dont renderSp() append un tspan « ° » apres coup : son
       textContent vaut « 14.0° » la ou on ecrit « 14.0 », donc une comparaison
       naive serait TOUJOURS vraie et la consigne clignoterait meme sur un clic
       qui ne change rien (« - » deja a SP_MIN). */
    function set(id, txt, cmp){
      var el = $(id);
      if (!el) return null;
      var was = (cmp != null) ? cmp : el.textContent;
      el.textContent = txt;
      if (String(was) !== String(txt)) flick(el);
      return el;
    }

    function renderSp(){
      var t = $('thermo-sp');
      /* Le nombre AVANT reecriture : t.textContent porte encore le « ° » du
         tspan precedent, on ne peut pas le comparer tel quel. */
      var prev = parseFloat(t.textContent);
        var next = setpoint.toFixed(1) + '\u00B0C';
      t.textContent = next;
      /* next porte desormais « °C » : comparer prev.toFixed(1) (un
         nombre nu) a next serait TOUJOURS vrai et la consigne
         clignoterait a chaque tick. On compare des nombres. */
      if (!isNaN(prev) && prev.toFixed(1) !== setpoint.toFixed(1)) flick(t);
      /* Le degre etait un tspan font-size 12 appende ici : un EXPOSANT,
         et sans le C, alors que tout le reste de la card ecrit °C a la
         taille du texte (Chris, 20/09). On ecrit desormais l unite dans
         la chaine, donc plus aucun enfant a recreer -- et le piege du
         cs() cuit dans l attribut disparait avec lui. */
    }

    function adjust(delta){
      var next = Math.round((setpoint + delta) * 2) / 2;
      setpoint = Math.min(SP_MAX, Math.max(SP_MIN, next));
      renderSp();
      /* On ECRIT dans HA. Le rendu reste optimiste (renderSp() vient
         d etre appele juste au-dessus) : HA confirmera au tick suivant
         via readState(), ou corrigera si le thermostat refuse la
         valeur. Sans cet appel, depuis le correctif de apply(), le
         nombre reviendrait en arriere en clignotant apres chaque clic. */
      if (hass && hass.callService && cfg.climate) {
        hass.callService('climate', 'set_temperature',
                         { entity_id: cfg.climate, temperature: setpoint });
      }
    }

    ['minus','plus'].forEach(function(k){
      var el = $('thermo-' + k);
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
      el.setAttribute('aria-label', k === 'plus' ? 'Augmenter la consigne' : 'Baisser la consigne');
      var go = function(e){ e.stopPropagation(); adjust(k === 'plus' ? 0.5 : -0.5); };
      el.addEventListener('click', go);
      el.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); }
      });
    });
    renderSp();

    function apply(s){
      _etat = s;   /* memorise pour __reapply() */
      /* On copie l etat et on RE-RESOUT ses couleurs a chaque appel.
         Premiere version : cs() etait appele dans le litteral S, donc evalue
         UNE fois a la construction de l objet -- les couleurs etaient figees
         avant qu un setProperty de l editeur puisse mordre, et les 9 cles
         ressortaient muettes au banc. Le commentaire promettait pourtant
         l inverse : c est la mesure qui a tranche, pas la relecture. */
      /* Les couleurs sont RE-RESOLUES a chaque appel, jamais figees a la
         construction : c est ce qui rend les 9 cles d etat de l editeur
         vivantes sans rechargement (mesure au banc, cf __reapply). */
      s = Object.create(s);
      s.col = cs(s.kCol, s.col);
      s.c1  = cs(s.kC + '-c1', s.c1);
      s.c2  = cs(s.kC + '-c2', s.c2);
      /* La consigne est une DONNEE live : readState() la lit depuis le
         climate, mais renderSp() n etait appele qu au montage et dans
         adjust() (clic +/-). apply() est le SEUL chemin de refresh
         (api.refresh -> apply(readState())) : sans ce rappel la
         consigne reste figee sur le litteral du SVG (14.0), sans
         erreur et sans qu aucune garde de forme puisse le voir.
         Sans risque : renderSp() compare l ancien texte avant flick(),
         donc un tick sans changement reste silencieux. */
      renderSp();

      set('v-ext', s.ext);
      set('v-dep', s.dep);
      set('v-ret', s.ret);
      set('v-rpm', s.rpm);
      set('v-hz',  s.hz);
      /* La card d origine n affiche PAS la puissance sous idle_threshold
         (20 W par defaut) : elle ecrit la chaine IDLE, et .power-val.is-idle
         reduit la taille et ouvre le letter-spacing. On reproduit les deux,
         sinon la tuile n est a l iso que dans l etat ou on l a capturee.
         s.pwr est de la forme « 1 240 W » / « 15 W » -> on relit le nombre en
         retirant les espaces (y compris l espace fine de milliers). */
      var wattStr = String(s.pwr).replace(/[^0-9.,]/g, '').replace(',', '.');
      var pwrIdle = (parseFloat(wattStr) || 0) < 20;
      /* set() d abord (il compare puis ecrit), les attributs ensuite : ils ne
         doivent pas entrer dans le test d egalite, seul le TEXTE compte. */
      var vp = set('v-pwr', pwrIdle ? '\u25B0\u25B0\u25B0 IDLE \u25B0\u25B0\u25B0' : s.pwr);
      vp.setAttribute('font-size',      pwrIdle ? '10' : '14');
      vp.setAttribute('letter-spacing', pwrIdle ? '1'  : '0');
      /* POWER CORE : le sparkline suit le COMPRESSEUR, comme dans
         heat-pump-card.js ligne 1205 (`d.spark.style.opacity = compOn ? '.7'
         : '0'`). Il claquait ici a l arret -- mesure : opacites 0/0.2/0.7/0.9
         relevees pendant que la card affichait « IDLE ». Ce n etait pas un
         choix, c etait cette ligne-la oubliee au portage de la tuile.
         On eteint le GROUPE et non les <animate> : le SMIL est hors de portee
         du CSS, et l opacite de base des trois elements vaut 0 -- les retirer
         laisserait un TROU a la place du sparkline au lieu d un repos.
         s.pulse et non s.dots : pulse = compresseur (il porte deja la
         respiration de la couronne), dots = pompe. L original lit bien le
         compresseur ; le seuil idle_threshold, lui, ne pilote que le TEXTE. */
      $('power-core').setAttribute('opacity', s.pulse ? '.7' : '0');

      /* Seule la VALEUR change ici. La COULEUR est figee (Chris : « on va pas
         la changer avec le mode »). Elle est posee une fois dans le SVG, en
         fill ET en color -- .dt-glow tire son halo de currentColor, qui se
         resout via color et non via fill. dtCol a disparu des etats : un
         champ que plus rien ne lit est un piege pour le prochain passage. */
      set('v-dt', s.dt);
      /* v-disc (REFOUL) et v-sh (SURCH) sont retires du SVG : les piloter ici
         jetterait une TypeError sur null, qui casserait TOUT le changement
         d etat et pas seulement ces deux chiffres. Les champs disc/sh des
         etats restent en place, inutilises, s ils devaient revenir. */

      set('thermo-mode', s.mode);
      set('thermo-cur',  s.cur);

      set('st-txt', s.st);
      /* fill ET color : le glow de .neon est en currentColor, qui sur un
         <text> SVG se resout via `color` et non via `fill`. Poser le seul
         fill donnerait un texte de la bonne couleur avec un halo noir. */
      $('st-txt').setAttribute('fill',  s.col);
      $('st-txt').setAttribute('color', s.col);
      /* hdr-dot a disparu avec le header dessine : le bloc canonique n a pas
         de pastille. La couleur d etat est portee par st-txt (ci-dessus),
         qui est le statut unique. */
      /* TOUTE la tuile POWER CORE prend la meme couleur, comme dans la card
         d origine ou lbl / jp / val partagent --helium-power. Chris :
         « entierement vert, pas moitie moite ». Le filet de fond garde son
         stroke-opacity de .09 -- il est porte par l attribut, pas par le
         stroke, donc le teinter ne le fait pas ressortir. */
      [ 'v-pwr', 'pwr-lbl-t', 'pwr-lbl-jp', 'pwr-base' ].forEach(function(id){
        var el = $(id);
        el.setAttribute(id === 'pwr-base' ? 'stroke' : 'fill', s.col);
        el.setAttribute('color', s.col);          // currentColor du glow
      });
      /* « etat eteint : couper le glow, sinon on envoie un faux signal
         lumineux » (feedback_glow_diffus_pas_de_badge). La tuile POWER CORE
         est eteinte quand le compresseur est a l arret -- meme drapeau que la
         sparkline juste au-dessus, pas une seconde notion d arret. */
      $('v-pwr').classList.toggle('off', !s.pulse);
      /* « fais matcher le color border avec la couleur du texte » : contour,
         lisere bas et crete haute. La crete est un degrade, donc ca se teinte
         sur les stops du <linearGradient> et non sur le stroke du path. */
      $('pwr-frame').setAttribute('stroke', s.col);
      $('pwr-edge').setAttribute('stroke', s.col);
      var crest = root.getElementById('gb-crest');
      if (crest) {
        [].slice.call(crest.querySelectorAll('stop')).forEach(function(st){
          st.setAttribute('stop-color', s.col);
        });
      }

      /* ===== LE PLASMA SUIT LA MACHINE ====================================
         Chris : « tokamak selon la frequence du compresseur et le conso
         electrique ». Jusqu ici apply() ne touchait rien du fluide : le tore
         tournait pareil a l arret et en pleine chauffe.

         On publie DEUX facteurs normalises, pas des valeurs absolues. La frame
         fait `curseur x facteur` : le curseur reste le gain que Chris regle au
         banc, le facteur reste le signal de la machine. Ecraser P.swirl ici
         effacerait le reglage a chaque clic -- curseurs et etat partagent le
         MEME objet window.FLUID_PARAMS (cf sliders_js.txt).

         Deux grandeurs -> deux axes SEPARES, sinon 46 Hz a 500 W et 28 Hz a
         1200 W donneraient la meme image :
           frequence = un REGIME   -> rotation + turbulence
           puissance = une QUANTITE -> matiere + exposition

         Arret : s.pulse, le meme drapeau que la sparkline et le glow. La fiche
         heat_agent_entities est formelle -- l arret se lit sur compressor_freq,
         pas sur pac_w (veille a 8-9 W). Pas de troisieme notion d arret. */
      var F = params;
      if (F) {
        /* Bornes hautes = curseurs, pas des constantes : compressor_freq vaut
           0 sur 8270 releves (la PAC n a jamais tourne depuis la telemetrie),
           donc AUCUNE borne haute n est mesuree a ce jour. Normaliser sur un
           maximum invente tasserait tout le fonctionnement reel dans une
           tranche etroite et l effet semblerait inerte. Chris recalera la
           bande quand les vraies valeurs arriveront. */
        var hzN = Math.min(1, (s.hzN || 0) / (F.hzMax || 60));
        var wN  = Math.min(1, (s.wN  || 0) / (F.wMax  || 1500));
        /* Plancher a l arret : 0 figerait completement le plasma, ce qui se
           lit comme une card plantee et non comme une PAC au repos. Il reste
           une derive lente -- c est le meme parti que la couronne, qui garde
           son halo a .1 en idle. */
        F.kRate = s.pulse ? (0.25 + 0.75 * hzN) : 0.12;
        F.kMass = s.pulse ? (0.30 + 0.70 * wN)  : 0.18;
      }
      [].slice.call(root.querySelectorAll('#power-core polyline')).forEach(function(el){
        el.setAttribute('stroke', s.col);
      });
      $('power-core').querySelector('circle').setAttribute('fill', s.col);

      // couleur du plasma : suit le delta T
      $('tkp1').setAttribute('stop-color', s.c1);
      $('tkp2').setAttribute('stop-color', s.c2);

      $('tk-halo').setAttribute('opacity', String(s.halo));
      $('tk-body').setAttribute('opacity', String(s.body));
      $('tk-fil').setAttribute('opacity', String(s.fil));
      $('tk-div').setAttribute('opacity', String(s.div));

      // la COURONNE porte l'animation : respiration a la frequence compresseur
      var ring = $('tk-ring1');
      ring.setAttribute('opacity', String(s.col2));
      ring.style.animation = s.pulse ? 'tk-breathe 1.4s ease-in-out infinite' : 'none';

      // arcs qui courent le long du bord : vitesse liee au regime
      var arcs = $('tk-arcs');
      arcs.setAttribute('opacity', String(s.arcs));
      $('tk-arc-a').style.animation = s.pulse ? 'tk-run-a ' + s.arcDur + 's linear infinite' : 'none';
      $('tk-arc-b').style.animation = s.pulse ? 'tk-run-b ' + (s.arcDur * 1.6) + 's linear infinite' : 'none';

      // p-dep / p-ret sont desormais la GAINE du tuyau (toujours visible, elle
      // dessine la tuyauterie) ; c est le FLUX qui porte l etat.
      var flowing = !!s.dots;                       // pompe en marche ?
      fx.forEach(function(el){
        el.style.animationPlayState = flowing ? 'running' : 'paused';
        el.setAttribute('opacity', flowing ? (el.classList.contains('b') ? '.5' : '.95')
                                           : '.12');
      });
      bed.forEach(function(el){
        el.setAttribute('opacity', String(flowing ? s.pipe * 1.3 : s.pipe * 0.7));
      });
      /* une PAC a l arret n aspire pas d air : l admission se fige avec le
         reste du circuit. Meme drapeau que les tirets, pas un second
         mecanisme. Les particules sont mises a opacity 0 en plus de la pause :
         figees a mi-course elles laisseraient des points suspendus en l air. */
      intake.forEach(function(el){
        /* MESURE : avec animation-play-state:paused + style.opacity='0', la
           particule restait visible a 0.78. Une animation CSS qui anime
           `opacity` l emporte sur un style inline -- cascade des animations,
           pas un bug. On retire donc l animation (animation:none) au lieu de
           se battre contre elle ; la remettre a '' la relance proprement. */
        el.style.animation = flowing ? '' : 'none';
        el.style.opacity   = flowing ? '' : '0';
      });

      /* Les 4 pastilles d etat sont retirees du SVG (demande de Chris) : piloter
         #s-def & co. ici jetterait une TypeError sur null et casserait TOUT le
         changement d etat, pas seulement les pastilles. Les champs segs{} des
         etats restent en place, inutilises, au cas ou elles reviendraient. */

    }

    // collectes une fois : le flux des tuyaux (4 chemins) et les nappes de fond
    var fx  = [].slice.call(root.querySelectorAll('.flow-dep, .flow-ret'));
    var bed = [].slice.call(root.querySelectorAll('.flowbed'));
    /* '.intake > *' et non un tag : les particules ont deja change de tag une
       fois (path -> circle -> ellipse) et un selecteur sur le tag renvoie 0
       SANS erreur -- faux negatif silencieux. */
    var intake = [].slice.call(root.querySelectorAll('.intake > *'));


    var st = document.createElement('style');
    st.textContent =
      '@keyframes tk-breathe{0%,100%{opacity:.5}50%{opacity:1}}' +
      // les arcs courent le long de la couronne : en GL ce sera une advection continue
      '@keyframes tk-run-a{to{stroke-dashoffset:-318}}' +
      '@keyframes tk-run-b{to{stroke-dashoffset:-318}}' +
      // FLUX DES TUYAUX. Longueurs mesurees par integration de la quadratique :
      // p-dep 75.73 (motif 12.621 = /6), p-ret 67.00 (motif 11.167 = /6). Le
      // motif DIVISE la longueur -> la boucle se referme sans saut de phase.
      // Depart : offset qui DECROIT = tirets vers la droite (sens du depart).
      // Retour : offset qui CROIT  = tirets vers la gauche (sens du retour).
      '@keyframes flow-dep{to{stroke-dashoffset:-75.73}}' +
      '@keyframes flow-ret{to{stroke-dashoffset:-67}}';
      /* SENS DU FLUX -- signale par Chris, les deux tuyaux coulaient vers la
         DROITE. Le signe du dashoffset ne donne PAS le sens a l ecran : il donne
         le sens le long du TRACE, et les deux chemins sont traces en sens
         opposes (p-dep part de x=147 vers 214, p-ret part de 214 vers 147).
         Un offset negatif avance donc dans le sens du trace dans les deux cas :
         vers la droite pour le depart (correct), mais aussi vers la droite pour
         le retour tant qu il etait POSITIF (il reculait le long d un trace
         deja inverse). Comme p-ret est deja ecrit de droite a gauche, c est
         -67 qu il faut : avancer le long de SON trace = aller vers la gauche.
         Mon test precedent comparait les signes bruts sans tenir compte de
         l orientation des traces : faux positif. */
    root.appendChild(st);

    // Les <animate> du POWER CORE sont du SMIL : la regle CSS
    // prefers-reduced-motion:reduce ne les atteint pas (elle ne coupe que les
    // animations CSS). On les retire donc a la main, meme condition.
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        [].slice.call(root.querySelectorAll('#power-core animate')).forEach(function(a){
          a.parentNode.removeChild(a);
        });
        var pc = root.getElementById('power-core');
        if (pc) [].slice.call(pc.querySelectorAll('polyline, circle')).forEach(function(el){
          el.setAttribute('opacity', '.5');     // etat de repos LISIBLE, pas invisible
        });
      }
    } catch (e) {}

    /* Le premier apply() peint l etat de depart : il compare aux valeurs de
       remplissage du SVG et ne doit RIEN faire clignoter. On leve le drapeau
       seulement apres lui -- tout ce qui suit est un vrai changement. */
    /* Premier rendu : l etat vient de hass, pas d un litteral. Si hass
       n est pas encore la (HA construit la card avant de le poser), on
       peint l etat de repos -- jamais un ecran vide. */
    apply(readState());
    flickFirst = false;

    /* Crochet de l editeur. Les 27 cles du SVG sont live gratuitement (le
       moteur re-resout var() a la repeinte) ; les 9 cles d etat ne sont lues
       que par cs(), dans apply(). Sans ce crochet elles sont INERTES pendant
       tout le reglage -- mesure par verif_pont.py, 0 element touche.
       On repeint a l identique, donc on rebaisse le drapeau de flicker : un
       changement de couleur n est pas un changement de valeur. */
    if (_card) _card.__reapply = function(){
      var g = flickFirst;
      flickFirst = true;
      try { apply(_etat || readState()); } finally { flickFirst = g; }
    };

  /* refresh : HA pousse un nouvel objet hass a chaque tick d entite. On
     relit la config et l etat, puis on repeint. set() ne fait clignoter
     que ce qui a REELLEMENT change, donc repeindre a l identique est
     silencieux -- c est voulu, et c est ce qui rend ce chemin bon marche. */
  api.refresh = function (h) {
    hass = h;
    cfg  = getCfg() || {};
    apply(readState());
  };
  /* reapply : le pont de l editeur. Les 27 cles du SVG sont re-resolues
     toutes seules par le moteur CSS, mais les 9 cles d etat ne sont lues
     que dans apply() -- sans ce rappel elles restent inertes pendant tout
     le reglage (mesure : 0 element touche). */
  api.reapply = function () {
    var c = root.querySelector('.card');
    if (c && c.__reapply) c.__reapply();
  };
  api.stop = function () {
    /* api.loop vaut {running, raf} : il n a JAMAIS eu de methode
       stop(), donc cette garde etait toujours fausse et api.stop()
       un no-op complet, avale par le try/catch. Mesure du 20/09 :
       chaque _render() laissait donc tourner une boucle rAF WebGL
       sur un canvas orphelin, et elles s accumulaient -- sur une
       machine de TRAVAIL c est exactement ce qu il ne faut pas.
       Couper le drapeau NE SUFFIT PAS : une frame peut deja etre
       programmee et s executera une fois de plus. On l annule. */
    try {
      if (api.loop) {
        api.loop.running = false;
        if (api.loop.raf) { cancelAnimationFrame(api.loop.raf); api.loop.raf = 0; }
      }
    } catch (e) {}
  };
  return api;
}

/* thermal-core-card v1.6.0 -- PAC Ecodan, chambre a plasma + circuit d eau.
 *
 * GENERE par gen_card.py : ne pas editer ce fichier a la main. Le banc
 * (head.txt + svg_new.txt + fluid_js.txt + tail.txt) est la source de
 * verite -- c est lui que Chris a regle a l oeil, curseur par curseur. Une
 * correction faite ici serait ecrasee au build suivant ; elle va dans le
 * banc, et le generateur la propage.
 *
 * La card d origine heat-pump-card.js reste INTACTE : nouveau fichier,
 * nouveau tag, rien n est remplace.
 */

const TCC_TAG = 'thermal-core-card';

/* ═══════════════════════════════════════════════════════════════════
 *  thermal-core-card — EDITEUR
 *  Strategie A (sync in-place) : setConfig rend UNE fois puis synchronise.
 *  Un re-render a chaque frappe recreerait le DOM, donc replierait les
 *  panneaux et ferait grisouiller les swatches (bug vecu sur vw-car-card).
 *
 *  GENERE par gen_editeur.py. Les deux blocs marques « GENERE » sont
 *  recopies verbatim depuis schema_editeur.js et pont_editeur.js, eux-memes
 *  relus dans head.txt : ne jamais les editer ici, l edition serait perdue
 *  au prochain build ET se desynchroniserait du rendu en silence.
 * ═══════════════════════════════════════════════════════════════════ */
class TCCCardEditor extends HTMLElement {
  constructor() { super(); this._config = {}; this._hass = null; this._rendered = false; }

  // ── Cycle de vie (canonique — ne pas toucher) ──────────────────────
  setConfig(c) {
    // Copie PROFONDE, et ce n est pas une precaution : { ...c } est plate,
    // donc this._config.header SERAIT l objet header de HA. _set('header.x')
    // ecrirait alors dans la config que HA tient encore, et son chemin
    // Annuler -- qui restaure justement cet objet -- n annulerait plus rien.
    // MESURE au banc le 19/09 : un header {title:'Avant',color:'rgb(2,2,2)'}
    // passe a {} dans l objet appelant. Le niveau plat, lui, etait deja
    // protege par le spread ; seuls les imbriques fuyaient.
    this._config = this._clone(c || {});
    if (!this._rendered) { this._rendered = true; this._render(); }
    else this._syncValues();
  }
  // JAMAIS de render ici (il ecraserait le champ en cours de frappe) --
  // mais la datalist, elle, se remplit : c est du contenu ajoute, pas un
  // redessin, et hass arrive souvent APRES le premier rendu.
  set hass(h) { this._hass = h; if (this._rendered) this._populateEntities(); }
  disconnectedCallback() { this._rendered = false; }

  // Clone profond, mais limite aux objets/tableaux nus d un YAML : pas de
  // structuredClone (il leve sur une fonction) ni de JSON.parse(stringify)
  // (il transforme undefined en trou et perd les dates). Un YAML HA n a que
  // des scalaires, des listes et des mappings.
  _clone(v) {
    if (Array.isArray(v)) return v.map(x => this._clone(x));
    if (v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
      const o = {};
      for (const k of Object.keys(v)) o[k] = this._clone(v[k]);
      return o;
    }
    return v;
  }

  // ── Lecture / ecriture config (cles imbriquees via ".") ────────────
  // Les cles header.* sont imbriquees, les color_* sont plates : c est la
  // meme mecanique qui sert les deux, d ou le support du point.
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
    // Profond ici AUSSI, et pour la raison symetrique : { ...this._config }
    // donnerait a HA une reference vers MON objet header, que la frappe
    // suivante mutera sous lui.
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: this._clone(this._config) }, bubbles: true, composed: true }));
  }

  // ── Sync in-place (garde de focus) ─────────────────────────────────
  // Sans la garde, le champ en cours de frappe se fait reecrire sous les
  // doigts a chaque config-changed.
  _syncValues() {
    const active = this.querySelector(':focus') || document.activeElement;
    this.querySelectorAll('[data-key]').forEach(el => {
      if (el === active) return;
      const v = this._read(el.dataset.key);
      el.value = (v == null ? '' : v);
      if (el._pick) el._pick.value = this._swatch(el.value, el._cssDefault);
    });
  }

  // ── Helpers de champ (signatures FIXES) ────────────────────────────
  // `(this._appendTo || this)` = le crochet de _group(). Sans lui les champs
  // s appendent sur la racine et les panneaux repliables sortent VIDES.
  _section(t) { const d = document.createElement('div'); d.className = 'sec'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }
  _hint(t)    { const d = document.createElement('div'); d.className = 'hint'; d.textContent = t; (this._appendTo || this).appendChild(d); return d; }

  _row(labelHtml, isHtml = false) {
    const row = document.createElement('div'); row.className = 'row';
    const lbl = document.createElement('label');
    if (isHtml) lbl.innerHTML = labelHtml; else lbl.textContent = labelHtml;
    const wrap = document.createElement('div'); wrap.className = 'field-wrap';
    row.appendChild(lbl); row.appendChild(wrap); (this._appendTo || this).appendChild(row);
    return { row, wrap };
  }

  _text(key, label, ph = '') {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = ph; inp.dataset.key = key;
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    row.wrap.appendChild(inp); return inp;
  }

  _toggle(key, label, def = false) {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'checkbox'; inp.dataset.key = key;
    const v = this._read(key);
    inp.checked = (v === undefined || v === null) ? def : !!v;
    // On ECRIT toujours le booleen, meme quand il retombe sur le defaut :
    // un decochage qui n ecrirait rien serait indistinguable du champ
    // jamais touche, et la card reprendrait le defaut au prochain rendu.
    inp.addEventListener('change', () => this._set(key, inp.checked));
    row.wrap.appendChild(inp); return inp;
  }

  // Entite : <input list> peuple depuis hass.states, motif de
  // heat-pump-card.js (l.1348). Pas <ha-entity-picker> : il n est pas
  // garanti charge dans le contexte de l editeur, et un picker absent
  // rend un champ MUET sans aucune erreur.
  _entity(key, label) {
    const row = this._row(label);
    const inp = document.createElement('input');
    inp.type = 'text'; inp.dataset.key = key;
    inp.setAttribute('list', 'tcc-entities');
    inp.placeholder = 'sensor.xxx';
    inp.value = this._read(key) ?? '';
    inp.addEventListener('input', () => this._set(key, inp.value));
    row.wrap.appendChild(inp); return inp;
  }

  // Peuple la datalist. Appelee au rendu ET depuis set hass : `set hass`
  // ne redessine jamais (commentaire l.28), donc un remplissage fait
  // uniquement au rendu resterait vide si hass arrive apres.
  _populateEntities() {
    if (!this._hass) return;
    const dl = this.querySelector('#tcc-entities');
    if (!dl || dl.dataset.n === String(Object.keys(this._hass.states).length))
      return;
    const ids = Object.keys(this._hass.states).sort();
    dl.textContent = '';
    for (const e of ids) {
      const o = document.createElement('option');
      o.value = e; dl.appendChild(o);
    }
    dl.dataset.n = String(ids.length);
  }

  // Couleur : TEXTE libre (accepte var/rgb/hex) + picker.
  //  - cssDefault : la couleur que la card applique quand le champ est vide.
  //    RELUE dans head.txt par le generateur, jamais retapee : un cssDefault
  //    tape a la main affiche une couleur et en pilote une autre (vecu sur
  //    vw-car-card le 23/08). Champ vide -> le picker montre cette couleur
  //    resolue, sans rien ecrire dans le YAML.
  _color(key, label, cssDefault = null, ph = 'ex: #FF3366 / rgb(232,224,255) / var(--primary-color)') {
    const row = this._row(label);
    const box = document.createElement('div'); box.className = 'color-row';
    const txt = document.createElement('input'); txt.type = 'text'; txt.placeholder = ph; txt.dataset.key = key;
    txt.value = this._read(key) ?? '';
    const pick = document.createElement('input'); pick.type = 'color';
    txt._pick = pick; txt._cssDefault = cssDefault;
    const refresh = () => { pick.value = this._swatch(txt.value, cssDefault); };
    txt.addEventListener('input', () => { this._set(key, txt.value); refresh(); });
    // <input type=color> ne connait QUE le hex opaque a 6 chiffres. Ecrire
    // pick.value tel quel rendrait donc tout clic opacifiant : MESURE au banc
    // le 19/09, rgba(180,130,255,.55) -> #b482ff. Les cinq couleurs du header
    // sont translucides par construction (halo, filet), un halo a .45 devenu
    // opaque change franchement le rendu. On reporte donc l alpha de la
    // valeur COURANTE, ou a defaut celle du defaut de la card : le picker
    // change la teinte, jamais la transparence.
    pick.addEventListener('input', () => {
      const a = this._alpha(txt.value) ?? this._alpha(cssDefault);
      txt.value = (a == null) ? pick.value : this._toRgba(pick.value, a);
      this._set(key, txt.value);
    });
    box.appendChild(txt); box.appendChild(pick); row.wrap.appendChild(box); refresh(); return txt;
  }

  // ── Groupe repliable (<ha-expansion-panel>) ────────────────────────
  // buildFn() appelle les helpers habituels, qui s appendent DEDANS via
  // _appendTo. L etat ouvert/ferme reste LOCAL au panneau : le passer par
  // _set() le refermerait a chaque frappe, via config-changed.
  _group(title, expanded, buildFn) {
    const panel = document.createElement('ha-expansion-panel');
    panel.outlined = true;
    panel.header = title;
    if (expanded) panel.expanded = true;
    (this._appendTo || this).appendChild(panel);
    const prev = this._appendTo;
    this._appendTo = panel;
    buildFn();
    this._appendTo = prev;
    return panel;
  }

  _toHex(c) {
    if (!c) return null;
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    const m = c.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return m ? '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') : null;
  }

  // Alpha d un rgba(), ou null si la couleur est opaque / illisible (hex,
  // rgb(), var(--...)). Un var() rend null : on ne peut pas connaitre son
  // alpha sans resoudre le theme, et deviner serait pire que ne rien faire.
  _alpha(c) {
    if (!c) return null;
    const m = String(c).match(/^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/i);
    if (!m) return null;
    const a = parseFloat(m[1]);
    return (isNaN(a) || a >= 1) ? null : a;
  }

  // #rrggbb + alpha -> rgba(r,g,b,a), en gardant l ecriture courte de HA
  // (.55 et non 0.55) : le YAML de Chris reste homogene avec head.txt.
  _toRgba(hex, a) {
    const m = String(hex).match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return hex;
    const s = String(a).replace(/^0\./, '.');
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${s})`;
  }

  // LA seule decision de couleur d un picker : valeur saisie, sinon defaut de
  // la card, sinon repli. Une seule methode pour les deux appelants (_color et
  // _syncValues), sinon les deux expressions divergent un jour en silence.
  //
  // L ORDRE COMPTE, et c est un bug MESURE, pas une precaution. _resolveColor
  // sonde le DOM ; or HA cree l editeur, appelle setConfig() -- donc _render()
  // et tous les refresh() -- et l insere dans le document APRES. Dans un arbre
  // detache, getComputedStyle(span).color rend '' : les 41 swatches sortaient
  // tous au repli violet au premier ecran, et ne se corrigeaient qu a la
  // premiere edition via _syncValues. Mesure au banc le 19/09 : swatch initial
  // #6200EA pour un cssDefault rgb(0,255,170).
  // _toHex, lui, est purement textuel et marche detache. Comme la regle §1
  // impose aux cssDefault d etre des litteraux relus dans head.txt (jamais un
  // var(--c-*)), il couvre TOUS nos defauts ; _resolveColor ne reste que pour
  // un var() saisi a la main par Chris, ou il faut bien le theme.
  _swatch(valeur, cssDefault) {
    return this._toHex(valeur)
        || (cssDefault ? (this._toHex(cssDefault) || this._resolveColor(cssDefault)) : null)
        || '#6200EA';
  }

  // Resout une couleur CSS (hex / rgb / rgba / var(--...)) en #rrggbb via
  // une sonde DOM : on est dans le scope du theme HA, donc les variables
  // standard sont disponibles. Ne marche QUE si l hote est attache (cf
  // _swatch) -- c est pourquoi il n est jamais la premiere tentative.
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

  // ── CSS commun (calibre sur heat-pump-card) ────────────────────────
  _css() {
    return `
      :host { display:block; padding:14px; font-family:var(--primary-font-family,Roboto,sans-serif); }
      .sec { font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-color);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--divider-color); }
      .sec:first-child { margin-top:0; }
      ha-expansion-panel { margin-bottom:8px; }
      .row { display:flex;align-items:center;gap:8px;margin-bottom:6px; }
      .row label { flex:0 0 160px;font-size:12px;color:var(--secondary-text-color); }
      .field-wrap { flex:1;min-width:0;display:flex; }
      input[type=text] { flex:1;width:100%;padding:4px 8px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font-size:12px;outline:none;box-sizing:border-box; }
      input:focus { box-shadow:0 0 0 1px var(--primary-color); }
      .color-row { display:flex;gap:8px;flex:1; }
      .color-row input[type=text] { flex:1; }
      .color-row input[type=color] { width:36px;height:28px;flex:none;padding:0;border:none;background:none;border-radius:4px;cursor:pointer; }
      .hint { font-size:11px;color:var(--secondary-text-color);font-style:italic;margin:-2px 0 6px 8px; }
    `;
  }

  // ── Render : on vide, on pose le style, on deroule le schema ───────
  _render() {
    this.innerHTML = '';
    const st = document.createElement('style'); st.textContent = this._css(); this.appendChild(st);
    this._schema();
  }

  // ╔══════════════════════════════════════════════════════════╗
  // ║  SCHEMA — genere par gen_schema_editeur.py               ║
  // ║  Les cssDefault sont RELUS dans la palette de la card :  ║
  // ║  ne jamais les retaper ici, ils mentiraient en silence.  ║
  // ╚══════════════════════════════════════════════════════════╝
  _schema() {
    // -- APPARENCE GENERALE --------------------------------------
    // Le classique repris de neon-entities-card.js (l.1576) : sans lui la
    // card pose un fond OPAQUE en dur qui casse le verre du theme.
    this._section('Apparence');
    this._toggle('use_theme_card', 'Heriter du card-mod theme', false);
    this._hint('Coche : la card prend le fond translucide et le flou du theme '
             + '(neo-tokyo-v5). Decoche : fond en dur, opaque.');

    // -- ENTITES -------------------------------------------------
    // Demande de Chris : les regler dans l UI, pas dans le YAML.
    // Motif recopie de heat-pump-card.js (l.1348) : <input list> +
    // datalist peuplee depuis hass.states.
    const dl = document.createElement('datalist');
    dl.id = 'tcc-entities';
    (this._appendTo || this).appendChild(dl);

    this._section('Entites');
    this._hint('Tape pour filtrer : la liste vient de ton installation.');
    this._entity('climate', 'Thermostat (climate)');
    this._entity('entities.temp_outside', 'Temperature exterieure');
    this._entity('entities.temp_water_out', 'Depart d eau');
    this._entity('entities.temp_water_ret', 'Retour d eau');
    this._entity('entities.fan_rpm', 'Vitesse ventilateur');
    this._entity('entities.comp_freq', 'Frequence compresseur');
    this._entity('entities.power', 'Puissance (W)');
    this._entity('entities.status', 'Mode operation');
    this._populateEntities();

    // -- EN-TETE : gabarit CANON, ha-neon-css/SKILL.md l.1126 ----
    // « UN SEUL groupe repliable -- jamais 2, jamais 3 ». La base a
    // plat, tout le reste dans le groupe, dans l ordre du MD.
    this._section('En-tete');
    this._text('header.title', 'Titre', 'Thermal Core');
    this._text('header.subtitle', 'Sous-titre', '');
    this._text('header.icon', 'Icone (mdi)', 'mdi:heat-pump');
    this._text('header.title_size', 'Taille titre (px)', '11');
    this._color('header.color', 'Couleur titre', 'rgba(180,130,255,.55)');
    this._text('header.font', 'Police', 'theme HA');
    this._toggle('header.uppercase', 'Majuscules', true);
    this._toggle('header.show', 'Afficher l en-tete', true);

    this._group('Effets avances du titre', false, () => {
      this._text('header.font_weight', 'Epaisseur', '600');
      this._text('header.letter_spacing', 'Espacement', '.02em');
      this._toggle('header.italic', 'Italique', false);
      this._text('header.title_shadow', 'Text-shadow', '0 0 8px rgba(0,212,255,.7)');
      this._toggle('header.gradient', 'Titre en degrade');
      this._color('header.gradient_from', 'Degrade - depart', 'var(--primary-color)');
      this._color('header.gradient_to', 'Degrade - arrivee', 'var(--accent-color)');
      this._toggle('header.glow', 'Glow du titre');
      this._text('header.glow_size', 'Taille du glow', '14');
      this._color('header.glow_color', 'Couleur du glow', 'var(--primary-color)');
      this._toggle('header.flicker', 'Scintillement du titre');
      this._color('header.icon_color', 'Couleur de l icone', 'rgba(232,224,255,.85)');
      this._text('header.icon_size', 'Taille icone (px)', '18');
      this._hint('Memes reglages que la neon-entities-card. Le text-shadow ci-dessus, si renseigne, remplace le glow.');
    });

    this._section('Couleurs du dessin');
    this._hint('Chaque champ vide reprend la couleur d\'origine.');

    this._group('Plasma & chambre', false, () => {
      this._hint('Le coeur et le halo se melangent : les regler ensemble.');
      this._color('color_plasma_core', 'Coeur du plasma', 'rgb(232,224,255)');
      this._color('color_plasma_mid', 'Halo median', 'rgb(124,77,255)');
      this._color('color_filament', 'Filament', 'rgb(0,255,249)');
      this._color('color_arc_b', 'Arc secondaire', 'rgb(180,0,255)');
      this._color('color_chamber_wall', 'Paroi de chambre', 'rgb(98,0,234)');
      this._color('color_chamber_inner', 'Interieur de chambre', 'rgb(61,0,184)');
      this._color('color_chamber_void', 'Vide central', 'rgb(11,8,19)');
      this._color('color_divertor', 'Divertor', 'rgb(0,255,170)');
    });

    this._group('Circuit d\'eau', false, () => {
      this._hint('Depart et retour gardent leur teinte meme a l arret.');
      this._color('color_pipe', 'Tuyaux', 'rgb(98,0,234)');
      this._color('color_flow_out', 'Depart (chaud)', 'rgb(204,255,0)');
      this._color('color_flow_back', 'Retour (froid)', 'rgb(0,255,249)');
    });

    this._group('Thermostat', false, () => {
      this._color('color_setpoint', 'Consigne', 'rgb(232,224,255)');
      this._color('color_thermo_cur', 'Temperature actuelle', 'rgb(0,255,249)');
      this._color('color_thermo_mode', 'Libelle de mode', 'rgb(196,186,232)');
      this._color('color_thermo_bg', 'Fond du cadre', 'rgb(98,0,234)');
      this._color('color_thermo_border', 'Bordure du cadre', 'rgb(98,0,234)');
      this._color('color_btn_bg', 'Fond des boutons', 'rgb(6,2,20)');
      this._color('color_btn_minus', 'Bouton moins', 'rgb(0,255,249)');
      this._color('color_btn_plus', 'Bouton plus', 'rgb(180,0,255)');
      this._color('color_btn_plus_glyph', 'Glyphe du bouton plus', 'rgb(214,150,255)');
    });

    this._group('Telemetrie & tuile', false, () => {
      this._color('color_ext_temp', 'Temperature exterieure', 'rgb(0,255,249)');
      this._color('color_dt_value', 'Valeur delta T', 'rgb(176,160,224)');
      this._color('color_dt_label', 'Libelle delta T', 'rgb(206,196,240)');
      this._color('color_compressor_hz', 'Frequence compresseur', 'rgb(214,150,255)');
      this._color('color_telemetry', 'Textes de telemetrie', 'rgb(188,176,228)');
      this._color('color_tile_bg', 'Fond de tuile (haut)', 'rgb(12,16,32)');
      this._color('color_tile_bg_deep', 'Fond de tuile (bas)', 'rgb(4,6,14)');
    });

    this._group('Etats & plasma par etat', false, () => {
      this._hint('Un seul etat est actif a la fois : ces trois jeux ne se marchent jamais dessus.');
      this._color('color_state_off', 'Veille : couleur', 'rgb(0,255,170)');
      this._color('color_idle_c1', 'Veille : coeur du plasma', 'rgb(124,77,255)');
      this._color('color_idle_c2', 'Veille : paroi du plasma', 'rgb(98,0,234)');
      this._color('color_state_heat', 'Chauffe : couleur', 'rgb(204,255,0)');
      this._color('color_run_c1', 'Chauffe : coeur du plasma', 'rgb(0,255,249)');
      this._color('color_run_c2', 'Chauffe : paroi du plasma', 'rgb(180,0,255)');
      this._color('color_state_defrost', 'Degivrage : couleur', 'rgb(255,184,0)');
      this._color('color_def_c1', 'Degivrage : coeur du plasma', 'rgb(255,184,0)');
      this._color('color_def_c2', 'Degivrage : paroi du plasma', 'rgb(98,0,234)');
    });

  }
}
if (!customElements.get('tcc-card-editor')) {
  customElements.define('tcc-card-editor', TCCCardEditor);
}


class ThermalCoreCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass    = null;
    this._config  = null;
    this._monte   = false;
    this._api     = null;
    /* Objet de parametres PAR INSTANCE. Au banc c etait window.FLUID_PARAMS,
       une globale : deux cards sur un meme dashboard y ecriraient leurs
       facteurs de plasma a tour de role et se marcheraient dessus. */
    this._params  = null;
  }

  setConfig(cfg) {
    if (!cfg) throw new Error('[thermal-core-card] configuration vide.');
    /* Copie PROFONDE : { ...cfg } est plate, donc this._config.entities
       SERAIT l objet de HA, et le muter defait son chemin Annuler. Mesure
       faite sur l editeur le 19/09 -- meme piege, meme remede. */
    this._config = JSON.parse(JSON.stringify(cfg));
    /* On ne rend PAS ici. HA appelle setConfig AVANT d inserer l element :
       le rendu serait detache, getComputedStyle y rend "" et les 9 cles de
       couleur d etat retomberaient toutes sur leurs litteraux -- le reglage
       de l editeur serait inerte au premier ecran. Mesure le 19/09 sur
       l editeur (41 swatches au repli violet), meme cycle de vie ici. */
    /* Card deja montee (chaque frappe dans l editeur passe ici) :
       on REPEINT, on ne re-rend pas. _render() ecraserait innerHTML et
       recreerait un contexte GL a chaque frappe, en laissant tourner la
       boucle rAF precedente sur un canvas orphelin. Mesure du 19/09 :
       `meme_canvas: false` au second setConfig. Le pont couvre les 36
       couleurs, et refresh() reprend les donnees. */
    /* L heritage du theme se decide AVANT le rendu et SANS attendre le
       montage. Symptome rapporte par Chris le 19/09 : « l heritage marche
       a moitie, je suis oblige de faire F5 ». Cause : l attribut n etait
       pose que par _applyLiveConfig(), lui-meme appele depuis _render()
       APRES root.innerHTML -- donc apres que la surface soit calee. C est
       un attribut sur le HOST : il ne depend d aucun DOM interne, rien ne
       justifie de le retarder. Pose ici, il est la avant le premier CSS. */
    this.toggleAttribute("data-theme-card", !!this._config.use_theme_card);

    if (this._monte) {
      this._applyLiveConfig(this._config, this.shadowRoot);
      if (this._api && this._api.refresh) this._api.refresh(this._hass);
    }
  }

  connectedCallback() {
    /* C est ICI que le premier rendu a lieu, et pas dans setConfig : a ce
       moment l element est DANS le document, donc getComputedStyle rend de
       vraies valeurs et cs() resout les --c-* de l editeur. */
    this._monte = true;

    /* L attribut de theme se repose a CHAQUE entree dans le DOM, pas
       seulement dans setConfig. Symptome de Chris, 19 et 20/09 :
       « l heritage du theme a du mal, je suis oblige de faire F5 ».
       Deux theories precedentes, mesurees FAUSSES toutes les deux :
       l attribut n arrive pas trop tard (il EST dans setConfig), et le
       poser avant l insertion suffirait en principe. Ce qu elles ne
       couvraient pas : HA RE-PARENTE / CLONE la card en passant de
       l editeur ou du preview au vrai dashboard. L attribut est alors
       bien pose -- sur un host qui n est pas celui qui finit a l ecran.
       Le reposer ici rend le deplacement sans effet.
       Si cette hypothese est fausse a son tour, ces deux lignes sont
       inertes : reposer un attribut deja present ne coute rien. */
    if (this._config) {
      this.toggleAttribute("data-theme-card", !!this._config.use_theme_card);
    }

    if (this._config) this._render();
  }

  disconnectedCallback() {
    this._monte = false;
    /* Couper la boucle GL en sortant du DOM : une card retiree qui continue
       de tourner mange du GPU pour rien, et le PC de Chris est une machine
       de travail. */
    if (this._api && this._api.stop) { try { this._api.stop(); } catch (e) {} }
  }

  set hass(hass) {
    this._hass = hass;
    /* Repeindre seulement si la card est montee : sinon on rendrait detache
       (cf setConfig). */
    if (this._monte && this._api && this._api.refresh) this._api.refresh(hass);
  }

  getCardSize() { return 6; }

  /* Rend l editeur que verif_editeur.py a valide (3 montages, 50
     assertions). Le tag doit concorder avec le customElements.define plus
     haut ET avec window.customCards plus bas -- les trois sont verifies au
     build par gen_card.py. */
  static getConfigElement() { return document.createElement('tcc-card-editor'); }

  static getStubConfig() {
    /* Doit etre une config que setConfig accepte telle quelle, sinon
       l apercu du selecteur de cards (preview: true) sort casse. */
    return {
      type: 'custom:' + TCC_TAG,
      climate: 'climate.ecodan_heatpump_virtual_thermostat_z1',
      entities: {
        temp_outside:   'sensor.ecodan_heatpump_outside_temp',
        temp_water_out: 'sensor.ecodan_heatpump_feed_temp',
        temp_water_ret: 'sensor.ecodan_heatpump_return_temp',
        fan_rpm:        'sensor.ecodan_heatpump_fan_speed',
        comp_freq:      'sensor.ecodan_heatpump_compressor_frequency',
        power:          'sensor.nodon_capteur_power',
        status:         'sensor.ecodan_heatpump_operation_mode',
      },
    };
  }

  _render() {
    const root = this.shadowRoot;
    /* Defensif : si un chemin rappelle _render sur une card deja montee,
       couper la boucle rAF precedente AVANT d ecraser le DOM -- sinon
       elle tourne sur un canvas orphelin et mange du GPU pour rien. */
    if (this._api && this._api.stop) { try { this._api.stop(); } catch (e) {} }
    /* <ha-card> est la racine que Lovelace ATTEND : c est par elle que
       passent le layout en sections, le dimensionnement de colonne et les
       selecteurs de card-mod. Le banc, lui, est une page HTML dont la
       racine est un <div class="card"> nu ; recopie verbatim, la card
       n avait aucune racine reconnue -- mesure du 19/09 sur le dashboard
       reel : `ha-card = no el`.
       ⚠️ Le wrap sert le CONTRAT DE LAYOUT, PAS l apparence. La regle
       `ha-card{background:none;border:none;box-shadow:none}` du CSS la
       rend deliberement transparente : sinon elle empile SON fond, SON
       radius et SON ombre de theme SOUS .card, qui a deja les siens --
       deux surfaces, deux radius qui ne coincident pas, un lisere qui
       depasse. C est .card qui garde l apparence, elle est prouvee
       (36 --c-*, le degrade --card-bg, les drop-shadow du neon).
       Les deux se tiennent : ne pas « reparer » l un sans l autre.
       Le wrap est ADDITIF : .card reste le porteur des --c-* et de
       __reapply, donc le pont et querySelector('.card') sont intacts. */
    root.innerHTML = '<style>' + TCC_CSS + '</style>'
                   + '<ha-card>' + TCC_HTML + '</ha-card>';
    /* Parametres PAR INSTANCE (au banc : window.FLUID_PARAMS). apply() et la
       boucle de rendu doivent partager le MEME objet -- pas deux objets de
       meme forme, sinon les facteurs de plasma partent dans le vide. */
    this._params = Object.assign({}, TCC_PARAMS_DEFAUT);
    this._api = TCC_MONTER(root, this, this._params,
                           () => this._config, () => this._hass);
    /* Pose les couleurs APRES le montage : _applyLiveConfig appelle
       __reapply(), que tail.txt ne pose sur .card qu a la fin de son
       montage. L appeler avant le laisserait sans effet, en silence. */
    this._applyLiveConfig(this._config, root);
  }

  /* Pont config -> palette CSS. GENERE : ne pas editer a la main.
     Chaque champ vide laisse la var non posee, donc le fallback
     in-situ du SVG rend la couleur d origine. */
  _applyLiveConfig(cfg, root) {
    const c = cfg || {}, s = root && root.querySelector(".card");
    if (!s) return;
    const P = [
      ["arc-b", "color_arc_b"],
      ["btn-bg", "color_btn_bg"],
      ["btn-minus", "color_btn_minus"],
      ["btn-plus", "color_btn_plus"],
      ["btn-plus-glyph", "color_btn_plus_glyph"],
      ["chamber-inner", "color_chamber_inner"],
      ["chamber-void", "color_chamber_void"],
      ["chamber-wall", "color_chamber_wall"],
      ["compressor-hz", "color_compressor_hz"],
      ["def-c1", "color_def_c1"],
      ["def-c2", "color_def_c2"],
      ["divertor", "color_divertor"],
      ["dt-label", "color_dt_label"],
      ["dt-value", "color_dt_value"],
      ["ext-temp", "color_ext_temp"],
      ["filament", "color_filament"],
      ["flow-back", "color_flow_back"],
      ["flow-out", "color_flow_out"],
      ["idle-c1", "color_idle_c1"],
      ["idle-c2", "color_idle_c2"],
      ["pipe", "color_pipe"],
      ["plasma-core", "color_plasma_core"],
      ["plasma-mid", "color_plasma_mid"],
      ["run-c1", "color_run_c1"],
      ["run-c2", "color_run_c2"],
      ["setpoint", "color_setpoint"],
      ["state-defrost", "color_state_defrost"],
      ["state-heat", "color_state_heat"],
      ["state-off", "color_state_off"],
      ["telemetry", "color_telemetry"],
      ["thermo-bg", "color_thermo_bg"],
      ["thermo-border", "color_thermo_border"],
      ["thermo-cur", "color_thermo_cur"],
      ["thermo-mode", "color_thermo_mode"],
      ["tile-bg", "color_tile_bg"],
      ["tile-bg-deep", "color_tile_bg_deep"],
    ];
    for (const [v, k] of P) {
      const val = c[k];
      if (val === undefined || val === null || val === "")
        s.style.removeProperty("--c-" + v);
      else s.style.setProperty("--c-" + v, val);
    }
    /* -- FOND : heriter du card-mod du theme, ou fond en dur ------
       Bascule un BLOC de regles (fond+bordure+ombre+backdrop, sur deux
       selecteurs), donc un ATTRIBUT sur le host -- une variable CSS ne
       sait pas faire ca. Le host est `root.host` quand root est un
       shadowRoot ; sur un banc sans shadow DOM, root EST l element. */
    const _host = root && (root.host || root);
    if (_host && _host.toggleAttribute) {
      _host.toggleAttribute("data-theme-card", !!c.use_theme_card);
    }

    /* ── HEADER : RECETTE CANONIQUE ha-neon-css/SKILL.md §3ter ──────
       Le MD est la source, PAS une autre card : « LA recette canonique,
       a copier telle quelle (ne PAS re-comparer les cards) » -- piege
       vecu 3 fois, et une 4e le 19/09 quand j ai recopie heat-pump-card
       (que le MD cite justement comme ayant improvise son decoupage).
       Reference = neon-markdown-card.js.

       Seule la LOGIQUE vient du MD. Les defauts restent ceux de
       thermal-core, dans le CSS (MD l.465-470 : copier les constantes
       d une autre card = regression silencieuse). */
    const h = (c.header && typeof c.header === "object") ? c.header : {};

    /* _neonGlow : 4 couches, couche blanche + 3 colorees croissantes
       (MD l.438-441). Se calcule en JS parce que le CSS ne sait ni
       multiplier une taille ni deriver une couleur. */
    const _glow = (col, size, drop) => {
      /* 12 = canon du MD 3ter l.459. Etait a 14 : la card glowait plus
         fort que les autres a parametre egal (Chris, 20/09). */
      const n = parseFloat(size) || 12;
      const r = [.2, .4, .8, 1].map(f => Math.round(n * f));
      const p = drop
        ? x => "drop-shadow(0 0 " + x[0] + "px " + x[1] + ")"
        : x => "0 0 " + x[0] + "px " + x[1];
      const l = [p([r[0], "#fff"]), p([r[1], col]), p([r[2], col]), p([r[3], col])];
      return l.join(drop ? " " : ",");
    };

    /* Les deux defauts FIXES du MD : ni l un ni l autre ne doit heriter
       de header.color. glow_color qui retombe sur la couleur du titre =
       halo noye dans le texte (piege NAS/switch, 26/08). */
    const gCol = h.glow_color || "var(--primary-color, #00E8FF)";

    /* title_shadow, s il est renseigne, REMPLACE le glow (MD l.453 et
       le _hint de l editeur l.1158). */
    const tShadow = h.title_shadow ? h.title_shadow
                  : (h.glow ? _glow(gCol, h.glow_size, false) : null);

    /* Le glow passe par text-shadow, degrade ou pas : voir le
       commentaire de ["glow"] dans HV plus bas. Un commentaire
       prescrivait ici l inverse en citant « MD l.507-509 » -- regle
       inexistante, que j avais inventee et sourcee a tort. */
    const grad = h.gradient
      /* DEFAUTS CANONIQUES, MD 3ter l.461-462 et neon-entities-card
         l.215-216 : var(--primary-color) -> var(--accent-color).
         Le #B478FF que j avais pose le 19/09 est retire. Il visait un
         vrai symptome -- sous neo-tokyo-v5, --primary-color vaut
         #6200EA, un violet quasi noir -- mais le diagnostic etait faux,
         et ca a coute trois versions.
         Ce qui rendait le titre sombre n etait PAS la couleur de depart
         du degrade : c etait filter:drop-shadow, qui supprimait le
         coeur blanc du glow (voir le commentaire de ["glow"] plus bas).
         Avec text-shadow, le remplissage du titre reste transparent et
         ne se voit jamais : la couleur de depart du degrade n a plus
         d effet visible sur le TEXTE. Eclaircir ce defaut ne corrigeait
         donc rien -- ca ne faisait que desaligner cette card des
         autres, exactement ce que Chris reprochait. */
      ? "linear-gradient(90deg," + (h.gradient_from || "var(--primary-color, #00E8FF)") +
        "," + (h.gradient_to || "var(--accent-color, #FF50A0)") + ")"
      : null;

    const HV = [
      /* `color` seulement si le degrade est OFF -- forme de
         neon-entities-card, essayee a la demande de Chris le 20/09.
         ⚠️ MESURE faite avant d ecrire : sous degrade, head.txt l.145
         pose -webkit-text-fill-color:transparent, qui ECRASE `color`
         pour le remplissage des glyphes. Le TITRE ne bouge donc pas
         d un pixel. En revanche --tcc-t-color alimente AUSSI
         .neon-hdr-subtitle (l.160, color-mix 55%), que rien ne
         neutralise : le vrai effet de cette ligne est de faire passer
         le SOUS-TITRE de h.color au fallback blanc-lavande des que le
         degrade est actif. L audit d ou vient ce patch ne parle que du
         titre -- il n avait pas vu l.160.
         Si le sous-titre change et pas le titre : revertir, ca ne
         corrige rien et ca degrade le sous-titre. */
      /* Retour a l inconditionnel. Le conditionnel de v1.4.2 venait du
         meme audit que le drop-shadow, et de la meme fausse premisse :
         il supposait que `color` gênait sous degrade. Sous degrade le
         fill est transparent, `color` est donc deja sans effet sur le
         TITRE -- mais --tcc-t-color alimente AUSSI .neon-hdr-subtitle
         (head.txt l.160), que le conditionnel degradait pour rien. */
      ["color",        h.color],
      ["icon-color",   h.icon_color],    /* defaut FIXE dans le CSS, PAS h.color */
      ["size",         h.title_size ? parseFloat(h.title_size) + "px" : null],
      ["font",         h.font ? "'" + h.font + "'" : null],
      ["ls",           h.letter_spacing],
      ["weight",       h.font_weight],
      ["style",        h.italic ? "italic" : null],
      ["transform",    h.uppercase === false ? "none" : null],
      ["icon-size",    h.icon_size ? parseFloat(h.icon_size) + "px" : null],
      /* glow icone : opt-in STRICT sur h.glow (jamais h.glow !== false) */
      ["icon-glow",    h.glow ? _glow(gCol, h.glow_size, true) : null],
      /* text-shadow TOUJOURS, degrade ou pas -- c est le « golden bug »
         de neon-entities-card, et c est le rendu VOULU.
         MESURE du 20/09, neon-entities-card.js l.205 et l.218 : cette
         card pose _neonGlow() (donc text-shadow) ET
         -webkit-text-fill-color:transparent en meme temps, et c est
         AUSSI ce que prescrit ha-neon-css/SKILL.md l.516.
         ⚠️ J ai pourtant fait l inverse pendant cinq versions, en
         suivant une regle « drop-shadow et jamais text-shadow » que
         j attribuais a « MD 3ter l.507-509 ». Verifie le 20/09 par
         grep : cette regle n existe dans AUCUN document, je l avais
         inventee puis sourcee d une fausse citation. Le skill etait
         juste depuis le debut.
         Pourquoi : un text-shadow se dessine a partir de la FORME des
         glyphes, pas de leur remplissage. Remplissage transparent =
         l ombre reste et se voit A TRAVERS le texte evide. La couche
         `#fff` a 0.2*size est si serree qu elle remplit l interieur
         des lettres : le titre parait BLANC PLEIN, entoure du halo
         colore des 3 couches suivantes. C est ce que rendent
         ACCES & SECURITE et heat-pump sur la vue 0 de Chris.
         Un filter:drop-shadow, lui, s applique au rendu DEJA compose :
         texte transparent = rien a ombrer au centre, il ne produit
         qu un contour. Le coeur blanc disparait, et le titre prend la
         couleur du degrade au lieu du blanc. C est exactement l ecart
         que Chris signale depuis le 19/09.
         Ne pas « recorriger » vers drop-shadow en invoquant le MD. */
      ["glow",         tShadow],
      ["title-filter", null],
      ["grad",         grad],
      ["clip",         grad ? "text" : null],
      ["fill",         grad ? "transparent" : null],
      ["flicker",      h.flicker
                       ? "nmc-flicker " + (3.5 + Math.random() * 2).toFixed(2) +
                         "s ease-in-out infinite" : null],
    ];
    for (const [v, val] of HV) {
      if (val === undefined || val === null || val === "")
        s.style.removeProperty("--tcc-t-" + v);
      else s.style.setProperty("--tcc-t-" + v, val);
    }

    /* Le TITRE et le SOUS-TITRE : textContent, pas des variables. Seuls
       champs du header a emprunter le chemin DOM. */
    const _t = s.querySelector(".nmc-title");
    if (_t) _t.textContent = (h.title === undefined || h.title === null ||
                              h.title === "") ? "Thermal Core" : h.title;
    const _sub = s.querySelector(".neon-hdr-subtitle");
    if (_sub) {
      const v = h.subtitle || "";
      _sub.textContent = v;
      _sub.style.display = v ? "" : "none";
    }

    /* header.show : masquer tout le bloc (checklist MD point 3, « souvent
       oublie »). */
    const _hd = s.querySelector(".neon-hdr");
    const _dv = s.querySelector(".neon-main-div");
    const _off = h.show === false;
    if (_hd) _hd.style.display = _off ? "none" : "";
    if (_dv) _dv.style.display = _off ? "none" : "";

    /* L ICONE : createElement, jamais innerHTML (MD l.253). Le <svg> de
       secours du banc reste tant que Chris n a pas choisi d icone, car
       hors HA <ha-icon> n existe pas et rendrait du vide. */
    const _w = s.querySelector(".nmc-icon-wrap");
    if (_w && h.icon) {
      let ic = _w.querySelector("ha-icon");
      if (!ic) {
        ic = document.createElement("ha-icon");
        const svg = _w.querySelector("svg");
        if (svg) svg.remove();
        _w.appendChild(ic);
      }
      if (ic.getAttribute("icon") !== h.icon) ic.setAttribute("icon", h.icon);
    }

    /* Les 9 cles d etat ne mordent qu au prochain apply() : on le
       force, sinon elles sont inertes pendant tout le reglage.
       Le nom __reapply est celui POSE par tail.txt sur .card ; il
       doit correspondre a la lettre, car le `&&` avale une faute
       de frappe SANS erreur -- les 9 cles redeviendraient inertes
       et le gate continuerait de dire OK. */
    if (typeof s.__reapply === "function") s.__reapply();
  }
}

/* L editeur porte DEJA son propre customElements.define (il est genere par
   gen_editeur.py comme un fichier autonome). On ne le redefinit pas ici :
   un second define du meme tag jette une NotSupportedError, qui avorterait
   le chargement du module AVANT la definition de la card -- donc pas
   d editeur ET pas de card. */
if (!customElements.get(TCC_TAG)) {
  customElements.define(TCC_TAG, ThermalCoreCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type:        TCC_TAG,
  name:        'Thermal Core \u2014 Tokamak',
  description: 'PAC Ecodan \u00B7 chambre a plasma pilotee par le compresseur \u00B7 circuit d eau \u00B7 thermostat',
  preview:     true,
});

console.info(
  '%c \u26A1 thermal-core-card v1.6.0 %c Tokamak ',
  'background:#00FFF9;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;',
  'background:#0A0118;color:#00FFF9;padding:2px 4px;border-radius:0 3px 3px 0;'
);
