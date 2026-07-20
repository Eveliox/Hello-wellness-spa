import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { sendSms, normalizeUsPhone } from "@/lib/twilio";
import { site } from "@/content/site";

const bodySchema = z.object({
  patientName: z.string().min(1).max(120),
  patientPhone: z.string().min(7).max(30),
  patientEmail: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  service: z.string().max(60).optional(),
  appointmentAt: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  // Admin auth check — same pattern as the rest of /api/admin/*
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!adminPassword || !session || session.value !== adminPassword) {
    return Response.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  const json: unknown = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const normalizedPhone = normalizeUsPhone(parsed.data.patientPhone);
  if (!normalizedPhone) {
    return Response.json({ ok: false, message: "Phone number is not valid US format." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Database not configured." }, { status: 503 });
  }

  const supabase = getSupabase();
  const { data: inserted, error: insertErr } = await supabase
    .from("review_requests")
    .insert({
      patient_name: parsed.data.patientName,
      patient_phone: normalizedPhone,
      patient_email: parsed.data.patientEmail ?? null,
      service: parsed.data.service ?? null,
      appointment_at: parsed.data.appointmentAt ?? null,
    })
    .select("token")
    .single();

  if (insertErr || !inserted) {
    console.error("[admin/send-review-sms] insert failed", insertErr);
    return Response.json({ ok: false, message: "Could not create review request." }, { status: 500 });
  }

  const link = `${site.url}/feedback/${inserted.token}`;
  const firstName = parsed.data.patientName.trim().split(/\s+/)[0] || "there";
  const body = `Hi ${firstName}, thanks for visiting ${site.shortBrand}! We'd love your feedback — takes 30 seconds: ${link}\n\nReply STOP to opt out.`;

  const sms = await sendSms({ to: normalizedPhone, body });

  const smsStatus =
    sms.ok ? "sent" : sms.reason === "not_configured" ? "not_configured" : sms.reason;

  if (sms.ok || sms.reason === "not_configured") {
    await supabase
      .from("review_requests")
      .update({
        sms_sent_at: sms.ok ? new Date().toISOString() : null,
        sms_provider: sms.ok ? "twilio" : null,
        sms_status: smsStatus,
      })
      .eq("token", inserted.token);
  } else {
    await supabase
      .from("review_requests")
      .update({ sms_status: smsStatus })
      .eq("token", inserted.token);
  }

  if (sms.ok) {
    return Response.json({ ok: true, token: inserted.token, link, smsSent: true });
  }
  if (sms.reason === "not_configured") {
    return Response.json({
      ok: true,
      token: inserted.token,
      link,
      smsSent: false,
      message:
        "Twilio not configured — SMS was not sent. Copy the link below and text or WhatsApp the patient manually.",
    });
  }
  // twilio_error or invalid_phone — link is still valid, share manually
  return Response.json(
    {
      ok: true,
      token: inserted.token,
      link,
      smsSent: false,
      message: `SMS failed (${"message" in sms ? sms.message : sms.reason}). Copy the link and send it manually.`,
    },
    { status: 200 },
  );
}
