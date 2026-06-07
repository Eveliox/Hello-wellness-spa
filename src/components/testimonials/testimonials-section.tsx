"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Testimonial, TestimonialSource } from "@/content/testimonials";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type Props = {
  items: Testimonial[];
  variant?: "grid" | "carousel";
};

const SOURCE_LABEL: Record<TestimonialSource, string> = {
  google: "Google",
  instagram: "Instagram",
  "in-clinic": "Verified guest",
};

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rounded} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={cn("h-4 w-4", i < rounded ? "text-[#F4B400]" : "text-line")}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden className="h-3.5 w-3.5">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l3.01-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 009 0 9 9 0 00.96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function SourceBadge({ source }: { source: TestimonialSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-muted">
      {source === "google" && <GoogleG />}
      {SOURCE_LABEL[source]}
    </span>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const source = t.source ?? "in-clinic";
  return (
    <figure className="flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <SourceBadge source={source} />
        {t.date ? <span className="text-[11px] text-faint">{t.date}</span> : null}
      </div>
      {t.rating ? (
        <div className="mt-3">
          <Stars rating={t.rating} />
        </div>
      ) : null}
      <blockquote className="mt-3 grow text-sm leading-relaxed text-muted">“{t.quote}”</blockquote>
      {t.imageSrc ? (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-canvas">
          <Image
            src={t.imageSrc}
            alt={t.imageAlt ?? `Review from ${t.name}`}
            width={800}
            height={500}
            className="h-auto w-full object-contain"
          />
        </div>
      ) : null}
      <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
      <p className="text-xs text-faint">{t.detail}</p>
      {t.service ? <p className="mt-2 text-xs font-medium text-accent">{t.service}</p> : null}
    </figure>
  );
}

export function TestimonialsSection({ items, variant = "grid" }: Props) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (variant !== "carousel" || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [items.length, reduceMotion, variant]);

  if (variant === "grid") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    );
  }

  const active = items[index] ?? items[0];
  const source = active.source ?? "in-clinic";

  return (
    <div>
      <figure className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-2">
          <SourceBadge source={source} />
          {active.date ? <span className="text-[11px] text-faint">{active.date}</span> : null}
        </div>
        {active.rating ? (
          <div className="mt-3">
            <Stars rating={active.rating} />
          </div>
        ) : null}
        <blockquote className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          “{active.quote}”
        </blockquote>
        <figcaption className="mt-5 text-sm font-semibold text-ink">{active.name}</figcaption>
        <p className="text-xs text-faint">{active.detail}</p>
      </figure>
      <div className="mt-4 flex items-center justify-center gap-2" aria-label="Testimonial slides">
        {items.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={cn(
              "h-2.5 w-2.5 rounded-full border border-line bg-surface transition",
              i === index && "bg-accent w-6 border-accent/40",
            )}
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
