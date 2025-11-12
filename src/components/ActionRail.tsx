import { Heart, MessageCircle, Share2, Wand2 } from 'lucide-react'

type ActionRailProps = {
  onRemix: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  loves?: number;
  hasLoved?: boolean;
  comments?: number;
}

export default function ActionRail({ onRemix, onLike, onShare, onComment, loves = 0, hasLoved = false, comments = 0 }: ActionRailProps) {
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

      <button
        onClick={onComment}
        className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 hover:bg-white p-2"
      >
        <MessageCircle size={22} />
        <span className="text-[11px] leading-none">Comment</span>
        {comments > 0 && (
          <span className="text-[10px] font-semibold">{comments}</span>
        )}
      </button>

      <button
        onClick={onShare}
        className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 hover:bg-white p-2"
      >
        <Share2 size={22} />
        <span className="text-[11px] leading-none">Share</span>
      </button>

      <button onClick={onRemix} className="flex flex-col items-center gap-1 rounded-2xl bg-black text-white p-2 hover:bg-gray-800">
        <Wand2 size={22} /><span className="text-[11px] leading-none">Remix</span>
      </button>
    </div>
  )
}
