import { createClient } from '@/lib/supabase/server';
import { PRODUCT_CATEGORIES } from '@/lib/types';
import type { Store } from '@/lib/types';
import HomeClient from './home-client';

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const supabase = createClient();

  // Ambil toko terbaru (selalu tampilkan di section Toko Pilihan)
  const [{ data: stores }, { data: products }] = await Promise.all([
    supabase.from('stores').select('*').order('created_at', { ascending: false }).limit(8),
    supabase
      .from('products')
      .select('*, store:stores(slug, category)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  // Filter produk berdasarkan kategori jika ada parameter cat
  // cat berupa slugified category name (mis. "elektronik")
  let filteredProducts = (products as any) || [];
  let activeCategory: string | null = null;
  if (searchParams.cat) {
    const match = PRODUCT_CATEGORIES.find(
      (c) => c.toLowerCase().replace(/[^a-z0-9]/g, '') === searchParams.cat,
    );
    if (match) {
      activeCategory = match;
      // Re-query: filter products by category dari Supabase
      const { data: catProducts } = await supabase
        .from('products')
        .select('*, store:stores(slug, category)')
        .eq('category', match)
        .order('created_at', { ascending: false })
        .limit(20);
      filteredProducts = catProducts || [];
    }
  }

  return (
    <HomeClient
      stores={(stores as Store[]) || []}
      products={filteredProducts}
      activeCategory={activeCategory}
    />
  );
}
