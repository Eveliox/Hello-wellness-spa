/**
 * Server-side bot heuristics for public form submissions.
 *
 * Each check returns a short reason string when it fires — used only for
 * server-side logging (never exposed to the client, so bots can't fingerprint
 * which rule blocked them and iterate around it).
 *
 * Rules are ordered cheapest-first. Any single trip is enough to reject.
 */

const MIN_FILL_TIME_MS = 3_000;

/** Simple check: does this string have at least one vowel? */
function hasVowel(s: string): boolean {
  return /[aeiouy]/i.test(s);
}

/**
 * Detects the "gibberish string" bots emit for free-text fields when they
 * don't know what to write — clusters of consonants with no vowels are the
 * strongest tell. Real names, sentences, and even most product names contain
 * at least one vowel.
 */
function looksLikeGibberish(s: string, minLength: number): boolean {
  const trimmed = s.trim();
  return trimmed.length >= minLength && !hasVowel(trimmed);
}

type IntakeLike = {
  registrationDate?: string;
  dateOfBirth?: string;
  fullName?: string;
  email?: string;
  employer?: string;
  reasonForVisit?: string;
  signature?: string;
  servicesInterested?: string[];
  honeypot?: string;
  formLoadedAt?: number;
};

export type BotCheckResult =
  | { bot: false }
  | { bot: true; reason: string };

/**
 * Runs a battery of cheap heuristic checks against the parsed intake payload.
 * Returns a positive `bot` verdict as soon as one trips. The `reason` string
 * is server-log-only — never surface it to the client.
 */
export function looksLikeBot(data: IntakeLike): BotCheckResult {
  // 1. Honeypot — invisible field. Any non-empty value is a bot.
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { bot: true, reason: "honeypot_filled" };
  }

  // 2. Time-to-fill — humans need more than 3 seconds. Missing timestamp
  //    also flags (real form always sets it on mount).
  if (typeof data.formLoadedAt === "number") {
    const elapsed = Date.now() - data.formLoadedAt;
    if (elapsed < MIN_FILL_TIME_MS) {
      return { bot: true, reason: `submitted_too_fast_${elapsed}ms` };
    }
  } else {
    return { bot: true, reason: "missing_form_timestamp" };
  }

  // 3. DOB === registration date. Real users almost never share a birthday
  //    with the calendar day they're filling the form. Bots default both to
  //    the same value (often 1970-01-01 or 1970-05-31, the Unix epoch).
  if (
    data.dateOfBirth &&
    data.registrationDate &&
    data.dateOfBirth === data.registrationDate
  ) {
    return { bot: true, reason: "dob_equals_registration_date" };
  }

  // 4. DOB in the 1970-01-01 to 1970-12-31 range with default-looking values
  //    (bots emitting Unix epoch defaults). Kept narrow to avoid blocking real
  //    users born in 1970 who legitimately entered their real DOB — those
  //    would also have plausible other fields, but this catches the pure-default
  //    epoch signature.
  if (data.dateOfBirth === "1970-01-01") {
    return { bot: true, reason: "dob_unix_epoch" };
  }

  // 5. Free-text fields with zero vowels — classic bot gibberish signature.
  if (data.fullName && looksLikeGibberish(data.fullName, 4)) {
    return { bot: true, reason: "fullname_no_vowels" };
  }
  if (data.reasonForVisit && looksLikeGibberish(data.reasonForVisit, 5)) {
    return { bot: true, reason: "reason_no_vowels" };
  }
  if (data.signature && looksLikeGibberish(data.signature, 4)) {
    return { bot: true, reason: "signature_no_vowels" };
  }
  if (data.employer && looksLikeGibberish(data.employer, 6)) {
    return { bot: true, reason: "employer_no_vowels" };
  }

  // 6. Absurd service interest count — real patients pick 1–3 services.
  //    7+ ticked = the bot mashed every checkbox.
  if (data.servicesInterested && data.servicesInterested.length >= 7) {
    return { bot: true, reason: `service_flood_${data.servicesInterested.length}` };
  }

  // 7. Gmail dot-stuffing beyond a reasonable threshold. Real emails don't
  //    have 5+ dots in the local part; bots use them to route many "unique"
  //    addresses to a single inbox. Only checks gmail/googlemail addresses.
  if (data.email) {
    const [local, domain] = data.email.toLowerCase().split("@");
    if (
      local &&
      domain &&
      (domain === "gmail.com" || domain === "googlemail.com") &&
      (local.match(/\./g) ?? []).length >= 5
    ) {
      return { bot: true, reason: "gmail_dot_stuffing" };
    }
  }

  return { bot: false };
}
