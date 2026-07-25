'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/types';

export default function StoreManageClient({
  store,
  productCount,
  ordersCount,
}: {
  store: Store | null;
  productCount: number;
  ordersCount: number;
}) {
  const router = useRouter();
  const { push } = useToast();

  if (!store) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Toko Saya</h1>
        <p className="mt-1 text-sm text-gray-500">
          Anda belum memiliki toko. Buat toko untuk mulai berjualan.
        </p>
        <Link href="/dashboard/store/create" className="btn-primary mt-6 inline-block">
          + Buat Toko Baru
        </Link>
      </div>
    );
  }

  const deleteStore = async () => {
    if (!confirm(`Hapus toko "${store.name}"? Produk terkait juga akan hilang.`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('stores').delete().eq('id', store.id);
      if (error) throw error;
      push('Toko dihapus', 'success');
      router.refresh();
    } catch (err: any) {
      push(err?.message || 'Gagal menghapus toko', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toko Saya</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola toko Anda dari menu di bawah.</p>
        </div>
        <Link
          href={`/store/${store.slug}`}
          target="_blank"
          className="btn-outline text-xs"
        >
          Lihat Toko ↗
        </Link>
      </div>

      {/* Toko info card */}
      <div className="mt-6 card overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-brand-400 to-brand-600">
          {store.banner_url && (
            <Image src={store.banner_url} alt={store.name} fill className="object-cover" sizes="100vw" />
          )}
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-card">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-bold text-brand-400">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-gray-900">{store.name}</h2>
              <p className="text-xs text-gray-500">
                {store.category} · {store.city || 'Indonesia'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-lg font-bold text-gray-900">{productCount}</div>
              <div className="text-xs text-gray-500">Produk</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-lg font-bold text-gray-900">{ordersCount}</div>
              <div className="text-xs text-gray-500">Pesanan</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-lg font-bold text-amber-500">{store.rating?.toFixed(1) || '5.0'}</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu edit terpisah */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/store/name" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">✏️ Edit Nama Toko</h3>
            <p className="text-sm text-gray-500">Ubah nama toko Anda</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
        <Link href="/dashboard/store/info" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">📝 Edit Informasi Toko</h3>
            <p className="text-sm text-gray-500">Deskripsi, logo, banner, kontak, kategori, pembayaran</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
        <Link href="/dashboard/products" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">📦 Edit Produk</h3>
            <p className="text-sm text-gray-500">Tambah, ubah, hapus produk</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
        <Link href={`/store/${store.slug}`} target="_blank" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">👁️ Lihat Toko Publik</h3>
            <p className="text-sm text-gray-500">Lihat halaman toko Anda seperti pembeli</p>
          </div>
          <span className="text-2xl">↗</span>
        </Link>
      </div>

      <div className="mt-6">
        <button onClick={deleteStore} className="btn-outline text-sm text-red-600 hover:bg-red-50">
          Hapus Toko
        </button>
      </div>
    </div>
  );
}
