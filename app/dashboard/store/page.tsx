import { createClient } from '@/lib/supabase/server';
import StoreManageClient from './store-manage-client';
import StoreForm from './store-form';
import type { Store } from '@/lib/types';

export const revalidate = 0;

export default async function StorePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  // Jika belum punya toko, tampilkan form pembuatan toko
  if (!store) {
    return <StoreForm store={null} ownerId={user.id} ownerEmail={user.email || undefined} />;
  }

  // Hitung jumlah produk & pesanan toko ini
  const [{ count: productCount }, { count: ordersCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', store.id),
  ]);

  return (
    <StoreManageClient
      store={store as Store}
      productCount={productCount || 0}
      ordersCount={ordersCount || 0}
    />
  );
}
