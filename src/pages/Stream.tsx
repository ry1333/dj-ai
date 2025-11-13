import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnapAutoplay } from '../hooks/useSnapAutoplay'
import { useInfiniteFeed } from '../hooks/useInfiniteFeed'
import { fetchFeedPage } from '../lib/api'
import { toggleLove } from '../lib/supabase/posts'
import ActionRail from '../components/ActionRail'
import CommentsModal from '../components/CommentsModal'
import ReportModal from '../components/ReportModal'
import FeedCard from '../components/FeedCard'
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
    <div ref={feedRef} className="tiktok-feed h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-ink text-text select-none">
      {items.length === 0 && !loading ? (
        <div className="h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-text">No Posts Yet</h2>
            <p className="text-muted leading-relaxed">
              Be the first to create! Head to the Create page, make a 30-second mix, and publish it to the feed.
            </p>
            <button
              onClick={() => nav('/create')}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-accentFrom to-accentTo text-ink font-bold transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              Open Create Studio →
            </button>
          </div>
        </div>
      ) : (
        items.map((p) => {
          const loves = loveState[p.id]?.loves ?? p.loves ?? 0
          const hasLoved = loveState[p.id]?.has_loved ?? p.has_loved ?? false

          return (
            <section key={p.id} data-post className="h-screen snap-start relative">
              <FeedCard
                id={p.id}
                src={p.src}
                user={p.user}
                avatar={p.avatar_url}
                caption={p.caption || ''}
                bpm={p.bpm}
                genre={p.style}
                loves={loves}
                comments={p.comments ?? 0}
                hasLoved={hasLoved}
              />

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
