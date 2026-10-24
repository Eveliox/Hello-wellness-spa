import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  tiers,
  getPackagesByTier,
  formatPrice,
  lowestPrice,
  maxSavingsPercent,
  promo,
} from "@/content/packages";

/**
 * Homepage packages strip.
 *
 * Sits high on the page (slot 3, straight after the hero + marquee) because
 * /programs/packages is the only page on the site a visitor can buy from
 * directly — everything else routes to a consult or an intake form. Before
 * this existed you could scroll all nine homepage sections without learning
 * that anything was purchasable.
 *
 * Prices, tiers, and savings are all derived from src/content/packages.ts, so
 * editing a price there updates this section, the hero CTA, and the packages
 * page together. Nothing here is hardcoded.
 */
export function PackagesPreview() {
  return (
    <section className="border-b border-line/80 bg-canvas py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
              Packages &amp; Pricing
            </p>
            <h2 className="font-display text-3xl leading-[1.1] text-balance text-ink sm:text-4xl">
              Start today, from{" "}
              <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
                {formatPrice(lowestPrice)}
              </span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted text-pretty">
              Fixed-price weight-loss programs with provider review built in — no membership
              required, no surprise fees. Enroll online and complete your intake before your
              first visit.
            </p>
          </div>

          {promo.active && (
            <div className="shrink-0 rounded-[var(--radius-card)] border border-[#E8B4A3]/40 bg-[#E8B4A3]/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C5B42]">
                {promo.label}
              </p>
              <p className="mt-1 font-display text-2xl text-ink">
                Save up to {maxSavingsPercent}%
              </p>
              {promo.endsOn && (
                <p className="mt-1 text-xs text-muted">
                  Through{" "}
                  {new Date(`${promo.endsOn}T00:00:00`).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => {
            const tierPackages = getPackagesByTier(tier.id);
            // Cheapest option in the tier anchors the card; the rest are shown
            // as a count so the card stays scannable.
            const entry = tierPackages.reduce((lowest, p) =>
              p.currentPrice < lowest.currentPrice ? p : lowest,
            );
            const savings = Math.floor(
              ((entry.originalPrice - entry.currentPrice) / entry.originalPrice) * 100,
            );

            return (
              <li key={tier.id}>
                <Link
                  href="/programs/packages"
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 transition hover:border-ink/25 hover:shadow-soft"
                >
                  <span
                    aria-hidden
                    className="h-1 w-10 rounded-full"
                    style={{ backgroundColor: tier.accentHex }}
                  />
                  <p className="mt-4 font-display text-xl text-ink">{tier.label}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted text-pretty">
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">
                      From
                    </span>
                    <span className="font-display text-3xl text-ink tabular-nums">
                      {formatPrice(entry.currentPrice)}
                    </span>
                    <span className="text-sm text-faint line-through tabular-nums">
                      {formatPrice(entry.originalPrice)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-[#3FA758]/10 px-2.5 py-1 text-xs font-semibold text-[#2F7D42]">
                      Save {savings}%
                    </span>
                    <span className="text-xs text-muted">
                      {tierPackages.length} plan{tierPackages.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <span className="mt-5 text-sm font-semibold text-ink group-hover:underline">
                    View plans →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/programs/packages"
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            See all packages &amp; pricing
          </Link>
          <p className="text-sm text-muted">
            All programs include a medical intake and provider review before treatment begins.
          </p>
        </div>
      </Container>
    </section>
  );
}
