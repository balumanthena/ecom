'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name,
        email,
        createdAt: new Date()
      })

      toast.success('Account created successfully!')
      router.push('/auth/login')
    } catch {
      toast.error('Failed to register. Try again.')
    }
  }

  return (
    <form onSubmit={register} className="max-w-sm mx-auto space-y-4 mt-12">
      <h1 className="text-2xl font-display mb-6">Create Account</h1>

      <input
        type="text"
        placeholder="Name"
        className="w-full px-3 py-2 border rounded-xl"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded-xl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded-xl"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" className="w-full bg-black text-white py-2 rounded-xl">
        Register
      </button>

      <p className="text-center text-sm">
        Already have an account? <Link href="/auth/login" className="text-blue-600">Login</Link>
      </p>
    </form>
  )
}
