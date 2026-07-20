import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export type ServiceCTABannerCta = {
  label: string;
  href: string;
};

export type ServiceCTABannerProps = {
  /**
   * Visual weight of the banner.
   * - `dark`: chrome slab with red primary CTA — for high-intent pages (TRT, BBL, memberships-style conversion pushes).
   * - `soft`: off-white card with dark primary CTA — for educational pages (Galleri, general services) where hard-sell would feel wrong.
   */
  variant?: "dark" | "soft";
  heading: string;
  body: string;
  primaryCta: ServiceCTABannerCta;
  secondaryCta?: ServiceCTABannerCta;
};

export function ServiceCTABanner({
  variant = "dark",
  heading,
  body,
  primaryCta,
  secondaryCta,
}: ServiceCTABannerProps) {
  const isDark = variant === "dark";

  return (
    <section className="pb-20 pt-16">
      <Container>
        <div
          className={
            "rounded-[2rem] border border-line p-8 text-center shadow-inner sm:p-10 " +
            (isDark ? "bg-chrome-cta text-white" : "bg-surface-warm text-ink")
          }
        >
          <h2
            className={"font-display text-3xl " + (isDark ? "text-white" : "text-ink")}
          >
            {heading}
          </h2>
          <p
            className={
              "mx-auto mt-3 max-w-xl text-sm " +
              (isDark ? "text-white/75" : "text-muted")
            }
          >
            {body}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={primaryCta.href}
              size="lg"
              className={
                isDark
                  ? "bg-accent-brand text-white hover:bg-accent-brand/90"
                  : "bg-chrome-cta text-white hover:bg-chrome-cta/90"
              }
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              isDark ? (
                <a
                  href={secondaryCta.href}
                  className="text-sm font-medium text-white/85 underline-offset-2 hover:underline"
                >
                  {secondaryCta.label}
                </a>
              ) : (
                <Button href={secondaryCta.href} variant="secondary" size="lg">
                  {secondaryCta.label}
                </Button>
              )
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
