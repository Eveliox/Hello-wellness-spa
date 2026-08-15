import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Props = {
  programSlug: string;
  programTitle: string;
  locale?: "en" | "es";
  ctaHref?: string;
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
    reassure2Body: "Handled inside Practice Better, our clinical platform.",
    reassure3Title: "No card required",
    reassure3Body: "You'll see program pricing at consult, not before.",
    cardHeading: "Start your intake",
    cardBody:
      "Opens securely in Practice Better, our clinical platform. About 5 minutes — you can save and return to it later.",
    cardCta: "Start intake",
    askHeading: "Not ready yet?",
    askBody: "Ask one question — a clinician replies within one business day. No sales call, no upsell.",
    askCta: "Ask a question",
  },
  es: {
    eyebrow: "Iniciar intake",
    heading: "Completa tu intake antes de que nos veamos",
    body: "Este intake es específico para este programa. Tus respuestas se comparten de forma segura con el equipo clínico antes de tu consulta, para que el tiempo se dedique al cuidado — no al papeleo.",
    progress: ["Screening", "Consulta", "Labs", "Plan"],
    reassure1Title: "Unos 5 minutos",
    reassure1Body: "Guarda y regresa después. Nada cobrado.",
    reassure2Title: "Seguro HIPAA",
    reassure2Body: "Procesado en Practice Better, nuestra plataforma clínica.",
    reassure3Title: "Sin tarjeta requerida",
    reassure3Body: "Verás precios en consulta, no antes.",
    cardHeading: "Inicia tu intake",
    cardBody:
      "Se abre de forma segura en Practice Better, nuestra plataforma clínica. Unos 5 minutos — puedes guardar y regresar después.",
    cardCta: "Iniciar intake",
    askHeading: "¿No estás lista todavía?",
    askBody: "Haz una pregunta — un clínico responde dentro de un día hábil. Sin llamada de venta, sin upsell.",
    askCta: "Hacer una pregunta",
  },
} as const;

/**
 * The conversion moment on a program detail page. Dark chrome section (the ONE
 * dark section per detail page — reads as gravity).
 *
 * The CTA hands off directly to the program's Practice Better form, which owns
 * the clinical intake and creates the client record. When no form URL is
 * configured it falls back to /intake, which renders its own handoff card.
 */
export function PracticeBetterHandoff({
  programSlug,
  programTitle,
  locale = "en",
  ctaHref,
}: Props) {
  const copy = COPY[locale];
  const contactHref = locale === "es" ? "/contact?tema=" : "/contact?topic=";
  const askUrl = `${contactHref}${encodeURIComponent(programTitle)}`;
  const startUrl = ctaHref ?? `/intake?program=${programSlug}`;
  // External (Practice Better) links open in a new tab so the patient doesn't
  // lose the program page they were reading.
  const isExternal = startUrl.startsWith("http");

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

          {/* Primary CTA into our own lead form */}
          <div className="rounded-[var(--radius-card)] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-10">
            <p className="font-display text-2xl text-white text-balance">{copy.cardHeading}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 text-pretty">
              {copy.cardBody}
            </p>
            <div className="mt-8">
              <Button
                href={startUrl}
                size="lg"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="w-full bg-accent-clinical text-white hover:bg-[color-mix(in_oklab,var(--accent-clinical)_88%,white)] sm:w-auto"
              >
                {copy.cardCta}
              </Button>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold text-white">{copy.askHeading}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70 text-pretty">
                {copy.askBody}
              </p>
              <div className="mt-4">
                <Button
                  href={askUrl}
                  size="lg"
                  className="w-full border border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  {copy.askCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
