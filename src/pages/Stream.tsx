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

  return (
    <div ref={feedRef} className="tiktok-feed h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white">
      {items.map((p) => {
        const loves = loveState[p.id]?.loves ?? p.loves ?? 0
        const hasLoved = loveState[p.id]?.has_loved ?? p.has_loved ?? false

        return (
          <section key={p.id} data-post className="h-screen snap-start relative flex items-end justify-center"
            style={{background:'radial-gradient(1200px 600px at 50% 0%, rgba(255,255,255,0.06), transparent), radial-gradient(900px 400px at 50% 100%, rgba(255,0,128,0.08), transparent)'}}>
            <div className="absolute left-4 bottom-32 md:bottom-10 space-y-1 pointer-events-none">
              <div className="font-semibold">{p.user}</div>
              <div className="opacity-80 text-sm">{p.caption}</div>
            </div>
            <div className="w-full max-w-md mx-auto mb-28 md:mb-10 px-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-2xl">
                <audio controls className="w-full" src={p.src} preload="metadata" />
              </div>
            </div>
            <ActionRail
              onRemix={() => nav(`/create?remix=${p.id}`)}
              onLike={() => handleLike(p.id, loves, hasLoved)}
              loves={loves}
              hasLoved={hasLoved}
            />
          </section>
        )
      })}
      <div ref={sentinelRef} className="h-10" />
      {loading && <div className="pb-24 text-center opacity-70">Loading…</div>}
      {!hasMore && <div className="pb-24 text-center opacity-50">You're all caught up</div>}
    </div>
  )
}
