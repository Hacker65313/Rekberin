'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, formatDate, cn } from '@/lib/utils';
import type { Store, Order, OrderStatus, Product } from '@/lib/types';
import { useToast } from '@/components/Toast';

const STATUS_FLOW: OrderStatus[] = [
  'menunggu_pembayaran',
  'lunas',
  'diproses',
  'dikirim',
  'selesai',
];

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

export default function OrdersClient({
  orders,
  store,
}: {
  orders: (Order & { product?: Product })[];
  store: Store;
}) {
  const { push } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      push('Status pesanan diperbarui', 'success');
      window.location.reload();
    } catch (err: any) {
      push(err?.message || 'Gagal', 'error');
    } finally {
      setUpdating(null);
    }
  };

  if (!orders.length) {
    return (
      <div className="card flex flex-col items-center justify-center p-12 text-center">
        <div className="text-5xl">🧾</div>
        <h2 className="mt-3 text-lg font-semibold text-gray-800">Belum ada pesanan</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pesanan masuk akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pesanan Toko</h1>
      <p className="mt-1 text-sm text-gray-500">
        {orders.length} pesanan untuk {store.name}
      </p>

      <div className="mt-6 space-y-4">
        {orders.map((o) => {
          const addr = o.shipping_address || ({} as any);
          return (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {o.product?.name || 'Produk'}
                    </span>
                    <span className={cn('badge', STATUS_COLOR[o.status])}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(o.created_at)} · {o.quantity}x
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-600">
                    {formatRupiah(o.total_amount)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">
                    {o.payment_method.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-gray-400">Penerima:</span>{' '}
                  <span className="font-medium text-gray-700">{addr.receiver_name}</span>
                </div>
                <div>
                  <span className="text-gray-400">HP:</span>{' '}
                  <span className="font-medium text-gray-700">{addr.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400">Alamat:</span>{' '}
                  <span className="font-medium text-gray-700">
                    {addr.address}, {addr.city}, {addr.province} {addr.postal_code}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="label">Ubah Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o.id, s)}
                      disabled={updating === o.id || o.status === s}
                      className={cn(
                        'rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                        o.status === s
                          ? STATUS_COLOR[o.status]
                          : 'border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600',
                        updating === o.id && 'opacity-50',
                      )}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
