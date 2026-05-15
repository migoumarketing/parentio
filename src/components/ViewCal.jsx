export default function ViewCal({
  S,
  L
}) {
  return (
    <>
      <div style={S.disc}>
        {L.disc}
      </div>

      <div
        style={{
          background: "#111827",
          borderRadius: 16,
          padding: 20,
          marginBottom: 14,
          color: "#fff"
        }}
      >
        <div
          style={{
            fontSize: 11,
            opacity: 0.7,
            marginBottom: 8
          }}
        >
          PROCHAIN CHANGEMENT
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700
          }}
        >
          Papa dans 3 jours
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>
          📅 Calendrier
        </div>

        <div
          style={{
            fontSize: 13,
            opacity: 0.7
          }}
        >
          Migration calendrier en cours
        </div>
      </div>
    </>
  );
}
