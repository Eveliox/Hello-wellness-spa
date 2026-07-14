/**
 * Provider byline placeholders.
 *
 * When the real named physician/APRN copy is finalized, replace the values below
 * with the actual name and credentials. This is the single find-and-replace spot
 * that feeds every service page that displays a clinical byline (currently: the
 * hormone-therapy page).
 *
 * IMPORTANT: Do NOT invent a name. Until the clinic supplies the byline, these
 * strings render literally on the page so it is obvious to a reviewer that the
 * placeholder still needs to be filled in before publish.
 */
export const providers = {
  hormoneOversight: {
    name: "[PROVIDER_NAME]",
    credentials: "[CREDENTIALS]",
  },
} as const;

/** Convenience: "Dr. Jane Smith, MD" style byline once populated. */
export function providerByline(p: { name: string; credentials: string }) {
  return `${p.name}, ${p.credentials}`;
}
