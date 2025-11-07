export default function Profile() {
  const stats = [
    { k: 'Mixes', v: 3 },
    { k: 'Likes', v: 21 },
    { k: 'Remixes', v: 5 },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 md:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 border-4 border-neutral-900" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            @you
          </h1>
          <p className="text-sm md:text-base opacity-60 mt-1">Electronic Music Creator</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
              DJ
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
              Producer
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map(s => (
          <div
            key={s.k}
            className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 md:p-6 text-center transition-all hover:border-white/20"
          >
            <div className="text-3xl md:text-4xl font-bold text-white">
              {s.v}
            </div>
            <div className="text-xs md:text-sm opacity-60 mt-1 font-medium">{s.k}</div>
          </div>
        ))}
      </section>

      {/* Recent Mixes */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
          Recent Mixes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-neutral-900/50 p-6 hover:border-white/20 transition-all"
            >
              <div className="aspect-square rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-neutral-800/80 transition-all">
                <span className="text-4xl opacity-40">🎵</span>
              </div>
              <div className="text-center">
                <div className="font-semibold opacity-60 text-sm">Coming soon</div>
                <div className="text-xs opacity-40 mt-1">Upload your first mix</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Liked', track: 'Midnight Groove', user: '@djmaster', time: '2h ago', icon: '❤️' },
            { action: 'Remixed', track: 'Summer Vibes', user: '@producer', time: '5h ago', icon: '🔄' },
            { action: 'Posted', track: 'Your New Mix', user: 'you', time: '1d ago', icon: '🎵' },
          ].map((activity, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 flex items-center gap-4 hover:border-white/20 transition-all"
            >
              <div className="text-2xl opacity-60">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-medium">
                  {activity.action} <span className="text-white">{activity.track}</span>
                </div>
                <div className="text-sm opacity-60">by {activity.user} • {activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
