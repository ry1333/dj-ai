import { useRef } from 'react'
import { Play, Pause, Square, Upload } from 'lucide-react'
import { useDJ, type DeckID } from '../store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface DeckProps {
  id: DeckID
}

export function Deck({ id }: DeckProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deck = useDJ((state) => state.decks[id])
  const { load, play, pause, stop, setPitch, setEQ } = useDJ()

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = deck.duration > 0 ? (deck.position / deck.duration) * 100 : 0

  // Convert pitch (0.8-1.2) to slider value (0-100)
  const pitchToSlider = (pitch: number) => ((pitch - 0.8) / 0.4) * 100
  const sliderToPitch = (value: number) => (value / 100) * 0.4 + 0.8

  const deckColor = id === 'A' ? 'pink' : 'cyan'

  return (
    <TooltipProvider>
      <Card className="border-line bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Deck {id}</CardTitle>
            <Badge
              variant={deck.playing ? 'default' : deck.loaded ? 'secondary' : 'outline'}
              className={
                deck.playing
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : deck.loaded
                  ? `bg-${deckColor}-500/20 text-${deckColor}-400 border-${deckColor}-500/30`
                  : ''
              }
            >
              {deck.playing ? 'PLAYING' : deck.loaded ? 'LOADED' : 'EMPTY'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Platter / Artwork */}
          <div className="aspect-square rounded-xl border border-line bg-surface/50 flex items-center justify-center relative overflow-hidden">
            {deck.loaded ? (
              <>
                {/* Vinyl record visual */}
                <div className={`absolute inset-0 bg-gradient-to-br from-surface via-ink to-surface ${
                  deck.playing ? 'animate-vinyl-spin' : ''
                }`}>
                  {/* Grooves */}
                  <div className="absolute inset-4 rounded-full border-2 border-line/30" />
                  <div className="absolute inset-8 rounded-full border-2 border-line/30" />
                  <div className="absolute inset-12 rounded-full border-2 border-line/30" />

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                      id === 'A' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-blue-500'
                    } flex items-center justify-center text-black font-bold text-sm`}>
                      DECK<br/>{id}
                    </div>
                  </div>
                </div>

                {/* Progress overlay */}
                {deck.playing && (
                  <div className={`absolute inset-0 ${id === 'A' ? 'bg-pink-500/10' : 'bg-cyan-400/10'} animate-pulse-ring pointer-events-none`} />
                )}
              </>
            ) : (
              <div className="text-center space-y-3">
                <Upload className="w-12 h-12 text-muted mx-auto" strokeWidth={1.5} />
                <p className="text-muted text-sm">No track loaded</p>
              </div>
            )}
          </div>

          {/* Track Info */}
          {deck.loaded && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-text truncate">{deck.filename || 'Unknown Track'}</div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-mono">{formatTime(deck.position)}</span>
                <Progress value={progress} className="flex-1 h-1" />
                <span className="font-mono">{formatTime(deck.duration)}</span>
              </div>
            </div>
          )}

          {/* Transport Controls */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Load
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load an audio file</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePlayPause}
                  disabled={!deck.loaded}
                  className={`${
                    deck.loaded
                      ? id === 'A'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600'
                      : ''
                  } text-black`}
                >
                  {deck.playing ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{deck.playing ? 'Pause' : 'Play'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => stop(id)}
                  disabled={!deck.loaded}
                  className="hover:border-red-500/50 hover:bg-red-500/10"
                >
                  <Square className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop and reset</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Pitch Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted">Pitch</Label>
              <Badge variant="outline" className="font-mono text-xs">
                {deck.pitch > 1 ? '+' : ''}{((deck.pitch - 1) * 100).toFixed(1)}%
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Slider
                    value={[pitchToSlider(deck.pitch)]}
                    onValueChange={([v]) => setPitch(id, sliderToPitch(v))}
                    max={100}
                    step={1}
                    disabled={!deck.loaded}
                    className={`[&_[role=slider]]:bg-${deckColor}-500 [&_.bg-primary]:bg-${deckColor}-500`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust playback speed (-20% to +20%)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 3-Band EQ */}
          <div className="space-y-3">
            <Label className="text-sm text-muted">3-Band EQ</Label>

            {(['low', 'mid', 'high'] as const).map((band) => (
              <div key={band} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted capitalize">{band}</Label>
                  <Badge variant="outline" className="text-xs font-mono h-5">
                    {deck.eq[band] > 0 ? '+' : ''}{deck.eq[band].toFixed(1)} dB
                  </Badge>
                </div>
                <Slider
                  value={[((deck.eq[band] + 12) / 24) * 100]}
                  onValueChange={([v]) => setEQ(id, band, (v / 100) * 24 - 12)}
                  max={100}
                  step={1}
                  disabled={!deck.loaded}
                  className={`
                    ${band === 'low' ? '[&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-blue-900 [&_.bg-primary]:to-blue-500' : ''}
                    ${band === 'mid' ? '[&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-green-900 [&_.bg-primary]:to-green-500' : ''}
                    ${band === 'high' ? '[&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-900 [&_.bg-primary]:to-yellow-500' : ''}
                    [&_[role=slider]]:bg-white [&_[role=slider]]:h-3 [&_[role=slider]]:w-3
                  `}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
