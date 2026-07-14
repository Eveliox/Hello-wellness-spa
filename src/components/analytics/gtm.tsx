import Script from "next/script";

/**
 * Google Tag Manager loader + Consent Mode v2 default-denied bootstrap.
 *
 * Load order (this order is enforced by placing the consent script first in
 * the DOM with `beforeInteractive` — both must sit in the root layout):
 *   1. `ConsentDefault` — sets all consent categories to "denied" and
 *      configures Consent Mode v2 defaults BEFORE any GTM/GA code runs.
 *   2. `GtmScript` — injects the standard GTM snippet with the container ID
 *      pulled from `NEXT_PUBLIC_GTM_ID`. Renders nothing if the ID is unset,
 *      so local/preview builds don't ship a broken tag.
 *   3. `GtmNoscript` — <iframe> fallback for JS-disabled visitors (goes at
 *      the top of <body>). Same env guard as GtmScript.
 *
 * === Follow-up required BEFORE paid campaign launch ===
 * A real Consent Management Platform (Cookiebot, Osano, Iubenda, etc.) MUST
 * be integrated to call `gtag('consent', 'update', {...})` when the user
 * grants consent. Until that CMP ships, ALL users remain in default-denied
 * state — meaning downstream GA4 / Ads tags never fire and conversion data
 * will not accumulate. This is intentional and the compliant default.
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
