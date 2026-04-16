## 05 — API routes & email delivery

Prev: `./04-components-and-ui.md`  
Next: `./06-styling.md`

### What is an API route here?

In Next.js App Router, a file at:

- `src/app/api/<name>/route.ts`

defines server endpoints like:

- `POST /api/<name>`

These run on the server (Node.js runtime by default) and can:

- validate input
- talk to third-party APIs (Resend)
- return JSON

### Routes in this repo

- `src/app/api/contact/route.ts`
  - handles the contact form
  - validates input with `zod`
  - uses a honeypot field (`website`) to reduce bot spam
  - sends an email to `CONTACT_NOTIFICATION_EMAIL`
- `src/app/api/newsletter/route.ts`
  - handles newsletter signup (also likely via Resend/Audience)
- `src/app/api/quiz/route.ts`
  - handles quiz lead capture (still exists even if the UI no longer collects email)

If you don’t need a route anymore, you can remove it (and its usage) without affecting the rest of the site.

### The email abstraction: `src/lib/email.ts`

This file is the boundary between your app and Resend.

It exports:

- `sendEmail({ to, subject, html, replyTo })`
- `escapeHtml(value)` — to safely embed user text into HTML emails

Important behavior:

- If `RESEND_API_KEY` or `CONTACT_FROM_EMAIL` is missing, `sendEmail` returns:
  - `{ delivered: false, reason: "not-configured" }`
  - and the API routes usually “pretend success” so the UI doesn’t break in dev.

This is a deliberate trade-off:

- **Pros**: local dev works without secrets
- **Cons**: you can forget to configure email in production if you don’t monitor logs

### Validation: client and server

Client validation (fast UX):

- `src/components/forms/contact-form.tsx` uses `react-hook-form` + Zod

Server validation (security):

- `src/app/api/contact/route.ts` re-validates with Zod again

Rule of thumb:

> Never trust the browser. Client validation is for UX; server validation is for correctness and security.

### Common patterns you can learn from

#### Honeypot anti-bot

The contact form includes a hidden `website` field.

- humans don’t fill it
- simple bots often do

On the server:

- if `website` is present → return `{ ok: true }` without sending email

This reduces spam without annoying real users with CAPTCHAs.

#### Returning shaped JSON

The API returns:

- `{ ok: true }` on success
- `{ ok: false, message: "..." }` on failure

The UI can then show a friendly message.

