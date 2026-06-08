import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/content/site";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullName: z.string().min(2, "Please enter your full name.").max(120),
  phone: z.string().max(40).optional(),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "portalAuth");
  if (!rl.allowed) return rateLimitResponse(rl);

  let payload;
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
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

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${site.url}/portal`,
      data: {
        full_name: payload.fullName,
      },
    },
  });

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }

  // Supabase returns a user even if email confirmation is required. We only
  // create the profile row when we actually have a user id; the auth user
  // exists either way and the row is keyed to auth.users(id).
  if (data.user) {
    const { error: profileError } = await supabase.from("patient_profiles").upsert(
      {
        id: data.user.id,
        full_name: payload.fullName,
        phone: payload.phone ?? null,
      },
      { onConflict: "id" },
    );
    if (profileError) {
      console.error("[portal/signup] profile upsert failed", profileError);
    }

    // Claim any prior intake submissions submitted with this email.
    const { error: linkError } = await supabase.rpc("link_intakes_to_patient", {
      p_user_id: data.user.id,
      p_email: payload.email,
    });
    if (linkError) {
      console.error("[portal/signup] link_intakes_to_patient failed", linkError);
    }
  }

  // If session is null, email confirmation is required before the user can sign in.
  return Response.json({
    ok: true,
    needsConfirmation: !data.session,
  });
}
