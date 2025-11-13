// Audio engine type definitions

export type DeckId = 'A' | 'B';

export interface DeckState {
  id: DeckId;
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  isPlaying: boolean;
  startTime: number;     // when playback started (audioContext.currentTime)
  offset: number;        // where in the buffer we started (seconds)
  fileName: string;      // name of loaded file
  bpm: number;          // detected/set BPM
}

export interface RecordingState {
  isRecording: boolean;
  recorder: MediaRecorder | null;
  startTime: number;
  chunks: BlobPart[];
}
