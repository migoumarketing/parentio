export default function ViewEvents({
  S = {},
  L = {},
  upEvts = [],
  EVT_IDS = [],
  EVT_COLORS = [],
  T = {},
  delEvent = () => {}
}) {
  const evtLine =
    S.evtLine ||
    ((color) => ({
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 0",
      borderBottom: `1px solid ${T.border || "rgba(255,255,255,0.12)"}`,
      color: T.text || "#fff"
    }));

  const badge =
    S.badge ||
    ((color) => ({
      padding: "3px 8px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: "rgba(255,255,255,0.08)",
      color
    }));

  return (
    <div style={S.card || { padding: 16 }}>
      <div style={S.sec || { marginBottom: 12, fontWeight: 800 }}>
        🗓️ {L.tabs?.[1] || "Événements"}
      </div>

      <div style={S.disc || { marginBottom: 12, fontSize: 12 }}>
        {L.disc ||
          "⚠️ Outil d'organisation uniquement — aucune valeur juridique"}
      </div>

      {upEvts.length === 0 ? (
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            color: T.sub || "rgba(255,255,255,0.65)",
            fontSize: 13,
            fontWeight: 700
          }}
        >
          Aucun événement à venir.
        </div>
      ) : (
        <div>
          {upEvts.map((event, index) => {
            const typeIndex = EVT_IDS.indexOf(event.type);
            const color = EVT_COLORS[typeIndex] || "#8b5cf6";

            const dateText = event.date
              ? event.date.toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                })
              : event.key || "";

            return (
              <div key={event.id || `${event.key}-${index}`} style={evtLine(color)}>
                <div
                  style={{
                    width: 3,
                    height: 34,
                    borderRadius: 2,
                    background: color,
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: T.text || "#fff",
                      wordBreak: "break-word"
                    }}
                  >
                    {event.titre || event.title || "Événement"}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: T.sub || "rgba(255,255,255,0.6)",
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginTop: 3
                    }}
                  >
                    <span>{dateText}</span>

                    {event.heure && <span>🕐 {event.heure}</span>}

                    {event.parent && (
                      <span style={{ fontWeight: 700 }}>
                        {event.parent}
                      </span>
                    )}

                    <span style={badge(event.shared ? "#10b981" : "#6b7280")}>
                      {event.shared ? L.shared || "Partagé" : L.prive || "Privé 🔒"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => delEvent(event.key, event.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.sub || "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    fontSize: 18,
                    padding: 6,
                    lineHeight: 1
                  }}
                  aria-label="Supprimer l’événement"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
