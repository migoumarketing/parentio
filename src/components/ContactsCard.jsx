import Btn from "./Btn";

export default function ContactsCard({
  S,
  L,
  T,
  contacts,
  setContacts,
}) {
  return (
    <div style={S.card}>
      <div style={S.sec}>🚨 {L.contacts}</div>

      {contacts.map((c, i) => (
        <div
          key={i}
          style={{ display:"flex", gap:7, marginBottom:8 }}
        >
          <input
            style={{ ...S.inp, flex:1 }}
            placeholder="Nom"
            value={c.nom}
            onChange={e =>
              setContacts(p =>
                p.map((x, j) =>
                  j === i ? { ...x, nom:e.target.value } : x
                )
              )
            }
          />

          <input
            style={{ ...S.inp, flex:1 }}
            placeholder="Tél"
            value={c.tel}
            onChange={e =>
              setContacts(p =>
                p.map((x, j) =>
                  j === i ? { ...x, tel:e.target.value } : x
                )
              )
            }
          />

          <button
            onClick={() => setContacts(p => p.filter((_, j) => j !== i))}
            style={{
              background:"none",
              border:"none",
              color:T.sub,
              cursor:"pointer",
              fontSize:18
            }}
          >
            ×
          </button>
        </div>
      ))}

      <Btn
        color="#10b981"
        size="sm"
        onClick={() => setContacts(p => [...p, { nom:"", tel:"" }])}
      >
        + Contact
      </Btn>
    </div>
  );
}
