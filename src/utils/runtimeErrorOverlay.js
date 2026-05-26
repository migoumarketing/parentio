// Parentio Runtime Error Overlay
// Objectif : afficher l'erreur React/JavaScript directement à l'écran
// quand l'application affiche un écran noir côté navigateur.

function createOverlay(title, details) {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("parentio-runtime-error-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "parentio-runtime-error-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "2147483647";
  overlay.style.background = "#050505";
  overlay.style.color = "#fff";
  overlay.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  overlay.style.padding = "20px";
  overlay.style.overflow = "auto";
  overlay.style.boxSizing = "border-box";

  const box = document.createElement("div");
  box.style.maxWidth = "980px";
  box.style.margin = "0 auto";
  box.style.border = "1px solid rgba(239,68,68,0.55)";
  box.style.borderRadius = "18px";
  box.style.background = "rgba(127,29,29,0.22)";
  box.style.padding = "18px";
  box.style.boxShadow = "0 20px 60px rgba(0,0,0,0.45)";

  const h1 = document.createElement("div");
  h1.textContent = "Erreur Parentio détectée";
  h1.style.fontSize = "22px";
  h1.style.fontWeight = "900";
  h1.style.marginBottom = "10px";
  h1.style.color = "#fecaca";

  const p = document.createElement("div");
  p.textContent = "Copie ou prends en capture le texte ci-dessous et envoie-le dans ChatGPT.";
  p.style.fontSize = "14px";
  p.style.opacity = "0.85";
  p.style.marginBottom = "14px";

  const pre = document.createElement("pre");
  pre.textContent = `${title}\n\n${details || ""}`;
  pre.style.whiteSpace = "pre-wrap";
  pre.style.wordBreak = "break-word";
  pre.style.background = "rgba(0,0,0,0.45)";
  pre.style.border = "1px solid rgba(255,255,255,0.12)";
  pre.style.borderRadius = "12px";
  pre.style.padding = "14px";
  pre.style.fontSize = "12px";
  pre.style.lineHeight = "1.6";
  pre.style.color = "#fff";

  const btn = document.createElement("button");
  btn.textContent = "Recharger la page";
  btn.style.marginTop = "14px";
  btn.style.border = "none";
  btn.style.borderRadius = "12px";
  btn.style.padding = "12px 14px";
  btn.style.fontWeight = "900";
  btn.style.background = "#fff";
  btn.style.color = "#111827";
  btn.onclick = () => window.location.reload();

  box.appendChild(h1);
  box.appendChild(p);
  box.appendChild(pre);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const message = event?.message || "Erreur JavaScript inconnue";
    const source = event?.filename ? `\nFichier: ${event.filename}:${event.lineno}:${event.colno}` : "";
    const stack = event?.error?.stack ? `\n\nStack:\n${event.error.stack}` : "";
    createOverlay(message, `${source}${stack}`);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const message = reason?.message || String(reason || "Promise rejetée sans message");
    const stack = reason?.stack ? `\n\nStack:\n${reason.stack}` : "";
    createOverlay("Unhandled Promise Rejection", `${message}${stack}`);
  });

  // Diagnostic si React ne monte rien après quelques secondes.
  window.setTimeout(() => {
    const root = document.getElementById("root");
    const alreadyOverlay = document.getElementById("parentio-runtime-error-overlay");

    if (!alreadyOverlay && root && root.childElementCount === 0) {
      createOverlay(
        "React n'a rien affiché dans #root",
        "Le build est probablement correct, mais le rendu React ne démarre pas. Vérifier src/main.jsx, src/App.jsx, ou une erreur importée avant le rendu."
      );
    }
  }, 4500);
}
