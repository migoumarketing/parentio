import { useState } from "react";
import { pv1 } from "../i18n/parentioI18nV1";

export default function PremiumCard({
  premium = false,
  setPremium = () => {},
  PLAN = { features: [] },
  lang = "fr",
  user = null
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || "";

  const text = {
    fr: {
      loading: "Redirection vers Stripe...",
      login: "Vous devez être connecté pour activer Premium.",
      missingPrice: "Variable Vercel manquante : VITE_STRIPE_PRICE_ID",
      failed: "Stripe n'a pas pu ouvrir la page de paiement."
    },
    es: {
      loading: "Redirección a Stripe...",
      login: "Debe iniciar sesión para activar Premium.",
      missingPrice: "Falta la variable de Vercel: VITE_STRIPE_PRICE_ID",
      failed: "Stripe no pudo abrir la página de pago."
    },
    en: {
      loading: "Redirecting to Stripe...",
      login: "You must be signed in to activate Premium.",
      missingPrice: "Missing Vercel variable: VITE_STRIPE_PRICE_ID",
      failed: "Stripe could not open the checkout page."
    },
    it: {
      loading: "Reindirizzamento a Stripe...",
      login: "Devi accedere per attivare Premium.",
      missingPrice: "Variabile Vercel mancante: VITE_STRIPE_PRICE_ID",
      failed: "Stripe non ha potuto aprire la pagina di pagamento."
    },
    sv: {
      loading: "Omdirigerar till Stripe...",
      login: "Du måste vara inloggad för att aktivera Premium.",
      missingPrice: "Saknad Vercel-variabel: VITE_STRIPE_PRICE_ID",
      failed: "Stripe kunde inte öppna betalningssidan."
    },
    de: {
      loading: "Weiterleitung zu Stripe...",
      login: "Sie müssen angemeldet sein, um Premium zu aktivieren.",
      missingPrice: "Fehlende Vercel-Variable: VITE_STRIPE_PRICE_ID",
      failed: "Stripe konnte die Zahlungsseite nicht öffnen."
    },
    pt: {
      loading: "A redirecionar para Stripe...",
      login: "Tem de iniciar sessão para ativar Premium.",
      missingPrice: "Variável Vercel em falta: VITE_STRIPE_PRICE_ID",
      failed: "Stripe não conseguiu abrir a página de pagamento."
    }
  }[lang] || {
    loading: "Redirecting to Stripe...",
    login: "You must be signed in to activate Premium.",
    missingPrice: "Missing Vercel variable: VITE_STRIPE_PRICE_ID",
    failed: "Stripe could not open the checkout page."
  };

  async function startStripeCheckout() {
    setError("");

    if (!user?.id || !user?.email) {
      setError(text.login);
      alert(text.login);
      return;
    }

    if (!priceId) {
      setError(text.missingPrice);
      alert(text.missingPrice);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          priceId,
          successUrl: `${window.location.origin}/?stripe=success`,
          cancelUrl: `${window.location.origin}/?stripe=cancel`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || text.failed);
      }

      if (!data?.url) {
        throw new Error(text.failed);
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      const message = err?.message || text.failed;
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

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

      {error && (
        <div style={{ color: "#fecaca", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {error}
        </div>
      )}

      {!user?.id && (
        <div style={{ color: "#fde68a", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {text.login}
        </div>
      )}

      {!priceId && (
        <div style={{ color: "#fecaca", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {text.missingPrice}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
        {(PLAN.features || []).map((feature, index) => <div key={index}>✓ {feature}</div>)}
      </div>

      <button
        type="button"
        onClick={startStripeCheckout}
        disabled={loading || !user?.id || !priceId}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 12,
          padding: "13px 14px",
          background: "#fff",
          color: "#4f46e5",
          fontWeight: 900,
          fontSize: 14,
          cursor: loading || !user?.id || !priceId ? "not-allowed" : "pointer",
          opacity: loading || !user?.id || !priceId ? 0.65 : 1
        }}
      >
        {loading ? text.loading : pv1(lang, "activatePremium")}
      </button>
    </div>
  );
}
