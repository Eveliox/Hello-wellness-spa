"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SubmitResponse = {
  ok: boolean;
  message?: string;
};

const BUSINESS_TYPES = [
  { value: "trainer", label: "Personal trainer / coach" },
  { value: "gym", label: "Gym owner" },
  { value: "studio", label: "Studio owner (yoga, pilates, boxing, etc.)" },
  { value: "other", label: "Other wellness professional" },
] as const;

const CLIENT_RANGES = [
  { value: "1-15", label: "1–15 active clients" },
  { value: "16-50", label: "16–50 active clients" },
  { value: "51-200", label: "51–200 active clients" },
  { value: "200+", label: "200+ active clients" },
] as const;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15";

export function PartnerApplicationForm() {
  const [businessType, setBusinessType] = useState<string>("trainer");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [clientCountRange, setClientCountRange] = useState<string>("16-50");
  const [motivation, setMotivation] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setResult(null);
    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessType,
          businessName: businessName.trim(),
          ownerName: ownerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          website: website.trim() || undefined,
          instagram: instagram.trim() || undefined,
          clientCountRange,
          motivation: motivation.trim() || undefined,
          referralSource: referralSource.trim() || undefined,
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

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-[#27ae60]/40 bg-[#f0f7f2] p-8 text-center">
        <p className="font-display text-2xl text-ink">Application received.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We&apos;ll review your application and get back to you within one business day at{" "}
          <span className="font-semibold text-ink">{email}</span>. If you&apos;re approved,
          you&apos;ll get your referral code, a link to set up your dashboard, and your starter
          kit in the same message.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Your business</p>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted">What kind of business?</span>
            <select
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className={inputClass}
            >
              {BUSINESS_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business name"
              className={inputClass}
            />
            <input
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={inputClass}
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone"
              className={inputClass}
            />
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Miami)"
              className={inputClass}
            />
            <select
              value={clientCountRange}
              onChange={(e) => setClientCountRange(e.target.value)}
              className={inputClass}
            >
              {CLIENT_RANGES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website (optional)"
              className={inputClass}
            />
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram handle (optional)"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Tell us a little more
        </p>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted">
              What made you interested in partnering with us? (optional)
            </span>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={4}
              placeholder="Anything you'd want us to know about your practice — client base, what you offer, why this fits."
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted">
              How did you hear about us? (optional)
            </span>
            <input
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              placeholder="Instagram, a friend, walked past our door…"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-line bg-white p-4 text-sm text-muted">
        <input
          required
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-line accent-ink"
        />
        <span>
          I understand this is an application — approval is at Hello You&apos;s discretion.
          Commissions are 15% of a referred client&apos;s first purchase and are paid only after
          the client completes and pays for their first service.
        </span>
      </label>

      {result?.ok === false ? (
        <p className="text-sm text-[#C0392B]" role="alert">
          {result.message ?? "Something went wrong."}
        </p>
      ) : null}

      <Button
        disabled={
          status === "submitting" ||
          !businessName ||
          !ownerName ||
          !email ||
          !phone ||
          !city ||
          !agreed
        }
        size="lg"
        className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
      >
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
