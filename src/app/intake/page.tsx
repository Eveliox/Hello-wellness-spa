import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { IntakeForm } from "@/components/intake/intake-form";

export const metadata: Metadata = {
  title: "Patient Registration | Hello You Wellness Center",
  description: "Complete your new patient intake registration form before your visit.",
};

const SERVICE_LABEL: Record<string, { label: string; intakeService?: string }> = {
  "assisted-weight-loss": {
    label: "Assisted Weight Loss",
    intakeService: "Assisted Weight Loss Program",
  },
  "aesthetics-cosmetics": { label: "Aesthetics & Cosmetics" },
  "iv-therapy": { label: "IV Therapy", intakeService: "IV Therapy" },
  general: { label: "General consultation" },
};

type SearchParams = Promise<{ booked?: string; service?: string; at?: string }>;

function formatBookingTime(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default async function IntakePage({ searchParams }: { searchParams: SearchParams }) {
  const { booked, service, at } = await searchParams;
  const isFromBooking = booked === "1";
  const serviceInfo = service ? SERVICE_LABEL[service] : undefined;
  const formattedTime = formatBookingTime(at);

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

          {isFromBooking && (
            <div className="mt-6 rounded-[var(--radius-card)] border border-[#1a1a1a] bg-[#1a1a1a] p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#1a1a1a]">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold">Booking confirmed</p>
                  <p className="mt-1 text-sm text-white/80">
                    {serviceInfo
                      ? `We've reserved your ${serviceInfo.label.toLowerCase()} appointment`
                      : "We've reserved your appointment"}
                    {formattedTime ? ` for ${formattedTime}` : ""}. Please finish the short form below so your
                    provider has the full picture before your visit.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <IntakeForm prefilledService={serviceInfo?.intakeService} />
          </div>
        </div>
      </Container>
    </main>
  );
}
