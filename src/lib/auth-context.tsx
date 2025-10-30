'use client'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { auth, googleProvider, db } from './firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'

type Role = 'user'|'admin'
type Ctx = {
  user: User|null,
  role: Role|null,
  loading: boolean,
  signInGoogle: () => Promise<void>,
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<Ctx>({
  user: null, role: null, loading: true,
  signInGoogle: async () => {}, signOutUser: async () => {}
})

export function AuthProvider({ children }:{children: React.ReactNode}){
  const [user, setUser] = useState<User|null>(null)
  const [role, setRole] = useState<Role|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u)
      if(u){
        const ref = doc(db,'users',u.uid)
        const snap = await getDoc(ref)
        if(!snap.exists()){
          await setDoc(ref,{
            email: u.email ?? '',
            displayName: u.displayName ?? '',
            photoURL: u.photoURL ?? '',
            role: 'user',
            createdAt: serverTimestamp()
          })
          setRole('user')
        } else {
          setRole((snap.data().role as Role) ?? 'user')
        }
      }else{
        setRole(null)
      }
      setLoading(false)
    })
    return ()=>unsub()
  },[])

  const signInGoogle = async()=> { await signInWithPopup(auth, googleProvider) }
  const signOutUser = async()=> { await signOut(auth) }

  return <AuthContext.Provider value={{user, role, loading, signInGoogle, signOutUser}}>
    {children}
  </AuthContext.Provider>
}
export const useAuth = ()=> useContext(AuthContext)
