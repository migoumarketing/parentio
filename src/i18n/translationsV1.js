export const SUPPORTED_LANGS = ["fr", "es", "en", "it", "sv", "de"];

export const LANG_META = {
  fr: { label: "Français", flag: "🇫🇷", locale: "fr-FR" },
  es: { label: "Español", flag: "🇪🇸", locale: "es-ES" },
  en: { label: "English", flag: "🇬🇧", locale: "en-GB" },
  it: { label: "Italiano", flag: "🇮🇹", locale: "it-IT" },
  sv: { label: "Svenska", flag: "🇸🇪", locale: "sv-SE" },
  de: { label: "Deutsch", flag: "🇩🇪", locale: "de-DE" }
};

export const I18N = {
  fr: {
    app: { name: "Parentio", slogan: "La coparentalité organisée intelligemment.", loading: "Chargement de Parentio...", login: "Connexion", logout: "Déconnexion", version: "Version 1" },
    tabs: { calendar: "Calendrier", events: "Événements", yearly: "Annuel", settings: "Réglages" },
    calendar: { custody: "Garde", note: "Note", addEvent: "+ Événement", noNote: "Aucune note pour ce jour.", noEvent: "Aucun événement pour ce jour.", months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"], daysShort: ["L","M","M","J","V","S","D"] },
    custodyModes: { alternating: "Alternée", classic: "Classique", yearly: "Par année", custom: "Personnalisé" },
    settings: { title: "Réglages", language: "Langue", theme: "Thème", colors: "Couleurs", notifications: "Notifications", analytics: "Mesure d’audience", analyticsConsent: "Autoriser Google Analytics", billing: "Facturation", exportPdf: "Exporter PDF" },
    premium: { title: "Parentio Premium", active: "Premium actif", subscribe: "S’abonner", locked: "Fonction réservée au plan Premium", stripeRedirect: "Redirection vers Stripe..." },
    legal: { title: "Avertissement juridique", text: "Parentio est un outil d’organisation familiale. Il ne remplace pas un jugement, un avocat, un médiateur, une décision de justice ou une autorité compétente." }
  },
  es: {
    app: { name: "Parentio", slogan: "La coparentalidad organizada inteligentemente.", loading: "Cargando Parentio...", login: "Iniciar sesión", logout: "Cerrar sesión", version: "Versión 1" },
    tabs: { calendar: "Calendario", events: "Eventos", yearly: "Anual", settings: "Ajustes" },
    calendar: { custody: "Custodia", note: "Nota", addEvent: "+ Evento", noNote: "Ninguna nota para este día.", noEvent: "Ningún evento para este día.", months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"], daysShort: ["L","M","M","J","V","S","D"] },
    custodyModes: { alternating: "Alternada", classic: "Clásica", yearly: "Por año", custom: "Personalizado" },
    settings: { title: "Ajustes", language: "Idioma", theme: "Tema", colors: "Colores", notifications: "Notificaciones", analytics: "Analítica", analyticsConsent: "Autorizar Google Analytics", billing: "Facturación", exportPdf: "Exportar PDF" },
    premium: { title: "Parentio Premium", active: "Premium activo", subscribe: "Suscribirse", locked: "Función reservada al plan Premium", stripeRedirect: "Redirección a Stripe..." },
    legal: { title: "Aviso legal", text: "Parentio es una herramienta de organización familiar. No sustituye una resolución judicial, abogado, mediador, decisión judicial o autoridad competente." }
  },
  en: {
    app: { name: "Parentio", slogan: "Smart co-parenting made simple.", loading: "Loading Parentio...", login: "Sign in", logout: "Sign out", version: "Version 1" },
    tabs: { calendar: "Calendar", events: "Events", yearly: "Yearly", settings: "Settings" },
    calendar: { custody: "Custody", note: "Note", addEvent: "+ Event", noNote: "No note for this day.", noEvent: "No event for this day.", months: ["January","February","March","April","May","June","July","August","September","October","November","December"], daysShort: ["M","T","W","T","F","S","S"] },
    custodyModes: { alternating: "Alternating", classic: "Classic", yearly: "By year", custom: "Custom" },
    settings: { title: "Settings", language: "Language", theme: "Theme", colors: "Colors", notifications: "Notifications", analytics: "Analytics", analyticsConsent: "Allow Google Analytics", billing: "Billing", exportPdf: "Export PDF" },
    premium: { title: "Parentio Premium", active: "Premium active", subscribe: "Subscribe", locked: "Feature reserved for Premium", stripeRedirect: "Redirecting to Stripe..." },
    legal: { title: "Legal notice", text: "Parentio is a family organisation tool. It does not replace a court order, lawyer, mediator, court decision or competent authority." }
  },
  it: {
    app: { name: "Parentio", slogan: "La co-genitorialità organizzata in modo intelligente.", loading: "Caricamento di Parentio...", login: "Accedi", logout: "Esci", version: "Versione 1" },
    tabs: { calendar: "Calendario", events: "Eventi", yearly: "Annuale", settings: "Impostazioni" },
    calendar: { custody: "Affidamento", note: "Nota", addEvent: "+ Evento", noNote: "Nessuna nota per questo giorno.", noEvent: "Nessun evento per questo giorno.", months: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"], daysShort: ["L","M","M","G","V","S","D"] },
    custodyModes: { alternating: "Alternata", classic: "Classica", yearly: "Per anno", custom: "Personalizzata" },
    settings: { title: "Impostazioni", language: "Lingua", theme: "Tema", colors: "Colori", notifications: "Notifiche", analytics: "Analytics", analyticsConsent: "Autorizza Google Analytics", billing: "Fatturazione", exportPdf: "Esporta PDF" },
    premium: { title: "Parentio Premium", active: "Premium attivo", subscribe: "Abbonati", locked: "Funzione riservata al piano Premium", stripeRedirect: "Reindirizzamento a Stripe..." },
    legal: { title: "Avviso legale", text: "Parentio è uno strumento di organizzazione familiare. Non sostituisce un provvedimento giudiziario, avvocato, mediatore o autorità competente." }
  },
  sv: {
    app: { name: "Parentio", slogan: "Smart organiserat samföräldraskap.", loading: "Laddar Parentio...", login: "Logga in", logout: "Logga ut", version: "Version 1" },
    tabs: { calendar: "Kalender", events: "Händelser", yearly: "Årsvy", settings: "Inställningar" },
    calendar: { custody: "Vårdnad", note: "Anteckning", addEvent: "+ Händelse", noNote: "Ingen anteckning för denna dag.", noEvent: "Ingen händelse för denna dag.", months: ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"], daysShort: ["M","T","O","T","F","L","S"] },
    custodyModes: { alternating: "Växelvis", classic: "Klassisk", yearly: "Per år", custom: "Anpassad" },
    settings: { title: "Inställningar", language: "Språk", theme: "Tema", colors: "Färger", notifications: "Notiser", analytics: "Analys", analyticsConsent: "Tillåt Google Analytics", billing: "Fakturering", exportPdf: "Exportera PDF" },
    premium: { title: "Parentio Premium", active: "Premium aktivt", subscribe: "Prenumerera", locked: "Funktion reserverad för Premium", stripeRedirect: "Omdirigerar till Stripe..." },
    legal: { title: "Juridiskt meddelande", text: "Parentio är ett verktyg för familjeorganisation. Det ersätter inte domstolsbeslut, advokat, medlare eller behörig myndighet." }
  },
  de: {
    app: { name: "Parentio", slogan: "Intelligente Organisation für Co-Parenting.", loading: "Parentio wird geladen...", login: "Anmelden", logout: "Abmelden", version: "Version 1" },
    tabs: { calendar: "Kalender", events: "Ereignisse", yearly: "Jahresansicht", settings: "Einstellungen" },
    calendar: { custody: "Betreuung", note: "Notiz", addEvent: "+ Ereignis", noNote: "Keine Notiz für diesen Tag.", noEvent: "Kein Ereignis für diesen Tag.", months: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], daysShort: ["M","D","M","D","F","S","S"] },
    custodyModes: { alternating: "Wechselmodell", classic: "Klassisch", yearly: "Nach Jahr", custom: "Benutzerdefiniert" },
    settings: { title: "Einstellungen", language: "Sprache", theme: "Design", colors: "Farben", notifications: "Benachrichtigungen", analytics: "Analytics", analyticsConsent: "Google Analytics erlauben", billing: "Abrechnung", exportPdf: "PDF exportieren" },
    premium: { title: "Parentio Premium", active: "Premium aktiv", subscribe: "Abonnieren", locked: "Funktion nur für Premium", stripeRedirect: "Weiterleitung zu Stripe..." },
    legal: { title: "Rechtlicher Hinweis", text: "Parentio ist ein Werkzeug zur Familienorganisation. Es ersetzt keinen Gerichtsbeschluss, Anwalt, Mediator oder zuständige Behörde." }
  }
};

export function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : "fr";
}

export function tr(lang, path, fallback = "") {
  const safeLang = normalizeLang(lang);
  const parts = path.split(".");
  let current = I18N[safeLang];
  for (const part of parts) current = current?.[part];
  if (current !== undefined) return current;

  let fr = I18N.fr;
  for (const part of parts) fr = fr?.[part];
  return fr ?? fallback;
}

export function getCalendarLabels(lang) {
  const safeLang = normalizeLang(lang);
  return {
    months: I18N[safeLang].calendar.months,
    daysShort: I18N[safeLang].calendar.daysShort,
    locale: LANG_META[safeLang].locale
  };
}
