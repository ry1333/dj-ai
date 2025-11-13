import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'

type FeedCardProps = {
  id: string
  src: string
  user: string
  avatar?: string
  caption: string
  bpm?: number
  genre?: string
  duration?: string
  loves?: number
  comments?: number
  hasLoved?: boolean
}

export default function FeedCard({
  src,
  user,
  avatar,
  caption,
  bpm,
  genre,
  duration = '0:30',
  loves = 0,
  comments = 0,
  hasLoved = false
}: FeedCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(percent || 0)

      const minutes = Math.floor(audio.currentTime / 60)
      const seconds = Math.floor(audio.currentTime % 60)
      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative h-full w-full flex items-end justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-surface to-ink" />

      {/* Content card - centered */}
      <div className="relative w-full max-w-md mx-auto mb-32 md:mb-20 px-4 z-10">
        <div className="rounded-2xl border border-line bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Media area - 16:9 aspect */}
          <div className="relative aspect-video bg-gradient-to-br from-surface to-ink flex items-center justify-center">
            {/* Waveform visualization placeholder */}
            <div className="flex items-center gap-1 h-24">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-accentFrom to-accentTo rounded-full transition-all"
                  style={{
                    height: `${Math.random() * 100}%`,
                    opacity: i / 40 < progress / 100 ? 1 : 0.2,
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <svg className="w-8 h-8 text-ink" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-ink ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Footer with metadata */}
          <div className="p-4 space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-line">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-surface text-text">
                  {user.charAt(1)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text text-sm">{user}</div>
                <div className="text-muted text-xs truncate">{caption}</div>
              </div>
            </div>

            {/* Metadata pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {bpm && (
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                  {bpm} BPM
                </Badge>
              )}
              {genre && (
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                  {genre}
                </Badge>
              )}
              <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                {currentTime} / {duration}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-line rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accentFrom to-accentTo rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  )
}
