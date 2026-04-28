"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CheckoutProduct } from "@/lib/checkout-products";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().max(40).optional(),
  fulfillmentMethod: z.enum(["ship", "pickup", "in-clinic"]),
  intakePrimaryGoal: z.string().optional(),
  intakePreviousGLP1: z.string().optional(),
  intakeAllergies: z.string().max(500).optional(),
  researchAck: z.boolean().optional(),
  orderNotes: z.string().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-muted/40 transition focus:outline-none focus:ring-2";
const inputNormal = cn(inputBase, "border-[#d0d0d0] focus:ring-ink/15");
const inputErr = cn(inputBase, "border-[#C0392B] focus:ring-[#C0392B]/20");

export function CheckoutClient({ product }: { product: CheckoutProduct }) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fulfillmentMethod: product.isPhysical ? "ship" : "in-clinic",
    },
  });

  const email = watch("email") ?? "";
  const fulfillment = watch("fulfillmentMethod");
  const researchAck = watch("researchAck");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canProceed = emailValid && (!product.isPeptide || !!researchAck);

  const isOnSale = typeof product.originalPriceCents === "number";
  const savings = isOnSale ? product.originalPriceCents! - product.priceCents : 0;

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          customerEmail: values.email,
          customerPhone: values.phone,
          fulfillmentMethod: values.fulfillmentMethod,
          ...(product.isWeightLossProgram
            ? {
                intake: {
                  primaryGoal: values.intakePrimaryGoal,
                  previousGLP1Use: values.intakePreviousGLP1,
                  allergiesNotes: values.intakeAllergies,
                },
              }
            : {}),
          researchAcknowledgment: values.researchAck ?? false,
          orderNotes: values.orderNotes,
        }),
      });
      const data = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (!data.ok || !data.url) {
        setApiError(data.message ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setApiError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Minimal checkout header */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-script text-2xl leading-none text-ink">
            {site.shortBrand}
          </Link>
          <a
            href={`tel:${site.phoneTel}`}
            className="text-sm font-semibold text-muted transition hover:text-ink"
          >
            {site.phoneDisplay}
          </a>
        </div>
        {/* Progress indicator */}
        <div className="border-t border-line/50 bg-canvas/60 py-2.5">
          <ol className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-xs font-semibold">
            <li className="text-ink">Checkout</li>
            <li className="text-line" aria-hidden>→</li>
            <li className="text-muted">Payment</li>
            <li className="text-line" aria-hidden>→</li>
            <li className="text-muted">Confirmation</li>
          </ol>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Mobile order summary (info only) */}
        <div className="mb-8 md:hidden">
          <MobileSummary product={product} isOnSale={isOnSale} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
            {/* ── LEFT: form fields ── */}
            <div className="space-y-6">
              {/* 1. Contact */}
              <Section title="Contact information">
                <div className="space-y-4">
                  <Field label="Email address" required error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={errors.email ? inputErr : inputNormal}
                    />
                  </Field>
                  <Field
                    label="Phone number"
                    hint="For appointment scheduling and order updates"
                    error={errors.phone?.message}
                  >
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="(305) 000-0000"
                      className={inputNormal}
                    />
                  </Field>
                </div>
              </Section>

              {/* 2. Fulfillment — physical products only */}
              {product.isPhysical && (
                <Section title="How would you like to receive this?">
                  <div className="space-y-3">
                    {(
                      [
                        {
                          value: "ship",
                          label: "Ship to me",
                          hint: "Peptide orders ship in insulated packaging within 1–2 business days.",
                        },
                        {
                          value: "pickup",
                          label: "Pick up at clinic",
                          hint: "9660 SW 72nd St, Miami, FL 33173 · Tue–Fri 9a–5p. We'll text you when ready.",
                        },
                      ] as const
                    ).map((opt) => (
                      <div key={opt.value}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                            fulfillment === opt.value
                              ? "border-ink bg-accent-soft/40"
                              : "border-line bg-surface hover:border-ink/30",
                          )}
                        >
                          <input
                            {...register("fulfillmentMethod")}
                            type="radio"
                            value={opt.value}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                          />
                          <div>
                            <p className="text-sm font-semibold text-ink">{opt.label}</p>
                            <p className="mt-0.5 text-xs text-muted">{opt.hint}</p>
                          </div>
                        </label>
                        {opt.value === "ship" && fulfillment === "ship" && (
                          <p className="ml-8 mt-2 rounded-lg border border-line bg-canvas px-3 py-2 text-xs text-muted">
                            Your shipping address will be collected on the next screen by Stripe.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* 2b. In-clinic scheduling note — non-physical, non-weight-loss */}
              {!product.isPhysical && !product.isWeightLossProgram && (
                <Section title="Your appointment">
                  <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-muted">
                    This service includes in-clinic visits at our SW Miami location. Our team will
                    contact you within 1 business day to schedule your first appointment.
                  </div>
                </Section>
              )}

              {/* 3. Program intake — weight loss programs only */}
              {product.isWeightLossProgram && (
                <Section
                  title="A bit about your goals"
                  hint="This helps our medical team prepare for your telemedicine evaluation. Full medical history will be reviewed during your consultation."
                >
                  <div className="space-y-5">
                    <fieldset>
                      <legend className="mb-2.5 text-sm font-semibold text-ink">
                        What is your primary wellness goal?
                      </legend>
                      <div className="space-y-2">
                        {[
                          ["weight-loss", "Weight loss"],
                          ["body-composition", "Body composition"],
                          ["energy-performance", "Energy & performance"],
                          ["overall-wellness", "Overall wellness"],
                        ].map(([val, lbl]) => (
                          <label key={val} className="flex cursor-pointer items-center gap-3">
                            <input
                              {...register("intakePrimaryGoal")}
                              type="radio"
                              value={val}
                              className="h-4 w-4 accent-ink"
                            />
                            <span className="text-sm text-ink">{lbl}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2.5 text-sm font-semibold text-ink">
                        Have you used GLP-1 medications before?
                      </legend>
                      <div className="space-y-2">
                        {[
                          ["yes", "Yes"],
                          ["no", "No"],
                          ["not-sure", "Not sure"],
                        ].map(([val, lbl]) => (
                          <label key={val} className="flex cursor-pointer items-center gap-3">
                            <input
                              {...register("intakePreviousGLP1")}
                              type="radio"
                              value={val}
                              className="h-4 w-4 accent-ink"
                            />
                            <span className="text-sm text-ink">{lbl}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field
                      label="Any known allergies or current medications?"
                      hint="Optional"
                      error={undefined}
                    >
                      <textarea
                        {...register("intakeAllergies")}
                        rows={2}
                        placeholder="List any allergies or medications..."
                        className={cn(inputNormal, "resize-none")}
                      />
                    </Field>
                  </div>
                </Section>
              )}

              {/* 4. Research acknowledgment — peptides only */}
              {product.isPeptide && (
                <Section title="Research acknowledgment">
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      researchAck
                        ? "border-ink bg-accent-soft/40"
                        : "border-line bg-surface",
                    )}
                  >
                    <input
                      {...register("researchAck")}
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                    />
                    <p className="text-sm leading-relaxed text-muted">
                      I confirm that I am at least 18 years of age. I acknowledge that all peptide
                      products are intended for in‑vitro research and laboratory use only, and are
                      not for human or animal consumption. I agree to use these products in
                      compliance with all applicable laws and regulations. I have read and agree to
                      the{" "}
                      <Link
                        href="/policies"
                        target="_blank"
                        className="font-semibold text-ink underline underline-offset-2"
                      >
                        Terms of Sale
                      </Link>
                      .
                    </p>
                  </label>
                </Section>
              )}

              {/* 5. Order notes */}
              <Section title="Order notes (optional)">
                <Field label="Add a note to your order" error={undefined}>
                  <textarea
                    {...register("orderNotes")}
                    rows={3}
                    placeholder="Any special instructions or questions..."
                    className={cn(inputNormal, "resize-none")}
                  />
                </Field>
              </Section>

              {apiError && (
                <div className="rounded-xl border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
                  {apiError}
                </div>
              )}

              {/* Mobile submit */}
              <div className="md:hidden">
                <ProceedButton canProceed={canProceed} loading={loading} />
              </div>
            </div>

            {/* ── RIGHT: sticky order summary (desktop) ── */}
            <div className="hidden md:block">
              <div className="sticky top-[7.5rem]">
                <div className="rounded-[var(--radius-card)] border border-line bg-surface shadow-sm">
                  {/* Product */}
                  <div className="border-b border-line p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Order summary
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-accent-soft text-xs font-semibold text-muted">
                            Rx
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-ink">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{product.category}</p>
                        <p className="mt-1 text-xs text-faint">Qty: 1</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2.5 border-b border-line p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      {isOnSale ? (
                        <div className="text-right">
                          <span className="mr-1.5 text-xs text-muted line-through">
                            {fmt(product.originalPriceCents!)}
                          </span>
                          <span className="font-semibold text-[#C0392B]">
                            {fmt(product.priceCents)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-ink">{fmt(product.priceCents)}</span>
                      )}
                    </div>
                    {isOnSale && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">You save</span>
                        <span className="font-semibold text-green-700">{fmt(savings)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Shipping</span>
                      <span className="text-xs text-muted">Calculated at next step</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-line pt-2.5 text-sm font-semibold text-ink">
                      <span>Total</span>
                      <span>{fmt(product.priceCents)}</span>
                    </div>
                  </div>

                  {/* CTA + trust */}
                  <div className="space-y-3 p-5">
                    <ProceedButton canProceed={canProceed} loading={loading} />

                    {apiError && (
                      <p className="text-center text-xs text-[#C0392B]">{apiError}</p>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 11V7a5 5 0 0 1 10 0v4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Secure checkout powered by Stripe</span>
                    </div>

                    <PaymentLogos />

                    <div className="space-y-2 border-t border-line pt-3">
                      {[
                        "Physician-supervised programs",
                        "Licensed medical professionals",
                        "100% secure payment processing",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2 text-xs text-muted">
                          <span className="mt-0.5 shrink-0 text-green-600" aria-hidden>
                            ✓
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <p className="pt-1 text-center text-xs text-muted">
                      Questions?{" "}
                      <a
                        href={`tel:${site.phoneTel}`}
                        className="font-semibold text-ink hover:underline"
                      >
                        {site.phoneDisplay}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
      <h2 className="mb-5 border-b border-line pb-3 text-base font-semibold text-ink">{title}</h2>
      {hint && <p className="mb-4 text-xs leading-relaxed text-muted">{hint}</p>}
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-[#C0392B]">*</span>}
      </label>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {children}
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

function MobileSummary({
  product,
  isOnSale,
}: {
  product: CheckoutProduct;
  isOnSale: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        Order summary
      </p>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent-soft text-xs font-semibold text-muted">
              Rx
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
          <p className="text-xs text-muted">{product.category}</p>
        </div>
        <div className="shrink-0 text-right">
          {isOnSale ? (
            <>
              <p className="text-xs text-muted line-through">{fmt(product.originalPriceCents!)}</p>
              <p className="text-base font-semibold text-[#C0392B]">{fmt(product.priceCents)}</p>
            </>
          ) : (
            <p className="text-base font-semibold text-ink">{fmt(product.priceCents)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProceedButton({ canProceed, loading }: { canProceed: boolean; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={!canProceed || loading}
      className={cn(
        "w-full rounded-full py-3.5 text-sm font-semibold text-white transition duration-200",
        canProceed && !loading
          ? "bg-[#1a1a1a] hover:bg-[color:#C0392B]"
          : "cursor-not-allowed bg-[#1a1a1a] opacity-40",
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Redirecting to secure checkout...
        </span>
      ) : (
        "Proceed to Payment →"
      )}
    </button>
  );
}

function PaymentLogos() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Accepted payment methods">
      {/* Visa */}
      <div className="flex h-7 w-11 items-center justify-center rounded border border-[#e5e5e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <svg viewBox="0 0 40 14" height="10" aria-label="Visa" role="img">
          <text
            x="20"
            y="11"
            textAnchor="middle"
            fill="#1A1F71"
            fontSize="13"
            fontWeight="900"
            fontStyle="italic"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            VISA
          </text>
        </svg>
      </div>

      {/* Mastercard */}
      <div className="flex h-7 w-11 items-center justify-center rounded border border-[#e5e5e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <svg viewBox="0 0 38 24" height="20" aria-label="Mastercard" role="img">
          <defs>
            <clipPath id="mc-right">
              <circle cx="24" cy="12" r="8" />
            </clipPath>
          </defs>
          <circle cx="14" cy="12" r="8" fill="#EB001B" />
          <circle cx="24" cy="12" r="8" fill="#F79E1B" />
          <circle cx="14" cy="12" r="8" fill="#FF5F00" clipPath="url(#mc-right)" />
        </svg>
      </div>

      {/* Amex */}
      <div className="flex h-7 w-11 items-center justify-center rounded bg-[#2557D6] shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
        <svg viewBox="0 0 40 14" height="10" aria-label="American Express" role="img">
          <text
            x="20"
            y="11"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="700"
            fontFamily="Arial, Helvetica, sans-serif"
            letterSpacing="1"
          >
            AMEX
          </text>
        </svg>
      </div>

      {/* Apple Pay */}
      <div className="flex h-7 w-14 items-center justify-center gap-1 rounded border border-[#e5e5e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <svg viewBox="0 0 16 20" height="13" aria-hidden="true" fill="black">
          <path d="M13.74 6.39c-.06.05-1.96 1.13-1.96 3.46.07 2.67 2.36 3.62 2.39 3.62-.03.08-.36 1.26-1.24 2.46-.7 1.01-1.47 2.02-2.58 2.02-1.07 0-1.4-.65-2.63-.65-1.27 0-1.67.67-2.67.67-1.07 0-1.82-.94-2.63-2.04C1.1 14.6.5 12.56.5 10.64.5 7.6 2.46 5.99 4.44 5.99c1.07 0 1.96.69 2.63.69.64 0 1.65-.73 2.86-.73.48 0 1.94.05 2.96 1.45zM9.24 1.04c.48-.57 1.24-.96 1.96-.96.1 1.21-.33 2.4-1.07 3.22-.68.82-1.47 1.33-2.33 1.24-.11-1.19.39-2.4 1.44-3.5z" />
        </svg>
        <span className="text-[11px] font-semibold tracking-tight text-black">Pay</span>
      </div>
    </div>
  );
}
