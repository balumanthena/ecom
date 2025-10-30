'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth, useCart } from '@/app/providers'
import { auth, db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import {
  Crown,
  LogOut,
  Truck,
  Package,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  Loader2,
} from 'lucide-react'

type Order = {
  id: string
  number?: string
  status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total?: number
  createdAt?: any
  items?: Array<{ name: string; qty: number; price: number; image?: string }>
  shippingAddress?: any
}

type Address = {
  id: string
  name?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  isDefault?: boolean
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function AccountPage() {
  const { user, loading } = useAuth()
  const { items: cartItems } = useCart()

  const [tab, setTab] = useState<'overview' | 'orders' | 'addresses' | 'security'>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrLoading, setAddrLoading] = useState(true)
  const [wishlistCount, setWishlistCount] = useState<number>(0)

  // Listen to orders for logged-in user
  useEffect(() => {
    if (!user) return
    setOrdersLoading(true)
    const qy = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const unsub = onSnapshot(qy, snap => {
      const list: Order[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setOrders(list)
      setOrdersLoading(false)
    })
    return unsub
  }, [user])

  // Fetch saved addresses
  useEffect(() => {
    if (!user) return
    setAddrLoading(true)
    const qy = query(collection(db, 'users', user.uid, 'addresses'), orderBy('isDefault', 'desc'))
    const unsub = onSnapshot(qy, snap => {
      const list: Address[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setAddresses(list)
      setAddrLoading(false)
    })
    return unsub
  }, [user])

  // Wishlist count
  useEffect(() => {
    if (!user) return
    ;(async () => {
      const w = await getDocs(collection(db, 'users', user.uid, 'wishlist'))
      setWishlistCount(w.size)
    })()
  }, [user])

  const placedCount = orders.length
  const deliveredCount = useMemo(() => orders.filter(o => o.status === 'delivered').length, [orders])
  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [orders]
  )

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading account…</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Please sign in</h1>
          <p className="text-zinc-600">You need an account to view orders & addresses.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-white via-white to-amber-50/70 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Crown className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                Welcome, {user.email ?? 'Guest'}
              </h1>
              <p className="text-sm text-zinc-600 flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </span>
                {user.phoneNumber && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {user.phoneNumber}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Package className="h-5 w-5" />} label="Orders" value={placedCount} />
          <StatCard icon={<Truck className="h-5 w-5" />} label="Delivered" value={deliveredCount} />
          <StatCard icon={<Crown className="h-5 w-5" />} label="Wishlist" value={wishlistCount} />
          <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Total Spent" value={inr.format(totalSpent)} />
        </div>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { k: 'overview', t: 'Overview' },
            { k: 'orders', t: 'Orders' },
            { k: 'addresses', t: 'Addresses' },
            { k: 'security', t: 'Security' },
          ].map(x => (
            <button
              key={x.k}
              onClick={() => setTab(x.k as any)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                tab === x.k
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white border border-zinc-200 hover:border-amber-300'
              }`}
            >
              {x.t}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Panel */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Recent Orders</h2>
            {ordersLoading ? (
              <SkeletonRows />
            ) : orders.length === 0 ? (
              <EmptyState text="No orders yet." />
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(o => (
                  <OrderRow key={o.id} o={o} />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Default Address</h2>
            {addrLoading ? (
              <SkeletonRows rows={2} />
            ) : addresses.length === 0 ? (
              <EmptyState text="No addresses saved." />
            ) : (
              <AddressCard a={addresses.find(a => a.isDefault) ?? addresses[0]} />
            )}
          </section>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-4">All Orders</h2>
          {ordersLoading ? (
            <SkeletonRows />
          ) : orders.length === 0 ? (
            <EmptyState text="No orders placed yet." />
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <OrderRow key={o.id} o={o} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Saved Addresses</h2>
          {addrLoading ? (
            <SkeletonRows rows={3} />
          ) : addresses.length === 0 ? (
            <EmptyState text="No addresses saved." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.map(a => (
                <AddressCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Security</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between rounded-xl border border-zinc-200 p-3">
              <span>
                Signed in as <strong>{user.email}</strong>
              </span>
              <button
                onClick={() => signOut(auth)}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
              >
                Sign out
              </button>
            </li>
            <li className="rounded-xl border border-zinc-200 p-3 text-zinc-600">
              Password reset, 2-factor auth, and device management can be added here later.
            </li>
          </ul>
        </section>
      )}
    </div>
  )
}

/* ---------- small components ---------- */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-amber-100 p-2">{icon}</div>
        <div>
          <div className="text-xs text-zinc-500">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ o }: { o: Order }) {
  const date = o.createdAt?.toDate ? o.createdAt.toDate() : undefined
  const hasItems = Array.isArray(o.items) && o.items.length > 0

  return (
    <Link
      href={`/account/orders/${o.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-amber-400 hover:shadow-md transition"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-zinc-500">Order #{o.number ?? o.id.slice(0, 8)}</div>
          <div className="text-sm">{date ? date.toLocaleDateString() : ''}</div>
        </div>
        <div className="text-sm">
          <span
            className={`rounded-full px-2.5 py-1 capitalize ${
              o.status === 'delivered'
                ? 'bg-emerald-100 text-emerald-700'
                : o.status === 'shipped'
                ? 'bg-blue-100 text-blue-700'
                : o.status === 'paid'
                ? 'bg-amber-100 text-amber-700'
                : o.status === 'cancelled'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            {o.status ?? 'pending'}
          </span>
        </div>
        <div className="font-semibold">{inr.format(o.total ?? 0)}</div>
      </div>

      {hasItems && (
        <div className="mt-3 text-sm text-zinc-600">
          {o.items!.slice(0, 3).map((it, idx) => (
            <span key={idx}>
              {it.name} × {it.qty}
              {idx < Math.min(2, o.items!.length - 1) ? ', ' : ''}
            </span>
          ))}
          {o.items!.length > 3 && <span> +{o.items!.length - 3} more</span>}
        </div>
      )}
    </Link>
  )
}

function AddressCard({ a }: { a: Address }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-700" />
          {a.name ?? 'Shipping Address'}
        </div>
        {a.isDefault && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
            Default
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-zinc-600">
        {[a.line1, a.line2, a.city, a.state, a.zip].filter(Boolean).join(', ')}
      </div>
      {a.phone && <div className="mt-1 text-sm text-zinc-600">📞 {a.phone}</div>}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-white/60 p-10 text-center text-zinc-600">
      {text}
    </div>
  )
}

function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-zinc-100" />
      ))}
    </div>
  )
}
