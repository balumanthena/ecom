'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  getDocs,
  where,
} from 'firebase/firestore'

/* AUTH CONTEXT */
type AuthCtx = { user: User | null; loading: boolean }
const AuthContext = createContext<AuthCtx>({ user: null, loading: true })
export const useAuth = () => useContext(AuthContext)

/* CART TYPES */
export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  qty: number
  image: string
}

type CartCtx = {
  items: CartItem[]
  loading: boolean
  add: (p: { id: string; name: string; price: number; image?: string }) => Promise<void>
  inc: (id: string) => Promise<void>
  dec: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

const CartContext = createContext<CartCtx>({
  items: [],
  loading: true,
  add: async () => {},
  inc: async () => {},
  dec: async () => {},
  remove: async () => {},
})

export const useCart = () => useContext(CartContext)

/* ROOT PROVIDER */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <CartProvider user={user}>{children}</CartProvider>
    </AuthContext.Provider>
  )
}

/* CART PROVIDER */
function CartProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setItems([])
        setLoading(false)
      })
      return
    }

    // ✅ FIX: Avoid direct setState — wrap in microtask
    Promise.resolve().then(() => setLoading(true))

    const q = query(collection(db, 'users', user.uid, 'cart'))
    const unsub = onSnapshot(q, (snap) => {
      const cartData = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          productId: data.productId ?? '',
          name: data.name ?? '',
          price: data.price ?? 0,
          qty: data.qty ?? 1,
          image: data.image ?? '/placeholder.png',
        } as CartItem
      })
      setItems(cartData)
      setLoading(false)
    })

    return unsub
  }, [user])

  const add = useCallback(async (p: { id: string; name: string; price: number; image?: string }) => {
    if (!user) return
    const cartRef = collection(db, 'users', user.uid, 'cart')
    const match = await getDocs(query(cartRef, where('productId', '==', p.id)))
    if (!match.empty) {
      await updateDoc(doc(db, 'users', user.uid, 'cart', match.docs[0].id), { qty: increment(1) })
      return
    }
    await setDoc(doc(cartRef), { productId: p.id, name: p.name, price: p.price, qty: 1, image: p.image ?? '' })
  }, [user])

  const inc = useCallback(async (id: string) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'cart', id), { qty: increment(1) })
  }, [user])

  const dec = useCallback(async (id: string) => {
    if (!user) return
    const item = items.find((i) => i.id === id)
    if (!item) return
    if (item.qty <= 1) return deleteDoc(doc(db, 'users', user.uid, 'cart', id))
    await updateDoc(doc(db, 'users', user.uid, 'cart', id), { qty: increment(-1) })
  }, [user, items])

  const remove = useCallback(async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'cart', id))
  }, [user])

  const value = useMemo(() => ({ items, loading, add, inc, dec, remove }), [
    items,
    loading,
    add,
    inc,
    dec,
    remove,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
