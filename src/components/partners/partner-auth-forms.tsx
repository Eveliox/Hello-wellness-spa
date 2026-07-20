"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/15";

type Response = { ok: boolean; message?: string; needsConfirmation?: boolean };

export function PartnerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/partners/portal";
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/partners/portal/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as Response;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Sign in failed.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        className={inputClass}
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        className={inputClass}
      />
      {message ? (
        <p className="text-sm text-[#C0392B]" role="alert">
          {message}
        </p>
      ) : null}
      <Button
        disabled={status === "submitting" || !email || !password}
        size="lg"
        className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
      >
        {status === "submitting" ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export function PartnerSignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/partners/portal/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as Response;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Could not create account.");
        return;
      }
      if (data.needsConfirmation) {
        setNeedsConfirmation(true);
        setStatus("done");
        return;
      }
      router.push("/partners/portal");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "done" && needsConfirmation) {
    return (
      <div className="rounded-2xl border border-[#27ae60]/40 bg-[#f0f7f2] p-6 text-center">
        <p className="font-display text-xl text-ink">Check your email.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We just sent a confirmation link to <span className="font-semibold text-ink">{email}</span>.
          Click it and you&apos;ll be signed in to your partner dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email you applied with"
        autoComplete="email"
        className={inputClass}
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (8+ characters)"
        autoComplete="new-password"
        minLength={8}
        className={inputClass}
      />
      {message ? (
        <p className="text-sm text-[#C0392B]" role="alert">
          {message}
        </p>
      ) : null}
      <Button
        disabled={status === "submitting" || !email || password.length < 8}
        size="lg"
        className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
      >
        {status === "submitting" ? "Creating account…" : "Create partner account"}
      </Button>
    </form>
  );
}

export function PartnerLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        setPending(true);
        await fetch("/api/partners/portal/logout", { method: "POST" });
        router.push("/partners/portal/login");
        router.refresh();
      }}
      disabled={pending}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
