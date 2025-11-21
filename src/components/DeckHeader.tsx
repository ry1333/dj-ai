import { useEffect, useRef } from 'react'

type Props = {
  title: string
  currentTime: number
  duration: number
  buffer: AudioBuffer | null
  progress: number
  onSeek: (position: number) => void
  bpm?: number
  key?: string
  genre?: string
  energy?: number // 0-100
}

export default function DeckHeader({ title, currentTime, duration, buffer, progress, onSeek, bpm, key, genre, energy }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !buffer) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Draw mini waveform
    const data = buffer.getChannelData(0)
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    // Draw played region (magenta fill)
    ctx.fillStyle = 'rgba(225, 29, 132, 0.1)'
    ctx.fillRect(0, 0, width * progress, height)

    // Draw waveform peaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1

    ctx.beginPath()
    for (let i = 0; i < width; i++) {
      const slice = data.slice(i * step, (i + 1) * step)
      const max = slice.reduce((a, b) => Math.max(a, Math.abs(b)), 0)
      const y = height / 2
      const barHeight = max * amp

      ctx.moveTo(i, y - barHeight)
      ctx.lineTo(i, y + barHeight)
    }
    ctx.stroke()

    // Draw magenta playhead (thin line)
    ctx.strokeStyle = '#E11D84'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width * progress, 0)
    ctx.lineTo(width * progress, height)
    ctx.stroke()
  }, [buffer, progress])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const position = x / rect.width
    onSeek(position)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-b from-surface/80 to-ink/50 border-b border-line/50 px-4 py-2 space-y-2">
      {/* Top Row: Track Info */}
      <div className="flex items-center gap-3">
        {/* Music Icon */}
        <div className="shrink-0">
          <svg className="w-5 h-5 text-cyan" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-text truncate" title={title}>
            {title || 'No Track Loaded'}
          </div>
          {/* Metadata Pills */}
          <div className="flex items-center gap-2 mt-1">
            {genre && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-ink/60 text-muted border border-line/30">
                {genre}
              </span>
            )}
            {bpm && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan/10 text-cyan border border-cyan/30 font-mono">
                {Math.round(bpm)} BPM
              </span>
            )}
            {key && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-magenta/10 text-magenta border border-magenta/30">
                Key: {key}
              </span>
            )}
            {energy !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-muted uppercase">Energy:</span>
                <div className="w-16 h-1.5 bg-ink/60 rounded-full overflow-hidden border border-line/30">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                    style={{ width: `${energy}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted font-mono">{energy}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Timecode */}
        <div className="shrink-0 text-right">
          <div className="text-xs font-mono font-bold text-text">
            {formatTime(currentTime)}
          </div>
          <div className="text-[10px] font-mono text-muted">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Bottom Row: Mini Waveform */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={36}
          className="w-full h-8 cursor-pointer hover:opacity-90 transition-opacity rounded border border-line/30"
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
