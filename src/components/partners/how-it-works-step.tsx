import type { PartnerStep } from "@/data/partners-content";

export function HowItWorksStep({ step }: { step: PartnerStep }) {
  return (
    <div className="relative flex flex-col">
      <span
        className="font-display text-5xl leading-none text-[#E8B4A3]"
        aria-hidden
      >
        {String(step.step).padStart(2, "0")}
      </span>
      <h3 className="mt-4 font-display text-lg text-ink">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
    </div>
  );
}
