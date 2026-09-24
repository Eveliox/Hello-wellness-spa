# Hello You: simpler website blueprint

## Goal
Help a first-time visitor answer three questions quickly: What can you help me with? What does it cost? How do I book?

This is a source-code audit, not a live-site usability study. Treat improved conversion as a hypothesis to measure, not a promise.

## What is creating overload
- Eleven homepage sections, including competing packages and membership promotions.
- Seven top-level navigation choices and fourteen dropdown links; the mobile menu expands all of them.
- Autoplay video, a moving services marquee, reveal animations, and a large decorative intake-phone mockup.
- Booking, calling, quiz, and WhatsApp controls competing around the edges of the screen.
- Prices described as monthly plans on one page and fixed-duration packages on another without enough explanation of the distinction.

## Implementation brief / reusable prompt
> Simplify Hello You Wellness without removing its offerings. Preserve the existing Next.js architecture, business facts, pricing source of truth, booking/intake/checkout integrations, medical screening requirements, and route URLs. Read the installed Next.js guides first.
>
> Use four flat primary links: Services, Packages & Pricing, About, Contact. Keep a consistent booking action in the sticky header and make pricing directly accessible on mobile. Use a keyboard-accessible, scrollable mobile disclosure with Escape support rather than a giant dropdown tree. Preserve the existing peptide-page separation from general-care promotion.
>
> Rebuild the homepage as six calm sections: clear hero, three introductory service cards, a compact weight-loss pricing invitation, three steps explaining care, three practical FAQs, and a visit/help section. Put deeper services, programs, memberships, and quiz choices on their dedicated pages and in the footer. Keep pricing visible near the top through header and hero links. Use static imagery, concise headings, generous spacing, and one dominant action per section. Avoid autoplay, moving strips, decorative mockups, sale badges, and repeated upsell sections.
>
> Replace floating contact controls with one persistent header action. Keep phone and WhatsApp available in the footer. Keep consent controls untouched. Do not alter clinical protocols, make new medical or outcome claims, change prices, delete routes, or touch unrelated projects. Verify navigation, responsive layout, keyboard behavior, lint, types, and build where available. Report any checks that could not be completed.

## First-pass scope
- Shared header and footer: fewer choices, no hover-dependent dropdowns, smaller footer link groups, no newsletter pitch.
- Homepage: six sections instead of eleven; no autoplay/video download, marquee, reveal wrapper, membership upsell, large trust/testimonial grids, or map embed. Business location and provider-review information remain visible; reviews and team information remain reachable.
- Pricing preview: one clearly labeled fixed-duration weight-loss package invitation with a price derived from `src/content/packages.ts`; full comparison stays on `/programs/packages`.
- Services overview: plain-language introduction, include screening in the service directory, and links to programs/memberships/quiz so secondary offerings remain discoverable.
- No changes to payment links, Cal.com, Practice Better, package contents, existing redirects, consent scripts, or backend logic.

## Recommendations after this pass
1. **Clarify prices before redesigning checkout.** Have the clinic confirm what the fixed-duration packages include versus monthly GLP-1 plans: medication, labs, visits, follow-ups, eligibility, refund terms, and any additional costs. Do not imply everything is included until verified.
2. **Review the canonical domain.** `src/content/site.ts` defaults to `https://xlashbyyane.com`, while the owner shares `https://helloyouwellness.com`. Verify `NEXT_PUBLIC_SITE_URL`, canonical tags, sitemap, and production domain redirects before changing the fallback.
3. **Use real team/clinic photography.** Prefer recognizable staff and premises over generic imagery. Verify provider credentials and review provenance before publishing claims or testimonials.
4. **Simplify detail pages next.** Standard order: who it is for, what is included, price, eligibility/safety, FAQs, next step. Do not hide safety information to shorten the page.
5. **Validate with five first-time visitors.** Ask each to find weight-loss pricing, IV therapy, and booking on a phone without guidance. Target pricing in one tap and no dead ends. Record task success and confusion, not sensitive medical information.
6. **Measure the change.** Compare mobile package-page visits, booking completions, and task completion before/after. Existing booking analytics are retained; any new analytics must respect consent and avoid patient data. Do not optimize solely for scroll depth.
7. **Keep the restraint.** Add a new homepage block only if it replaces something or solves an observed task failure. Avoid restoring several simultaneous sales banners.

## Acceptance checklist
- Pricing is reachable from both desktop and mobile headers and the hero.
- All existing URLs still work; secondary offerings remain linked via services/footer.
- No overlapping floating CTA stack or autoplay media on the homepage.
- Mobile navigation closes on selection, Escape, outside interaction, and route changes; focus returns to its toggle on Escape.
- Check 320, 390, 768, 1024, and 1440px widths, keyboard-only navigation, and reduced motion.
- Check homepage, services, packages, weight-loss service/program, booking, intake, and peptide routes.
- Lint/type/build checks; browser checks where tooling is available. Do not claim a live deployment until one occurs.

## Verification completed for this pass
- ESLint passed on all changed TypeScript/TSX files.
- `tsc --noEmit` and `npm run build` passed. Stale generated `.next/dev/types` files from previously deleted API routes were removed before verification; no source routes were deleted.
- Headless Chrome against the production build: homepage at 320, 390, 768, 1024, and 1440px; exactly six main sections, one H1, loaded hero image, no video, visible pricing link, and no horizontal document overflow.
- Mobile menu: keyboard open, Tab to first link, Escape with focus return, selection closes it, browser back keeps it closed, and outside click dismisses it. Reduced-motion preference enabled during checks.
- Main services, packages, assisted weight loss, weight-management program, booking, intake, and peptide routes returned HTTP 200 and rendered a heading. `/pricing` and `/packages` resolved to `/programs/packages`.
- No page-level JavaScript errors in the smoke checks. Desktop and phone screenshots inspected.
- External analytics, scheduling, and payment requests were blocked during the browser checks. No forms submitted, bookings made, or payment flows exercised. This is not a full accessibility audit or a user study.
- Changes are local until committed and deployed. Unrelated `helloyoulabs/` remains untouched.
