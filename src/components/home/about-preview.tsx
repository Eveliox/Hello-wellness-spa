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
            description="We believe wellness should feel legible: you always know what is happening, why it matters, and what comes next—whether you are here for weight management, aesthetics, IV therapy, or recovery."
          />
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Personalized programs across weight, skin, IV, hormones, and recovery.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Bilingual team and a mission rooted in whole-person wellbeing.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
              Convenient SW Miami location for Kendall and surrounding neighborhoods.
            </li>
          </ul>
          <Button href="/about" variant="secondary" size="lg">
            Meet the team
          </Button>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format&fit=crop"
              alt="Clinician reviewing notes with a guest"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <p className="mt-3 text-center text-xs text-faint">
            Placeholder image — replace with your team photography.
          </p>
        </div>
      </Container>
    </section>
  );
}
