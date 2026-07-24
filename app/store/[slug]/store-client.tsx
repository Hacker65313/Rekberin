'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Store, Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { ToastProvider } from '@/components/Toast';

export default function StoreClient({
  store,
  products,
}: {
  store: Store;
  products: Product[];
}) {
  const latestProducts = [...products].slice(0, 8);
  const waUrl = store.whatsapp
    ? `https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white">
        {/* Back link */}
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <Link href="/stores" className="btn-ghost px-3 py-1.5 text-xs">
            ← Semua Toko
          </Link>
        </div>

        {/* Banner */}
        <div className="relative mx-auto mt-2 max-w-5xl px-4">
          <div className="relative h-40 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 sm:h-56">
            {store.banner_url ? (
              <Image
                src={store.banner_url}
                alt={store.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 768px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl opacity-30">🏪</div>
            )}
          </div>

          {/* Logo overlap */}
          <div className="relative -mt-10 flex items-end gap-4 px-2">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-card sm:h-28 sm:w-28">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.name} fill className="object-cover" sizes="112px" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-bold text-brand-400">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{store.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1 text-amber-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                  </svg>
                  {store.rating?.toFixed(1) || '5.0'}
                  <span className="text-gray-400">(Demo)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-bold text-brand-600">{products.length}</span> produk
                </span>
                {store.city && <span>📍 {store.city}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mt-6 max-w-5xl px-4">
          {store.description && (
            <p className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {store.description}
            </p>
          )}
          {store.address && (
            <p className="mt-3 text-xs text-gray-400">📍 {store.address}</p>
          )}
          {store.whatsapp && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 text-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.9-2.5-1.1-4-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.7.9-2c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.6.2.3.8 1.2 1.7 2 1.1 1 2 1.3 2.3 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.3.6-.2l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.2z"/>
              </svg>
              Chat Penjual
            </a>
          )}
        </div>

        {/* Products */}
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Produk {latestProducts.length < products.length ? 'Terbaru' : 'Tersedia'}
            </h2>
            <span className="text-sm text-gray-400">{products.length} produk</span>
          </div>

          {products.length === 0 ? (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <div className="text-5xl">📦</div>
              <h3 className="mt-3 font-semibold text-gray-800">Belum ada produk</h3>
              <p className="mt-1 text-sm text-gray-500">
                Penjual belum menambahkan produk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {latestProducts.map((p) => (
                <ProductCard key={p.id} product={p} storeSlug={store.slug} />
              ))}
            </div>
          )}

          {products.length > 8 && (
            <div className="mt-6 text-center">
              <Link
                href={`/store/${store.slug}?all=1`}
                className="btn-outline"
                onClick={() => window.scrollTo({ top: 0 })}
              >
                Lihat semua produk ({products.length})
              </Link>
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
}
