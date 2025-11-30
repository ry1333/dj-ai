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
  deckId?: 'A' | 'B'
}

export default function RotaryKnob({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  size = 64,
  deckId
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
    <div className="flex flex-col items-center gap-2 select-none group">
      {/* Knob Container with Progress Ring */}
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative cursor-ns-resize"
        style={{ width: size + 8, height: size + 8, touchAction: 'none' }}
      >
        {/* Progress Ring Background */}
        <svg className="absolute w-full h-full p-1 rotate-[135deg]" viewBox="0 0 100 100">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#27272a"
            strokeWidth="6"
            strokeDasharray="264"
            strokeDashoffset="66"
          />
          {/* Progress arc - magenta/cyan based on deckId */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={deckId === 'A' ? '#d946ef' : deckId === 'B' ? '#06b6d4' : '#71717a'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="264"
            strokeDashoffset={264 - percentage * 198}
            className="transition-all duration-75"
          />
        </svg>

        {/* Knob Body */}
        <div
          className="absolute inset-0 m-auto w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full bg-dark-700 shadow-inner-knob flex items-start justify-center pt-1"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Position indicator */}
          <div className="w-1 h-3 rounded-full bg-white"></div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 m-auto w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Label */}
      {label && (
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          {label}
        </span>
      )}

      {/* Value Display */}
      <div className="text-xs font-mono font-bold text-white">
        {formatValue(value)}
      </div>
    </div>
  )
}
