import { useState, useEffect } from 'react'

type Props = {
  mixer: any
  crossfader: number
  onCrossfaderChange: (value: number) => void
  masterVol: number
  onMasterVolChange: (value: number) => void
  aBpm: number
  bBpm: number
  onSync: () => void
  isRecording: boolean
}

export default function MixerCenter({
  mixer,
  crossfader,
  onCrossfaderChange,
  masterVol,
  onMasterVolChange,
  aBpm,
  bBpm,
  onSync,
  isRecording
}: Props) {
  // EQ states for both decks
  const [aEQ, setAEQ] = useState({ low: 0, mid: 0, high: 0 })
  const [bEQ, setBEQ] = useState({ low: 0, mid: 0, high: 0 })

  // Filter states
  const [aFilter, setAFilter] = useState(20000)
  const [bFilter, setBFilter] = useState(20000)

  // Apply EQ changes
  useEffect(() => { mixer.deckA.setEQ(aEQ) }, [aEQ, mixer])
  useEffect(() => { mixer.deckB.setEQ(bEQ) }, [bEQ, mixer])

  // Apply filter changes
  useEffect(() => { mixer.deckA.setFilterHz(aFilter) }, [aFilter, mixer])
  useEffect(() => { mixer.deckB.setFilterHz(bFilter) }, [bFilter, mixer])

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 shadow-[0_0_0_1px_rgba(24,24,27,0.4)] p-8 space-y-8 h-full flex flex-col">

      {/* BPM/SYNC Header */}
      <div className="flex items-center justify-center gap-4 pb-6 border-b border-zinc-800/40">
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-orange-400">{aBpm}</div>
          <div className="text-[9px] text-zinc-600 uppercase tracking-wider mt-1">BPM A</div>
        </div>
        <button
          onClick={onSync}
          disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-purple-900/30"
        >
          🔗 SYNC
        </button>
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-red-400">{bBpm}</div>
          <div className="text-[9px] text-zinc-600 uppercase tracking-wider mt-1">BPM B</div>
        </div>
      </div>

      {/* EQ Strips Side-by-Side */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Deck A EQ */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider text-center pb-2 border-b border-orange-900/30">
            EQ A
          </div>
          <div className="space-y-3">
            <EQKnob label="High" value={aEQ.high} onChange={(v) => setAEQ({ ...aEQ, high: v })} color="orange" />
            <EQKnob label="Mid" value={aEQ.mid} onChange={(v) => setAEQ({ ...aEQ, mid: v })} color="orange" />
            <EQKnob label="Low" value={aEQ.low} onChange={(v) => setAEQ({ ...aEQ, low: v })} color="orange" />
          </div>

          {/* Filter A */}
          <div className="pt-4 space-y-2">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Filter</div>
            <div className="relative h-2">
              <div className="absolute inset-0 bg-zinc-900 rounded-full" />
              <div
                className="absolute h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                style={{ width: `${((aFilter - 200) / 19800) * 100}%` }}
              />
              <input
                type="range"
                min={200}
                max={20000}
                step={100}
                value={aFilter}
                onChange={(e) => setAFilter(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-[10px] text-zinc-600 text-center font-mono">{(aFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>

        {/* Deck B EQ */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider text-center pb-2 border-b border-red-900/30">
            EQ B
          </div>
          <div className="space-y-3">
            <EQKnob label="High" value={bEQ.high} onChange={(v) => setBEQ({ ...bEQ, high: v })} color="red" />
            <EQKnob label="Mid" value={bEQ.mid} onChange={(v) => setBEQ({ ...bEQ, mid: v })} color="red" />
            <EQKnob label="Low" value={bEQ.low} onChange={(v) => setBEQ({ ...bEQ, low: v })} color="red" />
          </div>

          {/* Filter B */}
          <div className="pt-4 space-y-2">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Filter</div>
            <div className="relative h-2">
              <div className="absolute inset-0 bg-zinc-900 rounded-full" />
              <div
                className="absolute h-2 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all"
                style={{ width: `${((bFilter - 200) / 19800) * 100}%` }}
              />
              <input
                type="range"
                min={200}
                max={20000}
                step={100}
                value={bFilter}
                onChange={(e) => setBFilter(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-[10px] text-zinc-600 text-center font-mono">{(bFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>
      </div>

      {/* Crossfader - Docked at Bottom */}
      <div className="space-y-3 pt-6 border-t border-zinc-800/40">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-center">Crossfader</div>
        <div className="relative h-12 flex items-center">
          {/* Track */}
          <div className="absolute inset-x-0 h-3 rounded-full bg-gradient-to-r from-orange-900/20 via-zinc-900 to-red-900/20 border border-zinc-800" />

          {/* Active fill - left side */}
          <div
            className="absolute h-3 rounded-l-full transition-all duration-75"
            style={{
              left: 0,
              right: `${crossfader * 100}%`,
              background: `linear-gradient(to right, rgba(251, 146, 60, ${0.8 - crossfader * 0.6}), rgba(251, 146, 60, ${crossfader * 0.1}))`
            }}
          />

          {/* Active fill - right side */}
          <div
            className="absolute h-3 rounded-r-full transition-all duration-75"
            style={{
              left: `${(1 - crossfader) * 100}%`,
              right: 0,
              background: `linear-gradient(to right, rgba(239, 68, 68, ${(1 - crossfader) * 0.1}), rgba(239, 68, 68, ${0.2 + crossfader * 0.6}))`
            }}
          />

          {/* Thumb */}
          <div
            className="absolute w-6 h-6 rounded-lg bg-gradient-to-br from-white to-zinc-300 border border-zinc-600 shadow-lg pointer-events-none transition-all z-10"
            style={{ left: `calc(${(1 - crossfader) * 100}% - 12px)` }}
          />

          {/* Input */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={1 - crossfader}
            onChange={(e) => onCrossfaderChange(1 - parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>
        <div className="flex justify-between text-[10px] font-semibold">
          <span className={`transition-all ${crossfader < 0.5 ? 'text-orange-400 scale-110' : 'text-zinc-600'}`}>A</span>
          <span className="text-zinc-600 font-mono text-[9px]">{Math.round((1-crossfader) * 100)}% / {Math.round(crossfader * 100)}%</span>
          <span className={`transition-all ${crossfader > 0.5 ? 'text-red-400 scale-110' : 'text-zinc-600'}`}>B</span>
        </div>
      </div>

      {/* Master Volume */}
      <div className="space-y-2">
        <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Master</div>
        <div className="relative h-2">
          <div className="absolute inset-0 bg-zinc-900 rounded-full" />
          <div
            className="absolute h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
            style={{ width: `${masterVol * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVol}
            onChange={(e) => onMasterVolChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-center text-xs font-mono text-zinc-400">{Math.round(masterVol * 100)}%</div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-center animate-pulse">
          <div className="text-red-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </div>
        </div>
      )}
    </div>
  )
}

function EQKnob({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: 'orange' | 'red' }) {
  const colorMap = {
    orange: 'from-orange-500 to-orange-400',
    red: 'from-red-500 to-red-400'
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider w-10">{label}</div>
      <div className="flex-1 relative h-2">
        <div className="absolute inset-0 bg-zinc-900 rounded-full" />
        <div
          className={`absolute h-2 bg-gradient-to-r ${colorMap[color]} rounded-full transition-all`}
          style={{ width: `${((value + 24) / 48) * 100}%` }}
        />
        <input
          type="range"
          min={-24}
          max={24}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="text-[10px] font-mono text-zinc-600 w-10 text-right">{value > 0 ? '+' : ''}{value.toFixed(1)}</div>
    </div>
  )
}
