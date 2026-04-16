import { z } from "zod";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";
import { services, type ServiceSlug } from "@/content/services";
import { quizSteps } from "@/content/quiz";

const validSlugs = new Set<ServiceSlug>([
  "assisted-weight-loss",
  "aesthetics-cosmetics",
  "iv-therapy",
  "build-your-own-iv",
  "peptide-therapy",
]);

const bodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  answers: z.record(z.string(), z.array(z.string()).max(10)).optional(),
  recommendation: z.string().refine((s): s is ServiceSlug => validSlugs.has(s as ServiceSlug)),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid submission." }, { status: 400 });
    }

    const { name, email, phone, answers, recommendation } = parsed.data;
    const match = services.find((s) => s.slug === recommendation);
    if (!match) {
      return Response.json({ ok: false, message: "Unknown recommendation." }, { status: 400 });
    }

    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!notify) {
      console.warn("[quiz] CONTACT_NOTIFICATION_EMAIL not set — lead not delivered", {
        name,
        email,
        recommendation,
      });
      return Response.json({ ok: true });
    }

    const answerLines = quizSteps
      .map((step) => {
        const selected = answers?.[step.id] ?? [];
        const labels = selected
          .map((id) => step.options.find((o) => o.id === id)?.label ?? id)
          .join(", ");
        return `<li><strong>${escapeHtml(step.title)}</strong> — ${escapeHtml(labels || "(skipped)")}</li>`;
      })
      .join("");

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
        <h2 style="margin:0 0 8px">New wellness quiz lead</h2>
        <p style="margin:0 0 16px;color:#555">From ${escapeHtml(site.url)}/quiz</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:140px">Name</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Email</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Phone</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(phone ?? "—")}</td></tr>
          <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Recommendation</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(match.title)}</td></tr>
        </table>
        <h3 style="margin:0 0 8px">Answers</h3>
        <ul style="padding-left:18px;margin:0">${answerLines}</ul>
      </div>
    `;

    await sendEmail({
      to: notify,
      subject: `Quiz lead · ${match.title} · ${name}`,
      html,
      replyTo: email,
    });

    // Send lead their result (best-effort)
    await sendEmail({
      to: email,
      subject: `Your Hello You Wellness match: ${match.title}`,
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
          <h2 style="margin:0 0 8px">Your match: ${escapeHtml(match.title)}</h2>
          <p style="margin:0 0 16px;color:#555">${escapeHtml(match.summary)}</p>
          <p>
            <a href="tel:${escapeHtml(site.phoneTel)}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#121212;color:#fff;text-decoration:none">Call the studio</a>
            &nbsp;
            <a href="${escapeHtml(site.social.instagram)}" style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #ddd;color:#121212;text-decoration:none">Message on Instagram</a>
            &nbsp;
            <a href="${escapeHtml(site.url)}/services/${escapeHtml(match.slug)}" style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #ddd;color:#121212;text-decoration:none">Read more</a>
          </p>
          <p style="margin-top:24px;color:#777;font-size:12px">
            ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)} ${escapeHtml(site.address.zip)}
          </p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Unexpected error." }, { status: 500 });
  }
}
