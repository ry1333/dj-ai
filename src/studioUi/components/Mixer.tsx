import React from 'react';
import { MixerState, DeckState, DeckId } from '../types';
import Knob from './Knob';
import Fader from './Fader';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface MixerProps {
  state: MixerState;
  deckAState: DeckState;
  deckBState: DeckState;
  onMixerChange: (newState: Partial<MixerState>) => void;
  onDeckEqChange: (deckId: DeckId, eq: Partial<DeckState['eq']>) => void;
  onDeckVolumeChange: (deckId: DeckId, vol: number) => void;
}

const Mixer: React.FC<MixerProps> = ({
  state, deckAState, deckBState, onMixerChange, onDeckEqChange, onDeckVolumeChange
}) => {
  // Convert -1 to 1 range to 0-100 for slider
  const crossfaderValue = ((state.crossfader + 1) / 2) * 100;

  return (
    <TooltipProvider>
      <Card className="bg-zinc-900/80 border-zinc-800 h-full">
        <CardContent className="p-4 flex flex-col gap-6 items-center h-full">
          {/* Top Master Controls */}
          <Card className="w-full bg-zinc-950 border-zinc-700/50">
            <CardContent className="p-3 flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-zinc-500 uppercase">Master Volume</Label>
                  <Badge variant="outline" className="text-xs font-mono h-5">{state.masterVolume}</Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Slider
                        value={[state.masterVolume]}
                        onValueChange={([v]) => onMixerChange({ masterVolume: v })}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:bg-white [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Main output level</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-zinc-500 uppercase">Booth Monitor</Label>
                  <Badge variant="outline" className="text-xs font-mono h-5">{state.boothMonitor}</Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Slider
                        value={[state.boothMonitor]}
                        onValueChange={([v]) => onMixerChange({ boothMonitor: v })}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:bg-white [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>DJ booth monitor level</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* EQ Section */}
          <div className="flex-1 grid grid-cols-2 gap-8 w-full px-2">
            {/* Deck A EQs */}
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="text-xl font-bold text-pink-500 mb-2">A</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Knob
                      label="High"
                      value={deckAState.eq.high}
                      onChange={(val) => onDeckEqChange(DeckId.A, { high: val })}
                      deckId={DeckId.A}
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
                    <Knob
                      label="Mid"
                      value={deckAState.eq.mid}
                      onChange={(val) => onDeckEqChange(DeckId.A, { mid: val })}
                      deckId={DeckId.A}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mid frequencies (vocals)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Knob
                      label="Low"
                      value={deckAState.eq.low}
                      onChange={(val) => onDeckEqChange(DeckId.A, { low: val })}
                      deckId={DeckId.A}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Low frequencies (bass)</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-4 w-full flex justify-center h-48">
                <Fader
                  value={deckAState.volume}
                  onChange={(val) => onDeckVolumeChange(DeckId.A, val)}
                  deckId={DeckId.A}
                  height="h-full"
                />
              </div>
            </div>

            {/* Deck B EQs */}
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="text-xl font-bold text-cyan-400 mb-2">B</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Knob
                      label="High"
                      value={deckBState.eq.high}
                      onChange={(val) => onDeckEqChange(DeckId.B, { high: val })}
                      deckId={DeckId.B}
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
                    <Knob
                      label="Mid"
                      value={deckBState.eq.mid}
                      onChange={(val) => onDeckEqChange(DeckId.B, { mid: val })}
                      deckId={DeckId.B}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mid frequencies (vocals)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Knob
                      label="Low"
                      value={deckBState.eq.low}
                      onChange={(val) => onDeckEqChange(DeckId.B, { low: val })}
                      deckId={DeckId.B}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Low frequencies (bass)</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-4 w-full flex justify-center h-48">
                <Fader
                  value={deckBState.volume}
                  onChange={(val) => onDeckVolumeChange(DeckId.B, val)}
                  deckId={DeckId.B}
                  height="h-full"
                />
              </div>
            </div>
          </div>

          {/* Crossfader */}
          <div className="w-full px-4 pt-2 pb-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className={state.crossfader < -0.3 ? 'text-pink-500 font-bold' : ''}>A</span>
              <Badge variant="outline" className="text-xs font-mono">{state.crossfader.toFixed(2)}</Badge>
              <span className={state.crossfader > 0.3 ? 'text-cyan-400 font-bold' : ''}>B</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative py-2">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-pink-500 via-zinc-800 to-cyan-400 rounded-full -z-10" />
                  <Slider
                    value={[crossfaderValue]}
                    onValueChange={([v]) => onMixerChange({ crossfader: (v / 50) - 1 })}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:h-10 [&_[role=slider]]:w-8 [&_[role=slider]]:rounded-md [&_[role=slider]]:bg-gradient-to-b [&_[role=slider]]:from-zinc-500 [&_[role=slider]]:to-zinc-700 [&_[role=slider]]:border [&_[role=slider]]:border-zinc-400 [&_[role=slider]]:shadow-lg [&_.bg-primary]:bg-transparent"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Blend between Deck A and Deck B</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default Mixer;
