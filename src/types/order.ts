export type OrderItem = {
    productId: string;
    price: number;
    qty: number;
  }
  
  export type OrderAddress = {
    name: string;
    line1: string;
    city: string;
    pincode: string;
    state: string;
    phone: string;
  }
  
  export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  
  export type Order = {
    id: string;
    total: number;
    status: OrderStatus;
    userId: string;
    items: OrderItem[];
    address?: OrderAddress;
  }
  