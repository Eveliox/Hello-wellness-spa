import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { sendSms, normalizeUsPhone } from "@/lib/twilio";
import { site } from "@/content/site";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const bodySchema = z.object({
  businessType: z.enum(["trainer", "gym", "studio", "other"]),
  businessName: z.string().min(1).max(160),
  ownerName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(40),
  city: z.string().min(1).max(120),
  website: z.string().max(300).optional().or(z.literal("").transform(() => undefined)),
  instagram: z.string().max(120).optional().or(z.literal("").transform(() => undefined)),
  clientCountRange: z.string().max(20).optional(),
  motivation: z.string().max(2000).optional().or(z.literal("").transform(() => undefined)),
  referralSource: z.string().max(200).optional().or(z.literal("").transform(() => undefined)),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "referral");
  if (!rl.allowed) return rateLimitResponse(rl);

  const json: unknown = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Please fill out all required fields." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Applications not configured." }, { status: 503 });
  }

  const supabase = getSupabase();
  const { data: inserted, error: insertErr } = await supabase
    .from("partner_applications")
    .insert({
      business_type: parsed.data.businessType,
      business_name: parsed.data.businessName,
      owner_name: parsed.data.ownerName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      website: parsed.data.website ?? null,
      instagram: parsed.data.instagram ?? null,
      client_count_range: parsed.data.clientCountRange ?? null,
      motivation: parsed.data.motivation ?? null,
      referral_source: parsed.data.referralSource ?? null,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error("[partners/apply] insert failed", insertErr);
    return Response.json(
      { ok: false, message: "Could not save application. Please try again." },
      { status: 500 },
    );
  }

  void notifyTeam({
    id: inserted.id as string,
    businessType: parsed.data.businessType,
    businessName: parsed.data.businessName,
    ownerName: parsed.data.ownerName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city,
    website: parsed.data.website,
    instagram: parsed.data.instagram,
    clientCountRange: parsed.data.clientCountRange,
    motivation: parsed.data.motivation,
    referralSource: parsed.data.referralSource,
  }).catch((err) => console.error("[partners/apply] team notify threw", err));

  void notifyApplicant({
    ownerName: parsed.data.ownerName,
    email: parsed.data.email,
    businessName: parsed.data.businessName,
  }).catch((err) => console.error("[partners/apply] applicant notify threw", err));

  return Response.json({ ok: true });
}

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  trainer: "Personal trainer",
  gym: "Gym owner",
  studio: "Studio owner",
  other: "Other wellness pro",
};

async function notifyTeam(args: {
  id: string;
  businessType: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
  instagram?: string;
  clientCountRange?: string;
  motivation?: string;
  referralSource?: string;
}) {
  const notifyEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const notifyPhone = process.env.TEAM_NOTIFICATION_PHONE;

  if (notifyEmail) {
    const rows = [
      ["Business", `${escapeHtml(args.businessName)} (${escapeHtml(BUSINESS_TYPE_LABELS[args.businessType] ?? args.businessType)})`],
      ["Owner", `${escapeHtml(args.ownerName)} · <a href="mailto:${escapeHtml(args.email)}">${escapeHtml(args.email)}</a> · <a href="tel:${escapeHtml(args.phone)}">${escapeHtml(args.phone)}</a>`],
      ["City", escapeHtml(args.city)],
      ["Client base", escapeHtml(args.clientCountRange ?? "—")],
      ["Website", args.website ? `<a href="${escapeHtml(args.website)}">${escapeHtml(args.website)}</a>` : "—"],
      ["Instagram", args.instagram ? escapeHtml(args.instagram) : "—"],
      ["Heard from", args.referralSource ? escapeHtml(args.referralSource) : "—"],
    ];
    const tableRows = rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:130px">${label}</td><td style="padding:6px 10px;border:1px solid #eee">${value}</td></tr>`,
      )
      .join("");
    const motivationBlock = args.motivation
      ? `<div style="margin:16px 0 0;padding:12px;background:#faf8f6;border:1px solid #eee;border-radius:8px"><p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">Their pitch</p><p style="margin:0;white-space:pre-wrap">${escapeHtml(args.motivation)}</p></div>`
      : "";

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;color:#212020;line-height:1.5">
        <h2 style="margin:0 0 4px">New partner application</h2>
        <p style="margin:0 0 16px;color:#555">Review in admin → Partner applications.</p>
        <table style="width:100%;border-collapse:collapse">${tableRows}</table>
        ${motivationBlock}
        <p style="margin:20px 0 0">
          <a href="${escapeHtml(site.url)}/admin" style="display:inline-block;padding:10px 20px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">Open admin</a>
        </p>
      </div>
    `;

    await sendEmail({
      to: notifyEmail,
      subject: `New partner application · ${args.businessName}`,
      html,
    });
  }

  if (notifyPhone) {
    const normalized = normalizeUsPhone(notifyPhone);
    if (normalized) {
      await sendSms({
        to: normalized,
        body: `New partner application: ${args.businessName} (${args.ownerName}, ${args.city}). Review at ${site.url}/admin`,
      });
    }
  }
}

async function notifyApplicant(args: {
  ownerName: string;
  email: string;
  businessName: string;
}) {
  const firstName = args.ownerName.trim().split(/\s+/)[0] || "there";
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)} Partners
      </p>
      <h1 style="margin:0 0 8px;font-size:22px">Thanks, ${escapeHtml(firstName)}.</h1>
      <p style="margin:0 0 16px;font-size:15px">
        We received your application for ${escapeHtml(args.businessName)}. Our team reviews every
        partner application personally — you can expect a reply within one business day, usually
        the same day.
      </p>
      <p style="margin:0 0 16px;font-size:15px">
        If we approve you, the next email will include your unique referral code, a link to set
        up your partner dashboard, and your starter kit with printable cards and digital assets.
      </p>
      <p style="margin:24px 0 0;color:#666;font-size:13px">
        Questions in the meantime? Reply to this email or text
        <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#212020;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>.
      </p>
      <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
        ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)}
      </p>
    </div>
  `;

  await sendEmail({
    to: args.email,
    subject: `Application received · ${site.shortBrand} Partners`,
    html,
  });
}
