# Analytics implementation notes

This site ships a measurement layer wired to Google Tag Manager + GA4 with
Consent Mode v2 defaulting to fully-denied. The code lives in:

- `src/components/analytics/gtm.tsx` — GTM loader + Consent Mode default
- `src/components/analytics/booking-confirmed-pixel.tsx` — /intake?booked=1 safety-net event
- `src/components/analytics/tracked-cta-link.tsx` — client wrapper for tracked links from server components
- `src/lib/analytics.ts` — `trackEvent` helper + LTV bucket lookup
- `src/app/layout.tsx` — script mount points (head + body noscript)

## Environment variables

Set these in production. When unset, analytics scripts render nothing (safe
default for local dev, previews, and staging).

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Meta / Facebook Pixel is phase 2 (`NEXT_PUBLIC_FB_PIXEL_ID` reserved in
`.env.example`, wired when paid social launches).

## Events fired by the app

| Event | Trigger | Params |
|---|---|---|
| `click_to_call` | Any `tel:` link | `link_location` |
| `click_whatsapp` | WhatsApp FAB | `link_location` |
| `book_click` | Any pre-Cal booking CTA | `booking_service`, `cta_location` |
| `book_appointment` | Cal `bookingSuccessfulV2` (before redirect) | `booking_service`, `event_type_slug` |
| `book_appointment_confirmed` | `/intake?booked=1` mount (safety net) | `booking_service` |
| `intake_start` | First focus on intake form | `intake_type`, `has_booking` |
| `generate_lead` | Intake submit success | `intake_type`, `service`, `has_booking`, `value`, `currency` |

Purchase is server-side only — see the `TODO(analytics)` in
`src/app/api/checkout/route.ts`.

### Dedup: `book_appointment` vs `book_appointment_confirmed`

Both fire for a successful booking under normal conditions. The confirmed
variant is a safety net for races where the Cal iframe callback loses to the
redirect. In GTM, configure a variable on session-scoped `booking_service +
minute-bucket` and use it as a blocking trigger exception so only ONE of the
two forwards to Google Ads as a conversion. GA4 can keep both for funnel analysis.

## Consent Mode v2

`ConsentDefault` in the root layout sets every category (ad_storage,
ad_user_data, ad_personalization, analytics_storage, functionality_storage,
personalization_storage) to `denied` with a 500ms `wait_for_update` window.
`security_storage` is granted (needed for CSRF/session safety).

**Until a real CMP is installed, all users remain in default-denied.** Events
still land in the dataLayer, but GTM's built-in Consent Mode gating stops
downstream tags (GA4 config, Ads pixel) from actually firing. No conversion
data will accumulate in Google Ads / GA4 reports until:

1. A CMP is installed (Cookiebot, Osano, Iubenda, or a hand-rolled banner)
2. That CMP calls `gtag('consent', 'update', {...: 'granted'})` when the user
   accepts

This is the correct, compliant default posture — do not "fix" it by removing
the default-denied block.

## GA4 admin panel setup (user-side, not in code)

These are one-time settings the account owner needs to configure inside GA4
and Google Ads. Nothing in this repo can do them for you.

### 1. Cross-domain measurement
The Cal.com iframe (`cal.com`) and the follow-up patient-portal
(`helloyouwellness.clientsecure.me`) are separate origins. Without cross-domain
config, GA4 treats a booking as two separate sessions and inflates the user
count.

- GA4 → Admin → Data Streams → (web stream) → Configure tag settings →
  Configure your domains → add:
  - `helloyouwellness.com` (or whatever the production domain is)
  - `cal.com`
  - `helloyouwellness.clientsecure.me`

### 2. Google Ads conversion actions
Configure primary vs secondary conversion actions:

- **Primary (bidding-optimized):** `book_appointment` (or the deduped variant)
- **Primary:** `generate_lead` with `intake_type = glp1` (highest LTV)
- **Secondary (observation):** `generate_lead` non-GLP1, `click_to_call`,
  `book_click`

Enable **Enhanced Conversions for Web** on all primary actions. The
`generate_lead` event carries no PII today (deliberate PHI safety), so
Enhanced Conversions won't have hashed email/phone to match on for those
events. If a decision is made later to allow hashed email on the confirmation
page (post-submit, non-PHI context), revisit the PHI guardrail in
`src/lib/analytics.ts` first.

### 3. Google Business Profile UTM
GBP website field should be UTM-tagged so organic-map traffic is
distinguishable from other organic:

```
https://helloyouwellness.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp
```

Update this inside the Google Business Profile dashboard, not in the codebase.

## HIPAA / PHI note

The intake forms collect PHI. Under HHS OCR guidance on tracking technologies,
third-party pixels on PHI-collecting pages are a compliance concern. The
events pushed by this codebase deliberately do NOT include patient-entered
field values (name, DOB, condition details, medications, etc.) — only
field-independent signals like `intake_type`, `service` (bucket), and
`has_booking`. See the guardrail comment in `src/lib/analytics.ts` before
adding anything new.

## Follow-ups

- [ ] Install a CMP (Cookiebot / Osano / Iubenda) — required before paid launch
- [ ] Create GTM container, add GA4 config tag, add Google Ads conversion tags
- [ ] Set `NEXT_PUBLIC_GTM_ID` + `NEXT_PUBLIC_GA_ID` in Vercel/hosting env
- [ ] Configure cross-domain measurement in GA4 admin
- [ ] Set up Enhanced Conversions on primary Google Ads conversion actions
- [ ] Tag the Google Business Profile website URL with UTM params
- [ ] Add `/api/stripe/webhook` route + implement GA4 Measurement Protocol
      `purchase` forwarder (see `TODO(analytics)` in
      `src/app/api/checkout/route.ts`)
- [ ] Phase 2: wire Meta Pixel + Conversions API when paid social launches
