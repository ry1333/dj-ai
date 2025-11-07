import React from 'react'
export function ChallengeCard({ slug, title, onRemix }: { slug: string; title: string; onRemix: () => void }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm opacity-60">#{slug}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <button className="mt-3 rounded-xl bg-black text-white px-4 py-2" onClick={onRemix}>
        Remix this
      </button>
    </div>
  )
}
