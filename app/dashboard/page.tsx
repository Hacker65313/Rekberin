import { createClient } from '@/lib/supabase/server';
import OverviewClient from './overview-client';
import type { Store, Product } from '@/lib/types';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id);

  const storeIds = (stores as Store[])?.map((s) => s.id) || [];

  const { data: products } = storeIds.length
    ? await supabase
        .from('products')
        .select('*')
        .in('store_id', storeIds)
    : { data: [] };

  const { count: ordersCount } = storeIds.length
    ? await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('store_id', storeIds)
    : { count: 0 };

  return (
    <OverviewClient
      store={(stores?.[0] as Store) || null}
      productCount={products?.length || 0}
      ordersCount={ordersCount || 0}
    />
  );
}
