/**
 * AI Mix Generation Types
 *
 * Flow:
 * 1. User describes vibe + optional audio → UserMixRequest
 * 2. Gemini processes → StyleSpec
 * 3. Mix Planner converts StyleSpec → MixPlan
 * 4. Audio Engine renders MixPlan → audio file
 */

// ============================================================================
// A. User Input
// ============================================================================

export type UserMixRequest = {
  // Natural language description
  description: string

  // Optional quick presets (from UI cards)
  genreHint?: 'house' | 'techno' | 'hip-hop' | 'lofi' | 'edm' | 'trap' | 'dnb'
  energyHint?: 'chill' | 'groove' | 'club'

  // Optional user-uploaded audio
  userAudioUrl?: string
  userAudioBpmHint?: number // from tempo detection

  // Target length in seconds (default 30-40)
  lengthSeconds?: number
}

// ============================================================================
// B. Gemini Output (Style Specification)
// ============================================================================

export type StyleSpec = {
  // Core identity
  genre: string // "trap", "house", "techno", etc.
  subgenre?: string // "dark club", "melodic", "minimal", etc.

  // Tempo & energy
  bpm: number // 80-180, Gemini decides based on vibe
  energy: 'chill' | 'groove' | 'club'

  // Mood descriptors for loop selection
  mood: string[] // ["dark", "spacey", "aggressive"]

  // High-level arrangement
  arrangement: 'intro-build-drop' | 'smooth-blend' | 'loop-jam' | 'vocal-spotlight'

  // Drop/peak moment (in beats)
  dropBeat?: number // e.g., beat 32 = 16 seconds at 120 BPM

  // Instrumentation hints for loop picker
  instrumentHints: string[] // ["808 bass", "short pluck", "wide pad", "snare rolls"]

  // User audio integration (if provided)
  userAudioPlacement?: {
    role: 'lead' | 'background' | 'intro-outro'
    startBeat: number
    lengthBeats: number
  }
}

// ============================================================================
// C. Mix Plan (Concrete Timeline)
// ============================================================================

export type MixSegmentType = 'loop' | 'user_audio' | 'fx' | 'silence'

export type MixSegment = {
  id: string
  type: MixSegmentType

  // Which audio file to use
  clipId: string // loop ID from library, or user track ID
  clipUrl?: string // direct URL for playback

  // Timeline position
  startBeat: number
  lengthBeats: number

  // Audio processing
  gainDb?: number // volume adjustment (-12 to +6)
  fadeIn?: number // fade in duration in beats
  fadeOut?: number // fade out duration in beats

  // Effects
  filter?: {
    type: 'lowpass' | 'highpass' | 'bandpass'
    frequency: number // Hz
  }
  reverb?: {
    mix: number // 0-1
    time: number // seconds
  }
}

export type MixPlan = {
  // Timing
  bpm: number
  durationBeats: number
  durationSeconds: number

  // Timeline segments (all tracks/loops)
  segments: MixSegment[]

  // Metadata for display
  metadata: {
    genre: string
    subgenre?: string
    energy: string
    mood: string[]
    prompt: string // original user description
    userTrackId?: string
    generatedAt: string // ISO timestamp
  }
}

// ============================================================================
// D. API Response
// ============================================================================

export type AIMixResponse = {
  success: boolean

  // Generated audio
  audioUrl: string // final rendered mix
  waveformData?: number[] // for visualization

  // What we built
  styleSpec: StyleSpec
  mixPlan: MixPlan

  // Display message
  message: string // "We made a dark trap • club • 142 BPM mix inspired by your description."

  // Error handling
  error?: string
}

// ============================================================================
// E. Loop Library Types (for Mix Planner)
// ============================================================================

export type LoopCategory = 'drums' | 'bass' | 'chords' | 'melody' | 'fx' | 'vocal'

export type LoopMetadata = {
  id: string
  url: string
  category: LoopCategory
  bpm: number
  key?: string // musical key (Am, C, etc.)

  // Tags for AI selection
  genre: string[] // ["trap", "hip-hop"]
  mood: string[] // ["dark", "aggressive", "spacey"]
  instruments: string[] // ["808", "snare", "hi-hat"]

  // Audio info
  durationBeats: number
  durationSeconds: number
}

// ============================================================================
// F. Gemini Prompt Template
// ============================================================================

export type GeminiPromptInput = {
  description: string
  genreHint?: string
  energyHint?: string
  userAudioBpmHint?: number
  targetLengthSeconds: number
}

export const GEMINI_SYSTEM_PROMPT = `You are an expert music producer and DJ. Your job is to analyze user descriptions and return a structured JSON specification for an AI-generated mix.

RULES:
1. ONLY return valid JSON matching the StyleSpec schema
2. Choose BPM based on genre and vibe (trap: 130-150, house: 120-128, lofi: 80-100, etc.)
3. Select mood keywords that help pick the right loops (dark, bright, aggressive, chill, etc.)
4. Suggest specific instruments that match the vibe
5. If user mentions a drop, calculate dropBeat (e.g., "drop at 20s" = beat 40 at 120 BPM)
6. Keep instrumentHints practical (808 bass, snare, hi-hat, pad, pluck, etc.)

RESPONSE FORMAT:
{
  "genre": string,
  "subgenre": string,
  "bpm": number,
  "energy": "chill" | "groove" | "club",
  "mood": string[],
  "arrangement": "intro-build-drop" | "smooth-blend" | "loop-jam" | "vocal-spotlight",
  "dropBeat": number,
  "instrumentHints": string[]
}

Analyze the user's request and return ONLY the JSON.`
