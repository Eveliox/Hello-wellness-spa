import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-white shadow-soft hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-ink/30",
  secondary:
    "bg-surface text-ink border border-line shadow-sm hover:border-ink/25 hover:shadow-soft",
  ghost: "text-ink hover:bg-accent-soft/80",
  subtle: "bg-accent-soft text-ink hover:bg-[color-mix(in_oklab,var(--accent-soft)_88%,white)]",
  /** Solid button on dark header / chrome (white pill) */
  inverse: "bg-white text-ink shadow-none hover:bg-[#ececec] focus-visible:ring-2 focus-visible:ring-white/50",
  /** Quiet control on dark chrome */
  ghostInverse: "text-white/75 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30",
} as const;

const sizes = {
  sm: "h-10 px-4 text-sm rounded-full font-ui font-semibold",
  md: "h-11 px-5 text-sm rounded-full font-ui font-semibold",
  lg: "h-12 px-6 text-[0.95rem] rounded-full font-ui font-semibold",
} as const;

type ButtonOwnProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const styles = cn(
    "inline-flex items-center justify-center gap-2 tracking-wide transition duration-200 disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={styles} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={styles} {...buttonRest}>
      {children}
    </button>
  );
}
