import { Play, Pause } from 'lucide-react'
import { type DeckID } from '../store'

interface CircularPlatterProps {
  id: DeckID
  playing: boolean
  loaded: boolean
  position: number
  duration: number
  onPlayPause: () => void
}

export function CircularPlatter({
  id,
  playing,
  loaded,
  position,
  duration,
  onPlayPause,
}: CircularPlatterProps) {
  const progress = duration > 0 ? (position / duration) * 360 : 0
  const gradientColor = id === 'A' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-blue-500'

  return (
    <div className="relative aspect-square w-full max-w-[280px] mx-auto">
      {/* Outer gradient ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />

        {/* Progress arc */}
        {loaded && (
          <>
            <defs>
              <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={id === 'A' ? 'text-pink-500' : 'text-cyan-400'} stopColor="currentColor" />
                <stop offset="100%" className={id === 'A' ? 'text-purple-600' : 'text-blue-500'} stopColor="currentColor" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#gradient-${id})`}
              strokeWidth="3"
              strokeDasharray={`${(progress / 360) * 283} 283`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </>
        )}
      </svg>

      {/* Inner platter */}
      <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-surface via-ink to-surface border-2 border-line/30">
        {/* Vinyl grooves */}
        <div className="absolute inset-[8%] rounded-full border border-line/20" />
        <div className="absolute inset-[16%] rounded-full border border-line/20" />
        <div className="absolute inset-[24%] rounded-full border border-line/20" />
        <div className="absolute inset-[32%] rounded-full border border-line/20" />

        {/* Center button */}
        <button
          onClick={onPlayPause}
          disabled={!loaded}
          className={`absolute inset-0 m-auto w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            loaded
              ? `bg-gradient-to-br ${gradientColor} hover:scale-105 active:scale-95`
              : 'bg-surface/50 cursor-not-allowed'
          }`}
        >
          {playing ? (
            <Pause className="w-8 h-8 text-ink" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 text-ink" fill="currentColor" />
          )}
        </button>

        {/* Rotation indicator */}
        {loaded && (
          <div
            className={`absolute top-[20%] left-1/2 w-0.5 h-[30%] bg-gradient-to-b ${gradientColor} origin-bottom transition-transform ${
              playing ? 'animate-[spin_2s_linear_infinite]' : ''
            }`}
            style={{ transform: 'translateX(-50%)' }}
          />
        )}
      </div>

      {/* Deck label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className={`text-6xl font-bold opacity-10 bg-gradient-to-br ${gradientColor} bg-clip-text text-transparent`}>
          {id}
        </div>
      </div>
    </div>
  )
}
