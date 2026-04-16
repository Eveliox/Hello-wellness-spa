## 01 — Tech stack & tooling

Next chapter: `./02-routing-and-layout.md`

### What this app is

- **Type**: marketing site / service menu / lead-capture flows
- **Rendering model**: mostly **static pages** with a few **server routes** (`/api/*`)

### Core stack

- **Framework**: Next.js (App Router)  
  - Dev/build scripts in `package.json`: `next dev`, `next build`, `next start`
- **UI**: React
- **Language**: TypeScript (strict mode) — `tsconfig.json`
- **Styling**: Tailwind CSS v4 via PostCSS — `postcss.config.mjs` + `src/app/globals.css`
- **Forms + validation (client)**:
  - `react-hook-form`
  - `zod` + `@hookform/resolvers`
- **Validation (server)**: `zod` inside API routes
- **Email provider**: Resend (via direct `fetch`) — `src/lib/email.ts`
- **Linting**: ESLint with Next configs — `eslint.config.mjs`

### Conventions used in this repo

#### Absolute imports with `@/`

TypeScript path alias:

- `@/*` maps to `src/*` (see `tsconfig.json`)

So code can import like:

- `import { site } from "@/content/site";`

instead of brittle relative paths (`../../../content/site`).

#### Static assets

- Anything in `public/` is served at the site root.
  - Example: `public/images/branding/logo.jpeg` becomes `"/images/branding/logo.jpeg"`.

#### Next image configuration

`next.config.ts` allows remote images from `images.unsplash.com`, so components can do:

- `<Image src="https://images.unsplash.com/..." />`

without Next.js blocking it.

### How to run locally (Windows PowerShell)

From the project folder that contains `package.json`:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Env vars (email)

There’s an `.env.example` showing what the server routes expect:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_NOTIFICATION_EMAIL`

If these aren’t set, API routes still respond, but email delivery may be skipped (see `src/lib/email.ts`).

