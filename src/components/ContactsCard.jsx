import Btn from "./Btn";

const TXT = {
  fr: {
    title: "Contacts d’urgence",
    name: "Nom",
    phone: "Tél",
    add: "+ Contact",
    remove: "Supprimer"
  },
  es: {
    title: "Contactos de emergencia",
    name: "Nombre",
    phone: "Teléfono",
    add: "+ Contacto",
    remove: "Eliminar"
  },
  en: {
    title: "Emergency contacts",
    name: "Name",
    phone: "Phone",
    add: "+ Contact",
    remove: "Delete"
  }
};

export default function ContactsCard({
  S = {},
  L = {},
  T = {},
  contacts = [],
  setContacts = () => {},
  lang = "fr"
}) {
  const currentLang =
    lang ||
    (L?.tabs?.[0] === "Calendar"
      ? "en"
      : L?.tabs?.[0] === "Calendario"
      ? "es"
      : "fr");

  const t = TXT[currentLang] || TXT.fr;

  function updateContact(index, field, value) {
    setContacts((previous) =>
      previous.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function removeContact(index) {
    setContacts((previous) => {
      const next = previous.filter((_, currentIndex) => currentIndex !== index);
      return next.length ? next : [{ nom: "", tel: "" }];
    });
  }

  function addContact() {
    setContacts((previous) => [...previous, { nom: "", tel: "" }]);
  }

  return (
    <div style={S.card}>
      <div style={S.sec}>🚨 {t.title}</div>

      {(contacts || []).map((contact, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 8
          }}
        >
          <input
            style={{ ...S.inp, flex: 1 }}
            placeholder={t.name}
            value={contact.nom || ""}
            onChange={(event) =>
              updateContact(index, "nom", event.target.value)
            }
          />

          <input
            style={{ ...S.inp, flex: 1 }}
            placeholder={t.phone}
            value={contact.tel || ""}
            onChange={(event) =>
              updateContact(index, "tel", event.target.value)
            }
          />

          <button
            type="button"
            onClick={() => removeContact(index)}
            title={t.remove}
            style={{
              background: "none",
              border: "none",
              color: T.sub,
              cursor: "pointer",
              fontSize: 18
            }}
          >
            ×
          </button>
        </div>
      ))}

      <Btn color="#10b981" size="sm" onClick={addContact}>
        {t.add}
      </Btn>
    </div>
  );
}
