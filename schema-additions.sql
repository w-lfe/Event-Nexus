-- SQL additions for your existing Event Nexus database

-- Add missing columns to Events table if they don't exist
ALTER TABLE "Events"
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '🎵',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraints for description if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'events_description_length'
    ) THEN
        ALTER TABLE "Events"
        ADD CONSTRAINT events_description_length
        CHECK (char_length(description) >= 10 AND char_length(description) <= 500);
    END IF;
END $$;

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_updated_at ON "Events";
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON "Events"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure RLS is disabled for development
ALTER TABLE "Events" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Event_Vibes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Vibes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Cities" DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_events_start ON "Events"(start);
CREATE INDEX IF NOT EXISTS idx_events_city_id ON "Events"(city_id);
CREATE INDEX IF NOT EXISTS idx_event_vibes_event_id ON "Event_Vibes"(event_id);
CREATE INDEX IF NOT EXISTS idx_event_vibes_category ON "Event_Vibes"(category);

-- View your current structure
SELECT
    'Events' as table_name,
    COUNT(*) as row_count
FROM "Events"
UNION ALL
SELECT
    'Vibes' as table_name,
    COUNT(*) as row_count
FROM "Vibes"
UNION ALL
SELECT
    'Cities' as table_name,
    COUNT(*) as row_count
FROM "Cities";

-- Check what vibes/categories exist
SELECT * FROM "Vibes" ORDER BY category;
