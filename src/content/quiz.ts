import type { ServiceSlug } from "@/content/services";

type Weights = Partial<Record<ServiceSlug, number>>;

export type QuizOption = {
  id: string;
  label: string;
  hint?: string;
  weights: Weights;
};

export type QuizStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  options: QuizOption[];
};

export const quizSteps: QuizStep[] = [
  {
    id: "goal",
    eyebrow: "Step 1 of 5",
    title: "What matters most to you right now?",
    subtitle: "Pick the one that feels closest—we'll refine from there.",
    type: "single",
    options: [
      {
        id: "weight",
        label: "Sustainable weight loss",
        hint: "Medically guided, with oversight",
        weights: { "assisted-weight-loss": 3 },
      },
      {
        id: "aesthetics",
        label: "Refreshed, natural-looking aesthetics",
        hint: "Skin, tone, subtle refinement",
        weights: { "aesthetics-cosmetics": 3 },
      },
      {
        id: "energy",
        label: "More energy & faster recovery",
        hint: "Travel, training, busy weeks",
        weights: { "iv-therapy": 3, "peptide-therapy": 1 },
      },
      {
        id: "longevity",
        label: "Longevity & performance",
        hint: "Optimizing the long game",
        weights: { "peptide-therapy": 3, "assisted-weight-loss": 1 },
      },
      {
        id: "explore",
        label: "I'm exploring—show me options",
        weights: {},
      },
    ],
  },
  {
    id: "concern",
    eyebrow: "Step 2 of 5",
    title: "What's been pulling at you most?",
    type: "single",
    options: [
      {
        id: "plateau",
        label: "Stuck on weight despite effort",
        weights: { "assisted-weight-loss": 3, "peptide-therapy": 1 },
      },
      {
        id: "skin",
        label: "Skin texture, fine lines, or volume",
        weights: { "aesthetics-cosmetics": 3 },
      },
      {
        id: "fatigue",
        label: "Low energy or brain fog",
        weights: { "iv-therapy": 2, "peptide-therapy": 2 },
      },
      {
        id: "recovery",
        label: "Recovery from travel, events, or training",
        weights: { "iv-therapy": 3 },
      },
      {
        id: "sleep",
        label: "Sleep, stress, or mood",
        weights: { "peptide-therapy": 2, "iv-therapy": 1 },
      },
    ],
  },
  {
    id: "energy",
    eyebrow: "Step 3 of 5",
    title: "How would you describe your energy?",
    type: "single",
    options: [
      {
        id: "fumes",
        label: "Running on fumes most days",
        weights: { "iv-therapy": 2, "peptide-therapy": 2 },
      },
      {
        id: "okay",
        label: "Okay—but I want more consistency",
        weights: { "iv-therapy": 2, "assisted-weight-loss": 1 },
      },
      {
        id: "good",
        label: "Good—I'm fine-tuning the details",
        weights: { "peptide-therapy": 2, "build-your-own-iv": 1 },
      },
    ],
  },
  {
    id: "priorities",
    eyebrow: "Step 4 of 5",
    title: "Which should we factor in too?",
    subtitle: "Select up to three.",
    type: "multi",
    options: [
      {
        id: "metabolism",
        label: "Metabolism & body composition",
        weights: { "assisted-weight-loss": 2, "peptide-therapy": 1 },
      },
      {
        id: "appearance",
        label: "Skin & visible results",
        weights: { "aesthetics-cosmetics": 2 },
      },
      {
        id: "hydration",
        label: "Hydration & vitamin support",
        weights: { "iv-therapy": 2 },
      },
      {
        id: "custom",
        label: "A custom IV I can tweak each visit",
        weights: { "build-your-own-iv": 3 },
      },
      {
        id: "longevity-add",
        label: "Recovery, sleep & longevity",
        weights: { "peptide-therapy": 2, "iv-therapy": 1 },
      },
      {
        id: "immune",
        label: "Immunity & resilience",
        weights: { "iv-therapy": 1, "peptide-therapy": 1 },
      },
    ],
  },
];

export const MAX_MULTI_SELECT = 3;

export const serviceOrderFallback: ServiceSlug[] = [
  "assisted-weight-loss",
  "aesthetics-cosmetics",
  "iv-therapy",
  "peptide-therapy",
  "build-your-own-iv",
];

export function recommendService(weights: Weights): ServiceSlug {
  let best: ServiceSlug = serviceOrderFallback[0];
  let bestScore = -Infinity;
  for (const slug of serviceOrderFallback) {
    const score = weights[slug] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = slug;
    }
  }
  return best;
}
