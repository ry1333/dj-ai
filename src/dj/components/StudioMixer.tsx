import { useDJ } from '../store'
import { VerticalEQKnob } from './VerticalEQKnob'

export function StudioMixer() {
  const { decks, setEQ, crossfader, setCrossfader, masterVolume, setMasterVolume } = useDJ()

  return (
    <div className="flex flex-col items-center h-full">
      {/* Master Volume and Booth Monitor */}
      <div className="w-full max-w-sm mb-6 p-4 rounded-xl border border-line bg-card/50 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4">
          {/* Master Volume */}
          <div className="space-y-2">
            <label className="text-xs text-muted font-medium">Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="text-xs text-text text-center font-mono">
              {Math.round(masterVolume * 100)}
            </div>
          </div>

          {/* Booth Monitor */}
          <div className="space-y-2">
            <label className="text-xs text-muted font-medium">Booth Monitor</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue="0.7"
              className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="text-xs text-text text-center font-mono">70</div>
          </div>
        </div>
      </div>

      {/* EQ Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-8">
          {/* Deck A EQs */}
          <div className="flex items-center gap-4 p-6 rounded-2xl border border-pink-500/30 bg-pink-500/5">
            <div className="text-2xl font-bold text-pink-500">A</div>
            <VerticalEQKnob
              label="High"
              value={decks.A.eq.high}
              onChange={(v) => setEQ('A', 'high', v)}
              color="A"
              disabled={!decks.A.loaded}
            />
            <VerticalEQKnob
              label="Mid"
              value={decks.A.eq.mid}
              onChange={(v) => setEQ('A', 'mid', v)}
              color="A"
              disabled={!decks.A.loaded}
            />
            <VerticalEQKnob
              label="Low"
              value={decks.A.eq.low}
              onChange={(v) => setEQ('A', 'low', v)}
              color="A"
              disabled={!decks.A.loaded}
            />
          </div>

          {/* Deck B EQs */}
          <div className="flex items-center gap-4 p-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/5">
            <div className="text-2xl font-bold text-cyan-400">B</div>
            <VerticalEQKnob
              label="High"
              value={decks.B.eq.high}
              onChange={(v) => setEQ('B', 'high', v)}
              color="B"
              disabled={!decks.B.loaded}
            />
            <VerticalEQKnob
              label="Mid"
              value={decks.B.eq.mid}
              onChange={(v) => setEQ('B', 'mid', v)}
              color="B"
              disabled={!decks.B.loaded}
            />
            <VerticalEQKnob
              label="Low"
              value={decks.B.eq.low}
              onChange={(v) => setEQ('B', 'low', v)}
              color="B"
              disabled={!decks.B.loaded}
            />
          </div>
        </div>
      </div>

      {/* Crossfader */}
      <div className="w-full max-w-md mt-6 p-6 rounded-2xl border border-line bg-card/50 backdrop-blur-sm">
        <div className="space-y-3">
          {/* Deck indicators */}
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className={`${crossfader < -0.3 ? 'text-pink-500' : 'text-muted'}`}>A</span>
            <span className={`${crossfader > 0.3 ? 'text-cyan-400' : 'text-muted'}`}>B</span>
          </div>

          {/* Crossfader slider */}
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-pink-500 via-surface to-cyan-400 rounded-full" />
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={crossfader}
              onChange={(e) => setCrossfader(parseFloat(e.target.value))}
              className="relative w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer z-10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-16 [&::-webkit-slider-thumb]:h-10
                [&::-webkit-slider-thumb]:rounded-lg [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-xl
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-line"
            />
          </div>

          {/* Position value */}
          <div className="text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-surface text-xs font-mono text-text">
              {crossfader.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
