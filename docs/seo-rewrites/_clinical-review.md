# Clinical Evidence Review — 2026-07 draft batch

**Reviewer:** Clinical Evidence Agent
**Date:** 2026-07-13
**Files reviewed:** 8 in `docs/seo-rewrites/`

## Summary
- Drafts reviewed: 8
- High-severity corrections: 14
- Medium-severity: 22
- Low-severity: 17
- **Blocking safety issues (must fix before publish): 6**
  1. `peptide-therapy.md` — sermorelin FDA/Geref history is misstated (manufacturer withdrawal, not "discontinued 2008" as neutral event)
  2. `peptide-therapy.md` — CJC-1295/ipamorelin and BPC-157 are on FDA 503A Interim Bulks List **Category 2 (rejected)** as of 2023; "compounded, off-label" framing understates regulatory exposure
  3. `iv-therapy.md` and `build-your-own-iv.md` — G6PD screening threshold ">25 g" is above what most protocols use (typical is ≥15 g)
  4. `hormone-therapy.md` — no mention that **no FDA-approved testosterone product exists for women in the U.S.** — required informed-consent content
  5. `assisted-weight-loss.md` and `.es.md` — pregnancy discontinuation window applies to semaglutide only; tirzepatide has different labeling; **tirzepatide reduces oral contraceptive efficacy** — barrier method counseling missing
  6. `aesthetics-cosmetics.md` and `.es.md` — **no vascular occlusion warning for HA fillers**. Single highest-severity omission in the batch

## Cross-cutting patterns
1. **"Research suggests" hedging over-applied** for BPC-157, TB-500, GHK-Cu injectable, thymosin alpha-1 — most published research is preclinical/animal. Should be "preclinical research suggests" for defensibility.
2. **G6PD screening threshold inconsistent** across IV pages (>25 g). Align to ≥15 g or cap high-dose vitamin C at 25 g.
3. **Vascular occlusion / hyaluronidase reversal / vision loss risk** absent from both EN and ES aesthetics pages. Most consequential omission.
4. **503A compounding framing** across weight-loss, peptide, hormone pages understates 2023–2025 volatility (sema/tirz off shortage list; BPC-157/ipamorelin on Category 2; thymosin alpha-1 excluded).
5. **Pregnancy/breastfeeding exclusions inconsistent** across pages — recommend shared template.
6. **Off-label disclosure inconsistent** — tear-trough filler, gluteal biostimulation not labeled off-label; peptides are; women's TRT is off-label but missing "no FDA-approved women's product" fact.
7. **Marketing shorthand survivors:** "Immune IV" as blend name; "Beauty/Glow Build."
8. **Consumer-facing informed-consent language missing** on aesthetics, IV, custom IV, peptide pages (weight-loss + hormone pages do this well).
9. **No citation/reference appendix** — even 5–8 numbered references per page materially strengthens defensibility.

## Provider-review workflow split

### Can be applied purely on published-evidence grounds (no clinic sign-off required)
- STEP 1 / SURMOUNT-1 citation additions
- Tirzepatide oral contraceptive warning
- Semaglutide vs tirzepatide pregnancy discontinuation split
- Off-label disclosure for tear-trough filler + gluteal biostimulator
- Vascular occlusion / hyaluronidase warning on aesthetics pages (both languages)
- Cow's milk protein allergy specification for Dysport (replacing "gram-positive bacterial proteins")
- "Preclinical" qualifier on BPC-157, TB-500, GHK-Cu injectable, thymosin alpha-1
- Geref withdrawal factual correction on sermorelin
- Priapism disclosure for PT-141 off-label male use
- PT-141 melanocyte hyperpigmentation disclosure
- "No FDA-approved women's testosterone product" statement on hormone page
- Fertility-preservation disclosure for TRT
- Transdermal testosterone transference boxed-warning language strengthening
- WHI breast cancer risk framing on hormone page (symmetric to correctly-avoided prevention claims)
- Air embolism / thrombophlebitis / extravasation / infection risk consent on IV pages
- References/citations appendix at bottom of each page

### Requires clinic physician sign-off before publish
- G6PD screening threshold (≥15 g vs >25 g) — protocol decision
- BPC-157 and ipamorelin availability given FDA 503A Category 2 posture — clinical + legal joint
- Compounded semaglutide/tirzepatide availability in post-shortage environment — clinical + legal joint
- Whether clinic screens for cow's milk protein allergy before Dysport
- Whether clinic keeps hyaluronidase on-site (implied by recommended consent language)
- Whether all three TRT delivery methods (injection, pellet, gel) are offered
- Whether clinic offers women's off-label testosterone
- Whether anti-nausea IV add-on is per-visit prescription workflow
- Whether clinic caps high-dose vitamin C at any specific dose
- Exact Myers' Cocktail dosing the clinic uses
- All peptide catalog availability given current FDA posture — every named peptide requires physician + legal joint sign-off
- Monitoring cadence for TRT and HRT — align to clinic protocol, not just guideline
- "No lying flat 4hr" post-Botox — folklore convention decision

## Per-file corrections
Full per-file line-referenced corrections are in the parent conversation scrollback (Clinical Evidence Agent response). Key files:
- `assisted-weight-loss.md` — 5 corrections + 6 missing items (see: tirzepatide OCP warning, retinopathy, ileus, off-ramp regain)
- `aesthetics-cosmetics.md` — 7 corrections + 7 missing (vascular occlusion is #1)
- `iv-therapy.md` — 6 corrections + 6 missing (IV placement risk consent)
- `build-your-own-iv.md` — 5 corrections + 5 missing
- `peptide-therapy.md` — 8 corrections + 8 missing (regulatory posture strengthening throughout)
- `hormone-therapy.md` — 5 corrections + 8 missing (VTE, breast cancer risk, TRAVERSE reassurance)
- Spanish versions — inherit all EN issues plus tear-trough and BBL off-label add for `.es.md`

## Files referenced
All in `docs/seo-rewrites/`
