import React, { useState, useEffect } from 'react'
import { GradientButton } from './ui/gradient-button'
import { Bot, CheckCircle2, Circle, ArrowDown, ArrowRight, Play, Pause, Clock, Zap, Volume2, X } from 'lucide-react'
import type { MixingSuggestion } from '../lib/ai/mixingSuggestions'

interface GuidedStep {
  id: string
  instruction: string
  detail: string
  target: string // CSS selector or element ID to highlight
  completed: boolean
  timing?: string // When to do this (e.g., "At 2:15")
  action: 'click' | 'adjust' | 'wait' | 'listen'
}

interface AICoPilotProps {
  suggestions: MixingSuggestion | null
  isActive: boolean
  onToggle: (active: boolean) => void
  trackADuration: number
  trackBDuration: number
  currentStep?: number
  onStepComplete?: (stepId: string) => void
}

export default function AICoPilot({
  suggestions,
  isActive,
  onToggle,
  trackADuration,
  trackBDuration,
  currentStep = 0,
  onStepComplete
}: AICoPilotProps) {
  const [steps, setSteps] = useState<GuidedStep[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [highlightTarget, setHighlightTarget] = useState<string | null>(null)

  // Convert AI suggestions into guided steps
  useEffect(() => {
    if (!suggestions) return

    const guidedSteps: GuidedStep[] = [
      {
        id: 'step-1-prep',
        instruction: '🎧 Put on your headphones',
        detail: 'Listen to both tracks to familiarize yourself with their sound',
        target: '',
        action: 'listen',
        completed: false
      },
      {
        id: 'step-2-bpm',
        instruction: `⚡ ${suggestions.bpmAdjustment}`,
        detail: 'Sync the BPM by adjusting the pitch slider on the appropriate deck',
        target: '.pitch-slider',
        action: 'adjust',
        completed: false
      },
      {
        id: 'step-3-play-a',
        instruction: '▶️ Start Track A',
        detail: 'Click the play button on Deck A to start the first track',
        target: '[data-deck="A"] .play-button',
        action: 'click',
        completed: false
      },
      {
        id: 'step-4-cue-b',
        instruction: '⏱️ Cue up Track B',
        detail: `Set Track B to start at ${suggestions.suggestedMixPoint.trackBTime}`,
        target: '[data-deck="B"]',
        action: 'adjust',
        timing: suggestions.suggestedMixPoint.trackBTime,
        completed: false
      },
      {
        id: 'step-5-eq-prep',
        instruction: `🎚️ Prepare EQ: ${suggestions.eqRecommendations[0]}`,
        detail: 'Adjust the EQ knobs as suggested to prepare for the transition',
        target: '[data-deck="A"] .eq-controls',
        action: 'adjust',
        timing: suggestions.suggestedMixPoint.trackATime,
        completed: false
      },
      {
        id: 'step-6-start-b',
        instruction: `▶️ Start Track B at ${suggestions.suggestedMixPoint.trackATime}`,
        detail: 'When Track A reaches the suggested time, start Track B',
        target: '[data-deck="B"] .play-button',
        action: 'click',
        timing: suggestions.suggestedMixPoint.trackATime,
        completed: false
      },
      {
        id: 'step-7-crossfade',
        instruction: '🔀 Begin crossfade',
        detail: `Slowly move the crossfader from left to center. ${suggestions.transitionTechnique}`,
        target: '.crossfader',
        action: 'adjust',
        completed: false
      },
      {
        id: 'step-8-eq-swap',
        instruction: `🎚️ ${suggestions.eqRecommendations[1] || 'Adjust EQ for smooth blend'}`,
        detail: 'Fine-tune the EQ to ensure frequencies don\'t clash',
        target: '[data-deck="B"] .eq-controls',
        action: 'adjust',
        completed: false
      },
      {
        id: 'step-9-complete',
        instruction: '🔀 Complete the transition',
        detail: 'Move crossfader fully to Track B and fade out Track A',
        target: '.crossfader',
        action: 'adjust',
        completed: false
      },
      {
        id: 'step-10-celebrate',
        instruction: '🎉 Great job!',
        detail: 'You\'ve completed your first AI-guided mix! Ready to record?',
        target: '',
        action: 'wait',
        completed: false
      }
    ]

    setSteps(guidedSteps)
    setActiveStepIndex(0)
  }, [suggestions])

  const handleNextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      const newSteps = [...steps]
      newSteps[activeStepIndex].completed = true
      setSteps(newSteps)
      setActiveStepIndex(activeStepIndex + 1)

      // Set highlight target for next step
      setHighlightTarget(newSteps[activeStepIndex + 1].target)

      if (onStepComplete) {
        onStepComplete(newSteps[activeStepIndex].id)
      }
    } else {
      // All steps completed
      const newSteps = [...steps]
      newSteps[activeStepIndex].completed = true
      setSteps(newSteps)
      setHighlightTarget(null)
    }
  }

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1)
      setHighlightTarget(steps[activeStepIndex - 1].target)
    }
  }

  const handleSkipToStep = (index: number) => {
    setActiveStepIndex(index)
    setHighlightTarget(steps[index].target)
  }

  const currentActiveStep = steps[activeStepIndex]
  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  // Don't render anything when inactive - button is in AI Mix Assistant
  if (!isActive) {
    return null
  }

  return (
    <>
      {/* Highlight Overlay */}
      {highlightTarget && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Pulsing arrow/indicator would point to the target element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowDown className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </div>
      )}

      {/* Co-Pilot Panel */}
      <div className="fixed bottom-6 right-6 w-96 bg-ink/95 border-2 border-primary rounded-2xl shadow-2xl shadow-primary/20 backdrop-blur-lg z-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-t-2xl border-b border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-semibold text-chalk">AI Co-Pilot</span>
              <span className="text-xs text-chalk/60">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={() => onToggle(false)}
              className="p-1 hover:bg-surface/50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-chalk/60" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-surface/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {currentActiveStep && (
          <div className="p-4 space-y-4">
            {/* Step Instruction */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {currentActiveStep.action === 'click' && <Zap className="w-4 h-4 text-primary" />}
                  {currentActiveStep.action === 'adjust' && <Volume2 className="w-4 h-4 text-primary" />}
                  {currentActiveStep.action === 'listen' && <Play className="w-4 h-4 text-primary" />}
                  {currentActiveStep.action === 'wait' && <Clock className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-chalk mb-1">
                    {currentActiveStep.instruction}
                  </h4>
                  <p className="text-sm text-chalk/70">
                    {currentActiveStep.detail}
                  </p>
                  {currentActiveStep.timing && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                      <Clock className="w-3 h-3" />
                      <span>Timing: {currentActiveStep.timing}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                className="px-4 py-2 bg-surface/50 hover:bg-surface/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-chalk text-sm font-medium transition-colors"
              >
                ← Back
              </button>
              <GradientButton
                onClick={handleNextStep}
                className="flex-1"
              >
                {activeStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'} →
              </GradientButton>
            </div>

            {/* Quick Pro Tip */}
            {suggestions && suggestions.tips[activeStepIndex] && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-sm text-chalk/80">
                    {suggestions.tips[Math.min(activeStepIndex, suggestions.tips.length - 1)]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step List */}
        <div className="border-t border-surface/50 p-4 max-h-64 overflow-y-auto">
          <h5 className="text-xs font-semibold text-chalk/60 mb-2">All Steps</h5>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleSkipToStep(index)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                  index === activeStepIndex
                    ? 'bg-primary/20 border border-primary/30'
                    : step.completed
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-surface/20 hover:bg-surface/30'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : index === activeStepIndex ? (
                    <Circle className="w-4 h-4 text-primary fill-primary" />
                  ) : (
                    <Circle className="w-4 h-4 text-chalk/30" />
                  )}
                </div>
                <span className={`text-sm ${
                  index === activeStepIndex
                    ? 'text-chalk font-medium'
                    : step.completed
                    ? 'text-chalk/60 line-through'
                    : 'text-chalk/70'
                }`}>
                  {step.instruction}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
