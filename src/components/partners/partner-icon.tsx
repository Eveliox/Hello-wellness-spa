import type { PartnerBenefitIcon } from "@/data/partners-content";

type Props = {
  name: PartnerBenefitIcon;
  className?: string;
};

const iconPaths: Record<PartnerBenefitIcon, React.ReactNode> = {
  shield: (
    <path d="M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z" />
  ),
  chart: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-6" />
      <path d="M22 20H2" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v2a1 1 0 001 1h2l6 4V6L6 10H4a1 1 0 00-1 1z" />
      <path d="M15 8a4 4 0 010 8" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14L7 21l5-3 5 3-1.5-7" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  handshake: (
    <>
      <path d="M7 11L4 14l3 3 3-3" />
      <path d="M17 11l3 3-3 3-3-3" />
      <path d="M8 12l3-3 3 3 3-3" />
      <path d="M12 15v3" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V4a2 2 0 012-2h2a2 2 0 012 2v1" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
    </>
  ),
};

export function PartnerIcon({ name, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  );
}
