'use client';

import { SplashProvider } from '@/components/SplashProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import Link from 'next/link';
import Image from 'next/image';
import type { Store, Product } from '@/lib/types';
import { formatRupiah, slugify } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function HomeClient({
  stores,
  products,
}: {
  stores: Store[];
  products: (Product & { store?: { slug: string } })[];
}) {
  return (
    <SplashProvider>
      <ToastProvider>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-12">
          {/* Hero */}
          <section className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-orange-50 p-6 sm:p-10 md:p-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="relative">
              <span className="badge bg-brand-100 text-brand-700">
                ✨ Belanja Aman dengan Sistem Rekber
              </span>
              <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Belanja Produk Terbaik dari{' '}
                <span className="text-brand-500">Toko Terpercaya</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm text-gray-600 sm:text-base">
                Jelajahi ribuan produk dari toko-toko pilihan. Sistem rekber
                kami memastikan setiap transaksi aman untuk pembeli dan penjual.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/stores" className="btn-primary">
                  Jelajah Toko
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/register" className="btn-outline">
                  Mulai Berjualan
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Toko Aktif', value: stores.length, icon: '🏬' },
              { label: 'Produk', value: products.length, icon: '📦' },
              { label: 'Transaksi Aman', value: '100%', icon: '🛡️' },
              { label: 'Pengguna Puas', value: '4.9★', icon: '⭐' },
            ].map((s, i) => (
              <div key={i} className="card animate-fade-in-up p-4 text-center" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-1 text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Kategori */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Kategori Populer</h2>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {[
                { name: 'Fashion', icon: '👕' },
                { name: 'Elektronik', icon: '📱' },
                { name: 'Makanan', icon: '🍜' },
                { name: 'Kesehatan', icon: '💊' },
                { name: 'Olahraga', icon: '⚽' },
                { name: 'Hobi', icon: '🎨' },
                { name: 'Otomotif', icon: '🚗' },
                { name: 'Rumah', icon: '🏠' },
              ].map((c, i) => (
                <Link
                  key={i}
                  href={`/stores?cat=${slugify(c.name)}`}
                  className="card flex flex-col items-center gap-2 p-3 transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                    {c.icon}
                  </div>
                  <span className="text-center text-xs font-medium text-gray-700">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Produk terbaru */}
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Produk Terbaru</h2>
              <Link href="/stores" className="text-sm font-medium text-brand-600 hover:underline">
                Lihat semua →
              </Link>
            </div>
            {products.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-12 text-center">
                <div className="text-5xl">🛍️</div>
                <h3 className="mt-3 text-base font-semibold text-gray-800">
                  Belum ada produk
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Jadilah penjual pertama! Mulai berjualan sekarang.
                </p>
                <Link href="/register" className="btn-primary mt-4">
                  Daftar sebagai Penjual
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    storeSlug={p.store?.slug || ''}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Toko unggulan */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Toko Pilihan</h2>
            {stores.length === 0 ? (
              <div className="card p-8 text-center text-sm text-gray-500">
                Belum ada toko terdaftar.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {stores.map((s) => (
                  <Link
                    key={s.id}
                    href={`/store/${s.slug}`}
                    className="card group flex flex-col items-center p-5 text-center transition-all hover:-translate-y-1 hover:shadow-glow"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-brand-50">
                      {s.logo_url ? (
                        <Image src={s.logo_url} alt={s.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl font-bold text-brand-400">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-gray-800">
                      {s.name}
                    </h3>
                    <p className="text-xs text-gray-400">{s.city || 'Indonesia'}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                      </svg>
                      {s.rating?.toFixed(1) || '5.0'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </ToastProvider>
    </SplashProvider>
  );
}
