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
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center">
        Loop
      </div>

      <div className="flex items-center gap-2">
        {/* Halve button */}
        <button
          onClick={halveLength}
          disabled={loopLength <= 1}
          className="w-10 h-10 rounded-lg border-2 border-rmxrborder bg-surface hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 font-bold transition-all"
          title="Halve loop length (Q)"
        >
          −
        </button>

        {/* Loop length / toggle button */}
        <button
          onClick={onToggle}
          className={`flex-1 h-10 rounded-lg border-2 font-mono font-bold text-lg transition-all ${
            isLoopActive
              ? 'border-accent bg-accent/20 text-accent-400'
              : 'border-rmxrborder bg-surface hover:border-accent hover:bg-surface2 text-rmxrtext hover:text-accent-400'
          }`}
          title="Toggle loop (L)"
        >
          {loopLength}
        </button>

        {/* Double button */}
        <button
          onClick={doubleLength}
          disabled={loopLength >= 16}
          className="w-10 h-10 rounded-lg border-2 border-rmxrborder bg-surface hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 font-bold transition-all"
          title="Double loop length (W)"
        >
          +
        </button>
      </div>

      <div className="text-[9px] text-center text-muted">
        {isLoopActive ? '🔁 Loop active' : 'Q/W: length · L: toggle'}
      </div>
    </div>
  )
}
