export type NavItem = {
  label: string;
  href: string;
};

/** Keep the first decision small; dedicated pages handle the full catalog. */
export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Packages & Pricing", href: "/programs/packages" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerGroups = [
  {
    title: "Care",
    links: [
      { label: "All services", href: "/services" },
      { label: "All programs", href: "/programs" },
      { label: "Packages & Pricing", href: "/programs/packages" },
      { label: "Memberships", href: "/memberships" },
      { label: "Peptides", href: "/services/peptide-therapy" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Help me choose", href: "/quiz" },
      { label: "Patient intake", href: "/intake" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Our team", href: "/about" },
      { label: "Partner with us", href: "/partners" },
      { label: "Policies", href: "/policies" },
    ],
  },
];
