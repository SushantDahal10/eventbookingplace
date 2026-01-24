-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text unique not null check (email = lower(email)),
  password_hash text not null,
  is_verified boolean default false,
  created_at timestamptz default now() not null
);

-- 2. OTPs TABLE (Generic)
-- 'purpose' can be 'verification', 'reset_password', '2fa', etc.
create table public.otps (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  user_id uuid references public.users(id) on delete cascade,
  code text not null,
  purpose text default 'verification',
  expires_at timestamptz not null,
  created_at timestamptz default now() not null
);

create index idx_otps_email on public.otps(email);
create index idx_otps_user_purpose on public.otps(user_id, purpose);

-- OPTIONAL: Database-level cleanup function (can be scheduled via pg_cron if available)
-- select delete_expired_otps();
create or replace function delete_expired_otps() returns void as $$
begin
  delete from public.otps where expires_at < now();
end;
$$ language plpgsql;
