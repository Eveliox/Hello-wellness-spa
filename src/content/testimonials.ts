export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  service?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The space feels like a private members’ lounge, not a clinic. My injector listened more than she talked—and the results look like me on a very good week.",
    name: "Camila R.",
    detail: "Kendall · Aesthetics guest",
    service: "Aesthetics",
  },
  {
    id: "t2",
    quote:
      "Weight management here is structured without being cold. I always know the next step, and I never feel rushed out the door.",
    name: "Jordan M.",
    detail: "Coral Gables · Medical weight loss",
    service: "Weight loss",
  },
  {
    id: "t3",
    quote:
      "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I’m back to baseline.",
    name: "Elena S.",
    detail: "Miami Beach · IV therapy",
    service: "IV therapy",
  },
  {
    id: "t4",
    quote:
      "I appreciated how transparent they were about what peptides could and could not do. That honesty made it easy to trust the plan.",
    name: "Priya N.",
    detail: "Downtown · Peptide therapy",
    service: "Peptides",
  },
  {
    id: "t5",
    quote:
      "Booking is simple, reminders are punctual, and the front desk team is warm without being overbearing. Small details, huge difference.",
    name: "Lauren T.",
    detail: "Edgewater · Multi-service member",
  },
];
