import React from 'react';

interface WaveformProps {
  deckId: 'A' | 'B';
  progress?: number; // 0 to 1
}

const Waveform: React.FC<WaveformProps> = ({ deckId, progress = 0 }) => {
  const color = deckId === 'A' ? 'bg-deckA' : 'bg-deckB';

  // Generate random waveform bars
  const bars = Array.from({ length: 50 }, () => Math.random() * 80 + 20);

  return (
    <div className="flex items-center gap-0.5 h-16 w-full px-2">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color}`}
          style={{
            height: `${height}%`,
            opacity: i / bars.length < progress ? 1 : 0.6
          }}
        ></div>
      ))}
    </div>
  );
};

export default Waveform;
