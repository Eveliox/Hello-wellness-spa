import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter your password."),
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

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error || !authData.user) {
    return Response.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
  }

  // Confirm this auth user is actually a partner — otherwise sign them out so
  // patient accounts can't accidentally reach the partner dashboard.
  const { data: partner } = await supabase
    .from("partners")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (!partner) {
    await supabase.auth.signOut();
    return Response.json(
      {
        ok: false,
        message:
          "This email isn't linked to a partner account. If you applied and were approved, use the signup link from your welcome email first.",
      },
      { status: 403 },
    );
  }

  return Response.json({ ok: true });
}
