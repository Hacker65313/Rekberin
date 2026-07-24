import { createClient } from '@/lib/supabase/server';
import ProductsClient from './products-client';
import type { Store, Product } from '@/lib/types';

export const revalidate = 0;

export default async function ProductsPage() {
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

  const storeId = (store as Store)?.id;

  const { data: products } = storeId
    ? await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
    : { data: [] };

  return <ProductsClient store={(store as Store) || null} products={(products as Product[]) || []} />;
}
