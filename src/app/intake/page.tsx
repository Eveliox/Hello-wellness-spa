import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { IntakeForm } from "@/components/intake/intake-form";

export const metadata: Metadata = {
  title: "Patient Registration | Hello You Wellness Center",
  description: "Complete your new patient intake registration form before your visit.",
};

export default function IntakePage() {
  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New Patient</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Registration Form</h1>
          <p className="mt-3 text-sm text-muted">
            Please complete this form before your first visit. All information is kept confidential and used solely to
            provide you with the best care.
          </p>
          <div className="mt-10">
            <IntakeForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
