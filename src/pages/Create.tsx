import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Create() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const remix = searchParams.get('remix')

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-neutral-800 border-2 border-white/10 flex items-center justify-center">
            <span className="text-6xl">🎛️</span>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome to the DJ Studio
          </h1>
          <p className="text-lg opacity-60">
            The composer has been upgraded!
          </p>
        </div>

        {/* Remix Notice */}
        {remix && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 text-yellow-400">
            <div className="font-semibold mb-1">🔄 Remix Mode</div>
            <div className="opacity-80 text-sm">Remixing post #{remix}</div>
          </div>
        )}

        {/* Info Card */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-8 space-y-4">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-base opacity-80 leading-relaxed">
            We've moved music creation to our powerful new <span className="text-white font-semibold">DJ Studio</span>.
            Load tracks, mix them live, apply effects, and publish your creations—all in one place.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl mb-2">🎧</div>
              <div className="text-sm font-medium text-white">Live Mixing</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl mb-2">🎚️</div>
              <div className="text-sm font-medium text-white">Pro Effects</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium text-white">Easy Share</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => nav('/dj')}
          className="group w-full sm:w-auto rounded-2xl bg-white hover:bg-white/90 text-black font-bold px-12 py-4 text-lg transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center gap-3"
        >
          <span>Open DJ Studio</span>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Back Link */}
        <div>
          <button
            onClick={() => nav(-1)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  )
}
