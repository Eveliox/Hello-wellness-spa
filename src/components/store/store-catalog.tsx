"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, type Product, type ProductCategory } from "@/data/products";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { MembershipsSection } from "@/components/store/memberships-section";
import { ScreeningsSection } from "@/components/store/screenings-section";
import { ProductCardSkeletonGrid } from "@/components/store/product-card-skeleton";

const SECTION_ORDER: Array<Exclude<ProductCategory, "All Products" | "Memberships" | "Screenings & Diagnostics">> = [
  "Programs",
  "Hormone Programs",
  "Peptides",
  "IV Therapy",
  "Skin Care",
  "Supplements & Add-ons",
];

const GRID_STYLE = {
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
} as const;

function SectionHeader({ title }: { title: string }) {
  return (
    <header className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#888]">{title}</p>
      <hr className="mt-2 border-[#e8e8e8]" />
    </header>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid gap-6" style={GRID_STYLE}>
      {items.map((p) => (
        <ProductCard key={p.name} product={p} />
      ))}
    </div>
  );
}

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

  const showAll = active === "All Products";
  const isMemberships = active === "Memberships";
  const isScreenings = active === "Screenings & Diagnostics";

  const filteredVisible = useMemo(() => {
    if (showAll || isMemberships || isScreenings) return [];
    return products.filter((p) => p.category === active);
  }, [active, showAll, isMemberships, isScreenings]);

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
                  }, 280);
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

        <div key={fadeKey} className="mt-8">
          {isFading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : showAll ? (
            <>
              {SECTION_ORDER.map((section, i) => {
                const items = products.filter((p) => p.category === section);
                if (items.length === 0) return null;
                return (
                  <div key={section} className={i === 0 ? undefined : "mt-14"}>
                    <SectionHeader title={section} />
                    <ProductGrid items={items} />
                  </div>
                );
              })}
              <div className="mt-14">
                <ScreeningsSection />
              </div>
              <MembershipsSection />
            </>
          ) : isMemberships ? (
            <MembershipsSection />
          ) : isScreenings ? (
            <ScreeningsSection />
          ) : (
            <ProductGrid items={filteredVisible} />
          )}
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
