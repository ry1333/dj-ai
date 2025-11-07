import { MAX_SECONDS } from '../env'
export async function composeFromLoops(loopUrls: string[], maxSeconds = MAX_SECONDS) {
  if (!loopUrls?.length) throw new Error('No loops provided')
  const previewUrl = loopUrls[0] // MVP preview — real render will be server-side (ffmpeg)
  const duration = Math.min(40, maxSeconds)
  return { previewUrl, duration }
}
