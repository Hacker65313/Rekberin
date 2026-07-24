'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, formatDate, cn } from '@/lib/utils';
import type { Order, OrderStatus, Product, Store } from '@/lib/types';
import { ToastProvider, useToast } from '@/components/Toast';

interface Props {
  stats: { users: number; stores: number; products: number; orders: number };
  recentOrders: (Order & { product?: Product; store?: { name: string } })[];
  recentUsers: { id: string; email: string; role: string; created_at: string }[];
  email: string;
}

const STATUS_FLOW: OrderStatus[] = ['menunggu_pembayaran', 'lunas', 'diproses', 'dikirim', 'selesai'];
const STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  lunas: 'Lunas',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
};
const STATUS_COLOR: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'bg-amber-100 text-amber-700',
  lunas: 'bg-blue-100 text-blue-700',
  diproses: 'bg-purple-100 text-purple-700',
  dikirim: 'bg-cyan-100 text-cyan-700',
  selesai: 'bg-emerald-100 text-emerald-700',
};

export default function AdminPanel({ stats, recentOrders, recentUsers, email }: Props) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50/60">
        <header className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                🛡️
              </div>
              <div>
                <h1 className="font-extrabold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
            </div>
            <Link href="/dashboard" className="btn-outline text-xs">Dashboard Saya</Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatBox icon="👥" label="Total Pengguna" value={stats.users} color="bg-blue-50 text-blue-600" />
            <StatBox icon="🏬" label="Total Toko" value={stats.stores} color="bg-brand-50 text-brand-600" />
            <StatBox icon="📦" label="Total Produk" value={stats.products} color="bg-purple-50 text-purple-600" />
            <StatBox icon="🧾" label="Total Pesanan" value={stats.orders} color="bg-emerald-50 text-emerald-600" />
          </div>

          {/* Orders management */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Kelola Status Pesanan</h2>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="card p-8 text-center text-sm text-gray-500">
                  Belum ada pesanan.
                </div>
              ) : (
                recentOrders.map((o) => (
                  <OrderRow key={o.id} order={o} />
                ))
              )}
            </div>
          </section>

          {/* Recent users */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Pengguna Terbaru</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn('badge', u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600')}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ToastProvider>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="card p-5">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl text-2xl', color)}>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function OrderRow({ order }: { order: Order & { product?: Product; store?: { name: string } } }) {
  const { push } = useToast();
  const [updating, setUpdating] = useState(false);
  const addr = order.shipping_address || ({} as any);

  const update = async (status: OrderStatus) => {
    setUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('orders').update({ status }).eq('id', order.id);
      if (error) throw error;
      push('Status diperbarui', 'success');
      window.location.reload();
    } catch (err: any) {
      push(err?.message || 'Gagal', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">
              {order.product?.name || 'Produk'} × {order.quantity}
            </span>
            <span className={cn('badge', STATUS_COLOR[order.status])}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {order.store?.name} · {formatDate(order.created_at)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            📦 {addr.receiver_name} · {addr.phone} · {addr.city}
          </p>
        </div>
        <div className="text-right">
          <div className="font-bold text-brand-600">{formatRupiah(order.total_amount)}</div>
          <div className="text-xs uppercase text-gray-400">{order.payment_method.replace('_', ' ')}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {STATUS_FLOW.map((s) => (
          <button
            key={s}
            onClick={() => update(s)}
            disabled={updating || order.status === s}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
              order.status === s
                ? STATUS_COLOR[order.status]
                : 'border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600',
              updating && 'opacity-50',
            )}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
