const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function ViewCal({
  S,
  L
}) {
  const cells = Array.from({ length: 35 });

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
            marginBottom: 18
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
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 6,
            marginBottom: 10
          }}
        >
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: 12,
                opacity: 0.7
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 6
          }}
        >
          {cells.map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                minHeight: 42
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
