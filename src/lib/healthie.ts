/**
 * Healthie intake URL resolution.
 *
 * Each program declares a `healthieEnvVar` name. This module maps that name to
 * a runtime env value and returns:
 *   - the Healthie hosted-form URL when the env var is set, OR
 *   - a fallback link to `/intake?program=<slug>` when it's not.
 *
 * The env var stores the full URL provided by Healthie (whatever their embed /
 * hosted-form dashboard hands you), so this file doesn't need to know Healthie's
 * URL structure. Paste in what they give you.
 *
 * All env vars are `NEXT_PUBLIC_*` because the CTA renders on the client via
 * `<a href>` — no secrets are transmitted, only a hosted form URL that would be
 * visible to any patient anyway.
 */

// Env vars are read at build time. Add new programs' env vars here.
const HEALTHIE_URLS: Record<string, string | undefined> = {
  NEXT_PUBLIC_HEALTHIE_URL_WEIGHT_MANAGEMENT: process.env.NEXT_PUBLIC_HEALTHIE_URL_WEIGHT_MANAGEMENT,
  NEXT_PUBLIC_HEALTHIE_URL_LONGEVITY_VITALITY: process.env.NEXT_PUBLIC_HEALTHIE_URL_LONGEVITY_VITALITY,
  NEXT_PUBLIC_HEALTHIE_URL_SKIN_HAIR: process.env.NEXT_PUBLIC_HEALTHIE_URL_SKIN_HAIR,
  NEXT_PUBLIC_HEALTHIE_URL_HORMONE_WELLNESS: process.env.NEXT_PUBLIC_HEALTHIE_URL_HORMONE_WELLNESS,
  NEXT_PUBLIC_HEALTHIE_URL_RECOVERY_PERFORMANCE: process.env.NEXT_PUBLIC_HEALTHIE_URL_RECOVERY_PERFORMANCE,
  NEXT_PUBLIC_HEALTHIE_URL_IMMUNE_SUPPORT: process.env.NEXT_PUBLIC_HEALTHIE_URL_IMMUNE_SUPPORT,
};

export function healthieUrl(envVarName: string): string | null {
  const value = HEALTHIE_URLS[envVarName]?.trim();
  return value && value.length > 0 ? value : null;
}

export function healthieCtaHref(
  program: { slug: string; healthieEnvVar: string },
): string {
  return healthieUrl(program.healthieEnvVar) ?? `/intake?program=${program.slug}`;
}

export function healthieConfigured(program: { healthieEnvVar: string }): boolean {
  return healthieUrl(program.healthieEnvVar) !== null;
}
