france: {
    zones: ["A","B","C"],
    zoneLabels: {
      A:"Zone A — Lyon, Bordeaux, Grenoble, Dijon, Clermont, Limoges",
      B:"Zone B — Paris, Versailles, Créteil, Toulouse, Montpellier",
      C:"Zone C — Aix-Marseille, Amiens, Caen, Lille, Nantes, Nice, Rennes",
    },
    data: {
      2025:{
        A:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,14),fin:new Date(2026,2,2)},{nom:"Printemps",debut:new Date(2026,3,11),fin:new Date(2026,3,27)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
        B:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,7),fin:new Date(2026,1,23)},{nom:"Printemps",debut:new Date(2026,3,4),fin:new Date(2026,3,20)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
        C:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,21),fin:new Date(2026,2,9)},{nom:"Printemps",debut:new Date(2026,3,18),fin:new Date(2026,4,4)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
      },
      2026:{
        A:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,13),fin:new Date(2027,2,1)},{nom:"Printemps",debut:new Date(2027,3,10),fin:new Date(2027,3,26)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
        B:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,6),fin:new Date(2027,1,22)},{nom:"Printemps",debut:new Date(2027,3,3),fin:new Date(2027,3,19)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
        C:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,20),fin:new Date(2027,2,8)},{nom:"Printemps",debut:new Date(2027,3,17),fin:new Date(2027,4,3)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
      },
    },
  },
  // ── ESPAGNE ──────────────────────────────────────────────────────────────────
  espagne: {
    zones: ["Nacional"],
    zoneLabels: { Nacional:"España — Nacional (dates communes)" },
    data: {
      2025:{
        Nacional:[
          {nom:"Navidad",debut:new Date(2025,11,22),fin:new Date(2026,0,7)},
          {nom:"Semana Santa",debut:new Date(2026,2,29),fin:new Date(2026,3,5)},
          {nom:"Verano",debut:new Date(2026,5,22),fin:new Date(2026,8,8)},
        ],
      },
      2026:{
        Nacional:[
          {nom:"Navidad",debut:new Date(2026,11,22),fin:new Date(2027,0,7)},
          {nom:"Semana Santa",debut:new Date(2027,2,28),fin:new Date(2027,3,4)},
          {nom:"Verano",debut:new Date(2027,5,21),fin:new Date(2027,8,14)},
        ],
      },
    },
  },
  // ── ÉQUATEUR ─────────────────────────────────────────────────────────────────
  equateur: {
    zones: ["Sierra-Amazonía","Costa-Galápagos"],
    zoneLabels: {
      "Sierra-Amazonía":"Sierra y Amazonía (Quito, Cuenca, Loja...)",
      "Costa-Galápagos":"Costa y Galápagos (Guayaquil, Manta...)",
    },
    data: {
      2025:{
        "Sierra-Amazonía":[
          {nom:"Navidad",debut:new Date(2025,11,26),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,17)},
          {nom:"Vacaciones",debut:new Date(2026,5,29),fin:new Date(2026,8,10)},
        ],
        "Costa-Galápagos":[
          {nom:"Navidad",debut:new Date(2025,11,26),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,17)},
          {nom:"Fin año lectivo",debut:new Date(2026,1,26),fin:new Date(2026,3,12)},
        ],
      },
    },
  },
  // ── COLOMBIE ─────────────────────────────────────────────────────────────────
  colombie: {
    zones: ["Calendario A"],
    zoneLabels: { "Calendario A":"Colombia — Calendario A (colegios oficiales)" },
    data: {
      2025:{
        "Calendario A":[
          {nom:"Semana Santa",debut:new Date(2026,2,30),fin:new Date(2026,3,5)},
          {nom:"Mitad de año",debut:new Date(2026,5,22),fin:new Date(2026,6,6)},
          {nom:"Semana de receso",debut:new Date(2026,9,5),fin:new Date(2026,9,12)},
          {nom:"Fin de año",debut:new Date(2026,11,1),fin:new Date(2027,0,25)},
        ],
      },
    },
  },
  // ── BELGIQUE ─────────────────────────────────────────────────────────────────
  belgique: {
    zones: ["Fédération W-B"],
    zoneLabels: { "Fédération W-B":"Belgique — Fédération Wallonie-Bruxelles" },
    data: {
      2025:{
        "Fédération W-B":[
          {nom:"Toussaint",debut:new Date(2025,9,27),fin:new Date(2025,10,2)},
          {nom:"Noël",debut:new Date(2025,11,22),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,22)},
          {nom:"Pâques",debut:new Date(2026,3,6),fin:new Date(2026,3,19)},
          {nom:"Été",debut:new Date(2026,6,1),fin:new Date(2026,8,31)},
        ],
      },
    },
  },
  // ── UK ────────────────────────────────────────────────────────────────────────
  uk: {
    zones: ["England & Wales"],
    zoneLabels: { "England & Wales":"United Kingdom — England & Wales" },
    data: {
      2025:{
        "England & Wales":[
          {nom:"Half Term",debut:new Date(2025,9,27),fin:new Date(2025,10,2)},
          {nom:"Christmas",debut:new Date(2025,11,20),fin:new Date(2026,0,4)},
          {nom:"Half Term",debut:new Date(2026,1,16),fin:new Date(2026,1,22)},
          {nom:"Easter",debut:new Date(2026,3,3),fin:new Date(2026,3,19)},
          {nom:"Half Term",debut:new Date(2026,4,25),fin:new Date(2026,5,1)},
          {nom:"Summer",debut:new Date(2026,6,22),fin:new Date(2026,8,1)},
        ],
      },
    },
  },
  // ── USA ───────────────────────────────────────────────────────────────────────
  usa: {
    zones: ["General"],
    zoneLabels: { General:"United States — General (varies by state)" },
    data: {
      2025:{
        General:[
          {nom:"Thanksgiving Break",debut:new Date(2025,10,24),fin:new Date(2025,10,30)},
          {nom:"Winter Break",debut:new Date(2025,11,20),fin:new Date(2026,0,4)},
          {nom:"Spring Break",debut:new Date(2026,2,23),fin:new Date(2026,3,5)},
          {nom:"Summer",debut:new Date(2026,5,15),fin:new Date(2026,8,7)},
        ],
      },
    },
  },
  // ── PERSONNALISÉ ──────────────────────────────────────────────────────────────
  custom: {
    zones: ["Perso"],
    zoneLabels: { Perso:"Pays personnalisé — saisissez vos dates" },
    data: { 2025:{ Perso:[] }, 2026:{ Perso:[] } },
  },
};

const PAYS_LIST = [
  {id:"france", flag:"🇫🇷", label:"France"},
  {id:"espagne", flag:"🇪🇸", label:"España"},
  {id:"equateur", flag:"🇪🇨", label:"Ecuador"},
  {id:"colombie", flag:"🇨🇴", label:"Colombia"},
  {id:"belgique", flag:"🇧🇪", label:"Belgique"},
  {id:"uk", flag:"🇬🇧", label:"United Kingdom"},
  {id:"usa", flag:"🇺🇸", label:"United States"},
  {id:"custom", flag:"🌍", label:"Autre pays"},
];

