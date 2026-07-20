-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews engine migration
--
-- Adds:
--   review_requests — one row per post-visit review request the team sends.
--   Tracks the SMS delivery, the patient's NPS response, whether we routed
--   them to Google (promoter) or a private feedback flow (passive/detractor),
--   and any free-text feedback.
--
-- Access pattern: all reads/writes go through server-side API routes that
-- validate the token or the admin cookie. RLS is DISABLED because access is
-- gated by unguessable UUID tokens + server-side auth, not row ownership.
--
-- Run once in Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.review_requests (
  id              uuid primary key default gen_random_uuid(),
  token           uuid unique not null default gen_random_uuid(),
  patient_name    text not null,
  patient_phone   text,
  patient_email   text,
  service         text,
  appointment_at  timestamptz,
  sms_sent_at     timestamptz,
  sms_provider    text,
  sms_status      text,
  nps_score       int,
  feedback_text   text,
  routed_to       text,
  is_escalation   boolean not null default false,
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  constraint nps_score_range check (nps_score is null or (nps_score between 0 and 10)),
  constraint routed_to_values check (routed_to is null or routed_to in ('google', 'private'))
);

create index if not exists review_requests_created_at_idx
  on public.review_requests (created_at desc);

create index if not exists review_requests_submitted_at_idx
  on public.review_requests (submitted_at desc)
  where submitted_at is not null;

create index if not exists review_requests_token_idx
  on public.review_requests (token);

create index if not exists review_requests_escalation_idx
  on public.review_requests (is_escalation, created_at desc)
  where is_escalation = true;

-- RLS off — all access is through server-side API routes.
alter table public.review_requests disable row level security;
