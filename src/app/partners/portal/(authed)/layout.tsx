import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";
import { requirePartner } from "@/lib/partner-auth";
import { PartnerLogoutButton } from "@/components/partners/partner-auth-forms";

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const { partner } = await requirePartner();
  const displayName = partner.owner_name.split(" ")[0] || partner.business_name;

  return (
    <main className="bg-canvas py-10">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              ← Back to {site.shortBrand}
            </Link>
            <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
              Hi, {displayName}
            </h1>
            <p className="mt-1 text-sm text-muted">Partner dashboard · {partner.business_name}</p>
          </div>
          <PartnerLogoutButton />
        </div>

        <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm sm:p-8">
          {children}
        </section>
      </Container>
    </main>
  );
}
