import crypto from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

/**
 * Cal.com booking webhook receiver.
 *
 * Setup in Cal.com: Settings → Developer → Webhooks → New webhook
 *   URL: https://helloyouwellness.com/api/webhooks/cal-com
 *   Secret: match CAL_WEBHOOK_SECRET env var
 *   Subscribe: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED
 *
 * On BOOKING_CREATED we (a) insert into public.bookings, (b) send our branded
 * intake-nudge email (Cal.com's built-in email already handles the confirmation,
 * so ours focuses on next steps + intake link).
 *
 * The signature check is skipped when CAL_WEBHOOK_SECRET is unset — makes local
 * dev easy but you MUST set it before pointing production Cal.com at this URL.
 */

type CalPayload = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    bookingId?: string | number;
    startTime?: string;
    endTime?: string;
    title?: string;
    eventTitle?: string;
    eventType?: { title?: string };
    attendees?: Array<{ name?: string; email?: string; phoneNumber?: string }>;
    organizer?: { email?: string; name?: string };
    cancellationReason?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const signature = request.headers.get("x-cal-signature-256");
    if (!signature || !verifySignature(rawBody, signature, secret)) {
      return Response.json({ ok: false, message: "Invalid signature." }, { status: 401 });
    }
  }

  let payload: CalPayload;
  try {
    payload = JSON.parse(rawBody) as CalPayload;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON." }, { status: 400 });
  }

  const event = payload.triggerEvent ?? "";
  const p = payload.payload ?? {};
  const calBookingId = String(p.uid ?? p.bookingId ?? "");
  if (!calBookingId) {
    return Response.json({ ok: false, message: "Missing booking id." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Database not configured." }, { status: 503 });
  }
  const supabase = getSupabase();

  const attendee = p.attendees?.[0];
  const startIso = p.startTime ?? null;
  const endIso = p.endTime ?? null;
  const service = p.eventType?.title ?? p.eventTitle ?? p.title ?? null;

  if (event === "BOOKING_CREATED") {
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("cal_booking_id", calBookingId)
      .maybeSingle();

    if (existing) {
      // Idempotent — Cal.com occasionally retries webhooks.
      return Response.json({ ok: true, deduped: true });
    }

    const { error: insertErr } = await supabase.from("bookings").insert({
      cal_booking_id: calBookingId,
      booking_at: startIso ?? new Date().toISOString(),
      duration_min:
        startIso && endIso
          ? Math.max(1, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000))
          : null,
      service,
      attendee_name: attendee?.name ?? null,
      attendee_email: attendee?.email ?? null,
      attendee_phone: attendee?.phoneNumber ?? null,
      status: "confirmed",
      raw_payload: payload,
    });

    if (insertErr) {
      console.error("[cal-com] insert failed", insertErr);
      return Response.json({ ok: false, message: "Insert failed." }, { status: 500 });
    }

    if (attendee?.email) {
      const sentAt = await sendBookingIntakeNudge({
        name: attendee.name ?? "",
        email: attendee.email,
        service: service ?? "",
        startIso,
      });
      if (sentAt) {
        await supabase
          .from("bookings")
          .update({ our_confirmation_sent_at: sentAt })
          .eq("cal_booking_id", calBookingId);
      }
    }

    return Response.json({ ok: true, action: "created" });
  }

  if (event === "BOOKING_CANCELLED" || event === "BOOKING_REJECTED") {
    await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("cal_booking_id", calBookingId);
    return Response.json({ ok: true, action: "cancelled" });
  }

  if (event === "BOOKING_RESCHEDULED") {
    await supabase
      .from("bookings")
      .update({ booking_at: startIso ?? new Date().toISOString(), raw_payload: payload })
      .eq("cal_booking_id", calBookingId);
    return Response.json({ ok: true, action: "rescheduled" });
  }

  // Unknown event — accept and ignore.
  return Response.json({ ok: true, action: "ignored" });
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const clean = signature.replace(/^sha256=/, "");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(clean, "hex"));
  } catch {
    return false;
  }
}

async function sendBookingIntakeNudge(args: {
  name: string;
  email: string;
  service: string;
  startIso: string | null;
}): Promise<string | null> {
  const firstName = args.name.trim().split(/\s+/)[0] || "there";
  const timeLabel = args.startIso
    ? new Date(args.startIso).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "your upcoming visit";

  const intakeUrl = `${site.url}/intake?service=${encodeURIComponent(slugifyService(args.service))}&at=${encodeURIComponent(args.startIso ?? "")}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#212020;line-height:1.6">
      <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.15em;text-transform:uppercase;font-weight:600">
        ${escapeHtml(site.shortBrand)}
      </p>
      <h1 style="margin:0 0 8px;font-size:22px;color:#212020">
        See you on ${escapeHtml(timeLabel)}, ${escapeHtml(firstName)}.
      </h1>
      <p style="margin:0 0 16px;font-size:15px">
        Your booking is confirmed. Two quick things to save us both time when you arrive:
      </p>
      <ol style="margin:0 0 20px;padding-left:20px;font-size:15px">
        <li style="margin-bottom:8px">
          <strong>Finish your patient intake</strong> — takes 3 minutes and lets your provider start
          on time.
        </li>
        <li style="margin-bottom:8px">
          <strong>Arrive 10 minutes early</strong> so we can review anything the intake surfaced.
        </li>
      </ol>
      <p style="margin:24px 0 8px">
        <a
          href="${escapeHtml(intakeUrl)}"
          style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px"
        >
          Finish my intake →
        </a>
      </p>
      <p style="margin:24px 0 8px;font-size:14px;color:#555">
        <strong>Need to reschedule?</strong> Reply to this email or call
        <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#212020;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>
        — no fees, we&apos;ll find another time.
      </p>
      <p style="margin:24px 0 0;color:#999;font-size:11px;line-height:1.5">
        ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)} ${escapeHtml(site.address.zip)}
      </p>
    </div>
  `;

  const result = await sendEmail({
    to: args.email,
    subject: `See you ${args.startIso ? new Date(args.startIso).toLocaleDateString("en-US", { weekday: "long" }) : "soon"} · ${site.shortBrand}`,
    html,
  });

  return result.delivered ? new Date().toISOString() : null;
}

function slugifyService(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("weight")) return "assisted-weight-loss";
  if (lower.includes("iv")) return "iv-therapy";
  if (lower.includes("aesthet") || lower.includes("botox") || lower.includes("filler")) return "aesthetics-cosmetics";
  if (lower.includes("hormone") || lower.includes("trt")) return "hormone-therapy";
  if (lower.includes("peptide")) return "peptide-therapy";
  return "general";
}
