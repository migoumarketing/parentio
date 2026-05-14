export const VACANCES_PAR_PAYS = {
  france: {
    zones: ["A", "B", "C"],
    zoneLabels: {
      A: "Zone A — Lyon, Bordeaux, Grenoble, Dijon, Clermont, Limoges",
      B: "Zone B — Paris, Versailles, Créteil, Toulouse, Montpellier",
      C: "Zone C — Aix-Marseille, Amiens, Caen, Lille, Nantes, Nice, Rennes",
    },
    data: {
      2025: {
        A: [
          { nom: "Toussaint", debut: new Date(2025, 9, 18), fin: new Date(2025, 10, 3) },
          { nom: "Noël", debut: new Date(2025, 11, 20), fin: new Date(2026, 0, 5) },
          { nom: "Hiver", debut: new Date(2026, 1, 14), fin: new Date(2026, 2, 2) },
          { nom: "Printemps", debut: new Date(2026, 3, 11), fin: new Date(2026, 3, 27) },
          { nom: "Été", debut: new Date(2026, 6, 4), fin: new Date(2026, 8, 31) },
        ],
        B: [
          { nom: "Toussaint", debut: new Date(2025, 9, 18), fin: new Date(2025, 10, 3) },
          { nom: "Noël", debut: new Date(2025, 11, 20), fin: new Date(2026, 0, 5) },
          { nom: "Hiver", debut: new Date(2026, 1, 7), fin: new Date(2026, 1, 23) },
          { nom: "Printemps", debut: new Date(2026, 3, 4), fin: new Date(2026, 3, 20) },
          { nom: "Été", debut: new Date(2026, 6, 4), fin: new Date(2026, 8, 31) },
        ],
        C: [
          { nom: "Toussaint", debut: new Date(2025, 9, 18), fin: new Date(2025, 10, 3) },
          { nom: "Noël", debut: new Date(2025, 11, 20), fin: new Date(2026, 0, 5) },
          { nom: "Hiver", debut: new Date(2026, 1, 21), fin: new Date(2026, 2, 9) },
          { nom: "Printemps", debut: new Date(2026, 3, 18), fin: new Date(2026, 4, 4) },
          { nom: "Été", debut: new Date(2026, 6, 4), fin: new Date(2026, 8, 31) },
        ],
      },
    },
  },

  espagne: {
    zones: ["Nacional"],
    zoneLabels: {
      Nacional: "España — Nacional",
    },
    data: {
      2025: {
        Nacional: [
          { nom: "Navidad", debut: new Date(2025, 11, 22), fin: new Date(2026, 0, 7) },
          { nom: "Semana Santa", debut: new Date(2026, 2, 29), fin: new Date(2026, 3, 5) },
          { nom: "Verano", debut: new Date(2026, 5, 22), fin: new Date(2026, 8, 8) },
        ],
      },
    },
  },

  custom: {
    zones: ["Perso"],
    zoneLabels: {
      Perso: "Pays personnalisé — saisissez vos dates",
    },
    data: {
      2025: { Perso: [] },
      2026: { Perso: [] },
    },
  },
};

export const PAYS_LIST = [
  { id: "france", flag: "🇫🇷", label: "France" },
  { id: "espagne", flag: "🇪🇸", label: "España" },
  { id: "custom", flag: "🌍", label: "Autre pays" },
];
