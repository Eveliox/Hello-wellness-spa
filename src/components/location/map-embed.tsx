import { site, mapEmbedUrl } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function MapEmbed() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${site.name} ${site.address.line1} ${site.address.city} ${site.address.state} ${site.address.zip}`,
  )}`;

  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Visit"
              title="SW Miami clinic—easy access from Kendall & beyond"
              description="Parking and arrival notes are confirmed with your appointment so your visit stays simple."
            />
            <div className="mt-6 space-y-2 text-sm text-muted">
              <p className="font-medium text-ink">{site.address.line1}</p>
              <p>
                {site.address.city}, {site.address.state} {site.address.zip}
              </p>
              <div className="pt-4">
                <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">Hours</p>
                <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
                  {site.hoursLines.map((line, idx) => {
                    const [day, hours] = line.split("·").map((s) => s.trim());
                    return (
                      <div
                        key={line}
                        className={["grid grid-cols-[9.5rem_1fr] gap-3 px-4 py-3 text-sm", idx % 2 === 0 ? "bg-white" : "bg-black/[0.02]"].join(
                          " ",
                        )}
                      >
                        <p className="font-medium text-ink">{day}</p>
                        <p className="text-muted">{hours}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button href={directionsUrl} variant="secondary" size="md" target="_blank" rel="noreferrer">
                  Get Directions
                </Button>
                <Button href={`tel:${site.phoneTel}`} size="md" className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
                  Call {site.phoneDisplay}
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-soft">
            <iframe
              title={`Map of ${site.name}`}
              src={mapEmbedUrl}
              className="aspect-[4/3] h-[min(22rem,60vw)] w-full sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
