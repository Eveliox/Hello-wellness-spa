import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-ui flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
          {eyebrow}
          {align === "center" ? <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden /> : null}
        </p>
      ) : null}
      <h2 className="font-display text-3xl leading-[1.12] tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}
