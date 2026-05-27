import { useState } from "react";

const TEXTS = {
  fr: {
    title: "Parentio",
    text: "Outil d’organisation pour parents séparés. Aucune valeur juridique.",
    button: "J’accepte et j’accède à l’application"
  },
  es: {
    title: "Parentio",
    text: "Herramienta de organización para padres separados. Sin valor jurídico.",
    button: "Acepto y accedo a la aplicación"
  },
  en: {
    title: "Parentio",
    text: "Organisation tool for separated parents. No legal value.",
    button: "I accept and access the application"
  }
};

export default function ConsentScreen({ onAccept }) {
  const initialLang = localStorage.getItem("par_lang") || "fr";
  const [lang, setLang] = useState(["fr", "es", "en"].includes(initialLang) ? initialLang : "fr");
  const t = TEXTS[lang] || TEXTS.fr;

  function chooseLang(nextLang) {
    setLang(nextLang);
    localStorage.setItem("par_lang", nextLang);
  }

  function accept() {
    localStorage.setItem("par_lang", lang);
    if (typeof onAccept === "function") onAccept(lang);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 30%, #2b2c64, #060617 70%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Nunito','Segoe UI',sans-serif",
      padding: 20,
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 22,
        padding: 24,
        textAlign: "center",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)"
      }}>
        <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>{t.title}</h1>
        <p style={{ margin: "0 auto 18px", maxWidth: 340, fontSize: 16, lineHeight: 1.5, fontWeight: 700 }}>{t.text}</p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18 }}>
          {[
            ["fr", "🇫🇷 Français"],
            ["es", "🇪🇸 Español"],
            ["en", "🇬🇧 English"]
          ].map(([code, label]) => (
            <button key={code} type="button" onClick={() => chooseLang(code)} style={{
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "8px 10px",
              background: lang === code ? "#fff" : "rgba(255,255,255,0.12)",
              color: lang === code ? "#17172f" : "#fff",
              fontWeight: 900,
              cursor: "pointer"
            }}>
              {label}
            </button>
          ))}
        </div>

        <button type="button" onClick={accept} style={{
          width: "100%",
          border: "none",
          borderRadius: 14,
          padding: "15px 16px",
          background: "#93c5fd",
          color: "#fff",
          fontSize: 16,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 10px 24px rgba(147,197,253,0.35)"
        }}>
          {t.button}
        </button>
      </div>
    </div>
  );
}
