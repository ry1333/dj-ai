import React, { useState } from 'react';
import { Track, DeckId } from '../types';
import { GENRES } from '../constants';
import { Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TrackListProps {
  tracks: Track[];
  onLoadTrack: (track: Track, deck: DeckId) => void;
  deckId: DeckId;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onLoadTrack, deckId }) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const accentColor = deckId === DeckId.A ? 'text-pink-500' : 'text-cyan-400';
  const accentBg = deckId === DeckId.A ? 'bg-pink-500' : 'bg-cyan-400';
  const accentBorder = deckId === DeckId.A ? 'border-pink-500' : 'border-cyan-400';
  const hoverBorder = deckId === DeckId.A ? 'hover:border-l-pink-500' : 'hover:border-l-cyan-400';

  const filteredTracks = selectedGenre
    ? tracks.filter(t => t.genre === selectedGenre)
    : tracks;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Search / Filter Header */}
      <ScrollArea className="w-full whitespace-nowrap">
        <ToggleGroup
          type="single"
          value={selectedGenre || ''}
          onValueChange={(value) => setSelectedGenre(value || null)}
          className="flex gap-2 pb-2"
        >
          {GENRES.map(g => (
            <ToggleGroupItem
              key={g}
              value={g}
              className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/50 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 whitespace-nowrap data-[state=on]:bg-zinc-700 data-[state=on]:text-white data-[state=on]:border-zinc-500"
            >
              {g}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ScrollArea>

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
      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-2">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className={`group grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-2 py-3 rounded-lg hover:bg-zinc-800/50 transition-colors border-l-2 border-transparent ${hoverBorder}`}
            >
              <div className="w-4 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity`}>•</div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-zinc-200 truncate">{track.title}</span>
                <span className="text-xs text-zinc-500 truncate">{track.artist}</span>
              </div>

              <Badge variant="outline" className="font-mono text-xs">{track.bpm.toFixed(1)}</Badge>
              <Badge variant="secondary" className={`font-mono text-xs w-8 justify-center ${accentColor}`}>{track.key}</Badge>
              <span className="text-xs font-mono text-zinc-400">{track.length}</span>

              <Button
                size="sm"
                onClick={() => onLoadTrack(track, deckId)}
                className={`text-xs ${
                  deckId === DeckId.A
                    ? 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500 hover:text-black'
                    : 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400 hover:text-black'
                }`}
                variant="outline"
              >
                Load {deckId}
              </Button>
            </div>
          ))}
          {filteredTracks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
              <Music2 className="w-8 h-8 opacity-20" />
              <span className="text-sm">No tracks found</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrackList;
