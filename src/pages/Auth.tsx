import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { hasSupabase } from '../lib/env'

export default function AuthPage() {
  const [mode, setMode] = useState<'signIn'|'signUp'>('signIn')
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('pass1234')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [search] = useSearchParams()
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!hasSupabase || !supabase) { setError('Supabase not configured.'); setLoading(false); return }
    const fn = mode === 'signIn' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn({ email, password })
    if (error) setError(error.message)
    else nav(search.get('next') || '/profile', { replace: true })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-black via-neutral-900 to-black">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              RMXR
            </h1>
          </Link>
          <p className="text-white/60 text-sm">
            {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'signIn' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-white/60 text-sm">
              {mode === 'signIn' ? 'Enter your credentials to continue' : 'Start creating amazing mixes today'}
            </p>
          </div>

          {!hasSupabase && (
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 text-sm">
              <div className="font-semibold mb-1">⚠️ Backend not configured</div>
              <div className="opacity-80">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? 'Please wait...' : mode==='signIn'?'Sign In':'Create Account'}
          </button>

          <button
            type="button"
            className="w-full text-sm text-white/60 hover:text-white transition-colors"
            onClick={()=>setMode(mode==='signIn'?'signUp':'signIn')}
          >
            {mode==='signIn'?'Need an account? Sign up':'Already have an account? Sign in'}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link to="/stream" className="text-white/60 hover:text-white text-sm transition-colors">
            Continue without signing in →
          </Link>
        </div>
      </div>
    </div>
  )
}
