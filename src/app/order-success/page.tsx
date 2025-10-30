'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/providers'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { Loader2, CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  const router = useRouter()
  const { items } = useCart()
  const [loading, setLoading] = useState(true)

  const placeOrder = async () => {
    const user = auth.currentUser
    if (!user) {
      router.push('/auth/login')
      return
    }

    // ✅ Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

    // ✅ Get saved checkout address
    const address = JSON.parse(localStorage.getItem('checkout-address') || '{}')

    await addDoc(collection(db, 'orders'), {
      userId: user.uid,              // ✅ Needed for account page
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        image: i.image,
      })),
      total,
      address,
      paymentMode: 'COD',            // ✅ Change if you use online payments later
      status: 'paid',
      createdAt: serverTimestamp(),
      number: Math.random().toString(36).slice(2, 10).toUpperCase(),
    })

    // ✅ Clear cart
    for (const it of items) {
      await deleteDoc(doc(db, 'users', user.uid, 'cart', it.id))
    }

    // ✅ Clean stored address data
    localStorage.removeItem('checkout-address')

    setLoading(false)
  }

  useEffect(() => {
    if (items.length > 0) {
      placeOrder()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <CheckCircle className="h-14 w-14 text-emerald-600" />
      <h1 className="text-2xl font-semibold">Order Placed Successfully 🎉</h1>
      <p className="text-zinc-600">Thank you for shopping with Royal Jewels.</p>

      <button
        onClick={() => router.push('/account')}
        className="mt-4 rounded-xl bg-amber-600 text-white px-6 py-2 hover:bg-amber-700 transition"
      >
        View My Orders
      </button>
    </div>
  )
}
