import { createClient } from '@/lib/supabase/server';
import ProductForm from '../_product-form';
import { redirect } from 'next/navigation';

export default async function NewProductPage() {
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

  return <ProductForm storeId={store.id} storeSlug={store.slug} product={null} />;
}
