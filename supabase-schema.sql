-- Event Nexus Database Schema
-- Run this in your Supabase SQL Editor

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('music', 'food', 'comedy', 'arts')),
  date TIMESTAMPTZ NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 500),
  image VARCHAR(10) DEFAULT '🎵',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for easier development (REMOVE THIS IN PRODUCTION!)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO events (title, category, date, location, description, image) VALUES
  ('Neon Nights Music Festival', 'music', NOW() + INTERVAL '1 day', 'Downtown Arena', 'Experience the future of electronic music with holographic performances and immersive sound.', '🎵'),
  ('Cyberpunk Food Market', 'food', NOW() + INTERVAL '1 day', 'Tech District Plaza', 'Street food reimagined with molecular gastronomy and fusion cuisine.', '🍜'),
  ('AI Comedy Show', 'comedy', NOW() + INTERVAL '2 days', 'The Laugh Lab', 'Stand-up comedy meets artificial intelligence. Prepare for unexpected humor.', '😂'),
  ('Digital Art Exhibition', 'arts', NOW() + INTERVAL '3 days', 'Neo Gallery', 'Interactive NFT art installations and virtual reality experiences.', '🎨'),
  ('Synthwave Saturday', 'music', NOW() + INTERVAL '5 days', 'Retro Club', '80s inspired electronic music with neon visuals and laser shows.', '🎹'),
  ('Rooftop Jazz Night', 'music', NOW() + INTERVAL '1 day', 'Sky Lounge', 'Smooth jazz under the stars with craft cocktails and city views.', '🎷'),
  ('Vegan Fusion Pop-Up', 'food', NOW() + INTERVAL '2 days', 'Green Space Market', 'Plant-based cuisine from around the world. Sustainable and delicious.', '🥗'),
  ('Improv Comedy Workshop', 'comedy', NOW() + INTERVAL '4 days', 'The Comedy Loft', 'Learn improv techniques and perform with the pros. Beginners welcome!', '🎭'),
  ('Street Art Tour', 'arts', NOW() + INTERVAL '3 days', 'Arts District', 'Guided walking tour of the city''s most vibrant murals and graffiti.', '🖌️'),
  ('Open Mic Night', 'music', NOW() + INTERVAL '2 days', 'The Underground', 'Showcase your talent! All genres welcome. Sign up at the door.', '🎤'),
  ('Craft Beer & BBQ Fest', 'food', NOW() + INTERVAL '5 days', 'Riverside Park', '50+ craft beers and award-winning BBQ from local pitmasters.', '🍺'),
  ('Photography Exhibition', 'arts', NOW() + INTERVAL '4 days', 'Frame Gallery', 'Urban landscapes and portrait photography by emerging artists.', '📸');

-- Query to verify data
SELECT * FROM events ORDER BY date ASC;
