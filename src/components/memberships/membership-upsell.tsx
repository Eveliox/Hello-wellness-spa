import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  /** Optional service context to tailor the copy. */
  service?: "iv" | "aesthetics" | "weight-loss" | "hormone" | "peptide" | "general";
  className?: string;
};

const HEADLINES: Record<NonNullable<Props["service"]>, string> = {
  iv: "Getting IVs monthly? Renew includes one every month.",
  aesthetics: "Booking a facial? Revive covers one every month.",
  "weight-loss": "On a weight loss program? Members save 15–25% on maintenance.",
  hormone: "Starting hormone therapy? Revive includes exclusive program pricing.",
  peptide: "On a peptide protocol? Members save 15–20% on every in-clinic visit.",
  general: "Members save 15–25% on everything — one visit pays for the month.",
};

export function MembershipUpsell({ service = "general", className = "" }: Props) {
  const headline = HEADLINES[service];

  return (
    <section
      className={`border-y border-line/80 bg-[#1a1a1a] py-14 text-white ${className}`.trim()}
      aria-labelledby="membership-upsell-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              Memberships
            </p>
            <h2
              id="membership-upsell-heading"
              className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl"
            >
              {headline}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              Refresh <span className="font-semibold text-white">$79</span>, Renew{" "}
              <span className="font-semibold text-white">$149</span>, or Revive{" "}
              <span className="font-semibold text-white">$249</span> per month. Each tier includes
              monthly treatments plus a discount on everything else. 3-month minimum, no enrollment
              fee.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href="/memberships"
                size="md"
                className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90"
              >
                See the tiers
              </Button>
              <Link
                href="/memberships#tiers"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare Renew vs. Revive →
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/85">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B4A3]" aria-hidden />
              <span>Monthly IV, injections, or aesthetic treatments (by tier)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B4A3]" aria-hidden />
              <span>15–25% off every other service — stacks on programs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B4A3]" aria-hidden />
              <span>Priority booking + birthday month perks</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B4A3]" aria-hidden />
              <span>Rollover credits (Renew and Revive)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
