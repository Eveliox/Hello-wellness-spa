/**
 * dataLayer push helper for GTM/GA4.
 *
 * Every event push in the app funnels through `trackEvent` so we have a single
 * choke point for shape enforcement, consent-aware behavior, and future
 * enrichment (page path, user id, etc.).
 *
 * ---
 * HIPAA / PHI GUARDRAIL — READ BEFORE ADDING EVENTS
 *
 * The intake forms (/intake and /intake/glp1) collect Protected Health
 * Information. Under HHS OCR guidance on tracking technologies, third-party
 * pixels/analytics on PHI-collecting pages are a compliance concern.
 *
 * Rules for anything fired from an intake page or with intake-adjacent params:
 *   1. NEVER push patient-entered field values (name, email, DOB, condition
 *      details, medications, symptoms, etc.).
 *   2. NEVER push form-field-level tracking (per-field focus/blur analytics).
 *   3. Field-INDEPENDENT signals are OK: `intake_start`, `generate_lead` with
 *      only intake_type / service slug / has_booking / LTV bucket.
 *   4. If you're unsure whether a param is PHI — assume it is and don't push it.
 *
 * Consent Mode note: default state is fully denied (see root layout). Events
 * still land in the dataLayer, but downstream tags (GA4 config, Ads pixel) do
 * not fire until consent is granted. That behavior is enforced by GTM/Consent
 * Mode, not this file.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/**
 * LTV estimates used as `value` on `generate_lead` so GA4 / Ads can pass a
 * currency-weighted conversion. Rough per-service book-value guidance from the
 * measurement spec — refine when real cohort data is available.
 */
export const LEAD_VALUE_USD = {
  glp1: 2400,
  aesthetics: 800,
  iv: 300,
  general: 300,
} as const;

export type LeadService = keyof typeof LEAD_VALUE_USD;

export function leadValueFor(service: LeadService | string | undefined): number {
  if (!service) return LEAD_VALUE_USD.general;
  if (service in LEAD_VALUE_USD) return LEAD_VALUE_USD[service as LeadService];
  // Map intake `servicesInterested` free-form strings to buckets.
  const s = service.toLowerCase();
  if (s.includes("weight") || s.includes("glp")) return LEAD_VALUE_USD.glp1;
  if (s.includes("aesthetic") || s.includes("facial") || s.includes("skin")) return LEAD_VALUE_USD.aesthetics;
  if (s.includes("iv") || s.includes("nad")) return LEAD_VALUE_USD.iv;
  return LEAD_VALUE_USD.general;
}
