import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BookingConfirmedPixel } from "@/components/analytics/booking-confirmed-pixel";
import { practiceBetterUrlForSlug } from "@/lib/practice-better";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Patient Registration | Hello You Wellness Center",
  description: "Complete your new patient intake registration form before your visit.",
};

const SERVICE_LABEL: Record<string, { label: string }> = {
  "assisted-weight-loss": { label: "Assisted Weight Loss" },
  "aesthetics-cosmetics": { label: "Aesthetics & Cosmetics" },
  "iv-therapy": { label: "IV Therapy" },
  general: { label: "General consultation" },
};

type SearchParams = Promise<{
  booked?: string;
  service?: string;
  at?: string;
  program?: string;
}>;

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

/**
 * Intake handoff page.
 *
 * Practice Better owns the clinical intake — this page no longer collects any
 * patient information itself. It stays as a real page (rather than a redirect)
 * for two reasons:
 *
 *   1. The URL is already circulating in booking-confirmation emails sent by
 *      /api/webhooks/cal-com, and is where /components/booking/cal-embed.tsx
 *      pushes patients after they book.
 *   2. `?booked=1` fires BookingConfirmedPixel — the booking conversion event.
 *      A redirect would unmount before that ever ran.
 */
export default async function IntakePage({ searchParams }: { searchParams: SearchParams }) {
  const { booked, service, at, program } = await searchParams;
  const isFromBooking = booked === "1";
  const serviceInfo = service ? SERVICE_LABEL[service] : undefined;
  const formattedTime = formatBookingTime(at);
  const intakeUrl = practiceBetterUrlForSlug(program);

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
            Please complete your intake before your first visit. All information is kept
            confidential and used solely to provide you with the best care.
          </p>

          {isFromBooking && <BookingConfirmedPixel bookingService={service} />}

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
                    {formattedTime ? ` for ${formattedTime}` : ""}. Please finish your intake below
                    so your provider has the full picture before your visit.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-8">
            {intakeUrl ? (
              <>
                <h2 className="font-display text-2xl text-ink">Complete your intake</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Your intake opens securely in Practice Better, our clinical platform. It takes
                  about 5 minutes, and you can save your progress and return to it later.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {[
                    "Medical history, medications, and current health goals",
                    "Reviewed by your provider before your visit",
                    "No payment required to complete",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href={intakeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 sm:w-auto"
                  >
                    Start my intake →
                  </a>
                </div>
                <p className="mt-4 text-xs text-faint">
                  Opens in a new tab at Practice Better.
                </p>
              </>
            ) : (
              /* No Practice Better URL configured — never show a dead button. */
              <>
                <h2 className="font-display text-2xl text-ink">Let&apos;s get you started</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Give us a call and we&apos;ll send your intake form over right away.
                </p>
                <div className="mt-6">
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 sm:w-auto"
                  >
                    Call {site.phoneDisplay}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
