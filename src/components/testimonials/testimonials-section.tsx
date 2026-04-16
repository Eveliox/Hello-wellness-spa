"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Testimonial } from "@/content/testimonials";
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
          <figure
            key={t.id}
            className="rounded-3xl border border-line bg-surface p-6 shadow-sm"
          >
            <blockquote className="text-sm leading-relaxed text-muted">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
            <p className="text-xs text-faint">{t.detail}</p>
            {t.service ? <p className="mt-2 text-xs font-medium text-accent">{t.service}</p> : null}
          </figure>
        ))}
      </div>
    );
  }

  const active = items[index] ?? items[0];

  return (
    <div>
      <figure className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <blockquote className="text-base leading-relaxed text-muted sm:text-lg">
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
