import { useState, useEffect, useRef } from 'react'

type ChallengeType = 'bpm-match' | 'key-match' | 'eq-balance' | 'filter-sweep' | 'crossfade-timing' | 'phrase-counting' | 'beatmatching-ear' | 'transition-planning' | 'harmonic-mixing'

interface ChallengeProps {
  type: ChallengeType
  onComplete: () => void
}

export default function InteractiveLessonChallenge({ type, onComplete }: ChallengeProps) {
  switch (type) {
    case 'bpm-match':
      return <BPMMatchingChallenge onComplete={onComplete} />
    case 'crossfade-timing':
      return <CrossfadeTimingChallenge onComplete={onComplete} />
    case 'eq-balance':
      return <EQBalanceChallenge onComplete={onComplete} />
    case 'phrase-counting':
      return <PhraseCountingChallenge onComplete={onComplete} />
    case 'filter-sweep':
      return <FilterSweepChallenge onComplete={onComplete} />
    case 'harmonic-mixing':
      return <HarmonicMixingChallenge onComplete={onComplete} />
    case 'transition-planning':
      return <TransitionPlanningChallenge onComplete={onComplete} />
    default:
      return <div>Challenge coming soon!</div>
  }
}

// BPM Matching Challenge
function BPMMatchingChallenge({ onComplete }: { onComplete: () => void }) {
  const [targetBPM] = useState(124)
  const [userBPM, setUserBPM] = useState(120)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [completed, setCompleted] = useState(false)

  const checkBPM = () => {
    setAttempts(prev => prev + 1)
    const diff = Math.abs(targetBPM - userBPM)

    if (diff === 0) {
      setFeedback('🎉 Perfect match! You nailed it!')
      setCompleted(true)
      setTimeout(onComplete, 2000)
    } else if (diff <= 1) {
      setFeedback('✨ Close enough! In real DJing, ±1 BPM is perfectly fine.')
      setCompleted(true)
      setTimeout(onComplete, 2000)
    } else if (diff <= 3) {
      setFeedback(`🔥 Getting warm! You're ${diff} BPM off. ${userBPM < targetBPM ? 'Speed up' : 'Slow down'} a bit.`)
    } else if (diff <= 5) {
      setFeedback(`👀 Not quite there. You're ${diff} BPM away. ${userBPM < targetBPM ? 'Increase' : 'Decrease'} the pitch.`)
    } else {
      setFeedback(`❌ Way off! Target is ${targetBPM} BPM. You're at ${userBPM} BPM.`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-3">🎯 Challenge: Match the BPM</h3>
        <p className="text-white/70 mb-4">
          The target track is playing at <strong className="text-white">{targetBPM} BPM</strong>.
          Use the pitch slider to match your track to the target tempo.
        </p>

        {/* Visual BPM Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
            <div className="text-sm text-white/60 mb-1">Target BPM</div>
            <div className="text-4xl font-bold text-cyan-400">{targetBPM}</div>
            <div className="mt-2 flex justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
            <div className="text-sm text-white/60 mb-1">Your BPM</div>
            <div className={`text-4xl font-bold ${
              Math.abs(targetBPM - userBPM) <= 1 ? 'text-green-400' :
              Math.abs(targetBPM - userBPM) <= 3 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {userBPM}
            </div>
            <div className="mt-2 flex justify-center">
              <div className={`w-3 h-3 rounded-full ${
                Math.abs(targetBPM - userBPM) <= 1 ? 'bg-green-400' :
                Math.abs(targetBPM - userBPM) <= 3 ? 'bg-yellow-400' :
                'bg-red-400'
              } animate-pulse`} />
            </div>
          </div>
        </div>

        {/* Pitch Slider */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-white/80">
            Pitch Control: {userBPM > 120 ? '+' : ''}{((userBPM - 120) / 120 * 100).toFixed(1)}%
          </label>
          <div className="relative">
            <input
              type="range"
              min={115}
              max={132}
              step={0.5}
              value={userBPM}
              onChange={(e) => setUserBPM(parseFloat(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
              disabled={completed}
            />
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-4 p-4 rounded-xl border ${
            completed ? 'border-green-500/30 bg-green-500/10 text-green-400' :
            Math.abs(targetBPM - userBPM) <= 3 ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' :
            'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={checkBPM}
          disabled={completed}
          className={`mt-4 w-full py-3 rounded-xl font-bold transition-all ${
            completed
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-white hover:bg-white/90 text-black hover:scale-105 active:scale-95'
          }`}
        >
          {completed ? '✓ Challenge Complete!' : `Check Match (${attempts} attempts)`}
        </button>
      </div>
    </div>
  )
}

// Crossfade Timing Challenge
function CrossfadeTimingChallenge({ onComplete }: { onComplete: () => void }) {
  const [position, setPosition] = useState(0) // 0-1 (left to right)
  const [targetZone, setTargetZone] = useState<{ start: number, end: number } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const animationRef = useRef<number>()

  useEffect(() => {
    // Generate random target zone
    const start = 0.3 + Math.random() * 0.3 // Between 0.3 and 0.6
    setTargetZone({ start, end: start + 0.15 })
  }, [])

  useEffect(() => {
    if (isPlaying && position < 1) {
      animationRef.current = requestAnimationFrame(() => {
        setPosition(prev => Math.min(prev + 0.008, 1))
      })
    } else if (position >= 1) {
      // Reached the end, check score
      checkResult()
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, position])

  const startChallenge = () => {
    setPosition(0)
    setIsPlaying(true)
    setFeedback('')
  }

  const stopCrossfade = () => {
    setIsPlaying(false)
    checkResult()
  }

  const checkResult = () => {
    if (!targetZone) return

    if (position >= targetZone.start && position <= targetZone.end) {
      setScore(prev => prev + 1)
      setFeedback('🎉 Perfect timing! That transition was smooth!')
      if (score >= 2) {
        setTimeout(onComplete, 2000)
      }
    } else if (position < targetZone.start) {
      setFeedback('⏰ Too early! Let the track build more before mixing.')
    } else {
      setFeedback('⏰ Too late! You missed the sweet spot.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-3">🎚️ Challenge: Crossfade Timing</h3>
        <p className="text-white/70 mb-4">
          Hit <strong>STOP</strong> when the marker reaches the green zone! This simulates mixing on the drop.
          Get 3 perfect hits to complete the challenge.
        </p>

        {/* Score */}
        <div className="mb-6 text-center">
          <div className="text-sm text-white/60 mb-1">Perfect Hits</div>
          <div className="text-3xl font-bold text-purple-400">{score} / 3</div>
        </div>

        {/* Visual Crossfader */}
        <div className="relative h-24 mb-6">
          {/* Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-gradient-to-r from-cyan-500/20 via-neutral-800 to-fuchsia-500/20 rounded-full border border-white/10" />

          {/* Target Zone */}
          {targetZone && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-8 bg-green-500/30 border-2 border-green-500 rounded"
              style={{
                left: `${targetZone.start * 100}%`,
                width: `${(targetZone.end - targetZone.start) * 100}%`
              }}
            />
          )}

          {/* Moving Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-12 bg-white rounded transition-all shadow-lg"
            style={{ left: `${position * 100}%` }}
          />
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border ${
            feedback.includes('Perfect')
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isPlaying ? (
            <button
              onClick={startChallenge}
              disabled={score >= 3}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {score >= 3 ? '✓ Challenge Complete!' : 'Start'}
            </button>
          ) : (
            <button
              onClick={stopCrossfade}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105 active:scale-95"
            >
              STOP HERE!
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// EQ Balance Challenge
function EQBalanceChallenge({ onComplete }: { onComplete: () => void }) {
  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [completed, setCompleted] = useState(false)

  const targetScenario = {
    description: "Two tracks playing together - one is muddy (too much bass)",
    solution: "Cut the low frequencies to clean up the mix",
    target: { low: -12, mid: 0, high: 0 },
    tolerance: 3
  }

  const checkBalance = () => {
    const lowDiff = Math.abs(low - targetScenario.target.low)
    const midDiff = Math.abs(mid - targetScenario.target.mid)
    const highDiff = Math.abs(high - targetScenario.target.high)

    if (lowDiff <= targetScenario.tolerance && midDiff <= targetScenario.tolerance && highDiff <= targetScenario.tolerance) {
      setFeedback('🎵 Perfect! You cleared the mud by cutting the bass. The mix sounds clean now!')
      setCompleted(true)
      setTimeout(onComplete, 2000)
    } else if (lowDiff <= 6) {
      setFeedback('🎚️ Getting closer! Try cutting the bass a bit more.')
    } else {
      setFeedback('💡 Hint: When tracks clash, CUT before you boost. Try reducing the LOW frequencies.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-3">🎛️ Challenge: EQ Balance</h3>
        <p className="text-white/70 mb-4">
          <strong>Scenario:</strong> {targetScenario.description}
        </p>
        <p className="text-yellow-400 text-sm mb-6">
          💡 {targetScenario.solution}
        </p>

        {/* EQ Sliders */}
        <div className="space-y-6 mb-6">
          {/* Low */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-white/80">Low (Bass)</label>
              <span className="text-sm font-mono text-white">{low > 0 ? '+' : ''}{low} dB</span>
            </div>
            <input
              type="range"
              min={-24}
              max={24}
              step={1}
              value={low}
              onChange={(e) => setLow(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-500 via-neutral-700 to-blue-500 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
              disabled={completed}
            />
          </div>

          {/* Mid */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-white/80">Mid (Vocals)</label>
              <span className="text-sm font-mono text-white">{mid > 0 ? '+' : ''}{mid} dB</span>
            </div>
            <input
              type="range"
              min={-18}
              max={18}
              step={1}
              value={mid}
              onChange={(e) => setMid(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-green-500 via-neutral-700 to-green-500 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:cursor-pointer"
              disabled={completed}
            />
          </div>

          {/* High */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-white/80">High (Treble)</label>
              <span className="text-sm font-mono text-white">{high > 0 ? '+' : ''}{high} dB</span>
            </div>
            <input
              type="range"
              min={-24}
              max={24}
              step={1}
              value={high}
              onChange={(e) => setHigh(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-yellow-500 via-neutral-700 to-yellow-500 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:cursor-pointer"
              disabled={completed}
            />
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border ${
            completed
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={checkBalance}
          disabled={completed}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            completed
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-white hover:bg-white/90 text-black hover:scale-105 active:scale-95'
          }`}
        >
          {completed ? '✓ Challenge Complete!' : 'Check My EQ'}
        </button>
      </div>
    </div>
  )
}

// Phrase Counting Challenge (HARD - teaches structure)
function PhraseCountingChallenge({ onComplete }: { onComplete: () => void }) {
  const [beat, setBeat] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [phraseComplete, setPhraseComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const intervalRef = useRef<number>()

  const bpm = 126
  const beatsPerBar = 4
  const barsPerPhrase = 8
  const totalBeats = beatsPerBar * barsPerPhrase // 32 beats = 1 phrase

  useEffect(() => {
    if (isPlaying) {
      const beatDuration = 60000 / bpm // milliseconds per beat
      intervalRef.current = window.setInterval(() => {
        setBeat(prev => {
          const nextBeat = prev + 1
          if (nextBeat >= totalBeats) {
            checkCount()
            return 0 // Reset for next phrase
          }
          return nextBeat
        })
      }, beatDuration)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  const startCounting = () => {
    setBeat(0)
    setUserCount(0)
    setPhraseComplete(false)
    setIsPlaying(true)
    setFeedback('')
  }

  const stopAndCheck = () => {
    setIsPlaying(false)
    checkCount()
  }

  const checkCount = () => {
    setIsPlaying(false)
    setPhraseComplete(true)

    const expectedCount = barsPerPhrase // Should count 8 bars
    const diff = Math.abs(userCount - expectedCount)

    if (diff === 0) {
      setFeedback(`🎉 Perfect! You counted exactly ${barsPerPhrase} bars (32 beats). That's one phrase!`)
      setScore(prev => prev + 1)
      if (score + 1 >= 3) {
        setTimeout(onComplete, 2000)
      }
    } else if (diff === 1) {
      setFeedback(`✨ Close! You counted ${userCount} bars, the phrase is ${expectedCount} bars. Try counting in 4s: 1-2-3-4 (bar 1), 1-2-3-4 (bar 2)...`)
    } else {
      setFeedback(`📊 You counted ${userCount} bars, but the phrase is ${expectedCount} bars. Remember: 4 beats = 1 bar, 8 bars = 1 phrase (32 beats total).`)
    }
  }

  const handleCountClick = () => {
    if (isPlaying) {
      setUserCount(prev => prev + 1)
    }
  }

  const currentBar = Math.floor(beat / beatsPerBar) + 1
  const currentBeatInBar = (beat % beatsPerBar) + 1

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-3">🎵 Challenge: Count the Phrase (HARD)</h3>
        <p className="text-white/70 mb-4">
          Click COUNT every time you hear a new bar start. A phrase is <strong>8 bars</strong> (32 beats).
          This teaches you to feel track structure - essential for knowing when to mix!
        </p>
        <p className="text-sm text-yellow-400 mb-6">
          💡 Tip: Count 1-2-3-4 for each bar. When you reach 8 bars, that's one phrase!
        </p>

        {/* Score */}
        <div className="mb-6 text-center">
          <div className="text-sm text-white/60 mb-1">Perfect Phrases Counted</div>
          <div className="text-3xl font-bold text-orange-400">{score} / 3</div>
        </div>

        {/* Beat Visualization */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Bar {currentBar} of 8</span>
            <span className="text-sm text-white/60">Beat {currentBeatInBar} of 4</span>
          </div>

          {/* Visual beat grid */}
          <div className="grid grid-cols-8 gap-1 mb-4">
            {Array.from({ length: barsPerPhrase }).map((_, barIndex) => (
              <div
                key={barIndex}
                className={`h-12 rounded flex items-center justify-center font-bold text-sm transition-all ${
                  barIndex < currentBar - 1
                    ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                    : barIndex === currentBar - 1
                    ? 'bg-orange-500 text-white scale-110 shadow-lg'
                    : 'bg-white/5 text-white/30 border border-white/10'
                }`}
              >
                {barIndex + 1}
              </div>
            ))}
          </div>

          {/* Beat dots within current bar */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: beatsPerBar }).map((_, beatIndex) => (
              <div
                key={beatIndex}
                className={`w-4 h-4 rounded-full transition-all ${
                  beatIndex < currentBeatInBar
                    ? 'bg-orange-400 scale-125'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* User count display */}
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-black/30 text-center">
          <div className="text-sm text-white/60 mb-1">Your Count</div>
          <div className="text-4xl font-bold text-white">{userCount} bars</div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border ${
            feedback.includes('Perfect')
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : feedback.includes('Close')
              ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isPlaying && !phraseComplete && (
            <button
              onClick={startCounting}
              disabled={score >= 3}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-bold transition-all hover:scale-105 active:scale-95"
            >
              {score >= 3 ? '✓ Challenge Complete!' : 'Start Phrase'}
            </button>
          )}
          {isPlaying && (
            <>
              <button
                onClick={handleCountClick}
                className="flex-1 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl transition-all hover:scale-105 active:scale-95"
              >
                COUNT (Bar {userCount + 1})
              </button>
              <button
                onClick={stopAndCheck}
                className="px-6 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
              >
                Stop
              </button>
            </>
          )}
          {phraseComplete && !isPlaying && (
            <button
              onClick={startCounting}
              disabled={score >= 3}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-bold transition-all hover:scale-105 active:scale-95"
              >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Filter Sweep Challenge
function FilterSweepChallenge({ onComplete }: { onComplete: () => void }) {
  const [filterHz, setFilterHz] = useState(20000)
  const [isAnimating, setIsAnimating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const scenarios = [
    { name: 'Build Tension', target: 500, tolerance: 200, description: 'Sweep from 20kHz down to create tension before a drop' },
    { name: 'Release Energy', target: 20000, tolerance: 1000, description: 'Sweep from 500Hz up to unleash the drop' },
    { name: 'Transition Out', target: 1000, tolerance: 300, description: 'Gradually close the filter to fade out a track' }
  ]

  const currentScenario = scenarios[score % scenarios.length]

  const performSweep = () => {
    setIsAnimating(true)
    setFeedback('')

    // Animate the sweep
    const startHz = filterHz
    const targetHz = currentScenario.target
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps
    const stepSize = (targetHz - startHz) / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setFilterHz(prev => prev + stepSize)

      if (currentStep >= steps) {
        clearInterval(interval)
        setIsAnimating(false)
        checkSweep(targetHz)
      }
    }, stepDuration)
  }

  const checkSweep = (finalHz: number) => {
    const diff = Math.abs(finalHz - currentScenario.target)

    if (diff <= currentScenario.tolerance) {
      setFeedback(`🎵 Perfect sweep! You nailed the ${currentScenario.name} technique!`)
      setScore(prev => prev + 1)
      if (score + 1 >= 3) {
        setTimeout(onComplete, 2000)
      }
    } else {
      setFeedback(`🎚️ Close, but try sweeping to around ${currentScenario.target}Hz for this effect.`)
    }

    // Reset for next scenario
    setTimeout(() => {
      setFilterHz(20000)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-3">🌊 Challenge: Filter Sweep Timing</h3>
        <p className="text-white/70 mb-6">
          Set your filter position, then hit SWEEP to perform a 2-second filter sweep.
          Master the art of creating tension and releasing energy!
        </p>

        {/* Score */}
        <div className="mb-6 text-center">
          <div className="text-sm text-white/60 mb-1">Scenario {score + 1}/3</div>
          <div className="text-xl font-bold text-blue-400">{currentScenario.name}</div>
          <p className="text-sm text-white/60 mt-2">{currentScenario.description}</p>
        </div>

        {/* Filter Control */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-white/80">Filter Frequency</label>
            <span className="text-sm font-mono text-white">{Math.round(filterHz)} Hz</span>
          </div>
          <input
            type="range"
            min={200}
            max={20000}
            step={100}
            value={filterHz}
            onChange={(e) => !isAnimating && setFilterHz(parseInt(e.target.value))}
            className="w-full h-4 bg-gradient-to-r from-blue-900 via-blue-500 to-white rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            disabled={isAnimating}
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Dark/Muffled (200 Hz)</span>
            <span>Bright/Open (20kHz)</span>
          </div>
        </div>

        {/* Visual representation */}
        <div className="mb-6 h-32 rounded-xl border border-white/10 bg-black/30 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-t from-blue-500 to-transparent transition-all duration-100"
            style={{ opacity: 1 - (filterHz / 20000) }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white/70 font-semibold">
            {filterHz < 1000 ? '🌊 Dark & Muffled' :
             filterHz < 10000 ? '🎵 Mid Range' :
             '✨ Bright & Open'}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border ${
            feedback.includes('Perfect')
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={performSweep}
          disabled={isAnimating || score >= 3}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            score >= 3
              ? 'bg-green-500 text-white cursor-not-allowed'
              : isAnimating
              ? 'bg-blue-500 text-white cursor-wait animate-pulse'
              : 'bg-white hover:bg-white/90 text-black hover:scale-105 active:scale-95'
          }`}
        >
          {score >= 3 ? '✓ Challenge Complete!' : isAnimating ? 'Sweeping...' : 'PERFORM SWEEP'}
        </button>
      </div>
    </div>
  )
}

// Harmonic Mixing Challenge (HARD - teaches music theory)
function HarmonicMixingChallenge({ onComplete }: { onComplete: () => void }) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const keys = ['Am', 'C', 'Dm', 'F', 'G', 'Em', 'Bb', 'D']

  const scenarios = [
    { currentTrack: { key: 'Am', bpm: 124, name: 'Dark Techno' }, compatible: ['Am', 'C', 'Em', 'Dm'], incompatible: ['F', 'Bb'] },
    { currentTrack: { key: 'C', bpm: 126, name: 'Uplifting House' }, compatible: ['C', 'Am', 'F', 'G'], incompatible: ['Bb', 'D'] },
    { currentTrack: { key: 'G', bpm: 128, name: 'Peak Time Banger' }, compatible: ['G', 'Em', 'C', 'D'], incompatible: ['Am', 'Dm'] }
  ]

  const currentScenario = scenarios[score % scenarios.length]

  const checkMix = (nextKey: string) => {
    setSelectedTrack(nextKey)

    if (currentScenario.compatible.includes(nextKey)) {
      if (nextKey === currentScenario.currentTrack.key) {
        setFeedback(`✅ Same key! Always works, but try to add variety too. Score +1`)
      } else {
        setFeedback(`🎹 Perfect! ${nextKey} is harmonically compatible with ${currentScenario.currentTrack.key}. The mix will sound smooth!`)
      }
      setScore(prev => prev + 1)
      if (score + 1 >= 3) {
        setTimeout(onComplete, 2000)
      }
    } else {
      setFeedback(`❌ ${nextKey} will clash with ${currentScenario.currentTrack.key}. Try: ${currentScenario.compatible.slice(0, 3).join(', ')}`)
    }

    setTimeout(() => {
      setSelectedTrack(null)
      setFeedback('')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-3">🎹 Challenge: Harmonic Mixing (HARD)</h3>
        <p className="text-white/70 mb-6">
          Choose the next track that will mix harmonically with the current track.
          Understanding keys prevents clashing notes and creates pro-level transitions!
        </p>

        {/* Score */}
        <div className="mb-6 text-center">
          <div className="text-sm text-white/60 mb-1">Successful Mixes</div>
          <div className="text-3xl font-bold text-purple-400">{score} / 3</div>
        </div>

        {/* Current Track */}
        <div className="mb-6 p-5 rounded-xl border border-purple-500/30 bg-purple-500/10">
          <div className="text-sm text-purple-400 mb-2">🎵 Currently Playing</div>
          <div className="text-xl font-bold text-white mb-1">{currentScenario.currentTrack.name}</div>
          <div className="flex gap-4 text-sm text-white/70">
            <span>Key: <strong className="text-white">{currentScenario.currentTrack.key}</strong></span>
            <span>BPM: <strong className="text-white">{currentScenario.currentTrack.bpm}</strong></span>
          </div>
        </div>

        {/* Track Selection */}
        <div className="mb-6">
          <div className="text-sm text-white/70 mb-3">Choose the next track to mix:</div>
          <div className="grid grid-cols-4 gap-2">
            {keys.map((key) => {
              const isSelected = selectedTrack === key
              const isCompatible = currentScenario.compatible.includes(key)

              return (
                <button
                  key={key}
                  onClick={() => !selectedTrack && checkMix(key)}
                  disabled={!!selectedTrack}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${
                    isSelected && isCompatible
                      ? 'border-green-500 bg-green-500/20 text-green-400 scale-105'
                      : isSelected && !isCompatible
                      ? 'border-red-500 bg-red-500/20 text-red-400 scale-105'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5 text-white'
                  }`}
                >
                  {key}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border ${
            feedback.includes('Perfect') || feedback.includes('Same key')
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {score >= 3 && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-center font-bold">
            ✓ Challenge Complete! You understand harmonic mixing!
          </div>
        )}
      </div>
    </div>
  )
}

// Transition Planning Challenge (VERY HARD - combines everything)
function TransitionPlanningChallenge({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'plan' | 'execute'>('plan')
  const [plan, setPlan] = useState({
    startPoint: '',
    eqMove: '',
    filterUse: '',
    crossfadeSpeed: ''
  })
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const scenario = {
    trackA: { name: 'Peak Energy Track', section: 'drop', bpm: 128, key: 'Am' },
    trackB: { name: 'Breakdown Track', section: 'intro', bpm: 128, key: 'Am' },
    goal: 'Smooth transition from high energy to calm breakdown'
  }

  const correctAnswers = {
    startPoint: 'outro',
    eqMove: 'cut-bass-a',
    filterUse: 'sweep-down',
    crossfadeSpeed: 'slow'
  }

  const checkPlan = () => {
    let correct = 0
    let totalFeedback = []

    if (plan.startPoint === correctAnswers.startPoint) {
      correct++
      totalFeedback.push('✅ Start point correct - outro is perfect for mixing out')
    } else {
      totalFeedback.push('❌ Wrong start point. Hint: Mix from the outro when going to a breakdown')
    }

    if (plan.eqMove === correctAnswers.eqMove) {
      correct++
      totalFeedback.push('✅ EQ strategy correct - cutting bass on outgoing track prevents mud')
    } else {
      totalFeedback.push('❌ Wrong EQ move. Hint: Cut the bass on the outgoing track')
    }

    if (plan.filterUse === correctAnswers.filterUse) {
      correct++
      totalFeedback.push('✅ Filter use correct - sweeping down creates smooth energy reduction')
    } else {
      totalFeedback.push('❌ Wrong filter technique. Hint: Sweep down to reduce energy gradually')
    }

    if (plan.crossfadeSpeed === correctAnswers.crossfadeSpeed) {
      correct++
      totalFeedback.push('✅ Crossfade speed correct - slow fade suits the energy change')
    } else {
      totalFeedback.push('❌ Wrong fade speed. Hint: Go slow for this big energy shift')
    }

    if (correct === 4) {
      setFeedback('🎉 PERFECT PLAN! You understand complex transitions!')
      setScore(prev => prev + 1)
      setTimeout(onComplete, 3000)
    } else {
      setFeedback(totalFeedback.join('\n\n'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <h3 className="text-xl font-bold text-red-400 mb-3">🎯 Challenge: Plan Your Transition (VERY HARD)</h3>
        <p className="text-white/70 mb-6">
          Plan a complete transition strategy. This combines everything you've learned!
        </p>

        {/* Scenario */}
        <div className="mb-6 space-y-3">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10">
            <div className="text-sm text-cyan-400 mb-1">Track A (Current)</div>
            <div className="font-bold text-white">{scenario.trackA.name}</div>
            <div className="text-sm text-white/60">Playing: {scenario.trackA.section} | {scenario.trackA.bpm} BPM | {scenario.trackA.key}</div>
          </div>
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10">
            <div className="text-sm text-purple-400 mb-1">Track B (Next)</div>
            <div className="font-bold text-white">{scenario.trackB.name}</div>
            <div className="text-sm text-white/60">Start at: {scenario.trackB.section} | {scenario.trackB.bpm} BPM | {scenario.trackB.key}</div>
          </div>
          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <div className="text-sm text-yellow-400 mb-1">Goal</div>
            <div className="text-white">{scenario.goal}</div>
          </div>
        </div>

        {/* Planning Questions */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">1. Where should Track A be when you start mixing?</label>
            <select
              value={plan.startPoint}
              onChange={(e) => setPlan({...plan, startPoint: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="">Choose...</option>
              <option value="drop">During the drop (high energy)</option>
              <option value="build">During the build-up</option>
              <option value="outro">During the outro (ending)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">2. What EQ move should you make?</label>
            <select
              value={plan.eqMove}
              onChange={(e) => setPlan({...plan, eqMove: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="">Choose...</option>
              <option value="boost-bass-b">Boost bass on Track B</option>
              <option value="cut-bass-a">Cut bass on Track A</option>
              <option value="boost-highs-both">Boost highs on both tracks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">3. How should you use the filter?</label>
            <select
              value={plan.filterUse}
              onChange={(e) => setPlan({...plan, filterUse: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="">Choose...</option>
              <option value="sweep-up">Sweep up on Track A (add energy)</option>
              <option value="sweep-down">Sweep down on Track A (reduce energy)</option>
              <option value="no-filter">Don't use filter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">4. How fast should the crossfade be?</label>
            <select
              value={plan.crossfadeSpeed}
              onChange={(e) => setPlan({...plan, crossfadeSpeed: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            >
              <option value="">Choose...</option>
              <option value="quick">Quick (4 bars)</option>
              <option value="medium">Medium (8-16 bars)</option>
              <option value="slow">Slow (16-32 bars)</option>
            </select>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-xl border whitespace-pre-line ${
            feedback.includes('PERFECT')
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          }`}>
            {feedback}
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={checkPlan}
          disabled={!plan.startPoint || !plan.eqMove || !plan.filterUse || !plan.crossfadeSpeed || score >= 1}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            score >= 1
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-white hover:bg-white/90 text-black hover:scale-105 active:scale-95 disabled:opacity-50'
          }`}
        >
          {score >= 1 ? '✓ Challenge Complete!' : 'Check My Plan'}
        </button>
      </div>
    </div>
  )
}
