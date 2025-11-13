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
    <div className="h-12 bg-card border-b border-line flex items-center px-4 gap-3">
      {/* Title */}
      <div className="text-sm text-text font-semibold truncate max-w-[180px]" title={title}>
        {title || 'No Track'}
      </div>

      {/* Mini Waveform */}
      <div className="flex-1 h-full flex items-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={36}
          className="w-full h-9 cursor-pointer hover:opacity-90 transition-opacity rounded"
          onClick={handleClick}
        />
      </div>

      {/* Timecode */}
      <div className="text-xs font-mono text-muted whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}
