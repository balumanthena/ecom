"use client";
import { db } from "@/lib/firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) =>
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Users</h1>
      <ul className="space-y-3">
        {users.map(u => (
          <li key={u.id} className="border p-3 rounded-xl bg-white shadow">
            {u.name ?? "Unnamed"} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
