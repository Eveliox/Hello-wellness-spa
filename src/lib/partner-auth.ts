import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type PartnerRecord = {
  id: string;
  referral_code: string;
  business_name: string;
  owner_name: string;
  email: string;
  status: "active" | "paused" | "terminated";
  commission_rate: number;
  marketing_kit_url: string | null;
};

export type CurrentPartner = {
  userId: string;
  email: string;
  partner: PartnerRecord;
};

export async function getCurrentPartner(): Promise<CurrentPartner | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: partner } = await supabase
    .from("partners")
    .select(
      "id, referral_code, business_name, owner_name, email, status, commission_rate, marketing_kit_url",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!partner) return null;

  return {
    userId: user.id,
    email: user.email ?? "",
    partner: partner as PartnerRecord,
  };
}

export async function requirePartner(): Promise<CurrentPartner> {
  const current = await getCurrentPartner();
  if (!current) redirect("/partners/portal/login");
  if (current.partner.status !== "active") redirect("/partners/portal/paused");
  return current;
}
