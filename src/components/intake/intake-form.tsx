"use client";

import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { intakeSchema, type IntakeFormData } from "@/lib/intake-schema";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:text-sm";

const labelCls = "block text-sm font-semibold text-ink";

const SERVICES = [
  "IV Therapy",
  "TRT (Testosterone Replacement Therapy)",
  "ERT (Estrogen Replacement Therapy)",
  "NAD+ IV",
  "NAD+ At-Home Kit",
  "Take Home Vitamin Kit",
  "Assisted Weight Loss Program",
  "Sexual Wellness",
  "Morpheus8",
  "Hair Loss",
  "Facials & Skin Care",
] as const;

const HOW_DID_YOU_HEAR = [
  { value: "google", label: "Google" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "snapchat", label: "Snapchat" },
  { value: "referral", label: "Referral" },
  { value: "walk_in", label: "Walk-in" },
] as const;

const COVID_OPTIONS = [
  { value: "one_dose", label: "One dose only" },
  { value: "two_doses", label: "Two doses" },
  { value: "three_doses", label: "Three doses" },
  { value: "unvaccinated", label: "Unvaccinated" },
] as const;

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
  name: keyof IntakeFormData;
  register: UseFormRegister<IntakeFormData>;
  error?: string;
};

function YesNoField({ label, name, register, error }: YesNoProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className={labelCls}>
        {label} <span className="text-[#C0392B]">*</span>
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

export function IntakeForm() {
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      registrationDate: today,
      servicesInterested: [],
    },
  });

  const takingMedications = watch("takingMedications");
  const preExistingConditions = watch("preExistingConditions");
  const familyHistoryIllness = watch("familyHistoryIllness");

  async function onSubmit(data: IntakeFormData) {
    setServerError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setServerError(json.message ?? "Something went wrong. Please try again.");
        return;
      }
      setIsSuccess(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-xl text-white">
          ✓
        </div>
        <h2 className="font-display text-2xl text-ink">Registration received</h2>
        <p className="mt-3 max-w-sm mx-auto text-sm text-muted">
          Thank you — we&apos;ve received your intake form and will review it before your visit. We&apos;ll be in touch
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">

        {/* Personal Information */}
        <SectionHeading>Personal Information</SectionHeading>

        <div>
          <label className={labelCls}>
            Registration date / Fecha <span className="text-[#C0392B]">*</span>
          </label>
          <input type="date" {...register("registrationDate")} className={inputCls} />
          <FieldError message={errors.registrationDate?.message} />
        </div>

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

        <div className="sm:col-span-2">
          <label className={labelCls}>
            Address / Dirección <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="Street, City, State, ZIP"
            {...register("address")}
            className={inputCls}
          />
          <FieldError message={errors.address?.message} />
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
            Employment status / Situación laboral <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Employed, Self-employed, Retired"
            {...register("employmentStatus")}
            className={inputCls}
          />
          <FieldError message={errors.employmentStatus?.message} />
        </div>

        <div>
          <label className={labelCls}>Employer / Empleador</label>
          <input type="text" {...register("employer")} className={inputCls} />
          <FieldError message={errors.employer?.message} />
        </div>

        <div>
          <label className={labelCls}>
            Emergency contact / Contacto de emergencia <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="Name, relationship, phone"
            {...register("emergencyContact")}
            className={inputCls}
          />
          <FieldError message={errors.emergencyContact?.message} />
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
          <input
            type="text"
            placeholder="e.g. 160 lbs or 73 kg"
            {...register("weight")}
            className={inputCls}
          />
          <FieldError message={errors.weight?.message} />
        </div>

        {/* Medications */}
        <SectionHeading>Medications</SectionHeading>

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
            <label className={labelCls}>List all medications / Listar todos los medicamentos</label>
            <textarea rows={3} {...register("medicationsList")} className={`${inputCls} resize-none`} />
            <FieldError message={errors.medicationsList?.message} />
          </div>
        )}

        {/* Lifestyle */}
        <SectionHeading>Lifestyle</SectionHeading>

        <YesNoField
          label="Do you drink alcohol? / ¿Bebes alcohol?"
          name="drinksAlcohol"
          register={register}
          error={errors.drinksAlcohol?.message}
        />

        <YesNoField
          label="Do you smoke cigarettes? / ¿Fumas cigarrillos?"
          name="smokesCigarettes"
          register={register}
          error={errors.smokesCigarettes?.message}
        />

        <YesNoField
          label="Do you use any recreational drugs? / ¿Consumes alguna droga recreativa?"
          name="recreationalDrugs"
          register={register}
          error={errors.recreationalDrugs?.message}
        />

        {/* Medical Conditions */}
        <SectionHeading>Medical Conditions</SectionHeading>

        <div className="sm:col-span-2">
          <YesNoField
            label="Do you have any pre-existing medical conditions? / ¿Tiene alguna condición médica preexistente?"
            name="preExistingConditions"
            register={register}
            error={errors.preExistingConditions?.message}
          />
        </div>

        {preExistingConditions === "yes" && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Please explain / Por favor explique</label>
            <textarea
              rows={3}
              {...register("preExistingConditionsDetails")}
              className={`${inputCls} resize-none`}
            />
            <FieldError message={errors.preExistingConditionsDetails?.message} />
          </div>
        )}

        <YesNoField
          label="Diagnosed with Diabetes? / ¿Le han diagnosticado diabetes?"
          name="diagnosedDiabetes"
          register={register}
          error={errors.diagnosedDiabetes?.message}
        />

        <YesNoField
          label="Diagnosed with a Thyroid condition? / ¿Enfermedad de la tiroides?"
          name="diagnosedThyroid"
          register={register}
          error={errors.diagnosedThyroid?.message}
        />

        <YesNoField
          label="Diagnosed with pancreatitis? / ¿Pancreatitis?"
          name="diagnosedPancreatitis"
          register={register}
          error={errors.diagnosedPancreatitis?.message}
        />

        <div className="sm:col-span-2">
          <label className={labelCls}>
            Please specify any medical conditions / Especifique cualquier condición médica
          </label>
          <textarea
            rows={3}
            {...register("medicalConditionsDetails")}
            className={`${inputCls} resize-none`}
          />
          <FieldError message={errors.medicalConditionsDetails?.message} />
        </div>

        <div className="sm:col-span-2">
          <YesNoField
            label="Is there a history of serious illness in your family? / ¿Antecedentes de enfermedades graves en su familia?"
            name="familyHistoryIllness"
            register={register}
            error={errors.familyHistoryIllness?.message}
          />
        </div>

        {familyHistoryIllness === "yes" && (
          <div className="sm:col-span-2">
            <label className={labelCls}>If yes, please specify / En caso afirmativo, especifique</label>
            <textarea
              rows={3}
              {...register("familyHistoryDetails")}
              className={`${inputCls} resize-none`}
            />
            <FieldError message={errors.familyHistoryDetails?.message} />
          </div>
        )}

        {/* Reproductive Health */}
        <SectionHeading>Reproductive Health</SectionHeading>

        <YesNoField
          label="Are you currently pregnant? / ¿Estás embarazada actualmente?"
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
          label="Are you currently breastfeeding? / ¿Amamantando actualmente?"
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
            Date of last blood pressure check <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. January 2025"
            {...register("lastBloodPressureDate")}
            className={inputCls}
          />
          <FieldError message={errors.lastBloodPressureDate?.message} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>
            Results of last blood pressure check <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 120/80 mmHg"
            {...register("lastBloodPressureResults")}
            className={inputCls}
          />
          <FieldError message={errors.lastBloodPressureResults?.message} />
        </div>

        {/* COVID-19 */}
        <SectionHeading>COVID-19 Vaccination Status</SectionHeading>

        <div className="sm:col-span-2">
          <p className={labelCls}>
            What is your COVID-19 vaccination status? <span className="text-[#C0392B]">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-5">
            {COVID_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("covidVaccinationStatus")}
                  className="h-5 w-5 accent-ink"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <FieldError message={errors.covidVaccinationStatus?.message} />
        </div>

        {/* Visit Information */}
        <SectionHeading>Visit Information</SectionHeading>

        <div className="sm:col-span-2">
          <YesNoField
            label="Are you currently under Physician Supervision? / ¿Está bajo supervisión médica?"
            name="underPhysicianSupervision"
            register={register}
            error={errors.underPhysicianSupervision?.message}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>
            What brings you to our Wellness Center? Which service(s) interest you?{" "}
            <span className="text-[#C0392B]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe your goals and any questions you have..."
            {...register("reasonForVisit")}
            className={`${inputCls} resize-none`}
          />
          <FieldError message={errors.reasonForVisit?.message} />
        </div>

        <div className="sm:col-span-2">
          <p className={labelCls}>
            You are here for / ¿Para qué estás aquí? <span className="text-[#C0392B]">*</span>
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <label
                key={service}
                className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  value={service}
                  {...register("servicesInterested")}
                  className="h-5 w-5 accent-ink"
                />
                {service}
              </label>
            ))}
          </div>
          <FieldError message={errors.servicesInterested?.message ?? (errors.servicesInterested as { root?: { message?: string } } | undefined)?.root?.message} />
        </div>

        <div className="sm:col-span-2">
          <p className={labelCls}>
            How did you hear about us? / ¿Cómo te enteraste de nosotros? <span className="text-[#C0392B]">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {HOW_DID_YOU_HEAR.map((opt) => (
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
            By typing your full name below, you confirm the information provided is accurate and complete.{" "}
            <span className="text-[#C0392B]">*</span>
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
          {isSubmitting ? "Submitting…" : "Submit Registration / Enviar"}
        </button>
      </div>
    </form>
  );
}
