## 07 — Exercises (learn by changing things)

Prev: `./06-styling.md`

These are small, safe tasks that teach real software engineering skills using this codebase.

### Exercise A — Add a new service end-to-end

Goal: understand **data-driven pages + dynamic routing**.

1. Add a new record to `src/content/services.ts`
   - choose a new `slug` (must be unique)
   - fill `title`, `summary`, `benefits`, etc.
2. Run `npm run dev`
3. Visit:
   - `/services` (it should appear in the grid)
   - `/services/<your-slug>` (it should render a full detail page)

What you learned:

- how `generateStaticParams()` builds dynamic routes
- how “content = data” feeds pages

### Exercise B — Change the quiz recommendation behavior

Goal: learn separation of concerns between **algorithm** and **UI**.

1. Edit weights in `src/content/quiz.ts`
2. Confirm the UI still works without changes

Stretch:

- add a new quiz question step and update the UI to support it

### Exercise C — Add a new button variant

Goal: learn reusable component design.

1. Edit `src/components/ui/button.tsx`
2. Add a new variant in the `variants` object
3. Use it on a page (e.g., `src/app/contact/page.tsx`)

What you learned:

- how design system primitives reduce duplicated CSS

### Exercise D — Trace a form submission end-to-end

Goal: understand client/server boundaries.

Contact form flow:

1. UI: `src/components/forms/contact-form.tsx`
2. Network request: `POST /api/contact`
3. Server route: `src/app/api/contact/route.ts`
4. Email helper: `src/lib/email.ts`

Try:

- deliberately break validation to see error messages
- add a new field (e.g., “preferred contact method”) and wire it through

### Exercise E — Add a new social icon to the footer

Goal: learn config-driven UI + SVG icon use.

1. Add the URL in `src/content/site.ts` under `social`
2. Update `src/components/layout/footer.tsx` to render another icon

### What to do next (learning roadmap)

If you want to go from “I can edit this” to “I can build apps”:

- Learn HTML/CSS fundamentals (layout, flex/grid, accessibility)
- Learn modern JavaScript (modules, async/await, fetch)
- Learn React (state, props, component composition)
- Learn TypeScript (types as documentation + safety)
- Learn Next.js App Router (routing, server/client components, API routes)

You now have a real project to practice on—keep changes small, run the dev server often, and commit working checkpoints.

