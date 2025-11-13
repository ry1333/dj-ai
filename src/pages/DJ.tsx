import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Mixer } from '../lib/audio/mixer'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createPost, getPost } from '../lib/supabase/posts'
import { uploadAudio } from '../lib/supabase/storage'
import { toast } from 'sonner'
import DualWaveform from '../components/DualWaveform'
import DeckControls from '../components/DeckControls'
import MixerCenter from '../components/MixerCenter'
import LibraryBrowser from '../components/LibraryBrowser'
import { Headphones, Music, Sparkles, ChevronDown, ChevronUp, Home, Mic, Flame, Moon, Zap, Wind } from 'lucide-react'
import TopBar from '../components/TopBar'
import { selectLoopsForMix, getTargetBPM, getCrossfaderAutomation, getEQAutomation, type MixPreferences } from '../lib/audio/autoMixGenerator'

export default function DJ() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const mixer = useMemo(() => new Mixer(), [])

  // Deck states
  const [aProg, setAProg] = useState(0)
  const [bProg, setBProg] = useState(0)
  const [aPlaying, setAPlaying] = useState(false)
  const [bPlaying, setBPlaying] = useState(false)
  const [aFileName, setAFileName] = useState('')
  const [bFileName, setBFileName] = useState('')

  // Mixer states
  const [xf, setXf] = useState(0.5) // 0..1 crossfader (centered)
  const [aBpm, setABpm] = useState(124)
  const [bBpm, setBBpm] = useState(124)
  const [masterVol, setMasterVol] = useState(0.8)

  // Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [caption, setCaption] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef<number | null>(null)

  const MAX_RECORDING_TIME = 30 // 30 seconds

  // VU meter state
  const [masterLevel, setMasterLevel] = useState(0)

  // Tutorial tooltip
  const [showTutorial, setShowTutorial] = useState(false)

  // AI Generation state
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [genre, setGenre] = useState<'house' | 'techno' | 'hip-hop' | 'lofi' | 'edm'>('house')
  const [energy, setEnergy] = useState<'chill' | 'medium' | 'club'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')

  const raf = useRef<number | null>(null)

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('rmxr_dj_tutorial_seen')
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 1000)
    }
  }, [])

  // Animation loop for progress tracking + VU meter
  useEffect(() => {
    const tick = () => {
      const aDur = mixer.deckA.buffer?.duration || 1
      const bDur = mixer.deckB.buffer?.duration || 1
      setAProg(mixer.deckA.currentTime / aDur)
      setBProg(mixer.deckB.currentTime / bDur)
      setAPlaying(mixer.deckA.playing)
      setBPlaying(mixer.deckB.playing)

      // Update VU meter with master gain value (simple approach)
      // In a full implementation, you'd use an AnalyserNode to get actual audio levels
      setMasterLevel(masterVol * ((aPlaying || bPlaying) ? 0.7 : 0))

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [mixer, masterVol, aPlaying, bPlaying])

  // Apply mixer settings
  useEffect(() => { mixer.setCrossfade(xf) }, [xf, mixer])
  useEffect(() => { mixer.master.gain.value = masterVol }, [masterVol, mixer])

  // Load remix track if parameter present
  useEffect(() => {
    const remixId = searchParams.get('remix')
    if (!remixId) return

    async function loadRemixTrack() {
      try {
        toast.info('Loading track to remix...')
        const post = await getPost(remixId!)
        if (post && post.audio_url) {
          await mixer.deckA.loadFromUrl(post.audio_url)
          if (post.bpm) setABpm(post.bpm)
          setAFileName(post.style || 'Remix Track')
          toast.success(`Loaded track to Deck A`)
        }
      } catch (error) {
        console.error('Error loading remix track:', error)
        toast.error('Failed to load track')
      }
    }

    loadRemixTrack()
  }, [searchParams, mixer])

  // Deck A controls
  const handleALoad = async (file: File) => {
    await mixer.deckA.loadFromFile(file)
    setAFileName(file.name)
    toast.success('Loaded to Deck A')
  }

  const handleAPlay = () => mixer.deckA.play()
  const handleAPause = () => mixer.deckA.pause()
  const handleACue = () => mixer.deckA.seek(0)

  // Deck B controls
  const handleBLoad = async (file: File) => {
    await mixer.deckB.loadFromFile(file)
    setBFileName(file.name)
    toast.success('Loaded to Deck B')
  }

  const handleBPlay = () => mixer.deckB.play()
  const handleBPause = () => mixer.deckB.pause()
  const handleBCue = () => mixer.deckB.seek(0)

  // BPM sync
  function syncBtoA() {
    if (!mixer.deckA.buffer || !mixer.deckB.buffer) return
    const ratio = bBpm / aBpm
    mixer.deckB.setRate(1/ratio)
    toast.success('Decks synced!')
  }

  // Recording
  async function handleRecord() {
    if (isRecording) {
      // Stop recording
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      try {
        const blob = await mixer.stopRecording()
        setRecordedBlob(blob)
        setIsRecording(false)
        setRecordingTime(0)
        setShowPublishModal(true)
        toast.success('Recording stopped')
      } catch (error) {
        console.error('Error stopping recording:', error)
        toast.error('Failed to stop recording')
        setIsRecording(false)
        setRecordingTime(0)
      }
    } else {
      // Start recording
      try {
        mixer.startRecording()
        setIsRecording(true)
        setRecordingTime(0)
        toast.success(`Recording started (${MAX_RECORDING_TIME}s max)`)

        // Start timer
        recordingTimerRef.current = window.setInterval(() => {
          setRecordingTime(prev => {
            const newTime = prev + 1

            // Auto-stop at max time
            if (newTime >= MAX_RECORDING_TIME) {
              handleRecord() // Stop recording
              toast.info('Maximum recording time reached')
              return MAX_RECORDING_TIME
            }

            return newTime
          })
        }, 1000)
      } catch (error) {
        console.error('Error starting recording:', error)
        toast.error('Failed to start recording')
      }
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [])

  // Publishing
  async function handlePublish() {
    if (!recordedBlob) return

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (recordedBlob.size > maxSize) {
      toast.error('Recording is too large. Maximum size is 50MB.')
      return
    }

    setIsPublishing(true)
    try {
      toast.info('Uploading mix...')
      const audioUrl = await uploadAudio(recordedBlob)

      await createPost({
        audio_url: audioUrl,
        bpm: Math.round((aBpm + bBpm) / 2),
        style: caption || 'DJ Mix',
        key: 'Mixed'
      })

      toast.success('Mix published!')
      setShowPublishModal(false)
      setRecordedBlob(null)
      setCaption('')
      setTimeout(() => nav('/stream'), 1000)
    } catch (error) {
      console.error('Error publishing:', error)
      toast.error('Failed to publish. Please sign in first.')
    }
    setIsPublishing(false)
  }

  function cancelPublish() {
    setShowPublishModal(false)
    setRecordedBlob(null)
    setCaption('')
  }

  // AI Generation
  async function handleAIGenerate() {
    setIsGenerating(true)
    setGenerationStatus('Selecting perfect loops...')

    try {
      const prefs: MixPreferences = { genre, energy, length: 30 }
      const { deckA, deckB } = selectLoopsForMix(prefs)

      setGenerationStatus(`Loading ${deckA.name} and ${deckB.name}...`)

      // Load into decks
      await mixer.deckA.loadFromUrl(deckA.path)
      await mixer.deckB.loadFromUrl(deckB.path)

      setAFileName(deckA.name)
      setBFileName(deckB.name)
      setABpm(deckA.bpm)
      setBBpm(deckB.bpm)

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
      setAPlaying(true)
      setBPlaying(true)

      // Start recording
      mixer.startRecording()
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= MAX_RECORDING_TIME) {
            handleRecord() // Auto-stop
          }
          return newTime
        })
      }, 1000)

      // Apply automated mixing over time
      const length = 30
      const automationSteps = 60
      const stepDuration = (length * 1000) / automationSteps

      const crossfaderPoints = getCrossfaderAutomation(length)
      const eqAPoints = getEQAutomation('A', length)
      const eqBPoints = getEQAutomation('B', length)

      for (let i = 0; i <= automationSteps; i++) {
        const currentTime = (i / automationSteps) * length

        // Interpolate crossfader
        const cfValue = interpolateAutomation(crossfaderPoints, currentTime)
        mixer.setCrossfade(cfValue)
        setXf(cfValue)

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

        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }

      setGenerationStatus('Finalizing mix...')

      // Stop recording
      const blob = await mixer.stopRecording()
      setRecordedBlob(blob)
      setIsRecording(false)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)

      mixer.deckA.pause()
      mixer.deckB.pause()
      setAPlaying(false)
      setBPlaying(false)

      setGenerationStatus('Mix ready!')
      toast.success('AI mix generated! Click publish to share.')
      setShowPublishModal(true)
      setShowAIPanel(false)
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate mix. Please try again.')
      setGenerationStatus('')
      setIsRecording(false)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    }

    setIsGenerating(false)
  }

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

  return (
    <div className="h-screen flex flex-col bg-bg text-rmxrtext overflow-hidden">
      {/* TOP TOOLBAR */}
      <TopBar
        isRecording={isRecording}
        onRecordToggle={handleRecord}
        masterLevel={masterLevel}
        recordingTime={recordingTime}
        maxRecordingTime={MAX_RECORDING_TIME}
      />

      {/* WAVEFORM BAND (slim) */}
      <div className="h-32 border-b border-rmxrborder bg-surface">
        <DualWaveform
          deckA={mixer.deckA}
          deckB={mixer.deckB}
          progressA={aProg}
          progressB={bProg}
        />
      </div>

      {/* MIXER BAND - Responsive Layout */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-8 py-4 md:py-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[3fr_2fr_3fr] gap-4 md:gap-6 lg:gap-10">
          {/* Left Deck (A) */}
          <DeckControls
            label="A"
            deck={mixer.deckA}
            playing={aPlaying}
            fileName={aFileName}
            bpm={aBpm}
            progress={aProg}
            onBpmChange={setABpm}
            onLoad={handleALoad}
            onPlay={handleAPlay}
            onPause={handleAPause}
            onCue={handleACue}
          />

          {/* Center Mixer */}
          <MixerCenter
            mixer={mixer}
            crossfader={xf}
            onCrossfaderChange={setXf}
            masterVol={masterVol}
            onMasterVolChange={setMasterVol}
            aBpm={aBpm}
            bBpm={bBpm}
            onSync={syncBtoA}
            isRecording={isRecording}
          />

          {/* Right Deck (B) */}
          <DeckControls
            label="B"
            deck={mixer.deckB}
            playing={bPlaying}
            fileName={bFileName}
            bpm={bBpm}
            progress={bProg}
            onBpmChange={setBBpm}
            onLoad={handleBLoad}
            onPlay={handleBPlay}
            onPause={handleBPause}
            onCue={handleBCue}
          />
        </div>
      </div>

      {/* AI GENERATION PANEL */}
      <div className="border-t border-rmxrborder bg-surface/50">
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accentFrom" />
            <span className="font-semibold text-text">AI Mix Generator</span>
            <span className="text-xs text-muted">{isGenerating ? generationStatus : 'Create automated 30-second mixes'}</span>
          </div>
          {showAIPanel ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showAIPanel && (
          <div className="px-4 py-6 space-y-6 border-t border-rmxrborder bg-card/30">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {/* Genre Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Genre</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'house' as const, name: 'House', icon: Home },
                    { id: 'techno' as const, name: 'Techno', icon: Zap },
                    { id: 'edm' as const, name: 'EDM', icon: Flame },
                    { id: 'hip-hop' as const, name: 'Hip-Hop', icon: Mic },
                    { id: 'lofi' as const, name: 'Lo-Fi', icon: Moon }
                  ].map((g) => {
                    const GenreIcon = g.icon
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGenre(g.id)}
                        disabled={isGenerating}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          genre === g.id
                            ? 'border-accentFrom bg-accentFrom/10 text-text'
                            : 'border-line hover:border-line/50 text-muted'
                        } disabled:opacity-50`}
                      >
                        <GenreIcon className="w-5 h-5" />
                        <span className="text-xs font-medium">{g.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Energy Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Energy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'chill' as const, name: 'Chill', icon: Wind },
                    { id: 'medium' as const, name: 'Groove', icon: Music },
                    { id: 'club' as const, name: 'Club', icon: Zap }
                  ].map((e) => {
                    const EnergyIcon = e.icon
                    return (
                      <button
                        key={e.id}
                        onClick={() => setEnergy(e.id)}
                        disabled={isGenerating}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          energy === e.id
                            ? 'border-accentFrom bg-accentFrom/10 text-text'
                            : 'border-line hover:border-line/50 text-muted'
                        } disabled:opacity-50`}
                      >
                        <EnergyIcon className="w-5 h-5" />
                        <span className="text-xs font-medium">{e.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="max-w-md mx-auto">
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="w-full rounded-xl bg-gradient-to-r from-accentFrom to-accentTo hover:shadow-neon-cyan text-ink font-bold px-6 py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    {generationStatus}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 30s Mix
                  </>
                )}
              </button>
              <p className="text-xs text-muted text-center mt-2">
                AI will select loops, auto-mix, and record a 30-second demo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LIBRARY BAND - Responsive Height */}
      <div className="h-48 md:h-64 border-t border-rmxrborder bg-surface">
        <LibraryBrowser
          onLoadA={handleALoad}
          onLoadB={handleBLoad}
        />
      </div>

      {/* Tutorial Tooltip */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Headphones className="w-16 h-16 text-accentFrom" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to the DJ Studio!</h2>
            </div>

            <div className="space-y-3 text-white/80 text-sm">
              <p><strong className="text-white">1. Load Tracks:</strong> Browse the library below and load loops to Deck A and B</p>
              <p><strong className="text-white">2. Mix:</strong> Use the crossfader to blend between decks, adjust EQ and filters</p>
              <p><strong className="text-white">3. Record:</strong> Click the REC button to start recording (max 30 seconds)</p>
              <p><strong className="text-white">4. Publish:</strong> Share your mix with the community!</p>
            </div>

            <button
              onClick={() => {
                localStorage.setItem('rmxr_dj_tutorial_seen', 'true')
                setShowTutorial(false)
              }}
              className="w-full rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Publishing Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Music className="w-16 h-16 text-accentFrom" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Publish Your Mix</h2>
              <p className="text-white/60 text-sm">Share your creation with the community</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Caption / Style
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Deep House Mix, Tech Vibes..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  disabled={isPublishing}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/60 text-xs mb-1">Avg BPM</div>
                  <div className="text-white font-bold">{Math.round((aBpm + bBpm) / 2)}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/60 text-xs mb-1">Size</div>
                  <div className="text-white font-bold">
                    {recordedBlob ? `${(recordedBlob.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelPublish}
                disabled={isPublishing}
                className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all disabled:opacity-50"
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
