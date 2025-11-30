import React, { useState, useRef, useEffect } from 'react';
import { DeckId } from '../types';

interface KnobProps {
  label: string;
  value: number; // 0 to 100
  onChange: (val: number) => void;
  deckId?: DeckId;
}

const Knob: React.FC<KnobProps> = ({ label, value, onChange, deckId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  
  // Calculate rotation: 0 = -135deg, 100 = 135deg
  const rotation = (value / 100) * 270 - 135;
  
  const accent = deckId === DeckId.A ? '#d946ef' : deckId === DeckId.B ? '#06b6d4' : '#71717a';

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = startYRef.current - e.clientY;
      const newValue = Math.min(100, Math.max(0, startValueRef.current + deltaY));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div className="flex flex-col items-center gap-2 select-none group">
      <div 
        className="relative w-14 h-14 rounded-full bg-dark-800 shadow-knob flex items-center justify-center cursor-ns-resize"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        {/* Indicator Ring */}
        <svg className="absolute w-full h-full p-1 rotate-[135deg]" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="6" strokeDasharray="264" strokeDashoffset="66" /> 
           <circle 
              cx="50" cy="50" r="42" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round"
              strokeDasharray="264" 
              strokeDashoffset={264 - (value / 100) * 198} // Only fill about 75% (270deg)
              className="transition-all duration-75"
            />
        </svg>

        {/* The Knob Itself */}
        <div 
          className="w-10 h-10 rounded-full bg-dark-700 shadow-inner-knob flex items-start justify-center pt-1"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-3 rounded-full bg-white"></div>
        </div>
      </div>
      <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
};

export default Knob;
