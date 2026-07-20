import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Container } from "@/components/ui/container";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { ReviewRequestForm } from "@/components/admin/review-request-form";
import { PartnerApplicationsTable } from "@/components/admin/partner-applications-table";
import type { PartnerApplication } from "@/components/admin/partner-applications-table";

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
  const [submissionsRes, applicationsRes] = await Promise.all([
    supabase.from("intake_submissions").select("*").order("submitted_at", { ascending: false }),
    supabase
      .from("partner_applications")
      .select(
        "id, created_at, business_type, business_name, owner_name, email, phone, city, website, instagram, client_count_range, motivation, referral_source, status, admin_notes, reviewed_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (submissionsRes.error) {
    console.error("[admin] failed to fetch submissions", submissionsRes.error);
  }
  if (applicationsRes.error) {
    console.error("[admin] failed to fetch partner applications", applicationsRes.error);
  }

  return (
    <main className="min-h-screen bg-surface py-10">
      <Container className="space-y-8">
        <ReviewRequestForm />
        <PartnerApplicationsTable
          initialData={(applicationsRes.data as PartnerApplication[] | null) ?? []}
        />
        <SubmissionsTable initialData={submissionsRes.data ?? []} />
      </Container>
    </main>
  );
}
