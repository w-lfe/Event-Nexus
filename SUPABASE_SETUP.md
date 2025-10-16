# Event Nexus - Supabase Setup Guide

## Setup Steps

### 1. Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Open the file `supabase-schema.sql` from this project
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute the script

This will:
- ✅ Create the `events` table with all necessary columns
- ✅ Add indexes for better query performance
- ✅ Create an auto-update trigger for `updated_at` field
- ✅ Disable RLS (Row Level Security) for easier development
- ✅ Insert 12 sample events to get you started

### 2. Verify Your Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase project:
- Go to **Settings** → **API**
- Copy the **Project URL** as `VITE_SUPABASE_URL`
- Copy the **anon/public** key as `VITE_SUPABASE_ANON_KEY`

### 3. Restart Your Dev Server

If the dev server is already running, restart it to load the new environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then start it again:
yarn dev
```

### 4. Test the Integration

1. Open the app at http://localhost:5174
2. You should see the 12 sample events loaded from Supabase
3. Try adding a new event using the "Add Event" button
4. The new event should appear immediately in the list

## Database Schema

### Events Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | Primary Key, Auto-generated |
| `title` | VARCHAR(100) | NOT NULL |
| `category` | VARCHAR(20) | NOT NULL, CHECK (music/food/comedy/arts) |
| `date` | TIMESTAMPTZ | NOT NULL |
| `location` | VARCHAR(100) | NOT NULL |
| `description` | TEXT | NOT NULL, 10-500 characters |
| `image` | VARCHAR(10) | Default: '🎵' |
| `created_at` | TIMESTAMPTZ | Auto-set on insert |
| `updated_at` | TIMESTAMPTZ | Auto-updated on change |

### Indexes

- `idx_events_date` - Fast filtering by date
- `idx_events_category` - Fast filtering by category
- `idx_events_created_at` - Fast sorting by creation time

## API Functions

All Supabase interactions are in `src/lib/eventsApi.js`:

- **`fetchEvents()`** - Get all events, sorted by date
- **`addEvent(eventData)`** - Insert a new event
- **`updateEvent(id, updates)`** - Update an existing event
- **`deleteEvent(id)`** - Delete an event

## Security Note

⚠️ **RLS is currently DISABLED for development!**

Before deploying to production, you should:
1. Enable RLS on the `events` table
2. Create appropriate policies (e.g., anyone can read, authenticated users can insert)
3. Remove the `DISABLE ROW LEVEL SECURITY` line from the schema

## Troubleshooting

### "Failed to load events" Error

1. Check that your `.env` file has the correct credentials
2. Verify the SQL schema was run successfully in Supabase
3. Check the browser console for detailed error messages
4. Make sure your Supabase project is active (not paused)

### Events not showing up

1. Open Supabase Dashboard → Table Editor
2. Click on the `events` table
3. Verify that records exist in the table
4. Check that the `date` field has future dates (events are sorted by date)

### Can't add new events

1. Check the browser console for error messages
2. Verify your API key has write permissions
3. Make sure RLS is disabled or policies allow inserts
4. Check that all required fields are being sent

## Next Steps

### Enable Real-time Updates (Optional)

To make events update in real-time across users:

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Enable replication for the `events` table
3. Add this to `App.jsx`:

```javascript
useEffect(() => {
  const subscription = supabase
    .channel('events-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'events' },
      () => loadEvents()
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### Add Authentication (Optional)

To track who creates events:

1. Enable Email/Password auth in Supabase
2. Add a `user_id` column to the events table
3. Create authentication components
4. Store the user_id when creating events

### Production Security

Before going live:

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

**You're all set!** Your Event Nexus app is now connected to Supabase. 🚀
