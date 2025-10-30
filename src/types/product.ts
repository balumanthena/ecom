/* ✅ Product Type */
import { Timestamp } from 'firebase/firestore'

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  images: string[];
  createdAt?: Timestamp | null;
}
