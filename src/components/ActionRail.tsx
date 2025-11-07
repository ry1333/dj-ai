import { Heart, Share2, Wand2 } from 'lucide-react'

type ActionRailProps = {
  onRemix: () => void;
  onLike?: () => void;
  loves?: number;
  hasLoved?: boolean;
}

export default function ActionRail({ onRemix, onLike, loves = 0, hasLoved = false }: ActionRailProps) {
  const Btn = ({ icon: Icon, label, count }: { icon: any; label: string; count?: number }) => (
    <button className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 hover:bg-white p-2">
      <Icon size={22} />
      <span className="text-[11px] leading-none">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-semibold">{count}</span>
      )}
    </button>
  )

  return (
    <div className="pointer-events-auto fixed right-3 bottom-28 md:bottom-6 flex flex-col gap-3">
      <button
        onClick={onLike}
        className={`flex flex-col items-center gap-1 rounded-2xl p-2 ${
          hasLoved
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white/70 hover:bg-white'
        }`}
      >
        <Heart size={22} fill={hasLoved ? 'currentColor' : 'none'} />
        <span className="text-[11px] leading-none">Like</span>
        {loves > 0 && (
          <span className="text-[10px] font-semibold">{loves}</span>
        )}
      </button>
      <Btn icon={Share2} label="Share" />
      <button onClick={onRemix} className="flex flex-col items-center gap-1 rounded-2xl bg-black text-white p-2 hover:bg-gray-800">
        <Wand2 size={22} /><span className="text-[11px] leading-none">Remix</span>
      </button>
    </div>
  )
}
