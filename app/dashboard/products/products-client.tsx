'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Store, Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { createClient } from '@/lib/supabase/client';

export default function ProductsClient({
  store,
  products,
}: {
  store: Store | null;
  products: Product[];
}) {
  const { push } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      push('Produk dihapus', 'success');
      window.location.reload();
    } catch (err: any) {
      push(err?.message || 'Gagal menghapus', 'error');
    }
  };

  if (!store) {
    return (
      <div className="card flex flex-col items-center justify-center p-12 text-center">
        <div className="text-5xl">🏬</div>
        <h2 className="mt-3 text-lg font-semibold text-gray-800">Buat toko dulu</h2>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Anda perlu membuat toko sebelum dapat menambahkan produk.
        </p>
        <Link href="/dashboard/store" className="btn-primary mt-4">
          Buat Toko
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produk Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total {products.length} produk di {store.name}
          </p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary text-xs">
          + Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center justify-center p-12 text-center">
          <div className="text-5xl">📦</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Belum ada produk</h2>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan produk pertama Anda untuk mulai berjualan.
          </p>
          <Link href="/dashboard/products/new" className="btn-primary mt-4">
            Tambah Produk
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.weight}g</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-brand-600">
                    {formatRupiah(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn-ghost px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="flex gap-3 p-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt="" fill className="object-cover" sizes="64px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-800">{p.name}</h3>
                  <p className="text-sm font-semibold text-brand-600">
                    {formatRupiah(p.price)}
                  </p>
                  <p className="text-xs text-gray-400">Stok: {p.stock} · {p.category}</p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="btn-ghost px-3 py-1 text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn-ghost px-3 py-1 text-xs text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
