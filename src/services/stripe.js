// src/services/stripe.js

export async function createCheckoutSession() {
  const response = await fetch("/api/create-checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la session Stripe");
  }

  const data = await response.json();

  if (!data.url) {
    throw new Error("URL Stripe manquante");
  }

  window.location.href = data.url;
}
