export type ProductCategory =
  | "All Products"
  | "Programs"
  | "Weight Loss Programs"
  | "Peptides (Research Use Only)"
  | "IV Therapy"
  | "Skin Care"
  | "Supplements & Add-ons";

export type Product = {
  name: string;
  description: string;
  category: Exclude<ProductCategory, "All Products">;
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
};

export const categories: ProductCategory[] = [
  "All Products",
  "Programs",
  "Weight Loss Programs",
  "Peptides (Research Use Only)",
  "IV Therapy",
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
    image: "/8weeks.png",
    lightboxImage: "/8weeks.png",
    badge: "All Included",
    duration: "8 Weeks",
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
    image: "/6weeks.png",
    lightboxImage: "/6weeks.png",
    badge: "Flat Rate · All Included",
    duration: "6 Weeks",
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
    image: "/mens-program.png",
    lightboxImage: "/mens-program.png",
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
    image: "/womens-program.png",
    lightboxImage: "/womens-program.png",
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

  // CATEGORY: Peptides (Research Use Only)
  {
    name: "BPC-157 — Research Peptide",
    description: "Lyophilized peptide for in-vitro laboratory research. 5mg, ≥98% purity (HPLC verified).",
    category: "Peptides (Research Use Only)",
    originalPrice: null,
    salePrice: null,
    price: 59,
    onSale: false,
    image: "/bpc157.png",
    badge: "RESEARCH USE ONLY",
    paymentLink: "https://buy.stripe.com/9B6aEW0xLarI1V2aH7aR422",
  },
  {
    name: "GHK-Cu — Research Peptide",
    description: "Copper peptide complex for in-vitro research. 50mg lyophilized powder, ≥98% purity.",
    category: "Peptides (Research Use Only)",
    originalPrice: null,
    salePrice: null,
    price: 75,
    onSale: false,
    image: "/ghkgpt.png",
    badge: "RESEARCH USE ONLY",
    paymentLink: "https://buy.stripe.com/5kQdR84O1gQ61V2eXnaR41W",
  },
  {
    name: "Ipamorelin — Research Peptide",
    description: "Growth hormone secretagogue peptide for in-vitro laboratory research. High purity, sealed vial.",
    category: "Peptides (Research Use Only)",
    originalPrice: null,
    salePrice: null,
    price: 199.99,
    onSale: false,
    image: "/ipagpt.png",
    badge: "RESEARCH USE ONLY",
    paymentLink: "https://buy.stripe.com/fZu7sK0xL9nE9nu5mNaR425",
  },
  {
    name: "NAD+ 1500 with Resveratrol",
    description: "NAD+ precursor compound for in-vitro cellular research. High purity, sealed vial.",
    category: "Peptides (Research Use Only)",
    originalPrice: 59,
    salePrice: 29,
    onSale: true,
    image: "/images/products/nad-resveratrol.jpg",
    badge: "RESEARCH USE ONLY",
    paymentLink: "https://buy.stripe.com/7sYeVc2FTeHYary6qRaR423",
  },

  // CATEGORY: IV Therapy
  {
    name: "NAD+ IV Infusion",
    description: "High-dose NAD+ intravenous therapy. Administered in-clinic by licensed medical professionals.",
    category: "IV Therapy",
    price: 399,
    onSale: false,
    image: "/images/products/nad-iv.jpg",
    badge: null,
  },
  {
    name: "Glutathione IV Push",
    description: "Powerful antioxidant IV push. Quick 15-minute administration at our SW Miami clinic.",
    category: "IV Therapy",
    price: 99,
    onSale: false,
    image: "/images/products/glutathione.jpg",
    badge: null,
  },
  {
    name: "Build Your Own IV",
    description: "Customize your IV cocktail. Choose your base, vitamins, minerals, and add-ons with your provider.",
    category: "IV Therapy",
    price: 149,
    onSale: false,
    image: "/images/products/custom-iv.jpg",
    badge: "CUSTOMIZE",
  },

  // CATEGORY: Skin Care
  {
    name: "Morpheus8 — Single Session",
    description: "RF microneedling treatment for skin tightening and collagen stimulation. Face or body.",
    category: "Skin Care",
    price: 799,
    onSale: false,
    image: "/images/products/morpheus8.jpg",
    badge: null,
  },
  {
    name: "Signature Facial",
    description: "Customized facial treatment tailored to your skin type and concerns. 60 minutes.",
    category: "Skin Care",
    price: 129,
    onSale: false,
    image: "/images/products/facial.jpg",
    badge: null,
  },

  // CATEGORY: Supplements & Add-ons
  {
    name: "B-12 Injection",
    description: "Methylcobalamin B-12 injection for energy support. Quick in-clinic administration.",
    category: "Supplements & Add-ons",
    price: 35,
    onSale: false,
    image: "/images/products/b12.jpg",
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
    paymentLink: "https://buy.stripe.com/3cIdR8fsFbvM9nu16xaR424",
  },
];

