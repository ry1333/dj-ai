import React from 'react';
import { DeckId, DeckState, Track } from '../types';
import JogWheel from './JogWheel';
import TrackList from './TrackList';
import { Play, Pause, Disc, RotateCw, Music } from 'lucide-react';

interface DeckProps {
  id: DeckId;
  state: DeckState;
  onPlayToggle: () => void;
  onLoadTrack: (track: Track, deckId: DeckId) => void;
  availableTracks: Track[];
}

const Deck: React.FC<DeckProps> = ({ id, state, onPlayToggle, onLoadTrack, availableTracks }) => {
  const accentColor = id === DeckId.A ? 'text-deckA' : 'text-deckB';
  const accentBorder = id === DeckId.A ? 'border-deckA' : 'border-deckB';
  const buttonClass = `flex-1 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide`;
  const activeBtnClass = id === DeckId.A 
    ? 'border-deckA shadow-[0_0_10px_-2px_rgba(217,70,239,0.5)] text-white' 
    : 'border-deckB shadow-[0_0_10px_-2px_rgba(6,182,212,0.5)] text-white';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Deck Panel */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Glow effect background */}
        <div className={`absolute -top-20 -left-20 w-64 h-64 ${id === DeckId.A ? 'bg-deckA' : 'bg-deckB'} blur-[100px] opacity-10 pointer-events-none`}></div>

        <div className="flex justify-between mb-2">
            <span className={`text-2xl font-bold ${accentColor}`}>{id}</span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-8">
           {/* Jog Wheel Section */}
           <div className="flex flex-col gap-4 items-center">
              <JogWheel id={id} playing={state.playing} />
              
              <div className="flex gap-2 w-full mt-2">
                <button 
                  onClick={onPlayToggle}
                  className={`${buttonClass} ${state.playing ? activeBtnClass : 'text-zinc-400'}`}
                >
                  {state.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button className={`${buttonClass} text-zinc-400`}>
                    Load Track
                </button>
              </div>
           </div>

           {/* Controls Section */}
           <div className="flex flex-col gap-4">
              {/* Fake Waveform */}
              <div className="h-24 bg-dark-900 rounded-lg border border-zinc-800 relative overflow-hidden flex items-center justify-center">
                 {state.track ? (
                    <div className="flex items-center gap-0.5 h-full w-full px-2 opacity-80">
                        {Array.from({ length: 40 }).map((_, i) => (
                           <div 
                            key={i} 
                            className={`flex-1 rounded-full ${id === DeckId.A ? 'bg-deckA' : 'bg-deckB'}`} 
                            style={{ height: `${Math.random() * 80 + 20}%`, opacity: Math.random() * 0.5 + 0.5 }}
                           ></div>
                        ))}
                    </div>
                 ) : (
                    <div className="animate-pulse text-zinc-700"><Music size={24} /></div>
                 )}
              </div>

              {/* Loop Controls */}
              <div className="flex flex-col gap-2">
                  <div className={`text-xs uppercase tracking-wider text-center border border-zinc-700 rounded py-1 ${state.loopActive ? accentColor + ' border-current' : 'text-zinc-500'}`}>Loop Section</div>
                  <div className="flex gap-1">
                      <button className="flex-1 bg-dark-900 border border-zinc-700 rounded py-2 text-zinc-400 hover:text-white text-xs">&lt;</button>
                      <button className="flex-1 bg-dark-900 border border-zinc-700 rounded py-2 text-white font-bold text-sm">2</button>
                      <button className="flex-1 bg-dark-900 border border-zinc-700 rounded py-2 text-white font-bold text-sm text-deckA">4</button>
                      <button className="flex-1 bg-dark-900 border border-zinc-700 rounded py-2 text-white font-bold text-sm">8</button>
                      <button className="flex-1 bg-dark-900 border border-zinc-700 rounded py-2 text-zinc-400 hover:text-white text-xs">&gt;</button>
                  </div>
              </div>

              <div className="flex gap-2 mt-auto">
                 <button className={`${buttonClass} ${activeBtnClass}`}>Cue</button>
                 <button className={`${buttonClass} ${activeBtnClass}`}>Sync</button>
              </div>
           </div>
        </div>
      </div>

      {/* Track Info & List Panel */}
      <div className="bg-dark-800 rounded-2xl p-4 border border-zinc-800 flex-1 flex flex-col gap-4 min-h-0">
         {/* Currently Loaded Track Display */}
         <div className="bg-dark-900 rounded-xl p-3 flex items-center gap-4 border border-zinc-700/50">
            <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                {state.track?.cover ? <img src={state.track.cover} alt="Cover" className="w-full h-full object-cover" /> : <Disc className="text-zinc-600" />}
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-sm font-bold text-white truncate">{state.track?.title || 'No Track Loaded'}</div>
               <div className="text-xs text-zinc-500 truncate">{state.track?.artist || 'Select a track below'}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-right">
                <div>
                   <div className="text-[10px] text-zinc-500 uppercase">BPM</div>
                   <div className="text-sm font-mono text-zinc-300">{state.track?.bpm.toFixed(1) || '---'}</div>
                </div>
                <div>
                   <div className="text-[10px] text-zinc-500 uppercase">Key</div>
                   <div className={`text-sm font-mono ${accentColor}`}>{state.track?.key || '-'}</div>
                </div>
                <div>
                   <div className="text-[10px] text-zinc-500 uppercase">Time</div>
                   <div className="text-sm font-mono text-zinc-300">{state.track?.length || '00:00'}</div>
                </div>
            </div>
         </div>

         {/* Track List Component */}
         <TrackList tracks={availableTracks} onLoadTrack={onLoadTrack} deckId={id} />
      </div>
    </div>
  );
};

export default Deck;
