import { hasSupabase } from './env'
import { supabase } from './supabase'

export type FeedItem = {
  id: string
  src: string
  user: string
  caption: string
  bpm?: number
  key?: string
  style?: string
  avatar_url?: string
  loves?: number
  has_loved?: boolean
  comments?: number
}

let mockCounter = 0
const captions = ['Minimal drop','Tech-house groove','EDM pop hook','Deep house vibe','Bassline roller','Crunchy clap','Shimmer lead']

export async function fetchFeedPage(page = 0, pageSize = 5): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  if (!hasSupabase || !supabase) {
    const items: FeedItem[] = Array.from({ length: pageSize }, () => {
      mockCounter += 1
      const id = String(mockCounter)
      return { id, src: '/loops/demo_loop.mp3', user: `@demo${id}`, caption: captions[mockCounter % captions.length] || 'New drop', bpm: 120 + (mockCounter % 16) }
    })
    return { items, hasMore: mockCounter < 1000 }
  }

  const from = page * pageSize, to = from + pageSize - 1

  // Get current user for has_loved check
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Fetch posts with profile data and love counts
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      audio_url,
      caption,
      bpm,
      key,
      style,
      created_at,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  // Get reactions (loves and comments) for all posts
  const postIds = (data ?? []).map((p: any) => p.id)
  const { data: reactions } = await supabase
    .from('reactions')
    .select('post_id, user_id, type')
    .in('post_id', postIds)

  // Calculate loves and comments per post
  const reactionData = (reactions ?? []).reduce((acc: any, reaction: any) => {
    if (!acc[reaction.post_id]) {
      acc[reaction.post_id] = { loves: 0, hasLoved: false, comments: 0 }
    }
    if (reaction.type === 'love') {
      acc[reaction.post_id].loves++
      if (currentUser && reaction.user_id === currentUser.id) {
        acc[reaction.post_id].hasLoved = true
      }
    } else if (reaction.type === 'comment') {
      acc[reaction.post_id].comments++
    }
    return acc
  }, {})

  const items: FeedItem[] = (data ?? []).map((r: any) => ({
    id: r.id,
    src: r.audio_url,
    user: r.profiles?.username ? `@${r.profiles.username}` : '@unknown',
    caption: r.caption ?? '',
    bpm: r.bpm,
    key: r.key,
    style: r.style,
    avatar_url: r.profiles?.avatar_url,
    loves: reactionData[r.id]?.loves ?? 0,
    has_loved: reactionData[r.id]?.hasLoved ?? false,
    comments: reactionData[r.id]?.comments ?? 0
  }))

  return { items, hasMore: (data?.length ?? 0) === pageSize }
}

export async function createPost(params: { audioUrl: string; caption?: string }) {
  if (!hasSupabase || !supabase) throw new Error('Supabase not configured')
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not signed in')
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, audio_url: params.audioUrl, caption: params.caption ?? '' })
    .select('id')
    .single()
  if (error) throw error
  return data
}
