import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TrustChip } from "@/components/ui/trust-chip";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line/80 bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,22,22,0.06),_transparent_58%)]" />
      <Container className="relative grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="animate-rise space-y-6">
          <div className="flex flex-wrap gap-2">
            <TrustChip>SW Miami</TrustChip>
            <TrustChip>Licensed care team</TrustChip>
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-[1.05] text-balance text-ink sm:text-5xl lg:text-[3.15rem]">
              Whole-body wellness, personalized for you.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Assisted weight loss, aesthetics, IV therapy, peptides, and more—guided with the same calm,
              credible approach you expect from a trusted Miami wellness center.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href="/quiz" variant="secondary" size="lg">
              Take the 2-min quiz
            </Button>
          </div>
          <p className="text-xs text-faint">
            Not sure where to start?{" "}
            <Link href="/quiz" className="font-medium text-ink underline-offset-2 hover:underline">
              The quiz matches you to a service
            </Link>
            . Medical services require screening.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft lg:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop"
              alt="Soft-lit treatment suite with fresh botanicals"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-black/10 bg-white/90 p-4 text-sm text-ink shadow-sm backdrop-blur-md">
              <p className="font-ui font-semibold">Reach out anytime</p>
              <p className="mt-1 text-xs text-muted">
                Call us or message on Instagram—our team will guide you to the right next step.
              </p>
              <a
                href={site.social.instagram}
                className="mt-3 inline-flex font-ui text-xs font-semibold text-ink hover:underline"
              >
                Message on Instagram →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
