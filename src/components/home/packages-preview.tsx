import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatPrice, lowestPrice } from "@/content/packages";

/** Full comparisons belong on the pricing page, not in another homepage catalog. */
export function PackagesPreview() {
  return (
    <section aria-labelledby="home-packages-heading" className="border-y border-line bg-surface-warm py-12 sm:py-16">
      <Container className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">Packages &amp; pricing</p>
          <h2 id="home-packages-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">Weight-loss packages, clearly priced.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75">
            Compare 6- and 12-week packages, see what each includes, and choose your next step.
          </p>
          <p className="mt-3 text-sm text-ink/65">Medical intake and provider review are required before treatment.</p>
        </div>
        <div className="md:justify-self-end">
          <p className="text-sm text-ink/70">Packages from</p>
          <p className="mt-1 font-display text-4xl text-ink">{formatPrice(lowestPrice)}</p>
          <p className="mt-2 text-sm text-ink/70">Fixed-duration packages, not monthly memberships.</p>
          <Button href="/programs/packages" className="mt-5" size="lg">Compare packages &amp; pricing</Button>
        </div>
      </Container>
    </section>
  );
}
