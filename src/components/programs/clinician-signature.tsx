import { medicalDirector } from "@/content/clinicians";

type Props = {
  locale?: "en" | "es";
  /** Tone variant — light for cream sections, dark for chrome. */
  variant?: "light" | "dark";
};

const COPY = {
  en: {
    signedBy: "Signed by",
    programDirected: "This program is prescribed and monitored by the clinician above.",
    verify: "Verify license",
  },
  es: {
    signedBy: "Firmado por",
    programDirected: "Este programa es prescrito y monitoreado por el clínico anterior.",
    verify: "Verificar licencia",
  },
} as const;

/**
 * The single highest-trust element on program pages: a named clinician,
 * their credential, their license number, and (if provided) a link to
 * verify the license on the state medical board site.
 *
 * Placeholder values live in `src/content/clinicians.ts` — REPLACE them
 * before shipping to production. Displaying a placeholder in prod is
 * worse than displaying no signature at all.
 */
export function ClinicianSignature({ locale = "en", variant = "light" }: Props) {
  const copy = COPY[locale];
  const isDark = variant === "dark";
  const isPlaceholder = medicalDirector.name.startsWith("TODO");
  if (isPlaceholder) return null;

  return (
    <div
      className={
        "flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between " +
        (isDark
          ? "border-white/15 bg-white/[0.04] text-white"
          : "border-line bg-surface text-ink")
      }
    >
      <div>
        <p
          className={
            "text-[0.65rem] font-semibold uppercase tracking-[0.24em] " +
            (isDark ? "text-accent-clinical" : "text-accent-clinical")
          }
        >
          {copy.signedBy}
        </p>
        <p
          className={
            "mt-2 font-script text-4xl leading-none " +
            (isDark ? "text-white" : "text-ink")
          }
        >
          {medicalDirector.name}
        </p>
        <p
          className={
            "mt-2 font-ui text-xs uppercase tracking-[0.18em] " +
            (isDark ? "text-white/70" : "text-muted")
          }
        >
          {medicalDirector.credential} · {medicalDirector.role} · {medicalDirector.license}
        </p>
        <p className={"mt-2 text-xs " + (isDark ? "text-white/55" : "text-faint")}>
          {copy.programDirected}
        </p>
      </div>
      {medicalDirector.verifyUrl ? (
        <a
          href={medicalDirector.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            "inline-flex items-center gap-1 self-start text-xs font-semibold uppercase tracking-[0.18em] underline-offset-4 hover:underline " +
            (isDark ? "text-accent-clinical" : "text-accent-clinical")
          }
        >
          {copy.verify}
          <span aria-hidden>↗</span>
        </a>
      ) : null}
    </div>
  );
}
