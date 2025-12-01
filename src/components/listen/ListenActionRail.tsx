import { Heart, MessageCircle, Share2, Sparkles, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface ListenActionRailProps {
  onRemix: () => void
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onSave?: () => void
  loves?: number
  comments?: number
  hasLoved?: boolean
  hasSaved?: boolean
}

export function ListenActionRail({
  onRemix,
  onLike,
  onComment,
  onShare,
  onSave,
  loves = 0,
  comments = 0,
  hasLoved = false,
  hasSaved = false
}: ListenActionRailProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <TooltipProvider>
      <Card className="bg-zinc-900/90 border-zinc-800 backdrop-blur-xl p-2 rounded-2xl shadow-xl">
        <div className="flex flex-col gap-3">
          {/* Remix - Primary CTA */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRemix}
                className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
                  <span className="text-[9px] font-bold text-black uppercase tracking-wider">Remix</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Remix this track</p>
            </TooltipContent>
          </Tooltip>

          {/* Like */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLike}
                variant="ghost"
                className={`relative w-14 h-14 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  hasLoved
                    ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30'
                    : 'bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Heart
                    className={`w-5 h-5 transition-colors ${hasLoved ? 'text-red-500 fill-red-500' : 'text-zinc-300'}`}
                    strokeWidth={2}
                  />
                  {loves > 0 && (
                    <span className={`text-[10px] font-semibold ${hasLoved ? 'text-red-400' : 'text-zinc-400'}`}>
                      {formatCount(loves)}
                    </span>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{hasLoved ? 'Unlike' : 'Like'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Comment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onComment}
                variant="ghost"
                className="relative w-14 h-14 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <MessageCircle className="w-5 h-5 text-zinc-300" strokeWidth={2} />
                  {comments > 0 && (
                    <span className="text-[10px] font-semibold text-zinc-400">
                      {formatCount(comments)}
                    </span>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>View comments</p>
            </TooltipContent>
          </Tooltip>

          {/* Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onShare}
                variant="ghost"
                className="relative w-14 h-14 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-all hover:scale-105 active:scale-95"
              >
                <Share2 className="w-5 h-5 text-zinc-300" strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>

          {/* Save */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSave}
                variant="ghost"
                className={`relative w-14 h-14 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  hasSaved
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30'
                    : 'bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700'
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 transition-colors ${hasSaved ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'}`}
                  strokeWidth={2}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{hasSaved ? 'Unsave' : 'Save'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  )
}
