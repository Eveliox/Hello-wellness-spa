import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { getSupabase } from "@/lib/supabase";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/content/site";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "portalAuth");
  if (!rl.allowed) return rateLimitResponse(rl);

  let payload;
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." },
        { status: 400 },
      );
    }
    payload = parsed.data;
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Gate signup: this email MUST match an approved partner row that hasn't
  // been linked to an auth user yet. We use the service-role client for the
  // lookup so it works even before the user is signed in.
  const admin = getSupabase();
  const { data: partner, error: lookupErr } = await admin
    .from("partners")
    .select("id, auth_user_id, status")
    .ilike("email", payload.email)
    .maybeSingle();

  if (lookupErr) {
    console.error("[partners/portal/signup] lookup failed", lookupErr);
    return Response.json({ ok: false, message: "Could not verify your account." }, { status: 500 });
  }
  if (!partner) {
    return Response.json(
      {
        ok: false,
        message:
          "We couldn't find a partner account for this email. Applications must be approved before you can set up a dashboard.",
      },
      { status: 403 },
    );
  }
  if (partner.status === "terminated") {
    return Response.json(
      { ok: false, message: "This partner account has been closed. Please reach out if this is a mistake." },
      { status: 403 },
    );
  }
  if (partner.auth_user_id) {
    return Response.json(
      {
        ok: false,
        message:
          "An account already exists for this email. Sign in instead, or use the reset password link if you've forgotten it.",
      },
      { status: 409 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${site.url}/partners/portal`,
    },
  });

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }

  if (data.user) {
    const { error: linkErr } = await admin
      .from("partners")
      .update({ auth_user_id: data.user.id })
      .eq("id", partner.id);
    if (linkErr) {
      console.error("[partners/portal/signup] link auth_user_id failed", linkErr);
    }
  }

  return Response.json({
    ok: true,
    needsConfirmation: !data.session,
  });
}
