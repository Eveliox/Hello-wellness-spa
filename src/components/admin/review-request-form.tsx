"use client";

import { useState } from "react";

type SubmitResponse = {
  ok: boolean;
  token?: string;
  link?: string;
  smsSent?: boolean;
  message?: string;
};

const SERVICES = [
  "Aesthetics",
  "IV therapy",
  "Weight loss",
  "Hormone therapy",
  "Peptides",
  "General consult",
] as const;

export function ReviewRequestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setResult(null);
    try {
      const res = await fetch("/api/admin/send-review-sms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          patientName: name.trim(),
          patientPhone: phone.trim(),
          patientEmail: email.trim() || undefined,
          service: service || undefined,
        }),
      });
      const data = (await res.json()) as SubmitResponse;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setResult(data);
        return;
      }
      setResult(data);
      setStatus("done");
      if (data.smsSent) {
        // Clear form on successful send
        setName("");
        setPhone("");
        setEmail("");
        setService("");
      }
    } catch {
      setStatus("error");
      setResult({ ok: false, message: "Network error. Try again." });
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl text-ink">Send review request</h2>
      <p className="mt-1 text-sm text-muted">
        After a guest checks out, drop their info here and we&apos;ll text them a private feedback
        link. Promoters route to Google, detractors route to you.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="col-span-2 block text-sm sm:col-span-1">
          <span className="font-semibold text-ink">Patient name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
            placeholder="Jane Doe"
          />
        </label>

        <label className="col-span-2 block text-sm sm:col-span-1">
          <span className="font-semibold text-ink">Phone (US)</span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
            placeholder="(305) 555-0123"
            type="tel"
          />
        </label>

        <label className="col-span-2 block text-sm sm:col-span-1">
          <span className="font-semibold text-ink">Email (optional)</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
            placeholder="jane@example.com"
            type="email"
          />
        </label>

        <label className="col-span-2 block text-sm sm:col-span-1">
          <span className="font-semibold text-ink">Service (optional)</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
          >
            <option value="">—</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={status === "submitting" || !name || !phone}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]/90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Send review request"}
          </button>
        </div>
      </form>

      {result && status === "done" && result.smsSent ? (
        <div className="mt-4 rounded-lg border border-[#27ae60]/40 bg-[#27ae60]/5 p-4 text-sm text-[#1e6e3a]">
          ✓ SMS sent. Guest will get the review link on their phone.
        </div>
      ) : null}

      {result && result.ok && !result.smsSent ? (
        <div className="mt-4 rounded-lg border border-[#E8B4A3] bg-[#faf3ef] p-4 text-sm">
          <p className="font-semibold text-ink">SMS not sent — copy this link and send manually:</p>
          <p className="mt-1 text-[#555]">{result.message}</p>
          <div className="mt-3 rounded border border-line bg-white p-2 font-mono text-xs break-all">
            {result.link}
          </div>
        </div>
      ) : null}

      {result && !result.ok ? (
        <div className="mt-4 rounded-lg border border-[#C0392B]/40 bg-[#C0392B]/5 p-4 text-sm text-[#8b1e14]">
          {result.message ?? "Something went wrong."}
        </div>
      ) : null}
    </section>
  );
}
