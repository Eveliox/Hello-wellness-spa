export type ProductCategory =
  | "All Products"
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
};

export const categories: ProductCategory[] = [
  "All Products",
  "Weight Loss Programs",
  "Peptides (Research Use Only)",
  "IV Therapy",
  "Skin Care",
  "Supplements & Add-ons",
];

export const products: Product[] = [
  // CATEGORY: Weight Loss Programs
  {
    name: "GLP-1 Program – Initial",
    description:
      "Personalized GLP-1 weight loss program with medical oversight, initial consultation, and first month of medication.",
    category: "Weight Loss Programs",
    originalPrice: 280,
    salePrice: 199.99,
    onSale: true,
    image: "/images/products/glp-1-program.jpg",
    badge: null,
    paymentLink: "https://buy.stripe.com/9B6eVc80ddDUdDKbLbaR41X",
  },
  {
    name: "GLP-1 / GIP Program – Initial",
    description:
      "Dual-action GLP-1/GIP program for enhanced results. Includes consultation, labs as appropriate, and first month supply.",
    category: "Weight Loss Programs",
    originalPrice: 420,
    salePrice: 299,
    onSale: true,
    image: "/images/products/glp-1-gip-program.jpg",
    badge: null,
  },
  {
    name: "4 Weeks Personalized Weight Wellness Program",
    description:
      "Comprehensive 4-week program tailored to your goals. Includes medical oversight, nutrition guidance, and medication.",
    category: "Weight Loss Programs",
    originalPrice: 390,
    salePrice: 145,
    onSale: true,
    image: "/images/products/4-week-program.jpg",
    badge: null,
  },
  {
    name: "Christmas Combo",
    description:
      "One month of semaglutide treatment, 4 lipotropic/B12/fat burner shots, 4 NAD+ sublingual tablets, and 4 GHK-Cu doses.",
    category: "Weight Loss Programs",
    originalPrice: 698,
    salePrice: 349,
    onSale: true,
    image: "/images/products/christmas-combo.jpg",
    badge: null,
  },
  {
    name: "Tirz Plus BOGO",
    description: "Buy-one-get-one Tirzepatide program with metabolic support and lipotropic supplementation.",
    category: "Weight Loss Programs",
    originalPrice: 579,
    salePrice: 249,
    onSale: true,
    image: "/images/products/tirz-plus.jpg",
    badge: null,
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
    image: "/images/products/bpc-157.jpg",
    badge: "RESEARCH USE ONLY",
  },
  {
    name: "GHK-Cu — Research Peptide",
    description: "Copper peptide complex for in-vitro research. 50mg lyophilized powder, ≥98% purity.",
    category: "Peptides (Research Use Only)",
    originalPrice: null,
    salePrice: null,
    price: 75,
    onSale: false,
    image: "/images/products/ghk-cu.jpg",
    badge: "RESEARCH USE ONLY",
    paymentLink: "https://buy.stripe.com/5kQdR84O1gQ61V2eXnaR41W",
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
  },

  // CATEGORY: IV Therapy
  {
    name: "Myers' Cocktail IV",
    description: "Classic vitamin and mineral IV infusion. Includes B-vitamins, Vitamin C, magnesium, and calcium.",
    category: "IV Therapy",
    price: 199,
    onSale: false,
    image: "/images/products/myers-cocktail.jpg",
    badge: null,
  },
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
    image: "/images/products/lipo-shot.jpg",
    badge: null,
  },
];

