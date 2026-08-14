-- Run this in the Supabase SQL editor. Adds buddy fields for the
-- "Duo Friends" flow (now a fixed pair, mirroring Couple).

alter table bookings add column if not exists buddy_name text;
alter table bookings add column if not exists buddy_phone text;
alter table bookings add column if not exists buddy_whatsapp text;
alter table bookings add column if not exists buddy_instagram text;
alter table bookings add column if not exists buddy_age int;
