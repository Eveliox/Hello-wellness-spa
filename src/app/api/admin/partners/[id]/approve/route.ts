import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase";
import { generatePartnerReferralCode } from "@/lib/partners";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!adminPassword || !session || session.value !== adminPassword) {
    return Response.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ ok: false, message: "Missing application id." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Database not configured." }, { status: 503 });
  }

  const supabase = getSupabase();

  const { data: app, error: fetchErr } = await supabase
    .from("partner_applications")
    .select("id, business_name, owner_name, email, phone, city, website, instagram, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !app) {
    return Response.json({ ok: false, message: "Application not found." }, { status: 404 });
  }
  if (app.status === "approved") {
    return Response.json({ ok: false, message: "Application already approved." }, { status: 409 });
  }

  const { data: existingPartner } = await supabase
    .from("partners")
    .select("id")
    .ilike("email", app.email as string)
    .maybeSingle();
  if (existingPartner) {
    return Response.json(
      { ok: false, message: "A partner with this email already exists." },
      { status: 409 },
    );
  }

  let referralCode = generatePartnerReferralCode(app.business_name as string);
  let insertErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabase.from("partners").insert({
      application_id: app.id,
      referral_code: referralCode,
      business_name: app.business_name,
      owner_name: app.owner_name,
      email: app.email,
      phone: app.phone,
      city: app.city,
      website: app.website,
      instagram: app.instagram,
      welcome_email_sent_at: new Date().toISOString(),
    });
    if (!error) {
      insertErr = null;
      break;
    }
    if (error.code === "23505") {
      referralCode = generatePartnerReferralCode(app.business_name as string);
      insertErr = error;
      continue;
    }
    insertErr = error;
    break;
  }

  if (insertErr) {
    console.error("[admin/partners/approve] insert failed", insertErr);
    return Response.json({ ok: false, message: "Could not create partner." }, { status: 500 });
  }

  const { error: updateErr } = await supabase
    .from("partner_applications")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: "admin",
    })
    .eq("id", app.id);
  if (updateErr) {
    console.error("[admin/partners/approve] status update failed", updateErr);
  }

  void sendWelcomeEmail({
    ownerName: app.owner_name as string,
    email: app.email as string,
    businessName: app.business_name as string,
    referralCode,
  }).catch((err) => console.error("[admin/partners/approve] welcome email threw", err));

  return Response.json({ ok: true, referralCode });
}

async function sendWelcomeEmail(args: {
  ownerName: string;
  email: string;
  businessName: string;
  referralCode: string;
}) {
  const firstName = args.ownerName.trim().split(/\s+/)[0] || "there";
  const signupUrl = `${site.url}/partners/portal/signup?email=${encodeURIComponent(args.email)}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)} Partners
      </p>
      <h1 style="margin:0 0 8px;font-size:22px">Welcome aboard, ${escapeHtml(firstName)}.</h1>
      <p style="margin:0 0 16px;font-size:15px">
        You&apos;re officially a Hello You Wellness partner. Below is everything you need to start
        sending clients — save this email.
      </p>
      <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:8px;background:#faf8f6;text-align:center">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
          Your referral code
        </p>
        <p style="margin:8px 0 0;font-family:'SFMono-Regular',Consolas,monospace;font-size:22px;font-weight:700;color:#212020;letter-spacing:1px">
          ${escapeHtml(args.referralCode)}
        </p>
      </div>
      <p style="margin:16px 0;font-size:15px">
        <strong>How to use it:</strong> Tell a client to mention this code when they book or at
        intake. Once they complete their first visit, you earn 15% of what they spent — paid via
        Zelle or Venmo by the 10th of the following month.
      </p>
      <p style="margin:24px 0">
        <a
          href="${escapeHtml(signupUrl)}"
          style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px"
        >
          Set up your partner dashboard
        </a>
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:#555">
        The dashboard shows your monthly referral counts, earnings, and pending payouts. Set your
        password once and you&apos;re in.
      </p>
      <p style="margin:16px 0 0;color:#555;font-size:13px">
        Your starter kit — printable cards, digital assets, and the &quot;Recommended by Hello
        You&quot; window sticker — is on its way. Reply here if you want them by any specific date.
      </p>
      <p style="margin:24px 0 0;color:#666;font-size:13px">
        Questions? Reply to this email or text
        <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#212020;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>.
      </p>
      <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
        ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)}
      </p>
    </div>
  `;

  await sendEmail({
    to: args.email,
    subject: `You're in — welcome to ${site.shortBrand} Partners`,
    html,
  });
}
