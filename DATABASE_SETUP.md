# Event Nexus - Database Setup for Your Existing Schema

## Your Current Database Structure

Based on your schema diagram:

- **Events** table - `id`, `event_title`, `city_id`, `start`, `stop`
- **Event_Vibes** junction table - `event_id`, `category` (FK to Vibes)
- **Vibes** table - `id`, `category`
- **Cities** table - `id`, `city_name`

## Required SQL Updates

Run this SQL in your Supabase SQL Editor to add missing columns needed by the app:

```sql
-- Add missing columns to Events table
ALTER TABLE "Events"
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '🎵',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraint for description length
ALTER TABLE "Events"
ADD CONSTRAINT IF NOT EXISTS events_description_length
CHECK (char_length(description) >= 10 AND char_length(description) <= 500);

-- Create updated_at trigger
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

-- Disable RLS for development
ALTER TABLE "Events" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Event_Vibes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Vibes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Cities" DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start ON "Events"(start);
CREATE INDEX IF NOT EXISTS idx_events_city_id ON "Events"(city_id);
CREATE INDEX IF NOT EXISTS idx_event_vibes_event_id ON "Event_Vibes"(event_id);
CREATE INDEX IF NOT EXISTS idx_event_vibes_category ON "Event_Vibes"(category);
```

## Required Vibes (Categories)

Make sure your `Vibes` table has these categories (case-insensitive):

```sql
-- Insert required vibes if they don't exist
INSERT INTO "Vibes" (category)
SELECT 'music' WHERE NOT EXISTS (SELECT 1 FROM "Vibes" WHERE LOWER(category) = 'music');

INSERT INTO "Vibes" (category)
SELECT 'food' WHERE NOT EXISTS (SELECT 1 FROM "Vibes" WHERE LOWER(category) = 'food');

INSERT INTO "Vibes" (category)
SELECT 'comedy' WHERE NOT EXISTS (SELECT 1 FROM "Vibes" WHERE LOWER(category) = 'comedy');

INSERT INTO "Vibes" (category)
SELECT 'arts' WHERE NOT EXISTS (SELECT 1 FROM "Vibes" WHERE LOWER(category) = 'arts');

-- Verify vibes
SELECT * FROM "Vibes" ORDER BY category;
```

## How the App Works with Your Schema

### Fetching Events
The app queries:
```sql
Events → Event_Vibes → Vibes
Events → Cities
```

And transforms the data to:
- `title` ← `event_title`
- `date` ← `start`
- `location` ← `Cities.city_name`
- `category` ← Primary vibe from `Vibes.category`
- `categories` ← All vibes as an array

### Adding Events
When a user adds an event, the app:

1. **Creates/finds city** in `Cities` table
2. **Inserts event** into `Events` table with:
   - `event_title`
   - `city_id`
   - `start` (from date + time)
   - `stop` (start + 2 hours default)
   - `location`, `description`, `image`

3. **Links to vibe** in `Event_Vibes` junction table:
   - Looks up vibe ID from `Vibes` where category matches
   - Creates junction record with `event_id` and `category` (vibe ID)

## Testing Your Setup

After running the SQL:

1. **Check your tables have the columns:**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'Events'
   ORDER BY ordinal_position;
   ```

2. **Verify vibes exist:**
   ```sql
   SELECT * FROM "Vibes";
   ```

3. **Test the app:**
   - Open http://localhost:5174
   - Events should load from your database
   - Try adding a new event
   - Check Supabase Table Editor to see the data

## Common Issues & Solutions

### Error: "relation 'events' does not exist"
- Your tables use capital letters: `Events`, not `events`
- ✅ Code is already updated to use capital letters

### Error: "column 'description' does not exist"
- Run the ALTER TABLE statements above to add missing columns

### Error: "could not find vibe"
- Make sure the Vibes table has: music, food, comedy, arts
- Run the INSERT INTO statements above

### Events not showing up
- Check that `start` dates are in the future
- Verify Event_Vibes junction table has records linking events to vibes

## Field Mapping Reference

| App Field | Database Column | Table |
|-----------|----------------|-------|
| `id` | `id` | Events |
| `title` | `event_title` | Events |
| `date` | `start` | Events |
| `location` | `city_name` | Cities (via city_id) |
| `description` | `description` | Events |
| `image` | `image` | Events |
| `category` | `category` | Vibes (via Event_Vibes) |

---

**You're all set!** Run the SQL above, then test at http://localhost:5174 🚀
