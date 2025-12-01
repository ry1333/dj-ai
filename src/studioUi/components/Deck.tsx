import React from 'react';
import { DeckId, DeckState, Track } from '../types';
import JogWheel from './JogWheel';
import TrackList from './TrackList';
import { Play, Pause, Disc, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DeckProps {
  id: DeckId;
  state: DeckState;
  onPlayToggle: () => void;
  onLoadTrack: (track: Track, deckId: DeckId) => void;
  availableTracks: Track[];
}

const Deck: React.FC<DeckProps> = ({ id, state, onPlayToggle, onLoadTrack, availableTracks }) => {
  const accentColor = id === DeckId.A ? 'text-pink-500' : 'text-cyan-400';
  const accentBg = id === DeckId.A ? 'bg-pink-500' : 'bg-cyan-400';
  const accentBorder = id === DeckId.A ? 'border-pink-500' : 'border-cyan-400';
  const glowClass = id === DeckId.A
    ? 'shadow-[0_0_15px_-3px_rgba(236,72,153,0.4)]'
    : 'shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)]';

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 h-full">
        {/* Top Deck Panel */}
        <Card className="bg-zinc-900/80 border-zinc-800 relative overflow-hidden">
          {/* Glow effect background */}
          <div className={`absolute -top-20 -left-20 w-64 h-64 ${accentBg} blur-[100px] opacity-10 pointer-events-none`}></div>

          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-2xl font-bold ${accentColor}`}>{id}</span>
              <Badge
                variant={state.playing ? 'default' : 'secondary'}
                className={state.playing ? `${accentBg} text-black` : ''}
              >
                {state.playing ? 'PLAYING' : state.track ? 'LOADED' : 'EMPTY'}
              </Badge>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-8">
              {/* Jog Wheel Section */}
              <div className="flex flex-col gap-4 items-center">
                <JogWheel id={id} playing={state.playing} />

                <div className="flex gap-2 w-full mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onPlayToggle}
                        variant={state.playing ? 'default' : 'outline'}
                        className={`flex-1 ${state.playing ? `${accentBg} text-black hover:opacity-90 ${glowClass}` : 'border-zinc-700 hover:bg-zinc-800'}`}
                      >
                        {state.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{state.playing ? 'Pause playback' : 'Start playback'}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="outline" className="flex-1 border-zinc-700 hover:bg-zinc-800">
                    Load Track
                  </Button>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col gap-4">
                {/* Fake Waveform */}
                <div className="h-24 bg-zinc-950 rounded-lg border border-zinc-800 relative overflow-hidden flex items-center justify-center">
                  {state.track ? (
                    <div className="flex items-center gap-0.5 h-full w-full px-2 opacity-80">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${accentBg}`}
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
                  <Badge
                    variant={state.loopActive ? 'default' : 'outline'}
                    className={`text-center justify-center ${state.loopActive ? `${accentBg} text-black` : 'border-zinc-700'}`}
                  >
                    Loop Section
                  </Badge>
                  <ToggleGroup type="single" defaultValue="4" className="justify-center">
                    <ToggleGroupItem value="prev" className="bg-zinc-950 border border-zinc-700 data-[state=on]:bg-zinc-800">&lt;</ToggleGroupItem>
                    <ToggleGroupItem value="2" className="bg-zinc-950 border border-zinc-700 data-[state=on]:bg-zinc-800 font-bold">2</ToggleGroupItem>
                    <ToggleGroupItem value="4" className={`bg-zinc-950 border border-zinc-700 data-[state=on]:${accentBg} data-[state=on]:text-black font-bold`}>4</ToggleGroupItem>
                    <ToggleGroupItem value="8" className="bg-zinc-950 border border-zinc-700 data-[state=on]:bg-zinc-800 font-bold">8</ToggleGroupItem>
                    <ToggleGroupItem value="next" className="bg-zinc-950 border border-zinc-700 data-[state=on]:bg-zinc-800">&gt;</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 ${accentBorder} ${accentColor} hover:${accentBg} hover:text-black ${glowClass}`}
                      >
                        Cue
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set/return to cue point</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 ${accentBorder} ${accentColor} hover:${accentBg} hover:text-black ${glowClass}`}
                      >
                        Sync
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sync tempo to other deck</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track Info & List Panel */}
        <Card className="bg-zinc-900/80 border-zinc-800 flex-1 flex flex-col min-h-0">
          <CardContent className="p-4 flex flex-col gap-4 h-full">
            {/* Currently Loaded Track Display */}
            <Card className="bg-zinc-950 border-zinc-700/50">
              <CardContent className="p-3 flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                  {state.track?.cover ? <img src={state.track.cover} alt="Cover" className="w-full h-full object-cover" /> : <Disc className="text-zinc-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{state.track?.title || 'No Track Loaded'}</div>
                  <div className="text-xs text-zinc-500 truncate">{state.track?.artist || 'Select a track below'}</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">BPM</div>
                    <Badge variant="outline" className="font-mono text-xs">{state.track?.bpm.toFixed(1) || '---'}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Key</div>
                    <Badge variant="secondary" className={`font-mono text-xs ${accentColor}`}>{state.track?.key || '-'}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Time</div>
                    <Badge variant="outline" className="font-mono text-xs">{state.track?.length || '00:00'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Track List Component */}
            <TrackList tracks={availableTracks} onLoadTrack={onLoadTrack} deckId={id} />
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Deck;
