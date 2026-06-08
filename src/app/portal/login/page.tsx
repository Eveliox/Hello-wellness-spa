import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { LoginForm } from "@/components/portal/auth-forms";

export const metadata: Metadata = {
  title: "Sign in | Hello You Wellness Portal",
  robots: { index: false },
};

export default function PortalLoginPage() {
  return (
    <PortalAuthShell
      eyebrow="Patient portal"
      title="Sign in"
      description="Access your intake forms, profile, and upcoming visits."
      footer={
        <>
          <p>
            New here?{" "}
            <Link href="/portal/signup" className="font-semibold text-ink underline-offset-2 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/portal/forgot-password" className="text-muted underline-offset-2 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </>
      }
    >
      <Suspense fallback={<div className="h-48" aria-hidden />}>
        <LoginForm />
      </Suspense>
    </PortalAuthShell>
  );
}
