'use client'

import { useAuth } from '@/lib/auth-context'
import RequireAuth from '@/components/RequireAuth'
import { listenWishlist, listenProducts, Product } from '@/lib/store'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'

export default function Wishlist() {
  const { user } = useAuth()
  const [ids, setIds] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => listenProducts(setProducts), [])
  useEffect(() => { if (user) return listenWishlist(user.uid, setIds) }, [user])

  const wishProducts = products.filter(p => ids.includes(p.id))

  return (
    <RequireAuth>
      <h1 className="text-2xl font-display mb-4">Your Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishProducts.length === 0 ? (
          <div className="col-span-full text-center text-zinc-600 py-8">
            No items yet.
          </div>
        ) : (
          wishProducts.map(p => <ProductCard key={p.id} p={p} />)
        )}
      </div>
    </RequireAuth>
  )
}
