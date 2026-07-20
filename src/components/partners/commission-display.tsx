import type { PartnersContent } from "@/data/partners-content";

export function CommissionDisplay({ commission }: { commission: PartnersContent["commission"] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
          <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
          {commission.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-3xl text-balance text-ink sm:text-4xl">
          {commission.headline}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{commission.body}</p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.5rem] border border-line bg-surface p-8 text-center">
          <p
            className="font-display text-7xl leading-none text-ink sm:text-8xl"
            aria-label={`${commission.rateDisplay} commission`}
          >
            {commission.rateDisplay}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{commission.rateLabel}</p>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {commission.example.title}
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
            {commission.example.lines.map((line, idx) => {
              const isLast = idx === commission.example.lines.length - 1;
              return (
                <li
                  key={line}
                  className={
                    isLast
                      ? "mt-3 border-t border-line pt-3 font-semibold"
                      : "text-muted"
                  }
                >
                  {line}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
