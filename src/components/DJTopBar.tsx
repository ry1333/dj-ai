import { Circle, Settings, Maximize, BarChart3, Home } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DJTopBarProps {
  isRecording: boolean
  onRecordToggle: () => void
  vuLevel: number
  onSettingsClick?: () => void
  onHomeClick?: () => void
}

export default function DJTopBar({ isRecording, onRecordToggle, vuLevel, onSettingsClick, onHomeClick }: DJTopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="relative h-12 bg-surface border-b border-line">
      {/* Concave corners mask */}
      <div
        className="absolute inset-0 bg-surface"
        style={{
          WebkitMask: `
            radial-gradient(24px at 0 100%, transparent 99%, #000 100%) left bottom,
            radial-gradient(24px at 100% 100%, transparent 99%, #000 100%) right bottom,
            linear-gradient(#000, #000)
          `,
          WebkitMaskSize: '24px 24px, 24px 24px, 100% 100%',
          WebkitMaskRepeat: 'no-repeat, no-repeat, no-repeat',
          WebkitMaskComposite: 'source-in',
          mask: `
            radial-gradient(24px at 0 100%, transparent 99%, #000 100%) left bottom,
            radial-gradient(24px at 100% 100%, transparent 99%, #000 100%) right bottom,
            linear-gradient(#000, #000)
          `,
          maskSize: '24px 24px, 24px 24px, 100% 100%',
          maskRepeat: 'no-repeat, no-repeat, no-repeat',
          maskComposite: 'intersect',
        }}
      />

      {/* Content */}
      <div className="relative h-full px-4 flex items-center justify-between">
        {/* Left: Home button + Title */}
        <div className="flex items-center gap-3">
          {/* Home button */}
          <button
            onClick={onHomeClick}
            className="p-2 rounded-lg text-muted hover:text-magenta hover:bg-card transition-all"
            title="Return to Listen"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-line" />

          <h1 className="text-lg font-bold text-text">DJ STUDIO</h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* VU Meter */}
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted" />
            <div className="flex items-center gap-0.5">
              {[...Array(8)].map((_, i) => {
                const threshold = (i + 1) / 8
                const isActive = vuLevel >= threshold
                return (
                  <div
                    key={i}
                    className="w-1 h-6 rounded-sm transition-all"
                    style={{
                      backgroundColor: isActive
                        ? threshold > 0.85
                          ? '#EF4444' // red
                          : threshold > 0.7
                          ? '#F59E0B' // orange
                          : '#E11D84' // magenta
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* REC Button */}
          <button
            onClick={onRecordToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              isRecording
                ? 'bg-magenta text-white animate-pulse'
                : 'bg-card border border-line text-muted hover:text-text hover:border-magenta/50'
            }`}
          >
            <Circle
              className={`w-3 h-3 ${isRecording ? 'fill-white' : ''}`}
            />
            {isRecording && <span className="text-xs font-bold">REC</span>}
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg text-muted hover:text-magenta hover:bg-card transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-muted hover:text-magenta hover:bg-card transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
