import { useState } from 'react'
import { Music, Sparkles, Bot } from 'lucide-react'
import LocalTrackLibrary from './LocalTrackLibrary'

type DockTab = 'library' | 'aiMix' | 'assistant'

type StudioDockProps = {
  className?: string
  onLoadTrackA?: (file: File) => void
  onLoadTrackB?: (file: File) => void
}

export default function StudioDock({ className, onLoadTrackA, onLoadTrackB }: StudioDockProps) {
  const [activeTab, setActiveTab] = useState<DockTab>('library')

  return (
    <div className={`rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden ${className || ''}`}>
      {/* Tab Bar */}
      <div className="flex items-center border-b border-white/5 bg-black/20">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === 'library'
              ? 'text-cyan border-b-2 border-cyan'
              : 'text-muted hover:text-text'
          }`}
        >
          <Music className="w-4 h-4" />
          Library
        </button>
        <button
          onClick={() => setActiveTab('aiMix')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === 'aiMix'
              ? 'text-magenta border-b-2 border-magenta'
              : 'text-muted hover:text-text'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Mix
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === 'assistant'
              ? 'text-cyan border-b-2 border-cyan'
              : 'text-muted hover:text-text'
          }`}
        >
          <Bot className="w-4 h-4" />
          Assistant
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-h-64 overflow-y-auto">
        {activeTab === 'library' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-xs text-muted uppercase tracking-wider">Load tracks to decks</div>
            </div>
            <LocalTrackLibrary
              onSelect={(file) => {
                // For now, default to loading to deck A
                // We'll add deck selection UI later
                if (onLoadTrackA) onLoadTrackA(file)
              }}
            />
          </div>
        )}

        {activeTab === 'aiMix' && (
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-magenta mx-auto mb-2" />
            <p className="text-muted text-sm">AI Mix Generator coming soon</p>
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="p-6 text-center">
            <Bot className="w-8 h-8 text-cyan mx-auto mb-2" />
            <p className="text-muted text-sm">AI Assistant coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
