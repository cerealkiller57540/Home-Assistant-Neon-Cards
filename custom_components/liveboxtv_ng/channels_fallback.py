# Mapping de SECOURS epg_id -> nom propre (France).
# But : jolis noms d'affichage + liste de repli si l'API EPG Orange est injoignable.
# La liste VIVANTE des chaînes est récupérée dynamiquement via epg.py (channelId +
# channelZappingNumber depuis l'API Orange). Ce mapping ne sert qu'à nommer/replier.
# Repris de AkA57/liveboxtvuhd (const_france.py). Si une chaîne manque ici, on affiche
# l'externalId nettoyé renvoyé par l'EPG.
CHANNEL_NAMES = {
    "-1": "GUIDE TV",
    "192": "TF1", "4": "FRANCE 2", "80": "FRANCE 3", "78": "FRANCE 4",
    "47": "FRANCE 5", "118": "M6", "111": "ARTE", "234": "LCP/PS",
    "119": "W9", "195": "TMC", "446": "TFX", "482": "GULLI",
    "481": "BFM TV", "226": "CNEWS", "112": "LCI", "2111": "FRANCEINFO:",
    "458": "CSTAR", "4139": "T18", "160": "NOVO19", "1404": "TF1 SERIES FILMS",
    "1401": "LA CHAINE L'EQUIPE", "1403": "6TER", "1402": "RMC STORY",
    "1400": "RMC DECOUVERTE", "1399": "RMC LIFE", "205": "TV5MONDE",
    "115": "RTL9", "191": "TEVA", "145": "PARIS PREMIERE", "225": "TV BREIZH",
    "34": "CANAL+", "3504": "C+ SPORT360", "3501": "C+ FOOT", "35": "C+ SPORT",
    "3779": "C+ BOX OFFICE", "3349": "C+ GRAND ECRAN", "33": "C+ CINEMAS",
    "3347": "C+ DOCS", "3348": "C+ KIDS", "1290": "BEIN SPORTS 1",
    "1304": "BEIN SPORTS 2", "1335": "BEIN SPORTS 3", "282": "OCS PREMIER",
    "284": "CINE+ FRISSON", "283": "CINE+ EMOTION", "401": "CINE+ FAMIZ",
    "285": "CINE+ FESTIVAL", "287": "CINE+ CLASSIC", "1562": "PARAMOUNT CHANNEL",
    "185": "TCM CINEMA", "10": "ACTION", "128": "MTV", "2334": "WARNER TV",
    "5": "AB1", "2": "13EME RUE", "479": "SYFY", "49": "SERIE CLUB",
    "58": "DISNEY CHANNEL", "229": "TIJI", "32": "CANAL J", "473": "NICKELODEON",
    "508": "NATIONAL GEOGRAPHIC", "12": "ANIMAUX", "88": "HISTOIRE TV",
    "451": "USHUAIA TV", "63": "SCIENCE & VIE TV", "147": "PLANETE+",
    "6": "MANGAS", "605": "NRJ HITS", "453": "M6MUSIC", "125": "MEZZO",
    "64": "EQUIDIA", "15": "AUTOMOTO LA CHAINE", "110": "KTO",
    "529": "FRANCE 24 FRANCAIS", "1073": "BFM BUSINESS", "140": "EURONEWS FRANCAIS",
    "124": "LA CHAINE METEO", "2527": "TF1 4K", "3301": "M6 4K",
}
