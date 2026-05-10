/**
 * Send an email via Resend API.
 * Requires env.RESEND_API_KEY to be set as a Worker secret.
 * Silently fails if key is missing - never throws, never blocks the response.
 */
export async function sendEmail(env, { to, subject, html }) {
  if (!env.RESEND_API_KEY) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL ?? "Kokoc Store <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Resend ${res.status}:`, body);
    }
  } catch(err) {
    console.error('[email] fetch failed:', err.message);
  }
}
