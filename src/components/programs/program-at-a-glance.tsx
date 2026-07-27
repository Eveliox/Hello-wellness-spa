import type { ProgramAtAGlance } from "@/content/programs";

type Props = {
  data: ProgramAtAGlance;
  locale?: "en" | "es";
};

const LABELS = {
  en: {
    duration: "Duration",
    firstVisit: "First visit",
    followUp: "Follow-up",
    priceAnchor: "Pricing",
  },
  es: {
    duration: "Duración",
    firstVisit: "Primera visita",
    followUp: "Seguimiento",
    priceAnchor: "Precio",
  },
} as const;

/**
 * Four-column data strip in the hero. Answers the highest-friction
 * questions before the fold ends. Hairline dividers, tabular type — this
 * carries more trust weight than every trust chip combined.
 */
export function ProgramAtAGlance({ data, locale = "en" }: Props) {
  const labels = LABELS[locale];
  const raw: Array<{ label: string; value: string | undefined }> = [
    { label: labels.duration, value: data.duration },
    { label: labels.firstVisit, value: data.firstVisit },
    { label: labels.followUp, value: data.followUp },
    { label: labels.priceAnchor, value: data.priceAnchor },
  ];
  const rows = raw.filter(
    (r): r is { label: string; value: string } => typeof r.value === "string" && r.value.length > 0,
  );

  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 sm:grid-cols-4 sm:gap-x-8">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-accent-clinical">
            {row.label}
          </dt>
          <dd className="font-display text-[0.98rem] leading-snug text-ink text-pretty">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
