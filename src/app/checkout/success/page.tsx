import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Order Confirmed | Hello You Wellness Center",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Minimal header */}
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-script text-2xl leading-none text-ink">
            {site.shortBrand}
          </Link>
        </div>
        <div className="border-t border-line/50 bg-canvas/60 py-2.5">
          <ol className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-xs font-semibold">
            <li className="text-muted">Checkout</li>
            <li className="text-line" aria-hidden>→</li>
            <li className="text-muted">Payment</li>
            <li className="text-line" aria-hidden>→</li>
            <li className="text-ink">Confirmation</li>
          </ol>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-green-700"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-ink sm:text-4xl">Payment confirmed</h1>

        <p className="mt-4 text-base leading-relaxed text-muted">
          Thank you for your order. A receipt has been sent to your email. Our team will follow up
          within 1 business day to confirm your order and next steps.
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 text-left shadow-sm">
          <p className="text-sm font-semibold text-ink">What happens next</p>
          <ul className="mt-3 space-y-3">
            {[
              "Check your email for a payment receipt from Stripe.",
              "A member of our team will contact you within 1 business day.",
              "For weight loss programs, your telemedicine evaluation will be scheduled at that time.",
              "For peptide orders, your shipment will be prepared within 1–2 business days.",
            ].map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 shrink-0 text-green-600" aria-hidden>✓</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-sm font-semibold text-white transition hover:bg-[color:#C0392B]"
          >
            Back to home
          </Link>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-ink transition hover:border-ink/25"
          >
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
