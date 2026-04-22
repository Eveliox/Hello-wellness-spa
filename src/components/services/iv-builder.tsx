"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { bookingUrlForServiceSlug } from "@/lib/booking";

const byoBookingUrl = bookingUrlForServiceSlug("build-your-own-iv");

type BaseKey = "saline" | "ringers";
type NutrientKey =
  | "vitamin-c"
  | "b-complex"
  | "b12"
  | "magnesium"
  | "zinc"
  | "glutathione"
  | "nad"
  | "l-carnitine"
  | "biotin"
  | "lipotropic"
  | "toradol"
  | "zofran"
  | "ipamorelin";

const BASE_PRICE = 149;

const baseOptions: Array<{ key: BaseKey; label: string; detail: string }> = [
  { key: "saline", label: "Saline Base (500mL)", detail: "Included (standard hydration base)" },
  { key: "ringers", label: "Lactated Ringer's (500mL)", detail: "Included (enhanced electrolyte base)" },
];

const nutrientOptions: Array<{ key: NutrientKey; label: string; price: number; detail?: string }> = [
  { key: "vitamin-c", label: "Vitamin C (high dose)", price: 25 },
  { key: "b-complex", label: "B-Complex", price: 20 },
  { key: "b12", label: "B-12 (Methylcobalamin)", price: 15 },
  { key: "magnesium", label: "Magnesium", price: 20 },
  { key: "zinc", label: "Zinc", price: 15 },
  { key: "glutathione", label: "Glutathione push", price: 35 },
  { key: "nad", label: "NAD+ (250mg)", price: 150 },
  { key: "l-carnitine", label: "L-Carnitine", price: 25 },
  { key: "biotin", label: "Biotin", price: 15 },
  { key: "lipotropic", label: "Lipotropic (MIC)", price: 45 },
  { key: "toradol", label: "Toradol (anti-inflammatory)", price: 20 },
  { key: "zofran", label: "Zofran (anti-nausea)", price: 20 },
  { key: "ipamorelin", label: "Ipamorelin", price: 75, detail: "Discuss with your provider" },
];

function formatUSD(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function IVBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [base, setBase] = useState<BaseKey>("saline");
  const [selected, setSelected] = useState<Set<NutrientKey>>(() => new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedItems = useMemo(() => {
    const set = selected;
    return nutrientOptions.filter((n) => set.has(n.key));
  }, [selected]);

  const addOnsTotal = useMemo(() => selectedItems.reduce((sum, n) => sum + n.price, 0), [selectedItems]);
  const total = BASE_PRICE + addOnsTotal;

  useEffect(() => {
    const addon = searchParams.get("addon") as NutrientKey | null;
    if (!addon) return;
    const exists = nutrientOptions.some((n) => n.key === addon);
    if (!exists) return;

    setSelected((prev) => {
      const next = new Set(prev);
      next.add(addon);
      return next;
    });

    const next = new URLSearchParams(searchParams.toString());
    next.delete("addon");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}#iv-builder` : `${pathname}#iv-builder`, { scroll: false });
  }, [searchParams, router, pathname]);

  const toggle = (key: NutrientKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const count = selected.size;

  return (
    <section id="iv-builder" className="border-y border-line/80 bg-surface py-16 scroll-mt-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display text-3xl text-ink">Design your infusion</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Select a base, add your nutrients, and review your blend. Your clinician will confirm everything during intake.
            </p>

            <div className="mt-8 space-y-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step 1</p>
                <p className="mt-2 font-display text-xl text-ink">Choose your base</p>
                <div className="mt-4 space-y-3">
                  {baseOptions.map((b) => (
                    <label
                      key={b.key}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-ink/20"
                    >
                      <input
                        type="radio"
                        name="iv-base"
                        checked={base === b.key}
                        onChange={() => setBase(b.key)}
                        className="mt-1 h-4 w-4 accent-[#C0392B]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{b.label}</span>
                        <span className="mt-1 block text-sm text-muted">{b.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step 2</p>
                <p className="mt-2 font-display text-xl text-ink">Add your nutrients</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {nutrientOptions.map((n) => {
                    const checked = selected.has(n.key);
                    return (
                      <button
                        key={n.key}
                        type="button"
                        onClick={() => toggle(n.key)}
                        className={[
                          "flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition",
                          checked ? "border-[#C0392B] bg-[rgba(192,57,43,0.05)]" : "border-line bg-white hover:border-ink/20",
                        ].join(" ")}
                      >
                        <span className="mt-0.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="h-4 w-4 accent-[#C0392B]"
                            aria-label={n.label}
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-ink">{n.label}</span>
                            <span className="text-sm font-semibold text-ink/85">{`+${formatUSD(n.price)}`}</span>
                          </span>
                          {n.detail ? <span className="mt-1 block text-xs text-muted">{n.detail}</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[100px] rounded-[var(--radius-card)] border border-line bg-[#f9f9f9] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step 3</p>
              <p className="mt-2 font-display text-xl text-ink">Review your blend</p>

              <div className="mt-5 space-y-4 text-sm text-muted">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Base</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{baseOptions.find((b) => b.key === base)?.label}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Add-ons</p>
                  {selectedItems.length ? (
                    <ul className="mt-2 space-y-2">
                      {selectedItems.map((n) => (
                        <li key={n.key} className="flex items-center justify-between gap-4">
                          <span className="text-sm text-ink/90">{n.label}</span>
                          <span className="text-sm font-semibold text-ink">{formatUSD(n.price)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No add-ons selected yet.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-sm text-muted">
                    Base: <span className="font-semibold text-ink">{formatUSD(BASE_PRICE)}</span> + Add-ons:{" "}
                    <span className="font-semibold text-ink">{formatUSD(addOnsTotal)}</span>
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">Estimated total: {formatUSD(total)}</p>
                </div>

                <Button href={byoBookingUrl} size="md" className="w-full bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
                  Book this blend
                </Button>
                <p className="text-xs leading-relaxed text-faint">
                  Final blend and pricing confirmed during your clinical intake. Certain combinations may be adjusted for safety.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Your blend</p>
              <p className="truncate text-sm font-semibold text-ink">
                {count} items selected — {formatUSD(total)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-ink/20"
            >
              {mobileOpen ? "Close" : "Review"}
            </button>
          </div>

          <div
            className={[
              "overflow-hidden border-t border-line bg-[#f9f9f9] transition-[max-height] duration-300",
              mobileOpen ? "max-h-[70vh]" : "max-h-0",
            ].join(" ")}
          >
            <div className="px-4 py-4">
              <p className="text-sm font-semibold text-ink">Review your blend</p>
              <p className="mt-2 text-sm text-muted">
                Base: <span className="font-semibold text-ink">{formatUSD(BASE_PRICE)}</span> + Add-ons:{" "}
                <span className="font-semibold text-ink">{formatUSD(addOnsTotal)}</span> ={" "}
                <span className="font-semibold text-ink">{formatUSD(total)}</span>
              </p>
              <div className="mt-3 rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Base</p>
                <p className="mt-1 text-sm font-semibold text-ink">{baseOptions.find((b) => b.key === base)?.label}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Add-ons</p>
                {selectedItems.length ? (
                  <ul className="mt-2 space-y-2">
                    {selectedItems.map((n) => (
                      <li key={n.key} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-ink/90">{n.label}</span>
                        <span className="text-sm font-semibold text-ink">{formatUSD(n.price)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">No add-ons selected yet.</p>
                )}
              </div>

              <div className="mt-4">
                <Button href={byoBookingUrl} size="md" className="w-full bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
                  Book this blend
                </Button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-faint">
                Final blend and pricing confirmed during your clinical intake. Certain combinations may be adjusted for safety.
              </p>
            </div>
          </div>
        </div>
        <div className="h-[72px]" aria-hidden />
      </div>
    </section>
  );
}

