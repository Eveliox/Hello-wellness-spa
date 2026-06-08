import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type PatientProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
};

export type CurrentPatient = {
  userId: string;
  email: string;
  profile: PatientProfile | null;
};

/**
 * Server-side helper for portal pages. Reads the Supabase Auth session from
 * cookies. Returns `null` if not signed in.
 *
 * Pair with `requirePatient()` if the page should redirect unauthenticated
 * visitors to /portal/login.
 */
export async function getCurrentPatient(): Promise<CurrentPatient | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("patient_profiles")
    .select("id, full_name, phone, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? "",
    profile: (profile as PatientProfile | null) ?? null,
  };
}

export async function requirePatient(): Promise<CurrentPatient> {
  const patient = await getCurrentPatient();
  if (!patient) redirect("/portal/login");
  return patient;
}
