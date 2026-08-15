import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { programsEs, getProgramEs } from "@/content/programs.es";
import { intakeCtaHref } from "@/lib/practice-better";
import { JsonLd } from "@/components/json-ld";
import { ProgramHero } from "@/components/programs/program-hero";
import { ProgramExpectation } from "@/components/programs/program-expectation";
import { NotForYouIf } from "@/components/programs/not-for-you-if";
import { ProgramServiceLedger } from "@/components/programs/program-service-ledger";
import { PracticeBetterHandoff } from "@/components/programs/practice-better-handoff";
import { ProgramCTABanner } from "@/components/programs/program-cta-banner";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return programsEs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramEs(slug);
  if (!program) return {};
  return createMetadata({
    title: `${program.title} en SW Miami`,
    description: program.summary,
    path: `/programas/${program.slug}`,
    image: program.heroImage,
  });
}

export default async function ProgramaPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramEs(slug);
  if (!program) notFound();

  const ctaHref = intakeCtaHref(program);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: program.title,
    description: program.summary,
    url: `${site.url}/programas/${program.slug}`,
    inLanguage: "es",
    provider: {
      "@type": "MedicalClinic",
      name: site.name,
      url: site.url,
      telephone: site.phoneDisplay,
    },
    availableService: program.includedServices.map((s) => ({
      "@type": "MedicalProcedure",
      name: s,
      url: `${site.url}/services/${s}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <ProgramHero
        slug={program.slug}
        eyebrow={program.eyebrow}
        title={program.title}
        summary={program.summary}
        honestFraming={program.honestFraming}
        heroImage={program.heroImage}
        heroImageAlt={program.heroImageAlt}
        heroCaption={program.heroCaption}
        atAGlance={program.atAGlance}
        trustChips={program.trustChips}
        primaryCta={{ label: program.primaryCtaLabel, href: "#intake" }}
        secondaryCta={{
          label: program.secondaryCtaLabel,
          href: `tel:${site.phoneTel}`,
        }}
        ctaNote={program.ctaNote}
        locale="es"
      />

      <ProgramExpectation
        sessionNote={program.sessionNote}
        steps={program.steps}
        idealFor={program.idealFor}
        idealForHeading="Ideal para"
        locale="es"
      />

      {program.notForYouIf && program.notForYouIf.length > 0 ? (
        <NotForYouIf items={program.notForYouIf} locale="es" />
      ) : null}

      <ProgramServiceLedger serviceSlugs={program.includedServices} locale="es" />

      <PracticeBetterHandoff
        programSlug={program.slug}
        programTitle={program.title}
        locale="es"
        ctaHref={ctaHref}
      />

      <ProgramCTABanner
        heading={program.finalCtaHeading}
        body={program.finalCtaBody}
        primaryCta={{ label: program.primaryCtaLabel, href: "#intake" }}
        secondaryCta={{
          label: `Llámanos ${site.phoneDisplay}`,
          href: `tel:${site.phoneTel}`,
        }}
        locale="es"
      />
    </>
  );
}
