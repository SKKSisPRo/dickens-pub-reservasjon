-- Row Level Security for the Dickens Pub reservation system.
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
--
-- Context: the backend (backend/index.js) talks to Supabase using the
-- SERVICE ROLE key, which always bypasses RLS — none of this affects the
-- Express API or the admin/booking flows that go through it. This only
-- restricts what the ANON key (shipped to every browser) can do if used
-- directly against Supabase, bypassing the backend entirely.

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- areas / tables: nothing in the frontend queries these directly via the
-- Supabase client (both go through the backend's /areas and /tables routes),
-- so no policies are added — RLS enabled + zero policies means the anon key
-- gets zero access, which is correct here.

-- reservations: same story for reads/writes — the frontend never calls
-- supabase.from('reservations') directly, only backend routes (service
-- role). The one exception is the realtime .channel(...).on('postgres_changes', ...)
-- subscription both the public floor plan and the admin dashboard use to
-- know when to refetch — that requires a SELECT grant to receive events at
-- all. Enabling RLS with NO SELECT policy below blocks that subscription
-- from receiving anything (over-restrictive by default, safe by default).
--
-- IMPORTANT TRADE-OFF: with no policy added, live auto-refresh (both the
-- public "table just got booked" floor-plan update and the admin
-- dashboard's "another staff member changed something" live update) will
-- stop working over the anon key — pages will only reflect changes on next
-- load/date-change, not instantly. If you want that live behavior back
-- without exposing guest PII, ask for the follow-up: a narrow view
-- exposing only (table_id, date, time) that the anon key can SELECT from,
-- with the realtime subscription pointed at that view instead of the raw
-- reservations table.
