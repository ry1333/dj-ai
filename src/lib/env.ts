import { z } from 'zod'
const Env = z.object({
  VITE_SUPABASE_URL: z.string().url().min(1),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_POST_MAX_SECONDS: z.string().optional(),
})
export const env = (() => {
  const parsed = Env.safeParse(import.meta.env)
  if (!parsed.success) {
    if (import.meta.env.DEV) console.error(parsed.error.flatten().fieldErrors)
    throw new Error('Missing/invalid env vars. Check .env/.env.example')
  }
  return parsed.data
})()
export const MAX_SECONDS = Number(import.meta.env.VITE_POST_MAX_SECONDS || 40)
