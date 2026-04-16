## 06 — Styling system (Tailwind v4 + design tokens)

Prev: `./05-api-routes-and-email.md`  
Next: `./07-exercises.md`

### Where styles come from

- Tailwind is enabled via PostCSS: `postcss.config.mjs`
- Global design tokens and utility tweaks are in:
  - `src/app/globals.css`

### The design token approach

In `globals.css`, `:root` defines CSS variables like:

- `--canvas`, `--surface`, `--ink`, `--muted`, `--line`, etc.

Then `@theme inline` maps them into Tailwind-friendly names like:

- `--color-canvas`
- `--color-surface`
- `--color-ink`

That’s why you see classes like:

- `bg-canvas`
- `text-ink`
- `border-line`

Those aren’t “default Tailwind colors”—they are **project tokens**.

### Why this is a good pattern

- You can change the entire look by editing a small palette in one file.
- You avoid scattering hex values across components.
- It reads like a design system:
  - “ink” (primary text)
  - “surface” (cards)
  - “chrome” (header/footer)

### How layout spacing is handled

This codebase uses:

- Tailwind spacing classes (`py-16`, `mt-6`, `gap-10`, etc.)
- reusable primitives such as:
  - `Container` (`src/components/ui/container.tsx`)
  - `SectionHeading` (`src/components/ui/section-heading.tsx`)

The goal is consistency: every section uses similar padding, max widths, and typography rhythm.

### Animations and accessibility

`globals.css` defines `.animate-rise` and also respects:

- `prefers-reduced-motion`

So motion is disabled for users who request it—this is a best practice.

### Class composition helper (`cn`)

When a component needs conditional classNames, it uses:

- `cn()` from `src/lib/utils.ts`

This avoids bugs like:

- duplicated Tailwind classes
- conflicting variants

