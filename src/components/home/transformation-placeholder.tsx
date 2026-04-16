import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function TransformationPlaceholder() {
  return (
    <section className="border-y border-line/80 bg-canvas py-16">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Transformations</p>
          <h2 className="font-display text-3xl text-balance text-ink sm:text-4xl">
            Before & after stories—coming to this space soon
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            We are curating photography with guest consent to showcase realistic timelines. Until then, preview
            this layout as a premium gallery block: two portrait frames with soft shadows and generous whitespace.
          </p>
          <Button href="/testimonials" variant="secondary" size="md">
            Read verified testimonials
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-[1.75rem] border border-dashed border-ink/20 bg-surface/70 p-4 text-xs text-muted shadow-inner">
            <p className="font-semibold text-ink">Before</p>
            <p className="mt-2 leading-relaxed">Drop your branded before photo here (recommended 3:4).</p>
          </div>
          <div className="aspect-[3/4] rounded-[1.75rem] border border-dashed border-ink/20 bg-surface/70 p-4 text-xs text-muted shadow-inner">
            <p className="font-semibold text-ink">After</p>
            <p className="mt-2 leading-relaxed">Pair with consistent lighting for trustworthy storytelling.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
