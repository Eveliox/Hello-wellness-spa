"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:text-sm";

const labelCls = "block text-sm font-semibold text-ink";

const buttonCls =
  "w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60";

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-3 py-2 text-sm text-[#C0392B]">
      {message}
    </p>
  );
}

function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 rounded-lg border border-[#27ae60]/30 bg-[#27ae60]/10 px-3 py-2 text-sm text-[#1f7a3f]">
      {message}
    </p>
  );
}

// ── Login ────────────────────────────────────────────────────────────────────
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setError(json.message ?? "Sign-in failed.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className={labelCls}>Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="login-password" className={labelCls}>Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </div>
      <ErrorBanner message={error} />
      <button type="submit" disabled={loading} className={buttonCls}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

// ── Signup ───────────────────────────────────────────────────────────────────
export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        needsConfirmation?: boolean;
      };
      if (!json.ok) {
        setError(json.message ?? "Could not create account.");
        return;
      }
      setSuccess(
        json.needsConfirmation
          ? "Account created. Check your email for a confirmation link to finish signing in."
          : "Account created. You can sign in now.",
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <SuccessBanner message={success} />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="su-name" className={labelCls}>Full name</label>
        <input
          id="su-name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="su-email" className={labelCls}>Email</label>
        <input
          id="su-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <p className="mt-1 text-xs text-faint">
          Use the email you submitted your intake with so prior forms show up automatically.
        </p>
      </div>
      <div>
        <label htmlFor="su-phone" className={labelCls}>Phone <span className="font-normal text-faint">(optional)</span></label>
        <input
          id="su-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="su-password" className={labelCls}>Password</label>
        <input
          id="su-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
        <p className="mt-1 text-xs text-faint">At least 8 characters.</p>
      </div>
      <ErrorBanner message={error} />
      <button type="submit" disabled={loading} className={buttonCls}>
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

// ── Forgot password ──────────────────────────────────────────────────────────
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setError(json.message ?? "Could not send reset email.");
        return;
      }
      setSuccess("If an account exists for that email, a reset link is on the way.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) return <SuccessBanner message={success} />;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="fp-email" className={labelCls}>Email</label>
        <input
          id="fp-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>
      <ErrorBanner message={error} />
      <button type="submit" disabled={loading} className={buttonCls}>
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}

// ── Reset password (from email link) ─────────────────────────────────────────
export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSuccess("Password updated. Redirecting…");
      setTimeout(() => {
        router.push("/portal");
        router.refresh();
      }, 1200);
    } catch {
      setError("Could not update password. The reset link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="rp-pw" className={labelCls}>New password</label>
        <input
          id="rp-pw"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="rp-confirm" className={labelCls}>Confirm new password</label>
        <input
          id="rp-confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputCls}
        />
      </div>
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />
      <button type="submit" disabled={loading} className={buttonCls}>
        {loading ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
