import { useState, useEffect, useRef, useMemo } from "react";

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

const APP = "Parentio";
const RESP = "M. Alvarado";
const EMAIL = "migoumarketing@gmail.com";
const VER = "11.0";

function getSpecial(date, year) {
  const feries = getFeries(year);
  const feteMeres = getFeteMeres(year);
  const fetePeres = getFetePeres(year);

  const ferie = feries.find((item) => sd(item.date, date));

  if (ferie) {
    return {
      label: ferie.nom,
      color: "#d97706",
      type: "ferie"
    };
  }

  if (sd(date, feteMeres)) {
    return {
      label: "Fête des Mères 💐",
      color: "#db2777",
      type: "mere"
    };
  }

  if (sd(date, fetePeres)) {
    return {
      label: "Fête des Pères 👔",
      color: "#2563eb",
      type: "pere"
    };
  }

  return null;
}

function getParent(date, cfg, vac) {
  const {
    mode,
    pA,
    pB,
    paireA,
    zone,
    vacAlt,
    annePaireA,
    semPaireA,
    joursA,

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
  const vacation =
    vacations.find((v) => date >= v.debut && date <= v.fin) || null;

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

      if (classicVacationPart === "first") {
        return isFirstHalf ? parentSecondaire : parentPrincipal;
      }

      return isFirstHalf ? parentPrincipal : parentSecondaire;
    }

    const isEvenWeek = weekNumber % 2 === 0;

    const secondaryWeekend = isEvenWeek
      ? semPaireA === false
      : semPaireA === true;

    let isWeekendRight = false;

    if (classicStartDay === "friday" && classicEndDay === "sunday") {
      isWeekendRight = day === 5 || day === 6 || day === 0;
    }

    if (classicStartDay === "saturday" && classicEndDay === "sunday") {
      isWeekendRight = day === 6 || day === 0;
    }

    if (classicStartDay === "friday" && classicEndDay === "monday") {
      isWeekendRight = day === 5 || day === 6 || day === 0 || day === 1;
    }

    if (classicStartDay === "saturday" && classicEndDay === "monday") {
      isWeekendRight = day === 6 || day === 0 || day === 1;
    }

    if (isWeekendRight && secondaryWeekend) {
      return parentSecondaire;
    }

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

  if (mode === "personnalise") {
    return joursA?.includes(day) ? pA : pB;
  }

  return pA;
}

function nextChg(cfg, vac) {
  const today = new Date();
  const currentParent = getParent(today, cfg, vac);

  for (let i = 1; i <= 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const nextParent = getParent(date, cfg, vac);

    if (nextParent !== currentParent) {
      return {
        days: i,
        parent: nextParent,
        date
      };
    }
  }

  return null;
}
function analyzeTextLocal(text) {
  const clean = text.toLowerCase();

  const result = {
    mode: "alternee",
    paireA: true,
    annePaireA: true,
    heure: null,
    notes: ""
  };

  if (
    clean.includes("résidence principale") ||
    clean.includes("garde principale") ||
    clean.includes("droit de visite")
  ) {
    result.mode = "classique";
  } else if (
    clean.includes("année paire") ||
    clean.includes("année impaire")
  ) {
    result.mode = "annee";
  } else {
    result.mode = "alternee";
  }

  if (
    clean.includes("semaine paire") &&
    (clean.includes("père") || clean.includes("papa"))
  ) {
    result.paireA = false;
  }

  if (
    clean.includes("année paire") &&
    (clean.includes("père") || clean.includes("papa"))
  ) {
    result.annePaireA = false;
  }

  const hourMatch = clean.match(/(\d{1,2})h(\d{2})?|(\d{1,2}):(\d{2})/);

  if (hourMatch) {
    result.heure = hourMatch[0].replace("h", ":");
  }

  if (result.mode === "alternee") {
    result.notes = "Résidence alternée détectée.";
  }

  if (result.mode === "classique") {
    result.notes = "Résidence principale avec droit de visite détectée.";
  }

  if (result.mode === "annee") {
    result.notes = "Organisation par années paires/impaires détectée.";
  }

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
        boxShadow: active
          ? `0 3px 12px rgba(${rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
          : "none",
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
    <label
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: "pointer",
        userSelect: "none"
      }}
    >
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
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: on ? color : T?.sub || "rgba(128,128,128,0.7)"
          }}
        >
          {label}
        </div>

        {sub && (
          <div
            style={{
              fontSize: 10,
              color: T?.sub || "rgba(128,128,128,0.5)",
              marginTop: 1
            }}
          >
            {sub}
          </div>
        )}
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
    disc:
      "⚠️ Outil d'organisation uniquement — aucune valeur juridique automatique. Parentio ne doit pas servir à surveiller, harceler ou faire pression sur l’autre parent.",
    evtTypes: ["🏥 Médical", "⚽ Sport", "📚 École", "🎂 Fête", "📌 Autre"],
    jugTitle: "🤖 Analyse de votre jugement",
    jugSub:
      "Copiez-collez le texte de votre jugement ci-dessous. L’analyse reste indicative.",
    jugBtn: "Analyser",
    jugPlh: "Collez ici le texte de votre jugement de garde...",
    premium: "🚀 Passer Premium",
    premiumSub:
      "Débloquez la sauvegarde cloud complète, les exports et les modes avancés.",
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
    checkItems: [
      "Cartable 🎒",
      "Médicaments 💊",
      "Peluche 🧸",
      "Vêtements 👕",
      "Chaussures 👟",
      "Doudou 🧸",
      "Livre 📖"
    ],
    contacts: "Contacts urgence",
    reinit: "Réinitialiser",
    joursSemaine: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
    joursA: "Jours Parent A",
    cloudOn: "Cloud activé",
    cloudOff: "Mode local",
    loginRequired:
      "Connectez-vous pour sauvegarder vos données entre plusieurs appareils."
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
    disc:
      "⚠️ Herramienta de organización únicamente — sin valor jurídico automático. Parentio no debe usarse para vigilar, acosar o presionar al otro progenitor.",
    evtTypes: [
      "🏥 Médico",
      "⚽ Deporte",
      "📚 Escuela",
      "🎂 Fiesta",
      "📌 Otro"
    ],
    jugTitle: "🤖 Análisis de su resolución",
    jugSub:
      "Copie y pegue el texto de su resolución. El análisis es orientativo.",
    jugBtn: "Analizar",
    jugPlh: "Pegue aquí el texto de su resolución...",
    premium: "🚀 Plan Premium",
    premiumSub:
      "Desbloquea guardado cloud completo, exportaciones y modos avanzados.",
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
    checkItems: [
      "Mochila 🎒",
      "Medicamentos 💊",
      "Peluche 🧸",
      "Ropa 👕",
      "Zapatos 👟",
      "Mantita 🧸",
      "Libro 📖"
    ],
    contacts: "Contactos de emergencia",
    reinit: "Reiniciar",
    joursSemaine: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
    joursA: "Días Progenitor A",
    cloudOn: "Cloud activado",
    cloudOff: "Modo local",
    loginRequired:
      "Inicie sesión para guardar sus datos entre varios dispositivos.",

    classicSettings: "⚙️ Configuración clásica",
    weekendMode: "Fin de semana",
    startFriday: "Viernes → Domingo",
    startSaturday: "Sábado → Domingo",
    endSunday: "Devolver domingo",
    endMonday: "Devolver lunes",
    vacationsSplit: "Mitad vacaciones",
    vacationsWeek: "Semana vacaciones",
    firstWeek: "Primera semana",
    secondWeek: "Segunda semana",
    primaryParent: "Padre principal",
    secondaryParent: "Padre secundario",
    pickupHour: "Hora recogida",
    returnHour: "Hora devolución",
    franceZone: "Zona escolar",
    holidays: "Vacaciones escolares",
    classicSummary: "Resumen clásico",
    currentWeek: "Semana actual",
    currentYear: "Año actual"
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
    disc:
      "⚠️ Organisation tool only — no automatic legal value. Parentio must not be used to monitor, harass, or pressure the other parent.",
    evtTypes: [
      "🏥 Medical",
      "⚽ Sport",
      "📚 School",
      "🎂 Party",
      "📌 Other"
    ],
    jugTitle: "🤖 Court order analysis",
    jugSub:
      "Paste your court order text below. The analysis is only indicative.",
    jugBtn: "Analyse",
    jugPlh: "Paste your court order text here...",
    premium: "🚀 Go Premium",
    premiumSub:
      "Unlock full cloud sync, exports, and advanced custody modes.",
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
    checkItems: [
      "School bag 🎒",
      "Medication 💊",
      "Stuffed toy 🧸",
      "Clothes 👕",
      "Shoes 👟",
      "Comfort toy 🧸",
      "Book 📖"
    ],
    contacts: "Emergency contacts",
    reinit: "Reset",
    joursSemaine: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    joursA: "Parent A days",
    cloudOn: "Cloud enabled",
    cloudOff: "Local mode",
    loginRequired:
      "Sign in to keep your data across devices.",

    classicSettings: "⚙️ Classic settings",
    weekendMode: "Weekend",
    startFriday: "Friday → Sunday",
    startSaturday: "Saturday → Sunday",
    endSunday: "Return Sunday",
    endMonday: "Return Monday",
    vacationsSplit: "Split holidays",
    vacationsWeek: "Holiday weeks",
    firstWeek: "First week",
    secondWeek: "Second week",
    primaryParent: "Primary parent",
    secondaryParent: "Secondary parent",
    pickupHour: "Pickup time",
    returnHour: "Return time",
    franceZone: "School zone",
    holidays: "School holidays",
    classicSummary: "Classic summary",
    currentWeek: "Current week",
    currentYear: "Current year"
  }
};
  const TABS = L.tabs;
  const ICONS = ["📅", "🗓️", "📆", "⚙️"];

  const isDesktop = screenW >= 1024;

  const rgbA = h2r(colorA);
  const rgbB = h2r(colorB);

  const anneeSco = getAnneeSco(new Date(year, month, 1));

  const paysInfo =
    VACANCES_PAR_PAYS[pays] || VACANCES_PAR_PAYS.france;

  const zonesDisponibles =
    paysInfo.zones || ["A", "B", "C"];

  const zoneLabels =
    paysInfo.zoneLabels || {};

  const vac =
    paysInfo.data[anneeSco] ||
    paysInfo.data[2025] ||
    {};

  const cfg = {
    mode,
    pA,
    pB,
    paireA,
    zone,
    vacAlt,
    annePaireA,
    semPaireA,
    joursA,

    classicStartDay,
    classicEndDay,

    classicVacationMode,
    classicVacationPart,

    classicPrimaryParent,

    classicPickupHour,
    classicReturnHour
  };

  const dimM = dim(year, month);

  const fd = fdow(year, month);

  const cells = [];

  for (let i = 0; i < fd; i++) {
    cells.push(null);
  }

  for (let i = 1; i <= dimM; i++) {
    cells.push(i);
  }

  function handleAccept(language) {
    localStorage.setItem("parentio-consent", "true");

    localStorage.setItem("par_v11", "1");

    localStorage.setItem(
      "par_lang",
      language || "fr"
    );

    setLang(language || "fr");

    setAccepted(true);
  }

  function getCellData(day) {
    if (!day) return null;

    const date = new Date(year, month, day);

    const key = dk(year, month, day);

    const parent = getParent(date, cfg, vac);

    const vacations = vac?.[zone] || [];

    const vacation =
      vacations.find(
        (v) => date >= v.debut && date <= v.fin
      ) || null;

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

  const allDays = cells
    .map((day) => (day ? getCellData(day) : null))
    .filter(Boolean);

  const stA = allDays.filter(
    (day) => day.isA
  ).length;

  const stB = allDays.filter(
    (day) => !day.isA
  ).length;

  const cntd = nextChg(cfg, vac);

  const selData = selDay
    ? getCellData(selDay)
    : null;

  const upEvts = [];

  for (let m2 = 0; m2 < 3; m2++) {
    const nextMonthValue =
      (month + m2) % 12;

    const nextYearValue =
      year + Math.floor((month + m2) / 12);

    for (
      let d = 1;
      d <= dim(nextYearValue, nextMonthValue);
      d++
    ) {
      const key = dk(
        nextYearValue,
        nextMonthValue,
        d
      );

      const list = events[key] || [];

      if (list.length) {
        const date = new Date(
          nextYearValue,
          nextMonthValue,
          d
        );

        if (date >= today) {
          list.forEach((event) => {
            upEvts.push({
              ...event,
              date,
              key
            });
          });
        }
      }
    }
  }

  upEvts.sort((a, b) => a.date - b.date);

  const feries = getFeries(year);

  const fm = getFeteMeres(year);

  const fp = getFetePeres(year);

  const prochSpec = [
    ...feries,
    {
      date: fm,
      nom: "Fête des Mères 💐"
    },
    {
      date: fp,
      nom: "Fête des Pères 👔"
    }
  ]
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 6);
  const {
    cloudSettings,
    loadingSettings
  } = useSettings(user, cfg);

  useEffect(() => {
    localStorage.setItem("par_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("par_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("par_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("par_lang", lang);
  }, [lang]);

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

      if (!groupedEvents[key]) {
        groupedEvents[key] = [];
      }

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

    if (typeof cloudSettings.paireA === "boolean") {
      setPaireA(cloudSettings.paireA);
    }

    if (typeof cloudSettings.semPaireA === "boolean") {
      setSemPaireA(cloudSettings.semPaireA);
    }

    if (typeof cloudSettings.annePaireA === "boolean") {
      setAnnePaireA(cloudSettings.annePaireA);
    }

    if (Array.isArray(cloudSettings.joursA)) {
      setJoursA(cloudSettings.joursA);
    }

    if (cloudSettings.pays) setPays(cloudSettings.pays);
    if (cloudSettings.zone) setZone(cloudSettings.zone);

    if (typeof cloudSettings.vacAlt === "boolean") {
      setVacAlt(cloudSettings.vacAlt);
    }

    if (cloudSettings.classicStartDay) {
      setClassicStartDay(cloudSettings.classicStartDay);
    }

    if (cloudSettings.classicEndDay) {
      setClassicEndDay(cloudSettings.classicEndDay);
    }

    if (cloudSettings.classicVacationMode) {
      setClassicVacationMode(cloudSettings.classicVacationMode);
    }

    if (cloudSettings.classicVacationPart) {
      setClassicVacationPart(cloudSettings.classicVacationPart);
    }

    if (cloudSettings.classicPrimaryParent) {
      setClassicPrimaryParent(cloudSettings.classicPrimaryParent);
    }

    if (cloudSettings.classicPickupHour) {
      setClassicPickupHour(cloudSettings.classicPickupHour);
    }

    if (cloudSettings.classicReturnHour) {
      setClassicReturnHour(cloudSettings.classicReturnHour);
    }
  }, [cloudSettings, isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimIn(true), 80);

    function resize() {
      setScreenW(window.innerWidth);
    }

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
            if (permission === "granted") {
              new Notification(`${APP} 📅`, {
                body: `Changement dans ${next.days}j → ${next.parent}`
              });
            }
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

    if (result.paireA !== undefined) {
      setPaireA(result.paireA);
    }

    if (result.annePaireA !== undefined) {
      setAnnePaireA(result.annePaireA);
    }

    if (result.heure) {
      setHeureA(result.heure);
      setHeureB(result.heure);
    }
  }
  async function addEvent() {
    if (savingEventRef.current) return;

    if (!newEvt.titre.trim()) return;

    if (!selDay) return;

    savingEventRef.current = true;

    const key =
      editingEvent?.key ||
      dk(year, month, selDay);

    const localEvent = {
      id:
        editingEvent?.id ||
        crypto.randomUUID(),

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
          await editCloudEvent(
            editingEvent.id,
            {
              title: newEvt.titre,
              type: newEvt.type || "rdv",
              parent: newEvt.parent || "",
              event_date: key,
              status: "planned",
              heure: newEvt.heure || ""
            }
          );
        } else {
          const created =
            await addCloudEvent({
              title: newEvt.titre,
              type: newEvt.type || "rdv",
              parent: newEvt.parent || "",
              event_date: key,
              status: "planned",
              heure: newEvt.heure || ""
            });

          const saved = created?.[0];

          if (saved?.id) {
            localEvent.id = saved.id;
          }
        }
      }

      setEvents((previous) => {
        const current =
          previous[key] || [];

        if (editingEvent) {
          return {
            ...previous,
            [key]: current.map((event) =>
              event.id === editingEvent.id
                ? localEvent
                : event
            )
          };
        }

        return {
          ...previous,
          [key]: [...current, localEvent]
        };
      });

      setNewEvt({
        type: "rdv",
        titre: "",
        heure: "",
        shared: true
      });

      setEditingEvent(null);

      setModal(null);

    } catch (error) {
      console.error(
        "Erreur événement :",
        error
      );

      alert(
        "Erreur lors de l'enregistrement de l'événement."
      );
    } finally {
      savingEventRef.current = false;
    }
  }

  async function delEvent(key, id) {
    try {
      setEvents((previous) => ({
        ...previous,
        [key]: (
          previous[key] || []
        ).filter(
          (event) => event.id !== id
        )
      }));

      if (isLoggedIn && id) {
        await removeCloudEvent(id);
      }

    } catch (error) {
      console.error(
        "Erreur suppression événement :",
        error
      );

      alert(
        "Erreur suppression événement."
      );
    }
  }

  async function saveNote() {
    if (!selDay) return;

    const key = dk(
      year,
      month,
      selDay
    );

    try {
      if (isLoggedIn) {
        await saveCloudNote({
          note_date: key,
          content: newNote
        });
      }

      setNotes((previous) => ({
        ...previous,
        [key]: newNote
      }));

      setModal(null);

    } catch (error) {
      console.error(
        "Erreur sauvegarde note :",
        error
      );

      alert(
        "Erreur sauvegarde note."
      );
    }
  }

  async function deleteNote() {
    if (!selDay) return;

    const key = dk(
      year,
      month,
      selDay
    );

    try {
      if (isLoggedIn) {
        await removeCloudNoteByDate(key);
      }

      setNotes((previous) => {
        const copy = {
          ...previous
        };

        delete copy[key];

        return copy;
      });

      setNewNote("");

      setModal(null);

    } catch (error) {
      console.error(
        "Erreur suppression note :",
        error
      );

      alert(
        "Erreur suppression note."
      );
    }
  }

  function exportJSON() {
    const data = {
      date: new Date().toISOString(),

      app: `${APP} v${VER}`,

      rgpd: "Art.20 RGPD",

      parents: {
        A: pA,
        B: pB
      },

      parametres: {
        mode,
        zone,
        pays,
        paireA,
        semPaireA,
        annePaireA,
        joursA,
        vacAlt,
        colorA,
        colorB,
        lang,
        theme,

        classicStartDay,
        classicEndDay,

        classicVacationMode,
        classicVacationPart,

        classicPrimaryParent,

        classicPickupHour,
        classicReturnHour
      },

      evenements: events,

      notes,

      contacts
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${APP}-donnees-${
        new Date()
          .toISOString()
          .split("T")[0]
      }.json`;

    link.click();

    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const rows = [
      [
        "Date",
        "Titre",
        "Type",
        "Partagé",
        "Heure"
      ]
    ];

    Object.entries(events).forEach(
      ([date, list]) => {
        (list || []).forEach(
          (event) => {
            rows.push([
              date,
              event.titre || "",
              event.type || "",
              event.shared
                ? "Oui"
                : "Non",
              event.heure || ""
            ]);
          }
        );
      }
    );

    const blob = new Blob(
      [
        rows
          .map((row) =>
            row.join(",")
          )
          .join("\n")
      ],
      {
        type: "text/csv"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${APP}-events-${
        new Date()
          .toISOString()
          .split("T")[0]
      }.csv`;

    link.click();

    URL.revokeObjectURL(url);
  }
