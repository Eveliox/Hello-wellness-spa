import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const bodySchema = z.object({
  token: z.string().uuid(),
  score: z.number().int().min(0).max(10),
  text: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "feedback");
  if (!rl.allowed) return rateLimitResponse(rl);

  let parsed;
  try {
    const json: unknown = await request.json();
    const result = bodySchema.safeParse(json);
    if (!result.success) {
      return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
    }
    parsed = result.data;
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Feedback not configured." }, { status: 503 });
  }

  const supabase = getSupabase();
  const { data: existing, error: lookupErr } = await supabase
    .from("review_requests")
    .select("id, patient_name, patient_email, service, submitted_at")
    .eq("token", parsed.token)
    .maybeSingle();

  if (lookupErr || !existing) {
    return Response.json({ ok: false, message: "Feedback link not found." }, { status: 404 });
  }
  if (existing.submitted_at) {
    return Response.json({ ok: false, message: "This feedback was already submitted." }, { status: 409 });
  }

  const isPromoter = parsed.score >= 9;
  const isDetractor = parsed.score <= 6;
  const routedTo: "google" | "private" = isPromoter ? "google" : "private";

  const { error: updateErr } = await supabase
    .from("review_requests")
    .update({
      nps_score: parsed.score,
      feedback_text: parsed.text ?? null,
      routed_to: routedTo,
      is_escalation: isDetractor,
      submitted_at: new Date().toISOString(),
    })
    .eq("token", parsed.token);

  if (updateErr) {
    console.error("[feedback/submit] update failed", updateErr);
    return Response.json({ ok: false, message: "Could not save feedback." }, { status: 500 });
  }

  // Fire-and-forget: notify the team if this is a detractor.
  if (isDetractor) {
    void notifyEscalation({
      name: existing.patient_name,
      email: existing.patient_email,
      service: existing.service,
      score: parsed.score,
      text: parsed.text,
    }).catch((err) => console.error("[feedback/submit] escalation email threw", err));
  }

  return Response.json({
    ok: true,
    routedTo,
    redirectUrl: isPromoter ? site.googleReviewsUrl : undefined,
  });
}

async function notifyEscalation(args: {
  name: string;
  email: string | null;
  service: string | null;
  score: number;
  text: string | undefined;
}) {
  const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!notify) return;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px;color:#C0392B">⚠️ Detractor feedback — respond within 2 hours</h2>
      <p style="margin:0 0 20px;color:#555">
        A recent guest gave you a low NPS score. Reach out personally to make it right before they post publicly.
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:180px">NPS score</td>
          <td style="padding:6px 10px;border:1px solid #eee;font-size:20px;font-weight:700;color:#C0392B">${args.score}/10</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Guest name</td>
          <td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(args.name)}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Email</td>
          <td style="padding:6px 10px;border:1px solid #eee">${args.email ? escapeHtml(args.email) : "—"}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Service</td>
          <td style="padding:6px 10px;border:1px solid #eee">${args.service ? escapeHtml(args.service) : "—"}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;vertical-align:top">Feedback</td>
          <td style="padding:6px 10px;border:1px solid #eee;white-space:pre-wrap">${
            args.text ? escapeHtml(args.text) : "(no text provided)"
          }</td>
        </tr>
      </table>
      <p style="margin:20px 0 0;color:#555;font-size:13px">
        Call or text this guest today. Small, fast recoveries prevent 1-star reviews.
      </p>
    </div>
  `;

  await sendEmail({
    to: notify,
    subject: `⚠️ Detractor NPS ${args.score}/10 · ${args.name}`,
    html,
    replyTo: args.email ?? undefined,
  });
}
