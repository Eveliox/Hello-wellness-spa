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
