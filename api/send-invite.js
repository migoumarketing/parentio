export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { to, inviterEmail, permission } = req.body || {};

    if (!to) {
      return res.status(400).json({
        error: "Missing recipient email"
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing RESEND_API_KEY"
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Parentio <onboarding@resend.dev>",
        to,
        subject: "Invitation Parentio",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
            <h2>Invitation Parentio</h2>
            <p>${inviterEmail || "Un utilisateur"} vous invite à rejoindre son espace Parentio.</p>
            <p>Permission : <strong>${permission || "Lecture seule"}</strong></p>
            <p>Connectez-vous sur Parentio avec cette adresse email pour voir l’invitation.</p>
            <p>
              <a href="https://parentio.vercel.app"
                 style="display:inline-block;background:#6366f1;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">
                Ouvrir Parentio
              </a>
            </p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.message || "Resend email error"
      });
    }

    return res.status(200).json({
      ok: true,
      id: data.id
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Email send error"
    });
  }
}
