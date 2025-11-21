import { Link } from 'react-router-dom'

type LearnHeroProps = {
  completedCount: number
  totalCount: number
  currentLesson?: {
    title: string
    progress: number
  }
}

export default function LearnHero({ completedCount, totalCount, currentLesson }: LearnHeroProps) {
  const progressPercentage = (completedCount / totalCount) * 100
  const circumference = 2 * Math.PI * 30 // radius = 30
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(1200px_400px_at_20%_-10%,rgba(0,229,255,0.15)_10%,transparent_60%),linear-gradient(#12121A,#0b0b11)] border border-line p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accentFrom to-accentTo bg-clip-text text-transparent">
            Learn to Mix
          </h1>
          <p className="mt-2 text-sm text-muted max-w-xl">
            Micro-lessons to master DJing. Quick, actionable, made for creators.
          </p>

          {/* Continue learning pill */}
          {currentLesson && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-line bg-white/5 px-3 py-2 hover:bg-white/10 transition-all">
              <span className="text-xs text-muted">Continue:</span>
              <span className="text-sm font-medium text-text">{currentLesson.title}</span>
              <button className="rounded-full bg-gradient-to-r from-accentFrom to-accentTo text-ink text-xs font-bold px-3 py-1 hover:scale-105 transition-transform">
                Resume
              </button>
            </div>
          )}
        </div>

        {/* Progress ring + CTA */}
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center">
            <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-white/10"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-accentFrom transition-all duration-500"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-semibold text-text">{completedCount}/{totalCount}</span>
          </div>
          <Link
            to="/dj"
            className="rounded-xl bg-gradient-to-r from-accentFrom to-accentTo text-ink font-bold px-4 py-2 hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] whitespace-nowrap"
          >
            Try DJ Studio →
          </Link>
        </div>
      </div>
    </div>
  )
}
