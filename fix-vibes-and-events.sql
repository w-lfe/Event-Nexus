-- Fix Vibes (Categories) and Event Images

-- First, let's see what vibes you currently have
SELECT * FROM "Vibes" ORDER BY category;

-- Update or insert the correct vibes with proper naming
-- This will ensure you have all 4 categories with consistent naming
INSERT INTO "Vibes" (category)
VALUES ('music'), ('food'), ('comedy'), ('arts')
ON CONFLICT DO NOTHING;

-- If your vibes have different names, update them:
-- UPDATE "Vibes" SET category = 'music' WHERE LOWER(category) LIKE '%music%';
-- UPDATE "Vibes" SET category = 'food' WHERE LOWER(category) LIKE '%food%';
-- UPDATE "Vibes" SET category = 'comedy' WHERE LOWER(category) LIKE '%comedy%';
-- UPDATE "Vibes" SET category = 'arts' WHERE LOWER(category) LIKE '%art%';

-- Update event images based on their linked vibe/category
-- This will fix the emoji icons to match the category

-- Update events with MUSIC vibe
UPDATE "Events" e
SET image = '🎵'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id
  AND LOWER(v.category) = 'music';

-- Update events with FOOD vibe
UPDATE "Events" e
SET image = '🍜'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id
  AND LOWER(v.category) = 'food';

-- Update events with COMEDY vibe
UPDATE "Events" e
SET image = '😂'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id
  AND LOWER(v.category) = 'comedy';

-- Update events with ARTS vibe
UPDATE "Events" e
SET image = '🎨'
FROM "Event_Vibes" ev
JOIN "Vibes" v ON ev.category = v.id
WHERE e.id = ev.event_id
  AND LOWER(v.category) = 'arts';

-- Verify the updates
SELECT
  e.id,
  e.event_title,
  e.image,
  v.category as vibe_category
FROM "Events" e
LEFT JOIN "Event_Vibes" ev ON e.id = ev.event_id
LEFT JOIN "Vibes" v ON ev.category = v.id
ORDER BY v.category, e.event_title;

-- If you want to see events grouped by category with counts:
SELECT
  v.category,
  COUNT(e.id) as event_count,
  STRING_AGG(e.image, ', ') as images_used
FROM "Vibes" v
LEFT JOIN "Event_Vibes" ev ON v.id = ev.category
LEFT JOIN "Events" e ON ev.event_id = e.id
GROUP BY v.category
ORDER BY v.category;
