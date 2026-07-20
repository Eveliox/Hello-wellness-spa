import type { Metadata } from "next";
import { PortalAuthShell } from "@/components/portal/portal-auth-shell";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Partner account on hold | Hello You",
  robots: { index: false },
};

export default function PartnerPausedPage() {
  return (
    <PortalAuthShell
      eyebrow="Partner portal"
      title="Your account is paused"
      description={
        <>
          Your partner account is currently on hold. Text or call{" "}
          <a href={`tel:${site.phoneTel}`} className="font-semibold text-ink hover:underline">
            {site.phoneDisplay}
          </a>{" "}
          and we&apos;ll sort it out.
        </>
      }
    >
      <div className="h-4" aria-hidden />
    </PortalAuthShell>
  );
}
