import type { Metadata } from "next";
import Link from "next/link";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { ForgotPasswordForm } from "@/components/portal/auth-forms";

export const metadata: Metadata = {
  title: "Reset password | Hello You Wellness Portal",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <PortalAuthShell
      eyebrow="Patient portal"
      title="Forgot your password?"
      description="Enter the email on your account and we'll send a reset link."
      footer={
        <p>
          Back to{" "}
          <Link href="/portal/login" className="font-semibold text-ink underline-offset-2 hover:underline">
            sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </PortalAuthShell>
  );
}
