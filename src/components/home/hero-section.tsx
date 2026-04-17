import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TrustChip } from "@/components/ui/trust-chip";

export function HeroSection() {
  return (
    <section id="home-hero" className="relative overflow-hidden border-b border-line/80 bg-surface">
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
            <Button href={site.bookingUrl} size="lg" className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
              Book a Free Consultation
            </Button>
            <Button href="/quiz" variant="secondary" size="lg">
              Take the 2-min quiz
            </Button>
          </div>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex items-center gap-2 text-sm text-[#555] underline-offset-2 hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6.6 10.8c1.6 3.2 4.2 5.8 7.4 7.4l2.4-2.4c.3-.3.8-.4 1.2-.2 1.1.4 2.3.6 3.6.6.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C9.9 22.2 1.8 14.1 1.8 3.2 1.8 2.5 2.3 2 3 2h3.5c.7 0 1.2.5 1.2 1.2 0 1.2.2 2.4.6 3.6.1.4 0 .9-.3 1.2L6.6 10.8Z"
                fill="currentColor"
              />
            </svg>
            Call {site.phoneDisplay}
          </a>
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
              src="/images/home/hero-nad.jpg"
              alt="Hello You Wellness Center NAD+ product photo"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-black/10 bg-white/90 p-4 text-sm text-ink shadow-sm backdrop-blur-md">
              <p className="font-ui font-semibold">Reach out anytime</p>
              <p className="mt-1 text-xs text-muted">
                Call {site.phoneDisplay} or message on Instagram—our team will guide you to the right next step.
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
