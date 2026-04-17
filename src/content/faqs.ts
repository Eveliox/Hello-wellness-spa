export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Booking" | "Treatments" | "Billing";
};

export const faqs: FaqItem[] = [
  {
    id: "booking",
    category: "Booking",
    question: "How quickly can I get an appointment?",
    answer:
      "Many guests book within a few days. Urgent aesthetic touch-ups and select IV visits may offer same-week availability. If you have a deadline, tell us when you request your visit—we will always be honest about what is realistic.",
  },
  {
    id: "consult",
    category: "General",
    question: "Do I need a consultation first?",
    answer:
      "Most medical services begin with a consultation so we can review history, goals, and candidacy. Some IV visits may proceed after a streamlined intake if you are an established guest and medically appropriate.",
  },
  {
    id: "weight-consult",
    category: "Treatments",
    question: "What should I bring to a weight management visit?",
    answer:
      "Bring a photo ID, insurance card if applicable, a list of medications and supplements, and any recent labs you would like us to review. Wear comfortable clothing for vitals—we will guide you through the rest.",
  },
  {
    id: "weight-loss-expect",
    category: "Treatments",
    question: "How much weight can I expect to lose?",
    answer:
      "Results vary by individual, but many of our guests experience 15-20% body weight reduction over the course of their program. Your provider will set realistic, personalized goals during your initial consultation.",
  },
  {
    id: "weight-loss-side-effects",
    category: "Treatments",
    question: "What are the potential side effects?",
    answer:
      "Common side effects of GLP-1 medications may include mild nausea, which typically subsides within the first few weeks. Your provider will monitor your response and adjust dosing as needed.",
  },
  {
    id: "weight-loss-combine-services",
    category: "Treatments",
    question: "Can I combine this with other Hello You Wellness services?",
    answer:
      "Absolutely. Many of our guests pair their weight loss program with IV therapy, B12 injections, or nutritional counseling for a comprehensive wellness approach.",
  },
  {
    id: "toxin",
    category: "Treatments",
    question: "Will I look frozen after neurotoxin?",
    answer:
      "Our injectors prioritize balanced movement. You should still look expressive—just softened in areas of tension. We can always start conservatively and refine at follow-up.",
  },
  {
    id: "filler",
    category: "Treatments",
    question: "How long does filler swelling last?",
    answer:
      "Mild swelling or bruising can occur for several days depending on the area treated and your personal biology. We provide pre- and post-care instructions to minimize downtime.",
  },
  {
    id: "downtime",
    category: "Treatments",
    question: "Is there downtime after aesthetics appointments?",
    answer:
      "Many guests return to work the same day for toxin appointments. Filler and certain skin treatments may have social downtime—we will outline what to expect before you commit.",
  },
  {
    id: "iv-safety",
    category: "Treatments",
    question: "Are IV infusions safe?",
    answer:
      "IV therapy is performed by licensed clinicians using sterile technique. We review allergies, medications, and medical history before administration. If IV therapy is not appropriate, we will recommend alternatives.",
  },
  {
    id: "iv-frequency",
    category: "Treatments",
    question: "How often can I receive IV therapy?",
    answer:
      "Frequency depends on your goals, labs, and how you respond. Your nurse or provider will suggest an interval that keeps you hydrated without over-treatment.",
  },
  {
    id: "peptide-safety",
    category: "Treatments",
    question: "How do you approach peptide safety?",
    answer:
      "Peptide protocols are prescribed only when medically appropriate, with informed consent, follow-up, and clear documentation. We decline requests outside safe, legal prescribing boundaries.",
  },
  {
    id: "peptide-consult",
    category: "Treatments",
    question: "What happens during a peptide consultation?",
    answer:
      "We review goals, contraindications, and any relevant labs. You will leave with a written plan, pricing transparency, and next steps—never pressure to proceed the same day.",
  },
  {
    id: "payment",
    category: "Billing",
    question: "Do you accept insurance?",
    answer:
      "Coverage varies by service. Some visits may qualify for insurance or HSA/FSA reimbursement depending on your plan. Our team can provide superbills when applicable—ask during booking.",
  },
  {
    id: "financing",
    category: "Billing",
    question: "Do you offer financing or payment plans?",
    answer:
      "We accept all major credit cards and are working on adding financing options. For larger treatment plans, ask about our package pricing during your consultation.",
  },
  {
    id: "free-consult",
    category: "General",
    question: "Is the initial consultation really free?",
    answer:
      "Yes — consultations with our care team are complimentary. We'll discuss your goals, review your options, and only move forward when you're ready. There's never pressure to commit on the spot.",
  },
  {
    id: "cancel",
    category: "Booking",
    question: "What is your cancellation policy?",
    answer:
      "We ask for 24 hours' notice to cancel or reschedule. Late cancellations may be subject to a fee, which we'll outline at the time of booking.",
  },
];

export function faqsByIds(ids: string[]) {
  const set = new Set(ids);
  return faqs.filter((f) => set.has(f.id));
}
