import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      userId,
      userEmail,
      priceId,
      successUrl,
      cancelUrl
    } = req.body || {};

    if (!userId || !userEmail || !priceId) {
      return res.status(400).json({
        error: "Missing required fields"
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
      success_url: successUrl || `${req.headers.origin}/?stripe=success`,
      cancel_url: cancelUrl || `${req.headers.origin}/?stripe=cancel`,
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
