## Hello You Wellness — Codebase Guide

This folder is a **learning-oriented reverse engineering guide** for this web app: what it’s built with, how requests flow through it, and how the files connect.

### Start here

- **01 Tech stack & tooling**: `./01-tech-stack.md`
- **02 How routing works (App Router)**: `./02-routing-and-layout.md`
- **03 Data/content layer (the “CMS”)**: `./03-content-layer.md`
- **04 UI/component architecture**: `./04-components-and-ui.md`
- **05 API routes (contact/newsletter/quiz)**: `./05-api-routes-and-email.md`
- **06 Styling system (Tailwind v4 + design tokens)**: `./06-styling.md`
- **07 Exercises (learn by changing things)**: `./07-exercises.md`

### Mental model (one paragraph)

This is a **Next.js App Router** site. URL paths are backed by files in `src/app/`. Pages are mostly “composition”: they render a tree of React components from `src/components/` and pull copy/data from `src/content/`. Shared helpers (SEO metadata, schema.org JSON‑LD, email sending, className utilities) live in `src/lib/`. Static assets are served from `public/`.

