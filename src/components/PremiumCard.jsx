import { pv1 } from "../i18n/parentioI18nV1";

export default function PremiumCard({
  premium = false,
  setPremium = () => {},
  PLAN = { features: [] },
  lang = "fr",
  stripeLoading = false,
  stripeError = null,
  onSubscribe = null,
  user = null
}) {
  const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || "";

  const text = {
    fr: { login: "Vous devez être connecté pour activer Premium.", missingPrice: "Variable Vercel manquante : VITE_STRIPE_PRICE_ID", loading: "Redirection vers Stripe..." },
    es: { login: "Debe iniciar sesión para activar Premium.", missingPrice: "Falta la variable de Vercel: VITE_STRIPE_PRICE_ID", loading: "Redirección a Stripe..." },
    en: { login: "You must be signed in to activate Premium.", missingPrice: "Missing Vercel variable: VITE_STRIPE_PRICE_ID", loading: "Redirecting to Stripe..." },
    it: { login: "Devi accedere per attivare Premium.", missingPrice: "Variabile Vercel mancante: VITE_STRIPE_PRICE_ID", loading: "Reindirizzamento a Stripe..." },
    sv: { login: "Du måste vara inloggad för att aktivera Premium.", missingPrice: "Saknad Vercel-variabel: VITE_STRIPE_PRICE_ID", loading: "Omdirigerar till Stripe..." },
    de: { login: "Sie müssen angemeldet sein, um Premium zu aktivieren.", missingPrice: "Fehlende Vercel-Variable: VITE_STRIPE_PRICE_ID", loading: "Weiterleitung zu Stripe..." },
    pt: { login: "Tem de iniciar sessão para ativar Premium.", missingPrice: "Variável Vercel em falta: VITE_STRIPE_PRICE_ID", loading: "A redirecionar para Stripe..." }
  }[lang] || { login: "You must be signed in to activate Premium.", missingPrice: "Missing Vercel variable: VITE_STRIPE_PRICE_ID", loading: "Redirecting to Stripe..." };

  const handleClick = async () => {
    if (stripeLoading) return;
    if (!user?.id || !user?.email) { alert(text.login); return; }
    if (!priceId) { alert(text.missingPrice); return; }
    if (typeof onSubscribe === "function") { await onSubscribe(priceId); return; }
    alert("Stripe n'est pas connecté à ce bouton.");
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
      {stripeError && <div style={{ color: "#fecaca", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{stripeError}</div>}
      {!user?.id && <div style={{ color: "#fde68a", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{text.login}</div>}
      {!priceId && <div style={{ color: "#fecaca", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{text.missingPrice}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
        {(PLAN.features || []).map((feature, index) => <div key={index}>✓ {feature}</div>)}
      </div>
      <button type="button" onClick={handleClick} disabled={stripeLoading || !user?.id || !priceId} style={{ width: "100%", border: "none", borderRadius: 12, padding: "13px 14px", background: "#fff", color: "#4f46e5", fontWeight: 900, fontSize: 14, cursor: stripeLoading || !user?.id || !priceId ? "not-allowed" : "pointer", opacity: stripeLoading || !user?.id || !priceId ? 0.65 : 1 }}>
        {stripeLoading ? text.loading : pv1(lang, "activatePremium")}
      </button>
    </div>
  );
}
