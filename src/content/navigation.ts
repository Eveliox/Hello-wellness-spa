export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

/**
 * Primary nav — no Home (logo), no CTAs (handled in header), no Blog (removed).
 */
export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Assisted weight loss", href: "/services/assisted-weight-loss", description: "GLP-1 guidance & lifestyle support" },
      { label: "Aesthetics & cosmetics", href: "/services/aesthetics-cosmetics", description: "Injectables, skin, and refinement" },
      { label: "IV therapy", href: "/services/iv-therapy", description: "Hydration, recovery, and vitality" },
      { label: "Build your own IV", href: "/services/build-your-own-iv", description: "Personalized nutrient blends" },
      { label: "Galleri Test", href: "/services/galleri", description: "Multi-cancer early detection screening" },
      { label: "Peptides", href: "/services/peptide-therapy", description: "Lot-traceable peptides with handling standards" },
      { label: "Intake form", href: "/intake", description: "New patient registration" },
    ],
  },
  { label: "Memberships", href: "/memberships" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/contact" },
];

export const footerGroups = [
  {
    title: "Care",
    links: [
      { label: "Services", href: "/services" },
      { label: "Assisted weight loss", href: "/services/assisted-weight-loss" },
      { label: "Aesthetics", href: "/services/aesthetics-cosmetics" },
      { label: "IV therapy", href: "/services/iv-therapy" },
      { label: "Galleri Screening", href: "/services/galleri" },
      { label: "Peptides", href: "/services/peptide-therapy" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Memberships", href: "/memberships" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Policies", href: "/policies" },
      { label: "Contact", href: "/contact" },
      { label: "Partner with us", href: "/partners" },
    ],
  },
];
