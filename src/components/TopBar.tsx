import { Link } from 'react-router-dom'

type Props = {
  isRecording: boolean
  onRecordToggle: () => void
  masterLevel: number // 0-1 for VU meter
}

export default function TopBar({ isRecording, onRecordToggle, masterLevel }: Props) {
  return (
    <div className="topbar relative h-12 bg-surface2 border-b border-rmxrborder flex items-center justify-between px-8">
      {/* Left: Brand */}
      <Link to="/stream" className="text-xl font-bold text-accent-400">
        RMXR
      </Link>

      {/* Center: Navigation */}
      <div className="flex items-center gap-6">
        <Link to="/learn" className="text-sm text-muted hover:text-rmxrtext transition-colors">
          Learn
        </Link>
        <Link to="/stream" className="text-sm text-muted hover:text-rmxrtext transition-colors">
          Stream
        </Link>
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
          {isRecording && 'REC'}
        </button>

        {/* Settings */}
        <button
          className="p-2 text-muted hover:text-accent-400 transition-colors"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
