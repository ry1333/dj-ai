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
    <div className="pointer-events-auto fixed right-5 bottom-28 md:bottom-12 flex flex-col gap-5 z-20">
      {/* Remix Button - Primary CTA */}
      <button
        onClick={onRemix}
        className="group relative flex flex-col items-center gap-1.5 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-purple-700 p-3.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
        title="Remix this track"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
        <Sparkles className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
        <span className="text-[10px] font-bold text-white uppercase tracking-wide relative z-10">Remix</span>
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        className={`group relative flex flex-col items-center gap-1 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          hasLoved
            ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-500/40'
            : 'bg-white/90 backdrop-blur-md hover:bg-white shadow-black/20'
        }`}
        title={hasLoved ? 'Unlike' : 'Like'}
      >
        {hasLoved && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-pink-500 opacity-50 blur-lg animate-pulse" />
        )}
        <Heart
          className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
            hasLoved ? 'text-white scale-110' : 'text-neutral-800 group-hover:text-red-500'
          }`}
          fill={hasLoved ? 'currentColor' : 'none'}
          strokeWidth={2.5}
        />
        <span className={`text-[9px] font-semibold relative z-10 ${hasLoved ? 'text-white' : 'text-neutral-800'}`}>
          {loves > 0 ? formatCount(loves) : 'Like'}
        </span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="group relative flex flex-col items-center gap-1 rounded-full bg-white/90 backdrop-blur-md p-3 shadow-lg shadow-black/20 hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95"
        title="View comments"
      >
        <MessageCircle
          className="w-5 h-5 text-neutral-800 group-hover:text-blue-500 transition-colors relative z-10"
          strokeWidth={2.5}
        />
        <span className="text-[9px] font-semibold text-neutral-800 relative z-10">
          {comments > 0 ? formatCount(comments) : 'Comment'}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="group relative flex flex-col items-center gap-1 rounded-full bg-white/90 backdrop-blur-md p-3 shadow-lg shadow-black/20 hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95"
        title="Share this track"
      >
        <Share2
          className="w-5 h-5 text-neutral-800 group-hover:text-green-500 transition-colors relative z-10"
          strokeWidth={2.5}
        />
        <span className="text-[9px] font-semibold text-neutral-800 relative z-10">Share</span>
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
