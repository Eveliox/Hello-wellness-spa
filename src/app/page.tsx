import { HeroSection } from "@/components/home/hero-section";
import { TrustSection } from "@/components/home/trust-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { AboutPreview } from "@/components/home/about-preview";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { TestimonialsHome } from "@/components/home/testimonials-home";
import { TransformationPlaceholder } from "@/components/home/transformation-placeholder";
import { FaqPreview } from "@/components/home/faq-preview";
import { InstagramSection } from "@/components/home/instagram-section";
import { MapEmbed } from "@/components/location/map-embed";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturedServices />
      <AboutPreview />
      <WhyChooseSection />
      <TestimonialsHome />
      <TransformationPlaceholder />
      <FaqPreview />
      <InstagramSection />
      <MapEmbed />
    </>
  );
}
