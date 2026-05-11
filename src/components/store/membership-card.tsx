import { Button } from "@/components/ui/button";
import type { Membership, MembershipBenefit } from "@/data/memberships";

function Dot({ included }: { included: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-[6px] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
        included ? "bg-[#27ae60]" : "bg-[#ddd]"
      }`}
    />
  );
}

function BenefitList({ items }: { items: MembershipBenefit[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug">
          <Dot included={item.included} />
          <span className={item.included ? "text-[#333]" : "text-[#aaa]"}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888] ${
        first ? "mt-6 border-t border-[#e8e8e8] pt-4" : "mt-5 border-t border-[#e8e8e8] pt-4"
      }`}
    >
      {children}
    </p>
  );
}

export function MembershipCard({ tier }: { tier: Membership }) {
  const featured = Boolean(tier.featured);
  return (
    <article
      className={`relative flex h-full flex-col rounded-xl bg-white px-8 py-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] ${
        featured ? "border-2 border-[color:#C0392B]" : "border border-[#e8e8e8]"
      }`}
    >
      {featured ? (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[color:#C0392B] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
          Most popular
        </span>
      ) : null}

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888]">{tier.name}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[28px] font-semibold leading-none text-ink">${tier.price}</span>
        <span className="text-[14px] font-normal text-[#999]">/mo</span>
      </div>
      <p className="mb-1 mt-2 text-[13px] italic text-[#777]">{tier.tagline}</p>

      <SectionLabel first>Monthly treatments</SectionLabel>
      <BenefitList items={tier.treatments} />

      <SectionLabel>Discounts</SectionLabel>
      <BenefitList items={tier.discounts} />

      <SectionLabel>Perks</SectionLabel>
      <BenefitList items={tier.perks} />

      <div className="mt-6 rounded-lg bg-[#f7f7f5] p-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#888]">Monthly value</p>
        <ul className="mt-2.5 space-y-1.5 text-[12.5px] text-[#555]">
          {tier.valueRows.map((r, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span>{r.label}</span>
              <span className="shrink-0 tabular-nums">{r.value}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-[#e3e3df] pt-2.5">
          <div className="flex justify-between gap-3 text-[13px] font-semibold text-ink">
            <span>Total value</span>
            <span className="tabular-nums">{tier.totalValue}</span>
          </div>
          <p className="mt-1 text-[12.5px] font-medium text-[#27ae60]">
            You save {tier.savings} vs paying individually
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button
          href={tier.paymentLink ?? "/contact"}
          prefetch={false}
          {...(tier.paymentLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          size="md"
          className="w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
        >
          Enroll now
        </Button>
        {tier.paymentLink ? null : (
          <p className="mt-2 text-center text-[11px] text-[#888]">
            Our team will confirm your membership within 1 business day.
          </p>
        )}
      </div>
    </article>
  );
}
