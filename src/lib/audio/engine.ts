/**
 * AudioEngine - Real Web Audio API implementation for DJ Studio
 * Handles two decks, crossfading, recording, and master output
 */

import { DeckId, DeckState, RecordingState } from './types';

export class AudioEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private decks: Record<DeckId, DeckState>;
  private crossfade = 0.5; // 0 = full A, 1 = full B
  private mediaDest: MediaStreamAudioDestinationNode;
  private recording: RecordingState;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    // Create media destination for recording
    this.mediaDest = this.ctx.createMediaStreamDestination();
    this.masterGain.connect(this.mediaDest);
    this.masterGain.connect(this.ctx.destination);

    this.decks = {
      A: this.createDeck('A'),
      B: this.createDeck('B'),
    };

    this.recording = {
      isRecording: false,
      recorder: null,
      startTime: 0,
      chunks: [],
    };

    this.updateCrossfader();
  }

  private createDeck(id: DeckId): DeckState {
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.masterGain);
    return {
      id,
      buffer: null,
      source: null,
      gainNode,
      isPlaying: false,
      startTime: 0,
      offset: 0,
      fileName: '',
      bpm: 120,
    };
  }

  /**
   * Load audio file into a deck
   */
  async loadDeck(id: DeckId, fileOrUrl: File | string, fileName?: string, bpm?: number): Promise<void> {
    let arrayBuffer: ArrayBuffer;

    if (typeof fileOrUrl === 'string') {
      const res = await fetch(fileOrUrl);
      if (!res.ok) throw new Error('Failed to load audio');
      arrayBuffer = await res.arrayBuffer();
    } else {
      arrayBuffer = await fileOrUrl.arrayBuffer();
    }

    const buffer = await this.ctx.decodeAudioData(arrayBuffer);

    // Stop current playback if any
    this.stop(id);

    const deck = this.decks[id];
    deck.buffer = buffer;
    deck.fileName = fileName || (typeof fileOrUrl === 'string' ? fileOrUrl : fileOrUrl.name);
    deck.bpm = bpm || 120;
    deck.offset = 0;
  }

  /**
   * Play a deck
   */
  play(id: DeckId): void {
    const deck = this.decks[id];
    if (!deck.buffer) {
      console.warn(`Deck ${id} has no buffer loaded`);
      return;
    }
    if (deck.isPlaying) return;

    const src = this.ctx.createBufferSource();
    src.buffer = deck.buffer;
    src.loop = true; // Loop by default for DJ mixing
    src.connect(deck.gainNode);
    src.start(0, deck.offset);

    deck.source = src;
    deck.startTime = this.ctx.currentTime;
    deck.isPlaying = true;
  }

  /**
   * Pause a deck
   */
  pause(id: DeckId): void {
    const deck = this.decks[id];
    if (!deck.isPlaying || !deck.source) return;

    deck.source.stop();
    // Calculate new offset
    const elapsed = this.ctx.currentTime - deck.startTime;
    deck.offset = (deck.offset + elapsed) % (deck.buffer?.duration || 1);
    deck.isPlaying = false;
    deck.source = null;
  }

  /**
   * Stop a deck and reset to beginning
   */
  stop(id: DeckId): void {
    const deck = this.decks[id];
    if (deck.source) {
      deck.source.stop();
      deck.source = null;
    }
    deck.isPlaying = false;
    deck.offset = 0;
  }

  /**
   * Seek to a specific position in a deck
   */
  seek(id: DeckId, seconds: number): void {
    const deck = this.decks[id];
    if (!deck.buffer) return;

    const wasPlaying = deck.isPlaying;
    if (wasPlaying) this.pause(id);

    deck.offset = Math.max(0, Math.min(seconds, deck.buffer.duration));

    if (wasPlaying) this.play(id);
  }

  /**
   * Set crossfader position (0 = full A, 1 = full B)
   */
  setCrossfader(value: number): void {
    this.crossfade = Math.min(1, Math.max(0, value));
    this.updateCrossfader();
  }

  private updateCrossfader(): void {
    // Equal power crossfade curve
    const a = Math.cos(this.crossfade * Math.PI / 2);
    const b = Math.sin(this.crossfade * Math.PI / 2);
    this.decks.A.gainNode.gain.value = a;
    this.decks.B.gainNode.gain.value = b;
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(value: number): void {
    this.masterGain.gain.value = Math.min(1, Math.max(0, value));
  }

  /**
   * Get current playback time for a deck
   */
  getCurrentTime(id: DeckId): number {
    const deck = this.decks[id];
    if (!deck.buffer) return 0;
    if (!deck.isPlaying) return deck.offset;

    const elapsed = this.ctx.currentTime - deck.startTime;
    return (deck.offset + elapsed) % deck.buffer.duration;
  }

  /**
   * Get duration of loaded audio in a deck
   */
  getDuration(id: DeckId): number {
    return this.decks[id].buffer?.duration ?? 0;
  }

  /**
   * Get deck state
   */
  getDeckState(id: DeckId): DeckState {
    return this.decks[id];
  }

  /**
   * Check if a deck is playing
   */
  isPlaying(id: DeckId): boolean {
    return this.decks[id].isPlaying;
  }

  /**
   * Resume audio context (required for browser autoplay policies)
   */
  async resumeContext(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Get media stream for recording
   */
  getMediaStream(): MediaStream {
    return this.mediaDest.stream;
  }

  /**
   * Start recording master output
   */
  async startRecording(): Promise<void> {
    if (this.recording.isRecording) return;

    await this.resumeContext();

    const stream = this.getMediaStream();
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm',
    });

    this.recording.chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recording.chunks.push(e.data);
      }
    };

    recorder.start(100); // Capture in 100ms chunks
    this.recording.recorder = recorder;
    this.recording.isRecording = true;
    this.recording.startTime = Date.now();
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording(): Promise<Blob> {
    if (!this.recording.isRecording || !this.recording.recorder) {
      throw new Error('No recording in progress');
    }

    return new Promise((resolve, reject) => {
      const recorder = this.recording.recorder!;

      recorder.onstop = () => {
        const blob = new Blob(this.recording.chunks, { type: 'audio/webm' });
        this.recording.isRecording = false;
        this.recording.recorder = null;
        this.recording.chunks = [];
        resolve(blob);
      };

      recorder.onerror = (e) => {
        reject(e);
      };

      recorder.stop();
    });
  }

  /**
   * Get recording duration in seconds
   */
  getRecordingDuration(): number {
    if (!this.recording.isRecording) return 0;
    return (Date.now() - this.recording.startTime) / 1000;
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording.isRecording;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop('A');
    this.stop('B');
    if (this.recording.recorder) {
      this.recording.recorder.stop();
    }
    this.ctx.close();
  }
}
