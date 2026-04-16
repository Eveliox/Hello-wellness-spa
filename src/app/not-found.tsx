import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">404</p>
        <h1 className="mt-3 font-display text-4xl text-ink">This page drifted away</h1>
        <p className="mt-3 text-sm text-muted">
          The link may be outdated. Let us take you somewhere more relaxing.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/">Return home</Button>
          <Button href="/book" variant="secondary">
            Book a visit
          </Button>
        </div>
        <p className="mt-8 text-sm">
          <Link className="font-semibold text-accent hover:underline" href="/contact">
            Contact concierge
          </Link>
        </p>
      </Container>
    </section>
  );
}
