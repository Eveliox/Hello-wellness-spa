-- ─────────────────────────────────────────────────────────────────────────────
-- Week 3 growth migration
--
-- Adds:
--   referrals — refer-a-friend program submissions (code + status tracking)
--   bookings  — Cal.com webhook payloads (so we can send our own confirmations
--               and later run 24h reminders + no-show recovery)
--
-- Access pattern: all reads/writes go through server-side API routes.
-- RLS is DISABLED — access is gated by admin cookie + Cal.com webhook secret
-- + unguessable UUID tokens.
--
-- Run once in Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.referrals (
  id                      uuid primary key default gen_random_uuid(),
  code                    text unique not null,
  referrer_name           text not null,
  referrer_email          text not null,
  referrer_phone          text,
  friend_name             text not null,
  friend_email            text,
  friend_phone            text,
  friend_first_booked_at  timestamptz,
  friend_first_visit_at   timestamptz,
  referrer_credit_awarded boolean not null default false,
  friend_credit_awarded   boolean not null default false,
  notes                   text,
  created_at              timestamptz not null default now()
);

create index if not exists referrals_created_at_idx on public.referrals (created_at desc);
create index if not exists referrals_code_idx       on public.referrals (code);
create index if not exists referrals_referrer_email_idx on public.referrals (lower(referrer_email));
create index if not exists referrals_friend_email_idx   on public.referrals (lower(friend_email));

alter table public.referrals disable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                        uuid primary key default gen_random_uuid(),
  cal_booking_id            text unique not null,
  booking_at                timestamptz not null,
  duration_min              int,
  service                   text,
  attendee_name             text,
  attendee_email            text,
  attendee_phone            text,
  status                    text not null default 'confirmed',
  our_confirmation_sent_at  timestamptz,
  our_reminder_sent_at      timestamptz,
  cancelled_at              timestamptz,
  raw_payload               jsonb,
  created_at                timestamptz not null default now(),
  constraint bookings_status_values check (status in ('confirmed', 'cancelled', 'no_show', 'completed'))
);

create index if not exists bookings_booking_at_idx     on public.bookings (booking_at);
create index if not exists bookings_created_at_idx     on public.bookings (created_at desc);
create index if not exists bookings_attendee_email_idx on public.bookings (lower(attendee_email));
create index if not exists bookings_status_idx        on public.bookings (status);

alter table public.bookings disable row level security;
