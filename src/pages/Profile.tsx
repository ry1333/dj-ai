import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserProfile, getUserStats } from '../lib/supabase/profiles'
import type { Profile } from '../lib/supabase/profiles'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function Profile() {
  const nav = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState({ posts: 0, loves: 0, followers: 0, following: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const userProfile = await getCurrentUserProfile()
      if (!userProfile) {
        // No profile found, redirect to onboarding
        nav('/onboarding', { replace: true })
        return
      }

      setProfile(userProfile)

      // Load stats
      const userStats = await getUserStats(userProfile.id)
      setStats(userStats)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    }
    setLoading(false)
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success('Logged out successfully')
      nav('/auth', { replace: true })
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-white/60">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-surface to-ink text-text p-6 md:p-8 lg:p-10 space-y-8">
      {/* Logout Button - Top Right */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg border border-line hover:border-line/50 hover:bg-card text-muted hover:text-text text-sm font-medium transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="h-24 w-24 rounded-full object-cover border border-line"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-surface border border-line flex items-center justify-center text-4xl">
              {profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 border-4 border-card" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            @{profile.username}
          </h1>
          {profile.display_name && profile.display_name !== profile.username && (
            <p className="text-xl text-muted mt-1">{profile.display_name}</p>
          )}
          {profile.bio && (
            <p className="text-sm md:text-base text-muted mt-2 max-w-2xl">{profile.bio}</p>
          )}
          {profile.favorite_genres && profile.favorite_genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.favorite_genres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full bg-surface border border-line text-text text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          {profile.experience_level && (
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full bg-surface border border-line text-text text-xs font-semibold capitalize">
                {profile.experience_level === 'beginner' && '🌱 '}
                {profile.experience_level === 'intermediate' && '🎧 '}
                {profile.experience_level === 'pro' && '⭐ '}
                {profile.experience_level}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-4 gap-3 md:gap-4">
        <div className="rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-4 md:p-6 text-center transition-all hover:bg-card hover:scale-105">
          <div className="text-3xl md:text-4xl font-bold text-text">{stats.posts}</div>
          <div className="text-xs md:text-sm text-muted mt-1 font-medium">Mixes</div>
        </div>
        <div className="rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-4 md:p-6 text-center transition-all hover:bg-card hover:scale-105">
          <div className="text-3xl md:text-4xl font-bold text-text">{stats.loves}</div>
          <div className="text-xs md:text-sm text-muted mt-1 font-medium">Loves</div>
        </div>
        <div className="rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-4 md:p-6 text-center transition-all hover:bg-card hover:scale-105">
          <div className="text-3xl md:text-4xl font-bold text-text">{stats.followers}</div>
          <div className="text-xs md:text-sm text-muted mt-1 font-medium">Followers</div>
        </div>
        <div className="rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-4 md:p-6 text-center transition-all hover:bg-card hover:scale-105">
          <div className="text-3xl md:text-4xl font-bold text-text">{stats.following}</div>
          <div className="text-xs md:text-sm text-muted mt-1 font-medium">Following</div>
        </div>
      </section>

      {/* Recent Mixes */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-text">
          Recent Mixes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-6 hover:bg-card hover:scale-[1.02] transition-all"
            >
              <div className="aspect-square rounded-xl bg-surface border border-line flex items-center justify-center mb-4 group-hover:bg-surface/80 transition-all">
                <span className="text-4xl text-muted">🎵</span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-muted text-sm">Coming soon</div>
                <div className="text-xs text-muted/60 mt-1">Upload your first mix</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-text">
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
              className="rounded-xl border border-line bg-card/50 backdrop-blur-xl p-4 flex items-center gap-4 hover:bg-card transition-all"
            >
              <div className="text-2xl text-muted">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-text">
                  {activity.action} <span className="text-text">{activity.track}</span>
                </div>
                <div className="text-sm text-muted">by {activity.user} • {activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
