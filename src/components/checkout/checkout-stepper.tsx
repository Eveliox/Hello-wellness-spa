"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CheckoutProduct, CheckoutProductVariant } from "@/lib/checkout-products";
import {
  CURRENT_DOSE_OPTIONS,
  DOSE_PREFERENCE_OPTIONS,
  type GLP1IntakeData as GLP1Intake,
} from "@/lib/glp1-intake-schema";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type StepKey =
  | "variant"
  | "glp1-gate"
  | "current-dose"
  | "dose-preference"
  | "side-effects"
  | "medication-on-hand"
  | "contact"
  | "review";

type State = {
  variant: CheckoutProductVariant | null;
  intake: GLP1Intake;
  email: string;
  phone: string;
};

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutStepper({ product }: { product: CheckoutProduct }) {
  const router = useRouter();
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const [state, setState] = useState<State>({
    variant: hasVariants ? null : null,
    intake: { currentlyOnGLP1: "no" },
    email: "",
    phone: "",
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const steps: StepKey[] = useMemo(() => {
    const s: StepKey[] = [];
    if (hasVariants) s.push("variant");
    s.push("glp1-gate");
    if (state.intake.currentlyOnGLP1 === "yes") {
      s.push("current-dose", "dose-preference", "side-effects", "medication-on-hand");
    }
    s.push("contact", "review");
    return s;
  }, [hasVariants, state.intake.currentlyOnGLP1]);

  const step = steps[stepIndex] ?? "review";
  const totalSteps = steps.length;

  // Effective pricing — variant overrides product
  const effectivePriceCents = state.variant?.priceCents ?? product.priceCents;
  const effectiveOriginalCents =
    state.variant?.originalPriceCents ?? product.originalPriceCents;
  const isOnSale = typeof effectiveOriginalCents === "number";
  const savings = isOnSale ? effectiveOriginalCents! - effectivePriceCents : 0;

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  function goBack() {
    if (stepIndex === 0) {
      router.push("/store");
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function canProceed(): boolean {
    switch (step) {
      case "variant":
        return state.variant !== null;
      case "glp1-gate":
        return state.intake.currentlyOnGLP1 === "yes" || state.intake.currentlyOnGLP1 === "no";
      case "current-dose":
        return Boolean(state.intake.currentDose);
      case "dose-preference":
        return Boolean(state.intake.dosePreference);
      case "side-effects":
        return state.intake.sideEffects === "yes" || state.intake.sideEffects === "no";
      case "medication-on-hand":
        return state.intake.medicationOnHand === "yes" || state.intake.medicationOnHand === "no";
      case "contact":
        return emailRe.test(state.email);
      case "review":
        return true;
      default:
        return false;
    }
  }

  async function submit() {
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          variantSlug: state.variant?.slug,
          customerEmail: state.email,
          customerPhone: state.phone || undefined,
          fulfillmentMethod: product.isPhysical ? "ship" : "in-clinic",
          glp1Intake: {
            currentlyOnGLP1: state.intake.currentlyOnGLP1,
            currentDose: state.intake.currentDose,
            dosePreference: state.intake.dosePreference,
            sideEffects: state.intake.sideEffects,
            sideEffectsDetails: state.intake.sideEffectsDetails,
            medicationOnHand: state.intake.medicationOnHand,
          },
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
      {/* Header — matches Trava's minimal browser-chrome look */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link
            href="/store"
            aria-label="Close and return to store"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-canvas hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <p className="font-script text-xl leading-none text-ink">{site.shortBrand}</p>
          <div className="w-9" aria-hidden />
        </div>
        {/* Segmented progress bar */}
        <div className="mx-auto max-w-2xl px-4 pb-3 pt-1">
          <div className="flex gap-1.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition",
                  i <= stepIndex ? "bg-ink" : "bg-line",
                )}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-32 pt-6 sm:pt-10">
        {step === "variant" && (
          <VariantStep
            product={product}
            value={state.variant}
            onChange={(v) => setState((s) => ({ ...s, variant: v }))}
          />
        )}
        {step === "glp1-gate" && (
          <YesNoStep
            title="Are you currently taking a GLP-1 medication?"
            hint="If you're new to GLP-1s, we'll skip the dose questions."
            value={state.intake.currentlyOnGLP1}
            onChange={(v) =>
              setState((s) => ({
                ...s,
                intake:
                  v === "no"
                    ? {
                        currentlyOnGLP1: "no",
                      }
                    : { ...s.intake, currentlyOnGLP1: v },
              }))
            }
          />
        )}
        {step === "current-dose" && (
          <ChoiceStep
            eyebrow="Dose history"
            title="What dose are you currently taking?"
            hint={'"Currently" means within the past 2 months.'}
            options={CURRENT_DOSE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={state.intake.currentDose ?? null}
            onChange={(v) =>
              setState((s) => ({ ...s, intake: { ...s.intake, currentDose: v } }))
            }
          />
        )}
        {step === "dose-preference" && (
          <ChoiceStep
            eyebrow="Dose preference"
            title="Please select from the following options"
            options={DOSE_PREFERENCE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={state.intake.dosePreference ?? null}
            onChange={(v) =>
              setState((s) => ({
                ...s,
                intake: { ...s.intake, dosePreference: v as GLP1Intake["dosePreference"] },
              }))
            }
          />
        )}
        {step === "side-effects" && (
          <YesNoStep
            eyebrow="Side effects"
            title="Have you experienced side effects from your current medication?"
            value={state.intake.sideEffects}
            onChange={(v) =>
              setState((s) => ({ ...s, intake: { ...s.intake, sideEffects: v } }))
            }
          >
            {state.intake.sideEffects === "yes" && (
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Briefly describe (optional)
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={state.intake.sideEffectsDetails ?? ""}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      intake: { ...s.intake, sideEffectsDetails: e.target.value },
                    }))
                  }
                  placeholder="e.g., mild nausea in the first week..."
                  className="w-full resize-none rounded-lg border border-[#d0d0d0] bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-ink/15"
                />
              </div>
            )}
          </YesNoStep>
        )}
        {step === "medication-on-hand" && (
          <YesNoStep
            title="Do you have your current medication available?"
            hint="We need a photo of your current GLP-1 medication to see your current dose. If you don't have it handy, no worries. Ensure you grab it later to send it to your doctor once you complete the questionnaire."
            value={state.intake.medicationOnHand}
            onChange={(v) =>
              setState((s) => ({ ...s, intake: { ...s.intake, medicationOnHand: v } }))
            }
          />
        )}
        {step === "contact" && (
          <ContactStep
            email={state.email}
            phone={state.phone}
            onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
          />
        )}
        {step === "review" && (
          <ReviewStep
            product={product}
            variant={state.variant}
            effectivePriceCents={effectivePriceCents}
            effectiveOriginalCents={effectiveOriginalCents}
            isOnSale={isOnSale}
            savings={savings}
            email={state.email}
            apiError={apiError}
          />
        )}
      </main>

      {/* Sticky bottom bar */}
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3">
          {step === "review" && (
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-muted">Total</span>
              <span className="font-semibold text-ink">{fmt(effectivePriceCents)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="flex h-12 shrink-0 items-center justify-center rounded-full border border-line bg-canvas px-4 text-sm font-semibold text-ink transition hover:border-ink/30"
              aria-label="Back"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              disabled={!canProceed() || loading}
              onClick={() => {
                if (step === "review") {
                  void submit();
                } else {
                  goNext();
                }
              }}
              className={cn(
                "h-12 flex-1 rounded-full text-sm font-semibold text-white transition",
                canProceed() && !loading
                  ? "bg-[#1a1a1a] hover:bg-[color:#C0392B]"
                  : "cursor-not-allowed bg-[#1a1a1a] opacity-40",
              )}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
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
                  Redirecting…
                </span>
              ) : step === "review" ? (
                "Continue to secure payment →"
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Step components ─────────────────────────────────────────────────────────

function StepHeader({
  eyebrow,
  title,
  hint,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{title}</h1>
      {hint && <p className="mt-2 text-sm leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

function VariantStep({
  product,
  value,
  onChange,
}: {
  product: CheckoutProduct;
  value: CheckoutProductVariant | null;
  onChange: (v: CheckoutProductVariant) => void;
}) {
  const variants = product.variants ?? [];
  return (
    <div>
      <StepHeader title="Choose your option" />
      <div className="space-y-3">
        {variants.map((v) => {
          const isSelected = value?.slug === v.slug;
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                "block w-full rounded-xl border bg-surface px-5 py-5 text-left transition",
                isSelected
                  ? "border-ink ring-1 ring-ink/10"
                  : "border-line hover:border-ink/30",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{v.label}</p>
                  {v.description && (
                    <p className="mt-0.5 text-xs text-muted">{v.description}</p>
                  )}
                </div>
                <p className="shrink-0 text-sm font-semibold text-ink">{fmt(v.priceCents)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YesNoStep({
  eyebrow,
  title,
  hint,
  value,
  onChange,
  children,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  value: "yes" | "no" | undefined;
  onChange: (v: "yes" | "no") => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <StepHeader eyebrow={eyebrow} title={title} hint={hint} />
      <div className="space-y-3">
        {(["yes", "no"] as const).map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "block w-full rounded-xl border bg-surface px-5 py-5 text-left text-sm font-semibold transition",
                isSelected
                  ? "border-ink ring-1 ring-ink/10 text-ink"
                  : "border-line text-ink hover:border-ink/30",
              )}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}

function ChoiceStep({
  eyebrow,
  title,
  hint,
  options,
  value,
  onChange,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader eyebrow={eyebrow} title={title} hint={hint} />
      <div className="space-y-2.5">
        {options.map((o) => {
          const isSelected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "block w-full rounded-xl border bg-surface px-5 py-4 text-left text-sm font-semibold transition",
                isSelected
                  ? "border-ink ring-1 ring-ink/10 text-ink"
                  : "border-line text-ink hover:border-ink/30",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactStep({
  email,
  phone,
  onChange,
}: {
  email: string;
  phone: string;
  onChange: (patch: Partial<{ email: string; phone: string }>) => void;
}) {
  return (
    <div>
      <StepHeader
        title="Where can we reach you?"
        hint="We'll send your receipt and next steps to this email."
      />
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Email address <span className="text-[#C0392B]">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[#d0d0d0] bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Phone number</label>
          <p className="mb-1.5 text-xs text-muted">For appointment scheduling and order updates.</p>
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(305) 000-0000"
            className="w-full rounded-lg border border-[#d0d0d0] bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  product,
  variant,
  effectivePriceCents,
  effectiveOriginalCents,
  isOnSale,
  savings,
  email,
  apiError,
}: {
  product: CheckoutProduct;
  variant: CheckoutProductVariant | null;
  effectivePriceCents: number;
  effectiveOriginalCents: number | undefined;
  isOnSale: boolean;
  savings: number;
  email: string;
  apiError: string;
}) {
  return (
    <div>
      <StepHeader
        title="Review your order"
        hint="We'll connect you with a licensed provider to review your information and determine if a prescription is right for you."
      />
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-start gap-3 border-b border-line pb-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-ink">
              {variant?.label ?? product.name}
            </p>
            <p className="mt-0.5 text-xs text-muted">{product.category}</p>
          </div>
          <div className="shrink-0 text-right">
            {isOnSale && (
              <p className="text-xs text-muted line-through">{fmt(effectiveOriginalCents!)}</p>
            )}
            <p
              className={cn(
                "text-sm font-semibold",
                isOnSale ? "text-[#C0392B]" : "text-ink",
              )}
            >
              {fmt(effectivePriceCents)}
            </p>
          </div>
        </div>

        <dl className="space-y-2.5 py-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Medical consultation</dt>
            <dd className="font-semibold text-green-700">FREE</dd>
          </div>
          {product.isPhysical && (
            <div className="flex items-center justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-xs text-muted">Calculated at next step</dd>
            </div>
          )}
        </dl>

        <div className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Due if prescribed</span>
            <div className="text-right">
              {isOnSale && (
                <span className="mr-1.5 text-xs text-muted line-through">
                  {fmt(effectiveOriginalCents!)}
                </span>
              )}
              <span className={cn("font-semibold", isOnSale ? "text-[#C0392B]" : "text-ink")}>
                {fmt(effectivePriceCents)}
              </span>
            </div>
          </div>
          {isOnSale && (
            <p className="text-right text-xs text-green-700">
              You're saving {fmt(savings)}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted">Consult fee</span>
            <span className="text-ink">$0</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        You'll be charged once prescribed. You won't be charged if a provider determines that
        treatment isn't right for you. Receipt sent to <span className="font-semibold text-ink">{email}</span>.
      </p>

      {apiError && (
        <div className="mt-4 rounded-xl border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
          {apiError}
        </div>
      )}
    </div>
  );
}
