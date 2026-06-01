export const FREE_PLAN = {
  id: "free",
  name: {
    fr: "Gratuit",
    es: "Gratis",
    en: "Free"
  },

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

  features: {
    fr: [
      "Calendrier principal",
      "40 événements",
      "30 notes",
      "Partage co-parent basique",
      "Synchronisation cloud"
    ],
    es: [
      "Calendario principal",
      "40 eventos",
      "30 notas",
      "Compartir con co-progenitor básico",
      "Sincronización cloud"
    ],
    en: [
      "Main calendar",
      "40 events",
      "30 notes",
      "Basic co-parent sharing",
      "Cloud sync"
    ]
  }
};

export const PREMIUM_PLAN = {
  id: "premium",
  name: {
    fr: "Premium",
    es: "Premium",
    en: "Premium"
  },

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

  features: {
    fr: [
      "Événements illimités",
      "Notes illimitées",
      "Exports JSON / CSV",
      "Modes de garde avancés",
      "Partage co-parent complet",
      "Documents familiaux",
      "Import jugement PDF",
      "Support prioritaire"
    ],
    es: [
      "Eventos ilimitados",
      "Notas ilimitadas",
      "Exportaciones JSON / CSV",
      "Modos de custodia avanzados",
      "Compartir completo con co-progenitor",
      "Documentos familiares",
      "Importación de resolución PDF",
      "Soporte prioritario"
    ],
    en: [
      "Unlimited events",
      "Unlimited notes",
      "JSON / CSV exports",
      "Advanced custody modes",
      "Full co-parent sharing",
      "Family documents",
      "Court order PDF import",
      "Priority support"
    ]
  }
};

export function getPlan(isPremium) {
  return isPremium ? PREMIUM_PLAN : FREE_PLAN;
}

export function getPlanFeatures(plan, lang = "fr") {
  if (Array.isArray(plan?.features)) return plan.features;
  return plan?.features?.[lang] || plan?.features?.fr || [];
}

export function getPlanName(plan, lang = "fr") {
  if (typeof plan?.name === "string") return plan.name;
  return plan?.name?.[lang] || plan?.name?.fr || "";
}

export function isFeatureAllowed(plan, featureKey) {
  return plan?.limits?.[featureKey] === true;
}
