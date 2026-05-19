export const FREE_PLAN = {
  id: "free",

  limits: {
    calendars: 1,
    eventsPerMonth: 40,
    notes: 30,
    exports: false,
    cloudSync: true,
    advancedModes: false,
    coparentSharing: false,
    pdfImport: false,
  },

  features: [
    "Calendrier principal",
    "Mode alterné",
    "Mode classique",
    "Notes simples",
    "Synchronisation cloud",
  ],
};

export const PREMIUM_PLAN = {
  id: "premium",

  limits: {
    calendars: 999,
    eventsPerMonth: 999999,
    notes: 999999,
    exports: true,
    cloudSync: true,
    advancedModes: true,
    coparentSharing: true,
    pdfImport: true,
  },

  features: [
    "Calendriers illimités",
    "Tous les modes de garde",
    "Exports PDF / Excel",
    "Partage co-parent",
    "Import jugement PDF",
    "Synchronisation complète",
    "Historique intelligent",
    "Support prioritaire",
  ],
};

export function getPlan(isPremium) {
  return isPremium ? PREMIUM_PLAN : FREE_PLAN;
}
