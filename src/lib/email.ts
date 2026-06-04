const RESEND_ENDPOINT = "https://api.resend.com/emails";

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export type EmailResult =
  | { delivered: true; id: string }
  | { delivered: false; reason: "not-configured" }
  | { delivered: false; reason: "error"; status?: number; message?: string };

export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[email] skipped — RESEND_API_KEY or CONTACT_FROM_EMAIL not set", { to, subject });
    return { delivered: false, reason: "not-configured" };
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    console.error("[email] resend error", res.status, message);
    return { delivered: false, reason: "error", status: res.status, message };
  }

  const data = (await res.json()) as { id?: string };
  return { delivered: true, id: data.id ?? "" };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send the raw form payload to the admin inbox when a primary persistence
 * path fails (e.g. Supabase insert errored). This is the fallback of last
 * resort so submissions are recoverable even when the DB is down.
 */
export async function emailFallbackPayload(args: {
  routeName: string;
  reason: string;
  payload: unknown;
}): Promise<void> {
  try {
    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!notify) {
      console.warn(
        `[${args.routeName}] DB fallback skipped — CONTACT_NOTIFICATION_EMAIL not set`,
      );
      return;
    }

    const serialized = JSON.stringify(args.payload, null, 2);
    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
        <h2 style="margin:0 0 8px;color:#C0392B">⚠️ Database insert failed</h2>
        <p style="margin:0 0 6px"><strong>Route:</strong> ${escapeHtml(args.routeName)}</p>
        <p style="margin:0 0 6px"><strong>Reason:</strong> ${escapeHtml(args.reason)}</p>
        <p style="margin:0 0 6px"><strong>When:</strong> ${escapeHtml(new Date().toISOString())}</p>
        <p style="margin:0 0 16px;color:#555;font-size:13px">
          The submission below was not persisted. Add it manually so the patient isn't lost.
        </p>
        <h3 style="margin:16px 0 8px">Raw payload</h3>
        <pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow:auto;font-size:11px;white-space:pre-wrap;word-break:break-word">${escapeHtml(serialized)}</pre>
      </div>
    `;

    await sendEmail({
      to: notify,
      subject: `[ALERT] DB insert failed — ${args.routeName}`,
      html,
    });
  } catch (err) {
    // Last resort — even the fallback failed. All we can do is log.
    console.error(`[${args.routeName}] fallback email itself threw`, err);
  }
}
