export default function PDFExportCard({
  S = {},
  T = {},
  premium = false,
  onExportPDF = () => {},
  setPremium = () => {},
  lang = "fr"
}) {
  const text = {
    fr: {
      title: "Export PDF professionnel",
      sub: "Générez un calendrier mensuel propre avec garde, événements, notes et mention d’usage.",
      button: "Exporter le mois en PDF",
      locked: "Export PDF réservé au plan Premium.",
      upgrade: "Passer Premium"
    },
    en: {
      title: "Professional PDF export",
      sub: "Generate a clean monthly calendar with custody, events, notes, and usage disclaimer.",
      button: "Export month as PDF",
      locked: "PDF export is reserved for Premium.",
      upgrade: "Go Premium"
    },
    es: {
      title: "Exportación PDF profesional",
      sub: "Genere un calendario mensual con custodia, eventos, notas y aviso de uso.",
      button: "Exportar mes en PDF",
      locked: "La exportación PDF está reservada al plan Premium.",
      upgrade: "Pasar a Premium"
    }
  }[lang] || {
    title: "Professional PDF export",
    sub: "Generate a clean monthly calendar.",
    button: "Export PDF",
    locked: "PDF export is reserved for Premium.",
    upgrade: "Go Premium"
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
        📄 {text.title}
      </div>

      <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.5, marginBottom: 14 }}>
        {premium ? text.sub : text.locked}
      </div>

      {premium ? (
        <button
          onClick={onExportPDF}
          style={{ border: "none", borderRadius: 12, padding: "12px 14px", background: "#4f46e5", color: "#fff", fontWeight: 900, cursor: "pointer" }}
        >
          {text.button}
        </button>
      ) : (
        <button
          onClick={() => setPremium(true)}
          style={{ border: "none", borderRadius: 12, padding: "12px 14px", background: "#f59e0b", color: "#111827", fontWeight: 900, cursor: "pointer" }}
        >
          {text.upgrade}
        </button>
      )}
    </div>
  );
}
