export default function SharedDataCard({
  S = {},
  T = {},
  sharedEvents = [],
  sharedNotes = [],
  loadingSharedData = false,
  sharedDataError = null,
  lang = "fr"
}) {
  const text = {
    fr: {
      title: "Données partagées",
      sub: "Visualisez les événements et notes accessibles dans le cadre du partage co-parent.",
      events: "Événements partagés",
      notes: "Notes partagées",
      emptyEvents: "Aucun événement partagé.",
      emptyNotes: "Aucune note partagée.",
      loading: "Chargement..."
    },
    en: {
      title: "Shared data",
      sub: "View events and notes available through co-parent sharing.",
      events: "Shared events",
      notes: "Shared notes",
      emptyEvents: "No shared event.",
      emptyNotes: "No shared note.",
      loading: "Loading..."
    },
    es: {
      title: "Datos compartidos",
      sub: "Visualice eventos y notas disponibles mediante el intercambio con el co-progenitor.",
      events: "Eventos compartidos",
      notes: "Notas compartidas",
      emptyEvents: "Ningún evento compartido.",
      emptyNotes: "Ninguna nota compartida.",
      loading: "Cargando..."
    }
  }[lang] || {
    title: "Shared data",
    sub: "View shared events and notes.",
    events: "Shared events",
    notes: "Shared notes",
    emptyEvents: "No shared event.",
    emptyNotes: "No shared note.",
    loading: "Loading..."
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
        🔗 {text.title}
      </div>

      <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.5, marginBottom: 14 }}>
        {text.sub}
      </div>

      {sharedDataError && (
        <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
          {sharedDataError}
        </div>
      )}

      {loadingSharedData ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>{text.loading}</div>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>
              {text.events}
            </div>

            {sharedEvents.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>{text.emptyEvents}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sharedEvents.slice(0, 8).map((event) => (
                  <div key={event.id} style={{ padding: 10, borderRadius: 12, background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.14)" }}>
                    <div style={{ fontWeight: 900, fontSize: 13 }}>
                      {event.title || event.titre || "Événement"}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      {formatDate(event.event_date || event.date)} · {event.type || "event"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>
              {text.notes}
            </div>

            {sharedNotes.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>{text.emptyNotes}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sharedNotes.slice(0, 8).map((note) => (
                  <div key={note.id} style={{ padding: 10, borderRadius: 12, background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.14)" }}>
                    <div style={{ fontWeight: 900, fontSize: 13 }}>
                      {formatDate(note.note_date || note.date)}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                      {note.content || note.contenu || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
