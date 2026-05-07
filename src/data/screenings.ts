/**
 * Screening services — non-purchasable medical screenings that require provider consultation.
 * These are NOT products: no cart, no checkout, only inquiry CTAs (WhatsApp + Learn more).
 */

export const GALLERI_WHATSAPP_URL =
  "https://wa.me/17867803626?text=Hola+Hello+You+Wellness+Center%2C+me+gustar%C3%ADa+recibir+m%C3%A1s+informaci%C3%B3n+sobre+el+Galleri+Test.";

export const GALLERI_DISCLAIMER =
  "The Galleri® test is a multi-cancer early detection screening designed to identify cancer signals and should not replace guideline-recommended screenings such as mammograms, colonoscopies, Pap smears, or other physician-recommended evaluations. This screening is available only through a licensed healthcare provider and may not be appropriate for all individuals. A “No Cancer Signal Detected” result does not rule out the presence of cancer. A “Cancer Signal Detected” result does not confirm a cancer diagnosis and additional testing may be required. Hello You Wellness Center does not diagnose, treat, cure, or prevent cancer. All medical decisions, laboratory testing, and follow-up care are managed by licensed healthcare professionals and certified laboratories. Individual experiences and outcomes may vary. Availability may vary by state.";

export type Screening = {
  id: string;
  name: string;
  trademark: string;
  category: "Screenings & Diagnostics";
  tagline: string;
  description: string;
  features: string[];
  inquiryUrl: string;
  detailsUrl: string;
  image: string;
  shortDisclaimer: string;
};

export const screenings: Screening[] = [
  {
    id: "galleri",
    name: "Galleri Multi-Cancer Early Detection Test",
    trademark: "®",
    category: "Screenings & Diagnostics",
    tagline: "A proactive blood screening designed to detect cancer signals associated with 50+ cancer types through a single blood draw. Provider-guided, wellness-focused.",
    description: "A proactive blood screening designed to detect cancer signals associated with 50+ cancer types through a single blood draw. Provider-guided, wellness-focused.",
    features: [
      "Simple blood draw",
      "Results in ~2 weeks",
      "50+ cancer types",
      "Provider consultation included",
    ],
    inquiryUrl: GALLERI_WHATSAPP_URL,
    detailsUrl: "/services/galleri",
    image: "/galleri.png",
    shortDisclaimer:
      "Available by prescription only. Complements — does not replace — routine screenings recommended by your physician.",
  },
];
