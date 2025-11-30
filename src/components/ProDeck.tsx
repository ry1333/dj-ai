import { Play, Pause } from 'lucide-react';
import StudioJogWheel from './ui/StudioJogWheel';
import Waveform from './ui/Waveform';

interface ProDeckProps {
  id: 'A' | 'B';
  trackName: string;
  artist: string;
  bpm: number;
  key: string;
  playing: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onCue: () => void;
  onSync: () => void;
}

const ProDeck: React.FC<ProDeckProps> = ({
  id,
  trackName,
  artist,
  bpm,
  key: trackKey,
  playing,
  currentTime,
  duration,
  onPlayPause,
  onCue,
  onSync
}) => {
  const accentColor = id === 'A' ? 'deckA' : 'deckB';
  const borderColor = id === 'A' ? 'border-deckA' : 'border-deckB';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Track Info Header */}
      <div className="bg-dark-900/50 rounded-lg p-4 border border-zinc-800">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">
              {trackName || 'No Track Loaded'}
            </h3>
            <p className="text-sm text-zinc-400">
              {artist || 'Select a track from library'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-white">{bpm.toFixed(1)}</div>
            <div className="text-xs text-zinc-500 uppercase">BPM</div>
          </div>
          <div className="text-right ml-4">
            <div className={`text-lg font-bold text-${accentColor}`}>{trackKey}</div>
            <div className="text-xs text-zinc-500 uppercase">KEY</div>
          </div>
        </div>

        {/* Waveform */}
        <div className="bg-dark-800 rounded">
          <Waveform deckId={id} progress={duration > 0 ? currentTime / duration : 0} />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-xs font-mono text-zinc-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(-(duration - currentTime))}</span>
        </div>
      </div>

      {/* Jog Wheel & Controls */}
      <div className="bg-dark-900/50 rounded-lg p-6 border border-zinc-800 flex flex-col items-center gap-4">
        {/* Jog Wheel */}
        <StudioJogWheel id={id} playing={playing} />

        {/* Transport Controls */}
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={onCue}
            className="flex-none px-6 py-3 rounded-lg border border-zinc-700 bg-dark-800 hover:bg-dark-700 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            CUE
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mx-auto mt-1"></div>
          </button>

          <button
            onClick={onPlayPause}
            className={`flex-1 py-4 rounded-lg font-bold text-white transition-all ${
              playing
                ? `bg-${accentColor} border-2 ${borderColor}`
                : `border-2 ${borderColor} bg-dark-800 hover:bg-${accentColor}/20`
            }`}
          >
            {playing ? <Pause className="w-6 h-6 mx-auto" /> : <Play className="w-6 h-6 mx-auto" />}
          </button>

          <button
            onClick={onSync}
            className="flex-none px-6 py-3 rounded-lg border border-zinc-700 bg-dark-800 hover:bg-dark-700 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            SYNC
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mx-auto mt-1"></div>
          </button>
        </div>

        {/* Loop Controls */}
        <div className="w-full">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 mb-2">
            <span>LOOP 4</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-dark-800 border border-zinc-700 hover:bg-dark-700 text-white">IN</button>
              <button className="px-3 py-1 rounded bg-dark-800 border border-zinc-700 hover:bg-dark-700 text-white">OUT</button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded bg-dark-800 border border-zinc-700 hover:bg-dark-700 text-zinc-400">
              &lt;
            </button>
            <div className="flex-1 h-1 bg-dark-800 rounded"></div>
            <button className="p-2 rounded bg-dark-800 border border-zinc-700 hover:bg-dark-700 text-zinc-400">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-dark-900/50 rounded-lg p-4 border border-zinc-800">
        <div className="flex gap-2 mb-3">
          {['ALL', 'DEEP HOUSE', 'TECHNO', 'LO-FI', 'HIP-HOP', 'EDM', 'JAZZ'].map((genre) => (
            <button
              key={genre}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                genre === 'ALL'
                  ? 'bg-white text-black'
                  : 'border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 text-xs text-zinc-500 uppercase pb-2">
            <div></div>
            <div>Track</div>
            <div>BPM</div>
            <div>Key</div>
            <div>Load</div>
          </div>

          {[
            { name: 'Deep Ocean', artist: 'Aqua Flow', bpm: 124, key: 'Am' },
            { name: 'Midnight City', artist: 'Neon Driver', bpm: 128, key: 'Cm' }
          ].map((track, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center py-2 px-2 rounded hover:bg-dark-800 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded bg-dark-800 flex items-center justify-center text-zinc-600">
                ♪
              </div>
              <div>
                <div className="text-sm font-medium text-white">{track.name}</div>
                <div className="text-xs text-zinc-500">{track.artist}</div>
              </div>
              <div className="text-sm font-mono text-zinc-400">{track.bpm}</div>
              <div className="text-sm font-mono text-zinc-400">{track.key}</div>
              <button className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded bg-dark-700 border border-zinc-600 text-xs text-white hover:bg-dark-600">
                Load
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProDeck;
