import { useState } from 'react'

type Props = {
  label: string
  deck: any
  playing: boolean
  fileName: string
  bpm: number
  onBpmChange: (bpm: number) => void
  onLoad: (file: File) => void
  onPlay: () => void
  onPause: () => void
  onCue: () => void
}

export default function DeckControls({
  label,
  deck,
  playing,
  fileName,
  bpm,
  onBpmChange,
  onLoad,
  onPlay,
  onPause,
  onCue
}: Props) {
  const [pitch, setPitch] = useState(0)

  const handlePitchChange = (value: number) => {
    setPitch(value)
    deck.setRate(1 + value / 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onLoad(file)
  }

  return (
    <div className={`rounded-2xl border border-rmxrborder bg-surface shadow-[0_0_0_1px_rgba(38,38,58,0.2)] p-8 space-y-6 h-full flex flex-col ${playing ? 'deck--active' : ''}`}>
      {/* Header - Only deck label */}
      <div className="text-xs font-semibold text-muted tracking-widest uppercase">
        Deck {label}
      </div>

      {/* Jog/Platter - Neutral, only active deck gets magenta glow */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`
          relative w-56 h-56 rounded-full border-4 border-rmxrborder
          bg-gradient-to-br from-surface2 to-bg
          ${playing ? 'animate-spin-slow' : ''}
          transition-all duration-300
        `}>
          {/* Grooves - low-contrast gray */}
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <div className="absolute inset-12 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/5" />

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-bg border-2 border-rmxrborder flex items-center justify-center">
              {fileName && (
                <div className="text-[8px] text-center text-muted px-2 truncate max-w-[48px]">
                  {fileName.split('.')[0].substring(0, 8)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Controls - Icon-first */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPlay}
          disabled={!deck.buffer}
          title="Play"
          className="w-14 h-14 rounded-xl bg-accent hover:bg-accent-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          ▶
        </button>
        <button
          onClick={onPause}
          title="Pause"
          className="w-12 h-12 rounded-lg border-2 border-rmxrborder bg-surface2 hover:border-accent hover:bg-surface text-rmxrtext font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          ⏸
        </button>
        <button
          onClick={onCue}
          title="Cue (Return to start)"
          className="w-12 h-12 rounded-lg border-2 border-rmxrborder bg-surface2 hover:border-accent hover:bg-surface text-rmxrtext font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          ⏮
        </button>
      </div>

      {/* Load Button */}
      <label className="block">
        <div className="w-full border-2 border-rmxrborder hover:border-accent hover:bg-surface2 bg-surface text-rmxrtext hover:text-accent-400 font-semibold py-3 rounded-xl transition-all cursor-pointer text-center text-sm">
          📁 Load Track
        </div>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* BPM + Pitch */}
      <div className="space-y-4">
        {/* BPM - Keep big only in deck, mono font */}
        <div>
          <div className="text-[10px] uppercase text-muted font-semibold tracking-wider mb-2">BPM</div>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onBpmChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-bg border border-rmxrborder rounded-lg px-3 py-2 text-3xl font-bold font-mono text-center text-rmxrtext focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Pitch - Uses CSS slider styles from index.css */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase text-muted font-semibold tracking-wider">Pitch</span>
            <span className="text-sm font-mono text-accent-400 font-semibold">{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={-8}
            max={8}
            step={0.1}
            value={pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-muted">
            <span>-8%</span>
            <span>0</span>
            <span>+8%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
