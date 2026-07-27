/**
 * Clinical leadership details displayed on program pages.
 *
 * ⚠️ REPLACE THESE PLACEHOLDER VALUES with real credentials before shipping
 * to production. Trust-differentiator on program pages depends on this being
 * accurate — do not fabricate a physician credential you don't have.
 *
 * Verify a Florida license at https://mqa-internet.doh.state.fl.us/MQASearchServices/
 * and paste the profile URL into `verifyUrl`.
 *
 * Honesty guidance: if programs are directed by an APRN rather than an MD/DO,
 * say so plainly (`credential: "APRN, DNP"`). Sofia-audience buyers respect
 * honest credentialing more than inflated titles.
 */

export type ClinicianSignature = {
  /** Full name as it appears on the state license. */
  name: string;
  /** Credential line, e.g. "MD · Board-certified Family Medicine" or "APRN, DNP". */
  credential: string;
  /** Role/title within the practice. */
  role: string;
  /** State + license number for on-page display. */
  license: string;
  /**
   * Optional public license-verification URL. Florida DOH pattern:
   * https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders?LicNbr=<num>
   */
  verifyUrl?: string;
};

export const medicalDirector: ClinicianSignature = {
  name: "TODO — Medical Director name",
  credential: "TODO — MD or APRN + specialty/board",
  role: "Medical Director",
  license: "FL License #TODO",
  verifyUrl: undefined,
};
