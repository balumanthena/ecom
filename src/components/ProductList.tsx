'use client'

import { Product } from '@/lib/store'
import ProductCard from './ProductCard'

type ProductListProps = {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center text-zinc-600 py-8">
        No products found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )
}
