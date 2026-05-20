export default function LockedFeature({
  title = "Fonction Premium",
  message = "Cette fonctionnalité est réservée au plan Premium.",
  buttonLabel = "Passer Premium",
  onUpgrade = () => {}
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.22)",
        color: "#f59e0b",
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.5
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>
        🔒 {title}
      </div>

      <div style={{ marginBottom: 12 }}>{message}</div>

      <button
        onClick={onUpgrade}
        style={{
          border: "none",
          borderRadius: 12,
          padding: "11px 14px",
          background: "#f59e0b",
          color: "#111827",
          fontWeight: 900,
          cursor: "pointer"
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
