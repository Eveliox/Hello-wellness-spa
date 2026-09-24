import Image from "next/image";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section id="home-hero" aria-labelledby="home-heading" className="bg-surface-warm">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">
            Hello You Wellness · SW Miami
          </p>
          <h1 id="home-heading" className="mt-5 max-w-xl font-display text-4xl leading-[1.12] text-balance text-ink sm:text-5xl lg:text-6xl">
            Feel better.<br />Feel like you.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">
            Medical weight loss, IV therapy, and aesthetics — with a care team to help you choose what’s right for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={site.bookingUrl} size="lg">Book a free consultation</Button>
            <Button href="/programs/packages" size="lg" variant="secondary">See packages &amp; pricing</Button>
          </div>
          <p className="mt-5 text-sm text-ink/65">
            Licensed care team. Medical screening before treatment.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5]">
          <Image
            src="/images/home/hero-nad.jpg"
            alt=""
            fill
            preload
            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
