"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/store/product-image";

function formatPrice(n: number, opts?: { noDecimals?: boolean }) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts?.noDecimals ? 0 : 2,
    maximumFractionDigits: opts?.noDecimals ? 0 : 2,
  });
}

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const isPeptide = product.category === "Peptides (Research Use Only)";
  const isProgram = product.category === "Programs" || product.category === "Hormone Programs";
  const consultUrl = product.consultUrl;
  const checkoutHref = product.checkoutSlug
    ? `/checkout?product=${product.checkoutSlug}`
    : product.paymentLink;
  const onSale = product.onSale && typeof product.originalPrice === "number" && typeof product.salePrice === "number";
  const hasIncludes = Array.isArray(product.includes) && product.includes.length > 0;
  const hasLightbox = Boolean(product.lightboxImage);
  const showProgramImage = isProgram && Boolean(product.image);
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  const priceNode = useMemo(() => {
    if (isPeptide) {
      return <span className="text-sm font-semibold italic text-muted">Contact for pricing</span>;
    }
    if (onSale) {
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-[#999] line-through">{formatPrice(product.originalPrice!)}</span>
          <span className="text-base font-semibold text-[color:#C0392B]">{formatPrice(product.salePrice!)}</span>
        </div>
      );
    }
    const p = typeof product.price === "number" ? product.price : product.salePrice ?? product.originalPrice;
    const hasSuffix = Boolean(product.priceSuffix);
    return (
      <span className="text-base font-semibold text-ink">
        {formatPrice(p as number, { noDecimals: hasSuffix })}
        {hasSuffix ? (
          <span className="ml-0.5 text-[12px] font-normal text-[#999]">{product.priceSuffix}</span>
        ) : null}
      </span>
    );
  }, [isPeptide, onSale, product.originalPrice, product.price, product.priceSuffix, product.salePrice]);

  const imageContent =
    isProgram && !product.image ? (
      <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E8B4A3] to-[#d89a85] p-6 text-center text-ink">
        <p className="font-display text-5xl font-semibold leading-none">{product.duration ?? "Program"}</p>
        {product.badge ? (
          <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink/75">{product.badge}</p>
        ) : null}
      </div>
    ) : showProgramImage ? (
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="300px"
        className="object-cover"
      />
    ) : (
      <ProductImage src={product.image} alt={product.name} className="object-cover" sizes="300px" />
    );

  if (product.heroLayout) {
    const heroCtaHref = consultUrl ?? checkoutHref ?? "/book";
    const heroCtaLabel =
      product.ctaLabel ??
      (consultUrl ? "Check if you qualify →" : checkoutHref ? "Start program now" : "Book consultation");
    const heroCtaExternal = /^https?:\/\//.test(heroCtaHref);
    const heroPrice =
      typeof product.price === "number" ? product.price : product.salePrice ?? product.originalPrice ?? 0;

    return (
      <>
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#ccc] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
            {hasLightbox ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`View full details for ${product.name}`}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover object-center"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </button>
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover object-center"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
            <p className="text-[28px] font-semibold leading-none text-ink">{formatPrice(heroPrice as number)}</p>

            {hasIncludes ? (
              <div className="mt-6 border-y border-[#ececec]">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ink">
                      What&apos;s included
                    </span>
                  </span>
                  <span
                    className={`text-[#bbb] transition-transform ${expanded ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
                {expanded ? (
                  <ul className="border-t border-[#ececec]">
                    {product.includes!.map((item, i) => (
                      <li
                        key={item}
                        className={`flex items-center gap-3 py-3 text-[13px] leading-snug text-[#3a3a3a] ${
                          i > 0 ? "border-t border-[#f0f0f0]" : ""
                        }`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#dcdcdc]">
                          <svg
                            className="h-3 w-3 text-[#999]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="mt-auto pt-6">
              <Button
                href={heroCtaHref}
                prefetch={false}
                {...(heroCtaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                size="lg"
                className="h-14 w-full rounded-lg bg-ink text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-none hover:bg-[color:#C0392B]"
              >
                {heroCtaLabel}
              </Button>
              {product.phoneEnroll ? (
                <p className="mt-2 text-center text-[11px] text-[#888]">
                  Call to enroll —{" "}
                  <a
                    href="tel:+17867803626"
                    className="font-semibold text-ink underline-offset-2 hover:text-[color:#C0392B] hover:underline"
                  >
                    (786) 780-3626
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </article>

        {lightboxOpen && product.lightboxImage ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} — full program details`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <span aria-hidden className="text-xl leading-none">
                ✕
              </span>
            </button>
            <div className="relative max-h-full max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.lightboxImage}
                alt={`${product.name} — full program details`}
                className="block max-h-[92vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <article className="group flex h-full flex-col rounded-xl border border-[#e8e8e8] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#ccc] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
        <div className="relative m-4 aspect-square overflow-hidden rounded-[12px] bg-white">
          {hasLightbox ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`View full details for ${product.name}`}
              className="absolute inset-0 h-full w-full cursor-zoom-in"
            >
              {imageContent}
              <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                <span className="mb-3 rounded-full bg-white/95 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-ink">
                  Tap to enlarge
                </span>
              </span>
            </button>
          ) : (
            imageContent
          )}

          {product.onSale ? (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[color:#C0392B] px-3 py-1 text-[0.7rem] font-semibold text-white">
              Sale
            </span>
          ) : null}

          {isProgram && product.duration ? (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white">
              {product.duration}
            </span>
          ) : null}

          {product.mostPopular ? (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[color:#C0392B] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white">
              Most popular
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">{product.category}</p>
          <h2 className="mt-2 text-[16px] font-semibold text-ink">{product.name}</h2>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#777]">{product.description}</p>

          <div className="mt-4">{priceNode}</div>

          {hasIncludes ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between rounded-lg border border-[#e5e5e5] bg-[#faf7f5] px-3 py-2 text-left text-[12px] font-semibold text-ink transition hover:border-[#E8B4A3] hover:bg-[#f7efe9]"
              >
                <span>What&apos;s included</span>
                <span
                  className={`text-[#E8B4A3] transition-transform ${expanded ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {expanded ? (
                <ul className="mt-3 space-y-2 rounded-lg border border-[#f0e8e3] bg-[#fdfaf8] p-3">
                  {product.includes!.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12px] leading-snug text-[#555]">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B4A3]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {hasLightbox ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="mt-3 self-start text-[12px] font-semibold text-[#E8B4A3] underline-offset-2 hover:underline"
            >
              View full details →
            </button>
          ) : null}

          {isPeptide ? (
            <Button
              href="/contact"
              size="md"
              className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
            >
              {product.ctaLabel ?? "Contact us for pricing →"}
            </Button>
          ) : consultUrl ? (
            <Button
              href={consultUrl}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
            >
              {product.ctaLabel ?? "Check if you qualify →"}
            </Button>
          ) : checkoutHref && !isPeptide ? (
            <Button
              href={checkoutHref}
              prefetch={false}
              {...(checkoutHref.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              size="md"
              className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
            >
              {product.ctaLabel ?? (isProgram ? "Start program now" : "Start now")}
            </Button>
          ) : isProgram ? (
            <Button
              href="/book"
              size="md"
              className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]"
            >
              {product.ctaLabel ?? "Book consultation"}
            </Button>
          ) : (
            <Button type="button" size="md" className="mt-5 w-full rounded-lg bg-[#1a1a1a] text-white shadow-none hover:bg-[color:#C0392B]">
              {product.ctaLabel ?? "Add to Cart"}
            </Button>
          )}

          {product.phoneEnroll ? (
            <p className="mt-2 text-center text-[11px] text-[#888]">
              Call to enroll —{" "}
              <a
                href="tel:+17867803626"
                className="font-semibold text-ink underline-offset-2 hover:text-[color:#C0392B] hover:underline"
              >
                (786) 780-3626
              </a>
            </p>
          ) : null}
        </div>
      </article>

      {lightboxOpen && product.lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — full program details`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <span aria-hidden className="text-xl leading-none">✕</span>
          </button>
          <div className="relative max-h-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.lightboxImage}
              alt={`${product.name} — full program details`}
              className="block max-h-[92vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
