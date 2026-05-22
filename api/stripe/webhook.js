import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    readable.on("data", (chunk) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });

    readable.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    readable.on("error", reject);
  });
}

async function setPremium(userId, isPremium) {
  if (!userId) return;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: isPremium,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session?.metadata?.user_id;

      await setPremium(userId, true);
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.paused"
    ) {
      const subscription = event.data.object;
      const userId = subscription?.metadata?.user_id;

      await setPremium(userId, false);
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription?.metadata?.user_id;
      const isActive = ["active", "trialing"].includes(subscription.status);

      await setPremium(userId, isActive);
    }

    return res.status(200).json({
      received: true
    });
  } catch (error) {
    console.error("Webhook handling error:", error);

    return res.status(500).json({
      error: error.message || "Webhook handling error"
    });
  }
}
