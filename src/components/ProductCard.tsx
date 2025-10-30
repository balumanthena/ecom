'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/store'

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="block rounded-2xl bg-white border hover:shadow-md transition"
    >
      <div className="aspect-square rounded-t-2xl overflow-hidden bg-zinc-100 relative">
        <Image
          src={p.images?.[0] || '/placeholder.svg'}
          alt={p.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3">
        <div className="font-medium truncate">{p.name}</div>
        <div className="text-royal-700 font-semibold">₹{p.price}</div>
      </div>
    </Link>
  )
}
