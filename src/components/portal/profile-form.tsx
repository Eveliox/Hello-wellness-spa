"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:text-sm";

const labelCls = "block text-sm font-semibold text-ink";

type Props = {
  email: string;
  initialFullName: string;
  initialPhone: string;
};

export function ProfileForm({ email, initialFullName, initialPhone }: Props) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          newPassword: newPassword || undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setError(json.message ?? "Could not save changes.");
        return;
      }
      setSuccess("Saved.");
      setNewPassword("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Email</label>
        <input type="email" value={email} disabled className={`${inputCls} bg-canvas`} />
        <p className="mt-1 text-xs text-faint">Contact the clinic to change your email on file.</p>
      </div>

      <div>
        <label htmlFor="pf-name" className={labelCls}>Full name</label>
        <input
          id="pf-name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="pf-phone" className={labelCls}>Phone</label>
        <input
          id="pf-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-4">
        <label htmlFor="pf-pw" className={labelCls}>New password <span className="font-normal text-faint">(optional)</span></label>
        <input
          id="pf-pw"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${inputCls} mt-2`}
          placeholder="Leave blank to keep current password"
        />
        <p className="mt-1 text-xs text-faint">At least 8 characters.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-3 py-2 text-sm text-[#C0392B]">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-[#27ae60]/30 bg-[#27ae60]/10 px-3 py-2 text-sm text-[#1f7a3f]">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
