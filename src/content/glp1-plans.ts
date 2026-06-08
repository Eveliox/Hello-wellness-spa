/**
 * Pricing tiers for the assisted-weight-loss GLP-1 program.
 *
 * Single source of truth for both the GLP-1 intake wizard (recommends a plan
 * based on dose history) and the marketing comparison table rendered on the
 * weight-loss service page.
 */

export type GLP1Plan = {
  key: "starter" | "active" | "maintenance";
  name: string;
  label: string;
  months: string;
  dose: string;
  price: number;
  /** Short marketing blurb shown on the comparison card. */
  tagline: string;
  /** Bullet points shown on the comparison card. */
  highlights: string[];
};

export const GLP1_PLANS: Record<GLP1Plan["key"], GLP1Plan> = {
  starter: {
    key: "starter",
    name: "Semaglutide + B12",
    label: "Starter",
    months: "Month 1–2",
    dose: "2.5mg → 5mg",
    price: 199,
    tagline: "Where most patients begin.",
    highlights: [
      "Low starting dose to minimize side effects",
      "Weekly check-ins with your APRN",
      "Includes B12 to support energy through ramp-up",
    ],
  },
  active: {
    key: "active",
    name: "Semaglutide + B12",
    label: "Active",
    months: "Month 3–4",
    dose: "7.5mg → 10mg",
    price: 249,
    tagline: "The momentum phase.",
    highlights: [
      "Therapeutic dose range — peak fat-loss window",
      "Biweekly check-ins, lab work as appropriate",
      "Nutrition + lifestyle coaching included",
    ],
  },
  maintenance: {
    key: "maintenance",
    name: "Semaglutide + B12",
    label: "Maintenance",
    months: "Month 5–6+",
    dose: "12.5mg → 15mg",
    price: 299,
    tagline: "Lock it in.",
    highlights: [
      "Highest dose range for sustained results",
      "Monthly provider visits + maintenance plan",
      "Off-ramp planning when you're ready to taper",
    ],
  },
};

export const GLP1_PLAN_LIST: GLP1Plan[] = [
  GLP1_PLANS.starter,
  GLP1_PLANS.active,
  GLP1_PLANS.maintenance,
];

/**
 * Recommend a plan based on what dose month the patient is currently in.
 * Used by the GLP-1 intake wizard.
 */
export function recommendGLP1Plan(currentDoseMonth?: number): GLP1Plan {
  if (currentDoseMonth && currentDoseMonth >= 5) return GLP1_PLANS.maintenance;
  if (currentDoseMonth && currentDoseMonth >= 3) return GLP1_PLANS.active;
  return GLP1_PLANS.starter;
}
