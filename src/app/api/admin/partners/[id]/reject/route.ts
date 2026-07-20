import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  notes: z.string().max(2000).optional(),
});

export async function POST(request: Request, context: RouteContext) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!adminPassword || !session || session.value !== adminPassword) {
    return Response.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ ok: false, message: "Missing application id." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  const notes = parsed.success ? parsed.data.notes : undefined;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return Response.json({ ok: false, message: "Database not configured." }, { status: 503 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("partner_applications")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: "admin",
      admin_notes: notes ?? null,
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/partners/reject] update failed", error);
    return Response.json({ ok: false, message: "Could not update application." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
