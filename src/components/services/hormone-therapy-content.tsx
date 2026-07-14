import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { providers, providerByline } from "@/content/providers";

const mensProgram = {
  symptoms: [
    "Fatigue that persists despite adequate sleep",
    "Reduced libido or sexual function",
    "Depressed mood, irritability, or motivational flatness",
    "Loss of muscle mass or strength; new central weight gain",
    "Cognitive fog, reduced sharpness",
    "Sleep disruption",
  ],
  labs: [
    "Total testosterone (morning draw, ideally repeated on a second day for confirmation)",
    "Free testosterone",
    "Sex hormone-binding globulin (SHBG)",
    "Estradiol (sensitive assay)",
    "Luteinizing hormone (LH) and follicle-stimulating hormone (FSH)",
    "Prostate-specific antigen (PSA) — baseline before initiating therapy",
    "Comprehensive metabolic panel and complete blood count (hematocrit matters on TRT)",
    "Lipid panel",
  ],
  delivery: [
    {
      title: "Injection (testosterone cypionate or testosterone enanthate)",
      body: "Most common. Weekly or twice-weekly intramuscular or subcutaneous injection. Steady, adjustable, cost-effective. Requires either self-administration at home or in-clinic visits.",
    },
    {
      title: "Pellet implants",
      body: "Subcutaneous pellets placed in-office, typically providing 3-6 months of steady release. Convenient; less dose flexibility mid-cycle.",
    },
    {
      title: "Topical gel",
      body: "Daily application. Non-injection option; requires care to avoid transfer to partners or children.",
    },
  ],
  monitoring: [
    { when: "6 weeks after initiation", what: "Repeat total T, free T, estradiol, hematocrit." },
    { when: "3 months", what: "Full panel including PSA." },
    {
      when: "Quarterly thereafter",
      what: "Rotating panel; PSA and hematocrit at minimum on the schedule your physician sets.",
    },
  ],
} as const;

const womensProgram = {
  symptoms: [
    "Hot flashes and night sweats (vasomotor symptoms)",
    "Sleep disruption",
    "Mood changes, irritability, new anxiety",
    "Vaginal dryness, discomfort, painful intercourse (genitourinary syndrome of menopause)",
    "Cognitive changes — word-finding, focus",
    "Changes in menstrual cycle regularity or flow (perimenopause)",
    "New or worsening joint aches",
  ],
  delivery: [
    {
      title: "Estradiol",
      body: "Transdermal patch, topical gel, oral tablet, or pellet implant. Transdermal routes have a different risk profile than oral routes and are often preferred in patients with specific cardiovascular considerations.",
    },
    {
      title: "Progesterone",
      body: "Oral micronized progesterone or topical formulations, dosed cyclically or continuously depending on your protocol.",
    },
    {
      title: "Additional hormonal support",
      // Legal fix applied inline: original draft L111 named a specific off-label
      // use for women's testosterone. Public-facing copy now reflects a general
      // consult-only framing per Legal Compliance guidance.
      body: "For some women, additional hormonal support beyond estrogen and progesterone may be discussed during consultation. Note: no FDA-approved testosterone product exists for women in the U.S.",
    },
  ],
  labs: [
    "FSH, LH, estradiol, progesterone",
    "Total and free testosterone, SHBG (where relevant)",
    "Thyroid panel (TSH, free T4)",
    "Lipid panel, comprehensive metabolic panel, CBC",
    "Current mammogram and pap status",
    "Personal and family history of breast, ovarian, endometrial cancer; clotting disorders; cardiovascular events",
  ],
  monitoring: [
    {
      when: "6-12 weeks after initiation or dose change",
      what: "Symptom review, targeted labs.",
    },
    {
      when: "6 months, then annually",
      what: "Full review including cancer screening currency (mammogram, pap per age-appropriate guidelines), lipids, metabolic panel.",
    },
    {
      when: "Ongoing",
      what: "Any new breast changes, unexpected vaginal bleeding, or leg pain/swelling triggers immediate re-evaluation, not the next scheduled visit.",
    },
  ],
} as const;

const contraindications = [
  "Active or recent hormone-sensitive cancers — breast, prostate (for testosterone), endometrial, ovarian",
  "Active thromboembolic disease or high-risk clotting history",
  "Uncontrolled hypertension",
  "Undiagnosed vaginal bleeding (must be worked up first)",
  "Active liver disease",
  "Pregnancy or breastfeeding",
  "Recent stroke or myocardial infarction",
] as const;

type Props = {
  bookingUrl: string;
};

export function HormoneTherapyContent({ bookingUrl }: Props) {
  const byline = providerByline(providers.hormoneOversight);

  return (
    <>
      {/* ── Provider byline / lead framing ── */}
      <section className="border-b border-line/80 bg-surface py-10">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C0392B]">
              Clinical oversight
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              Clinical oversight by <span className="font-semibold text-ink">{byline}</span> — Hello You
              Wellness Center, 9660 SW 72nd St, Miami, FL 33173.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
              Hormones are not a lifestyle purchase. Hormone replacement therapy — for men with clinically
              low testosterone, and for women navigating perimenopause and menopause — is medicine. Done
              well, it can meaningfully improve day-to-day quality of life. Done casually, it can create
              real risk. We frame this work around symptom management and quality of life. We do not
              promise disease prevention.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Men's TRT ── */}
      <section className="py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Testosterone therapy for men (TRT)</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              If you are a man over roughly 35 and something feels off — persistent fatigue that sleep does
              not fix, dropping libido, mood flatness, harder time holding muscle, mental fog that used to
              not be there — clinically low testosterone is one of several things worth ruling in or out.
              It is not the only cause of those symptoms. That is exactly why the process starts with labs,
              not a script.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-ink">Symptoms we hear most often</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {mensProgram.symptoms.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-faint">
                  None of these on their own diagnoses low T. Together, over time, they warrant evaluation.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-ink">Diagnostic labs</h3>
                <p className="mt-2 text-sm text-muted">
                  Before we discuss any therapy, we run a baseline panel. Typical labs include:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {mensProgram.labs.map((lab) => (
                    <li key={lab} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                      <span>{lab}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={120}>
            <div className="mt-10">
              <h3 className="font-display text-2xl text-ink">Delivery options</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                There is no single "best" delivery method — the right choice depends on your labs, your
                lifestyle, and how your body responds. We discuss all three at consult.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {mensProgram.delivery.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-ink">{d.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
              <h3 className="font-display text-2xl text-ink">Monitoring cadence</h3>
              <p className="mt-2 text-sm text-muted">
                TRT without monitoring is not TRT — it is unsupervised hormone use. Our standard cadence:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {mensProgram.monitoring.map((m) => (
                  <li key={m.when} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <span className="shrink-0 text-sm font-semibold text-ink">{m.when}:</span>
                    <span>{m.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delayMs={200}>
            <div className="mt-10 rounded-[var(--radius-card)] border-l-[3px] [border-left-color:#C0392B] border border-line bg-[#faf8f6] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C0392B]">
                Program pricing
              </p>
              <p className="mt-3 font-display text-2xl text-ink">
                Men's TRT programs start at $499/program.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                Pricing includes physician evaluation, ongoing oversight, and program-defined follow-up.
                Lab costs and specific medication compounding may be quoted separately depending on your
                protocol. We quote the full program before you commit — no surprise recurring charges.
              </p>
              <div className="mt-5">
                <a
                  href={bookingUrl}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#1a1a1a] px-5 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]/90"
                >
                  Check if you qualify <span aria-hidden className="ml-2">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Women's HRT / BHRT ── */}
      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">
              Hormone therapy for women (HRT and BHRT)
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              Perimenopause often starts earlier than women expect — sometimes in the late 30s, more
              commonly in the 40s — and menopause itself is not a single day but a transition. Symptoms
              range from disruptive to debilitating, and they are legitimate targets for treatment. You do
              not have to "just get through it."
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-ink">Symptoms we hear most often</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {womensProgram.symptoms.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-ink">Diagnostic labs and screening</h3>
                <p className="mt-2 text-sm text-muted">
                  Before initiating hormone therapy, we review or order:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {womensProgram.labs.map((lab) => (
                    <li key={lab} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                      <span>{lab}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={120}>
            <div className="mt-10">
              <h3 className="font-display text-2xl text-ink">
                Estrogen, progesterone, and how we pair them
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                For women with an intact uterus, unopposed estrogen therapy carries endometrial risk.
                Progesterone is paired with estrogen therapy in that setting. This is standard of care — not
                optional, not a preference.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {womensProgram.delivery.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-ink">{d.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
              <h3 className="font-display text-2xl text-ink">Monitoring cadence for women</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {womensProgram.monitoring.map((m) => (
                  <li key={m.when} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <span className="shrink-0 text-sm font-semibold text-ink">{m.when}:</span>
                    <span>{m.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── BHRT myth-dispelling callout ── */}
      <section className="py-16">
        <Container>
          <Reveal>
            <div className="rounded-[var(--radius-card)] border-l-[3px] [border-left-color:#C0392B] border border-line bg-[#faf8f6] p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C0392B]">
                BHRT — what "bioidentical" actually means
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                Bioidentical hormone replacement therapy (BHRT) is a widely marketed category, and it is
                worth being honest about what the word means.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink">
                  "Bioidentical" describes molecular structure.
                </span>{" "}
                A bioidentical hormone has the same molecular structure as the hormone your body produces
                endogenously. Estradiol is estradiol whether it is FDA-approved and manufactured by a large
                pharmaceutical company or compounded by a 503A pharmacy — the molecule is the same.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink">
                  "Bioidentical" does not mean "natural," "safer," or "free of risk."
                </span>{" "}
                This is the marketing myth. Compounded BHRT is not automatically safer than FDA-approved
                conventional HRT. In fact, most compounded BHRT formulations lack FDA approval, meaning they
                have not been through the same efficacy, dosing consistency, and safety review that
                approved products have.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                We prescribe both FDA-approved bioidentical products (yes — many mainstream HRT products
                are already bioidentical, such as estradiol patches and micronized progesterone) and, where
                clinically appropriate, compounded formulations. The distinction we make with patients is
                real and evidence-based, not marketed.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Contraindications ── */}
      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Contraindications and cautions</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              HRT is not appropriate for every patient. We will not prescribe (or will require specialty
              clearance before considering) in the presence of:
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {contraindications.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 text-sm text-muted shadow-sm"
                >
                  <span className="mt-1 text-[#C0392B]" aria-hidden>
                    ●
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delayMs={120}>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
              For men considering TRT: unaddressed severe sleep apnea, elevated hematocrit, and abnormal
              PSA warrant workup before initiation.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Pricing transparency ── */}
      <section className="py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Pricing transparency</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-ink">Men's TRT programs</p>
                <p className="mt-2 font-display text-2xl text-ink">Starts at $499/program</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Includes physician evaluation and defined ongoing oversight; medication and lab costs may
                  be quoted separately.
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-ink">Women's HRT and BHRT programs</p>
                <p className="mt-2 font-display text-2xl text-ink">Quoted at consult</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Pricing varies by delivery method, whether the formulation is FDA-approved or compounded,
                  and monitoring intensity.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delayMs={120}>
            <p className="mt-6 max-w-3xl text-sm text-muted">
              You will receive a full quote before you commit. We do not run silent auto-charges.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Why in-person + cross-link to aesthetics ── */}
      <section className="border-t border-line/80 bg-surface py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Why in-person hormone care matters</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
              Telehealth HRT and TRT services have expanded access, and for some patients that model works.
              What we offer is different, not better in every case: in-person consultation, in-clinic labs
              at a SW Miami location you can drive to, physician follow-ups you can look someone in the eye
              for, and a chart that stays with a specific practice rather than a rotating national roster.
              If you value that model — particularly for a therapy that will likely be ongoing — that is
              what we are built to provide.
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
              Also see our{" "}
              <a
                href="/services/aesthetics-cosmetics"
                className="font-semibold text-ink underline-offset-4 hover:underline"
              >
                Aesthetics services
              </a>{" "}
              — TRT was previously listed there as part of our broader hormone and wellness program;
              hormone therapy is now home here.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
