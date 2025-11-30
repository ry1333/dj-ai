-- Create loops table for CC0 sample library
-- Migration: 20250123000000_create_loops_table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Loops table
CREATE TABLE loops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,

  -- Audio properties
  bpm INTEGER NOT NULL CHECK (bpm BETWEEN 60 AND 200),
  bars INTEGER NOT NULL CHECK (bars > 0),
  duration_beats INTEGER NOT NULL CHECK (duration_beats > 0),
  duration_seconds NUMERIC(6,2) NOT NULL CHECK (duration_seconds > 0),
  key TEXT, -- Musical key (Am, C, Dm, etc.)

  -- Loop role/type
  role TEXT NOT NULL CHECK (role IN ('drums', 'bass', 'chords', 'melody', 'fx', 'vocal', 'pad')),

  -- AI selection tags (stored as text arrays for flexible querying)
  genre TEXT[] NOT NULL DEFAULT '{}',
  mood TEXT[] NOT NULL DEFAULT '{}',
  energy TEXT NOT NULL CHECK (energy IN ('chill', 'groove', 'club')),
  instruments TEXT[] NOT NULL DEFAULT '{}',

  -- Licensing information
  source TEXT NOT NULL CHECK (source IN ('FreePD', 'FMA', 'Pixabay', 'OpenGameArt', 'ProducerSpace', 'Other')),
  source_url TEXT,
  license_type TEXT NOT NULL CHECK (license_type IN ('CC0', 'CC-BY', 'Pixabay')),
  artist_name TEXT,
  artist_url TEXT,
  attribution_text TEXT,

  -- Metadata
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for fast AI loop selection queries
CREATE INDEX idx_loops_genre ON loops USING GIN (genre);
CREATE INDEX idx_loops_mood ON loops USING GIN (mood);
CREATE INDEX idx_loops_instruments ON loops USING GIN (instruments);
CREATE INDEX idx_loops_tags ON loops USING GIN (tags);
CREATE INDEX idx_loops_energy ON loops (energy);
CREATE INDEX idx_loops_role ON loops (role);
CREATE INDEX idx_loops_bpm ON loops (bpm);
CREATE INDEX idx_loops_source ON loops (source);
CREATE INDEX idx_loops_license ON loops (license_type);

-- Full-text search index on name and description
CREATE INDEX idx_loops_search ON loops USING GIN (
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_loops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_loops_updated_at
  BEFORE UPDATE ON loops
  FOR EACH ROW
  EXECUTE FUNCTION update_loops_updated_at();

-- Enable Row Level Security
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read loops
CREATE POLICY "Loops are viewable by everyone"
  ON loops
  FOR SELECT
  USING (true);

-- RLS Policy: Only authenticated users can insert loops
-- (Later you might want to restrict this to admin users only)
CREATE POLICY "Authenticated users can insert loops"
  ON loops
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policy: Only authenticated users can update loops
CREATE POLICY "Authenticated users can update loops"
  ON loops
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Only authenticated users can delete loops
CREATE POLICY "Authenticated users can delete loops"
  ON loops
  FOR DELETE
  TO authenticated
  USING (true);

-- Add helpful comments
COMMENT ON TABLE loops IS 'CC0 and royalty-free audio loops for AI Mix generation';
COMMENT ON COLUMN loops.path IS 'File path in storage (e.g., /loops/trap/trap_drums_140.wav)';
COMMENT ON COLUMN loops.url IS 'Public CDN URL for direct audio playback';
COMMENT ON COLUMN loops.genre IS 'Genre tags for AI matching (e.g., {trap, hip-hop})';
COMMENT ON COLUMN loops.mood IS 'Mood descriptors for AI selection (e.g., {dark, aggressive})';
COMMENT ON COLUMN loops.instruments IS 'Instrument tags (e.g., {808 bass, snare, hi-hat})';
COMMENT ON COLUMN loops.source IS 'Where the loop was sourced from';
COMMENT ON COLUMN loops.license_type IS 'License type (CC0 = public domain, no attribution needed)';

-- Sample data insert (optional - for testing)
INSERT INTO loops (
  path, url, bpm, bars, duration_beats, duration_seconds, key, role,
  genre, mood, energy, instruments, source, license_type, name
) VALUES (
  '/loops/trap/trap_drums_140.wav',
  '/loops/trap/trap_drums_140.wav',
  140, 4, 16, 6.86, NULL, 'drums',
  ARRAY['trap', 'hip-hop'],
  ARRAY['dark', 'aggressive'],
  'club',
  ARRAY['kick', 'snare', 'hi-hat', '808'],
  'FreePD',
  'CC0',
  'Dark Trap Drums'
);
