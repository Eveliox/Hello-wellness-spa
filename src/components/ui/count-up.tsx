"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Props = {
  value: number | string;
  suffix?: string;
  durationMs?: number;
};

export function CountUp({ value, suffix = "", durationMs = 900 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<string>(typeof value === "number" ? "0" : String(value));

  const numericTarget = useMemo(() => (typeof value === "number" ? value : null), [value]);

  useEffect(() => {
    if (numericTarget === null) {
      setDisplay(String(value));
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let start = 0;
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (started) return;
        if (!entries.some((e) => e.isIntersecting)) return;
        started = true;

        const step = (t: number) => {
          if (!start) start = t;
          const p = clamp((t - start) / durationMs, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const next = Math.round(numericTarget * eased);
          setDisplay(next.toLocaleString());
          if (p < 1) raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [durationMs, numericTarget, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

