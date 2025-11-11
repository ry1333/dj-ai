import { useState, useEffect, useRef } from 'react'

type ChallengeType = 'bpm-match' | 'key-match' | 'eq-balance' | 'filter-sweep' | 'crossfade-timing'

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
