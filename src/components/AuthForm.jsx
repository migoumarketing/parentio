// src/components/AuthForm.jsx

import { useState } from "react";
import { signIn, signUp } from "../services/auth";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (mode === "login") {
        await signIn(email, password);
        alert("Connexion réussie");
      } else {
        await signUp(email, password);
        alert("Compte créé. Vérifie tes emails si Supabase demande une confirmation.");
      }
    } catch (error) {
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

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ marginTop: 12, width: "100%", padding: 12 }}
      >
        {mode === "login"
          ? "Je n’ai pas encore de compte"
          : "J’ai déjà un compte"}
      </button>
    </div>
  );
}
