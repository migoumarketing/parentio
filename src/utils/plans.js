export const FREE_PLAN = {
  id: "free",
  name: "Gratuit",

  limits: {
    calendars: 1,
    eventsPerMonth: 40,
    notes: 30,
    exports: false,
    cloudSync: true,
    advancedModes: false,
    coparentSharing: true,
    pdfImport: false,
    documents: false,
    prioritySupport: false
  },

  features: [
    "Calendrier principal",
    "40 événements",
    "30 notes",
    "Partage co-parent basique",
    "Synchronisation cloud"
  ]
};

export const PREMIUM_PLAN = {
  id: "premium",
  name: "Premium",

  limits: {
    calendars: 999,
    eventsPerMonth: 999999,
    notes: 999999,
    exports: true,
    cloudSync: true,
    advancedModes: true,
    coparentSharing: true,
    pdfImport: true,
    documents: true,
    prioritySupport: true
  },

  features: [
    "Événements illimités",
    "Notes illimitées",
    "Exports JSON / CSV",
    "Modes de garde avancés",
    "Partage co-parent complet",
    "Documents familiaux",
    "Import jugement PDF",
    "Support prioritaire"
  ]
};

export function getPlan(isPremium) {
  return isPremium ? PREMIUM_PLAN : FREE_PLAN;
}

export function isFeatureAllowed(plan, featureKey) {
  return plan?.limits?.[featureKey] === true;
}
