import type { FaqItem } from "@/content/faqs";

export type PartnerBenefitIcon =
  | "shield"
  | "chart"
  | "megaphone"
  | "award"
  | "compass"
  | "sparkle"
  | "handshake"
  | "clipboard"
  | "heart"
  | "spark";

export type PartnerBenefit = {
  icon: PartnerBenefitIcon;
  title: string;
  body: string;
};

export type PartnerStep = {
  step: number;
  title: string;
  body: string;
};

export type PartnersContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  benefits: PartnerBenefit[];
  howItWorks: PartnerStep[];
  commission: {
    eyebrow: string;
    headline: string;
    rateDisplay: string;
    rateLabel: string;
    body: string;
    example: { title: string; lines: string[] };
  };
  audience: {
    eyebrow: string;
    headline: string;
    body: string;
    goodFit: string[];
  };
  faqs: FaqItem[];
  finalCta: {
    headline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export const partnersContent: PartnersContent = {
  heroEyebrow: "Partner Program",
  heroHeadline: "Send clients to a med spa you'd {italic:actually trust}.",
  heroSubhead:
    "Hello You Wellness Partners is a referral program for South Florida trainers and studio owners. APRN-supervised care for your clients, 15% of their first purchase for you.",
  heroPrimaryCta: "Apply to partner",
  heroSecondaryCta: "See how it works",

  benefits: [
    {
      icon: "chart",
      title: "15% on first purchase",
      body: "Every new client you refer earns you 15% of what they spend on their first visit. Paid monthly via Zelle or Venmo. No minimums, no clawbacks after service is complete.",
    },
    {
      icon: "shield",
      title: "APRN-supervised care",
      body: "Every IV, injection, and program is delivered or supervised by a licensed APRN. Your clients get real medicine, not a mall kiosk with a saline bag.",
    },
    {
      icon: "heart",
      title: "Your clients come back to you",
      body: "Recovery, hormones, and B-12 support the work you're already doing. Clients who feel taken care of holistically stay in your program longer.",
    },
    {
      icon: "handshake",
      title: "Zero cost, zero risk",
      body: "No sign-up fee, no monthly quota, no contract. Approved partners get a unique referral code the same week. Either side can walk away anytime.",
    },
    {
      icon: "megaphone",
      title: "Marketing you can actually use",
      body: "Approved partners get a printable co-branded flyer, digital assets sized for Instagram and stories, and a 'Recommended by Hello You Wellness' window sticker.",
    },
    {
      icon: "spark",
      title: "A person, not a support ticket",
      body: "You get a direct line to our team by text, call, or email. Questions get answered the same day, not routed through a partner portal or chatbot.",
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: "Apply in 2 minutes",
      body: "Tell us about your gym, studio, or coaching practice. We review every application personally, and most approvals go out within one business day.",
    },
    {
      step: 2,
      title: "Get your unique code",
      body: "Approved partners receive a personal referral code (like PARTNER-YOURGYM-A3F2) plus a starter kit with printable cards, digital assets, and the window sticker.",
    },
    {
      step: 3,
      title: "Share it your way",
      body: "Mention it to a client, hand out a card, post it in your studio, share it in your newsletter. However you already talk to clients, this fits in.",
    },
    {
      step: 4,
      title: "Client books and completes their first visit",
      body: "They mention your code at intake or when they arrive. We tag the visit to you the moment it's completed and paid.",
    },
    {
      step: 5,
      title: "Get paid by the 10th",
      body: "On the 10th of each month, we review the previous month's redemptions and send 15% of every first-visit spend via Zelle or Venmo. One transfer, itemized receipt included.",
    },
  ],

  commission: {
    eyebrow: "How you earn",
    headline: "One IV referral pays more than a personal training session.",
    rateDisplay: "15%",
    rateLabel: "of your referral's first purchase, paid monthly",
    body: "The commission triggers only after your client completes and pays for their first service. No clawbacks, no chasing no-shows. Paid via Zelle or Venmo by the 10th of the following month, with a plain-English breakdown of every referral that redeemed.",
    example: {
      title: "The referral math",
      lines: [
        "Client Maria books a $199 IV drip using PARTNER-YOURGYM-A3F2 → you earn $29.85",
        "Client David starts on the $149 Renew membership → you earn $22.35",
        "Client Sam books a $399 NAD+ IV → you earn $59.85",
        "Three referrals in one month = $112.05 in your account by the 10th",
      ],
    },
  },

  audience: {
    eyebrow: "Who this is for",
    headline: "Built for coaches whose clients already ask about recovery.",
    body: "You don't need a certification, a business license, or a specific follower count. What we look for is a real book of clients and a professional reputation you'd rather protect than gamble.",
    goodFit: [
      "Personal trainers coaching 15+ active clients",
      "Boutique gym or studio owners in South Florida",
      "Coaches whose clients ask about hormones, recovery, or GLP-1",
      "Anyone already recommending wellness services informally",
    ],
  },

  faqs: [
    {
      id: "partner-how-paid",
      category: "Billing",
      question: "How do I get paid, and when?",
      answer:
        "15% of your referral's first-visit spend, paid via Zelle or Venmo by the 10th of the following month. You'll get an itemized breakdown listing every referral that redeemed, what they spent, and your cut. One transfer per month, no minimum to trigger payout.",
    },
    {
      id: "partner-certification",
      category: "General",
      question: "Do I need a certification or business license to apply?",
      answer:
        "No hard requirement. We review every application case by case and favor established professionals with an active client base (personal trainers, gym owners, studio operators, coaches). Tell us about your practice on the application and we'll follow up within one business day.",
    },
    {
      id: "partner-location",
      category: "General",
      question: "What if I'm not in Miami?",
      answer:
        "Partners can be located anywhere. The requirement is that your client can visit our SW Miami location for their appointment. South Florida partners (Miami-Dade, Broward, the Keys) obviously see the most redemptions, but we've approved partners with client bases that regularly travel to Miami.",
    },
    {
      id: "partner-tracking",
      category: "General",
      question: "How does my referral get tracked?",
      answer:
        "Each approved partner gets a unique code (e.g. PARTNER-YOURGYM-A3F2). Your client either enters it when they book online or mentions it at intake. We attach it to their visit in our system before service. If they forget, our front desk asks 'How did you hear about us?' at every intake. Your name comes up, we credit you.",
    },
    {
      id: "partner-cancel",
      category: "Billing",
      question: "What if my client cancels or doesn't show?",
      answer:
        "You only earn commission after your client actually completes and pays for their first service. No-shows, cancellations, and refunded visits don't count. And we don't claw back a commission once it's been paid.",
    },
    {
      id: "partner-materials",
      category: "General",
      question: "Do you provide marketing materials?",
      answer:
        "Yes. Approved partners get a starter kit: a printable co-branded flyer (your name and logo alongside ours), digital assets sized for Instagram feed and stories, referral cards you can hand out, and a 'Recommended by Hello You Wellness' window sticker for your studio.",
    },
    {
      id: "partner-dashboard",
      category: "General",
      question: "Do I get a login to see my referrals?",
      answer:
        "Yes. Approved partners get a private dashboard showing your code, monthly referral counts, and earnings. To stay HIPAA-compliant we show anonymized totals only. You'll see how many people redeemed and what you earned, but not patient names or the specific services they received.",
    },
    {
      id: "partner-contract",
      category: "General",
      question: "Is there a contract or minimum commitment?",
      answer:
        "No contract, no minimums, no quotas. Either side can end the partnership at any time. Any commissions earned before you leave still get paid on the normal monthly cycle.",
    },
  ],

  finalCta: {
    headline: "Ready to send your first client?",
    body: "Applications take about two minutes. We review every one personally and reply within one business day, usually the same day.",
    primaryCta: "Apply to partner",
    secondaryCta: "Call {phone}",
  },
};
