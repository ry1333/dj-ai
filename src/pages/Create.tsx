import React, { useState } from 'react'
import { composeFromLoops } from '../lib/audio/compose'
import { MAX_SECONDS } from '../lib/constraints'

export default function Create() {
  const [url, setUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setError(null)
    try {
      const res = await composeFromLoops(['/loops/demo_loop.mp3'])
      setUrl(res.previewUrl)
      setDuration(res.duration)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate')
    }
  }

  const tooLong = (duration ?? 0) > MAX_SECONDS

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Make a 30–40s Drop</h1>
      <button data-testid="generate" className="rounded-xl bg-black text-white px-4 py-2" onClick={handleGenerate}>
        Generate
      </button>
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {url && <audio data-testid="preview" controls src={url} className="w-full" />}
      {duration != null && (
        <div aria-live="polite" className={tooLong ? 'text-red-600' : 'opacity-60'}>
          Duration: {duration}s (max {MAX_SECONDS}s)
        </div>
      )}
      <button disabled={!url || tooLong} className="rounded-xl border px-4 py-2 disabled:opacity-50">
        Post (stub)
      </button>
      <p className="text-sm opacity-60">Place a demo loop at <code>public/loops/demo_loop.mp3</code> to preview.</p>
    </div>
  )
}
