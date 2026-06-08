import { requirePatient } from "@/lib/portal-auth";
import { ProfileForm } from "@/components/portal/profile-form";

export const metadata = {
  title: "Portal · Profile | Hello You Wellness",
  robots: { index: false },
};

export default async function PortalProfilePage() {
  const patient = await requirePatient();

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Profile</h2>
      <p className="mt-2 text-sm text-muted">
        Update your contact info and change your password.
      </p>

      <div className="mt-8">
        <ProfileForm
          email={patient.email}
          initialFullName={patient.profile?.full_name ?? ""}
          initialPhone={patient.profile?.phone ?? ""}
        />
      </div>
    </div>
  );
}
