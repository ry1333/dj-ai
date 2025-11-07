import React from 'react'
export function FeedItem({ src, onLike }: { src: string; onLike: () => void }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <audio controls className="w-full" src={src} />
      <div className="flex gap-3">
        <button className="rounded-xl border px-3 py-1" onClick={onLike}>❤ Like</button>
        <button className="rounded-xl border px-3 py-1">💾 Save</button>
        <button className="rounded-xl border px-3 py-1">↗ Share</button>
      </div>
    </div>
  )
}
