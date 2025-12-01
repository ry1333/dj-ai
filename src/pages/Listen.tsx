import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { HeroMixCard, ListenActionRail, CommentsSheet, ListenBottomNav, type Mix } from '@/components/listen'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Sample mixes data
const MIXES: Mix[] = [
  {
    id: '1',
    src: '/loops/deep_house_124.wav',
    user: '@deepvibes',
    caption: 'Deep house rollers for the late night',
    bpm: 124,
    genre: 'House',
    mood: 'Groove',
    loves: 342,
    comments: 28
  },
  {
    id: '2',
    src: '/loops/tech_groove_128.wav',
    user: '@technoking',
    caption: 'Warehouse techno energy',
    bpm: 128,
    genre: 'Techno',
    mood: 'Dark',
    loves: 856,
    comments: 93
  },
  {
    id: '3',
    src: '/loops/lofi_chill_80.wav',
    user: '@chillbeats',
    caption: 'Lo-fi study session vibes',
    bpm: 80,
    genre: 'Lo-Fi',
    mood: 'Chill',
    loves: 1203,
    comments: 47
  },
  {
    id: '4',
    src: '/loops/hiphop_beat_90.wav',
    user: '@beatsbymo',
    caption: 'Boom bap classic revival',
    bpm: 90,
    genre: 'Hip-Hop',
    mood: 'Smooth',
    loves: 567,
    comments: 81
  },
  {
    id: '5',
    src: '/loops/edm_drop_128.wav',
    user: '@festivalvibes',
    caption: 'Festival main stage energy',
    bpm: 128,
    genre: 'EDM',
    mood: 'Euphoric',
    loves: 2104,
    comments: 156
  },
]

export default function Listen() {
  const nav = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [likedMixes, setLikedMixes] = useState<Set<string>>(new Set())
  const [savedMixes, setSavedMixes] = useState<Set<string>>(new Set())

  const currentMix = MIXES[currentIndex]

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < MIXES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        goToPrevious()
      } else if (e.key === 'ArrowDown') {
        goToNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const handleLike = () => {
    const newLiked = new Set(likedMixes)
    if (newLiked.has(currentMix.id)) {
      newLiked.delete(currentMix.id)
      toast.success('Removed from likes')
    } else {
      newLiked.add(currentMix.id)
      toast.success('Added to likes')
    }
    setLikedMixes(newLiked)
  }

  const handleSave = () => {
    const newSaved = new Set(savedMixes)
    if (newSaved.has(currentMix.id)) {
      newSaved.delete(currentMix.id)
      toast.success('Removed from saved')
    } else {
      newSaved.add(currentMix.id)
      toast.success('Saved to collection')
    }
    setSavedMixes(newSaved)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`https://rmxr.app/mix/${currentMix.id}`)
    toast.success('Link copied to clipboard!')
  }

  const handleRemix = () => {
    nav(`/dj?remix=${currentMix.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      {/* Background ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 pb-28">
        <div className="w-full max-w-5xl mx-auto flex items-center gap-6">
          {/* Navigation arrows - left side (up) */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="h-12 w-12 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            <span className="text-xs text-zinc-500 font-mono">
              {currentIndex + 1}/{MIXES.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex === MIXES.length - 1}
              className="h-12 w-12 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>

          {/* Hero Mix Card - center */}
          <div className="flex-1 flex justify-center">
            <HeroMixCard mix={currentMix} />
          </div>

          {/* Action Rail - right side */}
          <div className="hidden md:block">
            <ListenActionRail
              onRemix={handleRemix}
              onLike={handleLike}
              onComment={() => setCommentsOpen(true)}
              onShare={handleShare}
              onSave={handleSave}
              loves={currentMix.loves}
              comments={currentMix.comments}
              hasLoved={likedMixes.has(currentMix.id)}
              hasSaved={savedMixes.has(currentMix.id)}
            />
          </div>
        </div>

        {/* Mobile action rail - fixed at bottom right */}
        <div className="md:hidden fixed right-4 bottom-28 z-40">
          <ListenActionRail
            onRemix={handleRemix}
            onLike={handleLike}
            onComment={() => setCommentsOpen(true)}
            onShare={handleShare}
            onSave={handleSave}
            loves={currentMix.loves}
            comments={currentMix.comments}
            hasLoved={likedMixes.has(currentMix.id)}
            hasSaved={savedMixes.has(currentMix.id)}
          />
        </div>

        {/* Mobile navigation dots */}
        <div className="md:hidden fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
          {MIXES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 w-2 h-4'
                  : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Comments Sheet */}
      <CommentsSheet
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        comments={[]}
        onAddComment={(text) => {
          toast.success('Comment added!')
          setCommentsOpen(false)
        }}
      />

      {/* Bottom Navigation */}
      <ListenBottomNav />
    </div>
  )
}
