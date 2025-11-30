/**
 * Supabase Loops API
 * Functions for querying and managing the CC0 loop library
 */

import { supabase } from './client'
import type { Loop, LoopRole, LoopEnergy } from '../loops/loopLibrary'

// Database row type (snake_case from Postgres)
export type LoopRow = {
  id: string
  path: string
  url: string
  bpm: number
  bars: number
  duration_beats: number
  duration_seconds: number
  key: string | null
  role: LoopRole
  genre: string[]
  mood: string[]
  energy: LoopEnergy
  instruments: string[]
  source: string
  source_url: string | null
  license_type: string
  artist_name: string | null
  artist_url: string | null
  attribution_text: string | null
  name: string
  description: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

/**
 * Convert database row to Loop type (camelCase)
 */
function rowToLoop(row: LoopRow): Loop {
  return {
    id: row.id,
    path: row.path,
    bpm: row.bpm,
    bars: row.bars,
    durationBeats: row.duration_beats,
    durationSeconds: row.duration_seconds,
    key: row.key,
    role: row.role,
    genre: row.genre,
    mood: row.mood,
    energy: row.energy,
    instruments: row.instruments,
    source: row.source as any,
    licenseType: row.license_type as any,
    name: row.name,
  }
}

/**
 * Query loops from Supabase with filters
 */
export async function queryLoops(filters: {
  genre?: string[]
  mood?: string[]
  energy?: LoopEnergy
  role?: LoopRole
  bpm?: number
  bpmRange?: number
  limit?: number
}): Promise<Loop[]> {
  let query = supabase.from('loops').select('*')

  // Genre filter (array overlap)
  if (filters.genre && filters.genre.length > 0) {
    query = query.overlaps('genre', filters.genre)
  }

  // Mood filter (array overlap)
  if (filters.mood && filters.mood.length > 0) {
    query = query.overlaps('mood', filters.mood)
  }

  // Energy filter (exact match)
  if (filters.energy) {
    query = query.eq('energy', filters.energy)
  }

  // Role filter (exact match)
  if (filters.role) {
    query = query.eq('role', filters.role)
  }

  // BPM range filter
  if (filters.bpm) {
    const range = filters.bpmRange || 5
    query = query
      .gte('bpm', filters.bpm - range)
      .lte('bpm', filters.bpm + range)
  }

  // Limit results
  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error querying loops:', error)
    return []
  }

  return (data as LoopRow[]).map(rowToLoop)
}

/**
 * Get a single random loop matching criteria
 */
export async function getRandomLoop(filters: Parameters<typeof queryLoops>[0]): Promise<Loop | null> {
  const loops = await queryLoops({ ...filters, limit: 20 })
  if (loops.length === 0) return null
  return loops[Math.floor(Math.random() * loops.length)]
}

/**
 * Get loop by ID
 */
export async function getLoopById(id: string): Promise<Loop | null> {
  const { data, error } = await supabase
    .from('loops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching loop:', error)
    return null
  }

  return rowToLoop(data as LoopRow)
}

/**
 * Get all loops (for admin/browsing)
 */
export async function getAllLoops(): Promise<Loop[]> {
  const { data, error } = await supabase
    .from('loops')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching all loops:', error)
    return []
  }

  return (data as LoopRow[]).map(rowToLoop)
}

/**
 * Insert a new loop (admin only in production)
 */
export async function insertLoop(loop: Omit<Loop, 'id'>): Promise<Loop | null> {
  const row = {
    path: loop.path,
    url: loop.path, // For now, path = url (could be CDN later)
    bpm: loop.bpm,
    bars: loop.bars,
    duration_beats: loop.durationBeats,
    duration_seconds: loop.durationSeconds,
    key: loop.key,
    role: loop.role,
    genre: loop.genre,
    mood: loop.mood,
    energy: loop.energy,
    instruments: loop.instruments,
    source: loop.source,
    license_type: loop.licenseType,
    name: loop.name,
  }

  const { data, error } = await supabase
    .from('loops')
    .insert([row])
    .select()
    .single()

  if (error) {
    console.error('Error inserting loop:', error)
    return null
  }

  return rowToLoop(data as LoopRow)
}

/**
 * Bulk insert loops from JSON (for seeding)
 */
export async function bulkInsertLoops(loops: Omit<Loop, 'id'>[]): Promise<number> {
  const rows = loops.map(loop => ({
    path: loop.path,
    url: loop.path,
    bpm: loop.bpm,
    bars: loop.bars,
    duration_beats: loop.durationBeats,
    duration_seconds: loop.durationSeconds,
    key: loop.key,
    role: loop.role,
    genre: loop.genre,
    mood: loop.mood,
    energy: loop.energy,
    instruments: loop.instruments,
    source: loop.source,
    license_type: loop.licenseType,
    name: loop.name,
  }))

  const { data, error } = await supabase
    .from('loops')
    .insert(rows)
    .select()

  if (error) {
    console.error('Error bulk inserting loops:', error)
    return 0
  }

  return data.length
}

/**
 * Search loops by text (name, description, tags)
 */
export async function searchLoops(query: string, limit = 20): Promise<Loop[]> {
  const { data, error } = await supabase
    .from('loops')
    .select('*')
    .textSearch('name', query, { type: 'websearch' })
    .limit(limit)

  if (error) {
    console.error('Error searching loops:', error)
    return []
  }

  return (data as LoopRow[]).map(rowToLoop)
}

/**
 * Get loop library statistics
 */
export async function getLoopStats() {
  const { data, error } = await supabase.rpc('get_loop_stats')

  if (error) {
    console.error('Error fetching loop stats:', error)
    return null
  }

  return data
}
