import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Screening } from "@/data/screenings";

export function ScreeningCard({ screening }: { screening: Screening }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#e8e8e8] border-l-[3px] border-l-[#4A90D9] bg-white">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[280px_1fr] md:gap-8 md:p-10">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#f5f8fc]">
          <Image
            src={screening.image}
            alt={`${screening.name} ${screening.trademark}`.trim()}
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4A90D9]">
            Screenings & Diagnostics
          </p>
          <h2 className="mt-2 font-display text-[22px] leading-tight text-ink sm:text-[26px]">
            {screening.name}
            <span className="text-[0.7em] align-super text-[#4A90D9]">{screening.trademark}</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[#666]">{screening.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {screening.features.map((f) => (
              <li
                key={f}
                className="rounded-full bg-[#f5f4f2] px-3 py-1.5 text-[12px] font-medium text-[#444]"
              >
                <span aria-hidden className="mr-1.5 text-[#4A90D9]">●</span>
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[13px] italic text-[#888]">Contact for pricing</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              href={screening.inquiryUrl}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              className="rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[#4A90D9]"
            >
              Request more information →
            </Button>
            <Link
              href={screening.detailsUrl}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1a1a1a] px-5 text-sm font-semibold text-ink transition hover:border-[#4A90D9] hover:text-[#4A90D9]"
            >
              Learn more →
            </Link>
          </div>

          <p className="mt-5 text-[11px] italic leading-relaxed text-[#999]">{screening.shortDisclaimer}</p>
        </div>
      </div>
    </article>
  );
}
