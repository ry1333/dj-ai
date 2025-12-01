import { useDJ } from '../store'
import { VerticalEQKnob } from './VerticalEQKnob'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

export function StudioMixer() {
  const { decks, setEQ, crossfader, setCrossfader, masterVolume, setMasterVolume } = useDJ()

  // Convert -1 to 1 range to 0-100 for slider
  const crossfaderValue = ((crossfader + 1) / 2) * 100

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center h-full">
        {/* Master Volume and Booth Monitor */}
        <Card className="w-full max-w-sm mb-6 border-line bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Master Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted font-medium">Master Volume</Label>
                  <Badge variant="outline" className="text-xs font-mono h-5">
                    {Math.round(masterVolume * 100)}
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
                        className="[&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Main output level</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Booth Monitor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted font-medium">Booth Monitor</Label>
                  <Badge variant="outline" className="text-xs font-mono h-5">70</Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Slider
                        defaultValue={[70]}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>DJ booth monitor level</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EQ Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Deck A EQs */}
            <Card className="border-pink-500/30 bg-pink-500/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="text-2xl font-bold text-pink-500">A</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="High"
                        value={decks.A.eq.high}
                        onChange={(v) => setEQ('A', 'high', v)}
                        color="A"
                        disabled={!decks.A.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High frequencies (treble)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="Mid"
                        value={decks.A.eq.mid}
                        onChange={(v) => setEQ('A', 'mid', v)}
                        color="A"
                        disabled={!decks.A.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mid frequencies (vocals, leads)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="Low"
                        value={decks.A.eq.low}
                        onChange={(v) => setEQ('A', 'low', v)}
                        color="A"
                        disabled={!decks.A.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Low frequencies (bass, kick)</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Deck B EQs */}
            <Card className="border-cyan-400/30 bg-cyan-400/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="text-2xl font-bold text-cyan-400">B</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="High"
                        value={decks.B.eq.high}
                        onChange={(v) => setEQ('B', 'high', v)}
                        color="B"
                        disabled={!decks.B.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High frequencies (treble)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="Mid"
                        value={decks.B.eq.mid}
                        onChange={(v) => setEQ('B', 'mid', v)}
                        color="B"
                        disabled={!decks.B.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mid frequencies (vocals, leads)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <VerticalEQKnob
                        label="Low"
                        value={decks.B.eq.low}
                        onChange={(v) => setEQ('B', 'low', v)}
                        color="B"
                        disabled={!decks.B.loaded}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Low frequencies (bass, kick)</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Crossfader */}
        <Card className="w-full max-w-md mt-6 border-line bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            {/* Deck indicators */}
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className={`${crossfader < -0.3 ? 'text-pink-500' : 'text-muted'}`}>A</span>
              <Badge variant="outline" className="font-mono text-xs">
                {crossfader.toFixed(2)}
              </Badge>
              <span className={`${crossfader > 0.3 ? 'text-cyan-400' : 'text-muted'}`}>B</span>
            </div>

            {/* Crossfader slider */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative py-2">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-pink-500 via-surface to-cyan-400 rounded-full -z-10" />
                  <Slider
                    value={[crossfaderValue]}
                    onValueChange={([v]) => setCrossfader((v / 50) - 1)}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:h-10 [&_[role=slider]]:w-16 [&_[role=slider]]:rounded-lg [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-line [&_[role=slider]]:shadow-xl [&_.bg-primary]:bg-transparent"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Blend between Deck A and Deck B</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
