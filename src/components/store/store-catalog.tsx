"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, type ProductCategory } from "@/data/products";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";

const peptideDisclaimer =
  "All peptide products are sold strictly for in-vitro research and laboratory use only. Not for human or animal consumption. Not FDA approved. Buyer assumes all responsibility for lawful use.";

export function StoreCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = (() => {
    const raw = searchParams.get("category");
    if (!raw) return "All Products" as ProductCategory;
    const decoded = decodeURIComponent(raw) as ProductCategory;
    return categories.includes(decoded) ? decoded : ("All Products" as ProductCategory);
  })();

  const [active, setActive] = useState<ProductCategory>(initialCategory);
  const [fadeKey, setFadeKey] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const visible = useMemo(() => {
    if (active === "All Products") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  const peptidesInView = useMemo(() => visible.some((p) => p.category === "Peptides (Research Use Only)"), [visible]);

  return (
    <section className="py-14">
      <Container>
        <div className="flex gap-2 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (c === active) return;
                  setIsFading(true);
                  window.setTimeout(() => {
                    setActive(c);
                    setFadeKey((k) => k + 1);
                    setIsFading(false);
                  }, 120);
                }}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                    : "border-[#e5e5e5] bg-transparent text-[#999] hover:border-[#cfcfcf] hover:text-[#666]",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {peptidesInView ? (
          <div className="mt-4 rounded-2xl border border-[color:#C0392B]/25 bg-[rgba(192,57,43,0.05)] p-4">
            <p className="text-[12px] leading-relaxed text-[#7a3b35]" style={{ borderLeft: "3px solid #C0392B", paddingLeft: 12 }}>
              {peptideDisclaimer}
            </p>
          </div>
        ) : null}

        <div key={fadeKey} className={cn("mt-8 transition-opacity duration-200", isFading ? "opacity-0" : "opacity-100")}>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {visible.map((p) => (
              <ProductCard
                key={p.name}
                product={p}
                showResearchBadge={active === "All Products" || active === "Peptides (Research Use Only)"}
              />
            ))}
          </div>
        </div>
      </Container>

      <div className="mt-14 border-t border-line bg-[#f9f9f9] py-5">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777]">
            <span>Free Consultation</span>
            <span className="text-[#cfcfcf]" aria-hidden>
              |
            </span>
            <span>Licensed Medical Professionals</span>
            <span className="text-[#cfcfcf]" aria-hidden>
              |
            </span>
            <span>SW Miami Clinic</span>
            <span className="text-[#cfcfcf]" aria-hidden>
              |
            </span>
            <span>Same-Week Availability</span>
          </div>
        </Container>
      </div>
    </section>
  );
}

