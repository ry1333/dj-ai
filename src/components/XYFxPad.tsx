import { useRef, useState } from 'react'

type Props = {
  onXYChange: (x: number, y: number) => void
  defaultX?: number
  defaultY?: number
}

export default function XYFxPad({ onXYChange, defaultX = 0.5, defaultY = 0.5 }: Props) {
  const [x, setX] = useState(defaultX)
  const [y, setY] = useState(defaultY)
  const [isLatched, setIsLatched] = useState(false)
  const padRef = useRef<HTMLDivElement>(null)
  const throttleRef = useRef<number>(0)

  const updatePosition = (clientX: number, clientY: number, latch: boolean) => {
    if (!padRef.current) return

    const rect = padRef.current.getBoundingClientRect()
    const newX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newY = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)) // Invert Y

    // Throttle updates to ~60fps
    const now = Date.now()
    if (now - throttleRef.current < 16) return
    throttleRef.current = now

    setX(newX)
    setY(newY)
    onXYChange(newX, newY)

    if (latch) {
      setIsLatched(true)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!padRef.current) return
    padRef.current.setPointerCapture(e.pointerId)

    const isLatchKey = e.metaKey || e.ctrlKey
    updatePosition(e.clientX, e.clientY, isLatchKey)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return
    const isLatchKey = e.metaKey || e.ctrlKey
    updatePosition(e.clientX, e.clientY, isLatchKey)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!padRef.current) return
    padRef.current.releasePointerCapture(e.pointerId)

    // Reset to center if not latched
    if (!isLatched && !(e.metaKey || e.ctrlKey)) {
      setX(defaultX)
      setY(defaultY)
      onXYChange(defaultX, defaultY)
    }
  }

  const handleDoubleClick = () => {
    // Reset to center
    setX(defaultX)
    setY(defaultY)
    setIsLatched(false)
    onXYChange(defaultX, defaultY)
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center">
        FX Pad
      </div>

      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        className={`relative w-full aspect-square bg-surface border-2 rounded-xl cursor-crosshair transition-all ${
          isLatched ? 'border-accent' : 'border-rmxrborder'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Crosshair lines */}
        <div
          className="absolute w-px bg-muted/30 h-full pointer-events-none"
          style={{ left: `${x * 100}%` }}
        />
        <div
          className="absolute h-px bg-muted/30 w-full pointer-events-none"
          style={{ top: `${(1 - y) * 100}%` }}
        />

        {/* Touch point */}
        <div
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-accent border-2 border-bg shadow-lg pointer-events-none transition-all"
          style={{
            left: `${x * 100}%`,
            top: `${(1 - y) * 100}%`,
          }}
        />

        {/* Center indicator (subtle) */}
        <div
          className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full border border-muted/30 pointer-events-none"
          style={{ left: '50%', top: '50%' }}
        />
      </div>

      <div className="flex justify-between text-[9px] text-muted">
        <span>Mix: {Math.round(x * 100)}%</span>
        <span className="text-center">
          {isLatched ? '🔒 Latched' : 'Hold ⌘/Ctrl to latch'}
        </span>
        <span>Freq: {Math.round(200 + (Math.pow(y, 2) * 19800))}Hz</span>
      </div>

      <div className="text-[9px] text-center text-muted">
        Double-click to reset
      </div>
    </div>
  )
}
