import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnapAutoplay } from '../hooks/useSnapAutoplay'
import { useInfiniteFeed } from '../hooks/useInfiniteFeed'
import { fetchFeedPage } from '../lib/api'
import { toggleLove } from '../lib/supabase/posts'
import ActionRail from '../components/ActionRail'
import CommentsModal from '../components/CommentsModal'
import ReportModal from '../components/ReportModal'
import VinylPlayer from '../components/VinylPlayer'
import { toast } from 'sonner'

export default function Stream() {
  const nav = useNavigate()
  const feedRef = useRef<HTMLDivElement | null>(null)
  const { items, loading, hasMore, sentinelRef } = useInfiniteFeed(fetchFeedPage)
  useSnapAutoplay(feedRef.current)

  // Track local love state for optimistic updates
  const [loveState, setLoveState] = useState<Record<string, { loves: number; has_loved: boolean }>>({})

  // Comments modal state
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null)

  // Report modal state
  const [reportPostId, setReportPostId] = useState<string | null>(null)

  const handleLike = async (postId: string, currentLoves: number, currentHasLoved: boolean) => {
    // Optimistic update
    const newHasLoved = !currentHasLoved
    const newLoves = newHasLoved ? currentLoves + 1 : currentLoves - 1

    setLoveState(prev => ({
      ...prev,
      [postId]: { loves: newLoves, has_loved: newHasLoved }
    }))

    try {
      await toggleLove(postId)
    } catch (error) {
      // Revert on error
      setLoveState(prev => ({
        ...prev,
        [postId]: { loves: currentLoves, has_loved: currentHasLoved }
      }))

      if (error instanceof Error && error.message.includes('authenticated')) {
        toast.error('Please sign in to like posts')
      } else {
        toast.error('Failed to update like')
      }
      console.error('Error toggling love:', error)
    }
  }

  const handleShare = async (postId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/stream?post=${postId}`

    try {
      // Try native share API first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this mix on RMXR',
          url: url
        })
        toast.success('Shared successfully!')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      // If user cancels share dialog, don't show error
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error)
        toast.error('Failed to share')
      }
    }
  }

  const handleComment = (postId: string) => {
    setCommentsPostId(postId)
  }

  const handleRemix = (postId: string) => {
    // Navigate to create page with parent_post_id in URL
    nav(`/create?remix=${postId}`)
    toast.info('Remix this mix in the Create page!')
  }

  return (
    <div ref={feedRef} className="tiktok-feed h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white">
      {items.length === 0 && !loading ? (
        <div className="h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-white">No Posts Yet</h2>
            <p className="text-white/60 leading-relaxed">
              Be the first to create! Head to the DJ Studio, make a 30-second mix, and publish it to the feed.
            </p>
            <button
              onClick={() => nav('/dj')}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold transition-all hover:scale-105 active:scale-95"
            >
              Open DJ Studio →
            </button>
          </div>
        </div>
      ) : (
        items.map((p) => {
          const loves = loveState[p.id]?.loves ?? p.loves ?? 0
          const hasLoved = loveState[p.id]?.has_loved ?? p.has_loved ?? false

          return (
            <section key={p.id} data-post className="h-screen snap-start relative flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(1200px 600px at 50% 0%, rgba(6, 182, 212, 0.08), transparent), radial-gradient(900px 400px at 50% 100%, rgba(168, 85, 247, 0.06), transparent), #000'
              }}>

              {/* Animated Background Mesh */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
              </div>

              {/* User Info & Caption */}
              <div className="absolute left-3 bottom-20 md:bottom-6 max-w-[60%] z-10">
                <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-2 shadow-lg pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.user}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {p.user.charAt(1).toUpperCase()}
                      </div>
                    )}
                    <div className="font-semibold text-sm text-white">
                      @{p.user}
                    </div>
                  </div>
                  {p.caption && (
                    <div className="text-white/80 text-xs leading-snug mb-1.5 ml-10">{p.caption}</div>
                  )}

                  {/* Tags Row */}
                  <div className="flex flex-wrap gap-1.5 ml-10">
                    {p.bpm && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/20 text-cyan-300 text-[10px] font-semibold">
                        ⚡{p.bpm}
                      </div>
                    )}
                    {p.key && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-purple-300 text-[10px] font-semibold">
                        🎹{p.key}
                      </div>
                    )}
                    {p.style && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-400/20 text-pink-300 text-[10px] font-semibold">
                        {p.style}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vinyl Player */}
              <div className="w-full max-w-lg mx-auto px-4">
                <VinylPlayer
                  audioUrl={p.src}
                  bpm={p.bpm}
                  musicalKey={p.key}
                  style={p.style}
                />
              </div>

              {/* Action Rail */}
              <ActionRail
                onRemix={() => handleRemix(p.id)}
                onLike={() => handleLike(p.id, loves, hasLoved)}
                onShare={() => handleShare(p.id)}
                onComment={() => handleComment(p.id)}
                onReport={() => setReportPostId(p.id)}
                loves={loves}
                hasLoved={hasLoved}
                comments={p.comments ?? 0}
              />
            </section>
          )
        })
      )}
      <div ref={sentinelRef} className="h-10" />
      {loading && <div className="pb-24 text-center opacity-70">Loading…</div>}
      {!hasMore && items.length > 0 && <div className="pb-24 text-center opacity-50">You're all caught up</div>}

      {/* Comments Modal */}
      {commentsPostId && (
        <CommentsModal
          postId={commentsPostId}
          isOpen={!!commentsPostId}
          onClose={() => setCommentsPostId(null)}
        />
      )}

      {/* Report Modal */}
      {reportPostId && (
        <ReportModal
          target={{ type: 'post', id: reportPostId }}
          isOpen={!!reportPostId}
          onClose={() => setReportPostId(null)}
        />
      )}
    </div>
  )
}
