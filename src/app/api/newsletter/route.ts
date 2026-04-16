import { z } from "zod";
import { escapeHtml, sendEmail } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email().max(200),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const { email } = parsed.data;

    const added = await addToAudience(email);
    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;

    if (notify) {
      await sendEmail({
        to: notify,
        subject: "New newsletter signup",
        html: `<p>${escapeHtml(email)} subscribed on ${new Date().toISOString()}.</p>
               <p>Audience sync: <strong>${added ? "added" : "skipped or failed"}</strong>.</p>`,
      });
    } else if (!added) {
      console.warn("[newsletter] no delivery path — set RESEND_AUDIENCE_ID or CONTACT_NOTIFICATION_EMAIL", { email });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

async function addToAudience(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return false;

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[newsletter] audience sync failed", res.status, body);
    return false;
  }
  return true;
}
