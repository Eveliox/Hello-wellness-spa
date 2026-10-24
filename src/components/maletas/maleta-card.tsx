import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { MaletaKit } from "@/data/maletas";

export function MaletaCard({ kit }: { kit: MaletaKit }) {
  const featured = Boolean(kit.featured);
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] ${
        featured ? "border-2 border-[#C0392B]" : "border border-[#e8e8e8]"
      }`}
    >
      {featured ? (
        <span className="absolute right-4 top-4 z-10 whitespace-nowrap rounded-full bg-[#C0392B] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-white shadow-soft">
          Más vendido
        </span>
      ) : null}

      <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
        <Image
          src={kit.image}
          alt={`${kit.name} — Hello You Labs`}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#888]">
          {kit.inventoryLabel}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink">{kit.name}</h3>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[30px] font-semibold leading-none text-ink">${kit.price}</span>
          <span className="text-[13px] text-[#999]">USD + impuestos</span>
        </div>

        <ul className="mt-5 space-y-2 border-t border-[#eee] pt-4 text-[13.5px] leading-snug text-[#444]">
          {kit.contents.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0392B]"
              />
              <span className="tabular-nums">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Button
            href={kit.paymentLink}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            className="w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[#C0392B]"
          >
            Comprar ahora →
          </Button>
          <p className="mt-2.5 text-center text-[11px] text-[#888]">
            Pago seguro con Stripe · Envío confirmado por correo
          </p>
        </div>
      </div>
    </article>
  );
}
