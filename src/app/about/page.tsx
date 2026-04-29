import Image from "next/image";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "About Hello You Wellness Center | Medical Spa SW Miami",
  description:
    "Meet Hello You Wellness Center—our philosophy, team, and services in SW Miami. Medical depth with calm hospitality, clear timelines, and consultations that feel human.",
  path: "/about",
});

const team: Array<{
  name: string;
  role: string;
  bio: string;
  image?: string;
}> = [
  {
    name: "Noel Gonzalez, APRN",
    role: "Nurse practitioner · aesthetics & wellness",
    image: "/images/team/noel.jpg",
    bio:
      "APRN-led care with an emphasis on clarity, conservative technique, and realistic timelines. Noel is known for calm visits that feel educational—not salesy—and for building plans you can actually follow.",
  },
  {
    name: "Yanelys",
    role: "CEO & founder",
    image: "/images/team/yanelys.jpg",
    bio:
      "Built Hello You Wellness Center around one idea: premium care should feel calm, clear, and human. Yanelys leads the guest experience and ensures every visit reflects the standard—warm hospitality with medical rigor.",
  },
];

const values = [
  {
    title: "Longer appointments",
    body: "We don't rush. First visits are 45-60 minutes because good care starts with listening.",
  },
  {
    title: "Transparent pricing",
    body: "You'll know the cost before you commit. No surprise fees, no upsell pressure during treatment.",
  },
  {
    title: "Honest recommendations",
    body: "If something isn't right for you, we'll say so — even if it means a smaller bill.",
  },
  {
    title: "Continuity of care",
    body: "You see the same providers visit after visit. Your team knows your history, your goals, and your preferences.",
  },
] as const;

const trustStrip = [
  { label: "Licensed medical practice", detail: "Miami, FL" },
  { label: "APRN-led clinical care", detail: "Provider supervised" },
  { label: "Bilingual team", detail: "English & Spanish" },
  { label: "Serving SW Miami", detail: "9660 SW 72nd St" },
] as const;

function initials(name: string) {
  const cleaned = name.replace(/\(.*?\)/g, "").replace(/,.*$/g, "");
  const parts = cleaned
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "H";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "Y" : "Y";
  return `${first}${last}`.toUpperCase();
}

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: site.name,
    url: `${site.url}/about`,
    telephone: site.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: "9660 SW 72nd St",
      addressLocality: "Miami",
      addressRegion: "FL",
      postalCode: "33173",
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: "Miami" },
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="grid max-w-[1200px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
              About
            </p>
            <h1 className="mt-3 font-display text-4xl text-balance text-ink sm:text-5xl">
              A wellness clinic built for modern Miami—and everyone who{" "}
              <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
                matters
              </span>{" "}
              to you.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Hello You Wellness Center lives at the intersection of evidence-informed medicine and genuine
              hospitality. We believe premium care should feel human: you always know what's happening, why it
              matters, and what comes next.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={site.bookingUrl}
                size="md"
                className="w-full max-w-none whitespace-nowrap bg-[#1a1a1a] px-5 text-white hover:bg-[#1a1a1a]/90 sm:w-auto sm:max-w-[260px]"
              >
                Book a Free Consultation
              </Button>
              <Button
                href="/services"
                variant="ghost"
                size="md"
                className="w-full border border-line bg-transparent px-4 text-[#666] shadow-none hover:border-ink/20 hover:bg-black/[0.03] sm:w-auto"
              >
                Explore services
              </Button>
            </div>
            <a className="mt-3 inline-block text-sm text-[#555] underline-offset-2 hover:underline" href={`tel:${site.phoneTel}`}>
              Call {site.phoneDisplay}
            </a>
          </div>

          <div className="relative hidden aspect-[2/3] overflow-hidden rounded-[2rem] border border-line bg-[#f5f4f2] shadow-soft lg:block">
            <Image
              src="/wellness.jpg"
              alt="Hello You Wellness Center clinic interior"
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="/images/about/background.webp"
              alt="Hello You Wellness Center clinic interior"
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
              replacing human judgment.
            </p>
            <blockquote
              className="rounded-2xl border-l-[3px] border-[color:#C0392B] bg-surface px-5 py-4 text-[20px] italic leading-relaxed text-ink"
            >
              If something is not right for you, we say so — and we mean it.
            </blockquote>
          </div>
        </Container>
      </section>

      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="What you can expect"
            title="What this means in practice"
            description="The details that make premium care feel calm, clear, and consistent."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {values.map((v) => (
              <article key={v.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                <h3 className="font-display text-xl text-ink">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Team"
            title="Providers you will recognize visit after visit"
            description="A clinical team built for clarity, comfort, and continuity."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              >
                {member.image ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f5f4f2]">
                    <Image
                      src={member.image}
                      alt={`${member.name} headshot`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-[rgba(192,57,43,0.10)]">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:#C0392B] text-xl font-semibold text-white">
                      {initials(member.name)}
                    </div>
                  </div>
                )}
                <h3 className="mt-4 font-display text-2xl text-ink">{member.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line/80 bg-[#f9f9f9] py-10">
        <Container>
          <div className="grid gap-3 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-muted sm:grid-cols-4">
            {trustStrip.map((item, idx) => (
              <div key={item.label} className="flex items-center justify-center gap-3">
                {idx !== 0 ? <span className="hidden h-4 w-px bg-line sm:block" aria-hidden /> : null}
                <div className="text-center">
                  <p className="text-ink">{item.label}</p>
                  <p className="mt-1 text-[11px] font-semibold text-muted/80 normal-case tracking-normal">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-[2rem] bg-[#1a1a1a] p-10 text-white">
            <h2 className="font-display text-3xl">See if we're the right fit</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Book a complimentary consultation — no commitment, no pressure. Just a conversation about your goals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={site.bookingUrl} size="lg" className="bg-[color:#C0392B] text-white hover:bg-[#C0392B]/90">
                Book a Free Consultation
              </Button>
              <a className="text-sm font-medium text-white/85 underline-offset-2 hover:underline" href={`tel:${site.phoneTel}`}>
                Call {site.phoneDisplay}
              </a>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Or take the 2-min quiz to find the right service{" "}
              <a className="font-semibold text-white underline-offset-2 hover:underline" href="/quiz">
                →
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
