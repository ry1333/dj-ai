import { useState } from 'react'
import { Link } from 'react-router-dom'
import InteractiveLessonChallenge from '../components/InteractiveLessonChallenge'

type ChallengeType = 'bpm-match' | 'key-match' | 'eq-balance' | 'filter-sweep' | 'crossfade-timing' | null

type Lesson = {
  id: string
  title: string
  duration: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  hasChallenge?: ChallengeType
  content: {
    overview: string
    keyPoints: string[]
    tryIt: string
    proTip: string
  }
}

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  const lessons: Lesson[] = [
    {
      id: 'bpm-tempo',
      title: 'BPM & Tempo Matching',
      duration: '2 min',
      icon: '⚡',
      level: 'beginner',
      description: 'Master beatmatching - the foundation of smooth mixing',
      hasChallenge: 'bpm-match',
      content: {
        overview: 'BPM (Beats Per Minute) determines the speed of your track. Matching BPMs between two tracks is essential for smooth transitions.',
        keyPoints: [
          'House music: 120-128 BPM (sweet spot: 124 BPM)',
          'Hip-Hop: 80-100 BPM',
          'Techno: 125-135 BPM',
          'Drum & Bass: 160-180 BPM',
          'Use the pitch slider to match tempos (±8% usually enough)'
        ],
        tryIt: 'In DJ Studio: Load two tracks, check their BPMs, use the pitch slider on the slower track to match the faster one. Click "Sync B → A" for auto-sync!',
        proTip: 'Start with tracks in the same genre - they\'ll naturally have similar BPMs making it easier to match.'
      }
    },
    {
      id: 'keys-energy',
      title: 'Harmonic Mixing',
      duration: '3 min',
      icon: '🎹',
      level: 'beginner',
      description: 'Mix tracks that sound good together using musical keys',
      content: {
        overview: 'Harmonic mixing means playing tracks in compatible keys. This prevents clashing notes and creates smooth, professional-sounding transitions.',
        keyPoints: [
          'Same key = always compatible (e.g., Am to Am)',
          'Relative keys work well (e.g., Am to C major)',
          'Adjacent keys on the Camelot wheel are safe',
          'Energy levels matter: build up, don\'t jump down suddenly',
          'Use the "key" field when publishing to help others remix'
        ],
        tryIt: 'Check the key of your tracks before mixing. If unsure, trust your ears - if it sounds good, it IS good!',
        proTip: 'Apps like Mixed In Key or KeyFinder can analyze your tracks\' keys. But for 30-second clips, energy/vibe matters more than perfect keys!'
      }
    },
    {
      id: 'structure',
      title: 'Track Structure',
      duration: '2 min',
      icon: '🏗️',
      level: 'beginner',
      description: 'Understand how tracks are built and where to mix',
      content: {
        overview: 'Most electronic tracks follow predictable structures. Knowing this helps you plan your mix and hit the drop at the perfect moment.',
        keyPoints: [
          'Intro (0-16 bars): Minimal elements, good for mixing in',
          'Build-up (8-16 bars): Energy rises, tension builds',
          'Drop (8-32 bars): Main hook, full energy',
          'Breakdown (8-16 bars): Strip back, create contrast',
          'Outro (8-16 bars): Wind down, good for mixing out'
        ],
        tryIt: 'For 30-second clips on RMXR: Start at build-up → hit the drop at 15 seconds → ride it out. Simple and effective!',
        proTip: 'Count in 8s (8 bars = 8 repetitions of a 4-beat phrase). Most changes happen every 8, 16, or 32 bars.'
      }
    },
    {
      id: 'crossfading',
      title: 'Crossfader Technique',
      duration: '2 min',
      icon: '🔀',
      level: 'beginner',
      description: 'Smooth transitions between two tracks using the crossfader',
      hasChallenge: 'crossfade-timing',
      content: {
        overview: 'The crossfader blends Deck A and Deck B. Moving it smoothly creates professional transitions without awkward jumps.',
        keyPoints: [
          'Left = 100% Deck A, Right = 100% Deck B',
          'Middle = both decks at equal volume',
          'Slow fade = smooth/gradual transition (16-32 bars)',
          'Quick cut = sudden/energetic change (on the drop)',
          'Practice moving it in time with the beat'
        ],
        tryIt: 'Start with Deck A playing. At the start of a phrase (count 1), slowly move the crossfader right over 16 beats. Deck B takes over smoothly!',
        proTip: 'Combine crossfading with EQ cuts (drop the bass on the outgoing track) for cleaner blends.'
      }
    },
    {
      id: 'eq-basics',
      title: 'EQ Mixing',
      duration: '3 min',
      icon: '🎛️',
      level: 'intermediate',
      description: 'Use EQ to carve space and create clean mixes',
      hasChallenge: 'eq-balance',
      content: {
        overview: 'EQ (equalization) lets you boost or cut frequencies. Use it to prevent two tracks from clashing and create space in your mix.',
        keyPoints: [
          'Low (bass): Cut when tracks clash, boost for impact',
          'Mid (vocals/melody): The soul of the track',
          'High (hi-hats/cymbals): Add brightness, air, energy',
          'Rule: Cut before you boost (less is more)',
          'EQ kill technique: Drop the bass/mids/highs completely for dramatic effect'
        ],
        tryIt: 'Mix two tracks. On the incoming track (Deck B), start with bass at -12dB. As you fade in, gradually boost it back to 0. The outgoing track\'s bass cuts as you go.',
        proTip: 'During the transition: outgoing track loses bass, incoming track gains it. This prevents muddy low-end buildup.'
      }
    },
    {
      id: 'filters',
      title: 'Filter Tricks',
      duration: '2 min',
      icon: '🌊',
      level: 'intermediate',
      description: 'Use filters to create tension and energy in your mix',
      content: {
        overview: 'Filters remove frequencies progressively. Low-pass filters darken the sound, high-pass filters brighten it. Perfect for builds and transitions.',
        keyPoints: [
          'Low-pass: Cuts highs, makes sound "muffled" (like underwater)',
          'High-pass: Cuts lows, makes sound "thin" (like through a phone)',
          'Sweep slowly for tension, quickly for impact',
          'Combine with volume fades for double effect',
          'Reset to neutral (20kHz) when not using'
        ],
        tryIt: 'On the drop: start with low-pass filter at 500Hz, then sweep up to 20kHz over 8 beats. Instant drama!',
        proTip: 'Filter the outgoing track (makes it disappear smoothly) while the incoming track stays full-spectrum.'
      }
    },
    {
      id: 'gain-staging',
      title: 'Volume & Gain',
      duration: '2 min',
      icon: '🎚️',
      level: 'intermediate',
      description: 'Keep your levels clean and prevent distortion',
      content: {
        overview: 'Proper gain staging means all your tracks play at similar volumes without clipping (distortion). This makes mixing smooth and professional.',
        keyPoints: [
          'Target: -14 LUFS for streaming platforms',
          'Watch the master meter: stay in the green/yellow',
          'Red = clipping = distortion = bad',
          'Use deck gain to match track volumes',
          'Master volume controls overall output'
        ],
        tryIt: 'In DJ Studio: If one track is quieter, boost its deck volume. Aim for both tracks to "feel" the same loudness when solo\'d.',
        proTip: 'Leave headroom! Better to be slightly quiet than clipping. You can always turn up your speakers/headphones.'
      }
    },
    {
      id: 'transitions',
      title: 'Transition Techniques',
      duration: '3 min',
      icon: '🔄',
      level: 'advanced',
      description: 'Combine all skills for seamless, creative transitions',
      content: {
        overview: 'Great transitions are invisible - the audience shouldn\'t notice when one track becomes another. Combine EQ, filters, volume, and timing.',
        keyPoints: [
          'Start the incoming track at the right point (intro/breakdown)',
          'Use EQ to carve space (bass swap technique)',
          'Add filter sweeps for energy',
          'Time it with the phrase (every 8/16/32 bars)',
          'Trust your ears over rules'
        ],
        tryIt: 'Full transition recipe: (1) Start Deck B at intro, bass at -12dB. (2) Slowly crossfade over 16 bars. (3) As you fade, boost Deck B bass to 0, cut Deck A bass to -12dB. (4) Optional: add a filter sweep at the end.',
        proTip: 'For 30-second RMXR clips: Keep it simple! Quick cuts on the drop work great. You don\'t need a long blend.'
      }
    },
    {
      id: 'recording',
      title: 'Recording Your Mix',
      duration: '2 min',
      icon: '🎙️',
      level: 'beginner',
      description: 'Capture your performance and share it with the world',
      content: {
        overview: 'Recording lets you save your mix and share it. On RMXR, aim for punchy 30-40 second clips that showcase one great moment.',
        keyPoints: [
          'Hit record BEFORE you start your transition',
          'Keep it short: 30-40 seconds is perfect for social',
          'Focus on one moment: a drop, a transition, a filter sweep',
          'Don\'t aim for perfection on first take - experiment!',
          'Add a style/caption when publishing'
        ],
        tryIt: 'In DJ Studio: Load two tracks, practice your transition 2-3 times. When you\'re ready, hit Record, nail it, then hit Stop. Publish to the feed!',
        proTip: 'Start your recording 4-8 bars before the moment you want to showcase. This gives context and builds anticipation.'
      }
    }
  ]

  const markComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
    setSelectedLesson(null)
  }

  const levelColors = {
    beginner: 'text-green-400 bg-green-500/10 border-green-500/30',
    intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 md:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Learn to Mix
          </h1>
          <p className="text-base md:text-lg opacity-60 mt-3">
            Micro-lessons to master DJing. Quick, actionable, and built for creators.
          </p>
        </div>
        <Link
          to="/dj"
          className="rounded-xl bg-white hover:bg-white/90 text-black font-bold px-6 py-3 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Try DJ Studio →
        </Link>
      </header>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl font-bold">{completedLessons.size}/{lessons.length}</div>
          <div className="text-sm opacity-60 mt-1">Lessons Completed</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl font-bold">{lessons.filter(l => l.level === 'beginner').length}</div>
          <div className="text-sm opacity-60 mt-1">Beginner</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl font-bold">{lessons.filter(l => l.level === 'intermediate').length}</div>
          <div className="text-sm opacity-60 mt-1">Intermediate</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl font-bold">{lessons.filter(l => l.level === 'advanced').length}</div>
          <div className="text-sm opacity-60 mt-1">Advanced</div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Lessons</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.has(lesson.id)
            return (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="group rounded-2xl border border-white/10 bg-neutral-900/50 p-6 transition-all hover:border-white/20 hover:bg-neutral-900/70 cursor-pointer relative overflow-hidden"
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                {!isCompleted && lesson.hasChallenge && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-purple-500 flex items-center gap-1 text-white text-xs font-bold">
                    🎮
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all">
                    {lesson.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                    {lesson.duration}
                  </span>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 border ${levelColors[lesson.level]}`}>
                  {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{lesson.title}</h3>
                <p className="opacity-70 text-sm leading-relaxed">{lesson.description}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
                  Start Lesson →
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Learning Paths */}
      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          Quick Wins
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 hover:border-cyan-500/50 transition-all">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold text-xl text-white mb-2">First Mix</h3>
            <p className="opacity-70 text-sm mb-4">
              Do lessons 1-4 (Beginner). Takes 8 minutes. You'll create your first 30s mix!
            </p>
          </div>
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 hover:border-purple-500/50 transition-all">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-xl text-white mb-2">Get Creative</h3>
            <p className="opacity-70 text-sm mb-4">
              Add lessons 5-6 (Intermediate). Master EQ and filters for pro-level control.
            </p>
          </div>
          <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-6 hover:border-fuchsia-500/50 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-xl text-white mb-2">Level Up</h3>
            <p className="opacity-70 text-sm mb-4">
              Complete all 9 lessons. You'll know everything to create viral mixes on RMXR!
            </p>
          </div>
        </div>
      </section>

      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl">{selectedLesson.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelColors[selectedLesson.level]}`}>
                      {selectedLesson.level.charAt(0).toUpperCase() + selectedLesson.level.slice(1)}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                      {selectedLesson.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedLesson.title}</h2>
                  <p className="text-white/60 mt-2">{selectedLesson.description}</p>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="rounded-xl border border-white/20 p-2 hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Interactive Challenge */}
              {selectedLesson.hasChallenge && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎮</span>
                    <h3 className="text-lg font-bold text-white">Interactive Challenge</h3>
                  </div>
                  <InteractiveLessonChallenge
                    type={selectedLesson.hasChallenge}
                    onComplete={() => markComplete(selectedLesson.id)}
                  />
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">What You'll Learn</h3>
                <p className="text-white/70 leading-relaxed">{selectedLesson.content.overview}</p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {selectedLesson.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-white/70 flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Try It */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <span>💡</span> Try It in DJ Studio
                </h3>
                <p className="text-white/80 leading-relaxed">{selectedLesson.content.tryIt}</p>
                <Link
                  to="/dj"
                  className="inline-block mt-3 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all"
                >
                  Open DJ Studio →
                </Link>
              </div>

              {/* Pro Tip */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
                <h3 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <span>⭐</span> Pro Tip
                </h3>
                <p className="text-white/80 leading-relaxed">{selectedLesson.content.proTip}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => markComplete(selectedLesson.id)}
                className="flex-1 rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all hover:scale-105 active:scale-95"
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
