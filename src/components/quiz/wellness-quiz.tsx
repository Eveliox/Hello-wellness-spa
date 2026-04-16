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

type View =
  | { kind: "step"; index: number }
  | { kind: "result"; service: ServiceSlug }
  | { kind: "error"; message: string };

const totalSteps = quizSteps.length;

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

  const currentStepIndex = view.kind === "step" ? view.index : quizSteps.length - 1;
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
      const recommended = recommendService(weights);
      setView({ kind: "result", service: recommended });
    } else {
      setView({ kind: "step", index: view.index + 1 });
    }
  }

  function back() {
    if (view.kind === "step" && view.index > 0) {
      setView({ kind: "step", index: view.index - 1 });
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
          {isLast ? "Show my match" : "Continue"}
        </Button>
      </div>
    </div>
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
      <Link
        href={`/services/${match.slug}`}
        className={cn(
          "block rounded-[var(--radius-card)] border border-line bg-canvas/60 p-5 shadow-sm transition",
          "hover:-translate-y-0.5 hover:bg-accent-soft/60 hover:shadow-soft",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Tap to view details</p>
        <p className="mt-2 font-display text-2xl text-ink">{match.title} →</p>
        <p className="mt-2 text-sm text-muted">See what to expect, who it’s ideal for, and common questions.</p>
      </Link>
      <ul className="space-y-2 border-t border-line pt-5">
        {match.benefits.slice(0, 3).map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-ink">
            <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button href={`/services/${match.slug}`} size="lg" className="sm:flex-1">
          View my match
        </Button>
        <Button href="/store" variant="secondary" size="lg" className="sm:flex-1">
          Shop (coming soon)
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
