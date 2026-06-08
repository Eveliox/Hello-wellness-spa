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

  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    return Response.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
  }

  return Response.json({ ok: true });
}
