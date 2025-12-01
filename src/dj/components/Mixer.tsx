import { Volume2, Circle } from 'lucide-react'
import { useDJ } from '../store'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

export function Mixer() {
  const { crossfader, masterVolume, decks, setCrossfader, setMasterVolume } = useDJ()

  const getAverageBPM = () => {
    const loadedDecks = [decks.A, decks.B].filter(d => d.loaded)
    if (loadedDecks.length === 0) return 120

    const sum = loadedDecks.reduce((acc, d) => acc + d.bpm, 0)
    return Math.round(sum / loadedDecks.length)
  }

  // Convert -1 to 1 range to 0-100 for slider
  const crossfaderValue = ((crossfader + 1) / 2) * 100

  return (
    <TooltipProvider>
      <Card className="border-line bg-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Mixer</CardTitle>
          <Badge variant="secondary" className="w-fit mx-auto">
            {getAverageBPM()} BPM avg
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Crossfader Section */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xs font-medium text-muted mb-2">CROSSFADER</div>

              {/* Crossfader Labels */}
              <div className="flex items-center justify-between text-xs text-muted mb-3">
                <span className={crossfader < -0.3 ? 'text-pink-500 font-semibold' : ''}>
                  DECK A
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {crossfader.toFixed(2)}
                </Badge>
                <span className={crossfader > 0.3 ? 'text-cyan-400 font-semibold' : ''}>
                  DECK B
                </span>
              </div>

              {/* Crossfader Slider */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="py-2">
                    <Slider
                      value={[crossfaderValue]}
                      onValueChange={([v]) => setCrossfader((v / 50) - 1)}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-pink-500 [&_[role=slider]]:shadow-[0_0_15px_rgba(255,255,255,0.4)] [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-pink-500 [&_.bg-primary]:to-cyan-400"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Blend between Deck A and Deck B</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Visual Deck Indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg border p-3 text-center transition-all ${
                crossfader < 0
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-line bg-surface/50'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Circle className={`w-3 h-3 ${
                    decks.A.playing ? 'fill-emerald-400 text-emerald-400 animate-pulse' : 'text-muted'
                  }`} />
                  <span className="text-xs font-semibold text-text">DECK A</span>
                </div>
                <div className="text-xs text-muted truncate">
                  {decks.A.loaded ? decks.A.filename?.slice(0, 15) || 'Loaded' : 'Empty'}
                </div>
              </div>

              <div className={`rounded-lg border p-3 text-center transition-all ${
                crossfader > 0
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-line bg-surface/50'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Circle className={`w-3 h-3 ${
                    decks.B.playing ? 'fill-emerald-400 text-emerald-400 animate-pulse' : 'text-muted'
                  }`} />
                  <span className="text-xs font-semibold text-text">DECK B</span>
                </div>
                <div className="text-xs text-muted truncate">
                  {decks.B.loaded ? decks.B.filename?.slice(0, 15) || 'Loaded' : 'Empty'}
                </div>
              </div>
            </div>
          </div>

          {/* Master Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Master Volume
              </label>
              <Badge variant="secondary" className="font-mono">
                {Math.round(masterVolume * 100)}%
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Slider
                    value={[masterVolume * 100]}
                    onValueChange={([v]) => setMasterVolume(v / 100)}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:bg-white [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-pink-500 [&_.bg-primary]:to-pink-500"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust master output volume</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Meters Placeholder */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted text-center">OUTPUT METERS</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs text-muted text-center">L</div>
                <div className="h-24 bg-surface rounded-lg border border-line overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500 to-cyan-500" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted text-center">R</div>
                <div className="h-24 bg-surface rounded-lg border border-line overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500 to-cyan-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Mixing Tips */}
          <Card className="bg-surface/30 border-line/50">
            <CardContent className="p-3 text-xs text-muted space-y-1">
              <div className="font-semibold text-text mb-1">Mixing Tips</div>
              <div>• Match BPMs with pitch controls</div>
              <div>• Use EQ to create space in the mix</div>
              <div>• Crossfade smoothly during breakdowns</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
