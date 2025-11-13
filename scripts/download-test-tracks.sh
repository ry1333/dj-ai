#!/bin/bash

# Download Test Tracks for DJ Studio
# Free, legal music from Free Music Archive (CC BY/CC0)

echo "🎵 Downloading test tracks for DJ Studio..."
echo ""

# Create loops directory if it doesn't exist
mkdir -p public/loops

cd public/loops

echo "📥 Downloading House tracks (124 BPM)..."
curl -L -o "house_deep_124.mp3" "https://freemusicarchive.org/track/Kai_Engel_-_Irsens_Tale/download" 2>/dev/null || echo "⚠️  Track 1 failed"

echo "📥 Downloading Techno track (128 BPM)..."
curl -L -o "techno_dark_128.mp3" "https://freemusicarchive.org/track/Tours_-_Enthusiast/download" 2>/dev/null || echo "⚠️  Track 2 failed"

echo "📥 Downloading Chill/Lo-Fi (85 BPM)..."
curl -L -o "lofi_chill_85.mp3" "https://freemusicarchive.org/track/Ryan_Andersen_-_Wanderer/download" 2>/dev/null || echo "⚠️  Track 3 failed"

echo "📥 Downloading Hip-Hop beat (90 BPM)..."
curl -L -o "hiphop_beat_90.mp3" "https://freemusicarchive.org/track/Jahzzar_-_Comedie/download" 2>/dev/null || echo "⚠️  Track 4 failed"

echo "📥 Downloading EDM (128 BPM)..."
curl -L -o "edm_energy_128.mp3" "https://freemusicarchive.org/track/Monplaisir_-_Cruisin/download" 2>/dev/null || echo "⚠️  Track 5 failed"

cd ../..

echo ""
echo "✅ Download complete!"
echo ""
echo "📂 Files saved to: public/loops/"
echo ""
echo "🎛️  Next steps:"
echo "1. Start your dev server: npm run dev"
echo "2. Go to /dj in your browser"
echo "3. Click 'Upload' or 'Library' tab"
echo "4. Load tracks and start mixing!"
echo ""
echo "📝 Note: These tracks are licensed under Creative Commons"
echo "   Remember to credit artists if publishing mixes publicly"
echo ""
