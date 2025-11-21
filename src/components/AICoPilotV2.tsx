import React, { useState, useEffect, useCallback } from 'react'
import { useMixer, type MixerEvent } from '../contexts/MixerContext'
import { generateCoPilotSteps, isStepSatisfied, type CoPilotStep } from '../lib/ai/coPilotSteps'
import type { MixingSuggestion } from '../lib/ai/mixingSuggestions'
import { GradientButton } from './ui/gradient-button'
import { Bot, CheckCircle2, Circle, Zap, Play, Volume2, Clock, Sparkles, X, ChevronRight, Target } from 'lucide-react'

interface AICoPilotV2Props {
  suggestions: MixingSuggestion | null
  isActive: boolean
  onToggle: (active: boolean) => void
}

export default function AICoPilotV2({ suggestions, isActive, onToggle }: AICoPilotV2Props) {
  const mixer = useMixer()
  const [steps, setSteps] = useState<CoPilotStep[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  // Generate steps from suggestions
  useEffect(() => {
    if (!suggestions) return
    const generatedSteps = generateCoPilotSteps(suggestions)
    setSteps(generatedSteps)
    setActiveStepIndex(0)
    setCompletedSteps(new Set())
  }, [suggestions])

  const currentStep = steps[activeStepIndex]

  // Subscribe to mixer events for auto-advancement
  useEffect(() => {
    if (!currentStep?.waitFor || currentStep.waitFor.type === 'userConfirm') return

    const unsubscribe = mixer.subscribe((event: MixerEvent) => {
      const satisfied = isStepSatisfied(currentStep.waitFor!, event, {
        deckATime: mixer.state.decks.A.currentTime,
        deckBTime: mixer.state.decks.B.currentTime
      })

      if (satisfied) {
        console.log('✅ Step auto-completed:', currentStep.title)
        handleStepComplete()
      }
    })

    return unsubscribe
  }, [currentStep, mixer])

  // Mark current step complete and advance
  const handleStepComplete = useCallback(() => {
    if (!currentStep) return

    setCompletedSteps(prev => new Set([...prev, currentStep.id]))

    // Auto-advance to next step
    if (activeStepIndex < steps.length - 1) {
      setTimeout(() => {
        setActiveStepIndex(prev => prev + 1)
      }, 500) // Small delay for visual feedback
    }
  }, [currentStep, activeStepIndex, steps.length])

  // Manual step advancement
  const handleNextStep = () => {
    handleStepComplete()
  }

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1)
    }
  }

  // "Do it for me" automation
  const handleAutomate = () => {
    if (!currentStep?.automatable || !currentStep.controlId) return

    const { controlId, targetValue } = currentStep

    if (controlId && targetValue !== undefined) {
      console.log(`🤖 Automating: ${controlId} → ${targetValue}`)

      // Special handling for play/pause
      if (controlId === 'deckA.play' || controlId === 'deckB.play') {
        const deck = controlId === 'deckA.play' ? 'A' : 'B'
        mixer.updatePlayState(deck, true)
      } else {
        mixer.setControl(controlId, targetValue)
      }

      // Auto-advance after automation
      setTimeout(handleStepComplete, 800)
    }
  }

  const progress = (completedSteps.size / steps.length) * 100

  // Get precise spotlight position based on controlId
  const getSpotlightPosition = (controlId?: string) => {
    if (!controlId) return null

    const spotlights: Record<string, { top: string; left: string; width: string; height: string }> = {
      // Deck A controls
      'deckA.play': { top: '460px', left: '220px', width: '100px', height: '100px' },
      'deckA.tempo': { top: '200px', left: '420px', width: '80px', height: '200px' },
      'deckA.eq.low': { top: '540px', left: '480px', width: '90px', height: '90px' },
      'deckA.eq.mid': { top: '420px', left: '480px', width: '90px', height: '90px' },
      'deckA.eq.high': { top: '300px', left: '480px', width: '90px', height: '90px' },

      // Deck B controls
      'deckB.play': { top: '460px', right: '220px', width: '100px', height: '100px' },
      'deckB.tempo': { top: '200px', right: '420px', width: '80px', height: '200px' },
      'deckB.eq.low': { top: '540px', right: '480px', width: '90px', height: '90px' },
      'deckB.eq.mid': { top: '420px', right: '480px', width: '90px', height: '90px' },
      'deckB.eq.high': { top: '300px', right: '480px', width: '90px', height: '90px' },

      // Mixer controls
      'crossfader': { top: '500px', left: '50%', width: '120px', height: '180px', transform: 'translateX(-50%)' },
      'masterVolume': { top: '680px', left: '50%', width: '80px', height: '120px', transform: 'translateX(-50%)' }
    }

    return spotlights[controlId] || null
  }

  // Get icon for action type
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'play':
        return <Play className="w-4 h-4 text-primary" />
      case 'adjust':
      case 'crossfade':
        return <Volume2 className="w-4 h-4 text-primary" />
      case 'listen':
      case 'wait':
        return <Clock className="w-4 h-4 text-primary" />
      default:
        return <Zap className="w-4 h-4 text-primary" />
    }
  }

  if (!isActive) {
    return null
  }

  if (!currentStep) {
    return null
  }

  const spotlightPos = getSpotlightPosition(currentStep.controlId)

  return (
    <>
      {/* Precise Control Spotlight - highlights specific control */}
      {spotlightPos && (
        <div className="fixed inset-0 z-40 pointer-events-none animate-in fade-in duration-500">
          <div
            className="absolute rounded-xl"
            style={{
              ...spotlightPos,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), inset 0 0 40px 8px rgba(236, 72, 153, 0.4), 0 0 60px 15px rgba(236, 72, 153, 0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Fallback: Area spotlight when no specific control */}
      {!spotlightPos && currentStep.focus !== 'none' && (
        <div className="fixed inset-0 z-40 pointer-events-none animate-in fade-in duration-500">
          {/* Deck A Spotlight */}
          {currentStep.focus === 'deckA' && (
            <div
              className="absolute top-[180px] left-[50px] w-[calc(33%-50px)] h-[calc(100vh-240px)] rounded-2xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), inset 0 0 60px 10px rgba(236, 72, 153, 0.3), 0 0 80px 20px rgba(236, 72, 153, 0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}

          {/* Deck B Spotlight */}
          {currentStep.focus === 'deckB' && (
            <div
              className="absolute top-[180px] right-[50px] w-[calc(33%-50px)] h-[calc(100vh-240px)] rounded-2xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), inset 0 0 60px 10px rgba(236, 72, 153, 0.3), 0 0 80px 20px rgba(236, 72, 153, 0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}

          {/* Mixer Spotlight */}
          {currentStep.focus === 'mixer' && (
            <div
              className="absolute top-[180px] left-1/2 transform -translate-x-1/2 w-[400px] h-[calc(100vh-240px)] rounded-2xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), inset 0 0 60px 10px rgba(236, 72, 153, 0.3), 0 0 80px 20px rgba(236, 72, 153, 0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}
        </div>
      )}

      {/* Directional focus indicator - positioned near the specific control */}
      {currentStep.focus !== 'none' && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary/90 backdrop-blur-md border-2 border-primary rounded-full px-6 py-3 shadow-2xl shadow-primary/50 relative">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-chalk animate-pulse" />
              <p className="text-sm font-bold text-ink">
                {currentStep.title}
              </p>
            </div>
            {/* Arrow pointing down to control */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-primary animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* Co-Pilot Panel - Compact & Out of the Way */}
      <div className="fixed bottom-6 left-6 w-80 max-h-[85vh] overflow-hidden bg-gradient-to-br from-ink via-ink/95 to-surface/90 border-2 border-primary/50 rounded-2xl shadow-2xl shadow-primary/30 backdrop-blur-xl z-50 animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 p-4 rounded-t-2xl border-b border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="w-5 h-5 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
              <span className="font-semibold text-chalk">AI Co-Pilot</span>
              <span className="text-xs text-chalk/60 bg-surface/50 px-2 py-0.5 rounded-full">
                Step {activeStepIndex + 1}/{steps.length}
              </span>
            </div>
            <button
              onClick={() => onToggle(false)}
              className="p-1 hover:bg-surface/50 rounded-lg transition-colors group"
            >
              <X className="w-4 h-4 text-chalk/60 group-hover:text-chalk" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-surface/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step - Compact */}
        <div className="p-3 space-y-3">
          {/* Step Card - Smaller */}
          <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/30 rounded-lg p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                {getActionIcon(currentStep.actionType)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-chalk mb-1 text-base">
                  {currentStep.title}
                </h4>
                <p className="text-xs text-chalk/70 leading-snug">
                  {currentStep.description}
                </p>
                {currentStep.timing && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{currentStep.timing}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current values display - More prominent */}
          {currentStep.controlId && (
            <div className="bg-surface/30 rounded-lg p-2.5 text-xs border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-chalk/60">Current:</span>
                <span className="font-mono font-bold text-lg text-primary">
                  {mixer.getControlValue(currentStep.controlId).toFixed(2)}
                </span>
              </div>
              {currentStep.targetValue !== undefined && (
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-surface/50">
                  <span className="text-chalk/60">Target:</span>
                  <span className="font-mono font-bold text-lg text-green-400">
                    {currentStep.targetValue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div className="flex gap-2">
            {currentStep.automatable && currentStep.targetValue !== undefined ? (
              <>
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="px-2 py-1.5 bg-surface/50 hover:bg-surface/70 disabled:opacity-30 disabled:cursor-not-allowed rounded text-chalk text-xs font-medium transition-colors"
                >
                  ←
                </button>
                <GradientButton
                  onClick={handleAutomate}
                  className="flex-1 text-xs py-1.5"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Do it for me
                </GradientButton>
              </>
            ) : (
              <>
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="px-3 py-1.5 bg-surface/50 hover:bg-surface/70 disabled:opacity-30 disabled:cursor-not-allowed rounded text-chalk text-xs font-medium transition-colors"
                >
                  ← Back
                </button>
                <GradientButton
                  onClick={handleNextStep}
                  className="flex-1 text-xs py-1.5"
                  disabled={activeStepIndex === steps.length - 1 && !currentStep.waitFor}
                >
                  {activeStepIndex === steps.length - 1 ? 'Finish' : 'Next'} →
                </GradientButton>
              </>
            )}
          </div>
        </div>

        {/* All Steps - Collapsible */}
        <div className="border-t border-surface/50 p-3 max-h-48 overflow-y-auto">
          <h5 className="text-xs font-semibold text-chalk/60 mb-1.5 uppercase tracking-wide">All Steps</h5>
          <div className="space-y-0.5">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = index === activeStepIndex

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(index)}
                  className={`w-full flex items-center gap-2 p-1.5 rounded text-left transition-all ${
                    isCurrent
                      ? 'bg-primary/20 border border-primary/40'
                      : isCompleted
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-surface/10 hover:bg-surface/20 border border-transparent'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    ) : isCurrent ? (
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3 text-chalk/30" />
                    )}
                  </div>
                  <span className={`text-xs flex-1 ${
                    isCurrent
                      ? 'text-chalk font-medium'
                      : isCompleted
                      ? 'text-chalk/60 line-through'
                      : 'text-chalk/70'
                  }`}>
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
