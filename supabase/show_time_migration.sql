-- Run this in the Supabase SQL editor: Project > SQL Editor > New query.
-- Adds the show a guest picked, for events that run more than one sitting
-- (the Awarapan 2 screening has a 3:00 PM and a 6:00 PM show).

alter table bookings add column if not exists show_time text;

create index if not exists bookings_show_time_idx on bookings(show_time);

NOTIFY pgrst, 'reload schema';
