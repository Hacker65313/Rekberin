import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StoreClient from './store-client';
import type { Store, Product } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!store) return { title: 'Toko tidak ditemukan' };

  return {
    title: (store as Store).name,
    description: (store as Store).description || `Toko ${(store as Store).name} di Rekber Market`,
    openGraph: {
      title: (store as Store).name,
      description: (store as Store).description || '',
      images: (store as Store).banner_url ? [{ url: (store as Store).banner_url! }] : [],
    },
  };
}

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!store) notFound();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  return <StoreClient store={store as Store} products={(products as Product[]) || []} />;
}
