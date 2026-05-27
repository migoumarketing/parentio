import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { userId, userEmail, priceId } = req.body || {};

    if (!userId) {
      return res.status(400).json({
        error: "Missing userId"
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        error: "Missing userEmail"
      });
    }

    if (!priceId) {
      return res.status(400).json({
        error: "Missing priceId"
      });
    }

    if (!String(priceId).startsWith("price_")) {
      return res.status(400).json({
        error: "Invalid Stripe priceId. It must start with price_"
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: "https://parentio.vercel.app/?stripe=success",
      cancel_url: "https://parentio.vercel.app/?stripe=cancel",
      metadata: {
        user_id: userId
      },
      subscription_data: {
        metadata: {
          user_id: userId
        }
      }
    });

    return res.status(200).json({
      url: session.url
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      error: error.message || "Stripe checkout error"
    });
  }
}
