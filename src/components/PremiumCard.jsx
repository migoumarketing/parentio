export default function PremiumCard({
  premium = false,
  setPremium = () => {},
  PLAN = { features: [] },
  lang = "fr"
}) {
  const text = {
    fr: {
      active: "Parentio Premium actif",
      activeSub: "Toutes les fonctionnalités avancées sont débloquées.",
      title: "Passer Premium",
      unlock: "Débloquez :",
      button: "Activer Premium"
    },
    es: {
      active: "Parentio Premium activo",
      activeSub: "Todas las funciones avanzadas están desbloqueadas.",
      title: "Pasar a Premium",
      unlock: "Desbloquee:",
      button: "Activar Premium"
    },
    en: {
      active: "Parentio Premium active",
      activeSub: "All advanced features are unlocked.",
      title: "Go Premium",
      unlock: "Unlock:",
      button: "Activate Premium"
    },
    it: {
      active: "Parentio Premium attivo",
      activeSub: "Tutte le funzioni avanzate sono sbloccate.",
      title: "Passa a Premium",
      unlock: "Sblocca:",
      button: "Attiva Premium"
    },
    sv: {
      active: "Parentio Premium aktivt",
      activeSub: "Alla avancerade funktioner är upplåsta.",
      title: "Gå Premium",
      unlock: "Lås upp:",
      button: "Aktivera Premium"
    },
    de: {
      active: "Parentio Premium aktiv",
      activeSub: "Alle erweiterten Funktionen sind freigeschaltet.",
      title: "Premium aktivieren",
      unlock: "Freischalten:",
      button: "Premium aktivieren"
    }
  }[lang] || {
    active: "Parentio Premium active",
    activeSub: "All advanced features are unlocked.",
    title: "Go Premium",
    unlock: "Unlock:",
    button: "Activate Premium"
  };

  if (premium) {
    return (
      <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 700, lineHeight: 1.6, boxShadow: "0 8px 30px rgba(16,185,129,0.25)" }}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>👑 {text.active}</div>
        <div>{text.activeSub}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 18, borderRadius: 18, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", boxShadow: "0 8px 30px rgba(99,102,241,0.25)" }}>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>🚀 {text.title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.95, marginBottom: 14 }}>{text.unlock}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
        {(PLAN.features || []).map((feature, index) => <div key={index}>✓ {feature}</div>)}
      </div>
      <button onClick={() => setPremium(true)} style={{ width: "100%", border: "none", borderRadius: 12, padding: "13px 14px", background: "#fff", color: "#4f46e5", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>{text.button}</button>
    </div>
  );
}
