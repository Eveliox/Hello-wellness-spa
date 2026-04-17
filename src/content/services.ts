export type ServiceSlug =
  | "assisted-weight-loss"
  | "aesthetics-cosmetics"
  | "iv-therapy"
  | "build-your-own-iv"
  | "peptide-therapy";

export type ServiceContent = {
  slug: ServiceSlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  heroImage: string;
  benefits: string[];
  idealFor: string[];
  sessionNote: string;
  ctaNote: string;
  faqIds: string[];
};

export const services: ServiceContent[] = [
  {
    slug: "assisted-weight-loss",
    title: "Assisted weight loss",
    shortTitle: "Weight loss",
    eyebrow: "Medical weight management",
    summary:
      "A calm, structured program pairing medication options with nutrition coaching, labs as appropriate, and follow-up you can count on—so progress feels sustainable, not chaotic.",
    heroImage: "/images/assisted-weight-loss/glp.webp",
    benefits: [
      "Physician-led eligibility and dosing decisions",
      "Private check-ins that respect your pace and privacy",
      "Lifestyle guidance that complements medical therapy",
      "Clear expectations around timeline, side effects, and results",
    ],
    idealFor: [
      "Adults seeking medically appropriate support beyond DIY dieting",
      "Clients who want discretion and consistent clinical oversight",
      "Anyone ready for accountability without judgment",
    ],
    sessionNote: "Initial visits include history, goals, and a personalized plan outline.",
    ctaNote: "Same-week consultations often available.",
    faqIds: [
      "booking",
      "weight-consult",
      "weight-loss-expect",
      "weight-loss-side-effects",
      "weight-loss-combine-services",
      "payment",
    ],
  },
  {
    slug: "aesthetics-cosmetics",
    title: "Aesthetics & cosmetics",
    shortTitle: "Aesthetics",
    eyebrow: "Refined results, natural ethos",
    summary:
      "Subtle enhancement and skin quality upgrades guided by trained injectors and aestheticians who prioritize balance, safety, and a refreshed—not overdone—appearance.",
    heroImage: "https://images.unsplash.com/photo-1512290923902-8a9f81e83669?w=1600&q=80&auto=format&fit=crop",
    benefits: [
      "Treatment plans tailored to bone structure and skin type",
      "Conservative technique with meticulous placement",
      "Photography-friendly lighting for honest before/after review",
      "Recovery guidance you can follow between visits",
    ],
    idealFor: [
      "First-time injectable clients who want education first",
      "Guests maintaining a polished, well-rested look",
      "Anyone correcting early signs of volume loss or fine lines",
    ],
    sessionNote: "Consultations include candidacy screening and a written plan.",
    ctaNote: "Ask about same-day toxin appointments when available.",
    faqIds: ["toxin", "filler", "downtime"],
  },
  {
    slug: "iv-therapy",
    title: "IV therapy",
    shortTitle: "IV therapy",
    eyebrow: "Hydration & recovery",
    summary:
      "Physician-curated IV blends for hydration, travel recovery, athletic reset, and immune support—delivered in a serene suite with attentive monitoring.",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80&auto=format&fit=crop",
    benefits: [
      "Sterile compounding standards and medical-grade supplies",
      "Nurse administration with comfort-forward technique",
      "Transparent ingredient lists—no mystery bags",
      "Quiet lounge seating and optional aromatherapy",
    ],
    idealFor: [
      "Post-travel fatigue or dehydration",
      "Pre-event glow and recovery days",
      "Athletes seeking structured replenishment",
    ],
    sessionNote: "Most visits are 45–60 minutes door-to-door.",
    ctaNote: "Add-ons can be discussed during intake.",
    faqIds: ["iv-safety", "iv-frequency", "booking"],
  },
  {
    slug: "build-your-own-iv",
    title: "Build your own IV",
    shortTitle: "BYO IV",
    eyebrow: "Personalized infusion design",
    summary:
      "Start with a clinician-approved base, then layer nutrients aligned to your goals—energy, immunity, skin clarity, or athletic bounce-back—within safe, evidence-informed ranges.",
    heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop",
    benefits: [
      "Guided menu with clear explanations for each add-on",
      "Medical review before your custom blend is prepared",
      "Digital summary of your formula for future visits",
      "Optional micronutrient lab insights when appropriate",
    ],
    idealFor: [
      "Guests who want control without compromising safety",
      "Repeat IV clients refining their perfect formula",
      "Couples or small groups booking adjacent suites",
    ],
    sessionNote: "Allow an extra 10 minutes on your first custom build.",
    ctaNote: "Popular blends can be saved to your profile.",
    faqIds: ["iv-safety", "iv-frequency", "payment"],
  },
  {
    slug: "peptide-therapy",
    title: "Peptides",
    shortTitle: "Peptides",
    eyebrow: "In‑vitro research only",
    summary:
      "A research-first peptide catalog with clear labeling, lot traceability, and handling guidance. Products are sold strictly for in‑vitro research and laboratory use only.",
    heroImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1600&q=80&auto=format&fit=crop",
    benefits: [
      "Clear labeling, storage notes, and research documentation",
      "Lot traceability for internal recordkeeping",
      "Packaging designed for lab handling",
      "Straightforward reorder flow once live",
    ],
    idealFor: [
      "Researchers and labs requiring research-use peptides",
      "Teams standardizing internal procurement and documentation",
      "Organizations that need consistent packaging and labeling",
    ],
    sessionNote: "All peptide products are intended strictly for in‑vitro research and laboratory use only.",
    ctaNote: "Questions about documentation, lots, or handling? Contact our team.",
    faqIds: ["peptide-safety", "peptide-consult", "payment"],
  },
];

export function getService(slug: ServiceSlug) {
  return services.find((s) => s.slug === slug);
}
