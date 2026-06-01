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
      "Modos de cust
