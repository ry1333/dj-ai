export type ReactionType = 'love' | 'comment' | 'save' | 'share'
export type Post = {
  id: string
  user_id: string
  audio_url: string
  bpm?: number
  key?: string
  style?: string
  parent_post_id?: string | null
  challenge_id?: string | null
  created_at: string
}
