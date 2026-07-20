import Script from "next/script";

/**
 * Google Tag Manager loader + Consent Mode v2 default-denied bootstrap.
 *
 * Load order (enforced by placing scripts in this order in the root layout):
 *   1. `ConsentDefault` — sets all consent categories to "denied" and
 *      configures Consent Mode v2 defaults BEFORE any GTM/GA code runs.
 *   2. `CookiebotScript` — loads Cookiebot when NEXT_PUBLIC_COOKIEBOT_CBID is
 *      set. Cookiebot renders the banner and calls `gtag('consent','update')`
 *      when the visitor accepts. Auto-blocks non-essential tags until then.
 *   3. `GtmScript` — injects the standard GTM snippet with the container ID
 *      pulled from `NEXT_PUBLIC_GTM_ID`. Renders nothing if the ID is unset.
 *   4. `GtmNoscript` — <iframe> fallback for JS-disabled visitors (goes at
 *      the top of <body>).
 *
 * Cookiebot signup: https://www.cookiebot.com/ → create a domain group → copy
 * the CBID (UUID) into NEXT_PUBLIC_COOKIEBOT_CBID. Free tier covers small
 * sites (<100 subpages, <5k visits/mo).
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const COOKIEBOT_CBID = process.env.NEXT_PUBLIC_COOKIEBOT_CBID;

/**
 * Consent Mode v2 default-denied. Must load before GTM.
 * The `wait_for_update` gives the CMP a 500ms window to respond before GTM
 * decides consent state — prevents a flash of denied-then-granted.
 */
export function ConsentDefault() {
  if (!GTM_ID) return null;
  return (
    <Script id="consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500
        });
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
      `}
    </Script>
  );
}

/**
 * Cookiebot CMP loader. Must render AFTER ConsentDefault and BEFORE GtmScript
 * so it can intercept and update consent state before GTM tags evaluate.
 *
 * The `data-blockingmode="auto"` attribute enables Cookiebot's automatic
 * script blocking — any tag with a consent category attribute is blocked
 * until the visitor accepts.
 *
 * `strategy="beforeInteractive"` matches Cookiebot's own documented setup so
 * the banner renders before third-party scripts fire.
 */
export function CookiebotScript() {
  if (!COOKIEBOT_CBID) return null;
  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={COOKIEBOT_CBID}
      data-blockingmode="auto"
      strategy="beforeInteractive"
    />
  );
}

/**
 * Standard GTM container loader. `afterInteractive` is the recommended
 * strategy for tag managers per Next docs — loads early but doesn't block
 * hydration.
 */
export function GtmScript() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  );
}

/**
 * <iframe> fallback for no-JS environments. Renders as the first element of
 * <body>. Empty when GTM_ID is unset.
 */
export function GtmNoscript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
