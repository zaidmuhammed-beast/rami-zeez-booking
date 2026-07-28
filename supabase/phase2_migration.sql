-- Run this in the Supabase SQL editor if you already ran schema.sql before
-- Phase 2 (badges/referral/lucky-draw) was added.

alter table bookings add column if not exists wristband_color text;
alter table bookings add column if not exists lucky_draw_token text;
