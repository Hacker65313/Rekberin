import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductDetailClient from './product-detail-client';
import type { Store, Product } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string; productId: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.productId)
    .maybeSingle();

  if (!product) return { title: 'Produk tidak ditemukan' };

  return {
    title: (product as Product).name,
    description: (product as Product).description || '',
    openGraph: {
      title: (product as Product).name,
      description: (product as Product).description || '',
      images: (product as Product).images || [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  const supabase = createClient();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();
  if (!store) notFound();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.productId)
    .eq('store_id', store.id)
    .maybeSingle();
  if (!product) notFound();

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .neq('id', product.id)
    .limit(4);

  return (
    <ProductDetailClient
      store={store as Store}
      product={product as Product}
      related={(related as Product[]) || []}
    />
  );
}
