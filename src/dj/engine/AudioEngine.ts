/**
 * AudioEngine - Single Web Audio graph for DJ mixing
 * Provides: dual decks, 3-band EQ, crossfader, master output, recording
 */

export type DeckID = 'A' | 'B'

interface DeckNodes {
  src: AudioBufferSourceNode | null
  buffer: AudioBuffer | null
  startTime: number
  pausedAt: number
  eq: {
    low: BiquadFilterNode
    mid: BiquadFilterNode
    high: BiquadFilterNode
  }
  gain: GainNode
}

export class AudioEngine {
  ctx: AudioContext
  masterGain: GainNode
  analyser: AnalyserNode
  mediaDest: MediaStreamAudioDestinationNode
  recorder: MediaRecorder | null = null
  recordedChunks: BlobPart[] = []

  decks: Record<DeckID, DeckNodes>
  crossfader: {
    value: number
    aGain: GainNode
    bGain: GainNode
  }

  constructor() {
    this.ctx = new AudioContext()

    // Master chain
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.8 // Leave headroom

    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.8

    this.mediaDest = this.ctx.createMediaStreamDestination()

    // Create decks
    this.decks = {
      A: this.createDeck(),
      B: this.createDeck()
    }

    // Crossfader
    this.crossfader = {
      value: 0,
      aGain: this.ctx.createGain(),
      bGain: this.ctx.createGain()
    }

    // Wire the graph
    this.wireGraph()

    // Initialize crossfader at center
    this.setCrossfader(0)
  }

  private createDeck(): DeckNodes {
    // 3-band EQ
    const low = this.ctx.createBiquadFilter()
    low.type = 'lowshelf'
    low.frequency.value = 220
    low.gain.value = 0

    const mid = this.ctx.createBiquadFilter()
    mid.type = 'peaking'
    mid.frequency.value = 1000
    mid.Q.value = 0.7
    mid.gain.value = 0

    const high = this.ctx.createBiquadFilter()
    high.type = 'highshelf'
    high.frequency.value = 8000
    high.gain.value = 0

    const gain = this.ctx.createGain()
    gain.gain.value = 1

    // Chain EQ
    low.connect(mid)
    mid.connect(high)
    high.connect(gain)

    return {
      src: null,
      buffer: null,
      startTime: 0,
      pausedAt: 0,
      eq: { low, mid, high },
      gain
    }
  }

  private wireGraph() {
    // Deck A chain
    this.decks.A.gain.connect(this.crossfader.aGain)

    // Deck B chain
    this.decks.B.gain.connect(this.crossfader.bGain)

    // Crossfader outputs to master
    const mix = this.ctx.createGain()
    this.crossfader.aGain.connect(mix)
    this.crossfader.bGain.connect(mix)

    // Master chain
    mix.connect(this.masterGain)
    this.masterGain.connect(this.analyser)
    this.masterGain.connect(this.ctx.destination)
    this.masterGain.connect(this.mediaDest)
  }

  /**
   * Load audio into a deck
   */
  async load(id: DeckID, arrayBuffer: ArrayBuffer): Promise<void> {
    const deck = this.decks[id]

    // Decode audio
    const buffer = await this.ctx.decodeAudioData(arrayBuffer)

    // Stop existing source if playing
    if (deck.src) {
      deck.src.stop()
      deck.src.disconnect()
    }

    // Store buffer
    deck.buffer = buffer
    deck.startTime = 0
    deck.pausedAt = 0
  }

  /**
   * Play a deck
   */
  play(id: DeckID): void {
    const deck = this.decks[id]

    if (!deck.buffer) {
      console.warn(`Deck ${id} has no loaded audio`)
      return
    }

    // Resume audio context if suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // Create new source
    const src = this.ctx.createBufferSource()
    src.buffer = deck.buffer
    src.connect(deck.eq.low)

    // Start from paused position or beginning
    const offset = deck.pausedAt
    src.start(0, offset)
    deck.startTime = this.ctx.currentTime - offset

    deck.src = src
  }

  /**
   * Pause a deck
   */
  pause(id: DeckID): void {
    const deck = this.decks[id]

    if (deck.src) {
      // Calculate current position
      deck.pausedAt = this.ctx.currentTime - deck.startTime

      // Stop source
      deck.src.stop()
      deck.src.disconnect()
      deck.src = null
    }
  }

  /**
   * Stop a deck (resets to beginning)
   */
  stop(id: DeckID): void {
    const deck = this.decks[id]

    if (deck.src) {
      deck.src.stop()
      deck.src.disconnect()
      deck.src = null
    }

    deck.startTime = 0
    deck.pausedAt = 0
  }

  /**
   * Get current playback position in seconds
   */
  getPosition(id: DeckID): number {
    const deck = this.decks[id]

    if (deck.src) {
      return this.ctx.currentTime - deck.startTime
    }

    return deck.pausedAt
  }

  /**
   * Get deck duration in seconds
   */
  getDuration(id: DeckID): number {
    return this.decks[id].buffer?.duration || 0
  }

  /**
   * Set playback rate (pitch)
   */
  setRate(id: DeckID, rate: number): void {
    const deck = this.decks[id]
    if (deck.src) {
      deck.src.playbackRate.value = rate
    }
  }

  /**
   * Set EQ band gain in dB (-24 to +24)
   */
  setEQ(id: DeckID, band: 'low' | 'mid' | 'high', db: number): void {
    const deck = this.decks[id]
    deck.eq[band].gain.value = Math.max(-24, Math.min(24, db))
  }

  /**
   * Set crossfader position (-1 = full A, 0 = center, +1 = full B)
   */
  setCrossfader(position: number): void {
    this.crossfader.value = Math.max(-1, Math.min(1, position))

    // Equal-power crossfade curve
    const t = (this.crossfader.value + 1) / 2 // Normalize to 0..1
    const a = Math.cos(t * Math.PI / 2)
    const b = Math.cos((1 - t) * Math.PI / 2)

    this.crossfader.aGain.gain.value = a
    this.crossfader.bGain.gain.value = b
  }

  /**
   * Get analyser data for visualization
   */
  getAnalyserData(): Uint8Array {
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(data)
    return data
  }

  /**
   * Start recording the master output
   */
  async recordStart(): Promise<void> {
    this.recordedChunks = []

    this.recorder = new MediaRecorder(this.mediaDest.stream, {
      mimeType: 'audio/webm'
    })

    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data)
      }
    }

    this.recorder.start()
  }

  /**
   * Stop recording and return the audio blob
   */
  async recordStop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.recorder) {
        resolve(new Blob())
        return
      }

      this.recorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
        this.recordedChunks = []
        resolve(blob)
      }

      this.recorder.stop()
    })
  }

  /**
   * Check if a deck is currently playing
   */
  isPlaying(id: DeckID): boolean {
    return this.decks[id].src !== null
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    this.stop('A')
    this.stop('B')

    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop()
    }

    this.ctx.close()
  }
}

// Singleton instance
export const audioEngine = new AudioEngine()
