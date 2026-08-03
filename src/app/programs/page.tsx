import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { programs } from "@/content/programs";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = createMetadata({
  title: "Wellness Programs in SW Miami",
  description: `Six physician-directed programs at ${site.name}. Each begins with a program-specific intake — no template protocols, no bundle pricing online.`,
  path: "/programs",
});

export default function ProgramsIndexPage() {
  return (
    <>
      {/* Editorial masthead — no hero image, statement-of-philosophy */}
      <section className="bg-surface pt-16 pb-12 sm:pt-28 sm:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[8fr_4fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
                <span className="h-px w-8 bg-accent-clinical" aria-hidden />
                Six Programs · SW Miami
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.25rem,8vw,5.5rem)] leading-[1.05] text-balance text-ink">
                Care organized around the outcome you actually want.
              </h1>
            </div>
            <div className="relative lg:pb-8">
              <div
                className="absolute right-0 top-0 hidden h-full w-px bg-accent-clinical lg:block"
                aria-hidden
              />
              <p className="text-base leading-[1.55] text-ink/78 text-pretty sm:text-lg lg:pr-8">
                Programs are how we deliver medicine — a sequence of visits, decisions, and follow-up
                built around a specific goal. Choose one to see the shape of the commitment.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Call {site.phoneDisplay}
                </a>
                <Link
                  href="/programs/packages"
                  className="font-semibold text-accent-clinical underline-offset-4 hover:underline"
                >
                  See packages & pricing →
                </Link>
                <Link
                  href="/services"
                  className="font-semibold text-accent-clinical underline-offset-4 hover:underline"
                >
                  Browse individual services →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Magazine-TOC table — replaces the alternating-row grid */}
      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-muted">
            The Programs · 01 – 06
          </p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {programs.map((program, idx) => (
              <li key={program.slug}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="group grid grid-cols-[3rem_1fr_auto] items-center gap-6 py-7 transition hover:bg-accent-clinical-soft sm:grid-cols-[4rem_1.4fr_1.6fr_10rem_auto] sm:gap-8"
                  aria-label={`${program.title} — ${program.eyebrow}`}
                >
                  <span className="font-display text-3xl leading-none text-accent-clinical/75 tabular-nums sm:text-4xl">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent-clinical">
                      {program.eyebrow}
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl text-ink text-balance sm:text-3xl">
                      {program.title}
                    </h2>
                  </div>

                  <p className="hidden max-w-md text-sm leading-relaxed text-muted text-pretty sm:block">
                    {program.summary}
                  </p>

                  <p className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                    {program.atAGlance?.duration ?? ""}
                  </p>

                  <div className="flex items-center gap-4">
                    <div
                      className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface opacity-0 shadow-sm transition duration-300 group-hover:opacity-100 sm:block"
                      style={{ viewTransitionName: `program-hero-${program.slug}` }}
                    >
                      <Image
                        src={program.heroImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <span
                      aria-hidden
                      className="font-display text-xl text-accent-clinical transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* À-la-carte vs Program comparison — preempts the taxonomy confusion */}
      <section className="bg-program-paper py-16 text-program-paper-ink sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            Programs vs à-la-carte services
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.15] text-balance">
            When to choose a program — and when a single service is enough.
          </h2>

          {/* Mobile: stacked comparison cards; Desktop: 3-col grid */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-program-paper-ink/10 bg-surface">
            {/* Desktop-only column header */}
            <div className="hidden bg-program-paper-ink/[0.04] px-6 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] sm:grid sm:grid-cols-[1fr_1.2fr_1.2fr] sm:gap-4">
              <span className="text-program-paper-ink/60">&nbsp;</span>
              <span className="text-program-paper-ink">À-la-carte service</span>
              <span className="text-accent-clinical">Program</span>
            </div>
            <ul className="divide-y divide-program-paper-ink/10 text-[0.9rem]">
              {[
                {
                  label: "Duration",
                  service: "Single visit or short course",
                  program: "3–12 months, structured cadence",
                },
                {
                  label: "Follow-up",
                  service: "Optional, on request",
                  program: "Defined schedule, part of the price",
                },
                {
                  label: "Pricing",
                  service: "Per visit",
                  program: "Quoted in full at consult",
                },
                {
                  label: "Best when",
                  service: "You know the treatment you want",
                  program: "You have an outcome and want the plan built",
                },
              ].map((row) => (
                <li key={row.label} className="px-5 py-5 sm:px-6 sm:py-4">
                  {/* Mobile stack */}
                  <div className="sm:hidden">
                    <p className="font-display text-lg text-program-paper-ink">{row.label}</p>
                    <div className="mt-3 grid gap-3">
                      <div>
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-program-paper-ink/60">
                          À la carte
                        </p>
                        <p className="mt-1 text-program-paper-ink/78">{row.service}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-accent-clinical">
                          Program
                        </p>
                        <p className="mt-1 text-program-paper-ink">{row.program}</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop 3-col */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_1.2fr_1.2fr] sm:items-baseline sm:gap-4">
                    <p className="font-display text-base text-program-paper-ink">{row.label}</p>
                    <p className="text-program-paper-ink/78">{row.service}</p>
                    <p className="text-program-paper-ink">{row.program}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
