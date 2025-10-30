'use client'

import { useEffect, useMemo, useState } from 'react'
import { listenProducts, type Product } from '@/lib/store'
import ProductCard from '@/components/ProductCard'
import { Search, Crown, SlidersHorizontal } from 'lucide-react'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState<'new' | 'priceLow' | 'priceHigh'>('new')

  useEffect(() => listenProducts(setProducts), [])

  const cats = useMemo(
    () => ['All', ...Array.from(new Set(products.map(p => p.category))).sort()],
    [products]
  )

  const filtered = useMemo(() => {
    const base = products
      .filter(p => (cat === 'All' ? true : p.category === cat))
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))

    const sorted = [...base].sort((a, b) => {
      if (sort === 'priceLow') return a.price - b.price
      if (sort === 'priceHigh') return b.price - a.price
      // 'new' – createdAt desc if available, else stable
      return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
    })
    return sorted
  }, [q, cat, sort, products])

  return (
    <div className="space-y-6">
      {/* Royal header */}
      <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 md:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Crown className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Royal Collection
            </h1>
            <p className="text-sm text-zinc-600">
              Luxury-inspired pieces with grace & elegance.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search jewelry..."
              className="w-full rounded-xl border border-zinc-200 bg-white/80 pl-9 pr-3 py-2 outline-none ring-0 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 transition"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white/80 py-2 pl-3 pr-8 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-200 transition"
              >
                {cats.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">▾</span>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white/80 py-2 pl-3 pr-8 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-200 transition"
                title="Sort"
              >
                <option value="new">Newest</option>
                <option value="priceLow">Price: Low → High</option>
                <option value="priceHigh">Price: High → Low</option>
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {cats.map(c => {
            const active = c === cat
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-zinc-200 bg-white/60 p-10 text-center text-zinc-600">
            No matching products.
          </div>
        ) : (
          filtered.map(p => (
            <div
              key={p.id}
              className="group rounded-2xl border border-zinc-100 bg-white shadow-sm ring-1 ring-black/[0.02] transition hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Your existing card inside a pretty shell */}
              <ProductCard p={p} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
