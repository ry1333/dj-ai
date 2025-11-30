/**
 * Seed Loops Script
 * Uploads starter-library.json to Supabase loops table
 *
 * Usage: npx tsx scripts/seed-loops.ts
 */

import starterLibrary from '../src/lib/loops/starter-library.json'
import { bulkInsertLoops } from '../src/lib/supabase/loops'

async function seedLoops() {
  console.log(`🌱 Seeding ${starterLibrary.length} loops...`)

  try {
    const count = await bulkInsertLoops(starterLibrary as any)
    console.log(`✅ Successfully inserted ${count} loops!`)
  } catch (error) {
    console.error('❌ Error seeding loops:', error)
    process.exit(1)
  }
}

seedLoops()
