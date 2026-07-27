import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { programsEs } from "@/content/programs.es";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = createMetadata({
  title: "Programas de bienestar en SW Miami",
  description: `Seis programas dirigidos por médico en ${site.name}. Cada uno comienza con un intake específico del programa — sin protocolos de plantilla, sin precios en línea.`,
  path: "/programas",
});

export default function ProgramasIndexPage() {
  return (
    <>
      <section className="bg-surface pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[8fr_4fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
                <span className="h-px w-8 bg-accent-clinical" aria-hidden />
                Seis Programas · SW Miami
              </p>
              <h1 className="mt-6 font-display text-[3rem] leading-[1.02] text-balance text-ink sm:text-[4.5rem] lg:text-[5.5rem]">
                Cuidado organizado alrededor del resultado que realmente quieres.
              </h1>
            </div>
            <div className="relative lg:pb-8">
              <div
                className="absolute right-0 top-0 hidden h-full w-px bg-accent-clinical lg:block"
                aria-hidden
              />
              <p className="text-lg leading-[1.55] text-ink/78 text-pretty lg:pr-8">
                Los programas son cómo entregamos medicina — una secuencia de visitas, decisiones y
                seguimiento construida alrededor de una meta específica. Elige uno para ver la
                forma del compromiso.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Llámanos {site.phoneDisplay}
                </a>
                <Link
                  href="/services"
                  className="font-semibold text-accent-clinical underline-offset-4 hover:underline"
                >
                  Ver servicios individuales →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20">
        <Container>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-muted">
            Los Programas · 01 – 06
          </p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {programsEs.map((program, idx) => (
              <li key={program.slug}>
                <Link
                  href={`/programas/${program.slug}`}
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

      <section className="bg-program-paper py-20 text-program-paper-ink">
        <Container className="max-w-3xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            Programas vs servicios individuales
          </p>
          <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
            Cuándo elegir un programa — y cuándo un servicio individual es suficiente.
          </h2>

          <div className="mt-10 overflow-hidden rounded-2xl border border-program-paper-ink/10 bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-program-paper-ink/[0.04] text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                <tr>
                  <th className="px-6 py-4 text-left text-program-paper-ink/60">&nbsp;</th>
                  <th className="px-6 py-4 text-left text-program-paper-ink">Servicio individual</th>
                  <th className="px-6 py-4 text-left text-accent-clinical">Programa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-program-paper-ink/10 text-[0.9rem]">
                {[
                  {
                    label: "Duración",
                    service: "Visita única o curso corto",
                    program: "3–12 meses, cadencia estructurada",
                  },
                  {
                    label: "Seguimiento",
                    service: "Opcional, a solicitud",
                    program: "Cronograma definido, parte del precio",
                  },
                  {
                    label: "Precio",
                    service: "Por visita",
                    program: "Cotizado en su totalidad en consulta",
                  },
                  {
                    label: "Mejor cuando",
                    service: "Sabes qué tratamiento quieres",
                    program: "Tienes un resultado y quieres el plan construido",
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <th className="px-6 py-4 text-left font-display text-base font-normal text-program-paper-ink">
                      {row.label}
                    </th>
                    <td className="px-6 py-4 text-program-paper-ink/78">{row.service}</td>
                    <td className="px-6 py-4 text-program-paper-ink">{row.program}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
