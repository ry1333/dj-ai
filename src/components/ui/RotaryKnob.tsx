import { useRef } from 'react'

type Props = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  size?: number
}

export default function RotaryKnob({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  size = 64
}: Props) {
  const knobRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const startValue = useRef<number>(0)

  // Calculate rotation angle (-135deg to +135deg = 270deg range)
  const percentage = (value - min) / (max - min)
  const angle = -135 + (percentage * 270)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!knobRef.current) return
    knobRef.current.setPointerCapture(e.pointerId)
    startY.current = e.clientY
    startValue.current = value
    e.preventDefault()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return

    const deltaY = startY.current - e.clientY
    const sensitivity = 0.5
    const range = max - min
    const change = (deltaY * sensitivity * range) / 100

    let newValue = startValue.current + change

    // Apply step rounding
    if (step > 0) {
      newValue = Math.round(newValue / step) * step
    }

    // Clamp and validate
    newValue = Math.max(min, Math.min(max, newValue))

    if (isFinite(newValue)) {
      onChange(newValue)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!knobRef.current) return
    knobRef.current.releasePointerCapture(e.pointerId)
  }

  const formatValue = (val: number) => {
    if (!isFinite(val)) return '0.0' + unit

    if (unit === 'dB') {
      return val > 0 ? `+${val.toFixed(1)}${unit}` : `${val.toFixed(1)}${unit}`
    }
    if (unit === 'Hz') {
      if (val >= 1000) return `${(val / 1000).toFixed(1)}k Hz`
      return `${val.toFixed(0)} Hz`
    }
    return `${val.toFixed(1)}${unit}`
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      {label && (
        <div className="text-[10px] uppercase text-muted font-semibold tracking-wider">
          {label}
        </div>
      )}

      {/* Knob */}
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative cursor-ns-resize select-none"
        style={{ width: size, height: size, touchAction: 'none' }}
      >
        {/* SVG Knob */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="transform transition-transform duration-100"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <defs>
            {/* Metallic gray gradient */}
            <radialGradient id={`knobGradient-${label}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor="#71717a" />
              <stop offset="50%" stopColor="#52525b" />
              <stop offset="100%" stopColor="#3f3f46" />
            </radialGradient>
            {/* Highlight */}
            <radialGradient id={`highlightGradient-${label}`} cx="30%" cy="20%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Main knob body - gray metallic */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill={`url(#knobGradient-${label})`}
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="2"
          />

          {/* Highlight overlay */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill={`url(#highlightGradient-${label})`}
          />

          {/* Position indicator line - white */}
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="35"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="rgba(0,0,0,0.6)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </svg>

        {/* Subtle outer shadow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        />
      </div>

      {/* Value Display */}
      <div className="text-xs font-mono font-bold text-white">
        {formatValue(value)}
      </div>
    </div>
  )
}
