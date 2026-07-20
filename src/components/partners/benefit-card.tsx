import type { PartnerBenefit } from "@/data/partners-content";
import { PartnerIcon } from "@/components/partners/partner-icon";

export function BenefitCard({ benefit }: { benefit: PartnerBenefit }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm transition duration-200 hover:border-ink/25 hover:shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-ink">
        <PartnerIcon name={benefit.icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{benefit.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.body}</p>
    </div>
  );
}
