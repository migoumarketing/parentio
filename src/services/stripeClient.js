export async function createCheckoutSession({ userId, userEmail, priceId, successUrl, cancelUrl }) {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, userEmail, priceId, successUrl, cancelUrl })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur Stripe");
  return data;
}

export async function redirectToCheckout(payload) {
  const data = await createCheckoutSession(payload);
  if (!data?.url) throw new Error("Stripe n'a pas retourné d'URL Checkout.");
  window.location.href = data.url;
  return true;
}
