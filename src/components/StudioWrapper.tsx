import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Studio as StudioUI } from '../studioUi';
import { Mixer } from '../lib/audio/mixer';
import { DeckId, DeckState, MixerState, Track } from '../studioUi/types';
import { MOCK_TRACKS } from '../studioUi/constants';

const StudioWrapper: React.FC = () => {
  const mixer = useMemo(() => new Mixer(), []);
  const raf = useRef<number | null>(null);

  // Deck State
  const [deckA, setDeckA] = useState<DeckState>({
    playing: false,
    track: null,
    volume: 80,
    eq: { high: 0, mid: 0, low: 0 },
    loopActive: false,
    loopLength: 4
  });

  const [deckB, setDeckB] = useState<DeckState>({
    playing: false,
    track: null,
    volume: 80,
    eq: { high: 0, mid: 0, low: 0 },
    loopActive: false,
    loopLength: 4
  });

  // Mixer State
  const [mixerState, setMixerState] = useState<MixerState>({
    masterVolume: 90,
    boothMonitor: 70,
    crossfader: 0 // -1 to 1 range for StudioUI, will convert to 0-1 for audio engine
  });

  // Animation loop for syncing play state
  useEffect(() => {
    const tick = () => {
      setDeckA(prev => ({ ...prev, playing: mixer.deckA.playing }));
      setDeckB(prev => ({ ...prev, playing: mixer.deckB.playing }));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [mixer]);

  // Apply mixer settings
  useEffect(() => {
    // Convert -1 to 1 range to 0 to 1 range for audio engine
    const crossfadeValue = (mixerState.crossfader + 1) / 2;
    mixer.setCrossfade(crossfadeValue);
  }, [mixerState.crossfader, mixer]);

  useEffect(() => {
    mixer.master.gain.value = mixerState.masterVolume / 100;
  }, [mixerState.masterVolume, mixer]);

  // Handlers
  const handlePlayToggle = (deckId: DeckId) => {
    const deck = deckId === DeckId.A ? mixer.deckA : mixer.deckB;

    if (deck.playing) {
      deck.pause();
    } else {
      deck.play();
    }
  };

  const handleLoadTrack = async (track: Track, deckId: DeckId) => {
    const deck = deckId === DeckId.A ? mixer.deckA : mixer.deckB;
    const setDeck = deckId === DeckId.A ? setDeckA : setDeckB;

    try {
      // Load the actual audio file if URL is provided
      if (track.audioUrl) {
        await deck.loadFromUrl(track.audioUrl);
      }

      setDeck(prev => ({
        ...prev,
        track,
        playing: false
      }));

      // Set BPM for the deck
      deck.bpm = track.bpm;
    } catch (error) {
      console.error('Error loading track:', error);
      alert(`Failed to load ${track.title}. Error: ${error}`);
    }
  };

  const handleDeckEqChange = (deckId: DeckId, eq: Partial<DeckState['eq']>) => {
    const deck = deckId === DeckId.A ? mixer.deckA : mixer.deckB;
    const setDeck = deckId === DeckId.A ? setDeckA : setDeckB;

    setDeck(prev => {
      const newEq = { ...prev.eq, ...eq };

      // Convert 0-100 range to -12 to +12 dB range
      const convertToDb = (value: number) => ((value - 50) / 50) * 12;

      deck.setEQ({
        low: convertToDb(newEq.low),
        mid: convertToDb(newEq.mid),
        high: convertToDb(newEq.high)
      });

      return { ...prev, eq: newEq };
    });
  };

  const handleDeckVolumeChange = (deckId: DeckId, vol: number) => {
    const deck = deckId === DeckId.A ? mixer.deckA : mixer.deckB;
    const setDeck = deckId === DeckId.A ? setDeckA : setDeckB;

    deck.gain.gain.value = vol / 100;
    setDeck(prev => ({ ...prev, volume: vol }));
  };

  const handleMixerChange = (update: Partial<MixerState>) => {
    setMixerState(prev => ({ ...prev, ...update }));
  };

  return (
    <StudioUI
      library={MOCK_TRACKS}
      onPlayToggle={handlePlayToggle}
      onLoadTrack={handleLoadTrack}
      onDeckEqChange={handleDeckEqChange}
      onDeckVolumeChange={handleDeckVolumeChange}
      onMixerChange={handleMixerChange}
      initialDeckA={deckA}
      initialDeckB={deckB}
      initialMixer={mixerState}
    />
  );
};

export default StudioWrapper;
