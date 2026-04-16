## 03 — The content layer (your “CMS”)

Prev: `./02-routing-and-layout.md`  
Next: `./04-components-and-ui.md`

### Why this exists

Instead of hardcoding lots of text inside components, this repo puts most **copy + structured data** into `src/content/`.

That makes content:

- reusable across pages
- easy to update in one place
- easy to drive dynamic routes (like `/services/[slug]`)

### The important files

- `src/content/site.ts`
  - “business facts”: name, phone, address, social links, hours
  - used by header/footer, SEO, schema.org JSON‑LD, contact info blocks
- `src/content/services.ts`
  - array of service records
  - drives:
    - the services grid (`/services`)
    - service detail pages (`/services/[slug]`)
    - dynamic metadata/OG images
- `src/content/faqs.ts`
  - FAQ entries
  - used by `/faq` and service pages (subset by ID)
- `src/content/testimonials.ts`
  - testimonials for `/testimonials` and per-service slices
- `src/content/navigation.ts`
  - nav links + footer link groups
- `src/content/quiz.ts`
  - quiz steps + the recommendation algorithm

### How services connect to pages

`src/content/services.ts` exports:

- `services: ServiceContent[]`
- `getService(slug)`

The dynamic page `src/app/services/[slug]/page.tsx`:

- calls `getService(slug)`
- if missing → `notFound()`
- if found → renders the detail template using fields like:
  - `title`, `summary`, `benefits`, `idealFor`, `faqIds`, `heroImage`

This is “data-driven UI”: the page is mostly generic, and each service is just a record.

### How the quiz works (high level)

The quiz content file (`src/content/quiz.ts`) defines:

- `quizSteps`: questions + options
- each option has `weights` that add points to one or more services
- `recommendService(weights)`: picks the highest-scoring service, with a deterministic fallback order

The UI (`src/components/quiz/wellness-quiz.tsx`) does:

1. maintain `answers`
2. convert answers → `weights` (sum points)
3. at the end: call `recommendService(weights)`
4. show the recommended service and link to `/services/<slug>`

Key idea:

> The quiz UI is dumb; the scoring logic lives in `src/content/quiz.ts`.

That’s good design: you can change the algorithm without rewriting UI code.

### Tip: changing “business facts” safely

Update things like phone/social once:

- `src/content/site.ts`

Because many parts of the UI and SEO reference `site.*`, you avoid “stale duplicates.”

