import { z } from "zod";

export const CURRENT_DOSE_OPTIONS = [
  { value: "month-1-2.5mg", label: "Month 1 (2.5mg)" },
  { value: "month-2-5mg", label: "Month 2 (5.0mg)" },
  { value: "month-3-7.5mg", label: "Month 3 (7.5mg)" },
  { value: "month-4-10mg", label: "Month 4 (10.0mg)" },
  { value: "month-5-12.5mg", label: "Month 5 (12.5mg)" },
  { value: "month-6-15mg", label: "Month 6 (15.0mg)" },
] as const;

export const DOSE_PREFERENCE_OPTIONS = [
  { value: "stay", label: "Stay at the same dose or equivalent dose" },
  { value: "increase", label: "Increase dose" },
  { value: "decrease", label: "Decrease dose" },
] as const;

export const WEIGHT_LOSS_GOAL_OPTIONS = [
  { value: "5-20", label: "5 – 20 lbs." },
  { value: "21-50", label: "21 – 50 lbs." },
  { value: "51+", label: "51+ lbs." },
  { value: "unsure", label: "Not sure, I just need help" },
] as const;

export const HOW_DID_YOU_HEAR_OPTIONS = [
  { value: "google", label: "Google" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "snapchat", label: "Snapchat" },
  { value: "referral", label: "Referral" },
  { value: "walk_in", label: "Walk-in" },
] as const;

const yesNo = z.enum(["yes", "no"]);

export const glp1IntakeSchema = z
  .object({
    // Personal info
    fullName: z.string().min(2, "Required").max(120),
    dateOfBirth: z.string().min(1, "Required"),
    phoneNumber: z.string().min(7, "Required").max(40),
    email: z.string().email("Invalid email").max(200),
    height: z.string().min(1, "Required").max(40),
    weight: z.string().min(1, "Required").max(40),

    // Weight loss goals
    weightLossGoal: z.enum(["5-20", "21-50", "51+", "unsure"], "Please select a goal"),
    previousWeightLossAttempts: z.string().max(500).optional(),

    // Current GLP-1 status
    currentlyOnGLP1: yesNo,
    currentDose: z.string().max(60).optional(),
    dosePreference: z.enum(["stay", "increase", "decrease"]).optional(),
    sideEffects: yesNo.optional(),
    sideEffectsDetails: z.string().max(500).optional(),
    medicationOnHand: yesNo.optional(),

    // Medical history
    takingMedications: yesNo,
    medicationsList: z.string().max(1000).optional(),
    diagnosedDiabetes: yesNo,
    diagnosedThyroid: yesNo,
    diagnosedPancreatitis: yesNo,
    familyHistoryMTC: yesNo,
    preExistingConditions: yesNo,
    preExistingConditionsDetails: z.string().max(1000).optional(),

    // Reproductive health
    currentlyPregnant: yesNo,
    tryingToConceive: yesNo,
    currentlyBreastfeeding: yesNo,

    // Lab work
    lastBloodLabWork: z.string().min(1, "Required").max(100),
    lastBloodPressureResults: z.string().min(1, "Required").max(200),

    // How did you hear
    howDidYouHear: z.enum([
      "google",
      "instagram",
      "facebook",
      "whatsapp",
      "snapchat",
      "referral",
      "walk_in",
    ]),

    // Signature
    signature: z.string().min(2, "Required").max(120),
  })
  .superRefine((val, ctx) => {
    if (val.currentlyOnGLP1 === "yes") {
      if (!val.currentDose) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["currentDose"], message: "Select your current dose." });
      }
      if (!val.dosePreference) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dosePreference"], message: "Select a dose preference." });
      }
      if (!val.sideEffects) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sideEffects"], message: "Required." });
      }
      if (!val.medicationOnHand) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["medicationOnHand"], message: "Required." });
      }
    }
    if (val.takingMedications === "yes" && !val.medicationsList?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["medicationsList"], message: "Please list your medications." });
    }
    if (val.preExistingConditions === "yes" && !val.preExistingConditionsDetails?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preExistingConditionsDetails"], message: "Please describe your conditions." });
    }
    if (val.sideEffects === "yes" && !val.sideEffectsDetails?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sideEffectsDetails"], message: "Please describe your side effects." });
    }
  });

export type GLP1IntakeData = z.infer<typeof glp1IntakeSchema>;
