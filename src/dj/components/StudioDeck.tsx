import { useRef } from 'react'
import { Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDJ, type DeckID } from '../store'
import { CircularPlatter } from './CircularPlatter'
import { DeckTrackBrowser } from './DeckTrackBrowser'

interface StudioDeckProps {
  id: DeckID
}

export function StudioDeck({ id }: StudioDeckProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deck = useDJ((state) => state.decks[id])
  const { load, play, pause, setPitch } = useDJ()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await load(id, file)
      } catch (error) {
        console.error('Failed to load file:', error)
      }
    }
  }

  const handlePlayPause = () => {
    if (deck.playing) {
      pause(id)
    } else {
      play(id)
    }
  }

  const handleLoadTrack = (track: any) => {
    // TODO: Implement loading track from library
    console.log('Load track:', track)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const gradientColor = id === 'A' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-blue-500'
  const borderColor = id === 'A' ? 'border-pink-500/30' : 'border-cyan-400/30'
  const bgColor = id === 'A' ? 'bg-pink-500/5' : 'bg-cyan-400/5'

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Section: Platter, Loop Controls, Waveform */}
      <div className={`rounded-2xl border ${borderColor} ${bgColor} p-6 backdrop-blur-sm`}>
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Circular Platter */}
          <div className="flex flex-col items-center gap-4">
            {/* Deck Label */}
            <div className="flex items-center justify-between w-full">
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
                {id}
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:bg-surface text-sm font-medium text-text transition-all"
              >
                <Upload className="w-4 h-4" />
                Load Track
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Circular Platter */}
            <CircularPlatter
              id={id}
              playing={deck.playing}
              loaded={deck.loaded}
              position={deck.position}
              duration={deck.duration}
              onPlayPause={handlePlayPause}
            />

            {/* Track Info */}
            {deck.loaded && (
              <div className="w-full space-y-2">
                <div className="text-sm font-medium text-text text-center truncate">
                  {deck.filename || 'Unknown Track'}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-mono">{formatTime(deck.position)}</span>
                  <span className="font-mono">{formatTime(deck.duration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Loop Section & Waveform */}
          <div className="flex flex-col gap-4">
            {/* Loop Section Button */}
            <div className="rounded-xl border border-line bg-surface/30 p-4">
              <button className={`w-full py-2 rounded-lg bg-gradient-to-r ${gradientColor} text-ink font-semibold hover:scale-105 transition-transform`}>
                Loop section
              </button>

              {/* Loop pagination */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button className="p-1 rounded hover:bg-surface">
                  <ChevronLeft className="w-4 h-4 text-muted" />
                </button>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      num === 2 ? 'bg-surface text-text' : 'text-muted hover:bg-surface/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button className="p-1 rounded hover:bg-surface">
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>
              </div>
            </div>

            {/* Waveform placeholder */}
            <div className="flex-1 rounded-xl border border-line bg-surface/20 p-4 flex items-center justify-center">
              <div className="text-xs text-muted">Waveform visualization</div>
            </div>

            {/* Transport controls */}
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 rounded-lg border border-line hover:bg-surface text-sm font-medium text-text transition-all">
                Cue
              </button>
              <button className="py-2 rounded-lg border border-line hover:bg-surface text-sm font-medium text-text transition-all">
                Sync
              </button>
              <button className="py-2 rounded-lg border border-line hover:bg-surface text-sm font-medium text-text transition-all">
                ...
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Track Info & Library Browser */}
      <div className={`rounded-xl border ${borderColor} ${bgColor} p-4 backdrop-blur-sm`}>
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 items-center mb-3 pb-3 border-b border-line/30">
          {/* Album art placeholder */}
          <div className="w-12 h-12 rounded-lg bg-surface border border-line flex items-center justify-center">
            <div className={`text-xl font-bold bg-gradient-to-br ${gradientColor} bg-clip-text text-transparent`}>
              {id}
            </div>
          </div>

          {/* Track Title */}
          <div>
            <div className="text-sm font-semibold text-text">
              {deck.loaded ? deck.filename || 'Track Title' : 'Loads title'}
            </div>
            <div className="text-xs text-muted">
              {deck.loaded ? `${deck.bpm.toFixed(1)} BPM` : 'No track loaded'}
            </div>
          </div>

          {/* BPM and Key pills */}
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-full bg-surface text-xs font-semibold text-text">
              BPM {deck.loaded ? deck.bpm.toFixed(1) : '0.0'}
            </div>
            <div className="px-3 py-1 rounded-full bg-surface text-xs font-semibold text-text">
              Key {deck.loaded ? 'A' : '-'}
            </div>
          </div>

          {/* Length */}
          <div className="text-sm font-mono text-text">
            {deck.loaded ? formatTime(deck.duration) : '00:00'}
          </div>
        </div>

        {/* Track Browser */}
        <DeckTrackBrowser
          deckId={id}
          onLoadTrack={handleLoadTrack}
          currentTrack={deck.filename}
        />
      </div>
    </div>
  )
}
