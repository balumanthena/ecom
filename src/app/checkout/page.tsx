'use client'

import { useCart } from '@/app/providers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CheckoutPage() {
  const { items, loading, remove } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  if (loading) return <div className="py-16 text-center">Loading...</div>
  if (!items.length) return <div className="py-16 text-center">Your cart is empty.</div>

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      alert('Please fill all fields.')
      return
    }

    if (!user) {
      router.push('/auth/login')
      return
    }

    await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      items,
      name,
      phone,
      address,
      total,
      paymentMode: 'COD',
      status: 'Pending',
      createdAt: serverTimestamp(),
    })

    // Clear cart
    items.forEach(i => remove(i.id))

    router.push('/order-success')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-display">Checkout</h1>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded-xl"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border px-3 py-2 rounded-xl"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Full Address"
          className="w-full border px-3 py-2 rounded-xl"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="text-lg">Total: <strong>₹{total}</strong></div>

        <button
          onClick={placeOrder}
          className="w-full bg-black text-white py-2 rounded-xl"
        >
          Place Order (Cash On Delivery)
        </button>
      </div>
    </div>
  )
}
