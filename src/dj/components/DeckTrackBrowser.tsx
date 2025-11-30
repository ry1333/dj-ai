import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type DeckID } from '../store'

interface Track {
  id: string
  title: string
  bpm: number
  key: string
  length: string
  tags?: string[]
}

interface DeckTrackBrowserProps {
  deckId: DeckID
  onLoadTrack: (track: Track) => void
  currentTrack?: string
}

// Mock data - in production this would come from Supabase
const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Deep House', bpm: 188, key: 'A', length: '00:57', tags: ['Deep House'] },
  { id: '2', title: 'Deep House', bpm: 108, key: 'A', length: '00:28', tags: ['Deep House'] },
  { id: '3', title: 'Deep House', bpm: 199, key: 'B', length: '00:31', tags: ['Deep House'] },
  { id: '4', title: 'Deep House', bpm: 109, key: 'A', length: '00:22', tags: ['Deep House'] },
  { id: '5', title: 'Deep House', bpm: 100, key: 'A', length: '00:34', tags: ['Deep House'] },
]

export function DeckTrackBrowser({ deckId, onLoadTrack, currentTrack }: DeckTrackBrowserProps) {
  const [page, setPage] = useState(1)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [tracks] = useState<Track[]>(MOCK_TRACKS)

  const borderColor = deckId === 'A' ? 'border-pink-500/30' : 'border-cyan-400/30'
  const bgColor = deckId === 'A' ? 'bg-pink-500/5' : 'bg-cyan-400/5'
  const activeColor = deckId === 'A' ? 'bg-pink-500/20 border-pink-500' : 'bg-cyan-400/20 border-cyan-400'
  const buttonColor = deckId === 'A'
    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
    : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600'

  const handleLoadDeck = (deckLetter: 'A' | 'B') => {
    const selectedTrack = tracks.find(t => t.id === selectedTrackId)
    if (selectedTrack) {
      onLoadTrack(selectedTrack)
    }
  }

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-4 backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex border border-line rounded-lg overflow-hidden">
            {['Deep House', 'Techno', 'Lo-Fi', 'Hip-Hop', 'EDM', 'Jazz'].map((genre) => (
              <button
                key={genre}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  genre === 'Deep House'
                    ? 'bg-surface text-text'
                    : 'bg-transparent text-muted hover:bg-surface/50'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-line hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  page === p ? 'bg-surface text-text' : 'text-muted hover:bg-surface/50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(3, page + 1))}
            disabled={page === 3}
            className="p-1.5 rounded-lg border border-line hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-1">
        {/* Header row */}
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-3 px-3 py-1 text-xs font-medium text-muted border-b border-line/30">
          <div>Title</div>
          <div className="text-center">BPM</div>
          <div className="text-center">Key</div>
          <div className="text-center">Length</div>
          <div className="text-center">Tags</div>
        </div>

        {/* Track rows */}
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => setSelectedTrackId(track.id)}
            className={`grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${
              selectedTrackId === track.id
                ? activeColor
                : 'border-transparent hover:bg-surface/30'
            }`}
          >
            <div className="text-sm text-text truncate">{track.title}</div>
            <div className="text-sm text-text text-center font-mono">{track.bpm.toFixed(1)}</div>
            <div className="text-sm text-text text-center">{track.key}</div>
            <div className="text-sm text-text text-center font-mono">{track.length}</div>
            <div className="flex gap-1 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTrackId(track.id)
                  handleLoadDeck('A')
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  deckId === 'A' ? buttonColor : 'bg-surface/50 hover:bg-surface'
                } text-white transition-all`}
              >
                Load Deck A
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTrackId(track.id)
                  handleLoadDeck('B')
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  deckId === 'B' ? buttonColor : 'bg-surface/50 hover:bg-surface'
                } text-white transition-all`}
              >
                Load Deck B
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
