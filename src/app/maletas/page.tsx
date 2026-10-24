import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { maletas } from "@/data/maletas";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MaletaCard } from "@/components/maletas/maleta-card";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Maletas Emprendedoras · Hello You Labs",
    description:
      "Kits de inventario Hello You Labs para distribuidoras — maletas listas para 3 órdenes y maletas emprendedoras con 6 o 9 viales. Pago seguro con Stripe.",
    path: "/maletas",
  }),
  robots: { index: false, follow: false },
};

const maletasKits = maletas.filter((k) => k.tier === "maleta");
const emprendedoraKits = maletas.filter((k) => k.tier === "emprendedora");

export default function MaletasPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C0392B]">
            <span className="h-px w-6 bg-[#C0392B]" aria-hidden />
            Hello You Labs
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Maletas{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#C0392B]">
              emprendedoras
            </span>
            .
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Kits de inventario listos para distribuidoras — todo lo que necesitas para servir a tus
            primeros clientes en una sola maleta. Pago seguro con Stripe. Precios mostrados no
            incluyen impuestos; el total con impuestos se calcula al pagar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#maletas" size="lg">
              Ver maletas
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
              Llamar {site.phoneDisplay}
            </Button>
          </div>
        </Container>
      </section>

      <section id="maletas" className="bg-canvas py-16 sm:py-20">
        <Container>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#888]">
              Serie Maletas · 01 – 04
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Inventario para 3 órdenes.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Cuatro maletas diseñadas alrededor de un protocolo específico. Elige la que mejor se
              adapte a lo que ya te están pidiendo tus clientes.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {maletasKits.map((kit) => (
              <MaletaCard key={kit.id} kit={kit} />
            ))}
          </div>
        </Container>
      </section>

      <section id="emprendedoras" className="border-t border-line/80 bg-surface py-16 sm:py-20">
        <Container>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C0392B]">
              Nuevas Maletas Emprendedoras
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Para empezar en grande.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Dos maletas más grandes con dosificaciones variadas — ideales para cubrir más
              protocolos desde el día uno.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
            {emprendedoraKits.map((kit) => (
              <MaletaCard key={kit.id} kit={kit} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 pt-16">
        <Container>
          <div className="rounded-[2rem] border border-line bg-[#1a1a1a] p-8 text-center text-white shadow-inner sm:p-10">
            <h2 className="font-display text-3xl">¿Tienes preguntas sobre tu maleta?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">
              Escríbenos o llama al equipo. Te ayudamos a elegir el inventario correcto para tu
              base de clientes antes de que compres.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href={`tel:${site.phoneTel}`}
                size="lg"
                className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90"
              >
                Llamar {site.phoneDisplay}
              </Button>
              <Button
                href={`mailto:${site.email}`}
                variant="secondary"
                size="lg"
                className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                Enviar correo
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
