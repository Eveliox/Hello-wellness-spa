"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await fetch("/api/portal/logout", { method: "POST" });
      router.push("/portal/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={className ?? "text-sm font-medium text-muted hover:text-ink disabled:opacity-60"}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
