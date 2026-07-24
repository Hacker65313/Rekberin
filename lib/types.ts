// Tipe-tipe data aplikasi (disinkron dengan skema database Supabase)

export type Role = 'buyer' | 'seller' | 'admin';

export interface Profile {
  id: string; // == auth.users.id
  email: string;
  role: Role;
  created_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  whatsapp: string | null;
  city: string | null;
  address: string | null;
  rating: number; // demo, default 5.0
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number; // gram
  category: string;
  images: string[]; // url di Supabase Storage
  created_at: string;
}

export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'lunas'
  | 'diproses'
  | 'dikirim'
  | 'selesai';

export type PaymentMethod = 'transfer_bank' | 'qris' | 'cod';

export interface ShippingAddress {
  receiver_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface Order {
  id: string;
  store_id: string;
  product_id: string;
  buyer_id: string | null;
  quantity: number;
  total_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  created_at: string;
}
