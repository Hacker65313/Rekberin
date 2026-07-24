import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Store, Product } from '@/lib/types';
import HomeClient from './home-client';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: stores }, { data: products }] = await Promise.all([
    supabase.from('stores').select('*').order('created_at', { ascending: false }).limit(8),
    supabase
      .from('products')
      .select('*, store:stores(slug)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return <HomeClient stores={(stores as Store[]) || []} products={(products as any) || []} />;
}
