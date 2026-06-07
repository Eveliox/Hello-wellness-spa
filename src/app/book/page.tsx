import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BookingPicker } from "@/components/booking/booking-picker";

export const metadata: Metadata = createMetadata({
  title: "Book a visit",
  description: `Book a consultation or treatment at ${site.name} in SW Miami.`,
  path: "/book",
});

const steps = [
  "Pick a service and a time that works for you — most consultations are available same week.",
  "Right after you confirm, we'll guide you to a short intake form so we can prepare for your visit.",
  "Arrive with a clear plan — screening and suitability are confirmed before any medical service.",
];

type SearchParams = Promise<{ service?: string }>;

export default async function BookPage({ searchParams }: { searchParams: SearchParams }) {
  const { service } = await searchParams;

  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Book a visit
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Reserve your{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              visit
            </span>{" "}
            online.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Pick the service that fits and grab a time below. After you confirm, we&apos;ll guide you through a
            short intake so your provider has the full picture before your visit.
          </p>
          <p className="mt-4 text-xs text-faint">
            Prefer to talk first? Call{" "}
            <a href={`tel:${site.phoneTel}`} className="underline underline-offset-2 hover:text-ink">
              {site.phoneDisplay}
            </a>{" "}
            or DM us at{" "}
            <a
              href={site.social.instagram}
              className="underline underline-offset-2 hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.instagramHandle}
            </a>
            .
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <BookingPicker initialSlug={service} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
              <h2 className="font-display text-xl text-ink">What happens next</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted">
                {steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-faint">
                Medical services require screening. Booking confirms a time slot — suitability is reviewed
                before any treatment begins.
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New patient?</p>
              <p className="mt-1.5 text-sm text-muted">
                You can start your registration form anytime — we&apos;ll attach it to your booking.
              </p>
              <Button href="/intake" variant="secondary" size="sm" className="mt-3 w-full">
                Start registration form
              </Button>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Prefer to talk first?</p>
              <div className="mt-3 flex flex-col gap-2">
                <Button href={`tel:${site.phoneTel}`} variant="secondary" size="sm">
                  Call {site.phoneDisplay}
                </Button>
                <Button href={site.social.instagram} variant="ghost" size="sm">
                  Instagram DM
                </Button>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
