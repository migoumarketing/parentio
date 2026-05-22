export default function StripePremiumCard({
  S = {},
  T = {},
  premium = false,
  stripeLoading = false,
  stripeError = null,
  onSubscribe = () => {},
  lang = "fr"
}) {
  const text = {
    fr: {
      active: "Premium actif",
      activeSub: "Votre abonnement Premium est actif sur ce compte.",
      title: "Parentio Premium",
      sub: "Débloquez les exports, le partage avancé, les fonctionnalités cloud et les futurs outils IA.",
      button: "S’abonner avec Stripe",
      loading: "Redirection vers Stripe...",
      error: "Erreur Stripe"
    },
    en: {
      active: "Premium active",
      activeSub: "Your Premium subscription is active on this account.",
      title: "Parentio Premium",
      sub: "Unlock exports, advanced sharing, cloud features, and future AI tools.",
      button: "Subscribe with Stripe",
      loading: "Redirecting to Stripe...",
      error: "Stripe error"
    },
    es: {
      active: "Premium activo",
      activeSub: "Su suscripción Premium está activa en esta cuenta.",
      title: "Parentio Premium",
      sub: "Desbloquee exportaciones, uso compartido avanzado, funciones cloud y futuras herramientas IA.",
      button: "Suscribirse con Stripe",
      loading: "Redirigiendo a Stripe...",
      error: "Error Stripe"
    }
  }[lang] || {
    active: "Premium active",
    activeSub: "Your Premium subscription is active.",
    title: "Parentio Premium",
    sub: "Unlock advanced features.",
    button: "Subscribe with Stripe",
    loading: "Redirecting to Stripe...",
    error: "Stripe error"
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  if (premium) {
    return (
      <div style={card}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981", marginBottom: 8 }}>
          👑 {text.active}
        </div>

        <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
          {text.activeSub}
        </div>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
        💳 {text.title}
      </div>

      <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5, marginBottom: 14 }}>
        {text.sub}
      </div>

      {stripeError && (
        <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {text.error} : {stripeError}
        </div>
      )}

      <button
        onClick={onSubscribe}
        disabled={stripeLoading}
        style={{
          border: "none",
          borderRadius: 12,
          padding: "12px 14px",
          background: stripeLoading ? "rgba(148,163,184,0.45)" : "#635bff",
          color: "#fff",
          fontWeight: 900,
          cursor: stripeLoading ? "not-allowed" : "pointer",
          width: "100%"
        }}
      >
        {stripeLoading ? text.loading : text.button}
      </button>
    </div>
  );
}
