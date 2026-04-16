"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/content/faqs";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-line rounded-3xl border border-line bg-surface", className)}>
      {items.map((item) => {
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        const expanded = openId === item.id;

        return (
          <div key={item.id} className="px-4 sm:px-6">
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-ink sm:text-base"
                aria-controls={panelId}
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : item.id)}
              >
                <span className="text-balance">{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xs transition",
                    expanded && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn("grid transition-[grid-template-rows] duration-300", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
