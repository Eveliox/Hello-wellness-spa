export type MembershipBenefit = {
  text: string;
  included: boolean;
};

export type MembershipValueRow = {
  label: string;
  value: string;
};

export type Membership = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  featured?: boolean;
  treatments: MembershipBenefit[];
  discounts: MembershipBenefit[];
  perks: MembershipBenefit[];
  valueRows: MembershipValueRow[];
  totalValue: string;
  savings: string;
};

export const memberships: Membership[] = [
  {
    id: "essential",
    name: "Essential",
    price: 79,
    tagline: "The easy yes — maintenance made simple",
    treatments: [
      { included: true, text: "1 B-12 injection or 1 lipotropic fat burner shot (your choice each month)" },
      { included: true, text: "1 complimentary add-on upgrade when booking any IV session" },
      { included: false, text: "No monthly IV included" },
      { included: false, text: "No aesthetic services included" },
    ],
    discounts: [
      { included: true, text: "15% off all services (IV, facials, Morpheus8, programs)" },
      { included: true, text: "10% off store products and supplements" },
    ],
    perks: [
      { included: true, text: "Priority booking (48-hour early access to new slots)" },
      { included: true, text: "Birthday month: free B-12 + lipotropic combo" },
    ],
    valueRows: [
      { label: "B-12 or lipotropic", value: "$35–45" },
      { label: "IV add-on upgrade", value: "~$25" },
      { label: "Avg 15% savings on 1 service", value: "~$30" },
    ],
    totalValue: "~$90–100",
    savings: "~$11–21/month",
  },
  {
    id: "premium",
    name: "Premium",
    price: 149,
    tagline: "The sweet spot — IV therapy included monthly",
    featured: true,
    treatments: [
      { included: true, text: "1 IV therapy session per month (any standard drip up to $199 value — Myers', Glutathione, or BYO base)" },
      { included: true, text: "1 B-12 injection + 1 lipotropic shot (both included, not a choice)" },
      { included: false, text: "No aesthetic services included monthly" },
    ],
    discounts: [
      { included: true, text: "20% off all services" },
      { included: true, text: "15% off store products and supplements" },
      { included: true, text: "Free shipping on all online orders" },
    ],
    perks: [
      { included: true, text: "Priority booking" },
      { included: true, text: "Birthday month: free signature facial ($129 value)" },
      { included: true, text: "Rollover: unused IV credits roll over 1 month" },
    ],
    valueRows: [
      { label: "1 IV session (up to $199)", value: "$199" },
      { label: "B-12 injection", value: "$35" },
      { label: "Lipotropic shot", value: "$45" },
      { label: "Avg 20% savings on 1 service", value: "~$40" },
    ],
    totalValue: "~$319",
    savings: "~$170/month",
  },
  {
    id: "vip",
    name: "VIP",
    price: 249,
    tagline: "The inner circle — everything, every month",
    treatments: [
      { included: true, text: "1 IV therapy session (any drip including NAD+ at $399 value)" },
      { included: true, text: "1 aesthetic service per month (signature facial, dermaplaning, or chemical peel)" },
      { included: true, text: "1 B-12 + 1 lipotropic + 1 glutathione push (all three included)" },
    ],
    discounts: [
      { included: true, text: "25% off all services (including Morpheus8, injectables, programs)" },
      { included: true, text: "20% off store products and supplements" },
      { included: true, text: "Free shipping on everything" },
      { included: true, text: "VIP pricing on weight loss and hormone programs" },
    ],
    perks: [
      { included: true, text: "Same-day appointment availability (when open slots exist)" },
      { included: true, text: "Priority booking — first access to all new slots" },
      { included: true, text: "Birthday month: free Morpheus8 session ($799 value)" },
      { included: true, text: "Rollover: unused credits roll over 1 month" },
      { included: true, text: "Guest pass: bring a friend once per quarter for a free B-12 shot" },
    ],
    valueRows: [
      { label: "1 IV session (up to $399)", value: "$399" },
      { label: "1 aesthetic service", value: "$129" },
      { label: "B-12 + lipotropic + glutathione", value: "$179" },
      { label: "Avg 25% savings on 1 service", value: "~$50" },
    ],
    totalValue: "~$757",
    savings: "~$508/month",
  },
];
