export default function PremiumGate({
  premium = false,
  title = "Fonction Premium",
  message = "Cette fonctionnalité est réservée au plan Premium.",
  children
}) {
  if (premium) return children;

  return (
    <div style={{ padding: 16, borderRadius: 16, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "#f59e0b", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
      <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>🔒 {title}</div>
      <div>{message}</div>
    </div>
  );
}
