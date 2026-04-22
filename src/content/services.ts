export type ServiceSlug =
  | "assisted-weight-loss"
  | "aesthetics-cosmetics"
  | "iv-therapy"
  | "build-your-own-iv"
  | "peptide-therapy";

export type GettingStartedStep = {
  title: string;
  body: string;
};

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
  gettingStartedSteps: [GettingStartedStep, GettingStartedStep, GettingStartedStep];
  gettingStartedCta: { label: string; href: string };
};

export const services: ServiceContent[] = [
  {
    slug: "assisted-weight-loss",
    title: "Assisted weight loss",
    shortTitle: "Weight loss",
    eyebrow: "Medical weight management",
    summary:
      "A calm, structured program pairing medication options with nutrition coaching, labs as appropriate, and follow-up you can count on—so progress feels sustainable, not chaotic.",
    heroImage: "/fitness.jpg",
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
    gettingStartedSteps: [
      {
        title: "Consultation",
        body: "Schedule a quick call to discuss your health history, goals, and which program fits you best. No pressure — just clarity.",
      },
      {
        title: "Evaluation",
        body: "Meet with our physician for a personalized assessment. We review labs as appropriate and build a medication and dosing plan around your profile.",
      },
      {
        title: "Begin Your Program",
        body: "Receive your prescription, clear next steps, and ongoing check-ins that keep you accountable and on track without the noise.",
      },
    ],
    gettingStartedCta: { label: "Book a Free Consultation", href: "https://cal.com/helloyouwellness/30min" },
  },
  {
    slug: "aesthetics-cosmetics",
    title: "Aesthetics & cosmetics",
    shortTitle: "Aesthetics",
    eyebrow: "Refined results",
    summary:
      "Subtle enhancement and skin quality upgrades guided by trained injectors and aestheticians who prioritize balance, safety, and a refreshed—not overdone—appearance.",
    heroImage: "/skin.jpg",
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
    faqIds: [
      "toxin",
      "filler",
      "downtime",
      "aesthetics-botox-vs-filler",
      "aesthetics-duration",
      "aesthetics-brands",
    ],
    gettingStartedSteps: [
      {
        title: "Consultation",
        body: "Meet with our injector or aesthetician to walk through your goals, anatomy, and which treatments are right for you — education first, always.",
      },
      {
        title: "Your Treatment Plan",
        body: "Receive a written plan covering recommended services, realistic timelines, and exactly what to expect before and after each session.",
      },
      {
        title: "Your Appointment",
        body: "Treatment is performed with precision technique and conservative placement. Full aftercare guidance and a follow-up check are included.",
      },
    ],
    gettingStartedCta: { label: "Book a Free Consultation", href: "https://cal.com/helloyouwellness/aesthetics-consultation" },
  },
  {
    slug: "iv-therapy",
    title: "IV therapy",
    shortTitle: "IV therapy",
    eyebrow: "Hydration & recovery",
    summary:
      "Physician-curated IV blends for hydration, travel recovery, athletic reset, and immune support—delivered in a serene suite with attentive monitoring.",
    heroImage: "/IV infusion.jpg",
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
    faqIds: ["iv-safety", "iv-frequency", "booking", "iv-feel", "iv-combine", "iv-prescription"],
    gettingStartedSteps: [
      {
        title: "Choose Your Blend",
        body: "Browse our curated IV menu or tell us your goals — hydration, recovery, immunity, energy. We'll match you to the right formula.",
      },
      {
        title: "Quick Intake & Screening",
        body: "A brief health check before your session confirms the right blend and ensures safe administration by our licensed clinical team.",
      },
      {
        title: "Arrive & Relax",
        body: "Settle into our private lounge suite. Your IV is administered by a licensed nurse while you rest, work, or unwind — typically 45–60 minutes.",
      },
    ],
    gettingStartedCta: { label: "Book Your IV Session", href: "https://cal.com/helloyouwellness/15min" },
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
    faqIds: ["byo-change", "byo-combos", "byo-duration", "byo-group"],
    gettingStartedSteps: [
      {
        title: "Explore the Menu",
        body: "Browse our add-on catalog and pick the nutrients that match your goals — energy, immunity, skin clarity, or athletic recovery.",
      },
      {
        title: "Medical Review",
        body: "Your custom blend is reviewed by our clinical team before preparation. No guesswork, no risk — just a formula built for you.",
      },
      {
        title: "Your Formula, Your Visit",
        body: "Arrive and receive your personalized IV in our private lounge suite. Your formula is saved on file for easy reorder on future visits.",
      },
    ],
    gettingStartedCta: { label: "Start Building Your IV", href: "#iv-builder" },
  },
  {
    slug: "peptide-therapy",
    title: "Peptides",
    shortTitle: "Peptides",
    eyebrow: "In‑vitro research only",
    summary:
      "A research-first peptide catalog with clear labeling, lot traceability, and handling guidance. Products are sold strictly for in‑vitro research and laboratory use only.",
    heroImage: "/peptides.jpg",
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
    gettingStartedSteps: [
      {
        title: "Browse the Catalog",
        body: "Explore our research peptide lineup. Each product includes purity verification, lot documentation, and clear storage and handling guidance.",
      },
      {
        title: "Complete Registration",
        body: "Submit your registration form so we can maintain proper records for your research order before it ships.",
      },
      {
        title: "Receive Your Order",
        body: "Your peptide ships with a Certificate of Analysis and full handling documentation. Reorders are straightforward once your profile is on file.",
      },
    ],
    gettingStartedCta: { label: "Complete Registration", href: "/intake" },
  },
];

export function getService(slug: ServiceSlug) {
  return services.find((s) => s.slug === slug);
}
