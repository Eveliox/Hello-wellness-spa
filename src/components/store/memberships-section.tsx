import { memberships } from "@/data/memberships";
import { MembershipCard } from "@/components/store/membership-card";

export function MembershipsSection() {
  return (
    <section className="mt-16">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#888]">Memberships</p>
        <hr className="mt-2 border-[#e8e8e8]" />
        <p className="mt-4 text-[14px] text-[#666]">Choose your level. Cancel anytime after 3 months.</p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-stretch">
        {memberships.map((m) => (
          <MembershipCard key={m.id} tier={m} />
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] leading-relaxed text-[#777]">
        All memberships require a 3-month minimum commitment. Cancel anytime after. No enrollment fees. Pause your
        membership for up to 1 month per year.
      </p>
    </section>
  );
}
