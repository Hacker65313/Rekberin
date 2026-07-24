import { createClient } from '@/lib/supabase/server';
import ProductForm from '../_product-form';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!store) redirect('/dashboard/store');

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('store_id', store.id)
    .maybeSingle();

  if (!product) redirect('/dashboard/products');

  return <ProductForm storeId={store.id} storeSlug={store.slug} product={product as Product} />;
}
