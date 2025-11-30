import { useEffect, useState } from 'react';

interface JogWheelProps {
  id: 'A' | 'B';
  playing: boolean;
}

const StudioJogWheel: React.FC<JogWheelProps> = ({ id, playing }) => {
  const [rotation, setRotation] = useState(0);
  const accentColor = id === 'A' ? 'border-deckA shadow-glow-A' : 'border-deckB shadow-glow-B';
  const indicatorColor = id === 'A' ? 'bg-deckA' : 'bg-deckB';

  useEffect(() => {
    let animationFrame: number;
    if (playing) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [playing]);

  return (
    <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 ${accentColor} border-opacity-30 relative flex items-center justify-center bg-dark-800 shadow-2xl`}>
       {/* Outer Ring Texture */}
       <div className="absolute inset-2 rounded-full border border-white/5 opacity-50"></div>

       {/* Rotating Platter */}
       <div
        className="w-full h-full rounded-full transition-transform duration-75 ease-linear"
        style={{ transform: `rotate(${rotation}deg)` }}
       >
          {/* Inner Groove Texture */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-dark-700 to-dark-900 border border-dark-900 shadow-inner">
             {/* Center Cap */}
             <div className="absolute inset-[30%] bg-dark-800 rounded-full flex items-center justify-center shadow-knob">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
             </div>
             {/* Position Marker */}
             <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-8 rounded-full ${indicatorColor} shadow-[0_0_10px_currentColor]`}></div>
          </div>
       </div>
    </div>
  );
};

export default StudioJogWheel;
