# RMXR Loop Library - CC0 Download Guide

## Quick Start: Build Your V1 Library (20 loops in 1-2 hours)

This guide will help you download, slice, and organize 20 CC0 loops from verified free sources.

---

## Phase 1: Download Source Tracks (30 min)

### 1. FreePD - Public Domain Electronic Music

**URL:** https://freepd.com

**What to download:**
- Navigate to **Electronic** category
- Look for tracks with these keywords:
  - "trap" / "hip hop" / "beat" (for trap loops)
  - "house" / "techno" / "dance" (for house/techno)
  - "chill" / "ambient" (for lo-fi)

**Recommended tracks:**
1. Search "trap beat" → Download 2-3 trap instrumentals
2. Search "deep house" → Download 2-3 house tracks
3. Search "techno" → Download 1-2 techno tracks
4. Search "chill beat" → Download 1-2 lo-fi tracks

**License:** All CC0 (Public Domain) - No attribution needed

**File format:** MP3 (you'll convert to WAV later)

---

### 2. Free Music Archive (FMA) - CC0 Artists

**URL:** https://freemusicarchive.org

**Focus on CC0 artists:**
- **HoliznaCC0** - Electronic/trap producer, all CC0
- **Komiku** - Chiptune/electronic, mostly CC0
- **Kevin MacLeod** - Huge library, filter to CC0

**How to find:**
1. Go to FMA → Browse → **Electronic** genre
2. Click on artist profiles
3. Look for **"CC0 1.0"** in the license section (NOT "CC-BY")
4. Download tracks with clear genre labels

**Recommended:**
- HoliznaCC0: Download 3-5 electronic tracks (trap, house, ambient)
- Search "lofi" and filter to CC0 artists

**License:** Check each track - MUST be "CC0 1.0"

**File format:** MP3 or FLAC

---

### 3. Pixabay Music - Royalty-Free Electronic

**URL:** https://pixabay.com/music/

**Filter settings:**
- Genre: **Electronic, Dance, Hip Hop**
- Sort: **Popular** or **Latest**

**What to look for:**
- Tracks labeled "EDM", "Trap", "House", "Techno", "Chill"
- Prefer instrumental tracks (no complex vocals)
- Download 4-8 bar loopable sections

**Recommended searches:**
- "trap beat"
- "deep house"
- "techno minimal"
- "lo fi hip hop"

**License:** Pixabay License (like CC0, no attribution required)

**File format:** MP3

---

### 4. OpenGameArt - CC0 Game Music Packs

**URL:** https://opengameart.org

**Search for:**
- "CC0 electronic music"
- "upbeat electronic"
- "techno loops"

**Example pack:**
- **"CC0 - Upbeat Electronic Music"** by ozzed
  - https://opengameart.org/content/cc0-upbeat-electronic-music

**License:** Filter results to show only CC0

**File format:** Usually WAV or OGG

---

### 5. Producer Space - CC0 Sample Packs

**URL:** https://producerspace.com

**What to download:**
- Browse **Free Sample Packs**
- Look for CC0 labeled packs:
  - Drum loops
  - Bass one-shots
  - Synth loops
  - FX sounds

**Recommended packs:**
- "Free Trap Drums CC0"
- "House Bass Loops CC0"
- "Ambient Pads CC0"

**License:** Check each pack - look for "CC0 Public Domain"

**File format:** WAV (perfect!)

---

## Phase 2: File Organization (15 min)

### Create Directory Structure

```bash
mkdir -p downloads/source
mkdir -p downloads/sliced
mkdir -p public/loops/{trap,house,lofi,edm,techno}
```

### Move Downloaded Files

```bash
# Move all downloaded files to source folder
mv ~/Downloads/*.mp3 downloads/source/
mv ~/Downloads/*.wav downloads/source/
mv ~/Downloads/*.flac downloads/source/
```

---

## Phase 3: Slicing Loops (30-45 min)

### Option A: Use Audacity (Free, Easy)

**Install:** https://www.audacityteam.org

**Steps:**
1. Open track in Audacity
2. **Analyze > Beat Finder** to detect tempo
3. Use **Grid** (View > Show Grid) set to bars
4. Select 4, 8, or 16 bar sections
5. **File > Export > Export Selected Audio**
   - Format: **WAV (Microsoft)**
   - Sample Rate: **44100 Hz**
   - Bit Depth: **16-bit**
6. Name: `{genre}_{role}_{bpm}.wav`
   - Example: `trap_drums_140.wav`

**Repeat for:**
- Drums sections (isolated percussion)
- Bass sections
- Melody/chord sections
- Atmospheric pads

---

### Option B: Use ffmpeg (Command Line, Fast)

**Install ffmpeg:**
```bash
# Mac
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

**Extract 4-bar loop (example at 140 BPM):**
```bash
# 4 bars at 140 BPM = 6.86 seconds
# Formula: (bars * 4) / (bpm / 60)

ffmpeg -i input.mp3 -ss 00:00:10 -t 6.86 -acodec pcm_s16le -ar 44100 trap_drums_140.wav
```

**Calculate duration:**
- 4 bars at 120 BPM: 8 seconds
- 4 bars at 140 BPM: 6.86 seconds
- 8 bars at 124 BPM: 15.48 seconds

**Batch process:**
```bash
#!/bin/bash
# Extract 8-second loops from multiple files

for file in downloads/source/*.mp3; do
  filename=$(basename "$file" .mp3)
  ffmpeg -i "$file" -ss 10 -t 8 -acodec pcm_s16le -ar 44100 "downloads/sliced/${filename}_loop.wav"
done
```

---

### Option C: Use a DAW (Ableton, FL Studio)

**Best for:**
- Time-stretching to exact BPM
- Isolating stems (drums/bass/melody)
- Adding effects before export

**Steps:**
1. Import track
2. Set project tempo to match
3. Warp/time-stretch if needed
4. Solo tracks/stems
5. Export 4/8/16 bar loops as WAV

---

## Phase 4: Naming Convention

### File Naming Format:
```
{genre}_{role}_{bpm}.wav
```

**Examples:**
- `trap_drums_140.wav`
- `trap_808_bass_140.wav`
- `house_chords_124.wav`
- `lofi_jazz_chords_85.wav`
- `techno_kick_132.wav`
- `edm_drop_bass_128.wav`

### Genres:
- `trap`, `house`, `lofi`, `edm`, `techno`, `dnb`, `ambient`

### Roles:
- `drums`, `bass`, `chords`, `melody`, `pad`, `fx`, `vocal`

### BPM:
- Use detected or estimated BPM
- Round to nearest integer

---

## Phase 5: Copy to Public Folder (5 min)

```bash
# Copy all sliced loops to public directory
cp downloads/sliced/trap_*.wav public/loops/trap/
cp downloads/sliced/house_*.wav public/loops/house/
cp downloads/sliced/lofi_*.wav public/loops/lofi/
cp downloads/sliced/edm_*.wav public/loops/edm/
cp downloads/sliced/techno_*.wav public/loops/techno/
```

---

## Phase 6: Update Loop Library JSON

Edit `src/lib/loops/starter-library.json` and add your loops:

```json
{
  "id": "loop_021",
  "path": "/loops/trap/trap_drums_140.wav",
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
  "name": "Dark Trap Drums"
}
```

**Tip:** Use this script to auto-generate metadata (coming soon!)

---

## V1 Target Library (20 Loops)

### Trap (5 loops @ 140 BPM)
- [ ] trap_drums_140.wav
- [ ] trap_808_bass_140.wav
- [ ] trap_pad_dark_140.wav
- [ ] trap_melody_pluck_140.wav
- [ ] trap_snare_roll_140.wav

### House (5 loops @ 124 BPM)
- [ ] house_drums_124.wav
- [ ] house_bass_124.wav
- [ ] house_chords_124.wav
- [ ] house_vocal_chop_124.wav
- [ ] house_riser_fx_124.wav

### Lo-fi (4 loops @ 85 BPM)
- [ ] lofi_drums_85.wav
- [ ] lofi_jazz_chords_85.wav
- [ ] lofi_bass_85.wav
- [ ] lofi_vinyl_fx_85.wav

### EDM (3 loops @ 128 BPM)
- [ ] edm_buildup_drums_128.wav
- [ ] edm_drop_bass_128.wav
- [ ] edm_synth_lead_128.wav

### Techno (3 loops @ 132 BPM)
- [ ] techno_kick_132.wav
- [ ] techno_bass_132.wav
- [ ] techno_atmosphere_132.wav

---

## Legal Checklist

Before adding any loop to RMXR:

- [ ] License is **CC0** or **Pixabay License** (no attribution needed)
- [ ] If CC-BY, attribution is added to metadata
- [ ] Source URL is documented in JSON
- [ ] No copyrighted samples (check comments/description)
- [ ] No trademarked sounds (brand jingles, etc.)

---

## Next Steps

1. **Download 5-10 tracks** from FreePD, FMA, Pixabay
2. **Slice into 4-8 bar loops** using Audacity or ffmpeg
3. **Organize into folders** by genre
4. **Update starter-library.json** with metadata
5. **Test in RMXR** - Generate an AI Mix!

**Estimated time:** 1-2 hours for 20 loops

---

## Resources

- FreePD: https://freepd.com
- FMA: https://freemusicarchive.org
- Pixabay: https://pixabay.com/music
- OpenGameArt: https://opengameart.org
- ProducerSpace: https://producerspace.com
- Audacity: https://www.audacityteam.org
- ffmpeg: https://ffmpeg.org

**Need help?** Check the RMXR Discord or open an issue!
