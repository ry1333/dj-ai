import { useState } from 'react'
import DeckHeader from './DeckHeader'
import XYFxPad from './XYFxPad'
import LoopCluster from './LoopCluster'
import VerticalFader from './ui/VerticalFader'

type Props = {
  label: string
  deck: any
  playing: boolean
  fileName: string
  bpm: number
  progress: number
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
  progress,
  onBpmChange,
  onLoad,
  onPlay,
  onPause,
  onCue
}: Props) {
  const [pitch, setPitch] = useState(0)
  const [loopLength, setLoopLength] = useState(4)
  const [isLoopActive, setIsLoopActive] = useState(false)

  const handlePitchChange = (value: number) => {
    setPitch(value)
    deck.setRate(1 + value / 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onLoad(file)
  }

  const handleSeek = (position: number) => {
    const duration = deck.buffer?.duration || 0
    deck.seek(position * duration)
  }

  const handleXYChange = (x: number, y: number) => {
    // x = mix/wet, y = filter frequency (exponential)
    // Validate inputs to prevent NaN/Infinity
    if (!isFinite(x) || !isFinite(y)) return

    const filterFreq = 200 + (Math.pow(y, 2) * 19800)

    // Ensure filterFreq is finite and within valid range
    if (isFinite(filterFreq) && filterFreq >= 20 && filterFreq <= 20000) {
      deck.setFilterHz(filterFreq)
    }
    // For now, just set filter. In full implementation, you'd have a wet/dry mix parameter
  }

  const handleLoopToggle = () => {
    setIsLoopActive(!isLoopActive)
    // In full implementation, you'd tell the deck to enable/disable looping
  }

  return (
    <div className={`rounded-2xl border border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden h-full flex flex-col ${playing ? 'deck--active' : ''}`}>
      {/* Deck Header with mini waveform */}
      <DeckHeader
        title={fileName}
        currentTime={deck.currentTime}
        duration={deck.buffer?.duration || 0}
        buffer={deck.buffer}
        progress={progress}
        onSeek={handleSeek}
      />

      {/* Main content area */}
      <div className="flex-1 p-8 space-y-6 flex flex-col overflow-y-auto">
        {/* Deck label */}
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

        {/* Transport Controls - Play filled, others stroked */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onPlay}
            disabled={!deck.buffer}
            title="Play"
            className="w-14 h-14 rounded-xl bg-accent hover:bg-accent-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(225,29,132,0.4),0_2px_8px_rgba(0,0,0,0.3)]"
          >
            ▶
          </button>
          <button
            onClick={onPause}
            title="Pause"
            className="w-12 h-12 rounded-lg border-2 border-white/10 hover:border-accent hover:bg-black/40 text-rmxrtext hover:text-accent-400 font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            ⏸
          </button>
          <button
            onClick={onCue}
            title="Cue (Return to start)"
            className="w-12 h-12 rounded-lg border-2 border-white/10 hover:border-accent hover:bg-black/40 text-rmxrtext hover:text-accent-400 font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            ⏮
          </button>
        </div>

        {/* Load Button */}
        <label className="block">
          <div className="w-full border border-white/10 hover:border-accent hover:bg-black/40 bg-black/20 text-rmxrtext hover:text-accent-400 font-semibold py-3 rounded-xl transition-all cursor-pointer text-center text-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
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
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-3xl font-bold font-mono text-center text-rmxrtext focus:outline-none focus:border-accent transition-colors shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Pitch - Vertical Fader */}
          <div className="flex justify-center">
            <VerticalFader
              value={pitch}
              min={-8}
              max={8}
              step={0.1}
              onChange={handlePitchChange}
              label="PITCH"
              unit="%"
              height={180}
              accentColor="magenta"
            />
          </div>
        </div>

        {/* XY FX Pad */}
        <XYFxPad onXYChange={handleXYChange} />

        {/* Loop Cluster */}
        <LoopCluster
          loopLength={loopLength}
          isLoopActive={isLoopActive}
          onLengthChange={setLoopLength}
          onToggle={handleLoopToggle}
        />
      </div>
    </div>
  )
}
