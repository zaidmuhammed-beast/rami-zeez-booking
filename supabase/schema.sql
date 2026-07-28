-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null,
  group_type text not null check (group_type in ('single', 'duo', 'couple')),
  num_participants int not null default 1,

  primary_name text not null,
  primary_phone text not null,
  primary_whatsapp text not null,
  primary_instagram text,
  primary_age int,

  partner_name text,
  partner_phone text,
  partner_instagram text,
  relationship_duration text,

  fun_answers jsonb not null default '{}'::jsonb,

  ticket_type text not null,
  amount int not null,

  payment_method text not null,
  payment_screenshot_url text,

  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'checked_in')),

  coffee_claimed boolean not null default false,
  quiz_number int,
  table_number text,
  couple_number int,

  referral_code text unique not null,
  referred_by text references bookings(booking_ref),

  badges jsonb not null default '[]'::jsonb,
  wristband_color text,
  lucky_draw_token text,

  created_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on bookings(status);
create index if not exists bookings_referred_by_idx on bookings(referred_by);

-- Row Level Security: locked down. All reads/writes go through server-side
-- API routes using the service role key, never the browser anon key.
alter table bookings enable row level security;

-- Storage bucket for payment screenshots (private).
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;
