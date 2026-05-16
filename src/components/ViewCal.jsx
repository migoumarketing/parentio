import { useState } from "react";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function ViewCal({
  S = {},
  L = {},
  month = 0,
  year = new Date().getFullYear(),
  setMonth = () => {},
  setYear = () => {},
  MOIS = [],
  cells = [],
  getCellData = () => null,
  colorA = "#6366f1",
  colorB = "#ec4899",
  events = {},
  notes = {},
  pA = "Parent A",
  pB = "Parent B",
  heureA = "18:00",
  heureB = "18:00",
  showFeries = true,
  setSelDay = () => {},
  setModal = () => {},
  setNewNote = () => {},
  Btn
}) {
  const [selectedDay, setSelectedDay] = useState(null);

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function selectDay(day) {
    setSelectedDay(day);
    setSelDay(day);
  }

  const selectedKey = selectedDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;

  const selectedData = selectedDay ? getCellData(selectedDay) : null;
  const selectedEvents = selectedKey ? events[selectedKey] || [] : [];
  const selectedNote = selectedKey ? notes[selectedKey] || "" : "";

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

      <div
        style={{
          background: "#111827",
          borderRadius: 18,
          padding: 18,
          color: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
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
            onClick={previousMonth}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            ‹
          </button>

          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {MOIS[month] || "Calendrier"} {year}
          </div>

          <button
            onClick={nextMonth}
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
          {cells.map((day, i) => {
            const data = day ? getCellData(day) : null;
            const bg = data?.isA ? colorA : colorB;
            const isSelected = selectedDay === day;

            return (
              <div
                key={i}
                onClick={() => day && selectDay(day)}
                style={{
                  minHeight: 48,
                  borderRadius: 12,
                  background: day ? bg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  opacity: day ? 0.9 : 0,
                  color: "#fff",
                  cursor: day ? "pointer" : "default",
                  border: isSelected ? "3px solid white" : "2px solid transparent",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.15s ease",
                  position: "relative"
                }}
              >
                {day || ""}

                {data?.v && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 4,
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "#f59e0b"
                    }}
                  />
                )}

                {data?.special && showFeries && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: data.special.color || "#fff"
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
                {selectedDay && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              background: "rgba(255,255,255,0.08)"
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              {selectedDay} {MOIS[month]} {year}
            </div>

            <div style={{ marginBottom: 10 }}>
              Garde :{" "}
              <strong style={{ color: selectedData?.isA ? colorA : colorB }}>
                {selectedData?.par || (selectedData?.isA ? pA : pB)}
              </strong>{" "}
              · {selectedData?.isA ? heureA : heureB}
            </div>

            {selectedData?.v && (
              <div style={{ marginBottom: 10, color: "#f59e0b", fontWeight: 700 }}>
                🌴 Vacances : {selectedData.v.nom}
              </div>
            )}

            {selectedData?.special && showFeries && (
              <div
                style={{
                  marginBottom: 10,
                  color: selectedData.special.color || "#fff",
                  fontWeight: 700
                }}
              >
                {selectedData.special.label}
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: "rgba(255,255,255,0.07)"
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>📝 Note</div>
              <div style={{ opacity: selectedNote ? 1 : 0.65, fontSize: 13 }}>
                {selectedNote || "Aucune note pour ce jour."}
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}
            >
              {selectedEvents.length === 0 ? (
                <div style={{ opacity: 0.65, fontSize: 13 }}>
                  Aucun événement pour ce jour.
                </div>
              ) : (
                selectedEvents.map((e, i) => (
                  <div
                    key={e.id || i}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.08)"
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>
                      {e.titre || e.title || "Événement"}
                    </div>

                    <div style={{ opacity: 0.7, fontSize: 12 }}>
                      {e.heure || e.time || ""}
                    </div>
                  </div>
                ))
              )}
            </div>

            {Btn && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 14,
                  flexWrap: "wrap"
                }}
              >
                <Btn color={colorA} size="lg" onClick={() => setModal("event")}>
                  {L.add || "+ Événement"}
                </Btn>

                <Btn
                  color="#10b981"
                  size="lg"
                  onClick={() => {
                    setNewNote(selectedNote || "");
                    setModal("note");
                  }}
                >
                  {L.note || "📝 Note"}
                </Btn>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
