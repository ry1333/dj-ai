import { useEffect, useRef } from 'react'

type Props = {
  title: string
  currentTime: number
  duration: number
  buffer: AudioBuffer | null
  progress: number
  onSeek: (position: number) => void
}

export default function DeckHeader({ title, currentTime, duration, buffer, progress, onSeek }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !buffer) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Draw mini waveform (simplified, only peaks)
    const data = buffer.getChannelData(0)
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    ctx.fillStyle = 'rgba(154, 154, 175, 0.3)' // var(--muted) with low opacity
    ctx.strokeStyle = 'rgba(154, 154, 175, 0.6)'
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

    // Draw magenta playhead
    ctx.strokeStyle = '#E11D84' // var(--accent)
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
    <div className="h-10 bg-surface border-b border-rmxrborder flex items-center px-4 gap-3">
      {/* Title */}
      <div className="text-xs text-rmxrtext font-semibold truncate max-w-[120px]" title={title}>
        {title || 'No Track'}
      </div>

      {/* Mini Waveform */}
      <div className="flex-1 h-full flex items-center cursor-pointer" onClick={handleClick}>
        <canvas
          ref={canvasRef}
          width={800}
          height={32}
          className="w-full h-8"
        />
      </div>

      {/* Timecode */}
      <div className="text-[10px] font-mono text-muted whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}
