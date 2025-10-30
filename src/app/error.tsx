'use client'
export default function GlobalError({ error }: { error: Error }){
  return (
    <div className="py-24 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-display mb-2">Something went wrong</h1>
      <p className="text-sm text-zinc-600">{error.message}</p>
    </div>
  )
}
