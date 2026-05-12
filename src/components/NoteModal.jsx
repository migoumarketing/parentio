// src/components/NoteModal.jsx

import Btn from "./Btn";

export default function NoteModal({
  S,
  T,
  selDay,
  month,
  MOIS,
  newNote,
  setNewNote,
  saveNote,
  deleteNote,
  notes,
  dk,
  year,
  L,
  setModal,
}) {
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(null)}>
      <div style={S.mCard}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 5, color: T.text }}>
          📝 {selDay} {MOIS[month]}
        </div>

        <div style={{ fontSize: 12, color: T.sub, marginBottom: 10, fontWeight: 600 }}>
          🔒 Note privée — jamais visible par l'autre parent
        </div>

        <textarea
          style={{ ...S.inp, height: 120, resize: "none", lineHeight: 1.6 }}
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          placeholder="Remarque, rappel…"
          autoFocus
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Btn color="#10b981" size="lg" onClick={saveNote}>
            {L.enregistrer}
          </Btn>

          {!!notes[dk(year, month, selDay)] && (
            <Btn color="#ef4444" size="lg" danger onClick={deleteNote}>
              Supprimer
            </Btn>
          )}

          <Btn color="#6b7280" size="lg" onClick={() => setModal(null)}>
            {L.annuler}
          </Btn>
        </div>
      </div>
    </div>
  );
}
