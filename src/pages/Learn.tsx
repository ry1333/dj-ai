export default function Learn() {
  const lessons = [
    {
      title: 'BPM & Tempo',
      duration: '1 min',
      text: 'House 120–128 BPM. Start at 124 and nudge.',
      icon: '⚡',
    },
    {
      title: 'Keys & Energy',
      duration: '1 min',
      text: 'Keep same key or relative minor for smooth drops.',
      icon: '🎹',
    },
    {
      title: 'Structure',
      duration: '1 min',
      text: 'Intro → build → drop. 8 bars each in MVP.',
      icon: '🏗️',
    },
    {
      title: 'Gain Staging',
      duration: '30s',
      text: '-14 LUFS target, avoid clipping.',
      icon: '🎚️',
    },
    {
      title: 'EQ Basics',
      duration: '2 min',
      text: 'Cut lows on mids/highs, boost highs for clarity.',
      icon: '🎛️',
    },
    {
      title: 'Transitions',
      duration: '1 min',
      text: 'Use filters, EQ cuts, and volume automation for smooth blends.',
      icon: '🔄',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 md:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Learn DJ Skills
        </h1>
        <p className="text-base md:text-lg opacity-60 mt-3">
          Micro-lessons to level up fast. Master the fundamentals of electronic music production.
        </p>
      </header>

      {/* Lessons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.title}
            className="group rounded-2xl border border-white/10 bg-neutral-900/50 p-6 transition-all hover:border-white/20 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl p-3 rounded-xl bg-white/5">
                {lesson.icon}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                {lesson.duration}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
            <p className="opacity-70 text-sm leading-relaxed">{lesson.text}</p>
            <button className="mt-4 w-full py-2 rounded-xl font-semibold transition-all bg-white/5 hover:bg-white/10 border border-white/10 text-white">
              Start Lesson
            </button>
          </div>
        ))}
      </div>

      {/* Learning Paths */}
      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          Learning Paths
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎧</div>
              <div>
                <h3 className="font-bold text-xl text-white">Beginner DJ</h3>
                <p className="text-sm opacity-60">6 lessons • 15 minutes</p>
              </div>
            </div>
            <p className="opacity-70 text-sm mb-4">
              Learn the basics of DJing: beatmatching, transitions, and using the DJ interface.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 w-1/3" />
              </div>
              <span className="text-xs opacity-60">33%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎵</div>
              <div>
                <h3 className="font-bold text-xl text-white">Music Production</h3>
                <p className="text-sm opacity-60">8 lessons • 25 minutes</p>
              </div>
            </div>
            <p className="opacity-70 text-sm mb-4">
              Master music theory, sound design, and arrangement for electronic music.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 w-0" />
              </div>
              <span className="text-xs opacity-60">0%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
