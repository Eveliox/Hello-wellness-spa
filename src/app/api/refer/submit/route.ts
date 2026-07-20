import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { sendSms, normalizeUsPhone } from "@/lib/twilio";
import { site } from "@/content/site";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const bodySchema = z
  .object({
    referrerName: z.string().min(1).max(120),
    referrerEmail: z.string().email().max(200),
    referrerPhone: z.string().max(40).optional(),
    friendName: z.string().min(1).max(120),
    friendEmail: z.string().email().max(200).optional().or(z.literal("").transform(() => undefined)),
    friendPhone: z.string().max(40).optional().or(z.literal("").transform(() => undefined)),
  })
  .refine((data) => Boolean(data.friendEmail || data.friendPhone), {
    message: "Friend email or phone required.",
    path: ["friendEmail"],
  });

function generateCode(name: string): string {
  const first = name.trim().split(/\s+/)[0]?.toUpperCase().slice(0, 8) || "FRIEND";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${first}-${suffix}`;
}

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "referral");
  if (!rl.allowed) return rateLimitResponse(rl);

  const json: unknown = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Please fill out all required fields." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Referrals not configured." }, { status: 503 });
  }

  const supabase = getSupabase();

  // Generate code; retry once if collision (extremely rare with 4-char suffix).
  let code = generateCode(parsed.data.referrerName);
  const { error: insertErr } = await supabase.from("referrals").insert({
    code,
    referrer_name: parsed.data.referrerName,
    referrer_email: parsed.data.referrerEmail,
    referrer_phone: parsed.data.referrerPhone ?? null,
    friend_name: parsed.data.friendName,
    friend_email: parsed.data.friendEmail ?? null,
    friend_phone: parsed.data.friendPhone ?? null,
  });

  if (insertErr) {
    // Duplicate code retry
    if (insertErr.code === "23505") {
      code = generateCode(parsed.data.referrerName);
      const { error: retryErr } = await supabase.from("referrals").insert({
        code,
        referrer_name: parsed.data.referrerName,
        referrer_email: parsed.data.referrerEmail,
        referrer_phone: parsed.data.referrerPhone ?? null,
        friend_name: parsed.data.friendName,
        friend_email: parsed.data.friendEmail ?? null,
        friend_phone: parsed.data.friendPhone ?? null,
      });
      if (retryErr) {
        console.error("[refer/submit] insert retry failed", retryErr);
        return Response.json(
          { ok: false, message: "Could not save referral. Please try again." },
          { status: 500 },
        );
      }
    } else {
      console.error("[refer/submit] insert failed", insertErr);
      return Response.json(
        { ok: false, message: "Could not save referral. Please try again." },
        { status: 500 },
      );
    }
  }

  // Fire-and-forget: notify friend, notify referrer, notify team.
  void notifyFriend({
    friendName: parsed.data.friendName,
    friendEmail: parsed.data.friendEmail,
    friendPhone: parsed.data.friendPhone,
    referrerName: parsed.data.referrerName,
    code,
  }).catch((err) => console.error("[refer/submit] friend notify threw", err));

  void notifyReferrer({
    referrerName: parsed.data.referrerName,
    referrerEmail: parsed.data.referrerEmail,
    friendName: parsed.data.friendName,
    code,
  }).catch((err) => console.error("[refer/submit] referrer notify threw", err));

  void notifyTeam({
    referrerName: parsed.data.referrerName,
    referrerEmail: parsed.data.referrerEmail,
    friendName: parsed.data.friendName,
    friendEmail: parsed.data.friendEmail,
    friendPhone: parsed.data.friendPhone,
    code,
  }).catch((err) => console.error("[refer/submit] team notify threw", err));

  return Response.json({ ok: true, code });
}

async function notifyFriend(args: {
  friendName: string;
  friendEmail: string | undefined;
  friendPhone: string | undefined;
  referrerName: string;
  code: string;
}) {
  const firstName = args.friendName.trim().split(/\s+/)[0] || "there";
  const referrerFirst = args.referrerName.trim().split(/\s+/)[0] || "a friend";

  if (args.friendEmail) {
    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
        <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
          ${escapeHtml(site.shortBrand)}
        </p>
        <h1 style="margin:0 0 8px;font-size:22px;color:#212020">
          Hi ${escapeHtml(firstName)} — ${escapeHtml(referrerFirst)} sent you a $50 credit.
        </h1>
        <p style="margin:0 0 16px;font-size:15px">
          They vouched for you at ${escapeHtml(site.name)}. Here&apos;s how it works: book your
          first visit, mention the code below, and we&apos;ll credit both of you $50 toward your
          next service.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:8px;background:#faf8f6;text-align:center">
          <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
            Your referral code
          </p>
          <p style="margin:8px 0 0;font-family:'SFMono-Regular',Consolas,monospace;font-size:24px;font-weight:700;color:#212020;letter-spacing:2px">
            ${escapeHtml(args.code)}
          </p>
        </div>
        <p style="margin:24px 0 8px">
          <a
            href="${escapeHtml(site.url)}/services"
            style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px"
          >
            See what we offer
          </a>
        </p>
        <p style="margin:16px 0 0;color:#666;font-size:13px">
          Questions? Reply here or text us at
          <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#212020;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>.
        </p>
        <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
          ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)}
        </p>
      </div>
    `;
    await sendEmail({
      to: args.friendEmail,
      subject: `${referrerFirst} sent you $50 · ${site.shortBrand}`,
      html,
    });
  }

  if (args.friendPhone) {
    const normalized = normalizeUsPhone(args.friendPhone);
    if (normalized) {
      await sendSms({
        to: normalized,
        body: `Hi ${firstName}! ${referrerFirst} referred you to ${site.shortBrand}. Book your first visit, mention code ${args.code}, and you both get $50 off. ${site.url}/services`,
      });
    }
  }
}

async function notifyReferrer(args: {
  referrerName: string;
  referrerEmail: string;
  friendName: string;
  code: string;
}) {
  const firstName = args.referrerName.trim().split(/\s+/)[0] || "there";
  const friendFirst = args.friendName.trim().split(/\s+/)[0] || "your friend";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)}
      </p>
      <h1 style="margin:0 0 8px;font-size:22px;color:#212020">Thanks, ${escapeHtml(firstName)}.</h1>
      <p style="margin:0 0 16px;font-size:15px">
        We just sent ${escapeHtml(friendFirst)} their $50 credit and a link to book. When they come
        in, your $50 will land within 48 hours — no need to remember anything.
      </p>
      <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:8px;background:#faf8f6">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-weight:600">
          Referral code (yours to save)
        </p>
        <p style="margin:8px 0 0;font-family:'SFMono-Regular',Consolas,monospace;font-size:18px;font-weight:700">
          ${escapeHtml(args.code)}
        </p>
      </div>
      <p style="margin:24px 0 0;color:#666;font-size:13px">
        Want to refer someone else?
        <a href="${escapeHtml(site.url)}/refer" style="color:#212020;font-weight:600">Send another →</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: args.referrerEmail,
    subject: `Thanks for the referral · ${site.shortBrand}`,
    html,
  });
}

async function notifyTeam(args: {
  referrerName: string;
  referrerEmail: string;
  friendName: string;
  friendEmail: string | undefined;
  friendPhone: string | undefined;
  code: string;
}) {
  const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!notify) return;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
      <h2 style="margin:0 0 8px">New referral submitted</h2>
      <p style="margin:0 0 16px;color:#555">
        When the friend comes in, credit both $50. Match on the code at checkout.
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:180px">Referrer</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(args.referrerName)} · ${escapeHtml(args.referrerEmail)}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Friend</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(args.friendName)} · ${args.friendEmail ? escapeHtml(args.friendEmail) : "—"} · ${args.friendPhone ? escapeHtml(args.friendPhone) : "—"}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600">Code</td><td style="padding:6px 10px;border:1px solid #eee;font-family:monospace;font-weight:700">${escapeHtml(args.code)}</td></tr>
      </table>
    </div>
  `;

  await sendEmail({
    to: notify,
    subject: `New referral · ${args.referrerName} → ${args.friendName}`,
    html,
  });
}
