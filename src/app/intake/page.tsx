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
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            New Patient
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            New patient{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              registration
            </span>
          </h1>
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
