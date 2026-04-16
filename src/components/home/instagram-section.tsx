import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrustChip } from "@/components/ui/trust-chip";

const tiles = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80&auto=format&fit=crop",
];

export function InstagramSection() {
  return (
    <section className="border-t border-line/80 bg-surface py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Social proof"
            title="Follow the calm side of Miami wellness"
            description={`Behind-the-scenes suites, treatment education, and ${site.instagramHandle} exclusives.`}
          />
          <Link
            href={site.instagramUrl}
            className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-canvas px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/25"
          >
            Open Instagram
            <span aria-hidden>↗</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((src, i) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-line">
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              <div className="absolute left-2 top-2">
                <TrustChip>Placeholder</TrustChip>
              </div>
              <span className="sr-only">Gallery tile {i + 1}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-faint">
          Replace grid images with your curated Instagram exports.
        </p>
      </Container>
    </section>
  );
}
