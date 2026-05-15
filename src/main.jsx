import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur React :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#07071a",
            color: "#fff",
            padding: 24,
            fontFamily: "Arial, sans-serif"
          }}
        >
          <h1>Erreur Parentio</h1>
          <p>React a cassé pendant l’affichage.</p>

          <pre
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: 16,
              borderRadius: 12,
              whiteSpace: "pre-wrap",
              color: "#fca5a5"
            }}
          >
            {String(this.state.error)}
          </pre>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 10,
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontWeight: 800
            }}
          >
            Réinitialiser l’app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
