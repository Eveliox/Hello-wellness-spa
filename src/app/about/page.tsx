import Image from "next/image";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: `Meet ${site.name}—a Miami med spa pairing medical rigor with serene, feminine hospitality.`,
  path: "/about",
});

const team = [
  { name: "Dr. Amara Ellis, MD", role: "Medical director", note: "Placeholder headshot — replace in /public or CMS." },
  { name: "Sofia Nguyen, PA-C", role: "Clinical lead · aesthetics", note: "Placeholder headshot — replace in /public or CMS." },
  { name: "Mia Alvarez, RN", role: "Infusion & peptide nursing", note: "Placeholder headshot — replace in /public or CMS." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">About</p>
          <h1 className="mt-3 font-display text-4xl text-balance text-ink sm:text-5xl">
            A studio built for modern Miami women—and everyone they care for.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Hello You Wellness Center exists at the intersection of evidence-informed medicine and approachable
            hospitality. We believe premium care should feel legible: you always know what is happening, why it
            matters, and what comes next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Instagram
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              Explore services
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=80&auto=format&fit=crop"
              alt="Bright med spa reception with sculptural florals"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-muted">
            <SectionHeading
              eyebrow="Our philosophy"
              title="Luxury is predictability—with warmth"
              description="From assisted weight loss to peptide protocols, we anchor every recommendation in safety, informed consent, and respect for your autonomy."
            />
            <p>
              We invest in longer appointments, quieter schedules, and technology that reduces friction without
              replacing human judgment. If something is not right for you, we say so—and we mean it.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line/80 bg-surface py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Team"
            title="Providers you will recognize visit after visit"
            description="Replace portraits with consistent lighting and aligned crops for a gallery-quality roster page."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="rounded-[var(--radius-card)] border border-line bg-canvas/60 p-5">
                <div className="aspect-[4/5] rounded-2xl bg-accent-soft/60" />
                <h3 className="mt-4 font-display text-2xl text-ink">{member.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{member.role}</p>
                <p className="mt-3 text-sm text-muted">{member.note}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
