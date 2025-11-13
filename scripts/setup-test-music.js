/**
 * Setup Test Music for DJ Studio
 * Downloads free, legal CC-licensed tracks from reliable sources
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOOPS_DIR = path.join(__dirname, '../public/loops');

// Ensure loops directory exists
if (!fs.existsSync(LOOPS_DIR)) {
  fs.mkdirSync(LOOPS_DIR, { recursive: true });
}

// Free Music Archive tracks (CC BY/CC0)
// Using direct download links from FMA API
const TEST_TRACKS = [
  {
    name: 'house_groove_124.mp3',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Chapter_Four_-_Fall/Kai_Engel_-_05_-_Irsens_Tale.mp3',
    bpm: 124,
    genre: 'House',
    artist: 'Kai Engel',
    title: "Irsen's Tale",
    license: 'CC BY 4.0'
  },
  {
    name: 'techno_minimal_128.mp3',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    bpm: 128,
    genre: 'Techno',
    artist: 'Tours',
    title: 'Enthusiast',
    license: 'CC BY 3.0'
  },
  {
    name: 'lofi_chill_85.mp3',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/blocSonic/Ryan_Andersen/Wanderer/Ryan_Andersen_-_02_-_Wanderer.mp3',
    bpm: 85,
    genre: 'Lo-Fi',
    artist: 'Ryan Andersen',
    title: 'Wanderer',
    license: 'CC BY 4.0'
  },
  {
    name: 'hiphop_jazzy_90.mp3',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Jahzzar/Travellers_Guide/Jahzzar_-_05_-_Comedie.mp3',
    bpm: 90,
    genre: 'Hip-Hop',
    artist: 'Jahzzar',
    title: 'Comedie',
    license: 'CC BY-SA 4.0'
  },
  {
    name: 'edm_uplifting_128.mp3',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Oddio_Overplay/Monplaisir/Heat_of_the_Summer/Monplaisir_-_05_-_Cruisin.mp3',
    bpm: 128,
    genre: 'EDM',
    artist: 'Monplaisir',
    title: 'Cruisin',
    license: 'CC BY-SA 4.0'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function downloadTracks() {
  console.log('🎵 Downloading test tracks for DJ Studio...\n');

  const metadata = [];

  for (const track of TEST_TRACKS) {
    const destPath = path.join(LOOPS_DIR, track.name);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(`✓ ${track.name} (already exists)`);
      metadata.push({
        fileName: track.name,
        path: `/loops/${track.name}`,
        ...track
      });
      continue;
    }

    try {
      console.log(`📥 Downloading ${track.name}...`);
      await downloadFile(track.url, destPath);
      console.log(`✅ ${track.name} (${track.artist} - ${track.title})`);

      metadata.push({
        fileName: track.name,
        path: `/loops/${track.name}`,
        ...track
      });
    } catch (error) {
      console.error(`❌ Failed to download ${track.name}:`, error.message);
    }
  }

  // Save metadata file
  const metadataPath = path.join(LOOPS_DIR, 'tracks.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log('\n✅ Download complete!\n');
  console.log('📂 Files saved to: public/loops/');
  console.log('📝 Metadata saved to: public/loops/tracks.json\n');
  console.log('🎛️  Next steps:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Go to /dj');
  console.log('3. Upload these tracks or load from library');
  console.log('4. Start mixing!\n');
  console.log('📄 License info:');
  metadata.forEach(t => {
    console.log(`   ${t.title} by ${t.artist} - ${t.license}`);
  });
  console.log('\n⚠️  Remember to credit artists if publishing mixes publicly!\n');
}

// Run the script
downloadTracks().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
