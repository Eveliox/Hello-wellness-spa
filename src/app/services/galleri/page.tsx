import Image from "next/image";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import type { FaqItem } from "@/content/faqs";
import { GALLERI_DISCLAIMER, GALLERI_WHATSAPP_URL } from "@/data/screenings";

export const metadata: Metadata = createMetadata({
  title: "Galleri® Multi-Cancer Early Detection Test",
  description:
    "Provider-guided Galleri® screening at Hello You Wellness Center in SW Miami — a single blood draw designed to detect cancer signals across 50+ cancer types.",
  path: "/services/galleri",
});

const ACCENT = "#4A90D9";

const screensFor = [
  { label: "Multi-cancer", icon: "galleri" },
  { label: "Breast", icon: "breast" },
  { label: "Cervical", icon: "cervical" },
  { label: "Colorectal", icon: "colon" },
  { label: "Lung", icon: "lung" },
  { label: "Prostate", icon: "prostate" },
] as const;

const benefitList = [
  "Adults over age 50",
  "Individuals interested in proactive wellness monitoring",
  "Patients with family history concerns",
  "Those seeking additional screening beyond standard guidelines",
];

const steps = [
  {
    title: "Request a consultation",
    body: "Our team reviews your eligibility and answers initial questions.",
  },
  {
    title: "Provider evaluation",
    body: "Medical guidance, eligibility confirmation, and informed consent.",
  },
  { title: "Blood draw", body: "Simple, in-clinic, two tubes. No prep or fasting required." },
  {
    title: "Laboratory analysis",
    body: "Advanced multi-cancer signal detection by certified labs.",
  },
  { title: "Results review", body: "Discussed in detail with your healthcare provider." },
];

const highlights = [
  {
    title: "Simple blood draw",
    body: "No imaging, no prep, no fasting required — just a brief in-clinic visit.",
  },
  {
    title: "Provider-guided",
    body: "Every step supervised by licensed healthcare professionals.",
  },
  {
    title: "Wellness-focused",
    body: "Proactive screening for peace of mind alongside your routine care.",
  },
];

const faqs: FaqItem[] = [
  {
    id: "galleri-what",
    category: "Treatments",
    question: "What is the Galleri test?",
    answer:
      "The Galleri test is a multi-cancer early detection blood screening that looks for cancer-associated signals across 50+ cancer types. It uses advanced genomic analysis to detect DNA patterns associated with cancer.",
  },
  {
    id: "galleri-replace",
    category: "Treatments",
    question: "Does this test replace my regular screenings?",
    answer:
      "No. The Galleri test is designed to complement standard cancer screenings recommended by your physician, such as mammograms, colonoscopies, and Pap smears. It should not be used as a substitute for these screenings.",
  },
  {
    id: "galleri-results",
    category: "Treatments",
    question: "What do the results mean?",
    answer:
      "A “No Cancer Signal Detected” result does not rule out cancer. A “Cancer Signal Detected” result does not confirm a cancer diagnosis — additional diagnostic testing would be required. Your provider will review all results with you in detail.",
  },
  {
    id: "galleri-cost",
    category: "Billing",
    question: "How much does it cost?",
    answer:
      "Pricing varies based on individual eligibility and insurance coverage. Contact our team for current pricing and to discuss your options.",
  },
  {
    id: "galleri-availability",
    category: "General",
    question: "Is this available in Florida?",
    answer:
      "Yes. The Galleri test is available at Hello You Wellness Center in SW Miami. Availability may vary by state for other locations.",
  },
  {
    id: "galleri-start",
    category: "Booking",
    question: "How do I get started?",
    answer:
      "Contact our team via WhatsApp or phone. We’ll review your eligibility, schedule a provider consultation, and guide you through every step.",
  },
];

function ScreensIcon({ name }: { name: string }) {
  // Simple SVG line icons matching a clinical aesthetic.
  const stroke = ACCENT;
  const sw = 1.6;
  switch (name) {
    case "galleri":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </svg>
      );
    case "breast":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12c0-4 4-7 8-7s8 3 8 7-4 8-8 8-8-4-8-8Z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "cervical":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4c1.5 4 4 6 5 6s3.5-2 5-6M7 4v9a5 5 0 0 0 10 0V4M9.5 17.5v3M14.5 17.5v3" />
        </svg>
      );
    case "colon":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h6a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11" />
        </svg>
      );
    case "lung":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v9M8 13c-3 0-4 2-4 4 0 2 1 3 3 3s3-1 3-3v-7M16 13c3 0 4 2 4 4 0 2-1 3-3 3s-3-1-3-3v-7" />
        </svg>
      );
    case "prostate":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 11a6 6 0 1 1 12 0v4a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-4Z" />
          <path d="M9 11h6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function GalleriPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="border-b border-line/80 bg-surface py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
                <span className="h-px w-6 bg-[#4A90D9]" aria-hidden />
                Preventive Screening
              </p>
              <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
                Multi-cancer early detection with a single blood draw
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                The Galleri<sup className="text-[0.6em] text-[#4A90D9]">®</sup> test is an advanced screening that may help identify cancer-associated signals before symptoms appear. Available at {site.shortBrand} through a provider-guided process.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href={GALLERI_WHATSAPP_URL}
                  prefetch={false}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="bg-[#1a1a1a] text-white hover:bg-[#4A90D9]"
                >
                  Request more information
                </Button>
                <a
                  className="text-sm font-medium text-[#333] underline-offset-2 hover:underline"
                  href={`tel:${site.phoneTel}`}
                >
                  Call {site.phoneDisplay}
                </a>
              </div>

              <ul className="mt-7 flex flex-wrap gap-2 text-[12px] font-medium text-[#444]">
                <li className="rounded-full bg-[#eef4fc] px-3 py-1.5">
                  <span aria-hidden className="mr-1.5 text-[#4A90D9]">●</span>
                  Provider-guided
                </li>
                <li className="rounded-full bg-[#eef4fc] px-3 py-1.5">
                  <span aria-hidden className="mr-1.5 text-[#4A90D9]">●</span>
                  SW Miami
                </li>
              </ul>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-[#f5f8fc] sm:aspect-[5/6]">
              <Image
                src="/galleri.png"
                alt="Galleri® Multi-Cancer Early Detection Test"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. What it screens for */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">What it screens for</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Screens for 50+ cancer types</h2>
            <p className="mt-3 text-base text-muted">
              Including five of the most common: breast, cervical, colorectal, lung, and prostate.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {screensFor.map((s) => (
              <li
                key={s.label}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface p-5 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fc]">
                  <ScreensIcon name={s.icon} />
                </span>
                <span className="text-[13px] font-semibold text-ink">{s.label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[#666]">
            The Galleri<sup className="text-[0.6em]">®</sup> test is designed to complement — not replace — standard screenings like mammograms, colonoscopies, and Pap smears.
          </p>
        </Container>
      </section>

      {/* 3. Who may benefit */}
      <section className="bg-surface py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">Eligibility</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Who may benefit</h2>
              <ul className="mt-6 space-y-3">
                {benefitList.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#333]">
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 text-[#4A90D9]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="self-start rounded-xl border border-[#e3e9f2] bg-[#eef4fc] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2c5d99]">Important</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#333]">
                This test is not recommended for pregnant women, individuals under 22, or those currently receiving cancer treatment.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      {/* 4. How it works */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">Process</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">How it works</h2>
          </div>

          <ol className="mt-10 space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex items-start gap-5 rounded-xl border border-line bg-surface p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A90D9] text-[14px] font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#555]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm italic text-[#777]">
            Results are typically available in approximately 2 weeks.
          </p>
        </Container>
      </section>

      {/* 5. Highlights */}
      <section className="bg-surface py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">Program highlights</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Why patients choose Galleri at Hello You</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="rounded-xl border border-line bg-white p-6">
                <p className="text-[16px] font-semibold text-ink">{h.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[#555]">{h.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. FAQ */}
      <section className="bg-white py-16">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">Frequently asked</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Galleri® screening — your questions, answered</h2>
          <div className="mt-8">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* 7. Final CTA */}
      <section className="bg-[#1a1a1a] py-16 text-white">
        <Container className="max-w-4xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Request more information</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            Our team is available to answer questions about eligibility, consultations, scheduling, and the screening process.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={GALLERI_WHATSAPP_URL}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="bg-[#25D366] text-white hover:bg-[#1ebd5b]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0a11.94 11.94 0 0 0-10.14 18l-1.7 6.2 6.36-1.66A11.94 11.94 0 0 0 12 24a11.86 11.86 0 0 0 8.52-20.52ZM12 22a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.78.98 1-3.69-.23-.38A9.94 9.94 0 1 1 12 22Zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.16 8.16 0 0 1-2.39-1.47 9 9 0 0 1-1.66-2.07c-.17-.3 0-.46.13-.61s.3-.35.45-.52.2-.3.3-.5.05-.37 0-.52-.67-1.6-.92-2.2-.49-.5-.67-.5h-.57a1.1 1.1 0 0 0-.79.37 3.34 3.34 0 0 0-1.04 2.49 5.81 5.81 0 0 0 1.21 3.05c.15.2 2.1 3.21 5.1 4.5a17.2 17.2 0 0 0 1.7.63 4.1 4.1 0 0 0 1.88.12 3.07 3.07 0 0 0 2-1.41 2.47 2.47 0 0 0 .17-1.41c-.07-.13-.27-.2-.57-.35Z" />
              </svg>
              Message on WhatsApp
            </Button>
            <Button
              href={`tel:${site.phoneTel}`}
              size="lg"
              variant="ghostInverse"
              className="border border-white/40 hover:border-white"
            >
              Call {site.phoneDisplay}
            </Button>
          </div>
          <p className="mt-6 text-[12px] text-white/55">{site.url.replace(/^https?:\/\//, "")}</p>
        </Container>
      </section>

      {/* 8. Mandatory disclaimer */}
      <section className="border-t border-[#e0e0e0] bg-[#f5f4f2] py-10">
        <Container>
          <div className="flex items-start gap-3">
            <svg
              className="mt-1 h-5 w-5 shrink-0 text-[#777]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p className="text-[11px] leading-[1.7] text-[#777]">{GALLERI_DISCLAIMER}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
