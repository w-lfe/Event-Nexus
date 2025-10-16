-- Add New 8 Category Vibes to Database
-- Run this in your Supabase SQL Editor

-- First, let's see what vibes currently exist
SELECT id, category FROM "Vibes" ORDER BY id;

-- Clear old vibes if you want to start fresh (OPTIONAL - uncomment if needed)
-- DELETE FROM "Event_Vibes";
-- DELETE FROM "Vibes";

-- Insert the 8 new vibes in order (1-8)
-- Using ON CONFLICT to avoid duplicates if you run this multiple times

INSERT INTO "Vibes" (category)
VALUES
  ('party'),     -- 1
  ('music'),     -- 2
  ('festival'),  -- 3
  ('food'),      -- 4
  ('artsy'),     -- 5
  ('comedy'),    -- 6
  ('expo'),      -- 7
  ('sports')     -- 8
ON CONFLICT (category) DO NOTHING;

-- If your Vibes table has an auto-incrementing ID, the order should be 1-8
-- Verify the vibes were added correctly
SELECT id, category FROM "Vibes" ORDER BY id;

-- Update existing events to use the new vibe categories
-- This maps old categories to new ones:
-- 'music' stays 'music'
-- 'food' stays 'food'
-- 'comedy' stays 'comedy'
-- 'arts' becomes 'artsy'

-- Update events that had 'arts' to use 'artsy'
UPDATE "Event_Vibes" ev
SET category = (SELECT id FROM "Vibes" WHERE category = 'artsy')
WHERE ev.category = (SELECT id FROM "Vibes" WHERE category = 'arts');

-- Verify the event vibes
SELECT
  e.event_title,
  v.category as vibe,
  e.image
FROM "Events" e
JOIN "Event_Vibes" ev ON e.id = ev.event_id
JOIN "Vibes" v ON ev.category = v.id
ORDER BY v.category, e.event_title;

-- Update event images to match new categories
UPDATE "Events" e
SET image = '🎉'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'party';

UPDATE "Events" e
SET image = '🎵'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'music';

UPDATE "Events" e
SET image = '🎪'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'festival';

UPDATE "Events" e
SET image = '🍜'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'food';

UPDATE "Events" e
SET image = '🎨'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'artsy';

UPDATE "Events" e
SET image = '😂'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'comedy';

UPDATE "Events" e
SET image = '🏛️'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'expo';

UPDATE "Events" e
SET image = '⚽'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id AND v.category = 'sports';

-- Final verification
SELECT
  v.id,
  v.category,
  COUNT(e.id) as event_count
FROM "Vibes" v
LEFT JOIN "Event_Vibes" ev ON v.id = ev.category
LEFT JOIN "Events" e ON ev.event_id = e.id
GROUP BY v.id, v.category
ORDER BY v.id;
