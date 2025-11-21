import { GoogleGenerativeAI } from '@google/generative-ai'
import type { TrackAnalysis } from '../audio/trackAnalyzer'

export interface MixingSuggestion {
  compatibilityScore: number
  bpmAdjustment: string
  keyCompatibility: string
  suggestedMixPoint: {
    trackATime: string
    trackBTime: string
    description: string
  }
  eqRecommendations: string[]
  transitionTechnique: string
  tips: string[]
}

/**
 * Gets AI-powered mixing suggestions for two tracks
 * Uses Gemini Flash for fast, intelligent coaching
 */
export async function getMixingSuggestions(
  trackA: TrackAnalysis,
  trackB: TrackAnalysis,
  apiKey: string
): Promise<MixingSuggestion> {
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  // Create detailed prompt for DJ coaching
  const prompt = `You are a professional DJ coach helping DJs learn to mix tracks. Analyze these two tracks and provide specific, actionable mixing advice.

**Track A:**
- BPM: ${trackA.bpm}
- Key: ${trackA.key}
- Energy: ${trackA.energy}
- Duration: ${Math.floor(trackA.duration)}s
- RMS Level: ${trackA.rms.toFixed(3)}

**Track B:**
- BPM: ${trackB.bpm}
- Key: ${trackB.key}
- Energy: ${trackB.energy}
- Duration: ${Math.floor(trackB.duration)}s
- RMS Level: ${trackB.rms.toFixed(3)}

Provide mixing guidance in this **exact JSON format** (no markdown, no code blocks, just pure JSON):

{
  "compatibilityScore": <number 0-100>,
  "bpmAdjustment": "<which track to adjust and by how much, e.g., 'Speed up Track B by +2%' or 'No adjustment needed'>",
  "keyCompatibility": "<explain if keys are compatible and why>",
  "suggestedMixPoint": {
    "trackATime": "<time in format MM:SS, e.g., '2:15'>",
    "trackBTime": "<time in format MM:SS>",
    "description": "<why this is a good mix point>"
  },
  "eqRecommendations": [
    "<specific EQ advice 1>",
    "<specific EQ advice 2>",
    "<specific EQ advice 3>"
  ],
  "transitionTechnique": "<recommended technique, e.g., 'Bass swap with 16-bar blend', 'Filter sweep transition', 'Echo out'>",
  "tips": [
    "<practical tip 1>",
    "<practical tip 2>",
    "<practical tip 3>"
  ]
}

**Guidelines:**
- Be specific with timing (use actual seconds/minutes from track durations)
- Focus on practical, actionable advice
- Consider BPM, key, and energy compatibility
- Suggest realistic mix points (usually last 25% of Track A, first 25% of Track B)
- EQ recommendations should specify when to cut/boost and which frequencies
- Tips should be beginner-friendly but professional
- If tracks are very incompatible, still provide the best possible advice for making it work

Return ONLY the JSON object, no additional text.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON response
    // Remove markdown code blocks if AI adds them despite instructions
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const suggestion: MixingSuggestion = JSON.parse(jsonText)

    return suggestion
  } catch (error) {
    console.error('Error getting AI mixing suggestions:', error)

    // Fallback to rule-based suggestions if AI fails
    return getFallbackSuggestions(trackA, trackB)
  }
}

/**
 * Rule-based fallback suggestions if AI fails
 */
function getFallbackSuggestions(trackA: TrackAnalysis, trackB: TrackAnalysis): MixingSuggestion {
  const bpmDiff = Math.abs(trackA.bpm - trackB.bpm)
  const bpmCompatibility = bpmDiff <= 3 ? 100 : Math.max(0, 100 - (bpmDiff * 10))

  // Simple key compatibility check
  const keyCompatible = trackA.key === trackB.key ||
    trackA.key.replace('m', '') === trackB.key.replace('m', '')

  const energyMatch = trackA.energy === trackB.energy

  const compatibilityScore = Math.round(
    bpmCompatibility * 0.5 +
    (keyCompatible ? 30 : 10) +
    (energyMatch ? 20 : 10)
  )

  // Determine which track needs BPM adjustment
  let bpmAdjustment = 'No adjustment needed'
  if (bpmDiff > 2) {
    const fasterTrack = trackA.bpm > trackB.bpm ? 'A' : 'B'
    const adjustment = ((bpmDiff / Math.min(trackA.bpm, trackB.bpm)) * 100).toFixed(1)
    bpmAdjustment = trackA.bpm > trackB.bpm
      ? `Slow down Track A by -${adjustment}%`
      : `Speed up Track B by +${adjustment}%`
  }

  // Suggest mix point (last 30 seconds of Track A)
  const trackAMixTime = Math.max(0, trackA.duration - 30)
  const trackBMixTime = 8 // Start of Track B after intro

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    compatibilityScore,
    bpmAdjustment,
    keyCompatibility: keyCompatible
      ? `Compatible - both tracks are in ${trackA.key}`
      : `Different keys (${trackA.key} vs ${trackB.key}). Consider EQ adjustments to blend.`,
    suggestedMixPoint: {
      trackATime: formatTime(trackAMixTime),
      trackBTime: formatTime(trackBMixTime),
      description: 'Mix during the outro of Track A into the intro of Track B'
    },
    eqRecommendations: [
      'Cut bass on Track A around -10 seconds before mix point',
      'Gradually bring in Track B bass after mix point',
      'Boost highs on Track B during transition for clarity'
    ],
    transitionTechnique: energyMatch
      ? 'Bass swap with 16-bar blend'
      : trackA.energy === 'high' && trackB.energy === 'low'
      ? 'Echo out with filter sweep'
      : 'Gradual crossfade with EQ adjustment',
    tips: [
      'Use headphones to pre-listen to Track B before bringing it in',
      'Start with crossfader centered and adjust gradually',
      'Practice the transition a few times before recording'
    ]
  }
}

/**
 * Gets quick compatibility assessment without full AI analysis
 */
export function getQuickCompatibility(trackA: TrackAnalysis, trackB: TrackAnalysis): {
  score: number
  summary: string
} {
  const bpmDiff = Math.abs(trackA.bpm - trackB.bpm)
  const keyMatch = trackA.key === trackB.key
  const energyMatch = trackA.energy === trackB.energy

  let score = 50 // Base score

  // BPM scoring
  if (bpmDiff === 0) score += 30
  else if (bpmDiff <= 2) score += 25
  else if (bpmDiff <= 5) score += 15
  else if (bpmDiff <= 10) score += 5
  else score -= 10

  // Key scoring
  if (keyMatch) score += 15
  else score += 5

  // Energy scoring
  if (energyMatch) score += 15
  else score += 5

  score = Math.max(0, Math.min(100, score))

  let summary = ''
  if (score >= 80) summary = 'Excellent match - these tracks will blend smoothly!'
  else if (score >= 60) summary = 'Good compatibility - minor adjustments needed'
  else if (score >= 40) summary = 'Moderate compatibility - requires careful mixing'
  else summary = 'Challenging mix - use advanced techniques'

  return { score, summary }
}
