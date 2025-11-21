import { useState } from 'react'

type Props = {
  onLoadA: (file: File) => void
  onLoadB: (file: File) => void
}

type Track = {
  id: string
  name: string
  artist: string
  bpm: number
  key: string
  genre: string
  url?: string
}

export default function LibraryBrowser({ onLoadA, onLoadB }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('All')

  // Demo tracks/loops - All 9 local tracks
  const tracks: Track[] = [
    // WAV Demos
    { id: '1', name: 'Deep House Loop', artist: 'Demo', bpm: 124, key: 'Am', genre: 'House', url: '/loops/deep_house_124.wav' },
    { id: '2', name: 'Tech Groove', artist: 'Demo', bpm: 128, key: 'Em', genre: 'Techno', url: '/loops/tech_groove_128.wav' },
    { id: '3', name: 'Hip-Hop Beat', artist: 'Demo', bpm: 90, key: 'Gm', genre: 'Hip-Hop', url: '/loops/hiphop_beat_90.wav' },
    { id: '4', name: 'Lo-Fi Chill', artist: 'Demo', bpm: 80, key: 'Cm', genre: 'Lo-Fi', url: '/loops/lofi_chill_80.wav' },
    { id: '5', name: 'EDM Drop', artist: 'Demo', bpm: 128, key: 'C', genre: 'EDM', url: '/loops/edm_drop_128.wav' },
    // Bensound MP3s
    { id: '6', name: 'Jazzy Frenchy', artist: 'Bensound', bpm: 120, key: 'Dm', genre: 'Jazz', url: '/loops/bensound_jazzy.mp3' },
    { id: '7', name: 'Funky Suspense', artist: 'Bensound', bpm: 95, key: 'Em', genre: 'Funk', url: '/loops/bensound_funkysuspense.mp3' },
    { id: '8', name: 'Groovy Hip Hop', artist: 'Bensound', bpm: 90, key: 'Am', genre: 'Hip-Hop', url: '/loops/bensound_groovy.mp3' },
    { id: '9', name: 'Energy', artist: 'Bensound', bpm: 130, key: 'Gm', genre: 'EDM', url: '/loops/bensound_energy.mp3' },
  ]

  const genres = ['All', 'House', 'Techno', 'Hip-Hop', 'Lo-Fi', 'EDM', 'Jazz', 'Funk']

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const handleLoadTrack = async (track: Track, deck: 'A' | 'B') => {
    if (!track.url) return

    try {
      const response = await fetch(track.url)
      const blob = await response.blob()
      const file = new File([blob], `${track.name}.mp3`, { type: 'audio/mpeg' })

      if (deck === 'A') {
        onLoadA(file)
      } else {
        onLoadB(file)
      }
    } catch (error) {
      console.error('Error loading track:', error)
    }
  }

  // Genre color mapping
  const genreColors: Record<string, string> = {
    'House': 'from-purple-500 to-pink-500',
    'Techno': 'from-blue-500 to-cyan-500',
    'Hip-Hop': 'from-orange-500 to-red-500',
    'Lo-Fi': 'from-green-500 to-teal-500',
    'EDM': 'from-yellow-500 to-orange-500',
    'Jazz': 'from-indigo-500 to-purple-500',
    'Funk': 'from-pink-500 to-rose-500',
  }

  const getGenreColor = (genre: string) => {
    return genreColors[genre] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="flex-1 flex flex-col bg-ink overflow-hidden">
      {/* Library Header */}
      <div className="px-6 py-4 border-b border-line bg-surface shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Library</h2>
          <span className="text-sm text-muted">{filteredTracks.length} tracks</span>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks..."
            className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accentFrom/50 focus:border-accentFrom transition-smooth"
          />
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="px-6 py-3 border-b border-line bg-surface flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-xs text-muted font-semibold uppercase tracking-wider mr-2 shrink-0">
          Genre:
        </span>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-accentFrom to-accentTo text-ink border-transparent'
                : 'border border-line text-muted hover:border-line/50 hover:bg-white/5'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Track Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-16 text-muted">
            No tracks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map(track => (
              <div
                key={track.id}
                className="rounded-xl border border-line bg-surface p-4 hover:border-line/50 transition-all group"
              >
                {/* Genre Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold bg-gradient-to-r ${getGenreColor(track.genre)} text-white`}>
                    {track.genre}
                  </span>
                </div>

                {/* Track Info */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-text mb-1 truncate">
                    {track.name}
                  </h3>
                  <p className="text-sm text-muted">{track.artist}</p>
                </div>

                {/* Metadata Pills */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-md bg-ink border border-line text-xs font-mono text-text">
                    {track.bpm} BPM
                  </span>
                  <span className="px-2 py-1 rounded-md bg-ink border border-line text-xs font-mono text-text">
                    {track.key}
                  </span>
                </div>

                {/* Always-visible Load Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadTrack(track, 'A')}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-accentFrom/20 to-accentTo/20 hover:from-accentFrom hover:to-accentTo border border-accentFrom/30 hover:border-transparent text-accentFrom hover:text-ink text-xs font-bold transition-all hover:shadow-neon-cyan"
                  >
                    → Deck A
                  </button>
                  <button
                    onClick={() => handleLoadTrack(track, 'B')}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-accentFrom/20 to-accentTo/20 hover:from-accentFrom hover:to-accentTo border border-accentFrom/30 hover:border-transparent text-accentFrom hover:text-ink text-xs font-bold transition-all hover:shadow-neon-cyan"
                  >
                    → Deck B
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
