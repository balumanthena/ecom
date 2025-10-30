'use client'

import Image from 'next/image'
import RequireAuth from '@/components/RequireAuth'
import { useCart } from '@/app/providers'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const { items, loading, inc, dec, remove } = useCart()

  if (loading) return <div className="py-16 text-center">Loading...</div>

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <RequireAuth>
      <h1 className="text-2xl font-display mb-4">Shopping Cart</h1>

      {items.length === 0 && (
        <div className="text-zinc-600">Your cart is empty.</div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-xl border bg-white flex justify-between items-center gap-4">
            
            {/* ✅ Product Image with Fallback */}
            <div className="w-20 h-20 relative rounded-lg overflow-hidden border">
              <Image
                src={item.image ?? "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-zinc-600">₹{item.price}</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => dec(item.id)}
                disabled={item.qty <= 1}
                className="px-3 py-1 rounded-xl border"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => inc(item.id)}
                className="px-3 py-1 rounded-xl border"
              >
                +
              </button>

              <button
                onClick={() => remove(item.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="text-lg font-medium">Total: ₹{total}</div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-black text-white py-2 rounded-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </RequireAuth>
  )
}
