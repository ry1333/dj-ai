import { useState } from 'react'
import { Play, Pause, SkipBack, FolderOpen, Upload, Library, Music, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import DeckHeader from './DeckHeader'
import XYFxPad from './XYFxPad'
import LoopCluster from './LoopCluster'
import VerticalFader from './ui/VerticalFader'
import TrackLibrary from './TrackLibrary'
import LocalTrackLibrary from './LocalTrackLibrary'

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
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'local'>('local')
  const [libraryCollapsed, setLibraryCollapsed] = useState(false)

  const handlePitchChange = (value: number) => {
    setPitch(value)
    deck.setRate(1 + value / 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onLoad(file)
  }

  const handleLibraryTrackSelect = async (audioUrl: string, caption: string, bpm: number) => {
    try {
      toast.info(`Loading ${caption}...`)
      await deck.loadFromUrl(audioUrl)
      onBpmChange(bpm)
      toast.success('Track loaded!')
    } catch (error) {
      console.error('Failed to load track:', error)
      toast.error('Failed to load track')
    }
  }

  const handleSeek = (position: number) => {
    const duration = deck.buffer?.duration || 0
    deck.seek(position * duration)
  }

  const handleXYChange = (x: number, y: number) => {
    // x = mix/wet (0-1), y = filter frequency (0-1, exponential)
    // Validate inputs to prevent NaN/Infinity
    if (!isFinite(x) || !isFinite(y)) return

    // Exponential mapping: 200Hz to 20kHz
    const MIN_HZ = 200
    const MAX_HZ = 20000
    const filterFreq = MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, 1 - y)

    // Ensure filterFreq is finite and within valid range
    if (isFinite(filterFreq) && filterFreq >= 20 && filterFreq <= 20000) {
      deck.setFilterHz(filterFreq)
    }
    // x parameter reserved for future wet/dry mix control
  }

  const handleLoopToggle = () => {
    const newLoopState = !isLoopActive
    setIsLoopActive(newLoopState)
    deck.setLoop(newLoopState, loopLength)
  }

  const handleLoopLengthChange = (length: number) => {
    setLoopLength(length)
    if (isLoopActive) {
      deck.setLoop(true, length)
    }
  }

  return (
    <div className={`rounded-2xl border border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col ${playing ? 'deck--active' : ''}`}>
      {/* Deck Header with mini waveform */}
      <DeckHeader
        title={fileName}
        currentTime={deck.currentTime}
        duration={deck.buffer?.duration || 0}
        buffer={deck.buffer}
        progress={progress}
        onSeek={handleSeek}
      />

      {/* Main content area - Optimized spacing */}
      <div className="p-4 space-y-3 flex flex-col min-h-0">
        {/* Deck label */}
        <div className="text-xs font-semibold text-muted tracking-widest uppercase">
          Deck {label}
        </div>

        {/* Enhanced Vinyl Turntable - Compact Size */}
        <div className="flex items-center justify-center">
          <div className={`
            relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full
            ${playing ? 'animate-spin-slow' : ''}
            transition-all duration-500
          `}>
            {/* Outer Glow Effect when playing */}
            {playing && (
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent blur-xl animate-pulse" />
            )}

            {/* Vinyl Record */}
            <div className={`
              relative w-full h-full rounded-full
              bg-gradient-to-br from-gray-900 via-gray-800 to-black
              border-4 ${playing ? 'border-accent/50 shadow-[0_0_30px_rgba(225,29,132,0.5)]' : 'border-white/10'}
              transition-all duration-300
            `}>
              {/* Vinyl grooves - multiple rings */}
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-7 rounded-full border border-white/5" />
              <div className="absolute inset-10 rounded-full border border-white/5" />
              <div className="absolute inset-[3.25rem] rounded-full border border-white/5" />
              <div className="absolute inset-14 rounded-full border border-white/5" />
              <div className="absolute inset-[3.75rem] rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/5" />
              <div className="absolute inset-[4.25rem] rounded-full border border-white/5" />
              <div className="absolute inset-[4.5rem] rounded-full border border-white/5" />

              {/* Center label area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`
                  w-20 h-20 rounded-full
                  bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900
                  border-2 ${playing ? 'border-accent/80' : 'border-white/20'}
                  flex items-center justify-center
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]
                  transition-all duration-300
                `}>
                  {/* Spindle hole */}
                  <div className="w-4 h-4 rounded-full bg-black border border-white/30" />
                </div>
              </div>

              {/* Tonearm indicator dot (rotates with vinyl) */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(225,29,132,0.8)]" />

              {/* Track name label on vinyl */}
              {fileName && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-[10px] text-center text-white/60 px-3 max-w-[100px] truncate font-semibold tracking-wider">
                    {fileName.split('.')[0].substring(0, 12)}
                  </div>
                </div>
              )}
            </div>

            {/* Playback indicator LED */}
            {playing && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(225,29,132,1)] animate-pulse" />
            )}
          </div>
        </div>

        {/* Enhanced Transport Controls - Unified Style */}
        <div className="flex items-center justify-center gap-3">
          {/* Play Button */}
          <button
            onClick={onPlay}
            disabled={!deck.buffer}
            title="Play"
            className={`
              relative w-14 h-14 rounded-xl border-2
              ${playing
                ? 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(225,29,132,0.6)]'
                : 'border-white/10 hover:border-accent hover:bg-accent/10'
              }
              disabled:opacity-30 disabled:cursor-not-allowed
              text-rmxrtext hover:text-accent-400
              flex items-center justify-center
              transition-all hover:scale-110 active:scale-95
              shadow-[0_2px_8px_rgba(0,0,0,0.3)]
            `}
          >
            <Play className={`w-6 h-6 ${playing ? 'fill-accent' : ''}`} />
            {playing && (
              <div className="absolute inset-0 rounded-xl border-2 border-accent/50 animate-pulse" />
            )}
          </button>

          {/* Pause Button */}
          <button
            onClick={onPause}
            title="Pause"
            className="w-14 h-14 rounded-xl border-2 border-white/10 hover:border-accent hover:bg-accent/10 text-rmxrtext hover:text-accent-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            <Pause className="w-6 h-6" />
          </button>

          {/* Cue Button */}
          <button
            onClick={onCue}
            title="Cue (Return to start)"
            className="w-14 h-14 rounded-xl border-2 border-white/10 hover:border-accent hover:bg-accent/10 text-rmxrtext hover:text-accent-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            <SkipBack className="w-6 h-6" />
          </button>
        </div>

        {/* Tab System for Local/Upload/Library - Collapsible */}
        <div className="space-y-3">
          {/* Header with Tab Buttons + Collapse Toggle */}
          <div className="flex items-center gap-2">
            {/* Tab Buttons */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              <button
                onClick={() => setActiveTab('local')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'local'
                    ? 'bg-gradient-to-r from-cyan to-magenta text-ink shadow-glow-cyan'
                    : 'bg-black/40 border border-white/10 text-muted hover:text-rmxrtext hover:border-cyan/50'
                }`}
              >
                <Music className="w-3 h-3" />
                Tracks
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-cyan to-magenta text-ink shadow-glow-cyan'
                    : 'bg-black/40 border border-white/10 text-muted hover:text-rmxrtext hover:border-cyan/50'
                }`}
              >
                <Upload className="w-3 h-3" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'library'
                    ? 'bg-gradient-to-r from-cyan to-magenta text-ink shadow-glow-cyan'
                    : 'bg-black/40 border border-white/10 text-muted hover:text-rmxrtext hover:border-cyan/50'
                }`}
              >
                <Library className="w-3 h-3" />
                Feed
              </button>
            </div>

            {/* Collapse/Expand Button */}
            <button
              onClick={() => setLibraryCollapsed(!libraryCollapsed)}
              className="shrink-0 w-9 h-9 rounded-lg bg-black/40 border border-white/10 text-muted hover:text-cyan hover:border-cyan/50 flex items-center justify-center transition-all"
              title={libraryCollapsed ? 'Expand library' : 'Collapse library'}
            >
              {libraryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Tab Content - Collapsible */}
          {!libraryCollapsed && (
            <>
              {activeTab === 'local' ? (
                <LocalTrackLibrary onSelect={handleLibraryTrackSelect} />
              ) : activeTab === 'upload' ? (
                <label className="block">
                  <div className={`
                    w-full border-2
                    ${fileName
                      ? 'border-cyan/50 bg-cyan/10 text-cyan'
                      : 'border-white/10 bg-black/20 text-rmxrtext hover:border-cyan hover:bg-black/40 hover:text-cyan'
                    }
                    font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm
                    shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                    flex items-center justify-center gap-2
                    hover:scale-102 active:scale-98
                  `}>
                    <FolderOpen className="w-5 h-5" />
                    <span>{fileName ? 'Change Track' : 'Load Track'}</span>
                    {fileName && (
                      <div className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-glow-cyan" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <TrackLibrary onSelect={handleLibraryTrackSelect} />
              )}
            </>
          )}
        </div>

        {/* BPM + Pitch - Compact */}
        <div className="space-y-2">
          {/* BPM - Smaller for space */}
          <div>
            <div className="text-[10px] uppercase text-muted font-semibold tracking-wider mb-1">BPM</div>
            <input
              type="number"
              value={bpm}
              onChange={(e) => onBpmChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-2xl font-bold font-mono text-center text-rmxrtext focus:outline-none focus:border-accent transition-colors shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Pitch - Compact Vertical Fader */}
          <div className="flex justify-center">
            <VerticalFader
              value={pitch}
              min={-8}
              max={8}
              step={0.1}
              onChange={handlePitchChange}
              label="PITCH"
              unit="%"
              height={120}
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
          onLengthChange={handleLoopLengthChange}
          onToggle={handleLoopToggle}
        />
      </div>
    </div>
  )
}
