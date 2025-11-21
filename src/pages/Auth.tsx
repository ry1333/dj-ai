import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { hasSupabase } from '../lib/env'
import { getCurrentUserProfile } from '../lib/supabase/profiles'
import { AlertTriangle } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState<'signIn'|'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [search] = useSearchParams()
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!hasSupabase || !supabase) { setError('Supabase not configured.'); setLoading(false); return }

    try {
      if (mode === 'signUp') {
        // Sign up with email confirmation disabled
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/onboarding'
          }
        })

        if (error) {
          setError(error.message)
        } else if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            setError('User already exists. Please sign in instead.')
          } else {
            // Wait for session to be fully established
            console.log('Signup successful, waiting for session...')

            // Give the session time to establish (wait up to 3 seconds)
            let attempts = 0
            const maxAttempts = 6 // 6 attempts * 500ms = 3 seconds

            while (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500))
              const { data: { session } } = await supabase.auth.getSession()

              if (session) {
                console.log('Session established, redirecting to onboarding')
                nav('/onboarding', { replace: true })
                return
              }

              attempts++
            }

            // If session still not established after 3 seconds, redirect anyway
            console.log('Session not fully established, but redirecting to onboarding')
            nav('/onboarding', { replace: true })
          }
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message)
        } else {
          // Wait a moment for session to be fully established
          await new Promise(resolve => setTimeout(resolve, 500))

          // Check if user has completed onboarding
          const profile = await getCurrentUserProfile()
          if (!profile || !profile.onboarding_completed) {
            nav('/onboarding', { replace: true })
          } else {
            nav(search.get('next') || '/profile', { replace: true })
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Auth error:', err)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-surface via-ink to-ink relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-accentFrom/20 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accentTo/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-block mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accentFrom to-accentTo flex items-center justify-center">
                  <svg className="w-10 h-10 text-ink animate-vinyl-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-accentFrom/30 blur-xl rounded-full animate-pulse-ring" />
              </div>
              <h1 className="text-5xl font-bold gradient-text">RMXR</h1>
            </div>
          </Link>

          <h2 className="text-4xl font-bold text-text mb-4">
            Mix. Learn. Share.
          </h2>
          <p className="text-muted text-lg mb-8">
            The social platform for DJ creators. Create amazing mixes, learn from the pros, and share with the community.
          </p>

          {/* Social Proof */}
          <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl glass">
            <div>
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-muted mt-1">Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">50K+</div>
              <div className="text-sm text-muted mt-1">Mixes</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">1M+</div>
              <div className="text-sm text-muted mt-1">Plays</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accentFrom to-accentTo flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="text-3xl font-bold gradient-text">RMXR</span>
            </Link>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-line glass p-8 space-y-5 shadow-neon-cyan">
            <div>
              <h2 className="text-2xl font-bold text-text mb-1">
                {mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-muted text-sm">
                {mode === 'signIn' ? 'Enter your credentials to continue' : 'Start creating amazing mixes today'}
              </p>
            </div>

          {!hasSupabase && (
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 text-sm">
              <div className="font-semibold mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Backend not configured
              </div>
              <div className="opacity-80">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.</div>
            </div>
          )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text/80 mb-2">Email</label>
                <input
                  className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accentFrom/50 focus:border-accentFrom/50 transition-smooth hover:border-line/50"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text/80 mb-2">Password</label>
                <input
                  className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accentFrom/50 focus:border-accentFrom/50 transition-smooth hover:border-line/50"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
                {mode === 'signUp' && password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      <div className={`flex-1 rounded-full transition-colors ${password.length >= 2 ? 'bg-red-500' : 'bg-white/10'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${password.length >= 6 ? 'bg-yellow-500' : 'bg-white/10'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${password.length >= 8 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {password.length < 6 ? 'Weak' : password.length < 8 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}
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
              className="relative w-full rounded-xl bg-gradient-to-r from-accentFrom to-accentTo hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed text-ink font-bold py-3 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Please wait...
                  </span>
                ) : mode==='signIn'?'Sign In':'Create Account'}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>

            <button
              type="button"
              className="w-full text-sm text-muted hover:text-text transition-smooth"
              onClick={()=>setMode(mode==='signIn'?'signUp':'signIn')}
            >
              {mode==='signIn'?'Need an account? Sign up →':'Already have an account? Sign in →'}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link to="/stream" className="text-muted hover:text-text text-sm transition-smooth inline-flex items-center gap-1 group">
              <span>Continue without signing in</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
