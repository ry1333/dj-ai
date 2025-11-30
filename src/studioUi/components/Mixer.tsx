import React, { useRef, useState, useEffect } from 'react';
import { MixerState, DeckState, DeckId } from '../types';
import Knob from './Knob';
import Fader from './Fader';

interface MixerProps {
  state: MixerState;
  deckAState: DeckState;
  deckBState: DeckState;
  onMixerChange: (newState: Partial<MixerState>) => void;
  onDeckEqChange: (deckId: DeckId, eq: Partial<DeckState['eq']>) => void;
  onDeckVolumeChange: (deckId: DeckId, vol: number) => void;
}

// Crossfader component with drag support
const CrossfaderComponent: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    // Map 0-100% to -1 to 1
    const newValue = (percentage / 50) - 1;
    onChange(Math.max(-1, Math.min(1, newValue)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="w-full px-4 pt-2 pb-4">
      <div
        ref={trackRef}
        className="relative h-12 bg-dark-900 rounded border border-zinc-700 flex items-center px-4 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-800 -translate-y-1/2 rounded-full"></div>
        {/* Crossfader Handle */}
        <div
          className="absolute w-8 h-10 bg-gradient-to-b from-zinc-600 to-zinc-800 border border-zinc-500 rounded shadow-lg top-1 cursor-grab active:cursor-grabbing hover:bg-zinc-600 transition-colors pointer-events-none"
          style={{
            left: `${((value + 1) / 2) * 100}%`, // Map -1..1 to 0..100
            transform: 'translateX(-50%)'
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-deckA shadow-[0_0_5px_currentColor] opacity-50"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-zinc-500 mt-1 font-mono">
        <span>&lt; A</span>
        <span>B &gt;</span>
      </div>
    </div>
  );
};

const Mixer: React.FC<MixerProps> = ({ 
  state, deckAState, deckBState, onMixerChange, onDeckEqChange, onDeckVolumeChange 
}) => {
  return (
    <div className="bg-dark-800 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-6 items-center shadow-2xl h-full">
       
       {/* Top Master Controls */}
       <div className="w-full bg-dark-900 rounded-xl p-3 border border-zinc-700/50 flex gap-4">
          <div className="flex-1">
             <div className="text-[10px] text-zinc-500 uppercase text-center mb-2">Master Volume</div>
             <input 
              type="range" 
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white" 
              value={state.masterVolume}
              onChange={(e) => onMixerChange({ masterVolume: Number(e.target.value) })}
            />
          </div>
          <div className="flex-1">
             <div className="text-[10px] text-zinc-500 uppercase text-center mb-2">Booth Monitor</div>
             <input 
              type="range" 
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white" 
              value={state.boothMonitor}
              onChange={(e) => onMixerChange({ boothMonitor: Number(e.target.value) })}
             />
          </div>
       </div>

       {/* EQ Section */}
       <div className="flex-1 grid grid-cols-2 gap-8 w-full px-2">
          {/* Deck A EQs */}
          <div className="flex flex-col items-center justify-between gap-2">
             <div className="text-xl font-bold text-deckA mb-2">A</div>
             <Knob 
                label="High" 
                value={deckAState.eq.high} 
                onChange={(val) => onDeckEqChange(DeckId.A, { high: val })}
                deckId={DeckId.A}
             />
             <Knob 
                label="Mid" 
                value={deckAState.eq.mid} 
                onChange={(val) => onDeckEqChange(DeckId.A, { mid: val })}
                deckId={DeckId.A}
             />
             <Knob 
                label="Low" 
                value={deckAState.eq.low} 
                onChange={(val) => onDeckEqChange(DeckId.A, { low: val })}
                deckId={DeckId.A}
             />
             <div className="mt-4 w-full flex justify-center h-48">
                 <Fader 
                    value={deckAState.volume} 
                    onChange={(val) => onDeckVolumeChange(DeckId.A, val)} 
                    deckId={DeckId.A}
                    height="h-full"
                 />
             </div>
          </div>

          {/* Deck B EQs */}
          <div className="flex flex-col items-center justify-between gap-2">
             <div className="text-xl font-bold text-deckB mb-2">B</div>
             <Knob 
                label="High" 
                value={deckBState.eq.high} 
                onChange={(val) => onDeckEqChange(DeckId.B, { high: val })}
                deckId={DeckId.B}
             />
             <Knob 
                label="Mid" 
                value={deckBState.eq.mid} 
                onChange={(val) => onDeckEqChange(DeckId.B, { mid: val })}
                deckId={DeckId.B}
             />
             <Knob 
                label="Low" 
                value={deckBState.eq.low} 
                onChange={(val) => onDeckEqChange(DeckId.B, { low: val })}
                deckId={DeckId.B}
             />
             <div className="mt-4 w-full flex justify-center h-48">
                 <Fader 
                    value={deckBState.volume} 
                    onChange={(val) => onDeckVolumeChange(DeckId.B, val)} 
                    deckId={DeckId.B}
                    height="h-full"
                 />
             </div>
          </div>
       </div>

       {/* Crossfader */}
       <CrossfaderComponent value={state.crossfader} onChange={(val) => onMixerChange({ crossfader: val })} />
    </div>
  );
};

export default Mixer;
