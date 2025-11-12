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
import TopBar from '../components/TopBar'

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

  // VU meter state
  const [masterLevel, setMasterLevel] = useState(0)

  const raf = useRef<number | null>(null)

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
      try {
        const blob = await mixer.stopRecording()
        setRecordedBlob(blob)
        setIsRecording(false)
        setShowPublishModal(true)
        toast.success('Recording stopped')
      } catch (error) {
        console.error('Error stopping recording:', error)
        toast.error('Failed to stop recording')
        setIsRecording(false)
      }
    } else {
      try {
        mixer.startRecording()
        setIsRecording(true)
        toast.success('Recording started')
      } catch (error) {
        console.error('Error starting recording:', error)
        toast.error('Failed to start recording')
      }
    }
  }

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

  return (
    <div className="h-screen flex flex-col bg-bg text-rmxrtext overflow-hidden">
      {/* TOP TOOLBAR */}
      <TopBar
        isRecording={isRecording}
        onRecordToggle={handleRecord}
        masterLevel={masterLevel}
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

      {/* MIXER BAND */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-8">
        <div className="h-full grid grid-cols-[3fr_2fr_3fr] gap-10">
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

      {/* LIBRARY BAND */}
      <div className="h-64 border-t border-rmxrborder bg-surface">
        <LibraryBrowser
          onLoadA={handleALoad}
          onLoadB={handleBLoad}
        />
      </div>

      {/* Publishing Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🎵</div>
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
