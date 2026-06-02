import { useState, useEffect, useRef, useMemo } from "react";
import "./utils/runtimeErrorOverlay";

import Btn from "./components/Btn";
import NoteModal from "./components/NoteModal";
import EventModal from "./components/EventModal";
import ViewEvents from "./components/ViewEvents";
import ViewAnnuel from "./components/ViewAnnuel";
import ViewSettings from "./components/ViewSettings";
import ViewCalExternal from "./components/ViewCal";
import AuthForm from "./components/AuthForm";
import ConsentScreen from "./components/ConsentScreen";

import { useAuth } from "./hooks/useAuth";
import { useEvents } from "./hooks/useEvents";
import { useNotes } from "./hooks/useNotes";
import { useSettings } from "./hooks/useSettings";
import { useCoparent } from "./hooks/useCoparent";
import { useDocuments } from "./hooks/useDocuments";

import {
  getPaques,
  getFeries,
  getFeteMeres,
  getFetePeres,
  getAnneeSco,
  getWN,
  dim,
  fdow,
  dk,
  h2r,
  sd
} from "./utils/dateUtils";

import { THEMES, PALETTES } from "./utils/themes";

import {
  EVT_IDS,
  EVT_COLORS,
  MOIS,
  MOISC,
  SOCIAL
} from "./utils/constants";

import { CGU, CGV, PC, ML } from "./utils/legalTexts";
import { VACANCES_PAR_PAYS, PAYS_LIST } from "./data/vacationsData";
import { pv1, pv1Doc, translateVisibleV1, normalizeLangV1 } from "./i18n/parentioI18nV1";
import { getPlan } from "./utils/plans";

const APP = "Parentio";
const RESP = "M. Alvarado";
const EMAIL = "migoumarketing@gmail.com";
const VER = "1.0";

function getSpecial(date, year) {
  const feries = getFeries(year);
  const feteMeres = getFeteMeres(year);
  const fetePeres = getFetePeres(year);
  const ferie = feries.find((item) => sd(item.date, date));

  if (ferie) return { label: ferie.nom, color: "#d97706", type: "ferie" };
  if (sd(date, feteMeres)) return { label: "Fête des Mères 💐", color: "#db2777", type: "mere" };
  if (sd(date, fetePeres)) return { label: "Fête des Pères 👔", color: "#2563eb", type: "pere" };
  return null;
}

function getParent(date, cfg, vac) {
  const {
    mode, pA, pB, paireA, zone, vacAlt, annePaireA, semPaireA, joursA,
    classicStartDay = "friday",
    classicEndDay = "sunday",
    classicVacationMode = "split",
    classicVacationPart = "first",
    classicPrimaryParent = "A"
  } = cfg;

  const weekNumber = getWN(date);
  const year = date.getFullYear();
  const day = date.getDay();
  const parentPrincipal = classicPrimaryParent === "A" ? pA : pB;
  const parentSecondaire = classicPrimaryParent === "A" ? pB : pA;
  const vacations = vac?.[zone] || [];
  const vacation = vacations.find((v) => date >= v.debut && date <= v.fin) || null;

  if (mode === "alternee") {
    if (vacation && vacAlt) {
      const index = vacations.findIndex((v) => v.nom === vacation.nom);
      return index % 2 === 0 ? pA : pB;
    }
    const isEvenWeek = weekNumber % 2 === 0;
    return isEvenWeek ? (paireA ? pA : pB) : paireA ? pB : pA;
  }

  if (mode === "classique") {
    if (vacation) {
      if (classicVacationMode === "allPrincipal") return parentPrincipal;
      if (classicVacationMode === "allSecondary") return parentSecondaire;

      const start = new Date(vacation.debut);
      const end = new Date(vacation.fin);
      const totalDays = Math.ceil((end - start) / 86400000) + 1;
      const currentDay = Math.floor((date - start) / 86400000) + 1;
      const firstHalfLimit = Math.ceil(totalDays / 2);
      const isFirstHalf = currentDay <= firstHalfLimit;

      if (classicVacationPart === "first") return isFirstHalf ? parentSecondaire : parentPrincipal;
      return isFirstHalf ? parentPrincipal : parentSecondaire;
    }

    const isEvenWeek = weekNumber % 2 === 0;
    const secondaryWeekend = isEvenWeek ? semPaireA === false : semPaireA === true;
    let isWeekendRight = false;

    if (classicStartDay === "friday" && classicEndDay === "sunday") isWeekendRight = day === 5 || day === 6 || day === 0;
    if (classicStartDay === "saturday" && classicEndDay === "sunday") isWeekendRight = day === 6 || day === 0;
    if (classicStartDay === "friday" && classicEndDay === "monday") isWeekendRight = day === 5 || day === 6 || day === 0 || day === 1;
    if (classicStartDay === "saturday" && classicEndDay === "monday") isWeekendRight = day === 6 || day === 0 || day === 1;

    if (isWeekendRight && secondaryWeekend) return parentSecondaire;
    return parentPrincipal;
  }

  if (mode === "annee") {
    const isEvenYear = year % 2 === 0;
    if (vacation && vacAlt) {
      const index = vacations.findIndex((v) => v.nom === vacation.nom);
      return index % 2 === 0 ? pA : pB;
    }
    return isEvenYear ? (annePaireA ? pA : pB) : annePaireA ? pB : pA;
  }

  if (mode === "personnalise") return joursA?.includes(day) ? pA : pB;
  return pA;
}

function nextChg(cfg, vac) {
  const today = new Date();
  const currentParent = getParent(today, cfg, vac);
  for (let i = 1; i <= 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const nextParent = getParent(date, cfg, vac);
    if (nextParent !== currentParent) return { days: i, parent: nextParent, date };
  }
  return null;
}

function analyzeTextLocal(text) {
  const clean = text.toLowerCase();
  const result = { mode: "alternee", paireA: true, annePaireA: true, heure: null, notes: "" };

  if (clean.includes("résidence principale") || clean.includes("garde principale") || clean.includes("droit de visite")) result.mode = "classique";
  else if (clean.includes("année paire") || clean.includes("année impaire")) result.mode = "annee";
  else result.mode = "alternee";

  if (clean.includes("semaine paire") && (clean.includes("père") || clean.includes("papa"))) result.paireA = false;
  if (clean.includes("année paire") && (clean.includes("père") || clean.includes("papa"))) result.annePaireA = false;

  const hourMatch = clean.match(/(\d{1,2})h(\d{2})?|(\d{1,2}):(\d{2})/);
  if (hourMatch) result.heure = hourMatch[0].replace("h", ":");

  if (result.mode === "alternee") result.notes = "Résidence alternée détectée.";
  if (result.mode === "classique") result.notes = "Résidence principale avec droit de visite détectée.";
  if (result.mode === "annee") result.notes = "Organisation par années paires/impaires détectée.";
  return result;
}

function Pill({ active, color, onClick, children }) {
  const rgb = h2r(color);
  return (
    <div
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 22,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        background: active ? `rgba(${rgb},0.2)` : "rgba(128,128,128,0.1)",
        border: `1.5px solid ${active ? color : "rgba(128,128,128,0.2)"}`,
        color: active ? color : "rgba(128,128,128,0.7)",
        boxShadow: active ? `0 3px 12px rgba(${rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.1)` : "none",
        transform: active ? "translateY(-1px)" : "none",
        transition: "all 0.18s"
      }}
    >
      {children}
    </div>
  );
}

function Tog({ on, onChange, label, color = "#6366f1", sub = "", T }) {
  const rgb = h2r(color);
  return (
    <label onClick={onChange} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" }}>
      <div
        style={{
          width: 40,
          height: 23,
          borderRadius: 12,
          background: on ? `rgba(${rgb},0.5)` : "rgba(128,128,128,0.15)",
          position: "relative",
          transition: "all 0.22s",
          boxShadow: on ? `0 2px 10px rgba(${rgb},0.35)` : "none",
          flexShrink: 0,
          border: `1.5px solid ${on ? color : "rgba(128,128,128,0.2)"}`
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2.5,
            left: on ? 19 : 2.5,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "all 0.22s",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
          }}
        />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: on ? color : T?.sub || "rgba(128,128,128,0.7)" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: T?.sub || "rgba(128,128,128,0.5)", marginTop: 1 }}>{sub}</div>}
      </div>
    </label>
  );
}

const LBL = {
  fr: {
    tabs: ["Calendrier", "Événements", "Annuel", "Réglages"],
    garde: "Garde",
    paire: "paire",
    impaire: "impaire",
    alternee: "🔄 Alternée",
    classique: "🏠 Classique",
    annee: "📆 Par année",
    perso: "✏️ Personnalisé",
    vacances: "Prochaines vacances",
    countdown: "Prochain changement",
    jours: "j",
    add: "+ Événement",
    note: "📝 Note",
    shared: "Partagé",
    prive: "Privé 🔒",
    ajouter: "Ajouter",
    annuler: "Annuler",
    enregistrer: "Enregistrer",
    disc: "⚠️ Outil d'organisation uniquement — aucune valeur juridique automatique. Parentio ne doit pas servir à surveiller, harceler ou faire pression sur l’autre parent.",
    evtTypes: ["🏥 Médical", "⚽ Sport", "📚 École", "🎂 Fête", "📌 Autre"],
    jugTitle: "🤖 Analyse de votre jugement",
    jugSub: "Copiez-collez le texte de votre jugement ci-dessous. L’analyse reste indicative.",
    jugBtn: "Analyser",
    jugPlh: "Collez ici le texte de votre jugement de garde...",
    premium: "🚀 Passer Premium",
    premiumSub: "Débloquez la sauvegarde cloud complète, les exports et les modes avancés.",
    social: "Nous suivre",
    langue: "Langue",
    theme: "Thème",
    couleurs: "Couleurs",
    avionLabel: "✈️ Mode avion",
    avionSub: "Désactive toutes les notifications",
    notifLabel: "🔔 Notifications",
    notifSub: "Maximum 1 rappel par jour à l'heure choisie",
    droits: "Vos droits RGPD",
    securite: "Sécurité technique",
    legal: "Documents légaux",
    mesDonnees: "Mes données",
    exporter: "📤 Exporter JSON",
    exporterCSV: "📊 Exporter CSV",
    effacer: "🗑️ Effacer mes données",
    checkItems: ["Cartable 🎒", "Médicaments 💊", "Peluche 🧸", "Vêtements 👕", "Chaussures 👟", "Doudou 🧸", "Livre 📖"],
    contacts: "Contacts urgence",
    reinit: "Réinitialiser",
    joursSemaine: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
    joursA: "Jours Parent A",
    cloudOn: "Cloud activé",
    cloudOff: "Mode local",
    loginRequired: "Connectez-vous pour sauvegarder vos données entre plusieurs appareils.",
    noUpcoming: "Aucun événement à venir.",
    close: "Fermer",
    checklistDepart: "Checklist départ"
  },
  es: {
    tabs: ["Calendario", "Eventos", "Anual", "Ajustes"],
    garde: "Custodia",
    paire: "par",
    impaire: "impar",
    alternee: "🔄 Alternada",
    classique: "🏠 Clásica",
    annee: "📆 Por año",
    perso: "✏️ Personalizado",
    vacances: "Próximas vacaciones",
    countdown: "Próximo cambio",
    jours: "d",
    add: "+ Evento",
    note: "📝 Nota",
    shared: "Compartido",
    prive: "Privado 🔒",
    ajouter: "Añadir",
    annuler: "Cancelar",
    enregistrer: "Guardar",
    disc: "⚠️ Herramienta de organización únicamente — sin valor jurídico automático. Parentio no debe usarse para vigilar, acosar o presionar al otro progenitor.",
    evtTypes: ["🏥 Médico", "⚽ Deporte", "📚 Escuela", "🎂 Fiesta", "📌 Otro"],
    jugTitle: "🤖 Análisis de su resolución",
    jugSub: "Copie y pegue el texto de su resolución. El análisis es orientativo.",
    jugBtn: "Analizar",
    jugPlh: "Pegue aquí el texto de su resolución...",
    premium: "🚀 Plan Premium",
    premiumSub: "Desbloquea guardado cloud completo, exportaciones y modos avanzados.",
    social: "Síguenos",
    langue: "Idioma",
    theme: "Tema",
    couleurs: "Colores",
    avionLabel: "✈️ Modo avión",
    avionSub: "Desactiva todas las notificaciones",
    notifLabel: "🔔 Notificaciones",
    notifSub: "Máximo 1 recordatorio al día a la hora elegida",
    droits: "Sus derechos RGPD",
    securite: "Seguridad técnica",
    legal: "Documentos legales",
    mesDonnees: "Mis datos",
    exporter: "📤 Exportar JSON",
    exporterCSV: "📊 Exportar CSV",
    effacer: "🗑️ Borrar mis datos",
    checkItems: ["Mochila 🎒", "Medicamentos 💊", "Peluche 🧸", "Ropa 👕", "Zapatos 👟", "Mantita 🧸", "Libro 📖"],
    contacts: "Contactos de emergencia",
    reinit: "Reiniciar",
    joursSemaine: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
    joursA: "Días Progenitor A",
    cloudOn: "Cloud activado",
    cloudOff: "Modo local",
    loginRequired: "Inicie sesión para guardar sus datos entre varios dispositivos.",
    noUpcoming: "Ningún evento próximo.",
    close: "Cerrar",
    checklistDepart: "Lista de salida"
  },
  en: {
    tabs: ["Calendar", "Events", "Yearly", "Settings"],
    garde: "Custody",
    paire: "even",
    impaire: "odd",
    alternee: "🔄 Alternating",
    classique: "🏠 Classic",
    annee: "📆 By year",
    perso: "✏️ Custom",
    vacances: "Upcoming holidays",
    countdown: "Next handover",
    jours: "d",
    add: "+ Event",
    note: "📝 Note",
    shared: "Shared",
    prive: "Private 🔒",
    ajouter: "Add",
    annuler: "Cancel",
    enregistrer: "Save",
    disc: "⚠️ Organisation tool only — no automatic legal value. Parentio must not be used to monitor, harass, or pressure the other parent.",
    evtTypes: ["🏥 Medical", "⚽ Sport", "📚 School", "🎂 Party", "📌 Other"],
    jugTitle: "🤖 Court order analysis",
    jugSub: "Paste your court order text below. The analysis is only indicative.",
    jugBtn: "Analyse",
    jugPlh: "Paste your court order text here...",
    premium: "🚀 Go Premium",
    premiumSub: "Unlock full cloud sync, exports, and advanced custody modes.",
    social: "Follow us",
    langue: "Language",
    theme: "Theme",
    couleurs: "Colors",
    avionLabel: "✈️ Airplane mode",
    avionSub: "Disables all notifications",
    notifLabel: "🔔 Notifications",
    notifSub: "Maximum 1 reminder per day at the chosen time",
    droits: "Your GDPR rights",
    securite: "Technical security",
    legal: "Legal documents",
    mesDonnees: "My data",
    exporter: "📤 Export JSON",
    exporterCSV: "📊 Export CSV",
    effacer: "🗑️ Delete my data",
    checkItems: ["School bag 🎒", "Medication 💊", "Stuffed toy 🧸", "Clothes 👕", "Shoes 👟", "Comfort toy 🧸", "Book 📖"],
    contacts: "Emergency contacts",
    reinit: "Reset",
    joursSemaine: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    joursA: "Parent A days",
    cloudOn: "Cloud enabled",
    cloudOff: "Local mode",
    loginRequired: "Sign in to keep your data across devices.",
    noUpcoming: "No upcoming event.",
    close: "Close",
    checklistDepart: "Departure checklist"
  }
};


const MONTHS_BY_LANG = {
  fr: {
    full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
  },
  es: {
    full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  },
  en: {
    full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
};

const HOLIDAY_TRANSLATIONS = {
  fr: {
    "Été": "Été",
    "Fête des Mères 💐": "Fête des Mères 💐",
    "Fête des Pères 👔": "Fête des Pères 👔",
    "Fête Nationale 🇫🇷": "Fête Nationale 🇫🇷",
    "Assomption 🌸": "Assomption 🌸",
    "Toussaint 🕯️": "Toussaint 🕯️",
    "Armistice 🎖️": "Armistice 🎖️"
  },
  es: {
    "Été": "Verano",
    "Fête des Mères 💐": "Día de la Madre 💐",
    "Fête des Pères 👔": "Día del Padre 👔",
    "Fête Nationale 🇫🇷": "Fiesta Nacional 🇫🇷",
    "Assomption 🌸": "Asunción 🌸",
    "Toussaint 🕯️": "Todos los Santos 🕯️",
    "Armistice 🎖️": "Armisticio 🎖️"
  },
  en: {
    "Été": "Summer",
    "Fête des Mères 💐": "Mother's Day 💐",
    "Fête des Pères 👔": "Father's Day 👔",
    "Fête Nationale 🇫🇷": "National Day 🇫🇷",
    "Assomption 🌸": "Assumption 🌸",
    "Toussaint 🕯️": "All Saints' Day 🕯️",
    "Armistice 🎖️": "Armistice 🎖️"
  }
};

function translateHolidayName(name, lang = "fr") {
  return HOLIDAY_TRANSLATIONS?.[lang]?.[name] || name;
}

function translateVacationData(vac, lang = "fr") {
  const result = {};
  Object.entries(vac || {}).forEach(([zoneKey, list]) => {
    result[zoneKey] = (list || []).map((item) => ({
      ...item,
      nom: translateHolidayName(item.nom, lang)
    }));
  });
  return result;
}

function cleanLegalText(text) {
  return String(text || "").replaceAll("\\n", "\n");
}

export default function App() {
  const today = new Date();

  const [showAuth, setShowAuth] = useState(false);
  const [accepted, setAccepted] = useState(() => localStorage.getItem("par_v11") === "1");

  const {
  user,
  loadingAuth,
  logout,
  isLoggedIn,
  isPremium,
  refreshPremiumStatus
} = useAuth();

const {
  events: cloudEvents,
  addEvent: addCloudEvent,
  removeEvent: removeCloudEvent,
  editEvent: editCloudEvent
} = useEvents(user);

const {
  cloudNotes,
  saveCloudNote,
  removeCloudNoteByDate
} = useNotes(user);
const {
  documents,
  loadingDocuments,
  documentsError,
  addDocument,
  removeDocument,
  setDocumentShared,
  openDocument
} = useDocuments(user);

const [lang, setLang] = useState(() => localStorage.getItem("par_lang") || "fr");
const [theme, setTheme] = useState(() => localStorage.getItem("par_theme") || "dark");
const [avion, setAvion] = useState(false);
const [premium, setPremium] = useState(false);

useEffect(() => {
  setPremium(isPremium === true);
}, [isPremium]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("stripe") === "success") {
    refreshPremiumStatus?.();
  }
}, []);

const PLAN = getPlan(premium);

  const [tab, setTab] = useState(0);
  const safeTab = Number.isInteger(tab) && tab >= 0 && tab <= 3 ? tab : 0;

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [zone, setZone] = useState("B");
  const [pays, setPays] = useState("france");
  const [mode, setMode] = useState("alternee");
  const [paireA, setPaireA] = useState(true);
  const [semPaireA, setSemPaireA] = useState(true);
  const [annePaireA, setAnnePaireA] = useState(true);
  const [joursA, setJoursA] = useState([1, 2, 3]);

  const [classicStartDay, setClassicStartDay] = useState("friday");
  const [classicEndDay, setClassicEndDay] = useState("sunday");
  const [classicVacationMode, setClassicVacationMode] = useState("split");
  const [classicVacationPart, setClassicVacationPart] = useState("first");
  const [classicPrimaryParent, setClassicPrimaryParent] = useState("A");
  const [classicPickupHour, setClassicPickupHour] = useState("18:00");
  const [classicReturnHour, setClassicReturnHour] = useState("18:00");

  const [pA, setPa] = useState("Maman");
  const [pB, setPb] = useState("Papa");
  const [heureA, setHeureA] = useState("18:00");
  const [heureB, setHeureB] = useState("18:00");
  const [vacAlt, setVacAlt] = useState(true);
  const [showFeries, setShowFeries] = useState(true);

  const [colorA, setColorA] = useState(PALETTES[0].a);
  const [colorB, setColorB] = useState(PALETTES[0].b);
  const [palIdx, setPalIdx] = useState(0);

  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("par_events") || "{}"); } catch { return {}; }
  });

  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("par_notes") || "{}"); } catch { return {}; }
  });

  const [selDay, setSelDay] = useState(null);
  const [modal, setModal] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvt, setNewEvt] = useState({ type: "rdv", titre: "", heure: "", shared: true });
  const [newNote, setNewNote] = useState("");
  const [checklist, setChecklist] = useState({});
  const [contacts, setContacts] = useState([{ nom: "", tel: "" }]);
  const [showDoc, setShowDoc] = useState(null);
  const [animIn, setAnimIn] = useState(false);
  const [screenW, setScreenW] = useState(typeof window !== "undefined" ? window.innerWidth : 390);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState("09:00");
  const [jugText, setJugText] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const savingEventRef = useRef(false);
  const settingsAppliedRef = useRef(false);

  const T = THEMES[theme] || THEMES.dark;
  const currentLang = normalizeLangV1(lang);
  const MOIS_LANG = MONTHS_BY_LANG[currentLang]?.full || MONTHS_BY_LANG.fr.full;
  const MOISC_LANG = MONTHS_BY_LANG[currentLang]?.short || MONTHS_BY_LANG.fr.short;

  const L = LBL[currentLang] || LBL.fr;
  const TABS = pv1(currentLang, "menu") || L.tabs;
  const ICONS = ["📅", "🗓️", "📆", "⚙️"];
  const isDesktop = screenW >= 1024;
  const rgbA = h2r(colorA);
  const rgbB = h2r(colorB);

  const anneeSco = getAnneeSco(new Date(year, month, 1));
  const paysInfo = VACANCES_PAR_PAYS[pays] || VACANCES_PAR_PAYS.france;
  const zonesDisponibles = paysInfo.zones || ["A", "B", "C"];
  const zoneLabels = paysInfo.zoneLabels || {};
  const rawVac = paysInfo.data[anneeSco] || paysInfo.data[2025] || {};
  const vac = translateVacationData(rawVac, currentLang);

  const cfg = useMemo(() => ({
    mode, pA, pB, paireA, zone, pays, vacAlt, annePaireA, semPaireA, joursA,
    classicStartDay, classicEndDay, classicVacationMode, classicVacationPart,
    classicPrimaryParent, classicPickupHour, classicReturnHour
  }), [
    mode, pA, pB, paireA, zone, pays, vacAlt, annePaireA, semPaireA, joursA,
    classicStartDay, classicEndDay, classicVacationMode, classicVacationPart,
    classicPrimaryParent, classicPickupHour, classicReturnHour
  ]);

  const { cloudSettings } = useSettings(user, cfg);

  const {
    coparents,
    loadingCoparents,
    coparentError,
    connected: coparentConnected,
    sendInvitation,
    acceptInvitation,
    refuseInvitation,
    removeInvitation
  } = useCoparent(user);

  const dimM = dim(year, month);
  const fd = fdow(year, month);
  const cells = [];
  for (let i = 0; i < fd; i++) cells.push(null);
  for (let i = 1; i <= dimM; i++) cells.push(i);

  function handleAccept(language) {
    localStorage.setItem("parentio-consent", "true");
    localStorage.setItem("par_v11", "1");
    localStorage.setItem("par_lang", language || "fr");
    setLang(language || "fr");
    setAccepted(true);
  }

  function getCellData(day) {
    if (!day) return null;
    const date = new Date(year, month, day);
    const key = dk(year, month, day);
    const parent = getParent(date, cfg, vac);
    const vacations = vac?.[zone] || [];
    const vacation = vacations.find((v) => date >= v.debut && date <= v.fin) || null;
    const special = getSpecial(date, year);
    return {
      key,
      par: parent,
      v: vacation,
      special,
      isA: parent === pA,
      wn: getWN(date),
      isToday: sd(date, today),
      evts: events[key] || [],
      note: notes[key] || ""
    };
  }

  const allDays = cells.map((day) => (day ? getCellData(day) : null)).filter(Boolean);
  const cntd = nextChg(cfg, vac);

  const upEvts = [];
  for (let m2 = 0; m2 < 3; m2++) {
    const nextMonthValue = (month + m2) % 12;
    const nextYearValue = year + Math.floor((month + m2) / 12);
    for (let d = 1; d <= dim(nextYearValue, nextMonthValue); d++) {
      const key = dk(nextYearValue, nextMonthValue, d);
      const list = events[key] || [];
      if (list.length) {
        const date = new Date(nextYearValue, nextMonthValue, d);
        if (date >= today) list.forEach((event) => upEvts.push({ ...event, date, key }));
      }
    }
  }
  upEvts.sort((a, b) => a.date - b.date);

  const feries = getFeries(year);
  const fm = getFeteMeres(year);
  const fp = getFetePeres(year);
  const prochSpec = [
    ...feries,
    { date: fm, nom: "Fête des Mères 💐" },
    { date: fp, nom: "Fête des Pères 👔" }
  ]
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      nom: translateHolidayName(item.nom, currentLang)
    }));

  useEffect(() => { localStorage.setItem("par_events", JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem("par_notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem("par_theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("par_lang", lang); }, [lang]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const groupedNotes = {};
    (cloudNotes || []).forEach((note) => {
      if (!note.note_date) return;
      groupedNotes[note.note_date] = note.content || "";
    });
    setNotes(groupedNotes);
  }, [cloudNotes, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const groupedEvents = {};
    (cloudEvents || []).forEach((event) => {
      const key = event.event_date;
      if (!key) return;
      if (!groupedEvents[key]) groupedEvents[key] = [];
      groupedEvents[key].push({
        id: event.id,
        titre: event.title || event.titre || "Événement",
        type: event.type || "rdv",
        parent: event.parent || "",
        date: event.event_date,
        shared: event.shared ?? true,
        heure: event.heure || event.time || "",
        status: event.status || "planned"
      });
    });
    setEvents(groupedEvents);
  }, [cloudEvents, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!cloudSettings) return;
    if (settingsAppliedRef.current) return;
    settingsAppliedRef.current = true;
    if (cloudSettings.mode) setMode(cloudSettings.mode);
    if (cloudSettings.pA) setPa(cloudSettings.pA);
    if (cloudSettings.pB) setPb(cloudSettings.pB);
    if (typeof cloudSettings.paireA === "boolean") setPaireA(cloudSettings.paireA);
    if (typeof cloudSettings.semPaireA === "boolean") setSemPaireA(cloudSettings.semPaireA);
    if (typeof cloudSettings.annePaireA === "boolean") setAnnePaireA(cloudSettings.annePaireA);
    if (Array.isArray(cloudSettings.joursA)) setJoursA(cloudSettings.joursA);
    if (cloudSettings.pays) setPays(cloudSettings.pays);
    if (cloudSettings.zone) setZone(cloudSettings.zone);
    if (typeof cloudSettings.vacAlt === "boolean") setVacAlt(cloudSettings.vacAlt);
    if (cloudSettings.classicStartDay) setClassicStartDay(cloudSettings.classicStartDay);
    if (cloudSettings.classicEndDay) setClassicEndDay(cloudSettings.classicEndDay);
    if (cloudSettings.classicVacationMode) setClassicVacationMode(cloudSettings.classicVacationMode);
    if (cloudSettings.classicVacationPart) setClassicVacationPart(cloudSettings.classicVacationPart);
    if (cloudSettings.classicPrimaryParent) setClassicPrimaryParent(cloudSettings.classicPrimaryParent);
    if (cloudSettings.classicPickupHour) setClassicPickupHour(cloudSettings.classicPickupHour);
    if (cloudSettings.classicReturnHour) setClassicReturnHour(cloudSettings.classicReturnHour);

    if (cloudSettings.theme) setTheme(cloudSettings.theme);
    if (cloudSettings.colorA) setColorA(cloudSettings.colorA);
    if (cloudSettings.colorB) setColorB(cloudSettings.colorB);
    if (cloudSettings.lang) setLang(cloudSettings.lang);
  }, [cloudSettings, isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimIn(true), 80);
    function resize() { setScreenW(window.innerWidth); }
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!notifEnabled || avion) return;
    const check = setInterval(() => {
      const now = new Date();
      const [hh, mm] = notifHour.split(":").map(Number);
      if (now.getHours() === hh && now.getMinutes() === mm) {
        const next = nextChg(cfg, vac);
        if (next && next.days <= 3 && "Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") new Notification(`${APP} 📅`, { body: `Changement dans ${next.days}j → ${next.parent}` });
          });
        }
      }
    }, 60000);
    return () => clearInterval(check);
  }, [notifEnabled, notifHour, avion, cfg, vac]);

  function analyzeJugement() {
    if (!jugText.trim()) return;
    const result = analyzeTextLocal(jugText);
    setAiResult(result);
    setMode(result.mode);
    if (result.paireA !== undefined) setPaireA(result.paireA);
    if (result.annePaireA !== undefined) setAnnePaireA(result.annePaireA);
    if (result.heure) {
      setHeureA(result.heure);
      setHeureB(result.heure);
    }
  }

  async function addEvent() {
    if (savingEventRef.current) return;
    if (!newEvt.titre.trim()) return;
    if (!selDay) return;

    const totalEvents = Object.values(events).flat().length;

    if (!premium && totalEvents >= PLAN.limits.eventsPerMonth) {
      alert(
        "Limite gratuite atteinte. Passez Premium pour ajouter plus d’événements."
      );
      return;
    }
    savingEventRef.current = true;
    const key = editingEvent?.key || dk(year, month, selDay);
    const localEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      titre: newEvt.titre,
      type: newEvt.type || "rdv",
      parent: newEvt.parent || "",
      date: key,
      shared: newEvt.shared ?? true,
      heure: newEvt.heure || ""
    };
    try {
      if (isLoggedIn) {
        if (editingEvent) {
          await editCloudEvent(editingEvent.id, {
            title: newEvt.titre,
            type: newEvt.type || "rdv",
            parent: newEvt.parent || "",
            event_date: key,
            status: "planned",
            heure: newEvt.heure || ""
          });
        } else {
          const created = await addCloudEvent({
            title: newEvt.titre,
            type: newEvt.type || "rdv",
            parent: newEvt.parent || "",
            event_date: key,
            status: "planned",
            heure: newEvt.heure || ""
          });
          const saved = created?.[0];
          if (saved?.id) localEvent.id = saved.id;
        }
      }
      setEvents((previous) => {
        const current = previous[key] || [];
        if (editingEvent) return { ...previous, [key]: current.map((event) => event.id === editingEvent.id ? localEvent : event) };
        return { ...previous, [key]: [...current, localEvent] };
      });
      setNewEvt({ type: "rdv", titre: "", heure: "", shared: true });
      setEditingEvent(null);
      setModal(null);
    } catch (error) {
      console.error("Erreur événement :", error);
      alert("Erreur lors de l'enregistrement de l'événement.");
    } finally {
      savingEventRef.current = false;
    }
  }

  async function delEvent(key, id) {
    try {
      setEvents((previous) => ({ ...previous, [key]: (previous[key] || []).filter((event) => event.id !== id) }));
      if (isLoggedIn && id) await removeCloudEvent(id);
    } catch (error) {
      console.error("Erreur suppression événement :", error);
      alert("Erreur suppression événement.");
    }
  }

  async function saveNote() {
    if (!selDay) return;
    const key = dk(year, month, selDay);
    try {
      if (isLoggedIn) await saveCloudNote({ note_date: key, content: newNote });
      setNotes((previous) => ({ ...previous, [key]: newNote }));
      setModal(null);
    } catch (error) {
      console.error("Erreur sauvegarde note :", error);
      alert("Erreur sauvegarde note.");
    }
  }

  async function deleteNote() {
    if (!selDay) return;
    const key = dk(year, month, selDay);
    try {
      if (isLoggedIn) await removeCloudNoteByDate(key);
      setNotes((previous) => {
        const copy = { ...previous };
        delete copy[key];
        return copy;
      });
      setNewNote("");
      setModal(null);
    } catch (error) {
      console.error("Erreur suppression note :", error);
      alert("Erreur suppression note.");
    }
  }

  function exportJSON() {
    if (!PLAN.limits.exports) {
      alert("Export réservé au plan Premium.");
      return;
    }

    const data = { date: new Date().toISOString(), app: `${APP} v${VER}`, rgpd: "Art.20 RGPD", parents: { A: pA, B: pB }, parametres: cfg, evenements: events, notes, contacts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${APP}-donnees-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    if (!PLAN.limits.exports) {
      alert("Export réservé au plan Premium.");
      return;
    }

    const rows = [["Date", "Titre", "Type", pv1(currentLang, "shared"), "Heure"]];
    Object.entries(events).forEach(([date, list]) => {
      (list || []).forEach((event) => rows.push([date, event.titre || "", event.type || "", event.shared ? "Oui" : "Non", event.heure || ""]));
    });
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${APP}-events-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function deleteAll() {
    if (window.confirm("⚠️ Toutes vos données locales seront supprimées. Continuer ?")) {
      setEvents({});
      setNotes({});
      setChecklist({});
      setContacts([{ nom: "", tel: "" }]);
      localStorage.clear();
      setAccepted(false);
    }
  }

  const S = {
    app: { minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Nunito','Segoe UI',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", transition: "background 0.3s,color 0.3s" },
    hdr: { width: "100%", background: `${T.bg}ee`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: `1px solid ${T.border}`, padding: isDesktop ? "14px 40px" : "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 300, boxSizing: "border-box" },
    layout: { width: "100%", maxWidth: isDesktop ? 920 : 460, display: isDesktop ? "grid" : "flex", gridTemplateColumns: isDesktop ? "230px 1fr" : "", flexDirection: "column", gap: isDesktop ? 20 : 0, padding: isDesktop ? "20px 20px 40px" : "14px 16px 88px", boxSizing: "border-box", opacity: animIn ? 1 : 0, transform: animIn ? "none" : "translateY(14px)", transition: "all 0.4s ease" },
    sidebar: { display: isDesktop ? "flex" : "none", flexDirection: "column", gap: 6, position: "sticky", top: 80, height: "fit-content" },
    sideItem: (active) => ({ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 13, background: active ? `rgba(${rgbA},0.15)` : T.card, color: active ? colorA : T.sub, border: `1px solid ${active ? `${colorA}55` : T.border}`, transition: "all 0.15s", boxShadow: active ? `0 3px 12px rgba(${rgbA},0.15)` : "none" }),
    main: { flex: 1, minWidth: 0 },
    card: { background: T.card, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 18, border: `1px solid ${T.border}`, padding: isDesktop ? "20px" : "16px", marginBottom: 12, boxShadow: theme === "light" ? "0 4px 20px rgba(99,102,241,0.08)" : "0 4px 20px rgba(0,0,0,0.2)" },
    sec: { fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.sub, marginBottom: 9 },
    row: { display: "flex", gap: 7, flexWrap: "wrap" },
    inp: { background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 11, padding: "10px 13px", color: T.inputText, fontSize: 14, fontWeight: 600, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
    inpLbl: { fontSize: 11, color: T.sub, marginBottom: 3, fontWeight: 600 },
    panel: { background: T.card, borderRadius: 13, border: `1px solid ${T.border}`, padding: "13px 14px", marginTop: 10, boxShadow: theme === "light" ? "0 4px 16px rgba(99,102,241,0.08)" : "0 4px 14px rgba(0,0,0,0.2)" },
    badge: (color) => ({ padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `rgba(${h2r(color)},0.15)`, color, border: `1px solid rgba(${h2r(color)},0.25)` }),
    evtLine: (color) => ({ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}`, color: T.text }),
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 500 },
    mCard: { background: T.bg, border: `1px solid ${T.border}`, borderRadius: "22px 22px 0 0", padding: "22px 20px 44px", width: "100%", maxWidth: 460, boxShadow: "0 -8px 28px rgba(0,0,0,0.35)" },
    navBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: T.navBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: `1px solid ${T.border}`, display: isDesktop ? "none" : "flex", justifyContent: "space-around", padding: "10px 0 calc(10px + env(safe-area-inset-bottom))", zIndex: 300 },
    navItem: (active) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: active ? colorA : T.sub, fontSize: 10, fontWeight: 700, transition: "all 0.15s", transform: active ? "translateY(-2px)" : "none", padding: "4px 18px", borderRadius: 11, background: active ? `rgba(${rgbA},0.1)` : "transparent" }),
    disc: { background: theme === "light" ? "rgba(217,119,6,0.08)" : "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.18)", borderRadius: 10, padding: "8px 12px", fontSize: 11, color: theme === "light" ? "rgba(120,60,0,0.85)" : "rgba(251,191,36,0.75)", textAlign: "center", marginBottom: 11, lineHeight: 1.5, fontWeight: 600 },
    vacItem: (active) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 9, background: active ? "rgba(217,119,6,0.09)" : "transparent", border: active ? "1px solid rgba(217,119,6,0.25)" : `1px solid ${T.border}`, marginBottom: 4 })
  };

  if (!accepted) return <ConsentScreen onAccept={handleAccept} />;

  if (loadingAuth) {
    return <div style={{ minHeight: "100vh", background: "#07071a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", fontWeight: 800 }}>Chargement de Parentio...</div>;
  }

  if (showAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#07071a", color: "#fff" }}>
        <button onClick={() => setShowAuth(false)} style={{ margin: 20, padding: 12 }}>← Retour à l’application</button>
        <AuthForm />
      </div>
    );
  }

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: isDesktop ? 20 : 17, letterSpacing: "-0.5px", color: T.text }}>
          <div style={{ width: 34, height: 34, background: `rgba(${rgbA},0.18)`, border: `1.5px solid rgba(${rgbA},0.32)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: `0 3px 10px rgba(${rgbA},0.18)`, flexShrink: 0 }}>👨‍👧</div>
          <span style={{ background: "linear-gradient(135deg,#4F8EF7,#FF6B6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{APP}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: isLoggedIn ? "#10b981" : "#f59e0b", border: `1px solid ${isLoggedIn ? "#10b98155" : "#f59e0b55"}`, padding: "5px 8px", borderRadius: 999 }}>{isLoggedIn ? L.cloudOn : L.cloudOff}</span>
          <button onClick={() => { if (isLoggedIn) logout(); else setShowAuth(true); }} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: T.text, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>{isLoggedIn ? "Déconnexion" : "Connexion"}</button>
          {isDesktop && <div style={{ display: "flex", gap: 6 }}>{[["fr", "🇫🇷"], ["es", "🇪🇸"], ["en", "🇬🇧"]].map(([code, flag]) => <div key={code} onClick={() => {
                    setLang(code);
                    localStorage.setItem("par_lang", code);
                  }} style={{ fontSize: 18, cursor: "pointer", opacity: lang === code ? 1 : 0.25, transition: "opacity 0.15s" }}>{flag}</div>)}</div>}
          <div onClick={() => { const themes = Object.keys(THEMES); const currentIndex = themes.indexOf(theme); setTheme(themes[(currentIndex + 1) % themes.length]); }} style={{ width: 30, height: 30, borderRadius: 8, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{theme === "dark" ? "🌙" : theme === "light" ? "☀️" : theme === "eco" ? "🌿" : theme === "zen" ? "💜" : theme === "ocean" ? "🌊" : "🌸"}</div>
        </div>
      </div>

      <div style={S.layout}>
        {isDesktop && <div style={S.sidebar}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: T.sub, padding: "0 6px 5px" }}>Navigation</div>
          {TABS.map((label, index) => <div key={index} style={S.sideItem(safeTab === index)} onClick={() => setTab(index)}><span style={{ fontSize: 18 }}>{ICONS[index]}</span><span>{label}</span></div>)}
          {!isLoggedIn && <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(245,158,11,0.08)", borderRadius: 9, border: "1px solid rgba(245,158,11,0.18)", fontSize: 10, color: "#f59e0b", lineHeight: 1.5, fontWeight: 700 }}>{L.loginRequired}</div>}
        </div>}

        <div style={S.main}>
          {[
            <ViewCalExternal key="calendar" S={S} L={L} T={T} lang={lang} month={month} year={year} setMonth={setMonth} setYear={setYear} MOIS={MOIS_LANG} cells={cells} getCellData={getCellData} colorA={colorA} colorB={colorB} events={events} notes={notes} pA={pA} pB={pB} setPa={setPa} setPb={setPb} heureA={heureA} heureB={heureB} setHeureA={setHeureA} setHeureB={setHeureB} mode={mode} setMode={setMode} paireA={paireA} setPaireA={setPaireA} semPaireA={semPaireA} setSemPaireA={setSemPaireA} annePaireA={annePaireA} setAnnePaireA={setAnnePaireA} joursA={joursA} setJoursA={setJoursA} getWN={getWN} pays={pays} setPays={setPays} zone={zone} setZone={setZone} PAYS_LIST={PAYS_LIST} VACANCES_PAR_PAYS={VACANCES_PAR_PAYS} zonesDisponibles={zonesDisponibles} zoneLabels={zoneLabels} anneeSco={anneeSco} getPaques={getPaques} vacAlt={vacAlt} setVacAlt={setVacAlt} showFeries={showFeries} setShowFeries={setShowFeries} setSelDay={setSelDay} setModal={setModal} setNewNote={setNewNote} checklist={checklist} setChecklist={setChecklist} contacts={contacts} setContacts={setContacts} rgbA={rgbA} vac={vac} today={today} prochSpec={prochSpec} fm={fm} fp={fp} sd={sd} getParent={getParent} cfg={cfg} classicStartDay={classicStartDay} setClassicStartDay={setClassicStartDay} classicEndDay={classicEndDay} setClassicEndDay={setClassicEndDay} classicVacationMode={classicVacationMode} setClassicVacationMode={setClassicVacationMode} classicVacationPart={classicVacationPart} setClassicVacationPart={setClassicVacationPart} classicPrimaryParent={classicPrimaryParent} setClassicPrimaryParent={setClassicPrimaryParent} classicPickupHour={classicPickupHour} setClassicPickupHour={setClassicPickupHour} classicReturnHour={classicReturnHour} setClassicReturnHour={setClassicReturnHour} Pill={Pill} Tog={Tog} Btn={Btn} />,
            <ViewEvents key="events" S={S} TABS={TABS} L={L} upEvts={upEvts} EVT_IDS={EVT_IDS} EVT_COLORS={EVT_COLORS} getParent={getParent} cfg={cfg} vac={vac} pA={pA} colorA={colorA} colorB={colorB} T={T} delEvent={delEvent} />,
            <ViewAnnuel key="annual" S={S} TABS={TABS} year={year} setYear={setYear} T={T} anneeSco={anneeSco} getPaques={getPaques} fm={fm} fp={fp} dim={dim} fdow={fdow} sd={sd} today={today} getParent={getParent} cfg={cfg} vac={vac} pA={pA} rgbA={rgbA} rgbB={rgbB} colorA={colorA} colorB={colorB} MOISC={MOISC_LANG} />,
            <ViewSettings key="settings" S={S} L={L} T={T} THEMES={THEMES} PALETTES={PALETTES} theme={theme} setTheme={setTheme} colorA={colorA} colorB={colorB} setColorA={setColorA} setColorB={setColorB} palIdx={palIdx} setPalIdx={setPalIdx} pA={pA} pB={pB} rgbA={rgbA} h2r={h2r} avion={avion} setAvion={setAvion} notifEnabled={notifEnabled} setNotifEnabled={setNotifEnabled} notifHour={notifHour} setNotifHour={setNotifHour} SOCIAL={SOCIAL} APP={APP} premium={premium} setShowDoc={setShowDoc} exportJSON={exportJSON} exportCSV={exportCSV} deleteAll={deleteAll} Tog={Tog} Pill={Pill} Btn={Btn}
              user={user}
              lang={currentLang}
              coparents={coparents}
              loadingCoparents={loadingCoparents}
              coparentError={coparentError}
              coparentConnected={coparentConnected}
              sendInvitation={sendInvitation}
              acceptInvitation={acceptInvitation}
              refuseInvitation={refuseInvitation}
              removeInvitation={removeInvitation}
              EMAIL={EMAIL} RESP={RESP} VER={"1.0"} />
          ][safeTab]}
        </div>
      </div>

      <div style={S.navBar}>{TABS.map((label, index) => <div key={index} style={S.navItem(safeTab === index)} onClick={() => setTab(index)}><span style={{ fontSize: 22 }}>{ICONS[index]}</span><span>{label}</span></div>)}</div>

      {modal === "event" && selDay && <EventModal S={S} T={T} selDay={selDay} month={month} MOIS={MOIS_LANG} newEvt={newEvt} setNewEvt={setNewEvt} addEvent={addEvent} editingEvent={editingEvent} setEditingEvent={setEditingEvent} setModal={setModal} colorA={colorA} EVT_IDS={EVT_IDS} EVT_COLORS={EVT_COLORS} L={L} />}
      {modal === "note" && selDay && <NoteModal S={S} T={T} selDay={selDay} month={month} MOIS={MOIS_LANG} newNote={newNote} setNewNote={setNewNote} saveNote={saveNote} deleteNote={deleteNote} notes={notes} dk={dk} year={year} L={L} setModal={setModal} />}

      {showDoc && <div style={S.modal} onClick={(event) => { if (event.target === event.currentTarget) setShowDoc(null); }}>
        <div style={{ ...S.mCard, maxHeight: "85vh", overflow: "auto" }}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 14, color: T.text }}>{showDoc === "cgu" ? pv1(currentLang, "cgu") : showDoc === "cgv" ? pv1(currentLang, "cgv") : showDoc === "ml" ? pv1(currentLang, "legalNotice") : pv1(currentLang, "privacy")}</div>
          <pre style={{ fontSize: 11, color: T.sub, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{cleanLegalText(showDoc === "cgu" ? pv1Doc(currentLang, "cgu") : showDoc === "cgv" ? pv1Doc(currentLang, "cgv") : showDoc === "ml" ? pv1Doc(currentLang, "legal") : pv1Doc(currentLang, "privacy"))}</pre>
          <div style={{ marginTop: 16 }}><Btn color="#6366f1" size="lg" full onClick={() => setShowDoc(null)}>{L.close}</Btn></div>
        </div>
      </div>}
    </div>
  );
}
