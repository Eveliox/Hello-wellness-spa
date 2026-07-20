/**
 * Thin Twilio SMS wrapper.
 *
 * Env vars (all optional — when unset, sendSms() returns a "not configured"
 * result and callers fall back to giving the team a manual copy/paste link):
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM_PHONE   E.164 format, e.g. +17865551234
 *
 * We call Twilio's REST API directly (no SDK) to keep the bundle small.
 */

export type SmsResult =
  | { ok: true; sid: string }
  | { ok: false; reason: "not_configured" }
  | { ok: false; reason: "invalid_phone" }
  | { ok: false; reason: "twilio_error"; status: number; message: string };

/**
 * Normalize a US phone number to E.164 format (+1XXXXXXXXXX).
 * Returns null when the input can't be interpreted as a valid US phone.
 */
export function normalizeUsPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

export async function sendSms({
  to,
  body,
}: {
  to: string;
  body: string;
}): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_FROM_PHONE;

  if (!accountSid || !authToken || !fromPhone) {
    return { ok: false, reason: "not_configured" };
  }

  const normalizedTo = normalizeUsPhone(to);
  if (!normalizedTo) return { ok: false, reason: "invalid_phone" };

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams({
    To: normalizedTo,
    From: fromPhone,
    Body: body,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    let message = "Twilio request failed";
    try {
      const errBody = (await res.json()) as { message?: string };
      if (errBody?.message) message = errBody.message;
    } catch {
      // ignore JSON parse error
    }
    return { ok: false, reason: "twilio_error", status: res.status, message };
  }

  const data = (await res.json()) as { sid?: string };
  return { ok: true, sid: data.sid ?? "unknown" };
}
