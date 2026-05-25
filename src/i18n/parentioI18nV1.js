export const SUPPORTED_LANGS_V1 = ["fr", "es", "en", "it", "sv", "de", "pt"];

export const LANGS_V1 = {
  fr: { flag: "🇫🇷", label: "Français", locale: "fr-FR" },
  es: { flag: "🇪🇸", label: "Español", locale: "es-ES" },
  en: { flag: "🇬🇧", label: "English", locale: "en-GB" },
  it: { flag: "🇮🇹", label: "Italiano", locale: "it-IT" },
  sv: { flag: "🇸🇪", label: "Svenska", locale: "sv-SE" },
  de: { flag: "🇩🇪", label: "Deutsch", locale: "de-DE" },
  pt: { flag: "🇵🇹", label: "Português", locale: "pt-PT" }
};

const DICT = {
  fr: {
    slogan: "La coparentalité organisée intelligemment.",
    menu: ["Calendrier", "Événements", "Annuel", "Réglages"],
    settings: "Réglages",
    premium: "Premium",
    goPremium: "Passer Premium",
    activatePremium: "Activer Premium",
    premiumActive: "Premium actif",
    organisationWarning: "Parentio est un outil d’organisation. Il ne doit pas être utilisé pour surveiller, harceler ou faire pression sur l’autre parent.",
    legalWarning: "Outil d’organisation uniquement — sans valeur juridique automatique. Parentio ne doit pas être utilisé pour surveiller, harceler ou faire pression sur l’autre parent.",
    appearance: "Apparence",
    theme: "Thème",
    colors: "Couleurs",
    notifications: "Notifications",
    airplane: "Mode avion",
    reminder: "Rappel quotidien",
    reminderTime: "Heure du rappel",
    myData: "Mes données",
    exportJson: "Exporter JSON",
    exportCsv: "Exporter CSV",
    deleteData: "Effacer mes données",
    legalDocs: "Documents légaux",
    cgu: "CGU",
    cgv: "CGV",
    privacy: "Politique de confidentialité",
    legalNotice: "Mentions légales",
    security: "Sécurité & usage responsable",
    contact: "Contact",
    version: "Version",
    nextVacations: "Prochaines vacances",
    nextSpecialDays: "Prochains jours spéciaux",
    summer: "Été",
    motherDay: "Fête des Mères",
    fatherDay: "Fête des Pères",
    nationalDay: "Fête Nationale",
    assumption: "Assomption",
    allSaints: "Toussaint",
    armistice: "Armistice",
    shared: "Partagé",
    emergencyContacts: "Contacts d'urgence",
    name: "Nom",
    phone: "Tél",
    addContact: "+ Contact",
    months: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
    monthsCap: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    weekdays: ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"],
    docs: {
      cgu: "Conditions Générales d’Utilisation\\n\\nParentio est un outil d’organisation familiale. L’utilisateur reste responsable de vérifier les informations selon sa situation personnelle et les décisions applicables.",
      cgv: "Conditions Générales de Vente\\n\\nLes abonnements Premium donnent accès aux fonctionnalités payantes pendant la durée réglée. Les paiements, reçus et factures sont gérés par Stripe.",
      privacy: "Politique de confidentialité\\n\\nParentio collecte les données nécessaires au fonctionnement du service : compte, calendrier, événements, notes et préférences. Vous pouvez demander l’accès, l’export ou la suppression de vos données.",
      legal: "Mentions légales\\n\\nÉditeur : M. Alvarado. Contact : migoumarketing@gmail.com. Parentio ne fournit pas de conseil juridique."
    }
  },
  es: {
    slogan: "La coparentalidad organizada inteligentemente.",
    menu: ["Calendario", "Eventos", "Anual", "Ajustes"],
    settings: "Ajustes",
    premium: "Premium",
    goPremium: "Pasar a Premium",
    activatePremium: "Activar Premium",
    premiumActive: "Premium activo",
    organisationWarning: "Parentio es una herramienta de organización. No debe utilizarse para vigilar, acosar o presionar al otro progenitor.",
    legalWarning: "Herramienta de organización únicamente — sin valor jurídico automático. Parentio no debe usarse para vigilar, acosar o presionar al otro progenitor.",
    appearance: "Apariencia",
    theme: "Tema",
    colors: "Colores",
    notifications: "Notificaciones",
    airplane: "Modo avión",
    reminder: "Recordatorio diario",
    reminderTime: "Hora del recordatorio",
    myData: "Mis datos",
    exportJson: "Exportar JSON",
    exportCsv: "Exportar CSV",
    deleteData: "Borrar mis datos",
    legalDocs: "Documentos legales",
    cgu: "Condiciones de uso",
    cgv: "Condiciones de venta",
    privacy: "Política de privacidad",
    legalNotice: "Aviso legal",
    security: "Seguridad y uso responsable",
    contact: "Contacto",
    version: "Versión",
    nextVacations: "Próximas vacaciones",
    nextSpecialDays: "Próximos días especiales",
    summer: "Verano",
    motherDay: "Día de la Madre",
    fatherDay: "Día del Padre",
    nationalDay: "Fiesta Nacional",
    assumption: "Asunción",
    allSaints: "Todos los Santos",
    armistice: "Armisticio",
    shared: "Compartido",
    emergencyContacts: "Contactos de emergencia",
    name: "Nombre",
    phone: "Tel",
    addContact: "+ Contacto",
    months: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
    monthsCap: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    weekdays: ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"],
    docs: {
      cgu: "Condiciones de uso\\n\\nParentio es una herramienta de organización familiar. El usuario debe verificar la información según su situación y las decisiones aplicables.",
      cgv: "Condiciones de venta\\n\\nLas suscripciones Premium dan acceso a las funciones de pago durante el periodo abonado. Los pagos, recibos y facturas se gestionan mediante Stripe.",
      privacy: "Política de privacidad\\n\\nParentio recopila los datos necesarios para el servicio: cuenta, calendario, eventos, notas y preferencias. Puede solicitar acceso, exportación o eliminación de sus datos.",
      legal: "Aviso legal\\n\\nEditor: M. Alvarado. Contacto: migoumarketing@gmail.com. Parentio no proporciona asesoramiento jurídico."
    }
  },
  en: {
    slogan: "Smart co-parenting made simple.",
    menu: ["Calendar", "Events", "Yearly", "Settings"],
    settings: "Settings",
    premium: "Premium",
    goPremium: "Go Premium",
    activatePremium: "Activate Premium",
    premiumActive: "Premium active",
    organisationWarning: "Parentio is an organisation tool. It must not be used to monitor, harass or pressure the other parent.",
    legalWarning: "Organisation tool only — no automatic legal value. Parentio must not be used to monitor, harass or pressure the other parent.",
    appearance: "Appearance",
    theme: "Theme",
    colors: "Colors",
    notifications: "Notifications",
    airplane: "Airplane mode",
    reminder: "Daily reminder",
    reminderTime: "Reminder time",
    myData: "My data",
    exportJson: "Export JSON",
    exportCsv: "Export CSV",
    deleteData: "Delete my data",
    legalDocs: "Legal documents",
    cgu: "Terms of use",
    cgv: "Terms of sale",
    privacy: "Privacy policy",
    legalNotice: "Legal notice",
    security: "Security & responsible use",
    contact: "Contact",
    version: "Version",
    nextVacations: "Upcoming holidays",
    nextSpecialDays: "Upcoming special days",
    summer: "Summer",
    motherDay: "Mother's Day",
    fatherDay: "Father's Day",
    nationalDay: "National Day",
    assumption: "Assumption",
    allSaints: "All Saints' Day",
    armistice: "Armistice",
    shared: "Shared",
    emergencyContacts: "Emergency contacts",
    name: "Name",
    phone: "Phone",
    addContact: "+ Contact",
    months: ["january","february","march","april","may","june","july","august","september","october","november","december"],
    monthsCap: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    weekdays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    docs: {
      cgu: "Terms of use\\n\\nParentio is a family organisation tool. Users remain responsible for checking information according to their situation and applicable decisions.",
      cgv: "Terms of sale\\n\\nPremium subscriptions provide access to paid features during the paid period. Payments, receipts and invoices are handled by Stripe.",
      privacy: "Privacy policy\\n\\nParentio collects the data needed to operate the service: account, calendar, events, notes and preferences. You may request access, export or deletion of your data.",
      legal: "Legal notice\\n\\nPublisher: M. Alvarado. Contact: migoumarketing@gmail.com. Parentio does not provide legal advice."
    }
  }
};

DICT.it = { ...DICT.en, slogan: "La co-genitorialità organizzata in modo intelligente.", menu: ["Calendario","Eventi","Annuale","Impostazioni"], settings:"Impostazioni", goPremium:"Passa a Premium", activatePremium:"Attiva Premium", organisationWarning:"Parentio è uno strumento di organizzazione. Non deve essere usato per sorvegliare, molestare o fare pressione sull’altro genitore.", summer:"Estate", motherDay:"Festa della Mamma", fatherDay:"Festa del Papà", shared:"Condiviso", emergencyContacts:"Contatti di emergenza", name:"Nome", phone:"Telefono", addContact:"+ Contatto", months: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"], monthsCap:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"] };
DICT.sv = { ...DICT.en, slogan: "Smart organiserat samföräldraskap.", menu: ["Kalender","Händelser","Årsvy","Inställningar"], settings:"Inställningar", goPremium:"Gå Premium", activatePremium:"Aktivera Premium", organisationWarning:"Parentio är ett organisationsverktyg. Det får inte användas för att övervaka, trakassera eller pressa den andra föräldern.", summer:"Sommar", motherDay:"Mors dag", fatherDay:"Fars dag", shared:"Delad", emergencyContacts:"Nödkontakter", name:"Namn", phone:"Telefon", addContact:"+ Kontakt", months:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"], monthsCap:["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"] };
DICT.de = { ...DICT.en, slogan: "Intelligente Organisation für Co-Parenting.", menu: ["Kalender","Ereignisse","Jahresansicht","Einstellungen"], settings:"Einstellungen", goPremium:"Premium aktivieren", activatePremium:"Premium aktivieren", organisationWarning:"Parentio ist ein Organisationswerkzeug. Es darf nicht zur Überwachung, Belästigung oder Druckausübung auf den anderen Elternteil verwendet werden.", summer:"Sommer", motherDay:"Muttertag", fatherDay:"Vatertag", shared:"Geteilt", emergencyContacts:"Notfallkontakte", name:"Name", phone:"Tel.", addContact:"+ Kontakt", months:["januar","februar","märz","april","mai","juni","juli","august","september","oktober","november","dezember"], monthsCap:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"] };
DICT.pt = { ...DICT.en, slogan: "Coparentalidade organizada de forma inteligente.", menu: ["Calendário","Eventos","Anual","Definições"], settings:"Definições", goPremium:"Ativar Premium", activatePremium:"Ativar Premium", organisationWarning:"Parentio é uma ferramenta de organização. Não deve ser usada para vigiar, assediar ou pressionar o outro progenitor.", summer:"Verão", motherDay:"Dia da Mãe", fatherDay:"Dia do Pai", shared:"Partilhado", emergencyContacts:"Contactos de emergência", name:"Nome", phone:"Tel.", addContact:"+ Contacto", months:["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"], monthsCap:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"] };

export function normalizeLangV1(lang) {
  return SUPPORTED_LANGS_V1.includes(lang) ? lang : "fr";
}

export function pv1(lang, key) {
  const safe = normalizeLangV1(lang);
  return DICT?.[safe]?.[key] || DICT.fr[key] || key;
}

export function pv1Doc(lang, key) {
  const safe = normalizeLangV1(lang);
  return DICT?.[safe]?.docs?.[key] || DICT.fr.docs[key] || "";
}

export function translateVisibleV1(value, lang) {
  if (!value || typeof value !== "string") return value;
  const d = DICT[normalizeLangV1(lang)] || DICT.fr;
  const fr = DICT.fr;

  let out = value;
  const pairs = [
    [fr.nextVacations, d.nextVacations],
    [fr.nextSpecialDays, d.nextSpecialDays],
    [fr.summer, d.summer],
    [fr.motherDay, d.motherDay],
    [fr.fatherDay, d.fatherDay],
    [fr.nationalDay, d.nationalDay],
    [fr.assumption, d.assumption],
    [fr.allSaints, d.allSaints],
    [fr.armistice, d.armistice],
    [fr.shared, d.shared],
    [fr.emergencyContacts, d.emergencyContacts],
    [fr.name, d.name],
    [fr.phone, d.phone],
    [fr.addContact, d.addContact],
    [fr.legalWarning, d.legalWarning]
  ];

  pairs.forEach(([a,b]) => { out = out.split(a).join(b); });

  fr.months.forEach((m, i) => {
    out = out.replace(new RegExp(`\\\\b${m}\\\\b`, "gi"), d.months[i]);
  });
  fr.monthsCap.forEach((m, i) => {
    out = out.split(m).join(d.monthsCap[i]);
  });

  return out;
}
