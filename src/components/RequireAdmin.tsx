'use client'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'


export default function RequireAdmin({ children }:{children: React.ReactNode}){
const { loading, role } = useAuth()
if(loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin mr-2"/>Loading...</div>
if(role !== 'admin') return <div className="py-24 text-center">Access denied. Admins only.</div>
return <>{children}</>
}