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

    const cleanTo = String(to).trim().toLowerCase();
    const cleanInviterEmail = inviterEmail
      ? String(inviterEmail).trim().toLowerCase()
      : "Un utilisateur Parentio";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Parentio <onboarding@resend.dev>",
        to: cleanTo,
        subject: "Invitation Parentio",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="margin:0 0 12px;color:#111827">Invitation Parentio</h2>

            <p>
              ${cleanInviterEmail} vous invite à rejoindre son espace Parentio.
            </p>

            <p>
              Permission : <strong>${permission || "read"}</strong>
            </p>

            <p>
              Parentio est un outil d'organisation pour parents séparés.
              Il ne doit pas être utilisé pour surveiller, harceler ou faire pression sur l'autre parent.
            </p>

            <p style="margin-top:24px">
              <a href="https://parentio.vercel.app"
                 style="display:inline-block;background:#6366f1;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">
                Ouvrir Parentio
              </a>
            </p>

            <p style="font-size:12px;color:#6b7280;margin-top:24px">
              Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
            </p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.message || data?.error || "Resend email error"
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
