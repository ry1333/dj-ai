import { useState } from 'react'
import { Music, Play } from 'lucide-react'
import { toast } from 'sonner'

interface LocalTrack {
  fileName: string
  path: string
  bpm: number
  genre: string
  title: string
  artist: string
  key: string
  duration?: string
  license?: string
}

interface LocalTrackLibraryProps {
  onSelect: (audioUrl: string, caption: string, bpm: number) => void
}

// Local tracks from public/loops/
const LOCAL_TRACKS: LocalTrack[] = [
  {
    fileName: "deep_house_124.wav",
    path: "/loops/deep_house_124.wav",
    bpm: 124,
    genre: "House",
    title: "Deep House Loop",
    artist: "Demo",
    key: "Am",
    duration: "0:15"
  },
  {
    fileName: "tech_groove_128.wav",
    path: "/loops/tech_groove_128.wav",
    bpm: 128,
    genre: "Techno",
    title: "Tech Groove",
    artist: "Demo",
    key: "Em",
    duration: "0:15"
  },
  {
    fileName: "lofi_chill_80.wav",
    path: "/loops/lofi_chill_80.wav",
    bpm: 80,
    genre: "Lo-Fi",
    title: "Chill Beat",
    artist: "Demo",
    key: "Cm",
    duration: "0:15"
  },
  {
    fileName: "hiphop_beat_90.wav",
    path: "/loops/hiphop_beat_90.wav",
    bpm: 90,
    genre: "Hip-Hop",
    title: "Boom Bap",
    artist: "Demo",
    key: "Gm",
    duration: "0:15"
  },
  {
    fileName: "edm_drop_128.wav",
    path: "/loops/edm_drop_128.wav",
    bpm: 128,
    genre: "EDM",
    title: "Festival Drop",
    artist: "Demo",
    key: "C",
    duration: "0:15"
  },
  {
    fileName: "bensound_jazzy.mp3",
    path: "/loops/bensound_jazzy.mp3",
    bpm: 120,
    genre: "Jazz",
    title: "Jazzy Frenchy",
    artist: "Bensound",
    key: "Dm",
    duration: "1:44",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_funkysuspense.mp3",
    path: "/loops/bensound_funkysuspense.mp3",
    bpm: 95,
    genre: "Funk",
    title: "Funky Suspense",
    artist: "Bensound",
    key: "Em",
    duration: "3:15",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_groovy.mp3",
    path: "/loops/bensound_groovy.mp3",
    bpm: 90,
    genre: "Hip-Hop",
    title: "Groovy Hip Hop",
    artist: "Bensound",
    key: "Am",
    duration: "1:48",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_energy.mp3",
    path: "/loops/bensound_energy.mp3",
    bpm: 130,
    genre: "EDM",
    title: "Energy",
    artist: "Bensound",
    key: "Gm",
    duration: "2:15",
    license: "Free with attribution"
  }
];

export default function LocalTrackLibrary({ onSelect }: LocalTrackLibraryProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', ...Array.from(new Set(LOCAL_TRACKS.map(t => t.genre)))];

  const filteredTracks = selectedGenre === 'all'
    ? LOCAL_TRACKS
    : LOCAL_TRACKS.filter(t => t.genre === selectedGenre);

  const handleTrackClick = (track: LocalTrack) => {
    onSelect(
      track.path,
      `${track.title} - ${track.artist}`,
      track.bpm
    );
    toast.success(`Loading ${track.title}...`);
  };

  return (
    <div className="space-y-3">
      {/* Genre Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1 rounded-full border text-xs transition-colors whitespace-nowrap ${
              selectedGenre === genre
                ? 'border-zinc-500 bg-zinc-800 text-white shadow-lg'
                : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-500'
            }`}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {filteredTracks.map((track) => (
          <button
            key={track.fileName}
            onClick={() => handleTrackClick(track)}
            className="group w-full px-2 py-3 rounded-lg hover:bg-zinc-800/50 transition-colors border-l-2 border-transparent hover:border-cyan text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full text-cyan opacity-0 group-hover:opacity-100">•</div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-200">{track.title}</div>
                <div className="text-xs text-zinc-500">{track.artist}</div>
              </div>

              <div className="text-xs font-mono text-zinc-400">{track.bpm.toFixed(1)}</div>
              <div className="text-xs font-mono text-zinc-400 w-8">{track.key}</div>
              <div className="text-xs font-mono text-zinc-400">{track.duration || '0:15'}</div>
            </div>
          </button>
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Music className="w-12 h-12 text-muted/50 mb-2" />
          <p className="text-muted text-sm">No tracks in this genre</p>
        </div>
      )}
    </div>
  )
}
