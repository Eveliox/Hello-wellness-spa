import type { Metadata } from "next";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { ResetPasswordForm } from "@/components/portal/auth-forms";

export const metadata: Metadata = {
  title: "Set new password | Hello You Wellness Portal",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <PortalAuthShell
      eyebrow="Patient portal"
      title="Set a new password"
      description="Enter and confirm your new password below."
    >
      <ResetPasswordForm />
    </PortalAuthShell>
  );
}
