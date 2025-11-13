import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mixer } from '../lib/audio/mixer'
import { selectLoopsForMix, getTargetBPM, getCrossfaderAutomation, getEQAutomation, type MixPreferences } from '../lib/audio/autoMixGenerator'
import { uploadAudio } from '../lib/supabase/storage'
import { createPost } from '../lib/supabase/posts'
import { toast } from 'sonner'
import { Sparkles, Music, Zap, Wind, Loader2, Home, Mic, Flame, Moon, Radio, Headphones, Sliders } from 'lucide-react'
import { GradientButton } from '../components/ui/gradient-button'

export default function Create() {
  const nav = useNavigate()
  const location = useLocation()

  // Check for remix parameter in URL
  const searchParams = new URLSearchParams(location.search)
  const remixPostId = searchParams.get('remix')

  // Mix preferences
  const [genre, setGenre] = useState<'house' | 'techno' | 'hip-hop' | 'lofi' | 'edm'>('house')
  const [energy, setEnergy] = useState<'chill' | 'medium' | 'club'>('medium')
  const [length] = useState(30) // Fixed 30 seconds for MVP

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [caption, setCaption] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')

  // Audio engine
  const mixer = useMemo(() => new Mixer(), [])
  const audioRef = useRef<HTMLAudioElement>(null)

  // Show remix indicator if this is a remix
  useEffect(() => {
    if (remixPostId) {
      toast.info('Creating a remix! Generate your version below.')
    }
  }, [remixPostId])

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  // Generate mix automatically using our audio engine
  async function generateMix() {
    setIsGenerating(true)
    setGenerationStatus('Selecting perfect loops...')

    try {
      // Select loops based on preferences
      const prefs: MixPreferences = { genre, energy, length }
      const { deckA, deckB } = selectLoopsForMix(prefs)

      setGenerationStatus(`Loading ${deckA.name} and ${deckB.name}...`)

      // Load loops into decks
      await mixer.deckA.loadFromUrl(deckA.path)
      await mixer.deckB.loadFromUrl(deckB.path)

      setGenerationStatus('Mixing tracks...')

      // Set target BPM and sync
      const targetBPM = getTargetBPM(energy)
      const rateA = targetBPM / deckA.bpm
      const rateB = targetBPM / deckB.bpm
      mixer.deckA.setRate(rateA)
      mixer.deckB.setRate(rateB)

      // Start both decks
      mixer.deckA.play()
      mixer.deckB.play()

      // Start recording
      mixer.startRecording()

      // Apply automated mixing over time
      const automationSteps = 60 // 60 steps over 30 seconds = ~0.5s per step
      const stepDuration = (length * 1000) / automationSteps

      const crossfaderPoints = getCrossfaderAutomation(length)
      const eqAPoints = getEQAutomation('A', length)
      const eqBPoints = getEQAutomation('B', length)

      for (let i = 0; i <= automationSteps; i++) {
        const currentTime = (i / automationSteps) * length

        // Interpolate crossfader
        const cfValue = interpolateAutomation(crossfaderPoints, currentTime)
        mixer.setCrossfade(cfValue)

        // Interpolate EQ for deck A
        const eqA = interpolateEQAutomation(eqAPoints, currentTime)
        mixer.deckA.setEQ(eqA)

        // Interpolate EQ for deck B
        const eqB = interpolateEQAutomation(eqBPoints, currentTime)
        mixer.deckB.setEQ(eqB)

        // Update status
        if (i % 10 === 0) {
          const progress = Math.round((i / automationSteps) * 100)
          setGenerationStatus(`Mixing... ${progress}%`)
        }

        // Wait for next step
        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }

      setGenerationStatus('Finalizing mix...')

      // Stop recording and get blob
      const blob = await mixer.stopRecording()
      mixer.deckA.pause()
      mixer.deckB.pause()

      // Create audio URL for preview
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setGeneratedBlob(blob)

      setGenerationStatus('Mix ready!')
      toast.success('Mix generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate mix. Please try again.')
      setGenerationStatus('')
    }

    setIsGenerating(false)
  }

  // Helper function to interpolate automation points
  function interpolateAutomation(points: Array<{ time: number; value: number }>, currentTime: number): number {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]

      if (currentTime >= p1.time && currentTime <= p2.time) {
        const progress = (currentTime - p1.time) / (p2.time - p1.time)
        return p1.value + (p2.value - p1.value) * progress
      }
    }
    return points[points.length - 1].value
  }

  // Helper function to interpolate EQ automation
  function interpolateEQAutomation(
    points: Array<{ time: number; low: number; mid: number; high: number }>,
    currentTime: number
  ): { low: number; mid: number; high: number } {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]

      if (currentTime >= p1.time && currentTime <= p2.time) {
        const progress = (currentTime - p1.time) / (p2.time - p1.time)
        return {
          low: p1.low + (p2.low - p1.low) * progress,
          mid: p1.mid + (p2.mid - p1.mid) * progress,
          high: p1.high + (p2.high - p1.high) * progress
        }
      }
    }
    return points[points.length - 1]
  }

  // Publish generated mix
  async function handlePublish() {
    if (!generatedBlob) return

    setIsPublishing(true)
    try {
      toast.info('Uploading mix...')
      const audioUrl = await uploadAudio(generatedBlob)

      const targetBPM = getTargetBPM(energy)
      const styleText = `${genre.charAt(0).toUpperCase() + genre.slice(1)} ${energy.charAt(0).toUpperCase() + energy.slice(1)}`

      await createPost({
        audio_url: audioUrl,
        bpm: targetBPM,
        style: styleText,
        caption: caption || (remixPostId ? `Remix of ${styleText}` : `${styleText} Mix`),
        parent_post_id: remixPostId || undefined
      })

      toast.success(remixPostId ? 'Remix published!' : 'Mix published!')
      setShowPublishModal(false)
      setTimeout(() => nav('/stream'), 1000)
    } catch (error) {
      console.error('Publishing error:', error)
      toast.error('Failed to publish. Please sign in first.')
    }
    setIsPublishing(false)
  }

  const genres = [
    { id: 'house' as const, name: 'House', icon: Home, desc: 'Deep grooves' },
    { id: 'techno' as const, name: 'Techno', icon: Zap, desc: 'Driving beats' },
    { id: 'edm' as const, name: 'EDM', icon: Flame, desc: 'Festival vibes' },
    { id: 'hip-hop' as const, name: 'Hip-Hop', icon: Mic, desc: 'Urban beats' },
    { id: 'lofi' as const, name: 'Lo-Fi', icon: Moon, desc: 'Chill vibes' }
  ]

  const energyLevels = [
    { id: 'chill' as const, name: 'Chill', icon: Wind, desc: 'Relax & unwind', bpm: '80-100 BPM' },
    { id: 'medium' as const, name: 'Groove', icon: Music, desc: 'Smooth flow', bpm: '110-120 BPM' },
    { id: 'club' as const, name: 'Club', icon: Zap, desc: 'High energy', bpm: '125-130 BPM' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-surface to-ink text-text p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.3)]">
              <Sparkles className="w-10 h-10 text-ink" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accentFrom to-accentTo bg-clip-text text-transparent">
            {remixPostId ? 'Create a Remix' : 'AI Mix Generator'}
          </h1>
          <p className="text-lg text-muted">
            {remixPostId ? 'Put your own spin on this mix!' : 'Create a perfect 30-second mix in seconds'}
          </p>
          {remixPostId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-line text-text text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Remix Mode Active
            </div>
          )}
        </div>

        {/* Genre Selection */}
        <div className="rounded-2xl border border-line bg-card/50 p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-bold text-text mb-4">Select Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {genres.map(g => {
              const GenreIcon = g.icon
              return (
                <button
                  key={g.id}
                  onClick={() => setGenre(g.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${genre === g.id
                      ? 'border-accentFrom bg-gradient-to-r from-accentFrom/10 to-accentTo/10 text-text shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                      : 'border-line hover:border-line/50 text-muted hover:text-text'
                    }
                  `}
                >
                  <GenreIcon className="w-8 h-8 mb-2 mx-auto" strokeWidth={1.5} />
                  <div className="font-semibold text-sm">{g.name}</div>
                  <div className="text-xs opacity-60 mt-1">{g.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Energy Selection */}
        <div className="rounded-2xl border border-line bg-card/50 p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-bold text-text mb-4">Select Energy</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {energyLevels.map(e => {
              const Icon = e.icon
              return (
                <button
                  key={e.id}
                  onClick={() => setEnergy(e.id)}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left
                    ${energy === e.id
                      ? 'border-accentFrom bg-gradient-to-r from-accentFrom/10 to-accentTo/10 text-text shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                      : 'border-line hover:border-line/50 text-muted hover:text-text'
                    }
                  `}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <div className="font-bold text-lg">{e.name}</div>
                  <div className="text-sm opacity-70 mt-1">{e.desc}</div>
                  <div className="text-xs font-mono opacity-50 mt-2">{e.bpm}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-4">
          <GradientButton
            onClick={generateMix}
            disabled={isGenerating}
            size="lg"
            className="w-full md:w-auto px-12 py-5"
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Generate Mix
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </GradientButton>

          {/* Generation Status */}
          {generationStatus && (
            <div className="text-center">
              <div className="text-muted font-medium animate-pulse">{generationStatus}</div>
            </div>
          )}
        </div>

        {/* Audio Preview */}
        {audioUrl && !isGenerating && (
          <div className="rounded-2xl border border-line bg-card/50 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-accentFrom" />
                <div className="text-2xl font-bold text-text">Your Mix is Ready!</div>
              </div>
              <p className="text-muted">Preview your AI-generated mix</p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full [&::-webkit-media-controls-panel]:bg-surface"
              />
            </div>

            <div className="flex gap-3">
              <GradientButton
                onClick={() => {
                  setGeneratedBlob(null)
                  setAudioUrl(null)
                }}
                variant="ghost"
                className="flex-1"
              >
                Generate New
              </GradientButton>
              <GradientButton
                onClick={() => setShowPublishModal(true)}
                className="flex-1"
              >
                Publish Mix
              </GradientButton>
            </div>
          </div>
        )}

        {/* Manual DJ Option */}
        <div className="text-center">
          <button
            onClick={() => nav('/dj')}
            className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
          >
            <span>Want full control?</span>
            <span className="font-semibold">Open DJ Studio →</span>
          </button>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center">
                  <Music className="w-8 h-8 text-ink" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Publish Your Mix</h2>
              <p className="text-white/60 text-sm">Share your AI-generated creation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`${genre.charAt(0).toUpperCase() + genre.slice(1)} ${energy} mix`}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                disabled={isPublishing}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={isPublishing}
                className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 rounded-xl bg-accent hover:bg-accent/90 px-6 py-3 text-white font-bold transition-all disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
