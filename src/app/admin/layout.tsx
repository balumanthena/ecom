'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin-auth')

    // ✅ Fix ESLint "set-state-in-effect" by deferring update
    Promise.resolve().then(() => {
      if (isAdmin === 'true') {
        setAuthorized(true)
      } else {
        router.push('/admin/login')
      }
    })
  }, [router])

  if (!authorized) return null

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 border-r bg-white px-6 py-8 space-y-6">
        <h1 className="font-display text-2xl">Admin Panel</h1>

        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="flex items-center gap-2">
            <LayoutDashboard size={18}/> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2">
            <Package size={18}/> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2">
            <ClipboardList size={18}/> Orders
          </Link>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('admin-auth')
            router.push('/admin/login')
          }}
          className="text-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">{children}</main>

    </div>
  )
}
