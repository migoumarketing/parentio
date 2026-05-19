export default function PremiumCard({
  premium,
  setPremium,
  PLAN
}) {
  if (premium) {
    return (
      <div
        style={{
          padding: 18,
          borderRadius: 18,
          background: "linear-gradient(135deg,#10b981,#059669)",
          color: "#fff",
          fontWeight: 700,
          lineHeight: 1.6,
          boxShadow: "0 8px 30px rgba(16,185,129,0.25)"
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            marginBottom: 8
          }}
        >
          👑 Parentio Premium actif
        </div>

        <div>
          Toutes les fonctionnalités avancées sont débloquées.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
        color: "#fff",
        boxShadow: "0 8px 30px rgba(99,102,241,0.25)"
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 900,
          marginBottom: 10
        }}
      >
        🚀 Passer Premium
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.7,
          opacity: 0.95,
          marginBottom: 14
        }}
      >
        Débloquez :
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 18,
          fontSize: 13,
          fontWeight: 700
        }}
      >
        {PLAN.features.map((feature, index) => (
          <div key={index}>
            ✓ {feature}
          </div>
        ))}
      </div>

      <button
        onClick={() => setPremium(true)}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 12,
          padding: "13px 14px",
          background: "#fff",
          color: "#4f46e5",
          fontWeight: 900,
          fontSize: 14,
          cursor: "pointer"
        }}
      >
        Activer Premium
      </button>
    </div>
  );
}
