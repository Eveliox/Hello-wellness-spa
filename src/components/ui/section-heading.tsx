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
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl leading-[1.12] tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}
