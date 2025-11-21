import { useEffect } from 'react'

type Props = {
  loopLength: number // in beats: 1, 2, 4, 8, 16
  isLoopActive: boolean
  onLengthChange: (length: number) => void
  onToggle: () => void
  enableKeyboard?: boolean
}

export default function LoopCluster({
  loopLength,
  isLoopActive,
  onLengthChange,
  onToggle,
  enableKeyboard = true
}: Props) {

  const halveLength = () => {
    if (loopLength > 1) {
      onLengthChange(loopLength / 2)
    }
  }

  const doubleLength = () => {
    if (loopLength < 16) {
      onLengthChange(loopLength * 2)
    }
  }

  // Keyboard shortcuts: Q = halve, W = double, L = toggle
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'q':
          e.preventDefault()
          halveLength()
          break
        case 'w':
          e.preventDefault()
          doubleLength()
          break
        case 'l':
          e.preventDefault()
          onToggle()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loopLength, enableKeyboard])

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted uppercase tracking-wide">
        LOOP
      </div>

      <div className="flex items-center gap-1">
        {/* Halve button */}
        <button
          onClick={halveLength}
          disabled={loopLength <= 1}
          className="p-2 rounded-lg bg-card border border-line text-muted hover:text-text hover:border-magenta/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Halve loop length (Q)"
        >
          <span className="text-lg font-bold">−</span>
        </button>

        {/* Loop length / toggle button */}
        <button
          onClick={onToggle}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            isLoopActive
              ? 'bg-magenta text-white border-2 border-magenta shadow-glow-magenta'
              : 'bg-card border-2 border-line text-text hover:border-magenta/50'
          }`}
          title="Toggle loop (L)"
        >
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs">▭</span>
            <span>{loopLength}</span>
          </div>
        </button>

        {/* Double button */}
        <button
          onClick={doubleLength}
          disabled={loopLength >= 16}
          className="p-2 rounded-lg bg-card border border-line text-muted hover:text-text hover:border-magenta/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Double loop length (W)"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
    </div>
  )
}
