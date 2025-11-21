import { useState, useEffect } from 'react'
import RotaryKnob from './ui/RotaryKnob'
import VerticalFader from './ui/VerticalFader'

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
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8 space-y-6 h-full flex flex-col">

      {/* BPM/SYNC Header */}
      <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center justify-center gap-4 border border-white/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{aBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM A</div>
        </div>
        <button
          onClick={onSync}
          disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
          className="px-4 py-2 rounded-lg bg-surface border border-rmxrborder hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          🔗 Sync
        </button>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{bBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM B</div>
        </div>
      </div>

      {/* Main Mixer Layout: 3-Column Grid */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-8 items-center">

        {/* LEFT COLUMN: Deck A Rotary Knobs */}
        <div className="flex flex-col items-center justify-center gap-8">
          <RotaryKnob
            label="HIGH A"
            value={aEQ.high}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setAEQ({ ...aEQ, high: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="MID A"
            value={aEQ.mid}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setAEQ({ ...aEQ, mid: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="LOW A"
            value={aEQ.low}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setAEQ({ ...aEQ, low: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="FILTER A"
            value={aFilter}
            min={200}
            max={20000}
            step={100}
            unit="Hz"
            onChange={(v) => {
              if (isFinite(v)) setAFilter(v)
            }}
            size={70}
          />
        </div>

        {/* CENTER COLUMN: Vertical Crossfader */}
        <div className="flex flex-col items-center gap-4 px-4">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Crossfader</div>

          {/* Vertical Crossfader */}
          <div className="flex items-center">
            <VerticalFader
              value={crossfader}
              min={0}
              max={1}
              step={0.001}
              onChange={(v) => {
                if (isFinite(v)) onCrossfaderChange(v)
              }}
              label=""
              unit=""
              height={340}
              accentColor="magenta"
            />
          </div>

          {/* A/B Labels with percentages */}
          <div className="flex flex-col items-center gap-2 text-[11px] font-mono font-semibold">
            <span className={`transition-all ${crossfader < 0.5 ? 'text-cyan scale-110' : 'text-muted'}`}>
              A {Math.round((1-crossfader) * 100)}%
            </span>
            <div className="w-px h-4 bg-white/20" />
            <span className={`transition-all ${crossfader > 0.5 ? 'text-magenta scale-110' : 'text-muted'}`}>
              B {Math.round(crossfader * 100)}%
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Deck B Rotary Knobs */}
        <div className="flex flex-col items-center justify-center gap-8">
          <RotaryKnob
            label="HIGH B"
            value={bEQ.high}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setBEQ({ ...bEQ, high: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="MID B"
            value={bEQ.mid}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setBEQ({ ...bEQ, mid: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="LOW B"
            value={bEQ.low}
            min={-24}
            max={24}
            step={0.5}
            unit="dB"
            onChange={(v) => {
              if (isFinite(v)) setBEQ({ ...bEQ, low: v })
            }}
            size={70}
          />
          <RotaryKnob
            label="FILTER B"
            value={bFilter}
            min={200}
            max={20000}
            step={100}
            unit="Hz"
            onChange={(v) => {
              if (isFinite(v)) setBFilter(v)
            }}
            size={70}
          />
        </div>
      </div>

      {/* Master Volume - Keep as vertical fader for consistency */}
      <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Master Volume</div>
        <div className="flex items-center gap-4">
          <VerticalFader
            value={masterVol}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => {
              if (isFinite(v)) onMasterVolChange(v)
            }}
            label=""
            unit="%"
            height={120}
            accentColor="magenta"
          />
          <div className="text-xl font-mono font-bold gradient-text">
            {Math.round(masterVol * 100)}%
          </div>
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
