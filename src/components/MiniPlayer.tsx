import { useState, useEffect, useRef } from 'react'
import { Play, Pause, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type MiniPlayerProps = {
  src?: string
  user?: string
  caption?: string
  avatar?: string
  onExpand?: () => void
}

export default function MiniPlayer({ src, user, caption, avatar, onExpand }: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // If no source, don't show player
  if (!src) return null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(percent || 0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [src])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <>
      {/* Mini player - sticks above tab bar */}
      <div
        onClick={onExpand}
        className="fixed bottom-16 md:bottom-4 left-4 right-4 z-40 bg-card border border-line rounded-2xl backdrop-blur-xl shadow-2xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        {/* Progress bar on top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-line rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accentFrom to-accentTo transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 p-3">
          {/* Avatar */}
          <Avatar className="h-10 w-10 border border-line shrink-0">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-surface text-text text-sm">
              {user?.charAt(1)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="text-text text-sm font-semibold truncate">{user || 'Unknown'}</div>
            <div className="text-muted text-xs truncate">{caption || 'No caption'}</div>
          </div>

          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-ink" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5 text-ink ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Expand button */}
          {onExpand && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExpand()
              }}
              className="h-10 w-10 rounded-full border border-line flex items-center justify-center shrink-0 hover:bg-white/5 active:scale-95 transition-all text-muted hover:text-text"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </>
  )
}
