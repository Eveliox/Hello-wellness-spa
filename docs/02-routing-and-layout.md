## 02 — Routing & layout (Next.js App Router)

Prev: `./01-tech-stack.md`  
Next: `./03-content-layer.md`

### The golden rule

In the App Router, **folders and files under `src/app/` define URLs**.

Examples in this repo:

- `src/app/page.tsx` → `/`
- `src/app/about/page.tsx` → `/about`
- `src/app/services/page.tsx` → `/services`
- `src/app/services/[slug]/page.tsx` → `/services/<slug>` (dynamic route)
- `src/app/api/contact/route.ts` → `/api/contact` (server endpoint)

### Layout: the global “frame” for all pages

`src/app/layout.tsx` is the root layout. It wraps every page with shared UI:

- header
- footer
- sticky mobile CTA
- global JSON‑LD (schema.org)
- global fonts + CSS

Key imports you’ll see there:

- `import "./globals.css";` (global styles)
- `import { Header } from "@/components/layout/header";`
- `import { Footer } from "@/components/layout/footer";`
- `import { StickyBookCta } from "@/components/layout/sticky-book-cta";`
- `import { JsonLd } from "@/components/json-ld";`
- `import { createMetadata } from "@/lib/seo";`

### Metadata (SEO) pattern

Each page exports metadata via a helper:

- `createMetadata(...)` in `src/lib/seo.ts`

This ensures consistent:

- canonical URLs
- Open Graph fields
- Twitter card fields

For example, a page file does:

- `export const metadata = createMetadata({ title, description, path })`

and Next.js turns that into `<title>`, `<meta>`, OG tags, etc.

### Static vs dynamic pages

Most pages here are simple React components that render HTML and are **pre-rendered**.

The dynamic service page (`/services/[slug]`) uses:

- `generateStaticParams()` to prebuild known slugs from `src/content/services.ts`
- `generateMetadata()` to produce per-service OG tags, etc.

So “dynamic route” doesn’t necessarily mean “server-rendered on every request” — it can still be static.

### How `/services/[slug]` works (data-driven pages)

The route file:

- reads the URL param `slug`
- looks up the matching service in `src/content/services.ts`
- renders a reusable detail template

That’s a common pattern:

> **URL param → content lookup → template component**

It keeps all copy/content in one place and avoids duplicating page code for each service.

### The homepage is composition

`src/app/page.tsx` doesn’t do much logic. It “stacks” sections:

- `HeroSection`
- `FeaturedServices`
- `FaqPreview`
- `MapEmbed`
- etc.

This is a typical “marketing site” pattern: the page is a **layout of sections**, not a big logic file.

