import { useState, useEffect } from 'react';
import { Mixer } from '../lib/audio/mixer';
import ProDeck from '../components/ProDeck';
import ProMixer from '../components/ProMixer';

export default function ProStudio() {
  const [mixer] = useState(() => new Mixer());

  // Deck A state
  const [aDeckState, setADeckState] = useState({
    trackName: '',
    artist: '',
    playing: false,
    currentTime: 0,
    duration: 0,
    bpm: 128,
    key: 'Am'
  });

  // Deck B state
  const [bDeckState, setBDeckState] = useState({
    trackName: '',
    artist: '',
    playing: false,
    currentTime: 0,
    duration: 0,
    bpm: 128,
    key: 'Am'
  });

  // EQ state
  const [aEQ, setAEQ] = useState({ high: 0, mid: 0, low: 0 });
  const [bEQ, setBEQ] = useState({ high: 0, mid: 0, low: 0 });

  // Mixer state
  const [masterVolume, setMasterVolume] = useState(80);
  const [boothVolume, setBoothVolume] = useState(70);
  const [crossfader, setCrossfader] = useState(0.5);

  // Update playback positions
  useEffect(() => {
    const interval = setInterval(() => {
      setADeckState(prev => ({
        ...prev,
        currentTime: mixer.deckA.currentTime,
        duration: mixer.deckA.buffer?.duration || 0,
        playing: mixer.deckA.playing
      }));
      setBDeckState(prev => ({
        ...prev,
        currentTime: mixer.deckB.currentTime,
        duration: mixer.deckB.buffer?.duration || 0,
        playing: mixer.deckB.playing
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [mixer]);

  // Apply EQ changes
  useEffect(() => {
    mixer.deckA.setEQ(aEQ);
  }, [aEQ, mixer]);

  useEffect(() => {
    mixer.deckB.setEQ(bEQ);
  }, [bEQ, mixer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#1a1a24] to-[#0f0f11] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-dark-900/50 backdrop-blur-md">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              RMXR
            </h1>
            <div className="text-sm text-zinc-500">- AI DJ Studio</div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-1 bg-dark-800 p-1 rounded-lg">
              <button className="px-4 py-2 rounded bg-zinc-700 text-white text-sm font-medium">
                Studio
              </button>
              <button className="px-4 py-2 rounded text-zinc-400 hover:text-white text-sm font-medium">
                AI Mix
              </button>
              <button className="px-4 py-2 rounded text-zinc-400 hover:text-white text-sm font-medium">
                Library
              </button>
            </nav>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-900/30 bg-red-900/10 text-red-500 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              REC
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_380px_1fr] gap-6 p-6">
        {/* Deck A */}
        <ProDeck
          id="A"
          trackName={aDeckState.trackName}
          artist={aDeckState.artist}
          bpm={aDeckState.bpm}
          key={aDeckState.key}
          playing={aDeckState.playing}
          currentTime={aDeckState.currentTime}
          duration={aDeckState.duration}
          onPlayPause={() => {
            if (aDeckState.playing) {
              mixer.deckA.pause();
            } else {
              mixer.deckA.play();
            }
          }}
          onCue={() => mixer.deckA.seek(0)}
          onSync={() => {}}
        />

        {/* Mixer */}
        <ProMixer
          deckAEq={aEQ}
          deckBEq={bEQ}
          masterVolume={masterVolume}
          boothVolume={boothVolume}
          crossfader={crossfader}
          onDeckAEqChange={(eq) => setAEQ(prev => ({ ...prev, ...eq }))}
          onDeckBEqChange={(eq) => setBEQ(prev => ({ ...prev, ...eq }))}
          onMasterVolumeChange={setMasterVolume}
          onBoothVolumeChange={setBoothVolume}
          onCrossfaderChange={setCrossfader}
        />

        {/* Deck B */}
        <ProDeck
          id="B"
          trackName={bDeckState.trackName}
          artist={bDeckState.artist}
          bpm={bDeckState.bpm}
          key={bDeckState.key}
          playing={bDeckState.playing}
          currentTime={bDeckState.currentTime}
          duration={bDeckState.duration}
          onPlayPause={() => {
            if (bDeckState.playing) {
              mixer.deckB.pause();
            } else {
              mixer.deckB.play();
            }
          }}
          onCue={() => mixer.deckB.seek(0)}
          onSync={() => {}}
        />
      </div>
    </div>
  );
}
