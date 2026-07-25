// Tipe-tipe data aplikasi (disinkron dengan skema database Supabase v2)

export type Role = 'buyer' | 'seller' | 'admin';

export interface Profile {
  id: string; // == auth.users.id
  email: string;
  role: Role;
  created_at: string;
}

export type StoreCategory =
  | 'Fashion'
  | 'Elektronik'
  | 'Makanan'
  | 'Kesehatan'
  | 'Olahraga'
  | 'Hobi'
  | 'Otomotif'
  | 'Rumah'
  | 'Kecantikan'
  | 'Lainnya';

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
  category: string;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  ewallet_name: string | null;
  ewallet_number: string | null;
  rating: number;
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

export type ShippingCourier =
  | 'jne'
  | 'jnt'
  | 'jnt_cargo'
  | 'sicepat'
  | 'pos'
  | 'ninja'
  | 'anteraja'
  | 'lion'
  | 'sap'
  | 'tiki';

export interface ShippingAddress {
  receiver_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  district: string;
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
  shipping_courier: string | null;
  shipping_cost: number;
  admin_fee: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  created_at: string;
}

// Konstanta untuk dropdown
export const PRODUCT_CATEGORIES: StoreCategory[] = [
  'Fashion',
  'Elektronik',
  'Makanan',
  'Kesehatan',
  'Olahraga',
  'Hobi',
  'Otomotif',
  'Rumah',
  'Kecantikan',
  'Lainnya',
];

export const BANKS = [
  'BCA', 'BRI', 'BNI', 'Mandiri', 'CIMB Niaga', 'BTN', 'Permata', 'BSI',
];

export const EWALLETS = [
  'DANA', 'OVO', 'GoPay', 'ShopeePay', 'LinkAja',
];

export interface CourierInfo {
  id: ShippingCourier;
  name: string;
  icon: string;
}

export const COURIERS: CourierInfo[] = [
  { id: 'jne', name: 'JNE', icon: '📦' },
  { id: 'jnt', name: 'J&T Express', icon: '🚚' },
  { id: 'jnt_cargo', name: 'J&T Cargo', icon: '🚛' },
  { id: 'sicepat', name: 'SiCepat', icon: '✈️' },
  { id: 'pos', name: 'POS Indonesia', icon: '📮' },
  { id: 'ninja', name: 'Ninja Express', icon: '🥷' },
  { id: 'anteraja', name: 'AnterAja', icon: '🏃' },
  { id: 'lion', name: 'Lion Parcel', icon: '🦁' },
  { id: 'sap', name: 'SAP Express', icon: '⚡' },
  { id: 'tiki', name: 'TIKI', icon: '📭' },
];
