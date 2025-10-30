'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { Menu, X, ShoppingBag, Heart, User } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/10">
      <div className="container-px flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="font-display text-2xl tracking-wide">
          Royal<span className="text-royal-600">Jewels</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/shop" className="hover:text-royal-600">Shop</Link>
          <Link href="/about" className="hover:text-royal-600">About</Link>
          <Link href="/contact" className="hover:text-royal-600">Contact</Link>

          {user ? (
            <>
              <Link href="/wishlist" className="flex items-center gap-1 hover:text-royal-600">
                <Heart size={18}/> Wishlist
              </Link>

              <Link href="/cart" className="flex items-center gap-1 hover:text-royal-600">
                <ShoppingBag size={18}/> Cart
              </Link>

              <Link href="/account" className="flex items-center gap-1 hover:text-royal-600">
                <User size={18}/> Account
              </Link>

              <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
                Logout
              </button>
            </>
          ) : (
            // ✅ FIXED LOGIN LINK
            <Link href="/auth/login" className="bg-black text-white px-4 py-2 rounded-xl">
              Login / Create Account
            </Link>
          )}
        </nav>

        {/* Mobile Burger */}
        <button onClick={() => setOpen(true)} className="md:hidden">
          <Menu size={24}/>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white p-6 shadow-lg"
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-xl">Menu</span>
              <button onClick={()=>setOpen(false)}><X size={24}/></button>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="/shop" onClick={()=>setOpen(false)}>Shop</Link>
              <Link href="/about" onClick={()=>setOpen(false)}>About</Link>
              <Link href="/contact" onClick={()=>setOpen(false)}>Contact</Link>

              {user ? (
                <>
                  <Link href="/wishlist" onClick={()=>setOpen(false)}>Wishlist</Link>
                  <Link href="/cart" onClick={()=>setOpen(false)}>Cart</Link>
                  <Link href="/account" onClick={()=>setOpen(false)}>Account</Link>
                  <button
                    onClick={handleLogout}
                    className="mt-3 text-red-600"
                  >Logout</button>
                </>
              ) : (
                // ✅ FIXED LOGIN LINK (MOBILE)
                <Link href="/auth/login" onClick={()=>setOpen(false)} className="bg-black text-white px-4 py-2 rounded-xl text-center">
                  Login / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
