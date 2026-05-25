import { useState } from "react";
import { redirectToCheckout } from "../services/stripeClient";

export function useStripeCheckout(user) {
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  async function startCheckout(priceId = import.meta.env.VITE_STRIPE_PRICE_ID) {
    if (!user?.id || !user?.email) {
      setStripeError("Utilisateur non connecté.");
      return false;
    }

    if (!priceId) {
      setStripeError("Price ID Stripe manquant.");
      return false;
    }

    try {
      setStripeLoading(true);
      setStripeError(null);

      await redirectToCheckout({
        userId: user.id,
        userEmail: user.email,
        priceId,
        successUrl: `${window.location.origin}/?stripe=success`,
        cancelUrl: `${window.location.origin}/?stripe=cancel`
      });

      return true;
    } catch (error) {
      setStripeError(error.message || "Erreur Stripe");
      return false;
    } finally {
      setStripeLoading(false);
    }
  }

  return { stripeLoading, stripeError, startCheckout };
}
