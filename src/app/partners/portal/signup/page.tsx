import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { PartnerSignupForm } from "@/components/partners/partner-auth-forms";

export const metadata: Metadata = {
  title: "Set up your partner account | Hello You",
  robots: { index: false },
};

export default function PartnerSignupPage() {
  return (
    <PortalAuthShell
      eyebrow="Partner portal"
      title="Set up your account"
      description="Use the email you applied with. You'll pick a password and get right into your dashboard."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/partners/portal/login"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <Suspense fallback={<div className="h-48" aria-hidden />}>
        <PartnerSignupForm />
      </Suspense>
    </PortalAuthShell>
  );
}
