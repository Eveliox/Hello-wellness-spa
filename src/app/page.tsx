import { HeroSection } from "@/components/home/hero-section";
import { ServicesMarquee } from "@/components/home/services-marquee";
import { TrustSection } from "@/components/home/trust-section";
import { AboutPreview } from "@/components/home/about-preview";
import { TestimonialsHome } from "@/components/home/testimonials-home";
import { FaqPreview } from "@/components/home/faq-preview";
import { MapEmbed } from "@/components/location/map-embed";
import { ServicesPreview } from "@/components/home/services-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { MembershipUpsell } from "@/components/memberships/membership-upsell";
import { Reveal } from "@/components/ui/reveal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesMarquee />
      <Reveal>
        <TrustSection />
      </Reveal>
      <Reveal delayMs={40}>
        <ServicesPreview />
      </Reveal>
      <Reveal delayMs={60}>
        <HowItWorks />
      </Reveal>
      <Reveal delayMs={80}>
        <MembershipUpsell />
      </Reveal>
      <Reveal delayMs={100}>
        <AboutPreview />
      </Reveal>
      <Reveal delayMs={140}>
        <TestimonialsHome />
      </Reveal>
      <Reveal delayMs={180}>
        <FaqPreview />
      </Reveal>
      <Reveal delayMs={220}>
        <MapEmbed />
      </Reveal>
    </>
  );
}
