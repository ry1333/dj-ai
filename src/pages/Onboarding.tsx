import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProfile, isUsernameAvailable } from '../lib/supabase/profiles'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'

const GENRES = [
  'House', 'Techno', 'Hip-Hop', 'EDM', 'Trance', 'Dubstep',
  'Drum & Bass', 'Trap', 'Future Bass', 'Lo-Fi', 'Ambient', 'Experimental'
]

const GOALS = [
  { id: 'create', label: 'Create original mixes', icon: '🎵' },
  { id: 'remix', label: 'Remix tracks', icon: '🔄' },
  { id: 'learn', label: 'Learn DJ skills', icon: '📚' },
  { id: 'compete', label: 'Join challenges', icon: '🏆' },
  { id: 'share', label: 'Share my music', icon: '📤' },
  { id: 'discover', label: 'Discover new music', icon: '🔍' }
]

export default function Onboarding() {
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form data
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'pro'>('beginner')
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [bio, setBio] = useState('')

  // Validation
  const [usernameError, setUsernameError] = useState('')

  // Check authentication status on mount
  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!mounted) return

        if (session) {
          console.log('User is authenticated, session:', session.user.id)
          setIsAuthenticated(true)
        } else {
          console.log('No session found, redirecting to auth')
          toast.error('Please sign in to continue')
          nav('/auth', { replace: true })
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        if (mounted) {
          toast.error('Authentication error')
          nav('/auth', { replace: true })
        }
      } finally {
        if (mounted) {
          setAuthChecking(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [nav])

  async function validateUsername(value: string) {
    if (!value) {
      setUsernameError('Username is required')
      return false
    }
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, and underscores')
      return false
    }

    const available = await isUsernameAvailable(value)
    if (!available) {
      setUsernameError('Username is already taken')
      return false
    }

    setUsernameError('')
    return true
  }

  async function handleNext() {
    console.log('handleNext called, step:', step)
    if (step === 1) {
      const valid = await validateUsername(username)
      if (!valid) return
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      console.log('Step 3, calling handleComplete')
      await handleComplete()
    }
  }

  async function handleComplete() {
    setLoading(true)

    // Double-check authentication before proceeding
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Session expired. Please sign in again.')
      nav('/auth', { replace: true })
      setLoading(false)
      return
    }

    try {
      console.log('Creating profile with data:', {
        username: username.toLowerCase(),
        display_name: displayName || username,
        experience_level: experienceLevel,
        favorite_genres: favoriteGenres,
        goals,
        bio: bio || undefined,
        onboarding_completed: true
      })

      // Retry logic with exponential backoff
      let retries = 0
      const maxRetries = 3
      let lastError: any = null

      while (retries < maxRetries) {
        try {
          await createProfile({
            username: username.toLowerCase(),
            display_name: displayName || username,
            experience_level: experienceLevel,
            favorite_genres: favoriteGenres,
            goals,
            bio: bio || undefined,
            onboarding_completed: true
          })

          // Success!
          toast.success('Welcome to RMXR!')
          nav('/profile', { replace: true })
          setLoading(false)
          return

        } catch (error: any) {
          lastError = error
          console.error(`Attempt ${retries + 1} failed:`, error)

          // If it's an auth error, don't retry
          if (error.message?.includes('authenticated')) {
            // Wait a bit and check session again
            await new Promise(resolve => setTimeout(resolve, 1000))
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
              toast.error('Session expired. Please sign in again.')
              nav('/auth', { replace: true })
              setLoading(false)
              return
            }
          }

          retries++

          // Wait before retry (exponential backoff: 1s, 2s, 4s)
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000))
          }
        }
      }

      // All retries failed
      console.error('Error completing onboarding after retries:', lastError)
      console.error('Error details:', lastError?.message, lastError?.details, lastError?.hint)

      const errorMessage = lastError?.message?.includes('authenticated')
        ? 'Authentication failed. Please sign in again.'
        : `Failed to complete setup: ${lastError?.message || 'Unknown error'}`

      toast.error(errorMessage)

      if (lastError?.message?.includes('authenticated')) {
        nav('/auth', { replace: true })
      }
    } catch (error: any) {
      console.error('Unexpected error in handleComplete:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }

    setLoading(false)
  }

  function toggleGenre(genre: string) {
    setFavoriteGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  function toggleGoal(goalId: string) {
    setGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  // Show loading spinner while checking authentication
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render onboarding form if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Step {step} of 3</span>
            <span className="text-sm text-white/60">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome to RMXR</h1>
              <p className="text-white/60">Let's set up your profile</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase())
                    setUsernameError('')
                  }}
                  onBlur={() => validateUsername(username)}
                  placeholder="yourname"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                {usernameError && (
                  <p className="text-red-400 text-sm mt-2">{usernameError}</p>
                )}
                <p className="text-white/40 text-xs mt-2">
                  This is your unique handle. Choose wisely!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <p className="text-white/40 text-xs mt-2">
                  This is how others will see your name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  DJ Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'pro'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all ${
                        experienceLevel === level
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {level === 'beginner' && '🌱 Beginner'}
                      {level === 'intermediate' && '🎧 Intermediate'}
                      {level === 'pro' && '⭐ Pro'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Genres & Goals */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Your Music Taste</h1>
              <p className="text-white/60">Help us personalize your experience</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-4">
                  Favorite Genres (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`rounded-xl border px-4 py-2.5 font-medium transition-all ${
                        favoriteGenres.includes(genre)
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-4">
                  What do you want to do? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`rounded-xl border px-4 py-3 font-medium transition-all text-left flex items-center gap-3 ${
                        goals.includes(goal.id)
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <span>{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Tell us about yourself</h1>
              <p className="text-white/60">This is optional, but helps others connect with you</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself, your music journey, or what inspires you..."
                  rows={5}
                  maxLength={500}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
                <p className="text-white/40 text-xs mt-2">
                  {bio.length} / 500 characters
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-3">Profile Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Username:</span>
                    <span className="font-medium">@{username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Display Name:</span>
                    <span className="font-medium">{displayName || username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Experience:</span>
                    <span className="font-medium capitalize">{experienceLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Genres:</span>
                    <span className="font-medium">{favoriteGenres.length} selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Goals:</span>
                    <span className="font-medium">{goals.length} selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading || (step === 1 && (!username || !!usernameError))}
            className="flex-1 rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Please wait...' : step === 3 ? 'Complete Setup' : 'Next'}
          </button>
        </div>

        {step === 1 && (
          <div className="text-center mt-6">
            <button
              onClick={() => nav('/stream')}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Skip for now →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
