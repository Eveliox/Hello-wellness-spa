# Backend Guide — Hello You Wellness

Everything you need to know to read, modify, and extend the backend of this project. Tailored to **this codebase**, not generic Next.js.

---

## 1. What "backend" means here

This is a **Next.js full-stack app**. There is no separate backend server, no Express, no Django. The same project that renders the marketing pages also handles form submissions, Stripe checkout, admin auth, and database writes.

When you deploy to Vercel:
- Static pages → CDN.
- Server code (everything below) → serverless Node.js functions (one cold-start per route).

"Backend" in this repo = **any file that runs on the server, never in the user's browser**.

### How to tell if a file is backend

| Signal | Meaning |
|---|---|
| Lives in `src/app/api/**/route.ts` | Backend — HTTP endpoint |
| Has `"use client"` at top | **Frontend** — runs in the browser |
| Imports `next/headers`, `cookies()`, `redirect()` | Backend (Server Component or route handler) |
| Imports `process.env.SECRET_KEY` (without `NEXT_PUBLIC_` prefix) | Backend — would leak secrets if used client-side |
| Default export is `async function PageName()` and no `"use client"` | **Server Component** — runs on the server, sends HTML to the client |
| Lives in `src/components/**` and starts with `"use client"` | Frontend |
| Lives in `src/lib/**` with no `"use client"` and no `"use server"` | Shared — runs wherever it's imported (so be careful: don't put secrets here if a client imports it) |

---

## 2. Map of every backend file in this repo

### HTTP endpoints (`src/app/api/`)

| Path | URL | What it does |
|---|---|---|
| [api/checkout/route.ts](src/app/api/checkout/route.ts) | `POST /api/checkout` | Creates a Stripe Checkout session, fires Supabase insert for GLP-1 intake |
| [api/intake/route.ts](src/app/api/intake/route.ts) | `POST /api/intake` | Saves patient intake form → Supabase + notification email |
| [api/contact/route.ts](src/app/api/contact/route.ts) | `POST /api/contact` | Sends contact-form email via Resend |
| [api/newsletter/route.ts](src/app/api/newsletter/route.ts) | `POST /api/newsletter` | Adds email to Resend audience |
| [api/quiz/route.ts](src/app/api/quiz/route.ts) | `POST /api/quiz` | Sends quiz lead + user's result email |
| [api/admin/login/route.ts](src/app/api/admin/login/route.ts) | `POST /api/admin/login` | Sets `admin_session` cookie if password matches |
| [api/admin/logout/route.ts](src/app/api/admin/logout/route.ts) | `POST /api/admin/logout` | Deletes the cookie |

### Server Components (rendered on the server, ship HTML)

Every `page.tsx` *without* `"use client"` at the top runs server-side. Most are pure rendering, but a few do real backend work:

| File | Backend work it does |
|---|---|
| [admin/page.tsx](src/app/admin/page.tsx) | Reads `admin_session` cookie, queries Supabase for submissions, redirects if not authed |
| [checkout/page.tsx](src/app/checkout/page.tsx) | Resolves `?product=slug` server-side, redirects on bad input |
| [layout.tsx](src/app/layout.tsx) | Wraps everything; runs once per request |

### Server-only libs (`src/lib/`)

| File | Job |
|---|---|
| [lib/email.ts](src/lib/email.ts) | `sendEmail()` wrapper around Resend's HTTP API + `escapeHtml()` |
| [lib/supabase.ts](src/lib/supabase.ts) | Stateless Supabase client for one-shot inserts/queries |
| [lib/intake-schema.ts](src/lib/intake-schema.ts) | Zod schema validating intake-form POST bodies |
| [lib/glp1-intake-schema.ts](src/lib/glp1-intake-schema.ts) | Zod schema for the GLP-1 stepper questions |
| [lib/checkout-products.ts](src/lib/checkout-products.ts) | Product catalog the checkout API trusts |

> `lib/seo.ts`, `lib/booking.ts`, `lib/utils.ts`, `lib/schema.ts`, `lib/faq-schema.ts` are shared/frontend — pure functions, no I/O, no secrets.

### Supabase SSR helpers (`src/utils/supabase/`)

These exist because Supabase's official Next.js pattern requires three matching clients:

| File | Where it's used |
|---|---|
| [utils/supabase/client.ts](src/utils/supabase/client.ts) | **Browser** — auth-aware client for client components |
| [utils/supabase/server.ts](src/utils/supabase/server.ts) | **Server Components** — reads cookies via `next/headers` |
| [utils/supabase/middleware.ts](src/utils/supabase/middleware.ts) | **Edge middleware** — refreshes sessions on each request |

Today the only one that's actively used by backend code is `lib/supabase.ts` (the stateless one). The `utils/supabase/*` set is wired up for future auth-protected pages.

---

## 3. The request lifecycle (concrete example)

When a user submits the contact form, here's exactly what happens:

```
Browser                           Server (Vercel function)
───────                           ────────────────────────
fetch('/api/contact', {  ──HTTP─▶  POST /api/contact arrives
  method: 'POST',                  │
  body: JSON.stringify({...})      ▼
})                                 contact/route.ts → POST(request)
                                   │
                                   ├─ await request.json()      ◀── parse body
                                   ├─ bodySchema.safeParse(json)◀── validate
                                   ├─ if invalid → return 400
                                   ├─ if honeypot tripped → fake-success 200
                                   ├─ await sendEmail({...})    ◀── side effect
                                   └─ return Response.json({ok:true})
                                   │
                                   ▼
                          ──HTTP─▶  HTTP response
                                   │
const data = await res.json() ◀────┘
```

Every API route in this repo follows this shape: **parse → validate → side-effects → respond**.

---

## 4. Anatomy of an API route

The canonical pattern, drawn from [api/checkout/route.ts](src/app/api/checkout/route.ts):

```ts
import Stripe from "stripe";
import { z } from "zod";
import { getCheckoutProduct } from "@/lib/checkout-products";

// 1. Declare the shape of valid input.
const bodySchema = z.object({
  productSlug: z.string().min(1).max(100),
  customerEmail: z.string().email(),
  // ...
});

// 2. Export an async function NAMED after the HTTP verb.
//    Next.js routes the URL to this function automatically.
export async function POST(request: Request) {
  // 3. Check env vars early — fail fast if misconfigured.
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ ok: false, message: "Payment not configured." }, { status: 503 });
  }

  try {
    // 4. Parse the JSON body.
    const json: unknown = await request.json();

    // 5. Validate it. NEVER trust input — always parse before using.
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
    }

    // 6. Do the work.
    const { productSlug, customerEmail } = parsed.data;
    // ... call Stripe, write to DB, etc.

    // 7. Respond with a stable JSON shape.
    return Response.json({ ok: true, url: session.url });
  } catch (err) {
    // 8. Log server-side, return a generic message to the client.
    console.error("[checkout] stripe error", err);
    return Response.json(
      { ok: false, message: "Could not create checkout session." },
      { status: 500 },
    );
  }
}
```

### The four HTTP verbs Next.js will route automatically

Export functions named `GET`, `POST`, `PUT`, `PATCH`, `DELETE` (uppercase). One file can export multiple — Next.js routes each to the matching method.

```ts
// src/app/api/widgets/route.ts
export async function GET()  { /* list widgets */ }
export async function POST(req: Request) { /* create widget */ }
```

### Dynamic routes

`src/app/api/widgets/[id]/route.ts`:

```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;  // Note: params is a Promise in this version of Next.js
  // ...
}
```

> **Important:** This repo runs Next.js 16, where `params`, `searchParams`, and `cookies()` are all **async** (Promises). See [checkout/page.tsx:14-16](src/app/checkout/page.tsx#L14-L16) for the pattern.

---

## 5. Validation with Zod

Zod (`zod` package) is how every API route validates input. It's used because:

- **TypeScript types are erased at runtime** — they can't check incoming JSON.
- **`safeParse()` never throws** — it returns `{ success: true, data }` or `{ success: false, error }`. Branchable, no try/catch needed for validation.
- **Inferred types** — `z.infer<typeof schema>` gives you a TS type for free.

Standard pattern:

```ts
const bodySchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  tier: z.enum(["bronze", "silver", "gold"]),
  tags: z.array(z.string()).max(10).optional(),
  // Cross-field rule:
}).superRefine((val, ctx) => {
  if (val.tier === "gold" && !val.tags?.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["tags"], message: "Gold needs tags" });
  }
});

type Body = z.infer<typeof bodySchema>;
```

See [lib/glp1-intake-schema.ts](src/lib/glp1-intake-schema.ts) for a real `superRefine` example.

### Useful Zod methods

| Method | What it does |
|---|---|
| `.optional()` | Field may be missing |
| `.nullable()` | Field may be `null` |
| `.default(x)` | Substitute `x` if missing |
| `.transform(fn)` | Convert during parsing (e.g., trim whitespace) |
| `.max(n)` / `.min(n)` | Length constraint on strings/arrays, value constraint on numbers |
| `.regex(/.../)` | Pattern match |
| `z.literal("x")` | Must be exactly `"x"` |
| `z.discriminatedUnion("type", [...])` | Tagged unions (faster + better errors than plain `z.union`) |

---

## 6. Environment variables

### The two flavors

| Prefix | Example | Where it's available |
|---|---|---|
| `NEXT_PUBLIC_*` | `NEXT_PUBLIC_SITE_URL` | **Both** server and browser. Inlined into the client bundle at build time. |
| Anything else | `STRIPE_SECRET_KEY` | **Server only.** Never reaches the browser. |

**Rule:** If a value is secret (API keys, passwords), it must NOT have the `NEXT_PUBLIC_` prefix. The naming is enforced by Next.js — there's no way to accidentally leak a non-prefixed env var to the client.

### Env vars this project uses

| Variable | Purpose | Required? |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe API auth | Required for checkout |
| `NEXT_PUBLIC_SITE_URL` | Used in Stripe success/cancel URLs and SEO | Required in production |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Required for DB writes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Required for DB writes |
| `RESEND_API_KEY` | Resend email API key | Optional — emails skip if unset |
| `RESEND_AUDIENCE_ID` | Resend newsletter audience | Optional |
| `CONTACT_FROM_EMAIL` | "From" address for notification emails | Required if `RESEND_API_KEY` set |
| `CONTACT_NOTIFICATION_EMAIL` | Inbox that receives form notifications | Optional — logs if unset |
| `ADMIN_PASSWORD` | Plaintext password for `/admin` | Required for admin |

### Adding a new env var

1. Add to `.env.local` for local dev.
2. Add to Vercel project → Settings → Environment Variables.
3. Read in code with `process.env.YOUR_VAR`.
4. **Always check it exists** before using, like [api/checkout/route.ts:22-25](src/app/api/checkout/route.ts#L22-L25).

### `process.env` gotchas

- `process.env.YOUR_VAR` is typed as `string | undefined` — you must narrow it.
- Setting it in a Vercel preview deployment requires a redeploy to take effect.
- The `!` non-null assertion (`process.env.X!`) is a **lie to the type-checker** — it crashes at runtime if undefined. Prefer an explicit check.

---

## 7. Database — Supabase

### What Supabase is

Postgres-as-a-service with an HTTP/REST API on top. You write SQL to create tables, then call them from JS via the `@supabase/supabase-js` client.

### Three clients, three contexts

| Use case | Import from | Why |
|---|---|---|
| One-shot insert/read from an API route | [lib/supabase.ts](src/lib/supabase.ts) | Stateless, simple |
| Server Component reading user-scoped data | [utils/supabase/server.ts](src/utils/supabase/server.ts) | Cookie-aware (sees logged-in user) |
| Browser component reading user-scoped data | [utils/supabase/client.ts](src/utils/supabase/client.ts) | Manages session in localStorage |
| Edge middleware refreshing sessions | [utils/supabase/middleware.ts](src/utils/supabase/middleware.ts) | Runs before every request |

**For this project's current backend writes** ([intake](src/app/api/intake/route.ts), [checkout](src/app/api/checkout/route.ts)) — always use `lib/supabase.ts`. Auth-protected reads use the SSR versions.

### CRUD syntax

```ts
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

// INSERT
const { data, error } = await supabase
  .from("glp1_intake_submissions")
  .insert({ customer_email: "x@y.com", current_dose: "month-3-7.5mg" });

// SELECT
const { data, error } = await supabase
  .from("intake_submissions")
  .select("*")                              // columns
  .eq("email", "x@y.com")                   // WHERE email = ...
  .order("submitted_at", { ascending: false })
  .limit(50);

// UPDATE
await supabase
  .from("widgets")
  .update({ status: "active" })
  .eq("id", widgetId);

// DELETE
await supabase
  .from("widgets")
  .delete()
  .eq("id", widgetId);
```

### Row-Level Security (RLS)

Supabase tables have RLS on by default. Without a policy, **inserts and reads will silently fail** even with the publishable key. Always add a policy when you create a table:

```sql
create table public.widgets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null
);

alter table public.widgets enable row level security;

-- Allow anyone with the publishable key to insert
create policy "public insert"
  on public.widgets
  for insert
  to anon, authenticated
  with check (true);
```

**Security note:** The publishable key is shipped to the browser. Anyone can call your Supabase from anywhere. RLS policies are your only protection — design them carefully. If a table holds sensitive data, never write a `for select using (true)` policy.

### Snake_case convention

Supabase columns are conventionally `snake_case`. Map between camelCase in JS and snake_case in SQL explicitly — like [api/intake/route.ts:28-66](src/app/api/intake/route.ts#L28-L66).

---

## 8. Email — Resend

[lib/email.ts](src/lib/email.ts) is a thin wrapper around Resend's HTTP API. Three things to know:

### 1. It returns a discriminated union

```ts
const result = await sendEmail({ to, subject, html });

if (result.delivered) {
  // result.id exists
} else if (result.reason === "not-configured") {
  // env vars missing — silent skip
} else {
  // result.reason === "error" — log + maybe retry
}
```

This means callers can decide whether email failure should fail the whole request (see [api/contact/route.ts:86-91](src/app/api/contact/route.ts#L86-L91)) or just be logged.

### 2. Always escape user-provided strings in HTML

```ts
import { escapeHtml } from "@/lib/email";

const html = `<p>Hello ${escapeHtml(userName)}</p>`;  // safe
const html = `<p>Hello ${userName}</p>`;              // XSS waiting to happen
```

### 3. Fire-and-forget for non-critical notifications

Don't `await` if the email is just for your inbox. Wrap in `try/catch` so a Resend outage doesn't take down checkout:

```ts
try {
  await sendEmail({...});
} catch (err) {
  console.error("[checkout] email threw", err);
  // continue — don't fail the request
}
```

This pattern shows up in [api/intake/route.ts](src/app/api/intake/route.ts) — both the Supabase insert and the email are wrapped, so the user gets a success response even if both backends are down.

---

## 9. Stripe

### What it is

A payments processor. We use **Stripe Checkout**, the hosted-page flavor — we tell Stripe what to charge for, they handle the form, card processing, fraud detection, receipt emails, Apple Pay rendering, etc.

### How a Stripe charge happens here

1. User clicks "Continue to payment" → our `POST /api/checkout` fires.
2. We call `stripe.checkout.sessions.create({...})`.
3. Stripe returns a `url` (something like `https://checkout.stripe.com/c/pay/cs_...`).
4. We respond `{ ok: true, url }`.
5. Client does `window.location.href = data.url` to redirect.
6. User pays on Stripe's hosted page.
7. Stripe redirects them back to our `success_url` with a `session_id` query param.
8. [checkout/success/page.tsx](src/app/checkout/success/page.tsx) renders.

### Session anatomy

```ts
const session = await stripe.checkout.sessions.create({
  mode: "payment",                        // one-time charge (vs "subscription")
  customer_email: "x@y.com",              // prefill email
  allow_promotion_codes: true,            // show "have a promo code?" UI
  line_items: [{
    price_data: {
      currency: "usd",
      product_data: { name: "Product name", images: [imageUrl] },
      unit_amount: 22900,                 // cents — always integer!
    },
    quantity: 1,
  }],
  metadata: { product_slug: "..." },      // attaches to the charge — visible in Stripe dashboard
  shipping_address_collection: { allowed_countries: ["US"] },
  success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/checkout?product=${productSlug}`,
});
```

### Critical Stripe rules

- **Money is always integer cents.** $229.00 is `22900`, not `229.0`.
- **Metadata keys are limited to 40 chars, values to 500 chars.** Truncate before passing — see [api/checkout/route.ts:55,58](src/app/api/checkout/route.ts).
- **The `success_url` and `cancel_url` must be absolute** — Stripe won't redirect to relative paths.
- **Never trust the client about price.** Always look up the price server-side from a trusted source (here, [lib/checkout-products.ts](src/lib/checkout-products.ts)) — if the browser sent us a price, anyone could modify it via DevTools.

### Webhooks (not yet implemented)

Currently we trust the `success_url` redirect to mean "payment succeeded." This is fine for low-volume + low-fraud-risk products, but the **correct** pattern is to set up a webhook endpoint that Stripe calls when a payment completes. Until that exists, treat the success page as a hint, not a source of truth.

---

## 10. Authentication — the admin pattern

This codebase uses the simplest possible auth: **shared password + httpOnly cookie**. Not for protecting user accounts — only for gating an internal admin page.

### Flow

1. User POSTs `{ password: "..." }` to `/api/admin/login`.
2. Route compares to `process.env.ADMIN_PASSWORD`.
3. If match, sets an `admin_session` cookie with the password as its value.
4. `/admin` page reads the cookie and compares.

### Why httpOnly matters

```ts
cookieStore.set("admin_session", adminPassword, {
  httpOnly: true,    // JS can't read it — XSS-proof
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "lax",   // CSRF mitigation
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

- `httpOnly: true` → `document.cookie` can't see it from JS, so even an XSS bug can't steal it.
- `secure: true` → only sent over HTTPS (in production).
- `sameSite: "lax"` → not sent on cross-origin POSTs, blocks basic CSRF.

### Reading a cookie in a Server Component

```ts
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();        // Next 16: this is async
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }
  // authed
}
```

### What this pattern is NOT

It's not user accounts. It's not signup/login at scale. It's not OAuth. If you ever add per-user auth, throw this out and use Supabase Auth (via the `utils/supabase/*` clients).

---

## 11. Error handling philosophy

There are **two grades** of errors in this codebase:

### Critical (fail the request)

Things the user is waiting on. If they fail, return an error JSON the UI can display:

```ts
const session = await stripe.checkout.sessions.create({...});
if (!session.url) {
  return Response.json({ ok: false, message: "..." }, { status: 500 });
}
```

### Non-critical (log and continue)

Side effects the user doesn't see: notification emails, analytics inserts, audience syncs. Never let these break the main flow:

```ts
try {
  await someOptionalSideEffect();
} catch (err) {
  console.error("[route] side effect failed", err);
  // continue — don't fail the request
}
```

See [api/intake/route.ts](src/app/api/intake/route.ts) for both patterns side-by-side — the Supabase insert and the email are both wrapped, but the zod validation at the top is not, because invalid input must reject.

### Logging

- Use `console.error` for failures, `console.warn` for missing config, `console.info` for benign skips.
- Prefix every log with `[route-name]` so Vercel logs are greppable: `[checkout]`, `[intake]`, etc.
- Never log secrets. Never log full request bodies if they contain PII.

---

## 12. Security checklist

When adding or modifying a backend route, walk through these:

- [ ] **Validate input with Zod before using it.** Use `safeParse`, not `parse`. Reject on failure.
- [ ] **Trust nothing from the body for prices/permissions/IDs of expensive resources.** Look them up server-side from a trusted source.
- [ ] **Escape HTML** before interpolating user strings into emails or rendered output.
- [ ] **No secrets in `NEXT_PUBLIC_*` vars.**
- [ ] **No secrets in `lib/*` files that frontend imports.** When in doubt, put server-only code in `app/api/*/route.ts`.
- [ ] **Honeypot for public forms.** See [api/contact/route.ts:33-36](src/app/api/contact/route.ts#L33-L36) — adds a hidden `website` field; if filled, it's a bot.
- [ ] **Rate limiting.** Not implemented yet. Worth adding for public POST endpoints when traffic grows (see Vercel's `@vercel/kv` + a counter, or Upstash).
- [ ] **PII handling.** If a route accepts health data, don't log the body, set short retention, and consider whether RLS is sufficient — for HIPAA you'd need more (BAA with Supabase + Vercel, audit logging, etc.).
- [ ] **Errors don't leak internals.** Generic `{ message: "..." }` to the client; details in `console.error`.

---

## 13. Recipe — add a new API route

Say you want `POST /api/feedback`. Step by step:

### 1. Create the file

`src/app/api/feedback/route.ts`:

```ts
import { z } from "zod";

const bodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
    }

    const { rating, comment, email } = parsed.data;

    // ...persist, notify, whatever...

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[feedback] error", err);
    return Response.json({ ok: false, message: "Unexpected error." }, { status: 500 });
  }
}
```

### 2. Call it from a client component

```tsx
"use client";

async function submit() {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: 5, comment: "great" }),
  });
  const data = (await res.json()) as { ok: boolean; message?: string };
  if (!data.ok) {
    // show error
  }
}
```

### 3. (Optional) Persist to Supabase

```sql
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  rating int not null,
  comment text,
  email text
);
alter table public.feedback enable row level security;
create policy "anon insert" on public.feedback for insert to anon with check (true);
```

Add the insert to your route, wrapped in fire-and-forget.

### 4. Test

- Hit it with curl: `curl -X POST localhost:3000/api/feedback -H 'Content-Type: application/json' -d '{"rating":5}'`
- Check `console.log` output in the `next dev` terminal.
- Test the bad path: send invalid JSON, missing fields, oversized strings.

---

## 14. Where things run

| Code | Runs on | Notes |
|---|---|---|
| `src/app/*/page.tsx` (no `"use client"`) | **Server** (Node) | Renders HTML, sent to browser |
| `src/app/*/page.tsx` (with `"use client"`) | **Browser** | Hydrates from HTML shell |
| `src/app/api/*/route.ts` | **Server** (Node) | Serverless function per request |
| `src/components/**` (with `"use client"`) | **Browser** | Bundled into JS |
| `src/components/**` (no `"use client"`) | **Server or Browser** | Inherits from importer |
| `src/lib/**` | **Either** | Be careful with secrets |
| `middleware.ts` (root) | **Edge runtime** | Not in this repo yet |

### "use client" rule of thumb

A file needs `"use client"` if it:
- Uses `useState`, `useEffect`, or any React hook
- Adds event handlers (`onClick`, `onChange`)
- Uses browser APIs (`window`, `document`, `localStorage`)
- Imports another `"use client"` file at the top level

Otherwise, leave it off — Server Components are lighter (no JS shipped), faster (rendered on the server), and can do server-only things (read env, query DB directly).

---

## 15. TypeScript / JS syntax cheat sheet

The syntax you'll see most in backend code, with brief explanations:

### `async` / `await`

```ts
const data = await fetch(url);   // pause until fetch resolves
```

`async` functions return Promises. `await` is sugar for `.then()`. Top-level `await` works in route handlers because they're already async.

### Destructuring

```ts
const { rating, email } = parsed.data;          // pull fields out
const [first, ...rest] = items;                 // arrays
const { a: renamed } = obj;                     // rename
const { foo = "default" } = obj;                // default if undefined
```

### Optional chaining + nullish coalescing

```ts
const name = user?.profile?.name ?? "Anonymous";
// ?.  → bail with undefined if any link is null/undefined
// ??  → use right side only if left is null OR undefined (not "")
```

### Template literals

```ts
const url = `${baseUrl}/api/${slug}?id=${id}`;
```

### `Record<K, V>`

```ts
const metadata: Record<string, string> = {};
metadata.product_slug = "x";
```

Equivalent to `{ [key: string]: string }`.

### Type assertion (`as`)

```ts
const data = (await res.json()) as { ok: boolean; url?: string };
```

Tells TypeScript what you believe the shape is. **Not a runtime check** — use Zod when you actually need to verify.

### Non-null assertion (`!`)

```ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;  // "trust me, it's defined"
```

Crashes at runtime if wrong. Avoid in route handlers; prefer explicit checks.

### Discriminated unions

```ts
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };

if (result.ok) {
  result.data;   // TS knows data exists
} else {
  result.error;  // TS knows error exists
}
```

Pattern used by `EmailResult` in [lib/email.ts](src/lib/email.ts).

### `void` for fire-and-forget

```ts
void persistGlp1Intake({...}).catch((err) => console.error(err));
```

`void` tells TS (and humans) "I deliberately don't await this Promise."

### Import paths

`@/foo` resolves to `src/foo` (configured in `tsconfig.json`). Always prefer `@/lib/email` over `../../lib/email`.

---

## 16. Common pitfalls to avoid

| Mistake | Why it bites you |
|---|---|
| Using `process.env.STRIPE_SECRET_KEY` in a `"use client"` file | Either undefined at runtime or (worse) inlined into the client bundle on a misconfigured project |
| Returning a `Response` without `Content-Type` | Use `Response.json(...)` instead of `new Response(JSON.stringify(...))` — it sets headers for you |
| Forgetting `await` on `cookies()` / `params` / `searchParams` | Next.js 16 made them all async — silent bugs if you forget |
| Storing prices as floats | Floats can't represent `0.10` exactly. Always integer cents |
| Using `parse` instead of `safeParse` in Zod | `parse` throws on invalid input — your catch becomes a 500 instead of a clean 400 |
| Forgetting RLS policies after `create table` | Inserts silently fail with no error |
| Skipping `escapeHtml` in email templates | XSS in your own inbox is still XSS |
| Logging full request bodies with PII | Vercel logs are not HIPAA-safe; treat them like a public diary |
| Awaiting a non-critical email and letting failure 500 the user's checkout | See `try/catch + continue` pattern above |

---

## 17. Quick reference — when to use what

| Need to... | Use |
|---|---|
| Validate user input | `zod` `safeParse` |
| Make an HTTP request to a third party | global `fetch` |
| Read a cookie on the server | `cookies()` from `next/headers` (await it) |
| Set a cookie | `cookieStore.set(name, value, { httpOnly, secure, sameSite, maxAge, path })` |
| Redirect from a Server Component | `redirect("/path")` from `next/navigation` |
| Read URL params in a server `page.tsx` | `({ searchParams }: { searchParams: Promise<{...}> })` |
| Read URL params in `route.ts` | `new URL(request.url).searchParams.get("foo")` |
| Insert a DB row | `getSupabase().from("table").insert({...})` |
| Send an email | `sendEmail({ to, subject, html })` from `lib/email` |
| Create a Stripe checkout | `new Stripe(secret).checkout.sessions.create({...})` |
| Parse a JSON body | `await request.json()` then `schema.safeParse(it)` |
| Respond with JSON | `Response.json(obj, { status: 200 })` |

---

If you want to extend this guide as you add features (e.g., when you wire up Stripe webhooks, or add Supabase Auth), drop new sections at the bottom — the structure is meant to grow.
