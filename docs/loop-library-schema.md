# RMXR Loop Library Schema

## Overview
This document defines the structure for RMXR's CC0 loop library, sourced from FreePD, FMA, Pixabay, and OpenGameArt.

## Loop Metadata Structure

```typescript
type Loop = {
  id: string                    // unique ID (uuid)
  path: string                  // file path in storage (e.g., "/loops/trap_drums_140.wav")
  url: string                   // public CDN URL

  // Audio properties
  bpm: number                   // tempo (80-180)
  bars: number                  // loop length in bars (4, 8, 16)
  durationBeats: number         // total beats in loop
  durationSeconds: number       // total duration
  key?: string                  // musical key (Am, C, Dm, etc.)

  // Loop role/type
  role: 'drums' | 'bass' | 'chords' | 'melody' | 'fx' | 'vocal' | 'pad'

  // AI selection tags
  genre: string[]               // ['trap', 'hip-hop', 'dark']
  mood: string[]                // ['dark', 'aggressive', 'chill', 'spacey']
  energy: 'chill' | 'groove' | 'club'
  instruments: string[]         // ['808', 'snare', 'hi-hat', 'synth pad']

  // Licensing
  source: 'FreePD' | 'FMA' | 'Pixabay' | 'OpenGameArt' | 'ProducerSpace'
  sourceUrl?: string            // original track URL
  licenseType: 'CC0' | 'CC-BY'
  artistName?: string           // for attribution (if CC-BY)
  artistUrl?: string
  attributionText?: string      // pre-formatted attribution

  // Metadata
  name: string                  // display name
  description?: string
  createdAt: string             // ISO timestamp
  tags?: string[]               // additional search tags
}
```

## Initial Library Structure (V1 Starter Pack)

### Genre Coverage
- **Trap/Hip-Hop** (140 BPM)
  - 808 bass loops
  - Trap drum patterns
  - Dark pads/atmospheres
  - Snare rolls / hi-hat triplets

- **House** (120-128 BPM)
  - Four-on-floor kicks
  - Bass lines
  - Chord progressions
  - Vocal chops

- **Lo-fi** (80-90 BPM)
  - Dusty drums
  - Jazz chords
  - Soft bass
  - Vinyl crackle FX

- **EDM** (128 BPM)
  - Build-up drums
  - Drop bass
  - Synth leads
  - Riser FX

- **Techno** (130-135 BPM)
  - Driving kicks
  - Minimal bass
  - Industrial percussion
  - Dark atmospheres

### File Organization

```
/public/loops/
  /trap/
    trap_drums_140.wav
    trap_808_bass_140.wav
    trap_pad_dark_140.wav
    trap_hihat_roll_140.wav

  /house/
    house_kick_124.wav
    house_bass_124.wav
    house_chords_124.wav
    house_vocal_chop_124.wav

  /lofi/
    lofi_drums_85.wav
    lofi_jazz_chords_85.wav
    lofi_bass_85.wav
    lofi_vinyl_fx_85.wav

  /edm/
    edm_buildup_128.wav
    edm_drop_bass_128.wav
    edm_synth_lead_128.wav
    edm_riser_fx_128.wav

  /techno/
    techno_kick_132.wav
    techno_bass_132.wav
    techno_perc_132.wav
    techno_atmosphere_132.wav
```

## Sample Loop Metadata (JSON)

```json
[
  {
    "id": "loop_001",
    "path": "/loops/trap/trap_drums_140.wav",
    "url": "https://your-cdn.com/loops/trap/trap_drums_140.wav",
    "bpm": 140,
    "bars": 4,
    "durationBeats": 16,
    "durationSeconds": 6.86,
    "key": null,
    "role": "drums",
    "genre": ["trap", "hip-hop"],
    "mood": ["dark", "aggressive"],
    "energy": "club",
    "instruments": ["kick", "snare", "hi-hat", "808"],
    "source": "FreePD",
    "sourceUrl": "https://freepd.com/trap-beat.php",
    "licenseType": "CC0",
    "artistName": "FreePD",
    "attributionText": null,
    "name": "Dark Trap Drums 140",
    "description": "4-bar trap drum pattern with 808 kick and crispy hi-hats",
    "createdAt": "2025-01-20T00:00:00Z",
    "tags": ["drums", "trap", "dark", "140bpm"]
  },
  {
    "id": "loop_002",
    "path": "/loops/trap/trap_808_bass_140.wav",
    "url": "https://your-cdn.com/loops/trap/trap_808_bass_140.wav",
    "bpm": 140,
    "bars": 8,
    "durationBeats": 32,
    "durationSeconds": 13.71,
    "key": "Am",
    "role": "bass",
    "genre": ["trap", "hip-hop"],
    "mood": ["dark", "heavy", "spacey"],
    "energy": "club",
    "instruments": ["808 bass", "sub bass"],
    "source": "FMA",
    "sourceUrl": "https://freemusicarchive.org/music/HoliznaCC0",
    "licenseType": "CC0",
    "artistName": "HoliznaCC0",
    "attributionText": null,
    "name": "Heavy 808 Bass Loop",
    "description": "8-bar 808 bass pattern in A minor",
    "createdAt": "2025-01-20T00:00:00Z",
    "tags": ["bass", "808", "trap", "Am", "140bpm"]
  },
  {
    "id": "loop_003",
    "path": "/loops/house/house_kick_124.wav",
    "url": "https://your-cdn.com/loops/house/house_kick_124.wav",
    "bpm": 124,
    "bars": 4,
    "durationBeats": 16,
    "durationSeconds": 7.74,
    "key": null,
    "role": "drums",
    "genre": ["house", "deep-house"],
    "mood": ["groovy", "warm", "deep"],
    "energy": "groove",
    "instruments": ["kick", "clap", "hi-hat"],
    "source": "Pixabay",
    "sourceUrl": "https://pixabay.com/music/deep-house-groove.mp3",
    "licenseType": "CC0",
    "artistName": "Pixabay",
    "attributionText": null,
    "name": "Deep House Kick Pattern",
    "description": "Classic four-on-floor house drums",
    "createdAt": "2025-01-20T00:00:00Z",
    "tags": ["drums", "house", "four-on-floor", "124bpm"]
  },
  {
    "id": "loop_004",
    "path": "/loops/lofi/lofi_drums_85.wav",
    "url": "https://your-cdn.com/loops/lofi/lofi_drums_85.wav",
    "bpm": 85,
    "bars": 4,
    "durationBeats": 16,
    "durationSeconds": 11.29,
    "key": null,
    "role": "drums",
    "genre": ["lofi", "hip-hop", "chillhop"],
    "mood": ["chill", "relaxed", "jazzy", "nostalgic"],
    "energy": "chill",
    "instruments": ["dusty kick", "snare", "hi-hat", "vinyl crackle"],
    "source": "OpenGameArt",
    "sourceUrl": "https://opengameart.org/content/cc0-lofi-drums",
    "licenseType": "CC0",
    "artistName": "OpenGameArt",
    "attributionText": null,
    "name": "Lo-fi Dusty Drums",
    "description": "Chill lo-fi drum loop with vinyl texture",
    "createdAt": "2025-01-20T00:00:00Z",
    "tags": ["drums", "lofi", "chill", "85bpm", "dusty"]
  }
]
```

## Supabase Table Schema (SQL)

```sql
-- Loops table
CREATE TABLE loops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  url TEXT NOT NULL,

  -- Audio properties
  bpm INTEGER NOT NULL,
  bars INTEGER NOT NULL,
  duration_beats INTEGER NOT NULL,
  duration_seconds NUMERIC(6,2) NOT NULL,
  key TEXT,

  -- Loop role
  role TEXT NOT NULL CHECK (role IN ('drums', 'bass', 'chords', 'melody', 'fx', 'vocal', 'pad')),

  -- AI selection tags (stored as arrays)
  genre TEXT[] NOT NULL,
  mood TEXT[] NOT NULL,
  energy TEXT NOT NULL CHECK (energy IN ('chill', 'groove', 'club')),
  instruments TEXT[] NOT NULL,

  -- Licensing
  source TEXT NOT NULL CHECK (source IN ('FreePD', 'FMA', 'Pixabay', 'OpenGameArt', 'ProducerSpace')),
  source_url TEXT,
  license_type TEXT NOT NULL CHECK (license_type IN ('CC0', 'CC-BY')),
  artist_name TEXT,
  artist_url TEXT,
  attribution_text TEXT,

  -- Metadata
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast AI loop selection
CREATE INDEX idx_loops_genre ON loops USING GIN (genre);
CREATE INDEX idx_loops_mood ON loops USING GIN (mood);
CREATE INDEX idx_loops_energy ON loops (energy);
CREATE INDEX idx_loops_role ON loops (role);
CREATE INDEX idx_loops_bpm ON loops (bpm);

-- RLS policies
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;

-- Everyone can read loops
CREATE POLICY "Loops are viewable by everyone"
  ON loops FOR SELECT
  USING (true);

-- Only authenticated users can insert (for now, you might want admin-only later)
CREATE POLICY "Authenticated users can insert loops"
  ON loops FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

## Download & Processing Workflow

### Step 1: Download Source Tracks
```bash
# Create download directory
mkdir -p downloads/source

# Download from FreePD, FMA, Pixabay
# (manual download or use scripts)
```

### Step 2: Slice into Loops (DAW or Script)
- Use Ableton, FL Studio, or ffmpeg
- Cut to exact bar lengths (4, 8, or 16 bars)
- Export as WAV, 44.1kHz, 16-bit

### Step 3: Organize Files
```bash
# Move to public/loops/ with naming convention
# {genre}_{role}_{bpm}.wav
```

### Step 4: Generate Metadata
- Create JSON file with loop metadata
- Calculate BPM, duration, etc.

### Step 5: Upload to Supabase Storage
```bash
# Upload to Supabase bucket
supabase storage upload loops/ public/loops/*
```

### Step 6: Seed Database
```bash
# Insert metadata into loops table
psql < seed-loops.sql
```

## Initial V1 Target (20 Loops)

- **5 Trap loops** (140 BPM): drums, bass, pad, fx, melody
- **5 House loops** (124 BPM): drums, bass, chords, vocal, fx
- **4 Lo-fi loops** (85 BPM): drums, chords, bass, fx
- **3 EDM loops** (128 BPM): buildup, drop, lead
- **3 Techno loops** (132 BPM): kick, bass, atmosphere

This gives you enough variety to test the AI Mix engine without overwhelming the initial curation effort.
