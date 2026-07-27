import { Container } from "@/components/ui/container";

type Props = {
  items: string[];
  locale?: "en" | "es";
};

const COPY = {
  en: {
    eyebrow: "Honest disqualifiers",
    heading: "This program isn't the right fit if…",
    footnote:
      "We turn people away when the risk profile isn't right. That's not friction — it's the standard of care.",
  },
  es: {
    eyebrow: "Descalificadores honestos",
    heading: "Este programa no es el indicado si…",
    footnote:
      "Rechazamos casos cuando el perfil de riesgo no es el adecuado. No es fricción — es el estándar de cuidado.",
  },
} as const;

/**
 * Honest disqualifiers. This block is a trust move disguised as a filter —
 * informed buyers respect practices that turn people away. Do not add
 * "call to see if you qualify" language; the point is to say no, in public.
 */
export function NotForYouIf({ items, locale = "en" }: Props) {
  if (!items || items.length === 0) return null;
  const copy = COPY[locale];

  return (
    <section className="bg-program-paper py-20 text-program-paper-ink">
      <Container className="max-w-3xl">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
          {copy.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">{copy.heading}</h2>

        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-5 py-5 text-[0.95rem] leading-relaxed text-pretty"
            >
              <span
                className="mt-2 h-1.5 w-6 shrink-0 bg-accent-clinical"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-xl text-sm italic leading-relaxed text-program-paper-ink/70">
          {copy.footnote}
        </p>
      </Container>
    </section>
  );
}
