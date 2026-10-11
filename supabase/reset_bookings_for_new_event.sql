-- Reset the seat count before a new event goes on sale.
--
-- The landing page, /api/slots and the per-show seat counts all add up
-- num_participants across the bookings table, so rows from the last event
-- keep eating into this one's capacity.
--
-- Run in the Supabase SQL editor: Project > SQL Editor > New query.
-- This cannot be undone — check Database > Backups first.

-- Adds the column the show picker writes to. Safe to re-run.
alter table bookings add column if not exists show_time text;
create index if not exists bookings_show_time_idx on bookings(show_time);

-- One statement for the whole table: referred_by is a self-referencing
-- foreign key, so clearing everything at once avoids constraint errors
-- that partial deletes would hit.
delete from bookings;

-- Make PostgREST pick up the new column straight away.
NOTIFY pgrst, 'reload schema';

-- Should read 0.
select count(*) as live_bookings from bookings;

-- Payment screenshots from the cleared bookings stay in the private
-- `payment-screenshots` storage bucket. Remove them from
-- Storage > payment-screenshots in the dashboard if you want them gone.
