import { useState } from 'react'

type Props = {
  label: string
  deck: any
  color: 'orange' | 'red'
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
  color,
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

  const colorMap = {
    orange: {
      border: 'border-orange-900/40',
      bg: 'bg-zinc-950/60',
      text: 'text-orange-400',
      playBtn: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-900/30',
      platterRing: 'border-orange-500/40',
      platterGlow: playing ? 'shadow-[0_0_40px_rgba(251,146,60,0.3)]' : '',
      slider: 'bg-gradient-to-r from-orange-500 to-orange-400'
    },
    red: {
      border: 'border-red-900/40',
      bg: 'bg-zinc-950/60',
      text: 'text-red-400',
      playBtn: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-900/30',
      platterRing: 'border-red-500/40',
      platterGlow: playing ? 'shadow-[0_0_40px_rgba(239,68,68,0.3)]' : '',
      slider: 'bg-gradient-to-r from-red-500 to-red-400'
    }
  }

  const theme = colorMap[color]

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} shadow-[0_0_0_1px_rgba(24,24,27,0.4)] p-8 space-y-6 h-full flex flex-col`}>
      {/* Header - Only deck label, no redundant info */}
      <div className={`text-xs font-semibold ${theme.text} tracking-widest uppercase`}>
        {label}
      </div>

      {/* Jog/Platter - Larger, cleaner */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`
          relative w-56 h-56 rounded-full border-4 ${theme.platterRing}
          bg-gradient-to-br from-zinc-900 to-black
          ${playing ? 'animate-spin-slow' : ''}
          ${theme.platterGlow}
          transition-all duration-300
        `}>
          {/* Grooves - less visual noise */}
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <div className="absolute inset-12 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/5" />

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-14 h-14 rounded-full bg-zinc-950/80 border-2 ${theme.platterRing} flex items-center justify-center`}>
              {fileName && (
                <div className="text-[8px] text-center text-zinc-400 px-2 truncate max-w-[48px]">
                  {fileName.split('.')[0].substring(0, 8)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Controls - Icon-first, tighter grouping */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPlay}
          disabled={!deck.buffer}
          title="Play"
          className={`w-14 h-14 rounded-xl ${theme.playBtn} disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
        >
          ▶
        </button>
        <button
          onClick={onPause}
          title="Pause"
          className="w-12 h-12 rounded-lg border-2 border-zinc-700/60 hover:bg-zinc-800/60 text-white font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          ⏸
        </button>
        <button
          onClick={onCue}
          title="Cue (Return to start)"
          className="w-12 h-12 rounded-lg border-2 border-zinc-700/60 hover:bg-zinc-800/60 text-white font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          ⏮
        </button>
      </div>

      {/* Load Button - Cleaner */}
      <label className="block">
        <div className="w-full border-2 border-zinc-700/60 hover:bg-zinc-800/60 hover:border-zinc-600/60 text-zinc-300 hover:text-white font-semibold py-3 rounded-xl transition-all cursor-pointer text-center text-sm">
          📁 Load Track
        </div>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* BPM + Pitch - Merged into one card */}
      <div className="space-y-4">
        {/* BPM */}
        <div>
          <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider mb-2">BPM</div>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onBpmChange(parseFloat(e.target.value) || 0)}
            className={`w-full bg-black/50 border border-zinc-800/60 rounded-lg px-3 py-2 text-3xl font-bold font-mono text-center focus:outline-none focus:border-${color === 'orange' ? 'orange' : 'red'}-500/40 transition-colors`}
          />
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Pitch</span>
            <span className={`text-sm font-mono ${theme.text} font-semibold`}>{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%</span>
          </div>
          <div className="relative h-2">
            <div className="absolute inset-0 bg-zinc-900 rounded-full" />
            <div
              className={`absolute h-2 ${theme.slider} rounded-full transition-all`}
              style={{ width: `${((pitch + 8) / 16) * 100}%` }}
            />
            <input
              type="range"
              min={-8}
              max={8}
              step={0.1}
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-600">
            <span>-8%</span>
            <span>0</span>
            <span>+8%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
