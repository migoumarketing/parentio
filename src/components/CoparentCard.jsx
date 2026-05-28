import { useState } from "react";

const TXT = {
  fr: {
    title: "Partage co-parent",
    sub: "Invitez l’autre parent et gérez les invitations reçues.",
    email: "Email du co-parent",
    permission: "Permission",
    read: "Lecture seule",
    write: "Lecture + modification",
    invite: "Envoyer l’invitation",
    pending: "En attente",
    accepted: "Acceptée",
    refused: "Refusée",
    accept: "Accepter",
    refuse: "Refuser",
    remove: "Supprimer",
    sentByMe: "Invitation envoyée",
    received: "Invitation reçue",
    empty: "Aucune invitation.",
    login: "Connectez-vous pour utiliser le partage co-parent."
  },
  es: {
    title: "Compartir con co-progenitor",
    sub: "Invite al otro progenitor y gestione las invitaciones recibidas.",
    email: "Email del co-progenitor",
    permission: "Permiso",
    read: "Solo lectura",
    write: "Lectura + modificación",
    invite: "Enviar invitación",
    pending: "Pendiente",
    accepted: "Aceptada",
    refused: "Rechazada",
    accept: "Aceptar",
    refuse: "Rechazar",
    remove: "Eliminar",
    sentByMe: "Invitación enviada",
    received: "Invitación recibida",
    empty: "Ninguna invitación.",
    login: "Inicie sesión para usar el intercambio co-parental."
  },
  en: {
    title: "Co-parent sharing",
    sub: "Invite the other parent and manage received invitations.",
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
    sentByMe: "Invitation sent",
    received: "Invitation received",
    empty: "No invitation.",
    login: "Sign in to use co-parent sharing."
  }
};

export default function CoparentCard({
  S = {},
  T = {},
  lang = "fr",
  user = null,
  coparents = [],
  loadingCoparents = false,
  coparentError = null,
  sendInvitation = async () => false,
  acceptInvitation = async () => false,
  refuseInvitation = async () => false,
  removeInvitation = async () => false
}) {
  const t = TXT[lang] || TXT.fr;
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const [sending, setSending] = useState(false);

  const currentEmail = user?.email?.toLowerCase() || "";

  async function handleInvite() {
    if (!email.trim()) return;

    setSending(true);
    await sendInvitation(email.trim().toLowerCase(), permission);
    setEmail("");
    setSending(false);
  }

  function statusLabel(status) {
    if (status === "accepted") return t.accepted;
    if (status === "refused") return t.refused;
    return t.pending;
  }

  if (!user?.email) {
    return (
      <div style={S.card}>
        <div style={S.sec}>👥 {t.title}</div>
        <p style={{ color: T.sub, fontSize: 13 }}>{t.login}</p>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <div style={S.sec}>👥 {t.title}</div>

      <p style={{ color: T.sub, fontSize: 12, lineHeight: 1.5 }}>
        {t.sub}
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.email}
          style={S.inp}
        />

        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          style={S.inp}
        >
          <option value="read">{t.read}</option>
          <option value="write">{t.write}</option>
        </select>

        <button
          type="button"
          onClick={handleInvite}
          disabled={sending || !email.trim()}
          style={{
            border: "none",
            borderRadius: 12,
            padding: "12px 14px",
            background: sending || !email.trim() ? "#9ca3af" : "#6366f1",
            color: "#fff",
            fontWeight: 900,
            cursor: sending || !email.trim() ? "not-allowed" : "pointer"
          }}
        >
          {sending ? "..." : t.invite}
        </button>
      </div>

      {coparentError && (
        <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginTop: 10 }}>
          {coparentError}
        </div>
      )}

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        {loadingCoparents && (
          <div style={{ color: T.sub, fontSize: 12 }}>...</div>
        )}

        {!loadingCoparents && coparents.length === 0 && (
          <div style={{ color: T.sub, fontSize: 12 }}>{t.empty}</div>
        )}

        {coparents.map((item) => {
          const isReceived =
            item.coparent_email?.toLowerCase() === currentEmail;

          const otherEmail = isReceived
            ? item.owner_email
            : item.coparent_email;

          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${T.border || "rgba(255,255,255,0.15)"}`,
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,255,255,0.04)"
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900 }}>
                {isReceived ? t.received : t.sentByMe}
              </div>

              <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>
                {otherEmail}
              </div>

              <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>
                {statusLabel(item.status)} · {item.permission}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {isReceived && item.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => acceptInvitation(item.id)}
                      style={{
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 10px",
                        background: "#10b981",
                        color: "#fff",
                        fontWeight: 900
                      }}
                    >
                      {t.accept}
                    </button>

                    <button
                      type="button"
                      onClick={() => refuseInvitation(item.id)}
                      style={{
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 10px",
                        background: "#ef4444",
                        color: "#fff",
                        fontWeight: 900
                      }}
                    >
                      {t.refuse}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => removeInvitation(item.id)}
                  style={{
                    border: "1px solid rgba(239,68,68,0.35)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                    fontWeight: 900
                  }}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
