import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section
      id="home-hero"
      className="relative isolate overflow-hidden bg-chrome text-on-chrome"
    >
      <video
        src="/hello you.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/home/hero-nad.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25"
        aria-hidden
      />

      <Container className="relative flex min-h-[82vh] flex-col justify-center py-24 sm:py-28">
        <div className="max-w-2xl animate-rise space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            SW Miami · Licensed Care Team
          </p>

          <h1 className="font-display text-4xl leading-[1.05] text-balance text-white sm:text-5xl lg:text-[3.4rem]">
            Hello again,{" "}
            <span className="font-script text-[1.35em] font-normal italic leading-none text-[#E8B4A3]">
              you
            </span>
            .
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Assisted weight loss, aesthetics, IV therapy, peptides, and more — guided with the same calm,
            credible approach you expect from a trusted Miami wellness center.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={site.bookingUrl} size="lg" variant="inverse">
              Book a Free Consultation
            </Button>
            <Button href="/quiz" size="lg" variant="ghostInverse">
              Take the 2-min quiz
            </Button>
          </div>

          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex items-center gap-2 text-sm text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6.6 10.8c1.6 3.2 4.2 5.8 7.4 7.4l2.4-2.4c.3-.3.8-.4 1.2-.2 1.1.4 2.3.6 3.6.6.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C9.9 22.2 1.8 14.1 1.8 3.2 1.8 2.5 2.3 2 3 2h3.5c.7 0 1.2.5 1.2 1.2 0 1.2.2 2.4.6 3.6.1.4 0 .9-.3 1.2L6.6 10.8Z"
                fill="currentColor"
              />
            </svg>
            Call {site.phoneDisplay}
          </a>

          <p className="text-xs text-white/60">
            Not sure where to start?{" "}
            <Link
              href="/quiz"
              className="font-medium text-white underline-offset-2 hover:underline"
            >
              The quiz matches you to a service
            </Link>
            . Medical services require screening.
          </p>
        </div>
      </Container>
    </section>
  );
}
