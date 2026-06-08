import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name.").max(120),
  phone: z.string().max(40).optional(),
  newPassword: z.string().min(8).optional().or(z.literal("")),
});

export async function POST(request: Request) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ ok: false, message: "Not signed in." }, { status: 401 });
  }

  const { error: profileError } = await supabase
    .from("patient_profiles")
    .update({
      full_name: payload.fullName,
      phone: payload.phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return Response.json({ ok: false, message: profileError.message }, { status: 400 });
  }

  if (payload.newPassword && payload.newPassword.length >= 8) {
    const { error: pwError } = await supabase.auth.updateUser({
      password: payload.newPassword,
    });
    if (pwError) {
      return Response.json({ ok: false, message: pwError.message }, { status: 400 });
    }
  }

  return Response.json({ ok: true });
}
