'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { inr } from '@/lib/utils'
import { Loader2, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'orders', id as string), (snap) => {
      setOrder(snap.data())
      setLoading(false)
    })
    return unsub
  }, [id])

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )

  if (!order)
    return (
      <div className="text-center py-20 text-zinc-600">
        Order not found.
      </div>
    )

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Order #{id.slice(0, 8)}</h1>
        <p className="text-zinc-600 mt-1">
          Placed on {order.createdAt?.toDate?.().toLocaleDateString()}
        </p>

        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-sm capitalize ${
            order.status === 'delivered'
              ? 'bg-emerald-100 text-emerald-700'
              : order.status === 'shipped'
              ? 'bg-blue-100 text-blue-700'
              : order.status === 'pending'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-zinc-100 text-zinc-700'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold mb-2">Ordered Items</h2>
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-none last:pb-0">
            <Image
              src={item.image}
              width={70}
              height={70}
              alt={item.name}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-zinc-600">Qty: {item.qty}</div>
            </div>
            <div className="font-semibold">{inr.format(item.price)}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-2">
        <h2 className="font-semibold mb-2">Payment</h2>
        <div className="flex justify-between text-sm">
          <span>Payment Mode</span>
          <span className="font-medium">{order.paymentMode}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold border-t pt-3 mt-3">
          <span>Total</span>
          <span>{inr.format(order.total)}</span>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <div className="text-sm text-zinc-700">
          {order.address}
        </div>
        {order.phone && <div className="text-sm text-zinc-700 mt-1">📞 {order.phone}</div>}
      </div>
    </div>
  )
}
