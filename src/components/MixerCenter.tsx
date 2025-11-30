import { useState, useEffect } from 'react'
import StudioKnob from './ui/StudioKnob'
import StudioFader from './ui/StudioFader'

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
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-4 space-y-4 h-full flex flex-col">

      {/* Master Volume & Booth Monitor Header */}
      <div className="grid grid-cols-2 gap-3 px-2">
        <div className="space-y-1">
          <label className="text-[10px] text-muted font-medium uppercase tracking-wide">Master Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVol}
            onChange={(e) => onMasterVolChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
          <div className="text-[10px] text-center font-mono text-text">{Math.round(masterVol * 100)}</div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-muted font-medium uppercase tracking-wide">Booth Monitor</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.7"
            className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
          <div className="text-[10px] text-center font-mono text-text">70</div>
        </div>
      </div>

      {/* BPM/SYNC Section */}
      <div className="bg-black/40 rounded-xl px-3 py-2 flex items-center justify-center gap-4 border border-white/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-rmxrtext">{aBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-0.5">BPM A</div>
        </div>
        <button
          onClick={onSync}
          disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
          className="p-1.5 rounded-lg bg-surface border border-rmxrborder hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          title="Sync BPMs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 2.1l4 4-4 4"/>
            <path d="M3 12.2l4 4 4-4"/>
            <path d="M21 6.1h-11"/>
            <path d="M3 16.2h11"/>
          </svg>
        </button>
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-rmxrtext">{bBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-0.5">BPM B</div>
        </div>
      </div>

      {/* EQ Section */}
      <div className="flex-1 grid grid-cols-2 gap-8 w-full px-2">
        {/* Deck A EQs */}
        <div className="flex flex-col items-center justify-between gap-2">
          <div className="text-xl font-bold text-deckA mb-2">A</div>
          <StudioKnob
            label="High"
            value={((aEQ.high + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setAEQ({ ...aEQ, high: dbValue })
            }}
            deckId="A"
          />
          <StudioKnob
            label="Mid"
            value={((aEQ.mid + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setAEQ({ ...aEQ, mid: dbValue })
            }}
            deckId="A"
          />
          <StudioKnob
            label="Low"
            value={((aEQ.low + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setAEQ({ ...aEQ, low: dbValue })
            }}
            deckId="A"
          />
          <div className="mt-4 w-full flex justify-center h-48">
            <StudioFader
              value={80}
              onChange={() => {}}
              deckId="A"
              height="h-full"
            />
          </div>
        </div>

        {/* Deck B EQs */}
        <div className="flex flex-col items-center justify-between gap-2">
          <div className="text-xl font-bold text-deckB mb-2">B</div>
          <StudioKnob
            label="High"
            value={((bEQ.high + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setBEQ({ ...bEQ, high: dbValue })
            }}
            deckId="B"
          />
          <StudioKnob
            label="Mid"
            value={((bEQ.mid + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setBEQ({ ...bEQ, mid: dbValue })
            }}
            deckId="B"
          />
          <StudioKnob
            label="Low"
            value={((bEQ.low + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24
              if (isFinite(dbValue)) setBEQ({ ...bEQ, low: dbValue })
            }}
            deckId="B"
          />
          <div className="mt-4 w-full flex justify-center h-48">
            <StudioFader
              value={80}
              onChange={() => {}}
              deckId="B"
              height="h-full"
            />
          </div>
        </div>
      </div>

      {/* Crossfader Section */}
      <div className="w-full px-4 pt-2 pb-4">
        <div className="relative h-12 bg-dark-900 rounded border border-zinc-700 flex items-center px-4">
          {/* Track Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-800 -translate-y-1/2 rounded-full"></div>

          {/* Crossfader Handle */}
          <div
            className="absolute w-8 h-10 bg-gradient-to-b from-zinc-600 to-zinc-800 border border-zinc-500 rounded shadow-lg top-1 cursor-grab active:cursor-grabbing hover:bg-zinc-600 transition-colors pointer-events-none"
            style={{
              left: `${crossfader * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-magenta shadow-[0_0_5px_currentColor] opacity-50"></div>
          </div>

          {/* Input overlay for interaction */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={crossfader}
            onChange={(e) => onCrossfaderChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* A/B Labels */}
        <div className="flex justify-between text-xs text-zinc-500 mt-1 font-mono">
          <span>&lt; A</span>
          <span>B &gt;</span>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="rounded-lg border border-danger bg-danger/10 px-3 py-2 text-center animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="text-danger font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            Recording
          </div>
        </div>
      )}
    </div>
  )
}
