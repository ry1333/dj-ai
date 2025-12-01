import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type DeckID } from '../store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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

const GENRES = ['Deep House', 'Techno', 'Lo-Fi', 'Hip-Hop', 'EDM', 'Jazz']

export function DeckTrackBrowser({ deckId, onLoadTrack, currentTrack }: DeckTrackBrowserProps) {
  const [page, setPage] = useState(1)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState('Deep House')
  const [tracks] = useState<Track[]>(MOCK_TRACKS)

  const borderColor = deckId === 'A' ? 'border-pink-500/30' : 'border-cyan-400/30'
  const bgColor = deckId === 'A' ? 'bg-pink-500/5' : 'bg-cyan-400/5'
  const activeColor = deckId === 'A' ? 'bg-pink-500/20 border-pink-500' : 'bg-cyan-400/20 border-cyan-400'

  const handleLoadDeck = (deckLetter: 'A' | 'B') => {
    const selectedTrack = tracks.find(t => t.id === selectedTrackId)
    if (selectedTrack) {
      onLoadTrack(selectedTrack)
    }
  }

  return (
    <Card className={`${borderColor} ${bgColor} backdrop-blur-sm`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Genre Filter using ToggleGroup */}
            <ToggleGroup
              type="single"
              value={selectedGenre}
              onValueChange={(value) => value && setSelectedGenre(value)}
              className="border border-line rounded-lg overflow-hidden"
            >
              {GENRES.map((genre) => (
                <ToggleGroupItem
                  key={genre}
                  value={genre}
                  className="px-3 py-1.5 text-xs font-medium data-[state=on]:bg-surface data-[state=on]:text-text data-[state=off]:bg-transparent data-[state=off]:text-muted hover:bg-surface/50 rounded-none border-0"
                >
                  {genre}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="w-7 h-7 p-0"
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.min(3, page + 1))}
              disabled={page === 3}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
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
            <div className="text-center">Actions</div>
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
              <div className="text-sm text-text text-center">
                <Badge variant="outline" className="font-mono text-xs">
                  {track.bpm.toFixed(1)}
                </Badge>
              </div>
              <div className="text-sm text-text text-center">
                <Badge variant="secondary" className="text-xs">
                  {track.key}
                </Badge>
              </div>
              <div className="text-sm text-text text-center font-mono">{track.length}</div>
              <div className="flex gap-1 justify-end">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTrackId(track.id)
                    handleLoadDeck('A')
                  }}
                  className={`h-7 text-xs ${
                    deckId === 'A'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                      : 'bg-surface/50 hover:bg-surface text-text'
                  }`}
                >
                  Load A
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTrackId(track.id)
                    handleLoadDeck('B')
                  }}
                  className={`h-7 text-xs ${
                    deckId === 'B'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white'
                      : 'bg-surface/50 hover:bg-surface text-text'
                  }`}
                >
                  Load B
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
