import { pv1 } from "../i18n/parentioI18nV1";

export default function PremiumCard({
  premium = false,
  setPremium = () => {},
  PLAN = { features: [] },
  lang = "fr",
  stripeLoading = false,
  stripeError = null,
  onSubscribe = null
}) {
  const handleClick = () => {
    if (typeof onSubscribe === "function") {
      onSubscribe();
      return;
    }
    setPremium(true);
  };

  if (premium) {
    return (
      <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 700, lineHeight: 1.6, boxShadow: "0 8px 30px rgba(16,185,129,0.25)" }}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>👑 {pv1(lang, "premiumActive")}</div>
        <div>{pv1(lang, "premium")}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", boxShadow: "0 8px 30px rgba(99,102,241,0.25)" }}>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>🚀 {pv1(lang, "goPremium")}</div>

      {stripeError && (
        <div style={{ color: "#fecaca", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {stripeError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
        {(PLAN.features || []).map((feature, index) => <div key={index}>✓ {feature}</div>)}
      </div>

      <button
        onClick={handleClick}
        disabled={stripeLoading}
        style={{ width: "100%", border: "none", borderRadius: 12, padding: "13px 14px", background: "#fff", color: "#4f46e5", fontWeight: 900, fontSize: 14, cursor: stripeLoading ? "not-allowed" : "pointer", opacity: stripeLoading ? 0.7 : 1 }}
      >
        {stripeLoading ? "..." : pv1(lang, "activatePremium")}
      </button>
    </div>
  );
}
