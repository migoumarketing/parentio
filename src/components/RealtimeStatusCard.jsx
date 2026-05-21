export default function RealtimeStatusCard({
  S = {},
  T = {},
  realtimeConnected = false,
  lastRealtimeEvent = null,
  lang = "fr"
}) {
  const text = {
    fr: {
      title: "Synchronisation temps réel",
      connected: "Connecté",
      disconnected: "Non connecté",
      last: "Dernière mise à jour",
      none: "Aucune mise à jour reçue.",
      info: "Les changements co-parent seront synchronisés automatiquement quand la connexion temps réel est active."
    },
    en: {
      title: "Realtime sync",
      connected: "Connected",
      disconnected: "Disconnected",
      last: "Last update",
      none: "No update received.",
      info: "Co-parent changes will sync automatically when realtime is active."
    },
    es: {
      title: "Sincronización en tiempo real",
      connected: "Conectado",
      disconnected: "No conectado",
      last: "Última actualización",
      none: "Ninguna actualización recibida.",
      info: "Los cambios del co-progenitor se sincronizarán automáticamente cuando el tiempo real esté activo."
    }
  }[lang] || {
    title: "Realtime sync",
    connected: "Connected",
    disconnected: "Disconnected",
    last: "Last update",
    none: "No update received.",
    info: "Co-parent changes will sync automatically when realtime is active."
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  return (
    <div style={card}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          opacity: 0.65,
          textTransform: "uppercase",
          letterSpacing: 1.4,
          marginBottom: 8
        }}
      >
        🔄 {text.title}
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          borderRadius: 999,
          background: realtimeConnected
            ? "rgba(16,185,129,0.12)"
            : "rgba(245,158,11,0.12)",
          color: realtimeConnected ? "#10b981" : "#f59e0b",
          fontWeight: 900,
          fontSize: 12,
          marginBottom: 10
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: realtimeConnected ? "#10b981" : "#f59e0b"
          }}
        />
        {realtimeConnected ? text.connected : text.disconnected}
      </div>

      <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.5 }}>
        {text.info}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 10,
          borderRadius: 12,
          background: "rgba(128,128,128,0.08)",
          fontSize: 12,
          opacity: 0.8
        }}
      >
        <strong>{text.last} :</strong>{" "}
        {lastRealtimeEvent?.at
          ? new Date(lastRealtimeEvent.at).toLocaleString()
          : text.none}
      </div>
    </div>
  );
}
