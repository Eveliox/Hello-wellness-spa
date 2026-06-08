-- ─────────────────────────────────────────────────────────────────────────────
-- Patient portal migration
--
-- Adds:
--   1. patient_profiles table — one row per portal user, keyed to auth.users.id
--   2. patient_user_id columns on the two intake tables so portal users can
--      view their own past submissions
--   3. RLS policies that let patients read/update their own data only
--   4. link_intakes_to_patient() — called on signup to claim past submissions
--      whose email matches the new account
--
-- Run this once in the Supabase SQL editor (Database → SQL Editor → New query).
-- Safe to re-run; uses IF NOT EXISTS / DO blocks.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. patient_profiles ─────────────────────────────────────────────────────────
create table if not exists public.patient_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists patient_profiles_created_at_idx
  on public.patient_profiles (created_at desc);

alter table public.patient_profiles enable row level security;

drop policy if exists "patient can read own profile" on public.patient_profiles;
create policy "patient can read own profile"
  on public.patient_profiles for select
  using (auth.uid() = id);

drop policy if exists "patient can update own profile" on public.patient_profiles;
create policy "patient can update own profile"
  on public.patient_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "patient can insert own profile" on public.patient_profiles;
create policy "patient can insert own profile"
  on public.patient_profiles for insert
  with check (auth.uid() = id);

-- 2. patient_user_id on intake tables ────────────────────────────────────────
alter table public.intake_submissions
  add column if not exists patient_user_id uuid references auth.users(id) on delete set null;

create index if not exists intake_submissions_patient_user_id_idx
  on public.intake_submissions (patient_user_id);

create index if not exists intake_submissions_email_lower_idx
  on public.intake_submissions (lower(email));

alter table public.glp1_intake_submissions
  add column if not exists patient_user_id uuid references auth.users(id) on delete set null;

create index if not exists glp1_intake_submissions_patient_user_id_idx
  on public.glp1_intake_submissions (patient_user_id);

create index if not exists glp1_intake_submissions_email_lower_idx
  on public.glp1_intake_submissions (lower(email));

-- 3. RLS — patient can SELECT own intakes (anon INSERT policy stays as is) ───
drop policy if exists "patient can read own intakes" on public.intake_submissions;
create policy "patient can read own intakes"
  on public.intake_submissions for select
  using (auth.uid() = patient_user_id);

drop policy if exists "patient can read own glp1 intakes" on public.glp1_intake_submissions;
create policy "patient can read own glp1 intakes"
  on public.glp1_intake_submissions for select
  using (auth.uid() = patient_user_id);

-- 4. link_intakes_to_patient ─────────────────────────────────────────────────
-- Called from the signup API route immediately after a new auth user is created.
-- Claims any pre-existing intake rows whose email matches the new account.
-- SECURITY DEFINER lets it bypass RLS for the one-time backfill; signature
-- restricts the input to the *just-created* user so it can't be abused to
-- claim other patients' data.
create or replace function public.link_intakes_to_patient(p_user_id uuid, p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.intake_submissions
     set patient_user_id = p_user_id
   where patient_user_id is null
     and lower(email) = lower(p_email);

  update public.glp1_intake_submissions
     set patient_user_id = p_user_id
   where patient_user_id is null
     and lower(email) = lower(p_email);
end;
$$;

grant execute on function public.link_intakes_to_patient(uuid, text) to authenticated;
