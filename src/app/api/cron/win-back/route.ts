import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

/**
 * Weekly 90-day win-back cron.
 *
 * Runs Fridays (see vercel.json). Finds patients whose most recent booking or
 * intake is 90–120 days old (avoids re-hitting the same people every week) and
 * sends a warm re-engagement email.
 *
 * "Last visit" is approximated by:
 *   1. bookings.booking_at (most reliable, requires Cal.com webhook to be live)
 *   2. glp1_intake_submissions or intake_submissions submission timestamp
 *      (fallback for patients booked before webhook was wired)
 *
 * We take the MAX of these three across email matches. Not perfect — a patient
 * who never filled intake or was booked before the webhook won't be captured —
 * but it's a real win-back signal for the majority of active patients.
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
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Not configured." }, { status: 503 });
  }

  const supabase = getSupabase();

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const windowStart = new Date(now - 120 * day).toISOString();
  const windowEnd = new Date(now - 90 * day).toISOString();

  // Latest booking per email (any status) within the 90-120 day window.
  const { data: bookingRows, error: bookingErr } = await supabase
    .from("bookings")
    .select("attendee_email, attendee_name, booking_at")
    .not("attendee_email", "is", null)
    .gte("booking_at", windowStart)
    .lte("booking_at", windowEnd);

  if (bookingErr) {
    console.error("[cron/win-back] booking query failed", bookingErr);
  }

  // Also grab intake submissions in the same window (fallback signal).
  const { data: intakeRows, error: intakeErr } = await supabase
    .from("glp1_intake_submissions")
    .select("email, full_name, submitted_at")
    .not("email", "is", null)
    .gte("submitted_at", windowStart)
    .lte("submitted_at", windowEnd);

  if (intakeErr) {
    console.error("[cron/win-back] intake query failed", intakeErr);
  }

  // Deduplicate by email; take the freshest event per email.
  const latest = new Map<string, { name: string; lastAt: string }>();
  for (const row of bookingRows ?? []) {
    const email = row.attendee_email?.toLowerCase();
    if (!email) continue;
    const cur = latest.get(email);
    if (!cur || row.booking_at > cur.lastAt) {
      latest.set(email, { name: row.attendee_name ?? "", lastAt: row.booking_at });
    }
  }
  for (const row of intakeRows ?? []) {
    const email = row.email?.toLowerCase();
    if (!email) continue;
    const cur = latest.get(email);
    if (!cur || row.submitted_at > cur.lastAt) {
      latest.set(email, { name: row.full_name ?? "", lastAt: row.submitted_at });
    }
  }

  // Exclude anyone with a MORE RECENT touchpoint (fresh booking = not lapsed).
  const emails = Array.from(latest.keys());
  if (emails.length > 0) {
    const { data: fresh } = await supabase
      .from("bookings")
      .select("attendee_email, booking_at")
      .gt("booking_at", windowEnd)
      .in("attendee_email", emails);

    for (const row of fresh ?? []) {
      const email = row.attendee_email?.toLowerCase();
      if (email) latest.delete(email);
    }
  }

  let sent = 0;
  const failures: string[] = [];

  for (const [email, info] of latest.entries()) {
    const result = await sendWinBackEmail({
      email,
      name: info.name,
      lastAt: info.lastAt,
    });
    if (result.delivered) {
      sent += 1;
    } else if (result.reason !== "not-configured") {
      failures.push(`${email}: ${result.reason}`);
    }
  }

  return Response.json({
    ok: true,
    candidates: latest.size,
    sent,
    failures,
  });
}

async function sendWinBackEmail(args: { email: string; name: string; lastAt: string }) {
  const firstName = args.name.trim().split(/\s+/)[0] || "there";
  const monthsAgo = Math.round((Date.now() - new Date(args.lastAt).getTime()) / (30 * 24 * 60 * 60 * 1000));

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)}
      </p>
      <h1 style="margin:0 0 8px;font-size:22px;color:#212020">
        Hi ${escapeHtml(firstName)} — it&apos;s been ${monthsAgo} months.
      </h1>
      <p style="margin:0 0 16px;font-size:15px">
        Not a hard sell — just a nudge. Bodies change, seasons change, and what supported you three
        months ago may not be what supports you now.
      </p>
      <p style="margin:0 0 16px;font-size:15px">
        Come back for a returning-patient visit and we&apos;ll do a 15-minute check-in (no cost)
        to see where you are now and whether anything needs adjusting. If we recommend a service,
        <strong>15% off for returning patients this month</strong>.
      </p>
      <p style="margin:24px 0 8px">
        <a
          href="${escapeHtml(site.url)}/book"
          style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px"
        >
          Book a check-in
        </a>
      </p>
      <p style="margin:16px 0 0;color:#666;font-size:13px">
        Prefer to text? We&apos;re at
        <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#212020;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>.
        No pressure if the timing isn&apos;t right — we&apos;re here when you&apos;re ready.
      </p>
      <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
        ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)}
      </p>
    </div>
  `;

  return sendEmail({
    to: args.email,
    subject: `Been a while, ${firstName} · ${site.shortBrand}`,
    html,
  });
}
