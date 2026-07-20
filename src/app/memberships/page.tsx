import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { memberships } from "@/data/memberships";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MembershipCard } from "@/components/memberships/membership-card";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";
import type { FaqItem } from "@/content/faqs";

export const metadata: Metadata = createMetadata({
  title: "Memberships in SW Miami",
  description:
    "Refresh, Renew, and Revive memberships at Hello You Wellness Center. Monthly IV, injections, aesthetic treatments, and discounts — with a 3-month minimum and no enrollment fees.",
  path: "/memberships",
});

const faqs: FaqItem[] = [
  {
    id: "commitment",
    question: "Is there a minimum commitment?",
    answer:
      "Every membership requires a 3-month minimum commitment. After that you can cancel anytime with no fees, or pause your membership for up to 1 month per year.",
    category: "Billing",
  },
  {
    id: "rollover",
    question: "Do unused treatments roll over?",
    answer:
      "Renew and Revive members get one month of rollover — if you don't use your IV or aesthetic credit this month, it carries into next. Refresh credits reset monthly.",
    category: "Billing",
  },
  {
    id: "switch",
    question: "Can I switch tiers?",
    answer:
      "Yes. You can upgrade at any time and the new pricing kicks in the following billing cycle. Downgrades apply after your current 3-month commitment period ends.",
    category: "Billing",
  },
  {
    id: "who",
    question: "Who runs the treatments?",
    answer:
      "Every treatment is delivered or supervised by our licensed APRNs. Members get priority booking, so you're not competing with drop-ins for the best time slots.",
    category: "General",
  },
  {
    id: "programs",
    question: "Do memberships include weight loss or hormone programs?",
    answer:
      "No — those are separate clinical programs. But Revive members get exclusive pricing on both weight loss and hormone therapy, and all tiers get 15–25% off the standard rates.",
    category: "Billing",
  },
];

export default function MembershipsPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />

      <section className="border-b border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Memberships
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Wellness that pays{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              for itself
            </span>
            .
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Three tiers. Each one includes monthly treatments plus 15–25% off everything else at
            Hello You. Most members save the price of the membership on their first visit alone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#tiers" size="lg">
              See the tiers
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
              Call {site.phoneDisplay}
            </Button>
          </div>
        </Container>
      </section>

      <section id="tiers" className="bg-canvas py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
            {memberships.map((tier) => (
              <MembershipCard key={tier.id} tier={tier} />
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">
            All memberships require a 3-month minimum commitment. Cancel anytime after. No
            enrollment fees. Pause your membership for up to 1 month per year.
          </p>
        </Container>
      </section>

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            The membership math
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            One visit pays for the month.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Refresh</p>
              <p className="mt-2 font-display text-2xl text-ink">$79 pays for itself with…</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                One B-12 shot ($35) + one IV add-on discount ($25) + 15% off a facial ($30) ={" "}
                <strong className="text-ink">~$90 back on month one</strong>.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#C0392B] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0392B]">
                Renew · Most popular
              </p>
              <p className="mt-2 font-display text-2xl text-ink">$149 pays for itself with…</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                One IV session ($199) alone. Everything after that — B-12, lipotropic, 20% off — is
                pure savings.{" "}
                <strong className="text-ink">~$170/month above the membership price</strong>.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Revive</p>
              <p className="mt-2 font-display text-2xl text-ink">$249 pays for itself with…</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                One NAD+ IV ($399) OR one aesthetic treatment ($129) + one IV ($199). Everything
                else stacks on top. <strong className="text-ink">~$508 in monthly value</strong>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-muted">
              Not seeing your question? Text or call {site.phoneDisplay} and we&apos;ll walk you
              through it.
            </p>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" className="mt-6" size="md">
              Call {site.phoneDisplay}
            </Button>
          </div>
          <div>
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] border border-line bg-[#1a1a1a] p-8 text-center text-white shadow-inner sm:p-10">
            <h2 className="font-display text-3xl">Ready to join?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">
              Enrollment takes 60 seconds. Your first credits are available the day you join —
              members with same-week appointments book them before non-members even see them.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="#tiers" size="lg" className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90">
                Choose your tier
              </Button>
              <Button
                href={`tel:${site.phoneTel}`}
                variant="secondary"
                size="lg"
                className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                Call {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
