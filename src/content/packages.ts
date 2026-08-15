export type PackageTier = "weight-loss" | "metabolic" | "advanced";
export type PackageDuration = "6-week" | "12-week";

export type WellnessPackage = {
  slug: string;
  tier: PackageTier;
  duration: PackageDuration;
  title: string;
  summary: string;
  originalPrice: number;
  currentPrice: number;
  features: string[];
  /** Stripe Payment Link. Left empty until real links are configured. */
  checkoutUrl?: string;
  /** Placeholder image path — swap for real photography later. */
  image: string;
};

export type TierMeta = {
  id: PackageTier;
  label: string;
  eyebrow: string;
  description: string;
  /**
   * Tailwind-compatible arbitrary color for the tier accent bar / dot.
   * Kept as a single source of truth so cards and section headers stay in sync.
   */
  accentHex: string;
};

export const tiers: TierMeta[] = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    eyebrow: "Program · Tier 01",
    description:
      "Our foundational weight-loss track — personalized program, provider review, and defined follow-up.",
    accentHex: "#3FA758",
  },
  {
    id: "metabolic",
    label: "Metabolic Support",
    eyebrow: "Program · Tier 02",
    description:
      "Adds metabolic support for guests who need more than the foundational plan alone.",
    accentHex: "#4A90D9",
  },
  {
    id: "advanced",
    label: "Advanced",
    eyebrow: "Program · Tier 03",
    description:
      "Our most comprehensive track — advanced protocols and ongoing wellness support throughout.",
    accentHex: "#8B5CF6",
  },
];

export const tierById = (id: PackageTier): TierMeta =>
  tiers.find((t) => t.id === id)!;

export const packages: WellnessPackage[] = [
  // ── Weight Loss (green) ───────────────────────────────────────────────
  {
    slug: "weight-loss-6-week",
    tier: "weight-loss",
    duration: "6-week",
    title: "6 Weeks Weight Loss Program",
    summary:
      "Our foundational weight-loss protocol — a 4-week personalized program with 2 bonus weeks of individual support.",
    originalPrice: 320,
    currentPrice: 189,
    checkoutUrl: "https://buy.stripe.com/aFaeVc4O1eHY9nu3eFaR432",
    image: "/week6green.png",
    features: [
      "4-week personalized program",
      "2 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
    ],
  },
  {
    slug: "weight-loss-12-week",
    tier: "weight-loss",
    duration: "12-week",
    title: "12 Weeks Weight Loss Program",
    summary:
      "The full 12-week weight-loss journey — an 8-week personalized program with 4 bonus weeks and ongoing wellness guidance.",
    originalPrice: 860,
    currentPrice: 289,
    checkoutUrl: "https://buy.stripe.com/dRmcN480dczQ57eaH7aR431",
    image: "/week12green.png",
    features: [
      "8-week personalized program",
      "4 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
      "Personalized treatment plan",
      "Ongoing wellness guidance",
    ],
  },
  // ── Metabolic Support (blue) ──────────────────────────────────────────
  {
    slug: "metabolic-6-week",
    tier: "metabolic",
    duration: "6-week",
    title: "6 Weeks Metabolic Support Program",
    summary:
      "For guests who need additional metabolic support beyond the foundational program.",
    originalPrice: 480,
    currentPrice: 210,
    checkoutUrl: "https://buy.stripe.com/dRm3cu1BP7fwaryaH7aR433",
    image: "/week6blue.png",
    features: [
      "4-week personalized program",
      "2 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
      "Designed for individuals needing additional metabolic support",
    ],
  },
  {
    slug: "metabolic-12-week",
    tier: "metabolic",
    duration: "12-week",
    title: "12 Weeks Metabolic Support Program",
    summary:
      "Our full-length metabolic support track — 8 weeks of personalized care plus 4 bonus weeks of ongoing metabolic wellness support.",
    originalPrice: 998,
    currentPrice: 389,
    checkoutUrl: "https://buy.stripe.com/fZufZg1BPczQ1V26qRaR434",
    image: "/week12blue.png",
    features: [
      "8-week personalized program",
      "4 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
      "Ongoing metabolic wellness support",
    ],
  },
  // ── Advanced (purple) ─────────────────────────────────────────────────
  {
    slug: "advanced-6-week",
    tier: "advanced",
    duration: "6-week",
    title: "6 Weeks Advanced Weight Loss Program",
    summary:
      "An advanced-tier protocol for more comprehensive wellness goals over six focused weeks.",
    originalPrice: 620,
    currentPrice: 239,
    checkoutUrl: "https://buy.stripe.com/dRm7sNfMz1eG081acMdEs2Q",
    image: "/week6purple.png",
    features: [
      "4-week advanced personalized program",
      "2 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
      "Designed for advanced wellness goals",
    ],
  },
  {
    slug: "advanced-12-week",
    tier: "advanced",
    duration: "12-week",
    title: "12 Weeks Advanced Weight Loss Program",
    summary:
      "Our most comprehensive weight-loss program — 8 weeks of advanced personalized care with 4 bonus weeks of comprehensive wellness support throughout.",
    originalPrice: 1340,
    currentPrice: 490,
    checkoutUrl: "https://buy.stripe.com/28EaEWfsFgQ6eHOdTjaR435",
    image: "/week12purple.png",
    features: [
      "8-week advanced personalized program",
      "4 bonus weeks",
      "Individual support",
      "Medical intake form",
      "Provider review required",
      "Comprehensive wellness support throughout the program",
    ],
  },
];

export function getPackagesByTier(tier: PackageTier): WellnessPackage[] {
  return packages.filter((p) => p.tier === tier);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents);
}

/**
 * Promotional pricing.
 *
 * Current prices are a limited-time promo, not standing rates. Set `endsOn` to
 * an ISO date (e.g. "2026-09-30") to show a deadline in promo copy; leave it
 * null for open-ended "limited time" framing. Everything reading this is
 * driven off the constant, so one edit updates the whole site.
 */
export const promo = {
  active: true,
  endsOn: null as string | null,
  label: "Limited time",
} as const;

/** Cheapest current price across all packages — powers "from $X" copy. */
export const lowestPrice: number = Math.min(...packages.map((p) => p.currentPrice));

/** Cheapest current price within one tier. */
export function lowestPriceForTier(tier: PackageTier): number {
  const inTier = getPackagesByTier(tier);
  return Math.min(...inTier.map((p) => p.currentPrice));
}

/** Largest percentage saving across all packages, rounded down. */
export const maxSavingsPercent: number = Math.max(
  ...packages.map((p) =>
    Math.floor(((p.originalPrice - p.currentPrice) / p.originalPrice) * 100),
  ),
);
