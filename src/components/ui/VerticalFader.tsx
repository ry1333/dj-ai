import { useRef } from 'react'

type Props = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  height?: number
  accentColor?: 'cyan' | 'magenta' | 'neutral'
}

export default function VerticalFader({
  value,
  min,
  max,
  step = 0.1,
  onChange,
  label,
  unit = '',
  height = 200,
  accentColor = 'neutral'
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const updateFromPosition = (clientY: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top))
    const newPercentage = 1 - (y / rect.height)
    const newValue = min + (newPercentage * (max - min))
    const steppedValue = Math.round(newValue / step) * step
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return
    trackRef.current.setPointerCapture(e.pointerId)
    updateFromPosition(e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return
    updateFromPosition(e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!trackRef.current) return
    trackRef.current.releasePointerCapture(e.pointerId)
  }

  const accentColors = {
    cyan: 'bg-cyan-400',
    magenta: 'bg-accent',
    neutral: 'bg-zinc-400'
  }

  const accentGlow = {
    cyan: 'shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    magenta: 'shadow-[0_0_8px_rgba(225,29,132,0.4)]',
    neutral: 'shadow-[0_0_4px_rgba(161,161,170,0.3)]'
  }

  const formatValue = (val: number) => {
    if (val > 0) return `+${val.toFixed(1)}${unit}`
    return `${val.toFixed(1)}${unit}`
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Value Display */}
      <div className="text-sm font-mono font-bold text-accent-400">
        {formatValue(value)}
      </div>

      {/* Fader Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative cursor-pointer select-none"
        style={{ height: `${height}px`, touchAction: 'none' }}
      >
        {/* Dual Rail Background */}
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-full flex gap-1">
          {/* Left rail */}
          <div className="flex-1 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
          {/* Right rail */}
          <div className="flex-1 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Active Fill */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2 rounded-full transition-all ${accentColors[accentColor]} ${accentGlow[accentColor]} opacity-60`}
          style={{
            bottom: 0,
            height: `${percentage}%`
          }}
        />

        {/* Fader Thumb */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-12 transition-all"
          style={{
            bottom: `calc(${percentage}% - 24px)`
          }}
        >
          {/* Main thumb body - metallic gradient */}
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] border border-zinc-500/50">
            {/* Grip lines */}
            <div className="flex flex-col items-center justify-center h-full gap-1 px-2">
              <div className="w-full h-px bg-zinc-400/60" />
              <div className="w-full h-px bg-zinc-400/60" />
              <div className="w-full h-px bg-zinc-400/60" />
            </div>
          </div>
        </div>

        {/* Center marker (0 position if in range) */}
        {min < 0 && max > 0 && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-px bg-accent/40"
            style={{
              bottom: `${((0 - min) / (max - min)) * 100}%`
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <div className="text-[9px] text-muted uppercase tracking-wider font-semibold">
          {label}
        </div>
      )}
    </div>
  )
}
