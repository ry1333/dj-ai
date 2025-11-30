import React from 'react';

interface FaderProps {
  value: number; // 0 to 100
  onChange: (val: number) => void;
  deckId?: 'A' | 'B';
  label?: string;
  height?: string;
}

const StudioFader: React.FC<FaderProps> = ({ value, onChange, deckId, label, height = "h-40" }) => {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className={`relative w-8 ${height} bg-dark-900 rounded-full border border-dark-700 shadow-inner flex justify-center py-2`}>
        {/* Track Line */}
        <div className="absolute top-2 bottom-2 w-0.5 bg-dark-600"></div>

        {/* Input Range (Hidden but functional) */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ writingMode: 'vertical-lr', direction: 'rtl' } as any} // vertical range hack
        />

        {/* Visual Thumb */}
        <div
          className="absolute w-12 h-6 bg-dark-600 rounded-sm border-t border-white/20 shadow-lg flex items-center justify-center pointer-events-none transition-all duration-75"
          style={{ bottom: `${value}%`, transform: 'translateY(50%)' }}
        >
            <div className={`w-full h-0.5 ${deckId === 'A' ? 'bg-deckA' : deckId === 'B' ? 'bg-deckB' : 'bg-white'}`}></div>
        </div>
      </div>
      {label && <span className="text-xs font-mono text-zinc-500">{label}</span>}
    </div>
  );
};

export default StudioFader;
