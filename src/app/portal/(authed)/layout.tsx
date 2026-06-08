import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";
import { requirePatient } from "@/lib/portal-auth";
import { PortalNav } from "@/components/portal/portal-nav";
import { LogoutButton } from "@/components/portal/logout-button";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const patient = await requirePatient();
  const displayName = patient.profile?.full_name ?? patient.email;

  return (
    <main className="bg-canvas py-10">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-ink">
              ← Back to {site.shortBrand}
            </Link>
            <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
              Hi, {displayName.split(" ")[0]}
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-[var(--radius-card)] border border-line bg-surface p-3 shadow-sm">
            <PortalNav />
          </aside>

          <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm sm:p-8">
            {children}
          </section>
        </div>
      </Container>
    </main>
  );
}
