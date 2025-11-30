/**
 * Mock AI Mix API
 * Returns fake responses for testing the UI flow
 * Replace with real Gemini + Audio Engine later
 */

import type { UserMixRequest, AIMixResponse, StyleSpec, MixPlan } from './types'
import { findLoops, getRandomLoop, type Loop } from '../loops/loopLibrary'

// Simulate processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Generate a StyleSpec based on user request
 * (In production, this calls Gemini API)
 */
function generateStyleSpec(request: UserMixRequest): StyleSpec {
  const { description, genreHint, energyHint, userAudioBpmHint } = request

  // Simple keyword matching (Gemini will do this smartly)
  const lowerDesc = description.toLowerCase()

  let genre = genreHint || 'trap'
  let bpm = 120
  let energy: 'chill' | 'groove' | 'club' = energyHint || 'groove'
  let mood: string[] = []
  let instruments: string[] = []

  // Genre detection
  if (lowerDesc.includes('trap') || lowerDesc.includes('travis scott') || lowerDesc.includes('808')) {
    genre = 'trap'
    bpm = 140
    energy = 'club'
    mood = ['dark', 'aggressive', 'spacey']
    instruments = ['808 bass', 'snare rolls', 'hi-hat triplets', 'pad']
  } else if (lowerDesc.includes('house') || lowerDesc.includes('four on the floor')) {
    genre = 'house'
    bpm = 124
    energy = 'groove'
    mood = ['groovy', 'deep', 'warm']
    instruments = ['kick', 'clap', 'bass line', 'chord stabs']
  } else if (lowerDesc.includes('lofi') || lowerDesc.includes('chill') || lowerDesc.includes('study')) {
    genre = 'lofi'
    bpm = 85
    energy = 'chill'
    mood = ['relaxed', 'jazzy', 'nostalgic']
    instruments = ['dusty drums', 'jazz chords', 'soft bass']
  }

  // Use user audio BPM hint if provided
  if (userAudioBpmHint) {
    bpm = Math.round(userAudioBpmHint)
  }

  // Drop detection
  let dropBeat = 32 // default: 16 seconds at 120 BPM
  if (lowerDesc.match(/drop.*(?:at|around)\s*(?:0:)?(\d+)/)) {
    const seconds = parseInt(RegExp.$1)
    dropBeat = Math.round((seconds * bpm) / 60)
  }

  return {
    genre,
    subgenre: mood[0] || 'modern',
    bpm,
    energy,
    mood,
    arrangement: 'intro-build-drop',
    dropBeat,
    instrumentHints: instruments,
    ...(request.userAudioUrl && {
      userAudioPlacement: {
        role: 'lead',
        startBeat: 8,
        lengthBeats: Math.round((request.lengthSeconds || 30) * bpm / 60) - 16
      }
    })
  }
}

/**
 * Generate a MixPlan from StyleSpec
 * (In production, this is our Mix Planner logic)
 */
function generateMixPlan(styleSpec: StyleSpec, request: UserMixRequest): MixPlan {
  const { bpm, genre, mood, energy, arrangement, dropBeat = 32 } = styleSpec
  const durationSeconds = request.lengthSeconds || 30
  const durationBeats = Math.round((durationSeconds * bpm) / 60)

  const segments: MixPlan['segments'] = []

  // Find loops matching the StyleSpec criteria
  const drumsLoop = getRandomLoop({
    genre: [genre],
    role: 'drums',
    energy,
    bpm,
    bpmRange: 10
  })

  const bassLoop = getRandomLoop({
    genre: [genre],
    role: 'bass',
    energy,
    bpm,
    bpmRange: 10
  })

  const harmonyLoop = getRandomLoop({
    genre: [genre],
    role: genre === 'house' || genre === 'lofi' ? 'chords' : 'pad',
    energy,
    bpm,
    bpmRange: 10
  })

  const melodyLoop = getRandomLoop({
    genre: [genre],
    role: 'melody',
    mood,
    bpm,
    bpmRange: 10
  })

  // Simple arrangement: intro (0-8) → build (8-dropBeat) → drop (dropBeat-end)

  // Drums (full track)
  if (drumsLoop) {
    segments.push({
      id: 'drums-main',
      type: 'loop',
      clipId: drumsLoop.id,
      clipUrl: drumsLoop.path,
      startBeat: 0,
      lengthBeats: durationBeats,
      gainDb: -3,
    })
  }

  // Bass (starts at beat 8, after intro)
  if (bassLoop) {
    segments.push({
      id: 'bass-main',
      type: 'loop',
      clipId: bassLoop.id,
      clipUrl: bassLoop.path,
      startBeat: 8,
      lengthBeats: durationBeats - 8,
      gainDb: -6,
      fadeIn: 4,
    })
  }

  // Harmony/Chords/Pad (starts after intro)
  if (harmonyLoop) {
    segments.push({
      id: 'harmony-main',
      type: 'loop',
      clipId: harmonyLoop.id,
      clipUrl: harmonyLoop.path,
      startBeat: 16,
      lengthBeats: durationBeats - 16,
      gainDb: -9,
      fadeIn: 4,
    })
  }

  // Melody (starts at drop)
  if (melodyLoop && dropBeat < durationBeats) {
    segments.push({
      id: 'melody-drop',
      type: 'loop',
      clipId: melodyLoop.id,
      clipUrl: melodyLoop.path,
      startBeat: dropBeat,
      lengthBeats: durationBeats - dropBeat,
      gainDb: -9,
      fadeIn: 2,
    })
  }

  // User audio (if provided)
  if (request.userAudioUrl && styleSpec.userAudioPlacement) {
    const { startBeat, lengthBeats } = styleSpec.userAudioPlacement
    segments.push({
      id: 'user-audio',
      type: 'user_audio',
      clipId: 'user_track',
      clipUrl: request.userAudioUrl,
      startBeat,
      lengthBeats,
      gainDb: 0, // user audio at full volume
    })
  }

  return {
    bpm,
    durationBeats,
    durationSeconds,
    segments,
    metadata: {
      genre: styleSpec.genre,
      subgenre: styleSpec.subgenre,
      energy: styleSpec.energy,
      mood: styleSpec.mood,
      prompt: request.description,
      generatedAt: new Date().toISOString(),
    }
  }
}

/**
 * Mock AI Mix API endpoint
 * Returns a complete AIMixResponse for testing
 */
export async function generateAIMix(request: UserMixRequest): Promise<AIMixResponse> {
  console.log('🎵 Mock AI Mix: Generating...', request)

  // Simulate processing time
  await delay(2000)

  try {
    // Step 1: Generate StyleSpec (Gemini)
    const styleSpec = generateStyleSpec(request)
    console.log('✅ StyleSpec:', styleSpec)

    // Step 2: Generate MixPlan (Mix Planner)
    const mixPlan = generateMixPlan(styleSpec, request)
    console.log('✅ MixPlan:', mixPlan)

    // Step 3: Mock audio rendering (Audio Engine)
    // In production, this would render all segments and return audioUrl
    // For now, use first available loop as placeholder
    const mockAudioUrl = mixPlan.segments.find(s => s.clipUrl)?.clipUrl || '/loops/deep_house_124.wav'

    // Generate display message
    const message = `We made a ${styleSpec.subgenre || ''} ${styleSpec.genre} • ${styleSpec.energy} • ${styleSpec.bpm} BPM mix inspired by your description.`

    return {
      success: true,
      audioUrl: mockAudioUrl,
      styleSpec,
      mixPlan,
      message,
    }

  } catch (error) {
    console.error('❌ Mock AI Mix error:', error)
    return {
      success: false,
      audioUrl: '',
      styleSpec: {} as StyleSpec,
      mixPlan: {} as MixPlan,
      message: 'Failed to generate mix',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
