import { healthieUrl } from "@/lib/healthie";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Props = {
  envVarName: string;
  programSlug: string;
  programTitle: string;
  locale?: "en" | "es";
  fallbackCtaHref?: string;
};

const COPY = {
  en: {
    eyebrow: "Start intake",
    heading: "Complete your intake before we meet",
    body: "This intake is specific to this program. Your responses are shared securely with the clinical team before your consult, so we spend the visit on care — not paperwork.",
    progress: ["Screen", "Consult", "Labs", "Plan"],
    reassure1Title: "About 5 minutes",
    reassure1Body: "Save and return later. Nothing charged.",
    reassure2Title: "HIPAA-secure",
    reassure2Body: "Handled inside Healthie, our clinical platform.",
    reassure3Title: "No card required",
    reassure3Body: "You'll see program pricing at consult, not before.",
    fallbackHeading: "Not ready for a full intake?",
    fallbackBody:
      "Ask one question — a clinician will reply within one business day. No sales call, no upsell.",
    fallbackAsk: "Ask a question",
    fallbackFull: "Or open the full intake",
  },
  es: {
    eyebrow: "Iniciar intake",
    heading: "Completa tu intake antes de que nos veamos",
    body: "Este intake es específico para este programa. Tus respuestas se comparten de forma segura con el equipo clínico antes de tu consulta, para que el tiempo se dedique al cuidado — no al papeleo.",
    progress: ["Screening", "Consulta", "Labs", "Plan"],
    reassure1Title: "Unos 5 minutos",
    reassure1Body: "Guarda y regresa después. Nada cobrado.",
    reassure2Title: "Seguro HIPAA",
    reassure2Body: "Procesado en Healthie, nuestra plataforma clínica.",
    reassure3Title: "Sin tarjeta requerida",
    reassure3Body: "Verás precios en consulta, no antes.",
    fallbackHeading: "¿No estás lista para el intake completo?",
    fallbackBody:
      "Haz una pregunta — un clínico responde dentro de un día hábil. Sin llamada de venta, sin upsell.",
    fallbackAsk: "Hacer una pregunta",
    fallbackFull: "O abrir el intake completo",
  },
} as const;

/**
 * The conversion moment. Dark chrome section (the ONE dark section per
 * detail page — reads as gravity) with:
 *   - 4-step intake progress strip (Screen → Consult → Labs → Plan)
 *   - Left rail with 3 reassurances (time / privacy / no card)
 *   - Right side: Healthie iframe OR a lower-commitment fallback ("ask
 *     one question") when the env var isn't set — deliberately NOT the
 *     same full-PHI intake opening in a new tab, per Sofia walkthrough.
 */
export function HealthieEmbed({
  envVarName,
  programSlug,
  programTitle,
  locale = "en",
  fallbackCtaHref,
}: Props) {
  const url = healthieUrl(envVarName);
  const copy = COPY[locale];
  const contactHref = locale === "es" ? "/contact?tema=" : "/contact?topic=";
  const askUrl = `${contactHref}${encodeURIComponent(programTitle)}`;

  return (
    <section id="intake" className="bg-ink py-16 text-white sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.875rem,6vw,3rem)] leading-[1.08] text-balance text-white">
            {copy.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 text-pretty">
            {copy.body}
          </p>
        </div>

        {/* Intake progress strip — Screen → Consult → Labs → Plan */}
        <ol className="mt-10 grid grid-cols-4 gap-2 sm:gap-4" aria-label="Intake flow">
          {copy.progress.map((label, idx) => (
            <li key={label} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-ui text-[0.68rem] font-semibold " +
                    (idx === 0
                      ? "bg-accent-clinical text-white"
                      : "border border-white/25 text-white/60")
                  }
                >
                  {idx + 1}
                </span>
                <span
                  aria-hidden
                  className={
                    "h-px flex-1 " + (idx === 0 ? "bg-accent-clinical/60" : "bg-white/15")
                  }
                />
              </div>
              <p
                className={
                  "truncate text-[0.62rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.72rem] sm:tracking-[0.18em] " +
                  (idx === 0 ? "text-white" : "text-white/50")
                }
              >
                {label}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.36fr_1fr] lg:gap-14">
          {/* Reassurance sidebar */}
          <aside className="space-y-6">
            {[
              { title: copy.reassure1Title, body: copy.reassure1Body },
              { title: copy.reassure2Title, body: copy.reassure2Body },
              { title: copy.reassure3Title, body: copy.reassure3Body },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-accent-clinical/60 pl-5">
                <p className="font-display text-lg text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70 text-pretty">
                  {item.body}
                </p>
              </div>
            ))}
          </aside>

          {/* Right — iframe or honest fallback */}
          <div>
            {url ? (
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-program-paper shadow-soft">
                <iframe
                  src={url}
                  title={locale === "es" ? "Formulario de intake" : "Intake form"}
                  className="h-[820px] w-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="rounded-[var(--radius-card)] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-10">
                <p className="font-display text-2xl text-white text-balance">
                  {copy.fallbackHeading}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/75 text-pretty">
                  {copy.fallbackBody}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={askUrl}
                    size="lg"
                    className="w-full bg-accent-clinical text-white hover:bg-[color-mix(in_oklab,var(--accent-clinical)_88%,white)] sm:w-auto"
                  >
                    {copy.fallbackAsk}
                  </Button>
                  <Button
                    href={fallbackCtaHref ?? `/intake?program=${programSlug}`}
                    size="lg"
                    className="w-full border border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                  >
                    {copy.fallbackFull}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
