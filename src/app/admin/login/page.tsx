"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists() || snap.data().role !== "admin") {
        toast.error("Not authorized as admin.");
        return;
      }

      toast.success("Admin Login Successful");
      router.replace("/admin/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
      <form onSubmit={login} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Admin Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
