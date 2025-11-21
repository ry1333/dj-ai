import React, { useState, useEffect } from 'react'
import { analyzeTrack, analyzeCompatibility, type TrackAnalysis } from '../lib/audio/trackAnalyzer'
import { getMixingSuggestions, getQuickCompatibility, type MixingSuggestion } from '../lib/ai/mixingSuggestions'
import { GradientButton } from './ui/gradient-button'
import { Sparkles, TrendingUp, Music2, Zap, Lightbulb, Loader2, ChevronDown, ChevronUp, Bot } from 'lucide-react'

interface AIMixAssistantProps {
  trackAFile: File | string | null
  trackBFile: File | string | null
  geminiApiKey?: string
  trackADuration?: number
  trackBDuration?: number
  onSuggestionsChange?: (suggestions: MixingSuggestion | null) => void
  onCoPilotToggle?: (active: boolean) => void
}

export default function AIMixAssistant({ trackAFile, trackBFile, geminiApiKey, trackADuration = 0, trackBDuration = 0, onSuggestionsChange, onCoPilotToggle }: AIMixAssistantProps) {
  const [trackAAnalysis, setTrackAAnalysis] = useState<TrackAnalysis | null>(null)
  const [trackBAnalysis, setTrackBAnalysis] = useState<TrackAnalysis | null>(null)
  const [suggestions, setSuggestions] = useState<MixingSuggestion | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-analyze tracks when they change
  useEffect(() => {
    if (trackAFile && trackBFile && !trackAAnalysis && !trackBAnalysis && !isAnalyzing) {
      analyzeTracks()
    }
  }, [trackAFile, trackBFile])

  const analyzeTracks = async () => {
    if (!trackAFile || !trackBFile) {
      setError('Please load both tracks first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const [analysisA, analysisB] = await Promise.all([
        analyzeTrack(trackAFile),
        analyzeTrack(trackBFile)
      ])

      setTrackAAnalysis(analysisA)
      setTrackBAnalysis(analysisB)
    } catch (err) {
      console.error('Error analyzing tracks:', err)
      setError('Failed to analyze tracks. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSuggestions = async () => {
    if (!trackAAnalysis || !trackBAnalysis) {
      setError('Please analyze tracks first')
      return
    }

    if (!geminiApiKey) {
      setError('Gemini API key not configured. Using basic suggestions.')
      // Show basic compatibility info
      const compatibility = analyzeCompatibility(trackAAnalysis, trackBAnalysis)
      const quick = getQuickCompatibility(trackAAnalysis, trackBAnalysis)

      setSuggestions({
        compatibilityScore: compatibility.score,
        bpmAdjustment: compatibility.bpmDiff > 0
          ? `Adjust tempo by ${compatibility.bpmDiff} BPM`
          : 'BPMs are aligned',
        keyCompatibility: compatibility.keyCompatible
          ? 'Keys are harmonically compatible'
          : 'Different keys - use EQ carefully',
        suggestedMixPoint: {
          trackATime: formatTime(trackAAnalysis.duration * 0.75),
          trackBTime: '0:08',
          description: 'Mix during Track A outro into Track B intro'
        },
        eqRecommendations: [
          'Cut bass on Track A before transition',
          'Bring in Track B bass gradually',
          'Use high-pass filter for smooth blend'
        ],
        transitionTechnique: 'Crossfade with bass swap',
        tips: [
          'Listen to both tracks in headphones',
          'Practice the transition before recording',
          'Keep energy level consistent'
        ]
      })
      return
    }

    setIsLoadingSuggestions(true)
    setError(null)

    try {
      const aiSuggestions = await getMixingSuggestions(trackAAnalysis, trackBAnalysis, geminiApiKey)
      setSuggestions(aiSuggestions)
      onSuggestionsChange?.(aiSuggestions)
    } catch (err) {
      console.error('Error getting AI suggestions:', err)
      setError('Failed to get AI suggestions. Using basic analysis.')

      // Fallback to basic compatibility
      const compatibility = analyzeCompatibility(trackAAnalysis, trackBAnalysis)
      setSuggestions({
        compatibilityScore: compatibility.score,
        bpmAdjustment: `BPM difference: ${compatibility.bpmDiff}`,
        keyCompatibility: compatibility.keyCompatible ? 'Keys compatible' : 'Different keys',
        suggestedMixPoint: {
          trackATime: formatTime(trackAAnalysis.duration * 0.75),
          trackBTime: '0:08',
          description: 'Standard transition point'
        },
        eqRecommendations: ['Use EQ to blend frequencies'],
        transitionTechnique: 'Standard crossfade',
        tips: ['Practice makes perfect']
      })
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreStars = (score: number): string => {
    const stars = Math.round((score / 100) * 5)
    return '⭐'.repeat(stars)
  }

  if (!trackAFile || !trackBFile) {
    return (
      <div className="bg-ink/50 border border-surface rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-chalk">AI Mix Assistant</h3>
        </div>
        <p className="text-chalk/60 text-sm">
          Load tracks into both decks to get AI-powered mixing suggestions
        </p>
      </div>
    )
  }

  return (
    <div className="bg-ink/50 border border-surface rounded-lg backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface/20"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-chalk">AI Mix Assistant</h3>
          {suggestions && (
            <span className={`text-sm font-medium ${getScoreColor(suggestions.compatibilityScore)}`}>
              {suggestions.compatibilityScore}% {getScoreStars(suggestions.compatibilityScore)}
            </span>
          )}
        </div>
        {isCollapsed ? <ChevronDown className="w-5 h-5 text-chalk/60" /> : <ChevronUp className="w-5 h-5 text-chalk/60" />}
      </div>

      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          {/* Track Analysis */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-chalk/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing tracks...</span>
            </div>
          )}

          {trackAAnalysis && trackBAnalysis && !suggestions && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-surface/30 p-3 rounded">
                  <div className="text-chalk/60 text-xs mb-1">Track A</div>
                  <div className="text-chalk font-medium">{trackAAnalysis.bpm} BPM • {trackAAnalysis.key}</div>
                  <div className="text-chalk/60 text-xs">{trackAAnalysis.energy} energy</div>
                </div>
                <div className="bg-surface/30 p-3 rounded">
                  <div className="text-chalk/60 text-xs mb-1">Track B</div>
                  <div className="text-chalk font-medium">{trackBAnalysis.bpm} BPM • {trackBAnalysis.key}</div>
                  <div className="text-chalk/60 text-xs">{trackBAnalysis.energy} energy</div>
                </div>
              </div>

              <GradientButton
                onClick={getSuggestions}
                disabled={isLoadingSuggestions}
                className="w-full"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Getting AI Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Mixing Suggestions
                  </>
                )}
              </GradientButton>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions && (
            <div className="space-y-4">
              {/* Compatibility Score */}
              <div className="bg-surface/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-chalk/80">Compatibility</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(suggestions.compatibilityScore)}`}>
                  {suggestions.compatibilityScore}% {getScoreStars(suggestions.compatibilityScore)}
                </div>
                <div className="text-xs text-chalk/60 mt-1">{suggestions.keyCompatibility}</div>
              </div>

              {/* BPM Adjustment */}
              <div className="bg-surface/30 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-chalk/80">BPM Adjustment</span>
                </div>
                <div className="text-sm text-chalk">{suggestions.bpmAdjustment}</div>
              </div>

              {/* Suggested Mix Point */}
              <div className="bg-surface/30 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Music2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-chalk/80">Suggested Mix Point</span>
                </div>
                <div className="text-sm text-chalk space-y-1">
                  <div>Track A: <span className="font-mono font-medium text-primary">{suggestions.suggestedMixPoint.trackATime}</span></div>
                  <div>Track B: <span className="font-mono font-medium text-primary">{suggestions.suggestedMixPoint.trackBTime}</span></div>
                  <div className="text-xs text-chalk/60">{suggestions.suggestedMixPoint.description}</div>
                </div>
              </div>

              {/* EQ Recommendations */}
              <div className="bg-surface/30 p-3 rounded">
                <div className="text-sm font-medium text-chalk/80 mb-2">🎚️ EQ Recommendations</div>
                <ul className="text-sm text-chalk/80 space-y-1">
                  {suggestions.eqRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transition Technique */}
              <div className="bg-surface/30 p-3 rounded">
                <div className="text-sm font-medium text-chalk/80 mb-1">Transition Technique</div>
                <div className="text-sm text-chalk">{suggestions.transitionTechnique}</div>
              </div>

              {/* Pro Tips */}
              <div className="bg-surface/30 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-chalk/80">Pro Tips</span>
                </div>
                <ul className="text-sm text-chalk/80 space-y-1">
                  {suggestions.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <GradientButton
                  onClick={getSuggestions}
                  disabled={isLoadingSuggestions}
                  variant="outline"
                  className="w-full"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Refresh
                    </>
                  )}
                </GradientButton>

                <GradientButton
                  onClick={() => {
                    console.log('Starting Co-Pilot mode...')
                    onCoPilotToggle?.(true)
                  }}
                  className="w-full"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Start Co-Pilot
                </GradientButton>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
