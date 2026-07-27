import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getService, type ServiceSlug } from "@/content/services";

type Props = {
  serviceSlugs: ServiceSlug[];
  locale?: "en" | "es";
};

const COPY = {
  en: {
    eyebrow: "Clinical services used in this program",
    heading: "The care under the hood",
    body: "Every program is delivered through in-clinic services you can also book à la carte. Details on pricing, protocol, and what to expect live on the service page for each.",
    link: "Service details",
  },
  es: {
    eyebrow: "Servicios clínicos usados en este programa",
    heading: "El cuidado bajo el capó",
    body: "Cada programa se entrega a través de servicios en clínica que también puedes reservar individualmente. Los detalles de precio, protocolo y qué esperar viven en la página de cada servicio.",
    link: "Ver servicio",
  },
} as const;

/**
 * Compact horizontal ledger for cross-links to /services/*. Deliberately
 * quieter than the services page's card grid — programs are the primary
 * conversion target, so services are visually deranked to a list.
 */
export function ProgramServiceLedger({ serviceSlugs, locale = "en" }: Props) {
  const copy = COPY[locale];
  const items = serviceSlugs
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<ReturnType<typeof getService>> => Boolean(s));

  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl text-balance text-ink sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted text-pretty">{copy.body}</p>
        </div>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {items.map((service, idx) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-6 py-6 transition hover:bg-accent-clinical-soft sm:grid-cols-[4rem_1fr_1.4fr_auto]"
              >
                <span className="font-display text-2xl text-accent-clinical/70 tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent-clinical">
                    {service.eyebrow}
                  </p>
                  <p className="mt-1 font-display text-xl text-ink">{service.title}</p>
                </div>
                <p className="hidden text-sm leading-relaxed text-muted text-pretty sm:block">
                  {service.summary}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-clinical group-hover:underline">
                  {copy.link}
                  <span aria-hidden className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
