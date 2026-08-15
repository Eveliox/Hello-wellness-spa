/**
 * Practice Better intake form URL resolution.
 *
 * Practice Better has no general-purpose server API — its only programmatic
 * surface is a narrow Zapier connector. So the integration is deliberately
 * link-based: we hand the patient a public Practice Better form URL and let
 * Practice Better create the client record and own the clinical chart.
 *
 * Practice Better is the system of record for intake. The site no longer
 * collects clinical information itself — program CTAs and /intake hand the
 * patient straight to the Practice Better form, which creates the client
 * record and owns the chart.
 *
 * Consequence worth knowing: because nothing is written to Supabase on this
 * path, `intake_submissions` receives no new rows. /portal's "My intakes" and
 * /admin still render historical rows but will not grow, and partner-referral
 * attribution no longer fires from intake. That was a deliberate trade for
 * consolidating on Practice Better — see git history for the previous
 * lead-form flow if it ever needs restoring.
 *
 * Env vars are NEXT_PUBLIC_* because the handoff link renders client-side.
 * Nothing sensitive is exposed — these are public forms the patient is about
 * to open anyway.
 */

// Read at build time. Next.js only inlines statically-analyzable references,
// so each var must be spelled out literally here rather than looked up
// dynamically off `process.env`.
const PRACTICE_BETTER_URLS: Record<string, string | undefined> = {
  NEXT_PUBLIC_PRACTICE_BETTER_URL_GENERAL:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_GENERAL,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_WEIGHT_MANAGEMENT:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_WEIGHT_MANAGEMENT,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_LONGEVITY_VITALITY:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_LONGEVITY_VITALITY,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_SKIN_HAIR:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_SKIN_HAIR,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_HORMONE_WELLNESS:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_HORMONE_WELLNESS,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_RECOVERY_PERFORMANCE:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_RECOVERY_PERFORMANCE,
  NEXT_PUBLIC_PRACTICE_BETTER_URL_IMMUNE_SUPPORT:
    process.env.NEXT_PUBLIC_PRACTICE_BETTER_URL_IMMUNE_SUPPORT,
};

/** Program slug → env var name. Keep in sync with src/content/programs.ts. */
const SLUG_TO_ENV_VAR: Record<string, string> = {
  "weight-management": "NEXT_PUBLIC_PRACTICE_BETTER_URL_WEIGHT_MANAGEMENT",
  "longevity-vitality": "NEXT_PUBLIC_PRACTICE_BETTER_URL_LONGEVITY_VITALITY",
  "skin-hair": "NEXT_PUBLIC_PRACTICE_BETTER_URL_SKIN_HAIR",
  "hormone-wellness": "NEXT_PUBLIC_PRACTICE_BETTER_URL_HORMONE_WELLNESS",
  "recovery-performance": "NEXT_PUBLIC_PRACTICE_BETTER_URL_RECOVERY_PERFORMANCE",
  "immune-support": "NEXT_PUBLIC_PRACTICE_BETTER_URL_IMMUNE_SUPPORT",
};

/** Resolve one env var name to its URL, or null when unset/blank. */
export function practiceBetterUrl(envVarName: string): string | null {
  const value = PRACTICE_BETTER_URLS[envVarName]?.trim();
  return value && value.length > 0 ? value : null;
}

/**
 * The form URL to hand a patient after they submit the lead form.
 *
 * Falls back to the general intake form when the program has no dedicated
 * form yet (or when no program was specified at all), and returns null when
 * nothing is configured — callers should degrade to "we'll be in touch"
 * rather than rendering a dead link.
 */
export function practiceBetterUrlForSlug(programSlug?: string | null): string | null {
  const envVarName = programSlug ? SLUG_TO_ENV_VAR[programSlug] : undefined;
  return (
    (envVarName ? practiceBetterUrl(envVarName) : null) ??
    practiceBetterUrl("NEXT_PUBLIC_PRACTICE_BETTER_URL_GENERAL")
  );
}

/** True when this program has its own Practice Better form configured. */
export function practiceBetterConfigured(program: { practiceBetterEnvVar: string }): boolean {
  return practiceBetterUrl(program.practiceBetterEnvVar) !== null;
}

/**
 * Where a program page's "Start intake" CTA points — the program's Practice
 * Better form directly.
 *
 * Falls back to /intake when nothing is configured, so the CTA is never a dead
 * link: that page renders its own handoff card and degrades to "call us".
 */
export function startIntakeHref(program: { slug: string }): string {
  return practiceBetterUrlForSlug(program.slug) ?? `/intake?program=${program.slug}`;
}

/** True when the given href leaves our site (i.e. points at Practice Better). */
export function isExternalIntakeHref(href: string): boolean {
  return href.startsWith("http");
}
