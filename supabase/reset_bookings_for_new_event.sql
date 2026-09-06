-- Clear the slot counter for HUE & YOU 1.0.
--
-- The landing page and /api/slots count every row in `bookings`
-- (sum of num_participants), so bookings from the previous event keep
-- eating into the 50 seats.
--
-- Run in the Supabase SQL editor: Project > SQL Editor > New query.
-- This cannot be undone — check Database > Backups first.

-- One statement for the whole table: referred_by is a self-referencing
-- foreign key, so clearing everything at once avoids constraint errors
-- that partial deletes would hit.
delete from bookings;

-- Should read 0.
select count(*) as live_bookings from bookings;

-- Payment screenshots from the cleared bookings stay in the private
-- `payment-screenshots` storage bucket. Remove them from
-- Storage > payment-screenshots in the dashboard if you want them gone.
