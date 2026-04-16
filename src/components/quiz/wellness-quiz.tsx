"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";
import { services, type ServiceSlug } from "@/content/services";
import {
  MAX_MULTI_SELECT,
  quizSteps,
  recommendService,
  type QuizStep,
} from "@/content/quiz";

type StepAnswer = string[];
type AnswerMap = Record<string, StepAnswer>;

type LeadForm = {
  name: string;
  email: string;
  phone: string;
};

type View =
  | { kind: "step"; index: number }
  | { kind: "lead" }
  | { kind: "submitting" }
  | { kind: "result"; service: ServiceSlug }
  | { kind: "error"; message: string };

const totalSteps = quizSteps.length + 1; // steps + lead form

function mergeWeights(answers: AnswerMap): Partial<Record<ServiceSlug, number>> {
  const totals: Partial<Record<ServiceSlug, number>> = {};
  for (const step of quizSteps) {
    const selected = answers[step.id] ?? [];
    for (const optId of selected) {
      const option = step.options.find((o) => o.id === optId);
      if (!option) continue;
      for (const [slug, value] of Object.entries(option.weights) as [ServiceSlug, number][]) {
        totals[slug] = (totals[slug] ?? 0) + value;
      }
    }
  }
  return totals;
}

export function WellnessQuiz() {
  const [view, setView] = useState<View>({ kind: "step", index: 0 });
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [lead, setLead] = useState<LeadForm>({ name: "", email: "", phone: "" });
  const [leadError, setLeadError] = useState<string | null>(null);

  const currentStepIndex = view.kind === "step" ? view.index : view.kind === "lead" ? quizSteps.length : quizSteps.length;
  const progress = Math.min(100, Math.round(((currentStepIndex + (view.kind === "result" ? 1 : 0)) / totalSteps) * 100));

  const weights = useMemo(() => mergeWeights(answers), [answers]);

  function toggleOption(step: QuizStep, optionId: string) {
    setAnswers((prev) => {
      const current = prev[step.id] ?? [];
      if (step.type === "single") {
        return { ...prev, [step.id]: [optionId] };
      }
      const has = current.includes(optionId);
      if (has) return { ...prev, [step.id]: current.filter((id) => id !== optionId) };
      if (current.length >= MAX_MULTI_SELECT) return prev;
      return { ...prev, [step.id]: [...current, optionId] };
    });
  }

  function advanceFromStep(step: QuizStep) {
    const selected = answers[step.id] ?? [];
    if (selected.length === 0) return;
    if (view.kind !== "step") return;
    if (view.index === quizSteps.length - 1) {
      setView({ kind: "lead" });
    } else {
      setView({ kind: "step", index: view.index + 1 });
    }
  }

  function back() {
    if (view.kind === "lead") {
      setView({ kind: "step", index: quizSteps.length - 1 });
      return;
    }
    if (view.kind === "step" && view.index > 0) {
      setView({ kind: "step", index: view.index - 1 });
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadError(null);
    if (!lead.name.trim() || lead.name.trim().length < 2) {
      setLeadError("Please share your first name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
      setLeadError("Enter a valid email so we can send your result.");
      return;
    }
    const recommended = recommendService(weights);
    setView({ kind: "submitting" });

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim() || undefined,
          answers,
          recommendation: recommended,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setView({ kind: "result", service: recommended });
    } catch {
      setView({ kind: "error", message: "We couldn't save your result. You can still see your recommendation below." });
      // Show recommendation anyway after short beat
      setTimeout(() => setView({ kind: "result", service: recommended }), 1200);
    }
  }

  const step = view.kind === "step" ? quizSteps[view.index] : null;

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft sm:p-8">
      <ProgressBar percent={progress} />

      {step ? (
        <StepView
          step={step}
          selected={answers[step.id] ?? []}
          onToggle={(id) => toggleOption(step, id)}
          onNext={() => advanceFromStep(step)}
          onBack={view.kind === "step" && view.index > 0 ? back : null}
          isLast={view.kind === "step" && view.index === quizSteps.length - 1}
        />
      ) : null}

      {view.kind === "lead" ? (
        <LeadView
          lead={lead}
          setLead={setLead}
          error={leadError}
          onSubmit={submitLead}
          onBack={back}
        />
      ) : null}

      {view.kind === "submitting" ? (
        <div className="py-16 text-center text-sm text-muted">Matching your answers…</div>
      ) : null}

      {view.kind === "result" ? <ResultView service={view.service} /> : null}

      {view.kind === "error" ? (
        <div className="py-16 text-center text-sm text-red-700" role="alert">
          {view.message}
        </div>
      ) : null}
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="mb-6" aria-hidden>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent-soft">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StepView({
  step,
  selected,
  onToggle,
  onNext,
  onBack,
  isLast,
}: {
  step: QuizStep;
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: (() => void) | null;
  isLast: boolean;
}) {
  const canAdvance = selected.length > 0;
  const multiAtCap = step.type === "multi" && selected.length >= MAX_MULTI_SELECT;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">{step.eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{step.title}</h2>
        {step.subtitle ? <p className="mt-2 text-sm text-muted">{step.subtitle}</p> : null}
      </div>

      <fieldset className="space-y-2.5" aria-label={step.title}>
        {step.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const disabled = !isSelected && multiAtCap;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={cn(
                "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25",
                isSelected
                  ? "border-ink bg-accent-soft"
                  : "border-line bg-canvas/60 hover:border-ink/25 hover:bg-accent-soft/60",
                disabled && "opacity-40",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-ink bg-ink text-white" : "border-line bg-white",
                )}
              >
                {isSelected ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span className="block font-ui text-sm font-semibold text-ink">{option.label}</span>
                {option.hint ? (
                  <span className="mt-0.5 block text-xs text-muted">{option.hint}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </fieldset>

      <div className="flex items-center justify-between gap-3 pt-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="font-ui text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} disabled={!canAdvance} size="lg">
          {isLast ? "Almost done" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function LeadView({
  lead,
  setLead,
  error,
  onSubmit,
  onBack,
}: {
  lead: LeadForm;
  setLead: (v: LeadForm | ((prev: LeadForm) => LeadForm)) => void;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  const inputClass =
    "mt-1 w-full rounded-2xl border border-line bg-canvas/70 px-4 py-3 text-sm text-ink shadow-inner outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/25";
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step 5 of 5</p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Where should we send your match?</h2>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll email your recommendation so you can revisit anytime. No spam.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="quiz-name">
            First name
          </label>
          <input
            id="quiz-name"
            className={inputClass}
            autoComplete="given-name"
            value={lead.name}
            onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="quiz-email">
            Email
          </label>
          <input
            id="quiz-email"
            type="email"
            className={inputClass}
            autoComplete="email"
            value={lead.email}
            onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="quiz-phone">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="quiz-phone"
          type="tel"
          className={inputClass}
          autoComplete="tel"
          value={lead.phone}
          onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="font-ui text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          ← Back
        </button>
        <Button size="lg">Show my match</Button>
      </div>
      <p className="text-xs text-faint">
        Medical services require screening. Submitting this does not book or start treatment.
      </p>
    </form>
  );
}

function ResultView({ service }: { service: ServiceSlug }) {
  const match = services.find((s) => s.slug === service);
  if (!match) return null;
  return (
    <div className="space-y-6">
      <div>
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your best first step</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{match.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{match.summary}</p>
      </div>
      <ul className="space-y-2 border-t border-line pt-5">
        {match.benefits.slice(0, 3).map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-ink">
            <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button href={site.bookingUrl} size="lg" className="sm:flex-1">
          Book this consult
        </Button>
        <Button href={`/services/${match.slug}`} variant="secondary" size="lg" className="sm:flex-1">
          Read more first
        </Button>
      </div>
      <p className="text-xs text-faint">
        Not the right fit?{" "}
        <Link href="/services" className="underline underline-offset-2 hover:text-ink">
          Browse every service
        </Link>{" "}
        or call{" "}
        <a href={`tel:${site.phoneTel}`} className="underline underline-offset-2 hover:text-ink">
          {site.phoneDisplay}
        </a>
        .
      </p>
    </div>
  );
}
