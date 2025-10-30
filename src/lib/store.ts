import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'

/* ---------------------- PRODUCT ---------------------- */
export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  active: boolean
  images: string[]
  createdAt?: Timestamp | null
}

/* ✅ LISTEN PRODUCTS (Homepage + Shop Page) */
export function listenProducts(setProducts: (items: Product[]) => void) {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    const items: Product[] = []
    snap.forEach(d => items.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }))
    setProducts(items)
  })
}

/* ---------------------- CART ---------------------- */
export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  qty: number
  image?: string
}

export function listenCart(userId: string, setCart: (items: CartItem[]) => void) {
  const col = collection(db, 'users', userId, 'cart')

  return onSnapshot(col, async snap => {
    const items: CartItem[] = []

    for (const docSnap of snap.docs) {
      const productId = docSnap.id
      const qty = docSnap.data().qty || 1

      const pSnap = await getDoc(doc(db, 'products', productId))
      if (!pSnap.exists()) continue

      const p = pSnap.data() as Product

      items.push({
        id: productId,
        productId,
        qty,
        name: p.name,
        price: p.price,
        image: p.images?.[0]
      })
    }

    setCart(items)
  })
}

export async function addToCart(userId: string, productId: string, qty: number) {
  const ref = doc(db, 'users', userId, 'cart', productId)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const prev = snap.data().qty || 1
    return updateDoc(ref, { qty: prev + qty })
  }
  return setDoc(ref, { qty })
}

export async function updateCartQty(userId: string, productId: string, qty: number) {
  return updateDoc(doc(db, 'users', userId, 'cart', productId), { qty })
}

export async function removeFromCart(userId: string, productId: string) {
  return deleteDoc(doc(db, 'users', userId, 'cart', productId))
}

/* ---------------------- WISHLIST ---------------------- */
export function listenWishlist(userId: string, setIds: (ids: string[]) => void) {
  const col = collection(db, 'users', userId, 'wishlist')
  return onSnapshot(col, snap => {
    const ids: string[] = []
    snap.forEach(d => ids.push(d.id))
    setIds(ids)
  })
}

export async function toggleWishlist(userId: string, productId: string) {
  const ref = doc(db, 'users', userId, 'wishlist', productId)
  const snap = await getDoc(ref)

  if (snap.exists()) return deleteDoc(ref)
  return setDoc(ref, { createdAt: serverTimestamp() })
}

/* ---------------------- ORDERS ---------------------- */
export type OrderItem = {
  productId: string
  qty: number
  name: string
  price: number
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt?: Timestamp | null
  address: {
    name: string
    line1: string
    city: string
    pincode: string
    state: string
    phone: string
  }
}

export function listenOrders(userId: string | undefined, setOrders: (orders: Order[]) => void) {
  const base = collection(db, 'orders')
  const q = userId
    ? query(base, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    : query(base, orderBy('createdAt', 'desc'))

  return onSnapshot(q, snap => {
    const orders: Order[] = []
    snap.forEach(d => orders.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }))
    setOrders(orders)
  })
}

export async function placeOrder(
  userId: string,
  items: OrderItem[],
  total: number,
  address: Order['address']
) {
  return addDoc(collection(db, 'orders'), {
    userId,
    items,
    total,
    status: 'pending',
    createdAt: serverTimestamp(),
    address
  })
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  return updateDoc(doc(db, 'orders', orderId), { status })
}
