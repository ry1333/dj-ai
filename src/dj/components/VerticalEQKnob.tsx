import { useState, useRef, useEffect } from 'react'

interface VerticalEQKnobProps {
  label: string
  value: number // -12 to 12 dB
  onChange: (value: number) => void
  color: 'A' | 'B'
  disabled?: boolean
}

export function VerticalEQKnob({ label, value, onChange, color, disabled }: VerticalEQKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const gradientColor = color === 'A' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-blue-500'

  // Convert dB value (-12 to 12) to percentage (0 to 100, inverted for vertical)
  const percentage = ((12 - value) / 24) * 100

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.clientY)
  }

  const updateValue = (clientY: number) => {
    if (!containerRef.current || disabled) return

    const rect = containerRef.current.getBoundingClientRect()
    const y = clientY - rect.top
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100))

    // Convert percentage back to dB (-12 to 12, inverted)
    const newValue = 12 - (percentage / 100) * 24
    const roundedValue = Math.round(newValue)

    onChange(roundedValue)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Knob container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className={`relative w-12 h-32 bg-surface/50 rounded-full border border-line ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-ns-resize'
        }`}
      >
        {/* Fill */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${gradientColor} rounded-full transition-all`}
          style={{ height: `${100 - percentage}%` }}
        />

        {/* Center line (0 dB) */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2" />

        {/* Thumb */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-10 h-3 bg-white rounded-full shadow-lg transition-all ${
            isDragging ? 'scale-110' : ''
          }`}
          style={{ top: `${percentage}%`, transform: `translate(-50%, -50%)` }}
        />

        {/* Tick marks */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute left-0 w-2 h-0.5 bg-line/50"
              style={{ top: `${tick}%` }}
            />
          ))}
        </div>
      </div>

      {/* Label and value */}
      <div className="text-center">
        <div className="text-xs text-muted font-medium">{label}</div>
        <div className="text-xs text-text font-mono mt-0.5">
          {value > 0 ? '+' : ''}{value}
        </div>
      </div>
    </div>
  )
}
