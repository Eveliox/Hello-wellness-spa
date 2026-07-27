import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getService, type ServiceSlug } from "@/content/services";

type Props = {
  serviceSlugs: ServiceSlug[];
  locale?: "en" | "es";
};

const COPY = {
  en: {
    eyebrow: "What's included",
    heading: "The clinical services behind this program",
    body: "Every program is delivered through the same in-clinic services offered à la carte. Explore each one for full detail on pricing, protocol, and what to expect.",
    link: "See service details",
  },
  es: {
    eyebrow: "Qué incluye",
    heading: "Los servicios clínicos detrás de este programa",
    body: "Cada programa se entrega a través de los mismos servicios en clínica ofrecidos individualmente. Explora cada uno para ver detalles de precio, protocolo y qué esperar.",
    link: "Ver detalles del servicio",
  },
} as const;

export function IncludedServices({ serviceSlugs, locale = "en" }: Props) {
  const copy = COPY[locale];
  const items = serviceSlugs
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<ReturnType<typeof getService>> => Boolean(s));

  if (items.length === 0) return null;

  return (
    <section className="bg-canvas py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{copy.heading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{copy.body}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-sm transition hover:border-accent-clinical/40 hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-clinical">
                  {service.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-xl text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {service.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-clinical group-hover:underline">
                  {copy.link}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
