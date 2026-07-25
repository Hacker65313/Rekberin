'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { useToast } from '@/components/Toast';
import {
  type Store,
  type StoreCategory,
  PRODUCT_CATEGORIES,
  BANKS,
  EWALLETS,
} from '@/lib/types';

export default function InfoForm({ store }: { store: Store }) {
  const router = useRouter();
  const { push } = useToast();

  const [description, setDescription] = useState(store.description || '');
  const [logo, setLogo] = useState<string[]>(store.logo_url ? [store.logo_url] : []);
  const [banner, setBanner] = useState<string[]>(store.banner_url ? [store.banner_url] : []);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp || '');
  const [city, setCity] = useState(store.city || '');
  const [address, setAddress] = useState(store.address || '');
  const [category, setCategory] = useState<StoreCategory>(
    (store.category as StoreCategory) || 'Lainnya',
  );
  const [bankName, setBankName] = useState(store.bank_name || '');
  const [bankAccountName, setBankAccountName] = useState(store.bank_account_name || '');
  const [bankAccountNumber, setBankAccountNumber] = useState(store.bank_account_number || '');
  const [ewalletName, setEwalletName] = useState(store.ewallet_name || '');
  const [ewalletNumber, setEwalletNumber] = useState(store.ewallet_number || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('stores')
        .update({
          description,
          logo_url: logo[0] || null,
          banner_url: banner[0] || null,
          whatsapp,
          city,
          address,
          category,
          bank_name: bankName || null,
          bank_account_name: bankAccountName || null,
          bank_account_number: bankAccountNumber || null,
          ewallet_name: ewalletName || null,
          ewallet_number: ewalletNumber || null,
        })
        .eq('id', store.id);
      if (error) throw error;
      push('Informasi toko berhasil diperbarui!', 'success');
      router.push('/dashboard/store');
      router.refresh();
    } catch (err: any) {
      push(err?.message || 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/dashboard/store" className="btn-ghost mb-4 px-3 py-1.5 text-xs">
        ← Kembali ke Toko Saya
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Edit Informasi Toko</h1>
      <p className="mt-1 text-sm text-gray-500">
        Nama toko tidak bisa diubah di sini. Untuk mengubah nama, gunakan menu Edit Nama Toko.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kolom kiri - Info dasar */}
        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Nama Toko (tidak bisa diubah di sini)</label>
            <input className="input bg-gray-50" value={store.name} disabled />
            <p className="mt-1 text-xs text-gray-400">
              <Link href="/dashboard/store/name" className="text-brand-600 hover:underline">
                Klik di sini untuk mengubah nama toko →
              </Link>
            </p>
          </div>
          <div>
            <label className="label">Deskripsi Toko</label>
            <textarea
              className="input min-h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang toko Anda..."
            />
          </div>
          <div>
            <label className="label">Nomor WhatsApp</label>
            <input
              className="input"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Kota</label>
              <input
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta"
              />
            </div>
            <div>
              <label className="label">Kategori Utama</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as StoreCategory)}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Alamat Lengkap</label>
            <textarea
              className="input min-h-20"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
            />
          </div>
        </div>

        {/* Kolom kanan - Upload + pembayaran */}
        <div className="space-y-4">
          <div className="card p-5">
            <ImageUploader
              bucket="stores"
              folder={`store-${store.slug}/logo`}
              multiple={false}
              max={1}
              value={logo}
              onChange={setLogo}
              label="Logo Toko"
            />
          </div>
          <div className="card p-5">
            <ImageUploader
              bucket="stores"
              folder={`store-${store.slug}/banner`}
              multiple={false}
              max={1}
              value={banner}
              onChange={setBanner}
              label="Banner Toko"
            />
          </div>

          {/* Data Pembayaran - Bank */}
          <div className="card space-y-4 p-5">
            <div>
              <h3 className="text-sm font-bold text-gray-800">💳 Data Pembayaran — Bank</h3>
              <p className="mt-1 text-xs text-gray-500">
                Informasi rekening bank untuk pembayaran transfer.
              </p>
            </div>
            <div>
              <label className="label">Nama Bank</label>
              <select
                className="input"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
                <option value="">Pilih bank…</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Nama Pemilik Rekening</label>
              <input
                className="input"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="Nama sesuai buku rekening"
              />
            </div>
            <div>
              <label className="label">Nomor Rekening</label>
              <input
                className="input"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="1234567890"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Data Pembayaran - E-Wallet */}
          <div className="card space-y-4 p-5">
            <div>
              <h3 className="text-sm font-bold text-gray-800">📱 Data Pembayaran — E-Wallet</h3>
              <p className="mt-1 text-xs text-gray-500">
                Informasi dompet digital untuk pembayaran transfer.
              </p>
            </div>
            <div>
              <label className="label">Nama E-Wallet</label>
              <select
                className="input"
                value={ewalletName}
                onChange={(e) => setEwalletName(e.target.value)}
              >
                <option value="">Pilih e-wallet…</option>
                {EWALLETS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Nomor E-Wallet</label>
              <input
                className="input"
                value={ewalletNumber}
                onChange={(e) => setEwalletNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="08xxxxxxxxxx"
                inputMode="numeric"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={cn('btn-primary w-full', saving && 'opacity-60')}
          >
            {saving ? (
              <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              </svg>
            ) : 'Simpan Informasi'}
          </button>
        </div>
      </form>
    </div>
  );
}
