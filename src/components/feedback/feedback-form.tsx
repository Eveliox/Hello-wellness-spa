"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { token: string };

type SubmitResponse = {
  ok: boolean;
  routedTo?: "google" | "private";
  redirectUrl?: string;
  message?: string;
};

export function FeedbackForm({ token }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [routed, setRouted] = useState<"google" | "private" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function submit() {
    if (score === null) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, score, text: text.trim() || undefined }),
      });
      const data = (await res.json()) as SubmitResponse;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setRouted(data.routedTo ?? null);
      setStatus("done");
      if (data.routedTo === "google" && data.redirectUrl) {
        setTimeout(() => {
          window.location.href = data.redirectUrl!;
        }, 1200);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Couldn't submit. Please check your connection and try again.");
    }
  }

  if (status === "done") {
    if (routed === "google") {
      return (
        <div className="rounded-2xl border border-line bg-white p-6 text-center">
          <p className="font-display text-2xl text-ink">Thank you — you&apos;re the best.</p>
          <p className="mt-3 text-sm text-muted">
            Sending you to Google now to share your experience publicly.
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-line bg-white p-6">
        <p className="font-display text-2xl text-ink">Thank you — got it.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Someone from our team will reach out personally within one business day to make things
          right. You matter to us.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink">
          How likely are you to recommend us to a friend?
        </label>
        <p className="mt-1 text-xs text-muted">0 = not at all · 10 = definitely</p>
        <div className="mt-4 grid grid-cols-11 gap-1.5">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setScore(i)}
              className={[
                "aspect-square rounded-lg border text-sm font-semibold transition",
                score === i
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : "border-line bg-white text-ink hover:border-ink/40",
              ].join(" ")}
              aria-label={`${i} out of 10`}
              aria-pressed={score === i}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="feedback-text" className="block text-sm font-semibold text-ink">
          Anything specific you&apos;d like us to know? (Optional)
        </label>
        <textarea
          id="feedback-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={1000}
          className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-ink/15"
          placeholder="A provider who was great, something we could do better…"
        />
      </div>

      {errorMsg ? (
        <p className="text-sm text-[#C0392B]" role="alert">
          {errorMsg}
        </p>
      ) : null}

      <Button
        disabled={score === null || status === "submitting"}
        onClick={submit}
        size="lg"
        className="w-full bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send feedback"}
      </Button>
    </div>
  );
}
