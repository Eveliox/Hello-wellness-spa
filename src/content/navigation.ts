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
      { label: "Research Peptides", href: "/store?category=Peptides%20(Research%20Use%20Only)", description: "Research-use products and handling standards" },
    ],
  },
  { label: "Quiz", href: "/quiz" },
  { label: "Store", href: "/store" },
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
      { label: "Research Peptides", href: "/store?category=Peptides%20(Research%20Use%20Only)" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Store", href: "/store" },
      { label: "Policies", href: "/policies" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
