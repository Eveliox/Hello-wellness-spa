import type { Metadata } from "next";
import Link from "next/link";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { SignupForm } from "@/components/portal/auth-forms";

export const metadata: Metadata = {
  title: "Create account | Hello You Wellness Portal",
  robots: { index: false },
};

export default function PortalSignupPage() {
  return (
    <PortalAuthShell
      eyebrow="Patient portal"
      title="Create your account"
      description="Sign up to view your intake history, manage your profile, and rebook with one click."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/portal/login" className="font-semibold text-ink underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </PortalAuthShell>
  );
}
