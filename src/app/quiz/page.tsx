import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { WellnessQuiz } from "@/components/quiz/wellness-quiz";

export const metadata: Metadata = createMetadata({
  title: "Wellness quiz",
  description:
    "Answer five quick questions and we'll recommend the best first step at Hello You Wellness—weight loss, aesthetics, IV therapy, or peptides.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-2xl text-center">
          <p className="font-ui flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            2 minutes · No commitment
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
          </p>
          <h1 className="mt-3 font-display text-4xl text-balance text-ink sm:text-5xl">
            Find your{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              best
            </span>{" "}
            first step.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Five quick questions, then an instant recommendation from our service menu—no email required.
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container className="max-w-2xl">
          <WellnessQuiz />
          <p className="mt-6 text-center text-xs text-faint">
            Prefer to talk? Call{" "}
            <a href={`tel:${site.phoneTel}`} className="underline underline-offset-2 hover:text-ink">
              {site.phoneDisplay}
            </a>{" "}
            or{" "}
            <a href="/contact" className="underline underline-offset-2 hover:text-ink">
              send a message
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
