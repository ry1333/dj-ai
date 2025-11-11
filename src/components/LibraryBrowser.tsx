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

  // Demo tracks/loops
  const tracks: Track[] = [
    { id: '1', name: 'Deep House Loop', artist: 'RMXR', bpm: 124, key: 'Am', genre: 'House', url: '/loops/demo_loop.mp3' },
    { id: '2', name: 'Tech Groove', artist: 'RMXR', bpm: 128, key: 'Dm', genre: 'Techno', url: '/loops/demo_loop.mp3' },
    { id: '3', name: 'Hip-Hop Beat', artist: 'RMXR', bpm: 90, key: 'C', genre: 'Hip-Hop', url: '/loops/demo_loop.mp3' },
    { id: '4', name: 'Lo-Fi Chill', artist: 'RMXR', bpm: 80, key: 'G', genre: 'Lo-Fi', url: '/loops/demo_loop.mp3' },
    { id: '5', name: 'EDM Drop', artist: 'RMXR', bpm: 128, key: 'Em', genre: 'EDM', url: '/loops/demo_loop.mp3' },
  ]

  const genres = ['All', 'House', 'Techno', 'Hip-Hop', 'Lo-Fi', 'EDM']

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

  return (
    <div className="h-full flex flex-col bg-zinc-950/60">
      {/* Library Header */}
      <div className="px-6 py-3 border-b border-zinc-800/60 flex items-center gap-4">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Library</div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks..."
            className="w-full bg-black/50 border border-zinc-800/60 rounded-lg px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Genre Filter - Narrower */}
        <div className="w-24 border-r border-zinc-800/60 bg-zinc-950/80 p-3 space-y-1 overflow-y-auto">
          <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Genre</div>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all ${
                selectedGenre === genre
                  ? 'bg-purple-900/30 text-purple-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Center: Track List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-zinc-950/95 border-b border-zinc-800/60 backdrop-blur-sm">
              <tr className="text-[10px] text-zinc-600 uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Track</th>
                <th className="text-left px-4 py-3 font-semibold">Artist</th>
                <th className="text-center px-4 py-3 font-semibold">BPM</th>
                <th className="text-center px-4 py-3 font-semibold">Key</th>
                <th className="text-center px-6 py-3 font-semibold w-32">Load</th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-zinc-600 text-sm">
                    No tracks found
                  </td>
                </tr>
              ) : (
                filteredTracks.map(track => (
                  <tr key={track.id} className="group border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-3 text-sm text-zinc-300">{track.name}</td>
                    <td className="px-4 py-3 text-sm text-zinc-500">{track.artist}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono text-zinc-400">{track.bpm}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono text-zinc-400">{track.key}</td>
                    <td className="px-6 py-3">
                      {/* Hover-only action chips */}
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleLoadTrack(track, 'A')}
                          title="Load to Deck A"
                          className="px-3 py-1 rounded-md bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 text-[11px] font-semibold transition-all border border-orange-800/30"
                        >
                          → A
                        </button>
                        <button
                          onClick={() => handleLoadTrack(track, 'B')}
                          title="Load to Deck B"
                          className="px-3 py-1 rounded-md bg-red-900/30 hover:bg-red-900/50 text-red-400 text-[11px] font-semibold transition-all border border-red-800/30"
                        >
                          → B
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footer - Simplified */}
      <div className="px-6 py-2 border-t border-zinc-800/60 bg-zinc-950/80 text-[10px] text-zinc-600 flex items-center justify-between">
        <span>{filteredTracks.length} tracks</span>
        <span className="text-zinc-700">Hover row to load</span>
      </div>
    </div>
  )
}
