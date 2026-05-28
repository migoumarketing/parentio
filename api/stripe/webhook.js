import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({
      error: "Missing STRIPE_WEBHOOK_SECRET"
    });
  }

  let event;

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);

    return res.status(400).json({
      error: `Webhook Error: ${error.message}`
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata?.user_id;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (userId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            is_premium: true,
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subscriptionId || null,
            premium_updated_at: new Date().toISOString()
          })
          .eq("id", userId);

        if (error) throw error;
      }
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.paused"
    ) {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_premium: false,
          premium_updated_at: new Date().toISOString()
        })
        .eq("stripe_subscription_id", subscriptionId);

      if (error) throw error;
    }

    return res.status(200).json({
      received: true
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return res.status(500).json({
      error: error.message || "Webhook processing error"
    });
  }
}
