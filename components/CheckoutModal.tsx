'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Store, Product, ShippingAddress, PaymentMethod, OrderStatus } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

type Step = 'form' | 'summary' | 'payment' | 'success';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'transfer_bank', label: 'Transfer Bank', icon: '🏦', desc: 'BCA / Mandiri / BNI / BRI' },
  { id: 'qris', label: 'QRIS', icon: '📱', desc: 'Scan & bayar via QRIS' },
  { id: 'cod', label: 'COD', icon: '🚚', desc: 'Bayar di tempat (COD)' },
];

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'Bali', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Sumatera Selatan',
  'Lampung', 'Kalimantan Timur', 'Kalimantan Barat', 'Sulawesi Utara',
  'Sulawesi Selatan', 'Papua', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Lainnya',
];

const empty: ShippingAddress = {
  receiver_name: '',
  phone: '',
  address: '',
  city: '',
  province: 'DKI Jakarta',
  postal_code: '',
};

export default function CheckoutModal({
  store,
  product,
  onClose,
}: {
  store: Store;
  product: Product;
  onClose: () => void;
}) {
  const { push } = useToast();
  const [step, setStep] = useState<Step>('form');
  const [addr, setAddr] = useState<ShippingAddress>(empty);
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<PaymentMethod>('transfer_bank');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = product.price * qty;

  const update =
    (k: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setAddr((a) => ({ ...a, [k]: e.target.value }));

  const validateForm = (): boolean => {
    if (!addr.receiver_name.trim()) { push('Nama penerima wajib diisi', 'error'); return false; }
    if (!/^[0-9+\-\s]{8,15}$/.test(addr.phone)) { push('Nomor HP tidak valid', 'error'); return false; }
    if (!addr.address.trim()) { push('Alamat wajib diisi', 'error'); return false; }
    if (!addr.city.trim()) { push('Kota wajib diisi', 'error'); return false; }
    if (!addr.postal_code.trim()) { push('Kode pos wajib diisi', 'error'); return false; }
    return true;
  };

  const goToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setStep('summary');
  };

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      // Ambil user bila login (guest checkout tetap diperbolehkan)
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('orders')
        .insert({
          store_id: store.id,
          product_id: product.id,
          buyer_id: user?.id || null,
          quantity: qty,
          total_amount: total,
          payment_method: method,
          status: 'menunggu_pembayaran' as OrderStatus,
          shipping_address: addr,
        })
        .select()
        .single();

      if (error) throw error;
      setOrderId(data.id);

      // Kirim notifikasi Telegram (no password)
      try {
        await fetch('/api/notify/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeName: store.name,
            productName: product.name,
            amount: total,
            status: 'menunggu_pembayaran',
          }),
        });
      } catch {
        // opsional, jangan blokir
      }

      setStep('success');
      push('Pesanan dibuat!', 'success');
    } catch (err: any) {
      push(err?.message || 'Gagal membuat pesanan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-card sm:rounded-3xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {step === 'form' && 'Checkout'}
            {step === 'summary' && 'Ringkasan Pesanan'}
            {step === 'payment' && 'Pembayaran (Demo)'}
            {step === 'success' && 'Pesanan Dibuat!'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Product mini */}
        {step !== 'success' && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
              {product.images?.[0] ? (
                <Image src={product.images[0]} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">📦</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-800">{product.name}</h3>
              <p className="text-xs text-gray-500">{formatRupiah(product.price)} × {qty}</p>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-brand-600">{formatRupiah(total)}</div>
            </div>
          </div>
        )}

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="mb-5 flex items-center gap-2 text-xs">
            {['form', 'summary', 'payment'].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    ['form', 'summary', 'payment'].indexOf(step) >= i
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-200 text-gray-400',
                  )}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="h-0.5 flex-1 bg-gray-200" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Form */}
        {step === 'form' && (
          <form onSubmit={goToSummary} className="space-y-3">
            <div>
              <label className="label">Nama Penerima</label>
              <input className="input" value={addr.receiver_name} onChange={update('receiver_name')} placeholder="Nama lengkap penerima" required />
            </div>
            <div>
              <label className="label">Nomor HP</label>
              <input className="input" value={addr.phone} onChange={update('phone')} placeholder="08xxxxxxxxxx" required />
            </div>
            <div>
              <label className="label">Alamat Lengkap</label>
              <textarea className="input min-h-20" value={addr.address} onChange={update('address')} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Kota</label>
                <input className="input" value={addr.city} onChange={update('city')} placeholder="Jakarta Selatan" required />
              </div>
              <div>
                <label className="label">Kode Pos</label>
                <input className="input" value={addr.postal_code} onChange={update('postal_code')} placeholder="12345" required />
              </div>
            </div>
            <div>
              <label className="label">Provinsi</label>
              <select className="input" value={addr.province} onChange={update('province')}>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Jumlah</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg"
                >−</button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg"
                >+</button>
                <span className="ml-2 text-xs text-gray-400">stok: {product.stock}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Lanjut ke Ringkasan</button>
          </form>
        )}

        {/* STEP 2: Summary */}
        {step === 'summary' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gray-50 p-4 text-sm">
              <h3 className="mb-2 font-semibold text-gray-800">Alamat Pengiriman</h3>
              <p className="text-gray-600">{addr.receiver_name}</p>
              <p className="text-gray-600">{addr.phone}</p>
              <p className="text-gray-600">{addr.address}</p>
              <p className="text-gray-600">{addr.city}, {addr.province} {addr.postal_code}</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-gray-100 p-4 text-sm">
              <Row label={`Subtotal (${qty}x)`} value={formatRupiah(total)} />
              <Row label="Ongkir" value="Gratis (Demo)" />
              <div className="border-t border-gray-100 pt-2">
                <Row label="Total" value={formatRupiah(total)} bold />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="btn-outline flex-1">Kembali</button>
              <button onClick={() => setStep('payment')} className="btn-primary flex-1">Lanjut Bayar</button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">Pilih metode pembayaran (simulasi):</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                    method === m.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{m.label}</div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                  <div className={cn('h-5 w-5 rounded-full border-2', method === m.id ? 'border-brand-500 bg-brand-500' : 'border-gray-300')}>
                    {method === m.id && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-full w-full p-0.5">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-brand-50 p-4 text-center">
              <div className="text-xs text-gray-500">Total Pembayaran</div>
              <div className="text-2xl font-bold text-brand-600">{formatRupiah(total)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('summary')} className="btn-outline flex-1">Kembali</button>
              <button onClick={placeOrder} disabled={submitting} className="btn-primary flex-1">
                {submitting ? (
                  <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.2-8.5" />
                  </svg>
                ) : 'Bayar Sekarang'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </motion.div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Pesanan Dibuat!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Status pesanan: <span className="font-semibold text-amber-600">Menunggu Pembayaran</span>
            </p>
            {orderId && (
              <p className="mt-2 text-xs text-gray-400">ID: <code>{orderId.slice(0, 8)}</code></p>
            )}
            <p className="mt-3 max-w-xs text-xs text-gray-400">
              Penjual akan memproses pesanan Anda. Status akan berubah menjadi Lunas → Diproses → Dikirim → Selesai.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 w-full">Selesai</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={cn('text-gray-500', bold && 'font-semibold text-gray-800')}>{label}</span>
      <span className={cn(bold ? 'font-bold text-brand-600' : 'text-gray-700')}>{value}</span>
    </div>
  );
}
