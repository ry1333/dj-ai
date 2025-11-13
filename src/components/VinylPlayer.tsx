import { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

type VinylPlayerProps = {
  audioUrl: string
  bpm?: number
  musicalKey?: string
  style?: string
  isPlaying?: boolean
  onPlayPause?: (playing: boolean) => void
}

export default function VinylPlayer({
  audioUrl,
  bpm,
  musicalKey,
  style,
  isPlaying: externalIsPlaying,
  onPlayPause
}: VinylPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Sync with external playing state if provided
  useEffect(() => {
    if (externalIsPlaying !== undefined) {
      setIsPlaying(externalIsPlaying)
      if (audioRef.current) {
        if (externalIsPlaying) {
          audioRef.current.play().catch(console.error)
        } else {
          audioRef.current.pause()
        }
      }
    }
  }, [externalIsPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onPlayPause?.(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onPlayPause])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      onPlayPause?.(false)
    } else {
      audio.play().catch(console.error)
      setIsPlaying(true)
      onPlayPause?.(true)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const bounds = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - bounds.left) / bounds.width
    const newTime = percent * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Vinyl Disc Container */}
      <div className="relative aspect-square w-full">
        {/* Outer Glow Effect */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${
            isPlaying ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)'
          }}
        />

        {/* Spinning Vinyl Disc */}
        <div
          className={`relative w-full h-full rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-black shadow-2xl ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{
            animationDuration: '3s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        >
          {/* Vinyl Grooves Effect */}
          <div className="absolute inset-0 rounded-full opacity-30">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{
                  inset: `${8 + i * 6}%`,
                }}
              />
            ))}
          </div>

          {/* Center Label - Clean minimal design */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative w-1/3 h-1/3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg ${
                isPlaying ? 'animate-pulse-slow' : ''
              }`}
            >
              {/* Holographic Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Play/Pause Button Overlay */}
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div
            className={`w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center transition-all duration-300 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100' : 'opacity-100 scale-100'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-neutral-900 fill-neutral-900" />
            ) : (
              <Play className="w-10 h-10 text-neutral-900 fill-neutral-900 ml-1" />
            )}
          </div>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 space-y-2">
        <div
          onClick={handleSeek}
          className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden group relative"
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-150 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Progress Glow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-sm text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Audio Visualizer Bars */}
      {isPlaying && (
        <div className="mt-8 flex justify-center gap-1 h-8 items-end">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cyan-500 to-purple-600 rounded-full animate-audio-bar"
              style={{
                animationDelay: `${i * 0.05}s`,
                height: '20%'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
