import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionRail from '../components/ActionRail'
import FeedCard from '../components/FeedCard'
import { useSnapAutoplay } from '../hooks/useSnapAutoplay'

const posts = [
  {
    id: '1',
    src: '/loops/demo_loop.mp3',
    user: '@demo1',
    caption: 'Minimal drop',
    bpm: 124,
    genre: 'House',
    loves: 42,
    comments: 8
  },
  {
    id: '2',
    src: '/loops/demo_loop.mp3',
    user: '@demo2',
    caption: 'Tech-house groove',
    bpm: 128,
    genre: 'Techno',
    loves: 156,
    comments: 23
  },
  {
    id: '3',
    src: '/loops/demo_loop.mp3',
    user: '@demo3',
    caption: 'EDM pop hook',
    bpm: 130,
    genre: 'EDM',
    loves: 89,
    comments: 12
  },
]

export default function Listen() {
  const nav = useNavigate()
  const feedRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!feedRef.current) return
    // prevent iOS rubber-band overscroll feel
    feedRef.current.addEventListener('touchmove', () => {}, { passive: true })
  }, [])
  useSnapAutoplay(feedRef.current)

  return (
    <div
      ref={feedRef}
      className="tiktok-feed h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-ink text-text select-none"
    >
      {posts.map((p) => (
        <section
          key={p.id}
          data-post
          className="h-screen snap-start relative"
        >
          <FeedCard
            id={p.id}
            src={p.src}
            user={p.user}
            caption={p.caption}
            bpm={p.bpm}
            genre={p.genre}
            loves={p.loves}
            comments={p.comments}
          />
          <ActionRail
            onRemix={() => nav(`/dj?remix=${p.id}`)}
            loves={p.loves}
            comments={p.comments}
          />
        </section>
      ))}
    </div>
  )
}
