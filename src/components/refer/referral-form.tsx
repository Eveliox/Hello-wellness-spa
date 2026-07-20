"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SubmitResponse = {
  ok: boolean;
  code?: string;
  message?: string;
};

export function ReferralForm() {
  const [referrerName, setReferrerName] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setResult(null);
    try {
      const res = await fetch("/api/refer/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          referrerName: referrerName.trim(),
          referrerEmail: referrerEmail.trim(),
          referrerPhone: referrerPhone.trim() || undefined,
          friendName: friendName.trim(),
          friendEmail: friendEmail.trim() || undefined,
          friendPhone: friendPhone.trim() || undefined,
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
    } catch {
      setStatus("error");
      setResult({ ok: false, message: "Network error. Please try again." });
    }
  }

  if (status === "done" && result?.code) {
    return (
      <div className="rounded-2xl border border-[#27ae60]/40 bg-[#f0f7f2] p-6 text-center">
        <p className="font-display text-2xl text-ink">Done — nice work.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We just sent {friendName || "your friend"} the code and a link to book. When they come
          in, both credits land automatically.
        </p>
        <div className="mt-4 inline-block rounded-lg border border-line bg-white px-4 py-2 font-mono text-lg font-semibold text-ink">
          {result.code}
        </div>
        <p className="mt-3 text-xs text-muted">Your unique referral code</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">You</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={referrerName}
            onChange={(e) => setReferrerName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
          <input
            required
            type="email"
            value={referrerEmail}
            onChange={(e) => setReferrerEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
          <input
            value={referrerPhone}
            onChange={(e) => setReferrerPhone(e.target.value)}
            placeholder="Your phone (optional)"
            type="tel"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15 sm:col-span-2"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Your friend</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="Friend's name"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
          <input
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="Friend's email"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
          <input
            value={friendPhone}
            onChange={(e) => setFriendPhone(e.target.value)}
            placeholder="Friend's phone"
            type="tel"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15 sm:col-span-2"
          />
          <p className="text-xs text-muted sm:col-span-2">
            Email or phone required — we&apos;ll send them the code and a booking link.
          </p>
        </div>
      </div>

      {result?.ok === false ? (
        <p className="text-sm text-[#C0392B]" role="alert">
          {result.message ?? "Something went wrong."}
        </p>
      ) : null}

      <Button
        disabled={
          status === "submitting" ||
          !referrerName ||
          !referrerEmail ||
          !friendName ||
          (!friendEmail && !friendPhone)
        }
        size="lg"
        className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
      >
        {status === "submitting" ? "Sending…" : "Send my referral"}
      </Button>
    </form>
  );
}
