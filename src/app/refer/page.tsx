import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { ReferralForm } from "@/components/refer/referral-form";

export const metadata: Metadata = createMetadata({
  title: "Refer a friend — you both get $50",
  description: `Refer a friend to ${site.name}. When they come in for their first visit, you both get $50 off your next service. No limits, no fine print.`,
  path: "/refer",
});

export default function ReferPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Refer a friend
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Bring a friend.{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              You both
            </span>{" "}
            get $50.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            When your friend comes in for their first visit, we credit both of you $50 toward your
            next service. No limits, no fine print, no expiration.
          </p>
        </Container>
      </section>

      <section className="bg-canvas py-14">
        <Container className="max-w-3xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Fill in your info + theirs",
                body: "We generate a unique code just for the two of you.",
              },
              {
                num: "02",
                title: "We text or email your friend",
                body: "They get the code + a link to book their first visit.",
              },
              {
                num: "03",
                title: "Both credits land",
                body: "When they come in, $50 is credited to both accounts within 48 hours.",
              },
            ].map((step) => (
              <div key={step.num} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#C0392B]">{step.num}</p>
                <p className="mt-2 font-display text-lg text-ink">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="max-w-2xl">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl text-ink">Send your referral</h2>
            <p className="mt-2 text-sm text-muted">
              Takes 30 seconds. No account needed.
            </p>
            <div className="mt-6">
              <ReferralForm />
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-faint">
            Credits apply to services only (not products) and cannot be combined with other
            promotions. Both credits are awarded within 48 hours of your friend&apos;s first
            completed visit. Referrer must be a current or former patient.
          </p>
        </Container>
      </section>
    </>
  );
}
