import { Heart, MessageCircle, Share2, Sparkles, Flag } from 'lucide-react'

type ActionRailProps = {
  onRemix: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  onReport?: () => void;
  loves?: number;
  hasLoved?: boolean;
  comments?: number;
}

export default function ActionRail({ onRemix, onLike, onShare, onComment, onReport, loves = 0, hasLoved = false, comments = 0 }: ActionRailProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div className="pointer-events-auto fixed right-3 bottom-24 md:bottom-8 flex flex-col gap-3 z-20">
      {/* Remix Button - Primary CTA */}
      <button
        onClick={onRemix}
        className="group relative flex flex-col items-center gap-0.5 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-purple-700 p-2.5 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Remix this track"
      >
        <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
        <span className="text-[8px] font-bold text-white uppercase tracking-wide">Remix</span>
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        className={`group relative flex flex-col items-center gap-0.5 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
          hasLoved
            ? 'bg-gradient-to-br from-red-500 to-pink-600'
            : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
        }`}
        title={hasLoved ? 'Unlike' : 'Like'}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            hasLoved ? 'text-white' : 'text-neutral-700 group-hover:text-red-500'
          }`}
          fill={hasLoved ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
        <span className={`text-[7px] font-semibold ${hasLoved ? 'text-white' : 'text-neutral-700'}`}>
          {loves > 0 ? formatCount(loves) : 'Like'}
        </span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="group relative flex flex-col items-center gap-0.5 rounded-full bg-white/80 backdrop-blur-sm p-2 shadow-md hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
        title="View comments"
      >
        <MessageCircle
          className="w-4 h-4 text-neutral-700 group-hover:text-blue-500 transition-colors"
          strokeWidth={2}
        />
        <span className="text-[7px] font-semibold text-neutral-700">
          {comments > 0 ? formatCount(comments) : 'Comment'}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="group relative flex flex-col items-center gap-0.5 rounded-full bg-white/80 backdrop-blur-sm p-2 shadow-md hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Share this track"
      >
        <Share2
          className="w-4 h-4 text-neutral-700 group-hover:text-green-500 transition-colors"
          strokeWidth={2}
        />
        <span className="text-[7px] font-semibold text-neutral-700">Share</span>
      </button>

      {/* Report Button */}
      {onReport && (
        <button
          onClick={onReport}
          className="group relative flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md p-2.5 shadow-md shadow-black/10 hover:bg-red-50 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Report this post"
        >
          <Flag
            className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors"
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  )
}
