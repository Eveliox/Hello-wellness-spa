import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePatient } from "@/lib/portal-auth";

export const metadata = {
  title: "Portal · Intake detail | Hello You Wellness",
  robots: { index: false },
};

type SearchParams = Promise<{ type?: string }>;
type Params = Promise<{ id: string }>;

type Section = {
  title: string;
  fields: [label: string, value: string | null | undefined][];
};

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink">{value || "—"}</p>
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <div>
      <p className="mb-3 border-b border-line pb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        {section.title}
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.fields.map(([label, value]) => (
          <Detail key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

type SubmissionLike = Record<string, unknown>;

function buildStandardSections(r: SubmissionLike): Section[] {
  return [
    {
      title: "Personal",
      fields: [
        ["Full name", r.full_name as string],
        ["Date of birth", r.date_of_birth as string],
        ["Phone", r.phone_number as string],
        ["Email", r.email as string],
        ["Address", r.address as string],
        ["Employment", r.employment_status as string],
        ["Employer", (r.employer as string) ?? "—"],
        ["Emergency contact", r.emergency_contact as string],
        ["Height", r.height as string],
        ["Weight", r.weight as string],
      ],
    },
    {
      title: "Lifestyle",
      fields: [
        ["Alcohol", r.drinks_alcohol as string],
        ["Cigarettes", r.smokes_cigarettes as string],
        ["Recreational drugs", r.recreational_drugs as string],
      ],
    },
    {
      title: "Medical history",
      fields: [
        ["Pre-existing conditions", r.pre_existing_conditions as string],
        ["Details", (r.pre_existing_conditions_details as string) ?? "—"],
        ["Diabetes", r.diagnosed_diabetes as string],
        ["Thyroid", r.diagnosed_thyroid as string],
        ["Pancreatitis", r.diagnosed_pancreatitis as string],
        ["Other conditions", (r.medical_conditions_details as string) ?? "—"],
        ["Family history of illness", r.family_history_illness as string],
        ["Family history details", (r.family_history_details as string) ?? "—"],
        ["Currently taking medications", r.taking_medications as string],
        ["Medications list", (r.medications_list as string) ?? "—"],
      ],
    },
    {
      title: "Reproductive",
      fields: [
        ["Currently pregnant", r.currently_pregnant as string],
        ["Trying to conceive", r.trying_to_conceive as string],
        ["Currently breastfeeding", r.currently_breastfeeding as string],
      ],
    },
    {
      title: "Vitals & labs",
      fields: [
        ["Last blood/lab work", r.last_blood_lab_work as string],
        ["Last BP check", r.last_blood_pressure_date as string],
        ["Last BP result", r.last_blood_pressure_results as string],
        ["COVID vaccination", (r.covid_vaccination_status as string)?.replace(/_/g, " ")],
      ],
    },
    {
      title: "Visit",
      fields: [
        ["Under physician supervision", r.under_physician_supervision as string],
        ["Reason for visit", r.reason_for_visit as string],
        ["Services interested", ((r.services_interested as string[]) ?? []).join(", ") || "—"],
        ["How did you hear", (r.how_did_you_hear as string)?.replace(/_/g, " ")],
        ["Signature", r.signature as string],
      ],
    },
  ];
}

function buildGLP1Sections(r: SubmissionLike): Section[] {
  return [
    {
      title: "Goal",
      fields: [
        ["Weight loss goal", r.weight_loss_goal as string],
      ],
    },
    {
      title: "Personal",
      fields: [
        ["Full name", r.full_name as string],
        ["Date of birth", r.date_of_birth as string],
        ["Phone", r.phone_number as string],
        ["Email", r.email as string],
        ["Height", r.height as string],
        ["Weight", r.weight as string],
      ],
    },
    {
      title: "Health history",
      fields: [
        ["Currently pregnant", r.currently_pregnant as string],
        ["Trying to conceive", r.trying_to_conceive as string],
        ["Currently breastfeeding", r.currently_breastfeeding as string],
        ["Family history MTC", r.family_history_mtc as string],
        ["Pancreatitis", r.diagnosed_pancreatitis as string],
        ["Thyroid", r.diagnosed_thyroid as string],
        ["Diabetes", r.diagnosed_diabetes as string],
        ["Taking medications", r.taking_medications as string],
        ["Medications list", (r.medications_list as string) ?? "—"],
        ["Pre-existing conditions", r.pre_existing_conditions as string],
        ["Pre-existing details", (r.pre_existing_conditions_details as string) ?? "—"],
        ["Last blood/lab work", r.last_blood_lab_work as string],
        ["Last BP result", r.last_blood_pressure_results as string],
      ],
    },
    {
      title: "GLP-1 history",
      fields: [
        ["Currently on GLP-1", r.currently_on_glp1 as string],
        ["Current dose", (r.current_dose as string) ?? "—"],
        ["Dose preference", (r.dose_preference as string) ?? "—"],
        ["Side effects", (r.side_effects as string) ?? "—"],
        ["Side effects details", (r.side_effects_details as string) ?? "—"],
        ["Medication on hand", (r.medication_on_hand as string) ?? "—"],
      ],
    },
    {
      title: "Submission",
      fields: [
        ["How did you hear", (r.how_did_you_hear as string)?.replace(/_/g, " ")],
        ["Signature", r.signature as string],
      ],
    },
  ];
}

export default async function PortalIntakeDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ id }, { type }] = await Promise.all([params, searchParams]);
  const patient = await requirePatient();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const wantsGLP1 = type === "glp1";
  const table = wantsGLP1 ? "glp1_intake_submissions" : "intake_submissions";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .eq("patient_user_id", patient.userId)
    .maybeSingle();

  if (error) {
    console.error("[portal/intakes/:id] fetch failed", error);
    notFound();
  }
  if (!data) notFound();

  const row = data as SubmissionLike;
  const sections = wantsGLP1 ? buildGLP1Sections(row) : buildStandardSections(row);

  return (
    <div>
      <Link
        href="/portal/intakes"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted hover:text-ink"
      >
        ← All intakes
      </Link>
      <h2 className="mt-2 font-display text-2xl text-ink">
        {wantsGLP1 ? "GLP-1 weight loss intake" : "Patient registration"}
      </h2>
      <p className="mt-1 text-xs text-faint">Submitted {formatDate(row.submitted_at as string)}</p>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <SectionBlock key={s.title} section={s} />
        ))}
      </div>
    </div>
  );
}
