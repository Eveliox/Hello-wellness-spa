import Link from "next/link";
import { Container } from "@/components/ui/container";

const steps = [
  { title: "Tell us your goals", description: "Start with a consultation and share what you’d like help with." },
  { title: "Review your options", description: "Your care team reviews your history, discusses suitability, and explains the costs." },
  { title: "Make a plan together", description: "If treatment is appropriate, agree on your next steps and follow-up care." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="home-steps-heading" className="bg-surface py-14 sm:py-16">
      <Container>
        <h2 id="home-steps-heading" className="font-display text-3xl text-ink sm:text-4xl">You don’t have to figure it out alone.</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-line pt-5">
              <span aria-hidden className="text-sm font-semibold text-ink/60">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
            </li>
          ))}
        </ol>
        <Link href="/about" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4">Meet your care team →</Link>
      </Container>
    </section>
  );
}
