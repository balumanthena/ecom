"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onSnapshot, collection } from "firebase/firestore";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "orders"), (snap) =>
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="border rounded-xl p-4 bg-white shadow">
            <div className="text-lg font-medium">Order #{o.id.slice(0, 8)}</div>
            <div className="text-sm text-zinc-600">₹{o.total} — {o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
