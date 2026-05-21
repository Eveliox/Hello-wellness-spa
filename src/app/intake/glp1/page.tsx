import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GLP1Wizard } from "@/components/intake/glp1-wizard";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Intake | Hello You Wellness Center",
  description:
    "Start your GLP-1 assisted weight loss journey. Complete this confidential intake and find out if you're a candidate — a licensed provider reviews every submission.",
};

export default function GLP1IntakePage() {
  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            GLP-1 Weight Loss Program
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Start your{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              intake
            </span>
          </h1>
          <p className="mt-3 text-sm text-muted">
            Answer a few questions and we&apos;ll instantly show you whether you&apos;re a
            candidate and which plan fits your goals. A licensed APRN reviews every submission.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            {["Takes ~3 minutes", "100% confidential", "No commitment required"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4A3]" aria-hidden />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <GLP1Wizard />
          </div>
        </div>
      </Container>
    </main>
  );
}
