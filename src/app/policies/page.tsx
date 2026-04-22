import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { policies } from "@/content/policies";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = createMetadata({
  title: "Policies",
  description: `Privacy, consent, and billing policies for ${site.name}.`,
  path: "/policies",
});

export default function PoliciesPage() {
  const reviewed = new Date(policies.lastReviewed).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <section className="py-16">
      <Container className="max-w-3xl space-y-10">
        <header className="space-y-4">
          <h1 className="font-display text-4xl text-ink">
            Clear,{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              honest
            </span>{" "}
            policies
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Last reviewed · {reviewed}
          </p>
          <div className="rounded-[var(--radius-card)] border border-amber-300/60 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {policies.reviewNotice}
          </div>
          <p className="text-sm leading-relaxed text-muted">{policies.intro}</p>
        </header>
        {policies.sections.map((section) => (
          <article key={section.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
            <h2 className="font-display text-2xl text-ink">{section.title}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </article>
        ))}
        <p className="text-xs text-faint">
          {site.legalName} — draft policy language pending review by licensed Florida counsel.
        </p>
      </Container>
    </section>
  );
}
