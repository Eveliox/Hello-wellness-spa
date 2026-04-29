"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  submitted_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  employment_status: string;
  employer: string | null;
  taking_medications: string;
  medications_list: string | null;
  emergency_contact: string;
  height: string;
  weight: string;
  drinks_alcohol: string;
  smokes_cigarettes: string;
  recreational_drugs: string;
  pre_existing_conditions: string;
  pre_existing_conditions_details: string | null;
  diagnosed_diabetes: string;
  diagnosed_thyroid: string;
  diagnosed_pancreatitis: string;
  medical_conditions_details: string | null;
  family_history_illness: string;
  family_history_details: string | null;
  currently_pregnant: string;
  trying_to_conceive: string;
  currently_breastfeeding: string;
  last_blood_lab_work: string;
  last_blood_pressure_date: string;
  last_blood_pressure_results: string;
  covid_vaccination_status: string;
  under_physician_supervision: string;
  reason_for_visit: string;
  services_interested: string[];
  how_did_you_hear: string;
  signature: string;
  notes: string | null;
};

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value || "—"}</p>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 border-b border-line pb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">{children}</div>
    </div>
  );
}

export function SubmissionsTable({ initialData }: { initialData: Submission[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);

  const filtered = initialData.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone_number ?? "").includes(search),
  );

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Intake Submissions</h1>
          <p className="mt-0.5 text-sm text-muted">{initialData.length} total registration{initialData.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition hover:border-ink hover:text-ink"
        >
          Sign out
        </button>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search by name, email, or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 sm:max-w-sm"
      />

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface py-16 text-center text-sm text-muted">
          {search ? "No results match your search." : "No submissions yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">Name</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:table-cell">Email</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted md:table-cell">Phone</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted lg:table-cell">Services</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="transition hover:bg-surface/60">
                  <td className="px-4 py-3 font-semibold text-ink">{s.full_name}</td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{s.email}</td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{s.phone_number}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(s.services_interested ?? []).slice(0, 2).map((svc) => (
                        <span
                          key={svc}
                          className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-muted"
                        >
                          {svc}
                        </span>
                      ))}
                      {(s.services_interested ?? []).length > 2 && (
                        <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
                          +{s.services_interested.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(s.submitted_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(s)}
                      className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted transition hover:border-ink hover:text-ink"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-ink/30 backdrop-blur-sm sm:items-start"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[var(--radius-card)] bg-white shadow-2xl sm:h-screen sm:rounded-none sm:rounded-l-[var(--radius-card)]">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 className="font-display text-xl text-ink">{selected.full_name}</h2>
                <p className="text-xs text-muted">
                  Submitted{" "}
                  {new Date(selected.submitted_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <DetailSection title="Personal">
                <Detail label="Full Name" value={selected.full_name} />
                <Detail label="Date of Birth" value={selected.date_of_birth} />
                <Detail label="Phone" value={selected.phone_number} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Address" value={selected.address} />
                <Detail label="Employment" value={selected.employment_status} />
                <Detail label="Employer" value={selected.employer} />
                <Detail label="Emergency Contact" value={selected.emergency_contact} />
                <Detail label="Height" value={selected.height} />
                <Detail label="Weight" value={selected.weight} />
              </DetailSection>

              <DetailSection title="Medications &amp; Lifestyle">
                <Detail label="Taking Medications" value={selected.taking_medications} />
                <Detail label="Medications List" value={selected.medications_list} />
                <Detail label="Drinks Alcohol" value={selected.drinks_alcohol} />
                <Detail label="Smokes Cigarettes" value={selected.smokes_cigarettes} />
                <Detail label="Recreational Drugs" value={selected.recreational_drugs} />
              </DetailSection>

              <DetailSection title="Medical Conditions">
                <Detail label="Pre-existing Conditions" value={selected.pre_existing_conditions} />
                <Detail label="Details" value={selected.pre_existing_conditions_details} />
                <Detail label="Diabetes" value={selected.diagnosed_diabetes} />
                <Detail label="Thyroid" value={selected.diagnosed_thyroid} />
                <Detail label="Pancreatitis" value={selected.diagnosed_pancreatitis} />
                <Detail label="Other Conditions" value={selected.medical_conditions_details} />
                <Detail label="Family History" value={selected.family_history_illness} />
                <Detail label="Family History Details" value={selected.family_history_details} />
              </DetailSection>

              <DetailSection title="Reproductive Health">
                <Detail label="Pregnant" value={selected.currently_pregnant} />
                <Detail label="Trying to Conceive" value={selected.trying_to_conceive} />
                <Detail label="Breastfeeding" value={selected.currently_breastfeeding} />
              </DetailSection>

              <DetailSection title="Lab Work &amp; Vitals">
                <Detail label="Last Blood/Lab Work" value={selected.last_blood_lab_work} />
                <Detail label="Last BP Date" value={selected.last_blood_pressure_date} />
                <Detail label="BP Results" value={selected.last_blood_pressure_results} />
                <Detail label="COVID Vaccination" value={selected.covid_vaccination_status?.replace(/_/g, " ")} />
                <Detail label="Physician Supervision" value={selected.under_physician_supervision} />
              </DetailSection>

              <DetailSection title="Visit">
                <div className="col-span-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Reason for Visit</p>
                  <p className="mt-0.5 text-sm text-ink">{selected.reason_for_visit || "—"}</p>
                </div>
                <div className="col-span-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Services Interested</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(selected.services_interested ?? []).map((svc) => (
                      <span
                        key={svc}
                        className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
                <Detail label="How Did You Hear" value={selected.how_did_you_hear?.replace(/_/g, " ")} />
              </DetailSection>

              <DetailSection title="Signature">
                <Detail label="Signed by" value={selected.signature} />
                {selected.notes && <Detail label="Admin Notes" value={selected.notes} />}
              </DetailSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
