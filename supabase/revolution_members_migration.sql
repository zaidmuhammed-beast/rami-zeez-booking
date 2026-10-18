-- Run this in the Supabase SQL editor: Project > SQL Editor > New query.
-- Creates the table behind the "Become Part Of Revolution" form — people
-- asking for startup support, and people offering it.

create extension if not exists "pgcrypto";

create table if not exists revolution_members (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  city text not null,
  phone text not null,
  whatsapp text not null,
  email text,
  age_range text not null,
  gender text not null,

  role text not null check (role in ('receive', 'provide', 'both')),

  -- Filled in when they're asking for support.
  support_type text,
  household_size text,
  household_income text,
  situation text,

  -- Filled in when they're offering support.
  contributions text[] not null default '{}',

  message text,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'approved', 'declined')),

  created_at timestamptz not null default now()
);

create index if not exists revolution_members_created_at_idx
  on revolution_members(created_at desc);
create index if not exists revolution_members_role_idx
  on revolution_members(role);

-- These rows hold people's hardship details. Locked down: every read and
-- write goes through server-side routes using the service role key.
alter table revolution_members enable row level security;

NOTIFY pgrst, 'reload schema';
