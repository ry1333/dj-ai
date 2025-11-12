import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnapAutoplay } from '../hooks/useSnapAutoplay'
import { useInfiniteFeed } from '../hooks/useInfiniteFeed'
import { fetchFeedPage } from '../lib/api'
import { toggleLove } from '../lib/supabase/posts'
import ActionRail from '../components/ActionRail'
import { toast } from 'sonner'

export default function Stream() {
  const nav = useNavigate()
  const feedRef = useRef<HTMLDivElement | null>(null)
  const { items, loading, hasMore, sentinelRef } = useInfiniteFeed(fetchFeedPage)
  useSnapAutoplay(feedRef.current)

  // Track local love state for optimistic updates
  const [loveState, setLoveState] = useState<Record<string, { loves: number; has_loved: boolean }>>({})

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

  const handleComment = () => {
    toast.info('Comments coming soon!')
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
            <section key={p.id} data-post className="h-screen snap-start relative flex items-end justify-center"
              style={{background:'radial-gradient(1200px 600px at 50% 0%, rgba(255,255,255,0.03), transparent), radial-gradient(900px 400px at 50% 100%, rgba(255,255,255,0.02), transparent)'}}>

              {/* User Info & Caption */}
              <div className="absolute left-4 bottom-32 md:bottom-10 space-y-3 pointer-events-none max-w-[60%]">
                <div className="flex items-center gap-3">
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={p.user}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {p.user.charAt(1).toUpperCase()}
                    </div>
                  )}
                  <div className="font-bold text-lg text-white">
                    {p.user}
                  </div>
                </div>
                <div className="opacity-80 text-sm leading-relaxed">{p.caption}</div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2">
                  {p.bpm && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                      ⚡ {p.bpm} BPM
                    </div>
                  )}
                  {p.key && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                      🎹 {p.key}
                    </div>
                  )}
                  {p.style && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                      🎨 {p.style}
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Player */}
              <div className="w-full max-w-md mx-auto mb-28 md:mb-10 px-4">
                <div className="rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-5 shadow-2xl">
                  <audio controls className="w-full [&::-webkit-media-controls-panel]:bg-neutral-800 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white" src={p.src} preload="metadata" />
                </div>
              </div>

              {/* Action Rail */}
              <ActionRail
                onRemix={() => nav(`/dj?remix=${p.id}`)}
                onLike={() => handleLike(p.id, loves, hasLoved)}
                onShare={() => handleShare(p.id)}
                onComment={handleComment}
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
    </div>
  )
}
