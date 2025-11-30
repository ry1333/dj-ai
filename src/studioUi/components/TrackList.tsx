import React from 'react';
import { Track, DeckId } from '../types';
import { GENRES } from '../constants';
import { Play, Music2 } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  onLoadTrack: (track: Track, deck: DeckId) => void;
  deckId: DeckId;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onLoadTrack, deckId }) => {
  const accentText = deckId === DeckId.A ? 'text-deckA' : 'text-deckB';
  const accentBorder = deckId === DeckId.A ? 'border-deckA' : 'border-deckB';
  const accentHover = deckId === DeckId.A ? 'hover:bg-deckA/20' : 'hover:bg-deckB/20';

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Search / Filter Header */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {GENRES.map(g => (
          <button 
            key={g} 
            className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/50 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 whitespace-nowrap transition-colors"
          >
            {g}
          </button>
        ))}
      </div>

      {/* List Header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-2 text-xs font-mono text-zinc-500 uppercase">
         <div className="w-4"></div>
         <div>Title</div>
         <div>BPM</div>
         <div>Key</div>
         <div>Length</div>
         <div>Action</div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {tracks.map((track) => (
          <div key={track.id} className={`group grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-2 py-3 rounded-lg hover:bg-zinc-800/50 transition-colors border-l-2 border-transparent ${deckId === DeckId.A ? 'hover:border-deckA' : 'hover:border-deckB'}`}>
            <div className="w-4 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${accentText} opacity-0 group-hover:opacity-100`}>•</div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">{track.title}</span>
              <span className="text-xs text-zinc-500">{track.artist}</span>
            </div>

            <div className="text-xs font-mono text-zinc-400">{track.bpm.toFixed(1)}</div>
            <div className="text-xs font-mono text-zinc-400 w-8">{track.key}</div>
            <div className="text-xs font-mono text-zinc-400">{track.length}</div>

            <button 
              onClick={() => onLoadTrack(track, deckId)}
              className={`px-3 py-1 rounded text-xs font-bold border border-zinc-700 text-zinc-300 ${accentHover} hover:border-transparent hover:text-white transition-all`}
            >
              Load Deck {deckId}
            </button>
          </div>
        ))}
        {tracks.length === 0 && (
           <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
              <Music2 className="w-8 h-8 opacity-20" />
              <span className="text-sm">No tracks found</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default TrackList;
