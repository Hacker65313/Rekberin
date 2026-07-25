import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PRODUCT_CATEGORIES } from '@/lib/types';
import StoresClient from './stores-client';
import type { Store } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Jelajah Toko',
  description: 'Jelajahi semua toko terpercaya di Rekber Market.',
};

export const revalidate = 60;

export default async function StoresPage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string };
}) {
  const supabase = createClient();
  let query = supabase.from('stores').select('*').order('created_at', { ascending: false });

  // Filter berdasarkan kategori (cat = slugified category name)
  let activeCategory: string | null = null;
  if (searchParams.cat) {
    const match = PRODUCT_CATEGORIES.find(
      (c) => c.toLowerCase().replace(/[^a-z0-9]/g, '') === searchParams.cat,
    );
    if (match) {
      activeCategory = match;
      query = query.eq('category', match);
    }
  }

  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%`);
  }

  const { data: stores } = await query;
  return (
    <StoresClient
      stores={(stores as Store[]) || []}
      initialQuery={searchParams.q || ''}
      activeCategory={activeCategory}
    />
  );
}
