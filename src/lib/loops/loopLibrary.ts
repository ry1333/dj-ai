/**
 * Loop Library - CC0 Sample Management
 * Sources: FreePD, FMA, Pixabay, OpenGameArt, ProducerSpace
 */

import starterLibrary from './starter-library.json'

export type LoopRole = 'drums' | 'bass' | 'chords' | 'melody' | 'fx' | 'vocal' | 'pad'
export type LoopEnergy = 'chill' | 'groove' | 'club'
export type LoopSource = 'FreePD' | 'FMA' | 'Pixabay' | 'OpenGameArt' | 'ProducerSpace'
export type LicenseType = 'CC0' | 'CC-BY'

export type Loop = {
  id: string
  path: string
  bpm: number
  bars: number
  durationBeats: number
  durationSeconds: number
  key: string | null
  role: LoopRole
  genre: string[]
  mood: string[]
  energy: LoopEnergy
  instruments: string[]
  source: LoopSource
  licenseType: LicenseType
  name: string
}

// Type-cast the imported JSON
const loops = starterLibrary as Loop[]

/**
 * Find loops matching criteria (for AI Mix Planner)
 */
export function findLoops(criteria: {
  genre?: string[]
  mood?: string[]
  energy?: LoopEnergy
  role?: LoopRole
  bpm?: number
  bpmRange?: number // tolerance (e.g., ±10 BPM)
}): Loop[] {
  return loops.filter(loop => {
    // Genre match (any overlap)
    if (criteria.genre && !criteria.genre.some(g => loop.genre.includes(g))) {
      return false
    }

    // Mood match (any overlap)
    if (criteria.mood && !criteria.mood.some(m => loop.mood.includes(m))) {
      return false
    }

    // Energy match (exact)
    if (criteria.energy && loop.energy !== criteria.energy) {
      return false
    }

    // Role match (exact)
    if (criteria.role && loop.role !== criteria.role) {
      return false
    }

    // BPM match (within range)
    if (criteria.bpm) {
      const range = criteria.bpmRange || 5
      if (Math.abs(loop.bpm - criteria.bpm) > range) {
        return false
      }
    }

    return true
  })
}

/**
 * Get a random loop matching criteria
 */
export function getRandomLoop(criteria: Parameters<typeof findLoops>[0]): Loop | null {
  const matches = findLoops(criteria)
  if (matches.length === 0) return null
  return matches[Math.floor(Math.random() * matches.length)]
}

/**
 * Get all loops for a specific genre
 */
export function getLoopsByGenre(genre: string): Loop[] {
  return loops.filter(loop => loop.genre.includes(genre))
}

/**
 * Get all loops for a specific role
 */
export function getLoopsByRole(role: LoopRole): Loop[] {
  return loops.filter(loop => loop.role === role)
}

/**
 * Get loop by ID
 */
export function getLoopById(id: string): Loop | null {
  return loops.find(loop => loop.id === id) || null
}

/**
 * Get all unique genres in library
 */
export function getAllGenres(): string[] {
  const genreSet = new Set<string>()
  loops.forEach(loop => {
    loop.genre.forEach(g => genreSet.add(g))
  })
  return Array.from(genreSet).sort()
}

/**
 * Get all unique moods in library
 */
export function getAllMoods(): string[] {
  const moodSet = new Set<string>()
  loops.forEach(loop => {
    loop.mood.forEach(m => moodSet.add(m))
  })
  return Array.from(moodSet).sort()
}

/**
 * Get loop library stats
 */
export function getLibraryStats() {
  const stats = {
    totalLoops: loops.length,
    byRole: {} as Record<LoopRole, number>,
    byEnergy: {} as Record<LoopEnergy, number>,
    bySource: {} as Record<LoopSource, number>,
    genres: getAllGenres(),
    moods: getAllMoods(),
    bpmRange: {
      min: Math.min(...loops.map(l => l.bpm)),
      max: Math.max(...loops.map(l => l.bpm))
    }
  }

  // Count by role
  loops.forEach(loop => {
    stats.byRole[loop.role] = (stats.byRole[loop.role] || 0) + 1
    stats.byEnergy[loop.energy] = (stats.byEnergy[loop.energy] || 0) + 1
    stats.bySource[loop.source] = (stats.bySource[loop.source] || 0) + 1
  })

  return stats
}

/**
 * Export all loops (for debugging/inspection)
 */
export function getAllLoops(): Loop[] {
  return loops
}
