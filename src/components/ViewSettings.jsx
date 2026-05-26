import { pv1, pv1Doc, normalizeLangV1 } from "../i18n/parentioI18nV1";
import PremiumCard from "./PremiumCard";
import CoparentCard from "./CoparentCard";

export default function ViewSettings({
  S = {},
  L = {},
  T = {},
  THEMES = {},
  PALETTES = [],
  theme = "dark",
  setTheme = () => {},
  colorA = "#6366f1",
  colorB = "#ec4899",
  setColorA = () => {},
  setColorB = () => {},
  palIdx = 0,
  setPalIdx = () => {},
  pA = "Parent A",
  pB = "Parent B",
  rgbA = "99,102,241",
  h2r = () => "99,102,241",
  avion = false,
  setAvion = () => {},
  notifEnabled = false,
  setNotifEnabled = () => {},
  notifHour = "09:00",
  setNotifHour = () => {},
  SOCIAL = [],
  APP = "Parentio",
  premium = false,
  PLAN,
  setPremium = () => {},
  setShowDoc = () => {},
  exportJSON = () => {},
  exportCSV = () => {},
  deleteAll = () => {},
  Tog,
  Pill,
  Btn,
  user = null,
  lang: forcedLang,
  coparents = [],
  loadingCoparents = false,
  coparentError = null,
  coparentConnected = false,
  sendInvitation = async () => false,
  acceptInvitation = async () => false,
  refuseInvitation = async () => false,
  removeInvitation = async () => false,
  EMAIL = "",
  RESP = "",
  VER = "1.0"
}) {
  const lang = normalizeLangV1(
    forcedLang ||
    (L?.tabs?.[0] === "Calendar"
      ? "en"
      : L?.tabs?.[0] === "Calendario"
      ? "es"
      : "fr")
  );

  const TXT = {
    fr: {
      title: "Réglages",
      premiumTitle: "Premium",
      appearance: "Apparence",
      theme: "Thème",
      colors: "Couleurs",
      colorsHelp: "Choisissez une palette lisible pour distinguer les deux parents.",
      notifications: "Notifications",
      airplane: "Mode avion",
      airplaneSub: "Désactive toutes les notifications.",
      reminder: "Rappel quotidien",
      reminderSub: "Maximum 1 rappel par jour.",
      reminderHour: "Heure du rappel",
      data: "Mes données",
      exportJson: "Exporter JSON",
      exportCsv: "Exporter CSV",
      deleteData: "Effacer mes données",
      legal: "Documents légaux",
      cgu: "CGU",
      cgv: "CGV",
      privacy: "Politique de confidentialité",
      mentions: "Mentions légales",
      security: "Sécurité & usage responsable",
      securityText:
        "Parentio est un outil d’organisation. Il ne doit pas servir à surveiller, harceler ou exercer une pression sur l’autre parent.",
      contact: "Contact",
      version: "Version"
    },
    es: {
      title: "Ajustes",
      premiumTitle: "Premium",
      appearance: "Apariencia",
      theme: "Tema",
      colors: "Colores",
      colorsHelp: "Elija una paleta legible para diferenciar a los dos progenitores.",
      notifications: "Notificaciones",
      airplane: "Modo avión",
      airplaneSub: "Desactiva todas las notificaciones.",
      reminder: "Recordatorio diario",
      reminderSub: "Máximo 1 recordatorio al día.",
      reminderHour: "Hora del recordatorio",
      data: "Mis datos",
      exportJson: "Exportar JSON",
      exportCsv: "Exportar CSV",
      deleteData: "Borrar mis datos",
      legal: "Documentos legales",
      cgu: "Condiciones de uso",
      cgv: "Condiciones de venta",
      privacy: "Política de privacidad",
      mentions: "Aviso legal",
      security: "Seguridad y uso responsable",
      securityText:
        "Parentio es una herramienta de organización. No debe usarse para vigilar, acosar o presionar al otro progenitor.",
      contact: "Contacto",
      version: "Versión"
    },
    en: {
      title: "Settings",
      premiumTitle: "Premium",
      appearance: "Appearance",
      theme: "Theme",
      colors: "Colors",
      colorsHelp: "Choose a readable palette to distinguish both parents.",
      notifications: "Notifications",
      airplane: "Airplane mode",
      airplaneSub: "Disables all notifications.",
      reminder: "Daily reminder",
      reminderSub: "Maximum 1 reminder per day.",
      reminderHour: "Reminder time",
      data: "My data",
      exportJson: "Export JSON",
      exportCsv: "Export CSV",
      deleteData: "Delete my data",
      legal: "Legal documents",
      cgu: "Terms of use",
      cgv: "Terms of sale",
      privacy: "Privacy policy",
      mentions: "Legal notice",
      security: "Security & responsible use",
      securityText:
        "Parentio is an organisation tool. It must not be used to monitor, harass, or pressure the other parent.",
      contact: "Contact",
      version: "Version"
    }
  }[lang];


  const V1TXT = {
    ...TXT,
    title: pv1(lang, "settings"),
    premiumTitle: pv1(lang, "premium"),
    securityText: pv1(lang, "organisationWarning"),
    appearance: pv1(lang, "appearance"),
    theme: pv1(lang, "theme"),
    colors: pv1(lang, "colors"),
    notifications: pv1(lang, "notifications"),
    airplane: pv1(lang, "airplane"),
    reminder: pv1(lang, "reminder"),
    reminderHour: pv1(lang, "reminderTime"),
    data: pv1(lang, "myData"),
    exportJson: pv1(lang, "exportJson"),
    exportCsv: pv1(lang, "exportCsv"),
    deleteData: pv1(lang, "deleteData"),
    legal: pv1(lang, "legalDocs"),
    cgu: pv1(lang, "cgu"),
    cgv: pv1(lang, "cgv"),
    privacy: pv1(lang, "privacy"),
    mentions: pv1(lang, "legalNotice"),
    security: pv1(lang, "security"),
    contact: pv1(lang, "contact"),
    version: pv1(lang, "version")
  };

  const cleanPalettes = PALETTES.filter((palette, index, arr) => {
    const key = `${palette.a}-${palette.b}`;
    return arr.findIndex((p) => `${p.a}-${p.b}` === key) === index;
  });

  const defaultCard = {
    background: T.card || "rgba(255,255,255,0.06)",
    border: `1px solid ${T.border || "rgba(255,255,255,0.12)"}`,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    color: T.text || "#fff"
  };

  const sectionTitle = {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: T.sub || "rgba(255,255,255,0.6)",
    marginBottom: 10
  };

  const row = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center"
  };

  const button = {
    border: "none",
    borderRadius: 12,
    padding: "11px 13px",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 13
  };

  return (
    <>
      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>⚙️ {V1TXT.title}</div>

        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.20)",
            color: "#f59e0b",
            borderRadius: 12,
            padding: 10,
            fontSize: 12,
            lineHeight: 1.5,
            fontWeight: 700
          }}
        >
          {V1TXT.securityText}
        </div>
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>👑 {V1TXT.premiumTitle}</div>
        <PremiumCard premium={premium} setPremium={setPremium} PLAN={PLAN || { features: [] }} lang={lang} user={user} />
      </div>

      <div style={S.card || defaultCard}>
        <CoparentCard
          S={S}
          T={T}
          user={user}
          coparents={coparents}
          loadingCoparents={loadingCoparents}
          coparentError={coparentError}
          sendInvitation={sendInvitation}
          acceptInvitation={acceptInvitation}
          refuseInvitation={refuseInvitation}
          removeInvitation={removeInvitation}
          lang={lang}
        />
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>🎨 {V1TXT.appearance}</div>

        <div style={{ marginBottom: 12 }}>
          <div style={S.inpLbl || { fontSize: 12, color: T.sub, marginBottom: 6 }}>
            {V1TXT.theme}
          </div>

          <div style={row}>
            {Object.entries(THEMES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                style={{
                  ...button,
                  background:
                    theme === key
                      ? `rgba(${rgbA},0.22)`
                      : "rgba(128,128,128,0.10)",
                  color: theme === key ? colorA : T.text,
                  border: `1px solid ${
                    theme === key ? colorA : T.border || "rgba(255,255,255,0.12)"
                  }`
                }}
              >
                {value?.name || key}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={S.inpLbl || { fontSize: 12, color: T.sub, marginBottom: 6 }}>
            {V1TXT.colors}
          </div>

          <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.5, marginBottom: 10 }}>
            {V1TXT.colorsHelp}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))",
              gap: 8
            }}
          >
            {cleanPalettes.map((palette, index) => (
              <button
                key={`${palette.a}-${palette.b}`}
                onClick={() => {
                  setPalIdx(index);
                  setColorA(palette.a);
                  setColorB(palette.b);
                }}
                style={{
                  height: 36,
                  borderRadius: 10,
                  overflow: "hidden",
                  display: "flex",
                  padding: 0,
                  cursor: "pointer",
                  border:
                    palIdx === index || (colorA === palette.a && colorB === palette.b)
                      ? "2px solid #fff"
                      : `1px solid ${T.border || "rgba(255,255,255,0.15)"}`,
                  background: "transparent"
                }}
              >
                <span style={{ flex: 1, background: palette.a }} />
                <span style={{ flex: 1, background: palette.b }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>🔔 {V1TXT.notifications}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Tog ? (
            <Tog
              on={avion}
              onChange={() => setAvion((value) => !value)}
              label={V1TXT.airplane}
              sub={V1TXT.airplaneSub}
              color="#2563eb"
              T={T}
            />
          ) : null}

          {Tog ? (
            <Tog
              on={notifEnabled}
              onChange={() => setNotifEnabled((value) => !value)}
              label={V1TXT.reminder}
              sub={V1TXT.reminderSub}
              color="#10b981"
              T={T}
            />
          ) : null}

          <div>
            <div style={S.inpLbl || { fontSize: 12, color: T.sub, marginBottom: 6 }}>
              {V1TXT.reminderHour}
            </div>

            <input
              type="time"
              value={notifHour}
              onChange={(event) => setNotifHour(event.target.value)}
              style={{
                ...(S.inp || {}),
                width: "100%",
                maxWidth: 180,
                minWidth: 0,
                borderRadius: 12
              }}
            />
          </div>
        </div>
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>📦 {V1TXT.data}</div>

        <div style={row}>
          <button
            onClick={exportJSON}
            style={{
              ...button,
              background: `rgba(${rgbA},0.18)`,
              color: colorA,
              border: `1px solid rgba(${rgbA},0.28)`
            }}
          >
            📤 {V1TXT.exportJson}
          </button>

          <button
            onClick={exportCSV}
            style={{
              ...button,
              background: "rgba(16,185,129,0.12)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.25)"
            }}
          >
            📊 {V1TXT.exportCsv}
          </button>

          <button
            onClick={deleteAll}
            style={{
              ...button,
              background: "rgba(239,68,68,0.10)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.22)"
            }}
          >
            🗑️ {V1TXT.deleteData}
          </button>
        </div>
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>⚖️ {V1TXT.legal}</div>

        <div style={row}>
          <button onClick={() => setShowDoc("cgu")} style={{ ...button }}>
            {V1TXT.cgu}
          </button>

          <button onClick={() => setShowDoc("cgv")} style={{ ...button }}>
            {V1TXT.cgv}
          </button>

          <button onClick={() => setShowDoc("pc")} style={{ ...button }}>
            {V1TXT.privacy}
          </button>

          <button onClick={() => setShowDoc("ml")} style={{ ...button }}>
            {V1TXT.mentions}
          </button>
        </div>
      </div>

      <div style={S.card || defaultCard}>
        <div style={S.sec || sectionTitle}>🛡️ {V1TXT.security}</div>

        <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.6 }}>
          <strong style={{ color: T.text }}>{APP}</strong> · {V1TXT.version} {VER}
          <br />
          {V1TXT.contact} : {EMAIL}
          <br />
          {RESP}
        </div>
      </div>
    </>
  );
}
