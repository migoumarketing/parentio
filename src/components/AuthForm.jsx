// src/components/AuthForm.jsx

import { useState } from "react";
import { signIn, signUp } from "../services/auth";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Envoi en cours...");

    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        console.log("LOGIN RESULT:", result);
        setMessage("Connexion réussie.");
        alert("Connexion réussie");
      } else {
        const result = await signUp(email, password);
        console.log("SIGNUP RESULT:", result);
        setMessage("Compte créé. Vérifie dans Supabase > Authentication > Users.");
        alert("Compte créé. Vérifie dans Supabase > Authentication > Users.");
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);
      setMessage("Erreur : " + error.message);
      alert(error.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>{mode === "login" ? "Connexion" : "Créer un compte"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 12 }}>
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 12, color: "#fff", fontSize: 14 }}>
          {message}
        </p>
      )}

      <button
        onClick={() => {
          setMessage("");
          setMode(mode === "login" ? "signup" : "login");
        }}
        style={{ marginTop: 12, width: "100%", padding: 12 }}
      >
        {mode === "login"
          ? "Je n’ai pas encore de compte"
          : "J’ai déjà un compte"}
      </button>
    </div>
  );
}
