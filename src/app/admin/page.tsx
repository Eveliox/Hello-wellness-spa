import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@/components/ui/container";
import { SubmissionsTable } from "@/components/admin/submissions-table";

export const metadata: Metadata = {
  title: "Admin | Hello You Wellness",
  robots: { index: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

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
