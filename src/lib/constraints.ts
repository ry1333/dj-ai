import { MAX_SECONDS } from './env'
export function validateDuration(seconds: number) {
  if (seconds > MAX_SECONDS) throw new Error(`Clip too long: ${seconds}s (max ${MAX_SECONDS}s)`)
}
export { MAX_SECONDS }
