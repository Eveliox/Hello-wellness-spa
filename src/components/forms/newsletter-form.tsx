"use client";

import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type NewsletterFormProps = {
  /** Dark card for charcoal footer (Hello You site style). */
  tone?: "light" | "dark";
};

export function NewsletterForm({ tone = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 shadow-sm",
        dark ? "border-white/10 bg-white/5" : "border-line bg-canvas/60",
      )}
    >
      <p
        className={cn(
          "font-ui text-xs font-semibold uppercase tracking-[0.2em]",
          dark ? "text-white/45" : "text-muted",
        )}
      >
        Newsletter
      </p>
      <p className={cn("mt-2 font-display text-2xl", dark ? "text-white" : "text-ink")}>
        Get 10% off your first purchase
      </p>
      <p className={cn("mt-2 text-sm", dark ? "text-white/65" : "text-muted")}>
        Sign up for updates—treatment tips, offers, and Miami studio news.
      </p>
      {status === "success" ? (
        <p className={cn("mt-4 text-sm font-medium", dark ? "text-white" : "text-ink")} role="status">
          You are on the list. Thank you.
        </p>
      ) : (
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "h-11 w-full rounded-full border px-4 text-sm shadow-inner outline-none transition focus:ring-2",
              dark
                ? "border-white/15 bg-chrome text-white placeholder:text-white/35 focus:border-white/30 focus:ring-white/15"
                : "border-line bg-surface text-ink focus:border-ink/25 focus:ring-ink/15",
            )}
          />
          <Button
            type="submit"
            variant={dark ? "inverse" : "primary"}
            disabled={status === "loading"}
            className={cn(
              "sm:w-40",
              dark && "border-transparent bg-[color:#C0392B] text-white hover:bg-[#C0392B]/90 hover:text-white",
            )}
          >
            {status === "loading" ? "Joining…" : "Sign up"}
          </Button>
        </form>
      )}
      {error ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
