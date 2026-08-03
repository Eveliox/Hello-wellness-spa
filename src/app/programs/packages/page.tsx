import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import {
  formatPrice,
  getPackagesByTier,
  tiers,
  type WellnessPackage,
} from "@/content/packages";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = createMetadata({
  title: "Program Packages & Pricing",
  description: `Fixed-price weight-loss packages at ${site.name}. Choose a duration and tier — every program includes medical intake and provider review.`,
  path: "/programs/packages",
});

function PackageCard({ pkg }: { pkg: WellnessPackage }) {
  const tier = tiers.find((t) => t.id === pkg.tier)!;
  const savings = pkg.originalPrice - pkg.currentPrice;
  const savingsPct = Math.round((savings / pkg.originalPrice) * 100);
  const checkoutHref = pkg.checkoutUrl ?? `/contact?package=${pkg.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      {/* Tier accent bar */}
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{ backgroundColor: tier.accentHex }}
      />

      {/* Media */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-warm">
        <Image
          src={pkg.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: tier.accentHex }}
          />
          {tier.label}
        </div>
        {savingsPct > 0 && (
          <div className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
            Save {savingsPct}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-7">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
            {pkg.duration.replace("-", " ")}
          </p>
          <h3 className="mt-2 font-display text-[1.5rem] leading-[1.2] text-ink text-balance">
            {pkg.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
            {pkg.summary}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl leading-none text-ink tabular-nums">
            {formatPrice(pkg.currentPrice)}
          </span>
          <span className="text-sm text-muted line-through tabular-nums">
            {formatPrice(pkg.originalPrice)}
          </span>
        </div>

        {/* Features */}
        <ul className="grid gap-2.5 text-sm text-ink/85">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: tier.accentHex }}
              >
                <path d="M4 10.5l4 4 8-9" />
              </svg>
              <span className="leading-snug text-pretty">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto space-y-3 pt-2">
          <a
            href={checkoutHref}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-semibold text-white shadow-soft transition hover:bg-[#2a2a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
          >
            Buy Now · {formatPrice(pkg.currentPrice)}
          </a>
          <p className="text-center text-[0.7rem] text-muted">
            Medical intake + provider review required after purchase.
          </p>
        </div>
      </div>
    </article>
  );
}

export default function PackagesPage() {
  return (
    <>
      {/* Editorial masthead */}
      <section className="bg-surface pt-16 pb-12 sm:pt-24 sm:pb-20">
        <Container>
          <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            <Link
              href="/programs"
              className="underline-offset-4 hover:underline"
            >
              Programs
            </Link>
            <span aria-hidden>·</span>
            <span>Packages & Pricing</span>
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[8fr_4fr] lg:items-end">
            <h1 className="font-display text-[clamp(2.25rem,7vw,4.75rem)] leading-[1.05] text-balance text-ink">
              Weight loss programs with prices you can see up front.
            </h1>
            <div className="relative lg:pb-2">
              <div
                className="absolute right-0 top-0 hidden h-full w-px bg-accent-clinical lg:block"
                aria-hidden
              />
              <p className="text-base leading-[1.55] text-ink/78 text-pretty sm:text-lg lg:pr-8">
                Six ready-to-enroll packages across three tiers. Every program
                includes a medical intake and provider review — treatment
                recommendations are individualized, and results vary.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Call {site.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  className="font-semibold text-accent-clinical underline-offset-4 hover:underline"
                >
                  Ask a question →
                </Link>
              </div>
            </div>
          </div>

          {/* Tier legend */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tier.accentHex }}
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink">
                  {tier.label}
                </span>
                <span className="text-sm text-muted">
                  · {tier.description}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tier-grouped cards */}
      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="space-y-16 sm:space-y-20">
            {tiers.map((tier) => {
              const tierPackages = getPackagesByTier(tier.id);
              return (
                <div key={tier.id}>
                  <div className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p
                        className="text-[0.7rem] font-semibold uppercase tracking-[0.3em]"
                        style={{ color: tier.accentHex }}
                      >
                        {tier.eyebrow}
                      </p>
                      <h2 className="mt-2 font-display text-3xl text-ink text-balance sm:text-4xl">
                        {tier.label}
                      </h2>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-muted text-pretty">
                      {tier.description}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {tierPackages.map((pkg) => (
                      <PackageCard key={pkg.slug} pkg={pkg} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Important information — mirrors the language from the source SKUs */}
      <section className="bg-program-paper py-16 text-program-paper-ink sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            Important information
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,5vw,2.25rem)] leading-[1.2] text-balance">
            Every package begins with a medical intake and provider review.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-program-paper-ink/80 text-pretty">
            Treatment recommendations are individualized after you complete your
            medical intake form and a licensed provider reviews your history.
            Results vary from person to person. If a program is not the right
            fit for your health profile, we will tell you before dosing begins.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programs/weight-management"
              className="inline-flex items-center gap-2 rounded-full border border-program-paper-ink/25 px-5 py-2.5 text-sm font-semibold text-program-paper-ink transition hover:border-program-paper-ink"
            >
              About the Weight Management program →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-program-paper-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-program-paper-ink/90"
            >
              Talk to us before you buy →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
