import { tr } from "../i18n/translationsV1";

export default function StripePremiumCard({ S = {}, premium = false, stripeLoading = false, stripeError = null, onSubscribe = () => {}, lang = "fr" }) {
  const card = S.card || { padding: 16, borderRadius: 18, background: "rgba(255,255,255,0.06)", color: "#fff" };

  if (premium) {
    return (
      <div style={card}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981", marginBottom: 8 }}>👑 {tr(lang, "premium.active")}</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>{tr(lang, "premium.title")}</div>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>💳 {tr(lang, "premium.title")}</div>
      <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 14 }}>{tr(lang, "premium.locked")}</div>
      {stripeError && <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{stripeError}</div>}
      <button onClick={onSubscribe} disabled={stripeLoading} style={{ border: "none", borderRadius: 12, padding: "12px 14px", background: stripeLoading ? "rgba(148,163,184,0.45)" : "#635bff", color: "#fff", fontWeight: 900, cursor: stripeLoading ? "not-allowed" : "pointer", width: "100%" }}>
        {stripeLoading ? tr(lang, "premium.stripeRedirect") : tr(lang, "premium.subscribe")}
      </button>
    </div>
  );
}
