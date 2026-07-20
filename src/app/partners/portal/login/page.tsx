import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { PartnerLoginForm } from "@/components/partners/partner-auth-forms";

export const metadata: Metadata = {
  title: "Sign in | Hello You Partner Portal",
  robots: { index: false },
};

export default function PartnerLoginPage() {
  return (
    <PortalAuthShell
      eyebrow="Partner portal"
      title="Sign in"
      description="View your referral code, monthly totals, and starter kit."
      footer={
        <p>
          New here?{" "}
          <Link
            href="/partners"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            Apply to partner
          </Link>{" "}
          — or use the signup link from your approval email.
        </p>
      }
    >
      <Suspense fallback={<div className="h-48" aria-hidden />}>
        <PartnerLoginForm />
      </Suspense>
    </PortalAuthShell>
  );
}
