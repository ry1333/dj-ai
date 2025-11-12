import { Link } from 'react-router-dom'

type Props = {
  isRecording: boolean
  onRecordToggle: () => void
  masterLevel: number // 0-1 for VU meter
  recordingTime?: number // Current recording time in seconds
  maxRecordingTime?: number // Max recording time in seconds
}

export default function TopBar({ isRecording, onRecordToggle, masterLevel, recordingTime = 0, maxRecordingTime = 30 }: Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="topbar relative h-12 bg-surface2 border-b border-rmxrborder flex items-center justify-between px-8">
      {/* Left: Brand */}
      <Link to="/stream" className="text-xl font-bold text-accent-400">
        RMXR
      </Link>

      {/* Center: Navigation + Recording Timer */}
      <div className="flex items-center gap-6">
        {isRecording ? (
          <div className="flex items-center gap-2 text-danger font-mono font-semibold">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span>{formatTime(recordingTime)} / {formatTime(maxRecordingTime)}</span>
          </div>
        ) : (
          <>
            <Link to="/learn" className="text-sm text-muted hover:text-rmxrtext transition-colors">
              Learn
            </Link>
            <Link to="/stream" className="text-sm text-muted hover:text-rmxrtext transition-colors">
              Stream
            </Link>
          </>
        )}
      </div>

      {/* Right: Status & Controls */}
      <div className="flex items-center gap-4">
        {/* VU Meter */}
        <div className="flex items-center gap-1" title="Master Level">
          <div className="w-12 h-1.5 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ok via-warn to-danger transition-all duration-75"
              style={{ width: `${masterLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Record Button */}
        <button
          onClick={onRecordToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            isRecording
              ? 'bg-danger text-white animate-pulse'
              : 'border border-rmxrborder text-muted hover:border-accent hover:text-accent-400'
          }`}
          title="Record"
        >
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-danger'}`} />
          {isRecording ? 'STOP' : 'REC'}
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen()
            } else {
              document.exitFullscreen()
            }
          }}
          className="p-2 text-muted hover:text-accent-400 transition-colors"
          title="Fullscreen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Concave corners using CSS mask */}
      <style>{`
        .topbar {
          -webkit-mask:
            radial-gradient(16px at 0 100%, transparent 99%, #000 100%) left bottom,
            radial-gradient(16px at 100% 100%, transparent 99%, #000 100%) right bottom,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          -webkit-mask-size: 16px 16px, 16px 16px, 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask:
            radial-gradient(16px at 0 100%, transparent 99%, #000 100%) left bottom,
            radial-gradient(16px at 100% 100%, transparent 99%, #000 100%) right bottom,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          mask-size: 16px 16px, 16px 16px, 100% 100%;
          mask-repeat: no-repeat;
        }
      `}</style>
    </div>
  )
}
