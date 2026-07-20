import { randomBytes } from "node:crypto";

const CODE_PREFIX = "PARTNER";
const SLUG_MAX_LEN = 12;
const RANDOM_HEX_LEN = 4;

function slugifyBusinessName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, SLUG_MAX_LEN);
  return cleaned || "PARTNER";
}

export function generatePartnerReferralCode(businessName: string): string {
  const slug = slugifyBusinessName(businessName);
  const suffix = randomBytes(RANDOM_HEX_LEN).toString("hex").toUpperCase();
  return `${CODE_PREFIX}-${slug}-${suffix}`;
}

const CODE_REGEX = /^PARTNER-[A-Z0-9]{1,12}-[A-F0-9]{8}$/;

export function isValidReferralCodeShape(candidate: string): boolean {
  return CODE_REGEX.test(candidate);
}

export function normalizeReferralCodeInput(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
