"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onSnapshot, collection } from "firebase/firestore";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "products"), (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <table className="w-full border text-sm">
        <thead className="bg-zinc-100">
          <tr>
            <th className="p-3">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-3">
                <img src={p.image} className="w-12 h-12 rounded" />
              </td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button className="text-rose-600 hover:text-rose-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
