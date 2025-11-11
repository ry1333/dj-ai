export function equalPower(x: number) {
  // x in [0,1] → equal-power crossfade curve
  return Math.cos(x * Math.PI * 0.5) ** 2
}

export async function decodeToBuffer(ctx: AudioContext, src: ArrayBuffer) {
  // Safari needs a copy of the buffer
  return await ctx.decodeAudioData(src.slice(0))
}

export async function fetchAsArrayBuffer(url: string) {
  const r = await fetch(url)
  if (!r.ok) throw new Error('Failed to load audio: ' + url)
  return await r.arrayBuffer()
}

export class Deck {
  ctx: AudioContext
  master: GainNode
  gain: GainNode
  low: BiquadFilterNode
  mid: BiquadFilterNode
  high: BiquadFilterNode
  filter: BiquadFilterNode
  buffer: AudioBuffer | null = null
  src: AudioBufferSourceNode | null = null
  startedAt = 0
  pausedAt = 0
  playing = false
  bpm = 124

  constructor(ctx: AudioContext, master: GainNode) {
    this.ctx = ctx
    this.master = master

    this.gain = ctx.createGain()
    this.low = ctx.createBiquadFilter();  this.low.type = 'lowshelf';  this.low.frequency.value = 200
    this.mid = ctx.createBiquadFilter();  this.mid.type = 'peaking';   this.mid.frequency.value = 1000; this.mid.Q.value = 0.7
    this.high= ctx.createBiquadFilter();  this.high.type= 'highshelf'; this.high.frequency.value = 5000
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.frequency.value = 22050

    // chain: src -> low -> mid -> high -> filter -> gain -> master
    this.low.connect(this.mid)
    this.mid.connect(this.high)
    this.high.connect(this.filter)
    this.filter.connect(this.gain)
    this.gain.connect(this.master)

    this.gain.gain.value = 1
  }

  private connectSource() {
    if (!this.buffer) return
    const node = this.ctx.createBufferSource()
    node.buffer = this.buffer
    node.playbackRate.value = 1
    node.connect(this.low)
    node.onended = () => { if (this.playing) this.stop(true) }
    this.src = node
  }

  async loadFromUrl(url: string) {
    const arr = await fetchAsArrayBuffer(url)
    this.buffer = await decodeToBuffer(this.ctx, arr)
    this.stop(true) // reset position but keep gain/EQ settings
  }

  async loadFromFile(file: File) {
    const arr = await file.arrayBuffer()
    this.buffer = await decodeToBuffer(this.ctx, arr)
    this.stop(true)
  }

  get currentTime() {
    if (!this.buffer) return 0
    return this.playing ? (this.ctx.currentTime - this.startedAt) + this.pausedAt : this.pausedAt
  }

  play() {
    if (!this.buffer || this.playing) return
    this.connectSource()
    this.startedAt = this.ctx.currentTime
    this.src!.start(0, this.pausedAt)
    this.playing = true
  }

  pause() {
    if (!this.playing) return
    this.src?.stop()
    this.pausedAt += this.ctx.currentTime - this.startedAt
    this.playing = false
    this.src = null
  }

  stop(keepGain = false) {
    this.src?.stop()
    this.src = null
    this.pausedAt = 0
    this.startedAt = 0
    this.playing = false
    if (!keepGain) this.gain.gain.value = 1
  }

  setRate(rate: number) {
    if (this.src) this.src.playbackRate.value = rate
  }

  setEQ({ low=0, mid=0, high=0 }: { low?: number; mid?: number; high?: number }) {
    this.low.gain.value  = low
    this.mid.gain.value  = mid
    this.high.gain.value = high
  }

  setFilterHz(hz: number) {
    // Validate input to prevent AudioParam errors
    if (!isFinite(hz) || hz < 20 || hz > 20000) return
    this.filter.frequency.value = hz
  }

  seek(seconds: number) {
    if (!this.buffer) return
    const wasPlaying = this.playing
    this.pause()
    this.pausedAt = Math.min(Math.max(seconds, 0), this.buffer.duration)
    if (wasPlaying) this.play()
  }
}

export class Mixer {
  ctx: AudioContext
  master: GainNode
  deckA: Deck
  deckB: Deck
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private recordingDestination: MediaStreamAudioDestinationNode | null = null

  constructor() {
    // @ts-ignore - Safari prefix
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.master = this.ctx.createGain()
    this.master.connect(this.ctx.destination)
    this.deckA = new Deck(this.ctx, this.master)
    this.deckB = new Deck(this.ctx, this.master)
    this.setCrossfade(0) // start with A full
  }

  // x in [0,1], 0=A only, 1=B only
  setCrossfade(x: number) {
    this.deckA.gain.gain.value = equalPower(x)
    this.deckB.gain.gain.value = equalPower(1 - x)
  }

  /**
   * Start recording the mixer output
   */
  startRecording() {
    if (this.mediaRecorder) {
      throw new Error('Already recording')
    }

    // Create a destination for recording
    this.recordingDestination = this.ctx.createMediaStreamDestination()
    this.master.connect(this.recordingDestination)

    // Set up MediaRecorder with the stream
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    this.mediaRecorder = new MediaRecorder(this.recordingDestination.stream, { mimeType })
    this.recordedChunks = []

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data)
      }
    }

    this.mediaRecorder.start(100) // Collect data every 100ms
  }

  /**
   * Stop recording and return the recorded audio as a Blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Not recording'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm'
        const blob = new Blob(this.recordedChunks, { type: mimeType })

        // Cleanup
        if (this.recordingDestination) {
          this.master.disconnect(this.recordingDestination)
          this.recordingDestination = null
        }
        this.mediaRecorder = null
        this.recordedChunks = []

        resolve(blob)
      }

      this.mediaRecorder.onerror = (event) => {
        reject(new Error('Recording failed: ' + event))
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * Check if currently recording
   */
  get isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording'
  }
}
