"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleProvider = new GoogleAuthProvider();

  // ✅ EMAIL LOGIN (USER ONLY)
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("User profile not found.");
        return;
      }

      // 🚫 BLOCK admin logins here
      if (snap.data().role === "admin") {
        toast.error("Admin must login from admin login page.");
        return router.push("/admin/login");
      }

      document.cookie = "user-auth=true; path=/; max-age=86400";
      toast.success("Welcome back!");
      router.push("/");
    } catch {
      toast.error("Incorrect Email or Password");
    }
  };

  // ✅ GOOGLE LOGIN (USER ONLY)
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "user", // default user login
          createdAt: serverTimestamp(),
        });
      }

      // 🚫 BLOCK admin sign-in here too
      const data = (await getDoc(ref)).data();
      if (data?.role === "admin") {
        toast.error("Admins must login from admin login page.");
        return router.push("/admin/login");
      }

      document.cookie = "user-auth=true; path=/; max-age=86400";
      toast.success("Logged in successfully!");
      router.push("/");
    } catch {
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Login</h1>

      <form onSubmit={login} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl">
          Login
        </button>
      </form>

      <button
        onClick={loginWithGoogle}
        className="w-full border py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
      >
        <Image src="/google.png" width={20} height={20} alt="Google" />
        Continue with Google
      </button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
