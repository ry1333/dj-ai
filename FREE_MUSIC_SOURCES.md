# Free Music Sources for DJ Studio Testing

## 🎵 Best Sources for Legal, Free Music

### 1. **Free Music Archive (FMA)** ⭐ BEST FOR DJ TESTING
**URL:** https://freemusicarchive.org/
- **License:** CC BY (attribution), CC0 (public domain)
- **Genres:** House, Techno, Hip-Hop, EDM, Lo-Fi
- **Format:** MP3, high quality
- **Filter:** Search by genre + "Creative Commons"
- **Direct Download:** Yes ✅

**Recommended Searches:**
- "house creative commons"
- "techno royalty free"
- "hip hop instrumental"
- "edm loop"

### 2. **ccMixter** ⭐ GREAT FOR LOOPS & STEMS
**URL:** https://ccmixter.org/
- **License:** CC BY (most)
- **Perfect for:** Remixing, DJ mixing
- **Stems Available:** Yes (vocals, drums, bass separate)
- **Format:** MP3, WAV
- **Community:** Active remix culture

**Browse:**
- Instrumental tracks: https://ccmixter.org/view/media/samples/browse
- DJ-friendly: Filter by "Instrumentals"

### 3. **Incompetech (Kevin MacLeod)** ⭐ CONSISTENT QUALITY
**URL:** https://incompetech.com/music/royalty-free/
- **License:** CC BY 4.0 (just credit him)
- **Genres:** All genres, curated
- **BPM Listed:** Yes! (perfect for DJ mixing)
- **Format:** MP3
- **Search by:** Genre, BPM, mood

**Direct Links:**
- Electronic: https://incompetech.com/music/royalty-free/music.html?genre=Electronic
- By BPM: Can sort by tempo

### 4. **Bensound**
**URL:** https://www.bensound.com/
- **License:** Free with attribution
- **Quality:** Professional production
- **Genres:** Electronic, Hip-Hop, Chill
- **Format:** MP3
- **Download:** Direct download available

### 5. **YouTube Audio Library**
**URL:** https://studio.youtube.com/channel/UC.../music (need YT account)
- **License:** Free to use (varies, check each)
- **Quality:** High
- **Genres:** All
- **Filter by:** Genre, mood, instrument, duration

### 6. **SoundCloud - Creative Commons Filter**
**URL:** https://soundcloud.com/search/sounds?filter.license=to_share
- **License:** CC BY, CC BY-SA
- **Genres:** Everything
- **Quality:** Varies (check 320kbps)
- **Community:** Huge selection

**Search Tips:**
- Add "creative commons" to search
- Filter: License → "To share"
- Look for 320kbps files

### 7. **Internet Archive - Audio**
**URL:** https://archive.org/details/audio
- **License:** Public domain, CC
- **Collection:** Netlabels, Live Music Archive
- **Format:** MP3, FLAC, OGG
- **Download:** Always free

**Recommended Collections:**
- Netlabels: https://archive.org/details/netlabels
- Covering the Bases: https://archive.org/details/coveringthebases

### 8. **Jamendo Music**
**URL:** https://www.jamendo.com/
- **License:** Free for personal use
- **Quality:** Professional artists
- **Genres:** All
- **Download:** Direct MP3

---

## 🎛️ Quick Test Tracks (Direct Downloads)

### For House (120-128 BPM):
1. **Free Music Archive** - Search "house instrumental 124"
   - Example: https://freemusicarchive.org/genre/Electronic

2. **ccMixter** - House category
   - Browse: https://ccmixter.org/view/media/home

### For Hip-Hop (80-100 BPM):
1. **Incompetech** - Hip Hop section
   - Direct: https://incompetech.com/music/royalty-free/music.html?genre=Hip%20Hop

### For Techno (125-135 BPM):
1. **Free Music Archive** - Techno tag
   - Search: "techno 128 bpm"

---

## 🚀 Quick Setup Script

I'll create a script to download some test tracks for you:

### Option A: Manual Download (Recommended)
1. Go to Free Music Archive
2. Search "electronic instrumental"
3. Filter by "Creative Commons"
4. Download 5-10 tracks
5. Save to `/public/loops/` in your project

### Option B: Use Existing Public Domain Tracks
Let me find some direct CDN links...

---

## 📥 Direct Download Links (Public Domain)

### House Tracks:
```
https://freemusicarchive.org/file/music/KBOO/Kai_Engel/Chapter_Four_Fall/Kai_Engel_-_05_-_Irsen_s_Tale.mp3
```

### Chill/Lo-Fi:
```
https://freemusicarchive.org/file/music/Oddio_Overplay/Ryan_Andersen/Wanderer/Ryan_Andersen_-_02_-_Wanderer.mp3
```

### Electronic:
```
https://freemusicarchive.org/file/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3
```

---

## 🎯 Recommended Workflow for Your DJ App

### Step 1: Download 10 Test Tracks
```bash
cd /public/loops/

# House (120-128 BPM)
curl -o house_1.mp3 "https://freemusicarchive.org/[URL]"
curl -o house_2.mp3 "https://freemusicarchive.org/[URL]"

# Techno (128 BPM)
curl -o techno_1.mp3 "https://freemusicarchive.org/[URL]"

# Hip-Hop (90 BPM)
curl -o hiphop_1.mp3 "https://freemusicarchive.org/[URL]"

# Lo-Fi (80 BPM)
curl -o lofi_1.mp3 "https://freemusicarchive.org/[URL]"
```

### Step 2: Add to Supabase
```sql
-- Insert into posts table
INSERT INTO posts (user_id, audio_url, caption, bpm, style, key)
VALUES
  (NULL, '/loops/house_1.mp3', 'Deep House Groove', 124, 'House', 'Am'),
  (NULL, '/loops/techno_1.mp3', 'Dark Techno', 128, 'Techno', 'Em');
```

### Step 3: Test in DJ Studio
1. Go to `/dj`
2. Click "Library" tab on Deck A
3. Select a track → Loads instantly
4. Repeat for Deck B
5. Mix and record!

---

## ⚠️ License Compliance

When using free music, **always**:
1. ✅ Check the specific license (CC BY, CC0, etc.)
2. ✅ Provide attribution if required
3. ✅ Don't claim you made it
4. ✅ Include artist credit in your app

### Attribution Format:
```
"Track Name" by Artist Name
Licensed under CC BY 4.0
https://freemusicarchive.org/...
```

You can add this to your `posts` table:
```sql
ALTER TABLE posts ADD COLUMN attribution TEXT;
```

---

## 🔥 Pro Tip: Bulk Download Script

Want to download a bunch of tracks at once? I can create a script for you!

Let me know which genre/BPM range you want, and I'll find the best tracks.

---

## 📊 Summary

**Best for immediate testing:**
1. Free Music Archive (freemusicarchive.org) ⭐
2. ccMixter (ccmixter.org)
3. Incompetech (incompetech.com)

**Next steps:**
1. Pick 5-10 tracks from FMA
2. Download to `/public/loops/`
3. Add metadata to Supabase `posts` table
4. Test loading in DJ Studio
5. Try recording a mix!

Want me to:
- [ ] Create a download script for specific tracks?
- [ ] Set up automatic Supabase seeding?
- [ ] Find tracks in specific BPM ranges?

Let me know! 🎵
