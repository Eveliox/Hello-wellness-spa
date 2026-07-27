"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15";

const labelClass = "text-xs font-semibold uppercase tracking-[0.15em] text-muted";

type SubmitResponse = { ok: boolean; error?: string };

function today(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function OrderForm() {
  const [product, setProduct] = useState("");
  const [dateOrdered, setDateOrdered] = useState(today());
  const [expectedArrival, setExpectedArrival] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [recentlyLogged, setRecentlyLogged] = useState<string[]>([]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/orders/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          product: product.trim(),
          dateOrdered,
          expectedArrival: expectedArrival || undefined,
          cost: cost.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json()) as SubmitResponse;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save order.");
        return;
      }
      setRecentlyLogged((prev) => [product.trim(), ...prev].slice(0, 5));
      setProduct("");
      setDateOrdered(today());
      setExpectedArrival("");
      setCost("");
      setNotes("");
      setStatus("done");
      setMessage("Order logged.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="font-display text-xl text-ink">Log an order</h2>
        <p className="mt-1 text-sm text-muted">
          Adds a row to the shared Google Sheet. You’ll get an email reminder if it goes past its
          expected arrival date, plus a summary every Monday.
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <label className="grid gap-1.5">
          <span className={labelClass}>Product / Service Name *</span>
          <input
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. NAD+ 500mg vials, GHK-Cu peptide, Sculptra"
            className={inputClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={labelClass}>Date Ordered *</span>
            <input
              required
              type="date"
              value={dateOrdered}
              onChange={(e) => setDateOrdered(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Expected Arrival</span>
            <input
              type="date"
              value={expectedArrival}
              onChange={(e) => setExpectedArrival(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="grid gap-1.5">
          <span className={labelClass}>Cost (optional)</span>
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g. $450 or $450 + tax or TBD"
            className={inputClass}
          />
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>Notes (optional)</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Vendor, PO number, anything the team should know"
            className={inputClass}
          />
        </label>

        {message ? (
          <p
            className={
              "text-sm " + (status === "error" ? "text-accent-brand" : "text-[#155724]")
            }
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            disabled={status === "submitting" || !product || !dateOrdered}
            size="md"
            className="bg-chrome-cta text-white hover:bg-chrome-cta/90"
          >
            {status === "submitting" ? "Saving…" : "Log order"}
          </Button>
          <a
            href={process.env.NEXT_PUBLIC_ORDERS_SHEET_URL ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Open the tracker sheet →
          </a>
        </div>
      </form>

      {recentlyLogged.length > 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-canvas p-4">
          <p className={labelClass}>Just logged</p>
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {recentlyLogged.map((item, idx) => (
              <li key={`${item}-${idx}`}>
                <span className="text-muted">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
