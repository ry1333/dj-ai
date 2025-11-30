import React, { useState } from 'react';
import { generatePlaylist } from '../services/geminiService';
import { Track } from '../types';
import { Sparkles, Loader2, Music2, Plus } from 'lucide-react';

interface AIMixProps {
  onAddTrack: (track: Track) => void;
}

const AIMix: React.FC<AIMixProps> = ({ onAddTrack }) => {
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    setLoading(true);
    const tracks = await generatePlaylist(vibe);
    setGeneratedTracks(tracks);
    setLoading(false);
  };

  return (
    <div className="h-full w-full max-w-4xl mx-auto flex flex-col gap-8 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-deckA to-deckB bg-clip-text text-transparent">AI Mix Curator</h2>
        <p className="text-zinc-400">Describe your vibe, and let Gemini build your setlist.</p>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-4 max-w-2xl mx-auto w-full">
        <input 
          type="text" 
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="e.g., 'Late night drive in Tokyo', '90s warehouse rave', 'Chill sunset'"
          className="flex-1 bg-dark-800 border border-zinc-700 rounded-full px-6 py-4 text-white focus:outline-none focus:border-deckB transition-colors placeholder:text-zinc-600"
        />
        <button 
          type="submit" 
          disabled={loading || !vibe}
          className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          <span>Generate</span>
        </button>
      </form>

      <div className="flex-1 bg-dark-800/50 rounded-2xl border border-zinc-800 p-6 overflow-hidden flex flex-col">
        <h3 className="text-sm font-mono uppercase text-zinc-500 mb-4 flex items-center gap-2">
            <Music2 size={16} /> Generated Tracks
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2">
            {generatedTracks.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p>Enter a vibe above to get started.</p>
                </div>
            )}
            
            {loading && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-deckA" />
                    <p className="animate-pulse">Consulting the algorithm...</p>
                </div>
            )}

            {generatedTracks.map((track) => (
                <div key={track.id} className="bg-dark-900 border border-zinc-700/50 p-4 rounded-xl flex items-center gap-4 hover:border-deckB/50 transition-colors group">
                    <img src={track.cover} alt="" className="w-12 h-12 rounded bg-zinc-800 object-cover" />
                    <div className="flex-1">
                        <div className="font-bold text-white">{track.title}</div>
                        <div className="text-xs text-zinc-400">{track.artist}</div>
                    </div>
                    <div className="text-right mr-4">
                        <div className="text-xs font-mono text-zinc-500">BPM</div>
                        <div className="text-sm font-mono">{track.bpm}</div>
                    </div>
                    <div className="text-right mr-4">
                        <div className="text-xs font-mono text-zinc-500">Key</div>
                        <div className="text-sm font-mono text-deckA">{track.key}</div>
                    </div>
                    <button 
                        onClick={() => onAddTrack(track)}
                        className="p-2 rounded-full bg-zinc-800 hover:bg-white hover:text-black transition-colors"
                        title="Add to Library"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AIMix;
