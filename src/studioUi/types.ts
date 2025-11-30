export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  length: string;
  genre: string;
  cover?: string;
  audioUrl?: string; // URL to the audio file
}

export enum DeckId {
  A = 'A',
  B = 'B'
}

export interface DeckState {
  playing: boolean;
  track: Track | null;
  volume: number;
  eq: {
    high: number;
    mid: number;
    low: number;
  };
  loopActive: boolean;
  loopLength: number;
}

export interface MixerState {
  masterVolume: number;
  boothMonitor: number;
  crossfader: number; // -1 (A) to 1 (B)
}
