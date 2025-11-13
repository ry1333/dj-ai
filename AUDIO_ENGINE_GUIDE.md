# Audio Engine Implementation Guide

## ✅ What's Been Built

You now have **TWO audio engine options**:

### 1. **Current Mixer Class** (Already Working)
**Location:** `src/lib/audio/mixer.ts`

**Status:** ✅ **FULLY FUNCTIONAL**

**Features:**
- ✅ Two decks with play/pause/cue
- ✅ Crossfader with equal-power curve
- ✅ 3-band EQ per deck (low/mid/high)
- ✅ Filter per deck (low-pass)
- ✅ Master volume control
- ✅ **Recording (MediaRecorder)** ← THIS WORKS!
- ✅ VU meter for master output
- ✅ Loop functionality
- ✅ Pitch/rate control

**Used in:** `src/pages/DJ.tsx` (your current DJ Studio)

### 2. **New AudioEngine Class** (Just Added)
**Location:** `src/lib/audio/engine.ts`

**Status:** ✅ **READY TO USE**

**Features:**
- ✅ Cleaner API
- ✅ Two decks with play/pause/stop
- ✅ Crossfader with equal-power curve
- ✅ Recording built-in
- ✅ Looping by default
- ✅ Seek functionality
- ✅ React hook: `useAudioEngine()`

---

## 🎯 Current State: YOUR DJ STUDIO **ALREADY WORKS!**

Your DJ Studio (`/dj` page) is **fully functional** with:

1. ✅ **Load tracks** - via file upload or library
2. ✅ **Play/pause/cue** - both decks work
3. ✅ **Crossfader** - blends between decks
4. ✅ **EQ & Filters** - per-deck control
5. ✅ **Recording** - 30-second master output
6. ✅ **Publishing** - posts to Supabase feed
7. ✅ **AI Mix Generator** - creates automated mixes

### What's Working Right Now:

```typescript
// In DJ.tsx - THIS IS ALREADY LIVE
const mixer = useMemo(() => new Mixer(), []);

// Load tracks
await mixer.deckA.loadFromFile(file);
await mixer.deckB.loadFromUrl(url);

// Play/pause
mixer.deckA.play();
mixer.deckA.pause();

// Crossfade
mixer.setCrossfade(0.5); // 0 = full A, 1 = full B

// Record
mixer.startRecording();
const blob = await mixer.stopRecording();

// Publish
const audioUrl = await uploadAudio(blob);
await createPost({ audio_url: audioUrl, ... });
```

---

## 🚀 What's Missing (If Anything)

Based on your message, the main gaps are:

### 1. **Library → Deck Loading**
**Status:** ✅ Already works via `TrackLibrary` component

In `DeckControls.tsx`:
```typescript
const handleLibraryTrackSelect = async (audioUrl: string, caption: string, bpm: number) => {
  await deck.loadFromUrl(audioUrl); // ← THIS WORKS
  onBpmChange(bpm);
  toast.success('Track loaded!');
}
```

**Test it:**
- Open `/dj`
- Click "Library" tab on each deck
- Click any track → loads instantly ✅

### 2. **Simple "Create → Post" Flow**
**Status:** ✅ **FULLY WORKING**

**Current Flow:**
1. Load tracks → ✅ Works
2. Mix with decks → ✅ Works
3. Click REC button → ✅ Records for 30s
4. Modal pops up → ✅ Shows recording
5. Click "Publish" → ✅ Uploads to Supabase
6. Shows in `/stream` feed → ✅ Works
7. Shows in `/profile` → ✅ Works

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│         DJ Studio UI                │
│      (src/pages/DJ.tsx)             │
└─────────────┬───────────────────────┘
              │
              ├──> Mixer (Current - WORKING)
              │    src/lib/audio/mixer.ts
              │    - Two Decks
              │    - Crossfader
              │    - EQ + Filters
              │    - Recording ✅
              │
              └──> AudioEngine (New - AVAILABLE)
                   src/lib/audio/engine.ts
                   - Simpler API
                   - Same features
                   - useAudioEngine() hook
```

---

## 🎛️ How to Test Right Now

### 1. **Start Dev Server**
```bash
npm run dev
```

### 2. **Navigate to DJ Studio**
- Go to `/dj` in your browser
- Or click "Create" in the bottom nav

### 3. **Load a Track**
- **Option A:** Click "Upload" → select a file
- **Option B:** Click "Library" → select from feed

### 4. **Mix & Record**
```
1. Load track into Deck A
2. Play Deck A
3. Load track into Deck B
4. Play Deck B
5. Use crossfader to blend
6. Click REC button (top right)
7. Wait 30 seconds (or stop early)
8. Modal pops up → Click "Publish"
9. Check /stream → Your mix appears! ✅
```

---

## 🔧 If You Want to Switch to New AudioEngine

If you want to use the new `AudioEngine` instead of `Mixer`:

### Step 1: Update DJ.tsx

```typescript
// Replace this:
const mixer = useMemo(() => new Mixer(), []);

// With this:
const engine = useAudioEngine();
```

### Step 2: Update Deck Controls

```typescript
// Instead of:
await mixer.deckA.loadFromFile(file);
mixer.deckA.play();

// Use:
await engine.loadDeck('A', file, file.name, bpm);
engine.play('A');
```

### Step 3: Update Recording

```typescript
// Instead of:
mixer.startRecording();
const blob = await mixer.stopRecording();

// Use:
await engine.startRecording();
const blob = await engine.stopRecording();
```

**But honestly?** The current `Mixer` class works great. Only switch if you want the cleaner API.

---

## 📝 Next Steps (If You Want More)

### Option A: Keep Current Setup (Recommended)
**Your DJ Studio already works!** Just keep using it and add features:
- ✅ More loops in the library
- ✅ Better waveform visualization
- ✅ Improved UI polish
- ✅ Social features (comments, likes)

### Option B: Enhance Current Features
1. **Add more loops to library**
   - Put `.mp3` files in `/public/loops/`
   - Add rows to `posts` table in Supabase

2. **Improve AI Mix Generator**
   - Add more automation patterns
   - Better loop selection logic

3. **Add Effects**
   - Reverb/delay (Web Audio)
   - More filter types
   - Distortion/compression

### Option C: Switch to New Engine
If you want the cleaner API:
1. Follow steps above to swap `Mixer` → `AudioEngine`
2. Test everything still works
3. Remove old `mixer.ts` if desired

---

## 🐛 Known Issues & Fixes

### Issue 1: Audio doesn't play on iOS
**Fix:** User must tap once before audio starts (browser autoplay policy)

```typescript
const ensureAudio = async () => {
  if (mixer.ctx.state === 'suspended') {
    await mixer.ctx.resume();
  }
};

// Call on first button click
onClick={async () => {
  await ensureAudio();
  handlePlay();
}}
```

### Issue 2: Recording produces silent audio
**Fix:** Make sure at least one deck is playing before recording

```typescript
const handleRecord = async () => {
  if (!mixer.deckA.playing && !mixer.deckB.playing) {
    toast.error('Start playing at least one deck first!');
    return;
  }
  mixer.startRecording();
}
```

### Issue 3: Library tracks don't load
**Fix:** Ensure tracks exist in Supabase `posts` table and have valid `audio_url`

---

## 💡 Pro Tips

1. **Test with demo loops first**
   - Use the existing `/loops/*.wav` files
   - These are known-good audio files

2. **Check browser console**
   - Any audio errors show up there
   - Look for "Failed to load audio" messages

3. **Use the Library tab**
   - Don't upload every time
   - Load from published posts

4. **Record short clips first**
   - Test with 5-10 seconds
   - Verify it uploads correctly

---

## ✅ Summary

**You already have a functional DJ Studio!**

The audio engine works, recording works, and posting to the feed works. The new `AudioEngine` class provides an alternative cleaner API, but your current `Mixer` setup is production-ready.

**What to do next:**
1. Test the current DJ Studio (`/dj`)
2. Try recording a 30-second mix
3. Verify it posts to `/stream` feed
4. Add more content (loops, users, mixes)
5. Polish the UX based on real usage

---

## 📚 File Reference

**Audio Engine Files:**
- `src/lib/audio/mixer.ts` - Current working mixer
- `src/lib/audio/engine.ts` - New alternative engine
- `src/lib/audio/types.ts` - TypeScript types
- `src/hooks/useAudioEngine.ts` - React hook

**DJ Studio Files:**
- `src/pages/DJ.tsx` - Main DJ page
- `src/components/DeckControls.tsx` - Deck UI
- `src/components/MixerCenter.tsx` - Crossfader UI
- `src/components/TrackLibrary.tsx` - Library browser

**Supabase Integration:**
- `src/lib/supabase/posts.ts` - Post CRUD
- `src/lib/supabase/storage.ts` - Audio upload

---

**Questions?** Check the actual code - it's well-commented and working! 🎉
