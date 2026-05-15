const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function ViewCal({
  S,
  L,
  month,
  year,
  MOIS,
  cells
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
          Prochain changement en cours de calcul
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
              border: "none"
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
            {MOIS[month]} {year}
          </div>

          <button
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none"
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
          {DAYS.map((day, index) => (
            <div
              key={index}
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
          {cells.map((day, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 12,
                background: day
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                minHeight: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                opacity: day ? 1 : 0
              }}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
