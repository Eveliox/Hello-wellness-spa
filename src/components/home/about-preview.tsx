import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutPreview() {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="order-2 space-y-6 lg:order-1">
          <SectionHeading
            eyebrow="About Hello You Wellness"
            title="Holistic care with a medical foundation"
            description="We believe wellness should feel clear — you always know what's happening, why it matters, and what comes next. Whether you're here for weight management, aesthetics, IV therapy, or hormone support, every decision is guided by licensed providers who take the time to explain it."
          />
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Personalized programs across weight loss, skin care, IV therapy, and hormone replacement — no templates, no generic protocols.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Bilingual care team (English and Spanish) serving SW Miami, Kendall, Westchester, and surrounding communities.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Convenient location at 9660 SW 72nd St with same-week availability for most services.
            </li>
          </ul>
          <Button
            href="/about"
            variant="secondary"
            size="lg"
            className="border-[#1a1a1a] text-ink hover:bg-[#1a1a1a] hover:text-white"
          >
            Meet the team →
          </Button>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format&fit=crop"
              alt="Clinician reviewing notes with a guest"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
