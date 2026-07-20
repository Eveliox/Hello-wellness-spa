import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requirePartner } from "@/lib/partner-auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partner dashboard | Hello You Wellness",
  robots: { index: false },
};

type ReferralRow = {
  id: string;
  first_purchase_at: string | null;
  commission_cents: number | null;
  commission_status: "pending" | "earned" | "paid" | "void";
  paid_at: string | null;
  created_at: string;
};

function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function PartnerDashboardPage() {
  const { partner } = await requirePartner();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rows } = await supabase
    .from("partner_referrals")
    .select("id, first_purchase_at, commission_cents, commission_status, paid_at, created_at")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false });

  const referrals = (rows as ReferralRow[] | null) ?? [];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let monthCount = 0;
  let monthEarnedCents = 0;
  let allTimeCount = 0;
  let allTimeEarnedCents = 0;
  let pendingPayoutCents = 0;

  for (const r of referrals) {
    const earned = r.commission_status === "earned" || r.commission_status === "paid";
    if (!earned) continue;
    const cents = r.commission_cents ?? 0;
    allTimeCount += 1;
    allTimeEarnedCents += cents;
    if (r.commission_status === "earned" && !r.paid_at) {
      pendingPayoutCents += cents;
    }
    const eventAt = r.first_purchase_at ? new Date(r.first_purchase_at) : new Date(r.created_at);
    if (eventAt >= startOfMonth) {
      monthCount += 1;
      monthEarnedCents += cents;
    }
  }

  const currentMonthName = new Date().toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="space-y-8">
      {/* Referral code hero */}
      <div className="rounded-[1.5rem] border border-line bg-canvas p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A3]">
          Your referral code
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-2xl font-semibold text-ink sm:text-3xl">
            {partner.referral_code}
          </p>
          <span className="text-xs text-muted">
            Commission: {Math.round(partner.commission_rate * 100)}% of first purchase
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Share this code with your clients. They mention it at intake or when they book, and we
          tag their first visit to you automatically.
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={`${currentMonthName} referrals`}
          value={String(monthCount)}
          sub={monthEarnedCents ? formatUsd(monthEarnedCents) + " earned" : "$0.00 earned"}
        />
        <StatCard
          label="All-time referrals"
          value={String(allTimeCount)}
          sub={formatUsd(allTimeEarnedCents) + " earned"}
        />
        <StatCard
          label="Pending payout"
          value={formatUsd(pendingPayoutCents)}
          sub={pendingPayoutCents ? "Paid by the 10th" : "No pending balance"}
          highlight={pendingPayoutCents > 0}
        />
      </div>

      {/* Recent history (anonymized) */}
      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">Recent referrals</h2>
          <p className="text-xs text-muted">Anonymized — HIPAA</p>
        </div>
        <p className="mt-1 text-xs text-muted">
          We can&apos;t share patient names or the specific services they received. You&apos;ll see
          the month, status, and your earned commission.
        </p>

        {referrals.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-canvas p-8 text-center">
            <p className="text-sm text-muted">
              No referrals yet. Share your code with your clients — every completed first visit
              earns you 15% of what they spend.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
            {referrals.slice(0, 15).map((r) => {
              const earned = r.commission_status === "earned" || r.commission_status === "paid";
              const displayMonth = r.first_purchase_at
                ? monthLabel(r.first_purchase_at)
                : monthLabel(r.created_at) + " (pending visit)";
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-ink">{displayMonth}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
                      {statusLabel(r.commission_status)}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-ink">
                    {earned ? formatUsd(r.commission_cents ?? 0) : "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Marketing kit */}
      <div className="rounded-[1.5rem] border border-line bg-canvas p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A3]">
          Marketing kit
        </p>
        <h2 className="mt-2 font-display text-xl text-ink">Assets you can use today</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Printable co-branded flyer, Instagram feed and story graphics, referral cards, and a
          &quot;Recommended by Hello You Wellness&quot; window sticker.
        </p>
        {partner.marketing_kit_url ? (
          <Button
            href={partner.marketing_kit_url}
            variant="secondary"
            size="md"
            className="mt-4"
          >
            Open your marketing kit
          </Button>
        ) : (
          <p className="mt-4 text-xs text-muted">
            Your kit is being prepared — we&apos;ll email you when it&apos;s ready (usually within
            2 business days of approval).
          </p>
        )}
      </div>
    </div>
  );
}

function statusLabel(status: ReferralRow["commission_status"]): string {
  switch (status) {
    case "pending":
      return "Pending first visit";
    case "earned":
      return "Earned · pending payout";
    case "paid":
      return "Paid";
    case "void":
      return "Voided";
  }
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-5 " +
        (highlight ? "border-[#C0392B]/40 bg-[#fdf4f2]" : "border-line bg-white")
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}
