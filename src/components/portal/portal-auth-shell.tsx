import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function PortalAuthShell({ eyebrow, title, description, children, footer }: Props) {
  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center py-12">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-xl text-ink hover:underline">
            {site.shortBrand}
          </Link>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-sm sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A3]">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          ) : null}

          <div className="mt-7">{children}</div>
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
      </Container>
    </main>
  );
}
