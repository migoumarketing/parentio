export default function ConsentScreen({ onAccept }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07071a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 20,
          padding: 24,
          textAlign: "center"
        }}
      >
        <h1 style={{ marginBottom: 10 }}>Parentio</h1>

        <p style={{ opacity: 0.75, lineHeight: 1.5 }}>
          Outil d’organisation pour parents séparés.
          Aucune valeur juridique.
        </p>

        <button
          onClick={() => onAccept("fr")}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "14px 18px",
            borderRadius: 12,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          J’accepte et j’accède à l’application
        </button>
      </div>
    </div>
  );
}
