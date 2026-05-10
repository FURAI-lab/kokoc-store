import { jsonResponse } from "../../lib/response.js";
import { sendEmail } from "../../lib/email.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function handleSubscribe(request, env, ctx) {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  let email;
  try {
    const body = await request.json();
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "Некорректный email" }, { status: 400 });
  }

  if (email.length > 254) {
    return jsonResponse({ ok: false, error: "Email слишком длинный" }, { status: 400 });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ipHash = ip
    ? Array.from(
        new Uint8Array(
          await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip))
        )
      ).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16)
    : null;

  try {
    await env.DB.prepare(`
      INSERT INTO subscribers (id, email, source, ip_hash)
      VALUES (?, ?, 'newsletter', ?)
    `).bind(crypto.randomUUID(), email, ipHash).run();

    // Send notification email - fire and forget, does not block response
    const now = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    ctx.waitUntil(
      sendEmail(env, {
        to: "kokoc.store@gmail.com",
        subject: `🐾 Новый подписчик — ${email}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="margin:0 0 16px;font-size:20px">Новый подписчик на Kokoc Store</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr>
                <td style="padding:10px 0;color:#888;width:100px">Email</td>
                <td style="padding:10px 0;font-weight:600">${email}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888">Дата</td>
                <td style="padding:10px 0">${now} (GMT+7)</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888">Источник</td>
                <td style="padding:10px 0">Newsletter форма</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
            <p style="font-size:12px;color:#aaa;margin:0">
              Kokoc Store · kokoc.store
            </p>
          </div>
        `,
      })
    );

    return jsonResponse({ ok: true, message: "Подписка оформлена" }, { status: 201 });
  } catch (err) {
    if (err.message?.includes("UNIQUE")) {
      return jsonResponse({ ok: true, message: "Уже подписан" }, { status: 200 });
    }
    return jsonResponse({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
