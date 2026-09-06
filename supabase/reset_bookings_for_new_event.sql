-- Clear the slot counter for HUE & YOU 1.0.
--
-- The landing page and /api/slots count every row in `bookings`
-- (sum of num_participants), so bookings from the previous event keep
-- eating into the 50 seats. This archives them and empties the table.
--
-- Run in the Supabase SQL editor: Project > SQL Editor > New query.
-- Safe to run more than once — already-archived rows are not duplicated.

begin;

-- 1. Archive table, same shape as bookings but without the unique
--    constraints, so archived refs/codes never clash with new bookings.
create table if not exists bookings_archive (
  like bookings including defaults
);

alter table bookings_archive add column if not exists archived_at timestamptz not null default now();
alter table bookings_archive add column if not exists archived_event text;

alter table bookings_archive enable row level security;

-- 2. Copy across anything not already archived.
insert into bookings_archive
select b.*, now(), 'Rami ZeeZ Mehfil (23 Aug 2026)'
from bookings b
where not exists (
  select 1 from bookings_archive a where a.id = b.id
);

-- 3. Empty the live table. referred_by is self-referencing, so every row
--    goes in one statement rather than row by row.
delete from bookings;

commit;

-- Check: both should read as expected before you leave the SQL editor.
select count(*) as live_bookings from bookings;
select count(*) as archived_bookings from bookings_archive;

-- Payment screenshots for the old bookings stay in the private
-- `payment-screenshots` storage bucket. Clear them from
-- Storage > payment-screenshots in the dashboard if you want them gone;
-- the archive rows keep the paths if you need to look one up.
