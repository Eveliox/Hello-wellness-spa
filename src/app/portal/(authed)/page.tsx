import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requirePatient } from "@/lib/portal-auth";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export const metadata = {
  title: "Portal · Dashboard | Hello You Wellness",
  robots: { index: false },
};

export default async function PortalDashboard() {
  const patient = await requirePatient();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [standardRes, glp1Res] = await Promise.all([
    supabase
      .from("intake_submissions")
      .select("id", { count: "exact", head: true })
      .eq("patient_user_id", patient.userId),
    supabase
      .from("glp1_intake_submissions")
      .select("id", { count: "exact", head: true })
      .eq("patient_user_id", patient.userId),
  ]);

  const intakesCount = (standardRes.count ?? 0) + (glp1Res.count ?? 0);

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Welcome to your portal</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Manage your intake forms, update your contact info, and rebook your next visit. Reach the
        clinic anytime at{" "}
        <a href={`tel:${site.phoneTel}`} className="font-semibold text-ink underline-offset-2 hover:underline">
          {site.phoneDisplay}
        </a>
        .
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">My intakes</p>
          <p className="mt-2 font-display text-3xl text-ink">{intakesCount}</p>
          <p className="mt-1 text-xs text-faint">
            {intakesCount === 0
              ? "No submissions yet. Start your first intake before your visit."
              : intakesCount === 1
                ? "1 form on file"
                : `${intakesCount} forms on file`}
          </p>
          <div className="mt-4">
            <Link
              href="/portal/intakes"
              className="text-sm font-semibold text-ink underline-offset-2 hover:underline"
            >
              View intakes →
            </Link>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Next visit</p>
          <p className="mt-2 font-display text-3xl text-ink">—</p>
          <p className="mt-1 text-xs text-faint">
            Appointment integration coming soon. For now, manage bookings on Cal.com.
          </p>
          <div className="mt-4">
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-ink underline-offset-2 hover:underline"
            >
              View bookings →
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-canvas p-6">
        <h3 className="font-display text-lg text-ink">Quick actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/book" size="md">Book a visit</Button>
          <Button href="/intake" variant="secondary" size="md">Start a new intake</Button>
          <Button href="/portal/profile" variant="ghost" size="md">Edit profile</Button>
        </div>
      </div>
    </div>
  );
}
