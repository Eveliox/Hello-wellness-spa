import { testimonials } from "@/content/testimonials";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function TestimonialsHome() {
  return (
    <section className="bg-surface py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SectionHeading
              eyebrow="Testimonials"
              title="Guests describe the feeling better than we ever could"
              description="Every review reflects a real visit—edited only for privacy."
            />
            {site.googleRating && site.googleReviewCount ? (
              <p className="text-sm font-semibold text-ink">
                {site.googleRating} ★ from {site.googleReviewCount} Google reviews
              </p>
            ) : null}
          </div>
          <Button
            href={site.googleReviewsUrl}
            variant="secondary"
            className="self-start sm:self-auto"
            target="_blank"
            rel="noreferrer"
          >
            Read more stories
          </Button>
        </div>
        <div className="mt-8 md:hidden">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="relative w-[min(92vw,26rem)] shrink-0 snap-start overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm"
              >
                <p className="pointer-events-none absolute left-4 top-3 font-display text-[60px] leading-none text-ink/[0.05]">
                  “
                </p>
                <div className="relative">
                  <div className="flex gap-1 text-[14px] text-[#D4A017]" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} aria-hidden>
                        ★
                      </span>
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-muted">{t.quote}</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
                  <p className="text-xs text-faint">{t.detail}</p>
                  {t.service ? <p className="mt-2 text-xs font-medium text-accent">{t.service}</p> : null}
                </div>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-8 hidden md:columns-2 md:gap-6 lg:columns-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="relative mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm"
            >
              <p className="pointer-events-none absolute left-4 top-3 font-display text-[60px] leading-none text-ink/[0.05]">
                “
              </p>
              <div className="relative">
                <div className="flex gap-1 text-[14px] text-[#D4A017]" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} aria-hidden>
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-muted">{t.quote}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
                <p className="text-xs text-faint">{t.detail}</p>
                {t.service ? <p className="mt-2 text-xs font-medium text-accent">{t.service}</p> : null}
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
