"use client";

import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import {
  glp1IntakeSchema,
  type GLP1IntakeData,
  CURRENT_DOSE_OPTIONS,
  DOSE_PREFERENCE_OPTIONS,
  WEIGHT_LOSS_GOAL_OPTIONS,
  HOW_DID_YOU_HEAR_OPTIONS,
} from "@/lib/glp1-intake-schema";
import { trackEvent, LEAD_VALUE_USD } from "@/lib/analytics";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:text-sm";

const labelCls = "block text-sm font-semibold text-ink";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-[#C0392B]">{message}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full border-b border-line pb-2 pt-4">
      <h2 className="font-display text-xl text-ink">{children}</h2>
    </div>
  );
}

type YesNoProps = {
  label: string;
  name: keyof GLP1IntakeData;
  register: UseFormRegister<GLP1IntakeData>;
  error?: string;
  required?: boolean;
};

function YesNoField({ label, name, register, error, required = true }: YesNoProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className={labelCls}>
        {label} {required && <span className="text-[#C0392B]">*</span>}
      </p>
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

export function GLP1IntakeForm() {
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  // See PHI guardrail note in src/lib/analytics.ts. This form is currently
  // unused by any route, but the events are wired for the day it goes live.
  const startFiredRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GLP1IntakeData>({
    resolver: zodResolver(glp1IntakeSchema),
  });

  const currentlyOnGLP1 = watch("currentlyOnGLP1");
  const takingMedications = watch("takingMedications");
  const preExistingConditions = watch("preExistingConditions");
  const sideEffects = watch("sideEffects");

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
      trackEvent("generate_lead", {
        intake_type: "glp1",
        service: "glp1",
        has_booking: false,
        value: LEAD_VALUE_USD.glp1,
        currency: "USD",
      });
      setIsSuccess(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
    // Data param is referenced by react-hook-form contract; we don't push any of it.
    void data;
  }

  function handleFirstInteraction() {
    if (startFiredRef.current) return;
    startFiredRef.current = true;
    trackEvent("intake_start", {
      intake_type: "glp1",
      has_booking: false,
    });
  }

  if (isSuccess) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-xl text-white">
          ✓
        </div>
        <h2 className="font-display text-2xl text-ink">Intake received</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Thank you — a licensed provider will review your intake and reach out within 1 business
          day to discuss your personalized plan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocusCapture={handleFirstInteraction} noValidate>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">

        {/* Personal Information */}
        <SectionHeading>Personal Information</SectionHeading>

        <div>
          <label className={labelCls}>
            Full name / Nombre completo <span className="text-[#C0392B]">*</span>
          </label>
          <input type="text" placeholder="First Last" {...register("fullName")} className={inputCls} />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Date of birth / Fecha de nacimiento <span className="text-[#C0392B]">*</span>
          </label>
          <input type="date" {...register("dateOfBirth")} className={inputCls} />
          <FieldError message={errors.dateOfBirth?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Phone number / Número telefónico <span className="text-[#C0392B]">*</span>
          </label>
          <input type="tel" placeholder="+1 (555) 000-0000" {...register("phoneNumber")} className={inputCls} />
          <FieldError message={errors.phoneNumber?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Email address / Correo electrónico <span className="text-[#C0392B]">*</span>
          </label>
          <input type="email" placeholder="you@example.com" {...register("email")} className={inputCls} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Height / Altura <span className="text-[#C0392B]">*</span>
          </label>
          <input type="text" placeholder='e.g. 5&apos;8" or 172 cm' {...register("height")} className={inputCls} />
          <FieldError message={errors.height?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Weight / Peso <span className="text-[#C0392B]">*</span>
          </label>
          <input type="text" placeholder="e.g. 160 lbs or 73 kg" {...register("weight")} className={inputCls} />
          <FieldError message={errors.weight?.message} />
        </div>

        {/* Weight Loss Goals */}
        <SectionHeading>Weight Loss Goals</SectionHeading>

        <div className="sm:col-span-2">
          <p className={labelCls}>
            What is your weight loss goal? <span className="text-[#C0392B]">*</span>
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {WEIGHT_LOSS_GOAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line px-4 py-2.5 text-sm text-ink has-[:checked]:border-ink has-[:checked]:bg-accent-soft"
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

        <div className="sm:col-span-2">
          <label className={labelCls}>
            Previous weight loss attempts (diets, programs, medications)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Tried keto, used phentermine in 2022, lost 15 lbs then regained..."
            {...register("previousWeightLossAttempts")}
            className={`${inputCls} resize-none`}
          />
          <FieldError message={errors.previousWeightLossAttempts?.message} />
        </div>

        {/* Current GLP-1 Status */}
        <SectionHeading>Current GLP-1 Status</SectionHeading>

        <div className="sm:col-span-2">
          <YesNoField
            label="Are you currently on a GLP-1 medication? / ¿Está tomando un medicamento GLP-1?"
            name="currentlyOnGLP1"
            register={register}
            error={errors.currentlyOnGLP1?.message}
          />
        </div>

        {currentlyOnGLP1 === "yes" && (
          <>
            <div>
              <label className={labelCls}>
                Current dose / Dosis actual <span className="text-[#C0392B]">*</span>
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
                Dose preference <span className="text-[#C0392B]">*</span>
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

            <div className="sm:col-span-2">
              <YesNoField
                label="Have you experienced any side effects? / ¿Ha tenido efectos secundarios?"
                name="sideEffects"
                register={register}
                error={errors.sideEffects?.message}
              />
            </div>

            {sideEffects === "yes" && (
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Describe your side effects <span className="text-[#C0392B]">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Nausea in the first week, mild fatigue..."
                  {...register("sideEffectsDetails")}
                  className={`${inputCls} resize-none`}
                />
                <FieldError message={errors.sideEffectsDetails?.message} />
              </div>
            )}

            <div className="sm:col-span-2">
              <YesNoField
                label="Do you have medication on hand? / ¿Tiene medicación disponible?"
                name="medicationOnHand"
                register={register}
                error={errors.medicationOnHand?.message}
              />
            </div>
          </>
        )}

        {/* Medical History */}
        <SectionHeading>Medical History</SectionHeading>

        <div className="sm:col-span-2">
          <YesNoField
            label="Are you currently taking any medications? / ¿Está tomando algún medicamento actualmente?"
            name="takingMedications"
            register={register}
            error={errors.takingMedications?.message}
          />
        </div>

        {takingMedications === "yes" && (
          <div className="sm:col-span-2">
            <label className={labelCls}>
              List all medications / Listar todos los medicamentos{" "}
              <span className="text-[#C0392B]">*</span>
            </label>
            <textarea rows={3} {...register("medicationsList")} className={`${inputCls} resize-none`} />
            <FieldError message={errors.medicationsList?.message} />
          </div>
        )}

        <YesNoField
          label="Diagnosed with Diabetes? / ¿Diabetes?"
          name="diagnosedDiabetes"
          register={register}
          error={errors.diagnosedDiabetes?.message}
        />

        <YesNoField
          label="Diagnosed with a Thyroid condition? / ¿Tiroides?"
          name="diagnosedThyroid"
          register={register}
          error={errors.diagnosedThyroid?.message}
        />

        <YesNoField
          label="Diagnosed with Pancreatitis? / ¿Pancreatitis?"
          name="diagnosedPancreatitis"
          register={register}
          error={errors.diagnosedPancreatitis?.message}
        />

        <div className="sm:col-span-2">
          <YesNoField
            label="Personal or family history of medullary thyroid carcinoma (MTC) or MEN2?"
            name="familyHistoryMTC"
            register={register}
            error={errors.familyHistoryMTC?.message}
          />
          <p className="mt-1 text-xs text-muted">
            GLP-1 medications are contraindicated with a history of MTC or MEN type 2.
          </p>
        </div>

        <div className="sm:col-span-2">
          <YesNoField
            label="Do you have any other pre-existing medical conditions? / ¿Otras condiciones médicas?"
            name="preExistingConditions"
            register={register}
            error={errors.preExistingConditions?.message}
          />
        </div>

        {preExistingConditions === "yes" && (
          <div className="sm:col-span-2">
            <label className={labelCls}>
              Please describe <span className="text-[#C0392B]">*</span>
            </label>
            <textarea
              rows={3}
              {...register("preExistingConditionsDetails")}
              className={`${inputCls} resize-none`}
            />
            <FieldError message={errors.preExistingConditionsDetails?.message} />
          </div>
        )}

        {/* Reproductive Health */}
        <SectionHeading>Reproductive Health</SectionHeading>

        <YesNoField
          label="Are you currently pregnant? / ¿Embarazada?"
          name="currentlyPregnant"
          register={register}
          error={errors.currentlyPregnant?.message}
        />

        <YesNoField
          label="Are you trying to conceive? / ¿Tratando de concebir?"
          name="tryingToConceive"
          register={register}
          error={errors.tryingToConceive?.message}
        />

        <YesNoField
          label="Are you currently breastfeeding? / ¿Amamantando?"
          name="currentlyBreastfeeding"
          register={register}
          error={errors.currentlyBreastfeeding?.message}
        />

        {/* Lab Work & Vitals */}
        <SectionHeading>Lab Work &amp; Vitals</SectionHeading>

        <div>
          <label className={labelCls}>
            Last blood/lab work / Última análisis de sangre <span className="text-[#C0392B]">*</span>
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
            Last blood pressure results <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 120/80 mmHg"
            {...register("lastBloodPressureResults")}
            className={inputCls}
          />
          <FieldError message={errors.lastBloodPressureResults?.message} />
        </div>

        {/* How did you hear */}
        <SectionHeading>How Did You Find Us?</SectionHeading>

        <div className="sm:col-span-2">
          <p className={labelCls}>
            How did you hear about us? / ¿Cómo te enteraste? <span className="text-[#C0392B]">*</span>
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

        {/* Signature */}
        <SectionHeading>Signature / Firma</SectionHeading>

        <div className="sm:col-span-2">
          <label className={labelCls}>
            By typing your full name below, you confirm that all information provided is accurate
            and complete. <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="Type your full name"
            {...register("signature")}
            className={inputCls}
          />
          <FieldError message={errors.signature?.message} />
        </div>
      </div>

      {serverError && (
        <p className="mt-6 rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
          {serverError}
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Submitting…" : "Submit Intake / Enviar"}
        </button>
      </div>
    </form>
  );
}
