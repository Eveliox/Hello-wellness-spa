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

const yesNo = z.enum(["yes", "no"]);

export const glp1IntakeSchema = z
  .object({
    currentlyOnGLP1: yesNo,
    currentDose: z.string().max(60).optional(),
    dosePreference: z.enum(["stay", "increase", "decrease"]).optional(),
    sideEffects: yesNo.optional(),
    sideEffectsDetails: z.string().max(500).optional(),
    medicationOnHand: yesNo.optional(),
  })
  .superRefine((val, ctx) => {
    if (val.currentlyOnGLP1 === "yes") {
      if (!val.currentDose) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currentDose"],
          message: "Select your current dose.",
        });
      }
      if (!val.dosePreference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dosePreference"],
          message: "Select a dose preference.",
        });
      }
      if (!val.sideEffects) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sideEffects"],
          message: "Required.",
        });
      }
      if (!val.medicationOnHand) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["medicationOnHand"],
          message: "Required.",
        });
      }
    }
  });

export type GLP1Intake = z.infer<typeof glp1IntakeSchema>;
