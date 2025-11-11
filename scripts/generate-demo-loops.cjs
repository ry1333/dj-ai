#!/usr/bin/env node

/**
 * Generate Simple Demo Audio Loops
 *
 * This script creates basic sine wave loops for testing the DJ app.
 * For production, replace these with real loops from Freesound.org (see DOWNLOAD_INSTRUCTIONS.md)
 */

const fs = require('fs');
const path = require('path');

// Audio parameters
const SAMPLE_RATE = 44100;
const CHANNELS = 2; // Stereo
const BIT_DEPTH = 16;

/**
 * Generate a simple sine wave loop
 */
function generateSineWaveLoop(frequency, bpm, bars = 4) {
  const beatsPerBar = 4;
  const totalBeats = bars * beatsPerBar;
  const beatDuration = 60 / bpm; // seconds per beat
  const duration = totalBeats * beatDuration; // total duration in seconds

  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const buffer = Buffer.alloc(numSamples * CHANNELS * (BIT_DEPTH / 8));

  for (let i = 0; i < numSamples; i++) {
    // Generate sine wave with envelope (fade in/out)
    const t = i / SAMPLE_RATE;
    const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10)); // Fade in/out
    const value = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5; // 50% amplitude

    // Convert to 16-bit PCM
    const sample = Math.max(-1, Math.min(1, value));
    const intValue = Math.round(sample * 32767);

    // Write stereo (same value for both channels)
    buffer.writeInt16LE(intValue, i * 4);
    buffer.writeInt16LE(intValue, i * 4 + 2);
  }

  return { buffer, numSamples, duration };
}

/**
 * Create WAV file header
 */
function createWavHeader(dataSize, sampleRate, channels, bitDepth) {
  const header = Buffer.alloc(44);

  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4); // File size - 8
  header.write('WAVE', 8);

  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28); // ByteRate
  header.writeUInt16LE(channels * bitDepth / 8, 32); // BlockAlign
  header.writeUInt16LE(bitDepth, 34);

  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return header;
}

/**
 * Save WAV file
 */
function saveWavFile(filename, audioData) {
  const dataSize = audioData.buffer.length;
  const header = createWavHeader(dataSize, SAMPLE_RATE, CHANNELS, BIT_DEPTH);
  const wavData = Buffer.concat([header, audioData.buffer]);

  const outputPath = path.join(__dirname, '..', 'public', 'loops', filename);
  fs.writeFileSync(outputPath, wavData);
  console.log(`✅ Created: ${filename} (${Math.round(audioData.duration)}s, ${Math.round(dataSize / 1024)}KB)`);
}

// Create output directory
const loopsDir = path.join(__dirname, '..', 'public', 'loops');
if (!fs.existsSync(loopsDir)) {
  fs.mkdirSync(loopsDir, { recursive: true });
}

console.log('🎵 Generating demo audio loops...\n');

// Generate loops with different frequencies and BPMs
const loops = [
  { name: 'deep_house_124.wav', frequency: 220, bpm: 124, bars: 4 }, // A3
  { name: 'tech_groove_128.wav', frequency: 293.66, bpm: 128, bars: 4 }, // D4
  { name: 'hiphop_beat_90.wav', frequency: 261.63, bpm: 90, bars: 4 }, // C4
  { name: 'lofi_chill_80.wav', frequency: 392, bpm: 80, bars: 4 }, // G4
  { name: 'edm_drop_128.wav', frequency: 329.63, bpm: 128, bars: 4 }, // E4
];

loops.forEach(({ name, frequency, bpm, bars }) => {
  const audioData = generateSineWaveLoop(frequency, bpm, bars);
  saveWavFile(name, audioData);
});

console.log('\n✨ Done! Simple demo loops created.');
console.log('\n⚠️  NOTE: These are basic sine wave placeholders for testing.');
console.log('📋 For production, download real loops from Freesound.org');
console.log('📄 See: public/loops/DOWNLOAD_INSTRUCTIONS.md\n');
