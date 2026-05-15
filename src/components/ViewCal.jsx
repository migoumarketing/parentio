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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14
          }}
        >
          <button
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer"
            }}
          >
            ‹
          </button>

          <div
            style={{
              fontSize: 20,
              fontWeight: 800
            }}
          >
            Calendrier Parentio
          </div>

          <button
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer"
            }}
          >
            ›
          </button>
        </div>

        <div
          style={{
            fontSize: 13,
            opacity: 0.7
          }}
        >
          Structure calendrier prête
        </div>
      </div>
    </>
  );
}
