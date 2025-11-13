import { Heart, MessageCircle, Share2, Sparkles, Flag } from 'lucide-react'
import { Badge } from './ui/badge'

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
    <div className="pointer-events-auto fixed right-4 bottom-32 md:bottom-24 flex flex-col gap-4 z-20">
      {/* Remix Button - Primary CTA with gradient */}
      <button
        onClick={onRemix}
        className="group relative flex flex-col items-center gap-1 rounded-full bg-gradient-to-r from-accentFrom to-accentTo p-3 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-200 hover:scale-110 active:scale-95"
        title="Remix this track"
      >
        <Sparkles className="w-5 h-5 text-ink" strokeWidth={2.5} />
        <span className="text-[9px] font-bold text-ink uppercase tracking-wider">Remix</span>
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        className={`group relative flex flex-col items-center gap-1 rounded-full p-2.5 backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
          hasLoved
            ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'bg-card/90 border border-line shadow-md hover:bg-card'
        }`}
        title={hasLoved ? 'Unlike' : 'Like'}
      >
        <Heart
          className={`w-5 h-5 transition-transform duration-200 ${
            hasLoved ? 'text-white scale-110' : 'text-text group-hover:text-red-400'
          }`}
          fill={hasLoved ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
        {loves > 0 && (
          <Badge className={`text-[8px] font-bold px-1.5 py-0 h-auto min-h-0 ${
            hasLoved ? 'bg-white/20 text-white border-0' : 'bg-surface border-line text-muted'
          }`}>
            {formatCount(loves)}
          </Badge>
        )}
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="group relative flex flex-col items-center gap-1 rounded-full bg-card/90 border border-line backdrop-blur-xl p-2.5 shadow-md hover:bg-card transition-all duration-200 hover:scale-110 active:scale-95"
        title="View comments"
      >
        <MessageCircle
          className="w-5 h-5 text-text group-hover:text-blue-400 transition-colors"
          strokeWidth={2}
        />
        {comments > 0 && (
          <Badge className="text-[8px] font-bold px-1.5 py-0 h-auto min-h-0 bg-surface border-line text-muted">
            {formatCount(comments)}
          </Badge>
        )}
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="group relative flex flex-col items-center gap-1 rounded-full bg-card/90 border border-line backdrop-blur-xl p-2.5 shadow-md hover:bg-card transition-all duration-200 hover:scale-110 active:scale-95"
        title="Share this track"
      >
        <Share2
          className="w-5 h-5 text-text group-hover:text-green-400 transition-colors"
          strokeWidth={2}
        />
      </button>

      {/* Report Button */}
      {onReport && (
        <button
          onClick={onReport}
          className="group relative flex items-center justify-center rounded-full bg-card/90 border border-line backdrop-blur-xl p-2.5 shadow-md hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
          title="Report this post"
        >
          <Flag
            className="w-4 h-4 text-muted group-hover:text-red-400 transition-colors"
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  )
}
