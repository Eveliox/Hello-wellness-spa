import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

/**
 * Monday-morning digest to the owner.
 *
 * Wired via Vercel Cron (see vercel.json). Vercel signs the request with a
 * Bearer token equal to CRON_SECRET so we can reject anyone else calling it.
 *
 * Body summarises the past 7 days of NPS feedback: sent count, response rate,
 * NPS breakdown (promoters/passives/detractors), unresolved escalations, and
 * two verbatim quotes (one promoter, one detractor if any).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, message: "Not authorized." }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!supabaseUrl || !notify) {
    return Response.json({ ok: false, message: "Not configured." }, { status: 503 });
  }

  const supabase = getSupabase();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await supabase
    .from("review_requests")
    .select("nps_score, is_escalation, feedback_text, patient_name, service, submitted_at, sms_sent_at, created_at")
    .gte("created_at", since);

  if (error) {
    console.error("[cron/weekly-digest] fetch failed", error);
    return Response.json({ ok: false, message: "Query failed." }, { status: 500 });
  }

  const total = rows?.length ?? 0;
  const responded = rows?.filter((r) => r.nps_score !== null).length ?? 0;
  const promoters = rows?.filter((r) => (r.nps_score ?? -1) >= 9).length ?? 0;
  const passives = rows?.filter((r) => (r.nps_score ?? -1) >= 7 && (r.nps_score ?? -1) <= 8).length ?? 0;
  const detractors = rows?.filter((r) => (r.nps_score ?? -1) >= 0 && (r.nps_score ?? -1) <= 6).length ?? 0;
  const nps = responded > 0 ? Math.round(((promoters - detractors) / responded) * 100) : null;

  const escalations = rows?.filter((r) => r.is_escalation) ?? [];

  const bestQuote = rows
    ?.filter((r) => (r.nps_score ?? -1) >= 9 && r.feedback_text)
    .sort((a, b) =>
      (b.submitted_at ?? "").localeCompare(a.submitted_at ?? ""),
    )[0];
  const worstQuote = rows
    ?.filter((r) => (r.nps_score ?? -1) <= 6 && r.feedback_text)
    .sort((a, b) =>
      (b.submitted_at ?? "").localeCompare(a.submitted_at ?? ""),
    )[0];

  const startDate = new Date(since);
  const endDate = new Date();
  const rangeLabel = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const html = renderDigest({
    rangeLabel,
    total,
    responded,
    promoters,
    passives,
    detractors,
    nps,
    escalations: escalations.map((e) => ({
      name: e.patient_name,
      service: e.service,
      score: e.nps_score,
      text: e.feedback_text,
    })),
    bestQuote: bestQuote
      ? { name: bestQuote.patient_name, score: bestQuote.nps_score, text: bestQuote.feedback_text }
      : null,
    worstQuote: worstQuote
      ? { name: worstQuote.patient_name, score: worstQuote.nps_score, text: worstQuote.feedback_text }
      : null,
  });

  await sendEmail({
    to: notify,
    subject: `${site.shortBrand} weekly digest · ${rangeLabel} · NPS ${nps ?? "—"}`,
    html,
  });

  return Response.json({ ok: true, total, responded, promoters, passives, detractors, nps });
}

type DigestArgs = {
  rangeLabel: string;
  total: number;
  responded: number;
  promoters: number;
  passives: number;
  detractors: number;
  nps: number | null;
  escalations: Array<{
    name: string;
    service: string | null;
    score: number | null;
    text: string | null;
  }>;
  bestQuote: { name: string; score: number | null; text: string | null } | null;
  worstQuote: { name: string; score: number | null; text: string | null } | null;
};

function renderDigest(args: DigestArgs): string {
  const {
    rangeLabel,
    total,
    responded,
    promoters,
    passives,
    detractors,
    nps,
    escalations,
    bestQuote,
    worstQuote,
  } = args;

  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;color:#212020;line-height:1.5">
      <p style="margin:0 0 4px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)} · Weekly digest
      </p>
      <h1 style="margin:0 0 4px;font-size:22px;color:#212020">${escapeHtml(rangeLabel)}</h1>
      <p style="margin:0 0 24px;color:#666;font-size:14px">
        Here&apos;s the reviews pulse for the past week.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr>
          <td style="padding:12px;background:#faf8f6;border:1px solid #eee;width:33%">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">NPS</p>
            <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:${nps !== null && nps >= 50 ? "#27ae60" : nps !== null && nps < 0 ? "#C0392B" : "#212020"}">
              ${nps === null ? "—" : nps}
            </p>
          </td>
          <td style="padding:12px;background:#faf8f6;border:1px solid #eee;width:33%">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">Requests sent</p>
            <p style="margin:4px 0 0;font-size:28px;font-weight:700">${total}</p>
          </td>
          <td style="padding:12px;background:#faf8f6;border:1px solid #eee;width:33%">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">Response rate</p>
            <p style="margin:4px 0 0;font-size:28px;font-weight:700">${responseRate}%</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
        Breakdown
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:10px;border:1px solid #eee">
            <span style="color:#27ae60;font-weight:700">${promoters}</span>
            <span style="color:#666"> promoters (9–10) → routed to Google</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #eee">
            <span style="color:#888;font-weight:700">${passives}</span>
            <span style="color:#666"> passives (7–8)</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #eee">
            <span style="color:#C0392B;font-weight:700">${detractors}</span>
            <span style="color:#666"> detractors (0–6) → escalations below</span>
          </td>
        </tr>
      </table>

      ${
        escalations.length > 0
          ? `
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#C0392B;font-weight:600">
          ⚠️ Escalations — reach out this week
        </p>
        ${escalations
          .map(
            (e) => `
          <div style="padding:12px;border-left:3px solid #C0392B;background:#fdf5f4;margin-bottom:12px">
            <p style="margin:0;font-size:14px;font-weight:600">${escapeHtml(e.name)} — ${e.score}/10${e.service ? ` · ${escapeHtml(e.service)}` : ""}</p>
            ${e.text ? `<p style="margin:6px 0 0;color:#555;font-size:13px;white-space:pre-wrap">${escapeHtml(e.text)}</p>` : ""}
          </div>
        `,
          )
          .join("")}
      `
          : ""
      }

      ${
        bestQuote?.text
          ? `
        <p style="margin:24px 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
          Promoter of the week
        </p>
        <blockquote style="margin:0 0 16px;padding:12px 16px;background:#f0f7f2;border-left:3px solid #27ae60">
          <p style="margin:0;font-style:italic;color:#333">&ldquo;${escapeHtml(bestQuote.text)}&rdquo;</p>
          <p style="margin:6px 0 0;font-size:12px;color:#666">— ${escapeHtml(bestQuote.name)} · ${bestQuote.score}/10</p>
        </blockquote>
      `
          : ""
      }

      ${
        worstQuote?.text && !escalations.length
          ? `
        <p style="margin:24px 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
          Something to fix
        </p>
        <blockquote style="margin:0 0 16px;padding:12px 16px;background:#faf8f6;border-left:3px solid #888">
          <p style="margin:0;font-style:italic;color:#333">&ldquo;${escapeHtml(worstQuote.text)}&rdquo;</p>
          <p style="margin:6px 0 0;font-size:12px;color:#666">— ${escapeHtml(worstQuote.name)} · ${worstQuote.score}/10</p>
        </blockquote>
      `
          : ""
      }

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;color:#888;font-size:12px">
        <p style="margin:0">Send more review requests from the admin dashboard:</p>
        <p style="margin:4px 0 0"><a href="${escapeHtml(site.url)}/admin" style="color:#212020">${escapeHtml(site.url)}/admin</a></p>
      </div>
    </div>
  `;
}
