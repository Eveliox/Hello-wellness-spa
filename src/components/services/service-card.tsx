import Image from "next/image";
import Link from "next/link";
import type { ServiceContent, StartingPrice } from "@/content/services";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";
import { cn } from "@/lib/utils";

function StartingAt({ startingAt }: { startingAt: StartingPrice }) {
  if ("amount" in startingAt) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          From
        </span>
        <span className="font-display text-xl text-ink">${startingAt.amount}</span>
        {startingAt.suffix ? (
          <span className="text-xs text-muted">{startingAt.suffix}</span>
        ) : null}
      </div>
    );
  }
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C0392B]">
      {startingAt.label}
    </span>
  );
}

export function ServiceCard({
  service,
  className,
}: {
  service: Pick<ServiceContent, "slug" | "title" | "summary" | "heroImage" | "shortTitle" | "startingAt">;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
        className,
      )}
    >
      <Link href={`/services/${service.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={service.heroImage}
          alt={`Visual moodboard for ${service.title}`}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent" />
        <div className="absolute left-4 top-4">
          <TrustChip>{service.shortTitle}</TrustChip>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl text-ink">
            <Link href={`/services/${service.slug}`} className="hover:underline">
              {service.title}
            </Link>
          </h3>
          <div className="shrink-0 pt-1.5">
            <StartingAt startingAt={service.startingAt} />
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Button href={`/services/${service.slug}`} variant="secondary" size="sm">
            View details
          </Button>
          <Button href={`tel:${site.phoneTel}`} size="sm">
            Call
          </Button>
        </div>
      </div>
    </article>
  );
}
