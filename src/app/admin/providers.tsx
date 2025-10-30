"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminContext = createContext({ user: null });

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return <AdminContext.Provider value={{ user }}>{children}</AdminContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminContext);
}
