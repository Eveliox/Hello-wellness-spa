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
    id: "aesthetics-botox-vs-filler",
    category: "Treatments",
    question: "How do I know if I need Botox or filler?",
    answer:
      "Botox relaxes muscles that cause expression lines (forehead, crow's feet, frown lines). Fillers restore volume in areas that have hollowed or deflated (cheeks, lips, under-eyes, jawline). Many guests benefit from both — your provider will recommend the right combination during your consultation.",
  },
  {
    id: "aesthetics-duration",
    category: "Treatments",
    question: "How long do results last?",
    answer:
      "Botox typically lasts 3-4 months. Hyaluronic acid fillers last 6-18 months depending on the area and product used. Morpheus8 results are cumulative and can last 1-2 years with maintenance sessions. Your provider will outline a realistic timeline during your visit.",
  },
  {
    id: "aesthetics-brands",
    category: "Treatments",
    question: "What brands do you use?",
    answer:
      "We use FDA-approved products from trusted manufacturers including Allergan (Botox, Juvederm), Galderma (Restylane), and other premium brands. Your provider selects the best product for your specific goals and anatomy.",
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
    id: "iv-feel",
    category: "Treatments",
    question: "What does an IV session feel like?",
    answer:
      "Most guests describe it as relaxing. You'll sit in a comfortable lounge chair while the IV drips — many clients read, work on their laptop, or nap. A nurse monitors you throughout. Mild warmth or a cool sensation in the arm is normal.",
  },
  {
    id: "iv-combine",
    category: "Treatments",
    question: "Can I combine an IV with other services?",
    answer:
      "Yes — many guests pair IV therapy with B-12 injections, weight loss consultations, or aesthetics appointments on the same visit. Let us know when booking and we'll schedule accordingly.",
  },
  {
    id: "iv-prescription",
    category: "Treatments",
    question: "Do I need a prescription for IV therapy?",
    answer:
      "IV therapy at Hello You Wellness is administered under medical oversight by licensed nurses. During your intake, a provider reviews your health history and goals to confirm the appropriate blend. No outside prescription is needed.",
  },
  {
    id: "byo-change",
    category: "Treatments",
    question: "Can I change my blend each visit?",
    answer:
      "Absolutely. Your digital formula is saved to your profile, but you can adjust add-ons every time. Many guests experiment until they find their go-to combination, then refine from there.",
  },
  {
    id: "byo-combos",
    category: "Treatments",
    question: "Are there combinations you won't allow?",
    answer:
      "Yes — your clinician reviews every custom blend for safety before preparation. Certain add-ons may interact or exceed recommended ranges. We'll always explain why and suggest alternatives.",
  },
  {
    id: "byo-duration",
    category: "Treatments",
    question: "How long does a custom IV take vs a standard drip?",
    answer:
      "Plan for about 60-75 minutes total — roughly 10 minutes for your consultation and blend review, then 45-60 minutes for the infusion itself. First-time builders may take slightly longer.",
  },
  {
    id: "byo-group",
    category: "Treatments",
    question: "Can I book a custom IV for a group?",
    answer:
      "Yes — we can accommodate couples and small groups with adjacent seating. Each person builds their own blend independently. Call ahead for group availability.",
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
