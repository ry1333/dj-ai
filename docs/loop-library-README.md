# RMXR Loop Library System

Complete system for managing CC0 audio loops for AI Mix generation.

## Overview

The RMXR Loop Library is a curated collection of CC0 (public domain) and royalty-free audio loops sourced from verified free music platforms. These loops power the AI Mix generation system, allowing users to create professional-quality mixes without needing to upload their own audio.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Mix Request                          │
│  "Dark Travis Scott-style trap, heavy 808s, drop at 0:20"  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Gemini AI (StyleSpec)                      │
│  Returns: genre, BPM, mood, energy, instruments, etc.       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Mix Planner (Loop Selection)                   │
│  Queries loop library with StyleSpec criteria               │
│  - findLoops({ genre: ['trap'], mood: ['dark'], bpm: 140 })│
│  - Selects: drums, bass, pad, melody loops                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 MixPlan (Timeline)                          │
│  - Drums: 0-60 beats, -3dB                                  │
│  - Bass: 8-60 beats, -6dB, fadeIn 4 beats                   │
│  - Pad: 16-60 beats, -9dB, fadeIn 4 beats                   │
│  - Melody: 32-60 beats (drop), -9dB, fadeIn 2 beats         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Audio Engine (Rendering)                      │
│  Time-stretches loops to match BPM                          │
│  Applies gain, fades, effects                               │
│  Renders final mix to single audio file                     │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
/public/loops/           # Static audio files (WAV, 44.1kHz, 16-bit)
  /trap/
  /house/
  /lofi/
  /edm/
  /techno/

/src/lib/loops/
  starter-library.json   # Loop metadata (20 starter loops)
  loopLibrary.ts         # In-memory loop query functions

/src/lib/supabase/
  loops.ts               # Supabase loop database queries

/supabase/migrations/
  20250123000000_create_loops_table.sql  # Database schema

/docs/
  loop-library-schema.md # Full schema documentation
  download-guide.md      # How to source CC0 loops

/scripts/
  seed-loops.ts          # Upload starter library to Supabase
```

## Quick Start

### 1. Use the Starter Library (In-Memory)

The simplest way to get started is using the pre-configured JSON library:

```typescript
import { findLoops, getRandomLoop } from '@/lib/loops/loopLibrary'

// Find all trap drums at ~140 BPM
const trapDrums = findLoops({
  genre: ['trap'],
  role: 'drums',
  bpm: 140,
  bpmRange: 10
})

// Get a random dark trap bass loop
const darkBass = getRandomLoop({
  genre: ['trap'],
  mood: ['dark'],
  role: 'bass',
  energy: 'club'
})
```

**Pros:**
- Zero setup, works immediately
- Fast (no database queries)
- Perfect for prototyping

**Cons:**
- Limited to 20 starter loops
- No user-uploaded loops
- Can't add loops without code changes

### 2. Use Supabase (Production-Ready)

For production, use the Supabase database to scale your loop library:

```typescript
import { queryLoops, getRandomLoop } from '@/lib/supabase/loops'

// Same API, but fetches from database
const trapDrums = await queryLoops({
  genre: ['trap'],
  role: 'drums',
  bpm: 140,
  bpmRange: 10
})

const darkBass = await getRandomLoop({
  genre: ['trap'],
  mood: ['dark'],
  role: 'bass',
  energy: 'club'
})
```

**Pros:**
- Unlimited loops
- Admin UI to add/manage loops
- User-uploaded content support
- Advanced search (full-text, filters)

**Cons:**
- Requires Supabase setup
- Database queries (slightly slower)

## Setup Instructions

### Option A: In-Memory Library (5 minutes)

1. The library is already set up! Check `src/lib/loops/starter-library.json`
2. Use `import { findLoops } from '@/lib/loops/loopLibrary'`
3. Done! 🎉

### Option B: Supabase Database (30 minutes)

#### Step 1: Run Migration

```bash
# Push migration to Supabase
supabase db push

# Or apply manually
psql -h your-db.supabase.co -U postgres -d postgres -f supabase/migrations/20250123000000_create_loops_table.sql
```

#### Step 2: Seed Database

```bash
# Install dependencies
npm install tsx

# Run seed script
npx tsx scripts/seed-loops.ts
```

#### Step 3: Update AI Mix to Use Supabase

In `src/lib/ai/mockAIMix.ts`, replace imports:

```typescript
// OLD (in-memory)
import { getRandomLoop } from '../loops/loopLibrary'

// NEW (Supabase)
import { getRandomLoop } from '../supabase/loops'
```

Make `generateMixPlan` async:

```typescript
async function generateMixPlan(styleSpec: StyleSpec, request: UserMixRequest): Promise<MixPlan> {
  const drumsLoop = await getRandomLoop({ ... })
  // ...
}
```

## Adding New Loops

### Manual Process

1. **Download CC0 track** (see `docs/download-guide.md`)
2. **Slice into 4-8 bar loops** using Audacity or ffmpeg
3. **Name file:** `{genre}_{role}_{bpm}.wav` (e.g., `trap_drums_140.wav`)
4. **Copy to:** `public/loops/{genre}/`
5. **Add metadata** to `src/lib/loops/starter-library.json`:

```json
{
  "id": "loop_021",
  "path": "/loops/trap/trap_new_drums_140.wav",
  "bpm": 140,
  "bars": 4,
  "durationBeats": 16,
  "durationSeconds": 6.86,
  "role": "drums",
  "genre": ["trap", "hip-hop"],
  "mood": ["dark", "aggressive"],
  "energy": "club",
  "instruments": ["kick", "snare", "hi-hat"],
  "source": "FreePD",
  "licenseType": "CC0",
  "name": "New Trap Drums"
}
```

6. **Re-seed database** (if using Supabase): `npx tsx scripts/seed-loops.ts`

### Automated Process (Coming Soon)

- Admin UI for uploading loops
- Auto-BPM detection
- Auto-metadata tagging with AI
- Bulk upload support

## Loop Metadata Schema

```typescript
type Loop = {
  // File info
  id: string
  path: string              // "/loops/trap/trap_drums_140.wav"

  // Audio properties
  bpm: number               // 80-180
  bars: number              // 4, 8, or 16
  durationBeats: number
  durationSeconds: number
  key: string | null        // "Am", "C", "Dm", etc.

  // Classification
  role: 'drums' | 'bass' | 'chords' | 'melody' | 'fx' | 'vocal' | 'pad'
  genre: string[]           // ['trap', 'hip-hop']
  mood: string[]            // ['dark', 'aggressive']
  energy: 'chill' | 'groove' | 'club'
  instruments: string[]     // ['808', 'snare', 'hi-hat']

  // Licensing
  source: 'FreePD' | 'FMA' | 'Pixabay' | 'OpenGameArt' | 'ProducerSpace'
  licenseType: 'CC0' | 'CC-BY'
  name: string
}
```

## Querying Loops

### Basic Queries

```typescript
// Get all trap loops
const trapLoops = findLoops({ genre: ['trap'] })

// Get drum loops at 124 BPM (±5 BPM)
const houseDrums = findLoops({
  role: 'drums',
  bpm: 124,
  bpmRange: 5
})

// Get dark, aggressive bass loops
const darkBass = findLoops({
  role: 'bass',
  mood: ['dark', 'aggressive']
})

// Get chill energy loops
const chillLoops = findLoops({ energy: 'chill' })
```

### Advanced Queries (Supabase)

```typescript
// Full-text search
const results = await searchLoops('808 bass trap')

// Get all unique genres
const { data } = await supabase.rpc('get_all_genres')

// Get loop statistics
const stats = await getLoopStats()
// {
//   totalLoops: 20,
//   byRole: { drums: 6, bass: 5, ... },
//   byEnergy: { chill: 4, groove: 8, club: 8 },
//   bpmRange: { min: 85, max: 140 }
// }
```

## Loop Sources & Licensing

All loops in the starter library are from verified CC0 sources:

| Source         | License | Attribution Required | Commercial Use | Link |
|---------------|---------|---------------------|----------------|------|
| FreePD        | CC0     | ❌ No               | ✅ Yes         | https://freepd.com |
| FMA (CC0)     | CC0     | ❌ No               | ✅ Yes         | https://freemusicarchive.org |
| Pixabay       | Pixabay | ❌ No               | ✅ Yes         | https://pixabay.com/music |
| OpenGameArt   | CC0     | ❌ No               | ✅ Yes         | https://opengameart.org |
| ProducerSpace | CC0     | ❌ No               | ✅ Yes         | https://producerspace.com |

**Important:**
- Always verify the license before adding a loop
- If CC-BY, add `attribution_text` to metadata
- Never use copyrighted samples

## Roadmap

### V1 (Current)
- [x] 20 starter loops (trap, house, lo-fi, EDM, techno)
- [x] In-memory JSON library
- [x] Basic query functions
- [x] Supabase schema & migration
- [x] Seed script

### V2 (Next)
- [ ] Download 50+ more loops from CC0 sources
- [ ] Admin UI for loop management
- [ ] Auto-BPM detection (Web Audio API)
- [ ] Waveform preview generation

### V3 (Future)
- [ ] User-uploaded loop support
- [ ] AI auto-tagging (mood, genre, instruments)
- [ ] Loop remix/mashup suggestions
- [ ] Community voting on loops
- [ ] Supabase Storage integration for CDN

## Contributing

Want to add loops to the library?

1. Follow the [Download Guide](./download-guide.md)
2. Ensure loops are CC0 or Pixabay licensed
3. Submit PR with:
   - WAV files in `/public/loops/{genre}/`
   - Metadata in `starter-library.json`
   - Source URL for verification

## Support

- **Discord:** [RMXR Community](#)
- **Issues:** [GitHub Issues](https://github.com/yourusername/rmxr/issues)
- **Docs:** [docs/](../docs/)

---

**Built with ❤️ using CC0 music from the community**
