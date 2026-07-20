"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type PartnerApplication = {
  id: string;
  created_at: string;
  business_type: "trainer" | "gym" | "studio" | "other";
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  website: string | null;
  instagram: string | null;
  client_count_range: string | null;
  motivation: string | null;
  referral_source: string | null;
  status: "pending" | "approved" | "rejected" | "archived";
  admin_notes: string | null;
  reviewed_at: string | null;
};

const TYPE_LABELS: Record<PartnerApplication["business_type"], string> = {
  trainer: "Trainer",
  gym: "Gym owner",
  studio: "Studio owner",
  other: "Other",
};

const STATUS_STYLES: Record<PartnerApplication["status"], string> = {
  pending: "bg-[#fef8e7] text-[#856404] border-[#f6c651]",
  approved: "bg-[#f0f7f2] text-[#155724] border-[#27ae60]/40",
  rejected: "bg-[#f8d7da] text-[#721c24] border-[#c0392b]/30",
  archived: "bg-canvas text-muted border-line",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PartnerApplicationsTable({
  initialData,
}: {
  initialData: PartnerApplication[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = initialData.filter((a) => (filter === "all" ? true : a.status === filter));

  async function approve(id: string) {
    if (!confirm("Approve this partner? A referral code will be generated and a welcome email sent.")) {
      return;
    }
    setPendingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/partners/${id}/approve`, { method: "POST" });
      const data = (await res.json()) as { ok: boolean; message?: string; referralCode?: string };
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Approval failed.");
      } else {
        setMessage(`Approved. Referral code: ${data.referralCode}`);
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setPendingId(null);
    }
  }

  async function reject(id: string) {
    const notes = prompt("Reason for rejection (optional, saved to admin notes):");
    if (notes === null) return;
    setPendingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/partners/${id}/reject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes: notes || undefined }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Rejection failed.");
      } else {
        setMessage("Marked as rejected.");
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setPendingId(null);
    }
  }

  const counts = {
    all: initialData.length,
    pending: initialData.filter((a) => a.status === "pending").length,
    approved: initialData.filter((a) => a.status === "approved").length,
    rejected: initialData.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink">Partner applications</h2>
          <p className="mt-1 text-xs text-muted">
            {counts.pending} pending · {counts.approved} approved · {counts.rejected} rejected
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["pending", "approved", "rejected", "all"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition " +
                (filter === key
                  ? "bg-ink text-white"
                  : "bg-canvas text-muted hover:bg-accent-soft hover:text-ink")
              }
            >
              {key} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink">
          {message}
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-line bg-canvas p-6 text-center text-sm text-muted">
          No applications in this view.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {filtered.map((app) => {
            const isOpen = expanded === app.id;
            return (
              <li key={app.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-canvas"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {app.business_name}{" "}
                      <span className="font-normal text-muted">· {app.owner_name}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {TYPE_LABELS[app.business_type]} · {app.city} · {formatDate(app.created_at)}
                    </p>
                  </div>
                  <span
                    className={
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide " +
                      STATUS_STYLES[app.status]
                    }
                  >
                    {app.status}
                  </span>
                </button>

                {isOpen ? (
                  <div className="border-t border-line bg-canvas/60 px-4 py-4 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Detail label="Email" value={app.email} isEmail />
                      <Detail label="Phone" value={app.phone} isPhone />
                      <Detail label="Client base" value={app.client_count_range ?? "—"} />
                      <Detail label="Website" value={app.website ?? "—"} isLink />
                      <Detail label="Instagram" value={app.instagram ?? "—"} />
                      <Detail label="Heard about us" value={app.referral_source ?? "—"} />
                    </div>
                    {app.motivation ? (
                      <div className="mt-4 rounded-lg border border-line bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                          Their pitch
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
                          {app.motivation}
                        </p>
                      </div>
                    ) : null}
                    {app.admin_notes ? (
                      <div className="mt-4 rounded-lg border border-line bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                          Admin notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
                          {app.admin_notes}
                        </p>
                      </div>
                    ) : null}
                    {app.status === "pending" ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => approve(app.id)}
                          disabled={pendingId === app.id}
                          className="bg-[#27ae60] text-white hover:bg-[#27ae60]/90"
                        >
                          {pendingId === app.id ? "Approving…" : "Approve + send welcome"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => reject(app.id)}
                          disabled={pendingId === app.id}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  isEmail,
  isPhone,
  isLink,
}: {
  label: string;
  value: string;
  isEmail?: boolean;
  isPhone?: boolean;
  isLink?: boolean;
}) {
  let content: React.ReactNode = value;
  if (value && value !== "—") {
    if (isEmail) {
      content = (
        <a href={`mailto:${value}`} className="text-ink underline underline-offset-2 hover:text-[#C0392B]">
          {value}
        </a>
      );
    } else if (isPhone) {
      content = (
        <a href={`tel:${value}`} className="text-ink underline underline-offset-2 hover:text-[#C0392B]">
          {value}
        </a>
      );
    } else if (isLink && value.startsWith("http")) {
      content = (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-ink underline underline-offset-2 hover:text-[#C0392B]"
        >
          {value}
        </a>
      );
    }
  }
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{content}</p>
    </div>
  );
}
