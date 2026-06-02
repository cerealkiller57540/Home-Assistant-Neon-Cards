#!/usr/bin/env python3
"""
Génère un démonstrateur HTML d'un thème Home Assistant à partir de son YAML.
Lit les variables du mode `dark:` + le bloc `card-mod-card`, les injecte comme
variables CSS :root, et compose une maquette HA (header, sidebar, cards, contrôles)
stylée par le thème. Régénérable si le thème change.

Usage: python gen-theme-demo.py ../themes/neo-tokyo-v3.yaml theme-demo.html
"""
import sys, re, io, os

def parse_theme(path):
    """Extrait { var: value } du mode dark et le texte brut de card-mod-card."""
    lines = io.open(path, encoding='utf-8').readlines()
    vars_ = {}
    cardmod = []
    mode = None          # None | 'dark' | 'cardmod'
    cardmod_indent = None
    for ln in lines:
        raw = ln.rstrip('\n')
        stripped = raw.strip()
        if stripped.startswith('#') or not stripped:
            if mode == 'cardmod' and raw and cardmod_indent is not None:
                cardmod.append(raw[cardmod_indent:] if len(raw) >= cardmod_indent else raw)
            continue
        # Entrée dans card-mod-card: |
        if re.match(r'^\s*card-mod-card:\s*\|', raw):
            mode = 'cardmod'; cardmod_indent = None
            continue
        # Fin du bloc card-mod (clé de niveau supérieur card-mod-*)
        if mode == 'cardmod':
            indent = len(raw) - len(raw.lstrip())
            if cardmod_indent is None and stripped:
                cardmod_indent = indent
            if re.match(r'^\s{0,4}card-mod-\w+:', raw) and indent <= 2:
                mode = None
            else:
                cardmod.append(raw[cardmod_indent:] if len(raw) >= (cardmod_indent or 0) else raw)
                continue
        if re.match(r'^\s*dark:\s*$', raw):
            mode = 'dark'; continue
        if mode == 'dark':
            m = re.match(r'^\s{6,}([a-zA-Z0-9_\-]+):\s*(.*)$', raw)
            if m:
                key, val = m.group(1), m.group(2).strip()
                # gère les blocs scalaires >- (multi-lignes) en concaténant simplement
                if val in ('>-', '>', '|', '|-'):
                    continue  # valeurs multi-lignes complexes (box-shadow…) — ignorées pour la démo
                # Valeur YAML : soit "..." (quote), soit nue suivie d'un commentaire inline.
                qm = re.match(r'''^(['"])(.*?)\1''', val)
                if qm:
                    val = qm.group(2)                       # contenu entre quotes
                else:
                    val = val.split('#', 1)[0].strip() if not val.startswith('#') \
                          else re.split(r'\s{2,}#|\s+#', val, 1)[0].strip()
                val = val.strip()
                if val.startswith('#') or val.startswith('rgb') or val.startswith('var(') \
                   or re.match(r'^[\d.]+(px|s|%)?$', val) or ',' in val or val.startswith('linear') \
                   or val.startswith('center') or val.startswith('blur') or "'" in raw:
                    vars_[key] = val
    return vars_, '\n'.join(cardmod)

def css_vars(vars_):
    out = []
    for k, v in vars_.items():
        # n'injecte pas les backgrounds image (lovelace-background pointe vers /local/)
        if k == 'lovelace-background':
            continue
        out.append(f'      --{k}: {v};')
    return '\n'.join(out)

def build_html(vars_, cardmod, theme_name, theme_file):
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{theme_name} — démonstrateur de thème</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
<style>
  /* ─── Variables injectées depuis {os.path.basename(theme_file)} ─────────────── */
  :root {{
{css_vars(vars_)}
      --ha-font-size-scale: 1;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    font-family: var(--primary-font-family, system-ui);
    color: var(--primary-text-color);
    background: center/cover no-repeat fixed url('../neo-tokyo-v4.png'), var(--primary-background-color);
    min-height: 100vh;
  }}
  .layout {{ display: flex; min-height: 100vh; }}

  /* ─── Sidebar ─────────────────────────────────────────────── */
  .sidebar {{
    width: 240px; flex-shrink: 0; padding: 14px 10px;
    background: var(--sidebar-background-color);
    backdrop-filter: blur(10px) saturate(180%) brightness(.8);
    border-right: 1px solid var(--divider-color);
    position: relative;
  }}
  .sidebar .brand {{ font-size: 20px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;
    color: #fff; text-shadow: 0 0 5px #fff, 0 0 12px var(--primary-color), 0 0 28px var(--primary-color);
    padding: 10px 12px 18px; }}
  .nav-item {{ display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 8px;
    color: var(--sidebar-text-color); font-size: 14px; cursor: pointer; margin-bottom: 3px; }}
  .nav-item ha-icon, .nav-item .mdi {{ color: var(--state-icon-color); font-size: 22px;
    filter: drop-shadow(0 0 4px currentColor); }}
  .nav-item.selected {{
    background: linear-gradient(90deg, rgba(var(--rgb-primary-color),0.18) 0%, transparent 100%);
    border-left: 3px solid var(--primary-color);
    color: #fff; text-shadow: 0 0 8px var(--primary-color);
    box-shadow: -5px 0 18px rgba(var(--rgb-primary-color),0.5);
  }}
  .nav-item.selected .mdi {{ color: var(--primary-color); }}

  /* ─── Zone principale ─────────────────────────────────────── */
  .main {{ flex: 1; display: flex; flex-direction: column; }}
  .app-header {{
    height: 56px; display: flex; align-items: center; gap: 14px; padding: 0 22px;
    background: var(--app-header-background-color);
    backdrop-filter: blur(20px) saturate(180%) brightness(.8);
    border-bottom: 2px solid rgba(var(--rgb-primary-color), 0.8);
    box-shadow: 0 0 10px rgba(var(--rgb-primary-color),0.9), 0 0 28px rgba(var(--rgb-primary-color),0.5);
    color: var(--app-header-text-color); font-weight: 700; letter-spacing: 1px;
  }}
  .app-header .mdi {{ color: var(--accent-color); font-size: 24px; }}
  .content {{ padding: 26px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
    gap: 18px; align-items: start; }}

  /* ─── ha-card (réplique le rendu HA + card-mod) ───────────── */
  .ha-card {{
    position: relative; border-radius: var(--ha-card-border-radius, 18px);
    border: var(--ha-card-border-width,1px) solid var(--ha-card-border-color, var(--divider-color));
    background: var(--card-background-color);
    backdrop-filter: blur(12px) saturate(150%);
    box-shadow: 0 8px 32px rgba(0,0,0,.75), 0 0 40px rgba(var(--rgb-primary-color),0.18);
    padding: 16px 18px; overflow: hidden;
  }}
  /* Bordure néon top+left issue du card-mod-card du thème */
  .ha-card::before {{
    content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:2;
    background:
      linear-gradient(90deg, rgba(var(--rgb-primary-color),1) 0%, rgba(0,212,255,.65) 35%,
        rgba(0,212,255,.15) 60%, transparent 75%) top / 100% 2px no-repeat,
      linear-gradient(180deg, rgba(var(--rgb-primary-color),1) 0%, rgba(123,47,190,.55) 40%,
        rgba(123,47,190,.10) 65%, transparent 80%) left / 2px 100% no-repeat;
    -webkit-mask-image: linear-gradient(135deg, black 0%, black 22%, rgba(0,0,0,.5) 40%, transparent 58%);
            mask-image: linear-gradient(135deg, black 0%, black 22%, rgba(0,0,0,.5) 40%, transparent 58%);
  }}
  .card-header {{ font-size: 16px; font-weight: 700; margin: 0 0 14px;
    color: var(--primary-text-color);
    text-shadow: 0 0 8px rgba(0,212,255,.45), 0 0 20px rgba(var(--rgb-primary-color),.35);
    border-bottom: 1px solid rgba(var(--rgb-primary-color),.3); padding-bottom: 8px; }}

  .row {{ display: flex; align-items: center; justify-content: space-between; padding: 9px 0; }}
  .row + .row {{ border-top: 1px solid var(--divider-color); }}
  .row .label {{ display: flex; align-items: center; gap: 12px; font-size: 14px; }}
  .row .mdi {{ color: var(--state-icon-color); font-size: 22px; filter: drop-shadow(0 0 5px currentColor); }}
  .row.active .mdi {{ color: var(--state-icon-active-color); }}
  .val {{ color: var(--accent-color); font-weight: 700; }}

  /* Switch façon HA */
  .switch {{ width: 42px; height: 24px; border-radius: 14px; position: relative; cursor: pointer;
    background: var(--switch-unchecked-track-color); border: 1px solid rgba(var(--rgb-primary-color),.4); }}
  .switch::after {{ content:""; position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%;
    background: var(--switch-unchecked-button-color); transition:.25s; }}
  .switch.on {{ background: var(--switch-checked-track-color); }}
  .switch.on::after {{ left: 20px; background: var(--switch-checked-button-color);
    box-shadow: 0 0 8px var(--primary-color), 0 0 16px var(--primary-color); }}

  /* Slider */
  .slider {{ height: 6px; border-radius: 4px; background: var(--paper-slider-container-color); position: relative; margin: 14px 0 6px; }}
  .slider .fill {{ position:absolute; left:0; top:0; height:100%; width:62%; border-radius:4px;
    background: var(--primary-color); box-shadow: 0 0 10px var(--primary-color); }}
  .slider .knob {{ position:absolute; left:62%; top:50%; width:16px; height:16px; border-radius:50%;
    transform: translate(-50%,-50%); background: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color), 0 0 18px var(--primary-color); }}

  /* Badges / chips / boutons */
  .chips {{ display:flex; flex-wrap:wrap; gap:8px; }}
  .chip {{ padding: 5px 12px; border-radius: 14px; font-size: 12px; font-weight: 600;
    background: var(--chip-background-color); border: 1px solid var(--primary-color); color: var(--primary-text-color); }}
  .badge {{ padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; letter-spacing: 1px; }}
  .badge.ok {{ color: var(--success-color); border:1px solid var(--success-color); }}
  .badge.warn {{ color: var(--warning-color); border:1px solid var(--warning-color); }}
  .badge.err {{ color: var(--error-color); border:1px solid var(--error-color); }}
  .btns {{ display:flex; gap:10px; margin-top:6px; }}
  .btn {{ padding: 9px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;
    border: 1px solid var(--primary-color); color: var(--primary-text-color);
    background: var(--ha-color-fill-primary-normal-resting, rgba(var(--rgb-primary-color),.18)); }}
  .btn.accent {{ border-color: var(--accent-color); color: var(--accent-color); }}

  /* Palette gaz/plasma : montre les variables de couleur du thème */
  .swatches {{ display:grid; grid-template-columns: repeat(6, 1fr); gap:8px; }}
  .swatch {{ height: 40px; border-radius: 8px; position: relative; box-shadow: 0 0 12px currentColor; }}
  .swatch span {{ position:absolute; bottom:3px; left:5px; font-size:8px; color:#fff;
    text-shadow:0 0 3px #000; letter-spacing:.3px; }}

  .stat {{ font-size: 40px; font-weight: 800; color: var(--accent-color);
    text-shadow: 0 0 10px var(--accent-color), 0 0 28px rgba(var(--rgb-accent-color),.5); }}
  .stat .unit {{ font-size: 16px; color: var(--secondary-text-color); }}
</style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">{theme_name.split('—')[0].strip()}</div>
      <div class="nav-item selected"><i class="mdi mdi-view-dashboard"></i> Accueil</div>
      <div class="nav-item"><i class="mdi mdi-lightbulb-group"></i> Lumières</div>
      <div class="nav-item"><i class="mdi mdi-thermometer"></i> Climat</div>
      <div class="nav-item"><i class="mdi mdi-solar-power"></i> Énergie</div>
      <div class="nav-item"><i class="mdi mdi-shield-home"></i> Sécurité</div>
      <div class="nav-item"><i class="mdi mdi-cog"></i> Réglages</div>
    </aside>
    <div class="main">
      <header class="app-header"><i class="mdi mdi-home-assistant"></i> Tableau de bord · {theme_name.split('—')[0].strip()}</header>
      <div class="content">

        <div class="ha-card">
          <h2 class="card-header">Salon</h2>
          <div class="row active"><span class="label"><i class="mdi mdi-lightbulb"></i> Plafonnier</span><div class="switch on"></div></div>
          <div class="row"><span class="label"><i class="mdi mdi-lamp"></i> Lampe d'appoint</span><div class="switch"></div></div>
          <div class="row active"><span class="label"><i class="mdi mdi-television"></i> TV</span><div class="switch on"></div></div>
          <div class="slider"><div class="fill"></div><div class="knob"></div></div>
        </div>

        <div class="ha-card">
          <h2 class="card-header">États</h2>
          <div class="chips">
            <span class="chip">Maison</span><span class="chip">Nuit</span><span class="chip">Cinéma</span>
          </div>
          <div class="row"><span class="label">Statut système</span><span class="badge ok">OK</span></div>
          <div class="row"><span class="label">Mise à jour</span><span class="badge warn">DISPO</span></div>
          <div class="row"><span class="label">Alarme</span><span class="badge err">ARMÉE</span></div>
          <div class="btns"><button class="btn">Activer</button><button class="btn accent">Scène</button></div>
        </div>

        <div class="ha-card">
          <h2 class="card-header">Température extérieure</h2>
          <div class="stat">14.7<span class="unit">°C</span></div>
          <div class="row"><span class="label"><i class="mdi mdi-water-percent"></i> Humidité</span><span class="val">63 %</span></div>
          <div class="row"><span class="label"><i class="mdi mdi-weather-windy"></i> Vent</span><span class="val">12 km/h</span></div>
        </div>

        <div class="ha-card" style="grid-column: span 2;">
          <h2 class="card-header">Palette du thème — gaz rares & plasma</h2>
          <div class="swatches">
            <div class="swatch" style="background:var(--gas-xenon);color:var(--gas-xenon)"><span>xenon</span></div>
            <div class="swatch" style="background:var(--gas-argon);color:var(--gas-argon)"><span>argon</span></div>
            <div class="swatch" style="background:var(--gas-krypton);color:var(--gas-krypton)"><span>krypton</span></div>
            <div class="swatch" style="background:var(--gas-radon);color:var(--gas-radon)"><span>radon</span></div>
            <div class="swatch" style="background:var(--gas-helium);color:var(--gas-helium)"><span>helium</span></div>
            <div class="swatch" style="background:var(--gas-neon);color:var(--gas-neon)"><span>neon</span></div>
            <div class="swatch" style="background:var(--radio-cherenkov);color:var(--radio-cherenkov)"><span>cherenkov</span></div>
            <div class="swatch" style="background:var(--radio-uranium);color:var(--radio-uranium)"><span>uranium</span></div>
            <div class="swatch" style="background:var(--radio-plutonium);color:var(--radio-plutonium)"><span>plutonium</span></div>
            <div class="swatch" style="background:var(--plasma-hydrogen);color:var(--plasma-hydrogen)"><span>plasma-H</span></div>
            <div class="swatch" style="background:var(--metal-cesium);color:var(--metal-cesium)"><span>cesium</span></div>
            <div class="swatch" style="background:var(--plasma-uv-glow);color:var(--plasma-uv-glow)"><span>uv-glow</span></div>
          </div>
        </div>

        <div class="ha-card">
          <h2 class="card-header">Énergie</h2>
          <div class="row"><span class="label" style="color:var(--energy-solar-color)"><i class="mdi mdi-solar-power" style="color:var(--energy-solar-color)"></i> Solaire</span><span class="val" style="color:var(--energy-solar-color)">3.24 kW</span></div>
          <div class="row"><span class="label" style="color:var(--energy-grid-consumption-color)"><i class="mdi mdi-transmission-tower" style="color:var(--energy-grid-consumption-color)"></i> Réseau</span><span class="val" style="color:var(--energy-grid-consumption-color)">0.8 kW</span></div>
          <div class="row"><span class="label" style="color:var(--energy-battery-out-color)"><i class="mdi mdi-battery-charging" style="color:var(--energy-battery-out-color)"></i> Batterie</span><span class="val" style="color:var(--energy-battery-out-color)">74 %</span></div>
        </div>

      </div>
    </div>
  </div>
</body>
</html>
'''

if __name__ == '__main__':
    THEME = sys.argv[1] if len(sys.argv) > 1 else '../themes/neo-tokyo-v3.yaml'
    OUT   = sys.argv[2] if len(sys.argv) > 2 else 'theme-demo.html'
    name = 'Neo Tokyo'
    vars_, cardmod = parse_theme(THEME)
    html = build_html(vars_, cardmod, name, THEME)
    io.open(OUT, 'w', encoding='utf-8').write(html)
    print(f'{OUT} généré — {len(vars_)} variables extraites de {os.path.basename(THEME)}')
