import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

function TrustIcon({ kind }: { kind: "medical" | "person" | "building" | "pin" }) {
  const stroke = "currentColor";
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" as const };

  if (kind === "medical") {
    return (
      <svg {...common} aria-hidden="true" className="text-[color:#C0392B]">
        <path
          d="M12 3v6M9 6h6M8 21h8a2 2 0 0 0 2-2v-7H6v7a2 2 0 0 0 2 2Z"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "person") {
    return (
      <svg {...common} aria-hidden="true" className="text-[color:#C0392B]">
        <path
          d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z"
          stroke={stroke}
          strokeWidth="1.7"
        />
        <path
          d="M5 21c.7-4 4.2-6 7-6s6.3 2 7 6"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "building") {
    return (
      <svg {...common} aria-hidden="true" className="text-[color:#C0392B]">
        <path
          d="M4 21V8l8-5 8 5v13"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M9 21v-6h6v6" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true" className="text-[color:#C0392B]">
      <path
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 11.5a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z" stroke={stroke} strokeWidth="1.7" />
    </svg>
  );
}

export function TrustSection() {
  const icons: Array<"medical" | "person" | "building" | "pin"> = ["medical", "person", "building", "pin"];

  return (
    <section className="border-y border-line/80 bg-[#fafafa] py-14">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why guests choose us"
          title="Medical expertise. Personal attention. One roof."
          description="Hello You Wellness Center is built for clients who want real answers from licensed professionals — not scripts, not sales pitches, and not one-size-fits-all plans."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.trustBadges.map((badge, idx) => (
            <div
              key={badge.label}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.06)]"
            >
              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <TrustIcon kind={icons[idx] ?? "medical"} />
                <p className="font-ui text-sm font-semibold text-ink leading-snug">{badge.label}</p>
                <div className="col-span-2">
                  <p className="text-sm leading-relaxed text-muted">{badge.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
