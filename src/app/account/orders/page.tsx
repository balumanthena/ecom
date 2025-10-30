'use client'
import RequireAuth from '@/components/RequireAuth'
import { listenOrders } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'

type OrderItem = {
  name: string;
  price: number;
  qty: number;
}

type Order = {
  id: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function MyOrders(){
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => { 
    if(user) return listenOrders(user.uid, setOrders)
  }, [user])

  return (
    <RequireAuth>
      <h1 className="text-2xl font-display mb-4">My Orders</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="p-4 rounded-2xl bg-white border">
            <div className="font-medium">#{o.id.slice(-6)} • ₹{o.total} • {o.status}</div>
            <div className="text-sm text-zinc-600">{o.items.length} item(s)</div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-zinc-600">No orders yet.</div>}
      </div>
    </RequireAuth>
  )
}
