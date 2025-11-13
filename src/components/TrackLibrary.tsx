import { useState, useEffect } from 'react'
import { Music, Loader2 } from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Track {
  id: string
  caption: string | null
  audio_url: string
  created_at: string
  bpm: number | null
  style: string | null
}

interface TrackLibraryProps {
  onSelect: (audioUrl: string, caption: string, bpm: number) => void
}

export default function TrackLibrary({ onSelect }: TrackLibraryProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTracks()
  }, [])

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, caption, audio_url, created_at, bpm, style')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      if (data) setTracks(data)
    } catch (error) {
      console.error('Error loading tracks:', error)
      toast.error('Failed to load track library')
    } finally {
      setLoading(false)
    }
  }

  const handleTrackClick = (track: Track) => {
    onSelect(
      track.audio_url,
      track.caption || track.style || 'Untitled Mix',
      track.bpm || 120
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <span className="ml-2 text-muted">Loading tracks...</span>
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Music className="w-12 h-12 text-muted/50 mb-2" />
        <p className="text-muted text-sm">No tracks available yet</p>
        <p className="text-muted/60 text-xs mt-1">Create and publish mixes to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-surface">
      {tracks.map((track) => (
        <button
          key={track.id}
          onClick={() => handleTrackClick(track)}
          className="w-full p-3 rounded-lg border border-line hover:border-accent bg-surface/50 hover:bg-surface text-left transition-all group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-text text-sm truncate group-hover:text-accent transition-colors">
                {track.caption || track.style || 'Untitled Mix'}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                <span>
                  {formatDistanceToNow(new Date(track.created_at), { addSuffix: true })}
                </span>
                {track.bpm && (
                  <>
                    <span>•</span>
                    <span>{track.bpm} BPM</span>
                  </>
                )}
                {track.style && (
                  <>
                    <span>•</span>
                    <span>{track.style}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Load →
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
