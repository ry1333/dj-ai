import { useEffect } from 'react'
import { StudioDeck } from '../dj/components/StudioDeck'
import { StudioMixer } from '../dj/components/StudioMixer'
import { StudioFooter } from '../dj/components/StudioFooter'
import { useDJ } from '../dj/store'

export default function DJStudio() {
  const updatePositions = useDJ((state) => state.updatePositions)

  // Update playback positions every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      updatePositions()
    }, 100)

    return () => clearInterval(interval)
  }, [updatePositions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-surface to-ink text-text">
      {/* Header */}
      <div className="border-b border-line bg-surface/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                RMXR
              </h1>
              <div className="flex gap-1">
                <button className="px-6 py-2 text-sm font-medium text-text border-b-2 border-pink-500">
                  Studio
                </button>
                <button className="px-6 py-2 text-sm font-medium text-muted hover:text-text">
                  AI Mix
                </button>
                <button className="px-6 py-2 text-sm font-medium text-muted hover:text-text">
                  Library
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-text">REC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Layout: 3-Column Horizontal */}
      <div className="h-[calc(100vh-73px)] grid grid-cols-[1fr,auto,1fr] gap-6 p-6">
        {/* Left: Deck A */}
        <StudioDeck id="A" />

        {/* Center: Mixer */}
        <div className="w-[500px]">
          <StudioMixer />
        </div>

        {/* Right: Deck B */}
        <StudioDeck id="B" />
      </div>
    </div>
  )
}
