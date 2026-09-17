-- Run this in the Supabase SQL editor: Project > SQL Editor > New query.
-- Creates the table behind the /brands partnership form.

create extension if not exists "pgcrypto";

create table if not exists brand_partners (
  id uuid primary key default gen_random_uuid(),

  brand_name text not null,
  contact_name text not null,
  phone text not null,
  whatsapp text,
  email text,
  instagram text,
  website text,

  category text not null,
  interest text not null check (interest in ('stall', 'promotion', 'both')),
  events text[] not null default '{}',
  description text not null,
  budget text,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'declined')),

  created_at timestamptz not null default now()
);

create index if not exists brand_partners_created_at_idx
  on brand_partners(created_at desc);

-- Same posture as bookings: locked down, all access goes through server-side
-- routes using the service role key, never the browser anon key.
alter table brand_partners enable row level security;
