"use client";

import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import {
  glp1IntakeSchema,
  type GLP1IntakeData,
  CURRENT_DOSE_OPTIONS,
  DOSE_PREFERENCE_OPTIONS,
  WEIGHT_LOSS_GOAL_OPTIONS,
  HOW_DID_YOU_HEAR_OPTIONS,
} from "@/lib/glp1-intake-schema";
import { recommendGLP1Plan, type GLP1Plan as Plan } from "@/content/glp1-plans";

// ─── Step config ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

const STEP_TITLES = [
  "Let's start with your goal",
  "About you",
  "Health history",
  "GLP-1 history",
  "Your personalized plan",
  "Almost done",
];

// Fields to validate before advancing each step
const STEP_FIELDS: Record<number, (keyof GLP1IntakeData)[]> = {
  0: ["weightLossGoal"],
  1: ["fullName", "dateOfBirth", "phoneNumber", "email", "height", "weight"],
  2: [
    "currentlyPregnant",
    "tryingToConceive",
    "currentlyBreastfeeding",
    "familyHistoryMTC",
    "diagnosedPancreatitis",
    "diagnosedThyroid",
    "diagnosedDiabetes",
    "takingMedications",
    "preExistingConditions",
    "lastBloodLabWork",
    "lastBloodPressureResults",
  ],
  3: ["currentlyOnGLP1"],
  4: [],
  5: ["howDidYouHear", "signature"],
};

// ─── Eligibility & plan logic ──────────────────────────────────────────────────

function checkEligibility(data: Partial<GLP1IntakeData>): { eligible: boolean; reason?: string } {
  if (data.currentlyPregnant === "yes")
    return { eligible: false, reason: "GLP-1 medications are not recommended during pregnancy. Please speak with a licensed provider about safe alternatives." };
  if (data.currentlyBreastfeeding === "yes")
    return { eligible: false, reason: "GLP-1 medications are not recommended while breastfeeding. Please speak with a licensed provider." };
  if (data.familyHistoryMTC === "yes")
    return { eligible: false, reason: "GLP-1 medications are contraindicated with a personal or family history of medullary thyroid carcinoma (MTC) or MEN type 2 syndrome. A provider will need to evaluate you in person." };
  if (data.diagnosedPancreatitis === "yes")
    return { eligible: false, reason: "GLP-1 medications are generally not recommended for patients with a history of pancreatitis. A provider will need to review your case before starting treatment." };
  return { eligible: true };
}

function getRecommendedPlan(data: Partial<GLP1IntakeData>): Plan {
  if (data.currentlyOnGLP1 === "yes" && data.currentDose) {
    const monthNum = parseInt(data.currentDose.split("-")[1] ?? "1");
    return recommendGLP1Plan(monthNum);
  }
  return recommendGLP1Plan();
}

// ─── Shared UI primitives ──────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:text-sm";

const labelCls = "block text-sm font-semibold text-ink";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-[#C0392B]">{message}</p>;
}

function Req() {
  return <span className="text-[#C0392B]"> *</span>;
}

type YesNoProps = {
  label: string;
  name: keyof GLP1IntakeData;
  register: UseFormRegister<GLP1IntakeData>;
  error?: string;
  note?: string;
};

function YesNoField({ label, name, register, error, note }: YesNoProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className={labelCls}>
        {label}
        <Req />
      </p>
      {note && <p className="text-xs text-muted">{note}</p>}
      <div className="flex gap-6">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink">
          <input type="radio" value="yes" {...register(name)} className="h-5 w-5 accent-ink" />
          Yes / Sí
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink">
          <input type="radio" value="no" {...register(name)} className="h-5 w-5 accent-ink" />
          No
        </label>
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ─── Wizard ────────────────────────────────────────────────────────────────────

export function GLP1Wizard() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    trigger,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GLP1IntakeData>({
    resolver: zodResolver(glp1IntakeSchema),
    mode: "onTouched",
  });

  const currentlyOnGLP1 = watch("currentlyOnGLP1");
  const takingMedications = watch("takingMedications");
  const preExistingConditions = watch("preExistingConditions");
  const sideEffects = watch("sideEffects");

  // Compute eligibility + plan when on results step or beyond
  const values = getValues();
  const eligibility = step >= 4 ? checkEligibility(values) : null;
  const recommendedPlan = eligibility?.eligible ? getRecommendedPlan(values) : null;

  async function handleNext() {
    const fields: (keyof GLP1IntakeData)[] = [...(STEP_FIELDS[step] ?? [])];

    // Append conditional required fields before validating
    if (step === 2) {
      if (getValues("takingMedications") === "yes") fields.push("medicationsList");
      if (getValues("preExistingConditions") === "yes") fields.push("preExistingConditionsDetails");
    }
    if (step === 3 && getValues("currentlyOnGLP1") === "yes") {
      fields.push("currentDose", "dosePreference", "sideEffects", "medicationOnHand");
      if (getValues("sideEffects") === "yes") fields.push("sideEffectsDetails");
    }

    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: GLP1IntakeData) {
    setServerError("");
    try {
      const res = await fetch("/api/intake/glp1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setServerError(json.message ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-xl text-white">
          ✓
        </div>
        <h2 className="font-display text-2xl text-ink">We&apos;ve received your intake</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          A licensed provider will review your information and reach out within 1 business day to
          confirm your plan and next steps. No commitment required until then.
        </p>
        <p className="mt-5 text-sm text-muted">
          Questions in the meantime?{" "}
          <a
            href={`tel:${site.phoneTel}`}
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            {site.phoneDisplay}
          </a>
        </p>
      </div>
    );
  }

  // ── Wizard shell ────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-ink" : "bg-accent-soft"
            }`}
          />
        ))}
      </div>

      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#E8B4A3]">
        Step {step + 1} of {TOTAL_STEPS}
      </p>
      <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">{STEP_TITLES[step]}</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── Step 0: Goal ─────────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              This helps us match you to the right starting dose and plan.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {WEIGHT_LOSS_GOAL_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/30 has-[:checked]:border-ink has-[:checked]:bg-accent-soft"
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("weightLossGoal")}
                    className="h-5 w-5 accent-ink"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <FieldError message={errors.weightLossGoal?.message} />
          </div>
        )}

        {/* ── Step 1: Personal info ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>
                Full name<Req />
              </label>
              <input
                type="text"
                placeholder="First Last"
                {...register("fullName")}
                className={inputCls}
              />
              <FieldError message={errors.fullName?.message} />
            </div>

            <div>
              <label className={labelCls}>
                Date of birth<Req />
              </label>
              <input type="date" {...register("dateOfBirth")} className={inputCls} />
              <FieldError message={errors.dateOfBirth?.message} />
            </div>

            <div>
              <label className={labelCls}>
                Phone number<Req />
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phoneNumber")}
                className={inputCls}
              />
              <FieldError message={errors.phoneNumber?.message} />
            </div>

            <div>
              <label className={labelCls}>
                Email address<Req />
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={inputCls}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label className={labelCls}>
                Height<Req />
              </label>
              <input
                type="text"
                placeholder='e.g. 5&apos;8" or 172 cm'
                {...register("height")}
                className={inputCls}
              />
              <FieldError message={errors.height?.message} />
            </div>

            <div>
              <label className={labelCls}>
                Weight<Req />
              </label>
              <input
                type="text"
                placeholder="e.g. 160 lbs or 73 kg"
                {...register("weight")}
                className={inputCls}
              />
              <FieldError message={errors.weight?.message} />
            </div>
          </div>
        )}

        {/* ── Step 2: Health history ────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <YesNoField
              label="Currently pregnant?"
              name="currentlyPregnant"
              register={register}
              error={errors.currentlyPregnant?.message}
            />
            <YesNoField
              label="Currently breastfeeding?"
              name="currentlyBreastfeeding"
              register={register}
              error={errors.currentlyBreastfeeding?.message}
            />
            <YesNoField
              label="Trying to conceive?"
              name="tryingToConceive"
              register={register}
              error={errors.tryingToConceive?.message}
            />
            <YesNoField
              label="Personal or family history of MTC or MEN type 2?"
              name="familyHistoryMTC"
              register={register}
              error={errors.familyHistoryMTC?.message}
              note="Medullary thyroid carcinoma or multiple endocrine neoplasia type 2"
            />
            <YesNoField
              label="Diagnosed with pancreatitis?"
              name="diagnosedPancreatitis"
              register={register}
              error={errors.diagnosedPancreatitis?.message}
            />
            <YesNoField
              label="Diagnosed with a thyroid condition?"
              name="diagnosedThyroid"
              register={register}
              error={errors.diagnosedThyroid?.message}
            />
            <YesNoField
              label="Diagnosed with diabetes?"
              name="diagnosedDiabetes"
              register={register}
              error={errors.diagnosedDiabetes?.message}
            />
            <YesNoField
              label="Currently taking any medications?"
              name="takingMedications"
              register={register}
              error={errors.takingMedications?.message}
            />
            {takingMedications === "yes" && (
              <div>
                <label className={labelCls}>
                  List all medications<Req />
                </label>
                <textarea
                  rows={3}
                  {...register("medicationsList")}
                  className={`${inputCls} resize-none`}
                />
                <FieldError message={errors.medicationsList?.message} />
              </div>
            )}
            <YesNoField
              label="Any other pre-existing conditions?"
              name="preExistingConditions"
              register={register}
              error={errors.preExistingConditions?.message}
            />
            {preExistingConditions === "yes" && (
              <div>
                <label className={labelCls}>
                  Please describe<Req />
                </label>
                <textarea
                  rows={3}
                  {...register("preExistingConditionsDetails")}
                  className={`${inputCls} resize-none`}
                />
                <FieldError message={errors.preExistingConditionsDetails?.message} />
              </div>
            )}

            <div className="border-t border-line pt-5">
              <p className="mb-4 text-sm font-semibold text-ink">Lab work &amp; vitals</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>
                    Last blood/lab work<Req />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. March 2024 or Never"
                    {...register("lastBloodLabWork")}
                    className={inputCls}
                  />
                  <FieldError message={errors.lastBloodLabWork?.message} />
                </div>
                <div>
                  <label className={labelCls}>
                    Last blood pressure reading<Req />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80 mmHg"
                    {...register("lastBloodPressureResults")}
                    className={inputCls}
                  />
                  <FieldError message={errors.lastBloodPressureResults?.message} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Previous weight loss attempts{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. tried keto, phentermine in 2022, lost 15 lbs then regained…"
                {...register("previousWeightLossAttempts")}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: GLP-1 history ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <YesNoField
              label="Are you currently on a GLP-1 medication?"
              name="currentlyOnGLP1"
              register={register}
              error={errors.currentlyOnGLP1?.message}
            />

            {currentlyOnGLP1 === "yes" && (
              <>
                <div>
                  <label className={labelCls}>
                    Current dose<Req />
                  </label>
                  <select {...register("currentDose")} className={inputCls}>
                    <option value="">Select dose…</option>
                    {CURRENT_DOSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.currentDose?.message} />
                </div>

                <div>
                  <label className={labelCls}>
                    Dose preference<Req />
                  </label>
                  <select {...register("dosePreference")} className={inputCls}>
                    <option value="">Select preference…</option>
                    {DOSE_PREFERENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.dosePreference?.message} />
                </div>

                <YesNoField
                  label="Have you experienced any side effects?"
                  name="sideEffects"
                  register={register}
                  error={errors.sideEffects?.message}
                />
                {sideEffects === "yes" && (
                  <div>
                    <label className={labelCls}>
                      Describe your side effects<Req />
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Nausea in the first week, mild fatigue…"
                      {...register("sideEffectsDetails")}
                      className={`${inputCls} resize-none`}
                    />
                    <FieldError message={errors.sideEffectsDetails?.message} />
                  </div>
                )}

                <YesNoField
                  label="Do you have medication on hand?"
                  name="medicationOnHand"
                  register={register}
                  error={errors.medicationOnHand?.message}
                />
              </>
            )}

            {currentlyOnGLP1 === "no" && (
              <div className="rounded-xl border border-line bg-accent-soft/50 p-4 text-sm text-muted">
                No problem — we&apos;ll start you at the standard beginning dose (2.5mg) as part of
                your personalized plan.
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Results ───────────────────────────────────────────────── */}
        {step === 4 && eligibility && (
          <div>
            {eligibility.eligible ? (
              <div className="space-y-6">
                {/* Approval badge */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-white">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">
                      You&apos;re a great candidate for GLP-1 therapy
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Based on your responses, you&apos;re eligible to start your program. A
                      licensed APRN will review your intake within 1 business day and reach out to
                      confirm your plan.
                    </p>
                  </div>
                </div>

                {/* Plan card */}
                {recommendedPlan && (
                  <div className="rounded-xl border border-line p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A3]">
                      Recommended plan
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-ink">{recommendedPlan.name}</p>
                        <p className="mt-0.5 text-sm text-muted">
                          {recommendedPlan.months} · {recommendedPlan.dose}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Billed monthly · includes licensed provider oversight
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-3xl leading-none text-ink">
                          ${recommendedPlan.price}
                        </p>
                        <p className="mt-1 text-xs text-muted">/mo</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* What happens next */}
                <div className="rounded-xl border border-line/60 bg-accent-soft/40 p-4">
                  <p className="text-xs text-muted">
                    <span className="font-semibold text-ink">What happens next: </span>
                    Provider reviews your intake → contacts you to confirm your plan → medication
                    prescribed and delivered. No commitment required until you&apos;re confirmed.
                  </p>
                </div>
              </div>
            ) : (
              /* Not eligible */
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-ink">
                    !
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">
                      Not currently eligible for GLP-1
                    </h3>
                    <p className="mt-1 text-sm text-muted">{eligibility.reason}</p>
                  </div>
                </div>

                <p className="text-sm text-muted">
                  We still want to help you reach your goals. Book a free consultation — a licensed
                  provider will discuss the right options for your specific situation.
                </p>

                <Link
                  href={site.bookingUrl}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
                >
                  Book a free consultation →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Confirm & submit ──────────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-6">
            {/* Plan summary */}
            {recommendedPlan && (
              <div className="rounded-xl border border-line bg-accent-soft/40 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  Your plan
                </p>
                <p className="font-semibold text-ink">
                  {recommendedPlan.name} · {recommendedPlan.label}
                </p>
                <p className="text-sm text-muted">
                  {recommendedPlan.months} · {recommendedPlan.dose} · ${recommendedPlan.price}/mo
                </p>
              </div>
            )}

            <div>
              <p className={labelCls}>
                How did you hear about us?
                <Req />
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                {HOW_DID_YOU_HEAR_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("howDidYouHear")}
                      className="h-5 w-5 accent-ink"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <FieldError message={errors.howDidYouHear?.message} />
            </div>

            <div>
              <label className={labelCls}>
                By typing your full name you confirm all information is accurate and complete.
                <Req />
              </label>
              <input
                type="text"
                placeholder="Type your full name"
                {...register("signature")}
                className={inputCls}
              />
              <FieldError message={errors.signature?.message} />
            </div>

            {serverError && (
              <p className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <div className="mt-10 flex items-center gap-3">
          {/* Back — always show if not on first step */}
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink transition hover:border-ink/40"
            >
              ← Back
            </button>
          )}

          {/* Next — form steps 0–3 */}
          {step < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Next →
            </button>
          )}

          {/* Continue — results step, eligible only */}
          {step === 4 && eligibility?.eligible && (
            <button
              type="button"
              onClick={() => setStep(5)}
              className="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Continue →
            </button>
          )}

          {/* Submit — final step */}
          {step === 5 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit intake →"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
