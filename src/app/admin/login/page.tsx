import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login | Hello You Wellness",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Hello You Wellness</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Admin</h1>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
