"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-ink">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className={`mt-1.5 ${inputCls}`}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={`mt-1.5 ${inputCls}`}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
