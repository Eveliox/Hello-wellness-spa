const services = [
  "IV Therapy",
  "Assisted Weight Loss",
  "Aesthetics & Cosmetics",
  "Research Peptides",
  "Myers' Cocktail",
  "NAD+ IV",
  "GLP-1 Programs",
  "Build Your Own IV",
];

export function ServicesMarquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-line/60 bg-accent-soft"
      aria-label="Services offered"
    >
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center gap-12 pr-12"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-12 font-ui text-xs font-semibold uppercase tracking-[0.3em] text-ink"
              >
                {service}
                <span className="text-faint" aria-hidden>
                  ·
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
