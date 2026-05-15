import CustodyConfigCard from "./CustodyConfigCard";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function ViewCal({
  S = {},
  L = {},
  month = 0,
  year = new Date().getFullYear(),
  MOIS = [],
  cells = []
}) {
  return (
    <>
      <div
        style={{
          marginBottom: 14,
          padding: 12,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontSize: 12
        }}
      >
        {L.disc || "⚠️ Outil d'organisation uniquement — aucune valeur juridique"}
      </div>

      <CustodyConfigCard />

      <div
        style={{
          background: "#111827",
          borderRadius: 18,
          padding: 18,
          color: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          marginTop: 16
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <button
            style={{
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            ‹
          </button>

          <div
            style={{
              fontSize: 20,
              fontWeight: 700
            }}
          >
            {MOIS[month] || "Calendrier"} {year}
          </div>

          <button
            style={{
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
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
          {DAYS.map((d, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                fontWeight: 700,
                opacity: 0.7,
                fontSize: 12
              }}
            >
              {d}
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
                minHeight: 48,
                borderRadius: 12,
                background: day
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
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
