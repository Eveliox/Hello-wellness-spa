import { intakeSchema } from "@/lib/intake-schema";
import { escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/content/site";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = intakeSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid form data." }, { status: 400 });
    }

    const data = parsed.data;

    const notify = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!notify) {
      console.warn("[intake] CONTACT_NOTIFICATION_EMAIL not set — submission not delivered", {
        name: data.fullName,
        email: data.email,
      });
      return Response.json({ ok: true });
    }

    const { error: dbError } = await supabase.from("intake_submissions").insert({
      registration_date: data.registrationDate,
      full_name: data.fullName,
      date_of_birth: data.dateOfBirth,
      address: data.address,
      phone_number: data.phoneNumber,
      email: data.email,
      employment_status: data.employmentStatus,
      employer: data.employer ?? null,
      taking_medications: data.takingMedications,
      medications_list: data.medicationsList ?? null,
      emergency_contact: data.emergencyContact,
      height: data.height,
      weight: data.weight,
      drinks_alcohol: data.drinksAlcohol,
      smokes_cigarettes: data.smokesCigarettes,
      recreational_drugs: data.recreationalDrugs,
      pre_existing_conditions: data.preExistingConditions,
      pre_existing_conditions_details: data.preExistingConditionsDetails ?? null,
      diagnosed_diabetes: data.diagnosedDiabetes,
      diagnosed_thyroid: data.diagnosedThyroid,
      diagnosed_pancreatitis: data.diagnosedPancreatitis,
      medical_conditions_details: data.medicalConditionsDetails ?? null,
      family_history_illness: data.familyHistoryIllness,
      family_history_details: data.familyHistoryDetails ?? null,
      currently_pregnant: data.currentlyPregnant,
      trying_to_conceive: data.tryingToConceive,
      currently_breastfeeding: data.currentlyBreastfeeding,
      last_blood_lab_work: data.lastBloodLabWork,
      last_blood_pressure_date: data.lastBloodPressureDate,
      last_blood_pressure_results: data.lastBloodPressureResults,
      covid_vaccination_status: data.covidVaccinationStatus,
      under_physician_supervision: data.underPhysicianSupervision,
      reason_for_visit: data.reasonForVisit,
      services_interested: data.servicesInterested,
      how_did_you_hear: data.howDidYouHear,
      signature: data.signature,
    });

    if (dbError) {
      console.error("[intake] supabase insert error", dbError);
    }

    const rows: Array<[string, string]> = [
      ["Registration Date", data.registrationDate],
      ["Full Name", data.fullName],
      ["Date of Birth", data.dateOfBirth],
      ["Address", data.address],
      ["Phone", data.phoneNumber],
      ["Email", data.email],
      ["Employment Status", data.employmentStatus],
      ["Employer", data.employer ?? "—"],
      ["Taking Medications", data.takingMedications],
      ["Medications List", data.medicationsList ?? "—"],
      ["Emergency Contact", data.emergencyContact],
      ["Height", data.height],
      ["Weight", data.weight],
      ["Drinks Alcohol", data.drinksAlcohol],
      ["Smokes Cigarettes", data.smokesCigarettes],
      ["Recreational Drugs", data.recreationalDrugs],
      ["Pre-existing Conditions", data.preExistingConditions],
      ["Pre-existing Details", data.preExistingConditionsDetails ?? "—"],
      ["Diagnosed Diabetes", data.diagnosedDiabetes],
      ["Diagnosed Thyroid", data.diagnosedThyroid],
      ["Diagnosed Pancreatitis", data.diagnosedPancreatitis],
      ["Medical Conditions Details", data.medicalConditionsDetails ?? "—"],
      ["Family History of Illness", data.familyHistoryIllness],
      ["Family History Details", data.familyHistoryDetails ?? "—"],
      ["Currently Pregnant", data.currentlyPregnant],
      ["Trying to Conceive", data.tryingToConceive],
      ["Currently Breastfeeding", data.currentlyBreastfeeding],
      ["Last Blood/Lab Work", data.lastBloodLabWork],
      ["Last Blood Pressure Date", data.lastBloodPressureDate],
      ["Last Blood Pressure Results", data.lastBloodPressureResults],
      ["COVID Vaccination Status", data.covidVaccinationStatus.replace(/_/g, " ")],
      ["Under Physician Supervision", data.underPhysicianSupervision],
      ["Reason for Visit", data.reasonForVisit],
      ["Services Interested", data.servicesInterested.join(", ")],
      ["How Did You Hear", data.howDidYouHear.replace(/_/g, " ")],
      ["Signature", data.signature],
    ];

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
        <h2 style="margin:0 0 8px">New Patient Intake Registration</h2>
        <p style="margin:0 0 20px;color:#555">Submitted from ${escapeHtml(site.url)}/intake</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:6px 10px;border:1px solid #eee;background:#fafafa;font-weight:600;width:220px;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:6px 10px;border:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
            </tr>`,
            )
            .join("")}
        </table>
      </div>
    `;

    const result = await sendEmail({
      to: notify,
      subject: `New Intake Registration · ${data.fullName}`,
      html,
      replyTo: data.email,
    });

    if (!result.delivered && result.reason === "error") {
      return Response.json(
        { ok: false, message: "Could not submit your form. Please call us directly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Unexpected error." }, { status: 500 });
  }
}
