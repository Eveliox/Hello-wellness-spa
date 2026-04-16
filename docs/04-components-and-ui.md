## 04 — Components & UI architecture

Prev: `./03-content-layer.md`  
Next: `./05-api-routes-and-email.md`

### Folder map

- `src/components/layout/`
  - global site chrome: `header.tsx`, `footer.tsx`, `sticky-book-cta.tsx`, `skip-link.tsx`
- `src/components/home/`
  - homepage sections (each one is a “slice”)
- `src/components/ui/`
  - small reusable primitives: `button.tsx`, `container.tsx`, `section-heading.tsx`, etc.
- `src/components/forms/`
  - form components (contact/newsletter)
- `src/components/services/`
  - service presentation (cards)
- `src/components/quiz/`
  - the quiz UI state machine

### Composition over inheritance

Pages typically look like:

- `Page = <SectionA/> <SectionB/> <SectionC/> ...`

Each section is a component with:

- a wrapper `<section>` + a `<Container>`
- headings/copy
- a few child components

This is the dominant pattern in modern React: build with **small, testable pieces**.

### UI primitives: `Button` and className utilities

`src/components/ui/button.tsx` is an example of a well-factored primitive:

- It supports both `<button>` and `<Link>` modes.
- It exposes `variant` and `size` props.
- It merges Tailwind classes via `cn()` from `src/lib/utils.ts`.

Why `cn()` exists:

- `clsx` handles conditional classes (`clsx(cond && "foo")`)
- `tailwind-merge` resolves conflicting Tailwind classes (`p-2 p-4` → `p-4`)

### Layout components as “policy”

`src/components/layout/header.tsx` is not just UI—it encodes *policy*:

- what the primary navigation is
- what CTAs exist (call, contact, etc.)
- responsive behavior (desktop nav vs mobile drawer)

This matters because layout components are the “highest leverage” for product changes.

### The dynamic service page uses a template-like approach

`src/app/services/[slug]/page.tsx` is effectively a **template**:

- It receives `slug`.
- It loads a record from `src/content/services.ts`.
- It renders a consistent structure for all services.

This is close to how CMS-driven sites work, except the CMS is “checked into git” as TypeScript.

### Client vs server components (important concept)

In Next.js App Router:

- Files are **server components by default**.
- Add `"use client";` at the top to make it a **client component**.

In this repo:

- The quiz and forms are client components (they need state + event handlers):
  - `src/components/quiz/wellness-quiz.tsx`
  - `src/components/forms/contact-form.tsx`
- Most pages and section components can stay server components.

Rule of thumb:

> Keep most of your tree server components, and isolate client state to leaf components when possible.

