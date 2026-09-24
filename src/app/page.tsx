import { HeroSection } from "@/components/home/hero-section";
import { ServicesPreview } from "@/components/home/services-preview";
import { PackagesPreview } from "@/components/home/packages-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { FaqPreview } from "@/components/home/faq-preview";
import { VisitSection } from "@/components/home/visit-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <PackagesPreview />
      <HowItWorks />
      <FaqPreview />
      <VisitSection />
    </>
  );
}
