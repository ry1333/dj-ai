import React, { useRef, useState } from 'react';
import { DeckId } from '../types';

interface FaderProps {
  value: number; // 0 to 100
  onChange: (val: number) => void;
  deckId?: DeckId;
  label?: string;
  height?: string;
}

const Fader: React.FC<FaderProps> = ({ value, onChange, deckId, label, height = "h-40" }) => {
  const faderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (clientY: number) => {
    if (!faderRef.current) return;
    const rect = faderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = 100 - Math.max(0, Math.min(100, (y / rect.height) * 100));
    onChange(Math.round(percentage));
  };

  React.useEffect(() => {
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
    <div className="flex flex-col items-center w-full gap-2">
      <div
        ref={faderRef}
        className={`relative w-8 ${height} bg-dark-900 rounded-full border border-dark-700 shadow-inner flex justify-center py-2 cursor-pointer`}
        onMouseDown={handleMouseDown}
      >
        {/* Track Line */}
        <div className="absolute top-2 bottom-2 w-0.5 bg-dark-600"></div>

        {/* Visual Thumb */}
        <div
          className="absolute w-12 h-6 bg-dark-600 rounded-sm border-t border-white/20 shadow-lg flex items-center justify-center pointer-events-none transition-all duration-75"
          style={{ bottom: `${value}%`, transform: 'translateY(50%)' }}
        >
            <div className={`w-full h-0.5 ${deckId === DeckId.A ? 'bg-deckA' : deckId === DeckId.B ? 'bg-deckB' : 'bg-white'}`}></div>
        </div>
      </div>
      {label && <span className="text-xs font-mono text-zinc-500">{label}</span>}
    </div>
  );
};

export default Fader;
