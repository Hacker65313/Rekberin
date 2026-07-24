'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Store } from '@/lib/types';
import { StoreCardSkeleton } from '@/components/Skeleton';
import { createClient } from '@/lib/supabase/client';

export default function StoresClient({
  stores,
  initialQuery,
}: {
  stores: Store[];
  initialQuery: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    router.push(`/stores?${params.toString()}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/60">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 100 100" className="h-5 w-5" fill="none">
                <path
                  d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
                  stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="68" cy="64" r="9" fill="white" />
              </svg>
            </div>
            <span className="font-extrabold">
              Rekber<span className="text-brand-500">Market</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Jelajah Toko</h1>
        <p className="mt-1 text-sm text-gray-500">
          Temukan {stores.length} toko terpercaya di Rekber Market.
        </p>

        <form onSubmit={onSearch} className="mt-4 flex gap-2">
          <input
            className="input flex-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama toko atau kota..."
          />
          <button type="submit" className="btn-primary">Cari</button>
        </form>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <StoreCardSkeleton key={i} />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <div className="text-5xl">🔍</div>
              <h2 className="mt-3 text-lg font-semibold text-gray-800">
                Tidak ada toko ditemukan
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Coba kata kunci lain atau jadilah penjual pertama.
              </p>
              <Link href="/register" className="btn-primary mt-4">Daftar</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {stores.map((s) => (
                <Link
                  key={s.id}
                  href={`/store/${s.slug}`}
                  className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-50">
                    {s.logo_url ? (
                      <Image src={s.logo_url} alt={s.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl font-bold text-brand-400">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-800">{s.name}</h3>
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {s.description || s.city || 'Toko terpercaya'}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                      </svg>
                      {s.rating?.toFixed(1) || '5.0'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
