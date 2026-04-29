import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Container } from "@/components/ui/container";
import { SubmissionsTable } from "@/components/admin/submissions-table";

export const metadata: Metadata = {
  title: "Admin | Hello You Wellness",
  robots: { index: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !session || session.value !== adminPassword) {
    redirect("/admin/login");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return (
      <main className="min-h-screen bg-surface py-10">
        <Container>
          <p className="text-sm text-[#C0392B]">
            Database not configured — add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to your Vercel project environment variables, then redeploy.
          </p>
        </Container>
      </main>
    );
  }

  const supabase = getSupabase();
  const { data: submissions, error } = await supabase
    .from("intake_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[admin] failed to fetch submissions", error);
  }

  return (
    <main className="min-h-screen bg-surface py-10">
      <Container>
        <SubmissionsTable initialData={submissions ?? []} />
      </Container>
    </main>
  );
}
