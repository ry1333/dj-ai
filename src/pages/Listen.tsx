import { Link } from 'react-router-dom'

const posts = [
  { id: '1', src: '/loops/demo_loop.mp3', user: '@demo1' },
  { id: '2', src: '/loops/demo_loop.mp3', user: '@demo2' },
  { id: '3', src: '/loops/demo_loop.mp3', user: '@demo3' },
]

export default function Listen() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {posts.map(p => (
        <section key={p.id} className="h-screen snap-start relative flex items-end justify-center p-4 pb-28 md:pb-6">
          <div className="absolute top-4 left-4 text-sm opacity-70">{p.user}</div>
          <div className="w-full max-w-md rounded-2xl border bg-white/80 backdrop-blur p-4 shadow">
            <audio controls className="w-full" src={p.src} />
            <div className="mt-3 flex gap-2">
              <Link to="/create" className="rounded-xl border px-3 py-1">Remix</Link>
              <button className="rounded-xl border px-3 py-1">❤ Like</button>
              <button className="rounded-xl border px-3 py-1">↗ Share</button>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
