import { useState, useRef, useEffect } from 'react'
import { Play, Pause, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'

export interface Mix {
  id: string
  src: string
  user: string
  avatar?: string
  caption: string
  bpm: number
  genre: string
  mood?: string
  duration?: string
  loves: number
  comments: number
}

interface HeroMixCardProps {
  mix: Mix
  onPlayStateChange?: (playing: boolean) => void
}

export function HeroMixCard({ mix, onPlayStateChange }: HeroMixCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30)
  const [hasError, setHasError] = useState(false)

  // Generate stable waveform heights
  const waveformHeights = useRef(
    Array.from({ length: 50 }, () => 20 + Math.random() * 80)
  ).current

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onPlayStateChange?.(false)
    }

    const handleError = () => {
      setIsPlaying(false)
      setHasError(true)
      onPlayStateChange?.(false)
    }

    const handleLoadedData = () => {
      setHasError(false)
      if (audio.duration) setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadeddata', handleLoadedData)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [mix.src, onPlayStateChange])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
        onPlayStateChange?.(false)
      } else {
        await audio.play()
        setIsPlaying(true)
        onPlayStateChange?.(true)
      }
    } catch (error) {
      console.error('Playback error:', error)
      setIsPlaying(false)
      onPlayStateChange?.(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = (value[0] / 100) * audio.duration
    setProgress(value[0])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-shadow duration-500">
      {/* Vinyl Section */}
      <div className="relative aspect-square bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-pink-500/20 blur-[80px] rounded-full" />
        </div>

        {/* Vinyl Record */}
        <div className="relative">
          <div className={`relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            {/* Grooves */}
            <div className="absolute inset-3 rounded-full border border-zinc-700/30" />
            <div className="absolute inset-6 rounded-full border border-zinc-700/30" />
            <div className="absolute inset-9 rounded-full border border-zinc-700/30" />
            <div className="absolute inset-12 rounded-full border border-zinc-700/30" />
            <div className="absolute inset-[3.75rem] rounded-full border border-zinc-700/30" />

            {/* Label */}
            <div className="absolute inset-[4.5rem] rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <div className="text-center">
                <div className="text-xs font-black text-black tracking-wider">RMXR</div>
                <div className="text-[8px] text-black/70 font-medium">{mix.genre}</div>
              </div>
            </div>

            {/* Center hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-zinc-950 border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

            {/* Reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
          </div>

          {/* Glow ring when playing */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse" style={{ animationDuration: '2s' }} />
          )}
        </div>

        {/* Play/Pause Button Overlay */}
        <Button
          onClick={togglePlay}
          size="lg"
          className={`absolute w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${
            hasError
              ? 'bg-red-500/80 hover:bg-red-500'
              : 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 hover:scale-110 active:scale-95'
          } ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
        >
          {hasError ? (
            <AlertTriangle className="w-10 h-10 text-white" />
          ) : isPlaying ? (
            <Pause className="w-10 h-10 text-black" fill="currentColor" />
          ) : (
            <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
          )}
        </Button>

        {/* Error message */}
        {hasError && (
          <Badge variant="destructive" className="absolute bottom-4 text-xs">
            Audio not available
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Waveform / Progress */}
        <div className="space-y-2">
          <div className="flex items-end justify-center gap-[2px] h-12 px-2">
            {waveformHeights.map((height, i) => {
              const isPlayed = (i / waveformHeights.length) * 100 < progress
              return (
                <div
                  key={i}
                  className={`flex-1 max-w-1 rounded-full transition-all duration-150 ${
                    isPlayed
                      ? 'bg-gradient-to-t from-cyan-500 to-pink-500'
                      : 'bg-zinc-700'
                  } ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 20}ms`,
                    animationDuration: '1s'
                  }}
                />
              )
            })}
          </div>

          {/* Seekable Progress */}
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-cyan-500 [&_.bg-primary]:to-pink-500"
          />

          {/* Time */}
          <div className="flex justify-between text-xs font-mono text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-zinc-700">
            <AvatarImage src={mix.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-black font-bold">
              {mix.user.charAt(1)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm">{mix.user}</div>
            <div className="text-zinc-400 text-xs truncate">{mix.caption}</div>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono">
            {mix.bpm} BPM
          </Badge>
          <Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border-pink-500/30">
            {mix.genre}
          </Badge>
          {mix.mood && (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
              {mix.mood}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">Playing from: For You</span>
          <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
            30s Mix
          </Badge>
        </div>
      </CardContent>

      {/* Hidden audio */}
      <audio ref={audioRef} src={mix.src} preload="metadata" />
    </Card>
  )
}
