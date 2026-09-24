import Link from "next/link";
import { Container } from "@/components/ui/container";

const services = [
  {
    title: "Medical weight loss",
    description: "Explore a weight-management plan with medical guidance and follow-up.",
    href: "/services/assisted-weight-loss",
  },
  {
    title: "IV therapy",
    description: "Explore hydration and nutrient infusions with your care team.",
    href: "/services/iv-therapy",
  },
  {
    title: "Skin & aesthetics",
    description: "Explore injectables and skin treatments tailored to your goals.",
    href: "/services/aesthetics-cosmetics",
  },
];

export function ServicesPreview() {
  return (
    <section aria-labelledby="home-services-heading" className="bg-surface py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="home-services-heading" className="font-display text-3xl text-ink sm:text-4xl">What brings you in?</h2>
            <p className="mt-3 text-base text-ink/70">Start with a service. We’ll help with the next step.</p>
          </div>
          <Link href="/services" className="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4">View all services →</Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="group flex h-full flex-col rounded-2xl border border-line bg-canvas p-6 transition-colors hover:border-ink/40">
                <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{service.description}</p>
                <span className="mt-6 text-sm font-semibold text-ink group-hover:underline">Explore care <span aria-hidden>→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
