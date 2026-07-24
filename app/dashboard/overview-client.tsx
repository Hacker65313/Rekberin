'use client';

import Link from 'next/link';
import type { Store } from '@/lib/types';

export default function OverviewClient({
  store,
  productCount,
  ordersCount,
}: {
  store: Store | null;
  productCount: number;
  ordersCount: number;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Selamat datang kembali, kelola toko & produk Anda di sini.
      </p>

      {/* Greeting card */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white shadow-card">
        <h2 className="text-xl font-bold">
          {store ? `Halo, ${store.name}! 🎉` : 'Mulai Berjualan Sekarang!'}
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/90">
          {store
            ? 'Toko Anda sudah aktif. Tambah produk dan bagikan link toko Anda ke pembeli.'
            : 'Buat toko pertama Anda dan mulai jualan online dalam hitungan menit.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {!store && (
            <Link href="/dashboard/store" className="btn bg-white text-brand-600 hover:bg-white/90">
              Buat Toko
            </Link>
          )}
          {store && (
            <Link href="/dashboard/products/new" className="btn bg-white text-brand-600 hover:bg-white/90">
              Tambah Produk
            </Link>
          )}
          {store && (
            <Link
              href={`/store/${store.slug}`}
              target="_blank"
              className="btn border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Lihat Toko Publik ↗
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Toko" value={store ? '1' : '0'} icon="🏬" tone="brand" />
        <StatCard label="Produk" value={String(productCount)} icon="📦" tone="blue" />
        <StatCard label="Pesanan" value={String(ordersCount)} icon="🧾" tone="green" />
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/store" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">Kelola Toko</h3>
            <p className="text-sm text-gray-500">Ubah nama, logo, deskripsi toko</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
        <Link href="/dashboard/products" className="card flex items-center justify-between p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
          <div>
            <h3 className="font-semibold text-gray-800">Kelola Produk</h3>
            <p className="text-sm text-gray-500">Tambah, edit, hapus produk</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone: 'brand' | 'blue' | 'green';
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="card p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${tones[tone]}`}>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
