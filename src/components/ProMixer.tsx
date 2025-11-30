import StudioKnob from './ui/StudioKnob';
import StudioFader from './ui/StudioFader';

interface ProMixerProps {
  deckAEq: { high: number; mid: number; low: number };
  deckBEq: { high: number; mid: number; low: number };
  masterVolume: number;
  boothVolume: number;
  crossfader: number;
  onDeckAEqChange: (eq: { high?: number; mid?: number; low?: number }) => void;
  onDeckBEqChange: (eq: { high?: number; mid?: number; low?: number }) => void;
  onMasterVolumeChange: (val: number) => void;
  onBoothVolumeChange: (val: number) => void;
  onCrossfaderChange: (val: number) => void;
}

const ProMixer: React.FC<ProMixerProps> = ({
  deckAEq,
  deckBEq,
  masterVolume,
  boothVolume,
  crossfader,
  onDeckAEqChange,
  onDeckBEqChange,
  onMasterVolumeChange,
  onBoothVolumeChange,
  onCrossfaderChange
}) => {
  return (
    <div className="bg-dark-900/50 rounded-lg p-6 border border-zinc-800 flex flex-col items-center gap-6 h-full">
      {/* Master & Booth Sliders */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">Master</div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">Booth</div>
          <input
            type="range"
            min="0"
            max="100"
            value={boothVolume}
            onChange={(e) => onBoothVolumeChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* EQ Knobs Section */}
      <div className="flex-1 flex items-center justify-center gap-12">
        {/* Deck A */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-2xl font-bold text-deckA">A</div>
          <StudioKnob
            label="HIGH"
            value={((deckAEq.high + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckAEqChange({ high: dbValue });
            }}
            deckId="A"
          />
          <StudioKnob
            label="MID"
            value={((deckAEq.mid + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckAEqChange({ mid: dbValue });
            }}
            deckId="A"
          />
          <StudioKnob
            label="LOW"
            value={((deckAEq.low + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckAEqChange({ low: dbValue });
            }}
            deckId="A"
          />
        </div>

        {/* Deck B */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-2xl font-bold text-deckB">B</div>
          <StudioKnob
            label="HIGH"
            value={((deckBEq.high + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckBEqChange({ high: dbValue });
            }}
            deckId="B"
          />
          <StudioKnob
            label="MID"
            value={((deckBEq.mid + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckBEqChange({ mid: dbValue });
            }}
            deckId="B"
          />
          <StudioKnob
            label="LOW"
            value={((deckBEq.low + 24) / 48) * 100}
            onChange={(val) => {
              const dbValue = (val / 100) * 48 - 24;
              onDeckBEqChange({ low: dbValue });
            }}
            deckId="B"
          />
        </div>
      </div>

      {/* Deck Faders */}
      <div className="flex items-end justify-center gap-24 h-48">
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-zinc-500 uppercase">Deck A</div>
          <StudioFader value={80} onChange={() => {}} deckId="A" height="h-40" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-zinc-500 uppercase">Deck B</div>
          <StudioFader value={80} onChange={() => {}} deckId="B" height="h-40" />
        </div>
      </div>

      {/* Crossfader */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-zinc-500 uppercase mb-2">
          <span>Deck A</span>
          <span className="text-zinc-400">Crossfader</span>
          <span>Deck B</span>
        </div>
        <div className="relative h-12 bg-dark-800 rounded border border-zinc-700 flex items-center px-4">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-700 -translate-y-1/2 rounded-full"></div>
          <div
            className="absolute w-12 h-10 bg-gradient-to-b from-zinc-500 to-zinc-700 border border-zinc-500 rounded shadow-lg top-1 cursor-grab active:cursor-grabbing hover:bg-zinc-500 transition-colors pointer-events-none"
            style={{
              left: `${crossfader * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-deckA shadow-[0_0_5px_currentColor] opacity-50"></div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crossfader}
            onChange={(e) => onCrossfaderChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ProMixer;
