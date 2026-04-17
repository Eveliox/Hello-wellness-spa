"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/store/product-image";

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

type Props = {
  product: Product;
  showResearchBadge?: boolean;
};

export function ProductCard({ product, showResearchBadge }: Props) {
  const isPeptide = product.category === "Peptides (Research Use Only)";
  const onSale = product.onSale && typeof product.originalPrice === "number" && typeof product.salePrice === "number";

  const priceNode = useMemo(() => {
    if (onSale) {
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-[#999] line-through">{formatPrice(product.originalPrice!)}</span>
          <span className="text-base font-semibold text-[color:#C0392B]">{formatPrice(product.salePrice!)}</span>
        </div>
      );
    }
    const p = typeof product.price === "number" ? product.price : product.salePrice ?? product.originalPrice;
    return <span className="text-base font-semibold text-ink">{formatPrice(p as number)}</span>;
  }, [onSale, product.originalPrice, product.price, product.salePrice]);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-[#e8e8e8] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#ccc] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <div className="relative m-4 aspect-square overflow-hidden rounded-[12px] bg-white">
        <ProductImage src={product.image} alt={product.name} className="object-cover" sizes="300px" />

        {product.onSale ? (
          <span className="absolute right-3 top-3 rounded-full bg-[color:#C0392B] px-3 py-1 text-[0.7rem] font-semibold text-white">
            Sale
          </span>
        ) : null}

        {showResearchBadge && isPeptide ? (
          <span className="absolute left-3 top-3 rounded-full border border-[color:#C0392B] bg-white/85 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-[color:#C0392B]">
            FOR RESEARCH USE ONLY
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">{product.category}</p>
        <h2 className="mt-2 text-[16px] font-semibold text-ink">{product.name}</h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#777]">{product.description}</p>

        <div className="mt-4">{priceNode}</div>

        {isPeptide ? (
          <p className="mt-3 text-[11px] leading-relaxed text-[#8a8a8a]">
            Research use only. Not for human or animal consumption.
          </p>
        ) : null}

        <Button
          size="md"
          className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

