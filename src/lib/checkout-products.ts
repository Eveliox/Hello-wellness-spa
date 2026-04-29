export type CheckoutProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  priceCents: number;
  originalPriceCents?: number;
  isPhysical: boolean;
  isWeightLossProgram: boolean;
  isPeptide: boolean;
};

export const checkoutProducts: CheckoutProduct[] = [
  {
    slug: "all-in-one-8-weeks",
    name: "All-in-One Weight Loss Program — 8 Weeks",
    category: "Programs",
    image: "/8weeks.png",
    priceCents: 22900,
    isPhysical: false,
    isWeightLossProgram: true,
    isPeptide: false,
  },
  {
    slug: "all-in-one-6-weeks",
    name: "All-in-One Weight Loss Program — 6 Weeks",
    category: "Programs",
    image: "/6weeks.png",
    priceCents: 18900,
    isPhysical: false,
    isWeightLossProgram: true,
    isPeptide: false,
  },
  {
    slug: "bpc-157",
    name: "BPC-157 — Research Peptide",
    category: "Peptides (Research Use Only)",
    image: "/bpc157.png",
    priceCents: 5900,
    isPhysical: true,
    isWeightLossProgram: false,
    isPeptide: true,
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu — Research Peptide",
    category: "Peptides (Research Use Only)",
    image: "/ghkgpt.png",
    priceCents: 7500,
    isPhysical: true,
    isWeightLossProgram: false,
    isPeptide: true,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin — Research Peptide",
    category: "Peptides (Research Use Only)",
    image: "/ipagpt.png",
    priceCents: 19999,
    isPhysical: true,
    isWeightLossProgram: false,
    isPeptide: true,
  },
  {
    slug: "nad-1500-resveratrol",
    name: "NAD+ 1500 with Resveratrol",
    category: "Peptides (Research Use Only)",
    image: "/images/products/nad-resveratrol.jpg",
    priceCents: 2900,
    originalPriceCents: 5900,
    isPhysical: true,
    isWeightLossProgram: false,
    isPeptide: true,
  },
  {
    slug: "lipotropic-fat-burner",
    name: "Lipotropic Fat Burner Shot",
    category: "Supplements & Add-ons",
    image: "/lipogpt.png",
    priceCents: 4500,
    isPhysical: false,
    isWeightLossProgram: false,
    isPeptide: false,
  },
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return checkoutProducts.find((p) => p.slug === slug);
}
