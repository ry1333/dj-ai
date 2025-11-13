import { useRef, useState, useEffect } from 'react'

interface XYPadProps {
  x: number // 0-1, horizontal (mix/wet)
  y: number // 0-1, vertical (freq or main param)
  onChange: (x: number, y: number) => void
  latched?: boolean
  onLatchChange?: (latched: boolean) => void
}

export default function XYPad({ x, y, onChange, latched = false, onLatchChange }: XYPadProps) {
  const padRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const lastUpdate = useRef(0)
  const THROTTLE_MS = 16 // ~60fps

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!padRef.current) return

    const rect = padRef.current.getBoundingClientRect()
    const newX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    // Throttle updates
    const now = Date.now()
    if (now - lastUpdate.current >= THROTTLE_MS) {
      onChange(newX, newY)
      lastUpdate.current = now
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    handlePointerMove(e)
    if (e.metaKey || e.ctrlKey) {
      // Latch mode
      onLatchChange?.(!latched)
    }
  }

  const handlePointerUp = () => {
    if (!latched) {
      setIsDragging(false)
    }
  }

  const handleDoubleClick = () => {
    // Reset to center
    onChange(0.5, 0.5)
  }

  // Get frequency from y position (exponential)
  const getFrequency = (y: number) => {
    const MIN_HZ = 200
    const MAX_HZ = 20000
    return Math.round(MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, 1 - y))
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted">FX PAD</label>
        <div className="text-[10px] font-mono text-muted">
          {(x * 100).toFixed(0)}% • {getFrequency(y)}Hz
        </div>
      </div>

      {/* Pad */}
      <div
        ref={padRef}
        className={`relative w-full aspect-square bg-ink border-2 rounded-lg cursor-crosshair transition-all ${
          latched ? 'border-magenta shadow-glow-magenta' : 'border-line hover:border-line/50'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={isDragging ? handlePointerMove : undefined}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        {/* Crosshair lines */}
        <div
          className="absolute w-full h-px bg-muted/20"
          style={{ top: `${y * 100}%` }}
        />
        <div
          className="absolute h-full w-px bg-muted/20"
          style={{ left: `${x * 100}%` }}
        />

        {/* Control point */}
        <div
          className="absolute w-4 h-4 -mt-2 -ml-2 rounded-full bg-magenta shadow-glow-magenta transition-all"
          style={{
            left: `${x * 100}%`,
            top: `${y * 100}%`,
          }}
        />
      </div>

      {/* Instructions */}
      <div className="text-[10px] text-muted">
        ⌘/Ctrl+click to latch • Double-click to reset
      </div>
    </div>
  )
}
