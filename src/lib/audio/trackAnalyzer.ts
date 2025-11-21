import Meyda from 'meyda'

export interface TrackAnalysis {
  bpm: number
  key: string
  energy: 'low' | 'medium' | 'high'
  duration: number
  waveformData: number[]
  spectralCentroid: number
  rms: number
}

/**
 * Analyzes an audio file to extract musical features
 * Uses Web Audio API and Meyda for analysis
 */
export async function analyzeTrack(audioFile: File | string): Promise<TrackAnalysis> {
  const audioContext = new AudioContext()

  let audioBuffer: AudioBuffer

  // Load audio from File or URL
  if (typeof audioFile === 'string') {
    const response = await fetch(audioFile)
    const arrayBuffer = await response.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  } else {
    const arrayBuffer = await audioFile.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  }

  const channelData = audioBuffer.getChannelData(0) // Use first channel
  const sampleRate = audioBuffer.sampleRate
  const duration = audioBuffer.duration

  // Extract waveform data (downsampled for visualization)
  const waveformData = extractWaveform(channelData, 500)

  // Detect BPM using autocorrelation
  const bpm = detectBPM(channelData, sampleRate)

  // Estimate musical key (simplified for MVP)
  const key = estimateKey(channelData, sampleRate)

  // Calculate energy level
  const rms = calculateRMS(channelData)
  const energy = rms > 0.15 ? 'high' : rms > 0.08 ? 'medium' : 'low'

  // Calculate spectral centroid (brightness)
  const spectralCentroid = calculateSpectralCentroid(channelData, sampleRate)

  await audioContext.close()

  return {
    bpm: Math.round(bpm),
    key,
    energy,
    duration,
    waveformData,
    spectralCentroid,
    rms
  }
}

/**
 * Extracts downsampled waveform for visualization
 */
function extractWaveform(channelData: Float32Array, numSamples: number): number[] {
  const blockSize = Math.floor(channelData.length / numSamples)
  const waveform: number[] = []

  for (let i = 0; i < numSamples; i++) {
    const start = i * blockSize
    const end = start + blockSize
    let sum = 0

    for (let j = start; j < end && j < channelData.length; j++) {
      sum += Math.abs(channelData[j])
    }

    waveform.push(sum / blockSize)
  }

  return waveform
}

/**
 * Detects BPM using autocorrelation
 * Based on simplified beat detection algorithm
 */
function detectBPM(channelData: Float32Array, sampleRate: number): number {
  // Calculate energy in chunks
  const chunkSize = Math.floor(sampleRate * 0.05) // 50ms chunks
  const energyArray: number[] = []

  for (let i = 0; i < channelData.length; i += chunkSize) {
    let sum = 0
    for (let j = 0; j < chunkSize && i + j < channelData.length; j++) {
      sum += channelData[i + j] ** 2
    }
    energyArray.push(sum / chunkSize)
  }

  // Find peaks in energy
  const peaks: number[] = []
  for (let i = 1; i < energyArray.length - 1; i++) {
    if (energyArray[i] > energyArray[i - 1] && energyArray[i] > energyArray[i + 1]) {
      peaks.push(i)
    }
  }

  if (peaks.length < 2) return 120 // Default BPM if detection fails

  // Calculate intervals between peaks
  const intervals: number[] = []
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i - 1])
  }

  // Find most common interval (mode)
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length

  // Convert interval to BPM
  const secondsPerBeat = (avgInterval * chunkSize) / sampleRate
  const bpm = 60 / secondsPerBeat

  // Clamp to reasonable range (80-180 BPM)
  if (bpm < 80) return bpm * 2
  if (bpm > 180) return bpm / 2

  return bpm
}

/**
 * Estimates musical key (simplified)
 * For MVP, returns common keys based on spectral analysis
 */
function estimateKey(channelData: Float32Array, sampleRate: number): string {
  // Simplified key detection using spectral analysis
  // In production, use more sophisticated pitch detection

  const fft = performFFT(channelData.slice(0, 8192))
  const dominantFreq = findDominantFrequency(fft, sampleRate)

  // Map frequency to musical key (simplified)
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const keyIndex = Math.round((Math.log2(dominantFreq / 440) * 12 + 9)) % 12
  const key = keys[Math.abs(keyIndex)]

  // Add major/minor (simplified - assume major for high energy)
  const rms = calculateRMS(channelData)
  const mode = rms > 0.12 ? '' : 'm'

  return `${key}${mode}`
}

/**
 * Calculates RMS (Root Mean Square) for energy estimation
 */
function calculateRMS(channelData: Float32Array): number {
  let sum = 0
  for (let i = 0; i < channelData.length; i++) {
    sum += channelData[i] ** 2
  }
  return Math.sqrt(sum / channelData.length)
}

/**
 * Calculates spectral centroid (brightness of sound)
 */
function calculateSpectralCentroid(channelData: Float32Array, sampleRate: number): number {
  const fft = performFFT(channelData.slice(0, 8192))
  const magnitudes = fft.map(c => Math.sqrt(c.real ** 2 + c.imag ** 2))

  let numerator = 0
  let denominator = 0

  for (let i = 0; i < magnitudes.length; i++) {
    const freq = (i * sampleRate) / (magnitudes.length * 2)
    numerator += freq * magnitudes[i]
    denominator += magnitudes[i]
  }

  return denominator === 0 ? 0 : numerator / denominator
}

/**
 * Simple FFT implementation (using built-in if available)
 */
function performFFT(samples: Float32Array): Array<{real: number, imag: number}> {
  const n = samples.length
  const result: Array<{real: number, imag: number}> = []

  for (let k = 0; k < n / 2; k++) {
    let real = 0
    let imag = 0

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * k * i) / n
      real += samples[i] * Math.cos(angle)
      imag -= samples[i] * Math.sin(angle)
    }

    result.push({ real, imag })
  }

  return result
}

/**
 * Finds dominant frequency from FFT results
 */
function findDominantFrequency(fft: Array<{real: number, imag: number}>, sampleRate: number): number {
  let maxMagnitude = 0
  let maxIndex = 0

  for (let i = 0; i < fft.length; i++) {
    const magnitude = Math.sqrt(fft[i].real ** 2 + fft[i].imag ** 2)
    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude
      maxIndex = i
    }
  }

  return (maxIndex * sampleRate) / (fft.length * 2)
}

/**
 * Analyzes compatibility between two tracks
 */
export function analyzeCompatibility(trackA: TrackAnalysis, trackB: TrackAnalysis): {
  score: number
  bpmDiff: number
  keyCompatible: boolean
  energyMatch: boolean
} {
  // BPM compatibility (closer = better)
  const bpmDiff = Math.abs(trackA.bpm - trackB.bpm)
  const bpmScore = Math.max(0, 100 - (bpmDiff * 5)) // Penalize 5 points per BPM difference

  // Key compatibility (check if harmonically compatible)
  const keyCompatible = areKeysCompatible(trackA.key, trackB.key)
  const keyScore = keyCompatible ? 100 : 50

  // Energy match
  const energyMatch = trackA.energy === trackB.energy
  const energyScore = energyMatch ? 100 : 70

  // Overall score (weighted average)
  const score = Math.round((bpmScore * 0.4 + keyScore * 0.3 + energyScore * 0.3))

  return {
    score,
    bpmDiff,
    keyCompatible,
    energyMatch
  }
}

/**
 * Checks if two musical keys are harmonically compatible
 */
function areKeysCompatible(keyA: string, keyB: string): boolean {
  // Simplified harmonic compatibility check
  // Compatible if: same key, relative major/minor, or perfect 5th apart

  if (keyA === keyB) return true

  const compatiblePairs: { [key: string]: string[] } = {
    'C': ['Am', 'G', 'F', 'C#', 'Dm'],
    'C#': ['A#m', 'G#', 'F#', 'C', 'D#m'],
    'D': ['Bm', 'A', 'G', 'C#', 'Em'],
    'D#': ['Cm', 'A#', 'G#', 'D', 'Fm'],
    'E': ['C#m', 'B', 'A', 'D#', 'F#m'],
    'F': ['Dm', 'C', 'A#', 'E', 'Gm'],
    'F#': ['D#m', 'C#', 'B', 'F', 'G#m'],
    'G': ['Em', 'D', 'C', 'F#', 'Am'],
    'G#': ['Fm', 'D#', 'C#', 'G', 'A#m'],
    'A': ['F#m', 'E', 'D', 'G#', 'Bm'],
    'A#': ['Gm', 'F', 'D#', 'A', 'Cm'],
    'B': ['G#m', 'F#', 'E', 'A#', 'C#m'],
  }

  return compatiblePairs[keyA]?.includes(keyB) || compatiblePairs[keyB]?.includes(keyA) || false
}
