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

  const hasAnyReferral = referrals.length > 0;
  const hasCompletedVisit = referrals.some((r) => r.first_purchase_at);
  const hasBeenPaid = referrals.some((r) => r.commission_status === "paid");

  const onboardingSteps: Array<{ key: string; label: string; done: boolean; hint: string | null }> = [
    { key: "activated", label: "Account activated", done: true, hint: null },
    {
      key: "first-referral",
      label: "Refer your first client",
      done: hasAnyReferral,
      hint: hasAnyReferral
        ? null
        : `Share code ${partner.referral_code} with a client this week — text, DM, or in person.`,
    },
    {
      key: "first-visit",
      label: "Your first client completes a visit",
      done: hasCompletedVisit,
      hint: null,
    },
    {
      key: "first-payout",
      label: "Get your first payout",
      done: hasBeenPaid,
      hint: null,
    },
  ];
  const allOnboardingDone = onboardingSteps.every((s) => s.done);

  type MonthBucket = { key: string; label: string; count: number; cents: number };
  const monthBuckets: MonthBucket[] = [];
  const chartAnchor = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(chartAnchor.getFullYear(), chartAnchor.getMonth() - i, 1);
    monthBuckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      count: 0,
      cents: 0,
    });
  }
  const bucketByKey = new Map(monthBuckets.map((b) => [b.key, b]));
  for (const r of referrals) {
    const eventAt = r.first_purchase_at ? new Date(r.first_purchase_at) : new Date(r.created_at);
    const key = `${eventAt.getFullYear()}-${eventAt.getMonth()}`;
    const bucket = bucketByKey.get(key);
    if (!bucket) continue;
    bucket.count += 1;
    if (r.commission_status === "earned" || r.commission_status === "paid") {
      bucket.cents += r.commission_cents ?? 0;
    }
  }
  const maxBucketCount = Math.max(1, ...monthBuckets.map((b) => b.count));
  const chartHasData = monthBuckets.some((b) => b.count > 0);
  const chartTotalCount = monthBuckets.reduce((sum, b) => sum + b.count, 0);
  const chartTotalCents = monthBuckets.reduce((sum, b) => sum + b.cents, 0);

  return (
    <div className="space-y-8">
      {/* Onboarding checklist — only until the partner is fully off the ground */}
      {!allOnboardingDone ? (
        <div className="rounded-[1.5rem] border border-line bg-canvas p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A3]">
            Getting started
          </p>
          <h2 className="mt-2 font-display text-xl text-ink">Your first steps</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Work through these to earn your first commission. We&apos;ll check them off as you go.
          </p>
          <ul className="mt-5 space-y-3">
            {onboardingSteps.map((s) => (
              <li key={s.key} className="flex items-start gap-3">
                <span
                  className={
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold " +
                    (s.done
                      ? "border-[#27ae60] bg-[#27ae60] text-white"
                      : "border-line bg-white text-transparent")
                  }
                  aria-hidden
                >
                  ✓
                </span>
                <div className="min-w-0">
                  <p
                    className={
                      "text-sm " + (s.done ? "text-muted line-through" : "text-ink")
                    }
                  >
                    {s.label}
                    <span className="sr-only">{s.done ? " (completed)" : " (not started)"}</span>
                  </p>
                  {s.hint && !s.done ? (
                    <p className="mt-0.5 text-xs text-muted">{s.hint}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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

      {/* Last-6-months trend chart */}
      {chartHasData ? (
        <div className="rounded-[1.5rem] border border-line bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl text-ink">Last 6 months</h2>
            <p className="text-xs text-muted">
              {chartTotalCount} {chartTotalCount === 1 ? "referral" : "referrals"} ·{" "}
              {formatUsd(chartTotalCents)} earned
            </p>
          </div>
          <div className="mt-6 grid grid-cols-6 items-end gap-3">
            {monthBuckets.map((b) => {
              const heightPct = b.count === 0 ? 0 : Math.max(6, (b.count / maxBucketCount) * 100);
              return (
                <div
                  key={b.key}
                  className="flex flex-col items-center gap-2"
                  role="img"
                  aria-label={`${b.count} referrals in ${b.label}`}
                >
                  <div className="flex h-28 w-full items-end rounded-lg bg-canvas">
                    <div
                      className="w-full rounded-lg bg-[#E8B4A3] transition-all"
                      style={{ height: `${heightPct}%` }}
                      aria-hidden
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink">{b.count}</p>
                    <p className="text-xs uppercase tracking-wide text-muted">{b.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

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
