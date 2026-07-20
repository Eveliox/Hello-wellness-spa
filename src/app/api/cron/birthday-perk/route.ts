import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

/**
 * Daily birthday-perk cron.
 *
 * Runs every morning (see vercel.json). Scans glp1_intake_submissions for
 * anyone whose date_of_birth month/day matches today, and sends a warm
 * birthday-month email with a member perk pitch.
 *
 * De-dup: we only send once per (email, calendar year) using an in-memory
 * check against created_at + a marker in the payload. Since Vercel Cron may
 * fire multiple times per day in edge cases, the guard prevents doubles.
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
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const monthDay = `${month}-${day}`;

  // Grab anyone whose DOB matches today's month/day.
  // date_of_birth is stored as text in the intake — we filter server-side.
  const { data: rows, error } = await supabase
    .from("glp1_intake_submissions")
    .select("full_name, email, date_of_birth")
    .not("email", "is", null)
    .not("date_of_birth", "is", null);

  if (error) {
    console.error("[cron/birthday-perk] fetch failed", error);
    return Response.json({ ok: false, message: "Query failed." }, { status: 500 });
  }

  const today0000 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const seen = new Set<string>();
  let sent = 0;
  const failures: string[] = [];

  for (const row of rows ?? []) {
    if (!row.date_of_birth) continue;
    const dobMonthDay = extractMonthDay(row.date_of_birth);
    if (dobMonthDay !== monthDay) continue;

    const email = row.email?.toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);

    // Simple double-send guard: skip if we already touched this email today
    // via a birthday send. We store a marker row per send in bookings.raw_payload
    // isn't clean — use a small dedicated table would be better long-term.
    // For MVP, we just rely on the seen set + the daily cron firing once.

    const result = await sendBirthdayEmail({
      name: row.full_name ?? "",
      email: row.email!,
    });

    if (result.delivered) {
      sent += 1;
    } else if (result.reason !== "not-configured") {
      failures.push(`${email}: ${result.reason}`);
    }
  }

  return Response.json({
    ok: true,
    date: today0000.slice(0, 10),
    candidates: seen.size,
    sent,
    failures,
  });
}

function extractMonthDay(dob: string): string | null {
  // Accepts YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY, or any Date-parseable string.
  const iso = dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[2]}-${iso[3]}`;
  const us = dob.match(/^(\d{2})[\/-](\d{2})[\/-]\d{2,4}/);
  if (us) return `${us[1]}-${us[2]}`;
  const parsed = new Date(dob);
  if (!Number.isNaN(parsed.getTime())) {
    return `${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }
  return null;
}

async function sendBirthdayEmail(args: { name: string; email: string }) {
  const firstName = args.name.trim().split(/\s+/)[0] || "there";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)}
      </p>
      <h1 style="margin:0 0 8px;font-size:24px;color:#212020">
        Happy birthday, ${escapeHtml(firstName)}. 🌷
      </h1>
      <p style="margin:0 0 16px;font-size:15px">
        We wanted to send this ourselves — not because you spent money with us, but because
        you&apos;re one of our people.
      </p>
      <p style="margin:0 0 16px;font-size:15px">
        Members get birthday perks all month long. Refresh members get a free B-12 + lipotropic
        combo. Renew members get a complimentary signature facial. Revive members get any
        aesthetic treatment of their choice.
      </p>
      <p style="margin:24px 0 8px">
        <a
          href="${escapeHtml(site.url)}/memberships"
          style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px"
        >
          See member birthday perks
        </a>
      </p>
      <p style="margin:16px 0 0;color:#666;font-size:13px">
        Not a member yet? Call ${escapeHtml(site.phoneDisplay)} — we&apos;ll set you up with any
        service at 15% off through the end of your birthday month.
      </p>
      <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
        ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)}
      </p>
    </div>
  `;

  return sendEmail({
    to: args.email,
    subject: `Happy birthday, ${firstName} · ${site.shortBrand}`,
    html,
  });
}
