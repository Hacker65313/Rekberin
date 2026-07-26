'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, formatDate, cn } from '@/lib/utils';
import type { Store, Order, OrderStatus, Product, PaymentMethod } from '@/lib/types';
import { useToast } from '@/components/Toast';

// Alur status berbeda untuk COD vs Transfer/QRIS:
//  - COD:                menunggu_konfirmasi_seller → diproses → dikirim → selesai
//  - Transfer Bank/QRIS: menunggu_pembayaran → pembayaran_dikonfirmasi → diproses → dikirim → selesai
const STATUS_FLOW_COD: OrderStatus[] = [
  'menunggu_konfirmasi_seller',
  'diproses',
  'dikirim',
  'selesai',
];

const STATUS_FLOW_TRANSFER: OrderStatus[] = [
  'menunggu_pembayaran',
  'pembayaran_dikonfirmasi',
  'diproses',
  'dikirim',
  'selesai',
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  pembayaran_dikonfirmasi: 'Pembayaran Dikonfirmasi',
  menunggu_konfirmasi_seller: 'Menunggu Konfirmasi Seller',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'bg-amber-100 text-amber-700',
  pembayaran_dikonfirmasi: 'bg-blue-100 text-blue-700',
  menunggu_konfirmasi_seller: 'bg-amber-100 text-amber-700',
  diproses: 'bg-purple-100 text-purple-700',
  dikirim: 'bg-cyan-100 text-cyan-700',
  selesai: 'bg-emerald-100 text-emerald-700',
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  transfer_bank: 'Transfer Bank',
  qris: 'QRIS',
  cod: 'COD (Bayar di Tempat)',
};

function statusFlowFor(method: string): OrderStatus[] {
  return method === 'cod' ? STATUS_FLOW_COD : STATUS_FLOW_TRANSFER;
}

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
          const flow = statusFlowFor(o.payment_method);
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
                  <div className="text-xs text-gray-400">
                    {PAYMENT_LABEL[o.payment_method as PaymentMethod] || o.payment_method}
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
                    {addr.address}, {addr.district}, {addr.city}, {addr.province} {addr.postal_code}
                  </span>
                </div>
                {o.shipping_courier && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-400">Kurir:</span>{' '}
                    <span className="font-medium text-gray-700 uppercase">{o.shipping_courier}</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="label">Ubah Status</label>
                <div className="flex flex-wrap gap-2">
                  {flow.map((s) => (
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
                <p className="mt-2 text-xs text-gray-400">
                  {o.payment_method === 'cod'
                    ? 'Alur COD: konfirmasi pesanan → diproses → dikirim → selesai.'
                    : 'Alur Transfer/QRIS: konfirmasi pembayaran → diproses → dikirim → selesai.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
