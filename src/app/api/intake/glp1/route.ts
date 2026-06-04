import { glp1IntakeSchema } from "@/lib/glp1-intake-schema";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";

export async function POST(request: Request) {
  let data;

  try {
    const json: unknown = await request.json();
    const parsed = glp1IntakeSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid form data." }, { status: 400 });
    }
    data = parsed.data;
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Save to Supabase (optional — never crashes the request)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase.from("glp1_intake_submissions").insert({
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        phone_number: data.phoneNumber,
        email: data.email,
        height: data.height,
        weight: data.weight,
        weight_loss_goal: data.weightLossGoal,
        previous_weight_loss_attempts: data.previousWeightLossAttempts ?? null,
        currently_on_glp1: data.currentlyOnGLP1,
        current_dose: data.currentDose ?? null,
        dose_preference: data.dosePreference ?? null,
        side_effects: data.sideEffects ?? null,
        side_effects_details: data.sideEffectsDetails ?? null,
        medication_on_hand: data.medicationOnHand ?? null,
        taking_medications: data.takingMedications,
        medications_list: data.medicationsList ?? null,
        diagnosed_diabetes: data.diagnosedDiabetes,
        diagnosed_thyroid: data.diagnosedThyroid,
        diagnosed_pancreatitis: data.diagnosedPancreatitis,
        family_history_mtc: data.familyHistoryMTC,
        pre_existing_conditions: data.preExistingConditions,
        pre_existing_conditions_details: data.preExistingConditionsDetails ?? null,
        currently_pregnant: data.currentlyPregnant,
        trying_to_conceive: data.tryingToConceive,
        currently_breastfeeding: data.currentlyBreastfeeding,
        last_blood_lab_work: data.lastBloodLabWork,
        last_blood_pressure_results: data.lastBloodPressureResults,
        how_did_you_hear: data.howDidYouHear,
        signature: data.signature,
      });
      if (dbError) console.error("[glp1-intake] db error", dbError);
    }
  } catch (err) {
    console.error("[glp1-intake] supabase threw", err);
  }

  // Send email notification (optional — never crashes the request)
  try {
    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (notify) {
      const rows: Array<[string, string]> = [
        ["Full Name", data.fullName],
        ["Date of Birth", data.dateOfBirth],
        ["Phone", data.phoneNumber],
        ["Email", data.email],
        ["Height", data.height],
        ["Weight", data.weight],
        ["Weight Loss Goal", data.weightLossGoal],
        ["Previous Attempts", data.previousWeightLossAttempts ?? "—"],
        ["Currently on GLP-1", data.currentlyOnGLP1],
        ["Current Dose", data.currentDose ?? "—"],
        ["Dose Preference", data.dosePreference ?? "—"],
        ["Side Effects", data.sideEffects ?? "—"],
        ["Side Effects Details", data.sideEffectsDetails ?? "—"],
        ["Medication on Hand", data.medicationOnHand ?? "—"],
        ["Taking Medications", data.takingMedications],
        ["Medications List", data.medicationsList ?? "—"],
        ["Diagnosed Diabetes", data.diagnosedDiabetes],
        ["Diagnosed Thyroid", data.diagnosedThyroid],
        ["Diagnosed Pancreatitis", data.diagnosedPancreatitis],
        ["Family History MTC/MEN2", data.familyHistoryMTC],
        ["Pre-existing Conditions", data.preExistingConditions],
        ["Pre-existing Details", data.preExistingConditionsDetails ?? "—"],
        ["Currently Pregnant", data.currentlyPregnant],
        ["Trying to Conceive", data.tryingToConceive],
        ["Currently Breastfeeding", data.currentlyBreastfeeding],
        ["Last Blood/Lab Work", data.lastBloodLabWork],
        ["Last Blood Pressure", data.lastBloodPressureResults],
        ["How Did You Hear", data.howDidYouHear.replace(/_/g, " ")],
        ["Signature", data.signature],
      ];

      const html = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
          <h2 style="margin:0 0 4px">New GLP-1 Weight Loss Intake</h2>
          <p style="margin:0 0 20px;color:#555">Submitted from ${escapeHtml(site.url)}/intake/glp1</p>
          <table style="width:100%;border-collapse:collapse">
            ${rows
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:220px;vertical-align:top">${escapeHtml(label)}</td>
                <td style="padding:6px 10px;border:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
              </tr>`
              )
              .join("")}
          </table>
        </div>
      `;

      await sendEmail({
        to: notify,
        subject: `New GLP-1 Intake · ${data.fullName}`,
        html,
        replyTo: data.email,
      });
    }
  } catch (err) {
    console.error("[glp1-intake] email threw", err);
  }

  // Patient confirmation email (best-effort)
  try {
    const firstName = data.fullName.trim().split(/\s+/)[0] || "there";
    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;color:#121212;line-height:1.6">
        <p style="margin:0 0 16px;font-size:16px">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 16px">
          Thanks for completing your weight loss intake with ${escapeHtml(site.name)}. We've received your information.
        </p>
        <p style="margin:0 0 16px">
          <strong>What happens next:</strong> A licensed medical provider will review your intake and reach out
          within 1 business day to confirm your next step. You won't be charged unless a provider determines
          that treatment is right for you.
        </p>
        <p style="margin:0 0 16px">
          If anything urgent comes up before then, call us at
          <a href="tel:${escapeHtml(site.phoneTel)}" style="color:#121212;font-weight:600;text-decoration:none">${escapeHtml(site.phoneDisplay)}</a>.
        </p>
        <p style="margin:24px 0 0;color:#777;font-size:12px;line-height:1.5">
          ${escapeHtml(site.name)}<br/>
          ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)} ${escapeHtml(site.address.zip)}<br/>
          <a href="${escapeHtml(site.url)}" style="color:#777">${escapeHtml(site.url)}</a>
        </p>
      </div>
    `;

    await sendEmail({
      to: data.email,
      subject: `We received your weight loss intake · ${site.shortBrand}`,
      html,
    });
  } catch (err) {
    console.error("[glp1-intake] patient confirmation threw", err);
  }

  return Response.json({ ok: true });
}
