import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requirePatient } from "@/lib/portal-auth";

export const metadata = {
  title: "Portal · My intakes | Hello You Wellness",
  robots: { index: false },
};

type StandardRow = {
  id: string;
  submitted_at: string;
  services_interested: string[] | null;
  reason_for_visit: string | null;
};

type GLP1Row = {
  id: string;
  submitted_at: string;
  weight_loss_goal: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

type IntakeListItem = {
  id: string;
  submittedAt: string;
  type: "standard" | "glp1";
  summary: string;
};

export default async function PortalIntakesPage() {
  const patient = await requirePatient();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [standardRes, glp1Res] = await Promise.all([
    supabase
      .from("intake_submissions")
      .select("id, submitted_at, services_interested, reason_for_visit")
      .eq("patient_user_id", patient.userId)
      .order("submitted_at", { ascending: false }),
    supabase
      .from("glp1_intake_submissions")
      .select("id, submitted_at, weight_loss_goal")
      .eq("patient_user_id", patient.userId)
      .order("submitted_at", { ascending: false }),
  ]);

  const standard: IntakeListItem[] = ((standardRes.data ?? []) as StandardRow[]).map((r) => ({
    id: r.id,
    submittedAt: r.submitted_at,
    type: "standard",
    summary:
      (r.services_interested ?? []).join(", ") ||
      r.reason_for_visit ||
      "Patient registration",
  }));

  const glp1: IntakeListItem[] = ((glp1Res.data ?? []) as GLP1Row[]).map((r) => ({
    id: r.id,
    submittedAt: r.submitted_at,
    type: "glp1",
    summary: `GLP-1 weight loss · ${r.weight_loss_goal ?? "goal not specified"}`,
  }));

  const all = [...standard, ...glp1].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">My intakes</h2>
          <p className="mt-2 text-sm text-muted">
            Forms you&apos;ve submitted to {`Hello You`}. Tap any row to view the full submission.
          </p>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-line bg-canvas p-8 text-center">
          <p className="text-sm font-semibold text-ink">No intakes on file yet</p>
          <p className="mt-2 text-sm text-muted">
            If you&apos;ve filled out a form using a different email, sign in with that email
            instead — past submissions auto-link by email at signup.
          </p>
          <div className="mt-5">
            <Link
              href="/intake"
              className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Start an intake
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {all.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <Link
                href={`/portal/intakes/${item.id}?type=${item.type}`}
                className="flex items-start justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-canvas p-4 transition hover:border-ink/30"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {item.type === "glp1" ? "GLP-1 weight loss intake" : "Patient registration"}
                  </p>
                  <p className="mt-1 text-xs text-muted">{item.summary}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-faint">{formatDate(item.submittedAt)}</p>
                  <p className="mt-1 text-xs font-semibold text-ink">View →</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
