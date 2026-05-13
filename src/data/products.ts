export type ProductCategory =
  | "All Products"
  | "Programs"
  | "Hormone Programs"
  | "Peptides"
  | "IV Therapy"
  | "Memberships"
  | "Screenings & Diagnostics"
  | "Skin Care"
  | "Supplements & Add-ons";

export type Product = {
  name: string;
  description: string;
  category: Exclude<ProductCategory, "All Products" | "Memberships" | "Screenings & Diagnostics">;
  image: string;
  badge: string | null;
  onSale: boolean;
  originalPrice?: number | null;
  salePrice?: number | null;
  price?: number | null;
  /** Optional Stripe Payment Link (or other checkout URL) for “buy now” flows */
  paymentLink?: string;
  /** Duration pill shown on program cards (e.g., "8 Weeks"). */
  duration?: string;
  /** Detailed checklist shown in the card's expandable "What's included" section. */
  includes?: string[];
  /** When set, the card image is clickable and a "View full details" link opens a lightbox showing this image full-size. */
  lightboxImage?: string;
  /** When set, the CTA becomes "Check if you qualify" and links here (e.g., a Cal.com consultation URL). Takes precedence over paymentLink. */
  consultUrl?: string;
  /** When set, "Start now" routes to /checkout?product={checkoutSlug} instead of directly to Stripe. */
  checkoutSlug?: string;
  /** Suffix appended to the price in smaller, lighter text (e.g., "/mo"). Triggers no-decimals price formatting. */
  priceSuffix?: string;
  /** Override the default CTA button text (e.g., "Continue your program"). */
  ctaLabel?: string;
  /** When true, render a "Call to enroll — (786) 780-3626" note under the CTA. */
  phoneEnroll?: boolean;
  /** When true, render a "MOST POPULAR" pill on the top-left of the card image. */
  mostPopular?: boolean;
  /** Use the dark "hero" theme: tall image with baked-in title/description, restyled body. Image must be a complete hero asset (e.g., testreplace.png). */
  heroLayout?: boolean;
  /** Discounted price unlocked by membership. When set, card displays both regular price (crossed out) and this member price prominently. */
  memberPrice?: number;
  /** Caption shown under the member price (e.g., "Member Price (with Refresh+)"). Required when memberPrice is set. */
  memberPriceLabel?: string;
};

export const categories: ProductCategory[] = [
  "All Products",
  "Programs",
  "Hormone Programs",
  "Peptides",
  "IV Therapy",
  "Screenings & Diagnostics",
  "Memberships",
  "Skin Care",
  "Supplements & Add-ons",
];

export const products: Product[] = [
  // CATEGORY: Programs
  {
    name: "All-in-One Weight Loss Program — 8 Weeks",
    description:
      "Physician-supervised 8-week weight loss program with everything included — no add-ons, no upsells.",
    category: "Programs",
    price: 229,
    onSale: false,
    image: "/all in one.png",
    lightboxImage: "/all in one.png",
    badge: "All Included",
    mostPopular: true,
    duration: "8 Weeks",
    checkoutSlug: "all-in-one-8-weeks",
    paymentLink: "https://buy.stripe.com/8x29AScgt8jAaryaH7aR426",
    includes: [
      "Sema Plus (Semaglutide)",
      "Telemedicine Evaluation",
      "Nutrition Guide & Exercise Plan",
      "Lipotropics & B12 Injections",
      "Fat Burner Shots",
      "Extra Peptides: Sermorelin, NAD+, GHK-Cu",
    ],
  },
  {
    name: "All-in-One Weight Loss Program — 6 Weeks",
    description:
      "Physician-supervised 6-week weight loss program at a flat rate — everything included, no add-ons, no upsells.",
    category: "Programs",
    price: 189,
    onSale: false,
    image: "/6 week.png",
    lightboxImage: "/6 week.png",
    badge: "Flat Rate · All Included",
    duration: "6 Weeks",
    checkoutSlug: "all-in-one-6-weeks",
    paymentLink: "https://buy.stripe.com/9B628q0xL0R8dDK8yZaR427",
    includes: [
      "Sema Plus (Semaglutide)",
      "Telemedicine Evaluation",
      "Nutrition Guide & Exercise Plan",
      "Lipotropics & B12 Injections",
      "Fat Burner Shots",
      "Extra Peptides: Sermorelin, NAD+, GHK-Cu",
    ],
  },
  {
    name: "Men's Performance, Vitality & Energy Program",
    description:
      "Physician-guided 8-week program designed to support men's vitality, performance, and overall wellness from the inside out.",
    category: "Programs",
    price: 450,
    onSale: false,
    image: "/mens performance.png",
    lightboxImage: "/mens performance.png",
    badge: "Physician-Guided",
    duration: "8 Weeks",
    consultUrl: "https://cal.com/helloyouwellness/30min",
    includes: [
      "GLP-1 / GIP-Based Therapy",
      "Sermorelin Therapy",
      "Lipotropic + MIC Support",
      "Advanced Peptide Support (if clinically appropriate)",
      "Medical Evaluation",
      "Personalized Protocol",
      "Ongoing Monitoring",
      "Telehealth Support",
      "Compounded Medications (if prescribed)",
    ],
  },
  {
    name: "Women's Total Balance & Glow Program",
    description:
      "Physician-guided 8-week program designed to support women's hormonal balance, metabolism, stress, and overall wellness from the inside out.",
    category: "Programs",
    price: 450,
    onSale: false,
    image: "/womens.png",
    lightboxImage: "/womens.png",
    badge: "Physician-Guided",
    duration: "8 Weeks",
    consultUrl: "https://cal.com/helloyouwellness/30min",
    includes: [
      "Metabolic & Appetite Support",
      "Hormonal Recovery & Sleep Support",
      "Skin, Hair & Anti-Aging Glow",
      "Fat Burn & Energy Support",
      "Medical Evaluation",
      "Personalized Protocol",
      "Ongoing Monitoring",
      "Telehealth Support",
      "Compounded Medications (if prescribed)",
    ],
  },

  {
    name: "GLP-1/GIP Dual Action Program — 8 Weeks",
    description:
      "Our most advanced weight loss program using dual-action Tirzepatide for enhanced metabolic results. Physician-supervised with full support.",
    category: "Programs",
    price: 399,
    onSale: false,
    image: "/GLP-1GIP Dual Action Program — 8 Weeks.png",
    lightboxImage: "/GLP-1GIP Dual Action Program — 8 Weeks.png",
    badge: "ADVANCED",
    duration: "8 Weeks",
    paymentLink: "/book",
    includes: [
      "Tirzepatide (GLP-1/GIP dual agonist) — 8 week supply",
      "Full medical evaluation",
      "Nutrition guide & exercise plan",
      "Lipotropics & B-12 injections (6 sessions)",
      "Fat burner shots (6 sessions)",
      "NAD+ sublingual tablets",
      "Ongoing monitoring & dosage adjustments",
    ],
  },
  {
    name: "GLP-1/GIP Skin Tightening Blend",
    description:
      "Strategic fat loss and metabolism boost with added skin tightening support. A 3-component approach: GLP-1/GIP for appetite control, fat burner for metabolic reset, and glow blend for skin firmness.",
    category: "Programs",
    price: 449,
    onSale: false,
    image: "/tightening.png",
    lightboxImage: "/tightening.png",
    badge: "SIGNATURE BLEND",
    duration: "8 Weeks",
    paymentLink: "/book",
    includes: [
      "GLP-1/GIP — appetite control & insulin sensitivity",
      "Fat Burner + Metabolic Reset — stored fat breakdown & energy",
      "Glow + Skin Tightening — skin firmness & collagen production",
      "Medical evaluation & supervision",
      "Nutrition & exercise plan",
      "Ongoing monitoring",
    ],
  },
  {
    name: "Microdose Advance Program — 5 Weeks",
    description:
      "A 5-week GLP-1 + GIP wellness support program built for hormone balance, energy, and long-term wellness. Designed for new patients and ongoing maintenance with personalized provider oversight.",
    category: "Programs",
    price: 299,
    memberPrice: 149,
    memberPriceLabel: "Member Price (with Refresh+)",
    onSale: false,
    image: "/microdose.png",
    lightboxImage: "/microdose.png",
    badge: "NEW PATIENT SPECIAL",
    duration: "5 Weeks",
    paymentLink: "/book",
    includes: [
      "GLP-1 + GIP wellness support approach",
      "Provider wellness consultation",
      "Personalized support throughout 5 weeks",
      "Wellness kit included",
      "Shipping included",
      "Eligibility review required",
    ],
  },
  {
    name: "Weight Loss Maintenance — Monthly",
    description:
      "For clients who've completed a program and want to maintain results. Stay on track with monthly medication, check-ins, and injection support.",
    category: "Programs",
    price: 129,
    priceSuffix: "/mo",
    onSale: false,
    image: "/weight loss maintenance.png",
    lightboxImage: "/weight loss maintenance.png",
    badge: null,
    duration: "Monthly",
    ctaLabel: "Continue your program",
    phoneEnroll: true,
    includes: [
      "Monthly GLP-1 medication refill",
      "Monthly check-in with provider",
      "2 B-12 injections per month",
      "15% off all add-on services",
    ],
  },

  // CATEGORY: Hormone Programs
  {
    name: "Testosterone Replacement Therapy — 10 Weeks",
    description:
      "Physician-supervised testosterone optimization for men experiencing low T. Comprehensive initial program with labs, evaluation, medication, and monitoring.",
    category: "Hormone Programs",
    price: 499,
    onSale: false,
    image: "/replacement_therapy.png",
    lightboxImage: "/replacement_therapy.png",
    badge: null,
    duration: "10 Weeks",
    paymentLink: "https://buy.stripe.com/9B6aEZ9ob8H87AtbgQdEs1f",
    includes: [
      "Initial blood work & comprehensive hormone panel",
      "Medical evaluation with licensed provider",
      "Testosterone therapy — 10 week protocol",
      "Dosage optimization & monitoring",
      "Follow-up labs at week 5 and week 10",
      "Nutrition & exercise guidance for hormone health",
    ],
  },
  {
    name: "TRT Maintenance — Monthly",
    description:
      "Ongoing testosterone therapy for established patients. Includes monthly medication, monitoring, and quarterly labs.",
    category: "Hormone Programs",
    price: 199,
    priceSuffix: "/mo",
    onSale: false,
    image: "/test replace.png",
    lightboxImage: "/test replace.png",
    badge: null,
    duration: "Monthly",
    ctaLabel: "Continue therapy",
    phoneEnroll: true,
    includes: [
      "Monthly testosterone supply",
      "Monthly provider check-in",
      "Quarterly blood work",
      "Dosage adjustments as needed",
    ],
  },

  // CATEGORY: Peptides
  {
    name: "Recovery + Repair",
    description:
      "BPC-157",
    category: "Peptides",
    originalPrice: null,
    salePrice: null,
    price: 59,
    onSale: false,
    image: "/recovery.png",
    badge: "RECOVERY",
    checkoutSlug: "bpc-157",
    paymentLink: "https://buy.stripe.com/9B6aEW0xLarI1V2aH7aR422",
  },
  {
    name: "Vitality + Anti-Aging",
    description:
      "GHK-Cu",
    category: "Peptides",
    originalPrice: null,
    salePrice: null,
    price: 75,
    onSale: false,
    image: "/vitality.png",
    badge: "ANTI-AGING",
    checkoutSlug: "ghk-cu",
    paymentLink: "https://buy.stripe.com/5kQdR84O1gQ61V2eXnaR41W",
  },
  {
    name: "Lean + Defined",
    description:
      "Ipamorelin and Tesamorelin",
    category: "Peptides",
    originalPrice: null,
    salePrice: null,
    price: 199.99,
    onSale: false,
    image: "/IPA.png",
    badge: "FAT REDUCTION",
    checkoutSlug: "ipamorelin",
    paymentLink: "https://buy.stripe.com/fZu7sK0xL9nE9nu5mNaR425",
  },
  {
    name: "NAD+ 1500 with Resveratrol",
    description: "NAD+ precursor compound with resveratrol. High purity, sealed vial.",
    category: "Peptides",
    originalPrice: 59,
    salePrice: 29,
    onSale: true,
    image: "/images/products/nad-iv.jpg",
    badge: null,
    checkoutSlug: "nad-1500-resveratrol",
    paymentLink: "https://buy.stripe.com/7sYeVc2FTeHYary6qRaR423",
  },

  // CATEGORY: IV Therapy
  {
    name: "NAD+ IV Infusion",
    description: "High-dose NAD+ intravenous therapy. Administered in-clinic by licensed medical professionals.",
    category: "IV Therapy",
    price: 399,
    onSale: false,
    image: "/nad+ ivv.png",
    badge: null,
  },
  {
    name: "Glutathione IV Push",
    description: "Powerful antioxidant IV push. Quick 15-minute administration at our SW Miami clinic.",
    category: "IV Therapy",
    price: 99,
    onSale: false,
    image: "/glutathione iv push.png",
    badge: null,
  },
  {
    name: "Build Your Own IV",
    description: "Customize your IV cocktail. Choose your base, vitamins, minerals, and add-ons with your provider.",
    category: "IV Therapy",
    price: 149,
    onSale: false,
    image: "/byoiv.png",
    badge: "CUSTOMIZE",
  },

  // CATEGORY: Skin Care
  {
    name: "Signature Facial",
    description: "Customized facial treatment tailored to your skin type and concerns. 60 minutes.",
    category: "Skin Care",
    price: 129,
    onSale: false,
    image: "/facial.jpg",
    badge: null,
  },

  // CATEGORY: Supplements & Add-ons
  {
    name: "B-12 Injection",
    description: "Methylcobalamin B-12 injection for energy support. Quick in-clinic administration.",
    category: "Supplements & Add-ons",
    price: 35,
    onSale: false,
    image: "/b12_new.png",
    badge: null,
  },
  {
    name: "Lipotropic Fat Burner Shot",
    description: "MIC injection with B-vitamins for metabolic support. Administered by licensed professionals.",
    category: "Supplements & Add-ons",
    price: 45,
    onSale: false,
    image: "/lipogpt.png",
    badge: null,
    checkoutSlug: "lipotropic-fat-burner",
    paymentLink: "https://buy.stripe.com/3cIdR8fsFbvM9nu16xaR424",
  },
];

