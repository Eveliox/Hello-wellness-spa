import type { ServiceSlug } from "@/content/services";

export type ProgramSlug =
  | "weight-management"
  | "longevity-vitality"
  | "skin-hair"
  | "hormone-wellness"
  | "recovery-performance"
  | "immune-support";

export type ProgramStep = { title: string; body: string };

/**
 * At-a-glance strip in the hero — the four data points that answer the
 * highest-friction questions a serious buyer asks in the first 15 seconds:
 * how long, what's the first visit, how often after, what does it cost.
 *
 * Any field left undefined is hidden. Prefer honest phrases over hedges —
 * "quoted at consult" beats "starting from $X*" for this audience.
 */
export type ProgramAtAGlance = {
  duration?: string;
  firstVisit?: string;
  followUp?: string;
  priceAnchor?: string;
};

export type ProgramContent = {
  slug: ProgramSlug;
  title: string;
  eyebrow: string;
  summary: string;
  /**
   * One peer-voice line that names an unspoken trade-off honestly. This is
   * the single highest-trust element of the page for informed buyers.
   */
  honestFraming?: string;
  heroImage: string;
  heroImageAlt: string;
  /** Short caption under the hero portrait, e.g. "Photographed at the SW Miami clinic." */
  heroCaption?: string;
  atAGlance?: ProgramAtAGlance;
  trustChips: string[];
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  ctaNote: string;
  benefits: string[];
  idealFor: string[];
  /** Honest disqualifiers. This block turns skeptics into leads. */
  notForYouIf?: string[];
  sessionNote: string;
  steps: [ProgramStep, ProgramStep, ProgramStep];
  includedServices: ServiceSlug[];
  /**
   * Name of the env var whose value is the Practice Better intake form URL for this program.
   * When the env var is empty, the CTA falls back to `/intake?program=<slug>`.
   */
  practiceBetterEnvVar: string;
  finalCtaHeading: string;
  finalCtaBody: string;
};

export const programs: ProgramContent[] = [
  {
    slug: "weight-management",
    title: "Weight Management",
    eyebrow: "Programa · Control de peso médico",
    summary:
      "Medical support for sustainable weight loss — physician-directed medication options, nutrition coaching, and follow-up you can count on. Built around your body, not a template.",
    honestFraming:
      "Straight framing: GLP-1s work, but they aren't for everyone. We run baseline labs and turn people away when the risk profile isn't right.",
    heroImage: "/weight-management.jpg",
    heroImageAlt: "Weight Management program at Hello You Wellness Center",
    atAGlance: {
      duration: "6-month program, month-to-month after",
      firstVisit: "45–60 min consult + baseline labs",
      followUp: "Monthly check-ins, adjusted by response",
      priceAnchor: "Quoted in full at consult · no bundle pricing online",
    },
    trustChips: ["GLP-1 program", "Labs before dosing", "SW Miami clinic"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "Free consult. We quote programs in full before you enroll.",
    benefits: [
      "Physician-directed eligibility screening and dosing decisions",
      "GLP-1 options (semaglutide, tirzepatide) when clinically appropriate",
      "Nutrition and lifestyle coaching that complements medical therapy",
      "Defined follow-up cadence — not fire-and-forget prescribing",
    ],
    idealFor: [
      "Women 40+ facing metabolic drift in peri- or menopause despite training and eating well",
      "Adults seeking medically appropriate support beyond DIY dieting",
      "Anyone considering GLP-1 therapy with real clinical oversight",
    ],
    notForYouIf: [
      "You're looking for mail-order GLP-1 with no visits or labs",
      "You want cosmetic weight loss under BMI 25 without a metabolic reason",
      "You want to skip baseline labs to start same-day",
    ],
    sessionNote:
      "Initial visit covers history, goals, labs, and a written program outline before you commit to therapy.",
    steps: [
      {
        title: "Intake",
        body: "Complete a short medical questionnaire so we understand your history, goals, and any prior weight-loss experience before we meet.",
      },
      {
        title: "Physician evaluation",
        body: "Meet with our clinical team for a personalized assessment. Baseline labs included. Clear plan built around your profile — no template.",
      },
      {
        title: "Program + follow-up",
        body: "Begin your protocol with a defined follow-up schedule. Dose adjustments, side-effect monitoring, and lifestyle coaching baked in.",
      },
    ],
    includedServices: ["assisted-weight-loss", "peptide-therapy"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_WEIGHT_MANAGEMENT",
    finalCtaHeading: "Ready to start your weight management program?",
    finalCtaBody:
      "Same-week consults often available. We respond within one business day — no sales calls, no upsells.",
  },
  {
    slug: "longevity-vitality",
    title: "Longevity & Vitality",
    eyebrow: "Programa · Longevidad celular",
    summary:
      "Optimize cellular and hormonal health for a longer, fuller life. Physician-designed protocols combining peptide therapy, IV support, and early-detection screening.",
    honestFraming:
      "Longevity work compounds. A conversation now is worth more than a treatment next year — but we won't overpromise reversal of aging we can't reverse.",
    heroImage: "/ting.jpg",
    heroImageAlt: "Longevity & Vitality program at Hello You Wellness Center",
    atAGlance: {
      duration: "Ongoing program — quarterly review cadence",
      firstVisit: "60-min consult + optional comprehensive panel",
      followUp: "Quarterly deep-dive, monthly touchpoints",
      priceAnchor: "Panel + program quoted at consult · no bundle pricing online",
    },
    trustChips: ["Physician-designed", "Lab-guided", "Galleri optional"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "Free consult. Panel and program details reviewed in full before you commit.",
    benefits: [
      "Physician-designed cellular regeneration protocols, APRN-administered",
      "IV support (NAD+, glutathione) integrated with your peptide plan",
      "Optional Galleri multi-cancer early-detection screening",
      "Framed around quality of life and function — not overpromised biohacks",
    ],
    idealFor: [
      "Adults 40+ investing in health span, not just life span",
      "Patients wanting cellular-level support with real medical supervision",
      "Anyone curious about peptides and NAD+ done properly, not DIY",
    ],
    notForYouIf: [
      "You expect a single infusion to reverse a decade of habits",
      "You want to skip labs and start protocols the same day",
      "You're looking for cosmetic outcomes rather than function markers",
    ],
    sessionNote:
      "Initial visits cover goals, health history, and any labs needed before a protocol is prescribed.",
    steps: [
      {
        title: "Intake",
        body: "Share your goals, current health, and what 'thriving' looks like for you over the next decade.",
      },
      {
        title: "Labs + protocol design",
        body: "Comprehensive labs when relevant. Your protocol is built around results — peptides, IV cadence, and add-on screening if appropriate.",
      },
      {
        title: "Ongoing optimization",
        body: "Regular check-ins to adjust dosing, review markers, and layer in support as your goals evolve.",
      },
    ],
    includedServices: ["peptide-therapy", "iv-therapy"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_LONGEVITY_VITALITY",
    finalCtaHeading: "Invest in the next 20 years, starting today.",
    finalCtaBody:
      "Longevity work compounds. A conversation now is worth more than a treatment next year.",
  },
  {
    slug: "skin-hair",
    title: "Skin & Hair",
    eyebrow: "Programa · Piel y cabello",
    summary:
      "Refined skin quality and healthy hair through medical aesthetics and targeted peptide support. Conservative technique, evidence-informed protocols, and a plan you can maintain.",
    honestFraming:
      "We will tell you when a treatment isn't the right fit for your skin type or hair pattern — and what to do instead. Some months we recommend maintenance, not more.",
    heroImage: "/skinwell.jpg",
    heroImageAlt: "Skin & Hair program at Hello You Wellness Center",
    atAGlance: {
      duration: "Treatment plan spans 3–6 months, maintenance thereafter",
      firstVisit: "45-min consult + candidacy screening + written plan",
      followUp: "Every 4–12 weeks based on treatment",
      priceAnchor: "Per-treatment pricing shared at consult",
    },
    trustChips: ["Licensed injector", "Peptide-supported", "Conservative technique"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "Written treatment plan before any injectable is placed.",
    benefits: [
      "Treatment plans tailored to your skin type and goals",
      "Peptide support for hair (GHK-Cu) and skin quality when appropriate",
      "Conservative injectable technique — refreshed, not overdone",
      "Photography-friendly progress tracking for honest before/after review",
    ],
    idealFor: [
      "Guests maintaining a polished, well-rested look",
      "First-time injectable clients who want education first",
      "Anyone addressing early volume loss, fine lines, or thinning hair",
    ],
    notForYouIf: [
      "You want dramatic transformation in one visit",
      "You expect injectables to substitute for skincare, sleep, and sun protection",
      "You're seeking treatments we've said no to elsewhere for a reason",
    ],
    sessionNote: "Consultations include candidacy screening and a written plan.",
    steps: [
      {
        title: "Intake",
        body: "Share your skin and hair concerns, prior treatments, and what a natural refresh looks like to you.",
      },
      {
        title: "Written plan",
        body: "Consult with our injector or aesthetician. Receive a written plan covering recommended services, timelines, and realistic expectations.",
      },
      {
        title: "Treatment + maintenance",
        body: "Treatment is performed with precision and a maintenance cadence that keeps results consistent — not a series of catch-up visits.",
      },
    ],
    includedServices: ["aesthetics-cosmetics", "peptide-therapy"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_SKIN_HAIR",
    finalCtaHeading: "A refreshed look, built to last.",
    finalCtaBody:
      "We prioritize balance, safety, and results that photograph honestly. Same-day toxin appointments are sometimes available.",
  },
  {
    slug: "hormone-wellness",
    title: "Hormone Wellness",
    eyebrow: "Programa · Equilibrio hormonal",
    summary:
      "In-person, physician-supervised hormone care for men with low testosterone and women navigating perimenopause and menopause. Dosed from your labs and symptoms, monitored on a real cadence.",
    honestFraming:
      "HRT is symptom management and quality of life — not disease prevention. We frame outcomes honestly and monitor on a real cadence, not fire-and-forget.",
    heroImage: "/hormone.jpg",
    heroImageAlt: "Physician reviewing hormone lab results with patient",
    atAGlance: {
      duration: "6-week evaluation, then rotating protocol",
      firstVisit: "45–60 min consult + comprehensive lab order",
      followUp: "6 weeks · 3 months · rotating",
      priceAnchor: "Program pricing quoted in full up front · no silent recurring charges",
    },
    trustChips: ["Physician-supervised", "Lab-guided", "In-person care"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "Program pricing quoted in full up front — no silent recurring charges.",
    benefits: [
      "Physician-supervised protocols dosed from labs and symptoms",
      "TRT for men, BHRT for women — no template protocols",
      "Defined monitoring cadence, not fire-and-forget prescribing",
      "In-person visits and labs — not telehealth-only care",
    ],
    idealFor: [
      "Men 35+ with fatigue, low libido, mood flatness, or central weight gain",
      "Women navigating perimenopause or menopause symptoms",
      "Anyone who wants in-person hormone care and honest monitoring",
    ],
    notForYouIf: [
      "You want mail-order testosterone with no visits or labs",
      "You expect HRT to fix problems that aren't hormonal",
      "You're seeking supraphysiologic dosing outside evidence-based ranges",
    ],
    sessionNote:
      "Initial consult is 45–60 minutes — symptom review, health history, and goals conversation. No pressure to start same-day.",
    steps: [
      {
        title: "Intake",
        body: "Complete a symptom questionnaire so your consult time is spent on nuance, not paperwork.",
      },
      {
        title: "Consult + labs",
        body: "45–60 minute consult with our physician. Comprehensive labs drawn in-clinic or at a partnered lab.",
      },
      {
        title: "Protocol + monitoring",
        body: "If HRT is appropriate, we discuss delivery options and start a defined protocol. Follow-ups at 6 weeks, 3 months, then rotating.",
      },
    ],
    includedServices: ["hormone-therapy"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_HORMONE_WELLNESS",
    finalCtaHeading: "Hormone care that shows up in person.",
    finalCtaBody:
      "Honest framing, real monitoring, and pricing you see up front. Book the consult before you commit to therapy.",
  },
  {
    slug: "recovery-performance",
    title: "Recovery & Performance",
    eyebrow: "Programa · Recuperación y rendimiento",
    summary:
      "Physician-curated IV therapy and recovery peptides for athletes, high performers, and anyone whose body works hard. Structured replenishment, not mystery bags.",
    honestFraming:
      "IV therapy is replenishment, not a cure. We say no to inputs that don't match your goals — proprietary blends, mystery bags, self-sourced peptides.",
    heroImage: "/recovv.jpg",
    heroImageAlt: "Recovery & Performance program at Hello You Wellness Center",
    atAGlance: {
      duration: "Cadence built around your training cycle",
      firstVisit: "30-min screening + first IV session",
      followUp: "Bi-weekly or monthly, depending on load",
      priceAnchor: "Per-session pricing · save your formula for reorder",
    },
    trustChips: ["Nurse-administered", "Traceable sourcing", "APRN-directed"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "In-clinic administration in SW Miami. No self-sourced vials.",
    benefits: [
      "Sterile compounding standards and medical-grade supplies",
      "Recovery peptides (BPC-157, GHK-Cu) with real medical oversight",
      "Nurse administration with comfort-forward technique",
      "Transparent ingredient lists — no proprietary blends, no mystery bags",
    ],
    idealFor: [
      "Athletes seeking structured replenishment on a training cycle",
      "High performers recovering from travel, events, or intense weeks",
      "Anyone exploring recovery peptides instead of DIY sources",
    ],
    notForYouIf: [
      "You want a supra-therapeutic 'megadose' IV that doesn't match your bloodwork",
      "You're bringing self-sourced peptides for us to administer",
      "You expect an infusion to substitute for training or sleep",
    ],
    sessionNote: "Most IV visits are 45–60 minutes door-to-door.",
    steps: [
      {
        title: "Intake",
        body: "Share your training load, recovery goals, and what you're currently doing — supplements, sleep, prior IV or peptide use.",
      },
      {
        title: "Protocol + first session",
        body: "APRN reviews your intake and matches you to the right IV blend and (if appropriate) recovery peptide protocol.",
      },
      {
        title: "Ongoing recovery",
        body: "Cadence built around your training or event schedule. Save your formula on file for easy reorder on future visits.",
      },
    ],
    includedServices: ["iv-therapy", "build-your-own-iv", "peptide-therapy"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_RECOVERY_PERFORMANCE",
    finalCtaHeading: "Recover like the work matters.",
    finalCtaBody:
      "IV blends and recovery peptides dosed by a licensed team — not a med spa checklist.",
  },
  {
    slug: "immune-support",
    title: "Immune Support",
    eyebrow: "Programa · Refuerzo inmunológico",
    summary:
      "IV therapy and targeted support for anyone travelling, recovering from illness, or reinforcing a taxed immune system. Physician-curated blends, transparent formulas.",
    honestFraming:
      "IV vitamin C or zinc isn't a substitute for sleep, a flu shot, or an actual doctor's visit — and we'll say so. What it can do is bridge a taxing stretch.",
    heroImage: "/IV infusion.jpg",
    heroImageAlt: "Nurse administering IV therapy in a private lounge suite",
    atAGlance: {
      duration: "Single sessions or seasonal cadence",
      firstVisit: "20-min screening + first IV session",
      followUp: "As needed or on a scheduled cadence",
      priceAnchor: "Per-session pricing · add-ons quoted at intake",
    },
    trustChips: ["Nurse-administered", "Transparent blends", "45–60 min visits"],
    primaryCtaLabel: "Start my intake",
    secondaryCtaLabel: "Talk to a real person",
    ctaNote: "Add-ons discussed during intake. Same-week appointments common.",
    benefits: [
      "Physician-curated immune blends — Myers' cocktail, high-dose vitamin C, zinc, glutathione",
      "Nurse administration in a private lounge suite",
      "Custom builds available when you have a specific goal",
      "Transparent ingredient lists — no mystery bags",
    ],
    idealFor: [
      "Pre-travel reinforcement or post-travel recovery",
      "Recovering from a recent illness or a taxing stretch",
      "Anyone building a cadence around seasonal risk periods",
    ],
    notForYouIf: [
      "You're actively sick and haven't seen a physician yet — we'll refer you first",
      "You're expecting an IV to replace a flu shot or antibiotics",
      "You want a proprietary blend without an ingredient list",
    ],
    sessionNote: "Brief intake screening before each session confirms the right blend for that day.",
    steps: [
      {
        title: "Intake",
        body: "Tell us what you're supporting — upcoming travel, recent illness, or an ongoing cadence — so we recommend the right blend.",
      },
      {
        title: "Screening + first session",
        body: "Quick clinical screening confirms the blend is right for you today. Administered by a nurse in a private lounge suite.",
      },
      {
        title: "Ongoing cadence",
        body: "For recurring support, we build a cadence around your calendar and save your preferred formula on file.",
      },
    ],
    includedServices: ["iv-therapy", "build-your-own-iv"],
    practiceBetterEnvVar: "NEXT_PUBLIC_PRACTICE_BETTER_URL_IMMUNE_SUPPORT",
    finalCtaHeading: "Stay ahead of what's going around.",
    finalCtaBody:
      "Whether it's a flight next week or a season ahead, the right cadence beats the last-minute scramble.",
  },
];

export function getProgram(slug: string): ProgramContent | undefined {
  return programs.find((p) => p.slug === slug);
}
