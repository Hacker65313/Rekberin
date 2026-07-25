'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Store, Product } from '@/lib/types';
import { formatRupiah, cn } from '@/lib/utils';
import { ToastProvider, useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';

export default function ProductDetailClient({
  store,
  product,
  related,
}: {
  store: Store;
  product: Product;
  related: Product[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const images = product.images?.length ? product.images : [];
  const waUrl = store.whatsapp
    ? `https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Halo ${store.name}, saya tertarik dengan produk: ${product.name}`,
      )}`
    : '#';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Link href={`/store/${store.slug}`} className="btn-ghost px-3 py-1.5 text-xs">
            ← Kembali ke {store.name}
          </Link>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-12 md:grid-cols-2">
          {/* Image slider */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 shadow-card">
              {images.length ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[activeImg]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-gray-200">
                  📦
                </div>
              )}

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card"
                    aria-label="Sebelumnya"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card"
                    aria-label="Berikutnya"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                      activeImg === i ? 'border-brand-500' : 'border-transparent opacity-60',
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-4">
            <div>
              <span className="badge bg-brand-50 text-brand-600">
                {product.category}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-amber-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                  </svg>
                  4.9
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  Terjual di {store.name}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-brand-50/60 p-5">
              <div className="text-sm text-gray-500">Harga</div>
              <div className="mt-1 text-3xl font-extrabold text-brand-600">
                {formatRupiah(product.price)}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <span className="text-gray-600">
                  Stok: <span className={product.stock > 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-500'}>
                    {product.stock}
                  </span>
                </span>
                <span className="text-gray-600">
                  Berat: <span className="font-semibold">{product.weight}g</span>
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Deskripsi</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="sticky bottom-0 mt-4 flex gap-3 bg-white/80 py-3 backdrop-blur-md">
              <button
                onClick={() => setCheckoutOpen(true)}
                disabled={product.stock === 0}
                className="btn-primary flex-1"
              >
                {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
              </button>
              {store.whatsapp && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
                    <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.9-2.5-1.1-4-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.7.9-2c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.6.2.3.8 1.2 1.7 2 1.1 1 2 1.3 2.3 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.3.6-.2l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.2z"/>
                  </svg>
                  Chat
                </a>
              )}
            </div>

            {/* Store info mini */}
            <div className="rounded-2xl border border-gray-100 p-4">
              <Link href={`/store/${store.slug}`} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-brand-50">
                  {store.logo_url ? (
                    <Image src={store.logo_url} alt={store.name} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg font-bold text-brand-400">
                      {store.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{store.name}</div>
                  <div className="text-xs text-gray-400">{store.city}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto max-w-5xl px-4 pb-12">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Produk Lainnya</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} storeSlug={store.slug} />
              ))}
            </div>
          </div>
        )}

        {/* Checkout modal */}
        <AnimatePresence>
          {checkoutOpen && (
            <CheckoutModal
              store={store}
              product={product}
              onClose={() => setCheckoutOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}
