import React, { useState, useEffect } from 'react';
import Deck from './Deck';
import Mixer from './Mixer';
import { DeckId, DeckState, MixerState, Track } from '../types';
import { MOCK_TRACKS } from '../constants';

interface StudioProps {
  library: Track[];
  // Optional handlers for connecting to real audio engine
  onPlayToggle?: (deckId: DeckId) => void;
  onLoadTrack?: (track: Track, deckId: DeckId) => void;
  onDeckEqChange?: (deckId: DeckId, eq: Partial<DeckState['eq']>) => void;
  onDeckVolumeChange?: (deckId: DeckId, vol: number) => void;
  onMixerChange?: (update: Partial<MixerState>) => void;
  // Optional initial states
  initialDeckA?: Partial<DeckState>;
  initialDeckB?: Partial<DeckState>;
  initialMixer?: Partial<MixerState>;
}

const Studio: React.FC<StudioProps> = ({
  library,
  onPlayToggle: externalPlayToggle,
  onLoadTrack: externalLoadTrack,
  onDeckEqChange: externalDeckEqChange,
  onDeckVolumeChange: externalDeckVolumeChange,
  onMixerChange: externalMixerChange,
  initialDeckA,
  initialDeckB,
  initialMixer
}) => {
  // Deck State
  const [deckA, setDeckA] = useState<DeckState>({
    playing: false,
    track: MOCK_TRACKS[0],
    volume: 80,
    eq: { high: 50, mid: 50, low: 50 },
    loopActive: false,
    loopLength: 4,
    ...initialDeckA
  });

  const [deckB, setDeckB] = useState<DeckState>({
    playing: false,
    track: MOCK_TRACKS[1],
    volume: 80,
    eq: { high: 50, mid: 50, low: 50 },
    loopActive: true,
    loopLength: 4,
    ...initialDeckB
  });

  // Mixer State
  const [mixer, setMixer] = useState<MixerState>({
    masterVolume: 90,
    boothMonitor: 70,
    crossfader: 0,
    ...initialMixer
  });

  const handlePlayToggle = (deckId: DeckId) => {
    // Call external handler if provided
    if (externalPlayToggle) {
      externalPlayToggle(deckId);
    }
    // Update local state
    if (deckId === DeckId.A) setDeckA(prev => ({ ...prev, playing: !prev.playing }));
    else setDeckB(prev => ({ ...prev, playing: !prev.playing }));
  };

  const handleLoadTrack = (track: Track, deckId: DeckId) => {
    // Call external handler if provided
    if (externalLoadTrack) {
      externalLoadTrack(track, deckId);
    }
    // Update local state
    if (deckId === DeckId.A) setDeckA(prev => ({ ...prev, track, playing: false }));
    else setDeckB(prev => ({ ...prev, track, playing: false }));
  };

  const handleDeckEqChange = (deckId: DeckId, eq: Partial<DeckState['eq']>) => {
    // Call external handler if provided
    if (externalDeckEqChange) {
      externalDeckEqChange(deckId, eq);
    }
    // Update local state
    if (deckId === DeckId.A) setDeckA(prev => ({ ...prev, eq: { ...prev.eq, ...eq } }));
    else setDeckB(prev => ({ ...prev, eq: { ...prev.eq, ...eq } }));
  };

  const handleDeckVolumeChange = (deckId: DeckId, vol: number) => {
    // Call external handler if provided
    if (externalDeckVolumeChange) {
      externalDeckVolumeChange(deckId, vol);
    }
    // Update local state
    if (deckId === DeckId.A) setDeckA(prev => ({ ...prev, volume: vol }));
    else setDeckB(prev => ({ ...prev, volume: vol }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] gap-4 h-full">
      {/* Deck A */}
      <Deck 
        id={DeckId.A} 
        state={deckA} 
        onPlayToggle={() => handlePlayToggle(DeckId.A)} 
        onLoadTrack={handleLoadTrack}
        availableTracks={library}
      />

      {/* Mixer (Center) */}
      <div className="order-last lg:order-none h-[500px] lg:h-full">
         <Mixer
            state={mixer}
            deckAState={deckA}
            deckBState={deckB}
            onMixerChange={(update) => {
              // Call external handler if provided
              if (externalMixerChange) {
                externalMixerChange(update);
              }
              // Update local state
              setMixer(prev => ({ ...prev, ...update }));
            }}
            onDeckEqChange={handleDeckEqChange}
            onDeckVolumeChange={handleDeckVolumeChange}
         />
      </div>

      {/* Deck B */}
      <Deck 
        id={DeckId.B} 
        state={deckB} 
        onPlayToggle={() => handlePlayToggle(DeckId.B)} 
        onLoadTrack={handleLoadTrack}
        availableTracks={library}
      />
    </div>
  );
};

export default Studio;
