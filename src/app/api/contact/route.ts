import { z } from "zod";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

const bodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  interest: z.string().max(60),
  message: z.string().min(10).max(4000),
  website: z.string().optional(),
});

const interestLabels: Record<string, string> = {
  general: "General question",
  "weight-loss": "Assisted weight loss",
  aesthetics: "Aesthetics & cosmetics",
  iv: "IV therapy",
  peptides: "Peptide therapy",
  booking: "Booking help",
};

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid form data." }, { status: 400 });
    }

    const { website, name, email, phone, interest, message } = parsed.data;

    if (website) {
      // Honeypot tripped — pretend success to slow simple bots
      return Response.json({ ok: true });
    }

    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!notify) {
      console.warn("[contact] CONTACT_NOTIFICATION_EMAIL not set — message not delivered", {
        name,
        email,
        interest,
      });
      return Response.json({ ok: true });
    }

    const interestLabel = interestLabels[interest] ?? interest;
    const submittedAt = new Date().toISOString();

    const rows: Array<[string, string]> = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone ?? "—"],
      ["Interest", interestLabel],
      ["Submitted", submittedAt],
    ];

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
        <h2 style="margin:0 0 16px">New contact form submission</h2>
        <p style="margin:0 0 16px;color:#555">From ${escapeHtml(site.url)}/contact</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:140px">${escapeHtml(label)}</td>
              <td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(value)}</td>
            </tr>`,
            )
            .join("")}
        </table>
        <h3 style="margin:0 0 8px">Message</h3>
        <div style="padding:12px;border:1px solid #eee;border-radius:8px;white-space:pre-wrap">${escapeHtml(message)}</div>
      </div>
    `;

    const result = await sendEmail({
      to: notify,
      subject: `New inquiry · ${interestLabel} · ${name}`,
      html,
      replyTo: email,
    });

    if (!result.delivered && result.reason === "error") {
      return Response.json(
        { ok: false, message: "We could not send your message. Please call us." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Unexpected error." }, { status: 500 });
  }
}
