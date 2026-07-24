import { createClient } from '@/lib/supabase/server';
import OrdersClient from './orders-client';
import type { Store, Order, Product } from '@/lib/types';

export const revalidate = 0;

export default async function SellerOrdersPage() {
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

  if (!store) {
    return (
      <div className="card p-12 text-center text-gray-500">
        Buat toko untuk melihat pesanan.
      </div>
    );
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  return <OrdersClient orders={(orders as any) || []} store={store as Store} />;
}
