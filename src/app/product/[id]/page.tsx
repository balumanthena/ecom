'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/providers'
import { useCart } from '@/app/providers'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  price: number
  description: string
  category?: string
  images?: string[]
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = params.id
  const router = useRouter()

  const { user } = useAuth()
  const { add } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) {
        const data = snap.data() as Omit<Product, 'id'>
        setProduct({ id: snap.id, ...data })
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="py-16 text-center">Loading...</div>
  if (!product) return <div className="py-16 text-center">Product not found.</div>

  const handleAddToCart = async () => {
    if (!user) return router.push('/account')

    // ✅ Correct payload: no qty field
    await add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '/placeholder.png'
    })
    alert('Added to Cart ✅')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl overflow-hidden bg-white border">
        <div className="relative aspect-square">
          <Image
            src={product.images?.[0] ?? '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-display text-royal-800">{product.name}</h1>
        <div className="text-2xl font-semibold">₹{product.price}</div>
        <p className="text-zinc-700">{product.description}</p>

        <div className="flex items-center gap-3">
          <label className="text-sm">Qty</label>
          <div className="flex items-center border rounded-xl overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2">-</button>
            <div className="px-4">{qty}</div>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-2">+</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="px-4 py-3 rounded-xl bg-black text-white flex items-center gap-2"
          >
            Add to Cart
          </button>
        </div>

        <div className="pt-2 text-sm text-zinc-600">
          Payment: <strong>Cash on Delivery</strong> only.
        </div>
      </div>
    </div>
  )
}
