-- Run this in the Supabase SQL editor: Project > SQL Editor > New query.
-- Creates the table behind the /ambassadors application form.

create extension if not exists "pgcrypto";

create table if not exists ambassadors (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  university text not null,
  city text not null,
  study_year text,

  phone text not null,
  whatsapp text,
  email text,
  instagram text not null,
  follower_range text,

  why text not null,
  experience text,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'selected', 'declined')),

  created_at timestamptz not null default now()
);

create index if not exists ambassadors_created_at_idx
  on ambassadors(created_at desc);

-- Same posture as bookings and brand_partners: locked down, all access goes
-- through server-side routes using the service role key.
alter table ambassadors enable row level security;
