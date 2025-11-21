import type { MixerControlId } from '../../contexts/MixerContext'
import type { MixingSuggestion } from './mixingSuggestions'

// Focus areas for visual highlighting
export type FocusArea = 'deckA' | 'deckB' | 'mixer' | 'none'

// Action types
export type ActionType = 'listen' | 'play' | 'adjust' | 'crossfade' | 'wait'

// Wait conditions for auto-advancement
export type WaitCondition =
  | { type: 'userConfirm' }
  | { type: 'timecode'; deck: 'A' | 'B'; seconds: number }
  | { type: 'controlChange'; controlId: MixerControlId; threshold: number; direction?: 'above' | 'below' | 'exact' }
  | { type: 'playState'; deck: 'A' | 'B'; playing: boolean }

// Co-Pilot step schema
export interface CoPilotStep {
  id: string
  title: string
  description: string
  focus: FocusArea
  controlId?: MixerControlId
  actionType: ActionType
  targetValue?: number
  waitFor?: WaitCondition
  automatable?: boolean  // Can show "Do it for me" button
  timing?: string  // Display timing (e.g., "At 2:15")
}

/**
 * Generate Co-Pilot steps from AI mixing suggestions
 */
export function generateCoPilotSteps(suggestions: MixingSuggestion): CoPilotStep[] {
  const steps: CoPilotStep[] = []

  // Step 1: Put on headphones
  steps.push({
    id: 'step-1-headphones',
    title: '🎧 Put on your headphones',
    description: 'Listen to both tracks to familiarize yourself with their sound before mixing.',
    focus: 'none',
    actionType: 'listen',
    waitFor: { type: 'userConfirm' }
  })

  // Step 2: BPM sync
  if (suggestions.bpmAdjustment && !suggestions.bpmAdjustment.includes('No adjustment')) {
    const needsAdjustment = suggestions.bpmAdjustment.toLowerCase()
    const targetDeck = needsAdjustment.includes('track a') ? 'A' : 'B'
    const controlId: MixerControlId = targetDeck === 'A' ? 'deckA.tempo' : 'deckB.tempo'

    // Parse percentage (e.g., "+1.5%" -> 1.015)
    const match = needsAdjustment.match(/([+-]?\d+\.?\d*)%/)
    const percentage = match ? parseFloat(match[1]) : 0
    const targetTempo = 1 + (percentage / 100)

    steps.push({
      id: 'step-2-bpm-sync',
      title: `⚡ ${suggestions.bpmAdjustment}`,
      description: `Adjust the tempo slider on Deck ${targetDeck} to sync the BPM with the other track.`,
      focus: targetDeck === 'A' ? 'deckA' : 'deckB',
      controlId,
      actionType: 'adjust',
      targetValue: targetTempo,
      waitFor: {
        type: 'controlChange',
        controlId,
        threshold: targetTempo,
        direction: 'exact'
      },
      automatable: true
    })
  }

  // Step 3: Start Track A
  steps.push({
    id: 'step-3-play-a',
    title: '▶️ Start Track A',
    description: 'Click the play button on Deck A to start the first track.',
    focus: 'deckA',
    controlId: 'deckA.play',
    actionType: 'play',
    waitFor: { type: 'playState', deck: 'A', playing: true },
    automatable: true
  })

  // Step 4: Cue Track B
  steps.push({
    id: 'step-4-cue-b',
    title: `⏱️ Cue up Track B`,
    description: `Set Track B to start at ${suggestions.suggestedMixPoint.trackBTime}. Listen in headphones to find the right spot.`,
    focus: 'deckB',
    actionType: 'listen',
    timing: suggestions.suggestedMixPoint.trackBTime,
    waitFor: { type: 'userConfirm' }
  })

  // Step 5: Prepare EQ (first recommendation)
  if (suggestions.eqRecommendations[0]) {
    const rec = suggestions.eqRecommendations[0].toLowerCase()
    const isDeckA = rec.includes('track a')
    const controlId: MixerControlId = isDeckA ? 'deckA.eq.low' : 'deckB.eq.low'

    steps.push({
      id: 'step-5-eq-prep',
      title: `🎚️ ${suggestions.eqRecommendations[0]}`,
      description: 'Prepare the EQ for a smooth transition. Cut the bass to make room for the incoming track.',
      focus: isDeckA ? 'deckA' : 'deckB',
      controlId,
      actionType: 'adjust',
      targetValue: -6, // Cut bass by 6dB
      timing: suggestions.suggestedMixPoint.trackATime,
      waitFor: {
        type: 'controlChange',
        controlId,
        threshold: -3,
        direction: 'below'
      },
      automatable: true
    })
  }

  // Step 6: Start Track B at the right moment
  const [mins, secs] = suggestions.suggestedMixPoint.trackATime.split(':').map(Number)
  const mixPointSeconds = mins * 60 + secs

  steps.push({
    id: 'step-6-start-b',
    title: `▶️ Start Track B at ${suggestions.suggestedMixPoint.trackATime}`,
    description: `When Track A reaches ${suggestions.suggestedMixPoint.trackATime}, start Track B. Watch the timeline!`,
    focus: 'deckB',
    controlId: 'deckB.play',
    actionType: 'play',
    timing: suggestions.suggestedMixPoint.trackATime,
    waitFor: { type: 'playState', deck: 'B', playing: true },
    automatable: false // User should time this themselves
  })

  // Step 7: Begin crossfade
  steps.push({
    id: 'step-7-crossfade-start',
    title: '🔀 Begin crossfade',
    description: `Slowly move the crossfader from left (Track A) toward center. ${suggestions.transitionTechnique}`,
    focus: 'mixer',
    controlId: 'crossfader',
    actionType: 'crossfade',
    targetValue: 0.5,
    waitFor: {
      type: 'controlChange',
      controlId: 'crossfader',
      threshold: 0.4,
      direction: 'above'
    },
    automatable: true
  })

  // Step 8: EQ swap (second recommendation)
  if (suggestions.eqRecommendations[1]) {
    const rec = suggestions.eqRecommendations[1].toLowerCase()
    const isDeckB = rec.includes('track b')
    const isBoost = rec.includes('boost') || rec.includes('bring in')
    const controlId: MixerControlId = isDeckB ? 'deckB.eq.low' : 'deckA.eq.low'

    steps.push({
      id: 'step-8-eq-swap',
      title: `🎚️ ${suggestions.eqRecommendations[1]}`,
      description: 'Complete the EQ swap. Bring in the new track\'s bass while reducing the old track.',
      focus: isDeckB ? 'deckB' : 'deckA',
      controlId,
      actionType: 'adjust',
      targetValue: isBoost ? 0 : -12,
      waitFor: {
        type: 'controlChange',
        controlId,
        threshold: isBoost ? -2 : -8,
        direction: isBoost ? 'above' : 'below'
      },
      automatable: true
    })
  }

  // Step 9: Complete transition
  steps.push({
    id: 'step-9-complete',
    title: '🔀 Complete the transition',
    description: 'Move the crossfader fully to Track B. The mix is complete!',
    focus: 'mixer',
    controlId: 'crossfader',
    actionType: 'crossfade',
    targetValue: 1.0,
    waitFor: {
      type: 'controlChange',
      controlId: 'crossfader',
      threshold: 0.8,
      direction: 'above'
    },
    automatable: true
  })

  // Step 10: Celebrate!
  steps.push({
    id: 'step-10-celebrate',
    title: '🎉 Great job!',
    description: 'You\'ve completed your first AI-guided mix! Ready to record your next one?',
    focus: 'none',
    actionType: 'wait',
    waitFor: { type: 'userConfirm' }
  })

  return steps
}

/**
 * Check if a step's wait condition is satisfied by a mixer event
 */
export function isStepSatisfied(
  condition: WaitCondition,
  event: { type: string; [key: string]: any },
  currentState?: { deckATime: number; deckBTime: number }
): boolean {
  switch (condition.type) {
    case 'userConfirm':
      // User must manually confirm
      return false

    case 'timecode':
      if (event.type !== 'timeUpdate') return false
      if (event.deck !== condition.deck) return false
      return Math.abs(event.time - condition.seconds) < 1 // Within 1 second

    case 'controlChange':
      if (event.type !== 'controlChange') return false
      if (event.controlId !== condition.controlId) return false

      if (condition.direction === 'above') {
        return event.value >= condition.threshold
      } else if (condition.direction === 'below') {
        return event.value <= condition.threshold
      } else {
        // exact (within 5% tolerance)
        const tolerance = Math.abs(condition.threshold * 0.05)
        return Math.abs(event.value - condition.threshold) <= tolerance
      }

    case 'playState':
      if (event.type !== 'playStateChange') return false
      if (event.deck !== condition.deck) return false
      return event.playing === condition.playing

    default:
      return false
  }
}
