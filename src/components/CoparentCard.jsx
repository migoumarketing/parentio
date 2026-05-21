import { useState } from "react";

export default function CoparentCard({
  S = {},
  T = {},
  user,
  coparents = [],
  loadingCoparents = false,
  coparentError = null,
  sendInvitation = async () => false,
  acceptInvitation = async () => false,
  refuseInvitation = async () => false,
  removeInvitation = async () => false,
  lang = "fr"
}) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const [sending, setSending] = useState(false);

  const text = {
    fr: {
      title: "Partage co-parent",
      sub: "Invitez l’autre parent avec des droits limités. Parentio reste un outil d’organisation, pas de surveillance.",
      email: "Email du co-parent",
      permission: "Permission",
      read: "Lecture seule",
      write: "Lecture + modification",
      invite: "Envoyer l’invitation",
      pending: "En attente",
      accepted: "Accepté",
      refused: "Refusé",
      accept: "Accepter",
      refuse: "Refuser",
      remove: "Supprimer",
      empty: "Aucun co-parent invité.",
      login: "Connectez-vous pour inviter un co-parent."
    },
    en: {
      title: "Co-parent sharing",
      sub: "Invite the other parent with limited permissions. Parentio is an organisation tool, not a monitoring tool.",
      email: "Co-parent email",
      permission: "Permission",
      read: "Read only",
      write: "Read + edit",
      invite: "Send invitation",
      pending: "Pending",
      accepted: "Accepted",
      refused: "Refused",
      accept: "Accept",
      refuse: "Refuse",
      remove: "Remove",
      empty: "No co-parent invited.",
      login: "Sign in to invite a co-parent."
    },
    es: {
      title: "Compartir con co-progenitor",
      sub: "Invite al otro progenitor con permisos limitados. Parentio es una herramienta de organización, no de vigilancia.",
      email: "Email del co-progenitor",
      permission: "Permiso",
      read: "Solo lectura",
      write: "Lectura + modificación",
      invite: "Enviar invitación",
      pending: "Pendiente",
      accepted: "Aceptado",
      refused: "Rechazado",
      accept: "Aceptar",
      refuse: "Rechazar",
      remove: "Eliminar",
      empty: "Ningún co-progenitor invitado.",
      login: "Inicie sesión para invitar a un co-progenitor."
    }
  }[lang] || {
    title: "Co-parent sharing",
    sub: "Invite the other parent with limited permissions.",
    email: "Co-parent email",
    permission: "Permission",
    read: "Read only",
    write: "Read + edit",
    invite: "Send invitation",
    pending: "Pending",
    accepted: "Accepted",
    refused: "Refused",
    accept: "Accept",
    refuse: "Refuse",
    remove: "Remove",
    empty: "No co-parent invited.",
    login: "Sign in to invite a co-parent."
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  const input = S.inp || {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff"
  };

  const label = S.inpLbl || {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5
  };

  async function submitInvitation() {
    if (!email.trim()) return;

    setSending(true);

    const ok = await sendInvitation(email, permission);

    if (ok) {
      setEmail("");
      setPermission("read");
    }

    setSending(false);
  }

  function statusLabel(status) {
    if (status === "accepted") return text.accepted;
    if (status === "refused") return text.refused;
    return text.pending;
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
        🤝 {text.title}
      </div>

      <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.5, marginBottom: 14 }}>
        {text.sub}
      </div>

      {!user?.id ? (
        <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13 }}>
          {text.login}
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={label}>{text.email}</div>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                style={input}
              />
            </div>

            <div>
              <div style={label}>{text.permission}</div>
              <select
                value={permission}
                onChange={(event) => setPermission(event.target.value)}
                style={input}
              >
                <option value="read">{text.read}</option>
                <option value="write">{text.write}</option>
              </select>
            </div>

            <button
              onClick={submitInvitation}
              disabled={sending || !email.trim()}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "12px 14px",
                background: "#6366f1",
                color: "#fff",
                fontWeight: 900,
                cursor: sending || !email.trim() ? "not-allowed" : "pointer",
                opacity: sending || !email.trim() ? 0.55 : 1
              }}
            >
              {text.invite}
            </button>
          </div>

          {coparentError && (
            <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
              {coparentError}
            </div>
          )}

          {loadingCoparents ? (
            <div style={{ fontSize: 12, opacity: 0.7 }}>Chargement...</div>
          ) : coparents.length === 0 ? (
            <div style={{ fontSize: 12, opacity: 0.7 }}>{text.empty}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {coparents.map((item) => {
                const incoming = item.coparent_email === user?.email?.toLowerCase();

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background: "rgba(128,128,128,0.08)",
                      border: "1px solid rgba(128,128,128,0.14)"
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 900 }}>
                      {incoming ? item.owner_email : item.coparent_email}
                    </div>

                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3 }}>
                      {statusLabel(item.status)} · {item.permission}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      {incoming && item.status === "pending" && (
                        <>
                          <button
                            onClick={() => acceptInvitation(item.id)}
                            style={{
                              border: "none",
                              borderRadius: 10,
                              padding: "8px 10px",
                              background: "#10b981",
                              color: "#fff",
                              fontWeight: 800,
                              cursor: "pointer"
                            }}
                          >
                            {text.accept}
                          </button>

                          <button
                            onClick={() => refuseInvitation(item.id)}
                            style={{
                              border: "none",
                              borderRadius: 10,
                              padding: "8px 10px",
                              background: "#f59e0b",
                              color: "#111827",
                              fontWeight: 800,
                              cursor: "pointer"
                            }}
                          >
                            {text.refuse}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => removeInvitation(item.id)}
                        style={{
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 10px",
                          background: "rgba(239,68,68,0.12)",
                          color: "#ef4444",
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        {text.remove}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
