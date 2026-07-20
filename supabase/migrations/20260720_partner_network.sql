-- ─────────────────────────────────────────────────────────────────────────────
-- Partner Network migration
--
-- Adds the B2B "Hello You Wellness Partners" program:
--   partner_applications — raw submissions from the /partners page
--   partners             — approved partners with a unique referral code and
--                          optional auth.users link (populated on portal signup)
--   partner_referrals    — attribution + commission tracking per referred client
--
-- Also extends:
--   intake_submissions.partner_referral_code — attribution field on the intake
--
-- Access pattern: all reads/writes go through server-side API routes.
-- RLS is DISABLED — access is gated by admin cookie + Supabase Auth session
-- (partners.auth_user_id = auth.uid()).
--
-- Run once in Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── partner_applications ────────────────────────────────────────────────────
create table if not exists public.partner_applications (
  id                    uuid primary key default gen_random_uuid(),
  business_type         text not null,
  business_name         text not null,
  owner_name            text not null,
  email                 text not null,
  phone                 text not null,
  city                  text not null,
  website               text,
  instagram             text,
  client_count_range    text,
  motivation            text,
  referral_source       text,
  status                text not null default 'pending',
  admin_notes           text,
  reviewed_at           timestamptz,
  reviewed_by           text,
  created_at            timestamptz not null default now(),
  constraint partner_applications_business_type_values
    check (business_type in ('trainer', 'gym', 'studio', 'other')),
  constraint partner_applications_status_values
    check (status in ('pending', 'approved', 'rejected', 'archived'))
);

create index if not exists partner_applications_status_idx
  on public.partner_applications (status, created_at desc);
create index if not exists partner_applications_email_idx
  on public.partner_applications (lower(email));

alter table public.partner_applications disable row level security;

-- ─── partners ────────────────────────────────────────────────────────────────
-- Approved applicants get a row here with a unique referral code.
-- auth_user_id is null until they complete portal signup (gated on email match).
create table if not exists public.partners (
  id                        uuid primary key default gen_random_uuid(),
  application_id            uuid references public.partner_applications(id) on delete set null,
  auth_user_id              uuid unique references auth.users(id) on delete set null,
  referral_code             text unique not null,
  business_name             text not null,
  owner_name                text not null,
  email                     text not null unique,
  phone                     text not null,
  city                      text,
  website                   text,
  instagram                 text,
  status                    text not null default 'active',
  commission_rate           numeric(5,4) not null default 0.15,
  welcome_email_sent_at     timestamptz,
  marketing_kit_url         text,
  created_at                timestamptz not null default now(),
  constraint partners_status_values
    check (status in ('active', 'paused', 'terminated'))
);

create index if not exists partners_email_idx        on public.partners (lower(email));
create index if not exists partners_code_idx         on public.partners (referral_code);
create index if not exists partners_status_idx       on public.partners (status);
create index if not exists partners_auth_user_id_idx on public.partners (auth_user_id)
  where auth_user_id is not null;

alter table public.partners disable row level security;

-- ─── partner_referrals ───────────────────────────────────────────────────────
-- One row per referred client attribution event.
-- Populated from intake_submissions (partner_referral_code set) or manually
-- by mom in admin. Commission calculated when first_purchase_amount_cents is
-- filled in and status flips to 'earned'; paid_at set when Venmo/Zelle sent.
--
-- Client identity fields (email/phone/first_name) are stored for admin
-- reconciliation only. They are NEVER returned to the partner-facing
-- dashboard — the partner sees anonymized counts and dollar totals only
-- (HIPAA — no PHI disclosure without BAA).
create table if not exists public.partner_referrals (
  id                          uuid primary key default gen_random_uuid(),
  partner_id                  uuid not null references public.partners(id) on delete cascade,
  referral_code               text not null,
  client_email                text,
  client_phone                text,
  client_first_name           text,
  source                      text not null,
  source_ref                  text,
  first_purchase_amount_cents int,
  first_purchase_at           timestamptz,
  commission_cents            int,
  commission_status           text not null default 'pending',
  paid_at                     timestamptz,
  paid_method                 text,
  paid_ref                    text,
  admin_notes                 text,
  created_at                  timestamptz not null default now(),
  constraint partner_referrals_source_values
    check (source in ('intake', 'booking', 'manual')),
  constraint partner_referrals_commission_status_values
    check (commission_status in ('pending', 'earned', 'paid', 'void'))
);

create index if not exists partner_referrals_partner_id_idx
  on public.partner_referrals (partner_id, created_at desc);
create index if not exists partner_referrals_status_idx
  on public.partner_referrals (commission_status);
create index if not exists partner_referrals_code_idx
  on public.partner_referrals (referral_code);
create index if not exists partner_referrals_earned_idx
  on public.partner_referrals (partner_id, first_purchase_at desc)
  where commission_status in ('earned', 'paid');

alter table public.partner_referrals disable row level security;

-- ─── intake_submissions.partner_referral_code ────────────────────────────────
-- Attribution field on the existing intake form. Optional — most patients
-- won't have one. When present we auto-create a partner_referrals row on
-- intake submission (best-effort — admin can also add referrals manually).
alter table public.intake_submissions
  add column if not exists partner_referral_code text;

create index if not exists intake_submissions_partner_referral_code_idx
  on public.intake_submissions (partner_referral_code)
  where partner_referral_code is not null;
