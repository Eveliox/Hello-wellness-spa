export type TestimonialSource = "google" | "instagram" | "in-clinic";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  service?: string;
  source?: TestimonialSource;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Free-form date string ("3 weeks ago", "March 2026") shown next to the source badge. */
  date?: string;
  /** Optional screenshot of the original review — path under /public, e.g. "/reviews/google-camila.png". */
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Verified guest stories — paired with screenshots in /public/reviews/ where available.
 *
 * Editor's note: Replace each `quote` and `name` with the real reviewer text from
 * Google. Drop the original screenshot at `public/reviews/<id>.png` and add it
 * to `imageSrc`. Keep first-name + last-initial attribution to match Google.
 */
export const testimonials: Testimonial[] = [
  {
    id: "g1",
    quote:
      "The space feels like a private members' lounge, not a clinic. My injector listened more than she talked — and the results look like me on a very good week.",
    name: "Camila R.",
    detail: "Kendall · Aesthetics guest",
    service: "Aesthetics",
    source: "google",
    rating: 5,
    date: "3 weeks ago",
  },
  {
    id: "g2",
    quote:
      "Weight management here is structured without being cold. I always know the next step, and I never feel rushed out the door.",
    name: "Jordan M.",
    detail: "Coral Gables · Medical weight loss",
    service: "Weight loss",
    source: "google",
    rating: 5,
    date: "1 month ago",
  },
  {
    id: "g3",
    quote:
      "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I'm back to baseline.",
    name: "Elena S.",
    detail: "Miami Beach · IV therapy",
    service: "IV therapy",
    source: "google",
    rating: 5,
    date: "2 months ago",
  },
  {
    id: "g4",
    quote:
      "I appreciated how transparent they were about what peptides could and could not do. That honesty made it easy to trust the plan.",
    name: "Priya N.",
    detail: "Downtown · Peptide therapy",
    service: "Peptide therapy consultation",
    source: "google",
    rating: 5,
    date: "2 months ago",
  },
  {
    id: "g5",
    quote:
      "Booking is simple, reminders are punctual, and the front desk team is warm without being overbearing. Small details, huge difference.",
    name: "Lauren T.",
    detail: "Edgewater · Multi-service member",
    source: "google",
    rating: 5,
    date: "3 months ago",
  },
];
