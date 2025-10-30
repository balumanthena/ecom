"use client";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, orders: 0, users: 0 });

  useEffect(() => {
    (async () => {
      const p = await getCountFromServer(collection(db, "products"));
      const o = await getCountFromServer(collection(db, "orders"));
      const u = await getCountFromServer(collection(db, "users"));
      setCounts({ products: p.data().count, orders: o.data().count, users: u.data().count });
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card label="Products" value={counts.products} />
        <Card label="Orders" value={counts.orders} />
        <Card label="Users" value={counts.users} />
      </div>
    </div>
  );
}

function Card({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow border">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-3xl font-semibold text-amber-700">{value}</div>
    </div>
  );
}
