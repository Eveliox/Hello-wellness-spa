import { cn } from "@/lib/utils";

export function TrustChip({
  children,
  className,
  dotClassName,
}: {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
}) {
  return (
    <span
      className={cn(
        "font-ui inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1 text-xs font-semibold text-muted",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-ink", dotClassName)} aria-hidden />
      {children}
    </span>
  );
}
