import { useState } from "react";
import CustodyConfigCard from "./CustodyConfigCard";
import ChecklistCard from "./ChecklistCard";
import ContactsCard from "./ContactsCard";
import UpcomingVacationsCard from "./UpcomingVacationsCard";
import SpecialDaysCard from "./SpecialDaysCard";

const FALLBACK_DAYS = {
  fr: ["L", "M", "M", "J", "V", "S", "D"],
  es: ["L", "M", "M", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
  sv: ["M", "T", "O", "T", "F", "L", "S"],
  de: ["M", "D", "M", "D", "F", "S", "S"],
  it: ["L", "M", "M", "G", "V", "S", "D"]
};

const TEXT = {
  fr: {
    courtTitle: "🤖 Lecture de jugement",
    courtSub: "Copiez-collez le texte du jugement pour préconfigurer le calendrier. Analyse indicative uniquement.",
    courtPlaceholder: "Collez ici le texte du jugement...",
    analyze: "Analyser",
    configured: "Calendrier configuré",
    verify: "Vérifiez toujours avec votre jugement.",
    noNote: "Aucune note pour ce jour.",
    noEvent: "Aucun événement pour ce jour.",
    holidays: "Vacances"
  },
  es: {
    courtTitle: "🤖 Lectura de resolución",
    courtSub: "Copie y pegue el texto de la resolución para preconfigurar el calendario. Análisis orientativo.",
    courtPlaceholder: "Pegue aquí el texto de la resolución...",
    analyze: "Analizar",
    configured: "Calendario configurado",
    verify: "Verifique siempre con su resolución.",
    noNote: "Ninguna nota para este día.",
    noEvent: "Ningún evento para este día.",
    holidays: "Vacaciones"
  },
  en: {
    courtTitle: "🤖 Court order reading",
    courtSub: "Paste the court order text to preconfigure the calendar. Indicative analysis only.",
    courtPlaceholder: "Paste the court order text here...",
    analyze: "Analyse",
    configured: "Calendar configured",
    verify: "Always verify against your court order.",
    noNote: "No note for this day.",
    noEvent: "No event for this day.",
    holidays: "Holidays"
  }
};

export default function ViewCal({
  S = {},
  L = {},
  T = {},
  lang = "fr",
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
  setPa = () => {},
  setPb = () => {},
  heureA = "18:00",
  heureB = "18:00",
  setHeureA = () => {},
  setHeureB = () => {},
  mode = "alternee",
  setMode = () => {},
  paireA = true,
  setPaireA = () => {},
  semPaireA = true,
  setSemPaireA = () => {},
  annePaireA = true,
  setAnnePaireA = () => {},
  joursA = [],
  setJoursA = () => {},
  getWN = () => 1,
  pays = "france",
  setPays = () => {},
  zone = "B",
  setZone = () => {},
  PAYS_LIST = [],
  VACANCES_PAR_PAYS = {},
  zonesDisponibles = [],
  zoneLabels = {},
  anneeSco = new Date().getFullYear(),
  getPaques = () => new Date(),
  vacAlt = true,
  setVacAlt = () => {},
  showFeries = true,
  setShowFeries = () => {},
  setSelDay = () => {},
  setModal = () => {},
  setNewNote = () => {},
  checklist = {},
  setChecklist = () => {},
  contacts = [],
  setContacts = () => {},
  rgbA = "99,102,241",
  vac = {},
  today = new Date(),
  prochSpec = [],
  fm = new Date(),
  fp = new Date(),
  sd = () => false,
  getParent = () => pA,
  cfg = {},
  jugText = "",
  setJugText = () => {},
  analyzeJugement = () => {},
  aiResult = null,
  classicStartDay = "friday",
  setClassicStartDay = () => {},
  classicEndDay = "sunday",
  setClassicEndDay = () => {},
  classicVacationMode = "split",
  setClassicVacationMode = () => {},
  classicVacationPart = "first",
  setClassicVacationPart = () => {},
  classicPrimaryParent = "A",
  setClassicPrimaryParent = () => {},
  classicPickupHour = "18:00",
  setClassicPickupHour = () => {},
  classicReturnHour = "18:00",
  setClassicReturnHour = () => {},
  Pill,
  Tog,
  Btn,
  premium = false,
  setPremium = () => {}
}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const currentLang = ["fr", "en", "es", "sv", "de", "it"].includes(lang) ? lang : "fr";
  const TXT = TEXT[currentLang] || TEXT.en || TEXT.fr;
  const DAYS = FALLBACK_DAYS[currentLang];

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
    if (!day) return;
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
      <div style={S.disc || { marginBottom: 14, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 12 }}>
        {L.disc || "⚠️ Organisation tool only — no legal value"}
      </div>

      <CustodyConfigCard
        S={S}
        L={L}
        T={T}
        lang={lang}
        pA={pA}
        pB={pB}
        setPa={setPa}
        setPb={setPb}
        heureA={heureA}
        heureB={heureB}
        setHeureA={setHeureA}
        setHeureB={setHeureB}
        mode={mode}
        setMode={setMode}
        paireA={paireA}
        setPaireA={setPaireA}
        semPaireA={semPaireA}
        setSemPaireA={setSemPaireA}
        annePaireA={annePaireA}
        setAnnePaireA={setAnnePaireA}
        joursA={joursA}
        setJoursA={setJoursA}
        colorA={colorA}
        colorB={colorB}
        getWN={getWN}
        year={year}
        pays={pays}
        setPays={setPays}
        zone={zone}
        setZone={setZone}
        PAYS_LIST={PAYS_LIST}
        VACANCES_PAR_PAYS={VACANCES_PAR_PAYS}
        zonesDisponibles={zonesDisponibles}
        zoneLabels={zoneLabels}
        anneeSco={anneeSco}
        getPaques={getPaques}
        vacAlt={vacAlt}
        setVacAlt={setVacAlt}
        showFeries={showFeries}
        setShowFeries={setShowFeries}
        classicStartDay={classicStartDay}
        setClassicStartDay={setClassicStartDay}
        classicEndDay={classicEndDay}
        setClassicEndDay={setClassicEndDay}
        classicVacationMode={classicVacationMode}
        setClassicVacationMode={setClassicVacationMode}
        classicVacationPart={classicVacationPart}
        setClassicVacationPart={setClassicVacationPart}
        classicPrimaryParent={classicPrimaryParent}
        setClassicPrimaryParent={setClassicPrimaryParent}
        classicPickupHour={classicPickupHour}
        setClassicPickupHour={setClassicPickupHour}
        classicReturnHour={classicReturnHour}
        setClassicReturnHour={setClassicReturnHour}
        Pill={Pill}
        Tog={Tog}
      />

      <div style={S.card}>
        <div style={S.sec}>{TXT.courtTitle}</div>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 8, lineHeight: 1.5 }}>
          {TXT.courtSub}
        </div>
        <textarea
          style={{ ...S.inp, height: 90, resize: "none", lineHeight: 1.5, marginBottom: 8 }}
          value={jugText}
          onChange={(e) => setJugText(e.target.value)}
          placeholder={TXT.courtPlaceholder}
        />
        {Btn ? (
          <Btn color="#8b5cf6" onClick={analyzeJugement} disabled={!jugText.trim()}>
            {TXT.analyze}
          </Btn>
        ) : (
          <button onClick={analyzeJugement} disabled={!jugText.trim()}>{TXT.analyze}</button>
        )}
        {aiResult && (
          <div style={{ background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: T.text, marginTop: 8 }}>
            <div style={{ fontWeight: 800, marginBottom: 3 }}>✅ {TXT.configured}</div>
            <div>{aiResult.notes}</div>
            <div style={{ marginTop: 4, fontSize: 11, opacity: 0.7 }}>⚠️ {TXT.verify}</div>
          </div>
        )}
      </div>

      <div style={S.card || { background: "#111827", borderRadius: 18, padding: 18, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          {Btn ? <Btn onClick={previousMonth} color="#6366f1" size="lg">‹</Btn> : <button onClick={previousMonth}>‹</button>}
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {MOIS[month] || "Calendar"} {year}
          </div>
          {Btn ? <Btn onClick={nextMonth} color="#6366f1" size="lg">›</Btn> : <button onClick={nextMonth}>›</button>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 10 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontWeight: 700, opacity: 0.7, fontSize: 12 }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {cells.map((day, i) => {
            const data = day ? getCellData(day) : null;
            const bg = data?.isA ? colorA : colorB;
            const isSelected = selectedDay === day;

            return (
              <div
                key={i}
                onClick={() => selectDay(day)}
                style={{
                  minHeight: 48,
                  borderRadius: 12,
                  background: day ? bg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  opacity: day ? 0.95 : 0,
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
                  <span style={{ position: "absolute", bottom: 4, width: 6, height: 6, borderRadius: 999, background: "#f59e0b" }} />
                )}

                {data?.special && showFeries && (
                  <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: 999, background: data.special.color || "#fff" }} />
                )}
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div style={S.panel || { marginTop: 18, padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>
              {selectedDay} {MOIS[month]} {year}
            </div>

            <div style={{ marginBottom: 10 }}>
              {L.garde || "Custody"} :{" "}
              <strong style={{ color: selectedData?.isA ? colorA : colorB }}>
                {selectedData?.par || (selectedData?.isA ? pA : pB)}
              </strong>{" "}
              · {selectedData?.isA ? heureA : heureB}
            </div>

            {selectedData?.v && (
              <div style={{ marginBottom: 10, color: "#f59e0b", fontWeight: 700 }}>
                🌴 {TXT.holidays} : {selectedData.v.nom}
              </div>
            )}

            {selectedData?.special && showFeries && (
              <div style={{ marginBottom: 10, color: selectedData.special.color || "#fff", fontWeight: 700 }}>
                {selectedData.special.label}
              </div>
            )}

            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.07)" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{L.note || "📝 Note"}</div>
              <div style={{ opacity: selectedNote ? 1 : 0.65, fontSize: 13 }}>
                {selectedNote || TXT.noNote}
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedEvents.length === 0 ? (
                <div style={{ opacity: 0.65, fontSize: 13 }}>{TXT.noEvent}</div>
              ) : (
                selectedEvents.map((e, i) => (
                  <div key={e.id || i} style={{ padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ fontWeight: 700 }}>{e.titre || e.title || "Event"}</div>
                    <div style={{ opacity: 0.7, fontSize: 12 }}>{e.heure || e.time || ""}</div>
                  </div>
                ))
              )}
            </div>

            {Btn && (
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <Btn color={colorA} size="lg" onClick={() => setModal("event")}>
                  {L.add || "+ Event"}
                </Btn>
                <Btn color="#10b981" size="lg" onClick={() => {
                  setNewNote(selectedNote || "");
                  setModal("note");
                }}>
                  {L.note || "📝 Note"}
                </Btn>
              </div>
            )}
          </div>
        )}
      </div>

      <UpcomingVacationsCard S={S} L={L} T={T} vac={vac} zone={zone} today={today} vacAlt={vacAlt} pA={pA} pB={pB} colorA={colorA} colorB={colorB} anneeSco={anneeSco} />

      <SpecialDaysCard S={S} L={L} T={T} showFeries={showFeries} prochSpec={prochSpec} fm={fm} fp={fp} sd={sd} getParent={getParent} cfg={cfg} vac={vac} pA={pA} colorA={colorA} colorB={colorB} />

      <ChecklistCard S={S} L={L} T={T} checklist={checklist} setChecklist={setChecklist} colorA={colorA} rgbA={rgbA} />

      <ContactsCard S={S} L={L} T={T} contacts={contacts} setContacts={setContacts} />
    </>
  );
}
